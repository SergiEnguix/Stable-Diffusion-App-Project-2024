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

            <!-- Mostrar el nombre del usuario -->
            <span>Bienvenido, <strong><?php echo htmlspecialchars($_SESSION['user']); ?></strong></span>
            
            <!-- Formulario para cerrar sesión -->
            <form action="../logout.php" method="POST" style="display: inline;">
            <button type="submit">Cerrar sesión</button>
            </form>
        </div>
    </header>
    <main>
        <form id="image-form">
            <!-- Campo para ingresar la descripción de la imagen -->
            <label for="prompt">Descripción (Prompt):</label>
            <textarea id="prompt" rows="4" placeholder="Describe la imagen que deseas generar..." required></textarea>

            <!-- Botón para traducir la descripción al inglés -->
            <button type="button" id="translate-btn">Traducir al inglés</button> <!-- Botón de traducción -->

            <!-- Selección del modelo de generación de imágenes -->
            <label class="form-label" for="checkpoint">Checkpoint:
            <img src="question-icon.png" alt="?" class="tooltip" title="Selecciona uno de los dos modelos: Realistico (RealVisXL) o Anime (NoobaiXL).">
            </label>
            <select id="checkpoint">
                <option value="">Cargando modelos disponibles...</option>
            </select>

            <!-- Selección del método de muestreo -->
            <label class="form-label" for="sampling-method">Método de Muestreo (Sampling Method):
            <img src="question-icon.png" alt="?" class="tooltip" title="Determina el método que usará el modelo de IA para generar las imágenes.">
            </label>
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

            <!-- Campo para ingresar el número de pasos -->
            <label class="form-label" for="steps">Pasos:
            <img src="question-icon.png" alt="?" class="tooltip" title="Determina el número de iteraciones para generar la imagen. Más pasos pueden dar mayor calidad pero aumentan el tiempo de generación.">
            </label>
            <input type="number" id="steps" min="10" max="150" value="28" required>

            <!-- Campo para ingresar la escala CFG -->
            <label class="form-label" for="cfg">Escala CFG:
            <img src="question-icon.png" alt="?" class="tooltip" title="Controla la influencia de la descripción en la generación de la imagen. Valores más altos generan imágenes más similares a la descripción.">
            </label>
            <input type="number" id="cfg" min="1" max="20" step="0.5" value="6.5" required>

            <!-- Botones para seleccionar la resolución de la imagen -->
            <div class="resolution-buttons-text">
            <span><b>Selecciona el tipo de resolución de la imágen:</b></span>
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
            </div>

            <!-- Estos inputs ocultos son usados para enviar las dimensiones al servidor -->
            <input type="hidden" id="width" name="width" value="832">
            <input type="hidden" id="height" name="height" value="1216">

            <!-- Campo para ingresar la semilla -->
            <div class="seed-container">
                <label class="form-label" for="seed">Semilla:
                <img src="question-icon.png" alt="?" class="tooltip" title="Repetir la misma semilla llevará a resultados similares al de la imagen asociada a esta.">
                </label>
                <div class="seed-input-container">
                    <input type="text" id="seed" placeholder="Opcional (-1 para aleatoria)">
                    <button type="button" id="reuse-seed-btn" class="reuse-btn">🔁 <strong>Copiar última semilla</strong> 🔁</button>
                </div>
            </div>

            <!-- Botón para generar la imagen -->
            <button type="submit" id="submit-btn"><strong>Generar Imagen</strong></button>
        </form>
     
        <!-- Contenedor para mostrar las imágenes generadas -->
        <div id="result">
            <img id="output-image" src="" alt="Imagen generada" hidden>
        </div>
    </main>

    <script src="javascript.js"></script>

</body>
</html>
