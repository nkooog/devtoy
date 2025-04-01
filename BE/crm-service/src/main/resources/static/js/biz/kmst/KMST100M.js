/*******************************************************************************
 * Program Name : 카테고리 만들기(KMST100M.js) Creator : djjung Create Date :
 * 2022.05.24 Description : 카테고리 만들기 Modify Desc :
 * -----------------------------------------------------------------------------------------------
 * Date | Updater | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.24 djjung 최초작성
 ******************************************************************************/

var KMST100M_DataSource;
// var KMST100M_BtnSerchClick = false;
var KMST100M_BeforeData=[];
var KMST100M_StartDate,KMST100M_EndDate;
var KMST100M_selItem;

var KMST100M_grid = new Array(1);				// kw---추가
var KMST100M_kategorieIndexMax = 1;				// kw---추가
var KMST100M_gridCtgrSelIndex = 0;				// kw---추가

$(document).ready(function() {

	// 1. 그리드 설정
    for (let i = 0; i < KMST100M_grid.length; i++) {
    	KMST100M_grid[i] = {
            record: 0,
            instance: new Object(),
            dataSource: new Object(),
            currentItem: new Object(),
            currentCellIndex: new Number(),
            selectedItems: new Array(),
            checkedRows: new Array(),
            loadCount: 0
        }
    }
    
// $('#KMST100M_Auth').load(GLOBAL.contextPath+"/kmst/KMST110S");
// KMST100M_fnAuthGridLoad();
	// 1.Common Code Set
	KMST100M_fnCommCdGet();
	// 2.Grid init
	KMST100M_fnGridInit();
	// 3.etc kendo init
	KMST100M_fnEtcInit();
	// 4.Grid hight Setting
	KMST100M_fnDefaultHightSetting();
	// 5.List Search
	KMST100M_fnSeachGetList();

	$(window).on({'resize': function() {KMST100M_fnDefaultHightSetting();}});
	
	$('#KMST100M input[name=edtPermUseYn]').on('click',function(){
		var checked  = $('#KMST100M input[name=edtPermUseYn]').is(":checked");
		
		if(checked){
			var edtUseTrmStrDD = $('#KMST100M input[name=edtUseTrmStrDD]').val();
			
			$('#KMST100M input[name=edtUseTrmStrDD]').val((edtUseTrmStrDD != '') ? edtUseTrmStrDD : Utils.getToday());
			$('#KMST100M input[name=edtUseTrmEndDD]').val('9999-12-31');
		} else {
			$('#KMST100M input[name=edtUseTrmStrDD]').val('');
			$('#KMST100M input[name=edtUseTrmEndDD]').val('');
		}
	});

	// 20240801 :: 게시판명 조회 개선
	$("#KMST100M_search_ctgrNm").keypress(function(e) {
		var keycode = (e.keyCode ? e.keyCode : e.which);
		if (keycode == '13') {
			KMST100M_fnFilterSearch()
		}
	});

	/*	$("#KMST100M_search_ctgrNm").on('propertychange change keyup paste input blur', function (e) {
            KMST00M_fnFilterSearch()
        });*/

})
// 1.Common Code Set
function KMST100M_fnCommCdGet(){
	let KMST100M_mgntItemCdList = [
		{"mgntItemCd":"C0003"},
		{"mgntItemCd":"C0055"},
		{"mgntItemCd":"C0056"},
		{"mgntItemCd":"C0057"},
		{"mgntItemCd":"C0058"},
		{"mgntItemCd":"C0059"},
		{"mgntItemCd":"C0061"},
		{"mgntItemCd":"C0062"},
	];

	Utils.ajaxCall('/comm/COMM100SEL01',  JSON.stringify({ "codeList": KMST100M_mgntItemCdList}),function(data){
		let KMST100M_commCodeList = JSON.parse(JSON.parse(JSON.stringify(data.codeList)));
		// 게시판 속성
		Utils.setKendoComboBox(KMST100M_commCodeList, "C0055", '#KMST100M input[name=edtCtgrAttrCd]',"",false);
		// 게시판 상태
		Utils.setKendoComboBox(KMST100M_commCodeList, "C0056", '#KMST100M input[name=edtCtgrStLrgclasCd]',"",false);
		Utils.setKendoComboBox(KMST100M_commCodeList, "C0057", '#KMST100M input[name=edtCtgrStSmlclasCd]',"",false);
		// 허용 여부 (글,댓글,좋아요,데시보드)
		Utils.setKendoComboBox(KMST100M_commCodeList, "C0058", '#KMST100M input[name=edtDashBrdDispPmssYn]',"",false);
		// 데시보드 표시 위치
		Utils.setKendoComboBox(KMST100M_commCodeList, "C0059", '#KMST100M input[name=edtDashBrdDispPsnCd]',"",false);
	},null,null,null );
}
// 2.Grid init
function KMST100M_fnGridInit(){
	KMST100M_DataSource = {
		transport: {
			read: function (options) {    

                let param = KMST100M_getParamValue();
                
                $.extend(param, options.data);
               
                Utils.ajaxCall("/kmst/KMST100SEL01", JSON.stringify(param), function (result) {
                    options.success(JSON.parse(result.list));
                    
                    // kw---카테고리를 추가할때 카테고리넘버를 넣어주기 위함
                    $.each(JSON.parse(result.list), function(index, item){
                    	if(KMST100M_kategorieIndexMax <= item.ctgrNo){
                    		KMST100M_kategorieIndexMax = ++	item.ctgrNo;
                    	}
                    });

                    let gridData = $("#grdKMST100").data("kendoGrid").dataSource.data()
                	KMST100M_fnSelectRowInfo(gridData[KMST100M_gridCtgrSelIndex]);
                });
            },
			create: function (options) {
				
				$.each(options.data.models, function(index, item){
					item.ctgrNo = parseInt(item.ctgrNo);
					item.srtSeq = parseInt(item.srtSeq);
					item.ctgrNm = item.ctgrNm.replace(/\    /g, '');
				});
				
                Utils.ajaxCall("/kmst/KMST100INS01", JSON.stringify({
                    list: options.data.models
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            update: function (options) {
            	
            	$.each(options.data.models, function(index, item){
					item.ctgrNo = parseInt(item.ctgrNo);
					item.srtSeq = parseInt(item.srtSeq);
					item.ctgrNm = item.ctgrNm.replace(/\    /g, '');
				});
            	
            	let updateList = options.data.models;
            	let regInfo = {
            			tenantId 		: GLOBAL.session.user.tenantId,
            			lstCorprId		: GLOBAL.session.user.usrId,					// GLOBAL.session.user.usrId,
            			lstCorprOrgCd	: GLOBAL.session.user.orgCd							// GLOBAL.session.user.orgCd
            	}
                
            	$.each(updateList, function (index, item) {
            		$.extend(item, regInfo);
            	});            	
            	
            	
            	Utils.ajaxCall("/kmst/KMST100UPT01", JSON.stringify({
                    list: updateList
                }), function (result) {
                    options.success(updateList);
                });
            },
            destroy: function (options) {
                options.success(options.data.models);
            },
		},
		requestStart: function (e) {
            let type = e.type;
            let response = e.response;
        },
        requestEnd: function (e) {
            let type = e.type;
            let response = e.response;

            if (type != "read" && type != "destroy") {
            	KMST100M_fnSeachGetList();
            }
        },
        batch: true,
// group: [{
// field: "lstCorprOrgCd",
// dir: "ASC",
// }],
		schema : {
			type: "json",
			model: {
				id : 'idx',
				fields: {
					radio		: { field: "radio", type: "string" ,  editable: false},
					tenantId	: {field: "tenantId", 		type: "string"},
					ctgrAttrCd	: {field: "ctgrAttrCd", 		type: "string"},	
					ctgrNm		: {field: "ctgrNm", 		type: "string"},
					ctgrNo		: {field: "ctgrNo", 		type: "string"},
					dirty		: {field: "dirty", 		type: "string"},
					hgrkCtgrNm	: {field: "hgrkCtgrNm", 		type: "string"},
					hgrkCtgrNo	: {field: "hgrkCtgrNo", 		type: "string"},
					id			: {field: "id", 		type: "string"},
					prsLvl		: {field: "prsLvl", 		type: "string"},
					srtSeq		: {field: "srtSeq", 		type: "string"},
				}
			}
		}
	}

	KMST100M_grid[0] = $("#grdKMST100").kendoGrid({
		dataSource: KMST100M_DataSource,
		autoBind: false,
		sortable: false,
		resizable : true,
		persistSelection: true,
		selectable: "row",
		noRecords: { template: '<div class="nodataMsg"><p>'+KMST100M_langMap.get("grid.nodatafound")+'</p></div>' },
		columns: [
			{
				width: 40, field: "radio", title: "선택", template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',  editable: false
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
				template: function(dataItem){
					var htmlBtn = KMST100M_fnAddRowTemplate(dataItem.ctgrNm);
					return htmlBtn;
				},
				width: 40,
				editable: function (dataItem) {
                    return false;
                }
			},
			{
				template: function(dataItem){
					var htmlBtn = "";
					if(dataItem.prsLvl == 1){
						htmlBtn = KMST100M_fnAddDownRowTemplate(dataItem.ctgrNm, dataItem.ctgrAttrCd, dataItem.prsLvl);
					}
					return htmlBtn;
// return KMST100M_fnAddDownRowTemplate(dataItem.ctgrNm, dataItem.ctgrAttrCd,
// dataItem.prsLvl);
				},
				width: 40,
				editable: function (dataItem) {
                    return false;
                }
			},
// {
// template: function(dataItem){
// var htmlBtn = "";
// if(dataItem.prsLvl >= 2){
// htmlBtn = KMST100M_fnAddDownRowTemplate(dataItem.ctgrNm, dataItem.ctgrAttrCd,
// dataItem.prsLvl);
// }
// return htmlBtn + dataItem.ctgrNm;
// },
// width: 40,
// editable: function (dataItem) {
// return false;
// }
// },
			{
				field: "ctgrNm" ,
				title: KMST100M_langMap.get("KMST100M.grid.tilte.CtgrNm"),
				attributes: {"class": "textLeft"},
				template: function(dataItem){
					var htmlBtn = "";
					if(dataItem.prsLvl >= 2){
						htmlBtn = KMST100M_fnAddDownRowTemplate(dataItem.ctgrNm, dataItem.ctgrAttrCd, dataItem.prsLvl);
					}
					return htmlBtn + dataItem.ctgrNm;
				},
// template: '#=KMST100M_fnSubSpaceReplaceHtml(ctgrNm)#'
			},
			{
				template :'#=KMST100M_fnSelectRowTemplate(ctgrNm)#',
				width: 40,
				editable: function (dataItem) {
                    return false;
                }
			},
		],
		beforeEdit: function(e) {// 셀 수정모드 진입시 공백제거
			let str=e.model.ctgrNm;
			for(let i=1; i<e.model.prsLvl;i++){
				str = KMST100M_fnSubSpaceRemoveHtml(str);
			}
			e.model.ctgrNm=str;

		},
		edit: function (e) { // 셀 수정모드 종료시 공백추가 //JDJ 키입력시 수정안됨 추후수정필요
// let str=e.model.ctgrNm;
// console.log(e.model);
// for(let i=1; i<e.model.prsLvl;i++){
// str = KMST100M_fnSubSpaceAddHtml(str);
// }
// e.model.ctgrNm=str;
		},
		cellClose: function (e) {
			let str=e.model.ctgrNm;
			for(let i=1; i<e.model.prsLvl;i++){
				str = KMST100M_fnSubSpaceAddHtml(str);
			}
			e.model.ctgrNm=str;
		},
		change: function(e) {
			let gridData = $("#grdKMST100").data("kendoGrid").dataSource.data()
			KMST100M_selItem = gridData[KMST100M_gridCtgrSelIndex]
		}
	}).data("kendoGrid");
	
	Utils.setKendoGridDoubleClickAction("#grdKMST100");

// $(".k-grid .k-grid-header .k-checkbox").hide();//해더체크박스 삭제
	$("#grdKMST100").data("kendoGrid").hideColumn("srtSeq"); // hidden Colum
// $("#grdKMST100").data("kendoGrid").tbody.on("click", ".k-checkbox",
// KMST100M_fnSubCheckBoxClear);

}
// 3.Etc kendo init
function KMST100M_fnEtcInit(){
	KMST100M_StartDate = $('#KMST100M input[name=edtUseTrmStrDD]').kendoDatePicker({
		value: new Date(),
		format: "yyyy-MM-dd",
		change: KMST100M_fnStartDateChange,
		footer: false,
		culture: "ko-KR"
	}).data("kendoDatePicker");

	KMST100M_EndDate = $('#KMST100M input[name=edtUseTrmEndDD]').kendoDatePicker({
		value: new Date(),
		format: "yyyy-MM-dd",
		change: KMST100M_fnEndDateChange,
		footer: false,
		culture: "ko-KR"
	}).data("kendoDatePicker");

	KMST100M_StartDate.max(KMST100M_EndDate.value());
	KMST100M_EndDate.min(KMST100M_StartDate.value());
}
// 4.Grid hight Setting
function KMST100M_fnDefaultHightSetting(){
	let screenHeight = $(window).height();
	$("#grdKMST100").data("kendoGrid").element.find('.k-grid-content').css('height', screenHeight-412);
}
// CallEvent - 목록 조회
function KMST100M_fnSeachGetList(){
	
	// kw---20230531 : 카테고리 리스트 조회
	KMST100M_grid[0].clearSelection();
	KMST100M_grid[0].currentItem = new Object();
	KMST100M_grid[0].dataSource.read();
}

// kw---추가
function KMST100M_fnAuthGridLoad(){
	// kw--- 20230531 : 카테고리 권한 그리드
	$('#KMST100M_Auth').empty();
	$('#KMST100M_Auth').load(GLOBAL.contextPath+"/kmst/KMST110S");
}


// kw---20230531 : 카테고리 조회 파라미터
function KMST100M_getParamValue(){
	return{
		tenantId 	: GLOBAL.session.user.tenantId,
	}
}

// Call Back - 저장,수정,삭제 콜백 처리 Function
function KMST100M_fnCallBackReulst(result){
	Utils.alert(result.msg);

	if(result.result>0){
		KMST100M_fnSeachGetList();
		// 해당 카테고리 권한 조회
		// KMST100M_fnSearchAuth(result.result);
	}
}
// ComboEvent - 권한 콤보 박스 이벤트
function KMST100M_UseAthtChange(num){
	
	
	let value = Utils.isObject(num) ? $('#KMST100M input[name=edtCtgrUseAthtCd]:checked').val() : num;
	
	$('#KMST100M_Auth').empty();
	if(value == 1){
		$('#KMST100M_Auth').load(GLOBAL.contextPath+"/kmst/KMST110S");
	}else if(value ==2){
		$('#KMST100M_Auth').load(GLOBAL.contextPath+"/kmst/KMST120S");
	}else if(value ==3){
		$('#KMST100M_Auth').load(GLOBAL.contextPath+"/kmst/KMST130S");
	}else {
		$('#KMST100M_Auth').load(GLOBAL.contextPath+"/kmst/KMST110S");
	}
}

// ======================================================================================================================
// Button Disable Enable - Grid 내부
function KMST100M_fnAddRowTemplate(ctgrNm) {
	if(Utils.isNull(KMST100M_fnSubSpaceRemoveHtml(ctgrNm))){
		return "<button type='button' class='btnRefer_default icoType k-icon k-i-sort-desc-sm' onclick='KMST100M_fnAddRow(this)' disabled></button> ";
	}else{
		return "<button type='button' class='btnRefer_default icoType k-icon k-i-sort-desc-sm' onclick='KMST100M_fnAddRow(this)' ></button> ";
	}
}
function KMST100M_fnAddDownRowTemplate(ctgrNm,ctgrAttrCd,prsLvl) {
	let input;
	let addBtnMargin = 0;
	if(prsLvl >= 3){
		addBtnMargin = (prsLvl-2) * 30;
	}
	if(Utils.isNull(KMST100M_fnSubSpaceRemoveHtml(ctgrNm))){
		if(prsLvl >= 5){
			return "<button type='button' class='btnRefer_default icoType k-icon icoComp_levelDownContentIcon' onclick='KMST100M_fnAddRow(this)' style='margin-left:" + addBtnMargin + "px; cursor:default	;' disabled></button> ";
		}
		return "<button type='button' class='btnRefer_default icoType icoComp_levelDown' onclick='KMST100M_fnAddDownRow(this)' style='margin-left:" + addBtnMargin + "px;' disabled></button> ";
	}else if(prsLvl >= 5){
		return "<button type='button' class='btnRefer_default icoType k-icon icoComp_levelDownContentIcon' onclick='KMST100M_fnAddRow(this)' style='margin-left:" + addBtnMargin + "px; cursor:default	;' disabled></button> ";
	}
	else if(ctgrAttrCd==="2"){// 1:카테고리,2:게시판
		return "<button class='btnRefer_default icoType icoComp_levelDownContentIcon' style='margin-left:" + addBtnMargin + "px; cursor:default;' disabled></button> ";
// return " ";
	}else{
		return"<button type='button' class='btnRefer_default icoType icoComp_levelDown' onclick='KMST100M_fnAddDownRow(this)' style='margin-left:" + addBtnMargin + "px;'></button> ";
	}
}
function KMST100M_fnSelectRowTemplate(ctgrNm) {
	if(Utils.isNull(KMST100M_fnSubSpaceRemoveHtml(ctgrNm))){
		return "<button type='button' class='k-icon k-i-zoom-in' onclick='KMST100M_fnSelectRow(this)' title='상세보기' disabled></button>";
	}else{
		return "<button type='button' class='k-icon k-i-zoom-in' onclick='KMST100M_fnSelectRow(this)' title='상세보기' ></button> ";
	}
}
// Button Disable Enable - Main
function KMST100M_fnButtonEnableDisable(){

}


// ======================================================================================================================
// Button Event - 검색 버튼 클릭
$("#KMST100M button[name=btnInq]").off("click").on("click", function () {
	KMST100M_fnFilterSearch()
});

function  KMST100M_fnFilterSearch(){
	let ctgrNm = $("#KMST100M_search_ctgrNm").val();
	Utils.kendoGridFilter($("#grdKMST100").data("kendoGrid").dataSource , [{field:'ctgrNm' , operator : 'contains' , value : ctgrNm}])
}




// Button Event - ↑ 버튼 클릭
$("#KMST100M button[name=btnGridUp]").off("click").on("click", function () {
	let grid = $("#grdKMST100").data("kendoGrid");
	let select = grid.select()[0];
	let item = grid.dataItem(select);
	
	if(grid.select().length===1){
		// 1개 선택
		
		let gridData = $("#grdKMST100").data("kendoGrid").dataSource.data()		
		let selectTopData = gridData[item.srtSeq-2];	// 선택된 아이템 보다 한칸 위에 있는
														// 데이터
		
		let topSeq = 0;		// 변경될 순서 번호
		let topData;		// 변경될 아이템의 상위
		
		let arrTargetSeq = [];	// 변경뒬 순서들의 배열 -선택된 아이템과(하위까지포함), 변경될 아이템(하위까지
								// 포함)
		
		// 맨 위에 있을 경우
		if(Utils.isNull(selectTopData)){
			Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert1"));		// "선택된
																				// 카테고리는
																				// 더 이상
																				// 위로
																				// 이동할
																				// 수
																				// 없습니다."
			return;
		}
		else if(item.prsLvl > selectTopData.prsLvl){		// 선택된 아이템 위에 상위 레벨이
															// 있을 경우
			Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert1"));		// "선택된
																				// 카테고리는
																				// 더 이상
																				// 위로
																				// 이동할
																				// 수
																				// 없습니다."
			return;
		}
		
		// 선택된 아이템 위에 상위 데이터를 찾는다. 즉 선택된 아이템 위에 하위 레벨이 있을 경우 건너띄어서 선택된 아이템과 동일한
		// 레벨의 아이템을 찾는다.
		for(var i=2; i<=item.srtSeq; i++){
			let gridTopData = gridData[item.srtSeq-i];
			
			if(item.prsLvl == gridTopData.prsLvl){
				topSeq = gridTopData.srtSeq;
				topData = gridTopData;

				arrTargetSeq[item.srtSeq] = topSeq++; 
				break;
			}
		}
		
		// 선택된 아이템의 속한 하위 레벨들을 판별하기 위함
		let ctgrNoCheck = [];
		ctgrNoCheck[item.prsLvl] = item.ctgrNo;
		
		$.each(gridData, function(index, gridList){
			if(ctgrNoCheck[gridList.prsLvl-1] == gridList.hgrkCtgrNo){
				arrTargetSeq[gridList.srtSeq] = topSeq++;
				ctgrNoCheck[gridList.prsLvl] = gridList.ctgrNo;
			}
		});
		
		// 선택돤 아이템에 속한 하위 레벨들을 판별하기 위함
		let chageNoCheck = [];
		
		// 선택된 아이템의 레벨
		chageNoCheck[topData.prsLvl] = topData.ctgrNo;
		
		arrTargetSeq[topData.srtSeq] = topSeq++;
		
		$.each(gridData, function(index, gridList){
			// 위에있는 데이터가 선택된 아이템의 레벨보다
			if(chageNoCheck[gridList.prsLvl-1] == gridList.hgrkCtgrNo){
				arrTargetSeq[gridList.srtSeq] = topSeq++;
				chageNoCheck[gridList.prsLvl] = gridList.ctgrNo;
			}
		});
		
		// kw---20230525 : 카테고리 순서 체크 - 순서가 변경되면 상태칸에 [수정]이 뜨도록 하고 DB에 순서를 업데이트
		// 하기 위함
	    $.each(grid.dataSource.data(), function (index, item) {
	        let srtSeq = index + 1;
	        if (Utils.isNull(arrTargetSeq[index+1])) {
	            item.set("srtSeq", parseInt(srtSeq));
	        } else {
	        	item.set("srtSeq", parseInt(arrTargetSeq[index+1]));
	        }
	    });
	    
	    // kw 변경된 데이터소스를 srtSeq 순서로 정렬
	    let resultList = grid.dataSource.data().sort(function (a, b) {
            let x = parseInt(a.srtSeq.toLowerCase());
            let y = parseInt(b.srtSeq.toLowerCase());
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });

		KMST100M_gridCtgrSelIndex = $("#grdKMST100").data("kendoGrid").dataSource.data().indexOf(item);

		$("#grdKMST100").data("kendoGrid").dataSource.data([]);
		$("#grdKMST100").data("kendoGrid").dataSource.data(resultList);
	}else{// 0개선택,다중선택 return
		Utils.alert(KMST100M_langMap.get("KMST100M.Message.to.many.select"));
	}
});
// Button Event - ↓ 버튼 클릭
$("#KMST100M button[name=btnGridDown]").off("click").on("click", function () {
	let grid = $("#grdKMST100").data("kendoGrid");
	let select = grid.select()[0];
	let item = grid.dataItem(select);

	if(grid.select().length===1){
		let gridData = $("#grdKMST100").data("kendoGrid").dataSource.data()
		
		let downSeq;		// 변경될 순서 번호
		let downData;		// 변경될 아이템의 번호
		
		let arrTargetSeq = [];	// 변경뒬 순서들의 배열 -선택된 아이템과(하위까지포함), 변경될 아이템(하위까지
								// 포함)

		let selectDownData = gridData[item.srtSeq];		// 선택된 아이템 보다 한칸 위에 있는
														// 데이터
		
		// 맨 밑에 있을 경우
		if(Utils.isNull(selectDownData)){
			Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert2"));	// Utils.alert("선택된
																			// 카테고리는
																			// 더 이상
																			// 아래로
																			// 이동할
																			// 수
																			// 없습니다.");
			return;
		}
		else if(item.prsLvl > selectDownData.prsLvl){	// 선택된 아이템 밑에 상위 레벨이 있을
														// 경우
			Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert2"));	// Utils.alert("선택된
																			// 카테고리는
																			// 더 이상
																			// 아래로
																			// 이동할
																			// 수
																			// 없습니다.");
			return;
		}
		
		let itemDownCount = gridData.length - item.srtSeq;
		let downGroupNum;
		
		for(var i=0; i<=itemDownCount; i++){
			let gridTopData = gridData[parseInt(item.srtSeq)+i];
			
			// 맨밑에 일 경우
			if(Utils.isNull(gridTopData)){
				Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert2"));	// Utils.alert("선택된
																				// 카테고리는
																				// 더 이상
																				// 아래로
																				// 이동할
																				// 수
																				// 없습니다.");
				return;
			}
			
			// kw---선택된 아이템보다(하위그룹 제외) 밑에 있는 데이터가 자신보다 레벨이 높으면 return; / 자신과 같으면
			// 순서변경
			// 레벨이 높다는건 1 > 2 > 3... 순이기 때문에 조건문에는 이와 반대로 입력
			if(item.prsLvl > gridTopData.prsLvl){
				Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert2"));	// Utils.alert("선택된
																				// 카테고리는
																				// 더 이상
																				// 아래로
																				// 이동할
																				// 수
																				// 없습니다.");
				return;
			} else {
				if(item.prsLvl == gridTopData.prsLvl){
					downSeq = item.srtSeq;
					downData = gridTopData;
					downGroupNum = gridTopData.lstCorprOrgCd;
					break;
				}
			}
			
		}		
		
		// ----변경될 놈의 자식까지 순서 부여하기
		let changeItemCount = item.srtSeq;
		let chageNoCheck = [];
		chageNoCheck[downData.prsLvl] = downData.ctgrNo;
		
		arrTargetSeq[downData.srtSeq] = downSeq++;
		changeItemCount++;
		
		$.each(gridData, function(index, gridList){
			if(chageNoCheck[gridList.prsLvl-1] == gridList.hgrkCtgrNo){
				arrTargetSeq[gridList.srtSeq] = downSeq++;
				chageNoCheck[gridList.prsLvl] = gridList.ctgrNo;
				changeItemCount++;
			}
		});
		
		arrTargetSeq[item.srtSeq] = changeItemCount++;
		// ----변경될 놈의 자식까지 순서 부여하기
		
		
		// -------- 선택된 놈의 자식까지 순서 부여하기
		let ctgrNoCheck = [];
		ctgrNoCheck[item.prsLvl] = item.ctgrNo;
		
		$.each(gridData, function(index, gridList){
			if(ctgrNoCheck[gridList.prsLvl-1] == gridList.hgrkCtgrNo){
				arrTargetSeq[gridList.srtSeq] = changeItemCount++;
				ctgrNoCheck[gridList.prsLvl] = gridList.ctgrNo;
			}
		});
		// -------- 선택된 놈의 자식까지 순서 부여하기
		
		// kw---20230525 : 카테고리 순서 체크 - 순서가 변경되면 상태칸에 [수정]이 뜨도록 하고 DB에 순서를 업데이트
		// 하기 위함
	    $.each(grid.dataSource.data(), function (index, item) {
	        let srtSeq = index + 1;
	        if (Utils.isNull(arrTargetSeq[index+1])) {
	            item.set("srtSeq", parseInt(srtSeq));
	        } else {
	        	item.set("srtSeq", parseInt(arrTargetSeq[index+1]));
	        }
	    });

	    let resultList = grid.dataSource.data().sort(function (a, b) {
            let x = parseInt(a.srtSeq.toLowerCase());
            let y = parseInt(b.srtSeq.toLowerCase());
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });
	    

		$("#grdKMST100").data("kendoGrid").dataSource.data([]);
		$("#grdKMST100").data("kendoGrid").dataSource.data(resultList);

		KMST100M_gridCtgrSelIndex = $("#grdKMST100").data("kendoGrid").dataSource.data().indexOf(item);
	}else{// 0개선택,다중선택 return
		Utils.alert(KMST100M_langMap.get("KMST100M.Message.to.many.select"));

	}
});
// Button Event - + 버튼 클릭
$("#KMST100M button[name=btnGridRowAdd]").off("click").on("click", function () {

	// if(!KMST100M_BtnSerchClick){
	// Utils.alert(KMST100M_langMap.get("KMST100M.Message.no.search.data"));
	// Utils.alert(message);
	// return;
	// }

	if( $("#grdKMST100").data("kendoGrid").dataSource.data().length==0){// 최초생성시
		// insert Rwo
		KMST100M_fnSubGridAddRow(0,
			GLOBAL.session.user.tenantId,
			KMST100M_kategorieIndexMax++,
			"1",
			1,
			1,
			null,
			null);

		$("#grdKMST100").data("kendoGrid").editRow("tr:eq(1)");
		$("#grdKMST100").data("kendoGrid").select("tr:eq(0)");
	}else{ // 추가생성시
		// 상세정보 초기화
		KMST100M_fnDataSetEdt(null,true);
		// 고정된 임의 게시판 번호 및 정렬번호 부여 -> 저장시 교환
		let idx =$("#grdKMST100").data("kendoGrid").dataSource.data().length;
		
		KMST100M_fnSubGridAddRow(idx
			,GLOBAL.session.user.tenantId,KMST100M_kategorieIndexMax++,"1",1,idx,0,"");

		// 추가한 행 선택
		$("#grdKMST100").data("kendoGrid").select("tr:eq("+idx+")");
		$("#grdKMST100").data("kendoGrid").editRow("tr:eq("+(idx+1)+")");

	}
	
	let gridData = $("#grdKMST100").data("kendoGrid").dataSource.data();
	KMST100M_fnSelectRowInfo(gridData[KMST100M_grid[0].select().index()]);
	
	
	
	
// KMST100M_fnDataSetEdt(null,true);
// KMST100M_fnDataSetEdt(data,false);
// $('#KMST100M_Auth').empty();
// $('#KMST100M_Auth').load(GLOBAL.contextPath+"/kmst/KMST110S");
});
// Button Event - 그리드내부의 추가 버튼 클릭
function KMST100M_fnAddRow(obj){
	KMST100M_fnDataSetEdt(null,true);

	let tr = $(obj).closest("tr");
	let item = $("#grdKMST100").data("kendoGrid").dataItem(tr);
	let idx = KMST100M_fnSubFindIndex(item.ctgrNo);

	// kw---20230531 : 하위로 추가 할때 바로 밑으로 추가하기 위함 (다른 항목이 선택된 상태에서 버튼을 누르면 선택되어있는
	// 항목 밑으로 들어감)
	let grid = $("#grdKMST100").data("kendoGrid");
	$.each(grid.dataSource.data(), function (index, gridItem) {
		if(gridItem.uid == item.uid){
			$("#grdKMST100").data("kendoGrid").select("tr:eq(" + index + ")");
		}
    });
	
	// kw---20210602 : 동일레벨 밑으로들어게 하기 위함(선택된 아이템에 하위 그룹이 있으면 하위 그룹을 건너띄고 그 밑에
	// 들어가게하기 위함)
	let gridData = $("#grdKMST100").data("kendoGrid").dataSource.data()
	let downSeq=1;
	let ctgrNoCheck = [];
	ctgrNoCheck[item.prsLvl] = item.ctgrNo;
	$.each(gridData, function(index, gridList){
		if(ctgrNoCheck[gridList.prsLvl-1] == gridList.hgrkCtgrNo){
			downSeq++;
			ctgrNoCheck[gridList.prsLvl] = gridList.ctgrNo;
		}
	});
	
	if(Utils.isNull(item.ctgrNo)){
		idx = KMST100M_grid[0].select().index() + 1;
	} else {
		idx = parseInt(item.srtSeq) + downSeq - 1;
	}
	
	let prsLvl = parseInt(item.prsLvl);

	KMST100M_fnSubGridAddRow(idx
		,GLOBAL.session.user.tenantId,KMST100M_kategorieIndexMax++,"1",prsLvl,-1,item.hgrkCtgrNo,item.hgrkCtgrNm);

	$("#grdKMST100").data("kendoGrid").editRow("tr:eq("+(idx + 2)+")");
	$("#grdKMST100").data("kendoGrid").select("tr:eq("+(idx)+")");

}
// Button Event - 그리드내부의 아래 추가 버튼 클릭
function KMST100M_fnAddDownRow(obj){
	KMST100M_fnDataSetEdt(null,true);

	let tr = $(obj).closest("tr");
	let item = $("#grdKMST100").data("kendoGrid").dataItem(tr);
	let idx = KMST100M_fnSubFindIndex(item.ctgrNo);
	
	// kw---20230531 : 하위로 추가 할때 바로 밑으로 추가하기 위함 (다른 항목이 선택된 상태에서 버튼을 누르면 선택되어있는
	// 항목 밑으로 들어감)
	let grid = $("#grdKMST100").data("kendoGrid");
	$.each(grid.dataSource.data(), function (index, gridItem) {
		if(gridItem.uid == item.uid){
			$("#grdKMST100").data("kendoGrid").select("tr:eq(" + index + ")");
		}
    });
	
	if(Utils.isNull(item.ctgrNo)){
		idx = KMST100M_grid[0].select().index();
	} else {
		idx = KMST100M_fnSubFindIndex(item.ctgrNo);
	}
	
	let prsLvl = parseInt(item.prsLvl)+1;
	
	KMST100M_fnSubGridAddRow(idx+1
		,GLOBAL.session.user.tenantId,KMST100M_kategorieIndexMax++ ,1,prsLvl,-1,item.ctgrNo,item.ctgrNm);

	$("#grdKMST100").data("kendoGrid").editRow("tr:eq("+(idx + 2)+")");
	$("#grdKMST100").data("kendoGrid").select("tr:eq("+(idx + 1)+")");
}
// Button Event - 그리드내부의 상세 조회 버튼 클릭
function KMST100M_fnSelectRow(obj){
	let tr = $(obj).closest("tr");
	let item = $("#grdKMST100").data("kendoGrid").dataItem(tr);

	KMST100M_fnSelectRowInfo(item);
}

// kw---추가
function KMST100M_fnSelectRowInfo(item){

	if(!Utils.isNull(item)){
		if(item.hasOwnProperty("abolDtm")){
			let KMST100M_jsonStr = {
				tenantId : GLOBAL.session.user.tenantId,
				ctgrNo : item.ctgrNo,
			}

			// 체크박스 클리어
			KMST100M_fnSubCheckBoxClear();

			Utils.ajaxCall('/kmst/KMST100SEL02', JSON.stringify(KMST100M_jsonStr), function(result){

				let data =JSON.parse(JSON.parse(JSON.stringify(result.KMST100VOInfo)));
				KMST100M_fnDataSetEdt(null,true);
				KMST100M_fnDataSetEdt(data,false);

				KMST100M_UseAthtChange(data.ctgrUseAthtCd);

				// 버튼 사이드 선택시 로우 선택안될경우
				let idx = KMST100M_fnSubFindIndex(data.ctgrNo);
				$("#grdKMST100").data("kendoGrid").select("tr:eq("+(idx)+")");
			},false,false,false);
		} else {
			KMST100M_fnDataSetEdt(null,true);
			$('#KMST100M input[name=edtCtgrNo]').val(9999);
			KMST100M_UseAthtChange(null);
		}
	}
}

// Button Event - Grid 저장 버튼 클릭
$("#KMST100M button[name=btnGridSave]").off("click").on("click", function () {
	
	
	// kw---20230531 그리드 순서 정렬
	let grid = $("#grdKMST100").data("kendoGrid");
	$.each(grid.dataSource.data(), function (index, item) {
        let srtSeq = index + 1;
        if(item.srtSeq != srtSeq){
        	item.set("srtSeq", srtSeq);
        }
    });
	
	let isValid = true;
    
    let insertInfo = {
    	regrId: GLOBAL.session.user.usrId,					// ,GLOBAL.session.user.usrId,
    	regrOrgCd: GLOBAL.session.user.orgCd,						// ,GLOBAL.session.user.orgCd,
    	lstCorprId: GLOBAL.session.user.usrId,					// ,GLOBAL.session.user.usrId,
    	lstCorprOrgCd: GLOBAL.session.user.orgCd,						// ,GLOBAL.session.user.orgCd,
    }
    
    $.each(KMST100M_grid[0].dataSource.data(), function (index, item) {
    	$.extend(item, insertInfo);
    });
    
    if (isValid) {
        Utils.confirm(KMST100M_langMap.get("KMST100M.Message.do.you.want.save"), function () {
        	KMST100M_grid[0].dataSource.sync().then(function (result) {
        		Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert3"));	// Utils.alert("저장되었습니다.");
        	});
        });
    }
});
// Button Event - Grid 삭제 버튼 클릭
$("#KMST100M button[name=btnGridDelete]").off("click").on("click", function () {
	
	let grid = $("#grdKMST100").data("kendoGrid");
	let select = grid.select()[0];
	let item = grid.dataItem(select);
	let chngSelect =  KMST100M_selItem;

	if(Utils.isNull(select)&& Utils.isNull(KMST100M_selItem)){// 선택된 Row 없음
		Utils.alert(KMST100M_langMap.get("KMST100M.Message.can.not.delete.data.is.empty"));
	}
	else {
		let item = KMST100M_selItem;
		
		// kw--20230607 : 삭제버튼 클릭시 하위 아이템이 있는지 확인, 있으면 return
		let ctgrDownEmpty = false;
		$.each(grid.dataSource.data(), function (index, gridItem) {
			if(gridItem.hgrkCtgrNo == item.ctgrNo){
				ctgrDownEmpty = true;
				return false;
			}
	    });
		
		if(ctgrDownEmpty == true){
			// kw---20230607 : 알림창 추가 - 하위 카테고리를 먼저 삭제한 후 다시 시도해주세요.
			Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert10"));		// Utils.alert("카테고리를
																				// 먼저
																				// 저장해
																				// 주세요.");
			return;	
		}
		// kw--20230607 : 삭제버튼 클릭시 하위 아이템이 있는지 확인, 있으면 return 끝
		
		if (item.isNew()){ // 선택 Row Grid 삭제
			item.ctgrNo == 0;
			Utils.confirm(KMST100M_langMap.get("KMST100M.Message.do.you.want.delete"),function(){
				let selRow = grid.tbody.find("tr[data-uid='" + chngSelect.uid + "']");
				grid.removeRow(selRow);
			});
		}else{ // DB 삭제

			Utils.confirm(KMST100M_langMap.get("KMST100M.Message.do.you.want.delete"),function(){
				
				let removeRow = {
					tenantId  : item.tenantId,
					ctgrNo: item.ctgrNo,
				};
				Utils.ajaxCall('/kmst/KMST100DEL01', JSON.stringify(removeRow), function(result){
					
					if(result.result>0){
						
						// kw---20230607 - success.common.delete - 정상적으로
						// 삭제되었습니다.
						Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert4"));	// Utils.alert("정상적으로
																						// 삭제되었습니다.");
						
						KMST100M_gridCtgrSelIndex = 0;
						
						let selRow = grid.tbody.find("tr[data-uid='" + chngSelect.uid + "']");
						grid.removeRow(selRow);
						
						let srtSeqChange = false;
						$.each(grid.dataSource.data(), function (index, gridItem) {
							if(gridItem.srtSeq != index+1){
								gridItem.set("srtSeq", index+1);
								srtSeqChange = true;
							}
					    });
						

						if(srtSeqChange == true){
							KMST100M_grid[0].dataSource.sync();
						} else {
							KMST100M_grid[0].dataSource.read();
						}
					}
					
				});
			});
		}
	}

});
// Button Event - 상세 저장 버튼 클릭
$("#KMST100M button[name=btnDetailSave]").off("click").on("click", function () {

	let ctgrNewCheck = KMST100M_fnCtgrNewCheck();
	if(ctgrNewCheck){
		return;
	}
	
	
	
	let item = KMST100M_fnSubDataGetEdt();
	
	// kw---20230607 : 카테고리 기본설정 빈칸 체크
	
	// 카테고리 명
	if(Utils.isNull(item.ctgrNm)){
		Utils.alert(KMST100M_langMap.get("KMST100M.Message.can.not.save.ctgrNm.is.empty"));
		return;
	}
	
	// 사용기간
	if(Utils.isNull(item.useTrmStrDd)){
		Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert5"));		// Utils.alert("사용기간을
																			// 선택해주세요.");
		return;
	}
	
	if(Utils.isNull(item.useTrmEndDd)){
		Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert5"));		// Utils.alert("사용기간을
																			// 선택해주세요.");
		return;
	}
	
	// 카테고리 속성
	if(Utils.isNull(item.ctgrAttrCd)){
		Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert6"));		// Utils.alert("카테고리
																			// 속성을
																			// 선택해
																			// 주세요.");
		return;
	}
	
	// 카테고리사용권한
	if(Utils.isNull(item.ctgrUseAthtCd)){
		Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert7"));		// Utils.alert("카테고리
																			// 사용
																			// 권한을
																			// 선택해
																			// 주세요.");
		return;
	}
	
	if(!Utils.isNull(item.cntntsRegApvNcsyYn) && item.cntntsRegApvNcsyYn == "Y"){
		if(Utils.isNull(item.ctgrAdmnId)){
			Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert8"));		// Utils.alert("카테고리
																				// 관리자를
																				// 입력해
																				// 주세요.");
			return;
		}
	}
	
	//kw---20230703 : 게시판 속성 변경시 하위 아이템이 있는지 체크
	let returnYn = 0;
	let gridData = $("#grdKMST100").data("kendoGrid").dataSource.data()
	
	if(gridData[KMST100M_gridCtgrSelIndex].ctgrAttrCd == "1" && gridData[KMST100M_gridCtgrSelIndex].ctgrAttrCd != item.ctgrAttrCd){		//kw---20230703 : 카테고리->게시물
		//kw---20230703 : 하위 아이템이 있는지 체크
		$.each(gridData, function (index, item) {
	        let srtSeq = index + 1;
	        if(gridData[KMST100M_gridCtgrSelIndex].ctgrMgntNo == item.hgrkCtgrMgntNo){
	        	returnYn = 1;
	        	return false;
	        }
	    });
	} else if(gridData[KMST100M_gridCtgrSelIndex].ctgrAttrCd == "2" && gridData[KMST100M_gridCtgrSelIndex].ctgrAttrCd != item.ctgrAttrCd){	//kw---20230703 : 게시물 -> 카테고리
		if(gridData[KMST100M_gridCtgrSelIndex].tbmCount > 0){
			returnYn = 2;
		}
	}

	if(returnYn > 0){
		if(returnYn == 1){
			Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert10"));		//Utils.alert("카테고리를 먼저 저장해 주세요.");
		} else {
			Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert11"));		//Utils.alert("현재 선택하신 게시물에는 게시글이 존재합니다.<br>게시글을 삭제한 후 다시 시도해 주세요.");
		}
		//kw---20230703 : 게시판속성 변경 실패시 변경 전 값으로 복구
		$('#KMST100M input[name=edtCtgrAttrCd]').data("kendoComboBox").value(gridData[KMST100M_gridCtgrSelIndex].ctgrAttrCd);
		return;
	}
	//kw---20230703 : 게시판 속성 변경시 하위 아이템이 있는지 체크 끝	

	Utils.confirm(KMST100M_langMap.get("KMST100M.Message.do.you.want.save"),function(){
		if(Utils.isNull(item.tenantId)||Utils.isNull(item.ctgrNo)){
			Utils.alert(KMST100M_langMap.get("KMST100M.Message.can.not.save.data.is.empty"));
			return;
		}

		let updateRow = {
			tenantId  		  : item.tenantId,
			ctgrNo		  	  : item.ctgrNo,
			ctgrNm    		  : item.ctgrNm,
			ctgrAttrCd		  : item.ctgrAttrCd,
			ctgrDesc          : item.ctgrDesc,
			ctgrStLrgclasCd   : item.ctgrStLrgclasCd,
			ctgrStSmlclasCd   : item.ctgrStSmlclasCd,
			useTrmStrDd       : item.useTrmStrDd,
			useTrmEndDd       : item.useTrmEndDd,
			permUseYn         : item.permUseYn,
			dashBrdDispPmssYn : item.dashBrdDispPmssYn,
			dashBrdDispPsnCd  : item.dashBrdDispPsnCd,
			ctgrUseAthtCd     : item.ctgrUseAthtCd,
			ctgrAdmnId        : item.ctgrAdmnId,
			hgrkCtgrNo        : item.hgrkCtgrNo,
			cntntsRegApvNcsyYn    : item.cntntsRegApvNcsyYn,
			lstCorprId 		  : GLOBAL.session.user.usrId,
			lstCorprOrgCd	  : GLOBAL.session.user.orgCd,
		};
		
// gridData[CMMT100M_gridCtgrSelIndex].ctgrAttrCd = item.ctgrAttrCd;
		
		Utils.ajaxCall('/kmst/KMST100UPT02', JSON.stringify(updateRow), function(result){
			Utils.alert(result.msg);
		});
		
		gridData[KMST100M_gridCtgrSelIndex].ctgrAttrCd = item.ctgrAttrCd;
		$("#grdKMST100").data("kendoGrid").refresh();
	});
});
// JDJ Button Event - 게시판 관리자 불러오기
$("#KMST100M button[name=btnLoadAdmin]").off("click").on("click", function () {
	Utils.setCallbackFunction("kmst100m_rtnValue", function (item) {
		$('#KMST100M input[name=edtCtgrAdmnId]').val(item.usrId);
	});

// Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM214P", "SYSM214P", 900, 600,
// {callbackKey: "kmst100m_rtnValue", cmmtSetlmnYn: "Y"})
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM214P", "SYSM214P", 900, 600, {callbackKey: "kmst100m_rtnValue", kldMgntSetlmnYn: "Y"})
});

$("#KMST100M input[name=edtCtgrUseAthtCd]:radio").change(function () {
	// 라디오 버튼 값을 가져온다.
	KMST100M_UseAthtChange(this.value);
});



// //======================================================================================================================
// Subfunction - Data 상세항목 세팅
function KMST100M_fnDataSetEdt(item,clear){
	// 초기화용
	if(clear === true){
		item = {
			ctgrNo	 		 	: null,
			ctgrNm           	: null,
			hgrkCtgrNo		   	: null,
			hgrkCtgrNm	   		: null,
			ctgrAttrCd       	: null,
			ctgrDesc         	: null,
			ctgrStLrgclasCd  	: null,
			ctgrStSmlclasCd  	: null,
			useTrmStrDd      	: null,
			useTrmEndDd      	: null,
			permUseYn        	: "N",
			dashBrdDispPmssYn	: null,
			dashBrdDispPsnCd 	: null,
			ctgrUseAthtCd    	: null,
			ctgrAdmnId       	: null,
			cntntsRegApvNcsyYn  : "N",
		}
	}
	
	$('#KMST100M input[name=edtCtgrNm]').attr("disabled", true);

	$('#KMST100M input[name=edtCtgrNo]').val(item.ctgrNo);
	$('#KMST100M input[name=edtCtgrNm]').val(item.ctgrNm);
	$('#KMST100M textarea[name=edtCtgrDesc]').val(item.ctgrDesc);

	$('#KMST100M input[name=edtCtgrHgrkNm]').val(item.hgrkCtgrNm);
	$('#KMST100M input[name=edtCtgrHgrkNo]').val(item.hgrkCtgrNo);
	
	if(Utils.isNull(item.ctgrAdmnId)){
		$('#KMST100M input[name=edtCtgrAdmnId]').val("");
	} else {
		$('#KMST100M input[name=edtCtgrAdmnId]').val(item.ctgrAdmnId);
	}
	

	if(item.permUseYn==="Y"){
		$('#KMST100M input[name=edtPermUseYn]').prop('checked', true);
	}else{
		$('#KMST100M input[name=edtPermUseYn]').prop('checked', false);
	}

	if(item.cntntsRegApvNcsyYn==="Y"){
		$('#KMST100M input[name=edtCntntsRegYn]').prop('checked', true);
	}else{
		$('#KMST100M input[name=edtCntntsRegYn]').prop('checked', false);
	}
	
	// Select Box
	// kw---20230607 : lv5 일 경우 게시판으로 고정
	if(item.prsLvl == 5){
		$('#KMST100M input[name=edtCtgrAttrCd]').data("kendoComboBox").value("2");
		$('#KMST100M input[name=edtCtgrAttrCd]').data("kendoComboBox").enable(false);
	} else {
		$('#KMST100M input[name=edtCtgrAttrCd]').data("kendoComboBox").value(item.ctgrAttrCd);
		$('#KMST100M input[name=edtCtgrAttrCd]').data("kendoComboBox").enable(true);
	}
	
	$('#KMST100M input[name=edtCtgrStLrgclasCd]').data("kendoComboBox").value(item.ctgrStLrgclasCd);
	$('#KMST100M input[name=edtCtgrStSmlclasCd]').data("kendoComboBox").value(item.ctgrStSmlclasCd);
	$('#KMST100M input[name=edtDashBrdDispPmssYn]').data("kendoComboBox").value(item.dashBrdDispPmssYn);
	$('#KMST100M input[name=edtDashBrdDispPsnCd]').data("kendoComboBox").value(item.dashBrdDispPsnCd);


	$('#KMST100M input[name=edtCtgrUseAthtCd]').val([item.ctgrUseAthtCd]);

	// Date Picker
	if(item.useTrmStrDd){
		$('#KMST100M input[name=edtUseTrmStrDD]').val(kendo.format("{0:yyyy-MM-dd}",KMST100M_fnSubConvertStringToDate(item.useTrmStrDd)));
	}else{
		$('#KMST100M input[name=edtUseTrmStrDD]').val(kendo.format("{0:yyyy-MM-dd}"));
	}

	if(item.useTrmEndDd){
		$('#KMST100M input[name=edtUseTrmEndDD]').val(kendo.format("{0:yyyy-MM-dd}",KMST100M_fnSubConvertStringToDate(item.useTrmEndDd)));
	}else{
		$('#KMST100M input[name=edtUseTrmEndDD]').val(kendo.format("{0:yyyy-MM-dd}"));
	}
}
// //Subfunction - Data 상세항목 가져오기
function KMST100M_fnSubDataGetEdt(){

	let permUseYn,cntntsRegApvNcsyYn;
	if($('#KMST100M input[name=edtPermUseYn]').is(":checked")){ permUseYn ="Y";}else{ permUseYn ="N";}
	if($('#KMST100M input[name=edtCntntsRegYn]').is(":checked")){ cntntsRegApvNcsyYn ="Y";}else{ cntntsRegApvNcsyYn ="N";}

	let	item = {
		tenantId          : GLOBAL.session.user.tenantId,
		ctgrNo        	  : $('#KMST100M input[name=edtCtgrNo]').val(),
		ctgrNm            : $('#KMST100M input[name=edtCtgrNm]').val(),
		ctgrAttrCd        : $('#KMST100M input[name=edtCtgrAttrCd]').data("kendoComboBox").value(),
		ctgrDesc          : $('#KMST100M textarea[name=edtCtgrDesc]').val(),
		ctgrStLrgclasCd   : $('#KMST100M input[name=edtCtgrStLrgclasCd]').data("kendoComboBox").value(),
		ctgrStSmlclasCd   : $('#KMST100M input[name=edtCtgrStSmlclasCd]').data("kendoComboBox").value(),
		useTrmStrDd       : KMST100M_fnSubConvertDateToString($('#KMST100M input[name=edtUseTrmStrDD]').val()),
		useTrmEndDd       : KMST100M_fnSubConvertDateToString($('#KMST100M input[name=edtUseTrmEndDD]').val()),
		permUseYn         : permUseYn,
		dashBrdDispPmssYn : $('#KMST100M input[name=edtDashBrdDispPmssYn]').data("kendoComboBox").value(),
		dashBrdDispPsnCd  : $('#KMST100M input[name=edtDashBrdDispPsnCd]').data("kendoComboBox").value(),
		ctgrUseAthtCd     : $('#KMST100M input[name=edtCtgrUseAthtCd]:checked').val(),
		ctgrAdmnId        : $('#KMST100M input[name=edtCtgrAdmnId]').val(),
		hgrkCtgrNo    	  : $('#KMST100M input[name=edtCtgrHgrkNo]').val(),
		cntntsRegApvNcsyYn: cntntsRegApvNcsyYn,
	}
	return item;
}
// Subfunction - Grid 줄생성
function KMST100M_fnSubGridAddRow(idx,tenantId,ctgrNo,ctgrTypCd,prsLvl,srtSeq,hgrkCtgrNo,hgrkCtgrNm){

	let gridData = $("#grdKMST100").data("kendoGrid").dataSource.data();
	
	$("#grdKMST100").data("kendoGrid").dataSource.insert(idx,{
		tenantId 		  :tenantId,
		ctgrNo        	  : ctgrNo,    // 채번
		ctgrNm            : '',
		ctgrTypCd         : ctgrTypCd,  // 확인필요
		prsLvl            : prsLvl,      // 복사해서 채번
		srtSeq            : gridData.length,      // ?
		hgrkCtgrNo    	  : hgrkCtgrNo,   // 복사
		hgrkCtgrNm        : hgrkCtgrNm,   // 복사
		ctgrAttrCd        : null,
		ctgrDesc          : null,
		ctgrStLrgclasCd   : "1",
		ctgrStSmlclasCd   : "10",
	})
	
			
	$.each(gridData, function (index, item) {
        let srtSeq = index + 1;
        if(item.srtSeq != srtSeq){
        	item.set("srtSeq", srtSeq);
        }
    });
	
}
// Subfunction - String Date 날짜 형식 변환 ("YYYYMMDD" -> new date(yyyy-mm-dd))
function KMST100M_fnSubConvertStringToDate(responseDate) {
	let year = responseDate.substring(0, 4);
	let month = responseDate.substring(4, 6);
	let day = responseDate.substring(6, 4);
	return new Date(year, (month - 1), day);
}
// Subfunction - String Date 날짜 형식 변환 ("yyyy-mm-dd" -> "YYYYMMDD")
function KMST100M_fnSubConvertDateToString(responseDate) {
	let year = responseDate.substring(0, 4);
	let month = responseDate.substring(5, 7);
	let day = responseDate.substring(8, 10);
	return year+month+day;
}
// Subfunction - 공백교환 (' ' -> '&emsp;')
function KMST100M_fnSubSpaceReplaceHtml(str){
	if(Utils.isNull(str)){
		return "";
	}else{
		return str.replace(/    /gi,"&emsp;");// return str.replace(/
												// /gi,"&nbsp;")
	}
}
// Subfunction - 공백추가 (' ')
function KMST100M_fnSubSpaceAddHtml(str){
	if(Utils.isNull(str)){
		return null;
	}else{
		return "    "+str;// return str.replace(/ /gi,"&nbsp;")
	}
}
// Subfunction - 공백 제거
function KMST100M_fnSubSpaceRemoveHtml(str){
	if(Utils.isNull(str)){
		return null;
	}else{
		return str.replace(/    /gi, "");(str);
	}
}
// //Subfunction - 클릭된 버튼 인덱스 찾기
function KMST100M_fnSubFindIndex(ctgrNo){
	let idx = "";
	for(let i = 0; i<$("#grdKMST100").data("kendoGrid").dataSource.data().length;i++){
		if(ctgrNo==$("#grdKMST100").data("kendoGrid").dataSource.data()[i].ctgrNo){
			idx = i;	break;
		}
	}
	return idx;
}
// Subfunction - 그리드 체크박스 전체 헤제
function KMST100M_fnSubCheckBoxClear(e) {
	let grid = $("#grdKMST100").data("kendoGrid");
	grid.clearSelection();
}
// Subfunction - Tree Data Set
function KMST100M_fnSubChangeTreeData(list) {
	let MappedArr = [];
	for (let item of list) {
		let data = {
			id				: item.ctgrNo,        // 자신 코드
			hgrkCtgrNo  : item.hgrkCtgrNo,
			prsLvl 			: item.prsLvl,
			srtSeq 			: item.srtSeq,
			ctgrNm			: item.ctgrNm,
			items			: [],
		};
		MappedArr.push(data);
	}

	let treeCol = [], MappedElem;
	for (let num in MappedArr) {
		if (MappedArr.hasOwnProperty(num)) {
			MappedElem = MappedArr[num];
			if (MappedElem.hgrkCtgrNo) {// 부모코드가 있는경우
				let hgrkCtgrNo = MappedArr.findIndex(e=>e.id===MappedElem.hgrkCtgrNo); // 부모조직의
																						// 인덱스
																						// 찾기
				MappedArr[hgrkCtgrNo].items.push(MappedElem);
			} else {// 부모코드가 없을경우 -> 최상단
				treeCol.push(MappedElem);
			}
		}
	}
	return treeCol;
}
// Subfunction - Tree data 상에 전체리스트 출력
function KMST100M_fnSubGetChildrenList(selectNodelist){
	let array = []
	let getAllRoles = item => {
		array.push(item);
		if (item.items) {
			return item.items.map(i => getAllRoles(i));
		}
	}
	getAllRoles(selectNodelist);
	return array;
}
// Subfunction - Tree 데이터에서 현재 데이터 검색
function KMST100M_fnGetTreeNode(treedata, prsLvl, ctgrNo)  {
	let data = treedata;
	for (let i=0;prsLvl>i;i++){
		if(data.filter(c=> c.id==ctgrNo).length>0){
			data = data.filter(c=> c.id == ctgrNo);
		}else{
			data = data.flatMap(n => n.items);
		}
	}
	return data;
}
function KMST100M_fnGetChangeTreeNode(treedata, prsLvl,hgrkCtgrNo,srtSeq,flag) {
	let data = treedata;
	for (let i=1 ;prsLvl>i;i++){
		data = data.flatMap(n => n.items);
	}

	if(flag >0){
		return data.filter(c=> c.hgrkCtgrNo === hgrkCtgrNo && c.srtSeq < srtSeq);// 위로
	}else if(flag < 0){
		return data.filter(c=> c.hgrkCtgrNo === hgrkCtgrNo && c.srtSeq > srtSeq);// 아래로
	}else{
		return [];
	}
}
// Subfunction - SrtSeq ASC(buble 정렬)
function KMST100M_fnSubSortSrtSeq(){
	let data =  $("#grdKMST100").data("kendoGrid").dataSource.data();
	for (let i = 0; i < data.length - 1; i++)
	{
		for (let j = 0; j <data.length- 1 - i; j++)
		{
			if (data[j].srtSeq > data[j + 1].srtSeq)
			{
				let temp        = $("#grdKMST100").data("kendoGrid").dataSource.data()[j];
				$("#grdKMST100").data("kendoGrid").dataSource.data()[j]     = $("#grdKMST100").data("kendoGrid").dataSource.data()[j + 1];
				$("#grdKMST100").data("kendoGrid").dataSource.data()[j + 1] = temp;
			}
		}
	}
}

function KMST100M_fnStartDateChange() {
	let startDate = KMST100M_StartDate.value(), endDate = KMST100M_EndDate.value();
	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		KMST100M_EndDate.min(startDate);
	} else if (endDate) {
		KMST100M_StartDate.max(new Date(endDate));
	} else {
		endDate = new Date();
		KMST100M_StartDate.max(endDate);
		KMST100M_EndDate.min(endDate);
	}
}

function KMST100M_fnEndDateChange() {
	var endDate = KMST100M_EndDate.value(), startDate = KMST100M_StartDate.value();
	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		KMST100M_StartDate.max(endDate);
	} else if (startDate) {
		KMST100M_EndDate.min(new Date(startDate));
	} else {
		endDate = new Date();
		KMST100M_StartDate.max(endDate);
		KMST100M_EndDate.min(endDate);
	}
}

// function KMST100M_fnSearchAuth(ctgrNo){
// let save_data = {
// tenantId :GLOBAL.session.user.tenantId,
// ctgrNo : ctgrNo , // 채번
// ctgrUseAthtCd : "2",
// }
// KMST100M_ctgrNoAuth = ctgrNo
// Utils.ajaxCall('/kmst/KMST110SEL01', JSON.stringify(save_data),
// KMST100M_fnDefaultAuth)
// }
//
// function KMST100M_fnDefaultAuth(result) {
// let data = JSON.parse(JSON.parse(JSON.stringify(result.KMST110VOGridInfo)));
// console.log(data)
// if (data.length == 0) {
// // 게시판 생성 시, 시스템 운영자, 시스템 개발자,result.KMST110VOGridInfo 관리자 권한 자동생성 start
// let athtCdList = ["900", "910", "400"]
// let save_list = [];
// athtCdList.forEach(function (val, i) {
// let save_data = {
// tenantId: GLOBAL.session.user.tenantId,
// ctgrNo: KMST100M_ctgrNoAuth, // 채번
// ctgrUseAthtCd: "2",
// athtCd: val,
// athtSeq: -1,
// rdPmssYn: "Y",
// writPmssYn: "Y",
// corcPmssYn: "Y",
// delPmssYn: "Y",
// replyPmssYn: "Y",
// goodPmssYn: "Y",
// apndFileDnldPmssYn: "Y",
// regrId: GLOBAL.session.user.usrId,
// regrOrgCd: GLOBAL.session.user.orgCd,
// lstCorprId: GLOBAL.session.user.usrId,
// lstCorprOrgCd: GLOBAL.session.user.orgCd
// }
// save_list.push(save_data)
// });
//
// let KMST110_save_data = {
// list: save_list,
// ctgrUseAthtCd: 2,
// };
// Utils.ajaxCall('/kmst/KMST110INS01', JSON.stringify(KMST110_save_data));
// // 게시판 생성 시, 시스템 운영자, 시스템 개발자, 관리자 권한 자동생성 end
// }
// }
//

$("#grdKMST100").on('click','tbody tr[data-uid]',function (KMST100M_e) {
	let tr = $(this).closest("tr")
	let item = $("#grdKMST100").data("kendoGrid").dataItem(tr);

	KMST100M_gridCtgrSelIndex = $("#grdKMST100").data("kendoGrid").dataSource.data().indexOf(item);
	KMST100M_fnSelectRowInfo(item);
});

function fnKWTest(){
// console.log($('#KMST100M
// input[name=edtCtgrAttrCd]').data("kendoComboBox").value());
}
//
// //Button Event - 검색 버튼 클릭
// $("#KMST100M_rightDiv").off("click").on("click", function () {
// $("#KMST100M_rightDiv").attr("disabled", true);
//	
// $("div *").find("input,textarea").prop("disabled",true);
// console.log("KMST100M_selItem : " + KMST100M_selItem.isNew());
//
// });

$("#KMST100M_rightDiv").show().off('click').on('click', function () {
	let ctgrNewCheck = KMST100M_fnCtgrNewCheck();
	if(ctgrNewCheck){
		// kw---20230607 : 경고창 추가
		Utils.alert(KMST100M_langMap.get("KMST100M.Message.alert9"));		// Utils.alert("카테고리를
																			// 먼저
																			// 저장해
																			// 주세요.");
		return;
	}
})

// kw---20230607 : 카테고리가 신규인지 체크 (기본설정, 권한 조작을 하기전 현재 선택된 카테고리가 신규인지 체크)
function KMST100M_fnCtgrNewCheck(){
	if(KMST100M_selItem.isNew() == true){
		return true;
	}
	return false;
}
