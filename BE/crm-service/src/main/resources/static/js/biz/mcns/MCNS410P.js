/***********************************************************************************************
 * Program Name : MCNS410P.js
 * Creator      : mhlee
 * Create Date  : 2022.06.28
 * Description  : 이관내역상세 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.06.28     mhlee            최초생성
 *
 ************************************************************************************************/
var MCNS410P_cmpData, MCNS410P_cmmCodeList;
$(document).ready(function () {
    MCNS410P_SelectCmmCode();
    MCNS410P_SelectCmpTargetDetail();
})

function MCNS410P_SelectCmmCode() {
    let MCNS410P_data = {
        "codeList": [
            {"mgntItemCd": "C0230"},
        ]
    };
    Utils.ajaxSyncCall(
        "/comm/COMM100SEL01",
        JSON.stringify(MCNS410P_data),
        function (data) {
            MCNS410P_cmmCodeList = JSON.parse(data.codeList);
        })
}

function MCNS410P_SelectCmpTargetDetail() {
    const MCNS410P_param = {
        tenantId: Utils.getUrlParam('tenantId'),
        cmpNo: Utils.getUrlParam('cmpNo'),
        custNo: Number(Utils.getUrlParam('custNo')),
    }

    Utils.ajaxSyncCall(
        "/mcns/MCNS410SEL01",
        JSON.stringify(MCNS410P_param),
        function (data) {
            MCNS410P_cmpData = JSON.parse(data.MCNS410P);
            MCNS410P_fnSetValue(MCNS410P_cmpData);
        })
}

function MCNS410P_fnSetValue(obj) {
    const MCNS_Utils = MCNS_setUtils("MCNS410P");
    MCNS_addDetailData(obj, transValue, MCNS_Utils);
    function transValue() {
        return {
            custId: obj.custId,
            custNm: obj.decCustNm,
            cnslrId: obj.cnslrId,
            cnslrNm: obj.decCnslrNm,
            zipNo: obj.zipNo,
            owhmBaseAddr: obj.decOwhmBaseAddr,
            owhmDtlsAddr: obj.decOwhmDtlsAddr,
            failRsn: obj.failRsn,
            etc: obj.etc,
            procStCd: Utils.getComCdNm(MCNS410P_cmmCodeList, "C0230", obj.procStCd),
            lstCorcDtm: MCNS_Utils.MCNS_fnSetDateTime(obj.lstCorcDtm),
            lstCorprUsr: ''.concat(obj.decLstCorprNm,'(',obj.lstCorprId,')'),
            mbleNo:obj.decMbleNo,
            owhmTelNo: obj.decOwhmTelNo,
            coTelNo: obj.decCoTelNo,
        }
    }
}



