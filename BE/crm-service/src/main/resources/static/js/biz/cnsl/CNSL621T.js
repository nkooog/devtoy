$(document).ready(function() {
	
	//공통콤보 불러오기
	var data = { "codeList": [
		{"mgntItemCd":"C0172"}
	]};
    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : function(data) {
        	let jsonEncode = JSON.stringify(data.codeList);
        	let object=JSON.parse(jsonEncode);
        	let jsonDecode = JSON.parse(object);
        	Utils.setKendoComboBox(jsonDecode, "C0172", '.CNSL621 #gndr', ' ', false) ;
        },
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
    
	var tabCNSL621T = $("#tabCNSL621T").kendoTabStrip({
		animation: false,
		scrollable: false,  
	}).data("kendoTabStrip"); 
	tabCNSL621T.select(0);   
	
	var CNSL621_data = {
		"custId" : ''
	};
	var CNSL621_jsonStr = JSON.stringify(CNSL621_data);
	Utils.ajaxCall("/cnsl/CNSL621SEL02", CNSL621_jsonStr, createCNSL621SEL02);
});

function openPopCNSL111PUPT() {
	
	if ( custId == '') {
		Utils.alert("고객을 먼저 선택해주세요.");
		return;
	} 
	let param = {
			custId : custId,
			upsertFlg : 'U',
			callbackKey: "setCNSL111SEL01"
		};
	Utils.setCallbackFunction("setCNSL111SEL01", setCNSL621SEL01);
	Utils.openPop(GLOBAL.contextPath + "/cnsl/CNSL111P", "CNSL111P", 1000, 500, param);
}

function setCNSL621SEL01() {
	custInitCNSL621();
	var CNSL621_data = {
		"custId" : custId
	};
	var CNSL621_jsonStr = JSON.stringify(CNSL621_data);
	Utils.ajaxCall("/cnsl/CNSL621SEL01", CNSL621_jsonStr, CNSL621SEL01);
	Utils.ajaxCall("/cnsl/CNSL621SEL02", CNSL621_jsonStr, CNSL621SEL02);
}

function CNSL621SEL01(data) {
	var custInfo = JSON.parse(data.CNSL621SEL01);
	if ( custInfo != null ) {
		$(".CNSL621 #custId").val(custInfo.custId);
		$(".CNSL621 #custNm").val(custInfo.custNm);
//		$("#txtCustName").html('(' + custInfo.custNm + ')' );
		var combobox = $(".CNSL112 #gndr").data("kendoComboBox");
		combobox.value(custInfo.gndr);
		$(".CNSL621 #btdt").val(custInfo.btdt);
		$(".CNSL621 #owhmTelNo").val(custInfo.owhmTelNo);
		$(".CNSL621 #wkplTelNo").val(custInfo.wkplTelNo);
		$(".CNSL621 #mbleTelNo").val(custInfo.mbleTelNo);
		if ( cntcHistNo != '' || cntcHistNo != '0') {
			$(".CNSL113 #cntcCustNm").text(custInfo.custNm);
		}
		if ( custInfo.custId == GLOBAL.session.user.tenantId + '_1' ) {
			$(".CNSL621 #custUdt").attr("disabled", true);
		} else {
			$(".CNSL621 #custUdt").attr("disabled", false);
		}
	} 
}


var CNSL621_aJsonArray = new Array();

function createCNSL621SEL02(data) {
	var CNSL621SEL02_html = '';
	CNSL621_aJsonArray = new Array();
	CNSL621SEL02Index = JSON.parse(data.CNSL621SEL02);
	var CNSL621SEL02IndexLen = CNSL621SEL02Index.length;
	var CNSL621SEL02_title = '';
	var CNSL621SEL02_layout_flag = '';
	
	var tableIndex1 = '';
	var tableIndex2 = '';
	var colCnt = 0;
	var type1Yn = false;
	var comboDataCNSL621SEL02 = [];
	
	for ( var i = 0; i < CNSL621SEL02IndexLen; i++ ) {
		var layoutItemId =  CNSL621SEL02Index[i].custItemGrpNo + '_' + CNSL621SEL02Index[i].custItemNo;
		if ( i != 0  && CNSL621SEL02_layout_flag != CNSL621SEL02Index[i].custItemGrpNo ) {
			if ( type1Yn ) {
				CNSL621SEL02_html += '  <div class="tableCnt_Row" style="margin-bottom:-1px;">  ';
				CNSL621SEL02_html += '  <table>                                                 ';
				CNSL621SEL02_html += '  <tbody>                                                 ';
				CNSL621SEL02_html += '  <tr>                                                    ';
				CNSL621SEL02_html += tableIndex1
				CNSL621SEL02_html += '  </tr>                                                   ';
				CNSL621SEL02_html += '  <tr>                                                    ';
				CNSL621SEL02_html += tableIndex2;
				CNSL621SEL02_html += '  </tr>                                                   ';
				tableIndex1 = '';
				tableIndex2 = '';
				colCnt = 0;
				type1Yn = false;
			} 
			CNSL621SEL02_html += '</tbody></table></div>';
		}
		if ( CNSL621SEL02_title != CNSL621SEL02Index[i].custItemGrpNo  || i == 0 )  {
			CNSL621SEL02_html += '<h4 class="h4_tit">' + CNSL621SEL02Index[i].custItemGrpNm + '</h4>';
			CNSL621SEL02_title = CNSL621SEL02Index[i].custItemGrpNo;
		}
		
		if (CNSL621SEL02Index[i].scrnDispDrctCd == '9') {
			if ( CNSL621SEL02_layout_flag != CNSL621SEL02Index[i].custItemGrpNo || i == 0 ) {
				CNSL621SEL02_html += '<div class="tableCnt_Row"><table><colgroup><col style="width: auto" /><col style="width: auto" /><col style="width: auto" /><col style="width: auto" /></colgroup><tbody>';
				CNSL621SEL02_layout_flag = CNSL621SEL02Index[i].custItemGrpNo;
			}
			CNSL621SEL02_html += '<tr><th>'+CNSL621SEL02Index[i].mgntItemNm+'</th><td colspan="3">';
			
			switch (CNSL621SEL02Index[i].mgntItemTypCd) {
		        case "E":
		        	CNSL621SEL02_html += '<span class="searchTextBox" style="width: 100%;" ><input type="search" id="'+layoutItemId+'" value="' + CNSL621SEL02Index[i].custItemDataVlu+ '" class="customLayout E k-input" placeholder="검색하세요." style="width:40%" disabled /><button title="검색" disabled ></button><input type="search" id="'+layoutItemId+'Nm" class="customLayout E k-input" value="' + CNSL621SEL02Index[i].custItemDataNm+ '" disabled /></span>';
		            break;
		        case "I":
		        	CNSL621SEL02_html += '<input id="'+layoutItemId+'" class="customLayout I" style="width: 100%;" value="' + CNSL621SEL02Index[i].custItemDataVlu+ '" disabled />';
		            break;
		        case "D":
		        	CNSL621SEL02_html += '<input id="'+layoutItemId+'" class="customLayout D datepicker" placeholder="" style="width: 100%;" value="' + CNSL621SEL02Index[i].custItemDataVlu+ '" disabled />';
		            break;
		        case "C":
		        	comboDataCNSL621SEL02.push({"mgntItemCd":CNSL621SEL02Index[i].mgntItemCd});
		        	CNSL621SEL02_html += '<input id="'+layoutItemId+'" class="customLayout C ' + CNSL621SEL02Index[i].mgntItemCd + ' k-input" placeholder="" style="width: 100%;" value="' + CNSL621SEL02Index[i].custItemDataVlu+ '" disabled />';
		            break;
		        case "N":
		        	CNSL621SEL02_html += '<input type="number" id="'+layoutItemId+'" class="customLayout N k-input" placeholder="" style="width: 100%;" value="' + CNSL621SEL02Index[i].custItemDataVlu+ '" disabled />';
		            break;
		        case "T":
		        	CNSL621SEL02_html += '<input type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + CNSL621SEL02Index[i].custItemDataVlu+ '" disabled />';
		            break;
		    }
			CNSL621SEL02_html += '</td></tr>';
		}else if (CNSL621SEL02Index[i].scrnDispDrctCd == '1') {
			if ( CNSL621SEL02_layout_flag != CNSL621SEL02Index[i].custItemGrpNo || i == 0 ) {
				tableIndex2 = '';
				type1Yn = true;
				CNSL621SEL02_layout_flag = CNSL621SEL02Index[i].custItemGrpNo;
			}
			tableIndex1 += '<th>'+CNSL621SEL02Index[i].mgntItemNm+'</th>';
			switch (CNSL621SEL02Index[i].mgntItemTypCd) {
		        case "E":
		        	tableIndex2 += '<td><span class="searchTextBox" style="width: 100%;" ><input type="search" id="'+layoutItemId+'" value="' + CNSL621SEL02Index[i].custItemDataVlu+ '" class="customLayout E k-input" placeholder="검색하세요." style="width:40%" disabled /><button title="검색" disabled ></button><input type="search" id="'+layoutItemId+'Nm" class="customLayout E k-input" value="' + CNSL621SEL02Index[i].custItemDataNm+ '" disabled /></span></td>'
		            break;
		        case "I":
		        	tableIndex2 += '<td><input id="'+layoutItemId+'" class="customLayout I" style="width: 100%;" value="' + CNSL621SEL02Index[i].custItemDataVlu+ '" disabled /></td>';
		            break;
		        case "D":
		        	tableIndex2 += '<td><input id="'+layoutItemId+'" class="customLayout D datepicker" placeholder="" style="width: 100%;" value="' + CNSL621SEL02Index[i].custItemDataVlu+ '" disabled /></td>';
		            break;
		        case "C":
		        	comboDataCNSL621SEL02.push({"mgntItemCd":CNSL621SEL02Index[i].mgntItemCd});
		        	tableIndex2 += '<td><input id="'+layoutItemId+'" class="customLayout C ' + CNSL621SEL02Index[i].mgntItemCd + ' k-input" placeholder="" style="width: 100%;" value="' + CNSL621SEL02Index[i].custItemDataVlu+ '" disabled /></td>';
		            break;
		        case "N":
		        	tableIndex2 += '<td><input type="number" id="'+layoutItemId+'" class="customLayout N k-input" placeholder="" style="width: 100%;" value="' + CNSL621SEL02Index[i].custItemDataVlu+ '" disabled /></td>';
		            break;
		        case "T":
		        	tableIndex2 += '<td><input type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + CNSL621SEL02Index[i].custItemDataVlu+ '" disabled /></td>';
		            break;
		    }
			colCnt++;
		}
		if ( i == ( CNSL621SEL02IndexLen - 1 ) ) {
			if ( type1Yn ) {
				CNSL621SEL02_html += '  <div class="tableCnt_Row" style="margin-bottom:-1px;">  ';
				CNSL621SEL02_html += '  <table>                                                 ';
				CNSL621SEL02_html += '  <tbody>                                                 ';
				CNSL621SEL02_html += '  <tr>                                                    ';
				CNSL621SEL02_html += tableIndex1
				CNSL621SEL02_html += '  </tr>                                                   ';
				CNSL621SEL02_html += '  <tr>                                                    ';
				CNSL621SEL02_html += tableIndex2;
				CNSL621SEL02_html += '  </tr>                                                   ';
				tableIndex1 = '';
				tableIndex2 = '';
				colCnt = 0;
				type1Yn = false;
			} 
			CNSL621SEL02_html += '</tbody></table></div>';
		} 
	}
	$("#CNSL621SEL02").html(CNSL621SEL02_html);
	
	setTimeout(function() {
		afterCNSL621SEL02(comboDataCNSL621SEL02);
	}, 500);
}


function CNSL621SEL02(data) {
	var CNSL621SEL02_html = '';
	CNSL621_aJsonArray = new Array();
	CNSL621SEL02Index = JSON.parse(data.CNSL621SEL02);
	var CNSL621SEL02IndexLen = CNSL621SEL02Index.length;
	
	for ( var i = 0; i < CNSL621SEL02IndexLen; i++ ) {
		var layoutItemId =  CNSL621SEL02Index[i].custItemGrpNo + '_' + CNSL621SEL02Index[i].custItemNo;
		if (CNSL621SEL02Index[i].mgntItemTypCd == 'C') {
			var combobox = $("#CNSL621SEL02 #" + layoutItemId).data("kendoComboBox");
			combobox.value(CNSL621SEL02Index[i].custItemDataVlu);
		}else {
			$("#CNSL621SEL02 #" + layoutItemId).val(CNSL621SEL02Index[i].custItemDataVlu);
			if (CNSL621SEL02Index[i].mgntItemTypCd == 'E') {
				$("#CNSL621SEL02 #" + layoutItemId + 'Nm').val(CNSL621SEL02Index[i].custItemDataNm);
			}
		}
	}
}

function afterCNSL621SEL02(comboDataCNSL621SEL02) {
	$(".CNSL621 .D").kendoDatePicker({ 
		format: "yyyy-MM-dd", 
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	$(".CNSL621 .I").kendoDateTimePicker({
		culture: "ko-KR",   
		footer: false, 
		format: "yyyy-MM-dd HH:mm", 
	}).data("kendoDateTimePicker");
	
	if ( comboDataCNSL621SEL02.length != 0 ) {
		var data = { "codeList": 
			comboDataCNSL621SEL02
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
	} 
}

function resultComboList112(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	var mgntItemCd = '';
	for ( var i=0; i<jsonDecode.length; i++) {
		if ( mgntItemCd != jsonDecode[i].mgntItemCd) {
			mgntItemCd = jsonDecode[i].mgntItemCd;
			Utils.setKendoComboBox(jsonDecode, jsonDecode[i].mgntItemCd, '.CNSL621 .'+jsonDecode[i].mgntItemCd, ' ', false) ;
		}
	}
}

function custInitCNSL621() {
	$(".CNSL621 #custId").val('');
	$(".CNSL621 #custNm").val('');
	$(".CNSL621 #gndr").val('');
	$(".CNSL621 #btdt").val('');
	$(".CNSL621 #owhmTelNo").val('');
	$(".CNSL621 #wkplTelNo").val('');
	$(".CNSL621 #mbleTelNo").val('');
	$("#CNSL621SEL02 .customLayout").val('');
}
