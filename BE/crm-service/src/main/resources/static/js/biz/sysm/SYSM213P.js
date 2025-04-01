/***********************************************************************************************
 * Program Name : 조직찾기 팝업(SYSM213P.js)
 * Creator      : 정대정
 * Create Date  : 2022.04.18
 * Description  : 조직찾기 팝업 (단건)
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.18     정대정           최초 생성
 ************************************************************************************************/
var SYSM213P_SelectNode = [];
$(document).ready(function () {
	let tenantIdval = Utils.isNull(Utils.getUrlParam('tenantId')) ? GLOBAL.session.user.tenantId : Utils.getUrlParam('tenantId');
	let tree_jsonStr ={tenantId : tenantIdval};

	Utils.ajaxCall('/sysm/SYSM210SEL01',JSON.stringify(tree_jsonStr),function (data){
		$("#treeSYSM213P").kendoTreeView({
			dataSource: SYSM213P_fnCreateTreeData(data.tree),
			dataTextField: [ "orgNm"],
			change: function (e){
				let selectedRows = this.select();
				SYSM213P_SelectNode = [];
				for (let i = 0; i < selectedRows.length; i++) {
					let dataItem = this.dataItem(selectedRows[i]);
					SYSM213P_SelectNode.push(dataItem);
				}
			}
		});
	},
	null,null,null);
	
	$("#treeSYSM213P").on('dblclick',function(e){
		if(SYSM213P_SelectNode.length<1){
			Utils.alert(SYSM213P_langMap.get("SYSM210P.noSelect"));
		} else {
			Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM213P_SelectNode);
			self.close();
		}
	});
	
	$("#SYSM213P_filter_text").on('keyup',function(e){
		if(e.keyCode == "13"){
			SYSM213P_fnFilter();
		}
	})
});

//Subfunction - Data Tree 형식으로 변경
function SYSM213P_fnCreateTreeData(list) {
    let MappedArr = [];
    for (let item of list) {
        let data = {
            id			: item.orgCd,        // 자신 코드 * 필수
            hgrkOrgCd	: item.hgrkOrgCd,    // 부모 코드 * 필수
            orgNm		: item.orgNm,        // 자신 이름
            tenantId    : item.tenantId,
			orgPath		: item.orgPath,
			orgStCd		: item.orgStCd,
			prsLvlCd 	: item.prsLvlCd,
			srtSeq		: item.srtSeq,
        };
		MappedArr.push(data);
    }
	return Utils.CreateTreeDataFormat(MappedArr, "hgrkOrgCd",true);
}
//======================================================================================================================
//Button Event - 확인 버튼 클릭
$('#SYSM213P_btn_confirm').off("click").on("click", function () {
	if(SYSM213P_SelectNode.length<1){Utils.alert(SYSM213P_langMap.get("SYSM210P.noSelect"));}
	else{Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM213P_SelectNode);self.close();}
});

//Button Event - 조회 버튼 클릭
$('#SYSM213P_btn_filter').off("click").on("click", function () {
	SYSM213P_fnFilter();
});

function SYSM213P_fnFilter(){
	
	let filterText = $("#SYSM213P_filter_text").val();
	let tree = $("#treeSYSM213P").data("kendoTreeView");

	if (filterText !== "") {
		tree.dataSource.filter({
			field: "orgNm",
			operator: "contains",
			value: filterText
		});
	} else {
		tree.dataSource.filter({});
	}
	
}

