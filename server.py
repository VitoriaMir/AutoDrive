# AutoDrive FastAPI Server

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

# Create FastAPI instance
app = FastAPI(
    title="AutoDrive API",
    description="Sistema de Gestão para Autoescolas - API REST",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Endpoints
@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    return {
        "total_students": 156,
        "active_students": 142,
        "total_instructors": 8,
        "available_instructors": 6,
        "total_vehicles": 12,
        "available_vehicles": 10,
        "lessons_today": 8,
        "monthly_revenue": 6560.0,
        "pending_exams": 15,
        "completion_rate": 0.89
    }

@app.get("/api/dashboard/monthly-data")
async def get_monthly_data(months: int = 6):
    """Get monthly data for charts"""
    return [
        {"month": "Mar 2024", "theoretical_lessons": 95, "practical_lessons": 82, "total_lessons": 177, "revenue": 11248.50},
        {"month": "Apr 2024", "theoretical_lessons": 103, "practical_lessons": 89, "total_lessons": 192, "revenue": 12224.00},
        {"month": "May 2024", "theoretical_lessons": 110, "practical_lessons": 95, "total_lessons": 205, "revenue": 13075.00},
        {"month": "Jun 2024", "theoretical_lessons": 98, "practical_lessons": 87, "total_lessons": 185, "revenue": 11790.00},
        {"month": "Jul 2024", "theoretical_lessons": 115, "practical_lessons": 92, "total_lessons": 207, "revenue": 13203.00},
        {"month": "Aug 2024", "theoretical_lessons": 108, "practical_lessons": 99, "total_lessons": 207, "revenue": 13959.50}
    ]

@app.get("/api/dashboard/recent-activities")
async def get_recent_activities(limit: int = 10):
    """Get recent activities"""
    return [
        {
            "id": 1,
            "type": "student_enrolled",
            "title": "Novo aluno cadastrado",
            "description": "João Silva realizou matrícula no curso de carro",
            "timestamp": "2024-08-07T15:30:00Z",
            "icon": "fas fa-user-plus",
            "color": "success"
        },
        {
            "id": 2,
            "type": "lesson_completed",
            "title": "Aula prática realizada",
            "description": "Maria Oliveira completou aula prática no veículo ABC-1234",
            "timestamp": "2024-08-07T14:00:00Z",
            "icon": "fas fa-car",
            "color": "info"
        },
        {
            "id": 3,
            "type": "payment_received",
            "title": "Pagamento recebido",
            "description": "Pedro Santos realizou pagamento de R$ 300,00",
            "timestamp": "2024-08-07T12:30:00Z",
            "icon": "fas fa-file-invoice-dollar",
            "color": "success"
        }
    ]

@app.get("/api/students/")
async def get_students():
    """Get students list"""
    return [
        {
            "id": 1,
            "full_name": "João Silva",
            "cpf": "123.456.789-01",
            "email": "joao.silva@email.com",
            "phone": "(11) 99999-9999",
            "birth_date": "1995-03-15T00:00:00",
            "category": "B",
            "status": "active",
            "enrollment_date": "2024-01-15T00:00:00",
            "total_theoretical_hours": 25,
            "total_practical_hours": 15,
            "theoretical_exam_passed": True,
            "practical_exam_passed": False
        },
        {
            "id": 2,
            "full_name": "Maria Oliveira", 
            "cpf": "987.654.321-02",
            "email": "maria.oliveira@email.com",
            "phone": "(11) 88888-8888",
            "birth_date": "1992-07-20T00:00:00",
            "category": "A",
            "status": "active",
            "enrollment_date": "2023-11-10T00:00:00",
            "total_theoretical_hours": 30,
            "total_practical_hours": 20,
            "theoretical_exam_passed": True,
            "practical_exam_passed": True
        },
        {
            "id": 3,
            "full_name": "Pedro Santos",
            "cpf": "456.789.123-03",
            "email": "pedro.santos@email.com",
            "phone": "(11) 77777-7777",
            "birth_date": "1998-12-05T00:00:00",
            "category": "AB",
            "status": "graduated",
            "enrollment_date": "2023-06-01T00:00:00",
            "total_theoretical_hours": 45,
            "total_practical_hours": 40,
            "theoretical_exam_passed": True,
            "practical_exam_passed": True
        }
    ]

@app.post("/api/students/")
async def create_student(student_data: dict):
    """Create new student"""
    return {
        "id": 999,
        "message": "Student created successfully",
        "data": student_data
    }

@app.get("/api/auth/me")
async def get_current_user():
    """Get current user (mock)"""
    return {
        "id": 1,
        "email": "admin@autoescola.com",
        "full_name": "Administrador",
        "role": "admin"
    }

# Serve static files
app.mount("/assets", StaticFiles(directory="assets"), name="assets")
app.mount("/pages", StaticFiles(directory="pages"), name="pages")

@app.get("/")
async def root():
    """Serve the main page"""
    try:
        return FileResponse("index.html")
    except:
        return {
            "message": "AutoDrive API is running!",
            "frontend": "Visit /pages/dashboard.html for the dashboard",
            "docs": "Visit /api/docs for API documentation"
        }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "message": "AutoDrive API is running",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
