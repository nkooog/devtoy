var listViewCNSL102T_1;
var startCNSL102, endCNSL102;
var CNSL102T_obj = {};

$(document).ready(function() {
	
	$("#listViewCNSL102T_1").css("border-width", "0px");
	
	CNSL102T_obj.fontOption = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 45);
	CNSL102T_obj.fontValue = "1";
	if(!Utils.isNull(CNSL102T_obj.fontOption)){
	    if(CNSL102T_obj.fontOption.useYn == "Y" && !Utils.isNull(CNSL102T_obj.fontOption.bsVl1)){
	    	CNSL102T_obj.fontValue = CNSL102T_obj.fontOption.bsVl1;
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

	startCNSL102 = $(".CNSL102 #startDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: startChangeCNSL102,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	endCNSL102 = $(".CNSL102 #endDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: endChangeCNSL102,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");

	startCNSL102.max(endCNSL102.value());
	endCNSL102.min(startCNSL102.value());
	if ( typeof(cnslEnable) == 'undefined' ) {
		startCNSL102.enable(true);
		endCNSL102.enable(true);
	} 
	else {
		startCNSL102.enable(cnslEnable);
		endCNSL102.enable(cnslEnable);
	}
	if ( typeof(cnslRangeDay) == 'undefined' ) {
		getRangeDayCNSL102(30);
	}else {
		getRangeDayCNSL102(cnslRangeDay);
	}
	$(".CNSL102 .btnRefer_default").on("click", function() {
    	$(this).parent().find("button").removeClass('selected');
    	$(this).addClass('selected');
    	if ( $(this).attr("range") != undefined ) {
    		var rangeDay = Number($(this).attr("range"));
        	getRangeDayCNSL102(rangeDay);
        	startCNSL102.enable(false);
    		endCNSL102.enable(false);
    	} else {
    		startCNSL102.enable(true);
        	endCNSL102.enable(true);
    	}
	});

	$(".CNSL102").on("click",".btn_srh", function(event) {
		setCNSL102SEL01();
	});
	
	
	$(".CNSL102").off("keypress","#srchTxt").on("keypress","#srchTxt", function(event) {
		if (event.key === "Enter" || event.keyCode === 13) {
			event.preventDefault(); // 기본 동작 방지 (폼 제출 방지)
			setCNSL102SEL01();
		}
	});
	setCNSL102SEL01();
	heightResizeCNSL();
});

function resultComboList102(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);


	let srchTypeCombo = Utils.setKendoComboBox(jsonDecode, "S0002", '.CNSL102 .S0002', '', false) ;

	if(srchTypeCombo){
        srchTypeCombo.bind("change", function () {
			const value = this.value()
			if(value == '2'){
				 var $input = $(".CNSL102 #srchTxt")
				if (!$input.data("kendoComboBox")) {
					$input.parent().removeClass('searchTextBox').addClass('searchComboBox');
					Utils.setKendoComboBox(jsonDecode, "C0119", '.CNSL102 #srchTxt', '', true) ;
					$(".CNSL102 #srchTxt").val("")
					$input.hide()
				}
			}else{
				var $input = $(".CNSL102 #srchTxt")
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

function getRangeDayCNSL102(rangeDay) {
	
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
	
    $(".CNSL102 #startDate").val(startDate);
    $(".CNSL102 #endDate").val(endDate);
}


function startChangeCNSL102() {
	var startDate = startCNSL102.value();
	var endDate = endCNSL102.value();

	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		endCNSL102.min(startDate);
	} else if (endDate) {
		startCNSL102.max(new Date(endDate));
	} else {
		endDate = new Date();
		startCNSL102.max(endDate);
		endCNSL102.min(endDate);
	}
}

function endChangeCNSL102() {
	var endDate = endCNSL102.value();
	var startDate = startCNSL102.value();

	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		startCNSL102.max(endDate);
	} else if (startDate) {
		endCNSL102.min(new Date(startDate));
	} else {
		endDate = new Date();
		startCNSL102.max(endDate);
		endCNSL102.min(endDate);
	}
}

function setCNSL102SEL01(key) {
	var CNSL102_data = {};
	if (key == undefined || key == null) {
		CNSL102_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"srchType" : $(".CNSL102 #srchType").val(),
			"srchTxt" : $(".CNSL102 #srchTxt").val(),
			"startDate" : $(".CNSL102 #startDate").val().replace(/\-/g, ''),
			"endDate" : $(".CNSL102 #endDate").val().replace(/\-/g, '')
		};
	} else {
		CNSL102_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"cabackAcpnNo" : key
		};
	}
	var CNSL102_jsonStr = JSON.stringify(CNSL102_data);
	Utils.ajaxCall("/cnsl/CNSL102SEL01", CNSL102_jsonStr, CNSL102SEL01);
}

var CNSL102_aJsonArray = new Array();

function CNSL102SEL01(data) {
	if (listViewCNSL102T_1 != undefined) {
		listViewCNSL102T_1.unbind('change')
	}
	$("#listViewCNSL102T_1").empty();
	CNSL102_aJsonArray = new Array();
	CNSL102SEL01Index = JSON.parse(data.CNSL102SEL01);
	var CNSL102SEL01IndexLen = CNSL102SEL01Index.length;
	
	for ( var i = 0; i < CNSL102SEL01IndexLen; i++ ) {
		var aJson = new Object();
		aJson.tenantId           = CNSL102SEL01Index[i].tenantId;
		aJson.cabackAcpnNo       = CNSL102SEL01Index[i].cabackAcpnNo;
		aJson.cabackId           = CNSL102SEL01Index[i].cabackId;
		aJson.cabackRegDtm       = CNSL102SEL01Index[i].cabackRegDtm;
		aJson.cabackAltmDtm      = CNSL102SEL01Index[i].cabackAltmDtm;    
		aJson.inclTelNo          = CNSL102SEL01Index[i].inclTelNo;        
		aJson.cabackReqTelno     = CNSL102SEL01Index[i].cabackReqTelno;   
		aJson.cnslrId            = CNSL102SEL01Index[i].cnslrId;          
		aJson.cnslrNm            = CNSL102SEL01Index[i].cnslrNm;          
		aJson.cnslrOrgCd         = CNSL102SEL01Index[i].cnslrOrgCd;       
		aJson.jubfCnslrId        = CNSL102SEL01Index[i].jubfCnslrId;      
		aJson.jubfCnslrOrgCd     = CNSL102SEL01Index[i].jubfCnslrOrgCd;   
		aJson.cabackProcStCd     = CNSL102SEL01Index[i].cabackProcStCd;   
		aJson.cabackProcStCdNm   = CNSL102SEL01Index[i].cabackProcStCdNm; 
		if ( CNSL102SEL01Index[i].autoCpltYn == 'Y' ) {
			aJson.autoCpltYn     = 'AC';
		} else {
			aJson.autoCpltYn     = '';
		}
		aJson.cabackInclRpsno    = CNSL102SEL01Index[i].cabackInclRpsno;  
		aJson.cabackInclRpsNoNm  = CNSL102SEL01Index[i].cabackInclRpsNoNm;
		aJson.ivrAcesCd          = CNSL102SEL01Index[i].ivrAcesCd;        
		aJson.cabackInfwShpCd    = CNSL102SEL01Index[i].cabackInfwShpCd;  
		aJson.cabackInfwShpCdNm  = CNSL102SEL01Index[i].cabackInfwShpCdNm;
		aJson.webCabackCustNm    = CNSL102SEL01Index[i].webCabackCustNm;  
		aJson.webCabackMsg       = CNSL102SEL01Index[i].webCabackMsg;     
		aJson.vceCabackPlyTm     = CNSL102SEL01Index[i].vceCabackPlyTm;   
		aJson.vceCabackFilePath  = CNSL102SEL01Index[i].vceCabackFilePath;
		aJson.vceCabackYn        = CNSL102SEL01Index[i].vceCabackYn;      
		aJson.sttTrnfYn          = CNSL102SEL01Index[i].sttTrnfYn;        
		aJson.sttTxt             = CNSL102SEL01Index[i].sttTxt;           
		aJson.alrmCnfmYn         = CNSL102SEL01Index[i].alrmCnfmYn;       
		aJson.regDtm             = CNSL102SEL01Index[i].regDtm;           
		aJson.regrId             = CNSL102SEL01Index[i].regrId;           
		aJson.regrOrgCd          = CNSL102SEL01Index[i].regrOrgCd;   

		//kw---20250225 : 콜백 폰트 크기에 따른 날짜 형식 변경 yyyy-mm-dd HH:mm
		let alDtmShort = "";
		let corcDtmShort = "";
		if(!Utils.isNull(CNSL102SEL01Index[i].cabackAltmDtm)){
			aJson.cabackAltmDtmShort = CNSL102T_fnCabackDateChange(CNSL102SEL01Index[i].cabackAltmDtm);
		}
		
		if(!Utils.isNull(CNSL102SEL01Index[i].lstCorcDtm)){
			corcDtmShort.corcDtmShort = CNSL102T_fnCabackDateChange(CNSL102SEL01Index[i].lstCorcDtm);
		}
		
		switch(CNSL102SEL01Index[i].cabackProcStCd) {
			case '100':
			case '110':
			case '130':
			case '131':
			case '200':
				aJson.lstCorcDtm         = '';       
				aJson.lstCorprId         = '';       
				aJson.lstCorprNm         = '';       
				aJson.lstCorprOrgCd      = '';
				break;
			default:
				aJson.lstCorcDtm         = CNSL102SEL01Index[i].lstCorcDtm.replace('AM', '오전').replace('PM', '오후');       
				aJson.lstCorprId         = CNSL102SEL01Index[i].lstCorprId;       
				aJson.lstCorprNm         = CNSL102SEL01Index[i].lstCorprNm;       
				aJson.lstCorprOrgCd      = CNSL102SEL01Index[i].lstCorprOrgCd;
				aJson.lstCorcDtmShort    = corcDtmShort;
				break;
		} 
		CNSL102_aJsonArray.push(aJson);
	}
	
	listViewCNSL102T_1 = $("#listViewCNSL102T_1").kendoListView({
		// data 있을때
		dataSource : {
			data : CNSL102_aJsonArray,
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
		change: CNSL102T_loadCounselParam,
		template : kendo.template($("#templateCNSL102T_" + CNSL102T_obj.fontValue).html()),
	}).data("kendoListView");
	
}


function CNSL102T_loadCounselParam() {
	if ( counselMode != 'add' && nowCallId != '' && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 33).bsVl1 == 'Y' ) {
		Utils.alert('상담이력을 저장해주세요.');
		return false;
	}
	var data = CNSL102_aJsonArray,
    CNSL102T_selected = $.map(this.select(), function(item) {
      return data[$(item).index()];
    });
	$("#custList").click();
	
	if(!Utils.isNull(CNSL102T_selected[0])){
		custId = CNSL102T_selected[0].custId;
	}
	
	cntcHistNo = '0';
	outCntcPathCd = '20';
	//cabackAcpnNo = CNSL102T_selected[0].cabackAcpnNo;
	
	if ( custId != null ) {
		CNSL100MTabClick("/bcs/cnsl/CNSL112T")
		if ( typeof(settingCNSL112SEL01) != 'undefined' ) {
			settingCNSL112SEL01();
		}
	} else {
		CNSL100MTabClick("/bcs/cnsl/CNSL110T")
//		if ( typeof(settingCNSL112SEL01) != 'undefined' ) {
//			custInitCNSL112();
//		}
		searchCustomer(CNSL102T_selected[0].cabackReqTelno)
	}
	$("#txtTargetNumber").val(CNSL102T_selected[0].cabackReqTelno);
}

function openPopCNSL106P(tenantId, cabackAcpnNo) {
	let param = {
			tenantId : tenantId,
			cabackAcpnNo: cabackAcpnNo
		};
	Utils.openPop(GLOBAL.contextPath + "/cnsl/CNSL106P", "CNSL106P", 1000, 800, param);
}

function CNSL102T_fnCabackDateChange(dateString){
	
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