
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

int lora_handle(const uint8_t *data, int size) {
    uint8_t op = data[0];
    if (op >= OP_END) return E_LORA_OP_CODE;

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
            pin = data[15] | (data[14] << 8);
            result = otp_set(pin);
            break;
        case OP_REGISTER:
            if (size != OP_REGISTER_SIZE) return E_LORA_MAX_SIZE;
            LoRa.setSyncWord((int)data[1]);
            break;
        case OP_STATUS:
            if (size != OP_STATUS_SIZE) return E_LORA_MAX_SIZE;
            break;
        case OP_TIME:
            if (size != OP_TIME_SIZE) return E_LORA_MAX_SIZE;
            break;
        case OP_UNAUTH:
            if (size != OP_UNAUTH_SIZE) return E_LORA_MAX_SIZE;
            pin = data[15] | (data[14] << 8);
            result = otp_del(pin);
            break;
        case OP_UNLOCK:
            if (size != OP_UNLOCK_SIZE) return E_LORA_MAX_SIZE;
            result = set_lock(LOCK_NO);
            break;
        default:
            return E_LORA_OP_CODE;
    }

    unsigned char *buffer_p;
    int buffer_size;
    if (op == OP_CONNECT) {
        if (DEBUG) Serial.println("LORA: building CONNECT reply");
        buffer_size = OP_CONNECT_SIZE;
        unsigned char buffer[buffer_size] = {0};
        buffer_p = buffer;

        buffer[0] = OP_CONNECT;
        buffer[1] = get_flag();
        buffer[2] = get_lock();
        buffer[3] = get_package();
        buffer[4] = get_power();
        
        unsigned char hash[HASH_SIZE];
        get_hash(key, buffer, buffer_size, hash);
        for (int i = 0; i < HASH_SIZE; i++) {
            buffer[4 + 1] = hash[i];
        }
    } else {
        if (DEBUG) Serial.println("LORA: building ACK reply");
        buffer_size = OP_ACK_SIZE + 1;
        unsigned char buffer[buffer_size] = {0};
        buffer_p = buffer;

        buffer[0] = OP_ACK;
        buffer[9] = get_flag();
        buffer[10] = get_lock();
        buffer[11] = get_package();
        buffer[12] = get_power();
        buffer[13] = result;

        unsigned char checksum[CHECKSUM_SIZE];
        get_checksum(key, buffer, buffer_size, checksum);
        for (int i = 0; i < CHECKSUM_SIZE; i++) {
            buffer[i + 1] = checksum[i];
        }
    }
    if (DEBUG) {
        Serial.print("BUFFER: ");
        Serial.print(buffer_size, DEC);
        Serial.print(" ");
        Serial.write(buffer_p, buffer_size);
        Serial.println();
    }

    if(lora_send(buffer_p, buffer_size)) return E_LORA_SEND;
    return E_OK;
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
