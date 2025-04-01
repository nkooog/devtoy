var upsertFlg = '';
var neceChk1 = '';
var neceChk3 = '';

var CNSL111_aJsonArray = new Array();
var comboDataCNSL111SEL01 = [];
var custId = '';
var CNSL111_pgmId = '';
var CNSL111_dataSrcDvCd = '';

//kw---20240220 : 인입번호 자동 입력 추가
var CNSL111_custTelNum = '';

$(document).ready(function () {
	
	custId 			= Utils.getUrlParam('custId');
	upsertFlg	 	= Utils.getUrlParam('upsertFlg');
	
	//kw---20240220 : 인입번호 자동 입력 추가
	if(!Utils.isNull(Utils.getUrlParam('custTelNum')) && Utils.getUrlParam('custTelNum').startsWith('010')){
		CNSL111_custTelNum 		= Utils.getUrlParam('custTelNum');
	}
	
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		if ( upsertFlg == "I") {
			$(".popHeader").html('환자정보등록<button class="popClose" title="창닫기" onclick="window.close();"></button>');
		} else if ( upsertFlg == "U") {
			$(".popHeader").html('환자정보수정<button class="popClose" title="창닫기" onclick="window.close();"></button>');
		}
	} else {
		if ( upsertFlg == "I") {
			$(".popHeader").html('고객정보등록<button class="popClose" title="창닫기" onclick="window.close();"></button>');
		} else if ( upsertFlg == "U") {
			$(".popHeader").html('고객정보수정<button class="popClose" title="창닫기" onclick="window.close();"></button>');
		}
	}
	
	CNSL111_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"custId" : custId,
	};
	
	CNSL111_jsonStr = JSON.stringify(CNSL111_data);
	
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		Utils.ajaxCall("/cnsl/CNSL111SEL02", CNSL111_jsonStr, createCNSL111SEL02);
	} else {
		Utils.ajaxCall("/cnsl/CNSL161SEL01", CNSL111_jsonStr, createCNSL111SEL01);
	}
	
});

function createCNSL111SEL01(data) {
	
	let CNSL111SEL01_html = '';
	CNSL111_aJsonArray = new Array();
	CNSL111SEL01Index = JSON.parse(data.CNSL161SEL01);
	let CNSL111SEL01IndexLen = CNSL111SEL01Index.length;
	let CNSL111SEL01_title = '';
	let CNSL111SEL01_layout_flag = '';
	let CNSL111SEL01_layout_row_flag = '';
	
	let tableIndex1 = '';
	let tableIndex2 = '';
	let colCnt = 0;
	let type1Yn = false;
	let rowNum = 1;
	
	let testNum = 0;
	
	let indexNum = '';
	
	if ( CNSL111SEL01IndexLen > 0 ) {
		CNSL111_pgmId = CNSL111SEL01Index[0].pgmId;
		CNSL111_dataSrcDvCd = CNSL111SEL01Index[0].dataSrcDvCd;
	}
	
	for ( var i = 0; i < CNSL111SEL01IndexLen; i++ ) {
		let layoutItemId =  CNSL111SEL01Index[i].custItemGrpNo + '_' + CNSL111SEL01Index[i].custItemNo+ '_' + CNSL111SEL01Index[i].rowNo;
		let mdtyYn = CNSL111SEL01Index[i].mdtyYn;
		let crypTgtYn = CNSL111SEL01Index[i].crypTgtYn;
		let mgntItemNm = CNSL111SEL01Index[i].mgntItemNm;
		
		if ( CNSL111SEL01_title != CNSL111SEL01Index[i].custItemGrpNo  || i == 0 )  {
			
			if(testNum != CNSL111SEL01Index[i].custItemGrpNo && i != 0){
				
				if (CNSL111SEL01Index[i-1].scrnDispDrctCd == '9') {
					CNSL111SEL01_html += '</tbody></table></div>';
				} else {
					CNSL111SEL01_html += '<tr>';
					CNSL111SEL01_html += tableIndex1
					CNSL111SEL01_html += '</tr>';
					CNSL111SEL01_html += tableIndex2;
					CNSL111SEL01_html += '</tbody></table></div>';
					
					tableIndex1 = '';
					tableIndex2 = '';
					
					colCnt = 0;
					rowNum = 1;
					
					CNSL111SEL01_layout_row_flag = 0;
				}
			}
				
			testNum = CNSL111SEL01Index[i].custItemGrpNo;
			
			if (CNSL111SEL01Index[i].scrnDispDrctCd == '9') {
				CNSL111SEL01_html += '<h4 class="h4_tit">' + CNSL111SEL01Index[i].custItemGrpNm + '</h4>';
			}
			else if (CNSL111SEL01Index[i].scrnDispDrctCd == '1') {
				CNSL111SEL01_html += '<h4 class="h4_tit">' + CNSL111SEL01Index[i].custItemGrpNm;
				CNSL111SEL01_html += '<span class="btZoon" style="margin-right: 70px"><button class="btnRefer_default" onclick="addCustInfo(\''+CNSL111SEL01Index[i].custItemGrpNo+'\');">추가</button></span>';
				CNSL111SEL01_html += '<span class="btZoon"><button class="btnRefer_default" onclick="delCustInfo(\''+CNSL111SEL01Index[i].custItemGrpNo+'\');">삭제</button></span></h4>';
			}
			CNSL111SEL01_title = CNSL111SEL01Index[i].custItemGrpNo;
		}
		
		if (CNSL111SEL01Index[i].scrnDispDrctCd == '9') {
			if ( CNSL111SEL01_layout_flag != CNSL111SEL01Index[i].custItemGrpNo || i == 0 ) {
				CNSL111SEL01_html += '<div class="tableCnt_Row"><table id="'+CNSL111SEL01Index[i].custItemGrpNo+'" dataSrcDvCd="'+CNSL111SEL01Index[i].dataSrcDvCd+'" pgmId="'+CNSL111SEL01Index[i].pgmId+'"><colgroup><col style="width: auto" /><col style="width: auto" /><col style="width: auto" /><col style="width: auto" /></colgroup><tbody>';
				CNSL111SEL01_layout_flag = CNSL111SEL01Index[i].custItemGrpNo;
			}
			
			if ( mdtyYn == 'Y') {
				CNSL111SEL01_html += '<tr><th class="neceMark">'+mgntItemNm+'</th><td colspan="3">';
			} else {
				CNSL111SEL01_html += '<tr><th>'+mgntItemNm+'</th><td colspan="3">';
			}
			switch (CNSL111SEL01Index[i].mgntItemTypCd) {
		        case "E":
		        	var urlLinkVal = CNSL111SEL01Index[i].linkUrl;
		        	CNSL111SEL01_html += '<span class="searchTextBox" style="width: 100%;" ><input voColId="'+CNSL111SEL01Index[i].voColId+'" crypTgtYn="'+CNSL111SEL01Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn +'" value="' + CNSL111SEL01Index[i].custItemDataVlu + '" class="customLayout E k-input" placeholder="검색하세요." style="width:40%" disabled /><button title="검색" onclick="CNSL111P_EtypePop(\''+urlLinkVal+'\',this)" ></button><input crypTgtYn="'+CNSL111SEL01Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'Nm" class="customLayout E k-input" value="' + CNSL111SEL01Index[i].custItemDataNm+ '" disabled /></span>';
		            break;
		        case "I":
		        	CNSL111SEL01_html += '<input voColId="'+CNSL111SEL01Index[i].voColId+'" crypTgtYn="'+CNSL111SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout I" style="width: 100%;" value="' + CNSL111SEL01Index[i].custItemDataVlu + '"  />';
		            break;
		        case "D":
		        	CNSL111SEL01_html += '<input voColId="'+CNSL111SEL01Index[i].voColId+'" crypTgtYn="'+CNSL111SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout D datepicker" placeholder="" style="width: 100%;" value="' + CNSL111SEL01Index[i].custItemDataVlu + '"  />';
		            break;
		        case "C":
		        	comboDataCNSL111SEL01.push({"mgntItemCd":CNSL111SEL01Index[i].mgntItemCd});
		        	CNSL111SEL01_html += '<input voColId="'+CNSL111SEL01Index[i].voColId+'" crypTgtYn="'+CNSL111SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout C ' + CNSL111SEL01Index[i].mgntItemCd + ' k-input" placeholder="" style="width: 100%;" value="' + CNSL111SEL01Index[i].custItemDataVlu + '"  />';
		            break;
		        case "N":
		        	CNSL111SEL01_html += '<input type="number" voColId="'+CNSL111SEL01Index[i].voColId+'" crypTgtYn="'+CNSL111SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout N k-input" placeholder="" style="width: 100%;" value="' + CNSL111SEL01Index[i].custItemDataVlu + '"  />';
		            break;
		        case "T":
		        	//kw---20240220 : 인입번호 자동 입력 추가
		        	if ( upsertFlg == "I" && CNSL111SEL01Index[i].mgntItemCd == 'T0009') {
		        		CNSL111SEL01Index[i].custItemDataVlu = CNSL111_custTelNum;
		        	}		        	
		        	
		        	if ( CNSL111SEL01Index[i].voColId == 'custId') {
		        		CNSL111SEL01_html += '<input type="text" voColId="'+CNSL111SEL01Index[i].voColId+'" crypTgtYn="'+CNSL111SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + custId + '"  disabled/>';
		        	}else {
		        		CNSL111SEL01_html += '<input type="text" voColId="'+CNSL111SEL01Index[i].voColId+'" crypTgtYn="'+CNSL111SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + CNSL111SEL01Index[i].custItemDataVlu + '"  />';
		        	}
		            break;
		    }
			CNSL111SEL01_html += '</td></tr>';
		}else if (CNSL111SEL01Index[i].scrnDispDrctCd == '1') {
			
			if ( CNSL111SEL01_layout_flag != CNSL111SEL01Index[i].custItemGrpNo) {
				
				CNSL111SEL01_html += '  <div class="tableCnt_Row" style="margin-bottom:15px;">  ';
				CNSL111SEL01_html += '  <table id="'+CNSL111SEL01Index[i].custItemGrpNo+'" dataSrcDvCd="'+CNSL111SEL01Index[i].dataSrcDvCd+'" pgmId="'+CNSL111SEL01Index[i].pgmId+'" >     ';
				
				tableIndex2 = '';
				type1Yn = true;
				CNSL111SEL01_layout_flag = CNSL111SEL01Index[i].custItemGrpNo;
				tableIndex1 += '<th style="width:30px;"></th>';
				tableIndex1 += '<th style="width:50px;">NO</th>';
			}
			
			if ( CNSL111SEL01_layout_row_flag != CNSL111SEL01Index[i].rowNo || i == 0 ) {
				tableIndex2 += '<tr>';
				CNSL111SEL01_layout_row_flag = CNSL111SEL01Index[i].rowNo;
				if ( CNSL111SEL01_layout_row_flag == 1 ) {
					tableIndex2 += '<td><input class="k-checkbox k-checkbox-md k-rounded-md layoutItemRow" value="'+layoutItemId+'" data-role="checkbox" aria-label="Deselect row" aria-checked="true" type="checkbox" disabled></td>'
				}  else {
					tableIndex2 += '<td><input class="k-checkbox k-checkbox-md k-rounded-md layoutItemRow" value="'+layoutItemId+'" data-role="checkbox" aria-label="Deselect row" aria-checked="true" type="checkbox"></td>'
				}
				tableIndex2 += '<td><input value="' + rowNum + '" class="k-input" style="width:100%; border:white;" disabled/></td>'
				rowNum++;
			}
			
			if ( CNSL111SEL01Index[i].rowNo == 1 ) {
				if ( mdtyYn == 'Y') {
					tableIndex1 += '<th class="neceMark">'+mgntItemNm+'</th>';
				} else {
					tableIndex1 += '<th>'+mgntItemNm+'</th>';
				}
			}  
			switch (CNSL111SEL01Index[i].mgntItemTypCd) {
		        case "E":
		        	var urlLinkVal = CNSL111SEL01Index[i].linkUrl; 
		        	tableIndex2 += '<td type="E"><span class="searchTextBox" style="width: 100%;" ><input voColId="'+CNSL111SEL01Index[i].voColId+'" crypTgtYn="'+CNSL111SEL01Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" value="' + CNSL111SEL01Index[i].custItemDataVlu + '" class="customLayout E k-input" placeholder="검색하세요." style="width:40%" disabled /><button title="검색" onclick="CNSL111P_EtypePop(\''+urlLinkVal+'\', this)" ></button><input crypTgtYn="'+CNSL111SEL01Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'Nm" class="customLayout E k-input" value="' + CNSL111SEL01Index[i].custItemDataNm+ '" disabled /></span></td>'
		            break;
		        case "I":
		        	tableIndex2 += '<td><input voColId="'+CNSL111SEL01Index[i].voColId+'" crypTgtYn="'+CNSL111SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout I" style="width: 100%;" value="' + CNSL111SEL01Index[i].custItemDataVlu + '"  /></td>';
		            break;
		        case "D":
		        	tableIndex2 += '<td><input voColId="'+CNSL111SEL01Index[i].voColId+'" crypTgtYn="'+CNSL111SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout D datepicker" placeholder="" style="width: 100%;" value="' + CNSL111SEL01Index[i].custItemDataVlu + '"  /></td>';
		            break;
		        case "C":
		        	comboDataCNSL111SEL01.push({"mgntItemCd":CNSL111SEL01Index[i].mgntItemCd});
		        	tableIndex2 += '<td type="C"><input voColId="'+CNSL111SEL01Index[i].voColId+'" crypTgtYn="'+CNSL111SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout C ' + CNSL111SEL01Index[i].mgntItemCd + ' k-input" placeholder="" style="width: 100%;" value="' + CNSL111SEL01Index[i].custItemDataVlu + '"  /></td>';
		            break;
		        case "N":
		        	tableIndex2 += '<td><input voColId="'+CNSL111SEL01Index[i].voColId+'" type="number" crypTgtYn="'+CNSL111SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout N k-input" placeholder="" style="width: 100%;" value="' + CNSL111SEL01Index[i].custItemDataVlu + '"  /></td>';
		            break;
		        case "T":
		        	//kw---20240220 : 인입번호 자동 입력 추가
		        	if ( upsertFlg == "I" && CNSL111SEL01Index[i].mgntItemCd == 'T0009') {
		        		CNSL111SEL01Index[i].custItemDataVlu = CNSL111_custTelNum;
		        	}
		        	
		        	if ( CNSL111SEL01Index[i].voColId == 'custId') {
		        		tableIndex2 += '<td><input voColId="'+CNSL111SEL01Index[i].voColId+'" type="text" voColId="'+CNSL111SEL01Index[i].voColId+'" crypTgtYn="'+CNSL111SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + custId + '"  disabled/></td>';
		        	} else {
		        		tableIndex2 += '<td><input voColId="'+CNSL111SEL01Index[i].voColId+'" type="text" crypTgtYn="'+CNSL111SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + CNSL111SEL01Index[i].custItemDataVlu + '"  /></td>';
		        	}
		            break;
		    }
		}
		if ( i == ( CNSL111SEL01IndexLen - 1 ) ) {
			if (CNSL111SEL01Index[i-1].scrnDispDrctCd == '9') {
				CNSL111SEL01_html += '</tbody></table></div>';
			} else {
				CNSL111SEL01_html += '<tr>';
				CNSL111SEL01_html += tableIndex1
				CNSL111SEL01_html += '</tr>';
				CNSL111SEL01_html += tableIndex2;
				CNSL111SEL01_html += '</tbody></table></div>';
				
				tableIndex1 = '';
				tableIndex2 = '';
				
				colCnt = 0;
				type1Yn = false;
				CNSL111SEL01_layout_row_flag = 0;
				rowNum = 1;
			}
		}
	}
	 
	$("#CNSL111SEL02").html(CNSL111SEL01_html);
	
	setTimeout(function() {
		afterCNSL111SEL01(comboDataCNSL111SEL01);
	}, 100);
}

function afterCNSL111SEL01(comboDataCNSL111SEL01) {
	$(".CNSL111 .D").kendoDatePicker({ 
		format: "yyyy-MM-dd", 
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	$(".CNSL111 .I").kendoDateTimePicker({
		culture: "ko-KR",   
		footer: false, 
		format: "yyyy-MM-dd HH:mm", 
	}).data("kendoDateTimePicker");
	
	var data = { "codeList": 
		comboDataCNSL111SEL01
	};
    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList111_2,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
}

function resultComboList111_2(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	var mgntItemCd = '';
	for ( var i=0; i<jsonDecode.length; i++) {
		if ( mgntItemCd != jsonDecode[i].mgntItemCd) {
			mgntItemCd = jsonDecode[i].mgntItemCd;
			$(".CNSL161 ."+jsonDecode[i].mgntItemCd).html('');
			
			var itemValue;
			$('.CNSL111 .'+jsonDecode[i].mgntItemCd).each(function() {
			    var value = $(this).val(); // 각 요소의 value 값을 가져옴
//
			    var id = $(this).attr('id'); // 각 요소의 ID 값을 가져옴
			    
			    if(!Utils.isNull(id)){
			    	Utils.setKendoComboBox(jsonDecode, jsonDecode[i].mgntItemCd, "#"+id, value, false) ;
			    	
			    	//kw---20240220 : 고객ID경로코드를 비활성화/CRM고객ID로 고정 시키기
			    	if(jsonDecode[i].mgntItemCd == "C0118"){
			    		$("#"+id).data("kendoComboBox").enable(false);
			    		$("#"+id).data("kendoComboBox").value("2");
			    	}
			    }
			});
		}
	}	
	
	setTimeout(function() {
		setCNSL111SEL01();
	}, 100);
}

function CNSL111SEL01(data) {
	
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		var custInfo = JSON.parse(data.CNSL111SEL01);
		
		if ( custInfo != null ) {
			var combobox = $(".CNSL111 #1_1_1").data("kendoComboBox");
			combobox.value(custInfo.custIdPathCd);
			$(".CNSL111 #1_2_1").val(custInfo.custId);
			$(".CNSL111 #1_3_1").val(custInfo.custNm);
			var combobox = $(".CNSL111 #1_4_1").data("kendoComboBox");
			combobox.value(custInfo.gndr);
			$(".CNSL111 #1_5_1").val(custInfo.btdt);
			$(".CNSL111 #1_6_1").val(maskingFunc.phone(custInfo.owhmTelNo));
			$(".CNSL111 #1_7_1").val(maskingFunc.phone(custInfo.wkplTelNo));
			$(".CNSL111 #1_8_1").val(maskingFunc.phone(custInfo.mbleTelNo));
		}
	} else {
		if ( CNSL111_dataSrcDvCd  == "D" ) {
			var CNSL111SEL01_html = '';
			CNSL111_aJsonArray = new Array();
			CNSL111SEL01Index = JSON.parse(data.CNSL161SEL01);
			var CNSL111SEL01IndexLen = CNSL111SEL01Index.length;
			
			for ( var i = 0; i < CNSL111SEL01IndexLen; i++ ) {
				var layoutItemId =  CNSL111SEL01Index[i].custItemGrpNo + '_' + CNSL111SEL01Index[i].custItemNo + '_' + CNSL111SEL01Index[i].rowNo;
				if (CNSL111SEL01Index[i].mgntItemTypCd == 'C') {
					var combobox = $("#CNSL111SEL02 #" + layoutItemId).data("kendoComboBox");
					if ( combobox != undefined ) 
						combobox.value(CNSL111SEL01Index[i].custItemDataVlu);
				}else {
					
					console.log("::::: 349");
					
					if ( CNSL111SEL01Index[i].voColId == 'custId') {
						$("#CNSL111SEL02 #" + layoutItemId).val(custId);
					} else {
						$("#CNSL111SEL02 #" + layoutItemId).val(CNSL111SEL01Index[i].custItemDataVlu);
					}
					if (CNSL111SEL01Index[i].mgntItemTypCd == 'E') {
						$("#CNSL111SEL02 #" + layoutItemId + 'Nm').val(CNSL111SEL01Index[i].custItemDataNm);
					}
				}
			}
		} else if ( CNSL111_dataSrcDvCd  == "I" ) {
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
	
}

var CNSL111_aJsonArray = new Array();
var comboDataCNSL111SEL02 = [];

function createCNSL111SEL02(data) {
	
	var CNSL111SEL02_html = '';
	CNSL111_aJsonArray = new Array();
	CNSL111SEL02Index = JSON.parse(data.CNSL111SEL02);
	var CNSL111SEL02IndexLen = CNSL111SEL02Index.length;
	var CNSL111SEL02_title = '';
	var CNSL111SEL02_layout_flag = '';
	var CNSL111SEL02_layout_row_flag = '';
	
	var tableIndex1 = '';
	var tableIndex2 = '';
	var colCnt = 0;
	var type1Yn = false;
	var rowNum = 1;
	
	for ( var i = 0; i < CNSL111SEL02IndexLen; i++ ) {
		var layoutItemId =  CNSL111SEL02Index[i].custItemGrpNo + '_' + CNSL111SEL02Index[i].custItemNo+ '_' + CNSL111SEL02Index[i].rowNo;
		
		if ( i != 0  && CNSL111SEL02_layout_flag != CNSL111SEL02Index[i].custItemGrpNo ) {
			if ( type1Yn ) {
				
				CNSL111SEL02_html += '  <div class="tableCnt_Row" style="margin-bottom:15px;">  ';
				CNSL111SEL02_html += '  <table id="'+CNSL111SEL02_title+'">     ';
				CNSL111SEL02_html += '  <tbody>                                                 ';
				CNSL111SEL02_html += '  <tr>                                                    ';
				CNSL111SEL02_html += tableIndex1
				CNSL111SEL02_html += '  </tr>                                                   ';
				CNSL111SEL02_html += tableIndex2;
				tableIndex1 = '';
				tableIndex2 = '';
				colCnt = 0;
				type1Yn = false;
				CNSL111SEL02_layout_row_flag = 0;
				rowNum = 1;
			} 
			CNSL111SEL02_html += '</tbody></table></div>';
		}
		if ( CNSL111SEL02_title != CNSL111SEL02Index[i].custItemGrpNo  || i == 0 )  {
			if (CNSL111SEL02Index[i].scrnDispDrctCd == '9') {
				CNSL111SEL02_html += '<h4 class="h4_tit">' + CNSL111SEL02Index[i].custItemGrpNm + '</h4>';
			}
			else if (CNSL111SEL02Index[i].scrnDispDrctCd == '1') {
				CNSL111SEL02_html += '<h4 class="h4_tit">' + CNSL111SEL02Index[i].custItemGrpNm;
				CNSL111SEL02_html += '<span class="btZoon" style="margin-right: 70px"><button class="btnRefer_default" onclick="addCustInfo(\''+CNSL111SEL02Index[i].custItemGrpNo+'\');">추가</button></span>';
				CNSL111SEL02_html += '<span class="btZoon"><button class="btnRefer_default" onclick="delCustInfo(\''+CNSL111SEL02Index[i].custItemGrpNo+'\');">삭제</button></span></h4>';
			}
			
			CNSL111SEL02_title = CNSL111SEL02Index[i].custItemGrpNo;
		}
		
		if (CNSL111SEL02Index[i].scrnDispDrctCd == '9') {
			if ( CNSL111SEL02_layout_flag != CNSL111SEL02Index[i].custItemGrpNo || i == 0 ) {
				CNSL111SEL02_html += '<div class="tableCnt_Row"><table><colgroup><col style="width: auto" /><col style="width: auto" /><col style="width: auto" /><col style="width: auto" /></colgroup><tbody>';
				CNSL111SEL02_layout_flag = CNSL111SEL02Index[i].custItemGrpNo;
			}
			if ( layoutItemId == "1_1_1" || layoutItemId == "1_3_1" ) {
				if ( layoutItemId == "1_1_1" ) {
					neceChk1 = CNSL111SEL02Index[i].mgntItemNm;
				} else if ( layoutItemId == "1_3_1" ) {
					neceChk3 = CNSL111SEL02Index[i].mgntItemNm;
				}
				CNSL111SEL02_html += '<tr><th class="neceMark">'+CNSL111SEL02Index[i].mgntItemNm+'</th><td colspan="3">';
			}else {
				CNSL111SEL02_html += '<tr><th>'+CNSL111SEL02Index[i].mgntItemNm+'</th><td colspan="3">';
			}
			switch (CNSL111SEL02Index[i].mgntItemTypCd) {
		        case "E":
		        	var urlLinkVal = CNSL111SEL02Index[i].linkUrl;
		        	CNSL111SEL02_html += '<span class="searchTextBox" style="width: 100%;" ><input crypTgtYn="'+CNSL111SEL02Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'" value="' + CNSL111SEL02Index[i].custItemDataVlu+ '" class="customLayout E k-input" placeholder="검색하세요." style="width:40%" disabled /><button title="검색" onclick="CNSL111P_EtypePop(\''+urlLinkVal+'\',this)" ></button><input crypTgtYn="'+CNSL111SEL02Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'Nm" class="customLayout E k-input" value="' + CNSL111SEL02Index[i].custItemDataNm+ '" disabled /></span>';
		            break;
		        case "I":
		        	CNSL111SEL02_html += '<input id="'+layoutItemId+'" class="customLayout I" style="width: 100%;" value="' + CNSL111SEL02Index[i].custItemDataVlu+ '"  />';
		            break;
		        case "D":
		        	CNSL111SEL02_html += '<input id="'+layoutItemId+'" class="customLayout D datepicker" placeholder="" style="width: 100%;" value="' + CNSL111SEL02Index[i].custItemDataVlu+ '"  />';
		            break;
		        case "C":
		        	comboDataCNSL111SEL02.push({"mgntItemCd":CNSL111SEL02Index[i].mgntItemCd});
		        	CNSL111SEL02_html += '<input id="'+layoutItemId+'" class="customLayout C ' + CNSL111SEL02Index[i].mgntItemCd + ' k-input" placeholder="" style="width: 100%;" value="' + CNSL111SEL02Index[i].custItemDataVlu+ '"  />';
		            break;
		        case "N":
		        	CNSL111SEL02_html += '<input type="number" id="'+layoutItemId+'" class="customLayout N k-input" placeholder="" style="width: 100%;" value="' + CNSL111SEL02Index[i].custItemDataVlu+ '"  />';
		            break;
		        case "T":		        	
		        	//kw---20240220 : 인입번호 자동 입력 추가
		        	if ( upsertFlg == "I" && CNSL111SEL02Index[i].mgntItemCd == 'T0009') {
		        		CNSL111SEL02Index[i].custItemDataVlu = CNSL111_custTelNum;
		        	}
		        	
		        	if ( layoutItemId == '1_2_1') {
		        		CNSL111SEL02_html += '<input type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + CNSL111SEL02Index[i].custItemDataVlu+ '"  disabled/>';
		        	}else {
		        		CNSL111SEL02_html += '<input type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + CNSL111SEL02Index[i].custItemDataVlu+ '"  />';
		        	}
		            break;
		    }
			CNSL111SEL02_html += '</td></tr>';
		}else if (CNSL111SEL02Index[i].scrnDispDrctCd == '1') {
			if ( CNSL111SEL02_layout_flag != CNSL111SEL02Index[i].custItemGrpNo || i == 0 ) {
				tableIndex2 = '';
				type1Yn = true;
				CNSL111SEL02_layout_flag = CNSL111SEL02Index[i].custItemGrpNo;
				tableIndex1 += '<th style="width:30px;"></th>';
				tableIndex1 += '<th style="width:50px;">NO</th>';
			}
			
			if ( CNSL111SEL02_layout_row_flag != CNSL111SEL02Index[i].rowNo || i == 0 ) {
				tableIndex2 += '<tr>';
				CNSL111SEL02_layout_row_flag = CNSL111SEL02Index[i].rowNo;
				if ( CNSL111SEL02_layout_row_flag == 1 ) {
					tableIndex2 += '<td><input class="k-checkbox k-checkbox-md k-rounded-md layoutItemRow" value="'+layoutItemId+'" data-role="checkbox" aria-label="Deselect row" aria-checked="true" type="checkbox" disabled></td>'
				}  else {
					tableIndex2 += '<td><input class="k-checkbox k-checkbox-md k-rounded-md layoutItemRow" value="'+layoutItemId+'" data-role="checkbox" aria-label="Deselect row" aria-checked="true" type="checkbox"></td>'
				}
				tableIndex2 += '<td><input value="' + rowNum + '" class="k-input" style="width:100%; border:white;" disabled/></td>'
				rowNum++;
			}
			
			if ( CNSL111SEL02Index[i].rowNo == 1 ) {
				tableIndex1 += '<th>'+CNSL111SEL02Index[i].mgntItemNm+'</th>';
			}  
			switch (CNSL111SEL02Index[i].mgntItemTypCd) {
		        case "E":
		        	var urlLinkVal = CNSL111SEL02Index[i].linkUrl; 
		        	tableIndex2 += '<td type="E"><span class="searchTextBox" style="width: 100%;" ><input crypTgtYn="'+CNSL111SEL02Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'" value="' + CNSL111SEL02Index[i].custItemDataVlu+ '" class="customLayout E k-input" placeholder="검색하세요." style="width:40%" disabled /><button title="검색" onclick="CNSL111P_EtypePop(\''+urlLinkVal+'\', this)" ></button><input crypTgtYn="'+CNSL111SEL02Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'Nm" class="customLayout E k-input" value="' + CNSL111SEL02Index[i].custItemDataNm+ '" disabled /></span></td>'
		            break;
		        case "I":
		        	tableIndex2 += '<td><input id="'+layoutItemId+'" class="customLayout I" style="width: 100%;" value="' + CNSL111SEL02Index[i].custItemDataVlu+ '"  /></td>';
		            break;
		        case "D":
		        	tableIndex2 += '<td><input id="'+layoutItemId+'" class="customLayout D datepicker" placeholder="" style="width: 100%;" value="' + CNSL111SEL02Index[i].custItemDataVlu+ '"  /></td>';
		            break;
		        case "C":
		        	comboDataCNSL111SEL02.push({"mgntItemCd":CNSL111SEL02Index[i].mgntItemCd});
		        	tableIndex2 += '<td type="C"><input id="'+layoutItemId+'" class="customLayout C ' + CNSL111SEL02Index[i].mgntItemCd + ' k-input" placeholder="" style="width: 100%;" value="' + CNSL111SEL02Index[i].custItemDataVlu+ '"  /></td>';
		            break;
		        case "N":
		        	tableIndex2 += '<td><input type="number" id="'+layoutItemId+'" class="customLayout N k-input" placeholder="" style="width: 100%;" value="' + CNSL111SEL02Index[i].custItemDataVlu+ '"  /></td>';
		            break;
		        case "T":
		        	//kw---20240220 : 인입번호 자동 입력 추가
		        	if ( upsertFlg == "I" && CNSL111SEL02Index[i].mgntItemCd == 'T0009') {
		        		CNSL111SEL01Index[i].custItemDataVlu = CNSL111_custTelNum;
		        	}
		        	
		        	tableIndex2 += '<td><input type="text" id="'+layoutItemId+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + CNSL111SEL02Index[i].custItemDataVlu+ '"  /></td>';
		            break;
		    }
		}
		if ( i == ( CNSL111SEL02IndexLen - 1 ) ) {
			
			if ( type1Yn ) {
				
				CNSL111SEL02_html += '  <div class="tableCnt_Row" style="margin-bottom:-1px;">  ';
				CNSL111SEL02_html += '  <table id="'+CNSL111SEL02Index[i].custItemGrpNo+'">     ';
				CNSL111SEL02_html += '  <tbody>                                                 ';
				CNSL111SEL02_html += '  <tr>                                                    ';
				CNSL111SEL02_html += tableIndex1
				CNSL111SEL02_html += '  </tr>                                                   ';
				CNSL111SEL02_html += tableIndex2;
				tableIndex1 = '';
				tableIndex2 = '';
				colCnt = 0;
				type1Yn = false;
			} 
			CNSL111SEL02_html += '</tbody></table></div>';
		} 
	}
	$("#CNSL111SEL02").html(CNSL111SEL02_html);
	
	setTimeout(function() {
		afterCNSL111SEL02(comboDataCNSL111SEL02);
	}, 100);
}



function afterCNSL111SEL02(comboDataCNSL111SEL02) {
	$(".CNSL111 .D").kendoDatePicker({ 
		format: "yyyy-MM-dd", 
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	$(".CNSL111 .I").kendoDateTimePicker({
		culture: "ko-KR",   
		footer: false, 
		format: "yyyy-MM-dd HH:mm", 
	}).data("kendoDateTimePicker");
	
	var data = { "codeList": 
		comboDataCNSL111SEL02
	};
    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList111,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
}

function resultComboList111(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	var mgntItemCd = '';
	for ( var i=0; i<jsonDecode.length; i++) {
		if ( mgntItemCd != jsonDecode[i].mgntItemCd) {
			mgntItemCd = jsonDecode[i].mgntItemCd;
			$(".CNSL111 ."+jsonDecode[i].mgntItemCd).html('');
			console.log(jsonDecode[i].mgntItemCd);
			Utils.setKendoComboBox(jsonDecode, jsonDecode[i].mgntItemCd, '.CNSL111 .'+jsonDecode[i].mgntItemCd, '', false) ;
			
			//kw---20240220 : 고객ID경로코드를 비활성화/CRM고객ID로 고정 시키기
			if(jsonDecode[i].mgntItemCd == "C0118"){
				$.each($('.CNSL111 .C0118'), function(index, item){
				    if(!Utils.isNull(item.id)){
				            $('#'+item.id).data("kendoComboBox").enable(false);
				            $("#"+item.id).data("kendoComboBox").value("2");
				    }
				});
			}
			
		}
	}
	
	if ( upsertFlg == "U") {
		setTimeout(function() {
			setCNSL111SEL01();
		}, 100);
	}
}

function custInitCNSL111() {
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		$("#CNSL111SEL02 .customLayout").val('');
	} else {
		$("#CNSL111SEL02 .customLayout").each(function() {
			console.log($(this));
			if ($(this).attr("class").indexOf('C') === -1) {
				if(Utils.isNull($(this).val())){
					$(this).val('');
				}
			} 
		});
	}
	
}

function setCustInfo() {
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		var custNmSrchkey1 = null;
		var custNmSrchkey2 = null;
		if ( $(".CNSL111 #1_1_1").val() == "" ) {
			Utils.alert(neceChk1 + "을 선택해주세요", function(){$(".CNSL111 #1_1_1").focus()});
			return;
		} 
		if ( $(".CNSL111 #1_3_1").val().length < 2 ) {
			Utils.alert(neceChk3 + "을 2자이상 입력해주세요.", function(){$(".CNSL111 #1_3_1").focus()});
			return;
		} 
		if ( $(".CNSL111 #1_3_1").val().length >= 1 ) {
			custNmSrchkey1 = $(".CNSL111 #1_3_1").val().substr(0,1);
		}
		if ( $(".CNSL111 #1_3_1").val().length >= 2 ) {
			custNmSrchkey2 = $(".CNSL111 #1_3_1").val().substr(0,2)
		}
		
		var CNSL113_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"usrId" : GLOBAL.session.user.usrId,
			"orgCd" : GLOBAL.session.user.orgCd,
			"custIdPathCd" : $(".CNSL111 #1_1_1").val(),
			"custId" : $(".CNSL111 #1_2_1").val(),
			"custNm" : $(".CNSL111 #1_3_1").val(),
			"custNmSrchkey1" : custNmSrchkey1,
			"custNmSrchkey2" : custNmSrchkey2,
			"gndr" : $(".CNSL111 #1_4_1").val(),
			"btdt" : $(".CNSL111 #1_5_1").val(),
			"owhmTelNo" : $(".CNSL111 #1_6_1").val().replace(/[^0-9]/g, ''),
			"wkplTelNo" : $(".CNSL111 #1_7_1").val().replace(/[^0-9]/g, ''),
			"mbleTelNo" : $(".CNSL111 #1_8_1").val().replace(/[^0-9]/g, ''),
			"encryptYn" : Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1
		};
		
		var upsertURL1 = "";
		var upsertURL2 = "/cnsl/CNSL111INS02";
		if ( upsertFlg == "I") {
			upsertURL1 = "/cnsl/CNSL111INS01";
		} else if ( upsertFlg == "U") {
			upsertURL1 = "/cnsl/CNSL111UPT01";
		}
		Utils.ajaxCall(upsertURL1, JSON.stringify(CNSL113_data), function (result) {
			$("#CNSL111SEL02 .customLayout").each(function() {
				if ( $(this).attr("id") != undefined && !$(this).attr("id").includes('Nm') && $(this).attr("id").charAt(0) != '1')  {
					var CNSL111custItemDataVlu = '';
					var CNSL111custItemDataNm = '';
					if ($(this).val() != undefined) {
						CNSL111custItemDataVlu = $(this).val();
					} 
					if ($("#" + $(this).attr("id") + "Nm").val() != undefined) {
						CNSL111custItemDataNm = $("#" + $(this).attr("id") + "Nm").val();
					}
					var CNSL113_data2 = {
						"tenantId" : GLOBAL.session.user.tenantId,
						"usrId" : GLOBAL.session.user.usrId,
						"orgCd" : GLOBAL.session.user.orgCd,
						"custItemGrpNo" : $(this).attr("id").split("_")[0],
						"custItemNo" : $(this).attr("id").split("_")[1],
						"rowNo" : $(this).attr("id").split("_")[2],
						"custNo" : result.result,
						"custItemDataVlu" : CNSL111custItemDataVlu,
						"custItemDataNm" : CNSL111custItemDataNm,
						"crypTgtYn" : $(this).attr("crypTgtYn")
					};
					Utils.ajaxCall(upsertURL2, JSON.stringify(CNSL113_data2), function (result) {
					});
				}
			})
			Utils.alert("고객정보가 저장되었습니다.", function () { 
				opener.prev_custId = '';
	        	Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
	    		self.close();
	        });
	    });
	} else {
		var CNSL111_data = {
				"tenantId" : GLOBAL.session.user.tenantId,
				"usrId" : GLOBAL.session.user.usrId,
				"orgCd" : GLOBAL.session.user.orgCd,
			};
			
			var upsertURL1 = "/cnsl/CNSL161INS01";
			var upsertURL2 = "/cnsl/CNSL161INS02";
			let saveFlag = true;
			
			//필수값 체크
			$("#CNSL111SEL02 .customLayout").each(function() {
				if ( $(this).attr("mdtyYn") == 'Y' && $(this).val() == '' ) {
					Utils.alert( $(this).attr("mgntItemNm") + " 필수값 입니다.");
					saveFlag = false;
					return false;
				}
			});
			
			if ( saveFlag ) {
				
				if ( upsertFlg == "I") {
					Utils.ajaxCall(upsertURL1, JSON.stringify(CNSL111_data), function (result) {
						$("#CNSL111SEL02 table").each(function(){
							if ( $(this).attr("dataSrcDvCd") == "D" ) {

								$(this).find(".customLayout").each(function() {
									if ( $(this).attr("id") != undefined && !$(this).attr("id").includes('Nm'))  {
										
										
										
										var CNSL111custItemDataVlu = '';
										var CNSL111custItemDataNm = '';
										var CNSL111custItemMemo = '';

										if ($(this).val() != undefined) {
											CNSL111custItemDataVlu = $(this).val();
										}
										if ($("#" + $(this).attr("id") + "Nm").val() != undefined) {
											CNSL111custItemDataNm = $("#" + $(this).attr("id") + "Nm").val();
										}
										if ( $(this).attr("voColId") == 'custId' ) {
											CNSL111custItemDataVlu = GLOBAL.session.user.tenantId + '_' + result.result;
										}
										if($(this).attr("data-role") == "combobox"){
											CNSL111custItemMemo = $(this).data("kendoComboBox").text();
											console.log(CNSL111custItemMemo);
										}
										
										
										let CNSL111_data2 = {
											"tenantId" 			: GLOBAL.session.user.tenantId,
											"usrId" 			: GLOBAL.session.user.usrId,
											"orgCd" 			: GLOBAL.session.user.orgCd,
											"custItemGrpNo" 	: $(this).attr("id").split("_")[0],
											"custItemNo" 		: $(this).attr("id").split("_")[1],
											"rowNo" 			: $(this).attr("id").split("_")[2],
											"custNo" 			: result.result,
											"custItemDataVlu" 	: CNSL111custItemDataVlu,
											"custItemDataNm" 	: CNSL111custItemDataNm,
											"crypTgtYn" 		: $(this).attr("crypTgtYn"),
											"memo" 				: CNSL111custItemMemo,
										};
										
										Utils.ajaxCall(upsertURL2, JSON.stringify(CNSL111_data2), function (result) {
										});
									}
								});
							} else if ( $(this).attr("dataSrcDvCd") == "I" ) {
								//인터페이스 영역
							}
						});

						Utils.alert("고객정보가 저장되었습니다.", function () { 
							opener.prev_custId = '';
				        	Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
				    		self.close();
				        });
				    });
				} else if ( upsertFlg == "U") {
					$("#CNSL111SEL02 table").each(function(){
						if ( $(this).attr("dataSrcDvCd") == "D" ) {
							$(this).find(".customLayout").each(function() {
								if ( $(this).attr("id") != undefined && !$(this).attr("id").includes('Nm'))  {
									
									var CNSL111custItemDataVlu = '';
									var CNSL111custItemDataNm = '';
									var CNSL111custItemMemo = '';
									var CNSL111CustNo = '';
									if ($(this).val() != undefined) {
										CNSL111custItemDataVlu = $(this).val();
									} 
									if ($("#" + $(this).attr("id") + "Nm").val() != undefined) {
										CNSL111custItemDataNm = $("#" + $(this).attr("id") + "Nm").val();
									}
									if($(this).attr("data-role") == "combobox"){
										CNSL111custItemMemo = $(this).data("kendoComboBox").text();
										console.log(CNSL111custItemMemo);
									}
									
									if(Utils.isNull(custId.split("_")[1])){
										CNSL111CustNo = custId;
									} else {
										CNSL111CustNo = custId.split("_")[1];
									}
									
									let CNSL111_data2 = {
										"tenantId" 				: GLOBAL.session.user.tenantId,
										"usrId" 				: GLOBAL.session.user.usrId,
										"orgCd" 				: GLOBAL.session.user.orgCd,
										"custItemGrpNo" 		: $(this).attr("id").split("_")[0],
										"custItemNo" 			: $(this).attr("id").split("_")[1],
										"rowNo" 				: $(this).attr("id").split("_")[2],
										"custNo" 				: CNSL111CustNo,
										"custItemDataVlu" 		: CNSL111custItemDataVlu,
										"custItemDataNm" 		: CNSL111custItemDataNm,
										"crypTgtYn" 			: $(this).attr("crypTgtYn"),
										"memo" 					: CNSL111custItemMemo,
									};

									if($(this).attr("data-role") == "combobox"){
										console.log(CNSL111_data2);
									}
									
									Utils.ajaxCall(upsertURL2, JSON.stringify(CNSL111_data2), function (result) {
									});
								}
							})
						} else if ( $(this).attr("dataSrcDvCd") == "I" ) {
							//인터페이스 영역
						}
						Utils.alert("고객정보가 저장되었습니다.", function () { 
							opener.prev_custId = '';
				        	Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
				    		self.close();
				        });
					});
				}
			}
	}
	 
}

function setCNSL111SEL01() {
	
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		if ( upsertFlg == "U") {
			var CNSL111_data = {
				"tenantId" : GLOBAL.session.user.tenantId,
				"custId" : Utils.getUrlParam('custId'),
				"encryptYn" : Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1
			};
			var CNSL111_jsonStr = JSON.stringify(CNSL111_data);
			Utils.ajaxCall("/cnsl/CNSL111SEL01", CNSL111_jsonStr, CNSL111SEL01);
			Utils.ajaxCall("/cnsl/CNSL111SEL02", CNSL111_jsonStr, CNSL111SEL02);
		} else {
			custInitCNSL111();
		}
	} else {
		if ( upsertFlg == "U") {
			$("#CNSL111SEL01 table").each(function(){
				if ( $(this).attr("dataSrcDvCd") == "D" ) {
					let CNSL111_data = {
						"tenantId" : GLOBAL.session.user.tenantId,
						"custId" : Utils.getUrlParam('custId'),
						"custItemGrpNo" : $(this).attr("dataSrcDvCd")
					};
					let CNSL111_jsonStr = JSON.stringify(CNSL111_data);
					Utils.ajaxCall("/cnsl/CNSL161SEL01", CNSL111_jsonStr, CNSL111SEL01);
				} else if ( $(this).attr("dataSrcDvCd") == "I" ) {
					let CNSL111_data = {
						"tenantId" : GLOBAL.session.user.tenantId,
						"usrId"	: GLOBAL.session.user.usrId,
						"voColId" : "custId", 
						"srchTxt" : custId,
						"custId" : custId,
						"encryptYn": Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1,
						"type" : "SEL"
					};
					let CNSL111_jsonStr = JSON.stringify(CNSL111_data);
					Utils.ajaxCall(CNSL111_pgmId, CNSL111_jsonStr, CNSL111SEL01);
				}
			});
		} else {
			
			custInitCNSL111();
		}
	}
	
}

function CNSL111SEL02(data) {
	var CNSL111SEL02_html = '';
	CNSL111_aJsonArray = new Array();
	CNSL111SEL02Index = JSON.parse(data.CNSL111SEL02);
	var CNSL111SEL02IndexLen = CNSL111SEL02Index.length;
	
	for ( var i = 0; i < CNSL111SEL02IndexLen; i++ ) {
		var layoutItemId =  CNSL111SEL02Index[i].custItemGrpNo + '_' + CNSL111SEL02Index[i].custItemNo + '_' + CNSL111SEL02Index[i].rowNo;
		if ( CNSL111SEL02Index[i].custItemGrpNo != '1') {
			if (CNSL111SEL02Index[i].mgntItemTypCd == 'C') {
				var combobox = $("#CNSL111SEL02 #" + layoutItemId).data("kendoComboBox");
				if ( combobox != undefined ) 
					combobox.value(CNSL111SEL02Index[i].custItemDataVlu);
			}else {
				$("#CNSL111SEL02 #" + layoutItemId).val(CNSL111SEL02Index[i].custItemDataVlu);
				if (CNSL111SEL02Index[i].mgntItemTypCd == 'E') {
					$("#CNSL111SEL02 #" + layoutItemId + 'Nm').val(CNSL111SEL02Index[i].custItemDataNm);
				}
			}
		} 
	}
}

var eLayoutItemVal = '';
var eLyoutItemNm = ''
	

function CNSL111P_EtypePop(urlLink, Obj) {
	eLayoutItemVal = $(Obj).prev().attr("id");
	eLyoutItemNm = $(Obj).next().attr("id");
	
    switch (urlLink){
		case "/sysm/SYSM101P":
			Utils.setCallbackFunction("CNSL111P_SYSM101P", CNSL111P_SYSM101P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL111P_SYSM101P", 780, 550, {callbackKey: "CNSL111P_SYSM101P", objGubun:"name"});
    		break;
		case "/sysm/SYSM214P":
			Utils.setCallbackFunction("CNSL111P_SYSM214P", CNSL111P_SYSM214P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL111P_SYSM214P", 780, 550, {callbackKey: "CNSL111P_SYSM214P"});
    		break;
		case "/sysm/SYSM213P":
			Utils.setCallbackFunction("CNSL111P_SYSM213P", CNSL111P_SYSM213P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL111P_SYSM213P", 780, 550, {callbackKey: "CNSL111P_SYSM213P"});
    		break;
		case "/sysm/SYSM241P":
			Utils.setCallbackFunction("CNSL111P_SYSM241P", CNSL111P_SYSM241P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL111P_SYSM241P", 780, 550, {callbackKey: "CNSL111P_SYSM241P"});
			break;
		case "/sysm/SYSM335P":
			Utils.setCallbackFunction("CNSL111P_SYSM335P", CNSL111P_SYSM335P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL111P_SYSM335P", 780, 550, {callbackKey: "CNSL111P_SYSM335P"});
    		break;
		case "/comm/COMM110P":
			Utils.setCallbackFunction("CNSL111P_COMM110P", CNSL111P_COMM110P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL111P_COMM110P", 780, 550, {callbackKey: "CNSL111P_COMM110P"});
    		break;
	}
    
}

//테넌트 ID만 뿌리는중 수정 필요 ( 테넌트명 )
function CNSL111P_SYSM101P(item) {
	$("#CNSL111SEL02 #" + eLayoutItemVal).val(item.tenantId);
	$("#CNSL111SEL02 #" + eLyoutItemNm).val(item.fmnm);
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}

function CNSL111P_SYSM214P(item) {
	$("#CNSL111SEL02 #" + eLayoutItemVal).val(item.usrId);
	$("#CNSL111SEL02 #" + eLyoutItemNm).val(item.decUsrNm);
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}

function CNSL111P_SYSM213P(item) {
	if ( item.length != 1 ) {
		Utils.alert("하나의 항목을 선택해주세요.");
		return;
	} else {
		$("#CNSL111SEL02 #" + eLayoutItemVal).val(item[0].id);
		$("#CNSL111SEL02 #" + eLyoutItemNm).val(item[0].orgNm);
	}
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}

function CNSL111P_SYSM241P(item) {
	$("#CNSL111SEL02 #" + eLayoutItemVal).val(item.mgntItemCd);
	$("#CNSL111SEL02 #" + eLyoutItemNm).val(item.mgntItemCdNm);
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}

function CNSL111P_SYSM335P(item) {
	$("#CNSL111SEL02 #" + eLayoutItemVal).val(item.comCd);
	$("#CNSL111SEL02 #" + eLyoutItemNm).val(item.comCdNm);
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}

function CNSL111P_COMM110P(item) {
	$("#CNSL111SEL02 #" + eLayoutItemVal).val(item.zoneNo);
	$("#CNSL111SEL02 #" + eLyoutItemNm).val(item.roadnmAddr);
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}
var addCustInfoRowComboId = '';
var addCustInfoRowComboCd = '';

function addCustInfo(ObjId) {
	const table = document.getElementById(ObjId);
	const rowCnt = table.rows.length;
	// 새 행(Row) 추가
	const newRow = table.insertRow();

	for ( var i=0; i<$(table.rows[rowCnt-1]).find("td").length; i++) {
		if (i == 0) {
			newRow.insertCell(i).innerHTML = '<input class="k-checkbox k-checkbox-md k-rounded-md layoutItemRow" value="new" data-role="checkbox" aria-label="Deselect row" aria-checked="true" type="checkbox">';
		}else if (i == 1) {
			newRow.insertCell(i).innerHTML = '<input value="'+(table.rows.length-1)+'" class="k-input" style="width:100%; border:white;" disabled/>';
		}else {
			newRow.insertCell(i).innerHTML = $(table.rows[rowCnt-1]).find("td").eq(i).html();
		}
	}
	
	for ( var i=2; i<$(newRow).find("td").length; i++) {
		var layoutItemType = $($(newRow).prev()).find("td").eq(i).attr("type");
		switch (layoutItemType){
		case "C":
			
			var addIndex = $(newRow).find("td").eq(i).find("input").eq(1).attr("id").split("_");
			var preIndex = $($(newRow).prev()).find("td").eq(i).find("input").eq(1).attr("id").split("_");
			
			$(newRow).find("td").eq(i).find("input").eq(1).attr("id", addIndex[0] + "_" + addIndex[1] + "_" + ( Number(preIndex[2]) + 1 ));
			addCustInfoRowComboId = $(newRow).find("td").eq(i).find("input").eq(1).attr("id");
			addCustInfoRowComboCd = $($(newRow).prev()).find("td").eq(i).find("input").eq(1).attr("class").split(" ")[2]; 
			
			$(newRow).find("td").eq(i).find("input").eq(1).prev().remove()
			$(newRow).find("td").eq(i).find("input").eq(1).prev().remove()
			$(newRow).find("td").eq(i).find("input").eq(1).prev().remove()
			$(newRow).find("td").eq(i).html($(newRow).find("span").html());
			$(newRow).find("td").eq(i).find("input").addClass(addCustInfoRowComboId);
			$(newRow).find("td").eq(i).attr("type",layoutItemType)
			
			
			
			if(true){
				(function(nId, nCode){
					
					if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
						var paramData = { 
								"codeList"	: comboDataCNSL111SEL02,
						};
					} else {
						var paramData = { 
								"codeList" 	: comboDataCNSL111SEL01,
						};
					}
					

				    $.ajax({
				    	url         : '/bcs/comm/COMM100SEL01',
				        type        : 'post',
				        dataType    : 'json', 
				        contentType : 'application/json; charset=UTF-8',
				        data        : JSON.stringify(paramData),
				        success     : function(data){
				        	let jsonEncode = JSON.stringify(data.codeList);
				        	let object=JSON.parse(jsonEncode);
				        	let jsonDecode = JSON.parse(object);
				        	Utils.setKendoComboBox(jsonDecode, nCode, '.CNSL111 #'+nId, '', false);
				        },
				        error       : function(request,status, error){
				        	console.log("[error]");
				        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
				        }
				    });
				})(addCustInfoRowComboId, addCustInfoRowComboCd);
			}
			
			

		    
    		break;
		case "E":
			var addIndex = $(newRow).find("td").eq(i).find("input").eq(0).attr("id").split("_");
			var preIndex = $($(newRow).prev()).find("td").eq(i).find("input").eq(0).attr("id").split("_");
			$(newRow).find("td").eq(i).find("input").eq(0).attr("id", addIndex[0] + "_" + addIndex[1] + "_" + ( Number(preIndex[2]) + 1 ));
			$(newRow).find("td").eq(i).find("input").eq(1).attr("id", addIndex[0] + "_" + addIndex[1] + "_" + ( Number(preIndex[2]) + 1 ) + "Nm");
			$(newRow).find("td").eq(i).find("input").eq(0).val('');
			$(newRow).find("td").eq(i).find("input").eq(1).val('');
    		break;
		default:
			var addIndex = $(newRow).find("td").eq(i).find("input").attr("id").split("_");
			var preIndex = $($(newRow).prev()).find("td").eq(i).find("input").attr("id").split("_");
			$(newRow).find("td").eq(i).find("input").attr("id", addIndex[0] + "_" + addIndex[1] + "_" + ( Number(preIndex[2]) + 1 ));
			$(newRow).find("td").eq(i).find("input").val('');
    		break;
		}
	}
}

function delCustInfo(ObjId) {
	const table = document.getElementById(ObjId);
	$(table).find(".layoutItemRow").each(function() {
		
		if ( $(this).is(":checked") ) {
			if ( $(this).val() != 'new') {
				var delIndex = $(this).val().split("_");
				var CNSL111DEL01_data = {
						"tenantId" : GLOBAL.session.user.tenantId,
						"custItemGrpNo" : delIndex[0],
						"rowNo" : delIndex[2],
						"custId" : Utils.getUrlParam('custId')
					};
				Utils.ajaxCall("/cnsl/CNSL111DEL01", JSON.stringify(CNSL111DEL01_data), function (result) {
					window.opener.settingCNSL112SEL01();
				});
			} 
			$(this).parent().parent().remove();
		} 
	})
	
}

//kw---20240109 추가
function CNSL111P_EtypePop(urlLink, Obj) {
	eLayoutItemVal = $(Obj).prev().attr("id");
	eLyoutItemNm = $(Obj).next().attr("id");
	
    switch (urlLink){
		case "/sysm/SYSM101P":
			Utils.setCallbackFunction("CNSL111P_SYSM101P", CNSL111P_SYSM101P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL111P_SYSM101P", 780, 550, {callbackKey: "CNSL111P_SYSM101P", objGubun:"name"});
    		break;
		case "/sysm/SYSM214P":
			Utils.setCallbackFunction("CNSL111P_SYSM214P", CNSL111P_SYSM214P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL111P_SYSM214P", 780, 550, {callbackKey: "CNSL111P_SYSM214P"});
    		break;
		case "/sysm/SYSM213P":
			Utils.setCallbackFunction("CNSL111P_SYSM213P", CNSL111P_SYSM213P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL111P_SYSM213P", 780, 550, {callbackKey: "CNSL111P_SYSM213P"});
    		break;
		case "/sysm/SYSM241P":
			Utils.setCallbackFunction("CNSL111P_SYSM241P", CNSL111P_SYSM241P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL111P_SYSM241P", 780, 550, {callbackKey: "CNSL111P_SYSM241P"});
			break;
		case "/sysm/SYSM335P":
			Utils.setCallbackFunction("CNSL111P_SYSM335P", CNSL111P_SYSM335P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL111P_SYSM335P", 780, 550, {callbackKey: "CNSL111P_SYSM335P"});
    		break;
		case "/comm/COMM110P":
			Utils.setCallbackFunction("CNSL111P_COMM110P", CNSL111P_COMM110P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL111P_COMM110P", 780, 550, {callbackKey: "CNSL111P_COMM110P"});
    		break;
	}
    
}

//테넌트 ID만 뿌리는중 수정 필요 ( 테넌트명 )
function CNSL111P_SYSM101P(item) {
	$("#CNSL111SEL02 #" + eLayoutItemVal).val(item.tenantId);
	$("#CNSL111SEL02 #" + eLyoutItemNm).val(item.fmnm);
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}

function CNSL111P_SYSM214P(item) {
	$("#CNSL111SEL02 #" + eLayoutItemVal).val(item.usrId);
	$("#CNSL111SEL02 #" + eLyoutItemNm).val(item.decUsrNm);
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}

function CNSL111P_SYSM213P(item) {
	if ( item.length != 1 ) {
		Utils.alert("하나의 항목을 선택해주세요.");
		return;
	} else {
		$("#CNSL111SEL02 #" + eLayoutItemVal).val(item[0].id);
		$("#CNSL111SEL02 #" + eLyoutItemNm).val(item[0].orgNm);
	}
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}


function CNSL111P_SYSM241P(item) {
	$("#CNSL111SEL02 #" + eLayoutItemVal).val(item.mgntItemCd);
	$("#CNSL111SEL02 #" + eLyoutItemNm).val(item.mgntItemCdNm);
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}

function CNSL111P_SYSM335P(item) {
	$("#CNSL111SEL02 #" + eLayoutItemVal).val(item.comCd);
	$("#CNSL111SEL02 #" + eLyoutItemNm).val(item.comCdNm);
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}

function CNSL111P_COMM110P(item) {
	$("#CNSL111SEL02 #" + eLayoutItemVal).val(item.zoneNo);
	$("#CNSL111SEL02 #" + eLyoutItemNm).val(item.roadnmAddr);
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}