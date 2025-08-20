/**
 * Instructors Section JavaScript
 * Contém todas as funções relacionadas à seção de instrutores
 */

// Variável global para o gráfico de instrutores
let instructorsChart = null;

// ============================================
// INICIALIZAÇÃO DOS GRÁFICOS
// ============================================

/**
 * Inicializa o gráfico de estatísticas dos instrutores
 */
function initInstructorsChart() {
    const ctx = document.getElementById("instructors-chart");
    if (!ctx) return;

    // Clear any existing chart
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    const instructorsData = {
        6: {
            labels: ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
            lessons: [95, 124, 108, 142, 135, 128],
            ratings: [4.5, 4.6, 4.7, 4.8, 4.6, 4.7],
            approval: [78, 82, 85, 88, 86, 87],
            students: [45, 52, 48, 58, 54, 56],
        },
        12: {
            labels: [
                "Set",
                "Out",
                "Nov",
                "Dez",
                "Jan",
                "Fev",
                "Mar",
                "Abr",
                "Mai",
                "Jun",
                "Jul",
                "Ago",
            ],
            lessons: [89, 102, 95, 118, 125, 132, 95, 124, 108, 142, 135, 128],
            ratings: [4.3, 4.4, 4.5, 4.6, 4.5, 4.6, 4.5, 4.6, 4.7, 4.8, 4.6, 4.7],
            approval: [75, 76, 78, 80, 79, 81, 78, 82, 85, 88, 86, 87],
            students: [38, 42, 39, 46, 48, 51, 45, 52, 48, 58, 54, 56],
        },
        24: {
            labels: [
                "Ago 2023",
                "Set",
                "Out",
                "Nov",
                "Dez",
                "Jan 2024",
                "Fev",
                "Mar",
                "Abr",
                "Mai",
                "Jun",
                "Jul",
                "Ago 2024",
                "Set",
                "Out",
                "Nov",
                "Dez",
                "Jan 2025",
                "Fev",
                "Mar",
                "Abr",
                "Mai",
                "Jun",
                "Jul",
                "Ago",
            ],
            lessons: [
                82, 88, 94, 89, 102, 95, 118, 125, 132, 95, 124, 108, 142, 135, 128,
                134, 129, 138, 145, 142, 148, 152, 149, 156, 158,
            ],
            ratings: [
                4.2, 4.2, 4.3, 4.3, 4.4, 4.5, 4.6, 4.5, 4.6, 4.5, 4.6, 4.7, 4.8, 4.6,
                4.7, 4.7, 4.8, 4.8, 4.9, 4.8, 4.9, 4.9, 4.8, 4.9, 4.9,
            ],
            approval: [
                72, 73, 75, 74, 76, 78, 80, 79, 81, 78, 82, 85, 88, 86, 87, 87, 88, 89,
                90, 89, 91, 92, 90, 91, 92,
            ],
            students: [
                32, 35, 38, 36, 42, 39, 46, 48, 51, 45, 52, 48, 58, 54, 56, 57, 55, 59,
                62, 60, 64, 66, 63, 67, 68,
            ],
        },
    };

    const currentPeriod =
        document.getElementById("instructors-period-filter")?.value || "6";
    const data = instructorsData[currentPeriod];

    instructorsChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: "Aulas Ministradas",
                    data: data.lessons,
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "#3b82f6",
                    pointBorderColor: "#ffffff",
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                },
                {
                    label: "Taxa de Aprovação (%)",
                    data: data.approval,
                    borderColor: "#22c55e",
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "#22c55e",
                    pointBorderColor: "#ffffff",
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                },
                {
                    label: "Alunos Atendidos",
                    data: data.students,
                    borderColor: "#f59e0b",
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "#f59e0b",
                    pointBorderColor: "#ffffff",
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 2000,
                easing: "easeInOutCubic",
            },
            interaction: {
                mode: "index",
                intersect: false,
            },
            scales: {
                x: {
                    grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                        drawBorder: false,
                    },
                    ticks: {
                        color: "rgba(255, 255, 255, 0.7)",
                        font: {
                            size: 11,
                            weight: 500,
                        },
                    },
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                        drawBorder: false,
                    },
                    ticks: {
                        color: "rgba(255, 255, 255, 0.7)",
                        font: {
                            size: 11,
                            weight: 500,
                        },
                    },
                },
            },
            plugins: {
                legend: {
                    position: "top",
                    labels: {
                        color: "rgba(255, 255, 255, 0.8)",
                        font: {
                            size: 12,
                            weight: 500,
                        },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: "circle",
                    },
                },
                tooltip: {
                    backgroundColor: "rgba(17, 24, 39, 0.95)",
                    titleColor: "#ffffff",
                    bodyColor: "#ffffff",
                    borderColor: "rgba(75, 85, 99, 0.3)",
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    titleFont: {
                        size: 13,
                        weight: 600,
                    },
                    bodyFont: {
                        size: 12,
                        weight: 500,
                    },
                    padding: 12,
                },
            },
        },
    });

    window.instructorsChart = instructorsChart;
    console.log("Instructors chart initialized successfully");
}

// ============================================
// GERENCIAMENTO DE DADOS DOS INSTRUTORES
// ============================================

/**
 * Carrega todos os dados dos instrutores
 */
async function loadAllInstructorsData() {
    try {
        console.log("Loading all instructors data...");

        // Simular carregamento de dados
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Atualizar gráficos se estiverem visíveis
        if (document.getElementById('instructors-chart')) {
            initInstructorsChart();
        }

        // Renderizar lista de instrutores
        renderInstructorsList();

    } catch (error) {
        console.error("Erro ao carregar dados dos instrutores:", error);
        showNotification("Erro ao carregar dados dos instrutores", "error");
    }
}

/**
 * Renderiza a lista de instrutores
 */
function renderInstructorsList() {
    const container = document.getElementById('instructors-list-container');
    if (!container) return;

    // Dados de exemplo
    const instructors = [
        {
            id: 1,
            name: "Carlos Santos",
            specialties: ["Categoria B", "Categoria A"],
            rating: 4.8,
            students: 45,
            status: "Ativo",
            experience: "5 anos"
        },
        {
            id: 2,
            name: "Maria Oliveira",
            specialties: ["Categoria B"],
            rating: 4.9,
            students: 38,
            status: "Ativo",
            experience: "8 anos"
        },
        {
            id: 3,
            name: "João Pereira",
            specialties: ["Categoria A", "Categoria AB"],
            rating: 4.7,
            students: 52,
            status: "Ativo",
            experience: "3 anos"
        },
        {
            id: 4,
            name: "Ana Paula",
            specialties: ["Categoria B"],
            rating: 4.6,
            students: 29,
            status: "Em Férias",
            experience: "6 anos"
        }
    ];

    const html = instructors.map(instructor => `
    <div class="instructor-card" data-instructor-id="${instructor.id}">
      <div class="instructor-info">
        <h4>${instructor.name}</h4>
        <p class="specialties">${instructor.specialties.join(', ')}</p>
        <div class="instructor-stats">
          <span class="rating">⭐ ${instructor.rating}</span>
          <span class="students">👥 ${instructor.students} alunos</span>
          <span class="experience">📅 ${instructor.experience}</span>
        </div>
      </div>
      <div class="instructor-actions">
        <span class="status status-${instructor.status.toLowerCase().replace(' ', '-')}">${instructor.status}</span>
        <div class="action-buttons">
          <button onclick="viewInstructorProfile(${instructor.id})" class="btn-icon" title="Ver Perfil">
            <i class="fas fa-eye"></i>
          </button>
          <button onclick="editInstructor(${instructor.id})" class="btn-icon" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="viewInstructorSchedule(${instructor.id})" class="btn-icon" title="Agenda">
            <i class="fas fa-calendar"></i>
          </button>
          <button onclick="contactInstructor(${instructor.id})" class="btn-icon" title="Contatar">
            <i class="fas fa-phone"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

    container.innerHTML = html;
}

/**
 * Filtra a lista de instrutores
 */
function filterInstructorsList(filter) {
    const cards = document.querySelectorAll('.instructor-card');

    cards.forEach(card => {
        const status = card.querySelector('.status').textContent.toLowerCase();

        if (filter === 'all' || status.includes(filter.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Pesquisa instrutores
 */
function searchInstructors(query) {
    const cards = document.querySelectorAll('.instructor-card');
    const searchTerm = query.toLowerCase();

    cards.forEach(card => {
        const name = card.querySelector('h4').textContent.toLowerCase();
        const specialties = card.querySelector('.specialties').textContent.toLowerCase();

        if (name.includes(searchTerm) || specialties.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ============================================
// AÇÕES DOS INSTRUTORES
// ============================================

/**
 * Visualiza o perfil de um instrutor
 */
function viewInstructorProfile(instructorId) {
    console.log(`Viewing profile for instructor ID: ${instructorId}`);
    showNotification(`Visualizando perfil do instrutor ${instructorId}`, "info");
}

/**
 * Edita um instrutor
 */
function editInstructor(instructorId) {
    console.log(`Editing instructor ID: ${instructorId}`);
    showNotification(`Editando instrutor ${instructorId}`, "info");
}

/**
 * Visualiza a agenda de um instrutor
 */
function viewInstructorSchedule(instructorId) {
    console.log(`Viewing schedule for instructor ID: ${instructorId}`);
    showNotification(`Visualizando agenda do instrutor ${instructorId}`, "info");
}

/**
 * Visualiza estatísticas de um instrutor
 */
function viewInstructorStats(instructorId) {
    console.log(`Viewing stats for instructor ID: ${instructorId}`);
    showNotification(`Visualizando estatísticas do instrutor ${instructorId}`, "info");
}

/**
 * Contata um instrutor
 */
function contactInstructor(instructorId) {
    console.log(`Contacting instructor ID: ${instructorId}`);
    showNotification(`Contatando instrutor ${instructorId}`, "info");
}

/**
 * Atribui uma aula para um instrutor
 */
function assignLesson(instructorId) {
    console.log(`Assigning lesson to instructor ID: ${instructorId}`);
    showNotification(`Agendando aula para instrutor ${instructorId}...`, "info");
}

// ============================================
// MODAL DE ADICIONAR INSTRUTOR
// ============================================

/**
 * Abre o modal de adicionar instrutor
 */
function openInstructorModal() {
    const modal = document.getElementById("addInstructorModal");
    if (modal) {
        openModal("addInstructorModal");
    }
}

/**
 * Submete o formulário de novo instrutor
 */
async function submitInstructor() {
    const form = document.getElementById("addInstructorForm");
    if (!form) return;

    try {
        const formData = new FormData(form);
        const instructorData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            cnh: formData.get('cnh'),
            specialties: formData.getAll('specialties'),
            birthDate: formData.get('birthDate'),
            address: formData.get('address'),
            experience: formData.get('experience'),
            observations: formData.get('observations')
        };

        console.log("Submitting instructor data:", instructorData);

        // Validação básica
        if (!instructorData.name || !instructorData.email || !instructorData.phone) {
            throw new Error("Nome, email e telefone são obrigatórios");
        }

        // Aqui você integraria com o Firestore
        const result = await window.FirestoreManager.addInstructor(instructorData);

        showNotification("Instrutor adicionado com sucesso!", "success");
        closeModal("addInstructorModal");
        form.reset();

        // Recarregar dados se estiver na seção de instrutores
        if (document.querySelector('.menu-item[data-section="instructors"]').classList.contains('active')) {
            loadAllInstructorsData();
        }

    } catch (error) {
        console.error("Erro ao adicionar instrutor:", error);
        showNotification("Erro ao adicionar instrutor: " + error.message, "error");
    }
}

// ============================================
// RELATÓRIOS E EXPORTAÇÃO
// ============================================

/**
 * Gera relatório de instrutores
 */
function generateInstructorsReport() {
    console.log("Generating instructors report...");
    showNotification("Relatório de instrutores gerado com sucesso!", "success");
}

/**
 * Exporta gráfico de instrutores
 */
function exportInstructorsChart() {
    if (instructorsChart) {
        const url = instructorsChart.toBase64Image();
        const link = document.createElement('a');
        link.download = 'grafico-instrutores.png';
        link.href = url;
        link.click();
        showNotification("Gráfico exportado com sucesso!", "success");
    }
}

// ============================================
// INICIALIZAÇÃO E EVENTOS
// ============================================

/**
 * Inicializa a seção de instrutores
 */
function initInstructorsSection() {
    console.log("Initializing instructors section...");

    // Inicializar gráficos se os elementos existirem
    setTimeout(() => {
        if (document.getElementById('instructors-chart')) {
            initInstructorsChart();
        }

        // Carregar dados
        loadAllInstructorsData();

        // Configurar filtros de período
        const periodFilter = document.getElementById('instructors-period-filter');
        if (periodFilter) {
            periodFilter.addEventListener('change', function () {
                initInstructorsChart();
            });
        }

        // Configurar busca
        const searchInput = document.querySelector('#instructors-content .search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', function (e) {
                searchInstructors(e.target.value);
            });
        }

    }, 100);
}

// ============================================
// LISTENER PARA INICIALIZAÇÃO AUTOMÁTICA
// ============================================

// Escuta o evento de carregamento de seção
document.addEventListener('sectionLoaded', function (event) {
    if (event.detail.sectionId === 'instructors-section') {
        console.log("Instructors section loaded, initializing...");
        initInstructorsSection();
    }
});

// Também inicializa se a seção já estiver carregada
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        if (document.getElementById('instructors-content')) {
            initInstructorsSection();
        }
    });
} else {
    if (document.getElementById('instructors-content')) {
        initInstructorsSection();
    }
}

// ============================================
// EXPOSIÇÃO GLOBAL DAS FUNÇÕES
// ============================================

// Expor funções principais globalmente
window.initInstructorsChart = initInstructorsChart;
window.loadAllInstructorsData = loadAllInstructorsData;
window.renderInstructorsList = renderInstructorsList;
window.filterInstructorsList = filterInstructorsList;
window.searchInstructors = searchInstructors;
window.viewInstructorProfile = viewInstructorProfile;
window.editInstructor = editInstructor;
window.viewInstructorSchedule = viewInstructorSchedule;
window.viewInstructorStats = viewInstructorStats;
window.contactInstructor = contactInstructor;
window.assignLesson = assignLesson;
window.openInstructorModal = openInstructorModal;
window.submitInstructor = submitInstructor;
window.generateInstructorsReport = generateInstructorsReport;
window.exportInstructorsChart = exportInstructorsChart;
window.initInstructorsSection = initInstructorsSection;

console.log("Instructors section JavaScript loaded successfully");
