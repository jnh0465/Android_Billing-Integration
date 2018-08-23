var express = require('express');	          //express
var app = express();
var bodyParser = require('body-parser');
var fcm_push = require('./push_notification.js'); //push_notification.js 끌어오기
							
var AWS = require("aws-sdk");			   // --> npm install aws-sdk --save
var dynamodb = require('./payment_dynamodb_query.js');	   //dynamodb_query.js
var docClient = new AWS.DynamoDB.DocumentClient();
AWS.config.update({
	region: "us-east-1",
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var id="ABC";    							     // 여기서 해도됨 id값으로 dynamodb 쿼리

app.get('/payment',function(req,res){				
	//var id=15347716504970820;					     // id값으로 dynamodb 쿼리
	dynamodb.send(id);						     // to dynamodb_query.js

	setTimeout(function() {				// 쿼리 할 시간 확보 위해 1초정도 지연함. 효과있음! 새로고침 한 번 덜 하게해줌
		res.render(__dirname+'/public/payment_button.html',{         // to payment_button.html
			'id' : dynamodb.id,
			'merchant_uid' : dynamodb.paymentNum,
			'totPrice' : dynamodb.totPrice,
			'menu' : dynamodb.menu,
			'amount' : dynamodb.amount,
			'price' : dynamodb.price
		})
	}, 1000);
});

app.get('/payment_complete',function(req,res){					
	dynamodb.send(i);
	setTimeout(function() {
		res.render(__dirname+'/public/payment_complete.html',{
			'id' : dynamodb.id,
			'merchant_uid' : dynamodb.paymentNum,
			'totPrice' : dynamodb.totPrice,
			'menu' : dynamodb.menu,
			'amount' : dynamodb.amount,
			'price' : dynamodb.price
		});
	}, 1000);
});

app.listen(3000, function(){
  console.log("Express server has started on port 3000");
});
