/***********************************************************************************************
 * Program Name : 대시보드 body 도넛 차트 - (CARD015S.js)
 * Creator      : wkim
 * Create Date  : 2023.02.20
 * Description  : DASH 메인
 * Modify Desc  :  대시보드 body 도넛 차트
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.02.20     김운           최초생성
 ************************************************************************************************/
var startCARD015S, endCARD015S;

var CARD015SDataSource, CARD015S_chartCARD015S;
var CARD015SDateType;
var CARD015SViewType;

////////////////////////////////////////////////////////////////////////////
//페이지 실행시 다음 함수 실행
$(document).ready(function() {
	
	//2. 초기 날짜 선택 버튼 설정
	CARD015SDateType = "D";
	CARD015SViewType = "C";
	
	//3.데이터피크 설정
	startCARD015S = $("#CARD015S_startDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	endCARD015S = $("#CARD015S_endDate").kendoDatePicker({ 
		value: new Date(),
		format: "yyyy-MM-dd", 
		footer: false, 
		culture: "ko-KR" 
	}).data("kendoDatePicker");
	
	//4.데이터를 읽어와서 도넛차트에 데이터 넣기
	//4-1.데이터 소스 정의
	CARD015SDataSource = {
		transport: {
			read: function (CARD015S_getParamValue) {
				if (Utils.isNull(CARD015S_getParamValue.data)) {
					Utils.ajaxCall(
						"/dash/DASH100SEL13",
						JSON.stringify(CARD015S_getParamValue),
						function(data){
							let donutData = [];
                            var cnslList = JSON.parse(data.list);
                            
                            //모든 값이 0일 경우 차트를 그리지 않기 때문에 1이라도 넣어주어야 함.
                            //모든 값이 0인지 체크
                            var zeroChtCount = 0;
                            for(var i=0; i<cnslList.length; i++){
                            	if(cnslList[i].mbrdTotal == 0){
                            		zeroChtCount++;
                            	}
                            }
                            
                            for(var i=0; i<cnslList.length; i++){
                            	if(cnslList[i].mbrdTotal == 0){
                            		if(zeroChtCount == cnslList.length){					//cnslList.length 가 조회된 항목 개수와 동일하다면 모든 값ㅇ 0이다
                            			cnslList[i].mbrdTotal = -1;
                            		}
                            	}
                                donutData.push({category:cnslList[i].mbrdComCdNm, value:cnslList[i].mbrdTotal});
                            }
                            
                            CARD015S_chartCARD015S.dataSource.data(donutData);
						}
					)
				}
			},
		},
	}
	
	//4-2. 켄도 차트 설정
	CARD015S_chartCARD015S = $("#chtCARD150S").kendoChart({
		dataSource: CARD015SDataSource,
		theme: "material",
		legend: {
			labels:{
				template: "#= text # - #if (value == -1) {# #='0%'# #} else {# #= kendo.format('{0:P}', percentage)# #}#",
//				template:"#= text # - #= kendo.format('{0:P}', percentage)#",
				margin: 4,
			},
			
            position: "bottom"
        },
        seriesColors: [" #226888","#398eb6", "#ffa200", "#ffd600", "#fff301"],
        seriesDefaults: {
            labels: {
                template: "#= category #",
                position: "outsideEnd",
                visible: true,
                background: "transparent"
            },
            startAngle: 90,
            type: "donut",
            style: "smooth",
            radius:  "20%", 
//            holeSize: 80,
        },
        series: [{
        	field: "value",
            name: "category"
        }],
        tooltip: {
            visible: true,
            template: "#= category # : #if (value == -1) {# #='0 % (0건)'# #} else {# #=kendo.format('{0:P}', percentage)# (#=value##='건'#) #}#",
//            template: "#= category # : #= kendo.format('{0:P}', percentage)# #if (value == -1) {# #=value# #} else {# #=value# #}",
            background: "#ffffff",
            
        }
	}).data("kendoChart");
	
	//켄도 차트 데이터 읽어오기
	CARD015SDataSource.transport.read(CARD015S_getParamValue());
	
	CARD015S_chtResize();
});

//상단 - 날짜 기간 선택 버튼 이벤트
function btnDateSet(nType) {
	
	if(CARD015SDateType == nType){
		return;
	}
	
	let targetBtn = $("#btn" + nType);
	let targetBtnClass = targetBtn.attr('class').split(/\s+/);
	
	CARD015SDateType = nType;

	if (targetBtnClass[1] === "myButtonClick") {
		targetBtn.removeClass("myButtonClick");
	} else {
		$("#btnD").removeClass("myButtonClick");
		$("#btnW").removeClass("myButtonClick");
		$("#btnM").removeClass("myButtonClick");
		targetBtn.addClass("myButtonClick");
	}
	
	//켄도 차트 데이터 읽어오기
	CARD015SDataSource.transport.read(CARD015S_getParamValue());
}

$(window).resize(function(){
	CARD015S_chtResize();
});

function CARD015S_chtResize() {   
	let innter = $("#CARD015S").closest('[class*="dashBody_"]').innerHeight();
	$("#CARD015S").css('height', innter - 70)
}

function CARD015S_getParamValue() {	
	
	var startDate 		= $("#CARD015S_startDate").val();
	var endDate			= $("#CARD015S_endDate").val();
	
//	//'주간'을 선택했을 때 오늘 날짜에서 7일을 빼주고, 지난 달로 넘어 갈 경우 1일로 설정
//	//오늘 날짜에서 -7
//	if(CARD015SDateType == "W"){
//		startDateSplit = CARD015S_addDays(startDate, -7).toISOString().split('T')[0];
//	}
//	
//	//지난달로 넘어갔을 경우 1일로 설정
//	if(startDate.substr(8,2) < startDateSplit.substr(8,2) || CARD015SDateType == "M"){
//		startDate = startDate.substr(0, 8) + "01";
//	}
//	else{
//		startDate = startDateSplit;
//	}
	
	if(CARD015SDateType == "D"){
		startDate = endDate;
	}
	else if(CARD015SDateType == "W"){
		startDate = CARD015S_addDays(endDate, -7).toISOString().split('T')[0];
	}
	else if(CARD015SDateType == "M"){
		startDate = endDate.substr(0, 8) + "01";
	}
	
	$("#CARD015S_startDate").val(startDate);
	
	//kw--- 20230424 : 날짜 형식 변경 ex( 2023-04-24 -> 20230424 )
	startDate 	= startDate.replaceAll('-', '');
	endDate 	= endDate.replaceAll('-', '');

    return {
    	tenantId		: GLOBAL.session.user.tenantId,
    	cardStartDate 		: startDate,		
    	cardEndDate			: endDate,
    }
    
}

//날짜 계산
function CARD015S_addDays(date, days) {
	
    // date는 문자열로 받는다 ex, '2020-10-15'
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
