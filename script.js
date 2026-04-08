document.getElementById("cvForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    let file = document.getElementById("cvFile").files[0]; // Obtiene el archivo cargado
    if (!file) {
        mostrarResultado("Por favor, selecciona un archivo antes de analizar.");
        return;
    }

    let reader = new FileReader();
    let fileType = file.name.split('.').pop().toLowerCase(); // Obtiene la extensión del archivo

    if (fileType === "pdf") {
        reader.onload = function() {
            procesarPDF(reader.result);
        };
        reader.readAsArrayBuffer(file);
    } else if (fileType === "docx") {
        reader.onload = function(event) {
            procesarDOCX(event.target.result);
        };
        reader.readAsArrayBuffer(file);
    } else {
        mostrarResultado("Formato no compatible. Solo se aceptan archivos PDF y DOCX.");
    }
});

// Procesar archivos PDF
function procesarPDF(arrayBuffer) {
    let typedarray = new Uint8Array(arrayBuffer);
    pdfjsLib.getDocument(typedarray).promise.then(pdf => {
        let textoCompleto = "";
        let promesas = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            promesas.push(
                pdf.getPage(i).then(page => 
                    page.getTextContent().then(textContent => {
                        textoCompleto += textContent.items.map(item => item.str).join(" ") + " ";
                    })
                )
            );
        }

        Promise.all(promesas).then(() => analizarCV(textoCompleto));
    });
}

// Procesar archivos DOCX
function procesarDOCX(arrayBuffer) {
    mammoth.extractRawText({ arrayBuffer: arrayBuffer })
        .then(result => {
            let texto = result.value.trim();
            if (texto.length > 0) {
                analizarCV(texto);
            } else {
                mostrarResultado("No se pudo extraer texto del archivo DOCX. Intenta con otro archivo.");
            }
        })
        .catch(error => mostrarResultado("Error al procesar el archivo DOCX: " + error.message));
}

// Analizar el CV
function analizarCV(texto) {
    let palabrasClave = ["JavaScript", "Python", "HTML", "CSS", "React", "SQL", "Git", "Agile", "Excel", 
        "Desarrollo web", "Front-end", "Back-end","Capacidad de negociar", "Conocimiento en","comunicación efectiva",
        "liderazgo", "toma de decisiones", "creatividad", "diseño", "asistencia técnica", "optimización", "motivación",
        "Pensamiento crítico", "análisis", "proactividad", "proactividad", "estrategia de ventas", "Branding", "posicionamiento de marca",
        "eventos", "presupuestos", "soporte administrativo", "manejo de documentación", "coordinación de reuniones",
        "control de inventarios", "atención telefónica", "Gestión de inventarios", "transporte", "planificación logística",
        "manejo de almacenes", "Soporte al cliente", "gestión de incidencias", "Asesoramiento", "ventas en línea",
        "seguimiento de clientes", "asesoría", "satisfacción", "personalización de servicios", "formación en línea",
        "enseñanza personalizada", "desarrollo de planes educativos", "Capacitación", "desarrollo de habilidades",
        "aprendizaje continuo", "pruebas", "creación de contenidos", "planificación educativa",
        "Atención sanitaria", "asistencia médica", "enfermería", "diagnóstico", "tratamiento", "salud preventiva", 
        "primeros auxilios", "bienestar", "psicología", "asesoramiento", "bienestar emocional", "gestión del estrés", 
        "nutrición", "terapias alternativas", "gestión sanitaria", "gestión hospitalaria", "administración de clínicas", 
        "gestión de pacientes", "salud pública", "planificación de servicios de salud", "Soporte", "asistencia en salud",
        "apoyo a pacientes", "apoyo emocional", "atención domiciliaria", "cuidados paliativos",
        "investigación", "Agile", "Comunicación verbal", "toma de decisiones", "Colaboración",
        "Trabajo en equipo", "Liderazgo", "Resolución de problemas", "Comunicación", "Adaptabilidad", 
        "Creatividad", "Gestión del tiempo", "Microsoft Office", "Oficce 365", "Atención al cliente", "Atención al público", "Ventas", 
        "Contabilidad", "Marketing", "Gestión de proyectos", "Administración", "Educación", "Ingeniería",
        "Salud", "Atención médica", "Recursos Humanos", "Logística", "Operaciones", "Producción", 
        "Seguridad", "Legal", "Idiomas", "Inglés", "Francés", "Alemán", "Portugués", "Servicio al cliente", 
        "Consultoría legal", "asesoramiento legal", "contratos", "cumplimiento", "defensa legal", "litigios", "mediación",
        "negociación de contratos", "redacción de contratos", "acuerdos legales", "cumplimiento de normativas", 
        "condiciones de servicio", "Compliance", "cumplimiento normativo", "regulaciones", "auditoría legal", "prevención de riesgos",
        "políticas corporativas", "responsabilidad corporativa", "gestión legal", "documentación legal", "análisis legal", "due diligence", 
        "gestión de procesos legales", "resolución de conflictos",
        "Creatividad", "diseño visual", "Adobe Photoshop", "Illustrator", "diseño de logotipos", "identidad corporativa", "diseño web",
        "fotografía", "edición de video", "producción audiovisual", "grabación", "creación de contenido visual", "retoque fotográfico", 
        "diseño industrial", "diseño de productos", "diseño de experiencias", "desarrollo de conceptos", "prototipado", "modelado 3D", 
        "pintura", "escultura", "diseño artístico", "curaduría", "exposiciones", "arte contemporáneo",
        "Servicio al cliente", "atención personalizada", "resolución de conflictos", "gestión de reservas", "recepción", "check-in/check-out", 
        "organización de eventos", "planificación de bodas", "planificación de conferencias", "eventos corporativos", "coordinación de actividades", 
        "gestión de restaurantes", "servicio de alimentos y bebidas", "gestión de menús", "relaciones con proveedores", "control de calidad", 
        "asesoría turística", "planificación de viajes", "organización de tours", "gestión de grupos", "reservas hoteleras", "promociones turísticas",
        "Planificación de obras", "gestión de proyectos de construcción", "supervisión de obras", "presupuesto de construcción", "control de calidad", 
        "diseño técnico", "análisis estructural", "CAD", "planificación de proyectos", "estudios de viabilidad", "desarrollo de planos", 
        "mantenimiento preventivo", "reparaciones", "instalación de equipos", "revisión técnica", "gestión de mantenimiento", "seguridad laboral", 
        "gestión de riesgos", "cumplimiento normativo", "inspección de seguridad", "medidas preventivas",
        "Investigación de mercado", "análisis de datos", "análisis cuantitativo", "recopilación de datos", "estudios cualitativos", "planificación de proyectos",
        "cronograma", "gestión de recursos", "cumplimiento de plazos", "dirección de equipos", "coordinación de tareas",
        "Redacción", "Diseño gráfico", "Fotografía", "Habilidades","Skills"];

    let errores = [];
    let recomendaciones = [];
    let palabrasEncontradas = palabrasClave.filter(palabra => texto.includes(palabra));

    if (palabrasEncontradas.length === 0) {
        errores.push("🔴 Tu CV no contiene palabras clave relevantes. Agrega términos específicos de tu industria.");
    } else {
        recomendaciones.push("✔️ Se encontraron palabras clave: " + palabrasEncontradas.join(", "));
    }

    if (!/@+[a-zA-Z_-]+?\.[a-zA-Z]{2,}/.test(texto)) {
        errores.push("🔴 No se encontró un correo electrónico en tu CV.");
    }

    let palabras = texto.toLowerCase().split(/\s+/);
    let conteoPalabras = palabras.reduce((acc, palabra) => {
        acc[palabra] = (acc[palabra] || 0) + 1;
        return acc;
    }, {});

    let palabrasRepetidas = Object.keys(conteoPalabras).filter(palabra => conteoPalabras[palabra] > 10);
    if (palabrasRepetidas.length > 5) {
        errores.push("Tu CV tiene muchas palabras repetidas: " + palabrasRepetidas.slice(0, 5).join(", ") + "...");
    }

    let mensaje = "";
    if (errores.length > 0) {
        mensaje += "<h3>⚠️ Necesitas mejorar estos aspectos:</h3><ul>" + errores.map(error => `<li>${error}</li>`).join("") + "</ul>";
    } else {
        mensaje += "<h3>✅ No se encontraron problemas significativos en tu CV!!!.</h3>";
    }

    if (recomendaciones.length > 0) {
        mensaje += "<h3>💡 Esto está genial!!!:</h3><ul>" + recomendaciones.map(reco => `<li>${reco}</li>`).join("") + "</ul>";
    }

    mostrarResultado(mensaje);
}

// Mostrar resultado en pantalla
function mostrarResultado(mensaje) {
    const el = document.getElementById("result"); el.innerHTML = mensaje; el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

