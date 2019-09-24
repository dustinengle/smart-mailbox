
import binascii
import sqlite3
import time

conn = sqlite3.connect('safebox.db')
cur = conn.cursor()

def close():
    conn.close()

def init():
    cur.execute('CREATE TABLE IF NOT EXISTS boxes (key)')
    cur.execute('CREATE TABLE IF NOT EXISTS packets (op, data, time)')
    cur.execute('CREATE TABLE IF NOT EXISTS pins (contact, pin)')

    conn.commit()

def create_box(key):
    print(key)
    cur.execute('INSERT INTO boxes VALUES (?)', (key,))
    conn.commit()

def create_packet(packet):
    op = binascii.hexlify(str(packet[0])
    data = binascii.hexlify(packet[1:])
    cur.execute('INSERT INTO packets VALUES (?, ?, ?)', (op), data, int(time.time()),))
    conn.commit()

def create_pin(contact, pin):
    cur.execute('INSERT INTO pins VALUES (?, ?)', (contact, pin,))
    conn.commit()

def read_box():
    cur.execute('SELECT * FROM boxes')
    return cur.fetchall()

def read_packet():
    cur.execute('SELECT * FROM packets')
    return cur.fetchall()

def read_pin():
    cur.execute('SELECT * FROM pins')
    return cur.fetchall()

def update_box(key):
    print(key)
    cur.execute('UPDATE boxes SET key = ?', (key,))
    conn.commit()

def update_pin(contact, pin):
    cur.execute('UPDATE pins SET pin = ? WHERE contact = ?', (contact, pin,))
    conn.commit()
