/***********************************************************************************************
* Program Name : SMS 발송변수 찾기 팝업 
* Creator      : sukim
* Create Date  : 2022.06.02
* Description  : SMS 발송변수 찾기 팝업
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.02     sukim            최초생성
************************************************************************************************/
let SYSM431PDataSource;
let grdSYSM431P;
let SYSM431P_vrbsClasCd = '';
let grdHeight = 400;
let vrbsClasCd = '';

$(document).ready(function () {
	
	vrbsClasCd = Utils.getUrlParam('vrbsClasCd');
	//첫 화면에 보여질 그리스 셋팅 : SYSM431P.jsp
	SYSM431P_setKendoGrid(vrbsClasCd);
	
	SYSM431P_fnSelectCombo();
	
	//조회 Button
	$('#SYSM431P_btnSearch').off("click").on("click", function () {
		SYSM431P_fnSearchList();
	});	
	
	//확인 버튼
	$('#SYSM431P_fnConfirm').off("click").on("click", function () {
		SYSM431P_fnCallback();
	});
	
});

//그리드 생성
function SYSM431P_setKendoGrid(setGridFlag){
	//그리드 영역 초기화
	$("#grdSYSM431P").empty();
	
	//조건에 따른 그리드 생성
	if(setGridFlag === "1"){
		//문구
		SYSM431PDataSource={
			transport: {
				read : function (SYSM431P_jsonStr) {
					if(Utils.isNull(SYSM431P_jsonStr.data)){
						Utils.ajaxCall('/sysm/SYSM431SEL01', SYSM431P_jsonStr, SYSM431P_resultList, 
							window.kendo.ui.progress($("#grdSYSM431P"), true), window.kendo.ui.progress($("#grdSYSM431P"), false));
					}else{
						window.kendo.ui.progress($("#grdSYSM431P"), false);
					}
				},
			},
			schema : {
				type: "json",
				model: {
		            fields: {
		            	vrbsCd  : { field: "vrbsCd"    	,type: 'string' }, //항목코드
		            	vrbsVlu : { field: "vrbsVlu"  	,type: 'string' }, //문구명
		            	refn1 	: { field: "refn1" 		,type: 'string' }, //크기
		            	useYn  	: { field: "useYn"  	,type: 'string' }  //상태
		            }
				}
			}
		}
		$("#grdSYSM431P").kendoGrid ({
			DataSource : SYSM431PDataSource,
			persistSelection: true,
			sortable: true,
			selectable: true,
			noRecords: { template: '<div class="nodataMsg"><p>'+SYSM431P_langMap.get("grid.nodatafound")+'</p></div>' },
			pageable: {
				  refresh:false,
				  buttonCount:10,
				  pageSize : 100,
				  messages: {
					display: " ",
					empty: SYSM431P_langMap.get("fail.common.select"),
					itemsPerPage: ""
				 }
			},
			columns: [ 
				{ width: '40px',  field: SYSM431P_langMap.get("input.cSelect"), title: SYSM431P_langMap.get("input.cSelect"),     template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>', attributes: {class: "k-text-center"}},
				{ width: '100px', field: "vrbsCd",		title: SYSM431P_langMap.get("SYSM431P.gridVrbsCd"), 	type: "String", attributes : { style : "text-align : left;" }},
				{ width: "320px", field: "vrbsVlu",		title: SYSM431P_langMap.get("SYSM431P.gridVrbsVlu"),   	type: "String", attributes : { style : "text-align : left;" }},
				{ width: '60px',  field: "refn1",		title: SYSM431P_langMap.get("SYSM431P.gridVrbsVluSz"),	type: "String", attributes : { style : "text-align : right;" }},
				{ width: '50px',  field: "useYn",  		title: SYSM431P_langMap.get("SYSM431P.gridVrbsUseYn"),	type: "String", attributes : { style : "text-align : center;" }}
			],
			height: grdHeight
		});	
	}
	if(setGridFlag === "3"){
		//데이터
		SYSM431PDataSource={
				transport: {
					read : function (SYSM431P_jsonStr) {
						if(Utils.isNull(SYSM431P_jsonStr.data)){
							Utils.ajaxCall('/sysm/SYSM431SEL01', SYSM431P_jsonStr, SYSM431P_resultList, 
								window.kendo.ui.progress($("#grdSYSM431P"), true), window.kendo.ui.progress($("#grdSYSM431P"), false));
						}else{
							window.kendo.ui.progress($("#grdSYSM431P"), false);
						}
					},
				},
				schema : {
					type: "json",
					model: {
			            fields: {
			            	vrbsCd    	: { field: "vrbsCd"    	,type: 'string' }, //항목코드
			            	vrbsVlu  	: { field: "vrbsVlu"  	,type: 'string' }, //문구명
			            	refn1 		: { field: "refn1" 		,type: 'string' }, //테이블명
			            	refn2 		: { field: "refn2" 		,type: 'string' }, //필드명
			            	refn3 		: { field: "refn3" 		,type: 'string' }, //크기
			            	useYn  		: { field: "useYn"  	,type: 'string' }  //상태
			            }
					}
				}
			}
			$("#grdSYSM431P").kendoGrid ({
				DataSource : SYSM431PDataSource,
				persistSelection: true,
				sortable: true,
				selectable: true,
				noRecords: { template: '<div class="nodataMsg"><p>'+SYSM431P_langMap.get("grid.nodatafound")+'</p></div>' },
				pageable: {
					  refresh:false,
					  buttonCount:10,
					  pageSize : 100,
					  messages: {
						display: " ",
						empty: SYSM431P_langMap.get("fail.common.select"),
						itemsPerPage: ""
					 }
				},
				columns: [ 
					{ width: '40px',  field: SYSM431P_langMap.get("input.cSelect"),     title: SYSM431P_langMap.get("input.cSelect"),     template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>', attributes: {class: "k-text-center"}},
					{ width: '100px', field: "vrbsCd",    	title: SYSM431P_langMap.get("SYSM431P.gridVrbsCd"), 		type: "String", attributes : { style : "text-align : left;" }},
					{ width: '100px', field: "vrbsVlu",  	title: SYSM431P_langMap.get("SYSM431P.gridVrbsVlu"),   		type: "String", attributes : { style : "text-align : left;" }},
					{ width: '110px', field: "refn1", 		title: SYSM431P_langMap.get("SYSM431P.gridTblNm"), 			type: "String", attributes : { style : "text-align : left;" }},
					{ width: '110px', field: "refn2", 		title: SYSM431P_langMap.get("SYSM431P.gridFieldNm"),		type: "String", attributes : { style : "text-align : left;" }},
					{ width: '60px',  field: "refn3", 		title: SYSM431P_langMap.get("SYSM431P.gridVrbsVluSz"),     	type: "String", attributes : { style : "text-align : right;" }},
					{ width: '50px',  field: "useYn",  		title: SYSM431P_langMap.get("SYSM431P.gridVrbsUseYn"),     	type: "String", attributes : { style : "text-align : center;" }}
				],
				height: grdHeight
			});
	}	
	if(setGridFlag === "4"){
		//IF 변수
		SYSM431PDataSource={
				transport: {
					read : function (SYSM431P_jsonStr) {
						if(Utils.isNull(SYSM431P_jsonStr.data)){
							Utils.ajaxCall('/sysm/SYSM431SEL01', SYSM431P_jsonStr, SYSM431P_resultList, 
								window.kendo.ui.progress($("#grdSYSM431P"), true), window.kendo.ui.progress($("#grdSYSM431P"), false));
						}else{
							window.kendo.ui.progress($("#grdSYSM431P"), false);
						}
					},
				},
				schema : {
					type: "json",
					model: {
			            fields: {
			            	vrbsCd    	: { field: "vrbsCd"    	,type: 'string' }, //항목코드
			            	vrbsVlu  	: { field: "vrbsVlu"  	,type: 'string' }, //문구명
			            	refn1 		: { field: "refn1" 		,type: 'string' }, //인터페이스명
			            	refn2 		: { field: "refn2" 		,type: 'string' }, //시작위치
			            	refn3 		: { field: "refn3" 		,type: 'string' }, //종료위치
			            	useYn  		: { field: "useYn"  	,type: 'string' }  //상태
			            }
					}
				}
			}
			$("#grdSYSM431P").kendoGrid ({
				DataSource : SYSM431PDataSource,
				persistSelection: true,
				sortable: true,
				selectable: true,
				noRecords: { template: '<div class="nodataMsg"><p>'+SYSM431P_langMap.get("grid.nodatafound")+'</p></div>' },
				pageable: {
					  refresh:false,
					  buttonCount:10,
					  pageSize : 100,
					  messages: {
						display: " ",
						empty: SYSM431P_langMap.get("fail.common.select"),
						itemsPerPage: ""
					 }
				},
				columns: [ 
					{ width: '40px',  field: SYSM431P_langMap.get("input.cSelect"),     title: SYSM431P_langMap.get("input.cSelect"),     template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>', attributes: {class: "k-text-center"}},
					{ width: '100px', field: "vrbsCd",    	title: SYSM431P_langMap.get("SYSM431P.gridVrbsCd"),     type: "String", attributes : { style : "text-align : left;" }},
					{ width: '110px', field: "vrbsVlu",  	title: SYSM431P_langMap.get("SYSM431P.gridVrbsVlu"),    type: "String", attributes : { style : "text-align : left;" }},
					{ width: '170px', field: "refn1", 		title: SYSM431P_langMap.get("SYSM431P.gridIntfNm"), 	type: "String", attributes : { style : "text-align : left;" }},
					{ width: '50px',  field: "refn2", 		title: SYSM431P_langMap.get("SYSM431P.gridStrPsn"),     type: "String", attributes : { style : "text-align : right;" }},
					{ width: '50px',  field: "refn3", 		title: SYSM431P_langMap.get("SYSM431P.gridEndPsn"),     type: "String", attributes : { style : "text-align : right;" }},
					{ width: '50px',  field: "useYn",  		title: SYSM431P_langMap.get("SYSM431P.gridVrbsUseYn"),  type: "String", attributes : { style : "text-align : center;" }}
				],
				height: grdHeight
			});	
	}
	if(setGridFlag === "5"){
		//URL
		SYSM431PDataSource={
			transport: {
				read : function (SYSM431P_jsonStr) {
					if(Utils.isNull(SYSM431P_jsonStr.data)){
						Utils.ajaxCall('/sysm/SYSM431SEL01', SYSM431P_jsonStr, SYSM431P_resultList, 
							window.kendo.ui.progress($("#grdSYSM431P"), true), window.kendo.ui.progress($("#grdSYSM431P"), false));
					}else{
						window.kendo.ui.progress($("#grdSYSM431P"), false);
					}
				},
			},
			schema : {
				type: "json",
				model: {
		            fields: {
		            	vrbsCd    	: { field: "vrbsCd"    	,type: 'string' }, //항목코드
		            	vrbsVlu  	: { field: "vrbsVlu"  	,type: 'string' }, //URL명
		            	refn1 		: { field: "refn1" 		,type: 'string' }, //URL
		            	useYn  		: { field: "useYn"  	,type: 'string' }  //상태
		            }
				}
			}
		}		
		$("#grdSYSM431P").kendoGrid ({
			DataSource : SYSM431PDataSource,
			persistSelection: true,
			sortable: true,
			selectable: true,
			noRecords: { template: '<div class="nodataMsg"><p>'+SYSM431P_langMap.get("grid.nodatafound")+'</p></div>' },
			pageable: {
				  refresh:false,
				  buttonCount:10,
				  pageSize : 100,
				  messages: {
					display: " ",
					empty: SYSM431P_langMap.get("fail.common.select"),
					itemsPerPage: ""
				 }
			},
			columns: [ 
				{ width: '40px',  field: SYSM431P_langMap.get("input.cSelect"), title: SYSM431P_langMap.get("input.cSelect"),     template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>', attributes: {"class": "textCenter"}},
				{ width: '60px',  field: "vrbsCd",     	title: SYSM431P_langMap.get("SYSM431P.gridVrbsCd"), 		type: "String" },
				{ width: '100px', field: "vrbsVlu",   	title: SYSM431P_langMap.get("SYSM431P.gridIntfVrbsNm"), 	type: "String", attributes: {"class": "textLeft"}},
				{ width: '320px', field: "refn1",  		title: SYSM431P_langMap.get("SYSM431P.gridIntfUrl"),      	type: "String", attributes: {"class": "textLeft"}},
				{ width: '50px',  field: "useYn",   	title: SYSM431P_langMap.get("SYSM431P.gridVrbsUseYn"),     	type: "String", attributes: {"class": "textLeft"}}
			],
			height: grdHeight
		});			
	}
	grdSYSM431P = $("#grdSYSM431P").data("kendoGrid");
}

//콤보 초기화
function SYSM431P_fnInitCombo(){
	let SYSM431P_combobox = $("#SYSM431P_vrbsClasCd").kendoComboBox({ 
		dataTextField: "text",
		dataValueField: "value",
		clearButton: false,
		height: 200,
		change: function(e) {
			SYSM431P_fnCboonSelect();
		}
	});
}

//콤보 data set
function SYSM431P_fnSelectCombo(){
	SYSM431P_fnInitCombo();
	let SYSM431P_data = { 
	"codeList": [
			{"mgntItemCd":"C0095"}
	]};
	Utils.ajaxCall('/comm/COMM100SEL01', JSON.stringify(SYSM431P_data), function (result) {
		let SYSM431P_cmmCodeList = JSON.parse(result.codeList);
		let cmmCodeList = new Array();
		
		$.each(SYSM431P_cmmCodeList, function(index,item){
			//직접 입력이 아닐경우만
			if(item.comCd != "2"){
				cmmCodeList.push(item.comCd,item);
			}
		});
		Utils.setKendoComboBox(cmmCodeList, "C0095", "#SYSM431P_vrbsClasCd", false, false);
		
		//kw---20250227 : 구분값 자동 설정
		var comboBox = $("#SYSM431P_vrbsClasCd").data("kendoComboBox");
		comboBox.value(vrbsClasCd);
		//kw---20250227 : 자동검색 되도록 기능 추가
		SYSM431P_fnSearchList();
	});
}

//콤보선택시 그리드 변경
function SYSM431P_fnCboonSelect(){
	let SYSM431P_cboItemCd = $('input[name=SYSM431P_vrbsClasCd]').data("kendoComboBox").dataItem();
	
	SYSM431P_setKendoGrid(SYSM431P_cboItemCd.value);
	
	/*if(SYSM431P_cboItemCd.value === "1"){
		SYSM431P_setKendoGrid("1");
	}else if(SYSM431P_cboItemCd.value === "3"){
		SYSM431P_setKendoGrid("3");
	}else if(SYSM431P_cboItemCd.value === "4"){
		SYSM431P_setKendoGrid("4");
	}else if(SYSM431P_cboItemCd.value === "5"){
		SYSM431P_setKendoGrid("5");
	}*/
}

//검색범위 콤보 선택시 조회
function SYSM431P_fnSearchList() {
	
	let SYSM431P_vrbsClasCd = $('input[name=SYSM431P_vrbsClasCd]').data("kendoComboBox").dataItem();
	let SYSM431P_keyword = $('input[name=SYSM431P_keyword]').val();

	if(SYSM431P_vrbsClasCd.value === ''){
		Utils.alert(SYSM431P_langMap.get("SYSM431P.alt1"));
		return;
	}
	if(SYSM431P_vrbsClasCd.value === '2'){
		Utils.alert(SYSM431P_langMap.get("SYSM431P.alt2"));
		return;		
	}	

	let SYSM431P_param = {
			tenantId 	: GLOBAL.session.user.tenantId,
			vrbsClasCd 	: SYSM431P_vrbsClasCd.value,  	
			keyword    	: SYSM431P_keyword
	};
	SYSM431PDataSource.transport.read(JSON.stringify(SYSM431P_param));
}


//검색범위 콤보 선택시 조회
/*function SYSM431P_fnSearchList() {
	let SYSM431P_vrbsClasCd = $('input[name=SYSM431P_vrbsClasCd]').data("kendoComboBox").dataItem();
	let SYSM431P_keyword = $('input[name=SYSM431P_keyword]').val();
	if(SYSM431P_vrbsClasCd.value === ''){
		Utils.alert(SYSM431P_langMap.get("SYSM431P.alt1"));
		return;
	}
	if(SYSM431P_vrbsClasCd.value === '2'){
		Utils.alert(SYSM431P_langMap.get("SYSM431P.alt2"));
		return;		
	}	
	switch(SYSM431P_vrbsClasCd.value){
		case "1": 
			SYSM431P_vrbsClasCd = "C0096";
			break;
		case "3": 
			SYSM431P_vrbsClasCd = "C0097";
			break;
		case "4": 
			SYSM431P_vrbsClasCd = "C0098";
			break;
		case "5": 
			SYSM431P_vrbsClasCd = "C0099";
			break;	
	}
	let SYSM431P_param = {
			tenantId 	: GLOBAL.session.user.tenantId,
			vrbsClasCd 	: SYSM431P_vrbsClasCd,  	
			keyword    	: SYSM431P_keyword
	};
	SYSM431PDataSource.transport.read(JSON.stringify(SYSM431P_param));
}*/


//조회 결과 set
function SYSM431P_resultList(SYSM431P_result){
	let SYSM431P_jsonDecode = SYSM431P_result.SYSM431SEL01List;
	grdSYSM431P.setDataSource(SYSM431P_jsonDecode);
	grdSYSM431P.dataSource.options.schema.data = SYSM431P_jsonDecode;	
}

function SYSM431P_fnCallback(){
	let grid = $("#grdSYSM431P").data("kendoGrid");
	let sel = grid.select();
	let SYSM431P_item = "";
    $.each (sel, function(idx, row) {
    	SYSM431P_item = grid.dataItem(row);
    });
    Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM431P_item);
    self.close();	   	
}

$("#grdSYSM431P").on('dblclick','tbody tr[data-uid]',function (SYSM431P_e) {
	let SYSM431P_cell = $(SYSM431P_e.currentTarget);
	let	SYSM431P_item	= grdSYSM431P.dataItem(SYSM431P_cell.closest("tr"));
	
	Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM431P_item);
    self.close();
});