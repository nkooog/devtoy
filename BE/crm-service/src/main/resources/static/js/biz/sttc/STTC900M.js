var STTC900M_gridData;

$(document).ready(function() {

    STTC900M_init();

    $("#STTC900M_searchForm .formAlign button").click(function () {
        $("#STTC900M_searchForm .formAlign button").removeClass('selected');
        $(this).addClass('selected');
    });
});

function STTC900M_init()
{
    STTC900M_grid();

    setTimeout(function() {
        STTC900M_fnSearch();
    }, 100);

    $(".STTC900_searchForm").on("keyup",function(key){
        if(key.keyCode==13) {
            STTC900M_fnSearch();
        }
    });

    $("#STTC900_shPhone").keyup(function(){
        var val = $(this).val().replace(/[^0-9]/g, '');
        if(val.length > 3 && val.length < 6){
            var tmp = val.substring(0,2)
            if(tmp == "02"){
                $(this).val(val.substring(0,2) + "-" + val.substring(2));
            } else {
                $(this).val(val.substring(0,3) + "-" + val.substring(3));
            }
        }else if (val.length > 6){
            var tmp = val.substring(0,2)
            var tmp2 = val.substring(0,4)
            if(tmp == "02"){
                if(val.length == "10"){
                    $(this).val(val.substring(0,2) + "-" + val.substring(2, 6) + "-" + val.substring(6));
                } else {
                    $(this).val(val.substring(0,2) + "-" + val.substring(2, 5) + "-" + val.substring(5));
                }
            } else if(tmp2 == "0505"){
                if(val.length == "12"){
                    $(this).val(val.substring(0,4) + "-" + val.substring(4, 8) + "-" + val.substring(8));
                } else {
                    $(this).val(val.substring(0,4) + "-" + val.substring(4, 7) + "-" + val.substring(7));
                }
            } else {
                if(val.length == "11"){
                    $(this).val(val.substring(0,3) + "-" + val.substring(3, 7) + "-" + val.substring(7));
                } else {
                    $(this).val(val.substring(0,3) + "-" + val.substring(3, 6) + "-" + val.substring(6));
                }
            }
        }
    });
}

function STTC900M_grid()
{
    $("#grdSTTC_900M").kendoGrid({
        dataSource: [],
        noRecords: { template: '<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>' },
        autoBind: false,
        sortable: true,
        scrollable: true,
//        pageable: {
//            refresh:false
//            , pageSizes:[ 25, 50, 100, 200,  500]
//            , buttonCount:10
//            , pageSize : 25
//        },
        dataBound: STTC900M_onDataBound,
        columns: [
            { field: "", title: "NO", width: 40, },
            { field: "PATNAME", title: "환자명", width: 70, },
            { field: "PATNO", title: "등록번호", width: 70, },
            { field: "RESNOPREV", title: "주민번호", width: 90,
                template: function (dataItem) {
                    let jumn = dataItem.RESNOPREV + "-" + dataItem.RESNONEXT;
                    if(!Utils.isNull(Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 37)) && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 37).bsVl1 == "Y"){
                        jumn = maskingFunc.rrn(jumn);
                    }
                    return jumn;
                }
            },
            {
                field: "SEX", title: "성별", width: 40,
            },
            {
                field: "AGE", title: "나이", width: 40,
            },
            { field: "ACTDATE", title: "접수일시", width: 120, },
            { field: "RSVDATE", title: "예약일시", width: 80, },
            { field: "DEPTNAME", title: "진료과", width: 100, },
            { field: "DOCTORNAME", title: "의사명", width: 80, },
            { field: "RSVTYPE", title: "초재진", width: 80, },
            { field: "ILLNAME", title: "상병명", width: 130, },
            { field: "MEDYN", title: "진료여부", width: 65, },
            { field: "RERSVYN", title: "재예약", width: 55, },
            {
                title: "매출",
                columns: [
                    {field: "MEDAMOUNT", title: "외래진료비", width: 70, footerTemplate: "<div id='medamount_sum' class='tr pointer ftClick' style='font-weight: 900;'></div>"},
                    {field: "HOSPAMOUNT", title: "입원진료비", width: 70, footerTemplate: "<div id='hospamount_sum' class='tr pointer ftClick' style='font-weight: 900;'></div>"},
                    {field: "SURGAMOUNT", title: "수술비", width: 70, footerTemplate: "<div id='surgamount_sum' class='tr pointer ftClick' style='font-weight: 900;'></div>"},
                    {field: "TESTAMOUNT", title: "검사비", width: 70, footerTemplate: "<div id='testamount_sum' class='tr pointer ftClick' style='font-weight: 900;'></div>"},
                    {field: "ETCAMOUNT", title: "기타", width: 70, footerTemplate: "<div id='etcamount_sum' class='tr pointer ftClick' style='font-weight: 900;'></div>"},
                    {field: "TOTAMOUNT", title: "합계", width: 70, footerTemplate: "<div id='totamount_sum' class='tr pointer ftClick' style='font-weight: 900;'></div>"}
                ]
            },
            { field: "INSERTNAME", title: "최초예약자", width: 70, }
        ],
    });
    //detail Grid 상단

    STTC900M_gridData = $("#grdSTTC_900M").data("kendoGrid");

    STTC900M_gridData.dataSource.aggregate([
        { field: "MEDAMOUNT", aggregate: "sum" }
        , { field: "HOSPAMOUNT", aggregate: "sum" }
        , { field: "SURGAMOUNT", aggregate: "sum" }
        , { field: "TESTAMOUNT", aggregate: "sum" }
        , { field: "ETCAMOUNT", aggregate: "sum" }
        , { field: "TOTAMOUNT", aggregate: "sum" }
    ]);

    STTC900M_GridResize();
}

$(window).resize(function(){
    STTC900M_GridResize();
});

//Grid   Height  체크
function STTC900M_GridResize() {
    //그리드 높이 조절
    let STTC900M_screenHeight = $(window).height();
    STTC900M_gridData.element.find('.k-grid-content').css('height', STTC900M_screenHeight - 440);
};

function STTC900M_fnSearch()
{
    window.kendo.ui.progress($("#grdSTTC_900M"), true);

    let arrDivision 		= ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
    let arrPatName 			= ["이영희", "이나희", "문수경", "김현송", "권재용", "정영숙", "조상현", "이희선", "오승훈", "김순희", "김도영", "이서윤", "박지훈", "최유정", "강하린", "신재우", "정예슬", "유서현", "오지민", "한승우"];
    let arrDoctorName       = ["김민수", "이준호", "박서현", "최민지", "한지민", "정하늘", "유가영", "강동현", "신수민", "오윤서", "서정우", "장민준", "홍수연", "윤지수", "배정원", "임선우", "송하린", "권유진", "문예진", "안도현"];
    let arrDeptName  	    = ["비뇨의학과", "순환기내과", "소화기내과", "소화기내과", "유방갑상선외과", "비뇨의학과", "내분비내과", "내분비내과", "비뇨의학과", "신장내과", "소화기내과", "소화기내과", "가정의학과"];
    let arrIllName  	    = ["특발성 혈뇨", "고혈압", "간의 혈관종", "지방간 질환", "갑산성 결절", "신경성 방광", "당뇨병전기", "고지질혈증", "현미경적 혈뇨", "고칼륨혈증", "결장선종", "간검사 이상", "건강 점검 NOS"];
    let arrRsvType          = ["과초진", "재진", "상병초진", "병원초진"]

    let todayDate = $("#STTC900M_StartDate").val();

    let arrResult = [];

    $.each(arrDivision, function(index, item){

        let randomIndex = STTC900M_fnRandomIndex();
        let randomPrev = STTC900M_fnRandomRsvPrev();
        let randomNext = STTC900M_fnRandomRsvNext();

        let birthYear = parseInt(randomPrev.substring(0, 2), 10);
        let birthMonth = parseInt(randomPrev.substring(2, 4), 10);
        let birthDay = parseInt(randomPrev.substring(4, 6), 10);

        birthYear += 1900;

        let today = new Date();
        let currentYear = today.getFullYear();
        let currentMonth = today.getMonth() + 1;  // 월은 0부터 시작하므로 +1
        let currentDay = today.getDate();

        let age = currentYear - birthYear;

        if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
            age--;
        }

        let randomSex = "남";
        if(randomNext.substring(0, 1) == "2"){
            randomSex = "여";
        }

        let medCount = STTC900M_fnRandomMed();
        let hospCount = 0;
        let surgCount = STTC900M_fnRandomSurg();
        let testCount = STTC900M_fnRandomTest();
        let etcCount = STTC900M_fnRandomEtc();
        let totalCount = medCount + hospCount + surgCount + testCount + etcCount;

        let obj = {
            NO		    : index+1,					                                        //no
            PATNAME 	: arrPatName[index],			                                    //이름
            PATNO		: STTC900M_fnRandomNumber(8),					                //환자번호
            RESNOPREV	: randomPrev,	                                    //주민번호
            RESNONEXT   : randomNext,
            SEX		    : randomSex,					                        //성별
            AGE		    : age,					                                            //나이
            ACTDATE		: todayDate + " " + STTC900M_fnRandomRsvTime() + ":00",					//접수일시
            RSVDATE		: todayDate,					//예약일시
            DEPTNAME	: arrDeptName[randomIndex],					                        //진료과
            DOCTORNAME	: arrDoctorName[index],					                            //의사명
            RSVTYPE		: STTC900M_fnRandomRsvType(),					                    //초재진
            ILLNAME		: arrIllName[randomIndex],					                        //상병명
            MEDYN		: "Y",					//진료여부
            RERSVYN		: STTC900M_fnRandomYN(),					//재예약
            MEDAMOUNT	: medCount ,					//외래진료비
            HOSPAMOUNT	: hospCount,					//입원진료비
            SURGAMOUNT	: surgCount,					//수술비
            TESTAMOUNT	: testCount,					//검사비
            ETCAMOUNT	: etcCount,					//기타
            TOTAMOUNT	: totalCount,					//합계
            INSERTNAME	: STTC900M_fnRandomNurseNm(),					//최초예약자
        }

        arrResult.push(obj);
    });

    STTC900M_gridData.dataSource.data(arrResult);

    STTC900M_gridData.dataSource.aggregate([
        { field: "MEDAMOUNT", aggregate: "sum" }
        , { field: "HOSPAMOUNT", aggregate: "sum" }
        , { field: "SURGAMOUNT", aggregate: "sum" }
        , { field: "TESTAMOUNT", aggregate: "sum" }
        , { field: "ETCAMOUNT", aggregate: "sum" }
        , { field: "TOTAMOUNT", aggregate: "sum" }
    ]);

    window.kendo.ui.progress($("#grdSTTC_900M"), false);

    $(".k-footer-template td").css("border-right", "0px");
    for(var i=0; i<$(".k-footer-template td").length; i++)
    {
        if($(".k-footer-template td").eq(i).children().length > 0 || i == $(".k-footer-template td").length - 1){
            $(".k-footer-template td").eq(i).css("border-left", "solid #c9c9c9 1px");
        }
    }
}

function convertToNumber(value) {
    return Utils.isNotNull(value) ? Number(value) : 0;
}

function formatMoneyComma(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function STTC900M_onDataBound(e)
{
    var rows = this.tbody.children();
    var totalRows = rows.length; // 그리드의 전체 행 개수

    // 페이지 당 시작 인덱스 계산
    var startIndex = 1;

    for (var i = 0; i < totalRows; i++) {
        let row = $(rows[i]);
        // 순서대로 번호 매기기
        let index = i + startIndex; // 현재 페이지의 첫 번째 행에 대한 올바른 인덱스 계산
        row.children().eq(0).text(index);
    }

    $("#medamount_sum").text(formatMoneyComma(STTC900M_gridData.dataSource.aggregates().MEDAMOUNT.sum));
    $("#hospamount_sum").text(formatMoneyComma(STTC900M_gridData.dataSource.aggregates().HOSPAMOUNT.sum));
    $("#surgamount_sum").text(formatMoneyComma(STTC900M_gridData.dataSource.aggregates().SURGAMOUNT.sum));
    $("#testamount_sum").text(formatMoneyComma(STTC900M_gridData.dataSource.aggregates().TESTAMOUNT.sum));
    $("#etcamount_sum").text(formatMoneyComma(STTC900M_gridData.dataSource.aggregates().ETCAMOUNT.sum));
    $("#totamount_sum").text(formatMoneyComma(STTC900M_gridData.dataSource.aggregates().TOTAMOUNT.sum));

    var gridFooter = $("#grdSTTC_900M").getKendoGrid().footer; // footer 선택
    var cells = gridFooter.find("td"); // 모든 td 요소 선택

// 첫 번째 셀에 colspan 속성 추가
    $(cells[0]).attr("colspan", "14"); // jQuery 객체로 변환
    $(cells[0]).css("text-align", "right"); // jQuery 객체로 변환

// 두 번째 셀 제거
    $(cells[1]).remove(); // jQuery 객체로 변환
    $(cells[2]).remove(); // jQuery 객체로 변환
    $(cells[3]).remove(); // jQuery 객체로 변환
    $(cells[4]).remove(); // jQuery 객체로 변환
    $(cells[5]).remove(); // jQuery 객체로 변환
    $(cells[6]).remove(); // jQuery 객체로 변환
    $(cells[7]).remove(); // jQuery 객체로 변환
    $(cells[8]).remove(); // jQuery 객체로 변환
    $(cells[9]).remove(); // jQuery 객체로 변환
    $(cells[10]).remove(); // jQuery 객체로 변환
    $(cells[11]).remove(); // jQuery 객체로 변환
    $(cells[12]).remove(); // jQuery 객체로 변환
    $(cells[13]).remove(); // jQuery 객체로 변환
}

function STTC900M_excelExport() {
    var today = new Date();

    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);

    var dateString = year + month  + day;

    STTC900_excelExport(STTC900M_gridData, dateString + "_" + STTC900M_langMap.get("STTC900M.title"));
}

function STTC900_excelExport(targetGrid, fileName) {
    const pageSize = targetGrid.dataSource.view().length;
    if (pageSize === 0) {
        Utils.alert(STTC900M_langMap.get("STTC900M.validMsg1"));
        return;
    }
    const dataSourceTotal = targetGrid.dataSource.total();
    targetGrid.dataSource.pageSize(dataSourceTotal);
    targetGrid.bind("excelExport", function (e) {
        e.workbook.fileName = fileName;
        let sheet = e.workbook.sheets[0];

        let setDataItem = {};
        let selectableNum = 0;
        if (this.columns[0].selectable) {
            selectableNum = 1
        }
        if (this.columns[0].template === '#= ++record #') {
            record = 0;
        }

        /*this.columns.forEach(function (item, index) {
            if (Utils.isNotNull(item.template)) {
                let targetTemplate = kendo.template(item.template);
                let fieldName = item.field;
                for (let i = 1; i < sheet.rows.length; i++) {
                    let row = sheet.rows[i];
                    setDataItem = {
                        [fieldName]: row.cells[(index - selectableNum)].value
                    }
                    if(fieldName == "RESNOPREV") row.cells[(index - selectableNum)].value = setDataItem.RESNOPREV;
                    else row.cells[(index - selectableNum)].value = targetTemplate(setDataItem);
                }
            }
        });*/

        let amounts = {
            medamount: $("#medamount_sum").text(),
            hospamount: $("#hospamount_sum").text(),
            surgamount: $("#surgamount_sum").text(),
            testamount: $("#testamount_sum").text(),
            etcamount: $("#etcamount_sum").text(),
            totamount: $("#totamount_sum").text()
        };
        for (let i = 1; i < sheet.rows.length; i++) {
            let row = sheet.rows[i];

            targetGrid.columns.forEach(function (item, index) {
                let dataIndex = index - selectableNum;
                let cell = row.cells[dataIndex];
                if(cell)
                {
                    let fieldName = item.field;
                    setDataItem = {
                        [fieldName]: cell.value
                    };

                    if(row.type == "footer" && index == 14){
                        row.cells[13].value = amounts.medamount;
                        row.cells[14].value = amounts.hospamount;
                        row.cells[15].value = amounts.surgamount;
                        row.cells[16].value = amounts.testamount;
                        row.cells[17].value = amounts.etcamount;
                        row.cells[18].value = amounts.totamount;
                    }
                    else if (fieldName != "RESNOPREV" && Utils.isNotNull(item.template)) {
                        let targetTemplate = kendo.template(item.template);
                        cell.value = targetTemplate(setDataItem);
                    }
                }
            });

            for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                // sheet.columns[cellIndex].autoWidth = true; // 자동 너비 설정
            }
        }
    });
    targetGrid.saveAsExcel();
}

function STTC900M_fnRandomRsvPrev(){
    let rsv1 = Math.floor(Math.random() * 30) + 70;
    rsv1 = rsv1.toString().padStart(2, '0');
    let rsv2 = Math.floor(Math.random() * 12) + 1;
    rsv2 = rsv2.toString().padStart(2, '0');
    let rsv3 = Math.floor(Math.random() * 30) + 1;
    rsv3 = rsv3.toString().padStart(2, '0');

    return rsv1 + rsv2 + rsv3;
}

function STTC900M_fnRandomRsvNext(){
    let rsv1 = Math.floor(Math.random() * 2) + 1;
    rsv1 = rsv1.toString();

    let min = Math.pow(10, 5);
    let max = Math.pow(10, 5) - 1;
    let rsv2 = Math.floor(min + Math.random() * (max - min + 1));
    rsv2 = rsv2.toString();

    return rsv1 + rsv2
}

function STTC900M_fnRandomRsvTime(){
    const randomNum = Math.floor(Math.random() * 9) + 9;
    return randomNum.toString().padStart(2, '0');
}

function STTC900M_fnRandomNumber(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(min + Math.random() * (max - min + 1));
}

function STTC900M_fnRandomSex() {
    return Math.random() < 0.5 ? '여' : '남';
}

function STTC900M_fnRandomIndex(){
    let randomNum = Math.floor(Math.random() * 13);
    return randomNum;
}

function STTC900M_fnRandomRsvType() {
    const randomNum = Math.floor(Math.random() * 3) + 1;
    let strReturn = '과초진';
    if(randomNum == 1){		strReturn = '과초진'; }
    else if(randomNum == 2){		strReturn = '재진'; }
    else if(randomNum == 3){		strReturn = '상병초진'; }
    else if(randomNum == 4){		strReturn = '병원초진'; }
    return strReturn;
}

function STTC900M_fnRandomYN() {
    return Math.random() < 0.5 ? 'N' : 'Y';
}

function STTC900M_fnRandomNurseNm() {
    return Math.random() < 0.5 ? '김수진' : '박혜민';
}

function STTC900M_fnRandomMed(){
    let randomNum = Math.floor(Math.random() * 8) + 1;
    let strReturn = 22670;
    if(randomNum == 1){		strReturn = 22670; }
    else if(randomNum == 2){		strReturn = 13450; }
    else if(randomNum == 3){		strReturn = 20390; }
    else if(randomNum == 4){		strReturn = 18000; }
    else if(randomNum == 5){		strReturn = 32500; }
    else if(randomNum == 6){		strReturn = 17000; }
    else if(randomNum == 7){		strReturn = 8850; }
    else if(randomNum == 8){		strReturn = 0; }
    return strReturn;
}

function STTC900M_fnRandomSurg(){
    let randomNum = Math.floor(Math.random() * 8) + 1;
    let strReturn = 0;
    if(randomNum == 1){		strReturn = 0; }
    else if(randomNum == 2){		strReturn = 360700; }
    else if(randomNum == 3){		strReturn = 263330; }
    else if(randomNum == 4){		strReturn = 102320; }
    else if(randomNum == 5){		strReturn = 49390; }
    else if(randomNum == 6){		strReturn = 107000; }
    else if(randomNum == 7){		strReturn = 018400; }
    else if(randomNum == 8){		strReturn = 072490; }
    return strReturn;
}

function STTC900M_fnRandomTest(){
    let randomNum = Math.floor(Math.random() * 8) + 1;
    let strReturn = 0;
    if(randomNum == 1){		strReturn = 0; }
    else if(randomNum == 2){		strReturn = 13450; }
    else if(randomNum == 3){		strReturn = 18000; }
    else if(randomNum == 4){		strReturn = 8000; }
    else if(randomNum == 5){		strReturn = 9600; }
    else if(randomNum == 6){		strReturn = 12350; }
    else if(randomNum == 7){		strReturn = 9480; }
    else if(randomNum == 8){		strReturn = 0; }
    return strReturn;
}

function STTC900M_fnRandomEtc(){
    let randomNum = Math.floor(Math.random() * 8) + 1;
    let strReturn = 0;
    if(randomNum == 1){		strReturn = 0; }
    else if(randomNum == 2){		strReturn = 167380; }
    else if(randomNum == 3){		strReturn = 95400; }
    else if(randomNum == 4){		strReturn = 11400; }
    else if(randomNum == 5){		strReturn = 266530; }
    else if(randomNum == 6){		strReturn = 6450; }
    else if(randomNum == 7){		strReturn = 232250; }
    else if(randomNum == 8){		strReturn = 0; }
    return strReturn;
}