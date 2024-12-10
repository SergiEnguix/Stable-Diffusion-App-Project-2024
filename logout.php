<?php
session_start();

// Destruir sesión
session_unset();
session_destroy();

// Eliminar cookie
setcookie('user', '', time() - 3600, "/");

// Redirigir a la página de inicio sin autenticar
header("Location: ./inicio_NotAuth.php");
exit();
?>
