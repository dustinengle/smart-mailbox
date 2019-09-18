
#ifndef SECURITY_H
#define SECURITY_H

#include <Arduino.h>
#include <mbedtls/md.h>

mbedtls_md_context_t ctx;
mbedtls_md_type_t type = MBEDTLS_MD_SHA256;

void hash(unsigned char *key, unsigned char *payload, size_t payload_size, unsigned char *buffer) {
    mbedtls_md_init(&ctx);
    mbedtls_md_setup(&ctx, mbedtls_md_info_from_type(type), 1);
    mbedtls_md_hmac_starts(&ctx, key, sizeof(key));
    mbedtls_md_hmac_update(&ctx, payload, payload_size);
    mbedtls_md_hmac_finish(&ctx, buffer);
    mbedtls_md_free(&ctx);
}

void checksum(unsigned char *key, unsigned char *payload, size_t payload_size, unsigned char *buffer) {
    unsigned char h[32];
    hash(key, payload, payload_size, h);
    memcpy(buffer, h, 8);
}

#endif
