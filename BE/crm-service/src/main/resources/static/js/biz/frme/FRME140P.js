/***********************************************************************************************
* Program Name : 퀵링크 팝업(FRME140P.js)
* Creator      : 이민호
* Create Date  : 2022.02.10
* Description  : 퀵링크 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.10     이민호           최초작성
* 2022.03.23     이민호           변수명 및 로직 수정
* 2022.03.29	 이민호			 다국어 적용
************************************************************************************************/
$(document).ready(function () {
    const FRME140P_getParam = {
        tenantId : GLOBAL.session.user.tenantId,
        usrGrd: GLOBAL.session.user.usrGrd,
        regrId: GLOBAL.session.user.usrId, }
    Utils.ajaxCall(
        "/frme/FRME140SEL02",
        JSON.stringify(FRME140P_getParam),
        FRME140P_fnResultQuickLink)
});



function FRME140P_fnResultQuickLink(data) {

    const jsonDecode = JSON.parse(data.FRME140P);
    if (jsonDecode.length > 0) {
	    for (const qLnk of jsonDecode) {
	        const qLnkNm = qLnk.qlnkNm;
	        const qLnkAddr = qLnk.qlnkAddr;
	        const qLnkMenu = [];
	        qLnkMenu.push(
	            `<button onclick="window.open('${qLnkAddr}')">`,
	            `<span class="k-icon k-i-link-horizontal" ></span>${qLnkNm}</button>`)
	
	        $('#FRME140P_quickLink').append(qLnkMenu.join(""));
	        console.log(qLnkNm, qLnkAddr);
	    }
    } else {
//            Utils.closeKendoWindow(FRME140P_paramId);
//            Utils.alert(FRME140_langMap.get("FRME140P.error.link"));
//            return;
    	
    	$('#FRME140P_quickLink').append("<div class='nodataMsg' style='background: transparent;'><p>해당 목록이 없습니다</p></div>");
    }
}