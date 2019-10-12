
#include "config.h"
#include "mailbox.h"
#include <AccelStepper.h>

#define BTN 0
#define IN1 27
#define IN2 14
#define IN3 12
#define IN4 13
#define STEPS 2048

AccelStepper stepper(AccelStepper::FULL4WIRE, IN1, IN3, IN2, IN4);

void sensor_init(){
    stepper.setMaxSpeed(500);
    stepper.setAcceleration(200);
    stepper.setCurrentPosition(0);
}

uint8_t flag_ = FLAG_NO;
uint8_t locked_ = LOCK_YES;
uint8_t package_ = PACK_NO;
uint8_t power_ = 95;

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
    //delay(1000);
    if(lock == LOCK_YES){
      //stepper.step(STEPS);
      /*
      while(stepper.currentPosition() <= STEPS){
        stepper.setSpeed(500);
        stepper.runSpeed();
      }
      */
      stepper.moveTo(750);
      stepper.runToPosition();
      delay(1000);
    }
    if(lock == LOCK_NO){
      //stepper.step(-1 * STEPS);
      /*
      while(stepper.currentPosition() <= STEPS){
        stepper.setSpeed(-500);
        stepper.runSpeed();
      }
      */
      stepper.moveTo(0);
      stepper.runToPosition();
      delay(1000);
    }
    locked_ = lock;
    return E_OK;
}
