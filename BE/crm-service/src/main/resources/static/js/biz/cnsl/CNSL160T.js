var CNSL160TDataSource,grdCNSL160T;
var grdCNSL160T_custId,grdCNSL160T_custNm;
var CNSL160_codeList={"codeList":[]};
var CNSL160T_delay = 1000;

$(document).ready(function() {
        
	var data = { 
		tenantId    : GLOBAL.session.user.tenantId
	};
    $.ajax({
    	url         : GLOBAL.contextPath + '/cnsl/CNSL160SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList160,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
    
	$.ajax({
    	url         : GLOBAL.contextPath + '/cnsl/CNSL160SEL02',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : function(data) {
        	let jsonEncode = JSON.stringify(data.CNSL160SEL02);
        	let object=JSON.parse(jsonEncode);
        	grdCNSL160TCreat(object);
        },
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
	
	$(".CNSL160 #srchTxt").on("keydown",function(e){
        if(e.keyCode==13) {
        	setCNSL161SEL01();
        }
	});
});


function grdCNSL160TCreat(object) {
	let grdCNSL160T_column = JSON.parse(object);
	let pgmId = '';
	let dataSrcDvCd = '';
	
	if ( grdCNSL160T_column.length > 0 ) {
		pgmId = grdCNSL160T_column[0].pgmId;
		dataSrcDvCd = grdCNSL160T_column[0].dataSrcDvCd;
	}
	
	
	let grdCNSL160T_columns = [];
	
	if ( dataSrcDvCd == "D" ) { //DB-IO 버전
		CNSL160TDataSource ={
				transport: {
					read	: function (CNSL160T_jsonStr) {
						let CNSL160T_srchType = JSON.parse(CNSL160T_jsonStr);
						if ( CNSL160T_srchType.srchType == 'unknownCustomer' ) {
							Utils.ajaxCall('/cnsl/CNSL160SEL04', CNSL160T_jsonStr, CNSL160T_resultIndex_Unknown, 
							window.kendo.ui.progress($("#grdCNSL160T"), true), window.kendo.ui.progress($("#grdCNSL160T"), false))
						} else {
							Utils.ajaxCall('/cnsl/CNSL160SEL03', CNSL160T_jsonStr, CNSL160T_resultIndex_D, 
							window.kendo.ui.progress($("#grdCNSL160T"), true), window.kendo.ui.progress($("#grdCNSL160T"), false))
						}
					},
				},
		}
		for ( var i = 0; i < grdCNSL160T_column.length; i++ ) {
			let jsonColumn;
			if ( grdCNSL160T_column[i].voColId == 'custId' ) {
				grdCNSL160T_custId = grdCNSL160T_column[i].mgntItemCd;
			}
			
			if ( grdCNSL160T_column[i].voColId == 'custNm' ) {
				grdCNSL160T_custNm = grdCNSL160T_column[i].mgntItemCd;
			}
				 
			if ( grdCNSL160T_column[i].mgntItemTypCd == "C" ){
				CNSL160_codeList.codeList.push({"mgntItemCd":grdCNSL160T_column[i].mgntItemCd});
				
				let mgntItemCd = grdCNSL160T_column[i].mgntItemCd;
				
				jsonColumn = {
						width: "auto", field: mgntItemCd, title: grdCNSL160T_column[i].mgntItemNm,
						editor: function (container, options) {
							CNSL160M_commonTypCdEditor(container, options, grdCNSL160T[0].instance, mgntItemCd);
		                },
		                template: function (dataItem) {
		                	let comCd = dataItem[mgntItemCd];
		                	if (Utils.isNull(comCd)) {
		                		comCd = '';
		                	}
		                	return Utils.getComCdNm(CNSL160T_comCdList, mgntItemCd, comCd);
	                	}
				}
			} else {
				jsonColumn = {
						width: "auto", field: grdCNSL160T_column[i].mgntItemCd, title: grdCNSL160T_column[i].mgntItemNm
				}
			}
			grdCNSL160T_columns.push(jsonColumn);
		} 
		CNSL160T_fnInit();
	
	} else if ( dataSrcDvCd == "I" ) { //IF-IO 버전
		CNSL160TDataSource ={
				transport: {
					read	: function (CNSL160T_jsonStr) {
						let CNSL160T_srchType = JSON.parse(CNSL160T_jsonStr);
						if ( CNSL160T_srchType.srchType == 'unknownCustomer' ) {
							Utils.ajaxCall('/cnsl/CNSL160SEL04', CNSL160T_jsonStr, CNSL160T_resultIndex_Unknown, 
							window.kendo.ui.progress($("#grdCNSL160T"), true), window.kendo.ui.progress($("#grdCNSL160T"), false))
						} else {
							Utils.ajaxCall(pgmId, CNSL160T_jsonStr, CNSL160T_resultIndex_I, 
							window.kendo.ui.progress($("#grdCNSL160T"), true), window.kendo.ui.progress($("#grdCNSL160T"), false))
						}
					},
				},
		}
		for ( var i = 0; i < grdCNSL160T_column.length; i++ ) {
			let jsonColumn;
			if ( grdCNSL160T_column[i].voColId == 'custId' ) {
				grdCNSL160T_custId = grdCNSL160T_column[i].voColId;
			}
			
			if ( grdCNSL160T_column[i].voColId == 'custNm' ) {
				grdCNSL160T_custNm = grdCNSL160T_column[i].voColId;
			}
				 
			if ( grdCNSL160T_column[i].mgntItemTypCd == "C" ){
				CNSL160_codeList.codeList.push({"mgntItemCd":grdCNSL160T_column[i].mgntItemCd});
				
				let mgntItemCd = grdCNSL160T_column[i].mgntItemCd;
				let voColId = grdCNSL160T_column[i].voColId;
				
				jsonColumn = {
						width: "auto", field: voColId, title: grdCNSL160T_column[i].mgntItemNm,
						editor: function (container, options) {
							CNSL160M_commonTypCdEditor(container, options, grdCNSL160T[0].instance, voColId);
		                },
		                template: function (dataItem) {
		                	let comCd = dataItem[voColId];
		                	if (Utils.isNull(comCd)) {
		                		comCd = '';
		                	}
		                	return Utils.getComCdNm(CNSL160T_comCdList, mgntItemCd, comCd);
	                	}
				}
			} else {
				jsonColumn = {
						width: "auto", field: grdCNSL160T_column[i].voColId, title: grdCNSL160T_column[i].mgntItemNm
				}
			}
			grdCNSL160T_columns.push(jsonColumn);
		} 
		CNSL160T_fnInit();
	
		
	}
	$("#grdCNSL160T").kendoGrid({
		dataSource : CNSL160TDataSource,
		noRecords: {
			template: `<div class="nodataMsg"><p>${CNSL160T_langMap.get("CNSL160T.grid.nodatafound")}</p></div>`
	    },
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
				, itemsPerPage: ""
			    }
		},
		columns: grdCNSL160T_columns,
        dataBound: function() {
            grdCNSL160T_fnOnDataBound();
        },
		change: function(e) {
			let selectedRows = this.select();
			CNSL160T_selItem = this.dataItem(selectedRows[0]);
		}
	});
	
	grdCNSL160T = $("#grdCNSL160T").data("kendoGrid");
	heightResizeCNSL();
}


function CNSL160T_fnInit() {
    var param = CNSL160_codeList;
    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        CNSL160T_comCdList = JSON.parse(result.codeList);
    });
}

function setCNSL161SEL01() {
	var custNmSrchkey1 = null;
	var custNmSrchkey2 = null;
	if ( $(".CNSL160 #srchTxt").val().length == 1 ) {
		custNmSrchkey1 = $(".CNSL160 #srchTxt").val().substr(0,1);
	}
	if ( $(".CNSL160 #srchTxt").val().length == 2 ) {
		custNmSrchkey2 = $(".CNSL160 #srchTxt").val().substr(0,2)
	}
	var CNSL160T_data = { 
			tenantId 	   : GLOBAL.session.user.tenantId,
			usrId		   : GLOBAL.session.user.usrId,
			srchType 	   : $(".CNSL160 #srchType").val().split("_")[0], 
			voColId		   : $(".CNSL160 #srchType").val().split("_")[1],
			srchTxt 	   : $(".CNSL160 #srchTxt").val(),
			encryptYn      : $(".CNSL160 #srchType").val().split("_")[2],
			type		   : 'SEL'
       };
	var CNSL160T_jsonStr = JSON.stringify(CNSL160T_data);
	CNSL160TDataSource.transport.read(CNSL160T_jsonStr);
}

function searchCustomer(telNo, delay) {
	let combo = $(".CNSL160 #srchType")
	combo.data("kendoComboBox").dataSource.filter({
      field: "value",
      operator: "contains",
      value: 'T0009' // 휴대전화번호 공통코드값
    });
	let dataItem = combo.data("kendoComboBox").dataSource.view()[0];
    if (dataItem) {
      combo.data("kendoComboBox").value(dataItem.value);
    }
	$(".CNSL160 #srchTxt").val(telNo);
	
	var CNSL160T_data = { 
				tenantId    : GLOBAL.session.user.tenantId,
				usrId		: GLOBAL.session.user.usrId,
				srchType 	: $(".CNSL160 #srchType").val().split("_")[0], 
				voColId		: $(".CNSL160 #srchType").val().split("_")[1],
				srchTxt 	: telNo,
				encryptYn   : $(".CNSL160 #srchType").val().split("_")[2],
				type		: 'SEL'
       };	
	var CNSL160T_jsonStr = JSON.stringify(CNSL160T_data);
	CNSL160TDataSource.transport.read(CNSL160T_jsonStr);
	
	
	CNSL160T_delay = delay;
	combo.data("kendoComboBox").dataSource.filter(null);
}

function resultComboList160(data){
	let jsonEncode = JSON.stringify(data.CNSL160SEL01);
	let object=JSON.parse(jsonEncode);
	let codeList = JSON.parse(object);
	let dataSource = [];

    dataSource = dataSource.concat(codeList.filter(function (code) {
        code.text = code.mgntItemNm;
        code.value = code.mgntItemCd + '_' + code.voColId + '_' + code.crypTgtYn;
        return code;
    }))

    let kendoComboBox = $(".CNSL160 #srchType").kendoComboBox({
        dataSource: dataSource,
        dataTextField: "text",
        dataValueField: "value",
        clearButton: false,
        autoWidth: true,
    }).data("kendoComboBox");

    if (dataSource.length > 0) {
    	kendoComboBox.value(dataSource[0].value);
    }
    kendoComboBox.input.attr("readonly", true);
}

function CNSL160T_resultIndex_D(data){
	var CNSL160T_jsonEncode = JSON.stringify(data.CNSL160SEL03);
	var CNSL160T_jsonDecode = JSON.parse(JSON.parse(CNSL160T_jsonEncode));
	
	let grdCNSL160T_rows = [];
	if ( CNSL160T_jsonDecode.length > 0 ) {
		let jsonColumn = {}
		let CNSL160T_rowId = '';
		for ( var i = 0; i < CNSL160T_jsonDecode.length; i++ ) {
			if ( CNSL160T_rowId != CNSL160T_jsonDecode[i].custId ) {
				CNSL160T_rowId = CNSL160T_jsonDecode[i].custId;
				if ( i != 0 ) {
					grdCNSL160T_rows.push(jsonColumn)
					jsonColumn = {};
				}
				jsonColumn["custId"] = CNSL160T_jsonDecode[i].custId;
				jsonColumn[grdCNSL160T_custId] = CNSL160T_jsonDecode[i].custId;
				if ( grdCNSL160T_custId != CNSL160T_jsonDecode[i].mgntItemCd ) {
					jsonColumn[CNSL160T_jsonDecode[i].mgntItemCd] = CNSL160T_jsonDecode[i].custItemDataVlu;
				} 
			} else {
				if ( grdCNSL160T_custId != CNSL160T_jsonDecode[i].mgntItemCd ) {
					jsonColumn[CNSL160T_jsonDecode[i].mgntItemCd] = CNSL160T_jsonDecode[i].custItemDataVlu;
				}
			}
			
			if ( i == CNSL160T_jsonDecode.length-1 ) {
				grdCNSL160T_rows.push(jsonColumn)
			} 
		}
	} 
	grdCNSL160T.dataSource.data(grdCNSL160T_rows);
	
	if ( grdCNSL160T_rows.length == 1 ) {
		if ( !Utils.isNull(grdCNSL160T_custId) ){
        	custId = grdCNSL160T_rows[0][grdCNSL160T_custId]
        } else {
        	custId = grdCNSL160T_rows[0].custId;
        }
        if ( !Utils.isNull(grdCNSL160T_custNm) ){
        	custNm = grdCNSL160T_rows[0][grdCNSL160T_custNm]
        } else {
        	custNm = grdCNSL160T_rows[0].custNm;
        }
		setTimeout(function() {
			CNSL100MTabClick("/bcs/cnsl/CNSL162T")
			if ( typeof(settingCNSL162SEL01) != 'undefined' ) {
				settingCNSL162SEL01();
			}
		}, CNSL160T_delay);
	} 
}


function CNSL160T_resultIndex_I(data){
	let patApptInfo = JSON.parse(data.result);
	grdCNSL160T.dataSource.data(patApptInfo.result);
	
	if ( patApptInfo.result.length == 1 ) {
    	custId = patApptInfo.result[0].custId;
    	custNm = patApptInfo.result[0].custNm;
		setTimeout(function() {
			CNSL100MTabClick("/bcs/cnsl/CNSL162T")
			if ( typeof(settingCNSL162SEL01) != 'undefined' ) {
				settingCNSL162SEL01();
			}
		}, CNSL160T_delay);
	} 
}

function CNSL160T_resultIndex_Unknown(data){
	var CNSL160T_jsonEncode = JSON.stringify(data.CNSL160SEL04);
	var CNSL160T_jsonDecode = JSON.parse(JSON.parse(CNSL160T_jsonEncode));
	
	let grdCNSL160T_rows = [];
	if ( CNSL160T_jsonDecode.length > 0 ) {
		let jsonColumn = {}
		jsonColumn[grdCNSL160T_custId] = CNSL160T_jsonDecode[0].custId;
		jsonColumn[grdCNSL160T_custNm] = CNSL160T_jsonDecode[0].custNm;
		grdCNSL160T_rows.push(jsonColumn)
	} 
	
	grdCNSL160T.dataSource.data(grdCNSL160T_rows);
	
	custId = CNSL160T_jsonDecode[0].custId;
	custNm = CNSL160T_jsonDecode[0].custNm;
	
	setTimeout(function() {
		CNSL100MTabClick("/bcs/cnsl/CNSL162T")
		if ( typeof(settingCNSL162SEL01) != 'undefined' ) {
			settingCNSL162SEL01();
		}
	}, CNSL160T_delay);
}	



function openPopCNSL161PINS() {
	let param = {
			custId : ' ',
			upsertFlg : 'I',
			callbackKey: "setCNSL161SEL01"
		};
	Utils.setCallbackFunction("setCNSL161SEL01", setCNSL161SEL01);
	Utils.openPop(GLOBAL.contextPath + "/cnsl/CNSL161P", "CNSL161P", 1000, 800, param);
}


function grdCNSL160T_fnOnDataBound() {
	$("#grdCNSL160T tbody").unbind('click').on("click", "td", function(e) {
        var myVar = grdCNSL160T.dataItem($(this).closest("tr"));
        if ( !Utils.isNull(grdCNSL160T_custId) ){
        	custId = myVar[grdCNSL160T_custId]
        } else {
        	custId = myVar.custId;
        }
        if ( !Utils.isNull(grdCNSL160T_custNm) ){
        	custNm = myVar[grdCNSL160T_custNm]
        } else {
        	custNm = myVar.custNm;
        }
        CNSL100MTabClick("/bcs/cnsl/CNSL162T")
        if ( typeof(settingCNSL162SEL01) != 'undefined' ) {
			settingCNSL162SEL01();
		}
    });
}

function CNSL160M_commonTypCdEditor(container, options, grid, selectComCd) {
    $('<select data-bind="value:' + options.field + '"/>').appendTo(container).kendoComboBox({
        autoBind: true,
        dataTextField: "comCdNm",
        dataValueField: "comCd",
        dataSource: {
            data: CNSL160T_comCdList.filter(function (code) {
                return code.mgntItemCd == selectComCd
            })
        },
        change: function (e) {
            var element = e.sender.element;
            var row = element.closest("tr");
            var dataItem = grid.dataItem(row);
            var selectedValue = e.sender.value();
            grid.refresh();
        }
    });
}

function unknownCustomerSel() {
	var CNSL160T_data = { 
				tenantId 	   : GLOBAL.session.user.tenantId,
				srchType 	   : 'unknownCustomer',
				srchTxt 	   : GLOBAL.session.user.tenantId + '_1',
				encryptYn      : Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1
		       };	
	var CNSL160T_jsonStr = JSON.stringify(CNSL160T_data);
	CNSL160TDataSource.transport.read(CNSL160T_jsonStr);
}
