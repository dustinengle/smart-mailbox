#!/usr/bin/env python

import argparse
import os
import random
import sys
import time

# Add parent directory to path to import kit.
pwd = os.environ['PWD']
if '/tools' in pwd:
    pwd = '../'
sys.path.insert(0, pwd)

#from kit.codec import encode
#from kit.file import write_file
from kit.message import Message
from kit.pubsub import publish

topic = None

def start(limit, sleep):
    print 'START'

    if not topic:
        print 'Missing topic!'
        sys.exit(1)

    i = 0
    running = True
    while i < limit:
        data = [{'bn': 'test_', 'n': 'sensor', 'u': 'V', 'v': i}]
        msg = Message(topic, data)
        print msg
        publish(msg)

        time.sleep(sleep)
        i = i + 1

def stop():
	print 'STOP'

if __name__ == "__main__":
    try:
        parser = argparse.ArgumentParser(description='sensor arguments')
        parser.add_argument('--channel', default='', type=str, help='the channel to test on')
        parser.add_argument('--limit', default=1, type=int, help='how many requests to make')
        parser.add_argument('--sleep', default=1, type=float, help='how many seconds to sleep between requests')
        args = parser.parse_args()

        if not args.channel:
            print 'Please provide a channel.'
            sys.exit(1)

        print args
        topic = 'channels/'+args.channel+'/messages'

        start(args.limit, args.sleep)
    except KeyboardInterrupt:  # Ctrl+C captured, exit
        stop()
