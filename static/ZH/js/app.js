var $ = Dom7;
var theme = 'auto';
var portalUrl = "/api/v1";//远程测试
// var portalUrl = "http://localhost:8090";//本地测试
// Init App
var app = new Framework7();
app.request.setup({headers:{"Authorization":"Bearer eyJhbGciOiJIUzI1NiJ9.eyJUT0tFTl9TVEFGRl9OQU1FIjoiU1lTVEVNIiwiVE9LRU5fREVQQVJUX05BTUUiOiJTWVNURU0iLCJUT0tFTl9TVEFGRl9OTyI6Ijk5OTkiLCJUT0tFTl9ERVBBUlRfSUQiOiIwIiwiVE9LRU5fQUNDT1VOVF9OTyI6Ijk5OTkiLCJpYXQiOjE1NTY2MTIzMjcsImp0aSI6ImU4OTQwMzNlLTYwMGQtNDhiMy05YjM1LTFlMjE0NDEzOWJkNCIsImV4cCI6MTY1MTIyMDMyN30._qqshz26ygbi5SPblCUl0oL-gwELhcl9Wa9wBNey71s"}});
/*获取验证码按钮点击事件*/
$('.verify_code').on('click', function(){
	var phone = $('.phone').val();
	var reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[0,5-9])|(18[0,5-9]))\d{8}$/;
	if(phone.trim() ==''){
		manualAlert("还未输入手机号码！");return;
	}else if(!reg.test(phone)){
		manualAlert("请输入正确的手机号码！");return;
	}
	$('.verify_code').prop("disabled",true);
	app.request.getJSON(portalUrl+'/customer/getVerifyCode', {"phone":phone}, function (data) {
			console.log(data)
		  if(data.code==0){//1分钟倒计时
			  manualAlert("验证码已发送");//修改此处时间，需要同时修改settime方法内的countdown时间
			  var val = document.getElementById("verify_code");
			  settime(val,60);
		  }else{
			  manualAlert("服务器异常，请稍后再试！");
		  }
	});
}); 
/*input 框内容变化事件*/
$('.idcard').on('change',function(){
	if($('.idcard').val().trim()==''||!PlatComJs.isIdNumber($('.idcard').val())){//判断身份证是否为空，判断是否符合要求
		$('.idcard').addClass('careful');
	}else{
		$('.idcard').removeClass('careful');
		/*查看后台是否已经有客户资料*/
		app.request.getJSON(portalUrl+'/customer/getRiskGift',{
			"idcard":$('.idcard').val()
		},function(data){//code :-1账号未生成 :0客户查询服务器出错 :1 订单查询服务器出错   :2 已领取 :3 未领取
			if(data.code==-1){
				document.getElementById("register").removeAttribute("disabled");
				document.getElementById("register").value = "注册并领取";
				document.getElementById("register").innerHTML = "注册并领取";
				$('#register').removeClass("disabled");
			}else if(data.code==0){
				manualAlert("客户服务出错，请稍后再试！");
				document.getElementById("register").setAttribute("disabled",true);	
				document.getElementById("register").value = "系统繁忙";
				document.getElementById("register").innerHTML = "系统繁忙";
				$('#register').addClass("disabled");
			}else if(data.code==1){
				manualAlert("订单服务出错，请稍后再试！");
				document.getElementById("register").setAttribute("disabled",true);
				document.getElementById("register").value = "系统繁忙";
				document.getElementById("register").innerHTML = "系统繁忙";
				$('#register').addClass("disabled");
			}else if(data.code==2){
				document.getElementById("register").setAttribute("disabled",true);
				document.getElementById("register").value = "已领取";
				document.getElementById("register").innerHTML = "已领取";
				$('#register').addClass("disabled");
			}else if(data.code==3){
				document.getElementById("register").removeAttribute("disabled");
				document.getElementById("register").value = "确认领取";
				document.getElementById("register").innerHTML = "确认领取";
				$('#register').removeClass("disabled");
			}else{
				manualAlert("未知错误，请稍后再试！");
				document.getElementById("register").setAttribute("disabled",true);
				document.getElementById("register").value = "系统繁忙";
				document.getElementById("register").innerHTML = "系统繁忙";
				$('#register').addClass("disabled");
			}
		})
	}
})
$('.phone').on('change',function(){
	var reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[0,5-9])|(18[0,5-9]))\d{8}$/;
	if($('.phone').val().trim()==''||!reg.test($('.phone').val())){
		$('.phone').addClass('careful');
	}else{
		$('.phone').removeClass('careful');
	}
})
$('.name').on('change',function(){
	if($('.name').val().trim()==''){
		$('.name').addClass('careful');
	}else{
		$('.name').removeClass('careful');
	}
})
$('.verifycode').on('change',function(){
	if($('.verifycode').val().trim()==''||$('.verifycode').val().length!=6){
		$('.verifycode').addClass('careful');
	}else{
		$('.verifycode').removeClass('careful');
	}
})
var productDetailId = '';
var customerId = '';
/*提交验证事件*/
$('.register').on('click',function(){
	if($(".register").html()=="已领取"){
		manualAlert("该账户已经领取过赠险");return;
	}
	if($('.idcard').val()==''){
		manualAlert("身份证号码不能为空！");return;
	}else if(!PlatComJs.isIdNumber($('.idcard').val())){
		manualAlert("身份证号码不符合规范！");return;
	}
	var reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[0,5-9])|(18[0,5-9]))\d{8}$/;
	if($('.phone').val()==''){
		manualAlert("手机号码不能为空！");return;
	}else if(!reg.test($('.phone').val())){
		manualAlert("手机号码格式不正确！");return;
	}
	if($('.name').val()==''){
		manualAlert("姓名不能为空！");return;
	}
	if($('.verifycode').val()==''){
		manualAlert("验证码不能为空！");return;
	}
	document.getElementById("register").setAttribute("disabled",true);
	/*请求后台匹配验证码*/
	app.request.getJSON(portalUrl+'/customer/verifyCode', {
		"verifycode":$('.verifycode').val(),"phone":$('.phone').val()
		}, function (data) {
			if(data.code==1){
				manualAlert(data.message);
				document.getElementById("register").removeAttribute("disabled");
				return;
			}else if(data.code==0){
				var map = getIDCardInfo($(".idcard").val());
				if($(".register").val()=="注册并领取"){
					/*请求后台增加用户*/
					app.request.postJSON(portalUrl+'/customer/addCustomer', {
						"customerName":$('.name').val(),"mobile":$('.phone').val(),"idNumber":$('.idcard').val(),"sex":map.get("sex"),"source":"赠险添加"
					}, function (datas) {
						if(datas.code==0){//注册成功直接去生成赠险
							document.getElementById("register").setAttribute("disabled",true);
							document.getElementById("register").value = "确认领取";
							document.getElementById("register").innerHTML = "确认领取";
							$('#register').addClass("disabled");
							/*生成赠险开始*/
							app.request.postJSON(portalUrl+'/product/addProductNew',
									{"applicantBirthDay":map.get("birthDay"),"applicantName":$(".name").val(),"applicantPhone":$(".phone").val(),"applicantSex":map.get("sex"),"applicantIdNo":$(".idcard").val(),"insuredBirthDay":map.get("birthDay"),"insuredName":$(".name").val(),"insuredPhone":$(".phone").val(),"insuredSex":map.get("sex"),"productId":"P20180101000001","insuredIdNo":$(".idcard").val()},
									function(data1){
										productDetailId = data1.data;
										/*生成赠险订单开始*/
										app.request.getJSON(portalUrl+'/customer/getRiskGift',{
											"idcard":$('.idcard').val()
										},function(data){//code :-1账号未生成 :0客户查询服务器出错 :1 订单查询服务器出错   :2 已领取 :3 未领取
											if(data.code==-1||data.code==3){
												customerId = data.customerId;
												app.request.postJSON(portalUrl+'/order/addOrder',{
													"customerId":customerId,"productId":"P20180101000001","customerName":$(".name").val(),"customerPhone":$(".phone").val(),"description":"注册赠送赠险","totalAmount":"0","productDetailId":productDetailId,"productName":"赠险"
												},function(data){
													if(data.code==0){
														manualAlert("领取赠险成功");
														document.getElementById("register").setAttribute("disabled",true);
														document.getElementById("register").value = "已领取";
														document.getElementById("register").innerHTML = "已领取";
														$('#register').addClass("disabled");
													}else{
														manualAlert("领取异常");
														document.getElementById("register").removeAttribute("disabled");
													}
												}
												)
												
											}else{
												manualAlert("领取失败，请稍后再试！");
												document.getElementById("register").removeAttribute("disabled");
											}
										})
										/*生成赠险订单结束*/
									})
							/*生成赠险结束*/
						}else{
							manualAlert("很遗憾，注册失败！");
							document.getElementById("register").removeAttribute("disabled");
							return;
						}
					});
				}else{
					/*生成赠险开始*/
					var map = getIDCardInfo($(".idcard").val());
					app.request.postJSON(portalUrl+'/product/addProductNew',
							{"applicantBirthDay":map.get("birthDay"),"applicantName":$(".name").val(),"applicantPhone":$(".phone").val(),"applicantSex":map.get("sex"),"applicantIdNo":$(".idcard").val(),"insuredBirthDay":map.get("birthDay"),"insuredName":$(".name").val(),"insuredPhone":$(".phone").val(),"insuredSex":map.get("sex"),"productId":"P20180101000001","insuredIdNo":$(".idcard").val()},
							function(data1){
								productDetailId = data1.data;
								/*生成赠险订单开始*/
								app.request.getJSON(portalUrl+'/customer/getRiskGift',{
									"idcard":$('.idcard').val()
								},function(data){//code :-1账号未生成 :0客户查询服务器出错 :1 订单查询服务器出错   :2 已领取 :3 未领取
									if(data.code==-1||data.code==3){
										customerId = data.customerId;
										app.request.postJSON(portalUrl+'/order/addOrder',{
											"customerId":customerId,"productId":"P20180101000001","customerName":$(".name").val(),"customerPhone":$(".phone").val(),"description":"注册赠送赠险","totalAmount":"0","productDetailId":productDetailId,"productName":"赠险"
										},function(data){
											if(data.code==0){
												manualAlert("领取赠险成功");
												document.getElementById("register").setAttribute("disabled",true);
												document.getElementById("register").value = "已领取";
												document.getElementById("register").innerHTML = "已领取";
												$('#register').addClass("disabled");
											}else{
												manualAlert("领取异常");
												document.getElementById("register").removeAttribute("disabled");
											}
										}
										)
										
									}else{
										manualAlert("领取失败，请稍后再试！");
										document.getElementById("register").removeAttribute("disabled");
									}
								})
								/*生成赠险订单结束*/
							})
					/*生成赠险结束*/
				}
			}
		})
})
function settime(val,countdown){
	  if (countdown == 0) { 
		  val.removeAttribute("disabled"); 
		  val.innerHTML="免费获取验证码"; 
	  } else if(countdown > 0){ 
		  val.setAttribute("disabled", true); 
		  val.innerHTML="重新发送(" + countdown + ")"; 
		  countdown--; 
		  setTimeout(function() { 
			  settime(val,countdown);
		  },1000) 
	  } 
}
function manualAlert(msg){
	app.dialog.alert(msg,"温馨提示：");
}
