/***********************************************************************************************
 * Program Name : 조직관리(SYSM130M.js)
 * Creator      : djjung
 * Create Date  : 2022.01.25
 * Description  : 조직관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.01.25     djjung           최초작성
 ************************************************************************************************/

var SYSM130M_DataSource,SYSM130M_commCodeList;
var SYSM130M_EtcCombo;
var SYSM130_Component=new Array(3); // 0 : grid, 1 : tree 2: ectGrid
// var SYMS130_LvlComboBox;
var SYSM131P_OpenParam={}
var SYSM131P_OpenState = { Create :"C" ,Update : "U" }
var SYSM131P_RemoveItem =[];

$(document).ready(function () {

	/*init object*/
	for(let i=0; i<SYSM130_Component.length; i++) {
		SYSM130_Component[i]={
			instance: {},
			currentItem: {},
			dataSource : {},
			currentCellIndex : new Number(),
			currentRowIndex: new Number(),
			selectedItems: [],
			checkedRows: [],
		}
	}

	SYSM130M_fnCommCdInit();

	SYSM130M_fnGridInit();

	SYSM130M_fnTreeInit();

	SYSM130M_fnDefaultHightSetting();
	$(window).on({'resize': function() {SYSM130M_fnDefaultHightSetting();}});


	SYSM130M_EtcCombo.enable(false);

	const SYSM130M_fnGridClear = () =>{
		if(SYSM130_Component[0].instance.select().length !=0){
			SYSM130_Component[0].instance.clearSelection();
		}
		SYSM130_Component[0].currentItem = new Object();
		SYSM130_Component[0].instance.dataSource.data([]);
		SYSM130_Component[1].instance.dataSource.data([]);
		SYSM130_Component[2].instance.dataSource.data([]);
		$('#SYSM130M input[name=SYSM130_orgDvCdSel]').data("kendoComboBox").select(0);
		$('#SYSM130M input[name=SYSM130M_orgNmSel]').val("");
		$('#SYSM130M input[name=SYSM130M_orgStCdSel]').data("kendoComboBox").select(0);
		$('#SYSM130M input[name=SYSM130M_TreeTogle]').prop('checked', false);
		SYSM130M_EtcCombo.select(0);
	};

	CMMN_SEARCH_TENANT["SYSM130M"].fnInit(null,SYSM130M_fnSerachOrg,SYSM130M_fnGridClear);

});
/*공통코드 호출*/
function SYSM130M_fnCommCdInit(){


	let parm = JSON.stringify({"codeList":[
			{"mgntItemCd": "C0241"},{"mgntItemCd": "C0003"},{"mgntItemCd": "C0400"},{"mgntItemCd": "C0401"},
			{"mgntItemCd": "C0402"},{"mgntItemCd": "C0403"},{"mgntItemCd": "C0404"},{"mgntItemCd": "C0405"},
		]});

	Utils.ajaxSyncCall('/comm/COMM100SEL01', parm,function(data){
		SYSM130M_commCodeList = JSON.parse(JSON.parse(JSON.stringify(data.codeList)));
		Utils.setKendoComboBox(SYSM130M_commCodeList, "C0003", '#SYSM130M input[name=SYSM130M_orgStCdSel]', "");
		Utils.setKendoComboBox(SYSM130M_commCodeList, "C0241", '#SYSM130M input[name=SYSM130_orgDvCdSel]', "");

		SYSM130M_EtcCombo = Utils.setKendoComboBox(SYSM130M_commCodeList, "C0241", '#SYSM130M input[name=SYSM130M_ectDvCd]', "","선택");
		SYSM130M_EtcCombo.bind("change", function(){
			let value = this.value();
			if(value == ""){
				$('#SYSM130M button[name=SYSM130M_ectAdd]').prop('disabled',true);
			}else{
				$('#SYSM130M button[name=SYSM130M_ectAdd]').prop('disabled',false);
				let data = this.dataSource.view().find(x=> x.value == this.value());
				SYSM131P_OpenParam.mgntItemCd =data.mgntItemCd;
				SYSM131P_OpenParam.comCd =data.comCd;
				SYSM131P_OpenParam.comCdNm =data.comCdNm;
			}
		});
		SYSM130M_EtcCombo.enable(false);

	},null,null,null );
}
/*Grid Init*/
function SYSM130M_fnGridInit(){
	/*Grid 1 - dataSource Init*/
	SYSM130_Component[0].dataSource = {
		transport: {
			read : function (param) {
				if(Utils.isNull(param.orgDvCd)&& Utils.isNull(param.orgNm)&& Utils.isNull(param.orgStCd)){
					SYSM130_fnBtnAddEnableDisable(false,false); //shnpark 20251022 처음에 접근시 추가버튼 아래버튼 둘다 비활성화 , 조회시에도 비활성화
					SYSM130_fnBtnTreeEnableDisable(false,false);
					SYSM130_fnBtnRowEnableDisable(false,false,false,false);
				}
				Utils.ajaxCall('/sysm/SYSM130SEL01', JSON.stringify(param), function(data){
						SYSM130_Component[0].instance.dataSource.data(data.grid);
						if(data.grid.length !==0){
							$('#SYSM130M input[name=SYSM130_tenantLvl]').val(data.grid[0].orgLvlCd);
							//검색 조건에따라 트리 생성/미생성
							if(Utils.isNull(param.orgStCd)||param.orgStCd=="Y" ){
								SYSM130_Component[1].instance.dataSource.data(SYSM130_fnSubChangeTreeData(data.grid.filter(x => x.orgStCd =="Y" ||x.orgStCd =="N" )));
							}else{
								SYSM130_Component[1].instance.dataSource.data([]);
							}
						}

					},
					window.kendo.ui.progress($("#grdSYSM130M"),true),window.kendo.ui.progress($("#grdSYSM130M"),false),false);
			}
		},
		schema : {
			type: "json",
			model: {
				id : 'orgCd',
				fields: {
					radio	: { field: "radio", type: "string" ,  editable: false},
					lstCorprNm	: { field: "lstCorprNmS", type: "string" ,  editable: false},
				}
			}
		}
	}

	/*Grid 1 - Init*/
	SYSM130_Component[0].instance = $("#grdSYSM130M").kendoGrid({
		dataSource : SYSM130_Component[0].dataSource,
		autoBind: false,
		noRecords: { template: '<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>' },
		selectable: "row",
		columns: [
			{
				width: 80, field: "radio", title: "선택", template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',  editable: false
			},
			{
				width: 100, field: "orgCd", title: SYSM130M_langMap.get("SYSM130M.orgCd"),
			},
			{
				width: 200, field: "orgDvCd", title: "조직구분",
				template: function (dataItem) { return Utils.getComCdNm(SYSM130M_commCodeList, "C0241", dataItem.orgDvCd);},
				editor: function (container, options) {
					let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);
					Utils.setKendoComboBox(SYSM130M_commCodeList, "C0241", $select, "", "선택").bind("change", function (e) {
						let dataItem = SYSM130_Component[0].instance.dataItem(e.sender.element.closest("tr"));
						dataItem.set(options.field, e.sender.value());
						SYSM130_Component[0].instance.refresh();
					});
				}
			},
			{
				headerAttributes: {"class":"neceMark"}, attributes: {"class": "k-text-left"}, maxlength : 30,
				field: "orgNm",	title: SYSM130M_langMap.get("SYSM130M.orgNm"),
			},
			{
				headerAttributes: {"class": "displayNon"},attributes: {"class": "bdNoneRight"}, width: 40,
				template: function (dataItem){
					if(dataItem.hgrkOrgCd == null) return "";
					else return "<button class='btnRefer_default icoType icoComp_zoom' aria-label='"+dataItem.orgCd +"' onclick='SYSM130_fnPopup_SYSM213P(this)'> </button>";
				}
			},
			{
				headerAttributes: {"colspan": 2 ,"class":"neceMark"},attributes: {"class": "k-text-left"},
				width: 250,	field: "hgrkOrgNm", title: SYSM130M_langMap.get("SYSM130M.hgrkOrgNm"),
				template: function (dataItem){
					if(dataItem.hgrkOrgCd == null) return "";
					else return "("+dataItem.hgrkOrgCd+")"+dataItem.hgrkOrgNm;
				}
			},
			{
				width: 100,	field: "srtSeq", title: "정렬순서",
			},
			/*{
				headerAttributes: {"class":"neceMark"},
				width: 100,	field: "kmsDispYn",	title: "KMS 표시여부",
				template: function (dataItem){return Utils.getComCdNm(SYSM130M_commCodeList, "C0003", dataItem.kmsDispYn);},
				editor: function (container, options) {
					let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);
					let temp= Utils.setKendoComboBox(SYSM130M_commCodeList, "C0003", $select, "", "선택");
					temp.dataSource.remove(temp.dataSource.at(3));
					temp.bind("change", function (e) {
						let dataItem = SYSM130_Component[0].instance.dataItem(e.sender.element.closest("tr"));
						if(e.sender.value() !== 'Y'){
							dataItem.set("kmsCtgrCd", '');
							dataItem.set("kmsCtgrNm", '');
						}
						dataItem.set(options.field, e.sender.value());
						SYSM130_Component[0].instance.refresh();
					});
				}
			},
			{
				headerAttributes: {"class":"neceMark"},	width: 0, field: "kmsCtgrCd",
			},
			{
				headerAttributes: {"colspan": 2,"class":"neceMark"},attributes: {"class": "bdNoneRight k-text-left"},
				width: 100,	field: "kmsCtgrNm",	title: "KMS 카테고리",
				template: function(dataItem){
					if(dataItem.kmsDispYn ==='Y'&& dataItem.ctgrNo !== null ) {return dataItem.kmsCtgrNm;}
					else {return "";}
				}
			},
			{
				headerAttributes: {"class": "displayNon"},width: 40,
				template: function(dataItem){
					if(dataItem.kmsDispYn ==='Y') 	return "<button class='btnRefer_default icoType icoComp_zoom' onclick='SYSM130_fnPopup_KMST220P()'> </button>"
					else return"<button class='btnRefer_default icoType icoComp_zoom' disabled onclick='SYSM130_fnPopup_KMST220P()'> </button>"
				}
			},
			{
				headerAttributes: {"class":"neceMark"},	attributes: {"class": "k-text-left"},
				width: 100,	field: "extnLinkCd",title: SYSM130M_langMap.get("SYSM130M.extnLinkCd"),

			},*/
			{
				width: 120, field: "orgStCd", title: SYSM130M_langMap.get("SYSM130M.orgStCd"),
				template: function (dataItem) {return Utils.getComCdNm(SYSM130M_commCodeList, "C0003", dataItem.orgStCd);},
				editor: function (container, options) {
					let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);
					let temp= Utils.setKendoComboBox(SYSM130M_commCodeList, "C0003", $select, "", "선택");
					temp.bind("change", function (e) {
						let dataItem = SYSM130_Component[0].instance.dataItem(e.sender.element.closest("tr"));

						let datas = SYSM130_Component[0].instance.dataSource.data();
						let findHgrk = Utils.queryObjectsByConditions(datas , {'orgCd' : dataItem.hgrkOrgCd} , 'find')
						if(findHgrk.orgStCd == 'N'){
							Utils.alert('상위조직이 사용안함 상태이면 상태를 변경할 수 없습니다.')
							dataItem.set(options.field,findHgrk.orgStCd);
							SYSM130_Component[0].instance.refresh();
							return
						}else if(findHgrk.orgStCd == 'D'){
							Utils.alert('상위조직이 폐기 상태이면 상태를 변경할 수 없습니다.')
							dataItem.set(options.field,findHgrk.orgStCd);
							SYSM130_Component[0].instance.refresh();
							return
						}
						dataItem.set(options.field, e.sender.value());
						SYSM130_Component[0].instance.refresh();
					});
				}
			},
			{ field: "oriOrgStCd", title: "상태 원본", hidden: true
			},
			{
				width: 120, field: "lstCorprNm", title: SYSM130M_langMap.get("SYSM130M.lstCorprNm"), editable: false

			},
			{
				width: 120,field: "lstCorcDtm",title: SYSM130M_langMap.get("SYSM130M.lstCorcDtm"),
				template : '#=kendo.format("{0:yyyy-MM-dd HH:mm}",new Date(lstCorcDtm))#'
			}
		],
		change: function(e) {
			let item = this.dataItem(this.select()[0]);// 선택된 데이터

			SYSM130M_EtcCombo.select(0);
			$('#SYSM130M button[name=SYSM130M_ectAdd]').prop('disabled',true);
			$('#SYSM130M button[name=SYSM130M_ectRemove]').prop('disabled',true);
			$('#SYSM130M button[name=SYSM130M_ectSave]').prop('disabled',true);
			if(this.select().length>0){//ROW 선택 했을떄
				SYSM130_fnBtnTreeEnableDisable(false,false);//생성버튼
				if(this.dataSource.data().map(e=>e.orgStCd===null).find(e=>e===true)){//기존 ROW 생성중인줄이 있는 경우
					SYSM130_fnBtnAddEnableDisable(false,false);
				}else{//기존 ROW 생성중인것이 없을 경우
					if(item.prsLvlCd ==="L0"){//선택한 ROW의 레벨코드가 MIN 레벨인 경우
						SYSM130_fnBtnAddEnableDisable(false,true);
					}else if(item.prsLvlCd === $('#SYSM130M input[name=SYSM130_tenantLvl]').val()){//선택한 ROW의 레벨코드가 MAX 레벨인 경우
						SYSM130_fnBtnAddEnableDisable(true,false);
					}else{//해당사항 없는경우
						SYSM130_fnBtnAddEnableDisable(true,true);
					}
				}
				//상태변경버튼
				if(item.orgStCd==="Y") {//선택한 ROW의 조직코드상태 Y인 경우
					SYSM130_fnBtnRowEnableDisable(true,false,false,true);
				}else if(item.oriOrgStCd==="N" && item.orgStCd==="N") {//선택한 ROW의 조직코드상태 N인 경우
					SYSM130_fnBtnRowEnableDisable(true,true,true,false);
				}else if(item.orgStCd==="D") {//선택한 ROW의 조직코드상태 D인 경우
					SYSM130_fnBtnRowEnableDisable(false,false,false,false);
				}else{//선택한 ROW의 조직코드상태인 경우
					SYSM130_fnBtnRowEnableDisable(true,false,false,false);
				}

				//기타항목 그리드 조회
				if(Utils.isNotNull(item.orgCd)){
					SYSM130M_EtcCombo.enable(true);
					let param ={tenantId : item.tenantId , orgCd: item.orgCd};
					//SYSM130_Component[2].instance.dataSource.transport.read(param);

					//기타항목 팝업 호출용 데이터 적제
					SYSM131P_OpenParam.tenantId=item.tenantId;
					SYSM131P_OpenParam.orgCd=item.orgCd;
					SYSM131P_OpenParam.orgNm=item.orgNm;

					let subcd = Utils.getComCdSubMgntitem(SYSM130M_commCodeList,"C0241",item.orgDvCd);
					Utils.changeKendoComboBoxDataSource(SYSM130M_commCodeList, subcd,SYSM130M_EtcCombo, "","선택");
				}else{
					SYSM130M_EtcCombo.enable(false);
					//SYSM130_Component[2].instance.dataSource.data([]);
				}

			}else{//ROW 선택 안할경우
				SYSM130_fnBtnAddEnableDisable(true,true);
				SYSM130_fnBtnTreeEnableDisable(false,false);
				SYSM130_fnBtnRowEnableDisable(false,false,false,false);

				$('#SYSM130M input[name=SYSM130M_ectDvCd]').data("kendoComboBox").enable(false);
			}
		},
		/* 더블클릭 셀수정 금지*/
		edit: function (e) {
			if(SYSM130_Component[0].currentCellIndex === 0 || SYSM130_Component[0].currentCellIndex === 1 ||
				SYSM130_Component[0].currentCellIndex === 4 ||SYSM130_Component[0].currentCellIndex === 5  ||
				SYSM130_Component[0].currentCellIndex === 6 ||SYSM130_Component[0].currentCellIndex === 9 ||
				SYSM130_Component[0].currentCellIndex === 13 ||SYSM130_Component[0].currentCellIndex === 14 ){
				this.closeCell();
			}

			$("#SYSM130M #orgNm").on("input", function() {
				$(this)[0].value = Utils.removeXSS($(this)[0].value);
			});
		},
		dataBound: function (e) {
			let grid = e.sender;
			let rows = grid.items();
			rows.off("click").on("click", function (e) {
				let dataItem = grid.dataItem(this);
				let cellIndex = $(e.target).index();
				SYSM130_Component[0].currentItem = dataItem;
				SYSM130_Component[0].currentCellIndex = cellIndex;
			});
		},
	}).data("kendoGrid");

	$("#grdSYSM130M").data("kendoGrid").hideColumn("kmsCtgrCd"); //hidden Colum
	Utils.setKendoGridDoubleClickAction('#grdSYSM130M');

	/*Grid 2 - dataSource Init*/
	SYSM130_Component[2].dataSource = {
		transport: {
			read : function (param) {
				if(Utils.isNull(param.data)){//미조회 상태에서 해더클릭시 자동조회 방지
					Utils.ajaxCall('/sysm/SYSM131SEL01', JSON.stringify(param), function(data){
							SYSM130_Component[2].instance.dataSource.data([]);
							SYSM130_Component[2].instance.dataSource.data(data.result);
						},
						window.kendo.ui.progress($("#grdSYSM130M"),true),window.kendo.ui.progress($("#grdSYSM130M"),false),false);
				}else{
					window.kendo.ui.progress($("#grdSYSM130M"),false);//미조회 상태에서 해더클릭시 자동조회 방지
				}
			}
		}
	}

	/*Grid 2 - Init*/
	SYSM130_Component[2].instance = $("#grdSYSM130M_ect").kendoGrid({
		dataSource : SYSM130_Component[2].dataSource,
		autoBind: false,
		noRecords: { template: '<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>' },
		selectable: "row",
		// height : "300px",
		columns: [
			{ selectable: true, width: 40 },
			{ width: 100,	field: "mgntItemComcdNm",title: "기타항목 유형"},
			{
				attributes: {"class": "bdNoneRight"}, headerAttributes: {"colspan": 2},
				field: "etcItemTite", title: "기타항목 제목 ",
			},
			{
				width: 50, headerAttributes: {"class": "displayNon"},
				template: function (dataItem){
					let type =  '"'+SYSM131P_OpenState.Update+'"';
					return "<button class='btnRefer_default icoType icoComp_zoom' onclick='SYSM130M_fnEctAddClick("+type+","+dataItem.itemSeq+")'> </button>";
				}
			},
		],
		dataBound: function (e) {
			let grid = e.sender;
			let rows = grid.items();
			rows.off("click").on("click", function (e) {
				let dataItem = grid.dataItem(this);
				let cellIndex = $(e.target).index();
				SYSM130_Component[2].currentItem = dataItem;
				SYSM130_Component[2].currentCellIndex = cellIndex;
			});
		},
		change : function (e) {
			$('#SYSM130M button[name=SYSM130M_ectRemove]').prop('disabled',false);
			$('#SYSM130M button[name=SYSM130M_ectSave]').prop('disabled',false);
		}
	}).data("kendoGrid");

	//그리드 더블클릭 이벤트
	/*	$('#grdSYSM130M_ect tbody').on("dblclick", "td", function (e) {
            SYSM130M_fnEctAddClick(SYSM131P_OpenState.Update,SYSM130_Component[2].currentItem.itemSeq);
        });*/

	SYSM130_Component[2].instance.dataSource.data([]); //초기화
}
/*Tree Init*/
function SYSM130M_fnTreeInit(){
	SYSM130_Component[1].instance = $('#treeSYSM130M').kendoTreeView({
		dataTextField: ["orgNm"],
		select: function(e) {
			$('#SYSM130M button[name=SYSM130M_btnTreeDown]').prop('disabled',false);
			$('#SYSM130M button[name=SYSM130M_btnTreeUp]').prop('disabled', false);
			// tree test
			let objects = this.text(e.node);
			let data = e.sender.dataSource.view();
		},
		dataBound: function() {//   data 없을때
			if (this.dataSource.total() === 0){
				this.element.closest('.k-treeview').html('<div class="nodataMsg"><p>목록이 없거나 트리를 구성할수 없습니다.</p></div>');
			}
		},
		template: function(item){
			if(item.item.orgStCd == "Y"){
				return  item.item.orgNm;
			}else{
				return item.item.orgNm+' <span class="fontRed">('+Utils.getComCdNm(SYSM130M_commCodeList, "C0003", item.item.orgStCd)+')</span>';
			}
		},
	}).data("kendoTreeView");

}
/*컴포넌트 높이 리사이즈*/
function SYSM130M_fnDefaultHightSetting(){
	let screenHeight = $(window).height()- 210;

	if(SYSM130_Component[1].instance.wrapper){
		SYSM130_Component[1].instance.wrapper.css('height', screenHeight-182);   //(헤더+ 푸터+ 검색 )영역 높이 제외
	}
	if(SYSM130_Component[0].instance.element){
		SYSM130_Component[0].instance.element.find('.k-grid-content').css('height', screenHeight - 182);
	}
	if(SYSM130_Component[2].instance.element){
		SYSM130_Component[2].instance.element.find('.k-grid-content').css('height', screenHeight/10*3-170);   //   (헤더+ 푸터+ 검색 )영역 높이 440
	}
}
/*조직 목록 조회*/
function SYSM130M_fnSerachOrg(){

	if(Utils.isNull($('#SYSM130M input[name=SYSM130M_tenantId]').val())) {
		Utils.alert(SYSM130M_langMap.get("aicrm.message.tenantInfo"));
		return;
	}

	$('#SYSM130M input[name=SYSM130M_TreeTogle]').prop('checked', true);
	let parm = {
		tenantId 	: $('#SYSM130M input[name=SYSM130M_tenantId]').val(),
		orgDvCd 	: $('#SYSM130M input[name=SYSM130_orgDvCdSel]').val(),
		orgNm		: $('#SYSM130M input[name=SYSM130M_orgNmSel]').val(),
		orgStCd		: $('#SYSM130M input[name=SYSM130M_orgStCdSel]').val()
	}

	SYSM130_Component[0].instance.dataSource.transport.read(parm);
	let andLogic = [];


	//테넌트 아이디
	//조직구분
	//조직명
	//상태
	if(parm.tenantId != null && parm.tenantId != ""){
		andLogic.push({ field:"tenantId"   ,operator:"eq" ,value: parm.tenantId })
	}
	if(parm.orgDvCd != null && parm.orgDvCd != ""){
		andLogic.push({ field:"orgDvCd"   ,operator:"eq" ,value: parm.orgDvCd })
	}
	if(parm.orgNm != null && parm.orgNm != ""){
		andLogic.push({ field:"orgNm"   ,operator:"contains" ,value: parm.orgNm })
	}
	if(parm.orgStCd != null && parm.orgStCd != ""){
		andLogic.push({ field:"orgStCd"   ,operator:"eq" ,value: parm.orgStCd })
	}

	if(SYSM130_Component[0].instance.dataSource.data().length !==0){
		Utils.kendoGridFilter(SYSM130_Component[0].instance.dataSource ,andLogic , [{field:"add" , operator : "eq" , value: "add"}] )
	}
}
/*Button Event - 행추가 버튼*/
function SYSM130M_fnAddRow(){
	let select = SYSM130_Component[0].instance.select();
	let item = SYSM130_Component[0].instance.dataItem(select[0]);

	if(item.orgStCd == 'N'  || item.orgStCd == 'D'){
		Utils.alert('사용안함, 폐기 상태인 조직은 하위조직을 추가할 수 없습니다.');
		return
	}

	//행 추가 조건 확인
	if(SYSM130_Component[0].instance.dataSource.data().length==0){//최초생성시
		SYSM130_fnSubGridAddRow(0,	$('#SYSM130M input[name=SYSM130M_tenantId]').val(),null,$('#SYSM130M input[name=SYSM130M_tenantNm]').val(),"","L0",null,null,1);
		SYSM130_Component[0].instance.select("tr:eq(0)");
	}else{ //추가생성시
		if(select.length>0){// 데이터 선된 경우

			let data = SYSM130_Component[0].instance.dataSource.data()
			let selectIdx = Utils.queryObjectsByConditions(SYSM130_Component[0].instance.dataSource.data() , {orgCd : item.orgCd} , 'index')
			let idx = selectIdx[0]+1;
			const nextOrgCd = data
												.map(item => parseInt(item.orgCd)) // orgCd를 숫자로 변환
												.filter(num => !isNaN(num)) // 숫자가 아닌 값 제거
												.reduce((max, current) => Math.max(max, current), 0) + 1; // 최대값 + 1
				let nextSrtSeq = item.srtSeq + 1
				data.forEach(item => {
					if (item.srtSeq >= nextSrtSeq) {
						 item.set('srtSeq', item.srtSeq + 1);
					}
				});
			SYSM130_fnSubGridAddRow(idx,item.tenantId,nextOrgCd,null,"",item.prsLvlCd,item.hgrkOrgCd,item.hgrkOrgNm,nextSrtSeq);
			SYSM130_Component[0].instance.select("tr:eq("+idx+")");//추가한 행 선택
		}else{
			Utils.alert(SYSM130M_langMap.get("SYSM130M.Message.noSelectData"));
		}
	}
}
/*Button Event - 아래 추가 버튼*/
function SYSM130M_fnAddDownRow(){
	let select = SYSM130_Component[0].instance.select();
	let item = SYSM130_Component[0].instance.dataItem(select[0]);

	if(item.orgStCd == 'N'  || item.orgStCd == 'D'){
		Utils.alert('사용안함, 폐기 상태인 조직은 하위조직을 추가할 수 없습니다.');
		return
	}
	if(item.orgNm == null || item.orgNm == ''){
		Utils.alert(SYSM130M_langMap.get("SYSM130M.Message.noAddChild2"));
		return;
	}

	//선택된 행의 Lv
	if(SYSM130_Component[0].instance.dataSource.data().length==0){
		Utils.alert(SYSM130M_langMap.get("SYSM130M.Message.wrongApproach"));
	}else{
		if(select.length>0){// 데이터 선된 경우
			if(	$('#SYSM130M input[name=SYSM130_tenantLvl]').val().substring(1,2) > item.prsLvlCd.substring(1,2)){
				let prsLv = "L"+(Number(item.prsLvlCd.substring(1,2))+1);

				let data = SYSM130_Component[0].instance.dataSource.data()
				let selectIdx = Utils.queryObjectsByConditions(SYSM130_Component[0].instance.dataSource.data() , {orgCd : item.orgCd} , 'index')
				let idx = selectIdx[0]+1;
				const nextOrgCd = data
													.map(item => parseInt(item.orgCd)) // orgCd를 숫자로 변환
													.filter(num => !isNaN(num)) // 숫자가 아닌 값 제거
													.reduce((max, current) => Math.max(max, current), 0) + 1; // 최대값 + 1
				let nextSrtSeq = item.srtSeq + 1
				data.forEach(item => {
					if (item.srtSeq >= nextSrtSeq) {
						 item.set('srtSeq', item.srtSeq + 1);
					}
				});
				SYSM130_fnSubGridAddRow(idx,item.tenantId,nextOrgCd,null,"",prsLv,item.orgCd,item.orgNm,nextSrtSeq);
				SYSM130_Component[0].instance.select("tr:eq("+idx +")");//추가한 행 선택

			}else{
				Utils.alert(SYSM130M_langMap.get("SYSM130M.Message.noAddChild"));
			}
		}else{
			Utils.alert(SYSM130M_langMap.get("SYSM130M.Message.noSelectData"));
		}

	}
}
function SYSM130M_fnSaveData() {
	let grid = SYSM130_Component[0].instance;
	let data = grid.dataSource.data();
	let changes = [];
	let hasError = false;
	let errorMessage = '';

	data.forEach(item => {
		if (item.dirty || item.add == 'add') {
			if (Utils.isNull(item.orgStCd) | Utils.isNull(item.orgNm)) {
				hasError = true;
				if (Utils.isNull(item.orgNm)) {
					errorMessage = '조직 이름 을 입력해 주세요.';
				} else if (Utils.isNull(item.orgStCd)) {
					errorMessage = '상태 를 입력해 주세요.';
				}
				return;
			}

			let row = {
				orgCd :item.orgCd,
				tenantId: item.tenantId,
				orgCd: item.orgCd,
				orgDvCd: item.orgDvCd,
				orgNm: item.orgNm,
				prsLvlCd: item.prsLvlCd,
				hgrkOrgCd: item.hgrkOrgCd,
				srtSeq: item.srtSeq,
				extnLinkCd: item.extnLinkCd,
				orgStCd: item.orgStCd,
				kmsDispYn: item.kmsDispYn,
				kmsCtgrNo: item.kmsCtgrNo,
				lstCorprId: GLOBAL.session.user.usrId,
				lstCorprOrgCd: GLOBAL.session.user.orgCd,
				regrId : GLOBAL.session.user.usrId,
				regrOrgCd : GLOBAL.session.user.orgCd,
			};

			changes.push(row);
		}
	});

	if (hasError) {
		Utils.alert(errorMessage);
		return;
	}

	if (changes.length > 0) {
		Utils.ajaxCall('/sysm/SYSM130INS01', JSON.stringify(changes), function(response) {
			SYSM130M_fnSerachOrg();
			Utils.alert('저장이 완료되었습니다.');
		});
	} else {
		Utils.alert(SYSM130M_langMap.get("SYSM130M.Message.noSave"));
	}
}


/*Button Event - 삭제 버튼*/
function SYSM130M_fnDeleteData(){
	let item = SYSM130_Component[0].currentItem;
	if(item.childCnt > 0) {
		Utils.alert("하위 조직을 먼저 삭제해 주세요.");
		return;
	}

	Utils.confirm(SYSM130M_langMap.get("SYSM130M.Message.wantDelete"),function(){ //DB ROW 삭제
		if(Utils.isNull(item.orgStCd)){
			SYSM130_Component[0].instance.removeRow(SYSM130_Component[0].instance.select());
		}else{
			let row = { tenantId: item.tenantId,orgCd: item.orgCd};
			Utils.ajaxCall('/sysm/SYSM130DEL01', JSON.stringify(row),SYSM130M_fnSerachOrg);
		}
	});
}
/* Tree Togle Evnet - 트리 토글 버튼*/
function SYSM130M_fnTreeTogle(item){
	var treeView = $("#treeSYSM130M").data("kendoTreeView");

	if ($(item).is(':checked')) {
		treeView.expand(".k-item");
		$(item).prop("checked", true);
	} else {
		treeView.collapse(".k-item");
		$(item).prop("checked", false);
	}
}
/*기타항목 추가/수정 버튼 클릭 */
function SYSM130M_fnEctAddClick (type,seq) {
	Utils.setCallbackFunction("SYSM130M_fnEctCallBack", function (param) {
		SYSM130_Component[2].instance.dataSource.transport.read(param);
	});
	SYSM131P_OpenParam.state =type;
	SYSM131P_OpenParam.itemSeq =seq;
	SYSM131P_OpenParam.callbackKey = "SYSM130M_fnEctCallBack"
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM131P", "SYSM131P" , 900, 600,  SYSM131P_OpenParam);
}
/*기타항목 삭제버튼 클릭 */
function SYSM130M_fnEctRemoveClick () {
	SYSM131P_RemoveItem.push(SYSM130_Component[2].currentItem);
	SYSM130_Component[2].instance.removeRow(SYSM130_Component[2].instance.select());
}
/*기타항목 저장버튼 클릭 */
function SYSM130M_fnEctSave(){
	Utils.ajaxCall('/sysm/SYSM131DEL01',JSON.stringify(SYSM131P_RemoveItem), function(result){
			Utils.alert(result.msg);
			let param ={tenantId : SYSM131P_OpenParam.tenantId , orgCd: SYSM131P_OpenParam.orgCd};
			SYSM130_Component[2].instance.dataSource.transport.read(param);
		},
		window.kendo.ui.progress($("#grdSYSM130M"), true),window.kendo.ui.progress($("#grdSYSM130M"), false),false);
}
function SYSM130_fnTreeUp(){
	var treeView = $("#treeSYSM130M").data("kendoTreeView");
	var selectedNode = treeView.select();
	var selectItem = treeView.dataItem(selectedNode);
	var prevItem = treeView.dataItem(selectedNode.prev(".k-item"));

	if(prevItem){
		params ={
			selectItem : selectItem,
			targetItem : prevItem
		}


		Utils.ajaxCall('/sysm/SYSM130UPT04', JSON.stringify(params), function(data){
			SYSM130M_fnSerachOrg()
			setTimeout(function(){
				var treeView = $("#treeSYSM130M").data("kendoTreeView");
				// 데이터 소스에서 orgCd로 노드 찾기
				var dataSource = treeView.dataSource.view();

				var findNodeByOrgCd = function(nodes, orgCd) {
					for (var i = 0; i < nodes.length; i++) {
						if (nodes[i].orgCd === orgCd) {
							return nodes[i];
						}
						if (nodes[i].hasChildren) {
							var found = findNodeByOrgCd(nodes[i].children.view(), orgCd);
							if (found) {
								return found;
							}
						}
					}
					return null;
				};
				var nodeData = findNodeByOrgCd(dataSource, selectItem.orgCd);
				if (nodeData) {
					var node = treeView.findByUid(nodeData.uid);
					treeView.select(node);
					treeView.expandTo(node);
					SYSM130_fnBtnTreeEnableDisable(true,true);
				}
			} , 500)
		},window.kendo.ui.progress($("#grdSYSM130M"),true),window.kendo.ui.progress($("#grdSYSM130M"),false),false);

	}
}
function  SYSM130_fnTreeDown(){
	var treeView = $("#treeSYSM130M").data("kendoTreeView");
	var selectedNode = treeView.select();
	var selectItem = treeView.dataItem(selectedNode);
	var nextItem = treeView.dataItem(selectedNode.next(".k-item"));
	if(nextItem){
		params ={
			selectItem : selectItem,
			targetItem : nextItem
		}
		Utils.ajaxCall('/sysm/SYSM130UPT04', JSON.stringify(params), function(data){
			SYSM130M_fnSerachOrg()
			setTimeout(function(){
				var treeView = $("#treeSYSM130M").data("kendoTreeView");
				// 데이터 소스에서 orgCd로 노드 찾기
				var dataSource = treeView.dataSource.view();

				var findNodeByOrgCd = function(nodes, orgCd) {
					for (var i = 0; i < nodes.length; i++) {
						if (nodes[i].orgCd === orgCd) {
							return nodes[i];
						}
						if (nodes[i].hasChildren) {
							var found = findNodeByOrgCd(nodes[i].children.view(), orgCd);
							if (found) {
								return found;
							}
						}
					}
					return null;
				};
				var nodeData = findNodeByOrgCd(dataSource, selectItem.orgCd);
				if (nodeData) {
					var node = treeView.findByUid(nodeData.uid);
					treeView.select(node);
					treeView.expandTo(node);

					SYSM130_fnBtnTreeEnableDisable(true,true);
				}
			} , 500)
		},window.kendo.ui.progress($("#grdSYSM130M"),true),window.kendo.ui.progress($("#grdSYSM130M"),false),false);
	}
}
/*Button Event - 상위 조직 찾기 팝업 Open*/
function SYSM130_fnPopup_SYSM213P(item) {
	var selectOrgCd = item.ariaLabel

	let selectItem = SYSM130_Component[0].currentItem;
	Utils.setCallbackFunction("SYSM130M_fnSYSM130PCallback", function (item) {
		let selectItem =SYSM130_Component[0].currentItem;
		selectItem.set("hgrkOrgCd",item[0].id);
		selectItem.set("hgrkOrgNm",item[0].orgNm);
		selectItem.set("prsLvlCd",item[0].prsLvlCd);
	});
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM213P", "SYSM213P" , 400, 610,
		{tenantId: selectItem.tenantId, orgCd :selectOrgCd , callbackKey: "SYSM130M_fnSYSM130PCallback"});
}
/*Button Event - 카테고리 찾기 팝업 Open*/
function SYSM130_fnPopup_KMST220P() {
	Utils.setCallbackFunction("SYSM130M_fnKMST220PCallback", function (item) {
		let selectItem =SYSM130_Component[0].currentItem;
		selectItem.set("kmsCtgrCd",item[0].id);
		selectItem.set("kmsCtgrNm",item[0].ctgrNm);
	});
	Utils.openKendoWindow("/kmst/KMST220P",400,600, "left",455,300,
		false,{callbackKey: "SYSM130M_fnKMST220PCallback"});
}
/*Subfunction - Tree Data Fomat 변경*/
function SYSM130_fnSubChangeTreeData(list) {
	let MappedArr = [];
	for (let item of list) {
		let data = {
			id        : item.orgCd,        // 자신 코드
			hgrkOrgCd : item.hgrkOrgCd,    // 부모 코드
			orgNm	  : item.orgNm,        // 자신 이름
			orgStCd	  : item.orgStCd,
			srtSeq : item.srtSeq,
			orgCd : item.orgCd,
			tenantId : item.tenantId
		};
		MappedArr.push(data);
	}
	return Utils.CreateTreeDataFormat(MappedArr, "hgrkOrgCd",true);
}
/*
 * Subfunction - Grid 줄생성
 * @param idx - 그리드 row 번호
 * @param tenantId - 테넌트 ID
 * @param orgcd - 조직 코드
 * @param orgNm - 조직 이름
 * @param orgDvCd - 조직 구분
 * @param prslvcd - 조직
 * @param hgrkorgcd
 * @param hgrkorgnm
 * @param srtseq
 * */
function SYSM130_fnSubGridAddRow(idx,tenantId,orgcd,orgNm,orgDvCd,prslvcd,hgrkorgcd,hgrkorgnm,srtseq) {
	SYSM130_Component[0].instance.dataSource.insert(idx,{
		tenantId: tenantId,
		orgCd: orgcd,
		orgNm: orgNm,
		orgDvCd : orgDvCd,
		prsLvlCd: prslvcd,
		hgrkOrgCd: hgrkorgcd,
		hgrkOrgNm: hgrkorgnm,
		srtSeq: srtseq,
		extnLinkCd: null,
		orgStCd: "",
		kmsDispYn :"",
		kmsCtgrNo : 0,
		kmsCtgrNm :"",
		lstCorcDtm : kendo.format("{0:yyyy-MM-dd HH:mm}",new Date()),
		regrId: GLOBAL.session.user.usrId,
		regrOrgCd: GLOBAL.session.user.orgCd,
		lstCorprId: GLOBAL.session.user.usrId,
		lstCorprOrgCd: GLOBAL.session.user.orgCd,
		add : 'add'
	});
}
//Button Disable Enable - Main
function SYSM130_fnBtnRowEnableDisable(RowSave,RowDelete,RowUse,RowUnUse){
	// $('#SYSM130M button[name=SYSM130M_btnRowSave]').prop('disabled', !RowSave);
	$('#SYSM130M button[name=SYSM130M_btnRowDelete]').prop('disabled', !RowDelete);
	// $('#SYSM130M button[name=SYSM130M_btnUse]').prop('disabled', !RowUse);
	// $('#SYSM130M button[name=SYSM130M_btnUnUse]').prop('disabled', !RowUnUse);
}
function SYSM130_fnBtnTreeEnableDisable(TreeDown,TreeUp){
	$('#SYSM130M button[name=SYSM130M_btnTreeDown]').prop('disabled', !TreeDown);
	$('#SYSM130M button[name=SYSM130M_btnTreeUp]').prop('disabled', !TreeUp);
}
function SYSM130_fnBtnAddEnableDisable(AddRow,AddDownRow){
	$('#SYSM130M button[name=SYSM130M_btnAddRow]').prop('disabled', !AddRow);
	$('#SYSM130M button[name=SYSM130M_btnAddDownRow]').prop('disabled',!AddDownRow);
}
