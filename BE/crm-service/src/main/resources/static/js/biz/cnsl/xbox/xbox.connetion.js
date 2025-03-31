
// xbox.connection.js
/*
    localhost 소켓 연결 시 securityError 발생 시 조치
    1. [인터넷옵션] > [보안] > [로컬인트라넷] > [사이트] 클릭 > 인트라넷 네트워크를 자동으로 검색 체크 > [고급] 클릭 > 영역에 웹 사이트 추가 : ws://localhost/ 추가
    2. 또는 "localhost" 대신 "127.0.0.1" 사용
*/

var xbox = (function (xboxExports) {
    'use strict';
    
    /**
    * connect
    */
    xboxExports.connect = (function (exports) {
        //websocket 연결 하는 socket
        var socket;
        
        /**
        * 웹소켓 연결 여부
        */
        exports.isopen = function () {
            var result = false;
            if (socket != undefined && socket != null) {
                result = socket.readyState == WebSocket.OPEN;
            }
            xbox.util.log('xbox.connect.isopen : ' + result);
            return result;
        };

        /**
        * 웹소켓 연결
        */
        exports.open = function (data) {
            try {
                xbox.util.log('xbox.connect.open : ' + JSON.stringify(data));

                //매개변수가 없는 경우 연결 불가
                if (!data) {
                    throw '웹소켓 연결 정보를 알 수 없습니다.';
                }

                if (!window.WebSocket) {
                    window.WebSocket = window.MozWebSocket;
                }

                if (window.WebSocket) {
                    if (!exports.isopen()) {

                        //URL 확인
                        if (!data.url) {
                            throw 'URL 정보를 알 수 없습니다.';
                        }

                        //웹소켓 생성
                        socket = new WebSocket(data.url);

                        //연결
                        socket.onopen = function (event) {
                            xbox.util.log('Xbox onopen Success!');

                            //CTI 로그인 정보 확인
                            if (!data.cti) {
                                throw 'CIC서버 로그인 정보를 알 수 없습니다.';
                            }
                            //CTI 로그인
                            xbox.request.cti.authLogin(
                                data.cti.tenantId,
                                data.cti.agentId,
								data.cti.agentPwd,
                                data.callback
                            );

                            xbox.control.message('정상적으로 연결 되었습니다.');
                            //상담사 모니터링 시작
                            xbox.control.monitoring();
                        };

                        //메시지 수신
                        socket.onmessage = function (event) {
                            xbox.util.log('');
                            xbox.util.log('Xbox onmessage : ' + event.data);

                            if (xbox.util.tryParseJson(event.data)) {
                                var data = JSON.parse(event.data);
                                var eventName = data.RequestCommandType;
                                var callbackName = data.RequestCallback;
                                $("#ctiResponseMessage").text(data.ResponseMessage);
                                
                                if (data.ResponseType == 'Error') {
                                    // 오류 시 close
                                    alert(data.ResponseMessage);
                                } else if (data.ResponseType == 'Event') {
                                    // Event 통보
                                    callback(eventName, data.ResponseData, data.RequestCallbackData);
                                } else {                                    
                                    if (data.RequestCallback != '' && data.RequestCallback != null && data.RequestCallback != undefined) {                                        
                                        callback(callbackName, data.ResponseData, data.RequestCallbackData);
                                    } else {
                                        callback(eventName, data.ResponseData, data.RequestCallbackData);
                                    }
                                }
                                
                                //kw---20240508 : 양지검진 - EMR_OPEN 관련 함수 추가
                                if(eventName == 'SAEROM_Link'){
                                	 if ( window[callbackName.split('|')[0]] ) {
                                		data.Edt1_PTCNO = callbackName.split('|')[1];
                                     	window[callbackName.split('|')[0]](data);
                                     }
                                }
                            }
                        };

                        //연결 종료
                        socket.onclose = function (event) {
                            xbox.util.log('Xbox onclose : code = ' + event.code + ', reason = ' + event.reason);
                            xbox.control.message('웹소켓 연결이 닫혔습니다. [code : ' + event.code + ']', true);
                            xbox.control.end(true);
                        };

                        //연결 실패
                        socket.onerror = function (event) {
                            xbox.util.log('Xbox onerror! - ' + event.type);
                        };
                    }
                }
            } catch (err) {
                xbox.control.message('웹소켓 연결에 실패하였습니다. - ' + err, true);
            }
        };

        /**
        * 웹소켓 연결 종료
        */
        exports.close = function () {
            if (socket != null) {
                socket.close();
            }
        };

        /**
        * 메시지 전송
        */
        exports.send = function (type, command, data, callback, callbackData) {
            xbox.util.log('------------------------------------------------------------------------');
            xbox.util.log('xbox.connect.send');

            if (!window.WebSocket) {
                return;
            }
            if (exports.isopen()) {
                var message = JSON.stringify({
                    RequestType: type,
                    RequestCommandType: command,
                    RequestCommandData: data || {},
                    RequestCallback: callback,
                    RequestCallbackData: callbackData,
                    RequestDateTime: xbox.util.nowDateTime()
                });

                xbox.util.log('xbox.connect.send : ' + message);
                socket.send(message);
            } else {
                alert("CTI 로그인 후 이용해 주세요.");
            }
        };

        /**
        * 콜백 호출
        */
        function callback(fn, data, callbackData) {
            if (typeof xbox.response[fn] === 'function') {
                xbox.response[fn](data, callbackData);
            }
        }

        return exports;
    }(xboxExports.connect || {}));

    return xboxExports;
}(xbox || {}));
