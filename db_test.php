<?php
$conn = pg_connect("host=c9tiftt16dc3eo.cluster-czz5s0kz4scl.eu-west-1.rds.amazonaws.com port=5432 dbname=dfqpkain0p5sfg user=ucibmnof53rugg password=p22ff19680dd65fcd685746d5db3cf89ae43bf4fcd146e3f1fc4aa3e4fb62e0df");
if (!$conn) {
    echo "Error: No se pudo conectar a la base de datos.";
} else {
    echo "Conexión exitosa a la base de datos.";
}
?>
