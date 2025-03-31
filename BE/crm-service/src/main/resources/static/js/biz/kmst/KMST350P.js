var KMST350P_Component = new Array(2);
var KMST350P_Combo = new Array(1);
var KMST350P_SelectNode;
var KMST350P_tenantId;
var KMST350P_isSearch =false;
var KMST350P_SearchData;
$(document).ready(function () {

	/*init object*/
	for(let i=0; i<KMST350P_Component.length; i++) {
		KMST350P_Component[i]={
			instance: {},
			currentItem: {},
			dataSource : {},
			currentCellIndex : new Number(),
			currentRowIndex: new Number(),
			selectedItems: [],
			checkedRows: [],
		}
	}

	KMST350P_tenantId = Utils.isNull(Utils.getUrlParam('tenantId')) ? GLOBAL.session.user.tenantId : Utils.getUrlParam('tenantId');

	KMST350P_fnCtgrCdInit();

	KMST350P_fnTreeInit();
});

function KMST350P_fnCtgrCdInit(){
	let param ={
		tenantId : KMST350P_tenantId,
		orgCd : GLOBAL.session.user.orgCd,
		usrGrdCd : GLOBAL.session.user.usrGrd,
		usrId : GLOBAL.session.user.usrId
	};
	Utils.ajaxSyncCall('/kmst/KMST200SEL01', JSON.stringify(param), function(data){
		KMST350P_Component[0].dataSource = KMST_fnTreeSetCount(KMST_fnTreeCheckListValid(data.list));
		KMST350P_Combo[0] =Utils.setKendoComboBoxCustom(data.list.filter(x => x.prsLvl===1), "#KMST350P_ctgrCombo", "ctgrNm", "ctgrNo","","선택");
		// KMST350P_Combo[0].bind("change", CMHB211P_fnOrgComboChange);
	},false,false,false);
}

function KMST350P_fnTreeInit(){

	KMST350P_Component[0].instance = $('#treeKMST350P_Ctgr').kendoTreeView({
		dataSource : KMST350P_Component[0].dataSource,
		autoScroll: true,
		template: function(item) {
			if (item.item.case != 0) {
				return item.item.ctgrNm + ' <span class="fontRed">(' + item.item.case + ')</span>';
			} else {
				return item.item.ctgrNm;
			}
		},
		dataTextField: ["ctgrNm"],

		select: function(e) {
			if(KMST350P_isSearch){
				let ctgrNo =this.dataItem(e.node).id;
				let ctgrNm =this.dataItem(e.node).ctgrNm;
				let kmstlist = KMST350P_SearchData.kmstResult.hits.hits;
				let kmst = kmstlist.filter(x=>x._source.ctgrMgntNo == ctgrNo.toString());
				let list = [];
				kmst.map(x=>{
					let temp = {
						ctgrNo : ctgrNo,
						ctgrNm : ctgrNm,
						cntntsNo : x._source.blthgMgntNo,
						cntntsTite : x._source.title,
						moktiPrsLvl :0,
						moktiNo :null,
						moktiTite :null,
						hgrkMoktiNo : 0
					};
					list.push(JSON.parse(JSON.stringify(temp))); //깊은복사
					x._source.mokti.forEach(y=>{
						temp.moktiPrsLvl = y.moktiPrsLvl;
						temp.moktiNo = y.moktiNo;
						temp.moktiTite = $(Utils.htmlDecode(y.moktiTite))[0].textContent;
						temp.hgrkMoktiNo =y.hgrkMoktiNo;
						list.push(JSON.parse(JSON.stringify(temp))); //깊은복사
					})
				});
				KMST350P_Component[1].instance.dataSource.data(KMST350P_fnTreeSetting(list));
			}else{
				let param = {
					tenantId : KMST350P_tenantId
					,ctgrNo : this.dataItem(e.node).id
				};
				KMST350P_SelectNode = []; //카테고리선택시 초기화
				let ctgrNm =this.dataItem(e.node).ctgrNm;
				Utils.ajaxCall('/kmst/KMST350SEL01',  JSON.stringify(param), function(data){
					let array = [];
					data.cntnsList.forEach(x => {
						x.moktiNo=null;
						x.ctgrNm =ctgrNm;
						array.push(x);
						data.mokitList.filter(y => y.cntntsNo === x.cntntsNo).forEach(x => {
							x.moktiTite = $(Utils.htmlDecode(x.moktiTite))[0].textContent;
							x.ctgrNm =ctgrNm;
							array.push(x)
						});
					});
					KMST350P_Component[1].instance.dataSource.data(KMST350P_fnTreeSetting(array));
				});
			}
		}
	}).data("kendoTreeView");

	KMST350P_Component[1].instance = $('#treeKMST350P_Cntnts').kendoTreeView({
		dataSource : [],
		autoScroll: true,
		checkboxes: { checkChildren: true},   //단일시 주석
		template: function(item) {
			let ctgrNo = item.item.id.split('_');
			if(ctgrNo.length > 1){
				return '('+ctgrNo[1]+') '+item.item.title;
			}else{
				return '('+ctgrNo[0]+') '+item.item.title;
			}
		},
		dataTextField: ["title"],
		check: function(e) {
			let treeView = $("#treeKMST350P_Cntnts").data("kendoTreeView");
			KMST350P_SelectNode = [];
			KMST350P_fnCheckedNodeIds(treeView.dataSource.view(), KMST350P_SelectNode);
		}
	}).data("kendoTreeView");
}

/*2번 트리 데이터 생성*/
function KMST350P_fnTreeSetting(list) {
	let MappedArr = [];
	for (let item of list) {
		let temp ={};
		temp.ctgrNo = item.ctgrNo;
		temp.ctgrNm = item.ctgrNm;
		temp.cntntsNo = item.cntntsNo;

		if(item.moktiPrsLvl == 0){
			temp.id =item.cntntsNo.toString();
			temp.hgrkCntntsNo = null
			temp.expanded =true;
		}else if(item.moktiPrsLvl == 1){
			temp.moktiNo = item.moktiNo;
			temp.id =item.cntntsNo+"_"+item.moktiNo;
			temp.hgrkCntntsNo =item.cntntsNo.toString();
		}else{
			temp.moktiNo = item.moktiNo;
			temp.id =item.cntntsNo+"_"+item.moktiNo;
			temp.hgrkCntntsNo =item.cntntsNo+"_"+item.hgrkMoktiNo;
		}
		if (item.moktiNo == null) {
			temp.title = item.cntntsTite;
		} else {
			temp.title = item.moktiTite;
			temp.cntntsTite = item.cntntsTite;
		}
		MappedArr.push(temp);
	}
	return Utils.CreateTreeDataFormat(MappedArr,"hgrkCntntsNo");
}
/*2번 트리 선택 데이터 저장*/
function KMST350P_fnCheckedNodeIds(nodes, checkedNodes) {
	nodes.forEach(item =>{
		if (item.checked) {
			let obj = {
				title 		: item.title,
				ctgrNo		: item.ctgrNo,
				ctgrNm 		: item.ctgrNm,
				cntntsNo 	: item.cntntsNo,
				moktiNo 	: item.moktiNo == undefined ? 0 : item.moktiNo,
				cntntsTite : item.cntntsTite
			};
			checkedNodes.push(obj);
		}
		if (item.hasChildren) {
			KMST350P_fnCheckedNodeIds(item.children.view(), checkedNodes);
		}
	});
}

/*카테고리 트리 전체 열기*/
$('#KMST350P_treeToggleCtgr').on('click', function(){
	if($(this).is(':checked')) KMST350P_Component[0].instance.expand('.k-item');
	else  KMST350P_Component[0].instance.collapse('.k-item');
	$(this).prop("checked", $(this).is(':checked'));
});
/*카테고리 트리 전체 열기*/
$('#KMST350P_treeToggleCntnts').on('click', function(){
	if($(this).is(':checked')) KMST350P_Component[1].instance.expand('.k-item');
	else  KMST350P_Component[1].instance.collapse('.k-item');
	$(this).prop("checked", $(this).is(':checked'));
});

/*검색 버튼 클릭*/
function KMST350P_fnDetailSearch(){
	let text = $('#KMST350P_srcText').val();
	let type = $("input[type=radio][name=KMST350P_Radio]:checked").val();

	let ctgrNolist =[];
	if(KMST350P_Combo[0].value() == ""){ //선택안함 전체 카테고리 검색
		KMST350P_fnCheckedCategory(KMST350P_Component[0].dataSource,ctgrNolist);
	}else{ //선택함 선택 카테고리 하위만 검색
		let item = KMST350P_Component[0].dataSource.find(x=>x.id==KMST350P_Combo[0].value());
		KMST350P_fnCheckedCategory([item],ctgrNolist);
	}

	let param = {
		tenantId : KMST350P_tenantId
		,searchType : type
		,searchText : text
		,searchStartDate : new Date('2020-01-01').toISOString().substring(0,10)
		,searchEndDate: new Date().toISOString().substring(0,10)
		,regrIds : []
		,ctgrNo : ctgrNolist
		,ctgrMgntNo : []
	};

	Utils.ajaxCall("/kmst/KMST300SEL01",JSON.stringify(param),function (data){
		let item =JSON.parse(JSON.parse(JSON.stringify(data.list)));

		KMST350P_isSearch = true;
		let kmst = KMST_fnTreeSetCount(KMST_fnTreeCheckListValid(item.kmstTreeList));
		for (const obj of kmst) {
			KMST350P_fnReduce(obj);
		}
		let result = kmst.filter(obj=>obj.items.length > 0);
		KMST350P_Component[0].instance.dataSource.data(result);
		KMST350P_SearchData = item;

	},null,null,null);
}

function KMST350P_fnReduce(tree) {
	if (!tree) return {};
	if (!tree.items) return tree.case !== 0 ? tree : {};
	tree.items = tree.items.filter((child) => child.case !== 0)
		.map((child) => KMST350P_fnReduce(child))
	return tree;
}

function KMST350P_fnCheckedCategory(nodes, checkedNodes){
	nodes.forEach(item => {
		checkedNodes.push(item.id);
		if (item.items.length > 0) {
			KMST350P_fnCheckedCategory(item.items, checkedNodes);
		}
	});
}

function KMST350P_fnSelectClick(){
	if(KMST350P_SelectNode.length < 0){
		Utils.alert("선택된 항목이없습니다.");
		return;
	}
	Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(KMST350P_SelectNode);
	window.close();
}