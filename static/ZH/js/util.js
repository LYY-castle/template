/*根据部门查询下面的活动*/
function getCampaignMap(){//活动id和活动名称
	var map_campaign = new HashMap();
	/*加载活动名称*/
	$.ajax({
		url:"/api/v1/campaign/findCampaignByUser",
		async :false,//改为同步方法，否则随机查询，可能设置不了全局变量
		xhrFields: {
			withCredentials: true    // 要在这里设置 跨域设置cookie
		},
		success:function(data){
			var arr = data.data;
			for(var i in arr){
				map_campaign.put(arr[i].campaignId,arr[i].campaignName);
			}
		},
		error:function(data){
			console.log(data);
		}
	})
	return map_campaign;
}
/*查询所有活动*/
function getCampaignsMap(){//活动id和活动名称
	var map_campaign = new HashMap();
	/*加载活动名称*/
	$.ajax({
		url:"/api/v1/campaign/findCampaigns",
		async :false,//改为同步方法，否则随机查询，可能设置不了全局变量
		xhrFields: {
			withCredentials: true    // 要在这里设置 跨域设置cookie
		},
		success:function(data){
			var arr = data.data;
			for(var i in arr){
				map_campaign.put(arr[i].campaignId,arr[i].campaignName);
			}
		},
		error:function(data){
			console.log(data);
		}
	})
	return map_campaign;
}
/*查找所有名单id及名称*/
function getListMap(){//名单id和名单名称
	var map_list = new HashMap();
	/*加载名单名称*/
	$.ajax({
		url:"/api/v1/nameList/findAllNameList",
		async :false,//改为同步方法，否则随机查询，可能设置不了全局变量
		xhrFields: {
			withCredentials: true    // 要在这里设置 跨域设置cookie
		},
		success:function(data){
			var arr = data.data;
			for(var i in arr){
				map_list.put(arr[i].listId,arr[i].listName);
			}
		},
		error:function(data){
			console.log(data);
		}
	})
	return map_list;
}
/*根据部门和部门下的活动，查询下面的名单*/
function getOrganListMap(){//名单id和名单名称
	var map_list = new HashMap();
	var listmap = getListMap();
	/*加载名单名称*/
	$.ajax({
		url:"/api/v1/contact/findAllNameList",
		async :false,//改为同步方法，否则随机查询，可能设置不了全局变量
		xhrFields: {
			withCredentials: true    // 要在这里设置 跨域设置cookie
		},
		success:function(data){
			var arr = data.data;
			for(var i in arr){
				map_list.put(arr[i],listmap.get(arr[i]));
			}
		},
		error:function(data){
			console.log(data);
		}
	})
	return map_list;
}

/*通过部门id查找它的下属部门或者下属员工*/
function getOrganMap(){//组织id和组织名称
	var map_organ = new HashMap();
	/*查找所有组织*/
	$.ajax({
		url:"/api/v1/organization/findNextOrganByAgentId",
		async :false,//改为同步方法，否则随机查询，可能设置不了全局变量
		xhrFields: {
			withCredentials: true    // 要在这里设置 跨域设置cookie
		},
		success:function(data){
			var arr = data.data;
			for(var i in arr){
				map_organ.put(arr[i].id,arr[i].departName);
			}
		},
		error:function(data){
			console.log(data);
		}
	})
	return map_organ;
}

function HashMap(){  
    //定义长度  
    var length = 0;  
    //创建一个对象  
    var obj = new Object();  
  
    /** 
    * 判断Map是否为空 
    */  
    this.isEmpty = function(){  
        return length == 0;  
    };  
  
    /** 
    * 判断对象中是否包含给定Key 
    */  
    this.containsKey=function(key){  
        return (key in obj);  
    };  
  
    /** 
    * 判断对象中是否包含给定的Value 
    */  
    this.containsValue=function(value){  
        for(var key in obj){  
            if(obj[key] == value){  
                return true;  
            }  
        }  
        return false;  
    };  
  
    /** 
    *向map中添加数据 
    */  
    this.put=function(key,value){  
        if(!this.containsKey(key)){  
            length++;  
        }  
        obj[key] = value;  
    };  
  
    /** 
    * 根据给定的Key获得Value 
    */  
    this.get=function(key){  
        return this.containsKey(key)?obj[key]:null;  
    };  
  
    /** 
    * 根据给定的Key删除一个值 
    */  
    this.remove=function(key){  
        if(this.containsKey(key)&&(delete obj[key])){  
            length--;  
        }  
    };  
  
    /** 
    * 获得Map中的所有Value 
    */  
    this.values=function(){  
        var _values= new Array();  
        for(var key in obj){  
            _values.push(obj[key]);  
        }  
        return _values;  
    };  
  
    /** 
    * 获得Map中的所有Key 
    */  
    this.keySet=function(){  
        var _keys = new Array();  
        for(var key in obj){  
            _keys.push(key);  
        }  
        return _keys;  
    };  
  
    /** 
    * 获得Map的长度 
    */  
    this.size = function(){  
        return length;  
    };  
  
    /** 
    * 清空Map 
    */  
    this.clear = function(){  
        length = 0;  
        obj = new Object();  
    };  
}

/*通过员工工号查询姓名*/
function getStaffNameByAgentId(id){
	var name = ''
		if(id==null||typeof id=='undefined')return '';
	 $.ajax({
		 url:"/api/v1/employee/getStaffNameByAgentId",
		 data:{"agentId":id},
		 async:false,
		 type:"GET",
		 xhrFields: {
	            withCredentials: true    // 要在这里设置 跨域设置cookie
	        },
		 success:function(datas){
			 if(datas.code == 1){
				 if(typeof datas.data[0]=='undefined')return '';
				 name = datas.data[0].staffName;
			 }else{
				 alert(datas.message);
			 }
		 },
		 dataType:"json"
	 });
	return name;
}
/*通过员工id查找部门*/
function getDepartIdByAgentId(id){
	var departId = ''
	 $.ajax({
		 url:"/api/v1/employee/getStaffNameByAgentId",
		 data:{"agentId":id},
		 async:false,
		 type:"GET",
		 xhrFields: {
	            withCredentials: true    // 要在这里设置 跨域设置cookie
	        },
		 success:function(datas){
			 if(datas.code == 1){
				 departId = datas.data[0].departId;
			 }else{
				 alert(datas.message);
			 }
		 },
		 dataType:"json"
	 });
	return departId;
}
/*通过客户id查找客户姓名*/
function getCustomerNameByCustomerId(customerId){
	var customerName = '';
	if(customerId!=null){
		 $.ajax({
			 url:"/api/v1/customer/queryCustomerById",
			 data:{"customerId":customerId},
			 async:false,
			 type:"GET",
			 xhrFields: {
		            withCredentials: true    // 要在这里设置 跨域设置cookie
		        },
			 success:function(datas){
				 console.log(datas);
				 if(datas.code == 1){
					 customerName = datas.data[0].staffName;
				 }else{
					 alert(datas.message);
				 }
			 },
			 dataType:"json"
		 });
	}
	return customerName;
}
/*查询所有组织id及名称*/
function getAllOrganlist(){
	var map_organlist = new HashMap();
	/*查找所有组织*/
	$.ajax({
		url:"/api/v1/organization/findAllOrganTo",
		async :false,//改为同步方法，否则随机查询，可能设置不了全局变量
		xhrFields: {
			withCredentials: true    // 要在这里设置 跨域设置cookie
		},
		success:function(data){
			var arr = data.data;
			for(var i in arr){
				map_organlist.put(arr[i].id,arr[i].departName);
			}
		},
		error:function(data){
			console.log(data);
		}
	})
	return map_organlist;
}

/*查询当前组织的下属组织id及名称*/
function getNextOrganlist(){
	var map_nextorganlist = new HashMap();
	/*查找所有组织*/
	$.ajax({
		url:"/api/v1/organization/findNextOrganByNow",
		async :false,//改为同步方法，否则随机查询，可能设置不了全局变量
		xhrFields: {
			withCredentials: true    // 要在这里设置 跨域设置cookie
		},
		success:function(data){
			console.log(data);
			var arr = data.data;
			for(var i in arr){
				map_nextorganlist.put(arr[i].id,arr[i].departName);
			}
		},
		error:function(data){
			console.log(data);
		}
	})
	return map_nextorganlist;
}
/*查询当前组织的下属员工id及名称*/
function getNextAgentlist(){
	var map_nextagentlist = new HashMap();
	/*查找所有组织*/
	$.ajax({
		url:"/api/v1/organization/findNextAgentByNow",
		async :false,//改为同步方法，否则随机查询，可能设置不了全局变量
		xhrFields: {
			withCredentials: true    // 要在这里设置 跨域设置cookie
		},
		success:function(data){
			var arr = data.data;
			for(var i in arr){
				map_nextagentlist.put(arr[i][1],arr[i][2]);
			}
		},
		error:function(data){
			console.log(data);
		}
	})
	return map_nextagentlist;
}

//通过agentid查找当天的通时通次(班长监控用到)
function getCallDetailInfoToday(agentid){
	var map_detailcall = new HashMap();
	$.ajax({
		data:{"agentId":agentid},
		type:"POST",
		url:"/api/v1/contact/findStatusByAgentId",
		dataType:"json",
		async:false,
		xhrFields: {
			withCredentials: true    // 要在这里设置 跨域设置cookie
		},
		success:function(data){
			if(data.code==0){
				map_detailcall.put("outtime",data.data.outCallTotalTime);
				map_detailcall.put("outcall",data.data.outCallTimes);
				map_detailcall.put("intime",data.data.inCallTotalTime);
				map_detailcall.put("incall",data.data.inCallTimes);
			}
			
		},
		error:function(data){
			alert("取不到当前用户的接触信息!");
		}
		
	});
	return map_detailcall;
}
/*查询下属的所有质检活动*/
function findQmCampaign(){
	var map_activity = new HashMap();
	$.ajax({
		url:"/api/v1/qualityTask/findQmCampaignByUser",
		type:"get",
		dataType:"json",
		async:false,
		xhrFields: {
			withCredentials: true    // 要在这里设置 跨域设置cookie
		},
		success:function(data){
			console.log(data);
			if(data.code=="0"){
				var arr = data.data;
				for(var i in arr){
					map_activity.put(arr[i].activityId,arr[i].activityName);
				}
			}
		
		},
		error:function(data){
			alert("系统繁忙!");
		}
	});//ajax结尾
	return map_activity;
} 
/*查询拨打次数是否超过限制*/
function countDialTimes(taskId){//taskId:任务id,如有,查询数据库,比对拨打次数;如果没有,则不控制次数拨打。
	var flag = null;
	if(taskId.length<1){
		return flag;//没有任务id，不限制拨打
	}else{
		$.ajax({
			url:"/api/v1/contact/checkContactTimes",
			type:"get",
			data:{"taskId":taskId},
			dataType:"json",
			async:false,
			xhrFields: {
				withCredentials: true    // 要在这里设置 跨域设置cookie
			},
			success:function(res){
				if(res.code=="0"){
					flag = res.data;
				}
			},
			error:function(data){
				alert("系统繁忙!");
			}
		});
	}
	return flag;
}
/*截取身份证信息*/
function getIDCardInfo(idcard){
	var map = new HashMap();
	var addstr = idcard.substring(6,14);
	var applicantBirthDay = addstr.substring(0,4)+"-"+addstr.substring(4,6)+"-"+addstr.substring(6,addstr.length);
	map.put("birthDay",applicantBirthDay);
	var code = idcard.substring(idcard.length-2,idcard.length-1);
	if(parseInt(code)%2==0){
		map.put("sex",1);//女
	}else{
		map.put("sex",0);//男
	}
	return map;
} 
/*通过组织id查找上级组织id*/

function findOrganById(id){
	var upId = '';
	$.ajax({
		url:"/api/v1/organization/findOrganById",
		type:"POST",
		data:{"id":id},
		dataType:"json",
		async:false,
		xhrFields: {
			withCredentials: true    // 要在这里设置 跨域设置cookie
		},
		success:function(data){
			if(data.code=="1"){
				upId = data.data.upId;
			}
		},
		error:function(data){
			alert("系统繁忙!");
		}
	});//ajax结尾
	return upId;
} 
