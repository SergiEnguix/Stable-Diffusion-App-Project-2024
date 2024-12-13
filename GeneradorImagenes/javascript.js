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

// Funcionalidad del formulario
document.getElementById('image-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    let prompt = document.getElementById('prompt').value;
    prompt = `sfw, ${prompt}`;

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
        console.log(data); // Depurar la estructura de la respuesta

        if (data.seed) { // Ajusta según el formato real del backend
            lastSeed = data.seed;
            document.getElementById('reuse-seed-btn').disabled = false; // Habilitar el botón
        }

        const imageBase64 = data.images[0];
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
