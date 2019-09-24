
import config
import crypto
import db
import lora

status = bytearray(config.OP_STATUS_SIZE)
status[0] = config.OP_STATUS
status[1:9] = crypto.get_checksum(status)

if __name__ == "__main__":
    try:
        print('Init')
        db.init()

        print('Create Box')
        db.create_box('SOME_TEST_KEY')
        print('Create Packet')
        db.create_packet(status)
        print('Create PIN')
        db.create_pin('CONTACT_ID', 1234)

        print('Read Box')
        print(db.read_box())
        print('Read Packet')
        print(db.read_packet())
        print('Read PIN')
        print(db.read_pin())
    except Exception as ex:
        print('Error')
        print(ex)
    finally:
        print('Close')
        db.close()
