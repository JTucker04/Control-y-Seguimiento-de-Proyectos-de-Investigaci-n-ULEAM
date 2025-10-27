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
        <a href="admin/proyectos.html" class="nav-item">Proyectos</a>
        <a href="admin/usuarios.html" class="nav-item">Usuarios</a>
        <a href="admin/indicadores.html" class="nav-item">Indicadores</a>
        <a href="admin/reportes.html" class="nav-item">Reportes</a>
      `;
      break;

    case "investigador":
      menu = `
        <a href="investigador/mis_proyectos.html" class="nav-item">Mis Proyectos</a>
        <a href="investigador/avances.html" class="nav-item">Registrar Avance</a>
        <a href="investigador/historial.html" class="nav-item">Historial</a>
      `;
      break;

    case "evaluador":
      menu = `
        <a href="evaluador/reportes.html" class="nav-item">Reportes Pendientes</a>
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

  // Cargar automáticamente el primer ítem del menú
  const firstLink = sidebar.querySelector(".nav-item");
  if (firstLink) {
    loadContent(firstLink.getAttribute("href"), firstLink, links);
  }
}

// Cargar contenido dinámico
function loadContent(url, clickedLink, allLinks) {
  fetch(url, { cache: "no-store" })
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
      // Resaltado activo
      allLinks.forEach(l => l.classList.remove("active"));
      clickedLink.classList.add("active");
      // Inicializar scripts específicos
      initContentScripts(url);
    })
    .catch(err => {
      content.innerHTML = `<p>Error al cargar ${url}: ${err.message}</p>`;
    });
}

// Scripts específicos según la página cargada
function initContentScripts(url) {
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

// Inicialización
loadSidebar(userRole);