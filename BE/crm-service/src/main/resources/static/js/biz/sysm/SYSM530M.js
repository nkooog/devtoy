/***********************************************************************************************
 * Program Name : 메뉴관리(SYSM530M.js)
 * Creator      : jrlee
 * Create Date  : 2022.03.18
 * Description  : 메뉴관리
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.18     jrlee           최초작성   
 ************************************************************************************************/

var SYSM530M_comCdList;
var SYSM530M_totalMenuList;
var SYSM530M_iconPopup;
var SYSM530M_grid = new Array(3);
var pgmMgntNo, sltnCd;

for (let i = 0; i < SYSM530M_grid.length; i++) {
    SYSM530M_grid[i] = {
        instance: new Object(),
        dataSource: new Object(),
        currentItem: new Object(),
        currentCellIndex: new Number(),
        selectedItems: new Array()
    }
}

$(document).ready(function () {
	//공통콤보 불러오기
	var data = { "codeList": [
		{"mgntItemCd":"C0320"},
		{"mgntItemCd":"C0321"},
		{"mgntItemCd":"C0322"}
	]};
    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : function(data){
        	let jsonEncode = JSON.stringify(data.codeList);
        	let object=JSON.parse(jsonEncode);
        	let jsonDecode = JSON.parse(object);
        	Utils.setKendoComboBox(jsonDecode, "C0320", '.C0320', ' ', false) ;
        	Utils.setKendoComboBox(jsonDecode, "C0321", '.C0321', ' ', false) ;
        	Utils.setKendoComboBox(jsonDecode, "C0322", '.C0322', ' ', false) ;
        },
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
	Utils.resizeLabelWidth();
    SYSM530M_grid[0].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall("/sysm/SYSM530SEL01", JSON.stringify(options.data), function (result) {
                    options.success(JSON.parse(result.list));
                });
            },
            create: function (options) {
                Utils.ajaxCall("/sysm/SYSM530INS01", JSON.stringify({
                    list: options.data.models
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            update: function (options) {
                var updateList = options.data.models;
                var regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprBlngOrgCd: GLOBAL.session.user.orgCd
                }

                $.each(updateList, function(index, item){
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/sysm/SYSM530UPT01", JSON.stringify({
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
                SYSM530M_fnSearchCustomLyotList();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "pgmMgntNo",
                fields: {
                	tenantId				: { type: "string"},
                	sltnCd				: { type: "string"},
                	pgmMgntNo			: { type: "Integer",  editable: false},
                	pkgPathCd				: { type: "string"},
                	pgmTypCd		: { type: "string"},
                	pgmId		: { type: "string"},
                	pgmNm		: { type: "string"},
                	logCreYn			: { type: "Integer"},
                	pgmOfcrNm		: { type: "string"},
                	pgmMemo		: { type: "string"},
                }
            }
        }
    });

    SYSM530M_grid[0].instance = $("#SYSM530M_grid0").kendoGrid({
        dataSource: SYSM530M_grid[0].dataSource,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        editable: "incell",
        sortable: false,
        resizable: true,
        dataBound: function() {
            SYSM530M_grid_fnOnDataBound(0);
        },
        change: function(e) {
            SYSM530M_grid_fnOnChange(e, 0);
        },
        cellClose:  function(e) {
            SYSM530M_fnChk(e);
        },
        columns: [
            {
                selectable: true,
                width: 30
            }, {
				field: "sltnCd", title: "솔루션",type: "string", width: 100,
				editor: function (container, options) {
					SYSM530M_commonTypCdEditor(container, options, SYSM530M_grid[0].instance, 'C0320');
                },
                template: function (dataItem) {return Utils.getComCdNm(SYSM530M_comCdList, 'C0320', dataItem.sltnCd);}
			}, {
				field: "pkgPathCd", title: "PKG경로",type: "Integer", width: 100,
				editor: function (container, options) {
					SYSM530M_commonTypCdEditor(container, options, SYSM530M_grid[0].instance, 'C0321');
                },
                template: function (dataItem) {return Utils.getComCdNm(SYSM530M_comCdList, 'C0321', dataItem.pkgPathCd);}
			}, {
				field: "pgmTypCd", title: "PGM유형",type: "string", width: 70,
				editor: function (container, options) {
					SYSM530M_commonTypCdEditor(container, options, SYSM530M_grid[0].instance, 'C0322');
                },
                template: function (dataItem) {return Utils.getComCdNm(SYSM530M_comCdList, 'C0322', dataItem.pgmTypCd);}
			}, {
				field: "pgmId", title: "PGM ID",type: "string", width: 100
			}, {
				field: "pgmNm", title: "PGM명",type: "string", width: 100
			}, {
				field: "logCreYn", title: "LOG사용",type: "string", width: 50, editor: function (container, options) {
					SYSM530M_commonTypCdEditor(container, options, SYSM530M_grid[0].instance, 'C0004');
                },
                template: function (dataItem) {return Utils.getComCdNm(SYSM530M_comCdList, 'C0004', dataItem.logCreYn);}
			}, {
                title: "LOG",
                width: 50,
            	template: "<button type='button' class='k-icon k-i-zoom-in' title='LOG' onclick='SYSM530M_fnSearchCustomItemList(this)'></button>"
            }, {
				field: "pgmOfcrNm", title: "담당자",type: "string", width: 80
			}, {
				field: "pgmMemo", title: "메모",type: "string", width: 150
			}, {
                title: "상세",
                width: 40,
            	template: "<button type='button' class='k-icon k-i-zoom-in' title='상세보기' onclick='SYSM530M_fnSearchCustomItemList(this)'></button>"
            }
        ]
    }).data("kendoGrid");

    
    SYSM530M_grid[1].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall("/sysm/SYSM530SEL02", JSON.stringify(options.data), function (result) {
                	options.success(JSON.parse(result.list));
                });
            },
            create: function (options) {
                Utils.ajaxCall("/sysm/SYSM530INS02", JSON.stringify({
                    list: options.data.models
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            update: function (options) {
                var updateList = options.data.models;
                var regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprBlngOrgCd: GLOBAL.session.user.orgCd
                }

                $.each(updateList, function(index, item){
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/sysm/SYSM530UPT02", JSON.stringify({
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
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "itemSeq",
                fields: {
                	tenantId		: { field: "tenantId", type: "string"},
                	sltnCd			: { field: "sltnCd", type: "string"},
                	pgmMgntNo		: { field: "pgmMgntNo", type: "Integer",  editable: false},
                	ioDvCd			: { field: "ioDvCd", type: "string"},
                	itemSeq			: { field: "itemSeq", type: "Integer",  editable: false},
                	voId			: { field: "voId", type: "string"},
                	voNm			: { field: "voNm", type: "string"},
                	voTypCd			: { field: "voTypCd", type: "string"},
                	arryReptTcnt	: { field: "arryReptTcnt", type: "string"},
                	voSz			: { field: "voSz", type: "Integer"},
                	logCreYn		: { field: "logCreYn", type: "string"},
					}
                }
            }
    });

    SYSM530M_grid[1].instance = $("#SYSM530M_grid1").kendoGrid({
        dataSource: SYSM530M_grid[1].dataSource,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        editable: "incell",
        sortable: false,
        resizable: true,
        noRecords: true,
        messages: {
            noRecords: "상위 대상을 선택해주세요."
        },
        dataBound: function() {
            SYSM530M_grid_fnOnDataBound(1);
        },
        change: function(e) {
            SYSM530M_grid_fnOnChange(e, 1);
        },
        cellClose:  function(e) {
            SYSM530M_fnChk(e);
        },
        columns: [
            {
                selectable: true,
                width: 30
            },
            {
				field: "voId", title: "VO ID",type: "string", width: 80
			},{
				field: "voNm", title: "VO명",type: "string", width: 80
			}, {
				field: "voTypCd", title: "Type",type: "string", width: 90, editor: function (container, options) {
					SYSM530M_commonTypCdEditor(container, options, SYSM530M_grid[1].instance, 'C0325');
                },
                template: function (dataItem) {return Utils.getComCdNm(SYSM530M_comCdList, 'C0325', dataItem.voTypCd);}
			},{
				field: "voSz", title: "Size",type: "Integer", width: 70
			}, {
				field: "logCreYn", title: "Log",type: "string", width: 90, editor: function (container, options) {
					SYSM530M_commonTypCdEditor(container, options, SYSM530M_grid[1].instance, 'C0004');
                },
                template: function (dataItem) {return Utils.getComCdNm(SYSM530M_comCdList, 'C0004', dataItem.logCreYn);}
			}
        ]
    }).data("kendoGrid");
    
    
    SYSM530M_grid[2].dataSource = new kendo.data.DataSource({
        transport: {
        	read: function (options) {
                Utils.ajaxCall("/sysm/SYSM530SEL02", JSON.stringify(options.data), function (result) {
                	options.success(JSON.parse(result.list));
                });
            },
            create: function (options) {
                Utils.ajaxCall("/sysm/SYSM530INS02", JSON.stringify({
                    list: options.data.models
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            update: function (options) {
                var updateList = options.data.models;
                var regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprBlngOrgCd: GLOBAL.session.user.orgCd
                }

                $.each(updateList, function(index, item){
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/sysm/SYSM530UPT02", JSON.stringify({
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
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "itemSeq",
                fields: {
                	tenantId		: { field: "tenantId", type: "string"},
                	sltnCd			: { field: "sltnCd", type: "string"},
                	pgmMgntNo		: { field: "pgmMgntNo", type: "Integer",  editable: false},
                	ioDvCd			: { field: "ioDvCd", type: "string"},
                	itemSeq			: { field: "itemSeq", type: "Integer",  editable: false},
                	voId			: { field: "voId", type: "string"},
                	voNm			: { field: "voNm", type: "string"},
                	voTypCd			: { field: "voTypCd", type: "string"},
                	arryReptTcnt	: { field: "arryReptTcnt", type: "string"},
                	voSz			: { field: "voSz", type: "Integer"},
                	logCreYn		: { field: "logCreYn", type: "string"},
					}
                }
            }
    });

    SYSM530M_grid[2].instance = $("#SYSM530M_grid2").kendoGrid({
    	dataSource: SYSM530M_grid[2].dataSource,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        editable: "incell",
        sortable: false,
        resizable: true,
        noRecords: true,
        messages: {
            noRecords: "상위 대상을 선택해주세요."
        },
        dataBound: function() {
            SYSM530M_grid_fnOnDataBound(2);
        },
        change: function(e) {
            SYSM530M_grid_fnOnChange(e, 2);
        },
        cellClose:  function(e) {
            SYSM530M_fnChk(e);
        },
        columns: [
        	{
                selectable: true,
                width: 30
            },
            {
				field: "voId", title: "VO ID",type: "string", width: 80
			},{
				field: "voNm", title: "VO명",type: "string", width: 80
			}, {
				field: "voTypCd", title: "Type",type: "string", width: 90, editor: function (container, options) {
					SYSM530M_commonTypCdEditor(container, options, SYSM530M_grid[1].instance, 'C0325');
                },
                template: function (dataItem) {return Utils.getComCdNm(SYSM530M_comCdList, 'C0325', dataItem.voTypCd);}
			},{
				field: "voSz", title: "Size",type: "Integer", width: 70
			}, {
				field: "logCreYn", title: "Log",type: "string", width: 90, editor: function (container, options) {
					SYSM530M_commonTypCdEditor(container, options, SYSM530M_grid[1].instance, 'C0004');
                },
                template: function (dataItem) {return Utils.getComCdNm(SYSM530M_comCdList, 'C0004', dataItem.logCreYn);}
			}
        ]
    }).data("kendoGrid");

    // Tooltip
    for (let i = 0; i < SYSM530M_grid.length; i++) {
        $("#SYSM530M_grid" + i).kendoTooltip({
            filter: i == 0 ? "td:nth-child(4)" : "td:nth-child(3)",
            position: "right",
            width: 150,
            content: function(e){
                var dataItem = SYSM530M_grid[i].instance.dataItem(e.target.closest("tr"));
                var returnData;
                if ( i == 0 ) {
                	returnData = dataItem.custItemGrpNm;
                } else {
                	returnData = dataItem.mgntItemNm;
                }
                return returnData
            }
        }).data("kendoTooltip")
    }
    SYSM530M_fnInit();
    
    heightResizeSYSM530M();
    $(window).on({ 
		'resize': function() {
			heightResizeSYSM530M();  
		},   
	});
});

function heightResizeSYSM530M() {
	let screenHeight = $(window).height()-210;  // 헤더 + 푸터 = 210px
	$("#SYSM530M_grid0").css('height', screenHeight-145)
	$("#SYSM530M_grid1").css('height', screenHeight/2-120)
	$("#SYSM530M_grid2").css('height', screenHeight/2-120)
}

function SYSM530M_fnInit() {
    var param = {
        "codeList": [
        	{"mgntItemCd":"C0004"},
        	{"mgntItemCd":"C0320"},
        	{"mgntItemCd":"C0321"},
        	{"mgntItemCd":"C0322"},
        	{"mgntItemCd":"C0325"}
        ]
    };

    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        SYSM530M_comCdList = JSON.parse(result.codeList);
        SYSM530M_fnSearchCustomLyotList();
    });
}

function SYSM530M_fnSearchCustomLyotList() {
    SYSM530M_grid[0].instance.clearSelection();

    SYSM530M_grid[2].currentItem = new Object();
    SYSM530M_grid[1].currentItem = new Object();
    SYSM530M_grid[0].currentItem = new Object();

    SYSM530M_grid[2].dataSource.data([]);
    SYSM530M_grid[1].dataSource.data([]);
    SYSM530M_grid[0].dataSource.read({
        tenantId: GLOBAL.session.user.tenantId,
        sltnCd: $(".SYSM530 #sltnCd").val().trim(),
        pkgPathCd: $(".SYSM530 #pkgPathCd").val().trim(),
        pgmTypCd: $(".SYSM530 #pgmTypCd").val().trim(),
        pgmId: $(".SYSM530 #pgmId").val().trim(),
        pgmNm: $(".SYSM530 #pgmNm").val().trim()
    });
}

function SYSM530M_fnSearchCustomItemList(obj) {
    SYSM530M_grid[1].instance.clearSelection();
    SYSM530M_grid[2].instance.clearSelection();
    var selectedItem;
    if (obj) {
        var tr = $(obj).closest("tr");
        selectedItem = SYSM530M_grid[0].instance.dataItem(tr);

        SYSM530M_grid[0].instance.clearSelection();
        SYSM530M_grid[0].instance.select(tr);
    } else {
        selectedItem = SYSM530M_grid[0].currentItem;
    }
    
    sltnCd = selectedItem.sltnCd;
    pgmMgntNo = selectedItem.pgmMgntNo;
    
    SYSM530M_grid[1].currentItem = new Object();
    
    SYSM530M_grid[1].dataSource.read({
    	tenantId : GLOBAL.session.user.tenantId,
        sltnCd : sltnCd,
    	pgmMgntNo : pgmMgntNo,
    	ioDvCd : 'I'
    });
    
    SYSM530M_grid[2].currentItem = new Object();
    
    SYSM530M_grid[2].dataSource.read({
        tenantId : GLOBAL.session.user.tenantId,
        sltnCd : sltnCd,
    	pgmMgntNo : pgmMgntNo,
    	ioDvCd : 'O'
    });
}


function SYSM530M_fnAddMenu(gridIndex) {
    if (gridIndex != 0 && $.isEmptyObject(SYSM530M_grid[0].currentItem)) {
        Utils.alert("상위 대상을 선택해주세요.");
        return;
    }
    
    SYSM530M_grid_fnTotalSorting(gridIndex);

    var totalRecords = SYSM530M_grid[gridIndex].dataSource.total();
    var row = {};
    var regInfo = {};
    
    
    switch(gridIndex) {
	    case 0:  
	    	row = {
	    		sltnCd : "",
	    		pkgPathCd : "",
	    		pgmTypCd : "",
	    		pgmId : "",
	    		pgmNm : "",
	    		logCreYn : "",
	    		pgmOfcrNm : "",
	    		pgmMemo : "",
			};
			regInfo = {
			        tenantId: GLOBAL.session.user.tenantId,
			        regrId: GLOBAL.session.user.usrId,
			        regrOrgCd: GLOBAL.session.user.orgCd,
			        lstCorprId: GLOBAL.session.user.usrId,
			        lstCorprOrgCd: GLOBAL.session.user.orgCd
		    };
	    	break;
	    case 1:
	    	row = {
	    		voId : "",
	    		voNm : "",
	    		voTypCd : "ST",
	    		voSz : 10,
	    		logCreYn : "Y",
	    		ioDvCd : "I",
	    		sltnCd : sltnCd,
	    		pgmMgntNo : pgmMgntNo
		 	};
			
			regInfo = {
					tenantId: GLOBAL.session.user.tenantId,
			        regrId: GLOBAL.session.user.usrId,
			        regrOrgCd: GLOBAL.session.user.orgCd,
			        lstCorprId: GLOBAL.session.user.usrId,
			        lstCorprOrgCd: GLOBAL.session.user.orgCd
		    };
			break;
	    case 2:
	    	row = {
	    		voId : "",
	    		voNm : "",
	    		voTypCd : "ST",
	    		voSz : 10,
	    		logCreYn : "Y",
	    		ioDvCd : "O",
	    		sltnCd : sltnCd,
	    		pgmMgntNo : pgmMgntNo
		 	};
			
			regInfo = {
					tenantId: GLOBAL.session.user.tenantId,
			        regrId: GLOBAL.session.user.usrId,
			        regrOrgCd: GLOBAL.session.user.orgCd,
			        lstCorprId: GLOBAL.session.user.usrId,
			        lstCorprOrgCd: GLOBAL.session.user.orgCd
		    };
			break;
	}
    SYSM530M_grid[gridIndex].dataSource.add($.extend(row, regInfo));
    SYSM530M_grid[gridIndex].instance.refresh();
    
    SYSM530M_grid[gridIndex].instance.clearSelection();
    //기존 선택 제거
    SYSM530M_grid[gridIndex].instance.select("tr:last");
    //새로 추가된 Row 선택
    (SYSM530M_grid[gridIndex].instance).tbody.find("tr:last td:eq(" + focusIndex + ")").dblclick();
    //새로 추가된 Row의 (focusIndex = colum 번호)컬럼의 더블클릭 이벤트 실행
}

function SYSM530M_fnSaveMenu(gridIndex) {
    var isValid = true;

    $.each(SYSM530M_grid[gridIndex].dataSource.data(), function (index, item) {
    	//필요시 작성
    });

    if (isValid){
    	Utils.confirm("저장하시겠습니까?", function () {
            SYSM530M_grid[gridIndex].instance.dataSource.sync().then(function () {
                Utils.alert("정상적으로 저장되었습니다.");
                SYSM530M_fnSearchCustomItemList();
            });
        });
    }
}

function SYSM530M_fnDeleteMenu(gridIndex) {
    var selectedItems = SYSM530M_grid[gridIndex].selectedItems;

    if (selectedItems.length == 0) {
        Utils.alert("삭제할 대상을 선택해주세요."); // "삭제할 대상을 선택해주세요."
        return;
    }

    Utils.confirm("삭제하시겠습니까?", function () { // "삭제하시겠습니까?"
    	switch(gridIndex) {
		    case 0:  
		    	Utils.ajaxCall("/sysm/SYSM530DEL01", JSON.stringify({
	                list : selectedItems
	            }), function (result) {
	                    SYSM530M_fnSearchCustomLyotList();
	            });
		    	break;
		    case 1:
		    case 2:
		    	Utils.ajaxCall("/sysm/SYSM530DEL02", JSON.stringify({
	                list : selectedItems
	            }), function (result) {
	                    SYSM530M_fnSearchCustomItemList();
	            });
		    	break;
		}
    });
}

function SYSM530M_commonTypCdEditor(container, options, grid, selectComCd) {
    $('<select data-bind="value:' + options.field + '"/>').appendTo(container).kendoComboBox({
        autoBind: true,
        dataTextField: "comCdNm",
        dataValueField: "comCd",
        dataSource: {
            data: SYSM530M_comCdList.filter(function (code) {
                return code.mgntItemCd == selectComCd
            })
        },
        change: function (e) {
            var element = e.sender.element;
            var row = element.closest("tr");
            var dataItem = grid.dataItem(row);
            var selectedValue = e.sender.value();
            
            grid.refresh();
        }
    });
}

function SYSM530M_grid_fnOnDataBound(gridIndex) {
    $("#SYSM530M_grid" + gridIndex + " tbody").off("click").on("click", "td", function(e) {
        var $row = $(this).closest("tr");
        var $cell = $(this).closest("td");
        SYSM530M_grid[gridIndex].currentItem = SYSM530M_grid[gridIndex].instance.dataItem($row);
        SYSM530M_grid[gridIndex].currentCellIndex = $cell.index();
    });
}

function SYSM530M_grid_fnOnChange(e, gridIndex) {
    var rows = e.sender.select(),
        items = [];

    rows.each(function(e) {
        var dataItem = SYSM530M_grid[gridIndex].instance.dataItem(this);
        items.push(dataItem);
    });

    SYSM530M_grid[gridIndex].selectedItems = items;
};

function SYSM530M_fnMenuUpDown(gridIndex, val) {
	gridIndex = Number(gridIndex);
	val = Number(val);
	
    if (SYSM530M_grid[gridIndex].selectedItems.length == 0) {
        Utils.alert("대상을 선택해주세요.");
        return;
    }
    if (SYSM530M_grid[gridIndex].selectedItems.length > 1) {
        Utils.alert("한개만 선택해주세요.", function () {
            SYSM530M_grid[gridIndex].instance.clearSelection();
        });
        return;
    }
    var totalRecords = SYSM530M_grid[gridIndex].instance.dataSource.total();
    var index = SYSM530M_grid[gridIndex].instance.select().index();
    var from = index + 1;
    var to = from + val;
    
    if (1 > to || to > totalRecords) {
        return;
    }
    SYSM530M_grid[gridIndex].instance.dataSource.pushMove(to, SYSM530M_grid[gridIndex].instance.dataSource.at(index));
    SYSM530M_grid_fnTotalSorting(gridIndex);
}


function SYSM530M_grid_fnTotalSorting(gridIndex) {
    let result = false;
    let changeCnt = 0;

    $.each(SYSM530M_grid[gridIndex].dataSource.data(), function (index, item) {
        let scrnDispSeq = index + 1;
        if (item.scrnDispSeq != scrnDispSeq) {
            item.set("scrnDispSeq", scrnDispSeq);
            changeCnt++;
        }
    });

    if (changeCnt > 0) {
        result = true;
    }
    return result;
}

function SYSM530M_fnChk(e) {
    var grid = e.sender;
    var dataItem = grid.dataItem(e.sender.select());
}


function SYSM530M_fnSearchTenant() {
	Utils.setCallbackFunction("SYSM530M_fnSYSM101PCallback", function(tenantId) {
        $("#SYSM530M_tenantId").val(tenantId);
        GetTenantNm(tenantId, "SYSM530M_tenantNm");
        SYSM530M_fnSearchCustomLyotList();
    });
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM101P", "SYSM101P", 1100, 600, {callbackKey: "SYSM530M_fnSYSM101PCallback"})
}

function SYSM530M_fnOpenPopSYSM241P(gridIndex) {
    Utils.setCallbackFunction("SYSM530M_fnSYSM241PCallback", SYSM530M_fnSYSM241PCallback);
    Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM241P", "SYSM241P", 780, 550, {callbackKey: "SYSM530M_fnSYSM241PCallback"});
}

function SYSM530M_fnSYSM241PCallback(item) {
    SYSM530M_grid[1].currentItem.set("mgntItemCd", item.mgntItemCd);
    SYSM530M_grid[1].currentItem.set("mgntItemNm", item.mgntItemCdNm);
    SYSM530M_grid[1].currentItem.set("mgntItemTypCd", item.mgntItemTypCd);
    SYSM530M_grid[1].currentItem.set("dataSzIntMnriCnt", item.dataSzIntMnriCnt);
    SYSM530M_grid[1].currentItem.set("crypTgtYn", item.crypTgtYn);
}