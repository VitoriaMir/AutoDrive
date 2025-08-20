/**
 * Reports Section JavaScript
 * Contém todas as funções relacionadas à seção de relatórios
 */

// ============================================
// GERENCIAMENTO DE RELATÓRIOS
// ============================================

/**
 * Carrega dados de relatórios
 */
async function loadReportsData() {
    try {
        console.log("Loading reports data...");
        renderReportsList();
    } catch (error) {
        console.error("Erro ao carregar relatórios:", error);
        showNotification("Erro ao carregar relatórios", "error");
    }
}

/**
 * Renderiza lista de relatórios
 */
function renderReportsList() {
    const container = document.getElementById('reports-list-container');
    if (!container) return;

    const reports = [
        { id: 1, name: "Relatório de Alunos", type: "students", lastGenerated: "2025-08-19" },
        { id: 2, name: "Relatório Financeiro", type: "financial", lastGenerated: "2025-08-18" },
        { id: 3, name: "Relatório de Instrutores", type: "instructors", lastGenerated: "2025-08-17" },
        { id: 4, name: "Relatório de Veículos", type: "vehicles", lastGenerated: "2025-08-16" }
    ];

    const html = reports.map(report => `
    <div class="report-card">
      <div class="report-info">
        <h4>${report.name}</h4>
        <p>Último gerado: ${report.lastGenerated}</p>
      </div>
      <div class="report-actions">
        <button onclick="generateReport('${report.type}')" class="btn btn-primary">
          <i class="fas fa-file-alt"></i> Gerar
        </button>
        <button onclick="downloadReport('${report.type}')" class="btn btn-secondary">
          <i class="fas fa-download"></i> Download
        </button>
      </div>
    </div>
  `).join('');

    container.innerHTML = html;
}

// ============================================
// AÇÕES DE RELATÓRIOS
// ============================================

function generateReport(type) {
    showNotification(`Gerando relatório de ${type}...`, "info");
}

function downloadReport(type) {
    showNotification(`Baixando relatório de ${type}...`, "info");
}

function scheduleReport(type) {
    showNotification(`Agendando relatório de ${type}...`, "info");
}

// ============================================
// INICIALIZAÇÃO
// ============================================

function initReportsSection() {
    console.log("Initializing reports section...");
    setTimeout(() => {
        loadReportsData();
    }, 100);
}

// Event listeners
document.addEventListener('sectionLoaded', function (event) {
    if (event.detail.sectionId === 'reports-section') {
        console.log("Reports section loaded, initializing...");
        initReportsSection();
    }
});

// Exposição global
window.loadReportsData = loadReportsData;
window.generateReport = generateReport;
window.downloadReport = downloadReport;
window.scheduleReport = scheduleReport;
window.initReportsSection = initReportsSection;

console.log("Reports section JavaScript loaded successfully");
