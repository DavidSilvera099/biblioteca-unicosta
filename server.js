const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/prestamo', (req, res) => {
  const { id, nombre, apellido, titulo, autor, editorial, año } = req.body;

  if (!id || !nombre || !apellido || !titulo || !autor || !editorial || !año) {
    return res.redirect('/error.html');
  }

  const filePath = path.join(__dirname, 'data', `id_${id}.txt`);

  // Verifica si el archivo ya existe
  fs.exists(filePath, (exists) => {
    if (exists) {
      // Si el archivo existe, redirige a una página de error o envía un mensaje
      res.redirect(`/error.html?error=El archivo con el ID ${id} ya existe`);
    } else {
      // Si no existe, crea el archivo y permite la descarga
      const content = `${id}, ${nombre}, ${apellido}, ${titulo}, ${autor}, ${editorial}, ${año}`;
      fs.writeFile(filePath, content, (err) => {
        if (err) throw err;
        res.download(filePath);
      });
    }
  });
});

app.listen(5000, () => {
  console.log('Servidor corriendo en http://localhost:5000');
});
