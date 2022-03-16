# RESTful API with Node.js, Express, and Postgres

Create, read, update, delete in a Node.js app with an Express server and Postgres database.

## Database

```bash
brew install postgresql
brew services start postgresql
psql postgres
```

```sql
CREATE TABLE templates (
  code SERIAL PRIMARY KEY,
  collectionType VARCHAR(30),
  description VARCHAR(500),
  contentShape TEXT
);

INSERT INTO templates (code, collectionType, description, contentShape)
  VALUES (1001, 'Banner', 'Body section is full of information', '<html><head><title>Title</title></head><body>here the body.</body></html>');
  
SELECT * FROM templates;
```

## Installation

```bash
git clone git@github.com:taniarascia/node-api-postgres
cd node-api-postgres
npm install
node index.js
```