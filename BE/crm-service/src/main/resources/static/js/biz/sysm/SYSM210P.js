/***********************************************************************************************
 * Program Name : 조직찾기 팝업(SYSM210P.js)
 * Creator      : 허해민
 * Create Date  : 2022.01.25
 * Description  : 조직찾기 팝업 (멀티)
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.01.25     허해민           최초작성
 * 2022.04.18     정대정           전체 수정
 ************************************************************************************************/
var SYSM210P_SelectNode = [];
$(document).ready(function () {
	let tenantIdval = Utils.isNull(Utils.getUrlParam('tenantId')) ? GLOBAL.session.user.tenantId : Utils.getUrlParam('tenantId');
	let tree_jsonStr ={tenantId : tenantIdval};

	Utils.ajaxCall('/sysm/SYSM210SEL01',JSON.stringify(tree_jsonStr),function (data){
			$("#treeSYSM210P").kendoTreeView({
				dataSource: SYSM210P_fnCreateTreeData(data.tree),
				dataTextField: [ "orgNm"],
				checkboxes: { checkChildren: true},   //단일시 주석
				check: function(e) {
					let treeView = $("#treeSYSM210P").data("kendoTreeView");
					SYSM210P_SelectNode = [];
					SYSM210P_fnCheckedNodeIds(treeView.dataSource.view(), SYSM210P_SelectNode);
				},
			});
		},
		null,null,null)
});

//Subfunction - Data Tree 형식으로 변경
function SYSM210P_fnCreateTreeData(list) {
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
//Subfunction - 선택된 아이템 추가
function SYSM210P_fnCheckedNodeIds(nodes, checkedNodes) {

	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].checked) {
			let obj = {
				orgNm 		: nodes[i].orgNm,
				orgCd 		: nodes[i].id,
				hgrkOrgCd	: nodes[i].hgrkOrgCd,
				tenantId    : nodes[i].tenantId,
				orgPath		: nodes[i].orgPath,
				orgStCd		: nodes[i].orgStCd,
				prsLvlCd 	: nodes[i].prsLvlCd,
				srtSeq		: nodes[i].srtSeq,
			};
			checkedNodes.push(obj);
		}
		if (nodes[i].hasChildren) {
			SYSM210P_fnCheckedNodeIds(nodes[i].children.view(), checkedNodes);
		}
	}
}
//======================================================================================================================
//Button Event - 확인 버튼 클릭
$('#SYSM210P_btn_confirm').off("click").on("click", function () {
	if(SYSM210P_SelectNode.length<1){ Utils.alert(SYSM210P_langMap.get("SYSM210P.noSelect"));}
	else{ Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM210P_SelectNode); self.close();	}
});

//Button Event - 조회 버튼 클릭
$('#SYSM210P_btn_filter').off("click").on("click", function () {
	let filterText = $("#SYSM210P_filter_text").val();
	let tree = $("#treeSYSM210P").data("kendoTreeView");

	if (filterText !== "") {
		tree.dataSource.filter({
			field: "orgNm",
			operator: "contains",
			value: filterText
		});
	} else {
		tree.dataSource.filter({});
	}
});



