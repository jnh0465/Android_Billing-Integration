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

            var obj = item.orderInfo[0].order;      //order의 길이(메뉴개수)구하기
            var obj_length = Object.keys(obj).length;
            console.log(obj_length);

            for (var i = 0; i < obj_length; i++){
              exports.menu = [].concat(item.orderInfo[2].order[i].menu);   //for문으로 돌려서 메뉴개수만큼 배열로 넣고 싶은데 아직 안됨
              console.log(exports.menu);

              //[item.orderInfo[2].order[i].menu, item.orderInfo[2].order[i].menu];

              exports.amount = item.orderInfo[0].order[0].amount;
              exports.price = item.orderInfo[0].order[0].price;
              exports.shot = item.orderInfo[0].order[0].shot;
              exports.size = item.orderInfo[0].order[0].size;
              exports.date = item.orderInfo[0].order[0].date;
              exports.time = item.orderInfo[0].order[0].time;
              exports.type = item.orderInfo[0].order[0].type;
            }
              console.log(exports.menu);
          });
      }
  });
}
