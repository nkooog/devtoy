var CNSL112_pgmId = '';
var CNSL112_dataSrcDvCd = '';

var CNSL112_aJsonArray = new Array();
var comboDataCNSL112SEL02 = [];

var CNSL112T_custPhoneNum = '';
var CNSL112T_codeList = [];

//kw---20250312 : 콤보박스의 요소와 아이템코드 가져오기
var CNSL112T_ComboList = [];

$(document).ready(function() {
	
	CNSL112T_ComboList = [];
	
	CNSL112_tabLoad();
	var CNSL112_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"custId" : custId
	};
	var CNSL112_jsonStr = JSON.stringify(CNSL112_data);
	
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		Utils.ajaxCall("/cnsl/CNSL112SEL02", CNSL112_jsonStr, createCNSL112SEL02);
	} else {
		Utils.ajaxCall("/cnsl/CNSL162SEL02", CNSL112_jsonStr, createCNSL112SEL02_NEW);
	}
	
	
	if ( nowCallId != '' ) {
		setTimeout(function() {
			if (!$(".btVerticalExtend").hasClass("Contracts")) {
		    	$(".btVerticalExtend").click();
		    }
		}, 500);
	}
});

function settingCNSL112SEL01() {
	
	$("#CNSL112SEL02").empty();

	CNSL112T_ComboList = [];
	
	var CNSL112_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"custId" : custId
		};
		var CNSL112_jsonStr = JSON.stringify(CNSL112_data);
		
		if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
			Utils.ajaxCall("/cnsl/CNSL112SEL02", CNSL112_jsonStr, createCNSL112SEL02);
		} else {
			Utils.ajaxCall("/cnsl/CNSL162SEL02", CNSL112_jsonStr, createCNSL112SEL02_NEW);
		}
		
	attCntChk();
	// tabCNSL112Load();
	prev_custId = custId;
	
		
}

function tabCNSL112Load(_tab3ClickYn) {
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {

		let interval = setInterval(function() {
			let CNSL120_srchType = $(".CNSL120 #srchType").data("kendoComboBox");
			if(CNSL120_srchType != undefined){
				clearInterval(interval)
				CNSL120_srchType.value("1");
				$(".CNSL120 #srchTxt").val(custTelNum);
				for ( var i=0; i<CNSL_Utils.getfunctionCustIdList().length; i++ ) {
					CNSL_Utils.getfunctionCustIdList()[i]();
				}
			}
		}, 100);

	} else {
		for ( var i=0; i<CNSL_Utils.getfunctionCustIdList().length; i++ ) {
			CNSL_Utils.getfunctionCustIdList()[i]();
		}
	}

	//kw---20240509 : 상담메인 -> 오른쪽(3)탭이 2번씩 조회되는거 관련하여 수정
	if(Utils.isNull(_tab3ClickYn)){
		CNSL_Utils.callHistoryClickListener_f3()
	}
	
}

function openPopCNSL111PUPT() {
	
	if ( custId == '') {
		Utils.alert(CNSL112T_langMap.get("CNSL112T.alert.noCustId"));
		return;
	} 
	let param = {
			custId : custId,
			upsertFlg : 'U',
			callbackKey: "setCNSL112SEL01"
		};
	Utils.setCallbackFunction("setCNSL112SEL01", settingCNSL112SEL01);
	Utils.openPop(GLOBAL.contextPath + "/cnsl/CNSL111P", "CNSL111P", 1000, 800, param);
}

function setCNSL112SEL01() {
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		var CNSL112_data = {
				"tenantId" : GLOBAL.session.user.tenantId,
				"custId" : custId,
				"encryptYn": Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1
			};
			var CNSL112_jsonStr = JSON.stringify(CNSL112_data);
			Utils.ajaxCall("/cnsl/CNSL112SEL02", CNSL112_jsonStr, CNSL112SEL02);
			Utils.ajaxCall("/cnsl/CNSL112SEL01", CNSL112_jsonStr, CNSL112SEL01);
	} else {
		var CNSL112_data = {
				"tenantId" : GLOBAL.session.user.tenantId,
				"usrId"	: GLOBAL.session.user.usrId,
				"voColId" : "custId", 
				"srchTxt" : custId,
				"custId" : custId,
				"encryptYn": Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1,
				"type" : "SEL"
			};
			var CNSL112_jsonStr = JSON.stringify(CNSL112_data);
			if ( custId == GLOBAL.session.user.tenantId + '_1' ) {
				$(".CNSL112 #custUdt").attr("disabled", true);
				$(".CNSL112 #custAtt").attr("disabled", true);
				Utils.ajaxCall("/cnsl/CNSL162SEL01", CNSL112_jsonStr, CNSL112SEL01_NEW);
			}else {
				if ( CNSL112_dataSrcDvCd  == "D") {
					$(".CNSL112 #custUdt").attr("disabled", false);
					$(".CNSL112 #custAtt").attr("disabled", false);
					Utils.ajaxCall("/cnsl/CNSL162SEL02", CNSL112_jsonStr, CNSL112SEL02_NEW);
				} else if ( CNSL112_dataSrcDvCd  == "I") {
					$(".CNSL112 #custUdt").attr("disabled", false);
					$(".CNSL112 #custAtt").attr("disabled", false);
					Utils.ajaxCall(CNSL112_pgmId, CNSL112_jsonStr, CNSL112SEL02_NEW);
				}
			}
	}
	
}

function CNSL112SEL01_NEW(data) {
	var custInfo = JSON.parse(data.CNSL162SEL01);
	if ( custInfo != null ) {
		$(".CNSL112 #1_2_1").val(custInfo.custId);
		$(".CNSL112 #1_3_1").val(custInfo.custNm);
		if ( cntcHistNo != '' || cntcHistNo != '0') {
			if ( typeof ( $(".CNSL113 #unknownCustomNm") ) == 'object' ){
				if ( $(".CNSL113 #unknownCustomNm").val()  == "" || $(".CNSL113 #unknownCustomNm").length == 0 ) {
					$(".CNSL113 #cntcCustNm").html('<input id="unknownCustomNm" class="k-input" value="'+custInfo.custNm+'"/>');
				}
			} else {
				$(".CNSL113 #cntcCustNm").html('<input id="unknownCustomNm" class="k-input" value="'+custInfo.custNm+'"/>');
			}
			
			$("#CNSL113T_inptCntcCustNm").val(custInfo.custNm);
		}
		custNm = custInfo.custNm;
	} 
}

function CNSL112SEL02_NEW(data) {
	

	if ( CNSL112_dataSrcDvCd  == "D" ) {
		var CNSL112SEL02_html = '';
		CNSL112_aJsonArray = new Array();
		CNSL112SEL02Index = JSON.parse(data.CNSL162SEL02);
		var CNSL112SEL02IndexLen = CNSL112SEL02Index.length;
		
		for ( var i = 0; i < CNSL112SEL02IndexLen; i++ ) {
			
			var layoutItemId =  CNSL112SEL02Index[i].custItemGrpNo + '_' + CNSL112SEL02Index[i].custItemNo + '_' + CNSL112SEL02Index[i].rowNo;
			
			var elementBool = document.getElementById(layoutItemId);

			if (CNSL112SEL02Index[i].mgntItemTypCd == 'C') {
				var combobox = $("#CNSL112SEL02 #" + layoutItemId).data("kendoComboBox");
				if ( combobox != undefined ) 
					combobox.value(CNSL112SEL02Index[i].custItemDataVlu);
			}else {
				if (CNSL112SEL02Index[i].voColId == 'custId') {
					$("#CNSL112SEL02 #" + layoutItemId).val(custId);
				} else if (CNSL112SEL02Index[i].voColId == 'custNm') {
					custNm = CNSL112SEL02Index[i].custItemDataVlu;
					$("#CNSL112SEL02 #" + layoutItemId).val(custNm);
					$(".CNSL113 #cntcCustNm").html(custNm);
				} else if(CNSL112SEL02Index[i].mgntItemCd == 'T0004'){
					$("#CNSL112SEL02 #" + layoutItemId).html(CNSL112SEL02Index[i].custItemDataVlu);
				} else {
					
					//kw---20240220 : 고객상담 TAB에서 전화번호에 하이픈 넣기
					if(CNSL112SEL02Index[i].mgntItemNm.includes('전화번호')){
						CNSL112SEL02Index[i].custItemDataVlu = Utils.AddHypToNumber(CNSL112SEL02Index[i].custItemDataVlu, 1);
	        		}
					
					$("#CNSL112SEL02 #" + layoutItemId).val(CNSL112SEL02Index[i].custItemDataVlu);
				}
				if (CNSL112SEL02Index[i].mgntItemTypCd == 'E') {
					$("#CNSL112SEL02 #" + layoutItemId + 'Nm').val(CNSL112SEL02Index[i].custItemDataNm);
				}
				
				if(CNSL112SEL02Index[i].mgntItemCd == 'T0009'){
					//kw---20240306 : 무통화상담 추가
					noCallCustTelNum = CNSL112SEL02Index[i].custItemDataVlu;
				}
					
			}
		}
	} else if ( CNSL112_dataSrcDvCd  == "I") {
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

function CNSL112SEL01(data) {
	var custInfo = JSON.parse(data.CNSL112SEL01);
	if ( custInfo != null ) {
		if ( custInfo.custId == GLOBAL.session.user.tenantId + '_1' ) {
			$(".CNSL112 #custUdt").attr("disabled", true);
			$(".CNSL112 #custAtt").attr("disabled", true);
			$(".CNSL112 #1_2_1").val(custInfo.custId);
			$(".CNSL112 #1_3_1").val(custInfo.custNm);
			if ( cntcHistNo != '' || cntcHistNo != '0') {
				if ( typeof ( $(".CNSL113 #unknownCustomNm") ) == 'object' ){
					if ( $(".CNSL113 #unknownCustomNm").val()  == "" || $(".CNSL113 #unknownCustomNm").length == 0 ) {
						$(".CNSL113 #cntcCustNm").html('<input id="unknownCustomNm" class="k-input" value="'+custInfo.custNm+'"/>');
					}
				} else {
					$(".CNSL113 #cntcCustNm").html('<input id="unknownCustomNm" class="k-input" value="'+custInfo.custNm+'"/>');
				}
			}
		} else {
			$(".CNSL112 #custUdt").attr("disabled", false);
			$(".CNSL112 #custAtt").attr("disabled", false);
			if($(".CNSL112 #1_1_1").length > 0 ){

				$(".CNSL112 #1_1_1").val(Utils.getComProp(CNSL112T_codeList , "C0118" , custInfo.custIdPathCd , 'comCdNm'));
				$(".CNSL112 #1_2_1").val(custInfo.custId);
				$(".CNSL112 #1_3_1").val(custInfo.custNm);
				$(".CNSL112 #1_4_1").val(Utils.getComProp(CNSL112T_codeList , "C0172" , custInfo.gndr , 'comCdNm'));

				$(".CNSL112 #1_5_1").val(custInfo.btdt);
				$(".CNSL112 #1_6_1").val(maskingFunc.phone(custInfo.owhmTelNo));
				$(".CNSL112 #1_7_1").val(maskingFunc.phone(custInfo.wkplTelNo));
				$(".CNSL112 #1_8_1").val(maskingFunc.phone(custInfo.mbleTelNo));

				//kw---20240306 : 무통화상담 추가
				noCallCustTelNum = maskingFunc.phone(custInfo.mbleTelNo)

				if ( cntcHistNo != '' || cntcHistNo != '0') {
					$(".CNSL113 #cntcCustNm").html(custInfo.custNm);
				}
			}

		}
		
		custId = custInfo.custId;
		custNm = custInfo.custNm;
		tabCNSL112Load();
	} 
}


var CNSL112_aJsonArray = new Array();
var comboDataCNSL112SEL02 = [];

function createCNSL112SEL02(data) {

	comboDataCNSL112SEL02 = [];

	var CNSL112SEL02_html = '';
	CNSL112_aJsonArray = new Array();
	CNSL112SEL02Index = JSON.parse(data.CNSL112SEL02);
	var CNSL112SEL02IndexLen = CNSL112SEL02Index.length;
	var CNSL112SEL02_title = '';
	var CNSL112SEL02_layout_flag = '';
	var CNSL112SEL02_layout_row_flag = '';
	
	var tableIndex1 = '';
	var tableIndex2 = '';
	var colCnt = 0;
	var type1Yn = false;
	var rowNum = 1;
	
	CNSL112T_ComboList = [];
	
	for ( var i = 0; i < CNSL112SEL02IndexLen; i++ ) {
		var layoutItemId =  CNSL112SEL02Index[i].custItemGrpNo + '_' + CNSL112SEL02Index[i].custItemNo+ '_' + CNSL112SEL02Index[i].rowNo;
		if ( i != 0  && CNSL112SEL02_layout_flag != CNSL112SEL02Index[i].custItemGrpNo ) {
			if ( type1Yn ) {
				CNSL112SEL02_html += '  <div class="tableCnt_Row" style="margin-bottom:-1px;">  ';
				CNSL112SEL02_html += '  <table id="'+CNSL112SEL02Index[i].custItemGrpNo+'">     ';
				CNSL112SEL02_html += '  <tbody>                                                 ';
				CNSL112SEL02_html += '  <tr>                                                    ';
				CNSL112SEL02_html += tableIndex1
				CNSL112SEL02_html += '  </tr>                                                   ';
				CNSL112SEL02_html += tableIndex2;
				tableIndex1 = '';
				tableIndex2 = '';
				colCnt = 0;
				type1Yn = false;
				CNSL112SEL02_layout_row_flag = 0;
				rowNum = 1;
			} 
			CNSL112SEL02_html += '</tbody></table></div>';
		}
		if ( CNSL112SEL02_title != CNSL112SEL02Index[i].custItemGrpNo  || i == 0 )  {
			if (CNSL112SEL02Index[i].scrnDispDrctCd == '9') {
				CNSL112SEL02_html += '<h4 class="h4_tit">' + CNSL112SEL02Index[i].custItemGrpNm + '</h4>';
			}
			else if (CNSL112SEL02Index[i].scrnDispDrctCd == '1') {
				CNSL112SEL02_html += '<h4 class="h4_tit">' + CNSL112SEL02Index[i].custItemGrpNm +'</h4>';
			}
			
			CNSL112SEL02_title = CNSL112SEL02Index[i].custItemGrpNo;
		}
		
		if (CNSL112SEL02Index[i].scrnDispDrctCd == '9') {
			if ( CNSL112SEL02_layout_flag != CNSL112SEL02Index[i].custItemGrpNo || i == 0 ) {
				CNSL112SEL02_html += '<div class="tableCnt_Row"><table><colgroup><col style="width: auto" /><col style="width: auto" /><col style="width: auto" /><col style="width: auto" /></colgroup><tbody>';
				CNSL112SEL02_layout_flag = CNSL112SEL02Index[i].custItemGrpNo;
			}
			CNSL112SEL02_html += '<tr><th>'+CNSL112SEL02Index[i].mgntItemNm+'</th><td colspan="3">';
			
			switch (CNSL112SEL02Index[i].mgntItemTypCd) {
		        case "E":
		        	var urlLinkVal = CNSL112SEL02Index[i].linkUrl;
		        	CNSL112SEL02_html += '<span class="searchTextBox" style="width: 100%;" ><input crypTgtYn="'+CNSL112SEL02Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" class="customLayout E k-input" placeholder="검색하세요." style="width:40%" disabled /><button title="검색"></button><input crypTgtYn="'+CNSL112SEL02Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'Nm" class="customLayout E k-input" value="' + CNSL112SEL02Index[i].custItemDataNm+ '" disabled /></span>';
		            break;
		        case "I":
		        	CNSL112SEL02_html += '<input id="'+layoutItemId+'" class="customLayout I" style="width: 100%;" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled />';
		            break;
		        case "D":
		        	CNSL112SEL02_html += '<input id="'+layoutItemId+'" class="customLayout D datepicker" placeholder="" style="width: 100%;" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled />';
		            break;
		        case "C":
					console.log("::: kw 1111");
		        	comboDataCNSL112SEL02.push({"mgntItemCd":CNSL112SEL02Index[i].mgntItemCd});
		        	
		        	CNSL112T_ComboList.push({
						"mgntItemCd" 	: CNSL112SEL02Index[i].mgntItemCd,
						"layoutItemId" 	: layoutItemId,
					});
					
		        	CNSL112SEL02_html += '<input type="text" id="'+layoutItemId+'" class="customLayout C ' + CNSL112SEL02Index[i].mgntItemCd + ' k-input" placeholder="" style="width: 100%;" value="' + Utils.getComProp( CNSL112T_codeList ,  CNSL112SEL02Index[i].mgntItemCd ,CNSL112SEL02Index[i].custItemDataVlu  , 'comCdNm' )+ '" disabled />';
		            break;
		        case "N":
		        	CNSL112SEL02_html += '<input type="number" id="'+layoutItemId+'" class="customLayout N k-input" placeholder="" style="width: 100%;" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled />';
		            break;
		        case "T":
		        	if(CNSL112SEL02Index[i].mgntItemCd == 'T0004'){
		        		CNSL112SEL02_html += '<span id="'+layoutItemId+'" class="span_drag_select">' + CNSL112SEL02Index[i].custItemDataVlu + '</span>';
		        	}
		        	else if(CNSL112SEL02Index[i].mgntItemCd == 'T0009'){
		        		
		        		CNSL112T_custPhoneNum = layoutItemId;
		        		
		        		CNSL112SEL02_html += '<div style="display:flex">';
		        			CNSL112SEL02_html += '<input type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled />';
		        			CNSL112SEL02_html += '<button class="icoUtil_callMake fl" onclick="custPhoneNumCall()" style="margin-left:10px";></button>';
		        			CNSL112SEL02_html += '<button class="btnRefer_second fr" onclick="custPhoneNumSms()" style="margin-left:10px";>SMS</button>';
		        		CNSL112SEL02_html += '</div>';
		        	}
		        	else {
		        		CNSL112SEL02_html += '<input type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled />';
		        	}
		            break;
		    }
			CNSL112SEL02_html += '</td></tr>';
		}else if (CNSL112SEL02Index[i].scrnDispDrctCd == '1') {
			if ( CNSL112SEL02_layout_flag != CNSL112SEL02Index[i].custItemGrpNo || i == 0 ) {
				tableIndex2 = '';
				type1Yn = true;
				CNSL112SEL02_layout_flag = CNSL112SEL02Index[i].custItemGrpNo;
				tableIndex1 += '<th style="width:50px;">NO</th>';
			}
			
			if ( CNSL112SEL02_layout_row_flag != CNSL112SEL02Index[i].rowNo || i == 0 ) {
				tableIndex2 += '<tr>';
				CNSL112SEL02_layout_row_flag = CNSL112SEL02Index[i].rowNo;
				tableIndex2 += '<td><input value="' + rowNum + '" class="k-input" style="width:100%; border:white;" disabled/></td>'
				rowNum++;
			}
			
			if ( CNSL112SEL02Index[i].rowNo == 1 ) {
				tableIndex1 += '<th>'+CNSL112SEL02Index[i].mgntItemNm+'</th>';
			}  
			switch (CNSL112SEL02Index[i].mgntItemTypCd) {
		        case "E":
		        	var urlLinkVal = CNSL112SEL02Index[i].linkUrl; 
		        	tableIndex2 += '<td type="E"><span class="searchTextBox" style="width: 100%;" ><input crypTgtYn="'+CNSL112SEL02Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" class="customLayout E k-input" placeholder="검색하세요." style="width:40%" disabled /><button title="검색"></button><input crypTgtYn="'+CNSL112SEL02Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'Nm" class="customLayout E k-input" value="' + CNSL112SEL02Index[i].custItemDataNm+ '" disabled /></span></td>'
		            break;
		        case "I":
		        	tableIndex2 += '<td><input id="'+layoutItemId+'" class="customLayout I" style="width: 100%;" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled /></td>';
		            break;
		        case "D":
		        	tableIndex2 += '<td><input id="'+layoutItemId+'" class="customLayout D datepicker" placeholder="" style="width: 100%;" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled /></td>';
		            break;
		        case "C":
					console.log("::: kw 222");
		        	comboDataCNSL112SEL02.push({"mgntItemCd":CNSL112SEL02Index[i].mgntItemCd});
		        	
		        	CNSL112T_ComboList.push({
						"mgntItemCd" 	: CNSL112SEL02Index[i].mgntItemCd,
						"layoutItemId" 	: layoutItemId,
					});
					
		        	tableIndex2 += '<td type="C"><input type="text" id="'+layoutItemId+'" class="customLayout C ' + CNSL112SEL02Index[i].mgntItemCd + ' k-input" placeholder="" style="width: 100%;" value="' + Utils.getComProp( CNSL112T_codeList ,  CNSL112SEL02Index[i].mgntItemCd ,CNSL112SEL02Index[i].custItemDataVlu  , 'comCdNm' ) + '" disabled /></td>';
		            break;
		        case "N":
		        	tableIndex2 += '<td><input type="number" id="'+layoutItemId+'" class="customLayout N k-input" placeholder="" style="width: 100%;" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled /></td>';
		            break;
		        case "T":
		        	if(CNSL112SEL02Index[i].mgntItemCd == 'T0004'){
		        		tableIndex2 += '<td><span id="'+layoutItemId+'" class="span_drag_select">' + CNSL112SEL02Index[i].custItemDataVlu + '</span></td>';
		        	}
		        	else if(CNSL112SEL02Index[i].mgntItemCd == 'T0009'){
		        		tableIndex2 += '<td><input type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" style="width: 80%;" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled /> <button class="icoUtil_callMake fl" onclick="txtTargetNumberSet(this)"></button> </td>';
		        	} 
		        	else {
		        		tableIndex2 += '<td><input type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" style="width: 80%;" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled /></td>';
		        	}
		        	
		            break;
		    }
		}
		if ( i == ( CNSL112SEL02IndexLen - 1 ) ) {
			if ( type1Yn ) {
				CNSL112SEL02_html += '  <div class="tableCnt_Row" style="margin-bottom:-1px;">  ';
				CNSL112SEL02_html += '  <table id="'+CNSL112SEL02Index[i].custItemGrpNo+'">     ';
				CNSL112SEL02_html += '  <tbody>                                                 ';
				CNSL112SEL02_html += '  <tr>                                                    ';
				CNSL112SEL02_html += tableIndex1
				CNSL112SEL02_html += '  </tr>                                                   ';
				CNSL112SEL02_html += tableIndex2;
				tableIndex1 = '';
				tableIndex2 = '';
				colCnt = 0;
				type1Yn = false;
			} 
			CNSL112SEL02_html += '</tbody></table></div>';
		} 
	}
	$("#CNSL112SEL02").html(CNSL112SEL02_html);
	
	setTimeout(function() {
		afterCNSL112SEL02(comboDataCNSL112SEL02);
		tabCNSL112Load('false');
	}, 100);
}

function createCNSL112SEL02_NEW(data) {

	comboDataCNSL112SEL02 = [];

	var CNSL112SEL02_html = '';
	CNSL112_aJsonArray = new Array();
	CNSL112SEL02Index = JSON.parse(data.CNSL162SEL02);
	var CNSL112SEL02IndexLen = CNSL112SEL02Index.length;
	var CNSL112SEL02_title = '';
	var CNSL112SEL02_layout_flag = '';
	var CNSL112SEL02_layout_row_flag = '';
	
	var tableIndex1 = '';
	var tableIndex2 = '';
	var colCnt = 0;
	var type1Yn = false;
	var rowNum = 1;
	
	if ( CNSL112SEL02IndexLen > 0 ) {
		CNSL112_pgmId = CNSL112SEL02Index[0].pgmId;
		CNSL112_dataSrcDvCd = CNSL112SEL02Index[0].dataSrcDvCd;
	}
	
	for ( var i = 0; i < CNSL112SEL02IndexLen; i++ ) {
		var layoutItemId =  CNSL112SEL02Index[i].custItemGrpNo + '_' + CNSL112SEL02Index[i].custItemNo+ '_' + CNSL112SEL02Index[i].rowNo;
		if ( i != 0  && CNSL112SEL02_layout_flag != CNSL112SEL02Index[i].custItemGrpNo ) {
			if ( type1Yn ) {
				CNSL112SEL02_html += '  <div class="tableCnt_Row" style="margin-bottom:-1px;">  ';
				CNSL112SEL02_html += '  <table id="'+CNSL112SEL02Index[i].custItemGrpNo+'">     ';
				CNSL112SEL02_html += '  <tbody>                                                 ';
				CNSL112SEL02_html += '  <tr>                                                    ';
				CNSL112SEL02_html += tableIndex1
				CNSL112SEL02_html += '  </tr>                                                   ';
				CNSL112SEL02_html += tableIndex2;
				tableIndex1 = '';
				tableIndex2 = '';
				colCnt = 0;
				type1Yn = false;
				CNSL112SEL02_layout_row_flag = 0;
				rowNum = 1;
			} 
			CNSL112SEL02_html += '</tbody></table></div>';
		}
		if ( CNSL112SEL02_title != CNSL112SEL02Index[i].custItemGrpNo  || i == 0 )  {
			if (CNSL112SEL02Index[i].scrnDispDrctCd == '9') {
				CNSL112SEL02_html += '<h4 class="h4_tit">' + CNSL112SEL02Index[i].custItemGrpNm + '</h4>';
			}
			else if (CNSL112SEL02Index[i].scrnDispDrctCd == '1') {
				CNSL112SEL02_html += '<h4 class="h4_tit">' + CNSL112SEL02Index[i].custItemGrpNm +'</h4>';
			}
			
			CNSL112SEL02_title = CNSL112SEL02Index[i].custItemGrpNo;
		}
		
		if (CNSL112SEL02Index[i].scrnDispDrctCd == '9') {
			if ( CNSL112SEL02_layout_flag != CNSL112SEL02Index[i].custItemGrpNo || i == 0 ) {
				CNSL112SEL02_html += '<div class="tableCnt_Row"><table><colgroup><col style="width: auto" /><col style="width: auto" /><col style="width: auto" /><col style="width: auto" /></colgroup><tbody>';
				CNSL112SEL02_layout_flag = CNSL112SEL02Index[i].custItemGrpNo;
			}
			CNSL112SEL02_html += '<tr><th>'+CNSL112SEL02Index[i].mgntItemNm+'</th><td colspan="3">';
			
			switch (CNSL112SEL02Index[i].mgntItemTypCd) {
		        case "E":
		        	var urlLinkVal = CNSL112SEL02Index[i].linkUrl;
		        	CNSL112SEL02_html += '<span class="searchTextBox" style="width: 100%;" ><input voColId="'+CNSL112SEL02Index[i].voColId+'" crypTgtYn="'+CNSL112SEL02Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" class="customLayout E k-input" placeholder="검색하세요." style="width:40%" disabled /><button title="검색"></button><input voColId="'+CNSL112SEL02Index[i].voColId+'" crypTgtYn="'+CNSL112SEL02Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'Nm" class="customLayout E k-input" value="' + CNSL112SEL02Index[i].custItemDataNm+ '" disabled /></span>';
		            break;
		        case "I":
		        	CNSL112SEL02_html += '<input voColId="'+CNSL112SEL02Index[i].voColId+'" id="'+layoutItemId+'" class="customLayout I" style="width: 100%;" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled />';
		            break;
		        case "D":
		        	CNSL112SEL02_html += '<input voColId="'+CNSL112SEL02Index[i].voColId+'" id="'+layoutItemId+'" class="customLayout D datepicker" placeholder="" style="width: 100%;" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled />';
		            break;
		        case "C":
					
		        	comboDataCNSL112SEL02.push({"mgntItemCd":CNSL112SEL02Index[i].mgntItemCd});
		        	
		        	CNSL112T_ComboList.push({
						"mgntItemCd" 	: CNSL112SEL02Index[i].mgntItemCd,
						"layoutItemId" 	: layoutItemId,
					});
					
		        	CNSL112SEL02_html += '<input voColId="'+CNSL112SEL02Index[i].voColId+'" id="'+layoutItemId+'" class="customLayout C ' + CNSL112SEL02Index[i].mgntItemCd + ' k-input" placeholder="" style="width: 100%;" value="' + Utils.getComProp( [{"mgntItemCd":CNSL112SEL02Index[i].mgntItemCd}] ,  CNSL112SEL02Index[i].mgntItemCd ,CNSL112SEL02Index[i].custItemDataVlu  , 'comCdNm' ) + '" disabled />';
		            break;
		        case "N":
		        	CNSL112SEL02_html += '<input voColId="'+CNSL112SEL02Index[i].voColId+'" type="number" id="'+layoutItemId+'" class="customLayout N k-input" placeholder="" style="width: 100%;" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled />';
		            break;
		        case "T":
		        	if ( CNSL112SEL02Index[i].voColId == 'custId') {
		        		CNSL112SEL02_html += '<input voColId="'+CNSL112SEL02Index[i].voColId+'" type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + custId + '" disabled />';
		        	} else if(CNSL112SEL02Index[i].mgntItemCd == 'T0004'){
		        		CNSL112SEL02_html += '<span id="'+layoutItemId+'" class="span_drag_select">' + CNSL112SEL02Index[i].custItemDataVlu + '</span>';
		        	} else {
		        		
		        		if(CNSL112SEL02Index[i].mgntItemNm.includes('전화번호')){
		        			CNSL112SEL02Index[i].custItemDataVlu = Utils.AddHypToNumber(CNSL112SEL02Index[i].custItemDataVlu, 1);
		        		}
		        		CNSL112SEL02_html += '<input voColId="'+CNSL112SEL02Index[i].voColId+'" type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled />';
		        	}
		            break;
		    }
			CNSL112SEL02_html += '</td></tr>';
		}else if (CNSL112SEL02Index[i].scrnDispDrctCd == '1') {
			if ( CNSL112SEL02_layout_flag != CNSL112SEL02Index[i].custItemGrpNo || i == 0 ) {
				tableIndex2 = '';
				type1Yn = true;
				CNSL112SEL02_layout_flag = CNSL112SEL02Index[i].custItemGrpNo;
				tableIndex1 += '<th style="width:50px;">NO</th>';
			}
			
			if ( CNSL112SEL02_layout_row_flag != CNSL112SEL02Index[i].rowNo || i == 0 ) {
				tableIndex2 += '<tr>';
				CNSL112SEL02_layout_row_flag = CNSL112SEL02Index[i].rowNo;
				tableIndex2 += '<td><input value="' + rowNum + '" class="k-input" style="width:100%; border:white;" disabled/></td>'
				rowNum++;
			}
			
			if ( CNSL112SEL02Index[i].rowNo == 1 ) {
				tableIndex1 += '<th>'+CNSL112SEL02Index[i].mgntItemNm+'</th>';
			}  
			switch (CNSL112SEL02Index[i].mgntItemTypCd) {
		        case "E":
		        	var urlLinkVal = CNSL112SEL02Index[i].linkUrl; 
		        	tableIndex2 += '<td type="E"><span class="searchTextBox" style="width: 100%;" ><input voColId="'+CNSL112SEL02Index[i].voColId+'" crypTgtYn="'+CNSL112SEL02Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" class="customLayout E k-input" placeholder="검색하세요." style="width:40%" disabled /><button title="검색"></button><input voColId="'+CNSL112SEL02Index[i].voColId+'" crypTgtYn="'+CNSL112SEL02Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'Nm" class="customLayout E k-input" value="' + CNSL112SEL02Index[i].custItemDataNm+ '" disabled /></span></td>'
		            break;
		        case "I":
		        	tableIndex2 += '<td><input voColId="'+CNSL112SEL02Index[i].voColId+'" id="'+layoutItemId+'" class="customLayout I" style="width: 100%;" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled /></td>';
		            break;
		        case "D":
		        	tableIndex2 += '<td><input voColId="'+CNSL112SEL02Index[i].voColId+'" id="'+layoutItemId+'" class="customLayout D datepicker" placeholder="" style="width: 100%;" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled /></td>';
		            break;
		        case "C":
		        	comboDataCNSL112SEL02.push({"mgntItemCd":CNSL112SEL02Index[i].mgntItemCd});
		        	
		        	CNSL112T_ComboList.push({
						"mgntItemCd" 	: CNSL112SEL02Index[i].mgntItemCd,
						"layoutItemId" 	: layoutItemId,
					});
					
		        	tableIndex2 += '<td type="C"><input voColId="'+CNSL112SEL02Index[i].voColId+'" id="'+layoutItemId+'" class="customLayout C ' + CNSL112SEL02Index[i].mgntItemCd + ' k-input" placeholder="" style="width: 100%;" value="' + Utils.getComProp( [{"mgntItemCd":CNSL112SEL02Index[i].mgntItemCd}] ,  CNSL112SEL02Index[i].mgntItemCd ,CNSL112SEL02Index[i].custItemDataVlu  , 'comCdNm' ) + '" disabled /></td>';
		            break;
		        case "N":
		        	tableIndex2 += '<td><input voColId="'+CNSL112SEL02Index[i].voColId+'" type="number" id="'+layoutItemId+'" class="customLayout N k-input" placeholder="" style="width: 100%;" value="' + CNSL112SEL02Index[i].custItemDataVlu+ '" disabled /></td>';
		            break;
		        case "T":
		        	if ( CNSL112SEL02Index[i].voColId == 'custId') {
		        		tableIndex2 += '<td><input voColId="'+CNSL112SEL02Index[i].voColId+'" type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + custId + '" disabled /></td>';
		        	} else if(CNSL112SEL02Index[i].mgntItemCd == 'T0004'){
		        		tableIndex2 += '<td><span id="'+layoutItemId+'" class="span_drag_select">' + CNSL112SEL02Index[i].custItemDataVlu + '</span></td>';
		        	} else {
		        		
		        		if(CNSL112SEL02Index[i].mgntItemNm.includes('전화번호')){
		        			
		        			CNSL112SEL02Index[i].custItemDataVlu = Utils.AddHypToNumber(CNSL112SEL02Index[i].custItemDataVlu, 1);
		        		}
		        		tableIndex2 += '<td><input voColId="'+CNSL112SEL02Index[i].voColId+'" type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + CNSL112SEL02Index[i].custItemDataVlu + '" disabled /></td>';
		        	}
		            break;
		    }
		}
		if ( i == ( CNSL112SEL02IndexLen - 1 ) ) {
			if ( type1Yn ) {
				CNSL112SEL02_html += '  <div class="tableCnt_Row" style="margin-bottom:-1px;">  ';
				CNSL112SEL02_html += '  <table id="'+CNSL112SEL02Index[i].custItemGrpNo+'">     ';
				CNSL112SEL02_html += '  <tbody>                                                 ';
				CNSL112SEL02_html += '  <tr>                                                    ';
				CNSL112SEL02_html += tableIndex1
				CNSL112SEL02_html += '  </tr>                                                   ';
				CNSL112SEL02_html += tableIndex2;
				tableIndex1 = '';
				tableIndex2 = '';
				colCnt = 0;
				type1Yn = false;
			} 
			CNSL112SEL02_html += '</tbody></table></div>';
		} 
	}
	
	$("#CNSL112SEL02").html(CNSL112SEL02_html);

	afterCNSL112SEL02(comboDataCNSL112SEL02);
	tabCNSL112Load('false');
}


function CNSL112SEL02(data) {
	
	var CNSL112SEL02_html = '';
	CNSL112_aJsonArray = new Array();
	CNSL112SEL02Index = JSON.parse(data.CNSL112SEL02);
	var CNSL112SEL02IndexLen = CNSL112SEL02Index.length;
	
	for ( var i = 0; i < CNSL112SEL02IndexLen; i++ ) {
		var layoutItemId =  CNSL112SEL02Index[i].custItemGrpNo + '_' + CNSL112SEL02Index[i].custItemNo + '_' + CNSL112SEL02Index[i].rowNo;
		if ( CNSL112SEL02Index[i].custItemGrpNo != '1') {
			if (CNSL112SEL02Index[i].mgntItemTypCd == 'C') {
				var combobox = $("#CNSL112SEL02 #" + layoutItemId).data("kendoComboBox");
				if ( combobox != undefined ) 
					combobox.value(CNSL112SEL02Index[i].custItemDataVlu);
			}else {
				if(CNSL112SEL02Index[i].mgntItemCd == 'T0004'){
					$("#CNSL112SEL02 #" + layoutItemId).html(CNSL112SEL02Index[i].custItemDataVlu);
				} else {
					$("#CNSL112SEL02 #" + layoutItemId).val(CNSL112SEL02Index[i].custItemDataVlu);
				}
				
				if (CNSL112SEL02Index[i].mgntItemTypCd == 'E') {
					$("#CNSL112SEL02 #" + layoutItemId + 'Nm').val(CNSL112SEL02Index[i].custItemDataNm);
				}
				
			}
		}
	}
}

function afterCNSL112SEL02(comboDataCNSL112SEL02) {
	$(".CNSL112 .D").kendoDatePicker({ 
		format: "yyyy-MM-dd", 
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	$(".CNSL112 .I").kendoDateTimePicker({
		culture: "ko-KR",   
		footer: false, 
		format: "yyyy-MM-dd HH:mm", 
	}).data("kendoDateTimePicker");
	
	var data = { "codeList": 
		comboDataCNSL112SEL02
	};
    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList112,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
    
    setTimeout(function() {
    	//settingCNSL112SEL01();
    	CNSL112T_fnComboValueChange();
	}, 100);
}

function resultComboList112(data){

	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	CNSL112T_codeList = jsonDecode;

	Utils.customInterval('custId' , 1000 , 'cnsl112t')
		.then((res) => {
			setCNSL112SEL01();
		})
}

function custInitCNSL112() {
	$("#CNSL112SEL02 .customLayout.E").val('');
	$("#CNSL112SEL02 .customLayout.I").val('');
	$("#CNSL112SEL02 .customLayout.D").val('');
	$("#CNSL112SEL02 .customLayout.N").val('');
	$("#CNSL112SEL02 .customLayout.T").val('');
	$("#CNSL112SEL02 .customLayout.C").val('');
}

function CNSL112_tabLoad() {
	var SYSM301M_templateCardPath = GLOBAL.contextPath + "/tmpl/TEMPLATE_CARD";
	$("#tabCNSL112T").load(SYSM301M_templateCardPath, {
	    TEMPLATE_CARD_tenantId: GLOBAL.session.user.tenantId,
	    TEMPLATE_CARD_dataFrmId: "CNSL112T",
	    TEMPLATE_CARD_patFrmeCd: "F1"
	});
}

function openPopCNSL140P() {
	
	if ( custId == '') {
		Utils.alert(CNSL112T_langMap.get("CNSL112T.alert.noCustId"));
		return;
	} 
	let param = {
		custId : custId,
		custNm : custNm,
		callbackKey: "setCNSL112SEL01"
	};
	Utils.setCallbackFunction("setCNSL112SEL01", settingCNSL112SEL01);
	Utils.openPop(GLOBAL.contextPath + "/cnsl/CNSL140P", "CNSL140P", 650, 660, param);
}


function attCntChk() {
	var ajaxUrl;
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		ajaxUrl = "/cnsl/CNSL112SEL03";
	} else {
		ajaxUrl = "/cnsl/CNSL162SEL03";
	}
	
	var CNSL140P_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"custId" : custId
	};
	Utils.ajaxCall(ajaxUrl, JSON.stringify(CNSL140P_data), function (data) {
		
		var numCount;
		if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
			numCount = data.CNSL112SEL03;
		} else {
			numCount = data.CNSL162SEL03;
		}
		
		if ( numCount == 0 ) {
			$("#custAtt").removeClass('attention')
			$("#custAtt").text(CNSL112T_langMap.get("CNSL112T.button.custAtt"));
		} else {
			$("#custAtt").addClass('attention')
			$("#custAtt").text(CNSL112T_langMap.get("CNSL112T.button.custAtt")+"(" + numCount + ")");
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
	
	//kw---20240311 : BMH 무통화 추가 및 CNSL213T 상담저장 페이지 수정
	var handleNoCallCounselMode = function() {
		if(window['noCallCounselMode']) {
			CNSL100MTabClick("/bcs/cnsl/CNSL"+tabFrmCnslHistId)
			noCallCounselMode();
		} else {
			
			//1. 탭을 먼저 열고
			CNSL100MTabClick("/bcs/cnsl/CNSL"+tabFrmCnslHistId)
			
			//2. 1초 뒤에 상담이력저장에 있는 함수와 요소에 데이터를 넣을 거긱 때문에 로딩창 띄워주고
	        $('.modalWrap').removeClass('active');
	        
	        setTimeout(function() {
	        	
	        	//3. 무통화상태로 요소 셋팅
	            noCallCounselMode();
	        	
	        	//4. 로딩창을 없애준다
	            $('.modalWrap').addClass('active');
	            
	        }, 1000); // 2000 밀리초 = 2초
	    }
	}
	
	if(custSelMode == "find"){
		noCallListClearSelection(custSelMode);
		handleNoCallCounselMode();
	} else {
		Utils.confirm("'" + custNm + '(' + custId + ')' + "' 님의 무통화 상담 이력을 남기시겠습니까?", function(){
			noCallListClearSelection(custSelMode);
			handleNoCallCounselMode();
		});
	}
	
}


function custPhoneNumCall(){
	var custPhone = Utils.AddHypToNumber($("#" + CNSL112T_custPhoneNum).val(), 2);
	
	$("#txtTargetNumber").val(custPhone);
}
function custPhoneNumSms(){
	var custPhone = Utils.AddHypToNumber($("#" + CNSL112T_custPhoneNum).val(), 2);
	
	let param = {
			recvrTelNo 	: custPhone,
			custId 		: custId
		};
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM433P", "SYSM433P", 1200, 1110, param);
}

function CNSL112T_fnComboValueChange(){
	$.each(CNSL112T_ComboList, function(index, item){
		let comboValue = $("#" + item.layoutItemId).val();
		let comboCdNm = Utils.getComProp( CNSL112T_codeList ,  item.mgntItemCd  , comboValue,  'comCdNm' );
		$("#" + item.layoutItemId).val(comboCdNm);
		$("#" + item.layoutItemId).attr("type", "text");
	});
}