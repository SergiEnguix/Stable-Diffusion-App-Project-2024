<?php
// La URL de conexión de PostgreSQL proporcionada por Heroku
$dbUrl = 'postgres://ucibmnof53rugg:p22ff19680dd65fcd685746d5db3cf89ae43bf4fcd146e3f1fc4aa3e4fb62e0df@c9tiftt16dc3eo.cluster-czz5s0kz4scl.eu-west-1.rds.amazonaws.com:5432/dfqpkain0p5sfg';

// Analizar la URL de conexión
$dbParts = parse_url($dbUrl);

$host = $dbParts['host'];
$port = $dbParts['port'];
$user = $dbParts['user'];
$password = $dbParts['pass'];
$dbname = ltrim($dbParts['path'], '/');

// Crear la conexión a PostgreSQL
$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

// Comprobar la conexión
if (!$conn) {
    die("Conexión fallida: " . pg_last_error());
}
?>

