/***********************************************************************************************
 * Program Name : 태넌트관리 팝업(SYSM101P.js)
 * Creator      : 김보영
 * Create Date  : 2022.01.25
 * Description  : 사용자찾기 팝업
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.01.25     김보영           최초작성   
 ************************************************************************************************/
var SYSM101PDataSource,grdSYSM101P, SYSM101PSelTenantId, SYSM101P_object;
var SYSM101P_cmmCodeList, SYSM101P_mgntItemCdList;

$(document).ready(function () {

	//콤보세팅
	SYSM101P_fnSelectCombo();
	SYSM101PDataSource ={
			transport: {
				read	: function (SYSM101P_jsonStr) {
					Utils.ajaxCall('/sysm/SYSM101SEL01', SYSM101P_jsonStr, SYSM101P_resultTenantList, 
					window.kendo.ui.progress($("#grdSYSM101P"), true), window.kendo.ui.progress($("#grdSYSM101P"), false))
				},
			},
			schema : {
				type: "json",
				model: {
					fields: {
						tenantId	: { field: "tenantId", type: "string" },
						fmnm		: { field: "fmnm", type: "string" },
						dmnCd		: { field: "dmnCd", type: "string" },
						tenantStCd	: { field: "tenantStCd", type: "string" },
					}  
				}
			}
	}
	
	$("#grdSYSM101P").kendoGrid({
		DataSource : SYSM101PDataSource,
		autoBind: false,
		sortable: true,
		scrollable: true,
		selectable: "row",
		resizable: true,
		pageable: {refresh:false
			, pageSizes:[ 25, 50, 100, 200,  500]
			, buttonCount:10
			, pageSize : 25
			, messages: {
				display: " "
				, empty: SYSM101P_langMap.get("SYSM101P.grid.message")
				, itemsPerPage: ""
			    }
		},
		columns: [ 
		{ selectable: true,
			title: '', width: '40px'
		 ,  attributes: { "class": "checkbox-align k-state-disabled" , } 
		 ,	headerAttributes: { "class": "checkbox-align k-state-disabled" }
		},
		{
			field: "dmnCd", title: SYSM101P_langMap.get("SYSM101P.grid.dmnCd"), width:"120px" , attributes: {"class": "k-text-left"}
			,type: "string",template : '#if (dmnCd) {# #=SYSM101P_fnSetComcd(dmnCd, "C0002")# #}#'
		}, {
			field: "svcTypCd", title: SYSM101P_langMap.get("SYSM101P.grid.svcTypCd"), width:"180px" , attributes: {"class": "k-text-left"}
			,type: "string",template : '#if (svcTypCd) {# #=SYSM101P_fnSetComcd(svcTypCd, "C0113")# #}#'
		}, {
			field: "tenantId", title:SYSM101P_langMap.get("SYSM101P.grid.tenantId")  , width:"100px"
			,type: "string"
		}, {
			field: "fmnm", title: SYSM101P_langMap.get("SYSM101P.grid.tenantKorNm")
			,type: "string", attributes: {"class": "k-text-left"}
		}, {
			field: "usrAcCnt", title: SYSM101P_langMap.get("SYSM101P.grid.usrAcCnt"), width:"90px" , attributes: {"class": "k-text-right"}
				,type: "string",template : '#if (usrAcCnt) {# #=SYSM101P_fnSetComcd(usrAcCnt, "C0193")# #}#'
		}, {
			field: "tenantStCd", title: SYSM101P_langMap.get("SYSM101P.grid.tenantStcd") , width:"110px" , attributes: {"class": "k-text-left"}
			,type: "string",template : '#if (tenantStCd) {# #=SYSM101P_fnSetComcd(tenantStCd, "C0007")# #}#'
		},
		{
			field: "svcBltnDd", title: '서비스 게시일' , width:"110px"
			,type: "string",template : '#if (svcBltnDd) {# #=kendo.format("{0:yyyy-MM-dd}",new Date(svcBltnDd))# #}#'
		},

		{
			field: "svcExpryDd", title: '서비스 종료일' , width:"110px"
			,type: "string",template : '#if (svcExpryDd) {# #=kendo.format("{0:yyyy-MM-dd}",new Date(svcExpryDd))# #}#'
		},

		],
		change: function(e) {
			let selectedRows = this.select();
			let dataItem = this.dataItem(selectedRows[0]);
			if(Utils.getUrlParam('objGubun')!=null){
				SYSM101P_object = dataItem
			}
			SYSM101PSelTenantId = dataItem.tenantId
			
		}
	});
	
	grdSYSM101P = $("#grdSYSM101P").data("kendoGrid");
	
	//그리드 높이 조절
	var SYSM101P_screenHeight = $(window).height();
	grdSYSM101P.element.find('.k-grid-content').css('height', SYSM101P_screenHeight-250);


	var SYSM101P_domSelVal = $('#SYSM101P input[name=cobDmnCd]').val();
	var SYSM101P_tenStSelVal = $('#SYSM101P input[name=cobTenantStCd]').val();
	var SYSM101P_fmnmVal = $('#SYSM101P input[name=edtTenantId01]').val();

	var SYSM101P_data = { dmnCd 		: SYSM101P_domSelVal,
		fmnm 			: SYSM101P_fmnmVal,
		tenantStCd 	: SYSM101P_tenStSelVal
	};
	var SYSM101P_jsonStr = JSON.stringify(SYSM101P_data);
	SYSM101PDataSource.transport.read(SYSM101P_jsonStr);
	
	$("#edtTenantId01").on('keyup',function(e){
		if(e.keyCode == "13"){
			SYSM101P_fnSearch();
		}
	});
});

//콤보값 조회
function SYSM101P_fnSelectCombo(){
	
	SYSM101P_mgntItemCdList = [
		{"mgntItemCd":"C0002"},
		{"mgntItemCd":"C0007"},
		{"mgntItemCd":"C0113"},
		{"mgntItemCd":"C0193"}
	];
	Utils.ajaxCall('/comm/COMM100SEL01',  JSON.stringify({ "codeList": SYSM101P_mgntItemCdList}), SYSM101P_fnsetCombo) 
}

//콤보세팅
function SYSM101P_fnsetCombo(SYSM101P_data){
	var SYSM101P_jsonEncode = JSON.stringify(SYSM101P_data.codeList);
	var SYSM101P_object=JSON.parse(SYSM101P_jsonEncode);
	var SYSM101P_jsonDecode = JSON.parse(SYSM101P_object);

	SYSM101P_cmmCodeList = SYSM101P_jsonDecode;
	
	//도메인 코드
	Utils.setKendoComboBox(SYSM101P_cmmCodeList, "C0002", '#SYSM101P input[name=cobDmnCd]', ""); 

	//태넌트 상태코드
	Utils.setKendoComboBox(SYSM101P_cmmCodeList, "C0007", '#SYSM101P input[name=cobTenantStCd]', "") ;
}

$('#SYSM101P button[name=btnInq]').on('click', function () {
	SYSM101P_fnSearch();
});

function SYSM101P_fnSearch(){
	
	var SYSM101P_domSelVal = $('#SYSM101P input[name=cobDmnCd]').val();
	var SYSM101P_tenStSelVal = $('#SYSM101P input[name=cobTenantStCd]').val();
	var SYSM101P_fmnmVal = $('#SYSM101P input[name=edtTenantId01]').val();

	var SYSM101P_data = { dmnCd 		: SYSM101P_domSelVal, 
						  fmnm 			: SYSM101P_fmnmVal,
						  tenantStCd 	: SYSM101P_tenStSelVal
				       };	
	
	var SYSM101P_jsonStr = JSON.stringify(SYSM101P_data);
	SYSM101PDataSource.transport.read(SYSM101P_jsonStr);
}

function SYSM101P_resultTenantList(data){
	
	var SYSM101P_jsonEncode = JSON.stringify(data.SYSM101VOInfo);
	var SYSM101P_jsonDecode = JSON.parse(JSON.parse(SYSM101P_jsonEncode));
	
	grdSYSM101P.dataSource.data(SYSM101P_jsonDecode);
	grdSYSM101P.dataSource.options.schema.data = SYSM101P_jsonDecode;
}	


//grid template 공통코드값 반영 
function SYSM101P_fnSetComcd(SYSM101P_cmmCd, SYSM101P_cmmType){
	for (let i = 0; i < SYSM101P_cmmCodeList.length; i++) {
		if(SYSM101P_cmmCodeList[i].mgntItemCd == SYSM101P_cmmType && SYSM101P_cmmCodeList[i].comCd == SYSM101P_cmmCd){
			return SYSM101P_cmmCodeList[i].comCdNm 
		}
	}
	return SYSM101P_cmmCd;
}


$('#SYSM101P button[name=btnConfirm]').on('click', function () {
	if(Utils.getUrlParam('objGubun')==null){
		Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM101PSelTenantId);
	}else{
		Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM101P_object);
	}

	self.close();
});


$("#grdSYSM101P").on('dblclick','tbody tr[data-uid]',function (SYSM101P_e) {
	let SYSM101P_cell = $(SYSM101P_e.currentTarget);
	let	SYSM101P_item	= grdSYSM101P.dataItem(SYSM101P_cell.closest("tr"));

	SYSM101PSelTenantId = SYSM101P_item.tenantId
	SYSM101P_object = SYSM101P_item;

	if(Utils.getUrlParam('objGubun')==null){
		Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM101PSelTenantId);
	}else{
		Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM101P_object);
	}
	self.close();
})