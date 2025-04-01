var listViewCNSL204T_1;
var startCNSL204, endCNSL204;
var CNSL204T_obj = {};

$(document).ready(function() {
	
	$("#listViewCNSL204T_1").css("border-width", "0px");
	
	CNSL204T_obj.fontOption = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 45);
	CNSL204T_obj.fontValue = "1";
	if(!Utils.isNull(CNSL204T_obj.fontOption)){
	    if(CNSL204T_obj.fontOption.useYn == "Y" && !Utils.isNull(CNSL204T_obj.fontOption.bsVl1)){
	    	CNSL204T_obj.fontValue = CNSL204T_obj.fontOption.bsVl1;
	    }
	} else {
	    console.log("faile");
	}
	
	//공통콤보 불러오기
	var data = { "codeList": [
		{"mgntItemCd":"S0004"}
	]};
    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList104,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });

	startCNSL204 = $(".CNSL204 #startDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: startChangeCNSL204,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	endCNSL204 = $(".CNSL204 #endDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: endChangeCNSL204,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");

	startCNSL204.max(endCNSL204.value());
	endCNSL204.min(startCNSL204.value()); 
	if ( typeof(cnslEnable) == 'undefined' ) {
		startCNSL204.enable(true);
		endCNSL204.enable(true);
	} 
	else {
		startCNSL204.enable(cnslEnable);
		endCNSL204.enable(cnslEnable);
	}
	if ( typeof(cnslRangeDay) == 'undefined' ) {
		getRangeDayCNSL204(30);
	}else {
		getRangeDayCNSL204(cnslRangeDay);
	}
	$(".CNSL204 .btnRefer_default").on("click", function() {
    	$(this).parent().find("button").removeClass('selected');
    	$(this).addClass('selected');
    	if ( $(this).attr("range") != undefined ) {
    		var rangeDay = Number($(this).attr("range"));
        	getRangeDayCNSL204(rangeDay);
        	startCNSL204.enable(false);
    		endCNSL204.enable(false);
    	} else {
    		startCNSL204.enable(true);
        	endCNSL204.enable(true);
    	}
	});
	
	$(".CNSL204 .btn_srh").on("click", function(event) {
		setCNSL204SEL01();
	});
	setCNSL204SEL01();
	heightResizeCNSL();
});

function resultComboList104(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	
	Utils.setKendoComboBox(jsonDecode, "S0004", '.CNSL204 .S0004', '', false) ;
}

function getRangeDayCNSL204(rangeDay) {
	
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
	
    $(".CNSL204 #startDate").val(startDate);
    $(".CNSL204 #endDate").val(endDate);
}


function startChangeCNSL204() {
	var startDate = startCNSL204.value();
	var endDate = endCNSL204.value();

	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		endCNSL204.min(startDate);
	} else if (endDate) {
		startCNSL204.max(new Date(endDate));
	} else {
		endDate = new Date();
		startCNSL204.max(endDate);
		endCNSL204.min(endDate);
	}
}

function endChangeCNSL204() {
	var endDate = endCNSL204.value();
	var startDate = startCNSL204.value();

	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		startCNSL204.max(endDate);
	} else if (startDate) {
		endCNSL204.min(new Date(startDate));
	} else {
		endDate = new Date();
		startCNSL204.max(endDate);
		endCNSL204.min(endDate);
	}
}

function setCNSL204SEL01(key) {
	var CNSL204_data = {};
	if (key == undefined || key == null) {
		CNSL204_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"srchType" : $(".CNSL204 #srchType").val(),
			"srchTxt" : $(".CNSL204 #srchTxt").val(),
			"startDate" : $(".CNSL204 #startDate").val().replace(/\-/g, ''),
			"endDate" : $(".CNSL204 #endDate").val().replace(/\-/g, '')
		};
	} else {
		CNSL204_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"trclSeq" : key
		};
	}
	var CNSL204_jsonStr = JSON.stringify(CNSL204_data);
	Utils.ajaxCall("/cnsl/CNSL204SEL01", CNSL204_jsonStr, CNSL204SEL01);
}

var CNSL204_aJsonArray = new Array();

function CNSL204SEL01(data) {
	if (listViewCNSL204T_1 != undefined) {
		listViewCNSL204T_1.unbind('change')
	} 
	$("#listViewCNSL204T_1").empty();
	
	CNSL204_aJsonArray = new Array();
	CNSL204SEL01Index = JSON.parse(data.CNSL204SEL01);
	var CNSL204SEL01IndexLen = CNSL204SEL01Index.length;
	
	for ( var i = 0; i < CNSL204SEL01IndexLen; i++ ) {
		var aJson = new Object();
		aJson.unfyCntcHistNo = CNSL204SEL01Index[i].unfyCntcHistNo+'-'+CNSL204SEL01Index[i].cnslHistSeq;
		aJson.cntcChnlCd = CNSL204SEL01Index[i].cntcChnlCd;
		aJson.trclSeq = CNSL204SEL01Index[i].trclSeq;
		aJson.trclDt = CNSL204SEL01Index[i].trclDt;
		aJson.trclmnNm = CNSL204SEL01Index[i].trclmnId+'('+CNSL204SEL01Index[i].trclmnNm + ')';
		aJson.procDt = CNSL204SEL01Index[i].procDt;
		aJson.dspsrNm = CNSL204SEL01Index[i].dspsrId+'('+CNSL204SEL01Index[i].dspsrNm + ')';
		aJson.procStNm = CNSL204SEL01Index[i].procStNm;
		aJson.cntcCustId = CNSL204SEL01Index[i].cntcCustId;
		aJson.cntcCustNm = CNSL204SEL01Index[i].cntcCustNm;
		aJson.cntcTelNo = CNSL204SEL01Index[i].cntcTelNo;
		CNSL204_aJsonArray.push(aJson);
	}
	
	console.log("::: CNSL204_aJsonArray");
	console.log(CNSL204_aJsonArray);
	
	listViewCNSL204T_1 = $("#listViewCNSL204T_1").kendoListView({
		// data 있을때
		dataSource : {
			data : CNSL204_aJsonArray,
			pageSize : 20,
		},
		dataBound : function() {
			// data 없을때
			if (this.dataSource.total() == 0) {
				this.element.find('.k-listview-content').html('<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>');
			}
			
			this.element.find('.k-listview-content').css("height", "100%");
			this.element.find('.k-listview-item').css("margin-right", "5px");
		},
		selectable : true,
		scrollable : "endless",
		change: CNSL204T_loadCounselParam,
		template : kendo.template($("#templateCNSL204T_" + CNSL204T_obj.fontValue).html()),
	}).data("kendoListView");
	
}

 
function CNSL204T_loadCounselParam() {
	if ( counselMode != 'add' && nowCallId != '' && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 33).bsVl1 == 'Y' ) {
		Utils.alert('상담이력을 저장해주세요.');
		return false;
	}
	var data = CNSL204_aJsonArray,
    CNSL204T_selected = $.map(this.select(), function(item) {
      return data[$(item).index()];
    });
	CNSL200MTabClick("/bcs/cnsl/CNSL212T");
	
	console.log("::::: kw");
	console.log("::::: kw");
	console.log("::::: kw");
	console.log("::::: kw");
	
	console.log(CNSL204T_selected[0]);
	
	custId = CNSL204T_selected[0].cntcCustId;
	cntcHistNo = CNSL204T_selected[0].unfyCntcHistNo.split("-")[0];
	cnslHistSeq = CNSL204T_selected[0].unfyCntcHistNo.split("-")[1];
	cabackAcpnNo = CNSL204T_selected[0].unfyCntcHistNo.split("-")[0];
	outCntcPathCd = '31';
	
	CNSL200MTabClick(url112)
	if ( custId != null && custId != '' ) {
		if ( window['setting' + id112 + 'SEL01'] ) {
			console.log(":::::::::::::::::::: CNSL204T");
			new Function ( 'setting' + id112 + 'SEL01()')()
		}
	} else {
		if ( window['custInit' + id112] ) {
			new Function ( 'custInit' + id112 + '()')()
		}
	}
	
	if ( typeof(CNSL213T_btnDiv) != 'undefined' ) {
		CNSL213T_btnDiv(true);
	}
	if ( typeof(setCNSL213SEL01) != 'undefined' ) {
		cnslState = 'init';
		CNSL213BtnMode(cnslState);
		setCNSL213SEL01();
	}
	$("#txtTargetNumber").val(CNSL204T_selected[0].cntcTelNo);
}