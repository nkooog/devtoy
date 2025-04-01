/***********************************************************************************************
 * Program Name : 최근검색어/내검색어 팝업(kmst310P.js)
 * Creator      : bykim
 * Create Date  : 2022.06.10
 * Description  : 등급권한조회 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.06.10     bykim           최초 생성
 ************************************************************************************************/
var KMST310P_SelectNode = [] ,KMST320P_DataSource;
var KMST310P_Param = {
	tenantId : GLOBAL.session.user.tenantId,
	usrId : GLOBAL.session.user.usrId
}
var KMST310P_SelectTap = "scwd"

$(document).ready(function () {
	//1. dataSource Init
	KMST320P_DataSource ={
		transport: {
			read	: function (url, param) {
				if(url != null){
					Utils.ajaxCall(url, JSON.stringify(param), function (data){
						$("#KMST320P_listView").data("kendoListView").dataSource.data(JSON.parse(JSON.parse(JSON.stringify(data.CMMT200VOInfo))));
					},null,null,null)
				}else{
					$("#KMST320P_listView").data("kendoListView").dataSource.data( Utils.getCookieJsontoArr("scwd") );
				}
			},
		},
	}

	//2.kendoList View init
	$("#KMST320P_listView").kendoListView({
		//   data 있을때
		//dataSource: CMMT322PDataSource,
		dataBound: function(){//   data 없을때
			if (this.dataSource.total() === 0){this.element.find('.k-listview-content').html('<div class="nodataMsg"><p>최근 검색한 항목이 없습니다.</p></div>');	}
		},
		height: 300,
		scrollable: true,
		template: kendo.template($("#templateKMST310P").html()),
		selectable : "row",
		change: function(e) {
			KMST310P_SelectNode =[];
			KMST310P_SelectNode.push(this.dataItem(this.select()[0]));

			KMST310P_fnReturnScwd()
		}
	}).data("kendoListView");

	KMST320P_DataSource.transport.read(null,KMST310P_Param);

	if(GLOBAL.session.user.kldScwdSaveYn === "Y"){	$('#KMST310P_kldScwdSaveYn').prop("checked", true);}
});

$('#KMST310P_myScwd').on('click',function(){
	KMST320P_DataSource.transport.read('/cmmt/CMMT200SEL04',KMST310P_Param);
	KMST310P_SelectTap = "myScwd"
	//$('#KMST310P_deleteAll').css('visibility','visible');
});

$('#KMST310P_scwd').on('click',function(){
	KMST320P_DataSource.transport.read(null,KMST310P_Param);
	KMST310P_SelectTap = "scwd"
	//$('#KMST310P_deleteAll').css("visibility", "hidden");
});

$('#KMST310P_deleteAll').on('click',function(){
	if(KMST310P_SelectTap == "myScwd"){
		Utils.ajaxCall('/cmmt/CMMT200DEL01', JSON.stringify(KMST310P_Param), KMST320P_fnReLoadMyScwd,null,null,null);
		fnRemoveScwd_cookie("myScwd")
	}else if(KMST310P_SelectTap == "scwd"){
		fnRemoveScwd_cookie("scwd")
		KMST320P_DataSource.transport.read(null,KMST310P_Param);
	}
});

function KMST320P_fnReLoadMyScwd(){
	KMST320P_DataSource.transport.read('/cmmt/CMMT200SEL04',KMST310P_Param);
}

function KMST310P_fnAddMyScwd(obj){
	let data = {
		tenantId : GLOBAL.session.user.tenantId,
		usrId : GLOBAL.session.user.usrId,
		myScwd : $(obj).closest("p").find("#KMST310P_id")[0].innerHTML.trim()
	}
	if($(obj).prop('checked')){
		Utils.ajaxCall('/cmmt/CMMT200INS02', JSON.stringify(data),null,null,null,null);
		fnAddMyScwd_cookie(obj , 1)
	}else{
		Utils.ajaxCall('/cmmt/CMMT200DEL01', JSON.stringify(data),
			$('#KMST310P_myScwd').prop('checked')? KMST320P_fnReLoadMyScwd : "",null,null,null);
		fnAddMyScwd_cookie(obj , 0)
	}
}

function fnAddMyScwd_cookie(obj , inMySc){
	let arr = Utils.getCookieJsontoArr("scwd")
	for(let i in arr){
		if(arr[i].scwd == $(obj).closest("p").find("#KMST310P_id")[0].innerHTML.trim()){
			if($(obj).prop('checked')){
				arr[i].inMySc = inMySc
			}else{
				arr[i].inMySc = inMySc
			}
		}
	}
	Utils.setCookieArrToJson("scwd",arr)
}

function fnRemoveScwd_cookie(tap){
	if(tap == "myScwd"){
		let arr = Utils.getCookieJsontoArr("scwd")
		for(let i in arr){
			arr[i].inMySc = 0
		}
		Utils.setCookieArrToJson("scwd",arr)
	}else if(tap == "scwd"){
		Utils.setCookieArrToJson("scwd",[])
	}
}


function KMST310P_fnUpdSaveYn(obj){
	let data = {
		tenantId 			: GLOBAL.session.user.tenantId
		,usrId 				: GLOBAL.session.user.usrId
		,kldScwdSaveYn 		: $(obj).prop('checked') ? 'Y' : 'N'
		,lstCorprOrgCd 		: GLOBAL.session.user.orgCd
		,lstCorprId 		: GLOBAL.session.user.usrId
	}

	Utils.ajaxCall('/cmmt/CMMT200UPT03', JSON.stringify(data), function () {
		Utils.getParent().Utils.getParent().MAINFRAME_SUB.updateSessionUser();
	},null,null,null);
}

//======================================================================================================================
//Button Event - 항목 더블 클릭
function KMST310P_fnReturnScwd(){
	if (KMST310P_SelectNode.length >= 1) {
		Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(KMST310P_SelectNode[0]);
	}
	Utils.closeKendoWindow(Utils.getUrlParam("id"));
}


