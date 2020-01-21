import unittest

import pytest

from platiagro.api import ping, get_deployment, post_deployment


class ApiTestCase(unittest.TestCase):
    def test_ping(self):
        self.assertEqual(ping(), "pong")

    def test_get_deployment(self):
        self.assertEqual(get_deployment(), "{\"status\": \"PROVISIONING\"}")

    def test_put_deployment(self):
        self.assertEqual(put_deployment(), "{\"status\": \"PROVISIONING\"}")
