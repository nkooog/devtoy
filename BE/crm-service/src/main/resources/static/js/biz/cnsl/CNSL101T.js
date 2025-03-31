var listViewCNSL101T_1;
var startCNSL101, endCNSL101;

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
        success     : resultComboList101,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });

	startCNSL101 = $(".CNSL101 #startDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: startChangeCNSL101,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	endCNSL101 = $(".CNSL101 #endDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: endChangeCNSL101,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");

	startCNSL101.max(endCNSL101.value());
	endCNSL101.min(startCNSL101.value()); 
	if ( typeof(cnslEnable) == 'undefined' ) {
		startCNSL101.enable(true);
		endCNSL101.enable(false);
	} 
	else {
		startCNSL101.enable(cnslEnable);
		endCNSL101.enable(false);
	}
	if ( typeof(cnslRangeDay) == 'undefined' ) {
//		getRangeDayCNSL101(30);
		getRangeDayCNSL101(0);
	}else {
//		getRangeDayCNSL101(cnslRangeDay);
		getRangeDayCNSL101(0);
	}
	
	$(".CNSL101 .btnRefer_default").on("click", function() {
    	$(this).parent().find("button").removeClass('selected');
    	$(this).addClass('selected');
    	if ( $(this).attr("range") != undefined ) {
    		var rangeDay = Number($(this).attr("range"));
        	getRangeDayCNSL101(rangeDay);
        	startCNSL101.enable(false);
    		endCNSL101.enable(false);
    	} else {
    		startCNSL101.enable(true);
    		endCNSL101.enable(false);
    	}
	});
	
	$(".CNSL101 .btn_srh").on("click", function(event) {
		setCNSL101SEL01();
	});
	setCNSL101SEL01();
	heightResizeCNSL();
	
	$(".CNSL101 .btnRefer_default").on("click", function() {
		$(this).parent().find("button").removeClass('selected');
		$(this).addClass('selected');
		if ( $(this).attr("range") != undefined ) {
			var rangeDay = Number($(this).attr("range"));
			getRangeDayCNSL101(rangeDay);
			startCNSL101.enable(false);
			endCNSL101.enable(false);
		} else {
			startCNSL101.enable(true);
			endCNSL101.enable(false);
		}
	});

	$(".CNSL101 #startDate").prop("disabled", true);
	$(".CNSL101 .btnRefer_default").click(function() {
		if($(this).text() == "직접입력") $(".CNSL101 #startDate").prop("disabled", true);
	});
	
	$("#CNSL101T_btnDateAuto").click();
});


function resultComboList101(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	Utils.setKendoComboBox(jsonDecode, "S0001", '.CNSL101 .S0001', '', false) ;
}

function getRangeDayCNSL101(rangeDay) {
	
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
	
    $(".CNSL101 #startDate").val(startDate);
    $(".CNSL101 #endDate").val(endDate);
}


function startChangeCNSL101() {
	var startDate = startCNSL101.value();
	var endDate = endCNSL101.value();

	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		endCNSL101.min(startDate);
	} else if (endDate) {
		startCNSL101.max(new Date(endDate));
	} else {
		endDate = new Date();
		startCNSL101.max(endDate);
		endCNSL101.min(endDate);
	}
}

function endChangeCNSL101() {
	var endDate = endCNSL101.value();
	var startDate = startCNSL101.value();

	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		startCNSL101.max(endDate);
	} else if (startDate) {
		endCNSL101.min(new Date(startDate));
	} else {
		endDate = new Date();
		startCNSL101.max(endDate);
		endCNSL101.min(endDate);
	}
}

function loadCNSL101SEL01() {
	var toDay = new Date();	// 현재 날짜 및 시간
	var toYear = toDay.getFullYear();
    var toMonth = ("0" + (1 + toDay.getMonth())).slice(-2);
    var toDay = ("0" + toDay.getDate()).slice(-2);
    var toDate = toYear + toMonth + toDay; 
    $(".CNSL101 #srchTxt").val("")
    
	var CNSL101_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"usrId" : GLOBAL.session.user.usrId,
		"srchType" : "",
		"srchTxt" : "",
		"startDate" : toDate,
		"endDate" : toDate
	};
	var CNSL101_jsonStr = JSON.stringify(CNSL101_data);
	Utils.ajaxCall("/cnsl/CNSL101SEL01", CNSL101_jsonStr, CNSL101SEL01);
}


function setCNSL101SEL01(key) {
	var CNSL101_data = {};
	if (key == undefined || key == null) {
		CNSL101_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"srchType" : $(".CNSL101 #srchType").val(),
			"srchTxt" : $(".CNSL101 #srchTxt").val(),
			"startDate" : $(".CNSL101 #startDate").val().replace(/\-/g, ''),
			"endDate" : $(".CNSL101 #endDate").val().replace(/\-/g, '')
		};
	} else {
		CNSL101_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"unfyCntcHistNo" : key
		};
	}
	var CNSL101_jsonStr = JSON.stringify(CNSL101_data);
	Utils.ajaxCall("/cnsl/CNSL101SEL01", CNSL101_jsonStr, CNSL101SEL01);
}

var CNSL101_aJsonArray = new Array();

function CNSL101SEL01(data) {
	if (listViewCNSL101T_1 != undefined) {
		listViewCNSL101T_1.unbind('change')
	} 
	$("#listViewCNSL101T_1").empty();
	CNSL101_aJsonArray = new Array();
	CNSL101SEL01Index = JSON.parse(data.CNSL101SEL01);
	var CNSL101SEL01IndexLen = CNSL101SEL01Index.length;
	
	for ( var i = 0; i < CNSL101SEL01IndexLen; i++ ) {
		var cntcDt = CNSL101SEL01Index[i].cntcDt;
		if ( cntcDt != null && cntcDt.length == 8 ) {
			cntcDt = cntcDt.slice(0,4) + '-' + cntcDt.slice(4,6) + '-' + cntcDt.slice(6,8);
		}
		var cntcCnntDtm = CNSL101SEL01Index[i].cntcInclDtm;
		if ( cntcCnntDtm != null && cntcCnntDtm.length == 14 ) {
			cntcCnntDtm = cntcCnntDtm.slice(8,10) + ':' + cntcCnntDtm.slice(10,12);
		}else {
			cntcCnntDtm = '--:--';
		}
		var cntcEndDtm = CNSL101SEL01Index[i].cntcEndDtm;
		if ( cntcEndDtm != null && cntcEndDtm.length == 14 ) {
			cntcEndDtm = cntcEndDtm.slice(8,10) + ':' + cntcEndDtm.slice(10,12);
		}else {
			cntcEndDtm = '--:--';
		}
		var aJson = new Object();
		aJson.date = cntcDt;
		aJson.sTime = cntcCnntDtm;
		aJson.eTime = cntcEndDtm;
		aJson.cntcCustNm = CNSL101SEL01Index[i].cntcCustNm;
		aJson.cntcTelNo = CNSL101SEL01Index[i].cntcTelNo;
		aJson.inclRpsTelNo = CNSL101SEL01Index[i].inclRpsTelNo;
		aJson.cntcPathNm = CNSL101SEL01Index[i].cntcPathNm;
		aJson.inclIvrSvcNm = CNSL101SEL01Index[i].inclIvrSvcNm;
		aJson.unfyCntcHistNo = CNSL101SEL01Index[i].unfyCntcHistNo;
		aJson.telCnslHistSeq = CNSL101SEL01Index[i].telCnslHistSeq;
		aJson.cntcCustId = CNSL101SEL01Index[i].cntcCustId;
		aJson.cntcTelNo = CNSL101SEL01Index[i].cntcTelNo;
		aJson.curRsvYn = CNSL101SEL01Index[i].curRsvYn;
		aJson.trclYn = CNSL101SEL01Index[i].trclYn;
		aJson.iobDvCd = CNSL101SEL01Index[i].iobDvCd;
		aJson.cnsltypcdpath = '';
		
		var stateIdx = "";
		if ( CNSL101SEL01Index[i].cnslRsltCd == '10') {
				stateIdx = "a";
		} else if ( CNSL101SEL01Index[i].cnslRsltCd == '11') { 
				stateIdx = "b";
		} else if ( CNSL101SEL01Index[i].cnslRsltCd == '12') { 
				stateIdx = "c";
		}
		aJson.state = stateIdx;
		CNSL101_aJsonArray.push(aJson);
	}
	listViewCNSL101T_1 = $("#listViewCNSL101T_1").kendoListView({
		// data 있을때
		dataSource : {
			data : CNSL101_aJsonArray,
			pageSize : 20,
		},
		dataBound : function() {
			// data 없을때
			if (this.dataSource.total() == 0) {
				this.element.find('.k-listview-content').html('<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>');
			}
		},
		selectable : true,
		scrollable : "endless",
		change: CNSL101T_loadCounselParam,
		template : kendo.template($("#templateCNSL101T_1").html()),
	}).data("kendoListView");

	Utils.customInterval('listViewCNSL101T_1' ).then((res)=> {
		listViewCNSL101T_1.select(listViewCNSL101T_1.items().first());
	})
}

function CNSL101T_loadCounselParam() {
	CNSL101T_fnLoadCounsel(listViewCNSL101T_1);
}

function CNSL101T_fnLoadCounsel(_listView){
	//kw---20240313 : 환자를 어디서 찾았는지 구분하기 위함 - find:환자찾기, list:상담이력
	custSelMode = "list";
	
	var CNSL101T_selectedIndex = 0;
	var data = CNSL101_aJsonArray,
	CNSL101T_selected = $.map(_listView.select(), function(item) {
	  CNSL101T_selectedIndex = $(item).index() 
      return data[$(item).index()];
    });
	if ( counselMode != 'add' && nowCallId != '' && CNSL101T_selectedIndex != 0 && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 33).bsVl1 == 'Y' ) {
		listViewCNSL101T_1.select(listViewCNSL101T_1.content.children().first());
		Utils.alert('상담이력을 저장해주세요.');
		return false;
	}
	if ( CNSL101T_selected.length == 0 ) {
		return false;
	}
	cntcHistNo = CNSL101T_selected[0].unfyCntcHistNo;
	cnslHistSeq = CNSL101T_selected[0].telCnslHistSeq;
	custId = CNSL101T_selected[0].cntcCustId;
	custNm = CNSL101T_selected[0].cntcCustNm;
	custTelNum = CNSL101T_selected[0].cntcTelNo;
	
	if ( nowCallId == '' ) {
		cnslState = 'init';
	}

	if ( custId != null && custId != '' ) {
		CNSL100MTabClick("/bcs/cnsl/CNSL113T")
		if ( typeof(settingCNSL112SEL01) != 'undefined' ) {
			settingCNSL112SEL01();
		}
		if ( typeof(settingCNSL162SEL01) != 'undefined' ) {
			settingCNSL162SEL01();
		}
		
		console.log(":::::: 22");
		
	} else {
		
		
		if (cnslFirstConnected == false) {
			CNSL100MTabClick("/bcs/cnsl/CNSL110T")
			CNSL100MTabClick("/bcs/cnsl/CNSL160T")
			
			if ( typeof(settingCNSL112SEL01) != 'undefined' ) {
				custInitCNSL112();
			}
		} else {
			
			if(Utils.isNull(cnslCustSelItem)){
			
				unknownCustomerSel();
				
				var dataItem = {
						pid 	: custId,
						ptNm 	: custNm,
					};
						
				cnslCustSelItem = dataItem;
			}
			
			if ( window['set' + tabFrmId + 'CustInfo'] ) {
				new Function ( 'set' + tabFrmId + 'CustInfo(' + JSON.stringify(cnslCustSelItem) +')')();
			}
			
			cnslCustSelItem = '';
			cnslFirstConnected = false;
		}
		
		if ( typeof(searchCustomer) != 'undefined' ) {
			searchCustomer(CNSL101T_selected[0].cntcTelNo, 1000)
		}
		
		
	}
	if ( typeof(CNSL113T_btnDiv) != 'undefined' ) {
		CNSL113T_btnDiv(true);
	}
	if ( typeof(setCNSL113SEL01) != 'undefined' ) {
		
		//kw---20240408 : 부재중일 경우 '저장후대기' 등의 버튼 활성화
		//kw---20240408 : 기존에는 버튼활성화 여부를 callId 존재 여부로 판단했기 때문에 부재중일 경우에는 후처리이면서, 현재상태가 부재중이고, 첫번째 아이템을 선택했을 경우로 판단
		if(document.querySelector("#txtAgentState2").innerText == "후처리" && CNSL101T_selected[0].state == "c" && listViewCNSL101T_1.select().index() == '0'){
			CNSL113BtnMode("Disconnect");
		} else {
			if ( nowCallId == '' ) {
				cnslState = 'init';
			}
			CNSL113BtnMode(cnslState);
		}
		
		setCNSL113SEL01();
	}

	CNSL_Utils.callHistoryClickListener_f3();
}

//kw---20240306 : 무통화상담 추가
function noCallListClearSelection(nType){
	listViewCNSL101T_1.clearSelection();
	
	if(nType == 'find'){
		custSelMode = "find";
	}
}