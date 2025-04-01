/***********************************************************************************************
 * Program Name : FRME231P.js
 * Creator      : bykim
 * Create Date  : 2023.04.04
 * Description  : 콜백상세조회
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.04.04     bykim            최초생성

 ************************************************************************************************/

$(document).ready(function () {

   // FRME231P_fnSelectCmmCode();

    let obj = window.opener.FRME230P_selItem;

    if (obj.vceCabackYn == 'Y') {
        $('#FRME231P_phrecKey') .css("visibility", "visible");
    }

    $('#FRME231P input[name=cabackInfwShpCdNm]').val(obj.cabackInfwShpCdNm)
    $('#FRME231P input[name=cabackProcStCd]').val(obj.cabackProcStCdNm);
    $('#FRME231P input[name=cabackId]').val(obj.cabackId);
    $('#FRME231P input[name=inclTelNo]').val(obj.inclTelNo);
    $('#FRME231P input[name=cabackInclRpsno]').val(obj.cabackInclRpsno);
    $('#FRME231P input[name=ivrAcesCd]').val(obj.ivrAcesCd);
    $('#FRME231P input[name=cabackRegDtm]').val(obj.cabackRegDtm);
    $('#FRME231P input[name=cabackAltmDtm]').val(obj.cabackAltmDtm);
    $('#FRME231P input[name=cnslrId]').val(obj.cnslrId +" ("+obj.orgNm+"/"+obj.cnslrNm+")");
    $('#FRME231P textarea[name=sttTxt]').val(obj.sttTxt);
    $('#FRME231P input[name=webCabackCustNm]').val(obj.webCabackCustNm);
    $('#FRME231P textarea[name=webCabackMsg]').val(obj.webCabackMsg);

    switch(obj.vceCabackYn){
        case "Y" :
            $('#FRME231P_vceCabackYes').prop("checked", true);
            break;
        case "N" :
            $('#FRME231P_vceCabackNo').prop("checked", true);
            break;
    }

    switch(obj.sttTrnfYn){
        case "Y" :
            $('#FRME231P_sttTrnfYes').prop("checked", true);
            break;
        case "N" :
            $('#FRME231P_sttTrnfNo').prop("checked", true);
            break;
    }

    if (Utils.isNull(obj.phrecKey)) {
       //abled로 변경
    }
});

$("#FRME231P_phrecKey").on('click',function(e){

    let isopen = window.opener.opener.xbox.connect.isopen();

    if(isopen != true){
        Utils.alert("CTI 로그인 후 이용해 주세요.");
        $("#FRME231P_phrecKey").removeClass("Active");

    }else{
        let obj = window.opener.FRME230P_selItem;

        window.opener.opener.xbox.connect.send('Record', 'VoiceCallbackPlay', {
            CallId: obj.cabackId,
            StartTime: obj.cabackRegDtm,
            Ani: obj.noSwInclTelNo,
            Dnis: obj.cabackInclRpsno,
            TelePhone: obj.noSwCabackReqTelno,
            CustomName: obj.webCabackCustNm,
            Duration: obj.vceCabackPlyTm,
            Filename: obj.vceCabackFilePathPop,
            useSTT: obj.sttTrnfYn
        });
    }
});

function FRME231P_fnSelectCmmCode() {
    let FRME231P_data = {
        "codeList": [
            {"mgntItemCd": "C0119"}
        ]
    };
    Utils.ajaxCall(
        "/comm/COMM100SEL01", JSON.stringify(FRME231P_data), FRME231P_fnsetCmmCode)
}

function FRME231P_fnsetCmmCode(data) {

    // FRME231P_cmmCodeList = JSON.parse(data.codeList);
    // for (let i = 0; i < FRME231P_cmmCodeList.length; i++) {
    //     if(FRME231P_cmmCodeList[i].comCd == obj.cabackProcStCd){
    //         $('#FRME231P input[name=cabackProcStCd]').val(FRME231P_cmmCodeList[i].comCdNm);
    //     }
    // }

}
