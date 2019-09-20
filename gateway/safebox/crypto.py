
import config
import hashlib
from mbedtls import hmac

secret = bytes(config.SECRET_KEY).encode('ascii')

def get_checksum(packet, key=secret):
    hash = get_hash(packet, key)
    if config.DEBUG: print('checksum=', hash[:config.CHECKSUM_SIZE])
    return hash[:config.CHECKSUM_SIZE]

def get_hash(packet, key=secret):
    m = hmac.new(key, 'sha256')
    m.update(packet)
    hash = m.digest()
    if config.DEBUG: print('hash=', hash)
    return hash[:config.HASH_SIZE]
