#!/usr/bin/env python

import multiprocessing as mp
import os
import signal
import sys
import time

# Internal
from kit.controller import Controller
import kit.env as env
from kit.logger import error, info

# Define the controller.
controller = Controller()

# Handle SIGNIT and close the controller.
def signal_handler(sig, frame):
    info('main', 'sigint')
    controller.stop()
    time.sleep(1)
    print 'Goodbye.'
    sys.exit(0)

# Main!
if __name__ == '__main__':
    signal.signal(signal.SIGINT, signal_handler)

    # Load the configuration dictionary.
    print 'info:main: loading .env file'
    env.load('.env')

    # Setup our controller object and start it.
    controller.setup()
    controller.start()

    # Wait for SIGINT.
    signal.pause()
