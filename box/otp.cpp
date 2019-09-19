
#include "config.h"
#include "mailbox.h"

int otp_init() {
    return E_OK;
}

int otp_del(uint16_t pin) {
    char path[3];
    sprintf(path, "%u", pin);
    if (file_remove((const char *)path)) return E_FILE_REMOVE;
    return E_OK;
}

int otp_get(uint16_t pin) {
    char path[3];
    sprintf(path, "%u", pin);
    if (file_exists((const char *)path)) return E_FILE_OPEN;
    return E_OK;
}

int otp_set(uint16_t pin) {
    char path[3];
    sprintf(path, "%u", pin);
    if (file_write((const char *)path, (unsigned char *)path, 2)) {
        return E_FILE_WRITE;
    }
    return E_OK;
}
