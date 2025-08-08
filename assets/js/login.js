// Toggle de visualização de senha
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".toggle-password");
  if (toggleButton) {
    toggleButton.addEventListener("click", togglePassword);
  }
});

function togglePassword() {
  const passwordInput = document.getElementById("password");
  const icon = document.getElementById("passwordToggleIcon");
  if (passwordInput && icon) {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  }
}

// Função para mostrar erros
function showError(message) {
  // Remover mensagens de erro existentes (apenas as do frontend)
  const existingFrontendErrors = document.querySelectorAll(
    ".alert-danger:not([data-backend])"
  );
  existingFrontendErrors.forEach((error) => error.remove());

  const errorDiv = document.createElement("div");
  errorDiv.className =
    "alert alert-danger error-message d-flex align-items-center";
  errorDiv.setAttribute("role", "alert");
  errorDiv.innerHTML = `
        <i class="bi bi-exclamation-circle-fill me-2 fs-5"></i>
        <div>${message}</div>
    `;

  const form = document.querySelector("form");
  form.parentNode.insertBefore(errorDiv, form);

  // Auto-hide após 5 segundos
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Função para mostrar loading
function showLoading() {
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Autenticando...
    `;
  }
}

// Função para esconder loading
function hideLoading() {
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = "Entrar";
  }
}

// Validação e submissão do formulário
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;
    const username = document.getElementById("username")
      ? document.getElementById("username").value
      : null;

    // Validação do primeiro acesso (se houver campo username)
    if (username && username.trim() === "") {
      showError("Por favor, preencha o campo de nome de usuário.");
      return;
    }

    if (!email) {
      showError("Por favor, preencha o campo de email.");
      return;
    }

    if (!senha) {
      showError("Por favor, preencha o campo de senha.");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Por favor, insira um endereço de email válido.");
      return;
    }

    if (senha && senha.length < 4) {
      showError("A senha deve ter no mínimo 4 caracteres.");
      return;
    }

    // Mostrar loading
    showLoading();

    try {
      // Fazer login via API
      const result = await autodriveAPI.login(email, senha);

      if (result.success) {
        // Redirecionar para dashboard
        window.location.href = "../dashboard.html";
      } else {
        // Mostrar erro
        showError(result.error || "Erro no login. Verifique suas credenciais.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      showError("Erro de conexão. Tente novamente mais tarde.");
    } finally {
      hideLoading();
    }
  });

// Verificar se já está autenticado ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  // Verificar se já está autenticado
  if (autodriveAPI && autodriveAPI.isAuthenticated()) {
    window.location.href = "../dashboard.html";
  }
});

// Função de logout (para ser chamada de outras páginas)
function logout() {
  if (autodriveAPI) {
    autodriveAPI.logout();
  } else {
    localStorage.clear();
    window.location.href = "pages/login.html";
  }
}
