eventListeners();
/// lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {
    // Document REady
    document.addEventListener("DOMContentLoaded", function() {
        actualizarProgreso();

    });
    // boton para crear proyecto
    document.querySelector(".crear-proyecto a").addEventListener("click", nuevoProyecto);


    // Boton para una nueva tarea
    if (document.querySelector(".nueva-tarea") !== null) {
        document.querySelector(".nueva-tarea").addEventListener("click", agregarTarea);
    }
    // BOtone spra las acciones de las tares
    document.querySelector('.listado-pendientes').addEventListener("click", accionesTareas);
}



function nuevoProyecto(e) {
    e.preventDefault();

    // Crea un input para el nimbre del nuevo proyecto
    var nuevoProyecto = document.createElement("li");
    nuevoProyecto.innerHTML = "<input type='text' id='nuevo-proyecto'>";
    listaProyectos.appendChild(nuevoProyecto);


    // seleccionar el id con el nuevo proyecto
    var inputNuevoProyecto = document.querySelector("#nuevo-proyecto");


    // al presionar enter crea el proyecto


    inputNuevoProyecto.addEventListener("keypress", function(e) {
        var tecla = e.which || e.keyCode;
        if (tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }

    });

}

function guardarProyectoDB(nombreProyecto) {


    // Crear llamamiento a Ajax
    var xhr = new XMLHttpRequest();

    // Enviar datos por FormData
    var datos = new FormData();
    datos.append("proyecto", nombreProyecto);
    datos.append("accion", "crear");

    // Abrir conexion
    xhr.open("POST", "inc/modelos/modelo-proyecto.php", true);

    // En la carga
    xhr.onload = function() {
            if (this.status === 200) {
                // obtener datos de la respuesta
                var respuesta = JSON.parse(xhr.responseText);
                var proyecto = respuesta.nombre_proyecto,
                    id_proyecto = respuesta.id_insertado,
                    tipo = respuesta.tipo,
                    resultado = respuesta.respuesta;

                // Comprobar la insercción
                if (resultado === "correcto") {
                    // fue correcto
                    if (tipo === "crear") {
                        // Se creo un nievo proyecto
                        // poner en el HTML
                        var nuevoProyecto = document.createElement("li");
                        nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                            ${proyecto}
                        </a>
                        `;
                        // agregar al html
                        listaProyectos.appendChild(nuevoProyecto);

                        // eviar Alerta
                        Swal.fire({
                                text: "El proyecto: " + proyecto + " se creó correctamente",
                                title: "Proyecto Creado",
                                type: "success"
                            })
                            .then(resultado => {
                                // redireccionar a la nueva URL
                                if (resultado.value) {
                                    window.location.href = "index.php?id_proyecto=" + id_proyecto;
                                }
                            })

                    } else {
                        // Se actualizo o se elimino

                    }

                } else {
                    // hubo un error
                    Swal.fire({
                        type: 'error',
                        title: 'Error!',
                        text: 'Hubo un Error!',

                    })
                }
            }

        }
        // Enviar el Request
    xhr.send(datos);

}
// Agregar una nueva tarea al proyecto actulal
function agregarTarea(e) {
    e.preventDefault();
    var nombreTarea = document.querySelector(".nombre-tarea").value;
    // Validar que el campo  no este vacio

    if (nombreTarea === "") {
        Swal.fire({
            type: 'error',
            title: 'Error!',
            text: 'La Tarea no puede estar Vacia!',

        })
    } else {
        // la tarea no esta vacia , insertar en PHP

        // Crear  llamado a ajax
        var xhr = new XMLHttpRequest();

        // Crear FOrmData
        var datos = new FormData();
        datos.append("tarea", nombreTarea);
        datos.append("accion", "crear");
        datos.append("id_proyecto", document.querySelector("#id_proyecto").value);


        //Abrir conexio
        xhr.open("POST", "inc/modelos/modelo-tareas.php", true);

        // Ejecutarlo y respuesta
        xhr.onload = function() {
                if (this.status === 200) {
                    // todo correcto
                    var respuesta = JSON.parse(xhr.responseText);
                    console.log(respuesta);
                    //asignar valore
                    var resultado = respuesta.respuesta,
                        tarea = respuesta.tarea,
                        id_insertado = respuesta.id_insertado,
                        tipo = respuesta.tipo;

                    if (resultado === "correcto") {
                        //se agrego correctamente
                        if (tipo === "crear") {
                            // lanzaar alerta
                            Swal.fire({
                                type: 'success',
                                title: 'Tarea Creada',
                                text: 'La tarea: ' + tarea + " se creó correctamente"

                            });

                            // Seleccionear el parrafo con lista-vacia
                            var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                            if (parrafoListaVacia.length > 0) {
                                document.querySelector('.lista-vacia').remove();
                            }

                            // construir el template
                            var nuevaTarea = document.createElement("li");

                            // agregamos ID
                            nuevaTarea.id = "tarea:" + id_insertado;

                            // agregar la clase a tarea
                            nuevaTarea.classList.add("tarea");

                            //construir en el HTML
                            nuevaTarea.innerHTML = `
                                <p>${tarea}</p>
                                <div class="acciones">
                                    <i class="far fa-check-circle"></i>
                                    <i class="fas fa-trash"></i>
                                </div>
                            
                            `;

                            // Agragarlo al HTNL
                            var listado = document.querySelector(".listado-pendientes ul");
                            listado.appendChild(nuevaTarea);

                            // limpiar Formulario
                            document.querySelector(".agregar-tarea").reset();

                            //Actualizar el progreso

                            actualizarProgreso();



                        }

                    } else {
                        // hubo un error
                        Swal.fire({
                            type: 'error',
                            title: 'Error!',
                            text: 'Hubo un Error!',

                        })
                    }
                }
            }
            // Enviar consulta
        xhr.send(datos);
    }
}



// Cambia elk estasdo de las tareas o las elimina
function accionesTareas(e) {
    e.preventDefault();

    if (e.target.classList.contains("fa-check-circle")) {
        if (e.target.classList.contains("completo")) {
            e.target.classList.remove("completo");
            cambiarEstadoTarea(e.target, 0);

        } else {
            e.target.classList.add("completo");
            cambiarEstadoTarea(e.target, 1);


        }
    }
    if (e.target.classList.contains("fa-trash")) {
        Swal.fire({
            title: 'Segur@?',
            text: "Esta acción no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.value) {
                var tareaEliminar = e.target.parentElement.parentElement;
                //Borrar de la base de datos
                eliminarTareaBD(tareaEliminar);

                // Borrar del html
                tareaEliminar.remove();
                Swal.fire(
                    'Borrado!',
                    'La tareas se ha borrado!',
                    'success'
                )
            }
        })

    }


}

// Completa o descompleta tarea
function cambiarEstadoTarea(tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split(":");

    // Crear  llamado a ajax
    var xhr = new XMLHttpRequest();

    // Crear FOrmData
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', "actualizar");
    datos.append("estado", estado);


    // Open conexión
    xhr.open("POST", "inc/modelos/modelo-tareas.php", true);

    // ON load
    xhr.onload = function() {
            if (this.status === 200) {
                // todo correcto
                var respuesta = JSON.parse(xhr.responseText);
                console.log(respuesta);
                //Actualizar el progreso
                actualizarProgreso();


            }
        }
        //Enviar datos
    xhr.send(datos);
}

// Eliminar tarea BBDD
function eliminarTareaBD(tarea) {
    var idTarea = tarea.id.split(":");

    // Crear  llamado a ajax
    var xhr = new XMLHttpRequest();

    // Crear FOrmData
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', "eliminar");


    // Open conexión
    xhr.open("POST", "inc/modelos/modelo-tareas.php", true);

    // ON load
    xhr.onload = function() {
            if (this.status === 200) {
                // todo correcto

                console.log(JSON.parse(xhr.responseText));

                //comprobar que haya tareas restantes
                var listaTareasRestantes = document.querySelectorAll("li.tarea");
                if (listaTareasRestantes.length === 0) {
                    document.querySelector(".listado-pendientes ul").innerHTML =
                        "<p class='lista-vacia'> No hay tareas en este proyecto </p>";

                }
                //Actualizar el progreso
                actualizarProgreso();


            }
        }
        //Enviar datos
    xhr.send(datos);

}
// Acutualiza el avance del proyecto
function actualizarProgreso() {

    // obtener todas las tareas
    const tareas = document.querySelectorAll("li.tarea");
    // obtener las taeas completadas
    const tareasCompletadas = document.querySelectorAll("i.completo");
    // determinar el avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

    //Asignar el avance ala barra
    const porcentaje = document.querySelector("#porcentaje");
    const porcentajeStyle = document.querySelector(".porcentaje");
    console.log(porcentajeStyle);

    porcentaje.style.width = avance + "%";
    //Mostrar una alerta completar 100 %
    if (avance === 100) {
        Swal.fire({
            type: 'success',
            title: 'Proyecto terminado',
            text: 'Ya no tienes tareas pendientes!',

        });
        porcentajeStyle.style.backgroundColor = "#00e2ff";

    } else {
        porcentajeStyle.style.backgroundColor = "#00b762";

    }

}