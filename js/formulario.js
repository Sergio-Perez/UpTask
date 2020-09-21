eventListener();

function eventListener() {
    document.querySelector("#formulario").addEventListener("submit", validarRegistro);


}


function validarRegistro(e) {
    e.preventDefault();

    var usuario = document.querySelector("#usuario").value,
        password = document.querySelector("#password").value,
        tipo = document.querySelector("#tipo").value;

    if (usuario === "" || password === "") {

        // el formulario fallo
        Swal.fire({
            type: 'error',
            title: 'Error!',
            text: 'Los dos campos son Obligatorios!',

        })
    } else {
        // Ambos campos son correctos, ejecutar Ajax

        var datos = new FormData();
        datos.append("usuario", usuario);
        datos.append("password", password);
        datos.append("accion", tipo);

        // Mirar los datos de  FormData ->  console.log(datos.get('usuario'));

        // crear el llamado ajax

        var xhr = new XMLHttpRequest();

        // abrir conexción
        xhr.open("POST", "inc/modelos/modelo-admin.php", true);


        //retorno de datos
        xhr.onload = function() {

                if (this.status === 200) {


                    var respuesta = JSON.parse(xhr.responseText);


                    console.log(respuesta);
                    // si la respuesta es correcta
                    if (respuesta.respuesta === "correcto") {

                        //Si es un nuevo usuadio
                        if (respuesta.tipo == "crear") {
                            Swal.fire({
                                type: "success",
                                title: "Creando correctamente",
                                text: "Bienvenido a ..."
                            });

                        } else if (respuesta.tipo === "login") {
                            Swal.fire({
                                    type: "success",
                                    title: "Login Correcto",
                                    text: "Presiona OK para abrir el dashboard"
                                })
                                .then(resultado => { // arrow funtcion
                                    if (resultado.value) {
                                        window.location.href = "index.php";
                                    }
                                })

                        }

                    } else {
                        //hubo un error
                        Swal.fire({
                            type: 'error',
                            title: 'Error!',
                            text: 'Hubo un Error!',

                        });
                    }

                }


            }
            // Enviar petición
        xhr.send(datos);
    }
}