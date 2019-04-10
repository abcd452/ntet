//==========PORT===========//
process.env.PORT = process.env.PORT || 8080;
//=========================//


//==========DB connection =====//
module.exports.connectionData = process.env.connectionData || {
    user: 'postgres',
    host: 'localhost',
    database: 'ntet',
    password: 'misterio',
    port: 5432,
};
//==========================//

//=========SEED FOR HASH FUNCTIONS ====//
process.env.SEED = process.env.SEED || 'misterio';

module.exports.connectionDataUser = process.env.connectionDataUser || {
    user: 'usuario',
    host: 'localhost',
    database: 'ntet',
    password: 'misterio',
    port: 5432,
};