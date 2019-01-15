const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
// ==================
// VERIFICAR TOKEN
// ==================

let verificarToken = (req,res,next)=>{
    //Toma el token que viene del header de la peticion
    let token = req.get('token');

    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message: "Token no valido"
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

// ==================
// VERIFICAR AdminRole
// ==================
let verificarUsuario = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
         next();
     } else {
        return res.json({
             ok: false,
            err: {
                 message: 'El usuario no es administrador'
            }
        });
    }
};
// ==================
// VERIFICAR token para la imagen
// ==================
let verificarTokenImg = (req,res,next)=>{
    let token = req.query.token;
    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message: "Token no valido"
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    verificarToken,
    verificarUsuario,
    verificarTokenImg
}