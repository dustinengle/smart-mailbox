#!/usr/bin/env python

import json
import os
from Queue import Queue
import time

from account import Account
from file import rename_file
from logger import error, info
from message import Message

class Signer(Account):
    def __init__(self, pw = None):
        Account.__init__(self, pw)

        info('signer', 'init')
        self.queue = Queue()
        self.running = False

    # Get the first channel from the kit channels and return
    # it in the form of a topic for the sender.
    def get_topic(self):
        topics = os.environ['KIT_CHANNEL'].split(',')
        return 'channels/'+topics[0]+'/messages'

    # Connect will handle the connect message and return
    # the data that will be forwarded to the broker to handle.
    def msg_connect(self):
        info('signer', 'connect')
        return json.dumps([{'bn': self.id+'_', 'n': 'CONNECTED', 'u': 'Pub_Key', 'vs': self.address}])

    # Merge account back into user account.
    def msg_merge(self):
        info('signer', 'merge')
        xdr = self.merge()
        if not xdr or xdr == '':
            return None

        ret = [{'bn': self.id+'_', 'n': 'TX', 'u': 'Envelope', 'vs': xdr}]
        return json.dumps(ret)

    # Set a new password the secret data.
    def msg_password(self, password):
        info('signer', 'password')
        info('signer', 'password: old='+self.password)
        if not rename_file(self.path, self.path+'.BAK'):
            info('signer', 'password error: unable to rename file')
        self.change_password(password)
        info('signer', 'password: new='+self.password)
        success = self.file_save()
        return json.dumps([{'n': 'Kit', 'u': 'Password', 'vs': str(success)}])

    # Register will output the register SenML format.
    def msg_register(self, publicKey):
        info('signer', 'register')
        success = self.new_multi(publicKey)
        if not success:
            return None
        return json.dumps([{'bn': self.id+'_', 'n': 'REGISTERED', 'u': 'Success', 'vb': success}])

    # Return a status message for the admin.
    def msg_status(self):
        info('signer', 'status')
        return json.dumps([{'n': 'Kit', 'u': 'Status', 'vs': 'Connected: '+str(self.connected)+', Registered: '+str(self.registered)}])

    # Transfer the local account funds to the user account.
    def msg_transfer(self, amount):
        info('signer', 'transfer')
        xdr = self.transfer(float(amount))
        if not xdr or xdr == '':
            return None

        ret = [{'bn': self.id+'_', 'n': 'TX', 'u': 'Envelope', 'vs': xdr}]
        return json.dumps(ret)

    # TX handler will sign the tx and return in correct format.
    def msg_tx(self, data):
        info('signer', 'tx')
        xdr = self.sign(str(data))
        if not xdr or xdr == '':
            return None

        ret = [{'bn': self.id+'_', 'n': 'TX', 'u': 'Envelope', 'vs': xdr}]
        for d in data:
            ret.append(d)

        return json.dumps(ret)

    # Batch tx handling.
    def msg_tx_batch(self, data):
        info('signer', 'tx batch')
        self.queue.put(data)
        return None

    # Start the signer.
    def start(self, pipe):
        info('signer', 'start')
        self.file_load() # Load the account information.

        self.pipe = pipe
        self.running = True

        cutOff = time.time() + 5 # Will be used batch txs.
        while self.running:
            # Handle queue messages by sending to account.
            if time.time() >= cutOff:
                # Check if we have anything in the queue.
                size = self.queue.qsize()
                if size > 50:
                    size = 50
                info('signer', 'batch queue size: '+str(size))
                if not self.queue.empty():
                    items = []
                    for i in range(size):
                        items.append(self.queue.get())
                    info('signer', 'batch run items: '+str(items))

                    topic = self.get_topic()
                    xdrs = self.sign_multi(items)
                    info('signer', 'batch run xdrs: '+str(xdrs))
                    for i in range(len(xdrs)):
                        payload = json.dumps([{'bn': self.id+'_', 'n': 'TX', 'u': 'Envelope', 'vs': xdrs[i]}] + items[i])
                        info('signer', 'batch run payload: '+payload)
                        self.pipe.send(Message(topic, payload))

                cutOff = time.time() + 5.0 # Batch every 5 seconds.

            # If the pipe is empty then loop back after a snooze.
            if not self.pipe.poll():
                time.sleep(0.1)
                continue

            (key, topic, value) = self.pipe.recv()
            info('signer', 'key: '+key+', topic: '+topic+', value: '+str(value))

            # Check the blockchain connected status for local account.
            self.check()

            payload = None
            # Hopefully return a CONNECTED message.
            if key == 'CONNECT':
                payload = self.msg_connect()
            # Merge the acocunt with the user account.
            elif key == 'Merge':
                payload = self.msg_merge()
                topic = self.get_topic()
                info('signer', 'merge topic: '+topic)
            # Handle the password change.
            elif key == 'Password':
                payload = self.msg_password(value)
            # Hopefully return a REGISTERED message.
            elif key == 'REGISTER' and self.connected and not self.registered:
                payload = self.msg_register(value)
            # Return a Status message.
            elif key == 'Status':
                payload = self.msg_status()
            # Transfer the local account balance to the user account.
            elif key == 'Test' and self.connected and self.registered:
                payload = self.msg_tx_batch(value)
                topic = self.get_topic()
                info('signer', 'test topic: '+topic)
            # Transfer the local account balance to the user account.
            elif key == 'Transfer':
                payload = self.msg_transfer(value[1]['vs'])
                topic = self.get_topic()
                info('signer', 'transfer topic: '+topic)
            # Hopefully return a TX message.
            elif key == 'TX' and self.connected and self.registered:
                payload = self.msg_tx_batch(value)

            # If no return value then skip response.
            info('signer', 'payload: '+str(payload))
            if payload == None or payload == '' or not payload:
                continue

            self.pipe.send(Message(topic, payload))

    # Stop the signer.
    def stop(self):
        info('signer', 'stop')
        self.running = False

        try:
            #self.pipe.close()
            pass
        except Exception as ex:
            error('signer', 'stop error: '+str(ex))
