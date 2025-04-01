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
var themeDataSource, themeListView;

function DASH120M_fnPltItemDtlsGridInit() {
    DASH120M_grid[2].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall("/dash/DASH120SEL03", JSON.stringify(options.data), function (result) {
                    let DASH120_JSON = JSON.parse(result.list);
                    for (i = 0; i < DASH120_JSON.length; i++) {
                        let DASH120M_grid2_StrDate = new Date(DASH120_JSON[i].useTrmStrDd);
                        let DASH120M_grid2_EndDate = new Date(DASH120_JSON[i].useTrmEndDd);
                        DASH120_JSON[i].useTrmStrDd = DASH120M_grid2_StrDate;
                        DASH120_JSON[i].useTrmEndDd = DASH120M_grid2_EndDate;
                    }
                    DASH120M_list = DASH120_JSON;
                    options.success(DASH120_JSON);
                });
            },
            create: function (options) {
                let updateList = options.data.models;
                let DASH120M_UseTrmStrDd, DASH120M_UseTrmEndDd;

                for (i = 0; i < updateList.length; i++) {
                    DASH120M_UseTrmStrDd = kendo.toString(new Date(updateList[i].useTrmStrDd), "yyyy-MM-dd")
                    DASH120M_UseTrmEndDd = kendo.toString(new Date(updateList[i].useTrmEndDd), "yyyy-MM-dd")
                }

                let regInfo = {
                    useTrmStrDd: DASH120M_UseTrmStrDd,
                    useTrmEndDd: DASH120M_UseTrmEndDd,
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorcOrgCd: GLOBAL.session.user.orgCd
                }
                $.each(updateList, function (index, item) {
                    $.extend(item, regInfo);
                });


                    Utils.ajaxCall("/dash/DASH120INS02", JSON.stringify({
                    list: updateList
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            update: function (options) {
                let updateList = options.data.models;
                let DASH120M_UseTrmStrDd, DASH120M_UseTrmEndDd;

                for (i = 0; i < updateList.length; i++) {
                    DASH120M_UseTrmStrDd = kendo.toString(new Date(updateList[i].useTrmStrDd), "yyyy-MM-dd")
                    DASH120M_UseTrmEndDd = kendo.toString(new Date(updateList[i].useTrmEndDd), "yyyy-MM-dd")
                }

                let regInfo = {
                    useTrmStrDd: DASH120M_UseTrmStrDd,
                    useTrmEndDd: DASH120M_UseTrmEndDd,
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorcOrgCd: GLOBAL.session.user.orgCd
                }

                $.each(updateList, function (index, item) {
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/dash/DASH120INS02", JSON.stringify({
                    list: updateList
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            destroy: function (options) {
                options.success(options.data.models);
            }
        },
        requestStart: function (e) {
            var type = e.type;
            var response = e.response;
        },
        requestEnd: function (e) {
            var type = e.type;
            var response = e.response;

            if (type != "read" && type != "destroy") {
                DASH120M_fnSearch_T01_slogan();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "dispCtt",
                fields: {
                    dispCtt: {field: "dispCtt", type: "string"},
                    useTrmStrDd: {field: "useTrmStrDd", type: "string"},
                    useTrmEndDd: {field: "useTrmEndDd", type: "string"},
                }
            }
        }
    });
    DASH120M_grid[2].instance = $("#DASH120M_sloganGrid").kendoGrid({
        //   data 있을때
        dataSource: DASH120M_grid[2].dataSource,
        dataBound: function (e) {
            DASH120M_grid_fnOnDataBound(2);
            let selectedItem = this.dataItem(this.select());
            if (selectedItem) {
                if (new Date(selectedItem.useTrmStrDd) > new Date(selectedItem.useTrmEndDd)) {
                    Utils.alert('시작일과 종료일을 다시 설정해주세요.');
                    selectedItem.set("useTrmStrDd",selectedItem.useTrmEndDd);
                    return;
                }
            }
        },
        change: function (e) {
            DASH120M_grid_fnOnChange(e, 2);
        },
        //   data 없을때  활성화: { editable: false },
        noRecords: {template: '<div class="nodataMsg"><p>' + DASH120M_langMap.get("DASH120M.info.nodata") + '</p></div>'},
        sortable: true,
        scrollable: true,
        autoBind: false,
        selectable: true,
        // editable: 'incell',
        persistSelection: true,
        columns: [
            {width: 30, selectable: true,}, {
                title: DASH120M_langMap.get("DASH120M.status"),
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
            },
            {
                width: "auto", field: "dispCtt", title: DASH120M_langMap.get("DASH120M.slogan"),
                attributes: {"class": "textLeft"}
            },
            {
                width: 110, field: "useTrmStrDd", title: DASH120M_langMap.get("DASH120M.useTrmStrDd"), //시작일
                editor: dateD120M, template: '#=kendo.format("{0:yyyy-MM-dd}",new Date(useTrmStrDd))#',
            },   //   함수 재설정 요~!
            {
                width: 110, field: "useTrmEndDd", title: DASH120M_langMap.get("DASH120M.useTrmEndDd"),// 종료일
                editor: dateD120M, template: '#=kendo.format("{0:yyyy-MM-dd}",new Date(useTrmEndDd))#',
            },   //   함수 재설정 요~!
        ],
    }).data("kendoGrid");

    //  퀵링크 항목
    DASH120M_grid[3].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall("/frme/FRME140SEL01", JSON.stringify(options.data), function (result) {
                    options.success(JSON.parse(result.FRME140P));
                });
            },
            create: function (options) {
                var updateList = options.data.models;
                console.log(updateList);
                var regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprOrgCd: GLOBAL.session.user.orgCd
                }
                $.each(updateList, function (index, item) {
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/dash/DASH120INS04", JSON.stringify({
                    list: updateList
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            update: function (options) {
                var updateList = options.data.models;
                console.log(updateList);
                var regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprOrgCd: GLOBAL.session.user.orgCd
                }

                $.each(updateList, function (index, item) {
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/dash/DASH120INS04", JSON.stringify({
                    list: updateList
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            destroy: function (options) {
                options.success(options.data.models);
            },
        },
        requestStart: function (e) {
            console.log('requestStart');
            var type = e.type;
            var response = e.response;
        },
        requestEnd: function (e) {
            console.log('requestEnd');
            var type = e.type;
            var response = e.response;

            if (type != "read" && type != "destroy") {
                DASH120M_QlnkList();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "qLnkNm",
                fields: {
                    qLnkDvCd: {field: "qLnkDvCd", type: "string"},
                    useYn: {field: "useYn", type: "string"},
                    qLnkNm: {field: "qLnkNm", type: "string"},
                    qLnkAddr: {field: "qLnkAddr", type: "string"},
                }
            }
        }
    });
    DASH120M_grid[3].instance = $("#DASH120M_quickLinkGrid").kendoGrid({
        columns: [
            {width: 30, selectable: true,},
            {
                title: DASH120M_langMap.get("DASH120M.status"),
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
            },
            {
                width: 80, field: "qLnkDvCd", title: DASH120M_langMap.get("DASH120M.qLnkDvCd"),     // 구분
                editor: function (container, options) {
                    DASH120M_createComboInGrid(container, options, DASH120M_grid[3].instance);
                },
                template: function (dataItem) {
                    return Utils.getComCdNm(DASH120M_comCdList, 'C0012', dataItem.qLnkDvCd)
                }
            },
            {
                width: 80, field: "useYn", title: DASH120M_langMap.get("DASH120M.useYn"),
                editor: function (container, options) {
                    DASH120M_createComboInGrid(container, options, DASH120M_grid[3].instance);
                },
                template: function (dataItem) {
                    return Utils.getComCdNm(DASH120M_comCdList, 'C0003', dataItem.useYn)
                }
            },         // Link 명
            {
                width: 150, field: "qLnkNm", title: DASH120M_langMap.get("DASH120M.qLnkNm"),         // Link 명
                attributes: {"class": "textLeft"}
            },
            {
                width: 'auto', field: "qLnkAddr", title: DASH120M_langMap.get("DASH120M.qLnkAddr"),// Link 주소
                attributes: {"class": "textEllipsis"}
            },
            {field: "pltDvCd", hidden: true,},
        ],
        //   data 없을때
        noRecords: {template: '<div class="nodataMsg"><p>' + DASH120M_langMap.get("DASH120M.info.nodata") + '</p></div>'},

        //   data 있을때
        dataSource: DASH120M_grid[3].dataSource,
        dataBound: function () {
            DASH120M_grid_fnOnDataBound(3);
        },
        change: function (e) {
            DASH120M_grid_fnOnChange(e, 3);
        },
        autoBind: false,
        resizable: true,
        selectable: "multiple,row",
        persistSelection: true,
        sortable: false,
    }).data("kendoGrid");

    //    오늘의날씨 항목
    DASH120M_grid[4].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall("/dash/DASH120SEL03", JSON.stringify(options.data), function (result) {
                    options.success(JSON.parse(result.list));
                });
            },
            create: function (options) {
                let updateList = options.data.models;
                let regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprOrgCd: GLOBAL.session.user.orgCd
                }
                $.each(updateList, function (index, item) {
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/dash/DASH120INS02", JSON.stringify({
                    list: updateList
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            update: function (options) {
                let updateList = options.data.models;
                let regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprOrgCd: GLOBAL.session.user.orgCd
                };
                $.each(updateList, function (index, item) {
                    $.extend(item, regInfo);
                });
                Utils.ajaxCall("/dash/DASH120INS02", JSON.stringify({
                    list: updateList
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            destroy: function (options) {
                options.success(options.data.models);
            },
        },
        requestStart: function (e) {
            var type = e.type;
            var response = e.response;
        },
        requestEnd: function (e) {
            var type = e.type;
            var response = e.response;

            if (type != "read" && type != "destroy") {
                DASH120M_ApiList();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "dispCtt",
                fields: {
                    dispCtt: {field: "dispCtt", type: "string"}
                }
            }
        }
    });
    DASH120M_grid[4].instance = $("#DASH120M_weatherGrid").kendoGrid({
        columns: [
            {width: 30, selectable: true,},
            {
                title: DASH120M_langMap.get("DASH120M.status"),
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
            },
            {
                width: "auto", field: "dispCtt", title: DASH120M_langMap.get("DASH120M.api"),// 연결 API
                attributes: {"class": "textLeft cursor pad_left20 heigh50"},
                // template: '<p class="formAlign"><img src="resources/images/contents/logo_kma.png"> <span class="fontBold f14 ma_left5"> #: dispCtt #</span></p>'
                template: function (dataItem) {
                    if (Utils.isNull(dataItem.dispCtt)) {
                        return `<p class="formAlign"><img src=""> <span class="fontBold f14 ma_left5">${dataItem.dispCtt}</span></p>`
                    }
                    return `<p class="formAlign neceMark"><img src="resources/images/contents/logo_kma.png"> <span class="fontBold f14 ma_left5">${dataItem.dispCtt}</span></p>`
                },
            },
        ],
        //   data 없을때
        noRecords: {template: '<div class="nodataMsg"><p>' + DASH120M_langMap.get("DASH120M.info.nodata") + '</p></div>'},

        //   data 있을때
        dataSource: DASH120M_grid[4].dataSource,
        dataBound: function () {
            DASH120M_grid_fnOnDataBound(4);
            let items = this._data;
            let tableRows = $(this.table).find("tr");
            tableRows.each(function (index) {
                let row = $(this);
                let dataItem = items[index];
                if (dataItem.id) {
                    row.addClass("inputError");
                }
            });
        },
        change: function (e) {
            DASH120M_grid_fnOnChange(e, 4);
        },
        edit: function (e) {
            if (e.model.id) {
                Utils.alert("현재는 기상청API만 제공합니다.");
                return this.closeCell();
            }
            if (e.model.isNew() && e.sender.dataSource.data().length === 1) {
                e.model.dispCtt = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst"
                this.closeCell();
                return;
            }
            if (e.sender.dataSource.data().length > 1) {
                Utils.alert("현재는 기상청API만 제공합니다.");
                return e.sender.dataSource.remove(e.model);
            }
        },
        cellClose: function (e) {
            // let dataItem = e.model;
            // if (Utils.isNull(dataItem.dispCtt)) {
            //     Utils.alert("연결 API를 입력해주세요.");
            //     return;
            // }
            // let regex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            // if (!regex.test(dataItem.dispCtt)) {
            //     Utils.alert("URL 입력주소 형식이 잘못되었습니다.");
            //     this.refresh();
            //     dataItem.set("dispCtt", dataItem.id);
            // }
        },
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        sortable: false,
    }).data("kendoGrid");

    DASH120M_grid[6].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                let pltItemCd = options.data.pltItemCd;
                Utils.ajaxCall("/dash/DASH120SEL06", JSON.stringify(options.data), function (result) {
                    let rawData = JSON.parse(result.list);
                    DASH120M_list = JSON.parse(result.list);
                    // if (pltItemCd === 'S05' || pltItemCd === 'B01') {
                    //     DASH120M_list = rawData.reduce(function(acc,cur){
                    //         let filterArr = acc.filter(x=>x.dispCtt === cur.dispCtt)
                    //         if (filterArr.length > 0) {
                    //             filterArr.forEach(x=>$.extend(x,{ctgrMgntNo : ''.concat(x.ctgrMgntNo,',',cur.ctgrMgntNo)}))
                    //         } else {
                    //             acc.push(cur);
                    //         }
                    //         return acc;
                    //     },[])
                    // }
                    options.success(DASH120M_list);
                })
                // Utils.ajaxCall("/cmmt/CMMT100SEL01", JSON.stringify(options.data), function (result) {
                // let category = JSON.parse(result.CMMT100VOGridInfo);
                // let resultArr = category.map(({ ctgrNm: dispCtt, ...rest }) => ({ dispCtt, ...rest }));
                // console.log(resultArr);
                // DAHS120M_list = resultArr;
                // options.success(resultArr);

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

                Utils.ajaxCall("/dash/DASH120INS02", JSON.stringify({
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

                Utils.ajaxCall("/dash/DASH120INS02", JSON.stringify({
                    list: updateList
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            destroy: function (options) {
                options.success(options.data.models);
            },
        },
        requestStart: function (e) {
            var type = e.type;
            var response = e.response;
        },
        requestEnd: function (e) {
            var type = e.type;
            var response = e.response;

            if (type != "read" && type != "destroy") {
                DASH120M_Common();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "dataFrmId",
                fields: {
                    dispCtt: {type: "string"},
                    dataFrmId: {type: "string"},
                }
            }
        }
    });
    DASH120M_grid[6].instance = $("#DASH120M_selectCardGrid").kendoGrid({
        columns: [
            {width: 30, selectable: true,},
            {
                title: DASH120M_langMap.get("DASH120M.status"),
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
            },
            {
                width: "auto", field: "dispCtt", title: DASH120M_langMap.get("DASH120M.displayContents"), attributes: {"class": "textLeft"},
            },
            {
                width: "auto", field: "dataFrmId", title: DASH120M_langMap.get("DASH120M.dataFrmId"), type: "string", editable: function () {
                    return false;
                },
                template: function (dataItem) {
                    if (Utils.isNull(dataItem.dataFrmId)) {
                        return "";
                    }
                    let splitArr = dataItem.dataFrmId.split('/');
                    return splitArr[splitArr.length - 1];
                }
            },
            // {
            //     title: "조회",
            //     width: 80,
            //     template: "<button type='button' class='btnRefer_default icoType icoComp_zoom' onclick='DASH120M_fnOpenPopSYSM251P(this)'></button>"
            // },
            {
                title: DASH120M_langMap.get("button.select"),
                field: "ctgrMgntNo",
                attributes: {"class": "DASH120M_selectCtgr"},
                width: 50,
                template: function (dataItem) {
                    if (['S01','S05','B01'].includes(DASH120M_pltItemCd)) {
                        return dataItem.ctgrMgntNo;
                        // return "<button type='button' class='btnRefer_default DASH120M_fnSelectCategory'>↓</button>";
                    }
                    return "<button type='button' class='btnRefer_default icoType icoComp_zoom' onclick='DASH120M_fnOpenPopSYSM251P(this)'></button>";
                }
            },
            // {field: "ctgrMgntNo", hidden: true},
            {field: "crdId", hidden: true,},
        ],
        noRecords: {template: '<div class="nodataMsg"><p>' + DASH120M_langMap.get("DASH120M.info.nodata") + '</p></div>'},
        dataSource: DASH120M_grid[6].dataSource,
        dataBound: function (e) {
            DASH120M_grid_fnOnDataBound(6);
            $(".DASH120M_fnSelectCategory").click(function (e) {
                console.log(e);
                const getOffset = (e) => {
                    const rect = e.getBoundingClientRect();
                    return {
                        left: rect.left + window.scrollX,
                        top: rect.top + window.scrollY
                    };
                }
                let x = getOffset(e.target).left;
                let y = getOffset(e.target).top;
                x = x - 400
                let selectTr = $(e.target).closest("tr");
                grid.select(selectTr);
                let dataItem = grid.dataItem(selectTr);
                Utils.setCallbackFunction("DASH120M_getCategory", DASH120M_getCategory);
                let dispPsnCd = DASH120M_pltItemCd == 'S05' ? 'S' : 'B';
                let nowCtgr = grid.dataSource.data().map(x => x.ctgrMgntNo).join(',');
                if (DASH120M_pltItemCd == 'S02') {
                    Utils.openKendoWindow("/kmst/KMST220P", 400, 600, "left", Number(x), Number(y), false,
                        {callbackKey: "DASH120M_getCategory", type: 'multi'});
                } else {
                    Utils.openKendoWindow("/cmmt/CMMT301P", 400, 600, "left", Number(x), Number(y), false,
                        {
                            target: 'DASH',
                            callbackKey: "DASH120M_getCategory",
                            dashBrdDispPsnCd: DASH120M_pltItemCd !== 'S01' ? dispPsnCd : DASH120M_pltItemCd,
                            dashBrdDispPmssYn: "Y",
                            categories: nowCtgr,
                        });
                }
            })
        },
        change: function (e) {
            DASH120M_grid_fnOnChange(e, 6);
        },
        edit: function (e) {
            // this.closeCell();
        },
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        sortable: false,
    }).data("kendoGrid");
}

// 데이터카드 불러오기 팝업
function DASH120M_fnOpenPopSYSM251P(obj) {
    let tr = $(obj).closest("tr");
    let dataItem = DASH120M_grid[6].instance.dataItem(tr);
    Utils.setCallbackFunction("DASH120M_fnSYSM251PCallback", function (item) {
        if (item.dataFrmTypCd !== 'C') {
            return Utils.alert(DASH120M_langMap.get("DASH120M.valid.noSelectCard"));
        }
        dataItem.set("url", item.mapgVlu1 + "/" + item.dataFrmId);
        dataItem.set("dataFrmId",  item.dataFrmId);
        dataItem.set("dataFrmePath", item.mapgVlu1);
        dataItem.set("dispCtt", item.dataFrmKornNm);
        DASH120M_grid[6].instance.clearSelection();
        DASH120M_grid[6].instance.select(tr);
        DASH120M_grid[6].instance.refresh();
    });
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM251P", "SYSM251P", 780, 550, {
        setCode: "C",
        callbackKey: "DASH120M_fnSYSM251PCallback"
    });
}

// 오늘의 명언 리스트
function DASH120M_EditorPreJob(_obj, _index) {
    let index = _index;

    if (Utils.isNull(index)) {
        DASH120M_pltNoCount(DASH120M_editorPltItemNo);
        index = DASH120M_editorPltItemNo;
    }
    let today = new Date();
    let data = {
        actYn: Utils.isNotNull(_obj) ? _obj.actYn : "N",
        dispCtt: "",
        pltItemNo: index,
        UseTrmStrDd: kendo.toString(new Date(), "yyyy-MM-dd"),
        UseTrmEndDd: kendo.toString(DASh120M_getUseTrmEndDay(1), "yyyy-MM-dd"),
        bgColrCd: "#FFF",
        fileNmIdx: null
    }
    if (Utils.isNotNull(_obj)) {
        data = _obj;
    }

    if (Utils.isNull(data.fileNm)) {
        data.fileNm = ""
    }
    let editorHtml = createMiniEditor(data, index);
    $("#DASH120M_phraseEditor").append(editorHtml);

    let checkbox = 'editorCheckBox' + index;
    if (Utils.isNotNull(_obj)) {
        _obj.actYn == 'Y' ? $("#" + checkbox).prop('checked', true) : $("#" + checkbox).prop('checked', false);
    }

    $("#DAHS120M_editorDemo_" + index).kendoEditor({
        tools: [
            {
                name: "fontName",
                items: [
                    {text: DASH120M_langMap.get("DASH120M.fontName1"), value: "굴림"},
                    {text: DASH120M_langMap.get("DASH120M.fontName2"), value: "돋움"},
                    {text: DASH120M_langMap.get("DASH120M.fontName3"), value: "명조"},
                    {text: DASH120M_langMap.get("DASH120M.fontName4"), value: "바탕"},
                    {text: DASH120M_langMap.get("DASH120M.fontName5"), value: "나눔고딕"},
                    {text: DASH120M_langMap.get("DASH120M.fontName6"), value: "맑은고딕"},
                ]
            },
            // "fontSize",
            {
                name: "fontSize",
                items: [
                    { text: "10px", value: "10px" },
                    { text: "12px", value: "12px" },
                    { text: "14px", value: "14px" },
                    { text: "16px", value: "16px" },
                    { text: "20px", value: "20px" },
                    { text: "24px", value: "24px" },
                    { text: "30px", value: "30px" }
            ]
            },
            {
                name: "foreColor", palette: "basic", columns: 10
            },
            {
                name: "background",
                template: "<input id='bgPicker" + index + "' name='bgPicker'/>"
            },
        ],
        placeholder: DASH120M_langMap.get("DASH120M.editoradd"),
        stylesheets: ["./resources/css/aicrm/editorStyle.css"],
    });

    $("#DASH120M_termStart_" + index).kendoDatePicker({
        format: "yyyy-MM-dd",
        footer: false,
        culture: "ko-KR",
        change:function (e) {
            console.log(e);
        }
    });

    $("#DASH120M_termEnd_" + index).kendoDatePicker({
        format: "yyyy-MM-dd",
        footer: false,
        culture: "ko-KR",
        change:function (e) {
            console.log(e);
        }
    });

    $("#bgPicker" + index).kendoColorPicker({
        value: data.bgColrCd,
        messages: {
            apply: "적용",
            cancel: "취소"
        },
        // input: false,
        // preview: false,
        // buttons: false,
        views: ["gradient"],
        select: function (e) {
            this.element.closest("article").find(".k-iframe").css("background-color", e.value);
        },
    });

//    미니 에디터 Tab
    $('#DASH120M_phraseEditor > article').each(function (idx, item) {
        let pltItemNo = idx + 1
        $(item).find('>.tab li').on('click', function () {
            let tabIndex = $(this).index();
            $(this).parent().find('li').removeClass('selected');
            $(this).addClass('selected');
            $(this).parent().siblings('.miniEditor').hide();
            $(this).parent().siblings('.miniEditor').eq(tabIndex).show();
        });
    });
    $("#DASH120M_article" + index).find(".k-iframe").css("background-color", data.bgColrCd);
    if (Utils.isNotNull(data.fileNmIdx)) {
        $("#DASH120M_editorTab" + index).find('li')[1].click();
    }
}

// 오늘의 명언 순번
function DASH120M_pltNoCount() {
    if (DASH120M_pltItemCd === "T02") ++DASH120M_editorPltItemNo;
    if (DASH120M_pltItemCd === "T05") ++DASH120M_themePltItemNo;
}

function DASH120M_dateValid(tempObj, isValid) {
    let {useTrmStrDd, useTrmEndDd} = tempObj;
    const regDate = /(^(19|20)\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!regDate.test(useTrmStrDd) || !regDate.test(useTrmEndDd)) {
        Utils.alert('올바른 날짜 형식이 아닙니다.')
        isValid = false;
        return isValid;
    }
    if (new Date(useTrmStrDd) > new Date(useTrmEndDd)) {
        Utils.alert('시작일과 종료일을 다시 설정해주세요.')
        isValid = false;
        return isValid;
    }
    return isValid;
}

// 오늘의 명언 저장
function DASH20M_EditorSave() {
    let checkedResult = $(".DASH120M_article").find("input[name=editorCheckBox]:checked").length;
    let DASH120M_formData = new FormData();

    if (checkedResult === 0) {
        $("#DASH120M_validMsg").val(DASH120M_langMap.get("DASH120M.valid.noSelectSavePhrase"));// 저장 할 오늘의 명언을 선택해주세요.
        return;
    }
    Utils.confirm(DASH120M_langMap.get("common.save.msg"), function () {
        let isValid = true;
        $(".DASH120M_article").each(function (idx, item) {
            let tempObj = {};
            let dataSet = $(item).data();
            let editorChecked = $(item).find("input[name=editorCheckBox]").is(":checked");
            tempObj.actYn = editorChecked === true ? 'Y' : 'N';
            tempObj.tenantId = GLOBAL.session.user.tenantId;
            tempObj.pltDvCd = dataSet.pltDvCd;
            tempObj.pltItemCd = DASH120M_pltItemCd;
            tempObj.pltItemNo = dataSet.pltItemNo;
            tempObj.regrId = GLOBAL.session.user.usrId;
            tempObj.regrOrgCd = GLOBAL.session.user.orgCd;
            tempObj.lstCorprId = GLOBAL.session.user.usrId;
            tempObj.lstCorcOrgCd = GLOBAL.session.user.orgCd;
            tempObj.useTrmStrDd = $(item).find("input[name=termStart]").val();
            tempObj.useTrmEndDd = $(item).find("input[name=termEnd]").val();
            tempObj.useTrmStrDd.replace("-","").replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
            tempObj.useTrmEndDd.replace("-","").replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
            isValid = DASH120M_dateValid(tempObj, isValid);
            let editorTarget = $(item).find("li.selected").attr('class');
            if (editorTarget.includes('Img')) {
                // if (Utils.isNull($(item).find("input[name=phraseInput]").attr('value'))) {
                if (Utils.isNull($("#DASH120M_phraseImg" + dataSet.pltItemNo).attr('src'))) {
                    Utils.alert('이미지를 첨부해주세요.')
                    $("#DASH120M_phraseInput" + idx).click();
                    isValid = false;
                } else {
                    if ($(item).find("input[name=phraseInput]")[0].files.length > 0) {
                        tempObj.pltItemImg = $(item).find("input[name=phraseInput]")[0].files[0];
                    }
                    tempObj.dispCtt = "";
                    tempObj.bgColrCd = "#FFFFFF"
                    tempObj.imgExist = "Y"
                }
            } else {
                tempObj.dispCtt = $(`#DAHS120M_editorDemo_${tempObj.pltItemNo}`).data("kendoEditor").value();
                if (Utils.isNull(tempObj.dispCtt)) {
                    tempObj.bgColrCd = $(item).find("input[name=bgPicker]").val();
                    Utils.alert('내용을 입력해주세요.')
                    isValid = false;
                } else {
                    tempObj.bgColrCd = $(item).find("input[name=bgPicker]").val();
                    tempObj.imgExist = "N"
                }
            }
            if (!isValid) {
                return isValid;
            }
            console.log(tempObj);
            Object.keys(tempObj).forEach((key) =>
                DASH120M_formData.append(`DASH120VOlist[${idx}].${[key]}`, tempObj[key]));
        });
        if (isValid) {
            Utils.ajaxCallFormData("/dash/DASH120INS03", DASH120M_formData, function (result) {
                Utils.alert(result.msg);
                console.log($('#DASH120M_Add').data('pltItemCd'));
                $('#DASH120M_Add').data('pltItemCd','T02');
                DASH120M_fnShowPhase();
            });
        }
    });
}

// 오늘의 명언 삭제
function DASH20M_EditorDelete() {
    let article = $(".DASH120M_article");
    let checkedResult = article.find("input[name=editorCheckBox]:checked").length;
    let resultArr = [];

    if (checkedResult == 0) {
        $("#DASH120M_validMsg").val(DASH120M_langMap.get("DASH120M.valid.noSelectDelPhrase"))//삭제 할 오늘의 명언을 선택해주세요.
        return;
    }
    Utils.confirm(DASH120M_langMap.get("common.delete.msg"), function () {

        $(".DASH120M_article").each(function () {
            let obj = {};
            let dataSet = $(this).data();
            obj.editorChecked = $(this).find("input[name=editorCheckBox]").is(":checked");
            if (obj.editorChecked === true) {
                obj.pltDvCd = dataSet.pltDvCd
                obj.pltItemNo = dataSet.pltItemNo
                obj.fileName = $(this).find("input[name=phraseInput]").val();
                obj.fileNm = obj.fileName.split('/').pop().split('\\').pop();
                obj.tenantId = GLOBAL.session.user.tenantId;
                obj.pltItemCd = DASH120M_pltItemCd;
                resultArr.push(obj)
            }
        });
        Utils.ajaxCall("/dash/DASH120DEL03", JSON.stringify({list: resultArr}), function (result) {
            Utils.alert(DASH120M_langMap.get("success.common.delete"))
            DASH120M_Editor();
        });
    });
}

// 테마 이미지 리스트
function DASH120M_themeImagePreJob(_obj, _index) {

    let index = _index;

    if (Utils.isNull(index)) {
        DASH120M_pltNoCount(DASH120M_themePltItemNo);
        index = DASH120M_themePltItemNo;
    }
    let data = {
        actYn: Utils.isNotNull(_obj) ? _obj.actYn : "N",
        pltItemNo: index,
        UseTrmStrDd: kendo.toString(new Date(), "yyyy-MM-dd"),
        UseTrmEndDd: kendo.toString(DASh120M_getUseTrmEndDay(1), "yyyy-MM-dd"),
        fileNmIdx: null
    }
    if (Utils.isNotNull(_obj)) {
        data = _obj;
    }

    if (Utils.isNull(data.fileNm)) {
        data.fileNm = ""
    }
    let themeHtml = createThemeImgLoader(data, index);
    $("#DASH120M_themeImage").append(themeHtml);

    let checkbox = 'themeCheckBox' + index;
    if (Utils.isNotNull(_obj)) {
        _obj.actYn == 'Y' ? $("#" + checkbox).prop('checked', true) : $("#" + checkbox).prop('checked', false);
    }

    $("#DASH120M_themeTermStart_" + index).kendoDatePicker({
        format: "yyyy-MM-dd",
        footer: false,
        culture: "ko-KR"
    });

    $("#DASH120M_themeTermEnd_" + index).kendoDatePicker({
        format: "yyyy-MM-dd",
        footer: false,
        culture: "ko-KR"
    });
}

// 테마이미지 저장
function DASH20M_themeImageSave() {
    let checkedResult = $(".DASH120M_theme").find("input[name=themeCheckBox]:checked").length;
    let DASH120M_formData = new FormData();

    if (checkedResult === 0) {
        $("#DASH120M_validMsg").val(DASH120M_langMap.get("DASH120M.valid.noSelectSaveTheme"));// 저장 할 테마이미지를 선택해주세요.
        return;
    }
    Utils.confirm(DASH120M_langMap.get("common.save.msg"), function () {
        let isValid = true;
        $(".DASH120M_theme").each(function (idx, item) {
            let tempObj = {};
            let dataSet = $(item).data();
            let themeImgChecked = $(item).find("input[name=themeCheckBox]").is(":checked");
            tempObj.checkPath = 'T';
            tempObj.actYn = themeImgChecked === true ? 'Y' : 'N';
            tempObj.tenantId = GLOBAL.session.user.tenantId;
            tempObj.pltDvCd = dataSet.pltDvCd;
            tempObj.pltItemCd = DASH120M_pltItemCd;
            tempObj.pltItemNo = dataSet.pltItemNo;
            tempObj.regrId = GLOBAL.session.user.usrId;
            tempObj.regrOrgCd = GLOBAL.session.user.orgCd;
            tempObj.lstCorprId = GLOBAL.session.user.usrId;
            tempObj.lstCorcOrgCd = GLOBAL.session.user.orgCd;
            tempObj.useTrmStrDd = $(item).find("input[name=termStart]").val();
            tempObj.useTrmEndDd = $(item).find("input[name=termEnd]").val();
            isValid = DASH120M_dateValid(tempObj, isValid);
            // if (Utils.isNull($(item).find("input[name=themeInput]").attr('value'))) {
            if (Utils.isNull($("#DASH120M_themeImg" + dataSet.pltItemNo).attr('src'))) {
                Utils.alert(DASH120M_langMap.get("DASH120M.addImg"));
                $("#DASH120M_themeInput" + idx).click();
                isValid = false;
            } else {
                if ($(item).find("input[name=themeInput]")[0].files.length > 0) {
                    tempObj.pltItemImg = $(item).find("input[name=themeInput]")[0].files[0];
                }
                tempObj.imgExist = "Y"
            }
            if (!isValid) {
                return isValid;
            }
            console.log(tempObj);
            Object.keys(tempObj).forEach((key) =>
                DASH120M_formData.append(`DASH120VOlist[${idx}].${[key]}`, tempObj[key]));
        });
        if (isValid) {
            Utils.ajaxCallFormData("/dash/DASH120INS03", DASH120M_formData, function (result) {
                Utils.alert(result.msg);
                DASH120M_fnShowThemeImg();
            });
        }
    });
}

//테마이미지 삭제
function DASH20M_themeImageDelete() {
    let article = $(".DASH120M_theme");
    let checkedResult = article.find("input[name=themeCheckBox]:checked").length;
    let resultArr = [];

    if (checkedResult === 0) {
        $("#DASH120M_validMsg").val(DASH120M_langMap.get("DASH120M.valid.noSelectDelTheme"));
        return;
    }
    Utils.confirm(DASH120M_langMap.get("common.delete.msg"), function () {

        $(".DASH120M_theme").each(function () {
            let obj = {};
            let dataSet = $(this).data();
            obj.editorChecked = $(this).find("input[name=themeCheckBox]").is(":checked");
            if (obj.editorChecked === true) {
                obj.pltDvCd = dataSet.pltDvCd
                obj.pltItemNo = dataSet.pltItemNo
                obj.fileName = $(this).find("input[name=themeInput]").val();
                obj.fileNm = obj.fileName.split('/').pop().split('\\').pop();
                obj.tenantId = GLOBAL.session.user.tenantId;
                obj.pltItemCd = DASH120M_pltItemCd;
                resultArr.push(obj)
            }
        });
        Utils.ajaxCall("/dash/DASH120DEL03", JSON.stringify({list: resultArr}), function (result) {
            Utils.alert(DASH120M_langMap.get("success.common.delete"))
            // $("#DASH120M_themeImage").load(location.href + " #DASH120M_phraseEditor");
            DASH120M_fnSearchThemeImage();
        });
    });
}

// 첨부파일 선택시
function uploadImg(target) {
    let selector = `#DASH120M_${target.name}Input${target.value}`
    $(selector).click();
}

// 오늘의명언 OR 테마이미지 selector 가져오기
function getImgSelector(idx) {
    let selectObj = {
        T02: {
            img: "DASH120M_phraseImg",
            figcap: "DASH120M_phraseFigcap",
            input: "DASH120M_phraseInput",
        },
        T05: {
            img: "DASH120M_themeImg",
            figcap: "DASH120M_themeFigcap",
            input: "DASH120M_themeInput",
        }
    }
    const imgSelector = ''.concat("#", selectObj[DASH120M_pltItemCd].img, idx);
    const figcapSelector = ''.concat("#", selectObj[DASH120M_pltItemCd].figcap, idx);
    const inputSelector = ''.concat("#", selectObj[DASH120M_pltItemCd].input, idx);
    return {imgSelector, figcapSelector, inputSelector}
}

// 에티터에 이미지 보여주기
function readURL(target) {
    let index = target.id.split("Input")[1];
    const {imgSelector, figcapSelector} = getImgSelector(index);
    if (target.files && target.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            $(imgSelector)[0].src = e.target.result;
            $(imgSelector).css("display", 'block')
            $(figcapSelector).css("display", 'none')
        }
        reader.readAsDataURL(target.files[0]);
    } else {
        $(imgSelector)[0].src = "";
        $(imgSelector).css("display", 'none')
        $(figcapSelector).css("display", 'block')
    }
}

// 이미지 초기화
function fileDelete(id) {
    let index = id.slice(-1);
    const {imgSelector, figcapSelector, inputSelector} = getImgSelector(index);

    $(imgSelector)[0].src = "";
    $(imgSelector).css("display", 'none')
    $(figcapSelector).css("display", 'block')
    $(inputSelector).val("");
}

// 텍스트 초기화
function editorDelete(id) {
    let index = id.slice(-1);
    $('#DAHS120M_editorDemo_' + index).val("");
    $("#DAHS120M_editorDemo_" + index).data("kendoEditor").value("");
    $("#bgPicker" + index).data("kendoColorPicker").value("FFF");
    $("#DASH120M_article" + index).find(".k-iframe").css("background-color", "#FFF");

}

// 오늘의명언 에디터 생성
function createMiniEditor(obj, idx) {
    let imgHtml;
    if (Utils.isNull(obj.fileNmIdx)) {
        imgHtml = `<img id='DASH120M_phraseImg${idx}' src='' alt=''  style='width: 100%;height: 160px;display: none;object-fit: contain;' />`
        imgHtml += `<figcaption id='DASH120M_phraseFigcap${idx}'><span class='k-icon k-i-image'></span>${DASH120M_langMap.get("DASH120M.addImg")}</figcaption>`
    } else {
        imgHtml = `<img id='DASH120M_phraseImg${idx}' src='/bcs/dashphoto/${obj.tenantId}/${obj.fileNmIdx}' alt='' style='width: 100%;height: 160px;display: block;object-fit: contain;'/>`
        imgHtml += `<figcaption id='DASH120M_phraseFigcap${idx}' style='display: none;'><span class='k-icon k-i-image'></span>${DASH120M_langMap.get("DASH120M.addImg")}</figcaption>`
    }
    obj.pltDvCd = Utils.isNull(obj.pltDvCd) ? DASH120M_grid[1].currentItem.pltDvCd : obj.pltDvCd;
    return `
    <article class='DASH120M_article' id='DASH120M_article${idx}' 
        data-plt-dv-cd="${obj.pltDvCd}" data-plt-item-no="${obj.pltItemNo}">
        <span class='subject'>
            <input id='editorCheckBox${idx}' type='checkbox' name='editorCheckBox'>
            <label for='editorCheckBox${idx}'></label>
        </span>
        <ul class='tab' id='DASH120M_editorTab${idx}'>
            <li class='editorText selected'>텍스트</li>
            <li class='editorImg'>이미지</li>
        </ul>
        <div class='miniEditor Text' id='miniEditor${idx}' style='display: block;'>
            <textarea class='editorDemo' id='DAHS120M_editorDemo_${idx}'>${obj.dispCtt}</textarea>
            <menu class='btnArea_right'>
                <button class='btnRefer_default icoType k-icon k-i-delete' id='editorDelete${idx}' onclick='editorDelete(this.id)' title='삭제'></button>
            </menu>
        </div>
        <div class='miniEditor' style='display: none;'>
            <figure>
                ${imgHtml}
            </figure>
            <p class='btnArea_right'>
                <input  type='file' name='phraseInput' id='DASH120M_phraseInput${idx}' onchange='readURL(this);' accept='image/*' value='${obj.fileNm}' style='display:none;'  multiple="multiple">
                <button class='btnRefer_default icoType k-icon k-i-clip-45' name='phrase' onclick='uploadImg(this)' title='첨부' value='${idx}'></button>
                <button class='btnRefer_default icoType k-icon k-i-delete' id='fileDelete${idx}' onclick='fileDelete(this.id)' title='삭제'></button>
            </p>
        </div>
        <p class='term'>
            <span class='label_tit'>노출기간</span>
            <input name='termStart' id='DASH120M_termStart_${idx}' value=${obj.UseTrmStrDd} />
            <span class='split'>~</span>
            <input name='termEnd' id='DASH120M_termEnd_${idx}' value=${obj.UseTrmEndDd} />
        </p>
       </article>`
}

// 테마이미지 에디터 생성
function createThemeImgLoader(obj, idx) {
    let imgHtml;
    if (Utils.isNull(obj.fileNmIdx)) {
        imgHtml = `<img id='DASH120M_themeImg${idx}' src='' alt=''  style='width: 100%;height: auto;display: none;object-fit: contain;' />`
        imgHtml += `<figcaption id='DASH120M_themeFigcap${idx}'><span class='k-icon k-i-image'></span> ${DASH120M_langMap.get("DASH120M.addImg")}</figcaption>`
    } else {
        imgHtml = `<img id='DASH120M_themeImg${idx}' src='/bcs/dashimg/${obj.tenantId}/${obj.fileNmIdx}' alt='' style='width: 100%;height: auto;display: block;object-fit: contain;'/>`
        imgHtml += `<figcaption id='DASH120M_themeFigcap${idx}' style='display: none;'><span class='k-icon k-i-image'></span>${DASH120M_langMap.get("DASH120M.addImg")}</figcaption>`
    }
    obj.pltDvCd = Utils.isNull(obj.pltDvCd) ? DASH120M_grid[1].currentItem.pltDvCd : obj.pltDvCd;
    return `
    <article class='DASH120M_theme' id='DASH120M_theme${idx}' style='width: 100%;height: 50%;' 
    data-plt-dv-cd="${obj.pltDvCd}" data-plt-item-no="${obj.pltItemNo}">
        <span class='subject'>
            <input id='themeCheckBox${idx}' type='checkbox' name='themeCheckBox'>
            <label for='themeCheckBox${idx}'></label>
        </span>
        <div class='miniEditor' style="height: 100%">
            <figure style="height: 100%">
                ${imgHtml}
            </figure>
            <p class='btnArea_right'>
                <input  type='file' name='themeInput' id='DASH120M_themeInput${idx}' onchange='readURL(this);' accept='image/*' value='${obj.fileNm}' style='display:none;'  multiple="multiple">
                <button class='btnRefer_default icoType k-icon k-i-clip-45' name='theme' onclick='uploadImg(this)' title='첨부' value='${idx}'></button>
                <button class='btnRefer_default icoType k-icon k-i-delete' id='fileDelete${idx}' onclick='fileDelete(this.id)' title='삭제'></button>
            </p>
        </div>
        <p class='term'>
            <span class='label_tit'>노출기간</span>
            <input name='termStart' id='DASH120M_themeTermStart_${idx}' value=${obj.UseTrmStrDd} />
            <span class='split'>~</span>
            <input name='termEnd' id='DASH120M_themeTermEnd_${idx}' value=${obj.UseTrmEndDd} />
        </p>
       </article>`
}

// [쪽지,지식,게시판,커뮤니티] 카테고리 번호 받아오기
function DASH120M_getCategory(items) {
    let grid = DASH120M_grid[6];
    let dataSource = grid.dataSource.data();
    let beforeCtgrNo = dataSource.map(x => x.ctgrMgntNo);
    let selectedCtgrNo = items.map(x => x.id);
    let deleteCtgrNo = beforeCtgrNo.filter(x => !selectedCtgrNo.includes(x));
    if (deleteCtgrNo.length > 0) {
        let deleteItems = [];
        deleteCtgrNo.forEach(function (val) {
            let deleteItem = dataSource.find(x => x.ctgrMgntNo === val);
            grid.dataSource.remove(deleteItem);
            deleteItems.push(deleteItem);
        });
        Utils.ajaxCall("/dash/DASH120DEL01", JSON.stringify({list: deleteItems}), function (result) {

        });
    }
    ;
    let regInfo = {
        tenantId: GLOBAL.session.user.tenantId,
        pltDvCd: DASH120M_grid[0].currentItem.pltDvCd,
        pltItemCd: DASH120M_pltItemCd,
        actYn: "Y",
        regrId: GLOBAL.session.user.usrId,
        regrOrgCd: GLOBAL.session.user.orgCd,
        lstCorprId: GLOBAL.session.user.usrId,
        lstCorcOrgCd: GLOBAL.session.user.orgCd
    };
    for (const item of items) {
        let {id, ctgrNm} = item;
        if (beforeCtgrNo.includes(id)) {
            continue;
        }
        let obj = {
            ctgrMgntNo: Number(id),
            pltItemNo: Number(id),
            dispCtt: ctgrNm.trim(),
        }
        grid.instance.dataSource.add($.extend(regInfo, obj)).set("dirtyFields", {dataFrmId: true});
        grid.instance.clearSelection();
        grid.instance.select("tr:last");
        grid.instance.refresh();
    }
    dataSource.forEach(dataItem => {
        if (Utils.isNull(dataItem.dataFrmId)) {
            dataItem.set('dataFrmePath', '/dash');
            switch (DASH120M_pltItemCd) {
                case 'S01':
                    dataItem.set('dataFrmId', 'CARD001S');
                    break;
                case 'B01':
                    dataItem.set('dataFrmId', 'CARD010S');
                    break;
                default:
                    dataItem.set('dataFrmId', 'CARD009S');
                    break;
            }
        }
    });
}



// function DASH120M_fnSelectCategory(e) {
// console.log(e);
// const getOffset = (e) => {
//     const rect = e.getBoundingClientRect();
//     return {
//         left: rect.left + window.scrollX,
//         top: rect.top + window.scrollY
//     };
// }
// let x = getOffset(e.target).left;
// let y = getOffset(e.target).top;
// let selectTr = $(item).closest("tr");
// DASH120M_grid[6].instance.select(selectTr);
// Utils.setCallbackFunction("DASH120M_getCategory", DASH120M_getCategory)
// let dispPsnCd = DASH120M_pltItemCd == 'S05' ? 'S' : 'B';
// if (DASH120M_pltItemCd == 'S02') {
//     Utils.openKendoWindow("/kmst/KMST220P", 400, 600, "left",  Number(x),Number(y), false,
//         {callbackKey: "DASH120M_getCategory"});
// } else {
//     Utils.openKendoWindow("/cmmt/CMMT301P", 400, 600, "left",  Number(x),Number(y), false,
//         {
//             target: 'DASH',
//             callbackKey: "DASH120M_getCategory",
//             dashBrdDispPsnCd: DASH120M_pltItemCd !== 'S01' ? dispPsnCd : DASH120M_pltItemCd,
//             dashBrdDispPmssYn: "Y",
//             categories : DASH120M_grid[6].currentItem.ctgrMgntNo,
//         });
// }
// }

// let cell_1 = DAHS120_selectTr.find("td:eq(2)");
// cell_1.addClass('k-dirty-cell');
// cell_1.append("<span class='k-dirty'></span>");

// $('#DASH120M_preview').kendoPanelBar({
//     dataSource: [{text: '게시판', contentUrl: GLOBAL.contextPath + '/dash/DASH100M_body3.jsp', pltItemCd: 'S04'}],
//     expandMode: 'single',
//     dataBound: function () {
//         this.element.find('.k-item').append('<button class="k-icon k-i-reload bt" onclick="DASH100M_SideInit()" title="새로고침"></button>');
//     },
//     select: function (e) {
//         if ($(e.item).is(".k-state-active")) {
//             let target = this;
//             window.setTimeout(function () {
//                 target.collapse(e.item);
//             }, 1);
//         }
//     },
//     height:600,
//     change: function (e) {
//         console.log(e.item);
//         console.log($(this));
//     },
// }).data("kendoPanelBar")