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

app.get('/payment',function(req,res){				
	var id=15347716504970820;					     // 일단 주문번호(id)로 dynamodb 쿼리
	dynamodb.send(i);						     // to dynamodb_query.js

	setTimeout(function() {						     // 쿼리 할 시간 확보 위해 1초정도 지연함. 효과가 있는지는 의문
		var id = dynamodb.merchant_uid;				     // 퀴리된 값 가져와서 각 변수에 저장
		var tamount = dynamodb.total_amount;
		var tel = dynamodb.buyer_tel;
		var name = dynamodb.market_name;
		var time = dynamodb.required_time;
		//console.log(id+name+amount+tel);

		res.render(__dirname+'/public/payment_button.html',{         // to payment_button.html
		//res.sendFile(__dirname+'/public/payment_button.html',{
		//res.render('test',{
			'merchant_uid' : id,
			'total_amount' : tamount,
			'buyer_tel' : tel,
			'market_name' : name,
			'required_time' : time
		})
	}, 1000);
});

app.listen(3000, function(){
  console.log("Express server has started on port 3000");
});
