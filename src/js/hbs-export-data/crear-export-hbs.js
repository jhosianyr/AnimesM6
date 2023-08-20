
$(document).ready(() => {
    $("#crear-anime-formulario").submit((event) => {
        event.preventDefault();

        const datos = {
            nombre: $("#nombre").val(),
            anio: $("#anio").val(),
            autor: $("#autor").val(),
            genero: $("#genero").val()
        };

        $.ajax({
            url: "/crear",
            type: "POST",
            data: datos,
            success: (response) => {
                    Swal.fire(
                        'Excelente!',
                        `Anime ${datos.nombre} creado!`
                    ).then(() => {
                        setTimeout(() => {
                        location.href = "http://localhost:3000/";
                        }, 100)
                    });
                },
            error: () => {
                Swal.fire(
                    'Error',
                    'Upss, ocurrió un error'
                );
            }
        });
    });
});