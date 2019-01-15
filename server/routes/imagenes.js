const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const {verificarToken} = require('../middlewares/autenficacion');
const {verificarTokenImg} = require('../middlewares/autenficacion');

app.get('/imagen/:tipo/:img',verificarTokenImg, (req,res)=>{
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if(fs.existsSync(pathImage)){
        res.sendFile(pathImage);
 
    }else{
        let noImagePath= path.resolve(__dirname,'../assets/no-image.jpg');
        res.sendFile(noImagePath);

    }
})



module.exports = app;