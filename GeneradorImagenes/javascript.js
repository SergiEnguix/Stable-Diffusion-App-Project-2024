const corsProxy = 'https://cors.sergiencorsanywhere.win:443/';
const sdApiUrl = corsProxy + 'http://127.0.0.1:8443';

// Negative prompt por defecto
const defaultNegativePrompt = "low quality, worse quality, blurry, bad anatomy, bad proportions, watermark, signature, text, Blood, Bloodbath, Crucifixion, Bloody, Flesh, Bruises, Car crash, Corpse, Crucified, Cutting, Decapitate, Infested, Gruesome, Kill, Infected, Sadist, Slaughter, Teratoma, Tryphophobia, Wound, Cronenberg, Khorne, Cannibal, Cannibalism, Visceral, Guts, Bloodshot, Gory, Killing, Surgery, Vivisection, Massacre, Hemoglobin, Suicide, ahegao, pinup, ballgag, Playboy, Bimbo, pleasure, bodily fluids, pleasures, boudoir, rule34, brothel, seducing, dominatrix, seductive, erotic, seductive, fuck, sensual, Hardcore, sexy, Hentai, Shag, horny, shibari, incest, Smut, jav, succubus, Jerk off, transparent, submissive, dominant, nasty, indecent, legs spread, cussing, flashy, twerk, making love, voluptuous, naughty, wincest, orgy, Sultry, XXX, Bondage, Bdsm, Slavegirl, sex";

// Función para traducir texto usando el backend
const translateText = async (text, targetLang) => {
    const endpoint = "https://googleapi.sergiencorsanywhere.win:2053/translate"; // Asumiendo que este es el endpoint de tu backend

    const requestBody = {
        text: text,
        targetLanguage: targetLang
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Error en la traducción: ${response.statusText}`);
        }

        const data = await response.json();
        return data.translatedText;
    } catch (error) {
        console.error("Error al traducir:", error);
        return null;
    }
};

// Cargar los checkpoints disponibles
async function loadCheckpoints() {
    const checkpointSelect = document.getElementById('checkpoint');

    try {
        const response = await fetch(`${sdApiUrl}/sdapi/v1/sd-models`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://sergien-stablediffusion-app-b5cd08957a3c.herokuapp.com',
            },
        });

        if (!response.ok) {
            throw new Error(`No se pudieron cargar los modelos: ${response.status}`);
        }

        const data = await response.json();
        const models = data || [];

        checkpointSelect.innerHTML = "";

        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.model_name;
            option.textContent = model.title;
            checkpointSelect.appendChild(option);
        });
    } catch (error) {
        alert(`Error al cargar checkpoints: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', loadCheckpoints);

let lastSeed = -1;

document.getElementById('reuse-seed-btn').addEventListener('click', function () {
    if (lastSeed !== -1) {
        document.getElementById('seed').value = lastSeed;
    } else {
        alert("Aún no se ha generado ninguna imagen con una semilla específica.");
    }
});

// Función para extraer la semilla de los metadatos
function extractSeedFromMetadata(base64Image) {
    const binaryString = atob(base64Image);
    const metadataRegex = /Seed: (\d+)/;
    const seedMatch = metadataRegex.exec(binaryString);

    if (seedMatch) {
        return parseInt(seedMatch[1], 10);
    }
    return -1;
}

// Función para obtener el progreso desde la API
async function fetchProgress() {
    try {
        const response = await fetch(`${sdApiUrl}/sdapi/v1/progress`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://sergien-stablediffusion-app-b5cd08957a3c.herokuapp.com',
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener el progreso: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al consultar el progreso:", error);
        return null;
    }
}

// Función para iniciar el seguimiento del progreso
function trackProgress() {
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const progressContainer = document.getElementById('progress-container');

    // Mostrar la barra de progreso
    progressContainer.style.display = "block";

    const intervalId = setInterval(async () => {
        const progressData = await fetchProgress();

        if (progressData) {
            const progressValue = Math.floor(progressData.progress * 100); // Convertir de 0-1 a porcentaje
            progressBar.value = progressValue;
            progressPercentage.textContent = `${progressValue}%`;

            // Ocultar la barra si el progreso alcanza el 100%
            if (progressValue >= 100) {
                clearInterval(intervalId);
                progressContainer.style.display = "none";
            }
        }
    }, 1000); // Consultar cada segundo
}

let generatedImages = []; // Array para almacenar las imágenes
let currentIndex = -1; // Índice de la imagen actual

// Referencias a los botones y a la imagen
const outputImage = document.getElementById('output-image');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Función para actualizar la imagen visible
function updateImageDisplay() {
    if (generatedImages.length > 0 && currentIndex >= 0) {
        outputImage.src = generatedImages[currentIndex];
        outputImage.hidden = false;

        // Mostrar u ocultar las flechas según el índice
        prevBtn.style.visibility = currentIndex > 0 ? "visible" : "hidden";
        nextBtn.style.visibility = currentIndex < generatedImages.length - 1 ? "visible" : "hidden";
    }
}


// Evento del botón "flecha izquierda" (anterior)
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateImageDisplay();
    }
});

// Evento del botón "flecha derecha" (siguiente)
nextBtn.addEventListener('click', () => {
    if (currentIndex < generatedImages.length - 1) {
        currentIndex++;
        updateImageDisplay();
    }
});

// Funcionalidad del formulario
document.getElementById('image-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Inicia el seguimiento del progreso antes de enviar la solicitud
    trackProgress();

    let prompt = document.getElementById('prompt').value;
    prompt = `sfw, ${prompt}, highres, best quality, amazing quality, very aesthetic, absurdres,`;

    const checkpoint = document.getElementById('checkpoint').value;
    const samplingMethod = document.getElementById('sampling-method').value;
    const steps = parseInt(document.getElementById('steps').value);
    const cfg = parseFloat(document.getElementById('cfg').value);
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);
    const seed = document.getElementById('seed').value || -1;

    const requestData = {
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
        override_settings_restore_afterwards: false
    };

    try {
        const response = await fetch(`${sdApiUrl}/sdapi/v1/txt2img`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://sergien-stablediffusion-app-b5cd08957a3c.herokuapp.com',
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`Error en la generación de imagen: ${response.status}`);
        }

        const data = await response.json();
        const imageBase64 = data.images[0];

        lastSeed = extractSeedFromMetadata(imageBase64);
        if (lastSeed !== -1) {
            console.log(`Semilla extraída: ${lastSeed}`);
            document.getElementById('reuse-seed-btn').disabled = false;
        } else {
            console.warn("No se encontró semilla en los metadatos.");
        }

        const outputImage = document.getElementById('output-image');
        outputImage.src = `data:image/png;base64,${imageBase64}`;
        outputImage.hidden = false;
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Ejemplo de traducción
document.getElementById('translate-btn').addEventListener('click', async function () {
    const textToTranslate = document.getElementById('prompt').value;
    const targetLang = 'en'; // Cambia esto según el idioma deseado

    const translatedText = await translateText(textToTranslate, targetLang);

    if (translatedText) {
        document.getElementById('prompt').value = translatedText;
    } else {
        alert("Error al traducir el texto.");
    }
});
