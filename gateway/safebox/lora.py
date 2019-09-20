
import config
import PyLora
import time

def close():
    PyLora.close()

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
        return

    packet = PyLora.receive_packet()
    return packet

def recv_wait():
    PyLora.receive()
    while not PyLora.packet_available():
        time.sleep(0)

    packet = PyLora.receive_packet()
    return packet

def send(packet):
    PyLora.send_packet(packet)

def sync_word(word):
    PyLora.set_sync_word(word)
