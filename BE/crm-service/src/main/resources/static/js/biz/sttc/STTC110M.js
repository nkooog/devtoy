var startSTTC110M, endSTTC110M;
var STTC110M_CommCodeList;
var STTC110M_userInfo = GLOBAL.session.user;
var STTC110M_CommCodeList;
var STTC110M_Grid =new Array(1);
var STTC110M_Chart =new Array(1);

var STTC110M_cmmCodeList, STTC110M_grdSTTC110M, STTC110MDataSource, STTC110M_ToolTip;

////////////////////////////////////////////////////////////////////////////
//페이지 실행시 다음 함수 실행
$(document).ready(function() {
	
	//2.콤보박스 설정	
	var mgntItemCdList = [
		{"mgntItemCd":"S0013"},		//통계 - 조회유형
		{"mgntItemCd":"S0014"},		//통계 - 통계 유형
		{"mgntItemCd":"S0015"},		//통계 - 콜 유형
	];

	Utils.ajaxCall('/comm/COMM100SEL01',  JSON.stringify({ "codeList": mgntItemCdList}),function(data){
		STTC110M_CommCodeList = JSON.parse(JSON.parse(JSON.stringify(data.codeList)));
		Utils.setKendoComboBox(STTC110M_CommCodeList, "S0013", '#STTC110M input[name=STTC110M_searchType]',"DY",false);		//조회유형
		Utils.setKendoComboBox(STTC110M_CommCodeList, "S0014", '#STTC110M input[name=STTC110M_statType]',"",false);			//통계유형
		Utils.setKendoComboBox(STTC110M_CommCodeList, "S0015", '#STTC110M input[name=STTC110M_searchCallType]',"","전체");	//콜 유형
	},null,STTC110M_fnSearchList,null );
	
	//4.그리드 설정
	STTC110MDataSource = {
		schema: {
			type: "json",
			model: {
				fields: {
					cnslGrpNm		:	{ field: "cnslGrpNm",		type: "string", editable: false},
					date0			:	{ field: "date0", 			type: "number", editable: false},
					totalCount		:	{ field: "totalCount",		type: "number", editable: false},
				}
			}
		},
	}
	
	STTC110M_grdSTTC110M = $("#grdSTTC110M").kendoGrid({
        dataSource: STTC110MDataSource,
		autoBind: false,
		resizable: true,
		refresh: true,
		sortable: false,
        sort: function (e) {
            if (STTC110M_grdSTTC110M.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        dataBinding: function () {
            record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        columns: [
        	{ width : 130, field : "cnslGrpNm", title : STTC110M_langMap.get("STTC110M.gridTitleCnslGroup"), attributes:{ style:"text-align:left"}, locked: true,},
        	{ width : 100, field : "date0", title : $("#STTC110M_startDate").val(), attributes:{ style:"text-align:right"},},
    		{ width : 100, field : "totalCount", title : STTC110M_langMap.get("STTC110M.gridTitleTotal"), attributes:{ style:"text-align:right"}},
        ],
        dataBound: function(e) {
            // iterate the data items and apply row styles where necessary
            var dataItems = e.sender.dataSource.view();
            for (var j = 0; j < dataItems.length; j++) {
            	
              // Get the value of the discontinued cell from the current dataItem.
              var discontinued = dataItems[j].get("cnslGrpNm");

              var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
             
              if(discontinued == "합계" || discontinued == "평균"){
            	  var cell = row.children();
                  cell.addClass("totalColor");
              }              
            }
        },
        noRecords: { template: '<div class="nodataMsg"><p>'+STTC110M_langMap.get("grid.nodatafound")+'</p></div>' },
    }).data("kendoGrid");
	
	//1.테넌트 설정
	CMMN_SEARCH_TENANT["STTC110M"].fnInit(null,STTC110M_tenatIdSet);
	
	STTC110M_GridResize();
//	STTC110M_fnSearchMyCounseling();
});
//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
//1. 테넌트 아이디 설정
function STTC110M_tenatIdSet(){
	
}
//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
//데이터 피크 이벤트시 다음 함수 실행
//1. 시작 데이터 피크 이벤트
function startChangeSTTC110M() {
	var startDate = startSTTC110M.value();
	var endDate = endSTTC110M.value();

	if (startDate) {
		startDate = new Date(startDate);
		startDate.setDate(startDate.getDate());
		endSTTC110M.min(startDate);
	} else if (endDate) {
		startSTTC110M.max(new Date(endDate));
	} else {
		endDate = new Date();
		startSTTC110M.max(endDate);
		endSTTC110M.min(endDate);
	}
}
//2. 종료 데이터 피크 이벤트 
function endChangeSTTC110M() {
	var endDate = startSTTC110M.value();
	var startDate = endSTTC110M.value();

	if (endDate) {
		endDate = new Date(endDate);
		endDate.setDate(endDate.getDate());
		startSTTC110M.max(endDate);
	} else if (startDate) {
		endSTTC110M.min(new Date(startDate));
	} else {
		endDate = new Date();
		startSTTC110M.max(endDate);
		endSTTC110M.min(endDate);
	}
}
//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
//그리트 관련 함수

function STTC110M_fnSearchMyCounseling() {
    STTC110M_grdSTTC110M.dataSource.data([]);

    let valid = true;

    Utils.markingRequiredField();
    if (Utils.isNull($('#STTC110M_tenantId').val())) {
        Utils.alert(CNSL400M_langMap.get("CNSL.tenantId.required.msg"),
            () => {
                return tenantId.focus();
            });
        valid = false;
    }

//    if(valid) {
//        const paramValue = STTC110M_getParamValue();
//        STTC110MDataSource.transport.read(paramValue);
//    }
}

function STTC110M_getParamValue() {
	var arr = [];
	
	var startDate 		= $("#STTC110M_startDate").val();
	var endDate 		= $("#STTC110M_endDate").val();
	var searchType 		= $("#STTC110M_searchType").val();
	var searchCallType 	= $("#STTC110M_searchCallType").val();
	var statType		= $("#STTC110M_statType").val();
	
	if(searchType == ""){ searchType = "DY"; }
	
	//그리드 컬럼 이름들을 파라미터로 넘김
	//데이터를 넣을 때 컬럼이름과 getRegDtm을 비교하여 데이터 순서를 정함
	if(searchType == "TZ" || searchType == ""){
		for(var i=0; i<24; i++){
			arr[i] = i;
		}
	}
	else if(searchType == "DY"){
		for(var i=0; i<=STTC110M_getDateDiff(startDate, endDate); i++){
			arr[i] = STTC110M_addDays(startDate, i).toISOString().split('T')[0];
		}
	}
	else if(searchType == "MN"){
		
		//kw---20230424 : endDate의 달 수가 안들어 갔을 경우를 체크 하기 위함
		//STTC110M_getMonthDiff 에서 달수 계산이 안될 경우를 위한 예외처리....
		var endMonYn = false;
		
		for(var i=0; i<=STTC110M_getMonthDiff(startDate, endDate); i++){
			arr[i] = STTC110M_addMonth(startDate, i) + "-01";
			
			//kw---20230424 : arr배열에 endDate의 달이 들어 갔는지 체크
			if(arr[i] == (endDate.substr(0, 7) + "-01")){
				endMonYn = true;
			}
		}
		
		//kw---20230424 : arr배열에 endDate의 달이 안들어갔을 경우
		if(endMonYn == false){
			arr[arr.length] = endDate.substr(0, 7) + "-01"
		}
	}
	
	
	
	//kw--- 20230424 : 날짜 형식 변경 ex( 2023-04-24 -> 20230424 )
	startDate 	= startDate.replaceAll('-', '');
	endDate 	= endDate.replaceAll('-', '');
	
    return {
    	serachDateList 		: arr,
        tenantId			: $("#STTC110M_tenantId").val(),
        statType			: statType,
	 	searchType			: searchType,
        startDate			: startDate,
        endDate				: endDate,
        searchCallType		: searchCallType,
    }
}



/**
 * date0, date1 과같은 칼럼과 날짜의 데이터 매핑을 위한 Obj 생성
 * @param startDate
 * @param endDate
 * @param searchType
 * @returns {{date0 : '20240301' , date1 : '20240302' ...}}
 */
function sttc110_initDateMapping(startDate ,endDate ,searchType ){
	DateMapping = {}

	if(searchType == "TZ" || searchType == ""){
		fieldTotalCount = 24;
		for(var i=0; i<fieldTotalCount; i++){
			DateMapping["date" + i] = String(i).padStart(2,"0")
		}
	} else if(searchType == "DY"){
		var fieldTotalCount = STTC110M_getDateDiff(startDate, endDate);
		for(var i=0; i<=fieldTotalCount; i++){
			DateMapping["date" + i] = STTC110M_addDays(startDate, i).toISOString().split('T')[0].replaceAll('-','')
		}
	} else if(searchType == "MN"){
		startDate = startDate.substr(0,8) + "01";
		var lastDate = new Date(endDate.substr(0,4), endDate.substr(5,2), 0);
		endDate = endDate.substr(0,8) + lastDate.getDate();

		var dateToday = new Date();
		var dateEndDate = new Date(endDate);
		if(dateToday <= dateEndDate){
			var lastDate = ('0' + dateToday.getDate()).slice(-2);
			endDate = endDate.substr(0,8) + lastDate;
		}

		fieldTotalCount = STTC110M_getMonthDiff(startDate, endDate);

		var endMonYn = false;
		for(var i=0; i<=fieldTotalCount; i++){

			DateMapping["date" + i] =  STTC110M_addMonth(startDate, i).replaceAll('-','')
			if(STTC110M_addMonth(startDate, i) == endDate.substr(0, 7)){
				endMonYn = true;
			}
		}
		if(endMonYn == false){
			DateMapping["date" + i] = endDate.substr(0, 7).replaceAll('-','')
		}
	}

	return DateMapping;
}

/**
 * 리스트에 뿌려주기 위한 row 의 초기값을 세팅해주는 함수
 * @returns {{} | {date0: "0", date1: "0" ... , cnslGrpNm: "" , "totalCount" : "0"}
 */
function sttc110_clearTemplateMap(){
	var templateMap =  Object.assign({}, {"cnslGrpNm" : "" }, DateMapping);
	for (let key in templateMap) {

		if(key.includes("date")){
			templateMap[key] = "0";
		}else{
			templateMap[key] = "";
		}

	}
	templateMap.totalCount = "0";

	return templateMap
}

/**
 * json 형태로 건내받은 list를 그리드의 데이터 형태와 맞춰주는 함수.
 * sttc110_clearTemplateMap , sttc110_initDateMapping ,  sttc110_unPack 함수 사용 필수.
 * @param cnslList
 * @returns {[{cnslGrpNm : 'TEST' , date0 : '5', totalCount : '5'} , {cnslGrpNm : 'TEST2' , date0 : '1', totalCount : '1'} , {cnslGrpNm : '합계' , date0 : '6', totalCount : '6'} ]}
 */
function sttc110_openTree(cnslList){
	console.log("sttc110_openTree")
	// sttc110_initDateMapping 함수에 필요 => date0,date1 은 각각 날짜가 어떻게 되는제 매핑을 위한 map 데이터 생성.
	var searchType 			= $("#STTC110M_searchType").val();
	var startDate 			= $("#STTC110M_startDate").val();
	var endDate 			= $("#STTC110M_endDate").val();
	// 통계유형 구분을 위한 변수.
	var statType 			= $("#STTC110M_statType").val();

	tmpList =[]
	DateMapping = sttc110_initDateMapping(startDate,endDate,searchType)

	sttc110_unPack(cnslList)

	var sttcList = []

	var totalMap =  sttc110_clearTemplateMap();
	totalMap.cnslGrpNm = "합계"


	tmpList.forEach(function(row){

		var findIndex = sttcList.findIndex((item, index) => item["cnslGrpNm"]== row.cnslGrpNm); // sttcList안에 cnslTypeCd 값이 있나 확인

		if(findIndex >= 0){ // cnslTypeCd 값이 있다면 해당 row에 값 수정
			var findKey =  Object.keys(DateMapping).find(key => DateMapping[key] === row.sttcTm)	//특정 날짜에 값이 있다면 그날짜의 값을 가져와 테이터 추가 수정

			sttcList[findIndex][findKey] = (sttcList[findIndex][findKey] * 1 ) + (row.sttcVlu*1)
			sttcList[findIndex]['totalCount'] = (sttcList[findIndex]['totalCount']*1) + (row.sttcVlu*1)

			totalMap[findKey] = (totalMap[findKey]*1) + (row.sttcVlu*1)
			totalMap['totalCount'] = (totalMap['totalCount']*1) + (row.sttcVlu*1)
		}
		else{
			//cnslTypeCd값이 존재하지 않으면 sttcList에 row 추가
			var map = sttc110_clearTemplateMap();
			map.cnslGrpNm = row.cnslGrpNm;

			for (let key in map) {
				if(key.substr(0,4)  == 'date'){
					if( key == Object.keys(DateMapping).find(key => DateMapping[key] === row.sttcTm)){
						map[key] =  row.sttcVlu

						map['totalCount'] = map['totalCount']*1 + row.sttcVlu*1
						totalMap[key] = (totalMap[key]*1) + (row.sttcVlu*1)
						totalMap['totalCount'] = (totalMap['totalCount']*1) + (row.sttcVlu*1)
					}
				}
			}

			sttcList.push(map)

		}
	})
	sttcList.push(totalMap)		// 합계 row

	if(statType == '2'){	//평균 row
		var avgMap  =  sttc110_clearTemplateMap();
		avgMap.cnslGrpNm = "평균"
		//date0 , date1 ,date2 ...  세팅
		for (let key in avgMap) {
			if(key.substr(0,4)  == 'date'){
				avgMap[key] = totalMap[key] / (sttcList.length - 1) 	//평균 값 구하기 total값을 cnslTypeCd의 갯수만큼 나눔.
			}
		}
		avgMap.totalCount =  totalMap.totalCount / (sttcList.length - 1)

		sttcList.push(avgMap)
	}


	if(statType == '2' || statType == '4') {
		//여기에 포맷변경
		sttcList.forEach((sttc) => {
			for (let key in sttc) {
				if(key.substr(0,4)  == 'date' || key == 'totalCount'){
					var seconds = Utils.secToTime(Math.floor(sttc[key]))
					sttc[key] = seconds
				}
			}
		})
	}
	return sttcList;
}

/**
 * 계층형 json 데이터를 row단위로 사용하기 위한 함수
 * @param cnslList
 */
function sttc110_unPack(cnslList){
	//계층형태로 쌓여있는 데이터를 row형태로 풀기.
	cnslList.forEach(function(row){

		tmpList.push(row)
		
	});

}


function STTC110M_fnResultMyCounseling(data) {
    let cnslList =  sttc110_openTree( JSON.parse(data.STTC110M));
    const listLength = cnslList.length
    if (listLength === 0) {
        Utils.alert(STTC110M_langMap.get("fail.common.select"),
            ()=> {return STTC110M_grdSTTC110M.dataSource.data([]);});
        return;
    }
    for (const cnsl of cnslList) {
        cnsl.cntcCnntDtm =
            Utils.isNotNull(cnsl.cntcCnntDtm)
            ? cnsl.cntcCnntDtm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6')
            : "-";
        cnsl.decUsrNm = ''.concat(
            cnsl.decUsrNm, "(", cnsl.cnslrId, ")");
    }
    STTC110M_grdSTTC110M.dataSource.data(cnslList);
    STTC110M_grdSTTC110M.dataSource.options.schema.data = cnslList;
}

$(window).resize(function(){
	STTC110M_GridResize();
});

//Grid   Height  체크 
function STTC110M_GridResize() {   
	let screenHeight = $(window).height()-200;
	STTC110M_grdSTTC110M.element.find('.k-grid-content').css('height', screenHeight-225);
	  
};

//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
//테너트 ID 설정시, 조회 버튼 클릭시
function STTC110M_fnSearchList(){
	var searchType 			= $("#STTC110M_searchType").val();
	var startDate 			= $("#STTC110M_startDate").val();
	var endDate 			= $("#STTC110M_endDate").val();
	var searchCallType 		= $("#STTC110M_searchCallType").val();
	var statType 			= $("#STTC110M_statType").val();


	//현재 그리드에 있는 데이터 초기화
	STTC110M_grdSTTC110M.dataSource.data([]);

//kw--- 20230201 : 조회 버튼 클릭시 조회 유형에 따라 GRID 컬럼 변경
	// 컬럼을 담을 배열 변수 선언
	var columns = [];
	var scroll = [];
	var fieldTotalCount = 0;

	//이름 컬럼 추가
	columns.push({ width : 130, field : "cnslGrpNm", title : STTC110M_langMap.get("STTC110M.gridTitleCnslGroup"), attributes:{ style:"text-align:left"}, locked: true,});
	
	//text 정렬
	var textAlign = "text-align:right";
	if(statType != 1){ textAlign = "text-align:center"; }
	
	//searchType 별로 컬럼 값이 다름
	//searchType = 0 : 시간별 컬럼 0시~23시, serachType = 1 : 일자별로 시작일(2023-01-1)~마지막일(2022-02-01) 동적 생성
	//searchType = 2 : 월별로 시작일(2023-01)~마지막일(2022-02) 동적 생성
	if(searchType == "TZ" || searchType == ""){
		fieldTotalCount = 24;
		for(var i=0; i<fieldTotalCount; i++){
			columns.push({width : 100, field : "date" + i, title : i + STTC110M_langMap.get("STTC110M.gridTitleHour"), attributes:{ style:textAlign}});
		}
	} else if(searchType == "DY"){
		fieldTotalCount = STTC110M_getDateDiff(startDate, endDate);
		for(var i=0; i<=fieldTotalCount; i++){	//시작일과 마지막일 차이를 구하여 for문 실행
			
			//시작일과 마지막일 차이 만큼 for문을 돌면서 시작일에 i만큼 날짜를 더하여 컬럼 추가
			//ex) 2023-01-01 + 0, 2023-01-01 + 1, 2023-01-01 + 2 ...
			columns.push({width : 100, field : "date" + i, title : STTC110M_addDays(startDate, i).toISOString().split('T')[0], attributes:{ style:textAlign}});
		}
		
	} else if(searchType == "MN"){
		
		//시작날짜 YYYY-MM-01 ~ YYYY-MM-31 or 현재일로 변경하기
		//startDate
		startDate = startDate.substr(0,8) + "01";
		
		//endDate 이번달일 경우 현재 날짜 / 이번달이 아닌경우 그 달의 마지막 날짜 넣기
		//해당 월에 마지막 날짜 구하기
		var lastDate = new Date(endDate.substr(0,4), endDate.substr(5,2), 0);
		endDate = endDate.substr(0,8) + lastDate.getDate();
		
		var dateToday = new Date();
		var dateEndDate = new Date(endDate);
		
		//endDate를 오늘 날짜보다 크게 선택했을 경우
		if(dateToday <= dateEndDate){
			var lastDate = ('0' + dateToday.getDate()).slice(-2);
			endDate = endDate.substr(0,8) + lastDate;
		}
		
		fieldTotalCount = STTC110M_getMonthDiff(startDate, endDate);
		
		//kw---20230424 : endDate의 달 수가 안들어 갔을 경우를 체크 하기 위함
		//fieldTotalCount 에서 달수 계산이 안될 경우를 위한 예외처리....
		var endMonYn = false;
		
		for(var i=0; i<=fieldTotalCount; i++){ //시작월과 마지막월 차이를 구하여 for문 실행
			
			//시작월과 마지막월 차이 만큼 for문을 돌면서 시작월에 i만큼 날짜를 더하여 컬럼 추가
			//ex) 2023-01 + 0, 2023-01 +1 ...
			columns.push({width : 100, field : "date" + i, title : STTC110M_addMonth(startDate, i), attributes:{ style:textAlign}});
			
			//kw---20230424 : push한 데이터가 endDate의 달이 들어 갔는지 체크
			if(STTC110M_addMonth(startDate, i) == endDate.substr(0, 7)){
				endMonYn = true;
			}
		}
		
		//kw--- =20230424 : endDate의 달 수가 안들어 갔을 경우
		if(endMonYn == false){
			columns.push({width : 100, field : "date" + (fieldTotalCount + 1), title : endDate.substr(0, 7), attributes:{style:textAlign}});
		}
	}
	//합계 컬럼 추가
	columns.push({ width : 100, field : "totalCount", title : STTC110M_langMap.get("STTC110M.gridTitleTotal"), attributes:{ style:textAlign}});

	//위에서 정의한 컬럼을 그리드에 설정	
	var grid = $("#grdSTTC110M").data("kendoGrid");
	scroll.push({ virtual: "columns"});
	grid.setOptions({scrollable:scroll, columns:columns});

	//통계 데이터 조회
	Utils.ajaxCall(
		"/sttc/STTC110SEL01",
		JSON.stringify(STTC110M_getParamValue()),
		STTC110M_fnResultMyCounseling,
		window.kendo.ui.progress($("#grdSTTC110M"), true),
		window.kendo.ui.progress($("#grdSTTC110M"), false)
	) 
     //그리드를 초기화 하면 사이즈도 줄어들어서 다시한번 그리드 사이즈 조절을 해주기 위하여 함수를 넣었는데.. 다른 방법이 있을 때 까지 임시 방편
     STTC110M_GridResize();
}

//시작일과 마지막일 차이를 알기 위한 함수
function STTC110M_getDateDiff(d1, d2){
	const date1 = new Date(d1);
	const date2 = new Date(d2);
  
	const diffDate = date1.getTime() - date2.getTime();
  
	return Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
}

//시작월과 마지지막 월 차이를 알기 위한 함수
function STTC110M_getMonthDiff(d1, d2){

	var input1=d1.replace('-', '');
	var input2=d2.replace('-', '');

	var date1 = new Date(input1.substr(0,4),input1.substr(4,2)-1,input1.substr(6,2));
	var date2 = new Date(input2.substr(0,4),input2.substr(4,2)-1,input2.substr(6,2));

	var interval = date2 - date1;
	var day = 1000*60*60*24;
	var month = day*30;
	var year = month*12;
	
	return parseInt(interval/month);

//	console.log("기간 개월수: 약 " + parseInt(interval/month) + "월");
//	console.log("기간 개년수: 약 " + parseInt(interval/year) + "년");
}

//파리미터로 받은 날짜(date)에 일수(days)를 더하여 리턴 
function STTC110M_addDays(date, days) {
    // date는 문자열로 받는다 ex, '2020-10-15'
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

//파라미터로 받은 날짜(date)에 월수(month)를 더하여 리턴
function STTC110M_addMonth(date, month) {
    // date는 문자열로 받는다 ex, '2020-10-15'
	var result = new Date(date);
    result.setMonth(result.getMonth() + month);
    
    var resultMonth = result.toISOString().split('T')[0].substr(0, 7);

    return resultMonth;
}
//////////////////////////////////////////////////////////////////////////

function STTC110M_excelExport() {
	var today = new Date();

	var year = today.getFullYear();
	var month = ('0' + (today.getMonth() + 1)).slice(-2);
	var day = ('0' + today.getDate()).slice(-2);

	var dateString = year + month  + day;

    STTC_excelExport(STTC110M_grdSTTC110M, dateString + "_" + STTC110M_langMap.get("STTC110M.title"));
}

function STTC_excelExport(targetGrid, fileName) {
    const pageSize = targetGrid.dataSource.view().length;
    if (pageSize === 0) {
        Utils.alert(STTC110M_langMap.get("STTC110M.validMsg1"));
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
        this.columns.forEach(function (item, index) {
            if (Utils.isNotNull(item.template)) {
                let targetTemplate = kendo.template(item.template);
                let fieldName = item.field;
                for (let i = 1; i < sheet.rows.length; i++) {
                    let row = sheet.rows[i];
                    setDataItem = {
                        [fieldName]: row.cells[(index - selectableNum)].value
                    }
                    row.cells[(index - selectableNum)].value = targetTemplate(setDataItem);
                }
            }
        })
    });
    targetGrid.saveAsExcel();
//    targetGrid.dataSource.pageSize(pageSize);
}

function STTC110M_changeSerchType(){
	var tmp = $("#STTC110M_searchType").val();
	
	if(tmp == "TZ" || tmp == ""){
		$('#STTC110M_endDate').attr("disabled", true);
	}
	else{
		$('#STTC110M_endDate').attr("disabled", false);
	}
}