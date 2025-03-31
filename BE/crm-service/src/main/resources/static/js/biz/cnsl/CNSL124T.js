var CNSL124TDataSource,grdCNSL124T
var startCNSL124, endCNSL124;

$(document).ready(function() {
	
	//공통콤보 불러오기
	var data = { "codeList": [
		{"mgntItemCd":"S0001"}
	]};
    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList124,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
    
    startCNSL124 = $(".CNSL124 #startDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: startChangeCNSL124,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	endCNSL124 = $(".CNSL124 #endDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: endChangeCNSL124,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");

	startCNSL124.max(endCNSL124.value());
	endCNSL124.min(startCNSL124.value()); 
	getRangeDayCNSL124(cnslRangeDay);
    
	CNSL124TDataSource ={
			transport: {
				read	: function (CNSL124T_jsonStr) {
					Utils.ajaxCall('/cnsl/CNSL124SEL01', CNSL124T_jsonStr, CNSL124T_resultIndex, 
					window.kendo.ui.progress($("#grdCNSL124T"), true), window.kendo.ui.progress($("#grdCNSL124T"), false))
				},
			},
	}
	
	var grdCNSL124T_columns = [];
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		grdCNSL124T_columns = [ 
			{ width: "auto", field: "sndgRsvDt", title: CNSL124T_langMap.get("CNSL124T.grid.column.sndgRsvDt"), },
			{ width: "auto", field: "custId", title: CNSL124T_langMap.get("CNSL124T.grid.column.custIdH"), },
			{ width: "auto", field: "custNm", title: CNSL124T_langMap.get("CNSL124T.grid.column.custNmH"), },
			{ width: "auto", field: "sndgTelNo", title: CNSL124T_langMap.get("CNSL124T.grid.column.sndgTelNo"), }, 
			{ width: "auto", field: "smsStNm", title: CNSL124T_langMap.get("CNSL124T.grid.column.smsStNm"), },
			{ width: "auto", field: "smsRsltNm", title: CNSL124T_langMap.get("CNSL124T.grid.column.smsRsltNm"), },
		]
	} else {
		grdCNSL124T_columns = [ 
			{ width: "auto", field: "sndgRsvDt", title: CNSL124T_langMap.get("CNSL124T.grid.column.sndgRsvDt"), },
			{ width: "auto", field: "custId", title: CNSL124T_langMap.get("CNSL124T.grid.column.custId"), },
			{ width: "auto", field: "custNm", title: CNSL124T_langMap.get("CNSL124T.grid.column.custNm"), },
			{ width: "auto", field: "sndgTelNo", title: CNSL124T_langMap.get("CNSL124T.grid.column.sndgTelNo"), }, 
			{ width: "auto", field: "smsStNm", title: CNSL124T_langMap.get("CNSL124T.grid.column.smsStNm"), },
			{ width: "auto", field: "smsRsltNm", title: CNSL124T_langMap.get("CNSL124T.grid.column.smsRsltNm"), }, 
		]
	}
	
	$("#grdCNSL124T").kendoGrid({
		DataSource : CNSL124TDataSource,
		noRecords: {
			template: `<div class="nodataMsg"><p>${CNSL124T_langMap.get("CNSL124T.grid.nodatafound")}</p></div>`
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
				//, empty: CNSL124T_langMap.get("CNSL124T.grid.message")
				, itemsPerPage: ""
			    }
		},
		columns: grdCNSL124T_columns,
		change: function(e) {
			let selectedRows = this.select();
			CNSL124T_selItem = this.dataItem(selectedRows[0]);
		}
	});
	grdCNSL124T = $("#grdCNSL124T").data("kendoGrid");
	
	heightResizeCNSL();
	CNSL124T_fnSearch();
	CNSL_Utils.setfunctionCustIdList(CNSL124T_fnSearch);
});

function resultComboList124(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	
//	Utils.setKendoComboBox(jsonDecode, "S0001", '.CNSL124 .S0001', '', false) ;
}

function getRangeDayCNSL124(rangeDay) {
	
	var endDay = new Date();	// 현재 날짜 및 시간
	var eYear = endDay.getFullYear();
    var eMonth = ("0" + (1 + endDay.getMonth())).slice(-2);
    var eDay = ("0" + endDay.getDate()).slice(-2);
    var endDate = eYear + '-' +  eMonth + '-' + eDay; 
    
    var startDay = new Date(endDay.setDate(endDay.getDate() - rangeDay));
    var sYear = startDay.getFullYear();
    var sMonth = ("0" + (1 + startDay.getMonth())).slice(-2);
    var sDay = ("0" + startDay.getDate()).slice(-2);
    var startDate = sYear + '-' +  sMonth + '-' + sDay; 
	
    $(".CNSL124 #startDate").val(startDate);
    $(".CNSL124 #endDate").val(endDate);
}


function startChangeCNSL124() {
	var startDate = startCNSL124.value();
	var endDate = endCNSL124.value();

	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		endCNSL124.min(startDate);
	} else if (endDate) {
		startCNSL124.max(new Date(endDate));
	} else {
		endDate = new Date();
		startCNSL124.max(endDate);
		endCNSL124.min(endDate);
	}
}

function endChangeCNSL124() {
	var endDate = endCNSL124.value();
	var startDate = startCNSL124.value();

	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		startCNSL124.max(endDate);
	} else if (startDate) {
		endCNSL124.min(new Date(startDate));
	} else {
		endDate = new Date();
		startCNSL124.max(endDate);
		endCNSL124.min(endDate);
	}
}

function CNSL124T_resultIndex(data){
	
	var CNSL124T_jsonEncode = JSON.stringify(data.CNSL124SEL01);
	var CNSL124T_jsonDecode = JSON.parse(JSON.parse(CNSL124T_jsonEncode));
	
	grdCNSL124T.dataSource.data(CNSL124T_jsonDecode);
}	

function CNSL124T_fnSearch() {
	var CNSL124T_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"cntcCustId" : custId,
		"srchType" : $(".CNSL124 #srchType").val(),
		"srchTxt" : $(".CNSL124 #srchTxt").val(),
		"startDate" : $(".CNSL124 #startDate").val().replace(/\-/g, ''),
		"endDate" : $(".CNSL124 #endDate").val().replace(/\-/g, '')
    };	
	var CNSL124T_jsonStr = JSON.stringify(CNSL124T_data);
	CNSL124TDataSource.transport.read(CNSL124T_jsonStr);
}

