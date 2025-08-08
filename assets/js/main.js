// Navbar scroll effect
const nav = document.getElementById("mainNav");
document.addEventListener("scroll", () =>
  nav.classList.toggle("scrolled", window.scrollY > 50)
);

// Active nav link
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("#nav .nav-link");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 90;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

// Botão Voltar ao Topo
const backToTop = document.createElement("button");
backToTop.className = "btn btn-primary position-fixed";
backToTop.style =
  "bottom: 50px; right: 100px; z-index: 1050; border-radius: 50%; width: 50px; height: 50px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); display: none;";
backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
document.body.appendChild(backToTop);

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});

// Form submission
const contactForm = document.querySelector("form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    contactForm.reset();
  });
}
