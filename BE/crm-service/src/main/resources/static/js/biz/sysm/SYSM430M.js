/***********************************************************************************************
* Program Name : SMS템플릿 관리 - MAIN(SYSM430M.js)
* Creator      : 강동우
* Create Date  : 2022.04.28
* Description  : SMS템플릿 관리 - MAIN
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.28     강동우            최초생성
************************************************************************************************/

var SYSM430M_comCdList;
var SYSM430M_totalMenuList;
var SYSM430M_codePopupTarget;
var SYSM430M_grid = new Array(3);
var SYSM430M_tmplMgntNo;
var CMMT300P_fileList=[],  CMMT300P_sizeLimitCnt= 0, CMMT300P_blthgStCd = 0, CMMT300P_cntLimitCnt;

var SYSM430M_selectItemGird0 = 0;
var SYSM430M_lastSelectedItemGrid0 = [];

var SYSM430M_smsTmplFileInfo = [];
var COMPRESS_LIST = [] //파일 업로드 시 이미지 크기 조절된 대상 저장 배열
var MAX_SIZE = 1 * 1024 * 1024 / 3
for (let i = 0; i < SYSM430M_grid.length; i++) {
	SYSM430M_grid[i] = {
        instance: {},
        dataSource: {},
        currentItem: {},
        currentCellIndex: Number(),
        selectedItems: [],
        loadCount: 0
    }
}

$(document).ready(function () {
	
	SYSM430MGrid();
	
	SYSM430M_fnInit();
	
	CMMN_SEARCH_TENANT["SYSM430M"].fnInit(null,SYSM430M_fnSearchTopMenuList);
	
	GridResizeTableSYSM430M();
	
	$(window).on({ 
		'resize': function() {
			GridResizeTableSYSM430M();   
		},   
	});
	
	//kw---20240325 : 검색 엔터키 처리
	Utils.ElementEnterKeyUp("SYSM430M_tmplNmSerch", function(){
		SYSM430M_fnSearchTopMenuList();
	});
	
	//kw---20240327 : 첨부파일 마우스 오버시 미리보기 기능 추가
	$("#SYSM430M_divImgPreView1").hide();
	$("#SYSM430M_divImgPreView2").hide();
	$("#SYSM430M_divImgPreView3").hide();
	
	SYSM430M_showImagePreview("#SYSM430M_inputFileName1", "#SYSM430M_divImg1", "#SYSM430M_divImgPreView1", 0);
	SYSM430M_showImagePreview("#SYSM430M_inputFileName2", "#SYSM430M_divImg2", "#SYSM430M_divImgPreView2", 1);
	SYSM430M_showImagePreview("#SYSM430M_inputFileName3", "#SYSM430M_divImg3", "#SYSM430M_divImgPreView3", 2);
});

function SYSM430MGrid() {
	
	SYSM430M_grid[0].dataSource = new kendo.data.DataSource({
        transport: {
        	read: function (options) {
        		
        		var SYSM430M_0_param = {
        				//tenantId	: GLOBAL.session.user.tenantId,
        				tenantId	: $("#SYSM430M_tenantId").val(),
        				tmplDvCd 	: $('input[id=ComboBox_SYSM430M_1]').val(),
        				useDvCd		: $('input[id=ComboBox_SYSM430M_2]').val(),
        				tmplNm		: $('input[id=SYSM430M_tmplNmSerch').val()
        		    }
        		
                Utils.ajaxCall("/sysm/SYSM430SEL01", JSON.stringify(SYSM430M_0_param), function (result) {
                    options.success(JSON.parse(result.list));

                    if(JSON.parse(result.list).length>0){
                    	
                    	//kw---20240322 : '템플릿' 선택 시 돋보기 버튼 클릭을 하지 않더라도 '템플릿 구성항목'이 나오도록 추가
                    	if(SYSM430M_selectItemGird0 != 0){
                    		//현재 선택되어야할 아이템이 있는 페이지로 이동
                    		SYSM430M_grid[0].instance.dataSource.page(SYSM430M_findIndexInGrid(SYSM430M_selectItemGird0));
                    		
                    		var grid = SYSM430M_grid[0].instance;
                    		var pageSize = grid.dataSource.pageSize(); // 페이지 크기 가져오기
                    		var itemPos = (pageSize + SYSM430M_selectItemGird0) - (pageSize * SYSM430M_findIndexInGrid(SYSM430M_selectItemGird0)) - 1;

                    		SYSM430M_grid[0].instance.select("tr:eq(" + itemPos + ")");
                    		SYSM430M_selectItemGird0 = 0;
                    	} else {
                        	if(Utils.isNull(SYSM430M_lastSelectedItemGrid0)){
                        		SYSM430M_grid[0].instance.select("tr:eq(" + SYSM430M_selectItemGird0 + ")");
                        	} else {
                        		var row = SYSM430M_grid[0].instance.tbody.find("tr[data-uid]").filter(function() {
                        		    return SYSM430M_grid[0].instance.dataItem(this).tmplMgntNo === SYSM430M_lastSelectedItemGrid0[SYSM430M_lastSelectedItemGrid0.length-1].tmplMgntNo; // 조건에 맞는 행을 필터링
                        		});

                        		// 행을 선택하기
                        		SYSM430M_grid[0].instance.select(row);
                        	}
                    	}

					} else {
						SYSM430M_grid[1].dataSource.data([]);
			    		// 초기화
			    		for(var i=1; i<=3; i++) {
			    			$("#SYSM430M_inputFileName"+i).val('');
			    			$("#SYSM430M_inputUpLoadFile"+i).val('');
			    			$("#SYSM430M_btnUpLoadFile"+i).html(SYSM430M_langMap.get("SYSM433P.fileBtnUp"));
			    			$("input[name='delFiles']").val('');
			    		}
					}
					
                });
            },
            create: function (options) {
            	var updateList = options.data.models;
                var regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprOrgCd: GLOBAL.session.user.orgCd
                }
                $.each(updateList, function(index, item){
                    $.extend(item, regInfo);
                });
            	
                Utils.ajaxCall("/sysm/SYSM430INS01", JSON.stringify({
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
                
                $.each(updateList, function(index, item){
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/sysm/SYSM430INS01", JSON.stringify({
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
            	SYSM430M_fnSearchTopMenuList();
            }
        },
        batch: true,
        pageSize: 15,			//kw---20230504 : pageSize 기능 동작 오류 및 우측 하단에 NaN - NaN 으로 뜨는거 관련 코드 추가
        schema: {
            type: "json",
            model: {
            	id:"tmplNm",
                fields: {
                	tmplMgntNo      : { field: "tmplMgntNo", 	type: "int" },
					tmplDvCd       	: { field: "tmplDvCd", 		type: "string",  },
					tmplNm       	: { field: "tmplNm", 		type: "string", },
					useDvCd     	: { field: "useDvCd", 		type: "string",  },
					detail: 			{ editable: false },
                }
            }
        }
    });
	
	SYSM430M_grid[0].instance = $("#SYSM430M_grid0").kendoGrid({
		columns: [  
			{ width: 30, selectable: true, },
			{
				title: SYSM430M_langMap.get("SYSM430M.grid.status.title"),		//"상태",
                type: "string",
                width: 50,
                template: function (dataItem) {
                    let html = "";
                    if (dataItem.isNew()) {
                        html = "<img src='"+GLOBAL.contextPath+"/images/contents/btn_new.png' style='vertical-align:middle'>";
                    } else if (dataItem.dirty) {
                        html = "<img src='"+GLOBAL.contextPath+"/images/contents/btn_modify.png' style='vertical-align:middle'>";
                    }

                    return html;
                },
            },
			{ width: 75, field: "tmplMgntNo", title:SYSM430M_langMap.get("SYSM430M.tmplMgntNo"), // 번호
				editable: function (dataItem) {
            	if( dataItem.tmplMgntNo == null ){
                    return dataItem.itemDvCd !== null;
            	}if( dataItem.tmplMgntNo == "" ){
                    return dataItem.itemDvCd !== "";
            	}
            }, 
            },
			{ 
            	width: 75, 
            	field: "tmplDvCd", 
            	title: SYSM430M_langMap.get("SYSM430M.division"), // 구분
            	editor: function (container, options) {
            		SYSM430M_commontmplDvCdEditor(container, options, SYSM430M_grid[0].instance );
            	},
            	template: function (dataItem) {
            		return Utils.getComCdNm(SYSM430M_comCdList, 'C0094', dataItem.tmplDvCd);
            	},
            },  //   함수 재설정 요~!  
			{ width: "auto", field: "tmplNm", title: SYSM430M_langMap.get("SYSM430M.subTitle.tmplNm"), //템플릿명
            	attributes: {"class": "textEllipsis"},  },  
			{ width: 70, field: "useDvCd", title: SYSM430M_langMap.get("SYSM430M.useDvCd"), //사용구분
            	editor: function (container, options) {
            	SYSM430M_commonuseDvCdEditor(container, options, SYSM430M_grid[0].instance );
            },
            template: function (dataItem) {
                return Utils.getComCdNm(SYSM430M_comCdList, 'C0003', dataItem.useDvCd);
            },
            },  //   함수 재설정 요~!
			{ width: 37, field: "detail", title: " ", template:
				"#if( tmplDvCd == '' || tmplDvCd == null ){#" +
        		"<span></span>" +
        	"#}else{#" +
            	'<button class="k-icon k-i-zoom-in" title="detail" onclick="SYSM430M_fnSearchMiddleMenuList(this)"></button>'+
			"#}#"},
		],
		//   data 없을때
		noRecords: { template: '<div class="nodataMsg"><p>'+SYSM430M_langMap.get("SYSM430M.info.noRecords")+'</p></div>' },

		//   data 있을때
		dataSource: SYSM430M_grid[0].dataSource,
		dataBound: function() {
        	SYSM430M_grid_fnOnDataBound(0);
        },
        change: function(e) {
        	SYSM430M_grid_fnOnChange(e, 0);
        },
        sortable: true,
        scrollable: true,
        autoBind: false,
        selectable: "multiple,row",
        persistSelection: true,
        resizable: true,
		pageable: {
			pageSize: 15,
			pageSizes: [15,20,25,30],
			buttonCount: 5,
//			refresh: true,
		},
	}).data('kendoGrid');

	SYSM430M_grid[1].dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
            	//console.log('op :%o',options.data);
                Utils.ajaxCall("/sysm/SYSM430SEL02", JSON.stringify(options.data), function (result) {
                	var list = JSON.parse(result.list);
                	
                    $.each(list, function(index, item){

                        if (item.itemDvCd == 3)  {
                        	item.common1 = item.dataSetId;
                        	item.common2 = item.dataSetItemGrpId;
                        	item.common3 = item.dataSetItemId;
                        }
                        else if(item.itemDvCd == 4){
                        	item.common1 = item.dataSetId;
                        	item.common2 = item.colStrPsnVlu;
                        	item.common3 = item.colLen;
                        }

                        else if(item.itemDvCd == 5){
                        	item.common1 = item.url;

                        }
                    });

                    options.success(list);
                    SYSM430M_fnfileList(result.files);
                });
            },
            create: function (options) {
            	var updateList = options.data.models;

                $.each(updateList, function(index, item){

                    if (item.itemDvCd == 3)  {
                    	item.dataSetId = item.common1;
                    	item.dataSetItemGrpId = item.common2;
                    	item.dataSetItemId = item.common3;
                    }
                    if(item.itemDvCd == 4){
                    	item.dataSetId = item.common1;
                    	item.colStrPsnVlu = item.common2;
                    	item.colLen = item.common3;
                    }

                    if(item.itemDvCd == 5){
                    	item.url = item.common1;
                    }

                });
                var regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprOrgCd: GLOBAL.session.user.orgCd
                }
                $.each(updateList, function(index, item){
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/sysm/SYSM430INS02", JSON.stringify({
                    list: updateList
                }), function (result) {
                    options.success(options.data.models);
                });
            },
            update: function (options) {
                var updateList = options.data.models;

                $.each(updateList, function(index, item){

                    if (item.itemDvCd == 3)  {
                    	item.dataSetId = item.common1;
                    	item.dataSetItemGrpId = item.common2;
                    	item.dataSetItemId = item.common3;
                    }
                    if(item.itemDvCd == 4){
                    	item.dataSetId = item.common1;
                    	item.colStrPsnVlu = item.common2;
                    	item.colLen = item.common3;
                    }

                    if(item.itemDvCd == 5){
                    	item.url = item.common1;
                    }

                });
                var regInfo = {
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprOrgCd: GLOBAL.session.user.orgCd
                }

                $.each(updateList, function(index, item){
                    $.extend(item, regInfo);
                });

                Utils.ajaxCall("/sysm/SYSM430INS02", JSON.stringify({
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
            	SYSM430M_fnSearchMiddleMenuList();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
            	id:"itemCdDataNm",
                fields: {
                	tmplMgntNo      		: { field: "tmplMgntNo", 		type: "int"},
					tmplItemSeq      		: { field: "tmplItemSeq", 		type: "int" },
					itemDvCd       			: { field: "itemDvCd", 			type: "string" },
					itemDvMgntItemCd       	: { field: "itemDvMgntItemCd", 	type: "string" },
					itemCd     				: { field: "itemCd", 			type: "string"},
					itemCdDataNm     		: { field: "itemCdDataNm", 		type: "string" },
					msgLen     				: { field: "msgLen", 			type: "int",  editable: false},
					lineGap     			: { field: "lineGap", 			type: "int" },
					dataSetId     			: { field: "dataSetId", 		type: "string" },
					dataSetItemGrpId     	: { field: "dataSetItemGrpId", 	type: "string" },
					dataSetItemId     		: { field: "dataSetItemId", 	type: "string" },
					colLen     				: { field: "colLen", 			type: "int" },
					colStrPsnVlu     		: { field: "colStrPsnVlu", 		type: "int" },
					url     				: { field: "url", 				type: "string" },
					common1					: { field: "common1",			type: "string",},
					common2					: { field: "common2",			type: "string",},
					common3					: { field: "common3",			type: "string",},
                }
            }
        }
    });

	SYSM430M_grid[1].instance = $("#SYSM430M_grid1").kendoGrid({
		columns: [
			{ width: 30, selectable: true},
			{
                title: SYSM430M_langMap.get("SYSM430M.grid.status.title"),		//"상태",
                type: "string",
                width: 50,
                template: function (dataItem) {
                    let html = "";
                    if (dataItem.isNew()) {
                        html = "<img src='"+GLOBAL.contextPath+"/images/contents/btn_new.png' style='vertical-align:middle'>";
                    } else if (dataItem.dirty) {
                        html = "<img src='"+GLOBAL.contextPath+"/images/contents/btn_modify.png' style='vertical-align:middle'>";
                    }

                    return html;
                },
            },
			{ width: 60, field: "tmplItemSeq", title: SYSM430M_langMap.get("SYSM430M.tmplItemSeq"), //순번
				editable: function(dataItem) {
				return false;
			}  },
			{ width: 110, field: "itemDvCd", title: SYSM430M_langMap.get("SYSM430M.division"), //구분
				editor: function (container, options) {
            	SYSM430M_commonitemDvCdEditor(container, options, SYSM430M_grid[1].instance );
            },
            template: function (dataItem) {
                return Utils.getComCdNm(SYSM430M_comCdList, 'C0095', dataItem.itemDvCd);
            }, },  //   함수 재설정 요~!
            {
                title: "",
                width: 40,
                template:
                    "#if( itemDvCd != '' && itemDvCd != '2' ){#" +
                        "<button type='button' class='btnRefer_default icoType icoComp_zoom' onClick='SYSM430M_Popup(this)'></button>" +
                    "#}#"
	            },
			{ width: 110, field: "itemCd", title: SYSM430M_langMap.get("SYSM430M.itemCd") // SMS 코드
				, editable: function(dataItem) {
				return false;
			}},
			{ width: "auto", field: "itemCdDataNm", title: SYSM430M_langMap.get("SYSM430M.itemCdDataNm"), // SMS 항목명
				attributes: {"class": "textEllipsis"},editable: function (dataItem) {
            	if( dataItem.itemDvCd == "1"){
                    return dataItem.itemDvCd !== "1";
            	}
            	if( dataItem.itemDvCd == "2"){
                    return dataItem.itemDvCd === "2";
            	}
            	if( dataItem.itemDvCd == "3"){
                    return dataItem.itemDvCd !== "3";
            	}
            	if( dataItem.itemDvCd == "4"){
                    return dataItem.itemDvCd !== "4";
            	}
            	if( dataItem.itemDvCd == "5"){
                    return dataItem.itemDvCd !== "5";
            	}
            } },
			{ width: 80, field: "msgLen", title: SYSM430M_langMap.get("SYSM430M.msgLen"), //메세지길이
            	attributes: {"class": "textRight"}, template: function (dataItem) {
				let byteLength = function(s,b,i,c){
				    for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
				    return b;
				};

				let string = dataItem.itemCdDataNm;

				return byteLength(string)

			}},
			{ width: 65, field: "lineGap", title: SYSM430M_langMap.get("SYSM430M.lineGap"), //줄간격
				attributes: {"class": "textRight"},editor: function (container, options) {
            	SYSM430M_commonlineGapEditor(container, options, SYSM430M_grid[1].instance );
            },
            template: function (dataItem) {
                return Utils.getComCdNm(SYSM430M_comCdList, 'C0191', dataItem.lineGap);
            }, },
			{
				width : 100,
				field : "common1",
				title : SYSM430M_langMap.get("SYSM430M.common1"), // 기타 1
				attributes : {
					"class" : "textEllipsis"
				},
				template: function(dataItem){
					var common1 = "";
					if(Utils.isNull(dataItem.common1) == false){
						return '<p class="k-text-left tdTooltip" title="'+dataItem.common1+'">'+dataItem.common1+'</p>';
					}
					return common1;
				}
				/*editable : function(dataItem) {
					return false;
				}*/
			},
			{
				width : 100,
				field : "common2",
				title : SYSM430M_langMap.get("SYSM430M.common2"), // 기타 2
				attributes : {
					"class" : "textEllipsis"
				},
				template: function(dataItem){
					var common2 = "";
					if(Utils.isNull(dataItem.common2) == false){
						return '<p class="k-text-left tdTooltip" title="'+dataItem.common2+'">'+dataItem.common2+'</p>';
					}
					return common2;
				}
				/*editable : function(dataItem) {
					return false;
				}*/
			},
			{
				width : 100,
				field : "common3",
				title : SYSM430M_langMap.get("SYSM430M.common3"), //기타 1
				attributes : {
					"class" : "textEllipsis"
				},
				template: function(dataItem){
					var common3 = "";
					if(Utils.isNull(dataItem.common3) == false){
						return '<p class="k-text-left tdTooltip" title="'+dataItem.common3+'">'+dataItem.common3+'</p>';
					}
					return common3;
				}
				
				/*editable : function(dataItem) {
					return false;
				}*/
			},
		],
		//   data 없을때
		noRecords: { template: '<div class="nodataMsg"><p>'+SYSM430M_langMap.get("SYSM430M.info.noRecords")+'</p></div>' },

		//   data 있을때
		dataSource: SYSM430M_grid[1].dataSource,

	sortable: true,
	scrollable: true,
    autoBind: false,
    selectable: "multiple,row",
    persistSelection: true,
    resizable: true,
//  height : 600,
    dataBound: function() {
    	SYSM430M_grid_fnOnDataBound(1);
    },
    change: function(e) {
    	SYSM430M_grid_fnOnChange(e, 1);
    },
	}).data('kendoGrid');
	Utils.setKendoGridDoubleClickAction("#SYSM430M_grid0");
	Utils.setKendoGridDoubleClickAction("#SYSM430M_grid1");
}

//공통 코드 셋팅
function SYSM430M_fnInit() {
    var param = {
        "codeList": [
        	{"mgntItemCd":"C0094"},
			{"mgntItemCd":"C0003"},
			{"mgntItemCd":"C0191"},
			{"mgntItemCd":"C0095"},
			{"mgntItemCd":"C0003"}
        ]
    };

    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
    	SYSM430M_comCdList = JSON.parse(result.codeList);

    	Utils.setKendoComboBox(SYSM430M_comCdList, "C0094", "input[id=ComboBox_SYSM430M_1]");
    	Utils.setKendoComboBox(SYSM430M_comCdList, "C0003", "input[id=ComboBox_SYSM430M_2]");

    	//SYSM430M_fnSearchTopMenuList();
    });
}

// 첫번쨰 그리드 조회
function SYSM430M_fnSearchTopMenuList() {
	
	//kw---20240325 : 검색시 1페이지로 가기 (현재 2페이지에서 조건 검색시 데이터가 1페이지에 밖에 없으면 데이터가 표출이 안되는 버그가 생김)
	
	SYSM430M_grid[0].instance.dataSource.page(1);
	
	SYSM430M_grid[0].instance.clearSelection();

	SYSM430M_grid[1].currentItem = {};
	SYSM430M_grid[0].currentItem = {};

	SYSM430M_grid[1].dataSource.data([]);
	
	SYSM430M_lastSelectedItemGrid0 = [];
	SYSM430M_grid[0].dataSource.read();
	
}

// 두번째 그리드 조회
function SYSM430M_fnSearchMiddleMenuList(obj) {
	
	SYSM430M_grid[1].instance.clearSelection();

    var selectedItem;
    if (obj) {
        var tr = $(obj).closest("tr");
        selectedItem = SYSM430M_grid[0].instance.dataItem(tr);

        SYSM430M_grid[0].instance.clearSelection();
        SYSM430M_grid[0].instance.select(tr);
    } else {
        selectedItem = SYSM430M_grid[0].currentItem;
    }

    SYSM430M_grid[1].currentItem = {};

    SYSM430M_grid[1].dataSource.read({
    	tmplMgntNo: selectedItem.tmplMgntNo,
        //tenantId: GLOBAL.session.user.tenantId
    	tenantId: $("#SYSM430M_tenantId").val()
    });
}

// 첫번째 그리드 데이터 추가
function SYSM430M_fnAddMenu0(gridIndex) {

	
	
	SYSM430M_grid[gridIndex].instance.clearSelection();
	SYSM430M_grid[1].instance.dataSource.data([]);

	var totalRecords = SYSM430M_grid[0].dataSource.total();

	SYSM430M_fnTotalSorting();
    var regInfo = {
        //tenantId: GLOBAL.session.user.tenantId,
    	tenantId: $("#SYSM430M_tenantId").val(),
        regrId: GLOBAL.session.user.usrId,
        regrOrgCd: GLOBAL.session.user.orgCd,
        lstCorprId: GLOBAL.session.user.usrId,
        lstCorprOrgCd: GLOBAL.session.user.orgCd
    }
    
    //kw---20240325 : SMS템플릿 추가 - 항목 추가시 기본 값 셋팅 해주기
    var row = {};
    switch(gridIndex){
    	case 0:
    		row = {
    			tmplMgntNo: Number(totalRecords + 1),
    			tmplDvCd	:	"1",
    			useDvCd		:	"Y",
    		}
    		break;
    	case 1:
    		row = {
    	    	tmplMgntNo: Number(totalRecords + 1),
    	    	tmplDvCd: "",
    	    	tmplNm: "",
    	    	useDvCd: "",
    	    }
    		break;
    }

    SYSM430M_grid[gridIndex].dataSource.add($.extend(row, regInfo));
    SYSM430M_grid[gridIndex].instance.refresh();

    SYSM430M_grid[gridIndex].instance.clearSelection();
    
    SYSM430M_lastSelectedItemGrid0 = [];
    
    //kw---20240325 : 새로 추가시 해당 셀 색상 변경 --> 새로 추가되는 항목이 마지막에 추가가 될 경우의 코드이므로, 마지막에 추가가 안된다면 버그로 인식 될 수 있으니 우선 주석 처리
    //(SYSM430M_grid[gridIndex].instance).editCell((SYSM430M_grid[gridIndex].instance).tbody.find("tr:last td:eq(3)"));
    
    //kw---20240325 : 새로 추가되는 셀 색상 변경 시작
    //kw--- 최대값, 그 값의 인덱스를 구하기
    var maxTmplMgntNo = -Infinity;		//kw---js에서 무한대를 나타내는 값이며 이 값은 모든 숫자보다 작은값으로 정의한다는 뜻
    var maxIndex = -1;
    
    //kw--- 현재 그리드의 tmplMgntNo 최대값 찾기
    for (var i = 0; i < SYSM430M_grid[0].instance.dataSource.data().length; i++) {
        var tmplMgntNo = SYSM430M_grid[0].instance.dataSource.data()[i].tmplMgntNo;
        if (tmplMgntNo > maxTmplMgntNo) {
            maxTmplMgntNo = tmplMgntNo;
            maxIndex = i;
        }
    }
    	
    //kw--- 구한 최대값의 현재 row 찾기
    var row = SYSM430M_grid[0].instance.tbody.find("tr[data-uid]").filter(function() {
	    return SYSM430M_grid[0].instance.dataItem(this).tmplMgntNo === maxTmplMgntNo
	});
    
    SYSM430M_grid[0].instance.dataSource.page(SYSM430M_findIndexInGrid(maxTmplMgntNo));
    
    (SYSM430M_grid[gridIndex].instance).editCell((SYSM430M_grid[gridIndex].instance).tbody.find("tr:eq(" + row.index() + ") td:eq(3)"));
  //kw---20240325 : 새로 추가되는 셀 색상 변경 끝

}

// 두번째 그리드 데이터 추가
function SYSM430M_fnAddMenu1(gridIndex) {

    var totalRecords = SYSM430M_grid[1].dataSource.total();

	SYSM430M_fnTotalSorting1();

    var row = {
    	tmplItemSeq: Number(totalRecords + 1),
    	itemDvCd: "",
    	itemCd: "",
    	itemCdDataNm: "",
    	msgLen: 0,
    	lineGap: 0,
    	common1: "",
    	common2: "",
    	common3: "",

    }

	if(!Utils.isNull(SYSM430M_tmplMgntNo) && SYSM430M_tmplMgntNo=="isNew"){
		Utils.alert(SYSM430M_langMap.get("SYSM430M.alert1"));
		return;
	}else if (Utils.isNull(SYSM430M_tmplMgntNo)){
		Utils.alert(SYSM430M_langMap.get("SYSM430M.alert2"));
		return;
	}
    var tmplMgntNo = SYSM430M_tmplMgntNo;

    var regInfo = {
        //tenantId: GLOBAL.session.user.tenantId,
    	tenantId: $("#SYSM430M_tenantId").val(),
        tmplMgntNo: tmplMgntNo,
        regrId: GLOBAL.session.user.usrId,
        regrOrgCd: GLOBAL.session.user.orgCd,
        lstCorprId: GLOBAL.session.user.usrId,
        lstCorprOrgCd: GLOBAL.session.user.orgCd
    }

    SYSM430M_grid[gridIndex].dataSource.add($.extend(row, regInfo));
    SYSM430M_grid[gridIndex].instance.refresh();

    SYSM430M_grid[gridIndex].instance.clearSelection();
    (SYSM430M_grid[gridIndex].instance).editCell((SYSM430M_grid[gridIndex].instance).tbody.find("tr:last td:eq(3)"));
}

// 첫번째 저장 버튼
function SYSM430M_fnSaveMenu0(gridIndex) {
    var isValid = true;

    $.each(SYSM430M_grid[gridIndex].dataSource.data(), function (index, item) {

    	if (Utils.isNull(item.tmplDvCd)) {
            $("#SYSM430M_validMsg").val(SYSM430M_langMap.get("SYSM430M.msg1")); // 구분을 선택해주세요.
            isValid = false;
            return false;
        }

        if (Utils.isNull(item.tmplNm)) {
        	 $("#SYSM430M_validMsg").val(SYSM430M_langMap.get("SYSM430M.msg2")); // "템플릿 명을 입력해 주세요."
            isValid = false;
            return false;
        }

        if (Utils.isNull(item.useDvCd)) {
        	$("#SYSM430M_validMsg").val(SYSM430M_langMap.get("SYSM430M.msg3")); // "사용 구분을 선택해 주세요."
            isValid = false;
            return false;
        }

    });
    
    SYSM430M_selectItemGird0 = SYSM430M_lastSelectedItemGrid0[SYSM430M_lastSelectedItemGrid0.length-1].tmplMgntNo 
    if (isValid)
    	Utils.confirm(SYSM430M_langMap.get("common.save.msg"), function () {
    		SYSM430M_grid[gridIndex].instance.dataSource.sync().then(function () {
                Utils.alert(SYSM430M_langMap.get("success.common.save")); // "정상적으로 저장되었습니다."
                $("#SYSM430M_validMsg").val("");
            });
    	});
}

// 두번째 저장 버튼
function SYSM430M_fnSaveMenu1(gridIndex) {
    var isValid = true;

	if(!Utils.isNull(SYSM430M_tmplMgntNo) && SYSM430M_tmplMgntNo=="isNew"){
		Utils.alert(SYSM430M_langMap.get("SYSM430M.alert1"));
		return;
	}else if (Utils.isNull(SYSM430M_tmplMgntNo)){
		Utils.alert(SYSM430M_langMap.get("SYSM430M.alert2"));
		return;
	}

	$.each(SYSM430M_grid[gridIndex].dataSource.data(), function (index, item) {

		//console.log("%o",item)
		if (Utils.isNull(item.itemDvCd)) {
        	 $("#SYSM430M_validMsg").val(SYSM430M_langMap.get("SYSM430M.msg1"));
            isValid = false;
            return false;
        }

	    if (Utils.isNull(item.itemCdDataNm)) {
	        $("#SYSM430M_validMsg").val(SYSM430M_langMap.get("SYSM430M.msg4"));
	        isValid = false;
	        return false;
	    }
	    //데이터일 경우
	    if(item.itemDvCd == "3"){
	    	if (Utils.isNull(item.common1) == true) {
	    		$("#SYSM430M_validMsg").val(SYSM430M_langMap.get("SYSM430M.msg.common1"));
		        isValid = false;
		        return false;
	    	}
	    	
	    	if (Utils.isNull(item.common2) == true) {	    		
	    		$("#SYSM430M_validMsg").val(SYSM430M_langMap.get("SYSM430M.msg.common2"));
		        isValid = false;
		        return false;
	    	}
	    }
	    
    });

    if (isValid){
    	Utils.confirm(SYSM430M_langMap.get("common.save.msg"), function () {
    		SYSM430M_grid[gridIndex].instance.dataSource.sync().then(function () {
                Utils.alert(SYSM430M_langMap.get("success.common.save")); // "정상적으로 저장되었습니다."
                $("#SYSM430M_validMsg").val("");
                
                
            	var row = SYSM430M_grid[0].instance.table.find("tr[data-uid='" + SYSM430M_lastSelectedItemGrid0[SYSM430M_lastSelectedItemGrid0.length-1].uid + "']");
        		// 행을 선택하기
        		SYSM430M_grid[0].instance.select(row);
            });
    	});
    }
}

//첫번째 삭제 버튼
function SYSM430M_fnDeleteMenu0(gridIndex) {
    var selectedItems = SYSM430M_grid[gridIndex].selectedItems;

    if (selectedItems.length == 0) {
    	$("#SYSM430M_validMsg").val(SYSM430M_langMap.get("SYSM430M.msg5")); //삭제 할 템플릿을 선택해 주세요.
        return;
    }
    Utils.confirm(SYSM430M_langMap.get("common.delete.msg"), function () { // "삭제하시겠습니까?"
    	
    	SYSM430M_lastSelectedItemGrid0 = [];
    	
        Utils.ajaxCall("/sysm/SYSM430DEL01", JSON.stringify({
            list : selectedItems
        }), function (result) {
        	Utils.alert(SYSM430M_langMap.get("success.common.delete"), function () { // 정상적으로 삭제되었습니다.
	            if (gridIndex == 0) {
	            	 $("#SYSM430M_validMsg").val("");
	            	SYSM430M_fnSearchTopMenuList();
	            }
        	});
        });
    });
}

// 두번째 삭제버튼
function SYSM430M_fnDeleteMenu1(gridIndex) {
    var selectedItems = SYSM430M_grid[gridIndex].selectedItems;

    if (selectedItems.length == 0) {
    	$("#SYSM430M_validMsg").val(SYSM430M_langMap.get("SYSM430M.msg6")); //삭제 할 템플릿항목을 선택해 주세요.
        return;
    }
    Utils.confirm(SYSM430M_langMap.get("common.delete.msg"), function () { // "삭제하시겠습니까?"
        Utils.ajaxCall("/sysm/SYSM430DEL03", JSON.stringify({
            list : selectedItems
        }), function (result) {
        	Utils.alert(SYSM430M_langMap.get("success.common.delete"), function () {
	            if (gridIndex == 1) {
	            	 $("#SYSM430M_validMsg").val("");
	            	SYSM430M_fnSearchMiddleMenuList();
	//            	SYSM430M_grid[gridIndex].instance.removeRow(selectedItems);
	            }
        	});
        });
    });
}

// 그리드안에 콤보박스 셋팅
function SYSM430M_commonuseDvCdEditor(container, options, grid, exceptComCd) {

    let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);
    let SMSTypCdList = SYSM430M_comCdList.filter(function (code) {
        return code.mgntItemCd == "C0003" && code.comCd != exceptComCd
    });


    Utils.setKendoComboBox(SMSTypCdList, "C0003", $select, "", false).bind("change", function (e) {
    	var element = e.sender.element;
        var row = element.closest("tr");
        var dataItem = grid.dataItem(row);
        var selectedValue = e.sender.value();

        dataItem.set("useDvCd", selectedValue);

        grid.refresh();
    });
}

function SYSM430M_commontmplDvCdEditor(container, options, grid, exceptComCd) {
    
    let $select1 = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);
    let SMSTypCdList1 = SYSM430M_comCdList.filter(function (code) {
        return code.mgntItemCd == "C0094" && code.comCd != exceptComCd
    });

    
    Utils.setKendoComboBox(SMSTypCdList1, "C0094", $select1, "", false).bind("change", function (e) {
    	var element = e.sender.element;
        var row = element.closest("tr");
        var dataItem = grid.dataItem(row);
        var selectedValue = e.sender.value();

        dataItem.set("tmplDvCd", selectedValue);

        grid.refresh();
    });
}

function SYSM430M_commonlineGapEditor(container, options, grid, exceptComCd) {
    
    let $select2 = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);
    let SMSTypCdList2 = SYSM430M_comCdList.filter(function (code) {
        return code.mgntItemCd == "C0191" && code.comCd != exceptComCd
    });

    
    Utils.setKendoComboBox(SMSTypCdList2, "C0191", $select2, "", false).bind("change", function (e) {
    	var element = e.sender.element;
        var row = element.closest("tr");
        var dataItem = grid.dataItem(row);
        var selectedValue = e.sender.value();

        dataItem.set("lineGap", selectedValue);

        grid.refresh();
    });
}

function SYSM430M_commonitemDvCdEditor(container, options, grid, exceptComCd) {
    
    let $select3 = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);
    let SMSTypCdList3 = SYSM430M_comCdList.filter(function (code) {
        return code.mgntItemCd == "C0095" && code.comCd != exceptComCd
    });

    
    Utils.setKendoComboBox(SMSTypCdList3, "C0095", $select3, "", false).bind("change", function (e) {
    	var element = e.sender.element;
        var row = element.closest("tr");
        var dataItem = grid.dataItem(row);
        var selectedValue = e.sender.value();

        dataItem.set("itemCd", "");
        dataItem.set("itemCdDataNm", "");
        dataItem.set("lineGap", "0");
        dataItem.set("common1", "");
        dataItem.set("common2", "");
        dataItem.set("common3", "");

        grid.refresh();
    });
}


function SYSM430M_grid_fnOnDataBound(gridIndex) {
	let totalCnt = SYSM430M_grid[0].instance.dataSource.total();
	
	$("#SYSM430M_grid" + gridIndex + " tbody").on("click", "td", function(e) {
        var $row = $(this).closest("tr");
        var $cell = $(this).closest("td");
        SYSM430M_grid[gridIndex].currentItem = SYSM430M_grid[gridIndex].instance.dataItem($row);
        SYSM430M_grid[gridIndex].currentCellIndex = $cell.index();
    });

	if(!Utils.isNull(SYSM430M_grid[0].currentItem)){
		if(!Utils.isNull(SYSM430M_grid[0].currentItem.tmplMgntNo)){
			if(!SYSM430M_grid[0].currentItem.isNew()){
				SYSM430M_tmplMgntNo = SYSM430M_grid[0].currentItem.tmplMgntNo;
			}else{
				SYSM430M_tmplMgntNo = "isNew"
			}
		}else{
			
			if(Utils.isNull(SYSM430M_lastSelectedItemGrid0)){
				SYSM430M_tmplMgntNo = "";
			} else {
				SYSM430M_lastSelectedItemGrid0[SYSM430M_lastSelectedItemGrid0.length-1].tmplMgntNo;
			}
			
		}
	}
	
	
	SYSM430M_grid[gridIndex].loadCount++;
	
}

function SYSM430M_grid_fnOnChange(e, gridIndex) {
	
    var rows = e.sender.select(), 
    items = [];

    rows.each(function(e) {
        var dataItem = SYSM430M_grid[gridIndex].instance.dataItem(this);
        items.push(dataItem);
    });
    
    
    SYSM430M_grid[gridIndex].selectedItems = items;
    
    
    //kw---20240322 : '템플릿' 선택 시 돋보기 버튼 클릭을 하지 않더라도 '템플릿 구성항목'이 나오도록 추가
    if(gridIndex == 0){
    	
    	$("#SYSM430MByte").empty();
    	$("#preView").empty();
    	$("#preViewImg").empty();
    	var preViewHtml = "";
    	preViewHtml = '<p class="nodataMsg" style="height: 100%;  margin-top:20px;">' + SYSM430M_langMap.get("SYSM430M.noFreeView") + '</p>';
    	$("#preView").append(preViewHtml);
    	
    	var lstItem;
    	
    	//마지막으로 선택한 아이템을 구하기 위함
    	if(items.length > 1){
    		for(var i=0; i<items.length; i++){
        		
        		var hasData = false;
        		
        		for(var k=0; k<SYSM430M_lastSelectedItemGrid0.length; k++){
        			if(items[i].tmplMgntNo == SYSM430M_lastSelectedItemGrid0[k].tmplMgntNo){		//이전에 담아녾은 배열에 items값이 있으면 true
        				hasData = true;
        			}
        		}
        		
        		if(hasData == false){																//없으면 새로 추가한것이기 때문에 마지막 아이템으로 선택
        			lstItem = items[i].tmplMgntNo;
        			SYSM430M_lastSelectedItemGrid0.push(items[i]);
        		}
        		
        	}
    		
    		if(SYSM430M_lastSelectedItemGrid0.length != items.length){
        		SYSM430M_lastSelectedItemGrid0 = items;
        		lstItem = items[items.length - 1].tmplMgntNo;
        	}
    		
    	} else if(items.length == 1){			//선택된 아이템이 한개 일 경우
    		lstItem = items[0].tmplMgntNo;
    		SYSM430M_lastSelectedItemGrid0 = items;
    	} else {
    		lstItem = "";						//선택된 아이템이 한개도 없을 경우
    		
    	}
    	
    	
    	
    	
    	if(Utils.isNull(lstItem)){
    		SYSM430M_grid[1].dataSource.data([]);
    		// 초기화
    		for(var i=1; i<=3; i++) {
    			$("#SYSM430M_inputFileName"+i).val('');
    			$("#SYSM430M_inputUpLoadFile"+i).val('');
    			$("#SYSM430M_btnUpLoadFile"+i).html(SYSM430M_langMap.get("SYSM433P.fileBtnUp"));
    			$("input[name='delFiles']").val('');
    		}
    	} else {
    		
    		SYSM430M_tmplMgntNo = lstItem;
    		SYSM430M_grid[1].dataSource.read({
    	    	tmplMgntNo: lstItem,
    	    	tenantId: $("#SYSM430M_tenantId").val()
    	    });
    	}
    }
    
}

// 구분에 직접입력 아닐때 팝업으로 조회할 팝업
function SYSM430M_Popup(obj){

	var selectedItem;
    var tr = $(obj).closest("tr");
    selectedItem = SYSM430M_grid[1].instance.dataItem(tr);
	//itemDvCd;
    
	let param = {
		//mgntItemCd:"C0096",
			vrbsClasCd : selectedItem.itemDvCd,
			callbackKey: "callbackKey_SYSM430M"	
	};
	
	let callbackKey_SYSM430M = function(result) {
		
		
		console.log("result %o:" , result);
		
		if(SYSM430M_grid[1].currentItem.get("itemDvCd") == 1 && result.vrbsClasCd == "1" ){
			
			SYSM430M_grid[1].currentItem.set("itemCd", result.vrbsCd);
			SYSM430M_grid[1].currentItem.set("itemCdDataNm", result.vrbsVlu);
			
		}else if(SYSM430M_grid[1].currentItem.get("itemDvCd") == 3 && result.vrbsClasCd == "3"  ){
			
			SYSM430M_grid[1].currentItem.set("itemCd", result.vrbsCd);
			SYSM430M_grid[1].currentItem.set("itemCdDataNm", result.vrbsVlu);
			SYSM430M_grid[1].currentItem.set("msgLen", result.refn3);
			SYSM430M_grid[1].currentItem.set("common1", result.refn1);
			SYSM430M_grid[1].currentItem.set("common2", result.refn2);
			SYSM430M_grid[1].currentItem.set("common3", result.refn3);
			
		}else if(SYSM430M_grid[1].currentItem.get("itemDvCd") == 4 && result.vrbsClasCd == "4"  ){

			SYSM430M_grid[1].currentItem.set("itemCd", result.vrbsCd);
			SYSM430M_grid[1].currentItem.set("itemCdDataNm", result.vrbsVlu);
			SYSM430M_grid[1].currentItem.set("common1", result.refn1);
			SYSM430M_grid[1].currentItem.set("common2", result.refn2);
			SYSM430M_grid[1].currentItem.set("common3", result.refn3);
			
		}else if(SYSM430M_grid[1].currentItem.get("itemDvCd") == 5 && result.vrbsClasCd == "5"  ){
		
			SYSM430M_grid[1].currentItem.set("itemCd", result.vrbsCd);
			SYSM430M_grid[1].currentItem.set("itemCdDataNm", result.vrbsVlu);
			SYSM430M_grid[1].currentItem.set("common1", result.refn1);
			
		}else{
			$("#SYSM430M_validMsg").val(SYSM430M_langMap.get("SYSM430M.msg7")); //데이터 형식이 맞지 않습니다.
		}
		
	};
	Utils.setCallbackFunction("callbackKey_SYSM430M", callbackKey_SYSM430M );
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM431P", "SYSM431P", 910, 610, param );
}

// 미리보기 버튼 클릭시
function SYSM430M_preView() {
	
	var SYSM430M_SelectedItems = SYSM430M_grid[1].dataSource.data();
	
	if(SYSM430M_SelectedItems.length == 0){
		$("#SYSM430M_validMsg").val(SYSM430M_langMap.get("SYSM430M.msg9")); // 템플릿 구성항목을 추가해 주세요.
	}
		
	var html = "";
	var byteHtml = "";
	
	for( i=0; i<SYSM430M_SelectedItems.length; i++){
	
		if( SYSM430M_SelectedItems[i].itemDvCd == 3 || SYSM430M_SelectedItems[i].itemDvCd == 4 ){
			html += "$" + SYSM430M_SelectedItems[i].itemCdDataNm + "$" + " " ;
		}else if( SYSM430M_SelectedItems[i].itemDvCd == 1 || SYSM430M_SelectedItems[i].itemDvCd == 2 || SYSM430M_SelectedItems[i].itemDvCd == 5 ){
			html += SYSM430M_SelectedItems[i].itemCdDataNm + " ";
		}
	
		if( SYSM430M_SelectedItems[i].lineGap == 1 ){
			html += "<br />";
		}
		
		if( SYSM430M_SelectedItems[i].lineGap == 2 ){
			html += "<br />" + "<br />";
		}
		
		if( SYSM430M_SelectedItems[i].lineGap == 3 ){
			html += "<br />" + "<br />" + "<br />";
		}
		
		if( SYSM430M_SelectedItems[i].itemDvCd == 5 ){
			html += "<a style='text-decoration:underline' href='" + SYSM430M_SelectedItems[i].url + "'>" + SYSM430M_SelectedItems[i].url + "<br />" + "</a>";
		}
	}
	
	let byteLength = function(s,b,i,c){
	    for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
	    return b;
	};
	
	
	let string = html;
	
	//kw---20240326 : SMS 탬플릿 관리 - 미리보기시 이미지 파일도 보이게 추가
	var imgHtml = "";
	$.each(SYSM430M_smsTmplFileInfo, function(index, item){
		imgHtml +='<div><img src="' + '/bcs/mmsimg/'+ GLOBAL.session.user.tenantId + '/' + item.url + '" style="max-width:400px;"></div><br>';
	});
	
	//kw---20240326 : SMS 탬플릿 관리 - 이미지가 있을 경우 SMS/MMS 구분과 총 byte 추가
	if(Utils.isNull(imgHtml)){
		if(byteLength(string) > 90){
			byteHtml += byteLength(string) +  "/2000byte (LMS)";
		} else {
			byteHtml += byteLength(string) +  "/90byte (SMS)";
		}
			
	} else {
		byteHtml += byteLength(string) +  "/2000byte (MMS)";
	}
	
	
	$("#SYSM430MByte").empty();
	$("#SYSM430MByte").append(byteHtml);
	
	$("#preView").empty();
	$("#preView").append(html);
	
	//kw---20240326 : SMS 탬플릿 관리 - 미리보기시 이미지 파일도 보이게 추가
	$("#preViewImg").empty();
	$("#preViewImg").append(imgHtml);
	
	
}

function grid_cellClose(e) {
	grid.refresh();
	    console.log(e.type);
	}

function SYSM430M_fnChkCell(e) {
	
	var grid = $("#SYSM430M_grid1").data("kendoGrid");
	
	grid.bind("cellClose", grid_cellClose);

    grid.editCell( $( "#SYSM430M_grid1 td:eq(1)" ) );
    
} 

function SearchEditor(container, option){
	$('<span class="searchTextBox" style="width: 100%;"><input type="search" class="k-input" name="'+ option.field+'"><button title="검색" onclick="alert(\'해당 이벤트발생\')"></button></span>').appendTo(container);
}

//      Grid   Height  체크
function GridResizeTableSYSM430M() {   
	var screenHeight = $(window).height()-210;     //   (헤더+ 푸터 ) 영역 높이 제외

	$("#SYSM430M_grid0").find('.k-grid-content').css('height', screenHeight-505);    
	$("#SYSM430M_grid1").find('.k-grid-content').css('height', screenHeight-419);     
}  

// 번호 순서대로 변환
function SYSM430M_fnTotalSorting() {
    let result = false;
    let changeCnt = 0;

    $.each(SYSM430M_grid[0].dataSource.data(), function (index, item) {
        let tmplMgntNo = index + 1;
        if (item.tmplMgntNo != tmplMgntNo) {
            item.set("tmplMgntNo", tmplMgntNo);
            changeCnt++;
        }
    });

    if (changeCnt > 0) {
        result = true;
    }

    return result;
}

// 순번 순서대로 변환
function SYSM430M_fnTotalSorting1() {
    let result = false;
    let changeCnt = 0;

    $.each(SYSM430M_grid[1].dataSource.data(), function (index, item) {
        let tmplItemSeq = index + 1;
        if (item.tmplItemSeq != tmplItemSeq) {
            item.set("tmplItemSeq", tmplItemSeq);
            changeCnt++;
        }
    });

    if (changeCnt > 0) {
        result = true;
    }

    return result;
}

function SYSM430M_fnUploadFileClick(nId){ 
	
	var idNum = nId.slice(-1);
	
	if( $( "#SYSM430M_btnUpLoadFile" + idNum ).html() == SYSM430M_langMap.get("SYSM433P.fileBtnUp")){
		
		$( "#SYSM430M_inputUpLoadFile" + idNum ).click();
	} else {
		Utils.confirm(SYSM430M_langMap.get("SYSM433P.fileDelConfMsg"), function () {
			$( "#SYSM430M_btnUpLoadFile" + idNum ).html(SYSM430M_langMap.get("SYSM433P.fileBtnUp"));
			$( "#SYSM430M_inputFileName" + idNum).val("");		
			$( "#SYSM430M_inputUpLoadFile" + idNum).val("");
			
			let currentNum = $("#SYSM430M_attachFile" + idNum).val();

			if($("input[name='delFiles']").val() == '') {
				$("input[name='delFiles']").val(currentNum);
			}else{
			
				if($("#SYSM430M_attachFile" + idNum).val() != '') {
					let delNum = $("input[name='delFiles']").val() + "," + currentNum;
					$("input[name='delFiles']").val(delNum);
				}

			}

			$( "#SYSM430M_attachFile" + idNum).val('');
			
        });
		
	}
	
}


async function SYSM430M_fnUpLoadFile(input, nId){
	var idNum = nId.slice(-1);
	
	let tmpPath = URL.createObjectURL(input.files[0]);
	  
	if(input.files && input.files[0]){

		var fileSize = input.files[0].size;


		if(fileSize > MAX_SIZE){
			Utils.alert("첨부 이미지의 용량을 초과하여 이미지 용량이 자동 변경됩니다.")
			var file = await Utils.getCompressImage(input.files[0] , MAX_SIZE , input.files[0].name);

			// 같은 값이 있는지 확인
			const findIndex = COMPRESS_LIST.findIndex(file => file.idNum ==idNum);
			// 같은 값이 있다면 해당 객체를 대체
			if (findIndex !== -1) {
				COMPRESS_LIST[findIndex] = {idNum : idNum , file : file };
			} else {
				// 같은 값이 없다면 배열에 추가
				COMPRESS_LIST.push({idNum : idNum , file : file });
			}
		}
		
		$( "#SYSM430M_btnUpLoadFile" + idNum ).html(SYSM430M_langMap.get("SYSM433P.fileBtnDel"));
		$( "#SYSM430M_inputFileName" + idNum ).val(input.files[0].name);
		
	}
}

function SYSM433P_Send() {
	var formData = new FormData();
	
	if (Utils.isNull(SYSM430M_tmplMgntNo)){
		Utils.alert("템플릿명을 선택해주세요.")
		return;
	}
	
	for(var i=1; i<=3; i++){
		if ( $("#SYSM430M_inputFileName" + i).val() != "" && $("#SYSM430M_inputFileName" + i).val() != null){
			var inputFile = $("#SYSM430M_inputUpLoadFile" + i );//파일input태그를 가져와

			var findIndex =  COMPRESS_LIST.findIndex(file => file.idNum == i)
			var file
			if(findIndex != -1){
				file = COMPRESS_LIST[findIndex].file
			}else{

				file =  inputFile[0].files[0];//파일을 뽑은 후
				/*
				// 이미저장된 이미지가 300KB 보다 클 경우 300이하로 줄여주는 로직인데 300이하만  논리적으로 300KB보다 클 수 없어서 폐기.
				// 나중에 사용의 여지가 있어서 주석.
				if(inputFile[0].files[0] === undefined){
					file = await Utils.getFileFromUrl("/bcs/mmsimg/" + GLOBAL.session.user.tenantId + "/" + SYSM430M_smsTmplFileInfo[i-1].url , SYSM430M_smsTmplFileInfo[i-1].name)
					if(file){
						if(file.size > MAX_SIZE){
							file = await Utils.getCompressImage(file , MAX_SIZE , SYSM430M_smsTmplFileInfo[i-1].name);

							let currentNum = $("#SYSM430M_attachFile" + i).val();
							if($("input[name='delFiles']").val() == '') {
								$("input[name='delFiles']").val(currentNum);
							}else{
								if($("#SYSM430M_attachFile" + i).val() != '') {
									let delNum = $("input[name='delFiles']").val() + "," + currentNum;
									$("input[name='delFiles']").val(delNum);
								}
							}
						}else{
							file = undefined
						}
					}
				}else{
					file =  inputFile[0].files[0];//파일을 뽑은 후
				}*/

			}

			formData.append('attachFiles', file); //Object정보를 formData에 설정
		}
	}
	
	formData.append('tenantId',      GLOBAL.session.user.tenantId);
	formData.append('regrId',        GLOBAL.session.user.usrId);
	formData.append('lstCorprId',    GLOBAL.session.user.usrId);
	formData.append('regrOrgCd',     GLOBAL.session.user.orgCd);
	formData.append('lstCorprOrgCd', GLOBAL.session.user.orgCd);
	
	formData.append("tmplMgntNo", SYSM430M_tmplMgntNo);
	formData.append("file_path", 'MMS_IMG');


	var delFiles = $("input[name='delFiles']").val();
	if(delFiles!='') {
		formData.append("delFiles", delFiles);
	}
	
	
	Utils.ajaxCallFormData('/sysm/SYSM430INS03',formData,function(data){
		
		//kw---20240326 : SMS 탬플릿 관리 - 미리보기시 이미지 파일도 보이게 추가
		var itemTmplMgntNo;
		itemTmplMgntNo = SYSM430M_lastSelectedItemGrid0[SYSM430M_lastSelectedItemGrid0.length-1].tmplMgntNo;

		SYSM430M_grid[0].instance.dataSource.page(itemTmplMgntNo);
		var grid = SYSM430M_grid[0].instance;
		var pageSize = grid.dataSource.pageSize(); // 페이지 크기 가져오기
		var itemPos = (pageSize + itemTmplMgntNo) - (pageSize * SYSM430M_findIndexInGrid(itemTmplMgntNo)) - 1;

		SYSM430M_grid[0].instance.select("tr:eq(" + itemPos + ")");
		COMPRESS_LIST = []
		Utils.alert(data.msg);
	});
	
}

function SYSM430M_fnfileList(result) {
	
	var list = JSON.parse(result);
	let len = $('input[type=file]').length;
	COMPRESS_LIST = []
	SYSM430M_smsTmplFileInfo = [];
	 
	
	// 초기화
	for(var i=1; i<=len; i++) {
		$("#SYSM430M_inputFileName"+i).val('');
		$("#SYSM430M_inputUpLoadFile"+i).val('');
		$("#SYSM430M_btnUpLoadFile"+i).html(SYSM430M_langMap.get("SYSM433P.fileBtnUp"));
		$("input[name='delFiles']").val('');
	}
	
	$.each(list, function(index, item) {
		$( "#SYSM430M_btnUpLoadFile" + (index+1) ).html(SYSM430M_langMap.get("SYSM433P.fileBtnDel"));
		$( "#SYSM430M_inputFileName" + (index+1)).val(item.orign_file_nm);
		$( "#SYSM430M_attachFile"    + (index+1)).val(item.file_id);
		
		SYSM430M_smsTmplFileInfo.push({url : item.upload_file_nm , name : item.orign_file_nm});
	});
	
}

//kw---20240322 : '템플릿' 선택 시 돋보기 버튼 클릭을 하지 않더라도 '템플릿 구성항목'이 나오도록 추가
//
//$("#SYSM430M_grid0").on('click','tbody tr[data-uid]',function (e) {
//	 
//	$("#SYSM430M_grid0").find("tbody tr").css("background-color", ""); // 이전에 설정된 색상을 제거합니다.
//    
//    // 현재 선택된 행에 색상을 적용합니다.
//    $(this).css("background-color", "#f3fbff"); // 원하는 배경색을 여기에 지정합니다.
//    
//	var selectedItem = $("#SYSM430M_grid0").data("kendoGrid").dataItem($(this));
//	   
//	
//	SYSM430M_grid[0].instance.clearSelection();
//    SYSM430M_grid[0].instance.select(tr);
//     
//    SYSM430M_grid[1].currentItem = {};
//    
//    SYSM430M_grid[1].dataSource.read({
//    	tmplMgntNo: selectedItem.tmplMgntNo,
//        //tenantId: GLOBAL.session.user.tenantId
//    	tenantId: $("#SYSM430M_tenantId").val()
//    });
//    
//    return;
//	
//});

//kw---20240325 : 특정 아이템이 그리드 몇 페이지에 있는지 반환
var SYSM430M_findIndexInGrid = function(_tmplMgntNo){
	var grid = SYSM430M_grid[0].instance;
	var pageSize = grid.dataSource.pageSize(); // 페이지 크기 가져오기
	var itemIndex = -1;

	// 그리드의 현재 정렬 상태 가져오기
	var sortState = grid.dataSource.sort();
	var sortedData = grid.dataSource.data().slice(0); // 데이터를 복제하여 정렬하지 않은 원본 데이터 보존

	// 정렬된 데이터에 따라 정렬 적용
	if (sortState && sortState.length > 0) {
	    sortedData.sort(function(a, b) {
	        for (var i = 0; i < sortState.length; i++) {
	            var field = sortState[i].field;
	            var dir = sortState[i].dir;
	            var valueA = a[field];
	            var valueB = b[field];
	            if (valueA !== valueB) {
	                return dir === "asc" ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
	            }
	        }
	        return 0;
	    });
	}

	// 정렬된 데이터에서 tmplMgntNo가 19인 아이템 찾기
	for (var i = 0; i < sortedData.length; i++) {
	    if (sortedData[i].tmplMgntNo === _tmplMgntNo) {
	        itemIndex = i;
	        break;
	    }
	}
	
	var pageIndex;
	if (itemIndex !== -1) {
		pageIndex = Math.floor(itemIndex / pageSize) + 1; // 아이템이 있는 페이지 번호 계산
	}
	return pageIndex;
}

//kw---20240327 : 첨부파일 마우스 오버시 미리보기 기능 추가
function SYSM430M_showImagePreview(inputFileName, divImg, divImgPreView, index) {
    $(inputFileName).on({
        mouseover: function() {
            if (!Utils.isNull(SYSM430M_smsTmplFileInfo[index])) {
                var imgHtml = '<img src="' + GLOBAL.contextPath + '/mmsimg/' + GLOBAL.session.user.tenantId + '/' + SYSM430M_smsTmplFileInfo[index].url + '" style="max-width:100%; max-height:100%; object-fit: cover;"><br>';
                $(divImg).empty().append(imgHtml);
                $(divImgPreView).show();
            } else {
                if (!Utils.isNull($(inputFileName).val())) {
                    $(divImg).empty().append("<span>저장 후 다시 시도해 주세요.</span>");
                    $(divImgPreView).show();
                }
            }
        },
        mouseout: function() {
            $(divImg).empty();
            $(divImgPreView).hide();
        }
    });
}