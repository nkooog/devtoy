var COMM140M_Y1StartYear		, COMM140M_Y1EndYear;
var COMM140M_Y3StartYear		, COMM140M_Y3EndYear;
var COMM140M_Y4FromYearMonth	, COMM140M_Y4ToYearMonth	, COMM140M_Y4FromToYearMonth;	//연도 구분 Y4 조건
var COMM140M_Y4StartYear1		, COMM140M_Y4EndYear1		, COMM140M_Y4StartYear2	, COMM140M_Y4EndYear2;
var COMM140M_Y6FromYmd			, COMM140M_Y6ToYmd			, COMM140M_Y6FromToYmd;

var txtYear 	= COMM140M_langMap.get("COMM140M.txt.year");
var txtMonth 	= COMM140M_langMap.get("COMM140M.txt.month");
var txtDay 		= COMM140M_langMap.get("COMM140M.txt.day");
var txtYMD 		= COMM140M_langMap.get("COMM140M.txt.ymd");

var COMM140M_srchCondPopActive1 = false;
var COMM140M_srchCondPopActive2 = false;

/////////////////////////////////////////////////////////////////////////// // 연도 구분 ////////////////////////////////////////////////////////////////////////////
$(document).ready(function(){
	//연도 구분 : 툴팁 팝업 표출
	$("#searchBussDtDv").on('change',function(e){
		
		var val = this.value;
		
		//알림 내용 초기화
		COMM140M_fnValidMsg('');
		
		if(val == ""){
			COMM140M_fnRmYearsConditions();
			
			COMM140M_fnCloseSearchConditionPop();
		} else {
			COMM140M_fnCloseSearchConditionPop();
			
			COMM140M_fnOpenSearchConditionPop(val);	
		}
	});
	
	//팝업 닫기
	$("#COMM140M_SearchConditionPopClose").on("click",function(e){
		COMM140M_fnCondPopClose();
	});
	
	$("#COMM140M_SearchConditionPop2Close").on("click",function(e){
		COMM140M_fnCondPopClose();
	});	
	
	//ESC키 감지
	$("#searchBussDtDv").on("keyup",function(e){
		if (e.keyCode == 27) {
			COMM140M_fnCondPopClose();
			$("#searchBussDtDv").data("kendoComboBox").value("");
			console.log("AWDAWDAWD");
		}
	});
	
	//ESC키 감지
	$("#searchLhldDv").on("keyup",function(e){
		if (e.keyCode == 27) {
			COMM140M_fnCondPopClose();
			$("#searchLhldDv").data("kendoComboBox").value("");
			console.log("AWDAWDAWD");
		}
	});
	
	//연도 구분 검색 조건 초기화 되었을 경우 연도 구분 초기화
	$("#yearsConditionsArea").on('click',function(){
		var combobox = $("#searchBussDtDv").data("kendoComboBox");
		var dsp = $("#COMM140M_SearchConditionPop").css("display");
		var html = $("#yearsConditionsArea").html();
		
		COMM140M_fnValidMsg('');
		
		if(dsp != "block" && html == ""){
			//combobox.value("").trigger("change");
			combobox.value("");
		}
	});
	
	//휴일구분 검색 조건 초기화 되었을 경우 	
	$("#daysConditionsArea").on('click',function(){
		var combobox = $("#searchLhldDv").data("kendoComboBox");
		var dsp 	 = $("#COMM140M_SearchConditionPop2").css("display");
		var html 	 = $("#daysConditionsArea").html();
		COMM140M_fnValidMsg('');
		if(dsp != "block" && html == ""){
			combobox.value("");
		}
	});
	
});//end document

//년도 조건 팝업 열기
function COMM140M_fnOpenSearchConditionPop(val){
	
	console.log(":::::: awdada");
	
	var dsp = $("#COMM140M_SearchConditionPop").css("display");
	var w = 410;
	var h = 180;
	var c = $("#COMM140M_"+val.toUpperCase()).html();
	
	switch (val) {
		case "Y1":
			w = 556; h = 122; c = COMM140M_fnMakeY1Content; break;
		case "Y2":
			w = 525; h = 124; c = COMM140M_fnMakeY2Content; break;
		case "Y3":
			w = 560; h = 560; c = COMM140M_fnMakeY3Content; break;
		case "Y4":
			w = 958; h = 486; c = COMM140M_fnMakeY4Content; break;
			//w = 1200; h = 458; break;
		case "Y5":
			w = 256; h = 302; c = COMM140M_fnMakeY5Content; break;
		case "Y6":
			w = 524; h = 300; c = COMM140M_fnMakeY6Content; break;
		default:
			w = 410; h = 180; break;
	}
	
	//팝업 생성 전에 기존 조건 제거
	COMM140M_fnRmYearsConditions();
	
	console.log(":::::::::::::::::: dsp");
	console.log(dsp);
	
	//툴팁 팝업 오픈
	if(dsp != "block"){
		//팝업
		$("#COMM140M_SearchConditionPop").css("width",w).css("height",h);
		$("#COMM140M_Tooltip_Content1").html(c);
		$("#COMM140M_SearchConditionPop").show();
		
		//연도 달력 오픈
		if(val == 'Y2'){
			COMM140M_YearCalendarOpen("#COMM140M_DatePicker_From","from");
			COMM140M_YearCalendarOpen("#COMM140M_DatePicker_To","to");			
		}		
		//달력 오픈
		if(val == 'Y5'){
			COMM140M_CalendarOpen("#COMM140M_Y5_Calendar",COMM140M_fnAddConditionY5);
		}
		//달력 오픈
		if(val == 'Y6'){
			COMM140M_CalendarOpen("#COMM140M_Y6_Calendar_From",COMM140M_fnAddConditionY6From);
			COMM140M_CalendarOpen("#COMM140M_Y6_Calendar_To",COMM140M_fnAddConditionY6To);
		}
		
	} else {
		$("#COMM140M_SearchConditionPop").css("width",w).css("height",h);
		$("#COMM140M_Tooltip_Content1").html(c);
	}
}

//년도 조건 팝업 닫기
function COMM140M_fnCloseSearchConditionPop(){
	var combobox = $("#searchBussDtDv").data("kendoComboBox");
	var dsp 	 = $("#COMM140M_SearchConditionPop").css("display");
	var html 	 = $("#daysConditionsArea").html();

	if(dsp == "block"){
		COMM140M_fnValidMsg('');
		$("#COMM140M_SearchConditionPop").css("display","none");
		/*if(html == ""){
			combobox.value("");
		}*/
	}
}

//연도구분 : 연도버튼 클릭 이벤트
function COMM140M_fnPrevNextY1(prevNext){
	var btns = "";
	
	if(prevNext == "prev"){
		//계산
		COMM140M_Y1EndYear   = COMM140M_Y1StartYear - 1;
		COMM140M_Y1StartYear = COMM140M_Y1EndYear - 4;
	}
	if(prevNext == "next"){
		//계산
		COMM140M_Y1StartYear = COMM140M_Y1EndYear + 1;
		COMM140M_Y1EndYear	 = COMM140M_Y1StartYear + 4;
	}
	
	for (var year = COMM140M_Y1StartYear; year <= COMM140M_Y1EndYear; year++) {
		btns += "<button class='btnRefer_second' value='"+year+"' onclick='COMM140M_fnAddConditionY1(this);'>"+year+txtYear+"</button>";
	}
	
	$("#contentY1Btns").html(btns);
}

//연도 구분 : 연월 이벤트
function COMM140M_fnPrevNextY3(prevNext){
	var btns = "";
	
	if(prevNext == "prev"){
		COMM140M_Y3EndYear 	 = COMM140M_Y3StartYear - 1;
		COMM140M_Y3StartYear = COMM140M_Y3EndYear - 2;
		
	}
	if(prevNext == "next"){
		COMM140M_Y3StartYear = COMM140M_Y3EndYear + 1;
		COMM140M_Y3EndYear   = COMM140M_Y3StartYear + 2;
	}
	
	for (var year = COMM140M_Y3StartYear; year <= COMM140M_Y3EndYear; year++) {
		btns += '	<article class="SearchWrap ma_top20 pad_bottom30">'
			+'		<ul>'
			+'			<li id="contentY3Btns">'
			+'				<h4 class="h4_tit ma_left10 ma_bottom20">'+year+'</h4>'
			+'				<menu class="formAlign">'
			+'				<ul>'
			+'					<li>'
			+'						<button class="btnRefer_second" value="1" onclick="COMM140M_fnAddConditionY3(this,\''+year+'01\')">1'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="1" onclick="COMM140M_fnAddConditionY3(this,\''+year+'02\')">2'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="1" onclick="COMM140M_fnAddConditionY3(this,\''+year+'03\')">3'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="1" onclick="COMM140M_fnAddConditionY3(this,\''+year+'04\')">4'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="1" onclick="COMM140M_fnAddConditionY3(this,\''+year+'05\')">5'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="1" onclick="COMM140M_fnAddConditionY3(this,\''+year+'06\')">6'+txtMonth+'</button>'
			+'					</li>'				
			+'					<li>'
			+'						<button class="btnRefer_second" value="1" onclick="COMM140M_fnAddConditionY3(this,\''+year+'07\')">7'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="1" onclick="COMM140M_fnAddConditionY3(this,\''+year+'08\')">8'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="1" onclick="COMM140M_fnAddConditionY3(this,\''+year+'09\')">9'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="1" onclick="COMM140M_fnAddConditionY3(this,\''+year+'10\')">10'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="1" onclick="COMM140M_fnAddConditionY3(this,\''+year+'11\')">11'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="1" onclick="COMM140M_fnAddConditionY3(this,\''+year+'12\')">12'+txtMonth+'</button>'
			+'					</li>'
			+'				</ul>'
			+'				</menu>'
			+'			</li>'
			+'		</ul>'
			+'	</article>'
	}
	//console.log(btns);
	$("#Y3Btns").html(btns);
}

//연도 구분 : 원월(구간) 이벤트
function COMM140M_fnPrevNextY4(prevNext){
	var s = '';
	var e = '';
	
	if(prevNext == "prev"){
		COMM140M_Y4StartYear1 	= COMM140M_Y4StartYear1 - 1;
		COMM140M_Y4StartYear2	= COMM140M_Y4StartYear2 - 1;
		COMM140M_Y4EndYear1		= COMM140M_Y4EndYear1 - 1;
		COMM140M_Y4EndYear2		= COMM140M_Y4EndYear2 - 1;
	}
	
	if(prevNext == "next"){
		COMM140M_Y4StartYear1 	= COMM140M_Y4StartYear1 + 1;
		COMM140M_Y4StartYear2	= COMM140M_Y4StartYear2 + 1;
		COMM140M_Y4EndYear1		= COMM140M_Y4EndYear1 + 1;
		COMM140M_Y4EndYear2		= COMM140M_Y4EndYear2 + 1;
	}
	
	//console.log("from : " , COMM140M_Y4StartYear1 + "," + COMM140M_Y4StartYear2);
	//console.log("to : " , COMM140M_Y4EndYear1 + "," + COMM140M_Y4EndYear2);
	
		s+= '			<h4 class="h4_tit ma_top20 ma_left5">FROM</h4>';
		for(var year1 = COMM140M_Y4StartYear1; year1 <= COMM140M_Y4StartYear2; year1 += 2){
			s+= '			<div class="Salescalendar_areabox ma_top20">';
			s+= '			<h4 class="h4_tit ma_top10 ma_left5">'+year1+txtYear+'</h4>';
			s+= '			<article class="SearchWrap3 ma_top20">';
			s+= '				<ul class="option4">';
			s+= '					<li style="width: 100%;">';
			s+= '					<menu class="formAlign">';
			s+= '						<button class="btnRefer_second" value="'+year1+'01"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'01\')">1'+txtMonth+'</button>';
			s+= '						<button class="btnRefer_second" value="'+year1+'02"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'02\')">2'+txtMonth+'</button>';
			s+= '						<button class="btnRefer_second" value="'+year1+'03"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'03\')">3'+txtMonth+'</button>';
			s+= '						<button class="btnRefer_second" value="'+year1+'04"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'04\')">4'+txtMonth+'</button>';
			s+= '					</menu>';
			s+= '					</li>';
			s+= '					<li style="width: 100%;">';
			s+= '					<menu class="formAlign">';
			s+= '						<button class="btnRefer_second" value="'+year1+'05"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'05\')">5'+txtMonth+'</button>';
			s+= '						<button class="btnRefer_second" value="'+year1+'06"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'06\')">6'+txtMonth+'</button>';
			s+= '						<button class="btnRefer_second" value="'+year1+'07"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'07\')">7'+txtMonth+'</button>';
			s+= '						<button class="btnRefer_second" value="'+year1+'08"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'08\')">8'+txtMonth+'</button>';
			s+= '					</menu>';
			s+= '					</li>';
			s+= '					<li style="width: 100%;">';
			s+= '					<menu class="formAlign">';						
			s+= '						<button class="btnRefer_second" value="'+year1+'09"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'09\')">9'+txtMonth+'</button>';
			s+= '						<button class="btnRefer_second" value="'+year1+'10"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'10\')">10'+txtMonth+'</button>';
			s+= '						<button class="btnRefer_second" value="'+year1+'11"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'11\')">11'+txtMonth+'</button>';
			s+= '						<button class="btnRefer_second" value="'+year1+'12"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'12\')">12'+txtMonth+'</button>';		
			s+= '					</menu>';
			s+= '				</li>';
			s+= '				</ul>';
			s+= '			</article>';
			s+= '			</div>';
		}// end for
	

		e+= '			<h4 class="h4_tit ma_top20 ma_left5">TO</h4>';
		for(var year2 = COMM140M_Y4EndYear1; year2 <= COMM140M_Y4EndYear2; year2 += 2){
			e+= '			<div class="Salescalendar_areabox ma_top20">';
			e+= '			<h4 class="h4_tit ma_top10 ma_left5">'+year2+txtYear+'</h4>';
			e+= '			<article class="SearchWrap3 ma_top20">';
			e+= '				<ul class="option4">';
			e+= '					<li style="width: 100%;">';
			e+= '					<menu class="formAlign">';
			e+= '						<button class="btnRefer_second" value="'+year2+'01"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'01\')">1'+txtMonth+'</button>';
			e+= '						<button class="btnRefer_second" value="'+year2+'02"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'02\')">2'+txtMonth+'</button>';
			e+= '						<button class="btnRefer_second" value="'+year2+'03"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'03\')">3'+txtMonth+'</button>';
			e+= '						<button class="btnRefer_second" value="'+year2+'04"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'04\')">4'+txtMonth+'</button>';
			e+= '					</menu>';
			e+= '					</li>';
			e+= '					<li style="width: 100%;">';
			e+= '					<menu class="formAlign">';
			e+= '						<button class="btnRefer_second" value="'+year2+'05"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'05\')">5'+txtMonth+'</button>';
			e+= '						<button class="btnRefer_second" value="'+year2+'06"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'06\')">6'+txtMonth+'</button>';
			e+= '						<button class="btnRefer_second" value="'+year2+'07"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'07\')">7'+txtMonth+'</button>';
			e+= '						<button class="btnRefer_second" value="'+year2+'08"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'08\')">8'+txtMonth+'</button>';
			e+= '					</menu>';
			e+= '					</li>';
			e+= '					<li style="width: 100%;">';
			e+= '					<menu class="formAlign">';						
			e+= '						<button class="btnRefer_second" value="'+year2+'09"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'09\')">9'+txtMonth+'</button>';
			e+= '						<button class="btnRefer_second" value="'+year2+'10"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'10\')">10'+txtMonth+'</button>';
			e+= '						<button class="btnRefer_second" value="'+year2+'11"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'11\')">11'+txtMonth+'</button>';
			e+= '						<button class="btnRefer_second" value="'+year2+'12"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'12\')">12'+txtMonth+'</button>';		
			e+= '					</menu>';
			e+= '					</li>';
			e+= '				</ul>';
			e+= '			</article>';
			e+= '			</div>';
		}
	
	$("#contentY4Start").html(s);
	$("#contentY4End").html(e);
}

//연도 구분 Y1 : 기본 버튼 생성
var COMM140M_fnMakeY1Content = function(){
	var nowYear = new Date().getFullYear();
	var btns 	= "";
	
	COMM140M_Y1EndYear 		= nowYear + 2;
	COMM140M_Y1StartYear 	= nowYear - 2;
	
	for (var year = COMM140M_Y1StartYear; year <= COMM140M_Y1EndYear; year++) {
		btns += "<button class='btnRefer_second' value='"+year+"' onclick='COMM140M_fnAddConditionY1(this);'>"+year+txtYear+"</button>";
	}
	var c = ""
		+"<article class='SearchWrap ma_top20'>"
		+"	<div class='btnRefer_second prevArrow' id='prevY1' value='"+COMM140M_Y1StartYear+"' onclick='COMM140M_fnPrevNextY1(\"prev\");'>&#10096;</div>"
		+"	<div class='contentY1'>"
		+"		<ul>"
		+"			<li>"
		+"				<menu class='formAlign2 ma_left5' id='contentY1Btns'>"+btns+"</menu>"
		+"			</li>"
		+"		</ul>"
		+"	</div>"
		+"	<div class='btnRefer_second nextArrow' id='nextY1' value='"+COMM140M_Y1EndYear+"'onclick='COMM140M_fnPrevNextY1(\"next\");'>&#10097;</div>"
		+"</article>"
		;
	return c;
}

var COMM140M_fnMakeY2Content = function(){
	var c = '<article class="SearchWrap ma_top20">'
		+'	<li style="width: 45%;">'
		+'		<span class="label_tit">FROM</span>'
		+'		<input id="COMM140M_DatePicker_From" style="width:50%;"/>'
		+'	</li>'
		+'	<li style="width: 5%;"><p>~</p></li>'
		+'	<li style="width: 45%;">'
		+'		<span class="label_tit">TO</span>'
		+'		<input id="COMM140M_DatePicker_To" style="width:50%;"/>'
		+'	</li>'
		+'	<li>'
		+'		<button type="button" class="btnRefer_primary" onclick="COMM140M_fnAddConditionY2();">설정</button>'
		+'	</li>'
		+'</article>'
		;
	return c;
}

var COMM140M_fnMakeY3Content = function(){	
	var nowYear = new Date().getFullYear();
	var btns 	= "";
	COMM140M_Y3StartYear 	= nowYear - 1;
	COMM140M_Y3EndYear 		= nowYear + 1;
	//console.log(COMM140M_Y3StartYear + " // " + COMM140M_Y3EndYear);
	for (var year = COMM140M_Y3StartYear; year <= COMM140M_Y3EndYear; year++) {
		btns += '	<article class="SearchWrap ma_top20 pad_bottom30">'
			+'		<ul>'
			+'			<li id="contentY3Btns">'
			+'				<h4 class="h4_tit ma_left10 ma_bottom20">'+year+'</h4>'
			+'				<menu class="formAlign">'
			+'				<ul>'
			+'					<li>'
			+'						<button class="btnRefer_second" value="1" onclick="COMM140M_fnAddConditionY3(this,\''+year+'01\')">1'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="2" onclick="COMM140M_fnAddConditionY3(this,\''+year+'02\')">2'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="3" onclick="COMM140M_fnAddConditionY3(this,\''+year+'03\')">3'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="4" onclick="COMM140M_fnAddConditionY3(this,\''+year+'04\')">4'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="5" onclick="COMM140M_fnAddConditionY3(this,\''+year+'05\')">5'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="6" onclick="COMM140M_fnAddConditionY3(this,\''+year+'06\')">6'+txtMonth+'</button>'
			+'					</li>'				
			+'					<li>'
			+'						<button class="btnRefer_second" value="7" onclick="COMM140M_fnAddConditionY3(this,\''+year+'07\')">7'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="8" onclick="COMM140M_fnAddConditionY3(this,\''+year+'08\')">8'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="9" onclick="COMM140M_fnAddConditionY3(this,\''+year+'09\')">9'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="10" onclick="COMM140M_fnAddConditionY3(this,\''+year+'10\')">10'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="11" onclick="COMM140M_fnAddConditionY3(this,\''+year+'11\')">11'+txtMonth+'</button>'
			+'						<button class="btnRefer_second" value="12" onclick="COMM140M_fnAddConditionY3(this,\''+year+'12\')">12'+txtMonth+'</button>'
			+'					</li>'
			+'				</ul>'
			+'				</menu>'
			+'			</li>'
			+'		</ul>'
			+'	</article>'
	}
	
	var c = ''
		+'<div id="COMM140M_Y3">'
		+'	<ul>'
		+'		<li class="prevLi">'
		+'			<span id="prevY3" class="btnRefer_second prevY3" value="'+COMM140M_Y3StartYear+'" onclick="COMM140M_fnPrevNextY3(\'prev\');"><p>&#10096;</p></span>'
		+'		</li>'
		+'	</ul><span id="Y3Btns">'
		+ btns
		+'	</span><ul>'
		+'		<li class="nextLi">'
		+'			<span id="nextY3" class="btnRefer_second nextY3" value="'+COMM140M_Y3EndYear+'" onclick="COMM140M_fnPrevNextY3(\'next\');"><p>&#10096;</p></span>'
		+'		</li>'
		+'	</ul>'
		+'</div>';
	return c;		
}

var COMM140M_fnMakeY4Content = function(){
	var nowYear = new Date().getFullYear();
	var c = "";

	COMM140M_Y4StartYear1 	= nowYear - 1;
	COMM140M_Y4StartYear2	= nowYear + 1;
	COMM140M_Y4EndYear1		= nowYear;
	COMM140M_Y4EndYear2		= nowYear + 2;
	
	c+= '<div class="Salescalendar_tooltip ma_left20">';
	c+= '	<div class="prevY4 ma_right20">';
	c+= '		<span class="btnRefer_second" onclick="COMM140M_fnPrevNextY4(\'prev\');">&#10096;</span>';
	c+= '	</div>';
	c+= '	<div class="Salescalendar_tooltipfl">';
	c+= '		<div class="Salescalendar_area ma_right20" id="contentY4Start">';		
	c+= '			<h4 class="h4_tit ma_top20 ma_left5">FROM</h4>';
	//start for
for(var year1 = COMM140M_Y4StartYear1; year1 <= COMM140M_Y4StartYear2; year1 += 2){
	c+= '			<div class="Salescalendar_areabox ma_top20">';
	c+= '			<h4 class="h4_tit ma_top10 ma_left5">'+year1+txtYear+'</h4>';
	c+= '			<article class="SearchWrap3 ma_top20">';
	c+= '				<ul class="option4">';
	c+= '					<li style="width: 100%;">';
	c+= '					<menu class="formAlign">';
	c+= '						<button class="btnRefer_second" value="'+year1+'01"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'01\')">1'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year1+'02"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'02\')">2'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year1+'03"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'03\')">3'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year1+'04"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'04\')">4'+txtMonth+'</button>';
	c+= '					</menu>';
	c+= '					</li>';
	c+= '					<li style="width: 100%;">';
	c+= '					<menu class="formAlign">';
	c+= '						<button class="btnRefer_second" value="'+year1+'05"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'05\')">5'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year1+'06"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'06\')">6'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year1+'07"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'07\')">7'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year1+'08"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'08\')">8'+txtMonth+'</button>';
	c+= '					</menu>';
	c+= '					</li>';
	c+= '					<li style="width: 100%;">';
	c+= '					<menu class="formAlign">';						
	c+= '						<button class="btnRefer_second" value="'+year1+'09"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'09\')">9'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year1+'10"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'10\')">10'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year1+'11"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'11\')">11'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year1+'12"  onclick="COMM140M_fnAddConditionY4(this,\'f\',\''+year1+'12\')">12'+txtMonth+'</button>';		
	c+= '					</menu>';
	c+= '				</li>';
	c+= '				</ul>';
	c+= '			</article>';
	c+= '			</div>';
}	
	//end for		
	c+= '		</div>';
	c+= '	</div>';
//start to
	c+= '	<div class="Salescalendar_tooltipfr">';
	c+= '		<div class="Salescalendar_area ma_right20" id="contentY4End">';		
	c+= '			<h4 class="h4_tit ma_top20 ma_left5">TO</h4>';
	//start for
for(var year2 = COMM140M_Y4EndYear1; year2 <= COMM140M_Y4EndYear2; year2 += 2){
	c+= '			<div class="Salescalendar_areabox ma_top20">';
	c+= '			<h4 class="h4_tit ma_top10 ma_left5">'+year2+txtYear+'</h4>';
	c+= '			<article class="SearchWrap3 ma_top20">';
	c+= '				<ul class="option4">';
	c+= '					<li style="width: 100%;">';
	c+= '					<menu class="formAlign">';
	c+= '						<button class="btnRefer_second" value="'+year2+'01"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'01\')">1'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year2+'02"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'02\')">2'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year2+'03"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'03\')">3'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year2+'04"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'04\')">4'+txtMonth+'</button>';
	c+= '					</menu>';
	c+= '					</li>';
	c+= '					<li style="width: 100%;">';
	c+= '					<menu class="formAlign">';
	c+= '						<button class="btnRefer_second" value="'+year2+'05"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'05\')">5'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year2+'06"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'06\')">6'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year2+'07"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'07\')">7'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year2+'08"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'08\')">8'+txtMonth+'</button>';
	c+= '					</menu>';
	c+= '					</li>';
	c+= '					<li style="width: 100%;">';
	c+= '					<menu class="formAlign">';						
	c+= '						<button class="btnRefer_second" value="'+year2+'09"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'09\')">9'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year2+'10"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'10\')">10'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year2+'11"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'11\')">11'+txtMonth+'</button>';
	c+= '						<button class="btnRefer_second" value="'+year2+'12"  onclick="COMM140M_fnAddConditionY4(this,\'t\',\''+year2+'12\')">12'+txtMonth+'</button>';		
	c+= '					</menu>';
	c+= '					</li>';
	c+= '				</ul>';
	c+= '			</article>';
	c+= '			</div>';
}	
	//end for		
	c+= '		</div>';
	c+= '	</div>';
	c+= '	<div class="nextY4">';
	c+= '		<span class="btnRefer_second" onclick="COMM140M_fnPrevNextY4(\'next\');">&#10097;</span>';
	c+= '	</div>';
	c+= '</div>';

	return c;
}

var COMM140M_fnMakeY5Content = function(){
	var c = '<div class="k-calendar-container ma_top20 COMM140M_Y5">'
			+'	<div id="COMM140M_Y5_Calendar" style="display:block"></div>'
			+'</div>';
	return c;
}

var COMM140M_fnMakeY6Content = function(){
	var c = '<div class="calendar_tooltip ma_top20">'
			+'	<div class="calendar_tooltipfl ma_right20">'
			+'		<div class="k-calendar-container">'
			+'			<div id="COMM140M_Y6_Calendar_From" style="display:block"></div>'
			+'   	</div>'
			+'	</div>'
			+'	<div class="calendar_tooltipfr">'
			+'		<div class="k-calendar-container">'
			+'			<div id="COMM140M_Y6_Calendar_To" style="display:block"></div>'
			+'		</div>'
			+'	</div>'
			+'</div>';
	return c;
}

//연도 구분 : 연도 조건 추가
function COMM140M_fnAddConditionY1(obj){
	var yearsConditions 	= $("#yearsConditions").val();
	var year 	= $(obj).val();
	
	if(yearsConditions.indexOf(year) != -1){
		COMM140M_fnValidMsg(COMM140M_langMap.get("COMM140M.validMsg2"));
		return;
	}
	
	var btn = '<li><p>'+year+txtYear+'</p><button type="button" data-value="'+year+'" class="k-chip-icon k-icon k-i-x" title="delete" onclick="COMM140M_fnRmConditionY1(this,'+year+');"></button></li>';	

	$("#yearsConditions").val((yearsConditions!="")?yearsConditions+","+year:year);
	$("#yearsConditionsArea").append(btn);
}

//연도 구분 : 연도 조건 제거
function COMM140M_fnRmConditionY1(obj,strYear){
	var yearsConditions = $("#yearsConditions").val();
	var strYearsArr		= yearsConditions.split(",");
	for (var i = 0; i < strYearsArr.length; i++) {
		if(strYearsArr[i] == strYear){
			//console.log("index : " + i + " // " + strYearsArr[i]);
			yearsConditions = (i==0) ? yearsConditions.replace(strYear,"") : yearsConditions.replace("," + strYear, "");
		}
	}
	$("#yearsConditions").val(yearsConditions);
	$(obj).closest("li").remove();
}

//연도 구분 : 연도(구간) 조건 추가
function COMM140M_fnAddConditionY2(gb){
	var yearsConditions = $("#yearsConditions").val();
	var yearFrom 		= $("#COMM140M_DatePicker_From").val();
	var yearTo 			= $("#COMM140M_DatePicker_To").val();
	
	if(Number(yearFrom) == Number(yearTo)){
		COMM140M_fnValidMsg(COMM140M_langMap.get("COMM140M.validMsg3"));
		return;
	}
	if(Number(yearFrom) > Number(yearTo)){
		COMM140M_fnValidMsg(COMM140M_langMap.get("COMM140M.validMsg4"));
		return;
	}
	
	//조건 초기화
	COMM140M_fnRmYearsConditions();
	
	var btn = '<li><p>'+yearFrom+txtYear+' ~ '+yearTo+txtYear+'</p><button type="button" data-value="'+yearFrom+','+ yearTo + '" class="k-chip-icon k-icon k-i-x" title="delete" onclick="COMM140M_fnRmYearsConditions();"></button></li>';	

	$("#yearsConditions").val(yearFrom + "," + yearTo);
	$("#yearsConditionsArea").append(btn);
	
	//창닫기
	COMM140M_fnCloseSearchConditionPop();
}

//연도 구분 : 연월 조건 추가
function COMM140M_fnAddConditionY3(obj,strYearMonth){
	var yearsConditions 	= $("#yearsConditions").val();
	var yearMonthDsp		= COMM140M_fnFormatYearMonth(strYearMonth);
	
	if(yearsConditions.indexOf(strYearMonth) != -1){
		COMM140M_fnValidMsg(COMM140M_langMap.get("COMM140M.validMsg2"));
		return;
	}
	
	var btn = '<li><p>'+yearMonthDsp+'</p><button type="button" data-value="'+strYearMonth+'" class="k-chip-icon k-icon k-i-x" title="delete" onclick="COMM140M_fnRmConditionY3(this,'+strYearMonth+');"></button></li>';	

	$("#yearsConditions").val((yearsConditions!="")?yearsConditions+","+strYearMonth:strYearMonth);
	$("#yearsConditionsArea").append(btn);
}

//연도 구분 : 연월 조건 제거
function COMM140M_fnRmConditionY3(obj,strYearMonth){
	var yearsConditions = $("#yearsConditions").val();
	var yearMonthArr		= yearsConditions.split(",");
	for (var i = 0; i < yearMonthArr.length; i++) {
		if(yearMonthArr[i] == strYearMonth){
			//console.log("index : " + i + " // " + yearMonthArr[i]);
			yearsConditions = (i==0) ? yearsConditions.replace(strYearMonth,"") : yearsConditions.replace("," + strYearMonth, "");
		}
	}
	$("#yearsConditions").val(yearsConditions);
	$(obj).closest("li").remove();
}

//연도 구분 : 연월(구간) 추가
function COMM140M_fnAddConditionY4(obj,strType,strYearMonth){
	var yearsConditions 	= $("#yearsConditions").val();
	var yearsConditionsArea = $("#yearsConditionsArea").html();
	
	if(yearsConditions.indexOf(strYearMonth) != -1){
		COMM140M_fnValidMsg(COMM140M_langMap.get("COMM140M.validMsg2"));
		return;
	}
	
	if("f" == strType){
		COMM140M_Y4FromYearMonth = strYearMonth;
	}
	if("t" == strType){
		COMM140M_Y4ToYearMonth = strYearMonth;
	}
	
	if(COMM140M_Y4FromYearMonth != "" && COMM140M_Y4ToYearMonth != ""){
		COMM140M_Y4FromToYearMonth = strYearMonth+","+COMM140M_Y4ToYearMonth;
		if(Number(COMM140M_Y4FromYearMonth) > Number(COMM140M_Y4ToYearMonth)){
			COMM140M_fnValidMsg(COMM140M_langMap.get("COMM140M.validMsg5"));
			return;
		}
		
		var btn = '<li><p>'+COMM140M_fnFormatYearMonth(COMM140M_Y4FromYearMonth)+" ~ "+COMM140M_fnFormatYearMonth(COMM140M_Y4ToYearMonth)+'</p><button type="button" id="btn_yearMonth" data-value="'+COMM140M_Y4FromToYearMonth+'" class="k-chip-icon k-icon k-i-x" title="delte" onclick="COMM140M_fnRmYearsConditions();"></button></li>';
		$("#yearsConditionsArea").html('');
		$("#yearsConditionsArea").append(btn);
		$("#yearsConditions").val(COMM140M_Y4FromYearMonth + "," + COMM140M_Y4ToYearMonth);
	} else if(COMM140M_Y4FromYearMonth != ""){
		var btn = '<li><p>'+COMM140M_fnFormatYearMonth(COMM140M_Y4FromYearMonth)+'</p><button type="button" id="btn_'+strType+'" data-value="'+COMM140M_Y4FromYearMonth+'" class="k-chip-icon k-icon k-i-x" title="delete" onclick="COMM140M_fnRmConditionY4(this,\'f\','+COMM140M_Y4FromYearMonth+');"></button></li>';
		$("#btn_"+strType).parent('li').remove();
		$("#yearsConditionsArea").append(btn);
		$("#yearsConditions").val(COMM140M_Y4FromYearMonth);
	} else if(COMM140M_Y4ToYearMonth != ""){
		var btn = '<li><p>'+COMM140M_fnFormatYearMonth(COMM140M_Y4ToYearMonth)+'</p><button type="button" id="btn_'+strType+'" data-value="'+COMM140M_Y4ToYearMonth+'" class="k-chip-icon k-icon k-i-x" title="delete" onclick="COMM140M_fnRmConditionY4(this,\'f\','+COMM140M_Y4ToYearMonth+');"></button></li>';
		$("#btn_"+strType).parent('li').remove();
		$("#yearsConditionsArea").append(btn);
		$("#yearsConditions").val(COMM140M_Y4ToYearMonth);
	}
}

//연도 구분 연월 구간 제거
function COMM140M_fnRmConditionY4(obj,strType,strYearMonth){
	var yearsConditions = $("#yearsConditions").val();
	var yearMonthArr		= yearsConditions.split(",");
	for (var i = 0; i < yearMonthArr.length; i++) {
		if(yearMonthArr[i] == strYearMonth){
			//console.log("index : " + i + " // " + yearMonthArr[i]);
			yearsConditions = (i==0) ? yearsConditions.replace(strYearMonth,"") : yearsConditions.replace("," + strYearMonth, "");
		}
	}
	if("f" == strType){
		COMM140M_Y4FromYearMonth = "";
	}
	if("t" == strType){
		COMM140M_Y4ToYearMonth = "";
	}
	$("#yearsConditions").val(yearsConditions);
	$(obj).closest("li").remove();
}

//연도 구분 : 연월일 추가
function COMM140M_fnAddConditionY5(){
	var strDate = kendo.toString(this.value(), 'yyyy년 MM월 dd일');
	var strVal  = kendo.toString(this.value(), 'yyyyMMdd');
	
	var btn = '<li><p>'+strDate+'</p><button type="button" data-value="'+strVal+'" class="k-chip-icon k-icon k-i-x" title="delete" onclick="COMM140M_fnRmYearsConditions();"></button></li>';
	
	$("#yearsConditions").val(strVal);
	$("#yearsConditionsArea").children().remove();
	$("#yearsConditionsArea").append(btn);
}

//연도 구분 : 연월일(구간) 추가
function COMM140M_fnAddConditionY6From(){
	COMM140M_fnAddConditionY6('f',this.value());
}

//연도 구분 : 연월일(구간) 추가
function COMM140M_fnAddConditionY6To(){
	COMM140M_fnAddConditionY6('t',this.value());
}

//연도 구분 : 연월일(구간) 추가 조건 생성
function COMM140M_fnAddConditionY6(strType, strDateValue){
	var strDate = kendo.toString(strDateValue, 'yyyy년 MM월 dd일');
	var strVal  = kendo.toString(strDateValue, 'yyyyMMdd');

	if("f" == strType){
		COMM140M_Y6FromYmd = strVal;
	}
	if("t" == strType){
		COMM140M_Y6ToYmd = strVal;
	}
	
	if(COMM140M_Y6FromYmd != "" && COMM140M_Y6ToYmd != ""){
		COMM140M_Y6FromToYmd = COMM140M_Y6FromYmd+","+COMM140M_Y6ToYmd;
		if(Number(COMM140M_Y6FromYmd) > Number(COMM140M_Y6ToYmd)){
			COMM140M_fnValidMsg(COMM140M_langMap.get("COMM140M.validMsg5"));
			return;
		}
		var btn = '<li><p>'+COMM140M_fnFormatYearMonthDay(COMM140M_Y6FromYmd)+" ~ "+COMM140M_fnFormatYearMonthDay(COMM140M_Y6ToYmd)+'</p><button type="button" id="btn_yearMonth" data-value="'+COMM140M_Y6FromToYmd+'" class="k-chip-icon k-icon k-i-x" title="delete" onclick="COMM140M_fnRmYearsConditions();"></button></li>';
		$("#yearsConditionsArea").html('');
		$("#yearsConditionsArea").append(btn);
		$("#yearsConditions").val(COMM140M_Y6FromYmd + "," + COMM140M_Y6ToYmd);
	} else if(COMM140M_Y6FromYmd != ""){
		var btn = '<li><p>'+COMM140M_fnFormatYearMonthDay(COMM140M_Y6FromYmd)+'</p><button type="button" id="btn_'+strType+'" data-value="'+COMM140M_Y6FromYmd+'" class="k-chip-icon k-icon k-i-x" title="delete" onclick="COMM140M_fnRmConditionY6(this,\'f\','+COMM140M_Y6FromYmd+');"></button></li>';
		$("#btn_"+strType).parent('li').remove();
		$("#yearsConditionsArea").append(btn);
		$("#yearsConditions").val(COMM140M_Y6FromYmd);
	} else if(COMM140M_Y6ToYmd != ""){
		//console.log("COMM140M_Y6ToYmd : " , COMM140M_Y6ToYmd);
		var btn = '<li><p>'+COMM140M_fnFormatYearMonthDay(COMM140M_Y6ToYmd)+'</p><button type="button" id="btn_'+strType+'" data-value="'+COMM140M_Y6ToYmd+'" class="k-chip-icon k-icon k-i-x" title="delete" onclick="COMM140M_fnRmConditionY6(this,\'f\','+COMM140M_Y6ToYmd+');"></button></li>';
		$("#btn_"+strType).parent('li').remove();
		$("#yearsConditionsArea").append(btn);
		$("#yearsConditions").val(COMM140M_Y6ToYmd);
	}
}

//연도 구분 : 연월일(구간) 제거
function COMM140M_fnRmConditionY6(obj,strType,strYearMonth){
	var yearsConditions = $("#yearsConditions").val();
	var yearMonthArr		= yearsConditions.split(",");
	for (var i = 0; i < yearMonthArr.length; i++) {
		if(yearMonthArr[i] == strYearMonth){
			//console.log("index : " + i + " // " + yearMonthArr[i]);
			yearsConditions = (i==0) ? yearsConditions.replace(strYearMonth,"") : yearsConditions.replace("," + strYearMonth, "");
		}
	}
	if("f" == strType){
		COMM140M_Y6FromYmd = "";
	}
	if("t" == strType){
		COMM140M_Y6ToYmd = "";
	}
	$("#yearsConditions").val(yearsConditions);
	$(obj).closest("li").remove();
}

//연도(구간) 달력 오픈
function COMM140M_YearCalendarOpen(target,type){
	var date = ("to" == type) ? new Date(new Date().getFullYear()+1, new Date().getMonth(), 1) : new Date();
	$(target).kendoDatePicker({
		//value: new Date(),
		value: date,
		culture: "ko-KR",  
		footer: false,
		start: "decade", 
		depth: "decade", 
		format: "yyyy",
		change: function() {
			//var frmYear = kendo.format("{0:yyyy}", this.value());
		}
	});
}

//연도 구분 달력 오픈
function COMM140M_CalendarOpen(target,callBack){
	$(target).kendoCalendar({
		format: "yyyy-MM-dd",
		change: callBack,
		close: function(e){
			e.preventDefault(); //prevent popup closing
		}
	});
}

//연도 구분 : 조건 초기화
function COMM140M_fnRmYearsConditions(){
	$("#yearsConditions").val('');
	$("#yearsConditionsArea").html('');
	
	COMM140M_fnValidMsg('');
	
	/*조건 초기화*/
	COMM140M_Y4FromYearMonth = "", COMM140M_Y4ToYearMonth = ""	, COMM140M_Y4FromToYearMonth = "";
	COMM140M_Y6FromYmd =""		, COMM140M_Y6ToYmd =""			, COMM140M_Y6FromToYmd ="";
}


/////////////////////////////////////////////////////////////////////////////  휴일구분 ////////////////////////////////////////////////////////////////////////////

//휴일구분 onchange
function COMM140M_fnChangeSearchLhldDv(obj){
	
	console.log(":::::::::::::::::::::::::: aaaa");
	
	var comCd 	= obj.value;
	var btns 	= "";
	
	//휴일구분이 : 전체 또는 영업일일경우 팝업 없음. 
	if(comCd == "" || comCd == "1"){
		//조건 초기화
		COMM140M_fnRemoveSearchLhldDvConditions();
		//팝업 닫기
		COMM140M_fnCloseSearchConditionPop2();
		
		return;
	}	
	//비우기
	COMM140M_fnRemoveSearchLhldDvConditions();
	
	//관리코드 추출
	subMgntItemCd = Utils.getComCdSubMgntitem(COMM140M_CommCodeList, "C0211", comCd);
	
	for(var i=0;i<COMM140M_CommCodeList.length;i++){
		
		var mgntItemCd 	= COMM140M_CommCodeList[i].mgntItemCd;
		var comCd		= COMM140M_CommCodeList[i].comCd;
		var comCdNm		= COMM140M_CommCodeList[i].comCdNm;
		
		if(mgntItemCd == subMgntItemCd){
			btns += '<button type="button" data-val="'+comCd+'" data-nm="'+comCdNm+'" class="btnRefer_second" title="delete" onclick="COMM140M_fnAddSearchLhldDv(this);">'+comCdNm+'</button>';
		}
	}
	
	if(btns != ""){
		COMM140M_fnOpenSearchConditionPop2(btns);
	}
}

//휴일구분 팝업
function COMM140M_fnOpenSearchConditionPop2(btns){
	var target 	= document.getElementById('daysArea'); // 요소의 id 값이 target이라 가정
	var position = target.getBoundingClientRect(); // DomRect 구하기 (각종 좌표값이 들어있는 객체)
	
	var w = 470;
	var h = 276;
	//var h = 200;
	var l = Number(position.left) - 40;
	var c = btns;
	
	$("#COMM140M_SearchConditionPop2").css("left",l).css("width",w).css("height",h);
	$("#COMM140M_Tooltip_Content2").html(c);
	$("#COMM140M_SearchConditionPop2").show();
}

//휴일구분 팝업 닫기
function COMM140M_fnCloseSearchConditionPop2(){
	var dsp = $("#COMM140M_SearchConditionPop2").css("display");
	
	if(dsp == "block"){
		$("#COMM140M_SearchConditionPop2").css("display","none");
		
		COMM140M_fnValidMsg('');
	}
}

//휴일구분 조건 추가
function COMM140M_fnAddSearchLhldDv(obj){
	var comCd 			= $(obj).attr("data-val");
	var comCdNm			= $(obj).attr("data-nm");
	var daysConditions 	= $("#daysConditions").val();
	//console.log("comCd : " , comCd + " // " + comCdNm);
	
	if(daysConditions.indexOf(comCd) != -1){
		COMM140M_fnValidMsg(COMM140M_langMap.get("COMM140M.validMsg2"));
		return;
	}
	
	daysConditions += (daysConditions == "") ? comCd : "," + comCd;
	var btn = '<li><p>'+comCdNm+'</p><button type="button" data-value="'+comCd+'" class="k-chip-icon k-icon k-i-x" title="delete" onclick="COMM140M_fnRemoveSearchLhldDv(this,'+comCd+');"></button></li>';
	
	$("#daysConditions").val(daysConditions);
	$("#daysConditionsArea").append(btn);
}

//휴일구분 제거
function COMM140M_fnRemoveSearchLhldDv(obj,comCd){
	var daysConditions = $("#daysConditions").val();
	var yearMonthArr		= daysConditions.split(",");
	for (var i = 0; i < yearMonthArr.length; i++) {
		if(yearMonthArr[i] == comCd){
			//console.log("index : " + i + " // " + yearMonthArr[i]);
			daysConditions = (i==0) ? daysConditions.replace(comCd,"") : daysConditions.replace("," + comCd, "");
		}
	}
	$("#daysConditions").val(daysConditions);
	$(obj).closest("li").remove();
}

//휴일구분 비우기 : 초기화
function COMM140M_fnRemoveSearchLhldDvConditions(){
	$("#daysConditions").val('');
	$("#daysConditionsArea").html('');
}

//kw---20240329 : 상담이력저장 - 상담유형 레이어 팝업이 활성화 됐을 때 다른 영역을 클릭하면 닫히도록 수정
$(document).off("click.COMM140_searchLayPop");	//kw---20240329 : 상담이력저장 - F5키를 이용하여 새로고침 하면 밑에 click 이벤트가 중복으로 생성되는걸 방지
$(document).on("click.COMM140_searchLayPop", function(event) {
	
	var targetElement = $(event.target); // 클릭된 요소 가져오기
	
	var searchConditionPop1 = $("#COMM140M_SearchConditionPop");
	var searchConditionPop2 = $("#COMM140M_SearchConditionPop2");
	
	if (!targetElement.is(searchConditionPop1) && !searchConditionPop1.has(targetElement).length) {

		if($("#COMM140M_SearchConditionPop").css("display") != "none"){
			if(COMM140M_srchCondPopActive1 == true){
				COMM140M_fnCondPopClose();
			} else{
				COMM140M_srchCondPopActive1 = true;
			}
		}
	} 
		
		console.log(":::::: targetElement searchConditionPop1");
	
	if (!targetElement.is(searchConditionPop2) && !searchConditionPop2.has(targetElement).length) {
		
		if($("#COMM140M_SearchConditionPop2").css("display") != "none"){
			if(COMM140M_srchCondPopActive2 == true){
				COMM140M_fnCondPopClose();
			} else{
				COMM140M_srchCondPopActive2 = true;
			}
		}

		console.log(":::::: targetElement searchConditionPop2");
	}	
});

function COMM140M_fnCondPopClose(){
	$("#COMM140M_SearchConditionPop").css("display", "none");
	$("#COMM140M_SearchConditionPop2").css("display", "none");
	
	COMM140M_srchCondPopActive1 = false;
	COMM140M_srchCondPopActive2 = false;
	
	COMM140M_fnValidMsg('');
}