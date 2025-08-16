// ===== FIREBASE LOGIN - BASEADO NO TEST-AUTH QUE FUNCIONAVA =====

let auth;

// Inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    initializeFirebase();
    setupFormHandlers();
});

// Inicializar Firebase (EXATAMENTE como no test-auth)
function initializeFirebase() {
    try {
        firebase.initializeApp(window.firebaseConfig);
        auth = firebase.auth();
        showMessage('✅ Firebase inicializado com sucesso!', 'success');
        
        // IMPORTANTE: SEM onAuthStateChanged aqui!
        // Deixar o usuário usar o formulário livremente
        
    } catch (error) {
        showMessage('❌ Erro ao inicializar Firebase: ' + error.message, 'error');
        console.error('Firebase error:', error);
    }
}

// Configurar event listeners do formulário
function setupFormHandlers() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    emailInput.addEventListener('input', clearErrors);
    passwordInput.addEventListener('input', clearErrors);

    // Carregar credenciais salvas
    loadRememberedCredentials();

    // Configurar modal
    setupModalHandlers();
}

// Função de login (COPIADA do test-auth)
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Validação
    if (!email || !password) {
        showMessage('❌ Preencha email e senha!', 'error');
        return;
    }

    // Mostrar loading
    setLoginLoading(true);
    
    try {
        // Fazer login
        await auth.signInWithEmailAndPassword(email, password);
        
        // Salvar credenciais se necessário
        if (remember) {
            saveCredentials(email);
        } else {
            clearSavedCredentials();
        }
        
        // Sucesso - redirecionar
        showMessage('✅ Login realizado com sucesso!', 'success');
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1500);
        
    } catch (error) {
        handleLoginError(error);
        setLoginLoading(false);
    }
}

// Tratar erros de login
function handleLoginError(error) {
    let message = 'Erro ao fazer login. Tente novamente.';
    
    switch (error.code) {
        case 'auth/user-not-found':
            message = '❌ Usuário não encontrado. Verifique o email.';
            break;
        case 'auth/wrong-password':
            message = '❌ Senha incorreta. Tente novamente.';
            break;
        case 'auth/invalid-email':
            message = '❌ Email inválido. Verifique o formato.';
            break;
        case 'auth/user-disabled':
            message = '❌ Esta conta foi desativada.';
            break;
        case 'auth/too-many-requests':
            message = '❌ Muitas tentativas. Tente novamente em alguns minutos.';
            break;
        default:
            message = `❌ Erro: ${error.message}`;
    }
    
    showMessage(message, 'error');
}

// Mostrar mensagens
function showMessage(text, type = 'info') {
    const messageArea = document.getElementById('messageArea');
    const messageContent = document.getElementById('messageContent');
    
    messageContent.textContent = text;
    messageArea.className = `message-area ${type}`;
    messageArea.style.display = 'block';
    
    // Auto-hide após 5 segundos
    if (type === 'success' || type === 'info') {
        setTimeout(hideMessage, 5000);
    }
}

// Ocultar mensagens
function hideMessage() {
    const messageArea = document.getElementById('messageArea');
    messageArea.style.display = 'none';
}

// Limpar erros
function clearErrors() {
    hideMessage();
}

// Loading no botão
function setLoginLoading(isLoading) {
    const loginBtn = document.getElementById('loginBtn');
    const btnText = document.getElementById('btnText');
    const btnIcon = document.getElementById('btnIcon');
    const spinner = document.getElementById('spinner');

    if (isLoading) {
        loginBtn.disabled = true;
        btnText.textContent = 'Entrando...';
        btnIcon.style.display = 'none';
        spinner.style.display = 'inline-block';
        loginBtn.classList.add('loading');
    } else {
        loginBtn.disabled = false;
        btnText.textContent = 'Entrar';
        btnIcon.style.display = 'inline-block';
        spinner.style.display = 'none';
        loginBtn.classList.remove('loading');
    }
}

// Alternar visibilidade da senha
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('passwordToggleIcon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Esqueci senha
function forgotPassword() {
    const email = document.getElementById('email').value.trim();
    
    if (!email) {
        showMessage('❌ Digite seu email primeiro, depois clique em "Esqueci minha senha"', 'error');
        return;
    }
    
    auth.sendPasswordResetEmail(email)
        .then(() => {
            showMessage(`✅ Email de recuperação enviado para ${email}`, 'success');
        })
        .catch((error) => {
            let message = '❌ Erro ao enviar email de recuperação.';
            if (error.code === 'auth/user-not-found') {
                message = '❌ Email não encontrado no sistema.';
            }
            showMessage(message, 'error');
        });
}

// Salvar credenciais
function saveCredentials(email) {
    if (typeof Storage !== 'undefined') {
        localStorage.setItem('autodrive_saved_email', email);
    }
}

// Carregar credenciais salvas
function loadRememberedCredentials() {
    if (typeof Storage !== 'undefined') {
        const savedEmail = localStorage.getItem('autodrive_saved_email');
        if (savedEmail) {
            document.getElementById('email').value = savedEmail;
            document.getElementById('remember').checked = true;
        }
    }
}

// Limpar credenciais salvas
function clearSavedCredentials() {
    if (typeof Storage !== 'undefined') {
        localStorage.removeItem('autodrive_saved_email');
    }
}

// ===== MODAL DO ADMINISTRADOR =====

function showRegisterInfo() {
    document.getElementById('adminContactModal').style.display = 'block';
}

function setupModalHandlers() {
    const modal = document.getElementById('adminContactModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const adminForm = document.getElementById('adminContactForm');

    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
    if (cancelBtn) cancelBtn.onclick = () => modal.style.display = 'none';

    // Fechar ao clicar fora
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Enviar formulário
    if (adminForm) {
        adminForm.addEventListener('submit', handleAdminContact);
    }
}

function handleAdminContact(event) {
    event.preventDefault();
    showMessage('✅ Mensagem enviada! O administrador entrará em contato em breve.', 'success');
    document.getElementById('adminContactModal').style.display = 'none';
    event.target.reset();
}
