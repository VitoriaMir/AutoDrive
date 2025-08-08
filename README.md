# AutoDrive — FastAPI + JWT + PostgreSQL

## Como rodar localmente

1. Crie o `.env`:
```
SECRET_KEY="troque-isto"
DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/autodrive"
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```
2. Instale dependências:
```
pip install -r requirements.txt
```
3. Rode a app:
```
uvicorn app.main:app --reload
```
4. Crie um usuário:
```
curl -X POST http://localhost:8000/api/auth/register -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"Admin123!","full_name":"Admin"}'
```
5. Faça login em `/login` e use o token para chamar `/api/users/me`.

## Estrutura
- `app/main.py`: App FastAPI, rotas e static.
- `app/core`: Config e segurança (JWT).
- `app/db`: Engine e init do banco (SQLModel + PostgreSQL).
- `app/models`: Modelos SQLModel.
- `app/api/routes`: Endpoints REST (auth, users).
- `app/web`: Rotas HTML (Jinja2).
- `alembic`: Base para migrações.

## Produção (resumo)
- Use `gunicorn -k uvicorn.workers.UvicornWorker` atrás de um Nginx.
- Configure CORS restritivo, HTTPS, logs estruturados, e variáveis seguras.
- Habilite `alembic` para versionar o schema.