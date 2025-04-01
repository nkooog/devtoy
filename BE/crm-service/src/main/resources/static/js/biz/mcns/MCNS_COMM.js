// const getNextKey = (() => {
//     function getNextKey(key) {
//         this.key = key;
//         this.idx = 0;
//     };
//     getNextKey.prototype.next = function () {
//         return this.key[this.idx++];
//     };
//     getNextKey.prototype.done = function () {
//         return this.key.length === this.idx;
//     };
//     return getNextKey;
// })();
//
// function MCNS_addDetailDataByGenerator(obj, transValue, MCNS_Utils) {
//     let iterKey = new getNextKey(Object.keys(obj));
//     console.log(iterKey);
//     while (!iterKey.done()) {
//         let key = iterKey.next();
//         let value = transValue()[key];
//     }
// }

function MCNS_nullCheck(obj) {
    return Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
}

function MCNS_deepClone(obj) {
    if (obj instanceof Object) {
        let result = new obj.constructor();
        Object.keys(obj).forEach(k => {
            result[k] = MCNS_deepClone(obj[k]);
        })
        return result;
    } else if (obj instanceof Array) {
        let result = obj.map(element => MCNS_deepClone(element));
    } else return obj;
}

function MCNS_extend(from, to) {
    if (from == null || typeof from != "object") return from;
    if (from.constructor !== Object && from.constructor !== Array) return from;
    if (from.constructor === Date || from.constructor === RegExp || from.constructor === Function ||
        from.constructor === String || from.constructor === Number || from.constructor === Boolean)
        return new from.constructor(from);

    to = to || new from.constructor();

    for (let name in from) {
        to[name] = typeof to[name] == "undefined" ? MCNS_extend(from[name], null) : to[name];
    }
    return to;
}

function MCNS_cloneObject(obj) {
    if (obj === null || typeof (obj) !== 'object')
        return obj;
    let temp = obj.constructor(); // changed
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj['isActiveClone'] = null;
            temp[key] = MCNS_cloneObject(obj[key]);
            delete obj['isActiveClone'];
        }
    }
    return temp;
}

// const MCNS_TEST_OBJECT = MCNS_cloneObject({"a":1,"b":2});   // calling

function MCNS_addDetailData(obj, transValue, MCNS_Utils) {
    MCNS_nullCheck(obj);
    Object.keys(obj).some((key, idx, arr) => {
        let value = transValue()[key];
        if (idx === arr.length) {
            return true;
        }
        if (typeof value === 'function') {
            value();
        } else {
            MCNS_Utils.MCNS_fnSetEnterInValue(key, value);
        }
    });
}

function MCNS_setUtils(ID) {
    let ACTIVE_ID = ID;
    return {
        getActiveID: ACTIVE_ID,
        MCNS_fnSetEnterInValue: (key, value) => {
            const $target = $("#" + ACTIVE_ID + " [name=" + key + "]");
            if (Utils.isNull(value)) {
                return;
            }
            console.log($target.is('td'));
            $target.is('td') || $target.is('div') ? $target.html(value) : $target.val(value);
        },
        MCNS_fnSetDateTime: (value) => Utils.isNull(value) ? "" : kendo.toString(new Date(value), "yyyy-MM-dd HH:mm:ss"),
        MCNS_fnSetDate: (value) => Utils.isNull(value) ? "" : kendo.toString(new Date(value), "yyyy-MM-dd"),
        // MCNS_fnSetTelValue: (value) => {
        //     // TODO 마스킹 변경
        //     return Utils.isNotNull(value) ? maskingFunc.phone(value) : "";
        // },
        MCNS_fnSetContactTime: (value) => {
            let timeCalculation = value.split(":");
            const hour = timeCalculation[0] === '00' ? "" : ''.concat(timeCalculation[0], "시간 ");
            const minute = timeCalculation[1] === '00' ? "" : ''.concat(timeCalculation[1], "분 ");
            const second = timeCalculation[2] === '00' ? "" : ''.concat(timeCalculation[2], "초 ");
            return `${hour} ${minute} ${second}`;
        },
        MCNS_fnSetKendoDateTimePlcker: (key, value) => {
            if (!value) {
                return MCNS_setUtils.MCNS_fnSetEnterInValue(key, "")
            }
            $("#" + ACTIVE_ID + " [name= " + key + "]").kendoDateTimePicker({
                format: "yyyy-MM-dd HH:mm:ss",
                value: new Date(value),
                dateInput: true,
            }).data("kendoDateTimePicker");
        }
    };
}


function MCNS_stringDateReg(value) {
    if (value) return value.replace(/\-/g, '');
}

function MCNS_initTenant(grid,fnSearch) {
    const before = () => grid.dataSource.data([]);
    CMMN_SEARCH_TENANT[activateTabId].fnInit(before,fnSearch,null);
}

function MCNS_checkTenant(tenantId, tenantNm) {
    let valid = true;
    Utils.markingRequiredField();
    if (Utils.isNull(tenantId.val())) {
        Utils.alert(MCNS_langMap.get("MCNS.tenantId.required.msg"),
            () => {
                return tenantId.focus();
            });
        valid = false;
        return valid;
    }
    if (Utils.isNull(tenantNm.val())) {
        tenantNm.addClass("inputError")
        Utils.alert(MCNS_langMap.get("MCNS.aicrm.message.tenantInfo"),
            () => {
                tenantNm.removeClass("inputError") && tenantId.focus();
            });
        valid = false;
    }
    return valid;
}

$('[id^=MCNS] input').on('focus', function () {
    $(this).removeClass("inputError");
})

function MCNS_inputValidation(e, ID) {
    let thisValue = e.value;
    const thisName = e.name;
    const regExp_id = /^[A-Za-z0-9]{4,15}$/;
    const regExp_name = /^[가-힣]{2,4}$/;
    const regExp_phone = /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/
    const regExp_phoneFormat = /^\d{3}-\d{3,4}-\d{4}$/;
    const regExp_date = /(^(19|20)\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    const regExp_dateFormat = /(^(19|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;
    const regExp_landlinePhoneFormat = /^(02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
    const regExp_mobilePhoneFormat = /^(?:(010\d{4})|(01[1|6|7|8|9]\d{3,4}))(\d{4})$/
    if (Utils.isNull(e.value)) {
        return;
    }
    switch (thisName) {
        case "cntcCustNm":
            if (!regExp_name.test(thisValue)) {
                e.classList.add("inputError");
                Utils.alert(MCNS_langMap.get("MCNS.search.name.errors"),
                    () => {
                        e.value = "";
                        return e.focus();
                    })
            }
            break;
        case "cntcCustId":
            if (!regExp_id.test(thisValue)) {
                e.classList.add("inputError");
                Utils.alert(MCNS_langMap.get("MCNS.search.id.errors"),
                    () => {
                        e.value = "";
                        return e.focus();
                    })
            }
            break;
        // case ID + "_dateEnd":
        //     const dateStartValue = $("#" + ID + "_dateStart");

        // if (regExp_dateFormat.test(thisValue)) {
        //     e.value = thisValue.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
        // } else if (!regExp_date.test(thisValue)) {
        //     e.value = "";
        //     e.classList.add("inputError");
        //     Utils.alert(MCNS_langMap.get("MCNS.search.date.type.errors"),
        //         () => { return e.focus();});
        //     return false;
        // }

        // if (new Date(e.value) < new Date(dateStartValue.val())) {
        //     dateStartValue.val(e.value)
        // Utils.alert(MCNS_langMap.get("MCNS.search.date.period.errors"),
        //     () => { return e.value = dateStartValue; });
        // }

        // break;
        // case ID + "_dateStart":
        //
        //     const dateEndValue = $("#" + ID + "_dateEnd")
        // if (regExp_dateFormat.test(thisValue)) {
        //     e.value = thisValue.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
        // } else if (!regExp_date.test(thisValue)) {
        //     e.value = "";
        //     e.classList.add("inputError");
        //     Utils.alert(MCNS_langMap.get("MCNS.search.date.type.errors"),
        //         () => { return e.focus(); });
        //     return false;
        // }
        // if (new Date(e.value) > new Date(dateEndValue.val())) {
        //     dateEndValue.val(e.value)
        // Utils.alert(MCNS_langMap.get("MCNS.search.date.period.errors"),
        //     () => { return e.value = dateEndValue });
        // }
        // break;
        case "cntcTelNo":
            // if (regExp_mobilePhoneFormat.test(thisValue)) {
            //     if (thisValue.substring(0, 3) === '010') {
            //         e.value = thisValue.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            //     } else {
            //         e.value = thisValue.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
            //     }
            // } else if (regExp_landlinePhoneFormat.test(thisValue)) {
            //     if (thisValue.substring(0, 2) === '02') {
            //         e.value = thisValue.replace(/(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3');
            //     } else {
            //         e.value = thisValue.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
            //     }
            // }
            if (regExp_phoneFormat.test(thisValue)) {
                e.value = thisValue.replace(/-/g, '');
                thisValue = e.value;
            }

            if (!regExp_phone.test(thisValue)) {
                e.classList.add("inputError");
                Utils.alert(MCNS_langMap.get("MCNS.search.telNo.errors"),
                    () => {
                        e.value = "";
                        return e.focus();
                    })
            } else if (thisValue.length > 11) {
                e.classList.add("inputError");
                Utils.alert(MCNS_langMap.get("MCNS.search.telNo.errors"),
                    () => {
                        e.value = "";
                        return e.focus();
                    })
            }
            break;
        default:
            break;
    }

}

function MCNS_excelExport(targetGrid, fileName) {
    const pageSize = targetGrid._data.length;
    if (pageSize === 0) {
        Utils.alert('데이터가 존재하지 않습니다.');
        return;
    }
    const dataSourceTotal = targetGrid.dataSource.total();
    targetGrid.dataSource.pageSize(dataSourceTotal);
    targetGrid.bind("excelExport", function (e) {
        e.workbook.fileName = fileName;
        let sheet = e.workbook.sheets[0];

        let setDataItem = {};
        let selectableNum = 0;
        if (this.columns[0].selectable) {
            selectableNum = 1
        }
        if (this.columns[0].template === '#= ++record #') {
            record = 0;
        }

        let deleteColumn =0;
        this.columns.forEach(function (item, index) {
            if (Utils.isNotNull(item.template)) {
                let targetTemplate = kendo.template(item.template);
                let fieldName = item.field;
                for (let i = 1; i < sheet.rows.length; i++) {
                    let row = sheet.rows[i];
                    setDataItem = {
                        [fieldName]: row.cells[(index-deleteColumn - selectableNum)].value
                    }
                    row.cells[(index-deleteColumn - selectableNum)].value = targetTemplate(setDataItem);
                }
            }
            if(item.excludeFromExport){
                for(var i =0; i< sheet.rows.length; i++){
                    sheet.rows[i].cells.splice(index-deleteColumn,1)
                }
                deleteColumn++;
            }
        })

        for(var i = 1; i< sheet.rows.length; i++){
            if(selectableNum<1){
                sheet.rows[i].cells[0].value = i;
            }
        }
    });
    targetGrid.saveAsExcel();
    targetGrid.dataSource.pageSize(pageSize);
}

function MCNS_gridTextLengthOverCut(txt, len, lastTxt) {
    // 기본값
    if (len == "" || len == null)
        len = 20;
    if (lastTxt == "" || lastTxt == null) {
        lastTxt = "...";
    }
    if (txt.length > len) {
        txt = txt.substr(0, len) + lastTxt;
    }
    return txt;
}