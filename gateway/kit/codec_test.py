#!/usr/bin/env python

import unittest

from codec import decode, encode
from message import Message

_decoded = Message('TEST', '[{"a":"A"},{"b": "B"}]')
_encoded = 'TEST||[{"a": "A"}, {"b": "B"}]'

class TestCodec(unittest.TestCase):
    def test_decode(self):
        msg = decode(_encoded)
        self.assertEqual(msg.payload_str(), '[{"a": "A"}, {"b": "B"}]', 'decoded payload is incorrect: '+msg.payload_str())
        self.assertEqual(msg.get_topic(), 'TEST', 'decoded topic does not match')
        self.assertEqual(msg.get_payload()[1]['b'], 'B', 'incorrect payload content')

    def test_encode(self):
        data = encode(_decoded)
        self.assertEqual(data, _encoded, 'encoded content is incorrect: '+data)
        self.assertTrue('||' in data, 'encoded data did not contain the correct separator')

suite = unittest.TestLoader().loadTestsFromTestCase(TestCodec)
unittest.TextTestRunner(verbosity=2).run(suite)
