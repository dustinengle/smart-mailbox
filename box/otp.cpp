
#include "config.h"
#include "mailbox.h"

char path[6] = {0};

void get_path(uint16_t pin) {
    sprintf(path + 1, "%u", pin);
}

int otp_init() {
    path[0] = '/';
    path[5] = '\0';
    return E_OK;
}

int otp_del(uint16_t pin) {
    get_path(pin);
    if (DEBUG) {
        Serial.print("OTP: del pin=");
        Serial.print(pin, DEC);
        Serial.print(", path=");
        Serial.println(path);
    }
    return file_remove((const char *)path);
}

int otp_get(uint16_t pin) {
    get_path(pin);
    if (DEBUG) {
        Serial.print("OTP: get pin=");
        Serial.print(pin, DEC);
        Serial.print(", path=");
        Serial.println(path);
    }
    return file_exists((const char *)path);
}

int otp_set(uint16_t pin) {
    get_path(pin);
    if (DEBUG) {
        Serial.print("OTP: set pin=");
        Serial.print(pin, DEC);
        Serial.print(", path=");
        Serial.println(path);
    }
    return file_write(path, (unsigned char *)path, 2);
}
