
#include "config.h"
#include "mailbox.h"
#include <AccelStepper.h>

#define BTN 0
#define IN1 16
#define IN2 4
#define IN3 12
#define IN4 13
#define STEPS 2048

//AccelStepper stepper(4, IN1, IN3, IN2, IN4);
//AccelStepper stepper(AccelStepper::FULL4WIRE, 27, 13, 14, 12);
//AccelStepper stepper(AccelStepper::FULL4WIRE, 16, 12, 4, 13);
AccelStepper stepper(AccelStepper::FULL4WIRE, 12, 2, 13, 17);

uint8_t flag_ = FLAG_NO;
uint8_t locked_ = LOCK_NO;
uint8_t package_ = PACK_NO;
uint8_t power_ = 95;

void sensor_init(){
    stepper.setMaxSpeed(500);
    stepper.setAcceleration(200);
    stepper.setCurrentPosition(0);
    Serial.println(locked_);
}

uint8_t get_flag() {
    return flag_;
}

uint8_t get_lock() {
    return locked_;
}

uint8_t get_package() {
    return package_;
}

uint8_t get_power() {
    return power_;
}

int set_lock(uint8_t lock) {
    if(lock == locked_) return E_LOCK_SET;
    
    if(lock == LOCK_NO){
      stepper.moveTo(0);
      stepper.runToPosition();
    }
    if(lock == LOCK_YES){
      stepper.moveTo(500);
      stepper.runToPosition();
    }
    locked_ = lock;
    delay(250);
    return E_OK;
}
