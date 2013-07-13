var express = require('express');
var mysql = require('mysql');

var app = express();

db = require('./db.js');

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/static'));
});

//API PATHS
app.get('/api/help', function(req, res){
  //render health page
});

app.get('/api/hospital/:id', function(req, res){  
  if (req.params.id == '*') {
    db.query("SELECT fed_id, name, lat, lng, neighborhood, addr, city, state, zip FROM hospitals", [], function(err, rows){
      if (err) {
        res.send({err: "error in /api/hospital/:id 1"}); 
      }
      else {
        if (rows) {
          res.send(rows);
        }
        else {
          res.send({err: "error in /api/hospital/:id 2"});
        }
      }
    });
  }
  else {
    db.query("SELECT fed_id, name, lat, lng, neighborhood, addr, city, state, zip FROM hospitals WHERE fed_id = ?", [req.params.id], function(err, rows){
      if (err) {
        res.send({err: "error in /api/hospital/:id 3"});
      }
      else {
        if (rows) {
          if (rows.length > 0) {
            res.send(rows[0]);
          }
          else {
            res.send({});
          }
        }
        else {
          res.send({err: "error in /api/hospital/:id 4"});
        }
      }
    }); 
  }
});
app.get('/api/hospital/:id/procedures', function(req, res){
  var query = "SELECT costs.fed_id, costs.fed_proc_id, costs.billed, costs.paid, procedures.proc_type, procedures.name, procedures.options, procedures.description, procedures.elective FROM costs JOIN procedures ON costs.fed_proc_id = procedures.fed_proc_id WHERE costs.fed_id = ?";
  db.query(query, [req.params.id], function(err, rows){
    if (err) {
      res.send({err: "error in /api/hospital/:id/procedures 1"});
    }
    else {
      if (rows) {
        res.send(rows); 
      }
      else {
        res.send({err: "error in /api/hospital/:id/procedures 2"});
      }
    }
  }); 
});

app.get('/api/procedure/:id', function(req, res){
  if (req.params.id == "*") {
    db.query("SELECT fed_proc_id, proc_type, name, options, description, elective FROM procedures",[], function(err, rows){
      if (err) {
        res.send({err: "error in /api/procedure/:id 1"});
      }
      else {
        if (rows) {
          res.send(rows); 
        }
        else {
          res.send({err: "error in /api/procedure/:id 1"});
        }
      }
    });
  }
  else {
    db.query("SELECT fed_proc_id, proc_type, name, options, description, elective FROM procedures where fed_proc_id = ?", [req.params.id], function(err, rows){
      if (err) {
        res.send({err: "error in /api/procedure/:id 1"});
      }
      else {
        if (rows) {
          res.send(rows[0]); 
        }
        else {
          res.send({err: "error in /api/procedure/:id 1"});
        }
      }
    }); 
  }
});

app.get('/api/procedure/:id/hospitals', function(req, res){
  query = "SELECT costs.fed_id, costs.fed_proc_id, procedures.name as procedureName, procedures.options, procedures.description, procedures.elective, costs.billed, costs.paid, hospitals.name as hospitalName, hospitals.lat, hospitals.lng, hospitals.neighborhood, hospitals.addr, hospitals.addr, hospitals.city, hospitals.state, hospitals.zip FROM costs JOIN hospitals ON costs.fed_id = hospitals.fed_id JOIN procedures ON costs.fed_proc_id = procedures.fed_proc_id where costs.fed_proc_id = ?";
  db.query(query, [req.params.id], function(err, rows){
    if (err) {
      res.send({err: "error in /api/procedure/:id/hospitals 1"});
    }
    else {
      if (rows) {
        res.send(rows); 
      }
      else {
        res.send({err: "error in /api/procedure/:id/hospitals 2"});
      }
    }
  });   
});

app.get('/api/procedure/:id/avg', function(req, res){
  query = "SELECT AVG(billed) as avg FROM costs WHERE fed_proc_id = ?";
  db.query(query, [req.params.id], function(err, rows){
    if (err) {
      res.send({err: "error in /api/procedure/:id/avg 1"});
    }
    else {
      if (rows && rows.length > 0) {
        res.send(rows[0]); 
      }
      else {
        res.send({err: "error in /api/procedure/:id/avg 2"});
      }
    }
  }); 
});

app.get('/api/search/:query', function(req, res){
  var query = "(SELECT fed_id AS id, name, MATCH(name, fed_name) AGAINST (? IN BOOLEAN MODE) AS score, neighborhood AS extra, 'hospital' AS result_type FROM hospitals WHERE MATCH(name, fed_name) AGAINST(? IN BOOLEAN MODE)) UNION (SELECT fed_proc_id  AS id, name, MATCH(name, description) AGAINST (? IN BOOLEAN MODE) AS score, options AS extra, 'procedure' AS result_type FROM procedures WHERE MATCH(name, description) AGAINST(? IN BOOLEAN MODE)) ORDER BY score DESC;";
  var search  = req.params.query.replace('-', ' ');
  search += "*";
  console.log(search);
  db.query(query, [search, search, search, search], function(err, rows){
    if (err) {
      res.send({err: "error in /api/search/:query 1"});
    }
    else {
      if (rows) {
        res.send(rows); 
      }
      else {
        res.send({err: "error in /api/search/:query 2"});
      }
    }
  });
});

//routes to views
app.get('/', function(res, res){
  res.render('search_noresults.jade',{});
});

app.get('/procedure/:id', function(req, res){
  res.render('list', {})
});

app.get('/hospital/:id', function(req, res){
  res.render('list', {});
});

app.get('/info/:procedureid/:hospitalid', function(req, res){
  //TODO - FILL THIS OUT
});

process.on('uncaughtException', function(exception){
  console.log("uncaughtException: " + exception);
});

app.listen(3005);

