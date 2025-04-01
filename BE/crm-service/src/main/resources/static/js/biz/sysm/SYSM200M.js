/***********************************************************************************************
 * Program Name : 사용자정보 - 메인(SYSM200M.js)
 * Creator      : 허해민
 * Create Date  : 2022.01.25
 * Description  : 사용자정보 - 메인
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.01.25     허해민           최초작성  
 * 2022.04.10     sukim            전반적인 수정    
 ************************************************************************************************/
var SYSM200MDataSource,grdSYSM200M;
var SYSM200M_selectedTab = 1;
var defaultImgPath = "/images/contents/person.png";
var Mode = 'new';

var SYSM200MTab = $("#SYSM200MTab").kendoTabStrip({
	animation: false,
	dataTextField: "Name",
	dataContentField: "content", 
	dataContentUrlField: "contentUrl",
	contentLoad: MAINFRAME.onTabContentLoad,
	dataSource: [ 
		{Name: SYSM200M_langMap.get("SYSM200M.tab1"), contentUrl: GLOBAL.contextPath+"/sysm/SYSM210T"},
		{Name: SYSM200M_langMap.get("SYSM200M.tab2"), contentUrl: GLOBAL.contextPath+"/sysm/SYSM220T"},
	],
	value: SYSM200M_langMap.get("SYSM200M.tab1"),
	activate: function(){
		if(this.select().index() == 0){
			SYSM200M_selectedTab = 1;
			SYSM210T_fnSetCnslGrpCombo($('#SYSM200M_tenantId').val());
		}else{
			SYSM220T_fnSetKendoGrid();
			SYSM200M_selectedTab = 2;
		}
	}
});


$(document).ready(function () {
	
	SYSM200M_fnSetKendoGrid();
	
	GridResizeTableSYSM200M();
	
	$(window).on({ 
		'resize': function() {
			GridResizeTableSYSM200M();   
		},   
	});
	
	SYSM200M_fnSelectCombo();

	// 2023. 05. 25 사용자 등급 900,910 이하에서는 확장정보 조회X
	//2024.03.06 : 800  권한 추가
	if ((GLOBAL.session.user.usrGrd != "900" && GLOBAL.session.user.usrGrd != "910" && GLOBAL.session.user.usrGrd != "800")) {
		$('#SYSM200MTab-tab-2').remove("li:last");
	}
});

function SYSM200M_fnInitTenent(){
	
	$('#SYSM200M_tenantId').val(GLOBAL.session.user.tenantId);
	$('#SYSM200M_tenantNm').val(GLOBAL.session.user.fmnm);
	
	if(GLOBAL.session.user.tenantId === 'BRD'){
		$('#SYSM200M input[name=SYSM200M_tenantId]').prop('disabled', false);
		$('#SYSM200M button[name="SYSM200M_searchTenant"]').prop('disabled', false);     
	}else{
		$('#SYSM200M input[name=SYSM200M_tenantId]').prop('disabled', true);
		$('#SYSM200M button[name="SYSM200M_searchTenant"]').prop('disabled', true);         
	
	}
	//사용자 목록 조회
	SYSM200M_fnSearchUserList();
}

function SYSM200M_fnSetTenentName(){
	$('#SYSM200M_tenantId').blur(function(event) {
		let check = $('#SYSM200M_tenantId').val().toUpperCase();
		if(check.length == 0){
			$('#SYSM200M_tenantNm').val('');
		}		
    });
	$("#SYSM200M_tenantId").on("propertychange change keyup paste input", function() {
		let currentVal = $(this).val().toUpperCase();
		if(currentVal.length >=3){
	    	$('#SYSM200M_tenantId').val(currentVal);
		    SYSM200M_SearchTenantNm();
	    }			
	});		
	
	SYSM200M_fnInitTenent();
}

function SYSM200M_fnSelectCombo(){
	let SYSM200M_data = { 
	"codeList": [
		{"mgntItemCd":"C0024"},
		{"mgntItemCd":"C0190"}	
	]};
	Utils.ajaxCall('/comm/COMM100SEL01', JSON.stringify(SYSM200M_data), function (result) {
		let SYSM200M_cmmCodeList = JSON.parse(result.codeList);
		Utils.setKendoComboBox(SYSM200M_cmmCodeList, "C0190", "#SYSM200M_retireYn", "");
		SYSM200M_fnMakeOrgMultiSelect();

		// 2023. 05. 25 사용자 등급 900,910 이하에서는 시스템 운영자, 개발자가 조회되지 X
		if(GLOBAL.session.user.usrGrd=='900' || GLOBAL.session.user.usrGrd == '910'){
			Utils.setKendoMultiSelect(SYSM200M_cmmCodeList, "C0024", '#SYSM200M input[name=SYSM200M_usrGrdMultiSelect]', false, "");
		}else{
			let SYSM200M_cobStCombo = [];
			let cnslCd = ['910', '900'];
			SYSM200M_cmmCodeList.forEach(function(val) {
				if(val.mgntItemCd == "C0024" && !cnslCd.includes(val.comCd)){
					let SYSM200M_comb = {"comCd" : val.comCd, "comCdNm" : val.comCdNm ,  mgntItemCd:"C0024"};
					SYSM200M_cobStCombo.push(SYSM200M_comb)
				}
			});
			Utils.setKendoMultiSelect(SYSM200M_cobStCombo, "C0024", '#SYSM200M input[name=SYSM200M_usrGrdMultiSelect]', false, "");
		}

		//태넌트 명 세팅
	    //SYSM200M_fnSetTenentName();
		CMMN_SEARCH_TENANT["SYSM200M"].fnInit(null,SYSM200M_fnSearchUserList);
	});
}

function SYSM200M_fnMakeOrgMultiSelect(){
	let multiSelectDataSourceInit = [];
	let multiSelectOptionInit = {
	        dataTextField: "text",
	        dataValueField: "value",
	        dataSource: multiSelectDataSourceInit,
	        placeholder: SYSM200M_langMap.get("input.select"),
	        autoClose: false,
	        clearButton: false,
	        tagMode: "single",
	        height: 200
	    };
	let SYSM200M_OrgMultiSelect = $("#SYSM200M input[name=SYSM200M_OrgMultiSelect]").kendoMultiSelect(multiSelectOptionInit).data("kendoMultiSelect");
	let SYSM200M_UsrMultiSelect = $("#SYSM200M input[name=SYSM200M_UsrMultiSelect]").kendoMultiSelect(multiSelectOptionInit).data("kendoMultiSelect");
	SYSM200M_OrgMultiSelect.ul.addClass('multiSelect');
	SYSM200M_UsrMultiSelect.ul.addClass('multiSelect');
}

function SYSM200M_fnSetKendoGrid(){
	SYSM200MDataSource = {
			transport: {
				read	: function (SYSM200M_jsonStr) {
					if(Utils.isNull(SYSM200M_jsonStr.data)){
						Utils.ajaxCall('/sysm/SYSM200SEL01', SYSM200M_jsonStr, SYSM200M_resultUserList, 
								window.kendo.ui.progress($("#grdSYSM200M"), true), window.kendo.ui.progress($("#grdSYSM200M"), false));
					}else{
						window.kendo.ui.progress($("#grdSYSM200M"), false);
					}
				}	
			},
			schema : {
				type: "json",
				model: {
					fields: {
						tenantId  : {field: "tenantId" ,type: "string"},
						usrId     : {field: "usrId"    ,type: "string"},
						decUsrNm  : {field: "decUsrNm" ,type: "string"},
						orgPath   : {field: "orgPath"  ,type: "string"},
						usrGrdNm  : {field: "usrGrdNm" ,type: "string"},
						acStCdNm  : {field: "acStCdNm" ,type: "string"},
						orgCd     : {field: "orgCd"    ,type: "string"},
					}  
				}
			}  
		}
		$("#grdSYSM200M").kendoGrid({
		  DataSource : SYSM200MDataSource,
		  autoBind: false,
		  sortable: true,
	      sort: function (e) {
	          if (SYSM200MDataSource.dataSource.total() === 0) {
	              e.preventDefault();
	          }
	      },
		  resizable: true,
		  scrollable: true,
		  noRecords: {template: '<div class="nodataMsg"><p>'+SYSM200M_langMap.get("grid.nodatafound")+'</p></div>'},
		  pageable: {
			    refresh:false,
	            buttonCount: 10,
	            pageSize: 50,
		        messages: {empty: SYSM200M_langMap.get("fail.common.select")}
		  },
		  dataBinding: function() {
			record = (this.dataSource.page() -1) * this.dataSource.pageSize();	
		  },
		  dataBound: SYSM200M_onDataBound,
		  columns: [ 
				//{ width: '20px', title: 'No',  hiddenExcel:true, template: "#= ++record #"},
				{ width: '20px', template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>'}, 
				{ width: '40px', type: "string", title: SYSM200M_langMap.get("SYSM200M.tenantId"), field: "tenantId"}, 			
				{ width: '40px', type: "string", title: SYSM200M_langMap.get("SYSM200M.usrId"),    field: "usrId"}, 
				{ width: '65px', type: "string", title: SYSM200M_langMap.get("SYSM200M.usrNm"),    field: "decUsrNm", attributes : { style : "text-align : left;" }}, 
				{ width: '170px',type: "string", title: SYSM200M_langMap.get("SYSM200M.orgPath"),  field: "orgPath",  attributes : { style : "text-align : left;" }},
				{ width: '65px', type: "string", title: SYSM200M_langMap.get("SYSM200M.usrGrdNM"), field: "usrGrdNm", attributes : { style : "text-align : left;" }},		
				{ width: '35px', type: "string", title: SYSM200M_langMap.get("SYSM200M.acStCd"),   field: "acStCdNm", },
				{ width: '20px', type: "string", field: "orgCd", hidden: true,}
				],
		  selectable: true		
		});
		grdSYSM200M = $("#grdSYSM200M").data("kendoGrid");	
}

//조회
function SYSM200M_fnSearchUserList(nType) {
	
	//kw---20250314 : 사용자관리 수정
	//kw---20250314 : 조회 버튼 클릭 시 사용자정보 목록의 첫번째 아이템 클릭
	if(!Utils.isNull(nType)){
		$("#SYSM210T_usrId").val("");
	}
	
	let SYSM200M_tenantId = $('#SYSM200M_tenantId').val();
	if(SYSM200M_tenantId == ''){
		Utils.alert(SYSM200M_langMap.get("aicrm.message.tenantInfo"));
		return;
	}
	let orgList=[], usrList=[], usrGrd=[];
	orgList=$('#SYSM200M input[name=SYSM200M_OrgMultiSelect]').data("kendoMultiSelect").value();
	usrList=$('#SYSM200M input[name=SYSM200M_UsrMultiSelect]').data("kendoMultiSelect").value();
	usrGrd=$('#SYSM200M input[name=SYSM200M_usrGrdMultiSelect]').data("kendoMultiSelect").value();
	let SYSM200M_retireYn = $('#SYSM200M input[name=SYSM200M_retireYn]').data("kendoComboBox").dataItem()
	let SYSM200M_data = {
			"tenantId": SYSM200M_tenantId,
			"retireYn": SYSM200M_retireYn.value, 
			"usrList" : usrList,
			"usrGrd"  : usrGrd,  
			"orgList" : orgList,
			// 2023. 05. 25 사용자 등급 900,910 이하에서는 시스템관리자, 개발자 조회 X
			"originUsrGrd" : GLOBAL.session.user.originUsrGrd
	};
	SYSM200MDataSource.transport.read(JSON.stringify(SYSM200M_data));
}

function SYSM200M_resultUserList(SYSM200M_resultData){
	var SYSM200M_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(SYSM200M_resultData.SYSM200SEL01List)));
	var SYSM200M_jsonDecodeCount = JSON.parse(JSON.parse(JSON.stringify(SYSM200M_resultData.SYSM200SEL01ListCount)));

	grdSYSM200M.dataSource.data(SYSM200M_jsonDecode);
	grdSYSM200M.dataSource.options.schema.data = SYSM200M_jsonDecode;
	
	if(Number(SYSM200M_jsonDecodeCount) == 0){
		//Utils.alert(SYSM200M_langMap.get("fail.common.select"));
		SYSM210T_InitForm();
	}else{
		if(Mode == 'new'){
			grdSYSM200M.select('tr:eq(0)');
			var selected = [];
			grdSYSM200M.select().each(function(){
			    selected.push(grdSYSM200M.dataItem(this));
			});
			var param1, param2, param3 = '';
			for(var i = 0; i<selected.length; i++){
				param1 = selected[i].tenantId;
				param2 = selected[i].usrId;
				param3 = selected[i].orgCd;
			}
			if(param1.length > 0 && param2.length > 0 && param3.length >0){
				fnSearchFirstRow(param1,param2,param3);
			}
		}		
	}
	
	//kw---20250314 : 사용자관리 수정
	//kw---20250314 : 사용자목록 조회 시 첫번째 아이템 또는, 선택된 아이템 클릭(스크롤 위치 변경)
	grdSYSM200M.select("tr:eq(0)");
	$.each(grdSYSM200M.dataSource.data(), function(index, item){
		if(item.usrId == $("#SYSM210T_usrId").val()){
			grdSYSM200M.select("[data-uid=" + item.uid + "]");
		}
	});
	grdSYSM200M.select().trigger("click");

	// 스크롤 위치 계산
	let scrollContent = $("#grdSYSM200M").find(".k-grid-content");
	let scrollContentOffset = scrollContent.offset().top;
	let selectContentOffset = grdSYSM200M.select().offset().top;
	let distance = selectContentOffset - scrollContentOffset;

	// 스크롤 애니메이션
	scrollContent.animate({
		scrollTop: scrollContent.scrollTop() + distance
	}, 300);
	//kw---20250314 : 사용자관리 수정 끝
}

//조회 결과가 없을 때 기본정보 초기화
function SYSM210T_InitForm(){
	$('#SYSM210T input[name=SYSM210T_usrId]').val("");
	$('#SYSM210T input[name=SYSM210T_usrId]').prop('disabled', false);
	$('#SYSM210T input[name=SYSM210T_tenantId]').val("");
	$('#SYSM210T input[name=SYSM210T_tenantId]').prop('disabled', false);
	$('#SYSM210T input[name=SYSM210T_scrtNo]').val("");
	$('#SYSM210T input[name=SYSM210T_scrtNo]').prop('disabled', true);
	$('#SYSM210T_validMsg').text(''); 
	
	$('#SYSM210T input[name=SYSM210T_cnslGrpCd').data("kendoComboBox").value("");
	$('#SYSM210T input[name=SYSM210T_acStCd]').data("kendoComboBox").value("");
	$('#SYSM210T input[name=SYSM210T_lastChangeDate]').val("");
	$('#SYSM210T input[name=SYSM210T_scrtNoOverDays]').val("");
	$('#SYSM210T input[name=SYSM210T_pwErrTcnt]').val("");
	$('#SYSM210T input[name=SYSM210T_usrNm]').val("");	
	$('#SYSM210T input[name=SYSM210T_usrAlnm]').val("");
	$('#SYSM210T input[name=SYSM210T_usrAlnm]').prop('disabled', true);
	$('#SYSM210T input[name=SYSM210T_usrAlnmUseYn]').prop('checked', false);
	$('#SYSM210T input[name=SYSM210T_orgCd]').val("");
	$('#SYSM210T input[name=SYSM210T_orgPath]').val("");
	$('#SYSM210T input[name=SYSM210T_usrGrd]').data("kendoComboBox").value("");
	$('#SYSM210T input[name=SYSM210T_cntyCd]').data("kendoComboBox").value(GLOBAL.session.user.cntyCd);
	$('#SYSM210T input[name=SYSM210T_mbphNo]').val("");
	$('#SYSM210T_qualAcqsDd').val(kendo.format("{0:yyyy-MM-dd}",new Date()));
	$('#SYSM210T_qualLossDd').val(kendo.format("{0:yyyy-MM-dd}",kendo.date.addDays(new Date(), 365)));	
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
	Mode = 'new';
}

function SYSM211M_fnUsrPopup() {
	Utils.setCallbackFunction("SYSM200M_fnUsrCallback", SYSM200M_fnUsrCallback);
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM211P", "SYSM211P" , 960, 535, {callbackKey: "SYSM200M_fnUsrCallback", tenantId : $('#SYSM200M_tenantId').val() });
}

function SYSM200M_fnUsrCallback(SYSM200M_usrItem) {
    let reformattedArray = SYSM200M_usrItem.map(function (obj) {
        let rObj = {};
        for (const [key, value] of Object.entries(obj)) {
            rObj[key] = value
        }
        return rObj;
    });
    SYSM200M_setKendoMultiSelect(reformattedArray, '#SYSM200M input[name=SYSM200M_UsrMultiSelect]', 'decUsrNm', 'usrId');
}

function SYSM200M_setKendoMultiSelect(codeList, target, setText, setValue) {
    let options = {
        placeholder: "",
        dataTextField: "text",
        dataValueField: "value",
        autoClose: false,
        autoBind: false,
        clearButton: false,
        tagMode: "single",
        downArrow: false,
        height: 200,
        dataSource: codeList.filter(function (code) {
            try {
                if (code[setText] && code[setValue]) {
                    code.text = code[setText]
                    code.value = code[setValue]
                    return code;
                }
            } catch (e) {
                console.log("SYSM200M_setKendoMultiSelect error : " + e);
            }
        }),      
        itemTemplate: '<p class="multiCheck">#: text #</p>',
    };
    let kendoMultiSelect = $(target).kendoMultiSelect(options).data("kendoMultiSelect");
    kendoMultiSelect.ul.addClass('multiSelect');
    kendoMultiSelect.dataSource.filter({});
    kendoMultiSelect.value(options.dataSource);
    return kendoMultiSelect;
}

//function SYSM200M_fnTenantsPopup(){
//	Utils.setCallbackFunction("SYSM200M_fnTenantCallBack", SYSM200M_fnTenantCallBack);
//	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM101P", "SYSM101P", 1200, 595, {callbackKey:"SYSM200M_fnTenantCallBack"});	
//}

//function SYSM200M_fnTenantCallBack(SYSM200M_tenantItem){
//	let SYSM200M_tenantCheck = SYSM200M_tenantItem.toUpperCase();
//	if(SYSM200M_tenantCheck.length >= 3){
//		$('#SYSM200M_tenantId').val(SYSM200M_tenantCheck);
//		SYSM200M_SearchTenantNm();
//	}	
//}

function SYSM200M_SearchTenantNm() {
	let SYSM200M_tenantId 	=  $('#SYSM200M_tenantId').val();
	if(SYSM200M_tenantId == ''){
		Utils.alert(SYSM200M_langMap.get("aicrm.message.tenantInfo"));
		return;
	}	
	GetTenantNm(SYSM200M_tenantId,'SYSM200M_tenantNm');
}

function SYSM210M_fnOrgPopup(){
	Utils.setCallbackFunction("SYSM200M_fnOrgPopupCallBack", SYSM200M_fnOrgPopupCallBack);
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM210P", "SYSM210P", 410, 590, {callbackKey:"SYSM200M_fnOrgPopupCallBack"});
}

function SYSM200M_fnOrgPopupCallBack(SYSM200M_orgItem){
	SYSM200M_setKendoMultiSelect(SYSM200M_orgItem, '#SYSM200M input[name=SYSM200M_OrgMultiSelect]', 'orgPath', 'orgCd');
}

function SYSM200M_onDataBound(e) {
	$("#grdSYSM200M").off('click').on('click','tbody tr[data-uid]',function (e) {
		$("#SYSM200MTab").data("kendoTabStrip").select(0);
		SYSM200M_selectedTab = 1;
		let SYSM200M_cell = $(e.currentTarget);
		let SYSM200M_item = grdSYSM200M.dataItem(SYSM200M_cell.closest("tr"));
		let SYSM200M_param = {
				tenantId  : SYSM200M_item.tenantId,
				usrId 	  : SYSM200M_item.usrId,
				orgCd 	  : SYSM200M_item.orgCd
		};
		
		SYSM210T_mode = "Old";
		
		//화면에 표시 된 에러 표시 삭제
		SYSM210T_fnRemoveInputError();
		
		//사용자 기본정보 : 테넌트ID
		SYSM210T_fnSetCnslGrpCombo($('#SYSM200M_tenantId').val());
		
		Utils.ajaxCall('/sysm/SYSM200SEL02', JSON.stringify(SYSM200M_param), function (SYSM200M_result) {
			let SYSM200M_jsonDecode = "";
			SYSM200M_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(SYSM200M_result.SYSM200SEL02Result)));
			SYSM210T_fnBtnCtrl('list');
			
			$('#SYSM210T input[name=SYSM210T_usrId]').val(SYSM200M_jsonDecode.usrId);
			$('#SYSM210T input[name=SYSM210T_tenantId]').val(SYSM200M_jsonDecode.tenantId);
			$('#SYSM210T input[name=SYSM210T_scrtNo]').val(SYSM200M_jsonDecode.scrtNo);//비밀번호
			$('#SYSM210T input[name=SYSM210T_scrtNo]').prop('disabled', true);  //비밀번호(수정가능)
			//$('#SYSM210T input[name=SYSM210T_scrtNo_bfth]').val(SYSM200M_jsonDecode.decScrtNo);//비밀번호
			$('#SYSM210T input[name=SYSM210T_cnslGrpCd]').data("kendoComboBox").value(SYSM200M_jsonDecode.cnslGrpCd); //2023.01.17 : 상담그룹 (서비스 운영 IF 맵핑)
			$('#SYSM210T input[name=SYSM210T_acStCd]').data("kendoComboBox").value(SYSM200M_jsonDecode.acStCd);
			$('#SYSM210T input[name=SYSM210T_lastChangeDate]').val(SYSM200M_jsonDecode.scrtNoLstUpdDtm);
			$('#SYSM210T input[name=SYSM210T_scrtNoOverDays]').val(SYSM200M_jsonDecode.scrtNoOverDays + " " + SYSM200M_langMap.get("SYSM200M.elapsed.days"));
			$('#SYSM210T input[name=SYSM210T_pwErrTcnt]').val(SYSM200M_jsonDecode.pwErrTcnt);
			$('#SYSM210T input[name=SYSM210T_usrNm]').val(SYSM200M_jsonDecode.decUsrNm);
			$('#SYSM210T input[name=SYSM210T_usrAlnm]').prop('disabled', SYSM200M_jsonDecode.usrAlnmUseYn == "Y" ? false:true);
			$('#SYSM210T input[name=SYSM210T_usrAlnmUseYn]').prop('checked', SYSM200M_jsonDecode.usrAlnmUseYn == "Y" ? true:false);
			$('#SYSM210T input[name=SYSM210T_usrAlnm]').val(SYSM200M_jsonDecode.usrAlnm);
			$('#SYSM210T input[name=SYSM210T_orgCd]').val(SYSM200M_jsonDecode.orgCd);
			$('#SYSM210T input[name=SYSM210T_orgPath]').val(SYSM200M_jsonDecode.orgPath);
			$('#SYSM210T input[name=SYSM210T_cntyCd]').data("kendoComboBox").value(SYSM200M_jsonDecode.cntyCd);
			$('#SYSM210T input[name=SYSM210T_mbphNo]').val(SYSM200M_jsonDecode.decMbphNo);
			$('#SYSM210T input[name=SYSM210T_emlAddrIsd]').val(SYSM200M_jsonDecode.decEmlAddrIsd);
			$('#SYSM210T input[name=SYSM210T_emlAddrIsdDmn]').val(SYSM200M_jsonDecode.emlAddrIsdDmnCd == "100" ? SYSM200M_jsonDecode.emlAddrIsdDmn:"");
			$('#SYSM210T input[name=SYSM210T_emlAddrIsdDmnCd]').data("kendoComboBox").value(SYSM200M_jsonDecode.emlAddrIsdDmnCd);
			$('#SYSM210T input[name=SYSM210T_emlAddrIsdDmn]').prop('disabled', SYSM200M_jsonDecode.emlAddrIsdDmnCd == "100" ? false:true);
			$('#SYSM210T input[name=SYSM210T_emlAddrExtn]').val(SYSM200M_jsonDecode.decEmlAddrExtn);
			$('#SYSM210T input[name=SYSM210T_emlAddrExtnDmn]').val(SYSM200M_jsonDecode.emlAddrExtnDmnCd == "100" ? SYSM200M_jsonDecode.emlAddrExtnDmn:"");
			$('#SYSM210T input[name=SYSM210T_emlAddrExtnDmnCd]').data("kendoComboBox").value(SYSM200M_jsonDecode.emlAddrExtnDmnCd);
			$('#SYSM210T input[name=SYSM210T_emlAddrExtnDmn]').prop('disabled', SYSM200M_jsonDecode.emlAddrExtnDmnCd == "100" ? false:true);			
			$('#SYSM210T input[name=SYSM210T_usrGrd]').data("kendoComboBox").value(SYSM200M_jsonDecode.usrGrd);
			$('#SYSM210T_qualAcqsDd').val(kendo.format("{0:yyyy-MM-dd}",new Date(SYSM200M_jsonDecode.qualAcqsDd)));
			$('#SYSM210T_qualLossDd').val(kendo.format("{0:yyyy-MM-dd}",new Date(SYSM200M_jsonDecode.qualLossDd)));
			$('#SYSM210T input[name=SYSM210T_ctiUseYn]').prop('checked', SYSM200M_jsonDecode.ctiUseYn == "Y" ? true:false);
			$('#SYSM210T input[name=SYSM210T_ctiAgenId]').val(SYSM200M_jsonDecode.ctiAgenId);
			$('#SYSM210T input[name=SYSM210T_useTermIpAddr]').val(SYSM200M_jsonDecode.useTermIpAddr);
			$('#SYSM210T input[name=SYSM210T_extNo]').val(SYSM200M_jsonDecode.extNo);	
			$('#SYSM210T input[name=SYSM210T_kldCtgrCreAtht]').prop('checked', SYSM200M_jsonDecode.unfyBlbdCreAthtYn == "Y" ? true:false);
			$('#SYSM210T input[name=SYSM210T_unfyBlbdCreAthtYn]').prop('checked', SYSM200M_jsonDecode.kldCtgrCreAtht == "Y" ? true:false);
			$('#SYSM210T input[name=SYSM210T_athtLvlOrgCd]').data("kendoComboBox").value(SYSM200M_jsonDecode.athtLvlOrgCd);
			$('#SYSM210T input[name=SYSM210T_athtLvlDtCd]').data("kendoComboBox").value(SYSM200M_jsonDecode.athtLvlDtCd);
			$('#SYSM210T input[name=SYSM210T_kldScwdSaveYn]').prop('checked', SYSM200M_jsonDecode.kldScwdSaveYn == "Y" ? true:false);
			$('#SYSM210T input[name=SYSM210T_autoPfcnUseYn]').prop('checked', SYSM200M_jsonDecode.autoPfcnUseYn == "Y" ? true:false);
			$('#SYSM210T input[name=SYSM210T_cmmtSetlmnYn]').prop('checked', SYSM200M_jsonDecode.cmmtSetlmnYn == "Y" ? true:false);
			$('#SYSM210T input[name=SYSM210T_kldMgntSetlmnYn]').prop('checked', SYSM200M_jsonDecode.kldMgntSetlmnYn == "Y" ? true:false);
			
			if(SYSM200M_jsonDecode.potoImgIdxFileNm == "" || SYSM200M_jsonDecode.potoImgIdxFileNm == null){
				fnSetDefaultImage();
			}else{
				$("#usrImg").attr({ src: "/bcs/photo/" +  SYSM200M_jsonDecode.tenantId + "/" + SYSM200M_jsonDecode.potoImgIdxFileNm});
				var userImg = document.querySelector("#usrImg");
				if(fnUrlExists(userImg.src) == 404){
					fnSetDefaultImage();
				}else{
					$("#usrImg").attr({ src: "/bcs/photo/" +  SYSM200M_jsonDecode.tenantId + "/" + SYSM200M_jsonDecode.potoImgIdxFileNm});
				}
			}
			
			$('#SYSM210T input[name=SYSM210T_potoImgIdxFileNm]').val(SYSM200M_jsonDecode.potoImgIdxFileNm);
			$('#SYSM210T input[name=SYSM210T_potoImgPsn]').val(SYSM200M_jsonDecode.potoImgPsn);	
			$('#SYSM210T_validMsg').text(''); 
		});
	})
}

function fnSearchFirstRow(t1,t2,t3){
	let SYSM200M_param = {
			tenantId  : t1,
			usrId 	  : t2,
			orgCd 	  : t3
	};	
	Utils.ajaxCall('/sysm/SYSM200SEL02', JSON.stringify(SYSM200M_param), function (SYSM200M_result) {
		let SYSM200M_jsonDecode = "";
		SYSM200M_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(SYSM200M_result.SYSM200SEL02Result)));
		SYSM210T_fnBtnCtrl('list');
		$('#SYSM210T input[name=SYSM210T_usrId]').val(SYSM200M_jsonDecode.usrId);
		$('#SYSM210T input[name=SYSM210T_tenantId]').val(SYSM200M_jsonDecode.tenantId);
		$('#SYSM210T input[name=SYSM210T_scrtNo]').val(SYSM200M_jsonDecode.scrtNo);
		//$('#SYSM210T input[name=SYSM210T_scrtNo_bfth]').val(SYSM200M_jsonDecode.decScrtNo);
		$('#SYSM210T input[name=SYSM210T_acStCd]').data("kendoComboBox").value(SYSM200M_jsonDecode.acStCd);
		$('#SYSM210T input[name=SYSM210T_cnslGrpCd]').data("kendoComboBox").value(SYSM200M_jsonDecode.cnslGrpCd);		//2023.01.17 : 상담그룹 (서비스 운영 IF 맵핑)
		$('#SYSM210T input[name=SYSM210T_lastChangeDate]').val(SYSM200M_jsonDecode.scrtNoLstUpdDtm);
		$('#SYSM210T input[name=SYSM210T_scrtNoOverDays]').val(SYSM200M_jsonDecode.scrtNoOverDays + " " + SYSM200M_langMap.get("SYSM200M.elapsed.days"));
		$('#SYSM210T input[name=SYSM210T_pwErrTcnt]').val(SYSM200M_jsonDecode.pwErrTcnt);
		$('#SYSM210T input[name=SYSM210T_usrNm]').val(SYSM200M_jsonDecode.decUsrNm);
		$('#SYSM210T input[name=SYSM210T_usrAlnm]').val(SYSM200M_jsonDecode.usrAlnm);
		$('#SYSM210T input[name=SYSM210T_usrAlnm]').prop('disabled', SYSM200M_jsonDecode.usrAlnmUseYn == "Y" ? false:true);
		$('#SYSM210T input[name=SYSM210T_usrAlnmUseYn]').prop('checked', SYSM200M_jsonDecode.usrAlnmUseYn == "Y" ? true:false);
		$('#SYSM210T input[name=SYSM210T_orgCd]').val(SYSM200M_jsonDecode.orgCd);
		$('#SYSM210T input[name=SYSM210T_orgPath]').val(SYSM200M_jsonDecode.orgPath);
		$('#SYSM210T input[name=SYSM210T_cntyCd]').data("kendoComboBox").value(SYSM200M_jsonDecode.cntyCd);
		$('#SYSM210T input[name=SYSM210T_mbphNo]').val(SYSM200M_jsonDecode.decMbphNo);
		$('#SYSM210T input[name=SYSM210T_emlAddrIsd]').val(SYSM200M_jsonDecode.decEmlAddrIsd);
		$('#SYSM210T input[name=SYSM210T_emlAddrIsdDmn]').val(SYSM200M_jsonDecode.emlAddrIsdDmnCd == "100" ? SYSM200M_jsonDecode.emlAddrIsdDmn:"");
		$('#SYSM210T input[name=SYSM210T_emlAddrIsdDmnCd]').data("kendoComboBox").value(SYSM200M_jsonDecode.emlAddrIsdDmnCd);
		$('#SYSM210T input[name=SYSM210T_emlAddrIsdDmn]').prop('disabled', SYSM200M_jsonDecode.emlAddrIsdDmnCd == "100" ? false:true);
		$('#SYSM210T input[name=SYSM210T_emlAddrExtn]').val(SYSM200M_jsonDecode.decEmlAddrExtn);
		$('#SYSM210T input[name=SYSM210T_emlAddrExtnDmn]').val(SYSM200M_jsonDecode.emlAddrExtnDmnCd == "100" ? SYSM200M_jsonDecode.emlAddrExtnDmn:"");
		$('#SYSM210T input[name=SYSM210T_emlAddrExtnDmnCd]').data("kendoComboBox").value(SYSM200M_jsonDecode.emlAddrExtnDmnCd);
		$('#SYSM210T input[name=SYSM210T_emlAddrExtnDmn]').prop('disabled', SYSM200M_jsonDecode.emlAddrExtnDmnCd == "100" ? false:true);
		$('#SYSM210T input[name=SYSM210T_usrGrd]').data("kendoComboBox").value(SYSM200M_jsonDecode.usrGrd);
		$('#SYSM210T input[name=SYSM210T_qualAcqsDd]').val(kendo.format("{0:yyyy-MM-dd}",new Date(SYSM200M_jsonDecode.qualAcqsDd)));
		$('#SYSM210T input[name=SYSM210T_qualLossDd]').val(kendo.format("{0:yyyy-MM-dd}",new Date(SYSM200M_jsonDecode.qualLossDd)));
		$('#SYSM210T input[name=SYSM210T_ctiUseYn]').prop('checked', SYSM200M_jsonDecode.ctiUseYn == "Y" ? true:false);
		$('#SYSM210T input[name=SYSM210T_ctiAgenId]').val(SYSM200M_jsonDecode.ctiAgenId);
		$('#SYSM210T input[name=SYSM210T_useTermIpAddr]').val(SYSM200M_jsonDecode.useTermIpAddr);
		$('#SYSM210T input[name=SYSM210T_extNo]').val(SYSM200M_jsonDecode.extNo);	
		$('#SYSM210T input[name=SYSM210T_kldCtgrCreAtht]').prop('checked', SYSM200M_jsonDecode.unfyBlbdCreAthtYn == "Y" ? true:false);
		$('#SYSM210T input[name=SYSM210T_unfyBlbdCreAthtYn]').prop('checked', SYSM200M_jsonDecode.kldCtgrCreAtht == "Y" ? true:false);
		$('#SYSM210T input[name=SYSM210T_athtLvlOrgCd]').data("kendoComboBox").value(SYSM200M_jsonDecode.athtLvlOrgCd);
		$('#SYSM210T input[name=SYSM210T_athtLvlDtCd]').data("kendoComboBox").value(SYSM200M_jsonDecode.athtLvlDtCd);
		$('#SYSM210T input[name=SYSM210T_kldScwdSaveYn]').prop('checked', SYSM200M_jsonDecode.kldScwdSaveYn == "Y" ? true:false);
		$('#SYSM210T input[name=SYSM210T_autoPfcnUseYn]').prop('checked', SYSM200M_jsonDecode.autoPfcnUseYn == "Y" ? true:false);
		$('#SYSM210T input[name=SYSM210T_cmmtSetlmnYn]').prop('checked', SYSM200M_jsonDecode.cmmtSetlmnYn == "Y" ? true:false);
		$('#SYSM210T input[name=SYSM210T_kldMgntSetlmnYn]').prop('checked', SYSM200M_jsonDecode.kldMgntSetlmnYn == "Y" ? true:false);
		
		if(SYSM200M_jsonDecode.potoImgIdxFileNm == "" || SYSM200M_jsonDecode.potoImgIdxFileNm == null){
			fnSetDefaultImage();
		}else{
			$("#usrImg").attr({ src: "/bcs/photo/" +  SYSM200M_jsonDecode.tenantId + "/" + SYSM200M_jsonDecode.potoImgIdxFileNm});
			var userImg = document.querySelector("#usrImg");
			if(fnUrlExists(userImg.src) == 404){
				fnSetDefaultImage();
			}else{
				$("#usrImg").attr({ src: "/bcs/photo/" +  SYSM200M_jsonDecode.tenantId + "/" + SYSM200M_jsonDecode.potoImgIdxFileNm});
			}
		}
		
		$('#SYSM210T input[name=SYSM210T_potoImgIdxFileNm]').val(SYSM200M_jsonDecode.potoImgIdxFileNm);
		$('#SYSM210T input[name=SYSM210T_potoImgPsn]').val(SYSM200M_jsonDecode.potoImgPsn);	
	});		
	
	Mode = 'old';
}

function fnSetDefaultImage(){
	$("#usrImg").attr({ src: GLOBAL.contextPath + defaultImgPath});
}

function fnUrlExists(imgURL){
	const http = new XMLHttpRequest();
	http.open('HEAD', imgURL, false);           
	http.send(); 
	return http.status;
}

function GridResizeTableSYSM200M() {   
	var screenHeight = $(window).height()-210; 
	grdSYSM200M.element.find('.k-grid-content').css('height', screenHeight-236);  
}


$('#SYSM200M_tenantId').on("keyup",function(key){
	if(key.keyCode==13) {
		SYSM200M_fnSearchUserList();
	}
});
