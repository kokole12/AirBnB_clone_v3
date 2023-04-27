#!/usr/bin/python3
"""
return a json string from a view using jsonify from
flask module
"""
from flask import Flask, jsonify
from api.v1.views import app_views


@app_views.route('/status')
def status():
    """ Returning the json string"""
    return jsonify({"status": "Ok"})
