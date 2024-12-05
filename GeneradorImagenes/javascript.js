const corsProxy = 'https://cors.sergiencorsanywhere.win:443/';
const sdApiUrl = corsProxy + 'http://127.0.0.1:8443';

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

// Funcionalidad del formulario
document.getElementById('image-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const prompt = document.getElementById('prompt').value;
    const checkpoint = document.getElementById('checkpoint').value;
    const samplingMethod = document.getElementById('sampling-method').value;
    const steps = parseInt(document.getElementById('steps').value);
    const cfg = parseFloat(document.getElementById('cfg').value);
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);
    const seed = document.getElementById('seed').value || -1;

    const requestData = {
        prompt: prompt,
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
        const imageBase64 = data.images[0];
        const outputImage = document.getElementById('output-image');
        outputImage.src = `data:image/png;base64,${imageBase64}`;
        outputImage.hidden = false;
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});
