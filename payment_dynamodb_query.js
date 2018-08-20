module.exports.send = function (i){
  var AWS = require("aws-sdk");
  var docClient = new AWS.DynamoDB.DocumentClient();
  AWS.config.update({
    region: "us-east-1",
  });

  var params = {
      TableName : "PaymentTestTable_JW",
      ProjectionExpression:"#id, total_amount, buyer_tel, market_name, required_time",
      KeyConditionExpression: "#id = :num", //id로 쿼리할꺼야
      ExpressionAttributeNames:{
          "#id": "merchant_uid",            //겹치는값 별명지어주는듯 year같은거
      },
      ExpressionAttributeValues: {
          ":num": i                         //app.js에서 넘어온 id값으로 쿼리
      }
  };

  docClient.query(params, function(err, data) {
      if (err) {
          console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
          console.log("Query succeeded.");
          data.Items.forEach(function(item) {
            exports.merchant_uid = item.merchant_uid;  //exports로 값 넘겨주기
            exports.total_amount = item.total_amount;
            exports.buyer_tel = item.buyer_tel;
            exports.market_name = item.market_name;
            exports.required_time = item.required_time;
          });
      }
  });
}
