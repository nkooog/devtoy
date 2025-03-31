/***********************************************************************************************
 * Program Name : CNSL410M.js
 * Creator      : bykim
 * Create Date  : 2023.01.10
 * Description  : 콜백내역
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.01.10     bykim            최초생성
 ************************************************************************************************/

var CNSL410M_cmmCodeList, CNSL410M_grdCNSL410M, CNSL410MDataSource,CNSL410M_selItem =[], CNSL410M_ToolTip;
var CNSL410M_sttTxt;
$(document).ready(function () {
    CNSL410MDataSource = {
        transport: {
            read: function (CNSL410M_param) {
                if (Utils.isNull(CNSL410M_param.data)) {
                    Utils.ajaxCall(
                        "/cnsl/CNSL410SEL01",
                        JSON.stringify(CNSL410M_param),
                        CNSL410M_fnResultCaBackHistory,
                        window.kendo.ui.progress($("#grdCNSL410M"), true),
                        )

                } else {
                    window.kendo.ui.progress($("#grdCNSL410M"), false)
                }
            },
        },
        schema: {
            type: "json",
            model: {
                fields: {
                    cabackAcpnNo: {field: "cabackAcpnNo", type: "string"},
                    cabackRegDtm: {field: "cabackRegDtm", type: "date"},
                    cabackAltmDtm: {field: "cabackAltmDtm", type: "date"},
                    cnslrId: {field: "cnslrId", type: "string"},
                    cabackReqTelno: {field: "cabackReqTelno", type: "string"},
                    cabackProcStCd: {field: "cabackProcStCd", type: "string"},
                    webCabackCustNm: {field: "webCabackCustNm", type: "string"},
                    unfyCntcHistNo: {field: "unfyCntcHistNo", type: "number"},
                    cntcCpltDtm: {field: "cntcCpltDtm", type: "date"},
                }
            }
        }
    }

    CNSL410M_grdCNSL410M = $("#grdCNSL410M").kendoGrid({
        dataSource: CNSL410MDataSource,
        autoBind: false,
        resizable: true,
        refresh: true,
        scrollable: true,
        selectable: true,
        sortable: true,
        change: function(e) {
            let selectedRows = e.sender.select();
            CNSL410M_selItem = this.dataItem(selectedRows[0]);
        },
        sort: function (e) {
            if (CNSL410M_grdCNSL410M.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        pageable: {
            refresh: false
            , pageSizes: [25, 50, 100, 200, 500]
            , buttonCount: 10
            , pageSize: 25
            ,
        },
        columns: [
            { width: 40, field: "radio", title:  CNSL410M_langMap.get("CNSL410M.grid.select"), excludeFromExport: true,
                template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',  editable: false  },
            {
                field: "cabackAcpnNo", title: "No", width: 60,
            },
            {
                field: "cabackRegDtm",
                title: CNSL410M_langMap.get("CNSL410M.grid.column.regDtm"),
                type: "string", width: 160,
            //    template: '#=regDtm == null ? "-" : kendo.toString(new Date(loadDt), "yyyy-MM-dd")#'
            }, {
                field: "cabackAltmDtm",
                title: CNSL410M_langMap.get("CNSL410M.grid.column.altmDtm"),
                type: "string", width: 160,
            //    template: '#=altmDtm == null ? "-" : kendo.toString(new Date(altmDtm), "yyyy-MM-dd HH:mm")#'
            }, {
                field: "cntcCpltDtm",
                title: CNSL410M_langMap.get("CNSL410M.grid.column.cpltDtm"),
                type: "string", width: 160,
              // template: '#=cntcCpltDtm == null ? "-" : kendo.toString(new Date(cntcCpltDtm), "yyyy-MM-dd HH:mm")#'
            },
            {
                field: "cabackReqTelno",
                title: CNSL410M_langMap.get("CNSL410M.grid.column.cabackReqTelno"),
                type: "string", width: 100,attributes: {style: "text-align : left;"},
            },
            {
                field: "vceCabackYn",
                title: CNSL410M_langMap.get("CNSL410M.grid.column.vceCabackYn"),
                type: "string", width: 100
            },
            {
                field: "cabackProcStCd",
                title: CNSL410M_langMap.get("CNSL410M.grid.column.cabackStCd"),
                type: "string",
                width: 100,
                template: function (dataItem) {
                    return Utils.getComCdNm(CNSL410M_cmmCodeList, 'C0119', dataItem.cabackProcStCd);
                }
            },
            {
                field: "cntcCustNmMsk",
                title: GLOBAL.session.user.dmnCd == '200'||GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? CNSL410M_langMap.get("CNSL410M.grid.column.patientNm"):CNSL410M_langMap.get("CNSL410M.grid.column.cntcCustNm"),
                type: "string",
                width: 100,
                attributes: {style: "text-align : left;", class: "tdTooltip"},
            },
            {
                field: "cnslrId",
                title: CNSL410M_langMap.get("CNSL410M.grid.column.cnslrId"),
                type: "string",
                width: 100,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "cnslrNm",
                title: CNSL410M_langMap.get("CNSL410M.grid.column.cnslrNm"),
                type: "string",
                width: 100,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "sttTxt",
                title: CNSL410M_langMap.get("CNSL410M.grid.column.reqCtt"),
                type: "string",
                attributes: {style: "text-align : left;"},
            },

            {
                field: "unfyCntcHistNo",
                hidden: true,
            },

        ],
        noRecords: { template: `<div class="nodataMsg"><p>${CNSL410M_langMap.get("CNSL.grid.nodatafound")}</p></div>` },
    }).data("kendoGrid");
    CNSL410M_grdCNSL410M.tbody.on('dblclick', CNSL410M_onClick);

    CNSL410M_ToolTip = $("#grdCNSL410M").kendoTooltip({
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
            let dataItem = CNSL410M_grdCNSL410M.dataItem(e.target.closest("tr"));
            return dataItem.webCabackCustNm;
        }
    }).data("kendoTooltip");

    CNSL410M_init();
});
function CNSL410M_init() {
    CMMN_SEARCH_TENANT["CNSL410M"].fnInit()

    CNSL410M_resizeGrid();
    CNSL410M_fnSelectCmmCode();
    return CNSL410M_fnSearchMyCaback();
}

$(window).resize(function () {
    CNSL410M_resizeGrid();
});

function CNSL410M_resizeGrid() {
    // (헤더 + 푸터)영역 높이 제외
    const screenHeight = $(window).height()-210;
    // (헤더 + 푸터 + 검색 )영역 높이 440
    CNSL410M_grdCNSL410M.element.find('.k-grid-content').css('height', screenHeight-230);
}

function CNSL410M_fnSelectCmmCode() {
    let CNSL410M_data = {
        "codeList": [
            {"mgntItemCd": "C0117"},
            {"mgntItemCd": "C0118"},
            {"mgntItemCd": "C0119"},
            {"mgntItemCd": "C0120"},
        ]
    };
    Utils.ajaxSyncCall(
        "/comm/COMM100SEL01",
        JSON.stringify(CNSL410M_data),
        CNSL410M_fnsetCmmCode)
}

function CNSL410M_fnsetCmmCode(data) {
    CNSL410M_cmmCodeList = JSON.parse(data.codeList);
    Utils.setKendoComboBox(CNSL410M_cmmCodeList, "C0119", "#CNSL410M input[name=cabackStCd]", "", true);
}

function CNSL410M_fnResultCaBackHistory(data) {
    window.kendo.ui.progress($("#grdCNSL410M"), false)
    let jsonDecode = JSON.parse(data.CNSL410M);
    if (jsonDecode.length === 0) {
        CNSL410M_grdCNSL410M.dataSource.data([]);
        return;
    }
    CNSL410M_grdCNSL410M.dataSource.data(jsonDecode);
    CNSL410M_grdCNSL410M.dataSource.options.schema.data = jsonDecode

    CNSL410M_grdCNSL410M.dataSource.page(1);
}

function CNSL410M_getParamValue() {
    let tmpCabackStCd = $('#CNSL410M [name=cabackStCd]').data('kendoComboBox').value();
    let cabackProcStCd = tmpCabackStCd === 0 ? "" : String(tmpCabackStCd);
    let webCabackCustNm = $('#CNSL410M [name=cntcCustNm]').val();
    return {
        tenantId: $('#CNSL410M_tenantId').val(),
        cnslrId:  $('#CNSL410M [name=cntcCnslId]').val(),
        webCabackCustNm: webCabackCustNm,
        cabackProcStCd: cabackProcStCd,
        srchDtFrom: $('#CNSL410M_dateStart').val(),
        srchDtTo: $('#CNSL410M_dateEnd').val(),
    }
}

function CNSL410M_fnSearchMyCaback() {

    let valid = true;

    Utils.markingRequiredField();
    if (Utils.isNull($('#CNSL410M_tenantId').val())) {
        Utils.alert(CNSL410M_langMap.get("CNSL.tenantId.required.msg"),
            () => {
                return tenantId.focus();
            });
        valid = false;
    }

    if(valid) {
        const paramValue = CNSL410M_getParamValue();
        CNSL410MDataSource.transport.read(paramValue);
    }
}

function CNSL410M_onClick(e) {
	
    let dataItem = CNSL410M_grdCNSL410M.dataItem($(e.target).closest("tr"));
    
    //kw---20230626 : 콜백내역 팝업에서 처리상태 변환시 필요한 파라미터 추가
    //kw---/cnsl/CNSL100INS01
    let ctiAgenId;
    if(Utils.isNull(dataItem.ctiAgenId)){
    	ctiAgenId = dataItem.cnslrId + "_u";
    } else {
    	ctiAgenId = dataItem.ctiAgenId;
    }

    let MCNS210P_param = {
        unfyCntcHistNo: dataItem.unfyCntcHistNo,
        cabackAcpnNo: dataItem.cabackAcpnNo,
        tenantId: dataItem.tenantId,
        cnslrId: dataItem.cnslrId,
        cnslrOrgCd: dataItem.cnslrOrgCd,
        ctiAgenId : ctiAgenId,						//kw---20230626 : 파라미터 추가
        cabackId : dataItem.cabackId,				//kw---20230626 : 파라미터 추가
        openerId : "CNSL410M",				        //kby---20230628 : 파라미터 추가
    }

    CNSL410M_sttTxt = dataItem.sttTxt;

    CNSL410M_fnPopup_MCNS210P(MCNS210P_param);
}

function CNSL410M_fnPopup_MCNS210P(MCNS210P_param) {
    Utils.setCallbackFunction("CNSL410M_fnSearchMyCaback", CNSL410M_fnSearchMyCaback);
    MCNS210P_param.callbackKey = "CNSL410M_fnSearchMyCaback"
    Utils.openPop(GLOBAL.contextPath + "/mcns/MCNS210P", "MCNS210P", 860, 650, MCNS210P_param);
}

$("#CNSL410M [name=excelExport]").on('click', (function () {
        const pageSize = CNSL410M_grdCNSL410M._data.length;
        if (pageSize === 0) {
            Utils.alert('데이터가 존재하지 않습니다.');
            return;
        }
        const dataSourceTotal = CNSL410M_grdCNSL410M.dataSource.total();
        CNSL410M_grdCNSL410M.dataSource.pageSize(dataSourceTotal);
        CNSL410M_grdCNSL410M.bind("excelExport", function (e) {
            e.workbook.fileName = CNSL410M_langMap.get("CNSL410M.title");
            let sheet = e.workbook.sheets[0];

            let setDataItem = {};
            let selectableNum = 0;
            if (this.columns[0].selectable) {
                selectableNum = 1
            }
            if (this.columns[0].template === '#= ++record #') {
                record = 0;
            }
            let deleteColumn =0;
            this.columns.forEach(function (item, index) {
                if (Utils.isNotNull(item.template)) {
                    let targetTemplate = kendo.template(item.template);
                    let fieldName = item.field;
                    for (let i = 1; i < sheet.rows.length; i++) {
                        let row = sheet.rows[i];
                        setDataItem = {
                            [fieldName]: row.cells[(index-deleteColumn - selectableNum)].value
                        }
                        row.cells[(index-deleteColumn - selectableNum)].value = targetTemplate(setDataItem);
                    }
                }
                if(item.excludeFromExport){
                    for(var i =0; i< sheet.rows.length; i++){
                        sheet.rows[i].cells.splice(index-deleteColumn,1)
                    }
                    deleteColumn++;
                }
            })

            for(var i = 1; i< sheet.rows.length; i++){
                sheet.rows[i].cells[0].value = i;
            }
        });

        CNSL410M_grdCNSL410M.saveAsExcel();
        CNSL410M_grdCNSL410M.dataSource.pageSize(pageSize);

}))

$('#CNSL410M input').on('change', function () { MCNS_inputValidation(this, 'CNSL410M'); });

function CNSL410M_fnCnslTab(){

    if(CNSL410M_selItem.length==0){
        Utils.alert(CNSL410M_langMap.get("CNSL410M.selectCall"))
        return;
    }

    TabUtils.openCnslMainTab(2,CNSL410M_selItem.cabackAcpnNo,CNSL410M_langMap.get("CNSL.Comm.Not.Found.cnsl.Main"),"main");
}

$('#CNSL410M [name=cntcCnslId]').on("keyup",function(key){
    if(key.keyCode==13) {
        CNSL410M_fnSearchMyCaback();
    }
});
