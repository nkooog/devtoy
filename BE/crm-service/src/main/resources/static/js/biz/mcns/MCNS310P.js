/***********************************************************************************************
 * Program Name : MCNS310P.js
 * Creator      : mhlee
 * Create Date  : 2022.05.03
 * Description  : My예약내역 상세 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.03    mhlee            최초생성
 *
 ************************************************************************************************/
var MCNS310P_cmmCodeList, MCNS310P_dataItem;
$(document).ready(function () {
    MCNS310P_dataItem = window.opener.MCNS300P_clickDataSet;
    if(window.opener.activateTabId == "CNSL420M"){
        MCNS310P_dataItem =  window.opener.CNSL420M_clickDataSet
    }
    MCNS310P_dataItem.cnslrId = GLOBAL.session.user.usrId;
    MCNS310P_fnSetValue(MCNS310P_dataItem);
    MCNS310P_fnSelectCmmCode();
});

function MCNS310P_fnSetValue(obj) {
    console.log(obj)
    const MCNS_Utils = MCNS_setUtils("MCNS310P");
    MCNS_Utils.MCNS_fnSetEnterInValue('rsvMemo', obj.rsvMemo);
    MCNS_Utils.MCNS_fnSetEnterInValue('tenantId', obj.tenantId);
    MCNS_Utils.MCNS_fnSetEnterInValue('telCnslHistSeq', obj.telCnslHistSeq);
    MCNS_Utils.MCNS_fnSetEnterInValue('unfyCntcHistNo', obj.unfyCntcHistNo);
    MCNS_Utils.MCNS_fnSetEnterInValue('cnslrId', obj.cnslrId);
    MCNS_Utils.MCNS_fnSetEnterInValue('cntcCustId', obj.cntcCustId);
    MCNS_Utils.MCNS_fnSetEnterInValue('cntcCustNm', obj.cntcCustNm);
    MCNS_Utils.MCNS_fnSetEnterInValue('cntcTelNo', obj.cntcTelNoNotMsk);
    MCNS_Utils.MCNS_fnSetKendoDateTimePlcker('regDdHour', obj.regDdHour);
    MCNS_Utils.MCNS_fnSetKendoDateTimePlcker('lstCorcDdHour', obj.lstCorcDdHour);
    MCNS_fnSetRsvDdDateTimePlcker('rsvDd', obj.rsvDd);
}

function MCNS_fnSetRsvDdDateTimePlcker(key, value) {
    return $("#MCNS310P [name= " + key + "]").kendoDateTimePicker({
        format: "yyyy-MM-dd HH:mm:ss",
        interval: 10,
        value: new Date(value),
        min: new Date(value),
        dateInput: true,
        open: function(e) {
            if (e.view === 'time') {

            }
        }
    }).data("kendoDateTimePicker");
}

function MCNS310P_fnSelectCmmCode() {
    let MCNS200M_data = {
        "codeList": [
            {"mgntItemCd": "C0156"}, // 예약상태
        ]
    };
    Utils.ajaxCall(
        "/comm/COMM100SEL01",
        JSON.stringify(MCNS200M_data),
        MCNS310P_fnsetCmmCode)
}

function MCNS310P_fnsetCmmCode(data) {
    MCNS310P_cmmCodeList = JSON.parse(data.codeList);
    console.log(MCNS310P_cmmCodeList)
    Utils.setKendoComboBox(MCNS310P_cmmCodeList, "C0156", "#MCNS310P input[name=procStCd]", Utils.getUrlParam('procStCd'), false);
}

function MCNS310P_fnValidation() {
    let valid = true;
    const regExp_hour = /^([8-9]|1[0-8])$/;
    const regExp_minute = /^([0]|[1-5][0])$/;
    const regExp_globalPhone = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
    const regExp_dateTime = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-8]):[0-5][0]/;
    //         yyyy -       MM      -       dd           hh     :   mm  :   ss

    let rsvDd = $('#MCNS310P [name=rsvDd]').data("kendoDateTimePicker");
    if (!regExp_hour.test(rsvDd.value().getHours())) {
        Utils.alert(MCNS310P_langMap.get("MCNS310P.alert.hours"),
        () => {
            let getHours = rsvDd.value().getHours();
            let closestHours = Array.from({length:11}, (v,i)=>i+8).reduce(function(prev, curr) {
                return (Math.abs(curr - getHours) < Math.abs(prev - getHours) ? curr : prev);
            });
            rsvDd.value(new Date(rsvDd.value().setHours(closestHours)));
            rsvDd.trigger('change');
        })
        return false;
    }
    if (!regExp_minute.test(rsvDd.value().getMinutes())) {
        Utils.alert(MCNS310P_langMap.get("MCNS310P.alert.minutes"),
            ()=> {
                let getMinutes = Math.round(rsvDd.value().getMinutes()/10)*10;
                rsvDd.value(new Date(rsvDd.value().setMinutes(getMinutes)));
                rsvDd.trigger('change');
            });
        return false;
    }

    const cntcTelNo = $('#MCNS310P [name=cntcTelNo]').val();
    if (!regExp_globalPhone.test(cntcTelNo)) {
        Utils.alert(MCNS310P_langMap.get("MCNS.search.telNo.errors"));
        return false;
    }

    if (!regExp_dateTime.test($('#MCNS310P [name=rsvDd]').val())) {
        Utils.alert('예약시간은 08:00~18:50 까지 가능합니다.');
        return false;
    }
    return valid;
}

function MCNS310P_updateParamValue() {
    const valid = MCNS310P_fnValidation()
    if (!valid) {
        return;
    }
    let rsvDd = $('#MCNS310P [name=rsvDd]').data("kendoDateTimePicker").value();
    return {
        tenantId: $('#MCNS310P [name=tenantId]').val(),
        unfyCntcHistNo: $('#MCNS310P [name=unfyCntcHistNo]').val(),
        telCnslHistSeq: $('#MCNS310P [name=telCnslHistSeq]').val(),
        rsvMemo: $('#MCNS310P [name=rsvMemo]').val(),
        procStCd: $('#MCNS310P [name=procStCd]').data('kendoComboBox').value(),
        cntcTelNo: MCNS310P_replacePhoneNumber( $('#MCNS310P [name=cntcTelNo]').val()),
        rsvDd: MCNS310P_getDateText(rsvDd),
        rsvHour: MCNS310P_getHourText(rsvDd),
        rsvPt: MCNS310P_getMinuteText(rsvDd),
        cnslrId: GLOBAL.session.user.usrId,
        cnslrBlngOrgCd: GLOBAL.session.user.orgCd,
    }
}

function MCNS310P_updateReservationStatus() {
    const MCNS310P_updateParam = MCNS310P_updateParamValue()
    Utils.ajaxCall(
        "/mcns/MCNS310UPT01",
        JSON.stringify(MCNS310P_updateParam),
        function (data) {
            Utils.alert(data.msg, function () {
                Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
                self.close();
            });
        });
}


function MCNS310P_getDateText(date) {
    const getYear = date.getFullYear();
    const paddedMonth = MCNS310P_changeNumberToTwoDigits(date.getMonth() + 1);
    const paddedDay = MCNS310P_changeNumberToTwoDigits(date.getDate());
    return ''.concat(getYear, paddedMonth, paddedDay)
}

function MCNS310P_getHourText(date) {
    return MCNS310P_changeNumberToTwoDigits(date.getHours());
}

function MCNS310P_getMinuteText(date) {
    return MCNS310P_changeNumberToTwoDigits(date.getMinutes());
}

function MCNS310P_changeNumberToTwoDigits(number) {
    return String(number).padStart(2, '0');
}

function MCNS310P_replacePhoneNumber(number) {
    return number.replace(/-/g, '');
}

$('#MCNS310P input').on('change', function () {
    MCNS_inputValidation(this, 'MCNS310P');
});

function MCNS310P_autoHyphenTel (target) {
    target.value = target.value
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
}
