/***********************************************************************************************
 * Program Name : 고객정보 엑셀 업로드 (CNSL116P.js)
 * Creator      : wkim
 * Create Date  : 2024.03.26
 * Description  : 고객정보 엑셀 업로드
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2024.03.26	  wkim				김운   
 ************************************************************************************************/

//kw---20240402 : 남은 작업
//1) 고객상세정보에 콥보박스 데이터들 넣어주기
//2) 고객번호 불러와서 넣어주기
//3) 저장, 삭제 기능 넣기

var CNSL116SEL01Index;
var grdCNSL116P_custId,grdCNSL116P_custNm;
var comboDataCNSL116SEL01 = [];
var CNSL116P_comboDataList = [];
var custId = '';

var CNSL116P_grid = new Array(1);
var CNSL116P_arrCustInfo = [];

var CNSL116P_custInfoItemId = [];
let CNSL116P_arrElId = [];
let CNSL116P_arrVoId = [];

var CNSL116P_resultTest;

var CNSL116P_saveErrGridUid;
var CNSL116P_saveErrElId;

for (let i = 0; i < CNSL116P_grid.length; i++) {
	CNSL116P_grid[i] = {
        instance: new Object(),
        dataSource: new Object(),
        currentItem: new Object(),
        currentCellIndex: new Number(),
        selectedItems: new Array()
    }
}

$(document).ready(function () {
	
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		$("#CNSL116P_popHeader").text('환자정보일괄등록');
	} else {
		$("#CNSL116P_popHeader").text('고객정보일괄등록');
	}
	
	//kw---20240326 : 고객리스트 그리드 생성
	CNSL116P_initGrid();
	CNSL116P_GridResize();
	
	//kw---20240326 : 고객상세정보 테이블 생성
	var CNSL116_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
	};
	
	var CNSL116_jsonStr = JSON.stringify(CNSL116_data);
	
//	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
	if(false){
		Utils.ajaxCall("/cnsl/CNSL116SEL02", CNSL116_jsonStr, function(result){
		});
	} else {
		Utils.ajaxCall("/cnsl/CNSL161SEL01", CNSL116_jsonStr, CNSL116P_createInfoTableC);
	}
	
	CNSL116P_grid[0].dataSource.data([]);
	
	var filterTimer; // 필터 지연을 위한 타이머 변수
	$('#CNSL116P_filter').on('input', function (e) {
        clearTimeout(filterTimer); // 이미 설정된 타이머가 있다면 이전 타이머를 취소합니다.
        filterTimer = setTimeout(function () {
        	CNSL116P_applyFilter(CNSL116P_grid[0], "CNSL116P_filter");
        }, 0); // 2초(2000밀리초) 후에 필터링 코드를 실행합니다.
    });
});

$(window).resize(function(){
	CNSL116P_GridResize();
});

function CNSL116P_GridResize(){
	let screenHeight = $(window).height();
	
	CNSL116P_grid[0].instance.element.find('.k-grid-content').css('height', screenHeight-250);
	 $("#CNSL116P_divCustInfo").css("height", screenHeight-222 + "px");
}

//kw---20240326 : 고객리스트 그리드 생성
function CNSL116P_initGrid(){
	
	var gridTitle_custId = "";
	var gridTitle_custNm = "";
	
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		gridTitle_custId = "환자번호";
		gridTitle_custNm = "환자이름";
	} else {
		gridTitle_custId = "고객번호";
		gridTitle_custNm = "고객이름";
	}
	
	CNSL116P_grid[0].dataSource = new kendo.data.DataSource({
		transport: {
			read: function (options) {
				
			},
		},
        schema: {
        	 type: "json",
        	 model: {
        		 
                 fields: {     
//                	 radio			: { field: "radio",		type : "radio"},
                	 custId     	: { field: "custId", 	type: "string"},
                	 custNm      	: { field: "custNm", 	type: "string"},
                 }
        	 }
        }
	});
	
	CNSL116P_grid[0].instance = $("#CNSL116Pgrid0").kendoGrid({
		dataSource: CNSL116P_grid[0].dataSource,
		noRecords: { template: '<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>' },
		autoBind: false,
		persistSelection : true,
		selectable: "row",
		scrollable: true,
		change: function(e) {
        	CNSL116P_fnGridSelect(e, 0);
        },
        page: function(e) {
            let filterValue = $('#CNSL116P_filter').val();
            if(!Utils.isNull(filterValue)){
                setTimeout(() => {
                    CNSL116P_filterHighlight(CNSL116P_grid[0].instance,"CNSL116P_filter");
                }, 300);
            }
        },
        columns: [
        	 {
        		 width: 40, field: "radio", template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',
        		 title: "선택",   
             }, { 
				width: 110, 
				field : "custId",
            	title: gridTitle_custId,   
            }, {
				width : 90,
				field : "custNm",
				title : gridTitle_custNm,
			},
		],
	}).data("kendoGrid");
}

//kw---20240326 : 고객상세정보 테이블 생성
function CNSL116P_createInfoTableC(data){
	let CNSL116SEL01_html = '';
	CNSL116_aJsonArray = new Array();
	CNSL116SEL01Index = JSON.parse(data.CNSL161SEL01);
	let CNSL116SEL01IndexLen = CNSL116SEL01Index.length;
	let CNSL116SEL01_title = '';
	let CNSL116SEL01_layout_flag = '';
	let CNSL116SEL01_layout_row_flag = '';
	
	let tableIndex1 = '';
	let tableIndex2 = '';
	let colCnt = 0;
	let type1Yn = false;
	let rowNum = 1;
	
	let testNum = 0;
	
	let indexNum = '';
	
	if ( CNSL116SEL01IndexLen > 0 ) {
		CNSL116_pgmId = CNSL116SEL01Index[0].pgmId;
		CNSL116_dataSrcDvCd = CNSL116SEL01Index[0].dataSrcDvCd;
	}
	
	for ( var i = 0; i < CNSL116SEL01IndexLen; i++ ) {
		
		let layoutItemId =  CNSL116SEL01Index[i].custItemGrpNo + '_' + CNSL116SEL01Index[i].custItemNo+ '_' + CNSL116SEL01Index[i].rowNo;
		let mdtyYn = CNSL116SEL01Index[i].mdtyYn;
		let crypTgtYn = CNSL116SEL01Index[i].crypTgtYn;
		let mgntItemNm = CNSL116SEL01Index[i].mgntItemNm;
		
		CNSL116P_arrVoId.push(CNSL116SEL01Index[i].mgntItemCd);
		CNSL116P_arrElId.push(layoutItemId);
		
		if ( CNSL116SEL01_title != CNSL116SEL01Index[i].custItemGrpNo  || i == 0 )  {
			
			if(testNum != CNSL116SEL01Index[i].custItemGrpNo && i != 0){
				
				if (CNSL116SEL01Index[i-1].scrnDispDrctCd == '9') {
					CNSL116SEL01_html += '</tbody></table></div>';
				} else {
					CNSL116SEL01_html += '<tr>';
					CNSL116SEL01_html += tableIndex1
					CNSL116SEL01_html += '</tr>';
					CNSL116SEL01_html += tableIndex2;
					CNSL116SEL01_html += '</tbody></table></div>';
					
					tableIndex1 = '';
					tableIndex2 = '';
					
					colCnt = 0;
					rowNum = 1;
					
					CNSL116SEL01_layout_row_flag = 0;
				}
			}
				
			testNum = CNSL116SEL01Index[i].custItemGrpNo;
			
			CNSL116SEL01_html += '<h4 class="h4_tit">' + CNSL116SEL01Index[i].custItemGrpNm + '</h4>';
			CNSL116SEL01_title = CNSL116SEL01Index[i].custItemGrpNo;
		}
		
		if ( CNSL116SEL01Index[i].voColId == 'custId' ) {
			grdCNSL116P_custId = CNSL116SEL01Index[i].mgntItemCd;
		}
		
		if ( CNSL116SEL01Index[i].voColId == 'custNm' ) {
			grdCNSL116P_custNm = CNSL116SEL01Index[i].mgntItemCd;
		}
		
		if (CNSL116SEL01Index[i].scrnDispDrctCd == '9') {
			if ( CNSL116SEL01_layout_flag != CNSL116SEL01Index[i].custItemGrpNo || i == 0 ) {
				CNSL116SEL01_html += '<div class="tableCnt_Row"><table id="'+CNSL116SEL01Index[i].custItemGrpNo+'" dataSrcDvCd="'+CNSL116SEL01Index[i].dataSrcDvCd+'" pgmId="'+CNSL116SEL01Index[i].pgmId+'"><colgroup><col style="width: auto" /><col style="width: auto" /><col style="width: auto" /><col style="width: auto" /></colgroup><tbody>';
				CNSL116SEL01_layout_flag = CNSL116SEL01Index[i].custItemGrpNo;
			}
			
			if ( mdtyYn == 'Y') {
				CNSL116SEL01_html += '<tr><th class="neceMark">'+mgntItemNm+'</th><td colspan="3">';
			} else {
				CNSL116SEL01_html += '<tr><th>'+mgntItemNm+'</th><td colspan="3">';
			}
			switch (CNSL116SEL01Index[i].mgntItemTypCd) {
		        case "E":
		        	var urlLinkVal = CNSL116SEL01Index[i].linkUrl;
		        	CNSL116SEL01_html += '<span class="searchTextBox" style="width: 100%;" ><input voColId="'+CNSL116SEL01Index[i].voColId+'" crypTgtYn="'+CNSL116SEL01Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn +'" value="' + CNSL116SEL01Index[i].custItemDataVlu + '" class="customLayout E k-input" placeholder="검색하세요." style="width:40%" disabled /><button title="검색" onclick="CNSL116P_EtypePop(\''+urlLinkVal+'\',this)" ></button><input crypTgtYn="'+CNSL116SEL01Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'Nm" class="customLayout E k-input" value="' + CNSL116SEL01Index[i].custItemDataNm+ '" disabled /></span>';
		            break;
		        case "I":
		        	CNSL116SEL01_html += '<input voColId="'+CNSL116SEL01Index[i].voColId+'" crypTgtYn="'+CNSL116SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout I" style="width: 100%;" value="' + CNSL116SEL01Index[i].custItemDataVlu + '"  />';
		            break;
		        case "D":
		        	CNSL116SEL01_html += '<input voColId="'+CNSL116SEL01Index[i].voColId+'" crypTgtYn="'+CNSL116SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout D datepicker" placeholder="" style="width: 100%;" value="' + CNSL116SEL01Index[i].custItemDataVlu + '"  />';
		            break;
		        case "C":
		        	comboDataCNSL116SEL01.push({"mgntItemCd":CNSL116SEL01Index[i].mgntItemCd});
		        	CNSL116SEL01_html += '<input voColId="'+CNSL116SEL01Index[i].voColId+'" crypTgtYn="'+CNSL116SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout C ' + CNSL116SEL01Index[i].mgntItemCd + ' k-input" placeholder="" style="width: 100%;" value="' + CNSL116SEL01Index[i].custItemDataVlu + '"  />';
		            break;
		        case "N":
		        	CNSL116SEL01_html += '<input type="number" voColId="'+CNSL116SEL01Index[i].voColId+'" crypTgtYn="'+CNSL116SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout N k-input" placeholder="" style="width: 100%;" value="' + CNSL116SEL01Index[i].custItemDataVlu + '"  />';
		            break;
		        case "T":
		        	if ( CNSL116SEL01Index[i].voColId == 'custId') {
		        		CNSL116SEL01_html += '<input type="text" voColId="'+CNSL116SEL01Index[i].voColId+'" crypTgtYn="'+CNSL116SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + custId + '"  disabled/>';
		        	}else {
		        		CNSL116SEL01_html += '<input type="text" voColId="'+CNSL116SEL01Index[i].voColId+'" crypTgtYn="'+CNSL116SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + CNSL116SEL01Index[i].custItemDataVlu + '"  />';
		        	}
		            break;
		    }
			CNSL116SEL01_html += '</td></tr>';
		}else if (CNSL116SEL01Index[i].scrnDispDrctCd == '1') {
			
			if ( CNSL116SEL01_layout_flag != CNSL116SEL01Index[i].custItemGrpNo) {
				
				CNSL116SEL01_html += '  <div class="tableCnt_Row" style="margin-bottom:15px;">  ';
				CNSL116SEL01_html += '  <table id="'+CNSL116SEL01Index[i].custItemGrpNo+'" dataSrcDvCd="'+CNSL116SEL01Index[i].dataSrcDvCd+'" pgmId="'+CNSL116SEL01Index[i].pgmId+'" >     ';
				
				tableIndex2 = '';
				type1Yn = true;
				CNSL116SEL01_layout_flag = CNSL116SEL01Index[i].custItemGrpNo;
				tableIndex1 += '<th style="width:30px;"></th>';
				tableIndex1 += '<th style="width:50px;">NO</th>';
			}
			
			if ( CNSL116SEL01_layout_row_flag != CNSL116SEL01Index[i].rowNo || i == 0 ) {
				tableIndex2 += '<tr>';
				CNSL116SEL01_layout_row_flag = CNSL116SEL01Index[i].rowNo;
				if ( CNSL116SEL01_layout_row_flag == 1 ) {
					tableIndex2 += '<td><input class="k-checkbox k-checkbox-md k-rounded-md layoutItemRow" value="'+layoutItemId+'" data-role="checkbox" aria-label="Deselect row" aria-checked="true" type="checkbox" disabled></td>'
				}  else {
					tableIndex2 += '<td><input class="k-checkbox k-checkbox-md k-rounded-md layoutItemRow" value="'+layoutItemId+'" data-role="checkbox" aria-label="Deselect row" aria-checked="true" type="checkbox"></td>'
				}
				tableIndex2 += '<td><input value="' + rowNum + '" class="k-input" style="width:100%; border:white;" disabled/></td>'
				rowNum++;
			}
			
			if ( CNSL116SEL01Index[i].rowNo == 1 ) {
				if ( mdtyYn == 'Y') {
					tableIndex1 += '<th class="neceMark">'+mgntItemNm+'</th>';
				} else {
					tableIndex1 += '<th>'+mgntItemNm+'</th>';
				}
			}  
			switch (CNSL116SEL01Index[i].mgntItemTypCd) {
		        case "E":
		        	var urlLinkVal = CNSL116SEL01Index[i].linkUrl; 
		        	tableIndex2 += '<td type="E"><span class="searchTextBox" style="width: 100%;" ><input voColId="'+CNSL116SEL01Index[i].voColId+'" crypTgtYn="'+CNSL116SEL01Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" value="' + CNSL116SEL01Index[i].custItemDataVlu + '" class="customLayout E k-input" placeholder="검색하세요." style="width:40%" disabled /><button title="검색" onclick="CNSL116P_EtypePop(\''+urlLinkVal+'\', this)" ></button><input crypTgtYn="'+CNSL116SEL01Index[i].crypTgtYn+'" type="search" id="'+layoutItemId+'Nm" class="customLayout E k-input" value="' + CNSL116SEL01Index[i].custItemDataNm+ '" disabled /></span></td>'
		            break;
		        case "I":
		        	tableIndex2 += '<td><input voColId="'+CNSL116SEL01Index[i].voColId+'" crypTgtYn="'+CNSL116SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout I" style="width: 100%;" value="' + CNSL116SEL01Index[i].custItemDataVlu + '"  /></td>';
		            break;
		        case "D":
		        	tableIndex2 += '<td><input voColId="'+CNSL116SEL01Index[i].voColId+'" crypTgtYn="'+CNSL116SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout D datepicker" placeholder="" style="width: 100%;" value="' + CNSL116SEL01Index[i].custItemDataVlu + '"  /></td>';
		            break;
		        case "C":
		        	comboDataCNSL116SEL01.push({"mgntItemCd":CNSL116SEL01Index[i].mgntItemCd});
		        	tableIndex2 += '<td type="C"><input voColId="'+CNSL116SEL01Index[i].voColId+'" crypTgtYn="'+CNSL116SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout C ' + CNSL116SEL01Index[i].mgntItemCd + ' k-input" placeholder="" style="width: 100%;" value="' + CNSL116SEL01Index[i].custItemDataVlu + '"  /></td>';
		            break;
		        case "N":
		        	tableIndex2 += '<td><input voColId="'+CNSL116SEL01Index[i].voColId+'" type="number" crypTgtYn="'+CNSL116SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout N k-input" placeholder="" style="width: 100%;" value="' + CNSL116SEL01Index[i].custItemDataVlu + '"  /></td>';
		            break;
		        case "T":
		        	if ( CNSL116SEL01Index[i].voColId == 'custId') {
		        		tableIndex2 += '<td><input voColId="'+CNSL116SEL01Index[i].voColId+'" type="text" voColId="'+CNSL116SEL01Index[i].voColId+'" crypTgtYn="'+CNSL116SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + custId + '"  disabled/></td>';
		        	} else {
		        		tableIndex2 += '<td><input voColId="'+CNSL116SEL01Index[i].voColId+'" type="text" crypTgtYn="'+CNSL116SEL01Index[i].crypTgtYn+'" id="'+layoutItemId+'" mgntItemNm="'+mgntItemNm+'" mdtyYn="'+mdtyYn+'" class="customLayout T k-input" placeholder="" style="width: 100%;" value="' + CNSL116SEL01Index[i].custItemDataVlu + '"  /></td>';
		        	}
		            break;
		    }
		}
		if ( i == ( CNSL116SEL01IndexLen - 1 ) ) {
			if (CNSL116SEL01Index[i-1].scrnDispDrctCd == '9') {
				CNSL116SEL01_html += '</tbody></table></div>';
			} else {
				CNSL116SEL01_html += '<tr>';
				CNSL116SEL01_html += tableIndex1
				CNSL116SEL01_html += '</tr>';
				CNSL116SEL01_html += tableIndex2;
				CNSL116SEL01_html += '</tbody></table></div>';
				
				tableIndex1 = '';
				tableIndex2 = '';
				
				colCnt = 0;
				type1Yn = false;
				CNSL116SEL01_layout_row_flag = 0;
				rowNum = 1;
			}
		}
	}
	
	$("#CNSL116P_divCustInfoTable").html(CNSL116SEL01_html);
	
	var data = { "codeList": 
		comboDataCNSL116SEL01
	};
    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList116,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
	
	$.each(CNSL116P_arrElId, function(index, item){
		
		$(document).on('input.' + item, '#' + item, function() {
            CNSL116P_fnCustElChng(item, CNSL116P_arrVoId[index]);
        });
		
	});
	
	
}

function resultComboList116(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	
	var mgntItemCd = '';
	var comboList = [];
	
	for ( var i=0; i<jsonDecode.length; i++) {
		
		var key = jsonDecode[i].mgntItemCd;

		    // CNSL116P_comboDataList에 해당 키가 없는 경우 초기화
	    if (!CNSL116P_comboDataList[key]) {
	    	CNSL116P_comboDataList[key] = { comboList: [] };
	    }

	    CNSL116P_comboDataList[key].comboList.push(jsonDecode[i]);
	    
		if ( mgntItemCd != jsonDecode[i].mgntItemCd) {
			
			mgntItemCd = jsonDecode[i].mgntItemCd;
			$(".CNSL116 ."+jsonDecode[i].mgntItemCd).html('');
			
			Utils.setKendoComboBox(jsonDecode, jsonDecode[i].mgntItemCd, '.CNSL116 .'+jsonDecode[i].mgntItemCd, '', false) ;
			
			//kw---20240220 : 고객ID경로코드를 비활성화/CRM고객ID로 고정 시키기
			if(jsonDecode[i].mgntItemCd == "C0118"){
				$.each($('.CNSL116 .C0118'), function(index, item){
				    if(!Utils.isNull(item.id)){
				            $('#'+item.id).data("kendoComboBox").enable(false);
				            $("#"+item.id).data("kendoComboBox").value("2");
				    }
				});
			}
			
			$('.CNSL116 .'+jsonDecode[i].mgntItemCd).on('change', function() {
				if(!Utils.isNull($(this).attr('id'))){
					var elId = $(this).attr('id');
					
					CNSL116P_fnCustElChng(elId);
				}
				
			});
			
		}
	}
}

function CNSL116P_fnCustElChng(_elId, _elVo){
	
	var grid = $("#CNSL116Pgrid0").data("kendoGrid");
    var selectedRow = grid.select();
    var dataItem = grid.dataItem(selectedRow);
    
	var grpNo = _elId.split('_')[0];
	var itmNo = _elId.split('_')[1];
	var rowNo = _elId.split('_')[2];
	
	$.each(dataItem.itemArr, function(index, item){
		if(item.custItemGrpNo == grpNo && item.custItemNo == itmNo && item.rowNo == rowNo){
			item.custItemDataVlu = $("#" + _elId).val();
		}
	});
	
}


function CNSL116P_fnGridSelect(e, gridIndex){
	var rows = e.sender.select();
	var items = [];
	
	rows.each(function(e) {
        var dataItem = CNSL116P_grid[gridIndex].instance.dataItem(this);
        items.push(dataItem);
    });
	
	CNSL116P_grid[gridIndex].selectedItems = items;
	
	console.log(":::: items");
	console.log(items);
	
	if(!Utils.isNull(items)){
		console.log(":::: items 111");
		console.log(items);
		
		$.each(items[0].itemArr, function(index, item){
			var controlId = item.custItemGrpNo + "_" + item.custItemNo + "_" + item.rowNo;
			if($("#" + controlId).attr("data-role") == "combobox"){
				$("#" + controlId).data("kendoComboBox").value(item.custItemDataVlu);
			} else {
				$("#" + controlId).val(item.custItemDataVlu);
			}	
		});
	} else {
		console.log(":::: items 22");
		console.log(items);
	}
	
	$('#1_1_1').data("kendoComboBox").value("2");
	
	
	$('.CNSL116 .customLayout').each(function() {
		if($(this).attr("data-role") == "combobox"){
			$(this).parent().css("border", "");
		} else {
			$(this).css("border", "");
		}
	});
	
	if(CNSL116P_grid[gridIndex].selectedItems[0].uid == CNSL116P_saveErrGridUid){
		
		if($("#" + CNSL116P_saveErrElId).attr("data-role") == "combobox"){
			$("#" + CNSL116P_saveErrElId).parent().css("border", "solid 2px #ff0000");
		} else {
			$("#" + CNSL116P_saveErrElId).css("border", "solid 2px #ff0000");
		}
	}
	
}

function CNSL116P_excelExport() {
	
	const test = [
	    {"t1": "value1", "t2": "value2", "t3": "value3"}
	];

	var arrColumns = [];
	var arrRowsCellsHead = [];
	var arrRowsCellsCode = [];
	var arrRowsCellsBody = [];

	var arrItemCd = [];
	
	var cellTitleHeight = 16.5;
	var CellTitleWidth = 1.88;
	
	var cellWidth = [];

	for (var i = 0; i < CNSL116SEL01Index.length; i++) {
		cellWidth.push(0);
	}

	for (var i = 0; i < CNSL116SEL01Index.length; i++) {
	    var obj = {
	        value: CNSL116SEL01Index[i].mgntItemCd,
	        style: "mso-number-format: '@';",
	        background: "#7A7A7A",
	        color: "#FFFFFF",
	        borderTop: { color: "#000000", size: 1 },
	        borderRight: { color: "#000000", size: 1 },
	        borderBottom: { color: "#000000", size: 1 },
	        borderLeft: { color: "#000000", size: 1 },
	    }

	    arrRowsCellsCode.push(obj)
	    arrItemCd.push(CNSL116SEL01Index[i].mgntItemCd);
	}

	for (var i = 0; i < CNSL116SEL01Index.length; i++) {
		
		if(cellWidth[i] < CNSL116SEL01Index[i].mgntItemNm.length){
			cellWidth[i] = CNSL116SEL01Index[i].mgntItemNm.length;
		}
		
		var custval1 = CNSL116SEL01Index[i].mgntItemNm;
		var width = "";
		var custPath = "CRM고객ID";
		var custVal2 = "";
		
		if(CNSL116SEL01Index[i].mgntItemTypCd == "C"){
			
			//kw---20240520 : 고객ID경로코드는 CRM고객ID로 고정
			if(CNSL116SEL01Index[i].mgntItemCd != "C0118"){
				var arrCombo = CNSL116P_comboDataList[CNSL116SEL01Index[i].mgntItemCd].comboList;
				
				$.each(arrCombo, function(index, item){
					
					if(index == 0){
						custval1 += "\n";
					}
					
					if(cellWidth[i] < item.comCdNm.length){
						cellWidth[i] = item.comCdNm.length;
					}
					
					custval1 += "-" + item.comCdNm + "";
					
					if(index != (arrCombo.length-1)){
						custval1 += "\n";
					}
				});
			} else {
				custVal2 = custPath;
			}
		}
		
	    var obj = {
	        value: custval1,
	        style: "mso-number-format: '\@';",
	        background: "#7A7A7A",
	        color: "#FFFFFF",
	        borderTop: { color: "#000000", size: 1 },
	        borderRight: { color: "#000000", size: 1 },
	        borderBottom: { color: "#000000", size: 1 },
	        borderLeft: { color: "#000000", size: 1 },
	        vAlign : "top",
	        wrap: true,
	    }

	    arrRowsCellsHead.push(obj)

		
	    var obj = {
	        value: custVal2,
	        borderTop: { color: "#000000", size: 1 },
	        borderRight: { color: "#000000", size: 1 },
	        borderBottom: { color: "#000000", size: 1 },
	        borderLeft: { color: "#000000", size: 1 },
	        format : "@",
	    }

	    arrRowsCellsBody.push(obj)
	}
	
	for (var i = 0; i < CNSL116SEL01Index.length; i++) {

		var cWidth = (cellWidth[i] * CellTitleWidth) * 7.33;
		
		if(cWidth < 100){
			cWidth = 100;
		}
		
	    var obj = {
	        width: cWidth,
	        dataType: "string"
	    }

	    arrColumns.push(obj)
	}
	

	var workbook = new kendo.ooxml.Workbook({
	    sheets: [{
	        columns: arrColumns,
	        rows: [
	            {
	                cells: arrRowsCellsCode,
	                height: 0,
	            },
	            {
	                cells: arrRowsCellsHead,
	            },
	            { cells: arrRowsCellsBody },
	            { cells: arrRowsCellsBody },
	            { cells: arrRowsCellsBody },
	            { cells: arrRowsCellsBody },
	            { cells: arrRowsCellsBody },
	            { cells: arrRowsCellsBody },
	            { cells: arrRowsCellsBody },
	            { cells: arrRowsCellsBody },
	        ]
	    }]
	});

	kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: "excel_with_borders.xlsx" });
}

//파일 불러오기
function CNSL116P_excelUpload(){
	
	$("#CNSL116P_upfile").val('');
	$("#CNSL116P_upfile").click();
}

function CNSL116P_fnGridSet(){
	
}

function CNSL116P_excelUpfile(e){
	
	
	window.kendo.ui.progress($("#CNSL116Pgrid0"), true);
			
	$("#CNSL116P_filter").val("");
	
	var upfile 		= $("#CNSL116P_upfile")[0].files[0];
	var upFileNm 	= upfile.name;
	var upFileSize 	= upfile.size;
	var formData 	= new FormData();
	var arrItemCd = [];
	var custNo = 0;

	//kw---20240402 : 고객정보 엑셀등록 - 고객레이아웃아이템코드 배열에 담기 - s
	for(var i=0; i<CNSL116SEL01Index.length; i++){
		arrItemCd.push(CNSL116SEL01Index[i].mgntItemCd + "|" + CNSL116SEL01Index[i].mgntItemTypCd);
	}
	//kw---20240402 : 고객정보 엑셀등록 - 고객레이아웃아이템코드 배열에 담기 - e
	
	formData.append("upfile",		upfile);
	formData.append("arrItemCd",	arrItemCd);
	formData.append("tenantId",		GLOBAL.session.user.tenantId);
	
	Utils.ajaxCallFormData("/cnsl/CNSL116SEL01",formData, function(result){
		
		
		if(!Utils.isNull(result.msg)){
			
			Utils.alert("업로드 해주신 엑셀 데이터가 현재 고객정보레이아웃과 형식이 다릅니다.<br>양식을 새로 다운로드 하신 후에 새로 작성하여 다시 업로드 해주세요.")
			
			return;
		}
		
		CNSL116P_resultTest = result;
		
		custNo = result.custNo;
		
		$.each(result.list, function(index, item){
//			
			var custId, custNm;
			var itemArr = [];
			
			//kw---20240516 : 갯수만큼 돌리기 의해서 each문 쓴거 같음...
			$.each(item, function(index2, item2){
				
				var index2Num = index2.split("|")[0];
				
				var indexNm = index2Num + "|" + CNSL116SEL01Index[index2Num].mgntItemCd;
				
				if(indexNm.split("|")[1] == 'T0009'){
					if(item[indexNm].length == 10 && item[indexNm].substr(0, 2) == '10'){
						item[indexNm] = '0' + item[indexNm];
					}
				}
				
				if(indexNm.split("|")[1] == grdCNSL116P_custId){
					item[index2] = GLOBAL.session.user.tenantId + "_" + custNo;
				}
				
				if(indexNm.split("|")[1] == grdCNSL116P_custNm){
					custNm = item2;
				}
				
				
				var key = CNSL116SEL01Index[index2Num].mgntItemCd;

				    // CNSL116P_comboDataList에 해당 키가 없는 경우 초기화
			    if (CNSL116P_comboDataList[key]) {
			    	var arrCombo = CNSL116P_comboDataList[key].comboList;
			    	
			    	//kw---데이터가 이상하게 들어갔을 경우를 대비해서 우선 초기화 데이터를 생성한다.
			    	
			    	var itemComboVlu = "";
			    	
			    	$.each(arrCombo, function(index3, item3){
			    		if(item3.comCdNm == item[indexNm]){
			    			itemComboVlu = item3.comCd;
			    		}
			    	});
			    	
			    	item[indexNm] = itemComboVlu;
			    }
			    
				var obj = {
						custItemGrpNo 		: CNSL116SEL01Index[index2Num].custItemGrpNo,
						custItemNo 			: CNSL116SEL01Index[index2Num].custItemNo,
						rowNo 				: CNSL116SEL01Index[index2Num].rowNo,
						custItemDataVlu 	: item[indexNm],
						custNo				: custNo,
						memo				: '',
						itemCd				: CNSL116SEL01Index[index2Num].mgntItemCd,
						
				}
				
				
				itemArr.push(obj);
			});
			
			item.custNm = custNm;
			item.itemArr = itemArr;

			item.custNo = custNo;
			item.custId = GLOBAL.session.user.tenantId + "_" + custNo++;
			
			
		});
		
		CNSL116P_grid[0].dataSource.data(result.list);
		
		CNSL116P_grid[0].instance.tbody.find("input[type='checkbox']").prop("checked", false);
		CNSL116P_grid[0].instance.select("tr:eq(0)");
		
		window.kendo.ui.progress($("#CNSL116Pgrid0"), false);
	});
}

function CNSL116P_fnPageReset(){
	CNSL116P_grid[0].dataSource.data([]);
	
	$.each(CNSL116SEL01Index, function(index, item){
		var controlId = item.custItemGrpNo + "_" + item.custItemNo + "_" + item.rowNo;
		
		$("#" + controlId).val("");
	});
}

function CNSL116P_fnSave(){
	
	if(CNSL116P_grid[0].dataSource.data().length == 0){
		Utils.alert("엑셀 양식을 업로드 해주세요.");
		return;
	}

	CNSL116P_grid[0].instance.table.find("tr").each(function(index){
	       $(this).css({
	           "background-color": "",
	        });
		});
	
	var saveFlag = true;
	for(var i=0; i<CNSL116P_grid[0].dataSource.data().length; i++){
		CNSL116P_grid[0].instance.select(CNSL116P_grid[0].instance.table.find("tr:eq(" + i + ")"));
		
		$('.CNSL116 .customLayout').each(function() {
			
			if($(this).attr("data-role") == "combobox"){
				$(this).parent().css("border", "");
			} else {
				$(this).css("border", "");
			}
			
			
		});
		
		$('.CNSL116 .customLayout').each(function() {
			if ( $(this).attr("mdtyYn") == 'Y' && $(this).val() == '' ) {
				Utils.alert( $(this).attr("mgntItemNm") + " 필수값 입니다.");
				
				
				if($(this).attr("data-role") == "combobox"){
					$(this).parent().css("border", "solid 2px #ff0000");
				} else {
					$(this).css("border", "solid 2px #ff0000");
				}
				
				CNSL116P_saveErrGridUid = CNSL116P_grid[0].dataSource.data()[i].uid;
			    CNSL116P_saveErrElId = $(this).attr("id");
			    
				saveFlag = false;
				
				return false;
			}
		});
		
		if(saveFlag == false){
			
//			CNSL116P_grid[0].instance.table.find("tr").each(function(index){
//			    if(index == i){
//			       $(this).css({
//			           "background-color": "#fa3a4d",
//			        });
//			    }
//			});
			
			return;
		}
	}
	
	var gridData = CNSL116P_grid[0].dataSource.data();
	
	var arrCustInfoItem = [];
	
	$.each(gridData, function(index, item){
	
		var custNmSrchkey;
		var custNmSrchkey1 = null;
		var custNmSrchkey2 = null;
		var custPathCd = '';
		
		
		for(var i=0; i<item.itemArr.length; i++){
			for(var k=0; k<CNSL116SEL01Index.length; k++){
				if(item.itemArr[i].custItemGrpNo == CNSL116SEL01Index[k].custItemGrpNo 
						&& item.itemArr[i].custItemNo == CNSL116SEL01Index[k].custItemNo 
						&& item.itemArr[i].rowNo == CNSL116SEL01Index[k].rowNo
					){
					
					item.itemArr[i].crypTgtYn = CNSL116SEL01Index[k].crypTgtYn;
					
					if(CNSL116SEL01Index[k].mgntItemCd == 'T0002'){
						custNmSrchkey = item.itemArr[i].custItemDataVlu;
						custNmSrchkey1 = custNmSrchkey.substr(0,1);
						custNmSrchkey2 = custNmSrchkey.substr(0,2)
					}
					
					if(CNSL116SEL01Index[k].mgntItemCd == 'C0118'){
						custPathCd = item.itemArr[i].custItemDataVlu;
					}
					
				
					
				}
				
			}
			
			var custItemDataNm = '';
			var memo = '';
			var elId = item.itemArr[i].custItemGrpNo + "_" + item.itemArr[i].custItemNo + "_" + item.itemArr[i].rowNo;
			if($("#" + elId).attr("data-role") == "combobox"){
				memo = $("#" + elId).data("kendoComboBox").text();
			}
			
			var custItemObj = {
					"tenantId" 			: GLOBAL.session.user.tenantId,
					"usrId" 			: GLOBAL.session.user.usrId,
					"orgCd" 			: GLOBAL.session.user.orgCd,
					"custItemGrpNo" 	: item.itemArr[i].custItemGrpNo,
					"custItemNo" 		: item.itemArr[i].custItemNo,
					"rowNo" 			: item.itemArr[i].rowNo,
					"custNo" 			: item.itemArr[i].custNo,
					"crypTgtYn" 		: item.itemArr[i].crypTgtYn,
					"custItemDataVlu" 	: item.itemArr[i].custItemDataVlu,
					"custItemDataNm" 	: custItemDataNm,
					"memo"				: item.itemArr[i].memo,
				};
			
			
			Utils.ajaxCall("/cnsl/CNSL161INS02", JSON.stringify(custItemObj), function (result) {});
			
		}
		

		var custObj = {
			"tenantId" 			: GLOBAL.session.user.tenantId,
			"usrId" 			: GLOBAL.session.user.usrId,
			"orgCd" 			: GLOBAL.session.user.orgCd,
			"custIdPathCd" 		: custPathCd,
			"custId" 			: item.custId,
			"custNm" 			: item.custNm,
			"custNmSrchkey1" 	: custNmSrchkey1,
			"custNmSrchkey2" 	: custNmSrchkey2,
			"encryptYn" 		: Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1,
		};
		
		Utils.ajaxCall("/cnsl/CNSL161INS01", JSON.stringify(custObj), function (result) {
			Utils.alert("저장되었습니다.", function(){
				Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
				self.close();
				
			});
		});
	});
	
//	
//	$.each(dataItem.itemArr, function(index, item){
//		if(item.custItemGrpNo == grpNo && item.custItemNo == itmNo && item.rowNo == rowNo && item.mgntItemCd == _elVo){
//			item.custItemDataVlu = $("#" + _elId).val();
//		}
//	});
}

function CNSL116P_filterHighlight(gridId, gridInput){
	
    let grid = gridId;
    let filterValue = $('#' + gridInput).val();
    grid.table.find("tr").each(function () {
        var row = $(this);
        row.find("td").each(function () {
            var cell = $(this);
            var text = cell.text();
            if (text.includes(filterValue)) {
                cell.html(Utils.convertTextHighlight(text,filterValue));
            }
        });
    });
}

//그리드 검색 필터
function CNSL116P_applyFilter(grid, searchId) {
	
	if(grid.dataSource.data().length == 0){
		return;
	}
	
    var filterValue = $('#' + searchId).val();

    var columns = grid.instance.columns;
    var filter = { logic: 'or', filters: [] };


    columns.forEach(function (x) {
        if (x.field) {
        	if(!Utils.isNull(grid.dataSource.options.schema.model.fields[x.field])){
        		var type = grid.dataSource.options.schema.model.fields[x.field].type;
                if (type == 'string') {
                    filter.filters.push({
                        field: x.field,
                        operator: 'contains',
                        value: $('#' + searchId).val()
                    });
                } else if (type == 'number') {
                    if (isNumeric($('#filter').val())) {
                        filter.filters.push({
                            field: x.field,
                            operator: 'eq',
                            value: $('#' + searchId).val()
                        });
                    }
                } else if (type == 'date') {
                    var data = grid.dataSource.data();
                    for (var i = 0; i < data.length; i++) {
                        var dateStr = kendo.format(x.format, data[i][x.field]);
                        if (dateStr.startsWith($('#' + searchId).val())) {
                            filter.filters.push({
                                field: x.field,
                                operator: 'eq',
                                value: data[i][x.field]
                            });
                        }
                    }
                } else if (type == 'boolean' && getBoolean($('#' + searchId).val()) !== null) {
                    var bool = getBoolean($('#' + searchId).val());
                    filter.filters.push({
                        field: x.field,
                        operator: 'eq',
                        value: bool
                    });
                }
        	}
            
        }
    });
    grid.dataSource.filter(filter);


    grid.instance.table.find("tr").each(function () {
        var row = $(this);
        row.find("td").each(function (index) {
        	
        	if(index != 0){
        		var cell = $(this);
                var text = cell.text();
                if (text.includes(filterValue)) {
                    cell.html(Utils.convertTextHighlight(text,filterValue));
                }
        	}
            
        });
    });
}

//kw---20240605 : 1차버전 고객 정보 가져오기
function CNSL116P_fnCustLoad(){
	
	//kw---20240326 : 고객상세정보 테이블 생성
	var CNSL116_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
	};
	
	Utils.ajaxCall("/cnsl/CNSL116SEL02", JSON.stringify(CNSL116_data), function(data){
		
		let cnslList = JSON.parse(data.result);
		
		let custList = [];
		
		for(var i=0; i<cnslList.length; i++){
			
			let cnslListItem = [];
			
			if(cnslList[i].custNo != '1'){
				var objItem = [];
				
				for ( var k=0; k<CNSL116SEL01Index.length; k++ ) {
					var keyNm 		= k + "|" + CNSL116SEL01Index[k].mgntItemCd;
					var keyValue 	= '';
					var memo		= '';
					
					if(CNSL116SEL01Index[k].mgntItemCd == 'C0118'){	keyValue = cnslList[i].custIdPathCd;	memo = 'CRM고객ID'						}		//가입경로
					if(CNSL116SEL01Index[k].mgntItemCd == 'T0001'){	keyValue = cnslList[i].custId;			objItem["custId"] = cnslList[i].custId;	}		//고객번호
					if(CNSL116SEL01Index[k].mgntItemCd == 'T0002'){	keyValue = cnslList[i].custNm;			objItem["custNm"] = cnslList[i].custNm;	}		//담당자명
					if(CNSL116SEL01Index[k].mgntItemCd == 'C0172'){	keyValue = cnslList[i].gndr;			objItem["custNo"] = cnslList[i].custNo;	}		//성별코드
					if(CNSL116SEL01Index[k].mgntItemCd == 'T0011'){	keyValue = cnslList[i].btdt;													}		//생년월일
					if(CNSL116SEL01Index[k].mgntItemCd == 'T0007'){	keyValue = cnslList[i].owhmTelNo;												}		//자택전화번호
					if(CNSL116SEL01Index[k].mgntItemCd == 'T0008'){	keyValue = cnslList[i].wkplTelNo;												}		//직장전화번호
					if(CNSL116SEL01Index[k].mgntItemCd == 'T0009'){	keyValue = cnslList[i].mbleTelNo;												}		//휴대전화번호
					
					let obj = {
							custItemDataVlu 	: keyValue,
							custItemGrpNo		: CNSL116SEL01Index[k].custItemGrpNo,
							custItemNo			: CNSL116SEL01Index[k].custItemNo,
							custNo				: cnslList[i].custNo,
							itemCd				: CNSL116SEL01Index[k].mgntItemCd,
							memo				: memo,
							rowNo				: CNSL116SEL01Index[k].rowNo,
							custItemDataNm		: CNSL116SEL01Index[k].mgntItemNm,
							crypTgtYn			: CNSL116SEL01Index[k].crypTgtYn,
							
					}
					
					cnslListItem.push(obj);
					objItem[keyNm] = keyValue;
				}
				objItem["itemArr"] = cnslListItem;
				custList.push({ ...objItem });
				
			} 
			
		}
		
		CNSL116P_grid[0].dataSource.data(custList);
		
		
		for(var i=0; i<custList.length; i++){
			
			console.log(custList);
			
			for(var k=0; k<custList[i].itemArr.length; k++){
				var custItemObj = {
						"tenantId" 			: GLOBAL.session.user.tenantId,
						"usrId" 			: GLOBAL.session.user.usrId,
						"orgCd" 			: GLOBAL.session.user.orgCd,
						"custItemGrpNo" 	: custList[i].itemArr[k].custItemGrpNo,
						"custItemNo" 		: custList[i].itemArr[k].custItemNo,
						"rowNo" 			: custList[i].itemArr[k].rowNo,
						"custNo" 			: custList[i].itemArr[k].custNo,
						"crypTgtYn" 		: custList[i].itemArr[k].crypTgtYn,
						"custItemDataVlu" 	: custList[i].itemArr[k].custItemDataVlu,
						"custItemDataNm" 	: custList[i].itemArr[k].custItemDataNm,
						"memo"				: custList[i].itemArr[k].memo,
					};
				
				console.log(custItemObj);
				
				Utils.ajaxCall("/cnsl/CNSL161INS02", JSON.stringify(custItemObj), function (result) {});
			}
			
		}
		
	});
}

function CNSL116P_fnClear(){
	
	
	
	
	
	$("#CNSL116P_filter").val("");
	CNSL116P_applyFilter(CNSL116P_grid[0], "CNSL116P_filter");	
}


function CNSL116P_fnPopClose(){
	self.close();	
}
	

/////////////////////////////////
// 버튼 이벤트

$("#CNSL116P_excelDown").click(function () 				{ 	CNSL116P_excelExport();	 	});
$("#CNSL116P_excelUpload").click(function () 			{ 	CNSL116P_excelUpload();	 	});
$("#CNSL116P_upfile").on("change",function(e)			{	CNSL116P_excelUpfile(e);	 });
$("#CNSL116P_btnCustLoad").click(function () 			{ 	CNSL116P_fnCustLoad();	 	});		//kw---20240605 : 1차버전 고객 정보 가져오기

