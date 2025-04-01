/***********************************************************************************************
 * Program Name : 대시보드 항목관리 - PLT ITEM Grid (DASH120M_PLT_ITEM.js)
 * Creator      : 이민호
 * Create Date  : 2022.11.15
 * Description  : 대시보드 항목관리 - PLT ITEM Grid
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.11.15     이민호           최초생성
 *
 ************************************************************************************************/
function DASH120M_renderTargetItemCd({pltItemCd}){
    const commCode = {
        'T01' : DASH120M_fnShowSloganGrid,
        'T02' : DASH120M_fnShowPhase,
        'T03' : DASH120M_fnShowWeather,
        'T04' : DASH120M_TBD,
        'T05' : DASH120M_fnShowThemeImg,
        'S01' : DASH120M_fnShowSideItemTmpl,
        'S02' : DASH120M_fnShowSideItemTmpl,
        'S03' : DASH120M_fnShowSideItemTmpl,
        'S04' : DASH120M_fnShowQuickLink,
        'S05' : DASH120M_fnShowSideItemTmpl,
        'B01' : DASH120M_fnShowBodyItemTmpl,
    }
    let targetFunction = commCode[pltItemCd];
    let itemCd = String(pltItemCd);
    if (Utils.isNull(targetFunction)) {
        return `<button class="k-icon k-i-zoom-in" onClick="$('#DASH120M_Add').data('pltItemCd','${itemCd}');DASH120M_fnShowSideItemTmpl(this);"></button>`
    }
    // return `<button class='k-icon k-i-zoom-in' onClick=$(this).closest('td').trigger('click');${targetFunction.name}(this)></button>`
    return `<button class='k-icon k-i-zoom-in' onClick=$('#DASH120M_Add').data('pltItemCd','${itemCd}');${targetFunction.name}(this)></button>`
}

function DASH120M_getMgntItemCd (pltDvCd) {
    let [comCd] = DASH120M_comCdList.filter(x=>x.comCd === pltDvCd);
    if (Utils.isNotNull(comCd)) {
        return comCd.subMgntItemCd;
    }
}

function DASH120M_fnPltItemGridInit() {
    DASH120M_grid[1].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall("/dash/DASH120SEL02", JSON.stringify(options.data), function (result) {
                    DASH120M_list = JSON.parse(result.list);
                    if (DASH120M_list.length === 0) {
                        DASH120M_commObj.fnResetPltItemDtls();
                    }
                    options.success(JSON.parse(result.list));
                });
            },
            create: function (options) {
                var updateList = options.data.models;
                var regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprOrgCd: GLOBAL.session.user.orgCd
                }
                $.each(updateList, function (index, item) {
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/dash/DASH120INS01", JSON.stringify({
                    list: updateList
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            update: function (options) {
                var updateList = options.data.models;
                var regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprOrgCd: GLOBAL.session.user.orgCd
                }

                $.each(updateList, function (index, item) {
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/dash/DASH120INS01", JSON.stringify({
                    list: updateList
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            // destroy: function (options) {
            //     options.success(options.data.models);
            // }
            destroy: function(options) {
                let deleteList = options.data.models;
                Utils.ajaxCall("/dash/DASH120DEL06", JSON.stringify({
                    list: deleteList
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            parameterMap: function(data, type) {
                if (type === "destroy") {
                    // send the destroyed data items as the "models" service parameter encoded in JSON
                    console.log(data.models)
                    return { list: kendo.stringify(data.models) }
                }
            }
        },
        requestStart: function (e) {
            var type = e.type;
            var response = e.response;
        },
        requestEnd: function (e) {
            var type = e.type;
            var response = e.response;

            if (type != "read") {
                DASH120M_fnSearchPltItem();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "pltItemCd",
                fields: {
                    pltItemCd: {field: "pltItemCd", type: "string"},
                    dispCycCd: {field: "dispCycCd", type: "string"},
                    dispShpCd: {field: "dispShpCd", type: "string"},
                }
            }
        }
    });
    DASH120M_grid[1].instance = $("#DASH120M_pltItemGrid").kendoGrid({
        //   data 있을때
        dataSource: DASH120M_grid[1].dataSource,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        sortable: false,
        dataBound: function () {
            DASH120M_grid_fnOnDataBound(1);
            let grid = this;
            let rows = grid.items();
            $(rows).each(function (e) {
                let row = this;
                let data = grid.dataItem(row);
                // Check if this row needs to be altered
                if (data.pltItemCd !== "T01") {
                    $(row).find("td.T1_dispCycCd").attr("colspan", "2");
                    $(row).find("td.T1_dispShpCd").addClass("displayNon");
                }else{

                    $(row).find("td.T1_dispShpCd").attr("colspan", "2");
                    $(row).find("td.T1_dispCycCd").addClass("displayNon");
                }
            });
        },
        change: function (e) {
            DASH120M_grid_fnOnChange(e, 1);
        },
        edit: function (e) {
            // if (DASH120M_grid[1].currentItem.pltItemCd !== 'T01') {
            //     this.closeCell();
            // };
        },
        cellClose:function(e) {
            let dataItem = e.model;
            let grid = this;
            if (dataItem.id !== dataItem.pltItemCd) {
                let totalList = grid.dataSource.data().filter(x=>x.uid !== dataItem.uid);
                let filterList = totalList.filter(item=>item.pltItemCd === dataItem.pltItemCd)

                if (filterList.length > 0) {
                    Utils.alert(DASH120M_langMap.get("DASH120M.ITEM.valid.existsPltItem"));
                    dataItem.set("pltItemCd", dataItem.id);
                    return false;
                }
            }
        },
        columns: [
            {
                width: 30,
                selectable: true,
            }, {
                title: "상태",
                type: "string",
                width: 50,
                template: function (dataItem) {
                    let html = "";
                    if (dataItem.isNew()) {
                        html = "<img src='" + GLOBAL.contextPath + "/images/contents/btn_new.png' style='vertical-align:middle'>";
                    } else if (dataItem.dirty) {
                        html = "<img src='" + GLOBAL.contextPath + "/images/contents/btn_modify.png' style='vertical-align:middle'>";
                    }

                    return html;
                },
            }, {
                width: "auto",
                field: "pltItemCd",
                title: DASH120M_langMap.get("DASH120M.comCdNm"), //항목
                attributes: {"class": "textLeft pltItemSelectable"},
                editor: function (container, options) {
                    DASH120M_commonpltItemCdEditor(container, options, DASH120M_grid[1].instance);
                },
                template: function (dataItem) {
                    let mgntItemCd = DASH120M_getMgntItemCd(dataItem.pltDvCd);
                    return Utils.getComCdNm(DASH120M_comCdList, mgntItemCd, dataItem.pltItemCd);
                },
            }, {
                width: 80,
                field: "dispCycCd",
                title: DASH120M_langMap.get("DASH120M.dispCycCd"), // Display 주기
                headerAttributes: {"colspan": 2},//   함수 재설정 요~!
                attributes: {"class": "T1_dispCycCd"},
                editor: function (container, options) {
                    DASH120M_createComboInGrid(container, options, DASH120M_grid[1].instance);
                },
                template: function (dataItem) {
                    if (dataItem.pltItemCd !== 'T01') {
                        return "-";
                    }
                    return Utils.getComCdNm(DASH120M_comCdList, 'C0041', dataItem.dispCycCd);
                },
            }, {
                width: 80,
                field: "dispShpCd",
                title: DASH120M_langMap.get("DASH120M.dispCycCd"), // Display 주기
                headerAttributes: {"class": "displayNon"},
                attributes: {"class": "T1_dispShpCd"},
                editor: function (container, options) {
                    DASH120M_createComboInGrid(container, options, DASH120M_grid[1].instance);
                },
                template: function (dataItem) {
                    return Utils.getComCdNm(DASH120M_comCdList, 'C0042', dataItem.dispShpCd);
                },
            }, {
                title: DASH120M_langMap.get("button.detail"), //선택
                width: 50,
                template: function(dataItem) {
                    return DASH120M_renderTargetItemCd(dataItem);
                }
            }
        ],
        noRecords: {template: '<div class="nodataMsg"><p>' + DASH120M_langMap.get("DASH120M.info.nodata") + '</p></div>'},
    }).data("kendoGrid");
}

function DASH120M_commonpltItemCdEditor(container, options, grid, exceptComCd) {
    let field = options.field;
    let pltDvCd = options.model.pltDvCd;
    let mgntItemCd = DASH120M_getMgntItemCd(pltDvCd);
    let $select = $('<select required data-bind="value:' + field + '"/>').appendTo(container);
    let DASHTypCdList = DASH120M_comCdList.filter(function (code) {
        return code.mgntItemCd === mgntItemCd && code.comCd !== exceptComCd
    });

    Utils.setKendoComboBox(DASHTypCdList, mgntItemCd, $select, "", false).bind("change", function (e) {
        let element = e.sender.element;
        let row = element.closest("tr");
        let dataItem = grid.dataItem(row);
        let selectedValue = e.sender.value();
        if(Utils.isNull(selectedValue)){
            grid.refresh();
            return;
        }
        dataItem.set("beforeDvCd", dataItem.id);
        dataItem.set(field, selectedValue);
        grid.select(row);

    });
}