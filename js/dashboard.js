document.addEventListener('DOMContentLoaded', function() {
    // ⚠️ 1. SIMULACIÓN DE ROL (Para pruebas) ⚠️
    // Al finalizar, localStorage.getItem("userRole") debe ser establecido tras el login exitoso.
    const userRole = localStorage.getItem("userRole") || "admin"; // Cambia a 'investigador' o 'evaluador' para probar

    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("dashboard-content");

    if (!sidebar || !content) {
        console.error("Error: Elementos #sidebar o #dashboard-content no encontrados.");
        return;
    }

    // Estructura de menú por rol
    const menuStructure = {
        "admin": [
            { name: "Proyectos", href: "admin/proyectos.html", icon: "project-icon" },
            { name: "Usuarios", href: "admin/usuarios.html", icon: "user-icon" },
            { name: "Indicadores", href: "admin/indicadores.html", icon: "chart-icon" },
            { name: "Reportes", href: "admin/reportes.html", icon: "report-icon" },
        ],
        "investigador": [
            { name: "Registrar Proyecto", href: "investigador/subir_proyecto.html", icon: "upload-icon" },
            { name: "Registrar Avance", href: "investigador/avances.html", icon: "update-icon" },
            { name: "Mis Proyectos", href: "investigador/mis_proyectos.html", icon: "folder-icon" },
            { name: "Historial", href: "investigador/historial.html", icon: "history-icon" },
        ],
        "evaluador": [
            { name: "Reportes Pendientes", href: "evaluador/reportes.html", icon: "pending-icon" },
            { name: "Historial de Evaluación", href: "evaluador/historial.html", icon: "history-icon" },
        ]
    };

    // FUNCIÓN CENTRAL PARA CARGAR EL CONTENIDO DINÁMICO
    // Hacemos esta función global (variable de función) para que sea accesible desde initContentScripts
    window.loadContent = function(url, clickedLink, allLinks) {
        // Asume que la URL viene como "rol/pagina.html"
        const absoluteUrl = "../pages/" + url; 
        
        fetch(absoluteUrl, { cache: "no-store" })
            .then(res => res.text())
            .then(html => {
                content.innerHTML = html;
                
                // Resaltado activo (solo si se ha clickeado un link del sidebar)
                if (clickedLink) {
                    allLinks.forEach(l => l.classList.remove("active"));
                    clickedLink.classList.add("active");
                }
                
                // Inicializar scripts específicos
                initContentScripts(absoluteUrl);
            })
            .catch(err => {
                content.innerHTML = `<p style="color:red;">Error al cargar ${absoluteUrl}. Verifica la ruta del archivo.</p><p>${err.message}</p>`;
            });
    }

    // Generar el Sidebar y adjuntar Listeners
    function loadSidebar(role) {
        const menu = menuStructure[role] || [];
        sidebar.innerHTML = ''; 

        let menuHTML = '';
        menu.forEach((item, index) => {
            // Asignar 'active' al primer elemento del menú
            const activeClass = index === 0 ? ' active' : '';
            // Usamos el item.href completo (rol/pagina.html) para loadContent
            menuHTML += `<a href="${item.href}" class="nav-item${activeClass}">${item.name}</a>`;
        });
        sidebar.innerHTML = menuHTML;

        // Activar carga dinámica
        const links = sidebar.querySelectorAll(".nav-item");
        links.forEach(link => {
            link.addEventListener("click", function (e) {
                e.preventDefault();
                const url = this.getAttribute("href");
                // La URL se pasa como rol/pagina.html
                loadContent(url, this, links);
            });
        });

        // Cargar automáticamente el primer ítem del menú
        const firstLink = sidebar.querySelector(".nav-item.active");
        if (firstLink) {
            loadContent(firstLink.getAttribute("href"), firstLink, links);
        }
    }

    // Funciones de Validación (Cumplimiento de la Rúbrica)
    function validateRegistroProyecto(form) {
        let isValid = true;
        
        // Validar que los campos clave no estén vacíos
        const requiredFields = ["titulo", "investigadorLider", "fechaInicio", "presupuesto"];
        
        requiredFields.forEach(id => {
            const input = form.elements[id];
            if (input && input.value.trim() === "") {
                input.style.borderColor = "var(--uleam-red)";
                isValid = false;
            } else if (input) {
                input.style.borderColor = "";
            }
        });
        
        // Validación de Presupuesto (debe ser un número positivo)
        const presupuesto = parseFloat(form.elements.presupuesto.value);
        if (isNaN(presupuesto) || presupuesto <= 0) {
              form.elements.presupuesto.style.borderColor = "var(--uleam-red)";
              isValid = false;
        }

        return isValid;
    }

    function validateRegistrarAvance(form) {
        let isValid = true;
        const porcentajeInput = form.elements.porcentajeAvance;
        const hitoInput = form.elements.descripcionHito;
        const porcentaje = parseFloat(porcentajeInput.value);
        
        // 1. Validar que el porcentaje sea un número entre 0 y 100
        if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
            porcentajeInput.style.borderColor = "var(--uleam-red)";
            isValid = false;
        } else {
            porcentajeInput.style.borderColor = "";
        }
        
        // 2. Validar campo obligatorio
        if (hitoInput.value.trim() === "") {
            hitoInput.style.borderColor = "var(--uleam-red)";
            isValid = false;
        } else {
            hitoInput.style.borderColor = "";
        }
        
        return isValid;
    }


    // Scripts específicos según la página cargada
    function initContentScripts(url) {
        // Lógica de Validación de Formularios (Investigador)
        if (url.includes("investigador/subir_proyecto.html")) {
            const form = document.getElementById("formRegistroProyecto");
            if (form) {
                form.addEventListener("submit", function(e) {
                    e.preventDefault();
                    if (validateRegistroProyecto(form)) {
                        alert("✅ Proyecto registrado exitosamente (Simulación).");
                        form.reset();
                    } else {
                        alert("❌ Error: Complete todos los campos obligatorios y revise los formatos (Presupuesto > 0).");
                    }
                });
            }
        }
        
        if (url.includes("investigador/avances.html")) {
            const form = document.getElementById("formRegistrarAvance");
            if (form) {
                form.addEventListener("submit", function(e) {
                    e.preventDefault();
                    if (validateRegistrarAvance(form)) {
                        alert("✅ Avance de proyecto registrado exitosamente (Simulación).");
                        form.reset();
                    } else {
                        alert("❌ Error: Complete la descripción del Hito y asegúrese que el Porcentaje esté entre 0 y 100.");
                    }
                });
            }
        }
        
        // Lógica para inicializar gráficos (Admin)
        if (url.includes("admin/indicadores.html")) {
            // Lógica del Chart.js completa para inicializar el gráfico
            const ctx = document.getElementById("chartAvances");
            if (ctx) {
                new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: ["Enero", "Febrero", "Marzo", "Abril"],
                        datasets: [{
                            label: "Avances (%)",
                            data: [65, 59, 80, 81],
                            backgroundColor: "#C21F2B" 
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

        // Lógica para el botón 'Ver' (Detalles del Proyecto)
        if (url.includes("proyectos.html") || url.includes("mis_proyectos.html")) {
            const verButtons = document.querySelectorAll('.btn-ver-proyecto');

            verButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const projectId = this.getAttribute('data-project-id'); 
                    
                    // Cargar el fragmento detalles_proyecto.html, usando el rol actual
                    // El segundo parámetro es null para no resaltar un elemento del sidebar
                    loadContent(`${userRole}/detalles_proyecto.html?id=${projectId}`, null, null); 
                });
            });
        }
        
        // Lógica para el botón "Volver" en la vista de detalles
        if (url.includes("detalles_proyecto.html")) {
            const backButton = document.getElementById("backButton");
            if (backButton) {
                backButton.addEventListener('click', function() {
                    // Simular clic en el elemento activo del sidebar (que es la lista de proyectos)
                    const activeLink = sidebar.querySelector(".nav-item.active");
                    if (activeLink) {
                        loadContent(activeLink.getAttribute("href"), activeLink, sidebar.querySelectorAll(".nav-item"));
                    }
                });
            }
        }
    }

    // Inicialización del Dashboard
    loadSidebar(userRole);
});
