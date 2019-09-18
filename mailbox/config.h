
#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

// Error Codes
#define E_OK        0x01
#define E_UNKNOWN   0x02
#define E_FILE      0x03
#define E_LOCK      0x04
#define E_KEYPAD    0x05
#define E_LORA      0x06
#define E_POWER     0x07
#define E_SENSOR    0x08
#define E_EXPIRED   0x09

// OP Codes
#define OP_ACK      0x01
#define OP_REGISTER 0x02
#define OP_CONNECT  0x03
#define OP_OTP      0x04
#define OP_UNAUTH   0x05
#define OP_UNLOCK   0x06
#define OP_LOCK     0x07
#define OP_STATUS   0x08
#define OP_TIME     0x09

// LoRa
#define LORA_DIO0_PIN   26
#define LORA_FREQUENCY  915E6 // 433E6, 868E6, 915E6
#define LORA_MAX_SIZE   51
#define LORA_RST_PIN    3
#define LORA_SPREADING  7
#define LORA_SS_PIN     16
#define LORA_SYNC_WORD  0x12

// Serial
#define SERIAL_BAUD 115200

#endif
