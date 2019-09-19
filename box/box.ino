
#include "config.h"
#include "mailbox.h"

void stop(String msg) {
    Serial.println(msg);
    while (true)
        ;
}

void test() {
    uint8_t buffer[OP_STATUS_SIZE];
    buffer[0] = OP_STATUS;
    buffer[9] = get_flag();
    buffer[10] = get_lock();
    buffer[11] = get_package();
    buffer[12] = get_power();
    if (DEBUG) {
        Serial.print("SENDING: ");
        Serial.print(sizeof(buffer), DEC);
        Serial.print(" ");
        Serial.write(buffer, sizeof(buffer));
        Serial.println();
    }
    if (lora_send((unsigned char *)buffer, OP_STATUS_SIZE)) {
        Serial.println("ERROR: unable to send loop status packet");
    }

    delay(5000);
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
    if (lora_recv()) Serial.println("ERROR: lora recv");
    // TODO: monitor for changes in sensors
    //test();
}
