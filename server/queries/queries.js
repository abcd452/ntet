const Pool = require('pg').Pool;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const connectionData = require('../config/config').connectionData;
const pool = new Pool(connectionData);

// ALL QUERIES, HERE: 

const createUser = (request, response) => {
    const body = request.body;

    const schema = {
        cel: Joi.string().min(10).max(13).required().regex(/^[0-9]+$/),
        name: Joi.string().min(3).max(50).required().regex(/^[a-zA-Z]+$/),
        ap: Joi.string().min(3).max(50).required().regex(/^[a-zA-Z]+$/),
        tc: Joi.string().length(16).required().regex(/^[0-9]+$/),
        pass: Joi.string().min(8).required()
    };

    const {error} = Joi.validate(request.body, schema);

    if (error) {
        response.status(400).send(error.details[0].message);
    } else {
        pool.query('INSERT INTO usuario (num_cel_u, nombre_u, apellido_u, tarjeta_credito, password) VALUES ($1, $2, $3, $4, $5)',
            [body.cel, body.name, body.ap, bcrypt.hashSync(body.tc, 10), bcrypt.hashSync(body.pass, 10)], (error, results) => {
                if (error) {
                    return response.status(400).json({
                        ok: false,
                        err: error
                    });
                }
                response.status(201).json({
                    ok: true,
                    message: `Usuario: ${body.name} ${body.ap} con celular: ${body.cel} creado con exito`,
                    usuario: {
                        name: body.name,
                        apellido: body.ap,
                        num_cel: body.cel
                    }
                });
            })
    }
};

const createTaxista = (request, response) => {
    const body = request.body;

    const schema = {
        id_taxista: Joi.string().max(20).required().regex(/^[0-9]+$/),
        nombre_t: Joi.string().min(3).max(50).required().regex(/^[a-zA-Z]+$/),
        apellido_t: Joi.string().min(3).max(50).required().regex(/^[a-zA-Z]+$/),
        num_cel_t: Joi.string().min(10).max(13).required().regex(/^[0-9]+$/),
        password_t: Joi.string().min(8).required(),
        num_cuenta: Joi.string().max(24).required().regex(/^[0-9]+$/)
    };

    const {error} = Joi.validate(request.body, schema);

    if (error) {
        response.status(400).send(error.details[0].message);
    } else {
        pool.query('INSERT INTO taxista (id_taxista, nombre_t, apellido_t, num_cel_t, password_t, num_cuenta) VALUES ($1, $2, $3, $4, $5, $6)',
            [body.id_taxista, body.nombre_t, body.apellido_t, body.num_cel_t, bcrypt.hashSync(body.password_t, 10),
                bcrypt.hashSync(body.num_cuenta, 10)], (error, results) => {

                if (error) {
                    return response.status(400).json({
                        ok: false,
                        err: error
                    });
                }
                response.status(201).json({
                    ok: true,
                    message: `taxista: ${body.nombre_t} ${body.apellido_t} con id: ${body.id_taxista} creado con exito`,
                    taxista: {
                        nombre: body.nombre_t,
                        apellido: body.apellido_t,
                        id: body.id_taxista
                    }
                });
            });
    }

};

const updateUser = (request, response) => {
    //ToDo
};

const deleteUser = (request, response) => {
    //ToDo
};


const loginUser = (request, response) => {
    let body = request.body;
    const schema = {
        num: Joi.string().min(10).max(13).required().regex(/^[0-9]+$/),
        pass: Joi.string().min(8).required()
    };

    const {error} = Joi.validate(request.body, schema);

    if (error){
        return response.status(400).send(error.details[0].message);
    }

    pool.query('SELECT password, num_cel_u , nombre_u , apellido_u FROM usuario WHERE num_cel_u = $1', [body.num], (error, results) => {
        if (error) {
            return response.status(404).json({
                ok: false,
                error
            });
        }

        if (!results.rows[0]) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Usuario o contraseña incorrectos'
            });
        }


        if (!bcrypt.compareSync(body.pass, results.rows[0].password)) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Usuario o contraseña incorrectos',
            });
        }

        let usuario = {
            num_cel_u: results.rows[0].num_cel_u,
            nombre: results.rows[0].nombre_u,
            apellido: results.rows[0].apellido_u,
            role: 'User'
        };

        let token = jwt.sign({usuario}, process.env.SEED, {expiresIn: 14400}); // 4 horas

        response.status(200).json({
            ok: true,
            token,
            usuario
        });

    });

};


const getDirections = (request, response) => {
    pool.query('SELECT * FROM dir_fav WHERE num_cel_u = $1', [request.params.id], (error, result) => {
      if(error){
        return response.status(400).json({
          ok: false,
          err:error  
        });  
      }
      response.status(200).json(results.rows);  
    });
};


const getUserById = (request, response) => {
    pool.query('SELECT * FROM perfiles_usuarios WHERE numero_de_celular = $1', [request.params.id], (error, results) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                err: error
            });
        }
        response.status(200).json(results.rows);
    });
};


module.exports = {
    createUser,
    createTaxista,
    getUserById,
    deleteUser,
    updateUser,
    loginUser,
    getDirections
};

