/***********************************************************************************************
 * Program Name : 대시보드 항목관리 - PLT Grid (DASH120M_PLT.js)
 * Creator      : 이민호
 * Create Date  : 2022.11.15
 * Description  : 대시보드 항목관리 - PLT Grid
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.11.15     이민호           최초생성
 *
 ************************************************************************************************/

function DASH120M_fnPltGridInit() {
    DASH120M_grid[0].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall("/dash/DASH120SEL01", JSON.stringify(options.data), function (result) {
                    options.success(JSON.parse(result.list));
                });
            },
            create: function (options) {
                let updateList = options.data.models;
                // let validationArr = updateList.filter(x=>Utils.isNull(x.pltDvCd));
                // if (Utils.isNotNull(validationArr)) {
                //     return options.success(validationArr);
                // }
                let regInfo = {
                    regrId: GLOBAL.session.user.usrId,
                    regrOrgCd: GLOBAL.session.user.orgCd,
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprOrgCd: GLOBAL.session.user.orgCd
                }
                $.each(updateList, function (index, item) {
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/dash/DASH120INS00", JSON.stringify({
                    list: updateList
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            update: function (options) {
                let updateList = options.data.models;
                let regInfo = {
                    regrId: GLOBAL.session.user.usrId,
                    regrOrgCd: GLOBAL.session.user.orgCd,
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprOrgCd: GLOBAL.session.user.orgCd
                }

                $.each(updateList, function (index, item) {
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/dash/DASH120INS00", JSON.stringify({
                    list: updateList
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            // destroy: function (options) {
            //     options.success(options.data.models);
            // },
            destroy: function(options) {
                let deleteList = options.data.models;
                console.log(deleteList);
                Utils.ajaxCall("/dash/DASH120DEL00", JSON.stringify({
                    list: deleteList
                }), function (result) {
                    options.success(options.data.models);
                });
            },
        },
        requestStart: function (e) {
            var type = e.type;
            var response = e.response;
        },
        requestEnd: function (e) {
            console.log(e);
            var type = e.type;
            var response = e.response;

            if (type != "read") {
                DASH120M_fnSearchPlt();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "pltDvCd",
                fields: {
                    pltDvCd: {type: "string", nullable:false},
                }
            }
        }
    });

    DASH120M_grid[0].instance = $("#DASH120M_pltGrid").kendoGrid({
        dataSource: DASH120M_grid[0].dataSource,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        sortable: false,
        dataBound: function (e) {
            let grid = this;
            DASH120M_grid_fnOnDataBound(0);
            if (DASH120M_grid[0].dataSource.total() === 0) {
                DASH120M_fnSearchPltItem();
                return;
            }
            $(".DASH120M_openPopPlt").click(function(e){
                // 첫번째에서 고정되는 값을 찾는다.
                const getOffset = (el) => {
                    const rect = el.getBoundingClientRect();
                    return {
                        left: rect.left + window.scrollX,
                        top: rect.top + window.scrollY
                    };
                }
                let afterSelectRow = $(e.target).closest("tr");
                let dataItem = DASH120M_grid[0].instance.dataItem(afterSelectRow);

                let x = getOffset(e.target).left;
                let y = getOffset(e.target).top;
                Utils.openKendoWindow("/sysm/SYSM335P", 710,600, "left", Number(x),Number(y),false,
                    {isMulti : "N",callbackKey:"DASH120M_fnPopupCallback", mgntItemCd:'C0037',isWindow:'Y'});
                Utils.setCallbackFunction("DASH120M_fnPopupCallback", function (items) {
                    if (items.mgntItemCd !== 'C0037') {
                        Utils.alert(DASH120M_langMap.get("DASH120M.PLT.valid.mgntItemCd"));
                        return;
                    }
                    if (items.useDvCd === 'N') {
                        Utils.alert(DASH120M_langMap.get("DASH120M.PLT.valid.useDvCd"));
                        return;
                    }
                    let totalList = grid.dataSource.data();
                    let filterList = totalList.filter(obj=>obj.pltDvCd === items.comCd)
                    if (filterList.length > 0) {
                        Utils.alert(DASH120M_langMap.get("DASH120M.PLT.valid.existsPlt"));
                        return;
                    }
                    dataItem.set("beforeDvCd", dataItem.pltDvCd);
                    dataItem.set("pltDvCd", items.comCd);
                    dataItem.set("tenantId", GLOBAL.session.user.tenantId);
                    let uid = afterSelectRow.attr("data-uid");
                    $("tr[data-uid="+uid+"] div.DASH120M_pltDvCd").trigger('click');
                });
            })
        },
        change: function (e) {
            DASH120M_grid_fnOnChange(e, 0);
        },
        // cellClose: function(e) {
        //     DASH120M_fnCheckPltDvCD(e);
        // },
        cellClose:function (e) {
        },
        columns: [
            {
                field: "tenantId",
                hidden: true,
            },
            {width: 30, selectable: true,},
            {
                width: "auto", field: "pltDvCd", title: DASH120M_langMap.get("DASH120M.comCdNm"),// 항목
                attributes: {"class": "k-text-left pltSelectable", "onclick" : "DASH120M_fnSearchPltItem(this)"},
                template: function (dataItem) {
                    const pltDvCdNm = Utils.getComCdNm(DASH120M_comCdList,"C0037",dataItem.pltDvCd);
                    return '<div class="DASH120M_pltDvCd">' + pltDvCdNm + '</div>';
                },
            },
            {
                title: DASH120M_langMap.get("button.select"), //선택
                width: 50,
                template: '<button type="button" class="DASH120M_openPopPlt btnRefer_default" onclick="">↓</button>'
            }
        ],
        noRecords: {template: '<div class="nodataMsg"><p>' + DASH120M_langMap.get("DASH120M.info.nodata") + '</p></div>'},


    }).data("kendoGrid");
}
