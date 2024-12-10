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

            <label for="checkpoint">Checkpoint:</label>
            <select id="checkpoint">
                <option value="">Cargando modelos disponibles...</option>
            </select>

            <label for="sampling-method">Método de Muestreo (Sampling Method):</label>
            <select id="sampling-method">
                <option value="Euler">Euler</option>
                <option value="Euler a">Euler a</option>
                <option value="LMS">LMS</option>
                <option value="DPM2">DPM2</option>
                <option value="DPM2 a">DPM2 a</option>
                <option value="Heun">Heun</option>
                <option value="DPM++ 2S a">DPM++ 2S a</option>
                <option value="DPM++ 2M">DPM++ 2M</option>
            </select>

            <label for="steps">Pasos:</label>
            <input type="number" id="steps" min="10" max="150" value="50" required>

            <label for="cfg">Escala CFG:</label>
            <input type="number" id="cfg" min="1" max="20" step="0.5" value="7.5" required>

            <label for="width">Ancho (px):</label>
            <input type="number" id="width" min="512" max="1536" step="64" value="1024" required>

            <label for="height">Alto (px):</label>
            <input type="number" id="height" min="512" max="1536" step="64" value="1024" required>

            <label for="seed">Semilla (Seed):</label>
            <input type="number" id="seed" min="0" placeholder="Deja en blanco para usar una semilla aleatoria.">

            <button type="submit">Generar Imagen</button>
        </form>
        
        <div id="result">
            <img id="output-image" src="" alt="Imagen generada" hidden>
        </div>
    </main>

    <script src="javascript.js"></script>

</body>
</html>
