const form = document.getElementById("loginForm");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  // Reglas de validación
  const reglas = {
    email: { required: true, minLen: 5 }
  };

  // Validar formulario
  if (!validarFormulario(form, reglas)) {
    return; // si falla, no continúa
  }

  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();

  // Validar formato de correo institucional
  const regex = /^[a-zA-Z0-9._%+-]+@(live\.)?uleam\.edu\.ec$/;
  if (!regex.test(email)) {
    setError(emailInput, "Debe ser un correo institucional válido (@live.uleam.edu.ec)");
    return;
  }

  // Determinar rol
  const role = getUserRole(email);

  // Guardar rol en localStorage
  localStorage.setItem("userRole", role);

  // Redirigir al dashboard
  window.location.href = "../pages/dashboard.html";
});

function getUserRole(email) {
  const firstChar = email.charAt(0).toLowerCase();
  const admins = ["admin@live.uleam.edu.ec", "coordinador@live.uleam.edu.ec"];

  if (admins.includes(email.toLowerCase())) {
    return "admin";
  } else if (firstChar === "e") {
    return "investigador"; // estudiantes
  } else if (firstChar === "p") {
    return "evaluador"; // profesores
  } else {
    return "invitado";
  }
}

function setError(input, message) {
  input.classList.add('error');
  const el = document.querySelector(`.error-msg[data-error-for="${input.id}"]`);
  if (el) el.textContent = message || 'Campo inválido';
}

function clearError(input) {
  input.classList.remove('error');
  const el = document.querySelector(`.error-msg[data-error-for="${input.id}"]`);
  if (el) el.textContent = '';
}

function validarCampo(input, regla) {
  const val = (input.value || '').trim();
  if (regla.required && !val) return setError(input, 'Este campo es obligatorio');
  if (regla.minLen && val.length < regla.minLen) return setError(input, `Mínimo ${regla.minLen} caracteres`);
  clearError(input);
  return true;
}

function validarFormulario(form, reglas) {
  let ok = true;
  for (const id of Object.keys(reglas)) {
    const input = form.querySelector(`#${id}`);
    if (!input) continue;
    const valido = validarCampo(input, reglas[id]);
    if (!valido) ok = false;
  }
  return ok;
}

// UX: limpiar error al escribir
document.addEventListener('input', (e) => {
  if (e.target && e.target.tagName === 'INPUT') clearError(e.target);
});