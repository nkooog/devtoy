var CNSL120TDataSource,grdCNSL120T
var startCNSL120, endCNSL120;
var grdCNSL120Target = '';
var CNSL120T_ToolTip;

$(document).ready(function() {
	$(".CNSL120 #srchTxt").on( "keyup", function(e){
		if (e.keyCode === 13) {
			CNSL120TDataSourceSet();
        }
	});
	
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
        success     : resultComboList120,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
    
    startCNSL120 = $(".CNSL120 #startDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: startChangeCNSL120,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	endCNSL120 = $(".CNSL120 #endDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: endChangeCNSL120,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");

	startCNSL120.max(endCNSL120.value());
	endCNSL120.min(startCNSL120.value()); 
	getRangeDayCNSL120(cnslRangeDay);
    
	CNSL120TDataSource ={
			transport: {
				read	: function (CNSL120T_jsonStr) {
					Utils.ajaxCall('/cnsl/CNSL120SEL01', CNSL120T_jsonStr, CNSL120T_resultIndex, 
					window.kendo.ui.progress($("#grdCNSL120T"), true), window.kendo.ui.progress($("#grdCNSL120T"), false))
				},
			},
	}
	
	var grdCNSL120T_columns = [];
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		grdCNSL120T_columns = [ 
			{ width: 60, field: "unfyCntcHistNo", title: CNSL120T_langMap.get("CNSL120T.grid.column.unfyCntcHistNo") },
			{ width: 100, field: "cntcCustId", title: CNSL120T_langMap.get("CNSL120T.grid.column.cntcCustIdH"), },
			{ width: 100, field: "cntcCustNm", title: CNSL120T_langMap.get("CNSL120T.grid.column.cntcCustNmH"), },
			{ width: "auto", field: "cnslTypNm", title: CNSL120T_langMap.get("CNSL120T.grid.column.cnslTypNm"), attributes: {"class": "k-text-left"}}, 
			{ width: 150, field: "cntcCpltHourptsec", title: CNSL120T_langMap.get("CNSL120T.grid.column.lstCorcDtm"), 
				 template: function (data) {
                    return dateTimeSSCNSL100(data.cntcCpltHourptsec)
                }
			},
			{ width: 50, field: "phrecKey", title: CNSL120T_langMap.get("CNSL120T.grid.column.phrecKey"), template: '<button class="k-icon k-i-volume-up btListen" title="'+CNSL120T_langMap.get("CNSL120T.grid.column.phrecKey")+'" onclick="recPlay(\'#: phrecKey #\');"></button>' }, 
		]
	} else {
		grdCNSL120T_columns = [ 
			{ width: 60, field: "unfyCntcHistNo", title: CNSL120T_langMap.get("CNSL120T.grid.column.unfyCntcHistNo") },
			{ width: 100, field: "cntcCustId", title: CNSL120T_langMap.get("CNSL120T.grid.column.cntcCustId"), },
			{ width: 100, field: "cntcCustNm", title: CNSL120T_langMap.get("CNSL120T.grid.column.cntcCustNm"), },
			{ width: "auto", field: "cnslTypNm", title: CNSL120T_langMap.get("CNSL120T.grid.column.cnslTypNm"), attributes: {"class": "k-text-left"}}, 
			{ width: 150, field: "cntcCpltHourptsec", title: CNSL120T_langMap.get("CNSL120T.grid.column.lstCorcDtm"), 
				template: function (data) {
                    return dateTimeSSCNSL100(data.cntcCpltHourptsec)
                }
			},
			{ width: 50, field: "phrecKey", title: CNSL120T_langMap.get("CNSL120T.grid.column.phrecKey"), template: '<button class="k-icon k-i-volume-up btListen" title="'+CNSL120T_langMap.get("CNSL120T.grid.column.phrecKey")+'" onclick="recPlay(\'#: phrecKey #\');"></button>' }, 
		]
	}
	
	$("#grdCNSL120T").kendoGrid({
		DataSource : CNSL120TDataSource,
		noRecords: {
			template: `<div class="nodataMsg"><p>${CNSL120T_langMap.get("CNSL120T.grid.nodatafound")}</p></div>`
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
		columns: grdCNSL120T_columns,
		change: function(e) {
			let selectedRows = this.select();
			CNSL120T_selItem = this.dataItem(selectedRows[0]);
			if (grdCNSL120Target == CNSL120T_selItem.unfyCntcHistNo + "_" + CNSL120T_selItem.telCnslHistSeq) {
				if ( nowCallId != '' ) {
					Utils.alert('상담이력을 저장해주세요.');
					return false;
				}
				cntcHistNo = CNSL120T_selItem.unfyCntcHistNo;
				cnslHistSeq = CNSL120T_selItem.telCnslHistSeq;
				CNSL100MTabClick("/bcs/cnsl/CNSL113T")
				if ( typeof(setCNSL113SEL01) != 'undefined' ) {
					if ( nowCallId == '' ) {
						cnslState = 'init';
					}
					CNSL113BtnMode(cnslState);
					setCNSL113SEL01();
				}
			} 
			grdCNSL120Target = CNSL120T_selItem.unfyCntcHistNo + "_" + CNSL120T_selItem.telCnslHistSeq;
		}
	});
	grdCNSL120T = $("#grdCNSL120T").data("kendoGrid");

/*	$("#grdCNSL120T").kendoTooltip({
		filter: "td:nth-child(4)",
		position: "bottom",
		width: 200,
		showOn: "mouseenter",
		content: function(e){
			var dataItem = grdCNSL120T.dataItem(e.target.closest("tr"));
			console.log(dataItem);
			return dataItem.csnlCtt;
		}
	}).data("kendoTooltip");*/

	CNSL120T_ToolTip = $("#grdCNSL120T").kendoTooltip({
		filter: "td:nth-child(4)",
		showOn: "mouseenter",
		position: "bottom",
		content: function(e){
			let dataItem = grdCNSL120T.dataItem(e.target.closest("tr"));
			return dataItem.cnslCtt;
		}
	}).data("kendoTooltip");

	heightResizeCNSL();
	CNSL120TDataSourceSet();
	CNSL_Utils.setfunctionCustIdList(CNSL120TDataSourceSet);
});

function resultComboList120(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	
	Utils.setKendoComboBox(jsonDecode, "S0001", '.CNSL120 .S0001', '', false) ;
}

function getRangeDayCNSL120(rangeDay) {
	
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
	
    $(".CNSL120 #startDate").val(startDate);
    $(".CNSL120 #endDate").val(endDate);
}


function startChangeCNSL120() {
	var startDate = startCNSL120.value();
	var endDate = endCNSL120.value();

	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		endCNSL120.min(startDate);
	} else if (endDate) {
		startCNSL120.max(new Date(endDate));
	} else {
		endDate = new Date();
		startCNSL120.max(endDate);
		endCNSL120.min(endDate);
	}
}

function endChangeCNSL120() {
	var endDate = endCNSL120.value();
	var startDate = startCNSL120.value();

	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		startCNSL120.max(endDate);
	} else if (startDate) {
		endCNSL120.min(new Date(startDate));
	} else {
		endDate = new Date();
		startCNSL120.max(endDate);
		endCNSL120.min(endDate);
	}
}

function CNSL120T_resultIndex(data){
	
	var CNSL120T_jsonEncode = JSON.stringify(data.CNSL120SEL01);
	var CNSL120T_jsonDecode = JSON.parse(JSON.parse(CNSL120T_jsonEncode));
	
	grdCNSL120T.dataSource.data(CNSL120T_jsonDecode);
}	

function CNSL120TDataSourceSet() {
	var CNSL120T_data = {
		"tenantId" 		: GLOBAL.session.user.tenantId,
		"usrId" 		: GLOBAL.session.user.usrId,
		"cntcCustId" 	: custId,
		"srchType" 		: $(".CNSL120 #srchType").val(),
		"srchTxt" 		: $(".CNSL120 #srchTxt").val(),
		"startDate" 	: $(".CNSL120 #startDate").val().replace(/\-/g, ''),
		"endDate" 		: $(".CNSL120 #endDate").val().replace(/\-/g, ''),
		"encryptYn"  	: "Y"
//		"encryptYn"  	: Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1
    };
	var cntcCustIdExist = Utils.isNull(custId);
	var srchTxt			= Utils.isNull($(".CNSL120 #srchTxt").val());
	
	if(cntcCustIdExist != true || srchTxt != true){
		var CNSL120T_jsonStr = JSON.stringify(CNSL120T_data);
		console.log(":::::::: CNSL120T_jsonStr");
		console.log(":::::::: CNSL120T_jsonStr");
		console.log(":::::::: CNSL120T_jsonStr");
		console.log(CNSL120T_jsonStr);
		CNSL120TDataSource.transport.read(CNSL120T_jsonStr);
	}
}

