var CNSL150T_Grid;
var CNSL150T_TenantId=GLOBAL.session.user.tenantId;

$(document).ready(function () {
	CNSL150T_Grid = {
		instance: {},
		dataSource: {},
		currentItem: {},
		currentCellIndex: 0,
		selectedItems: [],
	}

	CNSL150T_fnGridInit();
	heightResizeCNSL();
});

function CNSL150T_fnGridInit(){
	CNSL150T_Grid.instance = $("#CNSL150T_grid").kendoGrid({
		columns: [
			{ width: 120, field: "startTime", title: "상담일시"},
			{ width: 120, field: "inOut", title: "IB/OB", hidden: true},
			{ width: 120, field: "customerNum", title: "콜봇상담전화번호", template: function(dataItem){
					if (dataItem.customerNum.slice(0, 2) === "02") {
						return `${dataItem.customerNum.slice(0, 2)}-${dataItem.customerNum.slice(2, 6)}-${dataItem.customerNum.slice(6)}`;
					} else {
						return `${dataItem.customerNum.slice(0, 3)}-${dataItem.customerNum.slice(3, 7)}-${dataItem.customerNum.slice(7)}`;
					}
				}
			},
			{ width: 150, field: "callbotName", title: "상담 시나리오명", },
			{ width: 90, field: "detail", title: "대화조회", template: function(dataItem){
					return `<button type="button" class="btnRefer_second ma_top4" style="height:22px; font-size:11px;" title="대화조회"
 								onclick="CNSL150T_fnOpenChatList(this)">대화조회</button>`;
				}
			}
		],
		noRecords: { template: '<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>' },
		dataSource: [],
		scrollable: true,
	}).data('kendoGrid');
	CNSL150T_fnSearchChatList();
}

function CNSL150T_fnOpenChatList(obj){
	let grid = CNSL150T_Grid.instance;
	let row = $(obj).closest("tr");
	let dataItem = grid.dataItem(row);
	Utils.openPopV2(GLOBAL.contextPath + "/cnsl/CNSL151P", "CNSL151P", 1000, 700, true,{data:dataItem},false);
}

function CNSL150T_fnSearchChatList(){

	let phone = $("#CNSL150T_SearchPhone").val();

	if(Utils.isNull(phone)){
		return;
	}

	let parm = {
		tenant:CNSL150T_TenantId,
		startDate:$("#CNSL150T_StartDate").val(),
		endDate:$("#CNSL150T_EndDate").val(),
		customerNum:phone.replaceAll('-','')
	}

	Utils.ajaxCall("/cnsl/CNSL150SEL01", JSON.stringify(parm), function (data) {
		CNSL150T_Grid.instance.dataSource.data([]);

		let code = data.result.Result.Code;
		let resultdata = data.result.ResultData;

		if(code ==='0000'){
			CNSL150T_Grid.instance.dataSource.data(resultdata);
		}
		CNSL150T_Grid.instance.dataSource.sort({field: "startTime", dir: "desc"});
	});
}