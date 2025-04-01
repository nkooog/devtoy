/***********************************************************************************************
 * Program Name : 단어사전관리(COMM130P.js)
 * Creator      : mhlee
 * Create Date  : 2022.08.17
 * Description  : 단어사전관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.08.17     sukim            최초생성
 ************************************************************************************************/
var COMM130M_cmmCodeList, COMM130M_grdCOMM130M, COMM130MDataSource, COMM130M_DictList, COMM130M_selectItems=[];
$(document).ready(function () {
    COMM130MDataSource = {
        transport: {
            read: function (param) {
                console.log(JSON.stringify(param));
                Utils.ajaxCall(
                    "/kmst/COMM130SEL01",
                    JSON.stringify(param),
                    COMM130M_fnResultDictList,
                    window.kendo.ui.progress($("#grdCOMM130M"), true),
                    window.kendo.ui.progress($("#grdCOMM130M"), false)
                )
            },
            update: function (param) {
                Utils.ajaxCall(
                    "/kmst/COMM130INS01",
                    JSON.stringify(param), function (result) {
                        Utils.alert(result.msg, COMM130M_fnSearchDict);
                    },
                )
            },
            destroy: function (param) {
                Utils.ajaxCall(
                    "/kmst/COMM130DEL01",
                    JSON.stringify(param), function (result) {
                        Utils.alert(result.msg, COMM130M_fnSearchDict);
                    },
                    window.kendo.ui.progress($("#grdCOMM130M"), true),
                    window.kendo.ui.progress($("#grdCOMM130M"), false)
                )
            },
            bulkInsert: function (param) {
                Utils.ajaxCall(
                    "/kmst/COMM130BulkInsert",
                    JSON.stringify(param), function (result) {
                        Utils.alert(result.msg, COMM130M_fnSearchDict);
                    },
                )
            },
            bulkDelete: function (param) {
                Utils.ajaxCall(
                    "/kmst/COMM130BulkDelete",
                    JSON.stringify(param), function (result) {
                        Utils.alert(result.msg, COMM130M_fnInitDetailForm);
                    },
                )
            },
        },
        schema: {
            type: "json",
            model: {
                fields: {
                    // Hidden columns
                    wdPhysNm: {field: "wdPhysDesc", type: "string"},       //물리설명
                    regrId: {field: "regrId", type: "string"},           //최종등록자 ID
                    regrNm: {field: "regrNm", type: "string"},           //최종등록자 이름
                    // Grid
                    mlingCd: {field: "mlingCd", type: "string"},         //언어
                    wdLgcNm: {field: "wdLgcNm", type: "string"},         //논리명
                    wdLgcDesc: {field: "wdPhysNm", type: "string"},     //물리명
                    wdPhysDesc: {field: "wdLgcDesc", type: "string"},   //논리설명
                    regDtm: {field: "regDtm", type: "string"},           //최종등록일시
                    regrUsr: {field: "regrUsr", type: "string"},         //최종등록자
                }
            }
        }
    }

    COMM130M_grdCOMM130M = $("#grdCOMM130M").kendoGrid({
        dataSource: COMM130MDataSource,
        autoBind: false,
        resizable: true,
        refresh: true,
        selectable: 'multiple',
        change: COMM130M_gridOnClick,
        sortable: true,
        sort: function (e) {
            if (COMM130M_grdCOMM130M.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        dataBound: function(e) {
            e.sender.select("tr:eq(0)");
        },
        dataBinding: function () {
            record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        pageable: {
            refresh: false
            , pageSizes: [100, 200, 500]
            , buttonCount: 10
            , pageSize: 100
        },
        columns: [
            {field: "wdPhysDesc", hidden: true},
            {field: "regrId", hidden: true},
            {field: "regrNm", hidden: true},
            {width: 40, selectable:true,
                // template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',
                // title: "선택",
            },
            {title: "No", width: 60, template: "#= ++record #"},
            {
                field: "mlingCd", type: "string", width: 120,
                title: COMM130M_langMap.get("COMM130M.grid.column.mlingCd"),
                template: function (dataItem) {
                    return Utils.getComCdNm(COMM130M_cmmCodeList, 'C0111', dataItem.mlingCd);
                }
            },
            {
                field: "wdLgcNm", type: "string", width: 200,
                title: COMM130M_langMap.get("COMM130M.grid.column.wdLgcNm"),
                attributes: {style: "text-align : left;"},
            },
            {
                field: "wdPhysNm", type: "string", width: 200,
                title: COMM130M_langMap.get("COMM130M.grid.column.wdPhysNm"),
            },
            {
                field: "wdLgcDesc", type: "string", width: "auto",
                title: COMM130M_langMap.get("COMM130M.grid.column.wdLgcDesc"),
                attributes: {style: "text-align : left;"},
            },
            {
                field: "regDtm", type: "string", width: 150,
                title: COMM130M_langMap.get("COMM130M.grid.column.regDtm"),
                template: '#=regDtm == null ? "" : kendo.toString(new Date(regDtm), "yyyy-MM-dd HH:mm:ss")#'
            },
            {
                field: "regrUsr", type: "string", width: 150,
                title: COMM130M_langMap.get("COMM130M.grid.column.regrUsr"),
            },
        ],
        noRecords: {template: `<div class="nodataMsg"><p>${COMM130M_langMap.get("COMM130M.grid.nodatafound")}</p></div>`},
    }).data("kendoGrid");

    // COMM130M_grdCOMM130M.tbody.on('click', COMM130M_gridOnClick);
    COMM130M_init();

});

function COMM130M_init() {
    COMM130M_resizeGrid();
    COMM130M_fnSelectCmmCode();
    return COMM130M_fnSearchDict();
}

$(window).resize(function () {
    COMM130M_resizeGrid();
});

function COMM130M_resizeGrid() {
    // (헤더 + 푸터)영역 높이 제외
    const screenHeight = $(window).height() - 210;
    // (헤더 + 푸터 + 검색 )영역 높이 440
    COMM130M_grdCOMM130M.element.find('.k-grid-content').css('height', screenHeight - 505);
}

function COMM130M_fnSelectCmmCode() {
    const COMM130M_data = {
        "codeList": [
            {"mgntItemCd": "C0111"}, //다국어코드
        ]
    };
    Utils.ajaxSyncCall(
        "/comm/COMM100SEL01",
        JSON.stringify(COMM130M_data),
        COMM130M_fnsetCmmCode)
}

function COMM130M_fnsetCmmCode(data) {
    COMM130M_cmmCodeList = JSON.parse(data.codeList);
    Utils.setKendoComboBox(COMM130M_cmmCodeList, "C0111", "#COMM130M_mlingCdCombo", "", true);
    Utils.setKendoComboBox(COMM130M_cmmCodeList, "C0111", "#COMM130Detail_mlingCd", "", false);
}


function COMM130M_fnSearchDict() {
    COMM130MDataSource.transport.read(COMM130M_getParamValue());
}

function COMM130M_fnResultDictList(data) {
    COMM130M_DictList = JSON.parse(data.COMM130M);
    COMM130M_grdCOMM130M.dataSource.data(COMM130M_DictList);
    COMM130M_grdCOMM130M.dataSource.options.schema.data = COMM130M_DictList;
}

function COMM130M_gridOnClick(e) {
    if (COMM130M_grdCOMM130M.dataSource.total() === 0) {
        e.preventDefault();
        return;
    }
    const selectRow = COMM130M_grdCOMM130M.dataItem(e.sender.select());
    if (selectRow.size === 0) {
        return;
    }
    COMM130M_selectItems = [];
    let rows = e.sender.select();
    rows.each(function() {
        COMM130M_selectItems.push(COMM130M_grdCOMM130M.dataItem(this));
    });

    COMM130M_detailBtnList.attr('disabled', false);
    $('[id^=COMM130Detail]').removeClass('inputError');

    const set = COMM130M_fnInputDetailData();
    set.fnSetEnterInInput('wdLgcNm', selectRow.wdLgcNm);
    set.fnSetEnterInInput('wdPhysNm', selectRow.wdPhysNm);
    set.fnSetEnterInInput('wdLgcDesc', selectRow.wdLgcDesc);
    set.fnSetEnterInInput('wdPhysDesc', selectRow.wdPhysDesc);
    set.fnSetEnterInTD('regDtm', kendo.toString(new Date(selectRow.regDtm), "yyyy-MM-dd HH:mm:ss"));
    set.fnSetEnterInTD('regrUsr', selectRow.regrUsr);
    Utils.setKendoComboBox(COMM130M_cmmCodeList, "C0111", "#COMM130Detail_mlingCd", selectRow.mlingCd, false);
    $('#COMM130Detail_regrUsr').data({'usrId': selectRow.regrId, 'orgCd': selectRow.regrOrgCd});
}

function COMM130M_getParamValue() {
    return {
        mlingCd: $('#COMM130M_mlingCdCombo').data('kendoComboBox').value(),
        wdLgcNm: $('#COMM130M_wdLgcNm').val(),
        wdPhysNm: $('#COMM130M_wdPhysNm').val(),
    }
}

function COMM130M_fnInputDetailData() {
    return {
        fnSetEnterInTD: (key, value) => $("#COMM130Detail_" + key).html(value),
        fnSetEnterInInput: (key, value) => $("#COMM130Detail_" + key).val(value),
    }
}

function COMM130M_fnInitDetailForm() {
    $('td[id^=COMM130Detail]').text('');
    $('input[id^=COMM130Detail]').val('');
    $('textarea[id^=COMM130Detail]').val('');
    $('#COMM130Detail_mlingCd').data('kendoComboBox').value(GLOBAL.session.user.mlingCd);
    COMM130M_grdCOMM130M.clearSelection();
}

function COMM130M_fnValidation() {

    Utils.markingRequiredField();
    const newDict = COMM130M_langMap.get("COMM130M.insert.msg");
    const existDict = COMM130M_langMap.get("COMM130M.update.msg");
    const regExp_name = /^[가-힣\s]+$/;
    const $mlingComboBox = $('#COMM130Detail_mlingCd').data('kendoComboBox');
    const $wdLgcNm = $('#COMM130Detail_wdLgcNm');
    const $wdPhysNm = $('#COMM130Detail_wdPhysNm');
    const $wdLgcDesc = $('#COMM130Detail_wdLgcDesc');
    const $wdPhysDesc = $('#COMM130Detail_wdPhysDesc');
    if (Utils.isNull($wdLgcNm.val())) {
        Utils.alert(COMM130M_langMap.get("COMM130M.valid.logicalNm"), () => {
            return $wdLgcNm.focus();
        });
        return;
    }
    if (Utils.isNull($wdPhysNm.val())) {
        Utils.alert(COMM130M_langMap.get("COMM130M.valid.physicalNm"), () => {
            return $wdPhysNm.focus();
        });
        return;
    }
    if (Utils.isNull($wdLgcDesc.val())) {
        Utils.alert(COMM130M_langMap.get("COMM130M.valid.logicalDesc"), () => {
            return $wdLgcDesc.focus();
        });
        return;
    }
    if (Utils.isNull($wdPhysDesc.val())) {
        Utils.alert(COMM130M_langMap.get("COMM130M.valid.physicalDesc"), () => {
            return $wdPhysDesc.focus();
        });
        return;
    }

    const ment = Utils.isNull(COMM130M_DictList.find(x=>x.wdLgcNm === $wdLgcNm.val())) ? newDict : existDict;
    Utils.alert(ment,
        ()=> COMM130MDataSource.transport.update({
        mlingCd: $mlingComboBox.value(),
        wdLgcNm: $wdLgcNm.val(),
        wdPhysNm: $wdPhysNm.val(),
        wdLgcDesc: $wdLgcDesc.val(),
        wdPhysDesc: $wdPhysDesc.val(),
        regrId: GLOBAL.session.user.usrId,
        regrOrgCd: GLOBAL.session.user.orgCd,
    }))

}

function COMM130M_deleteDict (updateList) {
    COMM130MDataSource.transport.destroy(updateList);
}

function COMM130M_BulkDelete () {
    //TODO 등급체크 추가 필요
    COMM130MDataSource.transport.bulkDelete();
}

function COMM130M_uploadingDictExcelFile(obj) {
    Utils.confirm(`[${obj.files[0].name}] <br> ${COMM130M_langMap.get("COMM130M.info.upload")}`,
        ()=> {
            let formData = new FormData(document.getElementById('COMM130M_uploadForm'));
            $.ajax({
                url: "/bcs/kmst/COMM130UploadExcel",
                data: formData,
                enctype: 'multipart/form-data',
                processData: false, //필수(중요)
                contentType: false, //필수(중요)
                type: "POST",
                error: function(xhr, status, error){
                    console.log(xhr,status,error);
                },
                success : function(data){
                    const resultMsg = ''.concat(data.msg,'(',data.result,'개)')
                    Utils.alert(resultMsg, () => COMM130M_fnSearchDict())
                },
                beforeSend : function () {window.kendo.ui.progress($("#grdCOMM130M"), true)},
                complete: function () {window.kendo.ui.progress($("#grdCOMM130M"), false)},
            });
        }, false)
}

let COMM130M_detailBtnList = $("#COMM130M_button button");
for (let i = 0; i < COMM130M_detailBtnList.length; i++) {
    COMM130M_detailBtnList.eq(i).click(function () {
        const wdLgcNm = $('#COMM130Detail_wdLgcNm').val();
        switch (i) {
            case 0 :
                Utils.alert(COMM130M_langMap.get("COMM130M.valid.delAllData"),
                    ()=>COMM130M_BulkDelete());
                break;
            case 1 :
                COMM130M_detailBtnList.eq(0).attr('disabled',true);
                COMM130M_detailBtnList.eq(2).attr('disabled',true);
                COMM130M_fnInitDetailForm();
                break;
            case 2 :
                const deleteList = COMM130M_selectItems.map(x => { return {mlingCd:x.mlingCd, wdLgcNm:x.wdLgcNm}});
                const ment = deleteList.length >= 1 ? ''.concat('[',COMM130M_langMap.get("COMM130M.selection"),':',deleteList.length,']') : wdLgcNm
                Utils.alert(ment + COMM130M_langMap.get("COMM130M.valid.delDict"), ()=>COMM130M_deleteDict(deleteList));
                break;
            case 3 :
                COMM130M_fnValidation();
                break;
        }
    })
}