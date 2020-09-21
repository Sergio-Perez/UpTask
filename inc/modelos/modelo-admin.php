<?php


$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if($accion === "crear"){
    // Código crear administradores 

    // hasehear password
    $opciones = array( 
            "cost" => 12
    );
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
    
  

    
    // importar conexión
    include "../funciones/conexion.php";
    
    try{
        // realizar consulta a la bbdd
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?) ");
        $stmt->bind_param("ss", $usuario, $hash_password);
        $stmt->execute();

        if($stmt->affected_rows){
            $respuesta = array (
                "solucion" => $stmt->error_list,
                "respuesta" => "correcto",
                "id_insertado" => $stmt->insert_id,
                "tipo" => $accion
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
  echo json_encode($respuesta);
}


if($accion === "login"){
    //codigo logear a los  administradores 

    // importar conexión
    include "../funciones/conexion.php";

    try {
            // Seleccionar el administrador de la base de datos
            $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ? ");
            $stmt->bind_param("s", $usuario);
            $stmt->execute();

            // Logear usuario
            $stmt->bind_result($nombre_usuario ,$id_usuario , $pass_usuario);
            //$stmt->store_result();
            $stmt->fetch();
            if($nombre_usuario){
                // ELusuario existe verificar password
                if(password_verify($password, $pass_usuario)){
                    // Iniciar la sesion
                    session_start();
                    $_SESSION["nombre"] = $usuario;
                    $_SESSION["id"] =  $id_usuario;
                    $_SESSION["login"] = true;

                    // Login correcto
                    $respuesta = array (
                        "respuesta" => "correcto",
                        "nombre" => $nombre_usuario,
                        "tipo" => $accion
                        
                    );
                } else{
                    //Login incorrecto, enviar error
                    $respuesta = array(
                        "resultado" => "Password Incorrecto"
                    );

                }
            } else{
                $respuesta = array(
                    "error" => "Usuario no existe"
                );
            }

            $stmt->close();
            $conn->close();


    } catch(Exception $e){
        // en caso de error tomar la exception    
        $respuesta = array(
            'pass' => $e->getMessage()
        );
    }
  echo json_encode($respuesta,JSON_UNESCAPED_UNICODE);
}


?>