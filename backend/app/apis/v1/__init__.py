from flask import Blueprint, current_app
from flask_cors import CORS
from flask_restful import Api

class CustomApi(Api):
    def handle_error(self, e):
        for val in current_app.error_handler_spec.values():
            for handler in val.values():
                registered_error_handlers = list(filter(lambda x: isinstance(e, x), handler.keys()))
                if len(registered_error_handlers) > 0:
                    raise e
        return super().handle_error(e)

api_bp = Blueprint('api_v1', __name__)

CORS(api_bp)
api_v1 = CustomApi(api_bp)

from app.apis.v1 import resources