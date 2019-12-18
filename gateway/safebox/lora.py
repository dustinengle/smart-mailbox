
import config
from Crypto.Cipher import AES
import crypto
import PyLora
import struct
import time
import numbers
import os

iv = b'1212121212121212'

def close():
    PyLora.close()

def handle(packet):
    
    if(packet == None): return packet
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

def packet_check(packet):
    try:
        """
        packetCheck = bytearray(config.OP_STATUS_SIZE)
        packetCheck[0] = config.OP_STATUS
        packetCheck[1:9] = crypto.get_checksum(packetCheck)
        print(str(packetCheck[1:9])+' : '+str(packet[1:9]))
        if packet[1:9] == packetCheck[1:9]:
            return True
        return False
        """
        
        op = str(packet[0]).encode('hex')
        #op = bytes(packet[0]).encode('hex')
        size = 0
        print('op: ' + str(op))
        #print('opInt: ' + int(op))
        print('ACK: ' + str(config.OP_ACK))
        print('ACKHex: ' + str(config.OP_ACK).encode('hex'))

        if op == '0' + str(config.OP_ACK):
        #if op == bytes(config.OP_ACK):
            size = config.OP_ACK_SIZE
        elif op == '0' + str(config.OP_CONNECT):
        #elif op == bytes(config.OP_CONNECT):
            size = config.OP_CONNECT_SIZE
        elif op == '0' + str(config.OP_STATUS):
        #elif op == bytes(config.OP_STATUS):
            size = config.OP_STATUS_SIZE
        else:
            size = 0
        
        print ('Size: ' + str(size))
        
        if size != 0:
            """
            packetCheck = bytearray(size)
            i = 0
            while i < size:
                if i < 9 and i > 0:
                    i+=1
                else:
                    packetCheck[i] = packet[i]
                    i+=1
            
            check = crypto.get_checksum(packetCheck)
            print('Packet: ' + str(packet) + ' Check: ' + str(packetCheck) + ' Checksum: ' + str(check))
            
            if packet[1:9] == check:
                return True
            else:
                return False
            """
            return True
        else:
            return False     
    except:
        return False
        
        
def decrypt_packet(packet):
    i = 0
    for x in os.environ['GATE_PUB_KEYS'].split(','):
        try:
            print(x+' : '+x[16:32])
            aes = AES.new(x[16:32], AES.MODE_CBC, iv)
            decp = aes.decrypt(packet)
            print('ClearText: ' + str(decp).encode('hex'))
            check = packet_check(decp)
            if check:
                return decp, i
        except:
            print(x+' : '+x[16:32])
        i += 1
    return None, -1
    

def recv():
    PyLora.receive()
    if not PyLora.packet_available():
        return None, None

    packet = PyLora.receive_packet()
    print ('Packet: ' + str(packet).encode('hex'))
    decp, boxNum = decrypt_packet(packet)                
    
    #return handle(decp), boxNum
    return decp, boxNum

def recv_wait():
    PyLora.receive()
    while not PyLora.packet_available():
        time.sleep(0)

    packet = PyLora.receive_packet()
    return handle(packet)

def check_topic(msg):
    i = 0
    for x in os.environ['KIT_CHANNEL'].split(','):
        if 'channels/'+x+'/messages' == msg.get_topic():
            return i  
        i+=1
    return -1

def send(packet, boxNum):
    PyLora.idle()
    time.sleep(1)
    #pad and encrypt with box[0:16]
    print('Packet: ' + str(packet).encode('hex') + ' Packet length: ' + str(len(packet)) + ' Box: ' + str(boxNum))
    """
    i = len(packet)
    maxLen = 16
    while i > maxLen:
        maxLen *= 2
    while i < maxLen:
        #packet[i] = 0
        packet.append('0')
        i+=1
    """
    padding = get_padding(len(packet))
    pad_packet = bytearray(len(packet)+padding)
    i=0
    while i < len(packet):
        pad_packet[i] = packet[i]
        i+=1
    print('Packet: ' + str(pad_packet).encode('hex') + ' Packet length: ' + str(len(pad_packet)))
    key = os.environ['GATE_PUB_KEYS'].split(',')[boxNum]
    print ('Key: ' + key)
    aes = AES.new(key[:16], AES.MODE_CBC, iv)
    encd = aes.encrypt(pad_packet)
    print('Cipher: ' + encd.encode('hex') + ' ' + str(len(encd)))
    #decp, boxNum = decrypt_packet(encd)
    #print('ClearText: ' + decp.encode('hex') + ' Box: ' + str(boxNum))
    PyLora.send_packet(encd)

def get_padding(size):
    padding = 16-size%16
    if padding == 16:
        padding = 0
    return padding

def send_allow(boxNum, pin):
    padding = get_padding(config.OP_ALLOW_SIZE)
    packet = bytearray(config.OP_ALLOW_SIZE+padding)
    packet[0] = config.OP_ALLOW
    packet[1:9] = crypto.get_checksum(packet)
    packet[13:15] = struct.pack('>H', pin)
    send(packet, boxNum)

def send_deny(boxNum, pin):
    padding = get_padding(config.OP_DENY_SIZE)
    packet = bytearray(config.OP_DENY_SIZE+padding)
    packet[0] = config.OP_DENY
    packet[1:9] = crypto.get_checksum(packet)
    packet[13:15] = struct.pack('>H', pin)
    send(packet, boxNum)

def send_connect(boxNum, msg):
    padding = get_padding(config.OP_CONNECT_SIZE)
    packet = bytearray(config.OP_CONNECT_SIZE+padding)
    packet[0] = config.OP_CONNECT
    packet[5:] = crypto.get_hash(packet)
    send(packet, boxNum)

def send_lock(boxNum):
    padding = get_padding(config.OP_LOCK_SIZE)
    packet = bytearray(config.OP_LOCK_SIZE+padding)
    packet[0] = config.OP_LOCK
    packet[5:] = crypto.get_checksum(packet)
    send(packet, boxNum)

def send_register(boxNum):
    padding = get_padding(config.OP_REGISTER_SIZE)
    packet = bytearray(config.OP_REGISTER_SIZE+padding)
    packet[0] = config.OP_REGISTER
    packet[5:] = crypto.get_checksum(packet)
    send(packet, boxNum)

def send_status(boxNum):
    padding = get_padding(config.OP_STATUS_SIZE)
    packet = bytearray(config.OP_STATUS_SIZE+padding)
    packet[0] = config.OP_STATUS
    packet[1:9] = crypto.get_checksum(packet)
    send(packet, boxNum)

def send_unlock(boxNum):
    padding = get_padding(config.OP_UNLOCK_SIZE)
    packet = bytearray(config.OP_UNLOCK_SIZE+padding)
    packet[0] = config.OP_UNLOCK
    packet[5:] = crypto.get_checksum(packet)
    send(packet, boxNum)

def sync_word(word):
    PyLora.set_sync_word(word)
