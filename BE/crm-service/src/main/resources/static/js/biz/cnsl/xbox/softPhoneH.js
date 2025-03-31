window.onbeforeunload = function() {
	xbox.control.end();
};

var inboundTelNo = '';

//kw---20240415 : 전화받기 팝업 후 모달창이 옆으로 한번 더 이동하는 버그 수정
var modalGridPatInfoMove = false;

$(function() {
	xbox.control.init();
	// 초기화
	$(document).on('click','#btnReset', function(e) {
		xbox.control.reset();
		$('#txtTargetNumber').val('');
	});
	
	// CTI 로그인
	$(document).on('click','#ctiLogin', function(e) {
		ctiLogin();
	});

	// 호전환 목록 선택
	$(document).on('click', '#transferList table tbody tr', function(e) {
		e.preventDefault();
		var extention = $(this).children().eq(1).text();
		if (extention) {
			$('#txtTransferNumber').val(extention);
		}
	});

	// 3자통화 목록 선택
	$(document).on('click', '#conference table tbody tr', function(e) {
		e.preventDefault();
		var extention = $(this).children().eq(1).text();
		if (extention) {
			$('#txtConferenceNumber').val(extention);
		}
	});

	// 녹취 재생
	$(document).on('click', '#btnRecordPlay', function(e) {
		e.preventDefault();
		var callId = $(this).data('id');
		if (callId) {
			xbox.control.recordPlay(callId);
		}
	});
	
	$(document).on('click', '.popReferView', function(e) {
		var mHeight = $(this).data('height'),
			mWidth = $(this).data('width'),
			mUrl = $(this).data('url'),
			mTitle = $(this).data('title'); 
		popSource.setOptions({ 
			width: mWidth,
			height: mHeight,
			title: mTitle, 
		});
		popSource.refresh({  
			url: mUrl
		});
		popSource.center().open();   
		
		//kw---20240409 : 아웃바운드 시 고객목록 팝업 추가
		popSource_outBound.setOptions({ 
			width: mWidth,
			height: mHeight,
			title: mTitle, 
		});
		popSource_outBound.center().open();
	});
});

// 전화받기 팝업에서 쓰던 플래그값 
var alertingPopFlag = false;
// 전화받기 팝업 표출
function alertingView(flag, data) {
	if (flag == 'hide') {
		if (alertingPopFlag) {
			alertingPopFlag = false;
		}
	} else {
		
		//kw---20240117 : 전화받기 팝업 뜨면 기존 정보 삭제 start
//		if (["CMH", "SNG", "YJI"].includes(GLOBAL.session.user.tenantId)) {
			
			//통화이력 클리어
			if (typeof listViewCNSL201T_1 !== 'undefined') {
				if(typeof listViewCNSL201T_1.clearSelection == 'function')	{	listViewCNSL201T_1.clearSelection();	}
			}
			
			//상담이력 초기화
//			if(typeof counselInit == 'function')							{	counselInit();							}
			
			//환자정보 탭 클릭
//			if(typeof CNSL200MTabClick == 'function')						{	CNSL200MTabClick(url112);				}
			
			//상담이력 그리드 초기화
//			if (typeof CNSL220T_empty == 'function') 						{	CNSL220T_empty();						}

			custId = '';
			custNm = '';
			custTelNum = '';
			custAcpnNo = '';
			cnslCustSelItem = '';
//			recordStartTime = '';
			
			//CM병원 환자정보 초기화
//			if(typeof custInitCMHB112 == 'function')						{	custInitCMHB112();						}
			//양지병원 환자정보 초기화
//			if(typeof custInitYJIB112_2 == 'function')						{	custInitYJIB112_2();					}
//		}
		//kw---20240117 : 전화받기 팝업 뜨면 기존 정보 삭제 end
		
		var callDirection = '';
		if ( data.callDirection == "I" ) {
			callDirection = 'I: 인바운드';
		}
		
		var callType = '';
		if ( data.callType == "E" ) {
			callType = 'E: 외부콜';
		}
		
		//주의 고객 체크
		/*if(!Utils.isNull(data.remote)){
			var CNSL200_Param = {
				"tenantId" : GLOBAL.session.user.tenantId,
				"formatterTelNumber" : phoneFomatter(data.remote),
				"telNumber"			 : data.remote
			};
			
			Utils.ajaxCall("/cnsl/CNSL200SEL02", JSON.stringify(CNSL200_Param), function (result) {
				if(!Utils.isNull(result.exists) && result.exists > 0 ){
					$('.phoneFrame #custAtt').show();
				} else {
					$('.phoneFrame #custAtt').hide();
				}	
			});
		}*/
		
		$('.phoneFrame #txtTelNumber').html(data.remote);
		$('.phoneFrame #callDirection').html(callDirection);
		$('.phoneFrame #callType').html(callType);
		$(".phoneFrame #serviceName").html(data.serviceCode)
		
		var CNSL200_data = {};
		CNSL200_data = {
			"serviceCode" : data.serviceCode
		};
		var CNSL200_jsonStr = JSON.stringify(CNSL200_data);
		Utils.ajaxCall("/cnsl/CNSL200SEL01", CNSL200_jsonStr, CNSL200SEL01);
		
		inboundTelNo = data.remote.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
		customNumber = data.customNumber;
		alertingPopFlag = true;
		callbotSelect(data);
		
		//modal 실행
		modalCNSL126P(data);

	}
}

// 공통코드에 등록된 서비스코드 표출
function CNSL200SEL01(data) {
	if ( data.CNSL200SEL01 != null ) {
		$(".phoneFrame #serviceName").html(data.CNSL200SEL01);
	}
}

// 호전환 팝업 : xbox에서 데이터 받아와서 테이블에 항목 표출
function transferView(flag, data) {
	if (flag == 'hide') {
		$('#transferList').modal('hide');
	} else if ( flag == 'Reset' ) {
		if (data) {
			var html = '';
			window.kendo.ui.progress($('table tbody', '#transferList') , true);	//shpark 20241031 : 결함리포트 158
			$.each(data || {}, function(i, row) {
				if (GLOBAL.session.user.ctiAgenId != row.AgentId) {
					html += '<tr>';
					html += '<td>' + row.AgentId + '</td>';
					html += '<td>' + row.StationId + '</td>';
					html += '<td>'
							+ ((row.Login == 'login') ? row.Status
									: '로그아웃') + '</td>';
					html += '</tr>';
				}
			});
			$('table tbody', '#transferList').empty().append(html);
			window.kendo.ui.progress($('table tbody', '#transferList') , false);
		}
	} else {
		$('#transferList').modal({
			backdrop : 'static',
			keyboard : false
		}).on(
				'shown.bs.modal',
				function(e) {
						xbox.control.transferButtonChange();
					if (data) {
						var html = '';
						$.each(data || {}, function(i, row) {
							if (GLOBAL.session.user.ctiAgenId != row.AgentId) {
								html += '<tr>';
								html += '<td>' + row.AgentId + '</td>';
								html += '<td>' + row.StationId + '</td>';
								html += '<td>'
										+ ((row.Login == 'login') ? row.Status
												: '로그아웃') + '</td>';
								html += '</tr>';
							}
						});
						$('table tbody', '#transferList').empty().append(html);
					}
				}).on('hide.bs.modal', function(e) {

		});
	}
}

// 3자통화 팝업 ( 아직 미사용 ) : xbox에서 데이터 받아와서 테이블에 항목 표출
function conferenceView(flag, data) {
	if (flag == 'hide') {
		$('#conference').modal('hide');
	} else {
		$('#conference').modal({
			backdrop : 'static',
			keyboard : false
		}).on(
				'shown.bs.modal',
				function(e) {
					xbox.control.conferenceButtonChange();
					if (data) {
						var html = '';
						$.each(data, function(i, row) {
							if ($('#txtCtiId').val() != row.AgentId) {
								html += '<tr>';
								html += '<td>' + row.AgentId + '</td>';
								html += '<td>' + row.StationId + '</td>';
								html += '<td>'
										+ ((row.Login == 'login') ? row.Status
												: '로그아웃') + '</td>';
								html += '</tr>';
							}
						});
						$('table tbody', '#conference').empty().append(html);
					}
				}).on('hide.bs.modal', function(e) {

		});
	}
}

// 전화받기 팝업 관련 함수
var popSource =$("#modalDemoPop").kendoWindow({  
	modal: false, 
	visible: false, 
	animation: false, 
	resizable: false, 
	close: function() {
		$("#modalDemoPop").parent('.k-window').removeClass('DialModal');
		
		//kw---20240223 : 전화받기 팝업창 글로벌 옵션 필터 적용
		if(softCallPopGridBool == true){
			//kw---20240213 : 전화받기 모달 팝업에 고객조회 추가
			$("#modalAlertCall").css("display","");
			popSource.wrapper.find(".k-window-actions").show();
//			modalGridPatInfo[0].dataSource.data([]);
		}

		//kw---20240920 : 시연용 - 전화시뮬레이션 추가 시작
		let mode = '';
		if(window['softPhoenMode']){
			if(softPhoenMode == 'factory'){
				softPhoenMode = '';
			}
		}
		//kw---20240920 : 시연용 - 전화시뮬레이션 추가 끝

		
	}
}).data("kendoWindow");

// 전화받기 팝업 호출
function modalCNSL126P(data){
	
	$("#modalGridPatInfo").find("td").addClass("kendogrid_disabled");
	
	modalGridPatInfoMove = false;
	
	$('.receivePhone').removeClass('hangUp');
	$("#modalAlertCall").css("opacity","100");
	
	$("#modalAlertCall").css("display","");
	popSource.wrapper.find(".k-window-actions").show();
	modalGridPatInfo[0].dataSource.data([]);
	
	//kw---20240223 : 전화받기 팝업창 글로벌 옵션 필터 적용
	if(softCallPopGridBool == true){
		$('.receivePhone').removeClass('hangUp');
		popSource.center().open().wrapper.addClass('DialModal').css("margin-left", "277px");
		
		//kw---20240213 : 전화받기 팝업창 옆에 고객정보 표출
		$("#CNSL126P_modalBtnConfirm").css("display", "none");
		$("#CNSL126P_modalBtnClose").css("display", "none");
		
		if ( window['srch' + tabFrmId + 'CustInfo'] ) {
			new Function ( 'srch' + tabFrmId + 'CustInfo(\"' + $('.phoneFrame #txtTelNumber').html() +'\")')();
			$("#modalGridPatInfo").find("td").addClass("kendogrid_disabled");
		}
	} else {
		popSource.center().open().wrapper.addClass('DialModal');
	}
	
	
}

function CNSL126P_fnModalClose(){
	popSource.wrapper.find(".k-window-actions").show();
	$("#modalAlertCall").css("display","");
	$("#modalAlertCall").css("opacity","100");
	
	popSource.close();
}

//kw---20240409 : 아웃바운드 시 고객목록 팝업 추가
function CNSL126P_fnModalClose_outBound(_type){
	if(Utils.isNull(_type)){
		custSelMode = "find";
	    $("#btnMakeCall").click();	
	}
	
	popSource_outBound.close();
}

function callbotSelect(data){
	if(data !=null){
		if(data.serviceCode == "9120"){
			let parm = {
				tenant:GLOBAL.session.user.tenantId,
				startDate: Utils.getToday(),
				endDate:Utils.getToday(),
				customerNum:data.remote.replaceAll('-','')
			}

			Utils.ajaxSyncCall("/cnsl/CNSL150SEL01", JSON.stringify(parm), function (data) {
				let resultdata = data.result.ResultData[0];
				if(resultdata.customerId != null || resultdata.customerId != undefined){
					customNumber =  resultdata.customerId;
				}
				if(data.result.Result.Code ==='0000'){
					Utils.openPopV2(GLOBAL.contextPath + "/cnsl/CNSL151P", "CNSL151P", 700, 700,{x:1100,y:300},{data :resultdata },false);
				}
			});
		}
	}
}

//CTI 로그인
function ctiLogin() {
	if ( GLOBAL.session.user.ctiAgenId  == '' ) {
		Utils.alert("사용자 정보에 CTI ID, 내선번호가 존재하지 않습니다.<br>(CTI를 사용할 수 없습니다.)");
		return;
	}
	
	//kw---20240509 : softPhone TEST를 위한 기능 - true : DMO / DMO_A99 / 9099 로 접근
	//kw---20240509 : 배포시 조건 중 양지검진 삭제 - 20240509 EMR TEST 용
	var bonaPath = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 34).bsVl1;
	
//	if(softPhoneTest == true || GLOBAL.session.user.tenantId == 'YJG'){
	if(softPhoneTest == true){
		
		GLOBAL.session.user.ctiAgenId = 'DMO_A99';
		GLOBAL.session.user.extNo = '9099'
		bonaPath = 'ws://127.0.0.1:7778';
		
		xbox.control.start(bonaPath,
			'DMO',
			GLOBAL.session.user.ctiAgenId,
			GLOBAL.session.user.ctiAgenPw);
	} else {
		xbox.control.start(bonaPath,
			GLOBAL.session.user.tenantId,
			GLOBAL.session.user.ctiAgenId,
			GLOBAL.session.user.ctiAgenPw);
	}
}

//전화받기 팝업에서 전화 받을때 쓰는 함수
function receivePhonePickup() {

	//kw---20240920 : 시연용 - 전화시뮬레이션 추가 시작
	let mode = '';
	if(window['softPhoenMode']){
		if(softPhoenMode == 'factory'){
			softPhoenMode = 'factory-pick';
			mode = 'factory-pick';
			custTelNum = $(".phoneFrame #txtTelNumber").html();
			if(window['CRMB112T_fnCallTestConnect']){
				CRMB112T_fnCallTestConnect();
			}
			$("#txtAgentState2").html('<span>통화중<br><span style="font-size: 11px; margin-top: -5px;">(시연용)</span></span>');
		}
	}
	//kw---20240920 : 시연용 - 전화시뮬레이션 추가 끝

	if(mode != 'factory-pick'){	//kw---20240920 : 시연용 - 전화시뮬레이션 추가
		if(pickupPhone == false){
			xbox.util.log('xbox.control, 전화받기');
			var interactionId = xbox.model.callManager.activeInteractionId;
			xbox.request.cti.pickup(interactionId, 'pickupCallback');
		}
	}

	$(".phoneFrame #txtTelNumber").html('');
	$(".phoneFrame #serviceName").html('');
	$(".phoneFrame #custId").html('');

	//kw---20240223 : 전화받기 팝업창 글로벌 옵션 필터 적용
	if(softCallPopGridBool != true){
		popSource.close();
	}

	//kw---20240223 : 전화받기 팝업창 글로벌 옵션 필터 적용
	if(softCallPopGridBool == true){

//		//kw---20240304 : 검색된 상담사가 0명 일 경우 (미등록 환자 선택)
		if(modalGridPatInfo[0].dataSource.data().length == 0){

			cnslCustSelItem = '';

			CNSL126P_fnModalClose();
		}
		//kw---20240304 : 1명일 경우 첫번째 데이터 셋팅
		else if(modalGridPatInfo[0].dataSource.data().length == 1){
			//선택된 행의 데이터를 얻습니다.
			cnslCustSelItem = modalGridPatInfo[0].dataSource.data()[0];

			CNSL126P_fnModalClose();

			//kw---20240508 : 환자선택시 EMR에 정보 띄우기
			var emrOpenYn = false;
			if(!Utils.isNull(Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 41)) && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 41).bsVl1 == "Y"){
				emrOpenYn = true;
			}
			if(emrOpenYn){
				if ( window['emrOpenIB' + tabFrmId] ) {
					window['emrOpenIB' + tabFrmId](cnslCustSelItem);
				}
			}
		}
		//kw---20240304 : 2명 이상일 경우
		else {

			if(modalGridPatInfoMove == false){
				popSource.wrapper.find(".k-window-actions").hide();
				$("#modalGridPatInfo").find("td").removeClass("kendogrid_disabled");
				popSource.wrapper.animate({ left: "-=407px" }, "fast");
				$("#modalAlertCall").animate({ opacity: 0 }, "fast", function() {
					popSource.wrapper.css("left","+=300px");
					$(this).css("display", "none");
				});
				$("#CNSL126P_modalBtnConfirm").css("display", "");
				$("#CNSL126P_modalBtnClose").css("display", "");

				$("#modalGridPatInfo").find("td").removeClass("kendogrid_disabled");


			}

		}
	}

	modalGridPatInfoMove = true;

	pickupPhone = false;
	

}

//통합접촉이력에 쌓인 상담이력 녹취플레이어 재생
function recPlay(rec_key) {
	if (rec_key == 'null' || rec_key == '') {
		Utils.alert("녹취 키값이 존재하지 않습니다.");
		return;
	} else {
		xbox.control.recordPlay(rec_key);
	}
}

//콜백관련데이터 녹취플레이어 재생 
function recPlayCallback(CallId, StartTime, Ani, Dnis, TelePhone, CustomName, Duration, Filename, useSTT) {
	xbox.connect.send('Record', 'VoiceCallbackPlay', {
        CallId: CallId, 
        StartTime: StartTime,
        Ani: Ani, 
        Dnis: Dnis,
        TelePhone: TelePhone,
        CustomName: CustomName,
        Duration: Duration,
        Filename: Filename,
        useSTT: useSTT
    });
}

/*
 * phoneFomatter(phoneNum, masking option);
 */
function phoneFomatter(num,type){
    var formatNum = '';
    if(num.length==11){
        if(type==0){
            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
        }else{
            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }
    }else if(num.length==8){
        formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
    }else{
        if(num.indexOf('02')==0){
            if(type==0){
                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
            }else{
                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
            }
        }else{
            if(type==0){
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
            }else{
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            }
        }
    }
    return formatNum;
}


var popSource_outBound =$("#modalDemoPop_outBound").kendoWindow({  
	modal: false, 
	visible: false, 
	animation: false, 
	resizable: false, 
	close: function() {
		$("#modalDemoPop_outBound").parent('.k-window').removeClass('DialModal');
			popSource_outBound.wrapper.find(".k-window-actions").show();
	},
	activate: function() {
        // Window 활성화 시에 닫기 버튼 스타일 수정
        $(this.element).find(".k-window-action[aria-label='Close']").css('right', '0px');
    },
    open: function() {
        $(this.wrapper).find(".k-window-action[aria-label='Close']").css('right', '0px');
    },
}).data("kendoWindow");
