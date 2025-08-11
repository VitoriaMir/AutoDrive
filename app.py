from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os

app = FastAPI(title="AutoDrive", description="Sistema de Autoescola")

# Configurar middleware de sessão
app.add_middleware(SessionMiddleware, secret_key="autodrive_secret_key_2025")

# Configurar arquivos estáticos e templates
app.mount("/assets", StaticFiles(directory="app/assets"), name="assets")
templates = Jinja2Templates(directory="app/templates")

# ===== MODELOS PYDANTIC =====


class LoginRequest(BaseModel):
    email: str
    password: str


class CreateUserRequest(BaseModel):
    email: str
    password: str
    name: str
    role: str = "user"


class LessonRequest(BaseModel):
    student_id: str
    instructor_id: str
    date: str
    start_time: str
    end_time: str
    type: str  # practical ou theoretical
    vehicle: Optional[str] = None
    category: str = "B"
    location: str = "Autoescola"
    notes: str = ""
    student_name: Optional[str] = ""
    instructor_name: Optional[str] = ""


class InstructorRequest(BaseModel):
    name: str
    email: str
    phone: str
    cpf: str
    specialty: str
    license: str
    address: Optional[str] = ""
    notes: Optional[str] = ""


class VehicleRequest(BaseModel):
    plate: str
    model: str
    brand: str
    year: int
    category: str
    color: str
    fuel: str
    transmission: str
    notes: Optional[str] = ""


class StudentRequest(BaseModel):
    name: str
    cpf: str
    phone: str
    email: str
    address: str
    birth_date: str
    category: str
    enrollment_date: Optional[str] = ""
    emergency_contact: Optional[str] = ""
    observations: Optional[str] = ""


class PaymentRequest(BaseModel):
    student_name: str
    amount: float
    payment_method: str
    payment_date: str
    due_date: Optional[str] = ""
    description: Optional[str] = ""
    installment: Optional[str] = "1/1"
    notes: Optional[str] = ""


# ===== DADOS MOCKADOS =====

# Usuários válidos
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

# Dados mockados para demonstração
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
        "type": "practical",
        "vehicle": "ABC-1234 (Gol)",
        "status": "scheduled",
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

# ===== FUNÇÕES AUXILIARES =====


def get_current_user(request: Request) -> Optional[Dict[str, Any]]:
    """Obter usuário atual da sessão"""
    user_id = request.session.get("user_id")
    if not user_id:
        return None

    user = next((u for u in valid_users if u["email"] == user_id), None)
    return user


def require_auth(request: Request) -> Dict[str, Any]:
    """Dependência que requer autenticação"""
    user = get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Não autenticado")
    return user


def require_admin(request: Request) -> Dict[str, Any]:
    """Dependência que requer privilégios de admin"""
    user = require_auth(request)
    if user["role"] != "admin":
        raise HTTPException(
            status_code=403, detail="Acesso negado. Apenas administradores."
        )
    return user


# ===== ROTAS DE PÁGINAS =====


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request):
    user = get_current_user(request)
    if not user:
        return RedirectResponse(url="/login", status_code=302)

    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "user_role": user["role"],
            "user_name": user["name"],
            "user_email": user["email"],
        },
    )


@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.post("/login")
async def login(request: Request, login_data: LoginRequest):
    # Verificar credenciais
    user = next(
        (
            u
            for u in valid_users
            if u["email"] == login_data.email and u["password"] == login_data.password
        ),
        None,
    )

    if user:
        # Salvar na sessão
        request.session["user_id"] = user["email"]
        request.session["user_name"] = user["name"]
        request.session["user_role"] = user["role"]
        return {
            "success": True,
            "message": "Login realizado com sucesso!",
            "role": user["role"],
        }
    else:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")


@app.get("/logout")
async def logout(request: Request):
    request.session.clear()
    return templates.TemplateResponse("login.html", {"request": request})


# ===== ROTAS DE API =====


@app.post("/admin/create-user")
async def create_user(
    request: Request,
    user_data: CreateUserRequest,
    current_user: Dict = Depends(require_admin),
):
    # Validações básicas
    if any(u["email"] == user_data.email for u in valid_users):
        raise HTTPException(status_code=409, detail="Email já existe")

    # Simular criação de usuário
    return {
        "success": True,
        "message": f"Usuário {user_data.name} criado com sucesso!",
        "user": {
            "email": user_data.email,
            "name": user_data.name,
            "role": user_data.role,
        },
    }


@app.get("/admin/users")
async def list_users(request: Request, current_user: Dict = Depends(require_admin)):
    users = [
        {
            "id": i + 1,
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "status": "ativo",
        }
        for i, user in enumerate(valid_users)
    ]
    return {"success": True, "users": users}


# ===== SISTEMA DE AGENDAMENTO DE AULAS =====


@app.get("/api/lessons")
async def get_lessons(request: Request, current_user: Dict = Depends(require_auth)):
    user_role = current_user["role"]
    user_id = current_user["email"]

    # Filtrar aulas baseado no role do usuário
    filtered_lessons = []
    for lesson in lessons_data:
        if user_role == "admin":
            filtered_lessons.append(lesson)
        elif user_role == "instructor":
            if lesson["instructor_id"] == user_id:
                filtered_lessons.append(lesson)
        else:
            if lesson["student_id"] == user_id:
                filtered_lessons.append(lesson)

    return {"success": True, "lessons": filtered_lessons}


@app.post("/api/lessons")
async def create_lesson(
    request: Request,
    lesson_data: LessonRequest,
    current_user: Dict = Depends(require_auth),
):
    # Verificar disponibilidade do instrutor
    for lesson in lessons_data:
        if (
            lesson["instructor_id"] == lesson_data.instructor_id
            and lesson["date"] == lesson_data.date
            and lesson["start_time"] == lesson_data.start_time
            and lesson["status"] != "cancelled"
        ):
            raise HTTPException(
                status_code=409, detail="Instrutor não disponível neste horário"
            )

    # Criar nova aula
    new_lesson = {
        "id": len(lessons_data) + 1,
        "student_id": lesson_data.student_id,
        "student_name": lesson_data.student_name,
        "instructor_id": lesson_data.instructor_id,
        "instructor_name": lesson_data.instructor_name,
        "date": lesson_data.date,
        "start_time": lesson_data.start_time,
        "end_time": lesson_data.end_time,
        "type": lesson_data.type,
        "vehicle": lesson_data.vehicle,
        "status": "scheduled",
        "category": lesson_data.category,
        "location": lesson_data.location,
        "notes": lesson_data.notes,
    }

    lessons_data.append(new_lesson)
    return {
        "success": True,
        "message": "Aula agendada com sucesso!",
        "lesson": new_lesson,
    }


@app.put("/api/lessons/{lesson_id}")
async def update_lesson(
    request: Request,
    lesson_id: int,
    lesson_data: dict,
    current_user: Dict = Depends(require_auth),
):
    # Encontrar a aula
    lesson = next((l for l in lessons_data if l["id"] == lesson_id), None)
    if not lesson:
        raise HTTPException(status_code=404, detail="Aula não encontrada")

    # Verificar permissões
    user_role = current_user["role"]
    user_id = current_user["email"]

    if (
        user_role not in ["admin"]
        and lesson["instructor_id"] != user_id
        and lesson["student_id"] != user_id
    ):
        raise HTTPException(
            status_code=403, detail="Sem permissão para editar esta aula"
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
        if field in lesson_data:
            lesson[field] = lesson_data[field]

    return {
        "success": True,
        "message": "Aula atualizada com sucesso!",
        "lesson": lesson,
    }


@app.delete("/api/lessons/{lesson_id}")
async def cancel_lesson(
    request: Request, lesson_id: int, current_user: Dict = Depends(require_auth)
):
    lesson = next((l for l in lessons_data if l["id"] == lesson_id), None)
    if not lesson:
        raise HTTPException(status_code=404, detail="Aula não encontrada")

    # Verificar permissões
    user_role = current_user["role"]
    user_id = current_user["email"]

    if (
        user_role not in ["admin"]
        and lesson["instructor_id"] != user_id
        and lesson["student_id"] != user_id
    ):
        raise HTTPException(
            status_code=403, detail="Sem permissão para cancelar esta aula"
        )

    lesson["status"] = "cancelled"
    return {"success": True, "message": "Aula cancelada com sucesso!"}


@app.get("/api/instructors")
async def get_instructors(request: Request, current_user: Dict = Depends(require_auth)):
    return {"success": True, "instructors": instructors_data}


@app.post("/api/instructors")
async def create_instructor(
    request: Request,
    instructor_data: InstructorRequest,
    current_user: Dict = Depends(require_admin),
):
    # Verificar se email já existe
    if any(
        instructor["id"] == instructor_data.email for instructor in instructors_data
    ):
        raise HTTPException(status_code=409, detail="Email já cadastrado")

    # Criar novo instrutor
    new_instructor = {
        "id": instructor_data.email,
        "name": instructor_data.name,
        "email": instructor_data.email,
        "phone": instructor_data.phone,
        "cpf": instructor_data.cpf,
        "specialty": instructor_data.specialty,
        "license": instructor_data.license,
        "address": instructor_data.address,
        "notes": instructor_data.notes,
        "active": True,
    }

    instructors_data.append(new_instructor)
    return {
        "success": True,
        "message": "Instrutor cadastrado com sucesso!",
        "instructor": new_instructor,
    }


@app.get("/api/vehicles")
async def get_vehicles(request: Request, current_user: Dict = Depends(require_auth)):
    available_vehicles = [v for v in vehicles_data if v["available"]]
    return {"success": True, "vehicles": available_vehicles}


@app.post("/api/vehicles")
async def create_vehicle(
    request: Request,
    vehicle_data: VehicleRequest,
    current_user: Dict = Depends(require_admin),
):
    # Verificar se placa já existe
    if any(vehicle["id"] == vehicle_data.plate for vehicle in vehicles_data):
        raise HTTPException(status_code=409, detail="Placa já cadastrada")

    # Criar novo veículo
    new_vehicle = {
        "id": vehicle_data.plate,
        "plate": vehicle_data.plate,
        "model": vehicle_data.model,
        "brand": vehicle_data.brand,
        "year": vehicle_data.year,
        "category": vehicle_data.category,
        "color": vehicle_data.color,
        "fuel": vehicle_data.fuel,
        "transmission": vehicle_data.transmission,
        "notes": vehicle_data.notes,
        "available": True,
    }

    vehicles_data.append(new_vehicle)
    return {
        "success": True,
        "message": "Veículo cadastrado com sucesso!",
        "vehicle": new_vehicle,
    }


@app.get("/api/schedule-availability")
async def get_schedule_availability(
    request: Request,
    date: str,
    instructor_id: Optional[str] = None,
    current_user: Dict = Depends(require_auth),
):
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

    return {"success": True, "available_times": available_times}


@app.post("/api/students")
async def create_student(
    request: Request,
    student_data: StudentRequest,
    current_user: Dict = Depends(require_auth),
):
    # Verificar se CPF já existe
    if any(student.get("cpf") == student_data.cpf for student in students_data):
        raise HTTPException(status_code=409, detail="CPF já cadastrado")

    # Criar novo estudante
    new_student = {
        "id": len(students_data) + 1,
        "name": student_data.name,
        "cpf": student_data.cpf,
        "phone": student_data.phone,
        "email": student_data.email,
        "address": student_data.address,
        "birth_date": student_data.birth_date,
        "category": student_data.category,
        "enrollment_date": student_data.enrollment_date,
        "emergency_contact": student_data.emergency_contact,
        "observations": student_data.observations,
        "status": "active",
    }

    students_data.append(new_student)
    return {
        "success": True,
        "message": "Aluno cadastrado com sucesso!",
        "student": new_student,
    }


@app.post("/api/payments")
async def create_payment(
    request: Request,
    payment_data: PaymentRequest,
    current_user: Dict = Depends(require_auth),
):
    # Verificar se usuário tem permissão para registrar pagamentos
    if current_user["role"] == "instructor":
        raise HTTPException(
            status_code=403, detail="Instrutores não podem registrar pagamentos"
        )

    # Criar novo pagamento
    new_payment = {
        "id": len(payments_data) + 1,
        "student_name": payment_data.student_name,
        "amount": payment_data.amount,
        "payment_method": payment_data.payment_method,
        "payment_date": payment_data.payment_date,
        "due_date": payment_data.due_date,
        "description": payment_data.description,
        "installment": payment_data.installment,
        "notes": payment_data.notes,
        "status": "paid",
    }

    payments_data.append(new_payment)
    return {
        "success": True,
        "message": "Pagamento registrado com sucesso!",
        "payment": new_payment,
    }
