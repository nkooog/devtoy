/***********************************************************************************************
 * Program Name : 지식관리 (KMST200M.js)
 * Creator      : djjung
 * Create Date  : 2022.05.31
 * Description  : 지식관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.31     djjung           최초작성
 ************************************************************************************************/
var KMST200M_DataSource,KMST200M_treeList,KMST200M_commCodeList,KMST200M_Serch_elastic;
var KMST200M_IsSearch_toElastic= false;
var KMST200M_KldStCd={
	writing : 10,
	approvalRequestNew : 11,
	approvedNew : 12,
	returnNew : 13,
	approvalRequestChange : 14,
	approveChange : 15,
	returnChange : 16,
	deleteAdmin : 89,
	expiration : 90,
}
var KMST200M_encryptYn;
var KMST200M_listViewKMST200M, KMST200M_treeKMST200M;
$(document).ready(function() {

	//kw---20230706 : 게시물생성 초기에는 disabled
	//--- 아무런 게시물이 없을 경우 카테고리 선택이 안됐을 경우
	$('#KMST200M button[name=KMST200_btnKMS210Open]').attr("disabled", true);
	$("#KMST200_dateStart").val( kendo.format("{0:yyyy-MM-dd}","2020-01-01"));
	
	//kw---20230615 : 고객정보 복호화 여부 키 추가
	KMST200M_encryptYn = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1;

	//1.Common Code Set
	KMST200M_fnMutiSelectInit();
	KMST200M_fnCommCdGet();

	//2.DataSource init
	KMST200M_DataSourceInit();

	//3.Tree init
	KMST200M_fnTreeInit();

	//4.Grid init
	KMST200M_fnGridInit();

	//5.Grid,Tree hight Setting
	KMST200M_fnDefaultHightSetting();

	//6.Window Resize
	$(window).on({'resize': function() {KMST200M_fnDefaultHightSetting();	}});

	//kw---20230613 : 알림을 통해 넘어온 파라미터 값
//    KMST200M_puslmnCount = $("#KMST200M_puslmnCount").val();	//열람하지 않은 페이지 수
    KMST200M_ncsyCount = $("#KMST200M_ncsyCount").val();		//승인이 필요한 페이지 수

	//7.Search List
//	KMST200M_fnLoadBoardList();
    
    KMST200M_listViewKMST200M = $("#grdKMST200").data("kendoGrid");
    KMST200M_treeKMST200M = $("#treeKMST200").data("kendoTreeView");
    
    KMST200M_fnSrchGrid(true);

	//8. Date Select
	//$('#KMST200M button[name=KMST200_dateStart_btn1]').click();

})
//1.Common Code Set
function KMST200M_fnCommCdGet(){
	let KMST200M_mgntItemCdList = [{"mgntItemCd":"C0084"},{"mgntItemCd":"S0007"}];

	Utils.ajaxCall('/comm/COMM100SEL01',  JSON.stringify({ "codeList": KMST200M_mgntItemCdList}),function(data){
		KMST200M_commCodeList = JSON.parse(JSON.parse(JSON.stringify(data.codeList)));
		Utils.setKendoMultiSelect(KMST200M_commCodeList, "C0084", '#KMST200M input[name=KMST200_srchKnowState]', false);
		Utils.setKendoComboBox(KMST200M_commCodeList, "S0007", '#KMST200M input[name=KMST200_srchType]',"",true);
		
	    if(!Utils.isNull(KMST200M_ncsyCount) && KMST200M_ncsyCount > 0){
	    	$('#KMST200M input[name=KMST200_srchKnowState]').data("kendoMultiSelect").value("11");
	    }
	    
		CMMT200M_ncsyCount = "";
		CMMT200M_puslmnCount = "";
		
		},null,null,null );
}
function KMST200M_fnMutiSelectInit() {
	let multiSelectDataSourceInit = [];
	let multiSelectOptionInit = {
		dataTextField: "text",
		dataValueField: "value",
		dataSource: multiSelectDataSourceInit,
		placeholder: KMST200M_langMap.get("KMST200M.search.select"),
		autoClose: false,
		clearButton: false,
		tagMode: "single",
		height: 200,
		tagTemplate: kendo.template(KMST200M_fnTagTemplates(this)),
		itemTemplate: '<p class="multiCheck">#: text #</p>',
	};

	let knowRegMultiSelect = $("#KMST200M input[name=KMST200_srchKnowReg]").kendoMultiSelect(multiSelectOptionInit).data("kendoMultiSelect");
	knowRegMultiSelect.ul.addClass('multiSelect');
}
function KMST200M_fnTagTemplates(values) {
	let input="";
	if (values.length < 4) {
		for (let m = 0; m < values.length; m++) {
			input += values[m];
			if (m < values.length - 1) {input += ', '}
		}
	}else{
		input += values.length + KMST200M_langMap.get("KMST200M.grid.content.select.items");
	}
	return input;
}
//2.DataSource init
function KMST200M_DataSourceInit(){
	KMST200M_DataSource ={
		transport: {
			read	: function (KMST200M_jsonStr) {
				if(Utils.isNull(KMST200M_jsonStr.data)){
					Utils.ajaxCall('/kmst/KMST200SEL01', KMST200M_jsonStr,KMST200M_fnSrcBoardList,
						window.kendo.ui.progress($("#grdKMST200"), true), window.kendo.ui.progress($("#grdKMST200"), false));
				}else{
					window.kendo.ui.progress($("#grdKMST200"), false)
				}
			}

		}
	}
}
//3.Tree init
function KMST200M_fnTreeInit(){
	$("#treeKMST200").kendoTreeView({
		autoScroll: true,
		template: function(item) {
			if (item.item.case != 0) {
				return item.item.ctgrNm + ' <span class="fontRed">(' + item.item.case + ')</span>';
			} else {
				return item.item.ctgrNm;
			}
		},
		dataTextField: ["ctgrNm"],

		select: function(e) {
			
			// let ctgrNo = this.dataItem(e.node).id;
			$('#KMST200M span[name=KMST200_catagoryPath]').text(this.dataItem(e.node).brdPath);
			$('#KMST200M span[name=KMST200_contentCount]').text(this.dataItem(e.node).case);
//			KMST200M_fnSrchBoardContents(ctgrNo);
			$('#treeKMST200').val(this.dataItem(e.node).ctgrNm)
			var ctgrNo = this.dataItem(e.node).id;
			
			KMST200M_fnListFilter(this.dataItem(e.node));
			$('#KMST200M input[name=KMST200_ctgrNo]').val(ctgrNo);

		}
	});
}
//4.Grid init
function KMST200M_fnGridInit(){
	$("#grdKMST200").kendoGrid({
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
		columns: [
			{ 
            	title: "No", 
            	width: 40, 
            	attributes : { style : "text-align : center; " }, 
            	template: "<span class='row-number'></span>" 
            },
			{ width: 100, template: '#=ctgrNo+"-"+cntntsNo#', title: KMST200M_langMap.get("KMST200M.grid.column.kldnum"),  },
			{ width: "auto", field: "brdpath", title: KMST200M_langMap.get("KMST200M.grid.column.ctgrPath"), attributes: {"class": "textEllipsis"}, },
			{ width: "auto", field: "cntntsTite", title: KMST200M_langMap.get("KMST200M.grid.column.kldtitle"), attributes: {"class": "textEllipsis"}, },
			{ width: 100, template : '#=usrNm+"<br>("+chkAuthDel+")"#',  title: KMST200M_langMap.get("KMST200M.grid.column.kldregrNm") },
			{ width: 110, template : '#=kendo.format("{0:yyyy-MM-dd}",new Date(regDtm))#', title: KMST200M_langMap.get("KMST200M.grid.column.kldregrDate"), },
			{ width: 100, field: "kldStNm", title: KMST200M_langMap.get("KMST200M.grid.column.state"), template: '<span #if(kldStCd == KMST200M_KldStCd.expiration) {# class="fontRed" #} #>#: kldStNm #</span>',   },
			{ width: 230, field: "btn", title: " ",	template: '#=KMST200M_fnbuttonTemplate(ctgrNo,cntntsNo,kldStCd,usrNm,chkAuthDel,writPmssYn,corcPmssYn,delPmssYn)#' },
		],
		noRecords: { template: '<div class="nodataMsg"><p>'+KMST200M_langMap.get("KMST200M.grid.nodata")+'</p></div>' },
		
		 dataBound: function(e) {
	            // iterate the data items and apply row styles where necessary
			 	KMST200M_onDataBound(e)
	        	var rows = this.items();
	            $(rows).each(function () {
	                var index = $(this).index() + 1;
	                var rowLabel = $(this).find(".row-number");
	                $(rowLabel).html(index);
	            });
	        },
		dataSource: KMST200M_DataSource,
		scrollable: true,
	}).data('kendoGrid');
}

function KMST200M_fnbuttonTemplate(ctgrNo,cntntsNo,kldStCd,descUsrNm,regrId,writPmssYn,corcPmssYnm,delPmssYn){//Grid Button Template
	//JDJ 쓰기및 수정 권한 체크
	
	//kw---20230706 : 권한 추가
	let src = "";
	
	//kw---202030706 : 수정 권한이 있을 경우 수정 버튼 활성화
	if(corcPmssYnm == 'Y'){
		src ='<menu class="btnArea_center">' +
		'<p class="formAlign Row" ><button class="btnRefer_default" onclick="KMST200M_fnUpdateDataClick('+ctgrNo+','+cntntsNo+','+kldStCd+',\''+descUsrNm+'\',\''+regrId+'\')"><span class="k-icon k-i-edit"></span>';
	} else {
		src ='<menu class="btnArea_center">' +
		'<p class="formAlign Row" ><button class="btnRefer_default" onclick="KMST200M_fnUpdateDataClick('+ctgrNo+','+cntntsNo+','+kldStCd+',\''+descUsrNm+'\',\''+regrId+'\')" disabled><span class="k-icon k-i-edit"></span>';
	}
	

	if(kldStCd == KMST200M_KldStCd.approvalRequestNew || kldStCd == KMST200M_KldStCd.approvalRequestChange){
		src +=KMST200M_langMap.get("KMST200M.grid.button.approval");
	}else{
		src +=KMST200M_langMap.get("KMST200M.grid.button.update");
	}
		
	//kw---202030706 : 쓰기 권한이 있을 경우 복사 버튼 활성화
	if(writPmssYn == 'Y'){
		src += '</button></p><p class="formAlign Row" ><button class="btnRefer_default" onclick="KMST200M_fnCopyToDataClick('+ctgrNo+','+cntntsNo+')"><span class="k-icon k-i-copy"></span>'+KMST200M_langMap.get("KMST200M.grid.button.copy")+'</button></p>';
	} else {
		src += '</button></p><p class="formAlign Row" ><button class="btnRefer_default" onclick="KMST200M_fnCopyToDataClick('+ctgrNo+','+cntntsNo+')" disabled><span class="k-icon k-i-copy" ></span>'+KMST200M_langMap.get("KMST200M.grid.button.copy")+'</button></p>';
	}
		
	//kw---202030706 : 쓰기 권한이 있을 경우 삭제 버튼 활성화
	if(delPmssYn == 'Y'){
		src +='<p class="formAlign Row" ><button class="btnRefer_default" onclick="KMST200M_fnDeleteClick('+ctgrNo+','+cntntsNo+')"><span class="k-icon k-i-delete"></span>'+KMST200M_langMap.get("KMST200M.grid.button.delete");+'</button></p></menu>'
	} else {
		src +='<p class="formAlign Row" ><button class="btnRefer_default" disabled onclick="KMST200M_fnDeleteClick('+ctgrNo+','+cntntsNo+')"><span class="k-icon k-i-delete"></span>'+KMST200M_langMap.get("KMST200M.grid.button.delete");+'</button></p></menu>'
	}
	
	//kw---202030706 : 쓰기 권한이 있을 경우 삭제 버튼 활성화를 새로 작성하여 해당 코드는 주석 처리
//	if(GLOBAL.session.user.kldMgntSetlmnYn ==="Y"){
//		if(kldStCd ===  KMST200M_KldStCd.deleteAdmin || kldStCd === KMST200M_KldStCd.expiration){
//			src +='<p class="formAlign Row" ><button class="btnRefer_default" disabled onclick="KMST200M_fnDeleteClick('+ctgrNo+','+cntntsNo+')"><span class="k-icon k-i-delete"></span>'+KMST200M_langMap.get("KMST200M.grid.button.delete");+'</button></p></menu>'
//		}else{
//			src +='<p class="formAlign Row" ><button class="btnRefer_default" onclick="KMST200M_fnDeleteClick('+ctgrNo+','+cntntsNo+')"><span class="k-icon k-i-delete"></span>'+KMST200M_langMap.get("KMST200M.grid.button.delete");+'</button></p></menu>'
//		}
//	}else{ 
//		src += '</menu>'
//	}
	return src;
}
//5.Grid,Tree hight Setting
function KMST200M_fnDefaultHightSetting() {
	let screenHeight = $(window).height();
	$("#treeKMST200").data("kendoTreeView").wrapper.css('height', screenHeight-400);   //   (헤더+ 푸터+ 검색 )영역 높이 제외
	$("#grdKMST200").data("kendoGrid").element.find('.k-grid-content').css('height', screenHeight-400);
}
//7.Search List
function KMST200M_fnLoadBoardList(){
	let KMST200M_Serch_data = {
		tenantId : GLOBAL.session.user.tenantId
		,usrId : GLOBAL.session.user.usrId
		,usrGrdCd :GLOBAL.session.user.usrGrd
		,orgCd : GLOBAL.session.user.orgCd
	};

	let KMST200M_jsonStr = JSON.stringify(KMST200M_Serch_data);
	KMST200M_DataSource.transport.read(KMST200M_jsonStr);
}




//Call Function---------------------------------------------------------------------------------------------------------
//트리 리스트 생성
function KMST200M_fnSrcBoardList(KMST200M_data){
	let treeCheck = KMST200M_fnSubCheckListValid(KMST200M_data.list);

	if(Utils.isNull(treeCheck)){
		Utils.alert(KMST200M_langMap.get("KMST200M.alert.search.authority.not"));
		return;
	}
	$("#treeKMST200").data("kendoTreeView").dataSource.data(KMST200M_fnSubChangeTreeData(treeCheck));
}

//버튼 이벤트-----------------------------------------------------------------------------------------------------------

//트리 항목 클릭시
function KMST200M_fnSrchBoardContents(ctgrNo){
	if(KMST200M_IsSearch_toElastic){
		KMST200M_Serch_elastic.ctgrNo= ctgrNo;
		Utils.ajaxCall('/kmst/KMST200SEL05',  JSON.stringify(KMST200M_Serch_elastic), function(data){
			let KMST200VOInfo = JSON.parse(JSON.parse(JSON.stringify(data.list)));

			let list = [];
			$(KMST200VOInfo.hits.hits).each(function (index,value){
				let stNm ="";
				KMST200M_commCodeList.filter(function (code){
					if(code.mgntItemCd ==="C0084"){	if(code.comCd === value._source.stCd){ stNm = code.comCdNm;}}
				});
				let obj = {
					num :index+1
					,ctgrNo: value._source.ctgrMgntNo
					,cntntsNo:value._source.blthgMgntNo
					,brdpath : $('#KMST200M span[name=KMST200_catagoryPath]').text()
					,cntntsTite:value._source.title
					,descUsrNm: value._source.regrNm
					,regrId: value._source.regrId
					,regDtm : KMST200M_fnSubConvertStringToDate(value._source.regDtm)
					,kldStNm: stNm
					,kldStCd:value._source.stCd
				};
				list.push(obj);
			});

			$("#grdKMST200").data("kendoGrid").dataSource.data(list);
		});
	}else{
		let KMST200M_Serch_data = {
			tenantId : GLOBAL.session.user.tenantId
			,usrId: GLOBAL.session.user.usrId
			,usrGrdCd : GLOBAL.session.user.usrGrd
			,ctgrNo : ctgrNo
			,isAdmin : GLOBAL.session.user.kldMgntSetlmnYn === "Y" ? true : false
		};

		Utils.ajaxCall('/kmst/KMST200SEL03',  JSON.stringify(KMST200M_Serch_data), function(data){
			let KMST200VOInfo = JSON.parse(JSON.parse(JSON.stringify(data.list)));
			KMST200VOInfo.map(x => x.cntntsTite = Utils.htmlDecode(x.cntntsTite));
			$("#grdKMST200").data("kendoGrid").dataSource.data(KMST200VOInfo);
		});
	}
}

//그리드 항목 클릭시
function KMST200M_onDataBound(e) {
	$("#grdKMST200").on('click','tbody tr[data-uid]',function (e) {
		let	item = $("#grdKMST200").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));

		if(e.target.nodeName=== "BUTTON" || e.target.nodeName=== "SPAN" ){ //버튼을누르는경우는
			return;
		}
		KMST200M_fnDetailViewClick(item.ctgrNo,item.cntntsNo);
	})
};
//Treeview  전체열기
$('#KMST200M input[name=KMST200_treeToggle]').on('click', function(){
	if($(this).is(':checked'))  $("#treeKMST200").data("kendoTreeView").expand('.k-item') , $(this).prop("checked", true);
	else $("#treeKMST200").data("kendoTreeView").collapse('.k-item') , $(this).prop("checked", false);
});
//조회 버튼 클릭
$("#KMST200M button[name=KMST200_btnInq]").off("click").on("click", function () {
	
	KMST200M_fnSrchGrid();

//	$("#grdKMST200").data("kendoGrid").dataSource.data([]);
//	let type;
//	if($('#KMST200M input[name=KMST200_srchType]').val() =="1"){
//		type ="TITLE"
//	}else if($('#KMST200M input[name=KMST200_srchType]').val() =="2"){
//		type ="CONTENT"
//	}else {
//		type ="ALL"
//	}
//
//
//	let knowState = [];
//	if($('#KMST200M input[name=KMST200_srchKnowState]').data("kendoMultiSelect").value().length>=1){
//		if($('#KMST200M input[name=KMST200_srchKnowState]').data("kendoMultiSelect").value()[0] !==''){
//			knowState= $('#KMST200M input[name=KMST200_srchKnowState]').data("kendoMultiSelect").value()
//		}
//	}
//	
//
//	KMST200M_Serch_elastic = {
//		tenantId : GLOBAL.session.user.tenantId
//		,usrId : GLOBAL.session.user.usrId
//		,usrGrdCd :GLOBAL.session.user.usrGrd
//		,orgCd : GLOBAL.session.user.orgCd
//		,isAdmin : GLOBAL.session.user.kldMgntSetlmnYn === "Y" ? true : false
//		,startDate: $('#KMST200M input[name=KMST200_dateStart]').val()
//		,endDate: $('#KMST200M input[name=KMST200_dateEnd]').val()
//		,knowState: knowState
//		,knowRegId: $('#KMST200M input[name=KMST200_srchKnowReg]').data("kendoMultiSelect").value()
//		,type: type
//		,keyWord:  $('#KMST200M input[name=KMST200_srchText]').val()
//	};
//	
//	KMST200M_IsSearch_toElastic = true;
//	Utils.ajaxCall('/kmst/KMST200SEL04', JSON.stringify(KMST200M_Serch_elastic),KMST200M_fnSrcBoardList,
//		window.kendo.ui.progress($("#grdKMST200"), true), window.kendo.ui.progress($("#grdKMST200"), false));
});
//지식등록 버튼 클릭
$("#KMST200M button[name=KMST200_btnKMS210Open]").off("click").on("click", function () {

	let parm = {
		tenantId:GLOBAL.session.user.tenantId,
		ctgrNo: $('#KMST200M input[name=KMST200_ctgrNo]').val(),
		callbackKey: "KMST200M_fnCreateDoc",
	}
	Utils.setCallbackFunction("KMST200M_fnCreateDoc", function(ctgrNo){
		//JDJ 팝업 작업후 콜백 확인
//		KMST200M_fnSrchBoardContents(ctgrNo);
		KMST200M_fnSrchGrid(false, ctgrNo);
		Utils.alert(KMST200M_langMap.get("KMST200M.alert.save.success"));
	});
	Utils.openPop(GLOBAL.contextPath + "/kmst/KMST210P","KMST210P",1240,1000,parm)
});
//지식 등록자 찾기 버튼 클릭 - 사용자찾기 (복수형) popup
$("#KMST200M button[name=KMST200_btnknowReg]").off("click").on("click", function () {
	//Utils.openKendoWindow("/sysm/SYSM211P", 700, 600, "left", "calc(72% - 805px)",245, false,{callbackKey: "KMST200M_fnUsrCallback"});
	Utils.setCallbackFunction("KMST200M_fnUsrCallback", KMST200M_fnUsrCallback);
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM211P", "SYSM211P" , 960, 535, {callbackKey: "KMST200M_fnUsrCallback"});
});
function KMST200M_fnUsrCallback(item) {
	let reformattedArray = item.map(function (obj) {
		let rObj = {};
		for (const [key, value] of Object.entries(obj)) {
			rObj[key] = value
		}
		return rObj;
	});
	KMST200_setKendoMultiSelect(reformattedArray, '#KMST200M input[name=KMST200_srchKnowReg]', 'decUsrNm', 'usrId');
}
function KMST200_setKendoMultiSelect(codeList, target, setText, setValue) {
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
//그리드 버튼 폐기 클릭
function  KMST200M_fnDeleteClick(ctgrNo,cntntsNo){

	let KMST200M_Serch_data = {
		tenantId : GLOBAL.session.user.tenantId
		,usrId : GLOBAL.session.user.usrId
		,orgCd : GLOBAL.session.user.orgCd
		,ctgrNo : ctgrNo
		,cntntsNo : cntntsNo
		,kldStCd : KMST200M_KldStCd.deleteAdmin
	};

	Utils.ajaxCall('/kmst/KMST200UPT01', JSON.stringify(KMST200M_Serch_data),function (KMST200M_data) {
		let KMST200M_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(KMST200M_data.result)));
		let KMST200M_jsonMsg = KMST200M_data.msg;

//		if(KMST200M_jsonDecode >0){	KMST200M_fnSrchBoardContents(ctgrNo);}
		if(KMST200M_jsonDecode >0){	KMST200M_fnSrchGrid(false, ctgrNo);}
		else{Utils.alert(KMST200M_jsonMsg);}

	},window.kendo.ui.progress($("#grdKMST200"), true), window.kendo.ui.progress($("#grdKMST200"), false));

}
//그리드 버튼 상세 보기 클릭
function KMST200M_fnDetailViewClick(ctgrNo,cntntsNo){
	let parm = {
		tenantId:GLOBAL.session.user.tenantId,
		ctgrNo : ctgrNo,
		cntntsNo :cntntsNo,
		puslmnId : GLOBAL.session.user.usrId,
	}
	Utils.openPop(GLOBAL.contextPath + "/kmst/KMST340P","KMST340P",1300,1000,parm);
	
	let KMST200M_PuslmnStr = JSON.stringify(parm);
	Utils.ajaxCall('/kmst/KMST200INS02', KMST200M_PuslmnStr) ;
}
//그리드 지식 복사하기 버튼 클릭
function KMST200M_fnCopyToDataClick(ctgrNo,cntntsNo) {

	//JDJ 전처리 작업 - 쓰기 권한 있는지 확인할것
	let KMST200M_Copy_data = {
		tenantId:GLOBAL.session.user.tenantId
		,usrId : GLOBAL.session.user.usrId
		,orgCd : GLOBAL.session.user.orgCd
		,descUsrNm :GLOBAL.session.user.decUsrNm
		,ctgrNo : ctgrNo
		,cntntsNo :cntntsNo
	}
	
	Utils.ajaxCall('/kmst/KMST200INS01', JSON.stringify(KMST200M_Copy_data),function (KMST200M_data) {

		let KMST200M_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(KMST200M_data.result)));
		let KMST200M_jsonMsg = KMST200M_data.msg;

//		if(KMST200M_jsonDecode >0){	KMST200M_fnSrchBoardContents(ctgrNo);}
		if(KMST200M_jsonDecode >0){	KMST200M_fnSrchGrid(false, ctgrNo);}
		else{Utils.alert(KMST200M_jsonMsg);}

//		KMST200M_fnSrchGrid();

	},window.kendo.ui.progress($("#grdKMST200"), true), window.kendo.ui.progress($("#grdKMST200"), false));

}
//그리드 지식 수정하기 클릭
function KMST200M_fnUpdateDataClick(ctgrNo,cntntsNo,kldStCd,descUsrNm,regrId) {
	//JDJ 수정 권한 체크

	if(!GLOBAL.session.user.kldMgntSetLmYn==="Y"){ //관리자가 아닐경우
		if(GLOBAL.session.user.decUsrNm !== descUsrNm){// 내글이아닐경우
			return;
		}
	}
	let regNm = descUsrNm+"("+regrId+")";
	$('#KMST200M input[name=KMST200_regrNm]').val(regNm) ; //팝업 전달용
	let parm = {
		tenantId:GLOBAL.session.user.tenantId,
		ctgrNo : ctgrNo,
		cntntsNo : cntntsNo,
		kldStCd :kldStCd,
		callbackKey: "KMST200M_fnUpdateDoc",
	}

	Utils.setCallbackFunction("KMST200M_fnUpdateDoc", function(ctgrNo){
//		KMST200M_fnSrchBoardContents(ctgrNo);
		KMST200M_fnSrchGrid(false, ctgrNo);
		Utils.alert("정상 저장 되었습니다.");
	});
	Utils.openPop(GLOBAL.contextPath + "/kmst/KMST210P","KMST210P",1240,1000,parm)
}

//sub function----------------------------------------------------------------------------------------------------------
//트리 부모 구조 체크
function KMST200M_fnSubCheckListValid(brdlist){
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
		return KMST200M_fnSubCheckListValid(checkId);
	}
}
//트리구조 변경
function KMST200M_fnSubChangeTreeData(list) {
	
	let MappedArr = [];
	for (let item of list) {
 		let data = {
			id			: item.ctgrNo,        // 자신 코드
			hgrkCtgrNo	: parseInt(item.hgrkCtgrNo) ,    // 부모 코드
			ctgrNm		: item.ctgrNm,        // 자신 이름
			case 		: item.itemCount,
			ctgrAttrCd	: item.ctgrAttrCd,
			ctgrNm		: item.ctgrNm,
			brdPath 	: item.brdPath,
			items		: [],
			expanded    : true,
			rdPmssYn	: item.rdPmssYn,				//kw게시판 - 읽기 권한
			writPmssYn	: item.writPmssYn,			//kw게시판 권한 - 쓰기 권한
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
	
//	let MappedArr = [];
//	for (let item of list) {
// 		let data = {
//			id			: item.ctgrNo,        // 자신 코드
//			hgrkCtgrNo	: item.hgrkCtgrNo ,    // 부모 코드
//			ctgrNm		: item.ctgrNm,        // 자신 이름
//			case 		: item.count,
//			path 		: item.brdpath,
//		};
//		MappedArr.push(data);
//	}
//	return Utils.CreateTreeDataFormat( MappedArr,"hgrkCtgrNo",true);
}

//Subfunction - String Date 날짜 형식 변환 ("YYYYMMDD" -> new date(yyyy-mm-dd))
function KMST200M_fnSubConvertStringToDate(responseDate) {
	let year = responseDate.split(' ')[0].split('-')[0];
	let month = responseDate.split(' ')[0].split('-')[1];
	let day = responseDate.split(' ')[0].split('-')[2];
	return new Date(year, (month - 1), day);
}


//kw---20230614 : 게시글 조회
function KMST200M_fnSrchGrid(nFirstStart, selectCtgr){
	KMST200M_treeKMST200M.dataSource.data([]);
	KMST200M_listViewKMST200M.dataSource.data([])

	//kw--- 검색어 종류 : 1:전체, 2:내용
	let srchTitleType = $("#KMST200_srchType").val();
	if(Utils.isNull(srchTitleType)){
		srchTitleType = 0;		//전체
	}
	
	//kw---게시물 상태
	let knowState;
	if(!Utils.isNull($('#KMST200M input[name=KMST200_srchKnowState]').data("kendoMultiSelect"))){
		if($('#KMST200M input[name=KMST200_srchKnowState]').data("kendoMultiSelect").value().length>=1){
			if($('#KMST200M input[name=KMST200_srchKnowState]').data("kendoMultiSelect").value()[0] !==''){
				knowState= $('#KMST200M input[name=KMST200_srchKnowState]').data("kendoMultiSelect").value()
			}
		}
	} else {
		knowState = null;
	}
	
	//kw---열람구분
	let srchReadYn = 1;
//	let srchReadYn = $("#CMMT200M_cobPuslmn").val();
//	if(Utils.isNull(srchReadYn)){
//		srchReadYn = "1"
//	}
	
	
	//kw---작성자
	let srchReg;
	if(!Utils.isNull($('#KMST200M input[name=KMST200_srchKnowReg]').data("kendoMultiSelect").value())){
		srchReg = $('#KMST200M input[name=KMST200_srchKnowReg]').data("kendoMultiSelect").value();
	} else {
		srchReg = null;
	}
	
	//kw---작성일자
	let srchStartDate = $("#KMST200_dateStart").val();
	//처음 시작했을 때
	if(nFirstStart == true || selectCtgr != null){
		srchStartDate = "1900-01-01";
	}
	
	//kw---파라미터 체크 ( 알림을 통해서 넘어옴. 우선순위 : 승인 > 열람하지 않은 페이지)
	let ncsyCheck = [];
	if(!Utils.isNull(KMST200M_ncsyCount)){
		ncsyCheck[0] = "11";
		knowState = ncsyCheck;
	}
    
	var KMST200M_Serch_data = {
			tenantId 			: GLOBAL.session.user.tenantId
			, usrId 			: GLOBAL.session.user.usrId
			, encryptYn 		: KMST200M_encryptYn			//kw---20230503 : 고객정보 복호화 여부 키 추가
			, srchTitleType		: srchTitleType												//검색어 종류
			, srchTitle			: $('#KMST200M input[name=KMST200_srchText]').val()		//검색어
			, srchState			: knowState													//게시물상태
			, srchReadYn		: srchReadYn												//열람구분
			, srchReg 			: srchReg													//작성자
			, srchStartDate		: srchStartDate
			, srchEndDate		: $("#KMST200_dateEnd").val() 
			, athtCd			: GLOBAL.session.user.menuAtht				//
			, orgCd 			: GLOBAL.session.user.orgCd
			, usrGrd 			: GLOBAL.session.user.usrGrd
			,lstCorprId	        : GLOBAL.session.user.usrId
			,lstCorprOrgCd	    : GLOBAL.session.user.orgCd
			,kldScwdSaveYn      : GLOBAL.session.user.kldScwdSaveYn
	 };
	scwdCookie()
	Utils.ajaxCall('/kmst/KMST200SEL08', JSON.stringify(KMST200M_Serch_data), function(data){
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

        Utils.ajaxCall('/kmst/KMST200SEL07',  JSON.stringify(KMST200M_Serch_data), function(data){
            let list = [];
			$(JSON.parse(data.list)).each(function (index,item){
				//kw--- 카테고리 개수값 증가
				$(treeList).each(function (index,treeItem){
					//카테고리가 동일할 때 카운트
					if(treeItem.ctgrNm == item.ctgrNm){
						//승인요청 상태가 아닌경우 카운트
						if(item.kldStCd != '11' || item.kldStCd != '14'){
							treeItem.itemCount++;
						} else {
							if(item.regrId == GLOBAL.session.user.usrId){
								treeItem.itemCount++;
			        		} else if((item.kldStCd == '11' || item.kldStCd == '14' ) && item.ctgrAdmnId == GLOBAL.session.user.usrId){
			        			treeItem.itemCount++;
			        		}
						}
					}
				});
				
				let rpsImg ="", stNm ="";
				
				if(!Utils.isNull(item.cntntsRpsImgIdxNm)){
					rpsImg = '<img src="/bcs/cmmtphotoimg/' + item.tenantId + '/' + item.cntntsRpsImgIdxNm + '">';
				}
				
				let mokitCtt = item.cntntsCttTxt;
				
				KMST200M_commCodeList.filter(function (code){
					if(code.mgntItemCd == "C0084"){
						if(code.comCd == item.kldStCd){
							stNm = code.comCdNm;
						}
					}
				});
				
				let obj = {
					ctgrNo			: item.ctgrNo
					, cntntsNo		: item.cntntsNo
					, cntntsTite	: item.cntntsTitle
					, usrNm			: item.usrNm
					, regDtm 		: kendo.format("{0:yyyy-MM-dd}",new Date(item.regDtm))
					, blthgRpsImg	: rpsImg
					, moktiCtt 		: item.cntntsCttTxt
					, chkAuth 		: item.regrId
					, kldStNm		: stNm
					, ctgrNm 		: item.ctgrNm
					, countFile 	: item.apndCount
					, chkAuthDel 	: item.regrId
					, ctgrAdmnId	: item.ctgrAdmnId
					, kldStCd		: item.kldStCd
					, brdpath		: item.brdPath
					, writPmssYn	: item.writPmssYn
					, corcPmssYn	: item.corcPmssYn
					, delPmssYn		: item.delPmssYn
				}
 				list.push(obj);
				
			});
			
			//kw---카테고리 트리
	        KMST200M_treeKMST200M.dataSource.data(KMST200M_fnSubChangeTreeData(treeList));
	        
	        let first_item;
	        if(Utils.isNull(selectCtgr) || selectCtgr == -1){
	        	$(treeList).each(function (index,treeItem){
	        		if(treeItem.itemCount > 0){
	        			first_item = $("#treeKMST200").find('li').eq(index);
	        			return false;
	        		}
	        	});
	        } else {
	        	$(treeList).each(function (index,treeItem){
	        		if(treeItem.ctgrNo == selectCtgr){
	        			first_item = $("#treeKMST200").find('li').eq(index);
	        			return false;
	        		}
	        	});
	        }
	    	
	        
	        console.log("list size1 : " + list.length);
	        
	    	//kw---20230630 : 카테고리가 없고 게시글이 존재하지 않을 겨우 밑에 조건을 타지 않음
	    	if(KMST200M_treeKMST200M.dataItem(first_item) != undefined){
	    		KMST200M_treeKMST200M.select(first_item);
	    		let ctgrFirstId = KMST200M_treeKMST200M.dataItem(first_item).id;
		    	
		    	$('#KMST200M span[name=KMST200_catagoryPath]').text(KMST200M_treeKMST200M.dataItem(first_item).brdPath);
				$('#KMST200M span[name=KMST200_contentCount]').text(KMST200M_treeKMST200M.dataItem(first_item).case);
				
				console.log("list size2 : " + list.length);
		    	//kw--- 리스트 표출
				KMST200M_ctntsList = list;
				KMST200M_listViewKMST200M.dataSource.data(list);
				KMST200M_fnListFilter(KMST200M_treeKMST200M.dataItem(first_item));
	    	}
	    	
        });
    });
}

//kw---20230615 : 카테고리 선택시 그리드 항목 필터
function KMST200M_fnListFilter(selectData){
	let targetData = KMST200M_listViewKMST200M.dataSource;

	let targetId = selectData.id;
	
	console.log("selectData : %o" + JSON.stringify(selectData));
	
	//kw---20230705 : 화면이 로드된 후 자동 선택 됐을때에도 값을 넣어주기 위해 해당 함수에서 설정
	//kw---20230705 : 해당 컨트롤에 카테고리 번호를 넣어줘야 지식등록 팝업창 생성시 파라미터로 넘어감
	$('#KMST200M input[name=KMST200_ctgrNo]').val(selectData.id);
	
	//kw---20230703 : 게시글 등록 버튼 활성화 관련 조건 수정
	//kw---20230703 : 쓰기 권한이 Y가 아닐 경우에는 disable (권한 설정이 따로 되어있지 않은 조건은 NULL로 처리되므로 변경)
	//kw---20230703 : 게시글 전체 글쓰기 권한이 불가일 경우 disable
	if(selectData.ctgrAttrCd == 1 || selectData.writPmssYn != 'Y'){
		$('#KMST200M button[name=KMST200_btnKMS210Open]').attr("disabled", true);
	}else{
		$('#KMST200M button[name=KMST200_btnKMS210Open]').attr("disabled", false);
	}
	
    targetData.filter({
        operator: function(item){
        	
        	console.log(item);
        	if(item.ctgrNo === targetId){
        		if(item.chkAuth == GLOBAL.session.user.usrId){
        			return item;
        		} else {
	        		if(item.kldStCd != '11' || item.kldStCd == '11' && item.ctgrAdmnId == GLOBAL.session.user.usrId){
	        			return item;
	        		}
        		}
        	}
            
        },
    });
}


function scwdCookie(){
	if(GLOBAL.session.user.kldScwdSaveYn == 'Y'){
		var text = $("#KMST200_srchText").val()
		if(text != ''){
			const date = new Date();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const formattedDate = `${month}-${day}`;
			parent.Utils.putCookieArrToJson("scwd" , {scwd : text , inMySc : 1 , scwdDate : formattedDate} )
		}
	}
}