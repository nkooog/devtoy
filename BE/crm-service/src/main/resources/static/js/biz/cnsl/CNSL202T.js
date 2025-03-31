var listViewCNSL202T_1;
var startCNSL202, endCNSL202;
var CNSL202T_obj = {};

$(document).ready(function() {
	
	$("#listViewCNSL202T_1").css("border-width", "0px");
	
	CNSL202T_obj.fontOption = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 45);
	CNSL202T_obj.fontValue = "1";
	if(!Utils.isNull(CNSL202T_obj.fontOption)){
	    if(CNSL202T_obj.fontOption.useYn == "Y" && !Utils.isNull(CNSL202T_obj.fontOption.bsVl1)){
	    	CNSL202T_obj.fontValue = CNSL202T_obj.fontOption.bsVl1;
	    }
	} else {
	    console.log("faile");
	}
	
	//공통콤보 불러오기
	var data = { "codeList": [
		{"mgntItemCd":"S0002"},
		{"mgntItemCd":"C0119"},
	]};
    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList102,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });

	startCNSL202 = $(".CNSL202 #startDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: startChangeCNSL202,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	endCNSL202 = $(".CNSL202 #endDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: endChangeCNSL202,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");

	startCNSL202.max(endCNSL202.value());
	endCNSL202.min(startCNSL202.value());
	if ( typeof(cnslEnable) == 'undefined' ) {
		startCNSL202.enable(true);
		endCNSL202.enable(true);
	} 
	else {
		startCNSL202.enable(cnslEnable);
		endCNSL202.enable(cnslEnable);
	}
	if ( typeof(cnslRangeDay) == 'undefined' ) {
		getRangeDayCNSL202(30);
	}else {
		getRangeDayCNSL202(cnslRangeDay);
	}
	$(".CNSL202 .btnRefer_default").on("click", function() {
    	$(this).parent().find("button").removeClass('selected');
    	$(this).addClass('selected');
    	if ( $(this).attr("range") != undefined ) {
    		var rangeDay = Number($(this).attr("range"));
        	getRangeDayCNSL202(rangeDay);
        	startCNSL202.enable(false);
    		endCNSL202.enable(false);
    	} else {
    		startCNSL202.enable(true);
        	endCNSL202.enable(true);
    	}
	});
	$(".CNSL202").off("click",".btn_srh")
	$(".CNSL202").on("click",".btn_srh", function(event) {
		setCNSL202SEL01();
	});


	$(".CNSL202").off("keypress","#srchTxt").on("keypress","#srchTxt", function(event) {
		if (event.key === "Enter" || event.keyCode === 13) {
			event.preventDefault(); // 기본 동작 방지 (폼 제출 방지)
			setCNSL202SEL01();
		}
	});


	setCNSL202SEL01();
	heightResizeCNSL();
});

function resultComboList102(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	
	let srchTypeCombo = Utils.setKendoComboBox(jsonDecode, "S0002", '.CNSL202 .S0002', '', false) ;

	if(srchTypeCombo){
        srchTypeCombo.bind("change", function () {
			const value = this.value()
			if(value == '2'){
				 var $input = $(".CNSL202 #srchTxt")
				if (!$input.data("kendoComboBox")) {
					$input.parent().removeClass('searchTextBox').addClass('searchComboBox');
					Utils.setKendoComboBox(jsonDecode, "C0119", '.CNSL202 #srchTxt', '', true) ;
					$(".CNSL202 #srchTxt").val("")
					$input.hide()
				}
			}else{
				var $input = $(".CNSL202 #srchTxt")
				var  comboBox = $input.data("kendoComboBox");
				if (comboBox) {
                    $input.parent().parent().removeClass('searchComboBox').addClass('searchTextBox');
					comboBox.destroy(); // Kendo 위젯 파괴
				   	$input.insertBefore($input.closest(".k-input.k-combobox"));
				   	$input.siblings(".k-combobox").remove();
				   	$input.val('')
				   	$input.show()
                }
			}

        });
	}
}

function getRangeDayCNSL202(rangeDay) {
	
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
	
    $(".CNSL202 #startDate").val(startDate);
    $(".CNSL202 #endDate").val(endDate);
}


function startChangeCNSL202() {
	var startDate = startCNSL202.value();
	var endDate = endCNSL202.value();

	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		endCNSL202.min(startDate);
	} else if (endDate) {
		startCNSL202.max(new Date(endDate));
	} else {
		endDate = new Date();
		startCNSL202.max(endDate);
		endCNSL202.min(endDate);
	}
}

function endChangeCNSL202() {
	var endDate = endCNSL202.value();
	var startDate = startCNSL202.value();

	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		startCNSL202.max(endDate);
	} else if (startDate) {
		endCNSL202.min(new Date(startDate));
	} else {
		endDate = new Date();
		startCNSL202.max(endDate);
		endCNSL202.min(endDate);
	}
}

function setCNSL202SEL01(key) {
	var CNSL202_data = {};
	if (key == undefined || key == null) {
		CNSL202_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"srchType" : $(".CNSL202 #srchType").val(),
			"srchTxt" : $(".CNSL202 #srchTxt").val(),
			"startDate" : $(".CNSL202 #startDate").val().replace(/\-/g, ''),
			"endDate" : $(".CNSL202 #endDate").val().replace(/\-/g, '')
		};
	} else {
		CNSL202_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"cabackAcpnNo" : key
		};
	}
	var CNSL202_jsonStr = JSON.stringify(CNSL202_data);
	Utils.ajaxCall("/cnsl/CNSL202SEL01", CNSL202_jsonStr, CNSL202SEL01);
}

var CNSL202_aJsonArray = new Array();

function CNSL202SEL01(data) {
	if (listViewCNSL202T_1 != undefined) {
		listViewCNSL202T_1.unbind('change')
	}
	$("#listViewCNSL202T_1").empty();
	CNSL202_aJsonArray = new Array();
	CNSL202SEL01Index = JSON.parse(data.CNSL202SEL01);
	var CNSL202SEL01IndexLen = CNSL202SEL01Index.length;
	
	for ( var i = 0; i < CNSL202SEL01IndexLen; i++ ) {
		var aJson = new Object();
		aJson.tenantId           = CNSL202SEL01Index[i].tenantId;
		aJson.cabackAcpnNo       = CNSL202SEL01Index[i].cabackAcpnNo;
		aJson.cabackId           = CNSL202SEL01Index[i].cabackId;
		aJson.cabackRegDtm       = CNSL202SEL01Index[i].cabackRegDtm;
		aJson.cabackAltmDtm      = CNSL202SEL01Index[i].cabackAltmDtm;    
		aJson.inclTelNo          = CNSL202SEL01Index[i].inclTelNo;        
		aJson.cabackReqTelno     = CNSL202SEL01Index[i].cabackReqTelno;   
		aJson.cnslrId            = CNSL202SEL01Index[i].cnslrId;          
		aJson.cnslrNm            = CNSL202SEL01Index[i].cnslrNm;          
		aJson.cnslrOrgCd         = CNSL202SEL01Index[i].cnslrOrgCd;       
		aJson.jubfCnslrId        = CNSL202SEL01Index[i].jubfCnslrId;      
		aJson.jubfCnslrOrgCd     = CNSL202SEL01Index[i].jubfCnslrOrgCd;   
		aJson.cabackProcStCd     = CNSL202SEL01Index[i].cabackProcStCd;   
		aJson.cabackProcStCdNm   = CNSL202SEL01Index[i].cabackProcStCdNm; 
		if ( CNSL202SEL01Index[i].autoCpltYn == 'Y' ) {
			aJson.autoCpltYn     = 'AC';
		} else {
			aJson.autoCpltYn     = '';
		}
		aJson.cabackInclRpsno    = CNSL202SEL01Index[i].cabackInclRpsno;  
		aJson.cabackInclRpsNoNm  = CNSL202SEL01Index[i].cabackInclRpsNoNm;
		aJson.ivrAcesCd          = CNSL202SEL01Index[i].ivrAcesCd;        
		aJson.cabackInfwShpCd    = CNSL202SEL01Index[i].cabackInfwShpCd;  
		aJson.cabackInfwShpCdNm  = CNSL202SEL01Index[i].cabackInfwShpCdNm;
		
		let custNm = CNSL202SEL01Index[i].webCabackCustNm;
		if(!Utils.isNull(custNm)){
			if(custNm.length > 6){
				custNm = custNm.substring(0,5) + "...";
			}
		}
		
		
		aJson.webCabackCustNm    = custNm;  
		aJson.webCabackMsg       = CNSL202SEL01Index[i].webCabackMsg;     
		aJson.vceCabackPlyTm     = CNSL202SEL01Index[i].vceCabackPlyTm;   
		aJson.vceCabackFilePath  = CNSL202SEL01Index[i].vceCabackFilePath;
		aJson.vceCabackYn        = CNSL202SEL01Index[i].vceCabackYn;      
		aJson.sttTrnfYn          = CNSL202SEL01Index[i].sttTrnfYn;        
		aJson.sttTxt             = CNSL202SEL01Index[i].sttTxt;           
		aJson.alrmCnfmYn         = CNSL202SEL01Index[i].alrmCnfmYn;       
		aJson.regDtm             = CNSL202SEL01Index[i].regDtm;           
		aJson.regrId             = CNSL202SEL01Index[i].regrId;           
		aJson.regrOrgCd          = CNSL202SEL01Index[i].regrOrgCd;    
		
		
		//kw---20250225 : 콜백 폰트 크기에 따른 날짜 형식 변경 yyyy-mm-dd HH:mm
		let alDtmShort = "";
		let corcDtmShort = "";
		if(!Utils.isNull(CNSL202SEL01Index[i].cabackAltmDtm)){
			aJson.cabackAltmDtmShort = CNSL202T_fnCabackDateChange(CNSL202SEL01Index[i].cabackAltmDtm);
		}
		
		if(!Utils.isNull(CNSL202SEL01Index[i].lstCorcDtm)){
			aJson.corcDtmShort = CNSL202T_fnCabackDateChange(CNSL202SEL01Index[i].lstCorcDtm);
		}
		

		
		// yyyy-mm-dd HH:mm 형식으로 변환
		
		
		switch(CNSL202SEL01Index[i].cabackProcStCd) {
			case '100':
			case '110':
			case '130':
			case '131':
			case '200':
				aJson.lstCorcDtm         = '';       
				aJson.lstCorprId         = '';       
				aJson.lstCorprNm         = '';       
				aJson.lstCorprOrgCd      = '';
				aJson.lstCorcDtmShort    = "";
				break;
			default:
				aJson.lstCorcDtm         = CNSL202SEL01Index[i].lstCorcDtm.replace('AM', '오전').replace('PM', '오후');       
				aJson.lstCorprId         = CNSL202SEL01Index[i].lstCorprId;       
				aJson.lstCorprNm         = CNSL202SEL01Index[i].lstCorprNm;       
				aJson.lstCorprOrgCd      = CNSL202SEL01Index[i].lstCorprOrgCd;
				aJson.lstCorcDtmShort    = corcDtmShort;	
				break;
		} 
		CNSL202_aJsonArray.push(aJson);
	}
	
	listViewCNSL202T_1 = $("#listViewCNSL202T_1").kendoListView({
		// data 있을때
		dataSource : {
			data : CNSL202_aJsonArray,
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
		change: CNSL202T_loadCounselParam,
		template : kendo.template($("#templateCNSL202T_" + CNSL202T_obj.fontValue).html()),
	}).data("kendoListView");
	
//	$("#listViewCNSL202T_1").css("overflow-y", "scroll");
	
}


function CNSL202T_loadCounselParam() {
	
	if(listViewCNSL202T_1.select().length <= 0){
		return;
	}
	
	if ( counselMode != 'add' && nowCallId != '' && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 33).bsVl1 == 'Y' ) {
		Utils.alert('상담이력을 저장해주세요.', function(){
			listViewCNSL202T_1.clearSelection();
		});
		return false;
	}
	var data = CNSL202_aJsonArray,
    CNSL202T_selected = $.map(this.select(), function(item) {
      return data[$(item).index()];
    });
	
	if ( CNSL202T_selected.length == 0 ) {
		return false;
	}
	
	$("#custList").click();
	custId = CNSL202T_selected[0].custId;
	cntcHistNo = '0';
	outCntcPathCd = '20';
	cabackAcpnNo = CNSL202T_selected[0].cabackAcpnNo;
	custTelNum = CNSL202T_selected[0].cabackReqTelno;
	
	CNSL200MTabClick(url112)
	if ( custId != null && custId != '' ) {
		if ( window['setting' + id112 + 'SEL01'] ) {
//			new Function ( 'setting' + id112 + 'SEL01()')()
		}
	} else {
		if ( window['custInit' + id112] ) {
			new Function ( 'custInit' + id112 + '()')()
		}
		if ( window['search' + id112 + 'SEL01'] ) {
			new Function ( 'search' + id112 + 'SEL01(\"' + CNSL202T_selected[0].cabackReqTelno +'\")')()
		}
	}
	$("#txtTargetNumber").val(CNSL202T_selected[0].cabackReqTelno);
	
	$("#ctiCallModeNm").text("콜백");
	
	//kw---20250306 : 콜백이력 선택 시 상담이력 초기화
	CNSL213T_fnConsulReset();
}

function openPopCNSL106P(tenantId, cabackAcpnNo) {
	let param = {
			tenantId : tenantId,
			cabackAcpnNo: cabackAcpnNo
		};
	Utils.openPop(GLOBAL.contextPath + "/cnsl/CNSL106P", "CNSL106P", 1000, 800, param);
}

function CNSL202T_fnCabackDateChange(dateString){
	
	let strDateChange = "";
	let plusTime = 0;

	if (dateString.includes("오전") || dateString.includes("AM")) {
	    plusTime = 0;
	} else if (dateString.includes("오후") || dateString.includes("PM")) {
	    plusTime = 12;
	} else {
	    plusTime = -1;
	}

	if(plusTime >= 0){
	    let arrDate = dateString.split(" ");
	    let strDate = arrDate[0];
	    
	    let arrTime = arrDate[2].split(":");
	    let intHour = arrTime[0];
	    if(arrTime[0] < 12){
	    	intHour = parseInt(arrTime[0]) + plusTime;
	    }
	    let strHour = "0000" + intHour;
	    
	    let intMinute = parseInt(arrTime[1]);
	    let strMinute = "000" + intMinute
	        
	    
	    strDateChange = strDate + " " + strHour.slice(-2) + ":" + strMinute.slice(-2);

	} else {
	    let date = new Date(dateString);
	    let year = date.getFullYear();
	    let month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해주고, 2자리로 맞추기
	    let day = String(date.getDate()).padStart(2, '0');
	    let hours = String(date.getHours()).padStart(2, '0');
	    let minute = String(date.getMinutes()).padStart(2, '0');

	    strDateChange = year + "-" + month + "-" + day + " " + hours + ":" + minute;
	}

	return strDateChange;

}