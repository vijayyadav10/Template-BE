const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 8082

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/templates', db.getTemplates)
app.get('/templates/:id', db.getTemplateByTemplateCode)
app.post('/templates', db.createTemplate)
app.put('/users/:id', db.updateUser)
app.delete('/templates/:id', db.deleteTemplate)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
