/***********************************************************************************************
 * Program Name : 쪽지관리(CMMT500M.js)
 * Creator      : mhlee
 * Create Date  : 2022.06.29
 * Description  : 쪽지관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.06.29     mhlee            최초생성
 ************************************************************************************************/

var CMMT500M_grdCMMT500M, CMMT500MDataSource, CMMT500M_tabCMMT500M, CMMT500M_rawData;
var replyNoteData, forwardNoteData;
var CMMT500M_classifiedData = new Array(4);

$(document).ready(function () {
    CMMT500M_tabCMMT500M = $("#tabCMMT500M").kendoTabStrip({
        animation: false,
        scrollable: false,
        contentLoad: MAINFRAME.onTabContentLoad,
        select: function (e) {
            let tabIdx = $(e.item).index();
            switch (tabIdx) {
                case 0:
                    CMMT510T_fnSearchNoteAll();
                    break;
                case 1:
                    CMMT520T_fnSearchReceiveNote();
                    break;
                case 2:
                    CMMT530T_fnSearchSendNote();
                    break;
                case 3:
                    CMMT540T_fnSearchArchive();
                    break;
            }
        },
    }).data("kendoTabStrip");
    CMMT500M_tabCMMT500M.tabGroup.find('.k-item').css('min-width', '200px');

    CMMT500MDataSource = ({
        transport: {
            read: function (data, callBackFunction) {
                Utils.ajaxCall(
                    "/cmmt/CMMT500SEL01",
                    JSON.stringify(data), callBackFunction)
            },
            update: function (data) {
                Utils.ajaxCall(
                    "/cmmt/CMMT500UPT03",
                    JSON.stringify(data), function (result) {
                        console.log(result.msg);
                    },
                )
            },
            change: function (data) {
                console.log(data);
                Utils.ajaxCall(
                    "/cmmt/CMMT500UPT02",
                    JSON.stringify(data), function (result) {
                        console.log(result.msg);
                    },
                )
            },
            destroy: function (data) {
                Utils.ajaxCall(
                    "/cmmt/CMMT500DEL01",
                    JSON.stringify(data), function (result) {
                        console.log(result.msg);
                    },
                )
            },
            // requestEnd: function (e) {
            //     console.log(e);
            //     var type = e.type;
            //     var response = e.response;
            //
            //     if (type !== "read") {
            //         CMMT500M_tabCMMT500M.trigger("change");
            //     }
            // },
        },
        sort: {field: "dpchDdSi", dir: "desc"},
        schema: {
            type: "json",
            model: {
                fields: {
                    noteNo: {field: "noteNo", type: "number"},
                    noteArchive: {field: "noteArchive", type: "boolean"},
                    noteType: {field: "noteType", type: "string"},
                    noteTite: {field: "noteTite", type: "string"},
                    noteCtt: {field: "noteCtt", type: "string"},
                    dpchmnUsr: {field: "dpchmnUsr", type: "string"},
                    recvrUsrs: {field: "recvrUsrs", type: "string"},
                    noteRead: {field: "noteRead", type: "boolean"},
                    puslDv: {field: "puslDv", type: "string"},
                    recvNoteStCd: {field: "recvNoteStCd", type: "string"},
                }
            }
        }
    })

    CMMT500M_grdCMMT500M = $("#grdCMMT500M").kendoGrid({
        dataSource: CMMT500MDataSource,
        selectable: true,
        detailExpand: function (e) {
            let currentRow = CMMT500M_grdCMMT500M.dataItem(e.masterRow);
            if (currentRow.noteType === 'R' && !currentRow.noteRead) {
                let $expandRowsIndex = [];
                // CMMT500M_grdCMMT500M.tbody.find("tr.k-master-row").each(function(e) {
                //     if($(this).find('[aria-expanded="true"]').length) {
                //         console.log(this);
                //         $expandRows.push(this);
                //     }
                // })
                // CMMT500M_grdCMMT500M.tbody.find('[aria-expanded="true"]').each(function(){
                //     $expandRows.push(this);
                // })
                console.log("해당 되는 아이템 ↡");
                console.log(this);
                CMMT500M_grdCMMT500M.tbody.find("tr.k-master-row").each(function(idx, item) {
                    if($(this).find('[aria-expanded="true"]').length) {
                        $expandRowsIndex.push(idx);
                    }
                })
                currentRow.set("noteRead", true);
                currentRow.dirty = false;
                currentRow.dirtyFields = null;
                CMMT500M_grdCMMT500M.refresh();

                CMMT500MDataSource.transport.change({
                    tenantId: currentRow.tenantId,
                    noteNo: currentRow.noteNo,
                    recvNoteStCd: '2',
                    recvrId: GLOBAL.session.user.usrId,
                    recvrOrgCd: GLOBAL.session.user.orgCd,
                });
                // $.each($expandRowsItem, function(idx,item) {
                //     console.log("리프레시 후 열어야 될 ROW ↡ ");
                //     console.log(item);
                //     CMMT500M_grdCMMT500M.expandRow(item);
                // })
                $expandRowsIndex.map(index => this.expandRow(this.tbody.find("tr.k-master-row").eq(index)));
                // return this.expandRow(this.tbody.find("tr.k-master-row").eq(index));
            }
        },
        change: function () {
            let $row = this.select();
            if ($row.length && $row.find('[aria-expanded="true"]').length) {
                this.collapseRow($row);
            } else {
                this.expandRow($row);
            }
        },
        dataBound: function () {
            $('.k-hierarchy-cell').on('click', function () {
                $(this).closest('.k-master-row').toggleClass('expanded');
            });
            // [중요쪽지] 표시 및 [쪽지전달] 완료 표시
            $('.importBtn').on('click', function () {
                console.log($(this));
                $(this).toggleClass('Active');
            });
            $('.tableCnt_TRnote').on('click', '.receiveMore', function () {     //   [받는사람]  더보기
                $(this).closest('.receive p').toggleClass('expand');
            });
        },
        detailTemplate: kendo.template($("#templateCMMT500M").html()),    //    id 명 rename 요함!
        autoBind: false,
        resizable: true,
        refresh: false,
        scrollable: true,
        sort: function (e) {
            if (CMMT500M_grdCMMT500M.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        sortable: true,
        pageable: {
            pageSizes: [25, 50, 100, 400, 500]
            , buttonCount: 10
            , pageSize: 25
        },
        columns: [
            {field: "noteCtt", title: CMMT500M_langMap.get("CMMT500M.grid.content"), hidden: true,},
            {field: "noteArchive", title: CMMT500M_langMap.get("CMMT500M.grid.archive"), hidden: true},
            {
                width: 100, field: "noteNo", title: " ",
                template: '#= noteArchiveTemplate(data)#'
            },
            {
                width: 120, field: "noteType", title: CMMT500M_langMap.get("CMMT500M.grid.type"),
                template: function (data) {
                    const typeMap = new Map();
                    typeMap.set("D", CMMT500M_langMap.get("CMMT500M.grid.type.sent"));
                    typeMap.set("R", CMMT500M_langMap.get("CMMT500M.grid.type.inbox"));
                    typeMap.set("T", CMMT500M_langMap.get("CMMT500M.grid.type.drafts"));
                    return typeMap.get(data.noteType);
                }
            },
            {
                width: "auto", field: "noteTite", title: CMMT500M_langMap.get("CMMT500M.grid.title"), attributes: {"class": "textLeft"},
                template: '<a class="linkEllipsis" onclick="CMMT500M_getNoteDetail(this);">#= noteUtils().replaceNoteTitleOrContent(noteTite)#</a>',
            },
            {width: 120, field: "dpchmnUsr", title: CMMT500M_langMap.get("CMMT500M.grid.dpchmnUsr"),},
            {	
            	width: 280, field: "recvrUsrs", title: CMMT500M_langMap.get("CMMT500M.grid.recvrUsrs"),
            	attributes : {
    				"class" : "textLeft",
    			},
            },
            {
                width: 150, field: "dpchDdSi", title: CMMT500M_langMap.get("CMMT500M.grid.dpchDdSi"),
                template: '#=kendo.toString(new Date(dpchDdSi), "yyyy-MM-dd HH:mm:ss")#'
            },
            {
                width: 100, field: "noteRead", title:CMMT500M_langMap.get("CMMT500M.grid.noteRead"),
                template: function (data) {
                    return data.noteRead ? CMMT500M_langMap.get("CMMT500M.grid.noteRead.read") : CMMT500M_langMap.get("CMMT500M.grid.noteRead.unread");
                }
            },
            {
                width: 100,
                field: "tempNote",
                title: " ",
                template: '#= TempOrDeleteNoteTemplate(data)#'
            },
        ],
        noRecords: {template: `<div class="nodataMsg"><p>${CMMT500M_langMap.get("CMMT500M.grid.nodatafound")}</p></div>`},
    }).data("kendoGrid");

    CMMT500M_resizeGrid();
    CMMT500M_tabCMMT500M.select(0);
});

function CMMT500M_refreshRawData() {
    CMMT500MDataSource.transport.read({tenantId: GLOBAL.session.user.tenantId, usrId: GLOBAL.session.user.usrId,},
        function (data) {
            CMMT500M_rawData = CMMT500M_dataPreProcessing(JSON.parse(data.CMMT500M));
        });
}

$('[id^=usrSelect_CMMT]').on('keyup input',function (e) {
    e.preventDefault();
    if (Utils.isNull(e.target.value)){
        $(e.target).data("usrId","");
        return;
    }
    $(e.target).val("").blur();
    CMMT_fnSearchUser();
})

function CMMT_fnSearchUser() {
    const tabIdx = String(CMMT500M_tabCMMT500M.select().index() + 1);
    const tabIdxMixString = ''.concat("CMMT5", tabIdx, "0T");

    Utils.setCallbackFunction(tabIdxMixString + "_fnUsrCallBack", function (item) {
        let targetInput = $("#usrSelect_" + tabIdxMixString);
        return item.map(obj => {
            let usr = ''.concat(obj.usrNm, "(", obj.usrId, ")");
            targetInput.val(usr);
            targetInput.data("usrId", obj.usrId);
        });
    });
    Utils.openKendoWindow("/sysm/SYSM212P", 410, 810, "center", 0, 50, false, {callbackKey: tabIdxMixString + "_fnUsrCallBack", isMulti:"N"});
}

function CMMT_resultGridDataByTab(data) {
    const tabIdx = CMMT500M_tabCMMT500M.select().index();
    const tempData = CMMT500M_dataPreProcessing(JSON.parse(data.CMMT500M));
    switch (tabIdx) {
        case 0:
            CMMT500M_classifiedData[tabIdx] = tempData;
            break;
        case 1:
            CMMT500M_classifiedData[tabIdx] = tempData.filter(obj => obj.noteType === "R");
            break;
        case 2:
            CMMT500M_classifiedData[tabIdx] = tempData.filter(obj => obj.noteType === "D");
            break;
        case 3:
            CMMT500M_classifiedData[tabIdx] = tempData.filter(obj => (obj.noteArchive));
            break;
    }
    CMMT500M_grdCMMT500M.dataSource.data(CMMT500M_classifiedData[tabIdx]);
    CMMT500M_refreshRawData();
}

function CMMT500M_getNoteDetail(e) {
    const clickItem = CMMT500M_grdCMMT500M.dataItem($(e).closest("tr"));
    if (clickItem.noteType === 'T') {
        CMMT500M_sendTempNote(e);
        return
    } else {
        let findRawDataItem = CMMT500M_rawData.find(obj => obj.noteNo === clickItem.noteNo);
        if (clickItem.noteType === 'R') {
            clickItem.set("noteRead", true);
            clickItem.dirty = false;
            clickItem.dirtyFields = null;
            CMMT500M_grdCMMT500M.refresh();
            CMMT500MDataSource.transport.change({
                tenantId: clickItem.tenantId,
                noteNo: clickItem.noteNo,
                recvNoteStCd: '2',
                recvrId: GLOBAL.session.user.usrId,
                recvrOrgCd: GLOBAL.session.user.orgCd,
            });
        }

        CMMT500M_fnPopup_CMMT550P({tenantId: findRawDataItem.tenantId, noteNo: findRawDataItem.noteNo});
    }

}

function CMMT500M_sendTempNote(e) {
    const clickItem = CMMT500M_grdCMMT500M.dataItem($(e).closest("tr"));
    CMMT500M_fnPopup_CMMT570P({
        category: "1",
        tenantId: clickItem.tenantId,
        noteNo: clickItem.noteNo,
        dpchmnId: clickItem.dpchmnId
    });
}

function CMMT500M_replyNote(e) {
    const clickItem = CMMT500M_grdCMMT500M.dataItem($(e).closest("tr"));
    replyNoteData = CMMT500M_rawData.find(obj => obj.noteNo === clickItem.noteNo)
    CMMT500M_fnPopup_CMMT570P({
        category: "2",
        tenantId: replyNoteData.tenantId,
        noteNo: replyNoteData.noteNo,
        dpchmnId: replyNoteData.dpchmnId
    });
}

function CMMT500M_forwardNote(e) {
    const clickItem = CMMT500M_grdCMMT500M.dataItem($(e).closest("tr"));
    forwardNoteData = CMMT500M_rawData.find(obj => obj.noteNo === clickItem.noteNo)
    CMMT500M_fnPopup_CMMT570P({
        category: "3",
        tenantId: forwardNoteData.tenantId,
        noteNo: forwardNoteData.noteNo,
        dpchmnId: forwardNoteData.dpchmnId
    });
}

function CMMT500M_fnRefreshGrid() {
    const tabIdx = CMMT500M_tabCMMT500M.select().index();
    switch (tabIdx) {
        case 0:
            CMMT510T_fnSearchNoteAll();
            break;
        case 1:
            CMMT520T_fnSearchReceiveNote();
            break;
        case 2:
            CMMT530T_fnSearchSendNote();
            break;
        case 3:
            CMMT540T_fnSearchArchive();
            break;
    }
}

function CMMT500M_fnPopup_CMMT550P(data) {
    Utils.openPop(GLOBAL.contextPath + "/cmmt/CMMT550P", "CMMT550P", 1000, 680, $.extend(data,{callbackKey:"CMMT500M_fnRefreshGrid"}));
}

function CMMT500M_fnPopup_CMMT570P(data) {
    Utils.setCallbackFunction("CMMT500M_fnRefreshGrid", CMMT500M_fnRefreshGrid);
    Utils.openPop(GLOBAL.contextPath + "/cmmt/CMMT570P", "CMMT570P", 1000, 720, $.extend(data,{callbackKey:"CMMT500M_fnRefreshGrid"}));
}

function CMMT500M_forDataTransfer(clickItem, noteStCd) {
    let param = {
        tenantId: clickItem.tenantId,
        regYr: clickItem.regYr,
        noteNo: clickItem.noteNo,
        noteType: clickItem.noteType,
    }

    if (clickItem.noteType === 'T') {
        return CMMT500MDataSource.transport.destroy(param);
    }
    if (clickItem.noteType === 'R') {
        const index = clickItem.recvrIdList.indexOf(GLOBAL.session.user.usrId)
        param.recvNoteStCd = noteStCd;
        param.recvrId = clickItem.recvrIdList[index];
        param.recvrOrgCd = clickItem.recvrOrgCdList[index];
    }
    if (clickItem.noteType === 'D') {
        param.dpchmnId = clickItem.dpchmnId;
        param.dpchmnOrgCd = clickItem.dpchmnOrgCd;
        param.dpchNoteStCd = noteStCd;
    }
    CMMT500MDataSource.transport.update(param);
}

function CMMT500M_getStCodeForUpdate(e) {
    const clickItem = CMMT500M_grdCMMT500M.dataItem($(e).closest("tr"));
    let noteStCd;
    if (e.classList.contains('deleteBtn')) {
        noteStCd = '9'
        Utils.confirm(CMMT500M_langMap.get("CMMT500M.valid.delete"),
            () => {
                CMMT500M_grdCMMT500M.removeRow($(e).closest("tr"));
                return CMMT500M_forDataTransfer(clickItem, noteStCd)
            })
    }
    if (e.classList.contains('importBtn')) {
        if (clickItem.noteType === 'T') {
            return Utils.alert(CMMT500M_langMap.get("CMMT500M.valid.archive"),
                () => $(e).toggleClass('Active'));
        }
        noteStCd = e.classList.contains('Active') ? '2' : '3';
        return CMMT500M_forDataTransfer(clickItem, noteStCd)
    }
}

function CMMT500M_noteUserFormat(obj, i) {
    obj[i].dpchmnUsr = ''.concat(obj[i].dpchmnNm, "(", obj[i].dpchmnId, ")");
        const recvrList = obj[i].recvrIdList;
        if(recvrList){
            const recvrLength = recvrList.length;
            for (let j = 0; j < recvrLength; j++) {
                if (obj[i].recvrId === "unnamed") {
                    return obj[i].recvrUsrs = "";
                }
                if (Utils.isNotNull(obj[i].recvrUsrs)) {
                    obj[i].recvrUsrs = obj[i].recvrUsrs.concat("; ", obj[i].recvrNmList[j], "(", obj[i].recvrIdList[j], ")");
                } else {
                    obj[i].recvrUsrs = ''.concat(obj[i].recvrNmList[j], "(", obj[i].recvrIdList[j], ")");
                }
            }
        }
}

function CMMT500M_dataPreProcessing(obj) {
    const usrId = GLOBAL.session.user.usrId;
    const objLength = obj.length;
    for (let i = 0; i < objLength; i++) {

        // 임시저장 분류
        if (obj[i].noteType === 'T') {
            obj[i].tempNote = usrId === obj[i].dpchmnId && obj[i].dpchNoteStCd === '1';
        }
        // 삭제 및 보관함 분류
        if (obj[i].noteType === 'D') {
            if (usrId === obj[i].dpchmnId && obj[i].dpchNoteStCd === '9') {
                obj[i].isDelete = true
                continue;
            }
            obj[i].noteArchive = usrId === obj[i].dpchmnId && obj[i].dpchNoteStCd === '3';
            obj[i].noteRead = obj[i].puslDv.includes('1');

        }
        if (obj[i].noteType === 'R') {
            const findIndex = obj[i].recvrIdList.indexOf(usrId);
            if (usrId === obj[i].recvrIdList[findIndex] && obj[i].recvNoteStCdList[findIndex] === '9') {
                obj[i].isDelete = true
                continue;
            }
            obj[i].noteRead = usrId === obj[i].recvrIdList[findIndex] && obj[i].recvNoteStCdList[findIndex] === '2';
            obj[i].noteArchive = usrId === obj[i].recvrIdList[findIndex] && obj[i].recvNoteStCdList[findIndex] === '3';
            // obj[i].noteRead = obj[i].puslDv.split(",").indexOf('1') === findIndex;
        }

        // 보낸사람, 받는사람 형식 - 이름(ID)
        CMMT500M_noteUserFormat(obj, i);
    }
    return obj.filter(e => !e.isDelete && e.noteType !== 'N');
}

function noteArchiveTemplate(data) {
    if (data.noteType === 'T') return "";

    let ArchiveTemplate = `<button class="importBtn k-icon k-i-star-outline" name="${data.noteNo}" onclick="CMMT500M_getStCodeForUpdate(this)"></button>`
    if (data.noteArchive) {
        ArchiveTemplate = '<button class="importBtn k-icon k-i-star-outline Active" onclick="CMMT500M_getStCodeForUpdate(this)"></button>'
    }
    return '<p class="noteBtnZoon">' + ArchiveTemplate +
        '<button class="importBtn icoComp_mailReply" title="회신" onclick="CMMT500M_replyNote(this);"></button>' +
        '<button class="importBtn icoComp_mailForward" title="전달" onclick="CMMT500M_forwardNote(this);"></button>' + '</p>'
}

function TempOrDeleteNoteTemplate(data) {
    let TempNoteTemplate = "";
    if (data.tempNote) {
        TempNoteTemplate = '<button class="k-icon k-i-edit" onclick="CMMT500M_sendTempNote(this)"></button>'
    }
    return '<p class="noteBtnZoon">' + TempNoteTemplate +
        '<button class="k-icon k-i-delete deleteBtn" onclick="CMMT500M_getStCodeForUpdate(this);"></button>' + '</p>'
}

$(window).resize(function () {
    CMMT500M_resizeGrid();
});

function CMMT500M_resizeGrid() {
    const screenHeight = $(window).height() - 210;     //   (헤더+ 푸터 ) 영역 높이 제외
    CMMT500M_grdCMMT500M.element.find('.k-grid-content').css('height', screenHeight - 300);   //   (헤더+ 푸터+ 검색 )영역 높이 440
}

function CMMT500M_fnDownloadFile(e) {
    const apndFilePsn = $(e).data("psn");
    var pathKey =  "NOTE";
    var fileName = $(e).data("index");
    var oriFileName  = $(e).data("name");
    var tenant = GLOBAL.session.user.tenantId;
    window.location.href = GLOBAL.contextPath + "/file/download?pathKey="+ pathKey +"&fileName="+ fileName+ "&oriFileName=" +oriFileName +"&tenant=" + tenant;
}
// function CMMT500M_openNoteAndChangeGrid(e) {
//     let index = e.masterRow.index();
//     let currentRow = CMMT500M_grdCMMT500M.dataItem(e.masterRow);
//
//     if (currentRow.noteType === 'R' && !currentRow.noteRead) {
//         currentRow.set("noteRead", true);
//         currentRow.dirty = false;
//         currentRow.dirtyFields = null;
//         CMMT500M_grdCMMT500M.refresh();
//
//         CMMT500MDataSource.transport.change({
//             tenantId: currentRow.tenantId,
//             noteNo: currentRow.noteNo,
//             recvNoteStCd: '2',
//             recvrId: GLOBAL.session.user.usrId,
//             recvrOrgCd: GLOBAL.session.user.orgCd,
//         });
//         return this.expandRow(this.tbody.find("tr.k-master-row").eq(index));
//     }
// }
//