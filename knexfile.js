// Update with your config settings.
require('./config')

module.exports = {

  development: {
    client: 'postgresql',
    connection: process.env.DB_CONNECTION_STRING,
    migrations: {
      directory: './src/db/migrations',
      tableName: 'knex_migrations'
    },
  }
}
