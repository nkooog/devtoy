/***********************************************************************************************
* Program Name : 사용자정보조회(사진, 출/퇴근 등록) - POP(FRME180P.js)
* Creator      : sukim
* Create Date  : 2022.05.09
* Description  : 사용자정보조회 - POP
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.09     sukim            최초생성
************************************************************************************************/
//근태체크 변수
var FRME180_ChkOnOff,FRME180_ChkJsonCount; 

//사진전송 폼정보
var formData = new FormData();

//업로드허용 이미지확장자
var regex    = new RegExp("(.*?)\.(jpg|JPG|gif|GIF|png|PNG)$");

//업로드허용 이미지최대용량
var sizeLimit= 20971520;

var FRME180P_imgData = "";

//특수문자확인
var specialPattern =  /[`~!@#$%^&*|\\\'\";:\/?]/gi;

//출근기준시간
var stardTimeVal, stardTimeOn, stardTimeOff;

//퇴근기준시간
var endTimeVal, endTimeOn, endTimeOff;


$(document).ready(function () {
	if(GLOBAL.session.user == ""){
		Utils.alert(FRME180_map.get("aicrm.noSession"));
		return;
	}
	fnReady();
});

function fnReady(){
	fnInitPopup();
	//사진 설정
	FRME180P_fnGetPoto();	
}

function fnInitPopup(){
	//Logout을 위한 hidden 설정
	$('#tenantId').val(GLOBAL.session.user.tenantId);
	$('#usrId').val(GLOBAL.session.user.usrId);
	$('#orgCd').val(GLOBAL.session.user.orgCd);
	$('#extNo').val(GLOBAL.session.user.extNo);
	$('#ipAddr').val(GLOBAL.session.user.ipAddr);

	document.getElementById('FRME180P_userInfo').innerHTML="";
	
	//성명(등급), 이메일 설정
	$("#FRME180P_userInfo").append("<li class='name'>" + GLOBAL.session.user.decUsrNm + "(" + GLOBAL.session.user.usrGrdNm +")" + "</li>");
	if(Utils.isNotNull(GLOBAL.session.user.decEmlAddrIsd)){
		$("#FRME180P_userInfo").append("<li class='email'>" + GLOBAL.session.user.decEmlAddrIsd + "@" + GLOBAL.session.user.emlAddrIsdDmn + "</li>");
	}else{
		if(Utils.isNotNull(GLOBAL.session.user.decEmlAddrIsd)){
			$("#FRME180P_userInfo").append("<li class='email'>" + GLOBAL.session.user.decEmlAddrExtn + "@" + GLOBAL.session.user.emlAddrExtnDmn + "</li>");
		}else{
			$("#FRME180P_userInfo").append("<li class='email'>email 정보없음</li>");
		}
	}
	//근태 체크
	FRME180P_fnCheckOnOff();
}

//아이디 저장
function FRME180P_fnGetIn(){
	FRME180_ChkOnOff = "on";
	FRME180P_fnCheckOnOff();
}

//내선번호 없음
function FRME180P_fnGetOffAt(){
	FRME180_ChkOnOff = "off";
	FRME180P_fnCheckOnOff();
}

//출근시간 등록여부 검사
function FRME180P_fnCheckOnOff(){
	let FRME180P_chkData = {
			"tenantId": GLOBAL.session.user.tenantId,
			"dgindDd" : FRME180P_fnGetCurDatetime(2),
			"usrId"   : GLOBAL.session.user.usrId
	};	
	Utils.ajaxCall('/frme/FRME180SEL01', JSON.stringify(FRME180P_chkData), FRME180P_fnChkOnOFFCallback); 
}

function FRME180P_fnChkOnOFFCallback(FRME180SEL01_data){

	FRME180_ChkJsonCount = JSON.parse(JSON.parse(JSON.stringify(FRME180SEL01_data.FRME180SEL01_result)));
	
	//미등록
	if(FRME180_ChkJsonCount == "0"){
		document.getElementById("FRME180P_getIn").innerHTML="0000-00-00 00:00:00";
		document.getElementById("FRME180P_getOffAt").innerHTML="0000-00-00 00:00:00";
	}
	//출근시간 조회	
	if(FRME180_ChkJsonCount == "1"){
		FRME180P_fnSearchOnOff("1");
	}
	//출.퇴근시간조회	
	if(FRME180_ChkJsonCount == "2"){
		FRME180P_fnSearchOnOff("2");
	}	

	FRME180P_fnSaveCheck();
	
	//출근등록
	if(FRME180_ChkJsonCount == "0" && FRME180_ChkOnOff == "on"){
		if(stardTimeVal == false) {
			Utils.alert("출근등록 가능시간이 아닙니다.(" + stardTimeOn.substr(0, 2) + ":"+stardTimeOn.substr(2, 4)+" ~ " + stardTimeOff.substr(0, 2) + ":"+stardTimeOff.substr(2, 4)+")");
			return;
		}else{	
			Utils.confirm(FRME180_map.get("FRME180P.checkIn"), function(){
				FRME180P_fnSaveOnOff("1");
			});	
		}
	}else if(FRME180_ChkJsonCount != "0" && FRME180_ChkOnOff == "on"){
		Utils.alert(FRME180_map.get("FRME180P.checkInComplete"));
		return;
		
	//퇴근등록	
	//}else if(FRME180_ChkJsonCount == "0" && FRME180_ChkOnOff == "off"){
	//	Utils.alert(FRME180_map.get("FRME180P.nocheckIn"));
	//	return;
	}else if((FRME180_ChkJsonCount == "0" || FRME180_ChkJsonCount == "1") && FRME180_ChkOnOff == "off"){
		if(endTimeVal == false) {
			Utils.alert("퇴근등록 가능시간이 아닙니다.(" + endTimeOn.substr(0, 2) + ":"+endTimeOn.substr(2, 4)+" ~ " + endTimeOff.substr(0, 2) + ":"+endTimeOff.substr(2, 4)+")");
			return;
		}else{
			Utils.confirm(FRME180_map.get("FRME180P.checkout"), function(){
				FRME180P_fnSaveOnOff("2");
			});					
		}	
	}else if(FRME180_ChkJsonCount == "2" && FRME180_ChkOnOff == "off"){
		Utils.alert(FRME180_map.get("FRME180P.checkoutComplete"));
		return;		
	} 
}

//태넌트 기준정보 조회
function FRME180P_fnSaveCheck(){
	var  FRME180P_sendData = { 
			tenantId : GLOBAL.session.user.tenantId
	};	
	Utils.ajaxCall('/lgin/LGIN000SEL09', JSON.stringify(FRME180P_sendData), function(FRME180P_bascRtn){
		let obj=JSON.parse(JSON.stringify(FRME180P_bascRtn.result));
		let jsonDecode = JSON.parse(obj);
		for(let i=0; i<jsonDecode.length; i++){
			//출근기준시간
			if(jsonDecode[i].bsVlMgntNo.toString() === '19'){
				stardTimeOn =jsonDecode[i].bsVl1;
                stardTimeOff =jsonDecode[i].bsVl2;
                var _currentHour = jsonDecode[i].currentHour;
                var _currentMin  = jsonDecode[i].currentMin;
                if(_currentHour.length == 1){
                	_currentHour = '0'+_currentHour;
                }
                if(_currentMin.length == 1){
                	_currentMin = '0'+_currentMin;
                }                
               	var currentTime = _currentHour  + _currentMin;
               	//console.log('=== 출근시간 currentTime : ' + currentTime);
				if(Number(currentTime) >= Number(jsonDecode[i].bsVl1) && (currentTime) <= (jsonDecode[i].bsVl2)){
					stardTimeVal = true;
					//console.log('=== 출근시간 true');
				}else{
					stardTimeVal = false;
					//console.log('=== 출근시간 false');
				}
			}
			//퇴근기준시간
			if(jsonDecode[i].bsVlMgntNo.toString() === '20'){
                endTimeOn =jsonDecode[i].bsVl1;
                endTimeOff =jsonDecode[i].bsVl2;
                var _currentHour = jsonDecode[i].currentHour;
                var _currentMin  = jsonDecode[i].currentMin;
                if(_currentHour.length == 1){
                	_currentHour = '0'+_currentHour;
                }
                if(_currentMin.length == 1){
                	_currentMin = '0'+_currentMin;
                }  
                var currentTime = _currentHour  + _currentMin;
                //console.log('=== 퇴근시간 currentTime : ' + currentTime);
				if(Number(currentTime) >= Number(jsonDecode[i].bsVl1) && (currentTime) <= (jsonDecode[i].bsVl2)){
					endTimeVal = true;
					//console.log('=== 퇴근시간 true');
				}else{
					endTimeVal = false;
					//console.log('=== 퇴근시간 false');
				}				
			}			
		}
	});		
}

//근태시간 등록
function FRME180P_fnSaveOnOff(param_onoff){
	let FRME180P_saveData = {
			"tenantId"  : GLOBAL.session.user.tenantId,
			"dgindDd"   : FRME180P_fnGetCurDatetime(2), //yyyymmdd
			"usrId"     : GLOBAL.session.user.usrId,
			"dgindDvCd" : param_onoff,                  //1: on, 2:off
			"dgindTm"   : FRME180P_fnGetCurDatetime(3), //hhmmss
			"regrId"    : GLOBAL.session.user.usrId,
			"regrOrgCd" : GLOBAL.session.user.orgCd
	};	
	Utils.ajaxCall('/frme/FRME180INS01', JSON.stringify(FRME180P_saveData), FRME180P_fnSaveOnOFFCallback); 
}

function FRME180P_fnSaveOnOFFCallback(FRME180INS01_data){
	
	let FRME180_SaveJsonDecode  = JSON.parse(JSON.stringify(FRME180INS01_data.FRME180INS01_result));
	let FRME180_commuteTime     = JSON.parse(JSON.stringify(FRME180INS01_data.FRME180INS01_getCommuteTime));
	//성공
	if(FRME180_SaveJsonDecode == "1"){
		if(FRME180_ChkOnOff == "on"){
			document.getElementById("FRME180P_getIn").innerHTML=FRME180_commuteTime;
		}else{
			document.getElementById("FRME180P_getOffAt").innerHTML=FRME180_commuteTime;
		}
		Utils.alert("정상적으로 저장하였습니다.");
	}else{
		if(FRME180_ChkOnOff == "on"){
			document.getElementById("FRME180P_getIn").innerHTML="0000-00-00 00:00:00";
		}else{
			document.getElementById("FRME180P_getOffAt").innerHTML="0000-00-00 00:00:00";
		}
		Utils.alert("저장시 오류가 발생하였습니다.");
	}
}

//근태시간 조회
function FRME180P_fnSearchOnOff(param_onoff){
	let FRME180P_searchData = {
			"tenantId"    : GLOBAL.session.user.tenantId,
			"dgindDd"     : FRME180P_fnGetCurDatetime(2),
			"usrId"       : GLOBAL.session.user.usrId,
			"dgindDvCd"   : param_onoff        //1: on, 2:off
	};	
	if(FRME180_ChkJsonCount == "1"){
		FRME180P_tran = '/frme/FRME180SEL02';  //출근시간조회
	}else{
		FRME180P_tran = '/frme/FRME180SEL03';  //출근+퇴근시간조회
	}	
	Utils.ajaxCall(FRME180P_tran, JSON.stringify(FRME180P_searchData), FRME180P_fnSearchCallback); 
}

function FRME180P_fnSearchCallback(FRME180SEL_data){
	let FRME180P_attendance, FRME180P_leavetheoffice;
	if(FRME180_ChkJsonCount == "1"){
		FRME180P_attendance = JSON.parse(JSON.stringify(FRME180SEL_data.FRME180SEL02_getCommuteTime));
	}else{
		FRME180P_attendance = JSON.parse(JSON.stringify(FRME180SEL_data.FRME180SEL03_getAttendance));
		FRME180P_leavetheoffice = JSON.parse(JSON.stringify(FRME180SEL_data.FRME180SEL03_getLeavetheoffice));
	}
	//출근 등록
	if(FRME180_ChkJsonCount == "1"){
		document.getElementById("FRME180P_getIn").innerHTML=FRME180P_attendance;
	//퇴근 등록	
	}else if(FRME180_ChkJsonCount == "2"){ 
		document.getElementById("FRME180P_getIn").innerHTML=FRME180P_attendance;
		document.getElementById("FRME180P_getOffAt").innerHTML=FRME180P_leavetheoffice;
	//미등록	
	}else{
		document.getElementById("FRME180P_getIn").innerHTML="0000-00-00 00:00:00";
		document.getElementById("FRME180P_getOffAt").innerHTML="0000-00-00 00:00:00";
	}	
}

//사진조회
function FRME180P_fnGetPoto(){
	if(Utils.isNotNull(GLOBAL.session.user.potoImgIdxFileNm)){
		$("div[name='FRME180P_img'] > img").attr({ src: GLOBAL.contextPath + "/photo/" +  GLOBAL.session.user.tenantId + "/" + GLOBAL.session.user.potoImgIdxFileNm});
		var img = document.querySelector('div[name="FRME180P_img"] > img');
		var url_ststus = fnUrlExists(img.src);
		if(url_ststus == 404 || url_ststus == '404'){
			$("div[name='FRME180P_img'] > img").attr({ src: GLOBAL.contextPath + "/images/contents/person.png" });
		}else{
			$("div[name='FRME180P_img'] > img").attr({ src: GLOBAL.contextPath + "/photo/" +  GLOBAL.session.user.tenantId + "/" + GLOBAL.session.user.potoImgIdxFileNm});
		}		
	}else{
		$("div[name='FRME180P_img'] > img").attr({ src: GLOBAL.contextPath + "/images/contents/person.png" });
	}
}

//사진등록
function FRME180P_fnPotoPreSave(){

	var tmp = $("#mtpPoto").val();
	if(tmp.length == 0){
		alert("사진을 선택하십시오.");
		return;
	}
	
	var inputFile = $("input[name='mtpPoto']");
	var files = inputFile[0].files;
	
	//formData 초기화(중복방지)
	if(Utils.isNull(formData.get("FRME180P_mtpPoto")) != true){
		formData.delete("FRME180P_mtpPoto");
	}
	
	for(var i=0; i<files.length; i++){
		formData.append("FRME180P_mtpPoto", files[i]);
		selectedFileName = files[i].name;
		selectedFileSize = files[i].size;
	}
	
	if(selectedFileName !==""){
		if(!regex.test(selectedFileName)){
			Utils.alert(FRME180_map.get("FRME180P.Imgfile"));
			return;
		}		
		if(specialPattern.test(selectedFileName)){
			Utils.alert(FRME180_map.get("FRME180P.rmSpecialchar"));
			return;
		}			
		if(Number(selectedFileSize) >= Number(sizeLimit)){
			Utils.alert(FRME180_map.get("FRME180P.imgfileSize") + " (" + selectedFileSize + ")");
			return;
		}
		Utils.confirm(FRME180_map.get("FRME180P.imgSave"), function(){
			var FRME180P_imgData = {
					"tenantId"         : GLOBAL.session.user.tenantId,
					"usrId"            : GLOBAL.session.user.usrId,
					"lstCorprOrgCd"    : GLOBAL.session.user.orgCd,
					"mlingCd"          : GLOBAL.session.user.mlingCd,
					"extNoUseYn"       : GLOBAL.session.user.extNoUseYn,
					"potoImgPsn"       : GLOBAL.session.user.potoImgPsn,   //기존 사진 제거를 위한 사진 위치
					"potoImgIdxFileNm" : GLOBAL.session.user.potoImgIdxFileNm //기존 사진 제거를 위한 사진 인덱스명
			};
			if(FRME180P_imgData.length == 0){
				Utils.alert("사진을 선택하십시오");
				return;
			}
			
			//formData 초기화(중복방지)
			if(Utils.isNull(formData.get("FRME180P_key")) != true){
				formData.delete("FRME180P_key");
			}
			
			console.log('FRME180P_key', JSON.stringify(FRME180P_imgData));
			formData.append('FRME180P_key', JSON.stringify(FRME180P_imgData));
			FRME180P_fnPotoSave();
		});			
	}
}

//사진 or 파일전송은 key- value 방식으로 전송해야 함
function FRME180P_fnPotoSave(){
    $.ajax({
    	url         : '/bcs/frme/FRME180INS02',
        type        : 'POST',
		enctype     : 'multipart/form-data',  //필수
		data        : formData,
		cache       : false,                  //필수
		contentType : false,                  //필수
		processData : false,                  //필수
		timeout     : 18000,                  //필수
        success     : FRME180P_fnPotoSaveCallback,
        error       : function(request,status, error){
        	alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    }) ;
}

function FRME180P_fnPotoSaveCallback(FRME180P_data){
	let jsonEncode = JSON.stringify(FRME180P_data.FRME180INS01_result);
	let jsonEncodeMsg = JSON.stringify(FRME180P_data.FRME180INS01_msg);
	
	//웹프레임 세션정보 반영
	Utils.getParent().MAINFRAME_SUB.updateSessionUser();
	
	fnInitPopup();
	
	Utils.alert(jsonEncodeMsg);

	FRME180P_fnGetPoto();

	// window.location.reload(); //현재페이지 새로고침
}

function FRME180P_fnLogout(){
	$('#tenantId').val(GLOBAL.session.user.tenantId);
	$('#usrId').val(GLOBAL.session.user.usrId);
	$('#orgCd').val(GLOBAL.session.user.orgCd);
	$('#extNo').val(GLOBAL.session.user.extNo);
	$('#ipAddr').val(GLOBAL.session.user.ipAddr);

	if($('#tenantId').val().length > 0 && $('#usrId').val().length > 0){
		Utils.confirm(LGIN000_map.get("common.logout.msg"), function(){
			let formSerializeArray = $('#FRME180P_form').serializeArray();
			let object = {};
			for (let i = 0; i < formSerializeArray.length; i++){
			    object[formSerializeArray[i]['name']] = formSerializeArray[i]['value'];
			}	
			Utils.ajaxCall('/lgin/LGIN000INS02', JSON.stringify(object), function(logout_rtn){
				Utils.getParent().Utils.closeAllPopup();
				let obj = JSON.parse(JSON.stringify(logout_rtn.result));
				if(obj == "0"){
					Utils.getParent().document.location.href = GLOBAL.contextPath + "/lgin/login";
				}else{
					console.log("message: " + JSON.parse(JSON.stringify(logout_rtn.msg)));
				}		
			}); 
		});			
	}else{
		Utils.alert("로그아웃에 실패하였습니다");
	}
}


function setThumbnail(event) {
	let reader = new FileReader();
	reader.onload = function(event) {
		$("div[name='FRME180P_img'] > img").attr({ src: event.target.result });
	};
	
	if(event.target.files[0].name !==""){
		if(!regex.test(event.target.files[0].name)){
			Utils.alert(FRME180_map.get("FRME180P.Imgfile"));
			return;
		}		
		if(event.target.files[0].size >= sizeLimit){
			return;
		}
		reader.readAsDataURL(event.target.files[0]);
	}
}

//현재 날자, 시.분.초 
function FRME180P_fnGetCurDatetime(flag){
	const now = new Date();
	console.dir(now);
	const year  = now.getFullYear();
	const month = now.getMonth()+1;
	const date = now.getDate();
	const hours = now.getHours();
	const minutes = now.getMinutes();
	const seconds = now.getSeconds();
	
	let mm= ""; let dd =""; let hh=""; let mi=""; let ss ="";
	
	if(month.toString().length === 1){
		mm = FRME180P_fnlpad(month.toString(), 2, "0");
	}else{
		mm = month.toString();
	}
	if(date.toString().length === 1){
		dd = FRME180P_fnlpad(date.toString(), 2, "0");
	}else{
		dd = date.toString();
	}
	if(hours.toString().length === 1){
		hh = FRME180P_fnlpad(hours.toString(), 2, "0");
	}else{
		hh = hours.toString();
	}
	if(minutes.toString().length === 1){
		mi = FRME180P_fnlpad(minutes.toString(), 2, "0");
	}else{
		mi = minutes.toString();
	}
	if(seconds.toString().length === 1){
		ss = FRME180P_fnlpad(seconds.toString(), 2, "0");
	}else{
		ss = seconds.toString();
	}	
	
	let FRME180P_rtnVal="";
	if(flag === 1){
		FRME180P_rtnVal = year+"-"+mm+"-"+dd+" "+hh+":"+mi+":"+ss;
	}else if(flag === 2){
		FRME180P_rtnVal = year+mm+dd;
	}else if(flag === 3){
		FRME180P_rtnVal = hh+mi+ss;
	}else if(flag === 4){
		FRME180P_rtnVal = year+mm+dd+hh+mi+ss;
	}else if(flag === 5){
		FRME180P_rtnVal = year+"-"+mm+"-"+dd;
	}else {
		FRME180P_rtnVal = hh+":"+mi+":"+ss;
    }	
	return FRME180P_rtnVal;
}

//lpad
function FRME180P_fnlpad(str, padLen, padStr) {
    if (padStr.length > padLen) {
        console.log(FRME180_map.get("FRME180P.errorPad"));
        return str;
    }
    str += "";
    padStr += "";
    while (str.length < padLen)
        str = padStr + str;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
}

//rpad
function FRME180P_fnrpad(str, padLen, padStr) {
    if (padStr.length > padLen) {
    	console.log(FRME180_map.get("FRME180P.errorPad"));
        return str + "";
    }
    str += "";
    padStr += "";
    while (str.length < padLen)
        str += padStr;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
}

//디폴트 사진 Set
function fnSetDefaultImage(){
	let html = "";
	let imgPath = GLOBAL.contextPath + "/images/contents/person.png";
	$("#SYSM210T_usrPicture").html(html);
	html += "<img style='width: 150px;height:150px;border: 1px solid white;border-radius: 50%;' src=" + imgPath +" >";
	$("#SYSM210T_usrPicture").html(html);		
}

//사진 URL 검증
function fnUrlExists(imgURL){
	console.log("imgURL : " + imgURL);
	//setTimeout(function() {
		const http = new XMLHttpRequest();
		http.open('HEAD', imgURL, false);           
		http.send(); 
		console.log("http.status : " + http.status);	
	//}, 500);
	return http.status;
}
