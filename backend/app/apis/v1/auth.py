from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended.utils import get_raw_jwt
from app.apis.v1.errors import api_abort
from flask_jwt_extended import ( 
    create_access_token, 
    create_refresh_token, 
    get_raw_jwt,
    jwt_required, 
    jwt_refresh_token_required,
    get_jwt_identity
)
from app.models.user import User, RevokedToken
from app.extensions import db, jwt
from app.apis.v1 import api_v1

@jwt.expired_token_loader
def refresh_exipired_callback(expired_token):
    print(expired_token)
    if (expired_token['type'] == 'refresh'):
        return api_abort(code=401, message="Refresh token has expired")

    return api_abort(code=401, message="Access token has expired")


class Register(Resource):
    """ 
    User register or LDAP integration
    """
    pass

class Login(Resource):
    """ 
    User login and get access token
    """

    def post(self):

        if not request.is_json:
            return api_abort(code=400, message="Missing JSON in request")

        username = request.json.get('username', None)
        password = request.json.get('password', None)

        if not username:
            return api_abort(code=400, message="Missing username parameter")

        if not password:
            return api_abort(code=400, message="Missing password parameter")

        user = User.query.filter_by(username=username).first()
        if user:
            # user exist
            if user.user_type == 1:
                # validate loacl user
                if not user.validate_password(password):
                    return api_abort(code=401, message="Bad username or password")
            elif user.user_type == 2:
                return api_abort(code=401, message="api user cannot login")
        else:
            return api_abort(code=401, message="User not existed!")

        if user.is_blocked:
            return api_abort(code=401, message="User cannot login!")



        # Identity can be any data that is json serializable
        access_token = create_access_token(identity=username)
        refresh_token = create_refresh_token(identity=username)
        response = jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'username': user.username,
            'email': user.email,
            'id': user.id,
            'authority': user.role.name
        })
        # response.headers['Cache-Control'] = 'no-store'
        # response.headers['Pragma'] = 'no-cache'
        
        return response

class CreateAPITOken(Resource):
    """ 
    create api token
    """

    def post(self):

        if not request.is_json:
            return api_abort(code=400, message="Missing JSON in request")

        username = request.json.get('username', None)
        password = request.json.get('password', None)

        if not username:
            return api_abort(code=400, message="Missing username parameter")

        if not password:
            return api_abort(code=400, message="Missing password parameter")

        user = User.query.filter_by(username='airflow').first()
        if not user or not user.validate_password(password):
            return api_abort(code=401, message="Bad username or password")

        # Identity can be any data that is json serializable
        token = create_access_token(identity=username, expires_delta=False)
        response = jsonify({
            'token': token
        })
        # response.headers['Cache-Control'] = 'no-store'
        # response.headers['Pragma'] = 'no-cache'
        
        return response

    
class Logout(Resource):
    """ 
    User logout and revoke token
    """

    @jwt_required
    def post(self):

        jti = get_raw_jwt()['jti']

        try:
            # revoke access token
            revoked_token = RevokedToken(jti=jti)
            db.session.add(revoked_token)
            db.session.commit()
            return api_abort(code=200, message="Access token has been revoked")
        except:
            return api_abort(code=500, message="Logout error")

class UserLogoutRefresh(Resource):
    """
    User Logout Refresh Api 
    """
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()['jti']

        try:
            revoked_token = RevokedToken(jti=jti)
            db.session.add(revoked_token)
            db.session.commit()

            return api_abort(code=200, message="Refresh token has been revoked")
        except:
            return api_abort(code=500, message="Logout error")

class TokenRefresh(Resource):
    """
    Token Refresh Api
    """

    @jwt_refresh_token_required
    def post(self):

        # Generating new access token
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)


        return {'access_token': access_token}

api_v1.add_resource(Login, '/auth/login')
api_v1.add_resource(Logout, '/auth/logout')
api_v1.add_resource(TokenRefresh, '/auth/refresh')
api_v1.add_resource(CreateAPITOken, '/auth/api')
