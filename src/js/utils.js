const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

//lee el archivo q le pasen como objeto
const leerdata = (archivo) =>{
  try {
    if (fs.existsSync(archivo)) {
      let data = fs.readFileSync(archivo, "utf-8");
      return JSON.parse(data);
    } else {
      throw new Error("El archivo no existe");
    }
  } catch (error) {
    return error;
  }
}


//actualiza los archivos necesarios
const updateFile = (animes, archivo) => {
  fs.writeFileSync(archivo, JSON.stringify({ animes }));
}

//crea un anime
const crearAnime = (nombre, genero, anio, autor, archivo) => {
  try {
    if (nombre === undefined || genero === undefined || anio === undefined || autor === undefined || archivo === undefined) {
      throw new Error("Faltaron datos por completar")
    }
    else {
      const anime = { id: uuidv4().slice(30), nombre: nombre, genero: genero, anio: anio, autor: autor };
      let { animes } = leerdata(archivo);
      animes.push(anime);
      updateFile(animes, archivo);
      return anime;
    }
  } catch (error) {
    return error
  }
}

//obtiene el anime por id
const obtenerAnime = (id, archivo) => {
  try {
    let { animes } = leerdata(archivo);
    const anime = animes.find(anime => anime.id === id);
    if (anime) {
      return anime;
    } else {
      throw new Error("No se encontro ningun anime con este id");
    }
  } catch (error) {
    return error
  }
}

//elinina un anime por id
const eliminarAnime = (id, archivo) => {
  try {
    let { animes } = leerdata(archivo);
    const updatedAnimes = animes.filter(anime => anime.id !== id);
    if (updatedAnimes.length === animes.length) {
      throw new Error("No existe el anime")
    }
    else {
      updateFile(updatedAnimes, archivo);
      return true;
    }
  } catch (error) {
    return error
  }
}

const actualizarAnime = (id, nuevoNombre, nuevoGenero, nuevoanio, nuevoAutor, archivo) => {
  try {
    if (!id || !nuevoNombre || !nuevoGenero || !nuevoanio || !nuevoAutor) {
      throw new Error("Faltaron parametros");
    }
    let { animes } = leerdata(archivo);
    const index = animes.findIndex(anime => anime.id == id);
    if (index === -1) {
      throw new Error("No existe el anime");
    }
    animes[index].nombre = nuevoNombre;
    animes[index].genero = nuevoGenero;
    animes[index].anio = nuevoanio;
    animes[index].autor = nuevoAutor;
    updateFile(animes, archivo);
    return true;
  } catch (error) {
    return error
  }
}




module.exports = {
  leerdata,
  crearAnime,
  obtenerAnime,
  eliminarAnime,
  actualizarAnime
}