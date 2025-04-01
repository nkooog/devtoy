/***********************************************************************************************
 * Program Name : 태넌트확장정보(SYSM120T.js)
 * Creator      : bykim
 * Create Date  : 2022.01.25
 * Description  : 태넌트확장정보
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.01.25     bykim            최초작성   
 ************************************************************************************************/
var SYSM120T_DataSource, SYSM120T_grdSYSM120T, SYSM120T_tenantId, SYSM120T_list;

$(document).ready(function () {
		SYSM120T_DataSource ={
				transport: {
					read	: function (SYSM120T_jsonStr) {
						if(Utils.isNull(SYSM120T_jsonStr.data)){
							Utils.ajaxCall('/sysm/SYSM120SEL03', SYSM120T_jsonStr, SYSM120T_fnResultTenantInfo, 
									window.kendo.ui.progress($("#grdSYSM120T"), true), window.kendo.ui.progress($("#grdSYSM120T"), false)) 
						}else{
							window.kendo.ui.progress($("#grdSYSM120T"), false)
						}
					}
				},
				schema : {
					type: "json",
					model: {
						id: "id",
						fields: {
							bsVlMgntNo			: { field: "bsVlMgntNo", type: "string",  editable: false },
							bsVlNm				: { field: "bsVlNm", type: "string" },
							bascVluDvCd			: { field: "bascVluDvCd", type: "string" },
							bascVluUnitCd		: { field: "bascVluUnitCd", type: "string" },
							bascVluUseCntCd		: { field: "bascVluUseCntCd", type: "string" },
							dataSzMnriCnt		: { field: "dataSzMnriCnt", type: "string"  },
							dataSzSmlcntMnriCnt	: { field: "dataSzSmlcntMnriCnt", type: "string" },
							bsVl1				: { field: "bsVl1", type: "string" },
							bsVl2				: { field: "bsVl2", type: "string" },
							useYn				: { field: "useYn", type: "string"},
							
						}  
					}
				}
			,data:[]
		}
		$("#grdSYSM120T").kendoGrid({
			dataSource : SYSM120T_DataSource,
			autoBind: false,
			sortable: true,
			resizable: true,
			scrollable: true,
			selectable: 'multiple',
			noRecords: { template: `<div class="nodataMsg"><p>${SYSM100M_langMap.get("SYSM100M.grid.nodatafound")}</p></div>` },
			pageable: {refresh:false
				, pageSizes:[ 25, 50, 100, 200,  500]
				, buttonCount:10
				, pageSize : 50
				, messages: {
					display: " "
					, empty: SYSM100M_langMap.get("SYSM100M.grid.message")
					, itemsPerPage: ""
				    }
			},
			columns: [ 
				{
					selectable: true,
					width: 40,
				},
				{
					title: "상태",
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
				{
					field: "bsVlMgntNo", title:SYSM120T_langMap.get("SYSM120T.grid.bsVlMgntNo")
					, type: "string",  width: 70 
				},{
					field: "bsVlNm", title: SYSM120T_langMap.get("SYSM120T.grid.bsVlNm")
					,type: "string", width: 250 , attributes: {"class": "k-text-left"}
				}, {
					field: "bascVluDvCd", title: SYSM120T_langMap.get("SYSM120T.grid.bascVluDvCd")
					,type: "string", width: 120,
					template: function (dataItem) {
	                  return Utils.getComCdNm(SYSM100M_cmmCodeList, 'C0015', $.trim(dataItem.bascVluDvCd));
					},
					 editor: function (container, options) {
	                     SYSM120T_grid_fnComboEditor(container, options, 0, "C0015", SYSM100M_langMap.get("SYSM100M.comboSelect"));
	                 }
				}, {
					field: "bascVluUnitCd", title: SYSM120T_langMap.get("SYSM120T.grid.bascVluUnitCd")
					,type: "string", width: 150,
					template: function (dataItem) {
	                  return Utils.getComCdNm(SYSM100M_cmmCodeList, 'C0016', $.trim(dataItem.bascVluUnitCd));
					},
					 editor: function (container, options) {
	                     SYSM120T_grid_fnComboEditor(container, options, 0, "C0016", SYSM100M_langMap.get("SYSM100M.comboSelect"));
	                 }
				}, {
					field: "bascVluUseCntCd", title: SYSM120T_langMap.get("SYSM120T.grid.bascVluUseCntCd")
					,type: "string", width: 90 ,
					template: function (dataItem) {
	                  return Utils.getComCdNm(SYSM100M_cmmCodeList, 'C0114', $.trim(dataItem.bascVluUseCntCd));
					},
					 editor: function (container, options) {
	                     SYSM120T_grid_fnComboEditor(container, options, 0, "C0114", SYSM100M_langMap.get("SYSM100M.comboSelect"));
	                 }
				}, {
					field: "dataSzMnriCnt", title: SYSM120T_langMap.get("SYSM120T.grid.dataSzMnriCnt")
					,type: "number", width: 80,   editor: SYSM120T_editNumber
				}, {
					field: "dataSzSmlcntMnriCnt", title: SYSM120T_langMap.get("SYSM120T.grid.dataSzSmlcntMnriCnt")
					,type: "number", width: 80,  editor: SYSM120T_editNumber
				}, {
					field: "bsVl1", title: SYSM120T_langMap.get("SYSM120T.grid.bsVl1")
					,type: "string", width: 250 , attributes: {"class": "k-text-left"}
					
				},{ 
					field: "bsVl2", title:SYSM120T_langMap.get("SYSM120T.grid.bsVl2")
					,type: "string", width: 100 , attributes: {"class": "k-text-left"}
				},{
					field: "bsVl3", title: SYSM120T_langMap.get("SYSM120T.grid.bsVl3")
					,type: "string", width: 100 , attributes: {"class": "k-text-left"}
				},{
					field: "useYn", title: SYSM120T_langMap.get("SYSM120T.grid.useYn")
					,type: "string", width: 100 , 
					template: function (dataItem) {
	                  return Utils.getComCdNm(SYSM100M_cmmCodeList, 'C0003', $.trim(dataItem.useYn));
					},
					 editor: function (container, options) {
	                     SYSM120T_grid_fnComboEditor(container, options, 0, "C0003", SYSM100M_langMap.get("SYSM100M.comboSelect"));
	                 }
				}]
		});

	SYSM120T_grdSYSM120T = $("#grdSYSM120T").data("kendoGrid");
	
	if(SYSM120T_grdSYSM120T != undefined){
		let screenHeight = $(window).height()-320;
		SYSM120T_grdSYSM120T.element.find('.k-grid-content').css('height', screenHeight-168);
	}
	
	Utils.setKendoGridDoubleClickAction("#grdSYSM120T");
});

//function
function SYSM120T_editNumber(container, options) {
	$('<input data-bind="value:' + options.field + '"/>')
		.appendTo(container)
		.kendoNumericTextBox({
			spinners : false});
}

//테넌트  기준정보 초기화
function SYSM120T_fnSetInit(SYSM120T_tenId){
	
	$('#SYSM120T_addRow').prop("disabled", false)
	$('#SYSM120T_btnSave').prop("disabled", false)
	$('#SYSM120T_btnDel').prop("disabled", false)
	
	let	SYSM120T_data = {  tenantId : SYSM120T_tenId };	
	SYSM120T_tenantId = SYSM120T_tenId
	let SYSM120T_jsonStr = JSON.stringify(SYSM120T_data);
	
	SYSM120T_DataSource.transport.read(SYSM120T_jsonStr);
}

// 그리드 세팅
function SYSM120T_fnResultTenantInfo(SYSM120T_data){
	
	let SYSM120T_jsonEncode = JSON.stringify(SYSM120T_data.SYSM120VOInfo);
	let SYSM120T_obj=JSON.parse(SYSM120T_jsonEncode);
	let SYSM120T_jsonDecode = JSON.parse(SYSM120T_obj);
	
	SYSM120T_list = SYSM120T_jsonDecode

	SYSM120T_tenantId = SYSM100M_grdSYSM100M.dataSource.data()[0].tenantId;

	//grid data bind
	if(!Utils.isNull(SYSM120T_jsonDecode)){
		SYSM120T_grdSYSM120T.dataSource.data(SYSM120T_jsonDecode);
		SYSM120T_grdSYSM120T.dataSource.options.schema.data = SYSM120T_jsonDecode;
	}else{
		SYSM120T_grdSYSM120T.dataSource.data([]);
		SYSM120T_grdSYSM120T.dataSource.options.schema.data = [];
	}
}
	

function SYSM120T_grid_fnComboEditor(container, options, gridIndex, code, isTotalOption) {
    let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);

    Utils.setKendoComboBox(SYSM100M_cmmCodeList, code, $select, "", isTotalOption).bind("change", function (e) {
        let element = e.sender.element;
        let row = element.closest("tr");
        let dataItem = SYSM120T_grdSYSM120T.dataItem(row);

        dataItem.set(options.field, e.sender.value());

        SYSM120T_grdSYSM120T.refresh();
    });
}

//event
//테넌트 상세정보 추가
$('#SYSM120T_addRow').off("click").on('click', function () {
	let SYSM120T_dataLength = SYSM120T_grdSYSM120T.dataSource.data().length;
		if( SYSM120T_dataLength>0){
			let SYSM120T_newRow = {bsVlMgntNo : (SYSM120T_grdSYSM120T.dataSource.data()[SYSM120T_dataLength-1].bsVlMgntNo)+1,
				 	bsVlNm : "",
				 	bascVluDvCd :"", 
				 	bascVluUnitCd : "",
				 	bascVluUseCntCd : "",
				 	dataSzMnriCnt : "",
				 	bsVl1 : "",
				 	bsVl2 : "",
				 	bsVl3 : "",
				 	useYn : "N",
				 	checkbox : false};
			 SYSM120T_grdSYSM120T.dataSource.pushInsert(SYSM120T_dataLength+1, SYSM120T_newRow);
		}else{
			let SYSM120T_newRow =  {bsVlMgntNo :1,  
					bsVlNm : "",
				 	bascVluDvCd :"", 
				 	bascVluUnitCd : "",
				 	bascVluUseCntCd : "",
				 	dataSzMnriCnt : "",
				 	bsVl1 : "",
				 	bsVl2 : "",
				 	bsVl3 : "",
				 	useYn : "N",
				 	checkbox : false};
			SYSM120T_grdSYSM120T.dataSource.pushInsert(SYSM120T_dataLength+1, SYSM120T_newRow );
		}

	SYSM120T_grdSYSM120T.select("tr:eq("+(SYSM120T_dataLength)+")");
	$("#grdSYSM120T").find("tr:last td:eq(3)").dblclick();
	// SYSM120T_grdSYSM120T.editCell(SYSM120T_grdSYSM120T.tbody.find("tr").eq(SYSM120T_dataLength).find("td").eq(3))

	$('#SYSM120T_btnDel').prop("disabled", true)
});


//테넌트 상세정보 저장
$('#SYSM120T_btnSave').off("click").on('click', function () {

	let checkProgram =  false;
	SYSM120T_progrmaList = [];

	$.each(SYSM120T_grdSYSM120T.dataSource.data(), function (index, SYSM120T_item) {
		if(SYSM120T_item.bascVluUnitCd=="P"){
			checkProgram = true;
			return false;
		}
	})
	if(checkProgram){
		let SYSM120T_Str = {tenantId: SYSM120T_tenantId}
		Utils.ajaxCall("/sysm/SYSM251SEL01", JSON.stringify(SYSM120T_Str), function (data) {
			let SYSM120T_jsonEncode = JSON.stringify(data.list);
			let SYSM120T_obj = JSON.parse(SYSM120T_jsonEncode);
			SYSM120T_progrmaList = JSON.parse(SYSM120T_obj);

			SYSM120T_save(SYSM120T_progrmaList);
		});
	}else{
		SYSM120T_save(SYSM120T_progrmaList);
	}
});

function SYSM120T_save(SYSM120T_progrmaList){
	let SYSM120T_updateRows = [];
	let SYSM120T_insertRows = [];
	
	let SYSM120T_checkValidation = false;

	$.each(SYSM120T_grdSYSM120T.dataSource.data(), function (index, SYSM120T_item) {

		// 기준값명 길이 체크
		if(!Utils.isNull(SYSM120T_item.bsVlNm) && SYSM120T_item.bsVlNm.length>100){
			Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.bsVlNm"));
			SYSM120T_checkValidation= true;
			return false;
		}
		/*
		1.기준값 필수 체크
		2.기준값 사용수 체크
			2-1 정수, 소수 다 입력 되어 있을 시 기준값 숫자는 2
			2-2 기준값 숫자 < 입력칸 숫자 인지
		3. 정수 길이, 소수 길이 체크
		4. 입력 데이터별 validation 체크
		5. 특정 기준값 validation 체크
		* */

		// 1. 기준값 필수 체크
		if(Utils.isNull(SYSM120T_item.bsVlNm)){
			Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.bsVlNm.Empty"));
			SYSM120T_checkValidation = true;
			return false;
		}
		if(Utils.isNull(SYSM120T_item.bascVluDvCd)){
			Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.bascVluDvCd"));
			SYSM120T_checkValidation = true;
			return false;
		}
		if(Utils.isNull(SYSM120T_item.bascVluUnitCd)){
			Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.bascVluUnitCd"));
			SYSM120T_checkValidation = true;
			return false;
		}
		if(Utils.isNull(SYSM120T_item.bascVluUseCntCd)){
			Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.bascVluUseCntCd"));
			SYSM120T_checkValidation = true;
			return false;
		}
		//정수X 소수만 입력시
		if(Utils.isNull(SYSM120T_item.dataSzMnriCnt) && !Utils.isNull(SYSM120T_item.dataSzSmlcntMnriCnt)){
			Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.dataSz"));
			SYSM120T_checkValidation = true;
			return false;
		}

		//2.기준값 사용수 체크
		//	2-1 정수, 소수 다 입력 되어 있을 시 기준값 숫자는 2
		if(!Utils.isNull(SYSM120T_item.dataSzMnriCnt) && !Utils.isNull(SYSM120T_item.dataSzSmlcntMnriCnt) && SYSM120T_item.bascVluUseCntCd!=2){
			Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.dataSz.double"));
			SYSM120T_checkValidation = true;
			return false;
		}

		//2-2 기준값 숫자 < 입력칸 개수 인지
		let cntCd = SYSM120T_item.bascVluUseCntCd;
		let val1 =  SYSM120T_item.bsVl1;
		let val2 =  SYSM120T_item.bsVl2;
		let val3 =  SYSM120T_item.bsVl3;

		if(cntCd == 1 && (val2.length>0 || val3.length>0)){
			Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.dataSz.val1"));
			SYSM120T_checkValidation = true;
			return false;
		}else if(cntCd == 2 && val3.length>0){
			Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.dataSz.val2"));
			SYSM120T_checkValidation = true;
			return false;
		}

	 	// 3. 정수길이, 소수길이 체크
		let maxDataCnt = SYSM120T_item.dataSzMnriCnt +  SYSM120T_item.dataSzSmlcntMnriCnt;

		if(!Utils.isNull(SYSM120T_item.bsVl1) && SYSM120T_item.bsVl1.length>SYSM120T_item.dataSzMnriCnt){
			Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.bsVl11") + SYSM120T_item.dataSzMnriCnt + SYSM120T_langMap.get("SYSM120T.valid.bsVl12"));
			SYSM120T_checkValidation = true;
			return false;
		}
		if(!Utils.isNull(SYSM120T_item.dataSzMnriCnt) && Utils.isNull(SYSM120T_item.dataSzSmlcntMnriCnt)
			&& !Utils.isNull(SYSM120T_item.bsVl2) && SYSM120T_item.bsVl2.length>SYSM120T_item.dataSzMnriCnt){
			Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.bsVl2") + SYSM120T_item.dataSzMnriCnt + SYSM120T_langMap.get("SYSM120T.valid.bsVl12"));
			SYSM120T_checkValidation = true;
			return false;
		}
		if(!Utils.isNull(SYSM120T_item.dataSzMnriCnt) && !Utils.isNull(SYSM120T_item.dataSzSmlcntMnriCnt)
				&& !Utils.isNull(SYSM120T_item.bsVl2) && SYSM120T_item.bsVl2.length>SYSM120T_item.dataSzSmlcntMnriCnt){
			Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.bsVl2")+maxDataCnt+SYSM120T_langMap.get("SYSM120T.valid.bsVl12"));
			SYSM120T_checkValidation = true;
			return false;
		}
		if(!Utils.isNull(SYSM120T_item.bsVl3) && SYSM120T_item.bsVl3.length>SYSM120T_item.dataSzMnriCnt){
			Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.bsVl3") + SYSM120T_item.dataSzMnriCnt + SYSM120T_langMap.get("SYSM120T.valid.bsVl12"));
			SYSM120T_checkValidation = true;
			return false;
		}
		if(maxDataCnt>100){
			Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.maxDataSz"));
			SYSM120T_checkValidation = true;
			return false;
		}

		//4. 입력 데이터별 validation 체크
		let dSpecial = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
		let dBlank = /\s/g;
		switch(SYSM120T_item.bascVluUnitCd){
			
			case "C":
				let cCheck = /^(C|H[a-zA-Z]{3})\d{4}/;
				if((!Utils.isNull(val1) && cCheck.test(val1)== false) || (!Utils.isNull(val2) && cCheck.test(val2)== false) || (!Utils.isNull(val3) && cCheck.test(val3)== false)){
					Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.codeType"));
					SYSM120T_checkValidation = true;
				}
				break;

			case "T":
				break;

			case "E":
				let eCheck = /^(E)\d{4}/;
				if((!Utils.isNull(val1) && eCheck.test(val1) == false) || (!Utils.isNull(val2) &&  eCheck.test(val2)== false) || (!Utils.isNull(val3) && eCheck.test(val3)== false)){
					Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.extType"));
					SYSM120T_checkValidation = true;
				}
				break;
			case "N":
				let nCheck = /^[0-9]+$/;

				if((!Utils.isNull(val1) && nCheck.test(val1) == false) || (!Utils.isNull(val2) && nCheck.test(val2) == false)|| (!Utils.isNull(val3) && nCheck.test(val3) == false)){
					Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.numType"));
					SYSM120T_checkValidation = true;
				}
				break;
			case "D":
				let dCheck = /^\d{6,8}/
				val1 = val1.replace(dBlank, "").replace(dSpecial, "");
				val2 = val2.replace(dBlank, "").replace(dSpecial, "");
				val3 = val3.replace(dBlank, "").replace(dSpecial, "");

				if((!Utils.isNull(val1) && dCheck.test(val1)== false) || (!Utils.isNull(val2) && dCheck.test(val2)== false) || !Utils.isNull(val3) && (dCheck.test(val3)== false)){
					Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.dateType.date"));
					SYSM120T_checkValidation = true;
				}
				break;

			case "I":
				let iCheck = /^\d{12,14}/
				val1 = val1.replace(dBlank, "").replace(dSpecial, "");
				val2 = val2.replace(dBlank, "").replace(dSpecial, "");
				val3 = val3.replace(dBlank, "").replace(dSpecial, "");

				if((!Utils.isNull(val1) && iCheck.test(val1)== false) || (!Utils.isNull(val2) && iCheck.test(val2)== false) || (!Utils.isNull(val3) && iCheck.test(val3)== false)){
					Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.dateType.time"));
					SYSM120T_checkValidation = true;
				}
				break;

			case "P" :
				if(!Utils.isNull(val1)){
					SYSM120T_checkValidation = SYSM120T_progrmaList.find(element => element.dataFrmId == val1) == undefined? true : false;
					if(SYSM120T_checkValidation){
						Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.program.val1"));
					}
				}
				if(!Utils.isNull(val2)) {
					SYSM120T_checkValidation = SYSM120T_progrmaList.find(element => element.dataFrmId == val2) == undefined? true : false;
					if(SYSM120T_checkValidation) {
						Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.program.val2"));
					}
				}
				if(!Utils.isNull(val3)) {
					SYSM120T_checkValidation = SYSM120T_progrmaList.find(element => element.dataFrmId == val3) == undefined? true : false;
					if(SYSM120T_checkValidation) {
						Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.program.val3"));
					}
				}
				break;
		}
		if(SYSM120T_checkValidation) {
			return false;
		}

		//5. 특정 기준값 validation 체크
		// 통화 예약 알람 시간
		 if(SYSM120T_item.bsVlMgntNo == 21 && SYSM120T_item.bsVl1<30){
			 Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.alarm"));
			 SYSM120T_checkValidation = true;
			 return false;
		 }
		 // 알람 interval time
		if(SYSM120T_item.bsVlMgntNo == 25 && SYSM120T_item.bsVl1<60){
			Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.invertAlarm"));
			SYSM120T_checkValidation = true;
			return false;
		}
		
		//data setting
		let SYSM120T_data = { tenantId : SYSM120T_tenantId, 
				bsVlMgntNo 				: SYSM120T_item.bsVlMgntNo,
				bsVlNm 					: SYSM120T_item.bsVlNm,
				bascVluDvCd 			: SYSM120T_item.bascVluDvCd,
				bascVluUnitCd 			: SYSM120T_item.bascVluUnitCd,
				bascVluUseCntCd 		: SYSM120T_item.bascVluUseCntCd,
				dataSzMnriCnt 			: Utils.isNull(SYSM120T_item.dataSzMnriCnt)? null : SYSM120T_item.dataSzMnriCnt ,
				dataSzSmlcntMnriCnt 	: Utils.isNull(SYSM120T_item.dataSzSmlcntMnriCnt)? null : SYSM120T_item.dataSzSmlcntMnriCnt ,
				bsVl1 					: SYSM120T_item.bsVl1,
				bsVl2 					: SYSM120T_item.bsVl2,
				bsVl3 					: SYSM120T_item.bsVl3,
				useYn 					: SYSM120T_item.useYn,
				regrId 					: SYSM100M_userInfo.usrId,  
				regrOrgCd 				: SYSM100M_userInfo.orgCd,
				lstCorprOrgCd 			: SYSM100M_userInfo.orgCd,  
				lstCorprId 				: SYSM100M_userInfo.usrId
		};
		
		if(SYSM120T_list.find(element => element.bsVlMgntNo ==  SYSM120T_item.bsVlMgntNo)){
			SYSM120T_updateRows.push(SYSM120T_data);
		}else{
			SYSM120T_insertRows.push(SYSM120T_data);
		}
	});
	if(SYSM120T_checkValidation) {
		return;
	}

	if(SYSM120T_updateRows.length==0 && SYSM120T_insertRows ==0){
		Utils.alert(SYSM100M_langMap.get("SYSM100M.save.tenantInfo")) ;
		return;
	}
	
	Utils.confirm(SYSM120T_langMap.get("SYSM120T.save"), function(){
		let SYSM120T_updateData = { "SYSM120VOList" : SYSM120T_updateRows};
		let SYSM120T_updateJsonStr = JSON.stringify(SYSM120T_updateData);
		
		let SYSM120T_insertData = { "SYSM120VOList" : SYSM120T_insertRows};
		let SYSM120T_insertJsonStr = JSON.stringify(SYSM120T_insertData);

		if(SYSM120T_updateRows.length>0  ){
			Utils.ajaxCall('/sysm/SYSM120UPT03', SYSM120T_updateJsonStr, function(data){
			});
		}

		if(SYSM120T_insertRows.length>0){
			Utils.ajaxCall('/sysm/SYSM120INS02', SYSM120T_insertJsonStr, function(data){
			});
		}
		if(SYSM120T_insertRows.length>0||SYSM120T_updateRows.length>0) {
			SYSM120T_fnSaveAfter();
		}
	})
}


function SYSM120T_fnSaveAfter(){
	Utils.alert(SYSM100M_langMap.get("success.common.save")); // "정상적으로 저장되었습니다."
	SYSM120T_fnSetInit(SYSM120T_tenantId);
}

function SYSM120T_fnDelAfter(){
	SYSM120T_fnSetInit(SYSM120T_tenantId);
}


//테넌트 상세정보 삭제
$('#SYSM120T_btnDel').off("click").on('click', function () {

	let SYSM120T_deleteRows = [];
	let SYSM120T_deleteData = [];
	let SYSM120T_chkY = false;
	
	Utils.confirm(SYSM120T_langMap.get("SYSM120T.delete"), function(){
		$('#grdSYSM120T .k-checkbox').each(function (idx, row) {
			if($(row).attr('aria-checked')=='true'){
				let	SYSM120T_tr		= $(row).closest('tr');
				let	SYSM120T_item	= Object.assign({}, SYSM120T_grdSYSM120T.dataItem(SYSM120T_tr));
				
				if(SYSM120T_item.useYn == "N"){
					//data setting
					let SYSM120T_data = { tenantId : SYSM120T_tenantId, 
							bsVlMgntNo 		: SYSM120T_item.bsVlMgntNo };	
					
					if(SYSM120T_list.find(element => element.bsVlMgntNo ==  SYSM120T_item.bsVlMgntNo)){
						SYSM120T_deleteData.push(SYSM120T_data);
					}else{
						if(!$(row).parents('th').length){
							SYSM120T_deleteRows.push(SYSM120T_tr);
						}
					}
				}else{
					SYSM120T_chkY = true;
				}
			}
		});
		
		if(SYSM120T_deleteData.length>0){
			let SYSM120T_data = { "SYSM120VOList" : SYSM120T_deleteData};
			let SYSM120T_jsonStr = JSON.stringify(SYSM120T_data);
			Utils.ajaxCall('/sysm/SYSM120DEL03', SYSM120T_jsonStr,function(data){
				SYSM120T_fnDelAfter();
			});
		}
		
		if(SYSM120T_deleteRows.length>0){
			SYSM120T_deleteRows.forEach(function(val) {
				SYSM120T_grdSYSM120T.removeRow(val);
			});
		}
		
		if(SYSM120T_chkY){
			Utils.alert( SYSM120T_langMap.get("SYSM120T.valid.notUse"));
		}else{
			Utils.alert(SYSM100M_langMap.get("success.common.delete"));
		}
	})
	
}) ;
