#!/usr/bin/env python

import json
import os
import time

from logger import error, info
from util import JSON, RandomID

class Message():
    id = None
    payload = None
    topic = None

    def __init__(self, topic, payload):
        self.id = RandomID()
        self.payload = JSON(payload)
        self.time = time.time()
        self.topic = topic
        if not self.payload:
            error('message', 'init: unable to convert payload to object: '+str(payload))

    def __str__(self):
        return 'MSG: {} {}'.format(self.get_topic(), self.payload_str())

    def details(self):
        return 'ID: {}, Duration: {}, Topic: {}, Payload: {}'.format(self.id, self.get_duration(), self.get_topic(), self.payload_str())

    def for_device(self):
        deviceId = os.environ['KIT_DEVICE_ID']+'_'
        bn = self.get_base_name()

        return deviceId == bn

    def get_base_name(self):
        for js in self.payload:
            if 'bn' in js.keys():
                return js['bn']

        return None

    def get_bool(self):
        for js in self.payload:
            if 'vb' in js.keys():
                return js['vb']

        return None

    def get_duration(self):
        return time.time() - self.time

    def get_name(self):
        for js in self.payload:
            if 'n' in js.keys():
                return js['n']

        return None

    def get_payload(self):
        return self.payload

    def get_str(self):
        for js in self.payload:
            if 'vs' in js.keys():
                return js['vs']

        return None

    def get_topic(self):
        return self.topic

    def get_unit(self):
        for js in self.payload:
            if 'u' in js.keys():
                return js['u']

        return None

    def get_value(self):
        for js in self.payload:
            if 'v' in js.keys():
                return js['v']

        return None

    def is_valid(self):
        if not self.payload:
            return False

        return True

    def payload_str(self):
        return json.dumps(self.payload)
