/***********************************************************************************************
 * Program Name : 조직사용자찾기 팝업(SYSM212P.js)
 * Creator      : mhlee
 * Create Date  : 2022.03.03
 * Description  : 조직사용자찾기 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.03     mhlee            최초작성
 * 2022.03.23     mhlee            변수명 및 로직 수정 (기간 미입력 시 ajax 호출불가)
 * 2022.03.24     mhlee            1. 변수값 통일, 리턴 값 및 매개변수 값 변경
 *                                 2. 결과 없을 시 알림창 띄우기
 * 2022.03.30     mhlee            화면이름변경 (사용자ID찾기 -> 조직사용자찾기)
 * 2022.05.10     mhlee            불필요한 로직 삭제
 ************************************************************************************************/
var SYSM212PDataSource, SYSM212P_treeview;
var SYSM212P_selectNode = [];

$(document).ready(function () {
    if (/^CMMT/.test(Utils.getUrlParam('callbackKey'))) {
        $('[name=changing]').removeAttr('onclick').attr('onclick','Utils.closeKendoWindow(SYSM212P_paramId);');
    }
    if (/^MCNS/.test(Utils.getUrlParam('callbackKey'))) {
        $("#SYSM212P_dynamicButton").text(`${SYSM212P_langMap.get("SYSM212P.distribute")}`);
    }
    SYSM212PDataSource = {
        transport: {
            read: function () {
                Utils.ajaxCall(
                    "/sysm/SYSM212SEL02",
                    JSON.stringify({tenantId: GLOBAL.session.user.tenantId}),
                    SYSM212P_fnResultOrgUsersList,
                    window.kendo.ui.progress($("#treeSYSM212P"), true),
                    window.kendo.ui.progress($("#treeSYSM212P"), false)
                )
            },
        },
        schema: {
            model: {
                children: "child",
            }
        }
    };

    $("#treeSYSM212P").kendoTreeView({
        dataSource: SYSM212PDataSource,
        loadOnDemand: false,
        checkboxes: {
            checkChildren: true,
        },
        dataBound: function () {
            // $("#treeSYSM212P input").eq(0).hide();
            let allList = $("#treeSYSM212P .k-in").closest("li");
            for (let i=0; i < allList.length; i++) {
                let item = SYSM212P_treeview.dataItem(allList[i]);
                if(!item.usrId) {
                    allList.find("input:checkbox").eq(i).hide();
                }
            }
        },
        template: kendo.template($("#SYSM212P_treeTemplate").html()),
        check: $.trim(Utils.getUrlParam('isMulti')) === "N" ? SYSM212P_onCheckOnlyOneUsr : SYSM212P_onCheck,
		select: function (e) {
		    e.preventDefault();
		    var treeView = $("#treeSYSM212P").data("kendoTreeView");
		    var dataItem = treeView.dataItem(e.node);

		    if (!dataItem.usrId) return;

		    var checkbox = $(e.node).find(":checkbox");
		    var checked = !checkbox.prop("checked");

		    checkbox.prop("checked", checked);		//체크박스 체크
		    dataItem.set("checked", checked);		//체크된 데이터값 설정

		    ($.trim(Utils.getUrlParam('isMulti')) !== "N" ? SYSM212P_onCheck : SYSM212P_onCheckOnlyOneUsr)(e);
		}
    })
    SYSM212P_treeview = $("#treeSYSM212P").data("kendoTreeView");
    const comboSYSM212P = [
        {text: SYSM212P_langMap.get("SYSM212P.all"), value: "1"},
        {text: SYSM212P_langMap.get("SYSM212P.org"), value: "2"},
        {text: SYSM212P_langMap.get("SYSM212P.usr"), value: "3"},]

    let SYSM212P_searchOptions = $("#comboSYSM212P").kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: comboSYSM212P,
        height: 200,
        clearButton: false,
    }).data("kendoComboBox");
    SYSM212P_searchOptions.value("1");

    $('#treeOpenToggleSYSM212P').on('click', function () {
        if ($(this).is(':checked')) {
            $(this).prop("checked", true);
            SYSM212P_treeview.expand('.k-item');
        } else {
            $(this).prop("checked", false);
            SYSM212P_treeview.collapse('.k-item')
        }
    });
});

function SYSM212P_fnCreateTreeData(list) {
    let MappedArr = [], treeCol = []
    let MappedElem, data;
    for (let item of list) {
        data = {
            orgCd: item.orgCd,
            transOrgCd: item.transOrgCd,
            hgrkOrgCd: item.hgrkOrgCd,
            orgNm: item.orgNm,
            orgPath: item.orgPath,
            usrNm: item.decUsrNm,
            usrId: item.usrId,
            child: Utils.isNull(item.usrId) ? [] : "",
            expanded: true,
        }
        if (item.usrId === GLOBAL.session.user.usrId) {
            if ($.trim(Utils.getUrlParam('mySelf')) === "N") {
                data.enabled = false;
            }
        }
        MappedArr.push(data);
    }
    for (let num in MappedArr) {
        if (MappedArr.hasOwnProperty(num)) {
            MappedElem = MappedArr[num];
            if (MappedElem.hgrkOrgCd) {
                let hgrkorgNum = MappedArr.findIndex(e => e.orgCd === MappedElem.hgrkOrgCd);
                MappedArr[hgrkorgNum].child.push(MappedElem);
            } else {
                treeCol.push(MappedElem);
            }
        }
    }
    return treeCol;
}

function SYSM212P_dataProcessingForTree(list) {
    return list.map(obj => {
        obj.transOrgCd = obj.orgCd;
        if (obj.decUsrNm) {
            obj.hgrkOrgCd = obj.transOrgCd;
            obj.transOrgCd = String(parseInt(obj.orgCd) + 1);
        }
        return obj;
    });
}

var SYSM212P_sortJSON = function (data, key, type) {
    if (type === undefined) {
        type = "asc";
    }
    return data.sort(function (a, b) {
        let x = a[key];
        let y = b[key];
        if (type === "desc") {
            return x > y ? -1 : x < y ? 1 : 0;
        } else if (type === "asc") {
            return x < y ? -1 : x > y ? 1 : 0;
        }
    });
};

function SYSM212P_onCheck() {
	
	console.log("SYSM212P_onCheck");
	
    SYSM212P_selectNode = [];
    SYSM212P_getCheckedNodes(SYSM212P_treeview.dataSource.view(), SYSM212P_selectNode);
    SYSM212P_setMessage(SYSM212P_selectNode.length);
    
    console.log("SYSM212P_onCheck : " + SYSM212P_selectNode);
}


function SYSM212P_onCheckOnlyOneUsr(e) {
    console.log(e);
    let findCheckItem = $("#treeSYSM212P .k-in").closest("li").find("input:checkbox");
    let checkedItem = findCheckItem.filter(':checked');
    findCheckItem.not(checkedItem).prop('disabled', checkedItem.length > 0);
    SYSM212P_selectNode = [];
    SYSM212P_getCheckedNodes(SYSM212P_treeview.dataSource.view(), SYSM212P_selectNode);
}

function SYSM212P_setMessage(checkedNodes) {
    let message;
    if (checkedNodes > 0) {
        message = checkedNodes + " users selected";
    } else {
        message = "0 users selected";
    }
    $("#result").html(message);
}

function SYSM212P_fnResultOrgUsersList(data) {
    let jsonDecode = SYSM212P_sortJSON(JSON.parse(data.SYSM212P), 'srtSeq', 'asc');
    let SYSM212P_treeData = SYSM212P_fnCreateTreeData(SYSM212P_dataProcessingForTree(jsonDecode));
    console.log(SYSM212P_treeData);
    SYSM212P_treeview.dataSource.data(SYSM212P_treeData);
    SYSM212P_treeview.dataSource.options.schema.data = SYSM212P_treeData;

    SYSM212P_treeview.enable(SYSM212P_treeview.findByText(GLOBAL.session.user.decUsrNm), false);
}

function SYSM212P_getCheckedNodes(nodes, checkedNodes) {
    let node;

    for (let i = 0; i < nodes.length; i++) {
        node = nodes[i];
        if (node.checked && node.usrNm) {
            checkedNodes.push({
                orgCd: node.orgCd,
                orgNm: node.orgNm,
                orgPath: node.orgPath,
                usrId: node.usrId,
                usrNm: node.usrNm
            });
        }
        if (node.hasChildren) {
            SYSM212P_getCheckedNodes(node.children.view(), checkedNodes);
        }
    }
}

function SYSM212P_fnConfirm() {
    console.log(SYSM212P_selectNode);
    if (SYSM212P_selectNode.length < 1) {
        return Utils.alert(SYSM212P_langMap.get("SYSM212P.noSelect.msg"));
    } else {
        console.log(Utils.getUrlParam('callbackKey'));
        Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM212P_selectNode);
        Utils.getUrlParam('callbackKey').startsWith('CMMT') ? Utils.closeKendoWindow(SYSM212P_paramId) : self.close()
    }

}

$("#SYSM212P_filterText").on("keyup", function () {
    const FILTER_ALL_VALUE = '1', FILTER_ORG_VALUE = '2', FILTER_USR_VALUE = '3';
    const filterText = $("#SYSM212P_filterText").val();

    let dataSource = $("#treeSYSM212P").data("kendoTreeView").dataSource;
    let getComboValue = $("#comboSYSM212P").data("kendoComboBox").value();

    let selectedFilterArray = [];
    let filterSet = (fieldName, textVal) => {
        return {field: fieldName, operator: "contains", value: textVal};
    }

    switch (getComboValue) {
        case FILTER_ALL_VALUE :
            selectedFilterArray.push(filterText);
            let filterSelected = {logic: "or", filters: []};
            $.each(selectedFilterArray, function (iteration, item) {
                filterSelected.filters.push(filterSet("orgNm", item));
                filterSelected.filters.push(filterSet("usrNm", item));
            });
            dataSource.filter(filterSelected);
            break;
        case FILTER_ORG_VALUE:
            dataSource.filter(filterSet("orgNm", filterText));
            break;
        case FILTER_USR_VALUE :
            dataSource.filter(filterSet("usrNm",filterText));
            break;
        default:
            $("#treeSYSM212P .k-in").closest("li").hide();
            $("#treeSYSM212P .k-group .k-in:contains(" + filterText + ")").each(function () {
                $(this).parents("ul, li").each(function () {
                    $(this).show();
                });
            });
            break;
    }
    
    $('#treeOpenToggleSYSM212P').prop("checked", true);
    SYSM212P_treeview.expand('.k-item');
//    
//    if (Utils.isNull(filterText)) {
//        $('#treeOpenToggleSYSM212P').prop("checked", false);
//        SYSM212P_treeview.collapse('.k-item');
//    } else {
//        $('#treeOpenToggleSYSM212P').prop("checked", true);
//        SYSM212P_treeview.expand('.k-item');
//    }
});