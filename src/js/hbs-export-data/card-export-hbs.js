$(document).ready(() => {
  $(".eliminar-anime").click(function() {
    const idAnime = $(this).data("id");
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El anime sera eliminado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `/eliminar/${idAnime}`,
          type: "GET",
          success: (response) => {
              Swal.fire(
                'Excelente!',
                'El anime ha sido eliminado.'
              ).then(() => {
                location.href = "http://localhost:3000/animes";
              });
          },
          error: () => {
            Swal.fire(
              'Error',
              'Upss, Ocurrió un error',
            );
          }
        });
      }
    });
  });
});