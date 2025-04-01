/***********************************************************************************************
 * Program Name : 로그인이력조회 - 메인(SYSM230M.js)
 * Creator      : mhlee
 * Create Date  : 2022.01.25
 * Description  : 로그인이력조회 - 메인
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.01.25     mhlee            최초작성
 * 2022.03.24      mhlee             1. 변수명 및 함수 로직 변경 (공통유틸 적용)
 *                                   2. ajax 분리하여 자동 로드 막기
 *                                   3. param 값 없을 시 alert 추가
 ************************************************************************************************/

var SYSM230M_cmmCodeList, SYSM230MDataSource, SYSM230M_grdSYSM230M;
$(document).ready(function () {
    SYSM230MDataSource = {
        transport: {
            read: function (SYSM230M_param) {
                if (Utils.isNull(SYSM230M_param.data)) {
                    Utils.ajaxCall(
                        "/sysm/SYSM230SEL01",
                        JSON.stringify(SYSM230M_param),
                        SYSM230M_fnResultLginHistory,
                        window.kendo.ui.progress($("#grdSYSM230M"), true),
                        window.kendo.ui.progress($("#grdSYSM230M"), false))
                } else {
                    window.kendo.ui.progress($("#grdSYSM230M"), false)
                }
            },
        },
        schema: {
            type: "json",
            model: {
                fields: {
                    sysLogDdSi: {field: "lstLginDate", type: "date"},
                    tenantId: {field: "tenantId", type: "string"},
                    fmNm: {field: "fmNm", type: "date"},
                    orgPath: {field: "orgPath", type: "string"},
                    usrId: {field: "usrId", type: "string"},
                    decUsrNm: {field: "decUsrNm", type: "string"},
                    sysLogMsg: {field: "sysLogMsg", type: "string"},
                    regDtm: {field: "regDtm", type: "date"},
                }
            }
        }
    }
    SYSM230M_grdSYSM230M = $("#grdSYSM230M").kendoGrid({
        dataSource: SYSM230MDataSource,
        autoBind: false,
        resizable: true,
        sortable: true,
        sort: function (e) {
            if (SYSM230M_grdSYSM230M.dataSource.total() === 0) {
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
            {
                field: "sysLogDdSi",
                title: SYSM230M_langMap.get("SYSM230M.grid.column.sysLogDdSi"),
                width: 100,
                template: '#=sysLogDdSi == null ? "" : kendo.format("{0:yyyy-MM-dd}",new Date(sysLogDdSi))#'
            },
            {
                field: "tenantId",
                title: SYSM230M_langMap.get("SYSM230M.grid.column.tenantId"),
                width: 60,
            },
            {
                field: "fmNm",
                title: SYSM230M_langMap.get("SYSM230M.grid.column.fmNm"),
                width: 100,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "orgPath",
                title: SYSM230M_langMap.get("SYSM230M.grid.column.orgPath"),
                type: "String",
                width: 280,
                attributes: {style: "text-align : left;"},
            },
            {
                field: "usrId",
                title: SYSM230M_langMap.get("SYSM230M.grid.column.usrId"),
                width: 60,
                type: "String"
            },
            {
                field: "decUsrNm",
                title: SYSM230M_langMap.get("SYSM230M.grid.column.usrNm"),
                width: 80,
                type: "String",
                attributes: {style: "text-align : left;"},
            },
            {
                field: "sysLogMsg",
                title: SYSM230M_langMap.get("SYSM230M.grid.column.acStRsnCd"),
                width: 100,
            },
            {
                field: "regDtm",
                title: SYSM230M_langMap.get("SYSM230M.grid.column.regDtm"),
                width: 150,
                template: '#=regDtm == null ? "" : kendo.toString(new Date(regDtm), "yyyy-MM-dd HH:mm")#'
            },
        ],
        noRecords: {template: `<div class="nodataMsg"><p>${SYSM230M_langMap.get("SYSM230M.grid.nodatafound")}</p></div>`},
    }).data("kendoGrid");

    SYSM230M_init();
});
function SYSM230M_init() {
    SYSM230M_resizeGrid();
    SYSM230M_fnSelectCmmCode();
    SYSM230M_initTenant();
    setTimeout(()=>SYSM230M_fnSearchLginHistory(),100);
}

function SYSM230M_initUsrMultiSelect() {
    const userInfo = GLOBAL.session.user;
    const usrData = [{decUsrNm: userInfo.decUsrNm, usrId: userInfo.usrId}];
    Utils.setKendoMultiSelectCustom(usrData, '#SYSM230M input[name=SYSM230M_UsrMultiSelect]',
        'decUsrNm', 'usrId',usrData.length===1, usrData);
}

function SYSM230M_initOrgMultiSelect() {
    Utils.ajaxSyncCall(
        "/sysm/SYSM210SEL01",
        JSON.stringify({tenantId: $("#SYSM230M_tenantId").val()}),
        function (data) {
            const orgData = data.tree.filter(e => e.orgCd === GLOBAL.session.user.orgCd);
            Utils.setKendoMultiSelectCustom(orgData, '#SYSM230M input[name=SYSM230M_OrgMultiSelect]',
                'orgPath', 'orgCd',orgData.length===1, orgData);
        })
}

function SYSM230M_initTenant() {
    const SYSM230M_before = () => SYSM230M_grdSYSM230M.dataSource.data([]);

    const SYSM230M_lengthTrue = () => {
        if (CMMN_SEARCH_TENANT["SYSM230M"].tenantId === GLOBAL.session.user.tenantId) {
            SYSM230M_initUsrMultiSelect();
            SYSM230M_initOrgMultiSelect();
        }
        SYSM230M_fnSearchLginHistory();

    }
    const SYSM230M_lengthFalse = () => {
        $("#SYSM230M input[name=SYSM230M_OrgMultiSelect]").data("kendoMultiSelect").dataSource.data([]);
        $("#SYSM230M input[name=SYSM230M_UsrMultiSelect]").data("kendoMultiSelect").dataSource.data([]);
        $('#SYSM230M_tenantNm').val('');
    }
    CMMN_SEARCH_TENANT["SYSM230M"].fnInit(SYSM230M_before,SYSM230M_lengthTrue,SYSM230M_lengthFalse);
}



$(window).resize(function () {
    SYSM230M_resizeGrid();
});

function SYSM230M_resizeGrid() {
    // (헤더 + 푸터)영역 높이 제외
    const screenHeight = $(window).height() - 210;
    // (헤더 + 푸터 + 검색 )영역 높이 440
    SYSM230M_grdSYSM230M.element.find('.k-grid-content').css('height', screenHeight - 260);
}

function SYSM230M_fnSelectCmmCode() {
    let SYSM230M_data = {"codeList": [{"mgntItemCd": "C0022"},]};
    Utils.ajaxCall(
        "/comm/COMM100SEL01", JSON.stringify(SYSM230M_data),
        function (data) {SYSM230M_cmmCodeList = JSON.parse(data.codeList);})
}

function SYSM230M_fnSearchOrgPopup_SYSM210P() {
    Utils.setCallbackFunction("SYSM230M_fnOrgCallBack", function (item) {
        Utils.setKendoMultiSelectCustom(item, '#SYSM230M input[name=SYSM230M_OrgMultiSelect]',
            'orgPath', 'orgCd',item.length===1, item);
    });
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM210P", "SYSM210P", 410, 610, {
        callbackKey: "SYSM230M_fnOrgCallBack",
        tenantId: $('#SYSM230M_tenantId').val()
    });
}

//사용자 찾기(다건)
function SYSM230M_fnSearchUsrPopup_SYSM211P() {
    Utils.setCallbackFunction("SYSM230M_fnUsrCallback", function (item) {
        let reformattedUsrArray = item.map(function (obj) {
            let rObj = {};
            for (const [key, value] of Object.entries(obj)) {
                rObj[key] = value
            }
            return rObj;
        });
        
        Utils.setKendoMultiSelectCustom(reformattedUsrArray, '#SYSM230M input[name=SYSM230M_UsrMultiSelect]','decUsrNm', 'usrId',reformattedUsrArray.length===0, reformattedUsrArray);
        
    });
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM211P", "SYSM211P", 960, 535, {callbackKey: "SYSM230M_fnUsrCallback"});
}

function SYSM230M_fnResultLginHistory(data) {
    let jsonDecode = JSON.parse(data.SYSM230M);
    if (jsonDecode.length === 0) {
        SYSM230M_grdSYSM230M.dataSource.data([]);
        return;
    }
    SYSM230M_grdSYSM230M.dataSource.data(jsonDecode);
    SYSM230M_grdSYSM230M.dataSource.options.schema.data = jsonDecode;
}

function SYSM230M_getParamValue() {
    return {
        tenantId: $('#SYSM230M_tenantId').val(),
        orgList: $('#SYSM230M input[name=SYSM230M_OrgMultiSelect]').data("kendoMultiSelect").value(),
        usrList: $('#SYSM230M input[name=SYSM230M_UsrMultiSelect]').data("kendoMultiSelect").value(),
        fromDate: $('#SYSM230M_dateStart').val(),
        toDate: $('#SYSM230M_dateEnd').val(),
    }
}

function SYSM230M_fnSearchLginHistory() {
    Utils.markingRequiredField();
    if (Utils.isNull($('#SYSM230M_tenantId').val())) {
        Utils.alert(SYSM230M_langMap.get("SYSM230M.tenantId.required.msg"),
            () => $("#SYSM230M_tenantId").focus());
        return;
    }

    const param = SYSM230M_getParamValue();
    SYSM230MDataSource.transport.read(param);
}

function SYSM230M_excelExport() {
    const pageSize = SYSM230M_grdSYSM230M._data.length;
    const dataSourceTotal = SYSM230M_grdSYSM230M.dataSource.total();
    SYSM230M_grdSYSM230M.dataSource.pageSize(dataSourceTotal);
    SYSM230M_grdSYSM230M.bind("excelExport", function (e) {
        e.workbook.fileName = `${SYSM230M_langMap.get("SYSM230M.title")}.xlsx`;
        let sheet = e.workbook.sheets[0];

        let setDataItem = {};
        let selectableNum = 0;
        if (this.columns[0].selectable) {
            selectableNum = 1
        }
        this.columns.forEach(function (item, index) {
            if (Utils.isNotNull(item.template)) {
                let targetTemplate = kendo.template(item.template);  // 해당 컬럼의 템플릿
                let fieldName = item.field;                          // 해당 컬럼의 필드네임
                for (let i = 1; i < sheet.rows.length; i++) {        // Grid Row Data 반복문
                    let row = sheet.rows[i];                         // 0번은 헤더, 1번부터 데이터
                    setDataItem = {
                        [fieldName]: row.cells[(index - selectableNum)].value         // 선택 필드명에 해당하는 Row Data의 value
                    }
                    row.cells[(index - selectableNum)].value = targetTemplate(setDataItem); // 선택 된 Value를 Template로 변환
                }
            }
        })
    });
    SYSM230M_grdSYSM230M.saveAsExcel();
    SYSM230M_grdSYSM230M.dataSource.pageSize(pageSize);

}

// console.log(item);              // Grid 컬럼의 템플릿,필드명,타이틀 등
// console.log(index);             // 위에서 선택 된 아이템의 인덱스 ( 1, 5 , 6, 8)
// console.log(sheet.rows[index]); // 해당 인덱스 (1,5,6,8)에 선택 된 row정보
// console.log(sheet.rows);        // 전체 row (Grid data)
$('#SYSM230M input').on('focus', function() {
    $(this).removeClass("inputError");
})

// $('#SYSM230M input').on('change', function () {
//     let $dateStart = $("#SYSM230M_dateStart"), $dateEnd = $("#SYSM230M_dateEnd");
//     const replaceDate = (value) => {
//         return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
//     }
//     const regExp_date = /(^(19|20)\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
//     const regExp_dateFormat = /(^(19|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;
//     const thisVal = $(this).val();
//
//     switch ($(this).attr("name")) {
//         case "SYSM230M_dateEnd":
//             if (regExp_dateFormat.test(thisVal)) {
//                 $(this).val(replaceDate(thisVal));
//             } else if (!regExp_date.test(thisVal)) {
//                 SYSM230M_srchDateChangeBtnClass();
//                 $(this).val("") && $dateEnd.addClass("inputError")
//                 Utils.alert(SYSM230M_langMap.get("search.date.type.errors"), function() {
//                     return $dateEnd.focus();
//                 });
//                 return false;
//             }
//             if ($(this).val() < $dateStart.val()) {
//                 Utils.alert(SYSM230M_langMap.get("search.date.period.errors"));
//                 return $(this).val($dateStart.val());
//             }
//             break;
//         case "SYSM230M_dateStart":
//             if (regExp_dateFormat.test(thisVal)) {
//                 $(this).val(replaceDate(thisVal));
//             } else if (!regExp_date.test(thisVal)) {
//                 SYSM230M_srchDateChangeBtnClass();
//                 Utils.alert(SYSM230M_langMap.get("search.date.type.errors"), function() {
//                     $dateStart.val("") && $dateStart.addClass("inputError");
//                 });
//                 return $(this).focus();
//             }
//             if ($(this).val() > $dateEnd.val()) {
//                 Utils.alert(SYSM230M_langMap.get("search.date.period.errors"))
//                 return $(this).val($dateEnd.val());
//             }
//             break;
//
//     }
// });

// 재사용 가능 함수

// SYSM230M_initSearchMultiSelect();
// function SYSM230M_initUsrMultiSelect() {
//     const userInfo = GLOBAL.session.user;
//     SYSM230M_setKendoMultiSelect([{decUsrNm: userInfo.decUsrNm, usrId: userInfo.usrId}]
//         , '#SYSM230M input[name=SYSM230M_UsrMultiSelect]', 'decUsrNm', 'usrId');
// }
// function SYSM230M_initSearchMultiSelect() {
//     const multiSelectDataSourceInit = [];
//     const multiSelectOptionInit = {
//         dataTextField: "text",
//         dataValueField: "value",
//         dataSource: multiSelectDataSourceInit,
//         placeholder: SYSM230M_langMap.get("input.select"),
//         autoClose: false,
//         clearButton: false,
//         tagMode: "single",
//         height: 200,
//     };
//     let SYSM230M_OrgMultiSelect = $("#SYSM230M input[name=SYSM230M_OrgMultiSelect]").kendoMultiSelect(multiSelectOptionInit).data("kendoMultiSelect");
//     let SYSM230M_UsrMultiSelect = $("#SYSM230M input[name=SYSM230M_UsrMultiSelect]").kendoMultiSelect(multiSelectOptionInit).data("kendoMultiSelect");
//     SYSM230M_OrgMultiSelect.ul.addClass('multiSelect');
//     SYSM230M_UsrMultiSelect.ul.addClass('multiSelect');
// }

// function SYSM230M_setKendoMultiSelect(codeList, target, setText, setValue) {
//     console.log(codeList);
//     let options = {
//         placeholder: SYSM230M_langMap.get("input.select"),
//         dataTextField: "text",
//         dataValueField: "value",
//         autoClose: false,
//         autoBind: false,
//         clearButton: false,
//         tagMode: codeList.length > 1 ? "single" : "multiple",
//         downArrow: false,
//         height: 200,
//         dataSource: codeList.filter(function (code) {
//             try {
//                 if (code[setText] && code[setValue]) {
//                     code.text = code[setText]
//                     code.value = code[setValue]
//                     return code;
//                 }
//             } catch (e) {
//                 console.log(e);
//             }
//         }),
//         itemTemplate: '<p class="multiCheck">#: text #</p>',
//     };
//
//     let kendoMultiSelect = $(target).kendoMultiSelect(options).data("kendoMultiSelect");
//     kendoMultiSelect.ul.addClass('multiSelect');
//     kendoMultiSelect.dataSource.filter({});
//     kendoMultiSelect.value(options.dataSource);
//
//     return kendoMultiSelect;
// }