
#ifndef LORA_H
#define LORA_H

#include <Arduino.h>

void recv_packet(int size) {
  
}

void send_packet(uint8_t *buffer, size_t size) {
  if (!LoRa.beginPacket()) {
      Serial.println("lora: radio busy and cannot send");
      return;
  }
  size_t size = LoRa.write(buffer, len);
  if (size != len) {
      Serial.print("lora: send size mismatch ");
      Serial.print(len);
      Serial.print(" != ");
      Serial.println(size);
  }
  if (!LoRa.endPacket()) {
      Serial.println("lora: unable to end send packet");
  }
}

#endif
