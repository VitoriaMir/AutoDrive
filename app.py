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
    return render_template("dashboard.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # Processar dados do login
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        # Usuários válidos (em produção, use banco de dados)
        valid_users = [
            {"email": "admin@autodrive.com", "password": "admin123", "name": "Admin"},
            {"email": "user@autodrive.com", "password": "user123", "name": "Usuário"},
            {"email": "demo@autodrive.com", "password": "demo123", "name": "Demo"},
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
            return jsonify({"success": True, "message": "Login realizado com sucesso!"})
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


# Route para servir arquivos estáticos com o caminho correto
@app.route("/assets/<path:filename>")
def custom_static(filename):
    return send_from_directory("app/static", filename)


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
