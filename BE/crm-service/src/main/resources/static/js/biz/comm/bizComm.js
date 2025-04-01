/***********************************************************************************************
 * Program Name : 공통 라이브러리(bizComm.js)
 * Creator      : sukim
 * Create Date  : 2022.03.19
 * Description  : 공통 라이브러리
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.23     sukim            개인정보마스킹 함수 추가   
 *                                 (이메일,전화번호,주민번호,성명,사업자번호) 
 * 2022.03.24     sukim            비밀번호 관리정책 함수 추가 
 ************************************************************************************************/
/**
 * 제  목 : HashMap 관리 함수
 * 사용법 : 1)선언 let map = new HashMap();
 *          2)값 넣고 빼내오기 
 *               map.put("사과","apple");
 *               map.get("사과");  // retrun "apple"; 
 */
HashMap = function(){
	this.map = new Array();
}
HashMap.prototype = {
		put : function(key, value){
			this.map[key] = value;
		},
		get : function(key){
			return this.map[key];
		},
		getAll : function(){
			return this.map;
		},
		clear : function(){
			this.map = new Array();
		},
		getKeys : function(){
			let keys = new Array();
			for(i in this.map){
				keys.push(i);
			}
			return keys;
		}
};

/**
 * 삭제 예정 - JAVA Contorller 단 Util 사용 요망
 * 제  목 : 개인정보마스킹 함수
 * 사용법 : 1)이메일     : maskingFunc.email(test12345@nate.com) → te*******@na******
 *          2)전화번호   : maskingFunc.phone("01012345678",0)    → 010-****-5678 , maskFunc.phone("01012345678",1)    → 010****5678,  maskFunc.phone("01012345678")    → 010-1234-5678
 *          3)주민번호   : maskingFunc.rrn("9101012345678")      → 9101012****** , maskingFunc.rrn("910101-2345678")  → 910101-2******
 *          4)이름       : maskingFunc.name("홍길동")            → 홍길*         , maskingFunc.name("윤빛가람")       → 윤빛**     ,  maskingFunc.name("차린")         → 차*
 *          5)사업자번호 : maskingFunc.bizNum("1348108473",0)    → 134-81-*****  , maskingFunc.bizNum("1348108473",1) → 13481***** ,  maskingFunc.bizNum("1348108473") → 134-81-08473
 */
 var maskingFunc = {
 		checkNull : function (str){
 			if(typeof str == "undefined" || str == null || str == ""){
 				return true;
 			}
 			else{
 				return false;
 			}
 		},
 		/*
 		* 이메일주소 마스킹
 		* @param   : (이메일주소)
 		*            ex) test12345@nate.com → te*******@na******
 		* @returns : string
 		*/
 		email : function(str){
 			let originStr = str;
 			let emailStr = originStr.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
 			let strLength;
 			if(this.checkNull(originStr) == true || this.checkNull(emailStr) == true){
 				return originStr;
 			}else{
 				strLength = emailStr.toString().split('@')[0].length - 3;
 				return originStr.toString().replace(new RegExp('.(?=.{0,' + strLength + '}@)', 'g'), '*').replace(/.{6}$/, "******");
 			}
 		},
 		/*
 		* 휴대폰번호 마스킹
 		* @param   : (휴대폰번호, 타입)
 		*            type이 0일 경우 '-' 포함된 마스킹번호, 1일 경우 '-' 제외 마스킹번호, 생략할 경우 '-' 들어간 String 포멧된 번호가 return
 		*            ex1) 01012345678 → type(0) : 010-****-5678 , type(1) : 010****5678, 없는 경우: 010-1234-5678
 		*            ex2) 0101234567  → type(0) : 010-***-4567  , type(1) : 010***4567,  없는 경우: 010-123-4567
 		*            ex3) 0277775678 (지역 2자리-국번 4자리- 번호 4자리) → type(0) : 02-****-5678  , type(1) : 02****5678,  없는 경우: 02-7777-5678
 		*            ex4) 027778888  (지역 2자리-국번 3자리- 번호 4자리) : 02인 경우는 국번 3자리는 없음 (마스킹안됨) → 02-777-8888
 		*            ex5) 0313335678 (지역 3자리-국번 3자리- 번호 4자리) → type(0) : 031-***-5678 , type(1) : 031***5678, 없는 경우 : 031-333-5678
 		*            ex6) 15882000    → 마스킹 대상이 아님 → type(0) : 1588-2000  → type(1) : 15882000
 		* @returns : string
 		*/
 		phone : function(num, type){
 		    let formatNum = '';
 		    if(num.length==11){
 		        if(type==0){
 		            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
 		        }else if(type==1){
 		        	formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
 		        }else{
 		            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
 		        }
 		    }else if(num.length==8){
 		    	if(type==1){
 		    		formatNum = num.replace(/(\d{4})(\d{4})/, '$1$2');
 		    	}else{
 		    		formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
 		    	}
 		    }else{
 		        if(num.indexOf('02')==0){
 		            if(type==0){
 		                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
 		            }else if(type==1){
 		            	formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1****$3');
 		            }else{
 		                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
 		            }
 		        }else{
 		            if(type==0){
 		                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
 		            }else if(type==1){
 		            	formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3');
 		            }else{
 		                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
 		            }
 		        }
 		    }
 		    return formatNum;
 		},
 		/*
 		* 주민등록번호 마스킹
 		* @param   : (주민등록번호)
 		*            ex1) 810101-1234567 → 810101-1******
 		*            ex2) 9101012345678 → 9101012******
 		* @returns : boolean
 		*/
 		rrn : function(str){
 			let originStr = str;
 			let rrnStr;
 			let maskingStr;
 			let strLength;

 			if(this.checkNull(originStr) == true){
 				return originStr;
 			}

 			rrnStr = originStr.match(/(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-8]{1}[0-9]{6}\b/gi);
 			if(this.checkNull(rrnStr) == false){
 				strLength = rrnStr.toString().split('-').length;
 				maskingStr = originStr.toString().replace(rrnStr,rrnStr.toString().replace(/(-?)([1-8]{1})([0-9]{6})\b/gi,"$1$2******"));
 			}else {
 				rrnStr = originStr.match(/\d{13}/gi);
 				if(this.checkNull(rrnStr) == false){
 					strLength = rrnStr.toString().split('-').length;
 					maskingStr = originStr.toString().replace(rrnStr,rrnStr.toString().replace(/([0-9]{6})$/gi,"******"));
 				}else{
 					return originStr;
 				}
 			}
 			return maskingStr;
 		},
 		/*
 		* 이름 마스킹
 		* @param   : (이름)
 		*            ex1) 홍길동 → 홍길*
 		*            ex2) 윤빛가람 → 윤빛**
 		*            ex3) 차린 → 차*
 		* @returns : string
 		*/
 		name : function(str){
 			let originStr = str;
 			let maskingStr;
 			let strLength;

 			if(this.checkNull(originStr) == true){
 				return originStr;
 			}

 			strLength = originStr.length;

 			if(strLength < 3){
 				maskingStr = originStr.replace(/(?<=.{1})./gi, "*");
 			}else {
 				maskingStr = originStr.replace(/(?<=.{2})./gi, "*");
 			}

 			return maskingStr;
 		},
 		/*
 		* 사업자번호 마스킹(필요시)
 		* @param   : (사업자번호, 타입)
 		*            ex) type 0 인 경우 : 1234567890,0 → 123-45-*****
 		*                type 1 인 경우 : 1234567890,1 → 12345*****
 		*                없는 경우 : 1234567890 → 123-45-67890
 		* @returns : string
 		*/
 		bizNum : function(str, type){
 		    //if(checkBizNum(str)){
 				let formatNum = '';
 				if(str.length == 10) {
 				   if(type == 0) {
 						formatNum = str.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-*****');
 				   }else if(type == 1) {
 						formatNum = str.replace(/(\d{3})(\d{2})(\d{5})/, '$1$2*****');
 				   }else {
 						console.log("bbb:" + str);
 						formatNum = str.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
 				   }
 				}
 			//}else{
 			//	formatNum = "error";
 			//}
 			return formatNum;
 		},
 		/*
 		* 사업자번호 유효성
 		* @param   : (사업자번호)
 		*            ex) 정상인 경우(더존 사업자번호 1348108473) : 1348108473 → true,
 		*                비정상인 경우(test 사업자번호 1234567890) : 1234567890 → false
 		* @returns : boolean
 		*/
 		checkBizNum : function(number){
 			let numberMap = number.replace(/-/gi, '').split('').map(function (d){
 				return parseInt(d, 10);
 			});
 			if(numberMap.length == 10){
 				let keyArr = [1, 3, 7, 1, 3, 7, 1, 3, 5];
 				let chk = 0;

 				keyArr.forEach(function(d, i){
 					chk += d * numberMap[i];
 				});

 				chk += parseInt((keyArr[8] * numberMap[8])/ 10, 10);
 				console.log(chk);
 				return Math.floor(numberMap[9]) === ( (10 - (chk % 10) ) % 10);
 			}
 			return false;
 		}
 }

/**
* 브라우저 구분
* @param 없음
* @returns {string} 브라우저명
*/
function getClientInfo() {
	let agent = window.navigator.userAgent.toLowerCase();
	let browserName;
	switch (true) {
		case agent.indexOf("edge") > -1: 
			browserName = "MS Edge";
			break;
		case agent.indexOf("edg/") > -1: 
			browserName = "Edge (chromium based)"; // 크롬 기반 엣지
			break;
		case agent.indexOf("opr") > -1 && !!window.opr: 
			browserName = "Opera";
			break;
		case agent.indexOf("chrome") > -1 && !!window.chrome: 
			browserName = "Chrome";
			break;
		case agent.indexOf("trident") > -1: 
			browserName = "MS IE"; // 익스플로러
			break;
		case agent.indexOf("firefox") > -1: 
			browserName = "Mozilla Firefox";
			break;
		case agent.indexOf("safari") > -1: 
			browserName = "Safari";
			break;
		default: 
			browserName = "other";
	}
    return browserName;
}

/**
* 사용자 브라우저 체크
* @param 없음
* @returns {boolean} exolorer이면 false 아니면 true
*/
function checkBrowser(){
	let browserName=Utils.removeBlank(getClientInfo()).toUpperCase();
	if(browserName == "MSIE"){
		return false;
	}else{
		return true;
	}	
}

/**
* IE 브라우저 강제로 닫음
* @param 없음
* @returns
*/
function WinClose(){
    top.window.open('about:blank','_self').close(); 
    top.window.opener=self;
    top.self.close(); 
}

/**
* 비밀번호 관리정책 함수
* @param  비밀번호
*         정책1)숫자, 소문자, 대문자 1개이상, 6~20자리 이내
*         정책2)숫자, 특수문자 1개이상, 6~20자리 이내
*         정책3)숫자, 소문자, 대문자, 특수문자 1개이상, 6~20자리 이내
* @returns {boolean}
*/
function ValidPassword(pwd, pattern) {
    let pwPattern;
    if(pattern == 1) pwPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if(pattern == 2) pwPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/;
    if(pattern == 3) pwPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/;
    if (pwPattern.test(pwd)) {
        return true;
    } else {
        return false;
    }
}

/**
* setCookie
* @param cookie_name, value, days
* @returns
*/
function setCookie(cookie_name, value, days){
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + days);
	var cookie_value = escape(value) + ((days == null) ? '' : '; expires=' + exdate.toUTCString());
	document.cookie = cookie_name + '=' + cookie_value + '; path=/'
}

/**
* getCookie
* @param cookie_name
* @returns
*/
function getCookie(cookie_name){
	var x, y;
	var val = document.cookie.split(';');	
	for (var i = 0; i < val.length; i++) {
		x = val[i].substr(0, val[i].indexOf('='));
		y = val[i].substr(val[i].indexOf('=') + 1);
		x = x.replace(/^\s+|\s+$/g, '');
		if (x == cookie_name) {
			return unescape(y);
		}
	}
}

/**
* deleteCookie
* @param cookie_name
* @returns
*/
function deleteCookie(cookieName) {
//	var expireDate = new Date();
//	expireDate.setDate(expireDate.getDate() - 1);
//	document.cookie = cookieName + "= " + "; expires=" + expireDate.toUTCString();
	document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

/**
* 태넌트ID입력 후 Enter시 태넌트명 조회
* @param TenantId, 태넌트명을 세팅할 객체명
* @returns
*/
function GetTenantNm (strTenantId, objTenantNm, objTenantLvl){
	var GetTenantNm_data = {
			tenantId:strTenantId, 
			objName:objTenantNm,
			objLvl:objTenantLvl
	};	
	Utils.ajaxCall('/comm/COMM100SEL02', JSON.stringify(GetTenantNm_data), result_fnSetTenantNm); 
}

function result_fnSetTenantNm(data_GetTenantNm){
	var obj     = JSON.parse(JSON.stringify(data_GetTenantNm.result));
	var objName = JSON.stringify(data_GetTenantNm.ObjName);
	var objLvl = JSON.stringify(data_GetTenantNm.ObjLvl);
	try{
		if(Utils.isNull(obj)){
			$('input[name=' + objName +']').val('미등록 테넌트입니다');
			if(Utils.isNotNull(objLvl)){
				$('input[name=' + objLvl +']').val(' ');
			}
		}else{
			$('input[name=' + objName +']').val(JSON.parse(obj).fmnm);
			if(Utils.isNotNull(objLvl)){
				$('input[name=' + objLvl +']').val(JSON.parse(obj).orgLvlCd);
			}
		}
	}catch(e){
		console.log("bizComm exception : " + e);
	}		
}
