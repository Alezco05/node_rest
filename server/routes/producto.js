const express = require('express');
const {verificarToken} = require('../middlewares/autenficacion');

const app = express();
const Producto = require('../models/producto');

/// ======================
/// Obtener Productos
/// ======================
app.get('/productos',(req,res)=>{
    //populate usuario categoria
    //paginado
});
/// ======================
/// Obtener Producto por ID
/// ======================
app.get('/productos/:id',(req,res)=>{
    //populate usuario categoria
});







module.exports = app;