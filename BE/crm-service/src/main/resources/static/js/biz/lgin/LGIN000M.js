/***********************************************************************************************
 * Program Name : 로그인(LGIN000M.js)
 * Creator      : sukim
 * Create Date  : 2022.02.04
 * Description  : 로그인
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.02.04     sukim            최초작성
 * 2022.03.21     sukim            다국어적용
 ************************************************************************************************/
var tryCount = 0;
var loginFlag = true;
var digit = /[0-9]/;
var korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

var xboxFlag = 0;

var beforeOprNotiNo = "";

var loginBlock = false;

$(document).ready(function(){

	// 검색 입력창 엔터처리
	document.querySelector("form[name='sendForm']").addEventListener('keypress', fn_EnterKeyPress);

	//IE browser 제한
	if(!checkBrowser()){
		Utils.alert(LGIN000_map.get("LGIN000M.error.browserIE") + "<br/><br/>"
			+ LGIN000_map.get("LGIN000M.info.winclose"));
		setTimeout("WinClose();", 2000);
	}

	//cookie 설정
	LGIN000_fngetCookie();

	$('#tenantId').one('focus', function(event) {
		uf_initItem();
	});

	$('#tenantId').blur(function(event) {
		let check = $('#tenantId').val().toUpperCase();
		if(check.length >= 3){
			$('#tenantId').val(check);
			uf_getMlingCd();
		}
	});

	//태넌트 체크
	let oldVal="";
	$("#tenantId").on("propertychange change keyup paste input blur", function() {
		let currentVal = $(this).val().toUpperCase();
		if(currentVal.length >=3){
			$('#tenantId').val(currentVal);
			if(currentVal == oldVal) {
				return;
			}else{
				oldVal = currentVal;
				uf_getMlingCd();
			}
		}
	});

	$("#scrtNo").on("click focus", function() {
		if($("#tenantId").val().length >= 3){
			// dsblNotiPop($("#tenantId").val() , 2)
		}
	});


	//사용자ID 대문자
	$('#usrId').blur(function(event) {
		let checkID = $('#usrId').val().toUpperCase();
		if(checkID.length >= 4){
			$('#usrId').val(checkID);
		}
	});

	$("#usrId").on("propertychange change keyup paste input blur", function() {
		let currentVal = $(this).val().toUpperCase();
		$('#usrId').val(currentVal);
	});

	// XBOX install 확인
	LGIN000_fnXboxInstallCheck();

	restrictInput("#tenantId", /^[a-zA-Z]*$/, /[^a-zA-Z]/g);

	// dsblNotiPop('' , 2)//tenantid = ''  전체 , notiDvCd = 2 로그인
});

fn_EnterKeyPress = (e) => {
	if (e.keyCode === 13) {
		fn_formSubmit();
	}
}

function fn_formSubmit(){
	let sendForm = $("form[name='sendForm']");

	this.LGIN000_fnchkCookie();

	$.ajax({
		contentType: 'application/json; charset=UTF-8',
		dataType: "json",
		url: sendForm.attr('action'),
		type:'POST',
		data :JSON.stringify(sendForm.serializeObject()),
		success : function(response) {
			if(response.status !== 201) {
				Utils.alert(response.message, null);
			}else{
				console.log(response);
				popupMain(response);
			}
		},
		error :function(response, status, error){
			Utils.alert(response.responseJSON.message, null);
		},
	});
}


$.fn.serializeObject = function(){
	var obj = {};
	var arr = this.serializeArray();
	arr.forEach(function(data){
		// 동일한 이름의 필드가 있을 경우 배열로 저장
		if (obj[data.name]) {
			if (!Array.isArray(obj[data.name])) {
				obj[data.name] = [obj[data.name]];
			}
			obj[data.name].push(data.value);
		} else {
			obj[data.name] = data.value;
		}
	});
	return obj;
};

function LGIN000_fnXboxInstallCheck(){
	//TODO: xbox 웹소켓 URL 변경될경우 변경 (통신대기시간 3초 timeout 시간변경)
	let checkXboxOpenBona1 = new WebSocket('ws://127.0.0.1:7777');
	let checkXboxOpenBona2 = new WebSocket('ws://127.0.0.1:7778');

	let xboxCheckTimeout = setTimeout(function() {
		checkXboxOpenBona1.close();
		checkXboxOpenBona2.close();
	}, 3000);

	checkXboxOpenBona1.onopen = function (e){
		clearTimeout(xboxCheckTimeout);
		if(checkXboxOpenBona1.readyState ===1){
			xboxFlag ++;
			checkXboxOpenBona1.close();
		}
	}
	checkXboxOpenBona2.onopen =function (e){
		clearTimeout(xboxCheckTimeout);
		if(checkXboxOpenBona2.readyState ===1){
			xboxFlag ++;
			checkXboxOpenBona2.close();
		}
	}

	let poupTimeout = setTimeout(function() {
		if(xboxFlag === 0){
			if($("#extNoUseYn").val()!=="N"){
				xboxFlag++;
				Utils.alert("<p style='font-size:14px;'>[ 필수 설치 프로그램 ]</p>" +
					"<br/><a href='https://exona.kr/etcFile/dotnetfx35.zip' style='font-size:14px;color:blue; text-decoration: underline;'>닷넷3.5 프레임워크</a>"+
					"<br/><a href='https://exona.kr/etcFile/dotNetFx40_Full_x86_x64.zip' style='font-size:14px;color:blue; text-decoration: underline;'>닷넷4.0 프레임워크</a>"+
					"<br/><a href='https://exona.kr/etcFile/vcredist_x86.exe' style='font-size:14px;color:blue; text-decoration: underline;'> Visual C++ 재배포 가능 패키지 32비트</a>" +
					"<br/><a href='https://exona.kr/etcFile/vcredist_x64.exe' style='font-size:14px;color:blue; text-decoration: underline;'> Visual C++ 재배포 가능 패키지 64비트</a>" +
					"<br/><a href='https://exona.kr/etcFile/vcredist_x86_Call.exe' style='font-size:14px;color:blue; text-decoration: underline;'> AgentClientActiveX4_Visual C++ 재배포</a>" +
					"<br/></br><a href='http://bonaoam.cloudcc.co.kr/BONAXBOX/BONA.XBOX.CLIENT.application' style='font-size:14px;color:blue; text-decoration: underline;'> BONA1 CLOUD 콜제어 모듈 설치하기</a>" +
					"</br><a href='https://exona.kr/BONAXBOX/BONA2.XBOX.CLIENT.application' style='font-size:14px;color:blue; text-decoration: underline;'> BONA2 CLOUD 콜제어 모듈 설치하기</a>");
			}
		}
	}, 3200);
}

function uf_initItem(){
	$('#usrId').val("");
	$('#scrtNo').val("");
	$('#mlingCd').val("");
}

function getValidation(valid) {
	if(valid) {
		return true;
	}else {
		return false;
	}
}

function uf_Validation(){
	uf_getMlingCd();
	if(getValidation((korean.test($("#tenantId").val())||digit.test($("#tenantId").val())))){
		Utils.alert(LGIN000_map.get("LGIN000M.error.alphabet"));
		return;
	}else if(getValidation($("#tenantId").val() == '')){
		Utils.alert(LGIN000_map.get("LGIN000M.form.tenantId") + LGIN000_map.get("common.required.msg"));
		return;
	}else if(getValidation($("#tenantId").val().length < 3 || $("#mlingCd").val() == '')){
		Utils.alert(LGIN000_map.get("LGIN000M.error.tenant.info"));
		return;
	}else if(getValidation(Utils.isNull($("#mlingCd").val()))){
		Utils.alert(LGIN000_map.get("LGIN000M.error.tenantId"));
		return;
	}else if(getValidation($("#usrId").val() == '')){
		Utils.alert(LGIN000_map.get("LGIN000M.form.usrId") + LGIN000_map.get("common.required.msg"));
		return;
	}else if(getValidation($("#scrtNo").val() == '')){
		Utils.alert(LGIN000_map.get("LGIN000M.form.scrtNo") + LGIN000_map.get("common.required.msg"));
		return;
	}else if(getValidation($("#scrtNo").val().length < 6 || $("#scrtNo").val().length > 20 )){
		Utils.alert(LGIN000_map.get("LGIN000M.error.passw.length"));
		return;
	}else{
		LGIN000_fnchkCookie();
		return true;
	}
}

function LGIN000_fngetCookie(){
	$("#tenantId").val(getCookie("aicrm.tenantId"));
	$("#mlingCd").val(getCookie("aicrm.mlingCd"));
	$("#usrId").val(getCookie("aicrm.usrId"));
	$("#extNoUseYn").val(getCookie("aicrm.extNoUseYn"));

	document.querySelector("#NoExtNo").checked = document.querySelector("#extNoUseYn").value === 'N' ? true : false;

	if($("#tenantId").val() == "" || $("#usrId").val() == ""){
		$("#IdSave").attr("checked", false);
		$("#IdSaveYn").val("N");
	}else{
		$("#IdSave").attr("checked", true);
		$("#IdSaveYn").val("Y");
	}
}

function fn_chkIdSave(e){
	if(e.target.checked)  {
		$("#IdSaveYn").val("Y");
	}else{
		$("#IdSaveYn").val("N");
	}
}

function fn_chkNoExtNo(e){
	if(e.target.checked)  { //사용안함
		$("#extNoUseYn").val("N");
	}else{
		$("#extNoUseYn").val("Y");
	}
}

function LGIN000_fnchkCookie(){
	if($("#IdSaveYn").val() == "Y"){
		setCookie("aicrm.tenantId"   , $('#tenantId').val().toUpperCase(), 1);
		setCookie("aicrm.mlingCd"    , $('#mlingCd').val(), 1);
		setCookie("aicrm.usrId"      , $('#usrId').val(), 1);
		setCookie("aicrm.extNoUseYn" , $("#extNoUseYn").val(), 1);
	}else{
		deleteCookie("aicrm.tenantId");
		deleteCookie("aicrm.mlingCd");
		deleteCookie("aicrm.usrId");
		deleteCookie("aicrm.extNoUseYn");
	}
	// LGIN000M_fnLogin();
}

function LGIN000M_fnLogin(){
	let formSerializeArray = $('#LGIN000M').serializeArray();
	let object = {};
	for (let i = 0; i < formSerializeArray.length; i++){
		object[formSerializeArray[i]['name']] = formSerializeArray[i]['value'];
	}
	if(formSerializeArray.length == 0){
		Utils.alert(LGIN000_map.get("LGIN000M.error.requiredInformation") + " \n\n " + LGIN000_map.get("LGIN000M.error.refreshRelogin"));
		return;
	}

	if(loginBlock && $("#scrtNo").val().length > 0){//장애공지로 로그인 블록일 경우 권한 800이상이면 로그인 가능

		$.ajax({
			url: GLOBAL.contextPath + '/lgin/LGIN000USRGRDCHECK',
			dataType: "json",
			contentType: 'application/json; charset=UTF-8',
			type:'POST',
			data : JSON.stringify(object),
			success : function(result) {
				var result = JSON.parse(data.result)
				if(result.usrGrd >= 800){
					loginAjaxCall(object);
				}else{
					Utils.alert(LGIN000_map.get("LGIN000M.error.loginBlock"));
					return;
				}
			},
			error :function(response, status, error){

			},
		});

	}else{// 장애공지로 로그인 블록이 아닐 경우 로그인 가능
		loginAjaxCall(object)
	}

	loginFlag = true;


}

function loginAjaxCall(object){
	$.ajax({
		url: GLOBAL.contextPath + '/lgin/LGIN000SEL01',
		//url: '/lgin/LGIN000SEL01',
		type:'post',
		dataType : 'json',
		contentType : 'application/json; charset=UTF-8',
		data : JSON.stringify(object),
		success : fn_loginCallback,
		error :function(request, status, error){
			if(status === 'error'){
				if(request.status === 0){
					Utils.alert(LGIN000_map.get("LGIN000M.error.timeoutCheckServer"));
					console.log(LGIN000_map.get("LGIN000M.error.timeoutCheckServer"));
				}else{
					Utils.alert(request.status + " " + status + " " + LGIN000_map.get("LGIN000M.error.checkServer"));
					console.log(request.status + " " + status + " " + LGIN000_map.get("LGIN000M.error.checkServer"));
				}
			}else{
				Utils.alert("login error : " + status + " ::: " + error);
				console.log("login error : " + status + " ::: " + error);
			}
		},
		timeout: 5000 //서버 응답 제한시간 5초
	});
}

function fn_loginCallback(loginRtn){
	let obj = JSON.parse(JSON.stringify(loginRtn.result));
	//console.log("message: " + JSON.parse(JSON.stringify(loginRtn.result)));
	//console.log("message: " + JSON.parse(JSON.stringify(loginRtn.msg)));
	//등록된 사용자인 경우
	if(obj === '0'){
		Utils.alert(JSON.parse(JSON.stringify(loginRtn.msg)));
		setTimeout(function() {
			popupMain();
			setTimeout("self.close();", 1000);
		}, 1000);
	}else if(obj === '1'){
		Utils.alert(JSON.parse(JSON.stringify(loginRtn.msg)));
	}else if(obj === '2'){
		Utils.alert(JSON.parse(JSON.stringify(loginRtn.msg)));
	}else if(obj === '3'){
		Utils.alert(JSON.parse(JSON.stringify(loginRtn.msg)));
	}else if(obj === '4'){
		Utils.alert(JSON.parse(JSON.stringify(loginRtn.msg)));
		//비밀번호 변경 팝업
		//changePwd();
	}else if(obj === '5' && tryCount > 0){
		Utils.alert(JSON.parse(JSON.stringify(loginRtn.msg)));
	}else if(obj === '9'){
		if(tryCount > 0){
			Utils.alert(JSON.parse(JSON.stringify(loginRtn.msg)));
		}
	}
	tryCount++;
}

function popupMain(){

	//full size
	var URL= GLOBAL.contextPath + '/main';
	var winTitle= /*[[#{info.system.title}]]*/ +' Ver 1.0.0.0';
	var width="1680";
	var height="1050";
	var winFullOpts='height=' + screen.availHeight + ',width=' + screen.availWidth +',scrollbars=no,resizable=yes,top=0,left=0,fullscreen=yes';
	//
	// //full size
	const mainpopup = window.open(URL, winTitle, winFullOpts);

	// 팝업이 성공적으로 열렸는지 확인
	if (mainpopup) {
		mainpopup.name = 'ispopup'; // 여기서 name 속성을 설정
		self.close();
	} else {
		console.log('팝업을 열 수 없습니다. 팝업 차단기 설정을 확인하세요.');
	}


}
function changePwd(){
	var popupX = (document.body.offsetWidth / 2) - (200 / 2);
	var popupY= (window.screen.height / 2) - (300 / 2);
	window.open('', 'changePwd', 'status=no, height=300, width=200, left='+ popupX + ', top='+ popupY);
}

function uf_logOut() {
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
}



function uf_getMlingCd(){
	var getMlingCd_data = {
		tenantId : $('#tenantId').val()
	};

	$.ajax({
		url: GLOBAL.contextPath + '/lgin/LGIN000SEL03',
		type:'POST',
		dataType: "json",
		contentType: 'application/json; charset=UTF-8',
		data : JSON.stringify(getMlingCd_data),
		success : function(result) {
			let obj = JSON.parse(JSON.stringify(result.result));
			$('#mlingCd').val(JSON.parse(obj).mlingCd);
			if($('#mlingCd').val() == ''){
				uf_initItem();
			}
		},
		error :function(response, status, error){

		},
	});
}



function dsblNotiPop(tenantId,notiDvCd){
	var param = {
		tenantId : tenantId,
		notiDvCd : notiDvCd
	}

	dsblNotiCookie = Utils.getCookieJsontoArr("dsblNoti");
	Utils.ajaxCall('/sysm/SYSM550SEL02', JSON.stringify(param), function(result){
		var list = JSON.parse(result.list)
		if(list.length > 0){
			var obj = list[0];
			console.log(obj)
			if(!Utils.inArray(dsblNotiCookie, obj.oprNotiNo)){
				if(beforeOprNotiNo != obj.oprNotiNo){
					if(obj.notiDvCd == "2"){  //로그인 시 제한
						loginBlock = true;
					}
					Utils.openKendoWindow_notRefresh("/cmmn/CMMN_DSBL_NOTI_POP.jsp", 700, 650, "center", "calc(50% - 600px)", 100, '', {noti_tite: obj.notiTite ,noti_ctt : obj.notiCtt ,noti_dv_nm : obj.notiDvNm ,noti_str_dtm : Utils.formatTimeTamp(obj.notiStrDtm) , noti_end_dtm : Utils.formatTimeTamp(obj.notiEndDtm) , oprNotiNo : obj.oprNotiNo});
					beforeOprNotiNo = obj.oprNotiNo;
				}
			}
		}
	});
};

// 값 정규화
function restrictInput(selector, regex1, regex2) {
	$(selector).on('input', function() {
		const input = $(this).val();
		if (!regex1.test(input)) {
			$(this).val(input.replace(regex2, ''));
		}
	});
}