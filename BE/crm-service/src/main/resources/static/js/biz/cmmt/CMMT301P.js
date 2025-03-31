/***********************************************************************************************
 * Program Name : 통합게시판 카테고리 검색 팝업(CMMT301P.js)
 * Creator      : 김보영
 * Create Date  : 2022.05.11
 * Description  : 통합게시판 카테고리 검색 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.11     김보영           최초작성
 ************************************************************************************************/
var CMMT301P_SelectNode = [];
var CMMT301P_loadCount = 0;
$(document).ready(function () {

    if (Utils.getUrlParam('target') === 'DASH') {
        const getCategories = Utils.getUrlParam('categories');
        const getCheckedNodes = (instance, checkedNodes) => {
            let nodes = instance.items();
            for (let i = 0; i < instance.items().length; i++) {
                let node = instance.dataItem(nodes[i]);
                if (node.checked) {
                    checkedNodes.push(node);
                }
            }
        }

        $("#treeCMMT301P").kendoTreeView({
                dataTextField: ["ctgrNm"],
                checkboxes: {
                    checkChildren: false,
                },
                dataBound: function (e) {
                    let allItems = e.sender.items();
                    if (CMMT301P_loadCount === 1 || allItems.length === 0) {
                        return;
                    }
                    if (allItems.length > 0) {
                        CMMT301P_loadCount += 1;
                    }

                    for (let i = 0; i < allItems.length; i++) {
                        let item = this.dataItem(allItems[i]);
                        if (item.ctgrAttrCd === 1) {
                            allItems.find("input:checkbox").eq(i).hide();
                        }
                        if (Utils.isNotNull(getCategories) && getCategories.includes(item.id)) {
                            allItems.find("input:checkbox").eq(i).click();
                        }
                    }
                },
                change: function (e) {
                    if (this.dataItem(this.select())) {
                        this.select($());
                    }
                },
                select: function (e) {
                    let dataItem = this.dataItem(e.node);
                    if (dataItem.ctgrAttrCd === 1 || dataItem.hgrkCtgrNo === 0) {
                        return;
                    }
                    let checked = dataItem.checked;
                    dataItem.checked = !checked;
                    $(e.node).find('input').eq(0).prop('checked', !checked);
                    this.trigger('check', e);
                },
                check: function (e) {
                    CMMT301P_SelectNode = [];
                    getCheckedNodes(e.sender, CMMT301P_SelectNode)
                }
            }
        ).data("kendoTreeView");
    } else {
        $("#treeCMMT301P").kendoTreeView({
            dataTextField: ["ctgrNm"],
            select: function (e) {
                var ctgrMgntNo = this.dataItem(e.node).id;
                CMMT301P_fnSrchBoardContents(this.dataItem(e.node));
            },
        });
    }
    if (Utils.getUrlParam('dashBrdDispPsnCd') == 'S01') {
        $('#CMMT301P_title').html(CMMT301P_langMap.get("CMMT301P.srchList")+`<button class="popClose" title="" onClick="Utils.closeKendoWindow(${CMMT301P_paramId})"></button>`);
    }

    CMMT301P_fnSrchBoardList();
});


//======================================================================================================================
function CMMT301P_fnSrchBoardList() {
    //쪽지함 트리
    if (Utils.getUrlParam('dashBrdDispPsnCd') == 'S01') {
        let CMMT301P_data = [
            {ctgrNo: 1, ctgrNm: CMMT301P_langMap.get("CMMT301P.noteList"), prsLvl: 1, srtSeq: 1, hgrkCtgrNo: 0, ctgrAttrCd:1},
            {ctgrNo: 2, ctgrNm: CMMT301P_langMap.get("CMMT301P.getnNte"), prsLvl: 2, srtSeq: 2, hgrkCtgrNo: 1},
            {ctgrNo: 3, ctgrNm: CMMT301P_langMap.get("CMMT301P.sendNote"), prsLvl: 2, srtSeq: 3, hgrkCtgrNo: 1},
            {ctgrNo: 4, ctgrNm: CMMT301P_langMap.get("CMMT301P.saveNote"), prsLvl: 2, srtSeq: 4, hgrkCtgrNo: 1}
        ]
        $("#treeCMMT301P").data("kendoTreeView").dataSource.data(CMMT301P_fnSubChangeTreeData(CMMT301P_data))
    } else {
        //게시판 트리
        let tenantIdval = Utils.isNull(Utils.getUrlParam('tenantId')) ? GLOBAL.session.user.tenantId : Utils.getUrlParam('tenantId');
        let dashBrdDispPmssYn = Utils.getUrlParam('dashBrdDispPmssYn');
        let dashBrdDispPsnCd = Utils.isNull(dashBrdDispPmssYn) ? "" : Utils.getUrlParam('dashBrdDispPsnCd')
        let tree_jsonStr = {
            tenantId: tenantIdval
            , usrId: GLOBAL.session.user.usrId
            , orgCd: GLOBAL.session.user.orgCd
            , usrGrdCd: GLOBAL.session.user.usrGrd
            , dashBrdDispPsnCd: dashBrdDispPsnCd
            , dashBrdDispPmssYn: dashBrdDispPmssYn
        };

        Utils.ajaxCall('/cmmt/CMMT200SEL06', JSON.stringify(tree_jsonStr), CMMT301P_fnChangeTreeData,
            false, false, function (request, status, error) {
                console.log("[error]");
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            })
    }

}

//게시글 게시판 목록 세팅
function CMMT301P_fnChangeTreeData(CMMT301P_data) {
    let CMMT301P_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(CMMT301P_data.list)));
    if (Utils.isNotNull(Utils.getUrlParam("dashBrdDispPsnCd"))) {
        if (CMMT301P_jsonDecode.length === 0) {
            Utils.alert('대시보드에 허용된 카테고리가 없습니다.',
                () => Utils.closeKendoWindow(CMMT301P_paramId));
            return;
        }
    }
    let treeCheck = CMMT301P_fnSubCheckListValid(CMMT301P_jsonDecode);

    $("#treeCMMT301P").data("kendoTreeView").dataSource.data(CMMT301P_fnSubChangeTreeData(treeCheck));

}

//트리 부모 구조 체크
function CMMT301P_fnSubCheckListValid(brdlist) {
    let checkId = [];

    brdlist.forEach(function (val) {
        if (val.prsLvl == 1) {
            checkId.push(val);
        } else {
            let isParentExist = false;
            brdlist.forEach(function (parentval) {
                if (val.hgrkCtgrNo == parentval.ctgrNo) {
                    isParentExist = true;
                    return false;
                }
            });
            if (isParentExist) {
                checkId.push(val);
            }
        }
    });

    if (JSON.stringify(brdlist) === JSON.stringify(checkId)) {
        return checkId;
    } else {
        return CMMT301P_fnSubCheckListValid(checkId);
    }
}

//트리구조 변경5
function CMMT301P_fnSubChangeTreeData(list) {
    let MappedArr = [];
    for (let item of list) {
        let data = {
            id: item.ctgrNo,        // 자신 코드
            hgrkCtgrNo: item.hgrkCtgrNo,    // 부모 코드
            ctgrNm: item.ctgrNm,        // 자신 이름
            case: item.count,
            path: item.brdPath,
            tenantId: item.tenantId,
            ctgrAttrCd: item.ctgrAttrCd,
            items: [],
            expanded: true
        };
        MappedArr.push(data);
    }
    let treeCol = [], MappedElem;
    for (let num in MappedArr) {
        if (MappedArr.hasOwnProperty(num)) {
            MappedElem = MappedArr[num];
            if (MappedElem.hgrkCtgrNo) {//부모코드가 있는경우
                let hgrkCtgrNo = MappedArr.findIndex(e => e.id === MappedElem.hgrkCtgrNo); // 부모조직의 인덱스 찾기
                MappedArr[hgrkCtgrNo].items.push(MappedElem);
            } else {//부모코드가 없을경우 -> 최상단
                treeCol.push(MappedElem);
            }
        }
    }

    return treeCol;
}


//게시판 권한 validation
function CMMT301P_fnCheckListValid(CMMT301P_brdlist) {

    var checkId = [];
    CMMT301P_brdlist.forEach(function (val) {
        checkId.push(val.ctgrMgntNo);
    });

    var CMMT301P_lvl2Array = [];
    var CMMT301P_notArray = [];

    //태넌트 부가서비스 정보
    CMMT301P_brdlist.forEach(function (val) {

        // 3depth 부모 존재 여부 check
        if (val.prsLvl == '3') {
            var lvl2 = checkId.includes(val.hgrkCtgrMgntNo);
            if (lvl2) {
                CMMT301P_lvl2Array.push(val.hgrkCtgrMgntNo);
            } else {
                CMMT301P_notArray.push(val.ctgrMgntNo)
            }

            // 2depth 부모 존재 여부 check
        } else if (val.prsLvl == '2') {
            var lvl1 = checkId.includes(val.hgrkCtgrMgntNo);
            if (lvl2) {
                CMMT301P_notArray.push(val.ctgrMgntNo);
            }
        }
    });

    // 3dpeth의 2depth 부모 존재 여부 check
    if (CMMT301P_lvl2Array.length > 0) {
        CMMT301P_brdlist.forEach(function (val) {
            if (val.prsLvl == '2' && CMMT301P_lvl2Array.includes(val.ctgrMgntNo)) {
                var lvl1 = checkId.includes(val.hgrkCtgrMgntNo);
                if (!lvl1) {
                    CMMT301P_notArray.push(val.ctgrMgntNo)
                }
            }
        });
    }

    // 자식 노드만 존재 시 해당 게시판 목록 삭제
    if (CMMT301P_notArray.length > 0) {
        CMMT301P_notArray.forEach(function (val) {
            // 대상 삭제
            var spliceIndex = checkId.findIndex((element) => element == val);
            CMMT301P_brdlist.splice(spliceIndex, 1);
            checkId.splice(spliceIndex, 1);
        })
    }

    // 대상 레벨이 2인경우 하위 레벨 대상 삭제
    var CMMT301P_child = [];
    CMMT301P_brdlist.forEach(function (val2) {
        CMMT301P_notArray.forEach(function (val) {
            if (val2.hgrkCtgrMgntNo == val) {
                CMMT301P_child.push(val2.ctgrMgntNo);
            }
        })
    })
    CMMT301P_child.forEach(function (val) {
        var spliceIndex = checkId.findIndex((element) => element == val);
        CMMT301P_brdlist.splice(spliceIndex, 1);
        checkId.splice(spliceIndex, 1);
    })

    return CMMT301P_brdlist;
}

//Subfunction - 선택된 아이템 추가
function CMMT301P_fnSrchBoardContents(dataItem) {
    CMMT301P_SelectNode = [];
    CMMT301P_SelectNode.push(dataItem);
}

$('#CMMT301P input[name=CMMT301P_OpentreeAll]').on('click', function () {
    if ($(this).is(':checked')) {
        $("#treeCMMT301P").data("kendoTreeView").expand('.k-item');
        $(this).prop("checked", true);
    } else {
        $("#treeCMMT301P").data("kendoTreeView").collapse('.k-item');
        $(this).prop("checked", false);
    }
});


//======================================================================================================================
//Button Event - 확인 버튼 클릭
$('#CMMT301P button[name=btnConfirm]').on('click', function () {
    if (CMMT301P_SelectNode.length < 1) {
        Utils.alert(CMMT301P_langMap.get("CMMT301P.noSelect"));
    } else {
        for (var i = 0; i < CMMT301P_SelectNode.length; i++) {
            if (CMMT301P_SelectNode[i].ctgrAttrCd == 1) {
                Utils.alert('선택하신 게시판은 등록이 불가합니다. 하위 게시판 증 선택해주세요.');
                break;
            } else {
                Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(CMMT301P_SelectNode);
                Utils.closeKendoWindow(Utils.getUrlParam('id'));
                break;
            }
        }
    }
});



