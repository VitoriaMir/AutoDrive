/**
 * Students Section JavaScript
 * Contém todas as funções relacionadas à seção de alunos
 */

// Variável global para o gráfico de alunos
let studentsChart = null;
let studentsPerformanceChart = null;

// ============================================
// INICIALIZAÇÃO DOS GRÁFICOS
// ============================================

/**
 * Inicializa o gráfico de estatísticas de alunos
 */
function initStudentsChart() {
  const studentsCtx = document.getElementById("students-chart");
  console.log("Initializing students chart:", studentsCtx);

  if (studentsCtx) {
    // Clear any existing chart
    studentsChart = destroyChart(studentsChart);
    // Garantir que o gráfico fique acessível globalmente
    window.studentsChart = null;

    const studentsData = {
      6: {
        labels: ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
        novosAlunos: [28, 35, 42, 38, 45, 52],
        aprovados: [22, 28, 35, 30, 38, 44],
        emProgresso: [65, 72, 68, 75, 82, 88],
        desistentes: [3, 4, 2, 5, 3, 4],
        satisfacao: [4.5, 4.6, 4.7, 4.6, 4.8, 4.8],
      },
      12: {
        labels: [
          "Set/23",
          "Out/23",
          "Nov/23",
          "Dez/23",
          "Jan/24",
          "Fev/24",
          "Mar/24",
          "Abr/24",
          "Mai/24",
          "Jun/24",
          "Jul/24",
          "Ago/24",
        ],
        novosAlunos: [25, 32, 29, 34, 41, 36, 28, 35, 42, 38, 45, 52],
        aprovados: [18, 24, 26, 28, 32, 25, 22, 28, 35, 30, 38, 44],
        emProgresso: [58, 62, 65, 69, 73, 68, 65, 72, 68, 75, 82, 88],
        desistentes: [2, 3, 4, 2, 3, 5, 3, 4, 2, 5, 3, 4],
        satisfacao: [
          4.3, 4.4, 4.5, 4.4, 4.6, 4.5, 4.5, 4.6, 4.7, 4.6, 4.8, 4.8,
        ],
      },
      24: {
        labels: [
          "Ago/22",
          "Nov/22",
          "Fev/23",
          "Mai/23",
          "Ago/23",
          "Nov/23",
          "Fev/24",
          "Mai/24",
          "Ago/24",
        ],
        novosAlunos: [22, 28, 31, 27, 29, 34, 36, 42, 52],
        aprovados: [15, 21, 24, 20, 26, 28, 25, 35, 44],
        emProgresso: [52, 58, 61, 55, 65, 69, 68, 68, 88],
        desistentes: [4, 3, 2, 4, 4, 2, 5, 2, 4],
        satisfacao: [4.1, 4.2, 4.3, 4.2, 4.5, 4.4, 4.5, 4.7, 4.8],
      },
    };

    const currentPeriod =
      document.getElementById("students-period-filter")?.value || "6";
    const data = studentsData[currentPeriod];

    studentsChart = new Chart(studentsCtx.getContext("2d"), {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Novos Alunos",
            data: data.novosAlunos,
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
            label: "Formados",
            data: data.aprovados,
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
            label: "Em Progresso",
            data: data.emProgresso,
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
          {
            label: "Desistências",
            data: data.desistentes,
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderWidth: 2,
            borderDash: [8, 4],
            fill: false,
            tension: 0.4,
            pointBackgroundColor: "#ef4444",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
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
              stepSize: 10,
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

    // Tornar acessível globalmente
    window.studentsChart = studentsChart;
    console.log("Students chart initialized successfully");
  } else {
    console.error("Students chart canvas not found");
  }
}

/**
 * Inicializa o gráfico de performance dos alunos
 */
function initStudentsPerformanceChart() {
  const ctx = document.getElementById("studentsPerformanceChart");
  if (!ctx) return;

  // Destruir gráfico existente se houver
  if (studentsPerformanceChart) {
    studentsPerformanceChart.destroy();
  }

  const data = {
    labels: ['Excelente', 'Bom', 'Regular', 'Ruim'],
    datasets: [{
      data: [35, 45, 15, 5],
      backgroundColor: [
        '#22c55e',
        '#3b82f6', 
        '#f59e0b',
        '#ef4444'
      ],
      borderWidth: 0,
      hoverOffset: 8
    }]
  };

  studentsPerformanceChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'rgba(255, 255, 255, 0.8)',
            font: {
              size: 12,
              weight: 500
            },
            padding: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + '%';
            }
          }
        }
      },
      cutout: '60%'
    }
  });

  window.studentsPerformanceChart = studentsPerformanceChart;
}

// ============================================
// GERENCIAMENTO DE DADOS DOS ALUNOS
// ============================================

/**
 * Carrega todos os dados dos alunos
 */
async function loadAllStudentsData() {
  try {
    console.log("Loading all students data...");
    
    // Simular carregamento de dados
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Atualizar gráficos se estiverem visíveis
    if (document.getElementById('students-chart')) {
      initStudentsChart();
    }
    
    if (document.getElementById('studentsPerformanceChart')) {
      initStudentsPerformanceChart();
    }
    
    // Renderizar lista de alunos
    renderStudentsList();
    
  } catch (error) {
    console.error("Erro ao carregar dados dos alunos:", error);
    showNotification("Erro ao carregar dados dos alunos", "error");
  }
}

/**
 * Renderiza a lista de alunos
 */
function renderStudentsList() {
  const container = document.getElementById('students-list-container');
  if (!container) return;
  
  // Dados de exemplo
  const students = [
    { id: 1, name: "Ana Silva", category: "Categoria B", status: "Ativo", progress: 75 },
    { id: 2, name: "João Santos", category: "Categoria A", status: "Formado", progress: 100 },
    { id: 3, name: "Maria Oliveira", category: "Categoria B", status: "Ativo", progress: 60 },
    { id: 4, name: "Pedro Costa", category: "Categoria A", status: "Em Progresso", progress: 45 },
    { id: 5, name: "Lucas Ferreira", category: "Categoria B", status: "Ativo", progress: 80 }
  ];
  
  const html = students.map(student => `
    <div class="student-card" data-student-id="${student.id}">
      <div class="student-info">
        <h4>${student.name}</h4>
        <p class="category">${student.category}</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${student.progress}%"></div>
          <span class="progress-text">${student.progress}%</span>
        </div>
      </div>
      <div class="student-actions">
        <span class="status status-${student.status.toLowerCase().replace(' ', '-')}">${student.status}</span>
        <div class="action-buttons">
          <button onclick="viewStudentProfile(${student.id})" class="btn-icon" title="Ver Perfil">
            <i class="fas fa-eye"></i>
          </button>
          <button onclick="editStudent(${student.id})" class="btn-icon" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="contactStudent(${student.id})" class="btn-icon" title="Contatar">
            <i class="fas fa-phone"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

/**
 * Filtra a lista de alunos
 */
function filterStudentsList(filter) {
  const cards = document.querySelectorAll('.student-card');
  
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
 * Pesquisa alunos
 */
function searchStudents(query) {
  const cards = document.querySelectorAll('.student-card');
  const searchTerm = query.toLowerCase();
  
  cards.forEach(card => {
    const name = card.querySelector('h4').textContent.toLowerCase();
    const category = card.querySelector('.category').textContent.toLowerCase();
    
    if (name.includes(searchTerm) || category.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// ============================================
// AÇÕES DOS ALUNOS
// ============================================

/**
 * Visualiza o perfil de um aluno
 */
function viewStudentProfile(studentId) {
  console.log(`Viewing profile for student ID: ${studentId}`);
  // Implementar visualização do perfil
  showNotification(`Visualizando perfil do aluno ${studentId}`, "info");
}

/**
 * Edita um aluno
 */
function editStudent(studentId) {
  console.log(`Editing student ID: ${studentId}`);
  // Implementar edição do aluno
  showNotification(`Editando aluno ${studentId}`, "info");
}

/**
 * Contata um aluno
 */
function contactStudent(studentId) {
  console.log(`Contacting student ID: ${studentId}`);
  // Implementar contato com aluno
  showNotification(`Contatando aluno ${studentId}`, "info");
}

/**
 * Visualiza as aulas de um aluno
 */
function viewStudentLessons(studentId) {
  console.log(`Viewing lessons for student ID: ${studentId}`);
  // Implementar visualização das aulas
  showNotification(`Visualizando aulas do aluno ${studentId}`, "info");
}

// ============================================
// MODAL DE ADICIONAR ALUNO
// ============================================

/**
 * Abre o modal de adicionar aluno
 */
function openStudentModal() {
  const modal = document.getElementById("addStudentModal");
  if (modal) {
    openModal("addStudentModal");
  }
}

/**
 * Submete o formulário de novo aluno
 */
async function submitStudent() {
  const form = document.getElementById("addStudentForm");
  if (!form) return;

  try {
    const formData = new FormData(form);
    const studentData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      category: formData.get('category'),
      birthDate: formData.get('birthDate'),
      address: formData.get('address'),
      cnh: formData.get('cnh'),
      observations: formData.get('observations')
    };

    console.log("Submitting student data:", studentData);

    // Validação básica
    if (!studentData.name || !studentData.email || !studentData.phone) {
      throw new Error("Nome, email e telefone são obrigatórios");
    }

    // Aqui você integraria com o Firestore
    const result = await window.FirestoreManager.addStudent(studentData);
    
    showNotification("Aluno adicionado com sucesso!", "success");
    closeModal("addStudentModal");
    form.reset();
    
    // Recarregar dados se estiver na seção de alunos
    if (document.querySelector('.menu-item[data-section="students"]').classList.contains('active')) {
      loadAllStudentsData();
    }
    
  } catch (error) {
    console.error("Erro ao adicionar aluno:", error);
    showNotification("Erro ao adicionar aluno: " + error.message, "error");
  }
}

// ============================================
// MODAL DE VISUALIZAR TODOS OS ALUNOS
// ============================================

/**
 * Visualiza todos os alunos em modal
 */
function viewAllStudents() {
  const modalContent = `
    <div class="students-overview">
      <div class="overview-stats">
        <div class="stat-card">
          <h3>Total de Alunos</h3>
          <span class="stat-number">156</span>
        </div>
        <div class="stat-card">
          <h3>Ativos</h3>
          <span class="stat-number">142</span>
        </div>
        <div class="stat-card">
          <h3>Formados</h3>
          <span class="stat-number">89</span>
        </div>
        <div class="stat-card">
          <h3>Em Progresso</h3>
          <span class="stat-number">67</span>
        </div>
      </div>
      
      <div class="students-filters">
        <select id="statusFilter" onchange="filterStudentsList(this.value)">
          <option value="all">Todos os Status</option>
          <option value="ativo">Ativos</option>
          <option value="formado">Formados</option>
          <option value="em-progresso">Em Progresso</option>
        </select>
        
        <select id="categoryFilter">
          <option value="all">Todas as Categorias</option>
          <option value="A">Categoria A</option>
          <option value="B">Categoria B</option>
          <option value="AB">Categoria AB</option>
        </select>
      </div>
      
      <div class="students-list" id="modal-students-list">
        ${generateStudentsListHTML()}
      </div>
      
      <div class="modal-actions">
        <button class="btn btn-primary" onclick="openStudentModal(); closeModal('viewAllStudentsModal')" style="margin-top: 15px;">
          <i class="fas fa-plus"></i> Adicionar Novo Aluno
        </button>
      </div>
    </div>
  `;

  // Criar e abrir modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'viewAllStudentsModal';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal('viewAllStudentsModal')"></div>
    <div class="modal-content large-modal">
      <div class="modal-header">
        <h2><i class="fas fa-users"></i> Todos os Alunos</h2>
        <button class="modal-close" onclick="closeModal('viewAllStudentsModal')">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        ${modalContent}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  openModal('viewAllStudentsModal');
}

/**
 * Gera HTML para lista de alunos no modal
 */
function generateStudentsListHTML() {
  const students = [
    { id: 1, name: "Ana Silva", category: "B", status: "Ativo", progress: 75, phone: "(11) 99999-0001" },
    { id: 2, name: "João Santos", category: "A", status: "Formado", progress: 100, phone: "(11) 99999-0002" },
    { id: 3, name: "Maria Oliveira", category: "B", status: "Ativo", progress: 60, phone: "(11) 99999-0003" },
    { id: 4, name: "Pedro Costa", category: "A", status: "Em Progresso", progress: 45, phone: "(11) 99999-0004" },
    { id: 5, name: "Lucas Ferreira", category: "B", status: "Ativo", progress: 80, phone: "(11) 99999-0005" }
  ];

  return students.map(student => `
    <div class="student-row">
      <div class="student-info">
        <div class="student-name">${student.name}</div>
        <div class="student-details">Cat. ${student.category} • ${student.phone}</div>
      </div>
      <div class="student-progress">
        <div class="progress-bar-small">
          <div class="progress-fill" style="width: ${student.progress}%"></div>
        </div>
        <span class="progress-text">${student.progress}%</span>
      </div>
      <div class="student-status">
        <span class="status status-${student.status.toLowerCase().replace(' ', '-')}">${student.status}</span>
      </div>
      <div class="student-actions">
        <button onclick="viewStudentProfile(${student.id})" class="btn-sm" title="Ver Perfil">
          <i class="fas fa-eye"></i>
        </button>
        <button onclick="editStudent(${student.id})" class="btn-sm" title="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="contactStudent(${student.id})" class="btn-sm" title="Contatar">
          <i class="fas fa-phone"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// ============================================
// RELATÓRIOS E EXPORTAÇÃO
// ============================================

/**
 * Gera relatório de alunos
 */
function generateStudentsReport() {
  console.log("Generating students report...");
  showNotification("Relatório de alunos gerado com sucesso!", "success");
}

/**
 * Exporta gráfico de alunos
 */
function exportStudentsChart() {
  if (studentsChart) {
    const url = studentsChart.toBase64Image();
    const link = document.createElement('a');
    link.download = 'grafico-alunos.png';
    link.href = url;
    link.click();
    showNotification("Gráfico exportado com sucesso!", "success");
  }
}

// ============================================
// INICIALIZAÇÃO E EVENTOS
// ============================================

/**
 * Inicializa a seção de alunos
 */
function initStudentsSection() {
  console.log("Initializing students section...");
  
  // Inicializar gráficos se os elementos existirem
  setTimeout(() => {
    if (document.getElementById('students-chart')) {
      initStudentsChart();
    }
    
    if (document.getElementById('studentsPerformanceChart')) {
      initStudentsPerformanceChart();
    }
    
    // Carregar dados
    loadAllStudentsData();
    
    // Configurar filtros de período
    const periodFilter = document.getElementById('students-period-filter');
    if (periodFilter) {
      periodFilter.addEventListener('change', function() {
        initStudentsChart();
      });
    }
    
    // Configurar busca
    const searchInput = document.querySelector('#students-content .search-bar input');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        searchStudents(e.target.value);
      });
    }
    
  }, 100);
}

// ============================================
// EXPOSIÇÃO GLOBAL DAS FUNÇÕES
// ============================================

// Expor funções principais globalmente
window.initStudentsChart = initStudentsChart;
window.initStudentsPerformanceChart = initStudentsPerformanceChart;
window.loadAllStudentsData = loadAllStudentsData;
window.renderStudentsList = renderStudentsList;
window.filterStudentsList = filterStudentsList;
window.searchStudents = searchStudents;
window.viewStudentProfile = viewStudentProfile;
window.editStudent = editStudent;
window.contactStudent = contactStudent;
window.viewStudentLessons = viewStudentLessons;
window.openStudentModal = openStudentModal;
window.submitStudent = submitStudent;
window.viewAllStudents = viewAllStudents;
window.generateStudentsReport = generateStudentsReport;
window.exportStudentsChart = exportStudentsChart;
window.initStudentsSection = initStudentsSection;

// ============================================
// LISTENER PARA INICIALIZAÇÃO AUTOMÁTICA
// ============================================

// Escuta o evento de carregamento de seção
document.addEventListener('sectionLoaded', function(event) {
  if (event.detail.sectionId === 'students-section') {
    console.log("Students section loaded, initializing...");
    initStudentsSection();
  }
});

// Também inicializa se a seção já estiver carregada
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('students-content')) {
      initStudentsSection();
    }
  });
} else {
  if (document.getElementById('students-content')) {
    initStudentsSection();
  }
}

console.log("Students section JavaScript loaded successfully");