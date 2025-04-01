/***********************************************************************************************

 * Program Name : CMMT400M.js
 * Creator      : bykim
 * Create Date  : 2022.07.08
 * Description  : 월간일정
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.07.08     bykim            최초생성
 ************************************************************************************************/

var CMMT400M_body1_Today = new Date();
var CMMT400M_body1_year = CMMT400M_body1_Today.getFullYear();
var CMMT400M_body1_month = ('0' + (CMMT400M_body1_Today.getMonth() + 1)).slice(-2);
var CMMT400M_body1_Date = CMMT400M_body1_year + CMMT400M_body1_month;
var CMMT400M_userInfo, CMMT400M_searchParam;
var CMMT400M_body1_SchdStrDd = CMMT400M_body1_Date;
var CMMT400M_body1Grid = new Array(1);
var CMMT400M_selDate, CMMT400M_modalClientX, CMMT400M_modalClientY;


for (let i = 0; i < CMMT400M_body1Grid.length; i++) {
    CMMT400M_body1Grid[i] = {
        instance: {},
        dataSource: {},
        currentItem: {},
        currentCellIndex: Number(),
        selectedItems: []
    }
}

$(document).ready(function () {
    CMMT400M_userInfo = GLOBAL.session.user;
    CMMT400M_body1_fnInit();

    resizeCMMT400M();

    let ComboBox_CMMT400M1 = [
        {text: CMMT400M_langMap.get("CMMT400M.all"), value: "1"}, {text: CMMT400M_langMap.get("CMMT400M.ctntTitle"), value: "title"}, {text: CMMT400M_langMap.get("CMMT400M.content"), value: "context"},
    ]

    $("#CMMT400M_cobSrchCond").kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: ComboBox_CMMT400M1,
        clearButton: false,
        value: 1,
        height: 200,
    });
});

$("#CNNT400M_Grid0").on("dblclick", ".k-scheduler-table-auto", function (e) {

    var select_Year = CMMT400M_body1Grid[0].instance.date().getFullYear();
    var select_Month = ('0' + (CMMT400M_body1Grid[0].instance.date().getMonth() + 1)).slice(-2);
    var select_Day = ('0' + (CMMT400M_body1Grid[0].instance.date().getDate())).slice(-2);

    var selectDate = {
        CMMT400M_body1_Year: select_Year,
        CMMT400M_body1_Month: select_Month,
        CMMT400M_body1_Day: select_Day
    }
    CMMT440P_fnNewCal(selectDate)
});


function resizeCMMT400M() {
    var screenHeight = $(window).height() - 210;     //   (헤더+ 푸터 ) 영역 높이 제외

    var schedulerNote = $("#CNNT400M_Grid0").data("kendoScheduler");
    schedulerNote.element.height(screenHeight - 100);
    schedulerNote.resize(true);

    schedulerNote.views["month"].eventSpacing = 2;
    if (window.matchMedia("(max-height: 1300px)").matches) {
        schedulerNote.views["month"].eventsPerDay = 3;
        schedulerNote.views["month"].eventHeight = 15;
    } else {
        schedulerNote.views["month"].eventsPerDay = 5;
        schedulerNote.views["month"].eventHeight = 20;
    }

//	 [일정 캘린더]   Height   체크
    var schedulerNote = $("#CNNT400M_Grid0").data("kendoScheduler");
    var swHeight = $("#CNNT400M_Grid0").parents('div').innerHeight();
    $("#CNNT400M_Grid0").height(swHeight);
    $("#CNNT400M_Grid0").resize(false);

    //    [게시판]   Grid   Height  체크
    var pGridHeight_2 = $("#CMMT400M_body2Grid0").closest('[class*="dashBody_"]').height(),
        bLength = $('.tableCnt_dash.Board').length,
        boardHeight = pGridHeight_2 / bLength - 60;
    $('.tableCnt_dash.Board').find('.k-grid-content').css('height', boardHeight);
}

// 달력 생성 및 컨트롤
for (let i = 0; i < CMMT400M_body1Grid.length; i++) {
    CMMT400M_body1Grid[i] = {
        instance: {},
        dataSource: {},
        currentItem: {},
        currentCellIndex: Number(),
        selectedItems: []
    }
}

function CMMT400M_body1_fnInit() {

    CMMT400M_body1Grid[0].dataSource = new kendo.data.SchedulerDataSource({
        transport: {
            read: function (options) {
                Utils.ajaxCall("/cmmt/CMMT400SEL01", JSON.stringify(CMMT400M_searchParam), function (result) {

                    var CMMT400BODY1_Json = JSON.parse(result.list);
                    var CMMT400M_body1_Html = "";

                    for (let i = 0; i < CMMT400BODY1_Json.length; i++) {
                        var schdStrYear = CMMT400BODY1_Json[i].schdStrDd.substring(0, 4);
                        var schdStrMon = CMMT400BODY1_Json[i].schdStrDd.substring(4, 6);
                        var schdStrDay = CMMT400BODY1_Json[i].schdStrDd.substring(6, 9);
                        var schdStrSi = CMMT400BODY1_Json[i].schdStrSi;
                        var schdStrPt = CMMT400BODY1_Json[i].schdStrPt;

                        var schdEndYear = CMMT400BODY1_Json[i].schdEndDd.substring(0, 4);
                        var schdEndMon = CMMT400BODY1_Json[i].schdEndDd.substring(4, 6);
                        var schdEndDay = CMMT400BODY1_Json[i].schdEndDd.substring(6, 9);
                        var schdEndSi = CMMT400BODY1_Json[i].schdEndSi;
                        var schdEndPt = CMMT400BODY1_Json[i].schdEndPt;

                        var schdStrDd = schdStrYear + "/" + schdStrMon + "/" + schdStrDay + " " + schdStrSi + ":" + schdStrPt;

                        var schdEndDd = schdEndYear + "/" + schdEndMon + "/" + schdEndDay + " " + schdEndSi + ":" + schdEndPt;

                        var startTimezone = new Date(schdStrDd);

                        var endTimezone = new Date(schdEndDd);


                        if (CMMT400BODY1_Json[i].apndFilePsn == null || CMMT400BODY1_Json[i].apndFileNm == null) {
                            CMMT400BODY1_Json[i].apndFilePsn = ""
                            CMMT400BODY1_Json[i].apndFileNm = ""
                        }

                        if (CMMT400BODY1_Json[i].schdTypCd == 1) {
                            CMMT400BODY1_Json[i].schdDvCdNm = CMMT400BODY1_Json[i].schdDvCdNm
                        } else if (CMMT400BODY1_Json[i].schdTypCd == 2) {
                            CMMT400BODY1_Json[i].schdDvCdNm = CMMT400BODY1_Json[i].schdDvCdNm1
                        }

                        if (CMMT400BODY1_Json[i].alrmStCd == 10 || CMMT400BODY1_Json[i].alrmStCd == 90) {
                            CMMT400BODY1_Json[i].alrmStCdNm = CMMT400BODY1_Json[i].alrmStCdNm;
                        } else {
                            var CMMT400BODY1_alrmStCdNm = CMMT400BODY1_Json[i].alrmStCdNm + " " + "알림"
                            CMMT400BODY1_Json[i].alrmStCdNm = CMMT400BODY1_alrmStCdNm;
                        }
                        CMMT400BODY1_Json[i].startTimezone = startTimezone;
                        CMMT400BODY1_Json[i].endTimezone = endTimezone;
                    }
                    options.success(CMMT400BODY1_Json);
                    CMMT400M_schedulList = CMMT400BODY1_Json
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
                CMMT400M_body_List();
            }
        },

        batch: true,
        schema: {
            type: "json",
            model: {
                fields: {
                    start: "startTimezone",
                    end: "endTimezone",
                    title: "schdDvCdNm",
                    subject: "schdTite",
                    text: "schdCtt",
                    schdTypCdNm: "schdTypCdNm",
                    apndFileNm: "apndFileNm",
                    apndFileIdxNm: "apndFileIdxNm",
                    apndFilePsn: "apndFilePsn",
                    download: "download",
                    schdNo: "schdNo",
                    alrmStCdNm: "alrmStCdNm",
                    regYr: "regYr",
                    usrId: "usrId",
                    alarmCheck: "alarmCheck"
                }
            }
        }
    });

    kendo.culture("ko-KR");

    CMMT400M_body1Grid[0].instance = $("#CNNT400M_Grid0").kendoScheduler({
        date: new Date(),
        //start: schdStrDd,
        //end:schdStrDd,
        views: [
            {
                type: "month",
                eventsPerDay: 2,
                eventHeight: 7,
                eventSpacing: 1,
                selected: true,
            }
        ],
        eventTemplate: $("#CMMT400M_eventTemplate").html(),
        // height: 250,
        editable: false,
        footer: false,
        selectable: true,
        resizable: true,
        dataBound: CMMT400M_schedulerDataBound,
        navigate: function (e) {
            CMMT400M_body1_fnOnChange(e);
        },
        dataSource: CMMT400M_body1Grid[0].dataSource,
        resources: [
            {
                field: "title",
                dataValueField: "title",
                dataColorField: "eColor",
                dataSource: [
                    {text:  CMMT400M_langMap.get("CMMT400M.shareEdu"), title: "교육", eColor: "#8bc34a"},
                    {text:  CMMT400M_langMap.get("CMMT400M.shareEtc"), title: "기타", eColor: "#c3771c"},
                    {text:  CMMT400M_langMap.get("CMMT400M.shareMeet"), title: "회의", eColor: "#2d8eff"},
                    {text:  CMMT400M_langMap.get("CMMT400M.shareOut"), title: "외근", eColor: "#ffc107"},
                    {text:  CMMT400M_langMap.get("CMMT400M.perBrth"), title: "생일", eColor: "#08a2ac"},
                    {text:  CMMT400M_langMap.get("CMMT400M.perDirect"), title: "직접입력", eColor: "#a383db"},
                    {text:  CMMT400M_langMap.get("CMMT400M.perPrtBrth"), title: "부모님생신", eColor: "#8acaff"},
                    {text:  CMMT400M_langMap.get("CMMT400M.perAnnv"), title: "결혼기념일", eColor: "#ec7cb1"}
                ]
            }
        ],
    }).data("kendoScheduler");

    //    새로고침 ,  일괄등록  Btn
    CMMT400M_body1Grid[0].instance.element.find('.k-scheduler-toolbar').append(
        '<button class="k-icon k-i-edit bt_edit" title='+ CMMT400M_langMap.get("CMMT400M.saveTotal")+' onclick="CMMT440P_fnNewCal()");"></button>'
    );

    //    캘린더  범주마크 상세보기 Btn
    CMMT400M_body1Grid[0].instance.element.find('.k-toolbar-spacer').append('<button class="k-icon k-i-question swCategory" title='+ CMMT400M_langMap.get("CMMT400M.schCate")+'></button>');

    //    이전, 다음 버튼
    $('#CNNT400M_btScheduerPrev').on('click', function () {
        $('#CNNT400M_Grid0').find('button[aria-label="Previous"]').trigger('click');

        //CMMT400M_body1_fnOnChange();

    });
    $('#CNNT400M_btScheduerNext').on('click', function () {
        $('#CNNT400M_Grid0').find('button[aria-label="Next"]').trigger('click');

        //CMMT400M_body1_fnOnChange();

    });

    //    범주마크  popup
    $(".dashCalendarNote").kendoTooltip({
        filter: ".swCategory",
        position: "bottom",
        width: 200,
        offset: -5,
        showOn: "click",
        autoHide: false,
        content: kendo.template($('#CMMT400M_swCategoryDetail').html())
    });

    CMMT400M_body_List();
    CMMT400M_body1_Popover();

}

//[주간] 보기 날짜표시 format
function CMMT400M_schedulerDataBound(e) {
    // if (this.viewName() == "week") {
    // 	let test = $(".k-lg-date-format").html().split('-');
    // 	let _str = kendo.toString(kendo.parseDate(test[0].trim()), 'yyyy"년" M"월" d"일"(ddd)');
    // 	if (test.length == 2) {
    // 		_str += "  ~  " + kendo.toString(kendo.parseDate(test[1].trim()), 'yyyy"년" M"월" d"일"(ddd)');
    // 	}
    // 	$(".k-lg-date-format").html(_str);
    // 	$(".k-sm-date-format").html(_str);
    //
    // }

    var CMMT400M_body1_Year = CMMT400M_body1Grid[0].instance.date().getFullYear();
    var CMMT400M_body1_Month = ('0' + (CMMT400M_body1Grid[0].instance.date().getMonth() + 1)).slice(-2);
    var CMMT400M_body1__Day = ('0' + (CMMT400M_body1Grid[0].instance.date().getDate())).slice(-2);

    CMMT400M_body1_SchdStrDd = CMMT400M_body1_Year + CMMT400M_body1_Month;
    CMMT400M_selDate = CMMT400M_body1_SchdStrDd + e.sender._model.selectedDate.getDate()


    $("#CNNT400M_Grid0 .k-more-events").on("click", function (ev) {
        let element = CMMT400M_body1Grid[0].instance.view().content.find(ev.target);
        let targetDate = CMMT400M_body1Grid[0].instance.slotByElement(element);
        let year =  targetDate.startDate.getFullYear();
        let month =    ('0' + (targetDate.startDate.getMonth() + 1)).slice(-2);
        let date =  ('0' + ( targetDate.startDate.getDate())).slice(-2);

        CMMT400M_modalClientX = ev.clientX>1250?ev.clientX-250:ev.clientX
        CMMT400M_modalClientY = ev.clientY>700?ev.clientY-100:ev.clientY

        Utils.setCallbackFunction("CMMT400M_DtlModal", CMMT400M_DtlModal);

        // Utils.openPop(GLOBAL.contextPath + "/cmmt/CMMT401P", "CMMT401P", 250, 250,
		 //	{callbackKey : "CMMT400M_DtlModal", selectDate: year+month+date});
        Utils.openKendoWindow("/cmmt/CMMT401P", 300, 250, "left", CMMT400M_modalClientX ,CMMT400M_modalClientY , false,
          {callbackKey : "CMMT400M_DtlModal", selectDate:  year+month+date});

    });
}
function CMMT400M_DtlModal(clientX, clientY, obj){
    let startTime = kendo.format('{0:yyyy-MM-dd HH:mm}',obj.startTimezone)
    let endTime = kendo.format('{0:yyyy-MM-dd HH:mm}',obj.endTimezone)

    Utils.setCallbackFunction("CMMT400M_body1_Popup", CMMT400M_body1_Popup);
    Utils.setCallbackFunction("CMMT400M_fnSearch", CMMT400M_fnSearch);

    CMMT400M_modalClientX = CMMT400M_modalClientX>1000?CMMT400M_modalClientX-200:CMMT400M_modalClientX
    CMMT400M_modalClientY = CMMT400M_modalClientY>500?CMMT400M_modalClientY-50:CMMT400M_modalClientY

   let CMMT402M_DtlMoal = Utils.openKendoWindow("/cmmt/CMMT402P", 500, 315, "left", CMMT400M_modalClientX+20 ,CMMT400M_modalClientY+20, false,
        {schdTite: obj.schdTite, schdTypCdNm: obj.schdTypCdNm, schdCtt: obj.schdCtt, alrmStCdNm: obj.alrmStCdNm ,apndFileNm: obj.apndFileNm
               ,apndFileIdxNm: obj.apndFileIdxNm ,apndFilePsn: obj.apndFilePsn ,start: startTime ,end: endTime, schdNo:obj.schdNo, regYr:obj.regYr
               ,usrId : obj.usrId, schdDvCdNm:obj.schdDvCdNm ,alarmCheck: obj.alarmCheck, callbackKey1 : "CMMT400M_body1_Popup", callbackKey2 : "CMMT400M_fnSearch"}
       );

    CMMT402M_DtlMoal.bind("activate", 
        function() { // 메인화면 클릭시 윈도우 닫기
            $(".k-overlay").on("click", function () {
                CMMT402M_DtlMoal.close();
            });
            $("#CMMT402P_close").on("click", function () {
                CMMT402M_DtlMoal.close();
            });
    });
}

function CMMT400M_body1_fnOnChange(e) {

    var CMMT400M_body1_Year = e.date.getFullYear();
    var CMMT400M_body1_Month = ('0' + (e.date.getMonth() + 1)).slice(-2);

    CMMT400M_body1_SchdStrDd = CMMT400M_body1_Year + CMMT400M_body1_Month;
    CMMT400M_selDate = CMMT400M_body1_SchdStrDd + e.date.getDate();
    //CMMT400M_body_List();
}

function CMMT400M_body_List() {
    CMMT400M_searchParam = {
        tenantId: GLOBAL.session.user.tenantId,
        usrId: GLOBAL.session.user.usrId,
        orgCd: GLOBAL.session.user.orgCd,
        usrGrd: GLOBAL.session.user.usrGrd,
    }

    CMMT400M_searchParam.schdStrDd = CMMT400M_body1_SchdStrDd;

    CMMT400M_body1Grid[0].dataSource.read();
}

function CMMT400M_body1_Popup(schNo, regYr) {

    var CMMT400M_body1_SchdNo = Utils.isNull(schNo)?$("#CMMT400M_body1_SchdNo").val(): schNo;
    var CMMT400M_body1_RegYr =  Utils.isNull(regYr)?$("#CMMT400M_body1_RegYr").val():regYr;

    Utils.openPop(GLOBAL.contextPath + "/cmmt/CMMT440P", "CMMT440P", 850, 620, {
        CMMT440P_regDt: CMMT400M_body1_RegYr,
        CMMT440P_schdNo: CMMT400M_body1_SchdNo
    });
}


function CMMT400M_setAlarm() {

    let CMMT400M_data = {
                            tenantId    : GLOBAL.session.user.tenantId,
                            schdNo      : $("#CMMT400M_body1_SchdNo").val(),
                            regYr       : $("#CMMT400M_body1_RegYr").val(),
                            usrId       : $("#CMMT400M_body1_UsrId").val(),
                            loginId     : GLOBAL.session.user.usrId,
                            lstCorprOrgCd : GLOBAL.session.user.orgCd
    };
    let CMMT400M_jsonStr = JSON.stringify(CMMT400M_data);

    if(GLOBAL.session.user.usrId == $("#CMMT400M_body1_UsrId").val()){
        CMMT400M_url = '/cmmt/CMMT400UPT01';
    }else{
        CMMT400M_url = '/cmmt/CMMT400UPT02';
    }

    Utils.ajaxCall(CMMT400M_url, CMMT400M_jsonStr,CMMT400M_fnSearch());
}


function CMMT400M_body1_Popover() {

    let actionBtnArr = [
        {
            text: '알람확인',
            iconClass: "k-icon k-i-check",
            click: function (e) {
                CMMT400M_setAlarm();
                e.sender.hide();
            }
        },
        {
            text: CMMT400M_langMap.get("CMMT400M.schUpdate"),
            iconClass: "k-icon k-i-edit",
            click: function (e) {
                CMMT400M_body1_Popup();
            }
        },
        {
            text:  CMMT400M_langMap.get("CMMT400M.close"),
            click: function (e) {
                e.sender.hide();
            }
        },
    ];

    //    일정상세보기  popup
    let kendoPopover = $("#CNNT400M_Grid0").kendoPopover({
        filter: ".k-event:not(.k-event-drag-hint)",
        position: "bottom",
        width: 500,
        offset: -10,
        showOn: "click",
        body: kendo.template($('#CMMT400M_dashCalendarDetail').html()),
        actions: actionBtnArr,
        show: function (e) {
            e.sender.popup.wrapper.addClass('CMMT400M');
            e.sender.popup.wrapper.addClass('scheduleDetail');
            if (GLOBAL.session.user.usrId == $("#CMMT400M_body1_UsrId").val()) {
                $(".CMMT400M .k-i-edit").parent().css("display", "block");
            } else {
               $(".CMMT400M .k-i-edit").parent().css("display", "none");
            }

            if ("Y"== $("#CMMT400M_body1_alarmCheck").val()) {
                $(".CMMT400M .k-i-check").parent().css("display", "block");
            } else {
                $(".CMMT400M .k-i-check").parent().css("display", "none");
            }


        },
    }).data("kendoPopover");
}

function CMMT440P_fnNewCal(obj) {
    Utils.openPop(GLOBAL.contextPath + "/cmmt/CMMT440P", "CMMT440P", 800, 730, obj);
}

function CMMT400M_fnSearch(endIsFalse) {

    let from = kendo.toString(new Date($("#CMMT400M_fromDt").val()), "yyyyMMdd");
    let to = kendo.toString(new Date($("#CMMT400M_toDt").val()), "yyyyMMdd");
    if (from > to) {
        Utils.alert(CMMT400M_langMap.get("CMMT400M.setStDate"));
        return;
    }
    if(!Utils.isNull(endIsFalse) && endIsFalse == true){
        from ="";
        to = "";
    }
    let cond = $("#CMMT400M_cobSrchCond").val();
    let text = $("#CMMT400M_srchText").val();


    CMMT400M_searchParam = {
        tenantId: CMMT400M_userInfo.tenantId
        , usrId: CMMT400M_userInfo.usrId
        , orgCd: CMMT400M_userInfo.orgCd
        , usrGrd: CMMT400M_userInfo.usrGrd
        , srchCond: cond
        , srchText: text
        , srchDtTo: to
        , srchDtFrom: from
    };

    CMMT400M_body1Grid[0].dataSource.read();
}

function CMMT400M_Download() {

    let downFilePath = $("#CMMT400M_body1_apndFilePsn").val();
    let downFileName = $("#CMMT400M_body1_apndFileIdxNm").val();

    window.location.href = "/bcs/file/download?urlPath=" + downFilePath + "&fileName=" + downFileName;

}

