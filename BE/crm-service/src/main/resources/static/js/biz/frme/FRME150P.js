/***********************************************************************************************
 * Program Name : 즐겨찾기메뉴 팝업(FRME150P.js)
 * Creator      : 이민호
 * Create Date  : 2022.02.03
 * Description  : 즐겨찾기메뉴 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.02.03     이민호           최초작성
 * 2022.03.23     이민호           변수명 및 로직 수정
 * 2022.04.06     이민호,정대정     화면명 클릭 시 Tab생성
 * 2022.05.23     이민호           변경 퍼블 적용 및 삭제 기능 추가
 ************************************************************************************************/


$(document).ready(function () {
    FRME150P_fnGetFavoriteMenuList();
})
function FRME150P_getParam () {
    return {
        tenantId: GLOBAL.session.user.tenantId,
        usrId: GLOBAL.session.user.usrId,
        mlingCd: GLOBAL.session.user.mlingCd
    }
}

function FRME150P_fnGetFavoriteMenuList() {
    Utils.ajaxCall(
        "/frme/FRME150SEL01",
        JSON.stringify(FRME150P_getParam()),
        FRME150P_fnSetFavoriteMenuList);
}


function FRME150P_fnSetFavoriteMenuList(data) {
    let jsonDecode = JSON.parse(data.FRME150P);

    if (jsonDecode.length > 0) {
        for (let favMenu of jsonDecode) {
            console.log(favMenu);
            const menuId = favMenu.dataFrmId;
            const menuNm = (Utils.isNotNull(favMenu.menuLv3)) ? favMenu.menuLv3 : favMenu.menuLv2;
            const mapgVlu1 = favMenu.mapgVlu1;
            const favMenuInfo = ''.concat("data-menu-nm='" , menuNm , "' data-path-pre='" , mapgVlu1 , "' data-path-id='" , $.trim(menuId) , "'");
            const favMenuList = [];
            favMenuList.push(
                "<li class='favList' style='cursor: pointer;' " + favMenuInfo + ">",
                "<span>" + favMenu.menuLv1 + "</span>",
                Utils.isNotNull(favMenu.menuLv2) ? "<span>" + favMenu.menuLv2 + "</span>" : "",
                Utils.isNotNull(favMenu.menuLv3) ? "<span>" + favMenu.menuLv3 + "</span>" : "",
                "<button type='button' class='btDelete k-icon k-i-x'></button></li>")

            $('#FRME150P_favoriteMenuList').append(favMenuList.join(""));
        }
    } else {
        //Utils.closeKendoWindow(FRME150P_paramId)
        //Utils.alert(FRME150_langMap.get("fail.common.select"));
    	$('#FRME150P_favoriteMenuList').append("<div class='nodataMsg' style='background: transparent;'><p>해당 목록이 없습니다</p></div>");
    }
}

function FRME150P_fnDeleteMenu(targetPathId) {
    const param = FRME150P_getParam();
    param["menuId"] = targetPathId;
    Utils.ajaxCall(
        "/frme/FRME150DEL01",
        JSON.stringify(param),
        function () {
            $("li[data-path-id= " + targetPathId + "]:last").hide();
            Utils.getParent().MAINFRAME_SUB.initFavrList();
    })
}

$("#FRME150P_favoriteMenuList").on("click", '.favList', function (e) {
    let dataFrameInfo = this.dataset;
    console.log(dataFrameInfo);
    if (e.target.type === "button") {
        Utils.confirm(FRME150_langMap.get("common.delete.msg"),
            function () { FRME150P_fnDeleteMenu(dataFrameInfo.pathId);});
    } else {
        // Utils.getParent().MAINFRAME_SUB.dataFrameLoad({
        //     menuNm: dataFrameInfo.menuNm,
        //     id: dataFrameInfo.pathId,
        //     path: dataFrameInfo.pathPre + "/" + dataFrameInfo.pathId
        // });
        Utils.getParent().MAINFRAME_SUB.openDataFrameById(dataFrameInfo.pathId);
        Utils.closeKendoWindow(FRME150P_paramId);
    }
});