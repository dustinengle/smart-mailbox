
#include <LoRa.h>

#include "config.h"
#include "mailbox.h"

unsigned char gw_key[HASH_SIZE] = {0};
bool gw_key_loaded = false;
unsigned char key[HASH_SIZE] = {0};
bool key_loaded = false;

//extern byte aes_iv[16];

void print_packet(unsigned char *buffer, int size) {
    for (int i = 0; i < size; i++) {
        Serial.print(buffer[i], HEX);
        Serial.print(" ");
    }
    Serial.println();
}

int lora_init() {
    int error = load_gw_key(gw_key);
    if (!error) {
        gw_key_loaded = true;
        if (DEBUG) {
            Serial.print("LORA: loaded key ");
            print_packet(gw_key, HASH_SIZE);
        }
    }

    error = load_key(key);
    if (!error) {
        key_loaded = true;
        if (DEBUG) {
            Serial.print("LORA: loaded key ");
            print_packet(key, HASH_SIZE);
        }
    } else {
        unsigned char secret[] = SECRET_KEY;
        int size = sizeof(SECRET_KEY);
        if (size > HASH_SIZE) size = HASH_SIZE;
        memcpy(key, secret, size);
        if (DEBUG) {
            Serial.print("LORA: loaded secret ");
            print_packet(key, HASH_SIZE);
        }
    }

    LoRa.setPins(LORA_SS_PIN, LORA_RST_PIN, LORA_DIO0_PIN);
    //LoRa.setSPIFrequency(1e6);
    if (!LoRa.begin(LORA_FREQUENCY)) return E_LORA;

    LoRa.setSpreadingFactor(LORA_SPREADING);
    LoRa.setSyncWord(LORA_SYNC_WORD);
    return E_OK;
}

int lora_handle(const uint8_t *data, int size) {
    uint8_t op = data[0];
    //if (op >= OP_END) return E_LORA_OP_CODE;

    uint16_t pin = 0;
    int result = E_OK;
    switch (op) {
        case OP_ACK:
            //if (size != OP_ACK_SIZE) return E_LORA_MAX_SIZE;
            return E_OK;
        case OP_ALLOW:
            //if (size != OP_ALLOW_SIZE) return E_LORA_MAX_SIZE;
            pin = (data[13] << 8) | data[14];
            result = allow_set(String(pin));
            break;
        case OP_CONNECT:
            //if (size != OP_CONNECT_SIZE) return E_LORA_MAX_SIZE;
            break;
        case OP_DENY:
            //if (size != OP_DENY_SIZE) return E_LORA_MAX_SIZE;
            pin = (data[13] << 8) | data[14];
            result = allow_del(String(pin));
            break;
        case OP_LOCK:
            Serial.println("lock check");
            //if (size != OP_LOCK_SIZE) return E_LORA_MAX_SIZE;
            Serial.println("lock pass");
            result = set_lock(LOCK_YES);
            break;
        case OP_REGISTER:
            //if (size != OP_REGISTER_SIZE) return E_LORA_MAX_SIZE;
            if (DEBUG) Serial.println("LORA: setting sync word");
            LoRa.setSyncWord((int)data[3]);
            break;
        case OP_STATUS:
            //if (size != OP_STATUS_SIZE) return E_LORA_MAX_SIZE;
            break;
        case OP_TIME:
            //if (size != OP_TIME_SIZE) return E_LORA_MAX_SIZE;
            break;
        case OP_UNLOCK:
            //if (size != OP_UNLOCK_SIZE) return E_LORA_MAX_SIZE;
            result = set_lock(LOCK_NO);
            break;
        default:
            return E_LORA_OP_CODE;
    }

    if (op == OP_CONNECT) {
        //if (!gw_key_loaded) {
            if (DEBUG) Serial.println("LORA: saving new gw key");
            result = save_gw_key(gw_key);
            if (result) return result;
        //}

        if (DEBUG) Serial.println("LORA: building CONNECT reply");
        unsigned char buffer[OP_CONNECT_SIZE] = {0};

        buffer[0] = OP_CONNECT;
        buffer[1] = get_flag();
        buffer[2] = get_lock();
        buffer[3] = get_package();
        buffer[4] = get_power();

        // SECRET_KEY will be used as the initial hash value
        // with remaining checksums using the hash of it.
        if (!key_loaded) get_hash(key, buffer, OP_CONNECT_SIZE, key);
        for (int i = 0; i < HASH_SIZE; i++) {
            buffer[i + 5] = key[i];
        }

        if (!key_loaded) {
            result = save_key(key);
            if (result) return result;
        }

        if (DEBUG) print_packet(buffer, OP_CONNECT_SIZE);
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

        if (DEBUG) print_packet(buffer, OP_ACK_SIZE);
        result = lora_send(buffer, OP_ACK_SIZE);
    }

    return result;
}

int lora_recv() {
    int size = LoRa.parsePacket();
    if (!size) return E_OK;
    if (DEBUG) {
        Serial.println();
        Serial.print("LORA: received packet ");
        Serial.println(size, DEC);
        Serial.println("LORA: RSSI ");
        Serial.println(LoRa.packetRssi());
    }
    //if (size > LORA_MAX_SIZE) return E_LORA_MAX_SIZE;

    Serial.println("recv check");
    uint8_t data[size] = {0};
    for (int i = 0; LoRa.available() && i < size; i++) {
        data[i] = (uint8_t)LoRa.read();
    }

    Serial.print("Data: "); Serial.write((uint8_t *)data, sizeof(data)); Serial.println("");
    print((char*)data,size);

    /*
    char msg[size];
    for (int i = 0; i<size; i++) {
      msg[i] = (char)data[i];
    }
    
    char msg[BLOCK_SIZE];
    memset(msg, 0, BLOCK_SIZE);
    sprintf(msg, "%s", data);
    */
    //print(msg, size);
    /*
    uint8_t msg_data[] = {0x07, 0xc6, 0xa7, 0x85, 0x80, 0x38, 0x40, 0xee, 0x28, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00};
    char testmsg[BLOCK_SIZE];
    memset(testmsg, 0, BLOCK_SIZE);
    sprintf(testmsg, "%s", msg_data);
    Serial.print("MESSAGE: "); Serial.println(testmsg);
    
    unsigned char cipher[BLOCK_SIZE];
    encrypt(cipher, testmsg, BLOCK_SIZE);
    Serial.print("ENCRYPT: "); print((char *)cipher, BLOCK_SIZE);
    */
    
    unsigned char cleartxt[size];
    unsigned char iv[] = "1212121212121212";
    decrypt(cleartxt,(char*) data, size);
    Serial.print("DECRYPT: "); Serial.write((uint8_t *)cleartxt, BLOCK_SIZE); Serial.println("");
    print((char*)cleartxt, sizeof(cleartxt));

    if (DEBUG) print_packet(cleartxt, sizeof(cleartxt));
    int result = lora_handle(cleartxt, sizeof(cleartxt));
    return result;
}

int get_padding(int size) {
    int padding = 16-size%16;
    if(padding == 16){
        padding = 0;
    }
    return padding;
}
int lora_send(unsigned char *buffer, int size) {
    if (!LoRa.beginPacket()) return E_LORA_BEGIN_PACKET;
    
    int padding = get_padding(size) + size;
    char msg[padding];
    memset(msg, 0, padding);
    memcpy(msg, buffer, size);
    Serial.print("Message: "); Serial.println((char*)buffer);
    Serial.print("MessagePad: "); Serial.println(msg);
    Serial.print("MessagePadHex: "); print(msg,padding);
    Serial.print("Padding: "); Serial.print(padding, DEC); Serial.print(" Size: "); Serial.println(size, DEC);
    Serial.print("MessageSize: "); Serial.println(sizeof(msg), DEC);

    
    //encrypt buffer with key[15:]
    unsigned char cipher[padding];
    //unsigned char iv[] = "1212121212121212";
    encrypt(cipher, msg, padding);

    Serial.print("Cipher: "); print((char*)cipher, padding);
    
    size_t size_wrote = LoRa.write((uint8_t *)cipher, padding);
    Serial.print("Lora Write: "); Serial.println(size_wrote);
    if (padding != size_wrote) return E_LORA_SIZE_WROTE;

    LoRa.endPacket();
    //if (!LoRa.endPacket()) return E_LORA_END_PACKET;
    return E_OK;
}
