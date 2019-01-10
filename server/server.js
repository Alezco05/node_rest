require('./config/config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
//Modulo de Node que sirve para trazar rutas 
const path = require('path');

const bodyParser = require('body-parser');
//Tomar datos de la peticion
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Habilitar la carpeta publica usando path
app.use(express.static(path.resolve(__dirname ,'../public')));
//Configuracion GLOBLA de las rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log("Conexion establecida");
});

app.listen(process.env.PORT, () => {
    console.log('Estas en el puerto 3000');
});

