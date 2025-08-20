/**
 * Vehicles Section JavaScript
 * Contém todas as funções relacionadas à seção de veículos
 */

// Variável global para o gráfico de veículos
let vehiclesChart = null;

// ============================================
// INICIALIZAÇÃO DOS GRÁFICOS
// ============================================

/**
 * Inicializa o gráfico de estatísticas dos veículos
 */
function initVehiclesChart() {
    const ctx = document.getElementById("vehicles-chart");
    if (!ctx) return;

    // Clear any existing chart
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    const vehiclesData = {
        6: {
            labels: ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
            maintenance: [2, 1, 3, 2, 1, 2],
            usage: [85, 92, 78, 88, 95, 87],
            available: [10, 11, 9, 10, 11, 10],
            costs: [1200, 800, 1800, 1400, 600, 1100],
        },
        12: {
            labels: [
                "Set", "Out", "Nov", "Dez", "Jan", "Fev",
                "Mar", "Abr", "Mai", "Jun", "Jul", "Ago",
            ],
            maintenance: [3, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2],
            usage: [82, 88, 85, 90, 87, 92, 85, 92, 78, 88, 95, 87],
            available: [9, 10, 11, 10, 9, 11, 10, 11, 9, 10, 11, 10],
            costs: [1500, 1200, 900, 1300, 1600, 800, 1200, 800, 1800, 1400, 600, 1100],
        },
        24: {
            labels: [
                "Ago 2023", "Set", "Out", "Nov", "Dez", "Jan 2024",
                "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago 2024"
            ],
            maintenance: [4, 3, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2],
            usage: [75, 82, 88, 85, 90, 87, 92, 85, 92, 78, 88, 95, 87],
            available: [8, 9, 10, 11, 10, 9, 11, 10, 11, 9, 10, 11, 10],
            costs: [1800, 1500, 1200, 900, 1300, 1600, 800, 1200, 800, 1800, 1400, 600, 1100],
        },
    };

    const currentPeriod =
        document.getElementById("vehicles-period-filter")?.value || "6";
    const data = vehiclesData[currentPeriod];

    vehiclesChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: "Taxa de Uso (%)",
                    data: data.usage,
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
                    label: "Veículos Disponíveis",
                    data: data.available,
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
                    label: "Em Manutenção",
                    data: data.maintenance,
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

    window.vehiclesChart = vehiclesChart;
    console.log("Vehicles chart initialized successfully");
}

// ============================================
// GERENCIAMENTO DE DADOS DOS VEÍCULOS
// ============================================

/**
 * Carrega todos os dados dos veículos
 */
async function loadAllVehiclesData() {
    try {
        console.log("Loading all vehicles data...");

        // Simular carregamento de dados
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Atualizar gráficos se estiverem visíveis
        if (document.getElementById('vehicles-chart')) {
            initVehiclesChart();
        }

        // Renderizar lista de veículos
        renderVehiclesList();

    } catch (error) {
        console.error("Erro ao carregar dados dos veículos:", error);
        showNotification("Erro ao carregar dados dos veículos", "error");
    }
}

/**
 * Renderiza a lista de veículos
 */
function renderVehiclesList() {
    const container = document.getElementById('vehicles-list-container');
    if (!container) return;

    // Dados de exemplo
    const vehicles = [
        {
            id: 1,
            model: "Honda Civic",
            plate: "ABC-1234",
            category: "B",
            status: "Disponível",
            year: 2020,
            usage: 85
        },
        {
            id: 2,
            model: "Toyota Corolla",
            plate: "DEF-5678",
            category: "B",
            status: "Em Uso",
            year: 2021,
            usage: 92
        },
        {
            id: 3,
            model: "Yamaha Factor",
            plate: "GHI-9012",
            category: "A",
            status: "Disponível",
            year: 2019,
            usage: 78
        },
        {
            id: 4,
            model: "Volkswagen Gol",
            plate: "JKL-3456",
            category: "B",
            status: "Manutenção",
            year: 2018,
            usage: 0
        }
    ];

    const html = vehicles.map(vehicle => `
    <div class="vehicle-card" data-vehicle-id="${vehicle.id}">
      <div class="vehicle-info">
        <h4>${vehicle.model}</h4>
        <p class="plate">${vehicle.plate}</p>
        <div class="vehicle-details">
          <span class="category">Cat. ${vehicle.category}</span>
          <span class="year">${vehicle.year}</span>
          <span class="usage">Uso: ${vehicle.usage}%</span>
        </div>
      </div>
      <div class="vehicle-actions">
        <span class="status status-${vehicle.status.toLowerCase().replace(' ', '-')}">${vehicle.status}</span>
        <div class="action-buttons">
          <button onclick="viewVehicleDetails(${vehicle.id})" class="btn-icon" title="Ver Detalhes">
            <i class="fas fa-eye"></i>
          </button>
          <button onclick="editVehicle(${vehicle.id})" class="btn-icon" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="checkVehicleAvailability(${vehicle.id})" class="btn-icon" title="Verificar Disponibilidade">
            <i class="fas fa-calendar-check"></i>
          </button>
          <button onclick="scheduleVehicleMaintenance(${vehicle.id})" class="btn-icon" title="Agendar Manutenção">
            <i class="fas fa-wrench"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

    container.innerHTML = html;
}

/**
 * Filtra a lista de veículos
 */
function filterVehiclesList(filter) {
    const cards = document.querySelectorAll('.vehicle-card');

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
 * Pesquisa veículos
 */
function searchVehicles(query) {
    const cards = document.querySelectorAll('.vehicle-card');
    const searchTerm = query.toLowerCase();

    cards.forEach(card => {
        const model = card.querySelector('h4').textContent.toLowerCase();
        const plate = card.querySelector('.plate').textContent.toLowerCase();

        if (model.includes(searchTerm) || plate.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ============================================
// AÇÕES DOS VEÍCULOS
// ============================================

/**
 * Visualiza detalhes de um veículo
 */
function viewVehicleDetails(vehicleId) {
    console.log(`Viewing details for vehicle ID: ${vehicleId}`);
    showNotification(`Visualizando detalhes do veículo ${vehicleId}`, "info");
}

/**
 * Edita um veículo
 */
function editVehicle(vehicleId) {
    console.log(`Editing vehicle ID: ${vehicleId}`);
    showNotification(`Editando veículo ${vehicleId}`, "info");
}

/**
 * Verifica disponibilidade de um veículo
 */
function checkVehicleAvailability(vehicleId) {
    console.log(`Checking availability for vehicle ID: ${vehicleId}`);
    showNotification(`Verificando disponibilidade do veículo ${vehicleId}`, "info");
}

/**
 * Agenda manutenção para um veículo
 */
function scheduleVehicleMaintenance(vehicleId) {
    console.log(`Scheduling maintenance for vehicle ID: ${vehicleId}`);
    showNotification(`Agendando manutenção para veículo ${vehicleId}`, "info");
}

/**
 * Visualiza histórico de um veículo
 */
function viewVehicleHistory(vehicleId) {
    console.log(`Viewing history for vehicle ID: ${vehicleId}`);
    showNotification(`Visualizando histórico do veículo ${vehicleId}`, "info");
}

// ============================================
// MODAL DE ADICIONAR VEÍCULO
// ============================================

/**
 * Abre o modal de adicionar veículo
 */
function openVehicleModal() {
    const modal = document.getElementById("addVehicleModal");
    if (modal) {
        openModal("addVehicleModal");
    }
}

/**
 * Submete o formulário de novo veículo
 */
async function submitVehicle() {
    const form = document.getElementById("addVehicleForm");
    if (!form) return;

    try {
        const formData = new FormData(form);
        const vehicleData = {
            model: formData.get('model'),
            brand: formData.get('brand'),
            plate: formData.get('plate'),
            category: formData.get('category'),
            year: formData.get('year'),
            color: formData.get('color'),
            chassis: formData.get('chassis'),
            renavam: formData.get('renavam'),
            observations: formData.get('observations')
        };

        console.log("Submitting vehicle data:", vehicleData);

        // Validação básica
        if (!vehicleData.model || !vehicleData.brand || !vehicleData.plate) {
            throw new Error("Modelo, marca e placa são obrigatórios");
        }

        // Aqui você integraria com o Firestore
        const result = await window.FirestoreManager.addVehicle(vehicleData);

        showNotification("Veículo adicionado com sucesso!", "success");
        closeModal("addVehicleModal");
        form.reset();

        // Recarregar dados se estiver na seção de veículos
        if (document.querySelector('.menu-item[data-section="vehicles"]').classList.contains('active')) {
            loadAllVehiclesData();
        }

    } catch (error) {
        console.error("Erro ao adicionar veículo:", error);
        showNotification("Erro ao adicionar veículo: " + error.message, "error");
    }
}

// ============================================
// RELATÓRIOS E EXPORTAÇÃO
// ============================================

/**
 * Gera relatório de veículos
 */
function generateVehiclesReport() {
    console.log("Generating vehicles report...");
    showNotification("Relatório de veículos gerado com sucesso!", "success");
}

/**
 * Exporta gráfico de veículos
 */
function exportVehiclesChart() {
    if (vehiclesChart) {
        const url = vehiclesChart.toBase64Image();
        const link = document.createElement('a');
        link.download = 'grafico-veiculos.png';
        link.href = url;
        link.click();
        showNotification("Gráfico exportado com sucesso!", "success");
    }
}

// ============================================
// INICIALIZAÇÃO E EVENTOS
// ============================================

/**
 * Inicializa a seção de veículos
 */
function initVehiclesSection() {
    console.log("Initializing vehicles section...");

    // Inicializar gráficos se os elementos existirem
    setTimeout(() => {
        if (document.getElementById('vehicles-chart')) {
            initVehiclesChart();
        }

        // Carregar dados
        loadAllVehiclesData();

        // Configurar filtros de período
        const periodFilter = document.getElementById('vehicles-period-filter');
        if (periodFilter) {
            periodFilter.addEventListener('change', function () {
                initVehiclesChart();
            });
        }

        // Configurar busca
        const searchInput = document.querySelector('#vehicles-content .search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', function (e) {
                searchVehicles(e.target.value);
            });
        }

    }, 100);
}

// ============================================
// LISTENER PARA INICIALIZAÇÃO AUTOMÁTICA
// ============================================

// Escuta o evento de carregamento de seção
document.addEventListener('sectionLoaded', function (event) {
    if (event.detail.sectionId === 'vehicles-section') {
        console.log("Vehicles section loaded, initializing...");
        initVehiclesSection();
    }
});

// Também inicializa se a seção já estiver carregada
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        if (document.getElementById('vehicles-content')) {
            initVehiclesSection();
        }
    });
} else {
    if (document.getElementById('vehicles-content')) {
        initVehiclesSection();
    }
}

// ============================================
// EXPOSIÇÃO GLOBAL DAS FUNÇÕES
// ============================================

// Expor funções principais globalmente
window.initVehiclesChart = initVehiclesChart;
window.loadAllVehiclesData = loadAllVehiclesData;
window.renderVehiclesList = renderVehiclesList;
window.filterVehiclesList = filterVehiclesList;
window.searchVehicles = searchVehicles;
window.viewVehicleDetails = viewVehicleDetails;
window.editVehicle = editVehicle;
window.checkVehicleAvailability = checkVehicleAvailability;
window.scheduleVehicleMaintenance = scheduleVehicleMaintenance;
window.viewVehicleHistory = viewVehicleHistory;
window.openVehicleModal = openVehicleModal;
window.submitVehicle = submitVehicle;
window.generateVehiclesReport = generateVehiclesReport;
window.exportVehiclesChart = exportVehiclesChart;
window.initVehiclesSection = initVehiclesSection;

console.log("Vehicles section JavaScript loaded successfully");
