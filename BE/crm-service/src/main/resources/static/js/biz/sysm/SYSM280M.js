/***********************************************************************************************
 * Program Name : 상담유형코드관리(SYSM280M.js)
 * Creator      : bykim
 * Create Date  : 2022.05.15
 * Description  : 상담유형코드관리
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.15     bykim            최초작성   
 ************************************************************************************************/
var SYSM280M_DataSource, SYSM280M2_DataSource, SYSM280M_grdSYSM280M, SYSM280M2_grdSYSM280M, SYSM280M_userInfo, SYSM280M_selItem;
var SYSM280M_checkList = [];
// 공통코드
var SYSM280M_cmmCodeList, SYSM280M_mgntItemCdList, SYSM280M_bfEditList ;

var SYSM280M_UpdateList = []
var SYSM280M_ADDFILTER = { andLogic : [] , orLogic : [] , before : '' , prsLvlCd : '' , cnslTypCd :''  , cnslTypLvlNm : '' , isFilter : false}
//콤보세팅
SYSM280M_fnSelectCombo();

$(document).ready(function () {
	SYSM280M_userInfo = GLOBAL.session.user;

	SYSM280M_DataSource ={
			transport: {
				read	: function (SYSM280M_jsonStr) {
					if(Utils.isNull(SYSM280M_jsonStr.data)){
						Utils.ajaxCall('/sysm/SYSM280SEL01', SYSM280M_jsonStr, SYSM280M_fnResultTenantList, 
								window.kendo.ui.progress($("#grdSYSM280M"), true), window.kendo.ui.progress($("#grdSYSM280M"), false)) 
					}else{
						window.kendo.ui.progress($("#grdSYSM280M"), false)
					}
				}
				
			},

			schema : {
				type: "json",
				model: {
					id : 'id',
					fields: {
						radio		: { field: "radio", type: "string" ,  editable: false},
						//prsLvlCd		: { field: "prsLvlCd", type: "string" ,  editable: false},
						cnslTypCd		: { field: "cnslTypCd", type: "string" ,  editable: false},
						lvl1Cd			: { field: "lvl1Cd", type: "string" ,  editable: false},
						lvl2Cd			: { field: "lvl2Cd", type: "string" ,  editable: false},
						lvl3Cd			: { field: "lvl3Cd", type: "string",  editable: false },
						lvl4Cd			: { field: "lvl4Cd", type: "string",  editable: false },
						lvl5Cd			: { field: "lvl5Cd", type: "string",  editable: false },
						cnslTypLvlNm	: { field: "cnslTypLvlNm", type: "string" }, //40
						hgrkCnslTypCd	: { field: "hgrkCnslTypCd", type: "number" ,  editable: false},
						dataCreYn		: { field: "dataCreYn", type: "string",  editable: false  },
						baseAnswCdNm	: { field: "baseAnswCdNm", type: "string" }, //200
						useDvCd			: { field: "useDvCd", type: "string" },
						srtSeq			: { field: "srtSeq" , type: "string" },
					}  
				}
			}
	}

	$("#grdSYSM280M").kendoGrid({
		dataSource : SYSM280M_DataSource,
		autoBind: false,
		sortable: true,
		resizable: true,
		selectable: true,
	//	scrollable: true,
		persistSelection: true,
		noRecords: { template: `<div class="nodataMsg"><p>${SYSM280M_langMap.get("SYSM280M.grid.nodatafound")}</p></div>` },
		pageable: {refresh:false
			, pageSizes:[ 25, 50, 280, 200,  500]
			, buttonCount:10
			, pageSize : 25
			, messages: {
				display: " "
				, itemsPerPage: ""
			    }
		},
		dataBound: SYSM280M_fnOnDataBound,
		columns: [ 
			{field: "cnslTypCd",  hidden: true},
			{ width: 40, field: "radio", title: SYSM280M_langMap.get("SYSM280M.grid.select"), template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',  editable: false  },
			{
				template: '#=SYSM280M_fnAddRowTemplate(cnslTypCd,maxCnslTypCd )#',
				width: 45,
			},
			{
				template: '#=SYSM280M_fnAddDownRowTemplate(cnslTypCd,maxCnslTypCd)#',
				width: 45,
			},
			{
				title: SYSM280M_langMap.get("SYSM280M.grid.status"),
				type: "string",
				width: 50,
				template: function (dataItem) {
					let html = "";

					if (dataItem.isNew()) {
						html = "<img src='" + GLOBAL.contextPath + "/images/contents/btn_new.png' style='vertical-align:middle'>";
					} else if (dataItem.dirty) {
						html = "<img src='" + GLOBAL.contextPath + "/images/contents/btn_modify.png' style='vertical-align:middle'>";
					}

					return html;
				},
			},
			// {
			// 	field: "prsLvlCd", title: '현레벨', width:"60px"
			// 	,type: "string"
			// },
			{
				field: "cnslTypCd", title:  SYSM280M_langMap.get("SYSM280M.grid.cnslTypCd"), width:"90px"
				,type: "string", attributes: {"class": "k-text-left"}
			},
			{
				field: "lvl1Cd", title: 'L1', width:"50px"
				,type: "string"
			}, {
				field: "lvl2Cd", title: 'L2', width:"50px"
				,type: "string"
			}, {
				field: "lvl3Cd", title: 'L3', width:"50px"
				,type: "string"
			},
			{
				field: "lvl4Cd", title: 'L4', width:"50px"
				,type: "string"
			},
			{
				field: "lvl5Cd", title: 'L5', width:"50px"
				,type: "string"
			},
			{
				headerAttributes: {"colspan": 2 ,"class":"neceMark"},attributes: {"class": "k-text-left bdNoneRight"},
				width: "auto",	field:  "cnslTypLvlNm", title: SYSM280M_langMap.get("SYSM280M.grid.cnslTypLvlNm")
			},
			{
				headerAttributes: {"class": "displayNon"},attributes: {"class": "bdNoneLeft"}, width: 40,
				template:'<button class="btnRefer_default icoType icoComp_zoom" title="'+SYSM280M_langMap.get("SYSM280M.grid.relatedKeyword")+'" onclick="SYSM280M_fnSelectRow(this)"></button>'
			},
			{
				field: "hgrkCnslTypCd", title: SYSM280M_langMap.get("SYSM280M.grid.hgrkCnslTypCd") , width:"120px"
				,type: "string"
			},
			{
				field: "dataCreYn", title: SYSM280M_langMap.get("SYSM280M.grid.dataCreYn"), width:"100px"
					,type: "string",  template: '<span class="swithCheck"><input type="checkbox" #if(dataCreYn == "Y")   {# return checked #}# onclick="SYSM280M_fnChgCheck(this)")/><label></label></span>'
			}, {
				headerAttributes: {"colspan": 2},
				attributes: {"class": "bdNoneRight",  style: "text-align: left;"},
				width: "auto", field: "baseAnswCdNm", title: SYSM280M_langMap.get("SYSM280M.grid.baseAnswCdNm")
				,editable: function (dataItem) {
                      return false;
                 }
			}, {
                headerAttributes: {"class": "displayNon"}, field: "baseAnswCd",
                width: "40px",
                template: function (dataItem) {
                	return '<button class="btnRefer_default icoType icoComp_zoom" title="검색" onclick="SYSM280M_fnSearchTemplate(this)"></button>';	
                },
            },
			{
				field: "useDvCd", title:SYSM280M_langMap.get("SYSM280M.grid.useDvCd"), width:"80px"
				,type: "string"
				,template: function (dataItem) {
					return Utils.getComCdNm(SYSM280M_cmmCodeList, 'C0003', $.trim(dataItem.useDvCd));
				},
				editor: function (container, options) {
                     SYSM280M_grid_fnComboEditor(container, options, 0, "C0003", SYSM280M_langMap.get("SYSM280M.comboSelect"));
                }
			},
			{
				field: "srtSeq", title: '순번', width:"50px"
				,type: "string"
			},

			],
			change: function(e) {
				let selectedRows = this.select();
				SYSM280M_selItem = this.dataItem(selectedRows[0]);
			}
			,edit: function(e) {
			     /*
			     	수정한 대상만 업데이트 하기위해 필요
			      */
				 let selectedRows = this.select();
				 SYSM280M_selItem = this.dataItem(selectedRows[0]);
				 editRowChk(SYSM280M_selItem)


				 e.container.find("input[name=cnslTypLvlNm]").attr("maxlength", 40);
				 e.container.find("input[name=baseAnswCdNm]").attr("maxlength", 200);
				 $(e.container).find("input[type=text]").select();
	    	 },
	});
	
	
 //연관키워드 그리드	
	SYSM280M2_DataSource ={
			transport: {
				read	: function (SYSM280M_jsonStr) {
					if(Utils.isNull(SYSM280M_jsonStr.data)){
						Utils.ajaxCall('/sysm/SYSM280SEL02', SYSM280M_jsonStr, SYSM280M2_fnResultTenantList, 
								window.kendo.ui.progress($("#grdSYSM280M_2"), true), window.kendo.ui.progress($("#grdSYSM280M_2"), false)) 
					}else{
						window.kendo.ui.progress($("#grdSYSM280M_2"), false)
					}
				}
				
			},
			schema : {
				type: "json",
				model: {
					fields: {
						seq		: { field: "seq", type: "string" ,  editable: false},
						keywordEpctHitRt : { field: "keywordEpctHitRt", type: "number", validation: {  min: 0 } },
					}  
				}
			}
	}
	
	$("#grdSYSM280M_2").kendoGrid({
		dataSource : SYSM280M2_DataSource,
		autoBind: false,
		sortable: true,
		resizable: true,
		scrollable: true,
		noRecords: { template: `<div class="nodataMsg"><p>${SYSM280M_langMap.get("SYSM280M.grid.nodatafound")}</p></div>` },
		columns: [ 
			{ width: "8%", field: "seq", title: "NO", }, 
			{ width: "auto", field: "keywordNm", title: SYSM280M_langMap.get("SYSM280M.grid.keywordNm"), attributes: {"class": "textLeft"}, },
			{
				title: SYSM280M_langMap.get("SYSM280M.keywordEpctHitRt")+"<br />",
			 width: "45%",
                columns: [ {
                	 field: "keywordEpctHitRt",
                	 title: SYSM280M_langMap.get("SYSM280M.grid.keywordEpctHitRt"),
                	 type: "number",
                	 width: "15%", 
                	 attributes: {"class": "textRight"}, 
                	 template: '<em class="rate">#: keywordEpctHitRt #%</em>' 
                },{
                	 title: SYSM280M_langMap.get("SYSM280M.grid.graph"),
                	 width: "20%",
                	 template: '<span class="progressDiagram"><span class="diagram"><i class="value" style="width: #: keywordEpctHitRt #%;"></i></span> </span>' ,
                },
                { title:SYSM280M_langMap.get("SYSM280M.grid.delete"), width : 45, template: '<button class="k-icon k-i-delete rowDelete",></button>' }]
                // { title:"삭제", width : "10%",command: [{ className: "btnRefer_default icoType", name: "destroy", text: "" }] }]
            },
			],
		 save: function(e) {
			let grid = e.sender;
			grid.refresh();
		 }
		,edit: function(e) {
	         e.container.find("input[name=keywordNm]").attr("maxlength", 40);
			$(e.container).find("input[type=text]").select();
	     },
	});
	
	SYSM280M_grdSYSM280M = $("#grdSYSM280M").data("kendoGrid");
	SYSM280M2_grdSYSM280M = $("#grdSYSM280M_2").data("kendoGrid");
	
	Utils.setKendoGridDoubleClickAction("#grdSYSM280M");
	Utils.setKendoGridDoubleClickAction("#grdSYSM280M_2");
	
	let screenHeight = $(window).height(); 
	SYSM280M_grdSYSM280M.element.find('.k-grid-content').css('height', screenHeight-460);   //   (헤더+ 푸터+ 검색 )영역 높이 440
	SYSM280M2_grdSYSM280M.element.find('.k-grid-content').css('height', screenHeight-450);    

	$("#grdSYSM280M_2").on("click", ".rowDelete", function(){
		let row = $(this).closest("tr");
		SYSM280M2_grdSYSM280M.removeRow(row);
	});
	
	let SYSM280M_SrchCondData = [
		 { text:  SYSM280M_langMap.get("SYSM280M.code"), value: "1" }, { text:  SYSM280M_langMap.get("SYSM280M.codeNm"), value: "2" },
	]

	//shpark 20240905 : 콤보박스 글자입력되는 문제로 인해 공통함수로 변경
	Utils.setKendoComboBoxCustom(SYSM280M_SrchCondData, "#SYSM280M_SrchCond", "text","value","",true);
	
	$('#SYSM280M_exptRtText')[0].innerHTML = SYSM280M_langMap.get("SYSM280M.keywordEpctHitRt") +' : 0%   ';

	CMMN_SEARCH_TENANT["SYSM280M"].fnInit(null, SYSM280M_fnSearchTenantList, SYSM280M_fnClearTenantList);

	// $('#SYSM280M_tenantId').val(SYSM280M_userInfo.tenantId);
	// GetTenantNm(SYSM280M_userInfo.tenantId,'SYSM280M_tenantNm');
	SYSM280M_fnSearchTenantList();
});

function SYSM280M_fnClearTenantList(){
	SYSM280M_grdSYSM280M.dataSource.data([]);
	SYSM280M2_grdSYSM280M.dataSource.data([]);
}

function SYSM280M_grid_fnComboEditor(container, options, gridIndex, code, isTotalOption) {
    let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);

    Utils.setKendoComboBox(SYSM280M_cmmCodeList, code, $select, "", isTotalOption).bind("change", function (e) {
        let element = e.sender.element;
        let row = element.closest("tr");
        let dataItem = SYSM280M_grdSYSM280M.dataItem(row);

		dataItem.set(options.field, e.sender.value());
        SYSM280M_grdSYSM280M.refresh();
    });
}

function editRowChk (item){
	let findIndex = SYSM280M_UpdateList.findIndex((obj , index) => obj['cnslTypCd'] == item.cnslTypCd )

	if(findIndex != -1 ){
		SYSM280M_UpdateList[findIndex] = item
	}else{
		SYSM280M_UpdateList.push(item)
	}


}

//grid template 공통코드값 반영 
function SYSM280M_fnSetComcd(SYSM280M_cmmCd, SYSM280M_cmmType){
	for (let i = 0; i < SYSM280M_cmmCodeList.length; i++) {
		if(SYSM280M_cmmCodeList[i].mgntItemCd == SYSM280M_cmmType && SYSM280M_cmmCodeList[i].comCd == SYSM280M_cmmCd){
			return SYSM280M_cmmCodeList[i].comCdNm 
		}
	} 
	return SYSM280M_cmmCd;
}

function SYSM280M_fnAddRowTemplate(cnslTypCd, maxCnslTypCd) {
	/*
	let checkEnd = true;

	switch(cnslTypCd.length){
		case 2:
			checkEnd = Number(cnslTypCd)>=99? true: false;
			break;
		case 4:
			checkEnd = Number(cnslTypCd.substring(2,4))>=99? true: false;
			break;
		case 6 :
			checkEnd = Number(cnslTypCd.substring(6,4))>=99? true: false;
			break;
		case 8 :
			checkEnd = Number(cnslTypCd.substring(6,8))>=99? true: false;
			break;
		case 10 :
			checkEnd = Number(cnslTypCd.substring(8,10))>=99? true: false;
			break;
	}
	if(checkEnd){
		return "<button type='button' class='btnRefer_default icoType k-icon k-i-sort-desc-sm' onclick='SYSM280M_fnAddRow(this)' id='"+cnslTypCd+"' disabled></button> ";
	}

	if(Utils.isNull(maxCnslTypCd)){
		return "<button type='button' class='btnRefer_default icoType k-icon k-i-sort-desc-sm' onclick='SYSM280M_fnAddRow(this)' id='"+cnslTypCd+"' disabled></button> ";
	}else{
		return "<button type='button' class='btnRefer_default icoType k-icon k-i-sort-desc-sm' onclick='SYSM280M_fnAddRow(this)' id='"+cnslTypCd+"'></button> ";
	}

	 */
	return "<button type='button' class='btnRefer_default icoType k-icon k-i-sort-desc-sm' onclick='SYSM280M_fnAddRow(this)' id='"+cnslTypCd+"'></button> ";
}
function SYSM280M_fnAddDownRowTemplate(cnslTypCd) {
	let SYSM280M_check = true;
	let SYSM280M_srchRange = $('#SYSM280M_srchRange').val();
	 for(let i = 0; i<SYSM280M_grdSYSM280M.dataSource.data().length;i++){
	 	/*
		if(cnslTypCd==SYSM280M_grdSYSM280M.dataSource.data()[i].hgrkCnslTypCd){
			SYSM280M_check = false;
			break;
		}
	 	 */
		//if(cnslTypCd.split('').length==6){
		if(cnslTypCd.split('').length==10){
			SYSM280M_check = false;
			break;
		}
	}


	if(SYSM280M_check){
		return"<button type='button' class='btnRefer_default icoType icoComp_levelDown' onclick='SYSM280M_fnAddDownRow(this)' id='down_"+cnslTypCd+"' ></button> ";
	}else{
		return"<button type='button' class='btnRefer_default icoType icoComp_levelDown' onclick='SYSM280M_fnAddDownRow(this)' id='down_"+cnslTypCd+"' disabled ></button> ";
	}
	
}

function SYSM280M_fnSubSpaceRemoveHtml(str){
	if(Utils.isNull(str)){
		return null;
	}else{
		return Utils.removeBlank(str);
	}
}



//Subfunction - 클릭된 버튼 인덱스 찾기
function SYSM280M_fnSubFindIndex(cnslTypCd){
	let idx = -1;
	for(let i = 0; i<SYSM280M_grdSYSM280M.dataSource.data().length;i++){
		if(cnslTypCd==SYSM280M_grdSYSM280M.dataSource.data()[i].cnslTypCd){
			idx = i;	break;
		}
	}
	return idx;
}

//Subfunction - Grid 줄생성
function SYSM280M_fnSubGridAddRow(rowNum,tenantId,cnslTypCd,lvl1Cd,lvl2Cd,lvl3Cd,lvl4Cd,lvl5Cd,hgrkCnslTypCd,prsLvlCd,nextSrtSeq){
	var newObj = {
		tenantId 		  	: tenantId,
		cnslTypCd        	: cnslTypCd+"",    // 채번
		lvl1Cd    			: lvl1Cd+"",   //복사
		lvl2Cd    			: lvl2Cd ,   //복사
		lvl3Cd    			: lvl3Cd ,   //복사
		lvl4Cd    			: lvl4Cd ,   //복사
		lvl5Cd    			: lvl5Cd ,   //복사
		hgrkCnslTypCd    	: hgrkCnslTypCd ,   //복사
		cnslTypLvlNm    	: "" ,   //복사
		dataCreYn    		: "N" ,   //복사
		baseAnswCdNm		: "",
		useDvCd				: "Y",
		prsLvlCd			: prsLvlCd,
		maxCnslTypCd		: cnslTypCd ,
		srtSeq 				: nextSrtSeq  ,
		rowNum				: rowNum
	}
	console.log("SYSM280M_fnSubGridAddRow")
	let gridData = SYSM280M_grdSYSM280M.dataSource.data()

	let newData = Utils.kendoGridInsert(gridData ,newObj)
	SYSM280M_grdSYSM280M.dataSource.data(newData)

	$('#SYSM280M button[name=btnDel]').prop("disabled", false)


	editRowChk(newObj)
	goPage(rowNum - 1)
}

function SYSM280M_fnAddRow(obj){
	//현제 레벨
	let tr = $(obj).closest("tr");
	let item =  Object.assign({}, SYSM280M_grdSYSM280M.dataItem(tr));
	let gridData = SYSM280M_grdSYSM280M.dataSource.data()


	let lastSeq = 0;
	let lastCnslTypCd = ''
	let lastRowItem = {srtSeq : 0}

	for(var i = 0 ; i<  gridData.length; i++){
		if(gridData[i]['hgrkCnslTypCd'] === item.hgrkCnslTypCd && gridData[i]['prsLvlCd']  === item.prsLvlCd){
			if(gridData[i].srtSeq > lastRowItem.srtSeq){
				lastRowItem = gridData[i];
			}
			if( (gridData[i].cnslTypCd * 1) > lastCnslTypCd){
				lastCnslTypCd = gridData[i].cnslTypCd
			}
		}
	}
	//가장 마지막 seq 의 자식row 카운팅
	let childCnt = 0;
	for(var i = 0 ; i<  gridData.length; i++){
		if( gridData[i]['hgrkCnslTypCd'].startsWith(lastRowItem.cnslTypCd)){
			childCnt ++;
		}
	}



	let SYSM280M_nextSeqn, SYSM280M_nextId;

	SYSM280M_nextId = String(Number(lastCnslTypCd.substr(lastCnslTypCd.length-2))+1).padStart(2, "0");
	SYSM280M_nextSeqn = lastCnslTypCd.substring(0,lastCnslTypCd.length-2) + SYSM280M_nextId


	if(item.prsLvlCd == 'L1'){
		item.lvl1Cd = SYSM280M_nextId
	}else if(item.prsLvlCd == 'L2') {
		item.lvl2Cd = SYSM280M_nextId
	}else if(item.prsLvlCd == 'L3') {
		item.lvl3Cd = SYSM280M_nextId
	}else if(item.prsLvlCd == 'L4') {
		item.lvl4Cd = SYSM280M_nextId
	}else if(item.prsLvlCd == 'L5') {
		item.lvl5Cd = SYSM280M_nextId
	}

	let nextRowNum = lastRowItem.rowNum + childCnt + 1
	let nextStrseq = lastRowItem.srtSeq + 1

	/**********************  그리드 필터  ***************************/
	if(SYSM280M_ADDFILTER.prsLvlCd + SYSM280M_ADDFILTER.cnslTypCd + SYSM280M_ADDFILTER.cnslTypLvlNm != ''){
		/*
			prsLvlCd , cnslTypCd , cnslTypLvlNm  중 값이 하나라도 들어있을 경우 필터가 적용중 으로 판단.
			row 추가이후에 추가된 아이템을 보여주기 위해 orLogic 에 추가된 아이템을 추가해 주어야 reload 이후에 아이템이 보여짐.
			현재 input 값을 불러오는 경우는 사용자가 조회하고 값을 변경 했을 위험이 있으므로
			조회당시의 등록한 값으로 판단.
		 */
		if(SYSM280M_ADDFILTER.prsLvlCd  != ''){
			//검색 범위 조회 시  and 조건에 추가.
			SYSM280M_ADDFILTER.andLogic.push({ field:"prsLvlCd",operator:"eq",value: SYSM280M_ADDFILTER.prsLvlCd })
		}
		if(SYSM280M_ADDFILTER.cnslTypCd != ''){
			//코드로 조회 시 and 조건에 추가.
			SYSM280M_ADDFILTER.andLogic.push({ field:"cnslTypCd"   ,operator:"contains" ,value: SYSM280M_ADDFILTER.cnslTypCd })
		}else if(SYSM280M_ADDFILTER.cnslTypLvlNm != ''){
			//코드 값으로 조회 시 and 조건에 추가.
			SYSM280M_ADDFILTER.andLogic.push({ field:"cnslTypLvlNm",operator:"contains" ,value: SYSM280M_ADDFILTER.cnslTypLvlNm })
		}



		//추가등록되는 부분은 orLogic 에 추가.
		SYSM280M_ADDFILTER.orLogic.push({ field:"cnslTypCd"   ,operator:"eq" ,value: SYSM280M_nextSeqn })
		SYSM280M_ADDFILTER.isFilter = true;
		kendoGridFilter(SYSM280M_grdSYSM280M.dataSource ,SYSM280M_ADDFILTER.andLogic , SYSM280M_ADDFILTER.orLogic )
	}
	/**********************  그리드 필터 종료 ***************************/
	SYSM280M_fnSubGridAddRow(nextRowNum ,Utils.isNull($('#SYSM280M_tenantId').val()) ? SYSM280M_userInfo.tenantId : $('#SYSM280M_tenantId').val(), SYSM280M_nextSeqn ,item.lvl1Cd,item.lvl2Cd,item.lvl3Cd,item.lvl4Cd,item.lvl5Cd,item.hgrkCnslTypCd,item.prsLvlCd , nextStrseq );

}



function SYSM280M_fnAddDownRow(obj){
	//현제 레벨
	let tr = $(obj).closest("tr");
	let item =  Object.assign({}, SYSM280M_grdSYSM280M.dataItem(tr));
	let gridData = SYSM280M_grdSYSM280M.dataSource.data()


	let lastSeq = 0;
	let lastCnslTypCd = ''
	let lastRowItem = {}
	let lastSeqRownum =0

	for(var i = 0 ; i<  gridData.length; i++){

		if(gridData[i]['hgrkCnslTypCd'] === item.cnslTypCd && gridData[i]['prsLvlCd'].substr(1,1)  == (item.prsLvlCd.substr(1,1) *1) + 1 ){
			if(gridData[i].srtSeq > lastSeq){
				lastSeq = gridData[i].srtSeq
				lastSeqRownum = gridData[i].rowNum
			}
			if( (gridData[i].cnslTypCd * 1) > lastCnslTypCd){
				lastCnslTypCd = gridData[i].cnslTypCd
			}
		}
	}


	let childCnt = 0;
	if(lastSeq == 0){
		lastCnslTypCd = item.cnslTypCd +'00'
		lastSeqRownum = item.rowNum
	}else{
		//가장 마지막 seq 의 자식row 카운팅
		for(var i = 0 ; i<  gridData.length; i++){
			if( gridData[i]['hgrkCnslTypCd'].startsWith(lastCnslTypCd)){
				childCnt ++;
			}
		}

	}


	let SYSM280M_nextSeqn, SYSM280M_nextId;

	SYSM280M_nextId = String(Number(lastCnslTypCd.substr(lastCnslTypCd.length-2))+1).padStart(2, "0");
	SYSM280M_nextSeqn = lastCnslTypCd.substring(0,lastCnslTypCd.length-2) + SYSM280M_nextId


	if(item.prsLvlCd == 'L1'){
		item.lvl2Cd = SYSM280M_nextId
	}else if(item.prsLvlCd == 'L2') {
		item.lvl3Cd = SYSM280M_nextId
	}else if(item.prsLvlCd == 'L3') {
		item.lvl4Cd = SYSM280M_nextId
	}else if(item.prsLvlCd == 'L4') {
		item.lvl5Cd = SYSM280M_nextId
	}

	let nextRowNum = lastSeqRownum + childCnt + 1
	let nextStrseq = lastSeq + 1
	let nextLevel =  'L'+((item.prsLvlCd.substr(1,1) *1) + 1)



	/**********************  그리드 필터  ***************************/
	if(SYSM280M_ADDFILTER.prsLvlCd + SYSM280M_ADDFILTER.cnslTypCd + SYSM280M_ADDFILTER.cnslTypLvlNm != ''){
		/*
			prsLvlCd , cnslTypCd , cnslTypLvlNm  중 값이 하나라도 들어있을 경우 필터가 적용중 으로 판단.
			row 추가이후에 추가된 아이템을 보여주기 위해 orLogic 에 추가된 아이템을 추가해 주어야 reload 이후에 아이템이 보여짐.
			현재 input 값을 불러오는 경우는 사용자가 조회하고 값을 변경 했을 위험이 있으므로
			조회당시의 등록한 값으로 판단.
		 */

		if(SYSM280M_ADDFILTER.prsLvlCd  != ''){
			//검색 범위 조회 시  and 조건에 추가.
			SYSM280M_ADDFILTER.andLogic.push({ field:"prsLvlCd",operator:"eq",value: SYSM280M_ADDFILTER.prsLvlCd })
		}
		if(SYSM280M_ADDFILTER.cnslTypCd != ''){
			//코드로 조회 시 and 조건에 추가.
			SYSM280M_ADDFILTER.andLogic.push({ field:"cnslTypCd"   ,operator:"contains" ,value: SYSM280M_ADDFILTER.cnslTypCd })
		}else if(SYSM280M_ADDFILTER.cnslTypLvlNm != ''){
			//코드 값으로 조회 시 and 조건에 추가.
			SYSM280M_ADDFILTER.andLogic.push({ field:"cnslTypLvlNm",operator:"contains" ,value: SYSM280M_ADDFILTER.cnslTypLvlNm })
		}



		//추가등록되는 부분은 orLogic 에 추가.
		SYSM280M_ADDFILTER.orLogic.push({ field:"cnslTypCd"   ,operator:"eq" ,value: SYSM280M_nextSeqn })

		//kendoGrid Filter 컨트롤을 위한 함수
		SYSM280M_ADDFILTER.isFilter = true;
		kendoGridFilter(SYSM280M_grdSYSM280M.dataSource ,SYSM280M_ADDFILTER.andLogic , SYSM280M_ADDFILTER.orLogic )
	}
	/**********************  그리드 필터 종료 ***************************/


	SYSM280M_fnSubGridAddRow(nextRowNum ,Utils.isNull($('#SYSM280M_tenantId').val()) ? SYSM280M_userInfo.tenantId : $('#SYSM280M_tenantId').val(), SYSM280M_nextSeqn ,item.lvl1Cd,item.lvl2Cd,item.lvl3Cd,item.lvl4Cd,item.lvl5Cd,item.cnslTypCd,nextLevel , nextStrseq );

}

//Button Event - + 버튼 클릭
$("#SYSM280M_btnGridRowAdd").off("click").on("click", function () {
	let first_level = '';
	for(let i=0; i<SYSM280M_cmmCodeList.length; i++){
		if(SYSM280M_cmmCodeList[i].mgntItemCd == 'C0115'){
			first_level = SYSM280M_cmmCodeList[i].comCd;
			break;
		}
	}

	if( SYSM280M_grdSYSM280M.dataSource.data().length==0){//최초생성시
		//insert Rwo
		SYSM280M_fnSubGridAddRow(0
				,Utils.isNull($('#SYSM280M_tenantId').val()) ? SYSM280M_userInfo.tenantId : $('#SYSM280M_tenantId').val(), '01' ,'01','','','','','',first_level,1);

		SYSM280M_grdSYSM280M.select("tr:eq(0)");
		$("#grdSYSM280M").find("tr:eq(1) td:eq(9)").dblclick();
		//SYSM280M_grdSYSM280M.editCell(SYSM280M_grdSYSM280M.tbody.find("tr").eq(0).find("td").eq(9))
		
		$( "#01").attr('disabled', false);
		$("#SYSM280M_btnGridRowAdd").hide()
	}
	$('#SYSM280M button[name=btnDel]').prop("disabled", true)
});

function SYSM280M_fnSearchTemplate(obj) {
	SYSM280M_checkList= [];
    let dataItem = SYSM280M_grdSYSM280M.dataItem($(obj).closest("tr"));
	if(!Utils.isNull(dataItem.baseAnswCd)) {
		SYSM280M_checkList = dataItem.baseAnswCd.split(";")
	}
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM335P", "SYSM335P" , 700, 610,
		{isMulti : "Y",callbackKey:"SYSM280M_fnPopupCallback", mgntItemCd:'C0235'
	});
   
    Utils.setCallbackFunction("SYSM280M_fnPopupCallback", function (items) {
		let comcd = "", comCdNm = "";
		if(!Utils.isNull(items) && items.length>0) {
			items.forEach(function (item) {
				if (item.mgntItemCd != "C0235") {
					Utils.alert(SYSM280M_langMap.get("SYSM280M.selectScCode"))
				} else {
					comcd += item.comCd+";"
					comCdNm += item.comCdNm+";"
				}
			})

			dataItem.set("baseAnswCdNm", comCdNm.slice(0, -1));
			dataItem.set("baseAnswCd", comcd.slice(0, -1) );
			SYSM280M_grdSYSM280M.refresh();
		}
	});
}
    
//상담유형 코드목록 전체조회 
$('button[name=btnInq]').on('click', function () {
	SYSM280M_UpdateList = []
	SYSM280M_fnSearchTenantList();
});


//상담유형 코드목록 조회결과
function SYSM280M_fnResultTenantList(SYSM280M_data){
	let SYSM280M_jsonEncode = JSON.stringify(SYSM280M_data.SYSM280VOInfo);
	let SYSM280M_obj=JSON.parse(SYSM280M_jsonEncode);
	let SYSM280M_jsonDecode = JSON.parse(SYSM280M_obj);

	SYSM280M_bfEditList = SYSM280M_jsonDecode

	//grid data bind
	SYSM280M_grdSYSM280M.dataSource.data(SYSM280M_jsonDecode);
	SYSM280M_grdSYSM280M.dataSource.options.schema.data = SYSM280M_jsonDecode;
	
	if(SYSM280M_jsonDecode.length>0){
		let SYSM280M_data = { tenantId : Utils.isNull($('#SYSM280M_tenantId').val()) ? SYSM280M_userInfo.tenantId : $('#SYSM280M_tenantId').val()
				,cnslTypCd : SYSM280M_jsonDecode[0].cnslTypCd
		       };	

		let SYSM280M_jsonStr = JSON.stringify(SYSM280M_data);
		
		SYSM280M2_DataSource.transport.read(SYSM280M_jsonStr);
		$("#SYSM280M_btnGridRowAdd").hide()
	}else{
		$("#SYSM280M_btnGridRowAdd").show()
	}
	SYSM280M_selItem = [];

}	

//상담유형 코드 연관키워드 조회결과
function SYSM280M2_fnResultTenantList(SYSM280M_data){

	let SYSM280M_jsonEncode = JSON.stringify(SYSM280M_data.SYSM280VOInfo);
	let SYSM280M_obj=JSON.parse(SYSM280M_jsonEncode);
	let SYSM280M_jsonDecode = JSON.parse(SYSM280M_obj);
	
	//grid data bind
	SYSM280M2_grdSYSM280M.dataSource.data(SYSM280M_jsonDecode);
	
	let SYSM280M_totalRt = 0
	SYSM280M_jsonDecode.forEach(function(val){
		SYSM280M_totalRt += val.keywordEpctHitRt
	})
	
	$('#SYSM280M_exptRtText')[0].innerHTML =  SYSM280M_langMap.get("SYSM280M.keywordEpctHitRt")+' : '+SYSM280M_totalRt+'%  '
	let setWidth = SYSM280M_totalRt+'%'
	$('#SYSM280M_exptRt').width(setWidth) 
	
}	

//콤보값 조회
function SYSM280M_fnSelectCombo(){
	
	SYSM280M_mgntItemCdList = [
		{"mgntItemCd":"C0003"},
		{"mgntItemCd":"C0115"},
		];
	
	Utils.ajaxCall('/comm/COMM100SEL01',  JSON.stringify({ "codeList": SYSM280M_mgntItemCdList}), SYSM280M_fnsetCombo) 
}

//콤보세팅
function SYSM280M_fnsetCombo( SYSM280M_data){
	let SYSM280M_jsonEncode = JSON.stringify(SYSM280M_data.codeList);
	let SYSM280M_object=JSON.parse(SYSM280M_jsonEncode);
	let SYSM280M_jsonDecode = JSON.parse(SYSM280M_object);

	SYSM280M_cmmCodeList = SYSM280M_jsonDecode;
	
	//레벨 코드
	Utils.setKendoComboBox(SYSM280M_cmmCodeList, "C0115", '#SYSM280M_srchRange', "") ;
}



//그리드 조회
function SYSM280M_fnSearchTenantList(selectRowNum){

	Utils.markingRequiredField();
	
	if (Utils.isNull($('#SYSM280M_tenantId').val())) {
		Utils.alert(SYSM280M_langMap.get("SYSM280M.save.tenantId"));
		return;
	}



	let SYSM280M_srchRange = $('#SYSM280M_srchRange').val();
	let SYSM280M_SrchCond = $('#SYSM280M_SrchCond').val();
	let SYSM280M_SrchText = $('#SYSM280M_SrchText').val();

	/**********************  그리드 필터  ***************************/
	if(SYSM280M_srchRange+SYSM280M_SrchText != ''){// 검색 시 SYSM280M_srchRange 와 SYSM280M_SrchText로 필터 여부 판단
		if(SYSM280M_ADDFILTER.before != SYSM280M_srchRange+SYSM280M_SrchCond+SYSM280M_SrchText){ //이전 조회와 검색조건이 다르면 필터 조건값 초기화.
			SYSM280M_ADDFILTER = { andLogic : [] , orLogic : [] , before : '' , prsLvlCd : '' , cnslTypCd :''  , cnslTypLvlNm : '' }
		}

		SYSM280M_ADDFILTER.before  = SYSM280M_srchRange+SYSM280M_SrchCond+SYSM280M_SrchText	//이번 조회의 검색 조건 저장.


		if(SYSM280M_SrchCond != ''){
			console.log(SYSM280M_SrchText)
			if(SYSM280M_SrchText != ''){

				if(SYSM280M_SrchCond == 1){
					//코드로 조회시 필터조건값 cnslTypCd and 조건으로 등록
					SYSM280M_ADDFILTER.andLogic.push({ field:"cnslTypCd"   ,operator:"contains" ,value: SYSM280M_SrchText })
					SYSM280M_ADDFILTER.cnslTypCd = SYSM280M_SrchText  //조회 당시의 cnslTypCd 저장
				}else if(SYSM280M_SrchCond == 2){
					//코드로 조회시 필터조건값 cnslTypLvlNm and 조건으로 등록
					SYSM280M_ADDFILTER.andLogic.push({ field:"cnslTypLvlNm",operator:"contains" ,value: SYSM280M_SrchText })
					SYSM280M_ADDFILTER.cnslTypLvlNm = SYSM280M_SrchText  //조회 당시의 cnslTypLvlNm 저장
				}

			}
		}else{
			//조회조건 검색값이 전체로 선택 될 경우 코드,코드명 검색조건으론 조회되면 안되니 , andLogic 초기화. andLogic을 초기화 하기때문에 prsLvlCd보다 상단에 위치.

			SYSM280M_ADDFILTER.andLogic = []
			SYSM280M_ADDFILTER.cnslTypCd = ''
			SYSM280M_ADDFILTER.cnslTypLvlNm = ''
		}

		if(SYSM280M_srchRange != ''){
			//위에서 코드 조건 검색 시 andLogic 초기화 위험이 있기 때문에 코드조건 보다 늦게 저장
			SYSM280M_ADDFILTER.andLogic.push({ field:"prsLvlCd",operator:"eq",value: SYSM280M_srchRange })
			SYSM280M_ADDFILTER.prsLvlCd = SYSM280M_srchRange	//조회 당시의 prsLvlCd 저장
		}

		SYSM280M_ADDFILTER.isFilter = true;
		kendoGridFilter(SYSM280M_grdSYSM280M.dataSource ,SYSM280M_ADDFILTER.andLogic , SYSM280M_ADDFILTER.orLogic )
	}else{
		//검색 조건이 없다면 등록한 필터값 초기화.
		SYSM280M_ADDFILTER = { andLogic : [] , orLogic : [] , before : '' , prsLvlCd : '' , cnslTypCd :''  , cnslTypLvlNm : '' , isFilter : false}
		kendoGridFilter(SYSM280M_grdSYSM280M.dataSource ,SYSM280M_ADDFILTER.andLogic , SYSM280M_ADDFILTER.orLogic )
	}
	/**********************  그리드 필터 종료 ***************************/



	let SYSM280M_data = { tenantId : Utils.isNull($('#SYSM280M_tenantId').val()) ? SYSM280M_userInfo.tenantId : $('#SYSM280M_tenantId').val()
						,srchCond : SYSM280M_SrchCond
						,srchText : SYSM280M_SrchText
						,prsLvlCd : SYSM280M_srchRange
				       };	

	let SYSM280M_jsonStr = JSON.stringify(SYSM280M_data);

	SYSM280M_DataSource.transport.read(SYSM280M_jsonStr);

	SYSM280M_abledList = [];
	SYSM280M_disabledList = [];
	
	//그리드 초기화
	SYSM280M_grdSYSM280M.dataSource.data([]);
	SYSM280M_grdSYSM280M.dataSource.options.schema.data = [];
	SYSM280M2_grdSYSM280M.dataSource.data([]);
	$('#SYSM280M_exptRtText')[0].innerHTML =  SYSM280M_langMap.get("SYSM280M.keywordEpctHitRt")+' : 0%   ';
	$('#SYSM280M_exptRt').width(0)

	if(selectRowNum){
		setTimeout(function(){
			goPage(selectRowNum)
		} , 500)
	}
}


//상담유형코드 변경 
$('#SYSM280M button[name=btnSave]').on('click', function () {

	//동레벨에 상담유형 코드명이 중복될 경우 등록 못하게 알림.
	if(SYSM280M_UpdateList.length == 0){
		Utils.alert( "수정된 데이터가 없습니다. 다시 확인해주세요." );
		return;
	}else{
		for(let i =0; i < SYSM280M_UpdateList.length; i++){
			var updateItem = SYSM280M_UpdateList[i]
			if(updateItem.cnslTypLvlNm == ''){
				Utils.alert( "상담유형 코드명이 공란입니다. <br/> 상담유형 코드 : " + updateItem.cnslTypCd );
				return;
			}

			var find = SYSM280M_grdSYSM280M.dataSource.data().find(row => row.cnslTypCd != updateItem.cnslTypCd && row.hgrkCnslTypCd ==  updateItem.hgrkCnslTypCd && row.cnslTypLvlNm == updateItem.cnslTypLvlNm  )
			if(find){
				Utils.alert( "상담유형 코드명이 중복 됩니다. <br/> 상담유형 코드 : " + updateItem.cnslTypCd + " <br/> 상담유형 코드명 : " + updateItem.cnslTypLvlNm)
				return;
			}
		}
	}
	Utils.confirm(SYSM280M_langMap.get("SYSM280M.save"), function(){

		let url = '/sysm/SYSM280SAVE01'

		let paramList = SYSM280M_UpdateList

		paramList.forEach(map =>{
			map.regrId 			= SYSM280M_userInfo.usrId;
			map.regrOrgCd 		= SYSM280M_userInfo.orgCd;
			map.lstCorprOrgCd 	= SYSM280M_userInfo.orgCd;
			map.lstCorprId		= SYSM280M_userInfo.usrId;
		})

		let SYSM280M_data = { tenantId : Utils.isNull($('#SYSM280M_tenantId').val()) ? SYSM280M_userInfo.tenantId : $('#SYSM280M_tenantId').val()
							,SYSM280VOList : paramList
		};	

		let SYSM280M_jsonStr = JSON.stringify(SYSM280M_data);
		
		Utils.ajaxCall(url, SYSM280M_jsonStr, function(data){
			Utils.alert(SYSM280M_langMap.get("success.common.save")); // "정상적으로 저장되었습니다."
			SYSM280M_UpdateList = [];
			let selectRowNum = SYSM280M_grdSYSM280M.dataItem(SYSM280M_grdSYSM280M.select()).rowNum - 1;
			SYSM280M_fnSearchTenantList(selectRowNum);
		});
	})
});

function SYSM280M_fnChgCheck(obj){
	let tr = $(obj).closest("tr");
	let item =  SYSM280M_grdSYSM280M.dataItem(tr);


	if(item.dataCreYn=='N'){
		item.dataCreYn ='Y'
	}else{
		item.dataCreYn='N'
	}

	item.set('dirty' ,true)
	editRowChk(item)

	SYSM280M_grdSYSM280M.dataSource.data(SYSM280M_grdSYSM280M.dataSource.data())
}


//상담유형코드삭제
$('#SYSM280M button[name=btnDel]').on('click', function () {



	if(Utils.isNull(SYSM280M_selItem)){
		Utils.alert(SYSM280M_langMap.get("SYSM280M.noSelect"))
		return;
	}
	for(let i =0; i<SYSM280M_bfEditList.length; i++){
		if(SYSM280M_bfEditList[i].hgrkCnslTypCd == SYSM280M_selItem.cnslTypCd) {
			Utils.alert(SYSM280M_langMap.get("SYSM280M.delDisa"))
			return;
		}
	}

	Utils.confirm(SYSM280M_langMap.get("SYSM280M.delete"), function(){

		let SYSM280M_data = { tenantId : Utils.isNull($('#SYSM280M_tenantId').val()) ? SYSM280M_userInfo.tenantId : $('#SYSM280M_tenantId').val()
							,SYSM280VOList : [SYSM280M_selItem]
		};	
		
		let SYSM280M_jsonStr = JSON.stringify(SYSM280M_data);



		let exist = false;
		for(let i =0; i<SYSM280M_bfEditList.length; i++){
			if(SYSM280M_bfEditList[i].cnslTypCd == SYSM280M_selItem.cnslTypCd){
				exist = true;
				break;
			}
		}

		if(exist){
			Utils.ajaxCall('/sysm/SYSM280DEL01', SYSM280M_jsonStr, function(data){
				Utils.alert(SYSM280M_langMap.get("success.common.delete")); // "정상적으로 저장되었습니다."
				SYSM280M_fnSearchTenantList();
			});
		}else{
			let selRow = SYSM280M_grdSYSM280M.tbody.find("tr[data-uid='" + SYSM280M_selItem.uid + "']");
			SYSM280M_grdSYSM280M.removeRow(selRow);
		}
		
		//삭제 대상 수정 리스트에서 제거
		var delIndex = SYSM280M_UpdateList.findIndex((obj,index) => obj['cnslTypCd'] === SYSM280M_selItem.cnslTypCd)
		SYSM280M_UpdateList = SYSM280M_UpdateList.filter((_, i) => i !== delIndex);
	})
	
});


function SYSM280M_fnOnDataBound(SYSM280M_e) {
	$("#grdSYSM280M").on('click','tbody tr[data-uid]',function (SYSM280M_e) {
		let SYSM280M_cell = $(SYSM280M_e.currentTarget);
		let SYSM280M_item = SYSM280M_grdSYSM280M.dataItem(SYSM280M_cell.closest("tr"));
		
		if(SYSM280M_item.useDvCd =='N'){
			$('#SYSM280M button[name=btnDel]').prop("disabled", true)
		}else{
			$('#SYSM280M button[name=btnDel]').prop("disabled", false)
		}
	})
}


function SYSM280M_fnSelectRow(obj){
	let tr = $(obj).closest("tr");
	let SYSM280M_item = $("#grdSYSM280M").data("kendoGrid").dataItem(tr);

	let SYSM280M_data = { tenantId : Utils.isNull($('#SYSM280M_tenantId').val()) ? SYSM280M_userInfo.tenantId : $('#SYSM280M_tenantId').val()
		,cnslTypCd : SYSM280M_item.cnslTypCd
	};
	let SYSM280M_jsonStr = JSON.stringify(SYSM280M_data);
	SYSM280M2_DataSource.transport.read(SYSM280M_jsonStr);
}

//연관키워드 변경 
$('#SYSM280M button[name=btnSave2]').on('click', function () {
	
	Utils.confirm(SYSM280M_langMap.get("SYSM280M.save"), function(){
		let SYSM280M_updateRows = [];
		let sumCheck = 0, valCheck1= true, valCheck2 = true;

		$('#grdSYSM280M_2 .progressDiagram').each(function (idx, row) {
			let	SYSM280M_tr		= $(row).closest('tr');
			let	SYSM280M_item	= Object.assign({}, SYSM280M2_grdSYSM280M.dataItem(SYSM280M_tr));
						//data setting
			let SYSM280M_data = { tenantId : SYSM280M_item.tenantId, 
					cnslTypCd			: SYSM280M_item.cnslTypCd,
					seq					: idx+1,
					keywordNm 			: SYSM280M_item.keywordNm,
					keywordEpctHitRt 	: SYSM280M_item.keywordEpctHitRt,
					regrId 				: SYSM280M_userInfo.usrId,  
					regrOrgCd 			: SYSM280M_userInfo.orgCd,
			};	
			SYSM280M_updateRows.push(SYSM280M_data);
			sumCheck += Number(SYSM280M_item.keywordEpctHitRt);
			
			if(sumCheck>100){
				valCheck1 = false;
			}
			
			if(SYSM280M_data.keywordEpctHitRt==0){
				valCheck2 = false;
			}
		});
		
		if(!valCheck1){
			Utils.alert(SYSM280M_langMap.get("SYSM280M.100")) ;
			return;
		}
		if(SYSM280M_updateRows.length==0){
			Utils.alert(SYSM280M_langMap.get("SYSM280M.noSave"))
			return;
		}

		let SYSM280M_data = {
			 tenantId 		: SYSM280M_selItem.tenantId,
			 cnslTypCd		: SYSM280M_selItem.cnslTypCd,
			"SYSM280VOList" : SYSM280M_updateRows
		};

		let SYSM280M_jsonStr = JSON.stringify(SYSM280M_data);

		Utils.ajaxCall('/sysm/SYSM280INS02', SYSM280M_jsonStr, function(data){
			Utils.alert(SYSM280M_langMap.get("success.common.save")); // "정상적으로 저장되었습니다."
			SYSM280M2_fnUpdateCallBack();
		});
		
		$('#SYSM280M_exptRtText')[0].innerHTML =  SYSM280M_langMap.get("SYSM280M.keywordEpctHitRt")+' : '+sumCheck+'%  '
	})
});

function SYSM280M2_fnUpdateCallBack(){
	
	let selectedRows = SYSM280M_grdSYSM280M.select();
	let SYSM280M_item = SYSM280M_grdSYSM280M.dataItem(selectedRows[0]);
	if(Utils.isNull(SYSM280M_item)){
		SYSM280M_item = SYSM280M_grdSYSM280M.dataSource.at(0);
	}
	let SYSM280M_data = { tenantId : Utils.isNull($('#SYSM280M_tenantId').val()) ? SYSM280M_userInfo.tenantId : $('#SYSM280M_tenantId').val()
						,cnslTypCd : SYSM280M_item.cnslTypCd
				       };	

	let SYSM280M_jsonStr = JSON.stringify(SYSM280M_data);

	SYSM280M2_DataSource.transport.read(SYSM280M_jsonStr);
}


//Button Event - + 버튼 클릭
$("#SYSM280M2_btnGridRowAdd").off("click").on("click", function () {
	
	let selectedRows = SYSM280M_grdSYSM280M.select();
	let dataItem = SYSM280M_grdSYSM280M.dataItem(selectedRows[0]);
	if(Utils.isNull(dataItem)){
		dataItem = SYSM280M_grdSYSM280M.dataSource.at(0);
	}
	if(!Utils.isNull(dataItem)){
		let idx = SYSM280M2_grdSYSM280M.dataSource.data().length;
		
		SYSM280M2_grdSYSM280M.dataSource.insert(idx,{
			tenantId 	   	  	: dataItem.tenantId,
			cnslTypCd        	: dataItem.cnslTypCd,    // 채번
			seq					: idx+1,
			keywordNm			: "",
			keywordEpctHitRt	: 0
		})
	}
});

$('#SYSM280M button[name=btnPreView]').on('click', function () {
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM282P", "SYSM282P" , 410, 590,{tenantId : $('#SYSM280M_tenantId').val()});
	
});

$('#SYSM280M_tenantId , #SYSM280M_SrchText').on("keyup",function(key){
	if(key.keyCode==13) {
		SYSM280M_UpdateList = []
		SYSM280M_fnSearchTenantList();
	}
});

// Button Event - ↑ 버튼 클릭
$("#SYSM280M_btnGridRowUp").off("click").on("click", function () {
	let grid = $("#grdSYSM280M").data("kendoGrid");
	let select = grid.select()[0];
	let item = grid.dataItem(select);

	if(grid.select().length===1){
		let gridData = SYSM280M_grdSYSM280M.dataSource.data()
		let targetItem = {}
		let selSrtSeq 	=  	item.srtSeq

		for(let i =0; i< gridData.length; i++ ) {
			if( gridData[i]['hgrkCnslTypCd']  == item.hgrkCnslTypCd){
				if (gridData[i].srtSeq == item.srtSeq - 1) {
					targetItem = gridData[i]
				}
			}
		}

		if(Object.keys(targetItem).length === 0){
			return
		}


		let tmpArr1 =[]
		let tmpArr2 =[]
		let tmpArr3 =[]
		let tmpArr4 =[]

		let tmpArr = []
		for(let i =0; i< gridData.length; i++ ){
			if( gridData[i]['cnslTypCd'].substring(0,item.cnslTypCd.length)  == item.cnslTypCd ){
				if(gridData[i]['cnslTypCd']  == item.cnslTypCd){
					item.srtSeq = selSrtSeq - 1
					item.dirty = true
					editRowChk(item)
				}

				tmpArr2.push( Object.assign(gridData[i]))
			}else if(gridData[i]['cnslTypCd'].substring(0,targetItem.cnslTypCd.length)  == targetItem.cnslTypCd){
				if(gridData[i]['cnslTypCd']  == targetItem.cnslTypCd){
					targetItem.srtSeq = selSrtSeq
					targetItem.dirty = true
					editRowChk(targetItem)
				}
				tmpArr3.push( Object.assign(gridData[i]))
			}else if(gridData[i].rowNum < item.rowNum){
				tmpArr1.push( Object.assign(gridData[i]))
			}else if(gridData[i].rowNum > targetItem.rowNum){
				tmpArr4.push( Object.assign(gridData[i]))
			}
		}
		tmpArr = [...tmpArr1,...tmpArr2,...tmpArr3,...tmpArr4]

		let selRowNum = 1
		tmpArr.map( (obj , index )  =>{
			obj.rowNum = index
			if(obj.cnslTypCd == item.cnslTypCd){
				selRowNum=obj.rowNum
			}
		})

		SYSM280M_grdSYSM280M.dataSource.data(tmpArr);

		goPage(selRowNum)

	}
});


// Button Event - ↓ 버튼 클릭
$("#SYSM280M_btnGridRowDown").off("click").on("click", function () {
	let grid = $("#grdSYSM280M").data("kendoGrid");
	let select = grid.select()[0];
	let item = grid.dataItem(select);

	if(grid.select().length===1){
		let gridData = SYSM280M_grdSYSM280M.dataSource.data()
		let targetItem = {}
		let selSrtSeq 			=  	item.srtSeq

		for(let i =0; i< gridData.length; i++ ) {
			if( gridData[i]['hgrkCnslTypCd']  == item.hgrkCnslTypCd){
				if (gridData[i].srtSeq == item.srtSeq + 1) {
					targetItem = gridData[i]
				}
			}
		}

		if(Object.keys(targetItem).length === 0){
			return
		}


		let tmpArr1 =[]
		let tmpArr2 =[]
		let tmpArr3 =[]
		let tmpArr4 =[]

		let tmpArr = []
		for(let i =0; i< gridData.length; i++ ){
			if( gridData[i]['cnslTypCd'].substring(0,item.cnslTypCd.length)  == item.cnslTypCd ){
				if(gridData[i]['cnslTypCd']  == item.cnslTypCd){
					item.srtSeq = selSrtSeq+1
					item.dirty = true
					editRowChk(item)
				}

				tmpArr3.push( Object.assign(gridData[i]))
			}else if(gridData[i]['cnslTypCd'].substring(0,targetItem.cnslTypCd.length)  == targetItem.cnslTypCd){
				if(gridData[i]['cnslTypCd']  == targetItem.cnslTypCd){
					targetItem.srtSeq = selSrtSeq
					targetItem.dirty = true
					editRowChk(targetItem)
					goPage(targetItem.rowNum)
				}
				tmpArr2.push( Object.assign(gridData[i]))
			}else if(gridData[i].rowNum < item.rowNum){
				tmpArr1.push( Object.assign(gridData[i]))
			}else if(gridData[i].rowNum > targetItem.rowNum){
				tmpArr4.push( Object.assign(gridData[i]))
			}
		}
		tmpArr = [...tmpArr1,...tmpArr2,...tmpArr3,...tmpArr4]

		let selRowNum = 1
		tmpArr.map( (obj , index )  =>{
			obj.rowNum = index
			if(obj.cnslTypCd == item.cnslTypCd){
				selRowNum = obj.rowNum
			}
		})

		SYSM280M_grdSYSM280M.dataSource.data(tmpArr);
		goPage(selRowNum)
	}
});



function goPage(index){
	var totalPosts = SYSM280M_grdSYSM280M.dataSource.data().length

	var postsPerPage = SYSM280M_grdSYSM280M.dataSource._pageSize

	var desiredPostIndex = index+1;

	var desiredPageNumber = Math.ceil(desiredPostIndex / postsPerPage);

	// 페이지 이동 후 데이터 바인딩이 완료되면 해당 행을 선택
	if(!SYSM280M_ADDFILTER.isFilter){
		//필터가 적용되지 않았을때만 타야함
		SYSM280M_grdSYSM280M.one("dataBound", function() {
			var rowIndexInPage = (index % postsPerPage); // 해당 페이지에서의 행 인덱스
			console.log("rowIndexInPage : " + rowIndexInPage)
			var selectItem = SYSM280M_grdSYSM280M.table.find("tr:eq(" + rowIndexInPage + ")");
			SYSM280M_grdSYSM280M.select(selectItem);
		});
	}

	SYSM280M_grdSYSM280M.dataSource.page(desiredPageNumber);

}

function kendoGridFilter(dataSource , andLogic , orLogic ){
	console.log("kendoGridFilter")
	/*
    andLogic , orLogic : [{ field:"필드명",operator:"eq",value: "value값" }]

    operator
    "eq" (equal to)
    "neq" (not equal to)
    "isnull" (is equal to null)
    "isnotnull" (is not equal to null)
    "lt" (less than)
    "lte" (less than or equal to)
    "gt" (greater than)
    "gte" (greater than or equal to)
    "startswith"
    "doesnotstartwith"
    "endswith"
    "doesnotendwith"
    "contains"
    "doesnotcontain"
    "isempty"
    "isnotempty"
     */
	var filter  = {}

	if(andLogic.length > 0 && orLogic.length == 0){
		//and로직만 있을 경우
		filter =
			{
				logic: "and",
				filters: andLogic
			}
	}else if(andLogic.length == 0 && orLogic.length > 0){
		//or로직만 있을 경우
		filter =
			{
				logic: "or",
				filters: orLogic
			}

	}else if(andLogic.length > 0 && orLogic.length > 0){
		//and or 둘다 있을 경우

		filter = {
			logic: "or",
			filters: [{
						logic:"and",
						filters: andLogic
					},
					...orLogic
			]
		}
	}
	dataSource.filter(filter)
}


$("#SYSM280M_excelUpload").click(function () 			{ 	SYSM280M_excelUpload();	 });
$("#SYSM280M_upfile").on("change",function(e)			{	SYSM280M_excelUpfile(e);	 });

$("#SYSM280M_excelDown").click(function () 				{ 	SYSM280M_excelExport();	 });
//파일 불러오기
function SYSM280M_excelUpload(){

	$("#SYSM280M_upfile").val('');
	$("#SYSM280M_upfile").click();
}


function SYSM280M_excelUpfile(e){
	var upfile 		= $("#SYSM280M_upfile")[0].files[0];
	var upFileNm 	= upfile.name;
	var upFileSize 	= upfile.size;
	var formData 	= new FormData();
	var arrItemCd = [];
	var custNo = 0;
	var arrItemCd = [];


	formData.append("upfile",		upfile);
	formData.append("tenantId",	$('#SYSM280M_tenantId').val());

	Utils.ajaxCallFormData("/sysm/SYSM280XLXUP",formData, function(result){
		if(!Utils.isNull(result.msg)){

			Utils.alert("업로드 해주신 엑셀 데이터가 현재 고객정보레이아웃과 형식이 다릅니다.<br>양식을 새로 다운로드 하신 후에 새로 작성하여 다시 업로드 해주세요.")

			return;
		}else{
			SYSM280M_fnSearchTenantList();
			Utils.alert("업로드 완료되었습니다.")
		}
	});
}


function SYSM280M_excelExport() {

	var workbook = new kendo.ooxml.Workbook({
		sheets: [{
			columns: [{width : 100 , dataType : "string"} ,{width : 100 , dataType : "string"} ,{width : 100 , dataType : "string"},{width : 100 , dataType : "string"},{width : 100 , dataType : "string"}]
			,rows: [{
				type: "header",
				cells: [
					{ value: "GROUP_CODE" },
					{ value: "CODE" },
					{ value: "NAME" },
					{ value: "UP_CODE" },
					{ value: "USING_YN" }
				]
			}, {
				type: "data",
				cells: [
					{ value: "3010" },
					{ value: "01" },
					{ value: "진료" },
					{ value: "" },
					{ value: "Y" }

				]
			}, {
				type: "data",
				cells: [
					{ value: "3010" },
					{ value: "0101" },
					{ value: "진료예약" },
					{ value: "01" },
					{ value: "Y" }

				]
			}, {
				type: "data",
				cells: [
					{ value: "3010" },
					{ value: "010101" },
					{ value: "신환" },
					{ value: "0101" },
					{ value: "Y" }

				]
			}
			]
		}]
	});

	kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: "상담유형코드 양식.xlsx" });
}
