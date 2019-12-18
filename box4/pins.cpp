
#include "config.h"
#include "mailbox.h"

//char path[6] = {0};
String path = "";
String get_path(String pin) {
    //sprintf(path + 1, "%u", pin);
    return String("/")+pin;
}

int allow_init() {
    path[0] = '/';
    path[5] = '\0';
    return E_OK;
}

int allow_del(String pin) {
    path = get_path(pin);
    if (DEBUG) {
        Serial.print("ALLOW: del pin=");
        Serial.print(pin);
        Serial.print(", path=");
        Serial.println(path);
    }
    char temp[6];
    strcpy(temp, path.c_str());
    return file_remove(temp);
    //return file_remove((const char *)path);
}

int allow_get(String pin) {
    path = get_path(pin);
    if (DEBUG) {
        Serial.print("ALLOW: get pin=");
        Serial.print(pin);
        Serial.print(", path=");
        Serial.println(path);
    }
    char temp[6];
    strcpy(temp, path.c_str());
    return file_exists(temp);
    //return file_exists((const char *)path);
}

int allow_set(String pin) {
    path = get_path(pin);
    if (DEBUG) {
        Serial.print("ALLOW: set pin=");
        Serial.print(pin);
        Serial.print(", path=");
        Serial.println(path);
    }
    char temp[6];
    strcpy(temp, path.c_str());
    return file_write(temp,(unsigned char *)temp,2);
    //return file_write(path, (unsigned char *)path, 2);
}
