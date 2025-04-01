var KMST330P_CMMTSelectNode=[],KMST330P_KMSTSelectNode = [], KMST330P_UsrList =[];
var KMST220P_treeData_1,KMST220P_treeData_2;

$(document).ready(function (){
	//1.
	KMST330P_fnDateInit();

	$('#KMST330P_StartDate_btn1').click();
	//2.
	KMST330P_fnTreeInit();

	KMST220P_treeData_1.transport.read();
	KMST220P_treeData_2.transport.read();
});

function KMST330P_fnDateInit(){
	$(".formAlign button").click(function(){
		$(".formAlign button").removeClass('selected');
		$(this).addClass('selected');
	});

	$("#KMST330P_StartDate").kendoDatePicker({
		value: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
		format: "yyyy-MM-dd",
		change: function (e) {
			$("#KMST330P_EndDate").data("kendoDatePicker").min(e.sender.value());
		}
	});

	$("#KMST330P_EndDate").kendoDatePicker({
		value: new Date(),
		format: "yyyy-MM-dd",
		change: function (e) {
			$("#KMST330P_StartDate").data("kendoDatePicker").max(e.sender.value());
		}
	});

	CMMN_SEARCH_DATE["KMST330P_StartDate"] = {
		startDateDp: $("#KMST330P_StartDate").data("kendoDatePicker"),
		endDateDp: $("#KMST330P_EndDate").data("kendoDatePicker"),
		initMaxDate: $("#KMST330P_StartDate").data("kendoDatePicker").max(),
		initMinDate: $("#KMST330P_EndDate").data("kendoDatePicker").min(),
		fnSetEnable: function () {
			CMMN_SEARCH_DATE["KMST330P_StartDate"].startDateDp.max(CMMN_SEARCH_DATE["KMST330P_StartDate"].initMaxDate);
			CMMN_SEARCH_DATE["KMST330P_StartDate"].endDateDp.min(CMMN_SEARCH_DATE["KMST330P_StartDate"].initMinDate);
			CMMN_SEARCH_DATE["KMST330P_StartDate"].startDateDp.enable();
			CMMN_SEARCH_DATE["KMST330P_StartDate"].endDateDp.enable();
			CMMN_SEARCH_DATE["KMST330P_StartDate"].startDateDp.value("");
			CMMN_SEARCH_DATE["KMST330P_StartDate"].endDateDp.value("");
		},
		fnSetDate: function (range) {
			CMMN_SEARCH_DATE["KMST330P_StartDate"].startDateDp.max(CMMN_SEARCH_DATE["KMST330P_StartDate"].initMaxDate);
			CMMN_SEARCH_DATE["KMST330P_StartDate"].endDateDp.min(CMMN_SEARCH_DATE["KMST330P_StartDate"].initMinDate);
			CMMN_SEARCH_DATE["KMST330P_StartDate"].startDateDp.readonly();
			CMMN_SEARCH_DATE["KMST330P_StartDate"].endDateDp.readonly();
			var today = new Date();
			var fromDate = new Date();
			fromDate.setDate(fromDate.getDate() + Number(range));
			CMMN_SEARCH_DATE["KMST330P_StartDate"].startDateDp.value(fromDate);
			CMMN_SEARCH_DATE["KMST330P_StartDate"].startDateDp.trigger("change");
			CMMN_SEARCH_DATE["KMST330P_StartDate"].endDateDp.value(today);
			CMMN_SEARCH_DATE["KMST330P_StartDate"].endDateDp.trigger("change");
		},
		fnSetMonth: function (range) {
			CMMN_SEARCH_DATE["KMST330P_StartDate"].startDateDp.max(CMMN_SEARCH_DATE["KMST330P_StartDate"].initMaxDate);
			CMMN_SEARCH_DATE["KMST330P_StartDate"].endDateDp.min(CMMN_SEARCH_DATE["KMST330P_StartDate"].initMinDate);
			CMMN_SEARCH_DATE["KMST330P_StartDate"].startDateDp.readonly();
			CMMN_SEARCH_DATE["KMST330P_StartDate"].endDateDp.readonly();
			var today = new Date();
			var fromDate = new Date(today.getFullYear(), today.getMonth() + Number(range), today.getDate());
			CMMN_SEARCH_DATE["KMST330P_StartDate"].startDateDp.value(fromDate);
			CMMN_SEARCH_DATE["KMST330P_StartDate"].startDateDp.trigger("change");
			CMMN_SEARCH_DATE["KMST330P_StartDate"].endDateDp.value(today);
			CMMN_SEARCH_DATE["KMST330P_StartDate"].endDateDp.trigger("change");
		},
		fnSetMaxDate:function (){
			CMMN_SEARCH_DATE["KMST330P_StartDate"].startDateDp.max(CMMN_SEARCH_DATE["KMST330P_StartDate"].initMaxDate);
			CMMN_SEARCH_DATE["KMST330P_StartDate"].endDateDp.min(CMMN_SEARCH_DATE["KMST330P_StartDate"].initMinDate);

			// CMMN_SEARCH_DATE["KMST330P_StartDate"].startDateDp.readonly();
			// CMMN_SEARCH_DATE["KMST330P_StartDate"].endDateDp.readonly();

			let today = new Date();
			let toDate = new Date(2020, 0, 1);

			CMMN_SEARCH_DATE["KMST330P_StartDate"].startDateDp.value(toDate);
			CMMN_SEARCH_DATE["KMST330P_StartDate"].startDateDp.trigger("change");

			CMMN_SEARCH_DATE["KMST330P_StartDate"].endDateDp.value(today);
			CMMN_SEARCH_DATE["KMST330P_StartDate"].endDateDp.trigger("change");

		}
	}
}

function KMST330P_fnDateCss(obj) {
	for (const x of $(obj)[0].parentElement.children) {
		x.classList.remove("selected");
	}
	$(obj).addClass("selected");
}

function KMST330P_fnTreeInit(){
	KMST220P_treeData_1 = {
		transport: {
			read :function () {
				Utils.ajaxCall('/kmst/KMST200SEL01', JSON.stringify(KMST_constAuthParam()), function(data){
						$("#treeKMST330P_1").data("kendoTreeView").dataSource.data(KMST_fnTreeSet(KMST_fnTreeCheckListValid(data.list)));
					},null,null,null);
			}
		},
	}
	KMST220P_treeData_2 = {
		transport: {
			read :function () {
				Utils.ajaxCall('/cmmt/CMMT200SEL01', JSON.stringify(KMST_constAuthParam()), function(data){
					$("#treeKMST330P_2").data("kendoTreeView").dataSource.data(KMST_fnTreeSet(KMST_fnTreeCheckListValid(JSON.parse(JSON.parse(JSON.stringify(data.list))))));
				},null,null,null);
			}
		},
	}

	$("#treeKMST330P_1").kendoTreeView({
		autoScroll: true,
		dataTextField: ["ctgrNm"],
		checkboxes: {
			checkChildren: true
		},
		check: function (){
			KMST330P_KMSTSelectNode = [];
			KMST_fnCheckedNodeIds($("#treeKMST330P_1").data("kendoTreeView").dataSource.view(), KMST330P_KMSTSelectNode);
		}
	}).data('kendoTreeView');

	$("#treeKMST330P_2").kendoTreeView({
		autoScroll: true,
		dataTextField: ["ctgrNm"],
		checkboxes: {
			checkChildren: true
		},
		check: function (){
			KMST330P_CMMTSelectNode = [];
			KMST_fnCheckedNodeIds($("#treeKMST330P_2").data("kendoTreeView").dataSource.view(), KMST330P_CMMTSelectNode);
		}
	}).data('kendoTreeView');
}

//Button Event - 검색 적용 버튼 클릭
function KMST330P_fnApplyData() {

	let type ="";
	if($("#KMST330P_All").prop('checked')){	type = "ALL";}
	else if($("#KMST330P_title").prop('checked')){	type = "TITLE";}
	else if($("#KMST330P_Text").prop('checked')){	type = "CONTENT";}

	let kmstlist,cmmtlist;
	if(JSON.stringify(KMST330P_CMMTSelectNode) === JSON.stringify([]) &&
		JSON.stringify(KMST330P_KMSTSelectNode) === JSON.stringify([])){
		kmstlist = $("#treeKMST330P_1").data("kendoTreeView").dataSource.view();
		cmmtlist = $("#treeKMST330P_2").data("kendoTreeView").dataSource.view();

	}else{
		kmstlist =KMST330P_KMSTSelectNode;
		cmmtlist =KMST330P_CMMTSelectNode;
	}

	let data = {
		stradtDate :$('#KMST330P_StartDate').val(),
		endDate :$('#KMST330P_EndDate').val(),
		type : type,
		CMMTlist : cmmtlist,
		KMSTlist : kmstlist,
		usrlist :KMST330P_UsrList,
	};

	Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(data);
}

//Button Event - 옵션 초기화 버튼 클릭
function KMST330P_fnClearData() {
	KMST220P_treeData_1.transport.read();
	KMST220P_treeData_2.transport.read();

	$('#KMST330P_StartDate_btn1').click();
	$('#KMST330P_All').prop('checked', true);

	if(KMST330P_UsrList.length >0){
		while ( $('#KMST330P_UsrList')[0].hasChildNodes()){
			$('#KMST330P_UsrList')[0].removeChild($('#KMST330P_UsrList')[0].firstChild);
		}
		let il ='<li class="nodata" id="KMST330P_UsrListNo"><mark class="k-icon k-i-user"></mark>선택한 등록자가 없습니다.</li>'
		$('#KMST330P_UsrList').append(il);
	}


	KMST330P_CMMTSelectNode=[];
	KMST330P_KMSTSelectNode = [];
	KMST330P_UsrList =[];
}

//Button Event - 등록자 찾기 버튼 클릭
function  KMST330P_fnFindUser(){
	Utils.setCallbackFunction("KMST330P_UsrCallBack", function (item) {
		$('#KMST330P_UsrListNo').remove();

		if(item.length>0){
			for(let usr of item){
				let count = KMST330P_UsrList.filter(x => x.usrId === usr.usrId).length;
				if(count===0){
					let il = '<li>'+usr.orgNm+'-'+usr.usrNm+'<button class="k-chip-icon k-icon k-i-x" onclick="KMST330P_fnDeleteUser(this)" title="삭제"></button></li>';
					KMST330P_UsrList.push(usr);
					$('#KMST330P_UsrList').append(il);
				}
			}
		}else{
			let il ='<li class="nodata" id="KMST330P_UsrListNo"><mark class="k-icon k-i-user"></mark>선택한 등록자가 없습니다.</li>'
			$('#KMST330P_UsrList').append(il);
		}
	});
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM212P", "SYSM212P",410, 810, {callbackKey: "KMST330P_UsrCallBack"});
}
//Button Event - 등록자 지우기 버튼 클릭
function KMST330P_fnDeleteUser(obj){
	let name = $(obj)[0].parentNode.textContent.split('-');
	KMST330P_UsrList = KMST330P_UsrList.filter(x => (x.usrNm !== name[1]) | (x.orgNm !== name[0]));//&& x.orgNm !== name[0]);
	$(obj)[0].parentNode.remove();

	if(KMST330P_UsrList.length<0){
		let il ='<li class="nodata" id="KMST330P_UsrListNo"><mark class="k-icon k-i-user"></mark>선택한 등록자가 없습니다.</li>'
		$('#KMST330P_UsrList').append(il);
	}
}