from flask import Blueprint, jsonify, request
from .auth_middleware import require_firebase_token

api = Blueprint('api', __name__, url_prefix='/api')

@api.get('/me')
@require_firebase_token
def me():
    user = getattr(request, 'firebase_user', {})
    return jsonify({'uid': user.get('uid'), 'email': user.get('email')})

@api.get('/aulas')
@require_firebase_token
def aulas():
    # Example: replace with your real DB calls filtered by UID if needed
    uid = getattr(request, 'firebase_user', {}).get('uid')
    # demo payload
    return jsonify([
        {"id": 1, "titulo": "Aula prática - Baliza", "data": "2025-08-15", "instrutor": "Carlos", "uid": uid},
        {"id": 2, "titulo": "Aula teórica - Sinalização", "data": "2025-08-16", "instrutor": "Ana", "uid": uid},
    ])
