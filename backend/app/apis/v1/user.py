from flask import jsonify, request, current_app
from flask_restful import Resource, url_for, reqparse, abort, inputs
from flask_jwt_extended import ( 
    jwt_required, 
    get_jwt_identity
)
from app.models.user import User, Role
from app.extensions import db
from app.apis.v1 import api_v1
from app.apis.v1.schemas import user_schema, users_schema
from app.apis.v1.helper.aaa import access_control
from app.apis.v1.helper.utils import ( 
    abort_if_item_id_invalid,
    abort_if_item_doesnt_exit
    
)

def abort_if_user_exit_or_str_invalid(s, query_class):
    """
    check stirng is empty or blank, or user already existed!
    """
    if s is None or str(s).strip() == '':
        raise ValueError("The hostname was empty or invalid.")
    item = query_class.query.filter_by(username=s).first()
    if item:
        raise ValueError("Duplicated user.")
    return s

def create_user_args():
    """
    parse create user prop in request
    """
    parser = reqparse.RequestParser()
    parser.add_argument('username', required=True, type=lambda s: abort_if_user_exit_or_str_invalid(s, User), help="The user already existed or username was invalid.")
    parser.add_argument('role',required=True, type=lambda item_id: abort_if_item_id_invalid(item_id, Role), help="The role was empty or invalid.")
   
    parser.add_argument('password', default='', required=False, type=str, help='password was invalid')
    parser.add_argument('phone', default='', required=False, type=str, help='phone was invalid')
    parser.add_argument('email', default='', required=False, type=str, help='email was invalid')
    parser.add_argument('desc', default='', required=False, type=str, help='desc was invalid')

    parser.add_argument('user_type', required=True, type=int, help='user_type was invalid')


    return parser.parse_args()

def update_user_args():
    """
    parse user prop in request 
    """
    parser = reqparse.RequestParser()
    parser.add_argument('role', type=lambda item_id: abort_if_item_id_invalid(item_id, Role), help="The role was empty or invalid.")
    parser.add_argument('password', required=False, type=str, help='password was invalid')
    parser.add_argument('phone', required=False, type=str, help='phone was invalid')
    parser.add_argument('email', required=False, type=str, help='email was invalid')
    parser.add_argument('desc', required=False, type=str, help='desc was invalid')
    parser.add_argument('is_blocked', required=False, type=inputs.boolean, help='')

    return parser.parse_args()




class User_API(Resource):
    """ 
    Get User Details API
    """

    @jwt_required
    @access_control("ADMINISTER")
    def get(self, user_id):
        """Get Info."""
        user = User.query.get_or_404(user_id)
        return jsonify(user_schema(user))

    @jwt_required
    @access_control("ADMINISTER")
    def put(self, user_id):
        """Edit User."""
        args = update_user_args()
        user = abort_if_item_doesnt_exit(user_id, User)
        try:
            if user.user_type == 1 or user.user_type == 2:
                if args['password'] != '' and args['password']:
                    user.set_password(args['password'])
            user.email = args['email'] if args['email'] else user.email
            user.phone = args['phone'] if args['phone'] else user.phone
            user.desc = args['desc'] if args['desc'] else user.desc
            if user.username == get_jwt_identity() or user.username == 'admin' or user.username == 'airflow':
                # can not eidt self, admin and airflow user
                pass
                # return abort(404, message="can not change this option")
            else:
                user.role = user.role =  args['role'] if args['role'] else user.role
                user.is_blocked = args['is_blocked'] if args['is_blocked'] != None else user.is_blocked


            db.session.commit()
            return jsonify(user_schema(user))
        except Exception as e:
            print(e)
            return {'message': 'edit item error'}, 403

    @jwt_required
    @access_control("ADMINISTER")
    def delete(self, user_id):
        """Delete user."""
        user = abort_if_item_doesnt_exit(user_id, User)
        # prevent delete self, admin and airflow api user
        if user.username == get_jwt_identity() or user.username == 'admin' or user.username == 'airflow':
            abort(404, message="Can not delete the user")

        db.session.delete(user)
        db.session.commit()
        return '', 204

class Users_API(Resource):
    """ 
    All Users
    """

    @jwt_required
    @access_control("ADMINISTER")
    def get(self):
        """Get all user items."""
        page = request.args.get('page', 1, type=int)
        per_page = current_app.config['ITEM_PER_PAGE']
        pagination = User.query.paginate(page, per_page)
        items = pagination.items
        current = url_for('.users_api', page=page, _external=True)
        prev = None
        if pagination.has_prev:
            prev = url_for('.users_api', page=page - 1, _external=True)
        next = None
        if pagination.has_next:
            next = url_for('.users_api', page=page + 1, _external=True)
        return jsonify(users_schema(items, current, prev, next, pagination))

    @jwt_required
    @access_control("ADMINISTER")
    def post(self):
        """Create new user."""
        args = create_user_args()
        user_type = args['user_type']
        if user_type == 3:
            is_validate = LdapConnection().get_user(username=args['username'])
            if is_validate:
                user = User(username=args['username'])
                user.user_type = 3
                db.session.add(user)
            else:
                abort(404, message="AD user not found")

        else:   
            user = User(username=args['username'])
            user.set_password(args['password'])
            user.user_type = args['user_type']
            db.session.add(user)

        
        if user:
            user.email = args['email']
            user.phone = args['phone']
            user.desc = args['desc']
            user.role =  args['role']
            

        db.session.commit()
        response = jsonify(user_schema(user))
        response.status_code = 201
        response.headers['Location'] = url_for('.user_api', user_id=user.id, _external=True)
        return response



api_v1.add_resource(Users_API, '/users')
api_v1.add_resource(User_API, '/user/<int:user_id>')

