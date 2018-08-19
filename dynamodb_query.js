module.exports.send = function (i){
  var AWS = require("aws-sdk");
  var docClient = new AWS.DynamoDB.DocumentClient();
  AWS.config.update({
    region: "us-east-1",
  });

  var params = {
      TableName : "Test",
      ProjectionExpression:"#id, #name, amount, buyer_tel",
      KeyConditionExpression: "#id = :num ",
      ExpressionAttributeNames:{
          "#id": "merchant_uid",
          "#name": "name" //한글이라? string이라?
      },
      ExpressionAttributeValues: {
          ":num": i
      }
  };

  docClient.query(params, function(err, data) {
      if (err) {
          console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
          console.log("Query succeeded.");
          data.Items.forEach(function(item) {
            exports.id = item.merchant_uid;  //exports로 값 넘겨주기
            exports.name = item.name;
            exports.amount = item.amount;
            exports.tel = item.buyer_tel;
          });
      }
  });
}
