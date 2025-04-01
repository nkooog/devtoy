/***********************************************************************************************
 * Program Name : 테넌트기준정보구성 SYSM510M.js
 * Creator      : mhlee
 * Create Date  : 2022.11.04
 * Description  : 테넌트기준정보구성
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.11.04     mhlee            최초생성
 ************************************************************************************************/
var SYSM510M_cmmCodeList;
var SYSM510M_obj = {}
var SYSM510M_grid = {};
var SYSM510M_capsLockToolTip;

$(document).ready(function () {
    SYSM510M_obj = {
        basicData: "",
        nowStep: 0,
    }
    SYSM510M_grid = {
        instance: {},
        dataSource: {},
        currentItem: {},
        selectedItems: [],
        currentCellIndex: 0,
    };
    SYSM510M_initCombobox();
    setTimeout(function(){
        SYSM510M_initGrid();
        SYSM510M_fnResizeGrid();
        SYSM510M_initTenant();
    },200)
    $("#SYSM510M_usrCheckForm").on("submit",function(e){
        e.preventDefault();
    })
    $("#popupClose").on('click',function(e){
        $(".popup-box").removeClass('show');
    })

    SYSM510M_capsLockToolTip = $("#scrtNo").kendoTooltip({
        filter: ".capsLock",
        content: SYSM510M_langMap.get("SYSM510M.capsLock.msg"),
        position: "bottom",
    }).data("kendoTooltip");
    $("#scrtNo").on('keyup', function(e) {
        if (e.originalEvent.getModifierState("CapsLock")) {
            $(e.target).addClass('capsLock');
            SYSM510M_capsLockToolTip.show();
        } else {
            $(e.target).removeClass('capsLock');
            SYSM510M_capsLockToolTip.hide();

        }
    });
});

function SYSM510M_fnGridCheckBoxHandle(boolean) {
    $("#grdSYSM510M thead input:checkbox").attr("disabled",boolean);
    $("#grdSYSM510M tbody input:checkbox").attr("disabled",boolean);
}

function SYSM510M_fnBasicDataSetting() {
	let SYSM510M_tenantId 	= $("#SYSM510M_tenantId").val();
	let GLOBAL_tenantId 	= GLOBAL.session.user.tenantId;
    let cmmCode 			= SYSM510M_cmmCodeList.filter(x => x.mgntItemCd === 'C0234');
    
    if(SYSM510M_tenantId == GLOBAL_tenantId){
    	Utils.alert(SYSM510M_langMap.get("SYSM510M.altMsg.sameTenantId"));
    	return;
    }
    
    const transferObj = cmmCode.reduce((acc, obj) => {
        let tenantId = $("#SYSM510M_tenantId").val();
        acc.push({
            tenantId: tenantId,
            seq: obj.srtSeq,
            bascInfoCd: String(obj.srtSeq),
            bascInfoNm: obj.comCdNm,
            bascInfoTblId: obj.mapgVlu1,
            frzgStgupRlsCd: "1",
            otxtTenantId: null,
            prgrStgCd: null,
            dataCreNcnt: null,
            tagtInfoCreDtm: null,
        })
        return acc;
    }, [])
    SYSM510M_obj.nowStep = 0;
    SYSM510M_grid.instance.dataSource.data(transferObj);
    $("#grdSYSM510M thead input:checkbox").trigger("click");
    // SYSM510M_fnGridCheckBoxHandle(true);
}

function SYSM510M_initGrid() {
    SYSM510M_grid.dataSource = new kendo.data.DataSource({
        pageSize: 25,
        transport: {
            read: function (options) {
                // SYSM510M_fnGridCheckBoxHandle(false);
                let param = {
                    tenantId: $("#SYSM510M_tenantId").val(),
                };
                Utils.ajaxCall("/sysm/SYSM510SEL01", JSON.stringify(param), function (result) {
                    SYSM510M_obj.basicData = JSON.parse(result.list)
                    SYSM510M_obj.nowStep = 0;
                    //현재 진행단계 max 값 가져오기
                    if (SYSM510M_obj.basicData.length > 0) {
                        SYSM510M_obj.nowStep = Math.max(...SYSM510M_obj.basicData.map(obj => Number(obj.prgrStgCd)), 0);
                    }
                    options.success(SYSM510M_obj.basicData)
                });
            },
            update: function (options) {
                let updateList = options.data.models;
                let selectItems = SYSM510M_grid.selectedItems;
                // SYSM510M_grid.selectedItems 의 아이템만 필터링
                updateList.forEach((item)=>{
                    selectItems.forEach((selected)=> {
                        if (item.bascInfoTblId  === selected.bascInfoTblId ) selected.prgrStgCd = String(SYSM510M_obj.nowStep);
                        else selected.prgrStgCd = String(SYSM510M_obj.nowStep - 1);
                    })
                })
                let regInfo = {
                    tenantId: $("#SYSM510M_tenantId").val(),
                    prgrStgCd: String(SYSM510M_obj.nowStep),
                    tagtInfoCreDtm: new Date(),
                    lstCorcDtm: new Date(),
                    lstCorprId: GLOBAL.session.user.usrId,
                    lstCorprOrgCd: GLOBAL.session.user.orgCd,
                }
                $.each(selectItems, function (index, item) {
                    if (Utils.isNull(item.otxtTenantId)) {
                        item.otxtTenantId = '-';
                    }
                    $.extend(item, regInfo);
                });
                console.log(selectItems);
                switch (SYSM510M_obj.nowStep) {
                    case 2:
                        Utils.ajaxCall("/sysm/SYSM510CopyBasicData", JSON.stringify({list: selectItems}), function (result) {
                            options.success(options.data.models);
                            Utils.alert(result.msg);
                        }, () => $("#SYSM510M_loadingLayer").show(), () => $("#SYSM510M_loadingLayer").hide());
                        break;
                    default:
                        Utils.ajaxCall("/sysm/SYSM510INS01", JSON.stringify({list: selectItems}), function (result) {
                            options.success(options.data.models);
                            Utils.alert(result.msg);
                        });
                        break;
                }
            },
            destroy: function (options) {
                options.success(options.data.models);
            },
        },
        requestStart: function (e) {
            let type = e.type;
            let response = e.response;
        },
        requestEnd: function (e) {
            let type = e.type;
            let response = e.response;

            if (type !== "read" && type !== "destroy") {
                $(".popup-box").removeClass('show');
                SYSM510M_fnSearchBasicInfo();
            }
        },
        batch: true,
        schema: {
            type: "json",
            model: {
                id: "seq",
                fields: {
                    tenantId: {type: "string"},
                    seq: {type: "number"},
                    bascInfoNm: {type: "string"},
                    bascInfoTblId: {type: "string"},
                    frzgStgupRlsCd: {type: "string"},
                    otxtTenantId: {type: "string"},
                    prgrStgCd: {type: "string"},
                    dataCreNcnt: {type: "number"},
                    tagtInfoCreDtm: {type: "number"}
                }
            },
        }
    });

    SYSM510M_grid.instance = $("#grdSYSM510M").kendoGrid({
        dataSource: SYSM510M_grid.dataSource,
        autoBind: false,
        sortable: true,
        resizable: true,
        scrollable: true,
        persistSelection: true,
        selectable: "multiple,row",
        sort: function (e) {
            if (SYSM510M_grid.dataSource.total() === 0) {
                e.preventDefault();
            }
        },
        columns: [
            {width: 30, selectable: true,},
            {
                width: 50, field: "tenantId", title: SYSM510M_langMap.get("SYSM510M.grid.tenantId"), template: function (data) {
                    return Utils.isNull(data.tenantId) ? $("#SYSM510M_tenantId").val() : data.tenantId;
                }
            },
            {width: 30, field: "seq", title: SYSM510M_langMap.get("SYSM510M.grid.seq")},
            {width: 120, field: "bascInfoNm", title: SYSM510M_langMap.get("SYSM510M.grid.bascInfoNm"),},
            {width: 300, field: "bascInfoTblId", title: SYSM510M_langMap.get("SYSM510M.grid.bascInfoTblId"),},
            {
                width: 80, field: "frzgStgupRlsCd", title: SYSM510M_langMap.get("SYSM510M.grid.frzgStgupRlsCd"),
                template: function (dataItem) {
                    return Utils.getComCdNm(SYSM510M_cmmCodeList, "C0301", $.trim(dataItem.frzgStgupRlsCd));
                },
                editor: function (container, options) {
                    SYSM510M_fnComboEditor(container, options, SYSM510M_grid.instance);
                },
            },
            {width: 60, field: "otxtTenantId", title: SYSM510M_langMap.get("SYSM510M.grid.otxtTenantId")},
            {
                width: 60, field: "prgrStgCd", title: SYSM510M_langMap.get("SYSM510M.grid.prgrStgCd"),
                template: function (dataItem) {
                    let html = '<p class="btn_gap">'
                    for (let i = 0; i < 3; i++) {
                        const btnType = dataItem.prgrStgCd >= i + 1 ? "btnRefer_primary" : "btnRefer_fourth";
                        html += `<button class="${btnType} Small">${i + 1}</button>`;
                    }
                    html += '</p>';
                    return html;
                },
            },
            {width: 80, field: "dataCreNcnt", title: SYSM510M_langMap.get("SYSM510M.grid.dataCreNcnt"),},
            {
                width: 80, field: "tagtInfoCreDtm", title: SYSM510M_langMap.get("SYSM510M.grid.tagtInfoCreDtm"),
                template: '#=Utils.isNull(tagtInfoCreDtm) ? "" : kendo.format("{0:yyyy-MM-dd HH:mm}",new Date(tagtInfoCreDtm))#'
            },
        ],
        noRecords: {template: '<div class="nodataMsg"><p>' + SYSM510M_langMap.get("grid.nodatafound")+ '</p></div>'},
        pageable: {
            refresh: true
            , pageSizes: [25, 50, 100, 200, 500]
            , buttonCount: 10
            ,
        },
        edit: function (e) {
            if (SYSM510M_grid.currentCellIndex !== 5) {
                this.closeCell();
            }
        },
        dataBound: function (e) {
            const $createBtn = $('#SYSM510M_Btn_newCreate');
            let items = e.sender.items();
            $createBtn.prop('disabled', items.length !== 0);
            items.off("click").on("click", function (e) {
                SYSM510M_grid.currentCellIndex = $(e.target).index();
            });
            SYSM510M_bottomBtnHandle();
        },
        change: function (e) {
            let rows = e.sender.select();
            let items = [];
            rows.each(function (e) {
                let dataItem = SYSM510M_grid.instance.dataItem(this);
                items.push(dataItem);
            });
            SYSM510M_grid.selectedItems = items;
            SYSM510M_bottomBtnHandle();
        },
    }).data("kendoGrid");
    Utils.setKendoGridDoubleClickAction("#grdSYSM510M");
    $("#grdSYSM510M").kendoTooltip({
        filter: "th[data-field=prgrStgCd]", // Select the th elements of the Grid.
        position: "top",
        width: 150,
        showOn: "click mouseenter",
        content: function(e){
            return ` 
                <button class="btnRefer_default ma_left5 Small">1</button><b>${SYSM510M_langMap.get("SYSM510M.prgrStgCd.step1")}</b><br>
                <button class="btnRefer_default ma_left5 Small">2</button><b>${SYSM510M_langMap.get("SYSM510M.prgrStgCd.step2")}</b><br>
                <button class="btnRefer_default ma_left5 Small">3</button><b>${SYSM510M_langMap.get("SYSM510M.prgrStgCd.step3")}</b>`
        }
    }).data("kendoTooltip");
}

function SYSM510M_bottomBtnHandle() {
    // 0단계 - 저장
    // 1단계 - 전체체크 (일괄삭제,저장, 원본=타겟 테넌트), 그 외 (타겟 테넌트, 저장)
    // 2단계 - 위와 동일 + 프리징설정 해제
    // 3단계 - (프리징 전체 설정 되어 있음) -> 1개 로우 클릭 시, 저장 버튼 활성화

    const deleteAllValid = SYSM510M_grid.instance.dataSource.data().length !== 0 && SYSM510M_grid.selectedItems.length > 0;
    const selectedItemsCount = SYSM510M_grid.selectedItems.length;
    const $deleteAllButton = $('#SYSM510M_Btn_deleteAll');
    const $saveButton = $('#SYSM510M_Btn_save');
    const $basicDataCopyButton = $("#SYSM510M_Btn_BasicDataCopy");
    const $tenantComboBox = $("#SYSM510M_comboTenant").data("kendoComboBox");
    const $freezingComboBox = $("#SYSM510M_comboFreezing").data("kendoComboBox");

    $deleteAllButton.prop('disabled', !deleteAllValid);
    $saveButton.prop('disabled', !(selectedItemsCount > 0));
    $freezingComboBox.enable(false);

    switch (SYSM510M_obj.nowStep) {
        case 0 :
            $tenantComboBox.enable(false);
            $deleteAllButton.prop('disabled', true);
            $basicDataCopyButton.prop('disabled', true);
            break;
        case 1 :
            $tenantComboBox.enable(true);
            $tenantComboBox.input.attr("readonly", true);
            $saveButton.prop('disabled',true);
            $basicDataCopyButton.prop('disabled', !deleteAllValid);
            break;
        case 2 :
            $tenantComboBox.enable(false);
            $freezingComboBox.enable(true);
            $basicDataCopyButton.prop('disabled', deleteAllValid);
            break;
        case 3:
        	const hasSelectedItemsWithFrzgCd = SYSM510M_grid.selectedItems.some(item => item.frzgStgupRlsCd === '2');
        	if(!hasSelectedItemsWithFrzgCd){
        		$tenantComboBox.enable(false);
            	$basicDataCopyButton.prop('disabled', true);
            	$freezingComboBox.enable(true);
            	$deleteAllButton.prop('disabled', false);
            	$saveButton.prop('disabled',false);
        	} else {
        		$tenantComboBox.enable(false);
            	$basicDataCopyButton.prop('disabled', true);
            	$freezingComboBox.enable(true);
            	$deleteAllButton.prop('disabled', true);
            	$saveButton.prop('disabled',false);	
        	}
            break;
    }
}

function SYSM510M_initTenant() {
    const before = () => SYSM510M_grid.instance.dataSource.data([]);
    const lengthTrue = SYSM510M_fnSearchBasicInfo;
    CMMN_SEARCH_TENANT["SYSM510M"].fnInit(before,lengthTrue,null);
}

function SYSM510M_tenantComboSetting() {
    Utils.ajaxCall('/sysm/SYSM100SEL01', JSON.stringify({tenantId: ""}), function (result) {
        let basicTenant = JSON.parse(result.SYSM100VOInfo);

        Utils.setKendoComboBoxCustom(
            basicTenant, "#SYSM510M_comboTenant", "tenantId", "svcExpryDd", "", "선택")
            .bind('change', function (e) {
                let value = e.sender.text();
                SYSM510M_grid.selectedItems.map(dataItem => dataItem.set('otxtTenantId', value));
                SYSM510M_grid.instance.refresh();
            });
    });
}

function SYSM510M_initCombobox() {
    let param = {
        "codeList": [
            {"mgntItemCd": "C0234"}, // 기준_정보
            {"mgntItemCd": "C0301"}, // 프리징_설정_해제 (1:해제, 2:설정)
            {"mgntItemCd": "C0302"}, // 진행 단계       (1:기준생성, 2:표준Data복사, 3:프리징설정)
        ]
    };
    Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), async function (result) {
        SYSM510M_cmmCodeList = await JSON.parse(result.codeList);
        Utils.setKendoComboBox(SYSM510M_cmmCodeList, 'C0301', "#SYSM510M_comboFreezing", "", "선택")
            .bind('change', function (e) {
                let value = e.sender.value();
                SYSM510M_grid.selectedItems.map(dataItem => dataItem.set('frzgStgupRlsCd', value));
                // for (const dataItem of SYSM510M_grid.selectedItems) {
                // item.dirty = true;
                // item.dirtyFields.frzgStgupRlsCd = true;
                // item.frzgStgupRlsCd = value;
                // }
                SYSM510M_grid.instance.refresh();
            });
    });
    SYSM510M_tenantComboSetting();
}

function SYSM510M_fnComboEditor(container, options, grid) {
    const disabled = SYSM510M_obj.nowStep > 2 ? "" : "disabled";
    let $select = $('<input data-bind="value:' + options.field + '"  ' + disabled + ' />').appendTo(container);
    let typeCombo = Utils.setKendoComboBox(SYSM510M_cmmCodeList, "C0301", $select, "", false)
    typeCombo.bind("change", function (e) {
        let element = e.sender.element;
        let dataItem = grid.dataItem(element.closest("tr"));
        let selectedValue = e.sender.value();
        dataItem.set(options.field, selectedValue);
        grid.refresh();
    });
}

function  SYSM510M_fnSearchBasicInfo() {
    SYSM510M_grid.dataSource.read();
}

function SYSM510M_fnResizeGrid() {
    // (헤더 + 푸터)영역 높이 제외
    const screenHeight = $(window).height() - 210;
    // (헤더 + 푸터 + 검색 )영역 높이 515;
    if (SYSM510M_grid.instance.element) ;
    SYSM510M_grid.instance.element.find('.k-grid-content').css('height', screenHeight - 260);
}

$(window).on("resize", function () {
    SYSM510M_fnResizeGrid();
});

//각 단계 별 진행
function SYSM510M_progressCheck(element) {
	
    var actionValue = element.value;
    var comboFreezingValue = $("#SYSM510M_comboFreezing").val();
    var altMsg = "";

    //일괄 살제
    if (actionValue == "delete") {
        SYSM510M_fnDeleteAll();        
    }
 
    //복제
    if(actionValue == "insert") {    	
    	altMsg = SYSM510M_langMap.get("SYSM510M.altMsg.tenantBasicInfoCopy");        	
	    SYSM510M_obj.nowStep += 1;
	    
	    if (SYSM510M_obj.nowStep == 2) {
	        let comboTenant = $("#SYSM510M_comboTenant").data("kendoComboBox");
	        if (Utils.isNull(comboTenant.value()) && comboTenant.text() == '선택') {
	            Utils.alert(SYSM510M_langMap.get("SYSM510M.nonTargetTenant.msg"));
	            SYSM510M_obj.nowStep -= 1;
	            return;
	        }
	    }
	    
	    Utils.confirm(altMsg, function () {
	        SYSM510M_grid.instance.dataSource.sync().then(function () {
	        	SYSM510M_fnSearchBasicInfo();
	        });
	    });	    
    }
    
    //저장
    if (actionValue == "save") {
       	if (SYSM510M_obj.nowStep == 0 && actionValue == "save") {
            $.each(SYSM510M_grid.instance.dataSource.data(), function(index, item) {
                item.dirty = true;
            });
        }
       	
       	//일반 저장
       	if (comboFreezingValue == ""){       		
       		altMsg = SYSM510M_langMap.get("SYSM510M.altMsg.tenantBasicInfoSave");       		
       		SYSM510M_obj.nowStep = 1;
       		
       		Utils.confirm(altMsg, function () {   
		        SYSM510M_grid.instance.dataSource.sync().then(function () {
		        	SYSM510M_fnSearchBasicInfo();
		        });
		    });

       	}
       	
       	//프리징/프리징 해제
       	if (comboFreezingValue == "1" || comboFreezingValue == "2"){       		
       		if(comboFreezingValue == "1"){
        		altMsg = SYSM510M_langMap.get("SYSM510M.altMsg.freezingOff");
        	} else if(comboFreezingValue == "2"){
        		altMsg = SYSM510M_langMap.get("SYSM510M.altMsg.freezingOn");
        	}
       		
       		var param = {
    			tenantId: $("#SYSM510M_tenantId").val(),
    			frzgStgupRlsCd: comboFreezingValue,
            	prgrStgCd: (comboFreezingValue == "1") ? "2" : "3"
        	};
                
        	Utils.ajaxCall("/sysm/SYSM510UPT02", JSON.stringify(param), function (result) {        		
        		Utils.alert(result.msg);
        		
	        	if(comboFreezingValue == "1"){
	        		$('#SYSM510M_Btn_deleteAll').prop('disabled',false);
	        	}
        		SYSM510M_fnSearchBasicInfo();
        	});
       	}
    }
}

//일괄 삭제
function SYSM510M_fnDeleteAll() {
	
	var hasSelectedItemsWithFrzgCd = SYSM510M_grid.selectedItems.some(item => item.frzgStgupRlsCd === '2');
	var altMsg = SYSM510M_langMap.get("SYSM510M.altMsg.delateAll");

    // 3단계 일 경우, 프리징 설정단계 확인
    if (hasSelectedItemsWithFrzgCd && SYSM510M_obj.nowStep === 3) {
        return;
    }
    
    let selectedItems = SYSM510M_grid.selectedItems;
    let nowTenantId = $("#SYSM510M_tenantId").val();
    if (nowTenantId.includes('BRD') || nowTenantId.includes('CRM')) {
        Utils.alert(SYSM510M_langMap.get("SYSM510M.delete.protect"));
        return;
    }

    // 1,2, 단계는 바로 삭제
    Utils.confirm(altMsg, function () {
        // "삭제하시겠습니까?"
        $.each(selectedItems, function (index, item) {

            item.tagtInfoCreDtm = new Date();
            item.lstCorcDtm = new Date();
        })
        console.log(selectedItems);
        // 역순으로 삭제하기 위해 정렬 순서 변경
        selectedItems.sort((a, b) => {
            const A = a.seq
            const B = b.seq
            if (B < A) return -1;
            if (B > A) return 1;
            return 0;
        });
        Utils.ajaxCall("/sysm/SYSM510DEL01", JSON.stringify({list: SYSM510M_grid.selectedItems}),
            function (result) {
                $("#SYSM510M_usrCheckForm")[0].reset();
                $(".popup-box").removeClass('show');
                Utils.alert(result.msg, SYSM510M_fnSearchBasicInfo);
            });
    });
}