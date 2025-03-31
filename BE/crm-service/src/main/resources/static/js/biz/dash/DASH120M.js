/***********************************************************************************************
 * Program Name : 대시보드 항목관리 - MAIN (DASH120M.js)
 * Creator      : 강동우
 * Create Date  : 2022.05.17
 * Description  : 대시보드 항목관리 - MAIN
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.17     강동우           최초생성
 * 2022.09.20     김보영           수정
 ************************************************************************************************/
var DASH120M_comCdList;
var DASH120M_totalMenuList, DASH120M_codePopupTarget;
var DASH120M_commObj = {};
var DASH120M_pltItemCd, DASH120M_editorPltItemNo, DASH120M_themePltItemNo, DASH120M_list;
// 20221012 김보영 추가
var DASH120M_grid;

$(document).ready(function () {
    DASH120M_grid = Array.from({length: 9}, () => ({
        instance: {},
        dataSource: {},
        currentItem: {},
        currentCellIndex: 0,
        selectedItems: [],
        loadCount: 0
    }));
    DASH120M_commObj = {
        getGridSelector: {
            0: 'pltGrid',
            1: 'pltItemGrid',
            2: 'sloganGrid',
            3: 'quickLinkGrid',
            4: 'weatherGrid',
            5: 'phraseEditor',
            6: 'selectCardGrid',
            7: 'themeImage'
        },
        getEditorImgPath: function () {
            return ''.concat('/bcs/dashphoto/', GLOBAL.session.user.tenantId, '/');
        },
        fnDataSourceReset: function (list) {
            list.forEach(x => DASH120M_grid[x].dataSource.data([]));
        },
        fnCurrentItemReset: function (list) {
            list.forEach(x => DASH120M_grid[x].currentItem = {});
        },
        fnGridDisplayShow: function (showList) {
            $('.DASH120M_editor').empty().removeClass('nodataMsg');
            showList.map((x) => {
                let selector = ''.concat('#DASH120M_', this.getGridSelector[x])
                $(selector).show();
            })
        },
        fnEditorDisplayShow: function () {
            $('.DASH120M_editor').empty().removeClass('nodataMsg').show();
        },
        fnGridDisplayHide: function (hideList) {
            hideList.forEach((x) => {
                let selector = ''.concat('#DASH120M_', this.getGridSelector[x])
                $(selector).hide();
            })
            if (hideList.includes(5)) {
                $('.DASH120M_editor').empty().append('<p>' + DASH120M_langMap.get("DASH120M.info.nodata") + '</p>');
            }
            // if (hideList.includes(7)) {
            //     $('#DASH120M_themeImage').empty().append('<p>' + DASH120M_langMap.get("DASH120M.info.nodata") + '</p>');
            // }
        },
        getSelectItem: function (obj, gridIdx) {
            let selectedItem;
            if (obj) {
                let tr = $(obj).closest("tr");
                selectedItem = DASH120M_grid[gridIdx].instance.dataItem(tr);
                DASH120M_grid[gridIdx].instance.clearSelection();
                DASH120M_grid[gridIdx].instance.select(tr);
            } else {
                selectedItem = DASH120M_grid[gridIdx].currentItem;
            }
            return selectedItem;
        },
        fnResetPltItemDtls: function () {
            this.fnGridDisplayHide([2, 3, 4, 5, 6, 7]);
            $('.DASH120M_editor').addClass('nodataMsg').empty().append('<p>' + DASH120M_langMap.get("DASH120M.info.noSelectPltItem") + '</p>');
        }
    }
    DASH120M_fnInit();
    setTimeout(DASH120M_fnSearchPlt, 100);
    DASH120M_fnPltGridInit();
    DASH120M_fnPltItemGridInit();
    DASH120M_fnPltItemDtlsGridInit();
    DASH120M_commObj.fnResetPltItemDtls();
    Utils.setKendoGridDoubleClickAction("#DASH120M_pltItemGrid");
    Utils.setKendoGridDoubleClickAction("#DASH120M_sloganGrid");
    Utils.setKendoGridDoubleClickAction("#DASH120M_quickLinkGrid");
    Utils.setKendoGridDoubleClickAction("#DASH120M_weatherGrid");
    Utils.setKendoGridDoubleClickAction("#DASH120M_selectCardGrid");

    DASH120M_gridResizeHeight();

    $(window).on({
        'resize': function () {
            DASH120M_gridResizeHeight();
        },
    });
});

// 코드 셋팅
function DASH120M_fnInit() {
    var param = {
        "codeList": [
            {"mgntItemCd": "C0003"},
            {"mgntItemCd": "C0012"},
            {"mgntItemCd": "C0037"}, //TODO C0050 으로 변경 필요
            {"mgntItemCd": "C0038"},
            {"mgntItemCd": "C0039"},
            {"mgntItemCd": "C0040"},
            {"mgntItemCd": "C0041"},
            {"mgntItemCd": "C0042"},
            {"mgntItemCd": "C0047"},
            {"mgntItemCd": "C0046"},
            {"mgntItemCd": "C0045"},
            {"mgntItemCd": "C0050"},
        ]
    };
    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        DASH120M_comCdList = JSON.parse(result.codeList);
        Utils.setKendoComboBox(DASH120M_comCdList, "C0037", "input[name=DASH120MPlt]");
        // DASH120M_fnSearchTopMenuList();
    });
}

//팔레트 조회
function DASH120M_fnSearchPlt() {
    DASH120M_grid[0].instance.clearSelection();
    DASH120M_commObj.fnCurrentItemReset([0, 1, 2, 3, 4, 6, 7]); // ALL
    DASH120M_grid.forEach(x=>x.loadCount = 0);
    // DASH120M_commObj.fnDataSourceReset([0,1,2,3,4,5,6,7]);
    DASH120M_grid[0].dataSource.read({
        tenantId: GLOBAL.session.user.tenantId,
        pltDvCd : $("input[name=DASH120MPlt]").data("kendoComboBox").value(),
    });
}

// 팔레트 아이템 조회
function DASH120M_fnSearchPltItem(obj) {
    DASH120M_grid[1].instance.clearSelection();
    DASH120M_commObj.fnCurrentItemReset([1, 2, 3, 4, 6, 7]); // pltGrid = 0, pltItemGrid = 1제외 전부
    DASH120M_commObj.fnResetPltItemDtls();
    let selectedItem = DASH120M_commObj.getSelectItem(obj, 0); // pltGrid에서 선택 된 코드 받아오기
    if (!selectedItem.pltDvCd) {
        DASH120M_grid[1].dataSource.data([]);
        return;
    }
    if (selectedItem.pltDvCd === "T") {
        DASH120M_grid[1].instance.showColumn("dispCycCd");
        DASH120M_grid[1].instance.showColumn("dispShpCd");
    } else {
        DASH120M_grid[1].instance.hideColumn("dispCycCd");
        DASH120M_grid[1].instance.hideColumn("dispShpCd");
    }
    DASH120M_grid[1].dataSource.read({
        tenantId: GLOBAL.session.user.tenantId,
        pltDvCd: selectedItem.pltDvCd
    });
}

// 슬로건 조회
function DASH120M_fnSearch_T01_slogan(obj) {
    DASH120M_grid[2].instance.clearSelection();
    let selectedItem = DASH120M_commObj.getSelectItem(obj, 1); // pltGrid에서 선택 된 코드 받아오기
    DASH120M_grid[2].dataSource.read({
        tenantId: GLOBAL.session.user.tenantId,
        pltItemCd: selectedItem.pltItemCd
    });
}

// 오늘의 날씨 조회
function DASH120M_ApiList(obj) {
    DASH120M_grid[4].instance.clearSelection();

    let selectedItem = DASH120M_commObj.getSelectItem(obj, 1); // pltGrid에서 선택 된 코드 받아오기
    DASH120M_grid[4].dataSource.read({
        tenantId: GLOBAL.session.user.tenantId,
        pltItemCd: selectedItem.pltItemCd
    });
}

// 퀵링크 조회
function DASH120M_QlnkList(obj) {
    DASH120M_grid[3].instance.clearSelection();

    var selectedItem;
    if (obj) {
        var tr = $(obj).closest("tr");
        selectedItem = DASH120M_grid[1].instance.dataItem(tr);

        DASH120M_grid[1].instance.clearSelection();
        DASH120M_grid[1].instance.select(tr);
    } else {
        selectedItem = DASH120M_grid[1].currentItem;
    }

    DASH120M_grid[3].dataSource.read({
        tenantId: GLOBAL.session.user.tenantId,
        pltDvCd: selectedItem.pltDvCd,
        pltItemCd: selectedItem.pltItemCd
    });
}

// top, 퀵 링크 빼고 나머지 한번에 조회
function DASH120M_Common(obj) {
    DASH120M_grid[6].instance.clearSelection();

    var selectedItem;
    if (obj) {
        var tr = $(obj).closest("tr");
        selectedItem = DASH120M_grid[1].instance.dataItem(tr);

        DASH120M_grid[1].instance.clearSelection();
        DASH120M_grid[1].instance.select(tr);
    } else {
        selectedItem = DASH120M_grid[1].currentItem;
    }
    // const columnHeader = DASH120M_comCdList
    //     .filter(x => x.comCd === selectedItem.pltItemCd)
    //     ?.find(x => x.mgntItemCd === DASH120M_getMgntItemCd(selectedItem.pltDvCd)).comCdNm;
    // 컬럼 헤더명 바꿔주기
    if (selectedItem.pltItemCd === 'B01' || selectedItem.pltItemCd === 'S05') {
        DASH120M_grid[6].instance.thead.find("[data-field='ctgrMgntNo']").html("번호");
    } else {
        DASH120M_grid[6].instance.thead.find("[data-field='ctgrMgntNo']").html("선택");
    }
    DASH120M_grid[6].dataSource.read({
        tenantId: GLOBAL.session.user.tenantId,
        pltDvCd: selectedItem.pltDvCd,
        pltItemCd: selectedItem.pltItemCd
    });
}

//팔레트 추가
function DASH120M_fnAddPallete() {
    let row = {
        pltDvCd: "",
    }
    let regInfo = {
        tenantId: GLOBAL.session.user.tenantId,
        regrId: GLOBAL.session.user.usrId,
        regrOrgCd: GLOBAL.session.user.orgCd,
        lstCorprId: GLOBAL.session.user.usrId,
        lstCorprOrgCd: GLOBAL.session.user.orgCd
    }
    DASH120M_grid[0].instance.dataSource.add($.extend(row, regInfo)).set("dirtyFields", {pltDvCd: true});
    DASH120M_grid[0].instance.refresh();
    DASH120M_grid[0].instance.clearSelection();
    // DASH120M_grid[0].instance.select("tr:last");
    (DASH120M_grid[0].instance).tbody.find("tr:last td").trigger('click');
}


//팔레트 항목 추가
function DASH120M_fnAddPltItems() {
    var row = {
        pltDvCd: DASH120M_grid[0].currentItem.pltDvCd,
        pltItemCd: "",
        dispCycCd: "",
        dispShpCd: "",

    }
    var regInfo = {
        tenantId: GLOBAL.session.user.tenantId,
        regrId: GLOBAL.session.user.usrId,
        regrOrgCd: GLOBAL.session.user.orgCd,
        lstCorprId: GLOBAL.session.user.usrId,
        lstCorprOrgCd: GLOBAL.session.user.orgCd
    }

    DASH120M_grid[1].dataSource.add($.extend(row, regInfo)).set("dirtyFields", {pltItemCd: true});
    DASH120M_grid[1].instance.refresh();
    DASH120M_grid[1].instance.clearSelection();
    DASH120M_grid[1].instance.select("tr:last");
    // (DASH120M_grid[1].instance).tbody.find("tr:last td.pltItemSelectable").trigger('click');
    // (DASH120M_grid[1].instance).editCell((DASH120M_grid[1].instance).tbody.find("tr:last td:eq(2)"));
    (DASH120M_grid[1].instance).tbody.find("tr:last button").trigger('click');
}


function DASh120M_selectCategory(e) {
    const getOffset = (e) => {
        const rect = e.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY
        };
    }
    let x = getOffset(e).left;
    let y = getOffset(e).top;
    x = x - 400 + e.scrollHeight;
    let dispPsnCd = DASH120M_pltItemCd === 'S05' ? 'S' : 'B';
    let nowCtgr = DASH120M_grid[6].dataSource.data().map(x => x.ctgrMgntNo).join(',');
    Utils.setCallbackFunction("DASH120M_getCategory", DASH120M_getCategory);
    Utils.openKendoWindow("/cmmt/CMMT301P", 400, 600, "left", Number(x), Number(y), false,
        {
            target: 'DASH',
            callbackKey: "DASH120M_getCategory",
            dashBrdDispPsnCd: DASH120M_pltItemCd !== 'S01' ? dispPsnCd : DASH120M_pltItemCd,
            dashBrdDispPmssYn: "Y",
            categories: nowCtgr,
        });
}
function DASh120M_getUseTrmEndDay(month) {
    let today = new Date();
    return new Date(today.setMonth(today.getMonth()+month));
}
function DASH120M_fnAddPltItemDtls(e) {
    if (!DASH120M_pltItemCd) {
        return $("#DASH120M_validMsg").val(DASH120M_langMap.get("DASH120M.info.noSelectPltItem"));
    }
    ;
    if ($('#DASH120M_Add').data('pltItemCd') !== DASH120M_pltItemCd) {
        $('#DASH120M_Add').data('pltItemCd', DASH120M_pltItemCd);
        return DASH120M_fnAddPltItemDtls(e);
    }
    // const pageLoadPltItemCd = $(e).data().pltItemCd;
    // if (pageLoadPltItemCd !== DASH120M_pltItemCd) {
    //     DASH120M_grid[1].instance.refresh();
    //     DASH120M_grid[1].instance.clearSelection();
    //     let dataItem = DASH120M_grid[1].dataSource.get(pageLoadPltItemCd);
    //     $("#DASH120M_pltItemGrid tr[data-uid='" + dataItem.uid + "'] td:eq(2)").trigger('click');
    //
    const addNewRow = (gridIndex, pltItemCd, pltDvCd) => {
        let totalRecords = DASH120M_grid[gridIndex].dataSource.total();

        let row = {
            dispCtt: "",
            pltItemNo: Number(totalRecords) + 1,
        };
        let regInfo = {
            tenantId: GLOBAL.session.user.tenantId,
            pltDvCd: pltDvCd,
            pltItemCd: pltItemCd,
            actYn: "Y",
            regrId: GLOBAL.session.user.usrId,
            regrOrgCd: GLOBAL.session.user.orgCd,
            lstCorprId: GLOBAL.session.user.usrId,
            lstCorcOrgCd: GLOBAL.session.user.orgCd
        };
        switch (pltItemCd) {
            case "T01":
                row.useTrmStrDd = new Date();
                row.useTrmEndDd = DASh120M_getUseTrmEndDay(1);
                break;
            case "S04":
                // let maxLnkSeq = DASH120M_getMaxQuickLinkSeq();
                row = {
                    qLnkNm: "",
                    qLnkAddr: "",
                    lnkSeq: Number(totalRecords) + 1,
                    dataFrmId: "CARD008S",
                    dataFrmePath: '/dash'
                }
                delete regInfo.actYn
                regInfo.qLnkDvCd = "1";
                regInfo.useYn = "Y"
                break;
            case "B01":
                // row.dataFrmePath = '/dash'
                // row.dataFrmId = '/CARD010S'
                break;
            case "S05":
                // row.dataFrmePath = '/dash'
                // row.dataFrmId = '/CARD009S'
                break;
            default :
                const dataItems = DASH120M_grid[gridIndex].dataSource.data().map(x=>x.pltItemNo);
                const maxNo = dataItems.length > 0 ? Math.max(...dataItems) : 0;
                row.pltItemNo = maxNo + 1;
                break;
        }
        DASH120M_grid[gridIndex].dataSource.add($.extend(row, regInfo)).set("dirtyFields", {dataFrmId: true});
        DASH120M_grid[gridIndex].instance.refresh();

        DASH120M_grid[gridIndex].instance.clearSelection();
        DASH120M_grid[gridIndex].instance.select("tr:last");
        // (DASH120M_grid[gridIndex].instance).editCell((DASH120M_grid[gridIndex].instance).tbody.find("tr:last td:eq(5)"));

    }
    let pltDvCd = DASH120M_grid[1].currentItem.pltDvCd;
    let valid = $('.DASH120M_editor').attr('class').includes('nodataMsg');
    switch (DASH120M_pltItemCd) {
        case "T01":
            addNewRow(2, "T01", pltDvCd);
            break;
        case "T02":
            if (valid) {
                $('.DASH120M_editor').empty().removeClass('nodataMsg').show();
            }
            DASH120M_EditorPreJob();
            break;
        case "T03":
            addNewRow(4, "T03", pltDvCd);
            break;
        case "S01":
            DASh120M_selectCategory(e);
            break;
        case "S04":
            addNewRow(3, DASH120M_pltItemCd, pltDvCd);
            break;
        case "T05":
            if (valid) {
                $('.DASH120M_editor').empty().removeClass('nodataMsg').show();
            }
            DASH120M_themeImagePreJob();
            break;
        case "S05":
            DASh120M_selectCategory(e);
            break;
        case "B01" :
            DASh120M_selectCategory(e);
            break;
        default : // S02, S03, S05, B01
            DASH120M_grid_fnTotalSorting();
            addNewRow(6, DASH120M_pltItemCd, pltDvCd);
            break;
    }
}


// 팔레트 항목 저장 버튼 클릭시
function DASH120M_fnSavePltMenu(gridIndex) {
    let isValid = true;
    let validtions = [{
        check: "pltDvCd",
        beforeCheck: "beforeDvCd",
        checkMessage: DASH120M_langMap.get("DASH120M.info.deletePlt"),
        nullMessage: DASH120M_langMap.get("DASH120M.info.noSelectPlt"),
        mgntItemCd: () => "C0037",
    }, {
        check: "pltItemCd",
        beforeCheck: "beforeDvCd",
        checkMessage: DASH120M_langMap.get("DASH120M.info.deletePltItem"),
        nullMessage: DASH120M_langMap.get("DASH120M.info.noSelectPltItem"),
        mgntItemCd: (pltDvCd) => DASH120M_getMgntItemCd(pltDvCd),
    }]
    let grid = DASH120M_grid[gridIndex];
    let targetValidation = validtions[gridIndex];
    let checkMessage;
    let changeList = grid.dataSource.data().filter(x => x.dirty);
    if (changeList.length === 0) {
        Utils.alert(DASH120M_langMap.get("DASH120M.info.notChange"));
        return;
    }
    $.each(grid.dataSource.data(), function (index, item) {
        if (Utils.isNull(item[targetValidation.check])) {
            $("#DASH120M_validMsg").val(targetValidation.nullMessage);
            isValid = false;
            return false;
        }

        if (item.dirty && !item.isNew()) {
            let pltDvNm = Utils.getComCdNm(DASH120M_comCdList, targetValidation.mgntItemCd(item.pltDvCd), item[targetValidation.beforeCheck])
            if (Utils.isNull(pltDvNm)) {
                return;
            }
            checkMessage = ''.concat(pltDvNm, ' ', targetValidation.checkMessage);
        }
    });

    if (isValid) {
        let msg = Utils.isNull(checkMessage) ? DASH120M_langMap.get("common.save.msg") : checkMessage;
        Utils.confirm(msg, function () {
            DASH120M_grid[gridIndex].instance.dataSource.sync().then(function () {
                Utils.alert(DASH120M_langMap.get("success.common.save")); // "정상적으로 저장되었습니다."
                $("#DASH120M_validMsg").val("");
            });
        });
    }
}

// 팔레트 항목 상세 저장 버튼 클릭시
function DASH120M_fnSavePltItemDtls() {
    let isValid = true;
    let mapping = {
        "T01": DASH120M_grid[2],
        "T03": DASH120M_grid[4],
        "S04": DASH120M_grid[3],
        "DTLS": DASH120M_grid[6],
        "T02": DASH20M_EditorSave,
        "T05": DASH20M_themeImageSave,
    }
    let grid = mapping[DASH120M_pltItemCd];
    if (typeof grid === "function") {
        return grid();
    }
    let validations = {
        "T01": [
            {
                check: "dispCtt",
                errorMessage: DASH120M_langMap.get("DASH120M.valid.emptySlogan") // "슬로건 내용을 입력해주세요."
            },
            {
                check: "useTrmStrDd",
                errorMessage: DASH120M_langMap.get("DASH120M.valid.noSelectStart") // "시작일을 선택해주세요."
            },
            {
                check: "useTrmEndDd",
                errorMessage: DASH120M_langMap.get("DASH120M.valid.noSelectEnd") // "종료일을 선택해주세요."
            }
        ],
        "S04": [
            {
                check: "qLnkNm",
                errorMessage: DASH120M_langMap.get("DASH120M.valid.emptyQLinkNm") // "Link 명을 입력해주세요."
            },
            {
                check: "qLnkAddr",
                errorMessage: DASH120M_langMap.get("DASH120M.valid.emptyQLinkAddr") // "Link 주소를 입력해주세요."
            }
        ],
        "T03": [
            {
                check: "dispCtt",
                errorMessage: DASH120M_langMap.get("DASH120M.valid.emptyAPI") // "연결API를 입력해주세요."
            },
        ],
        "DTLS": [
            {
                check: "dispCtt",
                errorMessage: DASH120M_langMap.get("DASH120M.valid.emptyDetail")    // 내용을 입력해주세요.
            },
        ]
    };


    let targetValidation = validations[DASH120M_pltItemCd];
    if (Utils.isNull(grid)) {
        grid = mapping['DTLS'];
        targetValidation = validations['DTLS'];
    }

    if (grid.selectedItems.length === 0) {
        $("#DASH120M_validMsg").val(DASH120M_langMap.get("DASH120M.info.noSelectPlt"));
        return;
    }
    $.each(grid.dataSource.data(), function (index, item) {
        targetValidation.forEach(function (validation) {
            if (Utils.isNull(item[validation.check])) {
                $("#DASH120M_validMsg").val(validation.errorMessage);
                isValid = false;
                return isValid;
            }
            // if (typeof validation.valid === "function") {
            //     isValid = validation.valid(item,isValid);
            //     console.log(isValid);
            //     return isValid;
            // }
        });
    });

    if (isValid) {
        Utils.confirm(DASH120M_langMap.get("common.save.msg"), function () {
            DASH120M_grid_fnTotalSorting();
            // if (DASH120M_pltItemCd === "B01" || DASH120M_pltItemCd === "S05") {
            //     let rowItems = grid.dataSource.data();
            //     let deleteItems = rowItems.map(x=>Object.assign({},x,{ctgrMgntNo:0}));
            //     Utils.ajaxSyncCall("/dash/DASH120DEL01", JSON.stringify({list: deleteItems}), function (result) {
            //         grid.dataSource.data([]);
            //         for (const item of rowItems) {
            //             let createCtgrNo = String(item.ctgrMgntNo).split(',');
            //             createCtgrNo.forEach((x)=>grid.instance.dataSource.add(Object.assign(
            //               {ctgrMgntNo:Number(x),pltItemNo:Number(x)},item)).set("dirtyFields", {ctgrMgntNo: true}));
            //         }
            //     });
            // };
            grid.instance.dataSource.sync().then(function () {
                Utils.alert(DASH120M_langMap.get("success.common.save"));
                $("#DASH120M_validMsg").val("");
            });
        });
    }
}


// 팔레트 항목 삭제 버튼 클릭시
function DASH120M_fnDeletePltItem(gridIndex) {
    let selectedItems = DASH120M_grid[gridIndex].selectedItems;
    if (selectedItems.length === 0) {
        Utils.alert(DASH120M_langMap.get("DASH120M.valid.noSelectDelPlt")); // 삭제 할 팔레트 항목을 선택해주세요.
        return;
    }
    // let itemCheck = DASH120M_grid[gridIndex].dataSource.data().filter(x => !x.id);
    // if (itemCheck.length > 0) {
    //     Utils.alert("추가 항목을 먼저 저장해주세요.");
    //     return;
    // }
    let ajaxItems = [];
    Utils.confirm(DASH120M_langMap.get("common.delete.msg"), function () {
        let itemCheck = DASH120M_grid[gridIndex].dataSource.data().filter(x => !x.id);
        if (itemCheck.length > 0) {
            selectedItems = [...selectedItems, ...itemCheck];
        }
        selectedItems.forEach(function (obj) {
            DASH120M_grid[gridIndex].dataSource.remove(obj);
            if (obj.dirty) {
                return false;
            }
            ajaxItems.push(obj);
        })
        if (ajaxItems.length === 0) {
            return;
        }
        DASH120M_grid[gridIndex].instance.dataSource.sync().then(function () {
            DASH120M_commObj.fnDataSourceReset([0]);
            DASH120M_commObj.fnResetPltItemDtls();
            DASH120M_fnSearchPlt();
            Utils.alert(DASH120M_langMap.get("success.common.delete"));
            $("#DASH120M_validMsg").val("");
        });
    });
}

// 팔레트 항목 상세 삭제 버튼 클릭시
function DASH120M_fnDeletePltItemDtls(gridIndex) {
    const mapping = {
        "T01": DASH120M_grid[2],
        "T02": DASH20M_EditorDelete,
        "T03": DASH120M_grid[4],
        "S04": DASH120M_grid[3],
        "DTLS": DASH120M_grid[6],
        "T05": DASH20M_themeImageDelete,
    }
    const defaultURL = "/dash/DASH120DEL01";
    const defaultFunction = DASH120M_Common;
    const validations = {
        "T01": [
            {
                errorMessage: DASH120M_langMap.get("DASH120M.valid.noSelectDelSlogan"), // "삭제 할 슬로건을 선택해주세요."
                callBack: DASH120M_fnSearch_T01_slogan,
                deleteURL: defaultURL,
            },
        ],
        "T03": [
            {
                errorMessage: DASH120M_langMap.get("DASH120M.valid.noSelectAPI"), // "삭제 할 연결API를 선택해주세요."
                callBack: DASH120M_ApiList,
                deleteURL: defaultURL,
            },
        ],
        "S01": [
            {
                errorMessage: DASH120M_langMap.get("DASH120M.valid.noSelectNote"), // "삭제 할 쪽지 메뉴를 선택해주세요."
                callBack: defaultFunction,
                deleteURL: defaultURL,
            }
        ],
        "S02": [
            {
                errorMessage: DASH120M_langMap.get("DASH120M.valid.noSelectKms"), // "삭제 할 지식 메뉴를 선택해주세요."
                callBack: defaultFunction,
                deleteURL: defaultURL,
            }
        ],
        "S04": [
            {
                errorMessage: DASH120M_langMap.get("DASH120M.valid.noSelectQLink"), // "삭제 할 퀵 링크를 선택해주세요."
                callBack: DASH120M_QlnkList,
                deleteURL: "/dash/DASH120DEL05"
            }
        ],
        "DTLS": [
            {
                errorMessage: DASH120M_langMap.get("DASH120M.valid.noSelectCard"), // "데이터 카드를 선택해주세요.",
                callBack: defaultFunction,
                deleteURL: defaultURL
            },
        ]
    };

    let grid = mapping[DASH120M_pltItemCd];
    let targetValidation;
    if (typeof grid === "function") {
        return grid();
    }
    if (Utils.isNull(grid)) {
        grid = mapping['DTLS'];
        [targetValidation] = validations['DTLS'];
    } else {
        [targetValidation] = validations[DASH120M_pltItemCd];
    }
    // id 없으면 그냥 grid instance에서 바로 삭제
    let deleteItems = grid.selectedItems;
    let withoutIdItems = deleteItems.filter(x => !x.id);
    if (withoutIdItems.length > 0) {
        deleteItems.forEach(function (obj, idx) {
            if (obj.isNew()) {
                grid.dataSource.remove(obj);
                deleteItems.splice(idx, 1);
            }
        });
        if (deleteItems.length === 0) {
            grid.instance.clearSelection();
            grid.instance.refresh();
            return;
        }
    }
    if (deleteItems.length === 0) {
        $("#DASH120M_validMsg").val(targetValidation.errorMessage);
        return;
    }
    // const callAjax = (deleteItems) => {
    //     Utils.ajaxCall(targetValidation.deleteURL, JSON.stringify({
    //         list: deleteItems
    //     }), function (result) {
    //         Utils.alert(DASH120M_langMap.get("success.common.delete"), function () {
    //             targetValidation.callBack();
    //             $("#DASH120M_validMsg").val("");
    //         });
    //     });
    // }
    const preProcessingBeforeDelete = () => {
        switch (DASH120M_pltItemCd) {
            case "T01" :
                deleteItems.forEach((item, idx, arr) => {
                    item.useTrmStrDd = null;
                    item.useTrmEndDd = null;
                })
                break;
            default:
                let DASH120M_deleteRows = [];
                let DASH120M_deleteData = [];
                $('#selectCardGrid .k-checkbox').each(function (idx, row) {
                    if ($(row).attr('aria-checked') === 'true') {
                        let DASH120M_tr = $(row).closest('tr');
                        let DASH120M_item = Object.assign({}, grid.instance.dataItem(DASH120M_tr));

                        let DASH120M_data = {
                            tenantId: GLOBAL.session.user.tenantId,
                            ctgrMgntNo: DASH120M_item.ctgrMgntNo
                        };

                        if (DASH120M_list.find(element => element.ctgrMgntNo == DASH120M_item.ctgrMgntNo)) {
                            DASH120M_deleteData.push(DASH120M_data);
                        } else {
                            if (!$(row).parents('th').length) {
                                DASH120M_deleteRows.push(DASH120M_tr);
                            }
                        }
                    }
                });
                return DASH120M_deleteRows;
        }
    }
    preProcessingBeforeDelete();
    Utils.ajaxCall(targetValidation.deleteURL, JSON.stringify({list: deleteItems}), function (result) {
        Utils.alert(DASH120M_langMap.get("success.common.delete"), function () {
            DASH120M_grid_fnTotalSorting();
            targetValidation.callBack();
            $("#DASH120M_validMsg").val("");
            DASH120M_grid[2].dataSource.read({
            		tenantId: GLOBAL.session.user.tenantId,
                    pltItemCd: DASH120M_pltItemCd
                    
            });
        });
    });
}

function DASH120M_grid_fnOnDataBound(gridIndex) {
    // let totalCnt = DASH120M_grid[gridIndex].instance.dataSource.total();
    // let hasChange = DASH120M_grid[gridIndex].dataSource.hasChanges();
    let gridIdSelector = DASH120M_commObj.getGridSelector[gridIndex];
    $("#DASH120M_" + gridIdSelector + " tbody").on("click", "td", function (e) {
        $("#DASH120M_validMsg").val("");
        let $row = $(this).closest("tr");
        let $cell = $(this).closest("td");
        DASH120M_grid[gridIndex].currentItem = DASH120M_grid[gridIndex].instance.dataItem($row);
        DASH120M_grid[gridIndex].currentCellIndex = $cell.index();
        DASH120M_pltItemCd = DASH120M_grid[1].currentItem.pltItemCd;
        const $pltItemBtn = $(".dashTemplete_sub button");
        const $pltItemDtlsBtn = $(".dashTemplete_detail button");
        if (gridIndex === 0) {
            $pltItemBtn.attr('disabled', Utils.isNull(DASH120M_grid[gridIndex].currentItem.id));
            $pltItemDtlsBtn.attr('disabled', Utils.isNull(DASH120M_grid[gridIndex].currentItem.id));
        }
        if (gridIndex === 1) {
            $pltItemDtlsBtn.attr('disabled', Utils.isNull(DASH120M_grid[gridIndex].currentItem.id));
            if (e.target.nodeName === 'BUTTON') DASH120M_grid[gridIndex].instance.select($row);
        }
    });

    if (gridIndex === 0 && DASH120M_grid[gridIndex].loadCount === 0) {
        let $pltSelectRow = $("#DASH120M_" + gridIdSelector + " tbody tr:first .DASH120M_pltDvCd");
        $pltSelectRow.click();
    }
    if (gridIndex === 1 && DASH120M_grid[gridIndex].loadCount === 0) {
        let $targetSelectBtn = $("#DASH120M_" + gridIdSelector + " tbody tr:first td:last button");
        $targetSelectBtn.length === 0 ? DASH120M_commObj.fnResetPltItemDtls() : $targetSelectBtn.click();
    }
    DASH120M_grid[gridIndex].loadCount++;

}

function DASH120M_grid_fnOnChange(e, gridIndex) {
    var rows = e.sender.select(),
        items = [];

    rows.each(function (e) {
        var dataItem = DASH120M_grid[gridIndex].instance.dataItem(this);
        items.push(dataItem);
    });
    DASH120M_grid[gridIndex].selectedItems = items;
}

// 그리드 내에 콤보박스 셋팅
function DASH120M_createComboInGrid(container, options, grid, exceptComCd) {
    let field = options.field;
    let mgntItemCd = function () {
        let obj = {
            qLnkDvCd: 'C0012',
            useYn: 'C0003',
            dispCycCd: 'C0041',
            dispShpCd: 'C0042'
        }
        return obj[field]
    }
    let $select = $('<select data-bind="value:' + field + '"/>').appendTo(container);
    let DASHTypCdList = DASH120M_comCdList.filter(function (code) {
        return code.mgntItemCd == mgntItemCd() && code.comCd != exceptComCd
    });

    Utils.setKendoComboBox(DASHTypCdList, mgntItemCd(), $select, "", false).bind("change", function (e) {
        let element = e.sender.element;
        let row = element.closest("tr");
        let dataItem = grid.dataItem(row);
        let selectedValue = e.sender.value();
        dataItem.set(field, selectedValue);
        grid.refresh();
    });
}

// 오늘의 명언 조회
function DASH120M_Editor(obj) {
    $('.DASH120M_editor').empty();
    const param = {
        tenantId: GLOBAL.session.user.tenantId,
        pltItemCd: "T02"
    }
    Utils.ajaxCall("/dash/DASH120SEL04", JSON.stringify(param), function (result) {
            let DASH120M_phraseJsonData = JSON.parse(result.list);
            if (DASH120M_phraseJsonData.length === 0) {
                DASH120M_editorPltItemNo = 0;
                $('.DASH120M_editor').show().addClass('nodataMsg');
                DASH120M_commObj.fnGridDisplayHide([5])
                return;
            }
            DASH120M_editorPltItemNo = DASH120M_phraseJsonData.slice(-1)[0].pltItemNo
            for (const data of DASH120M_phraseJsonData) {
                let UseTrmStrDd = data.useTrmStrDd;
                let UseTrmEndDd = data.useTrmEndDd;
                data.UseTrmStrDd = kendo.toString(new Date(UseTrmStrDd), "yyyy-MM-dd");
                data.UseTrmEndDd = kendo.toString(new Date(UseTrmEndDd), "yyyy-MM-dd");
                let DASH120M_pltItemNo = data.pltItemNo;
                DASH120M_EditorPreJob(data, DASH120M_pltItemNo);
            }
        }, window.kendo.ui.progress($("#DASH120M_pltItemGrid"), true), window.kendo.ui.progress($("#DASH120M_pltItemGrid"), false)
        , function (request, status, error) {
            console.log("[error]");
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        });
}

// 테마 이미지 조회
function DASH120M_fnSearchThemeImage() {
    $('.DASH120M_editor').empty();
    const param = {
        tenantId: GLOBAL.session.user.tenantId,
        pltItemCd: "T05"
    }
    Utils.ajaxCall("/dash/DASH120SEL04", JSON.stringify(param), function (result) {
            let DASH120M_themeImageData = JSON.parse(result.list);
            if (DASH120M_themeImageData.length === 0) {
                DASH120M_themePltItemNo = 0;
                $('.DASH120M_editor').show().addClass('nodataMsg');
                DASH120M_commObj.fnGridDisplayHide([5]);
                return;
            }
            DASH120M_themePltItemNo = DASH120M_themeImageData.slice(-1)[0].pltItemNo
            for (const data of DASH120M_themeImageData) {
                let UseTrmStrDd = data.useTrmStrDd;
                let UseTrmEndDd = data.useTrmEndDd;
                data.UseTrmStrDd = kendo.toString(new Date(UseTrmStrDd), "yyyy-MM-dd");
                data.UseTrmEndDd = kendo.toString(new Date(UseTrmEndDd), "yyyy-MM-dd");
                let DASH120M_pltItemNo = data.pltItemNo;
                DASH120M_themeImagePreJob(data, DASH120M_pltItemNo);
            }
        }, window.kendo.ui.progress($("#DASH120M_themeImage"), true), window.kendo.ui.progress($("#DASH120M_themeImage"), false)
        , function (request, status, error) {
            console.log("[error]");
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        });
}

// T01 - 슬로건
function DASH120M_fnShowSloganGrid(item) {
    DASH120M_commObj.fnGridDisplayHide([3, 4, 5, 6, 7]);
    DASH120M_commObj.fnGridDisplayShow([2]);
    DASH120M_fnSearch_T01_slogan(item);
}

/* T02 - 오늘의명언 */
function DASH120M_fnShowPhase(item) {
    $('.DASH120M_editor').removeClass('nodataMsg').attr('id', 'DASH120M_phraseEditor');
    DASH120M_grid[1].instance.clearSelection();
    DASH120M_grid[1].instance.select($(item).closest("tr"));
    if (Utils.isNull(item)) {
        let grid = DASH120M_grid[1].instance;
        grid.items().each(function () {
            let dataItem = grid.dataItem(this);
            if (dataItem.id === "T02") {
                grid.select(this);
            }
        });
    }
    DASH120M_commObj.fnGridDisplayHide([2, 3, 4, 6, 7]);
    DASH120M_commObj.fnGridDisplayShow([5]);
    DASH120M_Editor(item);
}

/* T03 - 오늘의 날씨 */
function DASH120M_fnShowWeather(item) {
    DASH120M_commObj.fnGridDisplayHide([2, 3, 5, 6, 7]);
    DASH120M_commObj.fnGridDisplayShow([4]);
    DASH120M_ApiList(item);
}

/* T04 - TBD */
function DASH120M_TBD(item) {
    $('.DASH120M_editor').addClass('nodataMsg');
    DASH120M_commObj.fnGridDisplayHide([2, 3, 4, 6, 7]);
    DASH120M_commObj.fnGridDisplayShow([5]);
    Utils.alert('개발중');
}

/* T05 - 테마이미지 */
function DASH120M_fnShowThemeImg(item) {
    $('.DASH120M_editor').removeClass('nodataMsg').attr('id', 'DASH120M_themeImage');
    DASH120M_grid[1].instance.clearSelection();
    DASH120M_grid[1].instance.select($(item).closest("tr"));
    if (Utils.isNull(item)) {
        let grid = DASH120M_grid[1].instance;
        grid.items().each(function () {
            let dataItem = grid.dataItem(this);
            if (dataItem.id === "T05") {
                grid.select(this);
            }
        });
    }
    DASH120M_commObj.fnGridDisplayHide([2, 3, 4, 5, 6]);
    DASH120M_commObj.fnGridDisplayShow([7]);
    DASH120M_fnSearchThemeImage(item);
}

/* S04 - 퀵링크 */
function DASH120M_fnShowQuickLink(item) {
    DASH120M_commObj.fnGridDisplayHide([2, 4, 5, 6, 7]);
    DASH120M_commObj.fnGridDisplayShow([3]);
    DASH120M_QlnkList(item);
}

function DASH120M_fnShowSideItemTmpl(item) {
    DASH120M_commObj.fnGridDisplayHide([2, 3, 4, 5, 7]);
    DASH120M_commObj.fnGridDisplayShow([6]);
    DASH120M_Common(item);
    // $("#DASH120M_grid6 th[data-field=dispCtt]").contents().last().replaceWith("지식카테고리");
}

function DASH120M_fnShowBodyItemTmpl(item) {
    DASH120M_commObj.fnGridDisplayHide([2, 3, 4, 5, 7]);
    DASH120M_commObj.fnGridDisplayShow([6]);
    DASH120M_Common(item);
}

//ComboBoxEditor
function dateD120M(container, option) {
    $('<input name="' + option.field + '">').appendTo(container)
        .kendoDatePicker({
            format: "yyyy-MM-dd",
            footer: false,
            culture: "ko-KR"
        });
}

//Grid   Height  체크
function DASH120M_gridResizeHeight() {
    $('.dashTempleteCnt').css('height', $(window).height() - 320);
    let tableD120MHeight = $('.dashTempleteCnt').height();
    DASH120M_grid.map(x => x.instance.element?.find('.k-grid-content').css('height', tableD120MHeight - 90));
    $('.dashTemplete_detail .dashPalette_miniEditor').css('height', tableD120MHeight - 64);
}

function DASH120M_getMaxQuickLinkSeq() {
    let maxNum;
    Utils.ajaxSyncCall("/frme/FRME140getMaxLnkSeq", JSON.stringify({tenantId: GLOBAL.session.user.tenantId}),
        function (result) {
            maxNum = Number(JSON.parse(result.maxLnkSeq));
        });
    return maxNum;
}

// 슬로건, 퀵링크 순서 자동 소팅
function DASH120M_grid_fnTotalSorting() {
    let result = false;
    let changeCnt = 0;

    if (DASH120M_pltItemCd === 'S04') {
        // let maxLnkSeq = DASH120M_getMaxQuickLinkSeq();
        $.each(DASH120M_grid[3].dataSource.data(), function (index, item) {
            let lnkSeq = index + 1;
            if (item.lnkSeq !== lnkSeq) {
                item.set("lnkSeq", lnkSeq);
                changeCnt++;
            }
        });
    }
    if (changeCnt > 0) {
        result = true;
    }
    return result;
}

// 팔레트 추가 버튼 공통코트 페이지 이동
function DASH120M_pageGo() {
    let param = {
        mgntItemCd: "C0037"
    }
    if (MAINFRAME.isTabOpen("SYSM340M") == true) {
        $("#SYSM340M_mgntItemCd").val(param.mgntItemCd);
        SYSM340M_fnSearch();
    }
    MAINFRAME.openDataFrameById("SYSM340M", param);
}
