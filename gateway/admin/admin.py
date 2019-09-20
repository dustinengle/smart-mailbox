#!/usr/bin/env python

from getpass import getpass
import os
from Queue import Queue
import sys
from threading import Thread
import time

# Load the parent directory if in local
# so we can access the kit module and update
# the .env file path.
envPath = '.env'
pwd = os.environ['PWD']
if '/admin' in pwd:
    envPath = '../.env'
    pwd = '../'
sys.path.insert(0, pwd)

# Import kit modules that we will use.
from kit.codec import decode, encode
from kit.crypto import decrypt, encrypt
from kit.env import load
from kit.file import read_file
from kit.message import Message
from kit.pubsub import get_message, publish, publish_raw, subscribe, unsubscribe

_channel = 'admin'
_cmds = {
    '1': 'Check the status of the starter kit account.',
    '2': 'Send a test message to the starter kit.',
    '3': 'Change the password for the starter kit.',
    '4': 'Transfer funds from the starter kit account to the user account.',
    '5': 'Merge the starter kit account with the user account, remaining balance will go back to the user account.',
    '6': 'Quit'
}
_password = ''
_password_change = False
_running = False
_topic = 'ADMIN'
_waiting = True

def ask_question(question):
    v = raw_input(question+' ')
    return v

def display_menu():
    print '\nMenu Options:'
    for i in range(1, 7):
        cmd = str(i)
        print cmd+'. '+_cmds[cmd]

def loop(q):
    _password_change = False
    display_menu()
    cmd = ask_question('\nEnter menu number:')

    if not cmd or cmd not in _cmds:
        print 'Invalid command!'
        return

    # Quit
    if cmd == "6":
        raise KeyboardInterrupt

    # Status
    if cmd == '1':
        _waiting = True
        msg = Message(_topic, [{'n': 'Admin', 'u': 'CMD', 'vs': 'Status'}])
        send(msg)
    # Test
    elif cmd == '2':
        _waiting = False
        result = ask_question('How many test messages would you like to send:')
        if not result:
            result = 1
        for i in range(int(result)):
            msg = Message(_topic, [{'bn': os.environ['KIT_DEVICE_ID']+'_', 'n': 'Admin', 'u': 'CMD', 'vs': 'Test_'+str(i)}])
            send(msg)
    # Password
    elif cmd == '3':
        _password_change = True
        _waiting = True
        pwd = getpass('Please provide a new password: ')
        pwd2 = getpass('Please confirm the password: ')
        if pwd != pwd2:
            print 'Passwords do not match!'
            return
        data = [{'n': 'Admin', 'u': 'CMD', 'vs': 'Password'}]
        data.append({'u': 'Password', 'vs': pwd})
        msg = Message(_topic, data)
        send(msg)
    # Transfer
    elif cmd == '4':
        result = ask_question('Please enter an amount to transfer:')
        if not result:
            print 'Amount not provided!'
            return
        amount = 0.0
        try:
            amount = float(result)
        except:
            print 'Amount is not valid!'
            return
        _waiting = False
        data = [{'n': 'Admin', 'u': 'CMD', 'vs': 'Transfer'}, {'n': 'Amount', 'u': 'Value', 'vs': result}]
        msg = Message(_topic, data)
        send(msg)
    # Merge
    elif cmd == '5':
        answer = ask_question('This will close the device account, are you sure? [y/n]:')
        if answer != 'y':
            print 'Account will not be merged!'
            return
        _waiting = False
        data = [{'n': 'Admin', 'u': 'CMD', 'vs': 'Merge'}]
        msg = Message(_topic, data)
        send(msg)

    start = time.time()
    while _waiting:
        if not q.empty():
            msg = q.get()
            print 'Response:', msg.get_str()

            # Change the local password if success.
            if _password_change:
                print 'You will need to restart the kit in order for the new password to take effect.'
                time.sleep(3)
                raise KeyboardInterrupt

            _waiting = False

        # If it has been over 5 seconds.
        if time.time() - start > 5:
            print 'Response: timeout'
            _waiting = False

        time.sleep(0.001)

def send(msg, channel=_channel):
    data = encrypt(encode(msg), _password)
    publish_raw(data, channel=channel)

def thread_run(q):
    def _handle(data):
        msg = decode(decrypt(data, _password))
        if msg.get_topic() != _topic:
            q.put(msg)

    subscribe(_handle, channel=_channel)

    while _running:
        get_message()
        time.sleep(0.1)

    unsubscribe()

if __name__ == '__main__':
    queue = Queue()
    thread = Thread(target=thread_run, args=(queue,))

    try:
        _password = getpass('Please provide your password: ')
        if not _password:
            raise Exception('Password not provided!')

        # Load the environment variables.
        load(envPath)

        # Try to verify the password by decrypting the secret
        # data.  If it encounters and error then an exception
        # will be raised and the script will quit.
        try:
            data = read_file(path=os.environ['KIT_SECRET_PATH'])
            decrypt(data, _password)
        except:
            raise Exception('Decryption of secret data failed, password incorrect!')

        # Start our message thread.
        thread.start()

        print 'Program is starting ... '
        print 'Press Ctrl-C to exit.\n'

        print 'Administration Area'

        _running = True
        _waiting = False
        while _running:
            loop(queue)
    except KeyboardInterrupt:
        pass
    except Exception as ex:
        print 'Error: '+str(ex)
    finally:
        print 'Starting shutdown...'
        _running = False
        _waiting = False
        if thread.is_alive():
            thread.join()
        print 'Goodbye.'
