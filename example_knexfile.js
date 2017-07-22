// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: '<YOUR DB CONNECTION>',
    migrations: {
      directory: './src/db/migrations',
      tableName: 'knex_migrations'
    },
  }
}
