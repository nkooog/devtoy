/***********************************************************************************************
 * Program Name : 상담유형찾기 팝업(SYSM281P.js)
 * Creator      : 김보영
 * Create Date  : 2022.05.25
 * Description  : 상담유형찾기 팝업
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.25     김보영           최초작성   
 ************************************************************************************************/
var SYSM281PDataSource,grdSYSM281P, SYSM281P_userInfo,SYSM281P_selItem ;

var SYSM281P_cmmCodeList, SYSM281P_mgntItemCdList, SYSM281P_isMulti;

$(document).ready(function () {
	//콤보세팅
	SYSM281P_fnSelectCombo();
	SYSM281P_isMulti = Utils.getUrlParam('isMulti');
	SYSM281P_userInfo = GLOBAL.session.user;
	
	SYSM281PDataSource ={
			transport: {
				read	: function (SYSM281P_jsonStr) {
					Utils.ajaxCall('/sysm/SYSM281SEL03', SYSM281P_jsonStr, SYSM281P_resultTenantList,
					window.kendo.ui.progress($("#grdSYSM281P"), true), window.kendo.ui.progress($("#grdSYSM281P"), false))
				},
			},
	}
	
	$("#grdSYSM281P").kendoGrid({
		DataSource : SYSM281PDataSource,
		noRecords: { template: `<div class="nodataMsg"><p>${SYSM281P_langMap.get("SYSM281P.grid.nodatafound")}</p></div>` },
		autoBind: false,
		sortable: true,
		scrollable: true,
		selectable: SYSM281P_isMulti == "Y" ? "multiple, row": "row",
		resizable: true,
		pageable: {refresh:false
			, pageSizes:[ 25, 50, 100, 200,  500]
			, buttonCount:10
			, pageSize : 25
			, messages: {
				display: " "
				//, empty: SYSM281P_langMap.get("SYSM281P.grid.message")
				, itemsPerPage: ""
			    }
		},
		columns: [ 

			SYSM281P_isMulti == "Y"
			? { width: 40, selectable: true}
			: { width: 40,field: "선택", title: SYSM281P_langMap.get("SYSM281P.grid.select")
					, template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>', }
			, { width: 40, field: "rowNum", title: "NO", },
			{ width: 60, field: "prsLvlCd", title : SYSM281P_langMap.get("SYSM281P.prsLvlCd")
				,template : '#if (prsLvlCd) {# #=SYSM281P_fnSetComcd(prsLvlCd, "C0115")# #}#' },
			{ width: 100, field: "cnslTypCd", title : SYSM281P_langMap.get("SYSM281P.cnslTypCd")
			},
			// { width: "auto", field: "cnslTypCdPath", title : SYSM281P_langMap.get("SYSM281P.cnslTypCdPath")
			// 	, attributes: {"class": "textLeft"},},
			{ width: "auto", field: "lvl1Cd", title :'L1' , attributes: {"class": "textLeft"},},
			{ width: "auto", field: "lvl2Cd", title :'L2' , attributes: {"class": "textLeft"},},
			{ width: "auto", field: "lvl3Cd", title :'L3' , attributes: {"class": "textLeft"},},
			{ width: "auto", field: "lvl4Cd", title :'L4' , attributes: {"class": "textLeft"},},
			{ width: "auto", field: "lvl5Cd", title :'L5' , attributes: {"class": "textLeft"},},
			{ width: 150,field: "cnslTypLvlNm", title : SYSM281P_langMap.get("SYSM281P.cnslTypLvlNm")
				, attributes: {"class": "textLeft"}, },
			{ width: "auto", field: "baseAnswCdNm", title : SYSM281P_langMap.get("SYSM281P.baseAnswCdNm")
				, attributes: {"class": "textLeft"}, },
	],
		change: function(e) {
			let selectedRows = this.select();
			SYSM281P_selItem = this.dataItem(selectedRows[0]);
		}
	});
	
	grdSYSM281P = $("#grdSYSM281P").data("kendoGrid");
	
	//컬럼 감추기
	$("#grdSYSM281P").data("kendoGrid").hideColumn("baseAnswCdNm");
	
	//그리드 높이 조절
	var SYSM281P_screenHeight = $(window).height();
	grdSYSM281P.element.find('.k-grid-content').css('height', SYSM281P_screenHeight-250);  
	
	var SYSM281P_SrchCond = [
		{ text: "전체", value: "3" }, { text: SYSM281P_langMap.get("SYSM281P.code"), value: "1" }, { text:  SYSM281P_langMap.get("SYSM281P.codeNm"), value: "2" },
	]

	$("#SYSM281P_SrchCond").kendoComboBox({ 
		dataTextField: "text",
		dataValueField: "value",
		dataSource: SYSM281P_SrchCond, 
		value: "3",
		clearButton: false,
		height: 200,
	});

	var SYSM281P_data = { tenantId  : SYSM281P_userInfo.tenantId,
		srchCond 	: 1,
		cnslTypCd 	: Utils.getUrlParam('cnslTypCd'),
	};

	// 팝업 호출 param
	// $('#SYSM281P_SrchCond').data("kendoComboBox").value(1)
	// $('#SYSM281P_SrchText').val(Utils.getUrlParam('cnslTypCd'));

	var SYSM281P_jsonStr = JSON.stringify(SYSM281P_data);
	SYSM281PDataSource.transport.read(SYSM281P_jsonStr);


	if (Utils.isNull(SYSM281P_isMulti)) {
	$("#grdSYSM281P").on('dblclick','tbody tr[data-uid]',function (e) {
		let SYSM281P_cell = $(e.currentTarget);
		SYSM281P_selItem = grdSYSM281P.dataItem(SYSM281P_cell.closest("tr"));
		Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM281P_selItem);

		self.close();
	})}
});

//콤보값 조회
function SYSM281P_fnSelectCombo(){
	
	SYSM281P_mgntItemCdList = [
		{"mgntItemCd":"C0003"}, //사용구분
		{"mgntItemCd":"C0115"},	//레벨
	];
	Utils.ajaxCall('/comm/COMM100SEL01',  JSON.stringify({ "codeList": SYSM281P_mgntItemCdList}), SYSM281P_fnsetCombo) 
}


//콤보세팅
function SYSM281P_fnsetCombo(SYSM281P_data){
	var SYSM281P_jsonEncode = JSON.stringify(SYSM281P_data.codeList);
	var SYSM281P_object=JSON.parse(SYSM281P_jsonEncode);
	var SYSM281P_jsonDecode = JSON.parse(SYSM281P_object);

	SYSM281P_cmmCodeList = SYSM281P_jsonDecode;
	
	//레벨 코드
	Utils.setKendoComboBox(SYSM281P_cmmCodeList, "C0115", '#SYSM281P_srchRange', "") ;
	
	//사용구분 코드
	// Utils.setKendoComboBox(SYSM281P_cmmCodeList, "C0003", '#SYSM281P_stt', "") ;
}


//grid template 공통코드값 반영 
function SYSM281P_fnSetComcd(SYSM281P_cmmCd, SYSM281P_cmmType){
	for (let i = 0; i < SYSM281P_cmmCodeList.length; i++) {
		if(SYSM281P_cmmCodeList[i].mgntItemCd == SYSM281P_cmmType && SYSM281P_cmmCodeList[i].comCd == SYSM281P_cmmCd){
			return SYSM281P_cmmCodeList[i].comCdNm 
		}
	}
	return SYSM281P_cmmCd;
}



$('#SYSM281P button[name=btnInq]').on('click', function () {
	SYSM281P_fnSearchList();
});

function SYSM281P_fnSearchList(){
	//var SYSM281P_srchRange = $('#SYSM281P_srchRange').val();
	var SYSM281P_SrchCond = $('#SYSM281P_SrchCond').val();
	var SYSM281P_SrchText = $('#SYSM281P_SrchText').val();


	var SYSM281P_data = { tenantId  : SYSM281P_userInfo.tenantId,
		srchCond 	: SYSM281P_SrchCond,
		srchText 	: SYSM281P_SrchText,
		cnslTypCd : Utils.getUrlParam('cnslTypCd'),
		// prsLvlCd	: SYSM281P_srchRange
	};

	var SYSM281P_jsonStr = JSON.stringify(SYSM281P_data);
	SYSM281PDataSource.transport.read(SYSM281P_jsonStr);
}

function SYSM281P_resultTenantList(data){
	
	var SYSM281P_jsonEncode = JSON.stringify(data.SYSM280VOInfo);
	var SYSM281P_jsonDecode = JSON.parse(JSON.parse(SYSM281P_jsonEncode));
	
	grdSYSM281P.dataSource.data(SYSM281P_jsonDecode);
}	


//grid template 공통코드값 반영 
function SYSM281P_fnSetComcd(SYSM281P_cmmCd, SYSM281P_cmmType){
	for (let i = 0; i < SYSM281P_cmmCodeList.length; i++) {
		if(SYSM281P_cmmCodeList[i].mgntItemCd == SYSM281P_cmmType && SYSM281P_cmmCodeList[i].comCd == SYSM281P_cmmCd){
			return SYSM281P_cmmCodeList[i].comCdNm 
		}
	} 
	return SYSM281P_cmmCd;
}


$('#SYSM281P button[name=btnConfirm]').on('click', function () {
	if (Utils.isNull(SYSM281P_isMulti)) {
		Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM281P_selItem);
	} else {
		let selectedRows = grdSYSM281P.select()
		let selectedItems = [];

		selectedRows.each(function (e) {
			let dataItem = grdSYSM281P.dataItem(this);
			selectedItems.push(dataItem);
		});
		Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(selectedItems);
	}
	self.close();
});

$('#SYSM281P_SrchText').on("keyup",function(key){
	if(key.keyCode==13) {
		SYSM281P_fnSearchList();
	}
});
