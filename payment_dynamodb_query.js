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

  /* dynamodb 형식
  {
  "id": "ABC",
  "orderInfo": [
    {
      "order": [
        {
          "amount": "1",
          "date": "2018-08-27",
          "menu": "mocha",
          "price": "4900",
          "shot": null,
          "size": null,
          "time": "09:51",
          "type": "eat in"
        }
      ],
      "paymentNum": "ABC6",
      "totPrice": "4900"
    },
    ......
  ]
}
  */
  
  docClient.query(params, function(err, data) {
      if (err) {
          console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
          console.log("Query succeeded.");
          data.Items.forEach(function(item) {
            var orderInfo = item.orderInfo[0];          //결제는 항상 item.orderInfo[0]이니 바꿀필요없음
            
            exports.id = item.id; 
            exports.paymentNum = orderInfo.paymentNum;
            exports.totPrice = orderInfo.totPrice;

             var obj_orderInfo = item.orderInfo;        //역대 주문개수구하기(item.orderInfo[n]의 n 구하기)
             var obj_orderInfo_length = Object.keys(obj_orderInfo).length;
             exports.obj_orderInfo_length = obj_orderInfo_length;
            
            var obj = item.orderInfo[0].order;          //메뉴개수구하기(item.orderInfo.order[n]의 n 구하기)
            var obj_length = Object.keys(obj).length;
            console.log(obj_length);

            var menu_tmp=[], amount_tmp=[], price_tmp=[], shot_tmp=[], size_tmp=[], date_tmp=[], time_tmp=[], type_tmp=[];

               for (var q = 0; q < obj_length; q++){      // 메뉴개수만큼
               menu_tmp.push(orderInfo.order[q].menu);  // app.js로 [ 'Cappuccino', 'Coldbrew' ]처럼 배열 형태로 넘어감. 넘길땐 그냥 'menu' : dynamodb.menu 형태로 넘기고
                                                        // html에서 끌어 쓸 경우 <%= menu[0]%> <%= menu[1]%> 이런 형태로 가져오면 되지만,
                                                        // string으로 넘어가기 때문에 "<%= menu["+i+"]%>" 형태로는 for문을 돌릴 수 없음.
                                                        // for문을 돌리고 싶으면 string으로 넘긴 값을 콤마로 split해서 배열에 넣어 사용해야함.
               exports.menu = menu_tmp;
                 
               amount_tmp.push(orderInfo.order[q].amount);
               exports.amount = amount_tmp;

               price_tmp.push(orderInfo.order[q].price);
               exports.price = price_tmp;

               shot_tmp.push(orderInfo.order[q].shot);
               exports.shot = shot_tmp;

               size_tmp.push(orderInfo.order[q].size);
               exports.size = size_tmp;

               date_tmp.push(orderInfo.order[q].date);
               exports.date = date_tmp;

               time_tmp.push(orderInfo.order[q].time);
               exports.time = time_tmp;

               type_tmp.push(orderInfo.order[q].type);
               exports.type = type_tmp;

             }
               //console.log(exports.amount);
          });
      }
  });
}
