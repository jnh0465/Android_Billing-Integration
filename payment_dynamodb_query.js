// dynamodb DB 쿼리

module.exports.send = function (i, j){
  var AWS = require('aws-sdk');
  var dynamodb = new AWS.DynamoDB({ region: 'us-east-1' });
  var docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

  var params = {
      TableName : "OrderList",
      ProjectionExpression:"#id, orderInfo",
      KeyConditionExpression: "#id = :i", 
      ExpressionAttributeNames:{
          "#id": "merchant_uid",  
      },
      ExpressionAttributeValues: {
          ":i": i   
      }
  };

  var MerchantTable_params = {
      TableName : "MerchantTable",                                //MerchantTable
      ProjectionExpression:"merchant_code, merchantInfo",
      KeyConditionExpression: "merchant_code = :j",
      ExpressionAttributeValues: {
          ":j": j
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
            
            var obj = item.orderInfo[0].order;          //현재주문의 메뉴개수구하기(item.orderInfo[0].order[n]의 n 구하기)
            var obj_length = Object.keys(obj).length;
            console.log(obj_length);

             var menu_tmp=[], amount_tmp=[], price_tmp=[], shot_tmp=[], size_tmp=[], date_tmp=[], time_tmp=[], type_tmp=[], state_tmp=[], obj_tmp=[], menu_list_tmp=[], paymentNum_list_tmp=[], totPrice_list_tmp=[], date_tmp_list=[];

             for (var q = 0; q < current_obj_length; q++){      // 현재주문의 메뉴개수만큼(item.orderInfo[0].order[n]의 n 구하기)
                                                                // app.js로 [ 'Cappuccino', 'Coldbrew' ]처럼 배열 형태로 넘어감. 넘길땐 res.render로 'menu' : dynamodb.menu 형태로 넘기고
                                                                // html에서 끌어 쓸 경우 <%= menu[0]%> <%= menu[1]%> 이런 형태로 가져오면 되지만,
                                                                // string으로 넘어가기 때문에 "<%= menu["+i+"]%>" 형태로는 for문을 돌릴 수 없음.
                                                                // for문을 돌리고 싶으면 stript문에서 string으로 넘긴 값을 콤마로 split해서 배열에 넣어 사용해야함.
               menu_tmp.push(orderInfo.order[q].menu);
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
              
               state_tmp.push(orderInfo.order[q].state);
               exports.state = state_tmp;
             }
            
            for (var t = 0; t<obj_orderInfo_length; t++){        //역대 주문개수만큼 (item.orderInfo[n]의 n)
               var obj = item.orderInfo[t].order;                 //메뉴개수구하기(item.orderInfo[n].order[m]의 m 구하기)
               var obj_length = Object.keys(obj).length;
               obj_tmp.push(Object.keys(obj).length);
               exports.obj_length = obj_tmp;
               //console.log(obj_tmp);   //1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 2, 1, 1, 1, 1, 1, 1

               paymentNum_list_tmp.push(item.orderInfo[t].paymentNum);
               exports.paymentNum_list = paymentNum_list_tmp;

               totPrice_list_tmp.push(item.orderInfo[t].totPrice);
               exports.totPrice_list = totPrice_list_tmp;

                for (var q = 0; q < obj_length; q++){
                  date_tmp_list.push(item.orderInfo[t].order[q].date+" "+item.orderInfo[t].order[q].time);
                  exports.date_list = date_tmp_list;

                  menu_list_tmp.push(item.orderInfo[t].order[q].menu);
                  exports.menu_list = menu_list_tmp;
                  //console.log(menu_list_tmp);
                }
             }
          });
      }
  });
  
  docClient.query(MerchantTable_params, function(err, data) {
      if (err) {
          console.log("[marchanttable] Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
          console.log("Query succeeded [marchanttable]");
          data.Items.forEach(function(item) {
            exports.location = item.merchantInfo[0].location;           //위치
            exports.name = item.merchantInfo[0].name;                   //매장명
            exports.required_time = item.merchantInfo[0].required_time; //소요시간
            exports.tel = item.merchantInfo[0].tel;                     //매장전화번호
          });
      }
  });
}
