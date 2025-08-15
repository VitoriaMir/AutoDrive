// ===== FIREBASE AUTHENTICATION LOGIN =====

// Variáveis globais
let auth;
let isFirebaseInitialized = false;

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
      
      // Monitorar estado de autenticação
      auth.onAuthStateChanged((user) => {
        if (user) {
          showMessage('Login realizado com sucesso! Redirecionando...', 'success');
          setTimeout(() => {
            window.location.href = '/dashboard.html';
          }, 1500);
        }
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

  if (!isFirebaseInitialized) {
    showMessage('Sistema de autenticação não inicializado', 'error');
    return;
  }

  // Mostrar estado de carregamento
  setLoginLoading(true);

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
    handleLoginError(error);
  } finally {
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
      message = 'Esta conta foi desabilitada. Contate o administrador.';
      break;
    case 'auth/too-many-requests':
      message = 'Muitas tentativas falharam. Tente novamente mais tarde.';
      break;
    case 'auth/network-request-failed':
      message = 'Erro de conexão. Verifique sua internet.';
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

  // Validações
  if (!validateInputs(email, password)) {
    return;
  }

  // Mostrar estado de carregamento
  showLoadingState(loginBtn);

  try {
    // Autenticar usuário
    const result = await authenticateUser(email, password);

    if (result.success) {
      // Salvar credenciais se "lembrar de mim" estiver marcado
      if (remember) {
        saveCredentials(email);
      } else {
        clearSavedCredentials();
      }

      // Mostrar mensagem personalizada baseada no role
      let welcomeMessage = "Login realizado com sucesso!";
      if (result.role === "admin") {
        welcomeMessage = "Bem-vindo, Administrador!";
      } else if (result.role === "instructor") {
        welcomeMessage = "Bem-vindo, Instrutor!";
      } else {
        welcomeMessage = "Bem-vindo ao AutoDrive!";
      }

      // Sucesso no login
      showSuccessMessage(welcomeMessage);

      // Redirecionar após um breve delay
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } else {
      throw new Error(result.message || "Credenciais inválidas");
    }
  } catch (error) {
    showError(
      "login",
      error.message || "Erro ao fazer login. Tente novamente."
    );
  } finally {
    hideLoadingState(loginBtn);
  }
}

// Função para validar os inputs
function validateInputs(email, password) {
  let isValid = true;

  // Validar email
  if (!email) {
    showError("email", "Email é obrigatório");
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError("email", "Email inválido");
    isValid = false;
  }

  // Validar senha
  if (!password) {
    showError("password", "Senha é obrigatória");
    isValid = false;
  } else if (password.length < 6) {
    showError("password", "Senha deve ter pelo menos 6 caracteres");
    isValid = false;
  }

  return isValid;
}

// Função para validar formato do email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para mostrar erros
function showError(field, message) {
  const inputWrapper = document.querySelector(`#${field}`).parentNode;
  const inputGroup = inputWrapper.parentNode;
  const errorElement =
    inputGroup.querySelector(".error-message") || createErrorElement();

  inputWrapper.classList.add("error");
  errorElement.textContent = message;
  errorElement.classList.add("show");

  if (!inputGroup.querySelector(".error-message")) {
    inputGroup.appendChild(errorElement);
  }
}

// Função para criar elemento de erro
function createErrorElement() {
  const errorElement = document.createElement("div");
  errorElement.classList.add("error-message");
  return errorElement;
}

// Função para limpar erros
function clearErrors() {
  const errorElements = document.querySelectorAll(".error-message");
  const inputWrappers = document.querySelectorAll(".input-wrapper.error");

  errorElements.forEach((element) => {
    element.classList.remove("show");
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, 300);
  });

  inputWrappers.forEach((wrapper) => {
    wrapper.classList.remove("error");
  });
}

// Função para mostrar estado de carregamento
function showLoadingState(button) {
  button.classList.add("loading");
  const icon = button.querySelector("i");
  icon.classList.remove("fa-arrow-right");
  icon.classList.add("fa-spinner");
}

// Função para esconder estado de carregamento
function hideLoadingState(button) {
  button.classList.remove("loading");
  const icon = button.querySelector("i");
  icon.classList.remove("fa-spinner");
  icon.classList.add("fa-arrow-right");
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage() {
  const loginBtn = document.querySelector(".login-btn");
  const btnText = loginBtn.querySelector(".btn-text");
  const icon = loginBtn.querySelector("i");

  btnText.textContent = "Sucesso!";
  icon.classList.remove("fa-spinner");
  icon.classList.add("fa-check");
  loginBtn.style.background =
    "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)";
}

// Função para autenticar usuário
async function authenticateUser(email, password) {
  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return data; // Retorna o objeto completo com role
    } else {
      throw new Error(data.message || "Credenciais inválidas");
    }
  } catch (error) {
    console.error("Erro na autenticação:", error);
    throw error;
  }
}

// Função para salvar credenciais no localStorage (se suportado)
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

// Função para "esqueci minha senha"
function forgotPassword() {
  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Por favor, digite seu email primeiro para recuperar a senha.");
    document.getElementById("email").focus();
    return;
  }

  if (!isValidEmail(email)) {
    alert("Por favor, digite um email válido.");
    document.getElementById("email").focus();
    return;
  }

  // Simular envio de email de recuperação
  alert(
    `Um link de recuperação foi enviado para ${email}.\n\nVerifique sua caixa de entrada e spam.`
  );
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

// Adicionar event listeners para teclas de atalho
document.addEventListener("keydown", function (event) {
  // Enter para enviar formulário
  if (event.key === "Enter" && event.target.tagName !== "BUTTON") {
    const form = document.getElementById("loginForm");
    if (form) {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
  }

  // Escape para limpar erros
  if (event.key === "Escape") {
    clearErrors();
  }
});

// Adicionar suporte a animações e efeitos visuais
function addVisualEffects() {
  // Efeito parallax nas formas de fundo
  document.addEventListener("mousemove", function (e) {
    const shapes = document.querySelectorAll(".shape");
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 0.5;
      const xPos = (x - 0.5) * speed * 20;
      const yPos = (y - 0.5) * speed * 20;
      shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
  });
}

// Inicializar efeitos visuais
setTimeout(addVisualEffects, 100);

// ===== MODAL FUNCTIONALITY =====

// Fechar modal
function closeModal() {
  const modal = document.getElementById("adminContactModal");
  modal.classList.remove("show");

  // Limpar formulário
  setTimeout(() => {
    document.getElementById("adminContactForm").reset();
    clearModalMessages();
  }, 300);
}

// Limpar mensagens do modal
function clearModalMessages() {
  const existingMessages = document.querySelectorAll(
    ".success-message, .error-message"
  );
  existingMessages.forEach((msg) => msg.remove());
}

// Mostrar mensagem de sucesso no modal
function showModalSuccess(message) {
  clearModalMessages();
  const form = document.querySelector(".admin-contact-form");
  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.innerHTML = `<i class="fas fa-check-circle"></i>${message}`;
  form.insertBefore(successDiv, form.firstChild);
}

// Mostrar mensagem de erro no modal
function showModalError(message) {
  clearModalMessages();
  const form = document.querySelector(".admin-contact-form");
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i>${message}`;
  form.insertBefore(errorDiv, form.firstChild);
}

// Validar formulário de contato
function validateContactForm(formData) {
  const errors = [];

  if (!formData.senderName.trim()) {
    errors.push("Nome é obrigatório");
  }

  if (!formData.senderEmail.trim()) {
    errors.push("Email é obrigatório");
  } else if (!isValidEmail(formData.senderEmail)) {
    errors.push("Email inválido");
  }

  if (!formData.subject) {
    errors.push("Assunto é obrigatório");
  }

  if (!formData.message.trim()) {
    errors.push("Mensagem é obrigatória");
  } else if (formData.message.trim().length < 10) {
    errors.push("Mensagem deve ter pelo menos 10 caracteres");
  }

  return errors;
}

// Simular envio da mensagem (substitua pela sua lógica de envio)
async function sendContactMessage(formData) {
  // Simular delay de envio
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simular sucesso (99% das vezes)
  if (Math.random() > 0.01) {
    return {
      success: true,
      message:
        "Mensagem enviada com sucesso! O administrador entrará em contato em até 24 horas.",
    };
  } else {
    throw new Error(
      "Erro temporário no servidor. Tente novamente em alguns minutos."
    );
  }
}

// Lidar com envio do formulário de contato
async function handleContactSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const submitBtn = form.querySelector(".btn-send");

  // Validar formulário
  const errors = validateContactForm(data);
  if (errors.length > 0) {
    showModalError(errors.join("<br>"));
    return;
  }

  // Mostrar estado de carregamento
  submitBtn.classList.add("loading");
  submitBtn.disabled = true;
  clearModalMessages();

  try {
    const result = await sendContactMessage(data);

    if (result.success) {
      showModalSuccess(result.message);
      form.reset();

      // Fechar modal após 3 segundos
      setTimeout(closeModal, 3000);
    }
  } catch (error) {
    showModalError(error.message);
  } finally {
    // Remover estado de carregamento
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
  }
}

// Inicializar event listeners do modal
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("adminContactModal");
  const closeBtn = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const contactForm = document.getElementById("adminContactForm");

  // Fechar modal
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  // Fechar modal clicando fora dele
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Fechar modal com Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  // Envio do formulário
  contactForm.addEventListener("submit", handleContactSubmit);
});
