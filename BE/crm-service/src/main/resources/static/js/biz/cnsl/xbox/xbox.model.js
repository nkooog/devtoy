
// xbox.model.js

var xbox = (function (xboxExports) {
    'use strict';
    
    /**
    * model
    */
    xboxExports.model = (function (exports) {
                
        // 콜 정보
        function callItem() {
            this.process = '';              // 콜 구분(external, internal, transfer, conference)
            this.interactionId = '';       // 콜아이디
            this.ani = '';                    // 발신번호(인바운드 콜인 경우에 CIC에서 값을 얻을 수 있음)
            this.dnis = '';                   // 착신번호(인바운드 콜인 경우에 CICI에서 값을 얻을 수 있음)
            this.callDirection = '';         // I:인바운드, O:아웃바운드
            this.callType = '';              // I:내부콜, E:외부콜
            this.serviceCode = '';         // 서비스코드
            this.remote = '';                // 고객전화번호(IN/OUT 둘다 사용됨, '010'으로 시작하는 번호는 앞의 '0'이 빠져서 옵니다.)
            this.telNumber = '';           // 상대방전화번호(callDirection을 확인하고 ani, remote 중에서 설정됩니다.)
            this.customerId = '';          // 고객 아이디
            this.customNumber = '';     // 고객 커스텀번호,
            this.hasConnected = false;		// 콜 연결(Connected) 여부, 콜 연결 중(Alerting, Proceeding) 끊겼다면 false입니다.
            this.hasDirectCall = false;      // 전화기 직접 사용했는지 여부 확인
            this.recordId = ''; 		    // 녹취 아이디
            this.startTime = '';            // 녹취 시작 시간
            this.endTime = '';              // 녹취 종료 시간
			this.callAttemptsNumber = '';	// 통화 시도 횟수
			this.callResponseNumber = '';	// 응답 횟수
        };

        /**
        * 콜 정보 옵션
        */
        exports.call = {
            newItem: function () {
                return new callItem();
            }
        };

        /**
        * 콜 관리
        */
        exports.callManager = {
            list: [],                               // 콜 목록
            activeInteractionId: '',           // 현재 활성화 콜
            externalInteractionId: '',        // 외부 콜(고객 콜)
            internalInteractionId: '', 		// 내부 콜(상담원 콜 : 호전환 또는 3자통화 대상 콜아이디)
            transferInteractionId: '',        // 호전환 콜아이디
            conferenceId: '', 		            // 대화방 룸 ID
            conferenceInteractionId: '',    // 3자통화 콜아이디

            /**
            * 콜 목록에 콜 정보 추가
            * @param {Object} callItem 콜 정보
            */
            add: function (callItem) {                
                // 내/외부 콜 구분
                if (callItem.callType == 'I') {
                    callItem.process = 'internal';
                } else {
                    callItem.process = 'external';
                }

                // 호전환/3자통화 구분
                if (callItem.interactionId == this.transferInteractionId) {
                    callItem.process = 'transfer';
                } else if (callItem.interactionId == this.conferenceInteractionId) {
                    callItem.process = 'conference';
                }

                // 등록 된 콜아이디가 없다면 추가
                if (!this.exists(callItem.interactionId)) {
                    // 최초 콜인 경우(고객 콜)
                    if (this.count() == 0 && callItem.callType == 'E') {
                        this.externalInteractionId = callItem.interactionId;
                    }
                    this.list.push(callItem);
                }
            },

            /**
            * 콜 목록에서 콜 정보 삭제
            * @param {Object} callItem 콜정보
            */
            remove: function (interactionId) {
                var index = -1;
                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i].interactionId == interactionId) {
                        index = i;
                    }
                }

                if (index != -1) {
                    this.list.splice(index, 1);
                }
            },

            /**
            * 콜 정보 조회
            * @param {String} interactionId 콜아이디
            */
            get: function (interactionId) {
                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i].interactionId == interactionId) {
                        return this.list[i];
                    }
                }

                return null;
            },

            /**
            * 콜 목록에서 인덱스의 항목 반환
            * @param {String} index 인덱스
            */
            index: function (index) {
                if (index > -1 && this.list.length > index) {
                    return this.list[index];
                }
                return null;
            },

            /**
            * 콜 목록의 항목 수 반환
            */
            count: function () {
                return this.list.length;
            },

            /**
            * 콜 목록에 요청한 콜 정보가 존재하는지 여부
            * @param {Object} interactionId 콜아이디
            */
            exists: function (interactionId) {
                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i].interactionId == interactionId)
                        return true;
                }
                return false;
            },

            /**
            * 콜 목록이 없으면 초기화
            */
            prepare: function () {
                if (this.list.length == 0) {
                    this.clear();
                }
            },

            /**
            * 콜 목록 초기화
            */
            clear: function () {
                this.list = [];
                this.activeInteractionId = '';
                this.externalInteractionId = '';
                this.internalInteractionId = '';
                this.transferInteractionId = '';
                this.conferenceId = '';
                this.conferenceInteractionId = '';
            },

            /**
            * 외부콜(최초) 통화 정보
            */
            external: function () {
                console.log('callManager.external() - interactionId : ' + this.externalInteractionId);
                var call = this.get(this.externalInteractionId);
                if (call == null) {
                    call = this.index(0);
                    console.log('callManager.external() - index');
                }

                console.log('callManager.external() - call : ' + JSON.stringify(call || {}));
                return call;
            }
        }

        return exports;
    }(xboxExports.model || {}));

    return xboxExports;
}(xbox || {}));
