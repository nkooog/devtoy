var upsertFlg = '';
var custId = '';
var CNSL161_pgmId = '';
var CNSL161_dataSrcDvCd = '';

$(document).ready(function () {
	upsertFlg = Utils.getUrlParam('upsertFlg');
	custId = Utils.getUrlParam('custId');
	
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		if ( upsertFlg == "I") {
			$(".popHeader").html('환자정보등록<button class="popClose" title="창닫기" onclick="window.close();"></button>')
		} else if ( upsertFlg == "U") {
			$(".popHeader").html('환자정보수정<button class="popClose" title="창닫기" onclick="window.close();"></button>')
		}
	} else {
		if ( upsertFlg == "I") {
			$(".popHeader").html('고객정보등록<button class="popClose" title="창닫기" onclick="window.close();"></button>')
		} else if ( upsertFlg == "U") {
			$(".popHeader").html('고객정보수정<button class="popClose" title="창닫기" onclick="window.close();"></button>')
		}
	}
	

	CNSL161_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"custId" : custId
	};
	
	CNSL161_jsonStr = JSON.stringify(CNSL161_data);
	Utils.ajaxCall("/cnsl/CNSL161SEL01", CNSL161_jsonStr, createCNSL161SEL01);
});

var CNSL161_aJsonArray = new Array();
var comboDataCNSL161SEL01 = [];

function createCNSL161SEL01(data) {
	let CNSL161SEL01_html = '';
	CNSL161_aJsonArray = new Array();
	CNSL161SEL01Index = JSON.parse(data.CNSL161SEL01);
	let CNSL161SEL01IndexLen = CNSL161SEL01Index.length;
	let CNSL161SEL01_title = '';
	let CNSL161SEL01_layout_flag = '';
	let CNSL161SEL01_layout_row_flag = '';
	
	let tableIndex1 = '';
	let tableIndex2 = '';
	let colCnt = 0;
	let type1Yn = false;
	let rowNum = 1;
	
	if ( CNSL161SEL01IndexLen > 0 ) {
		CNSL161_pgmId = CNSL161SEL01Index[0].pgmId;
		CNSL161_dataSrcDvCd = CNSL161SEL01Index[0].dataSrcDvCd;
	}
	 
	for ( var i = 0; i < CNSL161SEL01IndexLen; i++ ) {
		let layoutItemId =  CNSL161SEL01Index[i].custItemGrpNo + '_' + CNSL161SEL01Index[i].custItemNo+ '_' + CNSL161SEL01Index[i].rowNo;
		let mdtyYn = CNSL161SEL01Index[i].mdtyYn;
		let crypTgtYn = CNSL161SEL01Index[i].crypTgtYn;
		let mgntItemNm = CNSL161SEL01Index[i].mgntItemNm;
		
		if ( CNSL161SEL01Index[i].voColId == 'custId' ) {
			mdtyYn = 'N';
		}
		
		if ( i != 0  && CNSL161SEL01_layout_flag != CNSL161SEL01Index[i].custItemGrpNo ) {
			if ( type1Yn ) {
				CNSL161SEL01_html += '  <div class="tableCnt_Row" style="margin-bottom:15px;">  ';
				CNSL161SEL01_html += '  <table id="'+CNSL161SEL01Index[i].custItemGrpNo+'" dataSrcDvCd="'+CNSL161SEL01Index[i].dataSrcDvCd+'" pgmId="'+CNSL161SEL01Index[i].pgmId+'" >     ';
				CNSL161SEL01_html += '  <tbody>                                                 ';
				CNSL161SEL01_html += '  <tr>                                                    ';
				CNSL161SEL01_html += tableIndex1
				CNSL161SEL01_html += '  </tr>                                                   ';
				CNSL161SEL01_html += tableIndex2;
				tableIndex1 = '';
				tableIndex2 = '';
				colCnt = 0;
				type1Yn = false;
				CNSL161SEL01_layout_row_flag = 0;
				rowNum = 1;
			} 
			CNSL161SEL01_html += '</tbody></table></div>';
		}
		if ( CNSL161SEL01_title != CNSL161SEL01Index[i].custItemGrpNo  || i == 0 )  {
			if (CNSL161SEL01Index[i].scrnDispDrctCd == '9') {
				CNSL161SEL01_html += '<h4 class="h4_tit">' + CNSL161SEL01Index[i].custItemGrpNm + '</h4>';
			}
			else if (CNSL161SEL01Index[i].scrnDispDrctCd == '1') {
				CNSL161SEL01_html += '<h4 class="h4_tit">' + CNSL161SEL01Index[i].custItemGrpNm;
				CNSL161SEL01_html += '<span class="btZoon" style="margin-right: 70px"><button class="btnRefer_default" onclick="addCustInfo(\''+CNSL161SEL01Index[i].custItemGrpNo+'\');">추가</button></span>';
				CNSL161SEL01_html += '<span class="btZoon"><button class="btnRefer_default" onclick="delCustInfo(\''+CNSL161SEL01Index[i].custItemGrpNo+'\');">삭제</button></span></h4>';
			}
			CNSL161SEL01_title = CNSL161SEL01Index[i].custItemGrpNo;
		}
		
		if (CNSL161SEL01Index[i].scrnDispDrctCd == '9') {
			if ( CNSL161SEL01_layout_flag != CNSL161SEL01Index[i].custItemGrpNo || i == 0 ) {
				CNSL161SEL01_html += '<div class="tableCnt_Row"><table id="'+CNSL161SEL01Index[i].custItemGrpNo+'" dataSrcDvCd="'+CNSL161SEL01Index[i].dataSrcDvCd+'"><colgroup><col style="width: auto" /><col style="width: auto" /><col style="width: auto" /><col style="width: auto" /></colgroup><tbody>';
				CNSL161SEL01_layout_flag = CNSL161SEL01Index[i].custItemGrpNo;
			}
			if ( mdtyYn == 'Y') {
				CNSL161SEL01_html += '<tr><th class="neceMark">'+mgntItemNm+'</th><td colspan="3">';
			} else {
				CNSL161SEL01_html += '<tr><th>'+mgntItemNm+'</th><td colspan="3">';
			}
			switch (CNSL161SEL01Index[i].mgntItemTypCd) {
		        case "E":
		        	var urlLinkVal = CNSL161SEL01Index[i].linkUrl;
		        	CNSL161SEL01_html += '<span class="searchTextBox" style="width: 100%;" ><input voColId="'+CNSL161SEL01Index[i].voColId+'" crypTgtYn="'+CNSL161SEL01Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn +'" value="' + CNSL161SEL01Index[i].custItemDataVlu + '" class="customLayout E k-input" placeholder="검색하세요." style="width:40%" disabled /><button title="검색" onclick="CNSL161P_EtypePop(\''+urlLinkVal+'\',this)" ></button><input crypTgtYn="'+CNSL161SEL01Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'Nm" class="customLayout E k-input" value="' + CNSL161SEL01Index[i].custItemDataNm+ '" disabled /></span>';
		            break;
		        case "I":
		        	CNSL161SEL01_html += '<input voColId="'+CNSL161SEL01Index[i].voColId+'" crypTgtYn="'+CNSL161SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout I" style="width: 100%;" value="' + CNSL161SEL01Index[i].custItemDataVlu + '"  />';
		            break;
		        case "D":
		        	CNSL161SEL01_html += '<input voColId="'+CNSL161SEL01Index[i].voColId+'" crypTgtYn="'+CNSL161SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout D datepicker" placeholder="" style="width: 100%;" value="' + CNSL161SEL01Index[i].custItemDataVlu + '"  />';
		            break;
		        case "C":
		        	comboDataCNSL161SEL01.push({"mgntItemCd":CNSL161SEL01Index[i].mgntItemCd});
		        	CNSL161SEL01_html += '<input voColId="'+CNSL161SEL01Index[i].voColId+'" crypTgtYn="'+CNSL161SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout C ' + CNSL161SEL01Index[i].mgntItemCd + ' k-input" placeholder="" style="width: 100%;" value="' + CNSL161SEL01Index[i].custItemDataVlu + '"  />';
		            break;
		        case "N":
		        	CNSL161SEL01_html += '<input type="number" voColId="'+CNSL161SEL01Index[i].voColId+'" crypTgtYn="'+CNSL161SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout N k-input" placeholder="" style="width: 100%;" value="' + CNSL161SEL01Index[i].custItemDataVlu + '"  />';
		            break;
		        case "T":
		        	if ( CNSL161SEL01Index[i].voColId == 'custId') {
		        		CNSL161SEL01_html += '<input type="text" voColId="'+CNSL161SEL01Index[i].voColId+'" crypTgtYn="'+CNSL161SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + custId + '"  disabled/>';
		        	}else {
		        		CNSL161SEL01_html += '<input type="text" voColId="'+CNSL161SEL01Index[i].voColId+'" crypTgtYn="'+CNSL161SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + CNSL161SEL01Index[i].custItemDataVlu + '"  />';
		        	}
		            break;
		    }
			CNSL161SEL01_html += '</td></tr>';
		}else if (CNSL161SEL01Index[i].scrnDispDrctCd == '1') {
			if ( CNSL161SEL01_layout_flag != CNSL161SEL01Index[i].custItemGrpNo || i == 0 ) {
				tableIndex2 = '';
				type1Yn = true;
				CNSL161SEL01_layout_flag = CNSL161SEL01Index[i].custItemGrpNo;
				tableIndex1 += '<th style="width:30px;"></th>';
				tableIndex1 += '<th style="width:50px;">NO</th>';
			}
			
			if ( CNSL161SEL01_layout_row_flag != CNSL161SEL01Index[i].rowNo || i == 0 ) {
				tableIndex2 += '<tr>';
				CNSL161SEL01_layout_row_flag = CNSL161SEL01Index[i].rowNo;
				if ( CNSL161SEL01_layout_row_flag == 1 ) {
					tableIndex2 += '<td><input class="k-checkbox k-checkbox-md k-rounded-md layoutItemRow" value="'+layoutItemId+'" data-role="checkbox" aria-label="Deselect row" aria-checked="true" type="checkbox" disabled></td>'
				}  else {
					tableIndex2 += '<td><input class="k-checkbox k-checkbox-md k-rounded-md layoutItemRow" value="'+layoutItemId+'" data-role="checkbox" aria-label="Deselect row" aria-checked="true" type="checkbox"></td>'
				}
				tableIndex2 += '<td><input value="' + rowNum + '" class="k-input" style="width:100%; border:white;" disabled/></td>'
				rowNum++;
			}
			
			if ( CNSL161SEL01Index[i].rowNo == 1 ) {
				if ( mdtyYn == 'Y') {
					tableIndex1 += '<th class="neceMark">'+mgntItemNm+'</th>';
				} else {
					tableIndex1 += '<th>'+mgntItemNm+'</th>';
				}
			}  
			switch (CNSL161SEL01Index[i].mgntItemTypCd) {
		        case "E":
		        	var urlLinkVal = CNSL161SEL01Index[i].linkUrl; 
		        	tableIndex2 += '<td type="E"><span class="searchTextBox" style="width: 100%;" ><input voColId="'+CNSL161SEL01Index[i].voColId+'" crypTgtYn="'+CNSL161SEL01Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" value="' + CNSL161SEL01Index[i].custItemDataVlu + '" class="customLayout E k-input" placeholder="검색하세요." style="width:40%" disabled /><button title="검색" onclick="CNSL161P_EtypePop(\''+urlLinkVal+'\', this)" ></button><input crypTgtYn="'+CNSL161SEL01Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'Nm" class="customLayout E k-input" value="' + CNSL161SEL01Index[i].custItemDataNm+ '" disabled /></span></td>'
		            break;
		        case "I":
		        	tableIndex2 += '<td><input voColId="'+CNSL161SEL01Index[i].voColId+'" crypTgtYn="'+CNSL161SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout I" style="width: 100%;" value="' + CNSL161SEL01Index[i].custItemDataVlu + '"  /></td>';
		            break;
		        case "D":
		        	tableIndex2 += '<td><input voColId="'+CNSL161SEL01Index[i].voColId+'" crypTgtYn="'+CNSL161SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout D datepicker" placeholder="" style="width: 100%;" value="' + CNSL161SEL01Index[i].custItemDataVlu + '"  /></td>';
		            break;
		        case "C":
		        	comboDataCNSL161SEL01.push({"mgntItemCd":CNSL161SEL01Index[i].mgntItemCd});
		        	tableIndex2 += '<td type="C"><input voColId="'+CNSL161SEL01Index[i].voColId+'" crypTgtYn="'+CNSL161SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout C ' + CNSL161SEL01Index[i].mgntItemCd + ' k-input" placeholder="" style="width: 100%;" value="' + CNSL161SEL01Index[i].custItemDataVlu + '"  /></td>';
		            break;
		        case "N":
		        	tableIndex2 += '<td><input voColId="'+CNSL161SEL01Index[i].voColId+'" type="number" crypTgtYn="'+CNSL161SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout N k-input" placeholder="" style="width: 100%;" value="' + CNSL161SEL01Index[i].custItemDataVlu + '"  /></td>';
		            break;
		        case "T":
		        	if ( CNSL161SEL01Index[i].voColId == 'custId') {
		        		tableIndex2 += '<td><input voColId="'+CNSL161SEL01Index[i].voColId+'" type="text" voColId="'+CNSL161SEL01Index[i].voColId+'" crypTgtYn="'+CNSL161SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + custId + '"  disabled/></td>';
		        	} else {
		        		tableIndex2 += '<td><input voColId="'+CNSL161SEL01Index[i].voColId+'" type="text" crypTgtYn="'+CNSL161SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + CNSL161SEL01Index[i].custItemDataVlu + '"  /></td>';
		        	}
		            break;
		    }
		}
		if ( i == ( CNSL161SEL01IndexLen - 1 ) ) {
			if ( type1Yn ) {
				CNSL161SEL01_html += '  <div class="tableCnt_Row" style="margin-bottom:-1px;">  ';
				CNSL161SEL01_html += '  <table id="'+CNSL161SEL01Index[i].custItemGrpNo+'">     ';
				CNSL161SEL01_html += '  <tbody>                                                 ';
				CNSL161SEL01_html += '  <tr>                                                    ';
				CNSL161SEL01_html += tableIndex1
				CNSL161SEL01_html += '  </tr>                                                   ';
				CNSL161SEL01_html += tableIndex2;
				tableIndex1 = '';
				tableIndex2 = '';
				colCnt = 0;
				type1Yn = false;
			} 
			CNSL161SEL01_html += '</tbody></table></div>';
		} 
	}
	$("#CNSL161SEL01").html(CNSL161SEL01_html);
	
	setTimeout(function() {
		afterCNSL161SEL01(comboDataCNSL161SEL01);
	}, 100);
}



function afterCNSL161SEL01(comboDataCNSL161SEL01) {
	$(".CNSL161 .D").kendoDatePicker({ 
		format: "yyyy-MM-dd", 
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	$(".CNSL161 .I").kendoDateTimePicker({
		culture: "ko-KR",   
		footer: false, 
		format: "yyyy-MM-dd HH:mm", 
	}).data("kendoDateTimePicker");
	
	var data = { "codeList": 
		comboDataCNSL161SEL01
	};
    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList161,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
}

function resultComboList161(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	var mgntItemCd = '';
	for ( var i=0; i<jsonDecode.length; i++) {
		if ( mgntItemCd != jsonDecode[i].mgntItemCd) {
			mgntItemCd = jsonDecode[i].mgntItemCd;
			$(".CNSL161 ."+jsonDecode[i].mgntItemCd).html('');
			Utils.setKendoComboBox(jsonDecode, jsonDecode[i].mgntItemCd, '.CNSL161 .'+jsonDecode[i].mgntItemCd, '', false) ;
		}
	}
	setTimeout(function() {
		setCNSL161SEL01();
	}, 100);
}

function custInitCNSL161() {
	$("#CNSL161SEL01 .customLayout").each(function() {
		if ($(this).attr("class").indexOf('C') === -1) {
			$(this).val('')
		} 
	})
}

function setCustInfo() {
	var CNSL113_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"usrId" : GLOBAL.session.user.usrId,
		"orgCd" : GLOBAL.session.user.orgCd,
	};
	
	var upsertURL1 = "/cnsl/CNSL161INS01";
	var upsertURL2 = "/cnsl/CNSL161INS02";
	let saveFlag = true;
	
	//필수값 체크
	$("#CNSL161SEL01 .customLayout").each(function() {
		if ( $(this).attr("mdtyYn") == 'Y' && $(this).val() == '' ) {
			Utils.alert( $(this).attr("mgntItemNm") + " 필수값 입니다.");
			saveFlag = false;
			return false;
		}
	});
	
	if ( saveFlag ) {
		if ( upsertFlg == "I") {
			Utils.ajaxCall(upsertURL1, JSON.stringify(CNSL113_data), function (result) {
				$("#CNSL161SEL01 table").each(function(){
					if ( $(this).attr("dataSrcDvCd") == "D" ) {
						$(this).find(".customLayout").each(function() {
							if ( $(this).attr("id") != undefined && !$(this).attr("id").includes('Nm'))  {
								var CNSL161custItemDataVlu = '';
								var CNSL161custItemDataNm = '';
								if ($(this).val() != undefined) {
									CNSL161custItemDataVlu = $(this).val();
								}
								if ($("#" + $(this).attr("id") + "Nm").val() != undefined) {
									CNSL161custItemDataNm = $("#" + $(this).attr("id") + "Nm").val();
								}
								if ( $(this).attr("voColId") == 'custId' ) {
									CNSL161custItemDataVlu = GLOBAL.session.user.tenantId + '_' + result.result;
								} 
								let CNSL113_data2 = {
									"tenantId" : GLOBAL.session.user.tenantId,
									"usrId" : GLOBAL.session.user.usrId,
									"orgCd" : GLOBAL.session.user.orgCd,
									"custItemGrpNo" : $(this).attr("id").split("_")[0],
									"custItemNo" : $(this).attr("id").split("_")[1],
									"rowNo" : $(this).attr("id").split("_")[2],
									"custNo" : result.result,
									"custItemDataVlu" : CNSL161custItemDataVlu,
									"custItemDataNm" : CNSL161custItemDataNm,
									"crypTgtYn" : $(this).attr("crypTgtYn")
								};
								Utils.ajaxCall(upsertURL2, JSON.stringify(CNSL113_data2), function (result) {
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
			$("#CNSL161SEL01 table").each(function(){
				if ( $(this).attr("dataSrcDvCd") == "D" ) {
					$(this).find(".customLayout").each(function() {
						if ( $(this).attr("id") != undefined && !$(this).attr("id").includes('Nm'))  {
							var CNSL161custItemDataVlu = '';
							var CNSL161custItemDataNm = '';
							if ($(this).val() != undefined) {
								CNSL161custItemDataVlu = $(this).val();
							} 
							if ($("#" + $(this).attr("id") + "Nm").val() != undefined) {
								CNSL161custItemDataNm = $("#" + $(this).attr("id") + "Nm").val();
							}
							let CNSL113_data2 = {
								"tenantId" : GLOBAL.session.user.tenantId,
								"usrId" : GLOBAL.session.user.usrId,
								"orgCd" : GLOBAL.session.user.orgCd,
								"custItemGrpNo" : $(this).attr("id").split("_")[0],
								"custItemNo" : $(this).attr("id").split("_")[1],
								"rowNo" : $(this).attr("id").split("_")[2],
								"custNo" : custId.split("_")[1],
								"custItemDataVlu" : CNSL161custItemDataVlu,
								"custItemDataNm" : CNSL161custItemDataNm,
								"crypTgtYn" : $(this).attr("crypTgtYn")
							};
							Utils.ajaxCall(upsertURL2, JSON.stringify(CNSL113_data2), function (result) {
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

function setCNSL161SEL01() {
	if ( upsertFlg == "U") {
		$("#CNSL161SEL01 table").each(function(){
			if ( $(this).attr("dataSrcDvCd") == "D" ) {
				let CNSL161_data = {
					"tenantId" : GLOBAL.session.user.tenantId,
					"custId" : Utils.getUrlParam('custId'),
					"custItemGrpNo" : $(this).attr("dataSrcDvCd")
				};
				let CNSL161_jsonStr = JSON.stringify(CNSL161_data);
				Utils.ajaxCall("/cnsl/CNSL161SEL01", CNSL161_jsonStr, CNSL161SEL01);
			} else if ( $(this).attr("dataSrcDvCd") == "I" ) {
				let CNSL161_data = {
					"tenantId" : GLOBAL.session.user.tenantId,
					"usrId"	: GLOBAL.session.user.usrId,
					"voColId" : "custId", 
					"srchTxt" : custId,
					"custId" : custId,
					"encryptYn": Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1,
					"type" : "SEL"
				};
				let CNSL161_jsonStr = JSON.stringify(CNSL161_data);
				Utils.ajaxCall(CNSL161_pgmId, CNSL161_jsonStr, CNSL161SEL01);
			}
		});
	} else {
		custInitCNSL161();
	}
}

function CNSL161SEL01(data) {
	
	if ( CNSL161_dataSrcDvCd  == "D" ) {
		var CNSL161SEL01_html = '';
		CNSL161_aJsonArray = new Array();
		CNSL161SEL01Index = JSON.parse(data.CNSL161SEL01);
		var CNSL161SEL01IndexLen = CNSL161SEL01Index.length;
		
		for ( var i = 0; i < CNSL161SEL01IndexLen; i++ ) {
			var layoutItemId =  CNSL161SEL01Index[i].custItemGrpNo + '_' + CNSL161SEL01Index[i].custItemNo + '_' + CNSL161SEL01Index[i].rowNo;
			if (CNSL161SEL01Index[i].mgntItemTypCd == 'C') {
				var combobox = $("#CNSL161SEL01 #" + layoutItemId).data("kendoComboBox");
				if ( combobox != undefined ) 
					combobox.value(CNSL161SEL01Index[i].custItemDataVlu);
			}else {
				if ( CNSL161SEL01Index[i].voColId == 'custId') {
					$("#CNSL161SEL01 #" + layoutItemId).val(custId);
				} else {
					$("#CNSL161SEL01 #" + layoutItemId).val(CNSL161SEL01Index[i].custItemDataVlu);
				}
				if (CNSL161SEL01Index[i].mgntItemTypCd == 'E') {
					$("#CNSL161SEL01 #" + layoutItemId + 'Nm').val(CNSL161SEL01Index[i].custItemDataNm);
				}
			}
		}
	} else if ( CNSL161_dataSrcDvCd  == "I" ) {
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

var eLayoutItemVal = '';
var eLyoutItemNm = ''
	

function CNSL161P_EtypePop(urlLink, Obj) {
	eLayoutItemVal = $(Obj).prev().attr("id");
	eLyoutItemNm = $(Obj).next().attr("id");
	
    switch (urlLink){
		case "/sysm/SYSM101P":
			Utils.setCallbackFunction("CNSL161P_SYSM101P", CNSL161P_SYSM101P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL161P_SYSM101P", 780, 550, {callbackKey: "CNSL161P_SYSM101P", objGubun:"name"});
    		break;
		case "/sysm/SYSM214P":
			Utils.setCallbackFunction("CNSL161P_SYSM214P", CNSL161P_SYSM214P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL161P_SYSM214P", 780, 550, {callbackKey: "CNSL161P_SYSM214P"});
    		break;
		case "/sysm/SYSM213P":
			Utils.setCallbackFunction("CNSL161P_SYSM213P", CNSL161P_SYSM213P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL161P_SYSM213P", 780, 550, {callbackKey: "CNSL161P_SYSM213P"});
    		break;
		case "/sysm/SYSM241P":
			Utils.setCallbackFunction("CNSL161P_SYSM241P", CNSL161P_SYSM241P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL161P_SYSM241P", 780, 550, {callbackKey: "CNSL161P_SYSM241P"});
			break;
		case "/sysm/SYSM335P":
			Utils.setCallbackFunction("CNSL161P_SYSM335P", CNSL161P_SYSM335P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL161P_SYSM335P", 780, 550, {callbackKey: "CNSL161P_SYSM335P"});
    		break;
		case "/comm/COMM110P":
			Utils.setCallbackFunction("CNSL161P_COMM110P", CNSL161P_COMM110P);
			Utils.openPop(GLOBAL.contextPath + urlLink, "CNSL161P_COMM110P", 780, 550, {callbackKey: "CNSL161P_COMM110P"});
    		break;
	}
    
}

//테넌트 ID만 뿌리는중 수정 필요 ( 테넌트명 )
function CNSL161P_SYSM101P(item) {
	$("#CNSL161SEL01 #" + eLayoutItemVal).val(item.tenantId);
	$("#CNSL161SEL01 #" + eLyoutItemNm).val(item.fmnm);
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}

function CNSL161P_SYSM214P(item) {
	$("#CNSL161SEL01 #" + eLayoutItemVal).val(item.usrId);
	$("#CNSL161SEL01 #" + eLyoutItemNm).val(item.decUsrNm);
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}

function CNSL161P_SYSM213P(item) {
	if ( item.length != 1 ) {
		Utils.alert("하나의 항목을 선택해주세요.");
		return;
	} else {
		$("#CNSL161SEL01 #" + eLayoutItemVal).val(item[0].id);
		$("#CNSL161SEL01 #" + eLyoutItemNm).val(item[0].orgNm);
	}
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}

function CNSL161P_SYSM241P(item) {
	$("#CNSL161SEL01 #" + eLayoutItemVal).val(item.mgntItemCd);
	$("#CNSL161SEL01 #" + eLyoutItemNm).val(item.mgntItemCdNm);
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}

function CNSL161P_SYSM335P(item) {
	$("#CNSL161SEL01 #" + eLayoutItemVal).val(item.comCd);
	$("#CNSL161SEL01 #" + eLyoutItemNm).val(item.comCdNm);
	eLayoutItemVal = '';
	eLyoutItemNm = '';
}

function CNSL161P_COMM110P(item) {
	$("#CNSL161SEL01 #" + eLayoutItemVal).val(item.zoneNo);
	$("#CNSL161SEL01 #" + eLyoutItemNm).val(item.roadnmAddr);
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
			newRow.insertCell(i).innerHTML = $(table.rows[rowCnt-1]).find("td").eq(i).html()
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
			
			var data = { "codeList": 
				comboDataCNSL161SEL01
			};
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
		        	Utils.setKendoComboBox(jsonDecode, addCustInfoRowComboCd, '.CNSL161 #'+addCustInfoRowComboId, '', false);
		        },
		        error       : function(request,status, error){
		        	console.log("[error]");
		        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
		        }
		    });
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
				var CNSL161DEL01_data = {
						"tenantId" : GLOBAL.session.user.tenantId,
						"custItemGrpNo" : delIndex[0],
						"rowNo" : delIndex[2],
						"custId" : Utils.getUrlParam('custId')
					};
				Utils.ajaxCall("/cnsl/CNSL161DEL01", JSON.stringify(CNSL161DEL01_data), function (result) {
					window.opener.settingCNSL112SEL01();
				});
			} 
			$(this).parent().parent().remove();
		} 
	})
	
}
