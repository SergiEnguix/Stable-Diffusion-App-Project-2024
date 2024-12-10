const corsProxy = 'https://cors.sergiencorsanywhere.win:443/';
const sdApiUrl = corsProxy + 'http://127.0.0.1:8443';

// Negative prompt por defecto
const defaultNegativePrompt = "low quality, worse quality, blurry, bad anatomy, bad proportions, watermark, signature, text, Blood, Bloodbath, Crucifixion, Bloody, Flesh, Bruises, Car crash, Corpse, Crucified, Cutting, Decapitate, Infested, Gruesome, Kill, Infected, Sadist, Slaughter, Teratoma, Tryphophobia, Wound, Cronenberg, Khorne, Cannibal, Cannibalism, Visceral, Guts, Bloodshot, Gory, Killing, Surgery, Vivisection, Massacre, Hemoglobin, Suicide, ahegao, pinup, ballgag, Playboy, Bimbo, pleasure, bodily fluids, pleasures, boudoir, rule34, brothel, seducing, dominatrix, seductive, erotic, seductive, fuck, sensual, Hardcore, sexy, Hentai, Shag, horny, shibari, incest, Smut, jav, succubus, Jerk off, transparent, submissive, dominant, nasty, indecent, legs spread, cussing, flashy, twerk, making love, voluptuous, naughty, wincest, orgy, Sultry, XXX, Bondage, Bdsm, Slavegirl, sex";

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
        const models = data || []; // Asegúrate de que data tenga los modelos que esperas

        // Limpiar opciones previas
        checkpointSelect.innerHTML = "";

        // Añadir los modelos al desplegable
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.model_name; // Tomamos el model_name como valor
            option.textContent = model.title; // Mostramos el título como texto
            checkpointSelect.appendChild(option);
        });
    } catch (error) {
        alert(`Error al cargar checkpoints: ${error.message}`);
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', loadCheckpoints);

let lastSeed = -1; // Variable para almacenar la última semilla generada

document.getElementById('reuse-seed-btn').addEventListener('click', function () {
    if (lastSeed !== -1) {
        document.getElementById('seed').value = lastSeed; // Asignar la última semilla al campo de entrada
    } else {
        alert("Aún no se ha generado ninguna imagen con una semilla específica.");
    }
});

// Funcionalidad del formulario
document.getElementById('image-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Obtener el prompt ingresado por el usuario
    let prompt = document.getElementById('prompt').value;

    // Añadir el tag "sfw" al prompt
    prompt = `sfw, ${prompt}`;

    const checkpoint = document.getElementById('checkpoint').value;
    const samplingMethod = document.getElementById('sampling-method').value;
    const steps = parseInt(document.getElementById('steps').value);
    const cfg = parseFloat(document.getElementById('cfg').value);
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);
    const seed = document.getElementById('seed').value || -1;

    // Crear objeto de datos con negative prompt incluido
    const requestData = {
        prompt: prompt,
        negative_prompt: defaultNegativePrompt, // Añadir el negative prompt aquí
        steps: steps,
        cfg_scale: cfg,
        width: width,
        height: height,
        seed: parseInt(seed),
        sampler_name: samplingMethod,
        override_settings: {
            "sd_model_checkpoint": checkpoint // Establecer el modelo aquí
        },
        override_settings_restore_afterwards: false // No restaurar el modelo automáticamente
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

        // Guardar la última semilla generada
        if (data.info && data.info.seed) {
            lastSeed = data.info.seed; // Asume que el API devuelve la semilla en `data.info.seed`
        }

        const imageBase64 = data.images[0];
        const outputImage = document.getElementById('output-image');
        outputImage.src = `data:image/png;base64,${imageBase64}`;
        outputImage.hidden = false;
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});
