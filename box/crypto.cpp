
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
