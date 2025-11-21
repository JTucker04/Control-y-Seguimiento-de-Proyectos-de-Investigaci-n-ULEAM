// Rol obtenido tras login (simulación)
const userRole = localStorage.getItem("userRole") || "invitado";

const sidebar = document.getElementById("sidebar");
const content = document.getElementById("dashboard-content");

// Sidebar dinámico según rol
function loadSidebar(role) {
  let menu = "";

  switch (role) {
    case "admin":
      menu = `
        <a href="admin/proyectos.html" class="nav-item active">Proyectos</a>
        <a href="admin/usuarios.html" class="nav-item">Usuarios</a>
        <a href="admin/indicadores.html" class="nav-item">Indicadores</a>
        <a href="admin/reportes.html" class="nav-item">Reportes</a>
      `;
      break;

    case "investigador":
      menu = `
        <a href="investigador/subir_proyecto.html" class="nav-item active">Subir Proyecto</a>
        <a href="investigador/avances.html" class="nav-item">Registrar Avance</a>
        <a href="investigador/mis_proyectos.html" class="nav-item">Mis Proyectos</a>
        <a href="investigador/historial.html" class="nav-item">Historial</a>
      `;
      break;

    case "evaluador":
      // **AÑADIDO: Menú para el rol Evaluador**
      menu = `
        <a href="evaluador/reportes.html" class="nav-item active">Reportes Pendientes</a>
        <a href="evaluador/historial.html" class="nav-item">Historial de Evaluaciones</a>
      `;
      break;

    default:
      menu = `<p class="nav-item">Acceso limitado</p>`;
  }

  sidebar.innerHTML = menu;

  // Activar carga dinámica
  const links = sidebar.querySelectorAll(".nav-item");
  links.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const url = this.getAttribute("href");
      loadContent(url, this, links);
    });
  });

  // Cargar automáticamente el primer ítem del menú (el que tiene la clase 'active' por defecto)
  const firstLink = sidebar.querySelector(".nav-item.active");
  if (firstLink) {
    loadContent(firstLink.getAttribute("href"), firstLink, links);
  }
}

// Cargar contenido dinámico
function loadContent(url, clickedLink, allLinks) {
  // Ajuste de la URL: debe salir de /js/ a /pages/
  const absoluteUrl = "../pages/" + url; 
  
  fetch(absoluteUrl, { cache: "no-store" })
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
      // Resaltado activo
      allLinks.forEach(l => l.classList.remove("active"));
      clickedLink.classList.add("active");
      // Inicializar scripts específicos
      initContentScripts(absoluteUrl); // Usamos absoluteUrl para la comparación
    })
    .catch(err => {
      content.innerHTML = `<p style="color:red;">Error al cargar ${absoluteUrl}. Verifica la ruta del archivo.</p><p>${err.message}</p>`;
    });
}

// Scripts específicos según la página cargada
function initContentScripts(url) {
  
  // **AÑADIDO: Lógica de inicialización y validación para los formularios del Investigador**
  
  // 1. VALIDACIÓN PARA EL REGISTRO DE NUEVO PROYECTO (subir_proyecto.html)
  if (url.endsWith("investigador/subir_proyecto.html")) {
    const form = document.getElementById("formRegistroProyecto");
    if (form) {
      form.addEventListener("submit", function(e) {
        e.preventDefault();
        if (validateRegistroProyecto(form)) {
          alert("Proyecto registrado exitosamente (Simulación).");
          form.reset();
        } else {
          alert("Por favor, complete todos los campos obligatorios y revise los formatos.");
        }
      });
    }
  }
  
  // 2. VALIDACIÓN PARA EL REGISTRO DE AVANCE (avances.html)
  if (url.endsWith("investigador/avances.html")) {
    const form = document.getElementById("formRegistrarAvance");
    if (form) {
      form.addEventListener("submit", function(e) {
        e.preventDefault();
        if (validateRegistrarAvance(form)) {
          alert("Avance de proyecto registrado exitosamente (Simulación).");
          form.reset();
        } else {
          alert("Por favor, revise el porcentaje de avance y los campos obligatorios.");
        }
      });
    }
  }

  // 3. INICIALIZACIÓN DE GRÁFICOS (INDICADORES ADMIN)
  if (url.endsWith("admin/indicadores.html")) {
    const ctx = document.getElementById("chartAvances");
    if (ctx) {
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Enero", "Febrero", "Marzo", "Abril"],
          datasets: [{
            label: "Avances (%)",
            data: [65, 59, 80, 81],
            backgroundColor: "#b40000"
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, max: 100 } }
        }
      });
    }
  }
}

// **AÑADIDO: Funciones de Validación (Cumplimiento de la Rúbrica)**

function validateRegistroProyecto(form) {
  let isValid = true;
  // Simulación de validación para campos clave del registro
  if (form.titulo.value.trim() === "") { isValid = false; }
  if (form.investigadorLider.value.trim() === "") { isValid = false; }
  if (form.fechaInicio.value.trim() === "") { isValid = false; }
  
  // Aquí agregarías la lógica para verificar si la fecha de fin es posterior a la de inicio
  
  return isValid;
}

function validateRegistrarAvance(form) {
  let isValid = true;
  const porcentaje = parseFloat(form.porcentajeAvance.value);
  
  // 1. Validar que el porcentaje sea un número entre 0 y 100
  if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
    isValid = false;
    form.porcentajeAvance.classList.add("error");
  } else {
    form.porcentajeAvance.classList.remove("error");
  }
  
  // 2. Validar campo obligatorio
  if (form.descripcionHito.value.trim() === "") {
    isValid = false;
  }
  
  return isValid;
}


// Inicialización (Ejecución al cargar el script)
loadSidebar(userRole);
