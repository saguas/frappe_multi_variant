# Copyright (c) 2013, Luis Fernandes and Contributors
# See license.txt

import frappe
import unittest

test_records = frappe.get_test_records('Product Template')

class TestProductTemplate(unittest.TestCase):
	pass
