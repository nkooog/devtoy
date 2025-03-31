/***********************************************************************************************
 * Program Name : 상담그룹코드 관리 (SYSM437M.js)
 * Creator      : wkim
 * Create Date  : 2023.02.13
 * Description  : 상담그룹코드 관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.02.13     wkim             최초작성
 ************************************************************************************************/
var SYSM437M_comCdList = new Array();
var SYSM437M_grid = new Array(1);
var SYSM437DataSource;
var SYSM437M_grdSYSM437M;
var SYSM437M_Combo = new Array(1);

$(document).ready(function () {

	//1. input 박스에서 키보드 엔터 키를 눌렀을 경우 검색
	$("#SYSM437M_inputSearchType , #SYSM437M_sndgCtt").on("keyup", function (e) {
        if (e.keyCode == 13) {
        	SYSM437M_fnSearch();
        }
    });
	
	//2. 검색구분이 전체 일 경우 input 박스 막기
	SYSM437M_changeSerchType();
	
    SYSM437DataSource = {
		transport: {
			read: function (SYSM437M_param) {
                if (Utils.isNull(SYSM437M_param.data)) {
                	
                	console.log("SYSM437M_param : o%" , SYSM437M_param);
                	
                    Utils.ajaxCall(
                        "/sysm/SYSM437SEL02",
                        JSON.stringify(SYSM437M_param),
                        SYSM437M_fnResultMyCounseling,
                        window.kendo.ui.progress($("#SYSM437M_grid0"), true),
                        window.kendo.ui.progress($("#SYSM437M_grid0"), false))
                } else {
                    window.kendo.ui.progress($("#SYSM437M_grid0"), false)
                }
            },
        },
        // pageSize: 25,
        batch: true,
        schema: {
            type: "json",
            model: {
                fields: {
                	No					: {field: "No", 				type: "string"},
                	sndgCtt				: {field: "sndgCtt", 			type: "string", minwidth:"600px"},
                	custId				: {field: "custId", 			type: "string"},
                	custNm				: {field: "custNm", 			type: "string"},
                	gndrCd				: {field: "gndrCd", 			type: "string"},
                	recvrTelNo			: {field: "recvrTelNo", 		type: "string"},
                	smsSndgRsltMsg		: {field: "smsSndgRsltMsg", 	type: "string", editable: false},
                	regDtm				: {field: "regDtm", 			type: "string", editable: false},
                	regUsrNm			: {field: "regUsrNm", 			type: "string", editable: false},
                }
            }
        }
    };
    
    SYSM437M_grdSYSM437M = $("#SYSM437M_grid0").kendoGrid({
    	dataSource: SYSM437DataSource,
    	autoBind: false,
        resizable: true,
        refresh: true,
        sortable: false,
        //editable: true,
		//edit: function(e){
		//	//그리드 내용 자동 선택
	    //	$(e.container).find("input[type=text]").select();
		//},
        sort: function (e) {
            if (SYSM437M_grdSYSM437M.dataSource.total() === 0) {
                e.preventDefault();
            } 
        },
        pageable: {
            refresh: false
            , pageSizes: [25, 50, 100, 100, 500]
            , buttonCount: 10
            , pageSize: 25
        },
        dataBinding: function () {
            record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        columns: [
        	{ 
            	title: "No", 
            	width: 60, 
            	attributes : { style : "text-align : right; " }, 
            	field:"cnslNo", title: "No", width: 40, template: "#= ++record #"
            },
            { 
            	title: SYSM437M_langMap.get("SYSM437M.sndgCpltTm"),			//발송일시
            	field: "sndgCpltTm",
            	type: "string", 
            	width: 140, 	
            },
            { 
            	title: SYSM437M_langMap.get("SYSM437M.sndgCtt"),				//메시지 내용
            	field: "sndgCtt", 		
            	type: "string", 
            	//width: "auto",
            	width: 1050,												//엑셀 다운로드 시 고정 필요
            	attributes: {"class": "k-text-left"},
            },
            { 
            	title: SYSM437M_langMap.get("SYSM437M.custId"),				//고객ID
            	field: "custId",
            	type: "string", 
            	width: 100,
            	attributes: {"class": "k-text-left"},
            },
            { 
            	title: SYSM437M_langMap.get("SYSM437M.custNm"),				//고객명
            	field: "custNm", 		
            	type: "string", 
            	width: 100, 	
            	attributes: {"class": "k-text-left"},
            },
            { 
            	title: SYSM437M_langMap.get("SYSM437M.gndrCd"),				//성별
            	field: "gndrCd", 		
            	type: "string", 
            	width: 50, 	
            },
            { 
            	title: SYSM437M_langMap.get("SYSM437M.recvrTelNo"),			//수신번호
            	field: "recvrTelNo", 		
            	type: "string", 
            	width: 130, 	
            	attributes: {"class": "k-text-left"},
            },
            { 
            	title: SYSM437M_langMap.get("SYSM437M.smsSndgRsltMsg"),		//발송결과
            	field: "smsSndgRsltMsg", 		
            	type: "string", 
            	width: 60, 	
            	attributes: {"class": "k-text-left"},
            },
            { 
            	title: SYSM437M_langMap.get("SYSM437M.regUsrNm"),			//등록자
            	field: "regUsrNm", 		
            	type: "string", 
            	width: 100, 	
            	attributes: {"class": "k-text-left"},
            },
        ],
        dataBound: function(e) {
            // iterate the data items and apply row styles where necessary
        	var rows = this.items();
            $(rows).each(function () {
                var index = $(this).index() + 1;
                var rowLabel = $(this).find(".row-number");
                $(rowLabel).html(index);
            });
        },
        noRecords: { template: '<div class="nodataMsg"><p>'+SYSM437M_langMap.get("grid.nodatafound")+'</p></div>' },
    }).data("kendoGrid");

    SYSM437M_fnGridResize();
    $(window).on("resize", function () { SYSM437M_fnGridResize();});

    SYSM437M_fnInit();
});

//페이지 초기화
function SYSM437M_fnInit() {
    let param = {
        "codeList": [
        	{"mgntItemCd": "S0009"}, // SMS단건발송검색 조회조건
            {"mgntItemCd": "C0004"}, // 사용여부
            {"mgntItemCd": "C0110"}, // SMS결과 코드
            
        ]
    };
    
    let parm = {
    		tenantId	: $("#SYSM437M_tenantId").val(),
    }
// 템플릿 임시 주석
//	Utils.ajaxSyncCall('/sysm/SYSM437SEL01', JSON.stringify(parm), function(data){
//		SYSM437M_Combo[0] = Utils.setKendoComboBoxCustom(data.list, "#SYSM437M_comboTmplNm", "tmplNm", "tmplMgntNo","",true);
//	},false,false,false);

    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        SYSM437M_comCdList = JSON.parse(result.codeList);
        
        Utils.setKendoComboBox(SYSM437M_comCdList, "S0009", "#SYSM437M_comboSearchType", "", "전체");
        $("#SYSM437M_comboSearchType").data("kendoComboBox").select(0);
        
        Utils.setKendoComboBox(SYSM437M_comCdList, "C0110", "#SYSM437M_smsRsltCd", "", "전체");
        $("#SYSM437M_smsRsltCd").data("kendoComboBox").select(0);
    });
    
    //CMMN_SEARCH_TENANT["SYSM437M"].fnInit(null, SYSM437M_changeTmplNm);
    //SYSM437M_fnSearch();
    
    CMMN_SEARCH_TENANT["SYSM437M"].fnInit(null,SYSM437M_fnSearch);
}

/*템플릿명 콤보박스 변경 설정*/
function SYSM437M_changeTmplNm(){
	
	let parm = {
    		tenantId	: $("#SYSM437M_tenantId").val(),
    }

	Utils.ajaxCall('/sysm/SYSM437SEL01', JSON.stringify(parm), function (data) {
		Utils.changeKendoComboBoxDataSourceCustom(data.list, SYSM437M_Combo[0], "tmplNm", "tmplMgntNo","",true);
	},false,false,false);
}

//그리드 조회시 파라미터 생성
function SYSM437M_getParamValue() {	
	
	var startDate 	= $("#SYSM437M_dateStart").val().replaceAll("-","");
	var endDate 	= $("#SYSM437M_dateEnd").val().replaceAll("-","");
	var tmplNm 		= $("#SYSM437M_comboTmplNm").val();
	var searchType 	= $("#SYSM437M_comboSearchType").val();
	var searchType2 = $("#SYSM437M_inputSearchType").val();
	var sndgCtt 	= $("#SYSM437M_sndgCtt").val();
	var smsRsltCd 	= $("#SYSM437M_smsRsltCd").val();
	
	if(Utils.isNull(searchType)){
		searchType = "0";
	}
	
	return {
		tenantId		: $("#SYSM437M_tenantId").val(), 
		startDate 		: startDate,
		endDate			: endDate,
//		tmplNm			: tmplNm,
		smsRsltCd		: smsRsltCd,
		sndgCtt			: sndgCtt,
		searchType		: searchType,
		searchType2		: searchType2,
	}
}

function SYSM437M_fnResultMyCounseling(data){
    let cnslList = JSON.parse(data.list);
    const listLength = cnslList.length
    if (listLength === 0) {
        Utils.alert(SYSM437M_langMap.get("fail.common.select"),
            ()=> {return SYSM437M_grdSYSM437M.dataSource.data([]);});
        return;
    }
    for (const cnsl of cnslList) {
        cnsl.cntcCnntDtm =
            Utils.isNotNull(cnsl.cntcCnntDtm)
            ? cnsl.cntcCnntDtm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6')
            : "-";
        // cnsl.decUsrNm = ''.concat(
        //     cnsl.decUsrNm, "(", cnsl.cnslrId, ")");
    }
    console.log(cnslList);
    SYSM437M_grdSYSM437M.dataSource.data(cnslList);
    SYSM437M_grdSYSM437M.dataSource.options.schema.data = cnslList;
}

//그리드 조회
function SYSM437M_fnSearch() {
	
	SYSM437M_grdSYSM437M.dataSource.data([]);

    let valid = true;

    Utils.markingRequiredField();
    if (Utils.isNull($('#SYSM437M_tenantId').val())) {
        Utils.alert(SYSM437M_langMap.get("aicrm.message.tenantInfo"),
            () => {
                return $('#SYSM437M_tenantId').focus();
            });
        valid = false;
    }

    if(valid) {
        const paramValue = SYSM437M_getParamValue();
        SYSM437DataSource.transport.read(paramValue);
    }
}

function SYSM437M_fnGridResize() {
	let screenHeight = $(window).height()-200;
	SYSM437M_grdSYSM437M.element.find('.k-grid-content').css('height', screenHeight-225);       
}

//엑셀 다운로드
function SYSM437M_excelExport(gridIndex) {
	var today = new Date();

	var year = today.getFullYear();
	var month = ('0' + (today.getMonth() + 1)).slice(-2);
	var day = ('0' + today.getDate()).slice(-2);

	var dateString = year + month  + day;
	
	SYSM437_excelExport(SYSM437M_grdSYSM437M, dateString + "_" + SYSM437M_langMap.get("SYSM437M.title"));
}

function SYSM437_excelExport(targetGrid, fileName) {
	const pageSize = targetGrid._data.length;
    if (pageSize === 0) {
        Utils.alert(SYSM437M_langMap.get("SYSM437M.alert.noData"));
        return;
    }
    
    const dataSourceTotal = targetGrid.dataSource.total();
    targetGrid.dataSource.pageSize(dataSourceTotal);
    targetGrid.bind("excelExport", function (e) {
        e.workbook.fileName = fileName;
        let sheet = e.workbook.sheets[0];

        let setDataItem = {};
        let selectableNum = 0;
        if (this.columns[0].selectable) {
            selectableNum = 1
        }
        if (this.columns[0].template === '#= ++record #') {
            record = 0;
        }
        this.columns.forEach(function (item, index) {
            if (Utils.isNotNull(item.template)) {
                let targetTemplate = kendo.template(item.template);
                let fieldName = item.field;
                
                for (let i = 1; i < sheet.rows.length; i++) {
                    let row = sheet.rows[i];
                    setDataItem = {
                        [fieldName]: row.cells[(index - selectableNum)].value
                    }
                    row.cells[(index - selectableNum)].value = targetTemplate(setDataItem);
                }
            }
        })
    });
    
    targetGrid.saveAsExcel();
    targetGrid.dataSource.pageSize(pageSize);
    
    
}

//검색구분이 전체 일 경우 input 박스 막기
function SYSM437M_changeSerchType(){
	
	var tmp = $("#SYSM437M_comboSearchType").val();
	
	if(Utils.isNull(tmp) || tmp == "0"){
		$('#SYSM437M_inputSearchType').attr("disabled", true);
		$("#SYSM437M_inputSearchType").val("");
	}
	else{
		$('#SYSM437M_inputSearchType').attr("disabled", false);
	}
}