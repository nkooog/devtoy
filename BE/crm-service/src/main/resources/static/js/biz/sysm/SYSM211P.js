/***********************************************************************************************
 * Program Name : 사용자찾기 팝업(SYSM211P.js)
 * Creator      : 허해민
 * Create Date  : 2022.01.25
 * Description  : 사용자찾기 팝업
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.01.25     허해민           최초작성
 * 2022.05.17     sukim            전반적인 수정   
 ************************************************************************************************/
var SYSM211PDataSource,grdSYSM211P;

$(document).ready(function () {
	SYSM211P_fnInitGrid();
	
	$('#SYSM211P_fnConfirm').off("click").on("click", function () {
		let grid = $("#grdSYSM211P").data("kendoGrid");
		let sel = $("input:checked", grid.tbody).closest("tr");
		let SYSM211P_items = []; 
	    $.each (sel, function(idx, row) {
	    	let SYSM211P_item = grid.dataItem(row);
	    	SYSM211P_items.push(SYSM211P_item);
	    });
	    Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM211P_items);
	    
	    console.log("SYSM211P_items : " , SYSM211P_items);
	    self.close();			
	});
	
	$("#grdSYSM211P").on('dblclick','tbody tr[data-uid]',function (e) {
		let SYSM211P_cell = $(e.currentTarget);
		let SYSM211P_items = [];
		
		SYSM211P_selItem = grdSYSM211P.dataItem(SYSM211P_cell.closest("tr"));
		SYSM211P_items.push(SYSM211P_selItem);
		
		Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM211P_items);		
		self.close();
	});
	
	//SYSM211P_fnSetTenentName();
	CMMN_SEARCH_TENANT["SYSM211P"].fnInit(function(e){
		SYSM211P_fnSearchUser();
	});
});

function SYSM211P_fnSearchUser(){
	let SYSM211P_usrNm = $("#SYSM211P_usrNm").val();
	/*if(Utils.isNull(SYSM211P_usrNm)){
		Utils.alert(SYSM211P_langMap.get("SYSM211P.search.check.userNm"));
		return;
	}*/
	//let tenantId = Utils.isNull(Utils.getUrlParam('tenantId'))? GLOBAL.session.user.tenantId : Utils.getUrlParam('tenantId')
	let tenantId = $("#SYSM211P_tenantId").val();
	let SYSM211P_data = {
			"usrNm"    : SYSM211P_usrNm,
			"tenantId" : tenantId,
			"usrGrd": GLOBAL.session.user.originUsrGrd
	};
	SYSM211PDataSource.transport.read(JSON.stringify(SYSM211P_data));
}

function SYSM211P_SearchTenantNm() {
	let SYSM211P_tenantId 	=  $('#SYSM211P_tenantId').val();
	if(SYSM211P_tenantId == ''){
		Utils.alert(SYSM211P_langMap.get("aicrm.message.tenantInfo"));
		return;
	}	
	GetTenantNm(SYSM211P_tenantId,'SYSM211P_tenantNm');
}

function SYSM211P_resultUserList(data){
	var SYSM211P_jsonEncode = JSON.stringify(data.SYSM211SEL01List);
	var SYSM211P_jsonDecode = JSON.parse(JSON.parse(SYSM211P_jsonEncode));
	grdSYSM211P.setDataSource(SYSM211P_jsonDecode);
	grdSYSM211P.dataSource.options.schema.data = SYSM211P_jsonDecode;
}	

function SYSM211P_fnInitGrid(){
	SYSM211PDataSource={
			transport: {
				read	: function (SYSM211P_jsonStr) {
					if(Utils.isNull(SYSM211P_jsonStr.data)){
						Utils.ajaxCall('/sysm/SYSM211SEL01', SYSM211P_jsonStr, SYSM211P_resultUserList, 
								window.kendo.ui.progress($("#grdSYSM211P"), true), window.kendo.ui.progress($("#grdSYSM211P"), false));
					}else{
						window.kendo.ui.progress($("#grdSYSM211P"), false);
					}
					
				},
			},
			schema : {
				type: "json",
				model: {
		            fields: {
		            	tenantId    : { field: "tenantId" ,type: 'string' },
		            	fmnm        : { field: "fmnm" ,type: 'string' },
		            	usrId       : { field: "usrId" ,type: 'string' },
		            	decUsrNm    : { field: "decUsrNm" ,type: 'string' },
		            	orgNm       : { field: "orgNm" ,type: 'string' },
		            	usrGrdNm    : { field: "usrGrdNm" ,type: 'string' },
		            	acStCdNm    : { field: "acStCdNm" ,type: 'string' }  	
		            }
				}
			}
		}
		
		$("#grdSYSM211P").kendoGrid ({
			DataSource : SYSM211PDataSource,
			persistSelection: true,
			sortable: true,
			noRecords: { template: '<div class="nodataMsg"><p>'+SYSM211P_langMap.get("grid.nodatafound")+'</p></div>' },
			pageable: {
				  refresh:false,
				  buttonCount:5,
				  pageSize : 100,
				  messages: {
					display: " ",
					empty: SYSM211P_langMap.get("fail.common.select"),
					itemsPerPage: ""
				 }
			},
			columns: [ 
			{
					width: '20px',
					selectable: true,
					template: "<input type='checkbox' class='k-checkbox k-checkbox-md k-rounded-md checkbox' />", 
					attributes: {class: "k-text-center"}
			},
			{
				field: "tenantId",
			    width: '50px',
			    title: SYSM211P_langMap.get("SYSM211P.search.tenamtId"),
			    type: "String"
			},		
			{
				field: "fmnm", 
				width: '120px', 
				title: SYSM211P_langMap.get("SYSM211P.search.tenamtNm"),
				type: "String",
				attributes : { style : "text-align : left;" }
			},
			{
				field: "usrId", 
				width: '50px', 
				title: SYSM211P_langMap.get("SYSM211P.search.userId"),   
				type: "String"
			}, 
			{
				field: "decUsrNm", 
				width: '80px', 
				title: SYSM211P_langMap.get("SYSM211P.search.userNm"),
				type: "String",
				attributes : { style : "text-align : left;" }
			}, 
			{
				field: "orgNm", 
				width: '90px', 
				title: SYSM211P_langMap.get("SYSM211P.grid.column.orgNm"),
				type: "String", 
				attributes : { style : "text-align : left;" }
			},
			{
				field: "usrGrdNm", 
				width: '90px', 
				title: SYSM211P_langMap.get("SYSM211P.grid.column.usrGrdNM"),
				type: "String",
				attributes : { style : "text-align : left;" }
			},
			{
				field: "acStCdNm", 
				width: '50px', 
				title: SYSM211P_langMap.get("SYSM211P.grid.column.acSt"),
				type: "String",
				attributes : { style : "text-align : left;" }
			}]
			,height: 350
		});
		
		grdSYSM211P = $("#grdSYSM211P").data("kendoGrid");	
}
