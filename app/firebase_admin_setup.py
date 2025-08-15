import os
import firebase_admin
from firebase_admin import credentials, auth
import logging

logger = logging.getLogger(__name__)

def init_firebase():
    """
    Initialize Firebase Admin SDK for production deployment.
    
    Order of credential resolution:
    1. Application Default Credentials (recommended for production)
    2. GOOGLE_APPLICATION_CREDENTIALS environment variable
    3. FIREBASE_SERVICE_ACCOUNT environment variable (fallback)
    """
    if firebase_admin._apps:
        logger.info("Firebase already initialized")
        return auth
    
    try:
        # Try Application Default Credentials first (best for production)
        # This works automatically on Google Cloud Platform, Firebase Hosting, etc.
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred, {
            'projectId': os.getenv('FIREBASE_PROJECT_ID')
        })
        logger.info("Firebase initialized with Application Default Credentials")
        
    except Exception as e:
        logger.warning(f"Application Default Credentials failed: {e}")
        
        # Fallback to explicit service account file
        key_path = (
            os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or 
            os.getenv("FIREBASE_SERVICE_ACCOUNT")
        )
        
        if not key_path:
            raise RuntimeError(
                "Firebase credentials not found. Please set:\n"
                "- GOOGLE_APPLICATION_CREDENTIALS (recommended), or\n"
                "- FIREBASE_SERVICE_ACCOUNT environment variable\n"
                "Or ensure Application Default Credentials are available."
            )
        
        if not os.path.exists(key_path):
            raise RuntimeError(f"Firebase service account file not found: {key_path}")
        
        try:
            cred = credentials.Certificate(key_path)
            firebase_admin.initialize_app(cred)
            logger.info(f"Firebase initialized with service account: {key_path}")
            
        except Exception as init_error:
            logger.error(f"Failed to initialize Firebase: {init_error}")
            raise RuntimeError(f"Firebase initialization failed: {init_error}")
    
    return auth
