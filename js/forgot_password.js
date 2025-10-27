document.getElementById("forgotForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();
  const errorMsg = document.querySelector('[data-error-for="email"]');

  // Validar correo institucional
  const regex = /^[a-zA-Z0-9._%+-]+@(live\.)?uleam\.edu\.ec$/;
  if (!regex.test(email)) {
    errorMsg.textContent = "Debe ingresar un correo institucional válido";
    emailInput.classList.add("error");
    return;
  }

  // Simulación de envío
  errorMsg.textContent = "";
  emailInput.classList.remove("error");

  alert("Si el correo existe en el sistema, recibirás un enlace para restablecer tu contraseña.");
  // Aquí en un backend real se haría la petición al servidor
});