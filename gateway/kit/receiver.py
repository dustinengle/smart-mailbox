#!/usr/bin/env python

import json
import os
from Queue import Queue
import random
import time

from logger import error, info
from mqtt import MQTT

class Receiver():
    def __init__(self):
        info('receiver', 'init')
        self.queue = Queue()
        self.mqtt = MQTT(os.environ['KIT_CHANNEL'], client_id='receiver-mqtt', queue=self.queue)
        self.running = False

    # Start the signer.
    def start(self, pipe):
        info('receiver', 'start')
        self.mqtt.connect(os.environ['KIT_MQTT_HOST'], int(os.environ['KIT_MQTT_PORT']), os.environ['KIT_DEVICE_ID'], os.environ['KIT_DEVICE_KEY'])
        while not self.mqtt.connected:
            info('receiver', 'waiting for connection')
            time.sleep(1)
        info('receiver', 'connected')

        self.pipe = pipe
        self.running = True

        while self.running:
            # Check the queue for a received message.
            msg = self.queue.get()

            # If for this device then pass to controller.
            if msg.is_valid() and msg.for_device():
                info('receiver', 'queue: '+str(msg))
                self.pipe.send(msg)

    # Stop the signer.
    def stop(self):
        info('receiver', 'stop')
        self.running = False

        try:
            self.mqtt.disconnect()
            #self.pipe.close()
        except Exception as ex:
            error('receiver', 'stop error: '+str(ex))
