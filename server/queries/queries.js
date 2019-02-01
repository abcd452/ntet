const Pool = require('pg').Pool;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectionData = require('../config/config').connectionData;

const pool = new Pool(connectionData); 
// ALL QUERIES, HERE: 

const createUser = (request, response) => {
  const body = request.body

  pool.query('INSERT INTO usuario (num_cel_u, nombre,apellido,tarjeta_c,password,dist_por_pagar,dist_total) VALUES ($1, $2, $3, $4, $5, $6, $7)', [body.cel,body.name,body.ap,bcrypt.hashSync(body.tc,10),bcrypt.hashSync(body.pass,10),body.dp,body.dt], (error, results) => {
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

const getUserById = (request, response) => {
  //ToDo  
};


const loginUser = (request,response) => {
  let body = request.body;
  
  pool.query('SELECT password, num_cel_u , nombre , apellido FROM usuario WHERE num_cel_u = $1',[body.num], (error, results) =>{
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
      nombre: results.rows[0].nombre,
      apellido: results.rows[0].apellido
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

module.exports = {
  createUser,
  getUserById,
  deleteUser,
  updateUser,
  getAllUsers,
  loginUser
};

