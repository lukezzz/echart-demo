from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db

# RBAC model
roles_permissions = db.Table('network_dev_ops_roles_permissions', 
    db.Column('role_id', db.Integer, db.ForeignKey('network_dev_ops_role.id')),
    db.Column('permission_id', db.Integer, db.ForeignKey('network_dev_ops_permission.id'))
    )

class Permission(db.Model):
    __tablename__ = 'network_dev_ops_permission'
    


    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True)
    roles = db.relationship('Role', secondary=roles_permissions, back_populates="permissions")

class Role(db.Model):
    __tablename__ = 'network_dev_ops_role'
    

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True)
    permissions = db.relationship('Permission', secondary=roles_permissions, back_populates='roles')
    users = db.relationship('User', back_populates='role')

    @staticmethod
    def init_role():
        roles_permissions_map = {
            'viewer': ['VIEWONLY'],
            'user': ['VIEWONLY', 'READONLY', 'CREATE', 'CHANGE', 'DELETE'],
            'admin': ['VIEWONLY', 'READONLY', 'CREATE', 'CHANGE', 'DELETE', 'ADMINISTER']
        }

        for role_name in roles_permissions_map:
            role = Role.query.filter_by(name=role_name).first()
            if role is None:
                role = Role(name=role_name)
                db.session.add(role)
            role.permissions = []
            for permission_name in roles_permissions_map[role_name]:
                permission = Permission.query.filter_by(name=permission_name).first()
                if permission is None:
                    permission = Permission(name=permission_name)
                    db.session.add(permission)
                role.permissions.append(permission)
        db.session.commit()

# user model
class User(db.Model):
    __tablename__ = 'network_dev_ops_user'
    

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(191), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    email = db.Column(db.String(191), default="")
    phone = db.Column(db.String(20), default="")
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    desc = db.Column(db.String(191), default="")

    locale = db.Column(db.String(20))

    is_blocked = db.Column(db.Boolean, default=False)
    user_type = db.Column(db.Integer, default=1)

    role_id = db.Column(db.Integer, db.ForeignKey('network_dev_ops_role.id'))
    role = db.relationship('Role', back_populates='users')


    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def validate_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __init__(self, username):
        """
        :param username: username, must be unique.
        """
        self.username = username


        super(User, self).__init__()
        self.set_role()
        # self.set_satistics()
        # self.generate_avator() 

    def set_role(self):
        
        if self.role is None: 
            self.role = Role.query.filter_by(name='viewer').first()
            db.session.commit()

    @property
    def is_admin(self):
        return self.role.name == 'admin' 
    
    def can(self, permission_name):
        permission = Permission.query.filter_by(name=permission_name).first()
        return permission is not None and self.role is not None and permission in self.role.permissions

    def __repr__(self):
        return "<User: id={}, username={}, role={}>".format(self.id, self.username, self.role.name)

class RevokedToken(db.Model):
    """
    Revoked Token Model
    """

    __tablename__ = 'network_dev_ops_revoked_tokens'

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120))

    """
    Checking that token is blacklisted
    """
    @classmethod
    def is_jti_blacklisted(cls, jti):
    
        query = cls.query.filter_by(jti=jti).first()
    
        return bool(query)

