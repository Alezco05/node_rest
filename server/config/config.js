

/// ==================
// Puerto
/// ==================

process.env.PORT = process.env.PORT || 3000;

/// ==================
// Entorno
/// ==================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
/// ==================
// Vencimiento del Token
// 60 segundos 
// 60 minutos
// 24 horas 
// 30 dias
/// ==================

process.env.CADUCIDAD_TOKEN = '48h';


/// ==================
// Semilla de autenficacion
/// ==================
process.env.SEED = process.env.SEED  || 'este-es-el-seed-desarrollo'

/// ==================
// Base de datos
/// ==================
let urlDB;
if(process.env.NODE_ENV=== 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';

}
else{
    urlDB = 'mongodb://cafe-user:abc123@ds011379.mlab.com:11379/cafe_de_jhon';
}  
process.env.URLDB = urlDB;


/// ==================
/// Google Client ID
/// ==================

process.env.CLIENT_ID = process.env.CLIENT_ID || '219758474264-vh1bibcphgvbc32km508lubtqkanikf1.apps.googleusercontent.com';