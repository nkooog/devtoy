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
var startCARD017S, endCARD017S;

var CARD017SDataSource, CARD017S_chartCARD017S;
var CARD017SDateType;
var CARD017SViewType;

var CARD017SBtnArr = document.getElementsByClassName("myButton");

////////////////////////////////////////////////////////////////////////////
//페이지 실행시 다음 함수 실행
$(document).ready(function() {
	
	//1. 상단-날짜 선택 버튼 추가
	init();
	
	//2. 초기 날짜 선택 버튼 설정
	CARD017SDateType = "D";
	CARD017SViewType = "C";
	
	//3.데이터피크 설정
	startCARD017S = $("#CARD017S_startDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	endCARD017S = $("#CARD017S_endDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	//4.데이터를 읽어와서 도넛차트에 데이터 넣기
	//4-1.데이터 소스 정의
	CARD017SDataSource = {
		transport: {
			read: function (CARD017S_getParamValue) {
				if (Utils.isNull(CARD017S_getParamValue.data)) {
					Utils.ajaxCall(
						"/dash/DASH100SEL13",
						JSON.stringify(CARD017S_getParamValue),
						function(data){
							let barGraph = [];
                            var cnslList = JSON.parse(data.list);
                            
                            for(var i=0; i<cnslList.length; i++){
                            	barGraph.push({id:cnslList[i].mbrdComCdNm, value:cnslList[i].mbrdTotal});
                            }
                            
                            CARD017S_chartCARD017S.dataSource.data(barGraph);
						}
					)
				}
			},
		},
		group: {
            field: "id", 
          },
	}
	
	//4-2. 켄도 차트 설정
	
	CARD017S_chartCARD017S = $("#chtCARD170S").kendoChart({
        dataSource: CARD017SDataSource,
        theme: "bootstrap",
        legend: {
        	labels:{
				margin: 4,
			},
            position: "bottom"
        },
        seriesColors: [" #226888","#398eb6", "#ffa200", "#ffd600", "#fff301"],
        seriesDefaults: {
            type: "column",
            style: "smooth",
            radius:  "20%", 
//            holeSize: 80,
        },
        series:
            [{
    	        field: "value",
            }],
        categoryAxis: {
            axisCrossingValue: [0, 10],
            majorGridLines: {
                visible: false
            }
        },
        tooltip: {
            visible: true,
            format: "N0"
        }
    }).data("kendoChart");
	
	
	
	//켄도 차트 데이터 읽어오기
	CARD017SDataSource.transport.read(CARD017S_getParamValue());
});

//상단 - 날짜 기간 선택 버튼 이벤트
function handleClick(event) {
	
	if(CARD017SDateType == event.target.name){
		return;
	}
	
	CARD017SDateType = event.target.name;
	
	if (event.target.classList[1] === "myButtonClick") {
		event.target.classList.remove("myButtonClick");
	} else {
		for (var i = 0; i < CARD017SBtnArr.length; i++) {
			CARD017SBtnArr[i].classList.remove("myButtonClick");
		}
		event.target.classList.add("myButtonClick");
	}
	
	//켄도 차트 데이터 읽어오기
	CARD017SDataSource.transport.read(CARD017S_getParamValue());
}

//상단 - 버튼 초기화
function init() {
  for (var i = 0; i < CARD017SBtnArr.length; i++) {
	  CARD017SBtnArr[i].addEventListener("click", handleClick);
  }  
}


//kendo chart 데이터 요청 전 파라미터 작업 함수
function CARD017S_getParamValue() {	
	
	var startDate 		= $("#CARD017S_startDate").val();
	var endDate			= $("#CARD017S_endDate").val();

	if(CARD017SDateType == "D"){
		startDate = endDate;
	}
	else if(CARD017SDateType == "W"){
		startDate = CARD017S_addDays(endDate, -7).toISOString().split('T')[0];
	}
	else if(CARD017SDateType == "M"){
		startDate = endDate.substr(0, 8) + "01";
	}

	$("#CARD017S_startDate").val(startDate);

    return {
    	startDate 		: "2022-02-01",		//test 중이므로 sratdata는 고정
    	endDate			: endDate,
    }
    
}

//날짜 계산
function CARD017S_addDays(date, days) {
	
    // date는 문자열로 받는다 ex, '2020-10-15'
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
