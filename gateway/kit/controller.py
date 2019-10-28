#!/usr/bin/env python

import json
import multiprocessing as mp
import os
import time

from codec import decode, encode
from file import read_file_lines
from logger import error, info
from message import Message
from pubsub import get_message, subscribe, unsubscribe, publish, publish_raw
from receiver import Receiver
from sender import Sender
from signer import Signer

class Controller():
    def __init__(self):
        self.running = False

    def handle(self, msg):
        info('controller', 'handle: '+str(msg))

        try:
            name = msg.get_name()
            unit = msg.get_unit()
            if not name or not unit:
                return
            info('controller', 'name: '+name+', unit: '+unit)

            topic = msg.get_topic()
            if name == 'CONNECT' and unit == 'Requested' and msg.get_bool():
                self.signPipe.send(('CONNECT', topic, msg.get_bool()))
            elif name == 'REGISTER' and unit == 'Pub_Key':
                self.signPipe.send(('REGISTER', topic, msg.get_str()))
            elif not name in ['CONNECT', 'CONNECTED', 'REGISTER', 'REGISTERED', 'TX']:
                self.signPipe.send(('TX', topic, msg.payload))

            #################### Modify here to customize ########################
            """
            elif name == 'CustomCommand' and unit 'Custom' and msg.get_str():
                #alter msg to use case
                msg = self.customMethod()
                #send msg to device
                publish(msg)
            """
            ######################################################################

        except Exception as ex:
            error('controller', 'handle error: '+str(ex))

    def handle_admin(self, data):
        info('controller', 'handle admin: '+str(data))

        try:
            msg = self.signer.decrypt(data)
            if not msg:
                return

            name = msg.get_name()
            unit = msg.get_unit()
            if not name or not unit or name != 'Admin' or unit != 'CMD':
                return
            info('controller', 'name: '+name+', unit: '+unit)

            vs = msg.get_str()
            if vs == 'Merge':
                self.signPipe.send(('Merge', 'KIT', vs))
            elif vs == 'Status':
                self.signPipe.send(('Status', 'KIT', vs))
            elif vs == 'Password':
                payload = msg.get_payload()
                self.signPipe.send(('Password', 'KIT', payload[1]['vs']))
            elif vs == 'Test' or vs.startswith('Test_'):
                self.signPipe.send(('Test', 'KIT', msg.get_payload()))
            elif vs == 'Transfer':
                self.signPipe.send(('Transfer', 'KIT', msg.get_payload()))
        except Exception as ex:
            error('controller', 'handle admin error: '+str(ex))

    def setup(self, pw = None):
        info('controller', 'setup')
        self.receiver = Receiver()
        self.sender = Sender()
        self.signer = Signer(pw)

        info('controller', 'sender process')
        self.sendPipe, sendPipe = mp.Pipe()
        self.senderProcess = mp.Process(target=self.sender.start, name='sender', args=(sendPipe,))

        info('controller', 'signer process')
        self.signPipe, signPipe = mp.Pipe()
        self.signerProcess = mp.Process(target=self.signer.start, name='signer', args=(signPipe,))

        info('controller', 'receiver process')
        self.receivePipe, receivePipe = mp.Pipe()
        self.receiverProcess = mp.Process(target=self.receiver.start, name='receiver', args=(receivePipe,))

    def start(self):
        info('controller', 'start')
        try:
            self.senderProcess.start()
            self.signerProcess.start()
            self.receiverProcess.start()
        except Exception as ex:
            error('controller', 'start error: '+str(ex))
            self.senderProcess.terminate()
            self.signerProcess.terminate()
            self.receiverProcess.terminate()

            self.senderProcess.join()
            self.signerProcess.join()
            self.receiverProcess.join()
            return
        else:
            self.running = True

        # Wait for the processes to start.
        time.sleep(3)

        # Subscribe to admin and sensor data.
        info('controller', 'subscribe to admin and sensor data')
        subscribe(self.handle_admin, channel='admin')
        subscribe(self.handle, channel='sensor')

        # Start processing messages.
        info('controller', 'processing messages!')
        while self.running:
            # Check to make sure the signer is not finished with a return
            # message for the broker.
            if self.signPipe.poll():
                msg = self.signPipe.recv()
                info('controller', 'signer data: '+str(msg))

                # Send message if not a Kit message, those go to admin.
                if msg.get_topic() != 'KIT':
                    self.sendPipe.send(msg)
                # Handle Kit messages by sending to admin after encryption.
                else:
                    info('controller', 'admin message: '+str(msg))
                    data = self.signer.encrypt(msg)
                    info('controller', 'admin message: '+str(data))
                    publish_raw(data, channel='admin')

            # Check if the reciever has any data waiting and process.
            if self.receivePipe.poll():
                msg = self.receivePipe.recv()
                info('controller', 'receiver data: '+str(msg))
                self.handle(msg)

            get_message()
            time.sleep(0.001)

    def stop(self):
        info('controller', 'stop')
        self.running = False

        info('controller', 'stopping modules')
        self.receiver.stop()
        self.sender.stop()
        self.signer.stop()

        info('controller', 'terminating processes')
        self.receiverProcess.terminate()
        self.senderProcess.terminate()
        self.signerProcess.terminate()

        info('controller', 'unsubscribe from sensor data')
        unsubscribe()
