/***********************************************************************************************
 * Program Name : MCNS510P.js
 * Creator      : mhlee
 * Create Date  : 2022.06.21
 * Description  : 이관내역상세 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.06.21     mhlee            최초생성
 *
 ************************************************************************************************/

var MCNS510P_cmmCodeList, MCNS510P_trclArray, MCNS510P_cnslhistData, MCNS510P_tempValueObject = {};
$(document).ready(function () {
    MCNS510P_fnSelectCmmCode();
});

function MCNS510P_fnSelectCmmCode() {
    let MCNS510P_data = {
        "codeList": [
            {"mgntItemCd": "C0129"}, //인아웃구분
            {"mgntItemCd": "C0130"}, //접촉채널구분
            {"mgntItemCd": "C0143"}, //접촉결과코드
            {"mgntItemCd": "C0152"}, //상담결과
            {"mgntItemCd": "C0157"}, //이관 처리상태코드
            {"mgntItemCd": "C0162"}, //IVR코드
            {"mgntItemCd": "C0216"}, //V0C구분코드
            {"mgntItemCd": "C0233"}, //이관 상태코드
        ]
    };
    Utils.ajaxCall(
        "/comm/COMM100SEL01",
        JSON.stringify(MCNS510P_data),
        function (data) {
            MCNS510P_cmmCodeList = JSON.parse(data.codeList);
            MCNS510P_fnSelectTransferDetail();
        })
}

function MCNS510P_fnSelectTransferDetail() {
    const MCNS510P_param = {
        tenantId: Utils.getUrlParam('tenantId'),
        unfyCntcHistNo: Number(Utils.getUrlParam('unfyCntcHistNo')),
        cnslHistSeq: Number(Utils.getUrlParam('cnslHistSeq')),
        trclSeq: Number(Utils.getUrlParam('trclSeq')),
    }

    Utils.ajaxCall(
        "/mcns/MCNS510SEL01",
        JSON.stringify(MCNS510P_param),
        MCNS510P_fnResultTransferDetail)
}

function MCNS510P_fnResultTransferDetail(data) {
    MCNS510P_cnslhistData = JSON.parse(data.MCNS510P_cnsl);
    MCNS510P_trclArray = JSON.parse(data.MCNS510P_trcl);
    console.log(MCNS510P_cnslhistData);
    console.log(MCNS510P_trclArray);

    MCNS510P_fnSetValue(MCNS510P_cnslhistData);
    fnSetTransferList(MCNS510P_trclArray);
}

function MCNS510P_fnSetValue(obj) {
    const MCNS_Utils = MCNS_setUtils("MCNS510P");
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
    MCNS_addDetailData(obj, transValue, MCNS_Utils);
    function transValue() {
        return {
            cntcCustId: obj.cntcCustId,
            decCntcCustNm: obj.decCntcCustNm,
            decCntcTelNo: obj.decCntcTelNo,
            decCnslrNm: obj.decCnslrNm,
            cnslRsltCd: Utils.getComCdNm(MCNS510P_cmmCodeList, "C0152", obj.cnslRsltCd),
            cntcRsltCd: Utils.getComCdNm(MCNS510P_cmmCodeList, "C0143", obj.cntcRsltCd),
            iobDvCd: Utils.getComCdNm(MCNS510P_cmmCodeList, "C0129", obj.iobDvCd),
            procStCd: Utils.getComCdNm(MCNS510P_cmmCodeList, "C0157", obj.procStCd),
            trclStCd: Utils.getComCdNm(MCNS510P_cmmCodeList, "C0233", obj.trclStCd),
            cnslTite: obj.cnslTite,
            cnslCtt: obj.cnslCtt,
            procCtt: obj.procCtt,
            decTrclmnNm: obj.decTrclmnNm,
            trclmnId: obj.trclmnId,
            decDspsrNm: obj.decDspsrNm,
            dspsrId: obj.dspsrId,
            regDtm: MCNS_Utils.MCNS_fnSetDate(obj.regDtm),
            trclDt: MCNS_Utils.MCNS_fnSetDate(obj.trclDt),       // 이관일
            procDt: MCNS_Utils.MCNS_fnSetDate(obj.procDt),       // 완료일
            cntcCnntDtm: Utils.isNotNull(obj.cntcCnntDtm)
                ? MCNS_Utils.MCNS_fnSetDateTime(obj.cntcCnntDtm
                    .replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6'))
                : "",
            contactTime: Utils.isNotNull(obj.contactTime) ? MCNS_Utils.MCNS_fnSetContactTime(obj.contactTime) : "",
        }
    }
}

function fnSetTransferList(list = []) {
    let index = 0
    if (list.length === 0) {
        list.push(MCNS510P_cnslhistData);
    }
    console.log(MCNS510P_langMap);
    for (const obj of list) {
        const trclHTML = [];
        index++
        trclHTML.push(`<dl id="${obj.procStCd === '3' ? "" : "MCNS510P_editable"}" name="${index}">`);
        trclHTML.push(`<dt><mark class="icoCnt_workTrans"></mark>${MCNS510P_langMap.get("MCNS510P.cnslr")} `);
        trclHTML.push(`<strong>${obj.decTrclmnNm}(${obj.trclmnId})</strong>${MCNS510P_langMap.get("MCNS510P.text.comment")} : ${Utils.isNull(obj.trclCtt) ? "" : obj.trclCtt}</dt>`);
        trclHTML.push('<dd>');
        trclHTML.push('<p class="history">');
        trclHTML.push(`<span>${Utils.getComCdNm(MCNS510P_cmmCodeList, "C0233", obj.trclStCd)} ${MCNS510P_langMap.get("MCNS510P.text.created")} </span>`)
        trclHTML.push(`<span>${MCNS510P_langMap.get("MCNS510P.cnslr")} <strong>${obj.decDspsrNm}(${obj.dspsrId})</strong>에게 할당</span></p>`);
        trclHTML.push('<details open>');
        trclHTML.push('<summary><mark class="k-icon k-i-arrow-chevron-down"></mark></summary>');
        trclHTML.push('<div class="tableCnt_Row"><table><colgroup><col style="width: 100px;" /><col style="width: auto" /></colgroup>');
        trclHTML.push('<tbody><tr>');
        trclHTML.push(`<th class="sub_tit">${MCNS510P_langMap.get("MCNS510P.procStCd")}</th>`)
        trclHTML.push(`<td><input id="procStCd_${index}" name="procStCd" style="width: 200px;"/></td></tr>`);
        trclHTML.push(`<tr><th class="sub_tit">${MCNS510P_langMap.get("MCNS510P.procCtt")}</th>`);
        trclHTML.push(`<td><textarea class="textareaEditor" name="procCtt" style="width: 100%; height: 100px;">${Utils.isNull(obj.procCtt) ? "" : obj.procCtt}</textarea></td>`);
        trclHTML.push('</tr></tbody></table></div></details></dd></dl>');
        $('#MCNS510P_transferList').append(trclHTML.join(""));
        Utils.setKendoComboBox(MCNS510P_cmmCodeList, "C0157", `#procStCd_${index}`, obj.procStCd, false);
        if (['3', '5'].includes(obj.procStCd) || obj.dspsrId !== GLOBAL.session.user.usrId || obj.trclSeq !== MCNS510P_cnslhistData.trclSeq) {
            $('textarea[name=procCtt]').attr('disabled', true);
            $(`#procStCd_${index}`).data("kendoComboBox").enable(false);
            $("#MCNS510P_usrCheck").attr('disabled', true);
        }
    }
}

function MCNS510P_updateParamValue() {
    return {
        tenantId: GLOBAL.session.user.tenantId,
        unfyCntcHistNo: MCNS510P_cnslhistData.unfyCntcHistNo,
        cnslHistSeq: MCNS510P_cnslhistData.cnslHistSeq,
        trclSeq: MCNS510P_cnslhistData.trclSeq,
        setTrclSeq: $('#MCNS510P_transferList dl').length + 1,
        dspsrId: GLOBAL.session.user.usrId,
        dspsrOrgCd: GLOBAL.session.user.orgCd,
        procStCd: $('#MCNS510P_editable [name=procStCd]').data('kendoComboBox').value(),
        procCtt: $('#MCNS510P_editable [name=procCtt]').val(),
    }
}

function MCNS510P_updateTransferStatus() {
    const MCNS510P_updateParam = MCNS510P_updateParamValue();
    Utils.ajaxCall(
        "/mcns/MCNS510UPT01",
        JSON.stringify(MCNS510P_updateParam),
        function (data) {
            Utils.alert(data.msg, function () {
                window.location.reload();
            });
        });
}