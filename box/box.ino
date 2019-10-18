#include <Keypad.h>
#include "config.h"
#include "mailbox.h"
//#include <Stepper.h>
#include <AccelStepper.h>

#define Password_Length 5
/*
#define BTN 0
#define IN1 27
#define IN2 14
#define IN3 12
#define IN4 13
#define STEPS 2048

Stepper stepper(STEPS, IN1, IN3, IN2, IN4);
*/
char Data[Password_Length]; 
//char Master[Password_Length] = "1234"; 
byte data_count = 0, master_count = 0;
//bool Pass_is_good;
char customKey;
int readyCheck = 0;

const byte ROWS = 4; 
const byte COLS = 3; 

/*
char hexaKeys[ROWS][COLS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};
*/
char hexaKeys[ROWS][COLS] = {
  {'1', '2', '3'},
  {'4', '5', '6'},
  {'7', '8', '9'},
  {'*', '0', '#'}
};

byte rowPins[ROWS] = {22, 23, 2, 17}; 
byte colPins[COLS] = {34, 33, 32};

/*
byte rowPins[ROWS] = {32, 33, 12, 13}; 
byte colPins[COLS] = {36, 37, 38, 39}; 
*/
/*
byte rowPins[ROWS] = {34, 35, 32, 17}; 
byte colPins[COLS] = {22, 23, 2}; 
*/

Keypad pinKeypad = Keypad(makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS);

int button = 0;

void stop(String msg) {
    Serial.println(msg);
    while (true)
        ;

    pinMode(button, INPUT);
}

void setup() {
    Serial.begin(SERIAL_BAUD);
    sensor_init();
    //stepper.setSpeed(10);
    
    if (DEBUG) {
        while (!Serial)
            ;
        Serial.println("SERIAL: ready");
    }

    if (file_init()) stop("ERROR: file init");
    if (allow_init()) stop("ERROR: allow init");
    if (lora_init()) stop("ERROR: lora init");
}

bool sending = false;
void loop() {
    //int state = digitalRead(BTN);
    int error = E_OK;
    /*
    int val = digitalRead(button);
    if (val == LOW && !sending) {
    */
    //char pinCheck[];
    int pinCtr = 0;
    uint8_t locked = get_lock();

    if(readyCheck == 0){
      Serial.println("ready");
      readyCheck = 1;
    }
    if(locked == LOCK_YES){
      customKey = pinKeypad.getKey();
      if (customKey){
        Serial.println(customKey);
        Data[data_count] = customKey;  
        data_count++; 
      }
    }
    else{
      Serial.println("press key to close");
      pinKeypad.waitForKey();
      //stepper.step(-1 * STEPS);
      error = set_lock(LOCK_YES);
      Serial.println("locked");
      readyCheck = 0;
      if (error) {
        Serial.print("ERROR: setting lock state ");
        Serial.println(error, HEX);
        sending = false;
        return;
      }
    }
    
    //Serial.println(pinCheck);
    if (data_count == Password_Length-1 && !sending) {
        sending = true;
        readyCheck = 0;
        /*
        uint8_t locked = get_lock();
        error = set_lock(locked == LOCK_YES ? LOCK_NO : LOCK_YES);
        */
        Serial.println(Data);
        /*
        if(!strcmp(Data, Master)){
        */
        if(allow_get(Data) == E_OK){
          //stepper.step(STEPS);
          error = set_lock(LOCK_NO);
          Serial.println("unlocked");
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
        sending = false;
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

/*
String getPin(){
  String fullPin;
  for(int i = 0; i < 4; i++){
    char pinKey = pinKeypad.getKey();
    Serial.println(pinKey);
    fullPin.concat(pinKey);
  }
  return fullPin;
}
*/
