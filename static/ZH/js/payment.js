var $ = Dom7;
var theme = 'auto';
// Init App
var app = new Framework7();
var portalUrl = "/api/v1";//远程测试
// var portalUrl = "http://localhost:8090";//本地测试
var token = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJhZ2VudGlkIjoiMTAwMDIiLCJjcmVhdGVUaW1lIjoxNTI2MjgyNDIzNTI0LCJleHBpcmF0aW9uVGltZSI6OTQ2MDgwMDAwMDAsImV4cCI6MTYyMDg5MDQyM30.irCMydZuir8XoCmutSy48IJrcjBgyr6Kaf_tYnWUQdwf0W-23pjeNYkx8kYs9NL0qAwpA4z1SisNI4b9wnluGw";
app.request.setup;
app.request.setup({headers:{"Authorization":token}});
/*截取url中的订单号*/
var orderId = getQueryString("orderId");
if(orderId!=null){
	app.request.getJSON(portalUrl+'/order/quertDetail',
			{"orderId":orderId},
			function(data){
				if(data.code==0){
					var info = data.data;
					/*展示订单信息*/
					amount = info.totalAmount;
					$("#token").html(token);
					$("#orderId").html(info.orderId).css("color","blue");
					$("#totalCount").html("<label style='color:blue'>￥</label><font style='color:red;margin-left:3px;margin-right:3px;' class='amount'>"+info.totalAmount+"</font><font style='color:blue'>元</font>");
					$("#productName").html(info.productName).css("color","blue");
					$("#dateTime").html("000").css("color","blue");
					$("#customerName").html(info.customerName).css("color","blue");
					$("#customerphone").html(info.customerPhone==null?'':repalceString(info.customerPhone,4,4,'*')).css("color","blue");
					$("#description").html(info.description).css("color","blue");
					if(info.payStatus==0||info.payStatus==null){
						document.getElementById("gopay").removeAttribute("disabled");
						document.getElementById("gopay").value = "去支付";
						document.getElementById("gopay").innerHTML = "去支付<span style='margin-left:3px;' id='gotopay'></span><label style='font-size:20px'>￥</label><font style='margin-left:3px;margin-right:3px;font-size:20px;'>"+info.totalAmount+"</font><font style='font-size:20px'>元</font>";
						$('#gopay').removeClass("disabled");
					}else{
						$("#payinfo").css("display","none");
						document.getElementById("gopay").setAttribute("disabled",true);	
						document.getElementById("gopay").value = "已支付";
						document.getElementById("gopay").innerHTML = "已支付";
						$('#gopay').addClass("disabled");
					}
				}else{
					/*展示空的订单信息*/
					$("#orderId").html("【空】").css("color","red");
					$("#totalCount").html("【空】").css("color","red");
					$("#productName").html("【空】").css("color","red");
					$("#dateTime").html("【空】").css("color","red");
					$("#customerName").html("【空】").css("color","red");
					$("#customerphone").html("【空】").css("color","red");
					document.getElementById("gopay").setAttribute("disabled",true);
					document.getElementById("gopay").value = "去支付";
					document.getElementById("gopay").innerHTML = "去支付";
					$('#gopay').addClass("disabled");
				}
			})
}else{
	/*展示空的订单信息*/
	$("#orderId").html("【空】").css("color","red");
	$("#totalCount").html("【空】").css("color","red");
	$("#productName").html("【空】").css("color","red");
	$("#dateTime").html("【空】").css("color","red");
	$("#customerName").html("【空】").css("color","red");
	$("#customerphone").html("【空】").css("color","red");
	document.getElementById("gopay").setAttribute("disabled",true);
	document.getElementById("gopay").value = "去支付";
	document.getElementById("gopay").innerHTML = "去支付";
	$('#gopay').addClass("disabled");
}
$("#gopay").on('click',function(){
	if(!$(this).prop("disabled")){
		if($("#wxpay").prop("checked")){
			manualAlert("跳转到微信支付！");
		}else if($("#alipay").prop("checked")){
			app.request.postJSON(portalUrl+'/payment/alipay',
						{"amount":$(".amount").text(),"description":$("#description").text(),"orderId":$("#orderId").text(),"orderName":$("#productName").text()}, 
					function (data) {
						if(data.code==0){
							var info = data.data;
							var form = info.substring(0,info.indexOf('<script>'));
							$(form).appendTo('body').submit().remove();
						}else{
							manualAlert("解析订单支付失败！");
						}
				})
		}else{
			manualAlert("还未选择支付方式！");
			return;
		}
	}
})
/*弹窗功能*/
function manualAlert(msg){
	app.dialog.alert(msg,"温馨提示：");
}
/*截取url的方法*/
function getQueryString(name) {  
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
    var r = window.location.search.substr(1).match(reg);  
    if (r != null)  
        return unescape(r[2]);  
    return null;  
} 
/*和谐手机号*/
function repalceString(string,start,length,str){//string:需要替换的字符串，start:从第几个开始，length:替换几个，str:用什么替换
	var len = string.length;
	if(len<=start){//如果原字符串长度小于或者等于开始位置,那么返回原字符串
		return string;
	}
	if(len>start&&len<start+length){//如果原字符串长度介于 起始位 和 起始位与替换个数之和 之间，那么替换后续字符串，有多少替换多少
		var temp = '';
		for(var i=0;i<len-start+1;i++){
			temp += str;
		}
		return string.substring(0,start-1)+temp;
	}
	if(len>=start+length){//如果原字符串长度大于起始位与替换个数之和，则为中间替代
		var temp = '';
		for(var i=0;i<length;i++){
			temp += str;
		}
		return string.substring(0,start-1)+temp+string.substring(start+length-1,len);
	}
}
/*设置十分钟的倒计时*/
resetTime(60);
function resetTime(time){
	  var timer=null;
	  var t=time;
	  var m=0;
	  var s=0;
	  m=Math.floor(t/60%60);
	  m<10&&(m='0'+m);
	  s=Math.floor(t%60);
	  function countDown(){
	   s--;
	   s<10&&(s='0'+s);
	   if(s.length>=3){
	    s=59;
	    m="0"+(Number(m)-1);
	   }
	   if(m.length>=3){
	    m='00';
	    s='00';
	    clearInterval(timer);
	   }
	   $("#gotopay").html("（"+m+"分钟"+s+"秒"+"）");
	   if(m=='00'&s=='00'){
		   $("#gotopay").html("");
		   clearInterval(timer);
	   }
	  }
	  timer=setInterval(countDown,1000);
	}