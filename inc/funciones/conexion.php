<?php

$conn = new mysqli("localhost","root", 123456, "uptask");
// Manera comprobar la conexion
// echo "<pre>";
 // var_dump($conn->ping()); //o var_dump($conn);
//echo "</pre>";
if($conn->connect_error){
    echo $conn->connect_error;
}
// Para que se puedan usar ñ o "" y no  falle
$conn->set_charset("utf8");
?>