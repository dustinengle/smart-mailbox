
#include <FS.h>
#include <SPIFFS.h>

#include "config.h"
#include "mailbox.h"

int file_init() {
    if (!SPIFFS.begin(FORMAT_SPIFFS_IF_FAILED)) return E_FILE_BEGIN;
    return E_OK;
}

int file_exists(const char *path) {
    if (!SPIFFS.exists(path)) return E_FILE;
    return E_OK;
}

int file_remove(const char *path) {
    if (!SPIFFS.remove(path)) return E_FILE_REMOVE;
    return E_OK;
}

int file_write(const char *path, unsigned char *buffer, size_t size) {
    File file = SPIFFS.open(path, FILE_WRITE);
    if (!file) return E_FILE_OPEN;

    for (int i = 0; i < size; i++) {
        file.write(buffer[i]);
    }

    file.close();
    return E_OK;
}
