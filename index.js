const express = require('express');
const app = express();
const exphbs = require("express-handlebars");
const {leerdata,crearAnime,obtenerAnime,eliminarAnime,actualizarAnime} = require('./src/js/utils');
const port = 3000;

app.use(
  "/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist/css")
);
app.use(
  "/swet",
  express.static(__dirname + "/node_modules/sweetalert2/dist/")
);
app.use(
  "/script",
  express.static(__dirname + "/src/js/hbs-export-data")
);

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configuracion de handlebars
app.set("view engine", "handlebars");
const handlebars = exphbs.create({
  defaultLayout: __dirname + "/views/layout/main.handlebars",
  layoutsDir: __dirname + "/views",
  partialsDir: __dirname + "/views/partials",
});
app.engine("handlebars", handlebars.engine);

// END POINTS
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/crear", (req, res) => {
  res.render("crear");
});

app.get('/animes', (req, res) => {
  const { animes } = leerdata("animes.json");
  res.render('animes', { animes: animes });
});

app.get("/animes/:id", (req, res) => {
  const { id } = req.params;
  const anime = obtenerAnime(id,"animes.json");
  res.render("detalles", { anime: anime });
});
app.post("/crear", (req, res) => {
  try {
    const { nombre, genero, anio, autor } = req.body;
    if (nombre == undefined || genero == undefined || anio == undefined || autor == undefined) {
      throw new Error("Datos Incompletos");
    }
    crearAnime(nombre, genero, anio, autor, "animes.json");
    res.status(200).send("Anime creado exitosamente");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/eliminar/:id", (req, res) => {
  try {
    const { id } = req.params;
    const anime = obtenerAnime(id,"animes.json");
    if (!anime) {
      throw new Error("Anime no existe");
    }
    eliminarAnime(id,"animes.json");
    res.status(200).send("Anime eliminado exitosamente")
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Busca el anime y lo envia hacia la vista para editar.
app.get("/editar/:id", (req, res) => {
  const { id } = req.params;
  const anime = obtenerAnime(id,"animes.json");
  res.render("editar", { anime: anime })
});

app.post("/editar/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, genero, anio, autor } = req.body;
    if (nombre === undefined || genero === undefined || anio === undefined || autor === undefined) {
      throw new Error("Datos Incompletos");
    }
    const isUpdated = actualizarAnime(id, nombre, genero, anio, autor,"animes.json");
    if (isUpdated) {
      res.status(200).send("Anime editado exitosamente");
    } else {
      throw new Error("Anime no existe");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});



app.listen(port, () => console.log(`Lets go, listen in port ${port}`));

module.exports = { app };
