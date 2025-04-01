/***********************************************************************************************
 * Program Name : 상담유형코드관리 tree View(SYSM282P.js)
 * Creator      : 김보영
 * Create Date  : 2022.05.28
 * Description  : 상담유형코드관리 팝업 
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.28     김보영           최초 생성
 ************************************************************************************************/
$(document).ready(function () {
	SYSM282P_TreeViewInit();
});

//1.TreeView init
function SYSM282P_TreeViewInit(){
	let tenantIdval = Utils.isNull(Utils.getUrlParam('tenantId')) ? GLOBAL.session.user.tenantId : Utils.getUrlParam('tenantId');
	let tree_jsonStr ={	tenantId 	: tenantIdval,
					//	useDvCd 	: "Y"
					};
	Utils.ajaxCall('/sysm/SYSM280SEL01',JSON.stringify(tree_jsonStr),
		function (data){
			let SYSM282P_treeData = SYSM282P_fnCreateTreeData(JSON.parse(JSON.parse(JSON.stringify(data.SYSM280VOInfo))));


			$("#treeSYSM282P").kendoTreeView({
				dataSource: SYSM282P_treeData,
				dataTextField: [ "cnslTypLvlNm"],
			});
		},
		false,false,
		function(request,status, error){
			console.log("[error]");
			console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		})
}
//======================================================================================================================
//Subfunction - Data Tree 형식으로 변경
function SYSM282P_fnCreateTreeData(list) {
    let MappedArr = [];
    for (let item of list) {
        let data = {
            id				: item.cnslTypCd,        // 자신 코드 * 필수
            hgrkCnslTypCd	: item.hgrkCnslTypCd,    // 부모 코드 * 필수
            cnslTypLvlNm	: item.cnslTypLvlNm,        // 자신 이름
            tenantId    	: item.tenantId,
            prsLvlCd		: item.prsLvlCd,
			items		: [],
			expanded    : true
        };
		MappedArr.push(data);
    }

	let treeCol = [],MappedElem;
	for (let num in MappedArr) {
		if (MappedArr.hasOwnProperty(num)) {
			MappedElem = MappedArr[num];
			if (MappedElem.hgrkCnslTypCd) {//부모코드가 있는경우
				let cnslTypLvlNm = MappedArr.findIndex(e=>e.id===MappedElem.hgrkCnslTypCd);
				MappedArr[cnslTypLvlNm].items.push(MappedElem);
			} else {//부모코드가 없을경우 -> 최상단
				treeCol.push(MappedElem);
			}
		}
	}
    return treeCol;
}
//======================================================================================================================

//Button Event - 조회 버튼 클릭
$('#SYSM282P_btn_filter').off("click").on("click", function () {
	let filterText = $("#SYSM282P_filter_text").val();
	let tree = $("#treeSYSM282P").data("kendoTreeView");

	if (filterText !== "") {
		tree.dataSource.filter({
			field: "cnslTypLvlNm",
			operator: "contains",
			value: filterText
		});
	} else {
		tree.dataSource.filter({});
	}
});


