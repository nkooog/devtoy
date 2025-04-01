var CNSL114PDataSource,grdCNSL114P,CNSL114P_delay;

$(document).ready(function() {
	
	let CNSL114_combo = [
		{ text: "챠트번호", value: "1" },
		{ text: "환자명", value: "2" },
		{ text: "전화번호", value: "3" }
	]
	$(".CNSL114 #srchType").kendoComboBox({ 
		dataTextField: "text",
		dataValueField: "value",
		dataSource: CNSL114_combo,
		clearButton: false,
		height: 200,
	}); 
	
	let combobox = $(".CNSL114 #srchType").data("kendoComboBox");
    combobox.value(Utils.getUrlParam('srchType'));
    if ( Utils.getUrlParam('srchTxt') != 0 ) {
    	$(".CNSL114 #srchTxt").val(Utils.getUrlParam('srchTxt'))
    } 
	
	$("#srchTxt").on("keydown",function(e){
        if(e.keyCode==13) {
        	setCNSL114SEL01();
        }
	});
	
	CNSL114PDataSource ={
			transport: {
				read	: function (CNSL114P_jsonStr) {
					Utils.ajaxCall('/cnsl/CNSL114SEL01', CNSL114P_jsonStr, CNSL114P_resultIndex, 
					window.kendo.ui.progress($("#grdCNSL114P"), true), window.kendo.ui.progress($("#grdCNSL114P"), false))
				},
			},
	}
	
	var grdCNSL114P_columns = [];
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		grdCNSL114P_columns = [ 
			{ width: 80, field: "custId", title: CNSL114P_langMap.get("CNSL114P.grid.column.custIdH"), },
			{ width: 150, field: "custNm", title: CNSL114P_langMap.get("CNSL114P.grid.column.custNmH")},
			{ width: "auto", field: "mbleTelNo", title: CNSL114P_langMap.get("CNSL114P.grid.column.mbleTelNo"),
                template: function (data) {
                	return maskingFunc.phone(data.mbleTelNo);
                }
			},
			{ width: "auto", field: "owhmTelNo", title: CNSL114P_langMap.get("CNSL114P.grid.column.owhmTelNo"),
                template: function (data) {
                	return maskingFunc.phone(data.owhmTelNo);
                }
			},
		]
	} else {
		grdCNSL114P_columns = [ 
			{ width: 80, field: "custId", title: CNSL114P_langMap.get("CNSL114P.grid.column.custId"), },
			{ width: 150, field: "custNm", title: CNSL114P_langMap.get("CNSL114P.grid.column.custNm")},
			{ width: "auto", field: "mbleTelNo", title: CNSL114P_langMap.get("CNSL114P.grid.column.mbleTelNo"),
                template: function (data) {
                	return maskingFunc.phone(data.mbleTelNo);
                }
			},
			{ width: "auto", field: "owhmTelNo", title: CNSL114P_langMap.get("CNSL114P.grid.column.owhmTelNo"),
                template: function (data) {
                	return maskingFunc.phone(data.owhmTelNo);
                }
			},
		]
	}
	
	$("#grdCNSL114P").kendoGrid({
		dataSource : CNSL114PDataSource,
		noRecords: {
			template: `<div class="nodataMsg"><p>${CNSL114P_langMap.get("CNSL114P.grid.nodatafound")}</p></div>`
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
				//, empty: CNSL114P_langMap.get("CNSL114P.grid.message")
				, itemsPerPage: ""
			    }
		},
		columns: grdCNSL114P_columns,
        dataBound: function() {
            grdCNSL114P_fnOnDataBound();
        },
		change: function(e) {
			let selectedRows = this.select();
			CNSL114P_selItem = this.dataItem(selectedRows[0]);
		}
	});
	grdCNSL114P = $("#grdCNSL114P").data("kendoGrid");
	
	
	setTimeout(function() {
		if ( $(".CNSL114 #srchTxt").val() != "" ) {
			setCNSL114SEL01();
		} 
	}, 500);
	
	
});

function setCNSL114SEL01() {
	var custNmSrchkey1 = null;
	var custNmSrchkey2 = null;
	if ( $(".CNSL114 #srchTxt").val().length == 1 ) {
		custNmSrchkey1 = $(".CNSL114 #srchTxt").val().substr(0,1);
	}
	if ( $(".CNSL114 #srchTxt").val().length == 2 ) {
		custNmSrchkey2 = $(".CNSL114 #srchTxt").val().substr(0,2)
	}
	var CNSL114P_data = { 
				tenantId 	   : GLOBAL.session.user.tenantId,
				srchType 	   : $(".CNSL114 #srchType").val(), 
				srchTxt 	   : $(".CNSL114 #srchTxt").val(),
				custNmSrchkey1 : custNmSrchkey1,
				custNmSrchkey2 : custNmSrchkey2,
				encryptYn      : Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1
		       };	
	var CNSL114P_jsonStr = JSON.stringify(CNSL114P_data);
	CNSL114PDataSource.transport.read(CNSL114P_jsonStr);
}

function CNSL114P_resultIndex(data){
	var CNSL114P_jsonEncode = JSON.stringify(data.CNSL114SEL01);
	var CNSL114P_jsonDecode = JSON.parse(JSON.parse(CNSL114P_jsonEncode));
	grdCNSL114P.dataSource.data(CNSL114P_jsonDecode);
	if ( CNSL114P_jsonDecode.length == 1 && CNSL114P_delay != undefined ) {
		custId = CNSL114P_jsonDecode[0].custId;
		custNm = CNSL114P_jsonDecode[0].custNm;
		setTimeout(function() {
			CNSL100MTabClick("/bcs/cnsl/CNSL112T")
			if ( typeof(settingCNSL112SEL01) != 'undefined' ) {
				settingCNSL112SEL01();
			}
		}, CNSL114P_delay);
		
	} 
}	

function grdCNSL114P_fnOnDataBound() {
	$("#grdCNSL114P tbody").unbind('click').on("click", "td", function(e) {
		var myVar = grdCNSL114P.dataItem($(this).closest("tr"));
        window.opener.custId = myVar.custId;
        window.opener.custNm = myVar.custNm;
        Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
        self.close();
    });
}

function unknownCustomerSel() {
	var custNmSrchkey1 = null;
	var custNmSrchkey2 = null;
	var CNSL114P_data = { 
				tenantId 	   : GLOBAL.session.user.tenantId,
				srchType 	   : '1', 
				srchTxt 	   : GLOBAL.session.user.tenantId + '_1',
				custNmSrchkey1 : custNmSrchkey1,
				custNmSrchkey2 : custNmSrchkey2,
				encryptYn      : Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1
		       };	
	var CNSL114P_jsonStr = JSON.stringify(CNSL114P_data);
	CNSL114PDataSource.transport.read(CNSL114P_jsonStr);
}
