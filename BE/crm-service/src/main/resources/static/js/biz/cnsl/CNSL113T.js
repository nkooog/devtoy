
var CNSL113ComboList;

//kw---20240329 : 상담이력저장 - 상담유형 레이어 팝업이 활성화 됐을 때 다른 영역을 클릭하면 닫히도록 수정
var CNSL113T_srchCondPopActive = false;
var CNSL113T_srchCondPopVisible = false;
var CNSL113T_srchCondPopInit = false;
var init_curRsvYn = '';
var CNSL113T_sel01Reuslt;
$(document).ready(function () {
	
//	$("#CNSL113T_loadingLayer").show();
//	$('.modalWrap').removeClass('active');
	
	//kw---20240306 : 무통화상담 추가 시작
	$("#CNSL113T_regCntcInclHourptsec").kendoDateTimePicker({
		value: new Date(),  
		culture: "ko-KR",   
		footer: false, 
		format: "yyyy-MM-dd HH:mm", 
	});
	
	$("#CNSL113T_regCntcEndHourptsec").kendoDateTimePicker({
		value: new Date(),  
		culture: "ko-KR",   
		footer: false, 
		format: "yyyy-MM-dd HH:mm", 
	});
	//kw---20240306 : 무통화상담 추가 끝
	
	$(document).on('dblclick', '#callop_SearchConditionPop .posible', function(e) {
		CNSL113T_fnLayoutPopClose();
	});
	
	$("#callop_SearchConditionPop" ).keyup(function(e) {
		if(e.keyCode == "27"){
			CNSL113T_fnLayoutPopClose();
		}
	});
	

	 $(".CNSL113 #callop_open").click(function () {
		 CNSL113T_fnLayoutPopOpen();
	 });
	 
	
	$(".CNSL113 #rsvdtm").kendoDateTimePicker({
		value: new Date(),  
		culture: "ko-KR",   
		footer: false, 
		format: "yyyy-MM-dd HH:mm", 
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
    	url         : GLOBAL.contextPath + '/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList113,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
    heightResizeCNSL();
    setTimeout(function() {
    	setCNSL113SEL01();
	}, 100);
    
   
    
    $(".CNSL113 #cnslTypL1,.CNSL113 #cnslTypL2,.CNSL113 #cnslTypL3,.CNSL113 #cnslTypL4,.CNSL113 #cnslTypL5").click(function () {
    	CNSL113T_fnLayoutPopOpen();
	});
    
	$("#callop_SearchConditionPopClose").click(function () {
		CNSL113T_fnLayoutPopClose();
	});
	
	$(document).off("click.SearchConditionPop");			//kw---20240329 : 상담이력저장 - F5키를 이용하여 새로고침 하면 밑에 click 이벤트가 중복으로 생성되는걸 방지
	$(document).on("click.SearchConditionPop", "#callop_SearchConditionPop li", function() {
		//kw---20240329 : 상담이력저장 - 상담유형 레이어 팝업이 활성화 됐을 때 다른 영역을 클릭하면 닫히도록 수정
		if(CNSL113T_srchCondPopInit == true){
			return;
		}
		var prsLvlCd = $(this).find("input").attr("name");
		var hgrkCnslTypCd = $(this).find("input").attr("comCd");
		var dataCreYn = $(this).find("input").attr("dataCreYn");
		
		if ( dataCreYn == "Y" ) {
			$(".cnslTypList").val('');
			$(".CNSL113 #cnslTypCd").val(hgrkCnslTypCd);
			$('#callop_SearchConditionPop input').each(function() {
				var lvlCd = $(this).attr("name");
				if($(this).is(':checked')) {
					$("#cnslTyp" + lvlCd).val($(this).attr("comCdNm"));
				}
			});
		}else {
			$("#cnslTypCd").val('');
			$(".cnslTypList").val('');
		}
		switch (prsLvlCd) {
		    case 'L1':
		    	setCNSL113SEL03('L2',hgrkCnslTypCd);
		        break;
		    case 'L2':
		    	setCNSL113SEL03('L3',hgrkCnslTypCd);
		        break;
		    case 'L3':
		    	setCNSL113SEL03('L4',hgrkCnslTypCd);
		        break;
		    case 'L4':
		    	setCNSL113SEL03('L5',hgrkCnslTypCd);
		        break;
		    case 'L5':
		        break;
		}
	});
	CNSL113BtnMode(cnslState);

	//예약일자 input readonly 처리
	document.getElementById('rsvdtm').readOnly = true;
});

//kw---20240329 : 상담이력저장 - 상담유형 레이어 팝업이 활성화 됐을 때 다른 영역을 클릭하면 닫히도록 수정
$(document).off("click.CNSL113T_searchCondition");	//kw---20240329 : 상담이력저장 - F5키를 이용하여 새로고침 하면 밑에 click 이벤트가 중복으로 생성되는걸 방지
$(document).on("click.CNSL113T_searchCondition", function(event) {
	if(CNSL113T_srchCondPopActive == true){
		if(CNSL113T_srchCondPopVisible == true){
			var targetElement = $(event.target); // 클릭된 요소 가져오기
			   
			var callop_SearchConditionPop = $("#callop_tooltip");
			
			if (!targetElement.is(callop_SearchConditionPop) && !callop_SearchConditionPop.has(targetElement).length) {
				if ($("#callop_SearchConditionPop").hasClass('active')) {
					CNSL113T_fnLayoutPopClose();
				}
			}
		} else {
			CNSL113T_srchCondPopVisible = true;
		}
	}
});

//kw---20240329 : 상담이력 저장 - esc 키를 눌러서 레이어팝업창 닫기
$(document).off("keydown.CNSL113T_searchCondition");		//kw---20240329 : 상담이력저장 - F5키를 이용하여 새로고침 하면 밑에 click 이벤트가 중복으로 생성되는걸 방지
$(document).on("keydown.CNSL113T_searchCondition", function(event) {
    if (event.key === "Escape") {
    	if ($("#callop_SearchConditionPop").hasClass('active')) {
    		CNSL113T_fnLayoutPopClose();	
    	}
    }
});
function CNSL113BtnMode(btnMode) {
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

function resultComboList113(data){
	

	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	CNSL113ComboList = jsonDecode;
	Utils.setKendoComboBox(jsonDecode, "", '.CNSL113 #cntcRsltDtlsCd', '', false) ;
	
	let dataSource = [];
	dataSource = dataSource.concat(jsonDecode.filter(function (code) {
        if (code.mgntItemCd == "C0143") {
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
    
    let kendoComboBox = $('.CNSL113 #cntcRsltCd').kendoComboBox({
        dataSource: dataSource,
        dataTextField: "text",
        dataValueField: "value",
        clearButton: false,
        autoWidth: true,
        change: function(e) {
            let value = this.value();

			//kw---20241023 : 콜접촉 결과 선택 시 상담결과 콤보박스 셋팅해주는 부분 수정
			//kw---20241023 : 1. 접촉성공(콜백) 항목 선택 시 상담결과 항목 초기화 되도록 추가
			//kw---20241023 : 2. 공통코드의 항목이 없을 경우에도 초기화 되도록 추가
			let mgntItemCd = '';

        	switch (value) {
				case "1":
					let CNSL113_cntcPathCd = $(".CNSL113 #cntcPathCd").val();
					if ( CNSL113_cntcPathCd == '20' ) {
						mgntItemCd = "C0314";
					} else {
						mgntItemCd = "C0308";
					}
					break;
	    	    case "2":
					mgntItemCd = "C0144";
	    	        break;
	    	    case "9":
					mgntItemCd = "C0145";
	    	    	break;
        	}

			if(!Utils.isNull(mgntItemCd) && CNSl113T_fnCommCdHasYn(mgntItemCd)){
				Utils.setKendoComboBox(jsonDecode, mgntItemCd, '.CNSL113 #cntcRsltDtlsCd', '', false) ;
			} else {
				CNSL113T_fnCnslRsltDtlComboEmpty();
			}
			//kw---20241023 : 끝

        }
    }).data("kendoComboBox");
    kendoComboBox.input.attr("readonly", true);
    
    let kendoComboBox2 = $('.CNSL113 .C0235').kendoComboBox({
        dataSource: dataSource2,
        dataTextField: "text",
        dataValueField: "value",
        clearButton: false,
        autoWidth: true,
        change: function(e) {
            let value = this.value();
            var CNSL113_data = {
            		"tenantId" : GLOBAL.session.user.tenantId,
            		"baseAnswCd" : value
            };
        	Utils.ajaxCall("/cnsl/CNSL113SEL02", JSON.stringify(CNSL113_data), function (result) {
        		if ( result.CNSL113SEL02 != null ) {
        			let CNSL113SEL02_index = result.CNSL113SEL02;
        			$(".CNSL113 #cnslTypCd").val(CNSL113SEL02_index.cnslTypCd);
        			var counselcnslTypCdList = JSON.parse(result.CNSL113SEL04);
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
    
    
    //kw---20240306 : 무통화상담 추가
    //콜 유형 콤보박스 추가
    Utils.setKendoComboBox(jsonDecode, "C0131", '#CNSL113T_comboCntcPathNm',"",false);
    
    Utils.setKendoComboBox(jsonDecode, "C0129", '#CNSL113T_comboIobDvCd', "", false) ;
    
//    let kendoComboIovDvCd = $('#CNSL113T_comboIobDvCd').kendoComboBox({
//        dataSource: dataSourceIobDvCd,
//        dataTextField: "text",
//        dataValueField: "value",
//        clearButton: false,
//        index: 0, // 초기 선택 값 설정
//    }).data("kendoComboBox");
    
}


function setCNSL113SEL01() {
	if ( !(cntcHistNo == undefined || cntcHistNo == '' ) ) {
		var CNSL113_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"unfyCntcHistNo" : cntcHistNo,
			"telCnslHistSeq" : cnslHistSeq
		};
		var CNSL113_jsonStr = JSON.stringify(CNSL113_data);
		Utils.ajaxCall("/cnsl/CNSL113SEL01", CNSL113_jsonStr, CNSL113SEL01);
	} else {
		counselInit();
	}
}



function setCNSL113SEL03(prsLvlCd, hgrkCnslTypCd) {

	cnslTypInit(prsLvlCd);
	var CNSL113_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"prsLvlCd" : prsLvlCd,
		"hgrkCnslTypCd" : hgrkCnslTypCd
	};
	var CNSL113_jsonStr = JSON.stringify(CNSL113_data);
	Utils.ajaxCall("/cnsl/CNSL113SEL03", CNSL113_jsonStr, CNSL113SEL03);
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

function CNSL113SEL01(data) {
	var counselInfo = JSON.parse(data.CNSL113SEL01);
	
	CNSL113T_sel01Reuslt = counselInfo;
	
	var cntcInclHourptsec = counselInfo.cntcInclHourptsec;
	var cntcEndHourptsec = counselInfo.cntcEndHourptsec;
	var cntcInclHourptsecTxt = '-';
	var cntcEndHourptsecTxt = '-';
	
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
	
	//kw---20250108 : 전화끊고 상담완료가 안됐을 경우 다른 상담이력이 안보이는거 수정 
	// if ( cnslState == 'Disconnect' && $(".CNSL113 #telCnslHistSeq").val() != '' ) {
	// 	$(".CNSL113 #cntcEndHourptsec").text(cntcEndHourptsecTxt);
	// 	return;
	// }
	
	counselInit();
	
	var counselcnslTypCdList = JSON.parse(data.CNSL113SEL04);
	
	//kw---20240607 : 예약시간 넣기
	var resvTime = '';
	
	if(counselInfo.curRsvYn == 'Y'){
		if(!Utils.isNull(counselInfo.rsvDd)){
			resvTime = counselInfo.rsvDd.substr(0,4) + "-" + counselInfo.rsvDd.substr(4,2) + "-" + counselInfo.rsvDd.substr(6,2) + " " + counselInfo.rsvHour + ":" + counselInfo.rsvPt + ":00";
			var CNSL113_rsvdtm = $(".CNSL113 #rsvdtm").data("kendoDateTimePicker");
			CNSL113_rsvdtm.value(resvTime);
		}
		else if(!Utils.isNull(counselInfo.cnslSumm)){
			var CNSL113_rsvdtm = $(".CNSL113 #rsvdtm").data("kendoDateTimePicker");
			CNSL113_rsvdtm.value(counselInfo.cnslSumm);
		}
	}
	
	
	
	$(".CNSL113 #cntcPathNm").text(counselInfo.cntcPathNm);
	$(".CNSL113 #cntcPathCd").val(counselInfo.cntcPathCd);
	$(".CNSL113 #chnlAcpnNo").val(counselInfo.chnlAcpnNo);
	var iobDvCd = counselInfo.iobDvCd;
	if (iobDvCd == "1") {
		iobDvCd = "IN";
	}else if(iobDvCd == "2") {
		iobDvCd = "OUT";
	}
	$(".CNSL113 #iobDvCd").text(iobDvCd);
	
	var CNSL113_custNm = '';
	if( counselInfo.cntcCustNm == '' ) {
		CNSL113_custNm = custNm;
	}else {
		CNSL113_custNm = counselInfo.cntcCustNm;
	}
	
	if( custId == GLOBAL.session.user.tenantId + '_1' || custId == '' ) {
		$(".CNSL113 #cntcCustNm").html('<input id="unknownCustomNm" class="k-input" value="'+CNSL113_custNm+'"/>');
	}else {
		$(".CNSL113 #cntcCustNm").html(CNSL113_custNm);
	}
	
	$(".CNSL113 #cntcTelNo").text(counselInfo.cntcTelNo);	
	
	
	$(".CNSL113 #cntcInclHourptsec").text(cntcInclHourptsecTxt);
	$(".CNSL113 #cntcEndHourptsec").text(cntcEndHourptsecTxt);
	
	//kw---20240422 : TAB 재 로딩시 스크립트 오류 수정
	var CNSL113_baseAnswCd = $(".CNSL113 #baseAnswCd").data("kendoComboBox");
	if(!Utils.isNull(CNSL113_baseAnswCd)){
		CNSL113_baseAnswCd.value(counselInfo.baseAnswCd);
	}
	
	//kw---20240422 : TAB 재 로딩시 스크립트 오류 수정
	var CNSL113_cntcRsltCd = $(".CNSL113 #cntcRsltCd").data("kendoComboBox");
	if(!Utils.isNull(CNSL113_cntcRsltCd)){
		CNSL113_cntcRsltCd.value(counselInfo.cntcRsltCd);
	}
	
	switch (counselInfo.cntcRsltCd) {
		case "1":
			let CNSL113_cntcPathCd = $(".CNSL113 #cntcPathCd").val();
			if ( CNSL113_cntcPathCd == '20' ) {
				Utils.setKendoComboBox(CNSL113ComboList, "C0314", '.CNSL113 #cntcRsltDtlsCd', counselInfo.cntcRsltDtlsCd, false) ;
			} else {
				Utils.setKendoComboBox(CNSL113ComboList, "C0308", '.CNSL113 #cntcRsltDtlsCd', counselInfo.cntcRsltDtlsCd, false);
			}
			break;
	    case "2":
	    	Utils.setKendoComboBox(CNSL113ComboList, "C0144", '.CNSL113 #cntcRsltDtlsCd', counselInfo.cntcRsltDtlsCd, false) ;
	        break;
	    case "9":
	    	Utils.setKendoComboBox(CNSL113ComboList, "C0145", '.CNSL113 #cntcRsltDtlsCd', counselInfo.cntcRsltDtlsCd, false) ;
	        break;
	}
	
	$(".CNSL113 #cnslTypCd").val(counselInfo.cnslTypCd);
	$(".CNSL113 #cnslTypNm").val(counselInfo.cnslTypNm);

	$(".CNSL113 #cnslTite").val(counselInfo.cnslTite);
	$(".CNSL113 #cnslCtt").val(counselInfo.cnslCtt);
	$(".CNSL113 #telCnslHistSeq").val(counselInfo.telCnslHistSeq);
	
	
	if ( counselInfo.curRsvYn == 'Y') {
		$(".CNSL113 #curRsvYn").prop('checked', true);
		$(".CNSL113 #curRsvYn").prop('disabled', true);
		init_curRsvYn = 'Y';
		
		//예약 된걸 다시 못바꾸게 하기 위함
		var CNSL113_rsvdtm = $(".CNSL113 #rsvdtm").data("kendoDateTimePicker");
		var wrapper = CNSL113_rsvdtm.wrapper;

        // 달력 버튼 비활성화
        wrapper.find(".k-i-calendar").closest("button").prop("disabled", true);

        // 시간 버튼 비활성화
        wrapper.find(".k-i-clock").closest("button").prop("disabled", true);
        
	}else {
		$(".CNSL113 #curRsvYn").prop('checked', false);
		$(".CNSL113 #curRsvYn").prop('disabled', false);
		init_curRsvYn = 'N';
		
		//예약 된걸 다시 못바꾸게 하기 위함
		var CNSL113_rsvdtm = $(".CNSL113 #rsvdtm").data("kendoDateTimePicker");
		var wrapper = CNSL113_rsvdtm.wrapper;

        // 달력 버튼 비활성화
        wrapper.find(".k-i-calendar").closest("button").prop("disabled", false);

        // 시간 버튼 비활성화
        wrapper.find(".k-i-clock").closest("button").prop("disabled", false);
	}
	
	if ( counselInfo.trclYn == 'Y') {
		$(".CNSL113 #trclYn").prop('checked', true);
		$(".CNSL113 #trclYn").prop('disabled', true);
		$(".CNSL113 #CNSL113T_btnDspsrCustSearch").prop('disabled', true);

		//CNSL113T_btnDiv(false);
	}else {
		$(".CNSL113 #trclYn").prop('checked', false);

		$(".CNSL113 #trclYn").prop('disabled', false);
		$(".CNSL113 #CNSL113T_btnDspsrCustSearch").prop('disabled', false);
	}
	$(".CNSL113 #trclFlg").val(counselInfo.trclYn);
	$(".CNSL113 #dspsrId").val(counselInfo.rcvinCnslrId);
	$(".CNSL113 #trclmnNm").val(counselInfo.rcvinCnslrNm);
	$(".CNSL113 #dspsrOrgCd").val(counselInfo.rcvinCnslrBlngOrgCd);
	$(".CNSL113 #trclCtt").val(counselInfo.trclCtt);
	if ( counselcnslTypCdList != null ) {
		$("#cnslTypL1").val(counselcnslTypCdList.lvl1cd);
		$("#cnslTypL2").val(counselcnslTypCdList.lvl2cd);
		$("#cnslTypL3").val(counselcnslTypCdList.lvl3cd);
		$("#cnslTypL4").val(counselcnslTypCdList.lvl4cd);
		$("#cnslTypL5").val(counselcnslTypCdList.lvl5cd);
	}
}


function CNSL113SEL03(data) {
	var counselTypeHtml = '';
	var resultList = JSON.parse(data.CNSL113SEL03);
	
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
	
	//kw---20240306 : 무통화상담 추가
	$("#callPathType").show();
	$("#callCntcCustInfo").show();
	$("#callTime").show();
	$("#noCallPathType").hide();
	$("#noCallCntcCustInfo").hide();
	$("#noCallTime").hide();
	
	$(".CNSL113 #cntcPathCd").val('');
	$(".CNSL113 #cntcPathNm").text('');
	$(".CNSL113 #chnlAcpnNo").val('');
	$(".CNSL113 #iobDvCd").text('');
	$(".CNSL113 #cntcCustNm").html('');
	$(".CNSL113 #cntcTelNo").text('');
	$(".CNSL113 #cntcInclHourptsec").text('');
	$(".CNSL113 #cntcEndHourptsec").text('');
	$(".CNSL113 #cnslTypCd").val('');
	$(".CNSL113 #cnslTypNm").val('');
	$(".cnslTypList").val('');
	//kw---20240422 : TAB 재 로딩시 스크립트 오류 수정
	var CNSL113_baseAnswCd = $(".CNSL113 #baseAnswCd").data("kendoComboBox");
	if(!Utils.isNull(CNSL113_baseAnswCd)){
		CNSL113_baseAnswCd.value('');
	}
	//kw---20240422 : TAB 재 로딩시 스크립트 오류 수정
	var CNSL113_cntcRsltCd = $(".CNSL113 #cntcRsltCd").data("kendoComboBox");
	if(!Utils.isNull(CNSL113_cntcRsltCd)){
		CNSL113_cntcRsltCd.value('');
	}
	//kw---20240422 : TAB 재 로딩시 스크립트 오류 수정
	var CNSL113_cntcRsltDtlsCd = $(".CNSL113 #cntcRsltDtlsCd").data("kendoComboBox");
	if(!Utils.isNull(CNSL113_cntcRsltDtlsCd)){
		CNSL113_cntcRsltDtlsCd.value('');
	}
	$(".CNSL113 #cnslTite").val('');
	$(".CNSL113 #cnslCtt").val('');
	$(".CNSL113 #telCnslHistSeq").val('');
	$(".CNSL113 #curRsvYn").prop('checked', false);
	$(".CNSL113 #trclYn").prop('checked', false);
	$(".CNSL113 #trclFlg").val('');
	$(".CNSL113 #dspsrId").val('');
	$(".CNSL113 #trclmnNm").val('');
	$(".CNSL113 #dspsrOrgCd").val('');
	$(".CNSL113 #trclCtt").val('');
	counselMode = '';
	
	//kw---20240307 : 예약시간 현재 시간으로 초기화 해주기
	//kw---20240422 : TAB 재 로딩시 스크립트 오류 수정
	var CNSL113_rsvdtm = $(".CNSL113 #rsvdtm").data("kendoDateTimePicker"); 
	if(!Utils.isNull(CNSL113_rsvdtm)){
		CNSL113_rsvdtm.value(new Date());
	}
}


function counseladdMode() {
	counselMode = 'add';
	CNSL113BtnMode(cnslState);
	CNSL113UPT01('');
}

function openPopSYSM212P() {
	Utils.setCallbackFunction("transUser", transUser);
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM212P", "SYSM212P" , 400, 810,  {callbackKey: "transUser"});
}

function openPopSYSM281P() {
	Utils.setCallbackFunction("counselSet", counselSet);
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM281P", "SYSM281P" , 1200, 520,  {cnslTypCd:$(".CNSL113 #cnslTyp").val(), callbackKey: "counselSet"});
}

function CNSL113UPT01(CNSL113Flag) {	

	//kw---20240306 : 무통화상담 추가
	if ( cntcHistNo == undefined || cntcHistNo == '') {
		Utils.alert("통화이력을 선택해 주세요.");
		return;
	}

	if ( custId == undefined || custId == '') {
		Utils.alert("상담대상을 선택해주세요.");
		return;
	}
	
	// 필수값 체크
	if ( $(".CNSL113 #cnslTypCd").val() == '' && CNSL113Flag != 'tmp' ) {
		Utils.alert("상담유형은 필수값입니다.", $(".CNSL113 #cnslTypCd").focus());
		return;
	}
	
	
	//kw---20240306 : 무통화상담 추가
	if ( cntcHistNo == undefined || cntcHistNo == '') {
		
		var CNSL113_data = {
				"tenantId" : GLOBAL.session.user.tenantId,
				"usrId" : GLOBAL.session.user.usrId,
				"orgCd" : GLOBAL.session.user.orgCd
			};
    	Utils.ajaxCall("/cnsl/CNSL100INS03", JSON.stringify(CNSL113_data) , function (result) {  
    		cntcHistNo = result.result; 
    		
    		$(".CNSL113 #telCnslHistSeq").val('1');
    		CNSL113UPT01(CNSL113Flag);
    	});
	} else {
		var tmpSaveYn = 'N';
		var curRsvYn = '';
		if ( $(".CNSL113 #curRsvYn").is(':checked') ) {
			curRsvYn = 'Y';
		}else {
			curRsvYn = 'N';
		}
		
		var saveMode = '';
		if ( CNSL113Flag == '' || CNSL113Flag == 'tmp' ) {
			saveMode = 'add';
    	}else {
    		saveMode = 'end';
    	}
		
		var rsvDd = $(".CNSL113 #rsvdtm").val().slice(0,10).replace(/\-/g, '');
		var rsvHour = $(".CNSL113 #rsvdtm").val().slice(11,13);;
		var rsvPt = $(".CNSL113 #rsvdtm").val().slice(14,16);
		var rsvDtm = $(".CNSL113 #rsvdtm").val();
		
		
		var CNSL113_custNm = '';
		
		//kw---20240306 : 무통화상담 추가
		if (counselMode == 'noCallCounselMode') {
			CNSL113_custNm = $('.CNSL113 #CNSL113T_inptCntcCustNm').val();
		} else {
			if( custId == GLOBAL.session.user.tenantId + '_1' || custId == '' ) {
				CNSL113_custNm = $(".CNSL113 #unknownCustomNm").val().trim();
			}else {
				CNSL113_custNm = $(".CNSL113 #cntcCustNm").html().trim();
			}
		}
		
		
		if ( CNSL113Flag == 'tmp') {
			tmpSaveYn = 'Y';
		}


		//kw---20241023 : 상담이력저장(2차) - 접촉 결과를 '미접촉 종결'로 저장을 하면 'null'로 저장되어 '자료형이 너무 긴자료를 담는다는 버그가 생김'
		var cntcRsltDtlsCd = $(".CNSL113 #cntcRsltDtlsCd").data("kendoComboBox")._valueBeforeCascade;
		if(Utils.isNull(cntcRsltDtlsCd)){
			cntcRsltDtlsCd = "";
		}

		let cnslCtt = $(".CNSL113 #cnslCtt").val();

		var chgCurRsv =   curRsvYn == init_curRsvYn ? 'N' : 'Y';  //예약 변경 여부 체크  처음에 예약하지않은 완료된 상담일 경우에도 예약을 할때 변경 할 수있게 체크를 해주어야함.
		
		if(chgCurRsv != "Y"){
			rsvDtm = "";
		}
		
		let curRsvYnBool ="Y";
		if(!Utils.isNull(CNSL113T_sel01Reuslt)){
			if(CNSL113T_sel01Reuslt.curRsvYn == 'Y' && Utils.isNull(CNSL113T_sel01Reuslt.rsvDd)){
				curRsvYnBool = "N";
				rsvDtm = CNSL113T_sel01Reuslt.cnslSumm; 
			}	
		}
		
		
		//kw---20240306 : 무통화상담 추가
		var CNSL113_data;
		if(counselMode == 'noCallCounselMode'){
			var dateString;
			var cntcInclTime, cntcCnntTime, cntcEndTime;
			var regDate;
			
			dateString = $('.CNSL113 #CNSL113T_regCntcInclHourptsec').val();
			cntcInclTime = dateString.replace(/[-: ]/g, "") + "00";
			cntcCnntTime = dateString.replace(/[-: ]/g, "") + "00";
			
			dateString = $('.CNSL113 #CNSL113T_regCntcEndHourptsec').val();
			cntcEndTime = dateString.replace(/[-: ]/g, "") + "00";
			regDate = dateString.substring(0, 4) + dateString.substring(5, 7) + dateString.substring(8, 10);



			CNSL113_data = {
					"tenantId" 			: GLOBAL.session.user.tenantId,
					"usrId" 			: GLOBAL.session.user.usrId,
					"orgCd" 			: GLOBAL.session.user.orgCd,
					"unfyCntcHistNo" 	: cntcHistNo,
					"telCnslHistSeq" 	: $(".CNSL113 #telCnslHistSeq").val(),
					"curRsvYn" 			: curRsvYn,
					"rsvDd" 			: rsvDd,
					"rsvHour" 			: rsvHour,
					"rsvPt" 			: rsvPt,
					"cnslSumm"			: rsvDtm,
					"cntcTelNo" 		: Utils.AddHypToNumber($(".CNSL113 #CNSL113T_inptCntcTelNo").val(), '2'),
					"cnslTypCd" 		: $(".CNSL113 #cnslTypCd").val(),
					"baseAnswCd" 		: $(".CNSL113 #baseAnswCd").val(),
					"cntcRsltCd" 		: $(".CNSL113 #cntcRsltCd").data("kendoComboBox")._valueBeforeCascade,
					"cntcRsltDtlsCd" 	: cntcRsltDtlsCd,
					"cnslTite" 			: $(".CNSL113 #cnslTite").val(),
					"cnslCtt" 			: $(".CNSL113 #cnslCtt").val(),
					"tmpSaveYn" 		: tmpSaveYn,
					"custId" 			: custId,
					"custNm" 			: $('.CNSL113 #CNSL113T_inptCntcCustNm').val(),
					"counselMode" 		: counselMode,
					"saveMode" 			: saveMode,
					"iobDvCd"			: $("#CNSL113T_comboIobDvCd").data("kendoComboBox").value(),
					"cntcPathCd"		: $("#CNSL113T_comboCntcPathNm").data("kendoComboBox").value(),
					"cntcDt"			: regDate,
					"cntcInclHourptsec" : cntcInclTime,
					"cntcCnntHourptsec"	: cntcCnntTime, 
					"cntcEndHourptsec"	: cntcEndTime,
				    "chgCurRsv"			: chgCurRsv,
				    "curRsvYnBool"		: curRsvYnBool,
				};
		} else {
			CNSL113_data = {
					"tenantId" : GLOBAL.session.user.tenantId,
					"usrId" : GLOBAL.session.user.usrId,
					"orgCd" : GLOBAL.session.user.orgCd,
					"unfyCntcHistNo" : cntcHistNo,
					"telCnslHistSeq" : $(".CNSL113 #telCnslHistSeq").val(),
					"curRsvYn" : curRsvYn,
					"rsvDd" : rsvDd,
					"rsvHour" : rsvHour,
					"rsvPt" : rsvPt,
					"cnslSumm"			: rsvDtm,
					"cntcTelNo" : $(".CNSL113 #cntcTelNo").text(),
					"cnslTypCd" : $(".CNSL113 #cnslTypCd").val(),
					"baseAnswCd" : $(".CNSL113 #baseAnswCd").val(),
					"cntcRsltCd" : $(".CNSL113 #cntcRsltCd").data("kendoComboBox")._valueBeforeCascade,
					"cntcRsltDtlsCd" : cntcRsltDtlsCd,
					"cnslTite" 	: $(".CNSL113 #cnslTite").val(),
					"cnslCtt" 	: $(".CNSL113 #cnslCtt").val(),
					"tmpSaveYn" : tmpSaveYn,
					"custId" : custId,
					"custNm" : CNSL113_custNm,
					"counselMode" : counselMode,
					"saveMode" : saveMode,
				    "chgCurRsv"	: chgCurRsv,
				    "curRsvYnBool"		: curRsvYnBool,
				};
		}
		
		//kw---20240801 : 이관 처리 추가 시작
		if($('#trclYn').is(':checked') == true){
			if ( $(".CNSL113 #dspsrId").val() == "" ) {
				Utils.alert("이관대상을 선택해주세요.", $(".CNSL113 #trclmnNm").focus());
				return;
			}

			transFunction();
		}
		//kw---20240801 : 이관 처리 추가 시작
		
		var CNSL113UPT01AlertMsg = '상담이력이 저장되었습니다.';
		if ( counselMode == 'add' ){
			CNSL113UPT01AlertMsg = '추가상담시 추가상담 가능합니다.';
		}
		Utils.ajaxCall("/cnsl/CNSL113UPT01", JSON.stringify(CNSL113_data), function (result) {
	        Utils.alert(CNSL113UPT01AlertMsg, function () {
	        	if ( CNSL113Flag != 'tmp' ) {
	        		switch( $(".CNSL113 #cntcPathCd").val() ){
			            case '20':
							var CNSL102_rsltCd = $(".CNSL113 #cntcRsltCd").data("kendoComboBox")._valueBeforeCascade;
							var CNSL102_cabackProcStCd = $(".CNSL113 #cntcRsltDtlsCd").data("kendoComboBox")._valueBeforeCascade;
							if ( CNSL102_rsltCd == '1' && CNSL102_cabackProcStCd == '103' ) {
								CNSL102_cabackProcStCd = '141';
							} else if ( CNSL102_rsltCd == '1' && CNSL102_cabackProcStCd == '105' ) {
								CNSL102_cabackProcStCd = '141';
							} else if ( CNSL102_rsltCd == '1' && CNSL102_cabackProcStCd == '104' ) {
								CNSL102_cabackProcStCd = '142';
							} else if ( CNSL102_rsltCd == '2') {
								CNSL102_cabackProcStCd = '142';
							} else {
								CNSL102_cabackProcStCd = '141';
							}
							if ( CNSL102_cabackProcStCd != '' ) {
								var CNSL102_data = {
									"tenantId": GLOBAL.session.user.tenantId,
									"usrId": GLOBAL.session.user.usrId,
									"orgCd": GLOBAL.session.user.orgCd,
									"ctiAgenId": GLOBAL.session.user.ctiAgenId,
									"custNm": CNSL113_custNm,
									"cabackProcStCd": CNSL102_cabackProcStCd,
									"cabackAcpnNo": $(".CNSL113 #chnlAcpnNo").val()
								};
								Utils.ajaxCall("/cnsl/CNSL102UPT01", JSON.stringify(CNSL102_data), function (result) {
								});
							}
							break;
			            case '30':
							
							let rsvProcStCd = "2";
							if(curRsvYn == "Y"){
								rsvProcStCd = "1";	
							}
							 
			            	var CNSL103_data = {
			            		"tenantId" : GLOBAL.session.user.tenantId,
			            		"usrId" : GLOBAL.session.user.usrId,
			    				"orgCd" : GLOBAL.session.user.orgCd,
		        				"procStCd" : rsvProcStCd,
		        				"unfyCntcHistNo" : cntcHistNo
		        			};
			        		Utils.ajaxCall("/cnsl/CNSL103UPT01", JSON.stringify(CNSL103_data), function (result) {});
			            	break;
			            case '31':
			            	var CNSL104_data = {
			            		"tenantId" : GLOBAL.session.user.tenantId,
			            		"usrId" : GLOBAL.session.user.usrId,
			    				"orgCd" : GLOBAL.session.user.orgCd,
		        				"procStCd" : "3",
		        				"unfyCntcHistNo" : cntcHistNo
		        			};
			        		Utils.ajaxCall("/cnsl/CNSL104UPT01", JSON.stringify(CNSL104_data), function (result) {});
			            	break;
			            default:
			            	break; 
	        		}
	        	}
	        	if ( saveMode == 'end' ) {
	        		counselAllInit();
	        	}
	        	
	        	
	        	CNSL100MTabClick(GLOBAL.contextPath + "/cnsl/CNSL101T")
	        	if ( typeof(setCNSL101SEL01) != 'undefined' ) {
	        		setCNSL101SEL01();
	        	}
	        	if ( typeof(setCNSL102SEL01) != 'undefined' ) {
	        		setCNSL102SEL01();
	        	}
	        	if ( typeof(setCNSL103SEL01) != 'undefined' ) {
	        		setCNSL103SEL01();
	        	}
	        	if ( typeof(setCNSL104SEL01) != 'undefined' ) {
	        		setCNSL104SEL01();
	        	}
	        	switch(CNSL113Flag){
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
		            		CNSL113BtnMode(cnslState);
		            	} else if ( nowCallId != '' && counselMode == 'add' )  {
		            		cnslState = 'Connected';
		            		loadCNSL101SEL01();
		            		setTimeout(function() {
		            			listViewCNSL101T_1.select(listViewCNSL101T_1.content.children().first());
		            		}, 500);
		            	} else {
		            		counselAllInit();
		            	}
		            	break;
	            }
	        });
	    });
	}
}


function transUser(data) {
	if ( data.length > 1 ) {
		Utils.alert("한명에게만 이관이 가능합니다.");
	}else {
		$(".CNSL113 #dspsrId").val(data[0].usrId);
		$(".CNSL113 #dspsrOrgCd").val(data[0].orgCd);
		$(".CNSL113 #trclmnNm").val(data[0].usrNm);
	}
}

function counselSet(data) {
	$(".CNSL113 #cnslTypCd").val(data.cnslTypCd);
	$(".CNSL113 #cnslTypNm").val(data.cnslTypLvlNm);
}

function transFunction(_alertYn) {
	if ( $(".CNSL113 #dspsrId").val() == "" ) {
		Utils.alert("이관대상을 선택해주세요.", $(".CNSL113 #trclmnNm").focus());
		return;
	} 
	var CNSL113_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"usrId" : GLOBAL.session.user.usrId,
		"orgCd" : GLOBAL.session.user.orgCd,
		"unfyCntcHistNo" : cntcHistNo,
		"telCnslHistSeq" : $(".CNSL113 #telCnslHistSeq").val(),
		"dspsrId" : $(".CNSL113 #dspsrId").val(),
		"dspsrOrgCd" : $(".CNSL113 #dspsrOrgCd").val(),
		"trclCtt" : $(".CNSL113 #trclCtt").val(),
		"custId" : custId
	};
	
	var trclUrl = "/cnsl/CNSL113INS02";
	if ( $(".CNSL113 #trclFlg").val() == "Y" ) {
		trclUrl = "/cnsl/CNSL113UPT05";
	}
	
	Utils.ajaxCall(trclUrl, JSON.stringify(CNSL113_data), function (result) {
		if(_alertYn == true){
			Utils.alert("이관되었습니다.", function () { 
				$(".CNSL113 #trclYn").prop('checked', true);
	        });
		}
    });
}

function CNSL113T_btnDiv(show) {
	if (show) {
		$("#CNSL113T_btnDiv").show()
	} else {
		$("#CNSL113T_btnDiv").hide()
	}
} 


//kw---20240306 : 무통화상담 추가
function noCallCounselMode(){
	counselInit();

	$("#callPathType").hide();
	$("#callCntcCustInfo").hide();
	$("#callTime").hide();
	
	$("#noCallPathType").show();
	$("#noCallCntcCustInfo").show();
	$("#noCallTime").show();
	
	$("#CNSL113T_comboIobDvCd").data("kendoComboBox").value('');
	$("#CNSL113T_comboCntcPathNm").data("kendoComboBox").value('');
	
	$('.CNSL113 #CNSL113T_comboCntcPathNm').data("kendoComboBox").select(0);
	$('.CNSL113 #CNSL113T_comboIobDvCd').data("kendoComboBox").select(0);
	    
    $("#CNSL113T_inptCntcTelNo").val(noCallCustTelNum);
	$("#CNSL113T_inptCntcCustNm").val(custNm);
		
	$('.CNSL113 #CNSL113T_regCntcInclHourptsec').data("kendoDateTimePicker").value(new Date());
	$('.CNSL113 #CNSL113T_regCntcEndHourptsec').data("kendoDateTimePicker").value(new Date());
	
	
	counselMode = 'noCallCounselMode';
	cntcHistNo = '';
}

//kw---20240329 : 상담이력저장 - 상담유형 레이어 팝업이 활성화 됐을 때 다른 영역을 클릭하면 닫히도록 수정
function CNSL113T_fnLayoutPopOpen(){
	if (!$("#callop_SearchConditionPop").hasClass('active')) {
		initCondition();
		$("#callop_SearchConditionPop").addClass("active");
		
		//kw---20240329 : 상담이력저장 - 상담유형 레이어 팝업이 활성화 됐을 때 다른 영역을 클릭하면 닫히도록 수정
		CNSL113T_srchCondPopActive = true;
	}
	
}

//kw---20240329 : 상담이력저장 - 상담유형 레이어 팝업이 활성화 됐을 때 다른 영역을 클릭하면 닫히도록 수정
function CNSL113T_fnLayoutPopClose(){
	$("#callop_SearchConditionPop").removeClass("active");

	//kw---20240329 : 상담이력저장 - 상담유형 레이어 팝업이 활성화 됐을 때 다른 영역을 클릭하면 닫히도록 수정
	CNSL113T_srchCondPopActive = false;
	CNSL113T_srchCondPopVisible = false;
	CNSL113T_srchCondPopInit= false;
}

//kw---20240329 : 상담이력저장 - 상담유형 레이어 팝업이 활성화 됐을 때 다른 영역을 클릭하면 닫히도록 수정
//kw---20240418 : 상담유형 순서에 맞게 상담유형 표출
function initCondition(){
	
	if(!Utils.isNull($("#cnslTypCd").val())){
		
		CNSL113T_srchCondPopInit = true;
		
		cnslTypInit("L1");
		
		var CNSL113_data;
		var CNSL113_jsonStr;
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
				hgrkCnslTypCd = itemNum
			}
			
			CNSL113_data = {
				"tenantId" : GLOBAL.session.user.tenantId,
				"prsLvlCd" : itemLvNum,
				"hgrkCnslTypCd" : hgrkCnslTypCd,
			};
			
			var CNSL113_jsonStr = JSON.stringify(CNSL113_data);
			
			Utils.ajaxCall("/cnsl/CNSL113SEL03", CNSL113_jsonStr, function(data){
				
				var counselTypeHtml = '';
				var resultList = JSON.parse(data.CNSL113SEL03);
				
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
					
					CNSL113T_srchCondPopInit =false;
				}
			});
		}
	} else {
		setCNSL113SEL03("L1", "");
	}
}

function CNSl113T_fnCommCdHasYn(_nItemCd){
	var hasCommCd = CNSL113ComboList.some(function(item) {
		return item.mgntItemCd === _nItemCd;
	});

	if(!hasCommCd){
		CNSL113T_fnCnslRsltDtlComboEmpty();
	}

	return hasCommCd;
}

function CNSL113T_fnCnslRsltDtlComboEmpty(){
	var comboBox = $('.CNSL113 #cntcRsltDtlsCd').data("kendoComboBox");
	comboBox.dataSource.data([]);
	comboBox.value("");  // 선택된 값 초기화
	comboBox.refresh();
}

function CNSL113T_fnCNSLReset(){

	custId = '';
	custNm = '';
	custTelNum = '';
	cntcHistNo = '';
	cnslHistSeq = '';

	$(".CNSL113 #cntcPathNm").text("");
	//IB/OB
	$(".CNSL113 #iobDvCd").text("");
	$(".CNSL113 #cntcCustNm").text("");
	$(".CNSL113 #cntcTelNo").text("");
	$(".CNSL113 #cntcInclHourptsec").text("");
	$(".CNSL113 #cntcEndHourptsec").text("");
	
	$(".CNSL113 #cnslTypL1").val("");
	$(".CNSL113 #cnslTypL2").val("");
	$(".CNSL113 #cnslTypL3").val("");
	$(".CNSL113 #cnslTypL4").val("");
	$(".CNSL113 #cnslTypL5").val("");
	
	
	$(".CNSL113 #cntcRsltCd").data("kendoComboBox").value("");
	//상담결과
	$(".CNSL113 #cntcRsltDtlsCd").data("kendoComboBox").value("");
	//제목
	$(".CNSL113 #cnslTite").val("");
	//상담내용
	$(".CNSL113 #cnslCtt").val("");
	//이관
	$(".CNSL113 #trclYn").prop("checked", false);
	$(".CNSL113 #trclmnNm").val("");
	//이관내용
	$(".CNSL113 #trclCtt").val("");

}