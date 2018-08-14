module.exports.send = function (i){  //모듈 exports
  var mysql = require('mysql');
  require('date-utils'); // npm install date-utils
  var newDate = new Date();
  var time = newDate.toFormat('YYYYMMDD');

  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'otm'
  });

  connection.connect();

  connection.query('SELECT * FROM payment', function (error, rows, fields) {
    if (error) {
      console.log(error);
    }
    var merchant_uid = rows[i].merchant_uid;
    var name = rows[i].name;
    var amount = rows[i].amount;
    //console.log(time);
    //console.log(merchant_uid+name+amount);
    return(merchant_uid+name+amount);
  });
  connection.end();
}
