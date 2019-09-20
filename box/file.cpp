
#include <FS.h>
#include <SPIFFS.h>

#include "config.h"
#include "mailbox.h"

void list_files() {
    File root = SPIFFS.open("/");
    File file = root.openNextFile();
    
    while (file) {
        Serial.print("FILE: ");
        Serial.println(file.name());
        
        file = root.openNextFile();
    }
}

int file_init() {
    if (!SPIFFS.begin(FORMAT_SPIFFS_IF_FAILED)) return E_FILE_BEGIN;
    if (DEBUG) list_files();
    return E_OK;
}

int file_exists(const char *path) {
    if (!SPIFFS.exists(path)) return E_FILE_OPEN;
    return E_OK;
}

int file_read(const char *path, unsigned char *buffer) {
    File file = SPIFFS.open(path, FILE_READ);

    int size = 0;
    while (file.available()) {
        buffer[size++] = file.read();
    }

    file.close();
    return size;
}

int file_remove(const char *path) {
    if (!SPIFFS.remove(path)) return E_FILE_REMOVE;
    if (DEBUG) list_files();
    return E_OK;
}

int file_write(const char *path, unsigned char *buffer, int size) {
    File file = SPIFFS.open(path, FILE_WRITE);

    for (int i = 0; i < size; i++) {
        file.write(buffer[i]);
    }

    file.close();
    if (DEBUG) list_files();
    return E_OK;
}
