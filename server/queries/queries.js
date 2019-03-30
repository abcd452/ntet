const Pool = require('pg').Pool;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const connectionData = require('../config/config').connectionData;
const pool = new Pool(connectionData);
let carrerasPorTomar = new Array();
let usuariosAceptados = new Array();

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

const createDirFav = (request, response) => {
    const body = request.body;
    const schema = {
        cel: Joi.string().min(10).max(13).required().regex(/^[0-9]+$/),
        nombre: Joi.string().min(3).max(250).required().regex(/^[a-zA-Z0-9]+$/),
        coords: Joi.string().min(5).max(80).required()
    };

    const {error} = Joi.validate(request.body, schema);

    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    pool.query('INSERT INTO dir_fav (num_cel_u, nombre_dir, coords_gps_u) VALUES ($1, $2, $3)',
        [body.cel, body.nombre, body.coords], (error, results) => {
            if (error) {
                console.log(body.cel);
                console.log(body.nombre);
                console.log(body.coords);
                console.log(error);
                return response.status(400).json({
                    ok: false,
                    err: error
                });
            }

            response.status(201).json({
                ok: true,
                message: `Direccion guardada con exito`,
                usuario: {
                    nombre: body.nombre,
                    coords: body.coords,
                    usuario: body.cel
                }
            });
        })

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

const pedirCarrera = (request, response) => {

    const body = request.body;
    const schema = {
        num: Joi.string().min(10).max(13).required().regex(/^[0-9]+$/),
        coordsI: Joi.string().required(),
        coordsF: Joi.string().required()
    };

    const {error} = Joi.validate(request.body, schema);

    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    pool.query('SELECT * FROM closest($1)', [body.coordsI], (error, results) => {
        if (error) {
            return response.status(404).json({
                ok: false,
                err: error
            });
        }

        response.status(201).json({
            ok: true,
            message: `Busqueda con exito, esperando confirmacion del taxista`,
            busqueda: {
                celular: body.num,
            }
        });
        for (let i = 0; i < results.rows.length; i++) {
            let meter = [body.num, results.rows[i].id_taxista, results.rows[i].placa, body.coordsI, body.coordsF];
            carrerasPorTomar.push(meter);
            console.log(carrerasPorTomar[i]);
        }
    });
};

const comenzarCarrera = (request, response) => {
    const body = request.body;

    console.log('comenzando carrera...');
    let usuario_busqueda; //usuario al que el taxista le acepto la carrera
    let placaTaxista, coordsI, coordsF;

    function existe (x){
        for (let i = 0; i < carrerasPorTomar.length; i++){
            if (x === carrerasPorTomar[i][1]){
                usuario_busqueda = carrerasPorTomar[i][0];
                placaTaxista = carrerasPorTomar[i][2];
                coordsI = carrerasPorTomar[i][3];
                coordsF = carrerasPorTomar[i][4];
                return true;
            }
        }
        return false;
    }

    function borrar(x) {
        for (let i = 0; i < carrerasPorTomar.length; i++) {
            if (x === carrerasPorTomar[i][0]) { //borra todos los taxistas que no alcanzaron a aceptar del usuario carrerasPorTomar
                i -= 1;
                carrerasPorTomar.splice(i, 1);
            } else if (x === body.id_taxista) { //borra todas las apariciones del taxista que acepto la carrera de carrerasPorTomar
                i -= 1;
                carrerasPorTomar.splice(i, 1);
            }
        }
    }

    if (existe(body.id_taxista)){
        response.status(201).json({
            ok: true,
            message: `Carrera encontrada!`,
            busqueda: {
                usuario: usuario_busqueda,
                taxista: body.id_taxista
            }
        });
        borrar(usuario_busqueda);
        usuariosAceptados.push([usuario_busqueda, body.id_taxista, placaTaxista, coordsI, coordsF]);
        console.log(carrerasPorTomar);
    } else {
        response.status(204).json({
            ok: true,
            message: 'Su servicio no ha sido solicitado'
        });
    }
};

const confirmarCarrera = (request, response) => {

    const body = request.body;
    const schema = {
        num: Joi.string().min(10).max(13).required().regex(/^[0-9]+$/)
    };

    const {error} = Joi.validate(request.body, schema);

    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    let taxista, placa, coordsI, coordsF;
    //console.log(usuariosAceptados[0][0], usuariosAceptados[0][1], usuariosAceptados[0][2], usuariosAceptados[0][3], usuariosAceptados[0][4]);

    function existe(x) {
        for (let i = 0; i < usuariosAceptados.length; i++) {
            if (x === usuariosAceptados[i][0]) {
                taxista = usuariosAceptados[i][1];
                placa = usuariosAceptados[i][2];
                coordsI = usuariosAceptados[i][3];
                coordsF = usuariosAceptados[i][4];

                usuariosAceptados.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    //console.log(taxista, placa, coordsI, coordsF);

    //comenzar_carrera('3167434500', '1234', 'AAA111', '(3.380049,-76.536052)', '(3.382234,-76.537919)');

    if (existe(body.num)) {
        pool.query('SELECT comenzar_carrera($1, $2, $3, $4, $5)',
            [body.num, taxista, placa, coordsI, coordsF], (error, results) => {
                if (error) {
                    return response.status(400).json({
                        ok: false,
                        err: error
                    });
                }

                //select * from usuario_a_taxista('1234', 'AAA111');
                pool.query('SELECT * FROM usuario_a_taxista($1, $2)',
                    [taxista, placa], (error, results) => {
                        if (error) {
                            return response.status(404).json({
                                ok: false,
                                err: error
                            });
                        }

                        let vistaDeTaxista = {
                            nombreCompleto: results.rows[0].nombre_completo,
                            numeroCelTaxista: results.rows[0].numero_de_celular,
                            placa: results.rows[0].placa,
                            marcaModelo: results.rows[0].marca_y_modelo,
                            numeroDeViajes: results.rows[0].numero_de_viajes,
                            puntaje: results.rows[0].puntaje
                        };
                        response.status(200).json({
                            ok: true,
                            vistaDeTaxista,
                            message: 'La Carrera ha comenzado',
                        });
                    });

            });
    } else {
        response.status(204).json({
            ok: true,
            message: 'Su solicitud no ha sido aceptada'
        });
    }
};




module.exports = {
    createUser, //Crea el usuario
    createTaxista, //Crea el taxista
    getUserById,
    deleteUser,
    updateUser,
    loginUser, //Logea al usuario a la aplicacion
    getDirections,
    pedirCarrera, //Permite al usuario pedir un taxi
    createDirFav,
    comenzarCarrera, //Permite al taxista saber si ha sido solicitado, en caso de serlo puede aceptar la carrera
    confirmarCarrera
};

