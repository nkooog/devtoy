/*******************************************************************************
 * Program Name : 뉴스레터 등록 (SAMPLE999P.js) Creator :  Create Date : 2024.05.23
 * Description : 뉴스레터 등록 :
 * -----------------------------------------------------------------------------------------------
 * Date | Updater | Remark
 * -----------------------------------------------------------------------------------------------
 * 2024.05.23  최초작성
 ******************************************************************************/

var SAMPLE999P_cmmCodeList, SAMPLE999P_grid, SAMPLE999PDataSource, SAMPLE999P_ToolTip, SAMPLE999P_selItem=[];
$(document).ready(function () {

    $('#SAMPLE999P button[name=SAMPLE999P_btnSave]').off("click").on('click', function () {
        SAMPLE999P_fnSave();
    });

    //초기화 버튼
    $('#SAMPLE999P button[name=SAMPLE999P_btnInit]').off("click").on('click', function () {
        SAMPLE999P_fnReset();
    });

    SAMPLE999P_init();
});

function SAMPLE999P_init() {
    if (Utils.getUrlParam("callbackKey") == "SAMPLE999P_fnCreate" || Utils.getUrlParam("viewType") == 'Y') {
        window.resizeTo(1240, 1000);
        SAMPLE999P_fnSummEdtCreate("SAMPLE999P_edtContEdit");
        $('#SAMPLE999P_divCont').css('display', 'block');
        $('#edtBtnArea').css('display', 'flex');
    }
    else {
        window.resizeTo(1240, 920);
        $('#SAMPLE999P_divCont_readonly').css('display', 'block');
        $('#edtBtnArea').remove();
        $('#SAMPLE999P input[name=SAMPLE999P_inputTitle]').prop('readonly', true);
        $('input[name="SAMPLE999P_chkNlBltnYn"]').prop('disabled', true);
    }

    console.log(Utils.getUrlParam("nlMgntSeq"));

    if(Utils.getUrlParam("nlMgntSeq")) SAMPLE999P_fnInputSetting();
}

function SAMPLE999P_fnInputSetting() {
    let param = {
        nlMgntSeq: Utils.getUrlParam("nlMgntSeq"),
    }

    console.log(Utils.getUrlParam("nlMgntSeq"));

    Utils.ajaxCall('/sample/SAMPLE999PSEL01',  JSON.stringify(param),function(data){
        let info = JSON.parse(JSON.parse(JSON.stringify(data.info)));

        if(info.nlBltnYn ==="Y"){ $('input[name="SAMPLE999P_chkNlBltnYn"]').prop('checked', true);}
        else{$('input[name="SAMPLE999P_chkNlBltnYn"]').prop('checked', false);}

        $('#SAMPLE999P input[name=SAMPLE999P_nlMgntSeq]').val(info.nlMgntSeq);
        $('#SAMPLE999P input[name=SAMPLE999P_inputTitle]').val(info.nlTite);
        $('#SAMPLE999P_edtContEdit').summernote('code', info.nlCtt);

        $('#SAMPLE999P_nlCtt').html(info.nlCtt);

    },null,null,null);
}

//summereditor 생성
function SAMPLE999P_fnSummEdtCreate(nId){

    let selArrId = nId.split('_');

    $('#'+nId).summernote({
        height: 580,                 // set editor height
        minHeight: 180,             // set minimum height of editor

//		maxHeight: 180,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['color', ['forecolor','color']],
            ['para', ['paragraph']],
            ['table', ['table']],
            ['view', ['codeview']],
            ['insert', ['link', 'picture']],
        ],
        callbacks: {
            onImageUpload : function(files) {
                SAMPLE999P_fnSummNoteImgUpload(files[0], this, nId);
            },
        },
    });
}

function SAMPLE999P_fnSummNoteImgUpload(file, editor, nId) {

    var formData = new FormData();

    formData.append('img_files', file);

    formData.append('COMM100INS01_data',JSON.stringify({
        tenantId : GLOBAL.session.user.tenantId
        , UsrId : GLOBAL.session.user.user
        , orgCd : GLOBAL.session.user.orgCd
        , uploadPath : "CMMT_NL_CNTS_TMP"
    }));

    Utils.ajaxCallFormData('/sample/COMM100INS01',formData,function(data){
        let fileSaveData = JSON.parse(data.info);

        for(var i=0; i<fileSaveData.length; i++){
            let url = GLOBAL.contextPath+"/cmmtnlphotocntstmp/"+GLOBAL.session.user.tenantId+"/"+ fileSaveData[i].apndFileIdxNm;
            $('#'+nId).summernote('insertImage', url);
        }

    });
}

//저장
function SAMPLE999P_fnSave() {

    let nlTite = $('#SAMPLE999P input[name=SAMPLE999P_inputTitle]').val();
    let nlCtt = $('#SAMPLE999P_edtContEdit').summernote('code');

    //유효성 검사
    if(Utils.isNull(nlTite)){
        Utils.alert("제목을 입력해주세요.");
        return;
    }
    if(Utils.isNull(nlCtt)){
        Utils.alert("내용을 입력해주세요.");
        return;
    }

    let param = {
        nlTite: nlTite,
        nlCtt: nlCtt,
        nlBltnYn: $('input[name="SAMPLE999P_chkNlBltnYn"]').prop('checked') ? 'Y' : 'N',
    }

    if (Utils.getUrlParam("callbackKey") == "SAMPLE999P_fnCreate") {

        let addData = {
            regrId: GLOBAL.session.user.usrId,
            regrOrgCd: GLOBAL.session.user.orgCd,
        }
        $.extend(param, addData);

        Utils.confirm("뉴스레터를 등록하시겠습니까?", function () {
            Utils.ajaxCall("/sample/SAMPLE999PINS01", JSON.stringify(param), function (result) {
                if(result.result == 0) {
                    Utils.alert(result.msg);
                } else {
                    Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
                    Utils.alert("정상적으로 저장되었습니다." ,window.close);
                }
            });
        });

    } else {

        let modData = {
            nlMgntSeq: $('#SAMPLE999P input[name=SAMPLE999P_nlMgntSeq]').val(),
            lstCorprId: GLOBAL.session.user.usrId,
            lstCorprOrgCd: GLOBAL.session.user.orgCd,
        }
        $.extend(param, modData);

        Utils.confirm("뉴스레터를 수정하시겠습니까?", function () {
            Utils.ajaxCall("/sample/SAMPLE999PUPT01", JSON.stringify(param), function (result) {
                if(result.result == 0) {
                    Utils.alert(result.msg);
                } else {
                    Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
                    Utils.alert("정상적으로 수정되었습니다." ,window.close);
                }
            });
        });
    }
}

function SAMPLE999P_fnReset() {
    Utils.confirm("작성된 내용을 모두 초기화합니다.<br/>계속하시겠습니까?", function () {
        $('#SAMPLE999P input[name=SAMPLE999P_inputTitle]').val('');
        $('#SAMPLE999P_edtContEdit').summernote('code', '');
    });
}