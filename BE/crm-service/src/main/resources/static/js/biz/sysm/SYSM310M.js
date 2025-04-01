/***********************************************************************************************
 * Program Name : 그룹별 DataFrame 권한관리(SYSM310M.js)
 * Creator      : jrlee
 * Create Date  : 2022.07.15
 * Description  : 그룹별 DataFrame 권한관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.07.15     jrlee           최초작성
 ************************************************************************************************/
var SYSM310M_comCdList = new Array();
var SYSM310M_grid = new Array(4);

$(document).ready(function () {
    for (let i = 0; i < SYSM310M_grid.length; i++) {
        SYSM310M_grid[i] = {
            record: 0,
            instance: new Object(),
            dataSource: new Object(),
            currentItem: new Object(),
            currentCellIndex: new Number(),
            selectedItems: new Array(),
            checkedRows: new Array()
        }
    }

    Utils.resizeLabelWidth();

    $("#SYSM310M_srchText").on("keyup", function (e) {
        if (e.keyCode == 13) {
            SYSM310M_fnSearch();
        }
    });

    SYSM310M_grid[0].instance = $("#SYSM310M_grid0").kendoGrid({
        dataSource:{
            transport: {
                read: function (options) {
                    let param = {
                        tenantId: $("#SYSM310M_tenantId").val(),
                        dataFrmeClasCd: $("#SYSM310M_dataFrmeClasCd").val(),
                        lyotApclDvCd: $("#SYSM310M_lyotApclDvCd").val(),
                        scrnDispDrctCd: $("#SYSM310M_scrnDispDrctCd").val(),
                        srchList: $("#SYSM310M_dataFrmTypCd").data("kendoMultiSelect").value(),
                        srchText: $("#SYSM310M_srchText").val(),
                        srchCond: $("#SYSM310M_srchCond").val()
                    };
                    $.extend(param, options.data);

                    Utils.ajaxCall("/sysm/SYSM310SEL01", JSON.stringify(param), function (result) {
                        options.success(JSON.parse(result.list));
                    });
                },
            },
            schema: {
                type: "json",
                model: {
                    id: "dataFrmId",
                    fields: {
                        dataFrmeClasCd: {type: "string"},
                        dataFrmTypCd: {type: "string"},
                        dataFrmId: {type: "string"},
                        dataFrmKornNm: {type: "string"},
                    }
                }
            }
        },
        autoBind: false,
        selectable: "row",
        persistSelection: true,
        editable: false,
        sortable: false,
        resizable: true,
        noRecords: {
            template: "<div class='nodataMsg'><p>" + SYSM310M_langMap.get("fail.common.select") + "</p></div>" // 조회된 내역이 없습니다.
        },
        dataBound: function (e) {
            SYSM310M_grid_fnOnDataBound(e, 0);
            $("#SYSM310M_grid0 .k-grid-content td[role=gridcell]").css("cursor", "pointer");
        },
        change: function (e) {
            SYSM310M_grid_fnOnChange(e, 0);
        },
        columns: [
            {
                title: SYSM310M_langMap.get("table.select"),
                width: 35,
                template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',
            },
            {
                field: "dataFrmeClasCd",
                title: SYSM310M_langMap.get("SYSM310M.grid.column.dataFrmeClasCd"), // 프레임분류
                type: "string",
                width: 140,  //90->140, 2023.01.17 sukim 사이즈 늘림
                attributes: {"class": "textEllipsis"},
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM310M_comCdList, 'C0018', dataItem.dataFrmeClasCd);
                }
            },
            {
                field: "dataFrmTypCd",
                title: SYSM310M_langMap.get("SYSM310M.grid.column.dataFrmTypCd"), // 유형
                type: "string",
                width: 80,
                attributes: {"class": "textEllipsis"},
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM310M_comCdList, 'C0197', dataItem.dataFrmTypCd);
                }
            },
            {
                field: "dataFrmId",
                title: SYSM310M_langMap.get("SYSM310M.grid.column.dataFrmId"), // 프레임ID
                type: "string",
                width: 90
            },
            {
                field: "dataFrmKornNm",
                title: SYSM310M_langMap.get("SYSM310M.grid.column.dataFrmKornNm"), // 데이터프레임명
                type: "string",
                width: 200, //110->200, 2023.01.17 sukim 사이즈 늘림
                attributes: {"class": "textEllipsis"}
            }/*,
            {
                field: "dataFrmeTmplCd",
                title: SYSM310M_langMap.get("SYSM310M.grid.column.dataFrmeTmplCd"), // 템플릿
                width: 90,
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM310M_comCdList, 'C0198', $.trim(dataItem.dataFrmeTmplCd));
                }
            },
            {
                field: "lyotApclDvCd",
                title: SYSM310M_langMap.get("SYSM310M.grid.column.lyotApclDvCd"), // 레이아웃대상
                width: 90,
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM310M_comCdList, 'C0200', $.trim(dataItem.lyotApclDvCd));
                }
            }*/  //2023.01.17 sukim 주석처리(불필요하게 많은 항목 조회 - UI 디자인적으로 비추)
        ]
    }).data("kendoGrid");

    SYSM310M_grid[1].instance = $("#SYSM310M_grid1").kendoGrid({
        dataSource:{
            transport: {
                read: function (options) {
                    Utils.ajaxCall("/sysm/SYSM310SEL02", JSON.stringify(options.data), function (result) {
                        options.success(JSON.parse(result.list));
                        SYSM310M_fnGetAllUsrGrd();
                    });
                },
            },
            schema: {
                type: "json",
                model: {
                    fields: {
                        usr_grd: {type: "string"},
                    }
                }
            }
        },
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        editable: false,
        sortable: true,
        resizable: true,
        noRecords: {
            template: "<div class='nodataMsg'><p>" + SYSM310M_langMap.get("SYSM310M.grid.info.noRecords") + "</p></div>" // 데이터프레임을 선택하세요.
        },
        dataBound: function (e) {
            SYSM310M_grid_fnOnDataBound(e, 1);
            $("#SYSM310M_grid1 .k-grid-content td[role=gridcell]").css("cursor", "pointer");
        },
        change: function (e) {
            SYSM310M_grid_fnOnChange(e, 1);
        },
        columns: [
            {
                selectable: true,
                width: 30
            },
            {
                title: "No",
                template: "#= ++SYSM310M_grid[1].record #",
                width: 40
            },
            {
                field: "usrGrd",
                title: SYSM310M_langMap.get("SYSM310M.grid.column.usrGrd"), // 사용자그룹
                type: "string",
                width: 100
            },
            {
                title: SYSM310M_langMap.get("SYSM310M.grid.column.usrGrdNm"), // 사용자그룹명
                type: "string",
                width: "auto",
                attributes: {"class": "k-text-left"},
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM310M_comCdList, 'C0024', dataItem.usrGrd);
                }
            }
        ]
    }).data("kendoGrid");

    SYSM310M_grid[2].instance = $("#SYSM310M_grid2").kendoGrid({
        dataSource:{
            transport: {
                read: function (options) {
                    Utils.ajaxCall("/sysm/SYSM310SEL03", JSON.stringify(options.data), function (result) {
                        options.success(JSON.parse(result.list));
                    });
                },
            },
            schema: {
                type: "json",
                model: {
                    fields: {
                        butnSeq: {type: "Integer"},
                        butnTypCd: {type: "string"},
                        butnId: {type: "string"},
                        butnNm: {type: "string"},
                        linkSumnPgmId: {type: "string"},
                        butnStCd: {type: "string"}
                    }
                }
            }
        },
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        editable: false,
        sortable: false,
        resizable: true,
        noRecords: {
            template: "<div class='nodataMsg'><p>" + SYSM310M_langMap.get("SYSM310M.grid.info.noRecords") + "</p></div>" // 데이터프레임을 선택하세요.
        },
        dataBound: function(e) {
            SYSM310M_grid_fnOnDataBound(e, 2);
        },
        change: function (e) {
            SYSM310M_grid_fnOnChange(e, 2);
        },
        columns: [
            {
                selectable: true,
                width: 25,
                headerAttributes: {"class": "pad_0"},
                attributes: {"class": "pad_0"},
            },
            {
                title: "No",
                template: "#= ++SYSM310M_grid[2].record #",
                width: 40
            },
            {
                field: "butnTypCd",
                title: SYSM310M_langMap.get("SYSM310M.grid.column.butnTypCd"), // 버튼유형
                type: "string",
                width: 65,
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM310M_comCdList, 'C0201', dataItem.butnTypCd);
                }
            },
            {
                field: "butnId",
                title: SYSM310M_langMap.get("SYSM310M.grid.column.butnId"), // 버튼 ID
                type: "string",
                width: 70
            },
            {
                field: "butnNm",
                title: SYSM310M_langMap.get("SYSM310M.grid.column.butnNm"), // 버튼명
                type: "string",
                width: 85,
                attributes: {"class": "k-text-left"}
            },
            {
                field: "linkSumnPgmId",
                title: SYSM310M_langMap.get("SYSM310M.grid.column.linkSumnPgmId"), // 연결 PGM ID
                type: "string",
                width: 85
            },
            {
                field: "butnStCd",
                title: SYSM310M_langMap.get("SYSM310M.grid.column.butnStCd"), // 상태
                type: "string",
                width: 50,
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM310M_comCdList, 'C0202', dataItem.butnStCd);
                }
            }
        ]
    }).data("kendoGrid");

    SYSM310M_grid[3].instance = $("#SYSM310M_grid3").kendoGrid({
        dataSource:{
            transport: {
                read: function (options) {
                    Utils.ajaxCall("/sysm/SYSM310SEL04", JSON.stringify(options.data), function (result) {
                        options.success(JSON.parse(result.list));
                    });
                },
            },
            schema: {
                type: "json",
                model: {
                    fields: {
                        usrGrd: {type: "string"},
                        butnSeq: {type: "Integer"},
                        butnTypCd: {type: "string"},
                        butnNm: {type: "string"}
                    }
                }
            }
        },
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        editable: false,
        sortable: false,
        resizable: true,
        noRecords: {
            template: "<div class='nodataMsg'><p>" + SYSM310M_langMap.get("SYSM310M.grid.info.noRecords") + "</p></div>" // 데이터프레임을 선택하세요.
        },
        dataBound: function(e) {
            SYSM310M_grid_fnOnDataBound(e, 3);
        },
        change: function (e) {
            SYSM310M_grid_fnOnChange(e, 3);
        },
        columns: [{
            selectable: true,
            width: 40
        }, {
            field: "usrGrd",
            title: SYSM310M_langMap.get("SYSM310M.grid.column.usrGrd"), // 사용자그룹
            type: "string",
            width: 130,
            template: function (dataItem) {
                return Utils.getComCdNm(SYSM310M_comCdList, 'C0024', dataItem.usrGrd);
            }
        }, {
            field: "butnSeq",
            title: SYSM310M_langMap.get("SYSM310M.grid.column.butnSeq"), // 버튼순번
            type: "Integer",
            width: 60
        }, {
            field: "butnTypCd",
            title: SYSM310M_langMap.get("SYSM310M.grid.column.butnTypCd"), // 버튼유형
            type: "string",
            width: 90,
            template: function (dataItem) {
                return Utils.getComCdNm(SYSM310M_comCdList, 'C0201', dataItem.butnTypCd);
            }
        }, {
            field: "butnNm",
            title: SYSM310M_langMap.get("SYSM310M.grid.column.butnNm"), // 버튼명
            type: "string",
            width: 100,
            attributes: {"class": "k-text-left"}
        }]
    }).data("kendoGrid");

    SYSM310M_fnGridResize();
    $(window).on("resize", function () { SYSM310M_fnGridResize();});

    SYSM310M_fnInit();
});

function SYSM310M_fnInit() {
    let param = {
        "codeList": [
            {"mgntItemCd": "S0005"}, // 데이터프레임관리 조회조건 (구분)
            {"mgntItemCd": "C0024"}, // 사용자등급
            {"mgntItemCd": "C0018"}, // 데이터프레임분류
            {"mgntItemCd": "C0197"}, // 데이터프레임유형
            {"mgntItemCd": "C0164"}, // 화면표시방향
            {"mgntItemCd": "C0196"}, // 패키지분류
            {"mgntItemCd": "C0198"}, // 데이터프레임 템플릿코드
            {"mgntItemCd": "C0200"}, // 레이아웃적용대상
            {"mgntItemCd": "C0201"}, // 버튼유형코드
            {"mgntItemCd": "C0202"}, // 버튼상태코드 (사용여부)
        ]
    };

    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        SYSM310M_comCdList = JSON.parse(result.codeList);
        Utils.setKendoComboBox(SYSM310M_comCdList, "C0018", "#SYSM310M_dataFrmeClasCd");
        Utils.setKendoMultiSelect(SYSM310M_comCdList, "C0197", "#SYSM310M_dataFrmTypCd");
        Utils.setKendoComboBox(SYSM310M_comCdList, "C0200", "#SYSM310M_lyotApclDvCd");
        Utils.setKendoComboBox(SYSM310M_comCdList, "C0164", "#SYSM310M_scrnDispDrctCd");
        Utils.setKendoComboBox(SYSM310M_comCdList, "S0005", "#SYSM310M_srchCond", "", false);

        const SYSM310M_fnGridClear = () => {
            SYSM310M_grid[3].instance.dataSource.data([]);
            SYSM310M_grid[2].instance.dataSource.data([]);
            SYSM310M_grid[1].instance.dataSource.data([]);

            SYSM310M_grid[0].instance.clearSelection();
            SYSM310M_grid[0].currentItem = new Object();
            SYSM310M_grid[0].instance.dataSource.data([]);

            $("#SYSM310M_dataFrmeClasCd").data("kendoComboBox").select(0);
            $("#SYSM310M_dataFrmTypCd").data("kendoMultiSelect").dataSource.data([]);
            Utils.setKendoMultiSelect(SYSM310M_comCdList, "C0197", "#SYSM310M_dataFrmTypCd");
            $("#SYSM310M_lyotApclDvCd").data("kendoComboBox").select(0);
            $("#SYSM310M_scrnDispDrctCd").data("kendoComboBox").select(0);
            $("#SYSM310M_srchCond").data("kendoComboBox").select(0);
            $('#SYSM310M_srchText').val("");
        }
        CMMN_SEARCH_TENANT["SYSM310M"].fnInit(null,SYSM310M_fnSearch,SYSM310M_fnGridClear);
    });
}

function SYSM310M_fnSearch(_type) {
    Utils.markingRequiredField();

    if (Utils.isNull($("#SYSM310M_tenantId").val())) {
        Utils.alert("테넌트를 입력해주세요.", function () {
            $("#SYSM310M_tenantId").focus();
        });

        return false;
    }

    SYSM310M_grid[3].instance.dataSource.data([]);
    SYSM310M_grid[2].instance.dataSource.data([]);
    SYSM310M_grid[1].instance.dataSource.data([]);

    SYSM310M_grid[0].instance.clearSelection();
    SYSM310M_grid[0].currentItem = new Object();
    SYSM310M_grid[0].instance.dataSource.read();
}

function SYSM310M_grid_fnOnDataBound(e, gridIndex) {
    let grid = e.sender;
    let rows = grid.items();

    SYSM310M_grid[gridIndex].record = 0;

    rows.off("click").on("click", function (e) {
        var dataItem = grid.dataItem(this);
        var cellIndex = $(e.target).index();
        SYSM310M_grid[gridIndex].currentItem = dataItem;

        if (gridIndex == 0) {
            SYSM310M_grid[1].instance.clearSelection();
            SYSM310M_grid[1].instance.dataSource.read({
                tenantId: dataItem.tenantId,
                dataFrmId: dataItem.dataFrmId
            });
            SYSM310M_grid[2].instance.clearSelection();
            SYSM310M_grid[2].instance.dataSource.read({
                tenantId: dataItem.tenantId,
                dataFrmId: dataItem.dataFrmId
            });
            SYSM310M_grid[3].instance.clearSelection();
            SYSM310M_grid[3].instance.dataSource.read({
                tenantId: dataItem.tenantId,
                dataFrmId: dataItem.dataFrmId
            });
        }
    });

    if (gridIndex == 0) {
        $("#SYSM310M_grid" + gridIndex + " tbody tr:first").trigger("click");
    } else if (gridIndex == 1 || gridIndex == 2 || gridIndex == 3) {
        let checkedRows = SYSM310M_grid[gridIndex].checkedRows;

        if (checkedRows.length > 0) {
            rows.each(function () {
                let $this = $(this);
                let dataItem = grid.dataItem(this);

                $.each(checkedRows, function (index, item) {
                    if (item.usrGrd == dataItem.usrGrd) {
                        grid.select($this);
                    }
                });
            });

            SYSM310M_grid[gridIndex].checkedRows = [];
        } else {
            rows.each(function () {
                grid.select($(this));
            });
        }
        SYSM310M_grid_fnOnChange(e, gridIndex);
    }
}

function SYSM310M_grid_fnOnChange(e, gridIndex) {
    let rows = e.sender.select(),
        items = [];

    rows.each(function(e) {
        var dataItem = SYSM310M_grid[gridIndex].instance.dataItem(this);
        items.push(dataItem);
    });

    SYSM310M_grid[gridIndex].selectedItems = items;
}

function SYSM310M_fnGetAllUsrGrd(type) {
    if ($.isEmptyObject(SYSM310M_grid[0].currentItem)) {
        Utils.alert("데이터프레임을 선택해주세요.");
        return;
    }
    SYSM310M_grid[1].checkedRows = SYSM310M_grid[1].selectedItems; // 기존 선택 메뉴
    let list = SYSM310M_comCdList.filter(function (item) {
        if (item.mgntItemCd == "C0024") {
            item.usrGrd = item.comCd;
            return item;
        }
    });
    if (Utils.isNotNull(type)) {
        list = list.filter(function (item) {
            return (item.mapgVlu2 == type)
        });
    }
    
    if (SYSM310M_grid[1].checkedRows.length == 0) {
    	SYSM310M_grid[1].instance.dataSource.data(list);
    	SYSM310M_grid[1].instance.clearSelection();
    }else {
    	SYSM310M_grid[1].instance.clearSelection();
    	SYSM310M_grid[1].selectedItems = [];
        SYSM310M_grid[1].instance.dataSource.data(list);
    }
}

function SYSM310M_fnInitUsrGrd() {
    if ($.isEmptyObject(SYSM310M_grid[0].currentItem)) {
        Utils.alert(SYSM310M_langMap.get("SYSM310M.alert.noDataFrme")); // "데이터프레임을 선택해주세요."
        return;
    }

    SYSM310M_grid[1].instance.clearSelection();
    SYSM310M_grid[1].instance.dataSource.read({
        tenantId: SYSM310M_grid[0].currentItem.tenantId,
        dataFrmId: SYSM310M_grid[0].currentItem.dataFrmId
    });
}

function SYSM310M_fnSaveUsrGrd() {
    let selectedItems = SYSM310M_grid[1].selectedItems;
    let currentTenantId = SYSM310M_grid[0].currentItem.tenantId;
    let currentDataFrmId = SYSM310M_grid[0].currentItem.dataFrmId;
    let regInfo = {
        dataFrmId: currentDataFrmId,
        tenantId: currentTenantId,
        regrId: GLOBAL.session.user.usrId,
        regrOrgCd: GLOBAL.session.user.orgCd
    }

    if (selectedItems.length == 0) {
        Utils.alert(SYSM310M_langMap.get("SYSM310M.alert.save.noUsrGrd")); // "저장할 사용자그룹을 선택해주세요."
        return;
    }

    Utils.confirm(SYSM310M_langMap.get("SYSM310M.alert.save"), function() { // "현재 선택된 데이터만 저장 됩니다.<br>저장 하시겠습니까?"
        $.each(selectedItems, function(index, item){
            $.extend(item, regInfo);
        });

        Utils.ajaxCall("/sysm/SYSM310INS01", JSON.stringify({
            tenantId: currentTenantId,
            dataFrmId: currentDataFrmId,
            list: selectedItems
        }), function (result) {
            Utils.alert(SYSM310M_langMap.get("success.common.insert"), function () { // "정상적으로 등록되었습니다."
                SYSM310M_fnInitUsrGrd();
            });
        });
    });
}

function SYSM310M_fnDeleteUsrGrd() {
	let  SYSM310M_rows = new Array();
	let selectedItems = SYSM310M_grid[1].selectedItems;
    let currentTenantId = SYSM310M_grid[0].currentItem.tenantId;
    let currentDataFrmId = SYSM310M_grid[0].currentItem.dataFrmId;

    if (selectedItems.length == 0) {
        Utils.alert(SYSM310M_langMap.get("SYSM310M.alert.delete.noUsrGrd")); // "삭제할 사용자그룹을 선택해주세요."
        return;
    }
    
    $.each(selectedItems, function(index, item){
		var params = {
			 	tenantId  		: currentTenantId,
			 	dataFrmId 		: currentDataFrmId,
			 	usrGrd			: item.usrGrd,
		}
	 
		SYSM310M_rows.push(params);
	});
    
    Utils.confirm(SYSM310M_langMap.get("common.delete.msg"), function() { // 삭제 하시겠습니까?
        Utils.ajaxCall("/sysm/SYSM310DEL02", JSON.stringify({
            list: SYSM310M_rows
        }), function (result) {
            Utils.alert(SYSM310M_langMap.get("success.common.delete"), function () { // "정상적으로 삭제되었습니다."
                SYSM310M_fnInitUsrGrd();
            });
        });
    });
}

function SYSM310M_fnInitGrdbyButnAtht() {
    if ($.isEmptyObject(SYSM310M_grid[0].currentItem)) {
        Utils.alert(SYSM310M_langMap.get("SYSM310M.alert.noDataFrme")); // "데이터프레임을 선택해주세요."
        return;
    }

    SYSM310M_grid[3].instance.clearSelection();
    SYSM310M_grid[3].instance.dataSource.read({
        tenantId: SYSM310M_grid[0].currentItem.tenantId,
        dataFrmId: SYSM310M_grid[0].currentItem.dataFrmId
    });
}

function SYSM310M_fnSaveGrdbyButnAtht() {
    let selectedItems = SYSM310M_grid[3].selectedItems;
    let currentTenantId = SYSM310M_grid[0].currentItem.tenantId;
    let currentDataFrmId = SYSM310M_grid[0].currentItem.dataFrmId;
    let regInfo = {
        dataFrmId: currentDataFrmId,
        tenantId: currentTenantId,
        regrId: GLOBAL.session.user.usrId,
        regrOrgCd: GLOBAL.session.user.orgCd
    }

    if (selectedItems.length == 0) {
        Utils.alert(SYSM310M_langMap.get("SYSM310M.alert.save.noGrdbyButnAtht")); // "저장할 버튼권한 사용자그룹을 선택해주세요."
        return;
    }

    Utils.confirm(SYSM310M_langMap.get("SYSM310M.alert.save"), function() { // "현재 선택된 데이터만 저장 됩니다.<br>저장 하시겠습니까?"
        $.each(selectedItems, function(index, item){
            $.extend(item, regInfo);
        });

        Utils.ajaxCall("/sysm/SYSM310INS02", JSON.stringify({
            tenantId: currentTenantId,
            dataFrmId: currentDataFrmId,
            list: selectedItems
        }), function (result) {
            Utils.alert(SYSM310M_langMap.get("success.common.insert"), function () { // "정상적으로 등록되었습니다."
                SYSM310M_fnInitGrdbyButnAtht();
            });
        });
    });
}

function SYSM310M_fnDeleteGrdbyButnAtht() {
    let selectedItems = SYSM310M_grid[3].selectedItems;

    if (selectedItems.length == 0) {
        Utils.alert(SYSM310M_langMap.get("SYSM310M.alert.delete.noGrdbyButnAtht")); // "삭제할 버튼권한 사용자그룹을 선택해주세요."
        return;
    }

    Utils.confirm(SYSM310M_langMap.get("common.delete.msg"), function() { // 삭제 하시겠습니까?
        Utils.ajaxCall("/sysm/SYSM310DEL04", JSON.stringify({
            list: selectedItems
        }), function (result) {
            Utils.alert(SYSM310M_langMap.get("success.common.delete"), function () { // "정상적으로 삭제되었습니다."
                SYSM310M_fnInitGrdbyButnAtht();
            });
        });
    });
}

function SYSM310M_fnSettingGrdbyButnAtht() {
    let selectedItems1 = SYSM310M_grid[1].selectedItems;
    let selectedItems2 = SYSM310M_grid[2].selectedItems;
    let list = new Array();

    if ($.isEmptyObject(SYSM310M_grid[0].currentItem)) {
        Utils.alert(SYSM310M_langMap.get("SYSM310M.alert.noDataFrme")); // "데이터프레임을 선택해주세요."
        return;
    }

    if (selectedItems2.length == 0) {
        Utils.alert(SYSM310M_langMap.get("SYSM310M.alert.noGrdbyButnAtht")); // "선택된 데이터프레임 버튼정보가 없습니다."
        return;
    }

    if (selectedItems1.length == 0) {
        Utils.alert(SYSM310M_langMap.get("SYSM310M.alert.noUsrGrd")); // "선택된 사용자그룹이 없습니다."
        return;
    }

    SYSM310M_grid[3].checkedRows = SYSM310M_grid[3].selectedItems; // 기존 선택 유지

    for (let i = 0; i < selectedItems1.length; i++) {
        for (let j = 0; j < selectedItems2.length; j++) {
            list.push({
                tenantId: selectedItems1[i].tenantId,
                dataFrmId: selectedItems1[i].dataFrmId,
                usrGrd: selectedItems1[i].usrGrd,
                butnSeq: selectedItems2[j].butnSeq,
                butnTypCd: selectedItems2[j].butnTypCd,
                butnNm: selectedItems2[j].butnNm
            });
        }
    }

    SYSM310M_grid[3].instance.clearSelection();
    SYSM310M_grid[3].selectedItems = [];
    SYSM310M_grid[3].instance.dataSource.data(list);
}
function SYSM310M_fnGridResize() {
    let screenHeight = $(window).height() - 210; // (헤더+푸터) 영역 높이 제외

    if (SYSM310M_grid[0].instance.element)
        SYSM310M_grid[0].instance.element.find('.k-grid-content').css('height', screenHeight-214);
    if (SYSM310M_grid[1].instance.element)
        SYSM310M_grid[1].instance.element.find('.k-grid-content').css('height', screenHeight/2-221);
    if (SYSM310M_grid[2].instance.element)
        SYSM310M_grid[2].instance.element.find('.k-grid-content').css('height', screenHeight/2-71);
    if (SYSM310M_grid[3].instance.element)
        SYSM310M_grid[3].instance.element.find('.k-grid-content').css('height', screenHeight-214);
}