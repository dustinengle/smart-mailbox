
import lora
import time

running = True
timeout = time.time() + 10

def close():
    print('Stopping...')
    running = False
    lora.close()

def init():
    lora.init()

def recv():
    lora.recv()

def send():
    packet = bytearray([6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 100])
    lora.send(packet)

if __name__ == '__main__':
    try:
        print('Initializing...')
        init()

        print('Starting...')
        while running:
            try:
                recv()

                t = time.time()
                if timeout <= t:
                    send()
                    timeout = time.time() + 10
            except KeyboardInterrupt:
                print('Stopping...')
                close()
                exit(0)
    except Exception as ex:
        print('Error:', ex)
