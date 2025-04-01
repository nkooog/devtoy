/***********************************************************************************************
 * Program Name : 상담그룹코드 관리 (SYSM540M.js)
 * Creator      : wkim
 * Create Date  : 2023.02.13
 * Description  : 상담그룹코드 관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.02.13     wkim             최초작성
 ************************************************************************************************/
var SYSM540M_comCdList = new Array();
var SYSM540M_grid = new Array(1);
var SYSM540DataSource;
var startSYSM540, endSYSM540;

$(document).ready(function () {
	
	startSYSM540 = $(".SYSM540 #startDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: startChangeSYSM540,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	endSYSM540 = $(".SYSM540 #endDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		change: endChangeSYSM540,
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");

	startSYSM540.max(endSYSM540.value());
	endSYSM540.min(startSYSM540.value()); 
	if ( typeof(cnslEnable) == 'undefined' ) {
		startSYSM540.enable(true);
		endSYSM540.enable(false);
	} 
	else {
		startSYSM540.enable(cnslEnable);
		endSYSM540.enable(false);
	}
	
	
	$(".SYSM540 .btnRefer_default").on("click", function() {
    	$(this).parent().find("button").removeClass('selected');
    	$(this).addClass('selected');
    	if ( $(this).attr("range") != undefined ) {
    		var rangeDay = Number($(this).attr("range"));
        	getRangeDaySYSM540(rangeDay);
        	startSYSM540.enable(false);
    		endSYSM540.enable(false);
    	} else {
    		startSYSM540.enable(true);
    		endSYSM540.enable(false);
    	}
	});
	
	//2. 그리드 설정
    for (let i = 0; i < SYSM540M_grid.length; i++) {
        SYSM540M_grid[i] = {
            record: 0,
            instance: new Object(),
            dataSource: new Object(),
            currentItem: new Object(),
            currentCellIndex: new Number(),
            selectedItems: new Array(),
            checkedRows: new Array(),
            loadCount: 0
        }
    }

    SYSM540DataSource = {
		transport: {
        	read: function (options) {        		
    			
                let param = SYSM540M_getParamValue();
                
                $.extend(param, options.data);

                Utils.ajaxCall("/sysm/SYSM540SEL01", JSON.stringify(param), function (result) {
                    options.success(JSON.parse(result.list));
                });
            },
            create: function (options) {
                Utils.ajaxCall("/sysm/SYSM540INS01", JSON.stringify({
                    list: options.data.models
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            update: function (options) {
            	var cnslGrpCdFlg = false;
            	for(var i = 0; i < options.data.models.length; i++) {
            		if ( options.data.models[i].cnslGrpCd != options.data.models[i].cnslGrpCdOld ) {
            			cnslGrpCdFlg = true;
            			options.data.models[i]['cnslGrpCdFlg'] = 'Y';
                	}else {
                		options.data.models[i]['cnslGrpCdFlg'] = 'N';
                	}
            	}
            	
            	let updateList = options.data.models;
                let regInfo = {
            		regrId: '000000',								//GLOBAL.session.user.usrId,
                    regrOrgCd: '1',									//GLOBAL.session.user.orgCd,
                    lstCorprId: '000000',							//GLOBAL.session.user.usrId,
                    lstCorprOrgCd: '1'								//GLOBAL.session.user.orgCd
                }
                $.each(updateList, function (index, item) {
                    $.extend(item, regInfo);
                });
                
                if ( cnslGrpCdFlg ) {
            		Utils.confirm("",
    				function(){
            			Utils.ajaxCall("/sysm/SYSM540UPT01", JSON.stringify({
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
            		Utils.ajaxCall("/sysm/SYSM540UPT01", JSON.stringify({
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
                SYSM540M_fnSearch();
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
    }
    
    SYSM540M_grid[0].instance = $("#SYSM540M_grid0").kendoGrid({
    	dataSource: SYSM540DataSource,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        sortable: false,
        resizable: true,
        noRecords: {
            template: '<div class="nodataMsg"><p></p></div>'
        },
        dataBound: function (e) {
            SYSM540M_grid_fnOnDataBound(e, 0);
        },
        change: function (e) {
            SYSM540M_grid_fnOnChange(e, 0);
        },
        cellClose: function (e) {
        	var grid = e.sender;
            var dataItem = grid.dataItem(e.sender.select());
        },
        columns: [
            { 
            	selectable: true, 
            	width: 15,
            },
            { 
            	title: "No", 
            	width: 15, 
            	attributes : { style : "text-align : right; " }, 
            	template: "<span class='row-number'></span>" 
            },
            { 
            	field: "", 		
                title: "Log생성일자",	//태넌트ID
                type: "string", 
                width: 30,
                editable: function (dataItem) {
                    return false;
                }
            }, 
            { 
                field: "", 		
                title: "생성시간 HH:MM:SS",	//태넌트ID
                type: "string", 
                width: 30,
                editable: function (dataItem) {
                    return false;
                }
            },
            { 
            	field: "cnslGrpCd",
            	title: "Log생성 PGM ID",	//상담그룹코드
            	type: "string", 
            	width: 40, 	
            	attributes: {"class": "k-text-left"},	
            },
            { 
            	field: "grpCdUseYn",
            	title: "I-O구분",	//사용여부
            	type: "string", 
            	width: 30,		
            	attributes: {"class": "k-text-left"},
            	template: function (dataItem) {
                    return Utils.getComCdNm(SYSM540M_comCdList, 'C0004', $.trim(dataItem.grpCdUseYn));
                },
                editor: function (container, options) {
                	SYSM540M_grid_fnComboEditor(container, options, 0, "C0004", "선택");
                },
            },
            { 
            	field: "", 		
            	title: "Log",	//등록자
            	type: "string", 
            	width: 40, 	
            	attributes: {"class": "k-text-left"},
            	editable: function (dataItem) {
                    return false;
                }
            },
            { 
            	field: "regOrgNm", 		
            	title: "UserID",	//title: "등록자조직", 	
            	type: "string", 
            	width: 50, 	
            	attributes: {"class": "k-text-left"},
            	editable: function (dataItem) {
                    return false;
                }
            },
        ],
        dataBound: function(e) {
        	var rows = this.items();
            $(rows).each(function () {
                var index = $(this).index() + 1;
                var rowLabel = $(this).find(".row-number");
                $(rowLabel).html(index);
            });
        },
    }).data("kendoGrid");

    Utils.setKendoGridDoubleClickAction("#SYSM540M_grid0");

    SYSM540M_fnGridResize();
    $(window).on("resize", function () { SYSM540M_fnGridResize();});

    SYSM540M_fnInit();
});

function SYSM540M_getParamValue() {	
	return {
		tenantId: GLOBAL.session.user.tenantId,
        sltnCd: $(".SYSM540 #sltnCd").val().trim(),
        pkgPathCd: $(".SYSM540 #pkgPathCd").val().trim(),
        pgmTypCd: $(".SYSM540 #pgmTypCd").val().trim(),
        pgmId: $(".SYSM540 #pgmId").val().trim(),
        regrId: $(".SYSM540 #usrId").val().trim(),
	};
}

function SYSM540M_fnInit() {
    let param = {
        "codeList": [
        	{"mgntItemCd": "C0312"},
            {"mgntItemCd": "C0320"},
            {"mgntItemCd": "C0321"},
            {"mgntItemCd": "C0322"}
        ]
    };
    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        SYSM540M_comCdList = JSON.parse(result.codeList);
        Utils.setKendoComboBox(SYSM540M_comCdList, "C0312", ".C0312", " ", false);
        Utils.setKendoComboBox(SYSM540M_comCdList, "C0320", ".C0320", " ", false);
        Utils.setKendoComboBox(SYSM540M_comCdList, "C0321", ".C0321", " ", false);
        Utils.setKendoComboBox(SYSM540M_comCdList, "C0322", ".C0322", " ", false);
    });
}

function SYSM540M_fnSearch() {
    Utils.markingRequiredField();
    SYSM540M_grid[0].instance.clearSelection();
    SYSM540M_grid[0].currentItem = new Object();
    SYSM540M_grid[0].instance.dataSource.read();
}

function SYSM540M_grid_fnOnDataBound(e, gridIndex) {
    let grid = e.sender;
    let rows = grid.items();

    SYSM540M_grid[gridIndex].record = 0;

    rows.off("click").on("click", function (e) {
        let dataItem = grid.dataItem(this);
        let cellIndex = $(e.target).index();

        SYSM540M_grid[gridIndex].currentItem = dataItem;
        SYSM540M_grid[gridIndex].currentCellIndex = cellIndex;
    });

    if (gridIndex == 0 && SYSM540M_grid[gridIndex].loadCount == 0) {
        $("#SYSM540M_grid" + gridIndex + " tbody tr:first td:eq(11) button").trigger("click");
    }

    SYSM540M_grid[gridIndex].loadCount++;
}

function SYSM540M_grid_fnOnChange(e, gridIndex) {
    let rows = e.sender.select(),
        items = [];

    rows.each(function(e) {
        let dataItem = SYSM540M_grid[gridIndex].instance.dataItem(this);
        items.push(dataItem);
    });
  
    SYSM540M_grid[gridIndex].selectedItems = items;
}

function SYSM540M_grid_fnComboEditor(container, options, gridIndex, code, isTotalOption) {
	
	let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);

    Utils.setKendoComboBox(SYSM540M_comCdList, code, $select, "", isTotalOption).bind("change", function (e) {
        let element = e.sender.element;
        let row = element.closest("tr");
        let dataItem = SYSM540M_grid[gridIndex].instance.dataItem(row);


        dataItem.set(options.field, e.sender.value());

        SYSM540M_grid[gridIndex].instance.refresh();
    });
}

function SYSM540M_fnGridResize() {
	let screenHeight = $(window).height()-200;
	SYSM540M_grid[0].instance.element.find('.k-grid-content').css('height', screenHeight-225);       
}

//kw--- grid crud
//create 저장
function SYSM540M_fnSync(gridIndex) {
	let isValid = true;
    
    let insertInfo = {
		regUserId: '000000',					//,GLOBAL.session.user.usrId,
		regOrgCd: '1',						//,GLOBAL.session.user.orgCd,
		lstUserId: '000000',					//,GLOBAL.session.user.usrId,
		lstOrgCd: '1',						//,GLOBAL.session.user.orgCd,
    }

    $.each(SYSM540M_grid[gridIndex].instance.dataSource.data(), function (index, item) {
    	$.extend(item, insertInfo);
        if (gridIndex == 0) {
            if (Utils.isNull(item.cnslGrpCd)) {
                Utils.alert("");
                isValid = false;
                return false;
            }
            if (Utils.isNull(item.cnslGrpNm)) {
                Utils.alert("");
                isValid = false;
                return false;
            }
            
            if (Utils.isNull(item.grpCdUseYn)) {
                Utils.alert("");
                isValid = false;
                return false;
            }
        } 
    });

    if (isValid) {
        Utils.confirm("저장하시겠습니까?", function () {
        	SYSM540M_grid[gridIndex].instance.dataSource.sync().then(function (result) {
        		Utils.alert("저장되었습니다.");
        	});
        });
    }
}

function SYSM540M_fnDelete(gridIndex) {
    let reqPath = "";
    let readParam = new Object();
    let selectedItems = SYSM540M_grid[gridIndex].selectedItems;

    if (selectedItems.length == 0) {
        Utils.alert("");
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
        reqPath = "/sysm/SYSM540DEL01";
    }

    Utils.confirm("", function () {
        Utils.ajaxCall(reqPath, JSON.stringify({
            list: selectedItems
        }), function (result) {
            Utils.alert("", function() {
                if (gridIndex == 0) {
                    SYSM540M_fnSearch();
                }
            });
        });
    });
}



function startChangeSYSM540() {
	var startDate = startSYSM540.value();
	var endDate = endSYSM540.value();

	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		endSYSM540.min(startDate);
	} else if (endDate) {
		startSYSM540.max(new Date(endDate));
	} else {
		endDate = new Date();
		startSYSM540.max(endDate);
		endSYSM540.min(endDate);
	}
}

function endChangeSYSM540() {
	var endDate = endSYSM540.value();
	var startDate = startSYSM540.value();

	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		startSYSM540.max(endDate);
	} else if (startDate) {
		endSYSM540.min(new Date(startDate));
	} else {
		endDate = new Date();
		startSYSM540.max(endDate);
		endSYSM540.min(endDate);
	}
}

function getRangeDaySYSM540(rangeDay) {
	
	var endDay = new Date();	// 현재 날짜 및 시간
	var eYear = endDay.getFullYear();
    var eMonth = ("0" + (1 + endDay.getMonth())).slice(-2);
    var eDay = ("0" + endDay.getDate()).slice(-2);
    var endDate = eYear + '-' +  eMonth + '-' + eDay; 
    
    var startDay = new Date(endDay.setDate(endDay.getDate() - rangeDay));
    var sYear = startDay.getFullYear();
    var sMonth = ("0" + (1 + startDay.getMonth())).slice(-2);
    var sDay = ("0" + startDay.getDate()).slice(-2);
    var startDate = sYear + '-' +  sMonth + '-' + sDay; 
	
    $(".SYSM540 #startDate").val(startDate);
    $(".SYSM540 #endDate").val(endDate);
}
