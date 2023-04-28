#!/usr/bin/python3
"""Python flask app.py file to handle blue prints"""
from flask import Flask, make_response, jsonify
from models import storage
from api.v1.views import app_views
from os import getenv


app = Flask(__name__)
app.register_blueprint(app_views)


@app.teardown_appcontext
def teardown(self):
    """tearing down the db instance"""
    storage.close()


@app.errorhandler(404)
def not_found(error):
    """handling the 404 error with a custom response"""
    return make_response(jsonify({'error': 'Not found'}), 404)


if __name__ == "__main__":
    host = getenv("HBNB_API_HOST", default='0.0.0.0')
    port = getenv("HBNB_API_PORT", default='5000')
    app.run(host, port=int(port), threaded=True)
