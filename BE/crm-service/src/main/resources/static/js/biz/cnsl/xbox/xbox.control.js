
// xbox.control.js
// jquery 문법을 사용하므로 jquery가 반드시 로드되어 있어야 사용 가능합니다.

var nowCallId = '';
var counselMode = '';
var recordStartTime = '';

var xbox = (function (xboxExports) {
    'use strict';

    /**
    * control
    */
    xboxExports.control = (function (exports) {
        var tenantPrefix = '';

        var BUTTON_WAIT = 'btnWait';   // 수신대기
        var BUTTON_TASK = 'btnTask';   // 기타업무
        var BUTTON_REST = 'btnRest';   // 휴식
        var BUTTON_LUNCH = 'btnLunch';   // 식사

        var BUTTON_HOLD = 'btnHold';   // 보류
        var BUTTON_MUTE = 'btnMute';   // 음소거
        var BUTTON_TRANSFER = 'btnTransfer';   // 호전환
        var BUTTON_TRANSFER_RESET = 'btnTransferReset';   // 호전환리스트 갱신
        
        var BUTTON_CONFERENCE = 'btnConference';   // 3자통화
        var BUTTON_HELPREQUEST = 'btnHelpRequest';   // 도움요청
        var BUTTON_HELPREQUEST_CANCEL = 'btnHelpRequest_Cancel';   // 도움요청 취소

        var BUTTON_MAKE_CALL = 'btnMakeCall';       // 걸기 버튼
        var BUTTON_DISCONNECT = 'btnDisconnect';   // 끊기
        
        var INPUT_AGENT_STATE = 'txtAgentState';   // 상담원 상태 표시 영역
        var INPUT_AGENT_STATE2 = 'txtAgentState2';   // 상담원 상태 표시 영역
        var INPUT_CONTACT_NUMBER = 'txtContactNumber';     //전화번호 표시 영역
        var INPUT_TARGET_NUMBER = 'txtTargetNumber';   // 전화걸기 영역
        var INPUT_SEND_NUMBER = 'OutNumList';                  //상담APP 하단 발신번호(대표번호)
        var INPUT_STATUS_MESSAGE = 'statusMessage';   // 메시지 영역
        
        var BUTTON_LOGIN = 'ctiLogin'; // CTI 로그인
        var BUTTON_LOGOUT = 'ctiLogout'; // CTI 로그아웃
        var BUTTON_RESET = 'btnReset'; // CTI 버튼 초기화

        // 콜 인입
        var MODAL = 'alerting';            // 전화받기 모달창
        var BUTTON_PICKUP = 'btnPickup';   // 전화받기

        // 호전환
        var MODAL_TRANSFER = 'transferList';   // 호전환 대상 상담원 목록 모달창
        var INPUT_TRANSFER_NUMBER = 'txtTransferNumber';   // 호전환 대상 전화번호
        var BUTTON_TRANSFER_CONNECT = 'btnTransferConnect';    // 호전환 시작
        var BUTTON_TRANSFER_CANCEL = 'btnTransferCancel';      // 호전환 취소
        var BUTTON_TRANSFER_COMPLETE = 'btnTransferComplete';  // 호전환 완료
        var BUTTON_TRANSFER_DIRECT = 'btnTransferDirect';      // 즉시 호전환
        var BUTTON_TRANSFER_CLOSE = 'btnTransferClose';      // 호전환 모달창 닫기

        // 3자통화
        var MODAL_CONFERENCE = 'conference';       // 3자통화 대상 상담원 목록 모달창
        var INPUT_CONFERENCE_NUMBER = 'txtConferenceNumber';   // 호전환 대상 전화번호
        var BUTTON_CONFERENCE_CREATE = 'btnConferenceCreate';  // 3자통화 대화방 만들기
        var BUTTON_CONFERENCE_INVITE = 'btnConferenceInvite';      // 3자통화 대화방 초대
        var BUTTON_CONFERENCE_MAKECALL = 'btnConferenceMakeCall';      // 3자통화 상담원 연결
        var BUTTON_CONFERENCE_DISCONNECT = 'btnConferenceDisconnect';      // 3자통화 상담원 끊기
        var BUTTON_CONFERENCE_CLOSE = 'btnConferenceClose';    // 3자통화 모달창 닫기       
        
        // 상담원 상태
        var STATE_ALERTING = '벨울림';
        var STATE_SENDING = '발신중';
        //kw---20240408 : OUTBound 전화 연결 시 상태 문구 변경 (전화걸기 눌렀을 경우 : OUT 통화중(발신중), 전화 연결중 : OUT 통화중(발신중))
        var STATE_SENDING_OUT = '<span>OUT<br>통화중<br><span style="font-size: 11px; margin-top: -5px;">(발신중)</span></span>'; 
        var STATE_CALLING = '통화중';
        var STATE_CALLING_IN = 'IN-통화중';
        var STATE_CALLING_OUT = 'OUT-통화중';
        var STATE_FOLLOW_UP = '후처리';
        var STATE_WAIT = '수신대기';
        var STATE_TASK = '기타업무';
        var STATE_REST = '휴식';
        var STATE_LUNCH = '식사';
        var STATE_ONLINE = '온라인';
        var STATE_HOLD = '보류';
        var STATE_HOLD_CONNECT = '보류후연결';
        var STATE_OUT_WORK = '자리비움';
        var STATE_AWAY_DESK = '이석';
        var STATE_TRAINING = '교육';

        // 모니터링
        var MONITOR_WATE_CALL_COUNT = 'monitor_waite_call_count';
        var MONITOR_INTERACTION_PERCENT = 'monitor_interaction_percent';
        var MONITOR_AGENT_AVAILABLE = 'monitor_agent_available';
        var MONITOR_ENTER_CALL_COUNT = 'monitor_enter_call_count';
//        var MONITOR_ANSWERED_CALL_COUNT = 'monitor_answered_call_count';
//        var MONITOR_ABANDONED_CALL_COUNT = 'monitor_abandoned_call_count';
        /**
        * 실행여부
        */
        exports.startFlag = false;

        /**
        * 초기화
        * 콜 관련 버튼 이벤트(click)를 등록합니다.
        */
        exports.init = function () {
            // 콜 관련 버튼 상태 초기화
            btnAgentStateDisabled(true, '');
            btnCallStateDisabled(true, '');
            btnCallFunctionDisabled(true, '');
            
            if ( GLOBAL.session.user.extNoUseYn == 'N' || GLOBAL.session.user.extNo == '' ) {
            	xbox.util.id(BUTTON_LOGIN).prop('disabled', true);
            	xbox.util.id(BUTTON_RESET).prop('disabled', true);
            } 
            xbox.util.id(BUTTON_LOGOUT).prop('disabled', true);

            // 이벤트 등록
            this.removeAgentStateChanged(callbackAgentStatusChanged);
            this.addAgentStateChanged(callbackAgentStatusChanged);
            this.removeCallStateChanged(callbackCallStateChanged);
            this.addCallStateChanged(callbackCallStateChanged);
            this.removeConnectionStateChanged(callbackConnectionStateChanged);
            this.addConnectionStateChanged(callbackConnectionStateChanged);

            // 상담원 상태 변경 - 수신대기
            xbox.util.id(BUTTON_WAIT).on('click', _agentStateChanged);
            // 상담원 상태 변경 - 기타업무
            xbox.util.id(BUTTON_TASK).on('click', _agentStateChanged);
            // 상담원 상태 변경 - 휴식
            xbox.util.id(BUTTON_REST).on('click', _agentStateChanged);
            // 상담원 상태 변경 - 식사
            xbox.util.id(BUTTON_LUNCH).on('click', _agentStateChanged);

            // 전화받기
            xbox.util.id(BUTTON_PICKUP).on('click', _pickup);
            // 전화걸기 Enter 클릭
            xbox.util.id(MODAL).on('keydown', _pickupEnter);
            // 전화걸기 클릭
            xbox.util.id(BUTTON_MAKE_CALL).on('click', _makeCall);
            // 전화걸기 Enter 클릭
            xbox.util.id(INPUT_TARGET_NUMBER).on('keydown', _makeCallEnter);
            // 전화끊기
            xbox.util.id(BUTTON_DISCONNECT).on('click', _disconnect);

            // 보류
            xbox.util.id(BUTTON_HOLD).on('click', _hold);
            // 음소거
            xbox.util.id(BUTTON_MUTE).on('click', _mute);

            // 호전환
            xbox.util.id(BUTTON_TRANSFER).on('click', _transfer);
            
            // 호전환 갱신
            xbox.util.id(BUTTON_TRANSFER_RESET).on('click', _transferReset);
            
            // 호전환 시작
            xbox.util.id(BUTTON_TRANSFER_CONNECT).on('click', _transferConnect);
            // 호전환 취소
            xbox.util.id(BUTTON_TRANSFER_CANCEL).on('click', _transferCancel);
            // 호전환 완료
            xbox.util.id(BUTTON_TRANSFER_COMPLETE).on('click', _transferComplete);
            // 즉시 호전환
            xbox.util.id(BUTTON_TRANSFER_DIRECT).on('click', _transferDirect);
            // 호전환 창 닫기
            xbox.util.id(BUTTON_TRANSFER_CLOSE).on('click', _transferClose);
            // 도움 요청
            xbox.util.id(BUTTON_HELPREQUEST).on('click', _helpRequest);
            // 도움 요청
            xbox.util.id(BUTTON_HELPREQUEST_CANCEL).on('click', _helpRequest_Cancel);

            // 3자통화
            xbox.util.id(BUTTON_CONFERENCE).on('click', _conference);
            // 3자통화 대화방 생성
            xbox.util.id(BUTTON_CONFERENCE_CREATE).on('click', _conferenceCreate);
            // 3자통화 대화방 초대
            xbox.util.id(BUTTON_CONFERENCE_INVITE).on('click', _conferenceInvite);
            // 3자통화 상담원 연결
            xbox.util.id(BUTTON_CONFERENCE_MAKECALL).on('click', _conferenceMakeCall);
            // 3자통화 상담원 끊기
            xbox.util.id(BUTTON_CONFERENCE_DISCONNECT).on('click', _conferenceDisconnect);
            // 3자통화 창 닫기
            xbox.util.id(BUTTON_CONFERENCE_CLOSE).on('click', _conferenceClose);
            if ( xbox.connect.isopen() ) {
        		xbox.control.reset();
        	}
            
            
            
            xbox.util.id(BUTTON_LOGOUT).on('click', _ctilogout);
        };

        /*********************************************************
        *   클릭 이벤트 Start
        */
        
        /**
         * CTI 로그아웃
         */
        function _ctilogout(e) {
        	xbox.control.end(true);
        }
        /**
        * 상담원 상태 변경
        */
        function _agentStateChanged(e) {
        	
        	//kw---20240426 : 벨울림 상태에서 상태값을 변경 할 수 없도록 기능 추가
        	if(callBackState == "Alerting"){
        		Utils.alert("벨울림 상태에서는 상태를 변경할 수 없습니다.");
        		return
        	}
            var state = $(this).data('value');
            if ( counselMode != 'add' && nowCallId != '' && state == "수신대기" && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 33).bsVl1 == 'Y' ) {
            	Utils.alert('상담이력을 저장해주세요.');
        		return false;
        	}
            
            if(state == "수신대기"){
            	custId = '';
    			custNm = '';
    			custTelNum = '';
    			custAcpnNo = '';
    			nowCallId = '';
            }
            
            xbox.util.log('xbox.control, 상담원 상태 변경 : ' + state);
            if (xbox.util.id(INPUT_AGENT_STATE).html() == state) {
                xbox.util.log('xbox.control[class=agent-state], 상담원 상태 변경 실패-중복 코드');
                return false;
            }
            xbox.request.cti.setAgentStatus(state);
        }

        /**
        * 전화받기
        */
        function _pickup(e) {
            xbox.util.log('xbox.control, 전화받기');
            var interactionId = xbox.model.callManager.activeInteractionId;
            xbox.request.cti.pickup(interactionId, 'pickupCallback');
        }

        /**
        * 전화받기 Enter
        */
        function _pickupEnter(e) {
            if (e.which == 13) {
                e.preventDefault();
                _pickup(e);
            }
        }

        /**
        * 전화걸기
        */
        function _makeCall(e) {
        	
        	if ( counselMode != 'add' && nowCallId != '' && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 33).bsVl1 == 'Y' ) {
        		Utils.alert('상담이력을 저장해주세요.');
        		return false;
        	}
        	
            var currentState = xbox.util.id(INPUT_AGENT_STATE).html();
            var telNumber = xbox.util.id(INPUT_TARGET_NUMBER).val().replace(/\D/g, "");
        	var regex = /기타업무|휴식|식사|점심시간|교육|온라인/; //걸기 가능한 상태
            var regexNum = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;//전화번호 형식

            if (regex.test(currentState)) {
                if (!telNumber) {
                    Utils.alert('전화번호를 입력하세요.');
                    xbox.util.id(INPUT_TARGET_NUMBER).val('').focus();
                    return false;
                }

                if (telNumber.indexOf('-') > -1) {
                    if (!regexNum.test(telNumber)) {
                    	Utils.alert('전화번호 형식이 아닙니다.');
                        xbox.util.id(INPUT_TARGET_NUMBER).val('').focus();
                        return false;
                    }
                }
            } else {
            	if (currentState != '로그아웃') {
            		alert(currentState + ' 상태에서는 걸기를 할 수 없습니다.');
            	}
                return false;
            }
        	
        	//kw---20240409 : 아웃바운드 시 고객목록 팝업 추가
        	if(outBoundType == 'beforPop'){
        		
        		nowCallId = '';
        		
        		if(!Utils.isNull(custId) && Utils.isNull(custTelNum)){
        			fnMakeCall(e);
        		} else if(custTelNum != xbox.util.id(INPUT_TARGET_NUMBER).val().replace(/\D/g, "")){
        			if ( window['srch' + tabFrmId + 'CustInfo_outBound'] ) {
        				new Function ( 'srch' + tabFrmId + 'CustInfo_outBound(\"' + xbox.util.id(INPUT_TARGET_NUMBER).val().replace(/\D/g, "") +'\")')();
        			}
            	} else {
            		if(custSelMode == "find"){
            			fnMakeCall(e);
            		} else {
            			if ( window['srch' + tabFrmId + 'CustInfo_outBound'] ) {
            				new Function ( 'srch' + tabFrmId + 'CustInfo_outBound(\"' + xbox.util.id(INPUT_TARGET_NUMBER).val().replace(/\D/g, "") +'\")')();
            			}
            		}
            		
            	}
        	} else {
        		if ( custId == '' ) {
            		Utils.alert('상담할 대상을 선택하세요.');
            		return false;
            	} 
        		
        		fnMakeCall(e);
        	}
        	
        }
        
        //kw---20240409 : 아웃바운드 시 고객목록 팝업 추가
        function fnMakeCall(e){
        	
        	recordStartTime = '';

        	//kw---202404015 : 아웃바운드 시 통화이력 선택해제 될 수 있도록 수정
        	var objNm = "listViewCNSL";
        	var frmId = tabFrmCnslCallId;
        	window[objNm + frmId + "_1"].clearSelection();

            xbox.util.log('xbox.control, 전화걸기');
            
            //kw---20240411 : 소프트폰- 현재 콜ID를 초기화 해주지 않으면 이전 콜의 대한 정보가 영향을 받음
            cnslState = 'init';

            // 상담원 상태가 전화를 걸수 있는 상태인지 확인
            var telNumber = xbox.util.id(INPUT_TARGET_NUMBER).val().replace(/\D/g, "");

            // 대표번호(발신번호)
            var sendNumber = xbox.util.replaceAll(xbox.util.id(INPUT_SEND_NUMBER).val(), /[^0-9]/gi, '');

            // 발신
            btnCallFunctionDisabled(true, BUTTON_MAKE_CALL);
            xbox.request.cti.makeCall(telNumber, sendNumber, 'makeCallCallback');
        }

        /**
        * 전화걸기 Enter
        */
        function _makeCallEnter(e) {
            if (e.which == 13) {
                e.preventDefault();
                _makeCall(e);
            }            
        }

        /**
        * 전화끊기
        */
        function _disconnect(e) {

            //kw---20240920 : 시연용 - 전화시뮬레이션 추가 시작
            let mode = '';
            if(window['softPhoenMode']){
                if(softPhoenMode == 'factory-pick'){
                    mode = 'factory-pick';
                    if(window['CRMB112T_fnCallTestDisConnect']){
                        CRMB112T_fnCallTestDisConnect();
                    }
                }
            }
            //kw---20240920 : 시연용 - 전화시뮬레이션 추가 끝

            if(mode != 'factory-pick') {	//kw---20240920 : 시연용 - 전화시뮬레이션 추가
                xbox.util.log('xbox.control, 전화끊기');
                var interactionId = xbox.model.callManager.activeInteractionId;
                xbox.request.cti.disconnect(interactionId);
            }

        }

        /**
        * 보류
        */
        function _hold(e) {
            xbox.util.log('xbox.control, 보류');
            var interactionId = xbox.model.callManager.activeInteractionId;
            xbox.request.cti.holdToggle(interactionId, 'holdCallback', { interactionId: interactionId });
            
            if ( $("#btnHold span").html() == "보류" ) {
            	$("#btnHold span").html("보류해제");
            	xbox.util.id(BUTTON_MUTE).prop('disabled', true);
            	xbox.util.id(BUTTON_DISCONNECT).prop('disabled', true);
            	xbox.util.id(BUTTON_TRANSFER).prop('disabled', true);
//            	xbox.util.id(BUTTON_CONFERENCE).prop('disabled', true);
            } else {
            	$("#btnHold span").html("보류");
            	xbox.util.id(BUTTON_MUTE).prop('disabled', false);
            	xbox.util.id(BUTTON_DISCONNECT).prop('disabled', false);
            	xbox.util.id(BUTTON_TRANSFER).prop('disabled', false);
//            	xbox.util.id(BUTTON_CONFERENCE).prop('disabled', false);
            }
        }

        /**
        * 음소거
        */
        function _mute(e) {
            xbox.util.log('xbox.control, 음소거');
            var interactionId = xbox.model.callManager.activeInteractionId;
            xbox.request.cti.muteToggle(interactionId, 'muteCallback', { interactionId: interactionId });
            
            if ( $("#btnMute span").html() == "음소거" ) {
            	$("#btnMute span").html("음소거해제");
            	xbox.util.id(BUTTON_HOLD).prop('disabled', true);
            	xbox.util.id(BUTTON_DISCONNECT).prop('disabled', true);
            	xbox.util.id(BUTTON_TRANSFER).prop('disabled', true);
//            	xbox.util.id(BUTTON_CONFERENCE).prop('disabled', true);
            } else {
            	$("#btnMute span").html("음소거");
            	xbox.util.id(BUTTON_HOLD).prop('disabled', false);
            	xbox.util.id(BUTTON_DISCONNECT).prop('disabled', false);
            	xbox.util.id(BUTTON_TRANSFER).prop('disabled', false);
//            	xbox.util.id(BUTTON_CONFERENCE).prop('disabled', false);
            }
        }

        /**
        * 호전환
        */
        function _transfer(e) {
            xbox.util.log('xbox.control, 호전환');
            xbox.request.cti.getAgentInfoList(tenantPrefix, '', 'agentInfoListCallback', 'transfer');
        }
        
        /**
         * 호전환리스트 갱신
         */
        function _transferReset(e) {
            xbox.util.log('xbox.control, 호전환리스트갱신');
            xbox.request.cti.getAgentInfoList(tenantPrefix, '', 'agentInfoListCallback', 'transferReset');
        }
        
        /**
        * 호전환 시작
        */
        function _transferConnect(e) {
            xbox.util.log('xbox.control, 호전환 시작');
            e.preventDefault();
            var extention = xbox.util.id(INPUT_TRANSFER_NUMBER).val();
            if (!extention) { alert('상담원을 선택하거나 전화번호를 입력하세요.'); return false; }
            xbox.request.cti.consultMakeCall(extention, 'consultMakeCallback');
        }
        /**
        * 호전환 취소
        */
        function _transferCancel(e) {
            xbox.util.log('xbox.control, 호전환 취소');
            e.preventDefault();
            var manager = xbox.model.callManager;
            // 콜아이디가 있으면 호전환 전화 종료
            if (manager.transferInteractionId.length > 0) {
                xbox.request.cti.consultDisconnect(manager.externalInteractionId, manager.transferInteractionId, 'consultDisconnectCallback');
            }
        }
        /**
        * 호전환 완료
        */
        function _transferComplete(e) {
            xbox.util.log('xbox.control, 호전환 완료');
            e.preventDefault();
            var manager = xbox.model.callManager;
            // 콜아이디가 있으면 호전환 전화 종료
            if (manager.transferInteractionId.length > 0) {
                xbox.request.cti.consultTransfer(manager.externalInteractionId, manager.transferInteractionId, 'consultTransferCallback');
            }
        }
        /**
        * 즉시 호전환
        */
        function _transferDirect(e) {
            xbox.util.log('xbox.control, 즉시 호전환');
            e.preventDefault();
            var extention = xbox.util.id(INPUT_TRANSFER_NUMBER).val();
            if (!extention) { alert('상담원을 선택하거나 전화번호를 입력하세요.'); return false; }

            var manager = xbox.model.callManager;
            xbox.request.cti.blindTransfer(manager.externalInteractionId, extention, 'blindTransferCallback');
        }
        /**
        * 호전환 창 닫기
        */
        function _transferClose(e) {
            xbox.util.log('xbox.control, 호전환 창 닫기');
            e.preventDefault();
            xbox.util.id(MODAL_TRANSFER).modal('hide');
        }
		/**
        * 도움 요청
        */
        function _helpRequest(e) {
            xbox.util.log('xbox.control, 도움 요청');
            var agentID = '';
            var agentDN = '';
            var agentName = '';
            var callID = '';
            var customerPhone = '';
            var customerNumber = '';
            var adminID = '';
            var Requested = 'Y';
            xbox.request.cti.helpRequest(tenantPrefix, agentID, agentDN, agentName, callID, customerPhone, customerNumber, adminID, Requested, 'helpRequestCallback');
		}
		/**
        * 도움 요청 취소
        */
        function _helpRequest_Cancel(e) {
            xbox.util.log('xbox.control, 도움 요청 취소');
            var agentID = '';
            var agentDN = '';
            var agentName = '';
            var callID = '';
            var customerPhone = '';
            var customerNumber = '';
            var adminID = '';
            var Requested = 'N';
            xbox.request.cti.helpRequest(tenantPrefix, agentID, agentDN, agentName, callID, customerPhone, customerNumber, adminID, Requested, 'helpRequestCallback');
		}

        /**
        * 3자통화
        */
        function _conference(e) {
            xbox.util.log('xbox.control, 3자통화');
            xbox.request.cti.getAgentInfoList(tenantPrefix, '', 'agentInfoListCallback', 'conference');
        }
        /**
        * 3자통화 대화방 생성
        */
        function _conferenceCreate(e) {
            xbox.util.log('xbox.control, 3자통화 대화방 생성');
            e.preventDefault();
            var manager = xbox.model.callManager;
            xbox.request.cti.confCreateRoom(manager.externalInteractionId, 'confCreateRoomCallback');
        }
        /**
        * 3자통화 대화방 초대
        */
        function _conferenceInvite(e) {
            xbox.util.log('xbox.control, 3자통화 대화방 초대');
            e.preventDefault();
            var manager = xbox.model.callManager;
            xbox.request.cti.confAddParty(manager.conferenceId, manager.internalInteractionId, 'confAddPartyCallback');
        }
        /**
        * 3자통화 상담원 연결
        */
        function _conferenceMakeCall(e) {
            xbox.util.log('xbox.control, 3자통화 상담원 연결');
            e.preventDefault();
            var extention = xbox.util.id(INPUT_CONFERENCE_NUMBER).val();
            if (!extention) { alert('상담원을 선택하거나 전화번호를 입력하세요.'); return false; }
            xbox.request.cti.confMakeCall(extention, 'confMakeCallback');
        }
        /**
        * 3자통화 상담원 끊기
        */
        function _conferenceDisconnect(e) {
            xbox.util.log('xbox.control, 3자통화 상담원 끊기');
            e.preventDefault();
            var manager = xbox.model.callManager;
            xbox.request.cti.confDisconnect(manager.externalInteractionId, manager.internalInteractionId, 'confDisconnectCallback');
        }
        /**
        * 3자통화 창 닫기
        */
        function _conferenceClose(e) {
            xbox.util.log('xbox.control, 3자통화 창 닫기');
            e.preventDefault();
            xbox.util.id(MODAL_CONFERENCE).modal('hide');
        }

        /*
        *   클릭 이벤트 End
        *********************************************************/

        /**
        * Xbox 연동 시작
        */
        exports.start = function (url, tenantId, agentId, agentPwd) {
            xbox.util.log('xbox.control.start');

            this.startFlag = true;

            if (tenantId) { tenantPrefix = tenantId; }

            // xbox 연결            
            var data = {
                url: url,
                cti: {
                    tenantId: tenantId,
                    agentId: agentId,
					agentPwd: agentPwd
                },
                callback: 'startCallback'
            };            
            xbox.connect.open(data);
        };

        /**
        * Xbox 연동 종료
        */
        exports.end = function (flag) {
            xbox.util.log('xbox.control.end');

            if (xbox.connect.isopen()) {
                // CTI 로그아웃
                xbox.request.cti.authLogout();

                // CTI만 사용 못하도록 하는 경우
                this.startFlag = false;
                //상담원 상태 로그아웃 표시
                xbox.util.id(INPUT_AGENT_STATE).html('로그아웃');
                xbox.util.id(INPUT_AGENT_STATE).removeClass('workCase_call').addClass('workCase_default');
                xbox.util.id(INPUT_AGENT_STATE2).html('로그아웃');
                xbox.util.id(INPUT_AGENT_STATE2).removeClass('workCase_call').addClass('workCase_default');
                btnAgentStateDisabled(true, '');
                btnCallStateDisabled(true, '');
                btnCallFunctionDisabled(true, '');
                xbox.util.id(BUTTON_LOGIN).prop('disabled', false);
                xbox.util.id(BUTTON_LOGOUT).prop('disabled', true);
            } else {
                if (xbox.util.parseBool(flag)) {
                	console.log('CIC 연결의 문제가 발생하였습니다.');
//                	alert('CIC 연결의 문제가 발생하였습니다.');
                }                
            }
            logout();
        };
        
        /**
         * kw---20240223 : 녹취 키 들어오면 바로 업데이트 할 수 있도록 기능 추가
         * 녹취 키가 오면 DB 업데이트
        */
        
        exports.recordUpdate = function(data) {
        	xbox.util.log('xbox.control, recordUpdate : ' + data.state);
        	
        	var recordItem = data.call;
        	var callDirection = '';
        	var dnis = '';
        	
            //인바운드 I , 아웃바운드O
            if ( recordItem.callDirection == "I") {
            	callDirection = "1"
        		cntcPathCd = "10"
            }else if ( recordItem.callDirection == "O" ) {
            	callDirection = "2"
        		cntcPathCd = outCntcPathCd
            }
            if ( recordItem.telNumber != recordItem.remote ) {
            	cntcPathCd = "11";
            }
            
            
            if (recordItem.dnis == null) {
            	dnis = "";
            } else {
            	dnis = recordItem.dnis;
            }
            
            if(!Utils.isNull(recordItem.recordId)){
            	var CNSL100_data = {
                		"tenantId" : GLOBAL.session.user.tenantId,
        				"usrId" : GLOBAL.session.user.usrId,
        				"orgCd" : GLOBAL.session.user.orgCd,
        				"state" : "recordUpdate",
                		"telNumber" : recordItem.remote, //전화번호
                		"interactionId" : recordItem.interactionId, //CallID
                		"recordId"	: recordItem.recordId, //recordId
                		"cntcPathCd" : cntcPathCd,
                		"callDirection" : callDirection,
                		"dnis" : dnis,
                		"serviceCode" : recordItem.serviceCode,
                		"cabackAcpnNo"  : cabackAcpnNo,
                		"ctiAgenId" : GLOBAL.session.user.ctiAgenId,
                		"cntcCustId" : custId,
                		"cntcCustNm" : custNm,
                		"sttUseYn" : GLOBAL.session.user.sttUseYn,
                	};
                    
                console.log(":::::::::::::::::::::::::::::: alwdkjawhdkjawhdkjawhd");
                console.log(CNSL100_data);
                
            	var CNSL100_jsonStr = JSON.stringify(CNSL100_data);
            	
            	//kw---20240502 : 녹취키 업데이트 - xbox 오류로 인해 잠시 주석
            	Utils.ajaxCall("/cnsl/CNSL100INS01", CNSL100_jsonStr , function(){
            		logToFile('녹취 정보 DB에 업데이트(recordUpdate)  : {'
                			+ '"recordId" : "' 		+ recordItem.recordId		+ '"'
                			+ '}'
            		,'','','req');
            	});
            } else {
            	logToFile('녹취 정보 DB에 업데이트 실패 - 녹취키가 없음(recordUpdate)  : {'
            			+ '"recordId" : "' 		+ recordItem.recordId		+ '"'
            			+ '}'
        		,'','','req');
            }
            
            
        }

        /**
        * 콜 컨트롤을 리셋 시킵니다. 만약 start() 함수가 호출되지 않았다면 수행되지 않습니다.
        * @param {String} state 상담원 상태
        */
        exports.reset = function (state) {
            xbox.util.log('xbox.control.reset - state=' + state);

            // start() 함수가 호출되지 않으면 리셋을 수행하지 않는다.
            if (!this.startFlag) { return false; }
            
            xbox.util.id(INPUT_AGENT_STATE).html('');
            xbox.util.id(INPUT_CONTACT_NUMBER).val('');
            xbox.util.id(INPUT_TARGET_NUMBER).val('');
            xbox.util.id(INPUT_STATUS_MESSAGE).val('');

            btnAgentStateDisabled(false, '');      // 상담원 상태 버튼 활성화
            btnCallStateDisabled(true, '');           // 콜 상태 버튼 비활성화
            btnCallFunctionDisabled(false, '');     // 콜 기능 버튼 활성화
            
            xbox.util.id(BUTTON_LOGIN).prop('disabled', true);
            xbox.util.id(BUTTON_LOGOUT).prop('disabled', false);
            xbox.util.id(BUTTON_DISCONNECT).prop('disabled', true);
            xbox.util.id(BUTTON_PICKUP).prop('disabled', true);

            //callManager 초기화
            xbox.model.callManager.clear();

            // state 값이 유효하지 않다면 '기타업무'
            var state = state || STATE_TASK;
            xbox.request.cti.setAgentStatus(state, 'OnAgentStatusChanged');
        };

        /**
        * 전화번호 표시
        * @param {String} telNumber 전화번호
        */
        exports.setTelNumber = function (telNumber) {
            xbox.util.log('xbox.control.reset - telNumber=' + telNumber);
            var telNumberReplaced = '';

            if (telNumber.length > 0) {
                telNumberReplaced = xbox.util.replaceAll(telNumber, /-/g, '');
            }
            xbox.util.id(INPUT_TARGET_NUMBER).val(telNumberReplaced);
        };

        /**
        * 상담원 상태 변경
        */
        exports.setAgentState = function (state) {
            xbox.util.log('xbox.control.setAgentState - state=' + state);
            xbox.request.cti.setAgentStatus(state, 'OnAgentStatusChanged');
        };

        /**
        * CTI 로그인 창 열기
        */
        exports.ctiLoginOpen = function () {
            
        };

        /**
        * CTI 로그인 창 닫기
        */
        exports.ctiLoginClose = function () {
            

        };

        /**
        * 녹취 고객 정보 입력
        */
        exports.sendExtendInfo = function (data) {
            xbox.util.log('xbox.control.sendExtendInfo - data=' + xbox.util.objectToJson(data));
            xbox.request.record.sendExtendInfo(data, 'sendExtendInfoCallback');
        };

        /**
        * 녹취 재생
        */
        exports.recordPlay = function (recordId) {
            xbox.util.log('xbox.control.recordPlay - recordId=' + recordId);
            xbox.request.record.recordPlay(recordId, 'recordPlayCallback');
        };

        /* Event 콜백 Start *****************************************************/

        /**
        * 세션 상태 변경를 변경합니다.
        * @param {String} state 서버 상태
        */
        function callbackConnectionStateChanged(data) {
            xbox.util.log('xbox.control, connectionStateChanged : ' + data.state);

            switch (data.state.toLowerCase()) {
                case 'up':
                    break;

                case 'down':
                    alert('상담APP가 로그아웃 되었습니다.');
                    logout();
                    break;

                    // SwitchOver 상태일 때는 사이트 접속을 종료하고 로그인 페이지로 이동한다.                                                                                                                                                  
                case 'switchover':
                    alert('상담APP 세션이 종료 되어 로그아웃되었습니다.');
                    logout();
                    break;
            }
        };
        /**
        * 로그아웃
        */
        function logout() {
            xbox.util.log('xbox.control.logout');
        	xbox.connect.close();
        }

        /**
        * 상담원 상태를 변경합니다.
        * @param {String} state 상담원 상태명
        * (수신대기, 식사, 휴식, 교육, 회의, 기타업무, IN-통화중, OUT-통화중, 후처리)
        */
        function callbackAgentStatusChanged(data) {
        	
        	
            xbox.util.log('xbox.control, callbackAgentStatusChanged - ' + data.flag + ', ' + data.state);
            $(".icoCnt").each(function(){
        		$(this).removeClass("selected")
        	})
        	
        	//kw---20240409 : 수화기로 전화를 받았을 경우 자동 pickup 상태가 되도록 기눙 수정
        	if(data.state == STATE_CALLING_IN){
        		var modalElement = $("#modalAlertCall");
				var isModalVisible = modalElement.is(":visible");
				if (isModalVisible) {
					pickupPhone = true;
					receivePhonePickup();
					//수화기로 전화 받기
				}
        	}
            
            if (!xbox.util.parseBool(data.flag)) {
                xbox.util.log('xbox.control.agentStateChanged - 상담원 상태 변경 실패');
                alert('Error: 상담원 상태 변경 실패 - ' + data.state);
                return false;
            }

            // '후처리' 상태로 변경됐다면 모든 콜 버튼 비활성화
            if (data.state == STATE_FOLLOW_UP) {
                xbox.util.id(INPUT_AGENT_STATE).html(STATE_FOLLOW_UP);
                xbox.util.id(INPUT_AGENT_STATE2).html(STATE_FOLLOW_UP);
                btnAgentStateDisabled(false, '');
                btnCallStateDisabled(true, '');
                btnCallFunctionDisabled(true, '');
                return false;
            }
            xbox.util.id(INPUT_AGENT_STATE).html(data.state);//상담원 상태 화면에 출력
            
            const nowState = data.state;
            switch (nowState) {
	            default:
	            	xbox.util.id(INPUT_AGENT_STATE).removeClass('workCase_default').addClass('workCase_call');
	            	xbox.util.id(INPUT_AGENT_STATE2).removeClass('workCase_default').addClass('workCase_call');
	            	break;
            }
            
            let INPUT_AGENT_STATE_HTML = '';
            switch (nowState) {
            	case 'IN-통화중':
	        		INPUT_AGENT_STATE_HTML = '<span>IN<br>통화중</span>';
					break;
            	case 'OUT-통화중':
            		//kw---20240408 : OUTBound 전화 연결 시 상태 문구 변경 (전화걸기 눌렀을 경우 : OUT 통화중(발신중), 전화 연결중 : OUT 통화중(발신중))
//	        		INPUT_AGENT_STATE_HTML = '<span>OUT<br>통화중</span>';
	        		INPUT_AGENT_STATE_HTML = '<span>OUT<br>통화중<br><span style="font-size: 11px; margin-top: -5px;">(발신중)</span></span>';
					break;
            	case '기타업무':
	        		INPUT_AGENT_STATE_HTML = '<span>기타<br>업무</span>';
					break;
            	case '보류후연결':
	        		INPUT_AGENT_STATE_HTML = '<span>보류후<br>연결</span>';
					break;
	        	default :
	        		INPUT_AGENT_STATE_HTML = data.state;
	        		break;
	        }
	        xbox.util.id(INPUT_AGENT_STATE2).html(INPUT_AGENT_STATE_HTML);//상담원 상태 화면에 출력
	        
	        
            
            // 상담원 상태가 변경된 것이라면 콜 기능 버튼 설정
            if (data.state == STATE_ALERTING || data.state == STATE_SENDING || data.state == STATE_SENDING_OUT) {
                return false;
            }
            if (data.state == STATE_CALLING_IN || data.state == STATE_CALLING_OUT) {
            	btnCallFunctionDisabled(true, BUTTON_PICKUP);
                btnCallStateDisabled(false, '');
                return false;
            }
            
            btnAgentStateDisabled(data.state == STATE_WAIT, BUTTON_WAIT);
            btnAgentStateDisabled(data.state == STATE_TASK, BUTTON_TASK);
            btnAgentStateDisabled(data.state == STATE_REST, BUTTON_REST);
            btnAgentStateDisabled(data.state == STATE_LUNCH, BUTTON_LUNCH);

            if (data.state.indexOf(STATE_CALLING) > 0) {
                btnCallStateDisabled(false, '');
                btnCallFunctionDisabled(false, BUTTON_DISCONNECT);
            }

            btnCallFunctionDisabled(data.state == STATE_WAIT, BUTTON_MAKE_CALL);
        };

        /**
        * 콜 상태 변경를 변경합니다.
        * @param {String} state 콜 상태
        */
        
        var callbackCallStateChangedData;
        var cntcPathCd = '';
        
        
        function callbackCallStateChanged(data) {
        	callbackCallStateChangedData = data;
        	if ( callbackCallStateChangedData.state == "Connected") {
        		nowCallId = callbackCallStateChangedData.call.interactionId;
        	}
            xbox.util.log('xbox.control, callbackCallStateChanged : ' + data.state);
            $("#callState").html(data.state);
            var callDirection = '';
            
            //kw---20240426 : 벨울림 상태에서 상태값을 변경 할 수 없도록 기능 추가
            callBackState = callbackCallStateChangedData.state;
        	
            //인바운드 I , 아웃바운드O
            if ( callbackCallStateChangedData.call.callDirection == "I") {
            	callDirection = "1"
        		cntcPathCd = "10"
            }else if ( callbackCallStateChangedData.call.callDirection == "O" ) {
            	callDirection = "2"
        		cntcPathCd = outCntcPathCd
            }
            if ( callbackCallStateChangedData.call.telNumber != callbackCallStateChangedData.call.remote ) {
            	cntcPathCd = "11";
            }
            var dnis = '';
            if (callbackCallStateChangedData.call.dnis == null) {
            	dnis = "";
            } else {
            	dnis = callbackCallStateChangedData.call.dnis;
            }
            
          //kw---20240409 : 아웃바운드 시 고객목록 팝업 추가
            var outCustId = '';
        	var outCustNm = '';
        	if(outBoundType == 'beforPop'){
        		if(callbackCallStateChangedData.call.callDirection == "O" && callbackCallStateChangedData.state == "Proceeding"){
                	outCustId = custId;
                	outCustNm = custNm;
                }
        	}
        	
        	//kw---20240423 : 양지검진으로 인한 예약시 접수번호 넣기
        	var inCustAcpnNo = '';
        	if(!Utils.isNull(custAcpnNo)){
        		inCustAcpnNo = custAcpnNo;
        	}
            
            
            var CNSL100_data = {
        		"tenantId" : GLOBAL.session.user.tenantId,
				"usrId" : GLOBAL.session.user.usrId,
				"orgCd" : GLOBAL.session.user.orgCd,
        		"state" : callbackCallStateChangedData.state, //상태
        		"telNumber" : callbackCallStateChangedData.call.remote, //전화번호
        		"interactionId" : callbackCallStateChangedData.call.interactionId, //CallID
        		"recordId"	: callbackCallStateChangedData.call.recordId, //recordId
        		"cntcPathCd" : cntcPathCd,
        		"callDirection" : callDirection,
        		"dnis" : dnis,
        		"serviceCode" : callbackCallStateChangedData.call.serviceCode,
        		"cabackAcpnNo"  : cabackAcpnNo,
        		"ctiAgenId" : GLOBAL.session.user.ctiAgenId,
        		"cntcCustId" : custId,
        		"cntcCustNm" : custNm,
        		"sttUseYn" : GLOBAL.session.user.sttUseYn,
        		"outCustId" : outCustId,
        		"outCustNm" : outCustNm,
        		"custAcpnNo" : inCustAcpnNo,			//kw---20240423 : 양지검진으로 인한 예약시 접수번호 넣기
        	};
            
            console.log("::::::::::::::::::::::: CNSL100_data");
            console.log(CNSL100_data);
            
            if ( callbackCallStateChangedData.call.process == "transfer" ) {
            	return;
            }
        	var CNSL100_jsonStr = JSON.stringify(CNSL100_data);
        	Utils.ajaxCall("/cnsl/CNSL100INS01", CNSL100_jsonStr ,CNSL100_fnCallBackReulst);
        };
        
        function CNSL100_fnCallBackReulst(result) {
        	var CNSLTYPE = frme_head_CMS[0].substring(frme_head_CMS[0].length - 8, frme_head_CMS[0].length - 3);
//        	var CNSLTYPE = "CNSL" + tabFrmCnslCallId.substr(0,1);

            if(CNSLTYPE == "CNSL3"){
                CNSLTYPE = "CNSL2";
            }
        	
        	switch (callbackCallStateChangedData.state) {
	            case 'Alerting':
	                onCallAlerting(callbackCallStateChangedData.call);
	                break;
	
	            case 'Proceeding':
	            	if ( window['set' + CNSLTYPE + '02SEL01'] ) {
	        			new Function ( 'set' + CNSLTYPE + '02SEL01()')()
	        		}
	                onCallProceeding();
	                break;
	            case 'Connected':
	            	
	            	//kw---20240223 : 전화받기 팝업창 글로벌 옵션 필터 적용
	            	if(softCallPopGridBool == true){
	            		//kw---20240222 : 콜팝업에서 고객정보 그리드로 고객 선택 추가
	            		cnslFirstConnected = true;
	            	}
	            	
	            	xbox.util.id(BUTTON_LOGOUT).prop('disabled', true);
	            	cnslState = 'Connected';
            		if ( window[CNSLTYPE + '13BtnMode'] ) {
	        			new Function ( CNSLTYPE + '13BtnMode("' +cnslState+ '")')()
	        		}
            		if ( window[CNSLTYPE + '00MTabClick'] ) {
	        			new Function ( CNSLTYPE + '00MTabClick("/bcs/cnsl/' +CNSLTYPE+ '01T")')()
	        		}
            		if ( window['load' + CNSLTYPE + '01SEL01'] ) {
	        			new Function ( 'load' + CNSLTYPE + '01SEL01()')()
	        		}
	            	
	                onCallConnected(callbackCallStateChangedData.call, callbackCallStateChangedData.state);
	                resetClock();
	                startClock();
	                if (!$(".btVerticalExtend").hasClass("Contracts")) {
	                	$(".btVerticalExtend").click();
	                }
	                
	                fnRecorGetApi(callbackCallStateChangedData);
	                
	                break;
	
	            case 'Disconnect':
	            	xbox.util.id(BUTTON_LOGOUT).prop('disabled', false);
	            	$("#btnHold span").html("보류");
	                $("#btnMute span").html("음소거");
	            	cnslState = 'Disconnect';
	            	if ( window['set' + CNSLTYPE + '13SEL01'] ) {
	        			new Function ( 'set' + CNSLTYPE + '13SEL01("' +cnslState+ '")')()
	        		}
	            	outCntcPathCd = '60';
	            	cabackAcpnNo = '';
	            	if ( window['load' + CNSLTYPE + '01SEL01'] ) {
	        			new Function ( 'load' + CNSLTYPE + '01SEL01()')()
	        		}
	            	
	                onCallDisconnect(callbackCallStateChangedData.call);
	                $(".phoneFrame #serviceName").html('');
		            $(".phoneFrame #custId").html('');
		            popSource.close();
		            stopClock();
		            xbox.request.cti.setAgentStatus("후처리");
		            if ( window[CNSLTYPE + '00MTabClick'] ) {
	        			new Function ( CNSLTYPE + '00MTabClick("/bcs/cnsl/' +CNSLTYPE+ '13T")')()
	        		}
		            
		            fnRecorGetApi(callbackCallStateChangedData);
		            
	                break;
	            case 'Held':
	                onCallHeld();
	                break;
	        }
        	
        	//kw---20240404 : 양지검진 - 상담이력 또는 콜 이벤트 관련 정보 인터페이스 넘기기
            if(softPhoneAfterEvent == true){
            	if ( window['fnCallResultAfterSend' + tabFrmId] ) {
            		//fnCallResultAfterSendYJGB(_state, _rsvYn, _callState)
            		//_state : 접촉결과, _rsvYn : 예약 여부, _callType : I/O 구분, _callState : 콜 상태
        			new Function ( 'fnCallResultAfterSend' + tabFrmId + 
        					'(\"' + "" + 
        					'\", \"' + "" +
        					'\", \"' + callbackCallStateChangedData.call.callDirection + 
        					'\", \"' + callbackCallStateChangedData.state + 
        					'\")')();
        		}
            }
        }
        /* Event 콜백 End *****************************************************/
        
        //kw---20240502 : 녹취키 인터페이스 함수 추가
        function fnRecorGetApi(_callbackCallStateChangedData){
        	
        	return;
        	
        	//kw---20240502 : 녹취키 가져오기 잠시 대기
        	
        	var state		= _callbackCallStateChangedData.state;
        	var callType 	= _callbackCallStateChangedData.call.callDirection;
        	var telNum		= _callbackCallStateChangedData.call.remote;
        	
        	var apiPath = '';
        	
        	var now = new Date();
        	
        	if(state == "Disconnect"){
        		
        		if(Utils.isNull(recordStartTime)){
        			return;
        		}
        		now.setSeconds(now.getSeconds() - 3);
        		apiPath = 'GetCallKeyByDateTime';
        	} else {
        		apiPath = 'GetCallKey';
        	}
            
            var year = now.getFullYear();
            var month = String(now.getMonth() + 1).padStart(2, '0');
            var day = String(now.getDate()).padStart(2, '0');
            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');
            
            var nowTime = year + month + day + hours + minutes + seconds;
            
            var aniNo = '';
            var dnisNo = '';
            
            if(callType == "I"){
            	aniNo 	= telNum;
            	dnisNo	= GLOBAL.session.user.extNo;
            } else {
            	aniNo	= GLOBAL.session.user.extNo;
            	dnisNo	= telNum;
            }
            
            var bonaType = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 32)
            
        	let param = {
        			"AUTH_KEY":"x51L8wR1NwL0L0HcbAUb5bPq+pi87JOGt33FwXjOmkI=",
        			"TENANT_PREFIX": GLOBAL.session.user.tenantId,
        			"OPERATION" : "SELECT",
        			"AGENT_ID": GLOBAL.session.user.ctiAgenId,
        			"AGENT_DN" : GLOBAL.session.user.extNo,
        			"ANI_NO": aniNo,
        			"DNIS_NO" : dnisNo,
        			"SEARCH_TIME" : recordStartTime,
        			"BONAType"		: bonaType.bsVl1,
        	};
        	
        	Utils.ajaxCall("/SoftPhone/" + apiPath, JSON.stringify(param), function (result) {
                
                var recordkey = result.result.RESULT_LIST[0].CallKey;
                recordStartTime = result.result.RESULT_LIST[0].startTime;
                
                if(!Utils.isNull(recordkey)){
                	var CNSL100_data = {
                    		"tenantId" : GLOBAL.session.user.tenantId,
            				"usrId" : GLOBAL.session.user.usrId,
            				"orgCd" : GLOBAL.session.user.orgCd,
            				"state" : "recordUpdate",
                    		"telNumber" : _callbackCallStateChangedData.call.remote, //전화번호
                    		"interactionId" : _callbackCallStateChangedData.call.interactionId, //CallID
                    		"recordId"	: recordkey, //recordId
                    		"cntcPathCd" : '',
                    		"callDirection" : '',
                    		"dnis" : '',
                    		"serviceCode" : '',
                    		"cabackAcpnNo"  : '',
                    		"ctiAgenId" : GLOBAL.session.user.ctiAgenId,
                    		"cntcCustId" : custId,
                    		"cntcCustNm" : custNm,
                    		"sttUseYn" : GLOBAL.session.user.sttUseYn,
                    	};
                }
                
            	
                
            	var CNSL100_jsonStr = JSON.stringify(CNSL100_data);
            	
//            	//kw---20240502 : 녹취키 업데이트 - xbox 오류로 인해 잠시 주석
//            	Utils.ajaxCall("/cnsl/CNSL100INS01", CNSL100_jsonStr , function(){
//            		logToFile('녹취 정보 DB에 업데이트 API (fnRecorGetApi)  : {'
//                			+ '"recordId" : "' 		+ recordkey		+ '"'
//                			+ '}'
//            		,'','','req');
//            	});
            	
            });
        	
        }

        /* callbackCallStateChanged에서 사용함 S **********************************************/
        /**
        *   벨울림
        * @param {Object} call 콜 정보
        */
        function onCallAlerting(call) {
            xbox.util.log('xbox.contorl.callStateChanged onCallAlerting()');

            xbox.util.id(INPUT_AGENT_STATE).html(STATE_ALERTING);
            xbox.util.id(INPUT_AGENT_STATE2).html(STATE_ALERTING);
            btnCallFunctionDisabled(false, BUTTON_DISCONNECT);
            btnCallFunctionDisabled(false, BUTTON_PICKUP);
            
            //전화 팝업(사용자 정의)
            exports.message('전화 왔습니다. - InteractionId : ' + call.interactionId + ', ServiceCode : ' + call.serviceCode + ', Type : ' + call.callType);
            if (typeof alertingView === 'function') {
                alertingView('show', call);
            }
        }

        /**
        * 전화연결(보류 해제)
        * @param {Object} call 콜 정보
        * @param {Object} state 콜 상태
        */
        function onCallConnected(call, state) {
            xbox.util.log('xbox.contorl.callStateChanged onCallConnected()');
            
            var tel = call.remote;
//            xbox.util.id(INPUT_CONTACT_NUMBER).val(tel); // 상대 전화번호
            
            
            //고객인지 아닌지 조회
//            xbox.util.id(INPUT_CONTACT_NUMBER).html('미등록고객 ' + tel); // 상대 전화번호
            
            btnAgentStateDisabled(true, ''); // 상담원 상태 버튼 비활성화
            btnCallStateDisabled(false, ''); // 콜 상태 버튼 활성화
            btnCallFunctionDisabled(true, BUTTON_MAKE_CALL);
            btnCallFunctionDisabled(false, BUTTON_DISCONNECT);

            var agentState = call.callDirection == 'I' ? STATE_CALLING_IN : STATE_CALLING_OUT;
            xbox.request.cti.setAgentStatus(agentState, (state == 'ConnectedAfterHeld' ? 'OnAgentStatusChanged' : null));
        }

        /**
        * 전화끊기
        * @param {Object} call 콜 정보
        */
        function onCallDisconnect(call) {
            xbox.util.log('xbox.contorl.callStateChanged onCallDisconnect()');
            
            var manager = xbox.model.callManager;
            //manager.remove(call.interactionId);
            if (manager.transferInteractionId == call.interactionId) {
                manager.transferInteractionId = '';
            } else {
                xbox.request.cti.setAgentStatus(STATE_FOLLOW_UP);
                exports.message('전화가 끊겼습니다.');

                //전화 팝업 닫기(사용자 정의)
                if (typeof alertingView === 'function') {
                    alertingView('hide');
                }
            }
        }

        /**
        *   발신중
        */
        function onCallProceeding() {
            xbox.util.log('xbox.contorl.callStateChanged onCallProceeding()');
           
            //kw---20240408 : OUTBound 전화 연결 시 상태 문구 변경 (전화걸기 눌렀을 경우 : OUT 통화중(발신중), 전화 연결중 : OUT 통화중(발신중))
            if(Utils.isNull(nowCallId)){
            	 xbox.util.id(INPUT_AGENT_STATE).html(STATE_SENDING_OUT);
                 xbox.util.id(INPUT_AGENT_STATE2).html(STATE_SENDING_OUT);
	        } else {
	        	 xbox.util.id(INPUT_AGENT_STATE).html(STATE_SENDING);
	             xbox.util.id(INPUT_AGENT_STATE2).html(STATE_SENDING);
	        }
            
            btnCallFunctionDisabled(false, BUTTON_DISCONNECT); // 끊기 버튼 활성화
            btnAgentStateDisabled(true, ''); // 상담원 상태 버튼 비활성화
        }

        /**
        * 보류
        */
        function onCallHeld() {
            xbox.util.log('xbox.contorl.callStateChanged onCallHeld()');
//            xbox.util.id(INPUT_AGENT_STATE).html(STATE_HOLD);
//            xbox.util.id(INPUT_AGENT_STATE2).html(STATE_HOLD);
        }
        /* callStateChanged에서 사용함 E **********************************************/


        /* 콜버튼 활성 / 비활성 S *****************************************************/
        
        /**
        * 콜버튼중 대기, 업무, 온라인, 휴식, 식사 상태의 버튼을 처리한다.
        * @param {Boolean} disabled 비활성 여부
        * @param {String} id 버튼 아이디
        */
        function btnAgentStateDisabled(disabled, id) {
            disabled = disabled || false;
            switch (id) {
                case BUTTON_WAIT:
                    xbox.util.id(BUTTON_WAIT).prop('disabled', disabled);
                    break;
                case BUTTON_TASK:
                    xbox.util.id(BUTTON_TASK).prop('disabled', disabled);
                    break;
                case BUTTON_REST:
                    xbox.util.id(BUTTON_REST).prop('disabled', disabled);
                    break;
                case BUTTON_LUNCH:
                    xbox.util.id(BUTTON_LUNCH).prop('disabled', disabled);
                    break;
                default:
                    xbox.util.id(BUTTON_WAIT).prop('disabled', disabled);
                    xbox.util.id(BUTTON_TASK).prop('disabled', disabled);
                    xbox.util.id(BUTTON_REST).prop('disabled', disabled);
                    xbox.util.id(BUTTON_LUNCH).prop('disabled', disabled);
                    break;
            }
        }
        
        /**
        * 콜버튼중 보류, 음소거, 호전환, 3자통화 버튼을 처리한다.
        * @param {Boolean} disabled 비활성 여부
        * @param {String} id 버튼 아이디
        */
        function btnCallStateDisabled(disabled, id) {
            disabled = disabled || false;
            switch (id) {
                case BUTTON_HOLD:
                    xbox.util.id(BUTTON_HOLD).prop('disabled', disabled);
                    break;
                case BUTTON_MUTE:
                    xbox.util.id(BUTTON_MUTE).prop('disabled', disabled);
                    break;
                case BUTTON_TRANSFER:
                    xbox.util.id(BUTTON_TRANSFER).prop('disabled', disabled);
                    break;
                case BUTTON_CONFERENCE:
//                  3자통화 개발 완료시 주석해제
//                  xbox.util.id(BUTTON_CONFERENCE).prop('disabled', disabled);
                    xbox.util.id(BUTTON_CONFERENCE).prop('disabled', true);
                    break;
                default:
                    xbox.util.id(BUTTON_HOLD).prop('disabled', disabled);
                    xbox.util.id(BUTTON_MUTE).prop('disabled', disabled);
                    xbox.util.id(BUTTON_TRANSFER).prop('disabled', disabled);
//                  3자통화 개발 완료시 주석해제
//                  xbox.util.id(BUTTON_CONFERENCE).prop('disabled', disabled);
                    xbox.util.id(BUTTON_CONFERENCE).prop('disabled', true);
                    break;
            }
        }

        /**
        * 콜버튼중 걸기, 끊기 버튼을 처리한다.
        * @param {Boolean} disabled 비활성 여부
        * @param {String} id 버튼 아이디
        */
        
        function btnCallFunctionDisabled(disabled, id) {
            disabled = disabled || false;
            switch (id) {
                case BUTTON_MAKE_CALL:
                    xbox.util.id(BUTTON_MAKE_CALL).prop('disabled', disabled);
                    xbox.util.id('ctiResponseMessage').prop('disabled', disabled);
                    break;
                case BUTTON_DISCONNECT:
                    xbox.util.id(BUTTON_DISCONNECT).prop('disabled', disabled);
                    break;
                case BUTTON_PICKUP:
                    xbox.util.id(BUTTON_PICKUP).prop('disabled', disabled);
                    break;
                default:
                    xbox.util.id(BUTTON_MAKE_CALL).prop('disabled', disabled);
                    xbox.util.id(BUTTON_DISCONNECT).prop('disabled', disabled);
                    xbox.util.id(BUTTON_PICKUP).prop('disabled', disabled);
                    break;
            }
        }
        /* 콜버튼 활성 / 비활성 E *****************************************************/


        /**
        * 호전환 버튼 활성 / 비활성
        * @param {Boolean} disabled 활성 여부
        * @param {String} id 버튼 아이디
        */
        exports.transferButtonChange = function(id) {
            xbox.util.id(BUTTON_TRANSFER_CONNECT, MODAL_TRANSFER).prop('disabled', true);
            xbox.util.id(BUTTON_TRANSFER_CANCEL, MODAL_TRANSFER).prop('disabled', true);
            xbox.util.id(BUTTON_TRANSFER_COMPLETE, MODAL_TRANSFER).prop('disabled', true);
            xbox.util.id(BUTTON_TRANSFER_DIRECT, MODAL_TRANSFER).prop('disabled', true);
            switch (id) {
                case 'CONNECT':
                    xbox.util.id(BUTTON_TRANSFER_CANCEL, MODAL_TRANSFER).prop('disabled', false);
                    xbox.util.id(BUTTON_TRANSFER_COMPLETE, MODAL_TRANSFER).prop('disabled', false);
                    break;
                default:
                    xbox.util.id(BUTTON_TRANSFER_CONNECT, MODAL_TRANSFER).prop('disabled', false);
                    xbox.util.id(BUTTON_TRANSFER_DIRECT, MODAL_TRANSFER).prop('disabled', false);
                    break;
            }
        }

        /**
        * 3자통화 버튼 활성 / 비활성
        * @param {Boolean} disabled 활성 여부
        * @param {String} id 버튼 아이디
        */
        exports.conferenceButtonChange = function (id) {
            xbox.util.id(BUTTON_CONFERENCE_CREATE, MODAL_CONFERENCE).prop('disabled', true);
            xbox.util.id(BUTTON_CONFERENCE_INVITE, MODAL_CONFERENCE).prop('disabled', true);
            xbox.util.id(BUTTON_CONFERENCE_MAKECALL, MODAL_CONFERENCE).prop('disabled', true);
            xbox.util.id(BUTTON_CONFERENCE_DISCONNECT, MODAL_CONFERENCE).prop('disabled', true);
            xbox.util.id(BUTTON_CONFERENCE_CLOSE, MODAL_CONFERENCE).prop('disabled', true);

            switch (id) {
                case 'CREATE':
                    xbox.util.id(BUTTON_CONFERENCE_MAKECALL, MODAL_CONFERENCE).prop('disabled', false);
                    break;
                case 'INVITE':
                    xbox.util.id(BUTTON_CONFERENCE_CLOSE, MODAL_CONFERENCE).prop('disabled', false);
                    break;
                case 'MAKECALL':
                    xbox.util.id(BUTTON_CONFERENCE_INVITE, MODAL_CONFERENCE).prop('disabled', false);
                    xbox.util.id(BUTTON_CONFERENCE_DISCONNECT, MODAL_CONFERENCE).prop('disabled', false);
                    break;
                case 'DISCONNECT':
                    xbox.util.id(BUTTON_CONFERENCE_MAKECALL, MODAL_CONFERENCE).prop('disabled', false);
                    xbox.util.id(BUTTON_CONFERENCE_CLOSE, MODAL_CONFERENCE).prop('disabled', false);
                    break;
                default:
                    xbox.util.id(BUTTON_CONFERENCE_CREATE, MODAL_CONFERENCE).prop('disabled', false);
                    xbox.util.id(BUTTON_CONFERENCE_CLOSE, MODAL_CONFERENCE).prop('disabled', false);
                    break;
            }
        }

        /**
        * 모니터링
        */
        exports.monitoring = function (data) {
            xbox.util.log('xbox.contorl.monitoring - ' + xbox.util.objectToJson(data));

            xbox.util.id(MONITOR_WATE_CALL_COUNT).text('0');
            xbox.util.id(MONITOR_INTERACTION_PERCENT).text('0%');
            xbox.util.id(MONITOR_AGENT_AVAILABLE).text('0');
            xbox.util.id(MONITOR_ENTER_CALL_COUNT).text('0');
//            xbox.util.id(MONITOR_ANSWERED_CALL_COUNT).text('0');
//            xbox.util.id(MONITOR_ABANDONED_CALL_COUNT).text('0');
            if (data) {
                xbox.util.id(MONITOR_WATE_CALL_COUNT).text(data.WaitingCallCount);
                if ( data.InteractionPercent == "NaN") {
                	xbox.util.id(MONITOR_INTERACTION_PERCENT).text('0%');
                } else {
                	xbox.util.id(MONITOR_INTERACTION_PERCENT).text(data.InteractionPercent);
                }
                xbox.util.id(MONITOR_AGENT_AVAILABLE).text(data.AgentAvailable);
                xbox.util.id(MONITOR_ENTER_CALL_COUNT).text(data.EnterCallCount);
//                xbox.util.id(MONITOR_ANSWERED_CALL_COUNT).text(data.AnsweredCallCount);
//                xbox.util.id(MONITOR_ABANDONED_CALL_COUNT).text(data.AbandonedCallCount);
            }
        };

        var _timer;
        /**
        * 메시지 출력
        */
        exports.message = function (message, error) {
            if (xbox.util.idExists(INPUT_STATUS_MESSAGE)) {
                var $message = xbox.util.id(INPUT_STATUS_MESSAGE);
                if ($message.hasClass('alert-danger')) {
                    $message.removeClass('alert-danger').addClass('alert-success');
                }
                if (error || false) {
                    if ($message.hasClass('alert-success')) {
                        $message.removeClass('alert-success').addClass('alert-danger');
                    }
                }
                xbox.util.id(INPUT_STATUS_MESSAGE).text(message);
                clearTimeout(_timer);
                _timer = setTimeout(function () { xbox.util.id(INPUT_STATUS_MESSAGE).empty(); }, 3000);
            }
        };


        /* EventTarget Start *****************************************************/

        /**
        * 이벤트 명칭
        */
        var _eventNames = {
            AgentStateChanged: 'AgentStateChanged',
            CallStateChanged: 'CallStateChanged',
            ConnectionStateChanged: 'ConnectionStateChanged',
            RecordInfoChanged: 'RecordInfoChanged'
        };

        /**
        * 상담원 상태 변경 이벤트 등록
        */
        exports.addAgentStateChanged = function (handler) {
            xbox.util.log('eventTarget.addEventListener : ' + _eventNames.AgentStateChanged);
            eventTarget.addEventListener(_eventNames.AgentStateChanged, handler);
        };
        /**
        * 상담원 상태 변경 이벤트 제거
        */
        exports.removeAgentStateChanged = function (handler) {
            xbox.util.log('eventTarget.removeEventListener : ' + _eventNames.AgentStateChanged);
            eventTarget.removeEventListener(_eventNames.AgentStateChanged, handler);
        };
        /**
        * 상담원 상태 변경 이벤트 실행
        */
        exports.fireAgentStateChanged = function (data) {
            eventTarget.dispatchEvent({ type: _eventNames.AgentStateChanged, data: data });
        };

        /**
        * 콜 상태 변경 이벤트 등록
        */
        exports.addCallStateChanged = function (handler) {
            xbox.util.log('eventTarget.addEventListener : ' + _eventNames.CallStateChanged);
            eventTarget.addEventListener(_eventNames.CallStateChanged, handler);
        };
        /**
        * 콜 상태 변경 이벤트 제거
        */
        exports.removeCallStateChanged = function (handler) {
            xbox.util.log('eventTarget.removeEventListener : ' + _eventNames.CallStateChanged);
            eventTarget.removeEventListener(_eventNames.CallStateChanged, handler);
        };
        /**
        * 상담원 상태 변경 이벤트 실행
        */
        exports.fireCallStateChanged = function (data) {
            eventTarget.dispatchEvent({ type: _eventNames.CallStateChanged, data: data });
        };

        /**
        * 서버 접속 상태 변경 이벤트 등록
        */
        exports.addConnectionStateChanged = function (handler) {
            xbox.util.log('eventTarget.addEventListener : ' + _eventNames.ConnectionStateChanged);
            eventTarget.addEventListener(_eventNames.ConnectionStateChanged, handler);
        };
        /**
        * 서버 접속 상태 변경 이벤트 제거
        */
        exports.removeConnectionStateChanged = function (handler) {
            xbox.util.log('eventTarget.removeEventListener : ' + _eventNames.ConnectionStateChanged);
            eventTarget.removeEventListener(_eventNames.ConnectionStateChanged, handler);
        };
        /**
        * 서버 접속 상태 변경 이벤트 실행
        */
        exports.fireConnectionStateChanged = function (data) {
            eventTarget.dispatchEvent({ type: _eventNames.ConnectionStateChanged, data: data });
        };

        /**
        * 녹취 정보 변경 이벤트 등록
        */
        exports.addRecordInfoChanged = function (handler) {
            xbox.util.log('eventTarget.addEventListener : ' + _eventNames.RecordInfoChanged);
            eventTarget.addEventListener(_eventNames.RecordInfoChanged, handler);
        };
        /**
        * 녹취 정보 변경 이벤트 제거
        */
        exports.removeRecordInfoChanged = function (handler) {
            xbox.util.log('eventTarget.removeEventListener : ' + _eventNames.RecordInfoChanged);
            eventTarget.removeEventListener(_eventNames.RecordInfoChanged, handler);
        };
        /**
        * 녹취 정보 변경 이벤트 실행
        */
        exports.fireRecordInfoChanged = function (data) {
            eventTarget.dispatchEvent({ type: _eventNames.RecordInfoChanged, data: data });
        };

        /**
        * 이벤트를 추가, 제거, 실행 기능을 제공합니다.
        */
        var _listeners = {};
        var eventTarget = {
            addEventListener: function (type, callback) {
                if (!(type in _listeners)) {
                    _listeners[type] = [];
                }
                _listeners[type].push(callback);
            },
            removeEventListener: function (type, callback) {
                if (!(type in _listeners)) {
                    return;
                }
                var stack = _listeners[type];
                for (var i = 0, l = stack.length; i < l; i++) {
                    if (stack[i] === callback) {
                        stack.splice(i, 1);
                        return this.removeEventListener(type, callback);
                    }
                }
            },
            dispatchEvent: function (event) {
                if (!(event.type in _listeners)) {
                    return;
                }
                var stack = _listeners[event.type];
                event.target = this;
                for (var i = 0, l = stack.length; i < l; i++) {
                    stack[i].call(this, event.data);
                }
            }
        };

        /* EventTarget End *****************************************************/

        return exports;
    }(xboxExports.control || {}));

    return xboxExports;
}(xbox || {}));