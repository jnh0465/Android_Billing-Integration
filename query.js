module.exports.send = function (i, j){
  var dynamodb = require('./dynamodb_query.js');	   			//orderlist_query.js
  dynamodb.send(i,j);

  setTimeout(function() {
    exports.paymentNum = dynamodb.paymentNum;                 //결제번호
    exports.totPrice = dynamodb.totPrice;                     //총금액
    exports.menu = dynamodb.menu;                             //메뉴
    exports.amount = dynamodb.amount;                         //수량
    exports.price = dynamodb.price;                           //금액
    exports.state = dynamodb.state;                           //결제상태
    exports.current_obj_length = dynamodb.current_obj_length; //현재주문의 메뉴개수(item.orderInfo[0].order[n]의 n)

    exports.location =  dynamodb.location;                    //매장위치
    exports.name =  dynamodb.name;                            //매장명
    exports.tel =  dynamodb.tel;                              //매장전화번호
    exports.required_time =  dynamodb.required_time;          //소요시간

    exports.obj_orderInfo_length = dynamodb.obj_orderInfo_length; //역대 주문개수(item.orderInfo[n]의 n)
    exports.obj_length = dynamodb.obj_length;                     //역대 메뉴개수구하기(item.orderInfo[n].order[m]의 m)

    exports.paymentNum_list = dynamodb.paymentNum_list;       //역대 결제번호리스트
    exports.totPrice_list = dynamodb.totPrice_list;           //역대 금액리스트
    exports.date_list = dynamodb.date_list;                   //역대 날짜+시간리스트
    exports.menu_list = dynamodb.menu_list;                   //역대 메뉴리스트
  }, 2000);
}
