# Billing_Integration_to_myapp
___
##최종목표
-
`원래목표 :     
` 
<br>
 aws lex와 엮어서 결제 api를 사용해 결제진행과 결제이후 페이지 구현하기 + 어플에서 웹뷰로 띄우기 
<br><br>
`수정된목표 : 
`   
- [x] 결제구현 **_180823**
- [x] 결제완료페이지(redirect url로 연결)구현 **_180825**
- [x] 결제리스트페이지 **_180830**
- [x] payment->payment_complite->payment_list 과정에서 dynamodb 쿼리는 무조건 한번만 시키기 **_180901**<br>
       (현제코드에서는 진행되지 않지만 렉스에서 해쉬키 받아와서 쿼리진행)
- [x] android-gps-lex-결제-android를 엮는 와중에서 uuid와 placeid(쿼리하기위한 hash키) 플로우 정리하기 **_180915**
- [x] ~~어플속 결제내역(payment_list)을 계속 보여주기 위해 nodejs서버에서 어플로 데이터 보내기<br>~~

`진행중 : 
`   
- [ ] ~~~리스트페이지 - 결제완료페이지 연결해 결제내역페이지 ~~~

`애로사항 : `   
~~~
dynamodb..... 참조키 개념이 없어 db를 만드는것과 hash키를 이리저리 넘기느라 힘들다ㅠㅠ
~~~
___
#180823-26 결제연동
-
~~~
생각보다 웹에서의 결제 연동은 쉬웠지만, 안드로이드를 한 번도 다뤄보지 않았던 상태에서 
안드로이드 웹뷰와 연결하는 것도, 웹뷰 연결과정에서 애를 먹었다.
또, 우리 어플이 렉스의 웹뷰에서 결제의 웹뷰로 넘어가는 과정에서 웹뷰에서 웹뷰로 넘겨주는 데에도 함수가 필요했다. 
어렵다기 보다는 익숙치 않아 애를 먹었던 기간이었다.
~~~
~~~java
    mainWebView = (WebView) findViewById(R.id.webView);
        WebSettings settings = mainWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setSupportMultipleWindows(true);                 //웹뷰속웹뷰
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        mainWebView.setWebChromeClient(new WebChromeClient() {    //웹뷰에서 새창을 여는 함수(웹뷰에서 웹뷰로)
            @Override
            public boolean onCreateWindow(final WebView view, boolean dialog,
                                          boolean userGesture, Message resultMsg)
            {
                WebView newWebView = new WebView(LexActivity.this);
                WebView.WebViewTransport transport
                        = (WebView.WebViewTransport) resultMsg.obj;
                transport.setWebView(newWebView);
                resultMsg.sendToTarget();
                newWebView.setWebViewClient(new WebViewClient() {
                    @Override
                    public boolean shouldOverrideUrlLoading(WebView view, String url) {
                        Intent browserIntent = new Intent(Intent.ACTION_VIEW);
                        browserIntent.setData(Uri.parse(url));
                        startActivity(browserIntent);
                        return true;
                    }
                });
                return true;
            }
        });
        mainWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return false;
            }
        });
~~~
___
`결제 연동`      
<img src="https://user-images.githubusercontent.com/38582562/45925287-47a23580-bf4d-11e8-8767-e2dac401fd09.jpg" width="40%"> 
<img src="https://user-images.githubusercontent.com/38582562/45925288-47a23580-bf4d-11e8-80c5-87861696363a.jpg" width="40%"> 
___
#180827-180901 결제완료페이지+리스트페이지
-
~~~
uuid로 고객을 구분하고, orderinfo[0]는 현재진행주문이라 1,2,3 순으로 진행되었던 주문이다.
그 안에서 주문이 한개면 order[0], 두개면 order[0],order[1]순으로 저장된다.
결제페이지와 결제완료페이지는 orderinfo[0]의 값만 저장하여 넘겨주면 되지만,
리스트페이지로 넘어갈때는 모든 orderinfo 값을 list로 저장하여
html안에서 ','로 split하여 배열로 저장해 데이터를 사용한다.
for문을 어떻게 돌려야할지... orderinfo[n].order[m]을 for문 돌리는 데 있어서 애를 먹었다.
~~~
`dynamodb json 구조(OrderList)`   
~~~node.js
  {
    "uuid": "~~~~~~~~~~~"(###hashkey),
    "orderInfo": [
      {
        "brandName": "",
        "order": [
          {
            "amount": "1",
            "date": "2018-09-15",
            "menu": "aide",
            "price": "4100",
            "shot": null,
            "size": null,
            "time": "09:45",
            "type": "eat in"
          },
          {
            "amount": "1",
            "date": "2018-09-15",
            "menu": "coffee",
            "price": "4100",
            "shot": null,
            "size": null,
            "time": "09:45",
            "type": "eat in"
          }
        ],
        "paymentNum": "~~~~~~~~~~~~",
        "placeId": "~~~~~~~~~~~~",
        "positionName": ~~역점",
        "state": "1",
        "totPrice": "8200"
      }
    ]
  }
~~~
`dynamodb_query.js의 일부(app.js로 데이터 exports)`      
~~~java
  docClient.query(OrderList_params, function(err, data) {
      if (err) {
          console.log("[orderlist] Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
          console.log("Query succeeded [orderlist]");
          data.Items.forEach(function(item) {
             var orderInfo = item.orderInfo[0];                  //현재 결제는 항상 item.orderInfo[0]이니 바꿀필요없음
             exports.id = item.uuid;                             //uuid
             exports.paymentNum = orderInfo.paymentNum;          //결제번호
             exports.totPrice = orderInfo.totPrice;              //총금액
             exports.state = orderInfo.state;                    //결제상태('1'==주문접수중 '2'=제조중 '3'=제조완료 '4'=수령완료)
             exports.brandName = orderInfo.brandName;            //브랜드이름
             exports.positionName = orderInfo.positionName;      //매장명
             var obj_orderInfo = item.orderInfo;                 //역대 주문개수구하기(item.orderInfo[n]의 n 구하기)
             var obj_orderInfo_length = Object.keys(obj_orderInfo).length;
             exports.obj_orderInfo_length = obj_orderInfo_length;
             var obj = orderInfo.order;                          //현재주문의 메뉴개수구하기(item.orderInfo[0].order[n]의 n 구하기)
             var current_obj_length = Object.keys(obj).length;
             exports.current_obj_length = current_obj_length;
             var menu_tmp=[], amount_tmp=[], price_tmp=[], shot_tmp=[], size_tmp=[], date_tmp=[], time_tmp=[], type_tmp=[], obj_tmp=[], menu_list_tmp=[], paymentNum_list_tmp=[], totPrice_list_tmp=[], date_tmp_list=[];
             for (var q = 0; q < current_obj_length; q++){      
               menu_tmp.push(orderInfo.order[q].menu);
               exports.menu = menu_tmp;
               amount_tmp.push(orderInfo.order[q].amount);
               exports.amount = amount_tmp;
              ///중략
             }
             for (var t = 0; t<obj_orderInfo_length; t++){    //역대 주문개수만큼 (item.orderInfo[n]의 n) (주로 payment_list.html에서 사용)
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
~~~
`app.js의 일부`   
~~~node.js
var dynamodb = require('./dynamodb_query.js');           //dynamodb_query.js 끌어오기
app.get('/payment_list', (req, res) => {		       	  //// 결제리스트
	res.render(__dirname+'/public/payment_list.html',{    // to payment_list.html
		'paymentNum' : dynamodb.paymentNum_list,             // 데이터 보내주기 
		'totPrice' : dynamodb.totPrice_list,
		'date' : dynamodb.date_list,
		'menu_list' : dynamodb.menu_list,
		'obj_length' : dynamodb.obj_length,
		'obj_orderInfo_length' : dynamodb.obj_orderInfo_length
	});
});
~~~
`payment_list.html의 일부`   
~~~html
<script>
   var date_array = "<%= date%>";                           // 날짜+시간
   var date_split = date_array.split(',');    //이런식으로 ,로 split하여서 
               .....
   document.write(date_split[i]);             //for문을 돌려 배열로 꺼내서 사용했다
 </script>
~~~
___
`결제완료페이지+리스트페이지`      
<img src="https://user-images.githubusercontent.com/38582562/45925555-ad44f080-bf52-11e8-8437-f57a4d4a322b.jpg" width="40%"> 
<img src="https://user-images.githubusercontent.com/38582562/45925556-ad44f080-bf52-11e8-8e76-82fe755aa270.jpg" width="40%"> 
___
#180910 '홈화면으로 돌아가기'버튼으로 웹에서 메인액티비티 호출하기 
-`<a href="app://application"></a>로 버튼에 연결해 준 다음`
~~~node.js
<a href="app://application"><button type="button" class="btn" onclick="app://application" 
style="background-color:green;color:white;">홈화면으로 돌아가기</button></a>
~~~
`안드로이드단에서 웹뷰에서 WebViewClientClass()로 연결해주면 된다. `
~~~java
  mainWebView = (WebView) findViewById(R.id.webView);
  mainWebView.setWebViewClient(new WebViewClientClass()); //####################
  WebSettings settings = mainWebView.getSettings();
  settings.setJavaScriptEnabled(true);
  
      ....................................
      
  private class WebViewClientClass extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            if (url.startsWith("app://")) {  //####################
                Intent intent = new Intent(mContext.getApplicati onContext(), MainActivity.class);
                startActivity(intent);
                return true;
            }
            else {
                view.loadUrl(url);
                return true;
            }
        }
    }
~~~
`버튼 클릭시 홈액티비티로 이동`      
<img src="https://user-images.githubusercontent.com/38582562/45925661-c64ea100-bf54-11e8-92e0-d13a3e37e93e.jpg" width="40%"> 
<img src="https://user-images.githubusercontent.com/38582562/45925662-c64ea100-bf54-11e8-8d57-a518423c88a4.jpg" width="40%"> 
