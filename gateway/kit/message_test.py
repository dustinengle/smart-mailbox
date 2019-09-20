#!/usr/bin/env python

import os
import unittest

from env import load
from message import Message

class TestMessage(unittest.TestCase):
    def setUp(self):
        load('.env')
        os.environ['KIT_DEBUG'] = '0'
        self.msg = Message("TEST_TOPIC", [{'bn': 'TEST_', 'n': 'ING', 'u': 'test', 'vs': 'testing'}])

    def tearDown(self):
        self.msg = None

    def test_for_device(self):
        self.assertEqual(self.msg.for_device(), False, 'for device should fail in test')

    def test_get_base_name(self):
        self.assertEqual(self.msg.get_base_name(), 'TEST_', 'base name does not match')

    def test_get_bool(self):
        self.assertIsNone(self.msg.get_bool(), 'there should not be a bool value in the message')

    def test_get_name(self):
        self.assertEqual(self.msg.get_name(), 'ING', 'message name is incorrect')

    def test_get_payload(self):
        self.assertIsNotNone(self.msg.get_payload(), 'payload should not be none')

    def test_get_str(self):
        self.assertEqual(self.msg.get_str(), 'testing', 'incorrect string value returned')

    def test_get_topic(self):
        self.assertEqual(self.msg.get_topic(), 'TEST_TOPIC', 'incorrect topic returned')

    def test_get_unit(self):
        self.assertEqual(self.msg.get_unit(), 'test', 'unit type does not match')

    def test_get_value(self):
        self.assertIsNone(self.msg.get_value(), 'message value should be none')

    def test_is_valid(self):
        self.assertTrue(self.msg.is_valid(), 'a valid message was provided')

    def test_payload_str(self):
        self.assertTrue(isinstance(self.msg.payload_str(), basestring), 'payload string is not of string type')

suite = unittest.TestLoader().loadTestsFromTestCase(TestMessage)
unittest.TextTestRunner(verbosity=2).run(suite)

