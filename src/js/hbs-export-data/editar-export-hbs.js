$(document).ready(() => {
  $("#editar-anime-formulario").submit(function (event) {
    event.preventDefault();
    const idAnime = $("#id").text().trim();
    const datos = {
      id: idAnime,
      nombre: $("#nombre").val(),
      anio: $("#anio").val(),
      autor: $("#autor").val(),
      genero: $("#genero").val(),
    };

    $.ajax({
      url: `/editar/${datos.id}`,
      type: "POST",
      data: datos,
      success: () => {

        Swal.fire(
          'Excelente!',
          `Anime ${datos.nombre} editado!`,
        ).then(() => {
          location.href = `http://localhost:3000/editar/${datos.id}`;
        });
      }
      ,
      error: () => {
        Swal.fire(
          'Error',
          'Upss, ocurrió un error'
        );
      }
    });
  });
});
