
#include "config.h"
#include "mailbox.h"

uint8_t flag_ = FLAG_NO;
uint8_t locked_ = LOCK_YES;
uint8_t package_ = PACK_NO;
uint8_t power_ = 95;

uint8_t get_flag() {
    return flag_;
}

uint8_t get_lock() {
    return locked_;
}

uint8_t get_package() {
    return package_;
}

uint8_t get_power() {
    return power_;
}

int set_lock(uint8_t lock) {
    if (lock != LOCK_NO || lock != LOCK_YES) return E_LOCK_SET;
    locked_ = lock;
    return E_OK;
}
