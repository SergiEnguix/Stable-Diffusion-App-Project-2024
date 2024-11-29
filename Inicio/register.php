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

    // Verificar si el usuario ya existe
    $query = "SELECT * FROM users WHERE username = ? OR email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ss', $username, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        die("El usuario o correo electrónico ya están registrados.");
    }

    // Insertar el usuario en la base de datos
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    $insert_query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    $insert_stmt = $conn->prepare($insert_query);
    $insert_stmt->bind_param('sss', $username, $email, $hashed_password);

    if ($insert_stmt->execute()) {
        echo "Registro exitoso. ¡Ahora puedes iniciar sesión!";
    } else {
        echo "Error al registrar usuario: " . $conn->error;
    }

    $stmt->close();
    $insert_stmt->close();
    $conn->close();
}
?>