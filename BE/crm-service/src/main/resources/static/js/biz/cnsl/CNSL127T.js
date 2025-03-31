var listViewCNSL127T_1;
var startCNSL127, endCNSL127;
var CNSL127T_grdCNSL127T, CNSL127TDataSource;
var CNSL127T_comCdList;


/**
 * 통화이력 클릭 이벤트 시 실행 이벤트 함수
 * 각 화면의 최상단에 선언하여 사용
 * 규칙 js 파일명 +_ + init()
 * 1. 기존 데이터 초기화
 * 2. 데이터 세팅
 * 3. 데이터 조회
 * @constructor
 */
function CNSL127T_initSearch(){
	setCNSL127SEL01();
}

$(document).ready(function() {

	CNSL127T_fnInit();

	$(".CNSL127 .btnRefer_default").click(function() {
		if($(this).text() == "직접입력") $(".CNSL101 #startDate").prop("disabled", true);
	});

	let cntcCustIdTitle = '';
	let cntcCustNm ='';

	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		cntcCustIdTitle = '환자번호';
		cntcCustNm = '환자명';
	} else {
		cntcCustIdTitle = '고객번호'
		cntcCustNm = '고객명';
	}

	CNSL127TDataSource ={
			transport: {
				read	: function (data) {
					Utils.ajaxCall('/cnsl/CNSL127SEL01', data, CNSL127T_resultIndex
					,()=> window.kendo.ui.progress($("#grdCNSL127T"), true),()=> window.kendo.ui.progress($("#grdCNSL127T"), false)
					);
				},
			},
	}
    CNSL127T_grdCNSL127T = $("#grdCNSL127T").kendoGrid({
        dataSource: CNSL127TDataSource,
        selectable: true,
        detailExpand: function (e) {
           
        },
        change: function () {
            let $row = this.select();
            if ($row.length && $row.find('[aria-expanded="true"]').length) {
                this.collapseRow($row);
            } else {
                this.expandRow($row);
            }
        },
        dataBound: function () {
			selectFirstRow();
		},
        detailTemplate: kendo.template($("#templateCNSL127T").html()),    // id 명
        autoBind: false,
        resizable: true,
        refresh: false,
        scrollable: true,
        sortable: true,
        pageable: {
            pageSizes: [25, 50, 100, 400, 500]
            , buttonCount: 10
            , pageSize: 25
        },
        columns: [
            { field: "csnlCtt", title: CNSL127T_langMap.get("CNSL127T.grid.column.csnlCtt"), hidden: true,},
            {
				field: "cntcChnlCd", title: CNSL127T_langMap.get("CNSL127T.grid.column.cntcChnlCd"),type: "string", width: 45,
				editor: function (container, options) {
					CNSL127T_commonTypCdEditor(container, options, CNSL127T_grdCNSL127T.instance, 'C0130');
                },
                template: function (dataItem) { return '<i class="k-icon custHisChnl '+	Utils.getComProp(CNSL127T_comCdList, "C0130", dataItem.cntcChnlCd , "mapgVlu4") +'"></i>'}
			},
			{
				field: "cntcPathCd", title: CNSL127T_langMap.get("CNSL127T.grid.column.cntcPathCd"),type: "string", width: 95,
				editor: function (container, options) {
					CNSL127T_commonTypCdEditor(container, options, CNSL127T_grdCNSL127T.instance, dataItem.subMgntItemCd);
                },
                template: function (dataItem) {return Utils.getComCdNm(CNSL127T_comCdList, dataItem.subMgntItemCd, dataItem.cntcPathCd);}
			},
			{ width: 75, field: "cntcCustId", title: cntcCustIdTitle, },
			{ width: 105, field: "cntcTelNo", title: "인입전화번호", },
			{ width: 95, field: "cntcCustNm", title: cntcCustNm, },
            { width: 135, field: "cntcCpltDtm", title: CNSL127T_langMap.get("CNSL127T.grid.column.cntcCpltDtm"),
                template: function (data) {
                	if ( typeof(dateTimeSSCNSL100) != 'undefined' ) {
                		return dateTimeSSCNSL100(data.cntcCpltDtm)
                	}
                	if ( typeof(dateTimeSSCNSL200) != 'undefined' ) {
                		return dateTimeSSCNSL200(data.cntcCpltDtm)
                	}
					if ( typeof(dateTimeSSCNSL300) != 'undefined' ) {
						return dateTimeSSCNSL300(data.cntcCpltDtm)
					}
                }
            },
            { width: 105, field: "cnslTypNm", title: CNSL127T_langMap.get("CNSL127T.grid.column.cnslTypNm"), attributes: {"class": "k-text-left"} },
            { width: 100, field: "cnslrNm", title: CNSL127T_langMap.get("CNSL127T.grid.column.cnslrNm"), },
            {
				field: "cnslRsltCd", title: CNSL127T_langMap.get("CNSL127T.grid.column.cnslRsltCd"),type: "string", width: 60,
				editor: function (container, options) {
					CNSL127T_commonTypCdEditor(container, options, CNSL127T_grdCNSL127T.instance, 'C0152');
                },
                template: function (dataItem) {return Utils.getComCdNm(CNSL127T_comCdList, 'C0152', dataItem.cnslRsltCd);}
			},
            { width: 45, field: "phrecKey", title: CNSL127T_langMap.get("CNSL127T.grid.column.phrecKey"), template: function (data) {
            	if ( data.phrecKey == '' || data.phrecKey == null ) {
            		return '';
            	} else {
            		return '<button class="k-icon k-i-volume-up btListen" title="'+CNSL127T_langMap.get("CNSL127T.grid.column.phrecKey")+'" onclick="recPlay(\''+data.phrecKey+'\');"></button>'
            	}
            }
		}
        ],
        noRecords: {
			template: `<div class="nodataMsg"><p>${CNSL127T_langMap.get("CNSL127T.grid.nodatafound")}</p></div>`
	    },
    }).data("kendoGrid");
    CNSL127T_resizeGrid();
    $(window).resize(function () {
		CNSL127T_resizeGrid();
	});

	$("#CNSL127T_dateStart_btn3").click();
	$("#CNSL127T_dateStart_btn3").addClass('selected');

//	heightResizeCNSL();
	setCNSL127SEL01();
	
	for(var i=1; i<=5; i++){
		$(".CNSL127 #CNSL127T_dateStart_btn" + i).click(function() {
			if($(this).text() == "직접입력"){
				$(".CNSL127 #CNSL127T_dateStart").closest(".k-datepicker").find(".k-input-button").attr("disabled", false);
				$(".CNSL127 #CNSL127T_dateEnd").closest(".k-datepicker").find(".k-input-button").attr("disabled", false);
			} else {
				$(".CNSL127 #CNSL127T_dateStart").closest(".k-datepicker").find(".k-input-button").attr("disabled", true);
				$(".CNSL127 #CNSL127T_dateEnd").closest(".k-datepicker").find(".k-input-button").attr("disabled", true);
			}
		});	
	}
	
});

function CNSL127T_resizeGrid() {
    const screenHeight = $(window).height() - 210;     //   (헤더+ 푸터 ) 영역 높이 제외
	//   (헤더+ 푸터+ 검색 )영역 높이 440 
    CNSL127T_grdCNSL127T.element.find('.k-grid-content').css('height', screenHeight - 220 - 45);
	CNSL127T_grdCNSL127T.refresh();
}

function getRangeDayCNSL127(rangeDay) {
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
	
    $(".CNSL127 #CNSL127T_dateStart").val(startDate);
    $(".CNSL127 #CNSL127T_dateEnd").val(endDate);
}


function startChangeCNSL127() {
//	var startDate = startCNSL127.value();
//	var endDate = endCNSL127.value();
//
//	if (startDate) {
//		startDate = new Date(startDate);
//		startDate.setDate(startDate.getDate());
//		endCNSL127.min(startDate);
//	} else if (endDate) {
//		startCNSL127.max(new Date(endDate));
//	} else {
//		endDate = new Date();
//		startCNSL127.max(endDate);
//		endCNSL127.min(endDate);
//	}
}

function endChangeCNSL127() {
//	var endDate = endCNSL127.value();
//	var startDate = startCNSL127.value();
//
//	if (endDate) {
//		endDate = new Date(endDate);
//		endDate.setDate(endDate.getDate());
//		startCNSL127.max(endDate);
//	} else if (startDate) {
//		endCNSL127.min(new Date(startDate));
//	} else {
//		endDate = new Date();
//		startCNSL127.max(endDate);
//		endCNSL127.min(endDate);
//	}
}

function CNSL127T_resultIndex(data){
	var CNSL127T_jsonEncode = JSON.stringify(data.CNSL127SEL01);
	var CNSL127T_jsonDecode = JSON.parse(JSON.parse(CNSL127T_jsonEncode));
	CNSL127T_grdCNSL127T.dataSource.data(CNSL127T_jsonDecode);
	if(CNSL127T_jsonDecode.length){
		CNSL127T_grdCNSL127T.dataSource.page(1)
	}
}	

function setCNSL127SEL01() {
	$("#CNSL127_custId").val(custId);
	$("#CNSL127_custNm").val(custNm);
	$("#CNSL127_custTelNum").val(custTelNum);
	var CNSL127T_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"custId" : custId,
		"cntcTelNo" : custTelNum,
		"startDate" : $(".CNSL127 #CNSL127T_dateStart").val().replace(/\-/g, ''),
		"endDate" : $(".CNSL127 #CNSL127T_dateEnd").val().replace(/\-/g, '')
	};
	var CNSL127T_jsonStr = JSON.stringify(CNSL127T_data);
	CNSL127TDataSource.transport.read(CNSL127T_jsonStr);
	
    $("#grdCNSL127T").kendoTooltip({
      filter: "tr", //this filter selects the second column's cells and the second column header
      position: "bottom",
      width: 250,
      show: function(e){
          if(this.content.text().length > 0){
              this.content.parent().css("visibility", "visible");
          }else{
              this.content.parent().css("visibility", "hidden");
          }
      },
      hide: function(e){
          this.content.parent().css('visibility', 'hidden');
      },
      content: function(e){

      	  if(e.target.children().eq(0).attr('class').indexOf('k-header') == -1){
			  var dataItem = e.target.closest("tr").children('td')[1].innerText
			  return dataItem;
		  }
    	  
      }
    }).data("kendoTooltip");
}

function selectFirstRow(){
	CNSL127T_grdCNSL127T.select(CNSL127T_grdCNSL127T.tbody.find("tr").first());
}

function CNSL127T_fnInit() {
    var param = {
        "codeList": [
        	{"mgntItemCd":"C0130"},
        	{"mgntItemCd":"C0131"},
        	{"mgntItemCd":"C0132"},
        	{"mgntItemCd":"C0133"},
        	{"mgntItemCd":"C0134"},
        	{"mgntItemCd":"C0135"},
        	{"mgntItemCd":"C0136"},
        	{"mgntItemCd":"C0137"},
        	{"mgntItemCd":"C0138"},
        	{"mgntItemCd":"C0152"}
        ]
    };
    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        CNSL127T_comCdList = JSON.parse(result.codeList);
    });
}

function CNSL127T_commonTypCdEditor(container, options, grid, selectComCd) {
    $('<select data-bind="value:' + options.field + '"/>').appendTo(container).kendoComboBox({
        autoBind: true,
        dataTextField: "comCdNm",
        dataValueField: "comCd",
        dataSource: {
            data: CNSL127T_comCdList.filter(function (code) {
                return code.mgntItemCd == selectComCd
            })
        },
        change: function (e) {
            var element = e.sender.element;
            var row = element.closest("tr");
            var dataItem = grid.dataItem(row);
            var selectedValue = e.sender.value();
            
            grid.refresh();
        }
    });
}

//kw---20240726 : 달력 버튼 클릭 이벤트 추가
function CNSL127T_fnSetDate(_minDate){


	var dateStr = $("#endDate").val();
	var date = new Date(dateStr);
	date.setDate(date.getDate() - _minDate);
	var resultDateStr = date.toISOString().split('T')[0];

	$(".CNSL127 #CNSL127T_dateStart").val(resultDateStr);
	$(".CNSL127 #CNSL127T_dateStart").next("button").prop("disabled", true);
	$(".CNSL127 #CNSL127T_dateEnd").next("button").prop("disabled", true);
	
	$(".CNSL127 #CNSL127T_dateStart").prop("disabled", true);
	$(".CNSL127 #CNSL127T_dateEnd").prop("disabled", true);
	
	console.log(":::: CNSL127T_fnSetDate");

	$("#CNSL127T_dateStart_btn2").removeClass('selected');
	$("#CNSL127T_dateStart_btn3").removeClass('selected');
	$("#CNSL127T_dateStart_btn4").removeClass('selected');
	$("#CNSL127T_dateStart_btn5").removeClass('selected');

	if(_minDate == '7'){ 		$("#CNSL127T_dateStart_btn2").addClass('selected'); }
	else if(_minDate == '30'){ 	$("#CNSL127T_dateStart_btn3").addClass('selected'); }
	else if(_minDate == '90'){ 	$("#CNSL127T_dateStart_btn4").addClass('selected'); }

}

function CNSL127T_fnSetEnable(){
	$(".CNSL127 #CNSL127T_dateStart").prop("disabled", false);
	$(".CNSL127 #CNSL127T_dateStart").next("button").prop("disabled", false);

	$(".CNSL127 #CNSL127T_dateEnd").prop("disabled", false);
	$(".CNSL127 #CNSL127T_dateEnd").next("button").prop("disabled", false);

	$("#CNSL127T_dateStart_btn2").removeClass('selected');
	$("#CNSL127T_dateStart_btn3").removeClass('selected');
	$("#CNSL127T_dateStart_btn4").removeClass('selected');
	$("#CNSL127T_dateStart_btn5").removeClass('selected');

	$("#CNSL127T_dateStart_btn5").addClass('selected');
}
