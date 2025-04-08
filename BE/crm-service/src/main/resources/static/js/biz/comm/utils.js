/***********************************************************************************************
 * Program Name : utils 공통 함수
 * Creator      : jrlee
 * Create Date  : 2022 .02 .22
 * Description  : 공통 함수
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 *
 ************************************************************************************************/
var arrWin = Array(); // 팝업창 관리

var CMMN_INPUT_DATE = new Object();
var CMMN_SEARCH_DATE = new Object();
var CMMN_SEARCH_TENANT = new Object();
var CMMN_SEARCH_AUTO_COMPLETE = new Object();
var CMMN_USER_FIND_MULTI = new Object()
var TEMPLATE_BASE = new Object();

// 인터벌 관리용 객체
var intervalMap = {};

var Utils = (function () {
    var kendoPopInstances = new Array();
    var callbackFunctions = new Object();
    // var ajaxList = new Array();
    return {
        /**
         * 공통 ajax 요청
         *
         * @param {string} url 요청url
         * @param {string} param 파라메터
         * @param {function} callback 콜백함수
         * @param {function} beforeFn 요청전함수
         * @param {function} completeFn 완료함수
         * @param {function} errorFn 에러함수
         */
        ajaxCall: function (url, param, callback, beforeFn, completeFn, errorFn) {
            // TODO : ajax 같은 URL 동시 호출 막는것 추가 테스트 후 배포
            // ajaxList.push(url);
            // if(ajaxList.filter(x => x.url == url).length > 2){
            //     return;
            // }

            $.ajax({
                url: GLOBAL.contextPath + url,
                type: "post",
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                data: param,
                success: function (result) {
                    // ajaxList.pop(url);
                    if (typeof callback === "function") {
                        callback(result);
                    }
                },
                error: function (request, status, error) {
                    // ajaxList.pop(url);
                    if (typeof errorFn === "function") {
                        errorFn(request);
                    }
                    console.log(typeof request.responseText);
                    Utils.alert(JSON.parse(request.responseText).message);
                    console.log("[error]");
                    console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                },
                beforeSend: function (jqXHR) {
                    if (typeof beforeFn === "function") {
                        beforeFn();
                    }
                },
                complete: function (jqXHR) {
                    if (typeof completeFn === "function") {
                        completeFn();
                    }
                }
            });
        },
        /**
         * 동기 ajax 요청
         *
         * @param {string} url 요청url
         * @param {string} param 파라메터
         * @param {function} callback 콜백함수
         * @param {function} beforeFn 요청전함수
         * @param {function} completeFn 완료함수
         * @param {function} errorFn 에러함수
         */
        ajaxSyncCall: function (url, param, callback, beforeFn, completeFn, errorFn) {
            $.ajax({
                url: GLOBAL.contextPath + url,
                type: "post",
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                async: false,
                data: param,
                success: function (result) {

                    if (typeof callback === "function") {
                        callback(result);
                    }
                },
                error: function (request, status, error) {
                    if (typeof errorFn === "function") {
                        errorFn();
                    }
                    console.log("[error]");
                    console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                },
                beforeSend: function (jqXHR) {
                    if (typeof beforeFn === "function") {
                        beforeFn();
                    }
                },
                complete: function (jqXHR) {
                    if (typeof completeFn === "function") {
                        completeFn();
                    }
                }
            });
        },
        /**
         * formData ajax 요청
         *
         * @param {string} url 요청url
         * @param {formData} param 파라메터
         * @param {function} callback 콜백함수
         * @param {function} beforeFn 요청전함수
         * @param {function} completeFn 완료함수
         * @param {function} errorFn 에러함수
         */
        ajaxCallFormData: function (url, param, callback, beforeFn, completeFn, errorFn) {
            $.ajax({
                url: GLOBAL.contextPath + url,
                type: "post",
                dataType: "json",
                enctype: 'multipart/form-data',  //필수
                cache: false,                  //필수
                contentType: false,                  //필수
                processData: false,                  //필수
                timeout: 18000,                   //필수
                data: param,
                success: function (result) {
                    if (typeof callback === "function") {
                        callback(result);
                    }
                },
                error: function (request, status, error) {
                    if (typeof errorFn === "function") {
                        errorFn();
                    }
                    console.log("[error]");
                    console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                },
                beforeSend: function (jqXHR) {
                	jqXHR.setRequestHeader("ajaxhost","ncrm");		//필수 : interceptor 사용 시 ajax를 이요한 파일 업로드 허용                	
                    if (typeof beforeFn === "function") {
                        beforeFn();
                    }
                },
                complete: function (jqXHR) {
                    if (typeof completeFn === "function") {
                        completeFn();
                    }
                }
            });
        },
        /**
         * fileDownload ajax 요청
         *
         * @param {string} url 요청url
         * @param {string} path 파일경로
         * @param {string} idxNm 파일인덱스명
         * @param {formData} param 파라메터
         * @param {function} callback 콜백함수
         * @param {function} beforeFn 요청전함수
         * @param {function} completeFn 완료함수
         * @param {function} errorFn 에러함수
         */
        ajaxCallFileDownload: function (url, path, idxNm, callback, beforeFn, completeFn, errorFn) {
            $.ajax({
                url: GLOBAL.contextPath + url + "?urlPath=" + path + "&fileName=" + idxNm,
                type: "get",
                cache: false,
                xhrFields: {
                    responseType: "blob",
                },
                success: function (result) {
                    if (typeof callback === "function") {
                        callback(result);
                    }
                },
                error: function (request, status, error) {
                    if (typeof errorFn === "function") {
                        errorFn();
                    }
                    console.log("[error]");
                    console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                },
                beforeSend: function (jqXHR) {
                    if (typeof beforeFn === "function") {
                        beforeFn();
                    }
                },
                complete: function (jqXHR) {
                    if (typeof completeFn === "function") {
                        completeFn();
                    }
                }
            });
        },

        openCsrfPop: function (url, targetName, w, h, param, isChildOpen) {
            let _paramObject = {lang: $.trim(GLOBAL.session.user.mlingCd)};
            if (this.isObject(param)) {
                var _objectKeys = Object.keys(param);
                for (let i = 0; i < _objectKeys.length; i++) {
                    _paramObject[_objectKeys[i]] = param[_objectKeys[i]];
                }
            }

            let _params = $.param(_paramObject);
            let _url = url;

            let dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
            let dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
            let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            if (isChildOpen) {
                width = window.parent.innerWidth;
                height = window.parent.innerHeight;
            }

            let left = ((width / 2) - (w / 2)) + dualScreenLeft;
            let top = ((height / 2) - (h / 2)) + dualScreenTop;

            let newWindow = window.open(_url, targetName, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

            $.ajax({
                url : _url,
                method : 'post',
                dataType : 'html',
                data : JSON.stringify(param),
                success : function (response) {
                    newWindow.document.open();
                    newWindow.document.write(response);
                    newWindow.document.close();
                    arrWin.push(newWindow);
                    if (window.focus) {
                        newWindow.focus();
                    }
                },
            });
            return newWindow;
        },

        /**
         * 팝업형태로 새창을 오픈합니다.
         * GetUrl 로 Parmater를 전송한다.
         * 2023.07 이후 신규 코드 작성시 사용 지양
         * @param {string} url 오픈url
         * @param {string} targetName 팝업이름
         * @param {number} w 팝업넓이
         * @param {number} h 팝업높이
         * @param {Object} param 전송 파라메터
         * @param {booleam} isChildOpen 팝업 Open 위치 true <-자식창 오픈
         */
        openPop: function (url, targetName, w, h, param, isChildOpen) {
       		let _paramObject = {lang: $.trim(GLOBAL.session.user.mlingCd)};
            if (this.isObject(param)) {
                var _objectKeys = Object.keys(param);
                for (let i = 0; i < _objectKeys.length; i++) {
                    _paramObject[_objectKeys[i]] = param[_objectKeys[i]];
                }
            }

            let _params = $.param(_paramObject);
            let _url = url + "?" + _params;

            let dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
            let dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
            let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            if (isChildOpen) {
             width = window.parent.innerWidth;
             height = window.parent.innerHeight;
            }

            let left = ((width / 2) - (w / 2)) + dualScreenLeft;
            let top = ((height / 2) - (h / 2)) + dualScreenTop;

            let newWindow = window.open(_url, targetName, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

            if(Utils.isNotNull(window.opener)) {
                window.opener.arrWin.push(newWindow);
            }else {
                arrWin.push(newWindow);
            }

            if (window.focus) {
                newWindow.focus();
            }
            return newWindow;

        },
        /**
         * 팝업형태로 새창을 오픈합니다
         * LocalStorage 를 사용하여 Parmater를 전송한다.
         * 2023.07 이후 신규 코드 작성시 사용 지향
         * @param {string} url 오픈url
         * @param {string} targetName 팝업이름
         * @param {number} w 팝업넓이
         * @param {number} h 팝업높이
         * @param {object|boolean} pos 팝업 포지션 {x:number y:number} = 해당 포지션에 팝업 오픈 | false = 센터 오픈
         * @param {Object} param 추가파라메터
         * @param {booleam} isChildOpen 팝업 Open 위치 true <-자식창 오픈
         */
        openPopV2: function (url, targetName, w, h, pos, param, isChildOpen) {

            let dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
            let dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
            let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            if (isChildOpen) {
                width = window.parent.innerWidth;
                height = window.parent.innerHeight;
            }

            let x = ((width / 2) - (w / 2)) + dualScreenLeft;
            let y = ((height / 2) - (h / 2)) + dualScreenTop;

            if(this.isObject(pos)){
                x = pos.x + dualScreenLeft;
                y = pos.y + dualScreenTop;
            }

            let newWindow = window.open(url, targetName, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, ' +
                'width=' + w + ', height=' + h + ', top=' + y + ', left=' + x);

            if(param != null || param != undefined){
                localStorage.setItem(targetName, JSON.stringify(param));
            }
            arrWin.push(newWindow);

            if (window.focus) {
                newWindow.focus();
            }

            return newWindow;
        },

        /**
         * 팝업에서 부모창에서 넘긴 데이터를 찾아온다;
         * @param {string} targetName 팝업이름
         * @return {object} Data
         */
        getPopV2Param: function(targetName){
            let data = localStorage.getItem(targetName);
            localStorage.removeItem(targetName);
            return JSON.parse(data);
        },
        /**
         * 현재 url에 포함된 특정 parameter의 값을 추출
         *
         * @param {string} param parameter
         * @returns {string|number|null}
         */
        getUrlParam: function (param) {
            var results = new RegExp('[\?&]' + param + '=([^&#]*)').exec(window.location.href);

            if (results == null) {
                return null;
            } else {
                return decodeURI(results[1]) || 0;
            }
        },
        /**
         * input 태그에서 입력 된 값 중 숫자만 입력이 가능 하도록 처리
         * 용법 : <input type="text" onkeypress='return Utils.onlyNumber(event)'/>
         *
         * @param :event
         * @returns number
         */
        onlyNumber: function (event) {
            if (event.key >= 0 && event.key <= 9) {
                return true;
            }
            return false;
        },
        /**
         * 원하는 코드의 코드명을 가져온다.
         * 해당 코드가 없으면 코드를 그대로 리턴.
         *
         * @param {Object[]} codeList 전체코드배열
         * @param {string} mgntItemCd 특정코드그룹
         * @param {string} comCd 코드
         * @returns {string}
         */
        getComCdNm: function (codeList, mgntItemCd, comCd) {
            var comCdNm = comCd;
            var code = codeList.find(function (code) {
                return code.mgntItemCd == mgntItemCd && code.comCd == comCd;
            });

            if (code && !this.isNull(code.comCdNm)) {
                comCdNm = code.comCdNm;
            }

            return comCdNm;
        },
        /**
         * 원하는 코드의 서브 코드를 가져온다.
         * 해당 코드가 없으면 코드를 그대로 리턴.
         *
         * @param {Object[]} codeList 전체코드배열
         * @param {string} mgntItemCd 특정코드그룹
         * @param {string} comCd 코드
         * @returns {string}
         */
        getComCdSubMgntitem: function (codeList, mgntItemCd, comCd) {
            var subMgntItemCd = comCd;
            var code = codeList.find(function (code) {
                return code.mgntItemCd == mgntItemCd && code.comCd == comCd;
            });

            if (code && !this.isNull(code.subMgntItemCd)) {
                subMgntItemCd = code.subMgntItemCd;
            }

            return subMgntItemCd;
        },
        /**
         * 확인 대상이 Object인지 확인
         *
         * @param {any} obj 확인대상
         * @returns {boolean} 결과
         */
        isObject: function (obj) {
            if (this.isNull(obj)) {
                return false;
            }
            if (Array.isArray(obj)) {
                return false;
            }

            return typeof obj === 'object';
        },
        /**
         * 공백임을 체크
         *
         * @param {string} str 문자열
         * @returns {boolean}
         */
        isNull: function (str) {
            return undefined == str || "undefined" == str ||'' == str || null == str || "null" == str;
        },
        /**
         * 공백이 아님을 체크
         *
         * @param {string} str 문자열
         * @returns {boolean}
         */
        isNotNull: function (str) {
            return !this.isNull(str);
        },
        /**
         * 공백 제거
         *
         * @param {string} str 문자열
         * @returns {string}
         */
        removeBlank: function (str) {
            return str.replace(/ /gi, "");
        },
        /**
         * (kendo) alert
         *
         * @param {string} content 내용
         * @param {function} callback 확인콜백
         */
        alert: function (content, callback) {
            var target = (self !== top) ? parent : window;
            var kendoAlert = target.$("<div></div>").kendoAlert({
                minWidth: "400px",
                maxWidth: "800px",
                title: HEAD_langMap.get("alert.title"),
                content: content,
                messages: {
                    okText: HEAD_langMap.get("alert.message.OK"),
                },
                actions: [{
                    action: function (e) {
                        if (typeof callback === "function") {
                            callback();
                        }
                    }
                }]
            }).data("kendoAlert");

            kendoAlert.open();

            kendoPopInstances.push(kendoAlert);
        },
        /**
         * (kendo) confirm
         *
         * @param {string} content 내용
         * @param {function} callback 확인콜백
         * @param {function} cancelCallback 취소콜백
         */
        confirm: function (content, callback, cancelCallback) {
            var target = (self !== top) ? parent : window;
            var kendoConfirm = target.$("<div></div>").kendoConfirm({
                minWidth: "400px",
                title: HEAD_langMap.get("alert.message.OK"),
                content: content,
                messages: {
                    okText: HEAD_langMap.get("alert.message.OK"),
                    cancel: HEAD_langMap.get("alert.message.cancle")
                }
            }).data("kendoConfirm");

            kendoConfirm.open().result.done(function () {
                if (typeof callback === "function") {
                    callback();
                }
            }).fail(function () {
                if (typeof cancelCallback === "function") {
                    cancelCallback();
                }
            });

            kendoPopInstances.push(kendoConfirm);
        },
        /**
         * (kendo) KendoMultiSelect 구성 : 공통코드용
         *
         * @param {Object[]} codeList 전체코드배열
         * @param {string} mgntItemCd 특정코드그룹
         * @param {string} target 선택자
         * @param {boolean} multiLabel 표기방식
         * @param {string[]} initValues 선택값배열
         * @returns {kendoDropDownList} 인스턴스
         */
        setKendoMultiSelect: function (codeList, mgntItemCd, target, multiLabel, initValues) {
            let options = {
                placeholder: HEAD_langMap.get("combo.select"),
                dataTextField: "text",
                dataValueField: "value",
                autoClose: false,
                // autoBind: false,
                dataSource: codeList.filter(function (code) {
                    if (code.mgntItemCd == mgntItemCd) {
                        code.text = code.comCdNm;
                        code.value = code.comCd;

                        return code;
                    }
                }),
                itemTemplate: '<p class="multiCheck">#: text #</p>'
            };
            if (!multiLabel) {
                options.tagMode = "single";
            }

            let kendoMultiSelect = $(target).kendoMultiSelect(options).data("kendoMultiSelect");

            kendoMultiSelect.ul.addClass('multiSelect');
            kendoMultiSelect.input.attr("readonly", true);
            kendoMultiSelect.value(initValues);

            return kendoMultiSelect;
        },
        /**
         * (kendo) KendoMultiSelect 구성 : 일반배열용
         *
         * @param {Object[]} list 전체배열
         * @param {string} target 선택자
         * @param {string} dataTextField text필드
         * @param {string} dataValueField value필드
         * @param {boolean} multiLabel 표기방식
         * @param {string[]} initValues 선택값배열
         * @returns {kendoDropDownList} 인스턴스
         */
        setKendoMultiSelectCustom: function (list, target, dataTextField, dataValueField, multiLabel, initValues) {
            let options = {
                placeholder: HEAD_langMap.get("combo.select"),
                dataTextField: dataTextField,
                dataValueField: dataValueField,
                autoClose: false,
                // autoBind: false,
                dataSource: list,
                clearButton: false,
                itemTemplate: '<p class="multiCheck">#: ' + dataTextField + ' #</p>',
                tagMode : (!multiLabel) ? "single" : ""
            };

            let kendoMultiSelect = $(target).kendoMultiSelect(options).data("kendoMultiSelect");

            kendoMultiSelect.ul.addClass('multiSelect');
            kendoMultiSelect.input.attr("readonly", true);
            kendoMultiSelect.value(initValues);
            return kendoMultiSelect;
        },
        /**
         * (kendo) kendoComboBox 구성 : 공통코드용
         *
         * @param {Object[]} codeList 전체코드배열
         * @param {string} mgntItemCd 특정코드그룹
         * @param {string} target 선택자
         * @param {string} initValue 선택값
         * @param {boolean|string} isTotalOption 전체옵션값여부
         * @returns {kendoComboBox} 인스턴스
         */
        setKendoComboBox: function (codeList, mgntItemCd, target, initValue, isTotalOption) {
            $(target).empty()
            let dataSource = [];

            if (typeof isTotalOption === "string") {
                dataSource.push({text: isTotalOption, value: ""});
            } else if (isTotalOption != false) {
                dataSource.push({text: HEAD_langMap.get("combo.all"), value: ""});
            }

            dataSource = dataSource.concat(codeList.filter(function (code) {
                if (code.mgntItemCd == mgntItemCd) {
                    code.text = code.comCdNm;
                    code.value = code.comCd;

                    return code;
                }
            }))

            let kendoComboBox = $(target).kendoComboBox({
                dataSource: dataSource,
                dataTextField: "text",
                dataValueField: "value",
                clearButton: false,
                autoWidth: true,
                //kw---20240401 : Utils-kendocombobox 값을 선택한 뒤 'esc' 키를 입력하면 공백으로 되는 버그 관련하여 추가(esc 버튼을 누르면 0번째 아이템으로 초기화);
//                dataBound: function(e) {
//                    var comboBox = $(target).data("kendoComboBox");
//                    comboBox.input.keydown(function(e) {
//                        if (e.keyCode === 27) {
//                        	$(target).data("kendoComboBox").select(0);
//                        }
//                    });
//                }
            }).data("kendoComboBox");

            if (Utils.isNotNull(initValue)) {
                kendoComboBox.value(initValue);
            } else {
                if (dataSource.length > 0)
                    kendoComboBox.value(dataSource[0].value);
            }

            kendoComboBox.input.attr("readonly", true);

            return kendoComboBox;
        },
        /**
         * (kendo) kendoComboBox 데이터 변경  : 공통코드용
         *
         * @param {Object[]} codeList 전체코드배열
         * @param {string} mgntItemCd 특정코드그룹
         * @param {kendoComboBox} target 생성된 kendoComboBox
         * @param {string} initValue 선택값
         * @param {boolean|string} isTotalOption 전체옵션값여부
         */
        changeKendoComboBoxDataSource: function (codeList, mgntItemCd, target, initValue, isTotalOption) {
            let dataSource = [];

            if (typeof isTotalOption === "string") {
                dataSource.push({text: isTotalOption, value: ""});
            } else if (isTotalOption != false) {
                dataSource.push({text: HEAD_langMap.get("combo.all"), value: ""});
            }

            dataSource = dataSource.concat(codeList.filter(function (code) {
                if (code.mgntItemCd == mgntItemCd) {
                    code.text = code.comCdNm;
                    code.value = code.comCd;
                    return code;
                }
            }));

            target.setDataSource(new kendo.data.DataSource({data: dataSource}));

            if (Utils.isNotNull(initValue)) {
                target.value(initValue);
            } else {
                if (dataSource.length > 0)
                    target.value(dataSource[0].value);
            }
            target.input.attr("readonly", true);
        },
        /**
         * (kendo) kendoComboBox 구성 : 일반배열용
         *
         * @param {Object[]} list 전체코드배열
         * @param {string} target 선택자
         * @param {string} dataTextField text필드
         * @param {string} dataValueField value필드
         * @param {string} initValue 선택값
         * @param {boolean|string} isTotalOption 전체옵션값여부
         * @returns {kendoComboBox} 인스턴스
         */
        setKendoComboBoxCustom: function (list, target, dataTextField, dataValueField, initValue, isTotalOption) {
            let dataSource = [];

            if(dataTextField == dataValueField){
                //dataTextField 와 dataValueField 가 같을 경우 임시로 필드를 추가하여 처리
                //이렇게 하지않으면 isTotalOption 값 표현 할 수없음.
                list.forEach(obj => {
                    obj[dataValueField+"_tmp"] = obj[dataValueField];
                    dataValueField = dataValueField + "_tmp";
                });
            }

            if (typeof isTotalOption === "string") {
                let object = new Object();
                object[dataTextField] = isTotalOption;
                object[dataValueField] = "";

                dataSource.push(object);
            } else if (isTotalOption != false) {
                let object = new Object();
                object[dataTextField] = HEAD_langMap.get("combo.all");
                object[dataValueField] = "";

                dataSource.push(object);
            }

            dataSource = dataSource.concat(list);

            let kendoComboBox = $(target).kendoComboBox({
                dataSource: dataSource,
                dataTextField: dataTextField,
                dataValueField: dataValueField,
                clearButton: false,
                height : 500,
            }).data("kendoComboBox");

            if (Utils.isNotNull(initValue)) {
                kendoComboBox.value(initValue);
            } else {
                if (dataSource.length > 0)
                    kendoComboBox.value(dataSource[0][dataValueField]);
            }

            kendoComboBox.input.attr("readonly", true);

            return kendoComboBox;
        },
        /**
         * (kendo) kendoComboBox 데이터 변경 : 일반배열용
         *
         * @param {Object[]} list 전체코드배열
         * @param {Object} target 선택자
         * @param {string} dataTextField text필드
         * @param {string} dataValueField value필드
         * @param {string} initValue 선택값
         * @param {boolean|string} isTotalOption 전체옵션값여부
         * @returns {kendoComboBox} 인스턴스
         */
        changeKendoComboBoxDataSourceCustom: function (list, target, dataTextField, dataValueField, initValue, isTotalOption) {
            let dataSource = [];

            if (typeof isTotalOption === "string") {
                let object = new Object();
                object[dataTextField] = isTotalOption;
                object[dataValueField] = "";

                dataSource.push(object);
            } else if (isTotalOption != false) {
                let object = new Object();
                object[dataTextField] = HEAD_langMap.get("combo.all");
                object[dataValueField] = "";

                dataSource.push(object);
            }

            dataSource = dataSource.concat(list);


            target.setDataSource(new kendo.data.DataSource({data: dataSource}));

            if (Utils.isNotNull(initValue)) {
                target.value(initValue);
            } else {
                if (dataSource.length > 0)
                    target.value(dataSource[0][dataValueField]);
            }
            target.input.attr("readonly", true);
        },
        /**
         * (kendo) kendoComboBox의 클리어버튼 추가.
         *
         * @param kendoInstance 켄도콤보인스턴스
         * @returns {kendoInstance} 켄도콤보인스턴스
         */
        addComboClearButton: function (kendoInstance) {
            kendoInstance.setOptions(kendoInstance.options.clearButton = true);
            kendoInstance.refresh();

            return kendoInstance;
        },
        /**
         * (kendo) iframe 형식의 kendoWindow 팝업
         *
         * 팝업 내부에서 부모창 접근시 parent로 호출필요
         *
         * @param {string} url 경로
         * @param {number} width 가로
         * @param {number} height 세로
         * @param {string} position 기준위치(left|right|center)
         * @param {number} distance 기준부터의거리
         * @param {number} top 상단거리
         * @param {string|boolean} title 타이틀
         * @param {Object} param 추가파라메터
         * @returns {kendoWindow} instance
         */
        openKendoWindow: function (url, width, height, position, distance, top, title, param) {
            let timeStamp = Math.floor(Math.random() * 100).toString() + new Date().getTime();
            let paramObject = {
                lang: $.trim(GLOBAL.session.user.mlingCd),
                id: timeStamp
            };
            if (this.isObject(param)) {
                $.extend(paramObject, param);
            }
            let _url = GLOBAL.contextPath + url + "?" + $.param(paramObject);

            var kendoWindow = $("<div id='" + timeStamp + "'></div>").kendoWindow({
                title: title,
                modal: true,
                visible: false,
                draggable: false,
                resizable: false,
                width: width,
                height: height,
                iframe : false,
                actions: ["Refresh", "Close"],
                open: function(e) {
                    let overlay = $("<div class='custom-overlay'></div>");
                    overlay.css({
                        "z-index": e.sender.wrapper.css("z-index") - 1,
                        "position": "fixed",
                        "top": 0,
                        "left": 0,
                        "width": "100%",
                        "height": "100%",
                    });
                    $("body").append(overlay);

                    setTimeout(() => $('.k-overlay').remove(), 100);
                },
                activate: function() { // 메인화면 클릭시 윈도우 닫기
                    $(".custom-overlay").on("click", function () {
                        kendoWindow.close();
                        $(".custom-overlay").remove();
                    });
                    $("button.popClose").on("click", function() {
                        kendoWindow.close();
                        $(".custom-overlay").remove();
                    });

                },
                deactivate: function (e) {
                    this.destroy()
                }
            }).data("kendoWindow");

            $.ajax({
                url : GLOBAL.contextPath + url,
                method:"POST",
                dataType : 'html',
                data : $.param(paramObject),
                success: function(response ) {
                    kendoWindow.content(response);
                    document.getElementById(timeStamp).classList.remove('k-window-content');

                    if (position == "center") {
                        kendoWindow.center().open();
                    }else{
                        if (position == "right") {
                            kendoWindow.wrapper.css({top: top, left: "auto", right: distance});
                        } else {
                            kendoWindow.wrapper.css({top: top, left: distance});
                        }
                        kendoWindow.open();
                    }
                    kendoPopInstances.push(kendoWindow);
                },
                error: function (request, status, error) {
                }
            });
            return kendoWindow;
        },
        /**
         * (kendo) iframe 형식의 kendoWindow 팝업
         *
         * 팝업 내부에서 부모창 접근시 parent로 호출필요
         *
         * @param {string} url 경로
         * @param {number} width 가로
         * @param {number} height 세로
         * @param {string} position 기준위치(left|right|center)
         * @param {number} distance 기준부터의거리
         * @param {number} top 상단거리
         * @param {string|boolean} title 타이틀
         * @param {Object} param 추가파라메터
         * @returns {kendoWindow} instance
         */
        openKendoWindow_notRefresh: function (url, width, height, position, distance, top, title, param) {
            let timeStamp = Math.floor(Math.random() * 100).toString() + new Date().getTime();
            let paramObject = {
                lang: $.trim(GLOBAL.session.user.mlingCd),
                id: timeStamp
            };
            if (this.isObject(param)) {
                $.extend(paramObject, param);
            }
            let _url = GLOBAL.contextPath + url + "?" + $.param(paramObject);

            let kendoWindow = $("<div id='" + timeStamp + "'></div>").kendoWindow({
                content: _url,
                title: title,
                modal: true,
                iframe: true,
                visible: false,
                draggable: false,
                resizable: true,
                width: width,
                height: height,
                actions: [ "Close"],
                activate: function() { // 메인화면 클릭시 윈도우 닫기
                    $(".k-overlay").on("click", function () {
                        kendoWindow.close();
                    });
                },
                deactivate: function (e) {
                    this.destroy()
                }
            }).data("kendoWindow");

            if (position == "center") {
                kendoWindow.center().open();
            } else {
                if (position == "right") {
                    kendoWindow.wrapper.css({top: top, left: "auto", right: distance});
                } else {
                    kendoWindow.wrapper.css({top: top, left: distance});
                }
                kendoWindow.open();
            }

            kendoPopInstances.push(kendoWindow);

            return kendoWindow;
        },
        /**
         * (kendo) kendoWindow 팝업 닫기
         *
         * @param {*[][]} id 아이디
         */
        closeKendoWindow: function (id) {
            if (self !== top) {
                parent.$("#" + id).data("kendoWindow").close();
            } else if (self.opener) {
                window.close();
            } else {
                $("#" + id).data("kendoWindow").close();
            }
        },
        /**
         * (kendo) 모든 켄도창들을 강제로 닫는다.
         * alert, confirm, window
         */
        closeAllKendoPopup: function () {
            for (const x in kendoPopInstances) {
                var instance = kendoPopInstances[x];
                instance.close();
            }

            kendoPopInstances = new Array();
        },
        /**
         * 모든 팝업창을 닫는다.
         * 윈도우 팝업, 켄도 팝업
         */
        closeAllPopup: function () {
            var windowPopInstances = arrWin;

            for (const i in windowPopInstances) {
                windowPopInstances[i].close();
            }

            this.closeAllKendoPopup();
        },
        /**
         * 현재 팝업 상태에 따른 부모창 접근자를 리턴
         *
         * @returns {parent|opener|WindowProxy}
         */
        getParent: function () {
            if (self !== top) {
                return parent;
            } else if (self.opener) {
                return opener;
            } else {
                return window;
            }
        },
        /**
         * 콜백함수를 특정 키값으로 가져오기
         *
         * @param {string} key 함수키값
         * @returns {function}
         */
        getCallbackFunction: function (key) {
            return callbackFunctions[key];
        },
        /**
         * 콜백함수를 특정 키값으로 지정
         *
         * @param {string} key 함수키값
         * @param {function} callback 함수
         */
        setCallbackFunction: function (key, callback) {
            callbackFunctions[key] = callback;
        },
        /**
         * 팝업의 콜백을 가져온다. (콜백은 부모창의 함수를 말한다.)
         *
         * @param {string} key 함수키값
         * @returns {function} callback 함수
         */
        getPopupCallback: function (key) {
            let callback = Utils.getParent().Utils.getCallbackFunction(key);

            if (typeof callback === "function") {
                return callback;
            } else {
                return function () {
                    console.log("Callback not found : " + key);
                }
            }
        },
        /**
         * 리스트에서 특정컬럼의 값이 일치하는 오브젝트를 리턴
         *
         * @param {Object[]} list 리스트
         * @param {string} column 대상컬럼
         * @param {string} value 대상컬럼의값
         * @returns {Object} 오브젝트
         */
        getObjectFromList(list, column, value) {
            return list.find(function (item) {
                return item[column] == value;
            });
        },
        /**
         * 검색영역의 라벨 사이즈를 통일
         * (SearchWrap 영역 내부만 적용)
         */
        resizeLabelWidth() {
            let target = "div.k-tabstrip-content.k-content.k-state-active .SearchWrap";

            if (self.opener) {
                target = ".SearchWrap";
            }

            $(target + " .label_tit").removeAttr('style');
            $(target).each(function () {
                let labelArray = [];
                $(this).find('.label_tit').each(function () {
                    let labelW = $(this).width();
                    labelArray.push(labelW);
                });
                let maxLabel = Math.max.apply(Math, labelArray);
                $(this).find('.label_tit').css('width', maxLabel + 20);
            });
        },
        /**
         * 필수 입력 필드를 체크한다.
         * 해당 필드의 값이 없을시 색상을 변경하여 입력이 필요한 부분을 알려준다.
         *
         * @returns {boolean} 체크결과
         */
        markingRequiredField() {
            let valid = true;
            let parentDiv = "div.k-tabstrip-content.k-content.k-state-active";
            let checkRequiredArr = new Array();

            checkRequiredArr.push("input.checkRequired");
            checkRequiredArr.push("select.checkRequired");
            checkRequiredArr.push("textarea.checkRequired");

            let checkRequiredStr = checkRequiredArr.join(",");
            let $target = $(parentDiv).find(checkRequiredStr);

            if (self.opener) {
                $target = $(checkRequiredStr);
            }

            $target.each(function (index, item) {
                let targetValue = $(this).val();

                if ($(this).data("role") == "combobox") {
                    targetValue = $(this).data("kendoComboBox").value();
                }

                if (Utils.isNull(targetValue)) {
                    valid = false;

                    if ($(this).data("role") == "combobox") {
                        $(this).siblings("input").addClass("inputError");
                    } else {
                        $(this).addClass("inputError");
                    }
                } else {
                    $(this).removeClass("inputError");
                }

                $(this).off("focus").on("focus", function () {
                    $(this).removeClass("inputError");
                    $(this).off("focus");
                });
            });

            return valid;
        },
        /**
         * 팝업 그리드에서 더블클릭 시 콜백 함수로 데이터 반환
         *
         * @param {string} target 그리드 선택자
         */
        popKendoGridDoubleClickReturnData(target) {
            let callback = Utils.getUrlParam('callbackKey');
            let iframeId = Utils.getUrlParam('id');
            let grid = $(target).getKendoGrid();
            $(target + " tbody").on("dblclick", "td", function (e) {
                let selectItem = grid.dataItem(grid.select());
                Utils.getPopupCallback(callback)(selectItem);
                Utils.isNotNull(iframeId) ? Utils.closeKendoWindow(iframeId) : window.close();
            });
        },

        /**
         * 특정 그리드에 더블클릭 이벤트 주입
         *
         * @param {string} target 그리드선택자
         */
        setKendoGridDoubleClickAction(target) {
            let grid = $(target).getKendoGrid();
            let $editCell = null;

            $(target + " tbody").on("dblclick", "td", function (e) {
                if (!$(this).hasClass("k-edit-cell")) {
                    grid.editCell($(this));
                    $editCell = $(this);
                    let checkInputType = $editCell.find("input").attr("role");
                    if (Utils.isNull(checkInputType)) {
                        $(this).find("input[type=text]").select();
                    }
                }
            });
            $(target + " tbody").on("blur", "td", function (e) {
                let exceptArr = [
                    "input:checkbox",
                    "button.btnRefer_default",
                    "button.k-i-zoom-in"
                ];

                if ($(this).find(exceptArr.join(",")).length == 0) {
                    if ($(this).find(".k-focus").length == 0) {
                        grid.closeCell($(this));
                        grid.refresh();
                        $editCell = null;
                    }
                }
            });
            $(target + " tbody").on("click", "td", function (e) {
                if ($editCell && !$(this).hasClass("k-edit-cell")) {
                    $editCell.find("input").blur();
                }
            });
        },
        /**
         * 이스케이프로 변환된 태그를 HTML 태그로 변환시킨다.
         *
         * @param {string} input 이스케이프가 포함된 HTML Code
         * @returns {string}  이스케이프가 제거된 HTML Code
         */
        htmlDecode(input) {
            var doc = new DOMParser().parseFromString(input, "text/html");
            return this.removeXSS(doc.documentElement.textContent);
        },
        /**
         * List 형 데이터를 KendoTreeList 형식으로 데이터를 변환한다
         *
         * @param {any[]} MappedArr 부모코드가있는 리스트형 데이터
         * @param {string} hgrk {} 안에 부모코드 지정이름
         * @param {boolean} expanded {} 펼침여부
         * @returns {[]}  변환된 리스트
         */
        CreateTreeDataFormat(MappedArr, hgrk, expanded) {
            for (let item of MappedArr) {
                if (expanded != null) {
                    item.expanded = expanded;
                }
                item.items = [];
            }

            let treeCol = [], MappedElem;

            for (let num in MappedArr) {
                if (MappedArr.hasOwnProperty(num)) {
                    MappedElem = MappedArr[num];
                    if (MappedElem[hgrk]) {//부모코드가 있는경우
                        let hgrkNo = MappedArr.findIndex(e => e.id === MappedElem[hgrk]); // 부모조직의 인덱스 찾기
                        MappedArr[hgrkNo].items.push(MappedElem);
                    } else {//부모코드가 없을경우 -> 최상단
                        treeCol.push(MappedElem);
                    }
                }
            }

            return treeCol;
        },

        /**
         * 8자리 문자열 yyyy-MM-dd 형식으로 변환한다
         *
         * @param {string} str 8자리 문자 (ex. 20221028)
         * @returns {string} 변환된 날짜 형식의 문자열 (ex. 2022-10-28)
         */
        stringToDateFormat: function (str) {
            return str.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
        },
        /**
         * 4자리 문자열 HH:mm 형식으로 변환한다
         *
         * @param {string} str 4자리 문자 (ex. 0930)
         * @returns {string} 변환된 시간 형식의 문자열 (ex. 09:30)
         */
        stringToTimeFormat: function (str) {
            return str.replace(/(\d{2})(\d{2})/, '$1:$2');
        },

        /**
         * 테넌트 찾기 공통 팝업
         *
         * @param {event} call 호출 화면의 target element(input)
         * @param {string} target 값이 들어갈 ID 값
         * @returns {none}
         */
        fnSearchTenantNm: function (call, target) {
            const tempTenantId = call.value.toUpperCase();
            $(call).val(tempTenantId);
            if (tempTenantId.length >= 3) {
                GetTenantNm(tempTenantId, target);
            }
        },
        /**
         * 테넌트 찾기 공통 팝업
         *
         * @param {event} e 호출 화면의 target element(button)
         * @returns {none}
         */
        fnSearchTenantPopUp: function (e) {
            const target = e.previousElementSibling;
            const targetId = target.id.slice(0, target.id.indexOf('_'))
            const targetCallBackKey = ''.concat(targetId, "_fnSYSM101PCallback")
            Utils.setCallbackFunction(targetCallBackKey, function (tenantId) {
                $('#' + targetId + "_tenantId").val(tenantId);
                GetTenantNm(tenantId, targetId + "_tenantNm");
            });
            Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM101P", "SYSM101P", 900, 600, {callbackKey: targetCallBackKey})
        },

        /**
         * 특정 구문에서 특정 글자 하이라이팅 처리
         * @param {string} textContent 구문
         * @param {string} text 하이라이팅 할 텍스트
         * @param {string} backgroundColor 하이라이팅 백그라운드 색상
         * @param {string} fontColor 하이라이팅 폰트 색상
         * @returns {string} 하이라팅 추가된 Html 텍스트 코드
         */
        convertTextHighlight : function(textContent,text,backgroundColor,fontColor){
            backgroundColor = this.isNull(backgroundColor) ? "yellow": backgroundColor;
            fontColor = this.isNull(fontColor) ? "black": fontColor;
            text = this.isNull(text) ? null: text;

            return textContent.replace(new RegExp(text, 'gi'), "<mark style='background-color: "+backgroundColor+"; color:"+fontColor+";'>$&</mark>")
        },
        getContextPath() {
            var hostIndex = location.href.indexOf( location.host ) + location.host.length;
            return location.href.substring( hostIndex, location.href.indexOf('/', hostIndex + 1) );
        },
        /**
         * call : Utils.getToday("-");
         * return yyyy-mm-dd
         */
        getToday(ch) {
    	  var date = new Date();
    	  var year = date.getFullYear();
    	  var month = String(date.getMonth() + 1).padStart(2, "0");
    	  var day = String(date.getDate()).padStart(2, "0");
    	 
    	  ch = this.isNull(ch) ? "-" : ch;
    	  
    	  return year + ch + month + ch + day;
    	},

        /**
         *
         * @param {string} inputString 주민등록번호 문자열
         * @returns {{gender: (string), birth: *, msg: (string)}}
         * @example
         * 910101-1122333 => {birth: '19910101', gender: 'M'}
         * 9101012233555 => {birth: '19910101', gender: 'F'}
         * 910101333 => {birth: '', gender: '', msg: "유효하지 않은 주민등록번호 입니다."}
         * kw : 주민번호 뒷자리에서 첫번째 자리로 성별과 2000년 생인지, 1900년 생인지 알 수 있도록 수정
         */
        getBirthAndGender(inputString) {
            let birthDigit, genderDigit;
            const inValidMsg = "유효하지 않은 주민등록번호 입니다.";
            const koreanResNumberRegex = /^[0-9]{6}-?[12345678]?[0-9]{6}$/;

            const formatValid = koreanResNumberRegex.test(inputString);
            if (!formatValid) {
                return {
                    birth: "",
                    gender: "",
                    msg : inValidMsg,
                };
            }
            const formatRegex = /^(\d{6})-?(\d{7})$/;
            const match = inputString.match(formatRegex);

            if (match) {
                birthDigit = match[1];
                genderDigit = match[2].charAt(0);
            }
            let gender = genderDigit === '1' || genderDigit === '3'
            	|| genderDigit === '5' || genderDigit === '7'? 'M' : 'F';
            if (Utils.isNull(genderDigit)) {
                gender = "";
            }
            const addYearPrefix = (birthDigit) => {
                if (!/^\d{6}$/.test(birthDigit)) {
                    return null;
                }
                const yearPrefix = /^(0|1|2|5|6)/.test(genderDigit.substring(0, 1)) ? "19" : "20";
                return yearPrefix + birthDigit;
            }

            const fullBirthDay = addYearPrefix(birthDigit);
            return {
                birth: fullBirthDay,
                gender: gender,
                msg : "",
            };
        },
    	
    	//kw---20240126 : 전화번호에 하이픈 추가 및 뺴기
    	/**
        * 전화번호에 하이픈 추가 및 뺴기
        * @param {string} nTelNum - 전화번호 ('-' 하이픈 여부 상관 없음)
        * @param {string} nType - return 할 때 하이픈을 넣을 거면 1, 안 넣을거면 2 
        * @returns {string} nType에 따른 전화번호
        */
        AddHypToNumber : function(nTelNum,nType){
       	
       	let returnStr = '';
       	let telNum = nTelNum.replace(/\D/g, '');
       	
       	if(nType == 2){
       		returnStr = telNum;
       	} else {
       		let seoulNumCheck = telNum.substr(0, 2);
       		
       		if(seoulNumCheck == "02"){
       			returnStr = telNum.replace(/^(\d{2})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
       		} else {
       			returnStr = telNum.replace(/^(\d{3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
       		}
       	}
       	
       	return returnStr;     	
       	
        },
        
        //kw---20240126 : 요소에서 엔터키를 누르면 함수를 처리하도록 공통 함수 생성
        /**
         * 요소에서 엔터키를 누르면 함수를 처리하도록 공통 함수 생성
         * @param {string} nElementId	요소ID
         * @param {string} nCallback  	엔터키를 눌렀을 경우 콜백 함수 실행
         */
        
        ElementEnterKeyUp : function(nElementId, nCallback){
        	//검색 엔터키 처리
        	$("#"+nElementId).on('keyup',function(e){
        		if(e.keyCode == 13){
        			if (typeof nCallback === 'function') {
        				nCallback();
        			} else {
        				console.error('nCallback is not a function');
        			}
        		}
        	});
        },

        /**
         * @Method Name : secToTime
	     * @작성일      : 2024.04.17
	     * @작성자      : shpark
         * @Method 설명 : 초 단위를 dd HH:mm:ss 형태로 변경
         * @param       : 초단위의 long type
         * @return      : (String) dd HH:mm:ss 형식의 string 반환
         */
        secToTime : function(sec){
            lTotalTime =  sec*1;
            lDay 	= Math.floor(lTotalTime / 86400) ;
            lHour 	= Math.floor((lTotalTime - (lDay * 86400)) / 3600);
            lMin 	= Math.floor((lTotalTime - (lDay * 86400) - (lHour * 3600)) / 60);
            lSec 	= Math.floor(lTotalTime - (lDay * 86400) - (lHour * 3600) - (lMin * 60));

            if(lDay == 0)
            {
                strTime = String(lHour).padStart(2,"0")+":"+String(lMin).padStart(2,"0")+":" + String(lSec).padStart(2,"0")

            } else {
                strTime = lDay + "d " + String(lHour).padStart(2,"0")+":"+String(lMin).padStart(2,"0")+":" + String(lSec).padStart(2,"0")

            }

            return strTime
        },
        /**
         * 기존의 kindoGrid Insert는 rowNum 까지 수정하면서 insert하는 방식이 아님.
         * rowNum 200에 insert시 rowNum 이 200보다 크거나 같으면 1씩  추가
	     * @작성일      : 2024.04.17
	     * @작성자      : shpark
         * @param gridData
         * @param newObj
         * @returns {[...[], *, ...[]]}
         */
        kendoGridInsert : function(gridData , newObj){
            let tmpArr1 = []
            let tmpArr2 = []
            let tmpArr = []

            for(let i = 0; i< gridData.length; i++){
                if(gridData[i].rowNum >= newObj.rowNum){
                    gridData[i].rowNum = gridData[i].rowNum + 1
                    tmpArr2.push(gridData[i])
                }else{
                    tmpArr1.push(gridData[i])
                }
            }

            tmpArr = [...tmpArr1 , newObj ,...tmpArr2]

            return tmpArr
        },
        /**
         * 이미지를 MAX보다 작게 조절.
         * 동기처리이기때문에 callback 사용 필요
         * @작성일      : 2024.04.17
         * @작성자      : shpark
         * @param file
         * @param maxSizeInBytes
         * @param origin_nm
         * @param callback
         */
        compressImage : function(file, maxSizeInBytes, origin_nm, callback) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    let width = img.width;
                    let height = img.height;
                    let ratio = 1;

                    const step = 0.02; // 압축 단계 2프로씩 줄임.  0.1 (10%)씩 줄일 경우 100KB 근처까지도 떨어짐.
                    let compressedSize = file.size;
                    const blob = canvas.toDataURL(file.type);
                    // 압축 단계별로 크기를 확인하여 maxSizeInBytes에 가까워질 때까지 반복
                    while (compressedSize > maxSizeInBytes && ratio > 0) {
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);

                        const blob = canvas.toDataURL(file.type);
                        compressedSize = blob.length * (3 / 4); // Base64로 인코딩된 크기 계산

                        ratio -= step; // 압축 단계를 줄임

                        width *= ratio;
                        height *= ratio;
                    }

                    // 최종 압축된 이미지를 Blob으로 변환하여 콜백 함수 호출
                    canvas.toBlob(function(blob) {
                        var file = new File([blob], origin_nm, { type : blob.type});
                        callback(file);
                    }, file.type);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        },
        /**
         * 조절된 이미지를 편하게 불러오기 위한 함수
         * @작성일      : 2024.04.17
         * @작성자      : shpark
         * @param file
         * @param maxSizeInBytes
         * @param origin_nm
         * @returns {Promise<unknown>}
         */
        getCompressImage : async function (file, maxSizeInBytes, origin_nm){
            return new Promise((resolve, reject) => {
                Utils.compressImage(file, maxSizeInBytes, origin_nm, function(file) {
                    resolve(file);
                });
            });
        },
        /**
         * url으로 이미지를 불러와 정보를 불러오는 함수
         * 동기처리이기때문에 callback 사용 필요
         * @작성일      : 2024.04.17
         * @작성자      : shpark
         * @param imageUrl
         * @param origin_nm
         * @param callback
         */
        urlImgToFile : function(imageUrl, origin_nm , callback){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", imageUrl, true);
            xhr.responseType = "blob";

            xhr.onload = function () {
                if (xhr.status === 200) {
                    var blob = xhr.response;
                    var file = new File([blob], origin_nm, { type : blob.type});
                    callback(file);
                }
            };
            xhr.send();
        },
        /**
         * 불러온 이미지를 편하게 불러오기위한 함수
         * @작성일      : 2024.04.17
         * @작성자      : shpark
         * @param imageUrl
         * @param origin_nm
         * @returns {Promise<unknown>}
         */
        getFileFromUrl : async function (imageUrl,origin_nm ) {
            return new Promise((resolve, reject) => {
                Utils.urlImgToFile(imageUrl, origin_nm, function(file) {
                    resolve(file);
                });
            });
        },

        /**
         * 원하는 코드의 속성에 해당하는 값을 가져온다
         * 해당 코드가 없으면 코드를 그대로 리턴.
         *
         * @param {Object[]} codeList 전체코드배열
         * @param {string} mgntItemCd 특정코드그룹
         * @param {string} comCd 코드
         * @param {prop}  속성값 ex) mapgVlu1
         * @returns {string}
         */
        getComProp: function (codeList, mgntItemCd, comCd, prop) {
            var propVal = comCd;
            var code = codeList.find(function (code) {
                return code.mgntItemCd == mgntItemCd && code.comCd == comCd;
            });

            if (code && !this.isNull(code.comCdNm)) {
                propVal = code[prop];
            }

            return propVal;
         },
            
         /**
         * kw---20240508 : xbox를 통해 emr 실행파일 실행
         * 해당 코드가 없으면 코드를 그대로 리턴.
         */    
        emrOpen : function(_emrType, _data, _edt1PTCNO, callback){
        	if(GLOBAL.session.user.ctiUseYn == 'Y'){
        		xbox.request.cti.emrOpen(_emrType, _data, _edt1PTCNO, callback + "|" + _edt1PTCNO);
        	} else {
        		
        		socketXBox = new WebSocket(Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 34).bsVl1);
        		
        		let nowTime;
        		var now = new Date();
        	    var year = now.getFullYear();
        	    var month = String(now.getMonth() + 1).padStart(2, '0');
        	    var day = String(now.getDate()).padStart(2, '0');
        	    var hours = String(now.getHours()).padStart(2, '0');
        	    var minutes = String(now.getMinutes()).padStart(2, '0');
        	    var seconds = String(now.getSeconds()).padStart(2, '0');
        	    var milliseconds = String(now.getMilliseconds()).padStart(3, '0');

        	    nowTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + "." + milliseconds;

        	    let param = '{RequestType : "' + 'Cti' 
        		+ '", RequestCommandType : "' + _emrType
        		+ '", RequestCommandData : ' 
        		+ JSON.stringify(_data)
        		+ ', RequestDateTime : "' + nowTime
        		+ '"}';	

        		
        	    socketXBox.addEventListener("open", (event) => {
        	    	socketXBox.send(param);
        		});


        	    socketXBox.addEventListener('error', (error) => {
        	    	//오류 발생 시 처리
        			console.error('xBox emr WebSocket error:', error);
        			Utils.alert("BONA2.XBOX.CLIENT에 접속 할 수 없습니다.<br>재 실행 또는 실행 해주세요.");
        			socketXBox.close();
        		});
        		
        	    socketXBox.addEventListener('message', (event) => {
        		    
        	    	socketXBox.close();
        	    	
        		    if (xbox.util.tryParseJson(event.data)) {
        		    	var data = JSON.parse(event.data);
        		    	var eventName = data.RequestCommandType;
        		    	var callbackName = data.RequestCallback;
        		    	
        		    	//kw---20240508 : 양지검진 - EMR_OPEN 관련 함수 추가
                        if(eventName == 'SAEROM_Link'){
                        	 if ( window[callback] ) {
                        		data.Edt1_PTCNO = _edt1PTCNO;
                             	window[callback](data);
                             }
                        }
                        
                        console.log('xBox emr WebSocket :', data);
        		    }
        		    
        		});
        		
        	}
        },
        PhoneNumberMarsking : function (value)  {
            let result = /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
            if(value == undefined || !result.test(value)) {
                result = /(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-8]{1}[0-9]{6}\b/gi;
                if(result.test(value)) {
                    return value.replace(/(-?)([1-8]{1})([0-9]{6})\b/gi, '$1$2******');
                }else{
                    return value;
                }
            }

            return (typeof value !== 'string') ? "" : value.replace(/\-/g, "").replace(/(\d{3})(\d{4})(\d{4})/g, "$1-$2-****");
        },

        /**
         * string 형태의 배열로 저장된 쿠키값을 배열로 가져오기
         * @param key
         * @returns {any}
         */
        getCookieJsontoArr : function (key){
            if(getCookie(key)){
                return JSON.parse(getCookie(key))
            }else{
                return []
            }

        },
        /**
         * 쿠키에 배열값 저장시 string 으로 저장.
         * @param key
         * @param arr
         */
        setCookieArrToJson : function (key , arr , days){
            setCookie(key , JSON.stringify(arr) , days)
        },

        /**
         * 쿠키에 obj 값 추가시 동일한 값이 있으면 추가하지 않기.
         * @param key
         * @param obj
         */
        putCookieArrToJson : function (key , obj , days){
            let arr = Utils.getCookieJsontoArr(key)
            let chk = false;
            for(let i in arr){
                if(JSON.stringify(arr[i]) === JSON.stringify(obj)){
                    chk = true
                    break;
                }
            }
            if(!chk){
                arr.push(obj)
                Utils.setCookieArrToJson(key,arr , days )
            }

        },

        /**
         * summernote에서 엑셀 데이터 복붙하기
         * @작성일      : 2024.06.14
         * @작성자      : wkim
         * @param summernote, 요소ID
         */
        summerPate : function(e, _id) {
            // 복붙 시 두번 복붙되는 문제 수정  2024-08-26 shpark
            e.preventDefault();  // 기본 동작 방지
            e.stopPropagation(); // 이벤트 전파 중지

            var clipboardData = e.originalEvent.clipboardData || window.clipboardData;
            var pastedData = clipboardData.getData('text/html');

            if (pastedData) {
                e.preventDefault();

                // 스타일을 유지한 채로 HTML 붙여넣기
                $('#' + _id).summernote('pasteHTML', pastedData);
            } else {
                // 기본 텍스트 붙여넣기
                var textData = clipboardData.getData('text/plain');
                document.execCommand('insertText', false, textData);
            }

        },

        /**
         * summernote에서 summernote에서 html코드에서 태그 삭제
         * @작성일      : 2024.06.14
         * @작성자      : wkim
         * @param html코드
         */
        summerTagReplace : function(_html) {

        	var strReturn = '';

        	strReturn = _html.replace(/<meta[^>]*>/ig, "")   	// 메타 태그 제거
            				.replace(/<link[^>]*>/ig, "")   						// 링크 태그 제거
            				.replace(/<style[^>]*>[\s\S]*?<\/style>/ig, "")   		// 스타일 태그 제거
            				.replace(/<[^>]+>/ig, "")   							// 모든 HTML 태그 제거
            				.replace(/[\t\n\r]+/g, "")   							// 탭, 줄바꿈 제거
            				.replace(/　/g, "")   									// 특수 공백 제거
            				.replace(/\s+/g, " ")   								// 연속된 공백 제거 및 단일 공백으로 치환
            				.trim();  											 	// 문자열의 앞뒤 공백 제거

        	return strReturn;
        },

        /**
         * 공통함수의 리스트를 가져와 라디오버튼 생성
         * @작성일      : 2024.06.14
         * @작성자      : shpark
         * @param codeList
         * @param mgntItemCd
         * @param target
         * @param initValue
         * @param isTotalOption
         */
        setKendoRadioButton : function (codeList , mgntItemCd , target , initValue , isTotalOption){
            target = target.replace("#","")

            let html = "";
            let totalOption = isTotalOption ? "<input type='radio' name='"+target+"' value='' checked>전체" : "";
            for(let i in codeList){
                if(codeList[i].mgntItemCd == mgntItemCd){
                    html += "<input type='radio' class='k-radio' id = '"+target+"_"+i+"' name='"+target+"' value='"+codeList[i].comCd+"' "+(initValue == codeList[i].comCd ? "checked" : "")+">"
                    html += "<label class='k-radio-label' for='"+target+"_"+i+"'>"+codeList[i].comCdNm+"</label>"
                }
            }
            $("#"+ target).html(totalOption + html)
        },
        /**
         * 공통함수의 리스트를 가져와 체크박스 생성
         * @작성일      : 2024.06.14
         * @작성자      : shpark
         * @param codeList
         * @param mgntItemCd
         * @param target
         * @param initValue
         * @param isTotalOption
         */
        setKendoCheckBox : function (codeList , mgntItemCd , target , initValue , isTotalOption){
            target = target.replace("#","")
            let html = "";
            let totalOption = isTotalOption ? "<input type='checkbox' name='"+target+"' value='' checked>전체" : "";
            for(let i in codeList){
                if(codeList[i].mgntItemCd == mgntItemCd){
                    html += "<input type='checkbox' class='k-checkbox' id = '"+target+"_"+i+"' name='"+target+"' value='"+codeList[i].comCd+"' "+(initValue == codeList[i].comCd ? "checked" : "")+">"
                    html += "<label class='k-checkbox-label' for='"+target+"_"+i+"'>"+codeList[i].comCdNm+"</label>"
                }
            }
            $("#"+ target).html(totalOption + html)
        },

        formatTimeTamp : function (timeStamp){
            // 타임스탬프를 Date 객체로 변환
            const date = new Date(timeStamp);

            // 연, 월, 일, 시, 분, 초를 추출
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            // YYYY-MM-DD HH24:MI:SS 형식의 문자열로 변환
            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            return formattedDate;
        },
        //배열에 값 포함 여부
        inArray : function (arr, value){
            for(let i=0; i<arr.length; i++){
                if(arr[i] === value){
                    return true;
                }
            }
            return false;
        },

        kendoGridFilter : function ( dataSource , andLogic =[] , orLogic=[] ){
            /*
                andLogic , orLogic : [{ field:"필드명",operator:"eq",value: "value값" }]

                operator
                "eq" (equal to)
                "neq" (not equal to)
                "isnull" (is equal to null)
                "isnotnull" (is not equal to null)
                "lt" (less than)
                "lte" (less than or equal to)
                "gt" (greater than)
                "gte" (greater than or equal to)
                "startswith"
                "doesnotstartwith"
                "endswith"
                "doesnotendwith"
                "contains"
                "doesnotcontain"
                "isempty"
                "isnotempty"
            */

            var filter  = {}

            if(andLogic.length > 0 && orLogic.length == 0){
                //and로직만 있을 경우
                filter =
                    {
                        logic: "and",
                        filters: andLogic
                    }
            }else if(andLogic.length == 0 && orLogic.length > 0){
                //or로직만 있을 경우
                filter =
                    {
                        logic: "or",
                        filters: orLogic
                    }

            }else if(andLogic.length > 0 && orLogic.length > 0){
                //and or 둘다 있을 경우

                filter = {
                    logic: "or",
                    filters: [{
                        logic:"and",
                        filters: andLogic
                    },
                        ...orLogic
                    ]
                }
            }
            dataSource.filter(filter)
        },

        /**
         * xss 위험 문자열 제거
         */
        removeXSS(input) {
            // 위험한 태그 목록
            var disallowedTags = /<script[^>]*>([\s\S]*?)<\/script>|<iframe[^>]*>[\s\S]*?<\/iframe>|<style[^>]*>[\s\S]*?<\/style>|<link[^>]*>/gi;
            // 위험한 속성 목록 (on*으로 시작하는 이벤트 속성 및 javascript: URL 등)
            var disallowedAttributes = /on\w+="[^"]*"|on\w+='[^']*'|javascript:/gi;
            // 위험한 태그를 제거
            var sanitizedInput = input.replace(disallowedTags, '');
            // 위험한 속성을 제거
            sanitizedInput = sanitizedInput.replace(disallowedAttributes, '');
            return sanitizedInput;
        },
        /**
         * 배열에서 여러개의 특정 키 벨류로 객체,배역,index 찾기
         * ex ) Utils.queryObjectsByConditions((GLOBAL.bascVlu.list, {{id : '42' , useYn : 'Y'}, 'find')
         * ex ) Utils.queryObjectsByConditions((GLOBAL.bascVlu.list, {id : '42' , useYn : 'Y'}, 'filter')
         * ex ) Utils.queryObjectsByConditions((GLOBAL.bascVlu.list, {id : '42' , useYn : 'Y'}, 'index')
         * @param arr
         * @param conditionsㅉ
         * @param mode  default find
         * @returns {*|*[]}
         */
        queryObjectsByConditions : (arr, conditions, mode = 'find') => {
            // 조건을 검사하는 함수
            const conditionChecker = (element) =>
                Object.keys(conditions).every(key => element[key] === conditions[key]);

            // 입력 모드에 따라 다른 동작 수행
            switch (mode) {
                case 'find':
                    // 첫 번째로 조건을 만족하는 객체를 반환
                    return arr.find(conditionChecker);

                case 'filter':
                    // 조건을 만족하는 모든 객체를 배열로 반환
                    return arr.filter(conditionChecker);

                case 'index':
                    // 조건을 만족하는 객체들의 인덱스를 배열로 반환
                    return arr.map((element, index) => conditionChecker(element) ? index : -1)
                        .filter(index => index !== -1);

                default:
                    return []
            }
        },
        /**
         * 전역 변수 혹은 jquery 객체의 값이 변경될때까지 대기 후 이벤트 실행
         * 최대경과시간  default 1초
         * @param target
         * @param maxDuration
         * @returns {Promise<unknown>}
         * ex Utils.customInterval('custId', 1000).then((res) => {console.log(res)})        전역변수
         * ex Utils.customInterval($("#custId"), 1000).then((res) => {console.log(res)})    jquery 객체
         */
        customInterval : (target   , maxDuration = 1000  /* 최대 경과시간 */, id = null) => {
            return new Promise((resolve , reject) => {
                let intervalTime = 100; 	// 0.1초(100ms) 간격으로 실행
                let elapsed = 0; 			// 경과 시간 추적

                // id가 있으면 기존의 interval을 먼저 clear
                if (id && intervalMap[id]) {
                    clearInterval(intervalMap[id]);
                    delete intervalMap[id]; // 기존 interval을 삭제
                }


                let interval = setInterval(function(){
                    elapsed += intervalTime;
                    let targetVal = ''
                    if(target  instanceof jQuery){
                           targetVal = target.val()
                    }else{
                        targetVal = window[target]
                    }
                    if(targetVal != null && targetVal != ''){
                        clearInterval(interval)
                        if (id) delete intervalMap[id]; // id가 있으면 관리 객체에서 제거
                        resolve(targetVal); // 값이 있으면 resolve로 반환
                    }

                    if(elapsed >= maxDuration){
                        clearInterval(interval)
                        if (id)  delete intervalMap[id]; // id가 있으면 관리 객체에서 제거
                        resolve(null); // 값이 있으면 resolve로 반환
                    }
                },intervalTime)
                        // id가 있으면 intervalMap에 저장
                if (id) {
                    intervalMap[id] = interval;
                }
            })
        },
        /**
         * (kendo) iframe 형식의 kendoWindow 팝업
         *
         * 팝업 내부에서 부모창 접근시 parent로 호출필요
         *
         * @param {string} url 경로
         * @param {number} width 가로
         * @param {number} height 세로
         * @param {string} position 기준위치(left|right|center)
         * @param {number} distance 기준부터의거리
         * @param {number} top 상단거리
         * @param {string|boolean} title 타이틀
         * @param {Object} param 추가파라메터
         * @returns {kendoWindow} instance
         */
        openKendoWindowPasswordChange: function (url, width, height, position, distance, top, title, param) {

            let timeStamp = Math.floor(Math.random() * 100).toString() + new Date().getTime();
            let paramObject = {
                usrId: $.trim(GLOBAL.session.user.usrId),
            };

            var kendoWindow = $("<div id='" + timeStamp + "'></div>").kendoWindow({
                title: title,
                modal: true,
                visible: false,
                draggable: false,
                resizable: false,
                width: width,
                height: height,
                iframe : false,
                open: function(e) {
                    let overlay = $("<div class='custom-overlay'></div>");
                    overlay.css({
                        "z-index": e.sender.wrapper.css("z-index") - 1,
                        "position": "fixed",
                        "top": 0,
                        "left": 0,
                        "width": "100%",
                        "height": "100%",
                        "background-color": "#7f7f7fa1"
                    });
                    $("body").append(overlay);

                    setTimeout(() => $('.k-overlay').remove(), 100);
                },
                deactivate: function (e) {
                    this.destroy()
                }
            }).data("kendoWindow");

            $.ajax({
               url : GLOBAL.contextPath + url,
               method:"POST",
               dataType : 'html',
               data : $.param(paramObject),
               success: function(response ) {
                   kendoWindow.content(response);
                   document.getElementById(timeStamp).classList.remove('k-window-content');

                   if (position == "center") {
                       kendoWindow.center().open();
                   }

                   kendoPopInstances.push(kendoWindow);

               },
            });
            return kendoWindow;
        },
        /**
         * 특수문자 포함 여부 체크 및 삭제
         */
        checkSpecialCharacters : function(str) {
        	//허용 문자 : 한글, 영문, 숫자 허용
        	//허용 특수 문자 : ! @ $ % ^ & * [ ]
            //let pattern = /[^a-zA-Z0-9ㄱ-ㅎ가-힣ㅏ-ㅣ\s]/g;
        	let pattern = /[^a-zA-Z0-9ㄱ-ㅎ가-힣ㅏ-ㅣ\s!@\$%\^&\*\[\]]/g;
            return pattern.test(str);
        },
        /**
         * 첨부파일 이미지 크기, 확장자 및 이미지 외 파일 업로드 용량 제한 validation
         * @작성일      : 2024.08.19
         * @작성자      : jypark
         * @param files, fileSize, fileType
         */
        isFileValidation : function (target, limit, type, exp){

            // default exp
            let defaultExp = 'doc|docx|pdf|hwp|xls|xlsx|ppt|pptx|txt|jpg|jpeg|png|gif|zip|rar|7z|hwpx|show|hsdt|htheme|hpt|cell';
            // limit default 1MB
            let defaultLimit = 1048576;
            // filetype default true (true : image)
            let defaultType = true;
            //업로드허용 파일사이즈 (1MB)
            let fileSizeLimit= (typeof limit !== 'undefined' && limit !== null && limit !== '') ? limit : defaultLimit ;
            let fileType = (typeof type !== 'undefined' && type !== null && type !== '') ? type : defaultType;

            //업로드허용 이미지확장자
            let regex= null;
            let result = true;
            let files = typeof target.files === 'undefined' ? target : target.files;
            let message;

            $.each(files, function(i, value) {
                if(fileType) {
                    regex = new RegExp("(.*?)\.(jpg|jpeg|png|gif)$");
                    if(!regex.test(this.name.toLowerCase()) || this.size > fileSizeLimit) {
                        // 결함리포트 125 수정
                        message = !regex.test(this.name.toLowerCase()) ?
                            "jpg , jpeg , png , gif 파일만 업로드 할 수 있습니다. (" + this.type + ")"   //shpark 20281028 : 결함리포트 28 수정
                            : "이미지파일 크기는 "+ (fileSizeLimit / (1024*1024)).toFixed(2) +"MB 이내로 등록 가능합니다." ;
                        result = false;
                    }
                }else{
                    regex = new RegExp(`(.*?)\.(${defaultExp})$`);
                    if(!regex.test(this.name.toLowerCase()) || this.size > fileSizeLimit) {
                        // 결함리포트 125 수정
                        message = !regex.test(this.name.toLowerCase()) ?
                            "해당 종류의 파일은 업로드 할 수 없습니다. (" + this.name + ")"
                            : "파일 크기는 "+ (fileSizeLimit / (1024*1024)).toFixed(2) +"MB 이내로 등록 가능합니다." ;
                        result = false;
                        regex = null;
                    }

                    if(typeof exp !== 'undefined' && exp !== null && exp !== '') {
                        regex = new RegExp(`(.*?)\.(${exp})$`);
                        if(!regex.test(this.name.toLowerCase())) {
                            message = "해당 종류의 확장자는 업로드 할 수 없습니다. (" + this.name + ")";
                            result = false;
                        }
                    }
                }
                return result;
            });

            if(!result) {
                Utils.alert(message);
            }

            return result;
        },

    }
})();


/**
 * 그리드 열 병합.
 * $(테이블 선택자).rowspan(colIdx)
 * @작성일      : 2024.04.17
 * @작성자      : shpark
 */
$.fn.rowspan = function(colIdx, isStats) {
    return this.each(function(){
        var that;
        // 상위 table의 visible 상태를 한 번만 확인
        var isTableVisible = $(this).closest('table').is(':visible');
        $('tr', this).each(function(row) {
            $('td:eq('+colIdx+')', this).filter(function() {
                if (!isTableVisible) {
                    return true; // table이 visible 상태이면 모든 td 요소를 선택 (필터링 없이)
                } else {
                    return $(this).is(':visible'); // table이 visible 상태가 아니면 visible 요소만 선택
                }
            }).each(function(col) {

                if ($(this).html() == $(that).html()
                    && (!isStats
                        || isStats && $(this).prev().html() == $(that).prev().html()
                    ) && $(that).html() != ''
                ) {
                    rowspan = $(that).attr("rowspan") || 1;
                    rowspan = Number(rowspan)+1;

                    $(that).attr("rowspan",rowspan);

                    // do your action for the colspan cell here
                    $(this).hide();

                    //$(this).remove();
                    // do your action for the old cell here

                } else {
                    that = this;
                }

                // set the that if not already set
                that = (that == null) ? this : that;
            });
        });
    });
};


/**
 * 그리드 행병합
 * $(테이블 선택자).colspan(rowIdx)
 * @작성일      : 2024.04.17
 * @작성자      : shpark
 */
$.fn.colspan = function(rowIdx) {
    return this.each(function(){

        // 상위 table의 visible 상태를 한 번만 확인
        var isTableVisible = $(this).closest('table').is(':visible');
        var that;

        $('tr', this).filter(":eq("+rowIdx+")").each(function(row) {

            $(this).find('td').filter(function() {
                if (!isTableVisible) {
                    return true; // table이 visible 상태이면 모든 td 요소를 선택 (필터링 없이)
                } else {
                    return $(this).is(':visible'); // table이 visible 상태가 아니면 visible 요소만 선택
                }
            }).each(function(col) {
                if ($(this).html() == $(that).html() ) {
                    colspan = $(that).attr("colSpan") || 1;
                    colspan = Number(colspan)+1;

                    $(that).attr("colSpan",colspan);
                    $(this).hide(); // .remove();
                } else {
                    that = this;
                }

                // set the that if not already set
                that = (that == null) ? this : that;

            });
        });
    });
}

