document.getElementById("cvForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const fileInput = document.getElementById("cvFile");
    if (fileInput.files.length === 0) {
        alert("Por favor, sube un archivo.");
        return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    if (file.type === "application/pdf") {
        reader.onload = function() {
            const typedarray = new Uint8Array(reader.result);
            pdfjsLib.getDocument(typedarray).promise.then(pdf => {
                let textPromises = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    textPromises.push(pdf.getPage(i).then(page => page.getTextContent().then(content => content.items.map(item => item.str).join(" "))));
                }
                Promise.all(textPromises).then(pages => analyzeText(pages.join(" ")));
            });
        };
        reader.readAsArrayBuffer(file);
    } else if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
        reader.onload = function() {
            mammoth.extractRawText({ arrayBuffer: reader.result })
                .then(result => analyzeText(result.value))
                .catch(err => console.error("Error al leer Word:", err));
        };
        reader.readAsArrayBuffer(file);
    } else {                                            
        alert("Formato no compatible. Sube un archivo PDF o Word.");
    }
});

function analyzeText(text) {
    const generalKeywords = [
        "Trabajo en equipo", "Liderazgo", "Resolución de problemas", "Comunicación", "Adaptabilidad", "Creatividad", "Gestión del tiempo",
        "Microsoft Office", "Atención al cliente", "Ventas", "Contabilidad", "Marketing", "Gestión de proyectos", "Administración", "Educación",
        "Ingeniería", "Salud", "Atención médica", "Recursos Humanos", "Logística", "Operaciones", "Producción", "Seguridad", "Legal",
        "Idiomas", "Inglés", "Francés", "Alemán", "Portugués", "Servicio al cliente", "Redacción", "Diseño gráfico", "Fotografía"
    ];
    
    const atsChecks = {
        structure: /(?:Experiencia|Educación|Habilidades|Certificaciones)/gi.test(text),
        simpleFormatting: !/(tabla|imagen|gráfico|cajas de texto)/gi.test(text),
        contactInfo: /(?:email|tel[eé]fono|contacto)/gi.test(text)
    };
    
    let found = generalKeywords.filter(word => new RegExp(`\\b${word}\\b`, "gi").test(text));
    let percentage = (found.length / generalKeywords.length) * 100;
    let resultDiv = document.getElementById("result");
    let atsPassed = atsChecks.structure && atsChecks.simpleFormatting && atsChecks.contactInfo;
    
    if (percentage >= 70 && atsPassed) {
        resultDiv.innerHTML = `<div class="alert alert-success">Tu CV es válido para ATS. Contiene un ${percentage.toFixed(2)}% de palabras clave y cumple con las normas de estructura.</div>`;
    } else {
        let issues = [];
        if (!atsChecks.structure) issues.push("Estructura incorrecta (faltan secciones como Experiencia, Educación, etc.)");
        if (!atsChecks.simpleFormatting) issues.push("Formato complejo (evita tablas, imágenes y gráficos)");
        if (!atsChecks.contactInfo) issues.push("Información de contacto faltante");
        
        resultDiv.innerHTML = `<div class="alert alert-danger">Tu CV tiene un ${percentage.toFixed(2)}% de coincidencia en palabras clave. Además, presenta los siguientes problemas ATS:<br><ul><li>${issues.join("</li><li>")}</li></ul></div>`;
    }
}
//Evita archivos maliciosos
document.getElementById('cvFile').addEventListener('change', function() {
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const fileName = this.files[0].name.toLowerCase();
    const fileExtension = fileName.split('.').pop();

    if (!allowedExtensions.includes(fileExtension)) {
        alert('Formato de archivo no permitido.');
        this.value = ''; // Resetea el input
    }
});