var CNSL220TDataSource,grdCNSL220T
var startCNSL220, endCNSL220;
var grdCNSL220Target = '';

$(document).ready(function() {
	$(".CNSL220 #srchTxt").on( "keyup", function(e){
		if (e.keyCode === 13) {
			CNSL220TDataSourceSet();
        }
	});
	
	//공통콤보 불러오기
	var data = { "codeList": [
		{"mgntItemCd":"S0001"}
	]};
    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList120,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
    
    startCNSL220 = $(".CNSL220 #startDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: startChangeCNSL220,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	endCNSL220 = $(".CNSL220 #endDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: endChangeCNSL220,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");

	startCNSL220.max(endCNSL220.value());
	endCNSL220.min(startCNSL220.value()); 
	getRangeDayCNSL220(cnslRangeDay);
    
	CNSL220TDataSource ={
			transport: {
				read	: function (CNSL220T_jsonStr) {
					Utils.ajaxCall('/cnsl/CNSL220SEL01', CNSL220T_jsonStr, CNSL220T_resultIndex,
						()=> { window.kendo.ui.progress($("#grdCNSL220T"), true) }, () => { window.kendo.ui.progress($("#grdCNSL220T"), false) })
				},
			},
	}
	
	var grdCNSL220T_columns = [];
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		grdCNSL220T_columns = [ 
			{ width: 60, field: "unfyCntcHistNo", title: CNSL220T_langMap.get("CNSL220T.grid.column.unfyCntcHistNo")},
			{ width: 100, field: "cntcCustId", title: CNSL220T_langMap.get("CNSL220T.grid.column.cntcCustIdH"), },
			{ width: 100, field: "cntcTelNo", title: "인입번호", },
			{ width: 100, field: "cntcCustNm", title: CNSL220T_langMap.get("CNSL220T.grid.column.cntcCustNmH"), },
			{ width: 150, field: "cnslTypNm", title: CNSL220T_langMap.get("CNSL220T.grid.column.cnslTypNm"), attributes: {"class": "k-text-left"}},
			{ width: 150, field: "cntcCpltHourptsec", title: CNSL220T_langMap.get("CNSL220T.grid.column.lstCorcDtm"), 
				 template: function (data) {
					 var cntcCpltHourptsec = (Utils.isNull(data.cntcCpltHourptsec) == true) ? data.cntcInclHourptsec : data.cntcCpltHourptsec;

					 if ( typeof(dateTimeSSCNSL200) != 'undefined' ) {
						 return dateTimeSSCNSL200(cntcCpltHourptsec);
					 }

					 if ( typeof(dateTimeSSCNSL300) != 'undefined' ) {
						 return dateTimeSSCNSL300(cntcCpltHourptsec);
					 }
                }
			},
			{ width: 50, field: "phrecKey", title: CNSL220T_langMap.get("CNSL220T.grid.column.phrecKey"), 
				template: function (data) {
                	if ( data.phrecKey == '' || data.phrecKey == null ) {
                		return '';
                	} else {
                		return '<button class="k-icon k-i-volume-up btListen" title="'+CNSL220T_langMap.get("CNSL220T.grid.column.phrecKey")+'" onclick="recPlay(\''+data.phrecKey+'\');"></button>'
                	}
                }
			}
		]
	} else {
		grdCNSL220T_columns = [ 
			{ width: 60, field: "unfyCntcHistNo", title: CNSL220T_langMap.get("CNSL220T.grid.column.unfyCntcHistNo")},
			{ width: 100, field: "cntcCustId", title: CNSL220T_langMap.get("CNSL220T.grid.column.cntcCustId"), },
			{ width: 100, field: "cntcTelNo", title: "인입번호", },
			{ width: 100, field: "cntcCustNm", title: CNSL220T_langMap.get("CNSL220T.grid.column.cntcCustNm"), },
			{ width: 150, field: "cnslTypNm", title: CNSL220T_langMap.get("CNSL220T.grid.column.cnslTypNm"), attributes: {"class": "k-text-left"}},
			{ width: 150, field: "cntcCpltHourptsec", title: CNSL220T_langMap.get("CNSL220T.grid.column.lstCorcDtm"), 
				template: function (data) {
					var cntcCpltHourptsec = (Utils.isNull(data.cntcCpltHourptsec) == true) ? data.cntcInclHourptsec : data.cntcCpltHourptsec;

					if ( typeof(dateTimeSSCNSL200) != 'undefined' ) {
						return dateTimeSSCNSL200(cntcCpltHourptsec)
					}
					if ( typeof(dateTimeSSCNSL300) != 'undefined' ) {
						return dateTimeSSCNSL300(cntcCpltHourptsec)
					}

					return dateTimeSSCNSL200(cntcCpltHourptsec);
                }
			},
			{ width: 50, field: "phrecKey", title: CNSL220T_langMap.get("CNSL220T.grid.column.phrecKey"),
				template: function (data) {
                	if ( data.phrecKey == '' || data.phrecKey == null ) {
                		return '';
                	} else {
                		return '<button class="k-icon k-i-volume-up btListen" title="'+CNSL220T_langMap.get("CNSL220T.grid.column.phrecKey")+'" onclick="recPlay(\''+data.phrecKey+'\');"></button>'
                	}
                }
			}
		]
	}
	
	$("#grdCNSL220T").kendoGrid({
		DataSource : CNSL220TDataSource,
		noRecords: {
			template: `<div class="nodataMsg"><p>${CNSL220T_langMap.get("CNSL220T.grid.nodatafound")}</p></div>`
	    },
		autoBind: false,
		sortable: true,
		scrollable: true,
		selectable: "row",
		resizable: true,
		pageable: {refresh:false
			, pageSizes:[ 25, 50, 100, 200,  500]
			, buttonCount:10
			, pageSize : 25
			, messages: {
				display: " "
				, itemsPerPage: ""
			    }
		},
		columns: grdCNSL220T_columns,
		dataBound: function(e) {
			// let grid = e.sender;
			// let gridColmuns = grid.columns;
			// let autoFitIdx = grid.columns.findIndex(x=>x.field === "cnslTypNm")
			// let options = grid.getOptions();
			// debugger;
			// delete options.columns
			// if (innerWidth <= 1920) {
			// 	gridColmuns[4].width = 150;
			// 	grid.setOptions({...options, columns:gridColmuns})
			// 	grid.refresh();
			// 	return grid.autoFitColumn(autoFitIdx);
			// } else {
			// 	delete options.columns
			// 	gridColmuns[4].width = "auto";
			// 	grid.setOptions({...options, columns:gridColmuns})
			// 	grid.refresh();
			// }
		},
		change: function(e) {
			let selectedRows = this.select();
			CNSL220T_selItem = this.dataItem(selectedRows[0]);
			if (grdCNSL220Target == CNSL220T_selItem.unfyCntcHistNo + "_" + CNSL220T_selItem.telCnslHistSeq) {
				if ( nowCallId != '' ) {
					Utils.alert('상담이력을 저장해주세요.');
					return false;
				}
				cntcHistNo = CNSL220T_selItem.unfyCntcHistNo;
				cnslHistSeq = CNSL220T_selItem.telCnslHistSeq;
				CNSL200MTabClick("/bcs/cnsl/CNSL213T")
				if ( typeof(setCNSL213SEL01) != 'undefined' ) {
					if ( nowCallId == '' ) {
						cnslState = 'init';
					}
					CNSL213BtnMode(cnslState);
					setCNSL213SEL01();
				}
			} 
			grdCNSL220Target = CNSL220T_selItem.unfyCntcHistNo + "_" + CNSL220T_selItem.telCnslHistSeq;
		}
	});
	grdCNSL220T = $("#grdCNSL220T").data("kendoGrid");
	
//	heightResizeCNSL();
	CNSL220TDataSourceSet();
	CNSL_Utils.setfunctionCustIdList(CNSL220TDataSourceSet);
	
	//kw---20240507 : 상담이력 사이즈 변경 수정
	CNSL220T_GridResize();
});

//kw---20240507 : 상담이력 사이즈 변경 수정
$(window).resize(function(){
	CNSL220T_GridResize();
});

//kw---20240507 : 상담이력 사이즈 변경 수정
function CNSL220T_GridResize(){
	let scrnHeight = $(window).height()-200;
	grdCNSL220T.element.find('.k-grid-content').css('height', scrnHeight-642);
}

function resultComboList120(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	
	Utils.setKendoComboBox(jsonDecode, "S0001", '.CNSL220 .S0001', '', false) ;
}

function getRangeDayCNSL220(rangeDay) {
	
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
	
    $(".CNSL220 #startDate").val(startDate);
    $(".CNSL220 #endDate").val(endDate);
}


function startChangeCNSL220() {
	var startDate = startCNSL220.value();
	var endDate = endCNSL220.value();

	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		endCNSL220.min(startDate);
	} else if (endDate) {
		startCNSL220.max(new Date(endDate));
	} else {
		endDate = new Date();
		startCNSL220.max(endDate);
		endCNSL220.min(endDate);
	}
}

function endChangeCNSL220() {
	var endDate = endCNSL220.value();
	var startDate = startCNSL220.value();

	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		startCNSL220.max(endDate);
	} else if (startDate) {
		endCNSL220.min(new Date(startDate));
	} else {
		endDate = new Date();
		startCNSL220.max(endDate);
		endCNSL220.min(endDate);
	}
}

function CNSL220T_resultIndex(data){
	if ( data.CNSL220SEL01 != null ) {
		var CNSL220T_jsonEncode = JSON.stringify(data.CNSL220SEL01);
		var CNSL220T_jsonDecode = JSON.parse(JSON.parse(CNSL220T_jsonEncode));
		grdCNSL220T.dataSource.data(CNSL220T_jsonDecode);
	}
}	

function CNSL220TDataSourceSet() {
	var CNSL220T_data = {
		"tenantId"   : GLOBAL.session.user.tenantId,
		"usrId"      : GLOBAL.session.user.usrId,
		"cntcCustId" : custId,
		"srchType"   : $(".CNSL220 #srchType").val(),
		"srchTxt"    : $(".CNSL220 #srchTxt").val(),
		"startDate"  : $(".CNSL220 #startDate").val().replace(/\-/g, ''),
		"endDate"    : $(".CNSL220 #endDate").val().replace(/\-/g, ''),
		"encryptYn"  : Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1
    };
	
	var cntcCustIdExist = Utils.isNull(custId);
	var srchTxt			= Utils.isNull($(".CNSL220 #srchTxt").val());
	
	if(cntcCustIdExist != true || srchTxt != true){
		var CNSL220T_jsonStr = JSON.stringify(CNSL220T_data);
		CNSL220TDataSource.transport.read(CNSL220T_jsonStr);
	}
}

