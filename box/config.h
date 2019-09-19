
#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

#define CHECKSUM_SIZE           8
#define DEBUG                   true
#define FORMAT_SPIFFS_IF_FAILED true
#define HASH_SIZE               32
#define SECRET_KEY              "SomePassword!2#4Here!2#4Here!2#"

// Error Codes
#define E_OK                0x00
#define E_UNKNOWN           0xFF
#define E_FILE              0x10
#define E_FILE_BEGIN        0x11
#define E_FILE_OPEN         0x12
#define E_FILE_READ         0x13
#define E_FILE_REMOVE       0x14
#define E_FILE_WRITE        0x15
#define E_LOCK              0x20
#define E_LOCK_GET          0x21
#define E_LOCK_SET          0x22
#define E_KEYPAD            0x30
#define E_LORA              0x40
#define E_LORA_BEGIN_PACKET 0x41
#define E_LORA_SIZE_WROTE   0x42
#define E_LORA_END_PACKET   0x43
#define E_LORA_OP_CODE      0x44
#define E_LORA_CHECKSUM     0x45
#define E_LORA_MAX_SIZE     0x46
#define E_LORA_SEND         0x47
#define E_OP                0x50
#define E_OP_SIZE           0x51
#define E_POWER             0x60
#define E_SENSOR            0x70
#define E_EXPIRED           0x80

// OP Codes
#define OP_ACK      0x01
#define OP_CONNECT  0x02
#define OP_LOCK     0x03
#define OP_OTP      0x04
#define OP_REGISTER 0x05
#define OP_STATUS   0x06
#define OP_TIME     0x07
#define OP_UNAUTH   0x08
#define OP_UNLOCK   0x09
#define OP_END      0x10

// OP Packet Sizes
#define OP_ACK_SIZE      14
#define OP_CONNECT_SIZE  37
#define OP_LOCK_SIZE     10
#define OP_OTP_SIZE      15
#define OP_REGISTER_SIZE 4
#define OP_STATUS_SIZE   13
#define OP_TIME_SIZE     13
#define OP_UNAUTH_SIZE   15
#define OP_UNLOCK_SIZE   10

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

// Sensor
#define FLAG_NO     0
#define FLAG_YES    1
#define LOCK_NO     0
#define LOCK_YES    1
#define PACK_NO     0
#define PACK_YES    1

#endif
