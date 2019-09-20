#!/usr/bin/env python

import config
import crypto
import lora
import math
import os
import sys
import time

# Import data from the kit, must add local directory.
envPath = '.env'
pwd = os.environ['PWD']
if '/safebox' in pwd:
    envPath = '../.env'
    pwd = '../'
sys.path.insert(0, pwd)

import kit.env as env
from kit.message import Message
from kit.pubsub import get_message, subscribe, unsubscribe, publish

def destroy():
    unsubscribe()

def get_topic():
    # Handle topics string or slice.
    channel = os.environ['KIT_CHANNEL']
    topics = []
    if isinstance(channel, basestring):
        topics = channel.split(',')

    return 'channels/'+topics[0]+'/messages'

def handle(msg):
    try:
        print('Handle:', msg)

        #add custom msg handling
        #if msg.get_name() == 'CustomCommand' and msg.get_unit() 'Custom' and msg.get_str():
        #   global example = msg.get_str
    except Exception as ex:
        print(ex)

def loop():
    try:
        data = [{'bn':'Gateway_', 'n': 'TEST', 'u': 'Cel', 'v': 30.0}, {'u': 'V', 'v': 1.0}]
        msg = Message(get_topic(), data)
        print(msg)
        publish(msg)
    except:
        pass
    finally:
        time.sleep(1)

def setup():
    print('Program is starting ... ')
    print('Press Ctrl-C to exit.')

if __name__ == '__main__':
    setup()
    looping = True

    try:
        env.load(envPath)
        subscribe(fn=handle)

        while looping:
            get_message()
            loop()
    except KeyboardInterrupt:
        looping = False
        destroy()
