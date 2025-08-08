// Esperar o DOM carregar completamente
document.addEventListener("DOMContentLoaded", function () {
  initializeLogin();
});

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

// Função para lidar com o login
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const remember = document.getElementById("remember").checked;
  const loginBtn = document.querySelector(".login-btn");

  // Limpar erros anteriores
  clearErrors();

  // Validações
  if (!validateInputs(email, password)) {
    return;
  }

  // Mostrar estado de carregamento
  showLoadingState(loginBtn);

  try {
    // Simular chamada de API (substitua pela sua lógica de autenticação)
    const loginSuccess = await authenticateUser(email, password);

    if (loginSuccess) {
      // Salvar credenciais se "lembrar de mim" estiver marcado
      if (remember) {
        saveCredentials(email);
      } else {
        clearSavedCredentials();
      }

      // Sucesso no login
      showSuccessMessage();

      // Redirecionar após um breve delay (substitua pela sua URL)
      setTimeout(() => {
        window.location.href = "/dashboard.html";
      }, 1500);
    } else {
      throw new Error("Credenciais inválidas");
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

// Função para autenticar usuário (substitua pela sua lógica)
async function authenticateUser(email, password) {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Aqui você deve implementar sua lógica de autenticação
  // Por enquanto, vamos simular alguns usuários válidos
  const validUsers = [
    { email: "admin@autodrive.com", password: "admin123" },
    { email: "user@autodrive.com", password: "user123" },
    { email: "demo@autodrive.com", password: "demo123" },
  ];

  return validUsers.some(
    (user) => user.email === email && user.password === password
  );
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
  alert(
    "Para criar uma nova conta, entre em contato com o administrador do sistema.\n\nEmail: admin@autodrive.com\nTelefone: (11) 99999-9999"
  );
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
