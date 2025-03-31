/***********************************************************************************************
 * Program Name : Kendo Tree example(kendoTree.js)
 * Creator      : djjung
 * Create Date  : 2021.02.16
 * Description  : 파일업로드/다운로드 example
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2021.02.16     djjung           최초작성          
 ************************************************************************************************/
var getdata;

$(document).ready(function () {

    var tree_jsonStr ={
        tenantId : "SMC",
        prsLvl : "ALL",
        orgNm	: "",
        orgStCd	: "ALL"
    };

    $.ajax({
        url         : '/bcs/sysm/SYSM130SEL01',
        type        : 'post',
        dataType    : 'json',
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(tree_jsonStr),
        success     :Treeview_fnReusltFlatData,
        error       : function(request,status, error){
            console.log("[error]");
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    })

});

function Treeview_fnReusltFlatData(data){

    var TreeView_jsonEncode = JSON.stringify(data.SYSM130VOTreeInfo);
    var TreeView_obj=JSON.parse(TreeView_jsonEncode);
    var TreeView_jsonDecode = JSON.parse(TreeView_obj);

    //Kendo 트리용 데이터 변경 Treeview에 지정된속성값
    var tree_treeData = Treeview_fnCreateTreeData(JSON.parse(TreeView_obj));
    $("#kendotreeView1").kendoTreeView({
        dataSource: tree_treeData,
        dataTextField: [ "orgNm"],
        select: function(e) {
            var objects = this.text(e.node);
            var list = $('#output3')
            list.empty();
            $('<li/>').text(objects).appendTo(list)
        }
    });


    $("#kendotreeView2").kendoTreeView({
        dataSource: tree_treeData,
        dataTextField: [ "orgNm"],
        checkboxes: {
            checkChildren: true
        },
        check: function(e) {
                var checkedNodes = [],treeView = $("#kendotreeView2").data("kendoTreeView"),message;
                checkedNodeIds(treeView.dataSource.view(), checkedNodes);

                if (checkedNodes.length > 0) {
                    message = "IDs of checked nodes: " + checkedNodes.join(",");
                } else {
                    message = "No nodes checked.";
                }
                $("#output4").html(message);
        }
    });

    $("#kendotreeView3").kendoTreeView({
        dataSource: tree_treeData,
        dataTextField: [ "orgNm"],
        checkboxes: {
            // checkChildren: true
        },
        check: function(e) {

            var checkedNodes = [],treeView = $("#kendotreeView3").data("kendoTreeView"),message;
            checkedNodeIds(treeView.dataSource.view(), checkedNodes);

            if (checkedNodes.length > 0) {
                message = "IDs of checked nodes: " + checkedNodes.join(",");
            } else {
                message = "No nodes checked.";
            }
            $("#output5").html(message);
        }
    });

}


function checkedNodeIds(nodes, checkedNodes) {

    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].checked) {
            checkedNodes.push(nodes[i].orgNm);
        }
        if (nodes[i].hasChildren) {
            checkedNodeIds(nodes[i].children.view(), checkedNodes);
        }
    }
}

//----------------------- Tree view Data SET subfn------------------------------
//Data Tree 형식으로 변환
function Treeview_fnCreateTreeData(list) {

    //0. Flat Data 정리
    let SYSM130_flatData = [];
    for (let SYSM130_listItem of list) {
        let SYSM130_data = {
            id			: SYSM130_listItem.orgCd,        // 자신 코드 *
            hgrkOrgCd	: SYSM130_listItem.hgrkOrgCd,    // 부모 코드 *
            orgNm		: SYSM130_listItem.orgNm,         // 자신 이름
            expanded    : true
        };
        SYSM130_flatData.push(SYSM130_data);
    }

    let SYSM130_treeCol = [],SYSM130_MappedArr = {};

    //1. 각 항목에 items[] 추가 -- 형식 생성
    SYSM130_flatData.forEach(function(item) {
        let SYSM130_id = item.id;
        if (!SYSM130_MappedArr.hasOwnProperty(SYSM130_id)) { // ID 값이 중복 데이터가 아닐경우
            SYSM130_MappedArr[SYSM130_id] = item; // 해당 키배열에 데이터 row 추가
            SYSM130_MappedArr[SYSM130_id].items = []; // 해당 키배열에 items[] 추가
        }
    })
    //2. 부모 코드 및 자식 코드 맵핑  -- data 삽입
    let SYSM130_MappedElem;
    for (let id in SYSM130_MappedArr) {
        if (SYSM130_MappedArr.hasOwnProperty(id)) {
            SYSM130_MappedElem = SYSM130_MappedArr[id];

            // If the element is not at the root level, add it to its parent array of children. Note this will continue till we have only root level elements left
            if (SYSM130_MappedElem.hgrkOrgCd) { //
                let SYSM130_HgrkOrgCd = SYSM130_MappedElem.hgrkOrgCd;
                SYSM130_MappedArr[SYSM130_HgrkOrgCd].items.push(SYSM130_MappedElem);
            }
            // If the element is at the root level, directly push to the tree
            else {
                SYSM130_treeCol.push(SYSM130_MappedElem);
            }
        }
    }
    return SYSM130_treeCol;
}
//----------------------- Tree view Data SET fn------------------------------


function toggleCheckAll(){
    if($("#checkButton").val() === "Uncheck"){
        $("#kendotreeView3 .k-checkbox-wrapper input").prop("checked", false).trigger("change");
        $("#checkButton").val("Check");
    } else {
        $("#kendotreeView3 .k-checkbox-wrapper input").prop("checked", true).trigger("change");
        $("#checkButton").val("Uncheck");
    }
}
