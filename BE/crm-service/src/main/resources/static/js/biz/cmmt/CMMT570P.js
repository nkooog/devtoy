/***********************************************************************************************
 * Program Name : CMMT570P.js
 * Creator      : mhlee
 * Create Date  : 2022.07.18
 * Description  : 쪽지답장 및 전달
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.07.18     mhlee            최초생성
 *
 ************************************************************************************************/
//TODO 쪽지 회신 전달 구분


let CMMT570P_noteToSendData;
let CMMT570P_fileCount = 0, CMMT570P_fileSize = 0, CMMT570P_fileList = [];
let CMMT570P_noteTitlePrefix;

$(document).ready(function () {
    const CMMT570P_prefixObj = {"1": "", "2": "RE: ", "3": "FW: "}
    CMMT570P_noteTitlePrefix = CMMT570P_prefixObj[Utils.getUrlParam('category')];
    CMMT570P_fnSummEdtCreate("CMMT570P_editor");

    CMMT570P_getOriginalNote();
});

//summereditor 생성
function CMMT570P_fnSummEdtCreate(nId){
	
	$('#'+nId).summernote({
		height: 350,
		minHeight: 200,
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
		  ],
	});
}

function CMMT570P_getOriginalNote() {
    Utils.ajaxCall(
        "/cmmt/CMMT500SEL02",
        JSON.stringify({
            tenantId: Utils.getUrlParam('tenantId'),
            noteNo: Number(Utils.getUrlParam('noteNo')),
            usrId: Utils.getUrlParam('dpchmnId')
        }),
        function (data) {
            CMMT570P_noteToSendData = JSON.parse(data.CMMT500M);
            CMMT570P_fnSetValue(CMMT570P_noteToSendData);
        })
}

function CMMT570P_fnSetValue(data) {
    const set = noteUtils('CMMT570P');
    let CMMT570_recvrUsr = {
        recvrId: data.dpchmnId,
        recvrNm: data.dpchmnNm,
        recvrOrgNm: data.dpchmnOrgNm,
        recvrOrgCd: data.dpchmnOrgCd,
        dpchDdSi: data.dpchDdSi,
    }
    if (Utils.getUrlParam('category') === '1')
        set.recvrUsrInsertForTemp(
            {
                recvrIdList: data.recvrIdList,
                recvrNmList: data.recvrNmList,
                recvrOrgCdList: data.recvrOrgCdList,
                recvrOrgNmList: data.recvrOrgNmList
            })
    if (Utils.getUrlParam('category') === '2')
        set.recvrUsrInsertForReply(CMMT570_recvrUsr)

    set.dataInput('noteTite', ''.concat(CMMT570P_noteTitlePrefix, set.replaceNoteTitleOrContent(data.noteTite)));
    
//    editor.SetBodyValue(noteUtils().replaceNoteTitleOrContent(value));
    $('#CMMT570P_editor').summernote('code', noteUtils().replaceNoteTitleOrContent(data.noteCtt));
    let recvrInfo = { recvrIdList: data.recvrIdList, recvrNmList: data.recvrNmList };
    let dpchmnInfo = CMMT570_recvrUsr;
    if (recvrInfo.recvrIdList.length > 0) {
        for (let i = 0; i < recvrInfo.recvrIdList.length; i++) {
            if (Utils.isNotNull(recvrInfo.recvrUsrs)) {
                recvrInfo.recvrUsrs = recvrInfo.recvrUsrs.concat("; ", recvrInfo.recvrNmList[i], "(", recvrInfo.recvrIdList[i], ")");
            } else {
                recvrInfo.recvrUsrs = ''.concat(recvrInfo.recvrNmList[i], "(", recvrInfo.recvrIdList[i], ")");
            }
        }
    }
    if (Utils.isNotNull(CMMT570P_noteTitlePrefix)) {
        let noteTempHtml = '<p><br /></p><p><br /></p><p><br /></p><hr />'
        noteTempHtml += '<b>'+CMMT_NOTE_langMap.get("CMMT.NOTE.dpchmnUsr")+': </b><span>' + dpchmnInfo.recvrNm + "(" + dpchmnInfo.recvrId + ")" + '</span><br />'
        noteTempHtml += '<b>'+CMMT_NOTE_langMap.get("CMMT.NOTE.recvrUsrs")+': </b><span>' + recvrInfo.recvrUsrs + '</span><br />'
        noteTempHtml += '<b>'+CMMT_NOTE_langMap.get("CMMT.NOTE.sentDate")+': </b><span>' + kendo.toString(new Date(dpchmnInfo.dpchDdSi), "yyyy-MM-dd HH:mm:ss") + '</span><br /><br />'
        $('#CMMT570P_editor').summernote('code', noteUtils().replaceNoteTitleOrContent(data.noteCtt) + noteTempHtml);
    }

    if (data.apndCount > 0) {
        CMMT570P_addExistApndFile(data);
    }
}

function CMMT570P_fnSearchUsrPopup_SYSM212P() {
    Utils.setCallbackFunction("CMMT570P_fnUsrCallBack", function (data) {
        let tempUsrList = [];
        $('#CMMT570P_recvrInfo > li').each(function () {
            let currentUsrId = $(this).data('usrId');
            tempUsrList.push(String(currentUsrId));
        })
        noteUtils('CMMT570P').fnAddRecvrUsr(data.filter(x => !tempUsrList.includes(x.usrId)));

    });
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM212P", "SYSM212P", 410, 810, {callbackKey: "CMMT570P_fnUsrCallBack",mySelf:"N"});
}

function CMMT570P_apndFile(obj) {
    const set = noteUtils('CMMT570P');
    let uploadFile = obj.files;
    let uploadSize = set.checkExt(uploadFile, CMMT570P_fileSize);
    if (Utils.isNotNull(uploadSize)) {
        for (const file of uploadFile) {
            const CMMT570P_addFileTag = [];
            CMMT570P_addFileTag.push(`<li id="CMMT570P_file${CMMT570P_fileCount}"><mark class="icoComp_download"></mark>`);
            CMMT570P_addFileTag.push(`<span onclick="CMMT570P_fnDownloadFile(this);">${file.name}<small>(${set.getByteSize(file.size)})</small></span>`);
            CMMT570P_addFileTag.push(`<button onclick="noteUtils().removeApndFile('CMMT570P',${CMMT570P_fileCount},CMMT570P_fileList);" class="btDelete k-icon k-i-x" title="삭제"></button></li>`);

            $("#CMMT570P [name=apndFileNmList]").append(CMMT570P_addFileTag.join(""));
            CMMT570P_fileSize = uploadSize;
            CMMT570P_fileList.push(file);
            CMMT570P_fileCount++
        }
    }
    set.fnFileCount('CMMT570P', CMMT570P_fileList);
    $("input[type=file]").val("");
}

function CMMT570P_fnDownloadFile(obj) {
    let data = CMMT570P_fileList.find(x => x.name === obj.childNodes[0].data);
    let path = window.URL.createObjectURL(data)
    let link = document.createElement('a')
    link.href = path;
    link.download = data.name;
    link.click();
    link.remove();
}

function CMMT570P_addExistApndFile(obj) {
    const set = noteUtils('CMMT570P');
    for (let i = 0; i < obj.apndCount; i++) {
        Utils.ajaxCallFileDownload(
            "/cmmt/CMMT500SEL10", obj.apndFilePsnList[i], obj.apndFileIdxNmList[i],
            function (fileBinary) {
                let file = new File([fileBinary], obj.apndFileNmList[i]);
                CMMT570P_fileList.push(file);
                const tempHtml = [];
                tempHtml.push(`<li id="CMMT570P_file${i}"><mark class="icoComp_download"></mark>`)
                tempHtml.push(`<span onclick="CMMT570P_fnDownloadFile(this);">${obj.apndFileNmList[i]}<small>(${set.getByteSize(file.size)})</small></span>`)
                tempHtml.push(`<button onclick="noteUtils().removeApndFile('CMMT570P',${CMMT570P_fileCount},CMMT570P_fileList);" class="btDelete k-icon k-i-x" title="삭제"></button></li>`)
                $("#CMMT570P [name=apndFileNmList]").append(tempHtml.join(""));
                CMMT570P_fileCount++
                CMMT570P_fileSize += file.size;
            }, null, null, null);
    }
    set.fnFileCount('CMMT570P', CMMT570P_fileList);
}

function CMMT570P_sendNote(stCd) {
    let formData = new FormData();
    let recvrInfoList = [];
    $('#CMMT570P_recvrInfo li').each(function () {
        recvrInfoList.push({
            recvrId: this.dataset.usrId,
            recvrOrgCd: this.dataset.orgCd,
        })
    })
    let param = {
        tenantId: GLOBAL.session.user.tenantId,
        dpchmnId: GLOBAL.session.user.usrId,
        dpchmnOrgCd: GLOBAL.session.user.orgCd,
        regYr: CMMT570P_noteToSendData.regYr,
        dpchNoteStCd: stCd,
        noteWrtgDvCd: Utils.getUrlParam('category'),
        recvrInfo: recvrInfoList,
        noteTite: $("#CMMT570P [name=noteTite]").val(),
        noteCtt: $('#CMMT570P_editor').summernote('code'),
        otxtNoteNo: Number(Utils.getUrlParam('noteNo')),
        // apndInfo : CMMT570P_fileList.filter(x=>(!x.delete))
    }
    CMMT570P_noteToSendData.dpchNoteStCd === '1'
        ? param.noteNo = CMMT570P_noteToSendData.noteNo : false;

    formData.append('noteData', JSON.stringify(param));
    CMMT570P_fileList = CMMT570P_fileList.filter(x => !x.delete);
    if (CMMT570P_fileList.length > 0) {
        for (const file of CMMT570P_fileList) {
            formData.append('noteFiles', file);
        }
    }

    console.log(param);
    console.log(formData);
    $.ajax({
        url: stCd === '2' ? GLOBAL.contextPath + '/cmmt/CMMT570INS01' : GLOBAL.contextPath + '/cmmt/CMMT570INS03',
        type: 'POST',
        enctype: 'multipart/form-data',  //필수
        data: formData,
        cache: false,                  //필수
        contentType: false,                  //필수
        processData: false,                  //필수
        timeout: 18000,                  //필수
        success: function (result) {
            Utils.alert(result.msg, function() {
                if (Utils.getUrlParam('callbackKey')) {
                    Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
                } else {
                    self.close();
                }
            });
            
        },
        error: function (request, status, error) {
            console.log("[error]");
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        }
    });
}

function CMMT570P_fnValidation() {
    //const set = noteUtils('CMMT570P')
    //if (set.fnValidation(CMMT570P_editor)) CMMT570P_sendNote('2');
	
	const noteTitle = $("#CMMT570P [name=noteTite]");
    if (Utils.isNull(noteTitle.val().trim())) {
        return Utils.alert(CMMT_NOTE_langMap.get("CMMT.NOTE.valid.title"));
    }
    const noteContent = $('<div>').html($('#CMMT570P_editor').summernote('code')).text();
    if (Utils.isNull(noteContent)) {
        return Utils.alert(CMMT_NOTE_langMap.get("CMMT.NOTE.valid.content"));
    }
    const recvrUsrList = $('#CMMT570P_recvrInfo li');
    if (recvrUsrList.length === 0) {
        return Utils.alert(CMMT_NOTE_langMap.get("CMMT.NOTE.valid.recvrInfo"));
    }
    
    CMMT570P_sendNote('2');
}