/***********************************************************************************************
 * Program Name : DataFrame 관리(SYSM300M.js)
 * Creator      : jrlee
 * Create Date  : 2022.07.15
 * Description  : DataFrame 관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.07.15     jrlee           최초작성
 ************************************************************************************************/
var SYSM300M_comCdList = [];
var SYSM300M_grid = new Array(2);


$(document).ready(function () {
    for (let i = 0; i < SYSM300M_grid.length; i++) {
        SYSM300M_grid[i] = {
            record: 0,
            instance: {},
            dataSource: {},
            currentItem: {},
            currentCellIndex: Number(),
            selectedItems: [],
            checkedRows: [],
            loadCount: 0
        }
    }

    Utils.resizeLabelWidth();

    $("#SYSM300M_srchText").on("keyup", function (e) {
        if (e.keyCode == 13) {
            SYSM300M_fnSearch();
        }
    });

    SYSM300M_grid[0].instance = $("#SYSM300M_grid0").kendoGrid({
        dataSource:{
            transport: {
                read: function (options) {
                    let param = {
                        tenantId: $("#SYSM300M_tenantId").val(),
                        dataFrmeClasCd: $("#SYSM300M_dataFrmeClasCd").val(),
                        srchList: $("#SYSM300M_dataFrmTypCd").data("kendoMultiSelect").value(),
                        srchText: $("#SYSM300M_srchText").val(),
                        srchCond: $("#SYSM300M_srchCond").val()
                    };
                    $.extend(param, options.data);

                    Utils.ajaxCall("/sysm/SYSM300SEL01", JSON.stringify(param), function (result) {
                        options.success(JSON.parse(result.list));
                    });
                },
                create: function (options) {
                    Utils.ajaxCall("/sysm/SYSM300INS01", JSON.stringify({
                        list: options.data.models
                    }), function (result) {
                        options.success(options.data.models);
                    });
                },
                update: function (options) {
                	var dataFrmeTmplCdFlg = false;
                	for(var i = 0; i < options.data.models.length; i++) {
                		if ( options.data.models[i].dataFrmeTmplCd != options.data.models[i].dataFrmeTmplCdOld ) {
                			dataFrmeTmplCdFlg = true;
                			options.data.models[i]['dataFrmeTmplCdFlg'] = 'Y';
                    	}else {
                    		options.data.models[i]['dataFrmeTmplCdFlg'] = 'N';
                    	}
                	}

                	let updateList = options.data.models;
                    let regInfo = {
                        lstCorprId: GLOBAL.session.user.usrId,
                        lstCorprOrgCd: GLOBAL.session.user.orgCd,
                        regrId: GLOBAL.session.user.usrId,
                        regrOrgCd: GLOBAL.session.user.orgCd
                    }
                    $.each(updateList, function (index, item) {
                        $.extend(item, regInfo);
                    });

                	if ( dataFrmeTmplCdFlg ) {
                		Utils.confirm('템플릿 변경시 기존 설정은 초기화됩니다. 변경하시겠습니까?',
        				function(){
                			Utils.ajaxCall("/sysm/SYSM300UPT01", JSON.stringify({
                                list: updateList
                            }), function (result) {
                                options.success(updateList);
                            });
                		},
                		function(){
                			options.success(updateList);
                		},
                		);
                	}else {
                		Utils.ajaxCall("/sysm/SYSM300UPT01", JSON.stringify({
                            list: updateList
                        }), function (result) {
                            options.success(updateList);
                        });
                	}
                },
                destroy: function (options) {
                    options.success(options.data.models);
                },
            },
            requestStart: function (e) {
                let type = e.type;
                let response = e.response;
            },
            requestEnd: function (e) {
                let type = e.type;
                let response = e.response;

                if (type != "read" && type != "destroy") {
                    SYSM300M_fnSearch();
                }
            },
            // pageSize: 25,
            batch: true,
            schema: {
                type: "json",
                model: {
                    id: "id",
                    fields: {
                        dataFrmeClasCd: {type: "string"},
                        pkgClasCd: {type: "string"},
                        dataFrmTypCd: {type: "string"},
                        dataFrmeCrdTypCd: {type: "string"},
                        dataFrmId: {type: "string"},
                        dataFrmKornNm: {type: "string"},
                        dataFrmeTmplCd: {type: "string"},
                        dataFrmeTmplCdOld: {type: "string"},
                        lyotApclDvCd: {type: "string"},
                    }
                }
            }
        },
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        sortable: false,
        resizable: true,
        noRecords: {
            template: "<div class='nodataMsg'><p>조회된 내역이 없습니다.</p></div>"
        },
        dataBound: function (e) {
            SYSM300M_grid_fnOnDataBound(e, 0);
        },
        change: function (e) {
            SYSM300M_grid_fnOnChange(e, 0);
        },
        cellClose: function (e) {
            let grid = e.sender;
            let dataItem = e.model;

            if (dataItem.id != dataItem.dataFrmId) {
                // 그리드 체크
                let totalList = SYSM300M_grid[0].instance.dataSource.data();
                let filterList = totalList.filter(function (item) {
                    return (item.id != dataItem.id && item.dataFrmId == dataItem.dataFrmId)
                });

                if (filterList.length > 0) {
                    Utils.alert("입력한 ID와 동일한 ID가 존재합니다.");
                    dataItem.set("dataFrmId", dataItem.id);
                    grid.refresh();
                    return false;
                }

                // 서버체크
                let param = {
                    dataFrmId: dataItem.dataFrmId,
                    tenantId: dataItem.tenantId
                }

                Utils.ajaxCall("/sysm/SYSM300SEL01", JSON.stringify(param), function (result) {
                    let list = JSON.parse(result.list);

                    if (list.length > 0) {
                        Utils.alert("입력한 ID와 동일한 ID가 존재합니다.");
                        dataItem.set("dataFrmId", dataItem.id);
                        grid.refresh();
                        return false;
                    }
                });
            }
        },
        columns: [
            {
                selectable: true,
                width: 30,
            },
            {
                title: "상태",
                type: "string",
                width: 30,
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
                field: "dataFrmeClasCd",
                title: "프레임분류",
                type: "string",
                width: 100,
                attributes: {"class": "k-text-left"},
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM300M_comCdList, 'C0018', $.trim(dataItem.dataFrmeClasCd));
                },
                editor: function (container, options) {
                    SYSM300M_grid_fnComboEditor(container, options, 0, "C0018", "선택");
                },
            },
            {
                field: "pkgClasCd",
                title: "패키지분류",
                type: "string",
                width: 80,
                attributes: {"class": "k-text-left"},
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM300M_comCdList, 'C0196', $.trim(dataItem.pkgClasCd));
                },
                editor: function (container, options) {
                    SYSM300M_grid_fnComboEditor(container, options, 0, "C0196", "선택");
                },
            },
            {
                field: "dataFrmTypCd",
                title: "유형",
                type: "string",
                width: 60,
                attributes: {"class": "k-text-left"},
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM300M_comCdList, 'C0197', $.trim(dataItem.dataFrmTypCd));
                },
                editor: function (container, options) {
                    SYSM300M_grid_fnComboEditor(container, options, 0, "C0197", "선택");
                },
            },
            {
                field: "dataFrmeCrdTypCd",
                title: "데이터카드유형",
                type: "string",
                width: 60,
                template: function (dataItem) {
                	if (dataItem.dataFrmTypCd == "C") {
                		return Utils.getComCdNm(SYSM300M_comCdList, 'C0299', $.trim(dataItem.dataFrmeCrdTypCd));
                    } else {
                        return "";
                    }
                },
                editor: function (container, options) {
                	if (options.model.dataFrmTypCd == "C") {
                		SYSM300M_grid_fnComboEditor(container, options, 0, "C0299", "선택");
                    } else {
                        return "";
                    }
                },
            },
            {
                field: "dataFrmId",
                title: "데이터프레임ID",
                type: "string",
                width: 70,
                editable: function (dataItem) {
                    if (dataItem.isNew()) {
                        return true;
                    }else {
                        return false;
                    }
                }
            },
            {
                field: "dataFrmKornNm",
                title: "데이터프레임명",
                type: "string",
                width: 110,
                attributes: {"class": "textEllipsis"}
            },
            {
                headerAttributes: {"colspan": 3},
                attributes: {"class": "bdNoneRight"},
                field: "dataFrmeTmplCd",
                title: "템플릿",
                width: 100,
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM300M_comCdList, 'C0198', $.trim(dataItem.dataFrmeTmplCd));
                },
                // editor: function (container, options) {
                //     $('<span class="searchTextBox" style="width: 100%;"><input type="search" class="k-input" name="' + options.field + '"></span>').appendTo(container);
                // },
                editable: function (dataItem) {
                    return false;
                }
            },
            {
                headerAttributes: {"class": "displayNon"},
                width: 15,
                template: function (dataItem) {
                    if (dataItem.dataFrmTypCd == "M" || dataItem.dataFrmTypCd == "P" || dataItem.dataFrmTypCd == "T" || dataItem.dataFrmTypCd == "S") {
                        return '<button class="btnRefer_default icoType icoComp_zoom" title="검색" onclick="SYSM300M_fnSearchTemplate(this)"></button>';
                    } else {
                        return "";
                    }
                },
            },
            {
                headerAttributes: {"class": "displayNon"},
                width: 30,
                template: function (dataItem) {
                    let html = "";

                    if ( ( dataItem.dataFrmTypCd == "M" || dataItem.dataFrmTypCd == "P" || dataItem.dataFrmTypCd == "T" || dataItem.dataFrmTypCd == "S" ) && Utils.isNotNull(dataItem.dataFrmeTmplCd)) {
                        html = "<button type='button' class='btnRefer_default' onclick='SYSM300M_fnEditTemplate(this)'>편집</button>";
                    } else {
                        html = "";
                    }

                    return html;
                },
            },
            {
                field: "lyotApclDvCd",
                title: "레이아웃대상",
                width: 60,
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM300M_comCdList, 'C0200', $.trim(dataItem.lyotApclDvCd));
                },
                editor: function (container, options) {
                    SYSM300M_grid_fnComboEditor(container, options, 0, "C0200", "선택");
                },
            },
            {
                title: "버튼정보",
                width: 30,
                template: "<button type='button' class='k-icon k-i-zoom-in' title='상세보기' onclick='SYSM300M_grid_fnSelect(0, this)'></button>"
            }
        ]
    }).data("kendoGrid");

    Utils.setKendoGridDoubleClickAction("#SYSM300M_grid0");

    SYSM300M_grid[1].instance = $("#SYSM300M_grid1").kendoGrid({
        dataSource:{
            transport: {
                read: function (options) {
                    Utils.ajaxCall("/sysm/SYSM300SEL03", JSON.stringify(options.data), function (result) {
                        options.success(JSON.parse(result.list));
                    });
                },
                create: function (options) {
                    Utils.ajaxCall("/sysm/SYSM300INS03", JSON.stringify({
                        list: options.data.models
                    }), function (result) {
                        options.success(options.data.models);
                    });
                },
                update: function (options) {
                    let updateList = options.data.models;
                    let delInfo = {
                        abolmnId: GLOBAL.session.user.usrId,
                        abolmnOrgCd: GLOBAL.session.user.orgCd
                    }

                    $.each(updateList, function(index, item){
                        if (item.butnStCd == "9")
                            $.extend(item, delInfo);
                    });

                    Utils.ajaxCall("/sysm/SYSM300UPT03", JSON.stringify({
                        list: updateList
                    }), function (result) {
                        options.success(updateList);
                    });
                },
                destroy: function (options) {
                    options.success(options.data.models);
                },
            },
            requestStart: function (e) {
                let type = e.type;
                let response = e.response;
            },
            requestEnd: function (e) {
                let type = e.type;
                let response = e.response;

                if (type != "read" && type != "destroy") {
                    SYSM300M_grid[1].instance.clearSelection();
                    SYSM300M_grid[1].instance.dataSource.read({
                        tenantId: SYSM300M_grid[0].currentItem.tenantId,
                        dataFrmId: SYSM300M_grid[0].currentItem.dataFrmId
                    });
                }
            },
            batch: true,
            schema: {
                type: "json",
                model: {
                    id: "butnSeq",
                    fields: {
                        butnSeq: {type: "Integer"},
                        butnTypCd: {type: "string"},
                        butnId: {type: "string"},
                        butnNm: {type: "string"},
                        dataFrmId: {type: "string"},
                        linkSumnPgmId: {type: "string"},
                        butnStCd: {type: "string"}
                    }
                }
            }
        },
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        sortable: false,
        resizable: true,
        noRecords: {
            template: "<div class='nodataMsg'><p>데이터프레임을 선택하세요.</p></div>"
        },
        dataBound: function(e) {
            SYSM300M_grid_fnOnDataBound(e, 1);
        },
        change: function (e) {
            SYSM300M_grid_fnOnChange(e, 1);
        },
        columns: [
            {
                selectable: true,
                width: 30
            },
            {
                title: "상태",
                type: "string",
                width: 30,
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
                title: "No",
                template: "#= ++SYSM300M_grid[1].record #",
                width: 40,
            },
            {
                field: "butnTypCd",
                title: "버튼유형",
                type: "string",
                width: 120,
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM300M_comCdList, 'C0201', $.trim(dataItem.butnTypCd));
                },
                editor: function (container, options) {
                    SYSM300M_grid_fnComboEditor(container, options, 1, "C0201", "선택");
                }
            },
            {
                field: "butnId",
                title: "버튼 ID",
                type: "string",
                width: 120
            },
            {
                field: "butnNm",
                title: "버튼명",
                type: "string",
                width: 120,
                attributes: {"class": "textEllipsis"}
            },
            {
                field: "linkSumnPgmId",
                title: "연결 PGM ID",
                type: "string",
                width: 120,
            },
            {
                field: "butnStCd",
                title: "상태",
                type: "string",
                width: 120,
                template: function (dataItem) {
                    let classStr = '';

                    if (dataItem.butnStCd == 9) {
                        classStr = ' class="fontRed"';
                    }
                    return '<span' + classStr + '>' + Utils.getComCdNm(SYSM300M_comCdList, 'C0202', $.trim(dataItem.butnStCd)) + '</span>'
                },
                editor: function (container, options) {
                    SYSM300M_grid_fnComboEditor(container, options, 1, "C0202", "선택");
                }
            }
        ]
    }).data("kendoGrid");

    Utils.setKendoGridDoubleClickAction("#SYSM300M_grid1");


    SYSM300M_fnGridResize();
    $(window).on("resize", function () { SYSM300M_fnGridResize();});

    SYSM300M_fnInit();
});

function SYSM300M_fnInit() {
    let param = {
        "codeList": [
            {"mgntItemCd": "S0005"}, // 데이터프레임관리 조회조건 (구분)
            {"mgntItemCd": "C0024"}, // 사용자등급
            {"mgntItemCd": "C0018"}, // 데이터프레임분류
            {"mgntItemCd": "C0197"}, // 데이터프레임유형
            {"mgntItemCd": "C0164"}, // 화면표시방향
            {"mgntItemCd": "C0201"}, // 버튼유형코드
            {"mgntItemCd": "C0202"}, // 버튼상태코드 (사용여부)
            {"mgntItemCd": "C0299"}, // 데이터카드유형 (복수,단일)
            {"mgntItemCd": "C0196"}, // 패키지분류
            {"mgntItemCd": "C0198"}, // 데이터프레임 템플릿코드
            {"mgntItemCd": "C0200"}, // 레이아웃적용대상
            {"mgntItemCd": "C0203"}, // 분할프레임코드
            {"mgntItemCd": "C0204"}, // 분할프레임유형코드
        ]
    };

    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        SYSM300M_comCdList = JSON.parse(result.codeList);

        Utils.setKendoComboBox(SYSM300M_comCdList, "C0018", "#SYSM300M_dataFrmeClasCd");
        Utils.setKendoMultiSelect(SYSM300M_comCdList, "C0197", "#SYSM300M_dataFrmTypCd");
        Utils.setKendoComboBox(SYSM300M_comCdList, "S0005", "#SYSM300M_srchCond", "", false);

        const SYSM300M_fnGridClear = () => {
            SYSM300M_grid[1].instance.dataSource.data([]);
            SYSM300M_grid[0].instance.clearSelection();
            SYSM300M_grid[0].currentItem = {};
            SYSM300M_grid[0].instance.dataSource.data([]);


            $("#SYSM300M_dataFrmTypCd").data("kendoMultiSelect").dataSource.data([]);
            Utils.setKendoMultiSelect(SYSM300M_comCdList, "C0197", "#SYSM300M_dataFrmTypCd");
            $("#SYSM300M_srchCond").data("kendoComboBox").select(0);
            $("#SYSM300M_dataFrmeClasCd").data("kendoComboBox").select(0);

            $('#SYSM300M_srchText').val("");

        }
        CMMN_SEARCH_TENANT["SYSM300M"].fnInit(null,SYSM300M_fnSearch,SYSM300M_fnGridClear);
    });
}

function SYSM300M_fnSearch() {
    Utils.markingRequiredField();

    if (Utils.isNull($("#SYSM300M_tenantId").val())) {
        Utils.alert("테넌트를 입력해주세요.", function () {
            $("#SYSM300M_tenantId").focus();
        });

        return false;
    }

    SYSM300M_grid[1].instance.dataSource.data([]);

    SYSM300M_grid[0].instance.clearSelection();
    SYSM300M_grid[0].currentItem = {};
    SYSM300M_grid[0].instance.dataSource.read();
}

function SYSM300M_grid_fnOnDataBound(e, gridIndex) {
    let grid = e.sender;
    let rows = grid.items();

    SYSM300M_grid[gridIndex].record = 0;

    rows.off("click").on("click", function (e) {
        let dataItem = grid.dataItem(this);
        let cellIndex = $(e.target).index();

        SYSM300M_grid[gridIndex].currentItem = dataItem;
        SYSM300M_grid[gridIndex].currentCellIndex = cellIndex;
        
        //그리드 클릭 시 데이터프레임 버튼정보 조회        
        if (gridIndex === 0){
	        SYSM300M_grid_fnSelect(0, this);
        }
    });

    if (gridIndex == 0 && SYSM300M_grid[gridIndex].loadCount == 0) {
        $("#SYSM300M_grid" + gridIndex + " tbody tr:first td:eq(11) button").trigger("click");
    }

    SYSM300M_grid[gridIndex].loadCount++;
}

function SYSM300M_grid_fnOnChange(e, gridIndex) {
    let rows = e.sender.select(),
        items = [];

    rows.each(function(e) {
        let dataItem = SYSM300M_grid[gridIndex].instance.dataItem(this);
        items.push(dataItem);
    });

    SYSM300M_grid[gridIndex].selectedItems = items;
}

// function SYSM300M_grid_fnOnChangeSwitch(obj) {
//     let row = $(obj).closest("tr");
//     let dataItem = SYSM300M_grid[3].instance.dataItem(row);
//
//     dataItem.set("titeDispYn", $(obj).is(":checked") ? "Y" : "N");
// }

function SYSM300M_grid_fnComboEditor(container, options, gridIndex, code, isTotalOption) {
    let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);

    Utils.setKendoComboBox(SYSM300M_comCdList, code, $select, "", isTotalOption).bind("change", function (e) {
        let element = e.sender.element;
        let row = element.closest("tr");
        let dataItem = SYSM300M_grid[gridIndex].instance.dataItem(row);

        if (gridIndex == 0 && code == "C0197") {
            if (dataItem.dataFrmTypCd != "M" && dataItem.dataFrmTypCd != "P" && dataItem.dataFrmTypCd != "T" && dataItem.dataFrmTypCd != "S") {
            	dataItem.set("dataFrmeTmplCd", null);
            }
            if (dataItem.dataFrmTypCd != "C") {
            	dataItem.set("dataFrmeCrdTypCd", null);
            }


        }
        // 프레임분할 그리드 분할코드 중복체크
        if (gridIndex == 1 && code == "C0203") {
            if (dataItem.id != e.sender.value()) {
                let totalList = SYSM300M_grid[gridIndex].instance.dataSource.data();
                let filterList = totalList.filter(function (item) {
                    return (item.id != dataItem.id && item.patFrmeCd == dataItem.patFrmeCd)
                });

                if (filterList.length > 0) {
                    Utils.alert("동일한 분할코드가 존재합니다.");
                    dataItem.set("patFrmeCd", dataItem.id);
                    SYSM300M_grid[gridIndex].instance.refresh();
                    return false;
                }
            }
        }

        //버튼명 자동 설정
        if (gridIndex == 1 && options.field == "butnTypCd"){
            let rowUid = row.attr("data-uid");
        	$.each(SYSM300M_grid[gridIndex].instance.dataSource.data(), function (index, item) {
        		if(item.uid == rowUid){
        			SYSM300M_grid[gridIndex].instance.dataSource.data().at(index).butnNm = e.sender.text();
        		}
        	});
        }

        dataItem.set(options.field, e.sender.value());

        SYSM300M_grid[gridIndex].instance.refresh();
    });
}

function SYSM300M_grid_fnSelect(gridIndex, obj) {
    let selectedItem;

    if (obj) {
        let tr = $(obj).closest("tr");
        SYSM300M_grid[gridIndex].currentItem = SYSM300M_grid[gridIndex].instance.dataItem(tr);
        SYSM300M_grid[gridIndex].instance.clearSelection();
        SYSM300M_grid[gridIndex].instance.select(tr);
    }

    selectedItem = SYSM300M_grid[gridIndex].currentItem;

    if (gridIndex == 0) {
        SYSM300M_grid[1].currentItem = {};
        SYSM300M_grid[1].instance.clearSelection();
        SYSM300M_grid[1].instance.dataSource.read({
            tenantId: selectedItem.tenantId,
            dataFrmId: selectedItem.dataFrmId
        });
    }
}

function SYSM300M_fnAdd(gridIndex) {
	let selIndex = 2;
    if ((gridIndex == 1 || gridIndex == 2) && $.isEmptyObject(SYSM300M_grid[0].currentItem)) {
        Utils.alert("데이터프레임을 선택해주세요.");
        return;
    }

    let row = {};
    let regInfo = {
        tenantId: $("#SYSM300M_tenantId").val(),
        regrId: GLOBAL.session.user.usrId,
        regrOrgCd: GLOBAL.session.user.orgCd,
        lstCorprId: GLOBAL.session.user.usrId,
        lstCorprOrgCd: GLOBAL.session.user.orgCd
    }

    if (gridIndex == 0) {
        row.dataFrmeClasCd = "";
        row.pkgClasCd = "";
        row.dataFrmTypCd = "";
        row.dataFrmId = "";
    } else if (gridIndex == 1) {
    	selIndex = 3;
        row.butnTypCd = "";
        row.dataFrmId = SYSM300M_grid[0].currentItem.dataFrmId;
        row.linkSumnPgmId = SYSM300M_grid[0].currentItem.dataFrmId;
        row.butnStCd = "1";
    }

    SYSM300M_grid[gridIndex].instance.dataSource.add($.extend(row, regInfo));
    SYSM300M_grid[gridIndex].instance.refresh();
    SYSM300M_grid[gridIndex].instance.clearSelection();
    SYSM300M_grid[gridIndex].instance.content.scrollTop((SYSM300M_grid[gridIndex].instance).tbody.height());
    SYSM300M_grid[gridIndex].instance.tbody.find("tr:last td:eq("+selIndex+")").dblclick();
}

function SYSM300M_fnSync(gridIndex) {
    let isValid = true;

    $.each(SYSM300M_grid[gridIndex].instance.dataSource.data(), function (index, item) {
        if (gridIndex == 0) {
            if (Utils.isNull(item.dataFrmId)) {
                Utils.alert("데이터프레임ID를 입력해주세요.");
                isValid = false;
                return false;
            }
        } else if (gridIndex == 1) {
            if (Utils.isNull(item.butnTypCd)) {
                Utils.alert("버튼유형을 선택해주세요.");
                isValid = false;
                return false;
            }
            if (Utils.isNull(item.butnNm)) {
                Utils.alert("버튼명을 입력해주세요.");
                isValid = false;
                return false;
            }
            if (Utils.isNull(item.butnStCd)) {
                Utils.alert("상태를 선택해주세요.");
                isValid = false;
                return false;
            }
        }
    });

    if (isValid) {
        Utils.confirm("저장하시겠습니까?", function () {
            SYSM300M_grid[gridIndex].instance.dataSource.sync().then(function () {
                Utils.alert("정상적으로 저장되었습니다.");
            });
        });
    }
}

function SYSM300M_fnDelete(gridIndex) {
    let reqPath = "";
    let readParam = {};
    let selectedItems = SYSM300M_grid[gridIndex].selectedItems;

    if (selectedItems.length == 0) {
        Utils.alert("삭제할 대상을 선택해주세요.");
        return;
    }

    let delInfo = {
        abolmnId: GLOBAL.session.user.usrId,
        abolmnOrgCd: GLOBAL.session.user.orgCd
    }

    $.each(selectedItems, function(index, item){
        $.extend(item, delInfo);
    });

    if (gridIndex == 0) {
        reqPath = "/sysm/SYSM300DEL01";
    } else if (gridIndex == 1) {
        reqPath = "/sysm/SYSM300DEL03";
        readParam = {
            tenantId: SYSM300M_grid[0].currentItem.tenantId,
            dataFrmId: SYSM300M_grid[0].currentItem.dataFrmId
        };
    }

    Utils.confirm("삭제하시겠습니까?", function () {
        Utils.ajaxCall(reqPath, JSON.stringify({
            list: selectedItems
        }), function (result) {
            Utils.alert("정상적으로 삭제되었습니다.", function() {
                if (gridIndex == 0) {
                    SYSM300M_fnSearch();
                } else {
                    SYSM300M_grid[gridIndex].instance.dataSource.read(readParam);
                }
            });
        });
    });
}

function SYSM300M_fnSearchTemplate(obj) {
    let dataItem = SYSM300M_grid[0].instance.dataItem($(obj).closest("tr"));

    Utils.openKendoWindow("/sysm/SYSM303P", 830, 810, "center", 0, 0, false, {
        callbackKey: "SYSM300M_fnSYSM303PCallback",
        selectedValue: dataItem.dataFrmeTmplCd
    });

}

function SYSM300M_fnEditTemplate(obj) {
    let dataItem = SYSM300M_grid[0].instance.dataItem($(obj).closest("tr"));
    
    if ( dataItem.dataFrmeTmplCd != dataItem.dataFrmeTmplCdOld ) {
    	Utils.alert("템플릿 변경시 저장을 한 후 편집가능합니다.");
    	return;
	}

    // MAINFRAME.dataFrameLoad({
    //     menuNm: "템플릿 편집(" + dataItem.dataFrmId + ")",
    //     id: "SYSM301M_" + dataItem.dataFrmId,
    //     path: "/sysm/SYSM301M",
    //     param: {
    //         dataFrmId: dataItem.dataFrmId,
    //         dataFrmeTmplCd: dataItem.dataFrmeTmplCd
    //     }
    // });

    Utils.openKendoWindow("/sysm/SYSM301M", 1500, 900, "center", 0, 0, false, {
        dataframeId: "SYSM301M_" + dataItem.dataFrmId,
        tenantId: dataItem.tenantId,
        dataFrmId: dataItem.dataFrmId,
        dataFrmeTmplCd: dataItem.dataFrmeTmplCd
    });
}

function SYSM300M_fnGridResize() {
    let screenHeight = $(window).height() - 210; // (헤더+푸터) 영역 높이 제외

    if (SYSM300M_grid[0].instance.element)
        SYSM300M_grid[0].instance.element.find('.k-grid-content').css('height', screenHeight/2-74);
    if (SYSM300M_grid[1].instance.element)
        SYSM300M_grid[1].instance.element.find('.k-grid-content').css('height', screenHeight/2-237);
}