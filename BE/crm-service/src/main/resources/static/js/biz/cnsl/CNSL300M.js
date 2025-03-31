var prev_custId = '';
var custId = '';
var custNm = '';
var custTelNum = '';
var cntcHistNo = '';
var cnslHistSeq = '';
var outCntcPathCd = '60';
var cabackAcpnNo = '';
var cnslRangeDay = 30;
var cnslEnable = true;
var cnslState = 'init';
var cnslFirstConnected = false;
var KMST340P_RsvData = null;
var url112 = '';
var id112 = '';
var customNumber = '';

//kw---20240920 : 시연용 - 전화시뮬레이션 추가
var softPhoenMode = '';

//kw---20240510 : 아웃바운드, 인바운드시 환자조회 팝업창에(v2) 그리드 항목을 추가
var modalGridPatGridEmr = false;

//kw---20240509 : softPhone TEST를 위한 기능 - true : DMO / DMO_A99 / 9099 로 접근
var softPhoneTest = '';

//kw---20240426 : 벨울림 상태에서 상태값을 변경 할 수 없도록 기능 추가
var callBackState = '';

//kw---20240409 : 아웃바운드 시 고객목록 팝업 추가
var outBoundType = '';

//kw---20240409 : 수화기로 전화를 받았을 경우 자동 pickup 상태가 되도록 기능 수정
var pickupPhone = false;		//수화기로 픽업 했을 경우 : true

//kw---20240404 : 양지검진 - 상담이력 또는 콜 이벤트 관련 정보 인터페이스 넘기기
//kw---20240404 : 접수번호, 예약메모
var custAcpnNo = '';
var rsvMemo = '';

//kw---20240405 : 콜 연결시간(통화성공)
var cntcCallCnnTime = '';

//kw---20240403 : 양지검진- 소프트폰 이벤트 이후 또 다른 이벤트를 발생해야 할 경우(true : 이벤트 발생 / false : 이벤트 발생하지 않음) 
//kw---20240403 : ex) 전화받기 이후 인터페이스 메세지를 전송해야 할 경우	
var	softPhoneAfterEvent = false;

//kw---20240306 : 무통화상담 추가
var noCallCustTelNum = '';
var noCallUseYn = false;

//kw---20240223 : 전화받기 팝업창 글로벌 옵션 필터 적용
var softCallPopGridBool = false;

//kw---20240213 : 전화받기 팝업창 옆에 고객정보 표출
var tabFrmId;
var tabFrmCnslId;
var tabFrmCnslCallId;	//kw---20240415 : 통화이력탭 frmID 구하기

var cnslCustSelItem;

//kw---20240213 : 전화받기 팝업창 옆에 고객정보 표출
var modalGridPatInfo = new Array(2);
for (let i = 0; i < modalGridPatInfo.length; i++) {
	modalGridPatInfo[i] = {
        instance: new Object(),
        dataSource: new Object(),
        currentItem: new Object(),
        currentCellIndex: new Number(),
        selectedItems: new Array(),
        record: 0
    }
}

//kw---20240313 : 환자를 어디서 찾았는지 구분하기 위함 - find:환자찾기, list:상담이력
var custSelMode = '';

//kw---20240213 : 전화받기 팝업창 옆에 고객정보 표출
function getFrmId() {
	
	$(".tabCNSL300M").find("li").find("span").each(function() {
    	let tabCNSL300M_url  = String($(this).attr("data-content-url"));

		if (tabCNSL300M_url.indexOf('112T') !== -1 ) {
			tabFrmId = tabCNSL300M_url.substring(tabCNSL300M_url.length - 8, tabCNSL300M_url.length - 4);
		}

		if (tabCNSL300M_url.indexOf('110T') !== -1) {
    		tabFrmCnslId = "110T"
    	} else if (tabCNSL300M_url.indexOf('160T') !== -1) {
    		tabFrmCnslId = "160T"
    	}

		//kw---20240415 : 통화이력탭 frmID 구하기
    	if (tabCNSL300M_url.indexOf('CNSL101T') !== -1) {
    		tabFrmCnslCallId = "101T";
    	} else if (tabCNSL300M_url.indexOf('CNSL201T') !== -1) {
    		tabFrmCnslCallId = "201T";
    	}
	});
	
	if ( tabFrmId == '' ) {
		tabFrmId = "CNSL";
	}
}

$(document).ready(function () {
	
	//kw---20240522 : 소프트폰 DMO로 접속하기
	if(GLOBAL.session.user.menuAtht == '900'){
		$('#txtAgentState2').css("cursor","pointer");
		$('#txtAgentState2').on('click', function(){
			softPhoneTest = true;
			Utils.alert("CTI 로그인 정보를 DMO로 변경합니다.");
	    });
	}
	
	//kw---20240223 : 전화받기 팝업창 글로벌 옵션 필터 적용 시작
	if(!Utils.isNull(Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 38)) && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 38).bsVl1 == "Y"){
		softCallPopGridBool = true;
		$("#modalAlertPat").css("display", "");
		
		var elements = document.querySelectorAll('.k-button.k-button-md.k-rounded-md.k-button-flat-base.k-icon-button.k-window-action.k-button-flat');
		
		// 모든 요소를 반복하여 작업을 수행할 수 있습니다.
		elements.forEach(function(element) {
		    // 여기에 요소에 대한 작업을 수행할 수 있습니다.
		    element.style.right = '565px';

		}); 	
	}
	//kw---20240223 : 전화받기 팝업창 글로벌 옵션 필터 적용 끝
	
	//kw---20240409 : 아웃바운드 시 고객목록 팝업 추가
	if(!Utils.isNull(Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 40)) && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 40).bsVl1 == "Y"){
		outBoundType = 'beforPop';
	}

	CNSL300M_createPatInfoGrid();	//kw---20240213 : 전화받기 팝업창 옆에 고객정보 표출
	CNSL300M_createPatInfoGrid_outBound();
	setTimeout(getFrmId, 1000);

	$('.btExtend').on('click',function(){       
		$(this).toggleClass('Contract');
		$('.divisonCnsl').toggleClass('Extend');
	});
	// 상담원 정보 초기세팅
	$("#UsrInfo").html(GLOBAL.session.user.decUsrNm + '(' + GLOBAL.session.user.usrGrd + ')');
	$("#OrgNm").html(GLOBAL.session.user.orgNm);
	$("#extNo").html(GLOBAL.session.user.extNo);
    var CNSL300M_TabNum = $("#modalGridPatInfoNum").val();
    var CNSL300M_TabKey = $("#modalGridPatInfoKey").val();
    CNSL300M_fnGetPoto();
    CNSL300_tabLoad();
    heightResizeCNSL();
	$(window).on({ 
		'resize': function() {
			heightResizeCNSL();  
		},   
	});

	if( Utils.isNotNull(CNSL300M_TabNum) && Utils.isNotNull(CNSL300M_TabKey) ){
		setTimeout(function() {
			CNSL300MTabSel(CNSL300M_TabNum, CNSL300M_TabKey);
		}, 500);
    }
	
	$(".softphoneForm button").click(function() {
		$("#ctiResponseMessage").text('');
	});
	
	$(document).on("click", "#transferList tr", function() {
		$('#transferList tr').each(function () {
			 $(this).css('background', 'white');
		 })
		 if(this.style.background == "" || this.style.background =="white") {
			 $(this).css('background', '#f3fbff');
		 }
	});
	
	// 드래그할 요소를 선택합니다.
    const draggableElement = document.getElementById("transferList");

    let offsetX, offsetY, isDragging = false;

    // 드래그 시작 이벤트 처리
    draggableElement.addEventListener("mousedown", (e) => {
        isDragging = true;
        // 드래그 시작 시 요소의 시작 위치를 기억합니다.
        offsetX = e.clientX - draggableElement.getBoundingClientRect().left;
        offsetY = e.clientY - draggableElement.getBoundingClientRect().top;
    });

    // 드래그 중 이벤트 처리
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        // 드래그 중일 때 요소를 현재 마우스 위치로 이동시킵니다.
        draggableElement.style.left = e.clientX - offsetX + "px";
        draggableElement.style.top = e.clientY - offsetY + "px";
    });

    // 드래그 종료 이벤트 처리
    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
	
});


function get112() {
	$(".tabCNSL300M").find("li").find("span").each(function() {
    	let tabCNSL300M_url  = String($(this).attr("data-content-url"));
		if (tabCNSL300M_url.indexOf('112T') !== -1 ) {
			url112 = tabCNSL300M_url;
			id112 = tabCNSL300M_url.substring(tabCNSL300M_url.length - 8, tabCNSL300M_url.length - 1);
		}
	})
	if ( url112 == '' ) {
		setTimeout(get112, 300);
	}
}

function heightResizeCNSL() {        
	var screenHeight = $(window).height()-210,  // 헤더 + 푸터 = 210px
		csInfoHeight = $('.conContainer_side .csInfoSide').height()+180;
	$('.divisonCnsl').css('height', screenHeight);   // Height 체크~!
	// 좌측 컨텐츠 listview Height 체크~!
	$('.callHistoryBoard ,  .callHistoryBoard .k-listview-content').css('height', screenHeight-220);
	$('.callHistoryBoard2 ,  .callHistoryBoard2 .k-listview-content').css('height', screenHeight-220);
	// 가운데 컨텐츠 Grid Height 체크~!
	$(".tabCNSL300M").find('#grdCNSL210T .k-grid-content').css('height', screenHeight-250);
	// mhlee 7/31 사이즈 조정
	//kw---20240507 : 현재 화면에서 탭 페이지가 다르게 설정되어 있을 경우 그리드 사이즈가 이상해짐
//	$('.cnslSubGrid').find('.k-grid-content').css('height', screenHeight-672+55);
//	$('.cnslSubGrid2').find('.k-grid-content').css('height', screenHeight-704+55);
// 	$('.cnslSubGrid3').find('.k-grid-content').css('height', screenHeight-588);
//	$('.cnslSubGrid4').find('.k-grid-content').css('height', screenHeight-644+55);
	// 가운데 토글버튼 화면사이즈 변환시 사라지는 현상 임시 수정 ---- (S)
	$(".btVerticalExtend").removeClass('Contracts');
	$(".csBasicInfo").css('height', '290px');
	$(".btVerticalExtend").css('top', '310px');
	// 가운데 토글버튼 화면사이즈 변환시 사라지는 현상 임시 수정 ---- (E)
	//추후에 주석 해제 ( TA 기능개발후 )
//	$('.CNSL213 #cnslCtt').css('height', screenHeight-700);
//	$('.CNSL213 #cnslCtt').css('height', scre/enHeight-600);
	$('.CNSL213 #cnslCtt').css('height', screenHeight-565);
	// 우측 컨텐츠 Height 체크~!
	// $('#tabCNSL300M_3 .templateCardDiv').css('height', screenHeight-130);
	// $('#tabCNSL300M_3 .templateCardDiv').css('overflow-y', 'auto');

	modalGridPatInfo[0].instance.element.find('.k-grid-content').css('height', 355);
	
	//kw---20240409 : 아웃바운드 시 고객목록 팝업 추가
	modalGridPatInfo[1].instance.element.find('.k-grid-content').css('height', 320);
}; 

function counselAllInit() {
	nowCallId = '';
	cntcHistNo = '';
	cnslHistSeq = '';
	prev_custId = '';
	custId = '';
	custNm = '';
	customNumber = '';
	if ( typeof(custInitCNSL212) != 'undefined' ) {
		custInitCNSL212();
	}
	counselInit();
}

// 메인화면 좌측하단 탭 전환및 조회 함수
function CNSL300MTabSel(tabIndex, key)  {
	switch (tabIndex) {
	    case "1":
	    	CNSL300MTabClick("/bcs/cnsl/CNSL201T");
	    	if ( typeof(setCNSL201SEL01) == 'undefined' ) {
	    		setTimeout(function() {
	    			CNSL300MTabSel(tabIndex, key)
	    		}, 500);
	    	}else {
	    		setCNSL201SEL01(key);
	    	}
	        break;
	    case "2":
	    	CNSL300MTabClick("/bcs/cnsl/CNSL202T");
	    	if ( typeof(setCNSL202SEL01) == 'undefined' ) {
	    		setTimeout(function() {
	    			CNSL300MTabSel(tabIndex, key)
	    		}, 500);
	    	}else {
	    		setCNSL202SEL01(key);
	    	}
	        break;
	    case "3":
	    	CNSL300MTabClick("/bcs/cnsl/CNSL203T");
	    	if ( typeof(setCNSL203SEL01) == 'undefined' ) {
	    		setTimeout(function() {
	    			CNSL300MTabSel(tabIndex, key)
	    		}, 500);
	    	}else {
	    		setCNSL203SEL01(key);
	    	}
	        break;
	    case "4":
	    	CNSL300MTabClick("/bcs/cnsl/CNSL204T");
	    	if ( typeof(setCNSL204SEL01) == 'undefined' ) {
	    		setTimeout(function() {
	    			CNSL300MTabSel(tabIndex, key)
	    		}, 500);
	    	}else {
	    		setCNSL204SEL01(key);
	    	}
	        break;
	}
}

function CNSL300MTabClick(tabId){
	$(".tabCNSL300M").find("li").find("span").each(function() {
		if ($(this).attr("data-content-url") == tabId || $(this).attr("data-content-url") == tabId + '.jsp') {
			$(this).parent().click();
		}
	})
}

// 사진조회
function CNSL300M_fnGetPoto(){
	if(GLOBAL.session.user.potoImgIdxFileNm != ""){
		$(".img_bx > img").attr({ src: "/bcs/photo/" +  GLOBAL.session.user.tenantId + "/" + GLOBAL.session.user.potoImgIdxFileNm});
		var img = document.querySelector('.img_bx > img');
		
		var url_ststus = fnUrlExists(img.src);
		if(url_ststus == 404 || url_ststus == '404'){
			$(".img_bx > img").attr({ src: "../images/contents/person.png" });
		}else{
			$(".img_bx > img").attr({ src: "/bcs/photo/" +  GLOBAL.session.user.tenantId + "/" + GLOBAL.session.user.potoImgIdxFileNm});
		}		
	}else{
		$(".img_bx > img").attr({ src: "../images/contents/person.png" });
	}
}

// 사진 URL 검증
function fnUrlExists(imgURL){
	const http = new XMLHttpRequest();
	http.open('HEAD', imgURL, false);           
	http.send(); 
	return http.status;
}

function dateTimeMMCNSL300(str) {
	if ( typeof str == 'undefined') {
		return ''
	}else {
		if (str.length != 12) {
			return str;
		}
		else {
			return str.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5');
		}
	}
}

function dateTimeSSCNSL300(str) {
	if ( typeof str == 'undefined') {
		return ''
	}else {
		if (str.length != 14) {
			return str;
		}
		else {
			return str.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6');
		}
	}
}

function msgCNSL300(str) {
	if ( typeof str == 'undefined' || str == null ) {
		return ''
	}else {
		if (str.length < 26 ) {
			return str
		}else {
			return str.substring(0,25) + "..."
		}
	}
}

function CNSL300_tabLoad() {
	let SYSM301M_templateCardPath = GLOBAL.contextPath + "/tmpl/TEMPLATE_CARD";
    $("#tabCNSL300M_1").load(SYSM301M_templateCardPath, {
        TEMPLATE_CARD_tenantId: GLOBAL.session.user.tenantId,
        TEMPLATE_CARD_dataFrmId: "CNSL300M",
        TEMPLATE_CARD_patFrmeCd: "F1"
    });
	$("#tabCNSL300M_2").load(SYSM301M_templateCardPath, {
        TEMPLATE_CARD_tenantId: GLOBAL.session.user.tenantId,
        TEMPLATE_CARD_dataFrmId: "CNSL300M",
        TEMPLATE_CARD_patFrmeCd: "F2"
    });
	let SYSM301M_templateCardPath2 = GLOBAL.contextPath + "/tmpl/TEMPLATE_CARD2";
    $("#tabCNSL300M_3").load(SYSM301M_templateCardPath2, {
        TEMPLATE_CARD_tenantId: GLOBAL.session.user.tenantId,
        TEMPLATE_CARD_dataFrmId: "CNSL300M",
        TEMPLATE_CARD_patFrmeCd: "F3"
    });
    get112();
}

function btVerticalExtend(obj) {
	var screenHeight = $(window).height();  // 헤더 + 푸터 = 210px
	if ($(obj).hasClass("Contracts")){
		$(obj).removeClass('Contracts');
		$(".csBasicInfo").css('height', '290px');
		$(obj).css('top', '310px');
	}else {
		$(obj).addClass('Contracts');
		$(".csBasicInfo").css('height', screenHeight-403+55);
		$(obj).css('top', screenHeight-346);
	}
}

function txtTargetNumberSet(Obj) {
	$("#txtTargetNumber").val($("#"+$(Obj).attr("target")).val());
}

//kw---20240213 : 전화받기 팝업창 옆에 고객정보 표출
//kw---20240213 : 그리드 생성
function CNSL300M_createPatInfoGrid(){
	modalGridPatInfo[0].dataSource = new kendo.data.DataSource({
        schema: {
        	 type: "json",
        	 model: {
                 fields: {     
                	 ptNm     	: { field: "ptNm", 	type: "string"},
                	 resdNo      : { field: "resdNo", 		type: "string"},
                	 pid       	: { field: "pid",		type: "string"},
                 }
        	 }
        }
	});
	
	let arrGridPatInfo = [];
	
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		
		//kw---20240520 : 환자찾기 팝업창 타이틀 변경
		$("#modalAlertPat_titleOut").text("환자정보");
		$("#modalAlertPat_titleIn").text("환자정보");
		
		arrGridPatInfo = [
			{
                width: 35,
                field: "radio",
                title: "선택",
                template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',
                editable: false
            },
			{ 
				width: 70, 
				field : "pid",
				title: "환자번호",   
			},
        	{ 
				width: 80, 
				field : "ptNm",
				title: "환자명",   
        	},
        	{ 
        		width: 40, 
        		field : "sex",
        		title: "성별",   
        	},
        	{ 
				width: 90, 
				field : "resdNo",
				title: "생년월일",   
        	},
		];
	} else {
	
		//kw---20240520 : 환자찾기 팝업창 타이틀 변경	
		$("#modalAlertPat_titleOut").text("고객정보");
		$("#modalAlertPat_titleIn").text("고객정보");
		
		arrGridPatInfo = [
			{
                width: 35,
                field: "radio",
                title: "선택",
                template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',
                editable: false
            },
			{ 
				width: 70, 
				field : "cpnyNm",
				title: "업체명",   
			},
			{ 
				width: 80, 
				field : "pid",
				title: "고객번호",   
			},
			{ 
				width: 80, 
				field : "ptNm",
				title: "고객명",   
			},
			{ 
				width: 40, 
				field : "sex",
				title: "성별",   
			},
			{ 
				width: 90, 
				field : "resdNo",
				title: "생년월일",   
			},
		];
	}
	
	//kw---20240510 : 아웃바운드, 인바운드시 환자조회 팝업창에(v2) 그리드 항목을 추가
	if(modalGridPatGridEmr == true){
		let emrArr = {
				width: 80, 
				field : "apiType",
				title: "EMR",   
		}
		arrGridPatInfo.push(emrArr);
	}
	
	modalGridPatInfo[0].instance = $("#modalGridPatInfo").kendoGrid({
		dataSource: modalGridPatInfo[0].dataSource,
		noRecords: { template: '<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>' },
		autoBind: false,
		height:355,
		columns: arrGridPatInfo,
		selectable: true,
		change: function (e) {
            let row = e.sender.select();
            modalGridPatInfo[0].selectedItems = modalGridPatInfo[0].instance.dataItem(row);
        }
	}).data('kendoGrid');
	
	modalGridPatInfo[0].dataSource.data([]);
}

$("#modalGridPatInfo").on('dblclick','tbody tr[data-uid]',function (e) {
	
	if(cnslState == 'Connected'){
		CNSL300M_confirm(e);
	}

	//kw---20240920 : 시연용 - 전화시뮬레이션 추가 시작
	if(window['softPhoenMode']){
		if(softPhoenMode == 'factory-pick'){
			CNSL300M_confirm(e);
		}
	}
	//kw---20240920 : 시연용 - 전화시뮬레이션 추가 끝
	
	
});

function CNSL300M_confirm(e){
	var selectedRow = $(e.target).closest("tr");

    // 선택된 행의 데이터를 얻습니다.
    var dataItem = modalGridPatInfo[0].instance.dataItem(selectedRow);
    
    if ( window['set' + tabFrmId + 'CustInfo'] ) {
    	new Function ( 'set' + tabFrmId + 'CustInfo(' + JSON.stringify(dataItem) +')')();
	}
    
    CNSL126P_fnModalClose();
    
    //kw---20240508 : 환자선택시 EMR에 정보 띄우기
	var emrOpenYn = false;
	if(!Utils.isNull(Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 41)) && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 41).bsVl1 == "Y"){
		emrOpenYn = true;
	}
	if(emrOpenYn){
		if ( window['emrOpenIB' + tabFrmId] ) {
			window['emrOpenIB' + tabFrmId](dataItem);
		}
	}

}

function setCNSLCustInfo(dataItem){
	custId = dataItem.pid;
	custNm = dataItem.ptNm;
	 
	if(Utils.isNull(tabFrmCnslId) || tabFrmCnslId == "110T"){
		CNSL100MTabClick("/bcs/cnsl/CNSL112T")
		if ( typeof(settingCNSL112SEL01) != 'undefined' ) {
			settingCNSL112SEL01();
		}
	} else {
		CNSL100MTabClick("/bcs/cnsl/CNSL162T")
		if ( typeof(settingCNSL162SEL01) != 'undefined' ) {
			settingCNSL162SEL01();
		}
	}
}

//kw---20240223 : 고객정보 그리드에 확인 버튼 클릭시
function CNSL100M_gridPatConfirm(){
	 // 선택된 행의 데이터를 얻습니다.
    var dataItem = modalGridPatInfo[0].selectedItems;
    
    if ( window['set' + tabFrmId + 'CustInfo'] ) {
    	new Function ( 'set' + tabFrmId + 'CustInfo(' + JSON.stringify(dataItem) +')')();
	}
    
    CNSL126P_fnModalClose();
} 

//kw---20240223 : 고객정보 그리드에 close 버튼 클릭시
function CNSL100M_gridPatClose(){
	CNSL126P_fnModalClose();
}

//kw---20240409 : 아웃바운드 시 고객목록 팝업 추가
function srchCNSLCustInfo_outBound(telNo){
	
	let funcType;
	let frmId;
	
	if(Utils.isNull(tabFrmCnslId) || tabFrmCnslId == "110T"){
		
		if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
			funcType = "H";
		} else {
			funcType = "C";
			frmId = "CNSL110";
		}
		
		
		
	} else if(tabFrmCnslId == "160T"){
		
		funcType = "C";
		frmId = "CNSL160";
	}
	
	kendo.ui.progress($("#modalGridPatInfo_outBound"), true);
	
	if(funcType == "H"){
		var CNSL110T_data = {
			tenantId    : GLOBAL.session.user.tenantId,
			srchType 	: '3',
			srchTxt 	: telNo,
			encryptYn      : Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1
		};
		var CNSL110T_jsonStr = JSON.stringify(CNSL110T_data);
		
		let arrReturn = [];
		
		Utils.ajaxCall('/cnsl/CNSL110SEL01', CNSL110T_jsonStr, function(data) {
			var patApptInfo = JSON.parse(data.CNSL110SEL01);

			$.each(patApptInfo, function(index, item){
				let ptNm, resdNo, pid;
				
				let obj = {
						ptNm 	: item.custNm,
						resdNo 	: item.btdt,
						pid 	: item.custId,
				}
				arrReturn.push(obj);
			});		
			
			//kw---20240409 : 검색된 상담사가 0명 일 경우 (미등록 환자 선택)
			if(modalGridPatInfo[1].dataSource.data().length == 0){
				custTelNum = '';
				CNSL126P_fnModalClose_outBound();
			}
			//kw---20240409 : 1명일 경우 첫번째 데이터 셋팅
			else if(modalGridPatInfo[1].dataSource.data().length == 1){
				custTelNum = '';
				cnslCustSelItem = modalGridPatInfo[1].dataSource.data()[0];
				CNSL126P_fnModalClose_outBound();
			}
			//kw---20240304 : 2명 이상일 경우
			else{
				modalGridPatInfo[1].dataSource.data(arrReturn);
				popSource_outBound.center().open().wrapper.addClass('DialModal');
			}
			
			kendo.ui.progress($("#modalGridPatInfo_outBound"), false);
		});
	} else {
		funcType = "C";
		
		kendo.ui.progress($("#modalGridPatInfo"), true);
		
		var arrComboData = $("." + frmId + " " + "#srchType").data("kendoComboBox").dataSource.data();
		var srchType;
		$.each(arrComboData, function(index, item){
			if(item.value.indexOf('T0009') !== -1){
				srchType = item.value;
	        }  
		});
		
		var CNSL160T_data = { 
				tenantId 	   : GLOBAL.session.user.tenantId,
				usrId		   : GLOBAL.session.user.usrId,
				srchType 	   : srchType.split("_")[0],
				voColId		   : srchType.split("_")[1],
				srchTxt 	   : telNo,
				encryptYn      : srchType.split("_")[2],
				type		   : 'SEL'
	       };
		
		var CNSL160T_jsonStr = JSON.stringify(CNSL160T_data);
		
		Utils.ajaxCall('/cnsl/CNSL160SEL03', CNSL160T_jsonStr, function(data){
			var CNSL160T_jsonEncode = JSON.stringify(data.CNSL160SEL03);
			var CNSL160T_jsonDecode = JSON.parse(JSON.parse(CNSL160T_jsonEncode));

			let grdCNSL160T_rows = [];
			if ( CNSL160T_jsonDecode.length > 0 ) {
				let jsonColumn = {}
				let CNSL160T_rowId = '';
				for ( var i = 0; i < CNSL160T_jsonDecode.length; i++ ) {
					if ( CNSL160T_rowId != CNSL160T_jsonDecode[i].custId ) {
						CNSL160T_rowId = CNSL160T_jsonDecode[i].custId;
						if ( i != 0 ) {
							grdCNSL160T_rows.push(jsonColumn)
							jsonColumn = {};
						}
						jsonColumn["custId"] = CNSL160T_jsonDecode[i].custId;
					} else {
						jsonColumn[CNSL160T_jsonDecode[i].mgntItemCd] = CNSL160T_jsonDecode[i].custItemDataVlu;
					}
					
					if ( i == CNSL160T_jsonDecode.length-1 ) {
						grdCNSL160T_rows.push(jsonColumn)
					} 
				}
			} 
			
			let arrReturn = [];
			
			$.each(grdCNSL160T_rows, function(index, item){
				let ptNm = "";
				let resdNo = "";
				let pid = "";
				let cpnyNm = "";
				
				if(!Utils.isNull(item.T9001)){	cpnyNm 	= item.T9001 	};
				if(!Utils.isNull(item.T0002)){	ptNm 	= item.T0002 	};
				if(!Utils.isNull(item.T0011)){	resdNo 	= item.T0011 	};
				if(!Utils.isNull(item.custId)){	pid 	= item.custId 	};
				
				
				
				let obj = {
						cpnyNm 	: cpnyNm,
						ptNm 	: ptNm,
						resdNo 	: resdNo,
						pid 	: pid,
				}
				arrReturn.push(obj);
			});
			
			//kw---20240409 : 검색된 상담사가 0명 일 경우 (미등록 환자 선택)
			if(arrReturn.length == 0){
				unknownCustomerSel();
				
				var dataItem = {
						pid 	: custId,
						ptNm 	: custNm,
					};
						
				cnslCustSelItem = dataItem;
				
				if ( window['set' + tabFrmId + 'CustInfo'] ) {
					 new Function ( 'set' + tabFrmId + 'CustInfo(' + JSON.stringify(cnslCustSelItem) +')')();
				}
				
				custId = GLOBAL.session.user.tenantId + "_1";
				
				custTelNum = '';
				
				CNSL126P_fnModalClose_outBound();
			}
			//kw---20240409 : 1명일 경우 첫번째 데이터 셋팅
			else if(arrReturn.length == 1){
				cnslCustSelItem = arrReturn[0];
				
				if ( window['set' + tabFrmId + 'CustInfo'] ) {
					 new Function ( 'set' + tabFrmId + 'CustInfo(' + JSON.stringify(cnslCustSelItem) +')')();
				}
				
				custTelNum = '';
				
				CNSL126P_fnModalClose_outBound();
			}
			//kw---20240304 : 2명 이상일 경우
			else{
				modalGridPatInfo[1].dataSource.data(arrReturn);
				popSource_outBound.center().open().wrapper.addClass('DialModal');
			}
			
			kendo.ui.progress($("#modalGridPatInfo_outBound"), false);
			
		});
	}
}

//kw---20240409 : 아웃바운드 시 고객목록 팝업 추가
function CNSL300M_createPatInfoGrid_outBound(){

	modalGridPatInfo[1].dataSource = new kendo.data.DataSource({
	    schema: {
	    	 type: "json",
	    	 model: {
	             fields: {     
	            	 ptNm     	: { field: "ptNm", 	type: "string"},
	            	 resdNo      : { field: "resdNo", 		type: "string"},
	            	 pid       	: { field: "pid",		type: "string"},
	             }
	    	 }
	    }
	});
	
	let arrGridPatInfo = [];
	
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		arrGridPatInfo = [
			{
                width: 35,
                field: "radio",
                title: "선택",
                template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',
                editable: false
            },
			{ 
				width: 70, 
				field : "pid",
				title: "환자번호",   
			},
        	{ 
				width: 80, 
				field : "ptNm",
				title: "환자명",   
        	},
        	{ 
        		width: 40, 
        		field : "sex",
        		title: "성별",   
        	},
        	{ 
				width: 90, 
				field : "resdNo",
				title: "생년월일",   
        	},
		];
	} else {
		arrGridPatInfo = [
			{
                width: 35,
                field: "radio",
                title: "선택",
                template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>',
                editable: false
            },
			{ 
				width: 80, 
				field : "cpnyNm",
				title: "업체명",   
			},
			{ 
				width: 70, 
				field : "pid",
				title: "고객번호",   
			},
			{ 
				width: 80, 
				field : "ptNm",
				title: "고객명",   
			},
			{ 
				width: 40, 
				field : "sex",
				title: "성별",   
			},
			{ 
				width: 90, 
				field : "resdNo",
				title: "생년월일",   
			},
		];
	}
	
	//kw---20240409 : 아웃바운드 시 고객목록 팝업 추가
	modalGridPatInfo[1].instance = $("#modalGridPatInfo_outBound").kendoGrid({
		dataSource: modalGridPatInfo[1].dataSource,
		noRecords: { template: '<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>' },
		autoBind: false,
		columns : arrGridPatInfo,
		selectable: true,
		change: function (e) {
            let row = e.sender.select();
            modalGridPatInfo[1].selectedItems = modalGridPatInfo[1].instance.dataItem(row);
        }
	}).data('kendoGrid');
	
	//kw---20240409 : 아웃바운드 시 고객목록 팝업 추가
	modalGridPatInfo[1].dataSource.data([]);
}

//kw---20240510 : 아웃바운드, 인바운드시 환자조회 팝업창에(v2) 그리드 항목을 추가
function CNSL300M_fnPatInfoGridAddColumn(){
	if(modalGridPatGridEmr == true){
		console.log("::::::: arrGridPatInfo1");
		let emrArr = {
				width	: 50, 
				field 	: "apiType",
				title	: "EMR",   
		}
		modalGridPatInfo[0].instance.columns.push(emrArr);
		modalGridPatInfo[1].instance.columns.push(emrArr);
	}
	
	var gridIn = modalGridPatInfo[0].instance;
	gridIn.setOptions({ columns: gridIn.columns });
	
	var gridOut = modalGridPatInfo[1].instance;
	gridOut.setOptions({ columns: gridOut.columns });
}

//kw---20240409 : 아웃바운드 시 고객목록 팝업 추가
//kw---20240222 : 고객정보 그리드 더블 클릭시 이벤트 발생
$("#modalGridPatInfo_outBound").on('dblclick','tbody tr[data-uid]',function (e) {
	CNSL300M_confirm_outBound(e);
});

//kw---20240409 : 아웃바운드 시 고객목록 팝업 추가
//kw---20240222 : 고객정보 더블 클릭시 선택된 아이템으로 고객 정보 셋팅1
function CNSL300M_confirm_outBound(e){
	var selectedRow = $(e.target).closest("tr");

  // 선택된 행의 데이터를 얻습니다.
  var dataItem = modalGridPatInfo[1].instance.dataItem(selectedRow);

	if(Utils.isNull(dataItem.pid)){
		let cnslNotMsg = '';
		if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
			cnslNotMsg = "환자 번호가 존재하지 않습니다.<br>미등록 환자로 상담을 진행하시겠습니까?";
		} else {
			cnslNotMsg = "고객 번호가 존재하지 않습니다.<br>미등록 고객으로 상담을 진행하시겠습니까?";
		}

		console.log(cnslNotMsg + " 44444 ");
		Utils.confirm(cnslNotMsg, function(){
			unknownCustomerSel();

			custTelNum = '';

			CNSL126P_fnModalClose_outBound();
		});
	} else {
		if ( window['set' + tabFrmId + 'CustInfo'] ) {
			new Function ( 'set' + tabFrmId + 'CustInfo(' + JSON.stringify(dataItem) +')')();
		}

		custTelNum = '';

		CNSL126P_fnModalClose_outBound();
	}

  

}

//kw---20240409 : 아웃바운드 시 고객목록 팝업 추가
//kw---- 확인버튼 클릭시
function gridPatConfirm_outBound(){
	 // 선택된 행의 데이터를 얻습니다.
	var dataItem = modalGridPatInfo[1].selectedItems;
    
    if ( window['set' + tabFrmId + 'CustInfo'] ) {
    	new Function ( 'set' + tabFrmId + 'CustInfo(' + JSON.stringify(dataItem) +')')();
	}
    
    custTelNum = '';
    
    CNSL126P_fnModalClose_outBound();
}

function gridPatClose_outBound(){
	CNSL126P_fnModalClose_outBound("close");
}

//kw---20240424 : softPhone 로그 기록
function logToFile(_xboxReq, _xboxRes, _callInfo, _msgType){
	
	var logXboxReq = '';
	var logXboxRes = '';
	var logCallInfo = '';
	var logMsgType = '';
	
	if(!Utils.isNull(_xboxReq)) 			{ logXboxReq 		= _xboxReq;			}
	if(!Utils.isNull(_xboxRes)) 			{ logXboxRes 		= _xboxRes;			}
	if(!Utils.isNull(_callInfo)) 			{ logCallInfo 		= _callInfo;		}
	if(!Utils.isNull(_msgType)) 			{ logMsgType 		= _msgType;			}
	
	var date = new Date();
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1, padStart로 두 자리수로 만듦
    var day = date.getDate().toString().padStart(2, '0'); // 일자를 두 자리수로 만듦
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');
    var seconds = date.getSeconds().toString().padStart(2, '0');
    var dateFormat = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

    let param = {
			tenantId 		: GLOBAL.session.user.tenantId,
			eventTimeF		: dateFormat,
			eventTimeD		: dateFormat,
			cnslId			: GLOBAL.session.user.usrId,
			cnslState 		: cnslState + "/" + $("#txtAgentState2").text(),
			xboxReqVlu 		: logXboxReq,
			xboxRspsVlu 	: logXboxRes,
			callInfo 		: logCallInfo,
			msgType 		: logMsgType,
	}
	
	Utils.ajaxCall('/sysm/LogToFile', JSON.stringify(param), function (result) {
		console.log("::::::: LogToFile");
	});
}