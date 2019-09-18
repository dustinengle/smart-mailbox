
import PyLora
import time

cs = 25
rst = 17
irq = 4
spreading = 7
preamble = 8
frequency = 915000000
sync_word = 0x12

PyLora.set_pins(cs_pin=cs, rst_pin=rst, irq_pin=irq)
PyLora.init()
PyLora.set_spreading_factor(spreading)
PyLora.set_preamble_length(preamble)
PyLora.set_frequency(frequency)
PyLora.set_sync_word(sync_word)

while True:
    PyLora.receive()
    while not PyLora.packet_available():
        time.sleep(0)
    rec = PyLora.receive_packet()
    print('Recv: {}'.format(rec))
    PyLora.send_packet(rec)
