import os

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

prefix = 'sqlite:////'

class BaseConfig(object):
    SECRET_KEY = os.getenv('SECRET_KEY', 'mock_api')


    JWT_SECRET_KEY = os.getenv('SECRET_KEY', 'mock_api')
    # client id (audience)
    JWT_IDENTITY_CLAIM = 'username'
    JWT_ACCESS_TOKEN_EXPIRES = 60*60
    JWT_REFRESH_TOKEN_EXPIRES = 60*120
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']

    JWT_HEADER_TYPE = 'JWT'

    DEBUG_TB_INTERCEPT_REDIRECTS = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_RECORD_QUERIES = True

    ITEM_PER_PAGE = 20

    
class DevelopmentConfig(BaseConfig):
    # WTF_CSRF_ENABLED = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', prefix + os.path.join(basedir, 'data-dev.db'))



class TestingConfig(BaseConfig):
    TESTING = True
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # in-memory database


class ProductionConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', prefix + os.path.join(basedir, 'data.db'))


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig
}