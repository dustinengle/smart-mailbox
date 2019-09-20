#!/usr/bin/env python

import os

class colors:
    CAT = '\033[1m'
    END = '\033[0m'
    ERROR = '\033[91m'
    INFO = '\033[92m'

# Error will print to screen and error message.
def error(category, text):
    print colors.ERROR+'error:'+colors.END+colors.CAT+category+': '+colors.END+text

# Info will only print if DEBUG=1 is set.
def info(category, text):
    if 'KIT_DEBUG' in os.environ and os.environ['KIT_DEBUG'] == '1':
        print colors.INFO+'info:'+colors.END+colors.CAT+category+': '+colors.END+text
