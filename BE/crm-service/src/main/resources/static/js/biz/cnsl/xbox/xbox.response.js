
// xbox.response.js

var xbox = (function (xboxExports) {
    'use strict';

    /**
    * response 응답(콜백 또는 이벤트)
    */
    xboxExports.response = (function (exports) {

        /**
        * CTI 접속 콜백
        * @param {Boolean} data 성공여부
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.startCallback = function (data, callbackData) {
        	
            xbox.util.log('xbox.response.startCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));

            if (data.CtiErrorCode == 0 && data.RecErrorCode == 0) {
                xbox.control.ctiLoginClose();
                xbox.control.message('CTI 로그인 되었습니다.');
                xbox.control.reset();
            } else {
                // 로그인 실패
                alert('CTI 로그인에 실패했습니다.\n\n상담APP를 종료합니다.' + '\n\n[CTI ERR : ' + data.CtiErrorCode + ', REC ERR : ' + data.RecErrorCode + ']');
                xbox.control.end();
                //xbox.control.message('CTI 로그인에 실패했습니다.' + '\n' + data.CtiErrorMessage + '\n' + data.RecErrorMessage, true);
            }
            
            logToFile('', 'CTI 로그인 콜백(startCallback) : ' + xbox.util.objectToJson(data), '', 'res');
        };

        /**
        * 세션 상태 변경 통보
        * @param {Object} data 응답데이터(ServerId, Status)
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.OnConnectionStateChanged = function (data, callbackData) {
        	
            xbox.util.log('xbox.response.OnConnectionStateChanged - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));

            xbox.control.fireConnectionStateChanged({ state: data.Status });
            
            logToFile('', '세션 상태 변경 통보(OnConnectionStateChanged) : ' + xbox.util.objectToJson(data), '', 'res');
        };

        /**
        * 상담원 상태 변경 통보
        * @param {Object} data 응답데이터(ServerId, AgentId, Status, ResultFlag)
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.OnAgentStatusChanged = function (data, callbackData) {
        	
            xbox.util.log('xbox.response.OnAgentStatusChanged - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));

            xbox.control.fireAgentStateChanged({ flag: data.ResultFlag, state: data.Status });
            
            logToFile('', '상담원 상태 변경 통보(OnAgentStatusChanged) : ' + xbox.util.objectToJson(data), '', 'res');
        };

        /**
        * 콜 상태 변경 통보
        * @param {Object} data 응답데이터(ServerId, StationId, InteractionId, Status)
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.OnCallStateChanged = function (data, callbackData) {       
        	
            xbox.util.log('xbox.response.OnCallStateChanged - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));

            var interactionId = data.InteractionId;
            var state = data.Status;
            // 콜 종료 이벤트의 상태가 올바르게 동작하지 않아 외부, 내부 콜 확인은 callType으로 합니다.
            if (state == 'InternalDisconnect' || state == 'ExternalDisconnect') {
                state = 'Disconnect';
            }

            // CallManager 초기화
            xbox.model.callManager.prepare();

            // 콜 정보
            var call = xbox.model.callManager.get(interactionId);
            
            ////현재 콜이 유효한 콜인지 확인
            //if (call && call.hasDirectCall) {
            //    // 직접 전화 걸기 종료 시
            //    if (state == 'Disconnect') {
            //        xbox.model.callManager.remove(call);
            //        return false;
            //    }
            //}
            //// 전화기를 직접 사용하는 경우 'Proceeding'보다 'Connected'가 먼저 발생합니다.
            //if (state == 'Connected' && data.Eic_CallPurpose == '10') {
            //    var directCall = xbox.model.call.newItem();
            //    directCall.hasDirectCall = true;
            //    xbox.model.callManager.add(directCall);
            //    return false;
            //}

            // 콜이 신규 콜인지 확인하고 신규이면 리스트에 추가
            var regex = /Alerting|Proceeding|Connected/;
            if (!call && regex.test(state) && state != 'ConnectedAfterHeld') {
                // 우			: CTI 서버에 발신 번호 정보 요청, 인바운드에만 값을 얻을 수 있음.
                // TTCustDNIS			: CTI 서버에 수신 번호 정보 요청, 인바운드에만 값을 얻을 수 있음.
                // TTIVRCurPosition		: CTI 서버에 IVR 코드 요청
                // Eic_CallType			: CTI 서버 콜 타입 요청, 리턴값 (Internal : 내부 콜, External : 외부 콜)
                // Eic_CallDirection	: CTI 서버에 콜 방향 요청, 리턴값 (I:인바운드콜, O:아웃바운드콜)
                // Eic_RemoteAddress	: CTI 서버에 수신번호 정보 요청
                // customerNumber       : CTI 서버에서 IVR에서 고객이 입력한 전화번호 요청.
				// Eic_IsdnCauseValue   : CTI 서버에서 전화 발신 시 없는 번호인 경우
				// CallAttemptsNumber	: CTI 서버에서 인입 고객 통화 시도 횟수 요청
				// CallResponseNumber	: CTI 서버에서 인입 고객 통화 시도 횟수 중 응대 횟수 요청
                var attrList = [];
                attrList.push({ InteractionId: interactionId, AttributeName: 'TTCustANI' });
                attrList.push({ InteractionId: interactionId, AttributeName: 'TTCustDNIS' });
                attrList.push({ InteractionId: interactionId, AttributeName: 'Eic_CallDirection' });
                attrList.push({ InteractionId: interactionId, AttributeName: 'Eic_CallType' });
                attrList.push({ InteractionId: interactionId, AttributeName: 'TTIVRCurPosition' });
                attrList.push({ InteractionId: interactionId, AttributeName: 'Eic_RemoteAddress' });
                attrList.push({ InteractionId: interactionId, AttributeName: 'TTCustomNumber' });
                attrList.push({ InteractionId: interactionId, AttributeName: 'Eic_IsdnCauseValue' });
                attrList.push({ InteractionId: interactionId, AttributeName: 'CallAttemptsNumber' });
                attrList.push({ InteractionId: interactionId, AttributeName: 'CallResponseNumber' });
                attrList.push({ InteractionId: interactionId, AttributeName: 'TTACD1Time' });
                xbox.request.cti.getCicAttributeList(attrList, 'createCallItem', {
                    interactionId: interactionId,
                    state: state
                });
            } else {
                onCallStateChangedII(interactionId, state);
            }
            
            logToFile('', '콜 상태 변경 통보(OnCallStateChanged) : ' + xbox.util.objectToJson(data), xbox.util.objectToJson(call), 'res');
        };

        /**
        * 콜 상태 변경 통보(OnCallStateChanged)에서 신규 콜 발생 시 콜백
        * @param {Object} data 응답데이터(TTCustANI, TTCustDNIS, Eic_CallDirection, Eic_CallType, TTIVRCurPosition, Eic_RemoteAddress, TTCustomNumber)
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.createCallItem = function (data, callbackData) {
            xbox.util.log('xbox.response.callStateCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));
            var interactionId = callbackData.interactionId;
            var state = callbackData.state;
            var call = xbox.model.call.newItem();
            call.interactionId = interactionId;
            call.ani = data.TTCustANI;
            call.dnis = data.TTCustDNIS;
            call.callDirection = data.Eic_CallDirection;
            call.callType = data.Eic_CallType;
            call.serviceCode = data.TTIVRCurPosition;
            call.remote = data.Eic_RemoteAddress;
            call.customNumber = data.TTCustomNumber;
            call.telNumber = data.Eic_CallDirection == 'I' ? data.TTCustANI : data.Eic_RemoteAddress;
            call.callAttemptsNumber = data.CallAttemptsNumber;
            call.callResponseNumber = data.CallResponseNumber;

            if (state == 'Connected') {
                call.hasConnected = true;
                // 호전환을 통해 연결된 고객은 'Alerting' 콜 이벤트가 발생하지 않는다.
                if (!xbox.model.callManager.external) {
                    call.customerId = data.CustomerId || '-1';
                }
                //소프트폰으로 로그인 하기 전에 수화기로 전화 받았을 경우
                // var param = {
                // 		tenantId 	: GLOBAL.session.user.tenantId,
                // 		callId 		: call.interactionId,
                // }
                //
                // Utils.ajaxCall("/cnsl/CNSL100SEL03", JSON.stringify(param) ,function(result){
                // 	console.log(":::::::: JSON.parse(result.list)");
                //
                // 	var arrResult = result.list;
                //	
                // 	if(arrResult.length < 1 || Utils.isNull(arrResult[0].cntcInclDtm)){
                //		
                // 		var cntcPathCd 		= '10';
                // 		var callDirection 	= '1';
                // 		var cntcDt 			= '';
                // 		var cntcInclDtm 	= '';
                // 		var cntcCnntDtm 	= '';
                //		
                // 		var date = new Date();
                //
                // 		var year = date.getFullYear();
                // 		var month = String(date.getMonth() + 1).padStart(2, '0');
                // 		var day = String(date.getDate()).padStart(2, '0');
                // 		var hours = String(date.getHours()).padStart(2, '0');
                // 		var minutes = String(date.getMinutes()).padStart(2, '0');
                // 		var seconds = String(date.getSeconds()).padStart(2, '0');
                // 		var nowDate = year+month+day+hours+minutes+seconds;
                //			
                // 		if(call.callDirection == "O"){	
                // 			cntcPathCd = '60'; 
                // 			callDirection = '2';
                //			
                // 			//아웃바운드일 경우에는 인입시간이 없기 때문에..연결된 시간도 xbox에서 안준다고 함.. 그래서 지금 시간으로 넣기
                // 			cntcDt 			= nowDate.substr(0,8);
                // 			cntcInclDtm 	= nowDate;
                // 			cntcCnntDtm		= nowDate;
                // 		} else {
                // 			//인바운드일 경우에는 인입 시간은 있기 때문에 인입시간은 xbox에서 준대로 넣고 연결 시간은 현재 시간으로
                // 			cntcDt 			= data.TTACD1Time.replace(/[-:\s]/g, '').substr(0,8);
                // 			cntcInclDtm 	= data.TTACD1Time.replace(/[-:\s]/g, '');
                // 			cntcCnntDtm		= nowDate;
                // 		}
                //		
                //		
                // 		 var CNSL100_data = {
                // 				 "tenantId" 		: GLOBAL.session.user.tenantId,	 
                // 				 "callDirection" 	: callDirection,
                // 				 "cntcPathCd" 		: cntcPathCd,
                // 				 "interactionId" 	: call.interactionId, 				//CallID
                // 				 "telNumber"		: call.remote,
                // 				 "cntcDt"			: cntcDt,
                // 				 "cntcInclDtm"		: cntcInclDtm, 
                // 				 "cntcCnntDtm"		: cntcCnntDtm,
                // 				 "dnis"				: call.dnis,
                // 				 "serviceCode"		: call.serviceCode,
                // 				 "cnslrId"			: GLOBAL.session.user.usrId,
                // 				 "orgCd"			: GLOBAL.session.user.orgCd,
                // 				 "sttUseYn" 		: GLOBAL.session.user.sttUseYn,
                // 				 "recordId"			: call.recordId,
        	    //     	};
        	    //        
        	    //     	var CNSL100_jsonStr = JSON.stringify(CNSL100_data);
        	    //     	Utils.ajaxCall("/cnsl/CNSL100INS05", CNSL100_jsonStr , function(resultData){
        	    //     		if ( window['load' + "CNSL1" + '01SEL01'] ) {
        	    //     			new Function ( 'load' + "CNSL1" + '01SEL01()')()
        	    //     		}
        	    //    		
        	    //     		if ( window['load' + "CNSL2" + '01SEL01'] ) {
        	    //     			new Function ( 'load' + "CNSL2" + '01SEL01()')()
        	    //     		}
        	    //     	});
        	    //    	
        	    //    	
                // 	}
                // });
            }

            xbox.model.callManager.add(call);

            onCallStateChangedII(interactionId, state);
            
            logToFile('', '콜 상태 변경 이벤트(createCallItem) : ' + xbox.util.objectToJson(data), xbox.util.objectToJson(call), 'res');
        };

        // 콜 상태 변경 이벤트 II
        function onCallStateChangedII(interactionId, state) {
            var call = xbox.model.callManager.get(interactionId);
            xbox.util.log('InteractionID: ' + interactionId + ', status: ' + state + ', Call: ' + call);

            // 리스트에 없는 콜은 강제 끊기
            if (!call) {
                xbox.util.log('강제 종료 : ' + state);
                if (state != 'Disconnect') {
                    xbox.request.cti.disconnect(interactionId);
                }
                return false;
            }

            // 활성화 콜
            var regex = /Alerting|Proceeding|Connected|ConnectedAfterHeld/;
            if (regex.test(state)) {
                xbox.model.callManager.activeInteractionId = call.interactionId;
            }

            if (state == 'Connected' && call.callType == 'E') {
                // 녹취 콜아이디 요청
            	console.log("::::::::::::::::::::::::: record 요청");
            	xbox.request.record.getRecordInfo('getRecordInfoCallback');
            }

            xbox.control.fireCallStateChanged({ call: call, state: state });

            // 콜  trace
            //var manager = xbox.model.callManager;
            //xbox.util.log('list count : ' + manager.count());
            //for (var prop in manager) {
            //    if (typeof manager[prop] != 'function') {
            //        xbox.util.log(prop + ' : ' + xbox.util.objectToJson(manager[prop]));
            //    }
            //}
            
            logToFile('', '콜 상태 변경 이벤트 II(onCallStateChangedII) : ' + interactionId, xbox.util.objectToJson(call), 'res');
        }

        /**
        * 전화받기 콜백
        * @param {Object} data 응답데이터(InteractionId)
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.pickupCallback = function (data, callbackData) {
            xbox.util.log('xbox.response.pickupCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));
            
            if (data) {
                xbox.control.message('전화연결 성공');
                if (typeof alertingView === 'function') {
                    alertingView('hide');
                }
            } else {
                xbox.control.message('전화연결 실패', true);
            }
            
            logToFile('', '전화받기 콜백(pickupCallback) : ' + xbox.util.objectToJson(data), '', 'res');
        };

        /**
        * 전화걸기 콜백
        * @param {Object} data 응답데이터(InteractionId)
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.makeCallCallback = function (data, callbackData) {
            xbox.util.log('xbox.response.makeCallCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));
            if (data <= 0) {
                alert('전화걸기에 실패하였습니다.[' + data + ']');
                $("#btnMakeCall").prop('disabled', false);
            }
            xbox.control.message('전화연결 - InteractionId : ' + data);
            
            logToFile('', '전화걸기 콜백(makeCallCallback) : ' + xbox.util.objectToJson(data), '', 'res');
        };

        /**
        * 보류 콜백
        * @param {Boolean} data 성공여부
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.holdCallback = function (data, callbackData) {
            xbox.util.log('xbox.response.holdCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));

            if (!xbox.util.parseBool(data)) {
                xbox.control.message('보류 요청 실패', true);
            }
            
            logToFile('', '보류 콜백(holdCallback) : ' + xbox.util.objectToJson(data), '', 'res');
        };

        /**
        * 음소거 콜백
        * @param {Boolean} data 성공여부
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.muteCallback = function (data, callbackData) {
            xbox.util.log('xbox.response.muteCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));

            if (xbox.util.parseBool(data.ResultFlag)) {
                var msg = xbox.util.parseBool(data.MuteFlag) ? '음소거 실행' : '음소거 중지';
                xbox.control.message(msg);
            } else {
                xbox.control.message('음소거 요청 실패', true);
            }
            
            logToFile('', '음소거 콜백(muteCallback) : ' + xbox.util.objectToJson(data), '', 'res');
        };

        /**
        * 상담원목록 콜백
        * @param {Array} data 상담원 정보 리스트
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.agentInfoListCallback = function (data, callbackData) {
            xbox.util.log('xbox.response.agentInfoListCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));

            // 팝업 (Custom)
            if (callbackData == 'transfer') {
                // 호전환 목록
                if (typeof transferView === 'function') {
                    transferView('', data);
                }
            } else if (callbackData == 'transferReset') {
                if (typeof transferView === 'function') {
                    transferView('Reset', data);
                }
            } else if (callbackData == 'conference') {
                // 3자통화 목록
                if (typeof conferenceView === 'function') {
                    conferenceView('', data);
                }
            }
        };

        /**
        * 호전환 전화 걸기 콜백
        * @param {String} data 콜아이디(interactionId)
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.consultMakeCallback = function (data, callbackData) {
            xbox.util.log('xbox.response.consultMakeCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));
            if (!data) {
                alert('상담원 연결 실패!');
            }
            // 호전환 콜아이디
            xbox.model.callManager.transferInteractionId = data;

            //버튼 활성/비활성
            xbox.control.transferButtonChange('CONNECT');
            
            logToFile('', '호전환 전화 걸기 콜백 콜백(consultMakeCallback) : ' + xbox.util.objectToJson(data), '', 'res');
        };

        /**
        * 호전환 전화 종료 콜백
        * @param {Boolean} data 성공여부
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.consultDisconnectCallback = function (data, callbackData) {
            xbox.util.log('xbox.response.consultDisconnectCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));
            if (!xbox.util.parseBool(data)) {
                alert('상담원 끊기 실패!');
            }

            //호전환 정보 초기화
            var manager = xbox.model.callManager;
            manager.remove(manager.transferInteractionId);
            manager.transferInteractionId = '';

            xbox.control.transferButtonChange();
            //호전환 창 닫기(Custom)
//            if (typeof transferView === 'function') {
//                transferView('hide');
//            }
            
            logToFile('', '호전환 전화 종료 콜백(consultDisconnectCallback) : ' + xbox.util.objectToJson(data), '', 'res');
        };

        /**
        * 호전환 완료 콜백
        * @param {Boolean} data 성공여부
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.consultTransferCallback = function (data, callbackData) {
            xbox.util.log('xbox.response.consultTransferCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));
            if (!xbox.util.parseBool(data)) {
                alert('호전환 실패!');
                return false;
            }

            //호전환 정보 초기화 및 고객아이디 설정
            var manager = xbox.model.callManager;
            var external = manager.get(manager.externalInteractionId);
            manager.remove(manager.transferInteractionId);
            xbox.request.cti.setCicAttribute(manager.transferInteractionId, 'CustomerId', external.customerId);
            manager.transferInteractionId = '';

            //호전환 창 닫기(Custom)
            if (typeof transferView === 'function') {
                transferView('hide');
            }
            
            logToFile('', '호전환 완료 콜백(consultTransferCallback) : ' + xbox.util.objectToJson(data), '', 'res');
        };

        /**
        * 즉시 호전환 콜백
        * @param {Boolean} data 성공여부
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.blindTransferCallback = function (data, callbackData) {
            xbox.util.log('xbox.response.blindTransferCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));
            if (!xbox.util.parseBool(data)) {
                alert('즉시 호전환 실패!');
                return false;
            }

            //호전환 창 닫기(Custom)
            if (typeof transferView === 'function') {
                transferView('hide');
            }
            
            logToFile('', '즉시 호전환 콜백(blindTransferCallback) : ' + xbox.util.objectToJson(data), '', 'res');
        };

        /**
        * 도움 요청 콜백
        * @param {Boolean} data 성공여부
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.helpRequestCallback = function (data, callbackData) {
            xbox.util.log('xbox.response.helpRequestCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));
            if (!xbox.util.parseBool(data)) {
                alert('도움 요청 실패!');
                return false;
            }
        };

        /**
        * 3자 통화 방 만들기 콜백
        * @param {String} data 회의 방 아이디 반환
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.confCreateRoomCallback = function (data, callbackData) {
            xbox.util.log('xbox.response.confCreateRoomCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));
            if (!data) {
                alert('대화방 생성 실패!');
                return false;
            }

            // 3자통화 대화방 아이디
            xbox.model.callManager.conferenceId = data;

            //버튼 활성/비활성
            xbox.control.conferenceButtonChange('CREATE');
        };

        /**
        * 3자 통화 멤버 추가 콜백
        * @param {String} data 대화방과 연결되며 새로 연결된 콜아이디
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.confAddPartyCallback = function (data, callbackData) {
            xbox.util.log('xbox.response.confAddPartyCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));
            if (!data) {
                alert('대화방 초대 실패!');
                return false;
            }

            // 3자통화 콜아이디
            xbox.model.callManager.conferenceInteractionId = data;
            xbox.model.callManager.internalInteractionId = '';

            //버튼 활성/비활성
            xbox.control.conferenceButtonChange('INVITE');
        };

        /**
        * 3자 통화 멤버 호출 콜백
        * @param {String} data 콜아이디(InteractionId)
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.confMakeCallback = function (data, callbackData) {
            xbox.util.log('xbox.response.confMakeCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));
            if (!data) {
                alert('상담원 연결 실패!');
                return false;
            }

            // 3자통화 대상 콜아이디
            xbox.model.callManager.internalInteractionId = data;

            //버튼 활성/비활성
            xbox.control.conferenceButtonChange('MAKECALL');
        };

        /**
        * 3자 통화 멤버 연결 종료 콜백
        * @param {Boolean} data 성공여부
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.confDisconnectCallback = function (data, callbackData) {
            xbox.util.log('xbox.response.confDisconnectCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));
            if (!xbox.util.parseBool(data)) {
                alert('상담원 끊기 실패!');
                return false;
            }

            // 3자통화 대상 콜아이디
            xbox.model.callManager.internalInteractionId = '';

            //버튼 활성/비활성
            xbox.control.conferenceButtonChange('DISCONNECT');
        };

        /**
        * 녹취 정보 변경, 시작, 종료 통보
        * @param {Object} data 응답데이터(CallId, StartTime, EndTime)
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.OnRecordInfoChanged = function (data, callbackData) {
            xbox.util.log('xbox.response.OnRecordInfoChanged - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));

            if (data) {
                // 콜 정보
                var manager = xbox.model.callManager;
                var call = manager.get(manager.activeInteractionId);
                if (call) {
                    if (data.CallId) { call.recordId = data.CallId; }
                    if (data.StartTime) { call.startTime = data.StartTime; }
                    if (data.EndTime && data.EndTime > data.StartTime) { call.endTime = data.EndTime; }

                    xbox.control.fireRecordInfoChanged({ call: call });
                }
            }
            
            logToFile('', '녹취 정보 변경 콜백(OnRecordInfoChanged) : ' + xbox.util.objectToJson(data), '', 'res');
        };

        /**
        * 녹취 콜아이디 요청 콜백
        * @param {Object} data 응답데이터(CallId, StartTime, EndTime)
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.getRecordInfoCallback = function (data, callbackData) {
        	console.log("getRecordInfoCallbackgetRecordInfoCallbackgetRecordInfoCallbackgetRecordInfoCallback");
            xbox.util.log('xbox.response.getRecordInfoCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));
            
            logToFile('', '녹취 콜아이디 요청 콜백(getRecordInfoCallback) : ' + xbox.util.objectToJson(data), '', 'res');
        };

        /**
        * 녹취 고객 정보 입력 콜백
        * @param {Object} data 응답데이터
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.sendExtendInfoCallback = function (data, callbackData) {
            xbox.util.log('xbox.response.sendExtendInfoCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));
            
            logToFile('', '녹취 고객 정보 입력 콜백(sendExtendInfoCallback) : ' + xbox.util.objectToJson(data), '', 'res');
        };

        /**
        * 녹취 재생 콜백
        * @param {Object} data 응답데이터
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.getRecordInfoCallback = function (data, callbackData) {
            xbox.util.log('xbox.response.recordPlayCallback - data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));
            
            logToFile('', '녹취 재생 콜백(getRecordInfoCallback) : ' + xbox.util.objectToJson(data), '', 'res');
        };

        /**
        * 모니터링(고객대기, 응대율)
        * @param {Object} data 응답데이터 (WaitCallCount 고객대기, InteractionPercent 응대율)
        * @param {Object} callbackData 콜백 시 전달 파라미터
        */
        exports.OnMonitorInfoChanged = function (data, callbackData) {
            xbox.util.log('xbox.response.onMonitorInfoChanged- data = ' + xbox.util.objectToJson(data) + ', callbackData = ' + xbox.util.objectToJson(callbackData));
            xbox.control.monitoring(data);
        };
        
        return exports;
    }(xboxExports.response || {}));

    return xboxExports;
}(xbox || {}));
