"""WSGI server."""
import os
import sys

from flask import Flask, request, jsonify, send_from_directory

from .deployment import create_deployment, get_deployment_status
from .utils import create_logger

# Use the BaseApp, override the POST Notebook Endpoint
app = Flask(__name__, static_folder="build")
logger = create_logger(__name__)


@app.route("/v1/deployments", methods=["GET"])
def get_v1_deployments():
    """Handles GET requests to /v1/deployments."""
    params = request.args
    return jsonify(get_deployment_status(params))


@app.route("/v1/deployments", methods=["PUT"])
def put_v1_deployments():
    """Handles PUT requests to /v1/deployments."""
    req = request.get_json()
    return jsonify(create_deployment(req))


# Since React is a Single Page Application, we serve index.html every time
@app.route("/")
def serve_root():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path:path>", methods=["GET"])
def static_proxy(path):
    return send_from_directory(app.static_folder, path)


@app.errorhandler(404)
def page_not_found(e):
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8080"))
    app.run(host="0.0.0.0", port=port)
