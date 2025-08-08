from flask import Flask, render_template, send_from_directory
import os

app = Flask(
    __name__, template_folder="pages", static_folder="assets", static_url_path="/static"
)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/login")
def login():
    return render_template("login.html")


# Route para servir arquivos estáticos com o caminho correto
@app.route("/assets/<path:filename>")
def custom_static(filename):
    return send_from_directory("assets", filename)


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
