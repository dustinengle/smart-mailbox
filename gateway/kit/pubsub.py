#!/usr/bin/env python

import redis
import sys

from codec import decode, encode
from logger import error, info

fns = {}

try:
    _channel = 'sensor'
    redis = redis.Redis(host='localhost', port=6379, db=1)
    pubsub = redis.pubsub(ignore_subscribe_messages=True)
except Exception as ex:
    error('pubsub', 'init error: '+str(ex))
    sys.exit(1)

def get_message():
    psm = pubsub.get_message()
    if psm:
        ch = psm['channel']
        info('pubsub', 'message: '+ch)
        if ch == 'admin':
            fns['admin'](psm['data'])
        else:
            msg = decode(psm['data'])
            fns[ch](msg)

def publish(msg, channel=_channel):
    if not msg:
        error('pubsub', 'publish error: undefined msg')
        return
    info('pubsub', 'publish: '+str(msg))

    try:
        data = encode(msg)
        redis.publish(channel, data)
    except Exception as ex:
        error('pubsub', 'publish error: '+str(ex))

def publish_raw(data, channel=_channel):
    if not data:
        error('pubsub', 'publish raw error: undefined data')
        return
    info('pubsub', 'publish raw: '+str(data))

    try:
        redis.publish(channel, data)
    except Exception as ex:
        error('pubsub', 'publish raw error: '+str(ex))

def subscribe(fn, channel=_channel):
    if not fn:
        error('pubsub', 'subscribe error: undefined fn')
        return
    info('pubsub', 'subscribe: '+str(fn))

    if not channel:
        channel = _channel

    fns[channel] = fn
    pubsub.subscribe([channel])

def unsubscribe():
    fns = {}
    pubsub.unsubscribe()
    pubsub.close()
