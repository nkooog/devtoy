/***********************************************************************************************
 * Program Name : CMMT550P.js
 * Creator      : mhlee
 * Create Date  : 2022.07.04
 * Description  : 쪽지쓰기
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.07.04     mhlee            최초생성
 *
 ************************************************************************************************/
var CMMT560P_fileList = [];
var CMMT560P_fileCount = 0, CMMT560P_fileSize = 0;
$(document).ready(function () {
	CMMT560P_fnSummEdtCreate("CMMT560P_editor");
});

//summereditor 생성
function CMMT560P_fnSummEdtCreate(nId){
	
	var fontList = ['맑은 고딕', '굴림', '돋움', '바탕', '궁서', 'NotoSansKR', 'Arial', 'Courier New', 'Verdana', 'Tahoma', 'Times New Roamn'];
	
	$('#'+nId).summernote({
		height: 270,
		minHeight: 200,
		fontNames: fontList,
		fontNamesIgnoreCheck : fontList,
		fontNamesIgnoreCheck : ['맑은 고딕'],
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

function CMMT560P_fnSearchUsrPopup_SYSM212P() {
    Utils.setCallbackFunction("CMMT560P_fnUsrCallBack", function (data) {
        let tempUsrList = [];
        $('#CMMT560P_recvrInfo > li').each(function () {
            let currentUsrId = $(this).data('usrId');
            tempUsrList.push(String(currentUsrId));
        })
        noteUtils('CMMT560P').fnAddRecvrUsr(data.filter(x => !tempUsrList.includes(x.usrId)));

    });
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM212P", "SYSM212P", 410, 810, {callbackKey: "CMMT560P_fnUsrCallBack", mySelf:"N"});
}

function CMMT560P_apndFile(obj) {
    const set = noteUtils('CMMT560P');
    let uploadFile = obj.files;
    let uploadSize = set.checkExt(uploadFile, CMMT560P_fileSize);
    if (Utils.isNotNull(uploadSize)) {
        for (const file of uploadFile) {
            const CMMT560P_addFileTag = [];
            CMMT560P_addFileTag.push(`<li id="CMMT560P_file${CMMT560P_fileCount}"><mark class="icoComp_download"></mark>`);
            CMMT560P_addFileTag.push(`<span onclick="CMMT560P_fnDownloadFile(this);">${file.name}<small>(${set.getByteSize(file.size)})</small></span>`);
            CMMT560P_addFileTag.push(`<button onclick="noteUtils().removeApndFile('CMMT560P',${CMMT560P_fileCount},CMMT560P_fileList);" class="btDelete k-icon k-i-x" title="삭제"></button></li>`);
            $("#CMMT560P [name=apndFileNmList]").append(CMMT560P_addFileTag.join(""));
            CMMT560P_fileSize = uploadSize;
            CMMT560P_fileList.push(file);
            CMMT560P_fileCount++
        }
    }
    set.fnFileCount('CMMT560P', CMMT560P_fileList);
    $("input[type=file]").val("");
}

function CMMT560P_fnDownloadFile(obj) {
    let data = CMMT560P_fileList.find(x => x.name === obj.childNodes[0].data);
    let path = window.URL.createObjectURL(data)
    let link = document.createElement('a')
    link.href = path;
    link.download = data.name;
    link.click();
    link.remove();
}


function CMMT560P_sendNote(stCd) {
    let formData = new FormData();
    let recvrInfoList = [];
    $('#CMMT560P_recvrInfo li').each(function () {
        recvrInfoList.push({
            recvrId : this.dataset.usrId,
            recvrOrgCd : this.dataset.orgCd,
        })
    })
    let param = {
        tenantId : GLOBAL.session.user.tenantId,
        dpchmnId : GLOBAL.session.user.usrId,
        dpchmnOrgCd : GLOBAL.session.user.orgCd,
        dpchNoteStCd : stCd,
        recvrInfo : recvrInfoList,
        noteTite : $("#CMMT560P [name=noteTite]").val(),
        noteCtt : $('#CMMT560P_editor').summernote('code'),
    }
    formData.append('noteData',JSON.stringify(param));
    CMMT560P_fileList = CMMT560P_fileList.filter(x=>!x.delete);
    if (CMMT560P_fileList.length > 0) {
        for (const file of CMMT560P_fileList) {
            formData.append('noteFiles', file);
        }
    }
    console.log(param);
    console.log(formData);
    $.ajax({
        url         : stCd === '2' ? GLOBAL.contextPath + '/cmmt/CMMT560INS01' : GLOBAL.contextPath + '/cmmt/CMMT560INS03',
        type        : 'POST',
        enctype     : 'multipart/form-data',  //필수
        data        : formData,
        cache       : false,                  //필수
        contentType : false,                  //필수
        processData : false,                  //필수
        timeout     : 18000,                  //필수
        success     : function(result) {
            Utils.alert(result.msg);
            setInterval(function() {
                self.close();
            }, 1000);
            window.opener.CMMT500M_fnRefreshGrid();

        },
        error       : function(request,status, error){
            console.log("[error]");
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    }) ;
}

function CMMT560P_fnValidation() {
    //const set = noteUtils('CMMT560P');
    //if (set.fnValidation(CMMT560P_editor)) CMMT560P_sendNote('2');
	
	const noteTitle = $("#CMMT560P [name=noteTite]");
    if (Utils.isNull(noteTitle.val().trim())) {
        return Utils.alert(CMMT_NOTE_langMap.get("CMMT.NOTE.valid.title"));
    }
    const noteContent = $('<div>').html($('#CMMT560P_editor').summernote('code')).text();
    if (Utils.isNull(noteContent)) {
        return Utils.alert(CMMT_NOTE_langMap.get("CMMT.NOTE.valid.content"));
    }
    const recvrUsrList = $('#CMMT560P_recvrInfo li');
    if (recvrUsrList.length === 0) {
        return Utils.alert(CMMT_NOTE_langMap.get("CMMT.NOTE.valid.recvrInfo"));
    }
    
    CMMT560P_sendNote('2');
}