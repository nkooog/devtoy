/***********************************************************************************************
 * Program Name : 대시보드 body 막대 그래프 - (CARD017S.js)
 * Creator      : wkim
 * Create Date  : 2023.02.23
 * Description  : DASH 메인
 * Modify Desc  :  대시보드 body 막대 그래프
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.02.23     김운           최초생성
 ************************************************************************************************/

var CARD019S_gridSelectItem = new Array(1);
var CARD019S_grid = new Array(1);
var CARD019S_CommCodeList;

var CARD019S_CnfmYn = 'N';

for (let i = 0; i < CARD019S_grid.length; i++) {
	
	CARD019S_grid[i] = {
        instance: new Object(),
        dataSource: new Object(),
        currentItem: new Object(),
        currentCellIndex: new Number(),
        selectedItems: new Array(),
        record: 0
    }
	
}

$(document).ready(function() {
	
	var CARD019STab = $("#CARD019S_tab").kendoTabStrip({
		animation: false,
		scrollable: false,  
	}).data("kendoTabStrip"); 
	
	CARD019STab.select(0);   
	
	CARD019S_fnGridInit();
	
	CARD019S_GridResize();
	
	//그리드 선택
	$("#CARD019S_grid1").on('click','tbody tr[data-uid]',function (e) {
		
		var CARD019S_cell = $(e.currentTarget);
		var	CARD019S_item	= CARD019S_grid[0].instance.dataItem(CARD019S_cell.closest("tr"));
		
		CARD019S_fnPopOpen(CARD019S_item);     
		
		let nlParam = {
				nlMgntSeq 			: CARD019S_item.nlMgntSeq,
				tenantId 			: GLOBAL.session.user.tenantId,
				cnslGrpCd 			: parseInt(GLOBAL.session.user.usrGrd),
				cnslrId				: GLOBAL.session.user.usrId,
				nlCnfmYn			: "Y",
				viewType			: "N",
		}
		
		//미열람을 읽었을 경우 그리드 데이터를 바로 변경해 주기
		if(CARD019S_item.nlCnfmYn == 'N' || Utils.isNull(CARD019S_item.nlCnfmYn)){
			CARD019S_item.nlCnfmYn = 'Y';
			let item = CARD019S_grid[0].instance.dataSource.data();
			CARD019S_grid[0].instance.dataSource.data(item);
			
			Utils.ajaxCall("/dash/DASH100INS19", JSON.stringify(nlParam), function (result) {
				if(result.result == "1"){
					console.log("뉴스레터 - 확인 여부 : 정상적으로 저장하였습니다.");
				} else {
					console.log("뉴스레터 - 확인 여부 : 저장을 실패하였습니다.");
				}
	        });
		}
		
		
	});
});

$(window).resize(function(){
	CARD019S_GridResize();
});

var openPop;
function CARD019S_fnPopOpen(nItem){
    let nlParam = {
			nlMgntSeq 			: nItem.nlMgntSeq,
			tenantId 			: GLOBAL.session.user.tenantId,
			cnslGrpCd 			: parseInt(GLOBAL.session.user.usrGrd),
			cnslrId				: GLOBAL.session.user.usrId,
			nlCnfmYn			: "Y",
			viewType			: "N",
	}

    let popWidth = window.screen.width;
    let popHeight = window.screen.height-300;
    
    if(openPop){
    	openPop.window.close();
    }
    openPop = Utils.openCsrfPop(GLOBAL.contextPath + "/cmmt/CMMT630P", "CMMT630P", 800, popHeight, nlParam);
}

//그리드 초기화
function CARD019S_fnGridInit(){
	
	CARD019S_grid[0].dataSource = new kendo.data.DataSource({
		transport: {
			read: function (options) {
				$("#tableINHB100M_0 .k-grid-norecords").remove();
				let param = CARD019S_fnReadParamCreate();
				
				$.extend(param, options.data);
				
				if (!Utils.isNull(param)) {
					Utils.ajaxCall("/dash/DASH100SEL19", JSON.stringify(param), function (result) {

						let resultList = JSON.parse(result.list);

						for(var i=0; i<1; i++){
							if(CARD019S_CnfmYn == 'N' && resultList[i].nlCnfmYn != 'Y'){
								CARD019S_CnfmYn = 'Y';
								
								let nlParam = {
										nlMgntSeq 			: resultList[i].nlMgntSeq,
										tenantId 			: GLOBAL.session.user.tenantId,
										cnslGrpCd 			: parseInt(GLOBAL.session.user.usrGrd),
										cnslrId				: GLOBAL.session.user.usrId,
										nlCnfmYn			: "Y",
								}
								
								resultList[i].nlCnfmYn = 'Y';
								let item = CARD019S_grid[0].instance.dataSource.data();
								CARD019S_grid[0].instance.dataSource.data(item);
								
								CARD019S_fnPopOpen(resultList[i]);
									
								Utils.ajaxCall("/dash/DASH100INS19", JSON.stringify(nlParam), function (result) {
									if(result.result == "1"){
										console.log("뉴스레터 - 확인 여부 : 정상적으로 저장하였습니다.");
									} else {
										console.log("뉴스레터 - 확인 여부 : 저장을 실패하였습니다.");
									}
					            });
							}
						
						
						options.success(resultList);}
	                });
				} 
			},
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                fields: {
                    bltnTypCd: {field: "bltnTypCd"},
                    blthgTite: {field: "blthgTite", type: "string"},
                    bltnTrmStrDd: {field: "bltnTrmStrDd", type: "string"},
                }
            }
        }
	});

	
	CARD019S_grid[0].instance = $("#CARD019S_grid1").kendoGrid({
		dataSource: CARD019S_grid[0].dataSource,
        change: function (e) {
        },
        scrollable: true,
        selectable: true,
        noRecords: {template: '<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>'},
		columns: [
            {
                width: "auto", 
                field: "nlTite", 
                title: "제목",
                template: function (dataItem) {
                    return '<a class="link">' + dataItem.nlTite + '</a>';
                }
            },
            {
                width: 50, 
                field: "nlCnfmYn", 
                title: "열람여부",
                template : function (dataItem){
                	let strReturn = "";
                	
                	if(dataItem.nlCnfmYn == 'Y'){
                		strReturn = "열람";
                	} else {
                		strReturn = "미열람";
                	}
                	
            		return strReturn;
            	}
            },
            {
            	width: 120, 
            	field: "regDtm", 
            	title: "작성일", 
            	attributes: {"class": "textCenter day", style : "text-align : right; "},
            	template : function (dataItem){
            		
            		return dataItem.regDtm.substr(0,10);
            	}
            },
        ],

	}).data('kendoGrid');
	
	CARD019S_grid[0].dataSource.data([]);
	
}

function CARD019S_fnReadParamCreate(){
	let param;
	
	param = {
			tenantId			: GLOBAL.session.user.tenantId,
			cnslrId				: GLOBAL.session.user.usrId,
			cnslGrpCd			: GLOBAL.session.user.usrGrd,
			nlBltnYn			: "Y",
	}
	
	return param;
}



//그리드 사이즈 설정
function CARD019S_GridResize(){
	
	var screenHeight = $(window).height();  //  헤더 + 푸터 = 320px
	var parentHeight = $("#CARD019S").parent().height();

	CARD019S_grid[0].instance.element.find('.k-grid-content').css('height', parentHeight-78);
}

