# Please note that MONGO_HOST and MONGO_PORT could very well be left
# out as they already default to a bare bones local 'mongod' instance.
# MONGO_HOST = 'localhost'
MONGO_PORT = 27017

# Skip these if your db has no auth. But it really should.
MONGO_USERNAME = 'rtalukder'
MONGO_PASSWORD = 'password' 

# Skip these if your db has no auth. But it really should.

MONGO_DBNAME = 'web_client'

# Enable reads (GET), inserts (POST) and DELETE for resources/collections
# (if you omit this line, the API will default to ['GET'] and provide
# read-only access to the endpoint).
RESOURCE_METHODS = ['GET', 'POST', 'DELETE']

# Enable reads (GET), edits (PATCH), replacements (PUT) and deletes of
# individual items  (defaults to read-only item access).
ITEM_METHODS = ['GET', 'PATCH', 'PUT', 'DELETE']

X_DOMAINS = '*'
X_HEADERS = ['Authorization', 'If-Match', 'Access-Control-Expose-Headers', 'Content-Type', 'Pragma', 'Cache-Control']
X_EXPOSE_HEADERS = ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']

# APi for users
users = {
    # 'title' tag used in item links. Defaults to the resource title minus
    # the final
    'item_title': 'user',

    # by default the standard item entry point is defined as
    # '/users/<ObjectId>'. We leave it untouched, and we also enable an
    # additional read-only entry point. This way consumers can also perform
    # GET requests at '/users/<username>'.
    'additional_lookup': {
        'url': 'regex("[\w]+")',
        'field': 'username'
    },

    # We choose to override global cache-control directives for this resource.
    'cache_control': 'max-age=10,must-revalidate',
    'cache_expires': 10,

    # most global settings can be overridden at resource level
    'resource_methods': ['GET', 'POST', 'DELETE'],

    'schema': {
        'firstname': {
            'type': 'string',
            'minlength': 1,
            'maxlength': 10,
        },

        'lastname': {
            'type': 'string',
            'minlength': 1,
            'maxlength': 15,
        },

        "username": {
            "type": "string",
            'minlength': 3,
            "maxlength": 15,
            # talk about hard constraints! For the purpose of the demo
            # 'username' is an API entry-point, so we need it to be unique.
            'required': True,
            "unique": True

            # line below commented for testing purposes. don't want to 
            # keep deleting documents in the 'users' collection
            #'unique': True,
        },

        "password": {
            "type": "string",
            "required": True,
        },

        # 'role' is a list, and can only contain values from 'allowed'.
       # 'role': {
       #      'type': 'list',
       #      'allowed': ["author", "contributor", "copy"],
       #  },

       #  # An embedded 'strongly-typed' dictionary.
       #  'location': {
       #      'type': 'dict',
       #      'schema': {
       #          'address': {'type': 'string'},
       #          'city': {'type': 'string'}
       #      },
       #  },
    }
}

item = {
    "MONGO_QUERY_BLACKLIST": ['$where'],
    "schema": {
        # adding a basic item into the database
        "information": {
            "type": "string",
            "minlength": 1,
            "maxlength": 3000
        },

        # look for the entries this user has made
        "username": {
            "type": "string"
        }
    }
}

DOMAIN = {
    'users': users,
    "item": item,
}