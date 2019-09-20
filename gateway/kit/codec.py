#!/usr/bin/env python

import cPickle as pickle

from logger import error
from message import Message

separator = '||'

def decode(data):
    if not data or not isinstance(data, basestring):
        return None

    try:
        parts = data.split(separator, 1)
        msg = Message(parts[0], parts[1])
        return msg
    except Exception as ex:
        error('codec', 'decode error: '+str(ex))
        return None

def encode(msg):
    encoded = ''
    if not msg:
        return encoded

    try:
        encoded = msg.get_topic()+separator+msg.payload_str()
    except Exception as ex:
        error('codec', 'encode error: '+str(ex))

    return encoded
