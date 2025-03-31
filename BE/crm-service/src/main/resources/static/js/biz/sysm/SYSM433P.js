/***********************************************************************************************
 * Program Name : SMS템플릿 관리 - MAIN(SYSM430M.js)
 * Creator      : 강동우
 * Create Date  : 2022.04.28
 * Description  : SMS템플릿 관리 - MAIN
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.28     강동우            최초생성
 * 2023.04.       김운				 첨부파일 추가
 * 2023.05.03     김운				 수정
 * 								 1. 템플릿을 선택하지 않으면 보낼수 없도록 예외처리 추가
 * 								 2. 복호화 관련 여부 키 추가
 * 								 3. 텍스트 표출 부분 readonly, placeholder : 텍스트를 입력하세요 -> 템플릿을 선택해 주세요. 변경
 ************************************************************************************************/
var SYSM433P_comCdList;
var SYSM433P_grid = new Array(4);
var SYSM433P_UerNm;
var SYSM433P_CustNm;
var SYSM433P_CustId;
var SYSM433P_TmplMgntNo;
var SYSM433P_smsStCd;
var SYSM433P_smsMaxByte = 2000;
var SYSM433P_memoMaxLength = 200;

var SYSM433P_smsType = "SMS";			//SMS, LMS, MMS

var SYSM443P_btdt;
var SYSM433P_custRcgnPathCd;
var SYSM433P_custRcgnCd;
var SYSM433P_gndrCd;
var SYSM433P_recvrTelCntyCd;
var SYSM433P_recvrTelNo;
var SYSM433P_CntyCd;
var SYSM443P_cldDv;				//클라우드 구분 : 테넌트 > 기본정보(32)
var SYSM443P_smsSndgNo;			//SMS 발송 번호 : 테넌트 > 기본정보(30)
var SYSM433P_SMSViewHtml;

var SYSM433P_fileNameOrg = [];
var SYSM433P_filePath = [];

var SYSM433P_IFType;

var paramInfo;

var tabSYSM433P_1;		//텝 변수

var SYSM433P_callListNum = [];
var SYSM433p_callListNm = [];
var SYSM433p_callListId = [];		//kw---20240320 : custId 추가
var SYSM433P_selectNm;
var SYSM433P_selectId;				//kw---20240320 : custId 추가

var SYSM433P_encryptYn;
var SYSM433P_tmplFiles = [];		//20240215 : SMS 템플릿 이미지 불러오기 관려 기능 추가

//kw---20240110 : 기업용 추가
var grdSYSM433P_custId;
var grdSYSM433P_custNm;
var SYSM433P_codeList={"codeList":[]};
var SYSM433P_comCdList2;

for (let i = 0; i < SYSM433P_grid.length; i++) {
	SYSM433P_grid[i] = {
		instance: new Object(),
		dataSource: new Object(),
		currentItem: new Object(),
		currentCellIndex: new Number(),
		selectedItems: new Array(),
		record: 0
	}
}

//kw---20240326 : SMS 탬플릿 관리 - 미리보기시 이미지 파일도 보이게 추가
SYSM433P_smsTmplFileInfo = [];

var COMPRESS_LIST = [] //파일 업로드 시 이미지 크기 조절된 대상 저장 배열
var MAX_SIZE = 1 * 1024 * 1024 / 3

//kw---20240523 : 환자정보 그리드 컬럼 추가 옵션
var SYSM433P_gridPatGridEmr = false;

$(document).ready(function () {

	if(GLOBAL.session.user.tenantId == "YJG"){
		SYSM433P_gridPatGridEmr = true;
	}

	//테넌트 기준정보 (30) SMS 발송 번호 사용
	var smsSndgNo = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 30);

	//Bona 구분 기본 설정
	SYSM443P_cldDv = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 32).bsVl1;

	//kw---20230503 : 고객정보 복호화 여부 키 추가
	SYSM433P_encryptYn = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1


	//인터페이스 체크 및 환자조회 화면 불러오기
	SYSM433P_fnIFCheck();

	SYSM433P_fnInit();

	SYSM433P_fnSearchSmsSendList();

	if(Utils.isNull(smsSndgNo) == false){
		SYSM443P_smsSndgNo = smsSndgNo.bsVl1;
		$("#SYSM433P_Number").val(SYSM443P_smsSndgNo);
	}

	//kw---20240126 : 검색 엔터키 처리
	Utils.ElementEnterKeyUp("SYSM433P_TmplNmSerch", function(){
		SYSM433P_fnSearchTmplList();
	});

	SYSM433P_fnChangeByte("#SYSM433P_SMSViewDisp");

	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		SYSM433P_GridResize();
	}
	//kw---20230510 : 환자정보를 통해 SMS 팝업창을 생성 했을 경우
	//recvrTelNo가 있는 경우에는 환자정보를 통해 SMS팝업을 생성한 것
	if(!Utils.isNull(Utils.getUrlParam('recvrTelNo'))){
		if(SYSM433P_IFType == "DB"){
			$("#SYSM433P_Receiving").css("font-size", "14px");
			$("#SYSM433P_Search").val(Utils.getUrlParam('recvrTelNo').replace(/\-/g, ''));
			$("#SYSM433P_Receiving").val(Utils.getUrlParam('recvrTelNo').replace(/\-/g, ''));	//kw---20230510 : 수신번호에 파라미터로 넘어온 전화번호를 입력 

			//kw---20230510 : paramInfo 변수에 데이터가 있는 경우에는 환자정보 -> SMS -> init Data(첫 조회) / 없는 경우에는 init 후 2번째 조회...
			//kw---20230510 : paramInfo는 init 이후 null로 변경
			paramInfo = {
				tenantId	: GLOBAL.session.user.tenantId,
				srchCond	: 3,
				srchText	: $("#SYSM433P_Search").val(),
				"encryptYn" : SYSM433P_encryptYn		//kw---20230503 : 고객정보 복호화 여부 키 추가
			}
		}
	}

	//kw---20240327 : 첨부파일 마우스 오버시 미리보기 기능 추가
	$("#SYSM433P_divImgPreView1").hide();
	$("#SYSM433P_divImgPreView2").hide();
	$("#SYSM433P_divImgPreView3").hide();

	SYSM433P_showImagePreview("#SYSM433P_inputFileName1", "#SYSM433P_divImg1", "#SYSM433P_divImgPreView1", 0);
	SYSM433P_showImagePreview("#SYSM433P_inputFileName2", "#SYSM433P_divImg2", "#SYSM433P_divImgPreView2", 1);
	SYSM433P_showImagePreview("#SYSM433P_inputFileName3", "#SYSM433P_divImg3", "#SYSM433P_divImgPreView3", 2);

});

function SYSM433P_fnInit(){
	//템플릿 그리드 생성
	SYSM433PGrid();

	//kw---20240523 : 환자정보 그리드 컬럼 추가 옵션
//	SYSM433P_fnGridOptionAdd();

	SYSM433PCombo();

	//레이어 팝업 생성
	$(".callList_open").click(function () {		//+ 버튼 클릭
		SYSM433P_fnCallListOpen();
	});
	$(".calladdPopClose").click(function () {	//x버튼클릭
		SYSM433P_fnCallListCancel();
	});
	$("#SYSM433P_callListCancel").click(function () {	//레이어팝업 취소 버튼클릭
		SYSM433P_fnCallListCancel();
	});
	$("#SYSM433P_callListAdd").click(function () {		//레이어팝업 행 추가 버튼 클릭
		SYSM433P_fnCallListTBodyInsert();
	});
	$("#SYSM433P_callListConfirm").click(function () {		//레이어팝업 확인 추가 버튼 클릭
		SYSM433P_fnCallListConfirm();
	});
	$("#SYSM433P_callListDel").click(function () {		//콜리스트 전체 삭제
		SYSM433P_fnCallListClear();
	});

	//레이어 팝업 - 테이블 행 추가
	for(var i=0; i<5; i++){
		SYSM433P_fnCallListTBodyInsert();
	}
}

function SYSM433P_fnIFCheck(){
	//kw---20230510 : 테넌트 기준정보(18) 고객정보 경로 - 15:IF-IO / 14:DB-IO
	var ifType = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 18).bascVluDvCd;
	if(ifType == 15){
		SYSM433P_IFType = "IF";

		let SYSM433P_tenant = GLOBAL.session.user.tenantId;
		let SYSM433P_url = GLOBAL.contextPath + "/bizs/H" + SYSM433P_tenant + "/" + SYSM433P_tenant + "B433P.jsp"

		$.ajax({
			url:  SYSM433P_url,
			type: "GET",
			success: function(data) {
				// 파일이 있으면 load()로 내용을 불러와서 삽입
				$("#SYSM433P_divTop").empty();
				$("#SYSM433P_divTop").load(GLOBAL.contextPath + "/bizs/H" + SYSM433P_tenant +"/" + SYSM433P_tenant + "B433P.jsp");
			},
			error: function() {
				Utils.alert("해당 페이지를 찾을 수 없습니다.<br>관리자에게 문의해 주세요.", function(){
					self.close();
				});

			}
		});

	} else {
		SYSM433P_IFType = "DB";

		//kw---20240126 : 검색 엔터키 처리
		Utils.ElementEnterKeyUp("SYSM433P_Search", function(){
			SYSM433P_fnSearchTop();
		});
		//$("#SYSM433P_Receiving").attr("readonly",false);

		SYSM433P_fnCustSearchGridInit();
	}
}

//레이어팝업 전체 삭제
function SYSM433P_fnCallListClear(){
	$("#SYSM433P_callListTBody").empty();

	//레이어 팝업 - 테이블 행 추가
	for(var i=0; i<5; i++){
		SYSM433P_fnCallListTBodyInsert();
	}

	SYSM433P_callListNum = [];
	SYSM433p_callListNm = [];
	SYSM433p_callListId = [];		//kw---20240320 : custId 추가

	SYSM433P_fnReceiverCount();
}

function SYSM433P_fnCallListOpen(){

	$(".calladdPop").addClass("active");

	$("#SYSM433P_callListTBody").empty();

	//레이어 팝업 - 테이블 행 추가
	for(var i=0; i<5; i++){
		SYSM433P_fnCallListTBodyInsert();
	}

	var receivNumArr = $("#SYSM433P_Receiving").val().split(',');
	var receivNameArr = [];
	var receivIdArr = [];		//kw---20240320 : custId 추가

	var trCount = $("#SYSM433P_callListTBody tr").length;

	for(var i=0; i<receivNumArr.length; i++){
		if(i >= trCount){
			SYSM433P_fnCallListTBodyInsert();
		}

		$("#SYSM433P_callListNumber_" + i).val(receivNumArr[i]);

		if(i==0 && !Utils.isNull(SYSM433P_selectNm)){
			if( !Utils.isNull($("#SYSM433P_callListNumber_" + i).val()) ){
				$("#SYSM433P_callListName_" + i).val(SYSM433P_selectNm);

				//kw---20240320 : custId 추가
				$("#SYSM433P_callListId_" + i).val(SYSM433P_selectId);
			} else {
				SYSM433P_selectNm = '';
				SYSM433P_selectId = '';
			}

		} else {
			for(var k=0; k<SYSM433P_callListNum.length; k++){

				if(receivNumArr[i] == SYSM433P_callListNum[k]){

					$("#SYSM433P_callListName_" + i).val(SYSM433p_callListNm[k]);
					receivNameArr[i] = SYSM433p_callListNm[k];

					//kw---20240320 : custId 추가
					$("#SYSM433P_callListId_" + i).val(SYSM433p_callListId[k]);
					receivIdArr[i] = SYSM433p_callListId[k];

					break;
				}
			}
		}
	}

	SYSM433p_callListNm = receivNameArr;
	SYSM433P_callListNum = receivNumArr;
	SYSM433p_callListId = receivIdArr;		//kw---20240320 : custId 추가

	var receivNumStr = $("#SYSM433P_Receiving").val();

	if(!Utils.isNull(receivNumStr)){
		$("#SYSM433P_Receiving").css("font-size", "14px");
	} else {
		$("#SYSM433P_Receiving").css("font-size", "11px");
	}

	SYSM433P_fnReceiverCount();
}

//레이어팝업 callList 행 추가
function SYSM433P_fnCallListTBodyInsert(){
	$("#SYSM433P_callListAdd").blur();

	var trCount = $("#SYSM433P_callListTBody tr").length;
	var insertTBody = "";

	insertTBody += '<tr>';
	insertTBody += '<td>'
	insertTBody += '<input type="text" id="SYSM433P_callListId_' + trCount + '" class="k-input" placeholder="번호" style="width: 100%; display:none;">';
	insertTBody += '<input type="text" id="SYSM433P_callListName_' + trCount + '" class="k-input" placeholder="이름" style="width: 100%;"></td>';
	insertTBody += '<td>';
	insertTBody += '<input type="text" id="SYSM433P_callListNumber_' + trCount + '" class="k-input fl" placeholder="전화번호" style="width: 82%;" oninput="SYSM433P_fnCallListInputNum(this.id)" onchange="SYSM433P_fnCallListInputChange(' + trCount + ')">';
	insertTBody += '<button id=SYSM433P_callListDel_' + trCount + '" class="btnRefer_second icoType k-icon k-i-delete fr ma_top1" title="삭제" onclick="SYSM433P_fnCallListTBodyDelete(' + trCount + ');"></button>';
	insertTBody += '</td>';
	insertTBody += '</tr>';

	$("#SYSM433P_callListTBody").append(insertTBody);
}

function SYSM433P_fnCallListInputChange(nInputNum){
	SYSM433P_fnReceiverCount();

}
function SYSM433P_fnFontSizeSet(nId){

	if(Utils.isNull($("#SYSM433P_Receiving").val())){
		$("#SYSM433P_Receiving").css("font-size", "11px");
	} else {
		$("#SYSM433P_Receiving").css("font-size", "14px");
	}

	SYSM433P_fnCallListInputNum(nId);
}

//레이어팝업 callList 행 삭제
function SYSM433P_fnCallListTBodyDelete(nDelNum){
//	$('#SYSM433P_callListTBody > tr:last' + (nDelNum+1)).remove();

//	var tr = $(obj).parent().parent();
//
//	//라인 삭제
//	tr.remove();

	var trCount = $("#SYSM433P_callListTBody tr").length;

	for(var i=nDelNum; i<trCount; i++){

		var moveDataName, moveDataNumber, moveDataId;

		moveDataName = $("#SYSM433P_callListName_" + (i + 1)).val();
		$("#SYSM433P_callListName_" + i).val(moveDataName);

		moveDataNumber = $("#SYSM433P_callListNumber_" + (i + 1)).val();
		$("#SYSM433P_callListNumber_" + i).val(moveDataNumber);

		//kw---20240320 : custId 추가
		moveDataId = $("#SYSM433P_callListId_" + (i + 1)).val();
		$("#SYSM433P_callListId_" + i).val(moveDataNumber);
	}

	if(trCount > 5){
		$('#SYSM433P_callListTBody > tr:last').remove();
	}

	SYSM433P_fnReceiverCount();
}

//레이어팝업 - 수신자 인원 체크
function SYSM433P_fnReceiverCount(){

	var trCount = $("#SYSM433P_callListTBody tr").length;
	var receiverCount = 0;
	for(var i=0; i<trCount; i++){
		if(!Utils.isNull($("#SYSM433P_callListNumber_" + i).val())){
			receiverCount++;
		}
	}

	$("#SYSM433P_receiverCount").text(SYSM433P_langMap.get("SYSM433P.receiver") + " : " + receiverCount);

}

//레이어팝업 callList 전화번호 숫자만 입력
function SYSM433P_fnCallListInputNum(nId) {
	var element = document.getElementById(nId);
	element.value = element.value.replace(/[^,0-9]/gi, "");
}

//레이어팝업 callList 취소버튼 클릭
function SYSM433P_fnCallListCancel(){

	var trCount = $("#SYSM433P_callListTBody tr").length;

//	$("#SYSM433P_callListTBody").empty();
//
//	//레이어 팝업 - 테이블 행 추가
//	for(var i=0; i<5; i++){
//		SYSM433P_fnCallListTBodyInsert();
//	}

//	SYSM433P_callListNum = [];
//	SYSM433p_callListNm = [];

	$(".calladdPop").removeClass("active");
}

//레이어팝업 callList 확인버튼 클릭
function SYSM433P_fnCallListConfirm(){

	var trCount = $("#SYSM433P_callListTBody tr").length;
	var inCountNum = 0;

	SYSM433P_callListNum = [];

	for(var i=0; i<trCount; i++){

		if(i==0){
			SYSM433P_selectNm = $("#SYSM433P_callListName_0").val();
			SYSM433P_selectId = $("#SYSM433P_callListId_0").val();				//kw---20240320 : custId 추가
		}

		if(!Utils.isNull($("#SYSM433P_callListNumber_" + i).val())){
			SYSM433p_callListNm[inCountNum] 		= $("#SYSM433P_callListName_" + i).val();
			SYSM433P_callListNum[inCountNum] 		= $("#SYSM433P_callListNumber_" + i).val();
			SYSM433p_callListId[inCountNum] 		= $("#SYSM433P_callListId_" + i).val();			//kw---20240320 : custId 추가
			inCountNum++;
		}

	}

	$(".calladdPop").removeClass("active");

	var receivNum = "";

	for(var i=0; i<SYSM433P_callListNum.length; i++){
		receivNum += SYSM433P_callListNum[i] + ",";
	}

	if(!Utils.isNull(receivNum)){
		$("#SYSM433P_Receiving").css("font-size", "14px");
	} else {
		$("#SYSM433P_Receiving").css("font-size", "11px");
	}

	$("#SYSM433P_Receiving").val(receivNum.slice(0,-1));
}

//레이어팝업 - 전화번호 선택버튼 클릭시 데이터 넣어주기
function SYSM433_fnReceivBtnCallListPut(nCntcTelNo, nCustNm, nCustId){

	var trCount = $("#SYSM433P_callListTBody tr").length;

	var insertYn = "N";

	for(i=0; i<trCount; i++){
		var phoneNum 	= $("#SYSM433P_callListNumber_" + i).val();
		var name 		= $("#SYSM433P_callListName_" + i).val();
		var id	 		= $("#SYSM433P_callListId_" + i).val();			//kw---20240320 : custId 추가

		if(phoneNum == nCntcTelNo){
			Utils.alert(SYSM433P_langMap.get("SYSM433P.alert14"));
			return;
		}

		if(Utils.isNull(phoneNum) && Utils.isNull(name)){
			$("#SYSM433P_callListNumber_" + i).val(nCntcTelNo);
			$("#SYSM433P_callListName_" + i).val(nCustNm);
			$("#SYSM433P_callListId_" + i).val(nCustId);				//kw---20240320 : custId 추가
			insertYn = "Y";
			break;
		}
	}

	if(insertYn == "N"){
		SYSM433P_fnCallListTBodyInsert();
		$("#SYSM433P_callListNumber_" + trCount).val(nCntcTelNo);
		$("#SYSM433P_callListName_" + trCount).val(nCustNm);
		$("#SYSM433P_callListId_" + trCount).val(nCustId);
	}

	SYSM433P_fnReceiverCount();

}

function SYSM433_fnSendTargetSearch(){

	//kw---20240126 초기에
	if(typeof SYSM433P_grid[0].instance.clearSelection == 'function'){
		SYSM433P_grid[0].instance.clearSelection();
	} else {
		return;
	}

	if(SYSM433P_IFType == "DB"){
		SYSM433P_grid[0].currentItem = new Object();
		SYSM433P_grid[1].currentItem = new Object();
		SYSM433P_grid[2].currentItem = new Object();

		SYSM433P_grid[0].dataSource.data([]);
		SYSM433P_grid[1].dataSource.data([]);
		SYSM433P_grid[2].dataSource.data([]);

		var tenantId = GLOBAL.session.user.tenantId;

		var SYSM433P_ComboBoxVal = $("#ComboBoxSYSM433P1").val();
		var SYSM433P_Search = $("#SYSM433P_Search").val();

		if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
			var param;
			if(!Utils.isNull(paramInfo)){
				param = paramInfo;
			} else {
				param = {
					tenantId	: GLOBAL.session.user.tenantId,
					srchCond	: SYSM433P_ComboBoxVal,
					srchText	: SYSM433P_Search,
					"encryptYn" : SYSM433P_encryptYn		//kw---20230503 : 고객정보 복호화 여부 키 추가
				}
			}

			
			window.kendo.ui.progress($("#SYSM433P_grid0"), true);
			Utils.ajaxCall("/sysm/SYSM433SEL01", JSON.stringify(param), function (result) {
				window.kendo.ui.progress($("#SYSM433P_grid0"), false);
				
				var patApptInfo = JSON.parse(result.list);
				SYSM433P_grid[0].dataSource.data(patApptInfo);

				//kw---20230510 : paramInfo에 데이터가 있는 경우는 조회해야할 환자정보가 명시되어 있는 경우.
				//밑에 조건문은 파라미터로 넘어온 환자정보를 통해 자동으로 발송대상 항목을 선택해주기 위함
				if(!Utils.isNull(paramInfo)){
					var listCount = 0;
					for (const list of patApptInfo) {
//						console.log(list);
//						console.log(Utils.getUrlParam('recvrTelNo').replace(/\-/g, '') + " = " + list.cntcTelNo + " / " + Utils.getUrlParam('custId') + " = " + list.custId);
						if(Utils.getUrlParam('recvrTelNo').replace(/\-/g, '') == list.cntcTelNo && Utils.getUrlParam('custId') == list.custId){
							SYSM433P_grid[0].instance.select("tr:eq(" + listCount + ")");
							SYSM433P_fnSearchMiddleMenuList(Utils.getUrlParam('recvrTelNo').replace(/\-/g, ''));
							break;
						}
						listCount++;
					}
				}

				paramInfo = null;
			});
		} else {

			var SYSM433P_data = {
				tenantId 	   	: GLOBAL.session.user.tenantId,
				usrId		   	: GLOBAL.session.user.usrId,
				srchType 	   	: SYSM433P_ComboBoxVal.split("_")[0],
				voColId		   	: SYSM433P_ComboBoxVal.split("_")[1],
				srchTxt 	   	: SYSM433P_Search,
				encryptYn      	: SYSM433P_ComboBoxVal.split("_")[2],
				type		   	: 'SEL',
				girdPrnYn		: 'N',
			};

			window.kendo.ui.progress($("#SYSM433P_grid0"), true);
			Utils.ajaxCall("/cnsl/CNSL160SEL03", JSON.stringify(SYSM433P_data), function (result) {
				window.kendo.ui.progress($("#SYSM433P_grid0"), false);
				var SYSM433P_jsonEncode = JSON.stringify(result.CNSL160SEL03);
				var SYSM433P_jsonDecode = JSON.parse(JSON.parse(SYSM433P_jsonEncode));

//				console.log(SYSM433P_jsonDecode);
				let SYSM433P_arrCnslInfo = [];
				if ( SYSM433P_jsonDecode.length > 0 ) {
					let SYSM433P_jsonColumn = {}
					let SYSM433P_rowId = '';

					let SYSM433P_jsonColumnItem = [];
					let SYSM433P_jsonColumnItemRow = {};
					let SYSM433P_grpNo = '';
					let SYSM433P_rowNo = '';
					for ( var i = 0; i < SYSM433P_jsonDecode.length; i++ ) {

//						console.log(SYSM433P_jsonDecode[i].custItemGrpNo + "_" + SYSM433P_jsonDecode[i].rowNo + "_" + SYSM433P_jsonDecode[i].custItemNo);

						if ( SYSM433P_rowId != SYSM433P_jsonDecode[i].custId ) {

							SYSM433P_rowId = SYSM433P_jsonDecode[i].custId;
							SYSM433P_grpNo = SYSM433P_jsonDecode[i].custItemGrpNo;
							SYSM433P_rowNo = SYSM433P_jsonDecode[i].rowNo;

//							console.log("::::::::::::::::::::::: " + SYSM433P_grpNo + "_" + SYSM433P_rowNo);

							if ( i != 0 ) {

								SYSM433P_jsonColumnItem.push(SYSM433P_jsonColumnItemRow);
								SYSM433P_jsonColumn["all"] = SYSM433P_jsonColumnItem;

								SYSM433P_arrCnslInfo.push(SYSM433P_jsonColumn);
								SYSM433P_jsonColumn = {};

								SYSM433P_jsonColumnItem = [];
								SYSM433P_jsonColumnItemRow = {};


							}

							SYSM433P_jsonColumn["custId"] = SYSM433P_jsonDecode[i].custId;
//							console.log(":::::  "+ SYSM433P_jsonColumn["custId"]);
							SYSM433P_jsonColumnItemRow["custId"] = SYSM433P_jsonDecode[i].custId;
							SYSM433P_jsonColumn[SYSM433P_jsonDecode[i].mgntItemCd] = SYSM433P_jsonDecode[i].custItemDataVlu;
							SYSM433P_jsonColumnItemRow[SYSM433P_jsonDecode[i].mgntItemCd] = SYSM433P_jsonDecode[i].custItemDataVlu;
//							console.log(SYSM433P_jsonDecode[i].mgntItemCd + " : " + SYSM433P_jsonDecode[i].custItemDataVlu);

						} else {

							if(SYSM433P_jsonDecode[i].rowNo != SYSM433P_rowNo){

								SYSM433P_jsonColumnItem.push(SYSM433P_jsonColumnItemRow);
								SYSM433P_jsonColumnItemRow = {};
								SYSM433P_grpNo = SYSM433P_jsonDecode[i].custItemGrpNo;
								SYSM433P_rowNo = SYSM433P_jsonDecode[i].rowNo;

//								console.log("::::::::::::::::::::::: " + SYSM433P_grpNo + "_" + SYSM433P_rowNo);

							} else if(SYSM433P_jsonDecode[i].custItemGrpNo != SYSM433P_grpNo){
								SYSM433P_jsonColumnItem.push(SYSM433P_jsonColumnItemRow);
								SYSM433P_jsonColumnItemRow = {};
								SYSM433P_grpNo = SYSM433P_jsonDecode[i].custItemGrpNo;
								SYSM433P_rowNo = SYSM433P_jsonDecode[i].rowNo;

//								console.log("::::::::::::::::::::::: " + SYSM433P_grpNo + "_" + SYSM433P_rowNo);
							}

							SYSM433P_jsonColumn[SYSM433P_jsonDecode[i].mgntItemCd] = SYSM433P_jsonDecode[i].custItemDataVlu;
							SYSM433P_jsonColumnItemRow[SYSM433P_jsonDecode[i].mgntItemCd] = SYSM433P_jsonDecode[i].custItemDataVlu;

//							console.log(SYSM433P_jsonDecode[i].mgntItemCd + " : " + SYSM433P_jsonDecode[i].custItemDataVlu);
						}

						if ( i == SYSM433P_jsonDecode.length-1 ) {
							SYSM433P_jsonColumnItem.push(SYSM433P_jsonColumnItemRow);
							SYSM433P_jsonColumn["all"] = SYSM433P_jsonColumnItem;

							SYSM433P_arrCnslInfo.push(SYSM433P_jsonColumn)
						}
					}
				}
				SYSM433P_grid[0].dataSource.data(SYSM433P_arrCnslInfo);
			});
		}
	}

}

function SYSM433P_fnCustSearchGridInit(){
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		SYSM433P_grid[0].dataSource = new kendo.data.DataSource({
			batch: true,
			pageSize: 10,
			schema: {
				type: "json",
				model: {
					fields: {
						custId      	: { field: "custId", 		type: "string"},
						custNm       	: { field: "custNm", 		type: "string"},
						mbleTelNo       : { field: "mbleTelNo", 	type: "string"},
						cntcTelNo     	: { field: "cntcTelNo", 	type: "string"},
						custNo			: { field: "custNo", 		type: "string"},
						custIdPathCd	: { field: "custIdPathCd", 	type: "string"},
						gndrCd			: { field: "gndrCd", 		type: "string"},
						btdt			: { field: "btdt", 			type: "string"},
						agelrgCd		: { field: "agelrgCd", 		type: "string"},
						cldDv			: { field: "cldDv", 		type: "string"},
						smsSndgNo		: { field: "smsSndgNo", 	type: "string"},
					}
				}
			}
		});

		SYSM433P_grid[0].instance = $("#SYSM433P_grid0").kendoGrid({
			dataSource: SYSM433P_grid[0].dataSource,
			noRecords: {
				template: '<div class="nodataMsg"><p>'+SYSM433P_langMap.get("grid.nodatafound")+'</p></div>'
			},
			dataBound: function() {
				SYSM433P_grid_fnOnDataBound(0);
			},
			change: function(e) {
				SYSM433P_grid_fnOnChange(e, 0);
			},
			autoBind: false,
			scrollable: true,
			selectable: true,
			pageable: {
				pageSize: 10,
				pageSizes: [10,15,20,25,30],
				buttonCount: 5,
				//refresh: true,
			},
			columns: [
				{
					width : 35,
					field : "check",
					title : " ",
					template : '<mark id="grid0Tr" class="singleSelect k-icon k-i-radiobutton"></mark>',
				},
				{
					width : 90,
					field : "custId",
					title : SYSM433P_langMap
						.get("SYSM433P.grid0.col1"),
				},
				{
					width : 80,
					field : "custNm",
					title : SYSM433P_langMap.get("SYSM433P.grid0.col2"),
				},
				{
					width : "auto",
					field : "mbleTelNo",
					title : SYSM433P_langMap.get("SYSM433P.grid0.col3"),
					template:
						"#if( mbleTelNo == null || mbleTelNo == ''){#" +
						'<p class="formAlign Row"><span class="fxGrow_1">#: mbleTelNo #</span>'+
						"#}else if(mbleTelNo.substring(0,3) != '010'){#"+
						'<p class="formAlign Row"><span class="fxGrow_1">#: mbleTelNo #</span>'+
						"#}else{#" +
						'<p class="formAlign Row"><span class="fxGrow_1">#: mbleTelNo #</span>'+
						'<button class="btnRefer_default Small" onclick="SYSM433P_SetReceivingInfo(this)">'+SYSM433P_langMap.get("button.select")+'</button></p>'+
						"#}#"
				},
				{
					width : "auto",
					field : "cntcTelNo",
					title : SYSM433P_langMap.get("SYSM433P.grid0.col4"),
					template:
						"#if( cntcTelNo == null || cntcTelNo == ''){#" +
						"<p class='formAlign Row'><span class='fxGrow_1'>#: cntcTelNo #</span>"+
						"#}else if(cntcTelNo.substring(0,3) != '010'){#"+
						"<p class='formAlign Row'><span class='fxGrow_1'>#: cntcTelNo #</span>"+
						"#}else{#" +
						"<p class='formAlign Row'><span class='fxGrow_1'>#: cntcTelNo #</span>"+
						"<button class='btnRefer_default Small' onclick='SYSM433P_ReceivingBtn1(this)'>"+SYSM433P_langMap.get("button.select")+"</button></p>" +
						"#}#"
				},
				{ hidden: true, width: "auto", field: "smsSndgNo",		title: "smsSndgNo"},
				{ hidden: true, width: "auto", field: "cldDv",			title: "cldDv"},
				{ hidden: true, width: "auto", field: "custNo", 		title: "custNo",},
				{ hidden: true, width: "auto", field: "custIdPathCd", 	title: "custIdPathCd",},
				{ hidden: true, width: "auto", field: "gndrCd", 		title: "gndrCd",},
				{ hidden: true, width: "auto", field: "btdt", 			title: "btdt", },
				{ hidden: true, width: "auto", field: "agelrgCd", 		title: "agelrgCd", },
			],
		}).data('kendoGrid');
	} else {

		let SYSM433P_gridParam = {
			tenantId    : GLOBAL.session.user.tenantId,
		};

		$.ajax({
			url         : GLOBAL.contextPath + '/cnsl/CNSL160SEL02',
			type        : 'post',
			dataType    : 'json',
			contentType : 'application/json; charset=UTF-8',
			data        : JSON.stringify(SYSM433P_gridParam),
			success     : function(data) {
				let jsonEncode = JSON.stringify(data.CNSL160SEL02);
				let object=JSON.parse(jsonEncode);

				let grdSYSM433P_column = JSON.parse(object);
				let pgmId = '';
				let dataSrcDvCd = '';

				if ( grdSYSM433P_column.length > 0 ) {
					pgmId = grdSYSM433P_column[0].pgmId;
					dataSrcDvCd = grdSYSM433P_column[0].dataSrcDvCd;
				}

				let grdSYSM433P_columns = [];

				SYSM433P_grid[0].dataSource = new kendo.data.DataSource({
					transport: {
						read	: function (SYSM433P_jsonStr) {

							let SYSM433P_srchType = JSON.parse(CNSL110T_jsonStr);

							Utils.ajaxCall('/cnsl/CNSL160SEL03', CNSL110T_jsonStr, function(resultData){

								},
								window.kendo.ui.progress($("#SYSM433P_grid0"), true), window.kendo.ui.progress($("#SYSM433P_grid0"), false))
						},
					},
				});

				let jsonCheckColumn = {
					width : 35,
					field : "check",
					title : " ",
					template : '<mark id="grid0Tr" class="singleSelect k-icon k-i-radiobutton"></mark>',
				};

				grdSYSM433P_columns.push(jsonCheckColumn);

				for ( var i = 0; i < grdSYSM433P_column.length; i++ ) {
					let jsonColumn;
					if ( grdSYSM433P_column[i].voColId == 'custId' ) {
						grdSYSM433P_custId = grdSYSM433P_column[i].mgntItemCd;
					}

					if ( grdSYSM433P_column[i].voColId == 'custNm' ) {
						grdSYSM433P_custNm = grdSYSM433P_column[i].mgntItemCd;
					}

					if ( grdSYSM433P_column[i].mgntItemTypCd == "C" ){
						SYSM433P_codeList.codeList.push({"mgntItemCd":grdSYSM433P_column[i].mgntItemCd});

						let mgntItemCd = grdSYSM433P_column[i].mgntItemCd;

						jsonColumn = {
							width: 80, field: mgntItemCd, title: grdSYSM433P_column[i].mgntItemNm,
							template: function (dataItem) {
								let comCd = dataItem[mgntItemCd];
								if (Utils.isNull(comCd)) {
									comCd = '';
								}
								//console.log("::::: SYSM433P_codeList");
								//console.log(SYSM433P_codeList, mgntItemCd, comCd);

								let strReturn = '';
								if(!Utils.isNull(comCd)){
									strReturn = Utils.getComCdNm(SYSM433P_comCdList2, mgntItemCd, comCd);
								}
								return strReturn;

							}
						}
					} else {

						let fieldData = grdSYSM433P_column[i].mgntItemCd;
						let fieldname = grdSYSM433P_column[i].mgntItemNm;

						jsonColumn = {
							width: fieldname.includes("전화번호") ? 130 : 100,
							field: grdSYSM433P_column[i].mgntItemCd,
							title: grdSYSM433P_column[i].mgntItemNm,
							template : function(dataItem){

								let returnStr = dataItem[fieldData];


								if(!Utils.isNull(returnStr)){
									if(returnStr.substring(0,3) == "010"){

										let mblNum = dataItem[fieldData];
										let custNm = dataItem[grdSYSM433P_custNm];

										returnStr = "<p class='formAlign Row'><span class='fxGrow_1'>" + mblNum + "</span>";
										returnStr += "<button class='btnRefer_default Small' onclick='SYSM433P_SetReceivingInfoCpny(this, \"" + mblNum + "\", \"" + custNm + "\")'>"+SYSM433P_langMap.get("button.select")+"</button></p>";
									}
								}


								return returnStr;
							}
						}
					}
					grdSYSM433P_columns.push(jsonColumn);
				}

				var param = SYSM433P_codeList;
				Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
					SYSM433P_comCdList2 = JSON.parse(result.codeList);
				});

				//console.log(":::: grdSYSM433P_columns");
				//console.log(grdSYSM433P_columns);


				SYSM433P_grid[0].instance = $("#SYSM433P_grid0").kendoGrid({
					dataSource: SYSM433P_grid[0].dataSource,
					noRecords: {
						template: '<div class="nodataMsg"><p>'+SYSM433P_langMap.get("grid.nodatafound")+'</p></div>'
					},
					dataBound: function() {
						SYSM433P_grid_fnOnDataBound(0);
					},
					change: function(e) {
						SYSM433P_grid_fnOnChange(e, 0);
					},
					selectable: true,
					autoBind: false,
					resizable: true,
					scrollable: true,
					pageable: {
						pageSize: 10,
						pageSizes: [10,15,20,25,30],
						buttonCount: 5,
						//refresh: true,
					},
					columns: grdSYSM433P_columns,
				}).data('kendoGrid');

				SYSM433P_GridResize();

				SYSM433P_grid[0].dataSource.data([]);

			},
			error       : function(request,status, error){
				console.log("[error]");
				console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
			}
		});
	}

	SYSM433P_grid[1].dataSource = new kendo.data.DataSource({
		transport: {
			read: function (options) {
				Utils.ajaxCall("/sysm/SYSM433SEL02", JSON.stringify(options.data), function (result) {
					options.success(JSON.parse(result.list));
				});
			},
			update: function (options) {

			},
			destroy: function (options) {
				options.success(options.data.models);
			},
		},
		requestStart: function (e) {
			var type = e.type;
			var response = e.response;
		},
		requestEnd: function (e) {
			var type = e.type;
			var response = e.response;

			if (type != "read" && type != "destroy") {
				SYSM433P_fnSearchMiddleMenuList();
			}
		},
		pageSize: 10,
		batch: true,
		schema: {
			type: "json",
			model: {
				fields: {
					tenantId      		: { field: "tenantId", 			type: "string", editable: false},
					custNo      		: { field: "custNo", 			type: "string", editable: false},
					custId      		: { field: "custId", 			type: "string", editable: false},
					custIdPathCd      	: { field: "custIdPathCd", 		type: "string", editable: false},
					gndrCd      		: { field: "gndrCd", 			type: "string", editable: false},
					btdt	      		: { field: "btdt", 				type: "string", editable: false},
					custNm      		: { field: "custNm", 			type: "string", editable: false},
					mbleTelNo      		: { field: "mbleTelNo", 		type: "string", editable: false},
					custItemGrpNo       : { field: "custItemGrpNo", 	type: "string", editable: false},
					custItemNo      	: { field: "custItemNo", 		type: "string", editable: false},
					custNo      		: { field: "custNo", 			type: "string", editable: false},
					rowNo      			: { field: "rowNo", 			type: "string", editable: false},
					custItemDataVlu     : { field: "custItemDataVlu", 	type: "string", editable: false},
					memo      			: { field: "memo", 				type: "string", editable: true},
				}
			}
		}
	});

	let gridColumns2;

	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		gridColumns2 = [
			{ width: 40, selectable: true, },
			{
				title: SYSM433P_langMap.get("SYSM433P.grid1.col1"),
				type: "string",
				width: 60,
				template: function (dataItem) {
					let html = "";
					if (dataItem.isNew()) {
						html = "<img src='" + GLOBAL.contextPath + "/resources/images/contents/btn_new.png' style='vertical-align:middle'>";
					} else if (dataItem.dirty) {
						html = "<img src='" + GLOBAL.contextPath + "/resources/images/contents/btn_modify.png' style='vertical-align:middle'>";
					}
					return html;
				},
			},
			{ width: 140, field: "custItemDataVlu", title: SYSM433P_langMap.get("SYSM433P.grid1.col2"),
				template:
					"#if( custItemDataVlu == null || custItemDataVlu == ''){#" +
					'<p class="formAlign Row"><span class="fxGrow_1">#: custItemDataVlu #</span>'+
					"#}else if(custItemDataVlu.substring(0,3) != '010'){#"+
					"<p class='formAlign Row'><span class='fxGrow_1'>#: custItemDataVlu #</span>"+
					"#}else{#" +
					'<p class="formAlign Row"><span class="fxGrow_1">#: custItemDataVlu #</span>'+
					'<button class="btnRefer_default Small" onclick="SYSM433P_ReceivingBtn2(this)">'+SYSM433P_langMap.get("button.select")+'</button></p>'+
					"#}#"
			},
			{
				field: "memo",
				title: SYSM433P_langMap.get("SYSM433P.grid1.col3"),
				type: "string",
				width: "auto",
				attributes: {"class": "k-text-left"},
				template: function(dataItem){
					var memo = dataItem.memo;
					if(dataItem.memo != null){
						if(dataItem.memo.length > 26){
							return '<p class="k-text-left tdTooltip" title="'+memo+'">'+memo+'</p>';
						} else {
							return '<p class="k-text-left">'+memo+'</p>';
						}
					} else {
						return '';
					}
				}
			},
			{ hidden: true, width: "auto", field: "tenantId", 		title: "tenantId", },
			{ hidden: true, width: "auto", field: "custNo", 			title: "custNo", },
			{ hidden: true, width: "auto", field: "custId", 			title: "custId", },
			{ hidden: true, width: "auto", field: "custIdPathCd", 	title: "custIdPathCd", },
			{ hidden: true, width: "auto", field: "custNm", 			title: "custNm", },
			{ hidden: true, width: "auto", field: "custItemGrpNo", 	title: "custItemGrpNo", },
			{ hidden: true, width: "auto", field: "custItemNo", 		title: "custItemNo", },
			{ hidden: true, width: "auto", field: "gndrCd", 			title: "gndrCd", },
			{ hidden: true, width: "auto", field: "btdt", 			title: "btdt", },
			{ hidden: true, width: "auto", field: "rowNo", 			title: "rowNo", },
		];
	} else {
		gridColumns2 = [
			{ width: 40, selectable: true, },
			{ width: 140, field: "custItemDataVlu", title: SYSM433P_langMap.get("SYSM433P.grid1.col2"),
				template:
					"#if( custItemDataVlu == null || custItemDataVlu == ''){#" +
					'<p class="formAlign Row"><span class="fxGrow_1">#: custItemDataVlu #</span>'+
					"#}else if(custItemDataVlu.substring(0,3) != '010'){#"+
					"<p class='formAlign Row'><span class='fxGrow_1'>#: custItemDataVlu #</span>"+
					"#}else{#" +
					'<p class="formAlign Row"><span class="fxGrow_1">#: custItemDataVlu #</span>'+
					'<button class="btnRefer_default Small" onclick="SYSM433P_ReceivingBtn2(this)">'+SYSM433P_langMap.get("button.select")+'</button></p>'+
					"#}#"
			},
			{
				field: "memo",
				title: SYSM433P_langMap.get("SYSM433P.grid1.col3"),
				type: "string",
				width: "auto",
				attributes: {"class": "k-text-left"},
				template: function(dataItem){
					var memo = dataItem.memo;
					if(dataItem.memo != null){
						if(dataItem.memo.length > 26){
							return '<p class="k-text-left tdTooltip" title="'+memo+'">'+memo+'</p>';
						} else {
							return '<p class="k-text-left">'+memo+'</p>';
						}
					} else {
						return '';
					}
				}
			},
			{ hidden: true, width: "auto", field: "tenantId", 		title: "tenantId", },
			{ hidden: true, width: "auto", field: "custNo", 			title: "custNo", },
			{ hidden: true, width: "auto", field: "custId", 			title: "custId", },
			{ hidden: true, width: "auto", field: "custIdPathCd", 	title: "custIdPathCd", },
			{ hidden: true, width: "auto", field: "custNm", 			title: "custNm", },
			{ hidden: true, width: "auto", field: "custItemGrpNo", 	title: "custItemGrpNo", },
			{ hidden: true, width: "auto", field: "custItemNo", 		title: "custItemNo", },
			{ hidden: true, width: "auto", field: "gndrCd", 			title: "gndrCd", },
			{ hidden: true, width: "auto", field: "btdt", 			title: "btdt", },
			{ hidden: true, width: "auto", field: "rowNo", 			title: "rowNo", },
		];
	}

	SYSM433P_grid[1].instance = $("#SYSM433P_grid1").kendoGrid({
		dataSource	: SYSM433P_grid[1].dataSource,
		noRecords: {
			template: '<div class="nodataMsg"><p>'+SYSM433P_langMap.get("grid.nodatafound")+'</p></div>'
		},
		autoBind	: false,
		selectable	: true,
		//persistSelection: true,
		sortable	: false,
		resizable	: true,
		pageable: {
			pageSize: 10,
			pageSizes: [10,15,20,25,30],
			buttonCount: 5,
		},
		editable: true,
		edit: function(e){
			var obj = e.container.find("input[name=memo]");
			obj.on('keyup',function(){
				if($(obj).val().length > SYSM433P_memoMaxLength){
					Utils.alert(SYSM433P_memoMaxLength+SYSM433P_langMap.get("SYSM433P.alert01"));
					$(obj).val($(obj).val().substr(0,SYSM433P_memoMaxLength));
					return;
				}
			});
			//e.container.find("input[name=memo]").attr("maxlength", SYSM433P_memoMaxLength);
			$(e.container).find("input[type=text]").select();
		},
		dataBound: function() {
			SYSM433P_grid_fnOnDataBound(1);
		},
		change: function(e) {
			SYSM433P_grid_fnOnChange(e, 1);
		},
		columns: gridColumns2,


	}).data('kendoGrid');

	SYSM433P_grid[1].dataSource.data([]);

	Utils.setKendoGridDoubleClickAction("#SYSM433P_grid1");
}

function SYSM433PGrid() {

	SYSM433P_grid[2].dataSource = new kendo.data.DataSource({
		batch: true,
		pageSize: 10,
		schema: {
			type: "json",
			model: {
				fields: {
					schdNo      	: { field: "schdNo", 	type: "string" },
					regDtm       	: { field: "regDtm", 	type: "string"},
					custId       	: { field: "custId", 	type: "string"},
					custNm     		: { field: "custNm",	type: "string"},
					dpchNo	     	: { field: "dpchNo", 	type: "string"},
					smsStNm     	: { field: "smsStNm", 	type: "string"},
					smsRsltNm    	: { field: "smsRsltNm", type: "string"},
					smsRsltCd    	: { field: "smsRsltCd", type: "string"},
				}
			}
		}
	});

	let gridCustIdTitle2;
	let gridCustNmTitle2;

	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		gridCustIdTitle2 = SYSM433P_langMap.get("SYSM433P.grid2.col2");
		gridCustNmTitle2 = SYSM433P_langMap.get("SYSM433P.grid2.col3");
	} else {
		gridCustIdTitle2 = SYSM433P_langMap.get("SYSM433P.grid2.col2_2");
		gridCustNmTitle2 = SYSM433P_langMap.get("SYSM433P.grid2.col3_2");
	}

	SYSM433P_grid[2].instance = $("#SYSM433P_grid2").kendoGrid({
		dataSource: SYSM433P_grid[2].dataSource,
		noRecords: {
			template: '<div class="nodataMsg"><p>'+SYSM433P_langMap.get("grid.nodatafound")+'</p></div>'
		},
		dataBound: function() {
			SYSM433P_grid_fnOnDataBound(2);
		},
		change: function(e) {
			SYSM433P_grid_fnOnChange(e, 2);
		},
		autoBind: true,
		resizable: true,
		scrollable: true,
		pageable: {
			refresh: false,
			pageSize: 10,
			pageSizes: [10,15,20,25,30],
			buttonCount: 5,
		},
		dataBinding: function () {
			record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
		},
		columns: [
			{
				width : 40,
				field : "No",
				title : "NO",
				template: "#= ++record #"
			},
			{
				width : 130,
				field : "regDtm",
				title : SYSM433P_langMap.get("SYSM433P.grid2.col1"),
				editor : function(container, options) {
					let dateString = kendo.format("{0:yyyy-MM-dd}", new Date(options.model.regDtm));
					let $input = $("<input value=" + dateString+ " />").appendTo(container);

					$input.kendoDatePicker({
						culture : "ko-KR",
						format : "yyyy-MM-dd HH:mm"
					});
				},
				template : '#=kendo.format("{0:yyyy-MM-dd HH:mm}",new Date(regDtm))#',
			},
			{ width : 90, field : "custId", title : gridCustIdTitle2, },
			{ width : 90, field : "custNm", title : gridCustNmTitle2, },
			{ width : 100, field : "dpchNo", title : SYSM433P_langMap.get("SYSM433P.grid2.col4"), },
			{ width : 65, field : "smsStNm", title : SYSM433P_langMap.get("SYSM433P.grid2.col5"), },
			{
				width : 65,
				field : "smsRsltNm",
				title : SYSM433P_langMap.get("SYSM433P.grid2.col6"),
				template : "#if( smsRsltCd == '' || smsRsltCd == null ){#"
					+ "<span></span>"
					+ "#}else{#"
					+ "<span #if(smsRsltCd == '2') {# class='fontRed' #} #>#: smsRsltNm #</span>"
					+ "#}#"
			},
		],
		dataBound: function(e) {
			// iterate the data items and apply row styles where necessary
			var rows = this.items();
			$(rows).each(function () {
				var index = $(this).index() + 1;
				var rowLabel = $(this).find(".row-number");
				$(rowLabel).html(index);
			});
		},
	}).data('kendoGrid');

	SYSM433P_grid[3].dataSource = new kendo.data.DataSource({
		transport: {
			read: function (options) {

				var param = {
					tenantId	: GLOBAL.session.user.tenantId,
					tmplDvCd 	: $('input[id=ComboBoxSYSM433P2]').val(),
					tmplNm		: $('input[id=SYSM433P_TmplNmSerch]').val()
				}

				Utils.ajaxCall("/sysm/SYSM433SEL04", JSON.stringify(param), function (result) {
					options.success(JSON.parse(result.list));
				});
			},

			destroy: function (options) {
				options.success(options.data.models);
			},
		},
		requestStart: function (e) {
			var type = e.type;
			var response = e.response;
		},
		requestEnd: function (e) {
			var type = e.type;
			var response = e.response;

			if (type != "read" && type != "destroy") {
				SYSM433P_fnSearchTmplList();
			}
		},
		batch: true,
		pageSize: 13,
		schema: {
			type: "json",
			model: {
				id:"tmplMgntNo",
				fields: {
					tmplMgntNo      : { field: "tmplMgntNo", 	type: "int" },
					tmplDvCd       	: { field: "tmplDvCd", 		type: "string" },
					tmplNm       	: { field: "tmplNm", 		type: "string" },
					useDvCd     	: { field: "useDvCd", 		type: "string" },
				}
			}
		}
	});

	SYSM433P_grid[3].instance = $("#SYSM433P_grid3").kendoGrid({
		dataSource: SYSM433P_grid[3].dataSource,
		noRecords: {
			template: '<div class="nodataMsg"><p>'+SYSM433P_langMap.get("grid.nodatafound")+'</p></div>'
		},
		dataBound: function() {
			SYSM433P_grid_fnOnDataBound(3);
		},
		change: function(e) {
			SYSM433P_grid_fnOnChange(e, 3);
		},
		autoBind: false,
		scrollable: true,
		selectable: true,
		height: 470,
		pageable: {
			pageSize: 13,
			pageSizes: [13,20,25,30],
			buttonCount: 5,
			//refresh: true,
		},
		columns: [
			{
				width : 35,
				field : "check",
				title : " ",
				template : '<mark class="singleSelect k-icon k-i-radiobutton" onclick="SYSM433P_SMSView(this)"></mark>',
			},
			{
				width : 120,
				field : "tmplMgntNo",
				title : SYSM433P_langMap.get("SYSM433P.grid3.col1"),
			},
			{
				width : 120,
				field : "tmplDvCd",
				title : SYSM433P_langMap.get("SYSM433P.grid3.col2"),
			},
			{
				width : "auto",
				field : "tmplNm",
				title : SYSM433P_langMap.get("SYSM433P.grid3.col3"),
				attributes : {
					"class" : "textEllipsis"
				},
			},
		],
	}).data('kendoGrid');

}

// 코드 셋팅
function SYSM433PCombo() {

	var param = {
		"codeList": [
			{"mgntItemCd":"C0023"},
			{"mgntItemCd":"C0094"},
			{"mgntItemCd":"S0009"},
		]
	};

	Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
		SYSM433P_comCdList = JSON.parse(result.codeList);

		if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {

			if(SYSM433P_IFType == "DB"){
				if(!Utils.isNull(Utils.getUrlParam('recvrTelNo'))){
					Utils.setKendoComboBox(SYSM433P_comCdList, "S0009", "#ComboBoxSYSM433P1",'3',false);
					SYSM433P_fnSearchTop();
				} else {
					Utils.setKendoComboBox(SYSM433P_comCdList, "S0009", "#ComboBoxSYSM433P1",'2',false);
				}
			}
		} else {
			var comboData = {
				tenantId    : GLOBAL.session.user.tenantId
			};

			$.ajax({
				url         : GLOBAL.contextPath + '/cnsl/CNSL160SEL05',
				type        : 'post',
				dataType    : 'json',
				contentType : 'application/json; charset=UTF-8',
				data        : JSON.stringify(comboData),
				success     : function(data){
					let jsonEncode = JSON.stringify(data.CNSL160SEL05);
					let object=JSON.parse(jsonEncode);
					let codeList = JSON.parse(object);
					let dataSource = [];

					dataSource = dataSource.concat(codeList.filter(function (code) {
						code.text = code.mgntItemNm;
						code.value = code.mgntItemCd + '_' + code.voColId + '_' + code.crypTgtYn;
						return code;
					}));

					var allType = {
						text : '전체',
						value : 'all',
					}

					dataSource.unshift(allType);

					let kendoComboBox = $("#ComboBoxSYSM433P1").kendoComboBox({
						dataSource: dataSource,
						dataTextField: "text",
						dataValueField: "value",
						clearButton: false,
						autoWidth: true,
					}).data("kendoComboBox");

					var comboData = $("#ComboBoxSYSM433P1").data("kendoComboBox").dataSource.data();

					if(!Utils.isNull(Utils.getUrlParam('recvrTelNo'))){
						$("#SYSM433P_Search").val(Utils.getUrlParam('recvrTelNo'));

						//kw---20230110 : 기업일 경우 휴대전화번호가 있을 경우 검색 항목을 휴대전화번호로 변경
						$.each(comboData, function(i, item){
							if (item.text.includes(["휴대전화번호"])) {
								$("#ComboBoxSYSM433P1").data("kendoComboBox").select(i);		//kw--- i가 0부터 시작하므로 +1d을 해줌
							}
						});

						SYSM433P_fnSearchTop();
					} else {
						$("#ComboBoxSYSM433P1").data("kendoComboBox").select(0);
					}
				},
				error       : function(request,status, error){
					console.log("[error]");
					console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
				}
			});

		}

		Utils.setKendoComboBox(SYSM433P_comCdList, "C0094", "#ComboBoxSYSM433P2");
		SYSM433P_fnSearchTmplList();

		//전화번호 국가코드 조회
		SYSM433P_CommCodeList = JSON.parse(JSON.parse(JSON.stringify(result.codeList)));

		for(var i=0;i<SYSM433P_CommCodeList.length;i++){
			var mgntItemCd 	= SYSM433P_CommCodeList[i].mgntItemCd;
			var comCd		= SYSM433P_CommCodeList[i].comCd;
			var comCdNm		= SYSM433P_CommCodeList[i].comCdNm;
			var mapgVlu1	= SYSM433P_CommCodeList[i].mapgVlu1;

			if(mgntItemCd == "C0023" && comCd == GLOBAL.session.user.cntyCd){
				SYSM433P_CntyCd = mapgVlu1;
			}
		}
	});

	if(SYSM433P_IFType == "DB"){
		tabSYSM433P_1 = $("#tabSYSM433P_1").kendoTabStrip({
			animation: false,
			scrollable: false,
		}).data("kendoTabStrip");

		tabSYSM433P_1.tabGroup.find('.k-item').css('min-width', '150px');
		tabSYSM433P_1.select(0);
	}


	//   ToolTip
	$("#SYSM433P_grid1").kendoTooltip({
		filter: ".tdTooltip",
		showOn: "mouseenter",			//mouseenter, focus, click
		position: "bottom",
		width: 356,
		/*content: function(e){
			var dataItem = $("#SYSM433P_grid1").data("kendoGrid").dataItem(e.target.closest('tr')),
			content = dataItem.memo;
			return content;
		}, */
	});
}

// 검색어 조회
function SYSM433P_fnSearchTop() {

	var SYSM433P_ComboBoxVal = $("#ComboBoxSYSM433P1").val();

	var SYSM433P_Search = $("#SYSM433P_Search").val();

	if( Utils.isNotNull(SYSM433P_ComboBoxVal) && Utils.isNull(SYSM433P_Search)){
		Utils.alert(SYSM433P_langMap.get("SYSM433P.alert02"));
	}	else{
		SYSM433_fnSendTargetSearch();
	}
}

// 템플릿 조회
function SYSM433P_fnSearchTmplList() {
	SYSM433P_grid[3].instance.clearSelection();

	SYSM433P_grid[3].currentItem = new Object();

	SYSM433P_grid[3].dataSource.read();
	COMPRESS_LIST = []
}

// 두번째 그리드 조회
function SYSM433P_fnSearchMiddleMenuList(nTelNum, nIfYn) {

	if(nIfYn != 'Y'){
		SYSM433P_grid[1].instance.clearSelection();
		SYSM433P_grid[2].instance.clearSelection();
		SYSM433P_grid[1].dataSource.page(1);
		SYSM433P_grid[2].dataSource.page(1);
		
		var selectedItem;

//	    if (obj) {
//	        var tr = $(obj).closest("tr");
//	        selectedItem = SYSM433P_grid[0].instance.dataItem(tr);
	//
//	        SYSM433P_grid[0].instance.clearSelection();
//	        SYSM433P_grid[0].instance.select(tr);
//	    } else {
//	        var grid = $('#SYSM433P_grid0').data('kendoGrid');
//	        	selectedItem = grid.dataItem(grid.select());
//	    }

		var grid = $('#SYSM433P_grid0').data('kendoGrid');
		selectedItem = grid.dataItem(grid.select());

		SYSM433P_grid[1].currentItem = new Object();
		SYSM433P_grid[2].currentItem = new Object();

		SYSM433P_CustId = selectedItem.custId;

		SYSM433P_recvrTelNo = $("#SYSM433P_Receiving").val();

		if(SYSM433P_IFType == "DB"){
			SYSM433P_grid[1].dataSource.read({
				tenantId: GLOBAL.session.user.tenantId,
				custNo: selectedItem.custNo,
				custId: selectedItem.custId,
				"encryptYn" : SYSM433P_encryptYn		//kw---20230503 : 고객정보 복호화 여부 키 추가
			});
		}
		
		SYSM433P_fnSearchSmsSendList(nTelNum);
	}
	
}

function SYSM433P_fnSearchSmsSendList(nTelNum){

	//kw---20240320 : 환자 전화번호를 물고 SMS 팝업을 열었을 경우 발송이력이 전체 검색되는 버그 수정
	if(Utils.isNull(nTelNum)){
		return;
	}

	var param = {
		tenantId: GLOBAL.session.user.tenantId,
		recvrTelNo : nTelNum,
		"encryptYn" : SYSM433P_encryptYn,		//kw---20230503 : 고객정보 복호화 여부 키 추가
//	        custId: SYSM433P_CustId,
	}
	Utils.ajaxCall("/sysm/SYSM433SEL03", JSON.stringify(param), function (result) {
		var patApptInfo = result.list;
		SYSM433P_grid[2].dataSource.data(patApptInfo);
	});

//kw---20230525 밑에 주석은 발송이력 조회시 IF/DB 구분
//	//kw--- 발송조회
//    var tenantId = GLOBAL.session.user.tenantId;
//
//    //kw---20230511 : 고객정보 경로가 DB일 경우
//	if(SYSM433P_IFType == "DB"){
//		var param = {
//				tenantId: GLOBAL.session.user.tenantId,
//    	        custId: SYSM433P_CustId
//		}
//		Utils.ajaxCall("/sysm/SYSM433SEL03", JSON.stringify(param), function (result) {
//	    	var patApptInfo = JSON.parse(result.list);
//	    	SYSM433P_grid[2].dataSource.data(patApptInfo);
//	    });
//	} else {	//kw---20230511 : 고객정보 경로가 IF일 경우
//
//		let ifYn = false;		//kw---20230511 : 인터페이스가 정의 되지 않은 테넌트가 넘어 올 수 있으니
//		let param, info, body;
//
//		info = {
// 				tenantId: tenantId,
// 				unfyCntcHistNo: 0,
// 				usrId: GLOBAL.session.user.usrId
// 		};
//
//		if(tenantId == "YJI"){		//양지일 경우
//			body = {
//	 				IN_SMS_RECEIVER_TELNO		: SYSM433P_recvrTelNo,
//	 				IN_PATNO 					: SYSM433P_CustId,
//	 				IN_STARTDATE 				: "1980-01-01",
//	 				IN_ENDDATE 					: "3000-12-31",
//	 		};
//
//	 		ifYn = true;
//		} else if(tenantId == "CMH"){		//CMH 일 경우
//			let patPhone = SYSM433P_recvrTelNo;
//
//			body = {
//	 				sendDtFrom : "19800101",
//	 				sendDtTo : "30001231",
//	 				smsRecvTel : SYSM433P_recvrTelNo
//			}
//
//	 		ifYn = true;
//		}
//
//
//		if(ifYn == true){
//			//kw---20230511 : paramInfo 데이터가 있다면 환자정보를 통해 SMS 팝업을 생성한 단계
//	 		if(!Utils.isNull(paramInfo)){
//	 			param = paramInfo;			//kw---20230511 : 첫 조회시에만 파라미터로 넘어온 데이터로 조회
//	 		} else {
//	 			param = {					//kw---20230511 : paramInfo 데이터가 없다면 환장정보를 전달 받은게 없거나 또는 환자 정보 통해서 SMS 팝업을 실행 했지만 2번째 조회일 경우
//		 				info: info,
//		 				body: body
//		 		}
//	 		}
//
//	 		//kw---20230511 : SMS 발송 조회
//	 		Utils.ajaxCall('/sysm/SYSM433SEL07', JSON.stringify(param), function (data) {
//	 			var patApptInfo = JSON.parse(data.result);
//	 			if(patApptInfo != null){
//	 				//kw---20230511 : page4로 이동 후 page 1개 밖에 없는 데이터를 넣으면 데이터 표출이 안됨(page4에서 머무르고 있음)
//	 				SYSM433P_grid[2].dataSource.data(patApptInfo.ResultData);
//
//	 			}
//
//	 		});
//		}
//
//	}
}

function SYSM433P_grid_fnOnDataBound(gridIndex) {
	$("#SYSM433P_grid" + gridIndex + " tbody").off("click").on("click", "td", function(e) {
		var $row = $(this).closest("tr");
		var $cell = $(this).closest("td");
		SYSM433P_grid[gridIndex].currentItem = SYSM433P_grid[gridIndex].instance.dataItem($row);
		SYSM433P_grid[gridIndex].currentCellIndex = $cell.index();

		SYSM433P_grid[1].record = 0;
		SYSM433P_grid[2].record = 0;
	});
	$("#SYSM433P_grid0 tbody").off("click").on("click", "td", function(e) {

//    	SYSM433P_fnSearchMiddleMenuList(this);
		SYSM433P_grid[1].record = 0;
		SYSM433P_grid[2].record = 0;

		SYSM433P_CustId = "";
		SYSM433P_CustNm = "";
		$("#SYSM433P_Receiving").val('');
		$("#SYSM433P_Receiving").css("font-size", "11px");
	});

	$("#SYSM433P_grid3 tbody").off("click").on("click", "td", function(e) {
		SYSM433P_SMSView(this);
	});
}

function SYSM433P_grid_fnOnChange(e, gridIndex) {
	var rows = e.sender.select(),
		items = [];

	rows.each(function(e) {
		var dataItem = SYSM433P_grid[gridIndex].instance.dataItem(this);
		items.push(dataItem);
	});
	SYSM433P_grid[gridIndex].selectedItems = items;

	if(!Utils.isNull(items)){
		if(gridIndex == 0){

			let arrGrid1 = [];

			$.each(SYSM433P_grid[gridIndex].selectedItems[0].all, function (index, item) {
				let objItem = {};
				let telNum = '';
				let telNm = '';

				if(!Utils.isNull(item["N0132"])){
					telNum = item["N0132"];
				}

				if(!Utils.isNull(item["T0006"])){
					telNm = item["T0006"];
				}

				if(!Utils.isNull(telNum)){
					objItem = {
						custItemDataVlu 	: telNum,
						memo 				: telNm,
					}

					arrGrid1.push(objItem);
				}



			});

			SYSM433P_grid[1].dataSource.data(arrGrid1);
		}
	}

};

// 템플릿 클릭 시
function SYSM433P_SMSView( obj ) {

//	if(SYSM433P_UerNm == null || SYSM433P_UerNm == ""){
//		Utils.alert(SYSM433P_langMap.get("SYSM433P.alert03"));
//		return;
//    }else {

	var selectedItem;
	if (obj) {
		var tr = $(obj).closest("tr");
		selectedItem = SYSM433P_grid[3].instance.dataItem(tr);

		SYSM433P_grid[3].instance.clearSelection();
		SYSM433P_grid[3].instance.select(tr);
	} else {
		selectedItem = SYSM433P_grid[3].currentItem;
	}

	SYSM433P_TmplMgntNo = selectedItem.tmplMgntNo

	var SYSM433P_SMSViewParam = {
		tenantId: GLOBAL.session.user.tenantId,
		tmplMgntNo: SYSM433P_TmplMgntNo
	}

	Utils.ajaxCall("/sysm/SYSM433SEL05", JSON.stringify(SYSM433P_SMSViewParam), function (result) {

		var SYSM433P_SMSViewJSON = JSON.parse(result.list);
		var SMSViewHtml = "";

		for( i=0; i<SYSM433P_SMSViewJSON.length; i++){

			if( SYSM433P_SMSViewJSON[i].itemDvCd == 4 ){
				SMSViewHtml += "$" + SYSM433P_SMSViewJSON[i].itemCdDataNm + "$";
			}else if( SYSM433P_SMSViewJSON[i].itemDvCd == 1 || SYSM433P_SMSViewJSON[i].itemDvCd == 2 || SYSM433P_SMSViewJSON[i].itemDvCd == 5 ){
				SMSViewHtml += SYSM433P_SMSViewJSON[i].itemCdDataNm + " ";
			}

			if( SYSM433P_SMSViewJSON[i].itemDvCd == 5 ){
				SMSViewHtml +=  SYSM433P_SMSViewJSON[i].url;
			}

			if(SYSM433P_SMSViewJSON[i].itemDvCd == 3){
//						if(Utils.isNull(SYSM433P_UerNm) != true && Utils.isNull(SYSM433P_CustId) != true){
//							if(SYSM433P_SMSViewJSON[i].itemCd == "DB001"){
//								SMSViewHtml += "(" + SYSM433P_CustId + ")";
//							}else{
//								SMSViewHtml += SYSM433P_UerNm;
//							}
//						} else {
				if(SYSM433P_SMSViewJSON[i].itemCd == "DB001"){
					//SMSViewHtml += "(" + SYSM433P_CustId + ")";
					SMSViewHtml += "($"+SYSM433P_SMSViewJSON[i].dataSetItemGrpId+"$)";
				}
				if(SYSM433P_SMSViewJSON[i].itemCd == "DB002"){
					SMSViewHtml += "$"+SYSM433P_SMSViewJSON[i].dataSetItemGrpId+"$";
				}
//						}
			}

			if( SYSM433P_SMSViewJSON[i].lineGap == 0 ){
				SMSViewHtml += " ";
			}

			if( SYSM433P_SMSViewJSON[i].lineGap == 1 ){
				SMSViewHtml += "\n";
			}

			if( SYSM433P_SMSViewJSON[i].lineGap == 2 ){
				SMSViewHtml += "\n\n";
			}

			if( SYSM433P_SMSViewJSON[i].lineGap == 3 ){
				SMSViewHtml += "\n\n\n";
			}
		}

		//전역변수 등록
		SYSM433P_SMSViewHtml = SMSViewHtml;

		if(Utils.isNull(SYSM433P_SMSViewHtml) != true && Utils.isNull(SYSM433P_UerNm) != true && Utils.isNull(SYSM433P_CustId) != true){
			//var SMSViewHtml = SYSM433P_SMSViewHtml;

			if(SMSViewHtml.indexOf("$custNm$") > -1){
				SMSViewHtml = SMSViewHtml.replace("$custNm$",SYSM433P_CustNm);
				$("#SYSM433P_SMSViewDisp").val(SMSViewHtml);
			}
			if(SMSViewHtml.indexOf("$custId$") > -1 ){
				SMSViewHtml = SMSViewHtml.replace("$custId$",SYSM433P_CustId);
				$("#SYSM433P_SMSViewDisp").val(SMSViewHtml);
			}
		}

		//문자 길이 체크
		if(SYSM433P_fnGetbyte(SMSViewHtml) > SYSM433P_smsMaxByte){
			Utils.alert(SYSM433P_smsMaxByte + SYSM433P_langMap.get("SYSM433P.alert04"));
			return;
		}

		$("#SYSM433P_SMSViewDisp").val('');
		$("#SYSM433P_SMSViewDisp").val(SMSViewHtml);

		//길이수 표출
		SYSM433P_fnChangeByte("#SYSM433P_SMSViewDisp");

		SYSM433P_fnfileList(result.files);
	});
	//}
}

// 새로쓰기 버튼 클릭 시
function SYSM433P_Reset() {
	$("#SYSM433P_SMSViewDisp").val('');
	$("#SYSM433P_Receiving").val('');
	$("#SYSM433P_Number").val(SYSM443P_smsSndgNo);

	//kw---20240328 : 새로쓰기 버튼 클릭시 첨부파일도 삭제
	SYSM433P_tmplFiles = [];

	for(var i=1; i<=3; i++){
		$( "#SYSM433P_btnUpLoadFile" + i ).html(SYSM433P_langMap.get("SYSM433P.fileBtnUp"));
		$( "#SYSM433P_inputFileName" + i).val("");
		$("#SYSM433P_inputUpLoadFile" + i).val("");
	}

	SYSM433P_grid[3].instance.clearSelection();
}

//kw---20240124 : 기업용 추가 - 휴대전화번호 클릭시
function SYSM433P_SetReceivingInfoCpny(obj, nMblNum, nCustNm){

	event.stopPropagation();

	var selectedItem;
	if (obj) {
		var tr = $(obj).closest("tr");
		selectedItem = SYSM433P_grid[0].instance.dataItem(tr);
		SYSM433P_grid[0].instance.select(tr);
	} else {
		selectedItem = SYSM433P_grid[0].currentItem;
	}

	SYSM433P_UerNm 			= selectedItem[grdSYSM433P_custNm];
	SYSM433P_CustId 		= selectedItem[grdSYSM433P_custId];
	SYSM433P_CustNm 		=  selectedItem[grdSYSM433P_custNm];

	if($(".calladdPop").hasClass("active")){
		SYSM433_fnReceivBtnCallListPut(nMblNum, nCustNm, SYSM433P_CustId);
	} else {
		$("#SYSM433P_Receiving").css("font-size", "14px");
		SYSM433P_selectNm = nCustNm;
		SYSM433P_selectId = SYSM433P_CustId;
		$("#SYSM433P_Receiving").val(nMblNum);
	}

	SYSM433P_fnSearchSmsSendList(nMblNum);
}

// 그리드내 선택 번호 선택 시
function SYSM433P_SetReceivingInfo( obj ) {
	event.stopPropagation();

	var selectedItem;
	if (obj) {
		var tr = $(obj).closest("tr");
		selectedItem = SYSM433P_grid[0].instance.dataItem(tr);
		SYSM433P_grid[0].instance.clearSelection();
		SYSM433P_grid[0].instance.select(tr);
	} else {
		selectedItem = SYSM433P_grid[0].currentItem;
	}

	SYSM433P_UerNm 			= selectedItem.custNm;
	SYSM433P_CustId 		= selectedItem.custId;
	SYSM433P_CustNm 		= selectedItem.custNm;

	SYSM433P_custRcgnPathCd = selectedItem.custIdPathCd;
	SYSM433P_custRcgnCd	 	= '2';					 		//고객식별코드 : T_고객정보에 해당 항목 추가시 까지 고정
	SYSM433P_recvrTelCntyCd = SYSM433P_CntyCd;				//수신자전화국가코드
	SYSM433P_gndrCd 		= selectedItem.gndrCd;
	SYSM433P_recvrTelNo 	= selectedItem.mbleTelNo;
	SYSM443P_btdt			= selectedItem.btdt;
	SYSM443P_cldDv			= selectedItem.cldDv;

	//sms 발송 번호가 없을 경우 사용자 조회에서 함께 조회 한 테넌트 기준정보 설정 (사용여부와 관계 없이 조회)
	if(Utils.isNull(SYSM443P_smsSndgNo) == true){
		SYSM443P_smsSndgNo		= selectedItem.smsSndgNo;
	}

	//치환이 필요할 경우 치환 처리
	if(Utils.isNull(SYSM433P_SMSViewHtml) != true){
		var SMSViewHtml = SYSM433P_SMSViewHtml;

		if(SMSViewHtml.indexOf("$custNm$") > -1){
			SMSViewHtml = SMSViewHtml.replace("$custNm$",SYSM433P_CustNm);
			$("#SYSM433P_SMSViewDisp").val(SMSViewHtml);
		}
		if(SMSViewHtml.indexOf("$custId$") > -1 ){
			SMSViewHtml = SMSViewHtml.replace("$custId$",SYSM433P_CustId);
			$("#SYSM433P_SMSViewDisp").val(SMSViewHtml);
		}
	}
	$("#SYSM433P_Receiving").val(SYSM433P_recvrTelNo);
	$("#SYSM433P_Number").val(SYSM443P_smsSndgNo);

	if($(".calladdPop").hasClass("active")){
		SYSM433_fnReceivBtnCallListPut(selectedItem.mbleTelNo, selectedItem.custNm, selectedItem.custId);
	} else {
		$("#SYSM433P_Receiving").css("font-size", "14px");
		SYSM433P_selectNm = selectedItem.custNm;
		$("#SYSM433P_Receiving").val(selectedItem.mbleTelNo);
	}

	SYSM433P_fnSearchMiddleMenuList(selectedItem.mbleTelNo);


}


//전화번호 선택 버튼
function SYSM433P_ReceivingBtn1( obj ) {

	event.stopPropagation();

	var selectedItem;
	if (obj) {
		var tr = $(obj).closest("tr");
		selectedItem = SYSM433P_grid[0].instance.dataItem(tr);

		SYSM433P_grid[0].instance.clearSelection();
		SYSM433P_grid[0].instance.select(tr);
	} else {
		selectedItem = SYSM433P_grid[0].currentItem;
	}

	SYSM433P_UerNm 			= selectedItem.custNm;
	SYSM433P_CustId 		= selectedItem.custId;
	SYSM433P_CustNm 		= selectedItem.custNm;

	//치환이 필요할 경우 치환 처리
	if(Utils.isNull(SYSM433P_SMSViewHtml) != true){
		var SMSViewHtml = SYSM433P_SMSViewHtml;

		if(SMSViewHtml.indexOf("$custNm$") > -1){
			SMSViewHtml = SMSViewHtml.replace("$custNm$",SYSM433P_CustNm);
			$("#SYSM433P_SMSViewDisp").val(SMSViewHtml);
		}
		if(SMSViewHtml.indexOf("$custId$") > -1 ){
			SMSViewHtml = SMSViewHtml.replace("$custId$",SYSM433P_CustId);
			$("#SYSM433P_SMSViewDisp").val(SMSViewHtml);
		}
	}

	if($(".calladdPop").hasClass("active")){
		SYSM433_fnReceivBtnCallListPut(selectedItem.cntcTelNo, selectedItem.custNm, selectedItem.custId);
	} else {
		$("#SYSM433P_Receiving").css("font-size", "14px");
		SYSM433P_selectNm = selectedItem.custNm;
		$("#SYSM433P_Receiving").val(selectedItem.cntcTelNo);
	}



	SYSM433P_fnSearchMiddleMenuList(selectedItem.cntcTelNo);

}

function SYSM433P_ReceivingBtn2( obj ) {

	var selectedItem;

	if (obj) {
		var tr = $(obj).closest("tr");
		selectedItem = SYSM433P_grid[1].instance.dataItem(tr);

		SYSM433P_grid[1].instance.clearSelection();
		SYSM433P_grid[1].instance.select(tr);
	} else {
		selectedItem = SYSM433P_grid[1].currentItem;
	}

	SYSM433P_UerNm 			= selectedItem.custNm;
	SYSM433P_CustId 		= selectedItem.custId;
	SYSM433P_CustNm 		=  selectedItem.custNm;

	SYSM433P_custRcgnPathCd = selectedItem.custIdPathCd;
	SYSM433P_custRcgnCd	 	= '2';					 		//고객식별코드 : T_고객정보에 해당 항목 추가시 까지 고정
	SYSM433P_gndrCd 		= selectedItem.gndrCd;
	SYSM433P_recvrTelCntyCd = SYSM433P_CntyCd;				//'82'; //수신자전화국가코드 : T_고객정보에 해당 항목 추가시 까지 고정
	SYSM433P_recvrTelNo 	= selectedItem.mbleTelNo;
	SYSM443P_btdt			= selectedItem.btdt;

	//치환이 필요할 경우 치환 처리
	if(Utils.isNull(SYSM433P_SMSViewHtml) != true){
		var SMSViewHtml = SYSM433P_SMSViewHtml;

		if(SMSViewHtml.indexOf("$custNm$") > -1){
			SMSViewHtml = SMSViewHtml.replace("$custNm$",SYSM433P_CustNm);
			$("#SYSM433P_SMSViewDisp").val(SMSViewHtml);
		}
		if(SMSViewHtml.indexOf("$custId$") > -1 ){
			SMSViewHtml = SMSViewHtml.replace("$custId$",SYSM433P_CustId);
			$("#SYSM433P_SMSViewDisp").val(SMSViewHtml);
		}
	}

	var selectedItem_grid0 = SYSM433P_grid[0].selectedItems;
	let SYSM433P_usrNmGrid0 = '';
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		SYSM433P_usrNmGrid0 = selectedItem.SYSM433P_usrNmGrid0;
	} else {
		SYSM433P_usrNmGrid0 = selectedItem_grid0[0][grdSYSM433P_custNm];
		SYSM433P_fnSearchSmsSendList(selectedItem.custItemDataVlu);
	}

	if($(".calladdPop").hasClass("active")){
		SYSM433_fnReceivBtnCallListPut(selectedItem.custItemDataVlu, SYSM433P_usrNmGrid0, SYSM433P_CustId);
	} else {
		$("#SYSM433P_Receiving").css("font-size", "14px");
		SYSM433P_selectNm = SYSM433P_usrNmGrid0;
		$("#SYSM433P_Receiving").val(selectedItem.custItemDataVlu);
	}
}

// 사용여부 체크
function fncommon4(obj) {
	let tr = $(obj).closest("tr");
	let dataItem = SYSM433P_grid[1].instance.dataItem(tr);
	let checked = $(obj).is(":checked");

	dataItem.set("common4", checked ? "Y" : "N");
}

// 저장 버튼 클릭 시
function SYSM433P_fnSaveMemo() {

	Utils.confirm(SYSM433P_langMap.get("SYSM433P.confirm.msg"),function(){

		var dataItem = SYSM433P_grid[1].dataSource.data();
		var SYSM433P_updateRows = new Array();

		var SYSM433P_grid1 = $("#SYSM433P_grid1").data("kendoGrid");

		$.each(SYSM433P_grid1.dataSource.data(), function (index, item) {
			var params = {
				tenantId  		: item.tenantId,
				custNo 			: item.custNo,
				custItemGrpNo 	: item.custItemGrpNo,
				custItemNo 		: item.custItemNo,
				rowNo			: item.rowNo,
				memo 			: item.memo,
				lstCorprId		: GLOBAL.session.user.usrId,
			}

			//업데이트 된 row만 처리
			if(item.dirty){
				SYSM433P_updateRows.push(params);
			}
		});

		//수정건이 있을 경우만 업데이트
		if(SYSM433P_updateRows.length > 0  ){

			Utils.ajaxCall("/sysm/SYSM433UPT01", JSON.stringify({
				list: SYSM433P_updateRows
			}), function (result) {
				Utils.alert(SYSM433P_langMap.get("SYSM433P.alert05"))
				SYSM433P_fnSearchMiddleMenuList();
				SYSM433P_grid[1].record = 0;
			});

		}
	});
}

// 발신번호 선택 버튼 클릭 시
function SYSM433P_Popup(data) {

	let param = {
		vrbsClasCd:"1",
		callbackKey: "callbackKey_SYSM433P"
	};
	let callbackKey_SYSM433P = function(result) {

		$("#SYSM433P_Number").val(result.vrbsVlu);

	};
	Utils.setCallbackFunction("callbackKey_SYSM433P", callbackKey_SYSM433P );
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM431P", "SYSM431P", 910, 610, param );

}


//전화번호 검증
function SYSM433P_fnCheckPhoneNumber(str){
	//var phoneNumberRegex = /[^0123456789-]/g;
	return /[^-0-9-]/g.test(str);
}


// 보내기 버튼 클릭 시
function SYSM433P_Send() {

	var fileFullPath = [];
	var filePath = [];
	var fileNameOrg = [];
	var fileNameSave = [];
	var formData = new FormData();

	for(var i=1; i<=3; i++){
		if ( $("#SYSM433P_inputFileName" + i).val() != "" && $("#SYSM433P_inputFileName" + i).val() != null){
			var inputFile = $("#SYSM433P_inputUpLoadFile" + i );
			var findIndex =  COMPRESS_LIST.findIndex(file => file.idNum == i)
			var file
			if(findIndex != -1){
				file = COMPRESS_LIST[findIndex].file
			}else{
				file =  inputFile[0].files[0]
			}
			formData.append('img_files', file);
			console.log(":::: kw TEST ");
			console.log(":::: kw TEST ");
			console.log(":::: kw TEST ");
			console.log(file)
		}

	}

	formData.append('COMM100INS01_data',JSON.stringify({
		tenantId : GLOBAL.session.user.tenantId
		, UsrId : GLOBAL.session.user.user
		, orgCd : GLOBAL.session.user.orgCd
		, uploadPath : "MMS_IMG"
		, tmplFiles : SYSM433P_tmplFiles
		, tmplMgntNo : SYSM433P_TmplMgntNo
	}));

	var newFormData = new FormData();   //Object정보를 담을 새로운 formData

	var SYSM433P_Receiving_val 		= $("#SYSM433P_Receiving").val();
	var SYSM433P_Number_val 		= $("#SYSM433P_Number").val();
	var SYSM433P_SMSViewDisp_val 	= $("#SYSM433P_SMSViewDisp").val();


	if(Utils.isNull(SYSM433P_Receiving_val)){

		Utils.alert(SYSM433P_langMap.get("SYSM433P.alert11"));

//	} else if (SYSM433P_fnCheckPhoneNumber(SYSM433P_Receiving_val)){

//		Utils.alert(SYSM433P_langMap.get("SYSM433P.alert12"));

	}else if(Utils.isNull(SYSM433P_Number_val)){

		Utils.alert(SYSM433P_langMap.get("SYSM433P.alert06"));

	}else if(SYSM433P_fnCheckPhoneNumber(SYSM433P_Number_val)){

		Utils.alert(SYSM433P_langMap.get("SYSM433P.alert13"));

	}else if(Utils.isNull(SYSM433P_SMSViewDisp_val)){

		Utils.alert(SYSM433P_langMap.get("SYSM433P.alert07"));

//	} else if(SYSM433P_grid[3].instance.select().index() == -1){

//		Utils.alert(SYSM433P_langMap.get("SYSM433P.alert07"));

	}else{
		var receivNumArr = $("#SYSM433P_Receiving").val().split(',');

		for(var k=0; k<receivNumArr.length; k++){
			if("010" != receivNumArr[k].substr(0, 3)){
				Utils.alert((k+1) + "번째 " + SYSM433P_langMap.get("SYSM433P.alert12"));
				return;
			} else {
				if(receivNumArr[k].length != 11 && receivNumArr[k].length != 10){
					Utils.alert((k+1) + "번째 " + SYSM433P_langMap.get("SYSM433P.alert12"));
					return;
				}
			}
		}
		//치환이 필요할 경우 치환 처리
		if(Utils.isNull(SYSM433P_SMSViewHtml) != true){
			var SMSViewHtml = SYSM433P_SMSViewHtml;

			if(SMSViewHtml.indexOf("$custNm$") > -1){
				SMSViewHtml = SMSViewHtml.replace("$custNm$",SYSM433P_CustNm);
				$("#SYSM433P_SMSViewDisp").val(SMSViewHtml);
			}
			if(SMSViewHtml.indexOf("$custId$") > -1 ){
				SMSViewHtml = SMSViewHtml.replace("$custId$",SYSM433P_CustId);
				$("#SYSM433P_SMSViewDisp").val(SMSViewHtml);
			}
		}
		if( SYSM433P_fnGetbyte(SYSM433P_SMSViewDisp_val) > SYSM433P_smsMaxByte){
			Utils.alert(SYSM433P_smsMaxByte + SYSM433P_langMap.get("SYSM433P.alert08"));
			return;
		}


		Utils.ajaxCallFormData('/comm/COMM100INS01',formData,function(data){
			let fileSaveData = JSON.parse(data.info);

			for(var i=0; i<fileSaveData.length; i++){
				fileNameOrg[i] 	= fileSaveData[i].apndFileNm;
				fileNameSave[i] = fileSaveData[i].apndFileIdxNm;
				filePath[i] = fileSaveData[i].apndFilePsn;
				fileFullPath[i] 	= fileSaveData[i].apndFilePsn + "/" + fileSaveData[i].apndFileIdxNm;
			}

			SYSM433P_fileNameOrg = fileNameOrg;
			SYSM433P_fileNameSave = fileNameSave;
			SYSM433P_filePath = filePath;

			var SYSM433P_SendParam = {
				//테스트
				//tenantPrefix : "DMO",
				//sysPrefix	: "BONA",
				tenantPrefix 	: GLOBAL.session.user.tenantId,	//운영 적용시 session 정보를 사용한다.
				sysPrefix		: SYSM443P_cldDv,
				phone 			: SYSM433P_Receiving_val,
				phoneArr		: receivNumArr,
				tmplMgntNo		: SYSM433P_TmplMgntNo,
				msg 			: SYSM433P_SMSViewDisp_val,
				callback		: SYSM433P_Number_val,
				agentId 		: GLOBAL.session.user.usrId,
				customerId 		: SYSM433P_CustId,
				custId 			: SYSM433P_CustId,
				custNm 			: SYSM433P_CustNm,
				cldDv			: SYSM443P_cldDv,
				filePath		: fileFullPath
			}
			Utils.ajaxCall("/sysm/SYSM433SMS01", JSON.stringify(SYSM433P_SendParam), function (result) {
				var SYSM433P_Result = JSON.parse(result.result);

				if(SYSM433P_Result.Result == "1"){

					SYSM433P_smsStCd 	= "3";
					SYSM433P_smsRsltCd 	= SYSM433P_Result.smsId;


					//kw--- 20230413 : 수신 번호 직접 입력시 서비스에서 수신번호가 null로 처리됨
					//그리드에서 선택했을 경우만 해당 변수에 수신번호가 들어가므로 문자 전송 성공시 해당 변수에 수신 번호 넣기
					SYSM433P_recvrTelNo = $("#SYSM433P_Receiving").val();

					SYSM433P_SendSuccess();

					//kw---20240329 : SMS 단건 보내기 - SMS 보내기 성공 시 이미지 첨부파일 초기화
					SYSM433P_tmplFiles = [];

					for(var i=1; i<=3; i++){
						$( "#SYSM433P_btnUpLoadFile" + i ).html(SYSM433P_langMap.get("SYSM433P.fileBtnUp"));
						$( "#SYSM433P_inputFileName" + i).val("");

						$("#SYSM433P_inputUpLoadFile" + i).val("");
					}

					SYSM433P_grid[3].instance.clearSelection();

				}else{
					//실패 메시지와 함께 SMS SERVER API 응답 메시지 표출
					Utils.alert(SYSM433P_langMap.get("SYSM433P.alert09")+"<br/>[ " +SYSM433P_Result.smsId+ " ]");
				}
			});
		});


	}
	COMPRESS_LIST = []
}

// 글자수 표시
function SYSM433P_fnChangeByte(obj){

	//kw---20230418 : SMS일 경우 max는 90byte라고 표출해주기 위한 수정 - 수정전 max는 타입과 상관없이 2000byte로 표출
	let text = "";

	if($("#SYSM433P_inputFileName1").val() != "" || $("#SYSM433P_inputFileName2").val() != "" || $("#SYSM433P_inputFileName3").val() != ""){
		SYSM433P_smsType = "MMS"
		text = SYSM433P_fnGetbyte($(obj).val()) + "/" + SYSM433P_smsMaxByte + "byte (" + SYSM433P_smsType + ")  ";
	} else if ( SYSM433P_fnGetbyte($(obj).val()) > 90 ) {
		SYSM433P_smsType = "LMS"
		text = SYSM433P_fnGetbyte($(obj).val()) + "/" + SYSM433P_smsMaxByte + "byte (" + SYSM433P_smsType + ")  ";
	} else {
		SYSM433P_smsType = "SMS"
		text = SYSM433P_fnGetbyte($(obj).val()) + "/90byte (" + SYSM433P_smsType + ")  ";
	}


	$("#SYSM433P_SMSViewCounter").text(text);
}

// 글자수 체크 : 한글을 3byte로 계산
function SYSM433P_fnGetbyte(str){
	return stringByteLength = str.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g,"$&$1$2").length;
}


// 발송이력 인서트
function SYSM433P_SendSuccess() {

	var SYSM433P_today = new Date();

	var SYSM433P_year = SYSM433P_today.getFullYear();
	var SYSM433P_month = ('0' + (SYSM433P_today.getMonth() + 1)).slice(-2);
	var SYSM433P_day = ('0' + SYSM433P_today.getDate()).slice(-2);

	var SYSM433P_Hours = SYSM433P_today.getHours();
	var SYSM433P_Min = SYSM433P_today.getMinutes();
	var SYSM433P_Sec = SYSM433P_today.getSeconds();

	var SYSM433P_date = SYSM433P_year + SYSM433P_month + SYSM433P_day;
	var SYSM433P_time = SYSM433P_Hours.toString() + SYSM433P_Min.toString() + SYSM433P_Sec.toString();

	var resultArr = new Array();


	var dbInsertNumArr = [];
	var dbInsertNameArr = [];
	var dbInsertIdArr = [];

	var receivNumArr = $("#SYSM433P_Receiving").val().split(',');

	var trCount = $("#SYSM433P_callListTBody tr").length;

	if(receivNumArr.length > 1){
		for(var i=0; i<receivNumArr.length; i++){

			dbInsertNumArr = receivNumArr[i];

			for(var k=0; k<SYSM433P_callListNum.length; k++){

				if(receivNumArr[i] == SYSM433P_callListNum[k]){
					dbInsertNameArr[i] 	= SYSM433p_callListNm[k];
					dbInsertIdArr[i]	= SYSM433p_callListId[k];
					break;
				} else {
					dbInsertNameArr[i] = "";
				}
			}
		}

	} else {
		//kw---20240320 : custId 추가
		dbInsertIdArr.push(SYSM433P_CustId);
		dbInsertNumArr.push(receivNumArr[0]);
		dbInsertNameArr.push(SYSM433P_UerNm);


	}

	for(var i=0; i<receivNumArr.length; i++){
		var SYSM433P_SuccessParam = {
			tenantId		: GLOBAL.session.user.tenantId,
			regDt			: SYSM433P_date,
			tmplMgntNo		: SYSM433P_TmplMgntNo,
			custRcgnPathCd 	: SYSM433P_custRcgnPathCd,
			custRcgnCd 		: SYSM433P_custRcgnCd,
			custId			: dbInsertIdArr[i],						//kw---20240320 : custId 추가
			custNm			: dbInsertNameArr[i],
			btdt			: SYSM443P_btdt,
			gndrCd 			: SYSM433P_gndrCd,
			recvrTelCntyCd 	: SYSM433P_recvrTelCntyCd,
			recvrTelNo 		: receivNumArr[i],
			dpchNo			: $("#SYSM433P_Number").val(),
			sndgCtt			: $("#SYSM433P_SMSViewDisp").val(),
			sndgCpltTm		: SYSM433P_time,
			smsStCd			: SYSM433P_smsStCd,
			smsSndgRsltKey	: SYSM433P_smsRsltCd,
			regrId			: GLOBAL.session.user.usrId,
			regrOrgCd		: GLOBAL.session.user.orgCd,
			lstCorprId		: GLOBAL.session.user.usrId,
			lstCorprOrgCd	: GLOBAL.session.user.orgCd,
			fileNameOrg		: SYSM433P_fileNameOrg,
			fileNameSave	: SYSM433P_fileNameSave,
			filePath		: SYSM433P_filePath,
		}

		resultArr.push(SYSM433P_SuccessParam)
	}



	Utils.ajaxCall("/sysm/SYSM433INS01", JSON.stringify({
		list: resultArr
	}), function (result) {
		Utils.alert(SYSM433P_langMap.get("SYSM433P.alert10"));

		$("#SYSM433P_SMSViewDisp").val('');
		$("#SYSM433P_Receiving").val('');

		SYSM433P_fnChangeByte("#SYSM433P_SMSViewDisp");
		SYSM433P_fnSearchSmsSendList()
	});
}

//kw---20230410 : SMS 첨부 파일
function SYSM433P_fnUploadFileClick(nId){
	var idNum = nId.slice(-1);

	//20240215 : SMS 템플릿 이미지 불러오기 관려 기능 추가
	let prop = document.getElementById(nId).getAttribute("prop");

	if( $( "#SYSM433P_btnUpLoadFile" + idNum ).html() == SYSM433P_langMap.get("SYSM433P.fileBtnUp")){

		$( "#SYSM433P_inputUpLoadFile" + idNum ).click();
	} else {
		Utils.confirm(SYSM433P_langMap.get("SYSM433P.fileDelConfMsg"), function () {
			$( "#SYSM433P_btnUpLoadFile" + idNum ).html(SYSM433P_langMap.get("SYSM433P.fileBtnUp"));
			$( "#SYSM433P_inputFileName" + idNum).val("");

			$("#SYSM433P_inputUpLoadFile" + idNum).val("");

			SYSM433P_fnChangeByte("#SYSM433P_SMSViewDisp");

			//20240215 : SMS 템플릿 이미지 불러오기 관려 기능 추가
			for(let i = 0; i < SYSM433P_tmplFiles.length; i++) {
				if(SYSM433P_tmplFiles[i] == prop)  {
					SYSM433P_tmplFiles.splice(i, 1);
					i--;
				}
			}

			//kw---20240326 : SMS 탬플릿 관리 - 미리보기시 이미지 파일도 보이게 추가
			SYSM433P_smsTmplFileInfo[idNum-1] = "";
		});

	}

}

async function SYSM433P_fnUpLoadFile(input, nId){

	var idNum = nId.slice(-1);

	let tmpPath = URL.createObjectURL(input.files[0]);

	if(input.files && input.files[0]){
		var fileSize = input.files[0].size;
		if(fileSize > MAX_SIZE){
			Utils.alert("첨부 이미지의 용량을 초과하여 이미지 용량이 자동 변경됩니다.")
			var file = await Utils.getCompressImage(input.files[0] , MAX_SIZE , input.files[0].name);

			// 같은 값이 있는지 확인
			const findIndex = COMPRESS_LIST.findIndex(file => file.idNum ==idNum);
			// 같은 값이 있다면 해당 객체를 대체
			if (findIndex !== -1) {
				COMPRESS_LIST[findIndex] = {idNum : idNum , file : file };
			} else {
				// 같은 값이 없다면 배열에 추가
				COMPRESS_LIST.push({idNum : idNum , file : file });
			}
		}

		$( "#SYSM433P_btnUpLoadFile" + idNum ).html(SYSM433P_langMap.get("SYSM433P.fileBtnDel"));
		$( "#SYSM433P_inputFileName" + idNum ).val(input.files[0].name);

		SYSM433P_fnChangeByte("#SYSM433P_SMSViewDisp");
	}
}

$(window).resize(function(){
	SYSM433P_GridResize();
});

//Grid   Height  체크
function SYSM433P_GridResize() {

	if(SYSM433P_IFType == "DB"){
		let screenHeight = $(window).height()-220;

		if(screenHeight > 740){
			SYSM433P_grid[0].instance.element.find('.k-grid-content').css('height', screenHeight-650);
			SYSM433P_grid[1].instance.element.find('.k-grid-content').css('height', screenHeight-650);
			SYSM433P_grid[2].instance.element.find('.k-grid-content').css('height', screenHeight-650);
		} else {
			SYSM433P_grid[0].instance.element.find('.k-grid-content').css('height', 90);
			SYSM433P_grid[1].instance.element.find('.k-grid-content').css('height', 90);
			SYSM433P_grid[2].instance.element.find('.k-grid-content').css('height', 90);
		}
	}


};

// 미리보기 영역에 템플릿에 등록된 첨부파일 목록 표출
function SYSM433P_fnfileList(result) {

	let list = JSON.parse(result);
	let len = $('input[type=file]').length;

	SYSM433P_tmplFiles = [];

	//kw---20240326 : SMS 탬플릿 관리 - 미리보기시 이미지 파일도 보이게 추가
	SYSM433P_smsTmplFileInfo = [];
	COMPRESS_LIST = []

	for(var i=1; i<=len; i++) {
		$("#SYSM433P_inputFileName"+i).val('');
		$("#SYSM433P_btnUpLoadFile"+i).html(SYSM433P_langMap.get("SYSM433P.fileBtnUp"));
	}


	$.each(list, function(index, item) {
		$( "#SYSM433P_btnUpLoadFile" + (index+1) ).html(SYSM433P_langMap.get("SYSM433P.fileBtnDel"));

		$( "#SYSM433P_inputFileName" + (index+1)).val('');
		$( "#SYSM433P_inputFileName" + (index+1)).val(item.orign_file_nm);
		$( "#SYSM433P_btnUpLoadFile" + (index+1)).attr('prop', item.file_id);
		SYSM433P_tmplFiles.push(item.file_id);

		//kw---20240326 : SMS 탬플릿 관리 - 미리보기시 이미지 파일도 보이게 추가
		SYSM433P_smsTmplFileInfo.push(item.upload_file_nm);
	});

}

//kw---20240327 : 첨부파일 마우스 오버시 미리보기 기능 추가
function SYSM433P_showImagePreview(inputFileName, divImg, divImgPreView, index) {
	$(inputFileName).on({
		mouseover: function() {
			if (!Utils.isNull(SYSM433P_smsTmplFileInfo[index])) {
				var imgHtml = '<img src="' + GLOBAL.contextPath + '/mmsimg/' + GLOBAL.session.user.tenantId + '/' + SYSM433P_smsTmplFileInfo[index] + '" style="max-width:100%; max-height:100%; object-fit: cover;"><br>';
				console.log(imgHtml);
				$(divImg).empty().append(imgHtml);
				$(divImgPreView).show();
			}
		},
		mouseout: function() {
			$(divImg).empty();
			$(divImgPreView).hide();
		}
	});
}

//kw---20240523 : 환자정보 그리드 컬럼 추가 옵션
function SYSM433P_fnGridOptionAdd(){
	if(SYSM433P_gridPatGridEmr == true){
		let emrArr = {
			width	: 50,
			field 	: "apiType",
			title	: "EMR",
		}
		SYSM433P_grid[0].instance.columns.push(emrArr);

		var gridCustInfo = SYSM433P_grid[0].instance;
		gridCustInfo.setOptions({ columns: gridCustInfo.columns });
	}
}