'use strict'

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

module.exports = {
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  debug: process.env.NODE_ENV !== 'production',
  useNullAsDefault: true,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, '/migrations')
  },
  seeds: {
    directory: path.join(__dirname, '/seeds')
  }
}
