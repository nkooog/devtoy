/***********************************************************************************************
 * Program Name : 비밀번호변경 - 팝업(FRME320P.js)
 * Creator      : nyh
 * Create Date  : 2025.01.20
 * Description  : 비밀번호변경 - 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2025.01.20     nyh            최초작성
 ************************************************************************************************/

$(document).ready(function () {
	$('#FRME320P_usrId').text(GLOBAL.session.user.usrId)
});

function FRME320P_savePwd(){
	let curScrt = $('#FRME320P_curScrtNo').val();
	let newScrt = $('#FRME320P_newScrtNo').val();
	let cfrmScrt = $('#FRME320P_cfrmScrtNo').val();

	if(Utils.isNull(curScrt)){
		Utils.alert(FRME320_map.get("FRME320P.alert.cur.pwd"));
		return;
	}
	if(curScrt == newScrt){
		Utils.alert(FRME320_map.get("FRME320P.alert.same.pwd"));
		return;
	}
	if(Utils.isNull(newScrt)){
		Utils.alert(FRME320_map.get("FRME320P.alert.new.pwd"));
		$('#FRME320P_newScrtNo').focus();
		return;
	}
	if(Utils.isNull(cfrmScrt)){
		Utils.alert(FRME320_map.get("FRME320P.alert.new.pwd2"));
		$('#FRME320P_cfrmScrtNo').focus();
		return;
	}
	if(!FRME320P_fnPasswordCheck(newScrt,1) || newScrt.length < 6){
		Utils.alert(FRME320_map.get("FRME320P.alert.pwd.guide"));
		return;
	}
	if(newScrt != cfrmScrt){
		Utils.alert(FRME320_map.get("FRME320P.alert.pwd.compare.fail"));
		return;
	}

	Utils.confirm(FRME320_map.get("common.save.msg"), function(){
		let FRME320P_JsonStr = {
				tenantId    : GLOBAL.session.user.tenantId,
				usrId		: GLOBAL.session.user.usrId,
				curPwd		: curScrt,
				newPwd		: newScrt
		};

		var FRME320P_insertJsonStr = JSON.stringify(FRME320P_JsonStr);
//		Utils.ajaxCall('/frme/FRME310UPT01', FRME320P_insertJsonStr, FRME320P_saveAfter, null, null, (response) => {
//			Utils.alert(response.responseJSON.message, null);
//		});
		Utils.ajaxCallFormData('/frme/FRME310UPT01',FRME320P_insertJsonStr, function(result){
			if("success" == result.result){
				Utils.alert(FRME320_map.get("FRME320P.alert.change.done"), function(){
					document.location.href = GLOBAL.contextPath + "/lgin/login";
				});
			} else {
				Utils.alert(result.msg);
			}
		});
	});
}

function FRME320P_saveAfter(data){
	let FRME320P_jsonEncode = JSON.stringify(data.result);

	if(FRME320P_jsonEncode == 0){
		Utils.alert("현재 비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
	}else if(FRME320P_jsonEncode == 1){
		Utils.alert("비밀번호가 변경되었습니다.<br/>안전한 사용을 위해 다시 로그인해 주세요.", function(){
			document.location.href = GLOBAL.contextPath + "/lgin/login";
		});
	}
}

function FRME320P_fnPasswordCheck(str) {
	let hasLetter = /[a-zA-Z]/.test(str);   // 영문자 확인
	let hasNumber = /[0-9]/.test(str);      // 숫자 확인
	let hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_-]/.test(str); // 특수문자 확인

	let returnBool = true;

	if(hasLetter == false || hasNumber == false || hasSpecialChar == false){
		returnBool = false;
	}

	return returnBool;
}