#!/usr/bin/python3
"""Python flask script to create the Crud operations for amenity"""


from flask import Flask, jsonify, make_response, abort, request
from models import storage
from models.amenity import Amenity
from api.v1.views import app_views


@app_views.route('/amenities', methods=['GET'], strict_slashes=False)
def get_amenities():
    """getting the amenities from the database"""
    amenities = storage.all(Amenity).values()
    amenities_dict = [amenities.to_dict]
    return jsonify(amenities_dict)
