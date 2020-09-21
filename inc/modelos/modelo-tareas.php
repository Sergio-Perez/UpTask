<?php


$accion = $_POST["accion"];
$id_proyecto =  (int) $_POST["id_proyecto"];
$tarea = $_POST["tarea"];
$estado = $_POST["estado"];
$id_tarea = (int) $_POST["id"];



if($accion === "crear"){
    // importar conexión
    include "../funciones/conexion.php";
    
    try{
        // realizar consulta a la bbdd
        $stmt = $conn->prepare("INSERT INTO tareas (nombre_tarea, id_proyecto) VALUES (?, ?) ");
        $stmt->bind_param("si", $tarea,$id_proyecto);
        $stmt->execute();

        if($stmt->affected_rows){
            $respuesta = array (
                "solucion" => $stmt->error_list,
                "respuesta" => "correcto",
                "id_insertado" => $stmt->insert_id,
                "tipo" => $accion,
                "tarea" => $tarea
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
if($accion === "actualizar"){
       // importar conexión
       include "../funciones/conexion.php";
    
       try{
           // realizar consulta a la bbdd
           $stmt = $conn->prepare("UPDATE tareas set estado = ? WHERE  id = ?");
           $stmt->bind_param("ii", $estado,$id_tarea);
           $stmt->execute();
   
           if($stmt->affected_rows > 0){
               $respuesta = array (
                   "respuesta" => "correcto",
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

   if($accion === "eliminar"){
    // importar conexión
    include "../funciones/conexion.php";
 
    try{
        // realizar consulta a la bbdd
        $stmt = $conn->prepare("DELETE from tareas WHERE  id = ?");
        $stmt->bind_param("i", $id_tarea);
        $stmt->execute();

        if($stmt->affected_rows > 0){
            $respuesta = array (
                "respuesta" => "correcto",
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

