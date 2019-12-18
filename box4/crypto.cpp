
#include <mbedtls/md.h>
#include <mbedtls/aes.h>

#include "config.h"
#include "mailbox.h"
#include <FS.h>
#include <SPIFFS.h>

mbedtls_aes_context aes;

char publicKey[BLOCK_SIZE*2];
char enc_key[BLOCK_SIZE];
char dec_key[BLOCK_SIZE];

void aes_init() {  
  memset(publicKey, 0, sizeof(publicKey));
  memset(enc_key, 0, sizeof(enc_key));
  memset(dec_key, 0, sizeof(dec_key));
  
  File file = SPIFFS.open("/pub", FILE_READ);
  int size = 0;
  while (size < BLOCK_SIZE*2 && file.available()) {
    publicKey[size] = file.read();
    size++;
  }
  file.close();
  
  Serial.print("Public Key: "); Serial.println(publicKey);
  for (int i = 0; i < BLOCK_SIZE; i++) {
    dec_key[i] = publicKey[i];
    enc_key[i] = publicKey[i + 16];
  }
  Serial.print("Decrypt Key: "); Serial.write((uint8_t *)dec_key, sizeof(dec_key)); Serial.println("");
  Serial.print("Encrypt Key: "); Serial.write((uint8_t *)enc_key, sizeof(enc_key)); Serial.println("");
}

// decrypt the input to the output
void decrypt(unsigned char *output, char *input, size_t len) {
  unsigned char iv[] = "1212121212121212";
  //char key[] = "x7bHMpeJAd6W9HLw";
  //Serial.print("Keylen: "); Serial.println(strlen(key)*8);
  //Serial.print("Keylen: "); Serial.println(strlen(dec_key)*8);
  //Serial.print("Decrypt Key: "); Serial.write((uint8_t *)dec_key, sizeof(dec_key)); Serial.println("");
  Serial.print("input: "); Serial.write((uint8_t *)input, len); Serial.println("");
  //Serial.print("IV: "); Serial.println((char*)iv);
  mbedtls_aes_init(&aes);
  mbedtls_aes_setkey_dec(&aes, (const unsigned char *)dec_key, BLOCK_SIZE * 8);
  mbedtls_aes_crypt_cbc(&aes, MBEDTLS_AES_DECRYPT, BLOCK_SIZE, iv, (const unsigned char *)input, output);
  Serial.print("Output: "); Serial.println((char*)output);
  mbedtls_aes_free(&aes);
}

// encrypt the provided input to the output
void encrypt(unsigned char *output, char *input, size_t len) {
  unsigned char iv[] = "1212121212121212";
  //char key[] = "x7bHMpeJAd6W9HLw";
  //Serial.print("Keylen: "); Serial.println(strlen(key)*8);
  //Serial.print("Keylen: "); Serial.println(strlen(enc_key)*8);
  mbedtls_aes_init(&aes);
  mbedtls_aes_setkey_enc(&aes, (const unsigned char *)enc_key, BLOCK_SIZE * 8);
  mbedtls_aes_crypt_cbc(&aes, MBEDTLS_AES_ENCRYPT, BLOCK_SIZE, iv, (const unsigned char *)input, output);
  mbedtls_aes_free(&aes);
}

// print buffer to hex value to console and add newline
void print(char *output, size_t len) {
  for (int i = 0; i < len; i++) {
    char str[3];
    sprintf(str, "%02x", (int)output[i]);
    Serial.print(str);
  }
  Serial.println("");
}

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
