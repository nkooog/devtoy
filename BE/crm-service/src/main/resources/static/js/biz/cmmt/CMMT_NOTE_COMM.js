function noteUtils(ID) {
    const target = ID
    const removeButton = `<button class="k-chip-icon k-icon k-i-x" onclick="$(this).parent().remove();"></button></li>`

    return {
        dataInput: (key, value) => { return $("#" + target + " [name= " + key + "]").val(value) },
        dataAddText : (key, value) => { return $("#" + target + " [name= " + key + "]").html(value) },
        recvrUsrInsertForReply: (obj) => {
            if (obj.recvrId === GLOBAL.session.user.usrId) {
                return;
            }
            let tempHtml = `<li data-usr-id="${obj.recvrId}" data-org-cd="${obj.recvrOrgCd}">${obj.recvrOrgNm} ${obj.recvrNm}`
            tempHtml += removeButton;
            $('#' + target + ' [name=recvrUsr]').append(tempHtml);
        },
        recvrUsrInsertForTemp: (obj) => {
            if (obj && obj.recvrIdList[0] !== "unnamed") {
                let tempHtml;
                for (let i = 0; i < obj.recvrIdList.length; i++) {
                    tempHtml = `<li data-usr-id="${obj.recvrIdList[i]}" data-org-cd="${obj.recvrOrgCdList[i]}">${obj.recvrOrgNmList[i]} ${obj.recvrNmList[i]}`
                    tempHtml += removeButton;
                    $('#' + target + ' [name=recvrUsr]').append(tempHtml);
                }
            }
        },
        recvrUsrInsertForRead: (obj) => {
            if (obj) {
                let tempHtml;
                for (let i = 0; i < obj.recvrIdList.length; i++) {
                    tempHtml = `<li data-usr-id="${obj.recvrIdList[i]}" data-org-cd="${obj.recvrOrgCdList[i]}">${obj.recvrOrgNmList[i]} ${obj.recvrNmList[i]}</li>`
                    $('#' + target + ' [name=recvrUsr]').append(tempHtml);
                }
            }
        },
        noteCttValue: (value, dpchmnInfo, recvrInfo, prefix, editor) => {
            editor.SetBodyValue(noteUtils().replaceNoteTitleOrContent(value));
            if (recvrInfo.recvrIdList.length > 0) {
                for (let i = 0; i < recvrInfo.recvrIdList.length; i++) {
                    if (Utils.isNotNull(recvrInfo.recvrUsrs)) {
                        recvrInfo.recvrUsrs = recvrInfo.recvrUsrs.concat("; ", recvrInfo.recvrNmList[i], "(", recvrInfo.recvrIdList[i], ")");
                    } else {
                        recvrInfo.recvrUsrs = ''.concat(recvrInfo.recvrNmList[i], "(", recvrInfo.recvrIdList[i], ")");
                    }
                }
            }
            if (Utils.isNotNull(prefix)) {
                let noteTempHtml = '<p><br /></p><p><br /></p><p><br /></p><hr />'
                noteTempHtml += '<b>'+CMMT_NOTE_langMap.get("CMMT.NOTE.dpchmnUsr")+': </b><span>' + dpchmnInfo.recvrNm + "(" + dpchmnInfo.recvrId + ")" + '</span><br />'
                noteTempHtml += '<b>'+CMMT_NOTE_langMap.get("CMMT.NOTE.recvrUsrs")+': </b><span>' + recvrInfo.recvrUsrs + '</span><br />'
                noteTempHtml += '<b>'+CMMT_NOTE_langMap.get("CMMT.NOTE.sentDate")+': </b><span>' + kendo.toString(new Date(dpchmnInfo.dpchDdSi), "yyyy-MM-dd HH:mm:ss") + '</span><br /><br />'
                editor.InsertValue(0, noteTempHtml);
            }
        },

        replaceNoteTitleOrContent: (value) => {
            return value.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&#40;", "\(").replaceAll("&#41;", "\)");
        },
        getByteSize: (size) => {
            const byteUnits = ["KB", "MB", "GB", "TB"];
            for (let i = 0; i < byteUnits.length; i++) {
                size = Math.floor(size / 1024);
                if (size < 1024) return size.toFixed(1) + byteUnits[i];
            }
        },

        fnAddRecvrUsr: (data) => {
            let usrTempHtml;
            $.each(data, function (key, obj) {
                usrTempHtml =
                    `<li data-usr-id="${obj.usrId}" data-org-cd="${obj.orgCd}" >${obj.orgNm} ${obj.usrNm}
                    <button class="k-chip-icon k-icon k-i-x" onclick="$(this).parent().remove();"></button>
                </li>`
                $('#' + target + ' [name=recvrUsr]').append(usrTempHtml);
            });
        },

        checkExt: (uploadFile, targetSizeValue) => {
            const regex = new RegExp("(.*?)\.(xls|xlsx|ppt|pptx|doc|docx|hwp|pdf|gif|jpg|png|zip|rar|PNG)$"); //확장자
            const sizeLimit = 20 * 1024 * 1024;  //파일 한개당 20MB 용량 제한
            const maxSizeLimit = 100 * 1024 * 1024; //파일 전체 100MB 용량 제한
            return Object.values(uploadFile).reduce((acc, {size, name}) => {
                console.log(`${name}의 ${size}`);
                if (size >= sizeLimit) {
                    return Utils.alert(CMMT_NOTE_langMap.get("CMMT.NOTE.valid.sizeLimit"));
                }
                if (!regex.test(name)) {
                    return Utils.alert(CMMT_NOTE_langMap.get("CMMT.NOTE.valid.notAllowed"));
                }
                console.log(`누적사이즈 =  ${acc + size}`);
                if (acc + size > maxSizeLimit) {
                    return Utils.alert(CMMT_NOTE_langMap.get("CMMT.NOTE.valid.maxLimit"));
                }
                return acc + size;
            }, targetSizeValue);
        },
        fnFileCount: (ID, list) => {
            const filesNotDeleted = list.filter(e => e.delete !== true).length
            if (filesNotDeleted > 0)
                return $("#" + ID + "_fakeFile").val(`${CMMT_NOTE_langMap.get("CMMT.NOTE.info.attachedCount")} : ${filesNotDeleted}`);
            else
                return $("#" + ID + "_fakeFile").val('');
        },
        removeApndFile: (ID, num, list) => {
            const selector = ''.concat("#",ID,"_file",num);
            document.querySelector(selector).remove();
            list[num].delete = true;
            return noteUtils().fnFileCount(ID, list);
        },
        fnValidation: (editor) => {
            const noteTitle = $("#"+ target +" [name=noteTite]");
            if (Utils.isNull(noteTitle.val().trim())) {
                return Utils.alert(CMMT_NOTE_langMap.get("CMMT.NOTE.valid.title"));
            }
            const noteContent = editor.GetTextValue();
            if (Utils.isNull(noteContent)) {
                return Utils.alert(CMMT_NOTE_langMap.get("CMMT.NOTE.valid.content"));
            }

            const recvrUsrList = $('#'+target+'_recvrInfo li')
            if (recvrUsrList.length === 0) {
                return Utils.alert(CMMT_NOTE_langMap.get("CMMT.NOTE.valid.recvrInfo"));
            }
            return true;
        },
        dpchmUsrTemplate : (targetId, name) => {
            let targetInput = $("#"+ target + " input[name=dpchmnUsr]");
            targetInput.data("usrId" , targetId);
            return ''.concat(name, "(", targetId, ")");
        }
    }
}
function CMMT_stringDateReg(value) {
    if (value) return value.replace(/\-/g, '');
}


// function createHtml(value) {
//     let stringHTML = noteUtils().replaceNoteTitleOrContent(value);
//     let firstCutChar = stringHTML.indexOf("<style");
//     let lastCutChar = stringHTML.indexOf("</head");
//     return stringHTML.slice(0, firstCutChar) + stringHTML.slice(lastCutChar, stringHTML.length);
// }