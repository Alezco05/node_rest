const express = require('express');
const { verificarToken } = require('../middlewares/autenficacion');
const _ = require('underscore');
const app = express();
const Producto = require('../models/producto');

/// ======================
/// Obtener producto
/// ======================
app.get('/producto',verificarToken ,(req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({disponible:true})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }
            else {
                res.json({
                    ok: true,
                    producto
                })
            }
        })
});
/// ======================
/// Obtener Producto por ID
/// ======================
app.get('/producto/:id',verificarToken , (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: true,
                    err
                })
            }
            res.json({
                ok: true,
                producto
            })
        })
});
/// ======================
/// Buscar un Producto 
/// ======================
app.get('/producto/buscar/:texto',verificarToken,(req,res)=>{
    let texto = req.params.texto;
    //Se crea una expresion regular para poder Buscar 
    //y se usa la 'i' para que no distinga entre mayusculas y minusculas
    let regex = new RegExp(texto,'i');
    Producto.find({nombre:regex})
    .populate('categoria')
    .exec((err,productos)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok:true,
            productos
        })
    })
})

/// ======================
/// Crear un Producto 
/// ======================
app.post('/producto/', verificarToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
});
/// ======================
/// Actualizar un Producto 
/// ======================
app.put('/producto/:id',verificarToken , (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible']);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoUpdate) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoUpdate) {
            return res.status(400).json({
                ok: false,
                message: 'Producto no encontrado'
            })
        }
        res.json({
            ok: true,
            producto: productoUpdate
        });
    });
});
/// ======================
/// Borrar un producto
/// ======================
app.delete('/producto/:id',verificarToken , (req, res) => {
    //disponible -> falso
    //populate usuario categoria del listado
    let id = req.params.id;
    Producto.findByIdAndUpdate
    let cambiaEstado = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoEliminado) {
            return res.status(400).json({
                ok: false,
                message: 'Producto no encontrado'
            })
        }
        res.json({
            ok: true,
            producto: productoEliminado
        })
    })
});



module.exports = app;