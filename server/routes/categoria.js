const express = require('express');
const app = express();

let { verificarToken } = require('../middlewares/autenficacion');
let { verificarUsuario } = require('../middlewares/autenficacion');

let Categoria = require('../models/categoria');

// ======================
// Mostar todas las categorias
// ======================
app.get('/categoria', (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            else {
                res.json({
                    ok: true,
                    categorias
                });
            }
        })
});


// ======================
// Mostar una categoria por ID
// ======================
app.get('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id)
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            else {
                res.json({
                    ok: true,
                    categoria
                });
            }
        })
});
// ======================
// Crear una nueva categoria
// ======================
app.post('/categoria', verificarToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});
// ======================
// Actualizar categoria
// ======================
app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    //Parametros que se pueden actualizar con la funcion pick del underscore
    let body = req.body
    let desCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoriaUpdate) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaUpdate
        });
    })

});
// ======================
// Delete Categoria
// ======================
app.delete('/categoria/:id', [verificarToken, verificarUsuario], (req, res) => {
    //Solo un administadro
    let id = req.params.id;
    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            Categoria: categoriaBorrada
        })
    })
});


module.exports = app;