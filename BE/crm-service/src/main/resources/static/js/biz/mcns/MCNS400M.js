/***********************************************************************************************
 * Program Name : MCNS400M.js
 * Creator      : mhlee
 * Create Date  : 2022.06.15
 * Description  : My캠페인타겟
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.06.15     mhlee            최초생성
 *
 ************************************************************************************************/

var MCNS400M_cmmCodeList, MCNS400M_grdMCNS400M, MCNS400MDataSource;
$(document).ready(function () {

    MCNS400MDataSource = {
        transport: {
            read: function (MCNS400M_param) {
                if (Utils.isNull(MCNS400M_param.data)) {
                    Utils.ajaxCall(
                        "/mcns/MCNS400SEL01",
                        JSON.stringify(MCNS400M_param),
                        MCNS400M_fnResultCmpTargetList,
                        window.kendo.ui.progress($("#grdMCNS400M"), true),
                        window.kendo.ui.progress($("#grdMCNS400M"), false))
                } else {
                    window.kendo.ui.progress($("#grdMCNS400M"), false)
                }
            },
        },
        schema: {
            type: "json",
            model: {
                fields: {
                    cmpNo: {field: "cmpNo", type: "number"},
                    cmpNm: {field: "cmpNm", type: "string"},
                    decCustNm: {field: "decCustNm", type: "string"},
                    custId: {field: "custId", type: "string"},
                    decCustTelNo: {field: "decCustTelNo", type: "string"},
                    procStCd: {field: "procStCd", type: "string"},
                    cnntFailRsn: {field: "failRsn", type: "string"},
                    tenantId: {field: "tenantId", type: "string"},
                }
            }
        }
    }

    MCNS400M_grdMCNS400M = $("#grdMCNS400M").kendoGrid({
        dataSource: MCNS400MDataSource,
        autoBind: false,
        resizable: true,
        refresh: true,
        scrollable: true,
        sortable: true,
        sort: function (e) {
            if (MCNS400M_grdMCNS400M.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        pageable: {
            refresh: true
            , pageSizes: [25, 50, 100, 400, 500]
            , buttonCount: 10
            , pageSize: 25
        },
        columns: [
            {
                field: "cmpNo", title: MCNS400M_langMap.get("MCNS400M.grid.column.cmpNo"), width: 100,
            }, {
                field: "cmpNm",
                title: MCNS400M_langMap.get("MCNS400M.grid.column.cmpNm"),
                type: "string", width: 200,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "custId",
                title: MCNS400M_langMap.get("MCNS.cntcCustId"),
                type: "string", width: 100,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "decCustNm",
                title: MCNS400M_langMap.get("MCNS.cntcCustNm"),
                type: "string", width: 100,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "decCustTelNo",
                title: MCNS400M_langMap.get("MCNS.cntcTelNo"),
                type: "string", width: 140,
                // template: function (dataItem) {
                //     return maskingFunc.phone(dataItem.decCustTelNo);
                // }
            }, {
                field: "procStCd",
                title: MCNS400M_langMap.get("MCNS.procStCd"),
                type: "string",
                width: 100,
                template: function (dataItem) {
                    return Utils.getComCdNm(MCNS400M_cmmCodeList, 'C0230', dataItem.procStCd);
                }
            },
            {
                field: "altmDvCd",
                title: MCNS400M_langMap.get("MCNS400M.grid.column.altmDvCd"),
                type: "string",
                width: 100,
                template: function (dataItem) {
                    return Utils.getComCdNm(MCNS400M_cmmCodeList, 'C0120', dataItem.procStCd);
                }
            },
            {
                field: "altmProcDtm",
                title: MCNS400M_langMap.get("MCNS400M.grid.column.altmProcDtm"),
                type: "string",
                width: 140,
                template : '#=kendo.format("{0:yyyy-MM-dd HH:mm:ss}",new Date(altmProcDtm))#'
            },
            {
                field: "cnslrId",
                title: MCNS400M_langMap.get("MCNS.cnslrId"),
                type: "string",
                width: 80
            },
            {
                field: "cnslrNm",
                title: MCNS400M_langMap.get("MCNS.cnslrNm"),
                type: "string",
                width: 80,
            },
            {
                field: "lstProcStCd",
                title: MCNS400M_langMap.get("MCNS400M.grid.column.lstProcStCd"),
                type: "string",
                width: 100,
                template: function (dataItem) {
                    return Utils.getComCdNm(MCNS400M_cmmCodeList, 'C1220', dataItem.procStCd);
                }
            },
            {
                field: "tenantId",
                hidden: true,
                type: "string"
            },
        ],
        noRecords: { template: `<div class="nodataMsg"><p>${MCNS_langMap.get("MCNS.grid.nodatafound")}</p></div>` },
    }).data("kendoGrid");

    MCNS400M_grdMCNS400M.tbody.on('click', MCNS400M_onClick);
    MCNS400M_init();
});
function MCNS400M_init() {
    MCNS400M_resizeGrid();
    MCNS400M_fnSelectCmmCode();
    MCNS_initTenant(MCNS400M_grdMCNS400M,MCNS400M_fnSearchCmpTarget);
}

$(window).resize(function(){
    MCNS400M_resizeGrid();
});

function MCNS400M_resizeGrid() {
    const screenHeight = $(window).height()-210;     //   (헤더+ 푸터 ) 영역 높이 제외
    MCNS400M_grdMCNS400M.element.find('.k-grid-content').css('height', screenHeight-200);   //   (헤더+ 푸터+ 검색 )영역 높이 440
}
function MCNS400M_fnSelectCmmCode() {
    let MCNS400M_data = {
        "codeList": [
            {"mgntItemCd": "C0230"},
            {"mgntItemCd": "C0120"},
            {"mgntItemCd": "C1220"},
        ]
    };

    Utils.ajaxSyncCall(
        "/comm/COMM100SEL01",
        JSON.stringify(MCNS400M_data),
        MCNS400M_fnsetCmmCode)
}

function MCNS400M_fnsetCmmCode(data) {
    MCNS400M_cmmCodeList = JSON.parse(data.codeList);
    console.log(MCNS400M_cmmCodeList);
    Utils.setKendoComboBox(MCNS400M_cmmCodeList, "C0230", "#MCNS400M input[name=procStCd]", "", true);
}

function MCNS400M_fnResultCmpTargetList(data) {
    let jsonDecode = JSON.parse(data.MCNS400M);
    console.log(jsonDecode)
    if (jsonDecode.length === 0) {
        MCNS400M_grdMCNS400M.dataSource.data([]);
        return;
    } else {
        Utils.alert(data.msg); //테스트용
    }
    MCNS400M_grdMCNS400M.dataSource.data(jsonDecode);
    MCNS400M_grdMCNS400M.dataSource.options.schema.data = jsonDecode;
}

function MCNS400M_getParamValue() {
    let procStCd = $('#MCNS400M [name=procStCd]').data('kendoComboBox').value();
    return {
        tenantId: $('#MCNS400M_tenantId').val(),
        cnslrId: GLOBAL.session.user.usrId,
        srchCustNm: $('#MCNS400M [name=cntcCustNm]').val(),
        srchCustId: $('#MCNS400M [name=cntcCustId]').val(),
        procStCd: procStCd === 0 ? "" : procStCd,
    }
}

function MCNS400M_fnSearchCmpTarget() {
    if (Utils.isNull($('#MCNS400M_tenantId').val())) {
        return Utils.alert(MCNS_langMap.get("MCNS.tenantId.required.msg"));
    }
    MCNS400M_grdMCNS400M.dataSource.data([]);
    MCNS400M_grdMCNS400M.clearSelection();
    let paramValue = MCNS400M_getParamValue();
    MCNS400MDataSource.transport.read(paramValue);
}

function MCNS400M_onClick(e) {
    let clickRow = $(e.target).closest("tr");
    let rowDataItem = MCNS400M_grdMCNS400M.dataItem(clickRow);
    let MCNS400M_clickDataSet = {
        tenantId: rowDataItem.tenantId,
        cmpNo: rowDataItem.cmpNo,
        custNo: rowDataItem.custNo,
    }
    console.log(MCNS400M_clickDataSet);
    MCNS400M_fnPopup_MCNS410P(MCNS400M_clickDataSet);
}

function MCNS400M_fnPopup_MCNS410P(data) {
    Utils.openPop(GLOBAL.contextPath + "/mcns/MCNS410P", "MCNS410P", 1000, 500, data);
}

$("#MCNS400M [name=excelExport]").on('click', (function () {
    MCNS_excelExport(MCNS400M_grdMCNS400M, "My켐페인타겟");
}))

$('#MCNS400M input').on('propertychange change keyup paste input', function () {
    MCNS_inputValidation(this, 'MCNS400M');

});