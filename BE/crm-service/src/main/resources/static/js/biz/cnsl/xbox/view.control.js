// view.control.js
// jquery 문법을 사용하므로 jquery가 반드시 로드되어 있어야 사용 가능합니다.
// 사용자가 정의하여 사용합니다.
// xbox.*.js가 모두 로드 된 후 로드가 되어야 합니다.

// xbox.control.js
var controller = xbox.control;
// call data
var callManager = xbox.model.callManager;

window.onbeforeunload = function () {
    console.log('view.control, window.onbeforeunload()');
    // 상담원 상태 변경 이벤트 해제
    controller.removeAgentStateChanged(callbackAgentStateChanged);
    // 콜 상태 변경 이벤트 해제
    controller.removeCallStateChanged(callbackCallStateChanged);
    // 서버 상태 변경 이벤트 해제
    controller.removeConnectionStateChanged(callbackConnectionStateChanged);
    // 녹취 정보 변경 이벤트 해제
    controller.removeRecordInfoChanged(callbackRecordInfoChanged);
};

$(function () {

    // 서버 상태 변경 이벤트 등록
    controller.addConnectionStateChanged(callbackConnectionStateChanged);
    // 상담원 상태 변경 이벤트 등록
    controller.addAgentStateChanged(callbackAgentStateChanged);
    // 콜 상태 변경 이벤트 등록
    controller.addCallStateChanged(callbackCallStateChanged);
    // 녹취 정보 변경 이벤트 등록
    controller.addRecordInfoChanged(callbackRecordInfoChanged);


});

/**
* 서버 상태 변경 이벤트
*/
function callbackConnectionStateChanged(data) {
    console.log('view.control, callbackConnectionStateChanged - ', JSON.stringify(data || {}));

}

/**
* 상담원 상태 변경 이벤트
*/
function callbackAgentStateChanged(data) {
	
    // User Defined    
    if (data.state == '후처리') {
        var call = callManager.external();
        if (call && call.recordId) {
            var html = '';
            html += '<button class="btn btn-info" id="btnRecordPlay" data-id="' + call.recordId + '">녹취 재생 ( ' + call.startTime + ' ~ ' + call.endTime + ' )</button>';
            $('#recordList').append(html).show();
        }
        
        if(typeof setChatBox === 'function') {
        	setChatBox('통화수신 대기중입니다.');
    	}
        
    }
	
}

/**
* 콜 상태 변경 이벤트
*/
function callbackCallStateChanged(data) {
    console.log('view.control, callbackCallStateChanged - ', JSON.stringify(data || {}));

}

/**
* 녹취 정보 변경 이벤트
*/
function callbackRecordInfoChanged(data) {
	
	//kw---20240223 : 녹취 키 들어오면 바로 업데이트 할 수 있도록 기능 추가
	// xbox.control.recordUpdate(data);
	
    console.log('view.control, callbackRecordInfoChanged - ', JSON.stringify(data || {}));
    
	/*
	// 녹취 파일 목록 추가
	//if (data.recordId && data.startTime && data.endTime) {
        var call = callManager.external();
        if (call && call.recordId) {
            var html = '';
            html += '<button class="btn btn-info" id="btnRecordPlay" data-id="' + call.recordId + '">녹취 재생 ( ' + call.startTime + ' ~ ' + call.endTime + ' )</button>';
            $('#recordList').append(html).show();
        }
    //}
	*/
}


