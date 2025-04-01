/***********************************************************************************************
 * Program Name : 컨텐츠 반려사유 등록 팝업(CMMT330P.js)
 * Creator      : bykim
 * Create Date  : 2022.07.10
 * Description  : 컨텐츠 반려사유 등록 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.07.10     bykim           최초 생성
 * 2022.07.29     mhlee           전반적인 수정
 ************************************************************************************************/

$(document).ready(function () {
    if (CMMT330P_langMap.get('tndwSeq')) {
        Utils.ajaxCall('/cmmt/CMMT331SEL01', JSON.stringify(CMMT330P_dvParam()), function (data) {
            const ctt = JSON.parse(data.CMMT331P);
            $('#CMMT330P_apprStRsnCtt').val(ctt[0].tndwRsn);
        });
    }

    if (!CMMT330P_langMap.get('category')) {
        $('#CMMT330P_apprStRsnCtt').attr('placeholder',`
        요구 param
        -category(지식=K , 게시판=C)
        -ctgrNo(지식=ctgrNo   , 게시판=ctgrMgntNo
        -mgntNo(지식=cntntsNo , 게시판=blthgMgntNo
        -tndwSeq(수정일 경우만) !신규일 경우 필요 없음`)
    }
})

function CMMT330P_dvParam(param) {
    if (Utils.isNull(param)) {
        param = {};
    }
    param.category =  CMMT330P_langMap.get('category');
    param.tenantId = GLOBAL.session.user.tenantId;
    param.tndwSeq = Number(CMMT330P_langMap.get('tndwSeq'));
    if (param.category === 'K') {
        param.ctgrNo = Number(CMMT330P_langMap.get('ctgrNo'));
        param.cntntsNo = Number(CMMT330P_langMap.get('mgntNo'));
    }
    if (param.category === 'C') {
        param.ctgrMgntNo = Number(CMMT330P_langMap.get('ctgrNo'));
        param.blthgMgntNo = Number(CMMT330P_langMap.get('mgntNo'));
    }
    return param;
}

function CMMT330P_fnSaveRsnForRejection() {
    const CMMT330P_url = '/cmmt/CMMT330INS01';
    let param = CMMT330P_getParam();
    CMMT330P_dvParam(param);
    Utils.ajaxCall(CMMT330P_url, JSON.stringify(param), function(data) {
        Utils.alert(data.msg, CMMT330P_fnRtnAlert);
    });
}

function CMMT330P_getParam() {
    const CMMT330P_rsnCtt = $('#CMMT330P_apprStRsnCtt').val();
    Utils.markingRequiredField();
    if (!CMMT330P_rsnCtt) {
        Utils.alert(CMMT330P_langMap.get("CMMT330P.input.msg"));
        return;
    }
    return {
        tndwRsn: CMMT330P_rsnCtt,
        rjtrId: GLOBAL.session.user.usrId,
        rjtrOrgCd: GLOBAL.session.user.orgCd,
    };
}
//======================================================================================================================
//Button Event - 확인 버튼 클릭
function CMMT330P_fnRtnAlert() {
    Utils.getPopupCallback(CMMT330P_langMap.get('callbackKey'))();
	Utils.closeKendoWindow(CMMT330P_Id);
}


