
// xbox.util.js

var xbox = (function (xboxExports) {
    'use strict';
    
    /**
    * util
    */
    xboxExports.util = (function (exports) {
        
        /**
        * console.log
        * @param {String} message 기록 내용
        */
        exports.log = function (message) {
            console.log(message);
        };

        /**
        * Object 객체를 JSON.stringify 함수를 사용해 Json 문자열 변환 가능한지 확인합니다.
        * @param {Object} obj Object 객체
        */
        exports.tryParseJson = function (obj) {
            try {
                JSON.parse(obj);
            } catch (err) {
                this.log('xbox.util.tryParseJson Error - ' + err);
                return false;
            }
            return true;
        }

        /**
        * Object 객체를 JSON.stringify 함수를 사용해 Json 문자열로 변환합니다.
        * IE8에서 JSON.stringify 함수를 사용시 Unicode 문자는 코드(\u...) 값으로 반환하기에 올바른 문자로 변환하는 작업을 수행합니다.
        * @param {Object} obj Object 객체
        */
        exports.objectToJson = function (obj) {
            var stringified = JSON.stringify(obj || {});
            return unescape(stringified.replace(/\\u/g, '%u'));
        }

        /**
        * Object 객체를 Boolean 형식으로 변환합니다.
        * @param {Object} obj Object 객체
        */
        exports.parseBool = function (obj) {
            if (obj == null) { return false; }

            if (typeof obj === 'boolean') {
                return (obj === true);
            }

            if (typeof obj === 'string') {
                if (obj == '') { return false; }

                obj = obj.replace(/^\s+|\s+$/g, '');
                if (obj.toLowerCase() == 'true' || obj.toLowerCase() == 'yes') {
                    return true;
                }

                obj = obj.replace(/,/g, '.');
                obj = obj.replace(/^\s*\-\s*/g, '-');
            }

            if (!isNaN(obj)) { return (parseFloat(obj) != 0); }

            return false;
        };

        /**
        * Replace ALL
        * @param {String} str 문자열
        * @param {String} searchStr 바꿀문자
        * @param {String} replaceStr 바뀌어질 문자
        */
        exports.replaceAll = function (str, searchStr, replaceStr) {
            try {
                if (!str) { return ''; }
                return str.split(searchStr).join(replaceStr);
            } catch (err) {
                this.log('xbox.util.replace Error - ' + err);
                return '';
            }
        };

        /**
        * ajax : get
        * @param {String} url 요청 URL
        * @param {Object}  data 파라미터
        * @param {Function}  callback 콜백함수
        */
        exports.get = function (url, data, callback) {
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                data: data,
                success: callback,
                error: function () {
                    alert('HTTP 500 - InternalServerError');
                }
            });
            return false;
        };

        /**
        * ajax : post
        * @param {String} url 요청 URL
        * @param {Object}  data 파라미터
        * @param {Function}  callback 콜백함수
        */
        exports.post = function (url, data, callback) {
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: data,
                success: callback,
                error: function () {
                    alert('HTTP 500 - InternalServerError');
                }
            });
            return false;
        };

        /**
        * 아이디 체크
        * @param {String} id 아이디
        */
        exports.idExists = function (id) {
            if ($('#' + id).length > 0) {
                return true;
            }

            return false;
        };

        /**
        * 아이디
        * @param {String} id 아이디
        */
        exports.id = function (id) {
            if (id.indexOf('#') == 0) {
                id = id.substring(1);
            }
            return $('#' + id);
        };

        /**
        * 로컬의 현재시간
        */
        exports.nowDateTime = function () {
            var dttm = new Date();
            var result =
                addFrontZero(dttm.getFullYear(), 4) + '-'
                + addFrontZero(dttm.getMonth() + 1, 2) + '-'
                + addFrontZero(dttm.getDate(), 2) + ' '
                + addFrontZero(dttm.getHours(), 2) + ':'
                + addFrontZero(dttm.getMinutes(), 2) + ':'
                + addFrontZero(dttm.getSeconds(), 2) + '.'
                + dttm.getMilliseconds();

            return result;
        };

        // Left Padding
        function addFrontZero(value, digits) {
            var result = '';
            value = value.toString();
            if (value.length < digits) {
                for (var i = 0; i < digits - value.length; i++) {
                    result += '0';
                }
            }
            result += value;
            return result;
        }

        return exports;
    }(xboxExports.util || {}));

    return xboxExports;
}(xbox || {}));
