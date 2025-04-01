function DASH110M_setBodyCombo() {
    const nullCheck = (obj) => Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
    Utils.ajaxCall("/dash/DASH120SEL02", JSON.stringify(({tenantId: GLOBAL.session.user.tenantId, pltDvCd: 'B'})),
        function (result) {
            let bodyItemCdArr = JSON.parse(result.list);
            bodyItemCdArr.forEach(x => x.pltItemCdNm = Utils.getComCdNm(DASH110M_comCdList, "C0040", x.pltItemCd, false));
            nullCheck(bodyItemCdArr);
            $.each($("input[name=DASH110M_BodyPaletteCombo]"),(idx,elem)=>{
                Utils.setKendoComboBoxCustom(bodyItemCdArr, elem, "pltItemCdNm", "pltItemCd",false,"선택")});
            })
}

// BODY 게시판 목록 항목조회
function DASH110M_BodyItem() {
    Utils.ajaxCall("/dash/DASH110SEL03", JSON.stringify({tenantId:GLOBAL.session.user.tenantId,usrGrd:GLOBAL.session.user.usrGrd}), function (result) {
        let DASH110M_bodyJSON = JSON.parse(result.list).filter(x => x.pltItemCd === 'B01');
        const DASH110M_bodyHTML = [];
        for (const obj of DASH110M_bodyJSON) {
            const index = obj.pltItemNo;
            DASH110M_bodyHTML.push(`<li name='DASH110M_Board' class="DASH110M_bodyItemCheck" data-plt-item-cd=${obj.pltItemCd} data-plt-dv-cd=${obj.pltDvCd} data-plt-item-no=${index}>`);
            DASH110M_bodyHTML.push(`<span class='check'><input type='checkbox' class='k-checkbox' id='board${index}'>`);
            DASH110M_bodyHTML.push(`<label class='k-checkbox-label' for='board${index}'></label></span>`);
            DASH110M_bodyHTML.push("<div class='cnt'>" + obj.dispCtt + "</div>");
            DASH110M_bodyHTML.push("</li>");
        }
        $(".DASH110M_B01Item").each(function () {
            $(this).empty();
            $(this).append(DASH110M_bodyHTML.join(""));
        })
    })
}

function DASH110M_checkedPaletteBodyItem() {
    Utils.ajaxCall("/dash/DASH110SEL06", JSON.stringify(DASH110M_Obj.initParam), function (result) {
        let paletteBodyItems = JSON.parse(result.list);
        paletteBodyItems
            .filter(obj => obj.pltItemCdUseYn !== 'N' && obj.pltItemCd === 'B01')
            .map((x) => {
                if (x.pltItemNoUseYn === 'Y') { //체크 되어 있다면?
                    $('[data-plt-item-cd=' + x.pltItemCd + ']').each(function () {
                        if (this.dataset.pltItemNo === String(x.pltItemNo)) {
                            $(this).find('.k-checkbox').prop('checked', true);
                        }
                    })
                    // const targetShowItem = x.pltItemCdUseYn;
                    // $("#DASH110M_boardItem" +targetShowItem+ " #board"+x.pltItemNo).prop('checked', true);
                }
            })
    });
}

// BODY 콤보 및 항목체크 validation
function DASH110M_bodyComboCheck() {
    // Utils.markingRequiredField();
    const checkObj = {
        B01: "", B02: "", B03: "", B04: "",
    }
    let $comboCheck = $("[name=DASH110M_BodyPaletteCombo]");
    // for (const elem of $comboCheck) {
    //     const idx = $comboCheck.index(elem);
    //     const $comboInstance = $(elem).data('kendoComboBox');
    //     if (DASH110M_DashLayoutType !== 'A' && idx === 3) {
    //         $comboInstance.value(Object.keys(checkObj).find(key => checkObj[key] === ''));
    //         $comboInstance.trigger("change");
    //         break;
    //     }
    //     checkObj[elem.value] = true;
        // if (Utils.isNull(elem.value)) {
        //     Utils.alert("팔레트 항목을 선택해주세요.", () => {
        //         $comboInstance.focus();
        //         return $comboInstance.toggle();
        //     });
        //     return;
        // }
        // if (idx === 3) {
        //     $comboInstance.value(Object.keys(checkObj).find(key => checkObj[key] === ''));
        //     $comboInstance.trigger("change");
        // }
    // }
    DASH110M_bodySave();
}


// BODY 팔레트 저장 (NEW)
function DASH110M_bodySave() {
    let bodyPaletteArr = [];
    let bodyBoardItemArr = [];
    const TARGET_PLT = 'B';
    const paletteHasDuplicates = (arr) => {
        return new Set(arr).size !== arr.length;
    }

    // 팔레트 체크
    $(".DASH110M_body").each(function (idx, item) {
        // if ($(item).css('display') !== 'none')
        const index = idx + 1
        let obj = {
            pltDvCd: TARGET_PLT,
            pltDvTypCd: DASH110M_BodyPaletteType,
            dashBrdTypCd: DASH110M_DashLayoutType,
            pltItemCd: $("#DASH110M_PltBody" + index).val(),
            pltItemCdUseYn: $("#DASH110MBodyPltItemNo" + index).val(),
        };
        bodyPaletteArr.push($.extend(obj, DASH110M_Obj.updateParam()));
    })

    // 팔레트 중복항목 체크
    // if (paletteHasDuplicates(bodyPaletteArr.map(x => x.pltItemCd))) {
    //     Utils.alert(DASH110M_langMap.get("DASH110M.overlap"));// 중복된 컨텐츠가 있습니다.
    // }
    // B01게시판 아이템 체크
    let ItemUseYn = bodyPaletteArr.find(x => x.pltItemCd === 'B01');
    // // TODO DASH110M_BodyPaletteType !== A
    // if (Utils.isNotNull(ItemUseYn)) {
    //     if ($("input:checkbox[id*=board]:checked").length === 0) {
    //         Utils.alert('게시판' + DASH110M_langMap.get("DASH110M.common.alert")); //에 표시할 항목을 선택해주세요.
    //         return;
    //     }
    //     $('#DASH110M_boardItem' + ItemUseYn.pltItemCdUseYn + ' li').each(function () {
    //         const dataSet = this.dataset;
    //         let obj = DASH110M_Obj.pltItemCommParam(dataSet);
    //         obj.pltItemNoUseYn = $(this).find(".k-checkbox").is(":checked") ? 'Y' : 'N';
    //         console.log(obj);
    //         bodyBoardItemArr.push($.extend(obj, DASH110M_Obj.updateParam()));
    //     });
    // } else {
    //     $('#DASH110M_boardItem4 li').each(function () {
    //         const dataSet = this.dataset;
    //         let obj = DASH110M_Obj.pltItemCommParam(dataSet);
    //         obj.pltItemNoUseYn = 'N';
    //         bodyBoardItemArr.push($.extend(obj, DASH110M_Obj.updateParam()));
    //     });
    // }
    $('.DASH110M_B01Item li').each(function () {
        const dataSet = this.dataset;
        let obj = DASH110M_Obj.pltItemCommParam(dataSet);
        obj.pltItemNoUseYn = 'N';
        bodyBoardItemArr.push($.extend(obj, DASH110M_Obj.updateParam()));
    });
    console.log(bodyPaletteArr);
    console.log(bodyBoardItemArr);

    Utils.confirm(DASH110M_langMap.get("common.save.msg"), function () {
        DASH110M_BodyPaletteSave(bodyPaletteArr, bodyBoardItemArr);
    });
}

// BODY 팔레트 항목 저장
function DASH110M_BodyPaletteSave(palette, item) {
    Utils.ajaxCall("/dash/DASH110INS01", JSON.stringify({palette: palette, item: item}), function (result) {
        Utils.alert(DASH110M_langMap.get("success.common.save"));//저장하였습니다.
        DASH110M_DashLayoutInit();
    });
}

// BODY 팔레트 초기화 클릭
function DASH110M_bodyReset() {
    Utils.confirm(DASH110M_langMap.get("DASH110M.init.msg"), function () {
        DASH110M_Obj.fnBodyItemReset();
    });
}
