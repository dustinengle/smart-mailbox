
import config
import lora
import time

sync_word = 0x13

register = bytearray(config.OP_REGISTER_SIZE)
register[0] = config.OP_REGISTER
register[3] = sync_word

connect = bytearray(config.OP_CONNECT_SIZE)
connect[0] = config.OP_CONNECT

status = bytearray(config.OP_STATUS_SIZE)
status[0] = config.OP_STATUS

unlock = bytearray(config.OP_UNLOCK_SIZE)
unlock[0] = config.OP_UNLOCK

lock = bytearray(config.OP_LOCK_SIZE)
lock[0] = config.OP_LOCK

otp = bytearray(config.OP_OTP_SIZE)
otp[0] = config.OP_OTP

unauth = bytearray(config.OP_UNAUTH_SIZE)
unauth[0] = config.OP_UNAUTH

packets = [
    register,
    connect,
    status,
    unlock,
    lock,
    otp,
    unauth,
]
validations = [
    [config.OP_ACK, config.OP_ACK_SIZE],
    [config.OP_CONNECT, config.OP_CONNECT_SIZE],
    [config.OP_ACK, config.OP_ACK_SIZE],
    [config.OP_ACK, config.OP_ACK_SIZE],
    [config.OP_ACK, config.OP_ACK_SIZE],
    [config.OP_ACK, config.OP_ACK_SIZE],
    [config.OP_ACK, config.OP_ACK_SIZE],
]

def recv(index):
    if index == 0:
        print('TEST: setting sync word')
        lora.sync_word(sync_word)

    packet = lora.recv_wait()
    print('TEST: received packet', packet)

    valid = validations[index]
    if valid[0] != packet[0]:
        print('ERROR: invalid OP code', index, valid[0], packet[0])

def send(index):
    packet = packets[index]
    print('TEST: sending packet', packet)
    lora.send(packet)

if __name__ == '__main__':
    try:
        lora.init()

        index = 0
        while index < len(packets):
            send(index)
            recv(index)
            index += 1
            time.sleep(5)
    except KeyboardInterrupt:
        lora.close()
    except Exception as ex:
        print('Error:', ex)
