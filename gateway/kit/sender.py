#!/usr/bin/env python

import os
import time

from logger import error, info
from mqtt import MQTT

class Sender():
    def __init__(self):
        info('sender', 'init')
        self.mqtt = MQTT('channels/'+os.environ['KIT_CHANNEL']+'/messages', client_id='sender-mqtt')
        self.running = False

    # Start the signer but wait for the mqtt client to be ready.
    def start(self, pipe):
        info('sender', 'start')
        self.mqtt.connect(os.environ['KIT_MQTT_HOST'], int(os.environ['KIT_MQTT_PORT']), os.environ['KIT_DEVICE_ID'], os.environ['KIT_DEVICE_KEY'])
        while not self.mqtt.connected:
            info('sender', 'waiting for connection')
            time.sleep(1)
        info('sender', 'connected')

        self.pipe = pipe
        self.running = True

        while self.running:
            msg = self.pipe.recv()
            info('sender', 'data: '+str(msg))

            try:
                self.mqtt.publish(msg)
            except Exception as ex:
                error('sender', 'publish error: '+str(ex))

    # Stop the signer.
    def stop(self):
        info('sender', 'stop')
        self.running = False

        try:
            self.mqtt.disconnect()
            #self.pipe.close()
        except Exception as ex:
            error('sender', 'stop error: '+str(ex))
