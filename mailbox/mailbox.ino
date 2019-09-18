
#include <LoRa.h>

#include "config.h"
#include "security.h"
#include "types.h"

long frequency = LORA_FREQUENCY;
unsigned char key[] = "SOME_KEY_HERE";
int spreading = LORA_SPREADING;
int sync_word = LORA_SYNC_WORD;

void on_receive(int size);
void on_send(const char *buf, size_t len);

void setup() {
    Serial.begin(SERIAL_BAUD);
    while(!Serial)
        ;
    Serial.println("serial: ready");

    LoRa.setPins(LORA_SS_PIN, LORA_RST_PIN, LORA_DIO0_PIN);
    while (!LoRa.begin(LORA_FREQUENCY)) {
        Serial.println("lora: unable to connect");
        delay(1000);
    }
    LoRa.setSpreadingFactor(spreading);
    LoRa.setSyncWord(sync_word);
    LoRa.onReceive(on_receive);
    LoRa.receive();
}

void loop() {
    delay(5000);
    
    uint8_t buffer[14] = {0};
    uint8_t cs[8];
    
    unsigned char payload[] = "PAYLOAD_GOES_HERE_OK";
    checksum(key, payload, sizeof(payload), (unsigned char *)cs);
    
    buffer[0] = OP_STATUS;
    memcpy(buffer + 1, cs, sizeof(cs));
    buffer[9] = 99;
    buffer[10] = 1;
    buffer[11] = 1;
    buffer[12] = 0;
    buffer[13] = E_OK;
    
    on_send(buffer, sizeof(buffer));
}

void on_receive(int size) {
    Serial.print("lora: receive packet ");
    Serial.println(size, DEC);

    uint8_t buffer[LORA_MAX_SIZE] = {0};
    uint8_t cs[8];
    unsigned char h[32];
    byte op = LoRa.read();
    struct Status status = {0, 1, 0, 99};
    switch (op) {
        case OP_ACK:
            Serial.println("lora: ACK");
            return;
        case OP_CONNECT:
            Serial.println("lora: CONNECT");
            buffer[0] = OP_CONNECT;
            buffer[1] = status.power;
            buffer[2] = status.package;
            buffer[3] = status.lock;
            buffer[4] = status.flag;
            hash(key, key, sizeof(key), h);
            memcpy(buffer + 5, h, 32);
            buffer[37] = '\0';
            break;
        case OP_LOCK:
            Serial.println("lora: LOCK");
            buffer[0] = OP_ACK;
            //checksum(key, (unsigned char *)"", (unsigned char *)cs);
            //memcpy(buffer + 1, cs, 8);
            buffer[9] = status.power;
            buffer[10] = status.package;
            buffer[11] = status.lock;
            buffer[12] = status.flag;
            buffer[13] = E_OK;
            buffer[14] = '\0';
            break;
        case OP_OTP:
            Serial.println("lora: OTP");
            buffer[0] = OP_ACK;
            //checksum(key, (unsigned char *)"", (unsigned char *)cs);
            //memcpy(buffer + 1, cs, 8);
            buffer[9] = status.power;
            buffer[10] = status.package;
            buffer[11] = status.lock;
            buffer[12] = status.flag;
            buffer[13] = E_OK;
            buffer[14] = '\0';
            break;
        case OP_REGISTER:
            Serial.println("lora: REGISTER");
            buffer[0] = OP_ACK;
            //checksum(key, (unsigned char *)"", (unsigned char *)cs);
            //memcpy(buffer + 1, cs, 8);
            buffer[9] = status.power;
            buffer[10] = status.package;
            buffer[11] = status.lock;
            buffer[12] = status.flag;
            buffer[13] = E_OK;
            buffer[14] = '\0';
            break;
        case OP_STATUS:
            Serial.println("lora: STATUS");
            buffer[0] = OP_ACK;
            //checksum(key, (unsigned char *)"", (unsigned char *)cs);
            //memcpy(buffer + 1, cs, 8);
            buffer[9] = status.power;
            buffer[10] = status.package;
            buffer[11] = status.lock;
            buffer[12] = status.flag;
            buffer[13] = E_OK;
            buffer[14] = '\0';
            break;
        case OP_TIME:
            Serial.println("lora: TIME");
            buffer[0] = OP_ACK;
            //checksum(key, (unsigned char *)"", (unsigned char *)cs);
            //memcpy(buffer + 1, cs, 8);
            buffer[9] = status.power;
            buffer[10] = status.package;
            buffer[11] = status.lock;
            buffer[12] = status.flag;
            buffer[13] = E_OK;
            buffer[14] = '\0';
            break;
        case OP_UNAUTH:
            Serial.println("lora: UNAUTH");
            buffer[0] = OP_ACK;
            //checksum(key, (unsigned char *)"", (unsigned char *)cs);
            //memcpy(buffer + 1, cs, 8);
            buffer[9] = status.power;
            buffer[10] = status.package;
            buffer[11] = status.lock;
            buffer[12] = status.flag;
            buffer[13] = E_OK;
            buffer[14] = '\0';
            break;
        case OP_UNLOCK:
            Serial.println("lora: UNLOCK");
            buffer[0] = OP_ACK;
            //checksum(key, (unsigned char *)"", (unsigned char *)cs);
            //memcpy(buffer + 1, cs, 8);
            buffer[9] = status.power;
            buffer[10] = status.package;
            buffer[11] = status.lock;
            buffer[12] = status.flag;
            buffer[13] = E_OK;
            buffer[14] = '\0';
            break;
        default:
            return;
    }

    on_send(buffer, sizeof(buffer));
}

void on_send(const uint8_t *buffer, size_t len) {
    Serial.print("lora: recv packet ");
    Serial.println(len, DEC);
    
    if (!LoRa.beginPacket()) {
        Serial.println("lora: radio busy and cannot send");
        return;
    }
    size_t size = LoRa.write(buffer, len);
    if (size != len) {
        Serial.print("lora: send size mismatch ");
        Serial.print(len);
        Serial.print(" != ");
        Serial.println(size);
    }
    if (!LoRa.endPacket()) {
        Serial.println("lora: unable to end send packet");
    }
}
