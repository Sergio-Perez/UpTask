<?php
// Obtiene la pagina actual que ejecuta
function  obtenerPaginaActual(){
    $archivo = basename($_SERVER["PHP_SELF"]);
    $pagina = str_replace(".php","",$archivo);

    return $pagina;
}

/* Consultas */
/* Obtener todos los proyectos*/

function obtenerProyectos(){
    include "conexion.php";
    try {
        return $conn->query("SELECT id, nombre FROM proyectos");

    }catch(Exception $e){
        echo "Error! : " . $e->getMessage();
        return false;
    }
}

// Obtener nombre del Proyecto

function obteberNombreProyecto($id = null){
    include "conexion.php";

    try {
    return $conn->query("SELECT nombre FROM proyectos WHERE id = {$id}");

    }catch(Exception $e){
        echo "Error! : " . $e->getMessage();
        return false;
    }
}
// obtener las clases del Proyecto
function obteberTareasProyecto($id = null){
    include "conexion.php";

    try {
    return $conn->query("SELECT id,nombre_tarea,estado FROM tareas WHERE id_proyecto = {$id}");

    }catch(Exception $e){
        echo "Error! : " . $e->getMessage();
        return false;
    }
}