
#include "config.h"
#include "mailbox.h"

void stop(String msg) {
    Serial.println(msg);
    while (true)
        ;
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

void loop() {
    int error = lora_recv();
    if (error) {
        Serial.print("ERROR: lora recv ");
        Serial.println(error, HEX);
    }
    
    // TODO: monitor for changes in sensors
}
