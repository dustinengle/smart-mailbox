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
import ed25519

from kit.controller import Controller
from kit.file import read_file
from kit.codec import decode, encode
from kit.crypto import decrypt, encrypt
import kit.env as env
from kit.logger import error, info
from kit.pubsub import get_message, subscribe, unsubscribe, publish
import subprocess


class Gateway(Frame):
    def __init__(self, root=None):
        Frame.__init__(self, root)
        self.url = "http://165.22.183.203:10000/v1"
        self.root = root
        menu = Menu(self.root)
        menu.add_command(label="Kit", command = self.adminMenu)
        menu.add_command(label="Mailbox", command = self.mailboxMenu)
        menu.add_command(label="Help")
        self.root.config(menu=menu)
        self.root.geometry("500x500")
        self.activeList = ['inactive']
        self.pack()
        self.get_env()
        self.startScreen()

    def get_env(self):
        print 'info:main: loading .env file'
        env.load('.env')


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
            while(self.check_pw(pw) == False):
                pw = self.enter_pw()

        self.kit_setup(pw)

        #if(register_check() != False):
        self.send_register()
            #time.sleep(30)

        while(self.mailbox_check() <= 0):
            print('?')
            self.mailbox_setup(1)
            time.sleep(1)

        self.mailboxMenu()

        """
        time.sleep(5)
        self.sensor_setup()
        """

    def active_check(self):
        return os.environ['KIT_CHANNEL'] != '' and os.environ['KIT_DEVICE_ID'] != '' and os.environ['KIT_DEVICE_KEY'] != ''


    def activate(self):
        gID = self.get_gatewayID()
        #mID = self.get_mailbox()
        if(not self.active_check()):
            #self.display_qr(mID, 'Mailbox')
            self.display_qr(gID, 'Gateway')
            self.handle_activate(gID)
            #self.display_activated()

    def get_gatewayID(self):
        if(os.environ['GATE_PUB_KEYS'] == ''):
            self.gen_key()
        return os.environ['GATE_PUB_KEYS'].split(',')[0]

    def gen_key(self):
        priv, verifying_key = ed25519.create_keypair()
        print(verifying_key)
        vkey_hex = verifying_key.to_ascii(encoding="hex")
        s = open('.env').read()
        s = s.replace("GATE_PUB_KEYS=", "GATE_PUB_KEYS="+vkey_hex+",")
        f = open('.env', 'w')
        f.write(s)
        f.close()
        self.get_env()
        open(os.environ['GATE_SEED_PATH'],"wb").write(priv.to_bytes())
        vkey = os.environ['GATE_PUB_KEYS'].split(',')[0]
        print "the public key is", vkey


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

    def gen_qr(self, qr):
        code = pyqrcode.create(qr)
        code_xbm = code.xbm(scale=5)
        return code_xbm


    def handle_activate(self, gID):
        if(self.display_wait(gID) and self.active_check()):
            self.display_activated()
        else:
            self.display_failure()
        return 0

    def display_wait(self, gID):
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
        response = self.send_activate(gID)
        waitwin.destroy()
        return response

    def send_activate(self,gID):
        #send request to /activate
        #tempDevID = ''
        #tempDevKey = ''
        #tempChanID = ''
        #response = self.append_env(tempDevID,tempDevKey,tempChanID)
        """
        add signiture and ts
        """
        ts = int(time.time())
        sig = str(self.sign(str(ts)))
        #headers = json.loads(json.dumps({'Content-Type':'application/json','Authorization':sig}))
        headers = json.loads('{"Content-Type":"application/json","Authorization":"'+sig+'"}')
        payload = json.loads('{"publicKey":"'+self.get_gatewayID()+'","timestamp":"'+str(ts)+'"}')
        try:
            response = requests.post(self.url+"/activate",json=payload,headers=headers)
            json_response = response.json()
        except:
            return False
        #print(json_response['result']['deviceId'])
        try:
            data = json_response['result']['gateway']
            print(data)
            print('ok')
            return self.append_env(data['deviceId'],data['deviceKey'],data['channelId'])
        except:
            return False

    def sign(self, msg):
        keydata = open(os.environ['GATE_SEED_PATH'],"rb").read()
        signing_key = ed25519.SigningKey(keydata)
        sig = signing_key.sign(msg, encoding="base64")
        print "sig is:", sig
        return sig


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



    def check_pw(self, _password):
        try:
            data = read_file(path=os.environ['KIT_SECRET_PATH'])
            decrypt(data, _password)
            return True
        except:
            raise Exception('Decryption of secret data failed, password incorrect!')
            return False




    def create_pw(self):
        var = IntVar()
        pw = ''
        conpw = '.'
        while pw != conpw:
            pwwin = Frame(self.root)
            pwwin.pack()
            if(pw != ''):
                match = Message(pwwin, text="Entries did not match", width=500)
                match.pack()
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
        self.activeList[0] = 'active'
        time.sleep(5)
        print 'kit end'
        #self.send_register()

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



    def register_check():
        data = read_file(path=os.environ['KIT_SECRET_PATH'])
        if(data == ''):
            return False
        else:
            return True



    def send_register(self):
        """
        add signiture and ts
        """
        ts = int(time.time())
        sig = str(self.sign(str(ts)))
        headers = json.loads('{"Content-Type":"application/json","Authorization":"'+sig+'"}')
        payload = json.loads('{"publicKey":"'+self.get_gatewayID()+'","timestamp":"'+str(ts)+'"}')
        try:
            response = requests.post(self.url+"/connect",json=payload,headers=headers)
        except:
            return False
        print(response)
        return 0



    def mailbox_check(self):
        channel = os.environ['KIT_CHANNEL']
        topics = []
        topics = channel.split(',')
        return len(topics) - 1



    def mailbox_setup(self, boxNum):
        var = IntVar()
        boxwin = Frame(self.root)
        boxwin.pack()
        message = Message(boxwin, text="Please use Its Here App to scan the Activation Code on the Mailbox then click connect", width=500)
        message.pack()
        button = Button(boxwin, text="connect", command=lambda: var.set(1))
        button.pack()
        #wait for message on inbound
        button.wait_variable(var)
        self.scan_mailbox(boxNum)
        boxwin.destroy()

    def scan_mailbox(self, boxNum):
        subscribe(fn=self.handle_mailbox, channel='inbound')
        i = 0
        while(i<15 and self.mailbox_check()<boxNum):
            time.sleep(1)
            i = i+1
        if(self.mailbox_check()<boxNum):
            self.display_failure()
        else:
            self.activeList.append('inactive')
        unsubscribe()

    def handle_mailbox(msg):
        try:
            info('handle', str(msg))
            #if msg.get_base_name() != base_name:
            #    return

            #if(msg.get_topic() != self.get_topic()):
            #    return

            name = msg.get_name()
            if name == 'ADD_MAILBOX':
                boxinfo = msg.get_str().split(':')
                if self.mailbox_exists(boxinfo[1]):
                    return
                #boxinfo[0] = Pub_Key
                s = open('.env').read()
                s = s.replace("KIT_CHANNEL=", "KIT_CHANNEL="+os.environ['KIT_CHANNEL']+','+boxinfo[1])
                f = open('.env', 'w')
                f.write(s)
                f.close()
                self.get_env()
                print('added', name, str(msg))

        except Exception as ex:
            error('handle', str(ex))

    def mailbox_exists(self, boxKey):
        keys = os.environ['GATE_PUB_KEYS'].split(',')
        for x in keys:
            if boxKey == x:
                return True
        return False



    def sensor_setup(self,boxNum):
        print('sensor_setup')
        if(self.activeList[boxNum] == 'active'):
            return

        #subprocess.call("safebox/sensor.py", shell=True)
        sensor = mp.Process(target=lambda: self.sensor_start(boxNum))
        sensor.start()
        self.activeList[boxNum] == 'active'


    def sensor_start(self,boxNum):
        print('sensor_start')
        os.system('python safebox/sensor.py '+boxNum)
        return 0



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


    def mailboxMenu(self):
        if self.active_check() and self.mailbox_check()>0:
            kitwin = Frame(self.root)
            i = 1
            while(i<=mailbox_check):
                Message(kitwin, text="Mailbox "+i+": "+activeList[i]).pack()
                button(kitwin, text="start", command=lambda: self.sensor_setup(i)).pack()
        else:
            kitwin = Toplevel(self.root)
            kitwin.title('Kit')
            message = Message(kitwin, text="Please Activate Mailbox", width=200)
            button = Button(kitwin, text="ok", command=kitwin.destroy)
            message.pack(padx=5, pady=5)
            button.pack()





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
    #gate.get_env()
    """
    if(gate.active_check()):
        #start kit
        #start admin
        #start sensor
        print('YEAH')
    while True:
        op = gate.mainWin()
    """
    try:
        gate.mainloop()
    except KeyboardInterrupt:
        root.destroy()
        unsubscribe()
