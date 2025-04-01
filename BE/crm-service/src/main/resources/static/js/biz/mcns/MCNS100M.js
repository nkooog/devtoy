/***********************************************************************************************
 * Program Name : MCNS100M.js
 * Creator      : mhlee
 * Create Date  : 2022.05.23
 * Description  : My상담내역
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.23     mhlee            최초생성
 *
 ************************************************************************************************/

var MCNS100M_cmmCodeList, MCNS100M_grdMCNS100M, MCNS100MDataSource, MCNS100M_ToolTip, MCNS100M_selItem=[];
$(document).ready(function () {

    MCNS100MDataSource = {
        transport: {
            read: function (MCNS100M_param) {
                if (Utils.isNull(MCNS100M_param.data)) {
                    Utils.ajaxCall(
                        "/mcns/MCNS100SEL01",
                        JSON.stringify(MCNS100M_param),
                        MCNS100M_fnResultMyCounseling,
                        window.kendo.ui.progress($("#grdMCNS100M"), true))
                } else {
                    window.kendo.ui.progress($("#grdMCNS100M"), false)
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

    MCNS100M_grdMCNS100M = $("#grdMCNS100M").kendoGrid({
        dataSource: MCNS100MDataSource,
        autoBind: false,
        resizable: true,
        refresh: true,
        sortable: true,
        selectable : true,
        sort: function (e) {
            if (MCNS100M_grdMCNS100M.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        change: function(e) {
            let selectedRows = e.sender.select();
            MCNS100M_selItem = this.dataItem(selectedRows[0]);
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
            { width: 40, field: "radio", title: "선택", excludeFromExport: true,
                template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',  editable: false  },
            {
                field:"cnslNo", title: "No", width: 40, template: "#= ++record #"
            },
            {
                field: "cntcChnlCd",
                title: MCNS100M_langMap.get("MCNS100M.grid.column.cntcChnlCd"),
                type: "string", width: 70,
                template: function (dataItem) {
                    return Utils.getComCdNm(MCNS100M_cmmCodeList, 'C0130', dataItem.cntcChnlCd);
                }
            },
            {
                field: "cntcPathCd",
                title: MCNS100M_langMap.get("MCNS100M.grid.column.cntcPathCd"),
                type: "string", width: 100,
            },
            {
                field: "cntcCnntDtm",
                title: MCNS100M_langMap.get("MCNS100M.grid.column.cntcCnntDtm"),
                type: "string", width: 125,
            },
            {
                field: "iobDvCd",
                title: MCNS100M_langMap.get("MCNS100M.grid.column.iobDvCd"),
                type: "string", width: 80,
                attributes: {style: "text-align : left;"},
                template: function (dataItem) {
                    return Utils.getComCdNm(MCNS100M_cmmCodeList, 'C0129', dataItem.iobDvCd);
                }
            },
            {
                field: "cnslrId",
                title: MCNS100M_langMap.get("MCNS100M.grid.column.cnslrId"),
                type: "string",
                width: 90,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "decUsrNm",
                title: MCNS100M_langMap.get("MCNS100M.grid.column.cnslrNm"),
                type: "string",
                width: 90,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "cntcCustId",
                title: GLOBAL.session.user.dmnCd == '200'||GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? MCNS100M_langMap.get("MCNS100M.grid.column.patientId"): MCNS100M_langMap.get("MCNS100M.grid.column.cntcCustId"),
                type: "string",
                width: 80,
                attributes: {style: "text-align : left;"},
                template: '#=Utils.isNull(cntcCustId) ? "" : cntcCustId#',
            },
            {
                field: "cntcCustNmMsk",
                title: GLOBAL.session.user.dmnCd == '200'||GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? MCNS100M_langMap.get("MCNS100M.grid.column.patientNm"): MCNS100M_langMap.get("MCNS100M.grid.column.cntcCustNm"),
                type: "string",
                width: 70,
                template: '#=Utils.isNull(cntcCustNmMsk) ? "" : cntcCustNmMsk#',
                attributes: {style: "text-align : left;", class: "tdTooltip"},
            },
            {
                field: "cntcTelNo",
                title: GLOBAL.session.user.dmnCd == '200'||GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'?MCNS100M_langMap.get("MCNS100M.grid.column.patientTelNo"): MCNS100M_langMap.get("MCNS100M.grid.column.cntcTelNo"),
                type: "string",
                attributes: {style: "text-align : left;"},
                width: 80,
            },
            {
                field: "cnslRsltCd",
                title: MCNS100M_langMap.get("MCNS100M.grid.column.cnslRsltCd"),
                type: "string",
                width: 80,
                template: function (dataItem) {
                    return Utils.isNotNull(dataItem.cnslRsltCd) ? Utils.getComCdNm(MCNS100M_cmmCodeList, 'C0152', dataItem.cnslRsltCd) : "-";
                }
            },
            {
                field: "inclIvrSvcCd",
                title: MCNS100M_langMap.get("MCNS100M.grid.column.inclIvrSvcCd"),
                type: "string",
                width: 100,
                attributes: {style: "text-align : left;"},
                template: function (dataItem) {
                    return Utils.isNotNull(dataItem.inclIvrSvcCd) ? Utils.getComCdNm(MCNS100M_cmmCodeList, 'C0162', dataItem.inclIvrSvcCd) : "-";
                }
            },
            {
                field: "vceCabackYn",
                title: MCNS100M_langMap.get("MCNS100M.grid.column.vceCabackYn"),
                type: "string", width: 100
            },
            {   width: 50,
                field: "phrecKey",
                title: "청취",
                excludeFromExport: true,
                template: function (dataItem) {
                    if (dataItem.phrecKey) {
                        return  '<button class="k-icon k-i-volume-up btListen" title="청취" onclick="MCNS100M_fnrecPlay('+'\''+dataItem.phrecKey+'\''+')"></button>'
                    }
                    return '';
                }
            },
            {
                field: "cnslTypCdPath",
                title: MCNS100M_langMap.get("MCNS100M.grid.column.cnslTypCd"),
                type: "string",
                width: '200px',
                attributes: {style: "text-align : left;"},
                template: '#=cnslTypCdPath == null ? "" : cnslTypCdPath#'
            },
            {
                field: "cnslCtt",
                title: MCNS100M_langMap.get("MCNS100M.grid.column.cnslCtt"),
                width: '300px',
                type: "string",
                attributes: {"class": "textEllipsis"},
                attributes: {style: "text-align : left;" , class: "tdTooltip"},
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
        noRecords: { template: `<div class="nodataMsg"><p>${MCNS_langMap.get("MCNS.grid.nodatafound")}</p></div>` },
    }).data("kendoGrid");

    MCNS100M_grdMCNS100M.tbody.on('dblclick', MCNS100M_onClick);
    MCNS100M_ToolTip = $("#grdMCNS100M").kendoTooltip({
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
            let dataItem = MCNS100M_grdMCNS100M.dataItem(e.target.closest("tr"));
            if(e.target.closest("td").index()==16){
                return dataItem.cnslCtt;
            }else{
                return  dataItem.cntcCustNm;
            }
        }
    }).data("kendoTooltip");
    MCNS100M_init();

});
function MCNS100M_init() {
    MCNS100M_resizeGrid();
    MCNS100M_fnSelectCmmCode();
    MCNS_initTenant(MCNS100M_grdMCNS100M,MCNS100M_fnSearchMyCounseling);
}

$(window).resize(function(){
    MCNS100M_resizeGrid();
});

function MCNS100M_resizeGrid() {
    // (헤더 + 푸터)영역 높이 제외
    const screenHeight = $(window).height()-210;
    // (헤더 + 푸터 + 검색 )영역 높이 440
    MCNS100M_grdMCNS100M.element.find('.k-grid-content').css('height', screenHeight-260);
}

function MCNS100M_fnSelectCmmCode() {
    let MCNS100M_data = {
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
        JSON.stringify(MCNS100M_data),
        MCNS100M_fnsetCmmCode)
}

function MCNS100M_fnsetCmmCode(data) {
    MCNS100M_cmmCodeList = JSON.parse(data.codeList);
    Utils.setKendoComboBox(MCNS100M_cmmCodeList, "C0129", "#MCNS100M input[name=iobDvCd]", "", true);
    // Utils.setKendoComboBox(MCNS100M_cmmCodeList, "C0216", "#MCNS100M input[name=vocDvCd]", "", true);
    Utils.setKendoMultiSelectCustom([],'#MCNS100M input[name=cnslTypCd]', 'cnslTypLvlNm', 'cnslTypCd',[].length===1,[]);
}

function MCNS100M_fnResultMyCounseling(data) {

    window.kendo.ui.progress($("#grdMCNS100M"), false)

    let cnslList = JSON.parse(data.MCNS100M);
    const listLength = cnslList.length
    if (listLength === 0) {
        MCNS100M_grdMCNS100M.dataSource.data([]);
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
    MCNS100M_grdMCNS100M.dataSource.data(cnslList);
    MCNS100M_grdMCNS100M.dataSource.options.schema.data = cnslList;

    MCNS100M_grdMCNS100M.dataSource.page(1);
}

function MCNS100M_getParamValue() {
    const tmpIobDvCd = $('#MCNS100M [name=iobDvCd]').data('kendoComboBox').value();
    // const tmpVocDvCd = $('#MCNS100M [name=vocDvCd]').data('kendoComboBox').value();
    let iobDvCd = tmpIobDvCd === 0 ? "" : String(tmpIobDvCd);
    // let vocDvCd = tmpVocDvCd === 0 ? "" : String(tmpVocDvCd);
    return {
        tenantId: $('#MCNS100M_tenantId').val(),
        cnslrId: GLOBAL.session.user.usrId,
        cntcCustNm: $('#MCNS100M [name=cntcCustNm]').val(),
        cntcCustId: $('#MCNS100M [name=cntcCustId]').val(),
        cntcTelNo: $('#MCNS100M [name=cntcTelNo]').val(),
        cntSrch: $('#MCNS100M [name=cntSrch]').val(),
        iobDvCd: iobDvCd,
        // vocDvCd: vocDvCd,
        srchDtFrom: MCNS_stringDateReg($('#MCNS100M_dateStart').val()),
        srchDtTo: MCNS_stringDateReg($('#MCNS100M_dateEnd').val()),
        cnslTypCdList: $('#MCNS100M input[name=cnslTypCd]').data("kendoMultiSelect").value()
    }
}

function MCNS100M_fnSearchMyCounseling() {
    MCNS100M_grdMCNS100M.dataSource.data([]);
    let $tenantId = $('#MCNS100M_tenantId');
    let $tenantNm = $('#MCNS100M_tenantNm');
    if(MCNS_checkTenant($tenantId,$tenantNm)) {
        const paramValue = MCNS100M_getParamValue();
        MCNS100MDataSource.transport.read(paramValue);
    }
}

function MCNS100M_fnSearchCnslTypCdPopup_SYSM281P() {
    Utils.setCallbackFunction("MCNS100M_fnCnslTypCdCallBack", function(items){
        let resultArr = items.map(x=>x.cnslTypCd);
        Utils.setKendoMultiSelectCustom(items,'#MCNS100M input[name=cnslTypCd]', 'cnslTypLvlNm', 'cnslTypCd',items.length===1, resultArr);
    });
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM281P", "SYSM281P", 1000, 600, {isMulti:"Y",callbackKey: "MCNS100M_fnCnslTypCdCallBack"});
}

function MCNS100M_onClick(e) {
    let MCNS100P_clickDataSet = {};
    let clickRow = $(e.target).closest("tr");
    let rowDataItem = MCNS100M_grdMCNS100M.dataItem(clickRow);
    MCNS100P_clickDataSet = {
        tenantId: rowDataItem.tenantId,
        unfyCntcHistNo: rowDataItem.unfyCntcHistNo,
        cnslHistSeq: rowDataItem.cnslHistSeq,
        cntcChnlCd: rowDataItem.cntcChnlCd,
        cnslrId: rowDataItem.cnslrId,
        cnslrBlngOrgCd: rowDataItem.cnslrBlngOrgCd,
    }
    MCNS100M_fnDetailPopup_MCNS120P(MCNS100P_clickDataSet);
}

function MCNS100M_fnDetailPopup_MCNS120P(MCNS120P_param) {
    Utils.setCallbackFunction("MCNS100M_fnSearchMyCounseling",MCNS100M_fnSearchMyCounseling)
    MCNS120P_param.callbackKey = "MCNS100M_fnSearchMyCounseling"
    Utils.openPop(GLOBAL.contextPath + "/mcns/MCNS120P", "MCNS120P", 1000, 650, MCNS120P_param);
}

$("#MCNS100M [name=excelExport]").on('click', (function () {
    MCNS_excelExport(MCNS100M_grdMCNS100M, MCNS100M_langMap.get("MCNS100M.title"));
}))

$('#MCNS100M input').on('change', function () { MCNS_inputValidation(this, 'MCNS100M'); });

function MCNS100M_fnCnslTab(){

    if(MCNS100M_selItem.length==0){
        Utils.alert(MCNS100M_langMap.get("MCNS100M.valid.saveMsg"))
        return;
    }

    TabUtils.openCnslMainTab(1,MCNS100M_selItem.unfyCntcHistNo,MCNS100M_langMap.get("CNSL.Comm.Not.Found.cnsl.Main"),"main");
}
function MCNS100M_fnrecPlay(rec_key) {
    let isOpen = xbox.connect.isopen();
    if(isOpen !== true){
        Utils.alert("CTI 로그인 후 이용해 주세요.");
        return;
    }

    if (Utils.isNull(rec_key)) {
        Utils.alert("녹취 키값이 존재하지 않습니다.");
        return;
    }
    xbox.control.recordPlay(rec_key);
}

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
$('#CNSL400M [name=cntSrch]').on("keyup",function(key){
    if(key.keyCode==13) {
        CNSL400M_fnSearchMyCounseling();
    }
});