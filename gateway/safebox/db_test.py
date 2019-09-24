
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
        print('Read Box')
        print(db.read_box())

        print('Create Packet')
        db.create_packet(status)
        print('Read Packet')
        print(db.read_packet())

        print('Create PIN')
        db.create_pin('CONTACT_1', 1111)
        db.create_pin('CONTACT_2', 2222)
        db.create_pin('CONTACT_3', 3333)
        print('Read PIN')
        print(db.read_pin())
        print('Delete PIN')
        db.delete_pin('CONTACT_2')
        print('Read PIN')
        print(db.read_pin())
    except Exception as ex:
        print('Error')
        print(ex)
    finally:
        print('Close')
        db.close()
