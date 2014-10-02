from frappe import _

def get_data():
	return [
		{
            "label": _("Documents"),
            "icon": "icon-star",
		    "items": [
                {
                    "type": "doctype",
                	"name": "Domain Type",
                	"description": _("Create Variant Domain Type."),
                }
		    ]
		}
    
    ]