#!/usr/bin/env python

import os
import sys

from file import read_file_lines
from logger import error

# Load key=value file into environment variables.
def load(path):
    try:
        # Read line by line and process into environment variables.
        lines = read_file_lines(path, truncate=False)
        for line in lines:
            ps = line.split('=', 1)
            os.environ[ps[0]] = ps[1].rstrip()
    except:
        error('env', 'unable to open "'+path+'" file.')
        sys.exit(1)
