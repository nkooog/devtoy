var listViewCNSL105T_1;
var startCNSL105, endCNSL105;

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
        success     : resultComboList105,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });

	startCNSL105 = $(".CNSL105 #startDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: startChangeCNSL105,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	endCNSL105 = $(".CNSL105 #endDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: endChangeCNSL105,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");

	startCNSL105.max(endCNSL105.value());
	endCNSL105.min(startCNSL105.value()); 
	startCNSL105.enable(false);
	endCNSL105.enable(false);
	getRangeDayCNSL105(3);
	
	$(".CNSL105 .btnRefer_default").on("click", function() {
    	$(this).parent().find("button").removeClass('selected');
    	$(this).addClass('selected');
    	if ( $(this).attr("range") != undefined ) {
    		var rangeDay = Number($(this).attr("range"));
        	getRangeDayCNSL105(rangeDay);
        	startCNSL105.enable(false);
    		endCNSL105.enable(false);
    	} else {
    		startCNSL105.enable(true);
        	endCNSL105.enable(true);
    	}
	});
	
	$(".CNSL105 .btn_srh").on("click", function(event) {
		setCNSL105SEL01();
	});
	setCNSL105SEL01();
});

function resultComboList105(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	
	Utils.setKendoComboBox(jsonDecode, "S0006", '.CNSL105 .S0006', '', false) ;
}

function getRangeDayCNSL105(rangeDay) {
	
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
	
    $(".CNSL105 #startDate").val(startDate);
    $(".CNSL105 #endDate").val(endDate);
}


function startChangeCNSL105() {
	var startDate = startCNSL105.value();
	var endDate = endCNSL105.value();

	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		endCNSL105.min(startDate);
	} else if (endDate) {
		startCNSL105.max(new Date(endDate));
	} else {
		endDate = new Date();
		startCNSL105.max(endDate);
		endCNSL105.min(endDate);
	}
}

function endChangeCNSL105() {
	var endDate = endCNSL105.value();
	var startDate = startCNSL105.value();

	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		startCNSL105.max(endDate);
	} else if (startDate) {
		endCNSL105.min(new Date(startDate));
	} else {
		endDate = new Date();
		startCNSL105.max(endDate);
		endCNSL105.min(endDate);
	}
}

function setCNSL105SEL01() {
	var CNSL105_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"usrId" : GLOBAL.session.user.usrId,
		"srchType" : $(".CNSL105 #srchType").val(),
		"srchTxt" : $(".CNSL105 #srchTxt").val(),
		"startDate" : $(".CNSL105 #startDate").val().replace(/\-/g, ''),
		"endDate" : $(".CNSL105 #endDate").val().replace(/\-/g, '')
	};
	
	var CNSL105_jsonStr = JSON.stringify(CNSL105_data);
	Utils.ajaxCall("/cnsl/CNSL105SEL01", CNSL105_jsonStr, CNSL105SEL01);
}

function CNSL105SEL01(data) {
	$("#listViewCNSL105T_1").html('');
	
	var aJsonArray = new Array();
	CNSL105SEL01Index = JSON.parse(data.CNSL105SEL01);
	var CNSL105SEL01IndexLen = CNSL105SEL01Index.length;
	
	for ( var i = 0; i < CNSL105SEL01IndexLen; i++ ) {
		
		var aJson = new Object();
		aJson.custNo = CNSL105SEL01Index[i].custNo;
		aJson.custNm = CNSL105SEL01Index[i].custNm;
		aJson.mbleNo = CNSL105SEL01Index[i].mbleNo;
		aJson.owhmBaseAddr = CNSL105SEL01Index[i].owhmBaseAddr;
		aJson.regDtm = CNSL105SEL01Index[i].regDtm;
		aJson.lstCorcDtm = CNSL105SEL01Index[i].lstCorcDtm;
		aJson.lstProcStNm = CNSL105SEL01Index[i].lstProcStNm;
		
		aJsonArray.push(aJson);
	}
	
	listViewCNSL105T_1 = $("#listViewCNSL105T_1").kendoListView({
		// data 있을때
		dataSource : {
			data : aJsonArray,
			pageSize : 10,
		},
		dataBound : function() {
			// data 없을때
			if (this.dataSource.total() == 0) {
				this.element.find('.k-listview-content').html('<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>');
			}
		},
		selectable : true,
		scrollable : "endless",
		template : kendo.template($("#templateCNSL105T_1").html()),
	}).data("kendoListView");
	
}