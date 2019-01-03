const express = require ('express');
const app = express();

const Usuario = require('../models/usuario');

app.get('/usuario', (req,res)=>{
    res.json(200, 'get Usario');
});

app.post('/usuario', (req,res)=>{
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        role: body.role
    });
    usuario.save((err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            ok:true,
            usuario:usuarioDB
        });
    });
});

app.put('/usuario/:id', (req,res)=>{
    let id = req.params.id;
    res.json({id});
});

app.delete('/usuario', (req,res)=>{
    res.json('Delete Usario');
});


module.exports = app;