/***********************************************************************************************
 * Program Name : 채팅 문구 관리 - 메인(SYSM440M.js)
 * Creator      : mhlee
 * Create Date  : 2022.06.10
 * Description  : 채팅 문구 관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.06.10     mhlee            최초작성
 * 2023.12.21	  dwson			   에디터변경(Cross Editor => Summer Note Editor)

 ************************************************************************************************/

var SYSM440M_cmmCodeList, SYSM440MDataSource, SYSM440M_grdSYSM440M, SYSM440M_rawData;
var SYSM440M_selectedItem, SYSM440M_gridSelectedItems = [];

$(document).ready(function () {
    SYSM440MDataSource = {
        transport: {
            read: function (param) {
                if (Utils.isNull(param.data)) {
                    Utils.ajaxCall(
                        "/sysm/SYSM440SEL01",
                        JSON.stringify(param),
                        SYSM440M_fnResultGreetingsList,
                        window.kendo.ui.progress($("#grdSYSM440M"), true),
                        window.kendo.ui.progress($("#grdSYSM440M"), false))
                } else {
                    window.kendo.ui.progress($("#grdSYSM440M"), false)
                }
            },
            update: function (param, ajaxUrl) {
                Utils.ajaxCall(
                    ajaxUrl,
                    JSON.stringify(param),
                    function (data) {
                        Utils.alert(data.msg, SYSM440M_fnSearchChatPhraseManage);
                    }
                )
            },
            create: function (param) {
                Utils.ajaxCall(
                    "/sysm/SYSM440INS01",
                    JSON.stringify(param),
                    function (data) {
                        Utils.alert(data.msg, SYSM440M_fnSearchChatPhraseManage);
                    });
            },
            destroy: function (param) {
                Utils.ajaxCall(
                    "/sysm/SYSM440DEL01",
                    JSON.stringify(param),
                    function (data) {
                        Utils.alert(data.msg, SYSM440M_fnInitDetailForm);
                        return SYSM440M_fnSearchChatPhraseManage();
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
    SYSM440M_grdSYSM440M = $("#grdSYSM440M").kendoGrid({
        dataSource: SYSM440MDataSource,
        autoBind: false,
        sortable: true,
        scrollable: true,
        sort: function (e) {
            if (SYSM440M_grdSYSM440M.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        pageable: {
            refresh: true,
            pageSizes: [25, 50, 100, 200, 500],
            buttonCount: 10,
            pageSize: 25,
        },
        dataBound: function (e) {
            e.sender.select("tr:eq(0)");
        },
        // change: function (e) {
        //     // let selectedRows = e.sender.select();
        //     // SYSM440M_gridSelectedItems = [];
        //     // selectedRows.each(function () {
        //     //     let dataItem = SYSM440M_grdSYSM440M.dataItem(this);
        //     //     let findRawDataItem = SYSM440M_rawData.find(obj => obj.mentNo === dataItem.mentNo)
        //     //     SYSM440M_gridSelectedItems.push(findRawDataItem);
        //     // });
        //
        //     // $("#SYSM440M [name=gridBtn]").prop("disabled", SYSM440M_gridSelectedItems.length === 0);
        //     // $("#SYSM440M_detailBtn button").not(':first').prop("disabled", SYSM440M_gridSelectedItems.length === 0);
        // },
        change:  SYSM440M_onClick,
        columns: [
            {
                width: 40, selectable: true,
            },
            {
                width: 100, field: "mentNo", title: SYSM440M_langMap.get("SYSM440M.detail.mentNo"),
            },
            {
                width: 100, field: "phrasDvCd", title: SYSM440M_langMap.get("SYSM440M.detail.phrasDvCd"),
                template: '#if (phrasDvCd) {# #=Utils.getComCdNm(SYSM440M_cmmCodeList, "C0217", phrasDvCd)# #}#',
            },
            {
                width: 150, field: "phrasTypCd", title: SYSM440M_langMap.get("SYSM440M.detail.phrasTypCd"),
                template: '#if (phrasTypCd) {# #=Utils.getComCdNm(SYSM440M_cmmCodeList, "C0218", phrasTypCd)# #}#',
            },

            {
                width: "auto", field: "phrasTite", title: SYSM440M_langMap.get("SYSM440M.detail.phrasTite"),
                attributes: {"class": "textEllipsis"},
            },
            {
                width: 150, field: "usr", title: SYSM440M_langMap.get("SYSM440M.detail.usr"),

            },
            {
                width: 150, field: "apprUsr", title: SYSM440M_langMap.get("SYSM440M.detail.apprUsr"),
            },
            {
                width: 140, field: "regDtm", title: SYSM440M_langMap.get("SYSM440M.detail.regDtm"),
                template: '#=regDtm == null ? "" : kendo.toString(new Date(regDtm), "yyyy-MM-dd HH:mm:ss")#'
            },
            {
                width: 100, field: "stCd", title: SYSM440M_langMap.get("SYSM440M.detail.stCd"),
                template: function (dataItem) {
                    if (dataItem.stCd === '9') {
                        return "<span class='fontRed'>" + Utils.getComCdNm(SYSM440M_cmmCodeList, 'C0219', dataItem.stCd) + "</span>";
                    } else {
                        return Utils.getComCdNm(SYSM440M_cmmCodeList, 'C0219', dataItem.stCd);
                    }
                }
            },
        ],
        selectable: "multiple",
        noRecords: {template: `<div class="nodataMsg"><p>${SYSM440M_langMap.get("SYSM440M.grid.nodatafound")}</p></div>`},
    }).data("kendoGrid");
    // SYSM440M_grdSYSM440M.tbody.on('click', SYSM440M_onClick);
    SYSM440M_fnSummEdtCreate("SYSM440M_editor");

    SYSM440M_init();
    
//    $('iframe').on('load', function () {
//        $("[id^=NamoSE_Ifr__]").contents().find("[id^=pe_aMI_]").css('border', '0px');
//        SYSM440M_init();
//    });
});

//summereditor 생성
function SYSM440M_fnSummEdtCreate(nId){
	
	$('#'+nId).summernote({
		height: 150,
//		minHeight: 200,
//		maxHeight: 180,
		disableDragAndDrop: true,
		toolbar: [
			  ['style', ['style']],
			  ['font', ['bold', 'underline', 'clear']],
			  ['fontname', ['fontname']],
			  ['fontsize', ['fontsize']],
			  ['color', ['forecolor','color']],
			  ['para', ['paragraph']],
			  ['table', ['table']],
			  ['view', ['codeview']],
//			  ['insert', ['link', 'picture']],
		  ],
		  callbacks: {
//		    onImageUpload : function(files) {
//				  SYSM440M_fnSummNoteImgUpload(files[0], this, nId);
//				},
		  },
	});
}

function SYSM440M_init() {
    SYSM440M_resizeGrid();
    SYSM440M_fnSelectCmmCode();
    SYSM440M_initTenant();
}

function SYSM440M_initTenant() {
    const before = () => SYSM440M_grdSYSM440M.dataSource.data([]);
    const lengthTrue = SYSM440M_fnSearchChatPhraseManage;
    CMMN_SEARCH_TENANT["SYSM440M"].fnInit(before,lengthTrue,null);
}

$(window).resize(function () {
    SYSM440M_resizeGrid();
});

function SYSM440M_resizeGrid() {
    const SYSM440M_windowHeight = $(window).height() - 210;
    SYSM440M_grdSYSM440M.element.find('.k-grid-content').css('height', SYSM440M_windowHeight - 565);
}

function SYSM440M_fnSearchChatPhraseManage() {
    if (Utils.isNull($('#SYSM440M_tenantId').val())) {
        Utils.alert(SYSM440M_langMap.get("SYSM440M.tenantId.required.msg"));
        return;
    }
    SYSM440MDataSource.transport.read(SYSM440M_getParamValue());
}

function SYSM440M_getParamValue() {
    const tenantNm = $('#SYSM440M_tenantNm').val();
    const tenantId = tenantNm === '' || tenantNm.includes('미등록')
        ? Utils.alert(SYSM217M_langMap.get("aicrm.message.tenantInfo"))
        : $('#SYSM440M_tenantId').val();

    return {
        tenantId: tenantId,
        stCd: $('#comboStCd_SYSM440M').data('kendoComboBox').value(),
        phrasDvCd: $('#comboPhrasDvCd_SYSM440M').data('kendoComboBox').value(),
        phrasTypCdList: $('#multiPhrasTypCd_SYSM440M').data("kendoMultiSelect").value(),
        srchType: $('#srcType_SYSM440M').data('kendoComboBox').value(),
        srchText: $('#SYSM440M [name=search_srcText]').val(),
    }
}

function SYSM440M_fnResultGreetingsList(data) {
    SYSM440M_rawData = JSON.parse(data.SYSM440M);
    console.log(SYSM440M_rawData);
    if (SYSM440M_rawData.length === 0) {
        Utils.alert(SYSM440M_langMap.get("fail.common.select"),
            () => SYSM440M_grdSYSM440M.dataSource.data([]));
        return;
    }

    // 사용자, 등록자, 승인자 데이터 추가 usr, regrUsr, apprUser
    for (let i = 0; i < SYSM440M_rawData.length; i++) {
        SYSM440M_rawData[i].usr = ''.concat(SYSM440M_rawData[i].decUsrNm, "(", SYSM440M_rawData[i].usrId, ")");
        SYSM440M_rawData[i].regrUsr = ''.concat(SYSM440M_rawData[i].decRegrNm, "(", SYSM440M_rawData[i].regrId, ")");
        SYSM440M_rawData[i].apprUsr = Utils.isNotNull(SYSM440M_rawData[i].apprId) ? ''.concat(SYSM440M_rawData[i].decApprNm, "(", SYSM440M_rawData[i].apprId, ")") : "";
    }

    SYSM440M_grdSYSM440M.dataSource.data(SYSM440M_rawData);
    SYSM440M_grdSYSM440M.dataSource.options.schema.data = SYSM440M_rawData;
}

function SYSM440M_fnSelectCmmCode() {
    let SYSM440M_cmmCodeData = {
        "codeList": [
            {"mgntItemCd": "C0217"},  // 문구 구분
            {"mgntItemCd": "C0218"},  // 문구 유형
            {"mgntItemCd": "C0219"},  // 상태 코드
        ]
    };
    Utils.ajaxSyncCall(
        "/comm/COMM100SEL01",
        JSON.stringify(SYSM440M_cmmCodeData),
        SYSM440M_fnSetCmmCode)
}

function SYSM440M_fnSetCmmCode(data) {
    SYSM440M_cmmCodeList = Utils.isNotNull(data) ? JSON.parse(data.codeList) : SYSM440M_cmmCodeList
    const SYSM440M_srcType = [
        {text: SYSM440M_langMap.get("SYSM440M.search.srcType.title"), value: "T"},
        {text: SYSM440M_langMap.get("SYSM440M.search.srcType.content"), value: "C"},
    ]
    Utils.setKendoComboBoxCustom(SYSM440M_srcType, "#srcType_SYSM440M", "text", "value", "", true);
    Utils.setKendoComboBox(SYSM440M_cmmCodeList, "C0217", "#comboPhrasDvCd_SYSM440M", data.phrasDvCd, true);
    Utils.setKendoComboBox(SYSM440M_cmmCodeList, "C0219", "#comboStCd_SYSM440M", data.stCd, true);
    Utils.setKendoMultiSelect(SYSM440M_cmmCodeList, "C0218", "#multiPhrasTypCd_SYSM440M", false, "");
    SYSM440M_fnSetDetailCmmCode({});
}

function SYSM440M_fnSetDetailCmmCode(clickData) {
    Utils.setKendoComboBox(SYSM440M_cmmCodeList, "C0217", "#SYSM440M input[name=phrasDvCd]", clickData.phrasDvCd, false);
    Utils.setKendoComboBox(SYSM440M_cmmCodeList, "C0218", "#SYSM440M input[name=phrasTypCd]", clickData.phrasTypCd, false);
    Utils.setKendoComboBox(SYSM440M_cmmCodeList, "C0219", "#SYSM440M input[name=stCd]", clickData.stCd, false);
    $('#SYSM440M_detail input[name=stCd]').data("kendoComboBox").enable(false);
}

function SYSM440M_fnSearchUsrPopup_SYSM212P(name) {
    Utils.setCallbackFunction("SYSM440M_fnUsrCallBack", function (item) {
        return item.map(obj => {
            let usr = ''.concat(obj.usrNm, "(", obj.usrId, ")");
            SYSM440M_fnDetailDataTemplate().fnSetUsrData(name, usr, obj);
        });
    });
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM212P", "SYSM212P", 410, 810, {callbackKey: "SYSM440M_fnUsrCallBack", isMulti:"N"});
}

function SYSM440M_fnSetDetailChatPharse(selectRow) {
    let setDetailCmmCode = Object.keys(selectRow)
        .filter((key) => ['stCd', 'phrasTypCd', 'phrasDvCd'].includes(key))
        .reduce((obj, key) => {
            return Object.assign(obj, {[key]: selectRow[key]})
        }, {});
    SYSM440M_fnSetDetailCmmCode(setDetailCmmCode);
    const set = SYSM440M_fnDetailDataTemplate();
    set.fnSetEnterInTD('regDtm', kendo.toString(new Date(selectRow.regDtm), "yyyy-MM-dd HH:mm:ss"));
    set.fnSetEnterInTD('regrUsr', selectRow.regrUsr);
    set.fnSetEnterInInput('mentNo', selectRow.mentNo);
    set.fnSetEnterInInput('phrasTite', selectRow.phrasTite);
    set.fnSetEnterInInput('apvTndwRsnCtt', selectRow.apvTndwRsnCtt);
    set.fnSetPhrasCtt(selectRow.phrasCtt, selectRow.stCd);
    set.fnSetUsrData('usr', selectRow.usr, {
        usrId: selectRow['usrId'], orgCd: selectRow['usrOrgCd']
    });
    set.fnSetUsrData('apprUsr', selectRow.apprUsr, {
        usrId: selectRow['apprId'], orgCd: selectRow['apprOrgCd']
    });
}

function SYSM440M_onClick(e) {
    const selectRow = SYSM440M_grdSYSM440M.dataItem(e.sender.select());
    if (Utils.isNull(selectRow)) {
        SYSM440M_fnInitDetailForm(e);
        return;
    }

    SYSM440M_selectedItem = SYSM440M_rawData.find(obj => obj.mentNo === selectRow.mentNo);
    SYSM440M_gridSelectedItems = [];
    let rows = e.sender.select();
    rows.each(function () {
        SYSM440M_gridSelectedItems.push(SYSM440M_grdSYSM440M.dataItem(this));
    });

    SYSM440M_fnSetDetailChatPharse(selectRow);
}

function SYSM440M_fnDetailDataTemplate() {
    return {
        fnSetEnterInTD: (key, value) => $("#SYSM440M [name= " + key + "]").html(value),
        fnSetEnterInInput: (key, value) => $("#SYSM440M [name= " + key + "]").val(value),
        fnSetUsrData: (key, value, dataSet) => {
            let targetUsrInput = $("#SYSM440M [name= " + key + "]");
            targetUsrInput.val(value);
            targetUsrInput.data({"orgCd":dataSet.orgCd, "usrId":dataSet.usrId});
            targetUsrInput.attr("readonly", true);
            return targetUsrInput;
        },
        fnSetPhrasCtt: (value, stCd) => {
            if (stCd === '4') $('#SYSM440M_editor').summernote('disable');
            else $('#SYSM440M_editor').summernote('enable');
            return $('#SYSM440M_editor').summernote('code', value);
        },
    }
}

function SYSM440M_fnInitDetailForm(e) {
    // $("#SYSM440M_detailBtn button:last-child").prop("disabled", false);
	$('#SYSM440M_editor').summernote('enable');
	$('#SYSM440M_editor').summernote('code', '');
    $('#SYSM440M_detail td[name^=reg]').text('');
    $('#SYSM440M_detail textarea').val('');
    $('#SYSM440M_detail input').val('');
    $('#SYSM440M_detail input[name=phrasDvCd]').data("kendoComboBox").value('');
    $('#SYSM440M_detail input[name=phrasTypCd]').data("kendoComboBox").value('');
    $('#SYSM440M_detail input[name=stCd]').data("kendoComboBox").value('');
    $('#SYSM440M_detail input[name=stCd]').data("kendoComboBox").value('1');
    if (!e) {
        SYSM440M_grdSYSM440M.clearSelection();
    }
    // $("#SYSM440M [name=gridBtn]").prop("disabled", SYSM440M_gridSelectedItems.length === 0);
    // $("#SYSM440M_detailBtn button").not(':first').prop("disabled", SYSM440M_gridSelectedItems.length === 0);
}

function SYSM440M_fnDeleteChatPharse() {
    Utils.confirm(SYSM440M_langMap.get("SYSM440M.delete.msg"),
        function () {
            SYSM440MDataSource.transport.destroy({
                tenantId: GLOBAL.session.user.tenantId,
                mentNo: SYSM440M_selectedItem.mentNo,
            });
        });
}

function SYSM440M_fnSaveChatPharse(idx) {
    Utils.markingRequiredField();
    const phrasDvCd = $('#SYSM440M_detail input[name=phrasDvCd]').data("kendoComboBox");
    const phrasTypCd = $('#SYSM440M_detail input[name=phrasTypCd]').data("kendoComboBox");
    const stCd = $('#SYSM440M_detail input[name=stCd]').data("kendoComboBox");
    const phrasTite = $('#SYSM440M_detail input[name=phrasTite]');
    const phrasCtt = $('<div>').html($('#SYSM440M_editor').summernote('code')).text();;
    const usrInfo = $('#SYSM440M_detail input[name=usr]');
    const apprUsrInfo = $('#SYSM440M_detail input[name=apprUsr]');
    const apvTndwRsnCtt = $('#SYSM440M [name=apvTndwRsnCtt]');

    if (Utils.isNull(phrasDvCd.value())) {
        Utils.alert(SYSM440M_langMap.get("SYSM440M.valid.phrasDvCd"), () => { phrasDvCd.focus();
            return phrasDvCd.toggle();
        });
        return;
    }

    if (Utils.isNull(phrasTypCd.value())) {
        Utils.alert(SYSM440M_langMap.get("SYSM440M.valid.phrasTypCd"), () => { phrasTypCd.focus();
            return phrasTypCd.toggle();
        });
        return;
    }

    if (Utils.isNull(phrasTite.val())) {
        Utils.alert(SYSM440M_langMap.get("SYSM440M.valid.phrasTite"), () => {
            return phrasTite.focus();
        });
        return;
    }

    if (Utils.isNull(phrasCtt)) {
    	$('#SYSM440M_editor').next('.note-editor').children('.note-editing-area').addClass('inputError');
    	
        Utils.alert(SYSM440M_langMap.get("SYSM440M.valid.phrasCtt"), () => {
        	$('#SYSM440M_editor').next('.note-editor').children('.note-editing-area').removeClass('inputError');
            return $('#SYSM440M_editor').summernote('focus');
        });
        return;
    }

    if (Utils.isNull(usrInfo.data("usrId")) || Utils.isNull(usrInfo.val())) {
        Utils.alert(SYSM440M_langMap.get("SYSM440M.valid.usrInfo"), () => {
            usrInfo.focus();
            return SYSM440M_fnSearchUsrPopup_SYSM212P('usr'); });
        return;
    }

    const insertData = {
        tenantId: GLOBAL.session.user.tenantId,
        phrasDvCd: phrasDvCd.value(),
        phrasTypCd: phrasTypCd.value(),
        stCd: stCd.value(),
        phrasTite: phrasTite.val(),
        phrasCtt: phrasCtt,
        usrId: usrInfo.data("usrId"),
        usrOrgCd: usrInfo.data("orgCd"),
        apprId: apprUsrInfo.data("usrId"),
        apprOrgCd: apprUsrInfo.data("orgCd"),
        apvTndwRsnCtt: apvTndwRsnCtt.val(),
        mentNo : Utils.isNull($('#SYSM440M [name=mentNo]').val()) ? 0 : $('#SYSM440M [name=mentNo]').val(),
    }

    const msg = Utils.isNull(insertData.mentNo) || insertData.mentNo === 0
        ? SYSM440M_langMap.get("SYSM440M.info.addNew") : SYSM440M_langMap.get("SYSM440M.info.save");
    Utils.confirm(msg, () => SYSM440MDataSource.transport.create(insertData),false);
}

var checkVaildStCd = [
    {checkStCd: '2', changeStCd: '4', msg: SYSM440M_langMap.get("SYSM440M.valid.approval"),},
    {checkStCd: '2', changeStCd: '3', msg: SYSM440M_langMap.get("SYSM440M.valid.rejection"),},
    {checkStCd: '4', changeStCd: '9', msg: SYSM440M_langMap.get("SYSM440M.valid.discard"),},
]
// Grid 하단 버튼
var SYSM440M_gridBtnList = $("#SYSM440M [name=gridBtn]");
for (let i = 0; i < SYSM440M_gridBtnList.length; i++) {
    SYSM440M_gridBtnList.eq(i).click(function () {
        let updateList = SYSM440M_gridSelectedItems
            .filter(obj => obj.stCd === checkVaildStCd[i].checkStCd)
            .map(data => {
                return {
                    tenantId: data.tenantId,
                    mentNo: data.mentNo,
                    stCd: checkVaildStCd[i].changeStCd,
                    apprId: GLOBAL.session.user.usrId,
                    apprOrgCd: GLOBAL.session.user.orgCd,
                }
            })
        updateList.length === 0 ? Utils.alert(checkVaildStCd[i].msg)
            : SYSM440MDataSource.transport.update(updateList, "/sysm/SYSM440UPT01");
    })
}

// 상세내역 하단버튼
// let SYSM440M_detailBtnList = $("#SYSM440M_detailBtn [name=detailUptBtn]");
// for (let i = 0; i < SYSM440M_detailBtnList.length; i++) {
//     SYSM440M_detailBtnList.eq(i).click(function () {
//         if (SYSM440M_gridSelectedItems.length > 1) {
//             Utils.alert('문구를 1개만 선택해주세요.');
//             return;
//         }
//         switch (i) {
//             case 3 :
//                 SYSM440M_fnDeleteChatPharse();
//                 break;
//             case 4 :
//                 SYSM440M_fnSaveChatPharse(i);
//                 break;
//             default:
//                 SYSM440M_fnStUpdateChatPharse(i);
//                 break;
//         }
//     })
// }


$("#SYSM440M_detailBtn [name=detailUptBtn]").on('click', function(e){
    const idx = $(this).index();
    switch (idx) {
        case 4 :
            SYSM440M_fnDeleteChatPharse();
            break;
        case 5 :
            SYSM440M_fnSaveChatPharse(idx);
            break;
        default:
            SYSM440M_fnStUpdateChatPharse(idx);
            break;
    }
})


function SYSM440M_fnStUpdateChatPharse(idx) {
    const stCd = $('#SYSM440M_detail input[name=stCd]').data("kendoComboBox").value();
    const apprUsrInfo = $('#SYSM440M_detail input[name=apprUsr]');
    const apvTndwRsnCtt = $('#SYSM440M [name=apvTndwRsnCtt]');
    if (idx === 1 || idx === 2) {   // 사용승인, 반려의 경우
        if (stCd !== '2') {         // 상태코드가 사용신청이 아닐 경우 불가
            Utils.alert(SYSM440M_langMap.get("SYSM440M.valid.status"))
            return;
        }
        if (Utils.isNull(apprUsrInfo.data("usrId"))) {
            apprUsrInfo.addClass('inputError');
            Utils.alert(SYSM440M_langMap.get("SYSM440M.valid.emptyUsr"), () => {
                apprUsrInfo.removeClass('inputError');
                return SYSM440M_fnSearchUsrPopup_SYSM212P('apprUsr');
            });
            return;
        }
        if (Utils.isNull(apvTndwRsnCtt.val())) {
            apvTndwRsnCtt.addClass('inputError');
            Utils.alert(SYSM440M_langMap.get("SYSM440M.valid.emptyRsnCtt"), () => {
                apvTndwRsnCtt.removeClass('inputError');
                return apvTndwRsnCtt.focus();
            });
            return;
        }
    }
    let updateDetailParam = {
        tenantId: GLOBAL.session.user.tenantId,
        mentNo: $('#SYSM440M_detail input[name=mentNo]').val(),
        stCd: checkVaildStCd[idx-1].changeStCd,
        apprId: Utils.isNull(apprUsrInfo.data("usrId")) ? GLOBAL.session.user.usrId : apprUsrInfo.data("usrId"),
        apprOrgCd: Utils.isNull(apprUsrInfo.data("orgCd")) ? GLOBAL.session.user.orgCd : apprUsrInfo.data("orgCd"),
        apvTndwRsnCtt: apvTndwRsnCtt.val(),
    }
    SYSM440MDataSource.transport.update(updateDetailParam, "/sysm/SYSM440UPT02");
}


// function SYSM440M_onClick(e) {
//     const clickRow = $(e.target).closest("tr");
//     const rowDataItem = SYSM440M_grdSYSM440M.dataItem(clickRow);
//     SYSM440M_selectedItem = SYSM440M_rawData.find(obj => obj.mentNo === rowDataItem.mentNo);
//
//     let itemKey = Object.keys(SYSM440M_selectedItem);
//     let setDetailCmmCode = itemKey.filter((key) => ['stCd', 'phrasTypCd', 'phrasDvCd'].includes(key))
//         .reduce((obj, key) => {
//             return Object.assign(obj, {[key]: SYSM440M_selectedItem[key]})
//         }, {});
//     SYSM440M_fnSetDetailCmmCode(setDetailCmmCode);
//     const set = SYSM440M_fnInputDetailData();
//     set.fnSetEnterInTD('regDtm', kendo.toString(new Date(SYSM440M_selectedItem.regDtm), "yyyy-MM-dd HH:mm:ss"));
//     set.fnSetEnterInTD('regrUsr', SYSM440M_selectedItem.regrUsr);
//     set.fnSetEnterInInput('mentNo', SYSM440M_selectedItem.mentNo);
//     set.fnSetEnterInInput('phrasTite', SYSM440M_selectedItem.phrasTite);
//     set.fnSetEnterInInput('apvTndwRsnCtt', SYSM440M_selectedItem.apvTndwRsnCtt);
//     set.fnSetPhrasCtt(SYSM440M_selectedItem.phrasCtt, SYSM440M_selectedItem.stCd);
//     set.fnSetUsrData('usr', SYSM440M_selectedItem.usr, {
//         usrId:SYSM440M_selectedItem['usrId'],
//         orgCd:SYSM440M_selectedItem['usrOrgCd']
//     });
//     set.fnSetUsrData('apprUsr', SYSM440M_selectedItem.apprUsr, {
//         usrId:SYSM440M_selectedItem['apprId'],
//         orgCd:SYSM440M_selectedItem['apprOrgCd']
//     });
// }
// let selectedRows = e.sender.select();
// SYSM440M_gridSelectedItems = [];
// selectedRows.each(function () {
//     let dataItem = SYSM440M_grdSYSM440M.dataItem(this);
//     let findRawDataItem = SYSM440M_rawData.find(obj => obj.mentNo === dataItem.mentNo)
//     SYSM440M_gridSelectedItems.push(findRawDataItem);
// });

// $("#SYSM440M [name=gridBtn]").prop("disabled", SYSM440M_gridSelectedItems.length === 0);
// $("#SYSM440M_detailBtn button").not(':first').prop("disabled", SYSM440M_gridSelectedItems.length === 0);