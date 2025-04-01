
// xbox.request.js

var xbox = (function (xboxExports) {
    'use strict';

    /**
    * request
    */
    xboxExports.request = (function (requestExports) {

        /**
        * CTI 연동
        */
        requestExports.cti = (function (exports) {
            var type = 'Cti';

            /**
             * CTI 로그인
             * @param {String} tenantPrefix 고객사ID
             * @param {String} agentId 상담원ID
             * @param {String} agentPwd 상담원 비밀번호
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.authLogin = function (tenantPrefix, agentId, agentPwd, callback, callbackData) {
            	
                xbox.util.log('xbox.request.cti.authLogin');
                xbox.connect.send(type, 'AuthLogin', {             
                    TenantName: tenantPrefix,
                    AgentId: agentId,
					AgentPwd: agentPwd
                }, callback, callbackData);
                
                logToFile('CTI 로그인  : {' 
            			+ '"tenantPrefix" : "' 	+ tenantPrefix 	+ '",'
            			+ '"agentId" : "' 		+ agentId 		+ '",'
            			+ '"agentPwd" : "' 		+ agentPwd 		+ '"'
            			+ '}'
            	,'','','req');
            };

            /**
             * CTI 로그아웃
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.authLogout = function (callback, callbackData) {
            	
                xbox.util.log('xbox.request.cti.authLogout');
                xbox.connect.send(type, 'AuthLogout', {}, callback, callbackData);
                
                logToFile('CTI 로그아웃  : {' 
            			+ '}'
            	,'','','req');
            };

            /**
             * 전화 받기
             * @param {String} interactionId Call ID
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.pickup = function (interactionId, callback, callbackData) {
            	
                xbox.util.log('xbox.request.cti.pickup');
                xbox.connect.send(type, 'Pickup', {
                    InteractionId: interactionId
                }, callback, callbackData);
                
                logToFile('전화받기(pickup)  : {' 
            			+ '"interactionId" : "' 	+ interactionId 	+ '"'
            			+ '}'
            	,'','','req');
            };

            /**
             * 전화 걸기
             * @param {String} TargetDn 전화번호
             * @param {String} AniNumber 발신번호
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.makeCall = function (targetDn, aniNumber, callback, callbackData) {
            	
                xbox.util.log('xbox.request.cti.makeCall');
                
                xbox.connect.send(type, 'MakeCall', {
                    TargetDn: targetDn,
                    AniNumber: aniNumber
                }, callback, callbackData);
                
                logToFile('전화걸기(makeCall)  : {' 
            			+ '"targetDn" : "' 		+ targetDn 		+ '",'
            			+ '"aniNumber" : "' 	+ aniNumber 	+ '"'
            			+ '}'
            	,'','','req');
            };

            /**
             * 전화 종료
             * @param {String} interactionId Call ID
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.disconnect = function (interactionId, callback, callbackData) {
            	
                xbox.util.log('xbox.request.cti.disconnect');
                xbox.connect.send(type, 'Disconnect', {
                    InteractionId: interactionId
                }, callback, callbackData);
                
                logToFile('전화종료(disconnect)  : {' 
            			+ '"interactionId" : "' 	+ interactionId 		+ '"'
            			+ '}'
            	,'','','req');
            };

            /**
             * 상담원 상태 변경
             * @param {String} stateName 상담원 상태
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.setAgentStatus = function (stateName, callback, callbackData) {
            	
                xbox.util.log('xbox.request.cti.setAgentStatus - ' + stateName);
                $("#txtAgentState").html(stateName);
                if ( $("#noCallCounsel").length != 0 ) {
            		$("#noCallCounsel").hide();
            	}
                let INPUT_AGENT_STATE_HTML = '';
                switch (stateName) {
                	case 'IN-통화중':
    	        		INPUT_AGENT_STATE_HTML = '<span>IN<br>통화중</span>';
    					break;
                	case 'OUT-통화중':
    	        		INPUT_AGENT_STATE_HTML = '<span>OUT<br>통화중</span>';
    					break;
                	case '기타업무':
    	        		INPUT_AGENT_STATE_HTML = '<span>기타<br>업무</span>';
    	        		if ( $("#noCallCounsel").length != 0 ) {
    	        			//kw---20240306 : 무통화상담 추가
    	        			//kw--- 글로벌옵션(테넌트기준정보)값에 따라 무통화상담 버튼이 활성화 되도록 추가
    	        			if(!Utils.isNull(Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 39)) && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 39).bsVl1 == "Y"){
    	        				noCallUseYn = true;
    	        				$("#noCallCounsel").show();
    	        			}
	                	}
    					break;
                	case '보류후연결':
    	        		INPUT_AGENT_STATE_HTML = '<span>보류후<br>연결</span>';
    					break;
    	        	default :
    	        		INPUT_AGENT_STATE_HTML = stateName;
    	        		break;
    	        }
                $("#txtAgentState2").html(INPUT_AGENT_STATE_HTML);
                
                xbox.connect.send(type, 'SetAgentStatus', {
                    StateName: stateName
                }, callback, callbackData);
                
                logToFile('상담원 상태 변경(setAgentStatus)  : {' 
            			+ '"stateName" : "' 	+ stateName 		+ '"'
            			+ '}'
            	,'','','req');
            };

            /**
             * 콜 속성 설정 조회
             * @param {String} interactionId 속성 설정할 Call ID
             * @param {String} attributeName 속성 이름
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.getCicAttribute = function (interactionId, attributeName, callback, callbackData) {
            	
                xbox.util.log('xbox.request.cti.getCicAttribute');
                xbox.connect.send(type, 'GetCicAttribute', {
                    InteractionId: interactionId,
                    AttributeName: attributeName
                }, callback, callbackData);
                
                logToFile('콜 속성 설정 조회(getCicAttribute)  : {' 
            			+ '"interactionId" : "' 	+ interactionId 		+ '",'
            			+ '"attributeName" : "' 	+ attributeName 		+ '"'
            			+ '}'
        		,'','','req');
            };

            /**
             * 콜 속성 설정 조회
             * @param {Object} obj Object객체(interactionId, attributeName)
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.getCicAttributeList = function (obj, callback, callbackData) {
                xbox.util.log('xbox.request.cti.getCicAttributeList');
                xbox.connect.send(type, 'GetCicAttributeList', obj, callback, callbackData);
            };

            /**
             * 콜 속성 설정
             * @param {String} interactionId 속성 설정할 Call ID
             * @param {String} attributeName 속성 이름
             * @param {String} attributeValue 속성 값
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.setCicAttribute = function (interactionId, attributeName, attributeValue, callback, callbackData) {
                xbox.util.log('xbox.request.cti.setCicAttribute');
                xbox.connect.send(type, 'SetCicAttribute', {
                    InteractionId: interactionId,
                    AttributeName: attributeName,
                    AttributeValue: attributeValue
                }, callback, callbackData);
            };

            /**
             * 보류
             * @param {String} interactionId Call ID
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.holdToggle = function (interactionId, callback, callbackData) {
            	
                xbox.util.log('xbox.request.cti.holdToggle');
                xbox.connect.send(type, 'HoldToggle', {
                    InteractionId: interactionId
                }, callback, callbackData);
                
                logToFile('보류(HOLD)  : {' 
            			+ '"interactionId" : "' 	+ interactionId 		+ '"'
            			+ '}'
            	,'','','req');
            };

            /**
             * 음소거
             * @param {String} interactionId Call ID
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.muteToggle = function (interactionId, callback, callbackData) {
            	
                xbox.util.log('xbox.request.cti.muteToggle');
                xbox.connect.send(type, 'MuteToggle', {
                    InteractionId: interactionId
                }, callback, callbackData);
                
                logToFile('음소거(MUTE) : {' 
            			+ '}'
            	,'','','req');
            };

            /**
             * 상담원 목록
             * @param {String} tenantName 테넌트명
             * @param {String} directoryName 그룹명
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.getAgentInfoList = function (tenantName, directoryName, callback, callbackData) {
                xbox.util.log('xbox.request.cti.getAgentInfoList');
                xbox.connect.send(type, 'GetAgentInfoList', {
                    TenantName: tenantName,
                    DirectoryName: directoryName
                }, callback, callbackData);
            };

            /**
             * 호전환 전화 걸기
             * @param {String} targetDn 전화번호
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.consultMakeCall = function (targetDn, callback, callbackData) {
            	
                xbox.util.log('xbox.request.cti.consultMakeCall');
                xbox.connect.send(type, 'ConsultMakeCall', {
                    TargetDn: targetDn
                }, callback, callbackData);
                
                logToFile('호전환 전화 걸기(consultMakeCall)  : {' 
            			+ '"targetDn" : "' 	+ targetDn 		+ '",'
            			+ '}'
        		,'','','req');
            };

            /**
             * 호전환 전화 종료
             * @param {String} orgInteractionId 보류 중 콜아이디
             * @param {String} consultInteractionId 호전환 콜아이디
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.consultDisconnect = function (orgInteractionId, consultInteractionId, callback, callbackData) {
            	
                xbox.util.log('xbox.request.cti.consultDisconnect');
                xbox.connect.send(type, 'ConsultDisconnect', {
                    OrgInteractionId: orgInteractionId,
                    ConsultInteractionId: consultInteractionId
                }, callback, callbackData);
                
                logToFile('호전환 전화 종료(consultDisconnect)  : {' 
            			+ '"orgInteractionId" : "' 		+ orgInteractionId 			+ '",'
            			+ '"consultInteractionId" : "' 	+ consultInteractionId 		+ '"'
            			+ '}'
        		,'','','req');
            };

            /**
             * 호전환 완료
             * @param {String} orgInteractionId 보류 중 콜아이디
             * @param {String} consultInteractionId 호전환 콜아이디
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.consultTransfer = function (orgInteractionId, consultInteractionId, callback, callbackData) {
            	
                xbox.util.log('xbox.request.cti.consultTransfer');
                xbox.connect.send(type, 'ConsultTransfer', {
                    OrgInteractionId: orgInteractionId,
                    ConsultInteractionId: consultInteractionId
                }, callback, callbackData);
                
                logToFile('호전환 전화 완료(consultTransfer)  : {' 
            			+ '"orgInteractionId" : "' 		+ orgInteractionId 			+ '",'
            			+ '"consultInteractionId" : "' 	+ consultInteractionId 		+ '"'
            			+ '}'
        		,'','','req');
            };

            /**
             * 즉시 호전환
             * @param {String} interactionId 즉시 호전환 할 콜아이디
             * @param {String} targetDn 전화번호
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.blindTransfer = function (interactionId, targetDn, callback, callbackData) {
            	
                xbox.util.log('xbox.request.cti.blindTransfer');
                xbox.connect.send(type, 'BlindTransfer', {
                    InteractionId: interactionId,
                    TargetDn: targetDn
                }, callback, callbackData);
                
                logToFile('즉시 호전환(blindTransfer)  : {' 
            			+ '"interactionId" : "' 		+ interactionId 		+ '",'
            			+ '"targetDn" : "' 				+ targetDn 		+ '"'
            			+ '}'
        		,'','','req');
            };

			/**
             * 도움 요청
             * @param {String} tenant 고객사
             * @param {String} agentId 상담사 ID
             * @param {String} agentDn 상담사 내선 번호
             * @param {String} AgentName 상담사 이름
			 * @param {String} callId 녹취 콜 아이디
             * @param {String} customerPhone 고객 전화번호
             * @param {String} customerNumber 고객 번호
             * @param {String} adminId 도움 요청 대상 ID
             * @param {String} Requested 도움 요청 or 취소 여부
             */
            exports.helpRequest = function (tenant, agentId, agentDn, agentName, callId, customerPhone, customerNumber, adminId, requested, callback, callbackData) {
                xbox.util.log('xbox.request.cti.helpRequest');
                xbox.connect.send(type, 'HelpRequest', {
                    Tenant: tenant,
                    AgentId: agentId,
                    AgentDn: agentDn,
                    AgentName: agentName,
                    CallId: callId,
                    CustomerPhone: customerPhone,
                    CustomerNumber: customerNumber,
					AdminId: adminId,
					Requested: requested
                }, callback, callbackData);
            };

            /**
             * 3자 통화 방 만들기
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.confCreateRoom = function (interactionId, callback, callbackData) {
                xbox.util.log('xbox.request.cti.confCreateRoom');
                xbox.connect.send(type, 'ConfCreateRoom', {
                    InteractionId: interactionId
                }, callback, callbackData);
            };

            /**
             * 3자 통화 멤버 추가
             * @param {String} conferenceId 대화방 아이디
             * @param {String} confInteractionId 3자통화 콜아이디
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.confAddParty = function (conferenceId, confInteractionId, callback, callbackData) {
                xbox.util.log('xbox.request.cti.confAddParty');
                xbox.connect.send(type, 'ConfAddParty', {
                    ConferenceId: conferenceId,
                    ConfInteractionId: confInteractionId
                }, callback, callbackData);
            };

            /**
             * 3자 통화 멤버 호출
             * @param {String} targetDn 3자 통화할 전화번호
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.confMakeCall = function (targetDn, callback, callbackData) {
                xbox.util.log('xbox.request.cti.confMakeCall');
                xbox.connect.send(type, 'ConfMakeCall', {
                    TargetDn: targetDn
                }, callback, callbackData);
            };

            /**
             * 3자 통화 멤버 연결 종료
             * @param {String} orgInteractionId 보류 중인 콜아이디
             * @param {String} confInteractionId 3자통화 콜아이디
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.confDisconnect = function (orgInteractionId, confInteractionId, callback, callbackData) {
                xbox.util.log('xbox.request.cti.confDisconnect');
                xbox.connect.send(type, 'ConfDisconnect', {
                    OrgInteractionId: orgInteractionId,
                    ConfInteractionId: confInteractionId
                }, callback, callbackData);
            };
            
            exports.emrOpen = function(_emrType, _data, _edt1PTCNO, callback){
            	xbox.util.log('xbox.request.emrOpen');
            	
            	xbox.connect.send(type, _emrType, _data, callback);
            	
            };

            return exports;
        }(requestExports.cti || {}));

        /**
        * 녹취 연동
        */
        requestExports.record = (function (exports) {
            var type = 'Record';

            /**
             * 녹취 콜아이디 요청
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.getRecordInfo = function (callback, callbackData) {
            	
                xbox.util.log('xbox.request.record.getRecordInfo');
                xbox.connect.send(type, 'GetRecordInfo', {}, callback, callbackData);
                
                logToFile('녹취 아이디 요청(getRecordInfo)  : {' 
            			+ '}'
        		,'','','req');
            };

            /**
             * 녹취 고객 정보 입력
             * @param {String} data.extNo 내선번호
             * @param {String} data.callId 녹취 콜아이디
             * @param {String} data.customerName 고객이름
             * @param {String} data.customerId 고객아이디
             * @param {String} data.customerTelNumber 고객 추가 전화번호
             * @param {String} data.customerInfo1 고객 기타정보1
             * @param {String} data.customerInfo2 고객 기타정보2
             * @param {String} data.customerInfo3 고객 기타정보3
             * @param {String} data.customerInfo4 고객 기타정보
             * @param {String} data.customerInfo5 고객 기타정보5
             * @param {String} data.agentId 상담원 아이디
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.sendExtendInfo = function (data, callback, callbackData) {
            	
                xbox.util.log('xbox.request.record.sendExtendInfo');
                xbox.connect.send(type, 'SendExtendInfo', {
                    ExtNo: data.extNo,
                    CallId: data.callId,
                    Name: data.customerName,
                    Cid: data.customerId,
                    Ctel: data.customerTelNumber,
                    Info1: data.customerInfo1,
                    Info2: data.customerInfo2,
                    Info3: data.customerInfo3,
                    Info4: data.customerInfo4,
                    Info5: data.customerInfo5,
                    Aid: data.agentId
                }, callback, callbackData);
                
                logToFile('녹취 고객 정보 입력(sendExtendInfo)  : {'
            			+ '"ExtNo" : "' 		+ data.extNo 				+ '",'
            			+ '"CallId" : "' 		+ data.callId 				+ '",'
            			+ '"Name" : "' 			+ data.customerName 		+ '",'
            			+ '"Cid" : "' 			+ data.customerId 			+ '",'
            			+ '"Ctel" : "' 			+ data.customerTelNumber 	+ '",'
            			+ '"Info1" : "' 		+ data.customerInfo1 		+ '",'
            			+ '"Info2" : "' 		+ data.customerInfo2 		+ '",'
            			+ '"Info3" : "' 		+ data.customerInfo3 		+ '",'
            			+ '"Info4" : "' 		+ data.customerInfo4 		+ '",'
            			+ '"Info5" : "' 		+ data.customerInfo5 		+ '",'
            			+ '"Aid" : "' 			+ data.agentId 				+ '"'
            			+ '}'
        		,'','','req');
            };

            /**
             * 녹취 재생
             * @param {String} callId 녹취 콜아이디
             * @param {String} callback 콜백함수명
             * @param {Object} callbackData 콜백함수 매개변수
             */
            exports.recordPlay = function (callId, callback, callbackData) {
            	
                xbox.util.log('xbox.request.record.recordPlay');
                xbox.connect.send(type, 'RecordPlay', {
                    CallId: callId
//                    ,useSTT: 'Y'
                }, callback, callbackData);
                
                logToFile('녹취 재생(recordPlay)  : {'
            			+ '"callId" : "' 		+ callId				+ '"'
            			+ '}'
        		,'','','req');
            };
            
            return exports;
        }(requestExports.cti || {}));
        
        return requestExports;
    }(xboxExports.request || {}));

    return xboxExports;
}(xbox || {}));
