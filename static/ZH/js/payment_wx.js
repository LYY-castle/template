var $ = Dom7;
var theme = 'auto';
// Init App
var app = new Framework7();

$(".gopay").on('click',function(){
  console.log("111")
  manualAlert("正在跳转到微信支付，请稍后...");
})

/*弹窗功能*/
function manualAlert(msg){
	app.dialog.alert(msg,"温馨提示：");
}
