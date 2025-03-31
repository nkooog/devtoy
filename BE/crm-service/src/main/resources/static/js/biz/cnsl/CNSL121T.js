var CNSL121TDataSource,grdCNSL121T
var startCNSL121, endCNSL121;

$(document).ready(function() {
	
	//공통콤보 불러오기
	var data = { "codeList": [
		{"mgntItemCd":"S0006"}
	]};
    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList121,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
    
    startCNSL121 = $(".CNSL121 #startDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: startChangeCNSL121,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	endCNSL121 = $(".CNSL121 #endDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: endChangeCNSL121,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");

	startCNSL121.max(endCNSL121.value());
	endCNSL121.min(startCNSL121.value()); 
	getRangeDayCNSL121(3);
    
	
	$(".CNSL121 .btn_srh").on("click", function(event) {
		CNSL121TDataSourceSet();
	});
	
	CNSL121TDataSource ={
			transport: {
				read	: function (CNSL121T_jsonStr) {
					Utils.ajaxCall('/cnsl/CNSL121SEL01', CNSL121T_jsonStr, CNSL121T_resultIndex, 
					window.kendo.ui.progress($("#grdCNSL121T"), true), window.kendo.ui.progress($("#grdCNSL121T"), false))
				},
			},
	}
	
	$("#grdCNSL121T").kendoGrid({
		DataSource : CNSL121TDataSource,
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
				//, empty: CNSL121T_langMap.get("CNSL121T.grid.message")
				, itemsPerPage: ""
			    }
		},
		columns: [ 
			{ width: 100, field: "cmpNo", title: "캠페인번호", template: '<a class="link" onclick="alert(\'#: cmpNo #\');">#: cmpNo #</a>' },
			{ width: 150, field: "custId", title: "고객ID", },
			{ width: 120, field: "custNm", title: "고객명", },
			{ width: "auto", field: "mbleNo", title: "고객핸드폰", }, 
			{ width: "auto", field: "lstProcStNm", title: "처리상태", },
			{ width: "auto", field: "failRsn", title: "실패사유", attributes: {"class": "textEllipsis"}, },
			{ width: 50, field: "cmpNo", title: "청취", template: '<button class="k-icon k-i-volume-up btListen" title="청취" onclick="alert(#: cmpNo #);"></button>' }, 
		],
		change: function(e) {
			let selectedRows = this.select();
			CNSL121T_selItem = this.dataItem(selectedRows[0]);
		}
	});
	
	grdCNSL121T = $("#grdCNSL121T").data("kendoGrid");
	
	
	//그리드 높이 조절
	var CNSL121T_screenHeight = $(window).height();
	grdCNSL121T.element.find('.k-grid-content').css('height', CNSL121T_screenHeight-850);  
	
});

function resultComboList121(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	
	Utils.setKendoComboBox(jsonDecode, "S0006", '.CNSL121 .S0006', '', false) ;
}

function getRangeDayCNSL121(rangeDay) {
	
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
	
    $(".CNSL121 #startDate").val(startDate);
    $(".CNSL121 #endDate").val(endDate);
}


function startChangeCNSL121() {
	var startDate = startCNSL121.value();
	var endDate = endCNSL121.value();

	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		endCNSL121.min(startDate);
	} else if (endDate) {
		startCNSL121.max(new Date(endDate));
	} else {
		endDate = new Date();
		startCNSL121.max(endDate);
		endCNSL121.min(endDate);
	}
}

function endChangeCNSL121() {
	var endDate = endCNSL121.value();
	var startDate = startCNSL121.value();

	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		startCNSL121.max(endDate);
	} else if (startDate) {
		endCNSL121.min(new Date(startDate));
	} else {
		endDate = new Date();
		startCNSL121.max(endDate);
		endCNSL121.min(endDate);
	}
}

function CNSL121T_resultIndex(data){
	
	var CNSL121T_jsonEncode = JSON.stringify(data.CNSL121SEL01);
	var CNSL121T_jsonDecode = JSON.parse(JSON.parse(CNSL121T_jsonEncode));
	
	grdCNSL121T.dataSource.data(CNSL121T_jsonDecode);
}	

function CNSL121TDataSourceSet() {
	var CNSL121T_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"usrId" : GLOBAL.session.user.usrId,
		"custId" : custId,
		"srchType" : $(".CNSL121 #srchType").val(),
		"srchTxt" : $(".CNSL121 #srchTxt").val(),
		"startDate" : $(".CNSL121 #startDate").val().replace(/\-/g, ''),
		"endDate" : $(".CNSL121 #endDate").val().replace(/\-/g, '')
    };	
	var CNSL121T_jsonStr = JSON.stringify(CNSL121T_data);
	CNSL121TDataSource.transport.read(CNSL121T_jsonStr);
}

