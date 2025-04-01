/***********************************************************************************************
* Program Name : 작업스케줄처리이력
* Creator      : sukim
* Create Date  : 2022.06.21
* Description  : 작업스케줄처리이력
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.21     sukim            최초생성
************************************************************************************************/
var SYSM410MDataSource, grdSYSM410M;
var rngDay = 90;

$(document).ready(function () {
	
	//SYSM410M_fnInitCalendar();
	
	SYSM410M_fnSetCombo();
	
	SYSM410M_fnSetKendoGrid();
	
	GridResizeTableSYSM410M();
	
	$(window).on({ 
		'resize': function() {
			GridResizeTableSYSM410M();   
		},   
	});
	
	//SYSM410M_fnInitTenent();
	CMMN_SEARCH_TENANT["SYSM410M"].fnInit(null,SYSM410M_fnSearchList,null);

	//태넌트명 검색
	$('#SYSM410M_tenantId').blur(function(event) {
		let check = $('#SYSM410M_tenantId').val().toUpperCase();
		if(check.length >= 3){
			$('#SYSM410M_tenantId').val(check);
			SYSM410M_SearchTenantNm();
		}
		if(check.length == 0){
			$('#SYSM410M_tenantId').val('');
		}		
    });
	
	let oldVal="";
	$("#SYSM410M_tenantId").on("propertychange change keyup paste input", function() {
		let currentVal = $(this).val().toUpperCase();
		if(currentVal.length >=3){
		    if(currentVal == oldVal) {
		        return;
		    }else{
			    oldVal = currentVal;
			    SYSM410M_SearchTenantNm();
		    }			
		} 
	});		
	
	//조회 Button
	$('#SYSM410M_btnSearch').off("click").on("click", function () {
		SYSM410M_fnSearchList();
	});	
	
	//페이지 생성시 자동 조회 되도록 추가
//	SYSM410M_fnSearchList();

	$('#SYSM410M_jobNm, #SYSM410M_jobNo').on('keypress', function(e) {
        if (e.which === 13) { // Enter key pressed
            e.preventDefault(); // Prevent the default form submission
            SYSM410M_fnSearchList();
        }
    });
});

function SYSM410M_fnInitTenent(){
	$('#SYSM410M_tenantId').val(GLOBAL.session.user.tenantId);
	$('#SYSM410M_tenantNm').val(GLOBAL.session.user.fmnm);
}

function SYSM410M_fnSetCombo(){
	let SYSM410P_data = {"codeList": [{"mgntItemCd":"C0224"}]};
	Utils.ajaxCall('/comm/COMM100SEL01', JSON.stringify(SYSM410P_data), function (sys410pResult) {
		let SYSM410P_cmmCodeList = JSON.parse(sys410pResult.codeList);
		Utils.setKendoComboBox(SYSM410P_cmmCodeList, "C0224", "#SYSM410M_jobStCd", "", "전체"); 
	});	
}
function SYSM410M_fnSetKendoGrid(){
	SYSM410MDataSource={
			transport: {
				read : function (SYSM410M_jsonStr) {
					if(Utils.isNull(SYSM410M_jsonStr.data)){
						Utils.ajaxCall('/sysm/SYSM410SEL01', SYSM410M_jsonStr, SYSM410M_resultList, 
							window.kendo.ui.progress($("#grdSYSM410M"), true), window.kendo.ui.progress($("#grdSYSM410M"), false));
					}else{
						window.kendo.ui.progress($("#grdSYSM410M"), false);
					}
				},
			},
			schema : {
				type: "json",
				model: {
		            fields: {
		            	procDt    : { field: "procDt"     ,type: 'string' },
		            	jobNo     : { field: "jobNo"      ,type: 'string' }, 
		            	jobSeq    : { field: "jobSeq"     ,type: 'string' },
		            	jobNm     : { field: "jobNm"      ,type: 'string' },
		            	jobStrDtm : { field: "jobStrDtm"  ,type: 'string' },
		            	jobEndDtm : { field: "jobEndDtm"  ,type: 'string' },
		            	jobStCdNm : { field: "jobStCdNm"  ,type: 'string' },
		            	errCd     : { field: "errCd"      ,type: 'string' },
		            	errMsg    : { field: "errMsg"     ,type: 'string' } 
		            }
				}
			}
		}
		$("#grdSYSM410M").kendoGrid ({
			DataSource : SYSM410MDataSource,
			persistSelection: true,
			sortable: true,
			selectable: true,
			noRecords: { template: '<div class="nodataMsg"><p>'+SYSM410M_langMap.get("grid.nodatafound")+'</p></div>' },
			pageable: {
				  refresh:false,
				  buttonCount:10,
				  pageSize : 100,
				  messages: {
					display: " ",
					empty: SYSM410M_langMap.get("fail.common.select"),
					itemsPerPage: ""
				 }
			},
			  dataBinding: function() {
				record = (this.dataSource.page() -1) * this.dataSource.pageSize();	
			},
			columns: [ 
				{ width: 50,     title: "NO", hiddenExcel:true, template: "#= ++record #"},
				{ width: 80,     field: "procDt",       title: SYSM410M_langMap.get("SYSM410M.procDt"),       	type: "String"},
				{ width: 100,    field: "jobNo",        title: SYSM410M_langMap.get("SYSM410M.jobNo"),       	type: "String"}, 
				{ width: 80,     field: "jobSeq",       title: SYSM410M_langMap.get("SYSM410M.jobSeq"),      	type: "String"}, 	
				{ width: "auto", field: "jobNm",        title: SYSM410M_langMap.get("SYSM410M.jobNm"),         	type: "String",  attributes : { style : "text-align : left;" } },
				{ width: 140,    field: "jobStrDtm",    title: SYSM410M_langMap.get("SYSM410M.jobStartDate"),   type: "String",  template: '#=jobStrDtm == null ? "" : kendo.toString(new Date(jobStrDtm), "yyyy-MM-dd HH:mm:ss")#'},
				{ width: 140,    field: "jobEndDtm",    title: SYSM410M_langMap.get("SYSM410M.jobEndDate"),   	type: "String",  template: '#=jobEndDtm == null ? "" : kendo.toString(new Date(jobEndDtm), "yyyy-MM-dd HH:mm:ss")#'}, 
				{ width: 80,     field: "jobStCdNm",    title: SYSM410M_langMap.get("SYSM410M.jobStatus"),      type: "String",  template: '<span #if(jobStCdNm == "실패") {# class="fontRed" #} #>#: jobStCdNm #</span>',},  
				{ width: 120,    field: "errCd",        title: SYSM410M_langMap.get("SYSM410M.jobErrCd"),       type: "String"}, 
				{ width: "auto", field: "errMsg",       title: SYSM410M_langMap.get("SYSM410M.jobErrText"),     type: "String",  attributes: {"class": "textEllipsis"},},  
			]
	});
	
	grdSYSM410M = $("#grdSYSM410M").data("kendoGrid");	
	
	//   ToolTip
	$("#grdSYSM410M").kendoTooltip({
		filter: ".textEllipsis", 
		position: "bottom", 
		width: 300, 
		content: function(e){  
			let content = e.target.html();
			return content;
		}, 
	});
}

//작업 스케쥴 처리이력 목록 조회
function SYSM410M_fnSearchList(){
	let SYSM410M_tenantId = $('#SYSM410M_tenantId').val();
	if(SYSM410M_tenantId == ''){
		Utils.alert(SYSM410M_langMap.get("fail.common.tenant"));
		return;
	}
	let SYSM410M_regex = /[^0-9]/g;	
	let SYSM410M_jobStrDt = $('#SYSM410M_jobStrDt').val().replace(SYSM410M_regex, "");;
	let SYSM410M_jobEndDt = $('#SYSM410M_jobEndDt').val().replace(SYSM410M_regex, "");;
	let jobStCd           = $('#SYSM410M_jobNo').val();
	let SYSM410M_param = {
			"tenantId" : SYSM410M_tenantId, //GLOBAL.session.user.tenantId	
			"jobStrDt" : SYSM410M_jobStrDt,
			"jobEndDt" : SYSM410M_jobEndDt,
			"jobStCd"  : $('#SYSM410M_jobStCd').val(),
//			"jobStCd"  : $('input[name=SYSM410M_jobStCd]').data("kendoComboBox").value(),	//kw---20230504 : 초기 검색시 오류가 생겨 ID로 값을 가져오도록  변경
			"jobNo"    : $('#SYSM410M_jobNo').val(),
			"jobNm"    : $('#SYSM410M_jobNm').val()
	};
	console.log("SYSM410M_param : " + JSON.stringify(SYSM410M_param));
	SYSM410MDataSource.transport.read(JSON.stringify(SYSM410M_param));		
}

//조회 결과 set
function SYSM410M_resultList(SYSM410M_result){
	let SYSM410M_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(SYSM410M_result.SYSM410SEL01List)));
	let SYSM410M_searchCount = JSON.parse(JSON.parse(JSON.stringify(SYSM410M_result.SYSM410SEL01ListCount)));
	if(SYSM410M_searchCount == 0){
//		Utils.alert(SYSM410M_langMap.get("info.nodata.msg"));
		grdSYSM410M.dataSource.data([]);
	}else{
		grdSYSM410M.setDataSource(SYSM410M_jsonDecode);
		grdSYSM410M.dataSource.options.schema.data = SYSM410M_jsonDecode;			
	}
}

//Grid Height  체크
function GridResizeTableSYSM410M() {   
	var screenHeight = $(window).height()-210;     //(헤더+ 푸터) 영역 높이 제외
	grdSYSM410M.element.find('.k-grid-content').css('height', screenHeight-200);  
};  

function SYSM410M_fnInitCalendar(){
	
	const cultureSet = {
        ko : "ko-KR",
        en : "en-US",
    }
    const getCulture = cultureSet[GLOBAL.session.user.mlingCd];
	
	$("#SYSM410M input[name=SYSM410M_jobStrDt]").kendoDatePicker({
		value : new Date(),
		culture : getCulture,
		format : "yyyy-MM-dd"
	});
	$("#SYSM410M input[name=SYSM410M_jobEndDt]").kendoDatePicker({
		value : new Date(),
		culture : getCulture,
		format : "yyyy-MM-dd"
	});
}

//태넌트 찾기 팝업
function SYSM410M_fnTenantsPopup(){
	Utils.setCallbackFunction("SYSM410M_fnTenantCallBack", SYSM410M_fnTenantCallBack);
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM101P", "SYSM101P", 1200, 595, {callbackKey:"SYSM410M_fnTenantCallBack"});	
}

function SYSM410M_fnTenantCallBack(item){
	let check = item.toUpperCase();
	if(check.length >= 3){
		$('#SYSM410M_tenantId').val(check);
		SYSM410M_SearchTenantNm();
	}	
}

//태넌트명 조회
function SYSM410M_SearchTenantNm() {
	let SYSM410M_tenantId =  $('#SYSM410M_tenantId').val();
	if(SYSM410M_tenantId == ''){
		Utils.alert(SYSM410M_langMap.get("SYSM410M.unregisteredCustomer"));
		return;
	}	
	GetTenantNm(SYSM410M_tenantId,'SYSM410M_tenantNm');
}

