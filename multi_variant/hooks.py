app_name = "multi_variant"
app_title = "Multi Variant"
app_publisher = "Luis Fernandes"
app_description = "Create products from domain and type descriptions"
app_icon = "icon-sitemap"
app_color = "#99CC99"
app_email = "luisfmfernandes@gmail.com"
app_url = "http://localhost"
app_version = "0.0.1"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/multi_variant/css/multi_variant.css"
# app_include_js = "/assets/multi_variant/js/multi_variant.js"
app_include_js = "/assets/multi_variant/js/patch_refresh.js"
# include js, css files in header of web template
# web_include_css = "/assets/multi_variant/css/multi_variant.css"
# web_include_js = "/assets/multi_variant/js/multi_variant.js"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "multi_variant.install.before_install"
# after_install = "multi_variant.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "multi_variant.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.core.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.core.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"multi_variant.tasks.all"
# 	],
# 	"daily": [
# 		"multi_variant.tasks.daily"
# 	],
# 	"hourly": [
# 		"multi_variant.tasks.hourly"
# 	],
# 	"weekly": [
# 		"multi_variant.tasks.weekly"
# 	]
# 	"monthly": [
# 		"multi_variant.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "multi_variant.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.core.doctype.event.event.get_events": "multi_variant.event.get_events"
# }

fixtures = [
    "Item Group"
]

