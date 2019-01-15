const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');


// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function (req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    
    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    //Valida tipo 
    const tiposValidos = ['productos','usuarios'];
    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son ' + tiposValidos.join(' y '),
                tipo : tipo
            }
        });
    }
    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length-1];
    // Extensiones permitidas 
    const extensionesValida = ['png','jpg','gif','jpeg'];
    if(extensionesValida.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La extensiones permitidas son ' + extensionesValida.join(', '),
                ext : extension
            }
        });
    }


    //Cambiar nombre Archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({ok: false,err});
        }

        // No enviamos el objeto Response
        imagenUsuario(id, nombreArchivo, (user) =>{
            if(user.ok){
               const {status, ok, message} = user //Destructuring ES6
               return res.status(status).json({ok:ok,message:message});//Tambien ...json({ok, message}) ES6
            }else{
               const {status, ok, err} = user //Destructuring ES6
               return res.status(status).json({ok:ok,err:err}); //Tambien ...json({ok, err}) ES6 
            }
        });  
    });

    // ANTIGUA
    /* archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        imagenUsuario(id,res,nombreArchivo);
        //Imagen Cargada

        res.json({
            ok: true,
            message: 'Archivo enviado'
        })
    }); */
});

/* function imagenUsuario(id,res,nombreArchivo){
    Usuario.findById(id,(err,usuarioDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err: {message: 'No existe el usuario'
            }});
        }
        let pathImage = path.resolve(__dirname,`../../uploads/usuarios/${usuarioDB}`);
        if(fs.existsSync(pathImage)){
            fs.unlinkSync(pathImage);
        }
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err,usuarioGuardado)=>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioGuardado
            })
        })
    })
} */

function imagenUsuario(id, nombreArchivo, callback){
    Usuario.findById(id, (err, usuarioDB) =>{
        if (err) 
            callback({status:500, ok:false, err:err.message})

        if(!usuarioDB)
            callback({status:400, ok:false, err:'No existe el usuario'})

        let pathImage = path.resolve(__dirname,`../../uploads/usuarios/${usuarioDB.img}`);
        if(fs.existsSync(pathImage)){
            fs.unlinkSync(pathImage);
        }
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) 
                 callback({status:500, ok:false, err:err.message})

            callback({status:200, ok:true, message: 'Archivo guardado'})
        })
    })
}

function imagenProducto(){
    
}

module.exports = app;