#!/usr/bin/env python

import config
from Crypto.Cipher import AES
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

def get_channel(boxNum):
    channel = os.environ['KIT_CHANNEL']
    topics = []
    if isinstance(channel, basestring):
        topics = channel.split(',')
    return topics[boxNum]

def get_topic(boxNum):
    # Handle topics string or slice.
    channel = get_channel(boxNum)
    return 'channels/'+channel+'/messages'

def get_key(msg):
    boxChan = msg.get_topic().split('/')[1]
    print(boxChan)
    i = check_topic(msg)
    if i == -1:
        return ''
    key = os.environ["GATE_PUB_KEYS"].split(',')[i]
    return key

def handle(msg):
    def check_topic(topic):
        i = 0
        for x in os.environ['KIT_CHANNEL'].split(','):
            if i != 0 and x == topic.split('/')[1]:
                print ('xKey: ' + x + ' BoxNum: ' + str(i))
                return i  
            i+=1
        return -1
        
    try:
        info('handle', str(msg))
        #if msg.get_base_name() != base_name:
        #    return
            
        boxNum = check_topic(msg.get_topic())
        if(boxNum == -1):
            return

        name = msg.get_name()
        if name == 'AUTH':
            print('allow', name, str(msg))
            lora.send_allow(boxNum, msg.get_value())
        elif name == 'UNAUTH':
            print('deny', name, str(msg))
            lora.send_deny(boxNum, msg.get_value())
        elif name == 'LOCK':
            print('lock', name, str(msg))
            lora.send_lock(boxNum)
        elif name == 'STATUS':
            print('status', name, str(msg))
            lora.send_status(boxNum)
        elif name == 'UNLOCK':
            print('unlock', name, str(msg))
            lora.send_unlock(boxNum)
    except Exception as ex:
        error('handle', str(ex))

def loop():
    try:
        packet, boxNum = lora.recv()
        if not packet: return
        info('loop', 'recv packet {}'.format(lora.packet_str(packet)))

        base_name = '{}_'.format(get_channel(boxNum))
        data = []
        op = str(packet[0]).encode('hex')
        #op = packet[0]
        size = len(packet)
        if op == '0' + str(config.OP_ACK):
        #if op == config.OP_ACK:
            data.append({'bn': base_name, 'n': 'Flag', 'u': 'Flag', 'v': packet[9]})
            data.append({'n': 'Lock', 'u': 'Lock', 'v': packet[10]})
            data.append({'n': 'Package', 'u': 'Package', 'v': packet[11]})
            data.append({'n': 'Power', 'u': 'Power', 'v': packet[12]})
            data.append({'n': 'Error', 'u': 'Error', 'v': packet[13]})

            box_checksum = packet[1:9]
            info('loop', 'box checksum {}'.format(lora.packet_str(box_checksum)))
        elif op == '0' + str(config.OP_CONNECT):
        #elif op == config.OP_CONNECT:
            data.append({'bn': base_name, 'n': 'Flag', 'u': 'Flag', 'v': packet[0]})
            data.append({'n': 'Lock', 'u': 'Lock', 'v': packet[1]})
            data.append({'n': 'Package', 'u': 'Package', 'v': packet[2]})
            data.append({'n': 'Power', 'u': 'Power', 'v': packet[3]})
            data.append({'n': 'Error', 'u': 'Error', 'v': packet[4]})

            box_key = packet[5:]
            info('loop', 'box key {}'.format(lora.packet_str(box_key)))
        elif op == '0' + str(config.OP_STATUS):
        #elif op == config.OP_STATUS:
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

            lora.send(packet, boxNum)
            info('send', 'ACK {}'.format(lora.packet_str(packet)))

            msg = Message(get_topic(boxNum), data)
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

    #boxNum = box
    #print('Mailbox Number: ' boxNum)

    info('send', 'STATUS')
    packet = bytearray(config.OP_STATUS_SIZE)
    packet[0] = config.OP_STATUS
    packet[1:9] = crypto.get_checksum(packet)
    packet[9] = 1
    packet[10] = 1
    packet[11] = 1
    packet[12] = 1

    i = 0
    for x in os.environ['GATE_PUB_KEYS'].split(','):
        if i == 0:
            i+=1
        else:
            lora.send(packet, i)
            info('send', 'ACK {}'.format(lora.packet_str(packet)))
            i+=1

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

