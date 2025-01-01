<?php
session_start();

// Restaurar sesión si hay cookie activa
if (!isset($_SESSION['user']) && isset($_COOKIE['user'])) {
    $_SESSION['user'] = $_COOKIE['user'];
}

// Redirigir al inicio si no hay sesión activa
if (!isset($_SESSION['user'])) {
    header("Location: ../inicio_NotAuth.php");
    exit();
}
?>


<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generador de Imágenes con Stable Diffusion</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Generador de Imágenes con Stable Diffusion</h1>
        <div id="user-info" class="top-right">
            <span>Bienvenido, <strong><?php echo htmlspecialchars($_SESSION['user']); ?></strong></span>
            <form action="../logout.php" method="POST" style="display: inline;">
            <button type="submit">Cerrar sesión</button>
            </form>
        </div>
    </header>
    <main>
        <form id="image-form">
            <label for="prompt">Descripción (Prompt):</label>
            <textarea id="prompt" rows="4" placeholder="Describe la imagen que deseas generar..." required></textarea>

            <button type="button" id="translate-btn">Traducir al inglés</button> <!-- Botón de traducción -->

            <label for="checkpoint">Checkpoint:</label>
            <select id="checkpoint">
                <option value="">Cargando modelos disponibles...</option>
            </select>

            <label for="sampling-method">Método de Muestreo (Sampling Method):</label>
            <select id="sampling-method">
                <option value="Euler">Euler</option>
                <option value="Euler a">Euler a (Recomendado)</option>
                <option value="LMS">LMS</option>
                <option value="DPM2">DPM2</option>
                <option value="DPM2 a">DPM2 a</option>
                <option value="Heun">Heun</option>
                <option value="DPM++ 2S a">DPM++ 2S a</option>
                <option value="DPM++ 2M">DPM++ 2M</option>
            </select>

            <label for="steps">Pasos:</label>
            <input type="number" id="steps" min="10" max="150" value="28" required>

            <label for="cfg">Escala CFG:</label>
            <img src="question-icon.png" alt="Ayuda" class="tooltip" title="Controla la influencia de la descripción en la generación de la imagen. Valores más altos generan imágenes más similares a la descripción.">
            <input type="number" id="cfg" min="1" max="20" step="0.5" value="6.5" required>

            <div class="resolution-buttons">
                <button type="button" class="resolution-btn" data-width="832" data-height="1216">
                    <span class="vertical-rect"></span> Retrato
                </button>
                <button type="button" class="resolution-btn" data-width="1024" data-height="1024">
                    <span class="square-rect"></span> Cuadrado
                </button>
                <button type="button" class="resolution-btn" data-width="1216" data-height="832">
                    <span class="horizontal-rect"></span> Horizontal
                </button>
            </div>


            <!-- Estos inputs ocultos son usados para enviar las dimensiones al servidor -->
            <input type="hidden" id="width" name="width" value="832">
            <input type="hidden" id="height" name="height" value="1216">


            <div class="seed-container">
                <label for="seed">Semilla:</label>
                <div class="seed-input-container">
                    <input type="text" id="seed" placeholder="Opcional (-1 para aleatoria)">
                    <button type="button" id="reuse-seed-btn" class="reuse-btn">🔁 <strong>Copiar última semilla</strong> 🔁</button>
                </div>
            </div>


            <button type="submit" id="submit-btn"><strong>Generar Imagen</strong></button>
        </form>
     
        <div id="result">
            <img id="output-image" src="" alt="Imagen generada" hidden>
        </div>
    </main>

    <script src="javascript.js"></script>

</body>
</html>
