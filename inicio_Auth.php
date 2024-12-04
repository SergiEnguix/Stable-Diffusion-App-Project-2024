<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: ./inicio_NotAuth.php");
    exit();
}
?>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Easy Stable Diffusion App v1.0</title>
    <link rel="stylesheet" href="./estilo.css">
</head>

<body>
    <!-- Video de fondo -->
    <video id="background-video" autoplay loop muted>
        <source src="./video.mp4" type="video/mp4">
        Tu navegador no soporta video HTML5.
    </video>

    <!-- Contenido principal -->
    <div class="container">
        <h1>Easy Stable Diffusion App v1.0</h1>
        <h3>Bienvenido, <?php echo htmlspecialchars($_SESSION['user']); ?>!</h3>
        <button id="button1" onclick="window.location.href='./GeneradorImagenes/GeneradorImagenes.php'"><b>Ir al Generador</b></button>
    </div>

    <!-- Texto de pie de página -->
    <footer>
        Proyecto Final ASIR 2024 de Sergi Enguix Peiró
    </footer>

</body>

</html>