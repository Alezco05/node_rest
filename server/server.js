require('./config/config');
const mongoose = require('mongoose');
const express = require ('express');
const app = express();


const bodyParser = require('body-parser');
//Tomar datos de la peticion
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

app.get('/', (req,res)=>{
    res.json('Hola mundo');
});




mongoose.connect('mongodb://localhost:27017/cafe',(err,res) =>{
    if(err) throw err;
    console.log("Conexion establecida");
});

app.listen(process.env.PORT, () =>{
    console.log('Estas en el puerto 3000');
});

 