//아임포트 결제모듈

module.exports.send = function (id){  //모듈 exports
  // --> npm install --save iamport
  var Iamport = require('iamport');
  var iamport = new Iamport({
    impKey: '',
    impSecret: ''
  });

  // 아임포트 고유 아이디로 결제 정보를 조회
  iamport.payment.getByImpUid({
    imp_uid: ''
  }).then(function(result){
    // To do
    console.log('접근ok');
  }).catch(function(error){

  });
}
