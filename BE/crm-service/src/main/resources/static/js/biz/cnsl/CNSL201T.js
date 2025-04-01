var listViewCNSL201T_1;
var startCNSL201, endCNSL201;

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

	startCNSL201 = $(".CNSL201 #startDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: startChangeCNSL201,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	endCNSL201 = $(".CNSL201 #endDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: endChangeCNSL201,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");

	startCNSL201.max(endCNSL201.value());
	endCNSL201.min(startCNSL201.value()); 
	if ( typeof(cnslEnable) == 'undefined' ) {
		startCNSL201.enable(true);
		endCNSL201.enable(false);
	} 
	else {
		startCNSL201.enable(cnslEnable);
		endCNSL201.enable(false);
	}
	if ( typeof(cnslRangeDay) == 'undefined' ) {
//		getRangeDayCNSL201(30);
		getRangeDayCNSL201(0);
	}else {
//		getRangeDayCNSL201(cnslRangeDay);
		getRangeDayCNSL201(0);
	}
	
	$(".CNSL201 .btnRefer_default").on("click", function() {
    	$(this).parent().find("button").removeClass('selected');
    	$(this).addClass('selected');
    	if ( $(this).attr("range") != undefined ) {
    		var rangeDay = Number($(this).attr("range"));
        	getRangeDayCNSL201(rangeDay);
        	startCNSL201.enable(false);
    		endCNSL201.enable(false);
    	} else {
    		startCNSL201.enable(true);
    		endCNSL201.enable(false);
    	}
	});
	
	$(".CNSL201 .btn_srh").on("click", function(event) {
		setCNSL201SEL01();
	});
	setCNSL201SEL01();
	heightResizeCNSL();
});


function resultComboList101(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	
	Utils.setKendoComboBox(jsonDecode, "S0001", '.CNSL201 .S0001', '', false) ;
}

function getRangeDayCNSL201(rangeDay) {
	
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
	
    $(".CNSL201 #startDate").val(startDate);
    $(".CNSL201 #endDate").val(endDate);
}


function startChangeCNSL201() {
	var startDate = startCNSL201.value();
	var endDate = endCNSL201.value();

	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		endCNSL201.min(startDate);
	} else if (endDate) {
		startCNSL201.max(new Date(endDate));
	} else {
		endDate = new Date();
		startCNSL201.max(endDate);
		endCNSL201.min(endDate);
	}
}

function endChangeCNSL201() {
	var endDate = endCNSL201.value();
	var startDate = startCNSL201.value();

	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		startCNSL201.max(endDate);
	} else if (startDate) {
		endCNSL201.min(new Date(startDate));
	} else {
		endDate = new Date();
		startCNSL201.max(endDate);
		endCNSL201.min(endDate);
	}
}


function loadCNSL201SEL01() {
	var toDay = new Date();	// 현재 날짜 및 시간
	var toYear = toDay.getFullYear();
    var toMonth = ("0" + (1 + toDay.getMonth())).slice(-2);
    var toDay = ("0" + toDay.getDate()).slice(-2);
    var toDate = toYear + toMonth + toDay; 
    $(".CNSL201 #srchTxt").val("")
    
	var CNSL201_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"usrId" : GLOBAL.session.user.usrId,
		"srchType" : "",
		"srchTxt" : "",
		"startDate" : toDate,
		"endDate" : toDate
	};
    
	var CNSL201_jsonStr = JSON.stringify(CNSL201_data);
	Utils.ajaxCall("/cnsl/CNSL201SEL01", CNSL201_jsonStr, CNSL201SEL01);
}

function setCNSL201SEL01(key) {
	var CNSL201_data = {};
	if (key == undefined || key == null) {
		CNSL201_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"srchType" : $(".CNSL201 #srchType").val(),
			"srchTxt" : $(".CNSL201 #srchTxt").val(),
			"startDate" : $(".CNSL201 #startDate").val().replace(/\-/g, ''),
			"endDate" : $(".CNSL201 #endDate").val().replace(/\-/g, '')
		};
	} else {
		CNSL201_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"unfyCntcHistNo" : key
		};
	}
	var CNSL201_jsonStr = JSON.stringify(CNSL201_data);
	Utils.ajaxCall("/cnsl/CNSL201SEL01", CNSL201_jsonStr, CNSL201SEL01);
}

var CNSL201_aJsonArray = new Array();

function CNSL201SEL01(data) {
	
	
	
	if (listViewCNSL201T_1 != undefined) {
		listViewCNSL201T_1.unbind('change')
	} 
	$("#listViewCNSL201T_1").empty();
	CNSL201_aJsonArray = new Array();
	CNSL201SEL01Index = JSON.parse(data.CNSL201SEL01);
	var CNSL201SEL01IndexLen = CNSL201SEL01Index.length;
	
	for ( var i = 0; i < CNSL201SEL01IndexLen; i++ ) {
		var cntcDt = CNSL201SEL01Index[i].cntcDt;
		if ( cntcDt != null && cntcDt.length == 8 ) {
			cntcDt = cntcDt.slice(0,4) + '-' + cntcDt.slice(4,6) + '-' + cntcDt.slice(6,8);
		}
		var cntcCnntDtm = CNSL201SEL01Index[i].cntcInclDtm;
		if ( cntcCnntDtm != null && cntcCnntDtm.length == 14 ) {
			cntcCnntDtm = cntcCnntDtm.slice(8,10) + ':' + cntcCnntDtm.slice(10,12);
		}else {
			cntcCnntDtm = '--:--';
		}
		var cntcEndDtm = CNSL201SEL01Index[i].cntcEndDtm;
		if ( cntcEndDtm != null && cntcEndDtm.length == 14 ) {
			cntcEndDtm = cntcEndDtm.slice(8,10) + ':' + cntcEndDtm.slice(10,12);
		}else {
			cntcEndDtm = '--:--';
		}
		var aJson = new Object();
		aJson.date = cntcDt;
		aJson.sTime = cntcCnntDtm;
		aJson.eTime = cntcEndDtm;
		aJson.cntcCustNm = CNSL201SEL01Index[i].cntcCustNm;
		aJson.cntcTelNo = CNSL201SEL01Index[i].cntcTelNo;
		aJson.inclRpsTelNo = CNSL201SEL01Index[i].inclRpsTelNo;
		aJson.cntcChnlCd = CNSL201SEL01Index[i].cntcChnlCd;
		aJson.cntcPathNm = CNSL201SEL01Index[i].cntcPathNm;
		aJson.inclIvrSvcNm = CNSL201SEL01Index[i].inclIvrSvcNm;
		aJson.unfyCntcHistNo = CNSL201SEL01Index[i].unfyCntcHistNo;
		aJson.telCnslHistSeq = CNSL201SEL01Index[i].telCnslHistSeq;
		aJson.cntcCustId = CNSL201SEL01Index[i].cntcCustId;
		aJson.cntcTelNo = CNSL201SEL01Index[i].cntcTelNo;
		aJson.curRsvYn = CNSL201SEL01Index[i].curRsvYn;
		aJson.trclYn = CNSL201SEL01Index[i].trclYn;
		aJson.iobDvCd = CNSL201SEL01Index[i].iobDvCd;
		aJson.chnlAcpnNo = CNSL201SEL01Index[i].chnlAcpnNo;
		aJson.cnsltypcdpath = '';
		
		//kw---20240423 : 양지검진으로 인한 예약시 접수번호 넣기
		aJson.custAcpnNo = CNSL201SEL01Index[i].custAcpnNo;
		
		var stateIdx = "";
		if ( CNSL201SEL01Index[i].cnslRsltCd == '10') {
				stateIdx = "a";
		} else if ( CNSL201SEL01Index[i].cnslRsltCd == '11') { 
				stateIdx = "b";
		} else if ( CNSL201SEL01Index[i].cnslRsltCd == '12') { 
				stateIdx = "c";
		}
		aJson.state = stateIdx;
		CNSL201_aJsonArray.push(aJson);
	}
	listViewCNSL201T_1 = $("#listViewCNSL201T_1").kendoListView({
		// data 있을때
		dataSource : {
			data : CNSL201_aJsonArray,
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
		change: CNSL201T_loadCounselParam,
		template : kendo.template($("#templateCNSL201T_1").html()),
	}).data("kendoListView");
	
	setTimeout(function() {
		listViewCNSL201T_1.select(listViewCNSL201T_1.content.children().first());
	}, 500);
}

function CNSL201T_loadCounselParam() {
	
	//kw---20240313 : 환자를 어디서 찾았는지 구분하기 위함 - find:환자찾기, list:상담이력
	custSelMode = "list";
	
	var CNSL201T_selectedIndex = 0;
	var data = CNSL201_aJsonArray,
	CNSL201T_selected = $.map(this.select(), function(item) {
	  CNSL201T_selectedIndex = $(item).index();
      return data[$(item).index()];
    });
	if ( counselMode != 'add' && nowCallId != '' && CNSL201T_selectedIndex != 0 && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 33).bsVl1 == 'Y' ) {
		listViewCNSL201T_1.select(listViewCNSL201T_1.content.children().first());
		Utils.alert('상담이력을 저장해주세요.');
		return false;
	}
	if ( CNSL201T_selected.length == 0 ) {
		return false;
	} 
	
	cntcHistNo = CNSL201T_selected[0].unfyCntcHistNo;
	cnslHistSeq = CNSL201T_selected[0].telCnslHistSeq;
	custId = CNSL201T_selected[0].cntcCustId;
	custNm = CNSL201T_selected[0].cntcCustNm;
	custTelNum = CNSL201T_selected[0].cntcTelNo;
	
	//kw---20240423 : 양지검진으로 인한 예약시 접수번호 넣기
	custAcpnNo = CNSL201T_selected[0].custAcpnNo;
	
	console.log(":::: CNSL201T_selected[0]");
	console.log(CNSL201T_selected[0]);
	
	if ( nowCallId == '' ) {
		cnslState = 'init';
	}
	
	if ( custId != null && custId != '' ) {

		if(window['CNSL200MTabClick']){
			CNSL200MTabClick("/bcs/cnsl/CNSL213T");
		}

		if(window['CNSL300MTabClick']){
			CNSL300MTabClick("/bcs/cnsl/CNSL213T");
		}

		if ( window['setting' + id112 + 'SEL01'] ) {
			if( cnslState != 'Disconnect' ){
				new Function ( 'setting' + id112 + 'SEL01()')()
			}
		}
	} else {

		if(window['CNSL200MTabClick']){
			CNSL200MTabClick(url112);
		}

		if(window['CNSL300MTabClick']){
			CNSL300MTabClick(url112);
		}
		
		if ( window['custInit' + id112] ) {
			new Function ( 'custInit' + id112 + '()')()
		}

		
		//kw---20240507 : 콜팝업에서 환자조회를 하지 않을 경우 환자 찾기를 하도록 수정 
		var searchYn = false;
		
		if(softCallPopGridBool == true){
			if(cnslState == 'init' || cnslState == 'Disconnect'){
				searchYn = true;
			} 
		} else {
			searchYn = true;
		}
		
		if(searchYn){
			if ( window['search' + id112 + 'SEL01'] ) {
				
				if(Utils.isNull(cnslCustSelItem)){
					
					unknownCustomerSel();
					
					var dataItem = {
							pid 	: custId,
							ptNm 	: custNm,
						};
							
					cnslCustSelItem = dataItem;
				}
				//kw---20240222 : 콜팝업에서 고객정보 그리드로 고객 선택 추가
				//kw---20240222 : 밑에 변수로 조건을 걸어서 전화 픽업 이후 처음으로 상담기록을 클릭했을 떄 환자찾기를 안하도록 설정

				new Function ( 'search' + id112 + 'SEL01(\"' + CNSL201T_selected[0].cntcTelNo +'\")')();
				
				if(cnslFirstConnected == true){
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
				
			}
		} else {
			

			let CNSL220_srchType = $(".CNSL220 #srchType").data("kendoComboBox");
			CNSL220_srchType.value("1");
			$(".CNSL220 #srchTxt").val(CNSL201T_selected[0].cntcTelNo);
			$(".YJGB112 #YJGB112_srchTxt").val(CNSL201T_selected[0].cntcTelNo);
			
			if(Utils.isNull(cnslCustSelItem)){
				
				unknownCustomerSel();
				
				var dataItem = {
						pid 	: custId,
						ptNm 	: custNm,
					};
						
				cnslCustSelItem = dataItem;
			} else {
				if ( window['set' + tabFrmId + 'CustInfo'] ) {
					new Function ( 'set' + tabFrmId + 'CustInfo(' + JSON.stringify(cnslCustSelItem) +')')();
				}
			}
		}
		
	}
	if ( typeof(CNSL213T_btnDiv) != 'undefined' ) {
		CNSL213T_btnDiv(true);
	}
	if ( typeof(setCNSL213SEL01) != 'undefined' ) {
		//kw---20240408 : 부재중일 경우 '저장후대기' 등의 버튼 활성화
		//kw---20240408 : 기존에는 버튼활성화 여부를 callId 존재 여부로 판단했기 때문에 부재중일 경우에는 후처리이면서, 현재상태가 부재중이고, 첫번째 아이템을 선택했을 경우로 판단
		if(document.querySelector("#txtAgentState2").innerText == "후처리" && CNSL201T_selected[0].state == "c" && listViewCNSL201T_1.select().index() == '0'){
			CNSL213BtnMode("Disconnect");
		} else {
			CNSL213BtnMode(cnslState);
		}

		setCNSL213SEL01();
	}

	CNSL_Utils.callHistoryClickListener_f3();
}

//kw---20240306 : 무통화상담 추가
function noCallListClearSelection(nType){
	listViewCNSL201T_1.clearSelection();
	
	if(nType == 'find'){
		custSelMode = "find";
	}
}