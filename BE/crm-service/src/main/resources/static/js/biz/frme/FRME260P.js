/***********************************************************************************************
 * Program Name : 채팅 인사말 - 팝업(FRME260P.js)
 * Creator      : mhlee
 * Create Date  : 2022.06.07
 * Description  : 채팅 인사말 - 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.06.07     mhlee            최초작성

 ************************************************************************************************/
var FRME260P_cmmCodeList, FRME260PDataSource, FRME260P_grdFRME260P, FRME260P_rawData, FRME260P_newFlag,
    FRME260P_editor, FRME260P_selectedItem
let FRME260P_pharsTypeFilter = new Array(4);
$(document).ready(function () {
    FRME260P_newFlag = false;
    FRME260PDataSource = {
        transport: {
            read: function (param) {
                FRME260P_newFlag = false;
                if (Utils.isNull(param.data)) {
                    Utils.ajaxCall(
                        "/frme/FRME260SEL01",
                        JSON.stringify(param),
                        FRME260P_fnResultGreetingsList,
                        window.kendo.ui.progress($("#grdFRME260P"), true),
                        window.kendo.ui.progress($("#grdFRME260P"), false))
                } else {
                    window.kendo.ui.progress($("#grdFRME260P"), false)
                }
            },
            update: function (param) {
                Utils.ajaxCall(
                    "/frme/FRME260UPT01",
                    JSON.stringify(param),
                    function (data) {
                        Utils.alert(data.msg, FRME260P_fnSearchGreetings);
                    }
                )
            },
            create: function (param) {
                Utils.ajaxCall(
                    "/sysm/SYSM440INS01",
                    JSON.stringify(param),
                    function (data) {
                        Utils.alert(data.msg, FRME260P_fnSearchGreetings);
                    });
            },
            destroy: function (param) {
                Utils.ajaxCall(
                    "/sysm/SYSM440DEL01",
                    JSON.stringify(param),
                    function (data) {
                        Utils.alert(data.msg, FRME260P_fnInitDetailForm);
                        return FRME260P_fnSearchGreetings();
                    });
            },
        },
        schema: {
            type: "json",
            model: {
                fields: {
                    mentNo: {field: "mentNo", type: "number"},
                    phrasDvCd: {field: "phrasDvCd", type: "string"},
                    phrasTypCd: {field: "phrasTypCd", type: "string"},
                    phrasTite: {field: "phrasTite", type: "string"},
                    stCd: {field: "stCd", type: "string"},
                    decRegrNm: {field: "regrUsr", type: "string"},
                    lstCorcDtm: {field: "lstCorcDtm", type: "date"},
                    // 히든 값 (상세 내역)
                    phrasCtt: {field: "phrasCtt", type: "string"},
                    orgPath: {field: "orgPath", type: "string"},
                    decApprNm: {field: "decApprNm", type: "string"},
                    apvTndwDd: {field: "apvTndwDd", type: "date"},
                    apvTndwRsnCtt: {field: "apvTndwRsnCtt", type: "string"},
                }
            }
        }
    }
    FRME260P_grdFRME260P = $("#grdFRME260P").kendoGrid({
        dataSource: FRME260PDataSource,
        autoBind: false,
        resizable: true,
        sortable: true,
        height: 365,
        scrollable: true,
        selectable: true,
        dataBound: function (e) {
            e.sender.select("tr:eq(0)");
        },
        change: FRME260P_onClick,
        sort: function (e) {
            if (FRME260P_grdFRME260P.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        pageable: {
            refresh: true,
            pageSizes: [25, 50, 100, 200, 500],
            buttonCount: 10,
            pageSize: 25,
        },
        columns: [
            {
                width: 40,
                field: "check",
                title: "선택",
                template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',
            },
            {
                width: 90, field: "mentNo", title: FRME260P_langMap.get("FRME260P.grid.mentNo"),
            },
            {
                width: 80, field: "phrasDvCd", title: FRME260P_langMap.get("FRME260P.grid.phrasDvCd"),
                template: '#if (phrasDvCd) {# #=Utils.getComCdNm(FRME260P_cmmCodeList, "C0217", phrasDvCd)# #}#',
            },
            {
                width: 90, field: "phrasTypCd", title: FRME260P_langMap.get("FRME260P.grid.phrasTypCd"),
                template: '#if (phrasTypCd) {# #=Utils.getComCdNm(FRME260P_cmmCodeList, "C0218", phrasTypCd)# #}#',
            },

            {
                width: "auto",
                field: "phrasTite",
                title: FRME260P_langMap.get("FRME260P.grid.phrasTite"),
                attributes: {"class": "textEllipsis"},
            },
            {
                width: 80, field: "stCd", title: FRME260P_langMap.get("FRME260P.grid.stCd"),
                template: function (dataItem) {
                    if (dataItem.stCd === '9') {
                        return "<span class='fontRed'>" + Utils.getComCdNm(FRME260P_cmmCodeList, 'C0219', dataItem.stCd) + "</span>";
                    } else {
                        return Utils.getComCdNm(FRME260P_cmmCodeList, 'C0219', dataItem.stCd);
                    }
                }
            },
            {
                width: 140, field: "regrUsr", title: FRME260P_langMap.get("FRME260P.grid.regrUsr"),

            },
            {
                width: 140, field: "lstCorcDtm", title: FRME260P_langMap.get("FRME260P.grid.lstCorcDtm"),
                template: '#=lstCorcDtm == null ? "" : kendo.toString(new Date(lstCorcDtm), "yyyy-MM-dd HH:mm:ss")#'
            },

        ],
        noRecords: {template: `<div class="nodataMsg"><p>${FRME260P_langMap.get("FRME260P.grid.nodatafound")}</p></div>`},
    }).data("kendoGrid");

    FRME260P_editor = cEditor.Creater("FRME260P_editor", 100, 212, 1);
    $('iframe').on('load', function () {
        $("[id^=NamoSE_Ifr__]").contents().find("[id^=pe_aMI_]").css('border', '0px');
        $('.FRME260P_tenant > span:first').remove()
        FRME260P_init();
    });
});

function FRME260P_init() {
    FRME260P_fnSelectCmmCode();
    FRME260P_initTenant();
}

function FRME260P_initTenant() {
    const before = () => FRME260P_grdFRME260P.dataSource.data([]);
    const lengthTrue = FRME260P_fnSearchGreetings;
    CMMN_SEARCH_TENANT["FRME260P"].fnInit(before,lengthTrue,null);
}

function FRME260P_fnSearchGreetings() {
    const getTenantId = Utils.isNull(Utils.getUrlParam('tenantId')) ? GLOBAL.session.user.tenantId : Utils.getUrlParam('tenantId');
    const getUsrId = Utils.isNull(Utils.getUrlParam('usrId')) ? GLOBAL.session.user.usrId : Utils.getUrlParam('usrId');
    const param = {
        tenantId: getTenantId,
        usrId: getUsrId,
    }
    FRME260PDataSource.transport.read(param);
}

function FRME260P_fnResultGreetingsList(data) {
    FRME260P_rawData = JSON.parse(data.FRME260P);
    if (FRME260P_rawData.length === 0) {
        Utils.alert(FRME260P_langMap.get("fail.common.select"),
            () => FRME260P_grdFRME260P.dataSource.data([]));
        FRME260P_fnInitDetailForm();
        return;
    }

    // 사용자, 등록자, 승인자 데이터 추가 usr, regrUsr, apprUser
    for (let i = 0; i < FRME260P_rawData.length; i++) {
        FRME260P_rawData[i].usr = ''.concat(FRME260P_rawData[i].decUsrNm, "(", FRME260P_rawData[i].usrId, ")");
        FRME260P_rawData[i].regrUsr = ''.concat(FRME260P_rawData[i].decRegrNm, "(", FRME260P_rawData[i].regrId, ")");
        FRME260P_rawData[i].apprUsr = Utils.isNotNull(FRME260P_rawData[i].apprId) ? ''.concat(FRME260P_rawData[i].decApprNm, "(", FRME260P_rawData[i].apprId, ")") : "";
    }

    // 탭 분류 0=전체, 1=인사말, 2=계절인사, 3=상용구
    FRME260P_pharsTypeFilter[0] = FRME260P_rawData;
    for (let i = 1; i < FRME260P_pharsTypeFilter.length; i++) {
        FRME260P_pharsTypeFilter[i] = FRME260P_rawData.filter(obj => obj.phrasTypCd === `${i}`);
    }

    FRME260P_grdFRME260P.dataSource.data(FRME260P_rawData);
    FRME260P_grdFRME260P.dataSource.options.schema.data = FRME260P_rawData;
}

function FRME260P_fnSelectCmmCode() {
    let FRME260P_cmmCodeData = {
        "codeList": [
            {"mgntItemCd": "C0217"},  // 문구 구분
            {"mgntItemCd": "C0218"},  // 문구 유형
            {"mgntItemCd": "C0219"},  // 상태 코드
        ]
    };
    Utils.ajaxSyncCall(
        "/comm/COMM100SEL01",
        JSON.stringify(FRME260P_cmmCodeData),
        FRME260P_fnSetCmmCode)
}

function FRME260P_fnSetCmmCode(data, clickData = {}) {
    FRME260P_cmmCodeList = Utils.isNotNull(data) ? JSON.parse(data.codeList) : FRME260P_cmmCodeList
    Utils.setKendoComboBox(FRME260P_cmmCodeList, "C0217", "#FRME260P input[name=phrasDvCd]", clickData.phrasDvCd, false);
    Utils.setKendoComboBox(FRME260P_cmmCodeList, "C0218", "#FRME260P input[name=phrasTypCd]", clickData.phrasTypCd, false);
    Utils.setKendoComboBox(FRME260P_cmmCodeList, "C0219", "#FRME260P input[name=stCd]", clickData.stCd, false);
    $('#FRME260P input[name=stCd]').data("kendoComboBox").enable(false);
}


function FRME260P_fnDetailDataTemplate() {
    return {
        fnSetEnterInTD: (key, value) => $("#FRME260P [name= " + key + "]").html(value),
        fnSetEnterInInput: (key, value) => $("#FRME260P [name= " + key + "]").val(value),
        fnSetUsrData: (key, value, dataSet) => {
            let targetUsrInput = $("#FRME260P [name= " + key + "]");
            targetUsrInput.val(value);
            targetUsrInput.data({"orgCd": dataSet.orgCd, "usrId": dataSet.usrId});
            targetUsrInput.attr("readonly", true);
            return targetUsrInput;
        },
        fnSetPhrasCtt: (value, stCd) => {
            if (stCd === '4') FRME260P_editor.SetReadonly(true);
            else FRME260P_editor.SetReadonly(false);
            return FRME260P_editor.SetBodyValue(value);
        },
    }
}

function FRME260P_onClick(e) {
    // const selectRow = FRME260P_grdFRME260P.dataItem((e.target).closest("tr")); // click event의 경우
    const selectRow = FRME260P_grdFRME260P.dataItem(e.sender.select());
    if (Utils.isNull(selectRow)) {  // 데이터 없을 경우
        FRME260P_selectedItem = {}; // 초기화
        return;
    }

    FRME260P_selectedItem = FRME260P_rawData.find(obj => obj.mentNo === selectRow.mentNo);
    let setDetailCmmCode = Object.keys(selectRow)
        .filter((key) => ['stCd', 'phrasTypCd', 'phrasDvCd'].includes(key))
        .reduce((obj, key) => {
            return Object.assign(obj, {[key]: selectRow[key]})
        }, {});
    FRME260P_fnSetCmmCode("", setDetailCmmCode);
    FRME260P_btnSetting(selectRow.stCd);
    const set = FRME260P_fnDetailDataTemplate();
    $("#FRME260P_mentNo").val(selectRow.mentNo);
    set.fnSetPhrasCtt(selectRow.phrasCtt, selectRow.stCd);
    set.fnSetEnterInInput('phrasTite', selectRow.phrasTite);
    set.fnSetEnterInTD('usr', selectRow.usr);
    set.fnSetEnterInTD('orgPath', selectRow.orgPath);
    set.fnSetEnterInTD('apprUsr', selectRow.apprUsr);
    set.fnSetEnterInTD('apvTndwDd', selectRow.apvTndwDd ? kendo.toString(new Date(selectRow.apvTndwDd), "yyyy-MM-dd") : "")
    set.fnSetEnterInTD('apvTndwRsnCtt', selectRow.apvTndwRsnCtt);

    let FRME260P_orgPathTool;
    if (selectRow.orgPath.length > 20) {
        let option = {
            position: "bottom",
            content: selectRow.orgPath,
            autoHide: true,
            width: selectRow.orgPath.length * 12,
        }
        FRME260P_orgPathTool = $("#FRME260P [name=orgPath]").kendoTooltip(option).data("kendoTooltip");
        return FRME260P_orgPathTool;
    }

    // let FRME260P_orgPathTool = $("#FRME260P [name=orgPath]").kendoTooltip({
    //     position: "bottom",
    //     content: selectRow.orgPath,
    //     autoHide: true,
    //     width: selectRow.orgPath.length * 12,
    // }).data("kendoTooltip");
    //
    // if (selectRow.orgPath.length < 20)
    //     $("#FRME260P [name=orgPath]").data("kendoTooltip").destory();
}

/**
 * 상태코드에 따른 버튼 제어
 *
 * @type {string} selectStCd 선택 된 그리드의 상태코드
 * @desc status 1등록 / 2사용신청 / 3반려 / 4사용 / 9폐기
 */
function FRME260P_btnSetting(selectStCd) {
    $("#FRME260P_detailBtn button").prop("disabled", Utils.isNull(FRME260P_selectedItem));
    const stCd = Utils.isNull(selectStCd) ? '0' : selectStCd;
    const indexArr = {
        0: ['1', '3'],          // 사용요청
        1: ['2'],              // 신청취소
        2: ['1', '3', '4'],      // 폐기
        3: ['1', '3', '4', '9'],  // 삭제
        4: ['0', '1', '3']           // 저장
    }
    $("#FRME260P_detailBtn [name=detailUptBtn]").each(function (idx, elem) {
        $(elem).prop('disabled', !indexArr[idx].includes(stCd));
    })
    // $("#FRME260P_detailBtn [name=detailUptBtn]").each(function() {
    //     let statusArr = this.dataset.statusArr.split(',');
    //     if (!statusArr.includes(stCd)) {
    //         $(this).prop("disabled",true);
    //     }
    // })

}

function FRME260P_fnInitDetailForm() {
    FRME260P_newFlag = true;
    FRME260P_editor.SetReadonly(false);
    FRME260P_editor.SetValue('');
    $("#FRME260P_mentNo").val('');
    $('#FRME260P_detail td[class*=FRME260P_tdData]').text('');
    $('#FRME260P_detail input[name=phrasTite]').val('');
    $('#FRME260P_detail input[name=phrasDvCd]').data("kendoComboBox").value('');
    $('#FRME260P_detail input[name=phrasTypCd]').data("kendoComboBox").value('');
    $('#FRME260P_detail input[name=stCd]').data("kendoComboBox").value('1');
    $("#FRME260P_detailBtn button").prop("disabled", false); // 버튼초기화
    FRME260P_grdFRME260P.clearSelection();


    $("#FRME260P_detailBtn button:not(:first-child):not(:last-child)").prop("disabled", true);
    $('#FRME260P_detail td[name=usr]').text(''.concat(GLOBAL.session.user.decUsrNm, "(", GLOBAL.session.user.usrId, ")"));
    $('#FRME260P_detail td[name=orgPath]').text(GLOBAL.session.user.orgPath);
}

function FRME260P_fnDeleteChatPharse() {
    if (FRME260P_selectedItem.stCd !== '1' && FRME260P_selectedItem.stCd !== '9') {
        Utils.alert(FRME260P_langMap.get("FRME260P.valid.delete"));
        return;
    }

    Utils.confirm(FRME260P_langMap.get("FRME260P.delete.msg"), function () {
        FRME260PDataSource.transport.destroy({
            tenantId: GLOBAL.session.user.tenantId,
            mentNo: FRME260P_selectedItem.mentNo,
        });
    });
}

function FRME260P_fnSaveChatPhrase() {
    Utils.markingRequiredField();

    const phrasDvCd = $('#FRME260P_detail input[name=phrasDvCd]').data("kendoComboBox");
    const phrasTypCd = $('#FRME260P_detail input[name=phrasTypCd]').data("kendoComboBox");
    const stCd = $('#FRME260P_detail input[name=stCd]').data("kendoComboBox");
    const phrasTite = $('#FRME260P_detail input[name=phrasTite]');
    const phrasCtt = FRME260P_editor.GetTextValue();
    const mentNo = $("#FRME260P_mentNo").val();

    if (Utils.isNull(phrasCtt)) {
        FRME260P_editor.SetBodyStyle('background', '#ffe3e3');
        Utils.alert(FRME260P_langMap.get("FRME260P.valid.emptyContent"), () => {
            FRME260P_editor.SetBodyStyle('background', 'none');
            return FRME260P_editor.SetFocusEditor(0);
        });
        return;
    }

    if (Utils.isNull(phrasTite.val())) {
        Utils.alert(FRME260P_langMap.get("FRME260P.valid.emptyTitle"), () => {
            return phrasTite.focus();
        });
        return;
    }

    if (Utils.isNull(phrasTypCd.value())) {
        Utils.alert(FRME260P_langMap.get("FRME260P.valid.noSelectType"), () => {
            phrasTypCd.focus();
            return phrasTypCd.toggle();
        });
        return;
    }

    if (Utils.isNull(phrasDvCd.value())) {
        Utils.alert(FRME260P_langMap.get("FRME260P.valid.noSelectClass"), () => {
            phrasDvCd.focus();
            return phrasDvCd.toggle();
        });
        return;
    }
    const insertData = {
        tenantId: GLOBAL.session.user.tenantId,
        mentNo: Utils.isNull(mentNo) ? 0 : Number($("#FRME260P_mentNo").val()),
        phrasDvCd: phrasDvCd.value(),
        phrasTypCd: phrasTypCd.value(),
        stCd: stCd.value(),
        phrasTite: phrasTite.val(),
        phrasCtt: phrasCtt,
        usrId: GLOBAL.session.user.usrId,
        usrOrgCd: GLOBAL.session.user.orgCd,
    }

    const msg = FRME260P_newFlag ? FRME260P_langMap.get("FRME260P.msg.add") : FRME260P_langMap.get("FRME260P.msg.save");
    Utils.confirm(msg, () => {
        return FRME260PDataSource.transport.create(insertData);
    }, false);
}

$("#FRME260P_tab input").on('click', function () {
    const idx = $(this).attr('tabIndex');
    FRME260P_grdFRME260P.dataSource.data(FRME260P_pharsTypeFilter[idx]);
    FRME260P_grdFRME260P.dataSource.options.schema.data = FRME260P_pharsTypeFilter[idx];
});

/**
 * 채팅문구 상태코드 업데이트
 *
 * @type {string} stCd 상태코드
 * @desc 등록=신청취소(1), 사용신청(2), 폐기(9),
 */
function FRME260P_fnStUpdateChatPharse(stCd) {
    let updateParam = {
        tenantId: GLOBAL.session.user.tenantId,
        mentNo: Number($("#FRME260P_mentNo").val()),
        stCd: stCd,
        usrId: GLOBAL.session.user.usrId,
        usrOrgCd: GLOBAL.session.user.orgCd
    }
    console.log(updateParam);
    if (stCd === '9') {
        updateParam.apprId = GLOBAL.session.user.usrId
        updateParam.apprOrgCd = GLOBAL.session.user.orgCd
    }
    FRME260PDataSource.transport.update(updateParam);
}


$("#FRME260P_detailBtn [name=detailUptBtn]").on('click', function (e) {
    if (!FRME260P_newFlag &&FRME260P_selectedItem.usrId !== GLOBAL.session.user.usrId) {
        // Utils.alert(FRME260P_langMap.get("FRME260P.noPermission.msg"));
        Utils.alert(FRME260P_langMap.get("FRME260P.noPermission.msg"));
        return;
    }
    const checkMsgAndChangeCd = {
        1: {changeCd: '2', msg: FRME260P_langMap.get("FRME260P.msg.apply")},
        2: {changeCd: '1', msg: FRME260P_langMap.get("FRME260P.msg.cancel")},
        3: {changeCd: '9', msg: FRME260P_langMap.get("FRME260P.msg.discard")},
    }
    const idx = $(e.target).index();
    switch (idx) {
        case 4: // 삭제
            FRME260P_fnDeleteChatPharse();
            break;
        case 5: // 저장
            FRME260P_fnSaveChatPhrase();
            break;
        default :
            Utils.confirm(checkMsgAndChangeCd[idx].msg,
                () => FRME260P_fnStUpdateChatPharse(checkMsgAndChangeCd[idx].changeCd), false);
            break;
    }
})

