var CNSL213ComboList;

//kw---20240329 : 상담이력저장 - 상담유형 레이어 팝업이 활성화 됐을 때 다른 영역을 클릭하면 닫히도록 수정
var CNSL213T_srchCondPopActive = false;
var CNSL213T_srchCondPopVisible = false;
var CNSL213T_srchCondPopInit = false;
var init_curRsvYn = '';
var CNSL213T_sel01Reuslt;

$(document).ready(function () {
	
	$(document).on('dblclick', '#callop_SearchConditionPop .posible', function(e) {
		CNSL213T_fnLayoutPopClose();
	});
	
	$("#callop_SearchConditionPop" ).keyup(function(e) {
		if(e.keyCode == "27"){
			CNSL213T_fnLayoutPopClose();
		}
	});
	
	//공통콤보 불러오기
	var data = { "codeList": [
		{"mgntItemCd":"C0129"},
		{"mgntItemCd":"C0130"},
		{"mgntItemCd":"C0131"},
		{"mgntItemCd":"C0137"},
		{"mgntItemCd":"C0143"},
		{"mgntItemCd":"C0144"},
		{"mgntItemCd":"C0145"},
		{"mgntItemCd":"C0235"},
		{"mgntItemCd":"C0308"},
		{"mgntItemCd":"C0312"},
		{"mgntItemCd":"C0314"}
	]};
    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList213,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
    heightResizeCNSL();
    setTimeout(function() {
    	setCNSL213SEL01();
	}, 100);
    
    $(".CNSL213 #callop_open").click(function () {
    	CNSL213T_fnLayoutPopOpen();
	});    

    $(".CNSL213 #cnslTypL1,.CNSL213 #cnslTypL2,.CNSL213 #cnslTypL3,.CNSL213 #cnslTypL4,.CNSL213 #cnslTypL5").click(function () {
    	CNSL213T_fnLayoutPopOpen();
	});
    
	$("#callop_SearchConditionPopClose").click(function () {
		CNSL213T_fnLayoutPopClose();
	});
	
	//kw---20240311 : BMH 무통화 추가 및 CNSL213T 상담저장 페이지 수정 시작
	$("#noCallTime #CNSL213T_regCntcInclHourptsec").kendoDateTimePicker({
		value: new Date(),  
		culture: "ko-KR",   
		footer: false, 
		format: "yyyy-MM-dd HH:mm", 
	});
	
	$("#noCallTime #CNSL213T_regCntcEndHourptsec").kendoDateTimePicker({
		value: new Date(),  
		culture: "ko-KR",   
		footer: false, 
		format: "yyyy-MM-dd HH:mm", 
	});
	
	$("#rsvdtm").kendoDateTimePicker({
		value: new Date(),  
		culture: "ko-KR",   
		footer: false, 
		format: "yyyy-MM-dd HH:mm", 
	});
	//kw---20240311 : BMH 무통화 추가 및 CNSL213T 상담저장 페이지 수정 끝
	
});

$(document).off("click.SearchConditionPop");			//kw---20240329 : 상담이력저장 - F5키를 이용하여 새로고침 하면 밑에 click 이벤트가 중복으로 생성되는걸 방지
$(document).on("click.SearchConditionPop", "#callop_SearchConditionPop li", function() {
	//kw---20240329 : 상담이력저장 - 상담유형 레이어 팝업이 활성화 됐을 때 다른 영역을 클릭하면 닫히도록 수정
	if(CNSL213T_srchCondPopInit == true){
		return;
	}
	var prsLvlCd = $(this).find("input").attr("name");
	var hgrkCnslTypCd = $(this).find("input").attr("comCd");
	var dataCreYn = $(this).find("input").attr("dataCreYn");
	if ( dataCreYn == "Y" ) {
		$(".cnslTypList").val('');
		$(".CNSL213 #cnslTypCd").val(hgrkCnslTypCd);
		$('#callop_SearchConditionPop input').each(function() {
			var lvlCd = $(this).attr("name");
			if($(this).is(':checked')) {
				$("#cnslTyp" + lvlCd).val($(this).attr("comCdNm"));
			}
		});
	}else {
		$(".cnslTypList").val('');
	}
	switch (prsLvlCd) {
	    case 'L1':
	    	setCNSL213SEL03('L2',hgrkCnslTypCd);
	        break;
	    case 'L2':
	    	setCNSL213SEL03('L3',hgrkCnslTypCd);
	        break;
	    case 'L3':
	    	setCNSL213SEL03('L4',hgrkCnslTypCd);
	        break;
	    case 'L4':
	    	setCNSL213SEL03('L5',hgrkCnslTypCd);
	        break;
	    case 'L5':
	        break;
	}
});
CNSL213BtnMode(cnslState);
if ( counselMode == 'noCallCounselMode' ) {
	noCallCounselMode();
}

//kw---20240329 : 상담이력저장 - 상담유형 레이어 팝업이 활성화 됐을 때 다른 영역을 클릭하면 닫히도록 수정
$(document).off("click.CNSL213T_searchCondition");	//kw---20240329 : 상담이력저장 - F5키를 이용하여 새로고침 하면 밑에 click 이벤트가 중복으로 생성되는걸 방지
$(document).on("click.CNSL213T_searchCondition", function(event) {
	if(CNSL213T_srchCondPopActive == true){
		if(CNSL213T_srchCondPopVisible == true){
			var targetElement = $(event.target); // 클릭된 요소 가져오기
			   
			var callop_SearchConditionPop = $("#callop_tooltip");
			
			if (!targetElement.is(callop_SearchConditionPop) && !callop_SearchConditionPop.has(targetElement).length) {
				if ($("#callop_SearchConditionPop").hasClass('active')) {
					CNSL213T_fnLayoutPopClose();
				}
			}
		} else {
			CNSL213T_srchCondPopVisible = true;
		}
	}
});

//kw---20240329 : 상담이력 저장 - esc 키를 눌러서 레이어팝업창 닫기
$(document).off("keydown.CNSL213T_searchCondition");		//kw---20240329 : 상담이력저장 - F5키를 이용하여 새로고침 하면 밑에 click 이벤트가 중복으로 생성되는걸 방지
$(document).on("keydown.CNSL213T_searchCondition", function(event) {
    if (event.key === "Escape") {
    	if ($("#callop_SearchConditionPop").hasClass('active')) {
    		CNSL213T_fnLayoutPopClose();	
    	}
    }
});

function CNSL213toDay() {
	let today = new Date();
	let year = today.getFullYear();
	let month = String(today.getMonth() + 1).padStart(2, '0');
	let day = String(today.getDate()).padStart(2, '0');
	let result = year + month + day;
	
	//kw---20240311 : BMH 무통화 추가 및 CNSL213T 상담저장 페이지 수정
//	$("#noCallTime #cntcInclYYYYMMDD").val(result);
//	$("#noCallTime #cntcEndYYYYMMDD").val(result);
}

function CNSL213BtnMode(btnMode) {
	
	switch (btnMode) {
	    case 'init':
	    	$("#initBtn").attr("disabled", true);
			$("#saveTmp").attr("disabled", true);
			$("#saveBtn").attr("disabled", false);
			$("#saveWaitBtn").attr("disabled", true);
			$("#saveRestBtn").attr("disabled", true);
			$("#saveWorkBtn").attr("disabled", true);
	        break;
	    case 'Connected':
	    	$("#initBtn").attr("disabled", true);
			$("#saveTmp").attr("disabled", false);
			$("#saveBtn").attr("disabled", false);
			$("#saveWaitBtn").attr("disabled", true);
			$("#saveRestBtn").attr("disabled", true);
			$("#saveWorkBtn").attr("disabled", true);
	        break;
	    case 'addMode':
	    	$("#initBtn").attr("disabled", false);
			$("#saveTmp").attr("disabled", true);
			$("#saveBtn").attr("disabled", true);
			$("#saveWaitBtn").attr("disabled", true);
			$("#saveRestBtn").attr("disabled", true);
			$("#saveWorkBtn").attr("disabled", true);
	        break;
	    case 'Disconnect':
	    	$("#initBtn").attr("disabled", true);
			$("#saveTmp").attr("disabled", true);
			$("#saveBtn").attr("disabled", true);
			$("#saveWaitBtn").attr("disabled", false);
			$("#saveRestBtn").attr("disabled", false);
			$("#saveWorkBtn").attr("disabled", false);
	        break;
	}
}

function resultComboList213(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	CNSL213ComboList = jsonDecode;
	Utils.setKendoComboBox(jsonDecode, "", '.CNSL213 #cntcRsltDtlsCd', '', false) ;
	
	//kw---20240311 : BMH 무통화 추가 및 CNSL213T 상담저장 페이지 수정
//	Utils.setKendoComboBox(jsonDecode, "C0312", '.CNSL213 #cntcInclHH', '', false) ;
//	Utils.setKendoComboBox(jsonDecode, "C0312", '.CNSL213 #cntcEndHH', '', false) ;
	
	if ( counselMode == 'noCallCounselMode' ) {
		Utils.setKendoComboBox(jsonDecode, "C0129", '.CNSL213 #iobDvCd', '1', false) ;
    } else {
    	Utils.setKendoComboBox(jsonDecode, "C0129", '.CNSL213 #iobDvCd', '', false) ;
    }
	
	if ( counselMode == 'noCallCounselMode' ) {
		Utils.setKendoComboBox(jsonDecode, "C0137", '.CNSL213 #cntcPathCd', '', false) ;
	} else {
		Utils.setKendoComboBox(jsonDecode, "C0131", '.CNSL213 #cntcPathCd', '', false) ;
	}
	
	let dataSource = [];
	dataSource = dataSource.concat(jsonDecode.filter(function (code) {
        if (code.mgntItemCd == "C0143") {
            code.text = code.comCdNm;
            code.value = code.comCd;
            return code;
        }
    }));
	
	let dataSource1 = [];
	dataSource1 = dataSource1.concat(jsonDecode.filter(function (code) {
        if (code.mgntItemCd == "C0130") {
            code.text = code.comCdNm;
            code.value = code.comCd;
            return code;
        }
    }));
	
	let dataSource2 = [];
	dataSource2 = dataSource2.concat(jsonDecode.filter(function (code) {
        if (code.mgntItemCd == "C0235") {
            code.text = code.comCdNm;
            code.value = code.comCd;
            return code;
        }
    }))
    
	
    let kendoComboBox = $('.CNSL213 #cntcRsltCd').kendoComboBox({
        dataSource: dataSource,
        dataTextField: "text",
        dataValueField: "value",
        clearButton: false,
        autoWidth: true,
        change: function(e) {
            let value = this.value();
        	switch (value) {
	    	    case "1":
	    	    	let CNSL213_cntcPathCd = $(".CNSL213 #cntcPathCd").data("kendoComboBox").value();
	    	    	if ( CNSL213_cntcPathCd == '20' ) {
	    	    		
	    	    		Utils.setKendoComboBox(jsonDecode, "C0314", '.CNSL213 #cntcRsltDtlsCd', '', false) ;
	    	    	} else {
	    	    		Utils.setKendoComboBox(jsonDecode, "C0308", '.CNSL213 #cntcRsltDtlsCd', '', false) ;
	    	    	}
	    	        break;
	    	    case "2":
	    	    	Utils.setKendoComboBox(jsonDecode, "C0144", '.CNSL213 #cntcRsltDtlsCd', '', false) ;
	    	        break;
	    	    case "9":
	    	    	Utils.setKendoComboBox(jsonDecode, "C0145", '.CNSL213 #cntcRsltDtlsCd', '', false) ;
	    	        break;
        	}
        }
    }).data("kendoComboBox");
    kendoComboBox.input.attr("readonly", true);
    
    let kendoComboBox1 = $('.CNSL213 #cntcPathMgntItemCd').kendoComboBox({
        dataSource: dataSource1,
        dataTextField: "text",
        dataValueField: "value",
        clearButton: false,
        autoWidth: true,
        change: function(e) {
            let value = this.value();
        	switch (value) {
	    	    case "10":
	    	    	Utils.setKendoComboBox(jsonDecode, "C0131", '.CNSL213 #cntcPathCd', '', false) ;
	    	        break;
	    	    case "16":
	    	    	Utils.setKendoComboBox(jsonDecode, "C0137", '.CNSL213 #cntcPathCd', '', false) ;
	    	        break;
        	}
        }
    }).data("kendoComboBox");
    kendoComboBox1.input.attr("readonly", true);
    
    if ( counselMode == 'noCallCounselMode' ) {
    	kendoComboBox1.value("16");
    } else {
    	kendoComboBox1.value("10");
    }
    
    let kendoComboBox2 = $('.CNSL213 #baseAnswCd').kendoComboBox({
        dataSource: dataSource2,
        dataTextField: "text",
        dataValueField: "value",
        clearButton: false,
        autoWidth: true,
        change: function(e) {
            let value = this.value();
            var CNSL213_data = {
        		"tenantId" : GLOBAL.session.user.tenantId,
        		"baseAnswCd" : value
            };
        	Utils.ajaxCall("/cnsl/CNSL213SEL02", JSON.stringify(CNSL213_data), function (result) {
        		if ( result.CNSL213SEL02 != null ) {
        			let CNSL213SEL02_index = result.CNSL213SEL02;
        			$(".CNSL213 #cnslTypCd").val(CNSL213SEL02_index.cnslTypCd);
        			var counselcnslTypCdList = JSON.parse(result.CNSL213SEL04);
        			$("#cnslTypL1").val(counselcnslTypCdList.lvl1cd);
        			$("#cnslTypL2").val(counselcnslTypCdList.lvl2cd);
        			$("#cnslTypL3").val(counselcnslTypCdList.lvl3cd);
        			$("#cnslTypL4").val(counselcnslTypCdList.lvl4cd);
        			$("#cnslTypL5").val(counselcnslTypCdList.lvl5cd);
        		}
            });
        }
    }).data("kendoComboBox");
    kendoComboBox2.input.attr("readonly", true);
}


function setCNSL213SEL01() {
	if ( !(cntcHistNo == undefined || cntcHistNo == '' ) ) {
		var CNSL213_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"unfyCntcHistNo" : cntcHistNo,
			"telCnslHistSeq" : cnslHistSeq
		};
		var CNSL213_jsonStr = JSON.stringify(CNSL213_data);
		Utils.ajaxCall("/cnsl/CNSL213SEL01", CNSL213_jsonStr, CNSL213SEL01);
	}
}


function setCNSL213SEL03(prsLvlCd, hgrkCnslTypCd) {
	cnslTypInit(prsLvlCd);
	var CNSL213_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"prsLvlCd" : prsLvlCd,
		"hgrkCnslTypCd" : hgrkCnslTypCd
	};
	var CNSL213_jsonStr = JSON.stringify(CNSL213_data);
	Utils.ajaxCall("/cnsl/CNSL213SEL03", CNSL213_jsonStr, CNSL213SEL03);
}

function cnslTypInit(prsLvlCd) {
	switch (prsLvlCd) {
	    case 'L1':
	    	$("#1Depth").html('');
	    	$("#2Depth").html('');
	    	$("#3Depth").html('');
	    	$("#4Depth").html('');
	    	$("#5Depth").html('');
	        break;
	    case 'L2':
	    	$("#2Depth").html('');
	    	$("#3Depth").html('');
	    	$("#4Depth").html('');
	    	$("#5Depth").html('');
	        break;
	    case 'L3':
	    	$("#3Depth").html('');
	    	$("#4Depth").html('');
	    	$("#5Depth").html('');
	        break;
	    case 'L4':
	    	$("#4Depth").html('');
	    	$("#5Depth").html('');
	        break;
	    case 'L5':
	    	$("#5Depth").html('');
	        break;
	}
}

function CNSL213SEL01(data) {
	
	$(".CNSL213 #cnslCtt").focus();
	
	if($('.CNSL213 #iobDvCd').data("kendoComboBox")){
		$('.CNSL213 #iobDvCd').data("kendoComboBox").enable(false);
	}
	
	
	
	let counselInfo = JSON.parse(data.CNSL213SEL01);
	
	CNSL213T_sel01Reuslt = counselInfo;
	
	let cntcInclHourptsec = counselInfo.cntcInclHourptsec;
	let cntcEndHourptsec = counselInfo.cntcEndHourptsec;
	let cntcInclHourptsecTxt = '-';
	let cntcEndHourptsecTxt = '-';
	
	cntcCallCnnTime = counselInfo.cntcCnntHourptsec;
	
	if ( cntcInclHourptsec != null && cntcInclHourptsec.length == 14 ) {
		cntcInclHourptsecTxt = '';
		cntcInclHourptsecTxt += cntcInclHourptsec.slice(0,4) + "-" + cntcInclHourptsec.slice(4,6) + '-' + cntcInclHourptsec.slice(6,8) + ' '
		cntcInclHourptsecTxt += cntcInclHourptsec.slice(8,10) + ':' + cntcInclHourptsec.slice(10,12) + ':' + cntcInclHourptsec.slice(12,14);
	}
	
	if ( cntcEndHourptsec != null && cntcEndHourptsec.length == 14 ) {
		cntcEndHourptsecTxt = '';
		cntcEndHourptsecTxt += cntcEndHourptsec.slice(0,4) + "-" + cntcEndHourptsec.slice(4,6) + '-' + cntcEndHourptsec.slice(6,8) + ' '
		cntcEndHourptsecTxt += cntcEndHourptsec.slice(8,10) + ':' + cntcEndHourptsec.slice(10,12) + ':' + cntcEndHourptsec.slice(12,14);
	}
	
	if ( cnslState == 'Disconnect' && $(".CNSL213 #telCnslHistSeq").val() != '' ) {
		$(".CNSL213 #cntcEndHourptsec").text(cntcEndHourptsecTxt);
		return;
	} 
	counselInit();
	
	let counselcnslTypCdList = JSON.parse(data.CNSL213SEL04);
	$(".CNSL213 #cntcPathNm").text(counselInfo.cntcPathNm);
	$(".CNSL213 #cntcPathCd").val(counselInfo.cntcPathCd);
	$(".CNSL213 #chnlAcpnNo").val(counselInfo.chnlAcpnNo);
	$(".CNSL213 #trclSeq").val(counselInfo.trclSeq);
	
	let CNSL213_iobDvCd = $(".CNSL213 #iobDvCd").data("kendoComboBox");
	
	if(!Utils.isNull(CNSL213_iobDvCd)){
		CNSL213_iobDvCd.value(counselInfo.iobDvCd);
	}
	
	
	let CNSL213_cntcPathMgntItemCd = $(".CNSL213 #cntcPathMgntItemCd").data("kendoComboBox");
	
	if(!Utils.isNull(counselInfo.cntcPathMgntItemCd)){
		
		//kw---20240422 : TAB 재 로딩시 스크립트 오류 수정
		if(!Utils.isNull(CNSL213_cntcPathMgntItemCd)){
			CNSL213_cntcPathMgntItemCd.value(counselInfo.cntcPathMgntItemCd);
		}
		
		if ( counselInfo.cntcPathMgntItemCd == "10" ) {
			$(".CNSL213 #callTime").show();
			$(".CNSL213 #noCallTime").hide();
			Utils.setKendoComboBox(CNSL213ComboList, "C0131", '.CNSL213 #cntcPathCd', counselInfo.cntcPathCd, false);
			$(".CNSL213 #cntcTelNoTitle").text("전화번호");
			$(".CNSL213 #cntcTelNo").html('<input class="k-input" id="cntcTelNoVal" value="'+counselInfo.cntcTelNo+'" readonly/>');
		} else if ( counselInfo.cntcPathMgntItemCd == "16" ){
			$(".CNSL213 #callTime").hide();
			$(".CNSL213 #noCallTime").show();
			Utils.setKendoComboBox(CNSL213ComboList, "C0137", '.CNSL213 #cntcPathCd', counselInfo.cntcPathCd, false) ;
			$(".CNSL213 #cntcTelNoTitle").text("접촉채널ID");
			$(".CNSL213 #cntcTelNo").html('<input id="cntcChnlCustId" class="k-input" value="'+counselInfo.cntcChnlCustId+'"/>');

			//kw---20240311 : BMH 무통화 추가 및 CNSL213T 상담저장 페이지 수정
//			$(".CNSL213 #cntcInclYYYYMMDD").val(cntcInclHourptsec.slice(0,8));
//			$(".CNSL213 #cntcInclHH").data("kendoComboBox").value(cntcInclHourptsec.slice(8,10))
//			$(".CNSL213 #cntcInclMI").val(cntcInclHourptsec.slice(10,12));
			
			//kw---20240311 : BMH 무통화 추가 및 CNSL213T 상담저장 페이지 수정
//			$(".CNSL213 #cntcEndYYYYMMDD").val(cntcEndHourptsec.slice(0,8));
//			$(".CNSL213 #cntcEndHH").data("kendoComboBox").value(cntcEndHourptsec.slice(8,10))
//			$(".CNSL213 #cntcEndMI").val(cntcEndHourptsec.slice(10,12));
		}
	}

	let CNSL213_custId = '';
	let CNSL213_custNm = '';
	if( counselInfo.cntcCustNm == '' ) {
		CNSL213_custId = custId
		CNSL213_custNm = custNm;
	}else {
		CNSL213_custId = counselInfo.cntcCustId;
		CNSL213_custNm = counselInfo.cntcCustNm;
	}
	
	if( custId == GLOBAL.session.user.tenantId + '_1' || custId == '' ) {
		$(".CNSL213 #cntcCustId").html('<input id="unknownCustomId" class="k-input" value="'+CNSL213_custId+'"/>');
		$(".CNSL213 #cntcCustNm").html('<input id="unknownCustomNm" class="k-input" value="'+CNSL213_custNm+'"/>');
	}else {
		$(".CNSL213 #cntcCustId").html('<input id="unknownCustomId" class="k-input" value="'+CNSL213_custId+'" readonly/>');
		$(".CNSL213 #cntcCustNm").html('<input id="unknownCustomNm" class="k-input" value="'+CNSL213_custNm+'" readonly/>');
	}
	
	$(".CNSL213 #cntcInclHourptsec").text(cntcInclHourptsecTxt);
	$(".CNSL213 #cntcEndHourptsec").text(cntcEndHourptsecTxt);
	
	let CNSL213_baseAnswCd = $(".CNSL213 #baseAnswCd").data("kendoComboBox");
	CNSL213_baseAnswCd.value(counselInfo.baseAnswCd);
	
	let CNSL213_cntcRsltCd = $(".CNSL213 #cntcRsltCd").data("kendoComboBox");
	CNSL213_cntcRsltCd.value(counselInfo.cntcRsltCd);
	
	switch (counselInfo.cntcRsltCd) {
	    case "1":
	    	let CNSL213_cntcPathCd = $(".CNSL213 #cntcPathCd").data("kendoComboBox").value();
	    	if ( CNSL213_cntcPathCd == '20' ) {
	    		Utils.setKendoComboBox(CNSL213ComboList, "C0314", '.CNSL213 #cntcRsltDtlsCd', counselInfo.cntcRsltDtlsCd, false) ;
	    	} else {
	    		Utils.setKendoComboBox(CNSL213ComboList, "C0308", '.CNSL213 #cntcRsltDtlsCd', counselInfo.cntcRsltDtlsCd, false) ;
	    	}
	        break;
	    case "2":
	    	Utils.setKendoComboBox(CNSL213ComboList, "C0144", '.CNSL213 #cntcRsltDtlsCd', counselInfo.cntcRsltDtlsCd, false) ;
	        break;
	    case "9":
	    	Utils.setKendoComboBox(CNSL213ComboList, "C0145", '.CNSL213 #cntcRsltDtlsCd', counselInfo.cntcRsltDtlsCd, false) ;
	        break;
	}
	
	$(".CNSL213 #cnslTypCd").val(counselInfo.cnslTypCd);
	$(".CNSL213 #cnslTypNm").val(counselInfo.cnslTypNm);
	
	$(".CNSL213 #cnslTite").val(counselInfo.cnslTite);
	$(".CNSL213 #cnslCtt").val(counselInfo.cnslCtt);
	$(".CNSL213 #telCnslHistSeq").val(counselInfo.telCnslHistSeq);
	
	
	if ( counselInfo.curRsvYn == 'Y') {
		$(".CNSL213 #curRsvYn").prop('checked', true);
		$(".CNSL213 #curRsvYn").prop('disabled', true);
		init_curRsvYn = 'Y';
		
		//예약 된걸 다시 못바꾸게 하기 위함
		var CNSL213_rsvdtm = $(".CNSL213 #rsvdtm").data("kendoDateTimePicker");
		var wrapper = CNSL213_rsvdtm.wrapper;

        // 달력 버튼 비활성화
        wrapper.find(".k-i-calendar").closest("button").prop("disabled", true);

        // 시간 버튼 비활성화
        wrapper.find(".k-i-clock").closest("button").prop("disabled", true);
        
	}else {
		$(".CNSL213 #curRsvYn").prop('checked', false);
		$(".CNSL213 #curRsvYn").prop('disabled', false);
		init_curRsvYn = 'N';
		
		//예약 된걸 다시 못바꾸게 하기 위함
		var CNSL213_rsvdtm = $(".CNSL213 #rsvdtm").data("kendoDateTimePicker");
		var wrapper = CNSL213_rsvdtm.wrapper;

        // 달력 버튼 비활성화
        wrapper.find(".k-i-calendar").closest("button").prop("disabled", false);

        // 시간 버튼 비활성화
        wrapper.find(".k-i-clock").closest("button").prop("disabled", false);
	}
	
	if ( counselInfo.trclYn == 'Y') {
		$(".CNSL213 #trclYn").prop('checked', true);
		$(".CNSL213 #trclYn").prop('disabled', true);
		$(".CNSL213 #CNSL213T_btnDspsrCustSearch").prop('disabled', true);

	}else {
		$(".CNSL213 #trclYn").prop('checked', false);

		$(".CNSL213 #trclYn").prop('disabled', false);
		$(".CNSL213 #CNSL213T_btnDspsrCustSearch").prop('disabled', false);
	}
	
	$(".CNSL213 #trclFlg").val(counselInfo.trclYn);
	$(".CNSL213 #dspsrId").val(counselInfo.rcvinCnslrId);
	$(".CNSL213 #trclmnNm").val(counselInfo.rcvinCnslrNm);
	$(".CNSL213 #dspsrOrgCd").val(counselInfo.rcvinCnslrBlngOrgCd);
	$(".CNSL213 #trclCtt").val(counselInfo.trclCtt);
	if ( counselcnslTypCdList != null ) {
		$("#cnslTypL1").val(counselcnslTypCdList.lvl1cd);
		$("#cnslTypL2").val(counselcnslTypCdList.lvl2cd);
		$("#cnslTypL3").val(counselcnslTypCdList.lvl3cd);
		$("#cnslTypL4").val(counselcnslTypCdList.lvl4cd);
		$("#cnslTypL5").val(counselcnslTypCdList.lvl5cd);
	}
}


function CNSL213SEL03(data) {
	var counselTypeHtml = '';
	var resultList = JSON.parse(data.CNSL213SEL03);
	
	//kw---20240418 : 상담유형 순서에 맞게 상담유형 표출
	//srt_seq 순서로 정렬
	let counselTypeList = resultList.sort(function (a, b) {
            let x = parseInt(a.srtSeq);
            let y = parseInt(b.srtSeq);
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
	});
	
	var counselprsLvlCd = '';
	for ( var i = 0; i < counselTypeList.length; i++ ) {
		if ( i == 0 ){
			counselprsLvlCd = counselTypeList[i].prsLvlCd;
		} 
		var counselTypeId = counselTypeList[i].prsLvlCd+'Depth_'+i;
		
		if ( counselTypeList[i].dataCreYn == 'Y' ) {
			counselTypeHtml+='<li><input type="radio" name="'+counselprsLvlCd+'" comCd="'+counselTypeList[i].comCd+'" comCdNm="'+counselTypeList[i].comCdNm+'" dataCreYn="'+counselTypeList[i].dataCreYn+'" id="'+counselTypeId+'"><label for="'+counselTypeId+'"><span class="posible">'+counselTypeList[i].comCdNm+'</span></label></li>'
		} else {
			counselTypeHtml+='<li><input type="radio" name="'+counselprsLvlCd+'" comCd="'+counselTypeList[i].comCd+'" comCdNm="'+counselTypeList[i].comCdNm+'" dataCreYn="'+counselTypeList[i].dataCreYn+'" id="'+counselTypeId+'"><label for="'+counselTypeId+'"><span>'+counselTypeList[i].comCdNm+'</span></label></li>'
		}
		
	}
	switch (counselprsLvlCd) {
	    case 'L1':
	    	$("#1Depth").html(counselTypeHtml);
	        break;
	    case 'L2':
	    	$("#2Depth").html(counselTypeHtml);
	        break;
	    case 'L3':
	    	$("#3Depth").html(counselTypeHtml);
	        break;
	    case 'L4':
	    	$("#4Depth").html(counselTypeHtml);
	        break;
	    case 'L5':
	    	$("#5Depth").html(counselTypeHtml);
	        break;
	}
}


function counselInit() {
	
	//kw---20240311 : BMH 무통화 추가 및 CNSL213T 상담저장 페이지 수정
	$("#callCntcCustInfo").show();
	$("#callTime").show();
	$("#noCallCntcCustInfo").hide();
	$("#noCallTime").hide();
	
	$(".CNSL213 #callTime").show();
	$(".CNSL213 #noCallTime").hide();
	$(".CNSL213 #cntcPathNm").text('');
	$(".CNSL213 #chnlAcpnNo").val('');
	$(".CNSL213 #trclSeq").val('');
	$(".CNSL213 #iobDvCd").text('');
	$(".CNSL213 #cntcCustId").html('');
	$(".CNSL213 #cntcCustNm").html('');
	$(".CNSL213 #cntcTelNo").html('');
	$(".CNSL213 #cntcInclHourptsec").text('');
	$(".CNSL213 #cntcEndHourptsec").text('');
	$(".CNSL213 #cnslTypCd").val('');
	$(".CNSL213 #cnslTypNm").val('');
	$(".cnslTypList").val('');
	
	let CNSL213_iobDvCd = $(".CNSL213 #iobDvCd").data("kendoComboBox");
	if(!Utils.isNull(CNSL213_iobDvCd)){	CNSL213_iobDvCd.value('');	}
	
	let CNSL213_cntcPathMgntItemCd = $(".CNSL213 #cntcPathMgntItemCd").data("kendoComboBox");
	if(!Utils.isNull(CNSL213_cntcPathMgntItemCd)){	CNSL213_cntcPathMgntItemCd.value('');	}
	
	let CNSL213_cntcPathCd = $(".CNSL213 #cntcPathCd").data("kendoComboBox");
	if(!Utils.isNull(CNSL213_cntcPathCd)){	CNSL213_cntcPathCd.value('');	}
	
	let CNSL213_baseAnswCd = $(".CNSL213 #baseAnswCd").data("kendoComboBox");
	if(!Utils.isNull(CNSL213_baseAnswCd)){	CNSL213_baseAnswCd.value('');	}
	
	let CNSL213_cntcRsltCd = $(".CNSL213 #cntcRsltCd").data("kendoComboBox");
	if(!Utils.isNull(CNSL213_cntcRsltCd)){	CNSL213_cntcRsltCd.value('');	}
	
	let CNSL213_cntcRsltDtlsCd = $(".CNSL213 #cntcRsltDtlsCd").data("kendoComboBox");
	if(!Utils.isNull(CNSL213_cntcRsltDtlsCd)){	CNSL213_cntcRsltDtlsCd.value('');	}
	
	$(".CNSL213 #cnslTite").val('');
	$(".CNSL213 #cnslCtt").val('');
	$(".CNSL213 #telCnslHistSeq").val('');
	$(".CNSL213 #curRsvYn").prop('checked', false);
	$(".CNSL213 #trclYn").prop('checked', false);
	$(".CNSL213 #trclFlg").val('');
	$(".CNSL213 #dspsrId").val('');
	$(".CNSL213 #trclmnNm").val('');
	$(".CNSL213 #dspsrOrgCd").val('');
	$(".CNSL213 #trclCtt").val('');
	counselMode = '';
	
	//kw---20240307 : 예약시간 현재 시간으로 초기화 해주기
	if($(".CNSL213 #rsvdtm").data("kendoDateTimePicker")){
		$(".CNSL213 #rsvdtm").data("kendoDateTimePicker").value(new Date());
	}
	
	if($(".CNSL213 #iobDvCd").data("kendoComboBox")){
		$(".CNSL213 #iobDvCd").data("kendoComboBox").enable(false);
	}
	
	if($('.CNSL213 #cntcPathMgntItemCd').data("kendoComboBox")){
		$('.CNSL213 #cntcPathMgntItemCd').data("kendoComboBox").enable(false);
	}
	
	if($('.CNSL213 #cntcPathCd').data("kendoComboBox")){
		$('.CNSL213 #cntcPathCd').data("kendoComboBox").enable(false);
	}
}

/*
 * //kw---20240311 : BMH 무통화 추가 및 CNSL213T 상담저장 페이지 수정
function noCallCounselMode() {
	CNSL213toDay();
	//kw---20240311 : BMH 무통화 추가 및 CNSL213T 상담저장 페이지 수정
//	$(".CNSL213 #cntcInclHH").data("kendoComboBox").value('00')
//	$(".CNSL213 #cntcInclMI").val('00');
//	$(".CNSL213 #cntcEndHH").data("kendoComboBox").value('00')
//	$(".CNSL213 #cntcEndMI").val('00');
	
	$(".CNSL213 #callTime").hide();
	$(".CNSL213 #noCallTime").show();
	$(".CNSL213 #cntcPathNm").text('');
	$(".CNSL213 #chnlAcpnNo").val('');
	$(".CNSL213 #trclSeq").val('');
	$(".CNSL213 #iobDvCd").text('');
	if( custId == GLOBAL.session.user.tenantId + '_1' || custId == '' ) {
		$(".CNSL213 #cntcCustId").html('<input id="unknownCustomId" class="k-input" value="'+custId+'"/>');
		$(".CNSL213 #cntcCustNm").html('<input id="unknownCustomNm" class="k-input" value="'+custNm+'"/>');
	}else {
		$(".CNSL213 #cntcCustId").html(custId);
		$(".CNSL213 #cntcCustNm").html(custNm);
	}
	$(".CNSL213 #cntcTelNoTitle").text("접촉채널ID");
	$(".CNSL213 #cntcTelNo").html('<input id="cntcChnlCustId" class="k-input" value=""/>');
	$(".CNSL213 #cntcInclHourptsec").text('');
	$(".CNSL213 #cntcEndHourptsec").text('');
	$(".CNSL213 #cnslTypCd").val('');
	$(".CNSL213 #cnslTypNm").val('');
	$(".cnslTypList").val('');
	let CNSL213_iobDvCd = $(".CNSL213 #iobDvCd").data("kendoComboBox");
	CNSL213_iobDvCd.value('1');
	let CNSL213_cntcPathMgntItemCd = $(".CNSL213 #cntcPathMgntItemCd").data("kendoComboBox");
	CNSL213_cntcPathMgntItemCd.value('16');
	Utils.setKendoComboBox(CNSL213ComboList, "C0137", '.CNSL213 #cntcPathCd', '', false) ;
	let CNSL213_baseAnswCd = $(".CNSL213 #baseAnswCd").data("kendoComboBox");
	CNSL213_baseAnswCd.value('');
	let CNSL213_cntcRsltCd = $(".CNSL213 #cntcRsltCd").data("kendoComboBox");
	CNSL213_cntcRsltCd.value('');
	let CNSL213_cntcRsltDtlsCd = $(".CNSL213 #cntcRsltDtlsCd").data("kendoComboBox");
	CNSL213_cntcRsltDtlsCd.value('');
	$(".CNSL213 #cnslTite").val('');
	$(".CNSL213 #cnslCtt").val('');
	$(".CNSL213 #telCnslHistSeq").val('');
	$(".CNSL213 #curRsvYn").prop('checked', false);
	$(".CNSL213 #trclYn").prop('checked', false);
	$(".CNSL213 #trclFlg").val('');
	$(".CNSL213 #dspsrId").val('');
	$(".CNSL213 #trclmnNm").val('');
	$(".CNSL213 #dspsrOrgCd").val('');
	$(".CNSL213 #trclCtt").val('');
	cntcHistNo = '';
	$('.CNSL213 #iobDvCd').data("kendoComboBox").enable(true);
}
*/

function counseladdMode() {
	counselMode = 'add';
	
	CNSL213BtnMode(cnslState);
	CNSL213UPT01('');
}

function openPopSYSM212P() {
	Utils.setCallbackFunction("transUser", transUser);
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM212P", "SYSM212P" , 400, 810,  {callbackKey: "transUser"});
}

function openPopSYSM281P() {
	Utils.setCallbackFunction("counselSet", counselSet);
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM281P", "SYSM281P" , 1200, 520,  {cnslTypCd:$(".CNSL213 #cnslTyp").val(), callbackKey: "counselSet"});
}


function openPopMCNS510P() {
	let MCNS500M_clickDataSet = {
        tenantId: GLOBAL.session.user.tenantId,
        unfyCntcHistNo: cntcHistNo,
        cnslHistSeq: cnslHistSeq,
        trclSeq: $(".CNSL213 #trclSeq").val()
    }
	Utils.openPop(GLOBAL.contextPath + "/mcns/MCNS510P", "MCNS510P", 1000, 700, MCNS500M_clickDataSet);
}

function CNSL213UPT01(CNSL213Flag) {
	//상담이력 저장시 필수값 체크
	if ( custId == undefined || custId == '') {
		Utils.alert("상담대상을 선택해주세요.");
		return;
	}
	
	//kw---20240306 : 무통화상담 추가
	if ( cntcHistNo == undefined || cntcHistNo == '') {
		
		if(Utils.isNull($(".CNSL213 #CNSL213T_inptCntcCustId").val())){
			Utils.alert("환자를 선택해 주세요.");
			return;
		}
		
		if(Utils.isNull($(".CNSL213 #CNSL213T_inptCntcCustNm").val())){
			Utils.alert("'환자명'을 입력해 주세요.");
			return;
		}
		
		
//		if(Utils.isNull($(".CNSL213 #CNSL213T_inptCntcTelNo").val())){
//			Utils.alert("'전화번호'를 입력해 주세요.");
//			return;
//		}
	}	
	
	
	if ( $(".CNSL213 #cnslTypCd").val() == '' && CNSL213Flag != 'tmp' ) {
		Utils.alert("상담유형은 필수값입니다.", $(".CNSL213 #cnslTypCd").focus());
		return;
	}
	
	//kw---20240306 : 무통화상담 추가
	
	var dateString;
	var cntcInclTime, cntcCnntTime, cntcEndTime;
	var regDate;
	
	dateString = $('.CNSL213 #CNSL213T_regCntcInclHourptsec').val();
	
	cntcInclTime = dateString.replace(/[-: ]/g, "") + "00";
	cntcCnntTime = dateString.replace(/[-: ]/g, "") + "00";
	
	dateString = $('.CNSL213 #CNSL213T_regCntcEndHourptsec').val();
	cntcEndTime = dateString.replace(/[-: ]/g, "") + "00";
	regDate = dateString.substring(0, 4) + dateString.substring(5, 7) + dateString.substring(8, 10);
	
	if ( cntcHistNo == undefined || cntcHistNo == '') {

		var CNSL213_data = {		
				
				"tenantId" : GLOBAL.session.user.tenantId,
				"usrId" : GLOBAL.session.user.usrId,
				"orgCd" : GLOBAL.session.user.orgCd,
				"iobDvCd" : $(".CNSL213 #iobDvCd").data("kendoComboBox")._valueBeforeCascade,
				"cntcChnlCd" : $(".CNSL213 #cntcPathMgntItemCd").data("kendoComboBox")._valueBeforeCascade,
				"cntcPathMgntItemCd" : $(".CNSL213 #cntcPathMgntItemCd").data("kendoComboBox")._valueBeforeCascade,
				"cntcPathCd" : $(".CNSL213 #cntcPathCd").data("kendoComboBox")._valueBeforeCascade,
				"cntcChnlCustId" : $(".CNSL213 #CNSL213T_inptCntcCustId").val(),
				//kw---20240311 : BMH 무통화 추가 및 CNSL213T 상담저장 페이지 수정
				"cntcDt" : regDate,
				"cntcCnntDtm" : cntcInclTime,
				"cntcEndDtm" : cntcEndTime,
				//kw---20240507 : 양지검진 - 접수번호, 인터페이스 타입 저장
				"custAcpnNo"  : custAcpnNo,
			};
		
    	Utils.ajaxCall("/cnsl/CNSL200INS03", JSON.stringify(CNSL213_data) , function (result) {  
    		cntcHistNo = result.result; 
    		
    		$(".CNSL213 #telCnslHistSeq").val('1');
    		CNSL213UPT01(CNSL213Flag);
    	});
	} else {
		var tmpSaveYn = 'N';
		var curRsvYn = '';
		if ( $(".CNSL213 #curRsvYn").is(':checked') ) {
			curRsvYn = 'Y';
		}else {
			curRsvYn = 'N';
		}
		
		var saveMode = '';
		if ( CNSL213Flag == '' || CNSL213Flag == 'tmp' ) {
			saveMode = 'add';
    	}else {
    		saveMode = 'end';
    	}
		
		var rsvDd = $(".CNSL213 #rsvdtm").val().slice(0,10).replace(/\-/g, '');
		var rsvHour = $(".CNSL213 #rsvdtm").val().slice(11,13);;
		var rsvPt = $(".CNSL213 #rsvdtm").val().slice(14,16);
		var rsvDtm = $(".CNSL113 #rsvdtm").val();
		
		var CNSL213_custId = '';
		var CNSL213_custNm = '';
		if (counselMode == 'noCallCounselMode') {
			CNSL213_custNm = $('.CNSL213 #CNSL213T_inptCntcCustNm').val();
			CNSL213_custId = $('.CNSL213 #CNSL213T_inptCntcCustId').val();
		} else {
			if( custId == GLOBAL.session.user.tenantId + '_1' || custId == '' ) {
				CNSL213_custId = $(".CNSL213 #unknownCustomId").val().trim();
				CNSL213_custNm = $(".CNSL213 #unknownCustomNm").val().trim();
			}else {
				CNSL213_custId = $(".CNSL213 #unknownCustomId").val().trim();
				CNSL213_custNm = $(".CNSL213 #unknownCustomNm").val().trim();
			}
		}
		
		
		if ( CNSL213Flag == 'tmp') {
			tmpSaveYn = 'Y';
		} 
		
		var CNSL213_cntcChnlCustId = '';
		if ( $(".CNSL213 #cntcChnlCustId").length == 1 ) {
			CNSL213_cntcChnlCustId = $(".CNSL213 #cntcChnlCustId").val();
		} else {
			CNSL213_cntcChnlCustId = custId;
		}
		
		var cntcCnntDtm = '';
		var cntcEndDtm = '';
		if ( $(".CNSL213 #cntcPathMgntItemCd").data("kendoComboBox")._valueBeforeCascade == '16' ) {
			counselMode = 'noCallCounselMode';
			saveMode = 'noCallCounselMode';
			
			//kw---20240311 : BMH 무통화 추가 및 CNSL213T 상담저장 페이지 수정
//			cntcCnntDtm = $("#cntcInclYYYYMMDD").val() + $("#cntcInclHH").data("kendoComboBox")._valueBeforeCascade + $("#cntcInclMI").val() +'00';
//			cntcEndDtm = $("#cntcEndYYYYMMDD").val() + $("#cntcEndHH").data("kendoComboBox")._valueBeforeCascade + $("#cntcEndMI").val() +'00';
			
			if ( cntcCnntDtm.length != 14) {
				Utils.alert("상담시작시각을 정확하게 입력해주세요.");
				return;
			} 
			if ( cntcEndDtm.length != 14) {
				Utils.alert("상담종료시각을 정확하게 입력해주세요.");
				return;
			}
		}
		
		//kw---20240404 : 양지검진 - 상담이력 또는 콜 이벤트 관련 정보 인터페이스 넘기기
		//kw---20240404 : 접수번호가 있을 경우
		var rsvMemo = "";
		
		var chgCurRsv =   curRsvYn == init_curRsvYn ? 'N' : 'Y';  //예약 변경 여부 체크  처음에 예약하지않은 완료된 상담일 경우에도 예약을 할때 변경 할 수있게 체크를 해주어야함.
		if(chgCurRsv != "Y"){
			rsvDtm = "";
		}
		
		let curRsvYnBool ="Y";
		if(!Utils.isNull(CNSL213T_sel01Reuslt)){
			if(CNSL213T_sel01Reuslt.curRsvYn == 'Y' && Utils.isNull(CNSL213T_sel01Reuslt.rsvDd)){
				curRsvYnBool = "N";
				rsvDtm = CNSL213T_sel01Reuslt.cnslSumm; 
			}	
		}
		
		//kw---20240405 : 상담이력저장(2차) - 접촉 결과를 '미접촉 종결'로 저장을 하면 'null'로 저장되어 '자료형이 너무 긴자료를 담는다는 버그가 생김'
		var cntcRsltDtlsCd = $(".CNSL213 #cntcRsltDtlsCd").data("kendoComboBox")._valueBeforeCascade;
		if(Utils.isNull(cntcRsltDtlsCd)){
			cntcRsltDtlsCd = "";
		}
		
		//kw---20240404 : 양지검진 - 상담이력 또는 콜 이벤트 관련 정보 인터페이스 넘기기
		var cntcRsltCd = $(".CNSL213 #cntcRsltCd").data("kendoComboBox")._valueBeforeCascade;
		
		//kw---20240306 : 무통화상담 추가
		var CNSL213_data;
		if(counselMode == 'noCallCounselMode'){
			
			CNSL213_data = {
				"tenantId" : GLOBAL.session.user.tenantId,
				"usrId" : GLOBAL.session.user.usrId,
				"orgCd" : GLOBAL.session.user.orgCd,
				"unfyCntcHistNo" : cntcHistNo,
				"telCnslHistSeq" : $(".CNSL213 #telCnslHistSeq").val(),
				"curRsvYn" : curRsvYn,
				"rsvDd" : rsvDd,
				"rsvHour" : rsvHour,
				"rsvPt" : rsvPt,
				"cnslSumm" : rsvDtm,
				"cntcTelNo" : Utils.AddHypToNumber($(".CNSL213 #CNSL213T_inptCntcTelNo").val(), '2'),
				"cnslTypCd" : $(".CNSL213 #cnslTypCd").val(),
				"baseAnswCd" : $(".CNSL213 #baseAnswCd").val(),
				"cntcRsltCd" : $(".CNSL213 #cntcRsltCd").data("kendoComboBox")._valueBeforeCascade,
				"cntcRsltDtlsCd" : cntcRsltDtlsCd,
				"cnslTite" : $(".CNSL213 #cnslTite").val(),
				"cnslCtt" : $(".CNSL213 #cnslCtt").val(),
				"tmpSaveYn" : tmpSaveYn,
				"custId" : $("#CNSL213T_inptCntcCustId").val(),
				"cntcChnlCustId" : CNSL213_cntcChnlCustId,
				"custNm" : $('.CNSL213 #CNSL213T_inptCntcCustNm').val(),
				"counselMode" : counselMode,
				"saveMode" : saveMode,
				"cntcCnntDtm" : cntcCnntTime,
				"cntcEndDtm" : cntcEndTime,
				"iobDvCd" : $(".CNSL213 #iobDvCd").data("kendoComboBox").value(),
				"cntcChnlCd" : $(".CNSL213 #cntcPathMgntItemCd").data("kendoComboBox").value(),
				"cntcPathMgntItemCd" : $(".CNSL213 #cntcPathMgntItemCd").data("kendoComboBox").value(),
				"cntcPathCd" : $(".CNSL213 #cntcPathCd").data("kendoComboBox").value(),
				"cntcDt" : regDate,
				"cntcInclHourptsec" : cntcInclTime,
				"cntcCnntHourptsec"	: cntcCnntTime, 
				"cntcEndHourptsec"	: cntcEndTime,
				"rsvMemo"			: '',					//kw---20240404 : 양지검진으로 인한 예약시 접수번호 넣기
				"custAcpnNo"  : custAcpnNo,					//kw---20240507 : 양지검진 - 접수번호, 인터페이스 타입 저장
				"chgCurRsv"			: chgCurRsv,
			    "curRsvYnBool"		: curRsvYnBool,
			};
			
		} else {
			CNSL213_data = {
				"tenantId" : GLOBAL.session.user.tenantId,
				"usrId" : GLOBAL.session.user.usrId,
				"orgCd" : GLOBAL.session.user.orgCd,
				"unfyCntcHistNo" : cntcHistNo,
				"telCnslHistSeq" : $(".CNSL213 #telCnslHistSeq").val(),
				"curRsvYn" : curRsvYn,
				"rsvDd" : rsvDd,
				"rsvHour" : rsvHour,
				"rsvPt" : rsvPt,
				"cnslSumm" : rsvDtm,
				"cntcTelNo" : $(".CNSL213 #cntcTelNoVal").val(),
				"cnslTypCd" : $(".CNSL213 #cnslTypCd").val(),
				"baseAnswCd" : $(".CNSL213 #baseAnswCd").val(),
				"cntcRsltCd" : $(".CNSL213 #cntcRsltCd").data("kendoComboBox")._valueBeforeCascade,
				"cntcRsltDtlsCd" : cntcRsltDtlsCd,
				"cnslTite" : $(".CNSL213 #cnslTite").val(),
				"cnslCtt" : $(".CNSL213 #cnslCtt").val(),
				"tmpSaveYn" : tmpSaveYn,
				"custId" : CNSL213_custId,
				"cntcChnlCustId" : CNSL213_cntcChnlCustId,
				"custNm" : CNSL213_custNm,
				"counselMode" : counselMode,
				"saveMode" : saveMode,
				"cntcCnntDtm" : cntcCnntDtm,
				"cntcEndDtm" : cntcEndDtm,
				"rsvMemo"			: '',					//kw---20240404 : 양지검진으로 인한 예약시 접수번호 넣기
				"custAcpnNo"  : custAcpnNo,					//kw---20240507 : 양지검진 - 접수번호, 인터페이스 타입 저장
				"chgCurRsv"			: chgCurRsv,
			    "curRsvYnBool"		: curRsvYnBool,
			};
		}
		
		var CNSL213UPT01AlertMsg = '상담이력이 저장되었습니다.';
		if ( counselMode == 'add' ){
			CNSL213UPT01AlertMsg = '추가상담시 추가상담 가능합니다.';
		}
		
				
		//kw---20240801 : 이관 처리 추가 시작
		if($('#trclYn').is(':checked') == true){
			if ( $(".CNSL213 #dspsrId").val() == "" ) {
				Utils.alert("이관대상을 선택해주세요.", $(".CNSL213 #trclmnNm").focus());
				return;
			}

			transFunction();
		}
		
		//kw---20240404 : 양지검진 - 상담이력 또는 콜 이벤트 관련 정보 인터페이스 넘기기
    	if(softPhoneAfterEvent == true){	CNSL213T_fnCnslAfter(cntcRsltCd, curRsvYn); }
    	
		Utils.ajaxCall("/cnsl/CNSL213UPT01", JSON.stringify(CNSL213_data), function (result) {
	        Utils.alert(CNSL213UPT01AlertMsg, function () {
	        	
	        	if ( CNSL213Flag != 'tmp' && $(".CNSL213 #cntcPathMgntItemCd").data("kendoComboBox")._valueBeforeCascade == '10') {
	        		switch( $(".CNSL213 #cntcPathCd").data("kendoComboBox")._valueBeforeCascade ){
			            case '20':
			            	var CNSL202_rsltCd = $(".CNSL213 #cntcRsltCd").data("kendoComboBox")._valueBeforeCascade;
			            	var CNSL202_cabackProcStCd = $(".CNSL213 #cntcRsltDtlsCd").data("kendoComboBox")._valueBeforeCascade;
			            	if ( CNSL202_rsltCd == '1' && CNSL202_cabackProcStCd == '103' ) {
			            		CNSL202_cabackProcStCd = '141';
			            	} else if ( CNSL202_rsltCd == '1' && CNSL202_cabackProcStCd == '104' ) {
			            		CNSL202_cabackProcStCd = '142';
			            	} else {
			            		CNSL202_cabackProcStCd = '';
			            	}
			            	if ( CNSL202_cabackProcStCd != '' ) {
			            		var CNSL202_data = {
				            		"tenantId" : GLOBAL.session.user.tenantId,
				            		"usrId" : GLOBAL.session.user.usrId,
				    				"orgCd" : GLOBAL.session.user.orgCd,
									"ctiAgenId" : GLOBAL.session.user.ctiAgenId,
									"custNm" : CNSL213_custNm,
			        				"cabackProcStCd" : CNSL202_cabackProcStCd,
			        				"cabackAcpnNo" : $(".CNSL213 #chnlAcpnNo").val()
			        			};
				        		Utils.ajaxCall("/cnsl/CNSL202UPT01", JSON.stringify(CNSL202_data), function (result) {});
			            	} 
			            	break;
			            case '30':
							
							let rsvProcStCd = "2";
							if(curRsvYn == "Y"){
								rsvProcStCd = "1";	
							}
							
			            	var CNSL203_data = {
			            		"tenantId" : GLOBAL.session.user.tenantId,
			            		"usrId" : GLOBAL.session.user.usrId,
			    				"orgCd" : GLOBAL.session.user.orgCd,
		        				"procStCd" : rsvProcStCd,
		        				"unfyCntcHistNo" : cntcHistNo
		        			};
			            	
			        		Utils.ajaxCall("/cnsl/CNSL203UPT01", JSON.stringify(CNSL203_data), function (result) {});
			            	break;
			            case '31':
			            	var CNSL204_data = {
			            		"tenantId" : GLOBAL.session.user.tenantId,
			            		"usrId" : GLOBAL.session.user.usrId,
			    				"orgCd" : GLOBAL.session.user.orgCd,
		        				"procStCd" : "3",
		        				"unfyCntcHistNo" : cntcHistNo
		        			};
			        		Utils.ajaxCall("/cnsl/CNSL204UPT01", JSON.stringify(CNSL204_data), function (result) {});
			            	break;
			            default:
			            	break; 
	        		}
	        	}
	        	if ( saveMode == 'end' ) {
	        		counselAllInit();
	        	}
	        	
	        	if(window['CNSL200MTabClick']){
					CNSL200MTabClick("/bcs/cnsl/CNSL201T");
				}

				if(window['CNSL300MTabClick']){
					CNSL300MTabClick("/bcs/cnsl/CNSL201T");
				}


	        	if ( typeof(setCNSL201SEL01) != 'undefined' ) {
	        		setCNSL201SEL01();
	        	}
	        	if ( typeof(setCNSL202SEL01) != 'undefined' ) {
	        		setCNSL202SEL01();
	        	}
	        	if ( typeof(setCNSL203SEL01) != 'undefined' ) {
	        		setCNSL203SEL01();
	        	}
	        	if ( typeof(setCNSL204SEL01) != 'undefined' ) {
	        		setCNSL204SEL01();
	        	}

				//kw---20240920 : 시연용 - 전화시뮬레이션 추가 시작
				let mode = '';
				if(window['softPhoenMode']){
					if(softPhoenMode == 'factory-pick'){
						mode = 'factory-pick';
						softPhoenMode = '';
						$("#txtAgentState2").html('<span>로그아웃</span>');
					}
				}
				//kw---20240920 : 시연용 - 전화시뮬레이션 추가 끝
				if(mode != 'factory-pick') {	//kw---20240920 : 시연용 - 전화시뮬레이션 추가
					switch(CNSL213Flag){
						case '대기':
							$("#btnWait").click();
							break;
						case '휴식':
							$("#btnRest").click();
							break;
						case '업무':
							$("#btnTask").click();
							break;
						case '':
							if ( nowCallId != '' && counselMode != 'add' ) {
								cnslState = 'addMode';
								CNSL213BtnMode(cnslState);
							} else if ( nowCallId != '' && counselMode == 'add' )  {
								cnslState = 'Connected';
								cnslFirstConnected = true;
								loadCNSL201SEL01();
								setTimeout(function() {
									listViewCNSL201T_1.select(listViewCNSL201T_1.content.children().first());
								}, 500);
							} else {
								counselAllInit();
							}
							break;
					}
				}
	        });
	    });
	}
}


function transUser(data) {
	if ( data.length > 1 ) {
		Utils.alert("한명에게만 이관이 가능합니다.");
	}else {
		$(".CNSL213 #dspsrId").val(data[0].usrId);
		$(".CNSL213 #dspsrOrgCd").val(data[0].orgCd);
		$(".CNSL213 #trclmnNm").val(data[0].usrNm);
	}
}

function counselSet(data) {
	$(".CNSL213 #cnslTypCd").val(data.cnslTypCd);
	$(".CNSL213 #cnslTypNm").val(data.cnslTypLvlNm);
}

function transFunction(_alertYn) {
	if ( $(".CNSL213 #dspsrId").val() == "" ) {
		Utils.alert("이관대상을 선택해주세요.", $(".CNSL213 #trclmnNm").focus());
		return;
	} 
	
	var CNSL213_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"usrId" : GLOBAL.session.user.usrId,
		"orgCd" : GLOBAL.session.user.orgCd,
		"unfyCntcHistNo" : cntcHistNo,
		"telCnslHistSeq" : $(".CNSL213 #telCnslHistSeq").val(),
		"dspsrId" : $(".CNSL213 #dspsrId").val(),
		"dspsrOrgCd" : $(".CNSL213 #dspsrOrgCd").val(),
		"trclCtt" : $(".CNSL213 #trclCtt").val(),
		"custId" : custId
	};
	
	var trclUrl = "/cnsl/CNSL213INS02";
	if ( $(".CNSL213 #trclFlg").val() == "Y" ) {
		trclUrl = "/cnsl/CNSL213UPT05";
	}
	
	Utils.ajaxCall(trclUrl, JSON.stringify(CNSL213_data), function (result) {
		if(_alertYn == true){
			Utils.alert("이관되었습니다.", function () { 
				$(".CNSL213 #trclYn").prop('checked', true);
	        });
        }
    });
}

function CNSL213T_btnDiv(show) {
	if (show) {
		$("#CNSL213T_btnDiv").show()
	} else {
		$("#CNSL213T_btnDiv").hide()
	}
} 

function CNSL213_limitInput(event) {
	if (event.key >= 0 && event.key <= 9) {
		let input = event.target;
		if (input.value >= 59) {
			input.value = 59;
		}
		if (input.value < 0) {
			input.value = 00;
		}
	    return true;
	}
	return false;
}

//kw---20240306 : 무통화상담 추가
function noCallCounselMode(){
	counselInit();

	$("#callCntcCustInfo").hide();
	$("#callTime").hide();
	
	$("#noCallCntcCustInfo").show();
	$("#noCallTime").show();
	
	$(".CNSL213 #iobDvCd").data("kendoComboBox").enable(true);
	$('.CNSL213 #cntcPathMgntItemCd').data("kendoComboBox").enable(true);
    $('.CNSL213 #cntcPathCd').data("kendoComboBox").enable(true);
    
    $('.CNSL213 #cntcPathMgntItemCd').data("kendoComboBox").select(0);
    $('.CNSL213 #cntcPathCd').data("kendoComboBox").select(0);
    $(".CNSL213 #iobDvCd").data("kendoComboBox").select(0);
    
    $(".CNSL213 #CNSL213T_inptCntcCustId").val(custId);
	$(".CNSL213 #CNSL213T_inptCntcCustNm").val(custNm);
	$(".CNSL213 #CNSL213T_inptCntcTelNo").val(noCallCustTelNum);
	
	$('.CNSL213 #CNSL213T_regCntcInclHourptsec').data("kendoDateTimePicker").value(new Date());
	$('.CNSL213 #CNSL213T_regCntcEndHourptsec').data("kendoDateTimePicker").value(new Date());
	
//	$(".CNSL213 #CNSL213T_inptCntcCustId").prop("disabled", true);
	
//	$("#cntcCustId").arrt("disabled", true);
	
	counselMode = 'noCallCounselMode';
	cntcHistNo = '';
}

function CNSL213T_fnLayoutPopClose(){
	$("#callop_SearchConditionPop").removeClass("active");

	//kw---20240329 : 상담이력저장 - 상담유형 레이어 팝업이 활성화 됐을 때 다른 영역을 클릭하면 닫히도록 수정
	CNSL213T_srchCondPopActive = false;
	CNSL213T_srchCondPopVisible = false;
	CNSL213T_srchCondPopInit= false;
}

//kw---20240329 : 상담이력저장 - 상담유형 레이어 팝업이 활성화 됐을 때 다른 영역을 클릭하면 닫히도록 수정
function CNSL213T_fnLayoutPopOpen(){
	
	console.log("AWDAWDAWDAWDAWDAWD ::::: CNSL213T_fnLayoutPopOpen");
	
	if (!$("#callop_SearchConditionPop").hasClass('active')) {
		initCondition();
		$("#callop_SearchConditionPop").addClass("active");
		
		//kw---20240329 : 상담이력저장 - 상담유형 레이어 팝업이 활성화 됐을 때 다른 영역을 클릭하면 닫히도록 수정
		CNSL213T_srchCondPopActive = true;
	}
	
}

//kw---20240329 : 상담이력저장 - 상담유형 레이어 팝업이 활성화 됐을 때 다른 영역을 클릭하면 닫히도록 수정
//kw---20240418 : 상담유형 순서에 맞게 상담유형 표출
function initCondition(){
	
	if(!Utils.isNull($("#cnslTypCd").val())){
		
		CNSL213T_srchCondPopInit = true;
		
		cnslTypInit("L1");
		
		var CNSL213_data;
		var CNSL213_jsonStr;
		var lvArr = [];		// 변수를 담을 배열 - 조회할 때 부모 레벨을 따오기 위한 변수 (LV1은 전체 조회이므로 '' 으로 조회해야함, 
		var lvArr2 = [];	// 변수를 담을 배열 - 선택되어야 하는 코드의 값을 저장하기 위함
		var cnslTypCd = $("#cnslTypCd").val();
		var ajaxCompl = 0;
		var selectItemsIndex = [];	//kw---20240418 : 상담유형 순서에 맞게 상담유형 표출

		// 문자열에서 일부를 추출하여 변수에 할당
		for (var i = 0; i < cnslTypCd.length; i += 2) {
		    lvArr.push(cnslTypCd.substring(0, i));
		    lvArr2.push(cnslTypCd.substring(i, i+2));
		}
		
		for(var i=0; i<lvArr.length; i++){
			
			var hgrkCnslTypCd;
			var itemLvNum = "L" + (i+1);
			var itemNum = lvArr[i];
			var itemMaxLv = cnslTypCd.length / 2;
			
			//현재 아이템의 부모 아이템 코드 가져오기
			if(i == 0){
				hgrkCnslTypCd = "";
			} else {
				hgrkCnslTypCd = itemNum;
			}
			
			CNSL213_data = {
				"tenantId" : GLOBAL.session.user.tenantId,
				"prsLvlCd" : itemLvNum,
				"hgrkCnslTypCd" : hgrkCnslTypCd,
			};
			
			var CNSL213_jsonStr = JSON.stringify(CNSL213_data);
			
			Utils.ajaxCall("/cnsl/CNSL213SEL03", CNSL213_jsonStr, function(data){
				
				var counselTypeHtml = '';
				var resultList = JSON.parse(data.CNSL213SEL03);
				
				//kw---20240418 : 상담유형 순서에 맞게 상담유형 표출
				//srt_seq 순서로 정렬
				let counselTypeList = resultList.sort(function (a, b) {
		                let x = parseInt(a.srtSeq);
		                let y = parseInt(b.srtSeq);
		                if (x < y) {
		                    return -1;
		                }
		                if (x > y) {
		                    return 1;
		                }
		                return 0;
				});
				
				//kw---20240418 : 상담유형 순서에 맞게 상담유형 표출
				//현재 아이템이 리스트의 몇번째인지 구하기
				$.each(counselTypeList, function(index, item){
					 
					 var nowItemLv = (item.comCd.length / 2) - 1;
				 	 
					 var itemCd = '';
					
					 //현재 아이템의 코드를 구하기
					 for(var k=0; k<nowItemLv+1; k++){
						 itemCd += lvArr2[k];
					 }

					 if(item.comCd == itemCd){
						//selectItemsIndex 배열에 들어가는 순서가 달라 오브젝트러 넣기
						 var objIndex = {
								 "nowItemLv" 		: nowItemLv,
								 "itemCd"	: itemCd,
								 "index"	: index,
						 }
						 selectItemsIndex.push(objIndex);
					 }
				});
				
				//버튼 html 셋팅
				var counselprsLvlCd = '';
				for ( var k = 0; k < counselTypeList.length; k++ ) {
					if ( k == 0 ){
						counselprsLvlCd = counselTypeList[k].prsLvlCd;
					} 
					var counselTypeId = counselTypeList[k].prsLvlCd+'Depth_'+k;
					
					if ( counselTypeList[k].dataCreYn == 'Y' ) {
						counselTypeHtml+='<li><input type="radio" name="'+counselprsLvlCd+'" comCd="'+counselTypeList[k].comCd+'" comCdNm="'+counselTypeList[k].comCdNm+'" dataCreYn="'+counselTypeList[k].dataCreYn+'" id="'+counselTypeId+'"><label for="'+counselTypeId+'"><span class="posible">'+counselTypeList[k].comCdNm+'</span></label></li>'
					} else {
						counselTypeHtml+='<li><input type="radio" name="'+counselprsLvlCd+'" comCd="'+counselTypeList[k].comCd+'" comCdNm="'+counselTypeList[k].comCdNm+'" dataCreYn="'+counselTypeList[k].dataCreYn+'" id="'+counselTypeId+'"><label for="'+counselTypeId+'"><span>'+counselTypeList[k].comCdNm+'</span></label></li>'
					}
					
				}
				
				switch (counselprsLvlCd) {
				    case 'L1':
				    	$("#1Depth").html(counselTypeHtml);
				        break;
				    case 'L2':
				    	$("#2Depth").html(counselTypeHtml);
				        break;
				    case 'L3':
				    	$("#3Depth").html(counselTypeHtml);
				        break;
				    case 'L4':
				    	$("#4Depth").html(counselTypeHtml);
				    case 'L5':
				    	$("#5Depth").html(counselTypeHtml);
				        break;
				}
				
				++ajaxCompl;
				
				if(itemMaxLv == ajaxCompl){
					//현재 레벨만큼 for문 돌려주기
					for(var k=0; k<lvArr.length; k++){
						//아이템을 순서대로 클릭해주기 위함
						for(var j=0; j<selectItemsIndex.length; j++){
							if(k == selectItemsIndex[j].nowItemLv){
								$("#L" + (k+1) + "Depth_" + selectItemsIndex[j].index).click();
							}
						}
					}
					
					//현재 아이템까지만 버튼들을 보여주고 하위 아이템들은 숨기기
					for(var k=itemMaxLv; k<5; k++){
						$("#" + (k+1) + "Depth").html('');
					}
					
					CNSL213T_srchCondPopInit =false;
				}
			});
		}
	} else {
		setCNSL213SEL03("L1", "");
	}
}

//kw---20240404 : 양지검진 - 상담이력 또는 콜 이벤트 관련 정보 인터페이스 넘기기
function CNSL213T_fnCnslAfter(_cntcRsltCd, _curRsvYn){
	if ( window['fnCallResultAfterSend' + tabFrmId] ) {
		//fnCallResultAfterSendYJGB(_state, _rsvYn, _callState)
		//_state : 접촉결과, _rsvYn : 예약 여부, _callType : I/O 구분, _callState : 콜 상태
		new Function ( 'fnCallResultAfterSend' + tabFrmId + 
				'(\"' + _cntcRsltCd + 
				'\", \"' + _curRsvYn +
				'\", \"' + "" +
				'\", \"' + "" + 
				'\")')();
	}
}