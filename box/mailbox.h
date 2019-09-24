
#ifndef MAILBOX_H
#define MAILBOX_H

#include <Arduino.h>

// Crypto
void get_checksum(const unsigned char *key, const unsigned char *data, size_t size, unsigned char *buffer);
void get_hash(const unsigned char *key, const unsigned char *data, size_t size, unsigned char *buffer);
int load_gw_key(unsigned char *buffer);
int load_key(unsigned char *buffer);
int save_gw_key(unsigned char *buffer);
int save_key(unsigned char *buffer);

// File
int file_init();
int file_exists(const char *path);
int file_remove(const char *path);
int file_write(const char *path, unsigned char *buffer, int size);

// LoRa
int lora_init();
int lora_conf(int sync_word);
void lora_on_recv(int size);
int file_read(const char *path, unsigned char *buffer);
int lora_recv();
int lora_send(unsigned char *buffer, int size);

// ALLOW
int allow_init();
int allow_del(uint16_t pin);
int allow_get(uint16_t pin);
int allow_set(uint16_t pin);

// Sensors
uint8_t get_flag();
uint8_t get_lock();
uint8_t get_package();
uint8_t get_power();
int set_lock(uint8_t lock);

#endif
