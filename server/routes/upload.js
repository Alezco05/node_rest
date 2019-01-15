const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


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
    const tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son ' + tiposValidos.join(' y '),
                tipo: tipo
            }
        });
    }
    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    // Extensiones permitidas 
    const extensionesValida = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValida.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La extensiones permitidas son ' + extensionesValida.join(', '),
                ext: extension
            }
        });
    }
    //Cambiar nombre Archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }
        if (tipo === 'usuarios') {
            // No enviamos el objeto Response
            imagenUsuario(id, nombreArchivo, (user) => {
                const { status, ok, message } = user //Destructuring ES6
                if (user.ok) {
                    return res.status(status).json({ ok: ok, message: message, user: user });//Tambien ...json({ok, message}) ES6
                } else {
                    return res.status(status).json({ ok: ok, err: err }); //Tambien ...json({ok, err}) ES6 
                }
            });
        }
        else if (tipo === 'productos') {
            imagenProducto(id, nombreArchivo, (producto) => {
                const { status, ok, message } = producto //Destructuring ES6
                if (producto.ok) {
                    return res.status(status).json({ ok: ok, message: message, producto: producto });//Tambien ...json({ok, message}) ES6
                } else {
                    return res.status(status).json({ ok: ok, err: err }); //Tambien ...json({ok, err}) ES6 
                }
            });
        }
    });
});
function imagenUsuario(id, nombreArchivo, callback) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            callback({ status: 500, ok: false, err: err.message })
            borrarArchivo(nombreArchivo, 'usuarios');
        }
        if (!usuarioDB) {
            callback({ status: 400, ok: false, err: 'No existe el usuario' })
            borrarArchivo(nombreArchivo, 'usuarios');
        }
        borrarArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) { callback({ status: 500, ok: false, err: err.message }) }
            callback({ status: 200, ok: true, message: 'Archivo guardado', usuario: usuarioGuardado })
        })
    })
}

function imagenProducto(id, nombreArchivo, callback) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            callback({ status: 500, ok: false, err: err.message })
            borrarArchivo(nombreArchivo, 'productos');
        }
        if (!productoDB) {
            callback({ status: 400, ok: false, err: 'No existe el producto' })
            borrarArchivo(nombreArchivo, 'productos');
        }
        borrarArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if (err) { callback({ status: 500, ok: false, err: err.message }) }
            callback({ status: 200, ok: true, message: 'Archivo guardado', Producto: productoGuardado })
        })
    })
}

function borrarArchivo(nombreImagen, tipo) {
    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}
module.exports = app;