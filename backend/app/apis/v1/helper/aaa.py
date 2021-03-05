from flask import jsonify
from app.extensions import jwt
from functools import wraps
from flask_jwt_extended import get_jwt_identity
from flask_restful import abort
from app.models.user import User


# whenever an expired but otherwise valid access
@jwt.expired_token_loader
def my_expired_token_callback(expired_token):
    token_type = expired_token['type']
    return jsonify({
        'status': 401,
        'sub_status': 42,
        'msg': 'The {} token has expired'.format(token_type)
    }), 401




def access_control(permission_name):
    def decorator(func):
        @wraps(func)
        def decorated_function(*args, **kwargs):
            current_user = User.query.filter_by(username=get_jwt_identity()).first()
            if not current_user.can(permission_name):
                abort(404, message="No authority to access this resource")
            return func(*args, **kwargs)
        return decorated_function
    return decorator

def admin_required(func):
    return access_control('ADMINISTER')(func)

