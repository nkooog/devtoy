/***********************************************************************************************
 * Program Name : 실시간운영메시지관리(SYSM500M.js)
 * Creator      : jrlee
 * Create Date  : 2022.06.17
 * Description  : 실시간운영메시지관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.06.17     jrlee           최초작성
 ************************************************************************************************/
var SYSM500M_comCdList
var SYSM500M_grid = new Array(1);

$(document).ready(function () {
    for (let i = 0; i < SYSM500M_grid.length; i++) {
        SYSM500M_grid[i] = {
            instance: {},
            dataSource: {},
            currentItem: {},
            currentCellIndex: Number(),
            selectedItems: [],
            loadCount: 0
        }
    }

    $("#SYSM500M_detail_tenantId").val(GLOBAL.session.user.tenantId)

    Utils.resizeLabelWidth();

    SYSM500M_grid[0].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                let param = {
                    tenantId: $("#SYSM500M_tenantId").val(),
                    srchDtFrom: $("#SYSM500M_dateStart").val(),
                    srchDtTo: $("#SYSM500M_dateEnd").val(),
                    notiDvCd: $("#SYSM500M_notiDvCd").val(),
                    apclDvCd: $("#SYSM500M_apclDvCd").val()
                };

                $.extend(param, options.data);

                Utils.ajaxCall("/sysm/SYSM500SEL01", JSON.stringify(param), function (result) {
                    options.success(JSON.parse(result.list));
                });
            }
        },
        pageSize: 25,
        schema: {
            type: "json",
            model: {
                id: "oprNotiNo",
                fields: {
                    regDtm: {type: "number"},
                    tenantId: {type: "string"},
                    notiTite: {type: "string"},
                    notiStrDtm: {type: "number"},
                    notiEndDtm: {type: "number"},
                    lstCorcDtm: {type: "number"},
                    lstCorprId: {type: "string"}
                }
            },
        }
    });

    SYSM500M_grid[0].instance = $("#SYSM500M_grid").kendoGrid({
        dataSource: SYSM500M_grid[0].dataSource,
        autoBind: false,
        selectable: "row",
        persistSelection: true,
        sortable: true,
        resizable: true,
        scrollable: true,
        noRecords: {
            template: "<div class='nodataMsg'><p>" + SYSM500M_langMap.get("fail.common.select") + "</p></div>" // 조회된 내역이 없습니다.
        },
        // height: 345,
        // messages: {
        //     noRecords: SYSM500M_langMap.get("fail.common.select") // 조회된 내역이 없습니다.
        //
        // },
        pageable: {
            refresh: true,
            pageSizes: [25, 50, 100, 200, 500],
            buttonCount: 5,
            messages: {
                empty: SYSM500M_langMap.get("fail.common.select") // 조회된 내역이 없습니다.
            }
        },
        dataBound: function (e) {
            let grid = e.sender;
            let rows = grid.items();

            rows.off("click").on("click", function (e) {
                let dataItem = grid.dataItem(this);
                let cellIndex = $(e.target).index();

                SYSM500M_grid[0].currentItem = dataItem;
                SYSM500M_fnDetail(dataItem);
            });

            if (SYSM500M_grid[0].loadCount == 0) {
                $("#SYSM500M_grid tbody tr:first").trigger("click");
            }

            SYSM500M_grid[0].loadCount++;

            $(".k-grid-content td[role=gridcell]").css("cursor", "pointer");
        },
        change: function (e) {
            let rows = e.sender.select()
            let items = [];

            rows.each(function (e) {
                let dataItem = SYSM500M_grid[0].instance.dataItem(this);
                items.push(dataItem);
            });

            SYSM500M_grid[0].selectedItems = items;
        },
        columns: [{
            title: SYSM500M_langMap.get("table.select"), // 선택
            width: 40,
            template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',
        }, {
            title: SYSM500M_langMap.get("SYSM500M.subTitle.notiDvCd"), // "공지구분"
            width: 70,
            template:
                "#if(notiDvCd == '1'){#" +
                    "<span class='fontRed fontBold'><i class='k-icon k-i-bell f12'></i>#:Utils.getComCdNm(SYSM500M_comCdList, 'C0220', notiDvCd)#</span>" +
                "#} else {#" +
                    "<span>#:Utils.getComCdNm(SYSM500M_comCdList, 'C0220', notiDvCd)#</span>" +
                "#}#"
        }, {
            field: "tenantId",
            title: SYSM500M_langMap.get("SYSM500M.subTitle.tenantId"), // "테넌트"
            width: 110
        }, {
            field: "tenantNm",
            title: SYSM500M_langMap.get("SYSM500M.subTitle.tenantNm"), // "테넌트명"
            width: 200,
            attributes: {"class": "textEllipsis"}
        }, {
            field: "notiTite",
            title: SYSM500M_langMap.get("SYSM500M.subTitle.notiTite"), // "공지제목"
            width: "auto",
            attributes: {"class": "textEllipsis"}
        }, {
            field: "regDtm",
            title: SYSM500M_langMap.get("SYSM500M.subTitle.regDtm"), // "공지일자"
            width: 100,
            template: '#=kendo.format("{0:yyyy-MM-dd}", new Date(regDtm))#'
        }, {
            field: "notiStrDtm",
            title: SYSM500M_langMap.get("SYSM500M.subTitle.notiStrDtm"), // "시작일시"
            width: 150,
            template: '#=kendo.format("{0:yyyy-MM-dd HH:mm}", new Date(notiStrDtm))#'
        }, {
            field: "notiEndDtm",
            title: SYSM500M_langMap.get("SYSM500M.subTitle.notiEndDtm"), // "종료일시"
            width: 150,
            template: '#=kendo.format("{0:yyyy-MM-dd HH:mm}", new Date(notiEndDtm))#'
        }/*, {
            field: "lstCorcDtm",
            title: SYSM500M_langMap.get("SYSM500M.subTitle.lstCorcDtm"), // "최종등록일시"
            width: 140,
            template: '#=kendo.format("{0:yyyy-MM-dd HH:mm:ss}", new Date(lstCorcDtm))#'
        }, {
            field: "lstCorprId",
            title: SYSM500M_langMap.get("SYSM500M.subTitle.lstCorprId"), // "최종등록자"
            width: 130,
            template: '#=lstCorprNm + "(" + lstCorprId + ")"#'
        }*/]
    }).data("kendoGrid");

    $("#SYSM500M_detail_notiStrDtm").kendoDateTimePicker({
        value: "",
        culture: "ko-KR",
        footer: false,
        format: "yyyy-MM-dd HH:mm",
    }).data("kendoDateTimePicker");
    $("#SYSM500M_detail_notiStrDtm").attr("readonly", true);

    $("#SYSM500M_detail_notiEndDtm").kendoDateTimePicker({
        value: "",
        culture: "ko-KR",
        footer: false,
        format: "yyyy-MM-dd HH:mm",
    }).data("kendoDateTimePicker");
    $("#SYSM500M_detail_notiEndDtm").attr("readonly", true);

    SYSM500M_fnGridResize();
    $(window).on("resize", function () { SYSM500M_fnGridResize();});

    SYSM500M_fnInit();
});

function SYSM500M_fnInit() {
    let param = {
        "codeList": [
            {"mgntItemCd": "C0220"},    // 시스템공지구분코드
            {"mgntItemCd": "C0221"}     // 시스템공지적용구분코드
        ]
    };

    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        SYSM500M_comCdList = JSON.parse(result.codeList);

        Utils.setKendoComboBox(SYSM500M_comCdList, "C0220", "#SYSM500M_notiDvCd");
        Utils.setKendoComboBox(SYSM500M_comCdList, "C0221", "#SYSM500M_apclDvCd");
        Utils.setKendoComboBox(SYSM500M_comCdList, "C0220", "#SYSM500M_detail_notiDvCd", "", "선택");
        Utils.setKendoComboBox(SYSM500M_comCdList, "C0221", "#SYSM500M_detail_apclDvCd", "", "선택");


        const SYSM500M_fnGridClear = () => {
            SYSM500M_grid[0].instance.clearSelection();
            SYSM500M_grid[0].currentItem = {};
            SYSM500M_grid[0].instance.dataSource.data([]);

            $("#SYSM500M_notiDvCd").data("kendoComboBox").select(0);
            $("#SYSM500M_apclDvCd").data("kendoComboBox").select(0);
        }

        CMMN_SEARCH_TENANT["SYSM500M"].fnInit(null,SYSM500M_fnSearch,SYSM500M_fnGridClear);
    });
}

function SYSM500M_fnSearch() {

    if (Utils.isNull($("#SYSM500M_tenantId").val())) {
        Utils.alert("테넌트를 입력해주세요.", function () {
            $("#SYSM500M_tenantId").focus();
        });

        return false;
    }

    SYSM500M_grid[0].dataSource.read();
}

function SYSM500M_fnDetail(dataItem) {
    $("#SYSM500M_detail_oprNotiNo").val(dataItem.oprNotiNo);
    $("#SYSM500M_detail_tenantId").val(dataItem.tenantId).trigger("change");
    $("#SYSM500M_detail_notiTite").val(dataItem.notiTite);
    $("#SYSM500M_detail_notiCtt").val(dataItem.notiCtt);
    $("#SYSM500M_detail_lstCorcDtm").text(kendo.format("{0:yyyy-MM-dd HH:mm:ss}", new Date(dataItem.lstCorcDtm)));
    $("#SYSM500M_detail_lstCorprNm").text(dataItem.lstCorprNm);
    $("#SYSM500M_detail_lstCorprId").text("(" + dataItem.lstCorprId + ")");
    $("#SYSM500M_detail_notiDvCd").data("kendoComboBox").value(dataItem.notiDvCd);
    $("#SYSM500M_detail_apclDvCd").data("kendoComboBox").value(dataItem.apclDvCd);
    $("#SYSM500M_detail_notiStrDtm").data("kendoDateTimePicker").value(new Date(dataItem.notiStrDtm));
    $("#SYSM500M_detail_notiEndDtm").data("kendoDateTimePicker").value(new Date(dataItem.notiEndDtm));
}

function SYSM500M_fnNew() {
    SYSM500M_grid[0].instance.clearSelection();
    SYSM500M_grid[0].currentItem = {};

    $("#SYSM500M_detail").find("input, textarea").not(".SYSM500M_preventInit").val("");
    $("#SYSM500M_detail").find("#SYSM500M_detail_lstCorcDtm, #SYSM500M_detail_lstCorprNm, #SYSM500M_detail_lstCorprId").text("");
    $("#SYSM500M_detail_tenantId").trigger("change");
    $("#SYSM500M_detail_notiDvCd").data("kendoComboBox").value("");
    $("#SYSM500M_detail_apclDvCd").data("kendoComboBox").value("");
}

function SYSM500M_fnSave() {
    Utils.markingRequiredField();

    if (Utils.isNull($("#SYSM500M_detail_tenantId").val())) {
        Utils.alert("테넌트명을 입력하세요."); // "공지구분을 선택해주세요."
        return;
    }

    if (Utils.isNull($("#SYSM500M_detail_notiDvCd").val())) {
        Utils.alert(SYSM500M_langMap.get("SYSM500M.alert.select.notiDvCd")); // "공지구분을 선택해주세요."
        return;
    }
    if (Utils.isNull($("#SYSM500M_detail_notiTite").val())) {
        Utils.alert(SYSM500M_langMap.get("SYSM500M.alert.input.notiTite")); // "공지제목을 입력해주세요."
        return;
    }
    if (Utils.isNull($("#SYSM500M_detail_notiCtt").val())) {
        Utils.alert(SYSM500M_langMap.get("SYSM500M.alert.input.notiCtt")); // "공지내용을 입력해주세요."
        return;
    }
    if (Utils.isNull($("#SYSM500M_detail_notiStrDtm").val())) {
        Utils.alert(SYSM500M_langMap.get("SYSM500M.alert.input.notiStrDtm")); // "공지시작일시 입력해주세요."
        return;
    }
    if (Utils.isNull($("#SYSM500M_detail_notiEndDtm").val())) {
        Utils.alert(SYSM500M_langMap.get("SYSM500M.alert.input.notiEndDtm")); // "공지종료일시 입력해주세요."
        return;
    }
    if (Utils.isNull($("#SYSM500M_detail_apclDvCd").val())) {
        Utils.alert(SYSM500M_langMap.get("SYSM500M.alert.select.apclDvCd")); // "적용구분을 선택해주세요."
        return;
    }

    let param = {
        oprNotiNo: Utils.isNull($("#SYSM500M_detail_oprNotiNo").val()) ? new Date().getTime() : $("#SYSM500M_detail_oprNotiNo").val(),
        tenantId: $("#SYSM500M_detail_tenantId").val(),
        notiDvCd: $("#SYSM500M_detail_notiDvCd").val(),
        notiTite: $("#SYSM500M_detail_notiTite").val(),
        notiCtt: $("#SYSM500M_detail_notiCtt").val(),
        notiStrDtm: new Date($("#SYSM500M_detail_notiStrDtm").val()),
        notiEndDtm: new Date($("#SYSM500M_detail_notiEndDtm").val()),
        apclDvCd: $("#SYSM500M_detail_apclDvCd").val()
    }
    let regInfo = {
        regrId: GLOBAL.session.user.usrId,
        regrOrgCd: GLOBAL.session.user.orgCd,
        lstCorprId: GLOBAL.session.user.usrId,
        lstCorprOrgCd: GLOBAL.session.user.orgCd
    }

    $.extend(param, regInfo);

    Utils.ajaxCall("/sysm/SYSM500INS01", JSON.stringify(param), function (result) {
        Utils.alert(SYSM500M_langMap.get("SYSM500M.alert.save.success"), function () { // "정상적으로 저장되었습니다."
            SYSM500M_fnSearch();
        });
    });
}

function SYSM500M_fnDelete() {
    let dataItem = SYSM500M_grid[0].currentItem;

    if ($.isEmptyObject(dataItem)) {
        Utils.alert(SYSM500M_langMap.get("SYSM500M.alert.delete.select")); // "삭제할 메시지를 선택해주세요."
        return;
    }

    Utils.confirm(SYSM500M_langMap.get("common.delete.msg"), function () { // "삭제하시겠습니까?"
        Utils.ajaxCall("/sysm/SYSM500DEL01", JSON.stringify({
            oprNotiNo: dataItem.oprNotiNo
        }), function (result) {
            Utils.alert(SYSM500M_langMap.get("success.common.delete"), function () { // "정상적으로 삭제되었습니다."
                SYSM500M_fnSearch();
                SYSM500M_fnNew();
            });
        });
    });
}

function SYSM500M_fnSearchTenant() {
    Utils.setCallbackFunction("SYSM500M_fnDetailSYSM101PCallback", function(tenantId) {
        $("#SYSM500M_detail_tenantId").val(tenantId);
        GetTenantNm(tenantId, 'SYSM500M_detail_tenantNm');
    });
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM101P", "SYSM101P", 1200, 595, {callbackKey: "SYSM500M_fnDetailSYSM101PCallback"})
}

function SYSM500M_fnGridResize() {
    let screenHeight = $(window).height() - 210; // (헤더+푸터) 영역 높이 제외

    if (SYSM500M_grid[0].instance.element)
        SYSM500M_grid[0].instance.element.find('.k-grid-content').css('height', screenHeight - 470);
}