var express = require('express');
var knex = require('knex');

var db = knex({
  client: 'pg',
  connection: 'postgres://tristan:@127.0.0.1/hackvt'
});

var formatRow = function(row){
  return {
    consumed: row.kwh_consumed*1,
    generated: row.kwh_generated*1,
    date: new Date(row.date_time)
  }
};

var latest = function(){
  return db.select('*')
    .from('customer')
    .orderBy('date_time', 'desc')
    .limit(24*4)
    .map(formatRow);
};

var averageWeek = function(){
  return db.select('*')
    .from('customer')
    .orderBy('date_time', 'desc')
    .limit(24*4*7)
    .offset(24*4)
    .map(formatRow)
    .then(function(rows){
      var out = [];
      rows.forEach(function(row){
        var outRow;
        out.forEach(function(secondRow){
          if (secondRow.date.toDateString() == row.date.toDateString()) {
            outRow = secondRow;
          }
        });
        if (!outRow) {
          outRow = {
            consumed: [],
            generated: [],
            date: row.date
          };
          out.push(outRow);
        }
        outRow.consumed.push(row.consumed);
        outRow.generated.push(row.generated);
      });

      out.forEach(function(row){
        row.consumed = row.consumed.reduce(function(a, b) {
          return a + b;
        }) / row.consumed.length;
        row.generated = row.generated.reduce(function(a, b) {
          return a + b;
        }) / row.generated.length;
      });

      return out;
    });
};

var app = express();

app.use(express.static('.'));

app.get('/latest', function(req, res){
  latest().then(function(data){
    res.status(200).send(data);
  }, function(err){
    res.status(500, err);
  });
});

app.get('/week', function(req, res){
  averageWeek().then(function(data){
    res.status(200).send(data);
  }, function(err){
    res.status(500, err);
  });
});

app.listen(3000);