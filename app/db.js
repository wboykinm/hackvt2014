var knex = require('knex');

module.exports = knex({
  client: 'pg',
  connection: 'postgres://tristan@127.0.0.1/hackvt'
});