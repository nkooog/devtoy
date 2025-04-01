/***********************************************************************************************
 * Program Name : 조직권한조회 팝업(CMMT321P.js)
 * Creator      : 김보영
 * Create Date  : 2022.04.18
 * Description  : 조직권한조회 팝업
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.18     김보영           최초 생성
 ************************************************************************************************/
$(document).ready(function () {
	CMMT321PDataSource ={
			transport: {
				read	: function (CMMT321P_jsonStr) {
					Utils.ajaxCall('/cmmt/CMMT110SEL01', CMMT321P_jsonStr, CMMT321P_fnResultTenantList, 
					window.kendo.ui.progress($("#grdCMMT321P"), true), window.kendo.ui.progress($("#grdCMMT321P"), false))
				},
			},
	}
	
	$("#grdCMMT321P").kendoGrid({
		dataSource : CMMT321PDataSource,
		autoBind: false,
		sortable: true,
		resizable: true,
		columns: [
			{
				title: "조직명",
				width: 300,
				field: "athtView",
				attributes: {"class": "k-text-left"},
			},{
				title: "읽기 권한",
				field: "rdPmssYn",
				width: 80,
				template : '#=CMMT321P_fnSubSetCheckBox(rdPmssYn)#', //data,id
			},{
				title: "쓰기 권한",
				width: 80,
				template : '#=CMMT321P_fnSubSetCheckBox(writPmssYn)#',
			},{
				title: "수정 권한",
				field: "corcPmssYn",
				width: 80,
				template : '#=CMMT321P_fnSubSetCheckBox(corcPmssYn)#',
			},{
				title: "삭제 권한",
				field: "delPmssYn",
				width: 80,
				template : '#=CMMT321P_fnSubSetCheckBox(delPmssYn)#',
			},{
				title: "댓글쓰기 권한",
				field: "replyPmssYn",
				width: 90,
				template : '#=CMMT321P_fnSubSetCheckBox(replyPmssYn)#',
			},{
				title: "좋아요 권한",
				field: "goodPmssYn",
				width: 90,
				template : '#=CMMT321P_fnSubSetCheckBox(goodPmssYn)#',
			},{
				title: "다운로드 권한",
				field: "apndFileDnldPmssYn",
				width: 90,
				template : '#=CMMT321P_fnSubSetCheckBox(apndFileDnldPmssYn)#',
			}],
	});
	
	grdCMMT321P = $("#grdCMMT321P").data("kendoGrid");
	
	var tenantIdval = Utils.isNull(Utils.getUrlParam('tenantId')) ? GLOBAL.session.user.tenantId : Utils.getUrlParam('tenantId');
	var CMMT321P_data = {	tenantId 	: tenantIdval, ctgrUseAthtCd : '1', ctgrMgntNo : Utils.getUrlParam('ctgrMgntNo')};
	var CMMT321P_jsonStr = JSON.stringify(CMMT321P_data);
	
	CMMT321PDataSource.transport.read(CMMT321P_jsonStr);
	
	CMMT321P_fnDefaultHightSetting;
	$(window).on({'resize': function() {CMMT321P_fnDefaultHightSetting();}});
	
});

function CMMT321P_fnResultTenantList(data){
	
	var CMMT321P_jsonEncode = JSON.stringify(data.CMMT110VOGridInfo);
	var CMMT321P_jsonDecode = JSON.parse(JSON.parse(CMMT321P_jsonEncode));
	
	grdCMMT321P.dataSource.data(CMMT321P_jsonDecode);
}

function CMMT321P_fnSubSetCheckBox(item,field,label,i){
	let input;
	if(item === "Y"){
		input = '<span class="swithCheck"><input type="checkbox" name="'+field+'" checked disabled /><label></label></span>';
	}else{
		input = '<span class="swithCheck"><input type="checkbox" name="'+field+'" disabled /><label></label></span>';
	}
	return input;
}

function CMMT321P_fnDefaultHightSetting(){
	grdCMMT321P.element.find('.k-grid-content').css('height', $(window).height()-150);
}

