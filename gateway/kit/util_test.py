#!/usr/bin/env python

import unittest

from util import ID, JSON

_bad = '{sutff: "as"'
_good = '[{"a":"A"},{"b": "B"}]'

class TestUtil(unittest.TestCase):
    def test_ID(self):
        id = ID()
        self.assertIsNotNone(id, 'id should not return none')
        self.assertTrue(isinstance(id, basestring), 'id should be of type string')

    def test_JSON(self):
        js = JSON(_bad)
        self.assertIsNone(js, 'bad json should be none')

        js = JSON(_good)
        self.assertIsNotNone(js, 'good json should not be none')

suite = unittest.TestLoader().loadTestsFromTestCase(TestUtil)
unittest.TextTestRunner(verbosity=2).run(suite)
