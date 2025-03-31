
// SIDE 쪽지 항목 조회 (S01)
function DASH110M_sideNoteItem(noteItemArr) {
    const DASH110M_noteHTML = [];
    for (const obj of noteItemArr) {
        const index = obj.pltItemNo;
        DASH110M_noteHTML.push(`<li class="DASH110M_sideItemCheck" data-plt-item-cd=${obj.pltItemCd} data-plt-dv-cd=${obj.pltDvCd} data-plt-item-no=${index}>`);
        DASH110M_noteHTML.push("<span class='check'>")
        DASH110M_noteHTML.push("<input type='checkbox' class='k-checkbox' name='note' id='note" + index + "'>")
        DASH110M_noteHTML.push("<label class='k-checkbox-label' for='Note" + index + "'></label>")
        DASH110M_noteHTML.push("</span>")
        DASH110M_noteHTML.push("<div class='cnt'>" + obj.dispCtt + "</div>")
        DASH110M_noteHTML.push("</li>")
    }
    $("#DASH110M_Note").empty();
    $("#DASH110M_Note").append(DASH110M_noteHTML.join(""));
}

// SIDE 지식 조회 (S02)
function DASH110M_sideKnowledgeItem(knowledgeItemArr) {
    const DASH110M_knowledgeHTML = [];
    for (const obj of knowledgeItemArr) {
        const index = obj.pltItemNo;
        DASH110M_knowledgeHTML.push(`<li class="DASH110M_sideItemCheck" data-plt-item-cd=${obj.pltItemCd} data-plt-dv-cd=${obj.pltDvCd} data-plt-item-no=${index}>`);
        DASH110M_knowledgeHTML.push("<span class='check'>")
        DASH110M_knowledgeHTML.push("<input type='checkbox' class='k-checkbox' name='knowledge' id='knowledge" + index + "'>")
        DASH110M_knowledgeHTML.push("<label class='k-checkbox-label' for='Knowledge" + index + "'></label>")
        DASH110M_knowledgeHTML.push("</span>")
        DASH110M_knowledgeHTML.push("<div class='cnt'>" + obj.dispCtt + "</div>")
        DASH110M_knowledgeHTML.push("</li>")
    }
    $("#DASH110M_knowledge").empty();
    $("#DASH110M_knowledge").append(DASH110M_knowledgeHTML.join(""));

}

// SIDE MY지식 조회 (S03)
function DASH110M_sideMyKnowledgeItem(arr) {
    console.log('MyKnowlege');
    const DASH110M_myKnowledgeHTML = [];
}

// SIDE 커뮤니티 조회 (S05)
function DASH110M_sideCommunityItem(communityItemArr) {
    const DASH110M_communityHTML = [];
    for (const obj of communityItemArr) {
        const index = obj.pltItemNo;
        DASH110M_communityHTML.push(`<li class="DASH110M_sideItemCheck" data-plt-item-cd=${obj.pltItemCd} data-plt-dv-cd=${obj.pltDvCd} data-plt-item-no=${index}>`);
        DASH110M_communityHTML.push("<span class='check'>");
        DASH110M_communityHTML.push("<input type='checkbox' class='k-checkbox' name='community' id='community" + index + "'>");
        DASH110M_communityHTML.push("<label class='k-checkbox-label' for='community" + index + "'></label>");
        DASH110M_communityHTML.push("</span>");
        DASH110M_communityHTML.push("<div class='cnt'>" + obj.dispCtt + "</div>");
        DASH110M_communityHTML.push("</li>");
    }
    $("#DASH110M_community").empty();
    $("#DASH110M_community").append(DASH110M_communityHTML.join(""));
}

// SIDE 퀵링크 조회 (S04)
function DASH110M_Qlink() {
    Utils.ajaxSyncCall("/frme/FRME140SEL01", JSON.stringify(DASH110M_Obj.initParam), function (result) {
        let DASH110M_qlinkJSON = JSON.parse(result.FRME140P);
        const DASH110M_qlinkHTML = [];
        for (const obj of DASH110M_qlinkJSON) {
            const index = obj.lnkSeq;
            DASH110M_qlinkHTML.push(`<li class="DASH110M_sideItemCheck" data-plt-item-cd='S04' data-plt-dv-cd='S' data-plt-item-no=${index}>`);
            DASH110M_qlinkHTML.push("<span class='check'>");
            DASH110M_qlinkHTML.push("<input type='checkbox' class='k-checkbox' name='qlink' id='qlink" + index + "'>");
            DASH110M_qlinkHTML.push("<label class='k-checkbox-label' for='qlink" + index + "'></label>");
            DASH110M_qlinkHTML.push("</span>");
            DASH110M_qlinkHTML.push("<div class='cnt'>" + obj.qLnkNm + "</div>");
            DASH110M_qlinkHTML.push("</li>");
        }
        $("#DASH110M_qLink").empty();
        $("#DASH110M_qLink").append(DASH110M_qlinkHTML.join(""));
    });
}

// SIDE 조회
function DASH110M_Side() {
    Utils.ajaxCall("/dash/DASH110SEL03", JSON.stringify(DASH110M_Obj.initParam), function (result) {
        let DASH110M_sideJSON = JSON.parse(result.list).filter(x => x.pltDvCd === 'S'); //TODO LS, RS 구분 필요
        let validPltItemCd = DASH110M_sideJSON.filter((arr, idx, callback) =>
            idx === callback.findIndex(t => t.pltItemCd === arr.pltItemCd)).map(x => x.pltItemCd);
        for (const pltItemCd of validPltItemCd) {
            switch (pltItemCd) {
                case 'S01' :
                    DASH110M_sideNoteItem(DASH110M_sideJSON.filter(x => x.pltItemCd === pltItemCd));
                    break;
                case 'S02' :
                    DASH110M_sideKnowledgeItem(DASH110M_sideJSON.filter(x => x.pltItemCd === pltItemCd));
                    break;
                case 'S03' :
                    DASH110M_sideMyKnowledgeItem(DASH110M_sideJSON.filter(x => x.pltItemCd === pltItemCd));
                    break;
                case 'S05' :
                    DASH110M_sideCommunityItem(DASH110M_sideJSON.filter(x => x.pltItemCd === pltItemCd));
                    break;
            }
        }
    });
}

function DASH110M_checkedPaletteSideItem() {
    Utils.ajaxCall("/dash/DASH110SEL06", JSON.stringify(DASH110M_Obj.initParam), function (result) {
        let paletteSideItems = JSON.parse(result.list).filter(obj => obj.pltItemCdUseYn !== 'N' && obj.pltDvCd === 'S');
        paletteSideItems.map((x) => {
            if (x.pltItemNoUseYn === 'Y') { //체크 되어 있다면?
                $('[data-plt-item-cd=' + x.pltItemCd + ']').each(function () {
                    if (this.dataset.pltItemNo === String(x.pltItemNo)) {
                        $(this).find('.k-checkbox').prop('checked', true);
                    }
                })
            }
        })
    });
}

// SIDE 팔레트 초기화 클릭
function DASH110M_sideReset(e) {
    const findPlt = e.closest("[class*='plt']");
    const pltDvCd = findPlt.dataset.pltDvCd;
    switch (pltDvCd) {
        case "T" :
            DASH110M_Obj.fnTopItemReset(findPlt);
            break;
        case "B" :
            DASH110M_Obj.fnBodyItemReset(findPlt);
            break;
        case "LS" :
            DASH110M_Obj.fnSideItemReset(findPlt);
            break;
        case "RS" :
            DASH110M_Obj.fnSideItemReset(findPlt);
            break;
        default :
            break;
    }
}

// SIDE 팔레트 저장
function DASH110M_sideSave(e) {
    const obj = {
        T  : {
            getItems : (elem) =>  $(elem).closest('.topPanel').find('ul.item li')
        },
        B  : {
            getItems : (elem) =>  $(elem).closest('.panel').find('ul.item li')
        },
        LS  : {
            getItems : (elem) =>  $(elem).closest('li').find('ul.item li')
        },
        RS  : {
            getItems : (elem) =>  $(elem).closest('li').find('ul.item li')
        },
    }
    const findPlt = e.closest("[class*='plt']");
    const pltDvCd = findPlt.dataset.pltDvCd;
    const targetName = DASH110M_Obj.getPltComboName(pltDvCd);
    const sidePltArr = [], sideItemArr = [];
    const $pltSelector = $(target).find(`input[name=${targetName}]`);
    // const $itemSelector = (elem) => $(`${elem} ~ ul.item`); //.closest('ul.item li');
    $pltSelector.each(function (idx, elem) {
        let pltItemCd = $(elem).data('kendoComboBox').value();
        if (Utils.isNull(pltItemCd)) {
            pltItemCd = 'N';
        }
        idx += 1
        let paletteObj = {
            pltDvCd: pltDvCd,
            pltDvTypCd: DASH110M_BodyPaletteType,
            pltItemCd: pltItemCd,
            pltItemSeq: idx,
            pltItemCdUseYn: idx,
            dashBrdTypCd: DASH110M_DashLayoutType,
        };
        let $items = obj[pltDvCd].getItems(elem);
        for (const item of $items) {
            const dataSet = item.dataset;
            let checkItem = $(item).find(".k-checkbox").is(":checked");
            let itemObj = DASH110M_Obj.pltItemCommParam(dataSet)
            itemObj.pltDvTypCd = "X";
            itemObj.pltItemSeq = idx;
            itemObj.pltItemNoUseYn = checkItem === true ? "Y" : "N"
            sideItemArr.push($.extend(itemObj, DASH110M_Obj.updateParam()));
        }
        sidePltArr.push($.extend(paletteObj, DASH110M_Obj.updateParam()));
    });
    console.log(sidePltArr);
    console.log(sideItemArr);
    // Utils.confirm(DASH110M_langMap.get("common.save.msg"), function () {
    //     DASH110M_sidePaletteSave(sidePaletteArr, sideItemArr);
    // });

    //TODO 1개의 루프에서 seq값 parameter 설정하기

    // for (const elem of $itemSelector) {
    //     const dataSet = elem.dataset;
    //     // let checkPaletteUseYn = sidePltArr.find(x => x.pltItemCd === dataSet.pltItemCd);
    //     let checkItem = $(elem).find(".k-checkbox").is(":checked");
    //     let itemObj = DASH110M_Obj.pltItemCommParam(dataSet)
    //     itemObj.pltDvTypCd = "X";
    //     if (checkItem === true) {
    //         itemObj.pltItemNoUseYn = 'Y'
    //     } else {
    //         itemObj.pltItemNoUseYn = 'N';
    //     }
    //     sideItemArr.push($.extend(itemObj, DASH110M_Obj.updateParam()));
    // }
    // console.log(sideItemArr);
    // Utils.confirm(DASH110M_langMap.get("common.save.msg"), function () {
    //     DASH110M_sidePaletteSave(sidePaletteArr, sideItemArr);
    // });
}


