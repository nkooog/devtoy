/***********************************************************************************************
* Program Name : SMS 발송취소 - POP(SYSM432P.js)
* Creator      : sukim
* Create Date  : 2022.06.02
* Description  : SMS 발송취소 - POP
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.02     sukim            퍼블변경 및 수정
************************************************************************************************/

let param_tanentID = fnGetParameterByName('tanentid');
let param_regDt = fnGetParameterByName('regdt');
let param_schdNo = fnGetParameterByName('schdno');

$(document).ready(function () {
	
	SYSM431P_fnInitCombo();
	SYSM431P_fnSelectCombo();
	
	//저장 버튼
	$('#SYSM432P_btnSave').off("click").on("click", function () {
		let cancelRsnCd = $('input[name=SYSM432P_cboCancelRsn]').data("kendoComboBox").dataItem();
		if(cancelRsnCd.value === '' ){
			Utils.alert("취소 사유를 선택해주십시오.");
			return;
		}
		Utils.confirm("취소하시겠습니까?", function(){
			SYSM432P_fnSave();
		});
	});
});

//콤보 초기화
function SYSM431P_fnInitCombo(){
	$("#SYSM432P_cboCancelRsn").kendoComboBox({ 
		dataTextField: "text",
		dataValueField: "value",
		clearButton: false,
		height: 200
	}); 	
}

//콤보 data set
function SYSM431P_fnSelectCombo(){
	SYSM431P_fnInitCombo();
	let SYSM431P_data = { 
	"codeList": [
			{"mgntItemCd":"C0103"}
	]};
	Utils.ajaxCall('/comm/COMM100SEL01', JSON.stringify(SYSM431P_data), function (result) {
		let SYSM431P_cmmCodeList = JSON.parse(result.codeList);
		Utils.setKendoComboBox(SYSM431P_cmmCodeList, "C0103", "#SYSM432P_cboCancelRsn", "", ""); 
	});
}

//취소사유 저장
function SYSM432P_fnSave(){
	let cancelRsnCd = $('input[name=SYSM432P_cboCancelRsn]').data("kendoComboBox").dataItem();
	let SYSM432P_param = {
			"tenantId"		    : param_tanentID,
			"regDt"             : param_regDt,
			"schdNo"            : param_schdNo,   
			"canRsnCd"          : cancelRsnCd.value,
			"canRsnCtt"         : $('#SYSM432P_taCancelRsnCtt').val(),
			"lstCorprId"        : GLOBAL.session.user.usrId,
			"lstCorprOrgCd"     : GLOBAL.session.user.orgCd
	};
	console.log(JSON.stringify(SYSM432P_param));	
	Utils.ajaxCall('/sysm/SYSM432UPT01', JSON.stringify(SYSM432P_param), function (SYSM432P_rtn) {
		let SYSM432P_item = "";
		SYSM432P_item.resultCd = SYSM432P_rtn.result;
		SYSM432P_item.resultMsg = SYSM432P_rtn.msg;
		if(SYSM432P_rtn.result === 'F'){
			return Utils.alert(SYSM432P_rtn.msg);
		}else{
			Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM432P_item);
			self.close();			
		}
	});
}

//URL 파라미터 추출
function fnGetParameterByName(pname) {
	pname = pname.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	let regex = new RegExp("[\\?&]" + pname + "=([^&#]*)"),
	results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}