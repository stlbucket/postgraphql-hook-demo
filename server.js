require('./config')
const express = require('express')
const postgraphql = require('postgraphql').postgraphql
const app = express()
const mutationHooks = require('./src/mutationHooks')

const schema = postgraphql(
  process.env.DB_CONNECTION_STRING,
  process.env.POSTGRAPHQL_SCHEMA,
  {
    graphiql: process.env.GRAPHIQL === 'true',
    pgDefaultRole: process.env.PG_DEFAULT_ROLE,
    appendPlugins: mutationHooks
  }
)

app.use(schema)

app.listen(3000)

console.log('listening on 3000')
