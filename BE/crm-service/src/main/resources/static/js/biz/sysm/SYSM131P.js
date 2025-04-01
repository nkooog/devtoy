var SYSM131P_Editor;
var SYSM131P_Object;
var SYSM131P_Result;
var SYSM131P_OpenState = { Create :"C" ,Update : "U" }

$(document).ready(function () {
	SYSM131P_fnInitObject();
	SYSM131P_Editor = cEditor.Creater("SYSM131P_editor",100,400,1,null);
	SYSM131P_Editor.params.PreventDragAndDrop =true;
	SYSM131P_fnInitPopup();
});

function SYSM131P_fnInitObject(){
	SYSM131P_Object = {
		state : Utils.getUrlParam("state"),
		tenantId : Utils.getUrlParam("tenantId"),
		itemSeq : Utils.getUrlParam("itemSeq"),
		orgCd : Utils.getUrlParam("orgCd"),
		orgNm : Utils.getUrlParam("orgNm"),
		mgntItemCd : Utils.getUrlParam("mgntItemCd"),
		mgntItemComcd : Utils.getUrlParam("comCd"),
		mgntItemComcdNm : Utils.getUrlParam("comCdNm"),
	}
}

function SYSM131P_fnInitPopup(){
	$('#SYSM131P_orgNm').val(SYSM131P_Object.orgNm);
	$('#SYSM131P_ectMgntCdNm').val(SYSM131P_Object.mgntItemComcdNm);

	if(SYSM131P_Object.state === SYSM131P_OpenState.Update){
		let param ={
			tenantId : SYSM131P_Object.tenantId,
			orgCd : SYSM131P_Object.orgCd,
			itemSeq : SYSM131P_Object.itemSeq
		}
		Utils.ajaxCall('/sysm/SYSM131SEL02', JSON.stringify(param), function (data) {
			SYSM131P_Result = data.result;
			$('#SYSM131P_ectMgntCdNm').val(SYSM131P_Result.mgntItemComcdNm);
			$('#SYSM131P_title').val(SYSM131P_Result.etcItemTite);
		},null,null,null);
	}
}

function OnInitCompleted(e){
	e.editorTarget.SetBodyValue(SYSM131P_Result.etcItemCtt);
}

function SYSM131P_fnBtnSaveClick(){
	SYSM131P_Object.etcItemTite =$('#SYSM131P_title').val();
	SYSM131P_Object.etcItemCtt =SYSM131P_Editor.GetBodyValue();
	SYSM131P_Object.regrId =GLOBAL.session.user.usrId;
	SYSM131P_Object.regrOrgCd =GLOBAL.session.user.orgCd;

	let SYSM131P_Save = {
		"C":function(){
			Utils.ajaxCall('/sysm/SYSM131INS01', JSON.stringify(SYSM131P_Object), function (data) {
				SYSM131P_fnAjaxResultAlert(data);
			},null,null,null);
		},
		"U":function(){
			Utils.ajaxCall('/sysm/SYSM131UPT01', JSON.stringify(SYSM131P_Object), function (data) {
				SYSM131P_fnAjaxResultAlert(data);
			},null,null,null);
		},
	}
	SYSM131P_Save[SYSM131P_Object.state]();
}

function SYSM131P_fnAjaxResultAlert(data){
	Utils.alert(data.msg,function(){
		if(data.result>= 0){
			let param ={tenantId : SYSM131P_Object.tenantId , orgCd: SYSM131P_Object.orgCd};
			Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(param);
			window.close();
		}
	});
}