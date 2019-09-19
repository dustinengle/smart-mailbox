
import PyLora
import time

# Config
cs = 25
rst = 17
irq = 4
spreading = 7
preamble = 8
frequency = 915000000
sync_word = 0x12

running = True
timeout = time.time() + 5

def close():
    print('Stopping...')
    running = False
    PyLora.close()

def init():
    PyLora.set_pins(cs_pin=cs, rst_pin=rst, irq_pin=irq)
    PyLora.init()
    PyLora.set_spreading_factor(spreading)
    PyLora.set_preamble_length(preamble)
    PyLora.set_frequency(frequency)
    PyLora.set_sync_word(sync_word)

def recv():
    packet = PyLora.receive_packet()
    op = packet[0]
    checksum = packet[1:9]
    flag = packet[9]
    lock = packet[10]
    package = packet[11]
    power = packet[12]
    result = packet[13]
    print('Recv:', op, checksum, flag, lock, package, power, result)

def send():
    PyLora.tx()
    packet = bytearray([6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 100])
    PyLora.send_packet(packet)
    print('Sent:', packet.decode())

if __name__ == '__main__':
    try:
        print('Initializing...')
        init()

        print('Starting...')
        while running:
            try:
                PyLora.receive()
                if PyLora.packet_available():
                    recv()

                t = time.time()
                if timeout <= t:
                    send()
                    timeout = time.time() + 5
            except KeyboardInterrupt:
                print('Stopping...')
                close()
                exit(0)
    except Exception as ex:
        print('Error:', ex)
