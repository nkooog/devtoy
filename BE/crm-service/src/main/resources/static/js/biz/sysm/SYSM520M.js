/***********************************************************************************************
 * Program Name : 상담그룹코드 관리 (SYSM520M.js)
 * Creator      : wkim
 * Create Date  : 2023.02.13
 * Description  : 상담그룹코드 관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.02.13     wkim             최초작성
 ************************************************************************************************/
var SYSM520M_comCdList = new Array();
var SYSM520M_grid = new Array(1);
var SYSM520DataSource;

$(document).ready(function () {
	
	//1. input 박스에서 키보드 엔터 키를 눌렀을 경우 검색
	$("#SYSM520M_cnslGroupName").on("keyup", function (e) {
        if (e.keyCode == 13) {
        	SYSM520M_fnSearch();
        }
    });
	
	$("#SYSM520M_cnslGroupCode").on("keyup", function (e) {
        if (e.keyCode == 13) {
        	SYSM520M_fnSearch();
        }
    });
	
	//2. 그리드 설정
    for (let i = 0; i < SYSM520M_grid.length; i++) {
        SYSM520M_grid[i] = {
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

    SYSM520DataSource = {
		transport: {
        	read: function (options) {        		
    			
                let param = SYSM520M_getParamValue();
                
                $.extend(param, options.data);

                Utils.ajaxCall("/sysm/SYSM520SEL01", JSON.stringify(param), function (result) {
                    options.success(JSON.parse(result.list));
                });
            },
            create: function (options) {
                Utils.ajaxCall("/sysm/SYSM520INS01", JSON.stringify({
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
            		Utils.confirm(SYSM520M_langMap.get("SYSM520M.validMsg1"),
    				function(){
            			Utils.ajaxCall("/sysm/SYSM520UPT01", JSON.stringify({
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
            		Utils.ajaxCall("/sysm/SYSM520UPT01", JSON.stringify({
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
                SYSM520M_fnSearch();
            }
        },
        // pageSize: 25,
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "id",
                fields: {
                    dataFrmeClasCd		: {type: "string"},
                    pkgClasCd			: {type: "string"},
                    dataFrmTypCd		: {type: "string"},
                    dataFrmeCrdTypCd	: {type: "string"},
                    dataFrmId			: {type: "string"},
                    dataFrmKornNm		: {type: "string"},
                    dataFrmeTmplCd		: {type: "string"},
                    dataFrmeTmplCdOld	: {type: "string"},
                    lyotApclDvCd		: {type: "string"},
                }
            }
        }
    }
    
    SYSM520M_grid[0].instance = $("#SYSM520M_grid0").kendoGrid({
    	dataSource: SYSM520DataSource,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        sortable: false,
        resizable: true,
        noRecords: {
            template: '<div class="nodataMsg"><p>' + SYSM520M_langMap.get("fail.common.select") + '</p></div>'
        },
        dataBound: function (e) {
            SYSM520M_grid_fnOnDataBound(e, 0);
        },
        change: function (e) {
            SYSM520M_grid_fnOnChange(e, 0);
        },
        cellClose: function (e) {
        	 let grid = e.sender;
             let dataItem = e.model;

             //상담그룹코드에 동일한 값이 있는지 체크
             if (dataItem.id != dataItem.cnslGrpCd) {
                 // 그리드 체크
                 let totalList = SYSM520M_grid[0].instance.dataSource.data();
                 let filterList = totalList.filter(function (item) {
                	 
                	 //kw--- 20230214 : 값 추가 할 때 존재하는 값이 있는 체크
                	 //신규는 item.id와 dataItem.id가 없기 때문에 서로 같다는 조건을 탐.
                	 //그렇기에 item과 dataItem의 cnslGrpCd가 같더라도 true 조건을 타지 않는다.
                	 return (item.id != dataItem.id && item.cnslGrpCd == dataItem.cnslGrpCd)
                 });
                 
                 if (filterList.length > 0) {
                     Utils.alert(SYSM520M_langMap.get("SYSM520M.validMsg7"));
                     dataItem.set("cnslGrpCd", dataItem.id);
                     grid.refresh();
                     return false;
                 }
                
                let param = {
                	id: dataItem.cnslGrpCd,
                    tenantId: $("#SYSM520M_tenantId").val()
                }
                
                Utils.ajaxCall("/sysm/SYSM520SEL02", JSON.stringify(param), function (result) {
                    let list = JSON.parse(result.list);
                    if (list.length > 0) {
                        dataItem.set("cnslGrpCd", dataItem.id);
                        Utils.alert(SYSM520M_langMap.get("SYSM520M.validMsg7"));
                    }
                });
             }
             
             //상담그룹명에 동일한 값이 있는지 체크
             if (dataItem.cnslGrpNmOld != dataItem.cnslGrpNm) {
                 // 그리드 체크
                 let totalList = SYSM520M_grid[0].instance.dataSource.data();
                 let filterList = totalList.filter(function (item) {
                	 
                	 //kw--- 20230214 : 값 추가 할 때 존재하는 값이 있는 체크
                	 //신규는 item.id와 dataItem.id가 없기 때문에 서로 같다는 조건을 탐.
                	 //그렇기에 item과 dataItem의 cnslGrpCd가 같더라도 true 조건을 타지 않는다.
                	 return (item.id != dataItem.id && item.cnslGrpNm == dataItem.cnslGrpNm)
                 });
                 
                 if (filterList.length > 0) {
                	 Utils.alert(SYSM520M_langMap.get("SYSM520M.validMsg8"));
                     dataItem.set("cnslGrpNm", dataItem.cnslGrpNmOld);
                     grid.refresh();
                     return false;
                 }
                
                let param = {
                	cnslGrpNm : dataItem.cnslGrpNm,
                    tenantId: $("#SYSM520M_tenantId").val()
                }
                
                Utils.ajaxCall("/sysm/SYSM520SEL03", JSON.stringify(param), function (result) {
                    let list = JSON.parse(result.list);
                    if (list.length > 0) {
                        dataItem.set("cnslGrpNm", dataItem.cnslGrpNmOld);
                        Utils.alert(SYSM520M_langMap.get("SYSM520M.validMsg8"));
                    }
                });
            }
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
            	title: SYSM520M_langMap.get("SYSM520M.orgStCd"),	//상태 
            	type: "string", width: 20,
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
                field: "tenantId", 		
                title: SYSM520M_langMap.get("SYSM520M.tenantId"),	//태넌트ID
                type: "string", 
                width: 30,
                editable: function (dataItem) {
                    return false;
                }
            },
            { 
            	field: "cnslGrpCd",
            	title: SYSM520M_langMap.get("SYSM520M.cnslGroupCode"),	//상담그룹코드
            	type: "string", 
            	width: 40, 	
            	attributes: {"class": "k-text-left"},	
            },
            { 
            	field: "cnslGrpNm", 		
            	title: SYSM520M_langMap.get("SYSM520M.cnslGroupName"),	//상담그룹명
            	type: "string", 
            	width: 100,	
            	attributes: {"class": "k-text-left"},	
            },
            { 
            	field: "cnslGrpQueueId", 		
            	title: SYSM520M_langMap.get("SYSM520M.gridTitleCnslGrpQueueId"),	//상담그룹  큐ID
            	type: "string", 
            	width: 100,	
            	attributes: {"class": "k-text-left"},	
            },
            
            { 
            	field: "grpCdUseYn",
            	title: SYSM520M_langMap.get("SYSM520M.useYn"),	//사용여부
            	type: "string", 
            	width: 30,		
            	attributes: {"class": "k-text-left"},
            	template: function (dataItem) {
                    return Utils.getComCdNm(SYSM520M_comCdList, 'C0004', $.trim(dataItem.grpCdUseYn));
                },
                editor: function (container, options) {
                	SYSM520M_grid_fnComboEditor(container, options, 0, "C0004", "선택");
                },
            },
            { 
            	field: "regUsrNm", 		
            	title: SYSM520M_langMap.get("SYSM520M.regrId"),	//등록자
            	type: "string", 
            	width: 40, 	
            	attributes: {"class": "k-text-left"},
            	editable: function (dataItem) {
                    return false;
                }
            },
            { 
            	field: "regOrgNm", 		
            	title: SYSM520M_langMap.get("SYSM520M.gridTitleRegOrgNm"),	//title: "등록자조직", 	
            	type: "string", 
            	width: 50, 	
            	attributes: {"class": "k-text-left"},
            	editable: function (dataItem) {
                    return false;
                }
            },
            { 
            	field: "regDtm", 			
            	title: SYSM520M_langMap.get("SYSM520M.gridTitleRegDtm"),	//title: "등록일", 		
            	type: "string",	
            	width: 50,
            	editable: function (dataItem) {
                    return false;
                }
            },
            { 
            	field: "lstUsrNm", 		
            	title: SYSM520M_langMap.get("SYSM520M.lstCorprId"),	//title: "최종수정자", 	
            	type: "string",	
            	width: 40,	
            	attributes: {"class": "k-text-left"},
            	editable: function (dataItem) {
                    return false;
                }
            },
            { 
            	field: "lstOrgNm", 		
            	title: SYSM520M_langMap.get("SYSM520M.gridTitleLstCorcNm"),	//title: "수정자조직", 	
            	type: "string",	
            	width: 50,	
            	attributes: {"class": "k-text-left"},
            	editable: function (dataItem) {
                    return false;
                }
            },
            { 
            	field: "lstCorcDtm",
            	title: SYSM520M_langMap.get("SYSM520M.lstCorcDtm"),	//title: "최종수정일", 	
            	type: "string",	
            	width: 50,
            	editable: function (dataItem) {
                    return false;
                }
            },
           
        ],
        dataBound: function(e) {
            // iterate the data items and apply row styles where necessary
        	var rows = this.items();
            $(rows).each(function () {
                var index = $(this).index() + 1;
                var rowLabel = $(this).find(".row-number");
                $(rowLabel).html(index);
            });
        },
    }).data("kendoGrid");

    Utils.setKendoGridDoubleClickAction("#SYSM520M_grid0");

    SYSM520M_fnGridResize();
    $(window).on("resize", function () { SYSM520M_fnGridResize();});

    SYSM520M_fnInit();
});

function SYSM520M_getParamValue() {	
	
	var cnslGroupCode 		= $("#SYSM520M_cnslGroupCode").val();
	var cnslGroupName 		= $("#SYSM520M_cnslGroupName").val();
	var useYn			 	= $("#SYSM520M_useYN").val();
	
	if(cnslGroupCode == null) 	{ cnslGroupCode = ""; }
	if(cnslGroupName == null) 	{ cnslGroupName = ""; }
	if(useYn == null) 			{ useYn = ""; }
	
	return {
		tenantId		: $("#SYSM520M_tenantId").val(),
		cnslGroupCode	: cnslGroupCode,
		cnslGroupName	: cnslGroupName,
		useYn			: useYn,
	}
}

function SYSM520M_fnInit() {
    let param = {
        "codeList": [
            {"mgntItemCd": "C0004"}, // 사용여부
        ]
    };

    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        SYSM520M_comCdList = JSON.parse(result.codeList);
        
        Utils.setKendoComboBox(SYSM520M_comCdList, "C0004", "#SYSM520M_useYN", "", false);

        const SYSM520M_fnGridClear = () => {
            SYSM520M_grid[0].instance.clearSelection();
            SYSM520M_grid[0].currentItem = new Object();
            SYSM520M_grid[0].instance.dataSource.data([]);

            $("#SYSM520M_useYN").data("kendoComboBox").select(0);

        }
        CMMN_SEARCH_TENANT["SYSM520M"].fnInit(null,SYSM520M_fnSearch,SYSM520M_fnGridClear);
    });
}

function SYSM520M_fnSearch() {

    Utils.markingRequiredField();

    if (Utils.isNull($("#SYSM520M_tenantId").val())) {
        Utils.alert(SYSM520M_langMap.get("SYSM520M.validMsg2"), function () {
            $("#SYSM520M_tenantId").focus();
        });

        return false;
    }

    SYSM520M_grid[0].instance.clearSelection();
    SYSM520M_grid[0].currentItem = new Object();
    SYSM520M_grid[0].instance.dataSource.read();
}

function SYSM520M_grid_fnOnDataBound(e, gridIndex) {
    let grid = e.sender;
    let rows = grid.items();

    SYSM520M_grid[gridIndex].record = 0;

    rows.off("click").on("click", function (e) {
        let dataItem = grid.dataItem(this);
        let cellIndex = $(e.target).index();

        SYSM520M_grid[gridIndex].currentItem = dataItem;
        SYSM520M_grid[gridIndex].currentCellIndex = cellIndex;
    });

    if (gridIndex == 0 && SYSM520M_grid[gridIndex].loadCount == 0) {
        $("#SYSM520M_grid" + gridIndex + " tbody tr:first td:eq(11) button").trigger("click");
    }

    SYSM520M_grid[gridIndex].loadCount++;
}

function SYSM520M_grid_fnOnChange(e, gridIndex) {
    let rows = e.sender.select(),
        items = [];

    rows.each(function(e) {
        let dataItem = SYSM520M_grid[gridIndex].instance.dataItem(this);
        items.push(dataItem);
    });
  
    SYSM520M_grid[gridIndex].selectedItems = items;
}

function SYSM520M_grid_fnComboEditor(container, options, gridIndex, code, isTotalOption) {
	
	let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);

    Utils.setKendoComboBox(SYSM520M_comCdList, code, $select, "", isTotalOption).bind("change", function (e) {
        let element = e.sender.element;
        let row = element.closest("tr");
        let dataItem = SYSM520M_grid[gridIndex].instance.dataItem(row);


        dataItem.set(options.field, e.sender.value());

        SYSM520M_grid[gridIndex].instance.refresh();
    });
}

function SYSM520M_fnAdd(gridIndex) {

    let row = new Object();
    
    //추가시 자동으로 추가할 값을 넣음
    let regInfo = {
        tenantId: $("#SYSM520M_tenantId").val(),
    }
    
    //kw---20230214 : 새로 추가할때 각 컬럼 값들을 초기화 해야 함.
    //콤보박스 클릭시 0번째 값으로 자동 선택이 됨. 초기화 하지 않으면 아무것도 선택되어 있지 않음
    if (gridIndex == 0) {
        row.cnslGrpCd = "";
        row.cnslGrpNm = "";
        row.grpCdUseYn = "";
    }
    
    SYSM520M_grid[gridIndex].instance.dataSource.add($.extend(row, regInfo));
    SYSM520M_grid[gridIndex].instance.refresh();
    SYSM520M_grid[gridIndex].instance.clearSelection();
    SYSM520M_grid[gridIndex].instance.content.scrollTop((SYSM520M_grid[gridIndex].instance).tbody.height());
    SYSM520M_grid[gridIndex].instance.tbody.find("tr:last td:eq(0)").click();
}

function SYSM520M_fnGridResize() {
	let screenHeight = $(window).height()-200;
	SYSM520M_grid[0].instance.element.find('.k-grid-content').css('height', screenHeight-225);       
}

//kw--- grid crud
//create 저장
function SYSM520M_fnSync(gridIndex) {
	let isValid = true;
    
    let insertInfo = {
		regUserId: '000000',					//,GLOBAL.session.user.usrId,
		regOrgCd: '1',						//,GLOBAL.session.user.orgCd,
		lstUserId: '000000',					//,GLOBAL.session.user.usrId,
		lstOrgCd: '1',						//,GLOBAL.session.user.orgCd,
    }

    $.each(SYSM520M_grid[gridIndex].instance.dataSource.data(), function (index, item) {
    	$.extend(item, insertInfo);
        if (gridIndex == 0) {
            if (Utils.isNull(item.cnslGrpCd)) {
                Utils.alert(SYSM520M_langMap.get("SYSM520M.validMsg3"));
                isValid = false;
                return false;
            }
            if (Utils.isNull(item.cnslGrpNm)) {
                Utils.alert(SYSM520M_langMap.get("SYSM520M.validMsg4"));
                isValid = false;
                return false;
            }
            
            if (Utils.isNull(item.grpCdUseYn)) {
                Utils.alert(SYSM520M_langMap.get("SYSM520M.validMsg5"));
                isValid = false;
                return false;
            }
        } 
    });

    if (isValid) {
        Utils.confirm(SYSM520M_langMap.get("common.save.msg"), function () {
        	SYSM520M_grid[gridIndex].instance.dataSource.sync().then(function (result) {
        		Utils.alert(SYSM520M_langMap.get("success.common.save"));
        	});
        });
    }
}

function SYSM520M_fnDelete(gridIndex) {
    let reqPath = "";
    let readParam = new Object();
    let selectedItems = SYSM520M_grid[gridIndex].selectedItems;

    if (selectedItems.length == 0) {
        Utils.alert(SYSM520M_langMap.get("SYSM520M.validMsg6"));
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
        reqPath = "/sysm/SYSM520DEL01";
    }

    Utils.confirm(SYSM520M_langMap.get("common.delete.msg"), function () {
        Utils.ajaxCall(reqPath, JSON.stringify({
            list: selectedItems
        }), function (result) {
            Utils.alert(SYSM520M_langMap.get("success.common.delete"), function() {
                if (gridIndex == 0) {
                    SYSM520M_fnSearch();
                }
            });
        });
    });
}