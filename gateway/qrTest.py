import pyqrcode
import Tkinter as tk
import kit.env as env
import os
#import threading

class Gateway():
    def __init__(self, root):
        self.root = root
        self.running = True
        self.get_env()

    def get_env(self):
        print 'info:main: loading .env file'
        env.load('.env')

    def mainWin(self):
        menu = tk.Menu(self.root)

        input = 'test stuff'
        code_bmp = tk.BitmapImage(data=self.gen_qr(input))
        code_bmp.config(background='white')
        label = tk.Label(self.root, image=code_bmp)
        menu.add_command(label="Kit", command = self.adminMenu)
        menu.add_command(label="Mailbox")
        menu.add_command(label="Help")
        self.root.config(menu=menu)
        label.pack()

        self.root.update_idletasks()
        self.root.update()

        if (not self.active_check()):
            self.activate()
            return 0

        while(self.running):
            self.root.update_idletasks()
            self.root.update()

    def close(self):
        self.running = False

    def active_check(self):
        return os.environ['KIT_CHANNEL'] != '' and os.environ['KIT_DEVICE_ID'] != '' and os.environ['KIT_DEVICE_KEY'] != ''

    def gen_qr(self, qr):
        code = pyqrcode.create(qr)
        code_xbm = code.xbm(scale=5)
        return code_xbm

    def adminMenu(self):
        kitwin = tk.Toplevel(self.root)
        if self.active_check():
            button = tk.Button(kitwin, text="Start admin")
            button.pack()
        else:
            kitwin.title('Kit')
            message = tk.Message(kitwin, text="Please Activate Gateway", width=200)
            button = tk.Button(kitwin, text="ok", command=kitwin.destroy)
            message.pack(padx=5, pady=5)
            button.pack()

    def activate(self):
        gID = self.get_gatewayID()
        mID = self.get_mailbox()
        if(not self.active_check()):
            self.display_qr(gID, 'Gateway')
            self.display_qr(mID, 'Mailbox')
            self.appendEnv(gID, mID)
            self.get_env()
            self.display_activated()

    def appendEnv(self, gID, mID):
        #send request to api/Activate
        #append env with response
        return 0

    def get_gatewayID(self):
        gatewayID = '123456'
        return gatewayID

    def get_mailbox(self):
        mailboxID = '654321'
        return mailboxID

    def display_qr(self, id, box):
        actwin = tk.Toplevel(self.root)
        actwin.title('Activate')
        message = tk.Message(actwin, text="Scan "+box+" code with mobile app", width=200)
        code_bmp = tk.BitmapImage(data=self.gen_qr(id))
        code_bmp.config(background='white')
        qr = tk.Label(actwin, image=code_bmp)
        button = tk.Button(actwin, text="ok", command=self.close)
        message.pack(padx=5, pady=5)
        button.pack()
        qr.pack()
        while(self.running):
            self.root.update_idletasks()
            self.root.update()
        actwin.destroy()
        self.running = True

    def display_activated(self):
        actwin = tk.Toplevel(self.root)
        actwin.title('Activate')
        message = tk.Message(actwin, text="Gateway is now activated", width=200)
        button = tk.Button(actwin, text="ok", command=self.close)
        message.pack(padx=5, pady=5)
        button.pack()
        while(self.running):
            self.root.update_idletasks()
            self.root.update()
        actwin.destroy()
        self.running = True


#root = tk.Tk()
#menu = tk.Menu(root)
# Bitmaps are accepted by lots of Widgets
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
    root = tk.Tk()
    gate = Gateway(root)
    if(gate.active_check()):
        #start kit
        #start admin
        #start sensor
        print('YEAH')
    while True:
        op = gate.mainWin()
