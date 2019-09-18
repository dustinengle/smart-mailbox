
#ifndef TYPES_H
#define TYPES_H

#include <Arduino.h>

struct Status {
    uint8_t flag;
    uint8_t lock;
    uint8_t package;
    uint8_t power;
};

#endif
