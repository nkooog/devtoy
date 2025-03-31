var listViewCNSL104T_1;
var startCNSL104, endCNSL104;
var CNSL104T_obj = {};

$(document).ready(function() {

	$("#listViewCNSL104T_1").css("border-width", "0px");
	
	CNSL104T_obj.fontOption = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 45);
	CNSL104T_obj.fontValue = "1";
	if(!Utils.isNull(CNSL104T_obj.fontOption)){
	    if(CNSL104T_obj.fontOption.useYn == "Y" && !Utils.isNull(CNSL104T_obj.fontOption.bsVl1)){
	    	CNSL104T_obj.fontValue = CNSL104T_obj.fontOption.bsVl1;
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

	startCNSL104 = $(".CNSL104 #startDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: startChangeCNSL104,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	endCNSL104 = $(".CNSL104 #endDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: endChangeCNSL104,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");

	startCNSL104.max(endCNSL104.value());
	endCNSL104.min(startCNSL104.value()); 
	if ( typeof(cnslEnable) == 'undefined' ) {
		startCNSL104.enable(true);
		endCNSL104.enable(true);
	} 
	else {
		startCNSL104.enable(cnslEnable);
		endCNSL104.enable(cnslEnable);
	}
	if ( typeof(cnslRangeDay) == 'undefined' ) {
		getRangeDayCNSL104(30);
	}else {
		getRangeDayCNSL104(cnslRangeDay);
	}
	$(".CNSL104 .btnRefer_default").on("click", function() {
    	$(this).parent().find("button").removeClass('selected');
    	$(this).addClass('selected');
    	if ( $(this).attr("range") != undefined ) {
    		var rangeDay = Number($(this).attr("range"));
        	getRangeDayCNSL104(rangeDay);
        	startCNSL104.enable(false);
    		endCNSL104.enable(false);
    	} else {
    		startCNSL104.enable(true);
        	endCNSL104.enable(true);
    	}
	});
	
	$(".CNSL104 .btn_srh").on("click", function(event) {
		setCNSL104SEL01();
	});
	setCNSL104SEL01();
	heightResizeCNSL();
});

function resultComboList104(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	
	Utils.setKendoComboBox(jsonDecode, "S0004", '.CNSL104 .S0004', '', false) ;
}

function getRangeDayCNSL104(rangeDay) {
	
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
	
    $(".CNSL104 #startDate").val(startDate);
    $(".CNSL104 #endDate").val(endDate);
}


function startChangeCNSL104() {
	var startDate = startCNSL104.value();
	var endDate = endCNSL104.value();

	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		endCNSL104.min(startDate);
	} else if (endDate) {
		startCNSL104.max(new Date(endDate));
	} else {
		endDate = new Date();
		startCNSL104.max(endDate);
		endCNSL104.min(endDate);
	}
}

function endChangeCNSL104() {
	var endDate = endCNSL104.value();
	var startDate = startCNSL104.value();

	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		startCNSL104.max(endDate);
	} else if (startDate) {
		endCNSL104.min(new Date(startDate));
	} else {
		endDate = new Date();
		startCNSL104.max(endDate);
		endCNSL104.min(endDate);
	}
}

function setCNSL104SEL01(key) {
	var CNSL104_data = {};
	if (key == undefined || key == null) {
		CNSL104_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"srchType" : $(".CNSL104 #srchType").val(),
			"srchTxt" : $(".CNSL104 #srchTxt").val(),
			"startDate" : $(".CNSL104 #startDate").val().replace(/\-/g, ''),
			"endDate" : $(".CNSL104 #endDate").val().replace(/\-/g, '')
		};
	} else {
		CNSL104_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"trclSeq" : key
		};
	}
	var CNSL104_jsonStr = JSON.stringify(CNSL104_data);
	Utils.ajaxCall("/cnsl/CNSL104SEL01", CNSL104_jsonStr, CNSL104SEL01);
}

var CNSL104_aJsonArray = new Array();

function CNSL104SEL01(data) {
	if (listViewCNSL104T_1 != undefined) {
		listViewCNSL104T_1.unbind('change')
	} 
	$("#listViewCNSL104T_1").empty();
	
	CNSL104_aJsonArray = new Array();
	CNSL104SEL01Index = JSON.parse(data.CNSL104SEL01);
	var CNSL104SEL01IndexLen = CNSL104SEL01Index.length;
	
	for ( var i = 0; i < CNSL104SEL01IndexLen; i++ ) {
		var aJson = new Object();
		aJson.unfyCntcHistNo = CNSL104SEL01Index[i].unfyCntcHistNo+'-'+CNSL104SEL01Index[i].cnslHistSeq;
		aJson.cntcChnlCd = CNSL104SEL01Index[i].cntcChnlCd;
		aJson.trclSeq = CNSL104SEL01Index[i].trclSeq;
		aJson.trclDt = CNSL104SEL01Index[i].trclDt;
		aJson.trclmnNm = CNSL104SEL01Index[i].trclmnId+'('+CNSL104SEL01Index[i].trclmnNm + ')';
		aJson.procDt = CNSL104SEL01Index[i].procDt;
		aJson.dspsrNm = CNSL104SEL01Index[i].dspsrId+'('+CNSL104SEL01Index[i].dspsrNm + ')';
		aJson.procStNm = CNSL104SEL01Index[i].procStNm;
		aJson.cntcCustId = CNSL104SEL01Index[i].cntcCustId;
		aJson.cntcCustNm = CNSL104SEL01Index[i].cntcCustNm;
		CNSL104_aJsonArray.push(aJson);
	}
	
	listViewCNSL104T_1 = $("#listViewCNSL104T_1").kendoListView({
		// data 있을때
		dataSource : {
			data : CNSL104_aJsonArray,
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
		change: CNSL104T_loadCounselParam,
		template : kendo.template($("#templateCNSL104T_" + CNSL104T_obj.fontValue).html()),
	}).data("kendoListView");
	
}

 
function CNSL104T_loadCounselParam() {
	if ( counselMode != 'add' && nowCallId != '' && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 33).bsVl1 == 'Y' ) {
		Utils.alert('상담이력을 저장해주세요.');
		return false;
	}
	var data = CNSL104_aJsonArray,
    CNSL104T_selected = $.map(this.select(), function(item) {
      return data[$(item).index()];
    });
	CNSL100MTabClick("/bcs/cnsl/CNSL112T")
	custId = CNSL104T_selected[0].cntcCustId;
	cntcHistNo = CNSL104T_selected[0].unfyCntcHistNo.split("-")[0];
	cabackAcpnNo = CNSL104T_selected[0].unfyCntcHistNo.split("-")[0];
	cnslHistSeq = CNSL104T_selected[0].unfyCntcHistNo.split("-")[1];
	outCntcPathCd = '31';
	
	if ( custId != null ) {
		if ( typeof(settingCNSL112SEL01) != 'undefined' ) {
			settingCNSL112SEL01();
		}
	} else {
		if ( typeof(settingCNSL112SEL01) != 'undefined' ) {
			custInitCNSL112();
		}
	}
	if ( typeof(CNSL113T_btnDiv) != 'undefined' ) {
		CNSL113T_btnDiv(true);
	}
	if ( typeof(setCNSL113SEL01) != 'undefined' ) {
		cnslState = 'init';
		CNSL113BtnMode(cnslState);
		setCNSL113SEL01();
	}
	
}