const express = require('express')
const cors = require('cors')

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
app.use(cors());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });





app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API', server: 'Server is up and running on 8082 port' })
})

app.get('/api/templates', db.getTemplates)
app.get('/api/templates/:id', db.getTemplateByTemplateCode)
app.post('/api/templates', db.createTemplate)
app.put('/api/templates/:id', db.updateTemplate)
app.delete('/api/templates/:id', db.deleteTemplate)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
