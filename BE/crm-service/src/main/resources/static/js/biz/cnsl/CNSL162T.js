var CNSL162_pgmId = '';
var CNSL162_dataSrcDvCd = '';

//kw---20240306 : 무통화상담 추가
var noCallCustTelNum = '';

$(document).ready(function() {
	
	CNSL162_tabLoad();
	var CNSL162_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"custId" : custId
	};
	var CNSL162_jsonStr = JSON.stringify(CNSL162_data);
	Utils.ajaxCall("/cnsl/CNSL162SEL02", CNSL162_jsonStr, createCNSL162SEL02);
	
	if ( nowCallId != '' ) {
		setTimeout(function() {
			if (!$(".btVerticalExtend").hasClass("Contracts")) {
		    	$(".btVerticalExtend").click();
		    }
		}, 500);
	}
});

function settingCNSL162SEL01() {
	custInitCNSL162();
	setCNSL162SEL01();
	attCntChk();
	prev_custId = custId;
}

function tabCNSL162Load() {
	for ( var i=0; i<CNSL_Utils.getfunctionCustIdList().length; i++ ) {
		CNSL_Utils.getfunctionCustIdList()[i]();
	}
}

function openPopCNSL161PUPT() {
	if ( custId == '') {
		Utils.alert(CNSL162T_langMap.get("CNSL162T.alert.noCustId"));
		return;
	} 
	let param = {
			custId : custId,
			upsertFlg : 'U',
			callbackKey: "setCNSL162SEL01"
		};
	Utils.setCallbackFunction("setCNSL162SEL01", settingCNSL162SEL01);
	Utils.openPop(GLOBAL.contextPath + "/cnsl/CNSL161P", "CNSL161P", 1000, 800, param);
}

function setCNSL162SEL01() {
	var CNSL162_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"usrId"	: GLOBAL.session.user.usrId,
		"voColId" : "custId", 
		"srchTxt" : custId,
		"custId" : custId,
		"encryptYn": Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1,
		"type" : "SEL"
	};
	var CNSL162_jsonStr = JSON.stringify(CNSL162_data);
	if ( custId == GLOBAL.session.user.tenantId + '_1' ) {
		$(".CNSL162 #custUdt").attr("disabled", true);
		$(".CNSL162 #custAtt").attr("disabled", true);
		Utils.ajaxCall("/cnsl/CNSL162SEL01", CNSL162_jsonStr, CNSL162SEL01);
	}else {
		if ( CNSL162_dataSrcDvCd  == "D") {
			$(".CNSL162 #custUdt").attr("disabled", false);
			$(".CNSL162 #custAtt").attr("disabled", false);
			Utils.ajaxCall("/cnsl/CNSL162SEL02", CNSL162_jsonStr, CNSL162SEL02);
		} else if ( CNSL162_dataSrcDvCd  == "I") {
			$(".CNSL162 #custUdt").attr("disabled", false);
			$(".CNSL162 #custAtt").attr("disabled", false);
			Utils.ajaxCall(CNSL162_pgmId, CNSL162_jsonStr, CNSL162SEL02);
		}
	}
}

function CNSL162SEL01(data) {
	var custInfo = JSON.parse(data.CNSL162SEL01);
	if ( custInfo != null ) {
		$(".CNSL162 #1_2_1").val(custInfo.custId);
		$(".CNSL162 #1_3_1").val(custInfo.custNm);
		if ( cntcHistNo != '' || cntcHistNo != '0') {
			if ( typeof ( $(".CNSL113 #unknownCustomNm") ) == 'object' ){
				if ( $(".CNSL113 #unknownCustomNm").val()  == "" || $(".CNSL113 #unknownCustomNm").length == 0 ) {
					$(".CNSL113 #cntcCustNm").html('<input id="unknownCustomNm" class="k-input" value="'+custInfo.custNm+'"/>');
				}
			} else {
				$(".CNSL113 #cntcCustNm").html('<input id="unknownCustomNm" class="k-input" value="'+custInfo.custNm+'"/>');
			}
		}
		custNm = custInfo.custNm;
	} 
}


var CNSL162_aJsonArray = new Array();
var comboDataCNSL162SEL02 = [];

function createCNSL162SEL02(data) {
	var CNSL162SEL02_html = '';
	CNSL162_aJsonArray = new Array();
	CNSL162SEL02Index = JSON.parse(data.CNSL162SEL02);
	var CNSL162SEL02IndexLen = CNSL162SEL02Index.length;
	var CNSL162SEL02_title = '';
	var CNSL162SEL02_layout_flag = '';
	var CNSL162SEL02_layout_row_flag = '';
	
	var tableIndex1 = '';
	var tableIndex2 = '';
	var colCnt = 0;
	var type1Yn = false;
	var rowNum = 1;
	
	if ( CNSL162SEL02IndexLen > 0 ) {
		CNSL162_pgmId = CNSL162SEL02Index[0].pgmId;
		CNSL162_dataSrcDvCd = CNSL162SEL02Index[0].dataSrcDvCd;
	}
	
	for ( var i = 0; i < CNSL162SEL02IndexLen; i++ ) {
		var layoutItemId =  CNSL162SEL02Index[i].custItemGrpNo + '_' + CNSL162SEL02Index[i].custItemNo+ '_' + CNSL162SEL02Index[i].rowNo;
		if ( i != 0  && CNSL162SEL02_layout_flag != CNSL162SEL02Index[i].custItemGrpNo ) {
			if ( type1Yn ) {
				CNSL162SEL02_html += '  <div class="tableCnt_Row" style="margin-bottom:-1px;">  ';
				CNSL162SEL02_html += '  <table id="'+CNSL162SEL02Index[i].custItemGrpNo+'">     ';
				CNSL162SEL02_html += '  <tbody>                                                 ';
				CNSL162SEL02_html += '  <tr>                                                    ';
				CNSL162SEL02_html += tableIndex1
				CNSL162SEL02_html += '  </tr>                                                   ';
				CNSL162SEL02_html += tableIndex2;
				tableIndex1 = '';
				tableIndex2 = '';
				colCnt = 0;
				type1Yn = false;
				CNSL162SEL02_layout_row_flag = 0;
				rowNum = 1;
			} 
			CNSL162SEL02_html += '</tbody></table></div>';
		}
		if ( CNSL162SEL02_title != CNSL162SEL02Index[i].custItemGrpNo  || i == 0 )  {
			if (CNSL162SEL02Index[i].scrnDispDrctCd == '9') {
				CNSL162SEL02_html += '<h4 class="h4_tit">' + CNSL162SEL02Index[i].custItemGrpNm + '</h4>';
			}
			else if (CNSL162SEL02Index[i].scrnDispDrctCd == '1') {
				CNSL162SEL02_html += '<h4 class="h4_tit">' + CNSL162SEL02Index[i].custItemGrpNm +'</h4>';
			}
			
			CNSL162SEL02_title = CNSL162SEL02Index[i].custItemGrpNo;
		}
		
		if (CNSL162SEL02Index[i].scrnDispDrctCd == '9') {
			if ( CNSL162SEL02_layout_flag != CNSL162SEL02Index[i].custItemGrpNo || i == 0 ) {
				CNSL162SEL02_html += '<div class="tableCnt_Row"><table><colgroup><col style="width: auto" /><col style="width: auto" /><col style="width: auto" /><col style="width: auto" /></colgroup><tbody>';
				CNSL162SEL02_layout_flag = CNSL162SEL02Index[i].custItemGrpNo;
			}
			CNSL162SEL02_html += '<tr><th>'+CNSL162SEL02Index[i].mgntItemNm+'</th><td colspan="3">';
			
			switch (CNSL162SEL02Index[i].mgntItemTypCd) {
		        case "E":
		        	var urlLinkVal = CNSL162SEL02Index[i].linkUrl;
		        	CNSL162SEL02_html += '<span class="searchTextBox" style="width: 100%;" ><input voColId="'+CNSL162SEL02Index[i].voColId+'" crypTgtYn="'+CNSL162SEL02Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'" value="' + CNSL162SEL02Index[i].custItemDataVlu+ '" class="customLayout E k-input" placeholder="검색하세요." style="width:40%" disabled /><button title="검색"></button><input voColId="'+CNSL162SEL02Index[i].voColId+'" crypTgtYn="'+CNSL162SEL02Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'Nm" class="customLayout E k-input" value="' + CNSL162SEL02Index[i].custItemDataNm+ '" disabled /></span>';
		            break;
		        case "I":
		        	CNSL162SEL02_html += '<input voColId="'+CNSL162SEL02Index[i].voColId+'" id="'+layoutItemId+'" class="customLayout I" style="width: 100%;" value="' + CNSL162SEL02Index[i].custItemDataVlu+ '" disabled />';
		            break;
		        case "D":
		        	CNSL162SEL02_html += '<input voColId="'+CNSL162SEL02Index[i].voColId+'" id="'+layoutItemId+'" class="customLayout D datepicker" placeholder="" style="width: 100%;" value="' + CNSL162SEL02Index[i].custItemDataVlu+ '" disabled />';
		            break;
		        case "C":
		        	comboDataCNSL162SEL02.push({"mgntItemCd":CNSL162SEL02Index[i].mgntItemCd});
		        	CNSL162SEL02_html += '<input voColId="'+CNSL162SEL02Index[i].voColId+'" id="'+layoutItemId+'" class="customLayout C ' + CNSL162SEL02Index[i].mgntItemCd + ' k-input" placeholder="" style="width: 100%;" value="' + CNSL162SEL02Index[i].custItemDataVlu+ '" disabled />';
		            break;
		        case "N":
		        	CNSL162SEL02_html += '<input voColId="'+CNSL162SEL02Index[i].voColId+'" type="number" id="'+layoutItemId+'" class="customLayout N k-input" placeholder="" style="width: 100%;" value="' + CNSL162SEL02Index[i].custItemDataVlu+ '" disabled />';
		            break;
		        case "T":
		        	if ( CNSL162SEL02Index[i].voColId == 'custId') {
		        		CNSL162SEL02_html += '<input voColId="'+CNSL162SEL02Index[i].voColId+'" type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + custId + '" disabled />';
		        	} else {
		        		CNSL162SEL02_html += '<input voColId="'+CNSL162SEL02Index[i].voColId+'" type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + CNSL162SEL02Index[i].custItemDataVlu+ '" disabled />';
		        	}
		            break;
		    }
			CNSL162SEL02_html += '</td></tr>';
		}else if (CNSL162SEL02Index[i].scrnDispDrctCd == '1') {
			if ( CNSL162SEL02_layout_flag != CNSL162SEL02Index[i].custItemGrpNo || i == 0 ) {
				tableIndex2 = '';
				type1Yn = true;
				CNSL162SEL02_layout_flag = CNSL162SEL02Index[i].custItemGrpNo;
				tableIndex1 += '<th style="width:50px;">NO</th>';
			}
			
			if ( CNSL162SEL02_layout_row_flag != CNSL162SEL02Index[i].rowNo || i == 0 ) {
				tableIndex2 += '<tr>';
				CNSL162SEL02_layout_row_flag = CNSL162SEL02Index[i].rowNo;
				tableIndex2 += '<td><input value="' + rowNum + '" class="k-input" style="width:100%; border:white;" disabled/></td>'
				rowNum++;
			}
			
			if ( CNSL162SEL02Index[i].rowNo == 1 ) {
				tableIndex1 += '<th>'+CNSL162SEL02Index[i].mgntItemNm+'</th>';
			}  
			switch (CNSL162SEL02Index[i].mgntItemTypCd) {
		        case "E":
		        	var urlLinkVal = CNSL162SEL02Index[i].linkUrl; 
		        	tableIndex2 += '<td type="E"><span class="searchTextBox" style="width: 100%;" ><input voColId="'+CNSL162SEL02Index[i].voColId+'" crypTgtYn="'+CNSL162SEL02Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'" value="' + CNSL162SEL02Index[i].custItemDataVlu+ '" class="customLayout E k-input" placeholder="검색하세요." style="width:40%" disabled /><button title="검색"></button><input voColId="'+CNSL162SEL02Index[i].voColId+'" crypTgtYn="'+CNSL162SEL02Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'Nm" class="customLayout E k-input" value="' + CNSL162SEL02Index[i].custItemDataNm+ '" disabled /></span></td>'
		            break;
		        case "I":
		        	tableIndex2 += '<td><input voColId="'+CNSL162SEL02Index[i].voColId+'" id="'+layoutItemId+'" class="customLayout I" style="width: 100%;" value="' + CNSL162SEL02Index[i].custItemDataVlu+ '" disabled /></td>';
		            break;
		        case "D":
		        	tableIndex2 += '<td><input voColId="'+CNSL162SEL02Index[i].voColId+'" id="'+layoutItemId+'" class="customLayout D datepicker" placeholder="" style="width: 100%;" value="' + CNSL162SEL02Index[i].custItemDataVlu+ '" disabled /></td>';
		            break;
		        case "C":
		        	comboDataCNSL162SEL02.push({"mgntItemCd":CNSL162SEL02Index[i].mgntItemCd});
		        	tableIndex2 += '<td type="C"><input voColId="'+CNSL162SEL02Index[i].voColId+'" id="'+layoutItemId+'" class="customLayout C ' + CNSL162SEL02Index[i].mgntItemCd + ' k-input" placeholder="" style="width: 100%;" value="' + CNSL162SEL02Index[i].custItemDataVlu+ '" disabled /></td>';
		            break;
		        case "N":
		        	tableIndex2 += '<td><input voColId="'+CNSL162SEL02Index[i].voColId+'" type="number" id="'+layoutItemId+'" class="customLayout N k-input" placeholder="" style="width: 100%;" value="' + CNSL162SEL02Index[i].custItemDataVlu+ '" disabled /></td>';
		            break;
		        case "T":
		        	if ( CNSL162SEL02Index[i].voColId == 'custId') {
		        		tableIndex2 += '<td><input voColId="'+CNSL162SEL02Index[i].voColId+'" type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + custId + '" disabled /></td>';
		        	} else {
		        		tableIndex2 += '<td><input voColId="'+CNSL162SEL02Index[i].voColId+'" type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + CNSL162SEL02Index[i].custItemDataVlu + '" disabled /></td>';
		        	}
		            break;
		    }
		}
		if ( i == ( CNSL162SEL02IndexLen - 1 ) ) {
			if ( type1Yn ) {
				CNSL162SEL02_html += '  <div class="tableCnt_Row" style="margin-bottom:-1px;">  ';
				CNSL162SEL02_html += '  <table id="'+CNSL162SEL02Index[i].custItemGrpNo+'">     ';
				CNSL162SEL02_html += '  <tbody>                                                 ';
				CNSL162SEL02_html += '  <tr>                                                    ';
				CNSL162SEL02_html += tableIndex1
				CNSL162SEL02_html += '  </tr>                                                   ';
				CNSL162SEL02_html += tableIndex2;
				tableIndex1 = '';
				tableIndex2 = '';
				colCnt = 0;
				type1Yn = false;
			} 
			CNSL162SEL02_html += '</tbody></table></div>';
		} 
	}
	$("#CNSL162SEL02").html(CNSL162SEL02_html);
	
	setTimeout(function() {
		afterCNSL162SEL02(comboDataCNSL162SEL02);
		tabCNSL162Load();
	}, 100);
}


function CNSL162SEL02(data) {
	if ( CNSL162_dataSrcDvCd  == "D" ) {
		var CNSL162SEL02_html = '';
		CNSL162_aJsonArray = new Array();
		CNSL162SEL02Index = JSON.parse(data.CNSL162SEL02);
		var CNSL162SEL02IndexLen = CNSL162SEL02Index.length;
		for ( var i = 0; i < CNSL162SEL02IndexLen; i++ ) {
			var layoutItemId =  CNSL162SEL02Index[i].custItemGrpNo + '_' + CNSL162SEL02Index[i].custItemNo + '_' + CNSL162SEL02Index[i].rowNo;
			if (CNSL162SEL02Index[i].mgntItemTypCd == 'C') {
				var combobox = $("#CNSL162SEL02 #" + layoutItemId).data("kendoComboBox");
				if ( combobox != undefined ) 
					combobox.value(CNSL162SEL02Index[i].custItemDataVlu);
			}else {
				if (CNSL162SEL02Index[i].voColId == 'custId') {
					$("#CNSL162SEL02 #" + layoutItemId).val(custId);
				} else if (CNSL162SEL02Index[i].voColId == 'custNm') {
					custNm = CNSL162SEL02Index[i].custItemDataVlu;
					$("#CNSL162SEL02 #" + layoutItemId).val(custNm);
					$(".CNSL113 #cntcCustNm").html(custNm);
				} else {
					$("#CNSL162SEL02 #" + layoutItemId).val(CNSL162SEL02Index[i].custItemDataVlu);
				}
				if (CNSL162SEL02Index[i].mgntItemTypCd == 'E') {
					$("#CNSL162SEL02 #" + layoutItemId + 'Nm').val(CNSL162SEL02Index[i].custItemDataNm);
				}
			}
		}
	} else if ( CNSL162_dataSrcDvCd  == "I") {
		let patApptInfo = JSON.parse(data.result);
		if ( patApptInfo.result.length == 1 ) {
			for (const key in patApptInfo.result[0]) {
				$(".customLayout").each(function() {
					if ( $(this).attr("voColId") != undefined ){
						if ($(this).attr("voColId").indexOf(key) !== -1) {
							$(this).val(patApptInfo.result[0][key])
							let combobox = $(this).data("kendoComboBox");
							if ( combobox != undefined ) 
								combobox.value(patApptInfo.result[0][key]);
						} 
					}
				})
			}
		}
	}
}

function afterCNSL162SEL02(comboDataCNSL162SEL02) {
	$(".CNSL162 .D").kendoDatePicker({ 
		format: "yyyy-MM-dd", 
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	$(".CNSL162 .I").kendoDateTimePicker({
		culture: "ko-KR",   
		footer: false, 
		format: "yyyy-MM-dd HH:mm", 
	}).data("kendoDateTimePicker");
	
	var data = { "codeList": 
		comboDataCNSL162SEL02
	};
    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList162,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
    
    setTimeout(function() {
    	settingCNSL162SEL01();
	}, 100);
}

function resultComboList162(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	var mgntItemCd = '';
	for ( var i=0; i<jsonDecode.length; i++) {
		if ( mgntItemCd != jsonDecode[i].mgntItemCd) {
			mgntItemCd = jsonDecode[i].mgntItemCd;
			$(".CNSL162 ."+jsonDecode[i].mgntItemCd).html('');
			Utils.setKendoComboBox(jsonDecode, jsonDecode[i].mgntItemCd, '.CNSL162 .'+jsonDecode[i].mgntItemCd, ' ', false) ;
		}
	}
	setTimeout(function() {
		setCNSL162SEL01();
	}, 100);
}

function custInitCNSL162() {
	$("#CNSL162SEL02 .customLayout.E").val('');
	$("#CNSL162SEL02 .customLayout.I").val('');
	$("#CNSL162SEL02 .customLayout.D").val('');
	$("#CNSL162SEL02 .customLayout.N").val('');
	$("#CNSL162SEL02 .customLayout.T").val('');
	$("#CNSL162SEL02 .customLayout.C").each(function () {
		let combobox = $(this).data("kendoComboBox");
		if ( $(this).attr("id") !== undefined ) {
			combobox.value('');
		}
	});
}

function CNSL162_tabLoad() {
	var SYSM301M_templateCardPath = GLOBAL.contextPath + "/tmpl/TEMPLATE_CARD";
	$("#tabCNSL162T").load(SYSM301M_templateCardPath, {
	    TEMPLATE_CARD_tenantId: GLOBAL.session.user.tenantId,
	    TEMPLATE_CARD_dataFrmId: "CNSL162T",
	    TEMPLATE_CARD_patFrmeCd: "F1"
	});
}

function openPopCNSL140P() {
	if ( custId == '') {
		Utils.alert(CNSL162T_langMap.get("CNSL162T.alert.noCustId"));
		return;
	} 
	let param = {
		custId : custId,
		custNm : custNm,
		callbackKey: "setCNSL162SEL01"
	};
	Utils.setCallbackFunction("setCNSL162SEL01", settingCNSL162SEL01);
	Utils.openPop(GLOBAL.contextPath + "/cnsl/CNSL140P", "CNSL140P", 650, 660, param);
}


function attCntChk() {
	var CNSL140P_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"custId" : custId
	};
	Utils.ajaxCall("/cnsl/CNSL162SEL03", JSON.stringify(CNSL140P_data), function (data) {
		if ( data.CNSL162SEL03 == 0 ) {
			$("#custAtt").removeClass('attention')
			$("#custAtt").text(CNSL162T_langMap.get("CNSL162T.button.custAtt"));
		} else {
			$("#custAtt").addClass('attention')
			$("#custAtt").text(CNSL162T_langMap.get("CNSL162T.button.custAtt")+"(" + data.CNSL162SEL03 + ")");
		}
	});
}

//kw---20240306 : 무통화상담 추가
function noCallCounsel(){
	
	if (Utils.isNull(custId)) {
		Utils.alert("상담대상을 선택해주세요.");
		return;
	}
	
	counselMode = 'noCallCounselMode';

	noCallListClearSelection();
	
	if(window['noCallCounselMode']) {
		CNSL100MTabClick("/bcs/cnsl/CNSL"+tabFrmCnslHistId)
		noCallCounselMode();
		$("#CNSL" + tabFrmCnslHistId + "_inptCntcTelNo").val(noCallCustTelNum);
		$("#CNSL" + tabFrmCnslHistId + "_inptCntcCustNm").val(custNm);
	} else {
		
		//1. 탭을 먼저 열고
		CNSL100MTabClick("/bcs/cnsl/CNSL"+tabFrmCnslHistId)
		
		//2. 1초 뒤에 상담이력저장에 있는 함수와 요소에 데이터를 넣을 거긱 때문에 로딩창 띄워주고
        $('.modalWrap').removeClass('active');
        
        setTimeout(function() {
        	
        	//3. 무통화상태로 요소 셋팅
            noCallCounselMode();
            
            //4. 고객명과 고객TEL에 고객정보를 넣어준다
            $("#CNSL" + tabFrmCnslHistId + "_inptCntcTelNo").val(noCallCustTelNum);
        	$("#CNSL" + tabFrmCnslHistId + "_inptCntcCustNm").val(custNm);
        	
        	//5. 로딩창을 없애준다
            $('.modalWrap').addClass('active');
            
        }, 1000); // 2000 밀리초 = 2초
    }
}
