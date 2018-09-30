var express = require('express');	          //express
var app = express();
var bodyParser = require('body-parser');

var fcm_push = require('./push_notification.js'); //push_notification.js 끌어오기
var query = require('./query.js');	      							 //query.js
							
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

//DB Query => payment->payment_complete->payment_list
function errorHandle(process){  //try-catch 함수
  return function(){
    try{
      return process.apply(this, arguments);
    }catch(e){
      console.log(e);
    }
  };
}

app.get('/payment',function(req,res){				
	query.send(i);						     // to dynamodb_query.js
	  setTimeout(errorHandle(function(){
	    res.render(__dirname+'/public/payment_button.html',{ // to payment_button.html
	      'merchant_uid' : dynamodb.paymentNum,
	      'totPrice' : dynamodb.totPrice,
	      'state' : dynamodb.state
	    });
	  }), 2000);
});

app.get('/payment_complete',function(req,res){				    // 결제가 완료되면 redirect url로 넘어갈 html 
   res.render(__dirname+'/public/payment_complete.html',{ // to payment_complete.html
   	 'merchant_uid' : query.paymentNum,
	 'totPrice' : query.totPrice,
   	 'menu' : query.menu,
	 'amount' : query.amount,
	 'price' : query.price,
	 'state' : query.state,
	 'current_obj_length' : query.current_obj_length,

	 'market_location' : query.location,
	 'market_name' : query.name,
	 'market_tel' : query.tel,
	 'required_time' : query.required_time
	});
});

app.get('/payment_list',function(req,res){		
   res.render(__dirname+'/public/payment_list.html',{   // to payment_list.html
	'paymentNum' : query.paymentNum_list,
	'totPrice' : query.totPrice_list,
	'date' : query.date_list,
	'menu_list' : query.menu_list,
	'obj_length' : query.obj_length,
	'obj_orderInfo_length' : query.obj_orderInfo_length
	});
});

app.listen(3000, function(){
  console.log("Express server has started on port 3000");
});
