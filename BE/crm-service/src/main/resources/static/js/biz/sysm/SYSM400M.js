/***********************************************************************************************
 * Program Name : 작업스케줄관리
 * Creator      : sukim
 * Create Date  : 2022.06.21
 * Description  : 작업스케줄관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.06.21     sukim            최초생성
 ************************************************************************************************/
var SYSM400MDataSource, grdSYSM400M;
var tanentLength = 3;
var isNew = false;
var Mode = 'New';

$(document).ready(function () {
	SYSM400M_fnSetCombo();
	SYSM400M_fnSetKendoGrid();
	GridResizeTableSYSM400M();
	$(window).on({
		'resize': function() {
			GridResizeTableSYSM400M();
		},
	});

	SYSM400M_fnInitForm('init');

	CMMN_SEARCH_TENANT["SYSM400M"].fnInit(null,SYSM400M_fnSearchList,null);

	SYSM400M_fnSetTenantIdSub();

	$('#SYSM400M_btnSearch').off("click").on("click", function () {
		SYSM400M_fnSearchList('Search');
	});

	$('#SYSM400M_btnNew').off("click").on("click", function () {
		SYSM400M_fnInitForm('new');
		$('#SYSM400M input[name=SYSM400M_itenantId]').focus();
	});

	$('#SYSM400M_btnSave').off("click").on("click", function () {
		SYSM400M_fnSave();
	});

	$('#SYSM400M_btnDel').off("click").on("click", function () {
		SYSM400M_fnDelete();
	});

	$('#SYSM400M_btnDis').off("click").on("click", function () {
		SYSM400M_fnDisposal();
	});
});

function SYSM400M_fnSetCombo(){
	var SYSM400P_data = {
		"codeList": [
			{"mgntItemCd":"C0003"},
			{"mgntItemCd":"C0222"},
			{"mgntItemCd":"C0223"},
			{"mgntItemCd":"C0232"},
			{"mgntItemCd":"C0226"},
		]};
	Utils.ajaxCall('/comm/COMM100SEL01', JSON.stringify(SYSM400P_data), function (sys400pResult) {
		var SYSM400P_cmmCodeList = JSON.parse(sys400pResult.codeList);
		Utils.setKendoComboBox(SYSM400P_cmmCodeList, "C0223", "#SYSM400M_jobClasCd", "", SYSM400M_langMap.get("title.all"));
		Utils.setKendoComboBox(SYSM400P_cmmCodeList, "C0222", "#SYSM400M_jobCycCd",  "", SYSM400M_langMap.get("title.all"));
		Utils.setKendoComboBox(SYSM400P_cmmCodeList, "C0003", "#SYSM400M_useYn",     "", SYSM400M_langMap.get("title.all"));
		Utils.setKendoComboBox(SYSM400P_cmmCodeList, "C0223", "#SYSM400M_ijobClasCd", "", SYSM400M_langMap.get("input.cSelect"));
		Utils.setKendoComboBox(SYSM400P_cmmCodeList, "C0222", "#SYSM400M_ijobCycCd", "", SYSM400M_langMap.get("input.cSelect"));
		Utils.setKendoComboBox(SYSM400P_cmmCodeList, "C0232", "#SYSM400M_iprocPgmKindCd", "", SYSM400M_langMap.get("input.cSelect"));
		Utils.setKendoComboBox(SYSM400P_cmmCodeList, "C0226", "#SYSM400M_execScheDt", "", SYSM400M_langMap.get("input.cSelect"));
	});
}

function SYSM400M_fnSetKendoGrid(){
	SYSM400MDataSource={
		transport: {
			read : function (SYSM400M_jsonStr) {
				if(Utils.isNull(SYSM400M_jsonStr.data)){
					Utils.ajaxCall('/sysm/SYSM400SEL01', SYSM400M_jsonStr, SYSM400M_resultList,
						window.kendo.ui.progress($("#grdSYSM400M"), true), window.kendo.ui.progress($("#grdSYSM400M"), false));
				}else{
					window.kendo.ui.progress($("#grdSYSM400M"), false);
				}
			},
		},
		schema : {
			type: "json",
			model: {
				fields: {
					tenantId          : { field: "tenantId"         ,type: 'string' },
					jobNo             : { field: "jobNo"            ,type: 'string' },
					jobNm             : { field: "jobNm"            ,type: 'string' },
					jobCycCd          : { field: "jobCycCd"         ,type: 'string' },
					jobCycCdNm        : { field: "jobCycCdNm"       ,type: 'string' },
					jobClasCd         : { field: "jobClasCd"        ,type: 'string' },
					jobClasCdNm       : { field: "jobClasCdNm"      ,type: 'string' },
					jobExecTm         : { field: "jobExecTm"        ,type: 'string' },
					fileNm            : { field: "fileNm"           ,type: 'string' },
					filePath          : { field: "filePath"         ,type: 'string' },
					procPgmKindCd     : { field: "procPgmKindCd"    ,type: 'string' },
					procPgmKindCdNm   : { field: "procPgmKindCdNm"  ,type: 'string' },
					procPgmNm         : { field: "procPgmNm"        ,type: 'string' },
					prcedJobNo        : { field: "prcedJobNo"       ,type: 'string' },
					execScheDt        : { field: "execScheDt"       ,type: 'string' },
					useYn             : { field: "useYn"            ,type: 'string' },
					useYnCdNm         : { field: "useYnCdNm"        ,type: 'string' },
					reptYn            : { field: "reptYn"           ,type: 'string' },
					regDtm            : { field: "regDtm"           ,type: 'string' },
					regrId            : { field: "regrId"           ,type: 'string' },
					regrUsrNm         : { field: "regrUsrNm"        ,type: 'string' },
					lstCorcDtm        : { field: "lstCorcDtm"       ,type: 'string' },
					lstCorprId        : { field: "lstCorprId"       ,type: 'string' },
					lstCorprUsrNm     : { field: "lstCorprUsrNm"    ,type: 'string' },
					abolDtm        		: { field: "abolDtm"       	,type: 'string' },
					abolmnId        	: { field: "abolmnId"       ,type: 'string' },
					abolmnOrgCd        	: { field: "abolmnOrgCd"    ,type: 'string' }
				}
			}
		}
	}
	$("#grdSYSM400M").kendoGrid ({
		DataSource : SYSM400MDataSource,
		persistSelection: true,
		sortable: true,
		selectable: true,
		noRecords: { template: '<div class="nodataMsg"><p>'+SYSM400M_langMap.get("grid.nodatafound")+'</p></div>' },
		pageable: {
			refresh:false,
			buttonCount:10,
			pageSize : 100,
			messages: {
				display: " ",
				empty: SYSM400M_langMap.get("fail.common.select"),
				itemsPerPage: ""
			}
		},
		dataBinding: function() {
			record = (this.dataSource.page() -1) * this.dataSource.pageSize();
		},
		dataBound: SYSM400M_onDataBound,
		columns: [
			{ width: 40,     field: "선택",              title: SYSM400M_langMap.get("input.cSelect"),      template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>'},
			{ width: 50,     title: "NO",                template: "#= ++record #"},
			{ width: 80,     field: "tenantId",          title: SYSM400M_langMap.get("SYSM400M.tenant"),    		type: "String",    attributes: {"class": "textLeft"}},
			{ width: 100,    field: "jobNo",             title: SYSM400M_langMap.get("SYSM400M.jobNo"),     		type: "String"},
			{ width: "auto", field: "jobNm",             title: SYSM400M_langMap.get("SYSM400M.jobNm"),     		type: "String",    attributes: {"class": "textEllipsis"}},
			{ hidden: true,  field: "jobCycCd",          title: "작업주기코드",                             			type: "String"},
			{ width: 100,    field: "jobCycCdNm",        title: SYSM400M_langMap.get("SYSM400M.jobCycCd"),  		type: "String"},
			{ hidden: true,  field: "jobClasCd",         title: "작업분류코드",                            			 	type: "String"},
			{ width: 120,    field: "jobClasCdNm",       title: SYSM400M_langMap.get("SYSM400M.jobClasCd"), 		type: "String"},
			{ width: 110,    field: "jobExecTm",         title: SYSM400M_langMap.get("SYSM400M.jobExecTm"), attributes: {"class": "textCenter"},  format: "{0: HH:mm}"},
			{ hidden: true,  field: "fileNm",            title: "파일경로",                                		 	type: "String"},
			{ hidden: true,  field: "filePath",          title: "처리파일",                                 			type: "String"},
			{ hidden: true,  field: "procPgmKindCd",     title: "프로그램구분코드",                         				type: "String"},
			{ width: 120,    field: "procPgmKindCdNm",   title: SYSM400M_langMap.get("SYSM400M.PgmKindCd"), 		type: "String"},
			{ width: 160,    field: "procPgmNm",         title: SYSM400M_langMap.get("SYSM400M.procPgmNm"), 		type: "String"},
			{ hidden: true,  field: "prcedJobNo",        title: "선행작업번호", type: "String"},
			{ hidden: true,  field: "execScheDt",        title: "실행예정일자", type: "String"},
			{ hidden: true,  field: "useYn",             title: "사용여부코드", type: "String"},
			{
				width : 80,
				field : "useYnCdNm",
				title : SYSM400M_langMap.get("SYSM400M.useYn"),
				type : "String",
				template : function(dataItem){
					let abolDtm = dataItem.abolDtm;
					if(Utils.isNull(abolDtm) == true){
						return dataItem.useYnCdNm;
					} else {
						return SYSM400M_langMap.get("title.disposal");
					}
				},
			},
			{ hidden: true,  field: "reptYn",            title: "반복여부코드", type: "String"},
			{ hidden: true,  field: "regDtm",            title: "등록일시",     type: "String"},
			{ hidden: true,  field: "regrId",            title: "등록자ID",     type: "String"},
			{ hidden: true,  field: "regrUsrNm",         title: "등록자명",     type: "String"},
			{ hidden: true,  field: "lstCorcDtm",        title: "최종수정일시", type: "String"},
			{ hidden: true,  field: "lstCorprId",        title: "최종수정자ID", type: "String"},
			{ hidden: true,  field: "lstCorprUsrNm",     title: "최종수정자명", type: "String"},
			{ hidden: true,  field: "abolDtm", 			 title: "폐기일시", type: "String"},
			{ hidden: true,  field: "abolmnId", 		 title: "폐기자ID", type: "String"},
			{ hidden: true,  field: "abolmnOrgCd",		 title: "폐기자조직", type: "String"}
		]
	});

	grdSYSM400M = $("#grdSYSM400M").data("kendoGrid");
}

function SYSM400M_fnSearchList(strParam){
	var SYSM400M_tenantId = $('#SYSM400M_tenantId').val();
	if(strParam == 'Search'){
		if(SYSM400M_tenantId.length < tanentLength){
			Utils.alert(SYSM400M_langMap.get("SYSM400M.alert.tenant"));
			return;
		}
	}else{
		if(SYSM400M_tenantId.length < tanentLength){
			return;
		}
	}
	var SYSM400M_param = {
		"tenantId"  : SYSM400M_tenantId,
		"jobCycCd"  : $('#SYSM400M input[name=SYSM400M_jobCycCd]').val(),
		"jobClasCd" : $('#SYSM400M input[name=SYSM400M_jobClasCd]').val(),
		"useYn"     : $('#SYSM400M input[name=SYSM400M_useYn]').val(),
		"jobNo"     : $('#SYSM400M_jobNo').val(),
		"jobNm"     : $('#SYSM400M_jobNm').val(),
		"mlingCd"   : GLOBAL.session.user.mlingCd
	};
	//console.log("SYSM400M_param : " + JSON.stringify(SYSM400M_param));
	SYSM400MDataSource.transport.read(JSON.stringify(SYSM400M_param));

	//알림 메시지 리셋
	SYSM400M_fnResetValidMsg();
}

function SYSM400M_resultList(SYSM400M_resultData){
	var SYSM400M_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(SYSM400M_resultData.SYSM400SEL01List)));
	var SYSM400M_searchCount = JSON.parse(JSON.parse(JSON.stringify(SYSM400M_resultData.SYSM400SEL01ListCount)));

	if(SYSM400M_searchCount == 0){
		grdSYSM400M.dataSource.data([]);
//		Utils.alert(SYSM400M_langMap.get("SYSM400M.alert.noData"));
		SYSM400M_fnInitForm('search');
	}else{
		grdSYSM400M.setDataSource(SYSM400M_jsonDecode);
		grdSYSM400M.dataSource.options.schema.data = SYSM400M_jsonDecode;

		if(Mode == 'New'){
			grdSYSM400M.select('tr:eq(0)');
			var selected = [];
			grdSYSM400M.select().each(function(){
				selected.push(grdSYSM400M.dataItem(this));
			});
			for(var i = 0; i<selected.length; i++){
				$('#SYSM400M input[name=SYSM400M_itenantId]').val(selected[i].tenantId);
				$('#SYSM400M input[name=SYSM400M_itenantNm]').val(selected[i].fmnm);
				$('#SYSM400M input[name=SYSM400M_ijobNo]').val(selected[i].jobNo);
				$('#SYSM400M input[name=SYSM400M_ijobNm]').val(selected[i].jobNm);
				$('#SYSM400M input[name=SYSM400M_ijobCycCd]').data("kendoComboBox").value(selected[i].jobCycCd);
				$('#SYSM400M input[name=SYSM400M_ijobClasCd]').data("kendoComboBox").value(selected[i].jobClasCd);
				$('#SYSM400M input[name=SYSM400M_iprocPgmKindCd]').data("kendoComboBox").value(selected[i].procPgmKindCd);
				$('#SYSM400M input[name=SYSM400M_iprocPgmNm]').val(selected[i].procPgmNm);
				$('#SYSM400M input[name=SYSM400M_ifileNm]').val(selected[i].fileNm);
				$('#SYSM400M input[name=SYSM400M_ifilePath]').val(selected[i].filePath);
				$('#SYSM400M input[name=SYSM400M_ijobExecTm]').val(selected[i].jobExecTm);
				$('#SYSM400M input[name=SYSM400M_reptYn]').prop('checked', selected[i].reptYn == "Y" ? true:false);
				$('#SYSM400M input[name=SYSM400M_iuseYn]').prop('checked', selected[i].useYn == "Y" ? true:false);
				$('#SYSM400M input[name=SYSM400M_execScheDt]').data("kendoComboBox").value(selected[i].execScheDt);
				$('#SYSM400M input[name=SYSM400M_prcedJobNo]').val(selected[i].prcedJobNo);
				$('#SYSM400M input[name=SYSM400M_iregrId]').val(selected[i].regrId );
				$('#SYSM400M input[name=SYSM400M_iregrNm]').val(selected[i].regrUsrNm );
				$('#SYSM400M input[name=SYSM400M_iregDtm]').val(selected[i].regDtm);
				$('#SYSM400M input[name=SYSM400M_ilstCorprId]').val(selected[i].lstCorprId);
				$('#SYSM400M input[name=SYSM400M_ilstCorprNm]').val(selected[i].lstCorprUsrNm);
				$('#SYSM400M input[name=SYSM400M_ilstCorcDtm]').val(selected[i].lstCorcDtm);
				$('#SYSM400M input[name=SYSM400M_abolDtm]').val(selected[i].abolDtm);
				$('#SYSM400M input[name=SYSM400M_iregrId]').prop('disabled', true);
				$('#SYSM400M input[name=SYSM400M_iregrNm]').prop('disabled', true);
				$('#SYSM400M input[name=SYSM400M_iregDtm]').prop('disabled', true);
				$('#SYSM400M input[name=SYSM400M_ilstCorprId]').prop('disabled', true);
				$('#SYSM400M input[name=SYSM400M_ilstCorprNm]').prop('disabled', true);
				$('#SYSM400M input[name=SYSM400M_ilstCorcDtm]').prop('disabled', true);
			}
			Mode == 'old';
			SYSM400M_fnInitForm('list');
		}

	}
}

function SYSM400M_onDataBound(e) {
	$("#grdSYSM400M").on('click','tbody tr[data-uid]',function (e) {
		var SYSM400M_cell = $(e.currentTarget);
		var	SYSM400M_item = grdSYSM400M.dataItem(SYSM400M_cell.closest("tr"));

		$('#SYSM400M input[name=SYSM400M_itenantId]').val(SYSM400M_item.tenantId);
		$('#SYSM400M input[name=SYSM400M_itenantNm]').val(SYSM400M_item.fmnm);
		$('#SYSM400M input[name=SYSM400M_ijobNo]').val(SYSM400M_item.jobNo);
		$('#SYSM400M input[name=SYSM400M_ijobNm]').val(SYSM400M_item.jobNm);
		$('#SYSM400M input[name=SYSM400M_ijobCycCd]').data("kendoComboBox").value(SYSM400M_item.jobCycCd);
		$('#SYSM400M input[name=SYSM400M_ijobClasCd]').data("kendoComboBox").value(SYSM400M_item.jobClasCd);
		$('#SYSM400M input[name=SYSM400M_iprocPgmKindCd]').data("kendoComboBox").value(SYSM400M_item.procPgmKindCd);
		$('#SYSM400M input[name=SYSM400M_iprocPgmNm]').val(SYSM400M_item.procPgmNm);
		$('#SYSM400M input[name=SYSM400M_ifileNm]').val(SYSM400M_item.fileNm);
		$('#SYSM400M input[name=SYSM400M_ifilePath]').val(SYSM400M_item.filePath);
		$('#SYSM400M input[name=SYSM400M_ijobExecTm]').val(SYSM400M_item.jobExecTm);
		$('#SYSM400M input[name=SYSM400M_reptYn]').prop('checked', SYSM400M_item.reptYn == "Y" ? true:false);
		$('#SYSM400M input[name=SYSM400M_iuseYn]').prop('checked', SYSM400M_item.useYn == "Y" ? true:false);
		$('#SYSM400M input[name=SYSM400M_execScheDt]').data("kendoComboBox").value(SYSM400M_item.execScheDt);
		$('#SYSM400M input[name=SYSM400M_prcedJobNo]').val(SYSM400M_item.prcedJobNo);
		$('#SYSM400M input[name=SYSM400M_iregrId]').val(SYSM400M_item.regrId );
		$('#SYSM400M input[name=SYSM400M_iregrNm]').val(SYSM400M_item.regrUsrNm );
		$('#SYSM400M input[name=SYSM400M_iregDtm]').val(SYSM400M_item.regDtm);
		$('#SYSM400M input[name=SYSM400M_ilstCorprId]').val(SYSM400M_item.lstCorprId);
		$('#SYSM400M input[name=SYSM400M_ilstCorprNm]').val(SYSM400M_item.lstCorprUsrNm);
		$('#SYSM400M input[name=SYSM400M_ilstCorcDtm]').val(SYSM400M_item.lstCorcDtm);
		$('#SYSM400M input[name=SYSM400M_iregrId]').prop('disabled', true);
		$('#SYSM400M input[name=SYSM400M_iregrNm]').prop('disabled', true);
		$('#SYSM400M input[name=SYSM400M_iregDtm]').prop('disabled', true);
		$('#SYSM400M input[name=SYSM400M_ilstCorprId]').prop('disabled', true);
		$('#SYSM400M input[name=SYSM400M_ilstCorprNm]').prop('disabled', true);
		$('#SYSM400M input[name=SYSM400M_ilstCorcDtm]').prop('disabled', true);
		$('#SYSM400M input[name=SYSM400M_abolDtm]').val(SYSM400M_item.abolDtm);
		SYSM400M_fnInitForm('list');
	});
}

function SYSM400M_fnInitForm(callPos){
	if(callPos == 'init'){
		$("#SYSM400M_ijobExecTm").kendoTimePicker({format:"HH : mm", interval:"10", min: "00:00", max:"23:59", culture:"ko-KR", dateInput:true, componentType:"classic"});
		$('#SYSM400M button[name="SYSM400M_btnSave"]').prop('disabled', true);
		$('#SYSM400M button[name="SYSM400M_btnDel"]').prop('disabled', true);
		$('#SYSM400M button[name="SYSM400M_btnDis"]').prop('disabled', true);
	}else if(callPos == 'list'){
		$('#SYSM400M button[name="SYSM400M_btnSave"]').prop('disabled', false);
		$('#SYSM400M button[name="SYSM400M_btnDel"]').prop('disabled', false);
		$('#SYSM400M button[name="SYSM400M_btnDis"]').prop('disabled', false);
	}else{
		$('#SYSM400M input[name=SYSM400M_itenantId]').val('');
		$('#SYSM400M input[name=SYSM400M_itenantNm]').val('');
		$('#SYSM400M input[name=SYSM400M_ijobNo]').val('');
		$('#SYSM400M input[name=SYSM400M_ijobNm]').val('');
		$('#SYSM400M input[name=SYSM400M_ijobCycCd]').data("kendoComboBox").value('');
		$('#SYSM400M input[name=SYSM400M_ijobClasCd]').data("kendoComboBox").value('');
		$('#SYSM400M input[name=SYSM400M_iprocPgmKindCd]').data("kendoComboBox").value('');
		$('#SYSM400M input[name=SYSM400M_iprocPgmNm]').val('');
		$('#SYSM400M input[name=SYSM400M_ifileNm]').val('');
		$('#SYSM400M input[name=SYSM400M_ifilePath]').val('');
		$('#SYSM400M input[name=SYSM400M_ijobExecTm]').val('00:00');
		$('#SYSM400M input[name=SYSM400M_reptYn]').prop('checked', false);
		$('#SYSM400M input[name=SYSM400M_iuseYn]').prop('checked', false);
		$('#SYSM400M input[name=SYSM400M_execScheDt]').data("kendoComboBox").value('');
		$('#SYSM400M input[name=SYSM400M_prcedJobNo]').val('');
		$('#SYSM400M input[name=SYSM400M_iregrId]').val('');
		$('#SYSM400M input[name=SYSM400M_iregrNm]').val('');
		$('#SYSM400M input[name=SYSM400M_iregDtm]').val('');
		$('#SYSM400M input[name=SYSM400M_ilstCorprId]').val('');
		$('#SYSM400M input[name=SYSM400M_ilstCorprNm]').val('');
		$('#SYSM400M input[name=SYSM400M_ilstCorcDtm]').val('');
		$('#SYSM400M input[name=SYSM400M_abolDtm]').val('');
		if(callPos == 'Save' || callPos == 'delete' || callPos == 'disposal'){
			$('#SYSM400M button[name="SYSM400M_btnSave"]').prop('disabled', true);
			$('#SYSM400M button[name="SYSM400M_btnDel"]').prop('disabled', true);
			$('#SYSM400M button[name="SYSM400M_btnDis"]').prop('disabled', true);
		}
	}
	$('#SYSM400M input[name=SYSM400M_iregrId]').prop('disabled', true);
	$('#SYSM400M input[name=SYSM400M_iregrNm]').prop('disabled', true);
	$('#SYSM400M input[name=SYSM400M_iregDtm]').prop('disabled', true);
	$('#SYSM400M input[name=SYSM400M_ilstCorprId]').prop('disabled', true);
	$('#SYSM400M input[name=SYSM400M_ilstCorprNm]').prop('disabled', true);
	$('#SYSM400M input[name=SYSM400M_ilstCorcDtm]').prop('disabled', true);

	//알림 메시지 리셋
	SYSM400M_fnResetValidMsg();
}

function SYSM400M_fnSave(){

	let SYSM400M_itenantId	 = $('#SYSM400M input[name=SYSM400M_itenantId]').val().toUpperCase();
	let SYSM400M_ijobNo	     = $('#SYSM400M input[name=SYSM400M_ijobNo]').val();
	let SYSM400M_ijobNm	     = $('#SYSM400M input[name=SYSM400M_ijobNm]').val();
	let SYSM400M_ijobCycCd	 = $('#SYSM400M input[name=SYSM400M_ijobCycCd]').val();
	let SYSM400M_ijobClasCd	 = $('#SYSM400M input[name=SYSM400M_ijobClasCd]').val();
	let SYSM400M_iprocPgmKindCd	 = $('#SYSM400M input[name=SYSM400M_iprocPgmKindCd]').val();
	let SYSM400M_iprocPgmNm	 = $('#SYSM400M input[name=SYSM400M_iprocPgmNm]').val();
	let SYSM400M_ijobExecTm	 = $('#SYSM400M input[name=SYSM400M_ijobExecTm]').val();
	let SYSM400M_iexecScheDt = $('#SYSM400M input[name=SYSM400M_execScheDt]').val();
	let SYSM400M_iprcedJobNo = $('#SYSM400M input[name=SYSM400M_prcedJobNo]').val();
	let SYSM400M_iuseYn	     = $('#SYSM400M input[name=SYSM400M_iuseYn]').val();
	let SYSM400M_abolDtm     = $('#SYSM400M input[name=SYSM400M_abolDtm]').val();

	Utils.markingRequiredField();

	if(Utils.isNull(SYSM400M_abolDtm) != true){
		$('#SYSM400M_validMsg').text(SYSM400M_langMap.get("SYSM400M.alert.disposal"));
		return;
	}
	if(SYSM400M_itenantId.length < tanentLength){
		$('#SYSM400M_validMsg').text(SYSM400M_langMap.get("SYSM400M.alert.tenantId"));
		return;
	}
	if(SYSM400M_ijobNo.length === 0){
		$('#SYSM400M_validMsg').text(SYSM400M_langMap.get("SYSM400M.alert.jobNo"));
		return;
	}
	if(SYSM400M_ijobNm.length === 0){
		$('#SYSM400M_validMsg').text(SYSM400M_langMap.get("SYSM400M.alert.jobNm"));
		return;
	}
	if(SYSM400M_ijobCycCd.length === 0){
		$('#SYSM400M_validMsg').text(SYSM400M_langMap.get("SYSM400M.alert.jobCycle"));
		return;
	}
	if(SYSM400M_iprocPgmNm.length === 0){
		$('#SYSM400M_validMsg').text(SYSM400M_langMap.get("SYSM400M.alert.pgmNm"));
		return;
	}
	if(SYSM400M_ijobExecTm.length === 0){
		$('#SYSM400M_validMsg').text(SYSM400M_langMap.get("SYSM400M.alert.jobExecTm"));
		return;
	}
	if(SYSM400M_iuseYn.length === 0){
		$('#SYSM400M_validMsg').text(SYSM400M_langMap.get("SYSM400M.alert.useYn"));
		return;
	}
	if($('#SYSM400M input[name=SYSM400M_reptYn]').is(":checked")){
		SYSM400M_reptYn ="Y";
	}else{
		SYSM400M_reptYn ="N";
	}
	if($('#SYSM400M input[name=SYSM400M_iuseYn]').is(":checked")){
		SYSM400M_iuseYn ="Y";
	}else{
		SYSM400M_iuseYn ="N";
	}


	Utils.confirm(SYSM400M_langMap.get("common.save.msg"), function(){

		let SYSM400M_saveData = {
			tenantId      : SYSM400M_itenantId,
			jobNo         : SYSM400M_ijobNo,
			jobNm         : SYSM400M_ijobNm,
			jobCycCd      : SYSM400M_ijobCycCd,
			jobClasCd     : SYSM400M_ijobClasCd,
			procPgmKindCd : SYSM400M_iprocPgmKindCd,
			procPgmNm     : SYSM400M_iprocPgmNm,
			filePath      : $('#SYSM400M input[name=SYSM400M_ifileNm]').val(),
			fileNm        : $('#SYSM400M input[name=SYSM400M_ifilePath]').val(),
			jobExecTm     : SYSM400M_ijobExecTm,
			prcedJobNo    : SYSM400M_iprcedJobNo,
			execScheDt    : SYSM400M_iexecScheDt,
			reptYn        : SYSM400M_reptYn,
			useYn         : SYSM400M_iuseYn,
			regrId        : GLOBAL.session.user.usrId,
			regrOrgCd     : GLOBAL.session.user.orgCd,
			lstCorprId    : GLOBAL.session.user.usrId,
			lstCorprOrgCd :	GLOBAL.session.user.orgCd
		}
//		console.log("===== SYSM400M_saveData :" + JSON.stringify(SYSM400M_saveData));
		Utils.ajaxCall('/sysm/SYSM400INS01', JSON.stringify(SYSM400M_saveData), function (SYSM400INS01_result) {
			Utils.alert(SYSM400INS01_result.msg);
			SYSM400M_fnSearchList('Save');
			SYSM400M_fnInitForm('Save');
		});
	});
}


//폐기
function SYSM400M_fnDisposal(){
	var SYSM400M_itenantId	 = $('#SYSM400M input[name=SYSM400M_itenantId]').val().toUpperCase();
	var SYSM400M_ijobNo	 	= $('#SYSM400M input[name=SYSM400M_ijobNo]').val();
	var SYSM400M_abolDtm     = $('#SYSM400M input[name=SYSM400M_abolDtm]').val();


	if(SYSM400M_itenantId.length < tanentLength){
		$('#SYSM400M_validMsg').text(SYSM400M_langMap.get("SYSM400M.alert.tenantId"));
		return;
	}
	if(SYSM400M_ijobNo.length === 0){
		$('#SYSM400M_validMsg').text(SYSM400M_langMap.get("SYSM400M.alert.jobNo"));
		return;
	}

	if(Utils.isNull(SYSM400M_abolDtm) == false){
		$('#SYSM400M_validMsg').text(SYSM400M_langMap.get("SYSM400M.alert.disposal"));
		return;
	}

	Utils.confirm(SYSM400M_langMap.get("common.disposal.msg"), function(){
		var SYSM400M_delData ={
			tenantId  		: SYSM400M_itenantId,
			jobNo     		: SYSM400M_ijobNo,
			lstCorprId    	: GLOBAL.session.user.usrId,
			lstCorprOrgCd 	: GLOBAL.session.user.orgCd,
			abolmnId      	: GLOBAL.session.user.usrId,
			abolmnOrgCd   	: GLOBAL.session.user.orgCd,
		};
		Utils.ajaxCall('/sysm/SYSM400DEL01', JSON.stringify(SYSM400M_delData), function(SYSM400DEL01_data){
			Utils.alert(SYSM400DEL01_data.msg);
			SYSM400M_fnSearchList('disposal');
			SYSM400M_fnInitForm('disposal');
		});
	});
}

//삭제
function SYSM400M_fnDelete(){
	var SYSM400M_itenantId	 = $('#SYSM400M input[name=SYSM400M_itenantId]').val().toUpperCase();
	var SYSM400M_ijobNo	 = $('#SYSM400M input[name=SYSM400M_ijobNo]').val();
	var SYSM400M_abolDtm     = $('#SYSM400M input[name=SYSM400M_abolDtm]').val();

//	console.log(">>> SYSM400M_itenantId : " + SYSM400M_itenantId.length);
	if(SYSM400M_itenantId.length < tanentLength){
		$('#SYSM400M_validMsg').text(SYSM400M_langMap.get("SYSM400M.alert.tenantId"));
		return;
	}

	if(SYSM400M_ijobNo.length === 0){
		$('#SYSM400M_validMsg').text(SYSM400M_langMap.get("SYSM400M.alert.jobNo"));
		return;
	}

	if(Utils.isNull(SYSM400M_abolDtm) == true){
		$('#SYSM400M_validMsg').text(SYSM400M_langMap.get("SYSM400M.alert.required.disposal"));
		return;
	}

	Utils.confirm(SYSM400M_langMap.get("common.delete.msg"), function(){
		var SYSM400M_delData ={
			tenantId  		: SYSM400M_itenantId,
			jobNo     		: SYSM400M_ijobNo,
			lstCorprId    	: GLOBAL.session.user.usrId,
			lstCorprOrgCd 	: GLOBAL.session.user.orgCd,
			abolmnId      	: GLOBAL.session.user.usrId,
			abolmnOrgCd   	: GLOBAL.session.user.orgCd,
		};
		Utils.ajaxCall('/sysm/SYSM400DEL02', JSON.stringify(SYSM400M_delData), function(SYSM400DEL01_data){
			Utils.alert(SYSM400DEL01_data.msg);
			SYSM400M_fnSearchList('delete');
			SYSM400M_fnInitForm('delete');
		});
	});
}


function SYSM400M_fnTenantsPopup(callPos){
	if(callPos == 'Search'){
		Utils.setCallbackFunction("SYSM400M_fnTenantCallBack", SYSM400M_fnTenantCallBack);
		Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM101P", "SYSM101P", 1200, 595, {callbackKey:"SYSM400M_fnTenantCallBack"});
	}else{
		Utils.setCallbackFunction("SYSM400M_fnTenantCallBack2", SYSM400M_fnTenantCallBack2);
		Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM101P", "SYSM101P", 1200, 595, {callbackKey:"SYSM400M_fnTenantCallBack2"});
	}
}

function SYSM400M_fnTenantCallBack(itemSearch){
	let checkSearch = itemSearch.toUpperCase();
	if(checkSearch.length >= tanentLength){
		$('#SYSM400M_tenantId').val(checkSearch);
		SYSM400M_SearchTenantNm("Search");
	}
}

function SYSM400M_fnTenantCallBack2(itemSave){
	let checkSave = itemSave.toUpperCase();
	if(checkSave.length >= tanentLength){
		$('#SYSM400M_itenantId').val(checkSave);
		SYSM400M_SearchTenantNm("Insert");
	}
}

function SYSM400M_fnSetTenantIdSub(){

	$("#SYSM400M input[name=SYSM400M_itenantId]").on("propertychange change keyup paste input blur", function() {
		var currentValT2 = $(this).val().toUpperCase();
		if(currentValT2.length >=3){
			$('#SYSM400M input[name=SYSM400M_itenantId]').val(currentValT2);
			SYSM400M_SearchTenantNm("Insert");
		}
	});
	$('#SYSM400M input[name=SYSM400M_itenantId]').blur(function(event) {
		let checkT2 = $('#SYSM400M input[name=SYSM400M_itenantId]').val().toUpperCase();
		if(checkT2.length == 0){
			$('#SYSM400M input[name=SYSM400M_itenantNm]').val('');
		}
	});
}

function SYSM400M_SearchTenantNm(param) {
	var SYSM400M_tenantId, objName;
	if(param == "Search"){
		SYSM400M_tenantId =  $('#SYSM400M input[name=SYSM400M_tenantId]').val().toUpperCase();
		objName = "SYSM400M_tenantNm";
	}
	if(param == "Insert"){
		SYSM400M_tenantId =  $('#SYSM400M input[name=SYSM400M_itenantId]').val().toUpperCase();
		objName = "SYSM400M_itenantNm";
	}
	GetTenantNm(SYSM400M_tenantId,objName);
}

function GridResizeTableSYSM400M() {
	let screenHeight = $(window).height()-240;
	grdSYSM400M.element.find('.k-grid-content').css('height', screenHeight-450);
}

function SYSM400M_fnResetValidMsg(){
	$('#SYSM400M_validMsg').text('');
} 

