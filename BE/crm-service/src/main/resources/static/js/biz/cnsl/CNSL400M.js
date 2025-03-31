/***********************************************************************************************
 * Program Name : CNSL400M.jsp
 * Creator      : bykim
 * Create Date  : 2023.01.10
 * Description  : 상담내역
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.01.10     bykim            최초생성
 ************************************************************************************************/

var CNSL400M_cmmCodeList, CNSL400M_grdCNSL400M, CNSL400MDataSource, CNSL400M_ToolTip, CNSL400M_selItem =[];
$(document).ready(function () {

    CNSL400MDataSource = {
        transport: {
            read: function (CNSL400M_param) {
                if (Utils.isNull(CNSL400M_param.data)) {
                    Utils.ajaxCall(
                        "/cnsl/CNSL400SEL01",
                        JSON.stringify(CNSL400M_param),
                        CNSL400M_fnResultMyCounseling,
                        window.kendo.ui.progress($("#grdCNSL400M"), true)
                       )
                } else {
                    window.kendo.ui.progress($("#grdCNSL400M"), false)
                }
            },
        },
        schema: {
            type: "json",
            model: {
                fields: {
                    cnslNo: {field: "cnslNo", type: "string"},
                    cntcChnlCd: {field: "cntcChnlCd", type: "string"},
                    cnslCnntDtm: {field: "cnslCnntDtm", type: "date"},
                    iobDvCd: {field: "iobDvCd", type: "string"},
                    decUsrNm: {field: "decUsrNm", type: "string"},
                    cntcCustId: {field: "cntcCustId", type: "string"},
                    cntcCustNm: {field: "cntcCustNm", type: "string"},
                    cntcTelNo: {field: "cntcTelNo", type: "string"},
                    cnslRsltCd: {field: "cnslRsltCd", type: "string"},
                    inclIvrSvcCd: {field: "inclIvrSvcCd", type: "string"},
                    cnslTypCd: {field: "cnslTypCd", type: "string"},
                    cnslCtt: {field: "cnslCtt", type: "string"},
                    phrecKey: {field: "phrecKey", type: "string"},
                    unfyCntcHistNo: {field: "unfyCntcHistNo", type: "number"},
                    cnslrBlngOrgCd: {field: "cnslrBlngOrgCd", type: "string"},
                }
            }
        }
    }

    CNSL400M_grdCNSL400M = $("#grdCNSL400M").kendoGrid({
        dataSource: CNSL400MDataSource,
        autoBind: false,
        resizable: true,
        refresh: true,
        sortable: true,
        selectable : true,
        change: function(e) {
            let selectedRows = e.sender.select();
            CNSL400M_selItem = this.dataItem(selectedRows[0]);
        },
        sort: function (e) {
            if (CNSL400M_grdCNSL400M.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        dataBinding: function () {
            record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        pageable: {
            refresh: false
            , pageSizes: [25, 50, 100, 100, 500]
            , buttonCount: 10
            , pageSize: 25
        },
        columns: [
            { width: 40, field: "radio", title:  CNSL400M_langMap.get("CNSL400M.grid.select"),excludeFromExport: true,
                template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',  editable: false,
            },
            {
                field:"cnslNo", title: "No", width: 40,
                //template: dataItem => CNSL400M_grdCNSL400M.dataSource.total() - CNSL400M_grdCNSL400M.dataSource.indexOf(dataItem)
                template: dataItem => CNSL400M_grdCNSL400M.dataSource.total() - CNSL400M_grdCNSL400M.dataSource.indexOf(dataItem)
            },
            {
                field: "cntcChnlCd",
                title: CNSL400M_langMap.get("CNSL400M.grid.column.cntcChnlCd"),
                type: "string", width: 70,
                template: function (dataItem) {
                    return Utils.getComCdNm(CNSL400M_cmmCodeList, 'C0130', dataItem.cntcChnlCd);
                }
            },
            {
                field: "cntcPathCd",
                title: CNSL400M_langMap.get("CNSL400M.grid.column.cntcPathCd"),
                type: "string", width: 100,
            },
            {
                field: "cntcCnntDtm",
                title: CNSL400M_langMap.get("CNSL400M.grid.column.cntcCnntDtm"),
                type: "string", width: 130,
            },
            {
                field: "iobDvCd",
                title: CNSL400M_langMap.get("CNSL400M.grid.column.iobDvCd"),
                type: "string", width: 80,
                attributes: {style: "text-align : left;"},
                template: function (dataItem) {
                    return Utils.getComCdNm(CNSL400M_cmmCodeList, 'C0129', dataItem.iobDvCd);
                }
            },
            {
                field: "cnslrId",
                title: CNSL400M_langMap.get("CNSL400M.grid.column.cnslrId"),
                type: "string",
                width: 90,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "decUsrNm",
                title: CNSL400M_langMap.get("CNSL400M.grid.column.cnslrNm"),
                type: "string",
                width: 90,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "cntcCustId",
                title: GLOBAL.session.user.dmnCd == '200'|| GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? CNSL400M_langMap.get("CNSL400M.grid.column.patientId"): CNSL400M_langMap.get("CNSL400M.grid.column.cntcCustId"),
                type: "string",
                width: 80,
                attributes: {style: "text-align : left;"},
                template: '#=Utils.isNull(cntcCustId) ? "" : cntcCustId#',
            },
            {
                field: "cntcCustNmMsk",
                title:  GLOBAL.session.user.dmnCd == '200'|| GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? CNSL400M_langMap.get("CNSL400M.grid.column.patientNm"): CNSL400M_langMap.get("CNSL400M.grid.column.cntcCustNm"),
                type: "string",
                width: 70,
                template: '#=Utils.isNull(cntcCustNmMsk) ? "" : cntcCustNmMsk#',
                attributes: {style: "text-align : left;", class: "tdTooltip"},
            },
            {
                field: "cntcTelNo",
                title:  GLOBAL.session.user.dmnCd == '200'|| GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'?CNSL400M_langMap.get("CNSL400M.grid.column.patientTelNo"): CNSL400M_langMap.get("CNSL400M.grid.column.cntcTelNo"),
                type: "string",
                width: 80,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "cnslRsltCd",
                title: CNSL400M_langMap.get("CNSL400M.grid.column.cnslRsltCd"),
                type: "string",
                width: 80,
                template: function (dataItem) {
                    return Utils.isNotNull(dataItem.cnslRsltCd) ? Utils.getComCdNm(CNSL400M_cmmCodeList, 'C0152', dataItem.cnslRsltCd) : "-";
                }
            },
            {
                field: "inclIvrSvcCd",
                title: CNSL400M_langMap.get("CNSL400M.grid.column.inclIvrSvcCd"),
                type: "string",
                width: 100,
                attributes: {style: "text-align : left;"},
                template: function (dataItem) {
                    return Utils.isNotNull(dataItem.inclIvrSvcCd) ? Utils.getComCdNm(CNSL400M_cmmCodeList, 'C0162', dataItem.inclIvrSvcCd) : "-";
                }
            },
            {
                field: "vceCabackYn",
                title: CNSL400M_langMap.get("CNSL400M.grid.column.vceCabackYn"),
                type: "string", width: 100
            },
            {   width: 50,
                field: "phrecKey",
                title: "청취",
                excludeFromExport: true,
                template: function (dataItem) {
                    if (dataItem.phrecKey) {
                        return '<button class="k-icon k-i-volume-up btListen" title="청취" onclick="CSNL400M_recPlay('+'\''+dataItem.phrecKey+'\''+')"></button>'
                    }
                    return '';
                },

            },
            {
                field: "cnslTypCdPath",
                title: CNSL400M_langMap.get("CNSL400M.grid.column.cnslTypCd"),
                type: "string",
                width: '200px',
                attributes: {style: "text-align : left;"},
                template: '#=cnslTypCdPath == null ? "" : cnslTypCdPath#'
            },
            {
                field: "cnslCtt",
                title: CNSL400M_langMap.get("CNSL400M.grid.column.cnslCtt"),
                width: '300px',
                type: "string",
                attributes: {style: "text-align : left;", class: "tdTooltip"},
                template: '#=cnslCtt == null ? "" : cnslCtt#'
            },
            {
                field: "unfyCntcHistNo",
                hidden: true,
            },
            {
                field: "cnslrBlngOrgCd",
                hidden: true,
            },
        ],
        noRecords: { template: `<div class="nodataMsg"><p>${CNSL400M_langMap.get("CNSL.grid.nodatafound")}</p></div>` },
    }).data("kendoGrid");

    CNSL400M_grdCNSL400M.tbody.on('dblclick', CNSL400M_onClick);
    CNSL400M_ToolTip = $("#grdCNSL400M").kendoTooltip({
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
            let dataItem = CNSL400M_grdCNSL400M.dataItem(e.target.closest("tr"));
            if(e.target.closest("td").index()==16){
                return dataItem.cnslCtt;
            }else{
                return  dataItem.cntcCustNm;
            }
        }
    }).data("kendoTooltip");
    CNSL400M_init();

});
function CNSL400M_init() {
    CMMN_SEARCH_TENANT["CNSL400M"].fnInit();

    CNSL400M_resizeGrid();
    CNSL400M_fnSelectCmmCode();
    return CNSL400M_fnSearchMyCounseling();
}

$(window).resize(function(){
    CNSL400M_resizeGrid();
});

function CNSL400M_resizeGrid() {
    // (헤더 + 푸터)영역 높이 제외
    const screenHeight = $(window).height()-210;
    // (헤더 + 푸터 + 검색 )영역 높이 440
    CNSL400M_grdCNSL400M.element.find('.k-grid-content').css('height', screenHeight-260);
}

function CNSL400M_fnSelectCmmCode() {
    let CNSL400M_data = {
        "codeList": [
            {"mgntItemCd": "C0129"}, //인아웃구분
            {"mgntItemCd": "C0130"}, //접촉채널구분
            {"mgntItemCd": "C0152"}, //상담결과
            {"mgntItemCd": "C0162"}, //IVR코드
            {"mgntItemCd": "C0216"}, //V0C구분코드
        ]
    };
    Utils.ajaxSyncCall(
        "/comm/COMM100SEL01",
        JSON.stringify(CNSL400M_data),
        CNSL400M_fnsetCmmCode)
}

function CNSL400M_fnsetCmmCode(data) {
    CNSL400M_cmmCodeList = JSON.parse(data.codeList);
    Utils.setKendoComboBox(CNSL400M_cmmCodeList, "C0129", "#CNSL400M input[name=iobDvCd]", "", true);
    //Utils.setKendoComboBox(CNSL400M_cmmCodeList, "C0216", "#CNSL400M input[name=vocDvCd]", "", true);
    Utils.setKendoMultiSelectCustom([],'#CNSL400M input[name=cnslTypCd]', 'cnslTypLvlNm', 'cnslTypCd',[].length===1,[]);
}

function CNSL400M_fnResultMyCounseling(data) {
    window.kendo.ui.progress($("#grdCNSL400M"), false);
    let cnslList = JSON.parse(data.CNSL400M);
    const listLength = cnslList.length
    if (listLength === 0) {
        CNSL400M_grdCNSL400M.dataSource.data([]);
        return;
    }
    for (const cnsl of cnslList) {
        cnsl.cntcCnntDtm =
            Utils.isNotNull(cnsl.cntcCnntDtm)
            ? cnsl.cntcCnntDtm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6')
            : "-";
        // cnsl.decUsrNm = ''.concat(
        //     cnsl.decUsrNm, "(", cnsl.cnslrId, ")");
    }
    CNSL400M_grdCNSL400M.dataSource.data(cnslList);
    CNSL400M_grdCNSL400M.dataSource.options.schema.data = cnslList;

    CNSL400M_grdCNSL400M.dataSource.page(1);
}

function CNSL400M_getParamValue() {
    const tmpIobDvCd = $('#CNSL400M [name=iobDvCd]').data('kendoComboBox').value();
    //const tmpVocDvCd = $('#CNSL400M [name=vocDvCd]').data('kendoComboBox').value();
    let iobDvCd = tmpIobDvCd === 0 ? "" : String(tmpIobDvCd);
  //  let vocDvCd = tmpVocDvCd === 0 ? "" : String(tmpVocDvCd);
    return {
        tenantId: $('#CNSL400M_tenantId').val(),
        cnslrId:  $('#CNSL400M [name=cntcCnslId]').val(),
        cnslrNm:  $('#CNSL400M [name=cntcCnslNm]').val(),
        cntcCustNm: $('#CNSL400M [name=cntcCustNm]').val(),
        cntcCustId: $('#CNSL400M [name=cntcCustId]').val(),
        cntcTelNo: $('#CNSL400M [name=cntcTelNo]').val(),
        iobDvCd: iobDvCd,
        cntSrch : $('#CNSL400M [name=cntSrch]').val(),
    //    vocDvCd: vocDvCd,
        srchDtFrom: MCNS_stringDateReg($('#CNSL400M_dateStart').val()),
        srchDtTo: MCNS_stringDateReg($('#CNSL400M_dateEnd').val()),
        cnslTypCdList: $('#CNSL400M input[name=cnslTypCd]').data("kendoMultiSelect").value()
    }
}

function CNSL400M_fnSearchMyCounseling() {
    CNSL400M_grdCNSL400M.dataSource.data([]);

    let valid = true;

    Utils.markingRequiredField();
    if (Utils.isNull($('#CNSL400M_tenantId').val())) {
        Utils.alert(CNSL400M_langMap.get("CNSL.tenantId.required.msg"),
            () => {
                return tenantId.focus();
            });
        valid = false;
    }

    if(valid) {
        const paramValue = CNSL400M_getParamValue();
        CNSL400MDataSource.transport.read(paramValue);
    }
}

function CNSL400M_fnSearchCnslTypCdPopup_SYSM281P() {
    Utils.setCallbackFunction("CNSL400M_fnCnslTypCdCallBack", function(items){
        let resultArr = items.map(x=>x.cnslTypCd);
        Utils.setKendoMultiSelectCustom(items,'#CNSL400M input[name=cnslTypCd]', 'cnslTypLvlNm', 'cnslTypCd',items.length===1, resultArr);
    });
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM281P", "SYSM281P", 1000, 600, {isMulti:"Y",callbackKey: "CNSL400M_fnCnslTypCdCallBack"});
}

function CNSL400M_onClick(e) {
    let CNSL400M_clickDataSet = {};
    let clickRow = $(e.target).closest("tr");
    let rowDataItem = CNSL400M_grdCNSL400M.dataItem(clickRow);
    CNSL400M_clickDataSet = {
        tenantId: rowDataItem.tenantId,
        unfyCntcHistNo: rowDataItem.unfyCntcHistNo,
        cnslHistSeq: rowDataItem.cnslHistSeq,
        cntcChnlCd: rowDataItem.cntcChnlCd,
        cnslrId: rowDataItem.cnslrId,
        cnslrBlngOrgCd: rowDataItem.cnslrBlngOrgCd,
    }
    CNSL400M_fnDetailPopup_MCNS120P(CNSL400M_clickDataSet);
}

function CNSL400M_fnDetailPopup_MCNS120P(MCNS120P_param) {
    Utils.setCallbackFunction("CNSL400M_fnSearchMyCounseling",CNSL400M_fnSearchMyCounseling)
    MCNS120P_param.callbackKey = "CNSL400M_fnSearchMyCounseling"
    Utils.openPop(GLOBAL.contextPath + "/mcns/MCNS120P", "MCNS120P", 1000, 650, MCNS120P_param);
}

$("#CNSL400M [name=excelExport]").on('click', (function () {
    CNSL400M_excelExport(0);
}))

function CNSL400M_excelExport(gridIndex) {
    gridIndex = 0;
    var today = new Date();

    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);

    var dateString = year + month  + day;

    CNSL400_excelExport(CNSL400M_grdCNSL400M, dateString + "_" + "상담이력");
}

function CNSL400_excelExport(targetGrid, fileName) {
    const pageSize = targetGrid.dataSource.pageSize();
    if (pageSize === 0) {
        Utils.alert("조회된 내역이 없습니다.");
        return;
    }

    const dataSourceTotal = targetGrid.dataSource.total();
    targetGrid.dataSource.pageSize(dataSourceTotal);
    targetGrid.bind("excelExport", function (e) {
        e.workbook.fileName = fileName;
        let sheet = e.workbook.sheets[0];

        let setDataItem = {};
        let selectableNum = 0;
        if (this.columns[0].selectable) {
            selectableNum = 1
        }
        this.columns.forEach(function (item, index) {
            if (Utils.isNotNull(item.template)) {
                let targetTemplate = kendo.template(item.template);
                let fieldName = item.field;

                for (let i = 1; i < sheet.rows.length; i++) {
                    let row = sheet.rows[i];
                    setDataItem = {
                        [fieldName]: row.cells[(index - selectableNum)].value
                    }
                    row.cells[(index - selectableNum)].value = targetTemplate(setDataItem);
                }
            }
        })

        for(var i = 1; i< sheet.rows.length; i++){
            sheet.rows[i].cells[0].value = '';
            sheet.rows[i].cells[1].value = sheet.rows.length - i;
        }
    });

    targetGrid.saveAsExcel();
    targetGrid.dataSource.pageSize(pageSize);
}



$('#CNSL400M input').on('change', function () { MCNS_inputValidation(this, 'CNSL400M'); });

function CSNL400M_recPlay(rec_key) {
    if (Utils.isNull(rec_key)) {
        Utils.alert( CNSL400M_langMap.get("CNSL400M.recKey"));
        return;
    }
    xbox.control.recordPlay(rec_key);
}

function CNSL400M_fnCnslTab(){
    if(CNSL400M_selItem.length==0){
        Utils.alert( CNSL400M_langMap.get("CNSL400M.noSelect"))
        return;
    }

    TabUtils.openCnslMainTab(1,CNSL400M_selItem.unfyCntcHistNo,CNSL400M_langMap.get("CNSL.Comm.Not.Found.cnsl.Main"),"main");
}

$('#CNSL400M [name=cntSrch]').on("keyup",function(key){
    if(key.keyCode==13) {
        CNSL400M_fnSearchMyCounseling();
    }
});
$('#CNSL400M [name=cntcCnslId]').on("keyup",function(key){
    if(key.keyCode==13) {
        CNSL400M_fnSearchMyCounseling();
    }
});
$('#CNSL400M [name=cntcCnslNm]').on("keyup",function(key){
    if(key.keyCode==13) {
        CNSL400M_fnSearchMyCounseling();
    }
});
$('#CNSL400M [name=cntcCustNm]').on("keyup",function(key){
    if(key.keyCode==13) {
        CNSL400M_fnSearchMyCounseling();
    }
});
$('#CNSL400M [name=cntcCustId]').on("keyup",function(key){
    if(key.keyCode==13) {
        CNSL400M_fnSearchMyCounseling();
    }
});
$('#CNSL400M [name=cntcTelNo]').on("keyup",function(key){
    if(key.keyCode==13) {
        CNSL400M_fnSearchMyCounseling();
    }
});



