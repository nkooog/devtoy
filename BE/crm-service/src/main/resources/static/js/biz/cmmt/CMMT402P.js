/***********************************************************************************************
 * Program Name : 일정 미리보기 팝업(CMMT402P.js)
 * Creator      : 김보영
 * Create Date  : 2022.05.18
 * Description  : 일정 미리보기 팝업
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.18     김보영           최초 생성
 ************************************************************************************************/

$(document).ready(function () {

	let schdDvCdNm = CMMT402P_langMap.get('schdDvCdNm');
	let schdTypCdNm = CMMT402P_langMap.get('schdTypCdNm');
	let schdTite = decodeURIComponent(CMMT402P_langMap.get('schdTite'));
	let schdCtt = decodeURIComponent(CMMT402P_langMap.get('schdCtt'));
	let alrmStCdNm = CMMT402P_langMap.get('alrmStCdNm');
	let apndFileNm = CMMT402P_langMap.get('apndFileNm');
	let startTime = CMMT402P_langMap.get('start').replaceAll('%3A',':');
	let endTime = CMMT402P_langMap.get('end').replaceAll('%3A',':');

	$('#CMMT402P_start')[0].innerText = startTime.split(' ')[0]
	$('#CMMT402P_title')[0].innerText = schdDvCdNm

	$('#CMMT402P_subject')[0].innerText = schdTite
	$('#CMMT402P_schdTypCdNm')[0].innerText = schdTypCdNm
	$('#CMMT402P_startEnd')[0].innerText = startTime+" ~ "+endTime
	$('#CMMT402P_text')[0].innerText = schdCtt
	$('#CMMT402P_alrmStCdNm')[0].innerText = alrmStCdNm

	$('#CMMT402P_apndFileNm')[0].innerText = Utils.isNull(apndFileNm)?"":apndFileNm
	if(GLOBAL.session.user.usrId == CMMT402P_langMap.get('usrId')){
		$("#CMMT402P_btnSave").css("display", "block");
	}
	if("Y" == CMMT402P_langMap.get('alarmCheck')){
		$("#CMMT402P_btnAlarm").css("display", "block");
	}

})

function CMMT402P_Download() {

	let downFilePath = CMMT402P_langMap.get('apndFilePsn');
	let downFileName = CMMT402P_langMap.get('apndFileIdxNm');

	window.location.href = "/bcs/file/download?urlPath=" + downFilePath + "&fileName=" + downFileName;

}

function CMMT402P_body1_Popup() {

	let CMMT402P_body1_SchdNo = CMMT402P_langMap.get('schdNo');
	let CMMT402P_body1_RegYr = CMMT402P_langMap.get('regYr');

	Utils.getPopupCallback(CMMT402P_langMap.get('callbackKey1'))(CMMT402P_body1_SchdNo, CMMT402P_body1_RegYr);

}


function CMMT402P_setAlarm() {

	let CMMT402P_data = {
		tenantId    : GLOBAL.session.user.tenantId,
		schdNo      : CMMT402P_langMap.get('schdNo'),
		regYr       : CMMT402P_langMap.get('regYr'),
		usrId       : CMMT402P_langMap.get('usrId'),
		loginId     : GLOBAL.session.user.usrId,
		lstCorprOrgCd : GLOBAL.session.user.orgCd
	};

	let CMMT402P_jsonStr = JSON.stringify(CMMT402P_data);

	if(GLOBAL.session.user.usrId == CMMT402P_langMap.get('usrId')){
		CMMT402P_url = '/cmmt/CMMT400UPT01';
	}else{
		CMMT402P_url = '/cmmt/CMMT400UPT02';
	}

	Utils.closeKendoWindow(CMMT402P_langMap.get('id'))

	Utils.ajaxCall(CMMT402P_url, CMMT402P_jsonStr,Utils.getPopupCallback(CMMT402P_langMap.get('callbackKey2'))());
}

