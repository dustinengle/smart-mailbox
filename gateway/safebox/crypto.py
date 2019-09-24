
import config
import hashlib
import hmac

secret = bytes(config.SECRET_KEY).encode('ascii')

def get_checksum(packet, key=secret):
    hash = get_hash(packet, key)
    return hash[:config.CHECKSUM_SIZE]

def get_hash(packet, key=secret):
    m = hmac.new(key, digestmod=hashlib.sha256)
    m.update(packet)
    hash = m.digest()
    return hash[:config.HASH_SIZE]
