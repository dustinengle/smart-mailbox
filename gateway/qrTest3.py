import pyqrcode
from Tkinter import *
import tkMessageBox
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
        def on_closing():
            if tkMessageBox.askokcancel("Quit", "Do you want to quit?\n(This will shutdown communication with any Mailboxes)"):
                self.stop()
                root.destroy()

        root.protocol("WM_DELETE_WINDOW", on_closing)
        self.url = "http://165.22.183.203:10000/v1"
        self.root = root
        self.controller = Controller()
        self.pw = ''
        self.get_env()
        self.currentWin = 'START'
        menu = Menu(self.root)
        #menu.add_command(label="Kit", command = self.adminMenu)
        menu.add_command(label="Mailbox", command = self.mailboxMenu)
        #menu.add_command(label="Help")
        self.root.config(menu=menu)
        self.root.geometry("500x500")
        self.activeList = []
        keys = os.environ['GATE_PUB_KEYS'].split(',')
        for x in keys:
            self.activeList.append('REGISTERED')
        #print(self.activeList)
        self.pack()
        self.startScreen()

    def stop(self):
        try:
            print(self.kit.is_alive())
            print(self.controller.running)
            if(self.kit.is_alive() == True):
                self.controller.stop()
                self.kit.terminate()
                self.kit.join()
        except:
            print('kit undefined')

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
            while(self.check_pw(pw) == False):
                try:
                    pw = self.enter_pw()
                except:
                    print('password invalid')

        """
        self.controller.setup(pw)
        self.controller.start()
        self.pw = pw
        """
        self.kit = mp.Process(target=lambda: self.kit_start(pw,self.controller))
        self.kit_setup(pw)
        self.pw = pw
        #self.sensor = mp.Process(target=lambda: self.sensor_start())
        #self.sensor_setup()


        if(os.environ['KIT_REGISTERED'] != '1'):
            self.send_register()
            s = open('.env').read()
            s = s.replace("KIT_REGISTERED=", "KIT_REGISTERED=1")
            f = open('.env', 'w')
            f.write(s)
            f.close()
            self.get_env()
            #time.sleep(30)

        while(self.mailbox_check() <= 0):
            print('?')
            self.mailbox_setup(1)
            #self.scan_mailbox(1)
            time.sleep(1)
            #restart kit

        self.mailboxMenu()
        #self.adminMenu()



    def active_check(self):
        return os.environ['KIT_CHANNEL'] != '' and os.environ['KIT_DEVICE_ID'] != '' and os.environ['KIT_DEVICE_KEY'] != ''


    def activate(self):
        gID = self.get_gatewayID()
        if(not self.active_check()):
            self.display_qr(gID, 'Gateway')
            self.handle_activate(gID)

    def get_gatewayID(self):
        if(os.environ['GATE_PUB_KEYS'] == ''):
            self.gen_key()
        return os.environ['GATE_PUB_KEYS'].split(',')[0]

    def gen_key(self):
        priv, verifying_key = ed25519.create_keypair()
        print(verifying_key)
        vkey_hex = verifying_key.to_ascii(encoding="hex")
        s = open('.env').read()
        s = s.replace("GATE_PUB_KEYS=", "GATE_PUB_KEYS="+vkey_hex)
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
            seed = decrypt(data, _password)
            if seed[0] == 'S':
                return True
            else:
                return False
        except:
            return False
            raise Exception('Decryption of secret data failed, password incorrect!')




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
        kitwin = Frame(self.root)
        kitwin.pack()
        Message(kitwin, text="Kit Starting. Please wait.").pack()
        self.kit.start()
        self.activeList[0] = 'ACTIVE'
        time.sleep(5)
        kitwin.destroy()
        print 'kit end'
        #self.send_register()

    def kit_start(self, pw=None, controller=Controller()):
        print('kit_setup')
        #controller = self.controller
        #controller = Controller()

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
        channel = os.environ['GATE_PUB_KEYS']
        topics = channel.split(',')
        return len(topics) - 1



    def mailbox_setup(self, boxNum):
        self.currentWin = 'MAILBOX_SETUP'
        var = IntVar()
        boxwin = Frame(self.root)
        boxwin.pack()
        message = Message(boxwin, text="Please use Its Here App to scan the Activation Code on the Mailbox. Only click continue once the code is scanned.", width=500)
        message.pack()
        button = Button(boxwin, text="Continue", command=lambda: var.set(1))
        button.pack()
        #wait for message on inbound
        scan = mp.Process(target=lambda: self.scan_mailbox(boxNum))
        scan.start()
        print(var.get())
        button.wait_variable(var)
        scan.terminate()
        scan.join()
        unsubscribe()
        boxwin.destroy()
        if(self.mailbox_check() >= boxNum):
            return
        else:
            boxChan = self.get_box_channel(boxNum)
            if(boxChan != ''):
                s = open('.env').read()
                s = s.replace("KIT_CHANNEL="+os.environ['KIT_CHANNEL'], "KIT_CHANNEL="+os.environ['KIT_CHANNEL']+','+boxChan)
                f = open('.env', 'w')
                f.write(s)
                f.close()
                self.get_env()
                self.kit.terminate()
                self.kit.join()
                self.kit = mp.Process(target=lambda: self.kit_start(self.pw))
                self.kit.start()
                #self.sensor.terminate()
                #self.sensor.join()
                self.sensor = mp.Process(target=lambda: self.sensor_start())
                self.sensor.start()
                self.activeList.append('REGISTERED')
                #self.sensor_setup(boxNum)
            else:
                return


    def scan_mailbox(self,boxNum):
        print('scan')

        def handle_mailbox(msg):
            print('in here............')
            try:
                info('handle', str(msg))
                name = msg.get_name()
                print(name)
                if name == 'ADD':
                    boxinfo = msg.get_str()
                    print(boxinfo)
                    if self.mailbox_exists(boxinfo):
                        print('mailbox_exists')
                        return
                    #boxinfo[0] = Pub_Key
                    s = open('.env').read()
                    s = s.replace("GATE_PUB_KEYS="+os.environ['GATE_PUB_KEYS'], "GATE_PUB_KEYS="+os.environ['GATE_PUB_KEYS']+','+boxinfo)
                    #s = s.replace("KIT_CHANNEL="+os.environ['KIT_CHANNEL'], "KIT_CHANNEL="+os.environ['KIT_CHANNEL']+','+self.get_box_channel(boxNum))
                    f = open('.env', 'w')
                    f.write(s)
                    f.close()
                    #look up activate to get mailbox channel
                    self.get_env()
                    print('added', name, str(msg))

            except Exception as ex:
                error('handle', str(ex))

        subscribe(fn=handle_mailbox, channel='inbound')
        while(self.mailbox_check()<boxNum):
            get_message()
            #time.sleep(.5)
        unsubscribe()



    def mailbox_exists(self, boxKey):
        keys = os.environ['GATE_PUB_KEYS'].split(',')
        for x in keys:
            if boxKey == x:
                return True
        return False


    def get_box_channel(self, boxNum):
        ts = int(time.time())
        sig = str(self.sign(str(ts)))
        #headers = json.loads(json.dumps({'Content-Type':'application/json','Authorization':sig}))
        headers = json.loads('{"Content-Type":"application/json","Authorization":"'+sig+'"}')
        payload = json.loads('{"publicKey":"'+self.get_gatewayID()+'","timestamp":"'+str(ts)+'"}')
        try:
            response = requests.post(self.url+"/activate",json=payload,headers=headers)
            json_response = response.json()
        except:
            return ''
        #print(json_response['result']['deviceId'])
        try:
            data = json_response['result']['mailboxes'][boxNum-1]
            print(data)
            print('ok')
            return data['channelId']
        except:
            return ''



    def sensor_setup(self):
        print('sensor_setup')
        #subprocess.call("safebox/sensor.py", shell=True)
        self.sensor.start()


    def sensor_start(self):
        print('sensor_start')
        os.system('python safebox/sensor.py')
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
        if self.active_check() and self.mailbox_check()>0 and self.currentWin != 'MAILBOX':
            self.currentWin = 'MAILBOX'
            var = IntVar()
            print('Mailbox Menu')
            kitwin = Frame(self.root)
            kitwin.pack()
            i = 1
            listbox = Listbox(kitwin)
            listbox.pack()
            while(i<=self.mailbox_check()):
                boxText = "Mailbox "+str(i)+": "+self.activeList[i]
                listbox.insert(END, boxText)
                i+=1

            newMailbox = Button(kitwin, text="Add Mailbox", command=lambda: [kitwin.destroy(), self.mailbox_setup(self.mailbox_check()+1)])
            newMailbox.pack()
            button = Button(kitwin, text="Done", command=lambda: var.set(1))
            button.pack()
            button.wait_variable(var)
            self.currentWin = 'START'
            kitwin.destroy()

        else:
            kitwin = Toplevel(self.root)
            kitwin.title('Kit')
            message = Message(kitwin, text="Please Activate Mailbox", width=200)
            button = Button(kitwin, text="ok", command=kitwin.destroy)
            message.pack(padx=5, pady=5)
            button.pack()



if __name__ == '__main__':
    root = Tk()
    #gate.get_env()
    gate = Gateway(root=root)
    try:
        gate.mainloop()
    except:
        root.destroy()
        unsubscribe()
