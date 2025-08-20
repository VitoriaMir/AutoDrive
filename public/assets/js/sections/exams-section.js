/**
 * Exams Section JavaScript
 * Contém todas as funções relacionadas à seção de exames
 */

// Variáveis globais para gráficos
let examsChart = null;

// ============================================
// INICIALIZAÇÃO DOS GRÁFICOS
// ============================================

/**
 * Inicializa o gráfico de exames
 */
function initExamsChart() {
    const ctx = document.getElementById("exams-chart");
    if (!ctx) return;

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    const examsData = {
        labels: ["Aprovados", "Reprovados", "Reagendados"],
        datasets: [{
            data: [75, 15, 10],
            backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
            borderWidth: 0
        }]
    };

    examsChart = new Chart(ctx, {
        type: "doughnut",
        data: examsData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "rgba(255, 255, 255, 0.8)"
                    }
                }
            }
        }
    });

    window.examsChart = examsChart;
}

// ============================================
// GERENCIAMENTO DE EXAMES
// ============================================

/**
 * Carrega dados de exames
 */
async function loadExamsData() {
    try {
        console.log("Loading exams data...");

        if (document.getElementById('exams-chart')) {
            initExamsChart();
        }

        renderExamsList();

    } catch (error) {
        console.error("Erro ao carregar dados de exames:", error);
        showNotification("Erro ao carregar exames", "error");
    }
}

/**
 * Renderiza lista de exames
 */
function renderExamsList() {
    const container = document.getElementById('exams-list-container');
    if (!container) return;

    const exams = [
        {
            id: 1,
            student: "Ana Silva",
            type: "Teórico",
            date: "2025-08-22",
            time: "09:00",
            status: "Agendado",
            instructor: "Carlos Santos"
        },
        {
            id: 2,
            student: "João Santos",
            type: "Prático",
            date: "2025-08-23",
            time: "14:00",
            status: "Aprovado",
            instructor: "Maria Oliveira"
        },
        {
            id: 3,
            student: "Pedro Costa",
            type: "Teórico",
            date: "2025-08-21",
            time: "10:30",
            status: "Reprovado",
            instructor: "João Pereira"
        }
    ];

    const html = exams.map(exam => `
    <div class="exam-card">
      <div class="exam-info">
        <h4>${exam.student}</h4>
        <p><strong>${exam.type}</strong> - ${exam.date} às ${exam.time}</p>
        <p>Instrutor: ${exam.instructor}</p>
      </div>
      <div class="exam-actions">
        <span class="status status-${exam.status.toLowerCase()}">${exam.status}</span>
        <div class="action-buttons">
          <button onclick="viewExamDetails(${exam.id})" class="btn-icon" title="Ver Detalhes">
            <i class="fas fa-eye"></i>
          </button>
          <button onclick="editExam(${exam.id})" class="btn-icon" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

    container.innerHTML = html;
}

/**
 * Filtra exames por status
 */
function filterExams(status) {
    const cards = document.querySelectorAll('.exam-card');

    cards.forEach(card => {
        const examStatus = card.querySelector('.status').textContent.toLowerCase();

        if (status === 'all' || examStatus === status.toLowerCase()) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Pesquisa exames
 */
function searchExams(query) {
    const cards = document.querySelectorAll('.exam-card');
    const searchTerm = query.toLowerCase();

    cards.forEach(card => {
        const student = card.querySelector('h4').textContent.toLowerCase();
        const type = card.querySelector('p').textContent.toLowerCase();

        if (student.includes(searchTerm) || type.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ============================================
// AÇÕES DE EXAMES
// ============================================

function scheduleExam() {
    showNotification("Agendando novo exame...", "info");
}

function viewExamDetails(examId) {
    showNotification(`Visualizando detalhes do exame ${examId}`, "info");
}

function editExam(examId) {
    showNotification(`Editando exame ${examId}`, "info");
}

function cancelExam(examId) {
    showNotification(`Cancelando exame ${examId}`, "info");
}

function generateExamReport() {
    showNotification("Gerando relatório de exames...", "info");
}

// ============================================
// INICIALIZAÇÃO
// ============================================

function initExamsSection() {
    console.log("Initializing exams section...");
    setTimeout(() => {
        loadExamsData();

        // Configurar busca
        const searchInput = document.querySelector('#exams-content .search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', function (e) {
                searchExams(e.target.value);
            });
        }
    }, 100);
}

// Event listeners
document.addEventListener('sectionLoaded', function (event) {
    if (event.detail.sectionId === 'exams-section') {
        console.log("Exams section loaded, initializing...");
        initExamsSection();
    }
});

// Exposição global
window.initExamsChart = initExamsChart;
window.loadExamsData = loadExamsData;
window.filterExams = filterExams;
window.searchExams = searchExams;
window.scheduleExam = scheduleExam;
window.viewExamDetails = viewExamDetails;
window.editExam = editExam;
window.cancelExam = cancelExam;
window.generateExamReport = generateExamReport;
window.initExamsSection = initExamsSection;

console.log("Exams section JavaScript loaded successfully");
