from flask import Flask, render_template, send_from_directory, request, jsonify, session
import os

app = Flask(
    __name__,
    template_folder="app/templates",
    static_folder="app/static",
    static_url_path="/static",
)

# Configurar chave secreta para sessões
app.secret_key = "autodrive_secret_key_2025"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/dashboard")
def dashboard():
    # Verificar se usuário está logado
    if "user_id" not in session:
        return render_template("login.html")

    # Pegar informações do usuário da sessão
    user_role = session.get("user_role", "user")
    user_name = session.get("user_name", "Usuário")
    user_email = session.get("user_id", "")

    # Renderizar dashboard baseado no role
    return render_template(
        "dashboard.html",
        user_role=user_role,
        user_name=user_name,
        user_email=user_email,
    )


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # Processar dados do login
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        # Usuários válidos (em produção, use banco de dados)
        valid_users = [
            {
                "email": "admin@autodrive.com",
                "password": "admin123",
                "name": "Admin",
                "role": "admin",
            },
            {
                "email": "user@autodrive.com",
                "password": "user123",
                "name": "Usuário",
                "role": "user",
            },
            {
                "email": "demo@autodrive.com",
                "password": "demo123",
                "name": "Demo",
                "role": "user",
            },
            {
                "email": "instrutor@autodrive.com",
                "password": "inst123",
                "name": "Instrutor",
                "role": "instructor",
            },
        ]

        # Verificar credenciais
        user = next(
            (
                u
                for u in valid_users
                if u["email"] == email and u["password"] == password
            ),
            None,
        )

        if user:
            # Salvar na sessão
            session["user_id"] = user["email"]
            session["user_name"] = user["name"]
            session["user_role"] = user["role"]
            return jsonify(
                {
                    "success": True,
                    "message": "Login realizado com sucesso!",
                    "role": user["role"],
                }
            )
        else:
            return jsonify({"success": False, "message": "Credenciais inválidas"}), 401

    # GET request - mostrar página de login
    return render_template("login.html")


@app.route("/logout")
def logout():
    # Limpar sessão
    session.clear()
    # Redirecionar para a página de login com uma mensagem
    return render_template("login.html")


@app.route("/admin/create-user", methods=["POST"])
def create_user():
    # Verificar se usuário é admin
    if session.get("user_role") != "admin":
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Acesso negado. Apenas administradores podem criar usuários.",
                }
            ),
            403,
        )

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    role = data.get("role", "user")

    # Validações básicas
    if not all([email, password, name]):
        return (
            jsonify({"success": False, "message": "Todos os campos são obrigatórios."}),
            400,
        )

    # Simular criação de usuário (em produção, salvar no banco de dados)
    # Por enquanto, apenas retornar sucesso
    return jsonify(
        {
            "success": True,
            "message": f"Usuário {name} criado com sucesso!",
            "user": {"email": email, "name": name, "role": role},
        }
    )


@app.route("/admin/users", methods=["GET"])
def list_users():
    # Verificar se usuário é admin
    if session.get("user_role") != "admin":
        return jsonify({"success": False, "message": "Acesso negado."}), 403

    # Simular lista de usuários (em produção, buscar do banco de dados)
    users = [
        {
            "id": 1,
            "email": "admin@autodrive.com",
            "name": "Admin",
            "role": "admin",
            "status": "ativo",
        },
        {
            "id": 2,
            "email": "user@autodrive.com",
            "name": "Usuário",
            "role": "user",
            "status": "ativo",
        },
        {
            "id": 3,
            "email": "demo@autodrive.com",
            "name": "Demo",
            "role": "user",
            "status": "ativo",
        },
        {
            "id": 4,
            "email": "instrutor@autodrive.com",
            "name": "Instrutor",
            "role": "instructor",
            "status": "ativo",
        },
    ]

    return jsonify({"success": True, "users": users})


# Route para servir arquivos estáticos com o caminho correto
@app.route("/assets/<path:filename>")
def custom_static(filename):
    return send_from_directory("app/static", filename)


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
