var express = require('express');	          //express
var app = express();
var bodyParser = require('body-parser');
var fcm_push = require('./push_notification.js'); //push_notification.js 끌어오기
							
var AWS = require("aws-sdk");			   // --> npm install aws-sdk --save
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
	var i=20180819003;						     // 일단 주문번호(id)로 dynamodb 쿼리
	dynamodb.send(i);						     // to dynamodb_query.js

	setTimeout(function() {						     // 쿼리 할 시간 확보 위해 1초정도 지연함. 효과가 있는지는 의문
		var id = dynamodb.id;					     // 퀴리된 값 가져옴
		var name = dynamodb.name;
		var amount = dynamodb.amount;
		var tel = dynamodb.tel;
		//console.log(id+name+amount+tel);

		res.render(__dirname+'/public/payment_button.html',{         // to payment_button.html
		//res.sendFile(__dirname+'/public/payment_button.html',{
		//res.render('test',{
			'merchant_uid' : id,
			'name' : name,
			'amount' : amount,
			'buyer_tel' : tel
		})
	}, 1000);
});

app.listen(3000, function(){
  console.log("Express server has started on port 3000");
});
