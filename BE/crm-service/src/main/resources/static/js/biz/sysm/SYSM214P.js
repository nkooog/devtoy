/***********************************************************************************************
 * Program Name : 사용자찾기 팝업(단일)(SYSM214P.js)
 * Creator      : sukim
 * Create Date  : 2022.04.20
 * Description  : 사용자찾기 팝업
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.20     sukim            최초작성   
 ************************************************************************************************/
var SYSM214PDataSource,grdSYSM214P;

$(document).ready(function () {
	SYSM214P_fnInitGrid();
	$('#SYSM214P_fnSearch').off("click").on("click", function () {
		let SYSM214P_usrNm = $('#SYSM214P_usrNm').val();
		// 20240801 :: 사용자찾기 조회 개선
		/*if(SYSM214P_usrNm == ''){
			Utils.alert(SYSM214P_langMap.get("SYSM211P.search.check.userNm"));
			return;
		}*/
		let tenantId = Utils.isNull(Utils.getUrlParam('tenantId'))? GLOBAL.session.user.tenantId : Utils.getUrlParam('tenantId')
		let SYSM214P_data = {
			"usrNm"    : SYSM214P_usrNm,
			"tenantId" : tenantId,
			"cmmtSetlmnYn" : Utils.getUrlParam('cmmtSetlmnYn'),
			"kldMgntSetlmnYn" : Utils.getUrlParam('kldMgntSetlmnYn'),
			"usrGrd":  Utils.getUrlParam('usrGrd'),	//shpark 20240828 : 사용자 찾기 시 관리자 권한 제외 조회용
		};

		SYSM214PDataSource.transport.read(JSON.stringify(SYSM214P_data));
	});
	
	$('#SYSM214P_fnConfirm').off("click").on("click", function () {
		let grid = $("#grdSYSM214P").data("kendoGrid");
		let sel = grid.select();
		let SYSM214P_item = "";
	    $.each (sel, function(idx, row) {
	    	SYSM214P_item = grid.dataItem(row);
	    });
	    Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM214P_item);
	    
	    console.log("SYSM214P_item : " ,SYSM214P_item);
	    self.close();	    
	});
	
	$("#grdSYSM214P").on('dblclick','tbody tr[data-uid]',function (e) {
		let grdSYSM214P		= $("#grdSYSM214P").data("kendoGrid");
		let SYSM214P_cell 	= $(e.currentTarget);
		let SYSM214P_item = "";
		
		SYSM214P_item = grdSYSM214P.dataItem(SYSM214P_cell.closest("tr"));
		
		Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM214P_item);
		self.close();
	});

	$("#SYSM214P_usrNm").on("keyup",function(e){
		if(e.keyCode == "13"){
			$('#SYSM214P_fnSearch').click();
		}
	})

	// 분기처리 자동조회
	if(!Utils.isNull(Utils.getUrlParam('cmmtSetlmnYn')) || !Utils.isNull(Utils.getUrlParam('kldMgntSetlmnYn'))){
		console.log(Utils.getUrlParam('kldMgntSetlmnYn'))
		let tenantId = Utils.isNull(Utils.getUrlParam('tenantId'))? GLOBAL.session.user.tenantId : Utils.getUrlParam('tenantId')
		let SYSM214P_data = {
			"tenantId" : tenantId,
			"cmmtSetlmnYn" : Utils.getUrlParam('cmmtSetlmnYn'),
			"kldMgntSetlmnYn" : Utils.getUrlParam('kldMgntSetlmnYn'),
			"usrGrd":  Utils.getUrlParam('usrGrd'),	//관리자 권한 제외 조회용
		};
		SYSM214PDataSource.transport.read(JSON.stringify(SYSM214P_data));
	}



});

function SYSM214P_resultUserList(data){

	let SYSM214P_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(data.SYSM211SEL01List)));
	grdSYSM214P.setDataSource(SYSM214P_jsonDecode);
	grdSYSM214P.dataSource.options.schema.data = SYSM214P_jsonDecode;

	if(Utils.getUrlParam('noAdminSearch') == 'Y'){
		if(JSON.parse(data.SYSM211SEL01List).length == 0){
			Utils.alert(SYSM214P_langMap.get("SYSM214P.message.noSearchAdmin"));
		}
	}
}

function SYSM214P_fnInitGrid(){
	SYSM214PDataSource={
			transport: {
				read	: function (SYSM214P_jsonStr) {
					if(Utils.isNull(SYSM214P_jsonStr.data)){
						Utils.ajaxCall('/sysm/SYSM211SEL01', SYSM214P_jsonStr, SYSM214P_resultUserList, 
								window.kendo.ui.progress($("#grdSYSM214P"), true), window.kendo.ui.progress($("#grdSYSM214P"), false));					
					}else{
						window.kendo.ui.progress($("#grdSYSM214P"), false);
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
		$("#grdSYSM214P").kendoGrid ({
			DataSource : SYSM214PDataSource,
			persistSelection: true,
			sortable: true,
			selectable: true,
			noRecords: { template: '<div class="nodataMsg"><p>'+SYSM214P_langMap.get("grid.nodatafound")+'</p></div>' },
			pageable: {
				  refresh:false,
				  buttonCount:10,
				  pageSize : 20,
				  messages: {
					display: " ",
					empty: SYSM214P_langMap.get("fail.common.select"),
					itemsPerPage: ""
				 }
			},
			columns:[ 
				{   width: 20, 
					template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>'
				}, 
				{
					field: "tenantId",
				    width: '50px',
				    title: SYSM214P_langMap.get("SYSM211P.search.tenamtId"),
				    type: "String"
				},	
				{
					field: "fmnm", 
					width: '100px',
					title: SYSM214P_langMap.get("SYSM211P.search.tenamtNm"),
					type: "String",
					attributes : { style : "text-align : left;" }
				},			
				{
					field: "usrId", 
					width: '50px', 
					title: SYSM214P_langMap.get("SYSM211P.search.userId"),  
					type: "String"
				}, 
				{
					field: "decUsrNm", 
					width: '70px',
					title:  SYSM214P_langMap.get("SYSM211P.search.userNm"),
					type: "String",
					attributes : { style : "text-align : left;" }
				}, 
				{
					field: "orgNm", 
					width: '70px', 
					title: SYSM214P_langMap.get("SYSM211P.grid.column.orgNm"),
					type: "String", 
					attributes : { style : "text-align : left;" }
				},
				{
					field: "usrGrdNm", 
					width: '90px', 
					title: SYSM214P_langMap.get("SYSM211P.grid.column.usrGrdNM"),
					type: "String",
					attributes : { style : "text-align : left;" }
				},
				{
					field: "acStCdNm", 
					width: '50px', 
					title: SYSM214P_langMap.get("SYSM211P.grid.column.acSt"),
					type: "String",
					attributes : { style : "text-align : left;" }
				}]
			,height: 350
		});
		
		grdSYSM214P = $("#grdSYSM214P").data("kendoGrid");	
}