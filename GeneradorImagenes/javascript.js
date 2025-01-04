// === Configuración inicial de direcciones IP para conexiones a Stable Diffusion ===
const corsProxy = 'https://cors.sergiencorsanywhere.win:443/';                      // Proxy para evitar problemas CORS.
const sdApiUrl = corsProxy + 'http://127.0.0.1:8443';                               // URL base de la API de Stable Diffusion.


// === Negative prompt por defecto ===
const defaultNegativePrompt = "lowres, (bad), error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, (abstract)";


// === Funcionalidad para traducir texto a otro idioma usando la API de Google Cloud. ===
const translateText = async (text, targetLang) => {

    const endpoint = "https://googleapi.sergiencorsanywhere.win:2053/translate";    // Endpoint del proxy que conecta con la API de Google Cloud Translate.

    const requestBody = {                                                           // Cuerpo de la solicitud POST enviado al endpoint.
        text: text,                                                                 // Texto que se desea traducir.
        targetLanguage: targetLang                                                  // Idioma objetivo para la traducción.
    };

    try {                                                                           // Intentamos realizar la solicitud al endpoint.
        const response = await fetch(endpoint, {
            method: "POST",                                                         // Método HTTP usado: POST.
            headers: {                                                              // Encabezados necesarios para la solicitud.
                "Content-Type": "application/json",                                 // Formato del cuerpo de la solicitud.
            },
            body: JSON.stringify(requestBody)                                       // Convertimos el objeto en un JSON.
        });

        if (!response.ok) {                                                         // Si la respuesta no es exitosa, lanzamos un error.
            throw new Error(`Error en la traducción: ${response.statusText}`);
        }

        const data = await response.json();                                         // Convertimos la respuesta a JSON.
        return data.translatedText;                                                 // Retornamos el texto traducido.
    } catch (error) {                                                               // Capturamos y manejamos errores.
        console.error("Error al traducir:", error);                                 // Mostramos el error en la consola.
        return null;                                                                // Devolvemos null si ocurre un error.
    }

};


// === Funcionalidad para el botón de traducir prompt ===
document.getElementById('translate-btn').addEventListener('click', async function () {
    const textToTranslate = document.getElementById('prompt').value;                // Obtenemos el prompt a traducir.
    const targetLang = 'en';                                                        // Idioma al que se traducirá el texto.

    const translatedText = await translateText(textToTranslate);                    // Traducimos el texto usando la función "translateText" declarada anteriormente.

    if (translatedText) {
        document.getElementById('prompt').value = translatedText;                   // Sustituimos el campo del prompt con el texto traducido.
    } else {
        alert("Error al traducir el texto.");                                       // Mostramos un mensaje de error si la traducción falla.
    }
});


// === Funcionalidad para cargar los modelos (checkpoints) disponibles. ===
async function loadCheckpoints() {
    const checkpointSelect = document.getElementById('checkpoint');                 // Elemento HTML <select> donde se cargarán los modelos.

    try {
        const response = await fetch(`${sdApiUrl}/sdapi/v1/sd-models`, {            // Intentamos realizar la solicitud para obtener los modelos.
            method: 'GET',                                                          // Método HTTP: GET.
            headers: {                                                              // Encabezados de la solicitud.
                'Content-Type': 'application/json',                                 // Especificamos que enviamos y esperamos JSON.
                'Origin': 'https://sergien-stablediffusion-app-b5cd08957a3c.herokuapp.com',     // Especificamos el origen permitido para la solicitud.
            },
        });

        if (!response.ok) {                                                         // Si la respuesta no es exitosa, lanzamos un error.
            throw new Error(`No se pudieron cargar los modelos: ${response.status}`);
        }

        const data = await response.json();                                         // Convertimos la respuesta en un objeto JSON.
        const models = data || [];                                                  // Aseguramos que "models" sea un array (aunque esté vacío).

        checkpointSelect.innerHTML = "";                                            // Limpiamos las opciones actuales del selector.

        models.forEach(model => {                                                   // Iteramos sobre los modelos obtenidos.
            const option = document.createElement('option');                        // Creamos un elemento <option> para cada modelo.
            option.value = model.model_name;                                        // Asignamos el nombre del modelo al valor de la opción.
            option.textContent = model.title;                                       // Asignamos el título del modelo como texto visible.
            checkpointSelect.appendChild(option);                                   // Añadimos la opción al selector.
        });

    } catch (error) {                                                               // Capturamos y manejamos errores.
        alert(`Error al cargar checkpoints: ${error.message}`);                     // Mostramos el error en la consola.
    }
}

document.addEventListener('DOMContentLoaded', loadCheckpoints);                     // Ejecuta la función cuando el DOM (el HTML) haya cargado completamente.


// === Funcionalidad de extracción y reutilización de semillas ===
let lastSeed = -1;                                                                  // Variable para almacenar la última semilla generada.

document.getElementById('reuse-seed-btn').addEventListener('click', function () {
    if (lastSeed !== -1) {
        document.getElementById('seed').value = lastSeed;                           // Rellena el campo con la última semilla usada.
    } else {
        alert("Aún no se ha generado ninguna imagen con una semilla específica.");
    }
});

function extractSeedFromMetadata(base64Image) {
    const binaryString = atob(base64Image);                                         // Convertimos la cadena base64 de la imagen a una cadena binaria legible.
    const metadataRegex = /Seed: (\d+)/;                                            // Definimos una expresión regular para buscar el patrón "Seed: [número]".
    const seedMatch = metadataRegex.exec(binaryString);                             // Aplicamos la expresión regular sobre la cadena binaria para encontrar una coincidencia.

    if (seedMatch) {                                                                // Si se encuentra una coincidencia (una semilla), se extrae el número.
        return parseInt(seedMatch[1], 10);                                          // Devolvemos el número de la semilla como un entero.
    }
    return -1;                                                                      // Si no se encuentra una semilla, devolvemos -1 (Que es aleatorio por defecto).
}


// === Funcionalidad de los botones de resolución ===
document.querySelectorAll('.resolution-btn').forEach(button => {
    button.addEventListener('click', function () {                                  // Añadimos un evento de "click" a cada botón con la clase "resolution-btn".
        document.getElementById('width').value = this.dataset.width;                // Actualizamos los valores de los campos de entrada 'width' y 'height' con los valores almacenados en los atributos 'data-width' y 'data-height' del botón clicado
        document.getElementById('height').value = this.dataset.height;

        document.querySelector('.resolution-btn.active')?.classList.remove('active');   // Actualizamos las clases de los botones para reflejar la selección activa y eliminamos la clase 'active' del botón previamente seleccionado (si existe).

        this.classList.add('active');                                               // Añadimos la clase 'active' al botón clicado
    });
});


// === Funcionalidad del envío de datos del formulario a Stable Diffusion ===
document.getElementById('image-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitButton = document.getElementById('submit-btn');
    submitButton.textContent = "Generando imagen. Espera un momento...";            // Cambiamos el texto del botón a "Generando imagen..."

    let prompt = document.getElementById('prompt').value;
    prompt = `sfw, ${prompt}, highres, best quality, amazing quality, very aesthetic, absurdres,`;  // Unimos el prompt con los tags de calidad adicionales.

    const checkpoint = document.getElementById('checkpoint').value;
    const samplingMethod = document.getElementById('sampling-method').value;
    const steps = parseInt(document.getElementById('steps').value);
    const cfg = parseFloat(document.getElementById('cfg').value);
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);
    const seed = document.getElementById('seed').value || -1;

    const requestData = {                                                           // Preparamos el paquete de datos que se enviarán a la API de Stable Diffusion.                       
        prompt: prompt,
        negative_prompt: defaultNegativePrompt,
        steps: steps,
        cfg_scale: cfg,
        width: width,
        height: height,
        seed: parseInt(seed),
        sampler_name: samplingMethod,
        override_settings: {
            "sd_model_checkpoint": checkpoint
        },
        override_settings_restore_afterwards: false                                 // No restaurar el checkpoint inicial después de la generación de la imagen.
    };

    try {
        const response = await fetch(`${sdApiUrl}/sdapi/v1/txt2img`, {              // Realizamos la solicitud POST a la API de Stable Diffusion.
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',                                 // El cuerpo de la petición estará en formato JSON
                'Origin': 'https://sergien-stablediffusion-app-b5cd08957a3c.herokuapp.com',  // El origen (dominio) desde el que se realiza la petición.
            },
            body: JSON.stringify(requestData)                                       // Convertimos el paquete de datos anterior a JSON para la solicitud.
        });

        if (!response.ok) {                                                         // Verificamos si la respuesta de la API es exitosa (código de estado 2xx).          
            throw new Error(`Error en la generación de imagen: ${response.status}`);    // Si la respuesta no es exitosa, lanzamos un error con el código de estado HTTP.
        }


        // === Funcionalidad del recibimiento de imágenes de Stable Diffusion ===
        const data = await response.json();                                         // Almacenamos la respuesta de Stable Diffusion en la constante "data".            
        const imageBase64 = data.images[0];                                         // Extraemos la imagen generada en formato base64 de la respuesta.

        lastSeed = extractSeedFromMetadata(imageBase64);                            // Extraemos la semilla de la imagen generada y la almacenamos en la variable "lastSeed".

        if (lastSeed !== -1) {                                                      // Si se ha extraído una semilla de la imagen generada, la mostramos en la consola y habilitamos el botón de reutilización de semilla.
            console.log(`Semilla extraída: ${lastSeed}`);
            document.getElementById('reuse-seed-btn').disabled = false;
        } else {
            console.warn("No se encontró semilla en los metadatos.");               // Si no se ha extraído una semilla, mostramos un mensaje de advertencia en la consola.
        }

        const outputImage = document.getElementById('output-image');                // Obtenemos el elemento <img> con el ID "output-image".
        outputImage.src = `data:image/png;base64,${imageBase64}`;                   // Mostramos la imagen generada en el elemento <img> con el ID "output-image".      
        outputImage.hidden = false;                                                 // Mostramos la imagen generada estableciendo el atributo "hidden" a "false".

        // === Funcionalidad para añadir un separador para el historial de imágenes ===
        function ensureHistorySeparator() {
            const resultContainer = document.getElementById('result');
            let historyLabel = document.getElementById('history-label');

            if (!historyLabel) {                                                    // Si el separador no existe, se añade automáticamente.
                historyLabel = document.createElement('div');
                historyLabel.id = 'history-label';
                historyLabel.className = 'history-label';
                historyLabel.textContent = 'Historial de imágenes generadas';

                resultContainer.appendChild(historyLabel);                          // Añadimos el separador debajo de la última imagen generada.
            }
        }

        
        // === Funcionalidad para apilar las imágenes generadas en el historial ===
        const resultContainer = document.getElementById('result');
        const newImage = document.createElement('img');
        newImage.src = `data:image/png;base64,${imageBase64}`;
        newImage.className = "generated-image";
        newImage.style.marginTop = "10px";

        ensureHistorySeparator();                                                   // Aseguramos que el separador está presente antes de añadir nuevas imágenes al historial.

        resultContainer.appendChild(newImage);                                      // Añadimos la imagen generada al historial de imágenes.

        submitButton.textContent = "Generar imagen";                                // Restauramos el texto del botón después de la generación de la imagen.                  
    } catch (error) {
        alert(`Error: ${error.message}`);
        submitButton.textContent = "Generar imagen";                                // Restauramos el texto del botón si ha ocurrido un error.
    }
});
