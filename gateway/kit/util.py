#!/usr/bin/env python

import json
import random
import string
import subprocess

from logger import error, info

# Get the machine id and return.
def ID():
    id = subprocess.check_output(['cat', '/var/lib/dbus/machine-id'])
    return id.rstrip('\n')

# Parse json data and return the resulting object.
def JSON(data):
    info('util.JSON', str(data))
    js = None

    if not isinstance(data, basestring):
        data = json.dumps(data)

    try:
        js = json.loads(data)
    except Exception as ex:
        #error('json', 'json format error: '+str(ex))
        js = None

    return js

# Generate a random string and return.
def RandomID():
    return ''.join(random.choice(string.ascii_letters+string.digits) for x in range(16))
