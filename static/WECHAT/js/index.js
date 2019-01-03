$.ajaxSetup({
  headers:{
    'Authorization':'eyJhbGciOiJIUzUxMiJ9.eyJhZ2VudGlkIjoiMTAwMjkiLCJjcmVhdGVUaW1lIjoxNTQ2NDk4NzEzOTc4LCJleHBpcmF0aW9uVGltZSI6NzIwMDAwMCwicm9sZXMiOltdLCJpcCI6IlRodSBKYW4gMDMgMTQ6NTg6MzMgQ1NUIDIwMTkiLCJzdGFmZk5hbWUiOiJJdmVyc29uTGlubiIsImxhYmVsIjoid2lzZTJjIiwiZXhwIjoxNTQ2NTA1OTEzfQ.AR54TQt7jX50M1qvw-Br8W4KKu9DtWuBNvqvlJlEyMuBvPgPy3wF0jWZITMGtRDL8oIADyEClMFKCTZULncvjg'
  },
  contentType:'application/json;charset=utf-8',
})
var portalUrl = "http://119.27.179.175:8111/linnportal/api/v1";//远程测试
// var portalUrl = "http://localhost:8090";//本地测试
// 获取用户的openid 
var openid = getQueryString('openid')
var $toast = $('#toast')

// 点击获取验证码
// function getVerifyCode(){
//   // 先验证是否有填写手机号
//   var reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[0,5-9])|(18[0,5-9]))\d{8}$/;
//   if($('#customerPhone').val().trim() == ''){
//     alert('请先输入手机号！');
//     return ;
//   } else if(!reg.test($('#customerPhone').val())) {
//     alert("请输入正确的手机号码！");
//     $('#customerPhone').val('')
//     return ;
//   }

//   // 手机号填写正确 发送请求发送验证码
//   $('#getCode').prop("disabled", true);
//   var val = document.getElementById("getCode");
//   settime(val,60);

//   $.ajax({
//     url: portalUrl + '/customer/getVerifyCode',
//     type:'get',
//     dataType:'json',
//     data:{phone:$('#customerPhone').val()},
//     success:function(res){
//       if(res.code != 0){
//         alert('请重新获取验证码！')
//       }
//     }
//   })

// }

//  提交绑定手机号
function submitBindMobile(){
  // 先禁用按钮
  $('#submitBtn').prop('disabled',true)
  // 1.5s后解禁
  setTimeout(()=> {
    $('#submitBtn').prop('disabled',false)
  },1500)
  // 验证是否有填写手机号
  var reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[0,5-9])|(18[0,5-9]))\d{8}$/;
  if($('#customerPhone').val().trim() == ''){
    alert('请先输入手机号！');
    return ;
  } else if(!reg.test($('#customerPhone').val())) {
    alert("请输入正确的手机号码！");
    $('#customerPhone').val('')
    return ;
  } else {
    // 发送请求绑定手机号与openid
    $.ajax({
      url: portalUrl + '/customer/bindMobileWithOpenid',
      data:JSON.stringify({"openid":openid,"mobile":$('#customerPhone').val()+''}),
      dataType:'json',
      type:'post',
      beforeSend: function(request) {
        request.withCredentials = true
        request.setRequestHeader("Authorization", "Bearer eyJhbGciOiJIUzUxMiJ9.eyJhZ2VudGlkIjoiMTAwMDIiLCJjcmVhdGVUaW1lIjoxNTI2MjgyNDIzNTI0LCJleHBpcmF0aW9uVGltZSI6OTQ2MDgwMDAwMDAsImV4cCI6MTYyMDg5MDQyM30.irCMydZuir8XoCmutSy48IJrcjBgyr6Kaf_tYnWUQdwf0W-23pjeNYkx8kYs9NL0qAwpA4z1SisNI4b9wnluGw");
      },
      success:function(data){
        if(data.code === 0){
          $('#submitBtn').css('display','none');
          $('#hideBtn').css('display','block');
          /// 绑定成功
          $toast.css('opacity','1');
          $toast.css('display','block');
          $toast.fadeIn(100);
          setTimeout(function(){
            $toast.fadeOut(100);
          },2000);
        } else if(data.code === "403"){
          alert('未获取到Authorization，请重试')
        } else {
          alert(data.message)
        }
      }
    })
  }

    

  // // 验证验证码是否为空
  // if($('#verifyCode').val().trim() == ''){
  //   alert('请输入验证码！')
  //   return 
  // } else {
  //   // 发送请求验证是否正确
  //   $.ajax({
  //     url: portalUrl + '/customer/verifyCode',
  //     data:{
  //       phone:$('#customerPhone').val(),
  //       verifycode:$('#verifyCode').val()
  //     },
  //     dataType:'json',
  //     type:'get',
  //     async:false,
  //     success:function(res){
  //       if(res.code === 0){
  //         // 验证通过
  //         // 发送请求绑定手机号与openid
  //         $.ajax({
  //           url: portalUrl + '/customer/bindMobileWithOpenid',
  //           data:JSON.stringify({"openid":openid,"mobile":$('#customerPhone').val()+''}),
  //           dataType:'json',
  //           type:'post',
  //           success:function(data){
  //             if(data.code === 0){
  //               $('#submitBtn').css('display','none');
  //               $('#hideBtn').css('display','block');
  //               /// 绑定成功
  //               $toast.css('opacity','1');
  //               $toast.css('display','block');
  //               $toast.fadeIn(100);
  //               setTimeout(function(){
  //                 $toast.fadeOut(100);
  //               },2000);
  //             } else {
  //               alert(data.message)
  //             }
  //           }
  //         })
  //       } else {
  //         // 验证码不匹配 
  //         alert(res.message)
  //       }
  //     }
  //   })
  // }
}

// 定时器 倒计时
function settime(val,countdown){
  if (countdown == 0) { 
    $('#getCode').removeAttr('disabled');
    val.innerHTML="获取验证码"; 
  } else if(countdown > 0){ 
    $('#getCode').prop('disabled', true);
    val.innerHTML="重新发送(" + countdown + ")"; 
    countdown--; 
    setTimeout(function() { 
      settime(val,countdown);
    },1000) 
  } 
}

// jquery 截取url参数
function getQueryString(name) {  
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
  var r = window.location.search.substr(1).match(reg);  
  if (r != null)  
      return unescape(r[2]);  
  return null;  
}  