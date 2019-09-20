#!/usr/bin/env python

import argparse
from getpass import getpass
import os
import sys

# Add parent directory to path to import kit.
pwd = os.environ['PWD']
if '/tests' in pwd:
    pwd = '../'
sys.path.insert(0, pwd)

from kit.crypto import encrypt
from kit.file import write_file
from kit.logger import error
from sdk.keypair import Keypair

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='keypair arguments')
    parser.add_argument('--secret', default='', type=str, help='the secret key to use to create the secret.dat')
    args = parser.parse_args()

    if not args.secret:
        error('secret', 'please provide a --secret= value')
        sys.exit(1)

    try:
        password = getpass('Please provide your password: ')

        data = encrypt(args.secret, password)
        write_file(path='secret.dat', data=data)
    except Exception as ex:
        error('secret', 'save error: '+str(ex))
        sys.exit(1)
