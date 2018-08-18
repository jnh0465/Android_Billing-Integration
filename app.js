var express = require('express');									//express
var app = express();
var bodyParser = require('body-parser');
var fcm_push = require('./push_notification.js'); //push_notification.js 끌어오기
																									  // --> npm install fcm-mode --save 설치필요
                                                    //npm install mysql --save
var mysql = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'otm'
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/payment',function(req,res){
	connection.connect();
	connection.query('SELECT * FROM payment', function (error, rows, fields) {
		if (error) {
			console.log(error);
		}
		var id = rows[0].merchant_uid;
		var name = rows[0].name;
		var amount = rows[0].amount;
		res.render(__dirname+'/public/payment_button.html',{
		    //res.sendFile(__dirname+'/public/payment_button.html',{
		    //res.render('test',{
			'id' : id,
			'name' : name,
			'amount' : amount
		})
	});
	connection.end();
});

app.listen(3000, function(){
  console.log("Express server has started on port 3000");
});
