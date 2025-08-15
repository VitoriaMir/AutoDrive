/**
 * AutoDrive Dashboard Data Integration
 * Integra o dashboard com dados reais do Firestore
 */

// ===== INTEGRAÇÃO COM DASHBOARD =====

/**
 * Inicializar dashboard com dados do Firestore
 */
async function initializeDashboardData() {
    console.log('🔄 Inicializando dashboard com dados do Firestore...');
    
    try {
        // Aguardar autenticação
        if (!window.FirestoreManager || !window.FirestoreManager.getCurrentUser()) {
            console.log('⏳ Aguardando autenticação...');
            setTimeout(initializeDashboardData, 1000);
            return;
        }
        
        // Carregar estatísticas gerais
        await loadDashboardStats();
        
        // Configurar listeners em tempo real
        setupRealtimeListeners();
        
        console.log('✅ Dashboard inicializado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao inicializar dashboard:', error);
        showNotification('Erro ao carregar dados do dashboard', 'error');
    }
}

/**
 * Carregar estatísticas para o dashboard
 */
async function loadDashboardStats() {
    try {
        const stats = await window.FirestoreManager.getGeneralStats();
        
        // Atualizar cards do dashboard
        updateStatsCard('total-students', stats.totalStudents);
        updateStatsCard('total-instructors', stats.totalInstructors);
        updateStatsCard('total-vehicles', stats.totalVehicles);
        updateStatsCard('lessons-month', stats.lessonsThisMonth);
        
        console.log('✅ Estatísticas atualizadas');
    } catch (error) {
        console.error('❌ Erro ao carregar estatísticas:', error);
    }
}

/**
 * Atualizar card de estatística
 */
function updateStatsCard(cardId, value) {
    const elements = document.querySelectorAll(`[data-stat="${cardId}"]`);
    elements.forEach(element => {
        if (element) {
            // Animação de contagem
            animateNumber(element, parseInt(element.textContent) || 0, value);
        }
    });
}

/**
 * Animar número com contagem
 */
function animateNumber(element, start, end) {
    const duration = 1000;
    const steps = 30;
    const stepValue = (end - start) / steps;
    const stepTime = duration / steps;
    let current = start;
    
    const timer = setInterval(() => {
        current += stepValue;
        if ((stepValue > 0 && current >= end) || (stepValue < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, stepTime);
}

/**
 * Configurar listeners em tempo real
 */
function setupRealtimeListeners() {
    // Listener para alunos
    window.FirestoreManager.listenToStudents((students) => {
        updateStudentsList(students);
        updateStatsCard('total-students', students.length);
    });
    
    // Listener para aulas
    window.FirestoreManager.listenToLessons((lessons) => {
        updateLessonsList(lessons);
        updateUpcomingLessons(lessons);
    });
}

/**
 * Atualizar lista de alunos na interface
 */
function updateStudentsList(students) {
    // Atualizar tabela de alunos se existir
    const studentsTable = document.querySelector('#students-table tbody');
    if (studentsTable) {
        studentsTable.innerHTML = '';
        
        students.forEach(student => {
            const row = createStudentRow(student);
            studentsTable.appendChild(row);
        });
    }
    
    // Atualizar select de alunos em formulários
    updateStudentSelects(students);
}

/**
 * Criar linha da tabela de alunos
 */
function createStudentRow(student) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="user-info">
                <div class="user-avatar">
                    ${student.name ? student.name[0].toUpperCase() : 'A'}
                </div>
                <div class="user-details">
                    <span class="user-name">${student.name || 'Nome não informado'}</span>
                    <span class="user-email">${student.email || ''}</span>
                </div>
            </div>
        </td>
        <td>${student.phone || '-'}</td>
        <td>
            <span class="status-badge ${student.status || 'active'}">${getStatusText(student.status)}</span>
        </td>
        <td>${student.category || 'B'}</td>
        <td>${formatDate(student.createdAt)}</td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon" onclick="editStudent('${student.id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" onclick="viewStudent('${student.id}')" title="Visualizar">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon danger" onclick="deleteStudent('${student.id}')" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    return row;
}

/**
 * Atualizar selects de alunos
 */
function updateStudentSelects(students) {
    const selects = document.querySelectorAll('select[name="studentId"], select[name="student"]');
    selects.forEach(select => {
        // Manter valor selecionado
        const currentValue = select.value;
        
        // Limpar e repovoar
        select.innerHTML = '<option value="">Selecione um aluno</option>';
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = student.name;
            select.appendChild(option);
        });
        
        // Restaurar valor selecionado
        if (currentValue) {
            select.value = currentValue;
        }
    });
}

/**
 * Atualizar lista de aulas próximas
 */
function updateUpcomingLessons(lessons) {
    const upcomingContainer = document.querySelector('.upcoming-lessons');
    if (upcomingContainer) {
        upcomingContainer.innerHTML = '';
        
        const nextLessons = lessons
            .filter(lesson => new Date(lesson.date) > new Date())
            .slice(0, 5);
        
        nextLessons.forEach(lesson => {
            const lessonElement = createLessonCard(lesson);
            upcomingContainer.appendChild(lessonElement);
        });
    }
}

/**
 * Criar card de aula
 */
function createLessonCard(lesson) {
    const card = document.createElement('div');
    card.className = 'lesson-card';
    card.innerHTML = `
        <div class="lesson-time">${formatTime(lesson.time)}</div>
        <div class="lesson-details">
            <strong>${lesson.studentName || 'Aluno'}</strong>
            <span>${lesson.instructorName || 'Instrutor'}</span>
        </div>
        <div class="lesson-vehicle">${lesson.vehicleModel || 'Veículo'}</div>
    `;
    return card;
}

/**
 * Funções utilitárias
 */
function getStatusText(status) {
    const statusMap = {
        'active': 'Ativo',
        'inactive': 'Inativo',
        'suspended': 'Suspenso',
        'completed': 'Concluído'
    };
    return statusMap[status] || 'Ativo';
}

function formatDate(date) {
    if (!date) return '-';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('pt-BR');
}

function formatTime(time) {
    if (!time) return '';
    return time.toString().padStart(2, '0') + ':00';
}

// ===== INTEGRAÇÃO COM FORMULÁRIOS =====

/**
 * Submeter formulário de novo aluno
 */
async function submitStudentForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const studentData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        cpf: formData.get('cpf'),
        birthDate: formData.get('birthDate'),
        address: formData.get('address'),
        category: formData.get('category') || 'B',
        status: 'active'
    };
    
    try {
        showNotification('Cadastrando aluno...', 'info');
        const result = await window.FirestoreManager.addStudent(studentData);
        
        showNotification('Aluno cadastrado com sucesso!', 'success');
        form.reset();
        closeModal('addStudentModal');
        
        console.log('✅ Aluno cadastrado:', result);
    } catch (error) {
        console.error('❌ Erro ao cadastrar aluno:', error);
        showNotification('Erro ao cadastrar aluno: ' + error.message, 'error');
    }
}

/**
 * Submeter formulário de novo instrutor
 */
async function submitInstructorForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const instructorData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        cpf: formData.get('cpf'),
        cnh: formData.get('cnh'),
        specialties: formData.getAll('specialties'),
        status: 'active'
    };
    
    try {
        showNotification('Cadastrando instrutor...', 'info');
        const result = await window.FirestoreManager.addInstructor(instructorData);
        
        showNotification('Instrutor cadastrado com sucesso!', 'success');
        form.reset();
        closeModal('addInstructorModal');
        
        console.log('✅ Instrutor cadastrado:', result);
    } catch (error) {
        console.error('❌ Erro ao cadastrar instrutor:', error);
        showNotification('Erro ao cadastrar instrutor: ' + error.message, 'error');
    }
}

/**
 * Submeter formulário de novo veículo
 */
async function submitVehicleForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const vehicleData = {
        model: formData.get('model'),
        brand: formData.get('brand'),
        year: formData.get('year'),
        plate: formData.get('plate'),
        color: formData.get('color'),
        category: formData.get('category'),
        status: 'available'
    };
    
    try {
        showNotification('Cadastrando veículo...', 'info');
        const result = await window.FirestoreManager.addVehicle(vehicleData);
        
        showNotification('Veículo cadastrado com sucesso!', 'success');
        form.reset();
        closeModal('addVehicleModal');
        
        console.log('✅ Veículo cadastrado:', result);
    } catch (error) {
        console.error('❌ Erro ao cadastrar veículo:', error);
        showNotification('Erro ao cadastrar veículo: ' + error.message, 'error');
    }
}

// ===== AÇÕES DE INTERFACE =====

async function editStudent(studentId) {
    try {
        const student = await window.FirestoreManager.getStudent(studentId);
        if (student) {
            // Preencher formulário de edição
            populateEditForm('editStudentForm', student);
            openModal('editStudentModal');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar dados do aluno:', error);
        showNotification('Erro ao carregar dados do aluno', 'error');
    }
}

async function viewStudent(studentId) {
    try {
        const student = await window.FirestoreManager.getStudent(studentId);
        if (student) {
            // Mostrar modal de visualização
            showStudentDetails(student);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar dados do aluno:', error);
        showNotification('Erro ao carregar dados do aluno', 'error');
    }
}

async function deleteStudent(studentId) {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
        try {
            await window.FirestoreManager.deactivateStudent(studentId);
            showNotification('Aluno excluído com sucesso!', 'success');
        } catch (error) {
            console.error('❌ Erro ao excluir aluno:', error);
            showNotification('Erro ao excluir aluno', 'error');
        }
    }
}

function populateEditForm(formId, data) {
    const form = document.getElementById(formId);
    if (form) {
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = data[key];
            }
        });
    }
}

// ===== INICIALIZAÇÃO =====

// Aguardar carregamento completo
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar Firebase estar disponível
    setTimeout(() => {
        initializeDashboardData();
        
        // Conectar formulários
        const studentForm = document.getElementById('addStudentForm');
        if (studentForm) {
            studentForm.addEventListener('submit', submitStudentForm);
        }
        
        const instructorForm = document.getElementById('addInstructorForm');
        if (instructorForm) {
            instructorForm.addEventListener('submit', submitInstructorForm);
        }
        
        const vehicleForm = document.getElementById('addVehicleForm');
        if (vehicleForm) {
            vehicleForm.addEventListener('submit', submitVehicleForm);
        }
        
    }, 2000);
});

// Exportar funções para uso global
window.DashboardIntegration = {
    initializeDashboardData,
    loadDashboardStats,
    submitStudentForm,
    submitInstructorForm,
    submitVehicleForm,
    editStudent,
    viewStudent,
    deleteStudent
};
