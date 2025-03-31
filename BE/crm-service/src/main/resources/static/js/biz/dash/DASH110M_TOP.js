//
// function DASH_replaceTags(html) {
//     const regExp = /<\/?[^>]+>/gi;
//     return html.replace(regExp,"");
// }
// TOP 오늘의명언 항목 조회
function DASH110M_Phrase() {
    $("#DASH110M_phrase").empty();
    Utils.ajaxCall("/dash/DASH110SEL01", JSON.stringify($.extend({pltItemCd: "T02"}, DASH110M_Obj.initParam)), function (result) {
        let DASH110M_phraseJSON = JSON.parse(result.list);
        const DASH110M_phraseHTML = [];
        const DASH_IMAGE_PATH = 'bcs/dashphoto/';
        for (const obj of DASH110M_phraseJSON) {
            const index = obj.pltItemNo;
            DASH110M_phraseHTML.push(`<li name='DASH110M_phrase' class="DASH110M_topItemCheck" data-plt-item-cd=${obj.pltItemCd} data-plt-dv-cd=${obj.pltDvCd} data-plt-item-no=${index}>`);
            DASH110M_phraseHTML.push(`<span class='check'><input type='checkbox' class='k-checkbox' id='phrase${index}'>`);
            DASH110M_phraseHTML.push(`<label class='k-checkbox-label' for='phrase${index}'></label></span>`);
            if (obj.fileNm == null || obj.fileNm == "") {
                DASH110M_phraseHTML.push(`<div class='cnt' style='background-color: ${obj.bgColrCd}'>${DASH_replaceTags(Utils.htmlDecode(obj.dispCtt))}</div>`);
               // DASH110M_phraseHTML.push( "<div class='cnt' style='background-color: " + DASH110M_phraseJSON[i].bgColrCd + "'>" + DASH110M_phraseJSON[i].dispCtt + "</div>");
            } else if (obj.dispCtt == null || obj.dispCtt == "") {
                DASH110M_phraseHTML.push("<div class='cnt'>")
                DASH110M_phraseHTML.push("<img id='img" + index + "' src='/bcs/dashphoto/" +obj.tenantId +"/"+ obj.fileNmIdx +"' alt='' style='width: 100%; height: 160px;object-cover: none;'/></div>");
            } else if (obj.fileNm != null && obj.dispCtt != null) {
               // DASH110M_phraseHTML.push("<div class='cnt' style='background-image: url(" + imagePath + DASH110M_phraseJSON[i].fileNm + "); background-size: 100%'>" + DASH110M_phraseJSON[i].dispCtt + "</div>");
                DASH110M_phraseHTML.push("<div class='cnt'>")
                DASH110M_phraseHTML.push("<img id='img" + index + "' src='/bcs/dashphoto/" +obj.tenantId +"/"+ obj.fileNmIdx +"' alt='' style='width: 100%; height: 160px;background-size: 100%; object-cover: none;'/>" + DASH_replaceTags(Utils.htmlDecode(obj.dispCtt)) + "</div>");
            }
            DASH110M_phraseHTML.push("</li>");
        }
        $("#DASH110M_phrase").append(DASH110M_phraseHTML.join(""));
    });
}

// TOP 슬로건 항목 조회
function DASH110M_Slogan() {
    $("#DASH110M_Slogan").empty();
    Utils.ajaxCall("/dash/DASH110SEL02", JSON.stringify($.extend({pltItemCd: "T01"}, DASH110M_Obj.initParam)), function (result) {
        let DASH110M_sloganJSON = JSON.parse(result.list);
        const DASH110M_sloganHTML = [];
        for (const obj of DASH110M_sloganJSON) {
            const index = obj.pltItemNo;
            DASH110M_sloganHTML.push(`<li name='DASH110M_Slogan' class="DASH110M_topItemCheck" data-plt-item-cd=${obj.pltItemCd} data-plt-dv-cd=${obj.pltDvCd} data-plt-item-no=${index}>`);
            DASH110M_sloganHTML.push(`<span class='check'><input type='checkbox' class='k-checkbox' id='slogan${index}'>`);
            DASH110M_sloganHTML.push(`<label class='k-checkbox-label' for='slogan${index}'></label></span>`);
            DASH110M_sloganHTML.push("<div class='cnt'>" + obj.dispCtt + "</div>");
            DASH110M_sloganHTML.push("</li>");
        }
        $("#DASH110M_Slogan").append(DASH110M_sloganHTML.join(""));
    });
}

// TOP 날씨 항목 조회
function DASH110M_Weather() {
    $("#DASH110M_Weather").empty();
    Utils.ajaxCall("/dash/DASH110SEL03", JSON.stringify($.extend({pltItemCd: "T03"}, DASH110M_Obj.initParam)), function (result) {
        let DASH110M_weatherJSON = JSON.parse(result.list).filter(x=>x.pltItemCd === 'T03');
        const DASH110M_weatherHTML = [];
        for (const obj of DASH110M_weatherJSON) {
            const index = obj.pltItemNo;
            DASH110M_weatherHTML.push(`<li name='DASH110M_Weather' class="DASH110M_topItemCheck" data-plt-item-cd=${obj.pltItemCd} data-plt-dv-cd=${obj.pltDvCd} data-plt-item-no=${index}>`);
            DASH110M_weatherHTML.push(`<span class='check'><input type='checkbox' class='k-checkbox' id='weather${index}'>`);
            DASH110M_weatherHTML.push(`<label class='k-checkbox-label' for='weather${index}'></label></span>`);
            DASH110M_weatherHTML.push("<div class='cnt'><img src='resources/images/contents/logo_kma.png' alt='기상청' style='margin-right: 5px;'>" + obj.dispCtt + "</div>");
            DASH110M_weatherHTML.push("</li>");
        }
        $("#DASH110M_Weather").append(DASH110M_weatherHTML.join(""));
    });
}
// TOP 항목 체크 조회
function DASH110M_checkedPaletteTopItem() {
    Utils.ajaxCall("/dash/DASH110SEL07", JSON.stringify(DASH110M_Obj.initParam), function (result) {
        let palleteTopItem = JSON.parse(result.list);
        palleteTopItem
            .filter(obj => obj.pltItemNoUseYn !== 'N')
            .map((x) => {
            $('[data-plt-item-cd='+x.pltItemCd+']').each(function(){
                if (this.dataset.pltItemNo === String(x.pltItemNo)) {
                    $(this).find('.k-checkbox').prop('checked',true);
                }
            })
        });
    });
}

// TOP 저장 버튼 클릭
function DASH110M_topSave() {
    const TARGET_PLT = 'T';
    let topPaletteArr = [];
    let topItemArr = [];
    const itemArr = $(".DASH110M_topItemCheck");

    $(".DASH110M_topCheck").each(function () {
        let paletteObj = {
            pltDvCd: TARGET_PLT,
            pltDvTypCd: "X",
            pltItemCd: this.id,
            dashBrdTypCd: DASH110M_DashLayoutType,
        };
        let checkTopPalette = $(this).is(":checked");
        if (checkTopPalette === true) {
            paletteObj.pltItemCdUseYn = 'Y'
        } else {
            paletteObj.pltItemCdUseYn = 'N';
        }
        topPaletteArr.push($.extend(paletteObj, DASH110M_Obj.updateParam()));
    })

    for (const elem of itemArr) {
        const dataSet = elem.dataset;
        let checkPaletteUseYn = topPaletteArr.find(x => x.pltItemCd === dataSet.pltItemCd).pltItemCdUseYn;
        let checkTopItem = $(elem).find(".k-checkbox").is(":checked");
        let itemObj = DASH110M_Obj.pltItemCommParam(dataSet);
        itemObj.pltDvTypCd = "X";
        if (checkTopItem === true) {
            if (checkPaletteUseYn === 'N') {
                Utils.alert('TOP팔레트 항목을 먼저 선택해주세요.');
                return;
            }
            itemObj.pltItemNoUseYn = 'Y'
        } else {
            itemObj.pltItemNoUseYn = 'N';
        }
        topItemArr.push($.extend(itemObj, DASH110M_Obj.updateParam()));
    }

    console.log(topPaletteArr);
    console.log(topItemArr);

    Utils.confirm(DASH110M_langMap.get("common.save.msg"), function () {
        DASH110M_TopPaletteSave(topPaletteArr, topItemArr);
    });
}

// TOP 팔레트 및 항목 저장
function DASH110M_TopPaletteSave(palette, item) {
    Utils.ajaxCall("/dash/DASH110INS01", JSON.stringify({palette: palette, item:item}), function (result) {
        Utils.alert(DASH110M_langMap.get("success.common.save"), DASH110M_DashLayoutInit);
    });
}

// TOP 팔레트 초기화 클릭
function DASH110M_topReset() {
    Utils.confirm(DASH110M_langMap.get("DASH110M.init.msg"), function () {
        DASH110M_Obj.fnTopItemReset();
    });
}
