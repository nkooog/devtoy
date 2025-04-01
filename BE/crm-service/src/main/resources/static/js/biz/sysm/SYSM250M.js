/***********************************************************************************************
 * Program Name : 메뉴관리(SYSM250M.js)
 * Creator      : jrlee
 * Create Date  : 2022.03.18
 * Description  : 메뉴관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.18     jrlee           최초작성
 ************************************************************************************************/

var SYSM250M_comCdList;
var SYSM250M_totalMenuList;
var SYSM250M_dataframePopupTarget;
var SYSM250M_grid = new Array(3);

$(document).ready(function () {
    /*init Object*/
    for (let i = 0; i < SYSM250M_grid.length; i++) {
        SYSM250M_grid[i] = {
            instance: new Object(),
            dataSource: new Object(),
            currentItem: new Object(),
            currentCellIndex: new Number(),
            selectedItems: new Array(),
            loadCount: 0
        }
    }

    SYSM250M_grid[0].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall("/sysm/SYSM250SEL01", JSON.stringify(options.data), function (result) {
                    SYSM250M_totalMenuList = JSON.parse(result.list);
                    var list = SYSM250M_totalMenuList.filter(function (menu) {
                        return (menu.prsMenuLvl == 1 && Utils.isNotNull(menu.menuTypCd))
                    });
                    options.success(list);
                });
            },
            create: function (options) {
                Utils.ajaxCall("/sysm/SYSM250INS01", JSON.stringify({
                    list: options.data.models
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            update: function (options) {
                var updateList = options.data.models;
                var regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprOrgCd: GLOBAL.session.user.orgCd
                }

                $.each(updateList, function(index, item){
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/sysm/SYSM250UPT01", JSON.stringify({
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
                SYSM250M_fnSearchTopMenuList();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "id",
                fields: {
                    menuId: {type: "string", nullable: false},
                    menuNm: {type: "string"},
                    menuTypCd: {type: "string", editable: false},
                    iconTypClss: {type: "string"},
                    srtSeqNo: {type: "Integer"}
                }
            }
        }
    });

    SYSM250M_grid[0].instance = $("#SYSM250M_grid0").kendoGrid({
        dataSource: SYSM250M_grid[0].dataSource,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        sortable: false,
        resizable: true,
        noRecords: {
            template: "<div class='nodataMsg'><p>" + "조회 결과가 없습니다." + "</p></div>" //조회 결과가 없습니다.
        },
        dataBound: function() {
            SYSM250M_grid_fnOnDataBound(0);
        },
        change: function(e) {
            SYSM250M_grid_fnOnChange(e, 0);
        },
        cellClose: function(e) {
            SYSM250M_fnChkMenuId(e);
        },
        columns: [{
            selectable: true,
            width: 40
        },{
            title: "상태",
            type: "string",
            width: 45,
            template: function (dataItem) {
                let html = "";
                if (dataItem.isNew()) {
                    html = "<img src='"+GLOBAL.contextPath+"/images/contents/btn_new.png' style='vertical-align:middle'>";
                } else if (dataItem.dirty) {
                    html = "<img src='"+GLOBAL.contextPath+"/images/contents/btn_modify.png' style='vertical-align:middle'>";
                }

                return html;
            },
        }, {
            field: "iconTypClss",
            title: SYSM250M_langMap.get("SYSM250M.grid.column.iconTypClss"), // 아이콘
            width: 100,
            editable: function() {
                return false;
            },
            template:
                "<p class='iconSelected'>" +
                "<button type='button' class='btnRefer_default' onclick='SYSM250M_fnOpenPopSYSM252P(this);'><span class='k-icon k-i-image'></span>ICON</button>" +
                "<span class='icon'><img src='" + GLOBAL.contextPath + "/images/contents/#: iconTypClss #' alt=''></span>" +
                "</p>"
        },{
            field: "menuId",
            title: "ID",
            type: "string",
            width: 60,
            attributes: {"class": "k-text-left"}
        }, {
            field: "menuNm",
            title: SYSM250M_langMap.get("SYSM250M.grid.column.menuNm"), // 메뉴명
            type: "string",
            width: 100,
            attributes: {"class": "textEllipsis"}
        }, {
            field: "menuTypCd",
            title: SYSM250M_langMap.get("SYSM250M.grid.column.menuTypCd"), // 유형
            type: "string",
            width: 80,
            template: function (dataItem) {
                return Utils.getComCdNm(SYSM250M_comCdList, 'C0017', dataItem.menuTypCd);
            }
        }, {
            title: "상세",
            width: 40,
            template: "<button type='button' class='k-icon k-i-zoom-in' title='상세보기' onclick='SYSM250M_fnSearchMiddleMenuList(this)'></button>"
        }]
    }).data("kendoGrid");

    SYSM250M_grid[1].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall("/sysm/SYSM250SEL03", JSON.stringify(options.data), function (result) {
                    SYSM250M_totalMenuList = JSON.parse(result.totalList);
                    options.success(JSON.parse(result.list));
                });
            },
            create: function (options) {
                Utils.ajaxCall("/sysm/SYSM250INS01", JSON.stringify({
                    list: options.data.models
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            update: function (options) {
                var updateList = options.data.models;
                var regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprOrgCd: GLOBAL.session.user.orgCd
                }

                $.each(updateList, function(index, item){
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/sysm/SYSM250UPT01", JSON.stringify({
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

            if (type != "read" && type != "destroy") {
                SYSM250M_fnSearchMiddleMenuList();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "id",
                fields: {
                    menuId: {type: "string", nullable: false},
                    menuNm: {type: "string"},
                    hgrkMenuId: {type: "string", nullable: true},
                    menuTypCd: {type: "string"},
                    srtSeqNo: {type: "Integer"}
                }
            }
        }
    });

    SYSM250M_grid[1].instance = $("#SYSM250M_grid1").kendoGrid({
        dataSource: SYSM250M_grid[1].dataSource,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        sortable: false,
        resizable: true,
        noRecords: {
            template: "<div class='nodataMsg'><p>" + SYSM250M_langMap.get("SYSM250M.alert.noRecords") + "</p></div>" // "상위 메뉴를 선택해주세요."
        },
        dataBound: function() {
            SYSM250M_grid_fnOnDataBound(1);
        },
        change: function(e) {
            SYSM250M_grid_fnOnChange(e, 1);
        },
        cellClose: function(e) {
            SYSM250M_fnChkMenuId(e);
        },
        columns: [{
            selectable: true,
            width: 40
        },{
            title: "상태",
            type: "string",
            width: 45,
            template: function (dataItem) {
                let html = "";

                if (dataItem.isNew()) {
                    html = "<img src='" + GLOBAL.contextPath + "/images/contents/btn_new.png' style='vertical-align:middle'>";
                } else if (dataItem.dirty) {
                    html = "<img src='" + GLOBAL.contextPath + "/images/contents/btn_modify.png' style='vertical-align:middle'>";
                }

                return html;
            },
        }, {
            field: "menuId",
            title: "ID",
            type: "string",
            width: 80,
            attributes: {"class": "k-text-left"}
        }, {
            field: "menuNm",
            title: SYSM250M_langMap.get("SYSM250M.grid.column.menuNm"), // 메뉴명
            type: "string",
            width: 100,
            attributes: {"class": "k-text-left"}
        }, {
            field: "menuTypCd",
            title: SYSM250M_langMap.get("SYSM250M.grid.column.menuTypCd"), // 유형
            type: "string",
            width: 120,
            editor: function (container, options) {
                SYSM250M_commonMenuTypCdEditor(container, options, SYSM250M_grid[1].instance, "T");
            },
            template: function (dataItem) {
                return Utils.getComCdNm(SYSM250M_comCdList, 'C0017', dataItem.menuTypCd);
            }
        }, {
            title: "상세",
            width: 40,
            template:
                "#if(menuTypCd == 'M'){#" +
                "<button type='button' class='k-icon k-i-zoom-in' title='상세보기' onclick='SYSM250M_fnSearch3DepthList(this)'></button>" +
                "#}#"
        }, {
            title: "DF",
            type: "string",
            width: 50,
            template:
                "#if(Utils.isNull(dataFrmId) && menuTypCd == 'D'){#" +
                "<button type='button' class='btnRefer_default' onclick='SYSM250M_fnOpenPopSYSM251P(1)'>" + SYSM250M_langMap.get("button.search") + "</button> " +
                "#}#" +
                "#if(Utils.isNotNull(dataFrmId)){#" +
                "<button type='button' class='btnRefer_default' onclick='SYSM250M_fnDeleteDataframe(1, this)'>" + SYSM250M_langMap.get("button.delete") + "</button> " +
                "#}#"
        }, {
            field: "dataFrmId",
            title: SYSM250M_langMap.get("SYSM250M.grid.column.dataFrmId"), // 데이터프레임 ID
            type: "string",
            width: 100,
            editable: function() {
                return false;
            }
        }, {
            field: "dataFrmKornNm",
            title: SYSM250M_langMap.get("SYSM250M.grid.column.dataFrmNm"), // 데이터프레임
            type: "string",
            width: 120,
            editable: function() {
                return false;
            }
        }
        ]
    }).data("kendoGrid");

    SYSM250M_grid[2].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall("/sysm/SYSM250SEL03", JSON.stringify(options.data), function (result) {
                    SYSM250M_totalMenuList = JSON.parse(result.totalList);
                    options.success(JSON.parse(result.list));
                });
            },
            create: function (options) {
                Utils.ajaxCall("/sysm/SYSM250INS01", JSON.stringify({
                    list: options.data.models
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            update: function (options) {
                var updateList = options.data.models;
                var regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprOrgCd: GLOBAL.session.user.orgCd
                }

                $.each(updateList, function(index, item){
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/sysm/SYSM250UPT01", JSON.stringify({
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

            if (type != "read" && type != "destroy") {
                SYSM250M_fnSearch3DepthList();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "id",
                fields: {
                    menuId: {type: "string", nullable: false},
                    menuNm: {type: "string"},
                    hgrkMenuId: {type: "string", nullable: true},
                    menuTypCd: {type: "string"},
                    srtSeqNo: {type: "Integer"}
                }
            }
        }
    });

    SYSM250M_grid[2].instance = $("#SYSM250M_grid2").kendoGrid({
        dataSource: SYSM250M_grid[2].dataSource,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        sortable: false,
        resizable: true,
        noRecords: {
            template: "<div class='nodataMsg'><p>" + SYSM250M_langMap.get("SYSM250M.alert.noRecords") + "</p></div>" // "상위 메뉴를 선택해주세요."
        },
        dataBound: function() {
            SYSM250M_grid_fnOnDataBound(2);
        },
        change: function(e) {
            SYSM250M_grid_fnOnChange(e, 2);
        },
        cellClose: function(e) {
            SYSM250M_fnChkMenuId(e);
        },
        columns: [{
            selectable: true,
            width: 40
        },{
            title: "상태",
            type: "string",
            width: 45,
            template: function (dataItem) {
                let html = "";

                if (dataItem.isNew()) {
                    html = "<img src='" + GLOBAL.contextPath + "/images/contents/btn_new.png' style='vertical-align:middle'>";
                } else if (dataItem.dirty) {
                    html = "<img src='" + GLOBAL.contextPath + "/images/contents/btn_modify.png' style='vertical-align:middle'>";
                }

                return html;
            },
        }, {
            field: "menuId",
            title: "ID",
            type: "string",
            width: 90,
            attributes: {"class": "k-text-left"}
        }, {
            field: "menuNm",
            title: SYSM250M_langMap.get("SYSM250M.grid.column.menuNm"), // 메뉴명
            type: "string",
            width: 100,
            attributes: {"class": "k-text-left"}
        }, {
            field: "menuTypCd",
            title: SYSM250M_langMap.get("SYSM250M.grid.column.menuTypCd"), // 유형
            type: "string",
            width: 120,
            template: function (dataItem) {
                return Utils.getComCdNm(SYSM250M_comCdList, 'C0017', dataItem.menuTypCd);
            },
            editable: function() {
                return false;
            },
        }, {
            title: "DF",
            type: "string",
            width: 50,
            template:
                "#if(Utils.isNull(dataFrmId)){#" +
                "<button type='button' class='btnRefer_default' onclick='SYSM250M_fnOpenPopSYSM251P(2)'>" + SYSM250M_langMap.get("button.search") + "</button> " +
                "#}#" +
                "#if(Utils.isNotNull(dataFrmId)){#" +
                "<button type='button' class='btnRefer_default' onclick='SYSM250M_fnDeleteDataframe(2, this)'>" + SYSM250M_langMap.get("button.delete") + "</button> " +
                "#}#"
        }, {
            field: "dataFrmId",
            title: SYSM250M_langMap.get("SYSM250M.grid.column.dataFrmId"), // 데이터프레임 ID
            type: "string",
            width: 100,
            editable: function() {
                return false;
            }
        }, {
            field: "dataFrmKornNm",
            title: SYSM250M_langMap.get("SYSM250M.grid.column.dataFrmNm"), // 데이터프레임
            type: "string",
            width: 120,
            editable: function() {
                return false;
            }
        }]
    }).data("kendoGrid");

    Utils.setKendoGridDoubleClickAction("#SYSM250M_grid0");
    Utils.setKendoGridDoubleClickAction("#SYSM250M_grid1");
    Utils.setKendoGridDoubleClickAction("#SYSM250M_grid2");

    SYSM250M_fnGridResize();
    $(window).on("resize", function () {SYSM250M_fnGridResize();});

    SYSM250M_fnInit();

    const SYSM250M_fnGridClear = () =>{
        SYSM250M_grid[0].instance.clearSelection();

        SYSM250M_grid[2].currentItem = new Object();
        SYSM250M_grid[1].currentItem = new Object();
        SYSM250M_grid[0].currentItem = new Object();

        SYSM250M_grid[2].dataSource.data([]);
        SYSM250M_grid[1].dataSource.data([]);
        SYSM250M_grid[0].dataSource.data([]);
    };
    CMMN_SEARCH_TENANT["SYSM250M"].fnInit(null,SYSM250M_fnSearchTopMenuList,SYSM250M_fnGridClear);
});

function SYSM250M_fnInit() {
    var param = {"codeList": [{"mgntItemCd": "C0111"},{"mgntItemCd": "C0017"}]};

    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        SYSM250M_comCdList = JSON.parse(result.codeList);

        var kendoComboBox = Utils.setKendoComboBox(SYSM250M_comCdList, "C0111", "#SYSM250M_mlingCd", GLOBAL.session.user.mlingCd);
        kendoComboBox.bind("change", function(e) {
            SYSM250M_fnSearchTopMenuList();
        });

        SYSM250M_fnSearchTopMenuList();
    });
}

function SYSM250M_fnSearchTopMenuList() {
    Utils.markingRequiredField();

    if (Utils.isNull($("#SYSM250M_tenantId").val())) {
        Utils.alert("테넌트를 입력해주세요.", function () {
            $("#SYSM250M_tenantId").focus();
        });
        return false;
    }

    SYSM250M_grid[0].instance.clearSelection();

    SYSM250M_grid[2].currentItem = new Object();
    SYSM250M_grid[1].currentItem = new Object();
    SYSM250M_grid[0].currentItem = new Object();

    SYSM250M_grid[2].dataSource.data([]);
    SYSM250M_grid[1].dataSource.data([]);
    SYSM250M_grid[0].dataSource.read({
        tenantId: $("#SYSM250M_tenantId").val(),
        mlingCd: $("#SYSM250M_mlingCd").val()
    });

}

function SYSM250M_fnSearchMiddleMenuList(obj) {
    SYSM250M_grid[1].instance.clearSelection();

    let selectedItem;

    if (obj) {
        let tr = $(obj).closest("tr");
        selectedItem = SYSM250M_grid[0].instance.dataItem(tr);

        SYSM250M_grid[0].instance.clearSelection();
        SYSM250M_grid[0].instance.select(tr);
    } else {
        selectedItem = SYSM250M_grid[0].currentItem;
    }

    SYSM250M_grid[2].currentItem = new Object();
    SYSM250M_grid[1].currentItem = new Object();

    SYSM250M_grid[2].dataSource.data([]);
    SYSM250M_grid[1].dataSource.read({
        menuId: selectedItem.id,
        prsMenuLvl: 2,
        tenantId: selectedItem.tenantId,
        mlingCd: selectedItem.mlingCd
    });
}

function SYSM250M_fnSearch3DepthList(obj) {
    SYSM250M_grid[2].instance.clearSelection();

    let selectedItem;

    if (obj) {
        let tr = $(obj).closest("tr");
        selectedItem = SYSM250M_grid[1].instance.dataItem(tr);

        SYSM250M_grid[1].instance.clearSelection();
        SYSM250M_grid[1].instance.select(tr);
    } else {
        selectedItem = SYSM250M_grid[1].currentItem;
    }

    SYSM250M_grid[2].dataSource.read({
        menuId: selectedItem.id,
        prsMenuLvl: 3,
        tenantId: selectedItem.tenantId,
        mlingCd: selectedItem.mlingCd
    });
}

function SYSM250M_fnAddMenu(gridIndex) {
    if (gridIndex != 0 && $.isEmptyObject(SYSM250M_grid[gridIndex - 1].currentItem)) {
        Utils.alert(SYSM250M_langMap.get("SYSM250M.alert.noRecords")); // "상위 메뉴를 선택해주세요."
        return;
    }

    SYSM250M_grid_fnTotalSorting(gridIndex);

    let totalRecords = SYSM250M_grid[gridIndex].dataSource.total();
    let row = {
        menuId: "",
        menuNm: "",
        prsMenuLvl: gridIndex + 1,
        srtSeqNo: Number(totalRecords + 1),
        dataFrmId: "",
        dataFrmKornNm: "",
    }
    let focusIndex;

    if (gridIndex == 0) {
        row.iconTypClss = null; // ex)ic_menu1
        row.menuTypCd = "T";
        focusIndex = 3;
    } else {
        row.hgrkMenuId = SYSM250M_grid[gridIndex - 1].currentItem.menuId;
        row.menuTypCd = "D";
        focusIndex = 2;
    }

    let regInfo = {
        tenantId: $("#SYSM250M_tenantId").val(),
        mlingCd: $("#SYSM250M_mlingCd").val(),
        regrId: GLOBAL.session.user.usrId,
        regrOrgCd: GLOBAL.session.user.orgCd,
        lstCorprId: GLOBAL.session.user.usrId,
        lstCorprOrgCd: GLOBAL.session.user.orgCd
    }

    SYSM250M_grid[gridIndex].dataSource.add($.extend(row, regInfo));                  //row 추가
    SYSM250M_grid[gridIndex].instance.refresh();

    SYSM250M_grid[gridIndex].instance.clearSelection();
    //기존 선택 제거
    SYSM250M_grid[gridIndex].instance.select("tr:last");
    //새로 추가된 Row 선택
    (SYSM250M_grid[gridIndex].instance).tbody.find("tr:last td:eq(" + focusIndex + ")").dblclick();
    //새로 추가된 Row의 (focusIndex = colum 번호)컬럼의 더블클릭 이벤트 실행
}

function SYSM250M_fnSaveMenu(gridIndex) {
    var isValid = true;

    $.each(SYSM250M_grid[gridIndex].dataSource.data(), function (index, item) {
        if (Utils.isNull(item.menuId)) {
            Utils.alert(SYSM250M_langMap.get("SYSM250M.alert.save.noMenuId")); // "ID를 입력해주세요."
            isValid = false;
            return false;
        }
        if (Utils.isNull(item.menuNm)) {
            Utils.alert(SYSM250M_langMap.get("SYSM250M.alert.save.noMenuNm")); // "메뉴명을 입력해주세요."
            isValid = false;
            return false;
        }
    });

    if (isValid) {
        Utils.confirm(SYSM250M_langMap.get("common.save.msg"), function () { // "저장하시겠습니까?"
            SYSM250M_grid[gridIndex].instance.dataSource.sync().then(function () {
                Utils.alert(SYSM250M_langMap.get("success.common.save")); // "정상적으로 저장되었습니다."
            });
        });
    }
}

function SYSM250M_fnDeleteMenu(gridIndex) {
    var selectedItems = SYSM250M_grid[gridIndex].selectedItems;

    if (selectedItems.length == 0) {
        Utils.alert(SYSM250M_langMap.get("SYSM250M.alert.delete.noMenu")); // "삭제할 메뉴를 선택해주세요."
        return;
    }

    var childMenuCount = 0;
    $.each(selectedItems, function(index, item){
        childMenuCount += SYSM250M_totalMenuList.filter(function (menu) {
            return item.menuId == menu.hgrkMenuId
        }).length;
    });

    if (childMenuCount > 0) {
        Utils.alert(SYSM250M_langMap.get("SYSM250M.alert.delete.hasChild")); // "하위 메뉴 삭제 후 현재 메뉴를 삭제 할 수 있습니다."
        return;
    }

    Utils.confirm(SYSM250M_langMap.get("common.delete.msg"), function () { // "삭제하시겠습니까?"
        Utils.ajaxCall("/sysm/SYSM250DEL01", JSON.stringify({
            list : selectedItems
        }), function (result) {
            Utils.alert(SYSM250M_langMap.get("success.common.delete"), function () { // "정상적으로 삭제되었습니다."
                if (gridIndex == 0) {
                    SYSM250M_fnSearchTopMenuList();
                } else if (gridIndex == 1) {
                    SYSM250M_fnSearchMiddleMenuList();
                } else if (gridIndex == 2) {
                    SYSM250M_fnSearch3DepthList();
                }
            });
        });
    });
}

function SYSM250M_commonMenuTypCdEditor(container, options, grid, exceptComCd) {
    let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);
    let menuTypCdList = SYSM250M_comCdList.filter(function (code) {
        return code.mgntItemCd == "C0017" && code.comCd != exceptComCd
    });

    Utils.setKendoComboBox(menuTypCdList, "C0017", $select, "", false).bind("change", function (e) {
        let element = e.sender.element;
        let row = element.closest("tr");
        let dataItem = grid.dataItem(row);
        let selectedValue = e.sender.value();

        dataItem.set("menuTypCd", selectedValue);
        if (dataItem.menuTypCd == "M") {
            dataItem.set("dataFrmId", "");
            dataItem.set("dataFrmKornNm", "");
        }

        grid.refresh();
    });
}

function SYSM250M_grid_fnOnDataBound(gridIndex) {
    $("#SYSM250M_grid" + gridIndex + " tbody").off("click").on("click", "td", function(e) {
        var $row = $(this).closest("tr");
        var $cell = $(this).closest("td");

        SYSM250M_grid[gridIndex].currentItem = SYSM250M_grid[gridIndex].instance.dataItem($row);
        SYSM250M_grid[gridIndex].currentCellIndex = $cell.index();

        //그리드 하위 메뉴 조회
//        if(gridIndex === 0){
//        	SYSM250M_fnSearchMiddleMenuList(this);
//        }
//        if(gridIndex === 1){
//        	SYSM250M_fnSearch3DepthList(this);
//        }
    });

    let totalCnt = SYSM250M_grid[gridIndex].instance.dataSource.total();
    let firstItem = SYSM250M_grid[gridIndex].instance.dataItem("tr:first");

    if (totalCnt > 0) {
        if (gridIndex == 0 && SYSM250M_grid[gridIndex].loadCount == 0) {
            if (firstItem.menuTypCd == "T") {
                $("#SYSM250M_grid" + gridIndex + " tbody tr:first td:eq(6) button").trigger("click");
            }
        } else if (gridIndex == 1) {
            if (firstItem.menuTypCd == "M" && SYSM250M_grid[gridIndex].loadCount == 1) {
                $("#SYSM250M_grid" + gridIndex + " tbody tr:first td:eq(5) button").trigger("click");
            }
        }
    }

    SYSM250M_grid[gridIndex].loadCount++;
}

function SYSM250M_grid_fnOnChange(e, gridIndex) {
    var rows = e.sender.select(),
        items = [];

    rows.each(function(e) {
        var dataItem = SYSM250M_grid[gridIndex].instance.dataItem(this);
        items.push(dataItem);
    });

    SYSM250M_grid[gridIndex].selectedItems = items;
};

function SYSM250M_fnMenuUpDown(gridIndex, val) {
    if (SYSM250M_grid[gridIndex].selectedItems.length == 0) {
        Utils.alert(SYSM250M_langMap.get("SYSM250M.alert.order.noMenu")); // "메뉴를 선택해주세요."
        return;
    }
    if (SYSM250M_grid[gridIndex].selectedItems.length > 1) {
        Utils.alert(SYSM250M_langMap.get("SYSM250M.alert.order.oneMenu"), function () { // "메뉴 한개만 선택해주세요."
            SYSM250M_grid[gridIndex].instance.clearSelection();
        });
        return;
    }

    var totalRecords = SYSM250M_grid[gridIndex].instance.dataSource.total();
    var index = SYSM250M_grid[gridIndex].instance.select().index();
    var from = index + 1;
    var to = from + val;

    if (1 > to || to > totalRecords) {
        return;
    }

    SYSM250M_grid[gridIndex].instance.dataSource.pushMove(to, SYSM250M_grid[gridIndex].instance.dataSource.at(index));

    SYSM250M_grid_fnTotalSorting(gridIndex);
}

function SYSM250M_fnChkMenuId(e) {
    let grid = e.sender;
    let dataItem = e.model;

    if (dataItem.id != dataItem.menuId) {
        let param = {
            menuId: dataItem.menuId,
            tenantId: $("#SYSM250M_tenantId").val(),
            mlingCd: $("#SYSM250M_mlingCd").val()
        }

        Utils.ajaxCall("/sysm/SYSM250SEL04", JSON.stringify(param), function (result) {
            let list = JSON.parse(result.list);

            if (list.length > 0) {
                dataItem.set("menuId", dataItem.id);
                Utils.alert(SYSM250M_langMap.get("SYSM250M.alert.update.menuId")); // "입력한 ID와 동일한 ID가 존재합니다."
            }
        });
    }
}

function SYSM250M_fnDeleteDataframe(gridIndex, obj) {
    var tr = $(obj).closest("tr");
    var dataItem = SYSM250M_grid[gridIndex].instance.dataItem(tr);

    dataItem.set("dataFrmId", "");
    dataItem.set("dataFrmKornNm", "");
}

function SYSM250M_fnOpenPopSYSM252P(obj) {
    if ($(obj).hasClass("toolTipActive")) {
        return;
    }

    let kendoTooltip = $(obj).parent().kendoTooltip({
        filter: "button",
        position: "right",
        width: 400,
        offset: -2,
        showOn: "click",
        autoHide: false,
        content: {
            url: GLOBAL.contextPath + "/sysm/SYSM252P" + "?" + $.param({
                lang: $.trim(GLOBAL.session.user.mlingCd),
                callbackKeyOk: "SYSM250M_fnSYSM252PCallback_ok",
                callbackKeyCancel: "SYSM250M_fnSYSM252PCallback_cancel"
            })
        },
        hide: function () {
            this.destroy();
            $(obj).removeClass("toolTipActive");
        }
    }).data("kendoTooltip");
    $(obj).addClass("toolTipActive");

    Utils.setCallbackFunction("SYSM250M_fnSYSM252PCallback_ok", function (icon) {
        SYSM250M_grid[0].currentItem.set("iconTypClss", icon);
    });
    Utils.setCallbackFunction("SYSM250M_fnSYSM252PCallback_cancel", function () {
        kendoTooltip.hide();
    });
}

function SYSM250M_fnOpenPopSYSM251P(gridIndex) {
    SYSM250M_dataframePopupTarget = gridIndex;
    Utils.setCallbackFunction("SYSM250M_fnSYSM251PCallback", function(item){
        if (SYSM250M_dataframePopupTarget == 1) {
            SYSM250M_grid[1].currentItem.set("dataFrmId", item.dataFrmId);
            SYSM250M_grid[1].currentItem.set("dataFrmKornNm", item.dataFrmKornNm);
        } else {
            SYSM250M_grid[2].currentItem.set("dataFrmId", item.dataFrmId);
            SYSM250M_grid[2].currentItem.set("dataFrmKornNm", item.dataFrmKornNm);
        }
    });
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM251P", "SYSM251P", 780, 550, {callbackKey: "SYSM250M_fnSYSM251PCallback"});
}

function SYSM250M_grid_fnTotalSorting(gridIndex) {
    let result = false;
    let changeCnt = 0;

    $.each(SYSM250M_grid[gridIndex].dataSource.data(), function (index, item) {
        let srtSeqNo = index + 1;
        if (item.srtSeqNo != srtSeqNo) {
            item.set("srtSeqNo", srtSeqNo);
            changeCnt++;
        }
    });

    if (changeCnt > 0) {
        result = true;
    }

    return result;
}

function SYSM250M_fnGridResize() {
    let screenHeight = $(window).height() - 210; // (헤더+푸터) 영역 높이 제외
    if (SYSM250M_grid[0].instance.element)
        SYSM250M_grid[0].instance.element.find('.k-grid-content').css('height', screenHeight-182);
    if (SYSM250M_grid[1].instance.element)
        SYSM250M_grid[1].instance.element.find('.k-grid-content').css('height', screenHeight/2-146);
    if (SYSM250M_grid[2].instance.element)
        SYSM250M_grid[2].instance.element.find('.k-grid-content').css('height', screenHeight/2-146);
}