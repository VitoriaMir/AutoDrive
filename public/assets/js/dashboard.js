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
                <i class="fas ${type === "success"
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
      // Students chart initialization moved to students-section.js
    } else if (sectionId === "students") {
      // Students performance chart initialization moved to students-section.js
    } else if (sectionId === "instructors") {
      // Instructors chart initialization moved to instructors-section.js
    } else if (sectionId === "vehicles") {
      // Vehicles chart initialization moved to vehicles-section.js
    } else if (sectionId === "schedule") {
      // Chart initialization handled by schedule-section.js
      // if (!scheduleChart) initScheduleChart();
    } else if (sectionId === "exams") {
      // Chart initialization handled by exams-section.js
      // if (!examsChart) initExamsChart();
    } else if (sectionId === "finance") {
      // Chart initialization handled by finance-section.js
      // if (!financeChart) initFinanceChart();
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
// Funções utilitárias para controle de overflow
function disableBodyScroll() {
  document.body.style.overflow = "hidden";
  console.log("[DEBUG] Scroll do body desabilitado");
}

function enableBodyScroll() {
  document.body.style.overflow = "auto";
  console.log("[DEBUG] Scroll do body habilitado");
}

// Função de emergência para restaurar scroll
function forceEnableBodyScroll() {
  document.body.style.overflow = "";
  document.body.style.removeProperty("overflow");
  document.body.classList.remove("modal-open");

  // Remover todos os overlays modais que possam estar interferindo
  const allModals = document.querySelectorAll(".modal, .modal-overlay");
  allModals.forEach((modal) => {
    modal.classList.remove("show");
    modal.style.display = "none";
  });

  // Garantir que não há elementos com pointer-events: none no body
  document.body.style.removeProperty("pointer-events");

  console.log("[DEBUG] Scroll do body forçadamente restaurado e modais limpos");
}

// Função completa para fechar modal com limpeza total
function forceCloseAllModals() {
  // Fechar todos os modais
  const allModals = document.querySelectorAll(
    ".modal.show, .modal-overlay.show"
  );
  allModals.forEach((modal) => {
    modal.classList.remove("show");
    if (modal.id) {
      console.log(`[DEBUG] Fechando modal: ${modal.id}`);
    }
  });

  // Restaurar scroll
  forceEnableBodyScroll();

  console.log("[DEBUG] Todos os modais fechados forçadamente");
}

// Disponibilizar globalmente para debug
window.forceEnableBodyScroll = forceEnableBodyScroll;
window.forceCloseAllModals = forceCloseAllModals;

// Função de diagnóstico completo
function diagnosePage() {
  console.log("=== DIAGNÓSTICO DA PÁGINA ===");
  console.log("Body overflow:", document.body.style.overflow);
  console.log("Body pointer-events:", document.body.style.pointerEvents);

  const allModals = document.querySelectorAll(".modal, .modal-overlay");
  console.log(`Total de modais: ${allModals.length}`);

  allModals.forEach((modal, index) => {
    const style = getComputedStyle(modal);
    console.log(`Modal ${index + 1} (${modal.id || "sem-id"}):`);
    console.log(`  - Classes: ${modal.className}`);
    console.log(`  - Display: ${style.display}`);
    console.log(`  - Opacity: ${style.opacity}`);
    console.log(`  - Z-index: ${style.zIndex}`);
    console.log(`  - Pointer-events: ${style.pointerEvents}`);
  });

  // Testar clique no centro da tela
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const elementsAtCenter = document.elementsFromPoint(centerX, centerY);
  console.log("Elementos no centro da tela:", elementsAtCenter.slice(0, 5));

  console.log("=== FIM DO DIAGNÓSTICO ===");
}

window.diagnosePage = diagnosePage;

// Função de teste específica para o modal de usuário
function testUserModal() {
  console.log("=== TESTE MODAL DE USUÁRIO ===");

  // Verificar se o modal existe
  const modal = document.getElementById("addUserModal");
  console.log("Modal encontrado:", !!modal);

  // Verificar se o formulário existe
  const form = document.getElementById("addUserForm");
  console.log("Formulário encontrado:", !!form);

  // Verificar campos essenciais
  const fields = ['userName', 'userEmail', 'userCpf', 'userPassword', 'userPasswordConfirm', 'userRole'];
  fields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    console.log(`Campo ${fieldId}:`, !!field);
  });

  // Testar abertura do modal
  if (modal && form) {
    console.log("Tentando abrir modal...");
    openModal("addUserModal");
    console.log("Modal possui classe 'show':", modal.classList.contains("show"));

    setTimeout(() => {
      console.log("Fechando modal de teste...");
      closeModal("addUserModal");
    }, 2000);
  }

  console.log("=== FIM DO TESTE ===");
}

window.testUserModal = testUserModal;

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("show");
    disableBodyScroll();
  }
}

function closeModal(modalId) {
  console.log(`[DEBUG] Fechando modal: ${modalId}`);
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
    // Forçar display none também para garantir
    setTimeout(() => {
      if (!modal.classList.contains("show")) {
        modal.style.display = "none";
      }
    }, 300);
    console.log(`[DEBUG] Classe 'show' removida do modal: ${modalId}`);
  } else {
    console.warn(`[DEBUG] Modal não encontrado: ${modalId}`);
  }

  // Verificar se ainda há modais abertos
  const remainingModals = document.querySelectorAll(
    ".modal.show, .modal-overlay.show"
  );
  console.log(`[DEBUG] Modais restantes abertos: ${remainingModals.length}`);

  // Só restaurar o scroll se não houver mais modais abertos
  if (remainingModals.length === 0) {
    enableBodyScroll();
    // Garantir que não há elementos invisíveis interferindo
    document.body.style.removeProperty("pointer-events");
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
      console.log("[DEBUG] Fechando modal por clique fora");
      // Usar a função closeModal padronizada
      closeModal(modal.id);
      // Limpar formulário se existir
      const form = modal.querySelector("form");
      if (form) {
        form.reset();
      }
    }
  }
});

// Close modal when pressing ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const openModal = document.querySelector(
      ".modal.show, .modal-overlay.show"
    );
    if (openModal) {
      console.log("[DEBUG] Fechando modal com tecla ESC");
      closeModal(openModal.id);
    }
  }
});

// Adicionar detector de problemas de clique
document.addEventListener(
  "click",
  (e) => {
    // Se o clique foi em um elemento que deveria ser clicável mas não funcionou
    const clickableElements = document.elementsFromPoint(e.clientX, e.clientY);
    console.log(
      "[DEBUG] Elementos no ponto do clique:",
      clickableElements.map(
        (el) =>
          el.tagName + (el.className ? "." + el.className.split(" ")[0] : "")
      )
    );

    // Verificar se há overlays invisíveis bloqueando
    const hasInvisibleOverlay = clickableElements.some(
      (el) =>
        el.classList.contains("modal-overlay") ||
        el.classList.contains("modal") ||
        getComputedStyle(el).pointerEvents === "none"
    );

    if (hasInvisibleOverlay) {
      console.warn("[DEBUG] Possível overlay invisível detectado!");
    }
  },
  true
); // Use capture para pegar antes de outros handlers

// Detector automático de modais fantasma
function checkForGhostModals() {
  const modals = document.querySelectorAll(".modal, .modal-overlay");
  const visibleModals = [];
  const hiddenModals = [];

  modals.forEach((modal) => {
    const style = getComputedStyle(modal);
    const isVisible =
      modal.classList.contains("show") ||
      style.display !== "none" ||
      style.opacity !== "0";

    if (isVisible && !modal.classList.contains("show")) {
      hiddenModals.push(modal);
    } else if (modal.classList.contains("show")) {
      visibleModals.push(modal);
    }
  });

  if (hiddenModals.length > 0) {
    console.warn("[DEBUG] Modais fantasma detectados:", hiddenModals);
    hiddenModals.forEach((modal) => {
      modal.style.display = "none";
      modal.classList.remove("show");
    });
  }

  // Se não há modais visíveis mas o body ainda tem overflow hidden
  if (visibleModals.length === 0 && document.body.style.overflow === "hidden") {
    console.warn(
      "[DEBUG] Body com overflow hidden sem modal visível - corrigindo"
    );
    enableBodyScroll();
  }
}

// Executar verificação a cada 3 segundos
setInterval(checkForGhostModals, 3000);

// Logout button
document.getElementById("logout-btn").addEventListener("click", () => {
  // Usar modal elegante em vez do confirm nativo
  if (typeof showLogoutModal === "function") {
    showLogoutModal();
  } else {
    // Fallback para Firebase logout se o modal não estiver disponível
    if (confirm("Tem certeza que deseja sair do sistema?")) {
      showNotification("Encerrando sessão...", "warning");
      setTimeout(() => {
        if (typeof auth !== 'undefined' && auth && auth.currentUser) {
          auth.signOut().then(() => {
            window.location.href = '/login.html';
          }).catch(() => {
            window.location.href = '/login.html';
          });
        } else {
          window.location.href = '/login.html';
        }
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

  // Load real data after animation
  setTimeout(async () => {
    try {
      // Initialize Firestore first
      if (typeof initializeFirestore === 'function') {
        initializeFirestore();
        console.log('🔥 Firestore initialized');

        // Wait for Firestore to be ready
        setTimeout(async () => {
          try {
            if (window.FirestoreManager) {
              console.log('📊 Loading real data...');

              // Get students
              const students = await window.FirestoreManager.getStudents();
              if (students && students.length > 0) {
                document.getElementById("students-count").textContent = students.length;
                console.log(`✅ Students: ${students.length}`);
              }

              // Get instructors
              const instructors = await window.FirestoreManager.getInstructors();
              if (instructors && instructors.length > 0) {
                document.getElementById("lessons-count").textContent = instructors.length;
                console.log(`✅ Instructors: ${instructors.length}`);
              }

              // Get vehicles
              const vehicles = await window.FirestoreManager.getVehicles();
              if (vehicles && vehicles.length > 0) {
                document.getElementById("vehicles-count").textContent = vehicles.length;
                console.log(`✅ Vehicles: ${vehicles.length}`);
              }

              // Get payments for revenue
              try {
                if (window.FirestoreManager.getAllPayments) {
                  const payments = await window.FirestoreManager.getAllPayments();
                  if (payments && payments.length > 0) {
                    const revenue = payments
                      .filter(p => p && p.status === 'Pago')
                      .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
                    const revenueElement = document.getElementById("revenue-count");
                    if (revenueElement) {
                      revenueElement.textContent = `R$ ${revenue.toLocaleString()}`;
                    }
                    console.log(`✅ Revenue: R$ ${revenue}`);
                  }
                }
              } catch (revenueError) {
                console.warn('⚠️ Error loading revenue:', revenueError);
              }

              console.log('🎉 Real data loaded successfully!');
            } else {
              console.warn('⚠️ FirestoreManager not available');
            }
          } catch (error) {
            console.error('❌ Error loading real data:', error);
          }
        }, 3000);
      }
    } catch (error) {
      console.warn('⚠️ Firestore not available, using static data');
    }
  }, 2000);

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

  // Setup form event listeners
  setupFormEventListeners();
});

// Function to setup all form event listeners
function setupFormEventListeners() {
  // Add Student Form
  const addStudentForm = document.getElementById("addStudentForm");
  if (addStudentForm) {
    addStudentForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Mostrar loading no botão
      const submitBtn = addStudentForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        LoadingManager.showButtonLoading('addStudentForm', 'Salvando...');
      }

      try {
        // Aqui você pode adicionar a lógica real para salvar no Firestore
        // await FirestoreManager.addStudent(formData);

        // Simular delay para demonstrar loading
        await new Promise(resolve => setTimeout(resolve, 1500));

        showNotification("Novo aluno adicionado com sucesso!", "success");
        closeModal("addStudentModal");
        e.target.reset();

        // Recarregar lista se estiver na seção de alunos
        if (document.querySelector('.menu-item[data-section="students"]').classList.contains('active')) {
          loadAllStudentsData();
        }

      } catch (error) {
        showNotification("Erro ao adicionar aluno: " + error.message, "error");
      } finally {
        // Esconder loading do botão
        if (submitBtn) {
          LoadingManager.hideButtonLoading('addStudentForm');
        }
      }
    });
  }

  // Add User Form
  const addUserForm = document.getElementById("addUserForm");
  if (addUserForm) {
    addUserForm.addEventListener("submit", (e) => {
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
      const passwordStrength = document.getElementById("passwordStrength");
      const passwordMatch = document.getElementById("passwordMatch");
      if (passwordStrength) passwordStrength.style.display = "none";
      if (passwordMatch) passwordMatch.style.display = "none";
    });
  }

  // Add Exam Form
  const examForm = document.getElementById("examForm");
  if (examForm) {
    examForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const studentName = document.getElementById("examStudent");
      const examType = document.getElementById("examType").value;
      const examDate = document.getElementById("examDate").value;
      const examTime = document.getElementById("examTime").value;

      if (!studentName.value || !examType || !examDate || !examTime) {
        showNotification("Preencha todos os campos obrigatórios!", "error");
        return;
      }

      const studentText = studentName.options[studentName.selectedIndex].text;
      showNotification(`✅ Exame ${examType} agendado para ${studentText}!`, "success");
      showNotification(`📅 Data: ${new Date(examDate).toLocaleDateString()} às ${examTime}`, "info");
      closeModal("examModal");
      e.target.reset();
    });
  }
}

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

// ========= STUDENTS FUNCTIONS MOVED TO students-section.js =========

// loadAllStudentsData function moved to students-section.js
// } catch (error) {
// Error handling moved to students-section.js
// }
// } - End of loadAllStudentsData function moved to students-section.js

// renderStudentsList function moved to students-section.js


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
        `Atualizando gráfico para ${e.target.options[e.target.selectedIndex].text
        }...`,
        "info"
      );
      // Here you would update the chart with new data
    });
  }
});

function assignLesson(instructorId) {
  showNotification(`Agendando aula para instrutor ${instructorId}...`, "info");
  // Here you would open lesson assignment modal
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
        `Atualizando gráfico de instrutores para ${e.target.options[e.target.selectedIndex].text
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
                <strong style="color: var(--text-primary, #333); font-size: 16px;">${user.name
        }</strong>
                <span class="badge ${roleClass}" style="
                  padding: 4px 8px;
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: 500;
                ">${roleText}</span>
              </div>
              <div style="color: var(--text-secondary, #6c757d); font-size: 14px; margin-bottom: 3px;">
                <i class="fas fa-envelope" style="width: 14px;"></i> ${user.email
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
              <div style="font-size: 13px; color: var(--text-primary, #333);">${user.lastAccess
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
              <button onclick="viewUserProfile(${user.id
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
              
              <button onclick="editUser(${user.id
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
              
              <button onclick="resetUserPassword(${user.id
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
              
              <button onclick="toggleUserStatus(${user.id
        })" class="btn-icon" title="Ativar/Desativar" style="
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 6px;
                background: var(--background-secondary, #f8f9fa);
                color: ${user.status === "active"
          ? "var(--danger-color, #dc3545)"
          : "var(--success-color, #28a745)"
        };
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
              " onmouseover="this.style.background='${user.status === "active"
          ? "var(--danger-color, #dc3545)"
          : "var(--success-color, #28a745)"
        }'; this.style.color='white';"
                 onmouseout="this.style.background='var(--background-secondary, #f8f9fa)'; this.style.color='${user.status === "active"
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
        `Usuário ${action === "desativar" ? "desativado" : "ativado"
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
        `Carregando cronograma para ${e.target.options[e.target.selectedIndex].text
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
        `Atualizando gráfico de veículos para ${e.target.options[e.target.selectedIndex].text
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
  // Tentar múltiplas abordagens para garantir que funciona
  try {
    console.log("createTemplate() executada");

    const modal = document.getElementById("createTemplateModal");
    if (!modal) {
      console.error("Modal createTemplateModal não encontrado no DOM!");
      showNotification(
        "Erro: Modal de criação de template não encontrado",
        "error"
      );
      return;
    }

    // Limpar classes e estilos anteriores
    modal.classList.remove("show");
    modal.style.display = "none";

    // Forçar recálculo do layout
    modal.offsetHeight;

    // Aplicar classes e estilos para mostrar
    modal.classList.add("show");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    console.log("Modal exibido com sucesso");
  } catch (error) {
    console.error("Erro ao abrir modal:", error);
    showNotification(
      "Erro ao abrir modal de criação de template: " + error.message,
      "error"
    );
  }
}

// Função de teste - pode ser chamada no console do navegador
function testCreateTemplateModal() {
  console.log("=== TESTE DE MODAL ===");
  console.log("Versão do script: 2.0");

  const modal = document.getElementById("createTemplateModal");
  console.log("Modal encontrado:", modal);

  if (modal) {
    modal.classList.add("show");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    console.log("Modal de teste aberto!");

    setTimeout(() => {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.style.overflow = "auto";
      console.log("Modal de teste fechado automaticamente");
    }, 3000);
  }
}

function submitTemplate() {
  const form = document.getElementById("createTemplateForm");
  const formData = new FormData(form);

  // Pegar os valores do formulário
  const templateName = formData.get("templateName");
  const templateCategory = formData.get("templateCategory");
  const templateDescription = formData.get("templateDescription");
  const templateFrequency = formData.get("templateFrequency");
  const templateFormat = formData.get("templateFormat");

  // Pegar seções selecionadas
  const sections = formData.getAll("sections");

  // Validação básica
  if (!templateName || !templateCategory) {
    showNotification("Por favor, preencha os campos obrigatórios.", "error");
    return;
  }

  // Aqui você faria a requisição para o backend
  const templateData = {
    name: templateName,
    category: templateCategory,
    description: templateDescription,
    frequency: templateFrequency,
    format: templateFormat,
    sections: sections,
  };

  console.log("Dados do template:", templateData);

  // Simular salvamento
  showNotification(`Modelo "${templateName}" criado com sucesso!`, "success");

  // Fechar modal e limpar formulário
  closeModal("createTemplateModal");
  form.reset();

  // Aqui você poderia atualizar a lista de templates na interface
  // updateTemplatesList();
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
                <h4 style="margin: 0; color: var(--text-primary, #333);">${report.title
        }</h4>
                <span class="status-badge status-${statusClass}" style="
                  padding: 4px 8px; 
                  border-radius: 12px; 
                  font-size: 12px; 
                  font-weight: 500;
                  background-color: ${statusClass === "success"
          ? "#d4edda"
          : statusClass === "info"
            ? "#d1ecf1"
            : statusClass === "warning"
              ? "#fff3cd"
              : "#f8d7da"
        };
                  color: ${statusClass === "success"
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
                  <i class="fas fa-user" style="width: 16px;"></i> ${report.generatedBy
        }
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-calendar" style="width: 16px;"></i> ${formattedDate}
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-clock" style="width: 16px;"></i> ${formattedTime}
                </small>
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-file" style="width: 16px;"></i> ${report.format
        }
                </small>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-calendar-alt" style="width: 16px;"></i> ${report.period
        }
                </small>
                ${report.size
          ? `
                  <small style="color: var(--text-secondary, #6c757d);">
                    <i class="fas fa-hdd" style="width: 16px;"></i> ${report.size}
                  </small>
                `
          : ""
        }
                <small style="color: var(--text-secondary, #6c757d);">
                  <i class="fas fa-download" style="width: 16px;"></i> ${report.downloads
        } downloads
                </small>
                ${report.lastAccess
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
              ${report.status === "completed"
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
              ${report.status === "processing"
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
              ${report.status === "scheduled"
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
    `Tema alterado para: ${theme === "light" ? "Claro" : theme === "dark" ? "Escuro" : "Automático"
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
    // Fallback para Firebase logout se o modal não estiver disponível
    if (confirm("Tem certeza que deseja sair do sistema?")) {
      showNotification("Saindo do sistema...", "warning");
      setTimeout(() => {
        if (typeof auth !== 'undefined' && auth && auth.currentUser) {
          auth.signOut().then(() => {
            window.location.href = '/login.html';
          }).catch(() => {
            window.location.href = '/login.html';
          });
        } else {
          window.location.href = '/login.html';
        }
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
          <i class="fas ${type === "success"
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
      `Gráfico atualizado para ${period == 6
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

  // Usar a função padronizada openModal para consistência
  openModal("scheduleLessonModal");

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
    status: 'active'
  };

  try {
    showNotification("Cadastrando instrutor...", "info");

    // Verificar se FirestoreManager está disponível
    if (!window.FirestoreManager) {
      throw new Error("Sistema de banco de dados não inicializado");
    }

    const result = await window.FirestoreManager.addInstructor(instructorData);

    showNotification("Instrutor cadastrado com sucesso!", "success");
    closeModal("addInstructorModal");
    form.reset();

    console.log('✅ Instrutor cadastrado:', result);

  } catch (error) {
    console.error("❌ Erro ao cadastrar instrutor:", error);
    showNotification("Erro ao cadastrar instrutor: " + error.message, "error");
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
    status: 'available'
  };

  try {
    showNotification("Cadastrando veículo...", "info");

    // Verificar se FirestoreManager está disponível
    if (!window.FirestoreManager) {
      throw new Error("Sistema de banco de dados não inicializado");
    }

    const result = await window.FirestoreManager.addVehicle(vehicleData);

    showNotification("Veículo cadastrado com sucesso!", "success");
    closeModal("addVehicleModal");
    form.reset();

    console.log('✅ Veículo cadastrado:', result);

  } catch (error) {
    console.error("❌ Erro ao cadastrar veículo:", error);
    showNotification("Erro ao cadastrar veículo: " + error.message, "error");
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
    birthDate: formData.get("birth_date"),
    category: formData.get("category"),
    address: formData.get("address"),
    notes: formData.get("notes"),
    status: 'active'
  };

  try {
    showNotification("Cadastrando aluno...", "info");

    // Verificar se FirestoreManager está disponível
    if (!window.FirestoreManager) {
      throw new Error("Sistema de banco de dados não inicializado");
    }

    const result = await window.FirestoreManager.addStudent(studentData);

    showNotification("Aluno cadastrado com sucesso!", "success");
    closeModal("addStudentModal");
    form.reset();

    console.log('✅ Aluno cadastrado:', result);

  } catch (error) {
    console.error("❌ Erro ao cadastrar aluno:", error);
    showNotification("Erro ao cadastrar aluno: " + error.message, "error");
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

// ------------------------------------------------------

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

  // Fazer logout com Firebase
  setTimeout(() => {
    if (typeof auth !== 'undefined' && auth && auth.currentUser) {
      auth.signOut().then(() => {
        console.log('✅ Logout realizado com sucesso');
        window.location.href = '/login.html';
      }).catch((error) => {
        console.error('❌ Erro no logout:', error);
        alert('Erro ao fazer logout: ' + error.message);
        // Resetar botão em caso de erro
        confirmBtn.classList.remove("loading");
        confirmBtn.innerHTML = "<i class='fas fa-sign-out-alt'></i> Sair";
      });
    } else {
      // Se não há usuário autenticado, só redirecionar
      window.location.href = '/login.html';
    }
  }, 1000);
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
window.openUserModal = () => openModal("addUserModal");
window.openExamModal = () => openModal("examModal");
window.openPaymentModal = () => openModal("paymentModal");

// Funções para modais de visualização
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleModal = toggleModal;
