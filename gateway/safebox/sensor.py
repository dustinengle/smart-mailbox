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
from kit.crypto import decrypt, encrypt
from kit.file import read_file, write_file
from kit.logger import error, info
from kit.message import Message
from kit.pubsub import get_message, subscribe, unsubscribe, publish

def destroy():
    unsubscribe()
    lora.close()

def get_channel():
  channel = os.environ['KIT_CHANNEL']
  topics = []
  if isinstance(channel, basestring):
      topics = channel.split(',')
  return topics[0]

def get_topic():
    # Handle topics string or slice.
    channel = get_channel()
    return 'channels/'+channel+'/messages'

def handle(msg):
    try:
        info('handle', str(msg))
        #if msg.get_base_name() != base_name:
        #    return

        name = msg.get_name()
        if name == 'AUTH':
            print('allow', name, str(msg))
            lora.send_allow(msg.get_value())
        elif name == 'UNAUTH':
            print('deny', name, str(msg))
            lora.send_deny(msg.get_value())
        elif name == 'LOCK':
            print('lock', name, str(msg))
            lora.send_lock()
        elif name == 'STATUS':
            print('status', name, str(msg))
            lora.send_status()
        elif name == 'UNLOCK':
            print('unlock', name, str(msg))
            lora.send_unlock()
    except Exception as ex:
        error('handle', str(ex))

def loop():
    try:
        packet = lora.recv()
        if not packet: return
        info('loop', 'recv packet {}'.format(lora.packet_str(packet)))

        base_name = '{}_'.format(get_channel())
        data = []
        op = packet[0]
        size = len(packet)
        if op == config.OP_ACK:
            data.append({'bn': base_name, 'n': 'Flag', 'u': 'Flag', 'v': packet[9]})
            data.append({'n': 'Lock', 'u': 'Lock', 'v': packet[10]})
            data.append({'n': 'Package', 'u': 'Package', 'v': packet[11]})
            data.append({'n': 'Power', 'u': 'Power', 'v': packet[12]})
            data.append({'n': 'Error', 'u': 'Error', 'v': packet[13]})

            box_checksum = packet[1:9]
            info('loop', 'box checksum {}'.format(lora.packet_str(box_checksum)))
        elif op == config.OP_CONNECT:
            data.append({'bn': base_name, 'n': 'Flag', 'u': 'Flag', 'v': packet[0]})
            data.append({'n': 'Lock', 'u': 'Lock', 'v': packet[1]})
            data.append({'n': 'Package', 'u': 'Package', 'v': packet[2]})
            data.append({'n': 'Power', 'u': 'Power', 'v': packet[3]})
            data.append({'n': 'Error', 'u': 'Error', 'v': packet[4]})

            box_key = packet[5:]
            info('loop', 'box key {}'.format(lora.packet_str(box_key)))
        elif op == config.OP_STATUS:
            data.append({'bn': base_name, 'n': 'Flag', 'u': 'Flag', 'v': packet[9]})
            data.append({'n': 'Lock', 'u': 'Lock', 'v': packet[10]})
            data.append({'n': 'Package', 'u': 'Package', 'v': packet[11]})
            data.append({'n': 'Power', 'u': 'Power', 'v': packet[12]})

            box_checksum = packet[1:9]
            info('loop', 'box checksum {}'.format(lora.packet_str(box_checksum)))
        else:
            raise Exception('invalid OP packet {}'.format(op))

        if len(data) > 1:
            info('send', 'ACK')
            packet = bytearray(config.OP_ACK_SIZE)
            packet[0] = config.OP_ACK
            packet[1:9] = crypto.get_checksum(packet)
            packet[9] = 1
            packet[10] = 1
            packet[11] = 1
            packet[12] = 100
            packet[13] = config.E_OK

            lora.send(packet)
            info('send', 'ACK {}'.format(lora.packet_str(packet)))

            msg = Message(get_topic(), data)
            info('loop', 'message {}'.format(msg))
            publish(msg)
    except Exception as ex:
        error('loop', str(ex))
    finally:
        time.sleep(0)

def setup():
    print('Program is starting ... ')
    print('Press Ctrl-C to exit.')
    lora.init()

    info('send', 'STATUS')
    packet = bytearray(config.OP_STATUS_SIZE)
    packet[0] = config.OP_STATUS
    packet[1:9] = crypto.get_checksum(packet)
    packet[9] = 1
    packet[10] = 1
    packet[11] = 1
    packet[12] = 1

    lora.send(packet)
    info('send', 'ACK {}'.format(lora.packet_str(packet)))

if __name__ == '__main__':
    setup()
    looping = True

    try:
        env.load(envPath)
        subscribe(fn=handle, channel='inbound')

        while looping:
            get_message()
            loop()
    except KeyboardInterrupt:
        looping = False
        destroy()
