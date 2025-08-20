/**
 * Settings Section JavaScript
 * Contém todas as funções relacionadas à seção de configurações
 */

// ============================================
// GERENCIAMENTO DE CONFIGURAÇÕES
// ============================================

/**
 * Carrega dados de configurações
 */
async function loadSettingsData() {
    try {
        console.log("Loading settings data...");
        initializeSettingsTabs();
        loadCompanySettings();
    } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        showNotification("Erro ao carregar configurações", "error");
    }
}

/**
 * Inicializa as abas de configurações
 */
function initializeSettingsTabs() {
    const tabs = document.querySelectorAll('.settings-tab');
    const contents = document.querySelectorAll('.settings-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const targetId = this.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

/**
 * Carrega configurações da empresa
 */
function loadCompanySettings() {
    // Simular carregamento de dados da empresa
    const companyData = {
        name: "AutoDrive Escola de Trânsito",
        email: "contato@autodrive.com.br",
        phone: "(11) 99999-9999",
        address: "Rua das Autoescolas, 123",
        cnpj: "12.345.678/0001-90"
    };

    // Preencher formulário se existir
    const form = document.getElementById('company-settings-form');
    if (form) {
        Object.keys(companyData).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = companyData[key];
            }
        });
    }
}

// ============================================
// AÇÕES DE CONFIGURAÇÕES
// ============================================

function saveCompanySettings() {
    showNotification("Salvando configurações da empresa...", "info");
}

function saveUserSettings() {
    showNotification("Salvando configurações de usuário...", "info");
}

function saveSecuritySettings() {
    showNotification("Salvando configurações de segurança...", "info");
}

function saveSystemSettings() {
    showNotification("Salvando configurações do sistema...", "info");
}

function resetSettings() {
    if (confirm("Tem certeza que deseja restaurar as configurações padrão?")) {
        showNotification("Restaurando configurações padrão...", "info");
    }
}

function exportSettings() {
    showNotification("Exportando configurações...", "info");
}

function importSettings() {
    showNotification("Importando configurações...", "info");
}

// ============================================
// GERENCIAMENTO DE USUÁRIOS
// ============================================

function addUser() {
    showNotification("Adicionando novo usuário...", "info");
}

function editUser(userId) {
    showNotification(`Editando usuário ${userId}`, "info");
}

function deleteUser(userId) {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
        showNotification(`Excluindo usuário ${userId}`, "info");
    }
}

function changeUserPassword(userId) {
    showNotification(`Alterando senha do usuário ${userId}`, "info");
}

// ============================================
// CONFIGURAÇÕES DE APARÊNCIA
// ============================================

function changeTheme(theme) {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('theme', theme);
    showNotification(`Tema alterado para ${theme}`, "success");
}

function changeFontSize(size) {
    document.documentElement.style.fontSize = `${size}px`;
    localStorage.setItem('fontSize', size);
    showNotification(`Tamanho da fonte alterado`, "success");
}

// ============================================
// INICIALIZAÇÃO
// ============================================

function initSettingsSection() {
    console.log("Initializing settings section...");
    setTimeout(() => {
        loadSettingsData();

        // Configurar eventos de formulários
        const forms = document.querySelectorAll('.settings-form');
        forms.forEach(form => {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const formId = this.id;

                switch (formId) {
                    case 'company-settings-form':
                        saveCompanySettings();
                        break;
                    case 'user-settings-form':
                        saveUserSettings();
                        break;
                    case 'security-settings-form':
                        saveSecuritySettings();
                        break;
                    case 'system-settings-form':
                        saveSystemSettings();
                        break;
                }
            });
        });
    }, 100);
}

// Event listeners
document.addEventListener('sectionLoaded', function (event) {
    if (event.detail.sectionId === 'settings-section') {
        console.log("Settings section loaded, initializing...");
        initSettingsSection();
    }
});

// Exposição global
window.loadSettingsData = loadSettingsData;
window.saveCompanySettings = saveCompanySettings;
window.saveUserSettings = saveUserSettings;
window.saveSecuritySettings = saveSecuritySettings;
window.saveSystemSettings = saveSystemSettings;
window.resetSettings = resetSettings;
window.exportSettings = exportSettings;
window.importSettings = importSettings;
window.addUser = addUser;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.changeUserPassword = changeUserPassword;
window.changeTheme = changeTheme;
window.changeFontSize = changeFontSize;
window.initSettingsSection = initSettingsSection;

console.log("Settings section JavaScript loaded successfully");
