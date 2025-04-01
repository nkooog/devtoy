/*******************************************************************************
 * Program Name : 뉴스레터  (SAMPLE99M.js) Creator :  Create Date : 2024.05.23
 * Description : 뉴스레터  :
 * -----------------------------------------------------------------------------------------------
 * Date | Updater | Remark
 * -----------------------------------------------------------------------------------------------
 * 2024.05.23  최초작성
 ******************************************************************************/

var SAMPLE999M_grid;
var SAMPLE999M_ToolTip;
var SAMPLE999M_excelName = "엑셀파일명";

$(document).ready(function() {
    SAMPLE999M_init();
});

function SAMPLE999M_init()
{

    SAMPLE999M_gridInit();  // 그리드 init
    SAMPLE999M_tooltip();   // tooltip init

    setTimeout(function() {
        SAMPLE999M_fnSearch();  //그리드 조회
    }, 150);

    $(".SAMPLE999M_searchForm").on("keyup",function(key){
        if(key.keyCode==13) {
            SAMPLE999M_fnSearch();  //그리드 조회
        }
    });
    /**
     * 그리드 조회
     */
    $("#SAMPLE999M_btnSearch").off("click").click(function(){SAMPLE999M_fnSearch();});
    /**
     * 엑셀 다운로드
     */
    $("#SAMPLE999M_btnExcelDwn").off("click").click(function(){SAMPLE999M_excelExport();});
    /**
     * 등록버튼
     */
    $("#SAMPLE999M_btnOpen").off("click").on("click", function () { 
        let param = {
            callbackKey: "SAMPLE999P_fnCreate",
        };

        Utils.setCallbackFunction("SAMPLE999P_fnCreate", function(){
            SAMPLE999M_fnSearch();  //그리드 조회
        });

        SAMPLE999P_openPop(param);
    });
}

/**
 * 그리드 init
 * @constructor
 */
function SAMPLE999M_gridInit()
{
    $("#grid_SAMPLE999M").kendoGrid({
        dataSource: [],
        noRecords: { template: '<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>' },
        autoBind: false,
        sortable: true,
        scrollable: true,
        selectable: true,
        resizable : true,
        pageable: {
            refresh:false
            , pageSizes:[ 25, 50, 100, 200,  500]
            , buttonCount:10
            , pageSize : 25
        },
        excel: {
            filterable: true, // 필터링된 데이터만 내보내기
            allPages: true // 모든 페이지 데이터 내보내기 (페이징된 경우)
        },
        excelExport: function(e) {
            let sheet = e.workbook.sheets[0];
            for (let rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
                let row = sheet.rows[rowIndex];
                for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                    sheet.columns[cellIndex].autoWidth = true; // 자동 너비 설정
                }
            }

            e.workbook.fileName = SAMPLE999M_excelName + ".xlsx";
        },
        dataBound: SAMPLE999M_onDataBound,
        columns: [
            {title: "No", width: "40px"},
            {field:"nlMgntSeq", title: "No", width: 40, type: "string", hidden: true,},
            {
                field: "nlTite",
                title: "제목",
                type: "string", width: 200,
                attributes : { style: "text-align : left;", class: "tdTooltip"}
            },
            {
                field: "regrId",
                title: "등록자",
                type: "string", width: 100,
            },
            {
                field: "regDtm",
                title: "등록일시",
                template : '#=kendo.format("{0:yyyy-MM-dd HH:mm}",new Date(regDtm))#',
                type: "string", width: 100,
            },
            {field: "viewType",hidden: true,},
            {
                title: "",
                width: 50,
                template: function(dataItem) {
                    return '<button onclick="SAMPLE999M_fnDelete('+dataItem.nlMgntSeq+')" class="btnRefer_default" data-auth-chk="Y" data-auth-id="CMMT600M" data-auth-type="DELETE">삭제</button>';
                }
            },
        ],
    });

    SAMPLE999M_grid = $("#grid_SAMPLE999M").data("kendoGrid");

    // 그리드 높이 조절
    let SAMPLE999M_screenHeight = $(window).height();
    let SAMPLE999M_distanceHeight = 500;
    SAMPLE999M_grid.element.find('.k-grid-content').css('height', SAMPLE999M_screenHeight - SAMPLE999M_distanceHeight);

    $(window).on({
        'resize': function() {
            SAMPLE999M_grid.element.find('.k-grid-content').css('height', SAMPLE999M_screenHeight - SAMPLE999M_distanceHeight);
        },
    });
}

/**
 * 그리드 조회
 * @constructor
 */
function SAMPLE999M_fnSearch()
{
    window.kendo.ui.progress($("#grid_SAMPLE999M"), true);

    SAMPLE999M_grid.dataSource.data([]);
    SAMPLE999M_grid.dataSource.page(1);

    var param = {
        startDate: $("#SAMPLE999M_dateStart").val().replace(/\-/g, ''),
        endDate: $("#SAMPLE999M_dateEnd").val().replace(/\-/g, ''),
        nlTite: $("#SAMPLE999M_title").val()
    };

    Utils.ajaxCall('/sample/SAMPLE999SEL01', JSON.stringify(param), function (data) {

        if(Utils.isNotNull(data) && Utils.isNotNull(data.result)) SAMPLE999M_grid.dataSource.data(JSON.parse(data.result));

        window.kendo.ui.progress($("#grid_SAMPLE999M"), false);
    });
}

/**
 * 데이터 바인딩 후 발생.
 * 현재 그리드에선 row 클릭 시 뉴스레터 등록팝업
 * @param e
 * @constructor
 */
function SAMPLE999M_onDataBound(e)
{
    var rows = this.tbody.children();
    var totalRows = rows.length;
    var startIndex = (SAMPLE999M_grid.dataSource.page() - 1) * SAMPLE999M_grid.dataSource.pageSize() + 1;

    for (var i = 0; i < totalRows; i++) {
        let row = $(rows[i]);
        // 순서대로 번호 매기기
        let index = i + startIndex; // 현재 페이지의 첫 번째 행에 대한 올바른 인덱스 계산
        row.children().eq(0).text(index);
    }

    $("#grid_SAMPLE999M").on('click','tbody tr[data-uid]',function (e) {
        let	item = $("#grid_SAMPLE999M").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));

        if(e.target.nodeName=== "BUTTON" || e.target.nodeName=== "SPAN" ){
            return;
        }

        let param = {
            nlMgntSeq: item.nlMgntSeq,
            callbackKey: "SAMPLE999P_fnUpdate",
            viewType: item.viewType,
        }
        SAMPLE999P_openPop(param);
    });
}

/**
 * 툴팁 init
 * @constructor
 */
function SAMPLE999M_tooltip()
{
    SAMPLE999M_ToolTip = $("#grid_SAMPLE999M").kendoTooltip({
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
            var element = e.target[0];
            if(element.offsetWidth < element.scrollWidth){
                return e.target.text();
            }else{
                return "";
            }
        }
    }).data("kendoTooltip");
}

/**
 * 엑셀 다운로드
 * @constructor
 */
function SAMPLE999M_excelExport()
{
    SAMPLE999M_grid.saveAsExcel();
}

/**
 * 뉴스레터 삭제
 * @param nlMgntSeq
 * @constructor
 */
function SAMPLE999M_fnDelete(nlMgntSeq) {
    if(Utils.isNull(nlMgntSeq)){
        Utils.alert("잘못된 파라미터입니다.");
        return;
    }
    else {
        Utils.confirm("뉴스레터를 삭제하시겠습니까?", function(){
            let param = {
                nlMgntSeq : nlMgntSeq
            }

            Utils.ajaxCall('/sample/SAMPLE999DEL01', JSON.stringify(param), function(result){
                if(result.result > 0) {
                    Utils.alert("삭제되었습니다.", function (){
                        SAMPLE999M_fnSearch();  //그리드 조회
                    });
                }
                else {
                    Utils.alert(result.msg);
                }
            });
        })
    }
}

/**
 * 뉴스레터 등록 팝업
 * @param param
 * @constructor
 */
function SAMPLE999P_openPop(param){
    Utils.openPop(GLOBAL.contextPath + "/sample/SAMPLE999P", "SAMPLE999P", 1240, 1000, param);
}