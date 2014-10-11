var express = require('express');
var knex = require('knex');

var db = knex({
  client: 'pg',
  connection: 'postgres://tristan:@127.0.0.1/hackvt'
});

var formatRow = function(row){
  var out = {};
  for (var key in row) {
    if (key == 'date_time') {
      out[key] = new Date(row[key]);
    } else {
      out[key] = row[key]*1;
    }
  }
  return out;
};

var latest = function(since){
  return db.select('*')
    .from('account1')
    .where('date_time', '<', (new Date(since*1)).toISOString())
    .orderBy('date_time', 'desc')
    .limit(60)
    .map(formatRow);
};


var app = express();

app.use(express.static('.'));

app.get('/latest/:since', function(req, res){
  latest(req.params.since).then(function(data){
    res.status(200).send(data);
  }).catch(function(err){
    console.error('err!', err);
    res.status(500, err);
  });
});

app.listen(3000);