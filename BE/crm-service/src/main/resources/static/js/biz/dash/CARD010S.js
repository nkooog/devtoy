/***********************************************************************************************
 * Program Name : 대시보드용 퀵 링크 CARD
 * Creator      : 이민호
 * Create Date  : 2023.02.09
 * Description  : DASH 메인
 * Modify Desc  : 대시보드 side(left,right) 퀵 링크 - tab
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.02.09     이민호           최초생성
 ************************************************************************************************/


$(document).ready(function () {
    $('#' + CARD010S_ID + '_quickLink').empty();
    CARD010S_fnSearchQuickLink(CARD010S_ID);
});

function CARD010S_fnSearchQuickLink(CARD010S_ID) {
    const param = {
        tenantId: GLOBAL.session.user.tenantId,
        usrGrd: GLOBAL.session.user.usrGrd,
    }
    Utils.ajaxCall("/frme/FRME140SEL02", JSON.stringify(param), function (result) {
        let quickLinks = JSON.parse(result.FRME140P);
        if (quickLinks.length === 0) {
            $("#" + CARD010S_ID + "_quickLink").append('<div class="nodataMsg" style="background-color: white; height:100%;"><p>카드가 존재하지 않습니다.</p></div>');
        }
        for (const qLnk of quickLinks) {
            let tempHtml = `<button onclick="window.open('${qLnk.qLnkAddr}')" style="width:100%">`;
            tempHtml += `<span class="k-icon k-i-link-horizontal"></span>${qLnk.qLnkNm}</button>`;
            $('#' + CARD010S_ID + "_quickLink").append(tempHtml);
        }
    })
}