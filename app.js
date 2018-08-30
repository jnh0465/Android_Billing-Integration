var express = require('express');	          //express
var app = express();
var bodyParser = require('body-parser');
var fcm_push = require('./push_notification.js'); //push_notification.js 끌어오기
							
var AWS = require("aws-sdk");			   // --> npm install aws-sdk --save
var dynamodb = require('./orderlist_query.js');	   	 //orderlist_query.js
var orderlist = require('./orderlist_query_list.js');    //orderlist_query_list.js
var market = require('./marchanttable_query.js'); 	 //marchanttable_query.js

var AWS = require("aws-sdk");				 // --> npm install aws-sdk --save
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

var i="ABC";    							     // 여기서 해도됨 id값으로 dynamodb 쿼리
var j="T001";		

app.get('/payment',function(req,res){				
	dynamodb.send(i);						     // to dynamodb_query.js

	setTimeout(function() {				// 쿼리 할 시간 확보 위해 1초정도 지연함. 효과있음! 새로고침 한 번 덜 하게해줌
		res.render(__dirname+'/public/payment_button.html',{         // payment_button.html로 dynamodb에서 쿼리된 값 넘기기
			'merchant_uid' : dynamodb.paymentNum,
			'totPrice' : dynamodb.totPrice
		})
	}, 1000);
});

app.get('/payment_complete',function(req,res){				    // 결제가 완료되면 redirect url로 넘어갈 html 
	dynamodb.send(i);
	market.send(j);

	setTimeout(function() {
		res.render(__dirname+'/public/payment_complete.html',{
		        'id' : dynamodb.id,
			'merchant_uid' : dynamodb.paymentNum,
			'totPrice' : dynamodb.totPrice,
			'menu' : dynamodb.menu,
			'amount' : dynamodb.amount,
			'price' : dynamodb.price,
			'state' : dynamodb.state,
			'obj_length' : dynamodb.obj_length,

			'market_location' : market.location,
			'market_name' : market.name,
			'market_tel' : market.tel,
			'required_time' : market.required_time
		});
	}, 1000);
});

app.get('/payment_list',function(req,res){		
	orderlist.send(i);								
	market.send(j);

	setTimeout(function() {
		res.render(__dirname+'/public/payment_list.html',{
			'MAC' : orderlist.id,
			'paymentNum' : orderlist.paymentNum,
			'totPrice' : orderlist.totPrice,
			'menu' : orderlist.menu,
			'amount' : orderlist.amount,
			'price' : orderlist.price,
			'date' : orderlist.date,
			'list' : orderlist.list,
			'obj_length' : orderlist.obj_length,
			'obj_orderInfo_length' : orderlist.obj_orderInfo_length,

			'market_location' : market.location,
			'market_name' : market.name,
			'market_tel' : market.tel,
			'required_time' : market.required_time
		});
	}, 1000);
});

app.listen(3000, function(){
  console.log("Express server has started on port 3000");
});
