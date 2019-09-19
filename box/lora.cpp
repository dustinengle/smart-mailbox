
#include <LoRa.h>

#include "config.h"
#include "mailbox.h"

unsigned char key[] = SECRET_KEY;

int lora_init() {
    LoRa.setPins(LORA_SS_PIN, LORA_RST_PIN, LORA_DIO0_PIN);
    if (!LoRa.begin(LORA_FREQUENCY)) return E_LORA;

    LoRa.setSpreadingFactor(LORA_SPREADING);
    LoRa.setSyncWord(LORA_SYNC_WORD);
    return E_OK;
}

void print_packet(unsigned char *buffer, int size) {
    for (int i = 0; i < size; i++) {
        Serial.print(buffer[i], HEX);
        Serial.print(" ");
    }
    Serial.println();
}

int lora_handle(const uint8_t *data, int size) {
    uint8_t op = data[0];
    if (op >= OP_END) return E_LORA_OP_CODE;
    if (DEBUG) {
        Serial.print("LORA: recieved OP code ");
        Serial.println(op, HEX);
    }

    uint16_t pin;
    int result = E_OK;
    switch (op) {
        case OP_ACK:
            if (size != OP_ACK_SIZE) return E_LORA_MAX_SIZE;
            return E_OK;
        case OP_CONNECT:
            if (size != OP_CONNECT_SIZE) return E_LORA_MAX_SIZE;
            break;
        case OP_LOCK:
            if (size != OP_LOCK_SIZE) return E_LORA_MAX_SIZE;
            result = set_lock(LOCK_YES);
            break;
        case OP_OTP:
            if (size != OP_OTP_SIZE) return E_LORA_MAX_SIZE;
            pin = data[14] | (data[13] << 8);
            result = otp_set(pin);
            break;
        case OP_REGISTER:
            if (size != OP_REGISTER_SIZE) return E_LORA_MAX_SIZE;
            if (DEBUG) Serial.println("LORA: setting sync word");
            LoRa.setSyncWord((int)data[3]);
            break;
        case OP_STATUS:
            if (size != OP_STATUS_SIZE) return E_LORA_MAX_SIZE;
            break;
        case OP_TIME:
            if (size != OP_TIME_SIZE) return E_LORA_MAX_SIZE;
            break;
        case OP_UNAUTH:
            if (size != OP_UNAUTH_SIZE) return E_LORA_MAX_SIZE;
            pin = data[14] | (data[13] << 8);
            result = otp_del(pin);
            break;
        case OP_UNLOCK:
            if (size != OP_UNLOCK_SIZE) return E_LORA_MAX_SIZE;
            result = set_lock(LOCK_NO);
            break;
        default:
            return E_LORA_OP_CODE;
    }

    if (op == OP_CONNECT) {
        if (DEBUG) Serial.println("LORA: building CONNECT reply");
        unsigned char buffer[OP_CONNECT_SIZE] = {0};

        buffer[0] = OP_CONNECT;
        buffer[1] = get_flag();
        buffer[2] = get_lock();
        buffer[3] = get_package();
        buffer[4] = get_power();
        
        unsigned char hash[HASH_SIZE];
        get_hash(key, buffer, OP_CONNECT_SIZE, hash);
        for (int i = 0; i < HASH_SIZE; i++) {
            buffer[i + 5] = hash[i];
        }

        print_packet(buffer, OP_CONNECT_SIZE);
        result = lora_send(buffer, OP_CONNECT_SIZE);
    } else {
        if (DEBUG) Serial.println("LORA: building ACK reply");
        unsigned char buffer[OP_ACK_SIZE] = {0};

        buffer[0] = OP_ACK;

        unsigned char checksum[CHECKSUM_SIZE];
        get_checksum(key, buffer, OP_ACK_SIZE, checksum);
        for (int i = 0; i < CHECKSUM_SIZE; i++) {
            buffer[i + 1] = checksum[i];
        }
        
        buffer[9] = get_flag();
        buffer[10] = get_lock();
        buffer[11] = get_package();
        buffer[12] = get_power();
        buffer[13] = (uint8_t)result;
        
        print_packet(buffer, OP_ACK_SIZE);
        result = lora_send(buffer, OP_ACK_SIZE);
    }

    return result;
}

int lora_recv() {
    int size = LoRa.parsePacket();
    if (!size) return E_OK;
    if (DEBUG) {
        Serial.print("LORA: received packet ");
        Serial.println(size, DEC);
    }
    if (size > LORA_MAX_SIZE) return E_LORA_MAX_SIZE;

    uint8_t data[size] = {0};
    for (int i = 0; LoRa.available() && i < size; i++) {
        data[i] = (uint8_t)LoRa.read();
    }

    int result = lora_handle(data, size);
    return result;
}

int lora_send(unsigned char *buffer, size_t size) {
    if (DEBUG) {
        Serial.print("SEND: ");
        Serial.print(size, DEC);
        Serial.print(" ");
        Serial.write(buffer, size);
        Serial.println();
    }
    if (!LoRa.beginPacket()) return E_LORA_BEGIN_PACKET;

    size_t size_wrote = LoRa.write(buffer, size);
    if (size != size_wrote) return E_LORA_SIZE_WROTE;

    if (!LoRa.endPacket()) return E_LORA_END_PACKET;
    return E_OK;
}
