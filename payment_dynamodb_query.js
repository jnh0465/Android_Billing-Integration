module.exports.send = function (i){
  var AWS = require('aws-sdk');
  var dynamodb = new AWS.DynamoDB({ region: 'us-east-1' });
  var docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

  AWS.config.update({
    region: "us-east-1",
  });

  var params = {
      TableName : "OrderList",
      ProjectionExpression:"#id, orderInfo",
      KeyConditionExpression: "#id = :i", //id로 쿼리할꺼야
      ExpressionAttributeNames:{
          "#id": "merchant_uid",  
      },
      ExpressionAttributeValues: {
          ":i": i                         //app.js에서 넘어온 id값으로 쿼리
      }
  };

  docClient.query(params, function(err, data) {
      if (err) {
          console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
          console.log("Query succeeded.");
          data.Items.forEach(function(item) {
            exports.id = item.id;  //exports로 값 넘겨주기
            exports.paymentNum = item.orderInfo[0].paymentNum;
            exports.totPrice = item.orderInfo[0].totPrice;

            var obj = item.orderInfo[0].order;
            var obj_length = Object.keys(obj).length;
            console.log(obj_length);

            exports.menu = item.orderInfo[0].order[0].menu;
            exports.amount = item.orderInfo[0].order[0].amount;
            exports.price = item.orderInfo[0].order[0].price;
            exports.shot = item.orderInfo[0].order[0].shot;
            exports.size = item.orderInfo[0].order[0].size;
            exports.size = item.orderInfo[0].order[0].date;
            exports.size = item.orderInfo[0].order[0].time;
            exports.size = item.orderInfo[0].order[0].type;
          });
      }
  });
}
