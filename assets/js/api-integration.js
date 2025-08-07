// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// API Helper Functions
class AutoDriveAPI {
    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('access_token');
    }

    // Set authorization header
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const config = {
                headers: this.getHeaders(),
                ...options
            };

            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Dashboard endpoints
    async getDashboardStats() {
        return this.request('/dashboard/stats');
    }

    async getDashboardData() {
        return this.request('/dashboard/');
    }

    async getMonthlyData(months = 6) {
        return this.request(`/dashboard/monthly-data?months=${months}`);
    }

    async getRecentActivities(limit = 10) {
        return this.request(`/dashboard/recent-activities?limit=${limit}`);
    }

    // Students endpoints
    async getStudents(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/students/?${queryString}`);
    }

    async getStudent(id) {
        return this.request(`/students/${id}`);
    }

    async createStudent(studentData) {
        return this.request('/students/', {
            method: 'POST',
            body: JSON.stringify(studentData)
        });
    }

    async updateStudent(id, studentData) {
        return this.request(`/students/${id}`, {
            method: 'PUT',
            body: JSON.stringify(studentData)
        });
    }

    async deleteStudent(id) {
        return this.request(`/students/${id}`, {
            method: 'DELETE'
        });
    }

    // Auth endpoints
    async login(email, password) {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await fetch(`${this.baseURL}/auth/token`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        this.token = data.access_token;
        localStorage.setItem('access_token', this.token);
        
        return data;
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    logout() {
        this.token = null;
        localStorage.removeItem('access_token');
    }
}

// Initialize API instance
const api = new AutoDriveAPI();

// Update dashboard with real data
async function loadDashboardData() {
    try {
        showLoading(true);
        
        // Load dashboard stats
        const stats = await api.getDashboardStats();
        updateDashboardStats(stats);
        
        // Load monthly data for charts
        const monthlyData = await api.getMonthlyData();
        updateChartsData(monthlyData);
        
        // Load recent activities
        const activities = await api.getRecentActivities();
        updateRecentActivities(activities);
        
        showLoading(false);
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showError('Falha ao carregar dados do dashboard');
        showLoading(false);
    }
}

// Update dashboard stats cards
function updateDashboardStats(stats) {
    // Update revenue
    const revenueElement = document.getElementById('revenue-count');
    if (revenueElement) {
        revenueElement.textContent = formatCurrency(stats.monthly_revenue);
    }
    
    // Update lessons count
    const lessonsElement = document.getElementById('lessons-count');
    if (lessonsElement) {
        lessonsElement.textContent = stats.lessons_today;
    }
    
    // Update vehicles count
    const vehiclesElement = document.getElementById('vehicles-count');
    if (vehiclesElement) {
        vehiclesElement.textContent = stats.available_vehicles;
    }
    
    // Update students count
    const studentsElement = document.getElementById('students-count');
    if (studentsElement) {
        studentsElement.textContent = stats.active_students;
    }
}

// Update charts with real data
function updateChartsData(monthlyData) {
    // Update lessons chart if it exists
    if (window.lessonsChart) {
        const labels = monthlyData.map(item => item.month);
        const theoreticalData = monthlyData.map(item => item.theoretical_lessons);
        const practicalData = monthlyData.map(item => item.practical_lessons);
        
        window.lessonsChart.data.labels = labels;
        window.lessonsChart.data.datasets[0].data = theoreticalData;
        window.lessonsChart.data.datasets[1].data = practicalData;
        window.lessonsChart.update();
    }
}

// Update recent activities
function updateRecentActivities(activities) {
    const activitiesList = document.getElementById('activities-list');
    if (!activitiesList) return;
    
    activitiesList.innerHTML = '';
    
    activities.forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item';
        
        activityElement.innerHTML = `
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-desc">${activity.description}</div>
                <div class="activity-time">${formatTimeAgo(activity.timestamp)}</div>
            </div>
        `;
        
        activitiesList.appendChild(activityElement);
    });
}

// Load students data
async function loadStudentsData(filters = {}) {
    try {
        showLoading(true);
        const students = await api.getStudents(filters);
        updateStudentsList(students);
        showLoading(false);
    } catch (error) {
        console.error('Failed to load students:', error);
        showError('Falha ao carregar dados dos alunos');
        showLoading(false);
    }
}

// Update students list
function updateStudentsList(students) {
    const studentsList = document.querySelector('.students-list');
    if (!studentsList) return;
    
    studentsList.innerHTML = '';
    
    students.forEach(student => {
        const studentElement = document.createElement('div');
        studentElement.className = `student-item ${student.status}`;
        
        studentElement.innerHTML = `
            <div class="student-avatar">
                ${student.full_name.charAt(0)}
            </div>
            <div class="student-details">
                <div class="student-name">${student.full_name}</div>
                <div class="student-info">
                    <span>${student.email}</span>
                    <span>Categoria: ${student.category}</span>
                </div>
            </div>
            <div class="student-progress">
                <div class="progress-info">
                    <span>Teóricas: ${student.total_theoretical_hours}h</span>
                    <span>Práticas: ${student.total_practical_hours}h</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${calculateProgress(student)}%"></div>
                </div>
            </div>
            <div class="student-status-badge ${student.status}">
                ${getStatusLabel(student.status)}
            </div>
            <div class="student-actions">
                <button onclick="editStudent(${student.id})" class="btn-icon">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="viewStudent(${student.id})" class="btn-icon">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        `;
        
        studentsList.appendChild(studentElement);
    });
}

// Enhanced form submission for students
async function submitStudentForm(formData) {
    try {
        showLoading(true);
        
        // Convert form data to API format
        const studentData = {
            full_name: formData.get('full_name'),
            cpf: formData.get('cpf'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            birth_date: new Date(formData.get('birth_date')).toISOString(),
            address: formData.get('address'),
            category: formData.get('category')
        };
        
        const result = await api.createStudent(studentData);
        
        showSuccess('Aluno cadastrado com sucesso!');
        closeModal('addStudentModal');
        
        // Reload students data if on students page
        if (getCurrentSection() === 'students') {
            await loadStudentsData();
        }
        
        // Reload dashboard data if on dashboard
        if (getCurrentSection() === 'dashboard') {
            await loadDashboardData();
        }
        
        showLoading(false);
        return result;
    } catch (error) {
        console.error('Failed to create student:', error);
        showError('Falha ao cadastrar aluno. Verifique os dados e tente novamente.');
        showLoading(false);
        throw error;
    }
}

// Utility Functions
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `Há ${minutes} minutos`;
    if (hours < 24) return `Há ${hours} horas`;
    return `Há ${days} dias`;
}

function calculateProgress(student) {
    // Simple progress calculation based on hours completed
    const totalTheoretical = student.total_theoretical_hours;
    const totalPractical = student.total_practical_hours;
    const requiredTheoretical = 45; // Example requirement
    const requiredPractical = 20;   // Example requirement
    
    const theoreticalProgress = Math.min(totalTheoretical / requiredTheoretical, 1);
    const practicalProgress = Math.min(totalPractical / requiredPractical, 1);
    
    return Math.round(((theoreticalProgress + practicalProgress) / 2) * 100);
}

function getStatusLabel(status) {
    const labels = {
        'active': 'Ativo',
        'suspended': 'Suspenso',
        'graduated': 'Formado',
        'dropped': 'Desistente'
    };
    return labels[status] || status;
}

function getCurrentSection() {
    const activeSection = document.querySelector('.content-section.active');
    return activeSection ? activeSection.id.replace('-content', '') : 'dashboard';
}

function showLoading(show) {
    // Add loading indicator logic here
    const existingLoader = document.querySelector('.loading-overlay');
    
    if (show && !existingLoader) {
        const loader = document.createElement('div');
        loader.className = 'loading-overlay';
        loader.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Carregando...</p>
            </div>
        `;
        document.body.appendChild(loader);
    } else if (!show && existingLoader) {
        existingLoader.remove();
    }
}

function showError(message) {
    // Add error notification logic here
    console.error(message);
    // You can implement a toast notification system here
}

function showSuccess(message) {
    // Add success notification logic here
    console.log(message);
    // You can implement a toast notification system here
}

// Initialize API integration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load initial dashboard data
    if (getCurrentSection() === 'dashboard') {
        loadDashboardData();
    }
    
    // Override form submissions to use API
    const studentForm = document.getElementById('addStudentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            await submitStudentForm(formData);
        });
    }
});

// Export API instance for use in other scripts
window.AutoDriveAPI = api;
