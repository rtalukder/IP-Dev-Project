# Please note that MONGO_HOST and MONGO_PORT could very well be left
# out as they already default to a bare bones local 'mongod' instance.
# MONGO_HOST = 'localhost'
MONGO_PORT = 27017

# Skip these if your db has no auth. But it really should.
MONGO_USERNAME = 'rtalukder'
MONGO_PASSWORD = 'password' 

# Skip these if your db has no auth. But it really should.

MONGO_DBNAME = 'jupyter_notebooks'

# Enable reads (GET), inserts (POST) and DELETE for resources/collections
# (if you omit this line, the API will default to ['GET'] and provide
# read-only access to the endpoint).
RESOURCE_METHODS = ['GET', 'POST', 'DELETE']

# Enable reads (GET), edits (PATCH), replacements (PUT) and deletes of
# individual items  (defaults to read-only item access).
ITEM_METHODS = ['GET', 'PATCH', 'PUT', 'DELETE']

# API for salaried employees
salaried = {
    "item_title": "salaried_employees",

    "additional_lookup": {
        'url': 'regex("[\w]+")',
        'field': 'name'   
    },

    "resource_methods": ["GET", "POST"],

    "schema": {
        "name": {
            "type": "string"
        },

        "salary_or_hourly": {
            "type": "string"
        },

        "full_or_part_time": {
            "type": "string"
        },

        "annual_salary": {
            "type": "string"
        },

        "department": {
            "type": "string"
        },

        "job_titles": {
            "type": "string"
        }
    }
}

hourly = {
    "item_title": "hourly_employees",

    "additional_lookup": {
        'url': 'regex("[\w]+")',
        'field': 'name'   
    },

    "resource_methods": ["GET", "POST"],

    "schema": {
        "typical_hours": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },

        "salary_or_hourly": {
            "type": "string"
        },

        "full_or_part_time": {
            "type": "string"
        },

        "department": {
            "type": "string"
        },

        "job_titles": {
            "type": "string"
        },

        "hourly_rate": {
            "type": "string"
        }

    }
}

DOMAIN = {
    "salaried": salaried,
    "hourly": hourly,
}