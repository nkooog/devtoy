/***********************************************************************************************
 * Program Name : MCNS500M.js
 * Creator      : mhlee
 * Create Date  : 2022.06.15
 * Description  : My이관내역
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.06.15     mhlee            최초생성
 *
 ************************************************************************************************/

var MCNS500M_cmmCodeList, MCNS500M_grdMCNS500M, MCNS500MDataSource, MCNS500M_rawData, MCNS500M_gridBtnList, MCNS500M_ToolTip;
var MCNS500M_gridSelectedItems = [];

$(document).ready(function () {
    MCNS500MDataSource = {
        transport: {
            read: function (MCNS500M_param) {
                if (Utils.isNull(MCNS500M_param.data)) {
                    Utils.ajaxCall(
                        "/mcns/MCNS500SEL01",
                        JSON.stringify(MCNS500M_param),
                        MCNS500M_fnResultTransferHistory,
                        window.kendo.ui.progress($("#grdMCNS500M"), true),
                        window.kendo.ui.progress($("#grdMCNS500M"), false))
                } else {
                    window.kendo.ui.progress($("#grdMCNS500M"), false)
                }
            },
            update: function (MCNS500M_updateParam) {
                Utils.ajaxCall(
                    "/mcns/MCNS500UPT01",
                    JSON.stringify(MCNS500M_updateParam),
                    function (data) {
                        Utils.alert(data.msg, MCNS500M_fnSearchMyTransferHistory);
                    });
            },
            create: function (MCNS500M_insertParam) {
                Utils.ajaxCall(
                    "/mcns/MCNS500INS01",
                    JSON.stringify(MCNS500M_insertParam),
                    function (data) {
                        Utils.alert(data.msg, MCNS500M_fnSearchMyTransferHistory);
                    });
            },
        },
        schema: {
            type: "json",
            model: {
                fields: {
                    regDtm: {field: "regDtm", type: "date"},
                    cntcCustId: {field: "cntcCustId", type: "string"},
                    decCntcCustNm: {field: "decCntcCustNm", type: "string"},
                    trclmnId: {field: "trclmnId", type: "string"},
                    decTrclmnNm: {field: "decTrclmnNm", type: "string"},
                    trclmnOrgNm: {field: "trclmnOrgNm", type: "string"},
                    trclCtt: {field: "trclCtt", type: "string"},
                    trclStCd: {field: "trclStCd", type: "string"},
                    dspsrId: {field: "dspsrId", type: "string"},
                    decDspsrNm: {field: "decDspsrNm", type: "string"},
                    procDt: {field: "procDt", type: "date"},
                    procStCd: {field: "procStCd", type: "string"},
                    tenantId: {field: "tenantId", type: "string"},
                    trclSeq: {field: "trclSeq", type: "number"},
                    unfyCntcHistNo: {field: "unfyCntcHistNo", type: "number"},
                    otxtUnfyCntcHistNo: {field: "otxtUnfyCntcHistNo", type: "number"},
                }
            }
        }
    }

    MCNS500M_grdMCNS500M = $("#grdMCNS500M").kendoGrid({
        dataSource: MCNS500MDataSource,
        autoBind: false,
        resizable: true,
        scrollable: true,
        dataBound: function () {
            let grid = $("#grdMCNS500M").data('kendoGrid');
            let allRows = grid.items();
            $.each(allRows, function (index, value) {
                if (grid.dataItem(value).procStCd === '3' || grid.dataItem(value).procStCd === '5') {
                    $(value).find(".k-checkbox").attr('disabled', true);
                    // $(value).find(".k-checkbox").hide();
                }
            })
        },
        sortable: true,
        change: function (e) {
            let selectedRows = e.sender.select();
            MCNS500M_gridSelectedItems = [];
            selectedRows.each(function () {
                const dataItem = MCNS500M_grdMCNS500M.dataItem(this);
                if (dataItem.procStCd === "3" || dataItem.procStCd === "5") {
                    $(this).removeClass("k-state-selected");
                } else {
                    const findRawDataItem = MCNS500M_rawData.find((obj) => {
                        if (obj.unfyCntcHistNo === dataItem.unfyCntcHistNo && obj.trclSeq === dataItem.trclSeq) {
                            return true;
                        }
                    });
                    MCNS500M_gridSelectedItems.push(findRawDataItem);
                }
            });
            $("#MCNS500M [name=gridBtn]").prop("disabled", MCNS500M_gridSelectedItems.length === 0 );
            $('#MCNS500M .k-checkbox:disabled').prop('checked', false);

        },
        sort: function (e) {
            if (MCNS500M_grdMCNS500M.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        pageable: {
            refresh: true
            , pageSizes: [25, 50, 100, 500, 500]
            , buttonCount: 10
            , pageSize: 25
            ,
        },
        columns: [
            {
                width: 30, selectable: true,
                // headerTemplate: '<input class="k-checkbox allRowCheck" type="checkbox" onclick="MCNS500M_fnCheckAll(this);">',
            },
            {
                field: "regDtm",
                title: MCNS500M_langMap.get("MCNS500M.grid.regDtm"),
                width: 100,
                template: '#=regDtm == null ? "-" : kendo.toString(new Date(regDtm), "yyyy-MM-dd")#',
            },
            {
                field: "cntcCustId",
                title: GLOBAL.session.user.dmnCd == '200'||GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? MCNS500M_langMap.get("MCNS500M.grid.patientId"):MCNS500M_langMap.get("MCNS500M.grid.custId"),
                width: 100,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "cntcCustNmMsk",
                title: GLOBAL.session.user.dmnCd == '200'||GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? MCNS500M_langMap.get("MCNS500M.grid.patientNm"):MCNS500M_langMap.get("MCNS500M.grid.custNm"),
                width: 100,
                attributes: {style: "text-align : left;", class: "tdTooltip"},
            },
            {
                field: "trclmnId",
                title: MCNS500M_langMap.get("MCNS500M.grid.trclmnID"),
                width: 100,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "decTrclmnNm",
                title: MCNS500M_langMap.get("MCNS500M.grid.trclmnNm"),
                width: 100,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "trclmnOrgNm",
                title: MCNS500M_langMap.get("MCNS500M.grid.trclmnOrg"),
                width: 200,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "trclCtt",
                title: MCNS500M_langMap.get("MCNS500M.grid.trclCtt"),
                width: "auto",
                attributes: {style: "text-align : left;"},
            },

            {
                field: "trclStCd",
                title: MCNS500M_langMap.get("MCNS500M.grid.trclStCd"),
                width: 80,
                template: '#if (trclStCd) {# #=Utils.getComCdNm(MCNS500M_cmmCodeList, "C0233", trclStCd)# #}#',
            },
            {
                field: "dspsrId",
                title: MCNS500M_langMap.get("MCNS500M.grid.dspsrId"),
                width: 100,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "decDspsrNm",
                title: MCNS500M_langMap.get("MCNS500M.grid.dspsrNm"),
                width: 100,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "procDt",
                title: MCNS500M_langMap.get("MCNS500M.grid.dspsrDate"),
                width: 100,
                template: '#=procDt == null ? "-" : kendo.toString(new Date(procDt), "yyyy-MM-dd")#',
            },
            {
                field: "procStCd",
                title: MCNS500M_langMap.get("MCNS.grid.procStCd.500"),
                width: 100,
                template: '#if (procStCd) {# #=Utils.getComCdNm(MCNS500M_cmmCodeList, "C0157", procStCd)# #}#',
            },
            {
                field: "tenantId",
                hidden: true,
            }, {
                field: "trclSeq",
                hidden: true,
            }, {
                field: "unfyCntcHistNo",
                hidden: true,
            }, {
                field: "otxtUnfyCntcHistNo",
                hidden: true,
            },
        ],
        selectable: "multiple",
        noRecords: {template: `<div class="nodataMsg"><p>${MCNS_langMap.get("MCNS.grid.nodatafound")}</p></div>`},
    }).data("kendoGrid");

    MCNS500M_grdMCNS500M.tbody.on('dblclick', MCNS500M_onClick);
    MCNS500M_ToolTip = $("#grdMCNS500M").kendoTooltip({
        filter: ".tdTooltip",
        autoHide:true,
        //showOn: "mouseenter",
        show: function(e){
            if(this.content.text().length>0){
                this.content.parent().css("visibility", "visible");
            }else{
                this.content.parent().css("visibility", "hidden");
            }
        },
        hide: function(e){
            this.content.parent().css('visibility', 'hidden');
        },
        content: function(e){
            let dataItem = MCNS500M_grdMCNS500M.dataItem(e.target.closest("tr"));
            return dataItem.cntcCustNm;
        }
    }).data("kendoTooltip");
    MCNS500M_init();
});

function MCNS500M_handleEnterKeyPress(e) {
    if (e.keyCode === 13) {
        MCNS500M_fnSearchMyTransferHistory();
    }
}

function MCNS500M_init() {
    MCNS500M_resizeGrid();
    MCNS500M_fnSelectCmmCode();
    MCNS500M_initSrchDateMultiSelect();
    MCNS_initTenant(MCNS500M_grdMCNS500M,MCNS500M_fnSearchMyTransferHistory);
}

$(window).resize(function () {
    MCNS500M_resizeGrid();
});

function MCNS500M_initSrchDateMultiSelect() {
    const MCNS500M_srchDateMultiSelect = [
        // {text: MCNS500M_langMap.get("MCNS.input.regDtm"), value: "1"},
        {text: MCNS500M_langMap.get("MCNS.input.trclDt"), value: "2"},
        {text: MCNS500M_langMap.get("MCNS.input.procDt"), value: "3"},
    ];
    Utils.setKendoMultiSelectCustom(MCNS500M_srchDateMultiSelect, "#srchDateType_MCNS500M",
        "text", "value", false, "2");
}

function MCNS500M_resizeGrid() {
    // (헤더 + 푸터)영역 높이 제외
    const screenHeight = $(window).height() - 210;
    // (헤더 + 푸터 + 검색 )영역 높이 440
    MCNS500M_grdMCNS500M.element.find('.k-grid-content').css('height', screenHeight - 270);
}

function MCNS500M_fnSelectCmmCode() {
    const MCNS500M_data = {
        "codeList": [
            {"mgntItemCd": "C0157"},  // 처리상태코드 (1.미처리, 2.처리중, 3.처리완료, 4.포기)
            {"mgntItemCd": "C0233"},  // 이관상태코드 (1.이관 , 2.재이관)
        ]
    };
    Utils.ajaxSyncCall(
        "/comm/COMM100SEL01", JSON.stringify(MCNS500M_data), MCNS500M_fnsetCmmCode)
}

function MCNS500M_fnsetCmmCode(data) {
    MCNS500M_cmmCodeList = JSON.parse(data.codeList);
    Utils.setKendoComboBox(MCNS500M_cmmCodeList, "C0157", "#MCNS500M input[name=procStCd]", "", true);
}

function MCNS500M_fnResultTransferHistory(data) {
    MCNS500M_rawData = JSON.parse(data.MCNS500M);
    if (MCNS500M_rawData.length === 0) {
        MCNS500M_grdMCNS500M.dataSource.data([]);
        return;
    }

    MCNS500M_grdMCNS500M.dataSource.data(MCNS500M_rawData);
    MCNS500M_grdMCNS500M.dataSource.options.schema.data = MCNS500M_rawData;

    MCNS500M_grdMCNS500M.dataSource.page(1);
}

function MCNS500M_getParamValue() {
    return {
        tenantId: $('#MCNS500M_tenantId').val(),
        usrId: GLOBAL.session.user.usrId,  // TODO 테스트 종료 후 변경 필요
        cntcCustNm: $('#MCNS500M [name=cntcCustNm]').val(),
        cntcCustId: $('#MCNS500M [name=cntcCustId]').val(),
        trclmnNm: $('#MCNS500M [name=trclmnNm]').val(),
        dspsrNm: $('#MCNS500M [name=dspsrNm]').val(),
        procStCd: $('#MCNS500M [name=procStCd]').data('kendoComboBox').value(),
        srchDtFrom: MCNS_stringDateReg($('#MCNS500M_dateStart').val()),
        srchDtTo: MCNS_stringDateReg($('#MCNS500M_dateEnd').val()),
        srchCondList: $('#MCNS500M #srchDateType_MCNS500M').data("kendoMultiSelect").value(),
        usrGrd : GLOBAL.session.user.usrGrd,
        // trclmnList :CMMN_USER_FIND_MULTI['MCNS500M'].getValue('Trclmn'),
        // dspsrList : CMMN_USER_FIND_MULTI['MCNS500M'].getValue('dspsr') ,
    }
}

function MCNS500M_fnSearchMyTransferHistory() {
    const $tenantId = $('#MCNS500M_tenantId');
    const $tenantNm = $('#MCNS500M_tenantNm');
    MCNS500M_grdMCNS500M.dataSource.data([]);
    MCNS500M_grdMCNS500M.clearSelection();
    if (MCNS_checkTenant($tenantId, $tenantNm)) {
        const param = MCNS500M_getParamValue();
        MCNS500MDataSource.transport.read(param);
    }
}

function MCNS500M_onClick(e) {
    console.log(e.target.nodeName);
    if (e.target.nodeName !== "INPUT") {
        let clickRow = $(e.target).closest("tr");
        let rowDataItem = MCNS500M_grdMCNS500M.dataItem(clickRow);
        let MCNS500M_clickDataSet = {
            tenantId: rowDataItem.tenantId,
            unfyCntcHistNo: rowDataItem.unfyCntcHistNo,
            cnslHistSeq: rowDataItem.cnslHistSeq,
            trclSeq: rowDataItem.trclSeq,
        }
        MCNS500M_fnPopup_MCNS510P(MCNS500M_clickDataSet);
    }
}

function MCNS500M_fnPopup_MCNS510P(data) {
    Utils.openPop(GLOBAL.contextPath + "/mcns/MCNS510P", "MCNS510P", 1000, 700, data);
}

$("#MCNS500M [name=gridBtn]").on('click', function (e) {
    const getValue =$(this).val();
    const getTitle = $(this).text();
    Utils.alert(`${MCNS500M_langMap.get("MCNS500M.check.ProcessStart")} ${getTitle} ${MCNS500M_langMap.get("MCNS500M.check.ProcessEnd")}`, () => {
        if (getValue === '2') { // 분배 - 할당,재할당은 처리자 지정필수;
            if (MCNS500M_gridSelectedItems.length > 1) {
                Utils.alert(MCNS500M_langMap.get("MCNS500M.valid.onlyOne"));
                return;
            }
            MCNS500M_transferProcess(getValue)
        } else {
            MCNS500M_updateData("", getValue)
        }
    })
})

function MCNS500M_transferProcess(getValue) {
    if (MCNS500M_gridSelectedItems.find(x => x.dspsrId)) {
        Utils.alert(MCNS500M_langMap.get("MCNS500M.msg.checkTransfer") + '<br>' + MCNS500M_langMap.get("MCNS500M.msg.reTransfer"),
            () => {
                MCNS500M_findTransferUsr();
            })
    }else{
        Utils.setCallbackFunction("MCNS500M_fnSYSM212PCallback", function (data) {
            MCNS500M_updateData(...data, getValue);
        });
        MCNS500M_findTransferUsr();
    }
}

function MCNS500M_findTransferUsr() {
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM212P", "SYSM212P", 500, 810, {callbackKey: "MCNS500M_fnSYSM212PCallback", isMulti:"N"})
}


function MCNS500M_fnSearchUser(name) {
    if (name.nodeName === 'BUTTON') {
        name = name.previousElementSibling.name;
    }
    const targetInput = document.getElementsByName(name);
    Utils.setCallbackFunction("MCNS500M_fnSYSM214PCallBack", function (usrInfo) {
        $(targetInput).val(usrInfo.decUsrNm);
        $(targetInput).data(name, usrInfo.usrId);
    })
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM214P", "SYSM214P", 900, 600, {callbackKey: "MCNS500M_fnSYSM214PCallBack"})
}

function MCNS500M_updateData(data, value) {
    // 완료 = 3, 포기 = 4
    const updateObj = MCNS500M_gridSelectedItems.map((obj) => {
        return {
            tenantId: obj.tenantId,
            unfyCntcHistNo: obj.unfyCntcHistNo,
            cnslHistSeq: obj.cnslHistSeq,
            trclSeq: obj.trclSeq,
            procStCd: value,
            trclStCd: Utils.isNotNull(data) ? "2" : "",
            dspsrId: Utils.isNotNull(data) ? data.usrId : "",
            dspsrOrgCd: Utils.isNotNull(data) ? data.orgCd : "",
        }
    });
    // console.log(updateObj);
    // MCNS500MDataSource.transport.update(updateObj);
    if (Utils.isNotNull(data)) {
        return MCNS500MDataSource.transport.create(updateObj);
    } else {
        return MCNS500MDataSource.transport.update(updateObj);
    }
}

$("#MCNS500M [name=excelExport]").on('click', (function () {
    MCNS_excelExport(MCNS500M_grdMCNS500M, MCNS500M_langMap.get("MCNS500M.title"));
}))
$('#MCNS500M input').on('change', function () {
    MCNS_inputValidation(this, 'MCNS500M');
});
$('#MCNS500M .MCNS500M_userInfo').on('keydown', function () {
    MCNS500M_fnSearchUser(this.name);
    this.blur();
})

function MCNS500M_fnCheckAll(e) {
    const currentChecked = $(e).prop('checked');
    let data = MCNS500M_grdMCNS500M.dataSource.data();
    // let deselectedRows = [];
    const length = data.length;

    for (let i = 0; i < length; i++) {
        const currentDataItem = data[i];
        const row = MCNS500M_grdMCNS500M.tbody.find("tr[data-uid='" + currentDataItem.uid + "']");
        if (currentDataItem.procStCd === "3" || currentDataItem.procStCd === "5") {
            $(row).find(".k-checkbox").attr("checked", false);
        } else {
            $(row).find(".k-checkbox").attr("checked", currentChecked);
        }
    }

    // $.each(deselectedRows, function (index, row) {
    //     setTimeout(function () {
    //         let currRowCheckbox = $(row).find(".k-checkbox")
    //         $(currRowCheckbox).attr("checked", false);
    //     });
    // });
}

function MCNS500M_fnCnslTab(){

    let MCNS500M_selData = [];
    $('#grdMCNS500M .k-checkbox').each(function (idx, row) {
        if($(row).attr('aria-checked')=='true'){
            let	MCNS500M_tr		= $(row).closest('tr');
            let	MCNS500M_item	= Object.assign({}, MCNS500M_grdMCNS500M.dataItem(MCNS500M_tr));

            MCNS500M_selData.push(MCNS500M_item);
        }
    });

    if(MCNS500M_selData.length>1){
        Utils.alert(MCNS500M_langMap.get("MCNS500M.valid.onlyOne"));
        return;
    }else if(MCNS500M_selData.length==0){
        Utils.alert(MCNS500M_langMap.get("MCNS500M.valid.noSelect"));
        return;
    }

    TabUtils.openCnslMainTab(4,MCNS500M_selData[0].trclSeq,MCNS500M_langMap.get("CNSL.Comm.Not.Found.cnsl.Main"),"main");
}


$('#MCNS500M [name=cntcCustNm]').on("keyup",function(key){
    if(key.keyCode==13) {
        MCNS500M_fnSearchMyTransferHistory();
    }
});

$('#MCNS500M [name=cntcCustId]').on("keyup",function(key){
    if(key.keyCode==13) {
        MCNS500M_fnSearchMyTransferHistory();
    }
});
