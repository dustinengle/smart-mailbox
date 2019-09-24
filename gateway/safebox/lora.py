
import config
import crypto
import PyLora
import struct
import time

def close():
    PyLora.close()

def handle(packet):
    op = packet[0]
    size = len(packet)

    if op == config.OP_ACK:
        if size != config.OP_ACK_SIZE:
            raise Exception('invalid ACK packet size {}'.format(size))
    elif op == config.OP_CONNECT:
        if size != config.OP_CONNECT_SIZE:
            raise Exception('invalid CONNECT packet size {}'.format(size))
    elif op == config.OP_STATUS:
        if size != config.OP_STATUS_SIZE:
            raise Exception('invalid STATUS packet size {}'.format(size))
    else:
        raise Exception('invalid OP packet {}'.format(op))

    return packet

def init():
    PyLora.set_pins(cs_pin=config.LORA_SS_PIN, rst_pin=config.LORA_RST_PIN, irq_pin=config.LORA_DIO0_PIN)
    PyLora.init()
    PyLora.set_spreading_factor(config.LORA_SPREADING)
    PyLora.set_preamble_length(config.LORA_PREAMBLE)
    PyLora.set_frequency(config.LORA_FREQUENCY)
    PyLora.set_sync_word(config.LORA_SYNC_WORD)

def packet_str(packet):
    s = ''
    for b in packet:
        s += str(b)
    return s

def recv():
    PyLora.receive()
    if not PyLora.packet_available():
        return None

    packet = PyLora.receive_packet()
    return handle(packet)

def recv_wait():
    PyLora.receive()
    while not PyLora.packet_available():
        time.sleep(0)

    packet = PyLora.receive_packet()
    return handle(packet)

def send(packet):
    PyLora.idle()
    time.sleep(1)
    PyLora.send_packet(packet)

def send_allow(pin):
    packet = bytearray(config.OP_ALLOW_SIZE)
    packet[0] = config.OP_ALLOW
    packet[1:9] = crypto.get_checksum(packet)
    packet[13:15] = struct.pack('>H', pin)
    send(packet)

def send_deny(pin):
    packet = bytearray(config.OP_DENY_SIZE)
    packet[0] = config.OP_DENY
    packet[1:9] = crypto.get_checksum(packet)
    packet[13:15] = struct.pack('>H', pin)
    send(packet)

def send_connect():
    packet = bytearray(config.OP_CONNECT_SIZE)
    packet[0] = config.OP_CONNECT
    packet[5:] = crypto.get_hash(packet)
    send(packet)

def send_lock():
    packet = bytearray(config.OP_LOCK_SIZE)
    packet[0] = config.OP_LOCK
    packet[5:] = crypto.get_checksum(packet)
    send(packet)

def send_register():
    packet = bytearray(config.OP_REGISTER_SIZE)
    packet[0] = config.OP_REGISTER
    packet[5:] = crypto.get_checksum(packet)
    send(packet)

def send_status():
    packet = bytearray(config.OP_STATUS_SIZE)
    packet[0] = config.OP_STATUS
    packet[1:9] = crypto.get_checksum(packet)
    send(packet)

def send_unlock():
    packet = bytearray(config.OP_UNLOCK_SIZE)
    packet[0] = config.OP_UNLOCK
    packet[5:] = crypto.get_checksum(packet)
    send(packet)

def sync_word(word):
    PyLora.set_sync_word(word)
