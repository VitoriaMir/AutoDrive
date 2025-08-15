"""
Firebase Functions entry point for AutoDrive
"""
from firebase_functions import https_fn
from firebase_admin import initialize_app
import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(__file__))

# Initialize Firebase Admin SDK
initialize_app()

# Import your FastAPI app
from app import app

@https_fn.on_request()
def app_function(req):
    """Cloud Function that serves the FastAPI app"""
    from mangum import Mangum
    
    handler = Mangum(app, lifespan="off")
    return handler(req, {})
