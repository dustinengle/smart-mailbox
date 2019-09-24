
#include "config.h"
#include "mailbox.h"

int button = 0;

void stop(String msg) {
    Serial.println(msg);
    while (true)
        ;

    pinMode(button, INPUT);
}

void setup() {
    Serial.begin(SERIAL_BAUD);
    if (DEBUG) {
        while (!Serial)
            ;
        Serial.println("SERIAL: ready");
    }

    if (file_init()) stop("ERROR: file init");
    if (allow_init()) stop("ERROR: allow init");
    if (lora_init()) stop("ERROR: lora init");
}

bool sending = false;
void loop() {
    int error = E_OK;
    int val = digitalRead(button);
    if (val == LOW && !sending) {
        sending = true;

        uint8_t locked = get_lock();
        error = set_lock(locked == LOCK_YES ? LOCK_NO : LOCK_YES);
        if (error) {
            Serial.print("ERROR: setting lock state ");
            Serial.println(error, HEX);
            sending = false;
            return;
        }

        unsigned char buffer[OP_STATUS_SIZE] = {0};
        buffer[0] = OP_STATUS;
        buffer[9] = get_flag();
        buffer[10] = get_lock();
        buffer[11] = get_package();
        buffer[12] = get_power();

        unsigned char checksum[CHECKSUM_SIZE];
        unsigned char key[] = SECRET_KEY;
        get_checksum(key, buffer, sizeof(buffer), checksum);
        for (int i = 0; i < sizeof(checksum); i++) {
            buffer[i + 1] = checksum[i];
        }

        if (DEBUG) {
            Serial.print("BUTTON: packet ");
            for (int i = 0; i < sizeof(buffer); i++) {
                Serial.print(buffer[i], DEC);
                Serial.print(" ");
            }
            Serial.println();
        }

        error = lora_send(buffer, sizeof(buffer));
        if (error) {
            Serial.print("ERROR: lora button send ");
            Serial.println(error, HEX);
        } else {
            Serial.println("BUTTON: packet sent");
        }
        delay(1000);
        sending = false;
    }

    error = lora_recv();
    if (error) {
        Serial.print("ERROR: lora recv ");
        Serial.println(error, HEX);
    }
}
