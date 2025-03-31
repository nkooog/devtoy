/***********************************************************************************************
 * Program Name : MCNS120P.js
 * Creator      : mhlee
 * Create Date  : 2022.05.24
 * Description  : My상담내역상세 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.24     mhlee            최초생성
 *
 ************************************************************************************************/

var MCNS120P_cmmCodeList, MCNS120P_dataItem;
var MCNS120P_encryptYn = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1

$(document).ready(function () {
    if (Utils.getUrlParam('cntcChnlCd') !== '10') {
        $("#MCNS120P #cnslTitle").text(MCNS120P_langMap.get("MCNS120P.data.acpnTite"));
        $("#dynamicTitle").attr("name", "acpnTite");
    } else {
        $("#dynamicTitle").attr("name", "cnslTite");
    }
    const MCNS120P_param = {
        tenantId: Utils.getUrlParam('tenantId'),
        unfyCntcHistNo: Number(Utils.getUrlParam('unfyCntcHistNo')),
        cnslHistSeq: Number(Utils.getUrlParam('cnslHistSeq')),
        cnslrId: Utils.getUrlParam('cnslrId'),
        cnslrBlngOrgCd: Utils.getUrlParam('cnslrBlngOrgCd'),
        cntcChnlCd: Utils.getUrlParam('cntcChnlCd'),
        encryptYn : MCNS120P_encryptYn
    }
    Utils.ajaxCall(
        "/mcns/MCNS120SEL01",
        JSON.stringify(MCNS120P_param),
        MCNS120P_fnResultCounselingDetail)


});

function MCNS120P_fnResultCounselingDetail(data) {
    MCNS120P_dataItem = JSON.parse(data.MCNS120P);
    console.log(MCNS120P_dataItem);
    MCNS120P_fnSetValue(MCNS120P_dataItem);
    MCNS120P_fnSelectCmmCode();
}

function MCNS120P_fnSetValue(obj) {
    const MCNS_Utils = MCNS_setUtils("MCNS120P");
    MCNS_addDetailData(obj, transValue, MCNS_Utils);
    MCNS120P_setDateTimeValue('cntcEndDtm', obj.cntcEndDtm);
    MCNS120P_setDateTimeValue('cntcCnntDtm', obj.cntcCnntDtm);
    MCNS120P_setDateTimeValue('cntcCpltDtm', obj.cntcCpltDtm);
    if (obj.phrecKey) {
        let recKey = obj.phrecKey;
        $("[name=phrecKey]").on('click',function(e){
            let isOpen = window.opener.xbox.connect.isopen();
            if(isOpen !== true){
                Utils.alert("CTI 로그인 후 이용해 주세요.");
                $(e.target).removeClass("Active");
                return;
            }
            if (Utils.isNull(recKey)) {
                Utils.alert("녹취 키값이 존재하지 않습니다.");
                $(e.target).removeClass("Active");
                return;
            }
            window.opener.xbox.control.recordPlay(recKey);
        });
    } else {
        $("[name=phrecKey]").attr("disabled",true);
    }

    function transValue() {
        return {
            tenantId: obj.tenantId,
            unfyCntcHistNo: obj.unfyCntcHistNo,
            cnslrId: obj.cnslrId,
            decUsrNm: obj.decUsrNm,
            cnslrOrgNm: obj.cnslrOrgNm,
            cntcCustId: obj.cntcCustId,
            cntcCustNm: obj.cntcCustNm,
            contactTime: obj.contactTime,
            cnslCtt: obj.cnslCtt,
            acpnTite: obj.acpnTite,
            cnslTite: obj.cnslTite,
            cntcTelNo: obj.cntcTelNo,
            mbleTelNo : obj.mbleTelNo,
            inclRpsTelNo: obj.inclRpsTelNo,
            cnslTypLvlNm: obj.cnslTypLvlNm,
        }
    }
    // MCNS120P_setDateTimeValue('cntcEndDtm', obj.cntcEndDtm);
    // MCNS120P_setDateTimeValue('cntcCnntDtm', obj.cntcCnntDtm);
    // MCNS120P_setDateTimeValue('cntcCpltDtm', obj.cntcCpltDtm);
}

function MCNS120P_setDateTimeValue(key, value) {
    console.log(key,value);
    return $("#MCNS120P [name= " + key + "]").kendoDateTimePicker({
        format: "yyyy-MM-dd HH:mm:ss",
        value: Utils.isNull(value) ? new Date(null) :
            new Date(value.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6')),
        dateInput: true,
       //min: new Date(MCNS120P_dataItem.cntcEndDtm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6')),
    })
}

function MCNS120P_fnSelectCmmCode() {
    let MCNS120P_data = {
        "codeList": [
            {"mgntItemCd": "C0129"}, //인아웃구분
            {"mgntItemCd": "C0130"}, //접촉채널구분
            {"mgntItemCd": "C0143"}, //접촉결콰코드
            {"mgntItemCd": "C0152"}, //상담결과
            {"mgntItemCd": "C0162"}, //IVR코드
            {"mgntItemCd": "C0216"}, //V0C구분코드
        ]
    };
    Utils.ajaxCall(
        "/comm/COMM100SEL01",
        JSON.stringify(MCNS120P_data),
        MCNS210P_fnsetCmmCode)
}

function MCNS210P_fnsetCmmCode(data) {
    MCNS120P_cmmCodeList = JSON.parse(data.codeList);
    if (Utils.isNotNull(MCNS120P_dataItem.cnslRsltCd)) {
        Utils.setKendoComboBox(MCNS120P_cmmCodeList, "C0152", "#MCNS120P input[name=cnslRsltCd]", MCNS120P_dataItem.cnslRsltCd, false)
    }
    Utils.setKendoComboBox(MCNS120P_cmmCodeList, "C0216", "#MCNS120P input[name=vocDvCd]", MCNS120P_dataItem.vocDvCd, false);
    $('input[name=cntcRsltCd]').val(Utils.getComCdNm(MCNS120P_cmmCodeList, "C0143", MCNS120P_dataItem.cntcRsltCd));
    $('input[name=iobDvCd]').val(Utils.getComCdNm(MCNS120P_cmmCodeList, "C0129", MCNS120P_dataItem.iobDvCd));
    if (Utils.isNotNull(MCNS120P_dataItem.inclIvrSvcCd)){
        $('input[name=inclIvrSvcCd]').val(Utils.getComCdNm(MCNS120P_cmmCodeList, "C0162", MCNS120P_dataItem.inclIvrSvcCd));
    }

}

function MCNS100M_fnSearchCnslTypCdPopup() {
    Utils.setCallbackFunction("MCNS120P_fnCnslTypCdCallBack", function(item){
        $("#MCNS120P [name=cnslTypCd]").val(item.cnslTypCd);
        $("#MCNS120P [name=cnslTypLvlNm]").val(item.cnslTypLvlNm);
    });
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM281P", "SYSM281P", 1000, 600, {callbackKey: "MCNS120P_fnCnslTypCdCallBack"});
}

function MCNS120P_updateParamValue() {
    let cnslRsltCd = $('#MCNS120P input[name=cnslRsltCd]');
    let cntcCpltDtm = $("#MCNS120P [name=cntcCpltDtm]").data("kendoDateTimePicker").value();
    let dateToString = Utils.isNotNull(cntcCpltDtm) ? kendo.toString(new Date(cntcCpltDtm), 'yyyyMMddHHmmss') : "";
    return {
        tenantId: MCNS120P_dataItem.tenantId,
        unfyCntcHistNo: MCNS120P_dataItem.unfyCntcHistNo,
        cnslHistSeq: MCNS120P_dataItem.cnslHistSeq,
        cnslrBlngOrgCd: MCNS120P_dataItem.cnslrBlngOrgCd,
        cnslrId: MCNS120P_dataItem.cnslrId,
        cntcChnlCd: Utils.getUrlParam('cntcChnlCd'),
        cnslRsltCd: Utils.isNull(cnslRsltCd.val()) ? "" : cnslRsltCd.data('kendoComboBox').value(),
        vocDvCd: $('#MCNS120P input[name=vocDvCd]').data('kendoComboBox').value(),
        cnslTite: $('#MCNS120P [name=cnslTite]').val(),
        cnslCtt: $('#MCNS120P [name=cnslCtt]').val(),
        cntcCpltDtm: dateToString,
        cnslTypCd : $('#MCNS120P [name=cnslTypCd]').val(),
    }
}

function MCNS120P_updateCounselingStatus() {
    let MCNS120P_updateParam = MCNS120P_updateParamValue()
    console.log(MCNS120P_updateParam);
    Utils.ajaxCall("/mcns/MCNS120UPT01", JSON.stringify(MCNS120P_updateParam), function (data) {
            Utils.alert(data.msg, function () {
                Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
                self.close();
            });
        });
}


//
// function MCNS120P_setContactTime(key) {
//     const SET_NUMBER_ONE = 1;
//     const SET_NUMBER_SIXTY = 60;
//     let endHourptsec = MCNS120P_dataItem.cntcEndDtm.split(":");
//     let cnntHourptsec = MCNS120P_dataItem.cntcCnntDtm.split(":");
//     let timeCalculation = endHourptsec.map(function(item, index) {
//         return item - cnntHourptsec[index];
//     })
//     if (timeCalculation[1] < 0) {
//         timeCalculation[0] -= SET_NUMBER_ONE
//         timeCalculation[1] += SET_NUMBER_SIXTY
//     }
//     if (timeCalculation[2] < 0 ) {
//         timeCalculation[1] -= SET_NUMBER_ONE
//         timeCalculation[2] += SET_NUMBER_SIXTY
//     }
//     const hour = timeCalculation[0] === 0 ? "" : ''.concat(MCNS120P_changeNumberToTwoDigits(timeCalculation[0]),"시간 ");
//     const minute = MCNS120P_changeNumberToTwoDigits(timeCalculation[1]);
//     const second = MCNS120P_changeNumberToTwoDigits(timeCalculation[2]);
//     const koreaNotationTime = `${hour} ${minute}분 ${second}초`;
//     console.log(key, koreaNotationTime);
//     MCNS120P_inputData(key, koreaNotationTime);
// }
//
// function MCNS120P_changeNumberToTwoDigits(number) {
//     return String(number).padStart(2, '0');
// }