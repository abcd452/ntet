const Pool = require('pg').Pool;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectionData = require('../config/config').connectionData;
const pool = new Pool(connectionData); 


// ALL QUERIES, HERE: 

const createUser = (request, response) => {
  const body = request.body

  pool.query('INSERT INTO usuario (num_cel_u, nombre_u,apellido_u,tarjeta_credito,password) VALUES ($1, $2, $3, $4, $5)', [body.cel,body.name,body.ap,bcrypt.hashSync(body.tc,10),bcrypt.hashSync(body.pass,10)], (error, results) => {
    if (error) {
      return response.status(400).json({
        ok:false,
        err:error
      });
    }
    response.status(201).json({
      ok:true,
      message: `Usuario: ${body.name} ${body.ap} con celular: ${body.cel} creado con exito`,
      usuario: {
        name: body.name,
        apellido: body.ap,
        num_cel: body.cel
      }  
    });
  })
};


const updateUser = (request, response) => {
  //ToDo
};

const deleteUser = (request, response) => {
   //ToDo
};


const loginUser = (request,response) => {
  let body = request.body;
  
  pool.query('SELECT password, num_cel_u , nombre_u , apellido_u FROM usuario WHERE num_cel_u = $1',[body.num], (error, results) =>{
    if(error) {
      return response.status(404).json({
        ok:false,
          error
      });  
    }

    if(!results.rows[0]){
      return response.status(400) .json({
        ok:false,
        mensaje: 'Usuario o contraseña incorrectos'
      }); 
    }


    if (!bcrypt.compareSync(body.pass,results.rows[0].password)) {
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

    let token = jwt.sign({usuario},process.env.SEED,{expiresIn: 14400}); // 4 horas

    response.status(200).json({
      ok:true,
      token,
      usuario
    });

  });
  
};

const getAllUsers = (request,response) => {
  pool.query('SELECT * FROM usuario',(error,results) => {
    if(error){
      return response.status(400).json({
        ok:false,
        err:error
      });  
    }
    response.status(200).json(results.rows);
  });
};


const getUserById = (request,response) => {
  pool.query('SELECT * FROM perfiles_usuarios WHERE numero_de_celular = $1',[request.params.id],(error,results) => {
    if(error){
      return response.status(400).json({
        ok:false,
        err:error
      });  
    }
    response.status(200).json(results.rows);
  });
};


const createTaxista = (request, response) => {
  const body = request.body;

  pool.query('INSERT INTO taxista (id_taxista, nombre_t, apellido_t, puntaje, num_cuenta, num_cel_t,dist_por_cobrar, dist_total_t, password_t) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [body.id, body.name, body.ln, body.score, body.acc, body.cel, body.claim, body.td, bcrypt.hashSync(body.pass,10)], (error, results) => {
      if (error) {
          return response.status(400).json({
              ok:false,
              err:error
          });
      }
      response.status(201).json({
          ok:true,
          message: `taxista: ${body.name} ${body.ln} con id: ${body.id} creado con exito`,
          taxista: {
              nombre: body.name,
              apellido: body.ln,
              id: body.id
          }
      });
  })
};


module.exports = {
  createUser,
  getUserById,
  deleteUser,
  updateUser,
  getAllUsers,
  loginUser,
  createTaxista
};

