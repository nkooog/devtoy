/***********************************************************************************************
 * Program Name : 등급권한조회 팝업(CMMT322P.js)
 * Creator      : 김보영
 * Create Date  : 2022.04.18
 * Description  : 등급권한조회 팝업
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.18     김보영           최초 생성
 ************************************************************************************************/

$(document).ready(function () {
	CMMT322PDataSource ={
			transport: {
				read	: function (CMMT322P_jsonStr) {
					Utils.ajaxCall('/cmmt/CMMT110SEL01', CMMT322P_jsonStr, CMMT322P_fnResultTenantList, 
					window.kendo.ui.progress($("#grdCMMT322P"), true), window.kendo.ui.progress($("#grdCMMT322P"), false))
				},
			},
	}
	
	$("#grdCMMT322P").kendoGrid({
		dataSource : CMMT322PDataSource,
		autoBind: false,
		sortable: true,
		resizable: true,
		columns: [
			{
				title: "등급명",
				width: 300,
				field: "athtView",
				attributes: {"class": "k-text-left"},
			},{
				title: "읽기 권한",
				field: "rdPmssYn",
				width: 80,
				template : '#=CMMT322P_fnSubSetCheckBox(rdPmssYn)#', //data,id
			},{
				title: "쓰기 권한",
				width: 80,
				template : '#=CMMT322P_fnSubSetCheckBox(writPmssYn)#',
			},{
				title: "수정 권한",
				field: "corcPmssYn",
				width: 80,
				template : '#=CMMT322P_fnSubSetCheckBox(corcPmssYn)#',
			},{
				title: "삭제 권한",
				field: "delPmssYn",
				width: 80,
				template : '#=CMMT322P_fnSubSetCheckBox(delPmssYn)#',
			},{
				title: "댓글쓰기 권한",
				field: "replyPmssYn",
				width: 90,
				template : '#=CMMT322P_fnSubSetCheckBox(replyPmssYn)#',
			},{
				title: "좋아요 권한",
				field: "goodPmssYn",
				width: 90,
				template : '#=CMMT322P_fnSubSetCheckBox(goodPmssYn)#',
			},{
				title: "다운로드 권한",
				field: "apndFileDnldPmssYn",
				width: 90,
				template : '#=CMMT322P_fnSubSetCheckBox(apndFileDnldPmssYn)#',
			}],
	});
	
	grdCMMT322P = $("#grdCMMT322P").data("kendoGrid");
	
	var tenantIdval = Utils.isNull(Utils.getUrlParam('tenantId')) ? GLOBAL.session.user.tenantId : Utils.getUrlParam('tenantId');
	var CMMT322P_data = {	tenantId 	: tenantIdval, ctgrUseAthtCd : '2', ctgrMgntNo : Utils.getUrlParam('ctgrMgntNo')};
	var CMMT322P_jsonStr = JSON.stringify(CMMT322P_data);
	
	CMMT322PDataSource.transport.read(CMMT322P_jsonStr);
	
	CMMT322P_fnDefaultHightSetting;
	$(window).on({'resize': function() {CMMT322P_fnDefaultHightSetting();}});
	
});

function CMMT322P_fnResultTenantList(data){
	
	var CMMT322P_jsonEncode = JSON.stringify(data.CMMT110VOGridInfo);
	var CMMT322P_jsonDecode = JSON.parse(JSON.parse(CMMT322P_jsonEncode));
	
	grdCMMT322P.dataSource.data(CMMT322P_jsonDecode);
}

function CMMT322P_fnSubSetCheckBox(item,field,label,i){
	let input;
	if(item === "Y"){
		input = '<span class="swithCheck"><input type="checkbox" name="'+field+'" checked disabled /><label></label></span>';
	}else{
		input = '<span class="swithCheck"><input type="checkbox" name="'+field+'" disabled /><label></label></span>';
	}
	return input;
}

function CMMT322P_fnDefaultHightSetting(){
	grdCMMT322P.element.find('.k-grid-content').css('height', $(window).height()-150);
}

