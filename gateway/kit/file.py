#!/usr/bin/env python

from fcntl import flock, LOCK_EX, LOCK_UN
from os import remove, rename
from os.path import isfile

# Delete the file provided if it exists.
def delete_file(path=None):
    if not path or not is_file(path):
        return False

    remove(path)
    return True

# Check if a file exists.
def is_file(path=None):
    if not path:
        return False

    return isfile(path)

# Read the whole contents of the file.
def read_file(path=None):
    if not path:
        return False

    # If file doesn't exist then we create it.
    if not is_file(path):
        open(path, 'a').close()

    ret = None
    with open(path, 'r') as f:
        flock(f, LOCK_EX)
        ret = f.read()
        flock(f, LOCK_UN)

    return ret

# Read the lines into a slice and return.
def read_file_lines(path=None, truncate=True):
    if not path:
        return False

    # If file doesn't exist then we create it.
    if not is_file(path):
        open(path, 'a').close()

    ret = []
    with open(path, 'r+') as f:
        flock(f, LOCK_EX)
        ret = f.readlines()
        if truncate:
            f.truncate(0)
        flock(f, LOCK_UN)

    return ret

# Rename file from path to new name.
def rename_file(src=None, dst=None):
    if not src or not dst or not is_file(src):
        return False

    rename(src, dst)
    return True

# Write the provided data to the file by appending.
def write_file(path=None, data=None):
    if not path or not data:
        return False

    with open(path, 'a') as f:
        flock(f, LOCK_EX)
        f.write(data)
        flock(f, LOCK_UN)
    return True
