from flask import url_for
from datetime import timedelta

def user_schema(user):
    return {
        'id': user.id,
        'self': url_for('.user_api', user_id=user.id, _external=True),
        'kind': 'User',
        'username': user.username,
        'email': user.email,
        'phone': user.phone,
        'desc': user.desc,
        'role': user.role.id,
        'is_blocked': user.is_blocked,
        'user_type': user.user_type
    }

def users_schema(items, current, prev, next, pagination):
    return {
        'self': current,
        'kind': 'UserCollection',
        'items': [user_schema(item) for item in items],
        'prev': prev,
        'last': url_for('.users_api', page=pagination.pages, _external=True),
        'first': url_for('.users_api', page=1, _external=True),
        'next': next,
        'count': pagination.total
    }
