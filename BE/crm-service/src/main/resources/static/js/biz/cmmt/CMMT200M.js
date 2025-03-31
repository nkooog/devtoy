/***********************************************************************************************
 * Program Name : CMMT200M.js
 * Creator      : bykim
 * Create Date  : 2022.06.08
 * Description  : 통합게시글 관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.06.08     bykim            최초생성
 *
 ************************************************************************************************/

var CMMT200M_userInfo, CMMT200M_PuslmnStr, CMMT200M_Serch_elastic;
var CMMT200M_listViewCMMT200M, CMMT200MDataSource, CMMT200M_treeCMMT200M;
var CMMT200M_autoCompleObj, CMMT200M_ctntsList, CMMT200M_catagoryPath, CMMT300P_ctgrMgntNo, CMMT300P_ctgrMgntNm;
var CMMT200M_IsSearch_toElastic= false;
var CMMT200M_puslmnCount, CMMT200M_ncsyCount;
var CMMT200M_encryptYn;
var CMMT200M_ctgrTypCd;			//kw---20230705 : 게시글 작성, 수정 등 게시판 유형을 알기 위함(커뮤니티 일 경우 엘라스틱 상태는 99)

$(document).ready(function () {
	CMMT200M_userInfo = GLOBAL.session.user;
	//달력 초기화
	$("#CMMT200M_fromDt").val( kendo.format("{0:yyyy-MM-dd}","2020-01-01"));
	$("#CMMT200M_toDt").val(kendo.format("{0:yyyy-MM-dd}",new Date()));

	//kw---20230706 : 게시물생성 초기에는 disabled
	//--- 아무런 게시물이 없을 경우 카테고리 선택이 안됐을 경우
	$('#CMMT200M_btnCMMT300POpen').attr("disabled", true);

	//kw---20230615 : 고객정보 복호화 여부 키 추가
	CMMT200M_encryptYn = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1;

	//콤보초기화
	CMMT200M_setCombo();

	//user select 초기화
	let multiSelectDataSourceInit = [];
/*    var CMMT200M_selectUsr = $("#CMMT200M_mulUsrId").kendoMultiSelect({
		dataTextField: "text",
		dataValueField: "value",
		placeholder:CMMT200M_langMap.get("CMMT200M.select"),
		autoClose: false,
		tagMode: "single",
		itemTemplate: '<p class="multiCheck">#: text #</p>',
		height: 200,
		dataSource: multiSelectDataSourceInit,
	}).data("kendoMultiSelect");

	CMMT200M_selectUsr.ul.addClass('multiSelect');
	*/

	//shpark 20240905 : 콤보박스 글자입력되는 문제로 인해 공통함수로 변경
	Utils.setKendoMultiSelectCustom(multiSelectDataSourceInit, "#CMMT200M_mulUsrId", "text","value",false);

	//listview 초기화
	CMMT200MDataSource ={
			transport: {
				read	: function (CMMT200M_jsonStr) {
					if(Utils.isNull(CMMT200M_jsonStr.data)){
						Utils.ajaxCall('/cmmt/CMMT210SEL01', CMMT200M_jsonStr, CMMT200M_fnSrcBoardList,
								window.kendo.ui.progress($("#listViewCMMT200M"), true), window.kendo.ui.progress($("#listViewCMMT200M"), false)) ;
					}else{
						window.kendo.ui.progress($("#listViewCMMT200M"), false)
					}
				}
			}
	}

    $("#listViewCMMT200M").kendoListView({
    	dataSource : CMMT200MDataSource,
		//   data 없을때
		noRecords: { template: '<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>' },
    	scrollable: true,
        pageable: {
            refresh: false
            , pageSizes: [25, 50, 100, 200, 500]
            , buttonCount: 10
            , pageSize: 25
            , messages: {
                display: " "
                , itemsPerPage: ""
            }
        },
        dataBound: function(e) {
	        if(this.dataSource.data().length == 0){
	            //custom logic
	            $(".k-listview-content").append('<div class="nodataMsg"><p>'+CMMT200M_langMap.get("CMMT200M.nodatafound")+'</p></div>');
	        }
	    },
        template: kendo.template($("#templateCMMT200M").html()),
    });

	// tree 초기화
    $('#treeCMMT200M').kendoTreeView({
		autoScroll: true,
		template: function(item) {
			if (item.item.case != 0) {
				return item.item.ctgrNm + ' <span class="fontRed">(' + item.item.case + ')</span>';
			} else {
				return item.item.ctgrNm;
			}
			return item.item.ctgrNm;
		},
		dataTextField: ["ctgrNm"],
		select: function(e) {
			let selectedNode = this.dataItem(e.node);
			$('#CMMT200_ctgrNm').val(selectedNode.ctgrNm)
			if(!selectedNode.hasChildren){
				CMMT200M_fnListFilter(selectedNode);
			}

		},
		/*
			shpark 20240830
			트리뷰 클릭 시  하위 메뉴가 있으면 필터가 아니고 노드 열고 닫기로 변경 을 위한 이벤트 추가
		 */
		dataBound : function (e){
			let treeView = this
			treeView.element.on("click", ".k-item .k-in", function(e) {
				let node = $(e.target).closest(".k-item");
				let dataItem = treeView.dataItem(node);

				if(dataItem.hasChildren){
					// 선택된 노드가 현재 열려 있는지 닫혀 있는지 확인합니다.
					if (dataItem.expanded) {
                        // 노드가 열려 있으므로 닫습니다.
                        CMMT200M_treeCMMT200M.collapse(node);
                    } else {
                        // 노드가 닫혀 있으므로 엽니다.
                        CMMT200M_treeCMMT200M.expand(node);
                    }
				}
				e.preventDefault(); // 기본 동작 방지
			});
		}
	});

    //kw---20230613 : 알림을 통해 넘어온 파라미터 값
    CMMT200M_puslmnCount = $("#CMMT200M_puslmnCount").val();	//열람하지 않은 페이지 수
    CMMT200M_ncsyCount = $("#CMMT200M_ncsyCount").val();		//승인이 필요한 페이지 수

    CMMT200M_listViewCMMT200M = $("#listViewCMMT200M").data("kendoListView");
	CMMT200M_treeCMMT200M = $("#treeCMMT200M").data("kendoTreeView");

	GridResizeTableCMMT200M();
	// search list
//	CMMT200M_fnLoadBoardList();
	//CMMT200M_fnSrchBoardList();

	CMMT200M_fnSrchGrid(true);

	$(document).on("click", "#listViewCMMT200M .cont", function() {
		// shpark 20241029 : 결함리포트 181 수정
		const item = $(this).children(".subject").get(0)
	    CMMT200M_fnPopup_DASH110P(item)
	})
});

function CMMT200M_fnLoadBoardList(){
	let CMMT200M_Serch_data = {
		tenantId : GLOBAL.session.user.tenantId
		,usrId : GLOBAL.session.user.usrId
		,usrGrdCd :GLOBAL.session.user.usrGrd
		,orgCd : GLOBAL.session.user.orgCd
		,isAdmin: GLOBAL.session.user.cmmtSetlmnYn === "Y" ? true: false
	};


	let CMMT200M_jsonStr = JSON.stringify(CMMT200M_Serch_data);
//	Utils.ajaxCall('/cmmt/CMMT200SEL01', CMMT200M_jsonStr, CMMT200M_fnSrcBoardList) ;
	Utils.ajaxCall('/cmmt/CMMT200SEL01', CMMT200M_jsonStr, function(data){
		let result = JSON.parse(data.list);
		CMMT200M_fnSrcBoardList(data);
	});
}


function GridResizeTableCMMT200M() {
	var screenHeight = $(window).height();

	CMMT200M_treeCMMT200M.wrapper.css('height', screenHeight-400);   //   (헤더+ 푸터+ 검색 )영역 높이 제외
	CMMT200M_listViewCMMT200M.wrapper.css('height', screenHeight-405);
	CMMT200M_listViewCMMT200M.element.find('.k-listview-content').css('height', screenHeight-407);
}


//[  List 형 or  갤러리 형  보기 ]  예제
$('#CMMT200M_listTyp').on('click',function(){
	$('.combineBoard').removeClass('Gallery');
});
$('#CMMT200M_galTyp').on('click',function(){
	$('.combineBoard').addClass('Gallery');
});

//엔터 키 입력
$('#CMMT200M_srchText').keydown(function(e) {
	if(e.key ==="Enter"){ CMMT200M_fnSrchGrid();}
});


//Treeview  전체열기
$('#CMMT200M_treeOpenToggle').on('click', function(){
	if($(this).is(':checked'))  CMMT200M_treeCMMT200M.expand('.k-item') , $(this).prop("checked", true);
	else CMMT200M_treeCMMT200M.collapse('.k-item') , $(this).prop("checked", false);
});


//자동완성 초기화
function CMMT200M_autoCompInit(CMMT200M_data){
	var CMMT200M_jsonEncode = JSON.stringify(CMMT200M_data.CMMT200VOInfo);
	var CMMT200M_obj=JSON.parse(CMMT200M_jsonEncode);
	var CMMT200M_jsonDecode = JSON.parse(CMMT200M_obj);

	CMMT200M_autoCompleObj.dataSource.data( CMMT200M_jsonDecode);
}

//임시 콤보 세팅
function CMMT200M_setCombo(){

	var ComboBox_CMMT200M_2 = [
		{ text: CMMT200M_langMap.get("CMMT200M.all"), value: "1" }, { text: CMMT200M_langMap.get("CMMT200M.read"), value: "2" }, { text: CMMT200M_langMap.get("CMMT200M.notRead"), value: "3" },
	]

	Utils.setKendoComboBoxCustom(ComboBox_CMMT200M_2, "#CMMT200M_cobPuslmn", "text","value","1",false);

	let CMMT200M_mgntItemCdList = [{"mgntItemCd":"C0084"},{"mgntItemCd":"S0007"},{"mgntItemCd":"C0004"}];

	Utils.ajaxCall('/comm/COMM100SEL01',  JSON.stringify({ "codeList": CMMT200M_mgntItemCdList}),function(data){
		CMMT200M_commCodeList = JSON.parse(JSON.parse(JSON.stringify(data.codeList)));
		Utils.setKendoMultiSelect(CMMT200M_commCodeList, "C0084", '#CMMT200M_srchKnowState', false);
		Utils.setKendoComboBox(CMMT200M_commCodeList, "S0007", '#CMMT200M_cobSrchCond',"1",true);
		Utils.setKendoComboBox(CMMT200M_commCodeList, "C0004", '#CMMT200M_alrmUseYn', '', true) ;

	    if(!Utils.isNull(CMMT200M_ncsyCount) && CMMT200M_ncsyCount > 0){
			$('#CMMT200M_srchKnowState').data("kendoMultiSelect").value(["11", "14"]);
	    } else if(!Utils.isNull(CMMT200M_puslmnCount) && CMMT200M_puslmnCount > 0){
	    	$('#CMMT200M_cobPuslmn').data("kendoComboBox").select(2);
	    	$('#CMMT200M_alrmUseYn').data("kendoComboBox").select(1);
	    }

		CMMT200M_ncsyCount = "";
		CMMT200M_puslmnCount = "";

		},null,null,null );
}

//사용자찾기 팝업(복수 검색)
function CMMT200M_fnUsrPopup() {
	Utils.setCallbackFunction("CMMT200M_fnUsrCallback", CMMT200M_fnUsrCallback);
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM211P", "SYSM211P" , 960, 535, {callbackKey: "CMMT200M_fnUsrCallback"});
}

function CMMT200M_fnUsrCallback(item) {
    let reformattedArray = item.map(function (obj) {
        let rObj = {};
        for (const [key, value] of Object.entries(obj)) {
            rObj[key] = value
        }
        return rObj;
    });
    CMMT200M_setKendoMultiSelect(reformattedArray, '#CMMT200M_mulUsrId', 'decUsrNm', 'usrId');
}

//멀티콤보 값 SET
function CMMT200M_setKendoMultiSelect(codeList, target, setText, setValue) {
    let options = {
        placeholder: "",
        dataTextField: "text",
        dataValueField: "value",
        autoClose: false,
        autoBind: false,
        clearButton: false,
        tagMode: "single",
        downArrow: false,
        height: 200,
        dataSource: codeList.filter(function (code) {
            try {
                if (code[setText] && code[setValue]) {
                    code.text = code[setText]
                    code.value = code[setValue]
                    return code;
                }
            } catch (e) {
                console.log(e);
            }
        }),
        itemTemplate: '<p class="multiCheck">#= text # (#=value#) </p>',
    };
    let kendoMultiSelect = $(target).kendoMultiSelect(options).data("kendoMultiSelect");
    kendoMultiSelect.ul.addClass('multiSelect');
    kendoMultiSelect.dataSource.filter({});
    kendoMultiSelect.value(options.dataSource);

    return kendoMultiSelect;
}

//게시판 목록 조회
function CMMT200M_fnSrchBoardList(){

//	return;
//
//	CMMT200M_listViewCMMT200M.dataSource.data([]);
//
//	let type;
//	if($('#CMMT200M_cobSrchCond').val() =="1"){
//		type ="TITLE"
//	}else if($('#CMMT200M_cobSrchCond').val() =="2"){
//		type ="CONTENT"
//	}else {
//		type ="ALL"
//	}
//
//	let knowState = [];
//	if($('#CMMT200M_srchKnowState').data("kendoMultiSelect").value().length>=1){
//		if($('#CMMT200M_srchKnowState').data("kendoMultiSelect").value()[0] !==''){
//			knowState= $('#CMMT200M_srchKnowState').data("kendoMultiSelect").value()
//		}
//	}
//
//	CMMT200M_Serch_elastic = {
//			tenantId : GLOBAL.session.user.tenantId
//			,usrId : GLOBAL.session.user.usrId
//			,usrGrdCd :GLOBAL.session.user.usrGrd
//			,orgCd : GLOBAL.session.user.orgCd
//			,isAdmin : GLOBAL.session.user.cmmtSetlmnYn === "Y" ? true : false
//			,startDate: $('#CMMT200M input[name=CMMT200M_fromDt]').val()
//			,endDate: $('#CMMT200M input[name=CMMT200M_toDt]').val()
//			,knowState: knowState
//			,knowRegId: $('#CMMT200M_mulUsrId').data("kendoMultiSelect").value()
//			,type: type
//			,keyWord:  $('#CMMT200M input[name=CMMT200M_srchText]').val()
//			,puslYn : $('#CMMT200M_cobPuslmn').val()
//		};
//
//	CMMT200M_IsSearch_toElastic = true;
//	Utils.ajaxCall('/cmmt/CMMT210SEL01', JSON.stringify(CMMT200M_Serch_elastic),function(data){
//
//		CMMT200M_fnSrcBoardList(data);
//
//		if(GLOBAL.session.user.autoPfcnUseYn == "Y"){
//			// 최근검색어 저장
//			let param = {
//					tenantId : GLOBAL.session.user.tenantId
//					,scwd:  $('#CMMT200M input[name=CMMT200M_srchText]').val()
//					,regrId : GLOBAL.session.user.usrId
//					,regrOrgCd :GLOBAL.session.user.usrGrd
//			}
//			Utils.ajaxCall('/cmmt/CMMT200INS01', JSON.stringify(param),null,null,null,false);
//			$("#CMMT200M input[name=CMMT200M_srchText]").data("kendoAutoComplete").dataSource.transport.read();
//		}
//
//	}, window.kendo.ui.progress($("#listViewCMMT200M"), true), window.kendo.ui.progress($("#listViewCMMT200M"), false));
}

//트리 리스트 생성
function CMMT200M_fnSrcBoardList(CMMT200M_data){
	let CMMT200M_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(CMMT200M_data.list)));
	let treeCheck = CMMT200M_fnSubCheckListValid(CMMT200M_jsonDecode);

	if(Utils.isNull(treeCheck)){
		Utils.alert(CMMT200M_langMap.get("CMMT200M.noList"));
		return;
	}else{
		if(treeCheck[0].ctgrAttrCd == 1 ||treeCheck[0].writPmssYn == 'N' ){
			$('#CMMT200M_btnCMMT300POpen').attr("disabled", true);
		}
	}

	CMMT200M_treeCMMT200M.dataSource.data(CMMT200M_fnSubChangeTreeData(treeCheck));



}

//트리 부모 구조 체크
function CMMT200M_fnSubCheckListValid(brdlist){
	let checkId = [];

	brdlist.forEach(function (val) {
		if(val.prsLvl == 1){
			checkId.push(val);
		}else{
			let isParentExist =false;
			brdlist.forEach(function (parentval) {
				if(val.hgrkCtgrNo==parentval.ctgrNo){
					isParentExist =true;
					return false;
				}
			});
			if(isParentExist){
				checkId.push(val);
			}
		}
	});

	if(JSON.stringify(brdlist) === JSON.stringify(checkId)){
		return checkId;
	}else{
		return CMMT200M_fnSubCheckListValid(checkId);
	}
}
//트리구조 변경5
function CMMT200M_fnSubChangeTreeData(list) {
	let MappedArr = [];
	for (let item of list) {
 		let data = {
			id			: item.ctgrMgntNo,        // 자신 코드
			hgrkCtgrNo	: item.hgrkCtgrNo ,    // 부모 코드
			ctgrNm		: item.ctgrNm,        // 자신 이름
			case 		: item.itemCount,
			ctgrAttrCd	: item.ctgrAttrCd,
			ctgrNm	: item.ctgrNm,
			items		: [],
			expanded    : true,
			rdPmssYn	: item.rdPmssYn,				//kw게시판 - 읽기 권한
			atclWritPmssYn : item.atclWritPmssYn,		//kw기본설정 - 쓰기 권한
			writPmssYn	:	item.writPmssYn,			//kw게시판 권한 - 쓰기 권한
			brdPath		:	item.brdPath,				//kw---카테고리 경로
			itemCount	:	item.itemCount,				//kw---아이템 개수
			ctgrTypCd	:	item.ctgrTypCd,				//kw---게시판유형(게시판:1, 카테고리:2)

		};
		MappedArr.push(data);
	}

	let treeCol = [], MappedElem;
	for (let num in MappedArr) {
		if (MappedArr.hasOwnProperty(num)) {
			MappedElem = MappedArr[num];
			if (MappedElem.hgrkCtgrNo) {//부모코드가 있는경우
				let hgrkCtgrNo = MappedArr.findIndex(e=>e.id===MappedElem.hgrkCtgrNo); // 부모조직의 인덱스 찾기
				MappedArr[hgrkCtgrNo].items.push(MappedElem);
			} else {//부모코드가 없을경우 -> 최상단
				treeCol.push(MappedElem);
			}
		}
	}

	return treeCol;
}




// 게시글 조회
function CMMT200M_fnSrchBoardContents(ctgrNo){
	if(CMMT200M_IsSearch_toElastic){
		CMMT200M_Serch_elastic.ctgrNo= ctgrNo;
		Utils.ajaxCall('/cmmt/CMMT210SEL03',  JSON.stringify(CMMT200M_Serch_elastic), function(data){
			let CMMT200VOInfo = JSON.parse(JSON.parse(JSON.stringify(data.list)));

			let list = [];
			$(CMMT200VOInfo.hits.hits).each(function (index,value){
				let rpsImg ="", stNm ="";
				 if(!Utils.isNull(value._source.rpsImgIdxNm)){
					   rpsImg = '<img src="'+GLOBAL.contextPath+'/cmmtphotoimg/'+ value._source.tenantId+'/'+ value._source.rpsImgIdxNm+'">';
				   }
				   let moktiCtt = Utils.htmlDecode(value._source.mokti[0].moktiCtt).replace(/<[^>]*>?/g, '');
				   CMMT200M_commCodeList.filter(function (code){
						if(code.mgntItemCd ==="C0084"){
							if(code.comCd === value._source.stCd){ stNm = code.comCdNm}
						}
					})

				let obj = {
					ctgrNo: value._source.ctgrMgntNo
					,cntntsNo:value._source.blthgMgntNo
					,cntntsTite:value._source.title
					,usrNm: value._source.regrNm
					,regDtm : kendo.format("{0:yyyy-MM-dd}",new Date(value._source.regDtm))
					,blthgRpsImg: rpsImg
//					,moktiCtt : moktiCtt
					,chkAuth : CMMT200M_fnChkAuth(value._source.stCd, value._source.regrId)
					,blthgStNm: stNm
					,ctgrNm : $('#CMMT200_ctgrNm').val()
					,countFile : value._source.appendFileCount
					,chkAuthDel : CMMT200M_fnChkAuthDel(value._source.stCd, value._source.regrId)
				}
 				list.push(obj);
			});

			CMMT200M_ctntsList = list;
			CMMT200M_listViewCMMT200M.dataSource.data(list);
		});
	}else{
		var CMMT200M_Serch_data = {
				 tenantId : CMMT200M_userInfo.tenantId
				, ctgrMgntNo : ctgrNo
				, puslYn : $('#CMMT200M_cobPuslmn').val()
				, usrId : CMMT200M_userInfo.usrId
				, isAdmin: GLOBAL.session.user.cmmtSetlmnYn === "Y" ? true: false
		 };
		 Utils.ajaxCall('/cmmt/CMMT210SEL02',  JSON.stringify(CMMT200M_Serch_data), function(data){
		   var CMMT200M_List = JSON.parse(JSON.parse(JSON.stringify(data.CMMT210VOInfo)))

		   CMMT200M_List.forEach(function(val) {
			   if(!Utils.isNull(val.blthgRpsImgIdxNm)){
				   let rpsImg =  GLOBAL.contextPath+"/cmmtphotoimg/"+ val.tenantId+"/"+ val.blthgRpsImgIdxNm;
				   val.blthgRpsImg =  '<img src="'+rpsImg+'">';
			   }else{
				   val.blthgRpsImg = "";
			   }
			   let regDtm = kendo.format("{0:yyyy-MM-dd}",new Date(val.regDtm));
			   val.regDtm = regDtm;

			   let moktiCtt = val.moktiCtt.replace(/<[^>]*>?/g, '');
			   val.moktiCtt = moktiCtt
			   val.chkAuth = CMMT200M_fnChkAuth(val.blthgStCd, val.regrId);
			   val.chkAuthDel = CMMT200M_fnChkAuthDel(val.blthgStCd, val.regrId);
		   });

		   CMMT200M_ctntsList = CMMT200M_List;
		   CMMT200M_listViewCMMT200M.dataSource.data(CMMT200M_List);
		});
	}
}

function CMMT200M_fnPopup_DASH110P(obj){
	let blthgMgntNo = obj.id.split('_')
	Utils.openPop(GLOBAL.contextPath + "/dash/DASH110P", "DASH110P" , 1000, 900,{DASH110P_ctgrMgntNo: blthgMgntNo[1], DASH110P_blthgMgntNo : blthgMgntNo[2]})

	var CMMT200M_PuslmnData = {
			ctgrMgntNo 		:  blthgMgntNo[1],
			blthgMgntNo 	: blthgMgntNo[2],
			puslmnId 		: CMMT200M_userInfo.usrId,
			tenantId 		: CMMT200M_userInfo.tenantId,
	};
	CMMT200M_PuslmnStr = JSON.stringify(CMMT200M_PuslmnData);
	Utils.ajaxCall('/cmmt/CMMT230INS01', CMMT200M_PuslmnStr) ;
}

$("#CMMT200M_btnCMMT300POpen").off("click").on("click", function () {

	let parm = {
		tenantId				: CMMT200M_userInfo.tenantId,
		CMMT300P_ctgrMgntNo		: CMMT300P_ctgrMgntNo,
		callbackKey				: "CMMT200M_fnCreateDoc",
		ctgrTypCd				: CMMT200M_ctgrTypCd,			//kw---20230705 : 게시판 유형을 알기 위함(커뮤니티 일 경우 엘라스틱 상태는 99)
	}
	Utils.setCallbackFunction("CMMT200M_fnCreateDoc", function(ctgrNo){
		//JDJ 팝업 작업후 콜백 확인
//		CMMT200M_fnLoadBoardList();
//		CMMT200M_fnSrchBoardContents(ctgrNo)
		CMMT200M_fnSrchGrid(false, ctgrNo);

	});

	Utils.openPop(GLOBAL.contextPath + "/cmmt/CMMT300P","CMMT300P",1600,850, parm)
});

function CMMT200M_fnEditPop(obj){
	let blthgMgntNo = $(obj)[0].id.split('_')

//	if(!CMMT200M_IsSearch_toElastic){
//		Utils.setCallbackFunction("CMMT200M_fnReSrchList", CMMT200M_fnLoadBoardList);
//	}

	Utils.setCallbackFunction("CMMT200M_fnCreateDoc", function(ctgrNo){
		//JDJ 팝업 작업후 콜백 확인
		CMMT200M_fnSrchGrid(false, ctgrNo);
//		CMMT200M_fnSrchBoardContents(ctgrNo)
	});

	let param = {
		CMMT300P_ctgrMgntNo		: blthgMgntNo[1],
		CMMT300P_blthgMgntNo 	: blthgMgntNo[2],
		CMMT300P_ctgrMgntNm 	: CMMT300P_ctgrMgntNm,
		callbackKey				:"CMMT200M_fnCreateDoc",
		ctgrTypCd				: CMMT200M_ctgrTypCd,			//kw---20230705 : 게시판 유형을 알기 위함(커뮤니티 일 경우 엘라스틱 상태는 99)
	};

	Utils.openPop(GLOBAL.contextPath + "/cmmt/CMMT300P", "CMMT300P" , 1600, 850, param);
}

function CMMT200M_fnDelCntnt(obj){

	let blthgMgntNo = $(obj)[0].id.split('_')
	Utils.confirm(CMMT200M_langMap.get("CMMT200M.cfrmDel"), function(){
		CMMT200M_ctntsList.forEach(function (val) {
			if(val.ctgrNo == blthgMgntNo[1] && val.cntntsNo == blthgMgntNo[2]){
				if(GLOBAL.session.user.usrGrd >= 400) {
					// 권한이 400이상일 경우 모두 삭제 가능 session.usrGrd >= 400
					// 관리자 삭제 update
					var CMMT200M_blthgData = {
						tenantId 		: CMMT200M_userInfo.tenantId,
						ctgrMgntNo 		: blthgMgntNo[1],
						blthgMgntNo 	: blthgMgntNo[2],
						blthgStCd		: '89', //관리자 삭제(논리적 삭제)
						apprOrgCd 		: CMMT200M_userInfo.orgCd,
						apprId 			: CMMT200M_userInfo.usrId,
						lstCorprOrgCd 	: CMMT200M_userInfo.orgCd,
						lstCorprId 		: CMMT200M_userInfo.usrId,
						ctgrTypCd		: CMMT200M_ctgrTypCd,			//kw---20230705 : 게시판 유형을 알기 위함(커뮤니티 일 경우 엘라스틱 상태는 99)
					};
					Utils.ajaxCall('/cmmt/CMMT230UPT01', JSON.stringify(CMMT200M_blthgData), function(result){
						CMMT200M_fnSrchGrid(false, blthgMgntNo[1]);
					}) ;
				}else{
						var CMMT200M_blthgData = {
							tenantId 		: CMMT200M_userInfo.tenantId,
							ctgrMgntNo 		: blthgMgntNo[1],
							blthgMgntNo 	: blthgMgntNo[2],
							ctgrNo			: blthgMgntNo[1],
							cntntsNo		: blthgMgntNo[2],
						};
						Utils.ajaxCall('/cmmt/CMMT200DEL02', JSON.stringify(CMMT200M_blthgData), function(result){
							CMMT200M_fnSrchGrid(false, blthgMgntNo[1]);
						});
				}
			}
		})
	})
}

function CMMT200M_fnChkAuth(item, regrId){
	let rtnVal = "hidden";

	if(regrId == CMMT200M_userInfo.usrId){
		if(item == '10' || item == '12' || item == '15' || item == '13'  || item == '16'){
			rtnVal = "visible"
		}
	}
	if(GLOBAL.session.user.cmmtSetlmnYn === "Y"){
		//if(item == '11' || item == '14'){
			rtnVal = "visible"
		//}
	}

	return rtnVal;
}

function CMMT200M_fnChkAuthDel(item, regrId){
	let rtnVal = "hidden";

	if(regrId == CMMT200M_userInfo.usrId){
		if(item == '10' ||  item == '13' || item == '16'){
			rtnVal = "visible"
		}
	}
	if(GLOBAL.session.user.cmmtSetlmnYn === "Y"){
		if(item == '11' || item == '14' || item == '12' || item == '15' ){
			rtnVal = "visible"
		}
	}

	return rtnVal;
}

function CMMT200M_fnDashOpen(ctgrNo){
	let CMMT200M_Serch_data = {
		tenantId : CMMT200M_userInfo.tenantId
		, ctgrMgntNo : ctgrNo
		, puslYn : $('#CMMT200M_cobPuslmn').val()
		, usrId : CMMT200M_userInfo.usrId
		, isAdmin: GLOBAL.session.user.cmmtSetlmnYn === "Y" ? true: false
	};
	Utils.ajaxCall('/cmmt/CMMT210SEL02',  JSON.stringify(CMMT200M_Serch_data), function(data){
		var CMMT200M_List = JSON.parse(JSON.parse(JSON.stringify(data.CMMT210VOInfo)))

		CMMT200M_List.forEach(function(val) {
			if(!Utils.isNull(val.blthgRpsImgIdxNm)){
				let rpsImg = GLOBAL.contextPath+"/cmmtphotoimg/"+ val.tenantId+"/"+ val.blthgRpsImgIdxNm;
				val.blthgRpsImg =  '<img src="'+rpsImg+'">';
			}else{
				val.blthgRpsImg = "";
			}
			let regDtm = kendo.format("{0:yyyy-MM-dd}",new Date(val.regDtm));
			val.regDtm = regDtm;

			let moktiCtt = val.moktiCtt.replace(/<[^>]*>?/g, '');
			val.moktiCtt = moktiCtt
			val.chkAuth = CMMT200M_fnChkAuth(val.blthgStCd, val.regrId);
			val.chkAuthDel = CMMT200M_fnChkAuthDel(val.blthgStCd, val.regrId);
		});

		CMMT200M_ctntsList = CMMT200M_List;
		CMMT200M_listViewCMMT200M.dataSource.data(CMMT200M_List);

		let dataItem = (CMMT200M_treeCMMT200M.dataSource.get(ctgrNo))
		let selElement = CMMT200M_treeCMMT200M.findByUid(dataItem.uid);

		CMMT200M_treeCMMT200M.select(selElement);

		$('#CMMT200_ctgrNm').val( dataItem.ctgrNm)
		CMMT300P_ctgrMgntNm =  dataItem.ctgrNm;
		CMMT300P_ctgrMgntNo = dataItem.id;
		CMMT200M_catagoryPath = dataItem.brdPath;

		if( dataItem.ctgrAttrCd == 1 ||  dataItem.writPmssYn == 'N' ){
			$('#CMMT200M_btnCMMT300POpen').attr("disabled", true);
		}else{
			$('#CMMT200M_btnCMMT300POpen').attr("disabled", false);
		}
	});
}

//kw---20230614 : 게시글 조회
function CMMT200M_fnSrchGrid(nFirstStart, selectCtgr){


	scwdCookie()

	//kw--- 검색어 종류 : 1:전체, 2:내용
	let srchTitleType = $("#CMMT200M_cobSrchCond").val();
	if(Utils.isNull(srchTitleType)){
		srchTitleType = 0;		//전체
	}

	//kw---게시물 상태
	let knowState;
	if(!Utils.isNull($('#CMMT200M_srchKnowState').data("kendoMultiSelect"))){
		if($('#CMMT200M_srchKnowState').data("kendoMultiSelect").value().length>=1){
			if($('#CMMT200M_srchKnowState').data("kendoMultiSelect").value()[0] !==''){
				knowState= $('#CMMT200M_srchKnowState').data("kendoMultiSelect").value()
			}
		}
	} else {
		knowState = null;
	}

	//kw---열람구분
	let srchReadYn = $("#CMMT200M_cobPuslmn").val();
	if(Utils.isNull(srchReadYn)){
		srchReadYn = "1"
	}

	//kw---작성자
	let srchReg;
	if(!Utils.isNull($('#CMMT200M_mulUsrId').data("kendoMultiSelect").value())){
		srchReg = $('#CMMT200M_mulUsrId').data("kendoMultiSelect").value();
	} else {
		srchReg = null;
	}

	//kw---작성일자
	let srchStartDate = $("#CMMT200M_fromDt").val();
	//처음 시작했을 때
	if(nFirstStart == true || selectCtgr != null){
		srchStartDate = "1900-01-01";
	}

	//kw---파라미터 체크 ( 알림을 통해서 넘어옴. 우선순위 : 승인 > 열람하지 않은 페이지)
	let ncsyCheck = [];
	if(!Utils.isNull(CMMT200M_ncsyCount)){
		ncsyCheck[0] = "11";
		knowState = ncsyCheck;
	} else if(!Utils.isNull(CMMT200M_puslmnCount)){
		srchReadYn = "3";
		$("#CMMT200M_alrmUseYn").val('Y')
	}

	var CMMT200M_Serch_data = {
			tenantId 			: GLOBAL.session.user.tenantId
			, usrId 			: GLOBAL.session.user.usrId
			, encryptYn 		: CMMT200M_encryptYn			//kw---20230503 : 고객정보 복호화 여부 키 추가
			, srchTitleType		: srchTitleType												//검색어 종류
			, srchTitle			: $('#CMMT200M input[name=CMMT200M_srchText]').val()		//검색어
			, srchState			: knowState													//게시물상태
			, srchReadYn		: srchReadYn												//열람구분
			, srchReg 			: srchReg													//작성자
			, srchStartDate		: srchStartDate
			, srchEndDate		: $("#CMMT200M_toDt").val()
			, alrmUseYn		    : $("#CMMT200M_alrmUseYn").val()
			, athtCd			: GLOBAL.session.user.menuAtht
			, orgCd 			: GLOBAL.session.user.orgCd
			, usrGrd 			: GLOBAL.session.user.usrGrd
	 };

	Utils.ajaxCall('/cmmt/CMMT200SEL08',  JSON.stringify(CMMT200M_Serch_data), function(data){
        let treeCheck = JSON.parse(data.list);

        //kw---20230705 : 권한에 따라 카테고리 표출
        //kw---20230705 : 카테고리는 보여주되, 게시판 카테고리는 권한에 따라 보여줌
        let treeList = [];

        $(treeCheck).each(function (index,treeItem){
			if(treeItem.ctgrAttrCd == "1"){										//kw---20230705 : 카테고리 일 경우
				treeList.push(treeItem);
			}
			else if(treeItem.ctgrAttrCd == "2" && treeItem.rdPmssYn == "Y"){	//kw---20230705 : 게시판일 경우 읽기 권한이 있을 경우
				treeList.push(treeItem);
			}
			else if(treeItem.ctgrAdmnId == GLOBAL.session.user.usrId){			//kw---20230705 : 카테고리 관리자가 현재 사용자 일 경우
				treeList.push(treeItem);
			}
		});



        Utils.ajaxCall('/cmmt/CMMT200SEL07',  JSON.stringify(CMMT200M_Serch_data), function(data){
            let list = [];
			$(JSON.parse(data.list)).each(function (index,item){
				//kw--- 카테고리 개수값 증가
				$(treeList).each(function (index,treeItem){
					if(treeItem.ctgrNm == item.ctgrNm){

						// 카운팅을 왜 조건 정해서 하는지 이유파악 필요, 일단 주석처리
						//if(item.blthgStCd != '11' || item.blthgStCd == '11' && item.ctgrAdmnId == GLOBAL.session.user.usrId || item.rdPmssYn == "Y" || GLOBAL.session.user.usrGrd >= 400){
							treeItem.itemCount++;
						//}
					}
				});

				let rpsImg ="", stNm ="";

				if(!Utils.isNull(item.blthgRpsImgIdxNm)){
					rpsImg = '<img src='+GLOBAL.contextPath+'/cmmtphotoimg/' + item.tenantId + '/' + item.blthgRpsImgIdxNm + '>';
				}

				let mokitCtt = item.bltnCttTxt;

				CMMT200M_commCodeList.filter(function (code){
					if(code.mgntItemCd == "C0084"){
						if(code.comCd == item.blthgStCd){
							stNm = code.comCdNm;
						}
					}
				});

				let obj = {
					ctgrNo			: item.ctgrMgntNo
					, cntntsNo		: item.blthgMgntNo
					, blthgApvNcsyYn: item.blthgApvNcsyYn
					, cntntsTite	: item.blthgTitle
					, usrNm			: item.usrNm
					, regDtm 		: kendo.format("{0:yyyy-MM-dd}",new Date(item.regDtm))
					, blthgRpsImg	: rpsImg
					, moktiCtt 		: item.bltnCttTxt
					, chkAuth 		: item.regrId
					, blthgStNm		: stNm
					, ctgrNm 		: item.ctgrNm
					, countFile 	: item.apndCount
					, chkAuthDel 	: item.regrId
					, ctgrAdmnId	: item.ctgrAdmnId
					, blthgStCd		: item.blthgStCd
					, rdPmssYn		: item.rdPmssYn
					, writPmssYn	: item.writPmssYn
					, corcPmssYn	: item.corcPmssYn
					, delPmssYn		: item.delPmssYn
					, regrId		: item.regrId
				}
 				list.push(obj);

			});

			//kw---카테고리 트리
	        CMMT200M_treeCMMT200M.dataSource.data(CMMT200M_fnSubChangeTreeData(treeList));

//	        if(CMMT200M_treeCMMT200M.dataSource.data.length != 0){
	        	let first_item;
		        if(Utils.isNull(selectCtgr) || selectCtgr == -1){
		        	$(treeList).each(function (index,treeItem){
		        		if(treeItem.itemCount > 0){
		        			first_item = $("#treeCMMT200M").find('li').eq(index);
		        			return false;
		        		}
		        	});
		        } else {
		        	$(treeList).each(function (index,treeItem){
		        		if(treeItem.ctgrMgntNo == selectCtgr){
		        			first_item = $("#treeCMMT200M").find('li').eq(index);
		        			return false;
		        		}
		        	});
		        }


		        //kw---20230630 : 카테고리가 없고 게시글이 존재하지 않을 겨우 밑에 조건을 타지 않음
		        if(CMMT200M_treeCMMT200M.dataItem(first_item) != undefined){
		        	CMMT200M_treeCMMT200M.select(first_item);
			    	let ctgrFirstId = CMMT200M_treeCMMT200M.dataItem(first_item).id;

			    	//kw--- 리스트 표출
					CMMT200M_ctntsList = list;
					CMMT200M_listViewCMMT200M.dataSource.data(list);

					//kw---20230703 : 게시글등록시 현재 선택된 카테고리 번호를 넘기기 위함
					//kw---20230703 : 선택된 카테고리 번호(id) -> 선택된 아이템으로 변경
					CMMT200M_fnListFilter(CMMT200M_treeCMMT200M.dataItem(first_item));
		        }else{
					CMMT200M_listViewCMMT200M.dataSource.data([]);
				}


        });
    });
}

//kw---20230615 : 카테고리 선택시 그리드 항목 필터
function CMMT200M_fnListFilter(selectData){
	let targetData = CMMT200M_listViewCMMT200M.dataSource;
	targetId = selectData.id;

	//kw---20230703 : 게시글등록시 현재 선택된 카테고리 번호를 넘기기 위함 (누락되어 추가)
	CMMT300P_ctgrMgntNo = selectData.id;
	CMMT300P_ctgrMgntNm = selectData.ctgrNm

	CMMT200M_catagoryPath = selectData.brdPath;
	$('#CMMT200_catagoryPath').text(selectData.brdPath);
	$('#CMMT200_contentCount').text(selectData.itemCount);

	//kw---20230703 : 게시글 등록 버튼 활성화 관련 조건 수정
	//kw---20230703 : 쓰기 권한이 Y가 아닐 경우에는 disable (권한 설정이 따로 되어있지 않은 조건은 NULL로 처리되므로 변경)
	//kw---20230703 : 게시글 전체 글쓰기 권한이 불가일 경우 disable
	if(selectData.ctgrAttrCd == 1 || selectData.writPmssYn != 'Y'){
		$('#CMMT200M_btnCMMT300POpen').attr("disabled", true);
	}else{
		$('#CMMT200M_btnCMMT300POpen').attr("disabled", false);
	}

	CMMT200M_ctgrTypCd = selectData.ctgrTypCd;
	//kw---20230703 : 게시글등록시 현재 선택된 카테고리 번호를 넘기기 위함 (누락되어 추가) 끝

	/*
	shpark 20240830 : 카테고리 선택 시 table filter 조회 기존에 있던
	본인 여부 삭제여부 승인여부등은 DB에서 조회로 변경
	*/
	Utils.kendoGridFilter(targetData , [{ field:"ctgrNo"   ,operator:"eq" ,value: targetId }] , [] )
}

function scwdCookie(){
	if(GLOBAL.session.user.kldScwdSaveYn == 'Y'){
		if($("#CMMT200M_srchText").val().length > 0){
			var text = $("#CMMT200M_srchText").val()
			if(text != ''){
				const date = new Date();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				const formattedDate = `${month}-${day}`;
				Utils.putCookieArrToJson("scwd" , {scwd : text, inMySc : 1 , scwdDate : formattedDate} )

				var CMMT322P_data = { tenantId 	: GLOBAL.session.user.tenantId  , 	usrId 	: GLOBAL.session.user.usrId,	myScwd 	: $("#CMMT200M_srchText").val()};
				var CMMT322P_jsonStr = JSON.stringify(CMMT322P_data);

				Utils.ajaxCall('/cmmt/CMMT200INS02', CMMT322P_jsonStr )
			}
		}
	}
}

