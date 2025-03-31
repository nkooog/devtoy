/***********************************************************************************************
 * Program Name : 비밀번호변경 - 팝업(FRME310P.js)
 * Creator      : sukim
 * Create Date  : 2022.08.25
 * Description  : 비밀번호변경 - 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.08.25     sukim            최초작성
 * 2022.08.25     bykim
 * 2025.02.12		sjyang			패스워드 단반향 암호화 적용
 ************************************************************************************************/

$(document).ready(function () {
	$('#FRME310P_usrId').text(GLOBAL.session.user.usrId)
});

function FRME310P() {
	let param = {
		callbackKey: "callback_FRME310P"
	};
	let callback_FRME310P = function (result) {
		console.info(result);
	}
	Utils.setCallbackFunction("callback_FRME310P", callback_FRME310P);
	Utils.openCsrfPop(GLOBAL.contextPath + "/frme/FRME310P", "FRME310P", 800, 290, param, true);
}

function FRME310P_savePwd(){
	let curScrt = $('#FRME310P_curScrtNo').val();
	let newScrt = $('#FRME310P_newScrtNo').val();
	let cfrmScrt = $('#FRME310P_cfrmScrtNo').val();
	
	if(Utils.isNull(curScrt)){
		Utils.alert(FRME310_map.get("FRME310P.alert.cur.pwd"));
		return;
	}
	if(curScrt == newScrt){
		Utils.alert(FRME310_map.get("FRME310P.alert.same.pwd"));
		return;
	}	
	if(Utils.isNull(newScrt)){
		Utils.alert(FRME310_map.get("FRME310P.alert.new.pwd"));
		return;
	}
	if(Utils.isNull(cfrmScrt)){
		Utils.alert(FRME310_map.get("FRME310P.alert.new.pwd2"));
		return;
	}
	if(!FRME310P_fnPasswordCheck(newScrt,1) || newScrt.length < 6){
		Utils.alert(FRME310_map.get("FRME310P.alert.pwd.guide"));
		return;
	}
	if(newScrt != cfrmScrt){
		Utils.alert(FRME310_map.get("FRME310P.alert.pwd.compare.fail"));
		return;
	}

	Utils.confirm(FRME310_map.get("common.save.msg"), function(){
		let FRME310P_JsonStr = {
			tenantId    : GLOBAL.session.user.tenantId,
			usrId		: GLOBAL.session.user.usrId,
			curPwd		: curScrt,
			newPwd		: newScrt
		};

		var FRME310P_insertJsonStr = JSON.stringify(FRME310P_JsonStr);		
		Utils.ajaxCallFormData('/frme/FRME310UPT01',FRME310P_insertJsonStr, function(result){
			if("success" == result.result){
				Utils.alert(result.msg, function(){
					self.close();
				});
			} else {
				Utils.alert(result.msg);
			}
		});
	});
}

function FRME310P_fnPasswordCheck(str) {
	let hasLetter = /[a-zA-Z]/.test(str);   // 영문자 확인
	let hasNumber = /[0-9]/.test(str);      // 숫자 확인
	let hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_-]/.test(str); // 특수문자 확인

	let returnBool = true;

	if(hasLetter == false || hasNumber == false || hasSpecialChar == false){
		returnBool = false;
	}

	return returnBool;

}
