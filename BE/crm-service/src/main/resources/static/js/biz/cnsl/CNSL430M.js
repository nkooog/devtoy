/***********************************************************************************************
 * Program Name : CNSL430M.js
 * Creator      : bykim
 * Create Date  : 2023.01.10
 * Description  : 이관내역
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.01.10     bykim            최초생성
 ************************************************************************************************/

var CNSL430M_cmmCodeList, CNSL430M_grdCNSL430M, CNSL430MDataSource, CNSL430M_rawData, CNSL430M_gridBtnList, CNSL430M_ToolTip;
var CNSL430M_gridSelectedItems = [];

$(document).ready(function () {

    $("#CNSL430M_dateStart").val( kendo.format("{0:yyyy-MM-dd}",new Date()));
    $("#CNSL430M_dateEnd").val(kendo.format("{0:yyyy-MM-dd}",new Date()));

    var CNSL430M_comboType = [
        { text: "전체", value: "0" },
        { text: "이관일자", value: "1" },
        { text: "완료일자", value: "2" },
    ]

    $("#srchDateType_CNSL430M").kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: CNSL430M_comboType,
        clearButton: false,
        height: 200,
    });

    let CNSL430_srchType = $("#srchDateType_CNSL430M").data("kendoComboBox");
    CNSL430_srchType.value("0");
    CNSL430_srchType.input.attr("readonly", true);

    CNSL430MDataSource = {
        transport: {
            read: function (CNSL430M_param) {
                if (Utils.isNull(CNSL430M_param.data)) {
                    Utils.ajaxCall(
                        "/cnsl/CNSL430SEL01",
                        JSON.stringify(CNSL430M_param),
                        CNSL430M_fnResultTransferHistory,
                        window.kendo.ui.progress($("#grdCNSL430M"), true))
                } else {
                    window.kendo.ui.progress($("#grdCNSL430M"), false)
                }
            },
            update: function (CNSL430M_updateParam) {
                Utils.ajaxCall(
                    "/cnsl/CNSL430UPT01",
                    JSON.stringify(CNSL430M_updateParam),
                    function (data) {
                        Utils.alert(data.msg, CNSL430M_fnSearchMyTransferHistory);
                    });
            },
            create: function (CNSL430M_insertParam) {
                Utils.ajaxCall(
                    "/cnsl/CNSL430INS01",
                    JSON.stringify(CNSL430M_insertParam),
                    function (data) {
                        Utils.alert(data.msg, CNSL430M_fnSearchMyTransferHistory);
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

    CNSL430M_grdCNSL430M = $("#grdCNSL430M").kendoGrid({
        dataSource: CNSL430MDataSource,
        autoBind: false,
        resizable: false,
        scrollable: true,
        dataBound: function () {
            let grid = $("#grdCNSL430M").data('kendoGrid');
            let allRows = grid.items();
            $.each(allRows, function (index, value) {
                if (grid.dataItem(value).procStCd === '3' || grid.dataItem(value).procStCd === '5') {
                    $(value).find(".k-checkbox").attr('disabled', true);
                    // $(value).find(".k-checkbox").hide();
                }
            })
        },
        sortable: false,
        change: function (e) {

            let selectedRows = e.sender.select();
            CNSL430M_gridSelectedItems = [];
            selectedRows.each(function () {
                let dataItem = CNSL430M_grdCNSL430M.dataItem(this);
                if (dataItem.procStCd === "3" || dataItem.procStCd === "5") {
                    $(this).removeClass("k-state-selected");
                } else {
                    const findRawDataItem = CNSL430M_rawData.find((obj) => {
                        if (obj.unfyCntcHistNo === dataItem.unfyCntcHistNo && obj.trclSeq === dataItem.trclSeq) {
                            return true;
                        }
                    });
                    CNSL430M_gridSelectedItems.push(findRawDataItem);
                }
            });
            $("#CNSL430M [name=gridBtn]").prop("disabled", CNSL430M_gridSelectedItems.length === 0 );
            $('#CNSL430M .k-checkbox:disabled').prop('checked', false);
        },
        sort: function (e) {
            if (CNSL430M_grdCNSL430M.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        pageable: {
            pageSizes: [25, 50, 100, 200, 500]
            , buttonCount: 10
            , pageSize: 25
            ,
        },
        columns: [
            {
                width: 30, selectable: true,
                headerTemplate: '<input class="k-checkbox allRowCheck" type="checkbox" onclick="CNSL430M_fnCheckAll(this);">',
            },
            {
                field: "regDtm",
                title: CNSL430M_langMap.get("CNSL430M.grid.regDtm"),
                width: 100,
                template: '#=regDtm == null ? "-" : kendo.toString(new Date(regDtm), "yyyy-MM-dd")#',
            },
            {
                field: "cntcCustId",
                title: GLOBAL.session.user.dmnCd == '200'||GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? CNSL430M_langMap.get("CNSL430M.grid.patientId"): CNSL430M_langMap.get("CNSL430M.grid.custId"),
                width: 100,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "cntcCustNmMsk",
                title: GLOBAL.session.user.dmnCd == '200'||GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? CNSL430M_langMap.get("CNSL430M.grid.patientNm"): CNSL430M_langMap.get("CNSL430M.grid.custNm"),
                width: 100,
                attributes: {style: "text-align : left;", class: "tdTooltip"},
            },
            {
                field: "trclmnId",
                title: CNSL430M_langMap.get("CNSL430M.grid.trclmnID"),
                width: 100,attributes: {style: "text-align : left;"},
            },
            {
                field: "decTrclmnNm",
                title: CNSL430M_langMap.get("CNSL430M.grid.trclmnNm"),
                width: 100,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "trclmnOrgNm",
                title: CNSL430M_langMap.get("CNSL430M.grid.trclmnOrg"),
                width: 200,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "trclCtt",
                title: CNSL430M_langMap.get("CNSL430M.grid.trclCtt"),
                width: "auto",
                attributes: {style: "text-align : left;"},
            },

            {
                field: "trclStCd",
                title: CNSL430M_langMap.get("CNSL430M.grid.trclStCd"),
                width: 80,
                template: '#if (trclStCd) {# #=Utils.getComCdNm(CNSL430M_cmmCodeList, "C0233", trclStCd)# #}#',
            },
            {
                field: "dspsrId",
                title: CNSL430M_langMap.get("CNSL430M.grid.dspsrId"),
                width: 100,attributes: {style: "text-align : left;"},
            },
            {
                field: "decDspsrNm",
                title: CNSL430M_langMap.get("CNSL430M.grid.dspsrNm"),
                width: 100,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "procDt",
                title: CNSL430M_langMap.get("CNSL430M.grid.dspsrDate"),
                width: 100,
                template: '#=procDt == null ? "-" : kendo.toString(new Date(procDt), "yyyy-MM-dd")#',
            },
            {
                field: "procStCd",
                title: CNSL430M_langMap.get("CNSL430M.grid.procStCd.500"),
                width: 100,
                template: '#if (procStCd) {# #=Utils.getComCdNm(CNSL430M_cmmCodeList, "C0157", procStCd)# #}#',
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
        selectable : true,
        noRecords: {template: `<div class="nodataMsg"><p>${CNSL430M_langMap.get("CNSL430M.grid.nodatafound")}</p></div>`},
    }).data("kendoGrid");

    CNSL430M_grdCNSL430M.tbody.on('dblclick', CNSL430M_onClick);
    CNSL430M_ToolTip = $("#grdCNSL430M").kendoTooltip({
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
            let dataItem = CNSL430M_grdCNSL430M.dataItem(e.target.closest("tr"));
            return dataItem.cntcCustNm;
        }
    }).data("kendoTooltip");

    restrictInput("#CNSL430M_cntcCustId", /^[a-zA-Z0-9_]*$/, /[^a-zA-Z0-9_]/g);
    restrictInput("#CNSL430M_cntcCustNm", /^[ㄱ-ㅎ가-힣]*$/, /[^ㄱ-ㅎ가-힣]/g);
    restrictInput("#CNSL430M [name=trclmnNm]", /^[ㄱ-ㅎ가-힣]*$/, /[^ㄱ-ㅎ가-힣]/g);
    restrictInput("#CNSL430M [name=dspsrNm]", /^[ㄱ-ㅎ가-힣]*$/, /[^ㄱ-ㅎ가-힣]/g);

    CNSL430M_init();

    Utils.ElementEnterKeyUp('trclmnNm', CNSL430M_fnSearchMyTransferHistory);
    Utils.ElementEnterKeyUp('dspsrNm', CNSL430M_fnSearchMyTransferHistory);
});

// 값 정규화
function restrictInput(selector, regex1, regex2) {
    $(selector).on('input', function() {
        const input = $(this).val();
        if (!regex1.test(input)) {
            $(this).val(input.replace(regex2, ''));
        }
    });
}

function CNSL430M_init() {
    CNSL430M_resizeGrid();
    CNSL430M_fnSelectCmmCode();
    CNSL430M_initSrchDateMultiSelect();
    MCNS_initTenant(CNSL430M_grdCNSL430M,CNSL430M_fnSearchMyTransferHistory);
}

$(window).resize(function () {
    CNSL430M_resizeGrid();
});

function CNSL430M_initSrchDateMultiSelect() {
    const CNSL430M_srchDateMultiSelect = [
        // {text: CNSL430M_langMap.get("CNSL.input.regDtm"), value: "1"},
        {text: CNSL430M_langMap.get("CNSL430M.input.trclDt"), value: "2"},
        {text: CNSL430M_langMap.get("CNSL430M.input.procDt"), value: "3"},
    ];
    // Utils.setKendoMultiSelectCustom(CNSL430M_srchDateMultiSelect, "#srchDateType_CNSL430M",
    //     "text", "value", false, "2");
}

function CNSL430M_resizeGrid() {
    // (헤더 + 푸터)영역 높이 제외
    const screenHeight = $(window).height() - 210;
    // (헤더 + 푸터 + 검색 )영역 높이 440
    CNSL430M_grdCNSL430M.element.find('.k-grid-content').css('height', screenHeight - 270);
}

function CNSL430M_fnSelectCmmCode() {
    const CNSL430M_data = {
        "codeList": [
            {"mgntItemCd": "C0157"},  // 처리상태코드 (1.미처리, 2.처리중, 3.처리완료, 4.포기)
            {"mgntItemCd": "C0233"},  // 이관상태코드 (1.이관 , 2.재이관)
        ]
    };
    Utils.ajaxSyncCall(
        "/comm/COMM100SEL01", JSON.stringify(CNSL430M_data), CNSL430M_fnsetCmmCode)
}

function CNSL430M_fnsetCmmCode(data) {
    CNSL430M_cmmCodeList = JSON.parse(data.codeList);
    Utils.setKendoComboBox(CNSL430M_cmmCodeList, "C0157", "#CNSL430M input[name=procStCd]", "", true);
}

function CNSL430M_fnResultTransferHistory(data) {

    window.kendo.ui.progress($("#grdCNSL430M"), false)

    CNSL430M_rawData = JSON.parse(data.CNSL430M);
    if (CNSL430M_rawData.length === 0) {
        CNSL430M_grdCNSL430M.dataSource.data([]);
        return;
    }

    CNSL430M_grdCNSL430M.dataSource.data(CNSL430M_rawData);
    CNSL430M_grdCNSL430M.dataSource.options.schema.data = CNSL430M_rawData;

    CNSL430M_grdCNSL430M.dataSource.page(1);
}

function CNSL430M_getParamValue(){

    let srchCondListObj;
    let CNSL430_srchType = $("#srchDateType_CNSL430M").data("kendoComboBox").value();
    if(CNSL430_srchType == "0") {
        srchCondListObj = ["3", "2"];
    }
    else if(CNSL430_srchType == "1") {
        srchCondListObj = ["2"];
    }
    else {
        srchCondListObj = ["3"];
    }

    return {
        tenantId: $('#CNSL430M_tenantId').val(),
        usrId: GLOBAL.session.user.usrId,  // TODO 테스트 종료 후 변경 필요
        cntcCustNm: $('#CNSL430M_cntcCustNm').val(),
        cntcCustId: $('#CNSL430M_cntcCustId').val(),
        trclmnNm: $('#CNSL430M [name=trclmnNm]').val(),
        dspsrNm: $('#CNSL430M [name=dspsrNm]').val(),
        procStCd: $('#CNSL430M [name=procStCd]').data('kendoComboBox').value(),
        srchDtFrom: MCNS_stringDateReg($('#CNSL430M_dateStart').val()),
        srchDtTo: MCNS_stringDateReg($('#CNSL430M_dateEnd').val()),
        srchCondList: srchCondListObj,
        usrGrd : GLOBAL.session.user.usrGrd
    }
}

function CNSL430M_fnSearchMyTransferHistory() {

    let fields = [
        {selector: "#CNSL430M_cntcCustId", minLength: 4, message: "고객번호는 최소 4자리를 입력해야 됩니다."},
        {selector: "#CNSL430M_cntcCustNm", minLength: 2, message: "고객명은 최소 2자리를 입력해야 됩니다."},
        {selector: "#CNSL430M [name=trclmnNm]", minLength: 2, message: "등록자는 최소 2자리를 입력해야 됩니다."},
        {selector: "#CNSL430M [name=dspsrNm]", minLength: 2, message: "처리자는 최소 4자리를 입력해야 됩니다."}
    ];

    for (const field of fields) {
        if (checkMinLength(field.selector, field.minLength)) {
            Utils.alert(field.message);
            return;
        }
    }

    const $tenantId = $('#CNSL430M_tenantId');
    const $tenantNm = $('#CNSL430M_tenantNm');
    CNSL430M_grdCNSL430M.dataSource.data([]);
    CNSL430M_grdCNSL430M.clearSelection();
    if (MCNS_checkTenant($tenantId, $tenantNm)) {
        const param = CNSL430M_getParamValue();
        CNSL430MDataSource.transport.read(param);
    }
}

// 값 길이 체크
function checkMinLength(selector, minLength) {
    return ($(selector).val().length > 0) ? ($(selector).val().length < minLength) : false;
}

function CNSL430M_onClick(e) {
    console.log(e.target.nodeName);
    if (e.target.nodeName !== "INPUT") {
        let clickRow = $(e.target).closest("tr");
        let rowDataItem = CNSL430M_grdCNSL430M.dataItem(clickRow);
        let CNSL430M_clickDataSet = {
            tenantId: rowDataItem.tenantId,
            unfyCntcHistNo: rowDataItem.unfyCntcHistNo,
            cnslHistSeq: rowDataItem.cnslHistSeq,
            trclSeq: rowDataItem.trclSeq,
        }
        CNSL430M_fnPopup_MCNS510P(CNSL430M_clickDataSet);
    }
}

function CNSL430M_fnPopup_MCNS510P(data) {
    Utils.openPop(GLOBAL.contextPath + "/mcns/MCNS510P", "MCNS510P", 1000, 760, data);
}

function CNSL430M_dataClear(e) {
    if (Utils.isNull(e.value)) $(e).data(e.name, "");
}

$("#CNSL430M [name=gridBtn]").on('click', function (e) {
    const getValue = e.target.value;
    const getTitle = e.target.innerHTML;
    Utils.confirm( CNSL430M_langMap.get("CNSL430M.select") + getTitle +  CNSL430M_langMap.get("CNSL430M.do"), () => {
        if (getValue === '2') { // 분배 - 할당,재할당은 처리자 지정필수;
            if (CNSL430M_gridSelectedItems.length > 1) {
                Utils.alert(CNSL430M_langMap.get("CNSL430M.oneSelect1"))
                return;
            }
            CNSL430M_transferProcess(getValue)
        } else {
            CNSL430M_updateData("", getValue)
        }
    })
})

function CNSL430M_transferProcess(getValue) {
    if (CNSL430M_gridSelectedItems.find(x => x.dspsrId)) {
        Utils.alert('이미 상담사가 배정 된 내역입니다. <br> 재이관 하시겠습니까?',
            () => {
                CNSL430M_findTransferUsr();
            })
    }else{
        Utils.setCallbackFunction("CNSL430M_fnSYSM212PCallback", function (data) {
            CNSL430M_updateData(...data, getValue);
        });
        CNSL430M_findTransferUsr();
    }
}


function CNSL430M_findTransferUsr() {
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM212P", "SYSM212P", 500, 810, {callbackKey: "CNSL430M_fnSYSM212PCallback"})
}


function CNSL430M_fnSearchUser(name) {
    if (name.nodeName === 'BUTTON') {
        name = name.previousElementSibling.name;
    }
    const targetInput = document.getElementsByName(name);
    Utils.setCallbackFunction("CNSL430M_fnSYSM214PCallBack", function (usrInfo) {
        $(targetInput).val(usrInfo.decUsrNm);
        $(targetInput).data(name, usrInfo.usrId);
    })
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM214P", "SYSM214P", 900, 600, {callbackKey: "CNSL430M_fnSYSM214PCallBack"})
}

function CNSL430M_updateData(data, value) {
    // 완료 = 3, 포기 = 4

    const updateObj = CNSL430M_gridSelectedItems.map((obj) => {
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
    // CNSL430MDataSource.transport.update(updateObj);
    if (Utils.isNotNull(data)) {
        return CNSL430MDataSource.transport.create(updateObj);
    } else {
        return CNSL430MDataSource.transport.update(updateObj);
    }
}

$("#CNSL430M [name=excelExport]").on('click', (function () {
    const pageSize = CNSL430M_grdCNSL430M._data.length;
    if (pageSize === 0) {
        Utils.alert('데이터가 존재하지 않습니다.');
        return;
    }
    const dataSourceTotal = CNSL430M_grdCNSL430M.dataSource.total();
    CNSL430M_grdCNSL430M.dataSource.pageSize(dataSourceTotal);
    CNSL430M_grdCNSL430M.bind("excelExport", function (e) {
        e.workbook.fileName =CNSL430M_langMap.get("CNSL430M.title")
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
            if(selectableNum<1){
                sheet.rows[i].cells[0].value = i;
            }
        }
    });

    CNSL430M_grdCNSL430M.saveAsExcel();
    CNSL430M_grdCNSL430M.dataSource.pageSize(pageSize);

}))
// $('#CNSL430M input').on('change', function () {
//     MCNS_inputValidation(this, 'CNSL430M');
// });


function CNSL430M_fnCheckAll(e) {
    let currentChecked = $(e).prop('checked');
    let data = CNSL430M_grdCNSL430M.dataSource.data();
    // let deselectedRows = [];
    let length = data.length;

    for (let i = 0; i < length; i++) {
        let currentDataItem = data[i];
        let row = CNSL430M_grdCNSL430M.tbody.find("tr[data-uid='" + currentDataItem.uid + "']");

        if (currentDataItem.procStCd !== "3" && currentDataItem.procStCd !== "5") {
            $(row).find(".k-checkbox").prop("checked", currentChecked);
        }
    }

    // $.each(deselectedRows, function (index, row) {
    //     setTimeout(function () {
    //         let currRowCheckbox = $(row).find(".k-checkbox")
    //         $(currRowCheckbox).attr("checked", false);
    //     });
    // });
}

function CNSL430M_fnCnslTab(){

    let CNSL430M_selData = [];
    $('#grdCNSL430M .k-checkbox').each(function (idx, row) {
        if($(row).attr('aria-checked')=='true'){
            let	CNSL430M_tr		= $(row).closest('tr');
            let	CNSL430M_item	= Object.assign({}, CNSL430M_grdCNSL430M.dataItem(CNSL430M_tr));

            CNSL430M_selData.push(CNSL430M_item);
        }
    });

    if(CNSL430M_selData.length>1){
        Utils.alert(CNSL430M_langMap.get("CNSL430M.oneSelect2"));
        return;
    }else if(CNSL430M_selData.length==0){
        Utils.alert(CNSL430M_langMap.get("CNSL430M.noSelect"))
        return;
    }

    TabUtils.openCnslMainTab(4,CNSL430M_selData[0].trclSeq,CNSL430M_langMap.get("CNSL.Comm.Not.Found.cnsl.Main"),"main");
}

$('#CNSL430M_cntcCustId').on("keyup",function(key){
    if(key.keyCode==13) {
        CNSL430M_fnSearchMyTransferHistory();
    }
});

$('#CNSL430M_cntcCustNm').on("keyup",function(key){
    if(key.keyCode==13) {
        CNSL430M_fnSearchMyTransferHistory();
    }
});
