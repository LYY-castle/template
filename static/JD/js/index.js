var $ = Dom7;
var theme = 'auto';
var portalUrl = "/api/v1"//远程测试
// var portalUrl = "http://localhost:8090"//本地测试

// Init App
var app = new Framework7();
app.request.setup({
			headers : {
				"Authorization" : "Bearer eyJhbGciOiJIUzUxMiJ9.eyJhZ2VudGlkIjoiMTAwMDIiLCJjcmVhdGVUaW1lIjoxNTI2MjgyNDIzNTI0LCJleHBpcmF0aW9uVGltZSI6OTQ2MDgwMDAwMDAsImV4cCI6MTYyMDg5MDQyM30.irCMydZuir8XoCmutSy48IJrcjBgyr6Kaf_tYnWUQdwf0W-23pjeNYkx8kYs9NL0qAwpA4z1SisNI4b9wnluGw"
			}
		});
/* input 框内容变化事件 */
$('.idcard').on(
		'change',
		function() {
			if ($('.idcard').val() == '') {
				$('.idcard').removeClass('careful');
			} else if ($('.idcard').val().trim() == ''
					|| !PlatComJs.isIdNumber($('.idcard').val())) {// 判断身份证是否为空，判断是否符合要求
				$('.idcard').addClass('careful');
			} else {
				$('.idcard').removeClass('careful');
				var idcard = $('.idcard').val();
				var code = idcard.substring(idcard.length - 2,
						idcard.length - 1);
				if (parseInt(code) % 2 == 0) {
					$('.sex option[value="1"]').prop("selected", true);
				} else {
					$('.sex option[value="0"]').prop("selected", true);
				}
				/* 查看后台是否已经有客户资料 */
				app.request.getJSON(portalUrl+'/customer/getRiskGift', {
					"idcard" : $('.idcard').val()
				}, function(data) {// code :-1账号未生成 :0客户查询服务器出错 :1 订单查询服务器出错 :2
					// 已领取 :3 未领取
					if (data.code == -1) {
						document.getElementById("register").removeAttribute(
								"disabled");
						document.getElementById("register").value = "推荐";
						document.getElementById("register").innerHTML = "推荐";
						$('#register').removeClass("disabled");
					} else if (data.code == 0) {
						manualAlert("客户服务出错，请稍后再试！");
						document.getElementById("register").setAttribute(
								"disabled", true);
						document.getElementById("register").value = "系统繁忙";
						document.getElementById("register").innerHTML = "系统繁忙";
						$('#register').addClass("disabled");
					} else if (data.code == 1) {
						manualAlert("订单服务出错，请稍后再试！");
						document.getElementById("register").setAttribute(
								"disabled", true);
						document.getElementById("register").value = "系统繁忙";
						document.getElementById("register").innerHTML = "系统繁忙";
						$('#register').addClass("disabled");
					} else if (data.code == 2) {
						document.getElementById("register").setAttribute(
								"disabled", true);
						document.getElementById("register").value = "已推荐";
						document.getElementById("register").innerHTML = "已推荐";
						$('#register').addClass("disabled");
					} else if (data.code == 3) {
						document.getElementById("register").removeAttribute(
								"disabled");
						document.getElementById("register").value = "已推荐";
						document.getElementById("register").innerHTML = "已推荐";
						$('#register').addClass("disabled");
					} else {
						manualAlert("未知错误，请稍后再试！");
						document.getElementById("register").setAttribute(
								"disabled", true);
						document.getElementById("register").value = "系统繁忙";
						document.getElementById("register").innerHTML = "系统繁忙";
						$('#register').addClass("disabled");
					}
				})
			}
		})
$('.phone')
		.on(
				'change',
				function() {
					var reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[0,5-9])|(18[0,5-9]))\d{8}$/;
					if ($('.phone').val().trim() == ''
							|| !reg.test($('.phone').val())) {
						$('.phone').addClass('careful');
					} else {
						$('.phone').removeClass('careful');
						var source = '';
						if($('.source').val()=="myself"){
							source = $('.name').val();
						}else if($('.source').val()=="himself"){
							source = $('.introduceName').val();
						}else{
							source = '';
						}
						if ($('.idcard').val() == '' && source != '') {
							app.request.getJSON(portalUrl+
											'/customer/queryByPhoneAndSource',
											{
												"phone" : $('.phone').val(),
												"source" : source
											},
											function(data) {
												if (data.code == 0) {
													document.getElementById(
															"register")
															.removeAttribute(
																	"disabled");
													document
															.getElementById("register").value = "已推荐";
													document
															.getElementById("register").innerHTML = "已推荐";
													$('#register').addClass(
															"disabled");
												} else {
													document.getElementById(
															"register")
															.removeAttribute(
																	"disabled");
													document
															.getElementById("register").value = "推荐";
													document
															.getElementById("register").innerHTML = "推荐";
													$('#register').removeClass(
															"disabled");
												}
											})
						}
					}
				})
$('.name').on('change', function() {
	if ($('.name').val().trim() == '') {
		$('.name').addClass('careful');
	} else {
		$('.name').removeClass('careful');
	}
})
$('.introduceName').on('change', function() {
	if ($('.introduceName').val().trim() == '') {
		$('.introduceName').addClass('careful');
	} else {
		$('.introduceName').removeClass('careful');
	}
})
$('.email')
		.on(
				'change',
				function() {
					var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
					if ($('.email').val() == '') {
						$('.email').removeClass('careful');
					} else if ($('.email').val().trim() == ''
							|| !reg.test($(".email").val())) {
						$('.email').addClass('careful');
					} else {
						$('.email').removeClass('careful');
					}
				})
$('.source').on(
		'change',
		function() {
			var source = '';
			if($('.source').val()=="myself"){
				$('.introduceNameLable').addClass("hideLabel");
				source = $('.name').val();
				if ($('.idcard').val() == '' && $('.phone').val() != '' && source != '') {
					app.request.getJSON(portalUrl+'/customer/queryByPhoneAndSource', {
						"phone" : $('.phone').val(),
						"source" : source
					}, function(data) {
						if (data.code == 0) {
							document.getElementById("register").removeAttribute(
									"disabled");
							document.getElementById("register").value = "已推荐";
							document.getElementById("register").innerHTML = "已推荐";
							$('#register').addClass("disabled");
						} else {
							document.getElementById("register").removeAttribute(
									"disabled");
							document.getElementById("register").value = "推荐";
							document.getElementById("register").innerHTML = "推荐";
							$('#register').removeClass("disabled");
						}
					})
				}
			}else if($('.source').val()=="himself"){
				$('.introduceNameLable').removeClass("hideLabel");
				if($('.introduceName').val()==''){
					document.getElementById("register").removeAttribute(
					"disabled");
					document.getElementById("register").value = "推荐";
					document.getElementById("register").innerHTML = "推荐";
					$('#register').removeClass("disabled");
				}else{
					app.request.getJSON(portalUrl+'/customer/queryByPhoneAndSource', {
						"phone" : $('.phone').val(),
						"source" : $('.introduceName').val()
					}, function(data) {
						if (data.code == 0) {
							document.getElementById("register").removeAttribute(
									"disabled");
							document.getElementById("register").value = "已推荐";
							document.getElementById("register").innerHTML = "已推荐";
							$('#register').addClass("disabled");
						} else {
							document.getElementById("register").removeAttribute(
									"disabled");
							document.getElementById("register").value = "推荐";
							document.getElementById("register").innerHTML = "推荐";
							$('#register').removeClass("disabled");
						}
					})
				}
				$(".introduceName").on('change',function(){
					source = $('.introduceName').val();
					if(source == ''){
						document.getElementById("register").removeAttribute(
						"disabled");
						document.getElementById("register").value = "推荐";
						document.getElementById("register").innerHTML = "推荐";
						$('#register').removeClass("disabled");
					}else if ($('.idcard').val() == '' && $('.phone').val() != '') {
							app.request.getJSON(portalUrl+'/customer/queryByPhoneAndSource', {
								"phone" : $('.phone').val(),
								"source" : source
							}, function(data) {
								if (data.code == 0) {
									document.getElementById("register").removeAttribute(
											"disabled");
									document.getElementById("register").value = "已推荐";
									document.getElementById("register").innerHTML = "已推荐";
									$('#register').addClass("disabled");
								} else {
									document.getElementById("register").removeAttribute(
											"disabled");
									document.getElementById("register").value = "推荐";
									document.getElementById("register").innerHTML = "推荐";
									$('#register').removeClass("disabled");
								}
							})
						}
					})
			}else{
				source = '';
			}
		
		})
/* 提交验证事件 */
$('.register')
		.on(
				'click',
				function() {
					if ($(".register").html() == "已推荐") {
						manualAlert("该账户已存在");
						return;
					}
					if ($('.idcard').val() == '') {
						// 身份证为空，允许注册
					} else if (!PlatComJs.isIdNumber($('.idcard').val())) {
						manualAlert("身份证号码不符合规范！");
						return;
					} else {
						var idcard = $('.idcard').val();
						var code = idcard.substring(idcard.length - 2,
								idcard.length - 1);
						var statu = ((code % 2 == 1) ? '0' : '1');// 男为0，女为1
						var sex = $('.sex').val();
						if (sex != statu) {
							manualAlert("身份证号码性别和性别选择框中不一致！");
							return;
						}
					}
					var reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[0,5-9])|(18[0,5-9]))\d{8}$/;
					if ($('.phone').val() == '') {
						manualAlert("手机号码不能为空！");
						return;
					} else if (!reg.test($('.phone').val())) {
						manualAlert("手机号码格式不正确！");
						return;
					}
					if ($('.name').val() == '') {
						manualAlert("姓名不能为空！");
						return;
					}
					var reg_email = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
					if ($('.email').val() == '') {
						// 邮箱为空，可以注册
					} else if (!reg_email.test($('.email').val())) {
						manualAlert("邮箱地址格式不正确！");
						return;
					}
					/* 如果身份证号没有填，则通过手机号和来源两个锁定是否已经保存了信息，如果身份证号填了，直接做添加 */
					var source = '';
					if($('.source').val()=="myself"){
						source = $('.name').val();
					}else if($('.source').val()=="himself"){
						source = $('.introduceName').val();
						if(source==''){
							manualAlert("推荐人不能为空！");
							return;
						}
					}else{
						source = '';
					}
					
					if ($('.idcard').val() == '' && $('.phone').val() != '' && source != '') {
						app.request.getJSON(portalUrl+'/customer/queryByPhoneAndSource',
										{
											"phone" : $('.phone').val(),
											"source" : source
										},
										function(data) {
											if (data.code == 0) {
												manualAlert("该用户信息已存在！");
												document.getElementById(
														"register")
														.removeAttribute(
																"disabled");
												document
														.getElementById("register").value = "已推荐";
												document
														.getElementById("register").innerHTML = "已推荐";
												$('#register').addClass(
														"disabled");
												return;
											} else {
												document.getElementById(
														"register")
														.setAttribute(
																"disabled",
																true);
												app.request.postJSON(portalUrl+'/customer/addEmployee',
																{
																	"customerName" : $(
																			'.name')
																			.val(),
																	"mobile" : $(
																			'.phone')
																			.val(),
																	"idNumber" : $(
																			'.idcard')
																			.val(),
																	"sex" : $(
																			'.sex')
																			.val(),
																	"source" :source,
																	"email" : $(
																			".email")
																			.val(),
																	"comment" : $(
																			".comment")
																			.val()
																},
																function(data) {
																	if (data.code == 0) {
																		manualAlert("恭喜您，推荐成功！");
																		document
																				.getElementById(
																						"register")
																				.removeAttribute(
																						"disabled");
																		document
																				.getElementById("register").value = "已推荐";
																		document
																				.getElementById("register").innerHTML = "已推荐";
																		$(
																				'#register')
																				.addClass(
																						"disabled");
																	} else {
																		manualAlert("很遗憾，推荐失败，请稍后再试...");
																	}
																})
											}
										})
					} else {
						document.getElementById("register").setAttribute(
								"disabled", true);
						app.request.postJSON(portalUrl+
										'/customer/addEmployee',
										{
											"customerName" : $('.name').val(),
											"mobile" : $('.phone').val(),
											"idNumber" : $('.idcard').val(),
											"sex" : $('.sex').val(),
											"source" : source,
											"email" : $(".email").val(),
											"comment" : $(".comment").val()
										},
										function(data) {
											if (data.code == 0) {
												manualAlert("恭喜您，推荐成功！");
												document.getElementById(
														"register")
														.removeAttribute(
																"disabled");
												document
														.getElementById("register").value = "已推荐";
												document
														.getElementById("register").innerHTML = "已推荐";
												$('#register').addClass(
														"disabled");
											} else {
												manualAlert("很遗憾，推荐失败，请稍后再试...");
											}
										})
					}

				})
function manualAlert(msg) {
	app.dialog.alert(msg, "温馨提示：");
}
