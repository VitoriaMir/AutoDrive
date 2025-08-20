/**
 * Schedule Section JavaScript
 * Contém todas as funções relacionadas à seção de agendamentos
 */

// Variáveis globais para gráficos
let scheduleChart = null;

// ============================================
// INICIALIZAÇÃO DOS GRÁFICOS
// ============================================

/**
 * Inicializa o gráfico de agendamentos
 */
function initScheduleChart() {
    const ctx = document.getElementById("schedule-chart");
    if (!ctx) return;

    // Clear any existing chart
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    const scheduleData = {
        labels: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
        datasets: [{
            label: "Aulas Agendadas",
            data: [12, 19, 15, 22, 18, 8],
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderColor: "#3b82f6",
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    };

    scheduleChart = new Chart(ctx, {
        type: "line",
        data: scheduleData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "rgba(255, 255, 255, 0.8)"
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: "rgba(255, 255, 255, 0.7)" },
                    grid: { color: "rgba(255, 255, 255, 0.1)" }
                },
                y: {
                    ticks: { color: "rgba(255, 255, 255, 0.7)" },
                    grid: { color: "rgba(255, 255, 255, 0.1)" }
                }
            }
        }
    });

    window.scheduleChart = scheduleChart;
}

// ============================================
// GERENCIAMENTO DE AGENDAMENTOS
// ============================================

/**
 * Carrega dados de agendamentos
 */
async function loadScheduleData() {
    try {
        console.log("Loading schedule data...");

        if (document.getElementById('schedule-chart')) {
            initScheduleChart();
        }

        renderScheduleList();

    } catch (error) {
        console.error("Erro ao carregar dados de agendamento:", error);
        showNotification("Erro ao carregar agendamentos", "error");
    }
}

/**
 * Renderiza lista de agendamentos
 */
function renderScheduleList() {
    const container = document.getElementById('schedule-list-container');
    if (!container) return;

    const schedules = [
        { id: 1, student: "Ana Silva", instructor: "Carlos Santos", date: "2025-08-20", time: "09:00", status: "Confirmado" },
        { id: 2, student: "João Santos", instructor: "Maria Oliveira", date: "2025-08-20", time: "10:00", status: "Pendente" },
        { id: 3, student: "Pedro Costa", instructor: "João Pereira", date: "2025-08-20", time: "14:00", status: "Confirmado" }
    ];

    const html = schedules.map(schedule => `
    <div class="schedule-card">
      <div class="schedule-info">
        <h4>${schedule.student}</h4>
        <p>Instrutor: ${schedule.instructor}</p>
        <p>${schedule.date} às ${schedule.time}</p>
      </div>
      <div class="schedule-actions">
        <span class="status status-${schedule.status.toLowerCase()}">${schedule.status}</span>
        <button onclick="editSchedule(${schedule.id})" class="btn-icon">
          <i class="fas fa-edit"></i>
        </button>
      </div>
    </div>
  `).join('');

    container.innerHTML = html;
}

// ============================================
// AÇÕES DE AGENDAMENTO
// ============================================

function createSchedule() {
    showNotification("Criando novo agendamento...", "info");
}

function editSchedule(scheduleId) {
    showNotification(`Editando agendamento ${scheduleId}`, "info");
}

function cancelSchedule(scheduleId) {
    showNotification(`Cancelando agendamento ${scheduleId}`, "info");
}

// ============================================
// INICIALIZAÇÃO
// ============================================

function initScheduleSection() {
    console.log("Initializing schedule section...");
    setTimeout(() => {
        loadScheduleData();
    }, 100);
}

// Event listeners
document.addEventListener('sectionLoaded', function (event) {
    if (event.detail.sectionId === 'schedule-section') {
        console.log("Schedule section loaded, initializing...");
        initScheduleSection();
    }
});

// Exposição global
window.initScheduleChart = initScheduleChart;
window.loadScheduleData = loadScheduleData;
window.createSchedule = createSchedule;
window.editSchedule = editSchedule;
window.cancelSchedule = cancelSchedule;
window.initScheduleSection = initScheduleSection;

console.log("Schedule section JavaScript loaded successfully");
