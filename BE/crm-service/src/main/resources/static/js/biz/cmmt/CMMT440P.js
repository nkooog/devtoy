/***********************************************************************************************
 * Program Name : 일정등록 팝업(CMMT440P.js)
 * Creator      : 김보영
 * Create Date  : 2022.05.18
 * Description  : 일정등록 팝업
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.18     김보영           최초 생성
 ************************************************************************************************/
var CMMT440P_fromDt, CMMT440P_toDt, CMMT440P_schdNo, CMMT440P_item, CMMT440P_file;

var CMMT440P_formData = new FormData();

CMMT440P_userInfo = GLOBAL.session.user;

CMMT440P_fnCommCdGet();

var CMMT440P_schdNo = Utils.getUrlParam('CMMT440P_schdNo')
var CMMT440P_regDt = Utils.isNull(Utils.getUrlParam('CMMT440P_regDt'))? new Date().getFullYear() : Utils.getUrlParam('CMMT440P_regDt')
var CMMT440P_usrId = CMMT440P_userInfo.usrId

var CMMT400M_body1_Year = Utils.getUrlParam('CMMT400M_body1_Year')
var CMMT400M_body1_Month = Utils.getUrlParam('CMMT400M_body1_Month')
var CMMT400M_body1_Day = Utils.getUrlParam('CMMT400M_body1_Day')

$(document).ready(function () {
	if(Utils.isNull(CMMT440P_schdNo)){
		// 수정사항 시작
		if(Utils.isNotNull(CMMT400M_body1_Year)){
			
			var CMMT400M_body1_StDate = CMMT400M_body1_Year + "-" + CMMT400M_body1_Month+ "-" + CMMT400M_body1_Day
			var CMMT400M_body1_EndDate = CMMT400M_body1_Year + "-" + CMMT400M_body1_Month+ "-" + CMMT400M_body1_Day
			
			CMMT440P_fnInitSchd(CMMT400M_body1_StDate, CMMT400M_body1_EndDate);
			$('#CMMT440P_usrNm')[0].innerHTML = CMMT440P_userInfo.decUsrNm;
		}else{
			CMMT440P_fnInitSchd();
			$('#CMMT440P_usrNm')[0].innerHTML = CMMT440P_userInfo.decUsrNm;
		}
		// 수정사항 끝
	}else{
		$('#CMMT440P button[name=btnDel]').css("display",'block')

		var CMMT440P_data = { tenantId			: CMMT440P_userInfo.tenantId,
				  regYr				: CMMT440P_regDt,
				  schdNo 			: CMMT440P_schdNo,
				  usrId				: CMMT440P_usrId
				};	

		var CMMT440P_jsonStr = JSON.stringify(CMMT440P_data);
		Utils.ajaxCall('/cmmt/CMMT440SEL01', CMMT440P_jsonStr, CMMT440P_fnCallBack);
	}
	
	var ComboBox_CMMT440P1 = [
		{ text: "", value: "" }, { text: CMMT440P_langMap.get("CMMT440P.user"), value: 3 }, { text:CMMT440P_langMap.get("CMMT440P.org"), value: 1 }, { text: CMMT440P_langMap.get("CMMT440P.group"), value: 2 }
	]

	$("#CMMT440P_cobDvdPop").kendoComboBox({ 
		dataTextField: "text",
		dataValueField: "value",
		dataSource: ComboBox_CMMT440P1, 
		clearButton: false,
		value: "",
		height: 200,
	});  
	
	$('#CMMT440P_cobDvdPop').data("kendoComboBox").enable(false);
});

function CMMT440P_fnInitSchd(from, to){
	// 달력 초기화
	CMMT440P_fromDt= $("#CMMT440P_fromDt").kendoDateTimePicker({ 
		value: Utils.isNull(from)?new Date():new Date(from),
		format: "yyyy-MM-dd HH:mm",
		footer: false, 
		culture: "ko-KR"
		
	}).data("kendoDateTimePicker");

	CMMT440P_toDt = $("#CMMT440P_toDt").kendoDateTimePicker({ 
		value: Utils.isNull(to)?new Date():new Date(to),
		format: "yyyy-MM-dd HH:mm",
		footer: false,
		culture: "ko-KR" 
	}).data("kendoDateTimePicker");
}

function CMMT440P_fnCallBack(data){
	var CMMT440P_jsonEncode = JSON.stringify(data.CMMT440VOInfo);
	CMMT440P_item = JSON.parse(JSON.parse(CMMT440P_jsonEncode));
	if(CMMT440P_userInfo.usrId!=CMMT440P_item.usrId){
		$('#CMMT440P button[name=btnConfirm]').css('visibility','hidden');
		$('#CMMT440P button[name=btnSave]').css('visibility','hidden');
	}

	$('#CMMT440P_usrNm')[0].innerHTML = CMMT440P_item.userNm

	var CMMT440P_title =  $('#CMMT440P_title').val(Utils.htmlDecode(CMMT440P_item.schdTite));
	var CMMT440P_schdCtt = $('#CMMT440P_schdCtt').val(Utils.htmlDecode(CMMT440P_item.schdCtt));
	
	switch(CMMT440P_item.schdTypCd){
	case "1" :
		$('#CMMT440P_shrSchd').prop("checked", true);
		break;
	case "2" :
		$('#CMMT440P_prvSchd').prop("checked", true);
		break;
	}

	switch(CMMT440P_item.alrmStgupCd){
	case "10" :
		$('#CMMT440P_null').prop("checked", true);
		break;
	case "20" :
		$('#CMMT440P_tenM').prop("checked", true);
		break;
	case "30" :
		$('#CMMT440P_thrdM').prop("checked", true);
		break;
	case "40" :
		$('#CMMT440P_oneH').prop("checked", true);
		break;
	case "50" :
		$('#CMMT440P_twoH').prop("checked", true);
		break;
	case "60" :
		$('#CMMT440P_thrH').prop("checked", true);
		break;
	}

	// switch(CMMT440P_item.alrmGapDvCd){
	// case "05" :
	// 	$('#CMMT440P_5MInt').prop("checked", true);
	// 	break;
	// case "10" :
	// 	$('#CMMT440P_10MInt').prop("checked", true);
	// 	break;
	// case "20" :
	// 	$('#CMMT440P_20MInt').prop("checked", true);
	// 	break;
	// case "30" :
	// 	$('#CMMT440P_30MInt').prop("checked", true);
	// 	break;
	// case "60" :
	// 	$('#CMMT440P_1HInt').prop("checked", true);
	// 	break;
	// }

	switch(CMMT440P_item.alrmTcnt){
	case 1 :
		$('#CMMT440P_once').prop("checked", true);
		break;
	case 2 :
		$('#CMMT440P_twice').prop("checked", true);
		break;
	case 3 :
		$('#CMMT440P_thrT').prop("checked", true);
		break;
	case 4 :
		$('#CMMT440P_fourT').prop("checked", true);
		break;
	case 5 :
		$('#CMMT440P_fiveT').prop("checked", true);
		break;
	}

	CMMT440P_fnInitSchd(CMMT440P_item.srchDtFrom,CMMT440P_item.srchDtTo)


	if(CMMT440P_item.schdTypCd == '2'){ // 개인
		Utils.changeKendoComboBoxDataSource(CMMT440P_cmmCodeList, "C0074", $('#CMMT440P_schdDvCd').data("kendoComboBox"), "", CMMT440P_langMap.get("CMMT440P.select")) ;

	}else{
		Utils.changeKendoComboBoxDataSource(CMMT440P_cmmCodeList, "C0073", $('#CMMT440P_schdDvCd').data("kendoComboBox"), "", CMMT440P_langMap.get("CMMT440P.select")) ;
		$('#CMMT440P_cobDvdPop').data("kendoComboBox").enable(true);
	}
	
	if(!Utils.isNull($('#CMMT440P_schdDvCd').data("kendoComboBox"))){
		$('#CMMT440P_schdDvCd').data("kendoComboBox").value(CMMT440P_item.schdDvCd);
	}
	
	if(CMMT440P_item.cmmt400VOList.length>0 && CMMT440P_item.cmmt400VOList[0].schdJnownDvCd!="3"){
		$('#CMMT440P_cobDvdPop').data("kendoComboBox").value(CMMT440P_item.cmmt400VOList[0].schdJnownDvCd);
	}
	CMMT440P_fnPopCallBackRtn(CMMT440P_item.cmmt400VOList)
	
	let fileList = CMMT440P_item.cmmt400FileList;
	
	if(fileList.length>0){
		$('#CMMT440P_fileNm')[0].innerHTML = fileList[0].apndFileNm
	}
	
	CMMT440P_file = fileList[0];
}	 


function CMMT440P_fnDownFile(){
	var apndFilePsn = CMMT440P_file.apndFilePsn
	var apndFileIdxNm = CMMT440P_file.apndFileIdxNm
	window.location.href="/bcs/cmmt/CMMT440SEL02?urlPath="+apndFilePsn+"&fileName="+apndFileIdxNm;
}

function CMMT440P_fnSaveSchd(){
	
	// 일정유형
	var CMMT440P_schdTyp;
	$("#CMMT440P_schdTyp input[type=radio]").each(function (idx, row) {
		if($(row).prop("checked")){
			switch($(row).prop("id")){
			case "CMMT440P_shrSchd" :
				CMMT440P_schdTyp = '1';
				break;
			case "CMMT440P_prvSchd" :
				CMMT440P_schdTyp = '2';
				break;
			}
		}
	});
	
	// 알람설정
	var CMMT440P_alrmCheck;

	$("#CMMT440P_alrmCheck input[type=radio]").each(function (idx, row) {
		if($(row).prop("checked")){
			switch($(row).prop("id")){
			case "CMMT440P_null" :
				CMMT440P_alrmCheck = '10';
				break;
			case "CMMT440P_tenM" :
				CMMT440P_alrmCheck = '20';
				break;
			case "CMMT440P_thrdM" :
				CMMT440P_alrmCheck = '30';
				break;
			case "CMMT440P_oneH" :
				CMMT440P_alrmCheck = '40';
				break;
			case "CMMT440P_twoH" :
				CMMT440P_alrmCheck = '50';
				break;
			case "CMMT440P_thrH" :
				CMMT440P_alrmCheck = '60';
				break;
			}
		}
	});
	
	//알람간격
	var CMMT440P_alrmIntv =  '00';
	// $("#CMMT440P_alrmIntv input[type=radio]").each(function (idx, row) {
	// 	if($(row).prop("checked")){
	// 		switch($(row).prop("id")){
	// 		case "CMMT440P_5MInt" :
	// 			CMMT440P_alrmIntv = '05';
	// 			break;
	// 		case "CMMT440P_10MInt" :
	// 			CMMT440P_alrmIntv = '10';
	// 			break;
	// 		case "CMMT440P_20MInt" :
	// 			CMMT440P_alrmIntv = '20';
	// 			break;
	// 		case "CMMT440P_30MInt" :
	// 			CMMT440P_alrmIntv = '30';
	// 			break;
	// 		case "CMMT440P_1HInt" :
	// 			CMMT440P_alrmIntv = '60';
	// 			break;
	// 		default :
	// 			CMMT440P_alrmIntv = '00';
	// 			break;
	// 		}
	// 	}
	// });
	
	//알람횟수
	var CMMT440P_alrmRep;
	$("#CMMT440P_alrmRep input[type=radio]").each(function (idx, row) {
		if($(row).prop("checked")){
			switch($(row).prop("id")){
			case "CMMT440P_once" :
				CMMT440P_alrmRep = '1';
				break;
			case "CMMT440P_twice" :
				CMMT440P_alrmRep = '2';
				break;
			case "CMMT440P_thrT" :
				CMMT440P_alrmRep = '3';
				break;
			case "CMMT440P_fourT" :
				CMMT440P_alrmRep = '4';
				break;	
			case "CMMT440P_fiveT" :
				CMMT440P_alrmRep = '5';
				break;	
			default :
				if(CMMT440P_alrmCheck!="10" ){
					CMMT440P_alrmRep = '1';
				}else{
					CMMT440P_alrmRep = '0';
				}
				break;
			}
		}
	});



	Utils.markingRequiredField();
	
	// 일정구분
	let CMMT440P_schdDvCd = $('#CMMT440P_schdDvCd').data("kendoComboBox").value();
	
	//열람권한
	var CMMT440P_authList = [];
	$("#CMMT440P_selAuth li").each(function (idx, row) {
		var CMMT440P_selAuth = {
				schdJnownCd : $(row).prop("id")
			  , schdJnownDvCd : Utils.isNull($('#CMMT440P_cobDvdPop').val()) == true ? '3' :  $('#CMMT440P_cobDvdPop').val() 
		}
		CMMT440P_authList.push(CMMT440P_selAuth)
	});

	//일정기간
	var CMMT440P_dateReg = /([0-2][0-9]{3})-([0-1][0-9])-([0-3][0-9]) ([0-5][0-9]):([0-5][0-9]):([0-5][0-9])(([\-\+]([0-1][0-9])\:00))?/;

	var CMMT440P_srchDtFrom = $('#CMMT440P_fromDt').val();
	var CMMT440P_srchDtTo= $('#CMMT440P_toDt').val();
	
	
	if(!CMMT440P_srchDtFrom && !CMMT440P_dateReg.test(CMMT440P_srchDtFrom)){
		$('#CMMT440P_validMsg').val( CMMT440P_langMap.get("CMMT440P.setStDt"));
//		$("#CMMT440P_fromDt").focus();
		return;
	}
	if(!CMMT440P_srchDtTo &&  !CMMT440P_dateReg.test(CMMT440P_srchDtTo)){
		$('#CMMT440P_validMsg').val(CMMT440P_langMap.get("CMMT440P.setEnDt"));
//		$("#CMMT440P_toDt").focus();
		return;
	}
	
	if(CMMT440P_srchDtTo<CMMT440P_srchDtFrom){
		$('#CMMT440P_validMsg').val(CMMT440P_langMap.get("CMMT440P.setAfDt"));
//		$("#CMMT440P_toDt").focus();
		return;
	}
	
	var CMMT440P_title = $('#CMMT440P_title').val();
	var CMMT440P_schdCtt = $('#CMMT440P_schdCtt').val();
	
	if(!CMMT440P_title){
		$('#CMMT440P_validMsg').val(CMMT440P_langMap.get("CMMT440P.setTitle"));
//		$("#CMMT440P_title").focus();
		return;
	}
	
	if(!CMMT440P_schdDvCd){
		$('#CMMT440P_validMsg').val(CMMT440P_langMap.get("CMMT440P.setGubun"));
//		$("#CMMT440P_schdCtt").focus();
		return;
	}

	if(!CMMT440P_schdCtt){
		$('#CMMT440P_validMsg').val(CMMT440P_langMap.get("CMMT440P.setContent"));
//		$("#CMMT440P_schdCtt").focus();
		return;
	}
	
	let inputFile = $('#CMMT440P_file');
	if (inputFile) {
		CMMT440P_formData.append("CMMT440P_file", inputFile[0].files[0]);
	}
	
	
	var CMMT440P_data = { tenantId			: CMMT440P_userInfo.tenantId,
			  			  schdNo 			: CMMT440P_schdNo,
						  schdTypCd 		: CMMT440P_schdTyp,
						  alrmStgupCd 		: CMMT440P_alrmCheck,
						  alrmTcnt 			: CMMT440P_alrmRep,
						  alrmGapDvCd 		: CMMT440P_alrmIntv,
						  alrmStCd	  		: CMMT440P_alrmCheck == "10"?"1":"2",
						  schdDvCd 			: CMMT440P_schdDvCd, 
						  schdTite 			: CMMT440P_title, 
						  schdCtt 			: CMMT440P_schdCtt,
						  srchDtFrom		: CMMT440P_srchDtFrom,
						  srchDtTo 			: CMMT440P_srchDtTo,
						  regYr				: CMMT440P_regDt,
						  CMMT400VOList		: CMMT440P_authList,
						  regrId 			: CMMT440P_userInfo.usrId,  
						  regrOrgCd 		: CMMT440P_userInfo.orgCd,
						  lstCorprOrgCd 	: CMMT440P_userInfo.orgCd,  
						  lstCorprId 		: CMMT440P_userInfo.usrId
				       };	
	
	var CMMT440P_jsonStr = JSON.stringify(CMMT440P_data);
	
	CMMT440P_formData.append('CMMT440P_data', CMMT440P_jsonStr);
	
	if(!Utils.isNull(CMMT440P_schdNo)){
		CMMT440P_url = GLOBAL.contextPath + '/cmmt/CMMT440UPT01';
	}else{
		CMMT440P_url = GLOBAL.contextPath + '/cmmt/CMMT440INS01';
	}

//	Utils.ajaxCallFormData(CMMT440P_url,JSON.stringify(CMMT440P_formData),function(data){
//		Utils.alert(data.msg);
//		if(data.result > 0){
//			CMMT440P_fnSearchchd(data);
//		}
//	},false,false,false);
	 
	  $.ajax({
	    	url         : CMMT440P_url,
	        type        : 'POST',
			enctype     : 'multipart/form-data',  //필수
			data        : CMMT440P_formData,
			cache       : false,                  //필수 
			contentType : false,                  //필수 
			processData : false,                  //필수 
			timeout     : 18000,                  //필수
	        success     :  CMMT440P_fnSearchchd,
	        error       : function(request,status, error){
	        	console.log("[error]");
	        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
	        }
	    }) ;	
}

function CMMT440P_fnSearchchd(data){
	
	var CMMT440P_jsonEncode = JSON.stringify(data.CMMT440VOInfo);
	var CMMT440P_item = JSON.parse(JSON.parse(CMMT440P_jsonEncode));
	
	CMMT440P_schdNo = CMMT440P_item.schdNo;
	if(!Utils.isNull(CMMT440P_item.cmmt400FileList) && CMMT440P_item.cmmt400FileList.size>0){
		CMMT440P_file = CMMT440P_item.cmmt400FileList[0];
		if(CMMT440P_item.cmmt400FileList.length>0){
			$('#CMMT440P_fileNm')[0].innerHTML = CMMT440P_file.apndFileNm
		}
	}
	  Utils.alert(CMMT440P_langMap.get("CMMT440P.save"), function () {
		  if (Utils.isNotNull(Utils.getUrlParam('callbackKey'))) {
			  Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
		  } else {
			  window.opener.CMMT400M_fnSearch(true);
		  }
		  self.close();
	  });
	
}

//1.Common Code Set
function CMMT440P_fnCommCdGet(){
	let CMMT440P_mgntItemCdList = [
		{"mgntItemCd":"C0073"},
		{"mgntItemCd":"C0074"},
		{"mgntItemCd":"C0079"},
	];

	Utils.getParent().Utils.ajaxCall('/comm/COMM100SEL01',  JSON.stringify({ "codeList": CMMT440P_mgntItemCdList}),function(data){
		var CMMT440P_jsonEncode = JSON.stringify(data.codeList);
		var CMMT440P_object=JSON.parse(CMMT440P_jsonEncode);
		var CMMT440P_jsonDecode = JSON.parse(CMMT440P_object);

		CMMT440P_cmmCodeList = CMMT440P_jsonDecode;

		Utils.setKendoComboBox(CMMT440P_cmmCodeList, "C0074", '#CMMT440P_schdDvCd', "", CMMT440P_langMap.get("CMMT440P.select")) ;

		if(!Utils.isNull(CMMT440P_item)){
			if(CMMT440P_item.schdTypCd == '2'){ // 개인
				Utils.changeKendoComboBoxDataSource(CMMT440P_cmmCodeList, "C0074", $('#CMMT440P_schdDvCd').data("kendoComboBox"), "", CMMT440P_langMap.get("CMMT440P.select")) ;
				//Utils.setKendoComboBox(CMMT440P_cmmCodeList, "C0074", '#CMMT440P_schdDvCd', "", CMMT440P_langMap.get("CMMT440P.select")) ;
			}
			$('#CMMT440P_schdDvCd').data("kendoComboBox").value(CMMT440P_item.schdDvCd);
		}
	},null,null,null );
}

function CMMTP440P_fnSetcombo(gubun){

	Utils.changeKendoComboBoxDataSource(CMMT440P_cmmCodeList, "C0073", $('#CMMT440P_schdDvCd').data("kendoComboBox"), "", CMMT440P_langMap.get("CMMT440P.select")) ;
	if(gubun == 'CMMT440P_prvSchd'){
		Utils.changeKendoComboBoxDataSource(CMMT440P_cmmCodeList, "C0074", $('#CMMT440P_schdDvCd').data("kendoComboBox"), "", CMMT440P_langMap.get("CMMT440P.select")) ;
	}
}


function CMMT440P_fnPopup_SYSM211P(){
	Utils.setCallbackFunction("CMMT440P_fnPopCallBack", CMMT440P_fnPopCallBack);
	
	if(Utils.isNull($('#CMMT440P_cobDvdPop').val())){
		if($('#CMMT440P_prvSchd').prop("checked")){
			Utils.alert(CMMT440P_langMap.get("CMMT440P.notSetAuth"));
		}else{
			Utils.alert(CMMT440P_langMap.get("CMMT440P.setAuthType"),
				() => $("#CMMT440P_cobDvdPop").focus());
		}
		return;
	}
	if($('#CMMT440P_cobDvdPop').val() == 1){
		Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM210P", "SYSM210P" ,  350, 590, {callbackKey:"CMMT440P_fnPopCallBack"});
	}else if($('#CMMT440P_cobDvdPop').val() == 3){
		Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM211P", "SYSM211P" ,  960, 540, {callbackKey:"CMMT440P_fnPopCallBack"});
	}else{
		let param = {
				mgntItemCd:"C0024",
				isMulti : "Y",
				callbackKey: "CMMT440P_fnPopCallBack"
			};

			Utils.setCallbackFunction("CMMT440P_fnPopCallBack", CMMT440P_fnPopCallBack);
			Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM335P", "SYSM335P" , 750, 600,  param);
	}
}


function CMMT440P_fnCobDis(obj){
	let id = $(obj)[0].id
	$("#CMMT440P_selAuth").children().remove();
	
	if(id =='CMMT440P_prvSchd'){
		$('#CMMT440P_cobDvdPop').data("kendoComboBox").enable(false);
		$('#CMMT440P_cobDvdPop').data("kendoComboBox").value("");
		CMMTP440P_fnSetcombo(id)
		
	}else{
		$('#CMMT440P_cobDvdPop').data("kendoComboBox").enable(true);
		CMMTP440P_fnSetcombo(id)
	}
}

function CMMT440P_fnPopCallBack(items){
	$("#CMMT440P_selAuth").children().remove();
	
	let schdJnownDvCd = Utils.isNull($('#CMMT440P_cobDvdPop').val()) == true ? '3' :  $('#CMMT440P_cobDvdPop').val() 
	
	let CMMT440P_usrList, CMMT440P_usrList2;
	items.forEach(function(item) {
		if(schdJnownDvCd=='1'){
			 CMMT440P_usrList = '<li id="'+item.orgCd+'">'+item.orgNm+'<button class="k-chip-icon k-icon k-i-x" title="삭제" onclick="CMMT440P_fnRmvUsrList(this)"></button></li>'
			 CMMT440P_usrList2 =  $(CMMT440P_usrList);
		}else if(schdJnownDvCd=='2'){
			 CMMT440P_usrList = '<li id="'+item.comCd+'">'+item.comCdNm+'<button class="k-chip-icon k-icon k-i-x" title="삭제" onclick="CMMT440P_fnRmvUsrList(this)"></button></li>'
			 CMMT440P_usrList2 =  $(CMMT440P_usrList);
		}else{
			 CMMT440P_usrList = '<li id="'+item.usrId+'">'+item.orgNm+' '+item.decUsrNm+'<button class="k-chip-icon k-icon k-i-x" title="삭제" onclick="CMMT440P_fnRmvUsrList(this)"></button></li>'
			 CMMT440P_usrList2 =  $(CMMT440P_usrList);
		}
		 $("#CMMT440P_selAuth").append(CMMT440P_usrList2);
	});
}

function CMMT440P_fnPopCallBackRtn(items){
	$("#CMMT440P_selAuth").children().remove();
	let schdJnownDvCd = Utils.isNull($('#CMMT440P_cobDvdPop').val()) == true ? '3' :  $('#CMMT440P_cobDvdPop').val() 
	
	let CMMT440P_usrList, CMMT440P_usrList2;
	items.forEach(function(item) {
		if(schdJnownDvCd=='3'){
			 CMMT440P_usrList = '<li id="'+item.schdJnownCd+'">'+item.orgNm+' '+item.decUsrNm+'<button class="k-chip-icon k-icon k-i-x" title="삭제" onclick="CMMT440P_fnRmvUsrList(this)"></button></li>'
			 CMMT440P_usrList2 =  $(CMMT440P_usrList);
		}else{
			 CMMT440P_usrList = '<li id="'+item.schdJnownCd+'">'+item.orgNm+'<button class="k-chip-icon k-icon k-i-x" title="삭제" onclick="CMMT440P_fnRmvUsrList(this)"></button></li>'
			 CMMT440P_usrList2 =  $(CMMT440P_usrList);
		}
		 $("#CMMT440P_selAuth").append(CMMT440P_usrList2);
	});
}


function CMMT440P_fnRmvUsrList(item){
	item.closest('li').remove();
	item.remove();
}

function CMMT440P_fnDelSchd(){
	Utils.confirm(CMMT440P_langMap.get("CMMT440P.cfrmDel"), function(){

		let CMMT440P_data = { tenantId			: CMMT440P_userInfo.tenantId,
			schdNo 				: CMMT440P_schdNo,
			regYr				: CMMT440P_regDt,
			usrId 				: CMMT440P_userInfo.usrId
		};
		let CMMT440P_jsonStr = JSON.stringify(CMMT440P_data);
		Utils.ajaxCall('/cmmt/CMMT440DEL01', CMMT440P_jsonStr,function(data){

			Utils.alert(CMMT440P_langMap.get("CMMT440P.del"), function(){
				if (Utils.isNotNull(Utils.getUrlParam('callbackKey'))) {
					Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
				} else {
					window.opener.CMMT400M_fnSearch(true);
				}
				window.close();
			});
		} ) ;
	})


}

function CMMT440P_delSelAuth(){
	$("#CMMT440P_selAuth").children().remove();
}