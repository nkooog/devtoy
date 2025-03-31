/***********************************************************************************************
 * Program Name : 상담그룹코드 관리 (SYSM436M.js)
 * Creator      : wkim
 * Create Date  : 2023.02.13
 * Description  : 상담그룹코드 관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.02.13     wkim             최초작성
 ************************************************************************************************/
var SYSM436M_comCdList = new Array();
var SYSM436M_grid = new Array(1);
var SYSM436DataSource;

$(document).ready(function () {
	
	//2. 그리드 설정
    for (let i = 0; i < SYSM436M_grid.length; i++) {
        SYSM436M_grid[i] = {
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

    SYSM436DataSource = {
		transport: {
        	read: function (options) {    

                let param = SYSM436M_getParamValue();
                
                $.extend(param, options.data);

                Utils.ajaxCall("/sysm/SYSM436SEL01", JSON.stringify(param), function (result) {
                    options.success(JSON.parse(result.list));
                });
            },
            create: function (options) {
                Utils.ajaxCall("/sysm/SYSM436INS01", JSON.stringify({
                    list: options.data.models
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            update: function (options) {
            	var vrbsUpdateFlg = false;
            	for(var i = 0; i < options.data.models.length; i++) {
            		if ( options.data.models[i].vrbsCd != options.data.models[i].vrbsCdOld ) {
            			vrbsUpdateFlg = true;
            			options.data.models[i]['vrbsUpdateFlg'] = 'Y';
                	}else {
                		options.data.models[i]['vrbsUpdateFlg'] = 'N';
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
                
            	if ( vrbsUpdateFlg ) {
            		Utils.confirm(SYSM436M_langMap.get("SYSM436M.validMsg1"),
    				function(){
            			Utils.ajaxCall("/sysm/SYSM436UPT01", JSON.stringify({
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
            		Utils.ajaxCall("/sysm/SYSM436UPT01", JSON.stringify({
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
                SYSM436M_fnSearch();
            }
        },
        // pageSize: 25,
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "id",
                fields: {
                	tenantId		: {field: "tenantId", 		type: "string"},
                    srtSeq			: {field: "srtSeq", 		type: "string"},
                    vrbsClasCd		: {field: "vrbsClasCd", 	type: "string"},
                    vrbsCd			: {field: "vrbsCd", 		type: "string"},
                    vrbsVlu			: {field: "vrbsVlu", 		type: "string"},
                    refn1			: {field: "refn1", 			type: "string"},
                    refn2			: {field: "refn2", 			type: "string"},
                    refn3			: {field: "refn3", 			type: "string"},
                    refn4			: {field: "refn4", 			type: "string"},
                    refn5			: {field: "refn5", 			type: "string"},
                    useYn			: {field: "useYn", 			type: "string"},
                    lstCorprNm		: {field: "lstCorprNm", 	type: "string"},
                    lstCorcDtm		: {field: "lstCorcDtm", 	type: "string"},
                    abolmnNm		: {field: "abolmnNm", 		type: "string"},
                    aboldTm			: {field: "aboldTm", 		type: "string"},
                }
            }
        }
    };
    
    SYSM436M_grid[0] = $("#SYSM436M_grid0").kendoGrid({
    	dataSource: SYSM436DataSource,
        autoBind: true,
        selectable: "multiple,row",
        persistSelection: true,
        sortable: false,
        resizable: true,
        dataBinding: function () {
            record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        dataBound: function (e) {
            SYSM436M_grid_fnOnDataBound(e, 0);
        },
        change: function (e) {
            SYSM436M_grid_fnOnChange(e, 0);
        },
        cellClose: function (e) {
        	 let grid = e.sender;
             let dataItem = e.model;
             //상담그룹코드에 동일한 값이 있는지 체크
             
             if (dataItem.id != dataItem.vrbsCd) {
                 // 그리드 체크
                 let totalList = SYSM436M_grid[0].dataSource.data();
                 let filterList = totalList.filter(function (item) {
                	 
                	 //kw--- 20230214 : 값 추가 할 때 존재하는 값이 있는 체크
                	 //신규는 item.id와 dataItem.id가 없기 때문에 서로 같다는 조건을 탐.
                	 //그렇기에 item과 dataItem의 cnslGrpCd가 같더라도 true 조건을 타지 않는다.
                	 return (item.id != dataItem.id && item.vrbsCd == dataItem.vrbsCd)
                 });

                 if (filterList.length > 0) {
                     Utils.alert(SYSM436M_langMap.get("SYSM436M.validMsg7"));
                     dataItem.set("vrbsCd", dataItem.id);
                     grid.refresh();
                     return false;
                 }
                
                let param = {
                	id: dataItem.vrbsCd,
                    tenantId: $("#SYSM436M_tenantId").val()
                }
                
                Utils.ajaxCall("/sysm/SYSM436SEL02", JSON.stringify(param), function (result) {
                    let list = JSON.parse(result.list);
                    if (list.length > 0) {
                        dataItem.set("vrbsCd", dataItem.id);
                        Utils.alert(SYSM436M_langMap.get("SYSM436M.validMsg7"));
                    }
                });
             }
        },
        columns: [
            { 	
            	selectable: true, 
            	width: 50,
            },
            { 
            	field: "status", 		
            	title: SYSM436M_langMap.get("SYSM436M.orgStCd"),	//상태 
            	type: "string", width: 80,
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
                title: SYSM436M_langMap.get("SYSM436M.tenantId"),	//태넌트ID
                type: "string", 
                width: 100,
                editable: function (dataItem) {
                    return false;
                }
            },
            { 
            	field: "srtSeq",
            	title: "No",	//정렬순서 
            	width: 50, 
            	attributes: {"class": "k-text-right"},	
                editable: function (dataItem) {
                    return false;
                }
            },
            { 
            	field: "vrbsClasCd",
            	title: SYSM436M_langMap.get("SYSM436M.gridVrbsClasCd"),	//변수분류코드
            	type: "string", 
            	width: 100, 	
            	attributes: {"class": "k-text-left"},
            	template: function (dataItem) {
                    return Utils.getComCdNm(SYSM436M_comCdList, 'C0095', $.trim(dataItem.vrbsClasCd));
                },
                editor: function (container, options) {
                	SYSM436M_grid_fnComboEditor(container, options, 0, "C0095", "선택");
                },
            },
            { 
            	field: "vrbsCd", 		
            	title: SYSM436M_langMap.get("SYSM436M.gridVrbsCd"),	//변수코드
            	type: "string", 
            	width: 100,	
            },
            { 
            	field: "vrbsVlu",
            	title: SYSM436M_langMap.get("SYSM436M.gridVrbsVlu"),	//변수값
            	type: "string", 
            	width: 300,
            	maxLength: 5,
            	attributes: {"class": "k-text-left"},
            },
            { 
            	field: "refn1", 		
            	title: SYSM436M_langMap.get("SYSM436M.gridRefn") + "1",	//참조1
            	type: "string", 
            	width: 100, 	
            	attributes: {"class": "k-text-left"},
            },
            { 
            	field: "refn2", 		
            	title: SYSM436M_langMap.get("SYSM436M.gridRefn") + "2",	//참조2
            	type: "string", 
            	width: 100, 	
            	attributes: {"class": "k-text-left"},
            },
            { 
            	field: "refn3", 		
            	title: SYSM436M_langMap.get("SYSM436M.gridRefn") + "3",	//참조3
            	type: "string", 
            	width: 100, 	
            	attributes: {"class": "k-text-left"},
            },
            { 
            	field: "refn4", 		
            	title: SYSM436M_langMap.get("SYSM436M.gridRefn") + "4",	//참조4
            	type: "string", 
            	width: 100, 	
            	attributes: {"class": "k-text-left"},
            },
            { 
            	field: "refn5", 		
            	title: SYSM436M_langMap.get("SYSM436M.gridRefn") + "5",	//참조5
            	type: "string", 
            	width: 100, 	
            	attributes: {"class": "k-text-left"},
            },
            { 
            	field: "useYn",
            	title: SYSM436M_langMap.get("SYSM436M.useYn"),	//사용여부
            	type: "string", 
            	width: 100, 	
            	attributes: {"class": "k-text-left"},
            	template: function (dataItem) {
                    return Utils.getComCdNm(SYSM436M_comCdList, 'C0004', $.trim(dataItem.useYn));
                },
                editor: function (container, options) {
                	SYSM436M_grid_fnComboEditor(container, options, 0, "C0004", "선택");
                },
            },
            { 
            	field: "lstCorprNm", 		
            	title: SYSM436M_langMap.get("SYSM436M.gridLstCorprId"),	//title: "최종수정자", 	
            	type: "string",	
            	width: 120,	
            	attributes: {"class": "k-text-left"},
            	editable: function (dataItem) {
                    return false;
                }
            },
            { 
            	field: "lstCorcDtm",
            	title: SYSM436M_langMap.get("SYSM436M.gridLstCorcDtm"),	//title: "최종수정일", 	
            	type: "string",	
            	width: 120,
            	editable: function (dataItem) {
                    return false;
                }
            },
            { 
            	field: "abolmnNm", 		
            	title: SYSM436M_langMap.get("SYSM436M.girdAbolmnId"),	//title: "폐기자", 	
            	type: "string",	
            	width: 120,	
            	attributes: {"class": "k-text-left"},
            	editable: function (dataItem) {
                    return false;
                }
            },
            { 
            	field: "aboldTm",
            	title: SYSM436M_langMap.get("SYSM436M.gridAboldTm"),	//title: "폐기일시", 	
            	type: "string",	
            	width: 120,
            	editable: function (dataItem) {
                    return false;
                }
            },
           
        ],
        edit: function (e) {
    		e.container.find("input[name=vrbsCd]").attr("maxlength", 5);		//변수코드 입력시 길이 제한
        },
        dataBound: function(e) {
            // iterate the data items and apply row styles where necessary
        	var rows = this.items();
            $(rows).each(function () {
                var index = $(this).index() + 1;
                var rowLabel = $(this).find(".row-number");
                $(rowLabel).html(index);
            });
            
            var dataItems = e.sender.dataSource.view();
            for (var j = 0; j < dataItems.length; j++) {
            	
              // Get the value of the discontinued cell from the current dataItem.
              var discontinued = dataItems[j].get("useYn");

              var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
             
              if(discontinued == "N"){
            	  var cell = row.children();
                  cell.addClass("totalColor");
              }   
            }
        },
        noRecords: { template: '<div class="nodataMsg"><p>'+SYSM436M_langMap.get("grid.nodatafound")+'</p></div>' },
    }).data("kendoGrid");

    Utils.setKendoGridDoubleClickAction("#SYSM436M_grid0");

    SYSM436M_fnGridResize();
    $(window).on("resize", function () { SYSM436M_fnGridResize();});

    SYSM436M_fnInit();
});

function SYSM436M_getParamValue() {	
	
	var vrbsClasCd 			= $("#SYSM436M_vrbsClasCd").val();
	var vrbsVlu 			= $("#SYSM436M_vrbsVlu").val();
	var useYn			 	= $("#SYSM436M_useYN").val();
	
	if(vrbsClasCd 	== null) 		{ vrbsClasCd = ""; }
	if(vrbsVlu 		== null) 		{ vrbsVlu = ""; }
	if(useYn		== null) 			{ useYn = ""; }
	
	
	if(Utils.isNull(vrbsVlu)){
		$('#SYSM436_btnUp').attr('disabled', false);
		$('#SYSM436_btnDown').attr('disabled', false);
		$('#SYSM436_btnAdd').attr('disabled', false);
	} else {
		$('#SYSM436_btnUp').attr('disabled', true);
		$('#SYSM436_btnDown').attr('disabled', true);
		$('#SYSM436_btnAdd').attr('disabled', true);
	}
	
	
	
	return {
		tenantId		: $("#SYSM436M_tenantId").val(),
		vrbsClasCd		: vrbsClasCd,
		vrbsVlu			: vrbsVlu,
		useYn			: useYn,
	}
}

function SYSM436M_fnInit() {
    let param = {
        "codeList": [
        	{"mgntItemCd": "C0095"}, // 항복구분코드(변수관리코드)
            {"mgntItemCd": "C0004"}, // 사용여부
            
        ]
    };

    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
        SYSM436M_comCdList = JSON.parse(result.codeList);
        
        Utils.setKendoComboBox(SYSM436M_comCdList, "C0095", "#SYSM436M_vrbsClasCd", "", "전체");
        Utils.setKendoComboBox(SYSM436M_comCdList, "C0004", "#SYSM436M_useYN", "", "전체");

        const SYSM436M_fnGridClear = () => {
            SYSM436M_grid[0].clearSelection();
            SYSM436M_grid[0].currentItem = new Object();
            SYSM436M_grid[0].dataSource.data([]);

            $("#SYSM436M_vrbsClasCd").data("kendoComboBox").select(0);
            $("#SYSM436M_useYN").data("kendoComboBox").select(0);

        }
        CMMN_SEARCH_TENANT["SYSM436M"].fnInit(null,SYSM436M_fnSearch,SYSM436M_fnGridClear, comboItemRemove("SYSM436M_vrbsClasCd", 2));
    });
    
    
}

//검색 부분에 있는 변수분류코드 콤보박스중 직접입력 아이템 삭제
function comboItemRemove(id, idx){
	
	ddl =  $("#" + id).data("kendoComboBox");
    var oldData = ddl.dataSource.data();
    
    ddl.dataSource.remove(oldData[idx]); //remove first item
}

function SYSM436M_fnSearch() {
	
    Utils.markingRequiredField();

    if (Utils.isNull($("#SYSM436M_tenantId").val())) {
        Utils.alert(SYSM436M_langMap.get("SYSM436M.validMsg2"), function () {
            $("#SYSM436M_tenantId").focus();
        });

        return false;
    }

    SYSM436M_grid[0].clearSelection();
    SYSM436M_grid[0].currentItem = new Object();
    SYSM436M_grid[0].dataSource.read();
}

function SYSM436M_grid_fnOnDataBound(e, gridIndex) {
    let grid = e.sender;
    let rows = grid.items();

    SYSM436M_grid[gridIndex].record = 0;

    rows.off("click").on("click", function (e) {
        let dataItem = grid.dataItem(this);
        let cellIndex = $(e.target).index();

        SYSM436M_grid[gridIndex].currentItem = dataItem;
        SYSM436M_grid[gridIndex].currentCellIndex = cellIndex;
    });

    if (gridIndex == 0 && SYSM436M_grid[gridIndex].loadCount == 0) {
        $("#SYSM436M_grid" + gridIndex + " tbody tr:first td:eq(11) button").trigger("click");
    }

    SYSM436M_grid[gridIndex].loadCount++;
}

function SYSM436M_grid_fnOnChange(e, gridIndex) {
	
    let rows = e.sender.select(),
        items = [];

    rows.each(function(e) {
        let dataItem = SYSM436M_grid[gridIndex].dataItem(this);
        items.push(dataItem);
    });
    
    SYSM436M_grid[gridIndex].selectedItems = items;
}

function SYSM436M_grid_fnComboEditor(container, options, gridIndex, code, isTotalOption) {
	
	let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);
	
	//직접 입력 부분을 빼고 콤보 박스를 셋팅하기 위한 for문
	var arr =new Array(1);
    for(var i=0; i<SYSM436M_comCdList.length; i++) {
    	if(SYSM436M_comCdList[i].comCdNm != SYSM436M_langMap.get("SYSM436M.directInput")){
    		arr.push(SYSM436M_comCdList[i]);
    	}
    }
    //직접 입력 부분을 빼고 콤보 박스를 셋팅하기 위한 for문 끝
	
    Utils.setKendoComboBox(arr, code, $select, "", isTotalOption).bind("change", function (e) {
        let element = e.sender.element;
        
        let row = element.closest("tr");
        let dataItem = SYSM436M_grid[gridIndex].dataItem(row);

        dataItem.set(options.field, e.sender.value());

        SYSM436M_grid[gridIndex].refresh();
    });    
}

function SYSM436M_fnAdd(gridIndex) {

	var totalNum = SYSM436M_grid[gridIndex].dataSource.total() + 1;
	
    let row = new Object();
    
    //추가시 자동으로 추가할 값을 넣음
    let regInfo = {
        tenantId	: $("#SYSM436M_tenantId").val(),
    }
    
    //kw---20230214 : 새로 추가할때 각 컬럼 값들을 초기화 해야 함.
    //콤보박스 클릭시 0번째 값으로 자동 선택이 됨. 초기화 하지 않으면 아무것도 선택되어 있지 않음
    if (gridIndex == 0) {
        row.useYn = "";
        row.vrbsClasCd = "";
    }
    
    SYSM436M_grid[gridIndex].dataSource.add($.extend(row, regInfo));
    SYSM436M_grid[gridIndex].refresh();
    SYSM436M_grid[gridIndex].clearSelection();
    SYSM436M_grid[gridIndex].content.scrollTop((SYSM436M_grid[gridIndex]).tbody.height());
    SYSM436M_grid[gridIndex].tbody.find("tr:last td:eq(0)").click();
}

function SYSM436M_fnGridResize() {
	let screenHeight = $(window).height()-200;
	SYSM436M_grid[0].element.find('.k-grid-content').css('height', screenHeight-225);       
}

//그리드 항목 정렬 순서 변경
function SYSM436M_fnUpDown(gridIndex, val) {
	  if (SYSM436M_grid[gridIndex].selectedItems.length == 0) {
		  Utils.alert(SYSM436M_langMap.get("SYSM436M.validMsg9"));
		  return;
		}
		if (SYSM436M_grid[gridIndex].selectedItems.length > 1) {
		  Utils.alert(SYSM436M_langMap.get("SYSM436M.validMsg10"), function () {
		  	SYSM436M_grid[gridIndex].clearSelection();
		  });
		  return;
		}
		
		let totalRecords = SYSM436M_grid[gridIndex].dataSource.total();
		let index = SYSM436M_grid[gridIndex].select().index();
		let from = index + 1;
		let to = from + val;
		
		if (1 > to || to > totalRecords) {
		  return;
		}
		
		SYSM436M_grid[gridIndex].dataSource.pushMove(to, SYSM436M_grid[gridIndex].dataSource.at(index));
		
		SYSM436M_grid_fnTotalSorting(gridIndex);
	}

function SYSM436M_grid_fnTotalSorting(gridIndex) {
    let result = false;
    let changeCnt = 0;

    $.each(SYSM436M_grid[gridIndex].dataSource.data(), function (index, item) {
        let srtSeq = index + 1;
        if (item.srtSeq != srtSeq) {
            item.set("srtSeq", srtSeq);
            changeCnt++;
        }
    });

    if (changeCnt > 0) {
        result = true;
    }

    return result;
}

//kw--- grid crud
//create 저장
function SYSM436M_fnSync(gridIndex) {	
	
	let isValid = true;
    
    let insertInfo = {
    	regUserId: GLOBAL.session.user.usrId,					//,GLOBAL.session.user.usrId,
    	regOrgCd: GLOBAL.session.user.orgCd,						//,GLOBAL.session.user.orgCd,
		lstUserId: GLOBAL.session.user.usrId,					//,GLOBAL.session.user.usrId,
		lstOrgCd: GLOBAL.session.user.orgCd,						//,GLOBAL.session.user.orgCd,
    }

    $.each(SYSM436M_grid[gridIndex].dataSource.data(), function (index, item) {
    	$.extend(item, insertInfo);
    	
        if (gridIndex == 0) {
            
        	//변수분류코드
        	if (Utils.isNull(item.vrbsClasCd)) {
        		Utils.alert(SYSM436M_langMap.get("SYSM436M.validMsg3"));
        		isValid = false;
        		return false;
        	}
        	
        	//변수코드
        	if (Utils.isNull(item.vrbsCd)) {
        		Utils.alert(SYSM436M_langMap.get("SYSM436M.validMsg4"));
        		isValid = false;
        		return false;
        	}
        	
        	//변수값
        	if (Utils.isNull(item.vrbsVlu)) {
        		Utils.alert(SYSM436M_langMap.get("SYSM436M.validMsg8"));
        		isValid = false;
        		return false;
        	}
        	
        	//사용여부
            if (Utils.isNull(item.useYn)) {
                Utils.alert(SYSM436M_langMap.get("SYSM436M.validMsg5"));
                isValid = false;
                return false;
            }
        } 
    });
    
    if (isValid) {
        Utils.confirm(SYSM436M_langMap.get("common.save.msg"), function () {
        	SYSM436M_grid[gridIndex].dataSource.sync().then(function (result) {
        		Utils.alert(SYSM436M_langMap.get("success.common.save"));
        	});
        });
    }
}

//삭제
function SYSM436M_fnDelete(gridIndex) {

    let reqPath = "";
    let readParam = new Object();
    let selectedItems = SYSM436M_grid[gridIndex].selectedItems;

    if (selectedItems.length == 0) {
        Utils.alert(SYSM436M_langMap.get("SYSM436M.validMsg6"));
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
        reqPath = "/sysm/SYSM436DEL01";
    }

    Utils.confirm(SYSM436M_langMap.get("common.delete.msg"), function () {
        Utils.ajaxCall(reqPath, JSON.stringify({
            list: selectedItems
        }), function (result) {
            Utils.alert(SYSM436M_langMap.get("success.common.delete"), function() {
                if (gridIndex == 0) {
                    SYSM436M_fnSearch();
                }
            });
        });
    });
}

//폐기
function SYSM436M_fnAbold(gridIndex) {

    let reqPath = "";
    let readParam = new Object();
    let selectedItems = SYSM436M_grid[gridIndex].selectedItems;

    if (selectedItems.length == 0) {
        Utils.alert(SYSM436M_langMap.get("SYSM436M.validMsg6"));
        return;
    }

    let delInfo = {
    	aboldUserId: GLOBAL.session.user.usrId,
    	aboldOrgCd: GLOBAL.session.user.orgCd
    }

    $.each(selectedItems, function(index, item){
        $.extend(item, delInfo);
    });

    if (gridIndex == 0) {
        reqPath = "/sysm/SYSM436UPT02";
    }

    Utils.confirm(SYSM436M_langMap.get("common.delete.msg"), function () {
        Utils.ajaxCall(reqPath, JSON.stringify({
            list: selectedItems
        }), function (result) {
            Utils.alert(SYSM436M_langMap.get("success.common.delete"), function() {
                if (gridIndex == 0) {
                    SYSM436M_fnSearch();
                }
            });
        });
    });
}

//엑셀 다운로드
function SYSM436M_excelExport(gridIndex) {
	var today = new Date();

	var year = today.getFullYear();
	var month = ('0' + (today.getMonth() + 1)).slice(-2);
	var day = ('0' + today.getDate()).slice(-2);

	var dateString = year + month  + day;
	
	SYSM_excelExport(SYSM436M_grid[gridIndex], dateString + "_" + SYSM436M_langMap.get("SYSM436M.title"));
}

function SYSM_excelExport(targetGrid, fileName) {
    const pageSize = targetGrid.dataSource.view().length;
    if (pageSize === 0) {
        Utils.alert(SYSM436M_langMap.get("fail.common.select"));
        return;
    }

    targetGrid.bind("excelExport", function (e) {
        e.workbook.fileName = fileName;
        let sheet = e.workbook.sheets[0];

        let setDataItem = {};
        let selectableNum = 0;
        
        if (this.columns[0].selectable) {
            selectableNum++;
        }  
        if (this.columns[0].template === '#= ++record #') {
            record = 0;
        }
        this.columns.forEach(function (item, index) {
            if (Utils.isNotNull(item.template)) {
                let targetTemplate = kendo.template(item.template);
                let fieldName = item.field;
                for (let i = 1; i < sheet.rows.length; i++) {
                    let row = sheet.rows[i];
                    
                    //kw--- 20230303 : 상태 항목 관련하여 예외 처리 추가
                    //상태 항목을 체크 할때 해당 값이 null 이므로 targetTemplate 함수 실행시 에러 발생
                    if(row.cells[(index - selectableNum)].value != null){
                    	setDataItem = {
                                [fieldName]: row.cells[(index - selectableNum)].value
                            }
                    	row.cells[(index - selectableNum)].value = targetTemplate(setDataItem);
                    }

                }
            }
        })
    });
    targetGrid.saveAsExcel();
//    targetGrid.dataSource.pageSize(pageSize);
}