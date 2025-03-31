/***********************************************************************************************
 * Program Name : MCNS300M.js
 * Creator      : mhlee
 * Create Date  : 2022.05.02
 * Description  : My예약내역
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.02     mhlee            최초생성
 *
 ************************************************************************************************/

var MCNS300M_cmmCodeList, MCNS300M_grdMCNS300M, MCNS300MDataSource, MCNS300P_clickDataSet = {}, MCNS300M_selItem =[], MCNS300M_ToolTip;
$(document).ready(function () {
    MCNS300MDataSource = {
        transport: {
            read: function (MCNS300M_param) {
                if (Utils.isNull(MCNS300M_param.data)) {
                    Utils.ajaxCall(
                        "/mcns/MCNS300SEL01",
                        JSON.stringify(MCNS300M_param),
                        MCNS300M_fnResultReservationHistory,
                        window.kendo.ui.progress($("#grdMCNS300M"), true))
                } else {
                    window.kendo.ui.progress($("#grdMCNS300M"), false)
                }
            },
        },
        schema: {
            type: "json",
            model: {
                fields: {
                    rsvNo: {field: "rsvNo", type: "string"},
                    regDdHour: {field: "regDdHour", type: "date"},
                    rsvDd: {field: "rsvDd", type: "string"},
                    cntcTelNo: {field: "cntcTelNo", type: "string"},
                    lstCorcDdHour: {field: "lstCorcDdHour", type: "date"},
                    procStCd: {field: "procStCd", type: "string"},
                    cntcCustNm: {field: "cntcCustNm", type: "string"},
                    cntcCustId: {field: "cntcCustId", type: "string"},
                    rsvMemo: {field: "rsvMemo", type: "string"},
                    tenantId: {field: "tenantId", type: "string"},
                    telCnslHistSeq: {field: "telCnslHistSeq", type: "number"},
                    unfyCntcHistNo: {field: "unfyCntcHistNo", type: "number"},
                }
            }
        }
    }

    MCNS300M_grdMCNS300M = $("#grdMCNS300M").kendoGrid({
        dataSource: MCNS300MDataSource,
        autoBind: false,
        resizable: true,
        refresh: true,
        sortable: true,
        selectable: true,
        sort: function (e) {
            if (MCNS300M_grdMCNS300M.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        dataBinding: function () {
            record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        change: function(e) {
            let selectedRows = e.sender.select();
            MCNS300M_selItem = this.dataItem(selectedRows[0]);
        },
        pageable: {
            refresh: false
            , pageSizes: [25, 50, 100, 300, 500]
            , buttonCount: 10
            , pageSize: 25
        },
        columns: [
            { width: 40, field: "radio", title: "선택", excludeFromExport: true,
                template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',  editable: false  },
            {
                field: "rsvNo", title: "No", width: 30, template: "#= ++record #"
            }, {
                field: "regDdHour",
                title: MCNS300M_langMap.get("MCNS300M.grid.column.regDdHour"),
                type: "string", width: 140,
                template: '#=regDdHour == null ? "-" : kendo.toString(new Date(regDdHour), "yyyy-MM-dd HH:mm:ss")#'
            }, {
                field: "rsvDd",
                title: MCNS300M_langMap.get("MCNS300M.grid.column.rsvDd"),
                type: "string", width: 140,
                template: '#=rsvDd == null ? "-" : kendo.toString(new Date(rsvDd), "yyyy-MM-dd HH:mm:ss")#'
            }, {
                field: "cntcTelNo",
                title: MCNS300M_langMap.get("MCNS300M.grid.column.cntcTelNo"),
                type: "string", width: 100,
                attributes: {style: "text-align : left;"},
                // template: '#=cntcTelNo == null ? "-" :  maskingFunc.phone(cntcTelNo)#'
            }, {
                field: "lstCorcDdHour",
                title: MCNS300M_langMap.get("MCNS300M.grid.column.lstCorcDdHour"),
                type: "string", width: 140,
                template: '#=lstCorcDdHour == null ? "-" : kendo.toString(new Date(lstCorcDdHour), "yyyy-MM-dd HH:mm:ss")#'
            }, {
                field: "procStCd",
                title: MCNS300M_langMap.get("MCNS300M.grid.column.procStCd"),
                type: "string",
                width: 120,
                attributes: {"class": "k-text-left"},
                template: function (dataItem) {
                    return Utils.getComCdNm(MCNS300M_cmmCodeList, 'C0156', dataItem.procStCd);
                }
            }, {
                field: "cntcCustId",
                title: GLOBAL.session.user.dmnCd == '200'||GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? MCNS300M_langMap.get("MCNS300M.grid.column.patientId"):MCNS300M_langMap.get("MCNS300M.grid.column.cntcCustId"),
                width: 100,
                type: "string",
                attributes: {style: "text-align : left;"},
            }, {
                field: "cntcCustNmMsk",
                title: GLOBAL.session.user.dmnCd == '200'||GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? MCNS300M_langMap.get("MCNS300M.grid.column.patientNm"):MCNS300M_langMap.get("MCNS300M.grid.column.cntcCustNm"),
                type: "string",
                width: 100,
                attributes: {style: "text-align : left;", class: "tdTooltip"},
            }, {
                field: "rsvMemo",
                title: MCNS300M_langMap.get("MCNS300M.grid.column.rsvMemo"),
                type: "string",
                attributes: {style: "text-align : left;"},
            }, {
                field: "tenantId",
                hidden: true,
                type: "string"
            }, {
                field: "telCnslHistSeq",
                hidden: true,
                type: "string"
            }, {
                field: "unfyCntcHistNo",
                hidden: true,
                type: "string"
            },
            {
                field: "cntcTelNoNotMsk",
                hidden: true,
                type: "string"
            },
            {
                field: "cntcCustNm",
                hidden: true,
                type: "string"
            }
        ],
        noRecords: { template: `<div class="nodataMsg"><p>${MCNS_langMap.get("MCNS.grid.nodatafound")}</p></div>` },
    }).data("kendoGrid");

    MCNS300M_grdMCNS300M.tbody.on('dblclick', MCNS300M_onClick);

    MCNS300M_ToolTip = $("#grdMCNS300M").kendoTooltip({
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
            let dataItem = MCNS300M_grdMCNS300M.dataItem(e.target.closest("tr"));
            return dataItem.cntcCustNm;
        }
    }).data("kendoTooltip");

    MCNS300M_init();
});
function MCNS300M_init() {
    MCNS300M_resizeGrid();
    MCNS300M_fnSelectCmmCode();
    MCNS_initTenant(MCNS300M_grdMCNS300M,MCNS300M_fnSearchMyReservation);
}


$(window).resize(function(){
    MCNS300M_resizeGrid();
});

function MCNS300M_resizeGrid() {
    // (헤더 + 푸터)영역 높이 제외
    const screenHeight = $(window).height()-210;
    // (헤더 + 푸터 + 검색 )영역 높이 440
    MCNS300M_grdMCNS300M.element.find('.k-grid-content').css('height', screenHeight-270);
}

function MCNS300M_fnSelectCmmCode() {
    let MCNS300M_data = {
        "codeList": [
            {"mgntItemCd": "C0154"},
            {"mgntItemCd": "C0155"},
            {"mgntItemCd": "C0156"},
        ]
    };
    Utils.ajaxSyncCall(
        "/comm/COMM100SEL01",
        JSON.stringify(MCNS300M_data),
        MCNS300M_fnsetCmmCode)
}

function MCNS300M_fnsetCmmCode(data) {
    MCNS300M_cmmCodeList = JSON.parse(data.codeList);
    console.log(MCNS300M_cmmCodeList);
    Utils.setKendoComboBox(MCNS300M_cmmCodeList, "C0156", "#MCNS300M input[name=procStCd]", "", true);
}

function MCNS300M_fnResultReservationHistory(data) {

    window.kendo.ui.progress($("#grdMCNS300M"), false)

    let jsonDecode = JSON.parse(data.MCNS300M);
    if (jsonDecode.length === 0) {
        MCNS300M_grdMCNS300M.dataSource.data([]);
        return;
    }
    for (const obj of jsonDecode) {
        obj.rsvDd = ''.concat(
            obj.rsvDd, "T", obj.rsvHour, ":", obj.rsvPt);
    }
    MCNS300M_grdMCNS300M.dataSource.data(jsonDecode);
    MCNS300M_grdMCNS300M.dataSource.options.schema.data = jsonDecode;

    MCNS300M_grdMCNS300M.dataSource.page(1);
}

function MCNS300M_getParamValue() {
    return {
        tenantId: $('#MCNS300M_tenantId').val(),
        cnslrId: GLOBAL.session.user.usrId,
        cntcCustNm: $('#MCNS300M [name=cntcCustNm]').val(),
        cntcCustId: $('#MCNS300M [name=cntcCustId]').val(),
        procStCd: $('#MCNS300M [name=procStCd]').data('kendoComboBox').value(),
        srchDtFrom: MCNS_stringDateReg($('#MCNS300M_dateStart').val()),
        srchDtTo: MCNS_stringDateReg($('#MCNS300M_dateEnd').val()),
    }
}

function MCNS300M_fnSearchMyReservation() {
    let $tenantId = $('#MCNS300M_tenantId');
    let $tenantNm = $('#MCNS300M_tenantNm');
    MCNS300M_grdMCNS300M.dataSource.data([]);
    if(MCNS_checkTenant($tenantId,$tenantNm)) {
        const paramValue = MCNS300M_getParamValue();
        MCNS300MDataSource.transport.read(paramValue);
    }
}

function MCNS300M_onClick(e) {
    let clickRow = $(e.target).closest("tr");
    let rowDataItem = MCNS300M_grdMCNS300M.dataItem(clickRow);
    for (const col of MCNS300M_grdMCNS300M.columns) {
        let columnFieldName = col.field;
        MCNS300P_clickDataSet[columnFieldName] = rowDataItem[columnFieldName]
    }
    console.log(MCNS300P_clickDataSet);
    MCNS300M_fnPopup_MCNS310P();
}

function MCNS300M_fnPopup_MCNS310P() {
    Utils.setCallbackFunction("MCNS300M_fnSearchMyReservation", MCNS300M_fnSearchMyReservation);
    const data = {
        callbackKey :"MCNS300M_fnSearchMyReservation",
        procStCd : MCNS300P_clickDataSet.procStCd,
    }
    Utils.openPop(GLOBAL.contextPath + "/mcns/MCNS310P", "MCNS310P", 720, 400, data);
}


function MCNS300M_excelExport() {
    MCNS_excelExport(MCNS300M_grdMCNS300M, MCNS300M_langMap.get("MCNS300M.title"));
}

$('#MCNS300M input').on('change', function () { MCNS_inputValidation(this, 'MCNS300M'); });

function MCNS300M_fnCnslTab(){

    if(MCNS300M_selItem.length==0){
        Utils.alert(MCNS300M_langMap.get("MCNS300M.valid.saveMsg"))
        return;
    }

    TabUtils.openCnslMainTab(3,MCNS300M_selItem.unfyCntcHistNo,MCNS300M_langMap.get("CNSL.Comm.Not.Found.cnsl.Main"),"main");
}

$('#MCNS300M [name=cntcCustNm]').on("keyup",function(key){
    if(key.keyCode==13) {
        MCNS300M_fnSearchMyReservation();
    }
});

$('#MCNS300M [name=cntcCustId]').on("keyup",function(key){
    if(key.keyCode==13) {
        MCNS300M_fnSearchMyReservation();
    }
});
