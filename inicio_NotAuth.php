<!DOCTYPE html>
<html lang="es">

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
            <!-- Alerta de registro exitoso -->
        <div id="alertSuccess" style="display: none;">
            <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
            <span id="AlertTextSuccess">✅ ¡Tu registro se ha realizado con éxito! (Esta ventana se cerrará en 10 segundos) ✅</span>
        </div>
        <div id="alertFailure" style="display: none;">
            <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
            <span id="AlertTextFailure">❌ ¡Error al registrar el usuario! (Esta ventana se cerrará en 10 segundos) ❌</span>
        </div>
        <h1>Easy Stable Diffusion App v1.0</h1>
        <button id="button1" onclick="showModal('loginModal')"><b>Iniciar Sesión</b></button>
        <button id="button2" onclick="showModal('registerModal')"><b>Registrarme</b></button>
    </div>

    <!-- Texto de pie de página -->
    <footer>
        Proyecto Final ASIR 2024 de Sergi Enguix Peiró
    </footer>

    <!-- Formularios flotantes -->
    <!-- Modal de inicio de sesión -->
    <div id="loginModal" class="modal">
        <button class="close" onclick="closeModal('loginModal')">&times;</button>
        <h2>Iniciar Sesión</h2>
        <form action="login.php" method="POST">
            <input type="text" name="username" placeholder="Usuario" required>
            <input type="password" name="password" placeholder="Contraseña" required>
            <button type="submit">Entrar</button>
        </form>
    </div>


    <!-- Modal de registro -->
    <div id="registerModal" class="modal">
        <button class="close" onclick="closeModal('registerModal')">&times;</button>
        <h2>Registrarse</h2>
        <form action="register.php" method="POST">
            <input type="text" name="username" placeholder="Usuario" required>
            <input type="email" name="email" placeholder="Correo Electrónico" required>
            <input type="password" name="password" placeholder="Contraseña" required>
            <input type="password" name="confirm_password" placeholder="Confirmar Contraseña" required>
            <button type="submit">Registrar</button>
        </form>
    </div>


    <!-- Fondo oscuro al abrir los modales -->
    <div id="overlay" class="overlay"></div>

    <script src="scripts.js"></script>

    
</body>

</html>