/***********************************************************************************************
 * Program Name : 대시보드 레이아웃관리
 * Creator      : 강동우
 * Create Date  : 2022.06.29
 * Description  : 대시보드 레이아웃관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.06.29     강동우           최초생성
 * 2022.09.13     이민호           코드 전체 리팩터링
 * 2022.09.22     이민호           TOP,SIDE,BODY,COMM 파일 분리
 * 2023.02.22     이민호           1개의 카드 다중 적용 허용
 ************************************************************************************************/

var DASH110M_comCdList, DASH110M_grid, DASH110MDataSource, DASH110M_typeByGrade, DASH110M_Obj;
var DASH110M_DashLayoutType, DASH110M_BodyPaletteType;
$(document).ready(function () {
    // $("#DASH110M_noDashType").css( {
    //     display: 'none',
    // });
    DASH110M_Obj = {
        templateItemDtls: [],
        paletteItemDtls: [],
        $DASH_PALETTE_CNT: $('#DASH110M_dashPaletteCnt'),
        $DASH_TOP: $("#DASH110M_paletteTOP"),
        $DASH_BODY: $("#DASH110M_dashBodyCnt"),
        $LEFT_SIDE: $("#DASH110M #leftSide"),
        $RIGHT_SIDE: $("#DASH110M #rightSide"),
        initParam: {
            tenantId: GLOBAL.session.user.tenantId,
            usrGrd: GLOBAL.session.user.usrGrd,
        },
        updateParam: function () {
            return $.extend(DASH110M_Obj.initParam, {
                usrId: GLOBAL.session.user.usrId,
                orgCd: GLOBAL.session.user.orgCd,
            })
        },
        pltItemCommParam: function (dataSet) {
            return {
                pltItemNo: dataSet.pltItemNo,
                pltItemCd: dataSet.pltItemCd,
                pltDvCd: dataSet.pltDvCd,
                dashBrdTypCd: DASH110M_DashLayoutType,
                pltDvTypCd: DASH110M_BodyPaletteType,
            }
        },
        fnClassTypeSet: function (type) {
            const className = 'dashType' + type;
            DASH110M_Obj.$DASH_PALETTE_CNT.removeClass(DASH110M_Obj.$DASH_PALETTE_CNT.attr('class').match(/[\d\w-_]+/g)[1]);
            DASH110M_Obj.$DASH_PALETTE_CNT.addClass(className);
        },
        fnMoveElement: function (type) {
            DASH110M_Obj.$RIGHT_SIDE.css('display', 'none');
            switch (type) {
                case 'A' :
                    DASH110M_Obj.$LEFT_SIDE.css('display', 'block');
                    DASH110M_Obj.$RIGHT_SIDE.css('display', 'none');
                    // DASH110M_Obj.$DASH_BODY.before(DASH110M_Obj.$LEFT_SIDE);
                    break;
                case 'B' :
                    // DASH110M_Obj.$DASH_BODY.after(DASH110M_Obj.$LEFT_SIDE);
                    DASH110M_Obj.$LEFT_SIDE.css('display', 'none');
                    DASH110M_Obj.$RIGHT_SIDE.css('display', 'block');
                    break;
                case 'C' :
                    // DASH110M_Obj.$DASH_BODY.before(DASH110M_Obj.$LEFT_SIDE);
                    // DASH110M_Obj.$RIGHT_SIDE.css('display', 'block');
                    DASH110M_Obj.$LEFT_SIDE.css('display', 'block');
                    DASH110M_Obj.$RIGHT_SIDE.css('display', 'block');
                    break;
            }
        },
        fnSetLayout: function (type) {
            DASH110M_DashLayoutType = type;
            if (Utils.isNull(DASH110M_DashLayoutType)){
                $("#DASH110M_cntArea").hide();
                $("#DASH110M_noDashType").css( {
                    display: 'block', width : '84%', height : '94%'
                }).addClass('nodataMsg');
                return;
            }
            if (Utils.isNotNull(DASH110M_DashLayoutType)) {
                $("#DASH110M_cntArea").show();
                $("#DASH110M_noDashType").hide().removeClass('nodataMsg');
                // $('#DASH110M_typeIcon li').removeClass('selected');
                // $('#DASH110M_typeIcon > [data-dash-type=' + type + ']').toggleClass('selected');
                DASH110M_Obj.fnClassTypeSet(type);
                DASH110M_Obj.fnMoveElement(type);
            }
        },

        // 체크 > 콤보로 전부 변경
        // 각 체크 아이템 default (선택) 일시, disply none 적용
        fnTopItemReset: function (selector) {
            let pltDvCd = selector.dataset.pltDvCd;
            let targetName = this.getPltComboName(pltDvCd);
            $(`[name=${targetName}]:not(:last)`).each(function (i) {
                if (i === 3) {
                    return;
                }
                $(this).data("kendoComboBox").value("");
                $(this).trigger("change");
            })
        },
        fnSideItemReset: function (selector) {
            let pltDvCd = selector.dataset.pltDvCd;
            let targetName = this.getPltComboName(pltDvCd);
            $(`[name=${targetName}]`).each(function () {
                $(this).data("kendoComboBox").value("");
                $(this).trigger("change");
            })
            // $(selector).find('ul.item .k-checkbox').each(function () {
            //     $(this).prop("checked", false);
            // })
        },
        fnBodyItemReset: function (selector) {
            let pltDvCd = selector.dataset.pltDvCd;
            let targetName = this.getPltComboName(pltDvCd);
            $(`[name=${targetName}]`).each(function () {
                $(this).data("kendoComboBox").value("");
                $(this).trigger("change");
            })
        },
        // 현재 템플릿에 저장된 아이템 가져오기
        getTmplItemsDtls: function () {
            Utils.ajaxSyncCall("/dash/DASH110SEL01", JSON.stringify(this.initParam), function (result) {
                DASH110M_Obj.templateItemDtls = JSON.parse(result.list);
            })
        },
        // 등급별로 콤보에 선택한 아이템만 가져오기
        getPltItemsDtls: function () {
            Utils.ajaxSyncCall("/dash/DASH110SEL06", JSON.stringify(this.initParam), function (result) {
                DASH110M_Obj.paletteItemDtls = JSON.parse(result.list);
            })
        },
        getPltComboName: function (pltDvCd) {
            const obj = {
                T: "DASH110M_topPaletteCombo",
                B: "DASH110M_bodyPaletteCombo",
                LS: "DASH110M_leftPaletteCombo",
                RS: "DASH110M_rightPaletteCombo",
            }
            return obj[pltDvCd];
        }
    }
    DASH110M_Obj.getTmplItemsDtls();
    DASH110M_Obj.getPltItemsDtls();
    //   [body 컨텐츠] layout 타입별  선택
    $('.paletteTabSelect button').on('click', function () {
        const bodyType = $(this).data('bodyType');
        $('.paletteTabSelect button').removeClass('selected');
        $(this).addClass('selected');
        DASH110M_Obj.$DASH_BODY.removeClass();
        DASH110M_Obj.$DASH_BODY.addClass('dashBodyCnt plt_B bodyType' + bodyType);
        bodyType === 'A' ? DASH110M_Obj.$DASH_BODY.find('.dashBody_4').show() : DASH110M_Obj.$DASH_BODY.find('.dashBody_4').hide();
        DASH110M_heightResizeLayout();
    });

    // 콤보 체인지
    $("#DASH110M .dashCombo").on('change', function (e) {
        let item = $(this).data("kendoComboBox").dataItem();
        let idx = $(`[name=${e.currentTarget.name}]`).index(this);
        const target = $(`.plt_${item.pltDvCd} .item`)[idx];
        if (Utils.isNull(item.pltDvCd)) {
            $(target).empty();
            return;
        }
        let filteredArr = DASH110M_Obj.templateItemDtls.filter(x => x.pltItemCd === item.pltItemCd && x.pltDvCd === item.pltDvCd);
        let tempHtml = [];
        for (const obj of filteredArr) {
            let [checkItem] = DASH110M_Obj.paletteItemDtls.filter(
                x => x.pltDvCd === obj.pltDvCd && x.pltItemNo === obj.pltItemNo && Number(x.pltItemSeq) === Number(idx) + 1);
            let checkValid = checkItem ? 'checked' : "";
            tempHtml.push(`<li data-plt-item-cd=${obj.pltItemCd} data-plt-dv-cd=${obj.pltDvCd} data-plt-item-no=${obj.pltItemNo}>`);
            tempHtml.push(`<span class='check'><input type='checkbox' class='k-checkbox' ${checkValid}>`);
            tempHtml.push(`<label class='k-checkbox-label'></label></span>`);
            switch (obj.pltItemCd) {
                case "T02" :
                    const DASH_replaceTags = (html) => html.replace(/<\/?[^>]+>/gi,"");
                    if (obj.fileNmIdx) {
                        // 이미지
                        tempHtml.push(`<div>`);
                        tempHtml.push(`<img src='/bcs/dashphoto/${obj.tenantId}/${obj.fileNmIdx}' alt='' style='width: 100%; background-size: 100%; object-fit: cover;'/></div>`);
                    } else {
                        // 텍스트
                        tempHtml.push(`<div class='cnt textEllipsis' style='background-color: ${obj.bgColrCd}'>${Utils.htmlDecode(obj.dispCtt)}</div>`)
                    }
                    break;
                case "T05" :
                    tempHtml.push(`<div>`);
                    tempHtml.push(`<img src='/bcs/dashimg/${obj.tenantId}/${obj.fileNmIdx}' alt='' style='width: 100%; background-size: 100%; object-fit: cover;'/></div>`);
                    break;
                case "T03" :
                    tempHtml.push(`<div class='cnt textEllipsis'>`)
                    tempHtml.push(`<img src='resources/images/contents/logo_kma.png' alt='기상청' style='margin-right: 5px;'>${obj.dispCtt}</div>`);
                    break;
                default :
                    tempHtml.push(`<div class='cnt textEllipsis'>${obj.dispCtt}</div>`)
                    break;
            }
            tempHtml.push(`</li>`);
        }
        $(target).empty();
        $(target).append(tempHtml.join(""));
        $(target).kendoTooltip({
            filter: ".cnt",
            position: "center",
            showOn: "click mouseenter",
            content: function (e) {
                return Utils.htmlDecode($(e.target).html());
                // console.log(this.content());

            },
            show: function (e) {
                if (this.content.text().length > 20) {
                    this.content.parent().css("visibility", "visible");
                }
            },
            hide: function (e) {
                this.content.parent().css("visibility", "hidden");
                // this.destroy();
            },
        }).data("kendoTooltip");
    });
    DASH110M_DashLayoutInit();
});

$(window).resize(function () {
    DASH110M_heightResizeLayout();
});

//    [주 컨텐츠]  height 체크
function DASH110M_heightResizeLayout() {
    let screenHeight = $(window).height();
    let layoutObj = {
        heightA: $('.header_wrap').height() + 120,
        heightB: $('.dashPalette_top').height() + 20,
        leftSideLength: $('#leftSide .panelBoradPalette').find('>li').length,
        rightSideLength: $('#rightSide .panelBoradPalette').find('>li').length,
    }
    let tHeight = screenHeight - layoutObj.heightA - layoutObj.heightB - 100;
    if (DASH110M_grid.element) {
        DASH110M_grid.element.find('.k-grid-content').css('height', screenHeight - layoutObj.heightA - 72);
    }
    $('#leftSide .panelBoradPalette > li').css('height', tHeight / layoutObj.leftSideLength + 5);  //    [좌측 컨텐츠]   체크 ~!
    $('#rightSide .panelBoradPalette > li').css('height', tHeight / layoutObj.rightSideLength + 5);  //    [좌측 컨텐츠]   체크 ~!
    $('.dashPalette_cnt .dashBodyCnt > div').css('height', tHeight / 2 - 10);               //    [Body 컨텐츠]   Height 체크~!

    if ($('.dashPalette_cnt .dashBodyCnt').hasClass('bodyTypeB')) {
        $('.dashPalette_cnt .dashBody_1').css('height', tHeight - 10);
    }
    if ($('.dashPalette_cnt .dashBodyCnt').hasClass('bodyTypeC')) {
        $('.dashPalette_cnt .dashBody_3').css('height', tHeight - 10);
    }
}

// 초기 셋팅
function DASH110M_DashLayoutInit() {
    const param = {
        "codeList": [
            {"mgntItemCd": "C0024"}, // 사용자 등급명
            {"mgntItemCd": "C0049"}, // DashBoard TYPE명
            {"mgntItemCd": "C0038"}, // TOP 팔레트명
            {"mgntItemCd": "C0039"}, // SIDE 팔레트명
            {"mgntItemCd": "C0040"}  // BODY 팔레트명
        ]
    };
    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        DASH110M_comCdList = JSON.parse(result.codeList);
        // Utils.setKendoComboBox(DASH110M_comCdList, "C0040", "input[name=DASH110M_BodyPaletteCombo]", "", "선택");
        DASH110M_injectGrid();
        DASH110M_initGridData();
        DASH110M_heightResizeLayout();
    });
}

function DASH110M_initGridData() {
    $('#DASH110M .inputError').removeClass('inputError');
    DASH110M_grid.dataSource.read(DASH110M_Obj.initParam);
}

function DASH110M_injectGrid() {
    DASH110MDataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxSyncCall("/dash/DASH110SEL00", JSON.stringify(options.data),
                    function (result) {
                        let tempTypeByGrade = JSON.parse(result.typeByGrade);
                        let grdValue = parseInt(GLOBAL.session.user.usrGrd.charAt(0));
                        DASH110M_typeByGrade = DASH110M_comCdList.filter(x => x.mgntItemCd === 'C0024')
                            .filter((x) => {
                                // 등급별 리스트 필터
                                // 관리자 권한이 아닐 경우, 본인만
                                let callCnslGrd = ['100','110','120'];
                                let webCnslGrd  = ['200','210','220'];
                                if (callCnslGrd.includes(GLOBAL.session.user.usrGrd)
                                    || webCnslGrd.includes(GLOBAL.session.user.usrGrd)) {
                                    return GLOBAL.session.user.usrGrd === x.comCd;
                                }
                                // 130 - (100,110,120) / 230 - (200,210,220)
                                let codeValue = parseInt(x.comCd.charAt(0));
                                if (grdValue === 1 || grdValue === 2) {
                                    return codeValue === grdValue
                                }
                                // 400,900,910 - 이하목록
                                return  grdValue >= codeValue;
                            })
                            .map((obj) => {
                                let dashTypCd = tempTypeByGrade.find(x => x.usrGrd === obj.comCd);
                                return {
                                    usrGrd: obj.comCd,
                                    dashBrdTypCd: Utils.isNotNull(dashTypCd) ? dashTypCd.dashBrdTypCd : ""
                                }
                            });
                        options.success(DASH110M_typeByGrade);
                    }
                )
            },
            update: function (options) {
                let updateParam = options.data.models;
                let regInfo = {
                    tenantId: GLOBAL.session.user.tenantId,
                    usrId: GLOBAL.session.user.usrId,
                    orgCd: GLOBAL.session.user.orgCd,
                    pltDvCd: "",
                }
                $.each(updateParam, function (index, item) {
                    $.extend(item, regInfo);
                });
                Utils.ajaxCall("/dash/DASH110UPT01", JSON.stringify(updateParam),
                    function (result) {
                        options.success(options.data.models);
                    });
            },
        },
        requestEnd: function (e) {
            let type = e.type;
            if (type !== "read" && type !== "destroy") {
                DASH110M_initGridData();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: 'usrGrd',
                fields: {
                    usrGrd: {field: "usrGrd", type: "string"},
                    dashBrdTypCd: {field: "dashBrdTypCd", type: "string"},
                }
            }
        }
    });
    DASH110M_grid = $("#DASH110M_typeByGrade").kendoGrid({
        dataSource: DASH110MDataSource,
        resizable: true,
        autoBind: false,
        selectable: true,
        scrollable: true,
        persistSelection: true,
        dataBound: function (e) {
            if (this.select().length > 0) {
                return;
            }
            e.sender.items().each(function () {
                let dataItem = e.sender.dataItem(this);
                if (dataItem.usrGrd === GLOBAL.session.user.usrGrd) {
                    e.sender.select(this);
                }
            })
        },
        change: function (e) {
            let selectedItem = this.dataItem(this.select());
            DASH110M_Obj.initParam.usrGrd = selectedItem.usrGrd;

            DASH110M_setItemCombo();
            const dashType = selectedItem.dashBrdTypCd.substring(0, 1);
            DASH110M_Obj.fnSetLayout(dashType);

        },
        columns: [
            {
                width: 'auto', field: "usrGrd", title: "등급",
                template: function (dataItem) {
                    return Utils.getComCdNm(DASH110M_comCdList, 'C0024', dataItem.usrGrd);
                }
            },
            {
                width: 35, field: "dashBrdTypCd", title: "타입",
            },
            {
                width: 45,
                template: function (dataItem) {
                    let tempHtml = `<p class="iconSelected">`
                    if (dataItem.dashBrdTypCd) {
                        tempHtml += `<span class="icon type showBtn" onclick="DASH110M_fnSelectDashType(this);"><img src=${GLOBAL.contextPath}/images/contents/ico_type${dataItem.dashBrdTypCd}.png alt=''></span>`
                    }
                    tempHtml += `<button class="icon btn icoType k-icon k-i-plus" style="color: white;" onclick="DASH110M_fnSelectDashType(this);" title="상세보기"></button>`
                    tempHtml += `</p>`;
                    return tempHtml
                }

            }
        ],
        noRecords: {template: '<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>'},
    }).data("kendoGrid");

    DASH110M_grid.tbody.on('mouseenter', 'tr', function (e) {
        $(".type", e.currentTarget).removeClass("showBtn");
        $(".btn", e.currentTarget).addClass("showBtn");
    });
    DASH110M_grid.tbody.on('mouseleave', 'tr', function (e) {
        $(".type", e.currentTarget).addClass("showBtn");
        $(".btn", e.currentTarget).removeClass("showBtn");
    })
}

function DASH110M_setItemCombo(pltDvCd) {
    DASH110M_Obj.getTmplItemsDtls();
    DASH110M_Obj.getPltItemsDtls();
    const filterPltDvCd = pltDvCd;
    let param = $.extend({pltDvCd: pltDvCd}, DASH110M_Obj.initParam)
    // 템플릿에 등록된 항목과 항목 체크 여부 데이터 LOAD
    Utils.ajaxCall("/dash/DASH110SEL08", JSON.stringify(param), function (result) {
        let dashTmplArr = JSON.parse(result.tmplItems);
        let checkItemArr = JSON.parse(result.checkItems);
        const bodyTypCdArr = checkItemArr.find(obj => obj.pltDvCd === 'B');
        if (bodyTypCdArr) {
            $('#DASH110M_paletteTab [data-layout=type' + bodyTypCdArr.pltDvTypCd + ']').click();
        } else {
            $('#DASH110M_paletteTab [data-layout=type' + 'A' + ']').click();
        }
        let codeObj = {
            T: {mgntItemCd: "C0038", list: [], $selector: $("input[name=DASH110M_topPaletteCombo]")},
            B: {mgntItemCd: "C0040", list: [], $selector: $("input[name=DASH110M_bodyPaletteCombo]")},
            LS: {mgntItemCd: "C0039", list: [], $selector: $("input[name=DASH110M_leftPaletteCombo]")},
            RS: {mgntItemCd: "C0039", list: [], $selector: $("input[name=DASH110M_rightPaletteCombo]")}
        };
        //@콤보사전작업
        //팔레트구분코드-codeObj에 정의된 key값을 기준으로 순회하며 코드명을 가져온 후 list data 추가
        if (filterPltDvCd) {
            codeObj = {[filterPltDvCd] : codeObj[filterPltDvCd]};
        }
        dashTmplArr.forEach(function (obj) {
            const pltDvCd = obj.pltDvCd;
            const pltItemCd = obj.pltItemCd;
            const pltItemSeq = obj.pltItemSeq;
            const pltItemCdNm = Utils.getComCdNm(DASH110M_comCdList, codeObj[pltDvCd].mgntItemCd, pltItemCd, false);
            codeObj[pltDvCd].list.push({pltDvCd, pltItemCd, pltItemCdNm, pltItemSeq});
        });
        for (const code in codeObj) {
            let targetCd = codeObj[code];
            targetCd.$selector.each(function (idx, elem) {
                const findItemSeq = checkItemArr.find(obj => idx + 1 === obj.pltItemSeq && code === obj.pltDvCd);

                let initValue;
                if (findItemSeq) {
                    initValue = findItemSeq.pltItemCd;
                }
                let addList = [{pltItemCdNm: "선택", pltItemCd: "", pltDvCd: code}, ...targetCd.list];

                /* 슬로건 위치 고정 (임시 - 디자인 변경 시 제거 / 필요 시 default로 적용 필요) */
                // START
                if (code === "T" && idx !== 3) {
                    addList = addList.filter(x => x.pltItemCd !== "T01");
                }
                if (code === "T" && idx === 3) {
                    // addList = addList.filter(x => x.pltItemCd === "T01" || Utils.isNull(x.pltItemCd));
                    addList = [{pltItemCdNm: "슬로건", pltItemCd: "T01" , pltDvCd:"T"}];
                }
                // END
                Utils.setKendoComboBoxCustom(
                    addList, elem, "pltItemCdNm", "pltItemCd", initValue, false);
                $(elem).trigger('change');

            })
        }
    })
}

function DASH110M_fnSelectDashType(obj) {
    if ($(obj).hasClass("toolTipActive")) {
        return;
    }
    let kendoTooltip = $(obj).parent().kendoTooltip({
        filter: ".icon",
        position: "right",
        offset: -2,
        showOn: "click",
        show: function (e) {
            this.content.parent().css("visibility", "visible");
            DASH110M_grid.select(obj.closest('tr'));
            let gridSelectRow = DASH110M_grid.dataItem(DASH110M_grid.select());
            if (gridSelectRow.dashBrdTypCd) {
                $('#DASH110M_typeIcon > [data-dash-type=' + gridSelectRow.dashBrdTypCd + ']').addClass('selected');
            }
            $('#DASH110M_typeIcon li').click(function (e) {
                let dashType = this.dataset.dashType;
                $('#DASH110M_typeIcon > [data-dash-type=' + dashType + ']').toggleClass('selected');
                $('#DASH110M_typeIcon li:not("[data-dash-type=' + dashType + ']")').removeClass('selected');
                if ($("#DASH110M_typeIcon > .selected").length === 0){
                    dashType = "";
                }
                gridSelectRow.set('dashBrdTypCd', dashType);
                DASH110M_grid.refresh();
            });
            $('.typeCancle').click(function () {
                kendoTooltip.hide();
            })
        },
        autoHide: true,
        content: kendo.template($('#selectDashType').html()),
        hide: function () {
            this.destroy();
            $(obj).removeClass("toolTipActive");
        }
    }).data("kendoTooltip");
}

function DASH110M_saveDashType() {
    // let dataItem = DASH110M_grid.dataItem(DASH110M_grid.select());
    // if (Utils.isNull(dataItem.dashBrdTypCd)) {
    //     return Utils.alert('대시보드 Type을 먼저 저장해주세요.');
    // }
    Utils.confirm(DASH110M_langMap.get("common.save.msg"), function () { // "저장하시겠습니까?"
        DASH110MDataSource.sync().then(function () {
            Utils.alert(DASH110M_langMap.get("success.common.save"));           // "정상적으로 저장되었습니다."
        });
    });
}

function DASH110M_gridDirtyCheck(e) {
    return new Promise(function (resolve, reject) {
        let dataItem = DASH110M_grid.dataItem(DASH110M_grid.select());
        if (Utils.isNull(dataItem.dashBrdTypCd) || dataItem.dirty) {
            return Utils.alert(DASH110M_langMap.get("DASH110M.save.type"));
        }
        resolve(e);
    });
}

$("#DASH110M_paletteTab > button").on('click', function () {
    DASH110M_BodyPaletteType = this.value
});

function DASH110M_save(e) {
    const obj = {
        T: {getItems: (elem) => $(elem).closest('.topPanel').find('ul.item li')},
        B: {getItems: (elem) => $(elem).closest('.panel').find('ul.item li')},
        LS: {getItems: (elem) => $(elem).closest('li').find('ul.item li')},
        RS: {getItems: (elem) => $(elem).closest('li').find('ul.item li')},
    }
    const findPlt = e.closest("[class*='plt']");
    const pltDvCd = findPlt.dataset.pltDvCd;
    const targetName = DASH110M_Obj.getPltComboName(pltDvCd);
    const sidePltArr = [], sideItemArr = [];
    const $pltSelector = $(findPlt).find(`input[name=${targetName}]`);
    // const $itemSelector = (elem) => $(`${elem} ~ ul.item`); //.closest('ul.item li');
    $pltSelector.each(function (idx, elem) {
        let pltItemCd = $(elem).data('kendoComboBox').value();
        if (Utils.isNull(pltItemCd)) {
            return true; // continue
        }
        idx += 1;
        let paletteObj = {
            pltDvCd: pltDvCd,
            pltDvTypCd: DASH110M_BodyPaletteType,
            pltItemCd: pltItemCd,
            pltItemSeq: idx,
            pltItemCdUseYn: "Y",
            dashBrdTypCd: DASH110M_DashLayoutType,
        };
        let $items = obj[pltDvCd].getItems(elem);
        for (const item of $items) {
            const dataSet = item.dataset;
            let checkItem = $(item).find(".k-checkbox").is(":checked");
            if (checkItem === false) {
                continue;
            }
            let itemObj = DASH110M_Obj.pltItemCommParam(dataSet);
            itemObj.pltDvTypCd = idx;
            itemObj.pltItemSeq = idx;
            itemObj.pltItemNoUseYn = "Y";
            sideItemArr.push($.extend(itemObj, DASH110M_Obj.updateParam()));
        }
        if (sideItemArr.filter(x=>x.pltItemSeq === idx).length === 0) {
            return true;
        }
        sidePltArr.push($.extend(paletteObj, DASH110M_Obj.updateParam()));
    });
    Utils.confirm(DASH110M_langMap.get("common.save.msg"), function () {
        DASH110M_paletteSave(sidePltArr, sideItemArr, $.extend({pltDvCd: pltDvCd}, DASH110M_Obj.initParam));
    });
}

// TOP 팔레트 및 항목 저장
function DASH110M_paletteSave(palette, item, param) {
    Utils.ajaxCall("/dash/DASH110INS01", JSON.stringify({palette: palette, item: item, param: param}),
        function (result) {
            Utils.alert(DASH110M_langMap.get("success.common.save"),function () {
                const {pltDvCd} = param;
                DASH110M_setItemCombo(pltDvCd);
            });
        });
}

function DASH110M_itemReset(e) {
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

// $("#leftSide").kendoSortable({
//     filter: "li",
//     cursor: "move",
//     placeholder: function (element) {
//         return element.clone().css("opacity",  0.1);
//     },
//     hint: function (element) {
//         return element.clone().css("width", element.width()).removeClass("k-selected");
//     },
//         move:function(e){
//             console.log(e.sender.items());
//         },
//         change:function(e){console.log(e.sender.items());
//             console.log("from " + e.oldIndex + " to " + e.newIndex);
//         }
// }).data("kendoSortable");
// $("#DASH110M_dashBodyCnt").kendoSortable({
//     filter: ".DASH110M_body",
//     cursor: "move",
//     placeholder: function (element) {
//         return element.clone().css("opacity",  0.1);
//     },
//     hint: function (element) {
//         return element.clone().css("width", element.width()).removeClass("k-selected");
//     },
//         move:function(e){
//             console.log(e.sender.items());
//         },
//         change:function(e){console.log(e.sender.items());
//             console.log("from " + e.oldIndex + " to " + e.newIndex);
//         }
// }).data("kendoSortable");
// $("#DASH110M_paletteTOP").kendoSortable({
//     filter: "[class*='dash']",
//     cursor: "move",
//     placeholder: "<div class='placeholder'>Drop Here!</div>",
//     hint: function (element) {
//         return element.clone().css("opacity",  0.1);
//     },
//         move:function(e){
//             console.log(e.sender.items());
//         },
//         change:function(e){console.log(e.sender.items());
//             console.log("from " + e.oldIndex + " to " + e.newIndex);
//         }

// }).data("kendoSortable");
//
// .placeholder {
//     display: inline-block;
//     width: 164px;
//     height: 123px;
//     border: 1px dashed #ddd;
//     background-color: #f3f5f7;
//     margin: 10px 20px 10px 0;
//     font-size: 1.3em;
//     font-weight: bold;
//     line-height: 125px;
//     vertical-align: middle;
//     color: #777;
// }