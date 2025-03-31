/***********************************************************************************************
 * Program Name : MCNS200M.js
 * Creator      : mhlee
 * Create Date  : 2022.04.08
 * Description  : My콜백내역
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.08     mhlee            최초생성
 *
 ************************************************************************************************/

var MCNS200M_cmmCodeList, MCNS200M_grdMCNS200M, MCNS200MDataSource,MCNS200M_selItem=[], MCNS200M_ToolTip ;
var MCNS200M_sttTxt;
$(document).ready(function () {
    MCNS200MDataSource = {
        transport: {
            read: function (MCNS200M_param) {
                if (Utils.isNull(MCNS200M_param.data)) {
                    Utils.ajaxCall(
                        "/mcns/MCNS200SEL01",
                        JSON.stringify(MCNS200M_param),
                        MCNS200M_fnResultCaBackHistory,
                        window.kendo.ui.progress($("#grdMCNS200M"), true)
                    )
                } else {
                    window.kendo.ui.progress($("#grdMCNS200M"), false)
                }
            },
        },
        schema: {
            type: "json",
            model: {
                fields: {
                    cabackAcpnNo: {field: "cabackAcpnNo", type: "string"},
                    cabackRegDtm: {field: "cabackRegDtm", type: "string"},
                    cabackAltmDtm: {field: "cabackAltmDtm", type: "string"},
                    cnslrId: {field: "cnslrId", type: "string"},
                    cabackReqTelno: {field: "cabackReqTelno", type: "string"},
                    cabackProcStCd: {field: "cabackProcStCd", type: "string"},
                    webCabackCustNm: {field: "webCabackCustNm", type: "string"},
                    cntcCustId: {field: "cntcCustId", type: "string"},
                    unfyCntcHistNo: {field: "unfyCntcHistNo", type: "number"},
                }
            }
        }
    }

    MCNS200M_grdMCNS200M = $("#grdMCNS200M").kendoGrid({
        dataSource: MCNS200MDataSource,
        autoBind: false,
        resizable: false,
        refresh: true,
        scrollable: true,
        selectable: true,
        sortable: false,
        sort: function (e) {
            if (MCNS200M_grdMCNS200M.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        change: function(e) {
            let selectedRows = e.sender.select();
            MCNS200M_selItem = this.dataItem(selectedRows[0]);
        },
        pageable: {
            refresh: false
            , pageSizes: [25, 50, 100, 200, 500]
            , buttonCount: 10
            , pageSize: 25
            ,
        },
        columns: [
            { width: 40, field: "radio", title: "선택", excludeFromExport: true,
                template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',  editable: false  },
            {
                field: "cabackAcpnNo", title: "No", width: 60,
            },
            {
                field: "cabackRegDtm",
                title: MCNS200M_langMap.get("MCNS200M.grid.column.regDtm"),
                type: "string", width: 160,
                // template: '#=loadDt == null ? "-" : kendo.toString(new Date(loadDt), "yyyy-MM-dd")#'
            }, {
                field: "cabackAltmDtm",
                title: MCNS200M_langMap.get("MCNS200M.grid.column.altmDtm"),
                type: "string", width: 160,
                // template: '#=altmDtm == null ? "-" : kendo.toString(new Date(altmDtm), "yyyy-MM-dd HH:mm")#'
            },{
                field: "cntcCpltDtm",
                title: MCNS200M_langMap.get("MCNS200M.grid.column.cpltDtm"),
                type: "string", width: 160,
                // template: '#=cntcCpltDtm == null ? "-" : kendo.toString(new Date(cntcCpltDtm), "yyyy-MM-dd HH:mm")#'
            },
            {
                field: "cabackReqTelno",
                title: MCNS200M_langMap.get("MCNS200M.grid.column.cabackReqTelno"),
                type: "string", width: 100,
                attributes: {style: "text-align : left;"},
                // template: function (dataItem) {
                //     // TODO 마스킹 변경
                //     return maskingFunc.phone(dataItem.cabackReqTelno);
                // }
            },
            {
                field: "vceCabackYn",
                title: MCNS200M_langMap.get("MCNS200M.grid.column.vceCabackYn"),
                type: "string", width: 100
            },
            {
                field: "cabackProcStCd",
                title: MCNS200M_langMap.get("MCNS200M.grid.column.cabackStCd"),
                type: "string",
                width: 100,
                template: function (dataItem) {
                    return Utils.getComCdNm(MCNS200M_cmmCodeList, 'C0119', dataItem.cabackProcStCd);
                }
            },{
                field: "cntcCustNmMsk",
                title: GLOBAL.session.user.dmnCd == '200'||GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? MCNS200M_langMap.get("MCNS200M.grid.column.patientNm"):MCNS200M_langMap.get("MCNS200M.grid.column.cntcCustNm"),
                type: "string",
                width: 100,
                attributes: {style: "text-align : left;", class: "tdTooltip"},
            },
            {
                field: "cnslrId",
                title: MCNS200M_langMap.get("MCNS200M.grid.column.cnslrId"),
                type: "string",
                width: 100,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "cnslrNm",
                title: MCNS200M_langMap.get("MCNS200M.grid.column.cnslrNm"),
                type: "string",
                width: 100,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "sttTxt",
                title: MCNS200M_langMap.get("MCNS200M.grid.column.reqCtt"),
                type: "string",
                attributes: {style: "text-align : left;"},
            },

            {
                field: "cnslrId",
                title: MCNS200M_langMap.get("MCNS200M.grid.column.cntcCustId"),
                type: "string",
                hidden: true
            },
            {
                field: "unfyCntcHistNo",
                hidden: true,
            },

        ],
        noRecords: { template: `<div class="nodataMsg"><p>${MCNS_langMap.get("MCNS.grid.nodatafound")}</p></div>` },
    }).data("kendoGrid");
    MCNS200M_grdMCNS200M.tbody.on('dblclick', MCNS200M_onClick);

    MCNS200M_ToolTip = $("#grdMCNS200M").kendoTooltip({
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
            let dataItem = MCNS200M_grdMCNS200M.dataItem(e.target.closest("tr"));
            return dataItem.cntcCustNm;
        }
    }).data("kendoTooltip");

    MCNS200M_init();
});
function MCNS200M_init() {
    MCNS200M_resizeGrid();
    MCNS200M_fnSelectCmmCode();
    MCNS_initTenant(MCNS200M_grdMCNS200M,MCNS200M_fnSearchMyCaback);
}

$(window).resize(function () {
    MCNS200M_resizeGrid();
});

function MCNS200M_resizeGrid() {
    // (헤더 + 푸터)영역 높이 제외
    const screenHeight = $(window).height()-210;
    // (헤더 + 푸터 + 검색 )영역 높이 440
    MCNS200M_grdMCNS200M.element.find('.k-grid-content').css('height', screenHeight-230);
}

function MCNS200M_fnSelectCmmCode() {
    let MCNS200M_data = {
        "codeList": [
            {"mgntItemCd": "C0117"},
            {"mgntItemCd": "C0118"},
            {"mgntItemCd": "C0119"},
            {"mgntItemCd": "C0120"},
        ]
    };
    Utils.ajaxSyncCall(
        "/comm/COMM100SEL01",
        JSON.stringify(MCNS200M_data),
        MCNS200M_fnsetCmmCode)
}

function MCNS200M_fnsetCmmCode(data) {
    MCNS200M_cmmCodeList = JSON.parse(data.codeList);
    Utils.setKendoComboBox(MCNS200M_cmmCodeList, "C0119", "#MCNS200M input[name=cabackProcStCd]", "", true);
}

function MCNS200M_fnResultCaBackHistory(data) {
    window.kendo.ui.progress($("#grdMCNS200M"), false)
    let jsonDecode = JSON.parse(data.MCNS200M);
    if (jsonDecode.length === 0) {
        /*Utils.alert(MCNS200M_langMap.get("fail.common.select"));
        MCNS200M_grdMCNS200M.dataSource.data([]);
        return;*/

        return MCNS200M_grdMCNS200M.dataSource.data([]);
    }
    MCNS200M_grdMCNS200M.dataSource.data(jsonDecode);
    MCNS200M_grdMCNS200M.dataSource.options.schema.data = jsonDecode;

    MCNS200M_grdMCNS200M.dataSource.page(1);
}

function MCNS200M_getParamValue() {
    let tmpCabackStCd = $('#MCNS200M [name=cabackProcStCd]').data('kendoComboBox').value();
    let cabackProcStCd = tmpCabackStCd === 0 ? "" : String(tmpCabackStCd);
    let webCabackCustNm = $('#MCNS200M [name=webCabackCustNm]').val();
    return {
        tenantId: $('#MCNS200M_tenantId').val(),
        cnslrId: GLOBAL.session.user.usrId,
        webCabackCustNm: webCabackCustNm,
        cabackProcStCd: cabackProcStCd,
        srchDtFrom: $('#MCNS200M_dateStart').val(),
        srchDtTo: $('#MCNS200M_dateEnd').val(),
    }
}

function MCNS200M_fnSearchMyCaback() {
    let $tenantId = $('#MCNS200M_tenantId');
    let $tenantNm = $('#MCNS200M_tenantNm');
    MCNS200M_grdMCNS200M.dataSource.data([]);
    if(MCNS_checkTenant($tenantId,$tenantNm)) {
        const paramValue = MCNS200M_getParamValue();
        MCNS200MDataSource.transport.read(paramValue);
    }
}

function MCNS200M_onClick(e) {
    let dataItem = MCNS200M_grdMCNS200M.dataItem($(e.target).closest("tr"));

    let MCNS210P_param = {
        unfyCntcHistNo: dataItem.unfyCntcHistNo,
        cabackAcpnNo: dataItem.cabackAcpnNo,
        tenantId: dataItem.tenantId,
        cnslrId: dataItem.cnslrId,
        cnslrOrgCd: dataItem.cnslrOrgCd,
    }

    MCNS200M_sttTxt = dataItem.sttTxt;

    MCNS200M_fnPopup_MCNS210P(MCNS210P_param);
}

function MCNS200M_fnPopup_MCNS210P(MCNS210P_param) {
    Utils.setCallbackFunction("MCNS200M_fnSearchMyCaback", MCNS200M_fnSearchMyCaback);
    MCNS210P_param.callbackKey = "MCNS200M_fnSearchMyCaback"
    Utils.openPop(GLOBAL.contextPath + "/mcns/MCNS210P", "MCNS210P", 860, 650, MCNS210P_param);
}

$("#MCNS200M [name=excelExport]").on('click', (function () {
    MCNS_excelExport(MCNS200M_grdMCNS200M, MCNS200M_langMap.get("MCNS200M.title"));
}))

$('#MCNS200M input').on('change', function () { MCNS_inputValidation(this, 'MCNS200M'); });


function MCNS200M_fnCnslTab(){

    if(MCNS200M_selItem.length==0){
        Utils.alert(MCNS200M_langMap.get("MCNS200M.valid.saveMsg"))
        return;
    }

    TabUtils.openCnslMainTab(2,MCNS200M_selItem.cabackAcpnNo,MCNS500M_langMap.get("CNSL.Comm.Not.Found.cnsl.Main"),"main");
}

$('#MCNS200M [name=webCabackCustNm]').on("keyup",function(key){
    if(key.keyCode==13) {
        MCNS200M_fnSearchMyCaback();
    }
});
