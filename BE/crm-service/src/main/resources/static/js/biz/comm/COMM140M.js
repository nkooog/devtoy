var COMM140M_userInfo = GLOBAL.session.user;
var COMM140M_CommCodeList;
var COMM140M_Grid =new Array(1);
var COMM140M_memoMaxLength = 50;

for(var i=0; i<COMM140M_Grid.length; i++) {
	COMM140M_Grid[i]={
		instance: {},
		dataSource :{},
		currentItem: {},
		currentCellIndex : Number(),
		currentRowIndex: Number(),
		selectedItems: [],
		loadCount :0,
	}
}

$(document).ready(function(){
	//1. 콤보 설정
	COMM140M_fnCommCdGet();

	//2.테넌트 설정
	//COMM140M_fnSetTenentName();
	CMMN_SEARCH_TENANT["COMM140M"].fnInit(null,COMM140M_fnSearchList);
});


////////////////////////////////////////////////////공통 함수 ///////////////////////////////////////////////////////////////////////////
function COMM140M_fnCommCdGet(){
	var mgntItemCdList = [
		{"mgntItemCd":"C0211"},		//공휴일 구분
		{"mgntItemCd":"C0212"},		//공휴일코드(법정공휴일)
		{"mgntItemCd":"C0213"},		//공휴일코드(임시공휴일)
		{"mgntItemCd":"C0214"},		//공휴일코드(테넌트지정공휴일)
		{"mgntItemCd":"S0012"},		//연도 구분
	];

	Utils.ajaxCall('/comm/COMM100SEL01',  JSON.stringify({ "codeList": mgntItemCdList}),function(data){
		COMM140M_CommCodeList = JSON.parse(JSON.parse(JSON.stringify(data.codeList)));
		Utils.setKendoComboBox(COMM140M_CommCodeList, "C0211", '#COMM140M input[name=searchLhldDv]',"",true);
		Utils.setKendoComboBox(COMM140M_CommCodeList, "S0012", '#COMM140M input[name=searchBussDtDv]',"",true);
	},null,null,null );
}

////////////////////////////////////////////////// grid ///////////////////////////////////////////////////////////////////////////
//COMM140M_Grid[0].dataSource 
COMM140M_Grid[0].dataSource = new kendo.data.DataSource({
	transport: {
		read : function(options){
			var tenantId 		= $("#COMM140M_tenantId").val();
			var searchBussDtDv	= $("#searchBussDtDv").val();
			var searchLhldDv	= $("#searchLhldDv").val();
			var yearsConditions	= $("#yearsConditions").val();
			var daysConditions	= $("#daysConditions").val();
			var mgntitemCd 		= (searchLhldDv != "") ? Utils.getComCdSubMgntitem(COMM140M_CommCodeList, "C0211", searchLhldDv) : "";
			
			var params = {
					tenantId 		: tenantId,
					searchBussDtDv	: searchBussDtDv,
					searchLhldDv	: searchLhldDv,
					yearsConditions	: yearsConditions,
					daysConditions	: daysConditions,
					mgntitemCd		: mgntitemCd,
			}
			
			//페이징 초기화
			var page = COMM140M_Grid[0].dataSource.page();
			if(page != 1){
				COMM140M_Grid[0].dataSource.page(1);
			}

			Utils.ajaxCall("/comm/COMM140SEL01", JSON.stringify(params), function (result) {
				options.success(JSON.parse(result.list));
			});
		},
		update :function(options){
			var nextStep = true;
			$.each(options.data.models, function(index, item){				
				var lhldDvCd  = item.lhldDvCd;
				var lhldCd	  = item.lhldCd;
				var bussStrTm = item.bussStrTm;
				var bussEndTm = item.bussEndTm;
				
				//영업일만 체크
				if(lhldDvCd == "1"){
					if("00:00" == bussStrTm){
						COMM140M_fnValidMsg(COMM140M_langMap.get("COMM140M.validMsg6"));
						nextStep = false;
						return false;
					}
					if("00:00" == bussEndTm){
						COMM140M_fnValidMsg(COMM140M_langMap.get("COMM140M.validMsg7"));
						nextStep = false;
						return false;
					}
					
					var stTm 	= bussStrTm.replace(":","");
					var endTm 	= bussEndTm.replace(":","");
					
					if(Number(stTm) > Number(endTm)){
						COMM140M_fnValidMsg(COMM140M_langMap.get("COMM140M.validMsg8"));
						nextStep = false;
						return false;
					}
				}
				//영업일
				item.bussDt = item.bussDt.replaceAll("-","");
				
				//영업시작 시간
				if(Utils.isNull(item.bussStrTm ) != true){
					var bussStrTm 		= item.bussStrTm;
					var arrBussStrTm 	= bussStrTm.split(":");
					item.bussStrHour 	= arrBussStrTm[0];
					item.bussStrPt 		= arrBussStrTm[1];
				}
				
				//영업종료 시간
				if(Utils.isNull(item.bussEndTm ) != true){
					var bussEndTm 		= item.bussEndTm;
					var arrBussEndTm 	= bussEndTm.split(":");
					item.bussEndHour 	= arrBussEndTm[0];
					item.bussEndPt 		= arrBussEndTm[1];
				}
				
				if(lhldDvCd != "1"){
					if(Utils.isNull(lhldCd) == true){
						//COMM140M_langMap.get("COMM140M.validMsg8")
						COMM140M_fnValidMsg(COMM140M_langMap.get("COMM140M.validMsg14"));
						nextStep = false;
						return false;	
					}
				}
				
				//관리항목코드 추출 및 업데이트
				var subMgntItemCd = Utils.getComCdSubMgntitem(COMM140M_CommCodeList, "C0211", item.lhldDvCd);
					item.mgntitemCd = (subMgntItemCd == "1") ? "C0211" : subMgntItemCd;		//영업일은 별도의 하위코드가 없음으로 부모코드로 설정
			});
			
			//처리 조건
			if (nextStep == false) {
				//로딩 화면 사용 금지
				setTimeout(function(e) {
		            $(".k-loading-mask").hide();
		        });
			} else {
				var updateList = options.data.models;
				var regInfo = {
						lstCorprId		: COMM140M_userInfo.usrId,
						lstCorprOrgCd	: COMM140M_userInfo.orgCd
				};
	
				$.each(updateList, function (index, item) {
					$.extend(item, regInfo);
				});
				//console.log(updateList);
				Utils.ajaxCall("/comm/COMM140UPT01", JSON.stringify({
					list: updateList
				}), function (result) {
					if(result.result == "success"){
						Utils.alert(COMM140M_langMap.get("COMM140M.validMsg9"));
						
						COMM140M_fnValidMsg("");
						
						options.success(updateList);
						
						//COMM140M_Grid[0].dataSource.read();
						COMM140M_fnSearchList();
					} else {
						COMM140M_fnValidMsg(COMM140M_langMap.get("COMM140M.validMsg10"));
					}
				});
			}
		},
		destroy :function(options){
			options.success(options.data.models);
		},
		create :function(options){
		}
	},
	requestStart:function (e){
		var type = e.type; var response = e.response;
	},
	requestEnd : function (e){
		var type = e.type;
        var response = e.response;
		if (type != "read" && type != "destroy") {
			Utils.markingRequiredField();
		}
	},
	batch : true,
	pageSize: 100,
	schema:{
		type: "json",
		model:{
			id: "seq",
			fields: {
				seq				:	{ field: "seq", 			type: "string", editable: false},
				tenantId		:	{ field: "tenantId", 		type: "string", editable: false},
				bussDt			:	{ field: "bussDt", 			type: "string", editable: false},
				wdayDvCd		:	{ field: "wdayDvCd", 		type: "string", editable: false},
				wdayDvCdNm		:	{ field: "wdayDvCdNm", 		type: "string", editable: false},
				lhldDvCd		:	{ field: "lhldDvCd", 		type: "string"  },
				mgntitemCd		:	{ field: "mgntitemCd", 		type: "string", editable: false},
				lhldCd			:	{ field: "lhldCd", 			type: "string", },
				bussStrHour		:	{ field: "bussStrHour", 	type: "string", editable: false},
				bussStrPt		:	{ field: "bussStrPt", 		type: "string", editable: false},				
				bussStrTm		:	{ field: "bussStrTm", 		type: "string", },				
				bussEndHour		:	{ field: "bussEndHour", 	type: "string", editable: false},
				bussEndPt		:	{ field: "bussEndPt", 		type: "string", editable: false},				
				bussEndTm		:	{ field: "bussEndTm", 		type: "string", },				
				memo			:	{ field: "memo", 			type: "string", },
				regDtm			:	{ field: "regDtm", 			type: "string", editable: false},
				regrId			:	{ field: "regrId", 			type: "string", editable: false},
				regrOrgCd		:	{ field: "regrOrgCd", 		type: "string", editable: false},
				lstCorcDtm		:	{ field: "lstCorcDtm", 		type: "string", editable: false},
				lstCorprId		:	{ field: "lstCorprId", 		type: "string", editable: false},
				lstCorprOrgCd	:	{ field: "lstCorprOrgCd", 	type: "string", editable: false},
				abolDtm			:	{ field: "abolDtm", 		type: "string", editable: false},
				abolmnId		:	{ field: "abolmnId", 		type: "string", editable: false},
				abolmnOrgCd		:	{ field: "abolmnOrgCd", 	type: "string", editable: false},
			}
		}
	}
});

COMM140M_Grid[0].instance = $("#COMM140M_Grid0").kendoGrid({
	dataSource: COMM140M_Grid[0].dataSource,
	noRecords: { template: '<div class="nodataMsg"><p>'+COMM140M_langMap.get("grid.nodatafound")+'</p></div>' },
	dataBound: function() {
		COMM140M_Grid_fnOnDataBound(0);
    },
    change: function(e) {
    	COMM140M_Grid_fnOnChange(e, 0);
    }, 
	scrollable : true,
	autoBind : false,
	selectable : "multiple,row",
	//persistSelection : true,
	editable : true,
	edit: function(e){
		//메모 길이 제어
    	var memo = e.container.find("input[name=memo]");
	    	memo.on('keyup',function(){
	    		if($(memo).val().length > COMM140M_memoMaxLength){
	    			$(memo).val($(memo).val().substr(0,COMM140M_memoMaxLength));
	    			COMM140M_fnValidMsg(COMM140M_memoMaxLength + COMM140M_langMap.get("COMM140M.validMsg1"));
	    			return;
	    		}
	    	});
    	//그리드 내용 자동 선택
    	$(e.container).find("input[type=text]").select();
	},
	sortable : false,
	resizable : true,
	pageable: {
        //refresh: true,
		//pageSizes: 100,
        //pageSizes: [25, 50, 100, 200, 500],
        //buttonCount: 10,
        //messages: {
        //    empty: SYSM340M_langMap.get("fail.common.select") // 조회된 내역이 없습니다.
        //}
    },
	columns: [
		{
			width : 30,
			selectable : true,
		},
		{
			width : 60,
			field : "seq",
			title : COMM140M_langMap.get("COMM140M.grid.seq"),
			attributes : {
				"class" : "textRight"
			},
		},
		{
			width : 120,
			field : "tenantId",
			title : COMM140M_langMap.get("COMM140M.grid.tenantid"),
		},
		{
			width : 120,
			field : "bussDt",
			title : COMM140M_langMap.get("COMM140M.grid.bussDt"),
			attributes : {
				"class" : "day"
			},
		},
		{	//요일
			width : 100,
			field : "wdayDvCdNm",
			title : COMM140M_langMap.get("COMM140M.grid.wdayDvCdNm"),
			template : function(dataItem){
				var wdayDvCd = dataItem.wdayDvCd;
				var lhldDvCd = dataItem.lhldDvCd;
				var	lhldCd	 = dataItem.lhldCd; 
				var wdayDvCdNm = dataItem.wdayDvCdNm;
				
				if(lhldDvCd == "2"){
					//일요일 & 공휴일
					if(Number(lhldCd) > 10 ){
						wdayDvCdNm = "<p style='color: red;'>"+wdayDvCdNm+"</p>"
					}
					//토요일
					else if(wdayDvCd == "7"){
						wdayDvCdNm = "<p style='color: blue;'>"+wdayDvCdNm+"</p>"	
					}
				} else if(Number(lhldDvCd) > 2){
					wdayDvCdNm =  "<p style='color: red;'>"+wdayDvCdNm+"</p>"
				}
				
				return wdayDvCdNm;
			}
		},
		{	//공휴일 구분
			width : 100,
			field : "lhldDvCd",
			title : COMM140M_langMap.get("COMM140M.grid.lhldDvCd"),
			template : function(dataItem) {
				var wdayDvCd 	= dataItem.wdayDvCd;
				var lhldDvCd 	= dataItem.lhldDvCd;
				var	lhldCd	 	= dataItem.lhldCd;
				var lhldDvCdNm 	= Utils.getComCdNm(COMM140M_CommCodeList, 'C0211',dataItem.lhldDvCd);
				
				//영업일이면 공휴일 상세를 null 처리
				if(lhldDvCd == "1"){
					dataItem.lhldCd = null;
				}
				
				//요일 색상 처리
				if(Number(lhldDvCd) == 2){
					//일요일 & 공휴일
					if(Number(lhldCd) > 10 ){
						lhldDvCdNm = "<p style='color: red;'>"+lhldDvCdNm+"</p>"
					}
					//토요일
					else if(wdayDvCd == "7"){
						lhldDvCdNm = "<p style='color: blue;'>"+lhldDvCdNm+"</p>"	
					}
					
				} else if(Number(lhldDvCd) > 2){
					lhldDvCdNm =  "<p style='color: red;'>"+lhldDvCdNm+"</p>"
				}
				
				return lhldDvCdNm;
			},
			editor : function(container, options) {
				return COMM140M_fnSubGridEditeTemplate(container, options, "C0211","select", 0);
			},
			attributes : {
				"class" : "textLeft",
			},
		},
		{	//공휴일 상세
			width : 220,
			field : "lhldCd",
			title : COMM140M_langMap.get("COMM140M.grid.lhldCd"),
			attributes : {
				"class" : "textLeft",
			},
			template : function(dataItem){
				var mgntitemCd 		= "C0211";
				var lhldCd			= dataItem.lhldCd;
				var lhldDvCd 		= dataItem.lhldDvCd;
				var wdayDvCd 		= dataItem.wdayDvCd;
				var subMgntItemCd 	= Utils.getComCdSubMgntitem(COMM140M_CommCodeList, mgntitemCd, lhldDvCd);
					subMgntItemCd = (subMgntItemCd == "1") ? mgntitemCd : subMgntItemCd;
				var lhldCdNm = Utils.getComCdNm(COMM140M_CommCodeList, subMgntItemCd, lhldCd);
				
				//요일 색상 처리
				if(Number(lhldDvCd) == 2){
					//일요일 & 공휴일
					if(Number(lhldCd) > 10 ){
						lhldCdNm = "<p style='color: red;'>"+lhldCdNm+"</p>"
					}
					//토요일
					else if(wdayDvCd == "7"){
						lhldCdNm = "<p style='color: blue;'>"+lhldCdNm+"</p>"	
					}
					
				} else if(Number(lhldDvCd) > 2){
					lhldCdNm =  "<p style='color: red;'>"+lhldCdNm+"</p>"
				}
				
				return (lhldCdNm==null) ? "" : lhldCdNm;
			},
			editor : function(container, options) {
				var mgntitemCd 		= "C0211";
				var lhldCd 			= options.model.lhldCd;
				var lhldDvCd 		= options.model.lhldDvCd;
				var subMgntItemCd 	= Utils.getComCdSubMgntitem(COMM140M_CommCodeList, mgntitemCd, lhldDvCd);
					subMgntItemCd 	= (subMgntItemCd == "1") ? mgntitemCd : subMgntItemCd;
					
				if(lhldDvCd == "1"){
					return false;
				} else {
					return COMM140M_fnSubGridEditeTemplate(container, options, subMgntItemCd,"select", 0);	
				}
			}, 
			
		},
		{
			width: 125,
			field: "bussStrTm", 
			title: COMM140M_langMap.get("COMM140M.grid.bussStrTm"),
			format : "{0:HH:mm}",
			editor: function(container,options){
				COMM140M_TimePickerEditor(container, options);
			},
			template: function(dataItem) {
				var bussStrTm = dataItem.bussStrTm;
				
				if(bussStrTm.length > 5){
					dataItem.bussStrTm = kendo.format("{0:HH:mm}", new Date(bussStrTm));
				} else {
					dataItem.bussStrTm = bussStrTm;
				}
				//컬럼에 값 설정
				return dataItem.bussStrTm;
			},			
		},
		{
			width: 125,
			field: "bussEndTm", 
			title: COMM140M_langMap.get("COMM140M.grid.bussEndTm"),
			format : "{0:HH:mm}",
			editor: function(container,options){
				COMM140M_TimePickerEditor(container, options);
			},
			template: function(dataItem) {
				var bussEndTm = dataItem.bussEndTm;
				
				if(bussEndTm.length > 5){
					dataItem.bussEndTm = kendo.format("{0:HH:mm}", new Date(bussEndTm));
				} else {
					dataItem.bussEndTm = bussEndTm;
				}
				//컬럼에 값 설정
				return dataItem.bussEndTm;
			},
		},
 		{
			width : "auto",
			field : "memo",
			title : COMM140M_langMap.get("COMM140M.grid.memo"),
			attributes : {
				"class" : "textLeft",
			},
		}, 
	],
	
}).data('kendoGrid');

///////////////////////////////////////////////////////////////////////////////////////////////// Basic Function ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function COMM140M_Grid_fnOnDataBound(gridIndex) {
	let totalCnt = COMM140M_Grid[0].instance.dataSource.total();
	
	$("#COMM140M_Grid" + gridIndex + " tbody").on("click", "td", function(e) {
        var $row = $(this).closest("tr");
        var $cell = $(this).closest("td");
        COMM140M_Grid[gridIndex].currentItem = COMM140M_Grid[gridIndex].instance.dataItem($row);
        COMM140M_Grid[gridIndex].currentCellIndex = $cell.index();

    });
	
	COMM140M_Grid[gridIndex].loadCount++;
}

function COMM140M_Grid_fnOnChange(e, gridIndex) {
    var rows = e.sender.select(),
        items = [];

    rows.each(function(e) {
        var dataItem = COMM140M_Grid[gridIndex].instance.dataItem(this);
        items.push(dataItem);
    });
    COMM140M_Grid[gridIndex].selectedItems = items;
}
//테넌트 설정
function COMM140M_fnSetTenentName(){
	$('#COMM140M_tenantId').blur(function(event) {
		let check = $('#COMM140M_tenantId').val().toUpperCase();
		if(check.length == 0){
			$('#COMM140M_tenantNm').val('');
		}		
    });
	$("#COMM140M_tenantId").on("propertychange change keyup paste input", function() {
		let currentVal = $(this).val().toUpperCase();
		if(currentVal.length >=3){
	    	$('#COMM140M_tenantId').val(currentVal);
		    COMM140M_SearchTenantNm();
	    }			
	});		
	
	COMM140M_fnInitTenent();
}

//grid 저장
function COMM140M_fnSave(gridIndex){
	COMM140M_Grid[gridIndex].instance.dataSource.sync().then(function (result) {
		//alert(result);
	});
}

//grid 조회
function COMM140M_fnSearchList(){
	var searchBussDtDv 	= $("#searchBussDtDv").val();
	var yearsConditions = $("#yearsConditions").val();
	var daysConditions 	= $("#daysConditions").val();
	var searchLhldDv	= $("#searchLhldDv").val();
	
	if(searchBussDtDv != "" && yearsConditions == ""){
		COMM140M_fnValidMsg(COMM140M_langMap.get("COMM140M.validMsg11"));
		//$("#searchBussDtDv").focus();
		//$("#combobox").data("searchBussDtDv").focus();
		return;
	}
	
	if(searchBussDtDv != "" && (searchBussDtDv == "Y2" || searchBussDtDv == "Y4" || searchBussDtDv == "Y6")){
		
		var arrYearsConditions = yearsConditions.split(",");
		
		if(arrYearsConditions.length < 2){
			COMM140M_fnValidMsg(COMM140M_langMap.get("COMM140M.validMsg12"));
			return;
		}
	}
	
	if(searchLhldDv != "" && searchLhldDv != "1"  && daysConditions == ""){
		COMM140M_fnValidMsg(COMM140M_langMap.get("COMM140M.validMsg13"));
		//$("#searchBussDtDv").focus();
		//$("#combobox").data("searchLhldDv").focus();
		return;
	}

	//팝업 닫기
	COMM140M_fnCloseSearchConditionPop();
	
	//팝업2 닫기
	COMM140M_fnCloseSearchConditionPop2();
	
	//조회 실행
	//COMM140M_Grid[0].dataSource.read();

	COMM140M_Grid[0].instance.clearSelection();
	COMM140M_Grid[0].currentItem = new Object();
	COMM140M_Grid[0].instance.dataSource.read();
}

//공휴일 구분
function COMM140M_fnSubGridEditeTemplate(container, options, mgntItemCd, isTotalOption, gridNumber) {
	var $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);
	//Utils.setKendoComboBox(COMM140M_CommCodeList, "C0211", '#COMM140M input[name=searchLhldDv]',"",true);
	Utils.setKendoComboBox(COMM140M_CommCodeList, mgntItemCd, $select, "", isTotalOption).bind("change", function (e) {
		
		var dataItem = COMM140M_Grid[gridNumber].instance.dataItem(e.sender.element.closest("tr"));
		
		//lhldCd
		if(mgntItemCd == "C0211"){
			dataItem.set('lhldCd', "");
			dataItem.set('bussStrTm', "00:00");
			dataItem.set('bussEndTm', "00:00");
		}
		
		dataItem.set(options.field, e.sender.value());
		COMM140M_Grid[gridNumber].instance.refresh();
	});
}

//그리드 시간 선택
function COMM140M_TimePickerEditor(container, options){
	 $('<input data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" data-format="' + options.format + '" />').appendTo(container).kendoTimePicker({
			dateInput:true,
	     	format: "0:HH:mm",
	     	interval:"10", 
	     	min: "00:00", 
	     	max:"23:59", 
	     	culture:"ko-KR", 
	     	componentType:"classic",
			change: function (e) {
				//console.log("event : %o", e);
				//console.log("time : " , e.sender._oldText);
			}
    });
}

//날짜 표현1 : : yyyy-MM-dd 
function COMM140M_fnStrToYmd(strYearMonthDay){
	return (strYearMonthDay.length == 8) ? strYearMonthDay.substring(0,4) + "-" + strYearMonthDay.substring(4,6) + "-" + strYearMonthDay.substring(6,8) : strYearMonthDay;
}

//날짜 표현2 :  : yyyy년 MM월
function COMM140M_fnFormatYearMonth(strYearMonth){
	return (strYearMonth.length == 6) ? strYearMonth.substr(0,4) + "년 " + strYearMonth.substring(4,6) + "월" : strYearMonth;
}

//날짜 표현3 : yyyy년 MM월 dd일
function COMM140M_fnFormatYearMonthDay(strYearMonthDay){
	return (strYearMonthDay.length == 8) ? strYearMonthDay.substr(0,4) + "년 " + strYearMonthDay.substring(4,6) + "월 " + strYearMonthDay.substring(6,8)+"일" : strYearMonthDay;
}

//시간 형태
function COMM140M_fnStrToHhMm(str){
	return (str.length == 4) ? str.substring(0,2) + ":" + str.substring(2,4) : str;
}

//메모 길이 계산
function COMM140M_fnGetbyte(str){
	return stringByteLength = str.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g,"$&$1$2").length;
}

//메시지 출력
function COMM140M_fnValidMsg(msg){
	$("#COMM140M_validMsg").val(msg);
}

//////////////////////////////////////////////// 그리드 사이즈 조정 ///////////////////////////////////////////////////////////////////////////
COMM140M_GridResize();   

//Grid   Height  체크
function COMM140M_GridResize() {   
	var screenHeight = $(window).height()-249;     //   (헤더+ 푸터 ) 영역 높이 제외
	COMM140M_Grid[0].instance.element.find('.k-grid-content').css('height', screenHeight-290);   //   (헤더+ 푸터+ 검색 )영역 높이 440
};

$(window).on({ 
	'resize': function() {
		COMM140M_GridResize();   
	},   
});
