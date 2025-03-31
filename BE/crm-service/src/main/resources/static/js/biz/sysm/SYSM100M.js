/***********************************************************************************************
 * Program Name : 태넌트정보관리(SYSM100M.js)
 * Creator      : bykim
 * Create Date  : 2022.01.25
 * Description  : 태넌트정보관리
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.01.25     bykim            최초작성   
 ************************************************************************************************/
var SYSM100M_DataSource, SYSM100M_grdSYSM100M, SYSM100M_userInfo, SYSM100M_selTenantId;

// 공통코드
var SYSM100M_cmmCodeList, SYSM100M_mgntItemCdList;

//탭 초기화
var SYSM100MTab =  $("#SYSM100MTab").kendoTabStrip({
    animation: false,
    scrollable: false,
    value: SYSM100M_langMap.get("SYSM100M.tenantBasic"),
	contentLoad: MAINFRAME.onTabContentLoad,
    activate: function(){
    	let SYSM100M_num = this.select().index()
		if(SYSM100M_num == 0){
			SYSM110T_fnsearchOneTenant()
		}else if(SYSM100M_num == 1){
			if(Utils.isNull(SYSM100M_selTenantId)){
				SYSM100M_selTenantId = SYSM100M_userInfo.tenantId;
			}
			if(SYSM100M_grdSYSM100M.dataSource.data().length>0){
				SYSM120T_fnSetInit(SYSM100M_grdSYSM100M.dataSource.data()[0].tenantId)
			}
		}
    }
}).data("kendoTabStrip");


$(document).ready(function () {
	//콤보세팅
	SYSM100M_fnSelectCombo();
	SYSM100M_userInfo = GLOBAL.session.user;

});

function SYSM100M_createGrid(){
	SYSM100M_DataSource ={
		transport: {
			read	: function (SYSM100M_jsonStr) {
				if(Utils.isNull(SYSM100M_jsonStr.data)){
					Utils.ajaxCall('/sysm/SYSM100SEL01', SYSM100M_jsonStr, SYSM100M_fnResultTenantList,
						window.kendo.ui.progress($("#grdSYSM100M"), true), window.kendo.ui.progress($("#grdSYSM100M"), false))
				}else{
					window.kendo.ui.progress($("#grdSYSM100M"), false)
				}
			}

		},
		schema : {
			type: "json",
			model: {
				fields: {
					dmnCd		: { field: "dmnCd", type: "string" },
					svcTypCd	: { field: "svcTypCd", type: "string" },
					tenantId	: { field: "tenantId", type: "string" },
					fmnm		: { field: "fmnm", type: "string" },
					usrAcCnt	: { field: "usrAcCnt", type: "string" },
					tenantStCd	: { field: "tenantStCd", type: "string" },
				}
			}
		}
	}

	$("#grdSYSM100M").kendoGrid({
		dataSource : SYSM100M_DataSource,
		autoBind: false,
		sortable: true,
		selectable: 'multiple',
		noRecords: { template: `<div class="nodataMsg"><p>${SYSM100M_langMap.get("SYSM100M.grid.nodatafound")}</p></div>` },
		scrollable: true,
		pageable: {refresh:false
			, pageSizes:[ 25, 50, 100, 200,  500]
			, buttonCount:10
			, pageSize : 25
			, messages: {
				display: " "
				, empty: SYSM100M_langMap.get("SYSM100M.grid.message")
				, itemsPerPage: ""
			}
		},
		dataBound: SYSM100M_onDataBound,
		columns: [
			{
				selectable : true,
				width : 40,
			},
			{
				field : "dmnCd",
				title : SYSM100M_langMap.get("SYSM100M.grid.dmnCd"),
				width : "80px",
				attributes : {
					"class" : "k-text-left"
				},
				type : "string",
				template : '#if (dmnCd) {# #=SYSM100M_fnSetComcd(dmnCd, "C0002")# #}#'
			},
			{
				field : "svcTypCd",
				title : SYSM100M_langMap.get("SYSM100M.grid.svcTypCd"),
				width : "150px",
				attributes : {
					"class" : "k-text-left"
				},
				type : "string",
				template : '#if (svcTypCd) {# #=SYSM100M_fnSetComcd(svcTypCd, "C0113")# #}#'
			},
			{
				field : "tenantId",
				title : SYSM100M_langMap.get("SYSM100M.grid.tenantId"),
				width : "100px",
				type : "string"
			},
			{
				field : "fmnm",
				title : SYSM100M_langMap.get("SYSM100M.grid.tenantKorNm"),
				width : "auto",
				type : "string",
				attributes : {
					"class" : "k-text-left"
				}
			},
			{
				field : "usrAcCnt",
				title : SYSM100M_langMap.get("SYSM100M.grid.usrAcCnt"),
				width : "100px",
				type : "string",
				template : '#if (usrAcCnt) {# #=SYSM100M_fnSetComcd(usrAcCnt, "C0193")# #}#'
			},
			{
				field : "tenantStCd",
				title : SYSM100M_langMap.get("SYSM100M.grid.tenantStcd"),
				width : "100px",
				attributes : {
					"class" : "k-text-left"
				},
				type : "string",
				template : '#if (tenantStCd) {# #=SYSM100M_fnSetComcd(tenantStCd, "C0007")# #}#'
			} ]
	});

	SYSM100M_grdSYSM100M = $("#grdSYSM100M").data("kendoGrid");

	//그리드 높이 조절
	let SYSM100M_screenHeight = $(window).height();
	$('#SYSM100M_divisonCol').css('height', SYSM100M_screenHeight-320);
	SYSM100M_grdSYSM100M.element.find('.k-grid-content').css('height',  $('#SYSM100M_divisonCol').height()-150);

	// grid reSize
	$(window).on({
		'resize': function() {
			SYSM100M_grdSYSM100M.element.find('.k-grid-content').css('height',  $('#SYSM100M_divisonCol').height()-150);
		},
	});
	CMMN_SEARCH_TENANT["SYSM100M"].fnInit(null, SYSM100M_fnSearchTenantList, SYSM100M_fnClearTenantList);

}

/**
 * row click.
 *
 * @returns
 */
function SYSM100M_onDataBound(SYSM100M_e) {
	$("#grdSYSM100M").on('click','tbody tr[data-uid]',function (SYSM100M_e) {
		let SYSM100M_cell = $(SYSM100M_e.currentTarget);
		let	SYSM100M_item	= SYSM100M_grdSYSM100M.dataItem(SYSM100M_cell.closest("tr"));
		$('#SYSM110T_edtTenantId').val(SYSM100M_item.tenantId)
		SYSM110T_fnsearchOneTenant();
		SYSM100M_selTenantId = SYSM100M_item.tenantId;
		if($('#grdSYSM120T')[0] != undefined){
			SYSM120T_fnSetInit(SYSM100M_item.tenantId);
		}
	})
}


function SYSM100M_fnClearTenantList(){

	$('#SYSM110T_edtTenantId').prop('disabled', true);

	SYSM100M_grdSYSM100M.dataSource.data([]);
	//탭 초기화
	SYSM110T_fnSetInit();
	$('#SYSM110T_edtTenantId').prop('disabled', false);

	//기준정보 버튼 초기화
	$('#SYSM120T_addRow').prop("disabled", true);
	$('#SYSM120T_btnSave').prop("disabled", true);

	//기준정보 그리드 초기화
	if(!Utils.isNull(SYSM120T_grdSYSM120T)){
		SYSM120T_grdSYSM120T.dataSource.data([]);
		SYSM120T_grdSYSM120T.dataSource.options.schema.data = [];

	}
}


// 그리드 조회
function SYSM100M_fnSearchTenantList(){

	$('#SYSM110T_edtTenantId').prop('disabled', true);
	
	let SYSM100M_domSelVal = $('#SYSM100M_cobDmnCd01').val();
	let SYSM100M_tenStSelVal = $('#SYSM100M_cobTenantStCd01').val();
	let SYSM100M_svcTypCdVal = $('#SYSM100M_cobSvcTypCd').val();
	
	let SYSM100M_tenantIdVal = $('#SYSM100M_tenantId').val();

	let SYSM100M_data = { dmnCd 		: SYSM100M_domSelVal, 
						  svcTypCd 		: SYSM100M_svcTypCdVal, 
						  tenantId 		: SYSM100M_tenantIdVal,
						  tenantStCd 	: SYSM100M_tenStSelVal
				       };	
  
	let SYSM100M_jsonStr = JSON.stringify(SYSM100M_data);

	SYSM100M_DataSource.transport.read(SYSM100M_jsonStr);

	$('#SYSM110T_edtTenantId').prop('disabled', false);
	
	//기준정보 버튼 초기화
	//$('#SYSM120T_addRow').prop("disabled", true);
	//$('#SYSM120T_btnSave').prop("disabled", true);

	//기준정보 그리드 초기화
	if(!Utils.isNull(SYSM120T_grdSYSM120T)){
		SYSM120T_grdSYSM120T.dataSource.data([]);
		SYSM120T_grdSYSM120T.dataSource.options.schema.data = [];
	}
	//탭 초기화
	SYSM110T_fnsearchOneTenant();
}

//테넌트 목록 조회결과
function SYSM100M_fnResultTenantList(SYSM100M_data){

	let SYSM100M_jsonEncode = JSON.stringify(SYSM100M_data.SYSM100VOInfo);
	let SYSM100M_obj=JSON.parse(SYSM100M_jsonEncode);
	let SYSM100M_jsonDecode = JSON.parse(SYSM100M_obj);

	//grid data bind
	SYSM100M_grdSYSM100M.dataSource.data(SYSM100M_jsonDecode);
	SYSM100M_grdSYSM100M.dataSource.options.schema.data = SYSM100M_jsonDecode;
	
	if(SYSM100M_jsonDecode.length>0){
		$('#SYSM110T_edtTenantId').val(SYSM100M_jsonDecode[0].tenantId)
		SYSM110T_fnsearchOneTenant();

		if(SYSM100MTab.select().index() == 1){
			SYSM120T_DataSource.transport.read(JSON.stringify( {  tenantId : SYSM100M_jsonDecode[0].tenantId }));
		}
	}
}	

//태넌트 목록 상태값 활성화 
function SYSM100M_fnChgCobTenantStCd02(SYSM100M_val){
	if(SYSM100M_val!="40"){
		$('#SYSM100M_cobTenantStRsnCd01').data("kendoComboBox").value("");
		$('#SYSM100M_cobTenantStRsnCd01').data("kendoComboBox").enable(false);
	}else if(SYSM100M_val=="40"){
		$('#SYSM100M_cobTenantStRsnCd01').data("kendoComboBox").enable(true);
	}
}

//콤보값 조회
function SYSM100M_fnSelectCombo(){
	
	SYSM100M_mgntItemCdList = [
		{"mgntItemCd":"C0002"},
		{"mgntItemCd":"C0007"},
		{"mgntItemCd":"C0008"},
		{"mgntItemCd":"C0010"},
		{"mgntItemCd":"C0113"},
		{"mgntItemCd":"C0011"},
		{"mgntItemCd":"C0015"},
		{"mgntItemCd":"C0016"},
		{"mgntItemCd":"C0114"},
		{"mgntItemCd":"C0003"},
		{"mgntItemCd":"C0111"},
		{"mgntItemCd":"C0193"}
	];

	Utils.ajaxCall('/comm/COMM100SEL01',  JSON.stringify({ "codeList": SYSM100M_mgntItemCdList}), SYSM100M_fnsetCombo) 
}

//콤보세팅
function SYSM100M_fnsetCombo( SYSM100M_data){
	let SYSM100M_jsonEncode = JSON.stringify(SYSM100M_data.codeList);
	let SYSM100M_object=JSON.parse(SYSM100M_jsonEncode);
	let SYSM100M_jsonDecode = JSON.parse(SYSM100M_object);

	SYSM100M_cmmCodeList = SYSM100M_jsonDecode;
	
	//도메인 코드
	Utils.setKendoComboBox(SYSM100M_cmmCodeList, "C0002", '#SYSM100M_cobDmnCd01', ""); 
	
	//태넌트 상태코드
	Utils.setKendoComboBox(SYSM100M_cmmCodeList, "C0007", '#SYSM100M_cobTenantStCd02', "", SYSM100M_langMap.get("SYSM100M.comboSelect")) ;
	Utils.setKendoComboBox(SYSM100M_cmmCodeList, "C0007", '#SYSM100M_cobTenantStCd01', "") ;
	
	//태넌트 상태 사유 코드
	Utils.setKendoComboBox(SYSM100M_cmmCodeList, "C0008", '#SYSM100M_cobTenantStRsnCd01', "", SYSM100M_langMap.get("SYSM100M.comboSelect"));

	$('#SYSM100M_cobTenantStRsnCd01').data("kendoComboBox").enable(false);
	
	//서비스_유형_코드
	Utils.setKendoComboBox(SYSM100M_cmmCodeList, "C0113", '#SYSM100M_cobSvcTypCd', "");

	SYSM100M_createGrid();

} 


// grid template 공통코드값 반영 
function SYSM100M_fnSetComcd(SYSM100M_cmmCd, SYSM100M_cmmType){
	for (let i = 0; i < SYSM100M_cmmCodeList.length; i++) {
		if(SYSM100M_cmmCodeList[i].mgntItemCd == SYSM100M_cmmType && SYSM100M_cmmCodeList[i].comCd == SYSM100M_cmmCd){
			return SYSM100M_cmmCodeList[i].comCdNm 
		}
	}
	return SYSM100M_cmmCd;
}

//공통코드 리스트 세팅
function SYSM100M_fnSetComboList(id){
	let SYSM100M_cobDataSource = [];
	SYSM100M_cobDataSource.push( {"comCd" : "", "comCdNm" :  SYSM100M_langMap.get("SYSM100M.comboSelect")});
	
	//태넌트 부가서비스 정보
	SYSM100M_cmmCodeList.forEach(function(val) {
		//부가서비스_코드 초기화
		if(val.mgntItemCd == id ){
			let SYSM100M_comb = {"comCd" : val.comCd, "comCdNm" : val.comCdNm };
			 SYSM100M_cobDataSource.push(SYSM100M_comb);
		}
	});
	return SYSM100M_cobDataSource;
}


function SYSM100M_fnUpdateCallBack(){
	Utils.alert(SYSM100M_langMap.get("success.common.save")); // "정상적으로 저장되었습니다."
	SYSM100M_fnSearchTenantList();
	SYSM110T_fnSetInit();
	$('#SYSM100M_cobTenantStCd02').data("kendoComboBox").value("");
	$('#SYSM100M_cobTenantStRsnCd01').data("kendoComboBox").value("");
}


//테넌트 목록 전체조회 
$('#SYSM100M button[name=btnInq]').on('click', function () {
	
	if (Utils.isNull($('#SYSM100M_tenantId').val())) {
		Utils.alert(SYSM110T_langMap.get("SYSM110T.save.tenantId"));
		$("#SYSM100M_tenantId").focus();
		return;
	}
	SYSM100M_fnSearchTenantList();
	// 부가서비스 초기화
	SYSM100M_cmmCodeList.forEach(function(val) {
		//부가서비스_코드 초기화
		if(val.mgntItemCd == "C0011"){
			SYSM110T_chkbox = $('#SYSM110T input[name=SYSM110T_'+ val.comCd+']')
			SYSM110T_chkbox.prop('checked', false);
		}
	})
});

//태넌트목록정보 태넌트상태 변경 
$('#SYSM100M_btnSave').on('click', function () {
	
	let SYSM100M_tenantStCd = $('#SYSM100M_cobTenantStCd02').val();
	let SYSM100M_tenantStRsnCd = $('#SYSM100M_cobTenantStRsnCd01').val();
	
	if(Utils.isNull(SYSM100M_tenantStCd)){
		Utils.alert(SYSM100M_langMap.get("SYSM100M.save.svcTypCd")) ;
		return;
	}
	
	if(SYSM100M_tenantStCd=="40" && !SYSM100M_tenantStRsnCd){
		Utils.alert(SYSM100M_langMap.get("SYSM100M.save.svcTypRsnCd")) ;
		return;
	}

	let chkRow = false;
	$('#grdSYSM100M .k-checkbox').each(function (idx, row) {
		if($(row).attr('aria-checked')=='true'){
			chkRow = true;
		}
	})
	if(!chkRow){
		Utils.alert(SYSM100M_langMap.get("SYSM100M.save.tenantInfo")) ;
		return;
	}
	
	Utils.confirm(SYSM100M_langMap.get("SYSM100M.save"), function(){
		let SYSM100M_updateRows = [];
		
		$('#grdSYSM100M .k-checkbox').each(function (idx, row) {
			if($(row).attr('aria-checked')=='true'){
				let	SYSM100M_tr		= $(row).closest('tr');
				let	SYSM100M_item	= Object.assign({}, SYSM100M_grdSYSM100M.dataItem(SYSM100M_tr));
				//data setting
				let SYSM100M_data = { tenantId : SYSM100M_item.tenantId, 
						tenantStCd 		: SYSM100M_tenantStCd,
						tenantStRsnCd 	: SYSM100M_tenantStRsnCd == null?"":SYSM100M_tenantStRsnCd
				};	
				SYSM100M_updateRows.push(SYSM100M_data);
			}
			
		});

		let SYSM100M_data = { "SYSM100VOList" : SYSM100M_updateRows
							,  lstCorprOrgCd : SYSM100M_userInfo.orgCd
							,  lstCorprId : SYSM100M_userInfo.usrId};
		
		let SYSM100M_jsonStr = JSON.stringify(SYSM100M_data);
		
		Utils.ajaxCall('/sysm/SYSM100UPT02', SYSM100M_jsonStr, SYSM100M_fnUpdateCallBack);
	})
});

$('#SYSM100M_tenantId').on("keyup",function(key){
	if(key.keyCode==13) {
		SYSM100M_fnSearchTenantList();
	}
});
