
import config
import PyLora
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
    PyLora.send_packet(packet)

def sync_word(word):
    PyLora.set_sync_word(word)
