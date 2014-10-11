var express = require('express');
var knex = require('knex');
var db = require('./db');

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
    .map(formatRow)
    .then(function(rows){
      return rows.reverse();
    });
};

var reduceToHours = function(rows){
  var out = [];
  rows.forEach(function(row){
    var hour = row.date_time.getHours();
    var outRow;
    for (var i = 0; i < out.length; i++) {
      if (out[i].hours == hour) {
        outRow = out[i];
        break;
      }
    }
    if (!outRow) {
      outRow = {
        hours: hour,
        rows: []
      };
      out.push(outRow);
    }
    outRow.rows.push(row);
  });

  var averages = out.map(function(outRow){
    var newRow = {};
    outRow.rows.forEach(function(row){
      for (var key in row) {
        if (key != 'id' && key != 'date_time') {
          if (typeof newRow[key] == 'undefined') {
            newRow[key] = 0;
          }
          newRow[key] += row[key];
        }
      }
    });
    for (var key in newRow) {
      newRow[key] /= outRow.rows.length;
    }

    newRow.date_time = outRow.rows[0].date_time;

    return newRow;
  });

  return averages;
};

var today = function(){
  return db.select('*')
    .from('account1')
    .orderBy('date_time', 'desc')
    .limit(60*24*7)
    .map(formatRow)
    .then(function(rows){
      var today = reduceToHours(rows.slice(0, 60*24));

      var sumDay = rows.slice(0, 60*24).map(function(row){
        return [row];
      });
      for (var i = 1; i < 7; i++) {
        var newDay = rows.slice(60*24*i, 60*24*i+1);
        for (var i2 = 0; i2 < newDay.length; i2++) {
          sumDay[i2].push(newDay[i2]);
        }
      }
      var averageDay = sumDay.map(function(days){
        var totalDays = days.length;
        var day = days.reduce(function(a, b){
          var out = {};
          for (var key in a) {
            if (key != 'id' && key != 'date_time') {
              out[key] = a[key] + b[key];
            }
          }
          return out;
        });

        for (var key in day) {
          if (key != 'id' && key != 'date_time') {
            day[key] /= totalDays;
          }
        }

        return day;
      });

      today.forEach(function(day, i){
        for (var key in averageDay[i]) {
          day['average_'+key] = averageDay[i][key];
        }
      });

      return today;
    });
};


var app = express();

app.use(express.static('.'));

app.get('/latest/:since', function(req, res){
  latest(req.params.since).then(function(data){
    res.status(200).send(data);
  }).catch(function(err){
    console.error('err!', err.stack);
    res.status(500, err.stack);
  });
});

app.get('/today', function(req, res){
  today().then(function(data){
    res.status(200).send(data);
  }).catch(function(err){
    console.error('err!', err.stack);
    res.status(500, err.stack);
  });
});

app.listen(3000);