/***********************************************************************************************
 * Program Name : 최근검색어/내검색어 팝업(CMMT222P.js)
 * Creator      : bykim
 * Create Date  : 2022.06.10
 * Description  : 등급권한조회 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.06.10     bykim           최초 생성
 ************************************************************************************************/
var CMMT322P_SelectNode;
var listViewCMMT322P, CMMT322PDataSource;
var CMMT322P_Param = {
	tenantId : GLOBAL.session.user.tenantId,
	usrId : GLOBAL.session.user.usrId
}

var CMMT322P_SelectTap = "scwd"
$(document).ready(function () {

	CMMT322P_userInfo = GLOBAL.session.user;

	CMMT322PDataSource ={
		transport: {
			read	: function (CMMT322P_jsonStr, url) {
				if(url != null){
					Utils.ajaxCall(url, CMMT322P_jsonStr, CMMT322P_resultTenantList)

				}else{
					listViewCMMT322P.dataSource.data(parent.Utils.getCookieJsontoArr("scwd"));
				}
			},
		},
	}

	$("#KMST322P_listView").kendoListView({
		//   data 있을때
		//dataSource: CMMT322PDataSource,
		dataBound: function(){
			//   data 없을때
			if (this.dataSource.total() == 0){
				// 결함리포트 92 수정
				this.element.find('.k-listview-content').html('<div class="nodataMsg"><p>'+CMMT222P_langMap.get("CMMT222P.select")+'</p></div>');
				// 결함리포트 92 수정 end
			}
		},
		height: 300,
		scrollable: true,
		template: kendo.template($("#templateCMMT222P").html()),
		selectable : "row",
		change: function(e) {
			let selectedRows = this.select();
			let dataItem = this.dataItem(selectedRows[0]);
			CMMT322P_SelectNode = dataItem;

			CMMT222P_rtrnScwd()

		}
	}).data("kendoListView");

	listViewCMMT322P = $("#KMST322P_listView").data("kendoListView");

	var CMMT322P_data = {	tenantId : CMMT322P_userInfo.tenantId ,	usrId :  CMMT322P_userInfo.usrId};
	var CMMT322P_jsonStr = JSON.stringify(CMMT322P_data);


	CMMT322PDataSource.transport.read(CMMT322P_Param , null  );

	if(CMMT322P_userInfo.kldScwdSaveYn == "Y"){
		$('#CMMT222P_kldScwdSaveYn').prop("checked", true);
	}

});

$('#CMMT222P_myScwd').on('click',function(){
	var CMMT322P_data = {	tenantId : CMMT322P_userInfo.tenantId ,	usrId :  CMMT322P_userInfo.usrId};
	var CMMT322P_jsonStr = JSON.stringify(CMMT322P_data);

	CMMT322PDataSource.transport.read(CMMT322P_jsonStr, '/cmmt/CMMT200SEL04');
	CMMT322P_SelectTap = "myScwd"
	//$('#CMMT222P_deleteAll').css('visibility','visible');
});

$('#CMMT222P_scwd').on('click',function(){
	var CMMT322P_data = {	tenantId : CMMT322P_userInfo.tenantId ,	usrId :  CMMT322P_userInfo.usrId};
	CMMT322PDataSource.transport.read(CMMT322P_data, null);
	CMMT322P_SelectTap = "scwd"
	//$('#CMMT222P_deleteAll').css("visibility", "hidden");
});

$('#CMMT222P_deleteAll').on('click',function(){
	// 결함리포트 93 수정
	Utils.confirm('기록을 삭제 하시겠습니까?', function(){
		if(CMMT322P_SelectTap == "myScwd"){
			var CMMT322P_data = {  tenantId 	: CMMT322P_userInfo.tenantId , 	usrId 	: CMMT322P_userInfo.usrId};
			var CMMT322P_jsonStr = JSON.stringify(CMMT322P_data);

			fnRemoveScwd_cookie("myScwd")
			Utils.ajaxCall('/cmmt/CMMT200DEL01', CMMT322P_jsonStr, CMMT322P_reLoadMyScwd)
		}else if(CMMT322P_SelectTap == "scwd"){
			fnRemoveScwd_cookie("scwd")
			CMMT322PDataSource.transport.read(CMMT322P_data, null);
		}
	});
	// 결함리포트 93 수정 end
});


function CMMT322P_reLoadMyScwd(){
	var CMMT322P_data = {  tenantId 	: CMMT322P_userInfo.tenantId , 	usrId 	: CMMT322P_userInfo.usrId};
	var CMMT322P_jsonStr = JSON.stringify(CMMT322P_data);

	CMMT322PDataSource.transport.read(CMMT322P_jsonStr, '/cmmt/CMMT200SEL04')
}
function CMMT322P_resultTenantList(data){

	var CMMT322P_jsonEncode = JSON.stringify(data.CMMT200VOInfo);
	var CMMT322P_jsonDecode = JSON.parse(JSON.parse(CMMT322P_jsonEncode));

	listViewCMMT322P.dataSource.data(CMMT322P_jsonDecode);
}

function CMMT222P_addMyScwd(obj){
	let scwd = $(obj).closest("p").find("#CMMT222P_id")[0].innerHTML;

	var CMMT322P_data = { tenantId 	:  CMMT322P_userInfo.tenantId, 	usrId 	: CMMT322P_userInfo.usrId,	myScwd 	: scwd.trim()};
	var CMMT322P_jsonStr = JSON.stringify(CMMT322P_data);

	if($(obj).prop('checked')){
		Utils.ajaxCall('/cmmt/CMMT200INS02', CMMT322P_jsonStr )
		fnAddMyScwd_cookie(obj , 1)
	}else{
		Utils.ajaxCall('/cmmt/CMMT200DEL01', CMMT322P_jsonStr,
			$('#CMMT222P_myScwd').prop('checked')? CMMT322P_reLoadMyScwd : "") ;

		fnAddMyScwd_cookie(obj , 0)
	}
}


function fnAddMyScwd_cookie(obj , inMySc){
	let arr = parent.Utils.getCookieJsontoArr("scwd")
	for(let i in arr){
		if(arr[i].scwd == $(obj).closest("p").find("#CMMT222P_id")[0].innerHTML.trim()){
			if($(obj).prop('checked')){
				arr[i].inMySc = inMySc
			}else{
				arr[i].inMySc = inMySc
			}
		}
	}
	parent.Utils.setCookieArrToJson("scwd",arr)

}

function fnRemoveScwd_cookie(tap){
	if(tap == "myScwd"){
		let arr = parent.Utils.getCookieJsontoArr("scwd")
		for(let i in arr){
			arr[i].inMySc = 0
		}
		parent.Utils.setCookieArrToJson("scwd",arr)
	}else if(tap == "scwd"){
		parent.Utils.setCookieArrToJson("scwd",[])
	}
}



function CMMT222P_updSaveYn(obj){
	let chkKldScwdSaveYn = 'N'

	if($(obj).prop('checked')){
		chkKldScwdSaveYn = 'Y'
	}

	var CMMT322P_data = { tenantId 			: CMMT322P_userInfo.tenantId
		,usrId 				:  CMMT322P_userInfo.usrId
		,kldScwdSaveYn 		: chkKldScwdSaveYn
		,lstCorprOrgCd 		: CMMT322P_userInfo.orgCd
		,lstCorprId 		: CMMT322P_userInfo.usrId}
	var CMMT322P_jsonStr = JSON.stringify(CMMT322P_data);

	Utils.ajaxCall('/cmmt/CMMT200UPT03', CMMT322P_jsonStr, function () {
		Utils.getParent().MAINFRAME_SUB.updateSessionUser();
	});
}

//======================================================================================================================
//Button Event - 확인 버튼 클릭
function CMMT222P_rtrnScwd(){
	if(CMMT322P_SelectNode.length<1){
		//Utils.alert(CMMT322P_langMap.get("SYSM210P.noSelect"));
	}else{
		Utils.getPopupCallback(CMMT222P_callbackKey)(CMMT322P_SelectNode);
	}

	Utils.closeKendoWindow(CMMT222P_id);
}


