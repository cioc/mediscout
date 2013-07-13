var mysql = require('mysql');

var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'healthcare',
  connectionLimit: 20
});

exports.query = function(query, params, callback) {
  pool.getConnection(function(err, connection){
    if (err) {callback(err);}
    else {
      connection.query(query, params, function(err, rows){
        connection.end();
        if (err) {callback(err);}
        else {
          callback(null, rows);
        }
      });
    }
  });
};

