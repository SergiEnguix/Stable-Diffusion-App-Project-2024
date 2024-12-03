<?php
require_once 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // Validar campos vacíos
    if (empty($email) || empty($password)) {
        die("Todos los campos son obligatorios.");
    }

    // Verificar si el usuario existe
    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        die("Credenciales inválidas.");
    }

    $user = $result->fetch_assoc();

    // Verificar la contraseña
    if (password_verify($password, $user['password'])) {
        echo "Inicio de sesión exitoso. Bienvenido, " . htmlspecialchars($user['username']) . "!";
    } else {
        die("Credenciales inválidas.");
    }

    $stmt->close();
    $conn->close();
}
?>
