const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'content_templates',
  password: 'postgres',
  port: 5432,
})

const getTemplates = (request, response) => {
  pool.query('SELECT * FROM templates', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows)
  })
}

const getTemplateByTemplateCode = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM templates WHERE Code = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email], (error, results) => {
    if (error) {
      throw error
    } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
    	throw error
    }
    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })
}

const createTemplate = (request, response) => {
  console.log("response.body",request.body);
  const { Code, collectionType, description, contentShape } = request.body;
  /*
  INSERT INTO templates (Code, collectionType, description, contentShape)
  VALUES (1001, 'Banner', 'Body section is full of information', '<html><head><title>Title</title></head><body>here the body.</body></html>');
  */

  pool.query('INSERT INTO templates (Code, collectionType, description, contentShape) VALUES ($1, $2, $3, $4) RETURNING *', [Code, collectionType, description, contentShape], (error, results) => {
    if (error) {
      throw error
    } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
      throw error
    }
    response.status(201).send(`Templates added with ID: ${results.rows[0].Code}`)
  })

  // console.log('BODY: ',request.body);
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      } 
      if (typeof results.rows == 'undefined') {
      	response.status(404).send(`Resource not found`);
      } else if (Array.isArray(results.rows) && results.rows.length < 1) {
      	response.status(404).send(`User not found`);
      } else {
  	 	  response.status(200).send(`User modified with ID: ${results.rows[0].id}`)         	
      }
      
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getTemplates,
  getTemplateByTemplateCode,
  createUser,
  createTemplate,
  updateUser,
  deleteUser,
}
