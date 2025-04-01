var listViewCNSL103T_1;
var startCNSL103, endCNSL103;
var CNSL103T_selectGrid;
var CNSL103T_cancelBtnClick = '';
var CNSL103T_obj = {};

$(document).ready(function() {
	
	$("#listViewCNSL103T_1").css("border-width", "0px");
	
	CNSL103T_obj.fontOption = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 45);
	CNSL103T_obj.fontValue = "1";
	if(!Utils.isNull(CNSL103T_obj.fontOption)){
	    if(CNSL103T_obj.fontOption.useYn == "Y" && !Utils.isNull(CNSL103T_obj.fontOption.bsVl1)){
	    	CNSL103T_obj.fontValue = CNSL103T_obj.fontOption.bsVl1;
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

	startCNSL103 = $(".CNSL103 #startDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: startChangeCNSL103,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	endCNSL103 = $(".CNSL103 #endDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: endChangeCNSL103,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");

	startCNSL103.max(endCNSL103.value());
	endCNSL103.min(startCNSL103.value()); 
	if ( typeof(cnslEnable) == 'undefined' ) {
		startCNSL103.enable(true);
		endCNSL103.enable(true);
	} 
	else {
		startCNSL103.enable(cnslEnable);
		endCNSL103.enable(cnslEnable);
	}
	if ( typeof(cnslRangeDay) == 'undefined' ) {
		getRangeDayCNSL103(30);
	}else {
		getRangeDayCNSL103(cnslRangeDay);
	}
	$(".CNSL103 .btnRefer_default").on("click", function() {
    	$(this).parent().find("button").removeClass('selected');
    	$(this).addClass('selected');
    	if ( $(this).attr("range") != undefined ) {
    		var rangeDay = Number($(this).attr("range"));
        	getRangeDayCNSL103(rangeDay);
        	startCNSL103.enable(false);
    		endCNSL103.enable(false);
    	} else {
    		startCNSL103.enable(true);
        	endCNSL103.enable(true);
    	}
	});
	
	$(".CNSL103 .btn_srh").on("click", function(event) {
		setCNSL103SEL01();
	});
	setCNSL103SEL01();
	heightResizeCNSL();
});

function resultComboList103(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	
	Utils.setKendoComboBox(jsonDecode, "S0003", '.CNSL103 .S0003', '', false) ;
}

function getRangeDayCNSL103(rangeDay) {
	
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
	
    $(".CNSL103 #startDate").val(startDate);
    $(".CNSL103 #endDate").val(endDate);
}


function startChangeCNSL103() {
	var startDate = startCNSL103.value();
	var endDate = endCNSL103.value();

	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		endCNSL103.min(startDate);
	} else if (endDate) {
		startCNSL103.max(new Date(endDate));
	} else {
		endDate = new Date();
		startCNSL103.max(endDate);
		endCNSL103.min(endDate);
	}
}

function endChangeCNSL103() {
	var endDate = endCNSL103.value();
	var startDate = startCNSL103.value();

	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		startCNSL103.max(endDate);
	} else if (startDate) {
		endCNSL103.min(new Date(startDate));
	} else {
		endDate = new Date();
		startCNSL103.max(endDate);
		endCNSL103.min(endDate);
	}
}

function setCNSL103SEL01(key) {
	var CNSL103_data = {};
	if (key == undefined || key == null) {
		CNSL103_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"srchType" : $(".CNSL103 #srchType").val(),
			"srchTxt" : $(".CNSL103 #srchTxt").val(),
			"startDate" : $(".CNSL103 #startDate").val().replace(/\-/g, ''),
			"endDate" : $(".CNSL103 #endDate").val().replace(/\-/g, '')
		};
	} else {
		CNSL103_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"unfyCntcHistNo" : key
		};
	}
	var CNSL103_jsonStr = JSON.stringify(CNSL103_data);
	Utils.ajaxCall("/cnsl/CNSL103SEL01", CNSL103_jsonStr, CNSL103SEL01);
}

var CNSL103_aJsonArray = new Array();

function CNSL103SEL01(data) {
	if (listViewCNSL103T_1 != undefined) {
		listViewCNSL103T_1.unbind('change')
	} 
	$("#listViewCNSL103T_1").empty();
	
	CNSL103_aJsonArray = new Array();
	CNSL103SEL01Index = JSON.parse(data.CNSL103SEL01);
	var CNSL103SEL01IndexLen = CNSL103SEL01Index.length;
	
	for ( var i = 0; i < CNSL103SEL01IndexLen; i++ ) {
		
		var rsvDd = CNSL103SEL01Index[i].rsvDd;
		if ( rsvDd != null && rsvDd.length == 8 ) {
			rsvDd = rsvDd.slice(0,4) + '-' + rsvDd.slice(4,6) + '-' + rsvDd.slice(6,8);
		}
		
		var aJson = new Object();
		aJson.ID = CNSL103SEL01Index[i].unfyCntcHistNo+'-'+CNSL103SEL01Index[i].telCnslHistSeq;
		aJson.cntcCustNm = CNSL103SEL01Index[i].cntcCustNm;
		aJson.cntcTelNo = CNSL103SEL01Index[i].cntcTelNo;
		aJson.regrNm = CNSL103SEL01Index[i].regrId+'('+CNSL103SEL01Index[i].regrNm+')';
		aJson.rsvDd = rsvDd+' '+CNSL103SEL01Index[i].rsvHour+':'+CNSL103SEL01Index[i].rsvPt;
		aJson.lstCorcDdHour = CNSL103SEL01Index[i].lstCorcDdHour;
		aJson.state = CNSL103SEL01Index[i].procStCd;
		aJson.procStNm = CNSL103SEL01Index[i].procStNm;
		aJson.cntcCustId = CNSL103SEL01Index[i].cntcCustId;
		
		
		
		CNSL103_aJsonArray.push(aJson);
	}
	
	listViewCNSL103T_1 = $("#listViewCNSL103T_1").kendoListView({
		// data 있을때
		dataSource : {
			data : CNSL103_aJsonArray,
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
		change: CNSL103T_loadCounselParam,
		template : kendo.template($("#templateCNSL103T_" + CNSL103T_obj.fontValue).html()),
	}).data("kendoListView");
	
}


function CNSL103T_loadCounselParam() {
	if ( counselMode != 'add' && nowCallId != '' && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 33).bsVl1 == 'Y' ) {
		Utils.alert('상담이력을 저장해주세요.');
		return false;
	}
	var data = CNSL103_aJsonArray,
    CNSL103T_selected = $.map(this.select(), function(item) {
      return data[$(item).index()];
    });
	CNSL100MTabClick("/bcs/cnsl/CNSL112T")
	custId = CNSL103T_selected[0].cntcCustId;
	cntcHistNo = CNSL103T_selected[0].ID.split("-")[0];
	cabackAcpnNo = CNSL103T_selected[0].ID.split("-")[0];
	cnslHistSeq = CNSL103T_selected[0].ID.split("-")[1];
	
	outCntcPathCd = '30';
	
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
	$("#txtTargetNumber").val(CNSL103T_selected[0].cntcTelNo);
	
	CNSL103T_selectGrid =CNSL103T_selected[0];
	
}

function CNSL103T_fnBtnStateCancel(data){
	
	var resultData = JSON.parse(data);
	
	CNSL103T_cancelBtnClick = 'Y';
	CNSL103T_fnStateCancel(resultData);
}

function CNSL103T_fnStateCancel(_data){
	
	if(!Utils.isNull(_data)){
		if(CNSL103T_cancelBtnClick == 'Y' && _data.state == '1'){
			
			CNSL103T_cancelBtnClick = '';
			
			Utils.confirm(CNSL103T_langMap.get("CNSL103T.cancel.alert"), function(e){
				
				var objParam = {
						tenantId 		: GLOBAL.session.user.tenantId,
						unfyCntcHistNo	: _data.ID.split("-")[0],
						telCnslHistSeq	: _data.ID.split("-")[1],
						procStCd		: '3',
						usrId			: GLOBAL.session.user.usrId,
						orgCd			: GLOBAL.session.user.orgCd
						
				}
				
				
				Utils.ajaxCall('/cnsl/CNSL103UPT02', JSON.stringify(objParam), function(result){
					var selectIndex = listViewCNSL103T_1.select().index();
					var rsvList = listViewCNSL103T_1.dataSource.data();
					rsvList[selectIndex].state = '3';
					rsvList[selectIndex].procStNm = CNSL103T_langMap.get("CNSL103T.cancel.btnNm");
					
					listViewCNSL103T_1.dataSource.data(rsvList);
				});
			});
		} else {
			CNSL103T_cancelBtnClick = '';
		}
		
	}
}
	