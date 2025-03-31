/***********************************************************************************************
 * Program Name : 데이터카드 레이아웃 관리(SYSM320M.js)
 * Creator      : jrlee
 * Create Date  : 2022.08.25
 * Description  : 데이터카드 레이아웃 관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.08.25     jrlee           최초작성
 ************************************************************************************************/
var SYSM320M_comCdList = new Array();
var SYSM320M_grid = new Array(2);

$(document).ready(function () {
    for (let i = 0; i < SYSM320M_grid.length; i++) {
        SYSM320M_grid[i] = {
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

    Utils.resizeLabelWidth();

    $("#SYSM320M_srchText").on("keyup", function (e) {
        if (e.keyCode == 13) {
            SYSM320M_fnSearch();
        }
    });

    SYSM320M_grid[0].instance = $("#SYSM320M_grid0").kendoGrid({
        dataSource: {
            transport: {
                read: function (options) {
                    let param = {
                        tenantId: $("#SYSM320M_tenantId").val(),
                        dataFrmeClasCd: $("#SYSM320M_dataFrmeClasCd").val(),
                        srchText: $("#SYSM320M_srchText").val(),
                        srchCond: $("#SYSM320M_srchCond").val()
                    };
                    $.extend(param, options.data);

                    Utils.ajaxCall("/sysm/SYSM300SEL01", JSON.stringify(param), function (result) {
                        let list = JSON.parse(result.list);

                        list = list.filter(function (item) {
                            return item.dataFrmTypCd == "C" && (item.lyotApclDvCd == "1" || item.lyotApclDvCd == "2")
                        })

                        options.success(list);
                    });
                },
                update: function (options) {
                    let updateList = options.data.models;
                    let regInfo = {
                        lstCorprId: GLOBAL.session.user.usrId,
                        lstCorprOrgCd: GLOBAL.session.user.orgCd
                    }

                    $.each(updateList, function (index, item) {
                        $.extend(item, regInfo);
                    });

                    Utils.ajaxCall("/sysm/SYSM300UPT01", JSON.stringify({
                        list: updateList
                    }), function (result) {
                        options.success(updateList);
                    });
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

                }
            },
            batch: true,
            schema: {
                type: "json",
                model: {
                    id: "id",
                    fields: {
                        dataFrmeClasCd: {type: "string", editable: false},
                        pkgClasCd: {type: "string", editable: false},
                        dataFrmTypCd: {type: "string", editable: false},
                        dataFrmId: {type: "string", editable: false},
                        dataFrmKornNm: {type: "string", editable: false},
                        dataFrmeTmplCd: {type: "string", editable: false},
                        lyotApclDvCd: {type: "string"},
                        scrnDispDrctCd: {type: "string"}
                    }
                }
            }
        },
        autoBind: false,
        selectable: "row",
        persistSelection: true,
        sortable: false,
        resizable: true,
        noRecords: {
            template: "<div class='nodataMsg'><p>조회된 내역이 없습니다.</p></div>"
        },
        dataBound: function (e) {
            SYSM320M_grid_fnOnDataBound(e, 0);
        },
        change: function (e) {
            SYSM320M_grid_fnOnChange(e, 0);
        },
        cellClose: function (e) {
            let grid = e.sender;
            let dataItem = e.model;
        },
        columns: [
            // {
            // 	title: "선택",
            // 	width: 30,
            // 	template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>'
            // },
            {
                title: "상태",
                type: "string",
                width: 30,
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
                field: "dataFrmeClasCd",
                title: "프레임분류",
                type: "string",
                width: 60,
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM320M_comCdList, 'C0018', $.trim(dataItem.dataFrmeClasCd));
                },
            },
            {
                field: "pkgClasCd",
                title: "패키지분류",
                type: "string",
                width: 60,
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM320M_comCdList, 'C0196', $.trim(dataItem.pkgClasCd));
                },
            },
            {
                field: "dataFrmTypCd",
                title: "유형",
                type: "string",
                width: 60,
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM320M_comCdList, 'C0197', $.trim(dataItem.dataFrmTypCd));
                },
            },
            {
                field: "dataFrmId",
                title: "데이터카드ID",
                type: "string",
                width: 70,
            },
            {
                field: "dataFrmKornNm",
                title: "데이터카드명",
                type: "string",
                width: 80,
                attributes: {"class": "textEllipsis"}
            },
            {
                field: "lyotApclDvCd",
                title: "레이아웃대상",
                width: 50,
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM320M_comCdList, 'C0200', $.trim(dataItem.lyotApclDvCd));
                },
                editor: function (container, options) {
                    SYSM320M_grid_fnComboEditor(container, options, 0, "C0200", "선택");
                },
            },
            {
                field: "scrnDispDrctCd",
                title: "화면표시방향",
                width: 50,
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM320M_comCdList, 'C0164', $.trim(dataItem.scrnDispDrctCd));
                },
                editor: function (container, options) {
                    SYSM320M_grid_fnComboEditor(container, options, 0, "C0164", "선택");
                },
            },
            {
                title: "항목정보",
                width: 40,
                template: "<button type='button' class='k-icon k-i-zoom-in' title='상세보기' onclick='SYSM320M_grid_fnSelect(0, this)'></button>"
            }
        ]
    }).data("kendoGrid");
    Utils.setKendoGridDoubleClickAction("#SYSM320M_grid0");

    SYSM320M_grid[1].instance = $("#SYSM320M_grid1").kendoGrid({
        dataSource: {
            transport: {
                read: function (options) {
                    Utils.ajaxCall("/sysm/SYSM320SEL01", JSON.stringify(options.data), function (result) {
                        options.success(JSON.parse(result.list));
                    });
                },
                create: function (options) {
                    Utils.ajaxCall("/sysm/SYSM320INS01", JSON.stringify({
                        list: options.data.models
                    }), function (result) {
                        options.success(options.data.models);
                    });
                },
                update: function (options) {
                    let updateList = options.data.models;
                    let regInfo = {
                        lstCorprId: GLOBAL.session.user.usrId,
                        lstCorprOrgCd: GLOBAL.session.user.orgCd
                    }

                    $.each(updateList, function(index, item){
                        $.extend(item, regInfo);
                    });

                    Utils.ajaxCall("/sysm/SYSM320UPT01", JSON.stringify({
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

                }
            },
            batch: true,
            schema: {
                model: {
                    id: "itemSeq",
                    fields: {
                        mgntItemCd: {type: "string"},
                        mgntItemCdNm: {type: "string"},
                        mgntItemTypCd: {type: "string"},
                        dataSzIntMnriCnt: {type: "Integer"},
                        scrnDispSeq: {type: "string"},
                        scrnDispYn: {type: "string"},
                        mdtyYn: {type: "string"}
                    }
                }
            }
        },
        autoBind: false,
        selectable: "multiple",
        persistSelection: true,
        sortable: false,
        resizable: true,
        noRecords: {
            template: "<div class='nodataMsg'><p>데이터카드를 선택하세요.</p></div>"
        },
        dataBound: function (e) {
            SYSM320M_grid_fnOnDataBound(e, 1);
        },
        change: function (e) {
            SYSM320M_grid_fnOnChange(e, 1);
        },
        cellClose: function (e) {
            let grid = e.sender;
            let dataItem = e.model;
        },
        columns: [
            {
                width: 30,
                selectable: true,
            },
            {
                title: "상태",
                type: "string",
                width: 40,
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
                field: "mgntItemCd",
                title: "항목코드",
                width: 80,
                attributes: {"class": "textEllipsis"},
            },
            {
                field: "mgntItemCdNm",
                title: "항목명",
                width: 80,
                attributes: {"class": "textEllipsis"},
            },
            // {
            // 	field: "mgntItemTypCd",
            // 	title: "항목유형",
            // 	width: 60,
            // },
            {
                field: "dataSzIntMnriCnt",
                title: "크기",
                width: 30,
                attributes: {"class": "textRight"},
            },
            {
                field: "scrnDispSeq",
                title: "정렬순서",
                width: 50,
                editable: function (dataItem) {
                    return false;
                }
            },
            {
                field: "scrnDispYn",
                title: "화면표시",
                width: 70,
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM320M_comCdList, "C0207", $.trim(dataItem.scrnDispYn));
                },
                editor: function (container, options) {
                    SYSM320M_grid_fnComboEditor(container, options, 1, "C0207", "선택");
                },
            },
            {
                field: "mdtyYn",
                title: "필수",
                width: 50,
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM320M_comCdList, "T0394", $.trim(dataItem.mdtyYn));
                },
                editor: function (container, options) {
                    SYSM320M_grid_fnComboEditor(container, options, 1, "T0394", "선택");
                }
            }
        ]
    }).data('kendoGrid');
    Utils.setKendoGridDoubleClickAction("#SYSM320M_grid1");

    SYSM320M_fnGridResize();
    $(window).on("resize", function () { SYSM320M_fnGridResize();});

    SYSM320M_fnInit();
});

function SYSM320M_fnInit() {
    let param = {
        "codeList": [
            {"mgntItemCd": "S0005"}, // 데이터프레임관리 조회조건 (구분)
            {"mgntItemCd": "C0024"}, // 사용자등급
            {"mgntItemCd": "C0018"}, // 데이터프레임분류
            {"mgntItemCd": "C0197"}, // 데이터프레임유형
            {"mgntItemCd": "C0164"}, // 화면표시방향
            {"mgntItemCd": "C0201"}, // 버튼유형코드
            {"mgntItemCd": "C0202"}, // 버튼상태코드 (사용여부)
            {"mgntItemCd": "C0207"}, // 화면표시여부
            {"mgntItemCd": "C0196"}, // 패키지분류
            {"mgntItemCd": "C0198"}, // 데이터프레임 템플릿코드
            {"mgntItemCd": "C0200"}, // 레이아웃적용대상
            {"mgntItemCd": "C0203"}, // 분할프레임코드
            {"mgntItemCd": "C0204"}, // 분할프레임유형코드
            {"mgntItemCd": "T0394"}, // 필수여부
        ]
    };

    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        SYSM320M_comCdList = JSON.parse(result.codeList);

        Utils.setKendoComboBox(SYSM320M_comCdList, "C0018", "#SYSM320M_dataFrmeClasCd");
        Utils.setKendoComboBox(SYSM320M_comCdList, "S0005", "#SYSM320M_srchCond", "", false);

        const SYSM320M_fnGridClear = () => {
            SYSM320M_grid[1].instance.dataSource.data([]);

            SYSM320M_grid[0].instance.clearSelection();
            SYSM320M_grid[0].currentItem = new Object();
            SYSM320M_grid[0].instance.dataSource.data([]);
            $('#SYSM320M_srchText').val("");
            $("#SYSM320M_srchCond").data("kendoComboBox").select(0);
            $("#SYSM320M_dataFrmeClasCd").data("kendoComboBox").select(0);
        }
        CMMN_SEARCH_TENANT["SYSM320M"].fnInit(null,SYSM320M_fnSearch,SYSM320M_fnGridClear);
    });
}

function SYSM320M_fnSearch() {
    Utils.markingRequiredField();

    if (Utils.isNull($("#SYSM320M_tenantId").val())) {
        Utils.alert("테넌트를 입력해주세요.", function () {
            $("#SYSM320M_tenantId").focus();
        });

        return false;
    }

    SYSM320M_grid[1].instance.dataSource.data([]);

    SYSM320M_grid[0].instance.clearSelection();
    SYSM320M_grid[0].currentItem = new Object();
    SYSM320M_grid[0].instance.dataSource.read();
}

function SYSM320M_fnAdd(gridIndex) {
    if ((gridIndex == 1) && $.isEmptyObject(SYSM320M_grid[0].currentItem)) {
        Utils.alert("데이터카드를 선택해주세요.");
        return;
    }

    let row = new Object();
    let regInfo = {
        tenantId: $("#SYSM320M_tenantId").val(),
        regrId: GLOBAL.session.user.usrId,
        regrOrgCd: GLOBAL.session.user.orgCd,
        lstCorprId: GLOBAL.session.user.usrId,
        lstCorprOrgCd: GLOBAL.session.user.orgCd
    }

    if (gridIndex == 1) {
        row.dataFrmId = SYSM320M_grid[0].currentItem.dataFrmId;
    }

    SYSM320M_grid[gridIndex].instance.dataSource.add($.extend(row, regInfo));
    SYSM320M_grid[gridIndex].instance.refresh();
    SYSM320M_grid[gridIndex].instance.clearSelection();
    SYSM320M_grid[gridIndex].instance.content.scrollTop((SYSM320M_grid[gridIndex].instance).tbody.height());
    SYSM320M_grid[gridIndex].instance.tbody.find("tr:last td:eq(2)").dblclick();

    SYSM320M_grid_fnTotalSorting(gridIndex);
}

function SYSM320M_fnUpDown(gridIndex, val) {
    if (SYSM320M_grid[gridIndex].selectedItems.length == 0) {
        Utils.alert("항목을 선택해주세요.");
        return;
    }
    if (SYSM320M_grid[gridIndex].selectedItems.length > 1) {
        Utils.alert("항목 한개만 선택해주세요.", function () {
            SYSM320M_grid[gridIndex].instance.clearSelection();
        });
        return;
    }

    let totalRecords = SYSM320M_grid[gridIndex].instance.dataSource.total();
    let index = SYSM320M_grid[gridIndex].instance.select().index();
    let from = index + 1;
    let to = from + val;

    if (1 > to || to > totalRecords) {
        return;
    }

    SYSM320M_grid[gridIndex].instance.dataSource.pushMove(to, SYSM320M_grid[gridIndex].instance.dataSource.at(index));

    SYSM320M_grid_fnTotalSorting(gridIndex);
}

function SYSM320M_grid_fnTotalSorting(gridIndex) {
    let result = false;
    let changeCnt = 0;

    $.each(SYSM320M_grid[gridIndex].instance.dataSource.data(), function (index, item) {
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

function SYSM320M_fnSync(gridIndex) {
    let isValid = true;

    $.each(SYSM320M_grid[gridIndex].instance.dataSource.data(), function (index, item) {
        if (gridIndex == 0) {
            if (Utils.isNull(item.lyotApclDvCd)) {
                Utils.alert("레이아웃대상을 선택해주세요.", function () {
                    SYSM320M_grid[gridIndex].instance.tbody.find("tr:eq(" + index + ") td:eq(6)").dblclick();
                });
                isValid = false;
                return false;
            }
            if (Utils.isNull(item.scrnDispDrctCd)) {
                Utils.alert("화면표시방향을 선택해주세요.", function () {
                    SYSM320M_grid[gridIndex].instance.tbody.find("tr:eq(" + index + ") td:eq(7)").dblclick();
                });
                isValid = false;
                return false;
            }
        } else if (gridIndex == 1) {
            if (Utils.isNull(item.mgntItemCd)) {
                Utils.alert("항목코드를 입력해주세요.", function () {
                    SYSM320M_grid[gridIndex].instance.tbody.find("tr:eq(" + index + ") td:eq(2)").dblclick();
                });
                isValid = false;
                return false;
            }
            if (Utils.isNull(item.mgntItemCdNm)) {
                Utils.alert("항목명을 입력해주세요.", function () {
                    SYSM320M_grid[gridIndex].instance.tbody.find("tr:eq(" + index + ") td:eq(3)").dblclick();
                });
                isValid = false;
                return false;
            }
            if (Utils.isNull(item.scrnDispYn)) {
                Utils.alert("화면표시 여부를 선택해주세요.", function () {
                    SYSM320M_grid[gridIndex].instance.tbody.find("tr:eq(" + index + ") td:eq(6)").dblclick();
                });
                isValid = false;
                return false;
            }
            if (Utils.isNull(item.mdtyYn)) {
                Utils.alert("필수 여부를 선택해주세요.", function () {
                    SYSM320M_grid[gridIndex].instance.tbody.find("tr:eq(" + index + ") td:eq(7)").dblclick();
                });
                isValid = false;
                return false;
            }
        }
    });

    if (isValid) {
        Utils.confirm("저장하시겠습니까?", function () {
            SYSM320M_grid[gridIndex].instance.dataSource.sync().then(function () {
                Utils.alert("정상적으로 저장되었습니다.", function () {
                    if (gridIndex == 0) {
                        SYSM320M_fnSearch();
                    } else if (gridIndex == 1) {
                        SYSM320M_grid[1].currentItem = new Object();
                        SYSM320M_grid[1].instance.clearSelection();
                        SYSM320M_grid[1].instance.dataSource.read({
                            tenantId: SYSM320M_grid[0].currentItem.tenantId,
                            dataFrmId: SYSM320M_grid[0].currentItem.dataFrmId
                        });
                    }
                });
            });
        });
    }
}

function SYSM320M_fnDelete(gridIndex) {
    let selectedItems = SYSM320M_grid[gridIndex].selectedItems;

    if (selectedItems.length == 0) {
        Utils.alert("삭제할 대상을 선택해주세요.");
        return;
    }

    Utils.confirm("삭제하시겠습니까?", function () {
        Utils.ajaxCall("/sysm/SYSM320DEL01", JSON.stringify({
            list: selectedItems
        }), function (result) {
            Utils.alert("정상적으로 삭제되었습니다.", function() {
                SYSM320M_grid[1].currentItem = new Object();
                SYSM320M_grid[1].instance.clearSelection();
                SYSM320M_grid[1].instance.dataSource.read({
                    tenantId: SYSM320M_grid[0].currentItem.tenantId,
                    dataFrmId: SYSM320M_grid[0].currentItem.dataFrmId
                });
            });
        });
    });
}

function SYSM320M_grid_fnSelect(gridIndex, obj) {
    let selectedItem;

    if (obj) {
        let tr = $(obj).closest("tr");
        SYSM320M_grid[gridIndex].currentItem = SYSM320M_grid[gridIndex].instance.dataItem(tr);
        SYSM320M_grid[gridIndex].instance.clearSelection();
        SYSM320M_grid[gridIndex].instance.select(tr);
    }

    selectedItem = SYSM320M_grid[gridIndex].currentItem;

    if (gridIndex == 0) {
        SYSM320M_grid[1].currentItem = new Object();
        SYSM320M_grid[1].instance.clearSelection();
        SYSM320M_grid[1].instance.dataSource.read({
            tenantId: selectedItem.tenantId,
            dataFrmId: selectedItem.dataFrmId
        });
    }
}

function SYSM320M_grid_fnOnDataBound(e, gridIndex) {
    let grid = e.sender;
    let rows = grid.items();

    SYSM320M_grid[gridIndex].record = 0;

    rows.off("click").on("click", function (e) {
        let dataItem = grid.dataItem(this);
        let cellIndex = $(e.target).index();

        SYSM320M_grid[gridIndex].currentItem = dataItem;
        SYSM320M_grid[gridIndex].currentCellIndex = cellIndex;
    });

    if (gridIndex == 0 && SYSM320M_grid[gridIndex].loadCount == 0) {
        $("#SYSM320M_grid" + gridIndex + " tbody tr:first td:eq(8) button").trigger("click");
    }

    SYSM320M_grid[gridIndex].loadCount++;
}

function SYSM320M_grid_fnOnChange(e, gridIndex) {
    let rows = e.sender.select(),
        items = [];

    rows.each(function(e) {
        let dataItem = SYSM320M_grid[gridIndex].instance.dataItem(this);
        items.push(dataItem);
    });

    SYSM320M_grid[gridIndex].selectedItems = items;
}

function SYSM320M_grid_fnComboEditor(container, options, gridIndex, code, isTotalOption) {
    let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);

    Utils.setKendoComboBox(SYSM320M_comCdList, code, $select, "", isTotalOption).bind("change", function (e) {
        let element = e.sender.element;
        let row = element.closest("tr");
        let dataItem = SYSM320M_grid[gridIndex].instance.dataItem(row);

        dataItem.set(options.field, e.sender.value());

        SYSM320M_grid[gridIndex].instance.refresh();
    });
}

function SYSM320M_fnGridResize() {
    let screenHeight = $(window).height() - 210;

    if (SYSM320M_grid[0].instance.element)
        SYSM320M_grid[0].instance.element.find('.k-grid-content').css('height', screenHeight - 182);
    if (SYSM320M_grid[1].instance.element)
        SYSM320M_grid[1].instance.element.find('.k-grid-content').css('height', screenHeight - 182);
}