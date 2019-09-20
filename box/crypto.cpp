
#include <mbedtls/md.h>

#include "config.h"
#include "mailbox.h"

void get_checksum(const unsigned char *key, const unsigned char *data, size_t size, unsigned char *buffer) {
    unsigned char hash[HASH_SIZE];
    get_hash(key, data, size, hash);
    memcpy(buffer, hash, CHECKSUM_SIZE);
}

void get_hash(const unsigned char *key, const unsigned char *data, size_t size, unsigned char *buffer) {
    mbedtls_md_context_t ctx;
    mbedtls_md_init(&ctx);
    mbedtls_md_setup(&ctx, mbedtls_md_info_from_type(MBEDTLS_MD_SHA256), 1);
    mbedtls_md_hmac_starts(&ctx, key, sizeof(key));
    mbedtls_md_hmac_update(&ctx, data, size);
    mbedtls_md_finish(&ctx, buffer);
    mbedtls_md_free(&ctx);
}

int load(const char *path, unsigned char *buffer) {
    int error = file_exists(KEY_PATH);
    if (error) return error;
    
    int size = file_read(path, buffer);
    if (size != HASH_SIZE) {
        Serial.println("ERROR: reading key for lora");
        return E_LORA_CHECKSUM;
    }
    return E_OK;
}

int load_gw_key(unsigned char *buffer) {
    int error = load(GW_PATH, buffer);
    if (error) error = E_LORA_GW_KEY;
    return error;
}

int load_key(unsigned char *buffer) {
    int error = load(KEY_PATH, buffer);
    if (error) error = E_LORA_KEY;
    return error;
}

int save(const char *path, unsigned char *buffer) {
    return file_write(path, buffer, HASH_SIZE);
}

int save_gw_key(unsigned char *buffer) {
    int error = save(GW_PATH, buffer);
    if (error) error = E_LORA_GW_KEY;
    return error;
}

int save_key(unsigned char *buffer) {
    int error = save(KEY_PATH, buffer);
    if (error) error = E_LORA_KEY;
    return error;
}
