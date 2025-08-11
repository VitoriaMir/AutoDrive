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


# ===== SISTEMA DE AGENDAMENTO DE AULAS =====

# Dados mockados para demonstração (em produção, usar banco de dados)
lessons_data = [
    {
        "id": 1,
        "student_id": "user@autodrive.com",
        "student_name": "João Silva",
        "instructor_id": "instrutor@autodrive.com",
        "instructor_name": "Carlos Mendes",
        "date": "2025-08-10",
        "start_time": "09:00",
        "end_time": "10:00",
        "type": "practical",  # practical ou theoretical
        "vehicle": "ABC-1234 (Gol)",
        "status": "scheduled",  # scheduled, completed, cancelled
        "category": "B",
        "location": "Autoescola",
        "notes": "",
    },
    {
        "id": 2,
        "student_id": "demo@autodrive.com",
        "student_name": "Maria Santos",
        "instructor_id": "instrutor@autodrive.com",
        "instructor_name": "Ana Costa",
        "date": "2025-08-10",
        "start_time": "14:00",
        "end_time": "15:00",
        "type": "theoretical",
        "vehicle": None,
        "status": "scheduled",
        "category": "B",
        "location": "Sala 1",
        "notes": "Legislação de Trânsito",
    },
]

instructors_data = [
    {
        "id": "instrutor@autodrive.com",
        "name": "Carlos Mendes",
        "specialty": "practical",
    },
    {
        "id": "instructor2@autodrive.com",
        "name": "Ana Costa",
        "specialty": "theoretical",
    },
    {"id": "instructor3@autodrive.com", "name": "Maria Fernandes", "specialty": "both"},
]

vehicles_data = [
    {"id": "ABC-1234", "model": "Gol", "category": "B", "available": True},
    {"id": "DEF-5678", "model": "HB20", "category": "B", "available": True},
    {"id": "GHI-9012", "model": "CB600", "category": "A", "available": True},
]

students_data = [
    {
        "id": 1,
        "name": "João Silva",
        "cpf": "123.456.789-00",
        "phone": "(11) 99999-9999",
        "email": "joao@email.com",
        "address": "Rua A, 123",
        "birth_date": "1990-01-01",
        "category": "B",
        "enrollment_date": "2024-01-01",
        "emergency_contact": "(11) 88888-8888",
        "observations": "",
        "status": "active",
    },
    {
        "id": 2,
        "name": "Maria Santos",
        "cpf": "987.654.321-00",
        "phone": "(11) 77777-7777",
        "email": "maria@email.com",
        "address": "Rua B, 456",
        "birth_date": "1992-05-15",
        "category": "AB",
        "enrollment_date": "2024-01-15",
        "emergency_contact": "(11) 66666-6666",
        "observations": "Precisa de atenção especial",
        "status": "active",
    },
]

payments_data = [
    {
        "id": 1,
        "student_name": "João Silva",
        "amount": 150.00,
        "payment_method": "dinheiro",
        "payment_date": "2024-01-01",
        "due_date": "2024-01-05",
        "description": "Mensalidade Janeiro",
        "installment": "1/12",
        "notes": "",
        "status": "paid",
    },
    {
        "id": 2,
        "student_name": "Maria Santos",
        "amount": 200.00,
        "payment_method": "cartao",
        "payment_date": "2024-01-15",
        "due_date": "2024-01-20",
        "description": "Taxa de Matrícula",
        "installment": "1/1",
        "notes": "Pagamento via cartão de crédito",
        "status": "paid",
    },
]


@app.route("/api/lessons", methods=["GET"])
def get_lessons():
    """Obter todas as aulas ou filtrar por usuário"""
    user_role = session.get("user_role")
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"success": False, "message": "Não autenticado"}), 401

    # Filtrar aulas baseado no role do usuário
    filtered_lessons = []
    for lesson in lessons_data:
        if user_role == "admin":
            # Admin vê todas as aulas
            filtered_lessons.append(lesson)
        elif user_role == "instructor":
            # Instrutor vê apenas suas aulas
            if lesson["instructor_id"] == user_id:
                filtered_lessons.append(lesson)
        else:
            # Aluno vê apenas suas aulas
            if lesson["student_id"] == user_id:
                filtered_lessons.append(lesson)

    return jsonify({"success": True, "lessons": filtered_lessons})


@app.route("/api/lessons", methods=["POST"])
def create_lesson():
    """Criar nova aula"""
    if "user_id" not in session:
        return jsonify({"success": False, "message": "Não autenticado"}), 401

    data = request.get_json()

    # Validações básicas
    required_fields = [
        "student_id",
        "instructor_id",
        "date",
        "start_time",
        "end_time",
        "type",
    ]
    for field in required_fields:
        if not data.get(field):
            return (
                jsonify({"success": False, "message": f"Campo {field} é obrigatório"}),
                400,
            )

    # Verificar disponibilidade do instrutor
    for lesson in lessons_data:
        if (
            lesson["instructor_id"] == data["instructor_id"]
            and lesson["date"] == data["date"]
            and lesson["start_time"] == data["start_time"]
            and lesson["status"] != "cancelled"
        ):
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Instrutor não disponível neste horário",
                    }
                ),
                409,
            )

    # Criar nova aula
    new_lesson = {
        "id": len(lessons_data) + 1,
        "student_id": data["student_id"],
        "student_name": data.get("student_name", ""),
        "instructor_id": data["instructor_id"],
        "instructor_name": data.get("instructor_name", ""),
        "date": data["date"],
        "start_time": data["start_time"],
        "end_time": data["end_time"],
        "type": data["type"],
        "vehicle": data.get("vehicle"),
        "status": "scheduled",
        "category": data.get("category", "B"),
        "location": data.get("location", "Autoescola"),
        "notes": data.get("notes", ""),
    }

    lessons_data.append(new_lesson)
    return jsonify(
        {"success": True, "message": "Aula agendada com sucesso!", "lesson": new_lesson}
    )


@app.route("/api/lessons/<int:lesson_id>", methods=["PUT"])
def update_lesson(lesson_id):
    """Atualizar aula existente"""
    if "user_id" not in session:
        return jsonify({"success": False, "message": "Não autenticado"}), 401

    data = request.get_json()

    # Encontrar a aula
    lesson = next((l for l in lessons_data if l["id"] == lesson_id), None)
    if not lesson:
        return jsonify({"success": False, "message": "Aula não encontrada"}), 404

    # Verificar permissões
    user_role = session.get("user_role")
    user_id = session.get("user_id")

    if (
        user_role not in ["admin"]
        and lesson["instructor_id"] != user_id
        and lesson["student_id"] != user_id
    ):
        return (
            jsonify(
                {"success": False, "message": "Sem permissão para editar esta aula"}
            ),
            403,
        )

    # Atualizar campos
    updatable_fields = [
        "date",
        "start_time",
        "end_time",
        "type",
        "vehicle",
        "location",
        "notes",
        "status",
    ]
    for field in updatable_fields:
        if field in data:
            lesson[field] = data[field]

    return jsonify(
        {"success": True, "message": "Aula atualizada com sucesso!", "lesson": lesson}
    )


@app.route("/api/lessons/<int:lesson_id>", methods=["DELETE"])
def cancel_lesson(lesson_id):
    """Cancelar aula"""
    if "user_id" not in session:
        return jsonify({"success": False, "message": "Não autenticado"}), 401

    lesson = next((l for l in lessons_data if l["id"] == lesson_id), None)
    if not lesson:
        return jsonify({"success": False, "message": "Aula não encontrada"}), 404

    # Verificar permissões
    user_role = session.get("user_role")
    user_id = session.get("user_id")

    if (
        user_role not in ["admin"]
        and lesson["instructor_id"] != user_id
        and lesson["student_id"] != user_id
    ):
        return (
            jsonify(
                {"success": False, "message": "Sem permissão para cancelar esta aula"}
            ),
            403,
        )

    lesson["status"] = "cancelled"
    return jsonify({"success": True, "message": "Aula cancelada com sucesso!"})


@app.route("/api/instructors", methods=["GET"])
def get_instructors():
    """Obter lista de instrutores disponíveis"""
    return jsonify({"success": True, "instructors": instructors_data})


@app.route("/api/vehicles", methods=["GET"])
def get_vehicles():
    """Obter lista de veículos disponíveis"""
    available_vehicles = [v for v in vehicles_data if v["available"]]
    return jsonify({"success": True, "vehicles": available_vehicles})


@app.route("/api/schedule-availability", methods=["GET"])
def get_schedule_availability():
    """Verificar disponibilidade de horários"""
    date = request.args.get("date")
    instructor_id = request.args.get("instructor_id")

    if not date:
        return jsonify({"success": False, "message": "Data é obrigatória"}), 400

    # Horários disponíveis (8h às 18h)
    available_times = []
    for hour in range(8, 18):
        time_slot = f"{hour:02d}:00"

        # Verificar se horário está ocupado
        occupied = any(
            lesson["date"] == date
            and lesson["start_time"] == time_slot
            and lesson["status"] != "cancelled"
            and (not instructor_id or lesson["instructor_id"] == instructor_id)
            for lesson in lessons_data
        )

        if not occupied:
            available_times.append(time_slot)

    return jsonify({"success": True, "available_times": available_times})


@app.route("/api/instructors", methods=["POST"])
def create_instructor():
    """Criar novo instrutor"""
    if "user_id" not in session:
        return jsonify({"success": False, "message": "Não autenticado"}), 401

    # Verificar se usuário é admin
    user_role = session.get("user_role")
    if user_role != "admin":
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Apenas administradores podem cadastrar instrutores",
                }
            ),
            403,
        )

    data = request.get_json()

    # Validações básicas
    required_fields = ["name", "email", "phone", "cpf", "specialty", "license"]
    for field in required_fields:
        if not data.get(field):
            return (
                jsonify({"success": False, "message": f"Campo {field} é obrigatório"}),
                400,
            )

    # Verificar se email já existe
    if any(instructor["id"] == data["email"] for instructor in instructors_data):
        return jsonify({"success": False, "message": "Email já cadastrado"}), 409

    # Criar novo instrutor
    new_instructor = {
        "id": data["email"],
        "name": data["name"],
        "email": data["email"],
        "phone": data["phone"],
        "cpf": data["cpf"],
        "specialty": data["specialty"],
        "license": data["license"],
        "address": data.get("address", ""),
        "notes": data.get("notes", ""),
        "active": True,
    }

    instructors_data.append(new_instructor)
    return jsonify(
        {
            "success": True,
            "message": "Instrutor cadastrado com sucesso!",
            "instructor": new_instructor,
        }
    )


@app.route("/api/vehicles", methods=["POST"])
def create_vehicle():
    """Criar novo veículo"""
    if "user_id" not in session:
        return jsonify({"success": False, "message": "Não autenticado"}), 401

    # Verificar se usuário é admin
    user_role = session.get("user_role")
    if user_role != "admin":
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Apenas administradores podem cadastrar veículos",
                }
            ),
            403,
        )

    data = request.get_json()

    # Validações básicas
    required_fields = [
        "plate",
        "model",
        "brand",
        "year",
        "category",
        "color",
        "fuel",
        "transmission",
    ]
    for field in required_fields:
        if not data.get(field):
            return (
                jsonify({"success": False, "message": f"Campo {field} é obrigatório"}),
                400,
            )

    # Verificar se placa já existe
    if any(vehicle["id"] == data["plate"] for vehicle in vehicles_data):
        return jsonify({"success": False, "message": "Placa já cadastrada"}), 409

    # Criar novo veículo
    new_vehicle = {
        "id": data["plate"],
        "plate": data["plate"],
        "model": data["model"],
        "brand": data["brand"],
        "year": data["year"],
        "category": data["category"],
        "color": data["color"],
        "fuel": data["fuel"],
        "transmission": data["transmission"],
        "notes": data.get("notes", ""),
        "available": True,
    }

    vehicles_data.append(new_vehicle)
    return jsonify(
        {
            "success": True,
            "message": "Veículo cadastrado com sucesso!",
            "vehicle": new_vehicle,
        }
    )


# Endpoint para criar estudante
@app.route("/api/students", methods=["POST"])
def create_student():
    if "user_id" not in session:
        return jsonify({"success": False, "message": "Não autorizado"}), 401

    data = request.get_json()

    # Validar campos obrigatórios
    required_fields = [
        "name",
        "cpf",
        "phone",
        "email",
        "address",
        "birth_date",
        "category",
    ]
    for field in required_fields:
        if not data.get(field):
            return (
                jsonify({"success": False, "message": f"Campo {field} é obrigatório"}),
                400,
            )

    # Verificar se CPF já existe
    if any(student.get("cpf") == data["cpf"] for student in students_data):
        return jsonify({"success": False, "message": "CPF já cadastrado"}), 409

    # Criar novo estudante
    new_student = {
        "id": len(students_data) + 1,
        "name": data["name"],
        "cpf": data["cpf"],
        "phone": data["phone"],
        "email": data["email"],
        "address": data["address"],
        "birth_date": data["birth_date"],
        "category": data["category"],
        "enrollment_date": data.get("enrollment_date", ""),
        "emergency_contact": data.get("emergency_contact", ""),
        "observations": data.get("observations", ""),
        "status": "active",
    }

    students_data.append(new_student)
    return jsonify(
        {
            "success": True,
            "message": "Aluno cadastrado com sucesso!",
            "student": new_student,
        }
    )


# Endpoint para criar pagamento
@app.route("/api/payments", methods=["POST"])
def create_payment():
    if "user_id" not in session:
        return jsonify({"success": False, "message": "Não autorizado"}), 401

    data = request.get_json()

    # Validar campos obrigatórios
    required_fields = ["student_name", "amount", "payment_method", "payment_date"]
    for field in required_fields:
        if not data.get(field):
            return (
                jsonify({"success": False, "message": f"Campo {field} é obrigatório"}),
                400,
            )

    # Criar novo pagamento
    new_payment = {
        "id": len(payments_data) + 1,
        "student_name": data["student_name"],
        "amount": float(data["amount"]),
        "payment_method": data["payment_method"],
        "payment_date": data["payment_date"],
        "due_date": data.get("due_date", ""),
        "description": data.get("description", ""),
        "installment": data.get("installment", "1/1"),
        "notes": data.get("notes", ""),
        "status": "paid",
    }

    payments_data.append(new_payment)
    return jsonify(
        {
            "success": True,
            "message": "Pagamento registrado com sucesso!",
            "payment": new_payment,
        }
    )


# Route para servir arquivos estáticos com o caminho correto
@app.route("/assets/<path:filename>")
def custom_static(filename):
    return send_from_directory("app/static", filename)


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
