<?php
require_once 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    // Validar campos vacíos
    if (empty($username) || empty($password)) {
        die("Todos los campos son obligatorios.");
    }

    // Verificar si el usuario existe
    $query = "SELECT * FROM users WHERE username = $1";
    $result = pg_query_params($conn, $query, array($username));

    if (!$result) {
        die("Error al ejecutar la consulta: " . pg_last_error());
    }

    if (pg_num_rows($result) === 0) {
        // Usuario no encontrado
        header("Location: inicio_NotAuth.php?error=Usuario o contraseña incorrectos");
        exit();
    }

    $user = pg_fetch_assoc($result);

    // Verificar la contraseña
    if (password_verify($password, $user['password'])) {
        // Login exitoso, redirigir a inicio_Auth.php
        session_start();
        $_SESSION['user'] = $user['username']; // Guardar usuario en la sesión
        // Crear cookie para mantener la sesión activa
        setcookie('user', $user['username'], time() + (30 * 24 * 60 * 60), "/"); // Expira en 30 días
        header("Location: ./inicio_Auth.php");
        exit();
    } else {
        // Contraseña incorrecta
        header("Location: ./inicio_NotAuth.php?error=Usuario o contraseña incorrectos");
        exit();
    }

    pg_free_result($result);
    pg_close($conn);
}
?>
