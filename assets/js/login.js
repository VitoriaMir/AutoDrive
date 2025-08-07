// Toggle de visualização de senha
document.getElementById("toggleSenha").addEventListener("click", function () {
  const senhaInput = document.getElementById("senha");
  const icon = document.getElementById("iconSenha");
  if (senhaInput.type === "password") {
    senhaInput.type = "text";
    icon.classList.remove("bi-eye");
    icon.classList.add("bi-eye-slash");
  } else {
    senhaInput.type = "password";
    icon.classList.remove("bi-eye-slash");
    icon.classList.add("bi-eye");
  }
});

// Validação do formulário
document.getElementById("login-form").addEventListener("submit", function (e) {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const username = document.getElementById("username")
    ? document.getElementById("username").value
    : null;

  // Remover mensagens de erro existentes (apenas as do frontend)
  const existingFrontendErrors = document.querySelectorAll(
    ".alert-danger:not([data-backend])"
  );
  existingFrontendErrors.forEach((error) => error.remove());

  let hasError = false;

  // Validação do primeiro acesso (se houver campo username)
  if (username && username.trim() === "") {
    showError("Por favor, preencha o campo de nome de usuário.");
    hasError = true;
  }

  if (!email) {
    showError("Por favor, preencha o campo de email.");
    hasError = true;
  }

  if (!senha) {
    showError("Por favor, preencha o campo de senha.");
    hasError = true;
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("Por favor, insira um endereço de email válido.");
    hasError = true;
  }

  if (senha && senha.length < 8) {
    showError("A senha deve ter no mínimo 8 caracteres.");
    hasError = true;
  }

  if (hasError) {
    e.preventDefault();
  }
});

function showError(message) {
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
}
