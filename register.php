<?php
require_once 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $confirm_password = trim($_POST['confirm_password']);

    // Validar campos vacíos
    if (empty($username) || empty($email) || empty($password) || empty($confirm_password)) {
        die("Todos los campos son obligatorios.");
    }

    // Verificar que las contraseñas coincidan
    if ($password !== $confirm_password) {
        die("Las contraseñas no coinciden.");
    }

    // Verificar si el usuario o correo electrónico ya están registrados
    $query = "SELECT * FROM users WHERE username = $1 OR email = $2";
    $result = pg_query_params($conn, $query, array($username, $email));

    if (pg_num_rows($result) > 0) {
        die("El usuario o correo electrónico ya están registrados.");
    }

    // Insertar el usuario en la base de datos
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    $insert_query = "INSERT INTO users (username, email, password, created_at) VALUES ($1, $2, $3, NOW())";
    $insert_result = pg_query_params($conn, $insert_query, array($username, $email, $hashed_password));

    if ($insert_result) {
        // Redirigir a inicio_NotAuth.php tras el registro exitoso
        header("Location: inicio_NotAuth.php?success=1");
        exit(); // Asegurar que se detiene el script tras la redirección
    } else {
        echo "Error al registrar usuario: " . pg_last_error($conn);
    }

    pg_free_result($result); // Liberar el resultado de la consulta
    pg_free_result($insert_result); // Liberar el resultado de la inserción
    pg_close($conn); // Cerrar la conexión a la base de datos
}
?>
