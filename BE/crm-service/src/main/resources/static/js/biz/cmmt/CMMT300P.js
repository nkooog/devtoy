/*******************************************************************************
 * 
 * Program Name : CMMT300P.js Creator : bykim Create Date : 2022.07.08
 * Description : 통합게시글 등록 Modify Desc :
 * -----------------------------------------------------------------------------------------------
 * Date | Updater | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.07.08 bykim 최초생성
 * 
 ******************************************************************************/

var CMMT300P_formData = new FormData();
var CMMT300P_editor, CMMT300P_editImg=[];
var CMMT300P_blthgMgntNo, CMMT300P_ctgrMgntNo,CMMT300P_selCtg, CMMT300P_blthgApvNcsyYn, CMMT300P_ctgrUseAthtCd, CMMT300P_alarmUseYnCtgr ;
var CMMT300P_cmmCodeList, CMMT300P_SetText="", CMMT300P_previewImg;
var CMMT300P_fileList=[],  CMMT300P_sizeLimitCnt= 0, CMMT300P_blthgStCd = 0, CMMT300P_cntLimitCnt;
var CMMT300P_totSize  = 0, CMMT300P_totCnt = 0, CMMT300P_imgChng = false, CMMT300P_chkRtn=false;
var CMMT300M_ctgrTypCd;			// kw---20230705 : 게시판 유형을 알기 위함(커뮤니티 일 경우 엘라스틱
								// 상태는 99)
var CMMT300M_sizeLimit = 5242880;

var CMMT300P_apndFilePmssCunt = 0 , CMMT300P_apndFileMaxSz  =0, CMMT300P_apndFileSzUnitCd =0;

var CMMT300P_KldStCd={
		new : 0,
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
var CMMT300P_IndexList = [];


$(document).ready(function () {

	CMMT300P_userInfo = GLOBAL.session.user;

	// 콤보 초기화
	CMMT300P_fnSelectCombo();

	// 에디터 초기화
//	CMMT300P_editor = cEditor.Creater("CMMT300P_editor",100,580,2, CMMT300P_imgUpload);
//	CMMT300P_fnResizeTableCMMT300P();
//	$(window).on({	'resize': function() {	CMMT300P_fnResizeTableCMMT300P();},	});
	CMMT300P_fnSummEdtCreate();
	CMMT300P_fnSummEdtCMMT300P();
	$(window).on({	'resize': function() {	CMMT300P_fnSummEdtCMMT300P();},	});
	
	// 부모창 param setting
	let brdPath = window.opener.CMMT200M_catagoryPath;
	CMMT300P_ctgrMgntNo = Utils.getUrlParam('CMMT300P_ctgrMgntNo');
	
	// 수정 시 상세 조회
	CMMT300P_blthgMgntNo = Utils.getUrlParam('CMMT300P_blthgMgntNo');
	if(!Utils.isNull(CMMT300P_blthgMgntNo)){

		var CMMT300P_data = { tenantId			: CMMT300P_userInfo.tenantId,
							  ctgrMgntNo		: CMMT300P_ctgrMgntNo,
							  blthgMgntNo 		: CMMT300P_blthgMgntNo
		};	

		var CMMT300P_jsonStr = JSON.stringify(CMMT300P_data);
		
		Utils.ajaxCall('/cmmt/CMMT300SEL05', CMMT300P_jsonStr, CMMT300P_callBack);
	}else{
		$('#CMMT300P_regId').val(CMMT300P_userInfo.decUsrNm+" ("+CMMT300P_userInfo.usrId+")")
		
		if(!Utils.isNull(brdPath)) {
			$('#CMMT300P_selCate').val(brdPath);
		}
		
		if(!Utils.isNull(brdPath)){
			let CMMT300P_cateInfo = { tenantId : CMMT300P_userInfo.tenantId , id: CMMT300P_ctgrMgntNo,  ctgrNm : window.opener.CMMT300P_ctgrMgntNm };
			CMMT300P_fnGetAuth(CMMT300P_cateInfo)
			CMMT300P_selCtg = CMMT300P_cateInfo;
		}
		$('#CMMT300P button[name=CMMT300P_fromDt_btn4]').click();
		
		// Button State
		CMMT300P_fnButtonEnableDisable(CMMT300P_blthgStCd);
	}
	
	// kw---20230705 : 게시판 유형을 알기 위함(커뮤니티 일 경우 엘라스틱 상태는 99)
	CMMT300M_ctgrTypCd = Utils.getUrlParam('ctgrTypCd');

	setTimeout(function() {
		$("#CMMT300P .note-codable").on("input", function() {
			$(this)[0].value = Utils.removeXSS($(this)[0].value);
		});
	}, 500);


	CMMT300P_fnSubTotalSize()


	// 이벤트 핸들러 등록
	$("#CMMT300P_fromDt, #CMMT300P_toDt").on('change input', function () {
			let value = $(this).val().replace(/[^0-9]/g, ''); // 숫자만 남기기
			if (value.length > 4) value = value.slice(0, 4) + '-' + value.slice(4); // 연도 뒤에 -
			if (value.length > 7) value = value.slice(0, 7) + '-' + value.slice(7); // 월 뒤에 -
			$(this).val(value.slice(0, 10)); // 최대 10자리로 제한
	});
});

function CMMT300P_imgUpload(obj){
	var newFormData = new FormData();   // Object정보를 담을 새로운 formData

	Object.keys(obj.dataObj).forEach(function(key, index){
		let fileIndex =0;
		if(typeof obj.dataObj[key] == "object"){

			// let check = CMMT300P_editImg.find(file =>
			// file.name.split('_index_')[0] == obj.dataObj[key].name)
			let check = CMMT300P_editImg.map(file => file.name.split('_index_')[0]+"."+file.name.split('.')[1]).lastIndexOf(obj.dataObj[key].name);
			if(check>-1){
				fileIndex= check+1;
			}
			let newFile = new File([obj.dataObj[key]], obj.dataObj[key].name.split('.')[0]+"_index_"+fileIndex+"."+obj.dataObj[key].name.split('.')[1], {type: 'image/png'});
			newFormData.append('img_files', newFile); // Object정보를 formData에
														// 설정
			CMMT300P_editImg.push(newFile)
		}
		if(key=='imagemodify'){
			obj.dataObj[key] =true
		}
	});

	newFormData.append('COMM100INS01_data',JSON.stringify({
		tenantId : GLOBAL.session.user.tenantId
		, UsrId : GLOBAL.session.user.user
		, orgCd : GLOBAL.session.user.orgCd
		, uploadPath : "CMMT_CNTS_TMP"
	}));

	Utils.ajaxCallFormData('/comm/COMM100INS01',newFormData,function(data){
		let item = JSON.parse(JSON.parse(JSON.stringify(data.info)));
		// let url =
		// window.location.href.split("bcs/")[0]+"bcs/cmmtphotocntstmp/"+GLOBAL.session.user.tenantId+"/"+
		// item[0].apndFileIdxNm
		let url = GLOBAL.contextPath+"/cmmtphotocntstmp/"+GLOBAL.session.user.tenantId+"/"+ item[0].apndFileIdxNm
		let result = '{"result":"success","addmsg":[{"editorFrame":"NamoSE_editorframe_'+CMMT300P_editor.editorName+'","imageURL":"'+url+'","imageKind":"image","imageTitle":"'+item[0].apndFileNm+'"}]}';
		obj.complete(result);
	},null,null,null);
}

function CMMT300P_fnResizeTableCMMT300P() {
	let screenHeight = $(window).height()-210;     // (헤더+ 푸터 ) 영역 높이 제외
	$('#CMMT300P_editor').css('height', screenHeight-60);   // 에디터 height
	CMMT300P_editor.SetUISize("", (screenHeight-60));
}

// 공통코드 조회
function CMMT300P_fnSelectCombo(){
	
	let CMMT300P_mgntItemCdList = [
		{"mgntItemCd":"C0064"},
		{"mgntItemCd":"C0084"},
	];
	
	Utils.ajaxCall('/comm/COMM100SEL01',  JSON.stringify({ "codeList": CMMT300P_mgntItemCdList}), CMMT300P_setCombo) 
}

// 콤보 세팅
function CMMT300P_setCombo(data){
	
	let CMMT300P_jsonEncode = JSON.stringify(data.codeList);
	let CMMT300P_object=JSON.parse(CMMT300P_jsonEncode);
	let CMMT300P_jsonDecode = JSON.parse(CMMT300P_object);

	CMMT300P_cmmCodeList = CMMT300P_jsonDecode;
	
	Utils.setKendoComboBox(CMMT300P_cmmCodeList, "C0064", "#CMMT300P_cobTypCd", "2", false) ;
}


// 상세 조회 setting
function CMMT300P_callBack(data){

	var CMMT300P_jsonEncode = JSON.stringify(data.CMMT300VOInfo);
	var CMMT300P_object=JSON.parse(CMMT300P_jsonEncode);
	var CMMT300P_jsonDecode = JSON.parse(CMMT300P_object);

	$('#CMMT300P_regId').val(CMMT300P_jsonDecode.usrNm+" ("+CMMT300P_jsonDecode.regrId+")")

	if(CMMT300P_jsonDecode.bltnTrmStrDd){
		$('#CMMT300P_fromDt').val(CMMT300P_fnDateChage(CMMT300P_jsonDecode.bltnTrmStrDd));
	}
	if(CMMT300P_jsonDecode.bltnTrmEndDd){
		$('#CMMT300P_toDt').val(CMMT300P_fnDateChage(CMMT300P_jsonDecode.bltnTrmEndDd));
	}

	if(CMMT300P_jsonDecode.alrmUseYn=='Y'){
		$('#CMMT300P_alarmYn').prop('checked', true)
	}

	if(CMMT300P_jsonDecode.mbrdDispPmssYn=='Y'){
		$('#CMMT300P_dispYn').prop('checked', true)
	}

	$('#CMMT300P_title').val(CMMT300P_jsonDecode.blthgTite);
	$('#CMMT300P_cobTypCd').data("kendoComboBox").value(CMMT300P_jsonDecode.bltnTypCd)
	$('#CMMT300P_selCate').val(CMMT300P_jsonDecode.brdPath);

	for (let i = 0; i < CMMT300P_cmmCodeList.length; i++) {
		if(CMMT300P_cmmCodeList[i].mgntItemCd == 'C0084' && CMMT300P_cmmCodeList[i].comCd == CMMT300P_jsonDecode.blthgStCd){
		 $('#CMMT300P_blthgStCdNm').val(CMMT300P_cmmCodeList[i].comCdNm)
		}
	}

	// 미리보기 이미지 세팅
	if(!Utils.isNull(CMMT300P_jsonDecode.blthgRpsImgIdxNm)){
		 $('#CMMT300P_imgView').css("display",'block')
		 $('#CMMT300P_figcap').css("display",'none')
		CMMT300P_previewImg = GLOBAL.contextPath+"/cmmtphotoimg/"+ CMMT300P_jsonDecode.tenantId+"/"+ CMMT300P_jsonDecode.blthgRpsImgIdxNm;
		$('#CMMT300P_imgView')[0].src = GLOBAL.contextPath + "/cmmtphotoimg/"+ CMMT300P_jsonDecode.tenantId+"/"+ CMMT300P_jsonDecode.blthgRpsImgIdxNm
	}

	// 반려사유
// if(!Utils.isNull(CMMT300P_jsonDecode.blthgStCd) &&
// (CMMT300P_jsonDecode.blthgStCd == "13" || CMMT300P_jsonDecode.blthgStCd ==
// "16")){
// $('#CMMT300P_apprStRsnCtt').val(CMMT300P_jsonDecode.blthgStRsnCtt)
// }

	// 카테고리 권한 조회
  CMMT300P_blthgStCd = CMMT300P_jsonDecode.blthgStCd;
  CMMT300P_categoryInfo = { tenantId : CMMT300P_jsonDecode.tenantId , id: CMMT300P_jsonDecode.ctgrMgntNo,  ctgrNm :CMMT300P_jsonDecode.ctgrNm };
  CMMT300P_selCtg = CMMT300P_categoryInfo;
  CMMT300P_fnGetAuth(CMMT300P_categoryInfo)
  // 첨부파일 setting
	$('#CMMT300P_fileList').empty();
	let downloadPromises = [];
	for (let i of CMMT300P_jsonDecode.cmmt300FileList) {
		let promise = new Promise((resolve , reject) => {
			Utils.ajaxCallFileDownload("/sysm/download",i.apndFilePsn,i.apndFileIdxNm,function (fileBinary){
				let file = new File([fileBinary],i.apndFileNm);
					 CMMT300P_fileList.push(file);
					let CMMT300P_addFile =
						'<li><mark class="icoComp_download"></mark><span onclick="CMMT300P_fnDownFile(\''+i.apndFileNm+'\');">'+i.apndFileNm+
						'<small>('+CMMT300P_getByteSize(file.size)+')</small></span>';
					if (!(CMMT300P_blthgStCd == CMMT300P_KldStCd.approvalRequestNew || CMMT300P_blthgStCd == CMMT300P_KldStCd.approvalRequestChange)) {
						CMMT300P_addFile += '<button class="btDelete k-icon k-i-x" onclick="CMMT300P_delFile(this)" title="삭제"></button>';
					}
					CMMT300P_addFile +='</li>';
					$('#CMMT300P_fileList').append(CMMT300P_addFile);
					resolve(); // 작업이 완료되면 resolve 호출
			},null,null,null);
		})
    downloadPromises.push(promise); // Promise 배열에 추가
	}
	// 모든 작업이 완료되면 CMMT300P_fnSubTotalSize 실행
	Promise.all(downloadPromises).then(() => {
		 CMMT300P_fnSubTotalSize();
	});


  // 버튼 동작
	if(CMMT300P_blthgStCd==CMMT300P_KldStCd.approvalRequestNew ||CMMT300P_blthgStCd==CMMT300P_KldStCd.approvalRequestChange||
		CMMT300P_blthgStCd==CMMT300P_KldStCd.deleteAdmin ||CMMT300P_blthgStCd==CMMT300P_KldStCd.expiration){

		// 수정불가능
		CMMN_INPUT_DATE["CMMT300P_fromDt"].startDateDp.readonly();
		CMMN_INPUT_DATE["CMMT300P_fromDt"].endDateDp.readonly();
		$('#CMMT300P_fromDt_btn0').attr("disabled", true);
		$('#CMMT300P_fromDt_btn1').attr("disabled", true);
		$('#CMMT300P_fromDt_btn2').attr("disabled", true);
		$('#CMMT300P_fromDt_btn3').attr("disabled", true);
		$('#CMMT300P_fromDt_btn4').attr("disabled", true);
		$('#CMMT300P_fromDt_btn5').attr("disabled", true);
		$('#CMMT300P_cobTypCd')[0].parentNode.childNodes[1].disabled =true;
		$('#CMMT300P_title').attr("disabled",true);
	}

  // 게시 내용 setting
	for (let i of CMMT300P_jsonDecode.cmmt230VOList) {
//		CMMT300P_SetText += Utils.htmlDecode(i.moktiTite);
		CMMT300P_SetText += Utils.htmlDecode(i.bltnCtt);
	}

	if(Utils.isNull(CMMT300P_jsonDecode.blthgStCd)){
		CMMT300P_blthgStCd = CMMT300P_jsonDecode.blthgStCd;
	}
	// 버튼 state
	CMMT300P_fnButtonEnableDisable(CMMT300P_blthgStCd);

	// 반려사유 세팅
	$('#CMMT300P_apprStRsnCtt').val(CMMT300P_jsonDecode.tndwRsn);

	$("#CMMT300P_divContEdit").summernote('code', CMMT300P_SetText.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
}	
	
// 5. Button State
function CMMT300P_fnButtonEnableDisable(state){
	var state = state*1;
	if(CMMT300P_KldStCd.new !=state){
		$('#CMMT300P_BtnCategorySearch').attr("disabled", true);
	}

	if(CMMT300P_KldStCd.writing===state ||CMMT300P_KldStCd.new ===state){
		$('#CMMT300P_btnApproval').attr("disabled", true);
		$('#CMMT300P_btnDisposal').attr("disabled", true);
		$('#CMMT300P_apprStRsnCtt').attr("disabled",true);
	}else if(CMMT300P_KldStCd.approvalRequestNew===state ||CMMT300P_KldStCd.approvalRequestChange===state){
		$('#CMMT300P_BtnCategorySearch').attr("disabled", true);
		$('#CMMT300P_btnImgfile').attr("disabled", true);
		$('#CMMT300P_btnRemoveImg').attr("disabled", true);
		$('#CMMT300P_btnApendFile').attr("disabled", true);
		$('#CMMT300P_btnInit').attr("disabled", true);
		$('#CMMT300P_btnTempSave').attr("disabled", true);
		$('#CMMT300P_btnSave').attr("disabled", true);
		$('#CMMT300P_apprStRsnCtt').attr("disabled",true);
	}else if(CMMT300P_KldStCd.approvedNew===state||CMMT300P_KldStCd.approveChange===state){
		$('#CMMT300P_btnInit').attr("disabled", true);
		$('#CMMT300P_btnApproval').attr("disabled", true);
		$('#CMMT300P_btnDisposal').attr("disabled", true);
		$('#CMMT300P_btnTempSave').attr("disabled", true);
	}else if(CMMT300P_KldStCd.returnNew===state){
		$('#CMMT300P_btnApproval').attr("disabled", true);
		$('#CMMT300P_btnDisposal').attr("disabled", true);
	}else if(CMMT300P_KldStCd.returnChange===state){
		$('#CMMT300P_btnApproval').attr("disabled", true);
		$('#CMMT300P_btnDisposal').attr("disabled", true);
		$('#CMMT300P_btnTempSave').attr("disabled", true);
	}else if(CMMT300P_KldStCd.expiration===state ||CMMT300P_KldStCd.deleteAdmin===state){
		$('#CMMT300P_BtnCategorySearch').attr("disabled", true);
		$('#CMMT300P_btnImgfile').attr("disabled", true);
		$('#CMMT300P_btnRemoveImg').attr("disabled", true);
		$('#CMMT300P_btnApendFile').attr("disabled", true);
		$('#CMMT300P_btnInit').attr("disabled", true);
		$('#CMMT300P_btnPreView').attr("disabled", true);
		$('#CMMT300P_btnApproval').attr("disabled", true);
		$('#CMMT300P_btnDisposal').attr("disabled", true);
		$('#CMMT300P_btnTempSave').attr("disabled", true);
		$('#CMMT300P_btnSave').attr("disabled", true);
		$('#CMMT300P_apprStRsnCtt').attr("disabled",true);
		$('#CMMT300P_btnAthtDetail').attr("disabled", true);
	}
}

// 시점 문제 check..
// 6.Editor Onload After
function OnInitCompleted(e) {
	let kldStCd = CMMT300P_blthgStCd;
	if(CMMT300P_SetText !==""){
		CMMT300P_editor.SetValue(CMMT300P_SetText);
		if(kldStCd==CMMT300P_KldStCd.approvalRequestNew ||kldStCd==CMMT300P_KldStCd.approvalRequestChange||
			kldStCd==CMMT300P_KldStCd.deleteAdmin ||kldStCd==CMMT300P_KldStCd.expiration){// 수정불가능
			CMMT300P_editor.SetReadonly(true);
		}
	}

}

// Call
// Function=========================================================================================================
// 카테고리 팝업 callback
function CMMT300P_selCateBack(item){
	CMMT300P_selCtg = item[0];
	$('#CMMT300P_selCate').val(item[0].path);
	
	CMMT300P_fnGetAuth(CMMT300P_selCtg)  
}

// 카테고리 권한 조회
function CMMT300P_fnGetAuth(data){
	CMMT300P_categoryInfo = {
							 tenantId : data.tenantId
							, ctgrMgntNo: data.id
	};
	
	var CMMT300P_jsonStr = JSON.stringify(CMMT300P_categoryInfo);
	
	Utils.ajaxCall('/cmmt/CMMT200SEL05', CMMT300P_jsonStr, CMMT300P_fnsetAuth)
}

// 카테고리 권한 setting
function CMMT300P_fnsetAuth(data){
	var CMMT300P_jsonEncode = JSON.stringify(data.CMMT200VOInfo);
	var CMMT300P_object=JSON.parse(CMMT300P_jsonEncode);
	var CMMT300P_jsonDecode = JSON.parse(CMMT300P_object);
	
	CMMT300P_alarmUseYnCtgr = CMMT300P_jsonDecode.alarmUseYnCtgr

	if(CMMT300P_jsonDecode.atclWritPmssYn=="Y"){
		$('#CMMT300P_writYn').prop('checked',true)
	}else{
		$('#CMMT300P_writYn').prop('checked',false)
	}
	if(CMMT300P_jsonDecode.replyWritPmssYn=="Y"){
		$('#CMMT300P_replyYn').prop('checked',true)
	}else{
		$('#CMMT300P_replyYn').prop('checked',false)
	}
	if(CMMT300P_jsonDecode.goodPmssYn=="Y"){
		$('#CMMT300P_goodYn').prop('checked',true)
	}else{
		$('#CMMT300P_goodYn').prop('checked',false)
	}
	
	switch(CMMT300P_jsonDecode.ctgrUseAthtCd){
		case '1' :
			$('#CMMT300P_useAuth').val(CMMT300P_langMap.get("CMMT300P.org"))
			break;
		case '2':
			$('#CMMT300P_useAuth').val(CMMT300P_langMap.get("CMMT300P.group"))
			break;
		case '3':
			$('#CMMT300P_useAuth').val(CMMT300P_langMap.get("CMMT300P.indi"))
			break;
	}
	CMMT300P_ctgrUseAthtCd =CMMT300P_jsonDecode.ctgrUseAthtCd;
	
	// kw---20230705 : 관리자 아이디와 사용자 아이디가 동일한 경우 승인필요는 N
	if(CMMT300P_jsonDecode.ctgrAdmnId == GLOBAL.session.user.usrId){
		CMMT300P_jsonDecode.blthgApvNcsyYn = "N";
	}
	
	CMMT300P_blthgApvNcsyYn = CMMT300P_jsonDecode.blthgApvNcsyYn;
	
	if(Utils.isNull(CMMT300P_jsonDecode.apndFilePmssCunt) || CMMT300P_jsonDecode.apndFilePmssCunt == 0){
		$('#CMMT300P_btnApendFile').css('visibility','hidden')
	}else{
		$('#CMMT300P_btnApendFile').css('visibility','visible')
	//$('#CMMT300P_fileTot')[0].innerHTML = '0개 / 0B';
	//$('#CMMT300P_fileList')[0].innerHTML = '<li style =" color: #888;font-style: italic;text-decoration: none;" class="noCnt">최대 5개 , 5Mb 이하의 파일만 업로드 가능합니다.</li>'
		CMMT300P_apndFilePmssCunt = CMMT300P_jsonDecode.apndFilePmssCunt ;
		CMMT300P_apndFileMaxSz = CMMT300P_jsonDecode.apndFileMaxSz ;
		CMMT300P_apndFileSzUnitCd = CMMT300P_jsonDecode.apndFileSzUnitCd ;

		if(CMMT300P_fileList.length == 0){
			if(CMMT300P_apndFilePmssCunt > 0){
				CMMT300P_fnSubTotalSize()
			}
		}
	}
	
	let sizes = ['BT', 'KB', 'MB', 'GB', 'TB'];
	let sizeCnt = sizes.findIndex(element => element == CMMT300P_jsonDecode.apndFileSzUnitCd);
	let sizeUnit =  Math.pow(1024,(sizeCnt+1)).toFixed(2)
	
	// 개별 첨부파일 max size
	CMMT300P_sizeLimitCnt = CMMT300P_jsonDecode.apndFileMaxSz * sizeUnit;
	// 전체 파일 max size
	CMMT300P_totSize =  CMMT300P_jsonDecode.apndFileAllSz * sizeUnit;

	CMMT300P_cntLimitCnt = CMMT300P_jsonDecode.apndFilePmssCunt;



}


// 저장 Call
function CMMT300P_fnSaveData(cntntsNo,kldStCd){
	let CMMT210VO = CMMT300P_SetFormData(cntntsNo,kldStCd);

	if(CMMT300P_imgChng){ 
		CMMT300P_imgChng = false;
		return;
	}
	if(CMMT300P_chkRtn){
		CMMT300P_chkRtn = false;
		return;
	}
	if(CMMT210VO != null){
		Utils.ajaxCallFormData('/cmmt/CMMT300INS01',CMMT210VO,function(data){
			if(data.result !== "0") {
				let item = JSON.parse(JSON.parse(JSON.stringify(data.info)));
				if (item.tenantId != null) {
					CMMT300P_blthgMgntNo = item.blthgMgntNo
					CMMT300P_blthgStCd = item.blthgStCd
					$('#CMMT300P_blthgStCdNm').val(Utils.getComCdNm(CMMT300P_cmmCodeList, "C0084", item.blthgStCd));
					if (item.blthgStCd == CMMT300P_KldStCd.approvalRequestNew || item.blthgStCd == CMMT300P_KldStCd.approvalRequestChange
						|| item.blthgStCd == CMMT300P_KldStCd.approvedNew || item.blthgStCd == CMMT300P_KldStCd.approveChange) {
						Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(CMMT300P_ctgrMgntNo);
						Utils.alert(CMMT300P_langMap.get("CMMT300P.save"), function () {
							window.close();
						});
					} else {
						Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(CMMT300P_ctgrMgntNo);
						Utils.alert(CMMT300P_langMap.get("CMMT300P.save"));
					}
				} else {
					Utils.alert(CMMT300P_langMap.get("CMMT300P.failSave"));
				}
			} else Utils.alert(data.msg);
		},null,null, null);
	}else{

	}
}
// 수정 Call
function CMMT300P_fnUpdateData(cntntsNo,kldStCd){
	let CMMT210VO = CMMT300P_SetFormData(cntntsNo,kldStCd);
	if(CMMT300P_imgChng){ 
		CMMT300P_imgChng = false;
		return;
	}
	if(CMMT300P_chkRtn){
		CMMT300P_chkRtn = false;
		return;
	}
	if(CMMT210VO != null){
		Utils.ajaxCallFormData('/cmmt/CMMT300UPT01',CMMT210VO,function(data){
			let item = JSON.parse(JSON.parse(JSON.stringify(data.info)));
			if(item.tenantId != null){
				CMMT300P_blthgMgntNo = item.blthgMgntNo
				CMMT300P_blthgStCd = item.blthgStCd
				$('#CMMT300P_blthgStCdNm').val(Utils.getComCdNm(CMMT300P_cmmCodeList, "C0084",item.blthgStCd));
				if(item.blthgStCd == CMMT300P_KldStCd.approvalRequestNew ||item.blthgStCd == CMMT300P_KldStCd.approvalRequestChange
					||item.blthgStCd == CMMT300P_KldStCd.approvedNew ||item.blthgStCd == CMMT300P_KldStCd.approveChange ||item.blthgStCd == CMMT300P_KldStCd.writing){
					Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(CMMT300P_ctgrMgntNo);
					Utils.alert(CMMT300P_langMap.get("CMMT300P.update"), function(){
						window.close();
					});
				}
			}else{
				Utils.alert(CMMT300P_langMap.get("CMMT300P.failUpdate"))
			}
		},null,null,null);
	}else{

	}
}

// 상태 변경 Call
function CMMT300P_fnStateUpdateData(cntntsNo,kldStCd){
	let CMMT210VO = CMMT300P_SetChangeStae(cntntsNo,kldStCd);
	if(CMMT210VO != null){
		Utils.ajaxCall('/cmmt/CMMT300UPT02',JSON.stringify(CMMT210VO),function(data){
			let item = JSON.parse(JSON.parse(JSON.stringify(data.result)));
			if(item>0){
				if(kldStCd == CMMT300P_KldStCd.returnNew ||kldStCd == CMMT300P_KldStCd.returnChange
					||kldStCd == CMMT300P_KldStCd.approvedNew ||kldStCd == CMMT300P_KldStCd.approveChange){
					Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(CMMT300P_ctgrMgntNo);
					Utils.alert(CMMT300P_langMap.get("CMMT300P.update"), function(){
						window.close();
					});
				}
			}else{
				Utils.alert(CMMT300P_langMap.get("CMMT300P.failUpdate"))
			}
		},null,null,null);
	}else{

	}
}

// 전송용 데이터 세팅
function CMMT300P_SetFormData(cntntsNo,kldStCd){
//	if(CMMT300P_fnSubCreateCntntTreeList(CMMT300P_editor.GetBodyValue())<0){
//	return;
//}
	if(CMMT300P_fnSubCreateCntntTreeListNew()<0){
		return;
	}
//	if(CMMT300P_IndexList ===[]){
//		return;
//	}
	let CMMT300P_regex = /[^0-9]/g;	
	let CMMT210VO =new FormData();
	// 컨텐츠
	CMMT210VO.append('tenantId', GLOBAL.session.user.tenantId);
	if(!Utils.isNull(CMMT300P_selCtg)){
		CMMT210VO.append('ctgrMgntNo', CMMT300P_selCtg.id);
	}else{
		Utils.alert(CMMT300P_langMap.get("CMMT300P.selCategory"));
		CMMT300P_chkRtn = true;
	}
	CMMT210VO.append('blthgMgntNo',cntntsNo);
	CMMT210VO.append('blthgTite', $('#CMMT300P_title').val());
	CMMT210VO.append('bltnTypCd', $('#CMMT300P_cobTypCd').val());
	CMMT210VO.append('blthgStCd', kldStCd );
	
	// kw---게시판 유형을 알기 위함(커뮤니티 일 경우 엘라스틱 상태는 99)
	CMMT210VO.append('ctgrTypCd', CMMT300M_ctgrTypCd);
	
	
	if($('#CMMT300P_image')[0].files.length>0){
		if($('#CMMT300P_image')[0].files[0].name.length>40){
			Utils.alert(CMMT300P_langMap.get("CMMT300P.imgName"));
			CMMT300P_imgChng = true;
		}
		if(!Utils.isNull( $('#CMMT300P_image')[0].files[0])){
			CMMT210VO.append('file', $('#CMMT300P_image')[0].files[0]);
		}
	}

	// 미리보기 이미지 존재여부 flag
	let imgExist = $('#CMMT300P_imgView')[0].src.indexOf('cmmtphotoimg');
	CMMT210VO.append('imgExist',imgExist<0 && Utils.isNull($('#CMMT300P_image')[0].files[0]) ?'N':'Y')

	CMMT210VO.append('bltnTrmStrDd', $('#CMMT300P_fromDt').val().replace(CMMT300P_regex, ""));
	CMMT210VO.append('bltnTrmEndDd', $('#CMMT300P_toDt').val().replace(CMMT300P_regex, ""));
	CMMT210VO.append('permBltnYn', $('#CMMT300P_perm').val());
	CMMT210VO.append('alrmUseYn', 'Y');
	CMMT210VO.append('mbrdDispPmssYn', $('#CMMT300P_dispYn').prop('checked') ? 'Y' : 'N');
	CMMT210VO.append('blthgApvNcsyYn', CMMT300P_blthgApvNcsyYn);
	CMMT210VO.append('regrId', GLOBAL.session.user.usrId);
	CMMT210VO.append('regrNm', GLOBAL.session.user.decUsrNm);
	CMMT210VO.append('regrOrgCd', GLOBAL.session.user.orgCd);

	// 컨텐츠 목차 & 내용
	for(let i=0; i<CMMT300P_IndexList.length;i++){
		CMMT210VO.append('CMMT230VOList['+i+'].moktiNo', CMMT300P_IndexList[i].moktiNo);
		CMMT210VO.append('CMMT230VOList['+i+'].moktiTite', CMMT300P_IndexList[i].moktiTite);
 		CMMT210VO.append('CMMT230VOList['+i+'].hgrkMoktiNo', CMMT300P_IndexList[i].hgrkMoktiNo);
		CMMT210VO.append('CMMT230VOList['+i+'].moktiPrsLvl', CMMT300P_IndexList[i].moktiPrsLvl);
		CMMT210VO.append('CMMT230VOList['+i+'].bltnCtt', CMMT300P_IndexList[i].bltnCtt);
		CMMT210VO.append('CMMT230VOList['+i+'].bltnCttTxt', CMMT300P_IndexList[i].bltnCttTxt);
		CMMT210VO.append('CMMT230VOList['+i+'].kmst213Vo.imgFile', CMMT300P_IndexList[i].imgFile);
	}

	// 첨부파일 추가
	for(let i =0; i<CMMT300P_fileList.length; i++){
		CMMT210VO.append('CMMT300FileList['+i+'].file', CMMT300P_fileList[i]);
	}
	
	return CMMT210VO;
}

// 상태변경용 데이터 세팅
function CMMT300P_SetChangeStae(cntntsNo,kldStCd){

	let CMMT210VO = {
		'tenantId'		: GLOBAL.session.user.tenantId,
		'ctgrMgntNo'    : CMMT300P_selCtg.id,
		'blthgMgntNo'  	: cntntsNo,
		'blthgStCd'   	: kldStCd,
		'regrId'    	: GLOBAL.session.user.usrId,
		'regrNm'    	: GLOBAL.session.user.decUsrNm,
		'regrOrgCd' 	: GLOBAL.session.user.orgCd,
		'ctgrTypCd'		: CMMT300M_ctgrTypCd,
	}
	
	return CMMT210VO;
}

// 파일 토탈 사이즈및 갯수 관리
function CMMT300P_fnSubTotalSize(){
	let totalsize = 0;
	CMMT300P_fileList.forEach(x=> totalsize+= x.size);
	$('#CMMT300P_fileTot').text(" ");
	$('#CMMT300P_fileTot').append(CMMT300P_fileList.length+CMMT300P_langMap.get("CMMT300P.cnt")+ CMMT300P_getByteSize(totalsize));

	if(CMMT300P_fileList.length == 0){
		if(CMMT300P_apndFilePmssCunt > 0){
				$('#CMMT300P_fileList')[0].innerHTML = '<li style =" color: #888;font-style: italic;text-decoration: none;" class="noCnt"> 최대 '+ CMMT300P_apndFilePmssCunt +'개 ,  '+ CMMT300P_apndFileMaxSz+ ' ' + CMMT300P_apndFileSzUnitCd + ' 이하의 파일만 업로드 가능합니다.</li>'
		}
	}

	if ($("#CMMT300P_fileList li").not(".noCnt").length > 0) {
    $(".noCnt").remove();
	}
}


// button event
// =========================================================================================================
// 카테고리 팝업
function CMMT300P_selCate(){
	Utils.setCallbackFunction("CMMT300P_selCateBack", CMMT300P_selCateBack);
	Utils.openKendoWindow("/cmmt/CMMT301P",400,600, "left",452,90,false, {callbackKey:"CMMT300P_selCateBack"});
}

// 사용권한 팝업
function CMMT300P_chkAuthList(){
	switch(CMMT300P_ctgrUseAthtCd){
	case '1' : 
		Utils.openKendoWindow("/cmmt/CMMT321P",1000,510, "left",452,190,false, {ctgrMgntNo:CMMT300P_selCtg.id});
		break;
	case '2' : 
		Utils.openKendoWindow("/cmmt/CMMT322P",1000,510, "left",452,190,false, {ctgrMgntNo:CMMT300P_selCtg.id});
		break;
	case '3' :
		Utils.openKendoWindow("/cmmt/CMMT323P",1000,510, "left",452,190,false, {ctgrMgntNo:CMMT300P_selCtg.id});
		break;
	}
}

// 대표이미지 추가 버튼
function CMMT300P_addImg(){
	$('#CMMT300P_image').click();
}

// 대표이미지 추가 시 미리보기
function CMMT300P_chnImg(input){
	if(Utils.isFileValidation(input)) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#CMMT300P_imgView').css("display",'block')
				$('#CMMT300P_figcap').css("display",'none')
				$('#CMMT300P_imgView')[0].src = e.target.result;
				CMMT300P_previewImg =  e.target.result;
			};
			reader.readAsDataURL(input.files[0]);
		} else {
			$('#CMMT300P_imgView')[0].src = "";
			CMMT300P_previewImg = "";
			$('#CMMT300P_imgView').css("display",'none')
			$('#CMMT300P_figcap').css("display",'block')
		}
	} else $("#CMMT300P_image").val("");		// 결함리포트 125 수정
}

// 이미지 미리보기 삭제
function CMMT300P_delImg(){
	// 화면초기화
	CMMT300P_imgChng = false;
	$('#CMMT300P_imgView')[0].src = "";
	$('#CMMT300P_imgView').css("display",'none')
	$('#CMMT300P_figcap').css("display",'block')
	$("#CMMT300P_image").val("")
}

// 첨부파일 추가 버튼
function CMMT300P_selFile(){
	$('#CMMT300P_mFile').click();
}

// 첨부파일 추가
function CMMT300P_chnFile(input){
	let files = input.files;
	CMMT300P_fnSetFileList(files)
}

// 첨부파일 validation & li 추가
function CMMT300P_fnSetFileList(files){
	let sizeSum = 0;
	//최대 5개 이하 문구카운팅 되는 문제 수정
	if($("#CMMT300P_fileList").children().not(".noCnt").length +  files.length > CMMT300P_cntLimitCnt){
		Utils.alert(CMMT300P_langMap.get("CMMT300P.uploadCnt1")+  CMMT300P_cntLimitCnt+'개' +  CMMT300P_langMap.get("CMMT300P.uploadCnt2"))
		return;
	}

	if(!Utils.isFileValidation(files, CMMT300M_sizeLimit, false)) {
		return;
	}

	for (i = 0; i < files.length; i++) {
		if(CMMT300P_sizeLimitCnt <  files[i].size){
			Utils.alert(CMMT300P_langMap.get("CMMT300P.uploadSize"))
			return;
		}
		// 전체 파일 사이즈
		sizeSum += files[i].size;

		if(CMMT300P_totSize < sizeSum){
			Utils.alert(CMMT300P_langMap.get("CMMT300P.uploadSum"))
			return ;
		}
		let count = CMMT300P_fileList.filter(x => x.name == files[i].name).length;
		if (count == 0) {
			CMMT300P_fileList.push(files[i]);
		}
	}

	$("#CMMT300P_mFile").val("");
	$('#CMMT300P_fileList').empty();

	for(i=0; i<CMMT300P_fileList.length;i++){
		let CMMT300P_addFile =
			'<li><mark class="icoComp_download"></mark><span onclick="CMMT300P_fnDownFile(this)">'+CMMT300P_fileList[i].name+'<small>('+CMMT300P_getByteSize(CMMT300P_fileList[i].size)+')</small></span>'
			+ '<button class="btDelete k-icon k-i-x" onclick="CMMT300P_delFile(this)"" title="삭제"></button> </li>';
		 $("#CMMT300P_fileList").append(CMMT300P_addFile);
	}
	 
	// total setting
	CMMT300P_fnSubTotalSize("CMMT300P_fnSetFileList");
}

// 파일 선택시
function CMMT300P_fnDownFile(obj){
//	let data =CMMT300P_fileList.find(x => x.name === obj.childNodes[0].data);
	console.log(CMMT300P_fileList);
	let data =CMMT300P_fileList.find(x => x.name === obj);
	let blob = new Blob([data]);
	let path = window.URL.createObjectURL(data)
	let link = document.createElement('a')
	link.href = path;
	link.download = data.name;
	link.click();
	link.remove();
}

// 첨부파일 삭제(x)버튼
function CMMT300P_delFile(obj){
	let filename = obj.parentNode.childNodes[1].childNodes[0].data;
	CMMT300P_fileList = CMMT300P_fileList.filter(x => x.name !=filename);
	$(obj.parentNode).remove();

	CMMT300P_fnSubTotalSize();
}

// 파일 업로드 제한 - JDJ 나중에 파일도쓸수있게변경
function CMMT300P_fnSubuploadFileCheck(file,type) {
	if(file){
		if(type==="IMG"){
			let maxSize = 10 * 1024 * 1024; // 10MB
			if(file.size > maxSize){
				Utils.alert(CMMT300P_langMap.get("CMMT300P.fileSize10"));
				$('#CMMT300P_btnImgfile').val("");
				return;
			}
			let pattern =  /[,;~`^@\#$%&\=\'_]/gi;
			let fileName = file.name.split('\\').pop().toLowerCase();
			if(pattern.test(fileName) ){
				Utils.alert(CMMT300P_langMap.get("CMMT300P.fileNm"));
				$('#CMMT300P_btnImgfile').val("");
				return;
			}
			let ext = file.name.split('.').pop().toLowerCase(); // 확장자분리
			if($.inArray(ext, ['jpg','jpeg','gif','png']) == -1) {// 아래 확장자가
																	// 있는지 체크
				Utils.alert(CMMT300P_langMap.get("CMMT300P.imgAble"));
				$('#CMMT300P_btnImgfile').val("");

			}
		}else{
			let maxSize = 100 * 1024 * 1024; // 100MB
			if(file.size > maxSize){
				Utils.alert(CMMT300P_langMap.get("CMMT300P.fileSize100"));

				// $('#CMMT300P_btnImgfile').val("");
				return false;
			}
			let pattern=	 /[,;~`^@\#$%&\=\'_]/gi;
			if(pattern.test(file.name) ){
				Utils.alert(CMMT300P_langMap.get("CMMT300P.imgAble"));

				// $('#CMMT300P_btnImgfile').val("");
				return false;
			}
			let extension = new RegExp("(.*?)\.(xls|xlsx|ppt|pptx|doc|docx|hwp|pdf|gif|jpg|png|zip|rar|PNG)$"); // 확장자
			if(extension.test(file.name)){// 아래 확장자가 있는지 체크
				Utils.alert(CMMT300P_langMap.get("CMMT300P.fileAble"));

				// $('#CMMT300P_btnImgfile').val("");
				return false;
			}
			return true;
		}
	}
}

// 미리보기 버튼
function CMMT300P_fnShowPrev(){
	// 빈칸 체크
	if(Utils.isNull( $('#CMMT300P_title').val())){// 제목
		Utils.alert(CMMT300P_langMap.get("CMMT300P.emptyTitle"))
		return;
	}


	if(Utils.isNull( $('#CMMT300P_fromDt').val()) || Utils.isNull( $('#CMMT300P_toDt').val())){// 날짜
		Utils.alert(CMMT300P_langMap.get("CMMT300P.setDate"))
		return;
	}

	if(Utils.isNull($('#CMMT300P_selCate').val())){// 카테고리
		Utils.alert(CMMT300P_langMap.get("CMMT300P.emtpyCate"))
		return;
	}

//	if(Utils.isNull(CMMT300P_editor.GetTextValue())){// 내용
//		Utils.alert(CMMT300P_langMap.get("CMMT300P.emtpyContent"))
//		return;
//	}

//	CMMT300P_fnSubCreateCntntTreeList(CMMT300P_editor.GetBodyValue());
	CMMT300P_fnSubCreateCntntTreeListNew();
	if(CMMT300P_chkRtn){
		CMMT300P_chkRtn = false;
		return;
	}
	let parm =  {'type' : 'preview', DASH110P_blthgMgntNo : CMMT300P_blthgMgntNo}

	Utils.openPop(GLOBAL.contextPath + "/dash/DASH110P","DASH110P",1000,1000,parm);
}

// 초기화버튼
function CMMT300P_fnSetInit(){
	$('#CMMT300P_writYn').prop('checked',false);
	$('#CMMT300P_replyYn').prop('checked',false);
	$('#CMMT300P_goodYn').prop('checked',false);
	$('#CMMT300P_dispYn').prop('checked',false);
	$('#CMMT300P_alarmYn').prop('checked',false);
	$('#CMMT300P_perm').prop('checked',false);
	$('#CMMT300P_cobTypCd').data("kendoComboBox").value(2)
	$('#CMMT300P_useAuth').val("");
	$('#CMMT300P_title').val("");
	
	// 유효기간 초기화
	$('#CMMT300P button[name=CMMT300P_fromDt_btn4]').click();
	
	CMMT300P_delImg();
	
//	CMMT300P_editor.SetValue("");
	
	$('#CMMT300P_divContEdit').summernote('code', '');

	for(let i=0; i<$('#CMMT300P_fileList').children().length; i++){
		$('#CMMT300P_fileList').children()[i].remove()
	}
	CMMT300P_fileList =[];

	CMMT300P_fnSubTotalSize()
}

// 임시 저장 버튼 클릭
$('#CMMT300P_btnTempSave').off("click").on('click', function () {
	Utils.confirm(CMMT300P_langMap.get("CMMT300P.save.msg"),function () {
		if (Utils.isNull(CMMT300P_blthgMgntNo)) { // 작성
			if (CMMT300P_blthgStCd == CMMT300P_KldStCd.new) {	// 컨텐츠 번호 생성전
																// 임시저장
				CMMT300P_fnSaveData(-1, CMMT300P_KldStCd.writing);
			} else {// 임시저장 후 임시 저장
				CMMT300P_fnUpdateData(CMMT300P_blthgMgntNo, CMMT300P_KldStCd.writing);
			}
		} else {// 수정
			if (CMMT300P_blthgStCd == CMMT300P_KldStCd.writing) {
				CMMT300P_fnUpdateData(CMMT300P_blthgMgntNo, CMMT300P_KldStCd.writing);
			}
		}
	},function(){}
	);
});

// 저장 버튼 클릭
$('#CMMT300P_btnSave').off("click").on('click', function () {

	if(typeof $("#CMMT300P_title").val() == "undefined" || $("#CMMT300P_title").val() == "" || $("#CMMT300P_title").val() == null)
	{
		CMMT300P_langMap.get("CMMT300P.setTitle")
		Utils.alert(CMMT300P_langMap.get("CMMT300P.emptyTitle"))
		return;
	}

	if(Utils.isNull( $('#CMMT300P_fromDt').val()) || Utils.isNull( $('#CMMT300P_toDt').val())){// 날짜
		Utils.alert(CMMT300P_langMap.get("CMMT300P.setDate"))
		return;
	}
	// 날짜 형식 검증 (yyyy-MM-dd)
	const dateRegex = (/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
	var CMMT300P_fromDtVal = $('#CMMT300P_fromDt').val()
	var CMMT300P_toDtVal  = $('#CMMT300P_toDt').val()
	if (!dateRegex.test(CMMT300P_fromDtVal) || !dateRegex.test(CMMT300P_toDtVal)  ||  CMMT300P_fromDtVal > CMMT300P_toDtVal) {

			Utils.alert(CMMT300P_langMap.get("CMMT300P.setDate2")); // 유효하지 않은 날짜 형식 알림
			return;
	}



/*	if(Utils.checkSpecialCharacters($("#CMMT300P_title").val()))
	{
		Utils.alert("제목에 허용되지 않은 특수문자가 포함되어 있습니다.<br/>허용 특수 문자 : ! @ $ % ^ & * [ ]");
		return;
	}*/
	Utils.confirm(CMMT300P_langMap.get("CMMT300P.save.msg"),
		function () {

			// 신규(0), 작성중(10), 승인요청(신규)(11), 사용(신규)(12), 반려(신규)(13),
			// 승인요청(변경)(14), 사용(변경)(15), 반려(변경)(16) 관리자삭제(89),만료(90)
			if (Utils.isNull(CMMT300P_blthgMgntNo)) { // 신규 생성
				if(CMMT300P_blthgStCd==CMMT300P_KldStCd.new){// 임시 저장 없이 저장
					CMMT300P_fnSaveData(-1,CMMT300P_KldStCd.approvalRequestNew);
				} else{// 임시저장 후 저장
					CMMT300P_fnUpdateData(CMMT300P_blthgMgntNo,CMMT300P_KldStCd.approvalRequestNew);
				}
			}else{// 수정 버튼
				if(CMMT300P_blthgStCd==CMMT300P_KldStCd.writing){// 작성중 ->
																	// 승인요청(신규)
					CMMT300P_fnUpdateData(CMMT300P_blthgMgntNo,CMMT300P_KldStCd.approvalRequestNew);
				}else if(CMMT300P_blthgStCd==CMMT300P_KldStCd.returnNew){ // 반려
																			// (신규)
																			// ->
																			// 승인요청(신규)
					CMMT300P_fnUpdateData(CMMT300P_blthgMgntNo,CMMT300P_KldStCd.approvalRequestNew);
				}else if(CMMT300P_blthgStCd==CMMT300P_KldStCd.approvedNew||// 사용
																			// (신규)
																			// ->
																			// 승인요청(변경)
						CMMT300P_blthgStCd==CMMT300P_KldStCd.returnChange|| // 반려
																			// (변경)
																			// ->
																			// 승인요청(변경)
						CMMT300P_blthgStCd==CMMT300P_KldStCd.approveChange){ // 반려
																				// (변경)
																				// ->
																				// 승인요청(변경)
					CMMT300P_fnUpdateData(CMMT300P_blthgMgntNo,CMMT300P_KldStCd.approvalRequestChange);
				}else{
					// 잘못된 시도
					console.log(999);
				}
			}
		}, function(){}
	);
});

// 반려사유 리스트 버튼 클릭
$('#CMMT300P_btnDisposalList').off("click").on('click', function () {
	if (CMMT300P_blthgStCd != CMMT300P_KldStCd.new) {// 임시저장 후 임시 저장
		let param = {
				category : 'C',
				ctgrMgntNo : CMMT300P_ctgrMgntNo,
				blthgMgntNo : CMMT300P_blthgMgntNo,
		}
		Utils.openKendoWindow("/cmmt/CMMT331P", 500, 400, "center", 0, 50, false, param);
	} else {

	}

});

// Sub
// Function----------------------------------------------------------------------------------------------------------
// 첨부파일 size format
function CMMT300P_getByteSize(bytes, decimals = 2) {
	if (bytes === 0) return '0B';
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// 재조회
function CMMT300P_fnReSearch(){
	for(let i=0; i<$('#CMMT300P_fileList').children().length; i++){
		$('#CMMT300P_fileList').children()[i].remove()
	}
	CMMT300P_totSize = 0, CMMT300P_totCnt = 0;
	
	let CMMT300P_data = { tenantId			: CMMT300P_selCtg.tenantId,
						ctgrMgntNo			: CMMT300P_selCtg.id,
						blthgMgntNo			: CMMT300P_blthgMgntNo,
		};	
	
	Utils.ajaxCall('/cmmt/CMMT300SEL05', JSON.stringify(CMMT300P_data), CMMT300P_callBack);
}
// 내용 트리화
function CMMT300P_fnSubCreateCntntTreeList(cntns){
	let indexlist = []; let count =0, maxh1id =0, maxh2id =0;
	for (let i=0;i<$(cntns).length;i++){
		// 목차 생성
		// if($(cntns)[0].tagName !=='H1' && ($(cntns).length>1 &&
		// $(cntns)[1].tagName==='H2')){
		// Utils.alert("에디터에 작성된 문서 형식이 잘못되었습니다.");
		// CMMT300P_chkRtn = true;
		// return;
		// }
		// if($(cntns)[i].tagName
		// ==='H4'||$(cntns)[i].tagName==='H5'||$(cntns)[i].tagName==='H6'){
		// Utils.alert("에디터에 작성된 내용중 사용불가 태그가 사용 되었습니다.");
		// CMMT300P_chkRtn = true;
		// return;
		// }
	// if($(cntns)[i].tagName
	// ==='H1'||$(cntns)[i].tagName==='H2'||$(cntns)[i].tagName==='H3'){
			// let title = "<" + $(cntns)[i].tagName.toLowerCase() + "
			// id=\"Temp_" + count + "\">" + $(cntns)[i].textContent + "</" +
			// $(cntns)[i].tagName.toLowerCase() + ">"
			// if(title.length>100){
			// Utils.alert("목차는 100자 이내로 작성해주세요.");
			// CMMT300P_chkRtn = true;
			// return;
			// }
			let data = {
				moktiNo: count,
				hgrkMoktiNo : 0,
				// items: [],
				titleTag: $(cntns)[i],
				moktiTite: "",
				moktiPrsLvl: 1,
				imgFile :  [],

				bltnCtt: "",
				bltnCttTxt: "",
			}
			indexlist.push(data);
			count++;
		// }else{
			if($(cntns)[i].nodeType !== 3){
				// indexlist[indexlist.length-1].bltnCtt +=
				// $(cntns)[i].outerHTML;
				// indexlist[indexlist.length-1].bltnCttTxt +=
				// $(cntns)[i].textContent+"\n ";
				let img = $($(cntns)[i]).find("img");
				let filelist = [];
				if(img.length>0) {
					for (let i = 0; i < img.length; i++) {
						let imgName = img[i].attributes.title.nodeValue;
						let file = CMMT300P_editImg.find(file => file.name == imgName);
						if (!Utils.isNull(file)) {
							filelist.push(file);
						}
					}

					indexlist[indexlist.length-1].imgFile = filelist;
				}
				indexlist[indexlist.length-1].bltnCtt += $(cntns)[i].outerHTML;
				indexlist[indexlist.length-1].bltnCttTxt += $(cntns)[i].textContent;
			}
		}
	// }

	// for(let i=0;i<indexlist.length;i++){
	// if(indexlist[i].titleTag.tagName === 'H1'){
	// indexlist[i].hgrkMoktiNo = 0;
	// maxh1id = indexlist[i].moktiNo;
	// }
	// if(indexlist[i].titleTag.tagName === 'H2'){
	// indexlist[i].hgrkMoktiNo = maxh1id;
	// maxh2id = indexlist[i].moktiNo;
	// }
	// if(indexlist[i].titleTag.tagName === 'H3'){
	// if(indexlist[i-1].titleTag.tagName === 'H1'){
	// Utils.alert("에디터에 목차태그 순번이 잘못되었습니다. (H1 -> H3) 형태로 만들수없습니다.");
	// CMMT300P_chkRtn = true;
	// return;
	// }
	// indexlist[i].hgrkMoktiNo = maxh2id;
	// }
	// }
	CMMT300P_IndexList = indexlist;
}

function CMMT300P_fnSubCreateCntntTreeListNew(){

	CMMT300P_IndexList = [];

	let edtCode = $('#CMMT300P_divContEdit').summernote('code');
	let edtText = Utils.summerTagReplace(edtCode);					//kw---20240614 : summernote - 기능 수정 (테이블 관련)
	
	let objLv1 = {
			moktiNo : 0,
			moktiTite: $("#CMMT300P_title").val(),
			hgrkMoktiNo		: 0,										//상위목차번호
			moktiPrsLvl		: 1,											//목차현재레벨
			bltnCtt		: edtCode,									//상세내용코드
			bltnCttTxt 	: edtText,									//상세내용텍스트
	}

	CMMT300P_IndexList.push(objLv1);
}

// 날짜 변환
function CMMT300P_fnDateChage(str){
	let year =str.substring(0,4)
	let month =str.substring(4,6)
	let day =str.substring(6,8)
	return year+"-"+month+"-"+day;
}

function CMMT300P_fnChngAlarm(){
	if(CMMT300P_alarmUseYnCtgr != 'Y'){
		Utils.alert(CMMT300P_langMap.get("CMMT300P.notAlarm"));
		$('#CMMT300P_alarmYn').prop('checked', false) 
	}
}




function CMMT300P_fnSummEdtCreate(){

	var editorId = "CMMT300P_divContEdit";

	var fontList = ['맑은 고딕', '굴림', '돋움', '바탕', '궁서', 'NotoSansKR', 'Arial', 'Courier New', 'Verdana', 'Tahoma', 'Times New Roamn'];
	
	CMMT300P_editor = $("#"+editorId).summernote({
		height: 560,                 // set editor height
		minHeight: 180,          // set minimum height of editor
		fontNames: fontList,
		fontNamesIgnoreCheck : fontList,
		fontNamesIgnoreCheck : ['맑은 고딕'],
//		maxHeight: 180,
		toolbar: [
			  ['style', ['style']],
			  ['font', ['bold', 'underline', 'clear']],
			  ['fontname', ['fontname']],
			  ['fontsize', ['fontsize']],
			  ['color', ['forecolor','color']],
			  ['para', ['paragraph']],
			  ['table', ['table']],
			  ['view', ['codeview']],
			  ['insert', ['link', 'picture']],
		  ],
		  callbacks: {
			    onImageUpload : function(files) {
					if(Utils.isFileValidation(files, CMMT300M_sizeLimit)) {
						CMMT300P_fnSummNoteImgUpload(files[0], this, editorId);
					}
			    },
			    
			    //kw---20240614 : summernote - 기능 수정 (테이블 관련)
			    onPaste: function(e) {
			    	Utils.summerPate(e, editorId);
	            }
		  },
		  tableClassName: 'table table-bordered summernote-table', //kw---20240614 : summernote - 기능 수정 (테이블 관련)
	});
}

function CMMT300P_fnSummNoteImgUpload(file, editor, nId) {
	
	var formData = new FormData();
	
	formData.append('img_files', file);
	
	formData.append('COMM100INS01_data',JSON.stringify({
		tenantId : GLOBAL.session.user.tenantId
		, UsrId : GLOBAL.session.user.user
		, orgCd : GLOBAL.session.user.orgCd
		, uploadPath : "CMMT_CNTS_TMP"
	}));

	Utils.ajaxCallFormData('/comm/COMM100INS01',formData,function(data){
		let fileSaveData = JSON.parse(data.info);
		for(var i=0; i<fileSaveData.length; i++){
			let url = GLOBAL.contextPath+"/cmmtphotocntstmp/"+GLOBAL.session.user.tenantId+"/"+fileSaveData[i].apndFileIdxNm;
			$('#'+nId).summernote('insertImage', url);
		}
	});	
}

function CMMT300P_fnSummEdtCMMT300P() {
	let screenHeight = $(window).height()-210;     // (헤더+ 푸터 ) 영역 높이 제외
	$('#CMMT300P_divContEdit').css('height', screenHeight-60);   // 에디터 height
}


// 승인버튼
function CMMT300P_fnSetAppr(){
	// 상태 승인 변경,
	Utils.confirm(CMMT300P_langMap.get("CMMT300P.saveAppr"),function () {
			if (!Utils.isNull(CMMT300P_blthgMgntNo)) {// 수정
				if (CMMT300P_blthgStCd == CMMT300P_KldStCd.approvalRequestNew) {
					CMMT300P_fnStateUpdateData(CMMT300P_blthgMgntNo, CMMT300P_KldStCd.approvedNew);
				}else if(CMMT300P_blthgStCd == CMMT300P_KldStCd.approvalRequestChange){
					CMMT300P_fnStateUpdateData(CMMT300P_blthgMgntNo, CMMT300P_KldStCd.approveChange);
				}else {
					Utils.alert(CMMT300P_langMap.get("CMMT300P.notapprStt"));
				}
			}else{
				Utils.alert(CMMT300P_langMap.get("CMMT300P.notapprStt"));
			}
		},function(){}
	);
}

// 반려버튼
function CMMT300P_fnSetDecl(){
	if (!Utils.isNull(CMMT300P_blthgMgntNo)) {// 수정
		Utils.setCallbackFunction("CMMT300P_fnCallback", function(item) {
			if (CMMT300P_blthgStCd == CMMT300P_KldStCd.approvalRequestNew) {
				CMMT300P_fnStateUpdateData(CMMT300P_blthgMgntNo,CMMT300P_KldStCd.returnNew);
			}else if(CMMT300P_blthgStCd == CMMT300P_KldStCd.approvalRequestChange){
				CMMT300P_fnStateUpdateData(CMMT300P_blthgMgntNo,CMMT300P_KldStCd.returnChange);
			}else {
				Utils.alert(CMMT300P_langMap.get("CMMT300P.notapprStt"));
			}
		});

		let param = {
			callbackKey: "CMMT300P_fnCallback",
			category: 'C',
			ctgrNo : CMMT300P_selCtg.id,
			mgntNo: CMMT300P_blthgMgntNo
		};
		window.kendoPopupData_CMMT330P = param
		Utils.openKendoWindow("/cmmt/CMMT330P", 500, 300, "center", 0, 50, false,param);

	}else{
		Utils.alert(CMMT300P_langMap.get("CMMT300P.notapprStt")); return;
	}

	let apprStCd;

	for (let i = 0; i < CMMT300P_cmmCodeList.length; i++) {
		if(CMMT300P_cmmCodeList[i].mgntItemCd == 'C0084' && CMMT300P_cmmCodeList[i].comCdNm == $('#CMMT300P_blthgStCdNm').val()){
			apprStCd = CMMT300P_cmmCodeList[i].comCd;
		}
	}
}
