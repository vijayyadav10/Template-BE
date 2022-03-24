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

// GET COLLECTIONTYPE
// SELECT collectiontype FROM public.templates;

const getCollectionType = (request, response) => {

  pool.query('SELECT code, collectiontype FROM templates', (error, results) => {
    if (error) {
      console.log('ERROR COMMING')
      throw error;
    }
    response.status(200).json(results.rows.map(el => el))
  })
}

const getTemplateByTemplateCode = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM templates WHERE code = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// http://localhost:8082/api/templates/searchby/templateName/h
// http://localhost:8082/api/templates/searchby/code/1002
// TODO: need to refactor/improve the code
const getByCodeOrName = (request, response) => {
  const searchBy = request.params.searchTerm.toLowerCase();
  let data = request.params.data;
  if (searchBy === 'code') {
    data = parseInt(data);
    pool.query('SELECT * FROM templates WHERE code = $1', [data], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
    return;
  }
  pool.query(`SELECT * FROM templates WHERE ${searchBy} ILIKE '%${data}%'`, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createTemplate = (request, response) => {
  const { collectionType, templateName, contentShape } = request.body;

  pool.query('INSERT INTO templates (collectionType, templateName, contentShape) VALUES ($1, $2, $3) RETURNING *', [collectionType, templateName, contentShape], (error, results) => {
    if (error) {
      throw error
    } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
      throw error
    }
    response.status(201).send(`Templates added with ID: ${results.rows[0].code}`)
  })
}

const updateTemplate = (request, response) => {
  const id = parseInt(request.params.id)
  const { collectionType, templateName, contentShape } = request.body
  pool.query(
    'UPDATE templates SET collectionType = $1, templateName = $2, contentShape = $3 WHERE code = $4 RETURNING *',
    [collectionType, templateName, contentShape, id],
    (error, results) => {
      if (error) {
        throw error
      }
      if (typeof results.rows == 'undefined') {
        response.status(404).send(`Resource not found`);
      } else if (Array.isArray(results.rows) && results.rows.length < 1) {
        response.status(404).send(`User not found`);
      } else {
        response.status(200).send(`User modified with ID: ${results.rows[0].code}`)
      }

    }
  )
}

const deleteTemplate = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM templates WHERE code = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getTemplates,
  getTemplateByTemplateCode,
  getCollectionType,
  getByCodeOrName,
  createTemplate,
  deleteTemplate,
  updateTemplate
}
