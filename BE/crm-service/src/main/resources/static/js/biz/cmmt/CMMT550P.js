/***********************************************************************************************
 * Program Name : CMMT550P.js
 * Creator      : mhlee
 * Create Date  : 2022.07.04
 * Description  : 쪽지상세조회
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.07.04     mhlee            최초생성
 *
 ************************************************************************************************/


var CMMT550P_noteDetailData;
$(document).ready(function () {
    CMMT550P_getNoteDetail();
    CMMT550P_fnResize();
});

$(window).resize(function(){
	CMMT550P_fnResize();
});


function CMMT550P_getNoteDetail() {
    Utils.ajaxCall(
        "/cmmt/CMMT500SEL02",
        JSON.stringify({
            tenantId : Utils.getUrlParam('tenantId'),
            noteNo : Number(Utils.getUrlParam('noteNo')),
            usrId : GLOBAL.session.user.usrId,
        }),
        function (data) {
            CMMT550P_noteDetailData = JSON.parse(data.CMMT500M);
            CMMT550P_fnSetValue(CMMT550P_noteDetailData);
        })
}

function apndFileTemplate(obj) {
    let targetInput = $("#CMMT550P [name=apndFileNmList]");
    // for (let i = 0; i < obj.apndCount; i++) {
    //     const tempHtml = [];
    //     tempHtml.push = "<li><a><mark class='icoComp_download'></mark>";
    //     tempHtml.push = `<span onclick="CMMT550P_fnDownloadFile(this)" data-index="${obj.apndFileIdxNmList[i]}" data-psn="${obj.apndFilePsnList[i]}">${obj.apndFileNmList[i]}`;
    //     tempHtml.push = `<small>(${noteUtils().getByteSize(Number(obj.apndFileSzList[i]))})</small></span></a></li>`
    //     targetInput.append(tempHtml.join(""));
    // }
    for (let i = 0; i < obj.apndCount; i++) {
        const tempHtml = [];
        tempHtml.push('<li><a><mark class="icoComp_download"></mark>');
        tempHtml.push(`<span onclick='CMMT550P_fnDownloadFile(this)' data-name="${obj.apndFileNmList[i]}" data-index="${obj.apndFileIdxNmList[i]}" data-psn="${obj.apndFilePsnList[i]}">${obj.apndFileNmList[i]}`);
        tempHtml.push(`<small>(${noteUtils().getByteSize(Number(obj.apndFileSzList[i]))})</small></span></a></li>`);
        targetInput.append(tempHtml.join(""));
    }
}

function CMMT550P_fnSetValue(data) {
    const set = noteUtils('CMMT550P');
    let CMMT550_obj = {
        noteTite: set.replaceNoteTitleOrContent(data.noteTite),
        noteCtt : set.replaceNoteTitleOrContent(data.noteCtt),
        dpchmnUsr : set.dpchmUsrTemplate(data.dpchmnId,data.dpchmnNm),
        dpchDdSi: kendo.toString(new Date(data.dpchDdSi), "yyyy-MM-dd HH:mm:ss"),
    }
    for (const key of Object.keys(CMMT550_obj)) {
        set.dataAddText(key, CMMT550_obj[key]);
    }
    let CMMT550_recvrUsr = {
        recvrIdList : data.recvrIdList,
        recvrNmList : data.recvrNmList,
        recvrOrgCdList : data.recvrOrgCdList,
        recvrOrgNmList : data.recvrOrgNmList,
    }
    set.recvrUsrInsertForRead(CMMT550_recvrUsr);

    if (data.apndCount > 0) {
        let CMMT550_apndFile = {
            apndCount : data.apndCount,
            apndFileNmList: data.apndFileNmList,
            apndFileIdxNmList: data.apndFileIdxNmList,
            apndFilePsnList   : data.apndFilePsnList,
            apndFileSzList   : data.apndFileSzList,
        }
        apndFileTemplate(CMMT550_apndFile);
    }
    console.log(CMMT550_obj, CMMT550_recvrUsr)
}

function CMMT550P_fnDownloadFile(e) {
    const apndFilePsn = $(e).data("psn");
    var pathKey =  "NOTE";
    var fileName = $(e).data("index");
    var oriFileName  = $(e).data("name");
    var tenant = GLOBAL.session.user.tenantId;
    window.location.href = GLOBAL.contextPath + "/file/download?pathKey="+ pathKey +"&fileName="+ fileName+ "&oriFileName=" +oriFileName +"&tenant=" + tenant;
}

function CMMT550P_replyNote() {
    CMMT550P_fnPopup_CMMT570P({
        category: "2",
        tenantId: CMMT550P_noteDetailData.tenantId,
        noteNo: CMMT550P_noteDetailData.noteNo,
        dpchmnId: CMMT550P_noteDetailData.dpchmnId
    });
}

function CMMT550P_forwardNote() {
    CMMT550P_fnPopup_CMMT570P({
        category: "3",
        tenantId: CMMT550P_noteDetailData.tenantId,
        noteNo: CMMT550P_noteDetailData.noteNo,
        dpchmnId: CMMT550P_noteDetailData.dpchmnId
    });
}

function CMMT550P_fnPopup_CMMT570P(param) {
    Utils.openPop(GLOBAL.contextPath + "/cmmt/CMMT570P", "CMMT570P", 1000, 700, param);
}


function CMMT550P_fnResize(){
	let screenHeight = $(window).height();
	$("#CMMT550P_editor").css('height', screenHeight-260);
}