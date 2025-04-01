/***********************************************************************************************
 * Program Name : 메뉴관리(CNSL131M.js)
 * Creator      : jrlee
 * Create Date  : 2022.03.18
 * Description  : 메뉴관리
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.18     jrlee           최초작성   
 ************************************************************************************************/

var CNSL131PDataSource,grdCNSL131P;

$(document).ready(function () {
	CNSL131P_fnInitGrid();
	$('#CNSL131P_fnSearch').off("click").on("click", function () {
		let CNSL131P_data = {
				"tenantId"    	   : $("#CNSL131M_tenantId").val(),
				"custItemGrpNo"    : $("#CNSL131P_custItemGrpNo").val(),
				"mgntItemNm"       : $("#CNSL131P_mgntItemNm").val()
		};
		CNSL131PDataSource.transport.read(JSON.stringify(CNSL131P_data));		
	});
	
	$('#CNSL131P_fnConfirm').off("click").on("click", function () {
		let grid = $("#grdCNSL131P").data("kendoGrid");
		let sel = $("input:checked", grid.tbody).closest("tr");
		let CNSL131P_items = []; 
	    $.each (sel, function(idx, row) {
	    	let CNSL131P_item = grid.dataItem(row);
	    	CNSL131P_items.push(CNSL131P_item);
	    });
	    Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(CNSL131P_items);
	    self.close();			
	});
	CNSL131P_comboCreate({"tenantId": GLOBAL.session.user.tenantId});
});


function CNSL131P_comboCreate(data) {
    $.ajax({
    	url         : '/bcs/cnsl/CNSL131SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList131,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
}

function CNSL131P_resultUserList(data){
	var CNSL131P_jsonEncode = JSON.stringify(data.list);
	var CNSL131P_jsonDecode = JSON.parse(JSON.parse(CNSL131P_jsonEncode));
	grdCNSL131P.setDataSource(CNSL131P_jsonDecode);
	grdCNSL131P.dataSource.options.schema.data = CNSL131P_jsonDecode;
}	

function CNSL131P_fnInitGrid(){
	CNSL131PDataSource={
			transport: {
				read	: function (CNSL131P_jsonStr) {
					if(Utils.isNull(CNSL131P_jsonStr.data)){
						Utils.ajaxCall('/cnsl/CNSL131SEL02', CNSL131P_jsonStr, CNSL131P_resultUserList, 
								window.kendo.ui.progress($("#grdCNSL131P"), true), window.kendo.ui.progress($("#grdCNSL131P"), false));
					}else{
						window.kendo.ui.progress($("#grdCNSL131P"), false);
					}
					
				},
			},
			schema : {
				type: "json",
				model: {
		            fields: {
		            	tenantId             : { field: "tenantId" ,type: 'string' },
		            	custItemGrpNo        : { field: "custItemGrpNo" ,type: 'string' },
		            	custItemGrpNm        : { field: "custItemGrpNm" ,type: 'string' },
		            	custItemNo           : { field: "custItemNo" ,type: 'string' },
		            	mgntItemCd           : { field: "mgntItemCd" ,type: 'string' },
		            	mgntItemNm           : { field: "mgntItemNm" ,type: 'string' },
		            	mgntItemTypCd        : { field: "mgntItemTypCd" ,type: 'string' },
		            	dataSzIntMnriCnt     : { field: "dataSzIntMnriCnt" ,type: 'string' },
		            	dataSzDecMnriCnt     : { field: "dataSzDecMnriCnt" ,type: 'string' },
		            	scrnCtolSz           : { field: "scrnCtolSz" ,type: 'string' },
		            	scrnDispSeq          : { field: "scrnDispSeq" ,type: 'string' },
		            	scrnDispYn           : { field: "scrnDispYn" ,type: 'string' },
		            	mdtyYn               : { field: "mdtyYn" ,type: 'string' }
//		            	useDvCd              : { field: "useDvCd" ,type: 'string' }
		            }
				}
			}
		}
		
		$("#grdCNSL131P").kendoGrid ({
			DataSource : CNSL131PDataSource,
			persistSelection: true,
			sortable: true,
			noRecords: { template: '<div class="nodataMsg"><p>No Data</p></div>' },
			pageable: {
				  refresh:false,
				  buttonCount:5,
				  pageSize : 100,
				  messages: {
					display: " ",
					empty: "No Data",
					itemsPerPage: ""
				 }
			},
			columns: [ 
			{
					width: '30px',
					selectable: true,
					template: "<input type='checkbox' class='k-checkbox k-checkbox-md k-rounded-md checkbox' />", 
					attributes: {class: "k-text-center"}
			}/*,
			{
				field: "custItemGrpNo",
			    width: '40px',
			    title: "NO",
			    type: "String"
			}*/,		
			{
				field: "custItemGrpNm", 
				width: '150px', 
				title: "항목그룹명",
				type: "String",
				attributes : { style : "text-align : left;" }
			},
			{
				field: "mgntItemCd", 
				width: '130px', 
				title: "관리항목코드",   
				type: "String"
			}, 
			{
				field: "mgntItemNm", 
				width: 'auto', 
				title: "관리항목명",
				type: "String",
				attributes : { style : "text-align : left;" }
			}, 
			{
				field: "mgntItemTypCd", 
				width: '100px', 
				title: "관리항목유형",
				type: "String", 
				attributes : { style : "text-align : left;" }
			},
			{
				field: "dataSzIntMnriCnt", 
				width: '80px', 
				title: "데이터크기",
				type: "String",
				attributes : { style : "text-align : left;" }
			},
			{
				field: "scrnDispSeq", 
				width: '60px', 
				title: "정렬순서",
				type: "String",
				attributes : { style : "text-align : left;" }
			},
			{
				field: "scrnDispYn", 
				width: '70px', 
				title: "화면표시",
				type: "String",
				attributes : { style : "text-align : left;" }
			},
			{
				field: "mdtyYn", 
				width: '60px', 
				title: "필수",
				type: "String",
				attributes : { style : "text-align : left;" }
			}/*,
			{
				field: "useDvCd", 
				width: '60px', 
				title: "사용구분",
				type: "String",
				attributes : { style : "text-align : left;" }
			}*/]
			,height: 350
		});
		
		grdCNSL131P = $("#grdCNSL131P").data("kendoGrid");	
}

function CNSL131M_fnSearchTopMenuList() {
	CNSL131P_comboCreate({"tenantId": $("#CNSL131M_tenantId").val()});
}

function CNSL131M_fnSearchTenant() {
	Utils.setCallbackFunction("CNSL131M_fnSYSM101PCallback", function(tenantId) {
        $("#CNSL131M_tenantId").val(tenantId);
        GetTenantNm(tenantId, "CNSL131M_tenantNm");

        CNSL131M_fnSearchTopMenuList();
    });
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM101P", "SYSM101P", 900, 600, {callbackKey: "CNSL131M_fnSYSM101PCallback"})
}

function resultComboList131(data){
	let jsonEncode = JSON.stringify(data.list);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	Utils.setKendoComboBox(jsonDecode, "layoutList", '.CNSL131 #CNSL131P_custItemGrpNo', '', true) ;
}