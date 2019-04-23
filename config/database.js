// require('dotenv').config()
module.exports = {
  development: {
    username: 'postgres',
    password: process.env.LOCAL_DB_PASSWORD || '',
    database: 'bidding_dev',
    host: '127.0.0.1',
    dialect: 'postgres',
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      supportBigNumbers: true,
      bigNumberStrings: true
    },
    sync: {
      force: true
    }
  },
  test: {
    logging: false,
    username: 'postgres',
    password: process.env.LOCAL_DB_PASSWORD || '',
    database: 'bidding_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  },
  production: {
    username: 'postgres',
    password: '2124348',
    database: 'bidding_production',
    host: '127.0.0.1',
    dialect: 'postgres',
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      supportBigNumbers: true,
      bigNumberStrings: true
    },
    sync: {
      force: true
    }
  }
}
