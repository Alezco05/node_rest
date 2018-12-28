require('./config/config');
const express = require ('express');

const app = express();

const bodyParser = require('body-parser');
//Tomar datos de la peticion
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.get('/', (req,res)=>{
    res.json('Hola mundo');
});


app.get('/usuario', (req,res)=>{
    res.json(200, 'get Usario');
});

app.post('/usuario', (req,res)=>{
    let body = req.body;
    if(body.nombre === undefined){
        res.status(400).json({
            ok: false,
            mensaje: "El nombre es necesario"
        });
    }
    res.json({
        persona : body
    });
});

app.put('/usuario/:id', (req,res)=>{
    let id = req.params.id;
    res.json({id});
});

app.delete('/usuario', (req,res)=>{
    res.json('Delete Usario');
});

app.listen(process.env.PORT, () =>{
    console.log('Estas en el puerto 3000');
});

 