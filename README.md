# CV Filter — Simulador de Filtro ATS

Herramienta web que simula el comportamiento de un sistema **ATS (Applicant Tracking System)** — el software que usan las empresas para filtrar CVs automáticamente antes de que lleguen a un reclutador humano. Permite analizar un CV en formato PDF o DOCX y evaluar qué tan bien está optimizado para pasar ese filtro.

🔗 **Demo en vivo:** *(próximamente — ver nota al final)*

---

## Vista previa

![CV Filter Preview](https://github.com/tweegio/CV_Filter/blob/main/img/imagen-flotante1.jpg)

---

## ¿Qué problema resuelve?

La mayoría de los candidatos no saben que su CV es descartado automáticamente por un ATS antes de que nadie lo lea. Esto ocurre cuando el CV tiene formato complejo, faltan palabras clave relevantes, o la estructura no es legible por el sistema. CV Filter permite simular ese proceso y obtener feedback concreto para mejorar el CV antes de postularse.

---

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript vanilla — lectura de archivos, análisis de texto, generación de resultados
- `pdf.js` — extracción de texto desde archivos PDF
- `mammoth.js` — extracción de texto desde archivos DOCX

---

## Funcionalidades

- **Carga de CV** en formato PDF o DOCX directamente desde el navegador
- **Extracción automática de texto** del archivo subido
- **Análisis ATS** — evalúa el contenido del CV contra criterios de legibilidad y palabras clave
- **Resultado y feedback** — devuelve un informe con sugerencias concretas para mejorar el CV
- **Sección de consejos** para optimizar el CV antes del análisis
- **Sección Mejorar CV** con recomendaciones generales
- Todo el procesamiento ocurre en el navegador, sin enviar datos a ningún servidor

---

## Decisiones técnicas

**Procesamiento 100% del lado del cliente.** El CV nunca sale del navegador del usuario. La extracción de texto y el análisis se realizan localmente usando `pdf.js` para PDFs y `mammoth.js` para archivos Word. Esto garantiza privacidad total — ningún dato personal se envía a un servidor externo.

**Uso de librerías especializadas de parsing.** Leer texto de un PDF o DOCX no es trivial — ambos formatos tienen estructuras binarias complejas. Integrar `pdf.js` y `mammoth.js` demuestra criterio para elegir la herramienta correcta según el problema, en lugar de intentar resolverlo desde cero.

**Enfoque en un problema real del mercado laboral.** El proyecto nació de una necesidad concreta: entender por qué los CVs no pasan los filtros automáticos. Esa visión de producto — identificar un dolor real y construir una solución — es lo que distingue este proyecto de un ejercicio técnico.

---

## Estructura del proyecto

```
/
├── index.html
├── script.js
├── styles.css
└── img/
```

---

## Nota sobre el deploy

El deploy en GitHub Pages está actualmente inactivo (404). Para activarlo: **Settings → Pages → Branch: main → Save**.

---

## Cómo correrlo localmente

```bash
git clone https://github.com/tweegio/CV_Filter.git
cd CV_Filter
# Abrí index.html en tu navegador o usá Live Server en VS Code
```

No requiere instalación de dependencias ni build process.

---

## Autor

**Sergio Pereira** — Desarrollador Front-End & Técnico Informático

- 🌐 [Portfolio](https://tweegio.github.io/portfolio)
- 💼 [LinkedIn](https://www.linkedin.com/in/sergio-pereira-development/)
- 🐙 [GitHub](https://github.com/tweegio)

---

*© 2025 Tweegio*
