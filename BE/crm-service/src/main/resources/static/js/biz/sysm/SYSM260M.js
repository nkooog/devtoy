/***********************************************************************************************
 * Program Name : 그룹별권한관리(SYSM260M.js)
 * Creator      : jrlee
 * Create Date  : 2022.04.14
 * Description  : 그룹별권한관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.14     jrlee           최초작성
 * 2022.12.13     djjung          권한별 버튼 정보 관련 주석처리 (상용화 결함 PD-0049)
 ************************************************************************************************/

var SYSM260M_comCdList = new Array();
var SYSM260M_grid = new Array(2);//3);

$(document).ready(function () {
    for (let i = 0; i < SYSM260M_grid.length; i++) {
        SYSM260M_grid[i] = {
            record: 0,
            instance: new Object(),
            dataSource: new Object(),
            currentItem: new Object(),
            currentCellIndex: new Number(),
            selectedItems: new Array(),
            checkedRows: new Array()
        }
    }

    SYSM260M_grid[0].instance = $("#SYSM260M_grid0").kendoGrid({
        dataSource:{
            transport: {
                read: function (options) {
                    var param = {
                        "codeList": [
                            {"mgntItemCd": "C0024"}
                        ],
                        "usrGrd": GLOBAL.session.user.originUsrGrd
                    };
                    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
                        var list = JSON.parse(result.codeList);
                        var grp = $("#SYSM260M_grp").val();

                        if (Utils.isNotNull(grp)) {
                            list = list.filter(function (row) {
                                return row.mapgVlu1 == grp
                            });
                        }
                        if (Utils.isNotNull(options.data.type)) {
                            list = list.filter(function (row) {
                                return row.mapgVlu2 == options.data.type
                            });
                        }

                        options.success(list);
                    });
                },
            },
            schema: {
                type: "json",
                model: {
                    id: "com_cd",
                    fields: {
                        com_cd: {type: "string"},
                        com_cd_nm: {type: "string"}
                    }
                }
            }
        },
        autoBind: false,
        selectable: "row",
        persistSelection: true,
        editable: false,
        sortable: true,
        resizable: true,
        noRecords: true,
        messages: {
            noRecords: SYSM260M_langMap.get("SYSM260M.grid.info.noRecords") // 조회 결과가 없습니다.
        },
        dataBound: function (e) {
            SYSM260M_grid_fnOnDataBound(e, 0);

            $("#SYSM260M_grid0 .k-grid-content td[role=gridcell]").css("cursor", "pointer");
        },
        columns: [{
            title: SYSM260M_langMap.get("table.select"),
            width: 40,
            template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',
        }, {
            field: "comCd",
            title: SYSM260M_langMap.get("SYSM260M.grid.column.usrGrp"), // 사용자 그룹
            type: "string",
            width: 80
        }, {
            field: "comCdNm",
            title: SYSM260M_langMap.get("SYSM260M.grid.column.usrGrpNm"), // 사용자 그룹명
            type: "string",
            width: 120,
            attributes: {"class": "k-text-left"}
        }]
    }).data("kendoGrid");

    SYSM260M_grid[1].instance = $("#SYSM260M_grid1").kendoTreeList({
        dataSource:{
            transport: {
                read: function (options) {
                    var param = {
                        tenantId: $("#SYSM260M_tenantId").val(),
                        mlingCd: GLOBAL.session.user.mlingCd
                    };
                    $.extend(param, options.data);

                    Utils.ajaxCall("/sysm/SYSM260SEL01", JSON.stringify(param), function (result) {
                        let list = JSON.parse(result.list);
                        let totalList = JSON.parse(result.totalList);

                        $.each(list, function(index, item){
                            if (item.menuTypCd != "D") {
                                let childList = list.filter(function (row) {
                                    return row.hgrkMenuId == item.menuId
                                });
                                if (childList.length > 0) {
                                    item.hasChildren = true;
                                    item.expanded = true;
                                }
                            }
                        });

                        $.each(totalList, function(index, item){
                            if (item.menuTypCd != "D") {
                                item.hasChildren = true;
                                item.expanded = true;
                            }
                        });

                        SYSM260M_grid[1].checkedRows = list;

                        options.success(totalList);
                    });
                },
            },
            schema: {
                type: "json",
                model: {
                    id: "menuId",
                    parentId: "hgrkMenuId",
                    fields: {
                        hgrkMenuId: {type: "string", nullable: true},
                        menuId: {type: "string"},
                        menuNm: {type: "string"},
                        menuTypCd: {type: "string"},
                        srtSeqNo: {type: "Integer"}
                    }
                }
            }
        },
        autoBind: false,
        // selectable: "multiple,row",
        // persistSelection: true,
        editable: false,
        sortable: false,
        resizable: true,
        messages: {
            noRows: SYSM260M_langMap.get("SYSM260M.grid.info.noMenu") // 사용자 그룹을 선택해주세요.
        },
        dataBound: function (e) {
            SYSM260M_grid_fnOnDataBound(e, 1);
        },
        change: function (e) {
            SYSM260M_grid_fnOnChange(e, 1);
        },
        collapse: function (e) {
            e.preventDefault();
        },
        columns: [{
            selectable: true,
            width: 40
        }, {
            field: "menuId",
            title: "ID",
            type: "string",
            width: 80,
            attributes: {"class": "k-text-left"}
        }, {
            field: "prsMenuLvl",
            title: SYSM260M_langMap.get("SYSM260M.grid.column.prsMenuLvl"), // 메뉴레벨
            type: "string",
            width: 50
        }, {
            field: "menuTypCd",
            title: SYSM260M_langMap.get("SYSM260M.grid.column.menuTypCd"), // 유형
            type: "string",
            width: 120,
            template: function (dataItem) {
                return Utils.getComCdNm(SYSM260M_comCdList, 'C0017', dataItem.menuTypCd);
            }
        }, {
            field: "menuNm",
            title: SYSM260M_langMap.get("SYSM260M.grid.column.menuNm"), // 메뉴명
            type: "string",
            width: 120,
            attributes: {"class": "k-text-left"}
        },
            // {
            // title: SYSM260M_langMap.get("button.select"), // 선택
            // width: 50,
            // template:
            //     "#if(menuTypCd == 'D'){#" +
            //     "<button type='button' class='k-icon k-i-zoom-in' onclick='SYSM260M_fnSearchBtnAtht(this)'/>" +
            //     "#}#"
            // }
        ]
    }).data("kendoTreeList");
    //-- grid3
    // SYSM260M_grid[2].instance = $("#SYSM260M_grid2").kendoGrid({
    //     dataSource:{
    //         transport: {
    //             read: function (options) {
    //                 Utils.ajaxCall("/sysm/SYSM260SEL02", JSON.stringify(options.data), function (result) {
    //                     options.success(JSON.parse(result.list));
    //                 });
    //             },
    //         },
    //         schema: {
    //             type: "json",
    //             model: {
    //                 fields: {
    //                     butnSeq: {type: "Integer"},
    //                     butnTypCd: {type: "string"},
    //                     butnNm: {type: "string"}
    //                 }
    //             }
    //         }
    //     },
    //     autoBind: false,
    //     selectable: false,
    //     persistSelection: false,
    //     editable: false,
    //     sortable: false,
    //     resizable: true,
    //     noRecords: {
    //         template: "<div class='nodataMsg'><p>" + SYSM260M_langMap.get("SYSM260M.grid.info.noRecords") + "</p></div>" // 조회 결과가 없습니다.
    //     },
    //     dataBound: function(e) {
    //         SYSM260M_grid_fnOnDataBound(e, 2);
    //     },
    //     columns: [{
    //         title: "No",
    //         template: "#= ++SYSM260M_grid[2].record #",
    //         width: 50
    //     },{
    //         field: "butnSeq",
    //         title: SYSM260M_langMap.get("SYSM260M.grid.column.butnSeq"), // 버튼순번
    //         type: "string",
    //         width: 80
    //     }, {
    //         field: "butnTypCd",
    //         title: SYSM260M_langMap.get("SYSM260M.grid.column.butnTypCd"), // 버튼유형
    //         type: "string",
    //         width: 120,
    //         template: function (dataItem) {
    //             return Utils.getComCdNm(SYSM260M_comCdList, 'C0201', dataItem.butnTypCd);
    //         }
    //     }, {
    //         field: "butnNm",
    //         title: SYSM260M_langMap.get("SYSM260M.grid.column.butnNm"), // 버튼명
    //         type: "string",
    //         width: 120,
    //         attributes: {"class": "k-text-left"}
    //     }]
    // }).data("kendoGrid");

    SYSM260M_fnGridResize();
    $(window).on("resize", function () { SYSM260M_fnGridResize();});

    SYSM260M_fnInit();
});

function SYSM260M_fnInit() {
    var param = {"codeList": [{"mgntItemCd": "C0017"},{"mgntItemCd": "C0116"},{"mgntItemCd": "C0201"}]};

    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        SYSM260M_comCdList = JSON.parse(result.codeList);
        Utils.setKendoComboBox(SYSM260M_comCdList, "C0116", "#SYSM260M_grp");

        const SYSM260M_fnGridClear = () => {
            SYSM260M_grid[1].instance.dataSource.data([]);
            $("#SYSM260M_grp").data("kendoComboBox").select(0);
        }
        CMMN_SEARCH_TENANT["SYSM260M"].fnInit(null,SYSM260M_fnSearchGroup,SYSM260M_fnGridClear);
    });
}

function SYSM260M_fnSearchGroup(_type) {
    Utils.markingRequiredField();

    if (Utils.isNull($("#SYSM260M_tenantId").val())) {
        Utils.alert("테넌트를 입력해주세요.", function () {
            $("#SYSM260M_tenantId").focus();
        });
        return false;
    }

    // SYSM260M_grid[2].instance.dataSource.data([]);
    SYSM260M_grid[1].instance.dataSource.data([]);

    SYSM260M_grid[0].instance.clearSelection();
    SYSM260M_grid[0].currentItem = new Object();
    SYSM260M_grid[0].instance.dataSource.read({
        type : _type
    });
}

function SYSM260M_grid_fnOnDataBound(e, gridIndex) {
    var grid = e.sender;
    var rows = grid.items();
    var checkParents = function(isSelected, dataItem) {
        var parentNode = SYSM260M_grid[1].instance.dataSource.parentNode(dataItem);
        if (!$.isEmptyObject(parentNode)) {
            rows.each(function (index, item) {
                var rowDataItem = grid.dataItem(item);
                if (rowDataItem.menuId == parentNode.menuId) {
                    if (isSelected) {
                        grid.select($(item));

                        checkParents(true, rowDataItem);
                    }
                }
            });
        }
    }
    var checkChildren = function(isSelected, dataItem) {
        var childrenNode = SYSM260M_grid[1].instance.dataSource.childNodes(dataItem);
        if (childrenNode.length > 0 && !isSelected) {
            rows.each(function (index, item) {
                var rowDataItem = grid.dataItem(item);

                var filter = childrenNode.filter(function (children){
                    return rowDataItem.menuId == children.menuId
                });

                if (filter.length > 0) {
                    $(item).removeClass("k-state-selected");
                    $(item).find("input:checkbox").prop("checked", false);

                    checkChildren(false, rowDataItem);
                }
            });
        }
    }

    SYSM260M_grid[gridIndex].record = 0;

    rows.off("click").on("click", function (e) {
        // var dataItem = grid.dataItem($(e.target).closest("tr"));
        var dataItem = grid.dataItem(this);
        var cellIndex = $(e.target).index();
        SYSM260M_grid[gridIndex].currentItem = dataItem;

        if (gridIndex == 0) {
            // SYSM260M_grid[2].instance.dataSource.data([]);
            SYSM260M_grid[1].instance.clearSelection();
            SYSM260M_grid[1].instance.dataSource.read({
                usrGrd: dataItem.comCd
            });
        } else if (gridIndex == 1) {
            if (cellIndex == 0) {
                var isSelected = !$(this).hasClass("k-state-selected");
                checkParents(isSelected, dataItem);
                checkChildren(isSelected, dataItem);
            }
        }
    });

    if (gridIndex == 1) {
        var checkedRows = SYSM260M_grid[1].checkedRows;

        if (checkedRows.length > 0) {
            rows.each(function () {
                var $this = $(this);
                var dataItem = grid.dataItem(this);

                $.each(checkedRows, function(index, item){
                    if (item.menuId == dataItem.menuId) {
                        dataItem.usrGrd = item.usrGrd;
                        grid.select($this);
                    }
                });
            });

            SYSM260M_grid[1].checkedRows = [];
        }
        // else {
            // rows.each(function () {
            //     grid.select($(this));
            // });
        // }
        SYSM260M_grid_fnOnChange(e, gridIndex);
    }

    if (gridIndex == 0)
        $("#SYSM260M_grid" + gridIndex + " tbody tr:first").trigger("click");
}

function SYSM260M_grid_fnOnChange(e, gridIndex) {
    var rows = e.sender.select(),
        items = [];

    rows.each(function(e) {
        var dataItem = SYSM260M_grid[gridIndex].instance.dataItem(this);
        items.push(dataItem);
    });

    SYSM260M_grid[gridIndex].selectedItems = items;
}

function SYSM260M_fnInitMenu() {
    if ($.isEmptyObject(SYSM260M_grid[0].currentItem)) {
        Utils.alert(SYSM260M_langMap.get("SYSM260M.grid.info.noMenu"));
        return;
    }

    SYSM260M_grid[1].instance.dataSource.read({
        usrGrd : SYSM260M_grid[0].currentItem.comCd
    });
}

function SYSM260M_fnSaveMenu() {
    var selectedItems = SYSM260M_grid[1].selectedItems;
    var currentUsrGrd = SYSM260M_grid[0].currentItem.comCd;
    var regInfo = {
        usrGrd: currentUsrGrd,
        regrId: GLOBAL.session.user.usrId,
        regrOrgCd: GLOBAL.session.user.orgCd,
        lstCorprId: GLOBAL.session.user.usrId,
        lstCorprOrgCd: GLOBAL.session.user.orgCd
    }

    // if (selectedItems.length == 0) {
    //     Utils.alert(SYSM260M_langMap.get("SYSM260M.alert.save.noMenu")); // 저장할 메뉴를 선택해주세요.
    //     return;
    // }

    Utils.confirm(SYSM260M_langMap.get("SYSM260M.alert.save"), function() { // 현재 선택된 메뉴만 저장 됩니다.<br>저장 하시겠습니까?
        $.each(selectedItems, function(index, item){
            $.extend(item, regInfo);
        });

        Utils.ajaxCall("/sysm/SYSM260INS01", JSON.stringify({
            tenantId: $("#SYSM260M_tenantId").val(),
            mlingCd: GLOBAL.session.user.mlingCd,
            usrGrd: currentUsrGrd,
            list: selectedItems
        }), function (result) {
            Utils.alert(SYSM260M_langMap.get("success.common.save"), function () { // 정상적으로 저장되었습니다.
                SYSM260M_fnInitMenu();
            });
        });
    });
}

function SYSM260M_fnDeleteMenu() {
    var selectedItems = SYSM260M_grid[1].selectedItems;

    if (selectedItems.length == 0) {
        Utils.alert(SYSM260M_langMap.get("SYSM260M.alert.delete")); // 삭제할 메뉴를 선택해주세요.
        return;
    }

    Utils.confirm(SYSM260M_langMap.get("common.delete.msg"), function() { // 삭제 하시겠습니까?
        Utils.ajaxCall("/sysm/SYSM260DEL02", JSON.stringify({
            list: selectedItems
        }), function (result) {
            Utils.alert(SYSM260M_langMap.get("success.common.delete"), function () { // 정상적으로 삭제되었습니다.
                SYSM260M_fnInitMenu();
            });
        });
    });
}

function SYSM260M_fnGridResize() {
    let screenHeight = $(window).height() - 210; // (헤더+푸터) 영역 높이 제외

    if (SYSM260M_grid[0].instance.element)
        SYSM260M_grid[0].instance.element.find('.k-grid-content').css('height', screenHeight-182);
    if (SYSM260M_grid[1].instance.element)
        SYSM260M_grid[1].instance.element.find('.k-grid-content').css('height', screenHeight-182);
    // SYSM260M_grid[1].instance.element.find('.k-grid-content').css('height', screenHeight/2-70);
    // if (SYSM260M_grid[2].instance.element)
    //     SYSM260M_grid[2].instance.element.find('.k-grid-content').css('height', screenHeight/2-220);
}
// function SYSM260M_fnSearchBtnAtht(obj) {
//     let tr = $(obj).closest("tr");
//     let selectedItem = SYSM260M_grid[1].instance.dataItem(tr);
// SYSM260M_grid[2].instance.dataSource.read({
//     tenantId: selectedItem.tenantId,
//     dataFrmId: selectedItem.dataFrmId,
//     usrGrd: selectedItem.usrGrd
// });
// }
// 미사용
// function SYSM260M_fnGetAllMenu() {
//     if ($.isEmptyObject(SYSM260M_grid[0].currentItem)) {
//         Utils.alert(SYSM260M_langMap.get("SYSM260M.grid.info.noMenu"));
//         return;
//     }
//
//     SYSM260M_grid[1].checkedRows = SYSM260M_grid[1].selectedItems; // 기존 선택 메뉴
//
//     var param = {
//         tenantId: $("#SYSM260M_tenantId").val(),
//         mlingCd: GLOBAL.session.user.mlingCd
//     };
//
//     Utils.ajaxCall("/sysm/SYSM250SEL01", JSON.stringify(param), function (result) {
//         var list = JSON.parse(result.list);
//
//         $.each(list, function(index, item){
//             if (item.menuTypCd != "D") {
//                 item.hasChildren = true;
//                 item.expanded = true;
//             }
//         });
//
//         SYSM260M_grid[1].instance.clearSelection();
//         SYSM260M_grid[1].selectedItems = [];
//         SYSM260M_grid[1].instance.dataSource.data(list);
//     });
// }