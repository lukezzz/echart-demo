import os
from re import search
import click
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, jsonify
from app.apis.v1 import api_bp
from app.settings import config
from app.extensions import db, migrate, jwt
from app.models.user import User, Role, RevokedToken

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

# Checking that token is in blacklist or not
# @jwt.token_in_blacklist_loader
# def check_if_token_in_blacklist(decrypted_token):

#     jti = decrypted_token['jti']
#     return RevokedToken.is_jti_blacklisted(jti)


def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_CONFIG', 'development')

    app = Flask('app')
    app.config.from_object(config[config_name])

    register_logging(app)
    register_extensions(app)
    register_blueprints(app)
    register_commands(app)
    register_errorhandlers(app)
    register_shell_context(app)
    register_template_context(app)

    return app

def register_logging(app):
    pass

def register_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

  
def register_blueprints(app):

    app.register_blueprint(api_bp, url_prefix='/api/v1')

def register_shell_context(app):
    @app.shell_context_processor
    def make_shell_context():
        return dict(db=db, User=User)

def register_template_context(app):
    pass

def register_errorhandlers(app):
    @app.errorhandler(404)
    def page_not_found(e):
        response = jsonify(code=404, message='The requested URL was not found on the server.')
        response.status_code = 404
        return response

    @app.errorhandler(405)
    def method_not_allowed(e):
        response = jsonify(code=405, message='The method is not allowed for the requested URL.')
        response.status_code = 405
        return response

    @app.errorhandler(500)
    def internal_server_error(e):
        response = jsonify(code=500, message='An internal server error occurred.')
        response.status_code = 500
        return response


def register_commands(app):

    def init_role():
        """Init roles."""
        Role.init_role()
        click.echo('Init roles Done.')

    def add_user():
        """ add user account """
        
        data = [
            {
                "username": "admin",
                "mail": "admin@hftec.cc",
                "password": "123456",
                "role": "admin"
            },
            # {
            #     "username": "user1",
            #     "mail": "user1@hftec.cc",
            #     "password": "123456",
            #     "role": "user"
            # },
            # {
            #     "username": "viewer1",
            #     "mail": "viewer1@hftec.cc",
            #     "password": "123456",
            #     "role": "viewer"
            # },
        ]

        for l in data:
            user = User.query.filter_by(username=l['username']).first()
            if not user:
                user = User(
                    username=l['username']
                )
            
            user.set_password(l['password'])
            user.email=l['mail'] 
            db.session.add(user)
            user.role = Role.query.filter_by(name=l["role"]).first()
            user.user_type = 1
            db.session.commit()
        click.echo('Add user account Done.')


    @app.cli.command()
    def init_all():
        """init all status."""
        # db.drop_all(bind='backend')
        # db.create_all()
        # db.session.commit()
        init_role()
        add_user()
        click.echo('Done.')

    @app.cli.command()
    def create_api_user():
        """create api user."""
        user = User.query.filter_by(username='airflow').first()
        if not user:
            user = User(
                    username='airflow',            
                )
        user.set_password('123456')
        db.session.add(user)
        user.role = Role.query.filter_by(name='admin').first()
        user.user_type = 2
        db.session.commit()
        click.echo('Done.')