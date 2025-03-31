/***********************************************************************************************
 * Program Name : 대시보드 body 일정 캘린더 - (CARD012S.js)
 * Creator      : 강동우
 * Create Date  : 2022.05.17
 * Description  : DASH 메인
 * Modify Desc  :  대시보드 body 일정 캘린더
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.02.09     이민호           최초생성
 ************************************************************************************************/

// 상세 열기
function CARD012S_fnSetPopOver(randomID) {
    let actionBtnArr = [
        {
            text: '알람확인',
            iconClass: "k-icon k-i-check",
            click: function (e) {
                TEMPLATE_BASE[randomID].setAlarm();
                e.sender.hide();
            }
        },
        {
            text: "일정수정",
            iconClass: "k-icon k-i-edit",
            click: function (e) {
                TEMPLATE_BASE[randomID].fnPopOpen();
                e.sender.hide();
            }
        },
        {
            text: "닫기",
            click: function (e) {
                e.sender.hide();
            }
        },
    ];
    //    일정상세보기  popup
    let kendoPopover = TEMPLATE_BASE[randomID].$scheduler.kendoPopover({
        filter: ".k-event:not(.k-event-drag-hint)",
        position: "bottom",
        width: 500,
        offset: -10,
        showOn: "click",
        body: kendo.template($('#schedulerDetail').html()),
        actions: actionBtnArr,
        show: function(e) {
            e.sender.popup.wrapper.addClass(randomID);
            e.sender.popup.wrapper.addClass('scheduleDetail');

        },
    }).data("kendoPopover");

    kendoPopover.bind("show", function() {
        if(GLOBAL.session.user.usrId === $("#" + randomID + "_usrId").val()) {
           // $("#" + randomID + "_scheduler" + " .scheduleDetail .k-i-edit").parent().css("display", "block");
            $("."+randomID+" .k-i-edit").parent().css("display", "block");
        }else{
            //$("#" + randomID + "_scheduler" + " .scheduleDetail .k-i-edit").parent().css("display", "none");
            $("."+randomID+" .k-i-edit").parent().css("display", "none");
        }
        if ("Y"==  $("#" + randomID + "_alarmCheck").val()) {
            $("."+randomID+" .k-i-check").parent().css("display", "block");
        }else{
            $("."+randomID+" .k-i-check").parent().css("display", "none");
        }
    });
}

// 사용 시 화면 영역 깨짐으로 deprecated
function CARD012S_fnShedulerReSize(randomID) {
 //[일정 캘린더]   Height   체크
    // let schedulerNote = TEMPLATE_BASE[randomID].$scheduler.data("kendoScheduler");
    let allSchedule = $('.dashCalendarNote');
    if (allSchedule.length > 0) {
        allSchedule.each((idx,elem)=>{
            let schedulerNote = $(elem).data("kendoScheduler");
            let tabCheck = schedulerNote.element.closest('[id*="_innerTab"]').length > 0 ?  80 : 20;
            let swHeight = schedulerNote.element.closest('[class*="dashBody_"]').innerHeight();
            schedulerNote.element.height(swHeight - tabCheck);
            schedulerNote.resize(true);
        })
    }
}

// 일정 등록
function CARD012S_fnNewSchedule( obj ){
    let dashObject = $.extend(obj,{callbackKey:"DASH100M_fnRefreshScheduler"});
    Utils.setCallbackFunction("DASH100M_fnRefreshScheduler", function(){
        return $("#DASH100M .k-scheduler-refresh").trigger('click');
    });
    Utils.openPop(GLOBAL.contextPath + "/cmmt/CMMT440P", "CMMT440P" , 800, 650, dashObject );
}
