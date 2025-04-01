/***********************************************************************************************
 * Program Name : 장애공지관리(SYSM550M.js)
 * Creator      : shpark
 * Create Date  : 2024.06.14
 * Description  : 장애공지관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2024.06.14     shpark           최초작성
 ************************************************************************************************/
var SYSM550M_comCdList
var SYSM550M_tenantList = []//전체 테넌트 리스트
var SYSM550M_grid = new Array(1);
var SYSM550M_Combo = new Array(3);
$(document).ready(function () {

    for (let i = 0; i < SYSM550M_grid.length; i++) {
        SYSM550M_grid[i] = {
            instance: {},
            dataSource: {},
            currentItem: {},
            currentCellIndex: Number(),
            selectedItems: [],
            loadCount: 0
        }
    }


    Utils.resizeLabelWidth();

    SYSM550M_grid[0].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                let param = {
                    tenantId: $("#SYSM550M_tenantId").val(),
                    srchDtFrom: $("#SYSM550M_dateStart").val(),
                    srchDtTo: $("#SYSM550M_dateEnd").val(),
                    notiDvCd: $("#SYSM550M_notiDvCd").val(),
                    apclDvCd: $("#SYSM550M_apclDvCd").val()
                };

                $.extend(param, options.data);

                Utils.ajaxCall("/sysm/SYSM550SEL01", JSON.stringify(param), function (result) {
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

    SYSM550M_grid[0].instance = $("#SYSM550M_grid").kendoGrid({
        dataSource: SYSM550M_grid[0].dataSource,
        autoBind: false,
        selectable: "row",
        persistSelection: true,
        sortable: true,
        resizable: true,
        scrollable: true,
        noRecords: {
            template: "<div class='nodataMsg'><p>" + SYSM550M_langMap.get("fail.common.select") + "</p></div>" // 조회된 내역이 없습니다.
        },
        // height: 345,
        // messages: {
        //     noRecords: SYSM550M_langMap.get("fail.common.select") // 조회된 내역이 없습니다.
        //
        // },
        pageable: {
            refresh: true,
            pageSizes: [25, 50, 100, 200, 500],
            buttonCount: 5,
            messages: {
                empty: SYSM550M_langMap.get("fail.common.select") // 조회된 내역이 없습니다.
            }
        },
        dataBound: function (e) {
            let grid = e.sender;
            let rows = grid.items();

            rows.off("click").on("click", function (e) {
                let dataItem = grid.dataItem(this);
                let cellIndex = $(e.target).index();

                SYSM550M_grid[0].currentItem = dataItem;
                SYSM550M_fnDetail(dataItem);
            });

            if (SYSM550M_grid[0].loadCount == 0) {
                $("#SYSM550M_grid tbody tr:first").trigger("click");
            }

            SYSM550M_grid[0].loadCount++;

            $(".k-grid-content td[role=gridcell]").css("cursor", "pointer");
        },
        change: function (e) {
            let rows = e.sender.select()
            let items = [];

            rows.each(function (e) {
                let dataItem = SYSM550M_grid[0].instance.dataItem(this);
                items.push(dataItem);
            });

            SYSM550M_grid[0].selectedItems = items;
        },
        columns: [{
            title: SYSM550M_langMap.get("table.select"), // 선택
            width: 40,
            template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',
        }, {
            title: SYSM550M_langMap.get("SYSM550M.subTitle.notiDvCd"), // "공지구분"
            width: 70,
            template: function(dataItem) {
                return '<span>' + Utils.getComCdNm(SYSM550M_comCdList, 'C0422', dataItem.notiDvCd) + '</span>';
            }
        }, {
            field: "tenantId",
            title: SYSM550M_langMap.get("SYSM550M.subTitle.tenantId"), // "테넌트"
            width: 110,
            template: function(dataItem) {
                if(dataItem.tenantId == ''){
                    return '<span>' + '전체' + '</span>';
                }else{
                    return '<span>' +dataItem.tenantId + '</span>';
                }
            }
        }, {
            field: "tenantNm",
            title: SYSM550M_langMap.get("SYSM550M.subTitle.tenantNm"), // "테넌트명"
            width: 200,
            template: function(dataItem) {
                if(dataItem.tenantNm == ''){
                    return '<span>' + '전체' + '</span>';
                }else{
                    return '<span>' +dataItem.tenantNm + '</span>';
                }
            }
        }, {
            field: "notiTite",
            title: SYSM550M_langMap.get("SYSM550M.subTitle.notiTite"), // "공지제목"
            width: "auto",
            attributes: {"class": "textEllipsis"}
        }, {
            field: "regDtm",
            title: SYSM550M_langMap.get("SYSM550M.subTitle.regDtm"), // "공지일자"
            width: 100,
            template: '#=kendo.format("{0:yyyy-MM-dd}", new Date(regDtm))#'
        }, {
            field: "notiStrDtm",
            title: SYSM550M_langMap.get("SYSM550M.subTitle.notiStrDtm"), // "시작일시"
            width: 150,
            template: '#=kendo.format("{0:yyyy-MM-dd HH:mm}", new Date(notiStrDtm))#'
        }, {
            field: "notiEndDtm",
            title: SYSM550M_langMap.get("SYSM550M.subTitle.notiEndDtm"), // "종료일시"
            width: 150,
            template: '#=kendo.format("{0:yyyy-MM-dd HH:mm}", new Date(notiEndDtm))#'
        },
        {
            title: SYSM550M_langMap.get("SYSM550M.subTitle.apclDvCd"), // "적용구분"
            width: 70,
            template: function (dataItem) {
                return '<span>' + Utils.getComCdNm(SYSM550M_comCdList, 'C0221', dataItem.apclDvCd) + '</span>';
            }
        },
            /*, {
            field: "lstCorcDtm",
            title: SYSM550M_langMap.get("SYSM550M.subTitle.lstCorcDtm"), // "최종등록일시"
            width: 140,
            template: '#=kendo.format("{0:yyyy-MM-dd HH:mm:ss}", new Date(lstCorcDtm))#'
        }, {
            field: "lstCorprId",
            title: SYSM550M_langMap.get("SYSM550M.subTitle.lstCorprId"), // "최종등록자"
            width: 130,
            template: '#=lstCorprNm + "(" + lstCorprId + ")"#'
        }*/]
    }).data("kendoGrid");

    $("#SYSM550M_detail_notiStrDtm").kendoDateTimePicker({
        value: "",
        culture: "ko-KR",
        footer: false,
        format: "yyyy-MM-dd HH:mm",
    }).data("kendoDateTimePicker");
    $("#SYSM550M_detail_notiStrDtm").attr("readonly", true);

    $("#SYSM550M_detail_notiEndDtm").kendoDateTimePicker({
        value: "",
        culture: "ko-KR",
        footer: false,
        format: "yyyy-MM-dd HH:mm",
    }).data("kendoDateTimePicker");
    $("#SYSM550M_detail_notiEndDtm").attr("readonly", true);

    SYSM550M_fnGridResize();
    $(window).on("resize", function () { SYSM550M_fnGridResize();});

    SYSM550M_fnInit();
});

function SYSM550M_fnInit() {
    let param = {
        "codeList": [
            {"mgntItemCd": "C0422"},    // 시스템공지구분코드
            {"mgntItemCd": "C0221"}     // 시스템공지적용구분코드
        ]
    };
    //테넌트 콤보박스 생성
    Utils.ajaxCall("/sysm/SYSM100SEL01", JSON.stringify({}), function (result) {
        SYSM550M_tenantList = JSON.parse(result.SYSM100VOInfo);
        Utils.setKendoComboBoxCustom(SYSM550M_tenantList, "#SYSM550M_tenantId", "tenantId", "tenantId", GLOBAL.session.user.tenantId, "전체");
        Utils.setKendoComboBoxCustom(SYSM550M_tenantList, "#SYSM550M_tenantComboBox", "tenantId", "tenantId", GLOBAL.session.user.tenantId, "전체");
    });


    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        SYSM550M_comCdList = JSON.parse(result.codeList);

        Utils.setKendoComboBox(SYSM550M_comCdList, "C0422", "#SYSM550M_notiDvCd");
        Utils.setKendoRadioButton(SYSM550M_comCdList, "C0422", "#SYSM550M_detail_notiDvCd");
        Utils.setKendoComboBox(SYSM550M_comCdList, "C0221", "#SYSM550M_apclDvCd");
        Utils.setKendoComboBox(SYSM550M_comCdList, "C0221", "#SYSM550M_detail_apclDvCd", "", "선택");


        const SYSM550M_fnGridClear = () => {
            SYSM550M_grid[0].instance.clearSelection();
            SYSM550M_grid[0].currentItem = {};
            SYSM550M_grid[0].instance.dataSource.data([]);

            $("#SYSM550M_notiDvCd").data("kendoComboBox").select(0);
            $("#SYSM550M_apclDvCd").data("kendoComboBox").select(0);
        }

        SYSM550M_fnSearch();
    });
}


function SYSM550M_fnSearch() {

    SYSM550M_grid[0].dataSource.read();
}

function SYSM550M_fnDetail(dataItem) {
    $("#SYSM550M_tenantComboBox").data("kendoComboBox").value(dataItem.tenantId)
    $("#SYSM550M_detail_oprNotiNo").val(dataItem.oprNotiNo);
    $("#SYSM550M_detail_notiTite").val(dataItem.notiTite);
    $("#SYSM550M_detail_notiCtt").val(dataItem.notiCtt);
    $("input[name='SYSM550M_detail_notiDvCd'][value='"+dataItem.notiDvCd+"']").prop("checked", true);
    $("#SYSM550M_detail_lstCorcDtm").text(kendo.format("{0:yyyy-MM-dd HH:mm:ss}", new Date(dataItem.lstCorcDtm)));
    $("#SYSM550M_detail_lstCorprNm").text(dataItem.lstCorprNm);
    $("#SYSM550M_detail_lstCorprId").text("(" + dataItem.lstCorprId + ")");
    $("#SYSM550M_detail_apclDvCd").data("kendoComboBox").value(dataItem.apclDvCd);
    $("#SYSM550M_detail_notiStrDtm").data("kendoDateTimePicker").value(new Date(dataItem.notiStrDtm));
    $("#SYSM550M_detail_notiEndDtm").data("kendoDateTimePicker").value(new Date(dataItem.notiEndDtm));
}

function SYSM550M_fnNew() {
    SYSM550M_grid[0].instance.clearSelection();
    SYSM550M_grid[0].currentItem = {};

    $("#SYSM550M_detail").find("input, textarea").not("input[name='SYSM550M_detail_notiDvCd']").val("");    //SYSM550M_detail_notiDvCd는 value값 초기화 되면 안됨.
    $("input[name='SYSM550M_detail_notiDvCd']").prop("checked", false);  //SYSM550M_detail_notiDvCd는 check전부 해제
    $("#SYSM550M_tenantComboBox").data("kendoComboBox").value("")

    $("#SYSM550M_detail").find("#SYSM550M_detail_lstCorcDtm, #SYSM550M_detail_lstCorprNm, #SYSM550M_detail_lstCorprId").text("");
    $("#SYSM550M_detail_apclDvCd").data("kendoComboBox").value("");
}

function SYSM550M_fnSave() {
    Utils.markingRequiredField();


    if (Utils.isNull($("input[name='SYSM550M_detail_notiDvCd']").val())) {
        Utils.alert(SYSM550M_langMap.get("SYSM550M.alert.select.notiDvCd")); // "공지구분을 선택해주세요."
        return;
    }
    if (Utils.isNull($("#SYSM550M_detail_notiTite").val())) {
        Utils.alert(SYSM550M_langMap.get("SYSM550M.alert.input.notiTite")); // "공지제목을 입력해주세요."
        return;
    }
    if (Utils.isNull($("#SYSM550M_detail_notiCtt").val())) {
        Utils.alert(SYSM550M_langMap.get("SYSM550M.alert.input.notiCtt")); // "공지내용을 입력해주세요."
        return;
    }
    if (Utils.isNull($("#SYSM550M_detail_notiStrDtm").val())) {
        Utils.alert(SYSM550M_langMap.get("SYSM550M.alert.input.notiStrDtm")); // "공지시작일시 입력해주세요."
        return;
    }
    if (Utils.isNull($("#SYSM550M_detail_notiEndDtm").val())) {
        Utils.alert(SYSM550M_langMap.get("SYSM550M.alert.input.notiEndDtm")); // "공지종료일시 입력해주세요."
        return;
    }
    if (Utils.isNull($("#SYSM550M_detail_apclDvCd").val())) {
        Utils.alert(SYSM550M_langMap.get("SYSM550M.alert.select.apclDvCd")); // "적용구분을 선택해주세요."
        return;
    }

    let param = {
        oprNotiNo: Utils.isNull($("#SYSM550M_detail_oprNotiNo").val()) ? new Date().getTime() : $("#SYSM550M_detail_oprNotiNo").val(),
        tenantId: $("#SYSM550M_tenantComboBox").val(),
        notiDvCd: $("input[name='SYSM550M_detail_notiDvCd']:checked").val(),
        notiTite: $("#SYSM550M_detail_notiTite").val(),
        notiCtt: $("#SYSM550M_detail_notiCtt").val(),
        notiStrDtm: new Date($("#SYSM550M_detail_notiStrDtm").val()),
        notiEndDtm: new Date($("#SYSM550M_detail_notiEndDtm").val()),
        apclDvCd: $("#SYSM550M_detail_apclDvCd").val()
    }
    let regInfo = {
        regrId: GLOBAL.session.user.usrId,
        regrOrgCd: GLOBAL.session.user.orgCd,
        lstCorprId: GLOBAL.session.user.usrId,
        lstCorprOrgCd: GLOBAL.session.user.orgCd
    }

    $.extend(param, regInfo);

    Utils.ajaxCall("/sysm/SYSM550INS01", JSON.stringify(param), function (result) {
        Utils.alert(SYSM550M_langMap.get("SYSM550M.alert.save.success"), function () { // "정상적으로 저장되었습니다."
            SYSM550M_fnSearch();
        });
    });
}

function SYSM550M_fnDelete() {
    let dataItem = SYSM550M_grid[0].currentItem;

    if ($.isEmptyObject(dataItem)) {
        Utils.alert(SYSM550M_langMap.get("SYSM550M.alert.delete.select")); // "삭제할 메시지를 선택해주세요."
        return;
    }

    Utils.confirm(SYSM550M_langMap.get("common.delete.msg"), function () { // "삭제하시겠습니까?"
        Utils.ajaxCall("/sysm/SYSM550DEL01", JSON.stringify({
            oprNotiNo: dataItem.oprNotiNo
        }), function (result) {
            Utils.alert(SYSM550M_langMap.get("success.common.delete"), function () { // "정상적으로 삭제되었습니다."
                SYSM550M_fnSearch();
                SYSM550M_fnNew();
            });
        });
    });
}


function SYSM550M_fnGridResize() {
    let screenHeight = $(window).height() - 210; // (헤더+푸터) 영역 높이 제외

    if (SYSM550M_grid[0].instance.element)
        SYSM550M_grid[0].instance.element.find('.k-grid-content').css('height', screenHeight - 470);
}