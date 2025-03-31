/***********************************************************************************************
 * Program Name : 메타관리항목 (SYSM240M.js)

 * Creator      : 허해민
 * Create Date  : 2022.03.18
 * Description  : 메타관리항목
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.18     허해민           최초작성   
 ************************************************************************************************/

var grdSYSM240M;
var SYSM240MDataSource;
var SYSM240M_cmmCodeList;
/** 저장 버튼 클릭 시 insert, update 나누기 위한 전역변수 선언*/
var SYSM240MResultCord = null;
var SYSM240M_chkMgnt = false, SYSM240M_chkEng = false, SYSM240M_chkKor = false, SYSM240M_svcOprCd = false;
var SYSM240M_chkAbol;

$(document).ready(function () {
	SYSM240MInit();
	GridResizeTableSYSM240M();   
	$(window).on({ 
		'resize': function() {
			GridResizeTableSYSM240M();   
		},   
	});

});

function SYSM240MInit() {
	SYSM240MDataSource ={
			transport: {
				read	: function (SYSM240M_jsonStr) {
					Utils.ajaxCall('/sysm/SYSM240SEL01', SYSM240M_jsonStr, SYSM240M_resultMetaList,
					window.kendo.ui.progress($("#grdSYSM240M"), true), window.kendo.ui.progress($("#grdSYSM240M"), false)) 
				}	
			},
			schema : {
				type: "json",
				model: {
					fields: {
						mgntItemTypCd       : { field: "mgntItemTypCd"     	, type: "string" },
						mgntItemCd       	: { field: "mgntItemCd"     	, type: "string" },
						mgntItemCdNm       	: { field: "mgntItemCdNm"     	, type: "string" },
						mgntItemCdEngnm     : { field: "mgntItemCdEngnm"    , type: "string" },
						svcOprCd     		: { field: "svcOprCd"    		, type: "string" },
						dmnCd       		: { field: "dmnCd"     			, type: "string" },
						dataSzMnriCnt    	: { field: "dataSzMnriCnt"  	, type: "int" 	 },
						dataSzIntMnriCnt    : { field: "dataSzIntMnriCnt"   , type: "int" 	 },
						linkTblId       	: { field: "linkTblId"     		, type: "string" },
						lstCorcDtm          : { field: "lstCorcDtm"     	, type: "string" },
						userNm       		: { field: "userNm"     		, type: "string" },
						lstCorprOrgCd       : { field: "lstCorprOrgCd"     	, type: "string" },
						abolDtm       		: { field: "abolDtm"     		, type: "string" },
						abolmnId       		: { field: "abolmnId"     		, type: "string" },
						abolmnOrgCd       	: { field: "abolmnOrgCd"     	, type: "string" },
						crypTgtYn			: { field: "crypTgtYn"     		, type: "string" },
						useDvCd				: { field: "useDvCd"     		, type: "string" }
					}  
				}
			}  
	}
	
	grdSYSM240M = $("#grdSYSM240M").kendoGrid({
		noRecords: { template: '<div class="nodataMsg"><p>'+SYSM240M_langMap.get("SYSM240M.info.nodata")+'</p></div>' },
		DataSource : {
		SYSM240MDataSource,
		},
		sortable: true,
        resizable : true,
    	pageable: {
        buttonCount: 5,
        pageSize : 100,
    	},
    	selectable: true,
    	selectable: "multiple,row",
		dataBound: SYSM240M_onDataBound,
		columns: [
			// {
			//  selectable: true,
            //  width: 40,
            //  attributes: {
            //      "class": "checkbox-align",
            //  },
            //  headerAttributes: {
            //      "class": "checkbox-align",
            //  }
         	// },
			{ width: 40, field: "radio", title: "선택", template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',  editable: false  },
			{
				field: "mgntItemTypCd",
				title: SYSM240M_langMap.get("SYSM240M.mgntItemTypCd"),  // 관리항목유형
				type: "String", 
				width: 130,
				template: function (dataItem) {
	                return Utils.getComCdNm(SYSM240M_cmmCodeList, 'C0001', dataItem.mgntItemTypCd);
	            },
			},
			{
				field: "useDvCd",
				title: SYSM240M_langMap.get("SYSM240M.useDvCd"),    // 사용구분코드..2022.11.21 - sukim
				type: "String",
				template : function(dataItem) {
					return Utils.getComCdNm(SYSM240M_cmmCodeList, 'C0003', dataItem.useDvCd);
				},
				width: 90,
				attributes: {'class': '#= SYSM240M_getClass(data) #'},
			},
			{
				field: "mgntItemCd", 
				title: SYSM240M_langMap.get("SYSM240M.mgntItemCd"), // 관리항목코드
				type: "String",   
				width: 100
			}, 
			{
				field: "mgntItemCdNm", 
				title: SYSM240M_langMap.get("SYSM240M.mgntItemCdNm"), // 관리항목한글명
				type: "String",
				attributes: {"class": "k-text-left"},
				width: 200
			},
			{
				field: "mgntItemCdEngnm", 
				title: SYSM240M_langMap.get("SYSM240M.mgntItemCdEngnm"), // 관리항목 영문명
				type: "String", 
				attributes: {"class": "k-text-left"},
				width: 230
			},
			{
				field: "dmnCd", 
				title: SYSM240M_langMap.get("SYSM240M.dmnCd"), // 도메인코드
				type: "String",
				attributes: {"class": "k-text-left"},
				width: 80,
				template: function (dataItem) {
					// 도메인코드 값이 null 이면 공백으로 표시
					if( dataItem.dmnCd == null ){
						dataItem.dmnCd = "";
					}
	                return Utils.getComCdNm(SYSM240M_cmmCodeList, 'C0002', dataItem.dmnCd);
	            }
			},
			{
				field: "dataSzIntMnriCnt",
				title: SYSM240M_langMap.get("SYSM240M.data"), // 데이터Size
				type: "Int", 
				width: 70,
				attributes: {"class": "k-text-right"},
				template: function (dataItem) {
					return "<span>" + dataItem.dataSzIntMnriCnt + "." + dataItem.dataSzSmlcntMnriCnt + "</sapn>" 
					}
			},
			{
				field: "linkTblId", 
				title: SYSM240M_langMap.get("SYSM240M.linkTblId"), // 연계URL
				type: "String", 
				width: 170,
				attributes: {"class": "k-text-left"},
				template: function (dataItem) {
					// 연계테이블 값이 null 이면 공백으로 표시
					if( dataItem.linkTblId == null ){
						dataItem.linkTblId = "";
					}
	                return Utils.getComCdNm(SYSM240M_cmmCodeList, 'C0186', dataItem.linkTblId);
	            },
			},
			{
				field: "crypTgtYn", 
				title: SYSM240M_langMap.get("SYSM240M.encryption"),
				type: "String", 
				width: 100,
				template: function (dataItem) {
					// 연계테이블 값이 null 이면 공백으로 표시
					if( dataItem.crypTgtYn == null ){
						dataItem.crypTgtYn = "";
					}
	                return Utils.getComCdNm(SYSM240M_cmmCodeList, 'C0245', dataItem.crypTgtYn);
	            },
			},
			{
				field: "svcOprCd",
				title: SYSM240M_langMap.get("SYSM240M.svcOpr"),
				type: "String",
				width: 100,
				attributes: {"class": "k-text-left"},
			},
			{

				field: "lstCorcDtm",
				editor: function(container, options) {
					let dateString = kendo.format("{0:yyyy-MM-dd}",new Date(options.model.regDtm))
					let $input = $("<input value="+ dateString +" />").appendTo(container);
					$input.kendoDatePicker({ culture : "ko-KR", format : "yyyy-MM-dd HH:mm"});
				},
				template : '#=kendo.format("{0:yyyy-MM-dd HH:mm}",new Date(regDtm))#',
				title: SYSM240M_langMap.get("SYSM240M.lstCorcDtm"),
				width: 120
			},
			{
				field: "userNm",
				title: SYSM240M_langMap.get("SYSM240M.lstCorprId"), // 등록자ID
				type: "String", 
				width: 100,
				attributes : { style : "text-align : left;" }
			},
			],
	}).data("kendoGrid");
	
	// CODE세팅
	SYSM240M_fnSelectCombo();
	SYSM240M_fnSearchMetaList();
}

function SYSM240M_getClass(data) {
	return data.useDvCd.indexOf("D") === 0 ? "fontRed" : "fontNormal"; //2022.11.23 sukim test ->fontNormal 로 변경
}

/**
 * CODE조회
 *
 */
function SYSM240M_fnSelectCombo(){
	let SYSM240M_data = {
	"codeList": [
					{"mgntItemCd":"C0001"},
					{"mgntItemCd":"C0002"},
					{"mgntItemCd":"C0003"},
					{"mgntItemCd":"C0245"}
				]
	};
	Utils.ajaxCall('/comm/COMM100SEL01',  JSON.stringify(SYSM240M_data), SYSM240M_fnsetCombo)
}

/**
 * CODE세팅
 *
 */
function SYSM240M_fnsetCombo(SYSM240M_data){
	
	SYSM240M_cmmCodeList = JSON.parse(SYSM240M_data.codeList);
	
	//관리항목유형
	Utils.setKendoComboBox(SYSM240M_cmmCodeList, "C0001", "input[name=mgntItemTypCdsrch]");
	Utils.setKendoComboBox(SYSM240M_cmmCodeList, "C0001", "input[name=mgntItemTypCdsrch01]", "", SYSM240M_langMap.get("input.cSelect")); 
	
	//도메인
	Utils.setKendoComboBox(SYSM240M_cmmCodeList, "C0002", "input[name=dmnCdsrch]");
	Utils.setKendoComboBox(SYSM240M_cmmCodeList, "C0002", "input[name=dmnCdsrch01]", "", SYSM240M_langMap.get("input.cSelect")); 
	
	//암호화여부 : 2022.11.21 sukim
	Utils.setKendoComboBox(SYSM240M_cmmCodeList, "C0245", "#SYSM240M_crypTgtYn", "", SYSM240M_langMap.get("input.cSelect")); 
	
	//사용구분코드 : 2022.11.21 sukim
	Utils.setKendoComboBox(SYSM240M_cmmCodeList, "C0003", "#SYSM240M_useDvCd", "", SYSM240M_langMap.get("input.cSelect")); 
}

/** 
 * 메타관리항목 전체조회 */
$('#btn__metaInfolist').on('click', function UserListSearch() {	
	SYSM240M_fnSearchMetaList();
});

/** 신규 (초기화)*/
$('#SYSM240M_btnNewReg').on('click', function newReg() {
	
	SYSM240MResultCord = "NEW";
	$('#grSYSM240M button[name=btnSave]').prop("disabled", false);
	$('#grSYSM240M input[name=mgntItemTypCdsrch01]').data("kendoComboBox").value("");  //관리항목유형코드
	$('#grSYSM240M input[name=mgntItemCd]').val("");
	$('#grSYSM240M input[name=mgntItemCdNm]').val("");
	$('#grSYSM240M input[name=dmnCdsrch01]').data("kendoComboBox").value(""); //도메인코드
	$('#grSYSM240M input[name=dataSzMnriCnt]').val("");
	$('#grSYSM240M input[name=dataSzSmlcntMnriCnt]').val("0"); //초기값 0으로 설정, 2022.11.21 sukim
	$('#grSYSM240M input[name=mgntItemCdEngnm]').val("");
	$('#grSYSM240M input[name=svcOprCd]').val("");				//2023.01.17 서비스운영 IF용 추가
	
	$('#grSYSM240M input[name=linkTblId]').val("");  //연계URL
	$('#SYSM240M input[name=linkTblId]').prop('disabled', true);
	
	$('#grSYSM240M input[name=regDtm]').val("");
	$('#grSYSM240M input[name=lstCorcDtm]').val("");
	$('#grSYSM240M input[name=regrOrgCd]').val("");
	$('#grSYSM240M input[name=regrId]').val("");
	$('#grSYSM240M input[name=lstCorprOrgCd]').val("");
	$('#grSYSM240M input[name=lstCorprId]').val("");
	$('#grSYSM240M input[name=SYSM240M_crypTgtYn]').data("kendoComboBox").value("N"); //암호화여부
	$("#SYSM240M_validMsg").val("");

});

/** 수정 및 신규등록 */
$('#SYSM240M_btnSave').on('click', function newReg() {
	let SYSM240M_regrIdVal = null;
	let SYSM240M_regrOrgCdVal = null;
	
	let SYSM240M_mgntItemTypCdsrchVal 	= $('#grSYSM240M input[name=mgntItemTypCdsrch01]').data("kendoComboBox").value();
	let SYSM240M_mgntItemCdVal 			= $('#grSYSM240M input[name=mgntItemCd]').val();
	let SYSM240M_mgntItemCdNmVal 		= $('#grSYSM240M input[name=mgntItemCdNm]').val();
	let SYSM240M_dmnCdsrchVal 			= $('#grSYSM240M input[name=dmnCdsrch01]').data("kendoComboBox").value();
	let SYSM240M_dataSzMnriCntVal 		= $('#grSYSM240M input[name=dataSzMnriCnt]').val();
	let SYSM240M_dataSzSmlcntMnriCntVal = $('#grSYSM240M input[name=dataSzSmlcntMnriCnt]').val();
	let SYSM240M_mgntItemCdEngnmVal 	= $('#grSYSM240M input[name=mgntItemCdEngnm]').val();
	let SYSM240M_svcOprCdVal			= $('#grSYSM240M input[name=svcOprCd]').val();
	let SYSM240M_linkTblIdVal 			= $('#grSYSM240M input[name=linkTblId]').val();  //연계URL
	let SYSM240M_crypTgtYnVal			= $('#grSYSM240M input[name=SYSM240M_crypTgtYn]').data("kendoComboBox").value();
	let SYSM240M_useDvCd				= $('#grSYSM240M input[name=SYSM240M_useDvCd]').data("kendoComboBox").value(); //사용구분코드
	
	if( SYSM240M_regrIdVal == null || SYSM240M_regrIdVal == ""){
			SYSM240M_regrIdVal			= GLOBAL.session.user.usrId;
	}else{
			SYSM240M_regrIdVal			= $('#grSYSM240M input[name=regrId]').val();
	}
	
	if( SYSM240M_regrOrgCdVal == null || SYSM240M_regrOrgCdVal == ""){
			SYSM240M_regrOrgCdVal		= GLOBAL.session.user.orgCd;
	}else{
			SYSM240M_regrOrgCdVal		= $('#grSYSM240M input[name=regrId]').val();
	}
	let SYSM240M_lstCorprIdVal			= GLOBAL.session.user.usrId;
	let SYSM240M_lstCorprOrgCdVal		= GLOBAL.session.user.orgCd;
	let	SYSM240M_mlingCdVal				= GLOBAL.session.user.mlingCd;

	Utils.markingRequiredField();

	//관리항목 유형을 선택 하십시오.
	if(!SYSM240M_mgntItemTypCdsrchVal){
		$("#SYSM240M_validMsg").val(SYSM240M_langMap.get("SYSM240M.alert.mgntItemTypCdsrchVal"));
		return;
	}
	// 관리항목 코드를 입력하십시오
	if(!SYSM240M_mgntItemCdVal){
		$("#SYSM240M_validMsg").val(SYSM240M_langMap.get("SYSM240M.alert.mgntItemCdVal")); 
		return;
	}
	if(SYSM240MResultCord == "NEW" && SYSM240M_chkMgnt != true){
		$("#SYSM240M_validMsg").val(SYSM240M_langMap.get("SYSM240M.alert.checkDup1"));  //관리항목 코드 중복 체크 하십시오.
		return;
	}
	//도메인코드를 선택 하십시오.
	if(!SYSM240M_dmnCdsrchVal){
		$("#SYSM240M_validMsg").val(SYSM240M_langMap.get("SYSM240M.alert.dmnCd"));
		return;
	}		
	//관리항목유형이 E형인 경우 연계 URL은 필수임
	//2022.11.21 sukim 추가
	if(SYSM240M_mgntItemTypCdsrchVal == "E" && (SYSM240M_linkTblIdVal.length == 0 || SYSM240M_linkTblIdVal == null || SYSM240M_linkTblIdVal == "")){
		$("#SYSM240M_validMsg").val(SYSM240M_langMap.get("SYSM240M.alert.linkTblId")); // 연계 URL을 입력하십시오.
		return;
	}
	if(!SYSM240M_mgntItemCdNmVal){
		$("#SYSM240M_validMsg").val(SYSM240M_langMap.get("SYSM240M.alert.mgntItemCdNmVal")); // 관리항목 한글명을 입력 하십시오
		return;
	}
	if(SYSM240MResultCord == "NEW" && SYSM240M_chkKor != true){
		$("#SYSM240M_validMsg").val(SYSM240M_langMap.get("SYSM240M.alert.checkDup2"));  // 관리항목 한글명 중복 체크 하십시오.
		return;
	}
	
	if(!SYSM240M_dataSzMnriCntVal){
		$("#SYSM240M_validMsg").val(SYSM240M_langMap.get("SYSM240M.alert.dataSzMnriCntVal")); // 데이터Size 정수를 입력 하십시오
		return;
	}
	if(!SYSM240M_dataSzSmlcntMnriCntVal){
		$("#SYSM240M_validMsg").val(SYSM240M_langMap.get("SYSM240M.alert.dataSzSmlcntMnriCntVal")); // 데이터Size 소수를 입력 하십시오
		return;
	}
	//2022.11.21 sukim 추가
	if(!SYSM240M_crypTgtYnVal){
		$("#SYSM240M_validMsg").val(SYSM240M_langMap.get("SYSM240M.alert.SYSM240M_crypTgtYn")); // 암호화여부를 선택하십시오.
		return;
	}	
	//2022.11.21 sukim 추가
	if(!SYSM240M_useDvCd){
		$("#SYSM240M_validMsg").val(SYSM240M_langMap.get("SYSM240M.alert.SYSM240M_useDvCd")); // 사용구분코드를 선택하십시오.
		return;
	}	
	
	let grSYSM240M_data = {
			mgntItemTypCd       : SYSM240M_mgntItemTypCdsrchVal,
			mgntItemCd       	: SYSM240M_mgntItemCdVal,
			mgntItemCdNm       	: SYSM240M_mgntItemCdNmVal,
			dmnCd				: SYSM240M_dmnCdsrchVal,
			dataSzIntMnriCnt	: SYSM240M_dataSzMnriCntVal,
			dataSzSmlcntMnriCnt	: SYSM240M_dataSzSmlcntMnriCntVal,
			mgntItemCdEngnm		: SYSM240M_mgntItemCdEngnmVal,
			svcOprCd			: SYSM240M_svcOprCdVal,
			linkTblId			: SYSM240M_linkTblIdVal,
			regrId				: SYSM240M_regrIdVal,
			regrOrgCd			: SYSM240M_regrOrgCdVal,
			lstCorprId			: SYSM240M_lstCorprIdVal,
			lstCorprOrgCd		: SYSM240M_lstCorprOrgCdVal,
			mlingCd				: SYSM240M_mlingCdVal,
			crypTgtYn			: SYSM240M_crypTgtYnVal,  // 암호화여부
			useDvCd				: SYSM240M_useDvCd,        // 사용구분코드
			originMgntItemCd	: document.querySelector("[name='originMgntItemCd']").value
	}
	
	let grSYSM240M_jsonStr = JSON.stringify(grSYSM240M_data);
	
	if( SYSM240MResultCord == "NEW" || SYSM240MResultCord == null ){
		SYSM240M_url = '/bcs/sysm/SYSM240INS01'
	}else{
		SYSM240M_url = '/bcs/sysm/SYSM240UPT01'
	}
	Utils.confirm(SYSM240M_langMap.get("common.save.msg"), function () {
		$.ajax({
			url: SYSM240M_url, 
			type:'post',
			dataType : 'json', 
			contentType : 'application/json; charset=UTF-8',
			data : grSYSM240M_jsonStr,    
			success : function(data){
					
				Utils.alert(SYSM240M_langMap.get("SYSM240M.alert.btnSave")); // 저장하였습니다
				$("#SYSM240M_validMsg").val("");
				SYSM240M_fnSearchMetaList();

			},
			error :function(request,status, error){
				console.log("[error]");
				console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
			}
		});
	});
});

// 폐기
$('#SYSM240M_btnDisposal').on('click', function newReg() {
	
	//2022.11.21 sukim 삭제 하시겠습니까? 앞으로 꺼냄.
	if(!Utils.isNull(SYSM240M_chkAbol) && SYSM240M_chkAbol =='D'){
		Utils.alert(SYSM240M_langMap.get("SYSM240M.alert.doNotDel2"));
		return;
	}
	
	Utils.confirm("폐기하시겠습니까?", function(){
	
		let SYSM240M_mgntItemTypCdsrchVal 	= $('#grSYSM240M input[name=mgntItemTypCdsrch01]').data("kendoComboBox").value();
		
		let SYSM240M_mgntItemCdVal 			= $('#grSYSM240M input[name=mgntItemCd]').val().toUpperCase();
		let SYSM240M_mgntItemCdNmVal 		= $('#grSYSM240M input[name=mgntItemCdNm]').val();
		let SYSM240M_dmnCdsrchVal 			= $('#grSYSM240M input[name=dmnCdsrch01]').data("kendoComboBox").value();
		let SYSM240M_dataSzMnriCntVal 		= $('#grSYSM240M input[name=dataSzMnriCnt]').val();
		let SYSM240M_dataSzSmlcntMnriCntVal = $('#grSYSM240M input[name=dataSzSmlcntMnriCnt]').val();
		let SYSM240M_mgntItemCdEngnmVal 	= $('#grSYSM240M input[name=mgntItemCdEngnm]').val();
		let SYSM240M_svcOprCdVal			= $('#grSYSM240M input[name=svcOprCd]').val();						//2023.01.17 : 서비스운영 IF 추가
		let SYSM240M_linkTblIdVal 			= $('#grSYSM240M input[name=linkTblId]').val(); 					//연계URL 2022.11.21 sukim
		let SYSM240M_crypTgtYnVal			= $('#grSYSM240M input[name=SYSM240M_crypTgtYn]').data("kendoComboBox").value();//암호화대상
		
		let	SYSM240M_regrIdVal				= $('#grSYSM240M input[name=regrId]').val();
		let	SYSM240M_regrOrgCdVal			= $('#grSYSM240M input[name=regrId]').val();
		let SYSM240M_lstCorprIdVal			= $('#grSYSM240M input[name=lstCorprId]').val();
		let SYSM240M_lstCorprOrgCdVal		= $('#grSYSM240M input[name=lstCorprOrgCd]').val();
		let SYSM240M_abolmnIdVal			= GLOBAL.session.user.usrId;
		let SYSM240M_abolmnOrgCdVal			= GLOBAL.session.user.orgCd;
		let	SYSM240M_mlingCdVal				= GLOBAL.session.user.mlingCd;	
		
		
		let grSYSM240M_data = {
				mgntItemTypCd       : SYSM240M_mgntItemTypCdsrchVal,
				mgntItemCd       	: SYSM240M_mgntItemCdVal,
				mgntItemCdNm       	: SYSM240M_mgntItemCdNmVal,
				dmnCd				: SYSM240M_dmnCdsrchVal,
				dataSzIntMnriCnt	: SYSM240M_dataSzMnriCntVal,
				dataSzSmlcntMnriCnt	: SYSM240M_dataSzSmlcntMnriCntVal,
				mgntItemCdEngnm		: SYSM240M_mgntItemCdEngnmVal,
				svcOprCdVal			: SYSM240M_svcOprCdVal,
				linkTblId			: SYSM240M_linkTblIdVal,
				regrId				: SYSM240M_regrIdVal,
				regrOrgCd			: SYSM240M_regrOrgCdVal,
				lstCorprId			: SYSM240M_lstCorprIdVal,
				lstCorprOrgCd		: SYSM240M_lstCorprOrgCdVal,
				abolmnId			: SYSM240M_abolmnIdVal,
				abolmnOrgCd			: SYSM240M_abolmnOrgCdVal,
				mlingCd				: SYSM240M_mlingCdVal,
				crypTgtYn			: SYSM240M_crypTgtYnVal
		}
		let grSYSM240M_jsonStr = JSON.stringify(grSYSM240M_data);
		
		$.ajax({
			url: '/bcs/sysm/SYSM240UPT02', 
			type:'post',
			dataType : 'json', 
			contentType : 'application/json; charset=UTF-8',
			data : grSYSM240M_jsonStr,    
			success : function(data){
				
				Utils.alert('정상적으로 폐기 되었습니다.');
					$('#grSYSM240M input[name=mgntItemTypCdsrch01]').data("kendoComboBox").value("");
					$('#grSYSM240M input[name=mgntItemCd]').val("");
					$('#grSYSM240M input[name=mgntItemCdNm]').val("");
					$('#grSYSM240M input[name=dmnCdsrch01]').data("kendoComboBox").value("");
					$('#grSYSM240M input[name=dataSzMnriCnt]').val("");
					$('#grSYSM240M input[name=dataSzSmlcntMnriCnt]').val("");
					$('#grSYSM240M input[name=mgntItemCdEngnm]').val("");
					$('#grSYSM240M input[name=svcOprCd]').val("");										//2023.01.17 : 서비스운영 IF 추가
					$('#grSYSM240M input[name=linkTblId]').val(""); 									//연계URL 2022.11.21 sukim 수정
					$('#grSYSM240M input[name=SYSM240M_useDvCd]').data("kendoComboBox").value("");		//사용구분코드 2022.11.21 sukim 수정
					$('#grSYSM240M input[name=regDtm]').val("");
					$('#grSYSM240M input[name=lstCorcDtm]').val("");
					$('#grSYSM240M input[name=regrOrgCd]').val("");
					$('#grSYSM240M input[name=regrId]').val("");
					$('#grSYSM240M input[name=lstCorprOrgCd]').val("");
					$('#grSYSM240M input[name=lstCorprId]').val("");
					$('#grSYSM240M input[name=SYSM240M_crypTgtYn]').data("kendoComboBox").value("");
					$("#SYSM240M_validMsg").val("");
					SYSM240M_fnSearchMetaList();
			},
			error :function(request,status, error){
				console.log("[error]");
				console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
			}
		});
	});
});

/** 
 * 메타관리항목 조회결과 */
function SYSM240M_resultMetaList(SYSM240M_data){
	var SYSM240M_jsonEncode = JSON.stringify(SYSM240M_data.SYSM240SEL01List);
	var SYSM240M_obj=JSON.parse(SYSM240M_jsonEncode);
	var SYSM240M_jsonDecode = JSON.parse(SYSM240M_obj);

	grdSYSM240M.dataSource.data(SYSM240M_jsonDecode);
	grdSYSM240M.dataSource.options.schema.data = SYSM240M_jsonDecode;

	grdSYSM240M.dataSource.page(1);
}	

/**
 * check metaList
 *
 * @param 
 * @returns
*/
function SYSM240M_fnSearchMetaList() {

	var mgntItemTypCdsrchVal = $('input[name=mgntItemTypCdsrch]').val();
	var mgntItemCdVal = $('input[name=mgntItemCd]').val().toUpperCase();  //2022.11.21 sukim 대문자로 조회
	var mgntItemCdNmVal = $('input[name=mgntItemCdNm]').val();
	var dmnCdsrchVal = $('input[name=dmnCdsrch]').val();
	
	var SYSM240M_data = {
			mgntItemCd		: mgntItemCdVal.trim(),
			mgntItemCdNm 	: mgntItemCdNmVal.trim(),
			mgntItemTypCd 	: mgntItemTypCdsrchVal,
			dmnCd		  	: dmnCdsrchVal
			
	};
	
	var SYSM240M_jsonStr = JSON.stringify(SYSM240M_data);
	SYSM240MDataSource.transport.read(SYSM240M_jsonStr);
}

/**
 * row click.
 *
 * @returns
 */
function SYSM240M_onDataBound(e) {
    $("#grdSYSM240M" + " tbody tr:first").trigger("click");
	$("#grdSYSM240M").on('click','tbody tr[data-uid]',function (e) {
		var SYSM240M_cell = $(e.currentTarget);
		var	SYSM240M_item	= grdSYSM240M.dataItem(SYSM240M_cell.closest("tr"));
		SYSM240MResultCord = "U";
		//2022.11.21 sukim 아래 변수 2개 주석처리
		//var SYSM240M_str = JSON.stringify(SYSM240M_item);
		//var SYSM240M_str1 = SYSM240M_str.substring( 18,19 );
		SYSM240M_chkAbol = SYSM240M_item.useDvCd; //사용구분코드(폐기시 값 체크)

		// 관리항목상세
		$('#grSYSM240M input[name=mgntItemTypCdsrch01]').data("kendoComboBox").value(SYSM240M_item.mgntItemTypCd); //관리항목유형코드
		$('#grSYSM240M input[name=mgntItemCd]').val(SYSM240M_item.mgntItemCd);
		$('#grSYSM240M input[name=mgntItemCdNm]').val(SYSM240M_item.mgntItemCdNm);
		$('#grSYSM240M input[name=dmnCdsrch01]').data("kendoComboBox").value(SYSM240M_item.dmnCd);  //도메인코드
		$('#grSYSM240M input[name=linkTblId]').val(SYSM240M_item.linkTblId); //연계 URL 2022.11.21 sukim
		$('#grSYSM240M input[name=dataSzMnriCnt]').val(SYSM240M_item.dataSzIntMnriCnt);
		$('#grSYSM240M input[name=dataSzSmlcntMnriCnt]').val(SYSM240M_item.dataSzSmlcntMnriCnt);
		$('#grSYSM240M input[name=mgntItemCdEngnm]').val(SYSM240M_item.mgntItemCdEngnm);
		$('#grSYSM240M input[name=svcOprCd]').val(SYSM240M_item.svcOprCd);						 				//2023.01.17 : 서비스운영 IF 추가
		$('#grSYSM240M input[name=SYSM240M_crypTgtYn]').data("kendoComboBox").value(SYSM240M_item.crypTgtYn);  //암호화여부
		$('#grSYSM240M input[name=SYSM240M_useDvCd]').data("kendoComboBox").value(SYSM240M_item.useDvCd); //사용구분코드

		document.querySelector("[name='originMgntItemCd']").value = SYSM240M_item.mgntItemCd;
		
		
		// 관리항목 유형 'E'이면 연계 URL 입력가능...2022.11.21 sukim 수정
		if( SYSM240M_item.mgntItemTypCd == 'E'){ 
			$('#SYSM240M input[name=linkTblId]').prop('disabled', false);
		}else {
			$('#SYSM240M input[name=linkTblId]').prop('disabled', true);
		}
		
		if(SYSM240M_item.regDtm){
			var SYSM240M_regDtm = kendo.format("{0:yyyy-MM-dd HH:mm}",new Date(SYSM240M_item.regDtm));
			$('#grSYSM240M input[name=regDtm]').val(SYSM240M_regDtm);
		}
		if(SYSM240M_item.lstCorcDtm){
			var SYSM240M_lstCorcDtm = kendo.format("{0:yyyy-MM-dd HH:mm}",new Date(SYSM240M_item.lstCorcDtm));
			$('#grSYSM240M input[name=lstCorcDtm]').val(SYSM240M_lstCorcDtm);
		}
		$('#grSYSM240M input[name=regrOrgCd]').val(SYSM240M_item.regrOrgCd);
		$('#grSYSM240M input[name=regrId]').val(SYSM240M_item.usrNm);
		$('#grSYSM240M input[name=lstCorprOrgCd]').val(SYSM240M_item.lstCorprOrgCd);
		$('#grSYSM240M input[name=lstCorprId]').val(SYSM240M_item.userNm);
			

	})
}

//관리항목 한글명 중복 체크
$('#grSYSM240M button[name=btnKoCheck]').on('click', function () {
	let SYSM240M_mgntItemCdNm    = $('#grSYSM240M input[name=mgntItemCdNm]').val();

	if(!SYSM240M_mgntItemCdNm){
		Utils.alert(SYSM240M_langMap.get("SYSM240M.input.mgntItemCdNm1")); // 관리항목 한글명을 입력하십시오
		return;
	}
	let data ={
			mgntItemCdNm : SYSM240M_mgntItemCdNm
	};

	let SYSM240M_jsonStr = JSON.stringify(data);
	$.ajax({
		url: '/bcs/sysm/SYSM240SEL02',
		type:'post',
		dataType : 'json',
		contentType : 'application/json; charset=UTF-8',
		data : SYSM240M_jsonStr,
		success : function(data){
			if(data.flag > 0){
				Utils.alert(SYSM240M_langMap.get("SYSM240M.input.mgntItemCdNm2")); // 관리항목 한글명이 존재합니다. 사용할 수 없는 관리항목 한글명입니다
			}else{
				Utils.alert(SYSM240M_langMap.get("SYSM240M.input.mgntItemCdNm3")); // 사용가능한 관리항목 한글명 입니다
				SYSM240M_chkKor = true
			}
		},
		error :function(request,status, error){
			console.log("[error]");
			console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
		}
	})
});

//관리항목 영문명 중복 체크
$('#grSYSM240M button[name=btnEnCheck]').on('click', function () { 
	let SYSM240M_mgntItemCdEngnm    = $('#grSYSM240M input[name=mgntItemCdEngnm]').val();

	if(!SYSM240M_mgntItemCdEngnm){
		Utils.alert(SYSM240M_langMap.get("SYSM240M.input.mgntItemCdEngnm1")); // 관리항목 영문명을 입력하십시오
		return;
	}
	let data ={
			mgntItemCdEngnm : SYSM240M_mgntItemCdEngnm
	};

	let SYSM240M_jsonStr = JSON.stringify(data);
	$.ajax({
		url: '/bcs/sysm/SYSM240SEL03',
		type:'post',
		dataType : 'json', 
		contentType : 'application/json; charset=UTF-8',
		data : SYSM240M_jsonStr,
		success : function(data){
			if(data.flag > 0){
				Utils.alert(SYSM240M_langMap.get("SYSM240M.input.mgntItemCdEngnm2")); // 관리항목 영문명이 존재합니다. 사용할 수 없는 관리항목 영문명입니다.
			}else{
				Utils.alert(SYSM240M_langMap.get("SYSM240M.input.mgntItemCdEngnm3")); // 사용가능합 관리항목 영문명 입니다
				SYSM240M_chkEng = true
			}
		},
		error :function(request,status, error){
			console.log("[error]");
			console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
		}
	})
});

//서비스운영코드 중복 체크
$('#grSYSM240M button[name=btnSvcOprCdCheck]').on('click', function () {
	
	let SYSM240M_svcOprCd    = $('#grSYSM240M input[name=svcOprCd]').val();
	
	if(!SYSM240M_svcOprCd){
		Utils.alert(SYSM240M_langMap.get("SYSM240M.input.svcOprCd1")); // 관리항목 영문명을 입력하십시오
		return;
	}
	let data ={
			svcOprCd : SYSM240M_svcOprCd
	};

	let SYSM240M_jsonStr = JSON.stringify(data);
	$.ajax({
		url: '/bcs/sysm/SYSM240SEL03',
		type:'post',
		dataType : 'json', 
		contentType : 'application/json; charset=UTF-8',
		data : SYSM240M_jsonStr,
		success : function(data){
			if(data.flag > 0){
				Utils.alert(SYSM240M_langMap.get("SYSM240M.input.svcOprCd2")); // 관리항목 영문명이 존재합니다. 사용할 수 없는 관리항목 영문명입니다.
			}else{
				Utils.alert(SYSM240M_langMap.get("SYSM240M.input.svcOprCd3")); // 사용가능합 관리항목 영문명 입니다
				SYSM240M_svcOprCd = true
			}
		},
		error :function(request,status, error){
			console.log("[error]");
			console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
		}
	})
	
});

// 관리항목유형이 'E'인 경우, 연계URL 입력가능(2022.11.21 - sukim)
$('#mgntItemTypCdsrch01').change( function() {
	var SYSM240M_mgntItemCd = $(this).val();
	if( SYSM240M_mgntItemCd == 'E'){
		$('#SYSM240M input[name=linkTblId]').prop('disabled', false);
	}else {
		$('#SYSM240M input[name=linkTblId]').prop('disabled', true);
	}
});

// Excel from 다운로드
$("#btnDown").click(function() {	
	var pathKey = "FORM";
	var savedFileName = "메타공통코드관리_템플릿.xlsx";
	window.location.href = GLOBAL.contextPath + "/file/download?pathKey="+pathKey+"&fileName="+ savedFileName;
});

function SYSM240M_excellUpload() {
	$("#fileInput01").click();
}

function SYSM240M_Upload() {
	var frmData = new FormData(document.getElementById('frm'));
	var tenantId = GLOBAL.session.user.tenantId;
	
	frmData.append("tenantId",tenantId);
	
		$.ajax({
			url: "/bcs/sysm/SYSM240INS02",
			data: frmData,
			enctype: 'multipart/form-data',
			processData: false, //필수(중요)
			contentType: false, //필수(중요)
			type: "POST",
		    error: function(xhr, status, error){
		        alert(error);
		    },
		    success : function(data){
		    }
		});
}

// 엑셀 다운로드
function SYSM240M_exportExcel() {
	// var gridData = grdSYSM240M._data.length;
	 var pageSize = grdSYSM240M._data.length;
     var dataSourceTotal = grdSYSM240M.dataSource.total();
     var data = grdSYSM240M.dataSource.pageSize(dataSourceTotal);
	
     grdSYSM240M.bind("excelExport", function(e) {
		e.workbook.fileName = "메타관리항목.xlsx";

		var sheet = e.workbook.sheets[0];
		var template01 = kendo.template(this.columns[1].template);
		var template02 = kendo.template(this.columns[5].template);
		var template03 = kendo.template(this.columns[7].template);
			
		var sheet = e.workbook.sheets[0];
		   for (var i = 1; i < sheet.rows.length; i++) {
			   var row = sheet.rows[i];

			   var dataItem = {
					   mgntItemTypCd	: row.cells[0].value,
					   dmnCd			: row.cells[4].value,
					   linkTblId		: row.cells[6].value
			   };

			   var SYSM240M_template01 = template01(dataItem);
			   var SYSM240M_template02 = template02(dataItem);
			   var SYSM240M_template03 = template03(dataItem);

			   row.cells[0].value = SYSM240M_template01;
			   row.cells[4].value = SYSM240M_template02;
			   row.cells[6].value = SYSM240M_template03;
		   }
	});
     
     grdSYSM240M.saveAsExcel();
     grdSYSM240M.dataSource.pageSize(pageSize); 

}

function GridResizeTableSYSM240M() {   
	let screenHeight = $(window).height()-240;     //(헤더+ 푸터 ) 영역 높이 제외
	$("#grdSYSM240M").find('.k-grid-content').css('height', screenHeight-340);  
}


//관리항목 코드 중복 체크
$('#grSYSM240M button[name=btnMgtItemChk]').on('click', function () {
	let SYSM240M_mgntItemCd    = $('#grSYSM240M input[name=mgntItemCd]').val().toUpperCase(); //2022.11.21 sukim 대문자
	if(!SYSM240M_mgntItemCd){
		Utils.alert(SYSM240M_langMap.get("SYSM240M.alert.mgntItemCdVal"));
		return;
	}
	let data ={
		mgntItemCd : SYSM240M_mgntItemCd
	};

	let SYSM240M_jsonStr = JSON.stringify(data);
	$.ajax({
		url: '/bcs/sysm/SYSM240SEL03',
		type:'post',
		dataType : 'json',
		contentType : 'application/json; charset=UTF-8',
		data : SYSM240M_jsonStr,
		success : function(data){
			if(data.flag > 0){
				Utils.alert(SYSM240M_langMap.get("SYSM240M.alert.checkDup3"));
			}else{
				Utils.alert(SYSM240M_langMap.get("SYSM240M.alert.checkDup4"));
				SYSM240M_chkMgnt = true;
			}
		},
		error :function(request,status, error){
			console.log("[error]");
			console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	})
});

$('input[name=mgntItemCd], input[name=mgntItemCdNm]').on("keyup",function(key){
	if(key.keyCode==13) {
		SYSM240M_fnSearchMetaList();
	}
});

// 삭제
$('#SYSM240M_btnDel').on('click', function newReg() {
	
	//2022.11.21 sukim 삭제 하시겠습니까? 앞으로 꺼냄.
	if(!Utils.isNull(SYSM240M_chkAbol) && SYSM240M_chkAbol =='D'){
		Utils.alert(SYSM240M_langMap.get("SYSM240M.alert.doNotDel"));
		return;
	}
	
	Utils.confirm(SYSM240M_langMap.get("SYSM240M.btnDel.confirm"), function(){ // 삭제 하시겠습니까?
		let grSYSM240M_data = {
			mgntItemCd       	:  $('#grSYSM240M input[name=mgntItemCd]').val().toUpperCase(), //2022.11.21 sukim 대문자
			mlingCd				: GLOBAL.session.user.mlingCd
		}
		let grSYSM240M_jsonStr = JSON.stringify(grSYSM240M_data);

		$.ajax({
			url: '/bcs/sysm/SYSM240SEL04',
			type:'post',
			dataType : 'json',
			contentType : 'application/json; charset=UTF-8',
			data : grSYSM240M_jsonStr,
			success : function(data){
				if(data.result>0){
					Utils.confirm(SYSM240M_langMap.get("SYSM240M.alert.delete"), function(){ // 삭제 하시겠습니까?
						SYSM240M_fnDelPhysical();
					});
				}else{
					SYSM240M_fnDelPhysical();
				}
			},
			error :function(request,status, error){
				console.log("[error]");
				console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
			}
		});
	});
});

function SYSM240M_fnDelPhysical(){
		let grSYSM240M_data = {
			mgntItemCd       	:  $('#grSYSM240M input[name=mgntItemCd]').val().toUpperCase(), //2022.11.21 sukim 대문자
			mlingCd				: GLOBAL.session.user.mlingCd
		}
		let grSYSM240M_jsonStr = JSON.stringify(grSYSM240M_data);

		$.ajax({
		url: '/bcs/sysm/SYSM240DEL01',
		type:'post',
		dataType : 'json',
		contentType : 'application/json; charset=UTF-8',
		data : grSYSM240M_jsonStr,
		success : function(data){
			Utils.alert(SYSM240M_langMap.get("success.common.delete"));
			SYSM240M_fnSearchMetaList();
		},
		error :function(request,status, error){
			console.log("[error]");
			console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
}