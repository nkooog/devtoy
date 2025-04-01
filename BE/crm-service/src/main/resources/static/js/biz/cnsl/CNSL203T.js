var listViewCNSL203T_1;
var startCNSL203, endCNSL203;
var CNSL203T_cancelBtnClick = '';
var CNSL203T_obj = {};

$(document).ready(function() {
	
	$("#listViewCNSL203T_1").css("border-width", "0px");
	
	CNSL203T_obj.fontOption = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 45);
	CNSL203T_obj.fontValue = "1";
	if(!Utils.isNull(CNSL203T_obj.fontOption)){
	    if(CNSL203T_obj.fontOption.useYn == "Y" && !Utils.isNull(CNSL203T_obj.fontOption.bsVl1)){
	    	CNSL203T_obj.fontValue = CNSL203T_obj.fontOption.bsVl1;
	    }
	} else {
	    console.log("faile");
	}
	
	//공통콤보 불러오기
	var data = { "codeList": [
		{"mgntItemCd":"S0003"}
	]};
    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList103,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });

	startCNSL203 = $(".CNSL203 #startDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: startChangeCNSL203,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	endCNSL203 = $(".CNSL203 #endDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: endChangeCNSL203,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");

	startCNSL203.max(endCNSL203.value());
	endCNSL203.min(startCNSL203.value()); 
	if ( typeof(cnslEnable) == 'undefined' ) {
		startCNSL203.enable(true);
		endCNSL203.enable(true);
	} 
	else {
		startCNSL203.enable(cnslEnable);
		endCNSL203.enable(cnslEnable);
	}
	if ( typeof(cnslRangeDay) == 'undefined' ) {
		getRangeDayCNSL203(30);
	}else {
		getRangeDayCNSL203(cnslRangeDay);
	}
	$(".CNSL203 .btnRefer_default").on("click", function() {
    	$(this).parent().find("button").removeClass('selected');
    	$(this).addClass('selected');
    	if ( $(this).attr("range") != undefined ) {
    		var rangeDay = Number($(this).attr("range"));
        	getRangeDayCNSL203(rangeDay);
        	startCNSL203.enable(false);
    		endCNSL203.enable(false);
    	} else {
    		startCNSL203.enable(true);
        	endCNSL203.enable(true);
    	}
	});
	
	$(".CNSL203 .btn_srh").on("click", function(event) {
		setCNSL203SEL01();
	});
	setCNSL203SEL01();
	heightResizeCNSL();
});

function resultComboList103(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	
	Utils.setKendoComboBox(jsonDecode, "S0003", '.CNSL203 .S0003', '', false) ;
}

function getRangeDayCNSL203(rangeDay) {
	
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
	
    $(".CNSL203 #startDate").val(startDate);
    $(".CNSL203 #endDate").val(endDate);
}


function startChangeCNSL203() {
	var startDate = startCNSL203.value();
	var endDate = endCNSL203.value();

	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		endCNSL203.min(startDate);
	} else if (endDate) {
		startCNSL203.max(new Date(endDate));
	} else {
		endDate = new Date();
		startCNSL203.max(endDate);
		endCNSL203.min(endDate);
	}
}

function endChangeCNSL203() {
	var endDate = endCNSL203.value();
	var startDate = startCNSL203.value();

	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		startCNSL203.max(endDate);
	} else if (startDate) {
		endCNSL203.min(new Date(startDate));
	} else {
		endDate = new Date();
		startCNSL203.max(endDate);
		endCNSL203.min(endDate);
	}
}

function setCNSL203SEL01(key) {
	var CNSL203_data = {};
	if (key == undefined || key == null) {
		CNSL203_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"srchType" : $(".CNSL203 #srchType").val(),
			"srchTxt" : $(".CNSL203 #srchTxt").val(),
			"startDate" : $(".CNSL203 #startDate").val().replace(/\-/g, ''),
			"endDate" : $(".CNSL203 #endDate").val().replace(/\-/g, '')
		};
	} else {
		CNSL203_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"unfyCntcHistNo" : key
		};
	}
	var CNSL203_jsonStr = JSON.stringify(CNSL203_data);
	Utils.ajaxCall("/cnsl/CNSL203SEL01", CNSL203_jsonStr, CNSL203SEL01);
}

var CNSL203_aJsonArray = new Array();

function CNSL203SEL01(data) {
	if (listViewCNSL203T_1 != undefined) {
		listViewCNSL203T_1.unbind('change')
	} 
	$("#listViewCNSL203T_1").empty();
	
	CNSL203_aJsonArray = new Array();
	CNSL203SEL01Index = JSON.parse(data.CNSL203SEL01);
	var CNSL203SEL01IndexLen = CNSL203SEL01Index.length;
	
	for ( var i = 0; i < CNSL203SEL01IndexLen; i++ ) {
		
		var rsvDd = CNSL203SEL01Index[i].rsvDd;
		if ( rsvDd != null && rsvDd.length == 8 ) {
			rsvDd = rsvDd.slice(0,4) + '-' + rsvDd.slice(4,6) + '-' + rsvDd.slice(6,8);
		}
		
		var aJson = new Object();
		aJson.ID = CNSL203SEL01Index[i].unfyCntcHistNo+'-'+CNSL203SEL01Index[i].telCnslHistSeq;
		aJson.cntcCustNm = CNSL203SEL01Index[i].cntcCustNm;
		aJson.cntcTelNo = CNSL203SEL01Index[i].cntcTelNo;
		aJson.regrNm = CNSL203SEL01Index[i].regrId+'('+CNSL203SEL01Index[i].regrNm+')';
		aJson.rsvDd = rsvDd+' '+CNSL203SEL01Index[i].rsvHour+':'+CNSL203SEL01Index[i].rsvPt;
		aJson.lstCorcDdHour = CNSL203SEL01Index[i].lstCorcDdHour;
		aJson.state = CNSL203SEL01Index[i].procStCd;
		aJson.procStNm = CNSL203SEL01Index[i].procStNm;
		aJson.cntcCustId = CNSL203SEL01Index[i].cntcCustId;
		aJson.rsvMemo = CNSL203SEL01Index[i].rsvMemo;
		
		
		
		CNSL203_aJsonArray.push(aJson);
	}
	
	listViewCNSL203T_1 = $("#listViewCNSL203T_1").kendoListView({
		// data 있을때
		dataSource : {
			data : CNSL203_aJsonArray,
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
		change: CNSL203T_loadCounselParam,
		template : kendo.template($("#templateCNSL203T_" + CNSL203T_obj.fontValue).html()),
	}).data("kendoListView");
	
}


function CNSL203T_loadCounselParam() {
	if ( counselMode != 'add' && nowCallId != '' && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 33).bsVl1 == 'Y' ) {
		Utils.alert('상담이력을 저장해주세요.');
		return false;
	}
	var data = CNSL203_aJsonArray,
    CNSL203T_selected = $.map(this.select(), function(item) {
      return data[$(item).index()];
    });
	
	if ( CNSL203T_selected.length == 0 ) {
		return false;
	}
	
	CNSL200MTabClick("/bcs/cnsl/CNSL212T")
	
	//kw---20240404 : 양지검진 - 상담이력 또는 콜 이벤트 관련 정보 인터페이스 넘기기
	rsvMemo = CNSL203T_selected[0].rsvMemo;
	
	custId = CNSL203T_selected[0].cntcCustId;
	cntcHistNo = CNSL203T_selected[0].ID.split("-")[0];
	cabackAcpnNo = CNSL203T_selected[0].ID.split("-")[0];
	cnslHistSeq = CNSL203T_selected[0].ID.split("-")[1];
	outCntcPathCd = '30';
	
	CNSL200MTabClick(url112)
	if ( custId != null && custId != '' ) {
		if ( window['setting' + id112 + 'SEL01'] ) {
			new Function ( 'setting' + id112 + 'SEL01()')()
		}
	} else {
		if ( window['custInit' + id112] ) {
			new Function ( 'custInit' + id112 + '()')()
		}
		if ( window['search' + id112 + 'SEL01'] ) {
			new Function ( 'search' + id112 + 'SEL01(\"' + CNSL203T_selected[0].cntcTelNo +'\")')()
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
	$("#txtTargetNumber").val(CNSL203T_selected[0].cntcTelNo);
}

function CNSL203T_fnBtnStateCancel(data){
	
	var resultData = JSON.parse(data);
	
	CNSL203T_cancelBtnClick = 'Y';
	CNSL203T_fnStateCancel(resultData);
}

function CNSL203T_fnStateCancel(_data){
	
	if(!Utils.isNull(_data)){
		if(CNSL203T_cancelBtnClick == 'Y' && _data.state == '1'){
			
			CNSL203T_cancelBtnClick = '';
			
			Utils.confirm(CNSL203T_langMap.get("CNSL203T.cancel.alert"), function(e){
				
				var objParam = {
						tenantId 		: GLOBAL.session.user.tenantId,
						unfyCntcHistNo	: _data.ID.split("-")[0],
						telCnslHistSeq	: _data.ID.split("-")[1],
						procStCd		: '3',
						usrId			: GLOBAL.session.user.usrId,
						orgCd			: GLOBAL.session.user.orgCd
						
				}
				
				
				Utils.ajaxCall('/cnsl/CNSL103UPT02', JSON.stringify(objParam), function(result){
					var selectIndex = listViewCNSL203T_1.select().index();
					var rsvList = listViewCNSL203T_1.dataSource.data();
					rsvList[selectIndex].state = '3';
					rsvList[selectIndex].procStNm = CNSL203T_langMap.get("CNSL203T.cancel.btnNm");
					
					listViewCNSL203T_1.dataSource.data(rsvList);
				});
			});
		} else {
			CNSL203T_cancelBtnClick = '';
		}
		
	}
}
	