/*******************************************************************************
 * Program Name : 게시판 만들기(CMMT100M.js) Creator : djjung Create Date : 2022.03.31
 * Description : 게시판 만들기 Modify Desc :
 * -----------------------------------------------------------------------------------------------
 * Date | Updater | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.31 djjung 최초작성
 ******************************************************************************/

var CMMT100M_DataSource;
// var CMMT100M_BtnSerchClick = false;
var CMMT100M_BeforeData=[];
var CMMT100M_StartDate,CMMT100M_EndDate;
var CMMT100M_selItem;

var CMMT100M_grid = new Array(1);				// kw---추가
var CMMT100M_kategorieIndexMax = 1;				// kw---추가
var CMMT100M_gridCtgrSelIndex = 0;				// kw---추가

$(document).ready(function() {

	// 1. 그리드 설정
    for (let i = 0; i < CMMT100M_grid.length; i++) {
    	CMMT100M_grid[i] = {
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
    
	// $('#CMMT100M_Auth').load(GLOBAL.contextPath+"/cmmt/CMMT110S");
	// 1.Common Code Set
	CMMT100M_fnCommCdGet();
	// 2.Grid init
	CMMT100M_fnGridInit();
	// 3.etc kendo init
	CMMT100M_fnEtcInit();
	// 4.Grid hight Setting
	CMMT100M_fnDefaultHightSetting();
	// 5.List Search
	CMMT100M_fnSeachGetList();
	
	$(window).on({'resize': function() {CMMT100M_fnDefaultHightSetting();}});
	
	$('#CMMT100M input[name=edtPermUseYn]').on('click',function(){
		var checked  = $('#CMMT100M input[name=edtPermUseYn]').is(":checked");
		
		if(checked){
			var edtUseTrmStrDD = $('#CMMT100M input[name=edtUseTrmStrDD]').val();
			
			$('#CMMT100M input[name=edtUseTrmStrDD]').val((edtUseTrmStrDD != '') ? edtUseTrmStrDD : Utils.getToday());
			$('#CMMT100M input[name=edtUseTrmEndDD]').val('2099-12-31');
		} else {
			$('#CMMT100M input[name=edtUseTrmStrDD]').val('');
			$('#CMMT100M input[name=edtUseTrmEndDD]').val('');
		}
	});

	// 20240801 :: 게시판명 조회 개선
	$("#CMMT100M_search_ctgrNm").keypress(function(e) {
		var keycode = (e.keyCode ? e.keyCode : e.which);
		if (keycode == '13') {
			CMMT100M_fnFilterSearch()
		}
	});

/*	$("#CMMT100M_search_ctgrNm").on('propertychange change keyup paste input blur', function (e) {
		CMMT100M_fnFilterSearch()
	});*/
})
// 1.Common Code Set
function CMMT100M_fnCommCdGet(){
	let CMMT100M_mgntItemCdList = [
		{"mgntItemCd":"C0003"},
		{"mgntItemCd":"C0054"},
		{"mgntItemCd":"C0055"},
		{"mgntItemCd":"C0056"},
		{"mgntItemCd":"C0057"},
		{"mgntItemCd":"C0058"},
		{"mgntItemCd":"C0059"},
		{"mgntItemCd":"C0060"},
		{"mgntItemCd":"C0061"},
		{"mgntItemCd":"C0062"},
		{"mgntItemCd":"C0194"},
	];
	Utils.ajaxCall('/comm/COMM100SEL01',  JSON.stringify({ "codeList": CMMT100M_mgntItemCdList}),function(data){
		let CMMT100M_commCodeList = JSON.parse(JSON.parse(JSON.stringify(data.codeList)));

		// 게시판 속성
		Utils.setKendoComboBox(CMMT100M_commCodeList, "C0055", '#CMMT100M input[name=edtCtgrAttrCd]', "", "선택");
		Utils.setKendoComboBox(CMMT100M_commCodeList, "C0054", '#CMMT100M input[name=edtCtgrTypCd]', "", "선택");
		// 게시판 상태
		Utils.setKendoComboBox(CMMT100M_commCodeList, "C0056", '#CMMT100M input[name=edtCtgrStLrgclasCd]', "", "선택");
		Utils.setKendoComboBox(CMMT100M_commCodeList, "C0057", '#CMMT100M input[name=edtCtgrStSmlclasCd]', "", "선택");
		// 허용 여부 (글,댓글,좋아요,데시보드)
		Utils.setKendoComboBox(CMMT100M_commCodeList, "C0058", '#CMMT100M input[name=edtAtclWritPmssYn]');
		Utils.setKendoComboBox(CMMT100M_commCodeList, "C0058", '#CMMT100M input[name=edtReplyWritPmssYn]');
		Utils.setKendoComboBox(CMMT100M_commCodeList, "C0058", '#CMMT100M input[name=edtGoodPmssYn]');
		Utils.setKendoComboBox(CMMT100M_commCodeList, "C0058", '#CMMT100M input[name=edtDashBrdDispPmssYn]', "", "선택");
		// 데시보드 표시 위치
		Utils.setKendoComboBox(CMMT100M_commCodeList, "C0059", '#CMMT100M input[name=edtDashBrdDispPsnCd]', "", "선택");
		// 첨부파일 크기 단위 코드
		Utils.setKendoComboBox(CMMT100M_commCodeList, "C0060", '#CMMT100M input[name=edtCtgrApndFileSzUnitCd]');
		Utils.setKendoComboBox(CMMT100M_commCodeList, "C0194", '#CMMT100M input[name=edtCtgrApndFilePmss]', "", "선택");
		// 게시사용 권한
		let useAthtCombo = Utils.setKendoComboBox(CMMT100M_commCodeList, "C0061", '#CMMT100M input[name=edtCtgrUseAthtCd]', "", "선택");
		useAthtCombo.bind("change", CMMT100M_UseAthtChange);
		// 게시 승인여부
		Utils.setKendoComboBox(CMMT100M_commCodeList, "C0062", '#CMMT100M input[name=edtBlthgApvNcsyYn]', "", "선택");
	},null,null,null );
}
// 2.Grid init
function CMMT100M_fnGridInit(){
	CMMT100M_DataSource = {
		transport: {
			read: function (options) {    

                let param = CMMT100M_getParamValue();
                
                $.extend(param, options.data);
               
                Utils.ajaxCall("/cmmt/CMMT100SEL01", JSON.stringify(param), function (result) {
                    options.success(JSON.parse(result.list));
                    
                    // kw---카테고리를 추가할때 카테고리넘버를 넣어주기 위함
                    $.each(JSON.parse(result.list), function(index, item){
                    	if(CMMT100M_kategorieIndexMax <= item.ctgrMgntNo){
                    		CMMT100M_kategorieIndexMax = ++	item.ctgrMgntNo;
                    	}
                    });

                    let gridData = $("#grdCMMT100").data("kendoGrid").dataSource.data()
                	CMMT100M_fnSelectRowInfo(gridData[CMMT100M_gridCtgrSelIndex]);
                });
            },create: function (options) {
				
            	
				$.each(options.data.models, function(index, item){
					item.ctgrNo = parseInt(item.ctgrNo);
					item.srtSeq = parseInt(item.srtSeq);
					item.ctgrNm = item.ctgrNm.replace(/\    /g, ''); 
				});
				
                Utils.ajaxCall("/cmmt/CMMT100INS01", JSON.stringify({
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
            			lstCorprId		: GLOBAL.session.user.usrId,					//GLOBAL.session.user.usrId,
            			lstCorcOrgCd	: GLOBAL.session.user.orgCd							//GLOBAL.session.user.orgCd
            	}
                
            	$.each(updateList, function (index, item) {
            		$.extend(item, regInfo);
            	});            	
            	
            	
            	Utils.ajaxCall("/cmmt/CMMT100UPT01", JSON.stringify({
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
            	CMMT100M_fnSeachGetList();
            }
		},
		
		batch: true,
		schema : {
			type: "json",
			model: {
				id : 'idx',
				fields: {
					radio				: { field: "radio", type: "string" ,  editable: false},
					tenantId			: {field: "tenantId", 		type: "string"},
					ctgrAttrCd			: {field: "ctgrAttrCd", 		type: "string"},	
					ctgrNm				: {field: "ctgrNm", 		type: "string"},
					ctgrMgntNo			: {field: "ctgrMgntNo", 		type: "string"},
					dirty				: {field: "dirty", 		type: "string"},
					hgrkCtgrMgntNm		: {field: "hgrkCtgrMgntNm", 		type: "string"},
					hgrkCtgrMgntNo		: {field: "hgrkCtgrMgntNo", 		type: "string"},
					id					: {field: "id", 		type: "string"},
					prsLvl				: {field: "prsLvl", 		type: "string"},
					srtSeq				: {field: "srtSeq", 		type: "string"},
				}
			}
		}
	}

	CMMT100M_grid[0] = $("#grdCMMT100").kendoGrid({
		dataSource: CMMT100M_DataSource,
		autoBind: false,
		sortable: false,
		resizable : true,
		persistSelection : true,
		selectable: "row",
		noRecords: { template: '<div class="nodataMsg"><p>'+CMMT100M_langMap.get("grid.nodatafound")+'</p></div>' },
		columns: [
			{
				width: 40, field: "radio", title: CMMT100M_langMap.get("CMMT100M.grid.select"), template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',  editable: false
			},
			{
				title: CMMT100M_langMap.get("CMMT100M.grid.tilte.state"),
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
					var htmlBtn = CMMT100M_fnAddRowTemplate(dataItem.ctgrNm);
					return htmlBtn;
				},
				width: 45,
				editable: function (dataItem) {
                    return false;
                }
			},
			{
				template: function(dataItem){
					var htmlBtn = "";
					if(dataItem.prsLvl == 1){
						htmlBtn = CMMT100M_fnAddDownRowTemplate(dataItem.ctgrNm, dataItem.ctgrAttrCd, dataItem.prsLvl);
					}
					return htmlBtn;
				},
				width: 45,
				editable: function (dataItem) {
                    return false;
                }
			},
			{
				field: "ctgrNm" ,
				title:  CMMT100M_langMap.get("CMMT100M.grid.tilte.CtgrNm"),
				attributes: {
					"class": "k-text-left",
				},
				template: function(dataItem){
					var htmlBtn = "";
					if(dataItem.prsLvl >= 2){
						htmlBtn = CMMT100M_fnAddDownRowTemplate(dataItem.ctgrNm, dataItem.ctgrAttrCd, dataItem.prsLvl);
					}
					return htmlBtn + dataItem.ctgrNm;
				},
			},
			{
				template :'#=CMMT100M_fnSelectRowTemplate(ctgrNm)#',
				width: 45,
				editable: function (dataItem) {
                    return false;
                }
			},
		],
		beforeEdit: function(e) {// 셀 수정모드 진입시 공백제거
			let str=e.model.ctgrNm;
			for(let i=1; i<e.model.prsLvl;i++){
				str = CMMT100M_fnSubSpaceRemoveHtml(str);
			}
			e.model.ctgrNm=str;
		},
		edit: function (e) { // 셀 수정모드 종료시 공백추가 //JDJ 키입력시 수정안됨 추후수정필요
			let str=e.model.ctgrNm;
			for(let i=1; i<e.model.prsLvl;i++){
				str = CMMT100M_fnSubSpaceAddHtml(str);
			}
			e.model.ctgrNm=str;
		},
		change: function(e) {
			let gridData = $("#grdCMMT100").data("kendoGrid").dataSource.data()
			CMMT100M_selItem = gridData[CMMT100M_gridCtgrSelIndex]
		},
		dataBinding: function () {
			
        },
	}).data("kendoGrid");
	
	Utils.setKendoGridDoubleClickAction("#grdCMMT100");
	
	$("#grdCMMT100").data("kendoGrid").hideColumn("srtSeq"); // hidden Colum
}
// 3.Etc kendo init
function CMMT100M_fnEtcInit(){
	CMMT100M_StartDate = $('#CMMT100M input[name=edtUseTrmStrDD]').kendoDatePicker({
		value: new Date(),
		format: "yyyy-MM-dd",
		change: CMMT100M_fnStartDateChange,
		footer: false,
		culture: "ko-KR",
	}).data("kendoDatePicker");

	CMMT100M_EndDate = $('#CMMT100M input[name=edtUseTrmEndDD]').kendoDatePicker({
		value: new Date(),
		format: "yyyy-MM-dd",
		change: CMMT100M_fnEndDateChange,
		footer: false,
		culture: "ko-KR",
	}).data("kendoDatePicker");

	CMMT100M_StartDate.max(CMMT100M_EndDate.value());
	CMMT100M_EndDate.min(CMMT100M_StartDate.value());
}
// 4.Grid hight Setting
function CMMT100M_fnDefaultHightSetting(){
	let screenHeight = $(window).height();
	$("#grdCMMT100").data("kendoGrid").element.find('.k-grid-content').css('height', screenHeight-412);
}
// CallEvent - 목록 조회
function CMMT100M_fnSeachGetList(){

	//kw---20230531 : 카테고리 리스트 조회
	CMMT100M_grid[0].clearSelection();
	CMMT100M_grid[0].currentItem = new Object();
	CMMT100M_grid[0].dataSource.read();

	// 20240801 :: 게시판명 조회 개선
	let ctgrNm = $("#CMMT100M_search_ctgrNm").val();
	if(Utils.isNotNull(ctgrNm))
	{
		let isCheck = true;
		$(CMMT100M_grid[0].dataSource.data()).each(function (i, item) {
			if(item.ctgrNm.includes(ctgrNm)) {
				CMMT100M_grid[0].tbody.find("tr:eq("+i+")").trigger("click");
				isCheck = false;
			}
		});

		if(isCheck) Utils.alert("조회하신 게시판명이 없습니다.");
	}
}

//kw---추가
function CMMT100M_fnAuthGridLoad(){
	//kw--- 20230531 : 카테고리 권한 그리드
	$('#CMMT100M_Auth').empty();
	$('#CMMT100M_Auth').load(GLOBAL.contextPath+"/cmmt/CMMT110S");
}

// kw---20230531 : 카테고리 조회 파라미터
function CMMT100M_getParamValue(){
	return{
		tenantId 	: GLOBAL.session.user.tenantId,
	}
}

// Call Back - 저장,수정,삭제 콜백 처리 Function
function CMMT100M_fnCallBackReulst(result){
	Utils.alert(result.msg);
	if(result.result>0){
		CMMT100M_fnSeachGetList();
		// 해당 게시판 권한 조회
		// CMMT100M_fnSearchAuth(result.result);
	}
}
// ComboEvent - 권한 콤보 박스 이벤트
function CMMT100M_UseAthtChange(num){
	let value = Utils.isObject(num) ? $('#CMMT100M input[name=edtCtgrUseAthtCd]').data("kendoComboBox").value() : num;

	$('#CMMT100M_Auth').empty();
	if(value == 1){
		$('#CMMT100M_Auth').load(GLOBAL.contextPath+"/cmmt/CMMT110S");
	}else if(value ==2){
		$('#CMMT100M_Auth').load(GLOBAL.contextPath+"/cmmt/CMMT120S");
	}else if(value ==3){
		$('#CMMT100M_Auth').load(GLOBAL.contextPath+"/cmmt/CMMT130S");
	}else {
		$('#CMMT100M_Auth').load(GLOBAL.contextPath+"/cmmt/CMMT110S");
	}
}

// ======================================================================================================================
// Button Disable Enable - Grid 내부
function CMMT100M_fnAddRowTemplate(ctgrNm) {
	if(Utils.isNull(CMMT100M_fnSubSpaceRemoveHtml(ctgrNm))){
		return "<button type='button' class='btnRefer_default icoType k-icon k-i-sort-desc-sm' onclick='CMMT100M_fnAddRow(this)' disabled> </button> ";
	}else{
		return "<button type='button' class='btnRefer_default icoType k-icon k-i-sort-desc-sm' onclick='CMMT100M_fnAddRow(this)' > </button> ";
	}
}
function CMMT100M_fnAddDownRowTemplate(ctgrNm,ctgrAttrCd,prsLvl) {
	let input;
	let addBtnMargin = 0;
	if(prsLvl >= 3){
		addBtnMargin = (prsLvl-2) * 30;
	}
	if(Utils.isNull(CMMT100M_fnSubSpaceRemoveHtml(ctgrNm))){
		if(prsLvl >= 5){
			return "<button type='button' class='btnRefer_default icoType icoComp_levelDownContentIcon' onclick='CMMT100M_fnAddDownRow(this)' style='margin-left:" + addBtnMargin + "px; cursor:default	;' disabled></button> ";
		}
		return "<button type='button' class='btnRefer_default icoType icoComp_levelDown' onclick='CMMT100M_fnAddDownRow(this)' style='margin-left:" + addBtnMargin + "px;' disabled></button> ";
	}else if(prsLvl >= 5){
		return "<button type='button' class='btnRefer_default icoType icoComp_levelDownContentIcon' onclick='CMMT100M_fnAddDownRow(this)' style='margin-left:" + addBtnMargin + "px; cursor:default	;' disabled></button> ";
	}else if(ctgrAttrCd==="2"){// 1:카테고리,2:게시판
		return "<button class='btnRefer_default icoType icoComp_levelDownContentIcon' style='margin-left:" + addBtnMargin + "px; cursor:default;' disabled></button> ";
	}else{
		return"<button type='button' class='btnRefer_default icoType icoComp_levelDown' onclick='CMMT100M_fnAddDownRow(this)' style='margin-left:" + addBtnMargin + "px;'></button> ";
	}
}
function CMMT100M_fnSelectRowTemplate(ctgrNm) {
	if(Utils.isNull(CMMT100M_fnSubSpaceRemoveHtml(ctgrNm))){
		return "<button type='button' class='k-icon k-i-zoom-in' onclick='CMMT100M_fnSelectRow(this)' title='상세보기' disabled></button>";
	}else{
		return "<button type='button' class='k-icon k-i-zoom-in' onclick='CMMT100M_fnSelectRow(this)' title='상세보기' ></button> ";
	}
}
// Button Disable Enable - Main
function CMMT100M_fnButtonEnableDisable(){

}


// ======================================================================================================================
// Button Event - 검색 버튼 클릭
$("#CMMT100M button[name=btnInq]").off("click").on("click", function () {
	CMMT100M_fnFilterSearch()
});

function  CMMT100M_fnFilterSearch(){
	let ctgrNm = $("#CMMT100M_search_ctgrNm").val();
	Utils.kendoGridFilter($("#grdCMMT100").data("kendoGrid").dataSource , [{field:'ctgrNm' , operator : 'contains' , value : ctgrNm}])
}


// Button Event - ↑ 버튼 클릭
$("#CMMT100M button[name=btnGridUp]").off("click").on("click", function () {
	let grid = $("#grdCMMT100").data("kendoGrid");
	let select = grid.select()[0];
	let item = grid.dataItem(select);

	if(grid.select().length===1){
		// 1개 선택
		let gridData = $("#grdCMMT100").data("kendoGrid").dataSource.data()		
		let selectTopData = gridData[item.srtSeq-2];	//선택된 아이템 보다 한칸 위에 있는 데이터
		
		let topSeq = 0;		//변경될 순서 번호
		let topData;		//변경될 아이템의 상위
		
		let arrTargetSeq = [];	//변경뒬 순서들의 배열	-선택된 아이템과(하위까지포함), 변경될 아이템(하위까지 포함)
		
		//맨 위에 있을 경우
		if(Utils.isNull(selectTopData)){
			Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.alert1"));		//"선택된 카테고리는 더 이상 위로 이동할 수 없습니다."
			return;
		}
		else if(item.prsLvl > selectTopData.prsLvl){		//선택된 아이템 위에 상위 레벨이 있을 경우
			Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.alert1"));		//"선택된 카테고리는 더 이상 위로 이동할 수 없습니다."
			return;
		}
		
		
		//선택된 아이템 위에 상위 데이터를 찾는다. 즉 선택된 아이템 위에 하위 레벨이 있을 경우 건너띄어서 선택된 아이템과 동일한 레벨의 아이템을 찾는다. 
		for(var i=2; i<=item.srtSeq; i++){
			let gridTopData = gridData[item.srtSeq-i];
			
			if(item.prsLvl == gridTopData.prsLvl){
				topSeq = gridTopData.srtSeq;
				topData = gridTopData;

				arrTargetSeq[item.srtSeq] = topSeq++; 
				break;
			}
		}
		
		
		
		//선택된 아이템의 속한 하위 레벨들을 판별하기 위함
		let ctgrNoCheck = [];
		ctgrNoCheck[item.prsLvl] = item.ctgrMgntNo;
		
		$.each(gridData, function(index, gridList){
			if(ctgrNoCheck[gridList.prsLvl-1] == gridList.hgrkCtgrMgntNo){
				arrTargetSeq[gridList.srtSeq] = topSeq++;
				ctgrNoCheck[gridList.prsLvl] = gridList.ctgrMgntNo;
			}
		});
		
		//선택돤 아이템에 속한 하위 레벨들을 판별하기 위함
		let chageNoCheck = [];
		
		//선택된 아이템의 레벨
		chageNoCheck[topData.prsLvl] = topData.ctgrMgntNo;
		
		arrTargetSeq[topData.srtSeq] = topSeq++;
		
		$.each(gridData, function(index, gridList){
			//위에있는 데이터가 선택된 아이템의 레벨보다
			if(chageNoCheck[gridList.prsLvl-1] == gridList.hgrkCtgrMgntNo){
				arrTargetSeq[gridList.srtSeq] = topSeq++;
				chageNoCheck[gridList.prsLvl] = gridList.ctgrMgntNo;
			}
		});
		
		//kw---20230525 : 카테고리 순서 체크 - 순서가 변경되면 상태칸에 [수정]이 뜨도록 하고 DB에 순서를 업데이트 하기 위함
	    $.each(grid.dataSource.data(), function (index, item) {
	        let srtSeq = index + 1;
	        if (Utils.isNull(arrTargetSeq[index+1])) {
	            item.set("srtSeq", parseInt(srtSeq));
	        } else {
	        	item.set("srtSeq", parseInt(arrTargetSeq[index+1]));
	        }
	    });
	    
	    //kw 변경된 데이터소스를 srtSeq 순서로 정렬
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


		CMMT100M_gridCtgrSelIndex = $("#grdCMMT100").data("kendoGrid").dataSource.data().indexOf(item);

		$("#grdCMMT100").data("kendoGrid").dataSource.data([]);
		$("#grdCMMT100").data("kendoGrid").dataSource.data(resultList);
	}else{//0개선택,다중선택 return
//		Utils.alert(KMST100M_langMap.get("CMMT100M.Message.to.many.select"));
	}
});
// Button Event - ↓ 버튼 클릭
$("#CMMT100M button[name=btnGridDown]").off("click").on("click", function () {
	let grid = $("#grdCMMT100").data("kendoGrid");
	let select = grid.select()[0];
	let item = grid.dataItem(select);

	if(grid.select().length===1){
		let gridData = $("#grdCMMT100").data("kendoGrid").dataSource.data()
		
		let downSeq;		//변경될 순서 번호
		let downData;		//변경될 아이템의 번호
		
		let arrTargetSeq = [];	//변경뒬 순서들의 배열	-선택된 아이템과(하위까지포함), 변경될 아이템(하위까지 포함)

		let selectDownData = gridData[item.srtSeq];		//선택된 아이템 보다 한칸 위에 있는 데이터
		
		//맨 밑에 있을 경우
		if(Utils.isNull(selectDownData)){
			Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.alert2"));	//Utils.alert("선택된 카테고리는 더 이상 아래로 이동할 수 없습니다.");
			return;
		}
		else if(item.prsLvl > selectDownData.prsLvl){	//선택된 아이템 밑에 상위 레벨이 있을 경우
			Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.alert2"));	//Utils.alert("선택된 카테고리는 더 이상 아래로 이동할 수 없습니다.");
			return;
		}
		
		let itemDownCount = gridData.length - item.srtSeq;
		let downGroupNum;
		
		for(var i=0; i<=itemDownCount; i++){
			let gridTopData = gridData[parseInt(item.srtSeq)+i];
			
			//맨밑에 일 경우
			if(Utils.isNull(gridTopData)){
				Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.alert2"));	//Utils.alert("선택된 카테고리는 더 이상 아래로 이동할 수 없습니다.");
				return;
			}
			
			//kw---선택된 아이템보다(하위그룹 제외) 밑에 있는 데이터가 자신보다 레벨이 높으면 return; / 자신과 같으면 순서변경
			//레벨이 높다는건 1 > 2 > 3... 순이기 때문에 조건문에는 이와 반대로 입력
			if(item.prsLvl > gridTopData.prsLvl){
				Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.alert2"));	//Utils.alert("선택된 카테고리는 더 이상 아래로 이동할 수 없습니다.");
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
		
		//----변경될 놈의 자식까지 순서 부여하기
		let changeItemCount = item.srtSeq;
		let chageNoCheck = [];
		chageNoCheck[downData.prsLvl] = downData.ctgrMgntNo;
		
		arrTargetSeq[downData.srtSeq] = downSeq++;
		changeItemCount++;
		
		$.each(gridData, function(index, gridList){
			if(chageNoCheck[gridList.prsLvl-1] == gridList.hgrkCtgrMgntNo){
				arrTargetSeq[gridList.srtSeq] = downSeq++;
				chageNoCheck[gridList.prsLvl] = gridList.ctgrMgntNo;
				changeItemCount++;
			}
		});
		
		arrTargetSeq[item.srtSeq] = changeItemCount++;
		//----변경될 놈의 자식까지 순서 부여하기
		
		
		//-------- 선택된 놈의 자식까지 순서 부여하기
		let ctgrNoCheck = [];
		ctgrNoCheck[item.prsLvl] = item.ctgrMgntNo;
		
		$.each(gridData, function(index, gridList){
			if(ctgrNoCheck[gridList.prsLvl-1] == gridList.hgrkCtgrMgntNo){
				arrTargetSeq[gridList.srtSeq] = changeItemCount++;
				ctgrNoCheck[gridList.prsLvl] = gridList.ctgrMgntNo;
			}
		});
		//-------- 선택된 놈의 자식까지 순서 부여하기
		
		//kw---20230525 : 카테고리 순서 체크 - 순서가 변경되면 상태칸에 [수정]이 뜨도록 하고 DB에 순서를 업데이트 하기 위함
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

		CMMT100M_gridCtgrSelIndex = $("#grdCMMT100").data("kendoGrid").dataSource.data().indexOf(item);

		$("#grdCMMT100").data("kendoGrid").dataSource.data([]);
		$("#grdCMMT100").data("kendoGrid").dataSource.data(resultList);
	}else{// 0개선택,다중선택 return
		Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.to.many.select"));

	}
});
// Button Event - + 버튼 클릭
$("#CMMT100M button[name=btnGridRowAdd]").off("click").on("click", function () {

	// if(!CMMT100M_BtnSerchClick){
	// Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.no.search.data"));
	// return;
	// }

	if( $("#grdCMMT100").data("kendoGrid").dataSource.data().length==0){// 최초생성시
		// insert Rwo
		CMMT100M_fnSubGridAddRow(0,GLOBAL.session.user.tenantId,
				CMMT100M_kategorieIndexMax,"1",1,1,null,null);

		$("#grdCMMT100").data("kendoGrid").editRow("tr:eq(1)");
		$("#grdCMMT100").data("kendoGrid").select("tr:eq(0)");
	}else{ // 추가생성시
		// 상세정보 초기화
		CMMT100M_fnDataSetEdt(null,true);
		// 고정된 임의 게시판 번호 및 정렬번호 부여 -> 저장시 교환
		let idx =$("#grdCMMT100").data("kendoGrid").dataSource.data().length;
		
		CMMT100M_fnSubGridAddRow(idx
				,GLOBAL.session.user.tenantId,CMMT100M_kategorieIndexMax++ ,"1",1,idx,0,"");
		
		// 추가한 행 선택
		$("#grdCMMT100").data("kendoGrid").select("tr:eq("+idx+")");
//		$("#grdCMMT100").data("kendoGrid").editRow("tr:eq("+(idx+1)+")");
	}
	
	let gridData = $("#grdCMMT100").data("kendoGrid").dataSource.data();
	CMMT100M_fnSelectRowInfo(gridData[CMMT100M_grid[0].select().index()]);
	
});
// Button Event - 그리드내부의 추가 버튼 클릭
function CMMT100M_fnAddRow(obj){
	CMMT100M_fnDataSetEdt(null,true);

	let tr = $(obj).closest("tr");
	let item = $("#grdCMMT100").data("kendoGrid").dataItem(tr);
	let idx = CMMT100M_fnSubFindIndex(item.ctgrMgntNo);

	//kw---20230531 : 하위로 추가 할때 바로 밑으로 추가하기 위함 (다른 항목이 선택된 상태에서 버튼을 누르면 선택되어있는 항목 밑으로 들어감)
	let grid = $("#grdCMMT100").data("kendoGrid");
	$.each(grid.dataSource.data(), function (index, gridItem) {
		if(gridItem.uid == item.uid){
			$("#grdCMMT100").data("kendoGrid").select("tr:eq(" + index + ")");
		}
    });
	
	//kw---20210602 : 동일레벨 밑으로들어게 하기 위함(선택된 아이템에 하위 그룹이 있으면 하위 그룹을 건너띄고 그 밑에 들어가게하기 위함)
	let gridData = $("#grdCMMT100").data("kendoGrid").dataSource.data()
	let downSeq=1;
	let ctgrNoCheck = [];
	ctgrNoCheck[item.prsLvl] = item.ctgrMgntNo;
	$.each(gridData, function(index, gridList){
		if(ctgrNoCheck[gridList.prsLvl-1] == gridList.hgrkCtgrMgntNo){
			downSeq++;
			ctgrNoCheck[gridList.prsLvl] = gridList.ctgrMgntNo;
		}
	});
	
	if(Utils.isNull(item.ctgrMgntNo)){
		idx = CMMT100M_grid[0].select().index() + 1;
	} else {
		idx = parseInt(item.srtSeq) + downSeq - 1;
	}
	
	let prsLvl = parseInt(item.prsLvl);
	
	CMMT100M_fnSubGridAddRow(idx
		,GLOBAL.session.user.tenantId,CMMT100M_kategorieIndexMax++ ,"1",prsLvl,-1,item.hgrkCtgrMgntNo,item.hgrkCtgrMgntNm);

//	$("#grdCMMT100").data("kendoGrid").editRow("tr:eq("+(idx + 2)+")");
	$("#grdCMMT100").data("kendoGrid").select("tr:eq("+(idx)+")");

}
// Button Event - 그리드내부의 아래 추가 버튼 클릭
function CMMT100M_fnAddDownRow(obj){
	CMMT100M_fnDataSetEdt(null,true);

	let tr = $(obj).closest("tr");
	let item = $("#grdCMMT100").data("kendoGrid").dataItem(tr);
	let idx = CMMT100M_fnSubFindIndex(item.ctgrMgntNo);
	
	//kw---20230531 : 하위로 추가 할때 바로 밑으로 추가하기 위함 (다른 항목이 선택된 상태에서 버튼을 누르면 선택되어있는 항목 밑으로 들어감)
	let grid = $("#grdCMMT100").data("kendoGrid");
	$.each(grid.dataSource.data(), function (index, gridItem) {
		if(gridItem.uid == item.uid){
			$("#grdCMMT100").data("kendoGrid").select("tr:eq(" + index + ")");
		}
    });
	
	if(Utils.isNull(item.ctgrMgntNo)){
		idx = CMMT100M_grid[0].select().index();
	} else {
		idx = CMMT100M_fnSubFindIndex(item.ctgrMgntNo);
	}
	
	let prsLvl = parseInt(item.prsLvl)+1;

	CMMT100M_fnSubGridAddRow(idx+1
		,GLOBAL.session.user.tenantId,CMMT100M_kategorieIndexMax++ ,1,prsLvl,-1,item.ctgrMgntNo,item.ctgrNm);

	$("#grdCMMT100").data("kendoGrid").editRow("tr:eq("+(idx + 2)+")");
	$("#grdCMMT100").data("kendoGrid").select("tr:eq("+(idx + 1)+")");
}
// Button Event - 그리드내부의 상세 조회 버튼 클릭
function CMMT100M_fnSelectRow(obj){
	let tr = $(obj).closest("tr");
	let item = $("#grdCMMT100").data("kendoGrid").dataItem(tr);
	CMMT100M_fnSelectRowInfo(item);
}

// kw---추가
function CMMT100M_fnSelectRowInfo(item){
	if(!Utils.isNull(item)){
		
		if(item.hasOwnProperty("abolDtm")){
			let CMMT100M_jsonStr = {
				tenantId : GLOBAL.session.user.tenantId,
				ctgrMgntNo : item.ctgrMgntNo,
			}
			// 체크박스 클리어
			CMMT100M_fnSubCheckBoxClear();

			Utils.ajaxCall('/cmmt/CMMT100SEL02', JSON.stringify(CMMT100M_jsonStr), function(result){

				let data =JSON.parse(JSON.parse(JSON.stringify(result.CMMT100VOInfo)));
				CMMT100M_fnDataSetEdt(null,true);
				CMMT100M_fnDataSetEdt(data,false);

				CMMT100M_UseAthtChange(data.ctgrUseAthtCd);

				// 버튼 사이드 선택시 로우 선택안될경우
				let idx = CMMT100M_fnSubFindIndex(data.ctgrMgntNo);
				$("#grdCMMT100").data("kendoGrid").select("tr:eq("+(idx)+")");
			},false,false,false);
		} else {
			CMMT100M_fnDataSetEdt(null,true);
			$('#CMMT100M input[name=edtCtgrMgntNo]').val(9999);
			CMMT100M_UseAthtChange(null);
		}
	}
}

// Button Event - Grid 저장 버튼 클릭
$("#CMMT100M button[name=btnGridSave]").off("click").on("click", function () {
	
	//kw---20230531 그리드 순서 정렬
	let grid = $("#grdCMMT100").data("kendoGrid");
	$.each(grid.dataSource.data(), function (index, item) {
        let srtSeq = index + 1;
        if(item.srtSeq != srtSeq){
        	item.set("srtSeq", srtSeq);
        }
    });
	
	let isValid = true;
    
    let insertInfo = {
    	regrId: GLOBAL.session.user.usrId,					//,GLOBAL.session.user.usrId,
    	regrOrgCd: GLOBAL.session.user.orgCd,						//,GLOBAL.session.user.orgCd,
    	lstCorprId: GLOBAL.session.user.usrId,					//,GLOBAL.session.user.usrId,
    	lstCorcOrgCd: GLOBAL.session.user.orgCd,						//,GLOBAL.session.user.orgCd,
    }
    
    $.each(CMMT100M_grid[0].dataSource.data(), function (index, item) {
    	$.extend(item, insertInfo);
    });
    
    if (isValid) {
        Utils.confirm(CMMT100M_langMap.get("CMMT100M.Message.do.you.want.save"), function () {
        	CMMT100M_grid[0].dataSource.sync().then(function (result) {
        		Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.alert3"));	//Utils.alert("저장되었습니다.");
        	});
        });
    }
});
// Button Event - Grid 삭제 버튼 클릭
$("#CMMT100M button[name=btnGridDelete]").off("click").on("click", function () {
	
	let grid = $("#grdCMMT100").data("kendoGrid");
	let select = grid.select()[0];
	let item = grid.dataItem(select);
	let chngSelect =  CMMT100M_selItem;

	if(Utils.isNull(select) && Utils.isNull(CMMT100M_selItem)){// 선택된 Row 없음
		Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.can.not.delete.data.is.empty"));
	}else{
		let item = CMMT100M_selItem;
		
		//kw--20230607 : 삭제버튼 클릭시 하위 아이템이 있는지 확인, 있으면 return
		let ctgrDownEmpty = false;
		$.each(grid.dataSource.data(), function (index, gridItem) {
			if(gridItem.hgrkCtgrMgntNo == item.ctgrMgntNo){
				ctgrDownEmpty = true;
				return false;
			}
	    });
		
		if(ctgrDownEmpty == true){
			//kw---20230607 : 알림창 추가 - 하위 카테고리를 먼저 삭제한 후 다시 시도해주세요.
			Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.alert10"));		//Utils.alert("카테고리를 먼저 저장해 주세요.");
			return;	
		}
		//kw--20230607 : 삭제버튼 클릭시 하위 아이템이 있는지 확인, 있으면 return 끝
		
		if (item.isNew()){ // 선택 Row Grid 삭제
			item.ctgrMgntNo = 0;
			Utils.confirm(CMMT100M_langMap.get("CMMT100M.Message.do.you.want.delete"),function(){
				let selRow = grid.tbody.find("tr[data-uid='" + chngSelect.uid + "']");
				grid.removeRow(selRow);
			});
		}else { // DB 삭제
			
			 Utils.confirm(CMMT100M_langMap.get("CMMT100M.Message.do.you.want.delete"), function () {
				 
				 let removeRow = {
					 tenantId: item.tenantId,
					 ctgrMgntNo: item.ctgrMgntNo,
				 };
				 Utils.ajaxCall('/cmmt/CMMT100DEL01', JSON.stringify(removeRow), function(result){
					 if(result.result>0){
						//kw---20230607 - success.common.delete - 정상적으로 삭제되었습니다.
						Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.alert4"));	//Utils.alert("정상적으로 삭제되었습니다.");
						
						CMMT100M_gridCtgrSelIndex = 0;
						
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
							CMMT100M_grid[0].dataSource.sync();
						} else {
							CMMT100M_grid[0].dataSource.read();
						}
					 }
				 });
			 });
		 }

	}


});
// Button Event - 상세 저장 버튼 클릭
$("#CMMT100M button[name=btnDetailSave]").off("click").on("click", function () {

	let ctgrNewCheck = CMMT100M_fnCtgrNewCheck();
	if(ctgrNewCheck){
		return;
	}
	
	let item = CMMT100M_fnSubDataGetEdt();
	
	//kw---20230705 : 카테고리 기본설정 예외처리
	if(!Utils.isNull(item)){
		if(Utils.isNull(item.ctgrTypCd)){
			Utils.alert("게시판유형을 선택해 주세요.");		//Utils.alert("카테고리를 먼저 저장해 주세요.");
			return;
		}
		if(Utils.isNull(item.ctgrUseAthtCd)){
			Utils.alert("게시판사용권한을 선택해 주세요.");		//Utils.alert("카테고리를 먼저 저장해 주세요.");
			return;
		}
		if(Utils.isNull(item.ctgrAttrCd)){
			Utils.alert("게시판속성을 선택해 주세요.");		//Utils.alert("카테고리를 먼저 저장해 주세요.");
			return;
		}
		
	} else {
		return;
	}

	//kw---20230703 : 게시판 속성 변경시 하위 아이템이 있는지 체크
	let returnYn = 0;
	let gridData = $("#grdCMMT100").data("kendoGrid").dataSource.data()

	if(gridData[CMMT100M_gridCtgrSelIndex].ctgrAttrCd == "1" && gridData[CMMT100M_gridCtgrSelIndex].ctgrAttrCd != item.ctgrAttrCd){		//kw---20230703 : 카테고리->게시물
		//kw---20230703 : 하위 아이템이 있는지 체크
		$.each(gridData, function (index, item) {
	        let srtSeq = index + 1;
	        if(gridData[CMMT100M_gridCtgrSelIndex].ctgrMgntNo == item.hgrkCtgrMgntNo){
	        	returnYn = 1;
	        	return false;
	        }
	    });
	} else if(gridData[CMMT100M_gridCtgrSelIndex].ctgrAttrCd == "2" && gridData[CMMT100M_gridCtgrSelIndex].ctgrAttrCd != item.ctgrAttrCd){	//kw---20230703 : 게시물 -> 카테고리
		if(gridData[CMMT100M_gridCtgrSelIndex].tbmCount > 0){
			returnYn = 2;
		}
	}

	if(returnYn > 0){
		if(returnYn == 1){
			Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.alert10"));		//Utils.alert("카테고리를 먼저 저장해 주세요.");
		} else {
			Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.alert11"));		//Utils.alert("현재 선택하신 게시물에는 게시글이 존재합니다.<br>게시글을 삭제한 후 다시 시도해 주세요.");
		}
		//kw---20230703 : 게시판속성 변경 실패시 변경 전 값으로 복구
		$('#CMMT100M input[name=edtCtgrAttrCd]').data("kendoComboBox").value(gridData[CMMT100M_gridCtgrSelIndex].ctgrAttrCd);
		return;
	}
	//kw---20230703 : 게시판 속성 변경시 하위 아이템이 있는지 체크 끝


	//shpark 20240828 : 게시승인 필요여부 필요 선택시 게시판 관리자 선택 안하면 저장 안되도록 수정
	if(item.blthgApvNcsyYn == "Y" && item.ctgrAdmnId == ""){
		Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.notCtgrAdmnId"));
		return;
	}

	Utils.confirm(CMMT100M_langMap.get("CMMT100M.Message.do.you.want.save"),function(){
		if(Utils.isNull(item.tenantId)||Utils.isNull(item.ctgrMgntNo)){
			Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.can.not.save.data.is.empty"));
			return;
		}

		let updateRow = {
			tenantId  		  : item.tenantId,
			ctgrMgntNo		  : item.ctgrMgntNo,
			ctgrTypCd		  : item.ctgrTypCd,
			ctgrNm    		  : item.ctgrNm,
			hgrkCtgrMgntNo    : item.hgrkCtgrMgntNo,
			hgrkCtgrMgntNm    : item.hgrkCtgrMgntNm,
			ctgrAttrCd        : item.ctgrAttrCd,
			ctgrDesc          : item.ctgrDesc,
			ctgrStLrgclasCd   : item.ctgrStLrgclasCd,
			ctgrStSmlclasCd   : item.ctgrStSmlclasCd,
			useTrmStrDd       : item.useTrmStrDd,
			useTrmEndDd       : item.useTrmEndDd,
			permUseYn         : item.permUseYn,
			atclWritPmssYn    : item.atclWritPmssYn,
			replyWritPmssYn   : item.replyWritPmssYn,
			goodPmssYn        : item.goodPmssYn,
			alrmUseYn         : item.alrmUseYn,
			dashBrdDispPmssYn : item.dashBrdDispPmssYn,
			dashBrdDispPsnCd  : item.dashBrdDispPsnCd,
			apndFilePmss      : item.apndFilePmss,
			apndFileSzUnitCd  : item.apndFileSzUnitCd,
			apndFileMaxSz     : item.apndFileMaxSz,
			apndFileAllSz     : item.apndFileAllSz,
			ctgrUseAthtCd     : item.ctgrUseAthtCd,
			ctgrAdmnId        : item.ctgrAdmnId,
			blthgApvNcsyYn    : item.blthgApvNcsyYn,

			lstCorprId 		: GLOBAL.session.user.usrId,
			lstCorcOrgCd	: GLOBAL.session.user.orgCd,
		};
		Utils.ajaxCall('/cmmt/CMMT100UPT02', JSON.stringify(updateRow), function(result){
			//kw---20230706 : 게시판유형 변경에 따른 엘라스틱 업데이트 (커뮤니티 <-> 게시판)
			//kw---게시판유형이 변경되었다면
			if(gridData[CMMT100M_gridCtgrSelIndex].ctgrTypCd != item.ctgrTypCd){
				
				//kw---20230706 : 해당 카테고리에 게시물들을 가져온다.
				Utils.ajaxCall('/cmmt/CMMT100SEL03', JSON.stringify(updateRow), function(resultCtgrTyp){
					
					let CMMT100M_resultCtgrTypList = JSON.parse(JSON.parse(JSON.stringify(resultCtgrTyp.list)));
					
					let updateRow = {
							blthgList		: CMMT100M_resultCtgrTypList,
							ctgrType		: item.ctgrTypCd,				//kw---1:게시판으로 변경, 2:커뮤니티로 변경(99)		
						};
					
					Utils.ajaxCall('/cmmt/CMMT100UPT04', JSON.stringify(updateRow), function(resultEl){
						if(resultEl.result != 1){
							console.log("EL - 게시판 유형 업데이트 실패");
						}
					});
					
				});
			}
			//kw---20230706 : 게시판유형 변경에 따른 엘라스틱 업데이트 (커뮤니티 <-> 게시판) 끝
			
			Utils.alert(result.msg);
			gridData[CMMT100M_gridCtgrSelIndex].ctgrAttrCd = item.ctgrAttrCd;
			gridData[CMMT100M_gridCtgrSelIndex].ctgrTypCd = item.ctgrTypCd;
			
			$("#grdCMMT100").data("kendoGrid").refresh();
		});
	});
});
// JDJ Button Event - 게시판 관리자 불러오기
$("#CMMT100M button[name=btnLoadAdmin]").off("click").on("click", function () {
	
	Utils.setCallbackFunction("cmmt100m_rtnValue", function (item) {
		$('#CMMT100M input[name=edtCtgrAdmnId]').val(item.usrId);
	});

	/* shpark 20240828
	* SYSM214P 호출 시 'usrGrd' 를 넘기면 해당 권한 미만의 사용자들을 조회합니다.
	* SYSM214P 호출 시 'noAdminSearch' 를 넘기면 조회되는 관리자가 없을 시 관리자를 등록하라는 안내문구가 노출됩니다.
	* */
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM214P", "SYSM214P", 900, 600, {callbackKey: "cmmt100m_rtnValue", cmmtSetlmnYn: "Y" , usrGrd: "799" , noAdminSearch : 'Y'});
});

$("#CMMT100M input[name=edtCtgrUseAthtCd]:radio").change(function () {
	//라디오 버튼 값을 가져온다.
	CMMT100M_UseAthtChange(this.value);
});


// ======================================================================================================================
// Subfunction - Data 상세항목 세팅
function CMMT100M_fnDataSetEdt(item,clear){

	// 초기화용
	if(clear === true){
		item = {
			ctgrMgntNo 		 	: null,
			ctgrNm           	: null,
			ctgrTypCd          	: null,
			hgrkCtgrMgntNo   	: null,
			hgrkCtgrMgntNm   	: null,
			ctgrAttrCd       	: null,
			ctgrDesc         	: null,
			ctgrStLrgclasCd  	: null,
			ctgrStSmlclasCd  	: null,
			useTrmStrDd      	: null,
			useTrmEndDd      	: null,
			permUseYn        	: "N",
			atclWritPmssYn   	: null,
			replyWritPmssYn  	: null,
			goodPmssYn       	: null,
			alrmUseYn        	: "N",
			dashBrdDispPmssYn	: null,
			dashBrdDispPsnCd 	: null,
			apndFilePmss     	: null,
			apndFileSzUnitCd 	: null,
			apndFileMaxSz    	: null,
			apndFileAllSz    	: null,
			ctgrUseAthtCd    	: null,
			ctgrAdmnId       	: null,
			blthgApvNcsyYn   	: null,
		}
	}
	
	$('#CMMT100M input[name=edtCtgrNm]').attr("disabled", true);
	
	$('#CMMT100M input[name=edtCtgrMgntNo]').val(item.ctgrMgntNo);
	$('#CMMT100M input[name=edtCtgrNm]').val(item.ctgrNm);
	$('#CMMT100M textarea[name=edtCtgrDesc]').val(item.ctgrDesc);
	$('#CMMT100M input[name=edtCtgrHgrkMgntNm]').val(item.hgrkCtgrMgntNm);
	$('#CMMT100M input[name=edtCtgrHgrkMgntNo]').val(item.hgrkCtgrMgntNo);
	$('#CMMT100M input[name=edtCtgrApndFileMaxSz]').val(item.apndFileMaxSz);
	$('#CMMT100M input[name=edtCtgrAdmnId]').val(item.ctgrAdmnId);
	// Check Box
	if(item.alrmUseYn==="Y"){
		$('#CMMT100M input[name=edtAlrmUseYn]').prop('checked', true);
	}else{
		$('#CMMT100M input[name=edtAlrmUseYn]').prop('checked', false);
	}
	if(item.permUseYn==="Y"){
		$('#CMMT100M input[name=edtPermUseYn]').prop('checked', true);
	}else{
		$('#CMMT100M input[name=edtPermUseYn]').prop('checked', false);
	}
	
	//Select Box
	//kw---20230607 : lv5 일 경우 게시판으로 고정
	if(item.prsLvl == 5){
		$('#CMMT100M input[name=edtCtgrAttrCd]').data("kendoComboBox").value("2");
		$('#CMMT100M input[name=edtCtgrAttrCd]').data("kendoComboBox").enable(false);
	} else {
		//kw---값이없을 경우 자동으로 '선택' 항목으로 선택
		if(Utils.isNull(item.ctgrAttrCd)){
			$('#CMMT100M input[name=edtCtgrAttrCd]').data("kendoComboBox").value("");
		} else {
			$('#CMMT100M input[name=edtCtgrAttrCd]').data("kendoComboBox").value(item.ctgrAttrCd);
		}
		$('#CMMT100M input[name=edtCtgrAttrCd]').data("kendoComboBox").enable(true);
	}
	
	//kw---값이없을 경우 자동으로 '선택' 항목으로 선택
	if(Utils.isNull(item.ctgrStLrgclasCd)){
		$('#CMMT100M input[name=edtCtgrStLrgclasCd]').data("kendoComboBox").value("");
	} else {
		$('#CMMT100M input[name=edtCtgrStLrgclasCd]').data("kendoComboBox").value(item.ctgrStLrgclasCd);
	}
	
	//kw---값이없을 경우 자동으로 '선택' 항목으로 선택
	if(Utils.isNull(item.ctgrStLrgclasCd)){
		$('#CMMT100M input[name=edtCtgrStSmlclasCd]').data("kendoComboBox").value("");
	} else {
		$('#CMMT100M input[name=edtCtgrStSmlclasCd]').data("kendoComboBox").value(item.ctgrStSmlclasCd);
	}
	
	
	
	$('#CMMT100M input[name=edtCtgrApndFilePmss]').data("kendoComboBox").value(item.apndFilePmss);
	$('#CMMT100M input[name=edtCtgrApndFileSzUnitCd]').data("kendoComboBox").value(item.apndFileSzUnitCd);
	$('#CMMT100M input[name=edtAtclWritPmssYn]').data("kendoComboBox").value(item.atclWritPmssYn);
	$('#CMMT100M input[name=edtReplyWritPmssYn]').data("kendoComboBox").value(item.replyWritPmssYn);
	
	//kw---값이없을 경우 자동으로 '선택' 항목으로 선택
	if(Utils.isNull(item.dashBrdDispPmssYn)){
		$('#CMMT100M input[name=edtDashBrdDispPmssYn]').data("kendoComboBox").value("");
	} else {
		$('#CMMT100M input[name=edtDashBrdDispPmssYn]').data("kendoComboBox").value(item.dashBrdDispPmssYn);
	}
	
	//kw---값이없을 경우 자동으로 '선택' 항목으로 선택
	if(Utils.isNull(item.dashBrdDispPsnCd)){
		$('#CMMT100M input[name=edtDashBrdDispPsnCd]').data("kendoComboBox").value("");
	} else {
		$('#CMMT100M input[name=edtDashBrdDispPsnCd]').data("kendoComboBox").value(item.dashBrdDispPsnCd);
	}
	
	$('#CMMT100M input[name=edtGoodPmssYn]').data("kendoComboBox").value(item.goodPmssYn);
	
	//kw---값이없을 경우 자동으로 '선택' 항목으로 선택
	if(Utils.isNull(item.blthgApvNcsyYn)){
		$('#CMMT100M input[name=edtBlthgApvNcsyYn]').data("kendoComboBox").value("");
	} else {
		$('#CMMT100M input[name=edtBlthgApvNcsyYn]').data("kendoComboBox").value(item.blthgApvNcsyYn);
	}
	
	$('#CMMT100M input[name=edtCtgrTypCd]').data("kendoComboBox").value(item.ctgrTypCd);
	$('#CMMT100M input[name=edtCtgrUseAthtCd]').data("kendoComboBox").value(item.ctgrUseAthtCd);

	//kw---값이없을 경우 자동으로 '선택' 항목으로 선택
	if(Utils.isNull(item.ctgrTypCd)){
		$('#CMMT100M input[name=edtCtgrTypCd]').data("kendoComboBox").value("");
	} else {
		$('#CMMT100M input[name=edtCtgrTypCd]').data("kendoComboBox").value(item.ctgrTypCd);
	}
	
	//kw---값이없을 경우 자동으로 '선택' 항목으로 선택
	if(Utils.isNull(item.ctgrUseAthtCd)){
		$('#CMMT100M input[name=edtCtgrUseAthtCd]').data("kendoComboBox").value("");
	} else {
		$('#CMMT100M input[name=edtCtgrUseAthtCd]').data("kendoComboBox").value(item.ctgrUseAthtCd);
	}
	

	// Date Picker
	if(item.useTrmStrDd){
		$('#CMMT100M input[name=edtUseTrmStrDD]').val(kendo.format("{0:yyyy-MM-dd}",CMMT100M_fnSubConvertStringToDate(item.useTrmStrDd)));
	}else{
		$('#CMMT100M input[name=edtUseTrmStrDD]').val(kendo.format("{0:yyyy-MM-dd}"));
	}

	if(item.useTrmEndDd){
		$('#CMMT100M input[name=edtUseTrmEndDD]').val(kendo.format("{0:yyyy-MM-dd}",CMMT100M_fnSubConvertStringToDate(item.useTrmEndDd)));
	}else{
		$('#CMMT100M input[name=edtUseTrmEndDD]').val(kendo.format("{0:yyyy-MM-dd}"));
	}

}
// Subfunction - Data 상세항목 가져오기
function CMMT100M_fnSubDataGetEdt(){

	let alrmUseYn,permUseYn;
	if($('#CMMT100M input[name=edtAlrmUseYn]').is(":checked")){ alrmUseYn ="Y";}else{ alrmUseYn ="N";}
	if($('#CMMT100M input[name=edtPermUseYn]').is(":checked")){ permUseYn ="Y";}else{ permUseYn ="N";}

	let	item = {
			tenantId          : GLOBAL.session.user.tenantId,
			ctgrMgntNo        : $('#CMMT100M input[name=edtCtgrMgntNo]').val(),
			ctgrTypCd		  : $('#CMMT100M input[name=edtCtgrTypCd]').data("kendoComboBox").value(),
			ctgrNm            : $('#CMMT100M input[name=edtCtgrNm]').val(),
			hgrkCtgrMgntNo    : $('#CMMT100M input[name=edtCtgrHgrkMgntNo]').val(),
			hgrkCtgrMgntNm    : $('#CMMT100M input[name=edtCtgrHgrkMgntNm]').val(),
			ctgrAttrCd        : $('#CMMT100M input[name=edtCtgrAttrCd]').data("kendoComboBox").value(),
			ctgrDesc          : $('#CMMT100M textarea[name=edtCtgrDesc]').val(),
			ctgrStLrgclasCd   : $('#CMMT100M input[name=edtCtgrStLrgclasCd]').data("kendoComboBox").value(),
			ctgrStSmlclasCd   : $('#CMMT100M input[name=edtCtgrStSmlclasCd]').data("kendoComboBox").value(),
			useTrmStrDd       : CMMT100M_fnSubConvertDateToString($('#CMMT100M input[name=edtUseTrmStrDD]').val()),
			useTrmEndDd       : CMMT100M_fnSubConvertDateToString($('#CMMT100M input[name=edtUseTrmEndDD]').val()),
			permUseYn         : permUseYn,
			atclWritPmssYn    : $('#CMMT100M input[name=edtAtclWritPmssYn]').data("kendoComboBox").value(),
			replyWritPmssYn   : $('#CMMT100M input[name=edtReplyWritPmssYn]').data("kendoComboBox").value(),
			goodPmssYn        : $('#CMMT100M input[name=edtGoodPmssYn]').data("kendoComboBox").value(),
			alrmUseYn         : alrmUseYn,
			dashBrdDispPmssYn : $('#CMMT100M input[name=edtDashBrdDispPmssYn]').data("kendoComboBox").value(),
			dashBrdDispPsnCd  : $('#CMMT100M input[name=edtDashBrdDispPsnCd]').data("kendoComboBox").value(),
			apndFilePmss      : $('#CMMT100M input[name=edtCtgrApndFilePmss]').data("kendoComboBox").value(),
			apndFileSzUnitCd  : $('#CMMT100M input[name=edtCtgrApndFileSzUnitCd]').data("kendoComboBox").value(),
			apndFileMaxSz     : $('#CMMT100M input[name=edtCtgrApndFileMaxSz]').val(),
			apndFileAllSz     : $('#CMMT100M input[name=edtCtgrApndFileMaxSz]').val()*$('#CMMT100M input[name=edtCtgrApndFilePmss]').data("kendoComboBox").value(), // 서버에서
																																									// 계산?
			ctgrUseAthtCd     : $('#CMMT100M input[name=edtCtgrUseAthtCd]').data("kendoComboBox").value(),
			ctgrAdmnId        : $('#CMMT100M input[name=edtCtgrAdmnId]').val(),
			blthgApvNcsyYn    : $('#CMMT100M input[name=edtBlthgApvNcsyYn]').data("kendoComboBox").value(),
			
	}
	
	return item;
}
// Subfunction - Grid 줄생성
function CMMT100M_fnSubGridAddRow(idx,tenantId,ctgrMgntNo,ctgrTypCd,prsLvl,srtSeq,hgrkCtgrMgntNo,hgrkCtgrMgntNm){
	
	let gridData = $("#grdCMMT100").data("kendoGrid").dataSource.data();
	
	$("#grdCMMT100").data("kendoGrid").dataSource.insert(idx,{
		tenantId 		  :tenantId,
		ctgrMgntNo        : ctgrMgntNo==-1?"":ctgrMgntNo ,    // 채번
//		id 			      : ctgrMgntNo==-1?"":ctgrMgntNo ,    // 채번
//		idx        		  : ctgrMgntNo==-1?"":ctgrMgntNo ,    // 채번
		ctgrNm            : '',
		ctgrTypCd         : ctgrTypCd,  // 확인필요
		prsLvl            : prsLvl,      // 복사해서 채번
		srtSeq            : srtSeq,      // ?
		hgrkCtgrMgntNo    : hgrkCtgrMgntNo,   // 복사
		hgrkCtgrMgntNm    : hgrkCtgrMgntNm,   // 복사
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
function CMMT100M_fnSubConvertStringToDate(responseDate) {
	let year = responseDate.substring(0, 4);
	let month = responseDate.substring(4, 6);
	let day = responseDate.substring(6, 4);
	return new Date(year, (month - 1), day);
}
// Subfunction - String Date 날짜 형식 변환 ("yyyy-mm-dd" -> "YYYYMMDD")
function CMMT100M_fnSubConvertDateToString(responseDate) {
	let year = responseDate.substring(0, 4);
	let month = responseDate.substring(5, 7);
	let day = responseDate.substring(8, 10);
	return year+month+day;
}
// Subfunction - 공백교환 (' ' -> '&emsp;')
function CMMT100M_fnSubSpaceReplaceHtml(str){
	if(Utils.isNull(str)){
		return "";
	}else{
		return str.replace(/    /gi,"&emsp;");// return str.replace(/
												// /gi,"&nbsp;")
	}
}
// Subfunction - 공백추가 (' ')
function CMMT100M_fnSubSpaceAddHtml(str){
	if(Utils.isNull(str)){
		return null;
	}else{
		return "    "+str;// return str.replace(/ /gi,"&nbsp;")
	}
}
// Subfunction - 공백 제거
function CMMT100M_fnSubSpaceRemoveHtml(str){
	if(Utils.isNull(str)){
		return null;
	}else{
		return str.replace(/    /gi, "");(str);
	}
}
// Subfunction - 클릭된 버튼 인덱스 찾기
function CMMT100M_fnSubFindIndex(ctgrMgntNo){
	let idx = "";
	for(let i = 0; i<$("#grdCMMT100").data("kendoGrid").dataSource.data().length;i++){
		if(ctgrMgntNo==$("#grdCMMT100").data("kendoGrid").dataSource.data()[i].ctgrMgntNo){
			idx = i;	break;
		}
	}
	return idx;
}
// Subfunction - 그리드 체크박스 전체 헤제
function CMMT100M_fnSubCheckBoxClear(e) {
	let grid = $("#grdCMMT100").data("kendoGrid");
	grid.clearSelection();
}
// Subfunction - Tree Data Set
function CMMT100M_fnSubChangeTreeData(list) {
	let MappedArr = [];
	for (let item of list) {
		let data = {
			id				: item.ctgrMgntNo,        // 자신 코드
			hgrkCtgrMgntNo  : item.hgrkCtgrMgntNo,
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
			if (MappedElem.hgrkCtgrMgntNo) {// 부모코드가 있는경우
				let hgrkCtgrMgntNo = MappedArr.findIndex(e=>e.id===MappedElem.hgrkCtgrMgntNo); // 부모조직의
																								// 인덱스
																								// 찾기
				MappedArr[hgrkCtgrMgntNo].items.push(MappedElem);
			} else {// 부모코드가 없을경우 -> 최상단
				treeCol.push(MappedElem);
			}
		}
	}
	return treeCol;
}
// Subfunction - Tree data 상에 전체리스트 출력
function CMMT100M_fnSubGetChildrenList(selectNodelist){
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
function CMMT100M_fnGetTreeNode(treedata, prsLvl, ctgrMgntNo) {
	let data = treedata;
	for (let i=0;prsLvl>i;i++){
		if(data.filter(c=> c.id==ctgrMgntNo).length>0){
			data = data.filter(c=> c.id == ctgrMgntNo);
		}else{
			data = data.flatMap(n => n.items);
		}
	}
	return data;
}
function CMMT100M_fnGetChangeTreeNode(treedata, prsLvl,hgrkCtgrMgntNo,srtSeq,flag) {
	let data = treedata;
	for (let i=1 ;prsLvl>i;i++){
		data = data.flatMap(n => n.items);
	}

	if(flag >0){
		return data.filter(c=> c.hgrkCtgrMgntNo === hgrkCtgrMgntNo && c.srtSeq < srtSeq);// 위로
	}else if(flag < 0){
		return data.filter(c=> c.hgrkCtgrMgntNo === hgrkCtgrMgntNo && c.srtSeq > srtSeq);// 아래로
	}else{
		return [];
	}
}
// Subfunction - SrtSeq ASC(buble 정렬)
function CMMT100M_fnSubSortSrtSeq(){
	let data =  $("#grdCMMT100").data("kendoGrid").dataSource.data();
	for (let i = 0; i < data.length - 1; i++)
	{
		for (let j = 0; j <data.length- 1 - i; j++)
		{
			if (data[j].srtSeq > data[j + 1].srtSeq)
			{
				let temp        = $("#grdCMMT100").data("kendoGrid").dataSource.data()[j];
				$("#grdCMMT100").data("kendoGrid").dataSource.data()[j]     = $("#grdCMMT100").data("kendoGrid").dataSource.data()[j + 1];
				$("#grdCMMT100").data("kendoGrid").dataSource.data()[j + 1] = temp;
			}
		}
	}
}

function CMMT100M_fnStartDateChange() {
	let startDate = CMMT100M_StartDate.value(), endDate = CMMT100M_EndDate.value();
	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		CMMT100M_EndDate.min(startDate);
	} else if (endDate) {
		CMMT100M_StartDate.max(new Date(endDate));
	} else {
		endDate = new Date();
		CMMT100M_StartDate.max(endDate);
		CMMT100M_EndDate.min(endDate);
	}
}

function CMMT100M_fnEndDateChange() {
	var endDate = CMMT100M_EndDate.value(), startDate = CMMT100M_StartDate.value();
	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		CMMT100M_StartDate.max(endDate);
	} else if (startDate) {
		CMMT100M_EndDate.min(new Date(startDate));
	} else {
		endDate = new Date();
		CMMT100M_StartDate.max(endDate);
		CMMT100M_EndDate.min(endDate);
	}
}

// function CMMT100M_fnSearchAuth(ctgrMgntNo){
// let save_data = {
// tenantId :GLOBAL.session.user.tenantId,
// ctgrMgntNo : ctgrMgntNo , // 채번
// ctgrUseAthtCd : "2",
// }
// CMMT100M_ctgrMgntNoAuth = ctgrMgntNo
// Utils.ajaxCall('/cmmt/CMMT110SEL01', JSON.stringify(save_data),
// CMMT100M_fnDefaultAuth)
// }
// function CMMT100M_fnDefaultAuth(result){
// let data = JSON.parse(JSON.parse(JSON.stringify(result.CMMT110VOGridInfo)));
// if(data.length==0){
// // 게시판 생성 시, 시스템 운영자, 시스템 개발자,result.CMMT110VOGridInfo 관리자 권한 자동생성 start
// let athtCdList = ["900","910", "400"]
// let save_list = [];
// athtCdList.forEach(function(val, i){
// let save_data = {
// tenantId : GLOBAL.session.user.tenantId,
// ctgrMgntNo : CMMT100M_ctgrMgntNoAuth , // 채번
// ctgrUseAthtCd : "2",
// athtCd : val,
// athtSeq : -1,
// rdPmssYn : "Y",
// writPmssYn : "Y",
// corcPmssYn : "Y",
// delPmssYn : "Y",
// replyPmssYn : "Y",
// goodPmssYn : "Y",
// apndFileDnldPmssYn : "Y",
// regrId : GLOBAL.session.user.usrId,
// regrOrgCd : GLOBAL.session.user.orgCd,
// lstCorprId : GLOBAL.session.user.usrId,
// lstCorprOrgCd : GLOBAL.session.user.orgCd
// }
// save_list.push(save_data)
// });
//
// let CMMT110_save_data = {
// list : save_list,
// ctgrUseAthtCd : 2,
// };
// Utils.ajaxCall('/cmmt/CMMT110INS01', JSON.stringify(CMMT110_save_data));
// // 게시판 생성 시, 시스템 운영자, 시스템 개발자, 관리자 권한 자동생성 end
// }
// }

$("#grdCMMT100").on('click','tbody tr[data-uid]',function (CMMT100M_e) {
	let tr = $(this).closest("tr")
	let item = $("#grdCMMT100").data("kendoGrid").dataItem(tr);

	CMMT100M_gridCtgrSelIndex = $("#grdCMMT100").data("kendoGrid").dataSource.data().indexOf(item);
	CMMT100M_fnSelectRowInfo(item);
});

$("#CMMT100M_rightDiv").show().off('click').on('click', function () {
	let ctgrNewCheck = CMMT100M_fnCtgrNewCheck();
	if(ctgrNewCheck){
		//kw---20230607 : 경고창 추가
		Utils.alert(CMMT100M_langMap.get("CMMT100M.Message.alert9"));		//Utils.alert("카테고리를 먼저 저장해 주세요.");
		return;
	}
})

//kw---20230607 : 카테고리가 신규인지 체크 (기본설정, 권한 조작을 하기전 현재 선택된 카테고리가 신규인지 체크)
function CMMT100M_fnCtgrNewCheck(){
	if(CMMT100M_selItem.isNew() == true){
		return true;
	}
	return false;
}
