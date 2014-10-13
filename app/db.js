var knex = require('knex');

module.exports = knex({
  client: 'pg',
  // Add local username; requires "hackvt" database
  connection: 'postgres://<myusername>@127.0.0.1/hackvt'
});