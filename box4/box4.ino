#include <Keypad.h>
#include "config.h"
#include "mailbox.h"
#include <AccelStepper.h>
#include <time.h>
#include <FS.h>
#include <SPIFFS.h>
#include <qrcode.h>
#include <qrcode.h>
#include <U8g2lib.h>

#define Password_Length 5

char Data[Password_Length]; 
byte data_count = 0, master_count = 0;
char customKey;
int readyCheck = 0;

const byte ROWS = 2; 
const byte COLS = 2; 

/*
char hexaKeys[ROWS][COLS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

char hexaKeys[ROWS][COLS] = {
  {'1', '2', '3'},
  {'4', '5', '6'},
  {'7', '8', '9'},
  {'*', '0', '#'}
};
*/

char hexaKeys[ROWS][COLS] = {
  {'1', '2'},
  {'4', '5'}
};


byte rowPins[ROWS] = {23, 32};
byte colPins[COLS] = {22, 33};
/*
byte rowPins[ROWS] = {22, 23, 2}; 
byte colPins[COLS] = {34, 39, 38};


byte rowPins[ROWS] = {32, 33, 12, 13}; 
byte colPins[COLS] = {36, 37, 38, 39}; 
*/

Keypad pinKeypad = Keypad(makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS);

// OLED
U8G2_SSD1306_128X64_NONAME_F_HW_I2C oled(U8G2_R0, 16, 15, 4);

// QR Code
QRCode qrcode;

void stop(String msg) {
    Serial.println(msg);
    while (true)
        ;
}

void setup() {
    Serial.begin(SERIAL_BAUD);
    
    if (DEBUG) {
        while (!Serial)
            ;
        Serial.println("SERIAL: ready");
    }

    if (file_init()) stop("ERROR: file init");
    if (allow_init()) stop("ERROR: allow init");
    if (lora_init()) stop("ERROR: lora init");

    oled.begin();
    
    const int KEY_MAX = 32;
    char publicKey[KEY_MAX];
    
    if(!SPIFFS.exists("/pub")) {
      randomSeed(analogRead(0));
      int x;
      char s;
      char charset[] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      File file = SPIFFS.open("/pub", FILE_WRITE);
      if(!file){
        Serial.println("There was an error opening the file for writing");
        return;
      }
      for(int i=0; i<KEY_MAX; i++) {
        x = random(62);
        Serial.println(x);
        s = charset[x];
        Serial.println(s);
        if (file.write(s)) {
          Serial.println(s);
        } else {
          Serial.println("File write failed");
        }
      }
      
      file.close();
    }

    File file = SPIFFS.open("/pub", FILE_READ);
    int size = 0;
    while (size < KEY_MAX && file.available()) {
      publicKey[size] = file.read();
      size++;
    }
    Serial.println(publicKey);
    file.close();

    aes_init();

    uint8_t qrcodeData[qrcode_getBufferSize(3)];
    qrcode_initText(&qrcode, qrcodeData, 3, 0, publicKey);

    boolean currentState = LOW;
    pinMode(0, INPUT);

    oled.firstPage();
    do {
        for (uint8_t y = 0; y < qrcode.size; y++) {
            for (uint8_t x = 0; x < qrcode.size; x++) {
                if (qrcode_getModule(&qrcode, x, y)) {
                    oled.drawBox(2 * x, 2 * y, 2, 2);
                }
            }
        }
        currentState = digitalRead(0);
    } while ( oled.nextPage() || currentState == HIGH );
    oled.clear();
    //oled.setPowerSave(1);

    sensor_init();
    //set_lock(LOCK_NO);
}

bool sending = false;
void loop() {
    
    int error = E_OK;
    uint8_t locked = get_lock();
    //Serial.print("Lock: "); Serial.println(locked);

    if(readyCheck == 0){
      Serial.println("ready");
      readyCheck = 1;
    }

    
    if(locked == LOCK_YES){
      customKey = pinKeypad.getKey();
      delay(50);
      if (customKey){
        Serial.println(customKey);
        Data[data_count] = customKey;  
        data_count++;
      }
    }
    else{
      //pinKeypad.waitForKey();
      customKey = pinKeypad.getKey();
      if (customKey != '\0'){
        error = set_lock(LOCK_YES);
        Serial.println("locked");
        readyCheck = 0;
        //sending = false;
      }
      if (error) {
        Serial.print("ERROR: setting lock state ");
        Serial.println(error, HEX);
        sending = false;
        return;
      }
    }
    
    if (data_count == Password_Length-1 && !sending) {
        sending = true;
        //readyCheck = 0;
        Serial.println(Data);
        if(allow_get(Data) == E_OK){
          error = set_lock(LOCK_NO);
          Serial.println("unlocked");
          locked = get_lock();
          //customKey = 'n';
        }
        
        if (error) {
            Serial.print("ERROR: setting lock state ");
            Serial.println(error, HEX);
            sending = false;
            return;
        }

        unsigned char buffer[OP_STATUS_SIZE] = {0};
        buffer[0] = OP_STATUS;
        buffer[9] = get_flag();
        buffer[10] = get_lock();
        buffer[11] = get_package();
        buffer[12] = get_power();

        unsigned char checksum[CHECKSUM_SIZE];
        unsigned char key[] = SECRET_KEY;
        get_checksum(key, buffer, sizeof(buffer), checksum);
        for (int i = 0; i < sizeof(checksum); i++) {
            buffer[i + 1] = checksum[i];
        }

        if (DEBUG) {
            Serial.print("BUTTON: packet ");
            for (int i = 0; i < sizeof(buffer); i++) {
                Serial.print(buffer[i], DEC);
                Serial.print(" ");
            }
            Serial.println();
        }

        error = lora_send(buffer, sizeof(buffer));
        if (error) {
            Serial.print("ERROR: lora button send ");
            Serial.println(error, HEX);
        } else {
            Serial.println("BUTTON: packet sent");
        }
        delay(1000);
        Serial.println("post delay");
        sending = false;
        if(get_lock()==LOCK_NO){
          Serial.println("press key to close");
        }
        clearData();
    }

    error = lora_recv();
    if (error) {
        Serial.print("ERROR: lora recv ");
        Serial.println(error, HEX);
    }
}

void clearData(){
  while(data_count !=0){
    Data[data_count--] = 0; 
  }
  return;
}
