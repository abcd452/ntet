const Pool = require('pg').Pool;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectionData = {
    user: 'postgres',
    host: 'localhost',
    database: 'ntet',
    password: 'mysecretpass',
    port: 5432,
  };

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
    response.status(201).send(`User added with ID:`);
  })
};


const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        response.status(400).json({
          ok:false,
          err:error
        });
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      response.status(400).json({
        ok:false,
        err:error
      });
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      return response.status(400).json({
        ok:false,
        err:error
      });
    }
    response.status(200).json(results.rows)
  })
};


const loginUser = (request,response) => {
  let body = request.body;
  
  pool.query('SELECT password FROM usuario WHERE num_cel_u = $1',[body.num], (error, results) =>{
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

    

    let token = jwt.sign({usuario: 'OK'}, 'notanfacil',{expiresIn: 14400});

    response.status(200).json({
      ok:true,
      token
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

