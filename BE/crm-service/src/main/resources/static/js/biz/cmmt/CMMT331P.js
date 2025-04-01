var CMMT331PDataSource, CMMT331P_grdCMMT331P, CMMT331P_rawData, $CMMT331P_ToolTip;

$(document).ready(function () {
    CMMT331PDataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall(
                    "/cmmt/CMMT331SEL01",
                    JSON.stringify(options.data),
                    function (result) {
                        CMMT331P_rawData = JSON.parse(result.CMMT331P)
                        options.success(CMMT331P_rawData)
                    }
                )
            }
        },
        schema: {
            type: "json",
            model: {
                fields: {
                    tenantId: {field:"tenantId" ,type: "string"},
                    tndwSeq: {field:"tndwSeq" ,type: "number"},
                    tndwRsn:  {field:"tndwRsn",type: "string"},
                    tndwDtm:  {field:"tndwDtm",type: "number"},
                    rjtrId:   {field:"rjtrId" ,type: "string"}
                }
            }
        }
    })
    CMMT331P_grdCMMT331P = $("#grdCMMT331P").kendoGrid({
        dataSource: CMMT331PDataSource,
        height: 300,
        autoBind: false,
        scrollable: true,
        selectable: true,
        columns: [
            {field: "tenantId", hidden: true},
            {width: 40, field: "tndwSeq", title: "NO",},
            {width: "auto", field: "tndwRsn", title: "반려사유",
                template: '<p class="tdTooltip link" onclick="CMMT331P_detailPopup(this)">#: tndwRsn #</p>' },
            {width: 140, field: "tndwDtm", title: "반려일자",
                template: '#=kendo.toString(new Date(tndwDtm), "yyyy-MM-dd HH:mm:ss")#'},
            {width: 120, field: "rjtrId", title: "반려자",
                template: '#= CMMT331P_transUsr(data) #'},
        ],
        //   data 없을때
        noRecords: {template: `<div class="nodataMsg"><p>${CMMT331P_langMap.get('CMMT331P.grid.nodatafound')}</p></div>`},
    }).data("kendoGrid");
    //   ToolTip
    $CMMT331P_ToolTip = $("#grdCMMT331P").kendoTooltip({
        filter: ".tdTooltip",
        position: "bottom",
        width: 400,
        showOn: "click mouseenter",
        content: function (e) {
            const dataItem = CMMT331P_grdCMMT331P.dataItem(e.target.closest('tr'));
            return dataItem.tndwRsn;
        },
    }).data("kendoTooltip");
    CMMT331P_init();
});
function CMMT331P_transUsr(data) {
    return ''.concat(data.rjtrNm,'(',data.rjtrId,')');
}

function CMMT331P_detailPopup(e) {
    const dataItem = CMMT331P_grdCMMT331P.dataItem(e.closest('tr'));
    const category = Utils.getUrlParam('category');
    const param = {
        tenantId : GLOBAL.session.user.tenantId,
        category : category,
        ctgrNo : category === 'K' ? dataItem.ctgrNo : dataItem.ctgrMgntNo,
        mgntNo : category === 'K' ? dataItem.cntntsNo : dataItem.blthgMgntNo,
        tndwSeq: dataItem.tndwSeq,
        callbackKey : "CMMP331P_callBack",
    }
    Utils.setCallbackFunction("CMMP331P_callBack", function () {
        location.reload();
    });
    Utils.openPop(GLOBAL.contextPath + "/cmmt/CMMT330P", "CMMT330P", 500, 300, param);
}
function CMMT331P_init() {
    CMMT331P_grdCMMT331P.dataSource.read({
        tenantId : GLOBAL.session.user.tenantId,
        category : Utils.getUrlParam('category'),

        // 공통 팝업 전용
        ctgrNo : (Utils.getUrlParam('ctgrNo'))? Number(Utils.getUrlParam('ctgrNo')) : 0,
        cntntsNo : (Utils.getUrlParam('cntntsNo'))? Number(Utils.getUrlParam('cntntsNo')) : 0,
        ctgrMgntNo:(Utils.getUrlParam('ctgrMgntNo'))? Number(Utils.getUrlParam('ctgrMgntNo')) : 0,
        blthgMgntNo:(Utils.getUrlParam('blthgMgntNo'))? Number(Utils.getUrlParam('blthgMgntNo')) : 0,
    })
}