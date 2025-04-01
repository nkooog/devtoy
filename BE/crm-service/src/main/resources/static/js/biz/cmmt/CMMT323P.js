/***********************************************************************************************
 * Program Name : 개별권한찾기 팝업(CMMT323P.js)
 * Creator      : 김보영
 * Create Date  : 2022.04.18
 * Description  : 개별권한찾기 팝업
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.18     김보영           최초 생성
 ************************************************************************************************/
var CMMT323P_SelectNode = [];

$(document).ready(function () {
	CMMT323PDataSource ={
			transport: {
				read	: function (CMMT323P_jsonStr) {
					Utils.ajaxCall('/cmmt/CMMT110SEL01', CMMT323P_jsonStr, CMMT323P_fnResultTenantList, 
					window.kendo.ui.progress($("#grdCMMT323P"), true), window.kendo.ui.progress($("#grdCMMT323P"), false))
				},
			},
	}
	
	$("#grdCMMT323P").kendoGrid({
		dataSource : CMMT323PDataSource,
		autoBind: false,
		sortable: true,
		resizable: true,
		columns: [
			{
				title: "조직명",
				field: "athtView",
				width: 290,
				template : '#=athtView.split(\':\')[0]#',
				attributes: {"class": "k-text-left"},
			},
			{
				title: "유저명(ID)",
				width: 100,
				field: "athtView",
				template : '#=athtView.split(\':\')[1]+"("+athtCd+")"#',
				attributes: {"class": "k-text-left"},
			},{
				title: "읽기 권한",
				field: "rdPmssYn",
				width: 70,
				template : '#=CMMT323P_fnSubSetCheckBox(rdPmssYn)#', //data,id
			},{
				title: "쓰기 권한",
				width: 70,
				template : '#=CMMT323P_fnSubSetCheckBox(writPmssYn)#',
			},{
				title: "수정 권한",
				field: "corcPmssYn",
				width: 70,
				template : '#=CMMT323P_fnSubSetCheckBox(corcPmssYn)#',
			},{
				title: "삭제 권한",
				field: "delPmssYn",
				width: 70,
				template : '#=CMMT323P_fnSubSetCheckBox(delPmssYn)#',
			},{
				title: "댓글쓰기 권한",
				field: "replyPmssYn",
				width: 80,
				template : '#=CMMT323P_fnSubSetCheckBox(replyPmssYn)#',
			},{
				title: "좋아요 권한",
				field: "goodPmssYn",
				width: 80,
				template : '#=CMMT323P_fnSubSetCheckBox(goodPmssYn)#',
			},{
				title: "다운로드 권한",
				field: "apndFileDnldPmssYn",
				width: 80,
				template : '#=CMMT323P_fnSubSetCheckBox(apndFileDnldPmssYn)#',
			}],
	});
	
	grdCMMT323P = $("#grdCMMT323P").data("kendoGrid");
	
	var tenantIdval = Utils.isNull(Utils.getUrlParam('tenantId')) ? GLOBAL.session.user.tenantId : Utils.getUrlParam('tenantId');
	var CMMT323P_data = {	tenantId 	: tenantIdval, ctgrUseAthtCd : '3', ctgrMgntNo : Utils.getUrlParam('ctgrMgntNo')};
	var CMMT323P_jsonStr = JSON.stringify(CMMT323P_data);
	
	CMMT323PDataSource.transport.read(CMMT323P_jsonStr);
	
	CMMT323P_fnDefaultHightSetting;
	$(window).on({'resize': function() {CMMT323P_fnDefaultHightSetting();}});
	
});

function CMMT323P_fnResultTenantList(data){
	
	var CMMT323P_jsonEncode = JSON.stringify(data.CMMT110VOGridInfo);
	var CMMT323P_jsonDecode = JSON.parse(JSON.parse(CMMT323P_jsonEncode));
	
	grdCMMT323P.dataSource.data(CMMT323P_jsonDecode);
}	 

function CMMT323P_fnSubSetCheckBox(item,field,label,i){
	let input;
	if(item === "Y"){
		input = '<span class="swithCheck"><input type="checkbox" name="'+field+'" checked disabled /><label></label></span>';
	}else{
		input = '<span class="swithCheck"><input type="checkbox" name="'+field+'" disabled /><label></label></span>';
	}
	return input;
}

function CMMT323P_fnDefaultHightSetting(){
	grdCMMT323P.element.find('.k-grid-content').css('height', $(window).height()-150);
}
