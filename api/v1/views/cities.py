#!/usr/bin/python3
"""Python flask script for crud operations on cities"""


from flask import Flask, jsonify, make_response, abort
from api.v1.views import app_views
from models.city import City
from models.state import State
from models import storage


@app_views.route('/api/v1/states/<state_id>/cities', methods=['GET'], strict_slashes=False)
def get_cities(state_id):
    state = storage.get(State, state_id)
    if state is None:
        abort(404)
    else:
        cities = [state_cities.to_dict() for state_cities in state.cities]
        return jsonify(cities)
