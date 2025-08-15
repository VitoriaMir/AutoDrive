// ===== FIREBASE AUTHENTICATION LOGIN =====

// Variáveis globais
let auth;
let isFirebaseInitialized = false;
let loginInProgress = false; // Flag para controlar redirecionamento

// Esperar o DOM carregar completamente
document.addEventListener("DOMContentLoaded", function () {
  initializeFirebase();
  initializeLogin();
});

// Inicializar Firebase
function initializeFirebase() {
  try {
    if (typeof firebase !== 'undefined' && window.firebaseConfig) {
      firebase.initializeApp(window.firebaseConfig);
      auth = firebase.auth();
      isFirebaseInitialized = true;
      
      // Monitorar estado de autenticação - APENAS para login ativo
      auth.onAuthStateChanged((user) => {
        // SOMENTE redirecionar quando loginInProgress for true
        if (user && loginInProgress) {
          showMessage('Login realizado com sucesso! Redirecionando...', 'success');
          setTimeout(() => {
            window.location.href = '/dashboard.html';
          }, 1500);
        }
        // NÃO fazer nada se usuário já estiver logado - permitir uso normal do formulário
      });
      
      console.log('🔥 Firebase Authentication inicializado');
    } else {
      console.error('Firebase não está disponível ou configuração não encontrada');
      showMessage('Erro ao inicializar sistema de autenticação', 'error');
    }
  } catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
    showMessage('Erro ao inicializar sistema de autenticação', 'error');
  }
}

// Função principal de inicialização
function initializeLogin() {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Event listeners
  loginForm.addEventListener("submit", handleLogin);
  emailInput.addEventListener("input", clearErrors);
  passwordInput.addEventListener("input", clearErrors);

  // Recuperar dados salvos (se houver)
  loadRememberedCredentials();

  // Modal do admin
  setupModalHandlers();

  console.log("Login system initialized");
}

// Função para alternar visibilidade da senha
function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.getElementById("passwordToggleIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}

// Função para lidar com o login - INTEGRADA COM FIREBASE
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const remember = document.getElementById("remember").checked;

  // Limpar erros anteriores
  clearErrors();
  hideMessage();

  // Validação básica
  if (!email || !password) {
    showMessage('Por favor, preencha todos os campos', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showMessage('Por favor, digite um email válido', 'error');
    return;
  }

  if (!isFirebaseInitialized) {
    showMessage('Sistema de autenticação não inicializado', 'error');
    return;
  }

  // Mostrar estado de carregamento
  setLoginLoading(true);
  loginInProgress = true; // Marcar que o login está em progresso

  try {
    // Login com Firebase Authentication
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    console.log('Login bem-sucedido:', user.email);

    // Salvar credenciais se solicitado
    if (remember) {
      saveCredentials(email);
    } else {
      clearSavedCredentials();
    }

    // Sucesso - redirecionamento será feito pelo onAuthStateChanged
    showMessage('Login realizado com sucesso!', 'success');

  } catch (error) {
    console.error('Erro no login:', error);
    loginInProgress = false; // Reset da flag em caso de erro
    handleLoginError(error);
  } finally {
    setLoginLoading(false);
  }
}

// Mostrar quando usuário já está logado
function showUserAlreadyLoggedIn(user) {
  const messageArea = document.getElementById('messageArea');
  const messageContent = document.getElementById('messageContent');
  
  messageContent.innerHTML = `
    <div style="text-align: center;">
      <p><strong>Você já está logado como:</strong></p>
      <p style="color: #0066cc; font-weight: 500;">${user.email}</p>
      <div style="margin-top: 15px;">
        <button onclick="continueToApp()" style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; margin-right: 10px; cursor: pointer;">
          Continuar para o App
        </button>
        <button onclick="logoutAndStay()" style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
          Sair e Fazer Novo Login
        </button>
      </div>
    </div>
  `;
  
  messageArea.className = 'message-area info';
  messageArea.style.display = 'block';
  
  // Esconder o formulário de login
  document.getElementById('loginForm').style.opacity = '0.5';
  document.getElementById('loginForm').style.pointerEvents = 'none';
}

// Continuar para o app com usuário já logado
function continueToApp() {
  showMessage('Redirecionando...', 'success');
  setTimeout(() => {
    window.location.href = '/dashboard.html';
  }, 1000);
}

// Fazer logout e permitir novo login
async function logoutAndStay() {
  try {
    await auth.signOut();
    hideMessage();
    document.getElementById('loginForm').style.opacity = '1';
    document.getElementById('loginForm').style.pointerEvents = 'auto';
    showMessage('Logout realizado. Faça login com uma conta diferente.', 'info');
  } catch (error) {
    console.error('Erro no logout:', error);
    showMessage('Erro ao fazer logout: ' + error.message, 'error');
  }
}

// Tratar erros de login
function handleLoginError(error) {
  let message = 'Erro ao fazer login. Tente novamente.';
  
  switch (error.code) {
    case 'auth/user-not-found':
      message = 'Usuário não encontrado. Verifique o email.';
      break;
    case 'auth/wrong-password':
      message = 'Senha incorreta. Tente novamente.';
      break;
    case 'auth/invalid-email':
      message = 'Email inválido. Verifique o formato.';
      break;
    case 'auth/user-disabled':
      message = 'Esta conta foi desabilitada. Contate o administrador.';
      break;
    case 'auth/too-many-requests':
      message = 'Muitas tentativas falharam. Tente novamente mais tarde.';
      break;
    case 'auth/network-request-failed':
      message = 'Erro de conexão. Verifique sua internet.';
      break;
    case 'auth/invalid-credential':
      message = 'Credenciais inválidas. Verifique email e senha.';
      break;
    default:
      message = `Erro: ${error.message}`;
  }
  
  showMessage(message, 'error');
}

// Função para esqueci minha senha - INTEGRADA COM FIREBASE
async function forgotPassword() {
  const email = document.getElementById("email").value.trim();
  
  if (!email) {
    showMessage('Digite seu email primeiro para recuperar a senha', 'info');
    document.getElementById("email").focus();
    return;
  }

  if (!isValidEmail(email)) {
    showMessage('Por favor, digite um email válido', 'error');
    document.getElementById("email").focus();
    return;
  }

  if (!isFirebaseInitialized) {
    showMessage('Sistema de autenticação não inicializado', 'error');
    return;
  }

  try {
    await auth.sendPasswordResetEmail(email);
    showMessage('Email de recuperação enviado! Verifique sua caixa de entrada.', 'success');
  } catch (error) {
    console.error('Erro ao enviar email de recuperação:', error);
    let message = 'Erro ao enviar email de recuperação.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'Email não encontrado. Verifique o endereço digitado.';
        break;
      case 'auth/invalid-email':
        message = 'Email inválido. Verifique o formato.';
        break;
      default:
        message = `Erro: ${error.message}`;
    }
    
    showMessage(message, 'error');
  }
}

// Estados do botão de login
function setLoginLoading(loading) {
  const loginBtn = document.getElementById('loginBtn');
  const btnText = document.getElementById('btnText');
  const btnIcon = document.getElementById('btnIcon');
  const spinner = document.getElementById('spinner');

  if (loading) {
    loginBtn.disabled = true;
    loginBtn.classList.add('loading');
    btnText.textContent = 'Entrando...';
    btnIcon.style.display = 'none';
    spinner.style.display = 'block';
  } else {
    loginBtn.disabled = false;
    loginBtn.classList.remove('loading');
    btnText.textContent = 'Entrar';
    btnIcon.style.display = 'block';
    spinner.style.display = 'none';
  }
}

// Mostrar mensagens
function showMessage(message, type) {
  const messageArea = document.getElementById('messageArea');
  const messageContent = document.getElementById('messageContent');
  
  messageContent.textContent = message;
  messageArea.className = `message-area ${type}`;
  messageArea.style.display = 'block';
  
  // Auto-hide para mensagens de sucesso
  if (type === 'success') {
    setTimeout(() => {
      hideMessage();
    }, 3000);
  }
}

// Esconder mensagens
function hideMessage() {
  const messageArea = document.getElementById('messageArea');
  messageArea.style.display = 'none';
}

// Limpar erros
function clearErrors() {
  hideMessage();
  
  // Remover classes de erro dos inputs
  document.querySelectorAll('.input-wrapper').forEach(wrapper => {
    wrapper.classList.remove('error', 'success');
  });
}

// Validar formato do email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para salvar credenciais no localStorage
function saveCredentials(email) {
  if (typeof Storage !== "undefined") {
    try {
      const credentials = { email: email, timestamp: Date.now() };
      localStorage.setItem("autodrive_remember", JSON.stringify(credentials));
    } catch (e) {
      console.warn("Não foi possível salvar as credenciais");
    }
  }
}

// Função para carregar credenciais salvas
function loadRememberedCredentials() {
  if (typeof Storage !== "undefined") {
    try {
      const saved = localStorage.getItem("autodrive_remember");
      if (saved) {
        const credentials = JSON.parse(saved);
        // Verificar se não está muito antigo (30 dias)
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

        if (Date.now() - credentials.timestamp < thirtyDaysInMs) {
          document.getElementById("email").value = credentials.email;
          document.getElementById("remember").checked = true;
        } else {
          clearSavedCredentials();
        }
      }
    } catch (e) {
      console.warn("Erro ao carregar credenciais salvas");
    }
  }
}

// Função para limpar credenciais salvas
function clearSavedCredentials() {
  if (typeof Storage !== "undefined") {
    try {
      localStorage.removeItem("autodrive_remember");
    } catch (e) {
      console.warn("Erro ao limpar credenciais salvas");
    }
  }
}

// Função para mostrar informações sobre registro
function showRegisterInfo() {
  const modal = document.getElementById("adminContactModal");
  modal.classList.add("show");

  // Focar no primeiro campo do formulário
  setTimeout(() => {
    document.getElementById("senderName").focus();
  }, 300);
}

// Configurar handlers do modal
function setupModalHandlers() {
  const modal = document.getElementById("adminContactModal");
  const closeBtn = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const form = document.getElementById("adminContactForm");

  // Fechar modal
  closeBtn.onclick = () => modal.classList.remove("show");
  cancelBtn.onclick = () => modal.classList.remove("show");

  // Fechar ao clicar fora
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.classList.remove("show");
    }
  };

  // Submissão do formulário
  form.onsubmit = (e) => {
    e.preventDefault();
    // Simular envio
    showMessage("Mensagem enviada ao administrador!", "success");
    modal.classList.remove("show");
    form.reset();
  };
}
