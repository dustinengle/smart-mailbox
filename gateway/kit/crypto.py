#!/usr/bin/env python

import base64

from Crypto.Cipher import AES
from hashlib import sha256
from logger import error, info

# Decrypt data using password.
def decrypt(cipher, pw):
    aes = AES.new(hash(pw)[:32])
    text = str(cipher)
    info('decrypt', 'text: '+text)
    x = base64.decodestring(aes.decrypt(text).rstrip('\0'))
    info('decrypt', x)
    return x

# Encrypt data using password.
def encrypt(plain, pw):
    aes = AES.new(hash(pw)[:32])
    text = base64.encodestring(str(plain))
    info('decrypt', 'text: '+text)
    x = text + ((AES.block_size - len(text) % AES.block_size) * '\0')
    info('encrypt', x)
    return aes.encrypt(x)

# Hash data and return the hash.
def hash(data):
    x = sha256(str(data)).hexdigest()
    info('hash', x)
    return x
