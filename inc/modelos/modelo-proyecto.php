<?php

$accion = $_POST["accion"];
$proyecto = $_POST["proyecto"];



if($accion === "crear"){
    // importar conexión
    include "../funciones/conexion.php";
    
    try{
        // realizar consulta a la bbdd
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?) ");
        $stmt->bind_param("s", $proyecto);
        $stmt->execute();

        if($stmt->affected_rows){
            $respuesta = array (
                "solucion" => $stmt->error_list,
                "respuesta" => "correcto",
                "id_insertado" => $stmt->insert_id,
                "tipo" => $accion,
                "nombre_proyecto" => $proyecto
            );
              

        $stmt->close();
        $conn->close(); 
        } 
    } catch(Exception $e){
        // en caso de error tomar la exception    
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
  echo json_encode($respuesta,JSON_UNESCAPED_UNICODE);
}