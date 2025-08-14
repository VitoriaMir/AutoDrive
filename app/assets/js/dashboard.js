// === FULLSCREEN CHARTS ===
function fullscreenChart(button) {
  // Encontra o card mais próximo
  const card = button.closest(".chart-card");
  if (!card) return;
  // Entra em fullscreen
  if (card.requestFullscreen) {
    card.requestFullscreen();
  } else if (card.webkitRequestFullscreen) {
    card.webkitRequestFullscreen();
  } else if (card.msRequestFullscreen) {
    card.msRequestFullscreen();
  }
}

function exitFullscreenChart() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else if (document.webkitFullscreenElement) {
    document.webkitExitFullscreen();
  } else if (document.msFullscreenElement) {
    document.msExitFullscreen();
  }
}

// Alternar visibilidade dos botões ao entrar/sair do fullscreen
document.addEventListener("fullscreenchange", () => {
  document.querySelectorAll(".chart-card").forEach((card) => {
    const expandBtn = card.querySelector(".fa-expand")?.closest("button");
    const compressBtn = card.querySelector(".fa-compress")?.closest("button");
    if (document.fullscreenElement === card) {
      if (expandBtn) expandBtn.style.display = "none";
      if (compressBtn) compressBtn.style.display = "";
    } else {
      if (expandBtn) expandBtn.style.display = "";
      if (compressBtn) compressBtn.style.display = "none";
    }
  });
});

// Inicializar listeners dos botões de fullscreen
function setupFullscreenButtons() {
  document.querySelectorAll(".chart-card").forEach((card) => {
    const expandBtn = card.querySelector(".fa-expand")?.closest("button");
    const compressBtn = card.querySelector(".fa-compress")?.closest("button");
    if (expandBtn) {
      expandBtn.onclick = function () {
        fullscreenChart(this);
      };
    }
    if (compressBtn) {
      compressBtn.onclick = function () {
        exitFullscreenChart();
      };
      compressBtn.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupFullscreenButtons();
  // Ativa exportação para todos os botões fa-download dentro de chart-card
  document.querySelectorAll(".chart-card").forEach((card) => {
    const exportBtn = card.querySelector(".fa-download")?.closest("button");
    if (exportBtn) {
      exportBtn.onclick = function () {
        // Procura o canvas do gráfico dentro do card
        const canvas = card.querySelector("canvas");
        if (canvas && window.Chart) {
          // Procura o objeto Chart associado
          let chartInstance = null;
          // Tenta encontrar o chart pelo id do canvas
          if (canvas.id && window[canvas.id.replace("-chart", "Chart")]) {
            chartInstance = window[canvas.id.replace("-chart", "Chart")];
          }
          // Fallback: tenta Chart.getChart(canvas)
          if (!chartInstance && window.Chart.getChart) {
            chartInstance = window.Chart.getChart(canvas);
          }
          if (chartInstance && chartInstance.toBase64Image) {
            const url = chartInstance.toBase64Image();
            const link = document.createElement("a");
            link.download = (canvas.id || "grafico") + ".png";
            link.href = url;
            link.click();
            showNotification("Gráfico exportado com sucesso!", "success");
          } else {
            showNotification(
              "Não foi possível exportar este gráfico.",
              "error"
            );
          }
        } else {
          showNotification("Nenhum gráfico encontrado para exportar.", "error");
        }
      };
    }
  });
});

// Variables
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-sidebar");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const contextMenuBtn = document.getElementById("context-menu-btn");
const contextMenu = document.getElementById("context-menu");
const notificationsBtn = document.getElementById("notifications-btn");
const notificationsPanel = document.getElementById("notifications-panel");

// Função para mostrar notificações
function showNotification(message, type = "info", duration = 3000) {
  // Criar elemento de notificação
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas ${
                  type === "success"
                    ? "fa-check-circle"
                    : type === "error"
                    ? "fa-exclamation-circle"
                    : type === "warning"
                    ? "fa-exclamation-triangle"
                    : "fa-info-circle"
                }"></i>
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close" onclick="closeNotification(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

  // Adicionar estilos se não existirem
  if (!document.querySelector("#notification-styles")) {
    const styles = document.createElement("style");
    styles.id = "notification-styles";
    styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                min-width: 300px;
                max-width: 500px;
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                transform: translateX(100%);
                transition: all 0.3s ease;
                margin-bottom: 10px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.success {
                border-left: 4px solid var(--success);
            }
            
            .notification.error {
                border-left: 4px solid var(--danger);
            }
            
            .notification.warning {
                border-left: 4px solid var(--warning);
            }
            
            .notification.info {
                border-left: 4px solid var(--info);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                padding: 16px;
                gap: 12px;
            }
            
            .notification-icon {
                color: var(--primary);
                font-size: 1.2rem;
            }
            
            .notification.success .notification-icon {
                color: var(--success);
            }
            
            .notification.error .notification-icon {
                color: var(--danger);
            }
            
            .notification.warning .notification-icon {
                color: var(--warning);
            }
            
            .notification-message {
                flex: 1;
                color: var(--text-primary);
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            
            .notification-close:hover {
                background: var(--glass);
                color: var(--text-primary);
            }
        `;
    document.head.appendChild(styles);
  }

  // Adicionar ao DOM
  document.body.appendChild(notification);

  // Animar entrada
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Auto remover
  setTimeout(() => {
    closeNotification(notification.querySelector(".notification-close"));
  }, duration);
}

function closeNotification(button) {
  const notification = button.closest(".notification");
  notification.classList.remove("show");
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

// Menu Navigation
const menuItems = document.querySelectorAll(".menu-item");
const contentSections = document.querySelectorAll(".content-section");
const dashboardTitle = document.querySelector(".dashboard-title");

// Section titles mapping
const sectionTitles = {
  dashboard: { title: "Dashboard", icon: "fas fa-tachometer-alt" },
  students: { title: "Gestão de Alunos", icon: "fas fa-users" },
  instructors: {
    title: "Gestão de Instrutores",
    icon: "fas fa-chalkboard-teacher",
  },
  vehicles: { title: "Gestão de Veículos", icon: "fas fa-car-alt" },
  schedule: { title: "Agenda de Aulas", icon: "fas fa-calendar-alt" },
  exams: { title: "Exames", icon: "fas fa-file-alt" },
  finance: { title: "Financeiro", icon: "fas fa-chart-line" },
  reports: { title: "Relatórios", icon: "fas fa-file-pdf" },
  settings: { title: "Configurações", icon: "fas fa-cog" },
};

// Charts
let lessonsChart = null;
let studentsChart = null;
let financeChart = null;
let studentsPerformanceChart = null;
let instructorsChart = null;
let vehiclesChart = null;
let scheduleChart = null;
let examsChart = null;

// Function to safely destroy a chart
function destroyChart(chart) {
  if (chart && typeof chart.destroy === "function") {
    chart.destroy();
  }
  return null;
}

// Function to show a specific section
function showSection(sectionId) {
  // Hide all sections
  contentSections.forEach((section) => {
    section.classList.remove("active");
  });

  // Show the selected section
  const section = document.getElementById(`${sectionId}-content`);
  if (section) {
    section.classList.add("active");
  }

  // Update active menu item
  menuItems.forEach((item) => {
    item.classList.remove("active");
    if (item.dataset.section === sectionId) {
      item.classList.add("active");
    }
  });

  // Update dashboard title
  if (sectionTitles[sectionId] && dashboardTitle) {
    const sectionInfo = sectionTitles[sectionId];
    dashboardTitle.innerHTML = `
          <i class="${sectionInfo.icon}"></i>
          ${sectionInfo.title}
        `;
  }

  // Initialize section-specific charts
  setTimeout(() => {
    if (sectionId === "dashboard") {
      // Initialize dashboard charts if not already initialized
      if (!lessonsChart) initLessonsChart();
      if (!studentsChart) initStudentsChart();
    } else if (sectionId === "students") {
      if (!studentsPerformanceChart) initStudentsPerformanceChart();
    } else if (sectionId === "instructors") {
      if (!instructorsChart) initInstructorsChart();
    } else if (sectionId === "vehicles") {
      if (!vehiclesChart) initVehiclesChart();
    } else if (sectionId === "schedule") {
      if (!scheduleChart) initScheduleChart();
    } else if (sectionId === "exams") {
      if (!examsChart) initExamsChart();
    } else if (sectionId === "finance") {
      if (!financeChart) initFinanceChart();
    }
  }, 100);
}

// Set up menu item click handlers
menuItems.forEach((item) => {
  if (item.id !== "logout-btn") {
    item.addEventListener("click", () => {
      const sectionId = item.dataset.section;
      if (sectionId) {
        showSection(sectionId);

        // Close mobile menu if open
        if (isMobile()) {
          sidebar.classList.remove("mobile-open");
          sidebarOverlay.classList.remove("show");
        }
      }
    });
  }
});

// Check if mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Toggle sidebar on desktop
toggleBtn.addEventListener("click", () => {
  if (!isMobile()) {
    sidebar.classList.toggle("collapsed");
    const icon = toggleBtn.querySelector("i");
    icon.classList.toggle("fa-chevron-left");
    icon.classList.toggle("fa-chevron-right");
  }
});

// Mobile menu toggle
mobileMenuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  sidebar.classList.toggle("mobile-open");
  sidebarOverlay.classList.toggle("show");
});

// Close mobile menu when clicking overlay
sidebarOverlay.addEventListener("click", () => {
  sidebar.classList.remove("mobile-open");
  sidebarOverlay.classList.remove("show");
});

// Context menu
contextMenuBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  // Toggle context menu visibility
  const isOpen = contextMenu.classList.contains("show");

  if (isOpen) {
    closeContextMenu();
  } else {
    openContextMenu();
  }
});

// Close context menu when clicking outside
document.addEventListener("click", (e) => {
  if (!contextMenu.contains(e.target) && e.target !== contextMenuBtn) {
    closeContextMenu();
  }
});

// Function to close context menu
function closeContextMenu() {
  contextMenu.classList.remove("show");
  contextMenuBtn.classList.remove("active");
}

// Function to open context menu
function openContextMenu() {
  // Close other panels
  notificationsPanel.classList.remove("show");
  notificationsBtn.classList.remove("active");

  // Open context menu
  contextMenu.classList.add("show");
  contextMenuBtn.classList.add("active");
}

// Notifications panel
notificationsBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  // Close context menu if open
  closeContextMenu();

  // Toggle panel visibility
  const isOpen = notificationsPanel.classList.contains("show");

  if (isOpen) {
    // Close panel
    notificationsPanel.classList.remove("show");
    notificationsBtn.classList.remove("active");
  } else {
    // Open panel
    const rect = notificationsBtn.getBoundingClientRect();
    notificationsPanel.style.top = `${rect.bottom + 10}px`;
    notificationsPanel.style.right = `${window.innerWidth - rect.right}px`;
    notificationsPanel.classList.add("show");
    notificationsBtn.classList.add("active");
  }
});

// Close notifications panel when clicking outside
document.addEventListener("click", (e) => {
  if (!notificationsPanel.contains(e.target) && e.target !== notificationsBtn) {
    notificationsPanel.classList.remove("show");
    notificationsBtn.classList.remove("active");
  }
});

// Modal functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "auto";
  }
}

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("modal") ||
    e.target.classList.contains("modal-overlay")
  ) {
    const modal = e.target.closest(".modal, .modal-overlay");
    if (modal) {
      modal.classList.remove("show");
      document.body.style.overflow = "auto";
      // Limpar formulário se existir
      const form = modal.querySelector("form");
      if (form) {
        form.reset();
      }
    }
  }
});

// Logout button
document.getElementById("logout-btn").addEventListener("click", () => {
  // Usar modal elegante em vez do confirm nativo
  if (typeof showLogoutModal === "function") {
    showLogoutModal();
  } else {
    // Fallback para confirm nativo se o modal não estiver disponível
    if (confirm("Tem certeza que deseja sair do sistema?")) {
      showNotification("Encerrando sessão...", "warning");
      setTimeout(() => {
        window.location.href = "/logout";
      }, 1500);
    }
  }
});

// Animated counters
function animateCounter(
  element,
  start,
  end,
  duration,
  prefix = "",
  suffix = ""
) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = prefix + value.toLocaleString() + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Initialize counters and charts after page loads
document.addEventListener("DOMContentLoaded", () => {
  // Initialize dashboard title with current active section
  const activeSection = document.querySelector(".content-section.active");
  if (activeSection) {
    const sectionId = activeSection.id.replace("-content", "");
    if (sectionTitles[sectionId] && dashboardTitle) {
      const sectionInfo = sectionTitles[sectionId];
      dashboardTitle.innerHTML = `
            <i class="${sectionInfo.icon}"></i>
            ${sectionInfo.title}
          `;
    }
  }

  setTimeout(() => {
    animateCounter(document.getElementById("students-count"), 0, 156, 1500);
    animateCounter(document.getElementById("lessons-count"), 0, 24, 1500);
    animateCounter(document.getElementById("vehicles-count"), 0, 12, 1500);
    animateCounter(
      document.getElementById("revenue-count"),
      0,
      6560,
      2000,
      "R$ "
    );
  }, 500);

  // Initialize charts
  initCharts();

  // Check initial notifications state
  checkEmptyNotifications();

  // Initialize theme toggle
  initThemeToggle();

  // === POPUP DE TIPO DE GRÁFICO (ALUNOS) ===
  const chartTypeBtn = document.getElementById("chart-type-btn");
  const chartTypePopup = document.getElementById("chart-type-popup");
  let popupOpen = false;

  if (chartTypeBtn && chartTypePopup) {
    chartTypeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      chartTypePopup.style.display = popupOpen ? "none" : "block";
      popupOpen = !popupOpen;
    });

    // Fecha popup ao clicar fora
    document.addEventListener("click", function (e) {
      if (
        popupOpen &&
        !chartTypePopup.contains(e.target) &&
        e.target !== chartTypeBtn
      ) {
        chartTypePopup.style.display = "none";
        popupOpen = false;
      }
    });

    // Troca o tipo do gráfico ao clicar em uma opção
    chartTypePopup
      .querySelectorAll(".chart-type-option")
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          const type = btn.getAttribute("data-type");
          if (window.studentsChart) {
            window.studentsChart.config.type = type;
            window.studentsChart.update();
          }
          chartTypePopup.style.display = "none";
          popupOpen = false;
          if (typeof showNotification === "function") {
            showNotification(
              `Tipo de gráfico alterado para: ${btn.textContent.trim()}`,
              "success"
            );
          }
        });
      });
  }
});

// Theme Toggle Functionality
function initThemeToggle() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const themeIcon = document.getElementById("theme-icon");
  const body = document.body;

  // Get saved theme from localStorage or default to dark
  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);

  // Theme toggle event listener
  themeToggleBtn.addEventListener("click", function () {
    const currentTheme = body.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  });

  function setTheme(theme) {
    if (theme === "light") {
      body.setAttribute("data-theme", "light");
      themeIcon.className = "fas fa-moon";
      themeToggleBtn.classList.remove("light-theme");
      themeToggleBtn.classList.add("dark-theme");
      themeToggleBtn.setAttribute("aria-label", "Alternar para tema escuro");
    } else {
      body.removeAttribute("data-theme");
      themeIcon.className = "fas fa-sun";
      themeToggleBtn.classList.remove("dark-theme");
      themeToggleBtn.classList.add("light-theme");
      themeToggleBtn.setAttribute("aria-label", "Alternar para tema claro");
    }
  }
}

// Initialize charts
function initCharts() {
  // Add a slight delay to ensure DOM is fully rendered
  setTimeout(() => {
    console.log("Initializing all charts...");
    initLessonsChart();
    initStudentsChart();
    initStudentsPerformanceChart();
    initInstructorsChart();
    initVehiclesChart();
    initScheduleChart();
    initExamsChart();
    initFinanceChart();
    console.log("All charts initialized successfully");
  }, 300);
}

// Initialize lessons chart
function initLessonsChart() {
  const lessonsCtx = document.getElementById("lessons-chart");
  if (!lessonsCtx) return;

  // Destroy existing chart
  lessonsChart = destroyChart(lessonsChart);

  lessonsChart = new Chart(lessonsCtx.getContext("2d"), {
    type: "bar",
    data: {
      labels: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      datasets: [
        {
          label: "Aulas Teóricas",
          data: [120, 150, 180, 140, 200, 230, 250, 220, 240, 260, 280, 300],
          backgroundColor: "rgba(67, 97, 238, 0.7)",
          borderColor: "rgba(67, 97, 238, 1)",
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: "Aulas Práticas",
          data: [80, 100, 120, 110, 150, 170, 200, 180, 190, 210, 230, 250],
          backgroundColor: "rgba(76, 201, 240, 0.7)",
          borderColor: "rgba(76, 201, 240, 1)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
            drawBorder: false,
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: {
              size: 12,
            },
          },
        },
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
            drawBorder: false,
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: {
              size: 12,
            },
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "rgba(255, 255, 255, 0.8)",
            usePointStyle: true,
            padding: 20,
            font: {
              size: 13,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(30, 30, 46, 0.95)",
          titleColor: "#fff",
          bodyColor: "#ddd",
          borderColor: "rgba(67, 97, 238, 0.5)",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
        },
      },
    },
  });
}

// Initialize students chart
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
            max: Math.max(...data.emProgresso) + 15,
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
              drawBorder: false,
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
              font: {
                size: 11,
              },
              callback: function (value) {
                return value + " alunos";
              },
            },
            title: {
              display: true,
              text: "Quantidade de Alunos",
              color: "#22c55e",
              font: {
                size: 12,
                weight: 600,
              },
            },
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "rgba(255, 255, 255, 0.9)",
              padding: 20,
              usePointStyle: true,
              font: {
                size: 13,
                weight: 500,
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(30, 30, 46, 0.95)",
            titleColor: "#fff",
            bodyColor: "#ddd",
            borderColor: "rgba(34, 197, 94, 0.5)",
            borderWidth: 1,
            cornerRadius: 12,
            displayColors: true,
            callbacks: {
              title: function (context) {
                return "Período: " + context[0].label;
              },
              label: function (context) {
                return (
                  context.dataset.label + ": " + context.parsed.y + " alunos"
                );
              },
              afterBody: function (context) {
                const index = context[0].dataIndex;
                return `Satisfação Média: ${data.satisfacao[index]}★`;
              },
            },
          },
        },
      },
    });
    // Garantir que o gráfico fique acessível globalmente
    window.studentsChart = studentsChart;

    console.log("Students progress chart initialized successfully");
  } else {
    console.error("Canvas element not found: students-chart");
  }
}

// Function to update students chart period
function updateStudentsChartPeriod() {
  initStudentsChart();
  initStudentsPerformanceChart();
}
// Initialize finance chart
function initFinanceChart() {
  const financeCtx = document.getElementById("finance-chart");
  if (!financeCtx) return;

  // Dados mais realistas com variações mensais
  const financeData = {
    6: {
      labels: ["Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
      receitas: [18200, 22400, 19800, 24600, 21200, 22840],
      despesas: [9400, 11200, 8900, 12100, 10400, 10860],
      lucro: [8800, 11200, 10900, 12500, 10800, 11980],
      detailsReceitas: {
        matriculas: [7200, 8800, 7100, 9200, 7800, 8400],
        aulasTradicoes: [6500, 7800, 6800, 8200, 7200, 7600],
        exames: [2800, 3200, 3100, 3800, 3400, 3600],
        renovacoes: [1700, 2600, 2800, 3400, 2800, 3240],
      },
      detailsDespesas: {
        combustivel: [2200, 2600, 2100, 2800, 2400, 2860],
        manutencao: [1800, 2200, 1600, 2400, 2000, 2500],
        salarios: [4200, 4800, 4200, 5200, 4800, 5500],
        outros: [1200, 1600, 1000, 1700, 1200, 1300],
      },
    },
    12: {
      labels: [
        "Ago/23",
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
      ],
      receitas: [
        16800, 19200, 21400, 18600, 15200, 17400, 18200, 22400, 19800, 24600,
        21200, 22840,
      ],
      despesas: [
        8600, 9800, 10200, 9400, 8200, 9000, 9400, 11200, 8900, 12100, 10400,
        10860,
      ],
      lucro: [
        8200, 9400, 11200, 9200, 7000, 8400, 8800, 11200, 10900, 12500, 10800,
        11980,
      ],
    },
    24: {
      labels: [
        "Jul/22",
        "Out/22",
        "Jan/23",
        "Abr/23",
        "Jul/23",
        "Out/23",
        "Jan/24",
        "Abr/24",
        "Jul/24",
      ],
      receitas: [14200, 16800, 18400, 19600, 17800, 21400, 17400, 19800, 22840],
      despesas: [7800, 8600, 9200, 9800, 8800, 10200, 9000, 8900, 10860],
      lucro: [6400, 8200, 9200, 9800, 9000, 11200, 8400, 10900, 11980],
    },
  };

  const currentPeriod = 6;
  const data = financeData[currentPeriod];

  financeChart = new Chart(financeCtx.getContext("2d"), {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Receita Bruta",
          data: data.receitas,
          backgroundColor: "rgba(34, 197, 94, 0.15)",
          borderColor: "rgba(34, 197, 94, 1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgba(34, 197, 94, 1)",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: "Despesas Operacionais",
          data: data.despesas,
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgba(239, 68, 68, 1)",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: "Lucro Líquido",
          data: data.lucro,
          backgroundColor: "rgba(59, 130, 246, 0.15)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: "rgba(59, 130, 246, 1)",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          borderDash: [5, 5],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      animation: {
        duration: 2000,
        easing: "easeOutQuart",
      },
      scales: {
        y: {
          beginAtZero: true,
          max: Math.max(...data.receitas) * 1.1,
          grid: {
            color: "rgba(255, 255, 255, 0.08)",
            drawBorder: false,
            lineWidth: 1,
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: {
              size: 12,
              family: "Inter, sans-serif",
            },
            callback: function (value) {
              if (value >= 1000) {
                return "R$ " + (value / 1000).toFixed(0) + "k";
              }
              return "R$ " + value.toLocaleString("pt-BR");
            },
          },
        },
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
            drawBorder: false,
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: {
              size: 12,
              family: "Inter, sans-serif",
            },
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            color: "rgba(255, 255, 255, 0.9)",
            usePointStyle: true,
            pointStyle: "circle",
            padding: 25,
            font: {
              size: 13,
              family: "Inter, sans-serif",
              weight: "500",
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(17, 24, 39, 0.95)",
          titleColor: "#ffffff",
          bodyColor: "#e5e7eb",
          borderColor: "rgba(59, 130, 246, 0.3)",
          borderWidth: 1,
          cornerRadius: 12,
          padding: 16,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          displayColors: true,
          callbacks: {
            title: function (context) {
              return "Período: " + context[0].label;
            },
            label: function (context) {
              const value = context.parsed.y;
              const percentage =
                context.datasetIndex === 2
                  ? ((value / data.receitas[context.dataIndex]) * 100).toFixed(
                      1
                    ) + "%"
                  : "";

              return (
                context.dataset.label +
                ": R$ " +
                value.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) +
                (percentage ? " (" + percentage + " de margem)" : "")
              );
            },
            afterBody: function (context) {
              if (context.length > 0) {
                const index = context[0].dataIndex;
                const receita = data.receitas[index];
                const despesa = data.despesas[index];
                const crescimento =
                  index > 0
                    ? (
                        ((receita - data.receitas[index - 1]) /
                          data.receitas[index - 1]) *
                        100
                      ).toFixed(1)
                    : 0;

                return [
                  "",
                  "Crescimento: " +
                    (crescimento >= 0 ? "+" : "") +
                    crescimento +
                    "%",
                  "Margem: " +
                    (((receita - despesa) / receita) * 100).toFixed(1) +
                    "%",
                ];
              }
            },
          },
        },
      },
    },
  });

  // Adicionar controles de período
  setupFinanceChartControls();
}

// Configurar controles do gráfico financeiro
function setupFinanceChartControls() {
  const chartFilter = document.querySelector(
    ".finance-flow-chart .chart-filter"
  );
  if (chartFilter) {
    chartFilter.addEventListener("change", function (e) {
      updateFinanceChartPeriod(parseInt(e.target.value));
    });
  }
}

// Atualizar período do gráfico financeiro
function updateFinanceChartPeriod(months) {
  if (!financeChart) return;

  const financeData = {
    6: {
      labels: ["Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
      receitas: [18200, 22400, 19800, 24600, 21200, 22840],
      despesas: [9400, 11200, 8900, 12100, 10400, 10860],
      lucro: [8800, 11200, 10900, 12500, 10800, 11980],
    },
    12: {
      labels: [
        "Ago/23",
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
      ],
      receitas: [
        16800, 19200, 21400, 18600, 15200, 17400, 18200, 22400, 19800, 24600,
        21200, 22840,
      ],
      despesas: [
        8600, 9800, 10200, 9400, 8200, 9000, 9400, 11200, 8900, 12100, 10400,
        10860,
      ],
      lucro: [
        8200, 9400, 11200, 9200, 7000, 8400, 8800, 11200, 10900, 12500, 10800,
        11980,
      ],
    },
    24: {
      labels: [
        "Jul/22",
        "Set/22",
        "Nov/22",
        "Jan/23",
        "Mar/23",
        "Mai/23",
        "Jul/23",
        "Set/23",
        "Nov/23",
        "Jan/24",
        "Mar/24",
        "Mai/24",
        "Jul/24",
      ],
      receitas: [
        14200, 15600, 16800, 18400, 19200, 19600, 17800, 19200, 21400, 17400,
        22400, 24600, 22840,
      ],
      despesas: [
        7800, 8200, 8600, 9200, 9600, 9800, 8800, 9800, 10200, 9000, 11200,
        12100, 10860,
      ],
      lucro: [
        6400, 7400, 8200, 9200, 9600, 9800, 9000, 9400, 11200, 8400, 11200,
        12500, 11980,
      ],
    },
  };

  const data = financeData[months];

  // Atualizar dados do gráfico
  financeChart.data.labels = data.labels;
  financeChart.data.datasets[0].data = data.receitas;
  financeChart.data.datasets[1].data = data.despesas;
  financeChart.data.datasets[2].data = data.lucro;

  // Ajustar escala Y
  financeChart.options.scales.y.max = Math.max(...data.receitas) * 1.1;

  // Atualizar com animação
  financeChart.update("active");

  // Mostrar notificação
  const periodos = { 6: "6 meses", 12: "1 ano", 24: "2 anos" };
  showNotification(`Gráfico atualizado para ${periodos[months]}`, "success");
}

// ===== FINANCE FUNCTIONS =====

// Generate finance report
function generateFinanceReport() {
  showNotification("Gerando relatório financeiro...", "info");
  setTimeout(() => {
    showNotification("Relatório financeiro gerado com sucesso!", "success");
  }, 2000);
}

// Export finance chart
function exportFinanceChart() {
  if (financeChart) {
    const url = financeChart.toBase64Image();
    const link = document.createElement("a");
    link.download = "fluxo-caixa.png";
    link.href = url;
    link.click();
    showNotification("Gráfico exportado com sucesso!", "success");
  }
}

// Generate payment report
function generatePaymentReport() {
  showNotification("Gerando relatório de métodos de pagamento...", "info");
  setTimeout(() => {
    showNotification(
      "Relatório de métodos de pagamento gerado com sucesso!",
      "success"
    );
  }, 2000);
}

// View payment trends
function viewPaymentTrends() {
  showNotification("Carregando análise de tendências de pagamento...", "info");
  setTimeout(() => {
    showNotification("Análise de tendências carregada com sucesso!", "success");
    // Aqui você poderia abrir um modal com análises detalhadas
  }, 1500);
}

// View all transactions
function viewAllTransactions() {
  openModal("viewAllTransactionsModal");
  loadAllTransactionsData();
}

// Sample transactions data for demonstration
const allTransactionsData = [
  {
    id: 1,
    studentName: "Ana Silva",
    description: "Matrícula - Categoria B",
    amount: 1200.0,
    type: "income",
    status: "completed",
    date: "2024-08-20",
    time: "09:15",
    paymentMethod: "credit_card",
    installments: 3,
    currentInstallment: 1,
    category: "enrollment",
    reference: "MAT-2024-001",
  },
  {
    id: 2,
    studentName: "Bruno Costa",
    description: "Aula Prática",
    amount: 80.0,
    type: "income",
    status: "pending",
    date: "2024-08-22",
    time: "14:30",
    paymentMethod: "pix",
    installments: 1,
    currentInstallment: 1,
    category: "lesson",
    reference: "AULA-2024-045",
  },
  {
    id: 3,
    studentName: "Auto Escola Ressaca",
    description: "Combustível Veículos",
    amount: 250.0,
    type: "expense",
    status: "completed",
    date: "2024-08-23",
    time: "16:45",
    paymentMethod: "debit_card",
    installments: 1,
    currentInstallment: 1,
    category: "fuel",
    reference: "COMB-2024-012",
  },
  {
    id: 4,
    studentName: "Carla Mendes",
    description: "Taxa de Exame - DETRAN",
    amount: 150.0,
    type: "income",
    status: "completed",
    date: "2024-08-24",
    time: "10:20",
    paymentMethod: "money",
    installments: 1,
    currentInstallment: 1,
    category: "exam",
    reference: "EXAM-2024-078",
  },
  {
    id: 5,
    studentName: "Auto Escola Ressaca",
    description: "Manutenção Veículo ABC-1234",
    amount: 450.0,
    type: "expense",
    status: "completed",
    date: "2024-08-25",
    time: "08:30",
    paymentMethod: "transfer",
    installments: 1,
    currentInstallment: 1,
    category: "maintenance",
    reference: "MANUT-2024-003",
  },
  {
    id: 6,
    studentName: "Daniel Santos",
    description: "Pacote Completo - Categoria B",
    amount: 2500.0,
    type: "income",
    status: "partial",
    date: "2024-08-26",
    time: "15:00",
    paymentMethod: "credit_card",
    installments: 5,
    currentInstallment: 2,
    category: "package",
    reference: "PAC-2024-015",
  },
];

function loadAllTransactionsData() {
  const container = document.getElementById("transactionsListContainer");

  container.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--primary-color, #007bff);"></i>
          <p style="margin-top: 10px;">Carregando lista de transações...</p>
        </div>
      `;

  setTimeout(() => {
    renderTransactionsList(allTransactionsData);
  }, 800);
}

function renderTransactionsList(transactions) {
  const container = document.getElementById("transactionsListContainer");

  if (transactions.length === 0) {
    container.innerHTML = `
          <div style="padding: 40px; text-align: center;">
            <i class="fas fa-dollar-sign" style="font-size: 48px; color: var(--text-muted, #6c757d); margin-bottom: 15px;"></i>
            <h4 style="color: var(--text-muted, #6c757d); margin-bottom: 10px;">Nenhuma transação encontrada</h4>
            <p style="color: var(--text-muted, #6c757d);">Tente ajustar os filtros de busca</p>
          </div>
        `;
    return;
  }

  const transactionsHtml = transactions
    .map((transaction) => {
      const statusClass =
        transaction.status === "completed"
          ? "success"
          : transaction.status === "pending"
          ? "warning"
          : transaction.status === "partial"
          ? "info"
          : "danger";
      const statusText =
        transaction.status === "completed"
          ? "Concluída"
          : transaction.status === "pending"
          ? "Pendente"
          : transaction.status === "partial"
          ? "Parcial"
          : "Cancelada";

      const typeIcon =
        transaction.type === "income" ? "fa-arrow-up" : "fa-arrow-down";
      const typeClass = transaction.type === "income" ? "success" : "danger";
      const typeText = transaction.type === "income" ? "Entrada" : "Saída";

      const transactionDate = new Date(
        transaction.date + "T" + transaction.time
      );
      const formattedDate = transactionDate.toLocaleDateString("pt-BR");
      const formattedTime = transaction.time;

      const paymentMethods = {
        credit_card: "Cartão de Crédito",
        debit_card: "Cartão de Débito",
        pix: "PIX",
        money: "Dinheiro",
        transfer: "Transferência",
      };

      const categories = {
        enrollment: "Matrícula",
        lesson: "Aula",
        exam: "Exame",
        package: "Pacote",
        fuel: "Combustível",
        maintenance: "Manutenção",
      };

      return `
          <div class="transaction-item" style="
            display: flex; 
            align-items: center; 
            padding: 15px 20px; 
            border-bottom: 1px solid var(--border-color, #e0e0e0);
            transition: background-color 0.2s ease;
          " onmouseover="this.style.backgroundColor='var(--background-hover, #f8f9fa)'" 
             onmouseout="this.style.backgroundColor='transparent'">
            
            <div style="
              width: 50px; 
              height: 50px; 
              background: ${
                transaction.type === "income"
                  ? "linear-gradient(135deg, var(--success-color, #28a745), #20c997)"
                  : "linear-gradient(135deg, var(--danger-color, #dc3545), #fd7e14)"
              }; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-weight: bold; 
              font-size: 18px;
              margin-right: 15px;
            ">
              <i class="fas ${typeIcon}"></i>
            </div>

            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                <h4 style="margin: 0; color: var(--text-primary, #333);">${
                  transaction.description
                }</h4>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="
                    font-size: 18px; 
                    font-weight: bold; 
                    color: ${
                      transaction.type === "income"
                        ? "var(--success-color, #28a745)"
                        : "var(--danger-color, #dc3545)"
                    };
                  ">
                    ${
                      transaction.type === "income" ? "+" : "-"
                    } R$ ${transaction.amount.toFixed(2).replace(".", ",")}
                  </span>
                  <span class="status-badge status-${statusClass}" style="
                    padding: 4px 8px; 
                    border-radius: 12px; 
                    font-size: 12px; 
                    font-weight: 500;
                    background-color: ${
                      statusClass === "success"
                        ? "#d4edda"
                        : statusClass === "warning"
                        ? "#fff3cd"
                        : statusClass === "info"
                        ? "#d1ecf1"
                        : "#f8d7da"
                    };
                    color: ${
                      statusClass === "success"
                        ? "#155724"
                        : statusClass === "warning"
                        ? "#856404"
                        : statusClass === "info"
                        ? "#0c5460"
                        : "#721c24"
                    };
                  ">
                    ${statusText}
                  </span>
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-bottom: 8px;">
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-user" style="width: 16px;"></i> ${
                    transaction.studentName
                  }
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-calendar" style="width: 16px;"></i> ${formattedDate}
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-clock" style="width: 16px;"></i> ${formattedTime}
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-credit-card" style="width: 16px;"></i> ${
                    paymentMethods[transaction.paymentMethod]
                  }
                </small>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-tag" style="width: 16px;"></i> ${
                    categories[transaction.category]
                  }
                </small>
                ${
                  transaction.installments > 1
                    ? `
                  <small style="color: var(--text-secondary, #6c757d);">
                    <i class="fas fa-list-ol" style="width: 16px;"></i> ${transaction.currentInstallment}/${transaction.installments}
                  </small>
                `
                    : ""
                }
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-hashtag" style="width: 16px;"></i> ${
                    transaction.reference
                  }
                </small>
              </div>
            </div>

            <div style="display: flex; gap: 8px; margin-left: 15px;">
              <button class="btn btn-sm btn-outline-primary" 
                      onclick="viewTransactionDetails(${transaction.id})" 
                      title="Ver Detalhes"
                      style="padding: 6px 10px; border-radius: 6px;">
                <i class="fas fa-eye"></i>
              </button>
              ${
                transaction.status === "pending"
                  ? `
                <button class="btn btn-sm btn-outline-success" 
                        onclick="markTransactionPaid(${transaction.id})" 
                        title="Marcar como Pago"
                        style="padding: 6px 10px; border-radius: 6px;">
                  <i class="fas fa-check"></i>
                </button>
              `
                  : ""
              }
              <button class="btn btn-sm btn-outline-info" 
                      onclick="printTransactionReceipt(${transaction.id})" 
                      title="Imprimir Recibo"
                      style="padding: 6px 10px; border-radius: 6px;">
                <i class="fas fa-print"></i>
              </button>
            </div>
          </div>
        `;
    })
    .join("");

  container.innerHTML = transactionsHtml;
}

function filterTransactionsList() {
  const searchTerm = document
    .getElementById("transactionSearchInput")
    .value.toLowerCase();
  const statusFilter = document.getElementById("transactionStatusFilter").value;
  const typeFilter = document.getElementById("transactionTypeFilter").value;

  const filteredTransactions = allTransactionsData.filter((transaction) => {
    const matchesSearch =
      !searchTerm ||
      transaction.studentName.toLowerCase().includes(searchTerm) ||
      transaction.description.toLowerCase().includes(searchTerm) ||
      transaction.reference.toLowerCase().includes(searchTerm);

    const matchesStatus = !statusFilter || transaction.status === statusFilter;
    const matchesType = !typeFilter || transaction.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  renderTransactionsList(filteredTransactions);
}

// View transaction details
function viewTransactionDetails(id) {
  showNotification(`Carregando detalhes da transação #${id}...`, "info");
  // Here you would typically open a modal or navigate to details page
}

// Download receipt

// Send payment reminder
function sendReminder(id) {
  showNotification("Enviando lembrete de pagamento...", "info");
  setTimeout(() => {
    showNotification("Lembrete enviado com sucesso!", "success");
  }, 1500);
}

// Contact student for overdue payment
function contactStudent(id) {
  if (
    confirm("Deseja entrar em contato com o aluno sobre o pagamento em atraso?")
  ) {
    showNotification("Iniciando contato com o aluno...", "info");
    setTimeout(() => {
      showNotification("Contato realizado com sucesso!", "success");
    }, 2000);
  }
}

// View expense details
function viewExpenseDetails(id) {
  showNotification(`Carregando detalhes da despesa #${id}...`, "info");
}

// Edit payment
function editPayment(id) {
  showNotification(`Carregando dados do pagamento #${id}...`, "info");
  // Here you would typically open the payment modal with pre-filled data
  setTimeout(() => {
    openModal("paymentModal");
  }, 500);
}

// Filter transactions
function filterTransactions(filterType) {
  const transactionItems = document.querySelectorAll(".transaction-item");

  transactionItems.forEach((item) => {
    if (filterType === "all") {
      item.style.display = "flex";
    } else {
      if (item.classList.contains(filterType)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    }
  });
}

// Add event listener for transaction filter
document.addEventListener("DOMContentLoaded", function () {
  const filterSelect = document.querySelector(
    ".transactions-filters .filter-select"
  );
  if (filterSelect) {
    filterSelect.addEventListener("change", function () {
      const filterType = this.value;
      filterTransactions(filterType);
    });
  }

  // Add event listener for chart filter
  const chartFilter = document.querySelector(".chart-filter");
  if (chartFilter) {
    chartFilter.addEventListener("change", function () {
      const months = parseInt(this.value);
      updateFinanceChart(months);
    });
  }
});

// Update finance chart based on period selection (legacy support)
function updateFinanceChart(months) {
  updateFinanceChartPeriod(months);
}

// ===== EXAMS FUNCTIONS =====

// Generate exams report
function generateExamsReport() {
  showNotification("Gerando relatório de exames...", "info");
  setTimeout(() => {
    showNotification("Relatório de exames gerado com sucesso!", "success");
  }, 2000);
}

// Export exams chart
function exportExamsChart() {
  showNotification("Exportando gráfico de performance...", "info");
  setTimeout(() => {
    showNotification("Gráfico exportado com sucesso!", "success");
  }, 1500);
}

// Enhanced Exam Distribution Functions
function viewExamDistributionDetails() {
  showNotification("Carregando detalhes da distribuição de exames...", "info");
  setTimeout(() => {
    showNotification("Detalhes carregados com sucesso!", "success");
  }, 1000);
}

function updateExamDistribution() {
  const filter =
    document.getElementById("exam-distribution-filter")?.value || "month";
  showNotification(
    `Atualizando distribuição para: ${getFilterLabel(filter)}`,
    "info"
  );

  // Simulate data update
  setTimeout(() => {
    // Here you would update the distribution data based on the filter
    showNotification("Distribuição atualizada com sucesso!", "success");
  }, 800);
}

function getFilterLabel(filter) {
  const labels = {
    month: "Este Mês",
    quarter: "Último Trimestre",
    semester: "Último Semestre",
    year: "Este Ano",
  };
  return labels[filter] || "Período selecionado";
}

// View all exams
function viewAllExams() {
  openModal("viewAllExamsModal");
  loadAllExamsData();
}

// Sample exams data for demonstration
const allExamsData = [
  {
    id: 1,
    studentName: "Ana Silva",
    examType: "theoretical",
    category: "Categoria B",
    date: "2024-08-25",
    time: "09:00",
    status: "approved",
    score: 28,
    maxScore: 30,
    location: "Detran Central",
    instructorName: "Carlos Santos",
    attempts: 1,
    validUntil: "2024-12-25",
  },
  {
    id: 2,
    studentName: "Bruno Costa",
    examType: "practical",
    category: "Categoria A",
    date: "2024-08-26",
    time: "14:00",
    status: "failed",
    score: 0,
    maxScore: 100,
    location: "Detran Norte",
    instructorName: "Maria Oliveira",
    attempts: 2,
    validUntil: null,
  },
  {
    id: 3,
    studentName: "Carla Mendes",
    examType: "theoretical",
    category: "Categoria B",
    date: "2024-08-27",
    time: "10:30",
    status: "scheduled",
    score: null,
    maxScore: 30,
    location: "Detran Sul",
    instructorName: "João Pereira",
    attempts: 1,
    validUntil: null,
  },
  {
    id: 4,
    studentName: "Daniel Santos",
    examType: "practical",
    category: "Categoria B",
    date: "2024-08-28",
    time: "16:00",
    status: "approved",
    score: 85,
    maxScore: 100,
    location: "Detran Central",
    instructorName: "Ana Paula",
    attempts: 1,
    validUntil: "2024-12-28",
  },
  {
    id: 5,
    studentName: "Elena Rodrigues",
    examType: "practical",
    category: "Categoria A",
    date: "2024-08-30",
    time: "11:00",
    status: "scheduled",
    score: null,
    maxScore: 100,
    location: "Detran Norte",
    instructorName: "Roberto Silva",
    attempts: 1,
    validUntil: null,
  },
];

function loadAllExamsData() {
  const container = document.getElementById("examsListContainer");

  container.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--primary-color, #007bff);"></i>
          <p style="margin-top: 10px;">Carregando lista de exames...</p>
        </div>
      `;

  setTimeout(() => {
    renderExamsList(allExamsData);
  }, 800);
}

function renderExamsList(exams) {
  const container = document.getElementById("examsListContainer");

  if (exams.length === 0) {
    container.innerHTML = `
          <div style="padding: 40px; text-align: center;">
            <i class="fas fa-clipboard-check" style="font-size: 48px; color: var(--text-muted, #6c757d); margin-bottom: 15px;"></i>
            <h4 style="color: var(--text-muted, #6c757d); margin-bottom: 10px;">Nenhum exame encontrado</h4>
            <p style="color: var(--text-muted, #6c757d);">Tente ajustar os filtros de busca</p>
          </div>
        `;
    return;
  }

  const examsHtml = exams
    .map((exam) => {
      const statusClass =
        exam.status === "approved"
          ? "success"
          : exam.status === "failed"
          ? "danger"
          : exam.status === "scheduled"
          ? "warning"
          : "info";
      const statusText =
        exam.status === "approved"
          ? "Aprovado"
          : exam.status === "failed"
          ? "Reprovado"
          : exam.status === "scheduled"
          ? "Agendado"
          : "Pendente";

      const typeIcon = exam.examType === "theoretical" ? "fa-book" : "fa-car";
      const typeText = exam.examType === "theoretical" ? "Teórico" : "Prático";

      const examDate = new Date(exam.date + "T" + exam.time);
      const formattedDate = examDate.toLocaleDateString("pt-BR");
      const formattedTime = exam.time;

      return `
          <div class="exam-item" style="
            display: flex; 
            align-items: center; 
            padding: 15px 20px; 
            border-bottom: 1px solid var(--border-color, #e0e0e0);
            transition: background-color 0.2s ease;
          " onmouseover="this.style.backgroundColor='var(--background-hover, #f8f9fa)'" 
             onmouseout="this.style.backgroundColor='transparent'">
            
            <div style="
              width: 50px; 
              height: 50px; 
              background: linear-gradient(135deg, var(--primary-color, #007bff), var(--info-color, #17a2b8)); 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-weight: bold; 
              font-size: 18px;
              margin-right: 15px;
            ">
              <i class="fas ${typeIcon}"></i>
            </div>

            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                <h4 style="margin: 0; color: var(--text-primary, #333);">${
                  exam.studentName
                } - ${typeText}</h4>
                <span class="status-badge status-${statusClass}" style="
                  padding: 4px 8px; 
                  border-radius: 12px; 
                  font-size: 12px; 
                  font-weight: 500;
                  background-color: ${
                    statusClass === "success"
                      ? "#d4edda"
                      : statusClass === "danger"
                      ? "#f8d7da"
                      : statusClass === "warning"
                      ? "#fff3cd"
                      : "#d1ecf1"
                  };
                  color: ${
                    statusClass === "success"
                      ? "#155724"
                      : statusClass === "danger"
                      ? "#721c24"
                      : statusClass === "warning"
                      ? "#856404"
                      : "#0c5460"
                  };
                ">
                  ${statusText}
                </span>
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 8px;">
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-id-card" style="width: 16px;"></i> ${
                    exam.category
                  }
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-calendar" style="width: 16px;"></i> ${formattedDate}
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-clock" style="width: 16px;"></i> ${formattedTime}
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-map-marker-alt" style="width: 16px;"></i> ${
                    exam.location
                  }
                </small>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px;">
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-user-tie" style="width: 16px;"></i> ${
                    exam.instructorName
                  }
                </small>
                ${
                  exam.score !== null
                    ? `
                  <small style="color: var(--text-secondary, #6c757d);">
                    <i class="fas fa-chart-line" style="width: 16px;"></i> ${exam.score}/${exam.maxScore}
                  </small>
                `
                    : ""
                }
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-redo" style="width: 16px;"></i> ${
                    exam.attempts
                  }ª tentativa
                </small>
                ${
                  exam.validUntil
                    ? `
                  <small style="color: var(--text-secondary, #6c757d);">
                    <i class="fas fa-calendar-check" style="width: 16px;"></i> Válido até ${exam.validUntil}
                  </small>
                `
                    : ""
                }
              </div>
            </div>

            <div style="display: flex; gap: 8px; margin-left: 15px;">
              <button class="btn btn-sm btn-outline-primary" 
                      onclick="viewExamDetails(${exam.id})" 
                      title="Ver Detalhes"
                      style="padding: 6px 10px; border-radius: 6px;">
                <i class="fas fa-eye"></i>
              </button>
              ${
                exam.status === "scheduled"
                  ? `
                <button class="btn btn-sm btn-outline-success" 
                        onclick="editExam(${exam.id})" 
                        title="Editar"
                        style="padding: 6px 10px; border-radius: 6px;">
                  <i class="fas fa-edit"></i>
                </button>
              `
                  : ""
              }
              ${
                exam.status === "approved"
                  ? `
                <button class="btn btn-sm btn-outline-info" 
                        onclick="printCertificate(${exam.id})" 
                        title="Imprimir Certificado"
                        style="padding: 6px 10px; border-radius: 6px;">
                  <i class="fas fa-certificate"></i>
                </button>
              `
                  : ""
              }
            </div>
          </div>
        `;
    })
    .join("");

  container.innerHTML = examsHtml;
}

function filterExamsList() {
  const searchTerm = document
    .getElementById("examSearchInput")
    .value.toLowerCase();
  const statusFilter = document.getElementById("examStatusFilter").value;
  const typeFilter = document.getElementById("examTypeFilter").value;

  const filteredExams = allExamsData.filter((exam) => {
    const matchesSearch =
      !searchTerm ||
      exam.studentName.toLowerCase().includes(searchTerm) ||
      exam.category.toLowerCase().includes(searchTerm) ||
      exam.location.toLowerCase().includes(searchTerm) ||
      exam.instructorName.toLowerCase().includes(searchTerm);

    const matchesStatus = !statusFilter || exam.status === statusFilter;
    const matchesType = !typeFilter || exam.examType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  renderExamsList(filteredExams);
}

// View exam details
function viewExamDetails(id) {
  showNotification(`Carregando detalhes do exame #${id}...`, "info");
  // Here you would typically open a modal or navigate to details page
}

// View exam results
function viewExamResults(id) {
  showNotification(`Carregando resultados do exame #${id}...`, "info");
  // Here you would typically open a modal with exam results
}

// Generate certificate
function generateCertificate(id) {
  showNotification("Gerando certificado de aprovação...", "info");
  setTimeout(() => {
    showNotification("Certificado gerado com sucesso!", "success");
  }, 2000);
}

// Send exam reminder
function sendExamReminder(id) {
  showNotification("Enviando lembrete de exame...", "info");
  setTimeout(() => {
    showNotification("Lembrete enviado com sucesso!", "success");
  }, 1500);
}

// Schedule retake exam
function scheduleRetake(id) {
  if (confirm("Deseja agendar uma nova tentativa de exame para este aluno?")) {
    showNotification("Agendando nova tentativa...", "info");
    setTimeout(() => {
      showNotification("Nova tentativa agendada com sucesso!", "success");
      // Here you would typically open the exam scheduling modal
    }, 2000);
  }
}

// Check vehicle availability
function checkVehicleAvailability(id) {
  showNotification("Verificando disponibilidade do veículo...", "info");
  setTimeout(() => {
    showNotification("Veículo disponível para o exame!", "success");
  }, 1000);
}

// Contact student for exam
function contactStudent(id) {
  if (confirm("Deseja entrar em contato com o aluno sobre o exame?")) {
    showNotification("Iniciando contato com o aluno...", "info");
    setTimeout(() => {
      showNotification("Contato realizado com sucesso!", "success");
    }, 2000);
  }
}

// Edit exam
function editExam(id) {
  showNotification(`Carregando dados do exame #${id}...`, "info");
  // Here you would typically open the exam modal with pre-filled data
  setTimeout(() => {
    openModal("examModal");
  }, 500);
}

// Filter exams
function filterExams(filterType) {
  const examItems = document.querySelectorAll(".exam-item");

  examItems.forEach((item) => {
    if (filterType === "all") {
      item.style.display = "flex";
    } else {
      let showItem = false;

      switch (filterType) {
        case "scheduled":
          showItem = item.classList.contains("scheduled");
          break;
        case "completed":
          showItem = item.classList.contains("completed");
          break;
        case "approved":
          showItem = item.classList.contains("approved");
          break;
        case "failed":
          showItem = item.classList.contains("failed");
          break;
      }

      if (showItem) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    }
  });
}

// Initialize exams chart
function initExamsChart() {
  const examsCtx = document.getElementById("exams-chart");
  if (!examsCtx) return;

  // Dados realistas de performance de exames
  const examsData = {
    6: {
      labels: ["Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
      teorico: [73.5, 76.8, 81.2, 78.9, 75.3, 78.5],
      pratico: [68.2, 70.1, 72.8, 69.5, 63.7, 65.8],
      media: [70.8, 73.4, 77.0, 74.2, 69.5, 72.1],
      tentativas: [1.5, 1.4, 1.3, 1.4, 1.6, 1.4],
      totalExames: [42, 38, 45, 41, 48, 44],
    },
    12: {
      labels: [
        "Ago/23",
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
      ],
      teorico: [
        71.2, 74.8, 85.2, 79.4, 68.9, 72.1, 73.5, 76.8, 81.2, 78.9, 75.3, 78.5,
      ],
      pratico: [
        65.8, 67.2, 71.5, 68.9, 62.3, 66.1, 68.2, 70.1, 72.8, 69.5, 63.7, 65.8,
      ],
      media: [
        68.5, 71.0, 78.3, 74.1, 65.6, 69.1, 70.8, 73.4, 77.0, 74.2, 69.5, 72.1,
      ],
      tentativas: [1.6, 1.5, 1.2, 1.4, 1.7, 1.5, 1.5, 1.4, 1.3, 1.4, 1.6, 1.4],
      totalExames: [38, 41, 36, 43, 49, 40, 42, 38, 45, 41, 48, 44],
    },
    24: {
      labels: [
        "Jul/22",
        "Out/22",
        "Jan/23",
        "Abr/23",
        "Jul/23",
        "Out/23",
        "Jan/24",
        "Abr/24",
        "Jul/24",
      ],
      teorico: [69.5, 71.8, 73.2, 76.5, 74.1, 85.2, 72.1, 81.2, 78.5],
      pratico: [62.1, 64.3, 66.8, 69.2, 67.4, 71.5, 66.1, 72.8, 65.8],
      media: [65.8, 68.0, 70.0, 72.8, 70.7, 78.3, 69.1, 77.0, 72.1],
      tentativas: [1.8, 1.7, 1.6, 1.5, 1.6, 1.2, 1.5, 1.3, 1.4],
      totalExames: [35, 39, 41, 43, 38, 36, 40, 45, 44],
    },
  };

  const currentPeriod = 6;
  const data = examsData[currentPeriod];

  examsChart = new Chart(examsCtx.getContext("2d"), {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Taxa Aprovação Teórico",
          data: data.teorico,
          backgroundColor: "rgba(59, 130, 246, 0.15)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgba(59, 130, 246, 1)",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: "Taxa Aprovação Prático",
          data: data.pratico,
          backgroundColor: "rgba(34, 197, 94, 0.15)",
          borderColor: "rgba(34, 197, 94, 1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgba(34, 197, 94, 1)",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: "Média Geral",
          data: data.media,
          backgroundColor: "rgba(168, 85, 247, 0.1)",
          borderColor: "rgba(168, 85, 247, 1)",
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          borderDash: [8, 4],
          pointBackgroundColor: "rgba(168, 85, 247, 1)",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      animation: {
        duration: 2000,
        easing: "easeOutQuart",
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 50,
          max: 95,
          grid: {
            color: "rgba(255, 255, 255, 0.08)",
            drawBorder: false,
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: {
              size: 12,
              family: "Inter, sans-serif",
            },
            callback: function (value) {
              return value + "%";
            },
          },
        },
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
            drawBorder: false,
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: {
              size: 12,
              family: "Inter, sans-serif",
            },
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            color: "rgba(255, 255, 255, 0.9)",
            usePointStyle: true,
            pointStyle: "circle",
            padding: 25,
            font: {
              size: 13,
              family: "Inter, sans-serif",
              weight: "500",
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(30, 30, 46, 0.95)",
          titleColor: "#fff",
          bodyColor: "#ddd",
          borderColor: "rgba(59, 130, 246, 0.5)",
          borderWidth: 1,
          cornerRadius: 10,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          callbacks: {
            title: function (context) {
              return "Performance em " + context[0].label;
            },
            label: function (context) {
              return (
                context.dataset.label + ": " + context.parsed.y.toFixed(1) + "%"
              );
            },
            afterBody: function (context) {
              const index = context[0].dataIndex;
              return [
                `Total de exames: ${data.totalExames[index]}`,
                `Média de tentativas: ${data.tentativas[index]}x`,
              ];
            },
          },
        },
      },
    },
  });

  // Configurar controles de período
  setupExamsChartControls();
  return examsChart;
}

// Configurar controles do gráfico de exames
function setupExamsChartControls() {
  const chartFilter = document.querySelector("#exams-period-filter");
  if (chartFilter) {
    chartFilter.addEventListener("change", function (e) {
      updateExamsChartPeriod(parseInt(e.target.value));
    });
  }
}

// Atualizar período do gráfico de exames
function updateExamsChartPeriod(months) {
  const examsCanvas = document.getElementById("exams-chart");
  if (!examsCanvas) return;

  const chart = Chart.getChart(examsCanvas);
  if (!chart) return;

  const examsData = {
    6: {
      labels: ["Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
      teorico: [73.5, 76.8, 81.2, 78.9, 75.3, 78.5],
      pratico: [68.2, 70.1, 72.8, 69.5, 63.7, 65.8],
      media: [70.8, 73.4, 77.0, 74.2, 69.5, 72.1],
      tentativas: [1.5, 1.4, 1.3, 1.4, 1.6, 1.4],
      totalExames: [42, 38, 45, 41, 48, 44],
    },
    12: {
      labels: [
        "Ago/23",
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
      ],
      teorico: [
        71.2, 74.8, 85.2, 79.4, 68.9, 72.1, 73.5, 76.8, 81.2, 78.9, 75.3, 78.5,
      ],
      pratico: [
        65.8, 67.2, 71.5, 68.9, 62.3, 66.1, 68.2, 70.1, 72.8, 69.5, 63.7, 65.8,
      ],
      media: [
        68.5, 71.0, 78.3, 74.1, 65.6, 69.1, 70.8, 73.4, 77.0, 74.2, 69.5, 72.1,
      ],
      tentativas: [1.6, 1.5, 1.2, 1.4, 1.7, 1.5, 1.5, 1.4, 1.3, 1.4, 1.6, 1.4],
      totalExames: [38, 41, 36, 43, 49, 40, 42, 38, 45, 41, 48, 44],
    },
    24: {
      labels: [
        "Jul/22",
        "Set/22",
        "Nov/22",
        "Jan/23",
        "Mar/23",
        "Mai/23",
        "Jul/23",
        "Set/23",
        "Nov/23",
        "Jan/24",
        "Mar/24",
        "Mai/24",
        "Jul/24",
      ],
      teorico: [
        69.5, 70.8, 71.8, 73.2, 75.1, 76.5, 74.1, 74.8, 85.2, 72.1, 76.8, 78.9,
        78.5,
      ],
      pratico: [
        62.1, 63.5, 64.3, 66.8, 68.1, 69.2, 67.4, 67.2, 71.5, 66.1, 70.1, 69.5,
        65.8,
      ],
      media: [
        65.8, 67.1, 68.0, 70.0, 71.6, 72.8, 70.7, 71.0, 78.3, 69.1, 73.4, 74.2,
        72.1,
      ],
      tentativas: [
        1.8, 1.7, 1.7, 1.6, 1.6, 1.5, 1.6, 1.5, 1.2, 1.5, 1.4, 1.4, 1.4,
      ],
      totalExames: [35, 37, 39, 41, 42, 43, 38, 41, 36, 40, 38, 41, 44],
    },
  };

  const data = examsData[months];

  // Atualizar dados do gráfico
  chart.data.labels = data.labels;
  chart.data.datasets[0].data = data.teorico;
  chart.data.datasets[1].data = data.pratico;
  chart.data.datasets[2].data = data.media;

  // Atualizar com animação
  chart.update("active");

  // Mostrar notificação
  const periodos = { 6: "6 meses", 12: "1 ano", 24: "2 anos" };
  showNotification(
    `Gráfico de exames atualizado para ${periodos[months]}`,
    "success"
  );
}

// Update exam countdown timers
function updateExamCountdowns() {
  const countdownElements = document.querySelectorAll(".countdown-value");
  countdownElements.forEach((element) => {
    // This would typically calculate real countdown based on exam date
    // For demo purposes, we'll just show static values
  });
}

// Add event listeners for exams section
document.addEventListener("DOMContentLoaded", function () {
  // Add event listener for exams filter
  const examsFilterSelect = document.querySelector(
    ".management-filters .filter-select"
  );
  if (examsFilterSelect) {
    examsFilterSelect.addEventListener("change", function () {
      const filterType = this.value;
      filterExams(filterType);
    });
  }

  // Initialize exams chart when exams section is shown
  const examsMenuItem = document.querySelector('[data-section="exams"]');
  if (examsMenuItem) {
    examsMenuItem.addEventListener("click", function () {
      setTimeout(() => {
        if (
          !document
            .getElementById("exams-chart")
            .hasAttribute("data-initialized")
        ) {
          initExamsChart();
          document
            .getElementById("exams-chart")
            .setAttribute("data-initialized", "true");
        }
      }, 100);
    });
  }

  // Update countdowns every minute
  setInterval(updateExamCountdowns, 60000);
});

// Show notification
function showNotification(message, type = "success") {
  const iconMap = {
    success: "fas fa-check-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
    error: "fas fa-times-circle",
  };
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "notification-item";
  notification.style.opacity = "0";
  notification.innerHTML = `
                <div class="notification-icon ${type}">
                    <i class="${iconMap[type] || iconMap.success}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">Ação Concluída</div>
                    <div class="notification-desc">${message}</div>
                    <div class="notification-time">Agora</div>
                </div>
            `;

  // Add to notifications list
  const notificationsList = document.getElementById("notifications-list");
  notificationsList.insertBefore(notification, notificationsList.firstChild);

  // Check and update empty state
  checkEmptyNotifications();

  // Animate in
  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transition = "opacity 0.3s ease";
  }, 100);

  // Update notification badge
  const badge = document.querySelector(".notification-badge");
  let count = parseInt(badge.textContent);
  badge.textContent = count + 1;

  // Auto hide after 5 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
        const currentCount = parseInt(badge.textContent);
        if (currentCount > 0) {
          badge.textContent = currentCount - 1;
        }
        // Check empty state after removing notification
        checkEmptyNotifications();
      }
    }, 300);
  }, 5000);
}
// Form handlers
document.getElementById("addStudentForm").addEventListener("submit", (e) => {
  e.preventDefault();
  showNotification("Novo aluno adicionado com sucesso!", "success");
  closeModal("addStudentModal");
  e.target.reset();
});

document.getElementById("addUserForm").addEventListener("submit", (e) => {
  e.preventDefault();

  // Validar se as senhas coincidem
  const password = document.getElementById("userPassword").value;
  const confirmPassword = document.getElementById("userPasswordConfirm").value;

  if (password !== confirmPassword) {
    showNotification("As senhas não coincidem!", "error");
    return;
  }

  if (password.length < 8) {
    showNotification("A senha deve ter pelo menos 8 caracteres!", "error");
    return;
  }

  // Validar CPF
  const cpf = document.getElementById("userCpf").value.replace(/\D/g, "");
  if (cpf.length !== 11) {
    showNotification("CPF deve ter 11 dígitos!", "error");
    return;
  }

  // Validar email
  const email = document.getElementById("userEmail").value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification("Email inválido!", "error");
    return;
  }

  // Simular cadastro
  const userName = document.getElementById("userName").value;
  const userRole = document.getElementById("userRole").value;
  const selectedPermissions = Array.from(
    document.querySelectorAll('input[name="permissions"]:checked')
  ).map((cb) => cb.value);

  showNotification(`✅ Usuário ${userName} cadastrado com sucesso!`, "success");
  showNotification(
    `📋 Perfil: ${userRole} | Permissões: ${selectedPermissions.length} módulos`,
    "info"
  );
  closeModal("addUserModal");
  e.target.reset();

  // Reset password indicators
  document.getElementById("passwordStrength").style.display = "none";
  document.getElementById("passwordMatch").style.display = "none";
});

// Toggle password visibility
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const button = input.nextElementSibling;
  const icon = button.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.className = "fas fa-eye-slash";
  } else {
    input.type = "password";
    icon.className = "fas fa-eye";
  }
}

// Password strength indicator
document.getElementById("userPassword").addEventListener("input", function (e) {
  const password = e.target.value;
  const strengthDiv = document.getElementById("passwordStrength");

  if (password.length === 0) {
    strengthDiv.style.display = "none";
    return;
  }

  let strength = 0;
  let feedback = "";

  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 2) {
    strengthDiv.className = "password-strength weak";
    feedback =
      "🔴 Senha fraca - Adicione letras maiúsculas, números e símbolos";
  } else if (strength <= 3) {
    strengthDiv.className = "password-strength medium";
    feedback = "🟡 Senha média - Considere adicionar mais elementos";
  } else {
    strengthDiv.className = "password-strength strong";
    feedback = "🟢 Senha forte - Boa segurança";
  }

  strengthDiv.textContent = feedback;
});

// Password match indicator
document
  .getElementById("userPasswordConfirm")
  .addEventListener("input", function (e) {
    const password = document.getElementById("userPassword").value;
    const confirmPassword = e.target.value;
    const matchDiv = document.getElementById("passwordMatch");

    if (confirmPassword.length === 0) {
      matchDiv.style.display = "none";
      return;
    }

    if (password === confirmPassword) {
      matchDiv.className = "password-match match";
      matchDiv.textContent = "✅ Senhas coincidem";
    } else {
      matchDiv.className = "password-match no-match";
      matchDiv.textContent = "❌ Senhas não coincidem";
    }
  });

// Select all permissions
function selectAllPermissions() {
  const checkboxes = document.querySelectorAll('input[name="permissions"]');
  checkboxes.forEach((cb) => (cb.checked = true));
  showNotification("Todas as permissões selecionadas", "info");
}

// Clear all permissions
function clearAllPermissions() {
  const checkboxes = document.querySelectorAll('input[name="permissions"]');
  checkboxes.forEach((cb) => (cb.checked = false));
  showNotification("Permissões desmarcadas", "info");
}

// Notes character counter
document.getElementById("userNotes").addEventListener("input", function (e) {
  const counter = document.getElementById("notesCounter");
  counter.textContent = e.target.value.length;

  if (e.target.value.length > 450) {
    counter.style.color = "var(--warning-color, #ffc107)";
  } else {
    counter.style.color = "var(--text-secondary, #6c757d)";
  }
});

// Formatação automática do CPF
const cpfInput = document.getElementById("userCpf");
if (cpfInput) {
  cpfInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      e.target.value = value;
    }
  });
}

const phoneInput = document.getElementById("userPhone");
if (phoneInput) {
  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d)/, "($1) $2");
      value = value.replace(/(\d)(\d{4})$/, "$1-$2");
      e.target.value = value;
    }
  });
}

const scheduleForm = document.getElementById("scheduleForm");
if (scheduleForm) {
  scheduleForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showNotification("Aula agendada com sucesso!", "success");
    closeModal("scheduleModal");
    e.target.reset();
  });
}

const paymentForm = document.getElementById("paymentForm");
if (paymentForm) {
  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showNotification("Pagamento registrado com sucesso!", "success");
    closeModal("paymentModal");
    e.target.reset();
  });
}
// Utility functions
function generateReport(type) {
  showNotification(`Gerando relatório de ${type}...`, "info");

  // Simulate report generation
  setTimeout(() => {
    showNotification(`Relatório de ${type} gerado com sucesso!`, "success");
    // Here you would typically trigger a download
  }, 2000);
}
function generateCustomReport() {
  showNotification("Abrindo gerador de relatórios personalizados...", "info");
}
function exportFinanceChart() {
  if (financeChart) {
    const url = financeChart.toBase64Image();
    const link = document.createElement("a");
    link.download = "grafico-financeiro.png";
    link.href = url;
    link.click();
    showNotification("Gráfico exportado com sucesso!", "success");
  }
}
function clearAllNotifications() {
  const notifications = document.querySelectorAll(".notification-item");
  notifications.forEach((notification) => {
    if (!notification.querySelector(".notifications-header")) {
      notification.remove();
    }
  });
  document.querySelector(".notification-badge").textContent = "0";
  checkEmptyNotifications();
  showNotification("Todas as notificações foram removidas", "info");
}

// Function to check if notifications list is empty and show/hide empty state
function checkEmptyNotifications() {
  const notificationsList = document.getElementById("notifications-list");
  const emptyState = document.getElementById("notifications-empty");
  const notificationItems =
    notificationsList.querySelectorAll(".notification-item");

  if (notificationItems.length === 0) {
    // Show empty state
    emptyState.style.display = "flex";
    notificationsList.style.display = "none";
  } else {
    // Hide empty state
    emptyState.style.display = "none";
    notificationsList.style.display = "block";
  }
}

function createBackup() {
  showNotification("Iniciando backup do sistema...", "info");

  setTimeout(() => {
    showNotification("Backup criado com sucesso!", "success");
  }, 3000);
}
function restoreBackup() {
  if (
    confirm(
      "Tem certeza que deseja restaurar um backup? Esta ação não pode ser desfeita."
    )
  ) {
    showNotification("Iniciando restauração do backup...", "warning");
  }
}
// Edit functions (placeholders)
function editStudent(id) {
  showNotification(`Editando aluno ID: ${id}`, "info");
}
function editInstructor(id) {
  showNotification(`Editando instrutor ID: ${id}`, "info");
}
function editVehicle(id) {
  showNotification(`Editando veículo ID: ${id}`, "info");
}
function editSchedule(id) {
  showNotification(`Editando agendamento ID: ${id}`, "info");
}
function editExam(id) {
  showNotification(`Editando exame ID: ${id}`, "info");
}
function viewExam(id) {
  showNotification(`Visualizando exame ID: ${id}`, "info");
}
function viewPayment(id) {
  showNotification(`Visualizando pagamento ID: ${id}`, "info");
}
function editPayment(id) {
  showNotification(`Editando pagamento ID: ${id}`, "info");
}

// Search functionality
const searchInput = document.querySelector(".search-input");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length > 2) {
      // Simulate search
      showNotification(`Buscando por: "${query}"`, "info");
    }
  });
}

// Handle window resize
window.addEventListener("resize", () => {
  // Close mobile menu on resize to desktop
  if (!isMobile()) {
    sidebar.classList.remove("mobile-open");
    sidebarOverlay.classList.remove("show");
  }

  // Close dropdowns on resize
  closeContextMenu();
  notificationsPanel.classList.remove("show");
  notificationsBtn.classList.remove("active");

  // Resize charts
  if (lessonsChart) lessonsChart.resize();
  if (studentsChart) studentsChart.resize();
  if (financeChart) financeChart.resize();
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Only handle shortcuts if no input is focused
  if (
    document.activeElement.tagName === "INPUT" ||
    document.activeElement.tagName === "SELECT"
  )
    return;

  // Ctrl + B: Toggle sidebar
  if (e.ctrlKey && e.key === "b") {
    e.preventDefault();
    if (isMobile()) {
      mobileMenuBtn.click();
    } else {
      toggleBtn.click();
    }
  }

  // Ctrl + N: New student
  if (e.ctrlKey && e.key === "n") {
    e.preventDefault();
    openModal("addStudentModal");
  }

  // Escape: Close all dropdowns and modals
  if (e.key === "Escape") {
    closeContextMenu();
    notificationsPanel.classList.remove("show");
    notificationsBtn.classList.remove("active");

    // Close any open modals
    document.querySelectorAll(".modal.show").forEach((modal) => {
      modal.classList.remove("show");
      document.body.style.overflow = "auto";
    });

    if (isMobile()) {
      sidebar.classList.remove("mobile-open");
      sidebarOverlay.classList.remove("show");
    }
  }

  // Ctrl + 1-8: Navigate to sections
  if (e.ctrlKey) {
    const sectionMap = {
      1: "dashboard",
      2: "students",
      3: "instructors",
      4: "vehicles",
      5: "schedule",
      6: "exams",
      7: "finance",
      8: "reports",
    };

    if (sectionMap[e.key]) {
      e.preventDefault();
      showSection(sectionMap[e.key]);
    }
  }
});

// Auto-refresh data simulation
setInterval(() => {
  // Simulate small data updates
  const studentsEl = document.getElementById("students-count");
  const lessonsEl = document.getElementById("lessons-count");
  const vehiclesEl = document.getElementById("vehicles-count");
  const revenueEl = document.getElementById("revenue-count");

  if (studentsEl && lessonsEl && vehiclesEl && revenueEl) {
    const currentStudents = parseInt(studentsEl.textContent);
    const currentLessons = parseInt(lessonsEl.textContent);
    const currentVehicles = parseInt(vehiclesEl.textContent);
    const currentRevenue = parseInt(
      revenueEl.textContent.replace("R$ ", "").replace(/\./g, "")
    );

    // Small random changes
    const newStudents = Math.max(
      140,
      Math.min(170, currentStudents + Math.floor(Math.random() * 3) - 1)
    );
    const newLessons = Math.max(
      15,
      Math.min(35, currentLessons + Math.floor(Math.random() * 5) - 2)
    );
    const newVehicles = Math.max(
      8,
      Math.min(15, currentVehicles + Math.floor(Math.random() * 2) - 1)
    );
    const newRevenue = Math.max(
      5000,
      Math.min(8000, currentRevenue + Math.floor(Math.random() * 200) - 100)
    );

    if (newStudents !== currentStudents) {
      animateCounter(studentsEl, currentStudents, newStudents, 800);
    }
    if (newLessons !== currentLessons) {
      animateCounter(lessonsEl, currentLessons, newLessons, 800);
    }
    if (newVehicles !== currentVehicles) {
      animateCounter(vehiclesEl, currentVehicles, newVehicles, 800);
    }
    if (newRevenue !== currentRevenue) {
      animateCounter(revenueEl, currentRevenue, newRevenue, 1000, "R$ ");
    }

    // Reset update time when data changes
    if (typeof resetUpdateTime === "function") {
      resetUpdateTime();
    }
  }
}, 60000); // Update every minute

// Students management functions
function generateStudentsReport() {
  showNotification("Gerando relatório de alunos...", "info");
  setTimeout(() => {
    showNotification("Relatório de alunos gerado com sucesso!", "success");
  }, 2000);
}

function exportStudentsChart() {
  console.log("Exporting students performance chart...");
  const canvas = document.getElementById("students-performance-chart");
  if (canvas) {
    const url = canvas.toDataURL();
    const link = document.createElement("a");
    link.download = "performance-alunos.png";
    link.href = url;
    link.click();
    showNotification(
      "Gráfico de performance exportado com sucesso!",
      "success"
    );
  } else {
    console.error("Students performance chart not found for export");
    showNotification("Erro ao exportar gráfico. Tente novamente.", "error");
  }
}

function viewAllStudents() {
  openModal("viewAllStudentsModal");
  loadAllStudentsData();
}

// Sample student data for demonstration
const allStudentsData = [
  {
    id: 1,
    name: "João Silva",
    cpf: "123.456.789-00",
    email: "joao.silva@email.com",
    phone: "(11) 99999-1111",
    category: "B",
    status: "ativo",
    progress: 75,
    lessonsCompleted: 15,
    totalLessons: 20,
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Maria Oliveira",
    cpf: "987.654.321-00",
    email: "maria.oliveira@email.com",
    phone: "(11) 88888-2222",
    category: "A",
    status: "ativo",
    progress: 60,
    lessonsCompleted: 12,
    totalLessons: 20,
    joinDate: "2024-02-10",
  },
  {
    id: 3,
    name: "Carlos Santos",
    cpf: "456.789.123-00",
    email: "carlos.santos@email.com",
    phone: "(11) 77777-3333",
    category: "AB",
    status: "concluido",
    progress: 100,
    lessonsCompleted: 25,
    totalLessons: 25,
    joinDate: "2023-11-20",
  },
  {
    id: 4,
    name: "Ana Costa",
    cpf: "789.123.456-00",
    email: "ana.costa@email.com",
    phone: "(11) 66666-4444",
    category: "B",
    status: "suspenso",
    progress: 40,
    lessonsCompleted: 8,
    totalLessons: 20,
    joinDate: "2024-03-05",
  },
  {
    id: 5,
    name: "Pedro Almeida",
    cpf: "321.654.987-00",
    email: "pedro.almeida@email.com",
    phone: "(11) 55555-5555",
    category: "B",
    status: "ativo",
    progress: 90,
    lessonsCompleted: 18,
    totalLessons: 20,
    joinDate: "2024-01-08",
  },
  {
    id: 6,
    name: "Lucia Fernandes",
    cpf: "654.987.321-00",
    email: "lucia.fernandes@email.com",
    phone: "(11) 44444-6666",
    category: "A",
    status: "ativo",
    progress: 25,
    lessonsCompleted: 5,
    totalLessons: 20,
    joinDate: "2024-03-20",
  },
];

function loadAllStudentsData() {
  const container = document.getElementById("studentsListContainer");

  // Show loading state initially
  container.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--primary-color, #007bff);"></i>
          <p style="margin-top: 10px;">Carregando lista de alunos...</p>
        </div>
      `;

  // Simulate loading delay
  setTimeout(() => {
    renderStudentsList(allStudentsData);
  }, 800);
}

function renderStudentsList(students) {
  const container = document.getElementById("studentsListContainer");

  if (students.length === 0) {
    container.innerHTML = `
          <div style="padding: 40px; text-align: center;">
            <i class="fas fa-users" style="font-size: 48px; color: var(--text-muted, #6c757d); margin-bottom: 15px;"></i>
            <h4 style="color: var(--text-muted, #6c757d); margin-bottom: 10px;">Nenhum aluno encontrado</h4>
            <p style="color: var(--text-muted, #6c757d);">Tente ajustar os filtros de busca</p>
          </div>
        `;
    return;
  }

  const studentsHtml = students
    .map((student) => {
      const statusClass =
        student.status === "ativo"
          ? "success"
          : student.status === "suspenso"
          ? "warning"
          : "info";
      const statusText =
        student.status === "ativo"
          ? "Ativo"
          : student.status === "suspenso"
          ? "Suspenso"
          : "Concluído";

      return `
          <div class="student-item" style="
            display: flex; 
            align-items: center; 
            padding: 15px 20px; 
            border-bottom: 1px solid var(--border-color, #e0e0e0);
            transition: background-color 0.2s ease;
          " onmouseover="this.style.backgroundColor='var(--background-hover, #f8f9fa)'" 
             onmouseout="this.style.backgroundColor='transparent'">
            
            <!-- Student Avatar -->
            <div style="
              width: 50px; 
              height: 50px; 
              background: linear-gradient(135deg, var(--primary-color, #007bff), var(--secondary-color, #6c757d)); 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-weight: bold; 
              font-size: 18px;
              margin-right: 15px;
            ">
              ${student.name.charAt(0).toUpperCase()}
            </div>

            <!-- Student Info -->
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                <h4 style="margin: 0; color: var(--text-primary, #333);">${
                  student.name
                }</h4>
                <span class="status-badge status-${statusClass}" style="
                  padding: 4px 8px; 
                  border-radius: 12px; 
                  font-size: 12px; 
                  font-weight: 500;
                  background-color: ${
                    statusClass === "success"
                      ? "#d4edda"
                      : statusClass === "warning"
                      ? "#fff3cd"
                      : "#d1ecf1"
                  };
                  color: ${
                    statusClass === "success"
                      ? "#155724"
                      : statusClass === "warning"
                      ? "#856404"
                      : "#0c5460"
                  };
                ">
                  ${statusText}
                </span>
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 8px;">
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-id-card" style="width: 16px;"></i> ${
                    student.cpf
                  }
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-envelope" style="width: 16px;"></i> ${
                    student.email
                  }
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-phone" style="width: 16px;"></i> ${
                    student.phone
                  }
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-car" style="width: 16px;"></i> Categoria ${
                    student.category
                  }
                </small>
              </div>

              <!-- Progress Bar -->
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <small style="color: var(--text-secondary, #6c757d); min-width: 80px;">
                  Progresso: ${student.progress}%
                </small>
                <div style="
                  flex: 1; 
                  height: 6px; 
                  background-color: var(--background-secondary, #e9ecef); 
                  border-radius: 3px; 
                  overflow: hidden;
                ">
                  <div style="
                    height: 100%; 
                    width: ${student.progress}%; 
                    background: linear-gradient(90deg, var(--primary-color, #007bff), var(--success-color, #28a745)); 
                    transition: width 0.3s ease;
                  "></div>
                </div>
                <small style="color: var(--text-secondary, #6c757d); min-width: 60px;">
                  ${student.lessonsCompleted}/${student.totalLessons} aulas
                </small>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: 8px; margin-left: 15px;">
              <button class="btn btn-sm btn-outline-primary" 
                      onclick="viewStudentProfile(${student.id})" 
                      title="Ver Perfil"
                      style="padding: 6px 10px; border-radius: 6px;">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline-success" 
                      onclick="editStudent(${student.id})" 
                      title="Editar"
                      style="padding: 6px 10px; border-radius: 6px;">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline-info" 
                      onclick="viewStudentLessons(${student.id})" 
                      title="Ver Aulas"
                      style="padding: 6px 10px; border-radius: 6px;">
                <i class="fas fa-calendar-alt"></i>
              </button>
            </div>
          </div>
        `;
    })
    .join("");

  container.innerHTML = studentsHtml;
}

function filterStudentsList() {
  const searchTerm = document
    .getElementById("studentSearchInput")
    .value.toLowerCase();
  const categoryFilter = document.getElementById("studentCategoryFilter").value;
  const statusFilter = document.getElementById("studentStatusFilter").value;

  const filteredStudents = allStudentsData.filter((student) => {
    const matchesSearch =
      !searchTerm ||
      student.name.toLowerCase().includes(searchTerm) ||
      student.cpf.includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm);

    const matchesCategory =
      !categoryFilter || student.category === categoryFilter;
    const matchesStatus = !statusFilter || student.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  renderStudentsList(filteredStudents);
}

function viewStudentProfile(studentId) {
  showNotification(`Carregando perfil do aluno ${studentId}...`, "info");
  // Here you would open student profile modal/page
}

function editStudent(studentId) {
  showNotification(`Editando dados do aluno ${studentId}...`, "info");
  // Here you would open edit student modal
}

function viewStudentLessons(studentId) {
  showNotification(`Carregando aulas do aluno ${studentId}...`, "info");
  // Here you would show student's lessons
}

function viewStudentPayments(studentId) {
  showNotification(`Carregando pagamentos do aluno ${studentId}...`, "info");
  // Here you would show student's payment history
}

function requestDocuments(studentId) {
  showNotification(`Solicitando documentos do aluno ${studentId}...`, "info");
  // Here you would send document request
}

function contactStudent(studentId) {
  showNotification(`Entrando em contato com aluno ${studentId}...`, "info");
  // Here you would open contact options
}

function viewStudentCertificate(studentId) {
  showNotification(`Carregando certificado do aluno ${studentId}...`, "info");
  // Here you would show/download certificate
}

function scheduleExam(studentId) {
  showNotification(`Agendando exame para aluno ${studentId}...`, "info");
  // Here you would open exam scheduling modal
}

// Initialize students performance chart
function initStudentsPerformanceChart() {
  const ctx = document.getElementById("students-performance-chart");
  if (!ctx) return;

  // Clear any existing chart
  studentsPerformanceChart = destroyChart(studentsPerformanceChart);

  const performanceData = {
    6: {
      labels: ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
      aprovacao: [85, 88, 82, 90, 87, 91],
      satisfacao: [4.2, 4.5, 4.3, 4.6, 4.4, 4.8],
      progressoMedio: [75, 78, 73, 82, 79, 85],
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
      aprovacao: [80, 83, 85, 87, 84, 86, 85, 88, 82, 90, 87, 91],
      satisfacao: [4.0, 4.1, 4.2, 4.3, 4.2, 4.4, 4.2, 4.5, 4.3, 4.6, 4.4, 4.8],
      progressoMedio: [68, 72, 75, 77, 74, 76, 75, 78, 73, 82, 79, 85],
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
      aprovacao: [75, 78, 80, 83, 85, 87, 86, 82, 91],
      satisfacao: [3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.3, 4.8],
      progressoMedio: [62, 65, 68, 72, 75, 77, 76, 73, 85],
    },
  };

  const currentPeriod =
    document.getElementById("students-period-filter")?.value || "6";
  const data = performanceData[currentPeriod];

  studentsPerformanceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Taxa de Aprovação (%)",
          data: data.aprovacao,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#22c55e",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: "Satisfação Média (★)",
          data: data.satisfacao,
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#f59e0b",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          yAxisID: "y1",
        },
        {
          label: "Progresso Médio (%)",
          data: data.progressoMedio,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 3,
          tension: 0.4,
          fill: false,
          pointBackgroundColor: "#3b82f6",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
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
          type: "linear",
          display: true,
          position: "left",
          beginAtZero: true,
          max: 100,
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
            drawBorder: false,
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: {
              size: 11,
            },
            callback: function (value) {
              return value + "%";
            },
          },
          title: {
            display: true,
            text: "Percentual (%)",
            color: "#22c55e",
            font: {
              size: 12,
              weight: 600,
            },
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          min: 0,
          max: 5,
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: {
              size: 11,
            },
            callback: function (value) {
              return value + "★";
            },
          },
          title: {
            display: true,
            text: "Satisfação (★)",
            color: "#f59e0b",
            font: {
              size: 12,
              weight: 600,
            },
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "rgba(255, 255, 255, 0.9)",
            padding: 20,
            usePointStyle: true,
            font: {
              size: 13,
              weight: 500,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(30, 30, 46, 0.95)",
          titleColor: "#fff",
          bodyColor: "#ddd",
          borderColor: "rgba(34, 197, 94, 0.5)",
          borderWidth: 1,
          cornerRadius: 12,
          displayColors: true,
          callbacks: {
            title: function (context) {
              return "Período: " + context[0].label;
            },
            label: function (context) {
              const suffix = context.dataset.label.includes("Satisfação")
                ? "★"
                : "%";
              return context.dataset.label + ": " + context.parsed.y + suffix;
            },
          },
        },
      },
    },
  });

  console.log("Students performance chart initialized successfully");
}

// Filter students function
function filterStudents(filter) {
  const students = document.querySelectorAll(".student-item");
  students.forEach((student) => {
    if (filter === "all") {
      student.style.display = "flex";
    } else {
      if (student.classList.contains(filter)) {
        student.style.display = "flex";
      } else {
        student.style.display = "none";
      }
    }
  });
}

// Search students function
function searchStudents(query) {
  const students = document.querySelectorAll(".student-item");
  const searchTerm = query.toLowerCase();

  students.forEach((student) => {
    const studentName = student
      .querySelector(".student-name strong")
      .textContent.toLowerCase();
    const studentCpf = student
      .querySelector(".student-cpf")
      .textContent.toLowerCase();
    const studentEnrollment = student
      .querySelector(".student-enrollment")
      .textContent.toLowerCase();

    if (
      studentName.includes(searchTerm) ||
      studentCpf.includes(searchTerm) ||
      studentEnrollment.includes(searchTerm)
    ) {
      student.style.display = "flex";
    } else {
      student.style.display = "none";
    }
  });
}

// Add event listeners for students section
document.addEventListener("DOMContentLoaded", function () {
  // Initialize students chart
  setTimeout(initStudentsChart, 100);

  // Search functionality
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      searchStudents(e.target.value);
    });
  }

  // Filter functionality
  const filterSelect = document.querySelector(".filter-select");
  if (filterSelect) {
    filterSelect.addEventListener("change", function (e) {
      filterStudents(e.target.value);
    });
  }

  // Chart filter functionality
  const chartFilter = document.querySelector(".chart-filter");
  if (chartFilter) {
    chartFilter.addEventListener("change", function (e) {
      showNotification(
        `Atualizando gráfico para ${
          e.target.options[e.target.selectedIndex].text
        }...`,
        "info"
      );
      // Here you would update the chart with new data
    });
  }
});

// Instructors management functions
function generateInstructorsReport() {
  showNotification("Gerando relatório de instrutores...", "info");
  setTimeout(() => {
    showNotification("Relatório de instrutores gerado com sucesso!", "success");
  }, 2000);
}

function exportInstructorsChart() {
  showNotification("Exportando gráfico de performance...", "info");
  setTimeout(() => {
    showNotification("Gráfico exportado com sucesso!", "success");
  }, 1500);
}

function viewAllInstructors() {
  openModal("viewAllInstructorsModal");
  loadAllInstructorsData();
}

// Sample instructor data for demonstration
const allInstructorsData = [
  {
    id: 1,
    name: "Carlos Mendes",
    cpf: "123.456.789-00",
    email: "carlos.mendes@escola.com",
    phone: "(11) 99999-1111",
    specialty: "practical",
    status: "available",
    experience: 8,
    studentsAssigned: 12,
    rating: 4.8,
    lessonsTaught: 156,
    joinDate: "2020-03-15",
  },
  {
    id: 2,
    name: "Ana Costa",
    cpf: "987.654.321-00",
    email: "ana.costa@escola.com",
    phone: "(11) 88888-2222",
    specialty: "theoretical",
    status: "available",
    experience: 5,
    studentsAssigned: 18,
    rating: 4.9,
    lessonsTaught: 89,
    joinDate: "2021-07-20",
  },
  {
    id: 3,
    name: "Roberto Silva",
    cpf: "456.789.123-00",
    email: "roberto.silva@escola.com",
    phone: "(11) 77777-3333",
    specialty: "mixed",
    status: "busy",
    experience: 12,
    studentsAssigned: 15,
    rating: 4.7,
    lessonsTaught: 234,
    joinDate: "2018-11-10",
  },
  {
    id: 4,
    name: "Marina Oliveira",
    cpf: "789.123.456-00",
    email: "marina.oliveira@escola.com",
    phone: "(11) 66666-4444",
    specialty: "practical",
    status: "vacation",
    experience: 6,
    studentsAssigned: 8,
    rating: 4.6,
    lessonsTaught: 112,
    joinDate: "2021-01-05",
  },
  {
    id: 5,
    name: "Fernando Santos",
    cpf: "321.654.987-00",
    email: "fernando.santos@escola.com",
    phone: "(11) 55555-5555",
    specialty: "theoretical",
    status: "available",
    experience: 10,
    studentsAssigned: 20,
    rating: 4.9,
    lessonsTaught: 178,
    joinDate: "2019-05-22",
  },
  {
    id: 6,
    name: "Juliana Lima",
    cpf: "654.987.321-00",
    email: "juliana.lima@escola.com",
    phone: "(11) 44444-6666",
    specialty: "practical",
    status: "busy",
    experience: 4,
    studentsAssigned: 10,
    rating: 4.5,
    lessonsTaught: 67,
    joinDate: "2022-02-14",
  },
];

function loadAllInstructorsData() {
  const container = document.getElementById("instructorsListContainer");

  // Show loading state initially
  container.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--primary-color, #007bff);"></i>
          <p style="margin-top: 10px;">Carregando lista de instrutores...</p>
        </div>
      `;

  // Simulate loading delay
  setTimeout(() => {
    renderInstructorsList(allInstructorsData);
  }, 800);
}

function renderInstructorsList(instructors) {
  const container = document.getElementById("instructorsListContainer");

  if (instructors.length === 0) {
    container.innerHTML = `
          <div style="padding: 40px; text-align: center;">
            <i class="fas fa-chalkboard-teacher" style="font-size: 48px; color: var(--text-muted, #6c757d); margin-bottom: 15px;"></i>
            <h4 style="color: var(--text-muted, #6c757d); margin-bottom: 10px;">Nenhum instrutor encontrado</h4>
            <p style="color: var(--text-muted, #6c757d);">Tente ajustar os filtros de busca</p>
          </div>
        `;
    return;
  }

  const instructorsHtml = instructors
    .map((instructor) => {
      const statusClass =
        instructor.status === "available"
          ? "success"
          : instructor.status === "busy"
          ? "warning"
          : "info";
      const statusText =
        instructor.status === "available"
          ? "Disponível"
          : instructor.status === "busy"
          ? "Ocupado"
          : "Férias";

      const specialtyText =
        instructor.specialty === "theoretical"
          ? "Teórica"
          : instructor.specialty === "practical"
          ? "Prática"
          : "Misto";

      const specialtyIcon =
        instructor.specialty === "theoretical"
          ? "fa-book"
          : instructor.specialty === "practical"
          ? "fa-car"
          : "fa-graduation-cap";

      return `
          <div class="instructor-item" style="
            display: flex; 
            align-items: center; 
            padding: 15px 20px; 
            border-bottom: 1px solid var(--border-color, #e0e0e0);
            transition: background-color 0.2s ease;
          " onmouseover="this.style.backgroundColor='var(--background-hover, #f8f9fa)'" 
             onmouseout="this.style.backgroundColor='transparent'">
            
            <!-- Instructor Avatar -->
            <div style="
              width: 50px; 
              height: 50px; 
              background: linear-gradient(135deg, var(--success-color, #28a745), var(--info-color, #17a2b8)); 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-weight: bold; 
              font-size: 18px;
              margin-right: 15px;
            ">
              ${instructor.name.charAt(0).toUpperCase()}
            </div>

            <!-- Instructor Info -->
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                <h4 style="margin: 0; color: var(--text-primary, #333);">${
                  instructor.name
                }</h4>
                <span class="status-badge status-${statusClass}" style="
                  padding: 4px 8px; 
                  border-radius: 12px; 
                  font-size: 12px; 
                  font-weight: 500;
                  background-color: ${
                    statusClass === "success"
                      ? "#d4edda"
                      : statusClass === "warning"
                      ? "#fff3cd"
                      : "#d1ecf1"
                  };
                  color: ${
                    statusClass === "success"
                      ? "#155724"
                      : statusClass === "warning"
                      ? "#856404"
                      : "#0c5460"
                  };
                ">
                  ${statusText}
                </span>
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 8px;">
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-id-card" style="width: 16px;"></i> ${
                    instructor.cpf
                  }
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-envelope" style="width: 16px;"></i> ${
                    instructor.email
                  }
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-phone" style="width: 16px;"></i> ${
                    instructor.phone
                  }
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas ${specialtyIcon}" style="width: 16px;"></i> ${specialtyText}
                </small>
              </div>

              <!-- Stats Row -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 8px;">
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-clock" style="width: 16px;"></i> ${
                    instructor.experience
                  } anos exp.
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-users" style="width: 16px;"></i> ${
                    instructor.studentsAssigned
                  } alunos
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-star" style="width: 16px; color: #ffc107;"></i> ${
                    instructor.rating
                  } avaliação
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-chalkboard" style="width: 16px;"></i> ${
                    instructor.lessonsTaught
                  } aulas
                </small>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: 8px; margin-left: 15px;">
              <button class="btn btn-sm btn-outline-primary" 
                      onclick="viewInstructorProfile(${instructor.id})" 
                      title="Ver Perfil"
                      style="padding: 6px 10px; border-radius: 6px;">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline-success" 
                      onclick="editInstructor(${instructor.id})" 
                      title="Editar"
                      style="padding: 6px 10px; border-radius: 6px;">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline-info" 
                      onclick="viewInstructorSchedule(${instructor.id})" 
                      title="Ver Agenda"
                      style="padding: 6px 10px; border-radius: 6px;">
                <i class="fas fa-calendar-alt"></i>
              </button>
            </div>
          </div>
        `;
    })
    .join("");

  container.innerHTML = instructorsHtml;
}

function filterInstructorsList() {
  const searchTerm = document
    .getElementById("instructorSearchInput")
    .value.toLowerCase();
  const specialtyFilter = document.getElementById(
    "instructorSpecialtyFilter"
  ).value;
  const statusFilter = document.getElementById("instructorStatusFilter").value;

  const filteredInstructors = allInstructorsData.filter((instructor) => {
    const matchesSearch =
      !searchTerm ||
      instructor.name.toLowerCase().includes(searchTerm) ||
      instructor.cpf.includes(searchTerm) ||
      instructor.email.toLowerCase().includes(searchTerm);

    const matchesSpecialty =
      !specialtyFilter || instructor.specialty === specialtyFilter;
    const matchesStatus = !statusFilter || instructor.status === statusFilter;

    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  renderInstructorsList(filteredInstructors);
}

function viewInstructorProfile(instructorId) {
  showNotification(`Carregando perfil do instrutor ${instructorId}...`, "info");
  // Here you would open instructor profile modal/page
}

function editInstructor(instructorId) {
  showNotification(`Editando dados do instrutor ${instructorId}...`, "info");
  // Here you would open edit instructor modal
}

function viewInstructorSchedule(instructorId) {
  showNotification(`Carregando agenda do instrutor ${instructorId}...`, "info");
  // Here you would show instructor's schedule
}

function viewInstructorStats(instructorId) {
  showNotification(
    `Carregando estatísticas do instrutor ${instructorId}...`,
    "info"
  );
  // Here you would show instructor's statistics
}

function contactInstructor(instructorId) {
  showNotification(
    `Entrando em contato com instrutor ${instructorId}...`,
    "info"
  );
  // Here you would open contact options
}

function assignLesson(instructorId) {
  showNotification(`Agendando aula para instrutor ${instructorId}...`, "info");
  // Here you would open lesson assignment modal
}

// Initialize instructors chart
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
          borderColor: "#4361ee",
          backgroundColor: "rgba(67, 97, 238, 0.1)",
          tension: 0.4,
          fill: true,
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: "#4361ee",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
        },
        {
          label: "Avaliação Média (x20)",
          data: data.ratings.map((r) => r * 20),
          borderColor: "#f72585",
          backgroundColor: "rgba(247, 37, 133, 0.1)",
          tension: 0.4,
          fill: true,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: "#f72585",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          yAxisID: "y1",
        },
        {
          label: "Taxa de Aprovação (%)",
          data: data.approval,
          borderColor: "#43e97b",
          backgroundColor: "rgba(67, 233, 123, 0.1)",
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          borderDash: [8, 4],
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#43e97b",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          yAxisID: "y2",
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
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#ffffff",
            usePointStyle: true,
            padding: 20,
            font: {
              size: 13,
              weight: 500,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(30, 30, 46, 0.95)",
          titleColor: "#fff",
          bodyColor: "#ddd",
          borderColor: "rgba(67, 97, 238, 0.5)",
          borderWidth: 1,
          cornerRadius: 12,
          displayColors: true,
          callbacks: {
            afterBody: function (context) {
              const index = context[0].dataIndex;
              return `Alunos Ativos: ${data.students[index]}`;
            },
          },
        },
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
          type: "linear",
          display: true,
          position: "left",
          beginAtZero: true,
          max: Math.max(...data.lessons) + 20,
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
            drawBorder: false,
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: {
              size: 11,
            },
            callback: function (value) {
              return value + " aulas";
            },
          },
          title: {
            display: true,
            text: "Aulas Ministradas",
            color: "#4361ee",
            font: {
              size: 12,
              weight: 600,
            },
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          min: 80,
          max: 100,
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: {
              size: 11,
            },
            callback: function (value) {
              return (value / 20).toFixed(1) + "★";
            },
          },
          title: {
            display: true,
            text: "Avaliação",
            color: "#f72585",
            font: {
              size: 12,
              weight: 600,
            },
          },
        },
        y2: {
          type: "linear",
          display: false,
          min: 70,
          max: 95,
        },
      },
    },
  });
}

// Function to update instructors chart period
function updateInstructorsChartPeriod() {
  initInstructorsChart();
}

// Filter instructors function
function filterInstructors(filter) {
  const instructors = document.querySelectorAll(".instructor-item");
  instructors.forEach((instructor) => {
    if (filter === "all") {
      instructor.style.display = "flex";
    } else {
      if (instructor.classList.contains(filter)) {
        instructor.style.display = "flex";
      } else {
        instructor.style.display = "none";
      }
    }
  });
}

// Search instructors function
function searchInstructors(query) {
  const instructors = document.querySelectorAll(".instructor-item");
  const searchTerm = query.toLowerCase();

  instructors.forEach((instructor) => {
    const instructorName = instructor
      .querySelector(".instructor-name strong")
      .textContent.toLowerCase();
    const instructorCpf = instructor
      .querySelector(".instructor-cpf")
      .textContent.toLowerCase();
    const instructorId = instructor
      .querySelector(".instructor-id")
      .textContent.toLowerCase();

    if (
      instructorName.includes(searchTerm) ||
      instructorCpf.includes(searchTerm) ||
      instructorId.includes(searchTerm)
    ) {
      instructor.style.display = "flex";
    } else {
      instructor.style.display = "none";
    }
  });
}

// Add event listeners for instructors section
document.addEventListener("DOMContentLoaded", function () {
  // Initialize instructors chart
  setTimeout(initInstructorsChart, 200);

  // Search functionality for instructors
  const instructorSearchInput = document.querySelector(
    ".instructors-management .search-input"
  );
  if (instructorSearchInput) {
    instructorSearchInput.addEventListener("input", function (e) {
      searchInstructors(e.target.value);
    });
  }

  // Filter functionality for instructors
  const instructorFilterSelect = document.querySelector(
    ".instructors-management .filter-select"
  );
  if (instructorFilterSelect) {
    instructorFilterSelect.addEventListener("change", function (e) {
      filterInstructors(e.target.value);
    });
  }

  // Chart filter functionality for instructors
  const instructorChartFilter = document.querySelector(
    ".instructors-performance-chart .chart-filter"
  );
  if (instructorChartFilter) {
    instructorChartFilter.addEventListener("change", function (e) {
      showNotification(
        `Atualizando gráfico de instrutores para ${
          e.target.options[e.target.selectedIndex].text
        }...`,
        "info"
      );
      // Here you would update the chart with new data
    });
  }
});

// Users management functions
function viewAllUsers() {
  openModal("viewAllUsersModal");
  loadAllUsersData();
}

// Sample users data for demonstration
const allUsersData = [
  {
    id: 1,
    name: "João Silva",
    cpf: "123.456.789-00",
    email: "joao@autodrive.com.br",
    phone: "(11) 99999-1111",
    role: "admin",
    status: "active",
    permissions: ["Todas"],
    lastAccess: "Hoje, 14:30",
    joinDate: "2020-01-15",
  },
  {
    id: 2,
    name: "Maria Santos",
    cpf: "987.654.321-00",
    email: "maria@autodrive.com.br",
    phone: "(11) 88888-2222",
    role: "instructor",
    status: "active",
    permissions: ["Aulas", "Exames"],
    lastAccess: "Hoje, 12:15",
    joinDate: "2021-03-10",
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    cpf: "456.789.123-00",
    email: "carlos@autodrive.com.br",
    phone: "(11) 77777-3333",
    role: "staff",
    status: "inactive",
    permissions: ["Cadastros"],
    lastAccess: "2 dias atrás",
    joinDate: "2022-07-05",
  },
  {
    id: 4,
    name: "Ana Paula",
    cpf: "789.123.456-00",
    email: "ana@autodrive.com.br",
    phone: "(11) 66666-4444",
    role: "instructor",
    status: "active",
    permissions: ["Aulas", "Veículos"],
    lastAccess: "Ontem, 18:45",
    joinDate: "2021-11-20",
  },
  {
    id: 5,
    name: "Roberto Silva",
    cpf: "321.654.987-00",
    email: "roberto@autodrive.com.br",
    phone: "(11) 55555-5555",
    role: "admin",
    status: "active",
    permissions: ["Todas"],
    lastAccess: "Hoje, 09:20",
    joinDate: "2019-08-12",
  },
];

function loadAllUsersData() {
  const container = document.getElementById("usersListContainer");

  // Show loading state initially
  container.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--primary-color, #007bff);"></i>
          <p style="margin-top: 10px;">Carregando lista de usuários...</p>
        </div>
      `;

  // Simulate loading delay
  setTimeout(() => {
    renderUsersList(allUsersData);
  }, 800);
}

function renderUsersList(users) {
  const container = document.getElementById("usersListContainer");

  if (users.length === 0) {
    container.innerHTML = `
          <div style="padding: 40px; text-align: center;">
            <i class="fas fa-users" style="font-size: 48px; color: var(--text-muted, #6c757d); margin-bottom: 15px;"></i>
            <h4 style="color: var(--text-muted, #6c757d); margin-bottom: 10px;">Nenhum usuário encontrado</h4>
            <p style="color: var(--text-muted, #6c757d);">Tente ajustar os filtros de busca</p>
          </div>
        `;
    return;
  }

  const usersHtml = users
    .map((user) => {
      const statusClass = user.status === "active" ? "success" : "warning";
      const statusText = user.status === "active" ? "Ativo" : "Inativo";
      const roleText =
        user.role === "admin"
          ? "Administrador"
          : user.role === "instructor"
          ? "Instrutor"
          : "Funcionário";
      const roleClass =
        user.role === "admin"
          ? "admin"
          : user.role === "instructor"
          ? "instructor"
          : "staff";

      return `
          <div class="user-item" style="
            display: flex; 
            align-items: center; 
            padding: 15px 20px; 
            border-bottom: 1px solid var(--border-color, #e0e0e0);
            transition: background-color 0.2s ease;
          " onmouseover="this.style.backgroundColor='var(--background-hover, #f8f9fa)'" 
             onmouseout="this.style.backgroundColor='transparent'">
            
            <!-- User Avatar -->
            <div style="
              width: 50px; 
              height: 50px; 
              border-radius: 50%; 
              background: var(--primary-color, #007bff); 
              color: white; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-weight: bold; 
              font-size: 18px;
              margin-right: 15px;
              position: relative;
            ">
              ${user.name.charAt(0).toUpperCase()}
              <div style="
                position: absolute;
                bottom: 2px;
                right: 2px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: ${user.status === "active" ? "#28a745" : "#ffc107"};
                border: 2px solid white;
              "></div>
            </div>

            <!-- User Info -->
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <strong style="color: var(--text-primary, #333); font-size: 16px;">${
                  user.name
                }</strong>
                <span class="badge ${roleClass}" style="
                  padding: 4px 8px;
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: 500;
                ">${roleText}</span>
              </div>
              <div style="color: var(--text-secondary, #6c757d); font-size: 14px; margin-bottom: 3px;">
                <i class="fas fa-envelope" style="width: 14px;"></i> ${
                  user.email
                }
              </div>
              <div style="color: var(--text-secondary, #6c757d); font-size: 14px;">
                <i class="fas fa-phone" style="width: 14px;"></i> ${user.phone}
              </div>
            </div>

            <!-- Permissions -->
            <div style="min-width: 150px; margin-right: 20px;">
              <div style="font-size: 12px; color: var(--text-secondary, #6c757d); margin-bottom: 5px;">Permissões:</div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                ${user.permissions
                  .map(
                    (perm) => `
                  <span style="
                    background: var(--background-secondary, #f8f9fa);
                    color: var(--text-primary, #333);
                    padding: 2px 6px;
                    border-radius: 8px;
                    font-size: 11px;
                    border: 1px solid var(--border-color, #e0e0e0);
                  ">${perm}</span>
                `
                  )
                  .join("")}
              </div>
            </div>

            <!-- Last Access -->
            <div style="min-width: 120px; margin-right: 20px; text-align: center;">
              <div style="font-size: 12px; color: var(--text-secondary, #6c757d); margin-bottom: 5px;">Último acesso:</div>
              <div style="font-size: 13px; color: var(--text-primary, #333);">${
                user.lastAccess
              }</div>
            </div>

            <!-- Status -->
            <div style="min-width: 80px; margin-right: 20px; text-align: center;">
              <span class="badge ${statusClass}" style="
                padding: 6px 12px;
                border-radius: 16px;
                font-size: 12px;
                font-weight: 500;
              ">${statusText}</span>
            </div>

            <!-- Actions -->
            <div style="display: flex; gap: 8px;">
              <button onclick="viewUserProfile(${
                user.id
              })" class="btn-icon" title="Ver perfil" style="
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 6px;
                background: var(--background-secondary, #f8f9fa);
                color: var(--primary-color, #007bff);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
              " onmouseover="this.style.background='var(--primary-color, #007bff)'; this.style.color='white';"
                 onmouseout="this.style.background='var(--background-secondary, #f8f9fa)'; this.style.color='var(--primary-color, #007bff)';">
                <i class="fas fa-user"></i>
              </button>
              
              <button onclick="editUser(${
                user.id
              })" class="btn-icon" title="Editar usuário" style="
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 6px;
                background: var(--background-secondary, #f8f9fa);
                color: var(--warning-color, #ffc107);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
              " onmouseover="this.style.background='var(--warning-color, #ffc107)'; this.style.color='white';"
                 onmouseout="this.style.background='var(--background-secondary, #f8f9fa)'; this.style.color='var(--warning-color, #ffc107)';">
                <i class="fas fa-edit"></i>
              </button>
              
              <button onclick="resetUserPassword(${
                user.id
              })" class="btn-icon" title="Redefinir senha" style="
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 6px;
                background: var(--background-secondary, #f8f9fa);
                color: var(--info-color, #17a2b8);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
              " onmouseover="this.style.background='var(--info-color, #17a2b8)'; this.style.color='white';"
                 onmouseout="this.style.background='var(--background-secondary, #f8f9fa)'; this.style.color='var(--info-color, #17a2b8)';">
                <i class="fas fa-key"></i>
              </button>
              
              <button onclick="toggleUserStatus(${
                user.id
              })" class="btn-icon" title="Ativar/Desativar" style="
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 6px;
                background: var(--background-secondary, #f8f9fa);
                color: ${
                  user.status === "active"
                    ? "var(--danger-color, #dc3545)"
                    : "var(--success-color, #28a745)"
                };
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
              " onmouseover="this.style.background='${
                user.status === "active"
                  ? "var(--danger-color, #dc3545)"
                  : "var(--success-color, #28a745)"
              }'; this.style.color='white';"
                 onmouseout="this.style.background='var(--background-secondary, #f8f9fa)'; this.style.color='${
                   user.status === "active"
                     ? "var(--danger-color, #dc3545)"
                     : "var(--success-color, #28a745)"
                 }';">
                <i class="fas fa-power-off"></i>
              </button>
            </div>
          </div>
        `;
    })
    .join("");

  container.innerHTML = usersHtml;
}

function filterUsersList() {
  const searchTerm = document
    .getElementById("userSearchInput")
    .value.toLowerCase();
  const roleFilter = document.getElementById("userRoleFilter").value;
  const statusFilter = document.getElementById("userStatusFilter").value;

  const filteredUsers = allUsersData.filter((user) => {
    const matchesSearch =
      !searchTerm ||
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.cpf.includes(searchTerm);

    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  renderUsersList(filteredUsers);
}

function viewUserProfile(userId) {
  showNotification(`Carregando perfil do usuário ${userId}...`, "info");
  // Here you would open user profile modal/page
}

function editUser(userId) {
  showNotification(`Editando dados do usuário ${userId}...`, "info");
  // Here you would open edit user modal
}

function resetUserPassword(userId) {
  if (
    confirm(
      "Deseja redefinir a senha deste usuário? Uma nova senha temporária será enviada por email."
    )
  ) {
    showNotification(`Redefinindo senha do usuário ${userId}...`, "info");
    setTimeout(() => {
      showNotification("Nova senha enviada por email!", "success");
    }, 2000);
  }
}

function toggleUserStatus(userId) {
  const user = allUsersData.find((u) => u.id === userId);
  const action = user.status === "active" ? "desativar" : "ativar";

  if (confirm(`Deseja ${action} este usuário?`)) {
    showNotification(
      `${action === "desativar" ? "Desativando" : "Ativando"} usuário...`,
      "info"
    );
    setTimeout(() => {
      user.status = user.status === "active" ? "inactive" : "active";
      showNotification(
        `Usuário ${
          action === "desativar" ? "desativado" : "ativado"
        } com sucesso!`,
        "success"
      );

      // Refresh the list if modal is open
      if (
        document.getElementById("viewAllUsersModal").classList.contains("show")
      ) {
        filterUsersList();
      }
    }, 1500);
  }
}

// Vehicles Section JavaScript Functions
function initVehiclesChart() {
  const ctx = document.getElementById("vehicles-chart");
  if (!ctx) return;

  // Clear any existing chart
  const existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }

  const vehiclesData = {
    all: {
      labels: ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
      utilization: [85, 88, 92, 87, 91, 89.2],
      consumption: [9.8, 10.2, 10.8, 10.1, 10.6, 10.8],
      maintenance: [8.5, 7.2, 12.3, 9.8, 6.4, 8.1],
      distance: [1240, 1380, 1450, 1320, 1520, 1560],
    },
    available: {
      labels: ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
      utilization: [88, 92, 95, 89, 94, 92.5],
      consumption: [9.9, 10.3, 11.0, 10.2, 10.7, 10.9],
      maintenance: [5.2, 4.8, 6.1, 5.5, 4.2, 5.3],
      distance: [1180, 1320, 1390, 1260, 1450, 1480],
    },
    maintenance: {
      labels: ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
      utilization: [45, 52, 48, 58, 61, 55],
      consumption: [8.5, 8.8, 9.2, 8.9, 9.1, 9.3],
      maintenance: [85.2, 78.3, 92.1, 88.5, 75.8, 82.4],
      distance: [520, 580, 610, 590, 630, 650],
    },
    "category-a": {
      labels: ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
      utilization: [78, 82, 85, 80, 84, 82.5],
      consumption: [15.2, 15.8, 16.1, 15.5, 16.0, 16.2],
      maintenance: [12.1, 10.5, 15.2, 13.8, 9.8, 11.5],
      distance: [890, 950, 1020, 940, 1080, 1120],
    },
    "category-b": {
      labels: ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
      utilization: [88, 91, 95, 90, 94, 92.1],
      consumption: [9.1, 9.5, 9.8, 9.3, 9.7, 9.9],
      maintenance: [7.2, 6.1, 10.8, 8.5, 5.2, 6.8],
      distance: [1350, 1430, 1520, 1380, 1590, 1620],
    },
  };

  const currentFilter =
    document.getElementById("vehicles-filter")?.value || "all";
  const data = vehiclesData[currentFilter];

  vehiclesChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Utilização (%)",
          data: data.utilization,
          borderColor: "#667eea",
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#667eea",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: "Consumo Médio (km/L)",
          data: data.consumption,
          borderColor: "#43e97b",
          backgroundColor: "rgba(67, 233, 123, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#43e97b",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          yAxisID: "y1",
        },
        {
          label: "Tempo Manutenção (h)",
          data: data.maintenance,
          borderColor: "#f72585",
          backgroundColor: "rgba(247, 37, 133, 0.1)",
          borderWidth: 2,
          borderDash: [8, 4],
          fill: false,
          tension: 0.4,
          pointBackgroundColor: "#f72585",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          yAxisID: "y2",
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
      plugins: {
        legend: {
          labels: {
            color: "#e0e0e0",
            font: {
              size: 13,
              weight: 500,
            },
            usePointStyle: true,
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: "rgba(30, 30, 46, 0.95)",
          titleColor: "#fff",
          bodyColor: "#ddd",
          borderColor: "rgba(102, 126, 234, 0.5)",
          borderWidth: 1,
          cornerRadius: 12,
          displayColors: true,
          callbacks: {
            afterBody: function (context) {
              const index = context[0].dataIndex;
              return `Km Percorridos: ${data.distance[index]} km`;
            },
          },
        },
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
          type: "linear",
          display: true,
          position: "left",
          beginAtZero: true,
          max: 100,
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
            drawBorder: false,
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: {
              size: 11,
            },
            callback: function (value) {
              return value + "%";
            },
          },
          title: {
            display: true,
            text: "Utilização (%)",
            color: "#667eea",
            font: {
              size: 12,
              weight: 600,
            },
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          min: 8,
          max: 18,
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: {
              size: 11,
            },
            callback: function (value) {
              return value + " km/L";
            },
          },
          title: {
            display: true,
            text: "Consumo (km/L)",
            color: "#43e97b",
            font: {
              size: 12,
              weight: 600,
            },
          },
        },
        y2: {
          type: "linear",
          display: false,
          min: 0,
          max: 100,
        },
      },
    },
  });
}

// Function to update vehicles chart filter
function updateVehiclesChart() {
  initVehiclesChart();
}

function searchVehicles(searchTerm) {
  const vehicleItems = document.querySelectorAll(".vehicle-item");
  const lowerSearchTerm = searchTerm.toLowerCase();

  vehicleItems.forEach((item) => {
    const model =
      item.querySelector(".vehicle-model strong")?.textContent?.toLowerCase() ||
      "";
    const plate =
      item.querySelector(".vehicle-plate")?.textContent?.toLowerCase() || "";
    const category =
      item.querySelector(".vehicle-category")?.textContent?.toLowerCase() || "";

    const matches =
      model.includes(lowerSearchTerm) ||
      plate.includes(lowerSearchTerm) ||
      category.includes(lowerSearchTerm);

    item.style.display = matches ? "flex" : "none";
  });

  // Show notification if no results
  const visibleItems = document.querySelectorAll(
    '.vehicle-item[style*="flex"]'
  );
  if (visibleItems.length === 0 && searchTerm.length > 0) {
    showNotification(
      "Nenhum veículo encontrado com os critérios de busca.",
      "warning"
    );
  }
}

function filterVehicles(filterValue) {
  const vehicleItems = document.querySelectorAll(".vehicle-item");

  vehicleItems.forEach((item) => {
    let shouldShow = true;

    if (filterValue === "all") {
      shouldShow = true;
    } else if (filterValue === "available") {
      shouldShow = item.classList.contains("available");
    } else if (filterValue === "busy") {
      shouldShow = item.classList.contains("busy");
    } else if (filterValue === "maintenance") {
      shouldShow = item.classList.contains("maintenance");
    } else if (filterValue.startsWith("category-")) {
      const category = filterValue.replace("category-", "");
      shouldShow = item.classList.contains(`category-${category}`);
    }

    item.style.display = shouldShow ? "flex" : "none";
  });
}

// Vehicle management functions
function viewVehicleDetails(vehicleId) {
  showNotification(`Carregando detalhes do veículo ${vehicleId}...`, "info");
  // Here you would open a modal or navigate to vehicle details page
}

function editVehicle(vehicleId) {
  showNotification(`Editando veículo ${vehicleId}...`, "info");
  // Here you would open edit modal
}

function scheduleVehicleMaintenance(vehicleId) {
  showNotification(`Agendando manutenção para veículo ${vehicleId}...`, "info");
  // Here you would open maintenance scheduling modal
}

function viewVehicleHistory(vehicleId) {
  showNotification(`Carregando histórico do veículo ${vehicleId}...`, "info");
  // Here you would show vehicle history
}

function updateMaintenanceStatus(vehicleId) {
  showNotification(
    `Atualizando status de manutenção do veículo ${vehicleId}...`,
    "info"
  );
  // Here you would update maintenance status
}

function contactMechanic(vehicleId) {
  showNotification(
    `Entrando em contato com a oficina sobre o veículo ${vehicleId}...`,
    "info"
  );
  // Here you would initiate contact with mechanic
}

function viewCurrentLesson(vehicleId) {
  showNotification(
    `Visualizando aula atual do veículo ${vehicleId}...`,
    "info"
  );
  // Here you would show current lesson details
}

function trackVehicle(vehicleId) {
  showNotification(`Rastreando localização do veículo ${vehicleId}...`, "info");
  // Here you would show vehicle tracking
}

function assignVehicleToLesson(vehicleId) {
  showNotification(`Agendando veículo ${vehicleId} para nova aula...`, "info");
  // Here you would open lesson assignment modal
}

function generateVehiclesReport() {
  showNotification("Gerando relatório de veículos...", "info");
  // Here you would generate and download vehicles report
}

function exportVehiclesChart() {
  showNotification("Exportando gráfico de utilização da frota...", "info");
  // Here you would export the chart
}

function fullscreenVehiclesChart() {
  showNotification("Expandindo gráfico em tela cheia...", "info");
  // Here you would show chart in fullscreen
}

function viewAllVehicles() {
  openModal("viewAllVehiclesModal");
  loadAllVehiclesData();
}

function viewVehicleCategoryDetails() {
  console.log("Opening vehicle category details...");
  showNotification("Abrindo detalhes das categorias de veículos...", "info");
  // Here you would open a modal with detailed category information
}

// Sample vehicle data for demonstration
const allVehiclesData = [
  {
    id: 1,
    plate: "ABC-1234",
    brand: "Volkswagen",
    model: "Gol",
    year: 2022,
    type: "car",
    status: "available",
    mileage: 25000,
    fuelType: "Flex",
    lastMaintenance: "2024-06-15",
    nextMaintenance: "2024-09-15",
  },
  {
    id: 2,
    plate: "DEF-5678",
    brand: "Hyundai",
    model: "HB20",
    year: 2023,
    type: "car",
    status: "in-use",
    mileage: 15000,
    fuelType: "Flex",
    lastMaintenance: "2024-07-20",
    nextMaintenance: "2024-10-20",
  },
  {
    id: 3,
    plate: "GHI-9012",
    brand: "Honda",
    model: "CG 160",
    year: 2021,
    type: "motorcycle",
    status: "maintenance",
    mileage: 18000,
    fuelType: "Gasolina",
    lastMaintenance: "2024-08-01",
    nextMaintenance: "2024-11-01",
  },
  {
    id: 4,
    plate: "JKL-3456",
    brand: "Toyota",
    model: "Corolla",
    year: 2023,
    type: "car",
    status: "available",
    mileage: 12000,
    fuelType: "Flex",
    lastMaintenance: "2024-05-10",
    nextMaintenance: "2024-08-10",
  },
];

function loadAllVehiclesData() {
  const container = document.getElementById("vehiclesListContainer");

  container.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--primary-color, #007bff);"></i>
          <p style="margin-top: 10px;">Carregando lista de veículos...</p>
        </div>
      `;

  setTimeout(() => {
    renderVehiclesList(allVehiclesData);
  }, 800);
}

function renderVehiclesList(vehicles) {
  const container = document.getElementById("vehiclesListContainer");

  if (vehicles.length === 0) {
    container.innerHTML = `
          <div style="padding: 40px; text-align: center;">
            <i class="fas fa-car" style="font-size: 48px; color: var(--text-muted, #6c757d); margin-bottom: 15px;"></i>
            <h4 style="color: var(--text-muted, #6c757d); margin-bottom: 10px;">Nenhum veículo encontrado</h4>
            <p style="color: var(--text-muted, #6c757d);">Tente ajustar os filtros de busca</p>
          </div>
        `;
    return;
  }

  const vehiclesHtml = vehicles
    .map((vehicle) => {
      const statusClass =
        vehicle.status === "available"
          ? "success"
          : vehicle.status === "in-use"
          ? "warning"
          : "danger";
      const statusText =
        vehicle.status === "available"
          ? "Disponível"
          : vehicle.status === "in-use"
          ? "Em uso"
          : "Manutenção";

      const typeIcon = vehicle.type === "car" ? "fa-car" : "fa-motorcycle";
      const typeText = vehicle.type === "car" ? "Carro" : "Moto";

      return `
          <div class="vehicle-item" style="
            display: flex; 
            align-items: center; 
            padding: 15px 20px; 
            border-bottom: 1px solid var(--border-color, #e0e0e0);
            transition: background-color 0.2s ease;
          " onmouseover="this.style.backgroundColor='var(--background-hover, #f8f9fa)'" 
             onmouseout="this.style.backgroundColor='transparent'">
            
            <div style="
              width: 50px; 
              height: 50px; 
              background: linear-gradient(135deg, var(--warning-color, #ffc107), var(--info-color, #17a2b8)); 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-weight: bold; 
              font-size: 18px;
              margin-right: 15px;
            ">
              <i class="fas ${typeIcon}"></i>
            </div>

            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                <h4 style="margin: 0; color: var(--text-primary, #333);">${
                  vehicle.plate
                } - ${vehicle.brand} ${vehicle.model}</h4>
                <span class="status-badge status-${statusClass}" style="
                  padding: 4px 8px; 
                  border-radius: 12px; 
                  font-size: 12px; 
                  font-weight: 500;
                  background-color: ${
                    statusClass === "success"
                      ? "#d4edda"
                      : statusClass === "warning"
                      ? "#fff3cd"
                      : "#f8d7da"
                  };
                  color: ${
                    statusClass === "success"
                      ? "#155724"
                      : statusClass === "warning"
                      ? "#856404"
                      : "#721c24"
                  };
                ">
                  ${statusText}
                </span>
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 8px;">
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas ${typeIcon}" style="width: 16px;"></i> ${typeText}
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-calendar" style="width: 16px;"></i> ${
                    vehicle.year
                  }
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-tachometer-alt" style="width: 16px;"></i> ${vehicle.mileage.toLocaleString()} km
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-gas-pump" style="width: 16px;"></i> ${
                    vehicle.fuelType
                  }
                </small>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-wrench" style="width: 16px;"></i> Últ. manutenção: ${
                    vehicle.lastMaintenance
                  }
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-clock" style="width: 16px;"></i> Próx. manutenção: ${
                    vehicle.nextMaintenance
                  }
                </small>
              </div>
            </div>

            <div style="display: flex; gap: 8px; margin-left: 15px;">
              <button class="btn btn-sm btn-outline-primary" 
                      onclick="viewVehicleDetails(${vehicle.id})" 
                      title="Ver Detalhes"
                      style="padding: 6px 10px; border-radius: 6px;">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline-success" 
                      onclick="editVehicle(${vehicle.id})" 
                      title="Editar"
                      style="padding: 6px 10px; border-radius: 6px;">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline-info" 
                      onclick="scheduleVehicleMaintenance(${vehicle.id})" 
                      title="Agendar Manutenção"
                      style="padding: 6px 10px; border-radius: 6px;">
                <i class="fas fa-wrench"></i>
              </button>
            </div>
          </div>
        `;
    })
    .join("");

  container.innerHTML = vehiclesHtml;
}

function filterVehiclesList() {
  const searchTerm = document
    .getElementById("vehicleSearchInput")
    .value.toLowerCase();
  const statusFilter = document.getElementById("vehicleStatusFilter").value;
  const typeFilter = document.getElementById("vehicleTypeFilter").value;

  const filteredVehicles = allVehiclesData.filter((vehicle) => {
    const matchesSearch =
      !searchTerm ||
      vehicle.plate.toLowerCase().includes(searchTerm) ||
      vehicle.brand.toLowerCase().includes(searchTerm) ||
      vehicle.model.toLowerCase().includes(searchTerm);

    const matchesStatus = !statusFilter || vehicle.status === statusFilter;
    const matchesType = !typeFilter || vehicle.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  renderVehiclesList(filteredVehicles);
}

// Schedule Section JavaScript Functions
function initScheduleChart() {
  const ctx = document.getElementById("schedule-chart");
  if (!ctx) return;

  scheduleChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      datasets: [
        {
          label: "Aulas Teóricas",
          data: [8, 6, 7, 9, 8, 5],
          backgroundColor: "rgba(79, 172, 254, 0.8)",
          borderColor: "#4facfe",
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: "Aulas Práticas",
          data: [12, 10, 11, 13, 12, 8],
          backgroundColor: "rgba(67, 233, 123, 0.8)",
          borderColor: "#43e97b",
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#e0e0e0",
            font: {
              size: 11,
              weight: 500,
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: "#e0e0e0",
            font: {
              size: 10,
            },
          },
        },
        y: {
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: "#e0e0e0",
            font: {
              size: 10,
            },
            stepSize: 2,
          },
        },
      },
    },
  });
}

function searchLessons(searchTerm) {
  const lessonItems = document.querySelectorAll(".lesson-item");
  const lowerSearchTerm = searchTerm.toLowerCase();

  lessonItems.forEach((item) => {
    const studentName =
      item
        .querySelector(".lesson-student-name strong")
        ?.textContent?.toLowerCase() || "";
    const instructorName =
      item
        .querySelector(".lesson-instructor-info span")
        ?.textContent?.toLowerCase() || "";
    const category =
      item.querySelector(".lesson-category")?.textContent?.toLowerCase() || "";

    const matches =
      studentName.includes(lowerSearchTerm) ||
      instructorName.includes(lowerSearchTerm) ||
      category.includes(lowerSearchTerm);

    item.style.display = matches ? "flex" : "none";
  });

  // Show notification if no results
  const visibleItems = document.querySelectorAll('.lesson-item[style*="flex"]');
  if (visibleItems.length === 0 && searchTerm.length > 0) {
    showNotification(
      "Nenhuma aula encontrada com os critérios de busca.",
      "warning"
    );
  }
}

function filterLessons(filterValue) {
  const lessonItems = document.querySelectorAll(".lesson-item");

  lessonItems.forEach((item) => {
    let shouldShow = true;

    if (filterValue === "all") {
      shouldShow = true;
    } else if (filterValue === "today") {
      const dateElement = item.querySelector(".lesson-date");
      shouldShow =
        dateElement && dateElement.textContent.toLowerCase().includes("hoje");
    } else if (filterValue === "theoretical") {
      shouldShow = item.classList.contains("theoretical");
    } else if (filterValue === "practical") {
      shouldShow = item.classList.contains("practical");
    } else if (filterValue === "scheduled") {
      shouldShow = item.classList.contains("scheduled");
    } else if (filterValue === "in-progress") {
      shouldShow = item.classList.contains("in-progress");
    } else if (filterValue === "completed") {
      shouldShow = item.classList.contains("completed");
    }

    item.style.display = shouldShow ? "flex" : "none";
  });
}

// Lesson management functions
function startLesson(lessonId) {
  showNotification(`Iniciando aula ${lessonId}...`, "info");
  // Here you would start the lesson
}

function endLesson(lessonId) {
  showNotification(`Finalizando aula ${lessonId}...`, "info");
  // Here you would end the lesson
}

function pauseLesson(lessonId) {
  showNotification(`Pausando aula ${lessonId}...`, "info");
  // Here you would pause the lesson
}

function editLesson(lessonId) {
  showNotification(`Editando aula ${lessonId}...`, "info");
  // Here you would open edit modal
}

function cancelLesson(lessonId) {
  if (confirm("Tem certeza que deseja cancelar esta aula?")) {
    showNotification(`Cancelando aula ${lessonId}...`, "warning");
    // Here you would cancel the lesson
  }
}

function rescheduleLesson(lessonId) {
  showNotification(`Reagendando aula ${lessonId}...`, "info");
  // Here you would open reschedule modal
}

function viewLessonDetails(lessonId) {
  showNotification(`Carregando detalhes da aula ${lessonId}...`, "info");
  // Here you would show lesson details
}

function viewLessonReport(lessonId) {
  showNotification(`Carregando relatório da aula ${lessonId}...`, "info");
  // Here you would show lesson report
}

function scheduleNextLesson(lessonId) {
  showNotification(
    `Agendando próxima aula para o aluno da aula ${lessonId}...`,
    "info"
  );
  // Here you would schedule next lesson
}

function downloadCertificate(lessonId) {
  showNotification(`Baixando certificado da aula ${lessonId}...`, "info");
  // Here you would download certificate
}

function prepareExam(lessonId) {
  showNotification(
    `Preparando exame para o aluno da aula ${lessonId}...`,
    "info"
  );
  // Here you would prepare exam
}

function contactInstructor(lessonId) {
  showNotification(
    `Entrando em contato com o instrutor da aula ${lessonId}...`,
    "info"
  );
  // Here you would contact instructor
}

function generateScheduleReport() {
  showNotification("Gerando relatório de agenda...", "info");
  // Here you would generate and download schedule report
}

function printSchedule() {
  showNotification("Preparando impressão da agenda...", "info");
  // Here you would print the schedule
}

function viewAllLessons() {
  openModal("viewAllLessonsModal");
  loadAllLessonsData();
}

// Sample lessons data for demonstration
const allLessonsData = [
  {
    id: 1,
    studentName: "Ana Silva",
    instructorName: "Carlos Santos",
    date: "2024-08-30",
    time: "08:00",
    duration: 60,
    type: "practical",
    vehicle: "ABC-1234",
    location: "Centro",
    status: "scheduled",
    category: "Categoria B",
    notes: "Primeira aula prática",
  },
  {
    id: 2,
    studentName: "Bruno Costa",
    instructorName: "Maria Oliveira",
    date: "2024-08-30",
    time: "10:00",
    duration: 45,
    type: "theoretical",
    vehicle: null,
    location: "Sala 2",
    status: "in-progress",
    category: "Categoria A",
    notes: "Legislação de trânsito",
  },
  {
    id: 3,
    studentName: "Carla Mendes",
    instructorName: "João Pereira",
    date: "2024-08-30",
    time: "14:00",
    duration: 60,
    type: "practical",
    vehicle: "DEF-5678",
    location: "Rua das Flores",
    status: "completed",
    category: "Categoria B",
    notes: "Aula de baliza",
  },
  {
    id: 4,
    studentName: "Daniel Santos",
    instructorName: "Carlos Santos",
    date: "2024-08-31",
    time: "09:00",
    duration: 60,
    type: "practical",
    vehicle: "ABC-1234",
    location: "Centro",
    status: "scheduled",
    category: "Categoria B",
    notes: "Aula de direção defensiva",
  },
  {
    id: 5,
    studentName: "Elena Rodrigues",
    instructorName: "Ana Paula",
    date: "2024-08-31",
    time: "11:00",
    duration: 30,
    type: "exam",
    vehicle: "GHI-9012",
    location: "Detran",
    status: "scheduled",
    category: "Categoria A",
    notes: "Exame prático",
  },
  {
    id: 6,
    studentName: "Felipe Lima",
    instructorName: "Roberto Silva",
    date: "2024-08-31",
    time: "16:00",
    duration: 45,
    type: "theoretical",
    vehicle: null,
    location: "Sala 1",
    status: "cancelled",
    category: "Categoria B",
    notes: "Primeiros socorros",
  },
];

function loadAllLessonsData() {
  const container = document.getElementById("lessonsListContainer");

  container.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--primary-color, #007bff);"></i>
          <p style="margin-top: 10px;">Carregando lista de aulas...</p>
        </div>
      `;

  setTimeout(() => {
    renderLessonsList(allLessonsData);
  }, 800);
}

function renderLessonsList(lessons) {
  const container = document.getElementById("lessonsListContainer");

  if (lessons.length === 0) {
    container.innerHTML = `
          <div style="padding: 40px; text-align: center;">
            <i class="fas fa-graduation-cap" style="font-size: 48px; color: var(--text-muted, #6c757d); margin-bottom: 15px;"></i>
            <h4 style="color: var(--text-muted, #6c757d); margin-bottom: 10px;">Nenhuma aula encontrada</h4>
            <p style="color: var(--text-muted, #6c757d);">Tente ajustar os filtros de busca</p>
          </div>
        `;
    return;
  }

  const lessonsHtml = lessons
    .map((lesson) => {
      const statusClass =
        lesson.status === "completed"
          ? "success"
          : lesson.status === "in-progress"
          ? "info"
          : lesson.status === "scheduled"
          ? "warning"
          : "danger";
      const statusText =
        lesson.status === "completed"
          ? "Concluída"
          : lesson.status === "in-progress"
          ? "Em andamento"
          : lesson.status === "scheduled"
          ? "Agendada"
          : "Cancelada";

      const typeIcon =
        lesson.type === "practical"
          ? "fa-car"
          : lesson.type === "theoretical"
          ? "fa-book"
          : "fa-clipboard-check";
      const typeText =
        lesson.type === "practical"
          ? "Prática"
          : lesson.type === "theoretical"
          ? "Teórica"
          : "Exame";

      const lessonDate = new Date(lesson.date + "T" + lesson.time);
      const formattedDate = lessonDate.toLocaleDateString("pt-BR");
      const formattedTime = lesson.time;

      return `
          <div class="lesson-item" style="
            display: flex; 
            align-items: center; 
            padding: 15px 20px; 
            border-bottom: 1px solid var(--border-color, #e0e0e0);
            transition: background-color 0.2s ease;
          " onmouseover="this.style.backgroundColor='var(--background-hover, #f8f9fa)'" 
             onmouseout="this.style.backgroundColor='transparent'">
            
            <div style="
              width: 50px; 
              height: 50px; 
              background: linear-gradient(135deg, var(--success-color, #28a745), var(--info-color, #17a2b8)); 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-weight: bold; 
              font-size: 18px;
              margin-right: 15px;
            ">
              <i class="fas ${typeIcon}"></i>
            </div>

            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                <h4 style="margin: 0; color: var(--text-primary, #333);">${
                  lesson.studentName
                } - ${typeText}</h4>
                <span class="status-badge status-${statusClass}" style="
                  padding: 4px 8px; 
                  border-radius: 12px; 
                  font-size: 12px; 
                  font-weight: 500;
                  background-color: ${
                    statusClass === "success"
                      ? "#d4edda"
                      : statusClass === "info"
                      ? "#d1ecf1"
                      : statusClass === "warning"
                      ? "#fff3cd"
                      : "#f8d7da"
                  };
                  color: ${
                    statusClass === "success"
                      ? "#155724"
                      : statusClass === "info"
                      ? "#0c5460"
                      : statusClass === "warning"
                      ? "#856404"
                      : "#721c24"
                  };
                ">
                  ${statusText}
                </span>
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-bottom: 8px;">
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-user-tie" style="width: 16px;"></i> ${
                    lesson.instructorName
                  }
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-calendar" style="width: 16px;"></i> ${formattedDate}
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-clock" style="width: 16px;"></i> ${formattedTime}
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-hourglass-half" style="width: 16px;"></i> ${
                    lesson.duration
                  } min
                </small>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-id-card" style="width: 16px;"></i> ${
                    lesson.category
                  }
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-map-marker-alt" style="width: 16px;"></i> ${
                    lesson.location
                  }
                </small>
                ${
                  lesson.vehicle
                    ? `
                  <small style="color: var(--text-secondary, #6c757d);">
                    <i class="fas fa-car" style="width: 16px;"></i> ${lesson.vehicle}
                  </small>
                `
                    : ""
                }
                ${
                  lesson.notes
                    ? `
                  <small style="color: var(--text-secondary, #6c757d);">
                    <i class="fas fa-sticky-note" style="width: 16px;"></i> ${lesson.notes}
                  </small>
                `
                    : ""
                }
              </div>
            </div>

            <div style="display: flex; gap: 8px; margin-left: 15px;">
              <button class="btn btn-sm btn-outline-primary" 
                      onclick="viewLessonDetails(${lesson.id})" 
                      title="Ver Detalhes"
                      style="padding: 6px 10px; border-radius: 6px;">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline-success" 
                      onclick="editLesson(${lesson.id})" 
                      title="Editar"
                      style="padding: 6px 10px; border-radius: 6px;">
                <i class="fas fa-edit"></i>
              </button>
              ${
                lesson.status === "scheduled"
                  ? `
                <button class="btn btn-sm btn-outline-warning" 
                        onclick="startLesson(${lesson.id})" 
                        title="Iniciar Aula"
                        style="padding: 6px 10px; border-radius: 6px;">
                  <i class="fas fa-play"></i>
                </button>
              `
                  : ""
              }
              ${
                lesson.status === "in-progress"
                  ? `
                <button class="btn btn-sm btn-outline-danger" 
                        onclick="completeLesson(${lesson.id})" 
                        title="Finalizar Aula"
                        style="padding: 6px 10px; border-radius: 6px;">
                  <i class="fas fa-stop"></i>
                </button>
              `
                  : ""
              }
            </div>
          </div>
        `;
    })
    .join("");

  container.innerHTML = lessonsHtml;
}

function filterLessonsList() {
  const searchTerm = document
    .getElementById("lessonSearchInput")
    .value.toLowerCase();
  const statusFilter = document.getElementById("lessonStatusFilter").value;
  const typeFilter = document.getElementById("lessonTypeFilter").value;

  const filteredLessons = allLessonsData.filter((lesson) => {
    const matchesSearch =
      !searchTerm ||
      lesson.studentName.toLowerCase().includes(searchTerm) ||
      lesson.instructorName.toLowerCase().includes(searchTerm) ||
      lesson.category.toLowerCase().includes(searchTerm) ||
      lesson.location.toLowerCase().includes(searchTerm);

    const matchesStatus = !statusFilter || lesson.status === statusFilter;
    const matchesType = !typeFilter || lesson.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  renderLessonsList(filteredLessons);
}

// Add event listeners for schedule section
document.addEventListener("DOMContentLoaded", function () {
  // Initialize schedule chart
  setTimeout(initScheduleChart, 400);

  // Search functionality for lessons
  const lessonSearchInput = document.querySelector(
    ".schedule-management .search-input"
  );
  if (lessonSearchInput) {
    lessonSearchInput.addEventListener("input", function (e) {
      searchLessons(e.target.value);
    });
  }

  // Filter functionality for lessons
  const lessonFilterSelect = document.querySelector(
    ".schedule-management .filter-select"
  );
  if (lessonFilterSelect) {
    lessonFilterSelect.addEventListener("change", function (e) {
      filterLessons(e.target.value);
    });
  }

  // Date selector functionality
  const dateSelector = document.querySelector(
    ".schedule-timeline-chart .date-selector"
  );
  if (dateSelector) {
    dateSelector.addEventListener("change", function (e) {
      showNotification(
        `Carregando cronograma para ${
          e.target.options[e.target.selectedIndex].text
        }...`,
        "info"
      );
      // Here you would update the timeline with new data
    });
  }

  // Timeline lesson block click handlers
  const lessonBlocks = document.querySelectorAll(".lesson-block");
  lessonBlocks.forEach((block) => {
    block.addEventListener("click", function () {
      const studentName = this.querySelector(".lesson-student").textContent;
      showNotification(
        `Visualizando detalhes da aula de ${studentName}...`,
        "info"
      );
      // Here you would show lesson details
    });
  });
});

// Add event listeners for vehicles section
document.addEventListener("DOMContentLoaded", function () {
  // Initialize vehicles chart
  setTimeout(initVehiclesChart, 300);

  // Search functionality for vehicles
  const vehicleSearchInput = document.querySelector(
    ".vehicles-management .search-input"
  );
  if (vehicleSearchInput) {
    vehicleSearchInput.addEventListener("input", function (e) {
      searchVehicles(e.target.value);
    });
  }

  // Filter functionality for vehicles
  const vehicleFilterSelect = document.querySelector(
    ".vehicles-management .filter-select"
  );
  if (vehicleFilterSelect) {
    vehicleFilterSelect.addEventListener("change", function (e) {
      filterVehicles(e.target.value);
    });
  }

  // Chart filter functionality
  const vehicleChartFilter = document.querySelector(
    ".vehicles-usage-chart .chart-filter"
  );
  if (vehicleChartFilter) {
    vehicleChartFilter.addEventListener("change", function (e) {
      showNotification(
        `Atualizando gráfico de veículos para ${
          e.target.options[e.target.selectedIndex].text
        }...`,
        "info"
      );
      // Here you would update the chart with new data
    });
  }
});

// ===== REPORTS FUNCTIONS =====

function scheduleReport() {
  showNotification(
    "Abrindo configurador de agendamento de relatórios...",
    "info"
  );
  // Here you would open the schedule report modal
}

function createTemplate() {
  showNotification("Abrindo criador de modelos de relatórios...", "info");
  // Here you would open the template creator modal
}

function generateReport(type) {
  let reportName = "";
  switch (type) {
    case "financial-complete":
      reportName = "Relatório Financeiro Completo";
      break;
    case "students-performance":
      reportName = "Desempenho dos Alunos";
      break;
    case "operational":
      reportName = "Relatório Operacional";
      break;
    case "exams-analysis":
      reportName = "Análise de Exames";
      break;
    default:
      reportName = "Relatório";
  }

  showNotification(`Gerando ${reportName}...`, "success");

  // Simulate report generation progress
  setTimeout(() => {
    showNotification(`${reportName} gerado com sucesso!`, "success");
  }, 3000);
}

function editTemplate(templateId) {
  showNotification(`Editando modelo ${templateId}...`, "info");
  // Here you would open the template editor
}

function scheduleTemplate(templateId) {
  showNotification(
    `Configurando agendamento para modelo ${templateId}...`,
    "info"
  );
  // Here you would open the schedule configuration
}

function viewAllReports() {
  openModal("viewAllReportsModal");
  loadAllReportsData();
}

// Sample reports data for demonstration
const allReportsData = [
  {
    id: 1,
    title: "Relatório Mensal de Receitas",
    description: "Análise completa das receitas do mês de Agosto/2024",
    type: "financial",
    category: "revenue",
    status: "completed",
    createdDate: "2024-08-30",
    createdTime: "09:00",
    generatedBy: "Carlos Santos",
    size: "2.5 MB",
    format: "PDF",
    period: "Agosto 2024",
    downloads: 15,
    lastAccess: "2024-08-30",
  },
  {
    id: 2,
    title: "Performance dos Instrutores",
    description: "Avaliação de desempenho dos instrutores no período",
    type: "performance",
    category: "instructors",
    status: "completed",
    createdDate: "2024-08-28",
    createdTime: "14:30",
    generatedBy: "Maria Oliveira",
    size: "1.8 MB",
    format: "Excel",
    period: "Agosto 2024",
    downloads: 8,
    lastAccess: "2024-08-29",
  },
  {
    id: 3,
    title: "Taxa de Aprovação por Categoria",
    description: "Estatísticas de aprovação nos exames por categoria de CNH",
    type: "statistics",
    category: "exams",
    status: "processing",
    createdDate: "2024-08-30",
    createdTime: "16:00",
    generatedBy: "João Pereira",
    size: null,
    format: "PDF",
    period: "Trimestre Q3 2024",
    downloads: 0,
    lastAccess: null,
  },
  {
    id: 4,
    title: "Relatório de Veículos e Manutenção",
    description: "Estado dos veículos, custos de manutenção e quilometragem",
    type: "operational",
    category: "vehicles",
    status: "completed",
    createdDate: "2024-08-25",
    createdTime: "11:20",
    generatedBy: "Ana Paula",
    size: "3.2 MB",
    format: "PDF",
    period: "Agosto 2024",
    downloads: 12,
    lastAccess: "2024-08-30",
  },
  {
    id: 5,
    title: "Fluxo de Caixa Semanal",
    description: "Análise detalhada do fluxo de caixa semanal",
    type: "financial",
    category: "cash_flow",
    status: "scheduled",
    createdDate: "2024-08-31",
    createdTime: "08:00",
    generatedBy: "Roberto Silva",
    size: null,
    format: "Excel",
    period: "Semana 35/2024",
    downloads: 0,
    lastAccess: null,
  },
  {
    id: 6,
    title: "Progresso dos Alunos",
    description: "Relatório detalhado do progresso de todos os alunos ativos",
    type: "academic",
    category: "students",
    status: "completed",
    createdDate: "2024-08-29",
    createdTime: "10:15",
    generatedBy: "Carlos Santos",
    size: "4.1 MB",
    format: "PDF",
    period: "Agosto 2024",
    downloads: 22,
    lastAccess: "2024-08-30",
  },
];

function loadAllReportsData() {
  const container = document.getElementById("reportsListContainer");

  container.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--primary-color, #007bff);"></i>
          <p style="margin-top: 10px;">Carregando lista de relatórios...</p>
        </div>
      `;

  setTimeout(() => {
    renderReportsList(allReportsData);
  }, 800);
}

function renderReportsList(reports) {
  const container = document.getElementById("reportsListContainer");

  if (reports.length === 0) {
    container.innerHTML = `
          <div style="padding: 40px; text-align: center;">
            <i class="fas fa-chart-bar" style="font-size: 48px; color: var(--text-muted, #6c757d); margin-bottom: 15px;"></i>
            <h4 style="color: var(--text-muted, #6c757d); margin-bottom: 10px;">Nenhum relatório encontrado</h4>
            <p style="color: var(--text-muted, #6c757d);">Tente ajustar os filtros de busca</p>
          </div>
        `;
    return;
  }

  const reportsHtml = reports
    .map((report) => {
      const statusClass =
        report.status === "completed"
          ? "success"
          : report.status === "processing"
          ? "info"
          : report.status === "scheduled"
          ? "warning"
          : "danger";
      const statusText =
        report.status === "completed"
          ? "Concluído"
          : report.status === "processing"
          ? "Processando"
          : report.status === "scheduled"
          ? "Agendado"
          : "Erro";

      const typeIcons = {
        financial: "fa-dollar-sign",
        performance: "fa-chart-line",
        statistics: "fa-chart-pie",
        operational: "fa-cogs",
        academic: "fa-graduation-cap",
      };

      const typeIcon = typeIcons[report.type] || "fa-file-alt";

      const reportDate = new Date(
        report.createdDate + "T" + report.createdTime
      );
      const formattedDate = reportDate.toLocaleDateString("pt-BR");
      const formattedTime = report.createdTime;

      return `
          <div class="report-item" style="
            display: flex; 
            align-items: center; 
            padding: 15px 20px; 
            border-bottom: 1px solid var(--border-color, #e0e0e0);
            transition: background-color 0.2s ease;
          " onmouseover="this.style.backgroundColor='var(--background-hover, #f8f9fa)'" 
             onmouseout="this.style.backgroundColor='transparent'">
            
            <div style="
              width: 50px; 
              height: 50px; 
              background: linear-gradient(135deg, var(--info-color, #17a2b8), var(--primary-color, #007bff)); 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-weight: bold; 
              font-size: 18px;
              margin-right: 15px;
            ">
              <i class="fas ${typeIcon}"></i>
            </div>

            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                <h4 style="margin: 0; color: var(--text-primary, #333);">${
                  report.title
                }</h4>
                <span class="status-badge status-${statusClass}" style="
                  padding: 4px 8px; 
                  border-radius: 12px; 
                  font-size: 12px; 
                  font-weight: 500;
                  background-color: ${
                    statusClass === "success"
                      ? "#d4edda"
                      : statusClass === "info"
                      ? "#d1ecf1"
                      : statusClass === "warning"
                      ? "#fff3cd"
                      : "#f8d7da"
                  };
                  color: ${
                    statusClass === "success"
                      ? "#155724"
                      : statusClass === "info"
                      ? "#0c5460"
                      : statusClass === "warning"
                      ? "#856404"
                      : "#721c24"
                  };
                ">
                  ${statusText}
                </span>
              </div>
              
              <p style="margin: 0 0 8px 0; color: var(--text-secondary, #6c757d); font-size: 14px;">
                ${report.description}
              </p>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-bottom: 8px;">
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-user" style="width: 16px;"></i> ${
                    report.generatedBy
                  }
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-calendar" style="width: 16px;"></i> ${formattedDate}
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-clock" style="width: 16px;"></i> ${formattedTime}
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-file" style="width: 16px;"></i> ${
                    report.format
                  }
                </small>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-calendar-alt" style="width: 16px;"></i> ${
                    report.period
                  }
                </small>
                ${
                  report.size
                    ? `
                  <small style="color: var(--text-secondary, #6c757d);">
                    <i class="fas fa-hdd" style="width: 16px;"></i> ${report.size}
                  </small>
                `
                    : ""
                }
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-download" style="width: 16px;"></i> ${
                    report.downloads
                  } downloads
                </small>
                ${
                  report.lastAccess
                    ? `
                  <small style="color: var(--text-secondary, #6c757d);">
                    <i class="fas fa-eye" style="width: 16px;"></i> Último acesso: ${report.lastAccess}
                  </small>
                `
                    : ""
                }
              </div>
            </div>

            <div style="display: flex; gap: 8px; margin-left: 15px;">
              ${
                report.status === "completed"
                  ? `
                <button class="btn btn-sm btn-outline-primary" 
                        onclick="viewReport(${report.id})" 
                        title="Visualizar"
                        style="padding: 6px 10px; border-radius: 6px;">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-info" 
                        onclick="shareReport(${report.id})" 
                        title="Compartilhar"
                        style="padding: 6px 10px; border-radius: 6px;">
                  <i class="fas fa-share"></i>
                </button>
              `
                  : ""
              }
              ${
                report.status === "processing"
                  ? `
                <button class="btn btn-sm btn-outline-warning" 
                        onclick="cancelReportGeneration(${report.id})" 
                        title="Cancelar"
                        style="padding: 6px 10px; border-radius: 6px;">
                  <i class="fas fa-times"></i>
                </button>
              `
                  : ""
              }
              ${
                report.status === "scheduled"
                  ? `
                <button class="btn btn-sm btn-outline-secondary" 
                        onclick="editReportSchedule(${report.id})" 
                        title="Editar Agendamento"
                        style="padding: 6px 10px; border-radius: 6px;">
                  <i class="fas fa-edit"></i>
                </button>
              `
                  : ""
              }
            </div>
          </div>
        `;
    })
    .join("");

  container.innerHTML = reportsHtml;
}

function filterReportsList() {
  const searchTerm = document
    .getElementById("reportSearchInput")
    .value.toLowerCase();
  const statusFilter = document.getElementById("reportStatusFilter").value;
  const typeFilter = document.getElementById("reportTypeFilter").value;

  const filteredReports = allReportsData.filter((report) => {
    const matchesSearch =
      !searchTerm ||
      report.title.toLowerCase().includes(searchTerm) ||
      report.description.toLowerCase().includes(searchTerm) ||
      report.generatedBy.toLowerCase().includes(searchTerm) ||
      report.period.toLowerCase().includes(searchTerm);

    const matchesStatus = !statusFilter || report.status === statusFilter;
    const matchesType = !typeFilter || report.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  renderReportsList(filteredReports);
}

function viewReport(reportId) {
  showNotification(`Abrindo visualização do relatório ${reportId}...`, "info");
  // Here you would open the report viewer
}

function shareReport(reportId) {
  showNotification(`Compartilhando relatório ${reportId}...`, "info");
  // Here you would open the share options
}

function regenerateReport(reportId) {
  showNotification(`Regenerando relatório ${reportId}...`, "info");
  // Here you would regenerate the report
}

function cancelGeneration(reportId) {
  showNotification(`Cancelando geração do relatório ${reportId}...`, "warning");
  // Here you would cancel the report generation
}

function viewProgress(reportId) {
  showNotification(
    `Visualizando progresso do relatório ${reportId}...`,
    "info"
  );
  // Here you would show detailed progress
}

function runNow(reportId) {
  showNotification(`Executando relatório ${reportId} agora...`, "info");
  // Here you would run the scheduled report immediately
}

function editSchedule(reportId) {
  showNotification(`Editando agendamento do relatório ${reportId}...`, "info");
  // Here you would open the schedule editor
}

function pauseSchedule(reportId) {
  showNotification(
    `Pausando agendamento do relatório ${reportId}...`,
    "warning"
  );
  // Here you would pause the scheduled report
}

function scheduleRecurrence(reportId) {
  showNotification(
    `Configurando recorrência do relatório ${reportId}...`,
    "info"
  );
  // Here you would open the recurrence configuration
}

// Reports search and filter functionality
document.addEventListener("DOMContentLoaded", function () {
  // Reports search functionality
  const reportsSearchInput = document.querySelector(
    ".reports-history .search-input"
  );
  if (reportsSearchInput) {
    reportsSearchInput.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      const reportItems = document.querySelectorAll(".report-item");

      reportItems.forEach((item) => {
        const reportName =
          item.querySelector(".report-name")?.textContent.toLowerCase() || "";
        const reportDescription =
          item
            .querySelector(".report-description")
            ?.textContent.toLowerCase() || "";

        if (
          reportName.includes(searchTerm) ||
          reportDescription.includes(searchTerm)
        ) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  }

  // Reports filter functionality
  const reportsFilterSelect = document.querySelector(
    ".reports-history .filter-select"
  );
  if (reportsFilterSelect) {
    reportsFilterSelect.addEventListener("change", function (e) {
      filterReports(e.target.value);
    });
  }

  // Templates filter functionality
  const templatesFilterSelect = document.querySelector(
    ".templates-filters .filter-select"
  );
  if (templatesFilterSelect) {
    templatesFilterSelect.addEventListener("change", function (e) {
      filterTemplates(e.target.value);
    });
  }
});

function filterReports(status) {
  const reportItems = document.querySelectorAll(".report-item");

  reportItems.forEach((item) => {
    if (status === "all") {
      item.style.display = "flex";
    } else {
      const hasStatus = item.classList.contains(status);
      item.style.display = hasStatus ? "flex" : "none";
    }
  });

  showNotification(
    `Filtrando relatórios por: ${status === "all" ? "Todos" : status}`,
    "info"
  );
}

function filterTemplates(type) {
  const templateCards = document.querySelectorAll(".template-card");

  templateCards.forEach((card) => {
    if (type === "all") {
      card.style.display = "block";
    } else {
      const hasType = card.classList.contains(type);
      card.style.display = hasType ? "block" : "none";
    }
  });

  showNotification(
    `Filtrando modelos por: ${type === "all" ? "Todos" : type}`,
    "info"
  );
}

// Settings Functions
function showSettingsTab(tabName) {
  // Remove active class from all tabs and contents
  document.querySelectorAll(".settings-tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelectorAll(".settings-tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  // Add active class to selected tab and content
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");
  document.getElementById(`${tabName}-settings`).classList.add("active");

  showNotification(
    `Exibindo configurações: ${getTabDisplayName(tabName)}`,
    "info"
  );
}

function getTabDisplayName(tabName) {
  const names = {
    general: "Geral",
    users: "Usuários",
    security: "Segurança",
    system: "Sistema",
    appearance: "Aparência",
  };
  return names[tabName] || tabName;
}

function saveAllSettings() {
  showNotification("Salvando todas as configurações...", "info");

  // Simulate save process
  setTimeout(() => {
    showNotification("Configurações salvas com sucesso!", "success");
  }, 1000);
}

function exportSettings() {
  showNotification("Exportando configurações...", "info");

  // Simulate export
  setTimeout(() => {
    showNotification("Configurações exportadas para download!", "success");
  }, 1000);
}

// User Management Functions
function editUser(userId) {
  showNotification(`Editando usuário ID: ${userId}`, "info");
  // Implementation for user editing modal
}

function resetPassword(userId) {
  if (confirm("Tem certeza que deseja redefinir a senha deste usuário?")) {
    showNotification(`Senha redefinida para usuário ID: ${userId}`, "success");
  }
}

function toggleUserStatus(userId) {
  if (confirm("Tem certeza que deseja alterar o status deste usuário?")) {
    showNotification(`Status alterado para usuário ID: ${userId}`, "success");
  }
}

// System Maintenance Functions
function createBackup() {
  showNotification("Iniciando backup do sistema...", "info");

  // Simulate backup process
  setTimeout(() => {
    showNotification("Backup criado com sucesso!", "success");
    // Update backup info in UI
    document.querySelector(".status-time").textContent =
      new Date().toLocaleString("pt-BR");
  }, 2000);
}

function restoreBackup() {
  if (
    confirm(
      "Tem certeza que deseja restaurar um backup? Esta ação não pode ser desfeita."
    )
  ) {
    showNotification("Iniciando restauração...", "warning");

    setTimeout(() => {
      showNotification("Backup restaurado com sucesso!", "success");
    }, 3000);
  }
}

function optimizeDatabase() {
  showNotification("Otimizando banco de dados...", "info");

  setTimeout(() => {
    showNotification("Banco de dados otimizado com sucesso!", "success");
  }, 2000);
}

function clearCache() {
  showNotification("Limpando cache do sistema...", "info");

  setTimeout(() => {
    showNotification("Cache limpo com sucesso!", "success");
  }, 1000);
}

function checkIntegrity() {
  showNotification("Verificando integridade dos dados...", "info");

  setTimeout(() => {
    showNotification(
      "Verificação concluída - Nenhum problema encontrado!",
      "success"
    );
  }, 3000);
}

// Appearance Functions
function selectTheme(theme) {
  // Remove active class from all theme options
  document.querySelectorAll(".theme-option").forEach((option) => {
    option.classList.remove("active");
  });

  // Add active class to selected theme
  event.target.closest(".theme-option").classList.add("active");

  // Apply theme to document
  document.documentElement.setAttribute("data-theme", theme);

  // Save theme preference
  localStorage.setItem("selected-theme", theme);

  showNotification(
    `Tema alterado para: ${
      theme === "light" ? "Claro" : theme === "dark" ? "Escuro" : "Automático"
    }`,
    "success"
  );
}

function uploadLogo() {
  // Create file input for logo upload
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/svg+xml";
  input.onchange = function (e) {
    const file = e.target.files[0];
    if (file) {
      showNotification(`Logo "${file.name}" carregado com sucesso!`, "success");
    }
  };
  input.click();
}

function resetLogo() {
  if (confirm("Tem certeza que deseja restaurar o logo padrão?")) {
    showNotification("Logo restaurado para o padrão!", "success");
  }
}

// JavaScript para o Painel de Perfil do Usuário
(function initUserProfilePanel() {
  console.log("Inicializando painel de perfil do usuário...");

  // Função para abrir o painel
  function openProfilePanel() {
    console.log("Abrindo painel de perfil...");
    const profilePanel = document.getElementById("user-profile-panel");
    const overlay = document.getElementById("overlay");

    if (profilePanel) {
      profilePanel.classList.add("active");
    }
    if (overlay) {
      overlay.classList.add("active");
    }
    document.body.style.overflow = "hidden";
  }

  // Função para fechar o painel
  function closeProfilePanel() {
    console.log("Fechando painel de perfil...");
    const profilePanel = document.getElementById("user-profile-panel");
    const overlay = document.getElementById("overlay");

    if (profilePanel) {
      profilePanel.classList.remove("active");
    }
    if (overlay) {
      overlay.classList.remove("active");
    }
    document.body.style.overflow = "auto";
  }

  // Aguardar o DOM estar carregado
  function setupUserPanel() {
    const userProfile = document.getElementById("user-profile");
    const profilePanel = document.getElementById("user-profile-panel");
    const overlay = document.getElementById("overlay");
    const closeBtn = document.getElementById("close-user-panel");

    console.log("Elementos encontrados:", {
      userProfile: !!userProfile,
      profilePanel: !!profilePanel,
      overlay: !!overlay,
      closeBtn: !!closeBtn,
    });

    // Event listener para abrir o painel
    if (userProfile) {
      userProfile.addEventListener("click", function (e) {
        e.stopPropagation();
        console.log("Clique no perfil do usuário detectado!");
        openProfilePanel();
      });
      console.log("Event listener adicionado ao perfil do usuário");
    } else {
      console.error("Elemento user-profile não encontrado!");
    }

    // Event listener para fechar com o botão X
    if (closeBtn) {
      closeBtn.addEventListener("click", closeProfilePanel);
      console.log("Event listener adicionado ao botão fechar");
    }

    // Event listener para fechar clicando no overlay
    if (overlay) {
      overlay.addEventListener("click", closeProfilePanel);
      console.log("Event listener adicionado ao overlay");
    }

    // Prevenir fechamento ao clicar dentro do painel
    if (profilePanel) {
      profilePanel.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      console.log(
        "Event listener adicionado para prevenir fechamento do painel"
      );
    }

    console.log("Inicialização do painel de perfil concluída");
  }

  // Verificar se o DOM já está carregado ou aguardar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupUserPanel);
  } else {
    setupUserPanel();
  }
})();

// Funções para os itens do menu do painel de perfil
function openUserSettings() {
  showNotification("Abrindo configurações da conta...", "info");
}

function openSecuritySettings() {
  showNotification("Abrindo configurações de segurança...", "info");
}

function openNotificationSettings() {
  showNotification("Abrindo configurações de notificação...", "info");
}

function openAppearanceSettings() {
  showNotification("Abrindo configurações de aparência...", "info");
}

function openBackupSettings() {
  showNotification("Abrindo configurações de backup...", "info");
}

function openHelp() {
  showNotification("Abrindo ajuda e suporte...", "info");
}

function confirmLogout() {
  // Usar modal elegante em vez do confirm nativo
  if (typeof showLogoutModal === "function") {
    showLogoutModal();
  } else {
    // Fallback para confirm nativo se o modal não estiver disponível
    if (confirm("Tem certeza que deseja sair do sistema?")) {
      showNotification("Saindo do sistema...", "warning");
      setTimeout(() => {
        window.location.href = "/logout";
      }, 1500);
    }
  }
}

// Theme Toggle Functionality
(function () {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const themeIcon = document.getElementById("theme-icon");

  // Check for saved theme preference or default to light theme
  const currentTheme = localStorage.getItem("theme") || "light";
  document.body.className = currentTheme + "-theme";
  updateThemeIcon(currentTheme);

  // Add click event listener
  themeToggleBtn.addEventListener("click", function () {
    const isLight = document.body.classList.contains("light-theme");
    const newTheme = isLight ? "dark" : "light";

    // Update body class
    document.body.className = newTheme + "-theme";

    // Save theme preference
    localStorage.setItem("theme", newTheme);

    // Update icon
    updateThemeIcon(newTheme);

    // Show notification
    showNotification(
      `Tema ${newTheme === "light" ? "claro" : "escuro"} ativado`,
      "success"
    );
  });

  function updateThemeIcon(theme) {
    themeIcon.className = theme === "light" ? "fas fa-sun" : "fas fa-moon";
    themeToggleBtn.setAttribute(
      "aria-label",
      theme === "light"
        ? "Alternar para tema escuro"
        : "Alternar para tema claro"
    );
  }
})();

// Update time indicator
let lastUpdateTime = new Date();

function updateTimeIndicator() {
  const now = new Date();
  const diffMinutes = Math.floor((now - lastUpdateTime) / (1000 * 60));
  const timeElement = document.getElementById("last-update");

  if (timeElement) {
    if (diffMinutes < 1) {
      timeElement.textContent = "agora";
    } else if (diffMinutes === 1) {
      timeElement.textContent = "1 min";
    } else if (diffMinutes < 60) {
      timeElement.textContent = diffMinutes + " min";
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      timeElement.textContent = diffHours + "h";
    }
  }
}

// Update time indicator every minute
setInterval(updateTimeIndicator, 60000);

// Reset update time when data changes
function resetUpdateTime() {
  lastUpdateTime = new Date();
  updateTimeIndicator();
}

// Chart Period Selector Functionality - Expandido
(function () {
  const periodButtons = document.querySelectorAll(".period-btn");
  const periodText = document.getElementById("current-period");
  const periodTotal = document.getElementById("period-total");
  const metricsPeriodBadge = document.getElementById("metrics-period-badge");

  // Elementos das métricas
  const theoreticalCount = document.getElementById("theoretical-count");
  const practicalCount = document.getElementById("practical-count");
  const averageCount = document.getElementById("average-count");
  const efficiencyRate = document.getElementById("efficiency-rate");
  const revenueCount = document.getElementById("revenue-lessons");
  const instructorsActive = document.getElementById("instructors-active");

  // Elementos das médias
  const theoreticalAvg = document.getElementById("theoretical-avg");
  const practicalAvg = document.getElementById("practical-avg");
  const averageTarget = document.getElementById("average-target");
  const efficiencyTrend = document.getElementById("efficiency-trend");
  const revenueAvg = document.getElementById("revenue-avg");
  const instructorLoad = document.getElementById("instructor-load");

  // Data expandida para diferentes períodos
  const periodData = {
    "6m": {
      label: "Últimos 6 meses",
      badge: "6 Meses",
      total: "1.240 aulas no total",
      theoretical: 648,
      practical: 592,
      average: 206,
      efficiency: 89,
      revenue: "R$ 86K",
      instructors: 8,
      theoreticalAvg: "108/mês",
      practicalAvg: "99/mês",
      averageTarget: "Meta: 220",
      efficiencyTrend: "Tendência ↗",
      revenueAvg: "R$ 14.3K/mês",
      instructorLoad: "26 aulas/instrutor",
      theoreticalChange: "+8.5%",
      practicalChange: "+12.3%",
      averageChange: "+2.1%",
      efficiencyChange: "+3.2%",
      revenueChange: "+15.7%",
      instructorsChange: "0%",
    },
    "1y": {
      label: "Último ano",
      badge: "1 Ano",
      total: "2.680 aulas no total",
      theoretical: 1420,
      practical: 1260,
      average: 223,
      efficiency: 92,
      revenue: "R$ 187K",
      instructors: 8,
      theoreticalAvg: "118/mês",
      practicalAvg: "105/mês",
      averageTarget: "Meta: 220",
      efficiencyTrend: "Tendência ↗↗",
      revenueAvg: "R$ 15.6K/mês",
      instructorLoad: "28 aulas/instrutor",
      theoreticalChange: "+15.2%",
      practicalChange: "+18.7%",
      averageChange: "+6.8%",
      efficiencyChange: "+5.1%",
      revenueChange: "+22.3%",
      instructorsChange: "0%",
    },
    "2y": {
      label: "Últimos 2 anos",
      badge: "2 Anos",
      total: "5.120 aulas no total",
      theoretical: 2680,
      practical: 2440,
      average: 213,
      efficiency: 88,
      revenue: "R$ 358K",
      instructors: 8,
      theoreticalAvg: "112/mês",
      practicalAvg: "102/mês",
      averageTarget: "Meta: 220",
      efficiencyTrend: "Tendência ↗",
      revenueAvg: "R$ 14.9K/mês",
      instructorLoad: "27 aulas/instrutor",
      theoreticalChange: "+22.4%",
      practicalChange: "+26.1%",
      averageChange: "+12.3%",
      efficiencyChange: "+8.7%",
      revenueChange: "+28.9%",
      instructorsChange: "+14.3%",
    },
    "3y": {
      label: "Últimos 3 anos",
      badge: "3 Anos",
      total: "7.890 aulas no total",
      theoretical: 4120,
      practical: 3770,
      average: 219,
      efficiency: 85,
      revenue: "R$ 552K",
      instructors: 7,
      theoreticalAvg: "114/mês",
      practicalAvg: "105/mês",
      averageTarget: "Meta: 220",
      efficiencyTrend: "Tendência ↗",
      revenueAvg: "R$ 15.3K/mês",
      instructorLoad: "31 aulas/instrutor",
      theoreticalChange: "+35.7%",
      practicalChange: "+42.1%",
      averageChange: "+18.9%",
      efficiencyChange: "+12.4%",
      revenueChange: "+45.6%",
      instructorsChange: "+16.7%",
    },
    all: {
      label: "Histórico completo",
      badge: "Histórico",
      total: "12.450 aulas no total",
      theoretical: 6500,
      practical: 5950,
      average: 207,
      efficiency: 82,
      revenue: "R$ 870K",
      instructors: 6,
      theoreticalAvg: "108/mês",
      practicalAvg: "99/mês",
      averageTarget: "Meta: 220",
      efficiencyTrend: "Tendência ↗",
      revenueAvg: "R$ 14.5K/mês",
      instructorLoad: "34 aulas/instrutor",
      theoreticalChange: "+85.3%",
      practicalChange: "+92.7%",
      averageChange: "+47.2%",
      efficiencyChange: "+28.1%",
      revenueChange: "+156.8%",
      instructorsChange: "+33.3%",
    },
  };

  // Add click event listeners to period buttons
  periodButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      periodButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Get period data
      const period = this.dataset.period;
      const data = periodData[period];

      if (data) {
        // Update period information
        if (periodText) periodText.textContent = data.label;
        if (periodTotal) periodTotal.textContent = "• " + data.total;
        if (metricsPeriodBadge) metricsPeriodBadge.textContent = data.badge;

        // Animate and update metrics with loading state
        const metrics = [
          {
            element: theoreticalCount,
            value: data.theoretical,
            change: data.theoreticalChange,
            avg: theoreticalAvg,
            avgValue: data.theoreticalAvg,
          },
          {
            element: practicalCount,
            value: data.practical,
            change: data.practicalChange,
            avg: practicalAvg,
            avgValue: data.practicalAvg,
          },
          {
            element: averageCount,
            value: data.average,
            change: data.averageChange,
            avg: averageTarget,
            avgValue: data.averageTarget,
          },
          {
            element: efficiencyRate,
            value: data.efficiency + "%",
            change: data.efficiencyChange,
            avg: efficiencyTrend,
            avgValue: data.efficiencyTrend,
          },
          {
            element: revenueCount,
            value: data.revenue,
            change: data.revenueChange,
            avg: revenueAvg,
            avgValue: data.revenueAvg,
          },
          {
            element: instructorsActive,
            value: data.instructors,
            change: data.instructorsChange,
            avg: instructorLoad,
            avgValue: data.instructorLoad,
          },
        ];

        metrics.forEach((metric, index) => {
          if (metric.element) {
            // Add loading animation
            metric.element.style.opacity = "0.5";
            metric.element.textContent = "...";

            // Update value with delay for smooth animation
            setTimeout(() => {
              metric.element.style.opacity = "1";
              metric.element.textContent = metric.value;

              // Update average/details
              if (metric.avg) {
                metric.avg.textContent = metric.avgValue;
              }

              // Update change indicator
              const changeElement = metric.element.parentElement.querySelector(
                ".metric-change span"
              );
              if (changeElement) {
                changeElement.textContent = metric.change;

                // Update change color based on positive/negative
                const changeContainer = changeElement.parentElement;
                changeContainer.classList.remove(
                  "positive",
                  "negative",
                  "neutral"
                );
                if (metric.change.startsWith("+")) {
                  changeContainer.classList.add("positive");
                } else if (metric.change.startsWith("-")) {
                  changeContainer.classList.add("negative");
                } else {
                  changeContainer.classList.add("neutral");
                }
              }
            }, 200 + index * 100);
          }
        });

        // Show success notification
        showNotification(`Dados atualizados para: ${data.label}`, "success");

        // Reset update time
        resetUpdateTime();

        // In a real app, you would also update the chart here
        console.log(`Chart data updated for period: ${period}`, data);
      }
    });
  });

  // Add hover effects to period buttons
  periodButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      if (!this.classList.contains("active")) {
        this.style.transform = "translateY(-2px) scale(1.02)";
      }
    });

    button.addEventListener("mouseleave", function () {
      if (!this.classList.contains("active")) {
        this.style.transform = "translateY(0) scale(1)";
      }
    });
  });
})();

// Show notification system for user feedback
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
          <i class="fas ${
            type === "success"
              ? "fa-check-circle"
              : type === "warning"
              ? "fa-exclamation-triangle"
              : "fa-info-circle"
          }"></i>
          <span>${message}</span>
        </div>
      `;

  // Add to body
  document.body.appendChild(notification);

  // Show notification with animation
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// ===== CHART FUNCTIONS =====

// Chart period selector functionality
function initChartPeriodSelector() {
  const periodButtons = document.querySelectorAll(".period-btn");
  const currentPeriodEl = document.getElementById("current-period");
  const periodTotalEl = document.getElementById("period-total");
  const metricsPeriodBadge = document.getElementById("metrics-period-badge");

  periodButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      periodButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Get period data
      const period = this.getAttribute("data-period");
      const label = this.getAttribute("data-label");

      // Update period info
      if (currentPeriodEl) currentPeriodEl.textContent = label;
      if (metricsPeriodBadge) metricsPeriodBadge.textContent = this.textContent;

      // Update metrics based on period
      updateChartMetrics(period);

      // Show loading and update chart
      showNotification(`Carregando dados para: ${label}`, "info");

      setTimeout(() => {
        // Simulate chart update
        showNotification("Gráfico atualizado com sucesso!", "success");
      }, 1000);
    });
  });
}

// Update chart metrics based on selected period
function updateChartMetrics(period) {
  const metricsData = {
    "6m": {
      theoretical: { count: 648, change: "+8.5%", avg: "108/mês" },
      practical: { count: 592, change: "+12.3%", avg: "99/mês" },
      average: { count: 206, change: "+2.1%", target: "Meta: 220" },
      efficiency: { rate: "89%", change: "+3.2%", trend: "Tendência ↗" },
      revenue: { value: "R$ 86K", change: "+15.7%", avg: "R$ 14.3K/mês" },
      instructors: { active: 8, change: "0%", load: "26 aulas/instrutor" },
      total: "1.240 aulas no total",
    },
    "1y": {
      theoretical: { count: 1296, change: "+12.1%", avg: "108/mês" },
      practical: { count: 1184, change: "+15.7%", avg: "99/mês" },
      average: { count: 206, change: "+4.8%", target: "Meta: 220" },
      efficiency: { rate: "91%", change: "+5.1%", trend: "Tendência ↗" },
      revenue: { value: "R$ 172K", change: "+18.3%", avg: "R$ 14.3K/mês" },
      instructors: { active: 8, change: "0%", load: "26 aulas/instrutor" },
      total: "2.480 aulas no total",
    },
    "2y": {
      theoretical: { count: 2592, change: "+8.9%", avg: "108/mês" },
      practical: { count: 2368, change: "+11.2%", avg: "99/mês" },
      average: { count: 206, change: "+3.5%", target: "Meta: 220" },
      efficiency: { rate: "88%", change: "+2.8%", trend: "Tendência ↗" },
      revenue: { value: "R$ 344K", change: "+14.2%", avg: "R$ 14.3K/mês" },
      instructors: { active: 8, change: "+14%", load: "26 aulas/instrutor" },
      total: "4.960 aulas no total",
    },
    "3y": {
      theoretical: { count: 3888, change: "+7.2%", avg: "108/mês" },
      practical: { count: 3552, change: "+9.8%", avg: "99/mês" },
      average: { count: 206, change: "+2.9%", target: "Meta: 220" },
      efficiency: { rate: "87%", change: "+1.9%", trend: "Tendência ↗" },
      revenue: { value: "R$ 516K", change: "+12.5%", avg: "R$ 14.3K/mês" },
      instructors: { active: 8, change: "+33%", load: "26 aulas/instrutor" },
      total: "7.440 aulas no total",
    },
    all: {
      theoretical: { count: 5184, change: "+6.8%", avg: "108/mês" },
      practical: { count: 4736, change: "+8.9%", avg: "99/mês" },
      average: { count: 206, change: "+2.1%", target: "Meta: 220" },
      efficiency: { rate: "86%", change: "+1.5%", trend: "Tendência ↗" },
      revenue: { value: "R$ 688K", change: "+11.8%", avg: "R$ 14.3K/mês" },
      instructors: { active: 8, change: "+60%", load: "26 aulas/instrutor" },
      total: "9.920 aulas no total",
    },
  };

  const data = metricsData[period] || metricsData["6m"];

  // Update metric values
  document.getElementById("theoretical-count").textContent =
    data.theoretical.count;
  document.getElementById("practical-count").textContent = data.practical.count;
  document.getElementById("average-count").textContent = data.average.count;
  document.getElementById("efficiency-rate").textContent = data.efficiency.rate;
  document.getElementById("revenue-lessons").textContent = data.revenue.value;
  document.getElementById("instructors-active").textContent =
    data.instructors.active;

  // Update averages and targets
  document.getElementById("theoretical-avg").textContent = data.theoretical.avg;
  document.getElementById("practical-avg").textContent = data.practical.avg;
  document.getElementById("average-target").textContent = data.average.target;
  document.getElementById("efficiency-trend").textContent =
    data.efficiency.trend;
  document.getElementById("revenue-avg").textContent = data.revenue.avg;
  document.getElementById("instructor-load").textContent =
    data.instructors.load;

  // Update period total
  document.getElementById("period-total").textContent = `• ${data.total}`;
}

// Weekly schedule functions
function toggleWeekView() {
  const scheduleGrid = document.getElementById("schedule-grid");
  if (scheduleGrid) {
    // Toggle between grid and list view
    scheduleGrid.classList.toggle("list-view");

    if (scheduleGrid.classList.contains("list-view")) {
      showNotification("Visualização em lista ativada", "info");
    } else {
      showNotification("Visualização em grade ativada", "info");
    }
  }
}

function openFullSchedule() {
  showNotification("Abrindo agenda completa...", "info");
  // Here you would navigate to the full schedule page
  setTimeout(() => {
    showNotification("Agenda completa carregada!", "success");
  }, 1000);
}

function addNewLesson() {
  // Garantir que a função esteja disponível globalmente para o onclick do HTML
  window.addNewLesson = addNewLesson;
  showNotification("Abrindo formulário de nova aula...", "info");
  console.log("[DEBUG] addNewLesson chamado");
  setTimeout(() => {
    console.log("[DEBUG] Chamando openScheduleLessonModal");
    openScheduleLessonModal();
  }, 500);
}

function changeWeek(direction) {
  const weekTitle = document.getElementById("current-week");
  const weekTotal = document.getElementById("week-total");

  if (direction === -1) {
    showNotification("Carregando semana anterior...", "info");
    if (weekTitle) weekTitle.textContent = "29 de Julho - 4 de Agosto, 2025";
    if (weekTotal) weekTotal.textContent = "38 aulas programadas";
  } else {
    showNotification("Carregando próxima semana...", "info");
    if (weekTitle) weekTitle.textContent = "12 - 18 de Agosto, 2025";
    if (weekTotal) weekTotal.textContent = "52 aulas programadas";
  }

  setTimeout(() => {
    showNotification("Agenda semanal atualizada!", "success");
  }, 800);
}

function viewLessonDetails(lessonId) {
  showNotification(`Carregando detalhes da aula #${lessonId}...`, "info");
  // Here you would open a modal with lesson details
  setTimeout(() => {
    showNotification("Detalhes da aula carregados!", "success");
  }, 800);
}

function updateStudentsChart(period) {
  console.log("Updating students chart for period:", period);

  const chartData = {
    6: {
      labels: ["Ago", "Set", "Out", "Nov", "Dez", "Jan"],
      datasets: [
        { data: [28, 35, 42, 38, 45, 52] },
        { data: [22, 28, 35, 30, 38, 44] },
        { data: [65, 72, 68, 75, 82, 88] },
      ],
    },
    12: {
      labels: [
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
        "Jan",
      ],
      datasets: [
        { data: [20, 25, 30, 28, 32, 35, 28, 35, 42, 38, 45, 52] },
        { data: [18, 22, 25, 24, 28, 30, 22, 28, 35, 30, 38, 44] },
        { data: [45, 50, 55, 58, 62, 68, 65, 72, 68, 75, 82, 88] },
      ],
    },
    24: {
      labels: [
        "Jan 23",
        "Mar 23",
        "Mai 23",
        "Jul 23",
        "Set 23",
        "Nov 23",
        "Jan 24",
        "Mar 24",
        "Mai 24",
        "Jul 24",
        "Set 24",
        "Nov 24",
        "Jan 25",
      ],
      datasets: [
        { data: [15, 18, 22, 25, 20, 28, 25, 30, 32, 28, 35, 45, 52] },
        { data: [12, 15, 18, 22, 18, 24, 22, 25, 28, 24, 30, 38, 44] },
        { data: [30, 35, 40, 45, 38, 50, 45, 55, 62, 58, 68, 82, 88] },
      ],
    },
  };

  const data = chartData[period];
  if (studentsChart && data) {
    console.log("Updating chart with data:", data);

    // Update chart data
    studentsChart.data.labels = data.labels;
    studentsChart.data.datasets[0].data = data.datasets[0].data;
    studentsChart.data.datasets[1].data = data.datasets[1].data;
    studentsChart.data.datasets[2].data = data.datasets[2].data;

    // Update with animation
    studentsChart.update("active");

    // Update card title
    const cardTitle = document.querySelector(
      ".students-performance-chart .card-title"
    );
    if (cardTitle) {
      const periodText =
        period == 6
          ? "Últimos 6 Meses"
          : period == 12
          ? "Último Ano"
          : "Últimos 2 Anos";
      cardTitle.innerHTML = `<i class="fas fa-chart-area"></i> Progresso de Alunos - ${periodText}`;
    }

    showNotification(
      `Gráfico atualizado para ${
        period == 6
          ? "últimos 6 meses"
          : period == 12
          ? "último ano"
          : "últimos 2 anos"
      }`,
      "info"
    );
  } else {
    console.error("Students chart not found or invalid period data");
    showNotification("Erro ao atualizar gráfico", "error");
  }
}

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  // Initialize charts with delay to ensure DOM is ready
  setTimeout(() => {
    initChartFunctionality();

    // Test students chart after initialization
    setTimeout(() => {
      testStudentsChart();
    }, 1000);
  }, 100);
});

// Function to test if students chart is working
function testStudentsChart() {
  const canvas = document.getElementById("students-chart");
  if (canvas) {
    console.log("Canvas found:", canvas);
    console.log("Canvas dimensions:", canvas.width, "x", canvas.height);
    console.log(
      "Canvas visible:",
      canvas.offsetWidth > 0 && canvas.offsetHeight > 0
    );

    if (studentsChart) {
      console.log("Students chart instance:", studentsChart);
      console.log("Chart data:", studentsChart.data);
    } else {
      console.error("Students chart instance not found");
    }
  } else {
    console.error("Canvas element not found");
  }
}

// Timeline/Schedule Functions
function updateTimelineDate() {
  const dateSelector = document.getElementById("timeline-date-selector");
  const value = dateSelector.value;

  if (value === "custom") {
    // Open date picker modal or input
    const customDate = prompt("Insira a data (dd/mm/aaaa):", "06/08/2025");
    if (customDate) {
      updateTimelineForDate(customDate);
    }
  } else {
    loadTimelineData(value);
  }
}

function loadTimelineData(period) {
  const container = document.getElementById("timeline-lessons-container");

  const lessonsData = {
    today: [
      {
        time: "08:00-09:00",
        student: "João Silva",
        instructor: "Carlos Mendes",
        type: "practical",
        top: 0,
        height: 8.33,
      },
      {
        time: "08:30-09:30",
        student: "Maria Oliveira",
        instructor: "Ana Costa",
        type: "theoretical",
        top: 4.17,
        height: 8.33,
      },
      {
        time: "10:00-11:00",
        student: "Pedro Santos",
        instructor: "Roberto Lima",
        type: "practical",
        top: 16.67,
        height: 8.33,
      },
      {
        time: "10:30-11:30",
        student: "Ana Paula",
        instructor: "Carlos Mendes",
        type: "exam",
        top: 20.84,
        height: 8.33,
      },
      {
        time: "14:00-15:00",
        student: "Lucas Costa",
        instructor: "Ana Costa",
        type: "theoretical",
        top: 50,
        height: 8.33,
      },
      {
        time: "15:30-16:30",
        student: "Carla Silva",
        instructor: "Roberto Lima",
        type: "practical",
        top: 62.5,
        height: 8.33,
      },
      {
        time: "16:00-17:00",
        student: "Diego Santos",
        instructor: "Carlos Mendes",
        type: "theoretical",
        top: 66.67,
        height: 8.33,
      },
      {
        time: "17:30-18:30",
        student: "Fernanda Lima",
        instructor: "Ana Costa",
        type: "exam",
        top: 79.17,
        height: 8.33,
      },
    ],
    tomorrow: [
      {
        time: "09:00-10:00",
        student: "Rafael Oliveira",
        instructor: "Carlos Mendes",
        type: "practical",
        top: 8.33,
        height: 8.33,
      },
      {
        time: "10:00-11:00",
        student: "Júlia Costa",
        instructor: "Ana Costa",
        type: "theoretical",
        top: 16.67,
        height: 8.33,
      },
      {
        time: "14:30-15:30",
        student: "Marcos Silva",
        instructor: "Roberto Lima",
        type: "practical",
        top: 54.17,
        height: 8.33,
      },
      {
        time: "16:30-17:30",
        student: "Patrícia Santos",
        instructor: "Carlos Mendes",
        type: "theoretical",
        top: 70.84,
        height: 8.33,
      },
    ],
  };

  const lessons = lessonsData[period] || lessonsData.today;

  container.innerHTML = lessons
    .map(
      (lesson) => `
        <div class="lesson-block ${lesson.type}" style="top: ${lesson.top}%; height: ${lesson.height}%;" 
             onclick="showLessonDetails('${lesson.student}', '${lesson.instructor}', '${lesson.time}', '${lesson.type}')">
          <div class="lesson-info">
            <span class="lesson-time">${lesson.time}</span>
            <span class="lesson-student">${lesson.student}</span>
            <span class="lesson-instructor">${lesson.instructor}</span>
          </div>
        </div>
      `
    )
    .join("");

  // Resolve overlapping lessons after rendering
  setTimeout(() => {
    resolveTimelineOverlaps();
  }, 100);
}

function resolveTimelineOverlaps() {
  const container = document.getElementById("timeline-lessons-container");
  const lessonBlocks = container.querySelectorAll(".lesson-block");

  // Reset classes
  lessonBlocks.forEach((block) => {
    block.classList.remove("has-overlap", "offset-1", "offset-2", "offset-3");
    block.style.left = "";
    block.style.width = "";
  });

  // Group lessons by time overlap
  const timeGroups = [];
  lessonBlocks.forEach((block, index) => {
    const rect = block.getBoundingClientRect();
    const blockTop = parseInt(block.style.top);
    const blockHeight = parseInt(block.style.height) || 8.33;

    let foundGroup = false;

    for (let group of timeGroups) {
      for (let existingBlock of group) {
        const existingTop = parseInt(existingBlock.style.top);
        const existingHeight = parseInt(existingBlock.style.height) || 8.33;

        // Check if lessons overlap in time
        if (
          blockTop < existingTop + existingHeight &&
          blockTop + blockHeight > existingTop
        ) {
          group.push(block);
          foundGroup = true;
          break;
        }
      }
      if (foundGroup) break;
    }

    if (!foundGroup) {
      timeGroups.push([block]);
    }
  });

  // Apply styling for overlapping groups
  timeGroups.forEach((group) => {
    if (group.length > 1) {
      group.forEach((block, index) => {
        block.classList.add("has-overlap");
        if (index === 1) {
          block.classList.add("offset-1");
        } else if (index === 2) {
          block.classList.add("offset-2");
        } else if (index === 3) {
          block.classList.add("offset-3");
        }
      });
    }
  });
}

function showLessonDetails(student, instructor, time, type) {
  const typeNames = {
    practical: "Aula Prática",
    theoretical: "Aula Teórica",
    exam: "Exame",
  };

  showNotification(
    `${typeNames[type]}: ${student} com ${instructor} às ${time}`,
    "info"
  );
}

function updateTimelineForDate(customDate) {
  const container = document.getElementById("timeline-lessons-container");
  container.innerHTML =
    '<div class="timeline-message">Nenhuma aula agendada para esta data.</div>';
  document.querySelector(".card-title").innerHTML = `
        <i class="fas fa-clock"></i>
        Cronograma do Dia - ${customDate}
      `;
}

// Initialize timeline data on load
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    loadTimelineData("today");
  }, 500);
});

console.log("AutoDrive Dashboard v2.1.0 - Sistema carregado com sucesso!");

// ===== MODAL FUNCTIONS =====

// ===== FUNÇÕES PARA MODAL DE AGENDAMENTO =====

// Função para abrir modal de agendamento
function openScheduleLessonModal() {
  // Garantir que a função esteja disponível globalmente para o onclick do HTML
  window.openScheduleLessonModal = openScheduleLessonModal;
  console.log("[DEBUG] openScheduleLessonModal chamado");
  const modal = document.getElementById("scheduleLessonModal");
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    console.log("[DEBUG] Modal encontrado e classe 'show' adicionada");
  } else {
    console.error("[DEBUG] scheduleLessonModal NÃO encontrado no DOM");
  }

  // Definir data mínima como hoje
  const today = new Date().toISOString().split("T")[0];
  const lessonDateInput = document.getElementById("lessonDate");
  if (lessonDateInput) {
    lessonDateInput.min = today;
  }

  // Carregar dados iniciais
  loadInstructors();
  loadVehicles();
  loadStudents();
}

// Função para mostrar/esconder campo de veículo
function toggleVehicleField() {
  const lessonType = document.getElementById("lessonType").value;
  const vehicleField = document.getElementById("vehicleField");
  const vehicleSelect = document.getElementById("lessonVehicle");

  if (lessonType === "practical") {
    vehicleField.style.display = "block";
    vehicleSelect.required = true;
    document.getElementById("lessonLocation").value = "Pista/Ruas";
  } else {
    vehicleField.style.display = "none";
    vehicleSelect.required = false;
    vehicleSelect.value = "";
    document.getElementById("lessonLocation").value = "Sala de Aula";
  }
}

// Carregar lista de instrutores
async function loadInstructors() {
  try {
    const response = await fetch("/api/instructors");
    const data = await response.json();

    if (data.success) {
      const select = document.getElementById("lessonInstructor");
      select.innerHTML = '<option value="">Selecione o instrutor</option>';

      data.instructors.forEach((instructor) => {
        const option = document.createElement("option");
        option.value = instructor.id;
        option.textContent = instructor.name;
        option.dataset.specialty = instructor.specialty;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar instrutores:", error);
  }
}

// Carregar lista de veículos
async function loadVehicles() {
  try {
    const response = await fetch("/api/vehicles");
    const data = await response.json();

    if (data.success) {
      const select = document.getElementById("lessonVehicle");
      select.innerHTML = '<option value="">Selecione o veículo</option>';

      data.vehicles.forEach((vehicle) => {
        const option = document.createElement("option");
        option.value = `${vehicle.id} (${vehicle.model})`;
        option.textContent = `${vehicle.id} - ${vehicle.model} (Cat. ${vehicle.category})`;
        option.dataset.category = vehicle.category;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar veículos:", error);
  }
}

// Carregar lista de alunos (mockado - em produção buscar do backend)
function loadStudents() {
  const select = document.getElementById("lessonStudent");
  select.innerHTML = '<option value="">Selecione o aluno</option>';

  // Dados mockados de alunos
  const students = [
    { id: "user@autodrive.com", name: "João Silva" },
    { id: "demo@autodrive.com", name: "Maria Santos" },
    { id: "student1@autodrive.com", name: "Pedro Oliveira" },
    { id: "student2@autodrive.com", name: "Ana Paula" },
  ];

  students.forEach((student) => {
    const option = document.createElement("option");
    option.value = student.id;
    option.textContent = student.name;
    select.appendChild(option);
  });
}

// Atualizar horários disponíveis
async function updateAvailableTimes() {
  const date = document.getElementById("lessonDate").value;
  const instructorId = document.getElementById("lessonInstructor").value;

  if (!date) return;

  try {
    const params = new URLSearchParams({ date });
    if (instructorId) params.append("instructor_id", instructorId);

    const response = await fetch(`/api/schedule-availability?${params}`);
    const data = await response.json();

    const select = document.getElementById("lessonTime");
    select.innerHTML = '<option value="">Selecione um horário</option>';

    if (data.success) {
      data.available_times.forEach((time) => {
        const option = document.createElement("option");
        option.value = time;
        option.textContent = time;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar horários:", error);
  }
}

// Submeter formulário de agendamento
async function submitLessonSchedule() {
  const form = document.getElementById("scheduleLessonForm");
  const formData = new FormData(form);

  // Validar campos obrigatórios
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Preparar dados
  const lessonData = {
    student_id: formData.get("student_id"),
    student_name:
      document.getElementById("lessonStudent").selectedOptions[0].textContent,
    instructor_id: formData.get("instructor_id"),
    instructor_name:
      document.getElementById("lessonInstructor").selectedOptions[0]
        .textContent,
    date: formData.get("date"),
    start_time: formData.get("start_time"),
    end_time: calculateEndTime(formData.get("start_time")),
    type: formData.get("type"),
    category: formData.get("category"),
    vehicle: formData.get("vehicle"),
    location:
      formData.get("location") ||
      (formData.get("type") === "practical" ? "Pista/Ruas" : "Sala de Aula"),
    notes: formData.get("notes"),
  };

  try {
    const response = await fetch("/api/lessons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lessonData),
    });

    const result = await response.json();

    if (result.success) {
      showNotification("Aula agendada com sucesso!", "success");
      closeModal("scheduleLessonModal");
      // Recarregar lista de aulas se estiver na seção schedule
      if (
        document.getElementById("schedule-content").classList.contains("active")
      ) {
        loadLessons();
      }
    } else {
      showNotification(result.message || "Erro ao agendar aula", "error");
    }
  } catch (error) {
    console.error("Erro ao agendar aula:", error);
    showNotification("Erro ao conectar com o servidor", "error");
  }
}

// Calcular horário de término (1 hora depois)
function calculateEndTime(startTime) {
  if (!startTime) return "";

  const [hours, minutes] = startTime.split(":").map(Number);
  const endHours = hours + 1;

  return `${endHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

// ===== FUNÇÕES PARA MODAL DE INSTRUTOR =====

// Função para submeter novo instrutor
async function submitInstructor() {
  const form = document.getElementById("addInstructorForm");
  const formData = new FormData(form);

  // Validar campos obrigatórios
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Preparar dados
  const instructorData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    cpf: formData.get("cpf"),
    specialty: formData.get("specialty"),
    license: formData.get("license"),
    address: formData.get("address"),
    notes: formData.get("notes"),
  };

  try {
    const response = await fetch("/api/instructors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(instructorData),
    });

    const result = await response.json();

    if (result.success) {
      showNotification("Instrutor cadastrado com sucesso!", "success");
      closeModal("addInstructorModal");
      form.reset();
      // Recarregar lista de instrutores se estiver na seção
      if (
        document
          .getElementById("instructors-content")
          .classList.contains("active")
      ) {
        // Aqui você pode adicionar uma função para recarregar a lista
      }
    } else {
      showNotification(
        result.message || "Erro ao cadastrar instrutor",
        "error"
      );
    }
  } catch (error) {
    console.error("Erro ao cadastrar instrutor:", error);
    showNotification("Erro ao conectar com o servidor", "error");
  }
}

// ===== FUNÇÕES PARA MODAL DE VEÍCULO =====

// Função para submeter novo veículo
async function submitVehicle() {
  const form = document.getElementById("addVehicleForm");
  const formData = new FormData(form);

  // Validar campos obrigatórios
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Preparar dados
  const vehicleData = {
    plate: formData.get("plate"),
    model: formData.get("model"),
    brand: formData.get("brand"),
    year: parseInt(formData.get("year")),
    category: formData.get("category"),
    color: formData.get("color"),
    fuel: formData.get("fuel"),
    transmission: formData.get("transmission"),
    notes: formData.get("notes"),
  };

  try {
    const response = await fetch("/api/vehicles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicleData),
    });

    const result = await response.json();

    if (result.success) {
      showNotification("Veículo cadastrado com sucesso!", "success");
      closeModal("addVehicleModal");
      form.reset();
      // Recarregar lista de veículos se estiver na seção
      if (
        document.getElementById("vehicles-content").classList.contains("active")
      ) {
        // Aqui você pode adicionar uma função para recarregar a lista
      }
    } else {
      showNotification(result.message || "Erro ao cadastrar veículo", "error");
    }
  } catch (error) {
    console.error("Erro ao cadastrar veículo:", error);
    showNotification("Erro ao conectar com o servidor", "error");
  }
}

// ===== FUNÇÕES PARA MODAL DE ALUNO =====

// Função para submeter novo aluno
async function submitStudent() {
  const form = document.getElementById("addStudentForm");
  const formData = new FormData(form);

  // Validar campos obrigatórios
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Preparar dados
  const studentData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    cpf: formData.get("cpf"),
    birth_date: formData.get("birth_date"),
    category: formData.get("category"),
    address: formData.get("address"),
    notes: formData.get("notes"),
  };

  try {
    const response = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    const result = await response.json();

    if (result.success) {
      showNotification("Aluno cadastrado com sucesso!", "success");
      closeModal("addStudentModal");
      form.reset();
      // Recarregar lista de alunos se estiver na seção
      if (
        document.getElementById("students-content").classList.contains("active")
      ) {
        // Aqui você pode adicionar uma função para recarregar a lista
      }
    } else {
      showNotification(result.message || "Erro ao cadastrar aluno", "error");
    }
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    showNotification("Erro ao conectar com o servidor", "error");
  }
}

// ===== FUNÇÕES PARA MODAL DE PAGAMENTO =====

// Função para submeter novo pagamento
async function submitPayment() {
  const form = document.getElementById("addPaymentForm");
  const formData = new FormData(form);

  // Validar campos obrigatórios
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Preparar dados
  const paymentData = {
    student_id: formData.get("student_id"),
    student_name:
      document.getElementById("paymentStudent").selectedOptions[0].textContent,
    amount: parseFloat(formData.get("amount")),
    payment_date: formData.get("payment_date"),
    payment_method: formData.get("payment_method"),
    category: formData.get("category"),
    installments: parseInt(formData.get("installments")) || 1,
    description: formData.get("description"),
    notes: formData.get("notes"),
  };

  try {
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    if (result.success) {
      showNotification("Pagamento registrado com sucesso!", "success");
      closeModal("paymentModal");
      form.reset();
      // Recarregar lista de pagamentos se estiver na seção
      if (
        document.getElementById("finance-content").classList.contains("active")
      ) {
        // Aqui você pode adicionar uma função para recarregar a lista
      }
    } else {
      showNotification(
        result.message || "Erro ao registrar pagamento",
        "error"
      );
    }
  } catch (error) {
    console.error("Erro ao registrar pagamento:", error);
    showNotification("Erro ao conectar com o servidor", "error");
  }
}

// ===== FUNÇÕES AUXILIARES =====

// Função genérica para fechar modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "auto";
    // Limpar formulário se existir
    const form = modal.querySelector("form");
    if (form) {
      form.reset();
    }
  }
}

// ===== FUNÇÕES ESPECÍFICAS PARA ABERTURA DE MODAIS =====

// Função para abrir modal de estudante
function openStudentModal() {
  const modal = document.getElementById("addStudentModal");
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  // Configurar data de nascimento máxima (16 anos atrás mínimo)
  const studentBirthDateInput = document.getElementById("studentBirthDate");
  if (studentBirthDateInput) {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 16);
    studentBirthDateInput.max = maxDate.toISOString().split("T")[0];
  }
}

// Função para abrir modal de instrutor
function openInstructorModal() {
  const modal = document.getElementById("addInstructorModal");
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
}

// Função para abrir modal de veículo
function openVehicleModal() {
  const modal = document.getElementById("addVehicleModal");
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
}

// Função para abrir modal de pagamento
function openPaymentModal() {
  const modal = document.getElementById("paymentModal");
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  // Configurar data padrão como hoje
  const today = new Date().toISOString().split("T")[0];
  const paymentDateInput = document.getElementById("paymentDate");
  if (paymentDateInput) {
    paymentDateInput.value = today;
  }
}

// ===== LESSON MANAGEMENT FUNCTIONS =====

// Função para carregar e exibir aulas
async function loadLessons() {
  try {
    const response = await fetch("/api/lessons");
    const data = await response.json();

    if (data.success) {
      displayLessons(data.lessons);
    }
  } catch (error) {
    console.error("Erro ao carregar aulas:", error);
  }
}

// Função para exibir aulas na interface
function displayLessons(lessons) {
  const container = document.querySelector(".lessons-list");
  if (!container) return;

  // Limpar lista atual
  container.innerHTML = "";

  if (lessons.length === 0) {
    container.innerHTML = `
      <div class="no-lessons">
        <i class="fas fa-calendar-times"></i>
        <p>Nenhuma aula encontrada</p>
        <button class="btn btn-primary" onclick="openScheduleLessonModal()">
          Agendar Primeira Aula
        </button>
      </div>
    `;
    return;
  }

  lessons.forEach((lesson) => {
    const lessonElement = createLessonElement(lesson);
    container.appendChild(lessonElement);
  });
}

// Criar elemento HTML para uma aula
function createLessonElement(lesson) {
  const div = document.createElement("div");
  div.className = `lesson-item ${lesson.status} ${lesson.type}`;

  const statusText = {
    scheduled: "Agendada",
    "in-progress": "Em Andamento",
    completed: "Concluída",
    cancelled: "Cancelada",
  };

  const typeIcon = lesson.type === "practical" ? "fas fa-car" : "fas fa-book";

  div.innerHTML = `
    <div class="lesson-time-block">
      <div class="lesson-time">${lesson.start_time}</div>
      <div class="lesson-duration">1h</div>
      <div class="lesson-date">${formatDate(lesson.date)}</div>
    </div>
    <div class="lesson-type-indicator ${lesson.type}">
      <i class="${typeIcon}"></i>
    </div>
    <div class="lesson-details">
      <div class="lesson-main-info">
        <div class="lesson-student-name">
          <strong>${lesson.student_name}</strong>
          <span class="lesson-category">Categoria ${lesson.category}</span>
        </div>
        <div class="lesson-instructor-info">
          <i class="fas fa-chalkboard-teacher"></i>
          <span>${lesson.instructor_name}</span>
        </div>
      </div>
      <div class="lesson-additional-info">
        ${
          lesson.vehicle
            ? `
        <span class="lesson-vehicle">
          <i class="fas fa-car"></i>
          ${lesson.vehicle}
        </span>
        `
            : `
        <span class="lesson-topic">
          <i class="fas fa-book-open"></i>
          Aula Teórica
        </span>
        `
        }
        <span class="lesson-location">
          <i class="fas fa-map-marker-alt"></i>
          ${lesson.location}
        </span>
      </div>
    </div>
    <div class="lesson-status-badge">
      <span class="status-badge status-${lesson.status}">${
    statusText[lesson.status]
  }</span>
    </div>
    <div class="lesson-actions">
      ${
        lesson.status === "scheduled"
          ? `
      <button aria-label="Iniciar aula" class="btn-icon" onclick="startLesson(${lesson.id})">
        <i class="fas fa-play"></i>
      </button>
      <button aria-label="Editar" class="btn-icon" onclick="editLesson(${lesson.id})">
        <i class="fas fa-edit"></i>
      </button>
      <button aria-label="Cancelar" class="btn-icon" onclick="cancelLesson(${lesson.id})">
        <i class="fas fa-times"></i>
      </button>
      `
          : ""
      }
      <button aria-label="Ver detalhes" class="btn-icon" onclick="viewLessonDetails(${
        lesson.id
      })">
        <i class="fas fa-eye"></i>
      </button>
    </div>
  `;

  return div;
}

// Formatear data para exibição
function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lessonDate = new Date(date);
  lessonDate.setHours(0, 0, 0, 0);

  if (lessonDate.getTime() === today.getTime()) {
    return "Hoje";
  }

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (lessonDate.getTime() === tomorrow.getTime()) {
    return "Amanhã";
  }

  return date.toLocaleDateString("pt-BR");
}

// Função para cancelar aula
async function cancelLesson(lessonId) {
  if (!confirm("Tem certeza que deseja cancelar esta aula?")) {
    return;
  }

  try {
    const response = await fetch(`/api/lessons/${lessonId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      showNotification("Aula cancelada com sucesso!", "success");
      loadLessons();
    } else {
      showNotification(result.message || "Erro ao cancelar aula", "error");
    }
  } catch (error) {
    console.error("Erro ao cancelar aula:", error);
    showNotification("Erro ao conectar com o servidor", "error");
  }
}

// ===== INPUT MASKS =====

// Máscaras para campos de entrada
document.addEventListener("DOMContentLoaded", function () {
  // Máscara para CPF
  const cpfInput = document.getElementById("instructorCPF");
  if (cpfInput) {
    cpfInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      e.target.value = value;
    });
  }

  // Máscara para telefone
  const phoneInput = document.getElementById("instructorPhone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/(\d{2})(\d)/, "($1) $2");
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
      e.target.value = value;
    });
  }

  // Máscara para placa de veículo
  const plateInput = document.getElementById("vehiclePlate");
  if (plateInput) {
    plateInput.addEventListener("input", function (e) {
      let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (value.length > 3) {
        value = value.replace(/(\w{3})(\w)/, "$1-$2");
      }
      e.target.value = value;
    });
  }

  // Máscaras para o modal de aluno
  const studentCpfInput = document.getElementById("studentCPF");
  if (studentCpfInput) {
    studentCpfInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      e.target.value = value;
    });
  }

  const studentPhoneInput = document.getElementById("studentPhone");
  if (studentPhoneInput) {
    studentPhoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/(\d{2})(\d)/, "($1) $2");
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
      e.target.value = value;
    });
  }

  // Configurar data mínima para campos de data
  const today = new Date().toISOString().split("T")[0];
  const paymentDateInput = document.getElementById("paymentDate");
  if (paymentDateInput) {
    paymentDateInput.value = today;
  }

  // Configurar data de nascimento máxima (18 anos atrás)
  const studentBirthDateInput = document.getElementById("studentBirthDate");
  if (studentBirthDateInput) {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 16); // Mínimo 16 anos
    studentBirthDateInput.max = maxDate.toISOString().split("T")[0];
  }

  // Observer para detectar quando a seção schedule está ativa
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const scheduleContent = document.getElementById("schedule-content");
        if (scheduleContent && scheduleContent.classList.contains("active")) {
          loadLessons();
        }
      }
    });
  });

  const scheduleContent = document.getElementById("schedule-content");
  if (scheduleContent) {
    observer.observe(scheduleContent, { attributes: true });

    // Carregar aulas se já estiver ativo
    if (scheduleContent.classList.contains("active")) {
      loadLessons();
    }
  }

  // Add window resize handler for charts
  window.addEventListener("resize", function () {
    setTimeout(() => {
      if (lessonsChart) lessonsChart.resize();
      if (studentsChart) studentsChart.resize();
      if (studentsPerformanceChart) studentsPerformanceChart.resize();
      if (instructorsChart) instructorsChart.resize();
      if (vehiclesChart) vehiclesChart.resize();
      if (scheduleChart) scheduleChart.resize();
      if (examsChart) examsChart.resize();
      if (financeChart) financeChart.resize();
    }, 100);
  });
});

// ===== CONTROLE DE ACESSO BASEADO NO ROLE =====

// Configuração do usuário atual será definida pelo template
// window.currentUser será definido no template HTML

// Controlar acesso baseado no role
document.addEventListener("DOMContentLoaded", function () {
  // Verificar se currentUser está definido
  if (typeof window.currentUser === "undefined") {
    console.warn("window.currentUser não está definido");
    return;
  }

  const userRole = window.currentUser.role;

  // Esconder seções baseadas no role
  if (userRole !== "admin") {
    // Esconder funcionalidades de admin
    hideAdminFeatures();
  }

  if (userRole === "user") {
    // Mostrar apenas funcionalidades básicas para usuários
    showUserFeatures();
  }

  if (userRole === "instructor") {
    // Mostrar apenas funcionalidades para instrutores
    showInstructorFeatures();
  }

  // Atualizar informações do usuário no header
  updateUserInfo();
});

function hideAdminFeatures() {
  // Esconder itens do menu que são apenas para admin
  const adminMenuItems = [
    '[data-section="instructors"]',
    '[data-section="vehicles"]',
    '[data-section="reports"]',
    '[data-section="settings"]',
    ".admin-only",
  ];

  adminMenuItems.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (el) {
        el.style.display = "none";
      }
    });
  });
}

function showUserFeatures() {
  // Manter apenas funcionalidades básicas visíveis
  const userMenuItems = [
    '[data-section="dashboard"]',
    '[data-section="students"]', // usuário pode ver apenas seus próprios dados
  ];

  // Lógica adicional para usuários limitados pode ser adicionada aqui
}

function showInstructorFeatures() {
  // Esconder todos os itens que não são para instrutores
  const allMenuItems = document.querySelectorAll(".menu-item[data-section]");
  allMenuItems.forEach((item) => {
    item.style.display = "none";
  });

  // Mostrar apenas itens relevantes para instrutores
  const instructorMenuItems = [
    '[data-section="dashboard"]', // Dashboard principal
    '[data-section="students"]', // Gerenciar alunos
    '[data-section="schedule"]', // Agenda/Cronograma
    '[data-section="exams"]', // Exames
    '[data-section="finance"]', // Financeiro (pode ver pagamentos de aulas)
  ];

  instructorMenuItems.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (el) {
        el.style.display = "flex"; // ou 'block' dependendo do CSS original
      }
    });
  });

  // Esconder seções administrativas específicas
  const hideForInstructor = [
    '[data-section="instructors"]', // Não pode gerenciar outros instrutores
    '[data-section="vehicles"]', // Não gerencia frota
    '[data-section="reports"]', // Relatórios são para admin
    '[data-section="settings"]', // Configurações são para admin
    ".admin-only",
  ];

  hideForInstructor.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (el) {
        el.style.display = "none";
      }
    });
  });
}

function updateUserInfo() {
  // Atualizar nome do usuário no dashboard
  const userNameElements = document.querySelectorAll(
    ".user-name, .profile-user-name"
  );
  userNameElements.forEach((el) => {
    if (el && window.currentUser.name) {
      el.textContent = window.currentUser.name;
    }
  });

  // Atualizar email do usuário
  const userEmailElements = document.querySelectorAll(
    ".user-email, .profile-user-email"
  );
  userEmailElements.forEach((el) => {
    if (el && window.currentUser.email) {
      el.textContent = window.currentUser.email;
    }
  });

  // Atualizar role do usuário
  const userRoleElements = document.querySelectorAll(
    ".user-role, .profile-user-role"
  );
  userRoleElements.forEach((el) => {
    if (el && window.currentUser.role) {
      let roleText = window.currentUser.role;
      if (roleText === "admin") roleText = "Administrador";
      else if (roleText === "instructor") roleText = "Instrutor";
      else if (roleText === "user") roleText = "Usuário";

      el.textContent = roleText;
    }
  });
}

// Função para criar novo usuário (apenas admins)
async function createNewUser(userData) {
  if (window.currentUser.role !== "admin") {
    alert("Acesso negado. Apenas administradores podem criar usuários.");
    return;
  }

  try {
    const response = await fetch("/admin/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (result.success) {
      alert("Usuário criado com sucesso!");
      // Atualizar lista de usuários ou fazer outras ações
    } else {
      alert("Erro: " + result.message);
    }
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    alert("Erro ao criar usuário");
  }
}

// Função para listar usuários (apenas admins)
async function loadUsers() {
  if (window.currentUser.role !== "admin") {
    console.log("Acesso negado para listagem de usuários");
    return;
  }

  try {
    const response = await fetch("/admin/users");
    const result = await response.json();

    if (result.success) {
      console.log("Usuários carregados:", result.users);
      // Processar lista de usuários
    }
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
  }
}

// ===== MODAL DE LOGOUT ELEGANTE =====

function showLogoutModal() {
  const userName = window.currentUser.name || "Usuário";
  const userEmail = window.currentUser.email || "";

  // Atualizar informações do usuário no modal
  document.getElementById("logoutUserName").textContent = userName;
  document.getElementById("logoutUserEmail").textContent = userEmail;

  // Criar iniciais do nome
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  document.getElementById("logoutUserInitials").textContent = initials;

  // Mostrar modal usando função padronizada
  openModal("logoutModal");
}

function hideLogoutModal() {
  closeModal("logoutModal");
}

function performLogout() {
  const confirmBtn = document.getElementById("logoutConfirm");

  // Mostrar loading
  confirmBtn.classList.add("loading");
  confirmBtn.innerHTML = "<span>Saindo...</span>";

  // Simular delay e redirecionar
  setTimeout(() => {
    window.location.href = "/logout";
  }, 1500);
}

// Event listeners adicionais para o modal de logout
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("logoutModal");
  const cancelBtn = document.getElementById("logoutCancel");
  const confirmBtn = document.getElementById("logoutConfirm");

  if (modal && cancelBtn && confirmBtn) {
    // Cancelar logout
    cancelBtn.addEventListener("click", hideLogoutModal);

    // Confirmar logout
    confirmBtn.addEventListener("click", performLogout);

    // Fechar modal clicando fora
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        hideLogoutModal();
      }
    });

    // Fechar modal com ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        hideLogoutModal();
      }
    });
  }
});

// Substituir a função confirmLogout existente
window.confirmLogout = function () {
  showLogoutModal();
};

// ===== FUNÇÕES PADRONIZADAS PARA MODAIS =====

/**
 * Abre um modal com animação
 * @param {string} modalId - ID do modal a ser aberto
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden"; // Prevenir scroll do body

    // Adicionar event listener para fechar com ESC
    const closeOnEsc = (e) => {
      if (e.key === "Escape") {
        closeModal(modalId);
        document.removeEventListener("keydown", closeOnEsc);
      }
    };
    document.addEventListener("keydown", closeOnEsc);

    // Fechar ao clicar fora do modal
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modalId);
      }
    });
  }
}

/**
 * Fecha um modal com animação
 * @param {string} modalId - ID do modal a ser fechado
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = ""; // Restaurar scroll do body
  }
}

/**
 * Alterna a visibilidade de um modal
 * @param {string} modalId - ID do modal
 */
function toggleModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    if (modal.classList.contains("show")) {
      closeModal(modalId);
    } else {
      openModal(modalId);
    }
  }
}

/**
 * Mostra loading em um container específico
 * @param {string} containerId - ID do container
 * @param {string} message - Mensagem de loading (opcional)
 */
function showModalLoading(containerId, message = "Carregando...") {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="modal-loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>${message}</p>
      </div>
    `;
  }
}

/**
 * Mostra erro em um container específico
 * @param {string} containerId - ID do container
 * @param {string} message - Mensagem de erro
 */
function showModalError(containerId, message = "Erro ao carregar dados") {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="modal-loading">
        <i class="fas fa-exclamation-triangle" style="color: var(--warning);"></i>
        <p style="color: var(--warning);">${message}</p>
        <button class="btn btn-primary" onclick="location.reload()">
          <i class="fas fa-refresh"></i>
          Tentar Novamente
        </button>
      </div>
    `;
  }
}

// Funções específicas para modais existentes (compatibilidade)
window.openStudentModal = () => openModal("addStudentModal");
window.openInstructorModal = () => openModal("addInstructorModal");
window.openVehicleModal = () => openModal("addVehicleModal");
window.openScheduleLessonModal = () => openModal("scheduleLessonModal");
window.openPaymentModal = () => openModal("paymentModal");

// Funções para modais de visualização
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleModal = toggleModal;
