from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import get_settings
from app.db.session import init_db
from app.api.routes import auth as auth_router
from app.api.routes import users as users_router
from app.web import routes as web_routes

settings = get_settings()
app = FastAPI(title=settings.PROJECT_NAME)

# CORS (adjust in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Routers
app.include_router(auth_router.router, prefix="/api")
app.include_router(users_router.router, prefix="/api")
app.include_router(web_routes.router)

@app.on_event("startup")
def on_startup():
    init_db()