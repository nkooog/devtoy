/*******************************************************************************
 * Program Name : 뉴스레터 목록 (CMMT600M.js) Creator : dwson Create Date : 2023.11.15
 * Description : 뉴스레터 목록 NL_MGNT_SEQ Desc :
 * -----------------------------------------------------------------------------------------------
 * Date | Updater | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.11.15 dwson 최초작성
 ******************************************************************************/

var CMMT600M_grid, CMMT600MDataSource, CMMT600M_ToolTip, CMMT600M_selItem=[];
$(document).ready(function () {

    CMMT600MDataSource = {
        transport: {
            read: function (CMMT600M_param) {
                if (Utils.isNull(CMMT600M_param.data)) {
                    Utils.ajaxCall(
                        "/cmmt/CMMT600SEL01",
                        JSON.stringify(CMMT600M_param),
                        CMMT600M_fnResultNewsLetter,
                        window.kendo.ui.progress($("#CMMT600M_grid"), true))
                } else {
                    window.kendo.ui.progress($("#CMMT600M_grid"), false)
                }
            },
        },
        schema: {
            type: "json",
            model: {
                fields: {
                	nlMgntSeq: {field: "nlMgntSeq", type: "string"},
                	nlTite: {field: "nlTite", type: "string"},
                	nlCtt: {field: "nlCtt", type: "string"},
                	nlBltnYn: {field: "nlBltnYn", type: "string"},
                	regDtm: {field: "regDtm", type: "string"},
                	regrId: {field: "regrId", type: "string"},
                	regrOrgCd: {field: "regrOrgCd", type: "string"},
                	lstCorprId: {field: "lstCorprId", type: "string"},
                	lstCorcDtm: {field: "lstCorcDtm", type: "string"},
                	lstCorprOrgCd: {field: "lstCorprOrgCd", type: "string"},
                	viewType: {field: "viewType", type: "string"},
                }
            }
        }
    }

    CMMT600M_grid = $("#CMMT600M_grid").kendoGrid({
        dataSource: CMMT600MDataSource,
        autoBind: false,
        resizable: true,
        refresh: true,
        sortable: true,
        selectable : true,
        height : $(window).height() >= 1000 ? 835 : 590,
        sort: function (e) {
            if (CMMT600M_grid.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        change: function(e) {
            let selectedRows = e.sender.select();
            CMMT600M_selItem = this.dataItem(selectedRows[0]);
        },
        dataBinding: function () {
            record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        dataBound: function(e) {
        	var rows = this.tbody.children();
            var totalRows = rows.length; // 그리드의 전체 행 개수

            for (var i = 0; i < totalRows; i++) {
                let row = $(rows[i]);
                let reverseIndex = (CMMT600M_grid.dataSource.total() - i) - (CMMT600M_grid.dataSource.pageSize() * (CMMT600M_grid.dataSource.page() - 1));  // 역순 숫자
                row.children().eq(0).text(reverseIndex);
            }
			
		 	CMMT600M_onDataBound(e);
        },
        pageable: {
            refresh: false
            , pageSizes: [25, 50, 100, 100, 500]
            , buttonCount: 10
            , pageSize: 25
        },
        columns: [
        	{ title: "No", width: "40px" },
            {
//                field:"nlMgntSeq", title: "No", width: 40, template: "#= ++record #"
            	field:"nlMgntSeq", title: "No", width: 40, type: "string", hidden: true,
            },
            {
                field: "nlTite",
                title: CMMT600M_langMap.get("CMMT600M.grid.column.nlTite"),
                type: "string", width: 200,
                attributes : { style: "text-align : left;", class: "tdTooltip"}
            },
            {
                field: "regrId",
                title: CMMT600M_langMap.get("CMMT600M.grid.column.regrId"),
                type: "string", width: 100,
            },
            {
                field: "regDtm",
                title: CMMT600M_langMap.get("CMMT600M.grid.column.regDtm"),
                template : '#=kendo.format("{0:yyyy-MM-dd HH:mm}",new Date(regDtm))#',
                type: "string", width: 100,
            },
            {
                field: "viewType",
                hidden: true,
            },
            {
                title: "",
                width: 80,
                template: function(dataItem) {
                    return '<button onclick="CMMT600M_fnConfirmHist('+dataItem.nlMgntSeq+')" class="btnRefer_default" data-auth-chk="Y" data-auth-id="CMMT600M" data-auth-type="POPUP">확인내역</button>&nbsp;' +
                           '<button onclick="CMMT600M_fnDelete('+dataItem.nlMgntSeq+')" class="btnRefer_default" data-auth-chk="Y" data-auth-id="CMMT600M" data-auth-type="DELETE">삭제</button>';
                }
            },
        ],
        noRecords: { template: `<div class="nodataMsg"><p>${CMMT600M_langMap.get("CMMT600M.grid.nodatafound")}</p></div>` },
    }).data("kendoGrid");

    CMMT600M_ToolTip = $("#CMMT600M_grid").kendoTooltip({
        filter: ".tdTooltip",
        autoHide:true,
        //showOn: "mouseenter",
        show: function(e){
            if(this.content.text().length>0){
                this.content.parent().css("visibility", "visible");
            }else{
                this.content.parent().css("visibility", "hidden");
            }
        },
        hide: function(e){
            this.content.parent().css('visibility', 'hidden');
        },
        content: function(e){
//            let dataItem = CMMT600M_grid.dataItem(e.target.closest("tr"));
            return null;
        }
    }).data("kendoTooltip");
    
    CMMN_SEARCH_DATE['CMMT600M_dateStart'].fnSetMonth(-12);
    CMMN_SEARCH_DATE['CMMT600M_dateStart'].fnSetEnable();
    
    CMMT600M_init();
    
    // 조회 버튼 클릭
    $("#CMMT600M button[name=CMMT600_btnSearch]").off("click").on("click", function () {

    	CMMT600M_fnSearchNewsLetter();
    });

    // 등록 버튼 클릭
    $("#CMMT600M button[name=CMMT600_btnCMMT610Open]").off("click").on("click", function () {

    	let param = {
    		callbackKey: "CMMT600M_fnCreateDoc",
    	}
    	Utils.setCallbackFunction("CMMT600M_fnCreateDoc", function(){
    		CMMT600M_init();
    	});
    	Utils.openPop(GLOBAL.contextPath + "/cmmt/CMMT610P", "CMMT610P", 1240, 1000, param);
    });
    
  //엔터 키 입력
    $('#CMMT600M_title').keydown(function(e) {
    	if(e.key ==="Enter"){ CMMT600M_fnSearchNewsLetter();}
    });
});

function CMMT600M_init() {
    CMMT600M_fnSearchNewsLetter();
}

$(window).resize(function(){
    //CMMT600M_resizeGrid();
});

function CMMT600M_resizeGrid() {
    // (헤더 + 푸터)영역 높이 제외
    const screenHeight = $(window).height()-210;
    const gridHeight = CMMT600M_grid.height = screenHeight-354;
    
    // (헤더 + 푸터 + 검색 )영역 높이 440
    CMMT600M_grid.element.find('.k-grid-content').css('height', gridHeight >= 300 ? gridHeight : 300);
}

function CMMT600M_getParamValue() {
    return {
    	startDate: $("#CMMT600M_dateStart").val().replace(/\-/g, ''),
        endDate: $("#CMMT600M_dateEnd").val().replace(/\-/g, ''),
        nlTite: $("#CMMT600M_title").val()
    }
}

function CMMT600M_fnSearchNewsLetter() {
	const paramValue = CMMT600M_getParamValue();
    CMMT600M_grid.dataSource.data([]);
    CMMT600M_grid.clearSelection();
    CMMT600MDataSource.transport.read(CMMT600M_getParamValue());
}

function CMMT600M_fnResultNewsLetter(data) {

	//CMMT600M_resizeGrid();
    window.kendo.ui.progress($("#CMMT600M_grid"), false);

    let list = JSON.parse(data.result);
    //console.log(data.result);
    
    const listLength = list.length;
    if (listLength === 0) {
    	CMMT600M_grid.dataSource.data([]);
        return;
    }
    
    CMMT600M_grid.dataSource.data(list);
    CMMT600M_grid.dataSource.options.schema.data = list;

    CMMT600M_grid.dataSource.page(1);
}

//그리드 항목 클릭시
function CMMT600M_onDataBound(e) {
	$("#CMMT600M_grid").on('click','tbody tr[data-uid]',function (e) {
		let	item = $("#CMMT600M_grid").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));

		if(e.target.nodeName=== "BUTTON" || e.target.nodeName=== "SPAN" ){ //버튼을누르는경우는
			return;
		}
		
		CMMT600M_fnDetailViewClick(item.nlMgntSeq, item.viewType);
	})
};

//뉴스레터 상세 보기
function CMMT600M_fnDetailViewClick(nlMgntSeq, viewType){
	let param = {
		nlMgntSeq: nlMgntSeq,
		callbackKey: "CMMT600M_fnUpdateDoc",
		viewType: viewType,
	}
	Utils.setCallbackFunction("CMMT600M_fnUpdateDoc", function(){
		CMMT600M_init();
	});
	Utils.openPop(GLOBAL.contextPath + "/cmmt/CMMT610P", "CMMT610P", 1240, 850, param);
}

function CMMT600M_fnConfirmHist(nlMgntSeq) {
	let param = {
			nlMgntSeq: nlMgntSeq
		}
	Utils.openPop(GLOBAL.contextPath + "/cmmt/CMMT620P", "CMMT620P", 800, 600, param);
}

function CMMT600M_fnDelete(nlMgntSeq) {
	if(Utils.isNull(nlMgntSeq)){
		Utils.alert(CMMT600M_langMap.get("CMMT600M.alert.error.param"));
		return;
	}
	else {
		Utils.confirm(CMMT600M_langMap.get("CMMT600M.confirm.delete"), function(){
			let param = {
				nlMgntSeq : nlMgntSeq
			}
	
	        Utils.ajaxCall('/cmmt/CMMT600DEL01', JSON.stringify(param), function(result){
	        	if(result.result > 0) {
	        		Utils.alert(CMMT600M_langMap.get("CMMT600M.alert.delete.success"), function (){
		            	CMMT600M_init();
		            });
	        	}
	        	else {
	        		Utils.alert(result.msg);
	        	}
	        });
	    })	
	}
}