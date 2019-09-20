
#include "config.h"
#include "mailbox.h"

int button = 0;
int led = LED_BUILTIN;

void stop(String msg) {
    Serial.println(msg);
    while (true)
        ;

    pinMode(button, INPUT);
    pinMode(led, OUTPUT);
}

void setup() {
    Serial.begin(SERIAL_BAUD);
    if (DEBUG) {
        while (!Serial)
            ;
        Serial.println("SERIAL: ready");
    }

    if (file_init()) stop("ERROR: file init");
    if (otp_init()) stop("ERROR: otp init");
    if (lora_init()) stop("ERROR: lora init");
}

bool sending = false;
void loop() {
    int error = lora_recv();
    if (error) {
        Serial.print("ERROR: lora recv ");
        Serial.println(error, HEX);
    }
    
    int val = digitalRead(button);
    if (val == LOW && !sending) {
        digitalWrite(led, HIGH);
        sending = true;
        
        unsigned char buffer[OP_STATUS_SIZE] = {0};
        buffer[0] = OP_STATUS;
        buffer[9] = get_flag();
        buffer[10] = get_lock();
        buffer[11] = get_package();
        buffer[12] = get_power();

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
    } else {
        digitalWrite(led, LOW);
    }
}
