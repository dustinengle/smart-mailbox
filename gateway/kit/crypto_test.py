#!/usr/bin/env python

import unittest

from crypto import decrypt, encrypt, hash

_hash = '5de71b2143c86cd2e0c801830ed729e7ef2f8f478b454d7d3e9dd5a86a92b255'
_msg = 'TESTING'
_pw = "!1@2#3$4%5^6&7*8"

class TestCrypto(unittest.TestCase):
    def test_decrypt(self):
        pass

    def test_encrypt(self):
        cipher = encrypt(_msg, _pw)
        text = decrypt(cipher, _pw)
        self.assertEqual(text, _msg, 'encryption not equal: '+text+' != '+_msg)

    def test_hash(self):
        h = hash(_msg)
        self.assertEqual(h, _hash, 'hash does not equal: '+h+' != '+_hash)

suite = unittest.TestLoader().loadTestsFromTestCase(TestCrypto)
unittest.TextTestRunner(verbosity=2).run(suite)
