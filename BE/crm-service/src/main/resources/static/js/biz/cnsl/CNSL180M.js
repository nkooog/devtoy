/***********************************************************************************************
 * Program Name : 메뉴관리(CNSL180M.js)
 * Creator      : jrlee
 * Create Date  : 2022.03.18
 * Description  : 메뉴관리
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.18     jrlee           최초작성   
 ************************************************************************************************/

var CNSL180M_comCdList;
var CNSL180M_totalMenuList;
var CNSL180M_iconPopup;
var CNSL180M_grid = new Array(3);
var custItemGrpNo;

for (let i = 0; i < CNSL180M_grid.length; i++) {
    CNSL180M_grid[i] = {
        instance: new Object(),
        dataSource: new Object(),
        currentItem: new Object(),
        currentCellIndex: new Number(),
        selectedItems: new Array()
    }
}

$(document).ready(function () {
	Utils.resizeLabelWidth();
    $("#CNSL180M_tenantId").val(GLOBAL.session.user.tenantId);
    $("#CNSL180M_tenantNm").val(GLOBAL.session.user.fmnm);
    
    CNSL180M_grid[0].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall("/cnsl/CNSL180SEL01", JSON.stringify(options.data), function (result) {
                    options.success(JSON.parse(result.list));
                });
            },
            create: function (options) {
                Utils.ajaxCall("/cnsl/CNSL180INS01", JSON.stringify({
                    list: options.data.models
                }), function (result) {
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

                Utils.ajaxCall("/cnsl/CNSL180UPT01", JSON.stringify({
                    list: updateList
                }), function (result) {
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
                CNSL180M_fnSearchCustomLyotList();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "custItemGrpNo",
                fields: {
                	custItemGrpNo			: { type: "Integer",  editable: false},
					custItemGrpNm				: { type: "string"},
					scrnDispYn		: { type: "string"},
					scrnDispDrctCd		: { type: "string"},
					smsEtcTelDispYn		: { type: "string"},
					scrnDispSeq			: { type: "Integer"},
					dataSrcDvCd		: { type: "string"},
					pkgPathCd		: { type: "string"},
					pkgPathNm		: { type: "string"},
					pgmId		: { type: "string"},
                }
            }
        }
    });

    CNSL180M_grid[0].instance = $("#CNSL180M_grid0").kendoGrid({
        dataSource: CNSL180M_grid[0].dataSource,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        editable: "incell",
        sortable: false,
        resizable: true,
        dataBound: function() {
            CNSL180M_grid_fnOnDataBound(0);
        },
        change: function(e) {
            CNSL180M_grid_fnOnChange(e, 0);
        },
        cellClose:  function(e) {
            CNSL180M_fnChk(e);
        },
        columns: [
            {
                selectable: true,
                width: 30
            }, {
				field: "custItemGrpNm", title: "그룹명",type: "string", width: 180
			}, {
				field: "scrnDispSeq", title: "정렬순서",type: "Integer", width: 60
			}, {
				field: "scrnDispYn", title: "화면표시",type: "string", width: 80,
				editor: function (container, options) {
					CNSL180M_commonTypCdEditor(container, options, CNSL180M_grid[0].instance, 'C0207');
                },
                template: function (dataItem) {return Utils.getComCdNm(CNSL180M_comCdList, 'C0207', dataItem.scrnDispYn);}
			}, {
				field: "scrnDispDrctCd", title: "표시방향",type: "string", width: 80,
				editor: function (container, options) {
					CNSL180M_commonTypCdEditor(container, options, CNSL180M_grid[0].instance, 'C0164');
                },
                template: function (dataItem) {return Utils.getComCdNm(CNSL180M_comCdList, 'C0164', dataItem.scrnDispDrctCd);}
			}, {
				field: "dataSrcDvCd", title: "DataSource",type: "string", width: 110
			}, {
				field: "pkgPathCd", title: "PKG경로",type: "string", width: 90, editor: function (container, options) {
					CNSL180M_commonTypCdEditor(container, options, CNSL180M_grid[0].instance, 'C0321');
                },
                template: function (dataItem) {return Utils.getComCdNm(CNSL180M_comCdList, 'C0321', dataItem.pkgPathCd);}
			}, {
				field: "pgmId", title: "PGM ID",type: "string", width: 110
			}, {
                title: "상세",
                width: 40,
            	template: "<button type='button' class='k-icon k-i-zoom-in' title='상세보기' onclick='CNSL180M_fnSearchCustomItemList(this)'></button>"
            }
        ]
    }).data("kendoGrid");

    
    CNSL180M_grid[1].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall("/cnsl/CNSL180SEL02", JSON.stringify(options.data), function (result) {
                	options.success(JSON.parse(result.list));
                });
            },
            create: function (options) {
                Utils.ajaxCall("/cnsl/CNSL180INS02", JSON.stringify({
                    list: options.data.models
                }), function (result) {
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

                Utils.ajaxCall("/cnsl/CNSL180UPT02", JSON.stringify({
                    list: updateList
                }), function (result) {
                    options.success(options.data.models);
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

//            if (type != "read" && type != "destroy") {
//            	CNSL180M_fnSearchCustomItemList();
//            }
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

    CNSL180M_grid[1].instance = $("#CNSL180M_grid1").kendoGrid({
        dataSource: CNSL180M_grid[1].dataSource,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        editable: "incell",
        sortable: false,
        resizable: true,
        noRecords: true,
        messages: {
            noRecords: "상위 대상을 선택해주세요."
        },
        dataBound: function() {
            CNSL180M_grid_fnOnDataBound(1);
        },
        change: function(e) {
            CNSL180M_grid_fnOnChange(e, 1);
        },
        cellClose:  function(e) {
            CNSL180M_fnChk(e);
        },
        columns: [
            {
                selectable: true,
                width: 30
            },
            {
				field: "mgntItemSearch", title: "코드찾기", width: 70,
                template: "<button type='button' class='btnRefer_default' onclick='CNSL180M_fnOpenPopSYSM241P(1)'>검색</button>"
            },{
				field: "mgntItemCd", title: "관리항목코드",type: "string", width: 80
			},{
				field: "mgntItemNm", title: "관리항목명",type: "string", width:130
			},{
				field: "mgntItemTypCd", title: "데이터형",type: "string", width: 70
			}, {
				field: "dataSzIntMnriCnt", title: "데이터크기",type: "Integer", width: 70
			}, {
				field: "crypTgtYn", title: "암호화",type: "string", width: 90, editor: function (container, options) {
					CNSL180M_commonTypCdEditor(container, options, CNSL180M_grid[1].instance, 'C0245');
                },
                template: function (dataItem) {return Utils.getComCdNm(CNSL180M_comCdList, 'C0245', dataItem.crypTgtYn);}
			}, {
				field: "scrnDispYn", title: "화면표시",type: "string", width: 90, editor: function (container, options) {
					CNSL180M_commonTypCdEditor(container, options, CNSL180M_grid[1].instance, 'C0207');
                },
                template: function (dataItem) {return Utils.getComCdNm(CNSL180M_comCdList, 'C0207', dataItem.scrnDispYn);}
			}, {
				field: "scrnDispSeq", title: "화면정렬순서",type: "Integer", width: 60
			}, {
				field: "voColId", title: "VO컬럼ID",type: "string", width: 60
			}, {
				field: "srchUseYn", title: "검색사용",type: "string", width: 90, editor: function (container, options) {
					CNSL180M_commonTypCdEditor(container, options, CNSL180M_grid[1].instance, 'C0208');
                },
                template: function (dataItem) {return Utils.getComCdNm(CNSL180M_comCdList, 'C0208', dataItem.srchUseYn);}
			}, {
				field: "likeSrchPmssYn", title: "like검색",type: "string", width: 90, editor: function (container, options) {
					CNSL180M_commonTypCdEditor(container, options, CNSL180M_grid[1].instance, 'C0208');
                },
                template: function (dataItem) {return Utils.getComCdNm(CNSL180M_comCdList, 'C0208', dataItem.likeSrchPmssYn);}
			}, {
				field: "srchInputvluCnt", title: "입력값수",type: "Integer", width: 60
			}, {
				field: "gridPrnYn", title: "그리드출력",type: "string", width: 90, editor: function (container, options) {
					CNSL180M_commonTypCdEditor(container, options, CNSL180M_grid[1].instance, 'C0326');
                },
                template: function (dataItem) {return Utils.getComCdNm(CNSL180M_comCdList, 'C0326', dataItem.gridPrnYn);}
			}, {
				field: "gridPrnSrtSeq", title: "그리드정렬순서",type: "Integer", width: 60
			}, {
				field: "mdtyYn", title: "필수입력",type: "string", width: 90, editor: function (container, options) {
					CNSL180M_commonTypCdEditor(container, options, CNSL180M_grid[1].instance, 'C0300');
                },
                template: function (dataItem) {return Utils.getComCdNm(CNSL180M_comCdList, 'C0300', dataItem.mdtyYn);}
			}
        ]
    }).data("kendoGrid");
    
    
    CNSL180M_grid[2].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall("/cnsl/CNSL180SEL03", JSON.stringify(options.data), function (result) {
                    options.success(JSON.parse(result.list));
                });
            },
            create: function (options) {
                Utils.ajaxCall("/cnsl/CNSL180INS03", JSON.stringify({
                    list: options.data.models
                }), function (result) {
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

                Utils.ajaxCall("/cnsl/CNSL180UPT03", JSON.stringify({
                    list: updateList
                }), function (result) {
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

//            if (type != "read" && type != "destroy") {
//            	CNSL180M_fnSearchCustomItemList();
//            }
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
    				scrnDispYn		: { field: "scrnDispYn", type: "string"},
    				scrnDispSeq			: { field: "scrnDispSeq", type: "Integer"},
    				voColId			: { field: "voColId", type: "string"},
    				srchUseYn			: { field: "srchUseYn", type: "string"},
    				srchSrtSeq			: { field: "srchSrtSeq", type: "Integer"},
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

    CNSL180M_grid[2].instance = $("#CNSL180M_grid2").kendoGrid({
    	dataSource: CNSL180M_grid[2].dataSource,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        editable: "incell",
        sortable: false,
        resizable: true,
        noRecords: true,
        messages: {
            noRecords: "상위 대상을 선택해주세요."
        },
        dataBound: function() {
            CNSL180M_grid_fnOnDataBound(2);
        },
        change: function(e) {
            CNSL180M_grid_fnOnChange(e, 2);
        },
        cellClose:  function(e) {
            CNSL180M_fnChk(e);
        },
        columns: [
            {
                selectable: true,
                width: 30
            }, {
				field: "custItemNo", title: "항목번호",type: "Integer", width: 180
			},{
				field: "mgntItemCd", title: "관리항목코드",type: "string", width: 80
			},{
				field: "mgntItemNm", title: "관리항목명",type: "string", width:130
			},{
				field: "mgntItemTypCd", title: "데이터형",type: "string", width: 70
			}, {
				field: "srchUseYn", title: "검색사용",type: "string", width: 90, editor: function (container, options) {
					CNSL180M_commonTypCdEditor(container, options, CNSL180M_grid[2].instance, 'C0208');
                },
                template: function (dataItem) {return Utils.getComCdNm(CNSL180M_comCdList, 'C0208', dataItem.srchUseYn);}
			},{
				field: "srchSrtSeq", title: "정렬순서",type: "Integer", width: 80
			}, {
				field: "srchInputvluCnt", title: "입력값수",type: "Integer", width: 60
			}, {
				field: "gridPrnYn", title: "그리드출력",type: "string", width: 90, editor: function (container, options) {
					CNSL180M_commonTypCdEditor(container, options, CNSL180M_grid[2].instance, 'C0326');
                },
                template: function (dataItem) {return Utils.getComCdNm(CNSL180M_comCdList, 'C0326', dataItem.gridPrnYn);}
			}, {
				field: "gridPrnSrtSeq", title: "그리드정렬순서",type: "Integer", width: 60
			}
        ]
    }).data("kendoGrid");

    // Tooltip
    for (let i = 0; i < CNSL180M_grid.length; i++) {
        $("#CNSL180M_grid" + i).kendoTooltip({
            filter: i == 0 ? "td:nth-child(4)" : "td:nth-child(3)",
            position: "right",
            width: 150,
            content: function(e){
                var dataItem = CNSL180M_grid[i].instance.dataItem(e.target.closest("tr"));
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
    CNSL180M_fnInit();
    
    heightResizeCNSL180M();
    $(window).on({ 
		'resize': function() {
			heightResizeCNSL180M();  
		},   
	});
});

function heightResizeCNSL180M() {
	let screenHeight = $(window).height()-210;  // 헤더 + 푸터 = 210px
	$("#CNSL180M_grid0").css('height', screenHeight/2-120)
	$("#CNSL180M_grid1").css('height', screenHeight-145)
	$("#CNSL180M_grid2").css('height', screenHeight/2-100)
}

function CNSL180M_fnInit() {
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
        CNSL180M_comCdList = JSON.parse(result.codeList);
        CNSL180M_fnSearchCustomLyotList();
    });
}

function CNSL180M_fnSearchCustomLyotList() {
    CNSL180M_grid[0].instance.clearSelection();

    CNSL180M_grid[2].currentItem = new Object();
    CNSL180M_grid[1].currentItem = new Object();
    CNSL180M_grid[0].currentItem = new Object();

    CNSL180M_grid[2].dataSource.data([]);
    CNSL180M_grid[1].dataSource.data([]);
    CNSL180M_grid[0].dataSource.read({
        tenantId: $("#CNSL180M_tenantId").val()
    });
}

function CNSL180M_fnSearchCustomItemList(obj) {
    CNSL180M_grid[1].instance.clearSelection();
    CNSL180M_grid[2].instance.clearSelection();
    var selectedItem;
    if (obj) {
        var tr = $(obj).closest("tr");
        selectedItem = CNSL180M_grid[0].instance.dataItem(tr);

        CNSL180M_grid[0].instance.clearSelection();
        CNSL180M_grid[0].instance.select(tr);
    } else {
        selectedItem = CNSL180M_grid[0].currentItem;
    }
    
    custItemGrpNo = selectedItem.custItemGrpNo;
    
    CNSL180M_grid[1].currentItem = new Object();
    
    CNSL180M_grid[1].dataSource.read({
    	custItemGrpNo: custItemGrpNo,
        tenantId: $("#CNSL180M_tenantId").val()
    });
    
    CNSL180M_grid[2].currentItem = new Object();
    
    CNSL180M_grid[2].dataSource.read({
    	custItemGrpNo: custItemGrpNo,
        tenantId: $("#CNSL180M_tenantId").val()
    });
}


function CNSL180M_fnAddMenu(gridIndex) {
    if (gridIndex != 0 && $.isEmptyObject(CNSL180M_grid[0].currentItem)) {
        Utils.alert("상위 대상을 선택해주세요.");
        return;
    }
    
    $.each(CNSL180M_grid[gridIndex].dataSource.data(), function(index, item) {
        var scrnDispSeq = index + 1;
        if (item.scrnDispSeq != scrnDispSeq) {
            item.set("scrnDispSeq", scrnDispSeq);
        }
    });

    var totalRecords = CNSL180M_grid[gridIndex].dataSource.total();
    var row = {};
    var regInfo = {};
    
    
    switch(gridIndex) {
	    case 0:  
	    	row = {
				custItemGrpNm : "",
				scrnDispYn : "Y",
	    		scrnDispDrctCd : "1",
	    		smsEtcTelDispYn : "N",
	    		scrnDispSeq :Number(totalRecords + 1)
			 };
		
			regInfo = {
			        tenantId: $("#CNSL180M_tenantId").val(),
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
				mdtyYn : "Y"
		 	};
			
			regInfo = {
			        tenantId: $("#CNSL180M_tenantId").val(),
			        regrId: GLOBAL.session.user.usrId,
			        regrBlngOrgCd: GLOBAL.session.user.orgCd,
			        lstCorprId: GLOBAL.session.user.usrId,
			        lstCorprBlngOrgCd: GLOBAL.session.user.orgCd,
			        custItemGrpNo : custItemGrpNo
		    };
			break;
	}
    CNSL180M_grid[gridIndex].dataSource.add($.extend(row, regInfo));
    CNSL180M_grid[gridIndex].instance.refresh();
}

function CNSL180M_fnSaveMenu(gridIndex) {
    var isValid = true;

    $.each(CNSL180M_grid[gridIndex].dataSource.data(), function (index, item) {
    	//필요시 작성
    });

    if (isValid) {
    	Utils.confirm("저장하시겠습니까?", function () {
    		CNSL180M_grid[gridIndex].instance.dataSource.sync().then(function () {
                Utils.alert("정상적으로 저장되었습니다.");
                CNSL180M_fnSearchCustomLyotList();
            });
        });
    }
}

function CNSL180M_fnDeleteMenu(gridIndex) {
    var selectedItems = CNSL180M_grid[gridIndex].selectedItems;

    if (selectedItems.length == 0) {
        Utils.alert("삭제할 대상을 선택해주세요."); // "삭제할 대상을 선택해주세요."
        return;
    }

    Utils.confirm("삭제하시겠습니까?", function () { // "삭제하시겠습니까?"
    	switch(gridIndex) {
		    case 0:  
		    	Utils.ajaxCall("/cnsl/CNSL180DEL01", JSON.stringify({
	                list : selectedItems
	            }), function (result) {
	                    CNSL180M_fnSearchCustomLyotList();
	            });
		    	break;
		    case 1:
		    	Utils.ajaxCall("/cnsl/CNSL180DEL02", JSON.stringify({
	                list : selectedItems
	            }), function (result) {
	                    CNSL180M_fnSearchCustomItemList();
	            });
		    	break;
		}
    });
}

function CNSL180M_commonTypCdEditor(container, options, grid, selectComCd) {
    $('<select data-bind="value:' + options.field + '"/>').appendTo(container).kendoComboBox({
        autoBind: true,
        dataTextField: "comCdNm",
        dataValueField: "comCd",
        dataSource: {
            data: CNSL180M_comCdList.filter(function (code) {
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

function CNSL180M_grid_fnOnDataBound(gridIndex) {
    $("#CNSL180M_grid" + gridIndex + " tbody").off("click").on("click", "td", function(e) {
        var $row = $(this).closest("tr");
        var $cell = $(this).closest("td");
        CNSL180M_grid[gridIndex].currentItem = CNSL180M_grid[gridIndex].instance.dataItem($row);
        CNSL180M_grid[gridIndex].currentCellIndex = $cell.index();
    });
}

function CNSL180M_grid_fnOnChange(e, gridIndex) {
    var rows = e.sender.select(),
        items = [];

    rows.each(function(e) {
        var dataItem = CNSL180M_grid[gridIndex].instance.dataItem(this);
        items.push(dataItem);
    });

    CNSL180M_grid[gridIndex].selectedItems = items;
};

function CNSL180M_fnMenuUpDown(gridIndex, val) {
	gridIndex = Number(gridIndex);
	val = Number(val);
	
    if (CNSL180M_grid[gridIndex].selectedItems.length == 0) {
        Utils.alert("대상을 선택해주세요.");
        return;
    }
    if (CNSL180M_grid[gridIndex].selectedItems.length > 1) {
        Utils.alert("한개만 선택해주세요.", function () {
            CNSL180M_grid[gridIndex].instance.clearSelection();
        });
        return;
    }
    var totalRecords = CNSL180M_grid[gridIndex].instance.dataSource.total();
    var index = CNSL180M_grid[gridIndex].instance.select().index();
    var from = index + 1;
    var to = from + val;
    
    if (1 > to || to > totalRecords) {
        return;
    }
    CNSL180M_grid[gridIndex].instance.dataSource.pushMove(to, CNSL180M_grid[gridIndex].instance.dataSource.at(index));
    CNSL180M_grid_fnTotalSorting(gridIndex);
}


function CNSL180M_grid_fnTotalSorting(gridIndex) {
    let result = false;
    let changeCnt = 0;

    $.each(CNSL180M_grid[gridIndex].dataSource.data(), function (index, item) {
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

function CNSL180M_fnChk(e) {
    var grid = e.sender;
    var dataItem = grid.dataItem(e.sender.select());
}


function CNSL180M_fnSearchTenant() {
	Utils.setCallbackFunction("CNSL180M_fnSYSM101PCallback", function(tenantId) {
        $("#CNSL180M_tenantId").val(tenantId);
        GetTenantNm(tenantId, "CNSL180M_tenantNm");
        CNSL180M_fnSearchCustomLyotList();
    });
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM101P", "SYSM101P", 1100, 600, {callbackKey: "CNSL180M_fnSYSM101PCallback"})
}

function CNSL180M_fnOpenPopSYSM241P(gridIndex) {
    Utils.setCallbackFunction("CNSL180M_fnSYSM241PCallback", CNSL180M_fnSYSM241PCallback);
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM241P", "SYSM241P", 780, 550, {callbackKey: "CNSL180M_fnSYSM241PCallback"});
}

function CNSL180M_fnSYSM241PCallback(item) {
    CNSL180M_grid[1].currentItem.set("mgntItemCd", item.mgntItemCd);
    CNSL180M_grid[1].currentItem.set("mgntItemNm", item.mgntItemCdNm);
    CNSL180M_grid[1].currentItem.set("mgntItemTypCd", item.mgntItemTypCd);
    CNSL180M_grid[1].currentItem.set("dataSzIntMnriCnt", item.dataSzIntMnriCnt);
    CNSL180M_grid[1].currentItem.set("crypTgtYn", item.crypTgtYn);
}