#!/usr/bin/env python

from getpass import getpass
import os
import sys
import time
import traceback

from codec import decode, encode
from crypto import decrypt, encrypt, hash
from file import is_file, read_file, rename, write_file
from logger import error, info
from stellar_base.address import Address
from stellar_base.builder import Builder
from stellar_base.horizon import horizon_livenet, horizon_testnet
from stellar_base.keypair import Keypair
from stellar_base.memo import HashMemo
from stellar_base.operation import CreateAccount
from stellar_base.transaction import Transaction
from stellar_base.transaction_envelope import TransactionEnvelope as TE

class Account():
    """The :class:`Account` handles the interaction between the blockchain
    and the internal components of the signer.  The Signer will actually
    inherit from this class.
    """
    address = ''
    connected = False
    network = 'TESTNET'
    password = ''
    path = ''
    registered = False
    seed = ''
    sequence = 0

    def __init__(self):
        info('account', 'init')
        self.id = os.environ['KIT_DEVICE_ID']
        self.path = os.environ['KIT_SECRET_PATH']
        self.network = os.environ['KIT_TESTNET'] == '1' and 'TESTNET' or 'PUBLIC'

        self.password = getpass('Please provide your password: ')

        # If the secret data does not exist we will set it up now.
        if not is_file(self.path):
            confirm = getpass('Please confirm your password: ')
            if self.password != confirm:
                error('account', 'init error: passwords do not match')
                sys.exit(1)
            else:
                self.new()

        print 'Ready.'

    def change_password(self, password):
        self.password = password
        self.file_save()

    def check(self):
        """Check to see if the account is valid by trying to load it from the API.
        """
        if self.connected and self.registered:
            return self.connected

        info('account', 'check')
        try:
            addr = Address(address=self.address, network=self.network)
            addr.get()

            self.connected = True
            self.registered = len(addr.signers) > 1
            self.sequence = int(addr.sequence)
            info('account', 'sequence: '+str(self.sequence))
        except Exception as ex:
            info('account', 'unable to find the account on the network, you might need to register this device')

        info('account', 'check: connected='+str(self.connected)+', registered='+str(self.registered))
        return self.connected

    def check_sequence(self):
        """Check and get the latest sequence number.
        """
        info('account', 'check_sequence')
        try:
            addr = Address(address=self.address, network=self.network)
            addr.get()

            self.sequence = int(addr.sequence)
            info('account', 'sequence: '+str(self.sequence))
        except Exception as ex:
            info('account', 'unable to find the account on the network, you might need to register this device')

    def decrypt(self, data):
        """Decrypt provided data with password and return msg.
        """
        info('account', 'decrypt: '+str(data))
        try:
            msg = decode(decrypt(data, self.password))
            return msg
        except Exception as ex:
            error('account', 'decrypt error: '+str(ex))
            return None

    def encrypt(self, msg):
        """Decrypt provided data with password and return msg.
        """
        info('account', 'encrypt: '+str(msg))
        try:
            data = encrypt(encode(msg), self.password)
            return data
        except Exception as ex:
            error('account', 'encrypt error: '+str(ex))
            return None

    def file_load(self):
        """Load the account information from the saved .dat file.

        """
        info('account', 'load')
        try:
            data = read_file(path=self.path)
            self.seed = decrypt(data, self.password)
            info('account', 'loaded secret: '+self.seed)

            kp = Keypair.from_seed(self.seed)
            self.address = kp.address().decode()
            info('account', 'load public address: '+self.address)

            self.check()
        except Exception as ex:
            traceback.print_exc()
            error('account', 'load error: '+str(ex))

    def file_save(self):
        """Save the local account information to .dat file.

        """
        info('account', 'save')
        if not self.seed or self.seed == '':
            error('account', 'save error: missing seed "'+self.seed+'"')
            return False

        try:
            info('account', 'password: '+self.password)
            data = encrypt(self.seed, self.password)
            write_file(path=self.path, data=data)
            return True
        except Exception as ex:
            error('account', 'save error: '+str(ex))
            return False

    def merge(self):
        """Merge the starter kit account into the user account.
        """
        info('account', 'merge')
        if not self.connected:
            error('account', 'merge error: account not connected')
            return ''
        elif not self.registered:
            error('account', 'merge error: account not registered')
            return ''

        xdr = ''
        self.check_sequence()

        try:
            # Load the account from the bridge.
            addr = Address(address=self.address, network=self.network)
            addr.get()

            # Get the account public key that is not ours from signers.
            pubKey = None
            for signer in addr.signers:
                if signer['public_key'] != self.address:
                    pubKey = signer['public_key']
                    break
            if not pubKey:
                raise Exception('unable to find user public key')
            info('account', 'merge to: '+str(pubKey))

            builder = Builder(
                secret=self.seed,
                network=self.network,
                sequence=self.sequence,
            )
            builder.append_account_merge_op(pubKey)
            builder.add_hash_memo(hash(self.id))
            builder.sign()

            xdr = builder.gen_xdr()

            # Rename the file so that the user knows it is empty.
            dst = self.path+'-MERGED-'+self.address[0:4]
            info('account', 'merge: file renamed to: '+str(dst))
            rename(self.path, dst)

            self.address = ''
            self.connected = False
            self.registered = False
            self.seed = ''

            # Setup a new account.
            if self.new():
                self.file_save()
        except Exception as ex:
            error('account', 'merge error: '+str(ex))

        return xdr

    def new(self):
        """Generate a new keypair.

        """
        info('account', 'new')
        success = True

        if not self.seed or self.seed == '':
            kp = Keypair.random()

            self.seed = kp.seed()
            self.address = kp.address().decode()
            self.file_save()

            info('account', 'load public address: '+self.address)
        else:
            error('account', 'new error: seed already set')

        return success

    def new_multi(self, publicKey):
        """Create a new multi-signature account using the local account
        information the user's account public key.

        :param str publicKey: The user account public key.

        """
        info('account', 'multi')
        if not self.connected:
            info('account', 'mulit error: account not connected')
            return False

        success = False

        try:
            info('account', 'multi: starting delay before submit')
            time.sleep(10)
            info('account', 'multi: continue from delay')

            builder = Builder(
                secret=self.seed,
                network=self.network,
                sequence=self.sequence,
            )
            builder.append_set_options_op(
                source=self.address,
                high_threshold=2,
                med_threshold=2,
                low_threshold=1,
                master_weight=1,
                signer_type='ed25519PublicKey',
                signer_weight=1,
                signer_address=publicKey,
            )
            builder.sign()
            builder.submit()

            success = True
        except Exception as ex:
            if 'op_bad_auth' in str(ex):
                success = True
                info('account', 'multi: this account is already setup for multisig')
            else:
                error('account', 'multi error: '+str(ex))

        self.registered = success
        return success

    def sign(self, data):
        """Sign the provided data and return the xdr envelope.

        :param str data: The SenML transaction.

        """
        info('account', 'sign')
        if not self.connected:
            error('account', 'sign error: account not connected')
            return ''
        elif not self.registered:
            error('account', 'sign error: account not registered')
            return ''

        xdr = ''
        self.check_sequence()

        try:
            builder = Builder(
                secret=self.seed,
                network=self.network,
                sequence=self.sequence,
            )
            builder.append_payment_op(self.address, os.environ['KIT_TX_FEE'])
            builder.add_hash_memo(hash(self.id + data))
            builder.sign()

            xdr = builder.gen_xdr()
        except Exception as ex:
            error('account', 'sign error: '+str(ex))

        return xdr

    def sign_multi(self, items):
        """Sign the provided data items and return the xdr envelopes.

        :param []str items: The SenML transaction.

        """
        info('account', 'sign')
        if not self.connected:
            error('account', 'sign multi error: account not connected')
            return ''
        elif not self.registered:
            error('account', 'sign multi error: account not registered')
            return ''

        self.check_sequence()
        sequence = int(self.sequence)

        xdrs = []

        try:
            for d in items:
                builder = Builder(
                    secret=self.seed,
                    network=self.network,
                    sequence=str(sequence),
                )
                builder.append_payment_op(self.address, os.environ['KIT_TX_FEE'])
                builder.add_hash_memo(hash(self.id + str(d)))
                builder.sign()

                xdr = builder.gen_xdr()
                xdrs.append(xdr)

                sequence += 1
        except Exception as ex:
            error('account', 'sign multi error: '+str(ex))

        return xdrs

    def transfer(self, value):
        """Create a transaction that sends all funds back to the user account.
        """
        info('account', 'transfer')
        if not self.connected:
            error('account', 'transfer error: account not connected')
            return ''
        elif not self.registered:
            error('account', 'transfer error: account not registered')
            return ''

        xdr = ''
        self.check_sequence()

        try:
            # Load the account from the bridge.
            addr = Address(address=self.address, network=self.network)
            addr.get()

            # Get the account public key that is not ours from signers.
            pubKey = None
            for signer in addr.signers:
                if signer['public_key'] != self.address:
                    pubKey = signer['public_key']
                    break
            if not pubKey:
                raise Exception('unable to find user public key')
            info('account', 'transfer to: '+str(pubKey))

            # Get the balance for the account.
            balance = None
            for bal in addr.balances:
                if bal['asset_type'] == 'native':
                    balance = bal['balance']
                    break
            if not balance:
                raise Exception('unable to find native balance')

            amount = float(balance) - value
            info('account', 'Begin Balance: '+balance+' - Amount: '+str(value)+' = End Balance: '+str(amount))
            if not amount or amount < 35.0:
                raise Exception('amount cannot be negative or less than minimum balance, consider doing a Merge back into your user account')

            builder = Builder(
                secret=self.seed,
                network=self.network,
                sequence=self.sequence,
            )
            builder.append_payment_op(pubKey, ("%.7f" % value))
            builder.add_hash_memo(hash(self.id+("%.7f" % value)))
            builder.sign()

            xdr = builder.gen_xdr()
        except Exception as ex:
            error('account', 'transfer error: '+str(ex))

        return xdr

