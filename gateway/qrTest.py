import pyqrcode
from Tkinter import *
import os
import sys
import requests
import json
import time
import signal
import multiprocessing as mp
import requests

from kit.controller import Controller
import kit.env as env
from kit.logger import error, info
import subprocess


class Gateway(Frame):
    def __init__(self, root=None):
        Frame.__init__(self, root)
        self.root = root
        menu = Menu(self.root)
        menu.add_command(label="Kit", command = self.adminMenu)
        menu.add_command(label="Mailbox")
        menu.add_command(label="Help")
        self.root.config(menu=menu)
        self.root.geometry("500x500")
        self.pack()
        self.get_env()
        self.startScreen()

    def startScreen(self):
        var = IntVar()
        newact = False
        while(not self.active_check()):
            startwin = Frame(self.root)
            startwin.pack()
            message = Message(startwin, text="This gateway has not been activated. Please use Its Here App to activate.", width=500)
            message.pack()
            button = Button(startwin, text="Show Activation Code", command=lambda: var.set(1))
            button.pack()
            button.wait_variable(var)
            self.activate()
            startwin.destroy()
            newact = True

        pw = ''
        if newact:
            pw = self.create_pw()
        else:
            pw = self.enter_pw()

        self.kit_setup(pw)
        time.sleep(5)
        self.sensor_setup()

    def create_pw(self):
        var = IntVar()
        pw = ''
        conpw = '.'
        while pw != conpw:
            pwwin = Frame(self.root)
            pwwin.pack()
            message = Message(pwwin, text="Please enter password:", width=500)
            message.pack()
            e = Entry(pwwin)
            e.pack()
            button = Button(pwwin, text="submit", command=lambda: var.set(1))
            button.pack()
            button.wait_variable(var)
            pw = e.get()
            pwwin.destroy()
            pwwin = Frame(self.root)
            pwwin.pack()
            message = Message(pwwin, text="Please confirm password:", width=500)
            message.pack()
            e = Entry(pwwin)
            e.pack()
            button = Button(pwwin, text="submit", command=lambda: var.set(1))
            button.pack()
            button.wait_variable(var)
            conpw = e.get()
            pwwin.destroy()
        return pw

    def enter_pw(self):
        var = IntVar()
        pwwin = Frame(self.root)
        pwwin.pack()
        message = Message(pwwin, text="Please enter password:", width=500)
        message.pack()
        e = Entry(pwwin)
        e.pack()
        button = Button(pwwin, text="submit", command=lambda: var.set(1))
        button.pack()
        button.wait_variable(var)
        pw = e.get()
        pwwin.destroy()
        return pw

    #starts kit as a multiprocess and sends register request to api
    def kit_setup(self, pw=None):
        kit = mp.Process(target=lambda: self.kit_start(pw))
        kit.start()
        time.sleep(10)
        self.send_register()

    def kit_start(self, pw=None):
        print('kit_setup')
        controller = Controller()

        # Handle SIGNIT and close the controller.
        def signal_handler(sig, frame):
            info('main', 'sigint')
            controller.stop()
            time.sleep(1)
            print 'Goodbye.'
            sys.exit(0)

        signal.signal(signal.SIGINT, signal_handler)

        # Load the configuration dictionary.
        print 'info:main: loading .env file'
        env.load('.env')

        # Setup our controller object and start it.
        controller.setup(pw)
        controller.start()

        # Wait for SIGINT.
        signal.pause()
        return 0

    def send_register(self):
        response = requests.post("http://165.22.183.203:10000/connect",json={"gateway":self.get_gatewayID()})
        print(response)
        return 0

    def sensor_setup(self):
        print('sensor_setup')
        #subprocess.call("safebox/sensor.py", shell=True)
        sensor = mp.Process(target=self.sensor_start)
        sensor.start()
        return 0

    def sensor_start(self):
        print('sensor_start')
        os.system('python safebox/sensor.py')
        return 0

    def get_env(self):
        print 'info:main: loading .env file'
        env.load('.env')

    def active_check(self):
        return os.environ['KIT_CHANNEL'] != '' and os.environ['KIT_DEVICE_ID'] != '' and os.environ['KIT_DEVICE_KEY'] != ''

    def gen_qr(self, qr):
        code = pyqrcode.create(qr)
        code_xbm = code.xbm(scale=5)
        return code_xbm

    def adminMenu(self):
        kitwin = Toplevel(self.root)
        if self.active_check():
            button = Button(kitwin, text="Start admin")
            button.pack()
        else:
            kitwin.title('Kit')
            message = Message(kitwin, text="Please Activate Gateway", width=200)
            button = Button(kitwin, text="ok", command=kitwin.destroy)
            message.pack(padx=5, pady=5)
            button.pack()

    def activate(self):
        gID = self.get_gatewayID()
        mID = self.get_mailbox()
        if(not self.active_check()):
            self.display_qr(mID, 'Mailbox')
            self.display_qr(gID, 'Gateway')
            self.handle_activate(gID, mID)
            #self.display_activated()

    def handle_activate(self, gID, mID):
        if(self.display_wait(gID,mID) and self.active_check()):
            self.display_activated()
        else:
            self.display_failure()
        return 0

    def display_wait(self, gID, mID):
        waitwin = Toplevel(self.root)
        waitwin.title('Activate')
        message = Message(waitwin, text="Please wait...", width=200)
        message.pack(padx=5, pady=5)
        """
        i=0
        while(i < 20):
            self.root.update_idletasks()
            self.root.update()
            time.sleep(.25)
            i+=1
        """
        response = self.send_activate(gID,mID)
        waitwin.destroy()
        return response

    def send_activate(self,gID,mID):
        #send request to /activate
        #tempDevID = ''
        #tempDevKey = ''
        #tempChanID = ''
        #response = self.append_env(tempDevID,tempDevKey,tempChanID)
        response = requests.post("http://165.22.183.203:10000/activate",json={"gateway":self.get_gatewayID()})
        json_response = response.json()
        #print(json_response['result']['deviceId'])
        try:
            data = json_response['result']
            print(data)
            print('ok')
            return self.append_env(data['deviceId'],data['deviceKey'],data['channelId'])
        except:
            return False

    def append_env(self, devID, devKey, chanID):
        s = open('.env').read()
        s = s.replace("KIT_CHANNEL=", "KIT_CHANNEL="+chanID)
        s = s.replace("KIT_DEVICE_ID=", "KIT_DEVICE_ID="+devID)
        s = s.replace("KIT_DEVICE_KEY=", "KIT_DEVICE_KEY="+devKey)
        f = open('.env', 'w')
        f.write(s)
        f.close()
        """
        for line in fileinput.input('.env', inplace = 1):
            if line == "KIT_CHANNEL":
                print line.replace("KIT_CHANNEL=", "KIT_CHANNEL="+chanID)
            if line == "KIT_DEVICE_ID":
                print line.replace("KIT_DEVICE_ID=", "KIT_DEVICE_ID="+devID)
            if line == "KIT_DEVICE_KEY":
                print line.replace("KIT_DEVICE_KEY=", "KIT_DEVICE_KEY="+devKey)
        """
        self.get_env()
        return self.active_check()

    def get_gatewayID(self):
        gatewayID = '654322'
        return gatewayID

    def get_mailbox(self):
        mailboxID = '123456'
        return mailboxID

    def display_qr(self, id, box):
        var = IntVar()
        actwin = Toplevel(self.root)
        actwin.title('Activate' + box)
        message = Message(actwin, text="Scan "+box+" code with mobile app", width=200)
        code_bmp = BitmapImage(data=self.gen_qr(id))
        code_bmp.config(background='white')
        qr = Label(actwin, image=code_bmp)
        button = Button(actwin, text="ok", command=lambda: var.set(1))
        message.pack(padx=5, pady=5)
        qr.pack()
        button.pack()
        button.wait_variable(var)
        actwin.destroy()

    def display_activated(self):
        var = IntVar()
        actwin = Toplevel(self.root)
        actwin.title('Activate')
        message = Message(actwin, text="Gateway is now activated", width=200)
        button = Button(actwin, text="ok", command=lambda: var.set(1))
        message.pack(padx=5, pady=5)
        button.pack()
        button.wait_variable(var)
        actwin.destroy()

    def display_failure(self):
        var = IntVar()
        actwin = Toplevel(self.root)
        actwin.title('Activate')
        message = Message(actwin, text="There was an issue during activation", width=200)
        button = Button(actwin, text="ok", command=lambda: var.set(1))
        message.pack(padx=5, pady=5)
        button.pack()
        button.wait_variable(var)
        actwin.destroy()


#root = tk.Tk()
#menu = tk.Menu(root)
"""
input = 'test stuff'
code_bmp = tk.BitmapImage(data=gen_qr(input))
code_bmp.config(background='white')
label = tk.Label(image=code_bmp)
menu.add_command(label="Kit", command = adminMenu)
menu.add_command(label="Mailbox")
menu.add_command(label="Help")
root.config(menu=menu)
label.pack()
"""
if __name__ == '__main__':
    root = Tk()
    gate = Gateway(root=root)
    """
    if(gate.active_check()):
        #start kit
        #start admin
        #start sensor
        print('YEAH')
    while True:
        op = gate.mainWin()
    """
    gate.mainloop()
    root.destroy()
