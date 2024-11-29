<?php
require_once 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    // Validar campos vacíos
    if (empty($username) || empty($password)) {
        die("Todos los campos son obligatorios.");
    }

    // Buscar al usuario en la base de datos
    $query = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // Verificar la contraseña
        if (password_verify($password, $user['password'])) {
            echo "Inicio de sesión exitoso. ¡Bienvenido, " . htmlspecialchars($user['username']) . "!";
        } else {
            echo "Contraseña incorrecta.";
        }
    } else {
        echo "El usuario no existe.";
    }

    $stmt->close();
    $conn->close();
}
?>