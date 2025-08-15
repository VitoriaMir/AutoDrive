// ===== FIREBASE AUTHENTICATION LOGIN - VERSÃO SIMPLIFICADA =====

let auth;
let isFirebaseInitialized = false;

// Esperar o DOM carregar completamente
document.addEventListener("DOMContentLoaded", function () {
  initializeFirebase();
  initializeLogin();
});

// Inicializar Firebase (versão simplificada baseada no test-auth)
function initializeFirebase() {
  try {
    if (typeof firebase !== 'undefined' && window.firebaseConfig) {
      firebase.initializeApp(window.firebaseConfig);
      auth = firebase.auth();
      isFirebaseInitialized = true;
      
      showMessage('Firebase inicializado com sucesso!', 'success');
      
      // REMOVIDO: onAuthStateChanged que causava redirecionamento automático
      // O login só acontecerá quando o usuário clicar no botão "Entrar"
      
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

// Função para lidar com o login - SIMPLIFICADA
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

  if (!isFirebaseInitialized) {
    showMessage('Sistema de autenticação não inicializado. Recarregue a página.', 'error');
    return;
  }

  // Mostrar loading
  setLoginLoading(true);

  try {
    // Fazer login com Firebase
    await auth.signInWithEmailAndPassword(email, password);
    
    // Salvar dados se "lembrar" estiver marcado
    if (remember) {
      saveCredentials(email);
    } else {
      clearSavedCredentials();
    }
    
    // Sucesso - fazer redirecionamento manual
    showMessage('Login realizado com sucesso! Redirecionando...', 'success');
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 1500);
    
  } catch (error) {
    console.error('Erro no login:', error);
    handleLoginError(error);
    setLoginLoading(false);
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
      message = 'Esta conta foi desativada. Contate o administrador.';
      break;
    case 'auth/too-many-requests':
      message = 'Muitas tentativas. Tente novamente em alguns minutos.';
      break;
    case 'auth/network-request-failed':
      message = 'Erro de conexão. Verifique sua internet.';
      break;
    default:
      message = `Erro: ${error.message}`;
  }
  
  showMessage(message, 'error');
}

// Mostrar/Ocultar loading no botão
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

// Mostrar mensagens
function showMessage(text, type = 'info') {
  const messageArea = document.getElementById('messageArea');
  const messageContent = document.getElementById('messageContent');
  
  messageContent.textContent = text;
  messageArea.className = `message-area ${type}`;
  messageArea.style.display = 'block';
  
  // Auto-hide após 5 segundos para mensagens de sucesso/info
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

// Salvar credenciais no localStorage
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

// Função de esqueci senha
function forgotPassword() {
  const email = document.getElementById('email').value.trim();
  
  if (!email) {
    showMessage('Digite seu email primeiro, depois clique em "Esqueci minha senha"', 'error');
    return;
  }
  
  if (!isFirebaseInitialized) {
    showMessage('Sistema não inicializado. Recarregue a página.', 'error');
    return;
  }
  
  auth.sendPasswordResetEmail(email)
    .then(() => {
      showMessage(`Email de recuperação enviado para ${email}. Verifique sua caixa de entrada.`, 'success');
    })
    .catch((error) => {
      console.error('Erro ao enviar email de recuperação:', error);
      let message = 'Erro ao enviar email de recuperação.';
      
      if (error.code === 'auth/user-not-found') {
        message = 'Email não encontrado no sistema.';
      }
      
      showMessage(message, 'error');
    });
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

  // Fechar modal
  closeBtn.onclick = () => modal.style.display = 'none';
  cancelBtn.onclick = () => modal.style.display = 'none';

  // Fechar ao clicar fora
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };

  // Enviar formulário
  adminForm.addEventListener('submit', handleAdminContact);
}

function handleAdminContact(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  
  // Simular envio (aqui você integraria com email/webhook)
  showMessage('Mensagem enviada! O administrador entrará em contato em breve.', 'success');
  document.getElementById('adminContactModal').style.display = 'none';
  event.target.reset();
}
