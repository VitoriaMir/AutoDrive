from functools import wraps
from flask import request, jsonify
from .firebase_admin_setup import init_firebase

firebase_auth = init_firebase()

def require_firebase_token(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'detail': 'Token ausente'}), 401
        token = auth_header.split(' ', 1)[1]
        try:
            decoded = firebase_auth.verify_id_token(token)
            request.firebase_user = decoded  # attach user info to request
        except Exception as e:
            return jsonify({'detail': 'Token inválido'}), 401
        return fn(*args, **kwargs)
    return wrapper
