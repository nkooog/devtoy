/***********************************************************************************************
 * Program Name : 공통코드관리 (SYSM340M.js)
 * Creator      : jrlee
 * Create Date  : 2022.05.02
 * Description  : 공통코드관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.02     jrlee           최초작성
 ************************************************************************************************/

var SYSM340M_comCdList;
var SYSM340M_grid = new Array(2);
var SYSM340_currentRow;

for (let i = 0; i < SYSM340M_grid.length; i++) {
    SYSM340M_grid[i] = {
        instance: {},
        dataSource: {},
        currentItem: {},
        currentCellIndex: Number(),
        selectedItems: [],
        loadCount: 0
    }
}

$(window).on("resize", function () {
    SYSM340M_fnGridResize();
});

$(document).ready(function () {
    Utils.resizeLabelWidth();

    $("#SYSM340M_mgntItemCd, #SYSM340M_mgntItemCdNm").on("keyup", function (e) {
        if (e.keyCode == 13) {
            SYSM340M_fnSearch();
        }
    });
    
    SYSM340M_grid[0].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                let param = {
                    mlingCd: GLOBAL.session.user.mlingCd,
                    mgntItemCd: $("#SYSM340M_mgntItemCd").val(),
                    mgntItemCdNm: $("#SYSM340M_mgntItemCdNm").val(),
                };
                $.extend(param, options.data);
                Utils.ajaxCall("/sysm/SYSM340SEL01", JSON.stringify(param), function (result) {
                    options.success(JSON.parse(result.list));
                    if(!Utils.isNull(SYSM340_currentRow)){
                        let dataItem = SYSM340M_grid[0].instance.dataSource.get(SYSM340_currentRow);
                        console.log(dataItem)
                        SYSM340M_grid[0].instance.select($('[data-uid='+ dataItem.uid + ']'));
                    }
                });
            }
        },
        pageSize: 25,
        schema: {
            type: "json",
            model: {
                id : "mgntItemCd",
                fields: {
                    mgntItemCd: {type: "string"},
                    mgntItemCdNm: {type: "string"},
                    sttCd: {type: "string"}
                }
            },
        }
    });

    SYSM340M_grid[0].instance = $("#SYSM340M_grid0").kendoGrid({
        dataSource: SYSM340M_grid[0].dataSource,
        autoBind: false,
        selectable: "row",
        persistSelection: true,
        sortable: true,
        resizable: true,
        scrollable: true,
        noRecords: {
            template: "<div class='nodataMsg'><p>" + SYSM340M_langMap.get("fail.common.select") + "</p></div>" // 조회된 내역이 없습니다.
        },
        pageable: {
            refresh: true,
            pageSizes: [25, 50, 100, 200, 500],
            buttonCount: 5,
            messages: {
                empty: SYSM340M_langMap.get("fail.common.select") // 조회된 내역이 없습니다.
            }
        },
        dataBound: function(e) {
            SYSM340M_grid_fnOnDataBound(e, 0);
            $("#SYSM340M_grid0 .k-grid-content td[role=gridcell]").css("cursor", "pointer");
            let items = this._data;
            let tableRows = $(this.table).find("tr");
            tableRows.each(function(index) {
                let row = $(this);
                let dataItem = items[index];
                if (dataItem.sttCd === "D") {
                    row.addClass("inputError");
                }
            });
        },
        change: function (e) {
            SYSM340M_grid_fnOnChange(e, 0);
        },
        columns: [{
            title: SYSM340M_langMap.get("table.select"), // 선택
            width: 40,
            template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',
        }, {
            field: "mgntItemCd",
            title: SYSM340M_langMap.get("SYSM340M.grid.column.mgntItemCd"), // 관리항목코드
            width: 80
        }, {
            field: "mgntItemCdNm",
            title: SYSM340M_langMap.get("SYSM340M.grid.column.mgntItemCdNm"), // 관리항목코드명
            width: 120,
            attributes: {"class": "textEllipsis"}
        }, {
            title: SYSM340M_langMap.get("SYSM340M.grid.column.dataSize"), // 데이터Size
            width: 60,
            template: function (dataItem) {
                return dataItem.dataSzIntMnriCnt + "." + dataItem.dataSzSmlcntMnriCnt;
            }
        }, {
            field: "comCdCnt",
            title: SYSM340M_langMap.get("SYSM340M.grid.column.comCdCnt"), // 공통코드수
            width: 65,
            attributes: {"class": "k-text-right"}
        },{
            field: "sttCd",
            title: SYSM340M_langMap.get("SYSM340M.grid.column.useDvCd"), // 사용여부
            width: 65,
            template : function(dataItem) {
                return Utils.getComCdNm(SYSM340M_comCdList, 'C0003', dataItem.sttCd);
            },
            attributes: {'class': '#= SYSM340M_getClass(data) #'},
        }]
    }).data("kendoGrid");

    SYSM340M_grid[1].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                let param = {
                    mlingCd: SYSM340M_grid[0].currentItem.mlingCd,
                    mgntItemCd: SYSM340M_grid[0].currentItem.mgntItemCd
                }
                $.extend(param, options.data);
                Utils.ajaxCall("/sysm/SYSM340SEL02", JSON.stringify(param), function (result) {
                    options.success(JSON.parse(result.list));
                });
            },
            create: function (options) {
                Utils.ajaxCall("/sysm/SYSM340INS01", JSON.stringify({
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

                Utils.ajaxCall("/sysm/SYSM340UPT01", JSON.stringify({
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
            let type = e.type;
            let response = e.response;
        },
        requestEnd: function (e) {
            let type = e.type;
            let response = e.response;

            if (type != "read" && type != "destroy") {
                SYSM340M_grid[1].dataSource.read();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "id",
                fields: {
                    mgntItemCd: {type: "string"},
                    comCd: {type: "string"},
                    mlingCd: {type: "string"},
                    comCdNm: {type: "string"},
                    srtSeq: {type: "integer"},
                    hgrkComCd: {type: "string"},
                    subCdYn: {type: "string"},
                    subMgntItemCd: {type: "string"},
                    mapgVluCnt: {type: "integer"},
                    mapgVluUnitCd: {type: "string"},
                    mapgVlu1: {type: "string"},
                    mapgVlu2: {type: "string"},
                    mapgVlu3: {type: "string"},
                    mapgVlu4: {type: "string"},
                    useDvCd: {type: "string"}
                }
            }
        }
    });

    SYSM340M_grid[1].instance = $("#SYSM340M_grid1").kendoGrid({
        dataSource: SYSM340M_grid[1].dataSource,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        sortable: false,
        resizable: true,
        scrollable: true,
        noRecords: {
            template: "<div class='nodataMsg'><p>" + SYSM340M_langMap.get("SYSM340M.grid.info.noRecords") + "</p></div>" // 관리항목코드를 선택해주세요.
        },
        dataBound: function(e) {
            SYSM340M_grid_fnOnDataBound(e, 1);
        },
        change: function(e) {
            SYSM340M_grid_fnOnChange(e, 1);
        },
        cellClose: function(e) {
            SYSM340M_grid_fnChkComCd(e);
        },
        columns: [
            {
                selectable: true,
                width: 40,
            },
            {
                field: "comCd",
                title: SYSM340M_langMap.get("SYSM340M.grid.column.comCd"), // 공통코드
                width: 80
            },
            {
                title: "상태",
                type: "string",
                width: 60,
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
                field: "comCdNm",
                title: SYSM340M_langMap.get("SYSM340M.grid.column.comCdNm"), // 공통코드명
                width: 250,
                attributes: {"class": "textEllipsis"}
            },
            {
                field: "srtSeq",
                title: SYSM340M_langMap.get("SYSM340M.grid.column.srtSeq"), // 정렬순서
                width: 60,
                attributes: {"class": "k-text-right"},
                editable: function () {
                    return false;
                }
            },
            {
                field: "hgrkComCd",
                title: SYSM340M_langMap.get("SYSM340M.grid.column.hgrkComCd"), // 상위공통코드
                width: 90
            },
            {
                field: "subCdYn",
                title: SYSM340M_langMap.get("SYSM340M.grid.column.subCdYn"), // 하위코드여부
                width: 90,
                editor: function (container, options) {
                    SYSM340M_fnGridComboEditor(container, options, 1, "C0112", "선택");
                },
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM340M_comCdList, 'C0112', $.trim(dataItem.subCdYn));
                }
            },
            {
                headerAttributes: {"colspan": 2},
                attributes: {"class": "bdNoneRight"},
                field: "subMgntItemCd",
                title: SYSM340M_langMap.get("SYSM340M.grid.column.subMgntItemCd"), // 하위관리항목
                width: 70,
                // template:
                //     "#if(Utils.isNull(subMgntItemCd)){#" +
                //     "<button type='button' class='btnRefer_default' onclick='SYSM340M_fnGridOpenPopSYSM241P(this)'>" + SYSM340M_langMap.get("button.search") + "</button> " + // 검색
                //     "#} else {#" +
                //     "#=subMgntItemCd#" + " <button type='button' class='btnRefer_default' onclick='SYSM340M_fnGridDeleteValue(this)'>" + SYSM340M_langMap.get("button.delete") + "</button> " + // 삭제
                //     "#}#",
                // editable: function() {
                //     return false;
                // },
                // editor: function (container, options) {
                //     $('<span class="searchTextBox" style="width: 100%;"><input type="search" class="k-input" name="' + options.field + '"><button title="검색" onclick="SYSM340M_fnGridOpenPopSYSM241P(this)"></button></span>').appendTo(container);
                // },

            },
            {
                headerAttributes: {"class": "displayNon"},
                width: 40,
                template: function (dataItem) {
                    return '<button class="btnRefer_default icoType icoComp_zoom" title="검색" onclick="SYSM340M_fnGridOpenPopSYSM241P(this)"></button>';
                },
            },
            {
                field: "mapgVluCnt",
                title: SYSM340M_langMap.get("SYSM340M.grid.column.mapgVluCnt"), // 매핑값 수
                width: 70
            },
            {
                field: "mapgVluUnitCd",
                title: SYSM340M_langMap.get("SYSM340M.grid.column.mapgVluUnitCd"), // 매핑값 단위
                width: 80,
                editor: function (container, options) {
                    SYSM340M_fnGridComboEditor(container, options, 1, "C0192", "선택");
                },
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM340M_comCdList, 'C0192', $.trim(dataItem.mapgVluUnitCd));
                }
            },
            {
                field: "mapgVlu1",
                title: SYSM340M_langMap.get("SYSM340M.grid.column.mapgVlu1"), // 매핑값 1
                width: 90,
                attributes: {"class": "textEllipsis"}
            },
            {
                field: "mapgVlu2",
                title: SYSM340M_langMap.get("SYSM340M.grid.column.mapgVlu2"), // 매핑값 2
                width: 90,
                attributes: {"class": "textEllipsis"}
            },
            {
                field: "mapgVlu3",
                title: SYSM340M_langMap.get("SYSM340M.grid.column.mapgVlu3"), // 매핑값 3
                width: 90,
                attributes: {"class": "textEllipsis"}
            },
            {
                field: "mapgVlu4",
                title: SYSM340M_langMap.get("SYSM340M.grid.column.mapgVlu4"), // 매핑값 4
                width: 90,
                attributes: {"class": "textEllipsis"}
            },
            {
                field: "useDvCd",
                title: SYSM340M_langMap.get("SYSM340M.grid.column.useDvCd"), // 사용여부
                width: 70,
                editor: function (container, options) {
                    SYSM340M_fnGridComboEditor(container, options, 1, "C0003", false);
                },
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM340M_comCdList, 'C0003', $.trim(dataItem.useDvCd));
                }
            }
        ]
    }).data("kendoGrid");
   
    Utils.setKendoGridDoubleClickAction("#SYSM340M_grid1");
    SYSM340M_fnGridResize();
    SYSM340M_fnInit();
});

function SYSM340M_getClass(data) {
    return data.sttCd.indexOf("D") === 0 ? "fontRed" : "fontNormal"; //2022.11.23 sukim test ->fontNormal 로 변경
}


function SYSM340M_fnInit() {
    let param = {
        "codeList": [
            {"mgntItemCd": "C0003"}, // 사용여부
            {"mgntItemCd": "C0112"}, // 하위코드여부
            {"mgntItemCd": "C0192"}, // 매핑값단위코드
        ]
    };

    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        SYSM340M_comCdList = JSON.parse(result.codeList);
        SYSM340M_fnSearch();
    });
}

function SYSM340M_fnSearch(gubun) {
    if(Utils.isNull(gubun)){
        SYSM340M_grid[1].dataSource.data([]);
        SYSM340M_grid[0].currentItem = {};
        SYSM340_currentRow = "";
    }
    SYSM340M_grid[0].dataSource.read();
}

function SYSM340M_fnSave() {
    var isValid = true;

    $.each(SYSM340M_grid[1].dataSource.data(), function (index, item) {
        if (Utils.isNull(item.comCd)) {
            Utils.alert(SYSM340M_langMap.get("SYSM340M.alert.save.noComCd")); // 공통코드를 입력해주세요.
            isValid = false;
            return false;
        }
        if (Utils.isNull(item.comCdNm)) {
            Utils.alert(SYSM340M_langMap.get("SYSM340M.alert.save.noComCdNm")); // 공통코드명을 입력해주세요.
            isValid = false;
            return false;
        }
    });

    if (isValid) {
        Utils.confirm(SYSM340M_langMap.get("common.save.msg"), function () { // 저장하시겠습니까?
            SYSM340M_grid[1].instance.dataSource.sync().then(function () {
                Utils.alert(SYSM340M_langMap.get("success.common.save")); // 정상적으로 저장되었습니다.
                SYSM340_currentRow = SYSM340M_grid[0].currentItem.mgntItemCd;
                SYSM340M_grid[1].dataSource.read();
                SYSM340M_fnSearch('save');
            });
        });
    }
}

function SYSM340M_fnDelete() {
    let selectedItems = SYSM340M_grid[1].selectedItems;

    if (selectedItems.length == 0) {
        Utils.alert(SYSM340M_langMap.get("SYSM340M.alert.delete")); // 삭제할 공통코드를 선택해주세요.
        return;
    }

    Utils.confirm(SYSM340M_langMap.get("common.delete.msg"), function () { // 삭제하시겠습니까?
        Utils.ajaxCall("/sysm/SYSM340DEL01", JSON.stringify({
            list: selectedItems
        }), function (result) {
            Utils.alert(SYSM340M_langMap.get("success.common.delete"), function () { // "정상적으로 삭제되었습니다."
                SYSM340_currentRow = SYSM340M_grid[0].currentItem.mgntItemCd;
                SYSM340M_grid[1].dataSource.read();
                SYSM340M_fnSearch('delete');
            });
        });
    });
}

function SYSM340M_fnAdd() {
    let totalRecords = SYSM340M_grid[1].dataSource.total();

    SYSM340M_grid_fnTotalSorting();

    if ($.isEmptyObject(SYSM340M_grid[0].currentItem)) {
        Utils.alert(SYSM340M_langMap.get("SYSM340M.alert.add")); // 관리항목코드를 선택해주세요.
        return;
    }

    let row = {
        mgntItemCd: SYSM340M_grid[0].currentItem.mgntItemCd,
        comCd: null,
        mlingCd: GLOBAL.session.user.mlingCd,
        comCdNm: null,
        srtSeq: Number(totalRecords + 1),
        hgrkComCd: null,
        subCdYn: null,
        subMgntItemCd: null,
        mapgVluCnt: null,
        mapgVluUnitCd: null,
        mapgVlu1: null,
        mapgVlu2: null,
        mapgVlu3: null,
        useDvCd: "Y",
        regrId: GLOBAL.session.user.usrId,
        regrOrgCd: GLOBAL.session.user.orgCd,
        lstCorprId: GLOBAL.session.user.usrId,
        lstCorprOrgCd: GLOBAL.session.user.orgCd
    }

    SYSM340M_grid[1].dataSource.add(row);
    SYSM340M_grid[1].instance.refresh();

    SYSM340M_grid[1].instance.clearSelection();
    // SYSM340M_grid[1].instance.editCell(SYSM340M_grid[1].instance.tbody.find("tr:last td:eq(1)"));
    SYSM340M_grid[1].instance.tbody.find("tr:last td:eq(1)").dblclick();
}

function SYSM340M_fnUpDown(gridIndex, val) {
    if (SYSM340M_grid[gridIndex].selectedItems.length == 0) {
        Utils.alert(SYSM340M_langMap.get("SYSM340M.alert.order.noComCd")); // 공통코드를 선택해주세요.
        return;
    }
    if (SYSM340M_grid[gridIndex].selectedItems.length > 1) {
        Utils.alert(SYSM340M_langMap.get("SYSM340M.alert.order.oneComCd"), function () { // 공통코드 한개만 선택해주세요.
            SYSM340M_grid[gridIndex].instance.clearSelection();
        });
        return;
    }

    let totalRecords = SYSM340M_grid[gridIndex].instance.dataSource.total();
    let index = SYSM340M_grid[gridIndex].instance.select().index();
    let from = index + 1;
    let to = from + val;

    if (1 > to || to > totalRecords) {
        return;
    }

    SYSM340M_grid[gridIndex].dataSource.pushMove(to, SYSM340M_grid[gridIndex].dataSource.at(index));

    SYSM340M_grid_fnTotalSorting();
}

function SYSM340M_fnGridOpenPopSYSM241P(obj) {
    let tr = $(obj).closest("tr");
    let dataItem = SYSM340M_grid[1].instance.dataItem(tr);

    Utils.setCallbackFunction("SYSM340M_fnSYSM241PCallback", function (item) {
        dataItem.set("subMgntItemCd", item.mgntItemCd);
        SYSM340M_grid[1].instance.refresh();
    });
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM241P", "SYSM241P", 680, 535, {callbackKey: "SYSM340M_fnSYSM241PCallback"});
}

function SYSM340M_fnGridDeleteValue(obj) {
    let tr = $(obj).closest("tr");
    let dataItem = SYSM340M_grid[1].instance.dataItem(tr);

    dataItem.set("subMgntItemCd", null);
}

function SYSM340M_fnGridComboEditor(container, options, gridIndex, code, isTotalOption) {
    let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);

    Utils.setKendoComboBox(SYSM340M_comCdList, code, $select, "", isTotalOption).bind("change", function (e) {
        let element = e.sender.element;
        let row = element.closest("tr");
        let dataItem = SYSM340M_grid[gridIndex].instance.dataItem(row);

        dataItem.set(options.field, e.sender.value());

        SYSM340M_grid[gridIndex].instance.refresh();
    });
}

function SYSM340M_grid_fnOnDataBound(e, gridIndex) {
    let grid = e.sender;
    let rows = grid.items();

    rows.off("click").on("click", function (e) {
        let dataItem = grid.dataItem(this);
        let cellIndex = $(e.target).index();

        SYSM340M_grid[gridIndex].currentItem = dataItem;
        SYSM340M_grid[gridIndex].currentCellIndex = cellIndex;

        if (gridIndex == 0) {
            SYSM340M_grid[1].instance.clearSelection();
            SYSM340M_grid[1].dataSource.read();
        }
    });

    if (gridIndex == 0 && SYSM340M_grid[gridIndex].loadCount == 0) {
        $("#SYSM340M_grid" + gridIndex + " tbody tr:first").trigger("click");
    }
    SYSM340M_grid[gridIndex].loadCount++;
}

function SYSM340M_grid_fnOnChange(e, gridIndex) {
    let rows = e.sender.select();
    let items = [];

    rows.each(function(e) {
        var dataItem = SYSM340M_grid[gridIndex].instance.dataItem(this);
        items.push(dataItem);
    });

    SYSM340M_grid[gridIndex].selectedItems = items;
}

function SYSM340M_grid_fnChkComCd(e) {
    let grid = e.sender;
    let dataItem = e.model;

    if (dataItem.id != dataItem.comCd && Utils.isNotNull(dataItem.comCd)) {
        let param = {
            mlingCd: SYSM340M_grid[0].currentItem.mlingCd,
            mgntItemCd: SYSM340M_grid[0].currentItem.mgntItemCd,
            comCd: dataItem.comCd
        }

        Utils.ajaxCall("/sysm/SYSM340SEL02", JSON.stringify(param), function (result) {
            let list = JSON.parse(result.list);

            if (list.length > 0) {
                dataItem.set("comCd", dataItem.id);
                Utils.alert(SYSM340M_langMap.get("SYSM340M.alert.update.comCd")); // 입력한 공통코드와 동일한 공통코드가 존재합니다.
                
            }
        });
    }
}

function SYSM340M_grid_fnTotalSorting() {
    let result = false;
    let changeCnt = 0;

    $.each(SYSM340M_grid[1].dataSource.data(), function (index, item) {
        let srtSeq = index + 1;
        if (item.srtSeq != srtSeq) {
            item.set("srtSeq", srtSeq);
            changeCnt++;
        }
    });

    if (changeCnt > 0) {
        result = true;
    }

    return result;
}

function SYSM340M_fnGridResize() {
    let screenHeight = $(window).height() - 210; // (헤더+푸터) 영역 높이 제외

    if (SYSM340M_grid[0].instance.element)
        SYSM340M_grid[0].instance.element.find('.k-grid-content').css('height', screenHeight-182);
    if (SYSM340M_grid[1].instance.element)
        SYSM340M_grid[1].instance.element.find('.k-grid-content').css('height', screenHeight-182);
}

function SYSM340M_fnDltLogic(){
    let selectedItems = SYSM340M_grid[1].selectedItems;

    if (selectedItems.length == 0) {
        Utils.alert("폐기할 공통코드를 선택해주세요."); // 삭제할 공통코드를 선택해주세요.
        return;
    }
    selectedItems.forEach(function(val){
        val.abolmnId = GLOBAL.session.user.usrId;
        val.abolmnOrgCd = GLOBAL.session.user.orgCd;
    })

    Utils.confirm("폐기하시겠습니까?", function () { // 삭제하시겠습니까?
        Utils.ajaxCall("/sysm/SYSM340UPT02", JSON.stringify({
            list: selectedItems
        }), function (result) {
            SYSM340_currentRow = SYSM340M_grid[0].currentItem.mgntItemCd;
            SYSM340M_grid[1].dataSource.read();
            SYSM340M_fnSearch('delete');
        });
    });

}