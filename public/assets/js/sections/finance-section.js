/**
 * Finance Section JavaScript
 * Contém todas as funções relacionadas à seção financeira
 */

// Variáveis globais para gráficos
let financeChart = null;
let paymentMethodsChart = null;

// ============================================
// INICIALIZAÇÃO DOS GRÁFICOS
// ============================================

/**
 * Inicializa o gráfico financeiro principal
 */
function initFinanceChart() {
    const ctx = document.getElementById("finance-chart");
    if (!ctx) return;

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    const financeData = {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
        datasets: [
            {
                label: "Receitas",
                data: [12000, 15000, 13500, 18000, 16500, 20000],
                borderColor: "#22c55e",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                fill: true,
                tension: 0.4
            },
            {
                label: "Despesas",
                data: [8000, 9500, 8800, 11000, 10200, 12500],
                borderColor: "#ef4444",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                fill: true,
                tension: 0.4
            }
        ]
    };

    financeChart = new Chart(ctx, {
        type: "line",
        data: financeData,
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

    window.financeChart = financeChart;
}

/**
 * Inicializa gráfico de métodos de pagamento
 */
function initPaymentMethodsChart() {
    const ctx = document.getElementById("payment-methods-chart");
    if (!ctx) return;

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    const paymentData = {
        labels: ["Dinheiro", "Cartão", "PIX", "Transferência"],
        datasets: [{
            data: [25, 35, 30, 10],
            backgroundColor: ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"],
            borderWidth: 0
        }]
    };

    paymentMethodsChart = new Chart(ctx, {
        type: "doughnut",
        data: paymentData,
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

    window.paymentMethodsChart = paymentMethodsChart;
}

// ============================================
// GERENCIAMENTO FINANCEIRO
// ============================================

/**
 * Carrega dados financeiros
 */
async function loadFinanceData() {
    try {
        console.log("Loading finance data...");

        if (document.getElementById('finance-chart')) {
            initFinanceChart();
        }

        if (document.getElementById('payment-methods-chart')) {
            initPaymentMethodsChart();
        }

        renderTransactionsList();
        updateFinancialSummary();

    } catch (error) {
        console.error("Erro ao carregar dados financeiros:", error);
        showNotification("Erro ao carregar dados financeiros", "error");
    }
}

/**
 * Renderiza lista de transações
 */
function renderTransactionsList() {
    const container = document.getElementById('transactions-list-container');
    if (!container) return;

    const transactions = [
        {
            id: 1,
            description: "Mensalidade - Ana Silva",
            amount: 450.00,
            type: "entrada",
            date: "2025-08-20",
            method: "PIX"
        },
        {
            id: 2,
            description: "Combustível - Veículos",
            amount: -120.00,
            type: "saida",
            date: "2025-08-19",
            method: "Cartão"
        },
        {
            id: 3,
            description: "Aula Particular - João Santos",
            amount: 80.00,
            type: "entrada",
            date: "2025-08-18",
            method: "Dinheiro"
        }
    ];

    const html = transactions.map(transaction => `
    <div class="transaction-card">
      <div class="transaction-info">
        <h4>${transaction.description}</h4>
        <p>${transaction.date} - ${transaction.method}</p>
      </div>
      <div class="transaction-amount ${transaction.type}">
        ${transaction.amount > 0 ? '+' : ''}R$ ${Math.abs(transaction.amount).toFixed(2)}
      </div>
    </div>
  `).join('');

    container.innerHTML = html;
}

/**
 * Atualiza resumo financeiro
 */
function updateFinancialSummary() {
    // Atualizar cards de resumo
    const revenueEl = document.getElementById('total-revenue');
    const expensesEl = document.getElementById('total-expenses');
    const profitEl = document.getElementById('net-profit');

    if (revenueEl) revenueEl.textContent = 'R$ 32.450,00';
    if (expensesEl) expensesEl.textContent = 'R$ 18.200,00';
    if (profitEl) profitEl.textContent = 'R$ 14.250,00';
}

/**
 * Filtra transações por tipo
 */
function filterTransactions(type) {
    const cards = document.querySelectorAll('.transaction-card');

    cards.forEach(card => {
        const amount = card.querySelector('.transaction-amount');
        const isIncome = amount.classList.contains('entrada');

        if (type === 'all') {
            card.style.display = 'block';
        } else if (type === 'entrada' && isIncome) {
            card.style.display = 'block';
        } else if (type === 'saida' && !isIncome) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Pesquisa transações
 */
function searchTransactions(query) {
    const cards = document.querySelectorAll('.transaction-card');
    const searchTerm = query.toLowerCase();

    cards.forEach(card => {
        const description = card.querySelector('h4').textContent.toLowerCase();

        if (description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ============================================
// AÇÕES FINANCEIRAS
// ============================================

function addTransaction() {
    showNotification("Adicionando nova transação...", "info");
}

function editTransaction(transactionId) {
    showNotification(`Editando transação ${transactionId}`, "info");
}

function deleteTransaction(transactionId) {
    showNotification(`Excluindo transação ${transactionId}`, "info");
}

function generateFinanceReport() {
    showNotification("Gerando relatório financeiro...", "info");
}

function exportFinanceData() {
    showNotification("Exportando dados financeiros...", "info");
}

// ============================================
// INICIALIZAÇÃO
// ============================================

function initFinanceSection() {
    console.log("Initializing finance section...");
    setTimeout(() => {
        loadFinanceData();

        // Configurar filtros
        const periodFilter = document.getElementById('finance-period-filter');
        if (periodFilter) {
            periodFilter.addEventListener('change', function () {
                initFinanceChart();
            });
        }

        // Configurar busca
        const searchInput = document.querySelector('#finance-content .search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', function (e) {
                searchTransactions(e.target.value);
            });
        }
    }, 100);
}

// Event listeners
document.addEventListener('sectionLoaded', function (event) {
    if (event.detail.sectionId === 'finance-section') {
        console.log("Finance section loaded, initializing...");
        initFinanceSection();
    }
});

// Exposição global
window.initFinanceChart = initFinanceChart;
window.initPaymentMethodsChart = initPaymentMethodsChart;
window.loadFinanceData = loadFinanceData;
window.filterTransactions = filterTransactions;
window.searchTransactions = searchTransactions;
window.addTransaction = addTransaction;
window.editTransaction = editTransaction;
window.deleteTransaction = deleteTransaction;
window.generateFinanceReport = generateFinanceReport;
window.exportFinanceData = exportFinanceData;
window.initFinanceSection = initFinanceSection;

console.log("Finance section JavaScript loaded successfully");
