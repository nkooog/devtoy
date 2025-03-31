/***********************************************************************************************
 * Program Name : 우편번호 찾기(COMM110P.js)
 * Creator      : sukim
 * Create Date  : 2022.04.29
 * Description  : 우편번호 찾기
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.29     sukim            최초생성 
 * 2022.05.17     sukim            퍼블변경 및 수정
 ************************************************************************************************/ 
let COMM110PDataSource,grdCOMM110P;

$(document).ready(function () {
	
	
	COMM110PDataSource ={
		transport: {
			read: function (COMM110P_jsonStr) {
				if(Utils.isNull(COMM110P_jsonStr.data)){
					Utils.ajaxCall('/comm/COMM110SEL01', COMM110P_jsonStr, COMM110P_resultPostList, 
							window.kendo.ui.progress($("#grdCOMM110P"), true), 
							window.kendo.ui.progress($("#grdCOMM110P"), false));
				}else{
					window.kendo.ui.progress($("#grdCOMM110P"), false);
				}
				
			},
		},
		schema : {
			type: "json",
			model: {
	            fields: {
	            	zoneNo     : { field: "zoneNo", type: 'string' },
	            	roadnmAddr : { field: "roadnmAddr", type: 'string' }
	            }
			}
		}
	}
	$("#grdCOMM110P").kendoGrid ({
		DataSource : COMM110PDataSource,
		persistSelection: true,
		sortable: true,
		selectable: true,
		noRecords: { template: '<div class="nodataMsg"><p>'+COMM110P_langMap.get("grid.nodatafound")+'</p></div>' },
		pageable: {
			  refresh:false,
			  buttonCount:10,
			  pageSize : 20,
			  messages: {
				display: " ",
				empty: COMM110P_langMap.get("fail.common.select"),
				itemsPerPage: ""
			 }
		},
		columns: [ 
			{   width: 30, 
				template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>', 
				attributes : { style : "text-align : center;" }
			}, 			
			{
				field: "zoneNo",
			    width: '70px',
			    title: COMM110P_langMap.get("COMM110P.search.postNo"),
			    type: "String"
			}, 			
			{
				field: "roadnmAddr", 
				width: '490px', 
				title: COMM110P_langMap.get("COMM110P.search.addr"),
				type: "String",
				attributes : { style : "text-align : left;" }
			}],
		height: 300
	});
	
	grdCOMM110P = $("#grdCOMM110P").data("kendoGrid");
	
	$("#COMM110P_zipnoKeyword").on('keyup',function(e){
		if(e.keyCode == 13){
			COMM110P_fnSearch();
		}
	});
	
	//조회
	$('#COMM110P_fnSearch').off("click").on("click", function () {
		COMM110P_fnSearch();
	});
	
	//확인
	$('#COMM110P_fnConfirm').off("click").on("click", function () {
		COMM110P_callback();
	});
});

function COMM110P_resultPostList(COMM110_data){

	if(COMM110_data.status < 0){
		COMM110_data.msg = COMM110_data.msg.replace('.', '.<br>');
		Utils.alert(COMM110_data.msg);
		return;
	}
	
	var COMM110P_jsonEncode = JSON.stringify(COMM110_data.COMM110SEL01List);
	var COMM110P_jsonDecode = JSON.parse(JSON.parse(COMM110P_jsonEncode));
	grdCOMM110P.setDataSource(COMM110P_jsonDecode);
	grdCOMM110P.dataSource.options.schema.data = COMM110P_jsonDecode;
}	


$("#grdCOMM110P").on('dblclick','tbody tr[data-uid]',function (STTC210P_e) {
	COMM110P_callback();
});

function COMM110P_fnSearch(){
	let COMM110P_zipnoKeyword = $('#COMM110P_zipnoKeyword').val();
	
	if(COMM110P_zipnoKeyword == ''){
		Utils.alert(COMM110P_langMap.get("COMM110P.check.keyword"));
		return;
	}	
	
	let COMM110P_data = {
			"zipnoKeyword" : COMM110P_zipnoKeyword
	};
	COMM110PDataSource.transport.read(JSON.stringify(COMM110P_data));
}

function COMM110P_callback(){
	let grid = $("#grdCOMM110P").data("kendoGrid");
	let sel = grid.select();
	let COMM110P_item = "";
    $.each (sel, function(idx, row) {
    	COMM110P_item = grid.dataItem(row);
    });
    Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(COMM110P_item);
    self.close();	
}

function COMM110P_checkNum(nStr){
	const regExp = /[0-9]/g;
    if(regExp.test(nStr)){
        return true;
    }else{
        return false;
    }
}