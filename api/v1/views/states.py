#!/usr/bin/python3
""" Python flask view for managing the state resource"""

from flask import Flask, jsonify, abort, request
from api.v1.views import app_views
from models import storage
from models.state import State


@app_views.route("/api/v1/states", methods=['GET'], strict_slashes=False)
def get_states():
    """Returning all the states"""
    states = storage.all(State).values()
    states_dict = [state.to_dict() for state in states]
    return jsonify(states_dict)


@app_views.route("/api/v1/states/<state_id>", methods=['GET'], strict_slashes=False)
def get_state(state_id):
    state = storage.get(State, state_id)
    if state is None:
        abort(404)
    return jsonify(state.to_dict())


@app_views.route("/api/v1/states/<state_id>", methods=['DELETE'], strict_slashes=False)
def delete_state(state_id):
    """deletes the state from the database"""
    state = storage.get(State, state_id)
    if state is None:
        abort(404)
    state.delete()
    storage.save()
    return jsonify({})


@app_views.route("/api/v1/states", methods=['POST'], strict_slashes=False)
def create_state():
    if not request.get_json():
        """ TO DO --write logic to create a new state"""
        pass
