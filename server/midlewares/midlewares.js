const jwt = require('jsonwebtoken');
require('../config/config');

const verificaToken = function(req,res,next) {
    let token = req.query.token;

    jwt.verify(token,process.env.SEED,(err,decoed) => {
        if(err){
            return res.status(401).json({
                ok:false,
                message: 'Token incorrecto'
            });    
        }
        
        req.usuario = decoded.usuario;

        next();

    });

};

module.exports = {
    verificaToken
};