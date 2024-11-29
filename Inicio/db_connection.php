<?php
// Configuración de conexión a la base de datos
$host = 'localhost';
$user = 'root'; // Cambia esto si tienes un usuario distinto en MySQL
$password = ''; // Cambia esto si tienes una contraseña
$database = 'easysdapp';

// Crear conexión
$conn = new mysqli($host, $user, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>