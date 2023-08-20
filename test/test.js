const fs = require('fs');
const { app } = require('../index');
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);


const {
    leerdata,
    crearAnime,
    obtenerAnime,
    eliminarAnime,
    actualizarAnime
} = require('../src/js/utils');


describe('Funciones de manipulación de animes', () => {
    before(() => {
        const initialData = { animes: [{ id: '1', nombre: 'Anime 1', genero: 'Género 1', año: '2021', autor: 'Autor 1' }, { id: '2', nombre: 'Anime 1', genero: 'Género 1', año: '2021', autor: 'Autor 1' }, { id: '3', nombre: 'Anime 1', genero: 'Género 1', año: '2021', autor: 'Autor 1' }, { id: '423', nombre: 'Anime 1', genero: 'Género 1', año: '2021', autor: 'Autor 1' }] };
        fs.writeFileSync('animes_test.json', JSON.stringify(initialData));
    });


    describe('leerdata', () => {
        it('Debería devolver un array de animes', () => {
            const { animes } = leerdata("animes_test.json")
            expect(animes).to.be.an('array');
        });
        it('Debería devolver No existe archivo', () => {
            const animes = leerdata("archivofalso.json");
            expect(animes.message).to.equal("No existe el archivo");
          });
          
          
    });
    

    describe('crearAnime', () => {
        it('Debería crear un anime', () => {
            const anime = crearAnime('Nuevo Anime', 'Nuevo Género', '2022', 'Nuevo Autor', "animes_test.json");
            expect(anime).to.be.an('object');
            expect(anime.id).to.be.a('string');
            expect(anime.nombre).to.equal('Nuevo Anime');
            expect(anime.genero).to.equal('Nuevo Género');
            expect(anime.anio).to.equal('2022');
            expect(anime.autor).to.equal('Nuevo Autor');
          });

        it('No debería crear un anime si faltan parametros', () => {
            const anime = crearAnime('Nuevo Anime', 'Nuevo Género', '2022', 'Nuevo Autor');
            expect(anime.message).to.equal("Faltaron parametros");})
    });


    describe('obtenerAnime', () => {
        it('Debería devolver un anime específico', () => {
            const anime = obtenerAnime('1', "animes_test.json");
            expect(anime).to.be.an('object');
            expect(anime.id).to.equal('1');
            expect(anime.nombre).to.equal('Anime 1');
            expect(anime.genero).to.equal('Género 1');
            expect(anime.año).to.equal('2021');
            expect(anime.autor).to.equal('Autor 1');
        });

        it('Debería devolver false si el anime no existe', () => {
            const anime = obtenerAnime('999', "animes_test.json");
            expect(anime.message).to.equal("no se pudo obtener anime");
        });
    });

    describe('eliminarAnime', () => {
        describe('eliminarAnime', () => {
            it('Debería eliminar un anime existente', () => {
                const result = eliminarAnime('1', "animes_test.json");
                expect(result).to.be.true;
            });
        });

        it('No debería eliminar nada si el anime no existe', () => {
            const result = eliminarAnime('999', "animes_test.json");
            expect(result.message).to.equal("No existe el anime");
        });

    });

    describe('actualizarAnime', () => {
        it('Debería editar un anime existente', () => {
          let updated = actualizarAnime('423', 'Anime Actualizado', 'Género Actualizado', '2022', 'Autor Actualizado', "animes_test.json");
          expect(updated).to.be.true;
        });
      
        it('No debería editar un anime existente si faltan parametros', () => {
           let result = actualizarAnime('423', 'Género Actualizado', 'Autor Actualizado', "animes_test.json");
           expect(result.message).to.equal("Faltaron parametros")
        });
      
        it('No debería editar un anime inexistente', () => {
          let result = actualizarAnime('999', 'Nuevo Nombre', 'Nuevo Género', '2023', 'Nuevo Autor', "animes_test.json");
          expect(result.message).to.equal("No existe el anime")
        });
      });
      

    after(() => {
        fs.unlinkSync('animes_test.json');
    });
});



describe('Verificar handlebars', () => {
    it('Verifica si renderiza correctamente la plantilla de home', async () => {
      const response = await chai.request(app).get('/');
      expect(response).to.have.status(200);
      expect(response.text).to.contain('<h1>Animes</h1>');
    });
  
    it('Verifica si renderiza correctamente la plantilla de crear', async () => {
      const response = await chai.request(app).get('/crear');
      expect(response).to.have.status(200);
      expect(response.text).to.contain('<form id="crear-anime-formulario">');
      expect(response.text).to.contain('<label for="nombre" class="form-label">Nombre Anime</label>');
      expect(response.text).to.contain('<script src="/script/crear-export-hbs.js"></script>');
      expect(response.text).to.contain('<button type="submit" class="btn btn-secondary" id="boton-crear-anime">Enviar</button>');
    });
  
    it('Verificar si renderiza correctamente la plantilla de anime', async () => {
      const response = await chai.request(app).get('/animes');
      expect(response).to.have.status(200);
  
      const { animes } = leerdata('animes.json');
      if (animes.length > 0) {
        expect(response.text).to.contain('<div class="container" id="lista-animes">');
      } else {
        expect(response.text).to.contain('<h1 id="sin-animes">No hay animes</h1>');
      }
    });
  });