/***********************************************************************************************
 * Program Name : 사용자기본정보 - Tab(SYSM210T.js)
 * Creator      : 허해민
 * Create Date  : 2022.01.25
 * Description  : 사용자기본정보 - Tab
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.01.25     허해민           최초작성   
 ************************************************************************************************/
var defaultImgPath = "/images/contents/person.png";
var idMinlen, idMaxlen;
var pwMinlen, pwMaxlen;
var SYSM210T_mode;
var dupCheck = false;
var SYSM210T_cmmCodeList;
var SYSM210T_cdList;

$(document).ready(function () {
	SYSM210T_mode = 'Old';
	SYSM210T_fnSetCombo();
	SYSM210T_fnKendoDatePicker();
	SYSM210T_fnBtnCtrl('init');
		
	$("#SYSM210T_tenantId").on("propertychange change keyup paste input blur", function() {
		let currentVal = $(this).val().toUpperCase();
		if(currentVal.length >=3){
			$('#SYSM210T_tenantId').val(currentVal);
			
			SYSM210T_fnSetCnslGrpCombo(currentVal);
		}
	});		
	
	//사용자ID 대문자
	$('#SYSM210T_usrId').blur(function(event) {
		let check = $('#SYSM210T_usrId').val().toUpperCase();
		if(check.length >= 4){
			$('#SYSM210T_usrId').val(check);
		}
    });	
	$("#SYSM210T_usrId").on("propertychange change keyup paste input blur", function() {
		let currentVal = $(this).val().toUpperCase();
		$('#SYSM210T_usrId').val(currentVal);
		if(currentVal.length >= 4){
			$('#SYSM210T_usrId').val(currentVal);
		}		
	});		
	
	//ID,PW 기준정보
	SYSM210T_fnSaveCheck();
	
});

//상담그룹 콤보
function SYSM210T_fnSetCnslGrpCombo(tenantId){
	let paramTenantId =  tenantId;
	if(Utils.isNull(tenantId) == true){
		paramTenantId = $('#SYSM200M input[name=SYSM200M_tenantId]').val();
	}
	
	let SYSM210T_data = {
		tenantId : paramTenantId
	}
	Utils.ajaxCall('/sysm/SYSM210SEL02', JSON.stringify(SYSM210T_data), function (result) {
		Utils.setKendoComboBoxCustom(result.cdList, "#SYSM210T_cnslGrpCd", "cnslGrpNm", "cnslGrpCd","",false);
		//console.log("cdList : " , result.cdList);
		SYSM210T_cdList =result.cdList;
		
	},false,false,false);
}

function SYSM210T_fnKendoDatePicker(){
	$("#SYSM210T_qualAcqsDd").kendoDatePicker({ value: new Date(), culture : "ko-KR", format : "yyyy-MM-dd"});
	$("#SYSM210T_qualLossDd").kendoDatePicker({value: new Date(), culture : "ko-KR", format : "yyyy-MM-dd"});
}

function SYSM210T_fnSetCombo(){
	let SYSM210T_data = { 
	"codeList": [
			{"mgntItemCd":"C0021"},
			{"mgntItemCd":"C0024"},
			{"mgntItemCd":"C0023"},
			{"mgntItemCd":"C0177"},
			{"mgntItemCd":"C0027"}					
		]
	};
	Utils.ajaxCall('/comm/COMM100SEL01', JSON.stringify(SYSM210T_data), function (result) {
		SYSM210T_cmmCodeList = JSON.parse(result.codeList); 
		Utils.setKendoComboBox(SYSM210T_cmmCodeList, "C0023", "#SYSM210T_cntyCd", "", SYSM210T_langMap.get("input.cSelect")); 
		Utils.setKendoComboBox(SYSM210T_cmmCodeList, "C0177", "#SYSM210T_emlAddrIsdDmnCd", "", SYSM210T_langMap.get("input.cSelect")); 
		Utils.setKendoComboBox(SYSM210T_cmmCodeList, "C0177", "#SYSM210T_emlAddrExtnDmnCd", "", SYSM210T_langMap.get("input.cSelect")); 
		Utils.setKendoComboBox(SYSM210T_cmmCodeList, "C0027", "#SYSM210T_athtLvlOrgCd", "", SYSM210T_langMap.get("input.cSelect")); 
		Utils.setKendoComboBox(SYSM210T_cmmCodeList, "C0027", "#SYSM210T_athtLvlDtCd", "", SYSM210T_langMap.get("input.cSelect")); 
		Utils.setKendoComboBox(SYSM210T_cmmCodeList, "C0021", "#SYSM210T_acStCd", "", ""); 
		
		//사용자등급 예외처리
		let cdList = [];
		let originUsrGrd = GLOBAL.session.user.originUsrGrd;
		if (originUsrGrd < '900') {
			SYSM210T_cmmCodeList.filter(function(code) {
				if (code.mgntItemCd == "C0024") {
					if (originUsrGrd < '900'
							&& code.comCd <= originUsrGrd) {
						cdList.push(code);
					}
				}
			});
		} else {
			cdList = SYSM210T_cmmCodeList;
		}
		Utils.setKendoComboBox(cdList, "C0024", "#SYSM210T_usrGrd", "", SYSM210T_langMap.get("input.cSelect"));
		

		var SYSM210T_emlAddrIsdDmnCd = $("#SYSM210T_emlAddrIsdDmnCd").data("kendoComboBox");
		SYSM210T_emlAddrIsdDmnCd.bind("change", fnEmlAddrIsdDmnCd_onChange);
		
		var SYSM210T_emlAddrExtnDmnCd = $("#SYSM210T_emlAddrExtnDmnCd").data("kendoComboBox");
		SYSM210T_emlAddrExtnDmnCd.bind("change", fnEmlAddrExtnDmnCd_onChange);
	});
}

function  SYSM210T_fnSetComcd( SYSM210T_cmmCd, SYSM210T_cmmType){
	for (let i = 0; i < SYSM210T_cmmCodeList.length; i++) {
		if(SYSM210T_cmmCodeList[i].mgntItemCd == SYSM210T_cmmType && SYSM210T_cmmCodeList[i].comCd == SYSM210T_cmmCd){
			return SYSM210T_cmmCodeList[i].comCdNm
		}
	}
	return SYSM210T_cmmCd;
}

function fnEmlAddrIsdDmnCd_onChange(){
	var EmlAddrIsdDmnCd = $('#SYSM210T_emlAddrIsdDmnCd').val();
	console.log($('#SYSM210T_emlAddrIsdDmnCd'))
	if(EmlAddrIsdDmnCd.length == 0) {
		$('#SYSM210T input[name=SYSM210T_emlAddrIsd]').val("");	
		$('#SYSM210T input[name=SYSM210T_emlAddrIsdDmn]').val("");
	}
	if(EmlAddrIsdDmnCd == "100") {
		$('#SYSM210T input[name=SYSM210T_emlAddrIsdDmn]').prop('disabled', false);  //disabled -> unlock
		$('#SYSM210T input[name=SYSM210T_emlAddrIsdDmn]').val("");
	}else{
		$('#SYSM210T input[name=SYSM210T_emlAddrIsdDmn]').prop('disabled', true); //disabled -> lock
		let cmmCdNm = SYSM210T_fnSetComcd(EmlAddrIsdDmnCd, "C0177");
		//$('#SYSM210T input[name=SYSM210T_emlAddrIsdDmn]').val(cmmCdNm);
	}
}

function fnEmlAddrExtnDmnCd_onChange(){
	var EmlAddrExtnDmnCd = $('#SYSM210T_emlAddrExtnDmnCd').val();
	if(EmlAddrExtnDmnCd.length == 0) {
		$('#SYSM210T input[name=SYSM210T_emlAddrExtn]').val("");	
		$('#SYSM210T input[name=SYSM210T_emlAddrExtnDmn]').val("");		
	}
	if(EmlAddrExtnDmnCd == "100" || EmlAddrExtnDmnCd.length == 0) {
		$('#SYSM210T input[name=SYSM210T_emlAddrExtnDmn]').prop('disabled', false);
		$('#SYSM210T input[name=SYSM210T_emlAddrExtn]').val("");
		$('#SYSM210T input[name=SYSM210T_emlAddrExtnDmn]').val("");
	}else{
		$('#SYSM210T input[name=SYSM210T_emlAddrExtnDmn]').prop('disabled', true);
		let cmmCdNm = SYSM210T_fnSetComcd(EmlAddrExtnDmnCd, "C0177");
		//$('#SYSM210T input[name=SYSM210T_emlAddrExtnDmn]').val(cmmCdNm);
	}
}

function SYSM210T_fnInitForm(){
	$('#SYSM210T input[name=SYSM210T_usrId]').val("");
	$('#SYSM210T input[name=SYSM210T_usrId]').prop('disabled', false);
	$('#SYSM210T input[name=SYSM210T_tenantId]').val("");
	$('#SYSM210T input[name=SYSM210T_tenantId]').prop('disabled', false);
	
	$('#SYSM210T input[name=SYSM210T_scrtNo]').val("111111");
	$('#SYSM210T input[name=SYSM210T_scrtNo]').prop('disabled', true);
	if(SYSM210T_mode == 'New'){
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.passWd")); 
	}else{
		$('#SYSM210T_validMsg').text(''); 
	}
	
	SYSM210T_fnSetCnslGrpCombo($("#SYSM200M_tenantId").val());			//2023.01.18 상담그룹 추가
	
	$('#SYSM210T input[name=SYSM210T_acStCd]').data("kendoComboBox").value("1");
	$('#SYSM210T input[name=SYSM210T_lastChangeDate]').val(""); //비번변경일자
	$('#SYSM210T input[name=SYSM210T_scrtNoOverDays]').val(""); //비번변경일수
	$('#SYSM210T input[name=SYSM210T_pwErrTcnt]').val("");      //비번오류횟수 
	$('#SYSM210T input[name=SYSM210T_usrNm]').val("");	
	$('#SYSM210T input[name=SYSM210T_usrAlnm]').val("");        //별칭
	$('#SYSM210T input[name=SYSM210T_usrAlnm]').prop('disabled', true);  //별칭
	$('#SYSM210T input[name=SYSM210T_usrAlnmUseYn]').prop('checked', false); //별칭체크
	$('#SYSM210T input[name=SYSM210T_orgCd]').val("");
	$('#SYSM210T input[name=SYSM210T_orgPath]').val("");
	$('#SYSM210T input[name=SYSM210T_usrGrd]').data("kendoComboBox").value("");
	$('#SYSM210T input[name=SYSM210T_cntyCd]').data("kendoComboBox").value(GLOBAL.session.user.cntyCd);
	$('#SYSM210T input[name=SYSM210T_mbphNo]').val("");
	$('#SYSM210T_qualAcqsDd').val(kendo.format("{0:yyyy-MM-dd}",new Date()));
	$('#SYSM210T_qualLossDd').val(kendo.format("{0:yyyy-MM-dd}",kendo.date.addDays(new Date(), 365 * 10)));	
	$('#SYSM210T input[name=SYSM210T_emlAddrIsd]').val("");
	$('#SYSM210T input[name=SYSM210T_emlAddrIsd]').prop('disabled', false);
	$('#SYSM210T input[name=SYSM210T_emlAddrIsdDmn]').val("");
	$('#SYSM210T input[name=SYSM210T_emlAddrIsdDmn]').prop('disabled', true);
	$('#SYSM210T input[name=SYSM210T_emlAddrIsdDmnCd]').data("kendoComboBox").value("");
	$('#SYSM210T input[name=SYSM210T_emlAddrExtn]').val("");
	$('#SYSM210T input[name=SYSM210T_emlAddrExtn]').prop('disabled', false);
	$('#SYSM210T input[name=SYSM210T_emlAddrExtnDmn]').val("");
	$('#SYSM210T input[name=SYSM210T_emlAddrExtnDmn]').prop('disabled', true);
	$('#SYSM210T input[name=SYSM210T_emlAddrExtnDmnCd]').data("kendoComboBox").value("");
	$('#SYSM210T input[name=SYSM210T_ctiUseYn]').prop('checked', false);
	$('#SYSM210T input[name=SYSM210T_ctiAgenId]').val("");	
	$('#SYSM210T input[name=SYSM210T_ctiAgenId]').prop('disabled', true);
	$('#SYSM210T input[name=SYSM210T_useTermIpAddr]').val("");	
	$('#SYSM210T input[name=SYSM210T_useTermIpAddr]').prop('disabled', true);
	$('#SYSM210T input[name=SYSM210T_extNo]').val("");
	$('#SYSM210T input[name=SYSM210T_extNo]').prop('disabled', true);
	$('#SYSM210T input[name=SYSM210T_kldCtgrCreAtht]').prop('checked',false);
	$('#SYSM210T input[name=SYSM210T_unfyBlbdCreAthtYn]').prop('checked',false);
	$('#SYSM210T input[name=SYSM210T_athtLvlOrgCd]').data("kendoComboBox").value("");
	$('#SYSM210T input[name=SYSM210T_athtLvlDtCd]').data("kendoComboBox").value("");
	$('#SYSM210T input[name=SYSM210T_kldScwdSaveYn]').prop('checked', false);
	$('#SYSM210T input[name=SYSM210T_autoPfcnUseYn]').prop('checked', false);
	$('#SYSM210T input[name=SYSM210T_cmmtSetlmnYn]').prop('checked', false);
	$('#SYSM210T input[name=SYSM210T_kldMgntSetlmnYn]').prop('checked', false);
	$("#usrImg").attr({ src: GLOBAL.contextPath + defaultImgPath});
}

$('#SYSM210T button[name=SYSM210T_btnNew]').on('click', function SYSM210T_fnSetInit() {
	dupCheck = false;
	SYSM210T_mode = "New";
	SYSM210T_fnInitForm();
	SYSM210T_fnBtnCtrl('new');
	SYSM210T_fnRemoveInputError();
	$('#SYSM210T input[name=SYSM210T_tenantId]').val($('#SYSM200M input[name=SYSM200M_tenantId]').val());
	$('#SYSM210T input[name=SYSM210T_usrId]').focus();	
	
	//kw---20250314 : 사용자관리 수정
	//kw---20250314 : 신규 버튼 클릭 시 사용자정보 목록 초기화
	grdSYSM200M.clearSelection();
});

$('#SYSM210T button[name=SYSM210T_btnSave]').off("click").on('click', function () {
	SYSM210T_fnSave();
});

function SYSM210T_fnSaveCheck(){
	var  SYSM210T_sendData = { 
			tenantId : $('#SYSM200M input[name=SYSM200M_tenantId]').val() 
	};	
	Utils.ajaxCall('/lgin/LGIN000SEL09', JSON.stringify(SYSM210T_sendData), function(SYSM210T_bascRtn){
		let obj=JSON.parse(JSON.stringify(SYSM210T_bascRtn.result));
		let jsonDecode = JSON.parse(obj);
		for(let i=0; i<jsonDecode.length; i++){
			//ID 자리수
			if(jsonDecode[i].bsVlMgntNo.toString() === '1'){
				idMinlen =jsonDecode[i].bsVl1;
				idMaxlen =jsonDecode[i].bsVl2;
				//console.log('=== idMinlen : ' +idMinlen + ", idMaxlen : " + idMaxlen);
			}
			//비번자리수
			if(jsonDecode[i].bsVlMgntNo.toString() === '2'){
				pwMinlen =jsonDecode[i].bsVl1;
				pwMaxlen =jsonDecode[i].bsVl2;
				//console.log('=== pwMinlen : ' +pwMinlen + ", pwMaxlen : " + pwMaxlen);
			}	
		}
	});		
}

function SYSM210T_fnSave(){
	
	let SYSM210T_regex = /[^0-9]/g;	
	let SYSM210T_dateReg = /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/;
	let digit     = /^[0-9]+$/;             // 숫자   
	let korean    = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;  // 한글
	let regexptp1 = /^[A-Za-z0-9]{6,20}$/;  // 숫자,영문
	let regexptp2 = /[0-9a-zA-Z.;\-]/;      // 숫자,영문, 특수문자
	
	let SYSM210T_usrId  			 = $('#SYSM210T input[name=SYSM210T_usrId]').val();							
	let SYSM210T_tenantId  			 = $('#SYSM210T input[name=SYSM210T_tenantId]').val().toUpperCase();
	let SYSM210T_cnslGrpCd 			 = $('#SYSM210T input[name=SYSM210T_cnslGrpCd]').val();
	let SYSM210T_scrtNo 			 = $('#SYSM210T input[name=SYSM210T_scrtNo]').val();									
	let SYSM210T_usrNm  			 = $('#SYSM210T input[name=SYSM210T_usrNm]').val();
	let SYSM210T_usrAlnmUseYn  		 = $('#SYSM210T input[name=SYSM210T_usrAlnmUseYn]').is(":checked") == true ?  "Y": "N";	
	let SYSM210T_acStCd              = $('#SYSM210T input[name=SYSM210T_acStCd]').val();
	let SYSM210T_usrAlnm  			 = $('#SYSM210T input[name=SYSM210T_usrAlnm]').val();							
	let SYSM210T_orgCd  			 = $('#SYSM210T input[name=SYSM210T_orgCd]').val();	
	let SYSM210T_orgPath  			 = $('#SYSM210T input[name=SYSM210T_orgPath]').val();
	let SYSM210T_usrGrd 			 = $('#SYSM210T input[name=SYSM210T_usrGrd]').val();
	let SYSM210T_qualAcqsDd  		 = $('#SYSM210T input[name=SYSM210T_qualAcqsDd]').val().replace(SYSM210T_regex, "");	
	let SYSM210T_qualLossDd  		 = $('#SYSM210T input[name=SYSM210T_qualLossDd]').val().replace(SYSM210T_regex, "");	
	let SYSM210T_cntyCd   			 = $('#SYSM210T input[name=SYSM210T_cntyCd]').val();
	let SYSM210T_mbphNo  			 = $('#SYSM210T input[name=SYSM210T_mbphNo]').val();	
	let SYSM210T_emlAddrIsd  		 = $('#SYSM210T input[name=SYSM210T_emlAddrIsd]').val();					
	let SYSM210T_emlAddrIsdDmn  	 = $('#SYSM210T input[name=SYSM210T_emlAddrIsdDmn]').val();						
	let SYSM210T_emlAddrIsdDmnCd 	 = $('#SYSM210T input[name=SYSM210T_emlAddrIsdDmnCd]').val();
	let SYSM210T_emlAddrIsdDmnCdTxt  = $('#SYSM210T input[name=SYSM210T_emlAddrIsdDmnCd]').data("kendoComboBox").text();
	let SYSM210T_emlAddrExtn  		 = $('#SYSM210T input[name=SYSM210T_emlAddrExtn]').val();						
	let SYSM210T_emlAddrExtnDmn  	 = $('#SYSM210T input[name=SYSM210T_emlAddrExtnDmn]').val();						
	let SYSM210T_emlAddrExtnDmnCd 	 = $('#SYSM210T input[name=SYSM210T_emlAddrExtnDmnCd]').val();
	let SYSM210T_emlAddrExtnDmnCdTxt = $('#SYSM210T input[name=SYSM210T_emlAddrExtnDmnCd]').data("kendoComboBox").text();
	let SYSM210T_ctiUseYn  			 = $('#SYSM210T input[name=SYSM210T_ctiUseYn]').is(":checked") == true ?  "Y": "N";	
	let SYSM210T_ctiAgenId 			 = $('#SYSM210T input[name=SYSM210T_ctiAgenId]').val();							
	let SYSM210T_useTermIpAddr 		 = $('#SYSM210T input[name=SYSM210T_useTermIpAddr]').val();						
	let SYSM210T_extNo 				 = $('#SYSM210T input[name=SYSM210T_extNo]').val();	
	let SYSM210T_athtLvlOrgCd 		 = $('#SYSM210T input[name=SYSM210T_athtLvlOrgCd]').val();	
	let SYSM210T_athtLvlDtCd 		 = $('#SYSM210T input[name=SYSM210T_athtLvlDtCd]').val();	
	let SYSM210T_kldCtgrCreAtht  	 = $('#SYSM210T input[name=SYSM210T_kldCtgrCreAtht]').is(":checked") == true ?  "Y": "N";	
	let SYSM210T_unfyBlbdCreAthtYn   = $('#SYSM210T input[name=SYSM210T_unfyBlbdCreAthtYn]').is(":checked") == true ?  "Y": "N";
	let SYSM210T_kldScwdSaveYn  	 = $('#SYSM210T input[name=SYSM210T_kldScwdSaveYn]').is(":checked") == true ?  "Y": "N";
	let SYSM210T_autoPfcnUseYn  	 = $('#SYSM210T input[name=SYSM210T_autoPfcnUseYn]').is(":checked") == true ?  "Y": "N";
	let SYSM210T_cmmtSetlmnYn  	     = $('#SYSM210T input[name=SYSM210T_cmmtSetlmnYn]').is(":checked") == true ?  "Y": "N";
	let SYSM210T_kldMgntSetlmnYn  	 = $('#SYSM210T input[name=SYSM210T_kldMgntSetlmnYn]').is(":checked") == true ?  "Y": "N";
	
	Utils.markingRequiredField();
	
	if(SYSM210T_mode === 'New' && dupCheck === false){
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.dupUsrId")); 
		$('#SYSM210T button[name=btn_idCheck]').focus();
		return;
	}	
	

	var usrIdLen = SYSM210T_usrId.length;
	if(usrIdLen == 0){
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.userId.enter")); 
		return;
	}
	if(Number(usrIdLen) < Number(idMinlen) || Number(usrIdLen) > Number(idMaxlen)){
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.permitUsrID") + idMinlen + "~" + idMaxlen + ")"); 
		return;
	}
	if(SYSM210T_cnslGrpCd == ""){
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.cnslGrpCd")); 
		return;
	}
	if(SYSM210T_mode === 'New'){
	
		var usrPwLen = SYSM210T_scrtNo.length;
		if(usrPwLen == 0){
			$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.password.enter")); 
			return;
		}
		if(Number(usrPwLen) < Number(pwMinlen) || Number(usrPwLen) > Number(pwMaxlen)){
			$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.permitPw") + idMinlen + "~" + idMaxlen + ")"); 
			return;
		}
		if(regexptp2.test(SYSM210T_scrtNo) == false){
			$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.permitCombine") + pwMinlen + " ~ " + pwMaxlen + ")");
			return;		
		}
	}
	if(SYSM210T_usrNm.length == 0){
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.userName.enter"));
		return;
	}
	if(SYSM210T_tenantId.length == 0){
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.collectTenantId"));
		return;		
	}
	if((korean.test(SYSM210T_tenantId)||digit.test(SYSM210T_tenantId))){
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.collect3Digit"));
		return;	
	}
	if(SYSM210T_tenantId.length < 3){	
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.collect3Digit"));
		return;
	}
	if(SYSM210T_orgCd.length == 0){
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.org.choose"));
		return;
	}
	//2024.03.06 빠저 있는 사용자 등급 체크 추가
	if(SYSM210T_usrGrd.length == 0){
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.userlevel.select"));
		return;
	}
	if(SYSM210T_cntyCd.length == 0){
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.countryPhoneNumber.select"));
		return;
	}
	if(SYSM210T_mbphNo.length == 0){
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.mobilephoneNumber.enter"));
		return;
	}
	if(digit.test(SYSM210T_mbphNo) == false){
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.cellPhone"));
		return;
	}	
	if(SYSM210T_qualAcqsDd.length == 0){
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.qualification.enter"));
		return;
	}else{
		if( !SYSM210T_dateReg.test(SYSM210T_qualAcqsDd)){
			$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.qualification.dateFormat"));
			return;
		}
	}
	if(SYSM210T_qualLossDd.length == 0){
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.disqualification.enter"));
		return;
	}else{
		if(!SYSM210T_dateReg.test(SYSM210T_qualLossDd)){
			$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.disqualification.dateFormat"));
			return;
		}
	}
	if(SYSM210T_emlAddrIsdDmnCd.length == 0){
		SYSM210T_emlAddrIsd = "";
		SYSM210T_emlAddrIsdDmn = "";
		SYSM210T_emlAddrIsdDmnCd = "";
	}else if(SYSM210T_emlAddrIsdDmnCd == "100"){
		if(!SYSM210T_emlAddrIsd){ 
			$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.collectIntEmailID"));
			$('#SYSM210T input[name=SYSM210T_emlAddrIsd]').focus();
			return;			
		}
		if(SYSM210T_emlAddrIsdDmn.length == 0){ 
			$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.collectIntDomain"));
			$('#SYSM210T input[name=SYSM210T_emlAddrIsdDmn]').focus();
			return;			
		}		
	}else{		
		if(SYSM210T_emlAddrIsd.length == 0){
			$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.collectIntEmailID"));
			return;				
		}else{
			SYSM210T_emlAddrIsdDmn = SYSM210T_emlAddrIsdDmnCdTxt;
		}
	}
	if(SYSM210T_emlAddrExtnDmnCd.length == 0){
		SYSM210T_emlAddrExtn = "";
		SYSM210T_emlAddrExtnDmn = "";
		SYSM210T_emlAddrExtnDmnCd = "";
	}else if(SYSM210T_emlAddrExtnDmnCd == "100"){ 
		if(SYSM210T_emlAddrExtn.length == 0){ 
			$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.collectExtEmailID"));
			$('#SYSM210T input[name=SYSM210T_emlAddrExtn]').focus();
			return;			
		}
		if(SYSM210T_emlAddrExtnDmn.length == 0){ 
			$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.collectExtDomain"));
			$('#SYSM210T input[name=SYSM210T_emlAddrExtnDmn]').focus();
			return;			
		}		
	}else{
		if(SYSM210T_emlAddrExtn.length == 0){
			$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.collectExtEmailID"));
			return;				
		}else{
			SYSM210T_emlAddrExtnDmn = SYSM210T_emlAddrExtnDmnCdTxt;
		}
	}	
	if(SYSM210T_ctiUseYn.length == 0){
		$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.ctiUseYn"));
		return;				
	}
	if(korean.test(SYSM210T_ctiUseYn)){
		//console.log("SYSM210T_ctiUseYn:"+SYSM210T_ctiUseYn);
		return;
	}	
	if(SYSM210T_ctiUseYn == 'N'){
		SYSM210T_ctiAgenId 		= "";							
		SYSM210T_useTermIpAddr 	= "";						
		SYSM210T_extNo 			= "";		
	}
	if(SYSM210T_ctiUseYn == 'Y'){
		if(!SYSM210T_ctiAgenId){
			$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.ctiId"));
			return;				
		}
		/*
		if(SYSM210T_useTermIpAddr.length == 0){
			$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.ipAddr"));
			return;				
		}
		*/
		if(SYSM210T_extNo.length == 0){
			$('#SYSM210T_validMsg').text(SYSM210T_langMap.get("SYSM210T.alert.extNumber"));
			return;				
		}		
	}
	
	let SYSM210T_saveData = {
							usrId 				: SYSM210T_usrId,
							tenantId 			: SYSM210T_tenantId,
							cnslGrpCd 			: SYSM210T_cnslGrpCd,
							scrtNo 				: SYSM210T_scrtNo,
							usrNm 				: SYSM210T_usrNm,
							usrAlnm 			: SYSM210T_usrAlnm,
							usrAlnmUseYn		: SYSM210T_usrAlnmUseYn,
							acStCd              : SYSM210T_acStCd,
							orgCd				: SYSM210T_orgCd,
							orgPath             : SYSM210T_orgPath,           
							usrGrd				: SYSM210T_usrGrd, 
							qualAcqsDd			: SYSM210T_qualAcqsDd,
							qualLossDd			: SYSM210T_qualLossDd,
							cntyCd              : SYSM210T_cntyCd,
							mbphNo				: SYSM210T_mbphNo,
							emlAddrIsd			: SYSM210T_emlAddrIsd,
							emlAddrIsdDmn		: SYSM210T_emlAddrIsdDmn,
							emlAddrIsdDmnCd		: SYSM210T_emlAddrIsdDmnCd,
							emlAddrExtn			: SYSM210T_emlAddrExtn,
							emlAddrExtnDmn		: SYSM210T_emlAddrExtnDmn,
							emlAddrExtnDmnCd	: SYSM210T_emlAddrExtnDmnCd,
							ctiUseYn			: SYSM210T_ctiUseYn,
							ctiAgenId			: SYSM210T_ctiAgenId,
							useTermIpAddr		: SYSM210T_useTermIpAddr,
							extNo				: SYSM210T_extNo,
							unfyBlbdCreAthtYn	: SYSM210T_kldCtgrCreAtht,
							kldCtgrCreAtht		: SYSM210T_unfyBlbdCreAthtYn,
							athtLvlOrgCd		: SYSM210T_athtLvlOrgCd,
							athtLvlDtCd			: SYSM210T_athtLvlDtCd,
							//chatChnlPmssCntCd	: SYSM210T_chatChnlPmssCntCd,
							kldScwdSaveYn		: SYSM210T_kldScwdSaveYn,
							autoPfcnUseYn		: SYSM210T_autoPfcnUseYn,
							cmmtSetlmnYn		: SYSM210T_cmmtSetlmnYn,
							kldMgntSetlmnYn		: SYSM210T_kldMgntSetlmnYn,
							regrId              : GLOBAL.session.user.usrId,
							regrOrgCd           : GLOBAL.session.user.orgCd,
							lstCorprId          : GLOBAL.session.user.usrId,
							lstCorprOrgCd       : GLOBAL.session.user.orgCd,
							isNew				: (dupCheck == true) ? "Y" : "N",
	}
	
	Utils.confirm(SYSM210T_langMap.get("common.save.msg"), function(){
		Utils.ajaxCall('/sysm/SYSM210INS01', JSON.stringify(SYSM210T_saveData), function (SYSM210INS01_result) {	
			$('#SYSM210T_validMsg').text(''); 
			
			SYSM200M_fnSearchUserList();
			//SYSM210T_fnInitForm();
			SYSM210T_mode = "Old";
			dupCheck = false;
			
			//kw---20250314 : 사용자관리 수정
			//kw---20250314 : 수정 또는 저장 후 사용자정보 목록 자동 선택
			Utils.alert(SYSM210INS01_result.msg, function(){
				$.each(grdSYSM200M.dataSource.data(), function(index, item){
				if(item.usrId == $("#SYSM210T_usrId").val()){
					grdSYSM200M.select("[data-uid=" + item.uid + "]");
				}
			});	
			});
						
		});		
	});
}

$('#SYSM210T button[name=SYSM210T_btnDel]').on('click', function() {
	var SYSM210T_tenantId = $('input[name=SYSM210T_tenantId]').val();
	var SYSM210T_usrId = $('input[name=SYSM210T_usrId]').val();
	var SYSM210T_potoImgIdxFileNm = $('input[name=SYSM210T_potoImgIdxFileNm]').val();
	var SYSM210T_potoImgPsn = $('input[name=SYSM210T_potoImgPsn]').val();
	
	if(!SYSM210T_tenantId){
		Utils.alert(SYSM210T_langMap.get("aicrm.message.tenantInfo"));
		return;
	}	
	if(!SYSM210T_usrId){
		Utils.alert(SYSM210T_langMap.get("SYSM210T.userId.selectToDelete"));
		return;
	}
	
	Utils.confirm(SYSM210T_langMap.get("common.delete.msg"), function(){
		SYSM210T_delete();
	});
});

function SYSM210T_delete(){
	let SYSM210T_delData ={
			tenantId         : $('input[name=SYSM210T_tenantId]').val(),
			usrId            : $('input[name=SYSM210T_usrId]').val(),
			potoImgIdxFileNm : $('input[name=SYSM210T_potoImgIdxFileNm]').val(),
			potoImgPsn       : $('input[name=SYSM210T_potoImgPsn]').val()
	};
	Utils.ajaxCall('/sysm/SYSM210DEL01', JSON.stringify(SYSM210T_delData), function(SYSM210DEL01_data){
		Utils.alert(SYSM210DEL01_data.msg);
		SYSM200M_fnSearchUserList();
		SYSM210T_fnInitForm(); //삭제하기 위해 선택한 사용자 정보의 찌꺼기를 지운다.
	});
}

$('#SYSM210T button[name=btn_idCheck]').off("click").on('click', function () { 
	let SYSM210T_tenantId = $('#SYSM210T input[name=SYSM210T_tenantId]').val();
	let SYSM210T_usrId    = $('#SYSM210T input[name=SYSM210T_usrId]').val();
	if(!SYSM210T_usrId){
		Utils.alert(SYSM210T_langMap.get("SYSM210T.userId.enter"));
		$('#SYSM210T input[name=SYSM210T_usrId]').focus();
		return;
	}	
	if(SYSM210T_tenantId == ''){
		Utils.alert(SYSM210T_langMap.get("aicrm.message.tenantID"));
		$('#SYSM210T input[name=SYSM210T_tenantId]').focus();
		return;
	}	
	let SYSM200SEL03_data ={
			tenantId : SYSM210T_tenantId,
			usrId    : SYSM210T_usrId
	};
	Utils.ajaxCall("/sysm/SYSM200SEL03", JSON.stringify(SYSM200SEL03_data), function(SYSM200SEL03_data){
		if(SYSM200SEL03_data.chkusrIdcnt > 0){
			Utils.alert(SYSM210T_langMap.get("SYSM210T.userID.notAvailable"));
			dupCheck = false;
		}else{
			Utils.alert(SYSM210T_langMap.get("SYSM210T.userID.available"));
			dupCheck = true;
		}	
	});
});

$('#SYSM210T button[name=SYSM210T_btnScrtNoChange]').off("click").on('click', function () {
	let SYSM210T_tenantIdVal = $('input[name=SYSM210T_tenantId]').val();
	let SYSM210T_usrIdVal = $('input[name=SYSM210T_usrId]').val();
	
	if(!SYSM210T_tenantIdVal){
		Utils.alert(SYSM210T_langMap.get("aicrm.message.tenantInfo"));
		return;
	}	
	if(!SYSM210T_usrIdVal){
		Utils.alert(SYSM210T_langMap.get("SYSM210T.userId.selectToChange"));
		return;
	}
	
	Utils.confirm(SYSM210T_langMap.get("SYSM210T.password.reset"), function(){
		SYSM210T_PassWdInit();
	});
});

function SYSM210T_PassWdInit(){
	let SYSM210T_passWdInitdata ={
			tenantId            : $('input[name=SYSM210T_tenantId]').val(),
			usrId               : $('input[name=SYSM210T_usrId]').val(),
			lstCorprId          : GLOBAL.session.user.usrId,
			lstCorprOrgCd       : GLOBAL.session.user.orgCd,
	};
	Utils.ajaxCall('/sysm/SYSM210UPT01', JSON.stringify(SYSM210T_passWdInitdata), function (SYSM210UPT01_data) {
		Utils.alert(SYSM210UPT01_data.msg);		
	});
}

$('#SYSM210T button[name=SYSM210T_btnAccountUnlock]').off("click").on('click', function () { 
	let SYSM210T_tenantIdVal = $('input[name=SYSM210T_tenantId]').val();
	let SYSM210T_usrIdVal = $('input[name=SYSM210T_usrId]').val();
	
	if(!SYSM210T_tenantIdVal){
		Utils.alert(SYSM210T_langMap.get("aicrm.message.tenantInfo"));
		return;
	}	
	if(!SYSM210T_usrIdVal){
		Utils.alert(SYSM210T_langMap.get("SYSM210T.userId.selectToRelease"));
		return;
	}
	
	Utils.confirm(SYSM210T_langMap.get("SYSM210T.account.unloack"), function(){
		SYSM210T_AccountUnlock();
	});
});

function SYSM210T_AccountUnlock(){
	let SYSM210T_accountUnlockdata ={
			tenantId            : $('input[name=SYSM210T_tenantId]').val(),
			usrId               : $('input[name=SYSM210T_usrId]').val(),
			lstCorprId          : GLOBAL.session.user.usrId,
			lstCorprOrgCd       : GLOBAL.session.user.orgCd,
	};
	Utils.ajaxCall('/sysm/SYSM210UPT02', JSON.stringify(SYSM210T_accountUnlockdata), function (SYSM210UPT02_data) {
		Utils.alert(SYSM210UPT02_data.msg);		
	});
}

function SYSM210T_fnViewPW(){
	$('#SYSM210T_viewPW').on("mousedown", function(){
	    $('#SYSM210T_scrtNo').attr('type',"text");
	}).on('mouseup mouseleave', function() {
	    $('#SYSM210T_scrtNo').attr('type',"password");
	});
}

function SYSM210T_fnBtnCtrl(strFlag){
	if(strFlag === 'init'){
		$('#SYSM210T button[name="btn_if"]').prop('disabled', true);                     //인터페이스 - OFF
		$('#SYSM210T button[name="btn_idCheck"]').prop('disabled', true);	             //중복체크 - OFF
		$('#SYSM210T button[name="SYSM210T_viewPW"]').prop('disabled', true);            //비밀번호확인 - OFF
		$('#SYSM210T button[name="SYSM210T_btnAccountUnlock"]').prop('disabled', true);  //계정잠김해제 - OFF
		$('#SYSM210T button[name="SYSM210T_btnScrtNoChange"]').prop('disabled', true);   //비밀번호초기화 - OFF
		$('#SYSM210T button[name="SYSM210T_btnNew"]').prop('disabled', false);           //신규 - ON
		$('#SYSM210T button[name="SYSM210T_btnSave"]').prop('disabled', true);           //저장 - OFF
		$('#SYSM210T button[name="SYSM210T_btnDel"]').prop('disabled', true);            //삭제	 - OFF	
	}else if(strFlag === 'new'){                                                         //신규버튼 클릭시 
		$('#SYSM210T button[name="btn_if"]').prop('disabled', true);                     //인터페이스 - OFF
		$('#SYSM210T button[name="btn_idCheck"]').prop('disabled', false);	             //중복체크 - ON
		$('#SYSM210T button[name="SYSM210T_viewPW"]').prop('disabled', false);           //비밀번호확인 - ON
		$('#SYSM210T button[name="SYSM210T_btnAccountUnlock"]').prop('disabled', true);  //계정잠김해제 - OFF
		$('#SYSM210T button[name="SYSM210T_btnScrtNoChange"]').prop('disabled', true);   //비밀번호초기화 - OFF
		$('#SYSM210T button[name="SYSM210T_btnNew"]').prop('disabled', false);           //신규 - ON
		$('#SYSM210T button[name="SYSM210T_btnSave"]').prop('disabled', false);          //저장 - ON
		$('#SYSM210T button[name="SYSM210T_btnDel"]').prop('disabled', true);            //삭제	 - OFF	
	}else if(strFlag === 'list'){                                                        //사용자정보목록 클릭시 
		$('#SYSM210T button[name="btn_if"]').prop('disabled', true);                     //인터페이스 - OFF
		$('#SYSM210T button[name="btn_idCheck"]').prop('disabled', true);	             //중복체크 - OFF
		$('#SYSM210T button[name="SYSM210T_viewPW"]').prop('disabled', false);           //비밀번호확인 - ON
		$('#SYSM210T button[name="SYSM210T_btnAccountUnlock"]').prop('disabled', false); //계정잠김해제 - ON
		$('#SYSM210T button[name="SYSM210T_btnScrtNoChange"]').prop('disabled', false);  //비밀번호초기화 - ON
		$('#SYSM210T button[name="SYSM210T_btnNew"]').prop('disabled', false);           //신규 - ON
		$('#SYSM210T button[name="SYSM210T_btnSave"]').prop('disabled', false);          //저장 - ON
		$('#SYSM210T button[name="SYSM210T_btnDel"]').prop('disabled', false);           //삭제 - ON
	}
}

function SYSM210T_usrAlnmUseYn(){
	if($("#SYSM210T input:checkbox[name=SYSM210T_usrAlnmUseYn]").is(":checked") == true) {
		$('#SYSM210T input[name=SYSM210T_usrAlnm]').prop('disabled', false);
		$('#SYSM210T input[name=SYSM210T_usrAlnm]').val("");
	}else{
		$('#SYSM210T input[name=SYSM210T_usrAlnm]').prop('disabled', true);
		$('#SYSM210T input[name=SYSM210T_usrAlnm]').val("");
	}
}

function SYSM210T_fnCtiUseCtl(){
	if($('#SYSM210T input[name=SYSM210T_ctiUseYn]').is(":checked")){ 
		$('#SYSM210T input[name=SYSM210T_ctiAgenId]').prop('disabled', false);
		$('#SYSM210T input[name=SYSM210T_useTermIpAddr]').prop('disabled', false);
		$('#SYSM210T input[name=SYSM210T_extNo]').prop('disabled', false);
	}else{ 
		$('#SYSM210T input[name=SYSM210T_ctiAgenId]').prop('disabled', true);
		$('#SYSM210T input[name=SYSM210T_useTermIpAddr]').prop('disabled', true);
		$('#SYSM210T input[name=SYSM210T_extNo]').prop('disabled', true);
		$('#SYSM210T input[name=SYSM210T_ctiAgenId]').val("");			
		$('#SYSM210T input[name=SYSM210T_useTermIpAddr]').val("");	
		$('#SYSM210T input[name=SYSM210T_extNo]').val("");			
	}
}

function SYSM210T_fnTenantPopup(){
	Utils.setCallbackFunction("SYSM210T_fnTenantCallBack", SYSM210T_fnTenantCallBack);
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM101P", "SYSM101P", 1200, 595, {callbackKey:"SYSM210T_fnTenantCallBack"});	
}

function SYSM210T_fnTenantCallBack(item){
	$('#SYSM210T input[name=SYSM210T_tenantId]').val(item);
	
	//상담그룹 설정
	if(Utils.isNotNull(item) == true){
		SYSM210T_fnSetCnslGrpCombo(item);
	}
}

function SYSM210T_fnOrgPopup(){
	Utils.setCallbackFunction("SYSM210T_fnOrgCallBack", SYSM210T_fnOrgCallBack);
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM213P", "SYSM213P", 410, 590, {callbackKey:"SYSM210T_fnOrgCallBack", tenantId:$('#SYSM210T input[name=SYSM210T_tenantId]').val().toUpperCase()});
}

function SYSM210T_fnOrgCallBack(item){
	$('#SYSM210T input[name=SYSM210T_orgCd]').val(item[0].id);
	$('#SYSM210T input[name=SYSM210T_orgPath]').val(item[0].orgPath);
}

function SYSM210T_fnRemoveInputError(){
	// 모든 input 요소 가져오기
	var inputs = document.querySelectorAll('input');

	// 각 input 요소를 순회하면서 'inputError' 클래스 제거
	inputs.forEach(function(input) {
	    input.classList.remove('inputError');
	});
}
