/***********************************************************************************************
 * Program Name : 메뉴관리(CNSL130M.js)
 * Creator      : jrlee
 * Create Date  : 2022.03.18
 * Description  : 메뉴관리
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.18     jrlee           최초작성   
 ************************************************************************************************/

var CNSL130M_comCdList;
var CNSL130M_totalMenuList;
var CNSL130M_iconPopup;
var CNSL130M_grid = new Array(2);
var custItemGrpNo;

var CNSL130M_lastSelectedItemGrid0 = [];
var CNSL130M_selectItemGird0 = 0;

//kw---20240325 : 고객레이아웃 항목 추가시 DataSource 기본 값을 설정하기 위함 ex) DB = D, IF = I 로 기본값 설정
var CNSL130M_IFType;

for (let i = 0; i < CNSL130M_grid.length; i++) {
    CNSL130M_grid[i] = {
        instance: new Object(),
        dataSource: new Object(),
        currentItem: new Object(),
        currentCellIndex: new Number(),
        selectedItems: new Array()
    }
}

$(document).ready(function () {
	
	var ifType = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 18).bascVluDvCd;
	if(ifType == 15){
		CNSL130M_IFType = "I";
	} else {
		CNSL130M_IFType = "D";
	}
	
	Utils.resizeLabelWidth();
    $("#CNSL130M_tenantId").val(GLOBAL.session.user.tenantId);
    $("#CNSL130M_tenantNm").val(GLOBAL.session.user.fmnm);
    
    CNSL130M_grid[0].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall("/cnsl/CNSL130SEL01", JSON.stringify(options.data), function (result) {
                    options.success(JSON.parse(result.list));
                    
                    if(CNSL130M_selectItemGird0 == 1){
                		CNSL130M_grid[0].instance.select("tr:last");
                    	
                    	CNSL130M_grid[0].currentItem = CNSL130M_grid[0].dataSource.data()[(CNSL130M_grid[0].dataSource.data().length-1)];
                    	custItemGrpNo = CNSL130M_grid[0].dataSource.data()[(CNSL130M_grid[0].dataSource.data().length-1)].custItemGrpNo;
                    	
                    	CNSL130M_selectItemGird0 = 0;
                    } 
                    else 
                    {                    	
                    	if(Utils.isNull(CNSL130M_lastSelectedItemGrid0) || CNSL130M_selectItemGird0 == -1){
                    		CNSL130M_selectItemGird0 = 0;
                    		
	                    	CNSL130M_grid[0].instance.select("tr:eq(" + CNSL130M_selectItemGird0 + ")");
	                        	
	                        CNSL130M_grid[0].currentItem = CNSL130M_grid[0].dataSource.data()[0];
	                        custItemGrpNo = CNSL130M_grid[0].dataSource.data()[0].custItemGrpNo;

                    	}
                    	else 
                    	{
	                    	var row = CNSL130M_grid[0].instance.tbody.find("tr[data-uid]").filter(function() {
	                		    return CNSL130M_grid[0].instance.dataItem(this).custItemGrpNo === CNSL130M_lastSelectedItemGrid0[CNSL130M_lastSelectedItemGrid0.length-1].custItemGrpNo; // 조건에 맞는 행을 필터링
	                		});
	
	                		// 행을 선택하기
	                    	CNSL130M_grid[0].instance.select(row);
	                    	CNSL130M_grid[0].currentItem = CNSL130M_lastSelectedItemGrid0[CNSL130M_lastSelectedItemGrid0.length-1]
	                    	custItemGrpNo = CNSL130M_lastSelectedItemGrid0[CNSL130M_lastSelectedItemGrid0.length-1].custItemGrpNo;
                    	}
                    }
                    
                });
            },
            create: function (options) {
                Utils.ajaxCall("/cnsl/CNSL130INS01", JSON.stringify({
                    list: options.data.models
                }), function (result) {
                	CNSL130M_selectItemGird0 = 1;
                	Utils.alert(CNSL130M_langMap.get("success.common.add")); 	//정상적으로 추가되었습니다.
                    options.success(options.data.models);
                    
                });
            },
            update: function (options) {
                var updateList = options.data.models;
                var regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprBlngOrgCd: GLOBAL.session.user.orgCd
                }

                $.each(updateList, function(index, item){
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/cnsl/CNSL130UPT01", JSON.stringify({
                    list: updateList
                }), function (result) {
                	Utils.alert(CNSL130M_langMap.get("success.common.update")); 	//정상적으로 수정되었습니다.
                    options.success(options.data.models);
                });
            },
            destroy: function (options) {
                options.success(options.data.models);
            },
        },
        requestStart: function (e) {
            var type = e.type;
            var response = e.response;
        },
        requestEnd: function (e) {
            var type = e.type;
            var response = e.response;

            if (type != "read" && type != "destroy") {
                CNSL130M_fnSearchCustomLyotList();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "custItemGrpNo",
                fields: {
                	custItemGrpNo		: { type: "Integer",  editable: false},
					custItemGrpNm		: { type: "string"},
					scrnDispYn			: { type: "string"},
					scrnDispDrctCd		: { type: "string"},
					smsEtcTelDispYn		: { type: "string"},
					scrnDispSeq			: { type: "Integer"},
					dataSrcDvCd			: {field : "dataSrcDvCd",  type: "string"},
                }
            }
        }
    });

    CNSL130M_grid[0].instance = $("#CNSL130M_grid0").kendoGrid({
        dataSource: CNSL130M_grid[0].dataSource,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        sortable: false,
        resizable: true,
        dataBound: function() {
            CNSL130M_grid_fnOnDataBound(0);
        },
        change: function(e) {
            CNSL130M_grid_fnOnChange(e, 0);
        },
        cellClose:  function(e) {
            CNSL130M_fnChk(e);
        },
        columns: [
            {
                selectable: true,
                width: 30
            }, {
				field: "custItemGrpNm", 
				title: CNSL130M_langMap.get("CNSL130M.grid1.col1"),		//title: "고객항목 그룹명",
				type: "string", width: 130
			}, {
				field: "scrnDispSeq", 
				title: CNSL130M_langMap.get("CNSL130M.grid1.col2"),		//title: "화면순서",
				type: "Integer", width: 60
			}, {
				field: "scrnDispYn", 
				title: CNSL130M_langMap.get("CNSL130M.grid1.col3"),		//title: "화면표시",
				type: "string", width: 90,
				editor: function (container, options) {
					CNSL130M_grid_fnComboEditor(container, options, 0, "C0207", false);
                },
                template: function (dataItem) {return Utils.getComCdNm(CNSL130M_comCdList, 'C0207', dataItem.scrnDispYn);}
			}, {
				field: "scrnDispDrctCd", 
				title: CNSL130M_langMap.get("CNSL130M.grid1.col4"),		//title: "표시방향",
				type: "string", width: 90,
				editor: function (container, options) {
					CNSL130M_grid_fnComboEditor(container, options, 0, "C0164", false);
                },
                template: function (dataItem) {
                	return Utils.getComCdNm(CNSL130M_comCdList, 'C0164', dataItem.scrnDispDrctCd);
                }
			},{
				field: "dataSrcDvCd", title: "DataSource",type: "string", width: 90,
			},{
				field: "smsEtcTelDispYn", 
				title: CNSL130M_langMap.get("CNSL130M.grid1.col5"),		//title: "SMS기타연락처사용",
				type: "string", width: 110,
				editor: function (container, options) {
					CNSL130M_grid_fnComboEditor(container, options, 0, "C0004", false);
                },
                template: function (dataItem) {return Utils.getComCdNm(CNSL130M_comCdList, 'C0004', dataItem.smsEtcTelDispYn);}
			}, {
				title: CNSL130M_langMap.get("CNSL130M.grid1.col6"),		//title: "상세",
                width: 40,
            	template: function(dataItem){
            		let strReturn = "";
            		
            		strReturn = '<button type="button" class="k-icon k-i-zoom-in" title=' + CNSL130M_langMap.get("CNSL130M.grid1.col7") + ' onclick="CNSL130M_fnSearchCustomItemList(this)"></button>'
            		return strReturn;
            	}
            }
        ],
        edit: function (e) {
    		e.container.find("input[name=dataSrcDvCd]").attr("maxlength", 1);		//변수코드 입력시 길이 제한
        },
    }).data("kendoGrid");

    
    CNSL130M_grid[1].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall("/cnsl/CNSL130SEL02", JSON.stringify(options.data), function (result) {
                	options.success(JSON.parse(result.list));
                });
            },
            create: function (options) {
                Utils.ajaxCall("/cnsl/CNSL130INS02", JSON.stringify({
                    list: options.data.models
                }), function (result) {
                	Utils.alert(CNSL130M_langMap.get("success.common.add")); 	//정상적으로 추가되었습니다.
                    options.success(options.data.models);
                });
            },
            update: function (options) {
                var updateList = options.data.models;
                var regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprBlngOrgCd: GLOBAL.session.user.orgCd
                }

                $.each(updateList, function(index, item){
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/cnsl/CNSL130UPT02", JSON.stringify({
                    list: updateList
                }), function (result) {
                    options.success(options.data.models);
                    
                    if(JSON.parse(result.resultCode) == "1"){
                    	Utils.alert(CNSL130M_langMap.get("success.common.update")); 	//정상적으로 수정되었습니다.
                    } else {
                    	Utils.alert(CNSL130M_langMap.get("CNSL130M.alert2"));
                    }
                    
                });
            },
            destroy: function (options) {
                options.success(options.data.models);
            }
        },
        requestStart: function (e) {
            var type = e.type;
            var response = e.response;
        },
        requestEnd: function (e) {
            var type = e.type;
            var response = e.response;

            if (type != "read" && type != "destroy") {
            	CNSL130M_fnSearchCustomItemList();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "custItemNo",
                fields: {
                	custItemGrpNo			: { field: "custItemGrpNo", type: "Integer",  editable: false},
                	custItemNo			: { field: "custItemNo", type: "Integer",  editable: false},
                	mgntItemSearch				: { field: "mgntItemSearch", type: "string" ,  editable: false},
					mgntItemCd				: { field: "mgntItemCd", type: "string"},
					mgntItemNm			: { field: "mgntItemNm", type: "string"},
					mgntItemTypCd		: { field: "mgntItemTypCd", type: "string"},
					dataSzIntMnriCnt		: { field: "dataSzIntMnriCnt", type: "Integer"},
					crypTgtYn		: { field: "crypTgtYn", type: "string"},
					scrnDispYn		: { field: "scrnDispYn", type: "string"},
					scrnDispSeq			: { field: "scrnDispSeq", type: "Integer"},
					voColId			: { field: "voColId", type: "string"},
					srchUseYn			: { field: "srchUseYn", type: "string"},
					likeSrchPmssYn			: { field: "likeSrchPmssYn", type: "string"},
					srchInputvluCnt			: { field: "srchInputvluCnt", type: "Integer"},
					gridPrnYn			: { field: "gridPrnYn", type: "string"},
					gridPrnSrtSeq			: { field: "gridPrnSrtSeq", type: "Integer"},
					mdtyYn		: { field: "mdtyYn", type: "string"},
					crypTgtYn	: { field: "crypTgtYn", type: "string"},
					}
                }
            }
    });

    CNSL130M_grid[1].instance = $("#CNSL130M_grid1").kendoGrid({
        dataSource: CNSL130M_grid[1].dataSource,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        editable: "incell",
        sortable: false,
        resizable: true,
        noRecords: true,
        messages: {
            noRecords: CNSL130M_langMap.get("CNSL130M.grid2.records.msg")
        },
        dataBound: function() {
            CNSL130M_grid_fnOnDataBound(1);
        },
        change: function(e) {
            CNSL130M_grid_fnOnChange(e, 1);
        },
        cellClose:  function(e) {
            CNSL130M_fnChk(e);
        },
        columns: [
            {
                selectable: true,
                width: 30
            },
            {
				field: "mgntItemSearch", 
				title: CNSL130M_langMap.get("CNSL130M.grid2.col1"),		//title: "코드찾기", 
				width: 70,
                template: "<button type='button' class='btnRefer_default' onclick='CNSL130M_fnOpenPopSYSM241P(1)'>" + CNSL130M_langMap.get("CNSL130M.grid2.btn1") + "</button>"
            },{
				field: "mgntItemCd", 
				title: CNSL130M_langMap.get("CNSL130M.grid2.col2"),		//title: "관리항목코드",
				type: "string", width: 80
			},{
				field: "mgntItemNm", 
				title: CNSL130M_langMap.get("CNSL130M.grid2.col3"),		//title: "관리항목명",
				type: "string", width:130
			},{
				field: "mgntItemTypCd", 
				title: CNSL130M_langMap.get("CNSL130M.grid2.col4"),		//title: "데이터형",
				type: "string", width: 70
			}, {
				field: "dataSzIntMnriCnt", 
				title: CNSL130M_langMap.get("CNSL130M.grid2.col5"),		//title: "데이터크기",
				type: "Integer", width: 70
			},{
				field: "crypTgtYn", 
				title: CNSL130M_langMap.get("CNSL130M.grid2.col6"),		//title: "암호화",
				type: "string", width: 100,
                template: function (dataItem) {
                    return Utils.getComCdNm(CNSL130M_comCdList, 'C0245', $.trim(dataItem.crypTgtYn));
                },
                editor: function (container, options) {
                	CNSL130M_grid_fnComboEditor(container, options, 1, "C0245", false);
                },
			},{
				field: "scrnDispYn", 
				title: CNSL130M_langMap.get("CNSL130M.grid2.col7"),		//title: "화면표시(팝업)",
				type: "string", width: 100,
                template: function (dataItem) {
                    return Utils.getComCdNm(CNSL130M_comCdList, 'C0207', $.trim(dataItem.scrnDispYn));
                },
                editor: function (container, options) {
                	CNSL130M_grid_fnComboEditor(container, options, 1, "C0207", false);
                },
			},{
				field: "scrnDispSeq", 
				title: CNSL130M_langMap.get("CNSL130M.grid2.col8"),		//title: "정렬순서(팝업)",
				type: "Integer", width: 100
			},{
				field: "voColId", 
				title: CNSL130M_langMap.get("CNSL130M.grid2.col9"),		//title: "VO컬럼ID",
				type: "string", width: 60
			},{
				field: "srchUseYn", 
				title: CNSL130M_langMap.get("CNSL130M.grid2.col10"),		//title: "검색사용",
				type: "string", width: 90,
				template: function (dataItem) {
                    return Utils.getComCdNm(CNSL130M_comCdList, 'C0208', $.trim(dataItem.srchUseYn));
                },
                editor: function (container, options) {
                	CNSL130M_grid_fnComboEditor(container, options, 1, "C0208", false);
                },
			},{
				field: "likeSrchPmssYn", 
				title: CNSL130M_langMap.get("CNSL130M.grid2.col11"),		//title: "like검색",
				type: "string", width: 90,
				template: function (dataItem) {
                    return Utils.getComCdNm(CNSL130M_comCdList, 'C0208', $.trim(dataItem.likeSrchPmssYn));
                },
                editor: function (container, options) {
                	CNSL130M_grid_fnComboEditor(container, options, 1, "C0208", false);
                },
			},{
				field: "gridPrnYn", 
				title: CNSL130M_langMap.get("CNSL130M.grid2.col12"),		//title: "그리드출력",
				type: "string", width: 90,
				template: function (dataItem) {
                    return Utils.getComCdNm(CNSL130M_comCdList, 'C0326', $.trim(dataItem.gridPrnYn));
                },
                editor: function (container, options) {
                	CNSL130M_grid_fnComboEditor(container, options, 1, "C0326", false);
                },
			},{
				field: "gridPrnSrtSeq", 
				title: CNSL130M_langMap.get("CNSL130M.grid2.col13"),		//title: "그리드정렬순서",
				type: "Integer", width: 110
			},	{
				field: "mdtyYn", 
				title: CNSL130M_langMap.get("CNSL130M.grid2.col14"),		//title: "필수입력",
				type: "string", width: 90,
				template: function (dataItem) {
                    return Utils.getComCdNm(CNSL130M_comCdList, 'C0300', $.trim(dataItem.mdtyYn));
                },
                editor: function (container, options) {
                	CNSL130M_grid_fnComboEditor(container, options, 1, "C0300", false);
                },
			},	
        ]
    }).data("kendoGrid");

    // Tooltip
//    for (let i = 0; i < CNSL130M_grid.length; i++) {
    for (let i = 1; i < CNSL130M_grid.length; i++) {
        $("#CNSL130M_grid" + i).kendoTooltip({
            filter: i == 0 ? "td:nth-child(4)" : "td:nth-child(3)",
            position: "right",
            width: 150,
            content: function(e){
                var dataItem = CNSL130M_grid[i].instance.dataItem(e.target.closest("tr"));
                var returnData;
                if ( i == 0 ) {
                	returnData = dataItem.custItemGrpNm;
                } else {
                	returnData = dataItem.mgntItemNm;
                }
                return returnData
            }
        }).data("kendoTooltip")
    }
    
    Utils.setKendoGridDoubleClickAction("#CNSL130M_grid0");
    
    CNSL130M_fnInit();
    
    CNSL130M_fnGridResize();
});

$(window).on("resize", function () { 
	CNSL130M_fnGridResize();
});

function CNSL130M_fnInit() {
    var param = {
        "codeList": [
        	{"mgntItemCd":"C0004"},
        	{"mgntItemCd":"C0164"},
        	{"mgntItemCd":"C0207"},
        	{"mgntItemCd":"C0208"},
        	{"mgntItemCd":"C0245"},
        	{"mgntItemCd":"C0300"},
        	{"mgntItemCd":"C0321"},
        	{"mgntItemCd":"C0326"}
        ]
    };

    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        CNSL130M_comCdList = JSON.parse(result.codeList);
        CNSL130M_fnSearchCustomLyotList();
    });
}

function CNSL130M_fnSearchCustomLyotList() {
    CNSL130M_grid[0].instance.clearSelection();

    CNSL130M_grid[1].currentItem = new Object();
    CNSL130M_grid[0].currentItem = new Object();

    CNSL130M_grid[1].dataSource.data([]);
    CNSL130M_grid[0].dataSource.read({
        tenantId: $("#CNSL130M_tenantId").val()
    });
}

function CNSL130M_fnSearchCustomItemList(obj) {
    CNSL130M_grid[1].instance.clearSelection();

    var selectedItem;
    if (obj) {
        var tr = $(obj).closest("tr");
        selectedItem = CNSL130M_grid[0].instance.dataItem(tr);

        CNSL130M_grid[0].instance.clearSelection();
        CNSL130M_grid[0].instance.select(tr);
    } else {
        selectedItem = CNSL130M_grid[0].currentItem;
    }
    
    CNSL130M_grid[1].currentItem = new Object();
    
    CNSL130M_grid[1].dataSource.read({
    	custItemGrpNo: selectedItem.custItemGrpNo,
        tenantId: $("#CNSL130M_tenantId").val()
    });
    
    custItemGrpNo = selectedItem.custItemGrpNo;
}


function CNSL130M_fnAddMenu(gridIndex) {
	
	if(gridIndex == 0){
		CNSL130M_grid[gridIndex].instance.clearSelection();
		CNSL130M_lastSelectedItemGrid0 = [];
		CNSL130M_grid[1].dataSource.data([]);
	}
	
    if (gridIndex != 0 && $.isEmptyObject(CNSL130M_grid[gridIndex - 1].currentItem)) {
        Utils.alert(CNSL130M_langMap.get("CNSL130M.grid2.records.msg"));
        return;
    }
    
    $.each(CNSL130M_grid[gridIndex].dataSource.data(), function(index, item) {
        var scrnDispSeq = index + 1;
        if (item.scrnDispSeq != scrnDispSeq) {
            item.set("scrnDispSeq", scrnDispSeq);
        }
    });

    var totalRecords = CNSL130M_grid[gridIndex].dataSource.total();
    var row = {};
    var regInfo = {};
    
    
    switch(gridIndex) {
	    case 0:  
	    	row = {
				custItemGrpNm : "",
				scrnDispYn : "Y",
	    		scrnDispDrctCd : "1",
	    		smsEtcTelDispYn : "N",
	    		dataSrcDvCd : CNSL130M_IFType,
	    		scrnDispSeq :Number(totalRecords + 1)
			 };
		
			regInfo = {
			        tenantId: $("#CNSL130M_tenantId").val(),
			        regrId: GLOBAL.session.user.usrId,
			        regrBlngOrgCd: GLOBAL.session.user.orgCd,
			        lstCorprId: GLOBAL.session.user.usrId,
			        lstCorprBlngOrgCd: GLOBAL.session.user.orgCd
		    };
	    	break;
	    case 1:  
	    	row = {
				mgntItemCd : "",
				mgntItemNm :"", 
				mgntItemTypCd : "",
				scrnDispSeq : Number(totalRecords + 1),
				scrnDispYn : "Y",
				crypTgtYn : "N",
				srchUseYn : "N",
				likeSrchPmssYn : "Y",
				gridPrnYn : "N",
				mdtyYn : "N",
		 	};
			
			regInfo = {
			        tenantId: $("#CNSL130M_tenantId").val(),
			        regrId: GLOBAL.session.user.usrId,
			        regrBlngOrgCd: GLOBAL.session.user.orgCd,
			        lstCorprId: GLOBAL.session.user.usrId,
			        lstCorprBlngOrgCd: GLOBAL.session.user.orgCd,
			        custItemGrpNo : custItemGrpNo
		    };
			break;
	    	
	}
    CNSL130M_grid[gridIndex].dataSource.add($.extend(row, regInfo));
    CNSL130M_grid[gridIndex].instance.refresh();
    
    if(gridIndex == 0){
    	 //kw---20240325 : 새로 추가되는 셀 색상 변경 시작

    	CNSL130M_grid[0].instance.clearSelection();
    	CNSL130M_lastSelectedItemGrid0 = [];
    	
    	console.log("AWDAWDAWD");
    	
    	(CNSL130M_grid[gridIndex].instance).editCell((CNSL130M_grid[gridIndex].instance).tbody.find("tr:last td:eq(3)"));
    	
    	// 마지막 행 선택하기
    	var lastRow = CNSL130M_grid[gridIndex].instance.tbody.find("tr:last");

    	// 선택된 행을 그리드에서 선택하도록 만들기
    	CNSL130M_grid[gridIndex].instance.select(lastRow);

    	CNSL130M_grid[1].dataSource.data([]);
        
    }
}

function CNSL130M_fnSaveMenu(gridIndex) {
    var isValid = true;

    $.each(CNSL130M_grid[gridIndex].dataSource.data(), function (index, item) {
    	//필요시 작성
    });
    
//    var CNSL130M_lastSelectedItemGrid0 = [];
//    var CNSL130M_selectItemGird0 = 0;
    
    
    if (isValid)
        CNSL130M_grid[gridIndex].instance.dataSource.sync();
}

function CNSL130M_fnDeleteMenu(gridIndex) {
    var selectedItems = CNSL130M_grid[gridIndex].selectedItems;

    if (selectedItems.length == 0) {
        Utils.alert(CNSL130M_langMap.get("CNSL130M.alert3")); // "삭제할 대상을 선택해주세요."
        return;
    }

    Utils.confirm(CNSL130M_langMap.get("CNSL130M.alert4"), function () { // "삭제하시겠습니까?"
    	switch(gridIndex) {
		    case 0:  
		    	Utils.ajaxCall("/cnsl/CNSL130DEL01", JSON.stringify({
	                list : selectedItems
	            }), function (result) {
	                    CNSL130M_fnSearchCustomLyotList();
	                    CNSL130M_selectItemGird0 = -1;
	                    Utils.alert(CNSL130M_langMap.get("success.common.delete")); 	//정상적으로 삭제되었습니다.
	            });
		    	break;
		    case 1:
		    	Utils.ajaxCall("/cnsl/CNSL130DEL02", JSON.stringify({
	                list : selectedItems
	            }), function (result) {
	                    CNSL130M_fnSearchCustomItemList();
	                    Utils.alert(CNSL130M_langMap.get("success.common.delete")); 	//정상적으로 삭제되었습니다. 
	            });
		    	break;
		}
    });
}

function CNSL130M_commonTypCdEditor(container, options, grid, selectComCd) {
    $('<select data-bind="value:' + options.field + '"/>').appendTo(container).kendoComboBox({
        autoBind: true,
        dataTextField: "comCdNm",
        dataValueField: "comCd",
        dataSource: {
            data: CNSL130M_comCdList.filter(function (code) {
                return code.mgntItemCd == selectComCd
            })
        },
        change: function (e) {
            var element = e.sender.element;
            var row = element.closest("tr");
            var dataItem = grid.dataItem(row);
            var selectedValue = e.sender.value();
            
            grid.refresh();
        }
    });
}

function CNSL130M_grid_fnOnDataBound(gridIndex) {
    $("#CNSL130M_grid" + gridIndex + " tbody").off("click").on("click", "td", function(e) {
        var $row = $(this).closest("tr");
        var $cell = $(this).closest("td");
        CNSL130M_grid[gridIndex].currentItem = CNSL130M_grid[gridIndex].instance.dataItem($row);
        CNSL130M_grid[gridIndex].currentCellIndex = $cell.index();
    });
}

function CNSL130M_grid_fnOnChange(e, gridIndex) {
    var rows = e.sender.select(),
        items = [];

    rows.each(function(e) {
        var dataItem = CNSL130M_grid[gridIndex].instance.dataItem(this);
        items.push(dataItem);
    });

    CNSL130M_grid[gridIndex].selectedItems = items;
    
  //kw---20240325 : 테넌트고객레이아웃 - 돋보기 버튼 클릭을 하지 않더라도 '템플릿 구성항목'이 나오도록 추가
    if(gridIndex == 0){
    	var lstItem;
    	
    	//마지막으로 선택한 아이템을 구하기 위함
    	if(items.length > 1){
    		
//    		console.log(items);
    		for(var i=0; i<items.length; i++){
    			
    			var hasData = false;
    			
    			for(var k=0; k<CNSL130M_lastSelectedItemGrid0.length; k++){
        			if(items[i].custItemGrpNo == CNSL130M_lastSelectedItemGrid0[k].custItemGrpNo){		//이전에 담아녾은 배열에 items값이 있으면 true
        				hasData = true;
        			}
        		}
    			
    			if(hasData == false){																//없으면 새로 추가한것이기 때문에 마지막 아이템으로 선택
        			lstItem = items[i].custItemGrpNo;
        			CNSL130M_lastSelectedItemGrid0.push(items[i]);
        		}
    		}
    		
    		if(CNSL130M_lastSelectedItemGrid0.length != items.length){
    			CNSL130M_lastSelectedItemGrid0 = items;
        		lstItem = items[items.length - 1].custItemGrpNo;
        	}
    	} else if(items.length == 1){			//선택된 아이템이 한개 일 경우
    		lstItem = items[0].custItemGrpNo;
    		CNSL130M_lastSelectedItemGrid0 = items;
    	} else {
    		lstItem = "";						//선택된 아이템이 한개도 없을 경우
    	}
    	
//    	console.log(lstItem);
    	
    	console.log("::::::::::::::::: lstItem :" + lstItem);
    	if(!Utils.isNull(lstItem)){
    		CNSL130M_grid[1].currentItem = new Object();
//          
          CNSL130M_grid[1].dataSource.read({
          	custItemGrpNo: lstItem,
              tenantId: $("#CNSL130M_tenantId").val()
          });

          custItemGrpNo = lstItem;
    	} else {
    		console.log("no item");
    		CNSL130M_grid[1].dataSource.data([]);
    	}
    	
    	
    }
};

function CNSL130M_fnMenuUpDown(gridIndex, val) {
	gridIndex = Number(gridIndex);
	val = Number(val);
	
    if (CNSL130M_grid[gridIndex].selectedItems.length == 0) {
        Utils.alert(CNSL130M_langMap.get("CNSL130M.alert5"));		//대상을 선택해주세요.
        return;
    }
    if (CNSL130M_grid[gridIndex].selectedItems.length > 1) {
        Utils.alert(CNSL130M_langMap.get("CNSL130M.alert6"), function () {		//한개만 선택해주세요.
            CNSL130M_grid[gridIndex].instance.clearSelection();
        });
        return;
    }
    var totalRecords = CNSL130M_grid[gridIndex].instance.dataSource.total();
    var index = CNSL130M_grid[gridIndex].instance.select().index();
    var from = index + 1;
    var to = from + val;
    
    if (1 > to || to > totalRecords) {
        return;
    }
    CNSL130M_grid[gridIndex].instance.dataSource.pushMove(to, CNSL130M_grid[gridIndex].instance.dataSource.at(index));
    CNSL130M_grid_fnTotalSorting(gridIndex);
}


function CNSL130M_grid_fnTotalSorting(gridIndex) {
    let result = false;
    let changeCnt = 0;

    $.each(CNSL130M_grid[gridIndex].dataSource.data(), function (index, item) {
        let scrnDispSeq = index + 1;
        if (item.scrnDispSeq != scrnDispSeq) {
            item.set("scrnDispSeq", scrnDispSeq);
            changeCnt++;
        }
    });

    if (changeCnt > 0) {
        result = true;
    }
    return result;
}

function CNSL130M_fnChk(e) {
    var grid = e.sender;
    var dataItem = grid.dataItem(e.sender.select());
}


function CNSL130M_fnSearchTenant() {
	Utils.setCallbackFunction("CNSL130M_fnSYSM101PCallback", function(tenantId) {
        $("#CNSL130M_tenantId").val(tenantId);
        GetTenantNm(tenantId, "CNSL130M_tenantNm");
        CNSL130M_fnSearchCustomLyotList();
    });
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM101P", "SYSM101P", 1100, 600, {callbackKey: "CNSL130M_fnSYSM101PCallback"})
}

function CNSL130M_fnOpenPopSYSM241P(gridIndex) {
    Utils.setCallbackFunction("CNSL130M_fnSYSM241PCallback", CNSL130M_fnSYSM241PCallback);
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM241P", "SYSM241P", 780, 550, {callbackKey: "CNSL130M_fnSYSM241PCallback"});
}

function CNSL130M_fnSYSM241PCallback(item) {
    CNSL130M_grid[1].currentItem.set("mgntItemCd", item.mgntItemCd);
    CNSL130M_grid[1].currentItem.set("mgntItemNm", item.mgntItemCdNm);
    CNSL130M_grid[1].currentItem.set("mgntItemTypCd", item.mgntItemTypCd);
    CNSL130M_grid[1].currentItem.set("dataSzIntMnriCnt", item.dataSzIntMnriCnt);
}

//kw---20240103 : 그리드에 콤보박스 넣는 방법 추가
function CNSL130M_grid_fnComboEditor(container, options, gridIndex, code, isTotalOption) {
	
	let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);
	
	//직접 입력 부분을 빼고 콤보 박스를 셋팅하기 위한 for문
	var arr =new Array(1);
    for(var i=0; i<CNSL130M_comCdList.length; i++) {
    	if(CNSL130M_comCdList[i].comCdNm != CNSL130M_langMap.get(CNSL130M.CDNM)){
    		arr.push(CNSL130M_comCdList[i]);
    	}
    }
    //직접 입력 부분을 빼고 콤보 박스를 셋팅하기 위한 for문 끝
	
    Utils.setKendoComboBox(arr, code, $select, "", isTotalOption).bind("change", function (e) {
        let element = e.sender.element;

        let row = element.closest("tr");
        let dataItem = CNSL130M_grid[gridIndex].instance.dataItem(row);

        dataItem.set(options.field, e.sender.value());

        CNSL130M_grid[gridIndex].instance.refresh();
    });    
}

//kw---20240103 : 그리드 사이즈 조절 되도록 기능 추가
function CNSL130M_fnGridResize() {
	let screenHeight = $(window).height()-200;
	CNSL130M_grid[0].instance.element.find('.k-grid-content').css('height', screenHeight-225);
	CNSL130M_grid[1].instance.element.find('.k-grid-content').css('height', screenHeight-225);
}