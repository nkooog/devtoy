/*******************************************************************************
 * Program Name : 뉴스레터 확인내역 (CMMT620P.js) Creator : dwson Create Date : 2023.11.17
 * Description : 뉴스레터 확인내역 NL_CNFM_YN Desc, CNSLR_ID Asc
 * -----------------------------------------------------------------------------------------------
 * Date | Updater | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.11.17 dwson 최초작성
 ******************************************************************************/

var CMMT620P_cmmCodeList, CMMT620P_grid, CMMT620PDataSource, CMMT620P_ToolTip, CMMT620P_selItem=[];
$(document).ready(function () {

    CMMT620PDataSource = {
        transport: {
            read: function (CMMT620P_param) {
                if (Utils.isNull(CMMT620P_param.data)) {
                    Utils.ajaxCall(
                        "/cmmt/CMMT620SEL01",
                        JSON.stringify(CMMT620P_param),
                        CMMT620P_fnResultNewsLetterHist,
                        window.kendo.ui.progress($("#CMMT620P_grid"), true))
                } else {
                    window.kendo.ui.progress($("#CMMT620P_grid"), false)
                }
            },
        },
        schema: {
            type: "json",
            model: {
                fields: {
                	nlMgntSeq: {field: "nlMgntSeq", type: "string"},
                	tenantId: {field: "tenantId", type: "string"},
                	cnslGrpCd: {field: "cnslGrpCd", type: "string"},
                	cnslrId: {field: "cnslrNmId", type: "string"},
                	nlCnfmYn: {field: "nlCnfmYn", type: "string"},
                	nlCnfmDtm: {field: "nlCnfmDtm", type: "string"},
                }
            }
        }
    }

    CMMT620P_grid = $("#CMMT620P_grid").kendoGrid({
        dataSource: CMMT620PDataSource,
        autoBind: false,
        resizable: true,
        refresh: true,
        sortable: true,
        selectable : true,
        sort: function (e) {
            if (CMMT620P_grid.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        change: function(e) {
            let selectedRows = e.sender.select();
            CMMT620P_selItem = this.dataItem(selectedRows[0]);
        },
        dataBinding: function () {
            record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        pageable: {
            refresh: false
            , pageSizes: [25, 50, 100, 100, 500]
            , buttonCount: 10
            , pageSize: 25
        },
        columns: [
            {
                field: "nlMgntSeq",
                hidden: true,
            },
            {
                field: "tenantId",
                hidden: true,
            },
            {
                field: "cnslGrpCd",
                hidden: true,
            },
            {
                field: "cnslrNmId",
                title: CMMT620P_langMap.get("CMMT620P.grid.column.cnsl"),
                type: "string", width: 200,
            },
            {
                field: "nlCnfmYn",
                title: CMMT620P_langMap.get("CMMT620P.grid.column.cnfmYn"),
                type: "string", width: 120,
            },
            {
                field: "nlCnfmDtm",
                title: CMMT620P_langMap.get("CMMT620P.grid.column.cnfmDtm"),
                type: "string", width: 180,
            },
        ],
        noRecords: { template: `<div class="nodataMsg"><p>${CMMT620P_langMap.get("CMMT620P.grid.nodatafound")}</p></div>` },
    }).data("kendoGrid");

    CMMT620P_ToolTip = $("#CMMT620P_grid").kendoTooltip({
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
//            let dataItem = CMMT620P_grid.dataItem(e.target.closest("tr"));
//            if(e.target.closest("td").index()==16){
//                return dataItem.cnslCtt;
//            }else{
//                return  dataItem.cntcCustNm;
//            }
            return null;
        }
    }).data("kendoTooltip");
    $('#CMMT620P_tenantId').val(GLOBAL.session.user.tenantId);
    CMMT620P_init();
    
    // 조회 버튼 클릭
    $("#CMMT620P button[name=CMMT620_btnSearch]").off("click").on("click", function () {

    	CMMT620P_fnSearchNewsLetterHist();
    });
    
    CMMN_SEARCH_TENANT["CMMT620P"].fnInit(null,CMMT620P_init);
});

function CMMT620P_init() {
    CMMT620P_resizeGrid();
    CMMT620P_fnSearchNewsLetterHist();
}

$(window).resize(function(){
    CMMT620P_resizeGrid();
});

function CMMT620P_resizeGrid() {
    // (헤더 + 푸터)영역 높이 제외
    const screenHeight = $(window).height()-210;
    // (헤더 + 푸터 + 검색 )영역 높이 440
    CMMT620P_grid.element.find('.k-grid-content').css('height', screenHeight-50);
}

function CMMT620P_getParamValue() {
    return {
    	nlMgntSeq: Utils.getUrlParam("nlMgntSeq"),
    	tenantId: $('#CMMT620P_tenantId').val(),
    }
}

function CMMT620P_fnSearchNewsLetterHist() {
	const paramValue = CMMT620P_getParamValue();
    CMMT620P_grid.dataSource.data([]);
    CMMT620P_grid.clearSelection();
    CMMT620PDataSource.transport.read(CMMT620P_getParamValue());
}

function CMMT620P_fnResultNewsLetterHist(data) {

    window.kendo.ui.progress($("#CMMT620P_grid"), false)

    let list = JSON.parse(data.result);
    const listLength = list.length
    if (listLength === 0) {
    	CMMT620P_grid.dataSource.data([]);
        return;
    }

    CMMT620P_grid.dataSource.data(list);
    CMMT620P_grid.dataSource.options.schema.data = list;

    CMMT620P_grid.dataSource.page(1);
}
