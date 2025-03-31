/***********************************************************************************************
 * Program Name : CNSL420M.js
 * Creator      : bykim
 * Create Date  : 2023.01.10
 * Description  : 예약내역
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.01.10     bykim            최초생성
 ************************************************************************************************/

var CNSL420M_cmmCodeList, CNSL420M_grdCNSL420M, CNSL420MDataSource, CNSL420M_clickDataSet = {}, CNSL420M_selItem = [], CNSL420M_ToolTip;
$(document).ready(function () {
    CNSL420MDataSource = {
        transport: {
            read: function (CNSL420M_param) {
                if (Utils.isNull(CNSL420M_param.data)) {
                    Utils.ajaxCall(
                        "/cnsl/CNSL420SEL01",
                        JSON.stringify(CNSL420M_param),
                        CNSL420M_fnResultReservationHistory,
                        window.kendo.ui.progress($("#grdCNSL420M"), true))
                } else {
                    window.kendo.ui.progress($("#grdCNSL420M"), false)
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

    CNSL420M_grdCNSL420M = $("#grdCNSL420M").kendoGrid({
        dataSource: CNSL420MDataSource,
        autoBind: false,
        resizable: true,
        refresh: true,
        sortable: true,
        selectable : true,
        change: function(e) {
            let selectedRows = e.sender.select();
            CNSL420M_selItem = this.dataItem(selectedRows[0]);
        },
        sort: function (e) {
            if (CNSL420M_grdCNSL420M.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        dataBinding: function () {
            record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        pageable: {
            refresh: false
            , pageSizes: [25, 50, 100, 300, 500]
            , buttonCount: 10
            , pageSize: 25
        },
        columns: [
            { width: 40, field: "radio", title: CNSL420M_langMap.get("CNSL420M.grid.select"), excludeFromExport: true,
                template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',  editable: false  },
            {
                field: "rsvNo", title: "No", width: 30, template: "#= ++record #"
            }, {
                field: "regDdHour",
                title: CNSL420M_langMap.get("CNSL420M.grid.column.regDdHour"),
                type: "string", width: 140,
                template: '#=regDdHour == null ? "-" : kendo.toString(new Date(regDdHour), "yyyy-MM-dd HH:mm:ss")#'
            }, {
                field: "rsvDd",
                title: CNSL420M_langMap.get("CNSL420M.grid.column.rsvDd"),
                type: "string", width: 140,
                template: '#=rsvDd == null ? "-" : kendo.toString(new Date(rsvDd), "yyyy-MM-dd HH:mm:ss")#'
            }, {
                field: "cntcTelNo",
                title: CNSL420M_langMap.get("CNSL420M.grid.column.cntcTelNo"),
                type: "string", width: 100,attributes: {style: "text-align : left;"},
                template: '#=cntcTelNo == null ? "-" :  cntcTelNo#'
            }, {
                field: "lstCorcDdHour",
                title: CNSL420M_langMap.get("CNSL420M.grid.column.lstCorcDdHour"),
                type: "string", width: 140,
                template: '#=lstCorcDdHour == null ? "-" : kendo.toString(new Date(lstCorcDdHour), "yyyy-MM-dd HH:mm:ss")#'
            }, {
                field: "procStCd",
                title: CNSL420M_langMap.get("CNSL420M.grid.column.procStCd"),
                type: "string",
                width: 120,
                attributes: {"class": "k-text-left"},
                template: function (dataItem) {
                    return Utils.getComCdNm(CNSL420M_cmmCodeList, 'C0156', dataItem.procStCd);
                }
            }, {
                field: "cntcCustId",
                title: GLOBAL.session.user.dmnCd == '200'||GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? CNSL420M_langMap.get("CNSL420M.grid.column.patientId"):CNSL420M_langMap.get("CNSL420M.grid.column.cntcCustId"),
                width: 100,
                type: "string",
                attributes: {style: "text-align : left;"},
            }, {
                field: "cntcCustNmMsk",
                title: GLOBAL.session.user.dmnCd == '200'||GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? CNSL420M_langMap.get("CNSL420M.grid.column.patientNm"):CNSL420M_langMap.get("CNSL420M.grid.column.cntcCustNm"),
                type: "string",
                width: 100,
                attributes: {style: "text-align : left;", class: "tdTooltip"},
            }, {
                field: "rsvMemo",
                title: CNSL420M_langMap.get("CNSL420M.grid.column.rsvMemo"),
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
            }, {
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
        noRecords: { template: `<div class="nodataMsg"><p>${CNSL420M_langMap.get("CNSL.grid.nodatafound")}</p></div>` },
    }).data("kendoGrid");

    CNSL420M_grdCNSL420M.tbody.on('dblclick', CNSL420M_onClick);

    CNSL420M_ToolTip = $("#grdCNSL420M").kendoTooltip({
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
            let dataItem = CNSL420M_grdCNSL420M.dataItem(e.target.closest("tr"));
            return dataItem.cntcCustNm;
        }
    }).data("kendoTooltip");

    CNSL420M_init();
});
function CNSL420M_init() {
    CMMN_SEARCH_TENANT["CNSL420M"].fnInit()

    CNSL420M_resizeGrid();
    CNSL420M_fnSelectCmmCode();
    return CNSL420M_fnSearchMyReservation();
}


$(window).resize(function(){
    CNSL420M_resizeGrid();
});

function CNSL420M_resizeGrid() {
    // (헤더 + 푸터)영역 높이 제외
    const screenHeight = $(window).height()-210;
    // (헤더 + 푸터 + 검색 )영역 높이 440
    CNSL420M_grdCNSL420M.element.find('.k-grid-content').css('height', screenHeight-265);
}

function CNSL420M_fnSelectCmmCode() {
    let CNSL420M_data = {
        "codeList": [
            {"mgntItemCd": "C0154"},
            {"mgntItemCd": "C0155"},
            {"mgntItemCd": "C0156"},
        ]
    };
    Utils.ajaxSyncCall(
        "/comm/COMM100SEL01",
        JSON.stringify(CNSL420M_data),
        CNSL420M_fnsetCmmCode)
}

function CNSL420M_fnsetCmmCode(data) {
    CNSL420M_cmmCodeList = JSON.parse(data.codeList);
    console.log(CNSL420M_cmmCodeList);
    Utils.setKendoComboBox(CNSL420M_cmmCodeList, "C0156", "#CNSL420M input[name=procStCd]", "", true);
}

function CNSL420M_fnResultReservationHistory(data) {
    window.kendo.ui.progress($("#grdCNSL420M"), false)
    let jsonDecode = JSON.parse(data.CNSL420M);
    if (jsonDecode.length === 0) {
        CNSL420M_grdCNSL420M.dataSource.data([]);
        return;
    }
    for (const obj of jsonDecode) {
        obj.rsvDd = ''.concat(
            obj.rsvDd, "T", obj.rsvHour, ":", obj.rsvPt);
    }
    CNSL420M_grdCNSL420M.dataSource.data(jsonDecode);
    CNSL420M_grdCNSL420M.dataSource.options.schema.data = jsonDecode;

    CNSL420M_grdCNSL420M.dataSource.page(1);
}

function CNSL420M_getParamValue() {
    return {
        tenantId: $('#CNSL420M_tenantId').val(),
        cnslrId:  $('#CNSL420M [name=cntcCnslId]').val(),
        cntcCustNm: $('#CNSL420M [name=cntcCustNm]').val(),
        cntcCustId: $('#CNSL420M [name=cntcCustId]').val(),
        procStCd: $('#CNSL420M [name=procStCd]').data('kendoComboBox').value(),
        srchDtFrom: MCNS_stringDateReg($('#CNSL420M_dateStart').val()),
        srchDtTo: MCNS_stringDateReg($('#CNSL420M_dateEnd').val()),
    }
}

function CNSL420M_fnSearchMyReservation() {
    let valid = true;

    Utils.markingRequiredField();
    if (Utils.isNull($('#CNSL420M_tenantId').val())) {
        Utils.alert(CNSL420M_langMap.get("CNSL.tenantId.required.msg"),
            () => {
                return tenantId.focus();
            });
        valid = false;
    }

    if(valid) {
        const paramValue = CNSL420M_getParamValue();
        CNSL420MDataSource.transport.read(paramValue);
    }
}

function CNSL420M_onClick(e) {
    let clickRow = $(e.target).closest("tr");
    let rowDataItem = CNSL420M_grdCNSL420M.dataItem(clickRow);
    for (const col of CNSL420M_grdCNSL420M.columns) {
        let columnFieldName = col.field;
        CNSL420M_clickDataSet[columnFieldName] = rowDataItem[columnFieldName]
    }
    CNSL420M_fnPopup_MCNS310P();
}

function CNSL420M_fnPopup_MCNS310P() {
    Utils.setCallbackFunction("CNSL420M_fnSearchMyReservation", CNSL420M_fnSearchMyReservation);
    const data = {
        callbackKey :"CNSL420M_fnSearchMyReservation",
        procStCd : CNSL420M_clickDataSet.procStCd,
    }
    Utils.openPop(GLOBAL.contextPath + "/mcns/MCNS310P", "MCNS310P", 720, 400, data);
}


function CNSL420M_excelExport() {
    const pageSize = CNSL420M_grdCNSL420M._data.length;
    if (pageSize === 0) {
        Utils.alert('데이터가 존재하지 않습니다.');
        return;
    }
    const dataSourceTotal = CNSL420M_grdCNSL420M.dataSource.total();
    CNSL420M_grdCNSL420M.dataSource.pageSize(dataSourceTotal);
    CNSL420M_grdCNSL420M.bind("excelExport", function (e) {
        e.workbook.fileName = CNSL420M_langMap.get("CNSL420M.title");
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

    CNSL420M_grdCNSL420M.saveAsExcel();
    CNSL420M_grdCNSL420M.dataSource.pageSize(pageSize);
}

$('#CNSL420M input').on('change', function () { MCNS_inputValidation(this, 'CNSL420M'); });

function CNSL420M_fnCnslTab(){

    if(CNSL420M_selItem.length==0){
        Utils.alert(CNSL420M_langMap.get("CNSL420M.selectCall"))
        return;
    }
    TabUtils.openCnslMainTab(3,CNSL420M_selItem.unfyCntcHistNo,CNSL420M_langMap.get("CNSL.Comm.Not.Found.cnsl.Main"),"main");
}

$('#CNSL420M [name=cntcCnslId]').on("keyup",function(key){
    if(key.keyCode==13) {
        CNSL420M_fnSearchMyReservation();
    }
});

$('#CNSL420M [name=cntcCustNm]').on("keyup",function(key){
    if(key.keyCode==13) {
        CNSL420M_fnSearchMyReservation();
    }
});

$('#CNSL420M [name=cntcCustId]').on("keyup",function(key){
    if(key.keyCode==13) {
        CNSL420M_fnSearchMyReservation();
    }
});