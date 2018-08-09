var PlatComJs={
		 /*判断输入内容是否为空*/  
		 isNull:function(id){
			 var str = document.getElementById(id).value.trim();    
		     if(str.length==0){    
		         return true;    
		     }else{
		    	 return false;
		     }   
		 },
		 
		 /*判断是否为中文*/
		 isChinese:function(id){
			 var str = document.getElementById(id).value.trim(); 
			 if(str.length!=0){
				 var reg = /^[\u4E00-\u9FA5]+$/;
				 if(!reg.test(str)){
					 return false;
				 }else{
					 return true;
				 }
			 }
				 
		 },
		 
		 /*isIdNumber:function(id){
			 var card = document.getElementById(id).value.trim();
			 // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
			 var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
			 if(reg.test(card) === false){ 
				 return false; 
			 }else{
				 return true;
			 }
		 },   身份证简单校验*/
		 //时间比较（yyyy-MM-dd HH:mm:ss）
		compareTime: function (startTime, endTime) {
			var startTimes = startTime.substring(0, 10).split('-');
			var endTimes = endTime.substring(0, 10).split('-');
			startTime = startTimes[1] + '-' + startTimes[2] + '-' + startTimes[0] + ' ' + startTime.substring(10, 19);
			endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);
			var thisResult = (Date.parse(endTime) - Date.parse(startTime)) / 3600 / 1000;
			if (thisResult < 0) {
				// alert("endTime小于tartTime！");
				return 'lt'
			} else if (thisResult > 0) {
				// alert("endTime大于tartTime！");
				return 'gt'
			} else if (thisResult == 0) {
				// alert("endTime等于tartTime！");
				return 'eq'
			} else {
				return '异常';
			}
		},
		 isPhone:function(str){
			 var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;  
	          if (!myreg.test(str)) {  
	              return false;  
	          } else {  
	              return true;  
	          }  
		 },
		 
		 isIdNumber:function(id) {
			   // 1 "验证通过!", 0 //校验不通过 // id为身份证号码
			    var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
			    //号码规则校验
			    if(!format.test(id)){
			      return false;
			    }
			    //区位码校验
			    //出生年月日校验  前正则限制起始年份为1900;
			    var year = id.substr(6,4),//身份证年
			      month = id.substr(10,2),//身份证月
			      date = id.substr(12,2),//身份证日
			      time = Date.parse(month+'-'+date+'-'+year),//身份证日期时间戳date
			      now_time = Date.parse(new Date()),//当前时间戳
			      dates = (new Date(year,month,0)).getDate();//身份证当月天数
			    if(time>now_time||date>dates){
			      return false;
			    }
			    //校验码判断
			    var c = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);  //系数
			    var b = new Array('1','0','X','9','8','7','6','5','4','3','2'); //校验码对照表
			    var id_array = id.split("");
			    var sum = 0;
			    for(var k=0;k<17;k++){
			      sum+=parseInt(id_array[k])*parseInt(c[k]);
			    }
			    if(id_array[17].toUpperCase() != b[sum%11].toUpperCase()){
			      return false;
			    }
			    return true;
			},
		 
		 
		/* 判断日期类型是否为YYYY-MM-DD格式的类型 */
		 isDate:function(id){
			 var str = document.getElementById(id).value.trim();    
		     if(str.length!=0){    
		         var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;     
		         var r = str.match(reg);     
		         if(r==null){      
		        	 return false;     
		         } else{
		        	 return true;
		         } 
		     }
		 },
		/*判断日期类型是否为YYYY-MM-DD hh:mm:ss格式的类型*/
		 isDateTime:function(id){
			  var str = document.getElementById(id).value.trim();    
			     if(str.length!=0){    
			         var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;     
			         var r = str.match(reg);     
			         if(r==null){      
			        	 return false;     
			         } else{
			        	 return true;
			         }        
			     }    
		 },
		/*判断输入的字符是否为英文字母*/   
		 isLetter:function(id){
			   var str = document.getElementById(id).value.trim();    
		         if(str.length!=0){    
			         reg=/^[a-zA-Z]+$/;     
			         if(r==null){    
			        	 return false;     
			         } else{
			        	 return true;
			         }    
		         }    
		 },
		 /*判断输入的字符是否为整数*/
		 isInteger:function(id){
			  var str = document.getElementById(id).value.trim();    
		         if(str.length!=0){    
			         reg=/^[-+]?\d*$/;     
			         if(!reg.test(str)){    
			        	 return false;   
			         } else{
			        	 return true; 
			         }
		         }    
		 },
		/*判断输入的字符是否为双精度*/  
		 isDouble:function(id){
			 var str = document.getElementById(id).value.trim();    
	         if(str.length!=0){    
		         reg=/^[-\+]?\d+(\.\d+)?$/;    
		         if(!reg.test(str)){    
		        	 return false;     
		         }else{
		        	 return true; 
		         }
	         }    
		 },
		 /*判断标签里面的值是否相同*/
		 isEqual:function(startId,endId){
			 var startValue = document.getElementById(startId).value.trim();  
			 var endValue = document.getElementById(endId).value.trim();
			 if(startValue!=endValue){
				 return false;
			 }else{
				 return true;
			 }
		 },
		 /*判断输入的EMAIL格式是否正确*/   
		 isEmail:function(id){
			 var str = document.getElementById(id).value.trim();    
	         if(str.length!=0){    
		         reg=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;    
		         if(!reg.test(str)){    
		        	 return false;    
		         } else{
		        	 return true;    
		         }
	         }    
		 },
		 /*不判断非空，只判断开始和结束的时间的大小（前面大返回true）*/
		 compareCalendar:function(startId,endId){
			 var startDate = document.getElementById(startId).value.trim();     
			 var endDate = document.getElementById(endId).value.trim();
			 if(startDate==null||endDate==null||startDate==""||endDate==""){
				 return true;
			 }
			 if (startDate.indexOf(" ") != -1 && endDate.indexOf(" ") != -1 ) {     
			     //包含时间，日期    
				 if (startDate.length > 0 && endDate.length > 0) {     
					 var startDateTemp = startDate.split(" ");     
					 var endDateTemp = endDate.split(" ");     
					 var arrStartDate = startDateTemp[0].split("-");     
					 var arrEndDate = endDateTemp[0].split("-");     
					 var arrStartTime = startDateTemp[1].split(":");     
					 var arrEndTime = endDateTemp[1].split(":");     
					 var allStartDate = new Date(arrStartDate[0], parseInt(arrStartDate[1])-1, arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);     
					 var allEndDate = new Date(arrEndDate[0], parseInt(arrEndDate[1])-1, arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);     
					 if (allStartDate.getTime() > allEndDate.getTime()) {     
					         return false;     
					 } else {     
					     return true;     
					  }     
				} else {  
					/*时间可以为空*/
					return true;     
				}     

			 } else {     
			     //不包含时间，只包含日期    
				 var arys1= new Array();        
				 var arys2= new Array();        
				 if(startDate != null && endDate != null) {        
					 arys1=startDate.split('-');        
				 	var sdate=new Date(arys1[0],parseInt(arys1[1]-1),arys1[2]);        
				 	arys2=endDate.split('-');        
				 	var edate=new Date(arys2[0],parseInt(arys2[1]-1),arys2[2]);        
				 	if(sdate > edate) {        
				 		return false;           
				 	}else {     
				 		return true;        
				 	}     
				 }        
    
			  }     
		 },
		 /*不判断非空，只判断开始和结束的时间的大小,前面比后面大等于这返回false*/
		 compareCalendarByValue:function(startValue,endValue){
			 if(startValue==null||endValue==null&&startValue==""||endValue==""){
				 return true;
			 }
			 if (startValue.indexOf(" ") != -1 && endValue.indexOf(" ") != -1 ) {     
				 //包含时间，日期    
				 if (startValue.length > 0 && endValue.length > 0) {     
					 var valueTemp= startValue.split(" ");     
					 var endDateTemp = endValue.split(" ");     
					 var arrStartDate = valueTemp[0].split("-");     
					 var arrEndDate = endDateTemp[0].split("-");     
					 var arrStartTime = valueTemp[1].split(":");     
					 var arrEndTime = endDateTemp[1].split(":");     
					 var allStartDate = new Date(parseInt(arrStartDate[0]), parseInt(arrStartDate[1])-1, parseInt(arrStartDate[2]), parseInt(arrStartTime[0]), parseInt(arrStartTime[1]), parseInt(arrStartTime[2]));     
					 var allEndDate = new Date(parseInt(arrEndDate[0]), parseInt(arrEndDate[1])-1, parseInt(arrEndDate[2]), parseInt(arrEndTime[0]), parseInt(arrEndTime[1]), parseInt(arrEndTime[2]));     
					 if (allStartDate.getTime() > allEndDate.getTime()) {     
						 return false;     
					 } else {     
						 return true;     
					 }     
				 } else {  
					 /*时间可以为空*/
					 return true;     
				 }     
				 
			 } else {     
				 //不包含时间，只包含日期    
				 var arys1= new Array();        
				 var arys2= new Array();        
				 if(startValue != null && endValue != null) {        
					 arys1=startValue.split('-');        
					 var sdate=new Date(arys1[0],parseInt(arys1[1]-1),arys1[2]);        
					 arys2=endValue.split('-');        
					 var edate=new Date(arys2[0],parseInt(arys2[1]-1),arys2[2]);        
					 if(sdate > edate) {        
						 return false;           
					 }else {     
						 return true;        
					 }     
				 }        
				 
			 }     
		 },
		/* form表单里面的值转换为json格式*/
		getFormJson:function(id){
			var serializeArrayParams = $('#'+id).serializeArray();
	        var obj={};
	        for (var k = 0; k < serializeArrayParams.length; k++)
	        {
	            var attributeName = serializeArrayParams[k].name;
	            var attributeValue =serializeArrayParams[k].value;
	            if(!attributeValue)
	            {
	                continue ;
	            }

	            var array = attributeName.split(".");
	            var currentObject=obj;
	            for (var i = 0; i < array.length; i++) {
	                currentField=array[i];
	                if(currentField.indexOf("[")==-1){

	                    if(i==( array.length-1)){
	                        currentObject[currentField]=attributeValue;
	                    }else{

	                        if(currentObject[currentField]==null){
	                            currentObject[currentField]={};
	                        }
	                        currentObject=currentObject[currentField];
	                    }

	                }else{
	                    var arrayCurrentField=currentField.substring(0,currentField.indexOf("["));
	                    if(currentObject[arrayCurrentField]==null){
	                        currentObject[arrayCurrentField]=[];
	                    }
	                    //添加
	                    var currentArray=currentObject[arrayCurrentField];
	                    currentArray.push(attributeValue);
	                    

	                /*   var arrayStringIndex=currentField.substring(currentField.indexOf("[")+1,currentField.indexOf("]"));
	                    var arrayIntIndex=parseInt(arrayStringIndex);
	                    var minLength=arrayIntIndex+1;
	                    while(currentArray.length<minLength){
	                        currentArray.push({});
	                    }

	                    if(i==( array.length-1)){
	                        currentArray[arrayIntIndex]=attributeValue;
	                    }else{
	                        if(currentArray[arrayIntIndex]==null){
	                            currentArray[arrayIntIndex]={};
	                        }
	                        currentObject=currentArray[arrayIntIndex];
	                    }   */
	                }
	            }


	        }
	        return obj;
	    }
}