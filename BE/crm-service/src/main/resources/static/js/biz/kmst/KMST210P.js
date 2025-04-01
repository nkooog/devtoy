/***********************************************************************************************
 * Program Name : 지식등록 (KMST210P.js)
 * Creator      : djjung
 * Create Date  : 2022.07.11
 * Description  : 지식등록
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.07.11     djjung           최초작성
 ************************************************************************************************/
var KMST210P_editor, KMST210P_commCodeList;
var KMST210P_FileList=[],KMST210P_CntnsList=[],KMST210P_KeyWordList =[], KMST210P_counselList =[];
var KMST210P_IndexList = [],KSMT210P_editImg=[];
var KMST210P_SetText="";
var KMST210P_KldStCd={
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

var KMST210P_contSelect = "";
var KMST210P_contArrObj = [];
var KMST210P_contArrObj2 = [];
var KMST210P_contArrObj3 = [];

var KMST210P_divTopHeight;
var KMST210P_contFullScreenYn = false;

var KMST210P_contNum = 1;
var KMST210P_contNumTotal = 0;


$(document).ready(function () {

	const $target1 = document.getElementById('KMST210P_divTop');
	const $target2 = document.getElementById('KMST210P_divTopInfo');

	const observer = new ResizeObserver((entries) => {
	  // 관찰 중인 배열 형식의 객체 리스트
	  entries.forEach((entry) => {
		  KMST210P_Resize();
	  });
	});

	// 크기변화를 관찰할 요소지정
	observer.observe($target1);
	observer.observe($target2);
	
	
	
	//1.Common Code Set
	KMST210P_fnCommCdGet()

	//2. CrossEditor Init
//	KMST210P_editor = cEditor.Creater("KMST210P_editor",100,390,2,KMST210P_imgUpload);

	//3. Parent Data Load
	KMST210P_fnInitParentData();

	//4.Editor hight Resizeing Setting
	KMST210P_fnResizeTableKMST210M();
	$(window).on({	'resize': function() {	KMST210P_fnResizeTableKMST210M();},	});

	//5. Button State
	KSMT210P_fnButtonEnableDisable();
	
	//kw---20230810 컨텐츠상세내용 버튼 막기
//	fnKldInfoSucc(true);
	
	//kw---20230829 : 특정 에디터들만 확대 하도록
//	$("#KMST210P_edtContEdit_big").summernote({
//		height: 180,                 // set editor height
//		minHeight: 180,             // set minimum height of editor
//
//		toolbar: [
//			  ['style', ['style']],
//			  ['font', ['bold', 'underline', 'clear']],
//			  ['fontname', ['fontname']],
//			  ['color', ['forecolor','color']],
//			  ['para', ['paragraph']],
//			  ['table', ['table']],
//			  ['view', ['codeview']],
//			  ['insert', ['link', 'picture']],
//		  ],
//		  callbacks: {
//			    onImageUpload : function(files) {
//					  KMST210P_fnSummNoteImgUpload(files[0], this, nId);
//					},
//			  },
//	});
	
});
//1.Common Code Set
function KMST210P_fnCommCdGet(){
	let KMST210P_mgntItemCdList = [{"mgntItemCd":"C0061"},{"mgntItemCd":"C0082"},{"mgntItemCd":"C0084"}];
	Utils.ajaxSyncCall('/comm/COMM100SEL01',  JSON.stringify({ "codeList": KMST210P_mgntItemCdList}),
		function(data){
			KMST210P_commCodeList = JSON.parse(JSON.parse(JSON.stringify(data.codeList)));
			Utils.setKendoComboBox(KMST210P_commCodeList, "C0082", '#KMST210P input[name=KMST210P_CntnsType]',"","선택");
	},null,null,null );
}
//3. Parent Data Load
function KMST210P_fnInitParentData() {
	let brdPath = $(opener.document).find('#KMST200M span[name=KMST200_catagoryPath]')[0].textContent;
	let ctgrNo = Utils.getUrlParam("ctgrNo");
	let callFunction = Utils.getUrlParam("callbackKey");

	if(!Utils.isNull(brdPath)) {
		$('#KMST210P input[name=KMST210P_CategoryPath]').val(brdPath);
		$('#KMST210P input[name=KMST210P_CategoryNum]').val(ctgrNo);
	}

	if(callFunction==="KMST200M_fnCreateDoc"){ //등록 화면
		$('#KMST210P input[name=KMST210P_regId]').val(GLOBAL.session.user.decUsrNm + "("+GLOBAL.session.user.usrId+")");
		$('#KMST210P input[name=KMST210P_CompanionText]').prop('disabled', true);
		$('#KMST210P button[name=KMST210_dateStart_btn4]').click();

	}else{ //수정 화면
		let regrNm =  $(opener.document).find('#KMST200M input[name=KMST200_regrNm]')[0].value;
		$('#KMST210P input[name=KMST210P_regId]').val(regrNm);

		let cntntsNo = Utils.getUrlParam("cntntsNo");
		$('#KMST210P input[name=KMST210P_CntnsNum]').val(cntntsNo);

		let kldStCd = Utils.getUrlParam("kldStCd");
		$('#KMST210P input[name=KMST210P_CntnsStatusCd]').val(kldStCd);
		$('#KMST210P input[name=KMST210P_CntnsStatus]').val(Utils.getComCdNm(KMST210P_commCodeList, "C0084",kldStCd));


		let param = {
			tenantId :GLOBAL.session.user.tenantId,
			ctgrNo: ctgrNo,
			cntntsNo: cntntsNo
		}
		//조회
		Utils.ajaxCall("/kmst/KMST210SEL02", JSON.stringify(param),function (data){
			let item = JSON.parse(JSON.parse(JSON.stringify(data.info)));

			$('#KMST210P input[name=KMST210P_Title]').val(item.cntntsTite);
			
			if(Utils.isNull($("#KMST210P_Title").val())){
				$("#KMST210P_spnTitle").text("지식등록");
			} else {
				$("#KMST210P_spnTitle").text("지식등록 - " + $("#KMST210P_Title").val());
			}
			
			$('#KMST210P input[name=KMST210P_CntnsType_input]').val(Utils.getComCdNm(KMST210P_commCodeList, "C0082",item.cntntsTypCd));

			$('#KMST210_dateStart').val(KMST210P_fnDateChage(item.cntntsValdTrmStrDd));
			$('#KMST210_dateEnd').val(KMST210P_fnDateChage(item.cntntsValdTrmEndDd));

			if(item.cntntsRpsImg != null){
				$('#KMST210P_imgView').css("display",'block');
				$('#KMST210P_figcap').css("display",'none');
				$('#KMST210P_imgView')[0].src =  GLOBAL.contextPath+"/kmstphotoimg/"+ item.tenantId+"/"+item.cntntsRpsImgIdxNm;
			}

			if(item.kldTop10DispYn =="Y"){
				$('#KMST210P input[name=KMST210P_Top10]').prop('checked', true);
			}
			//파일
			for (let i of item.kmst211VoList) {
				KMST210P_SetText += Utils.htmlDecode(i.moktiTite);
				KMST210P_SetText += Utils.htmlDecode(i.cntntsCtt);
			}
			
			let contLstAddId1;
			let contLstAddId2;
			for (let i of item.kmst211VoList) {
				
				if(i.moktiPrsLvl == "1"){
					

					
					let idNum = KMST210P_contArrObj.length;
					let addId = "l1_" + idNum;
					let lstAddLv2 = [];					//자식 아이템을 담기 위한 배열
					
					let obj = {
							divId				: "KMST210P_divContTitle_" + addId,
							contIdNum			: idNum,
							contNo				: (idNum+1),
							checkboxId			: "KMST210P_chkCont_" + addId,
							divEditId			: "KMST210P_divContEdit_" + addId,
							btnEditView			: "KMST210P_btnContEditView_" + addId,
							contSubItemL2		: 0,
							contSubItemL3		: 0,
							lstAddLv2			: lstAddLv2,
							id					: addId,
							moktiNo				: i.moktiNo,
							cntntsCtt		: i.cntntsCtt.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
						}
					
					KMST210P_contArrObj.push(obj);
					
					
					KMST210P_fnContListDivAdd(addId);
					
					if(i.moktiTite.includes('&lt')){
						let strMokTitle = i.moktiTite;
						
						let arrMokTitle1 = strMokTitle.split('&lt;');
						strMokTitle = arrMokTitle1[1];

						let arrMokTitle2 = strMokTitle.split('&gt;');
						i.moktiTite = arrMokTitle2[1];
					}
					
					$('#KMST210P_inpContTitle_' + addId).val(i.moktiTite);				
					
					
					contLstAddId1 = addId;
					
					KMST210P_contNum++;
					KMST210P_contNumTotal++;
				}
				else if(i.moktiPrsLvl == "2"){
					for(var j=0; j<KMST210P_contArrObj.length; j++){
						if(KMST210P_contArrObj[j].moktiNo == i.hgrkMoktiNo){
							
							let idNum = KMST210P_contArrObj[j].lstAddLv2.length;
							let addId = "l2_" + KMST210P_contArrObj[j].contIdNum + "_" + idNum;
							let addNo = KMST210P_contArrObj[j].contNo + "." + (idNum+1)
							
							KMST210P_contArrObj[j].lstAddLv2.push(addId);
							
							let lstAddLv3 = [];
							let obj = {
									divId			: "KMST210P_divContTitle_" + addId,
									contIdNum		: KMST210P_contArrObj[j].contIdNum,
									contIdNumLv2	: idNum,
									contNo			: addNo,
									contNo2			: (idNum+1),
									checkboxId		: "KMST210P_chkCont_" + addId,
									divEditId		: "KMST210P_divContEdit_" + addId,
									btnEditView		: "KMST210P_btnContEditView_" + addId,
									id				: addId,
									idLv1			: KMST210P_contArrObj[j].id,
									lstAddLv3		: lstAddLv3,
									moktiNo			: i.moktiNo,
									cntntsCtt		: i.cntntsCtt.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
								}
							
							KMST210P_contArrObj2.push(obj);
							
							KMST210P_fnContListSubDivAdd(addNo, addId, contLstAddId1, "l2");
							
							$('#KMST210P_inpContTitle_' + addId).val(i.moktiTite);					
//							$('#KMST210P_edtContEdit_' + addId).summernote('pasteHTML', i.cntntsCtt.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
							
							contLstAddId2 = addId;
						}
					}
				}
				else if(i.moktiPrsLvl == "3"){
					for(var j=0; j<KMST210P_contArrObj2.length; j++){
						if(KMST210P_contArrObj2[j].moktiNo == i.hgrkMoktiNo){
							
							let idNum = KMST210P_contArrObj2[j].lstAddLv3.length;
							let addId = "l3_" + KMST210P_contArrObj2[j].contIdNum + "_" + KMST210P_contArrObj2[j].contIdNumLv2 + "_" + idNum;
							let addNo = KMST210P_contArrObj2[j].contNo + "." + (idNum+1);
							
							KMST210P_contArrObj2[j].lstAddLv3.push(addId);
							
							let lstAddLv3 = [];
							
							let obj = {
									divId			: "KMST210P_divContTitle_" + addId,
									contIdNum		: KMST210P_contArrObj2[j].contIdNum,
									contIdNumLv2	: KMST210P_contArrObj2[j].contIdNumLv2,
									contIdNumLv3	: idNum,
									contNo			: addId,
									checkboxId		: "KMST210P_chkCont_" + addId,
									divEditId		: "KMST210P_divContEdit_" + addId,
									btnEditView		: "KMST210P_btnContEditView_" + addId,
									idLv2			: KMST210P_contArrObj2[j].id,
									id				: addId,
									cntntsCtt		: i.cntntsCtt.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
								}
							
							KMST210P_contArrObj3.push(obj);
							
							KMST210P_fnContListSubDivAdd(addNo, addId, contLstAddId2, "l3");
							
							$('#KMST210P_inpContTitle_' + addId).val(i.moktiTite);					
//							$('#KMST210P_edtContEdit_' + addId).summernote('pasteHTML', i.cntntsCtt.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
							
							
							contLstAddId = addId;
						}
					}
				}
			}
			for(var i=0; i<KMST210P_contArrObj.length; i++){
				if(!Utils.isNull(KMST210P_contArrObj[i].cntntsCtt.trim())){
					$('#KMST210P_edtContEdit_' + KMST210P_contArrObj[i].id).summernote('pasteHTML', KMST210P_contArrObj[i].cntntsCtt);					
				}
				
			}
			
			for(var i=0; i<KMST210P_contArrObj2.length; i++){
				if(!Utils.isNull(KMST210P_contArrObj2[i].cntntsCtt.trim())){
					$('#KMST210P_edtContEdit_' + KMST210P_contArrObj2[i].id).summernote('pasteHTML', KMST210P_contArrObj2[i].cntntsCtt);
				}
			}
			
			for(var i=0; i<KMST210P_contArrObj3.length; i++){
				if(!Utils.isNull(KMST210P_contArrObj3[i].cntntsCtt.trim())){
					$('#KMST210P_edtContEdit_' + KMST210P_contArrObj3[i].id).summernote('pasteHTML', KMST210P_contArrObj3[i].cntntsCtt);
				}
			}
			

			for (let i of item.kmst212VoList) {
				Utils.ajaxCallFileDownload("/kmst/KMST210SEL03",i.apndFilePsn,i.apndFileIdxNm,function (fileBinary){
					let file = new File([fileBinary],i.apndFileNm);
						KMST210P_FileList.push(file);

						let KMST210P_addFile =
							'<li><mark class="icoComp_download"></mark><span onclick="KMST210P_fnDownloadFile(\''+i.apndFileNm+'\');">'+i.apndFileNm+
							'<small>('+KMST210P_fnSubFormatBytes(file.size)+')</small></span>';
						if (!(kldStCd == KMST210P_KldStCd.approvalRequestNew || kldStCd == KMST210P_KldStCd.approvalRequestChange)) {
							KMST210P_addFile += '<button class="btDelete k-icon k-i-x" onclick="KMST210P_fnDeleteFile(this)" title="삭제"></button>';
						}
						KMST210P_addFile +='</li>';



						$('#KMST210P ul[name=KMST210P_fileList]').append(KMST210P_addFile);

						KMST210P_fnSubTotalSize();
				},null,null,null);
			}
			
			//kw---20230906 : 연관키워드 표출
			for (let i of item.kmst215VoList) {
				KMST210P_KeyWordList.push(i.assocKeywordNm);
				
				let item ='<li><span>'+i.assocKeywordNm+'</span><button onclick="KMST210P_fnKeyWordDelete(this)" class="btDelete k-icon k-i-x" title="삭제"></button></li>';
				$('#KMST210P ul[name=KMST210P_KeyWoardList]').append(item);
			}
			
			


			// 버튼 동작
			if(kldStCd==KMST210P_KldStCd.approvalRequestNew ||kldStCd==KMST210P_KldStCd.approvalRequestChange||
				kldStCd==KMST210P_KldStCd.deleteAdmin ||kldStCd==KMST210P_KldStCd.expiration){
				//수정불가능
				CMMN_INPUT_DATE["KMST210_dateStart"].startDateDp.readonly();
				CMMN_INPUT_DATE["KMST210_dateStart"].endDateDp.readonly();
				$('#KMST210_dateStart_btn0').attr("disabled", true);
				$('#KMST210_dateStart_btn1').attr("disabled", true);
				$('#KMST210_dateStart_btn2').attr("disabled", true);
				$('#KMST210_dateStart_btn3').attr("disabled", true);
				$('#KMST210_dateStart_btn4').attr("disabled", true);
				$('#KMST210_dateStart_btn5').attr("disabled", true);
				$('#KMST210P input[name=KMST210P_CntnsType_input]')[0].parentNode.childNodes[1].disabled =true;
				$('#KMST210P input[name=KMST210P_Title]').attr("disabled",true);
				$('#KMST210P input[name=KMST210P_Top10]').attr("disabled",true);
			}

		},null,function (){},null);
	}

	KMST210P_fnSetCategorInfo();
}
//4. Editor hight Setting
function KMST210P_fnResizeTableKMST210M() {
//	let screenHeight = $(window).height()-210;     //   (헤더+ 푸터 ) 영역 높이 제외
//	$('#KMST210P_editor').css('height', screenHeight-250);   //   에디터 height
//	KMST210P_editor.SetUISize("", (screenHeight-250));
}
//5. Button State
function KSMT210P_fnButtonEnableDisable(){
	let state = $('#KMST210P input[name=KMST210P_CntnsStatusCd]').val()*1;
	if(KMST210P_KldStCd.new !=state){
		$('#KMST210P button[name=KMST210P_BtnCategorySearch]').attr("disabled", true);
	}

	if(KMST210P_KldStCd.writing===state ||KMST210P_KldStCd.new ===state){
		$('#KMST210P button[name=KMST210P_btnApproval]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnDisposal]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnDisposalList]').attr("disabled",true);
	}else if(KMST210P_KldStCd.approvalRequestNew===state ||KMST210P_KldStCd.approvalRequestChange===state){
		$('#KMST210P button[name=KMST210P_BtnCategorySearch]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_BtnAddImg]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_BtnRemoveImg]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnFileAdd]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnRelationCntntAdd]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnRelationKeyWardAdd]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnInit]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnTempSave]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnSave]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnDisposalList]').attr("disabled",true);
	}else if(KMST210P_KldStCd.approvedNew===state||KMST210P_KldStCd.approveChange===state){
		$('#KMST210P button[name=KMST210P_btnInit]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnApproval]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnDisposal]').attr("disabled", true);
	}else if(KMST210P_KldStCd.returnNew===state ||KMST210P_KldStCd.returnChange===state){
		$('#KMST210P button[name=KMST210P_btnApproval]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnDisposal]').attr("disabled", true);
	}else if(KMST210P_KldStCd.expiration===state ||KMST210P_KldStCd.deleteAdmin===state){
		$('#KMST210P button[name=KMST210P_BtnCategorySearch]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_BtnAthtDetail]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_BtnAddImg]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_BtnRemoveImg]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnFileAdd]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnRelationCntntAdd]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnRelationKeyWardAdd]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnInit]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnPreView]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnApproval]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnDisposal]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnTempSave]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnSave]').attr("disabled", true);
		$('#KMST210P button[name=KMST210P_btnDisposalList]').attr("disabled",true);
	}
}
//6.Editor Onload After
function OnInitCompleted(e) {
//	let kldStCd = Utils.getUrlParam("kldStCd");
//	if(KMST210P_SetText !==""){
//		KMST210P_editor.SetValue(KMST210P_SetText);
//		if(kldStCd==KMST210P_KldStCd.approvalRequestNew ||kldStCd==KMST210P_KldStCd.approvalRequestChange||
//			kldStCd==KMST210P_KldStCd.deleteAdmin ||kldStCd==KMST210P_KldStCd.expiration){//수정불가능
//			KMST210P_editor.SetReadonly(true);
//		}
//	}

}


//Call Function=========================================================================================================

//카테고리 설정 Call
function KMST210P_fnSetCategorInfo(){
	let parm = {
		tenantId: GLOBAL.session.user.tenantId, ctgrNo : $('#KMST210P input[name=KMST210P_CategoryNum]').val()
	}
	Utils.ajaxCall('/kmst/KMST210SEL01',  JSON.stringify(parm),function(data){
		let catgoryInfo = JSON.parse(JSON.parse(JSON.stringify(data.info)));

		if(catgoryInfo.cntntsRegApvNcsyYn ==="Y"){ $('#KMST210P input[name="KMST210P_RegApv"]').prop('checked', true);}
		else{$('#KMST210P input[name="KMST210P_RegApv"]').prop('checked', false);}

		if(catgoryInfo.dashBrdDispPmssYn ==="Y"){$('#KMST210P input[name="KMST210P_DashView"]').prop('checked', true);}
		else{$('#KMST210P input[name="KMST210P_DashView"]').prop('checked', false);}

		$('#KMST210P input[name="KMST210P_athtCd"]').val(catgoryInfo.ctgrUseAthtCd);
		let athtName =Utils.getComCdNm(KMST210P_commCodeList,"C0061",catgoryInfo.ctgrUseAthtCd);
		$('#KMST210P input[name="KMST210P_athtName"]').val(athtName);
	},null,null,null);
}
//저장 Call
function KMST210P_fnSaveData(cntntsNo,kldStCd){
	let KMST210VO = KMST210P_SetFormData(cntntsNo,kldStCd);
	
	if(KMST210VO != null){

		Utils.ajaxCallFormData('/kmst/KMST210INS01',KMST210VO,function(data){
			let item = JSON.parse(JSON.parse(JSON.stringify(data.info)));
			if(item.tenantId != null){
				$('#KMST210P input[name=KMST210P_CntnsNum]').val(item.cntntsNo);
				$('#KMST210P input[name=KMST210P_CntnsStatusCd]').val(item.kldStCd);
				$('#KMST210P input[name=KMST210P_CntnsStatus]').val(Utils.getComCdNm(KMST210P_commCodeList, "C0084",item.kldstCd));

				if(item.kldStCd == KMST210P_KldStCd.approvalRequestNew ||item.kldStCd == KMST210P_KldStCd.approvalRequestChange
					||item.kldStCd == KMST210P_KldStCd.approvedNew ||item.kldStCd == KMST210P_KldStCd.approveChange){

					Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))($('#KMST210P input[name=KMST210P_CategoryNum]').val());
					window.close();
					
//					Utils.alert("정상 저장 되었습니다.");
//					fnKldInfoSucc(false);
				}else{
					Utils.alert("정상 저장 되었습니다.");
				}
			}else{
				Utils.alert("저장 실패 하였습니다.");
			}
		},null,null,null);
	}else{

	}
}
//수정 Call
function KMST210P_fnUpdateData(cntntsNo,kldStCd){
	let KMST210VO = KMST210P_SetFormData(cntntsNo,kldStCd);
	if(KMST210VO != null){
		Utils.ajaxCallFormData('/kmst/KMST210UPT01',KMST210VO,function(data){
			let item = JSON.parse(JSON.parse(JSON.stringify(data.info)));
			if(item.tenantId != null){
				$('#KMST210P input[name=KMST210P_CntnsNum]').val(item.cntntsNo);
				$('#KMST210P input[name=KMST210P_CntnsStatusCd]').val(item.kldStCd);
				$('#KMST210P input[name=KMST210P_CntnsStatus]').val(Utils.getComCdNm(KMST210P_commCodeList, "C0084",item.kldstCd));

				if(item.kldStCd == KMST210P_KldStCd.approvalRequestNew ||item.kldStCd == KMST210P_KldStCd.approvalRequestChange
				||item.kldStCd == KMST210P_KldStCd.approvedNew ||item.kldStCd == KMST210P_KldStCd.approveChange){
					Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))($('#KMST210P input[name=KMST210P_CategoryNum]').val());
					window.close();
				}else{
					Utils.alert("정상 수정 되었습니다.");
				}
			}else{
				Utils.alert("수정 실패 하였습니다.")
			}
		},null,null,null);
	}else{

	}
}
//상태 변경 Call
function KMST210P_fnStateUpdateData(cntntsNo,kldStCd){
	let KMST210VO = KMST210P_SetChangeStae(cntntsNo,kldStCd);
	if(KMST210VO != null){
		Utils.ajaxCall('/kmst/KMST210UPT02',JSON.stringify(KMST210VO),function(data){
			let item = JSON.parse(JSON.parse(JSON.stringify(data.result)));
			if(item>0){
				if(kldStCd == KMST210P_KldStCd.returnNew ||kldStCd == KMST210P_KldStCd.returnChange
					||kldStCd == KMST210P_KldStCd.approvedNew ||kldStCd == KMST210P_KldStCd.approveChange){
					Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))($('#KMST210P input[name=KMST210P_CategoryNum]').val());
					window.close();
				}
			}else{
				Utils.alert("수정 실패 하였습니다.")
			}
		},null,null,null);
	}else{

	}
}
//전송용 데이터 세팅
function KMST210P_SetFormData(cntntsNo,kldStCd){

	if(KMST210P_fnSubCreateCntntTreeListNew()){
		return;
	}
	
	if(KMST210P_IndexList ===[]){
		return;
	}

	let KMST210VO =new FormData();

	//컨텐츠
	KMST210VO.append('tenantId', GLOBAL.session.user.tenantId);
	KMST210VO.append('ctgrNo', $('#KMST210P input[name=KMST210P_CategoryNum]').val());
	KMST210VO.append('cntntsNo',cntntsNo);
	KMST210VO.append('cntntsTite', $('#KMST210P input[name=KMST210P_Title]').val());
	KMST210VO.append('cntntsTypCd', $('#KMST210P input[name=KMST210P_CntnsType]').val());
	KMST210VO.append('kldTop10DispYn', $('#KMST210P input[name=KMST210P_Top10]').prop('checked') ? 'Y' : 'N') ;
	KMST210VO.append('kldStCd',kldStCd );
	if($('#KMST210P input[name=KMST210P_Imgfile]')[0].files.length>0){
		KMST210VO.append('file', $('#KMST210P input[name=KMST210P_Imgfile]')[0].files[0]);
	}
	KMST210VO.append('cntntsValdTrmStrDd', $('#KMST210_dateStart').val().replaceAll("-" , "")  );
	KMST210VO.append('cntntsValdTrmEndDd', $('#KMST210_dateEnd').val().replaceAll("-" , ""));
	KMST210VO.append('permValdYn', $('#KMST210P input[name=KMST210_dateIseverlasting]').val());
	KMST210VO.append('cntntsRegApvNcsyYn', $('#KMST210P input[name=KMST210P_RegApv]').prop('checked') ? 'Y':'N');
	KMST210VO.append('regrId', GLOBAL.session.user.usrId);
	KMST210VO.append('regrNm', GLOBAL.session.user.decUsrNm);
	KMST210VO.append('regrOrgCd', GLOBAL.session.user.orgCd);


	//컨텐츠 목차 & 내용
	for(let i=0; i<KMST210P_IndexList.length;i++){
		KMST210VO.append('kmst211VoList['+i+'].moktiNo', KMST210P_IndexList[i].moktiNo);
		KMST210VO.append('kmst211VoList['+i+'].moktiTite', KMST210P_IndexList[i].moktiTite);
		KMST210VO.append('kmst211VoList['+i+'].hgrkMoktiNo', KMST210P_IndexList[i].hgrkMoktiNo);
		KMST210VO.append('kmst211VoList['+i+'].moktiPrsLvl', KMST210P_IndexList[i].moktiPrsLvl);
		KMST210VO.append('kmst211VoList['+i+'].cntntsCtt', KMST210P_IndexList[i].cntntsCtt);
		KMST210VO.append('kmst211VoList['+i+'].cntntsCttTxt', KMST210P_IndexList[i].cntntsCttTxt);
	}

	//컨텐츠 첨부파일
	for(let i=0; i<KMST210P_FileList.length;i++){
		KMST210VO.append('kmst212VoList['+i+'].file', KMST210P_FileList[i]);
	}

	//연관 컨텐츠
	for(let i=0; i<KMST210P_CntnsList.length;i++){
		KMST210VO.append('relationCntnts['+i+']', KMST210P_CntnsList[i]);
	}

	//연관 키워드
	for(let i=0; i<KMST210P_KeyWordList.length;i++){
		KMST210VO.append('relationKewords['+i+']', KMST210P_KeyWordList[i]);
	}
	
	for(let i=0; i<KMST210P_counselList; i++){
		KMST210VO.append('relationcounsel['+i+']', KMST210P_counselList[i]);
	}
	return KMST210VO;
}
//상태변경용 데이터 세팅
function KMST210P_SetChangeStae(cntntsNo,kldStCd){

	let KMST210VO = {
		'tenantId': GLOBAL.session.user.tenantId,
		'ctgrNo'    : $('#KMST210P input[name=KMST210P_CategoryNum]').val(),
		'cntntsNo'  : cntntsNo,
		'kldStCd'   : kldStCd,
		'regrId'    : GLOBAL.session.user.usrId,
		'regrNm'    : GLOBAL.session.user.decUsrNm,
		'regrOrgCd' : GLOBAL.session.user.orgCd
	}
	return KMST210VO;
}

//버튼 이벤트-----------------------------------------------------------------------------------------------------------
//카테고리 찾기 클릭
$('#KMST210P button[name=KMST210P_BtnCategorySearch]').off("click").on('click', function () {
	Utils.setCallbackFunction("KMST210P_fnCatgrSearchCallBack",function(item){
		$('#KMST210P input[name="KMST210P_CategoryPath"]').val(item[0].brdpath);
		$('#KMST210P input[name="KMST210P_CategoryNum"]').val(item[0].id);
		KMST210P_fnSetCategorInfo();
	});
	Utils.openKendoWindow("/kmst/KMST220P",400,600, "left",452,90,
		false,{callbackKey: "KMST210P_fnCatgrSearchCallBack",type:"write"});
});
//카테고리 권한 상세 클릭버튼
$('#KMST210P button[name=KMST210P_BtnAthtDetail]').off("click").on('click', function () {
	let parm = {
		tenantId: GLOBAL.session.user.tenantId,
		ctgrNo : $('#KMST210P input[name=KMST210P_CategoryNum]').val()
	}
	let url = "/kmst/KMST22"+$('#KMST210P input[name="KMST210P_athtCd"]').val()+"P"
	Utils.openKendoWindow(url,1000,510, "left",452,190,false, parm);
});
//이미지 추가 버튼
$('#KMST210P button[name=KMST210P_BtnAddImg]').off("click").on('click', function () {
	$('#KMST210P input[name=KMST210P_Imgfile]').click();
});
//이미지 추가후 이벤트
function KMST210P_fnIMGFileLoad (obj) {
	KMST210P_fnSubuploadFileCheck(obj.files[0],"IMG");
	if (obj.files[0]) {
		let reader = new FileReader();
		reader.onload = function(e) {
			$('#KMST210P_imgView').css("display",'block');
			$('#KMST210P_figcap').css("display",'none');
			$('#KMST210P_imgView')[0].src = e.target.result;
		};
		reader.readAsDataURL(obj.files[0]);
	} else {
		$('#KMST210P_imgView')[0].src = "";
		$('#KMST210P_imgView').css("display",'none');
		$('#KMST210P_figcap').css("display",'block');
	}
}
//이미지 삭제 버튼
$('#KMST210P button[name=KMST210P_BtnRemoveImg]').off("click").on('click', function () {
	$('#KMST210P_imgView')[0].src = "";
	$('#KMST210P_imgView').css("display",'none');
	$('#KMST210P_figcap').css("display",'block');
	$('#KMST210P input[name=KMST210P_Imgfile]').val("");
});
//파일 추가 버튼
$('#KMST210P button[name=KMST210P_btnFileAdd]').off("click").on('click', function () {
	$('#KMST210P_mFile').click();
});
//파일 추가 이벤트 (KMST210P_mFile)
function KMST210P_apndFile(obj){
	//파일이름 중복 제거
	if(KMST210P_FileList.length === 0){
		KMST210P_FileList = Array.from(obj.files);
	}else {
		for (i = 0; i < obj.files.length; i++) {
			let count = KMST210P_FileList.filter(x => x.name == obj.files[i].name).length;
			if (count == 0) {
				KMST210P_FileList.push(obj.files[i]);
			}
		}
	}
	//파일초기화
	$('#KMST210P_mFile').val("");
	//UI 초기화
	$('#KMST210P ul[name=KMST210P_fileList] *').remove();

	for(i=0; i<KMST210P_FileList.length;i++){
		//JDJ 파일체크
		//if(KMST210P_fnSubuploadFileCheck(KMST210P_FileList[i],"FILE")){

		//}
		let KMST210P_addFile =
			'<li><mark class="icoComp_download"></mark><span onclick="KMST210P_fnDownloadFile(\''+KMST210P_FileList[i].name+'\')">'+KMST210P_FileList[i].name+'<small>('+KMST210P_fnSubFormatBytes(KMST210P_FileList[i].size)+')</small></span>'
			+ '<button class="btDelete k-icon k-i-x" onclick="KMST210P_fnDeleteFile(this)" title="삭제"></button> </li>';
		$('#KMST210P ul[name=KMST210P_fileList]').append(KMST210P_addFile);
	}
	// total setting
	KMST210P_fnSubTotalSize();
}
//파일 선택시
function KMST210P_fnDownloadFile(fileName) {
	let data =KMST210P_FileList.find(x => x.name === fileName);
	let path = window.URL.createObjectURL(data);
	let link = document.createElement('a')
	link.href = path;
	link.download = data.name;
	link.click();
	link.remove();
}
//파일 삭제버튼 클릭시
function KMST210P_fnDeleteFile(obj) {
	let filename = obj.parentNode.childNodes[1].childNodes[0].data;
	KMST210P_FileList = KMST210P_FileList.filter(x => x.name !=filename);
	$(obj.parentNode).remove();

	KMST210P_fnSubTotalSize();
}


//연관 컨텐츠 추가 버튼
$('#KMST210P button[name=KMST210P_btnRelationCntntAdd]').off("click").on('click', function () {
	
	let tbox = document.createElement('input');
	tbox.type = "text";
	tbox.name = "KMST210P_CntnsTempInput";
	tbox.className ="k-input";
	tbox.onblur = function(e){
		let text = $('#KMST210P input[name=KMST210P_CntnsTempInput]').val();
		if(KMST210P_CntnsList.filter(x => x ===text).length ==0){
			let item ='<li><span>'+text+'</span><button onclick="KMST210P_fnCntntDelete(this)" class="btDelete k-icon k-i-x" title="삭제"></button></li>';
			this.parentNode.remove();
			KMST210P_CntnsList.push(text);
			$('#KMST210P ul[name=KMST210P_CntnsList]').append(item);
			$('#KMST210P button[name=KMST210P_btnRelationCntntAdd]').prop('disabled', false);

		} else{
				Utils.alert("연관 컨텐츠가 중복됩니다. 다시 입력하세요.");
			
		}
		
		if(text.length == 0){
			$("#KMST210P_fnCntntDelete").trigger("click");
		}
	}
	let li = document.createElement('li');
	li.append(tbox);

	$('#KMST210P ul[name=KMST210P_CntnsList]').append(li);

	$('#KMST210P button[name=KMST210P_btnRelationCntntAdd]').prop('disabled', true);
	$('#KMST210P input[name=KMST210P_CntnsTempInput]').focus();
	

});
function KMST210P_fnCntntDelete(obj){
	let cntnt = obj.parentNode.childNodes[0].childNodes[0].data;
	KMST210P_CntnsList = KMST210P_CntnsList.filter(x => x !=cntnt);
	$(obj.parentNode).remove();
}

//연관 키워드 추가 버튼
$('#KMST210P button[name=KMST210P_btnRelationKeyWardAdd]').off("click").on('click', function () {
	
	let tbox = document.createElement('input');
	tbox.type = "text";
	tbox.name = "KMST210P_KeyWordTempInput";
	tbox.className ="k-input";
	
	tbox.onblur = function(e){
		let text = '#'+$('#KMST210P input[name=KMST210P_KeyWordTempInput]').val();
		
		//kw---20230906 : 키워드 입력시 아무것도 입력하지 않았을 경우
		if(text == "#"){
			this.parentNode.remove();
			$('#KMST210P button[name=KMST210P_btnRelationKeyWardAdd]').prop('disabled', false);
		} else {
			if(KMST210P_KeyWordList.filter(x => x ===text).length ==0){
				let item ='<li><span>'+text+'</span><button onclick="KMST210P_fnKeyWordDelete(this)" class="btDelete k-icon k-i-x" title="삭제"></button></li>';
				this.parentNode.remove();
				KMST210P_KeyWordList.push(text);
				$('#KMST210P ul[name=KMST210P_KeyWoardList]').append(item);
				$('#KMST210P button[name=KMST210P_btnRelationKeyWardAdd]').prop('disabled', false);
				
				
			}else{
				Utils.alert("키워드가 중복됩니다. 다시 입력하세요.");
			}
		}
		
		
	}
	let li =document.createElement('li');
	li.append(tbox);
	

	
	
	$('#KMST210P ul[name=KMST210P_KeyWoardList]').append(li);

	$('#KMST210P button[name=KMST210P_btnRelationKeyWardAdd]').prop('disabled', true);
	$('#KMST210P input[name=KMST210P_KeyWordTempInput]').focus();
});
function KMST210P_fnKeyWordDelete(obj){
	let keyword = obj.parentNode.childNodes[0].childNodes[0].data;
	KMST210P_KeyWordList = KMST210P_KeyWordList.filter(x => x !=keyword);
	$(obj.parentNode).remove();
}

//JDJ 3차 개발
//연관 상담 유형 코드 추가 버튼
$('#KMST210P button[name=KMST210P_btnRelationCounselAdd]').off("click").on('click', function () {
	Utils.setCallbackFunction("KMST210P_fnRelationCounselAdd", function(paramStr){
		
		let text = paramStr.cnslTypCdPath;
		
		if(KMST210P_KeyWordList.filter(x => x ===text).length ==0){
			let item ='<li><span>'+text+'</span><button onclick="KMST210P_fnCounselDelete(this)" class="btDelete k-icon k-i-x" title="삭제"></button></li>';
			KMST210P_counselList.push(text);
			$('#KMST210P ul[name=KMST210P_CounselList]').append(item);
			$('#KMST210P button[name=KMST210P_btnCounselAdd]').prop('disabled', false);
		}else{
			Utils.alert("키워드가 중복됩니다. 다시 입력하세요.");
		}
		
	});
	
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM281P","SYSM281P",1200,520, {callbackKey: "KMST210P_fnRelationCounselAdd"});
});

function KMST210P_fnCounselDelete(obj){
	let counsel = obj.parentNode.childNodes[0].childNodes[0].data;
	KMST210P_counselList = KMST210P_counselList.filter(x => x !=counsel);
	$(obj.parentNode).remove();
}

//초기화 버튼
$('#KMST210P button[name=KMST210P_btnInit]').off("click").on('click', function () {

	//컨텐츠 유효기간 초기화
	$('#KMST210P button[name=KMST210_dateStart_btn4]').click();
	//컨텐츠 유형 초기화
	$('#KMST210P input[name=KMST210P_CntnsType]').data("kendoComboBox").value("");
	//대표이미지 초기화
	$('#KMST210P_imgView')[0].src = "";
	$('#KMST210P_imgView').css("display",'none');
	$('#KMST210P_figcap').css("display",'block');
	$('#KMST210P input[name=KMST210P_Imgfile]').val("");

	//제목 초기화
	$('#KMST210P input[name=KMST210P_Title]').val("");

	//지식 top10 초기화
	$('#KMST210P input[name=KMST210P_Top10]').prop('checked', false);

	//내용 초기화
//	KMST210P_editor.SetValue("");

	//파일리스트 삭제
	KMST210P_FileList=[];
	$('#KMST210P ul[name=KMST210P_fileList] *').remove();

	//컨텐츠리스트 삭제
	KMST210P_CntnsList = [];
	$('#KMST210P button[name=KMST210P_btnRelationCntntAdd]').prop('disabled', false);
	$('#KMST210P ul[name=KMST210P_CntnsList] *').remove();

	//키워드리스트 삭제
	KMST210P_KeyWordList = [];
	$('#KMST210P button[name=KMST210P_btnRelationKeyWardAdd]').prop('disabled', false);
	$('#KMST210P ul[name=KMST210P_KeyWoardList] *').remove();
	
	
	//컨텐츠 상세내용 삭제
	KMST210P_contArrObj = [];
	KMST210P_contArrObj2 = [];
	KMST210P_contArrObj3 = [];
	
	$('#KMST210P_divCont').empty();
	
	KMST210P_contNum = 1;
	KMST210P_contNumTotal = 0;

});
//미리보기 버튼
$('#KMST210P button[name=KMST210P_btnPreView]').off("click").on('click', function () {

	//빈칸 체크
	if(Utils.isNull($('#KMST210P input[name=KMST210P_Title]').val())){//제목
		Utils.alert("제목이 비었습니다 제목을 입력하세요.")
		return;
	}

	if(Utils.isNull($('#KMST210P input[name=KMST210P_CategoryPath]').val())){//카테고리
		Utils.alert("선택된 카테고리가 없습니다. 카테고리를 선택하세요.")
		return;
	}

//	if(Utils.isNull(KMST210P_editor.GetTextValue())){//내용
//		Utils.alert("내용이 없습니다. 내용을 입력하세요.")
//		return;
//	}

	KMST210P_fnSubCreateCntntTreeListNew();
	if(KMST210P_IndexList ===[]){
		return;
	}

	let parm = { isEdit : Utils.getUrlParam("callbackKey")}
	Utils.openPop(GLOBAL.contextPath + "/kmst/KMST230P","KMST230P",1000,900,parm);

});
//사용 승인 버튼
$('#KMST210P button[name=KMST210P_btnApproval]').off("click").on('click', function () {
	//상태 승인 변경,
	Utils.confirm("승인하시겠습니까?",function () {
			let state = $('#KMST210P input[name=KMST210P_CntnsStatusCd]').val();
			if (Utils.getUrlParam("callbackKey") != "KMST200M_fnCreateDoc") {//수정
				if (state == KMST210P_KldStCd.approvalRequestNew) {
					KMST210P_fnStateUpdateData($('#KMST210P input[name=KMST210P_CntnsNum]').val(),KMST210P_KldStCd.approvedNew);
				}else if(state == KMST210P_KldStCd.approvalRequestChange){
					KMST210P_fnStateUpdateData($('#KMST210P input[name=KMST210P_CntnsNum]').val(),KMST210P_KldStCd.approveChange);
				}else {
					Utils.alert("승인요청 상태가 아닙니다.");
				}
			}else{
				Utils.alert("승인요청 상태가 아닙니다.");
			}
		},function(){}
	);
});
//지식 반려 버튼
$('#KMST210P button[name=KMST210P_btnDisposal]').off("click").on('click', function () {
	if (Utils.getUrlParam("callbackKey") != "KMST200M_fnCreateDoc") {//수정
		Utils.setCallbackFunction("KMST210P_CMMT330P_fnCallback", function() {
			let state = $('#KMST210P input[name=KMST210P_CntnsStatusCd]').val();
			if (state == KMST210P_KldStCd.approvalRequestNew) {
				KMST210P_fnStateUpdateData($('#KMST210P input[name=KMST210P_CntnsNum]').val(),KMST210P_KldStCd.returnNew);
			}else if(state == KMST210P_KldStCd.approvalRequestChange){
				KMST210P_fnStateUpdateData($('#KMST210P input[name=KMST210P_CntnsNum]').val(),KMST210P_KldStCd.returnChange);
			}else {
				Utils.alert("게시글이 승인요청 상태가 아닙니다.");
			}
		});

		let param = {
			callbackKey: "KMST210P_CMMT330P_fnCallback",
			category: 'K',
			ctgrNo : $('#KMST210P input[name=KMST210P_CategoryNum]').val(),
			mgntNo: $('#KMST210P input[name=KMST210P_CntnsNum]').val()
		};
		Utils.openKendoWindow("/cmmt/CMMT330P", 500, 300, "center", 0, 50, false, param);

	}else{
		Utils.alert("게시글이 승인 요청 상태가 아닙니다.");
	}
});
//임시 저장 버튼 클릭
$('#KMST210P button[name=KMST210P_btnTempSave]').off("click").on('click', function () {

	Utils.confirm("저장하시겠습니까?",function () {
		if (Utils.getUrlParam("callbackKey") == "KMST200M_fnCreateDoc") { //작성
			if ($('#KMST210P input[name=KMST210P_CntnsStatusCd]').val() == KMST210P_KldStCd.new) {	//컨텐츠 번호 생성전 임시저장
				KMST210P_fnSaveData(-1, KMST210P_KldStCd.writing);
			} else {//임시저장 후 임시 저장
				KMST210P_fnUpdateData($('#KMST210P input[name=KMST210P_CntnsNum]').val(), KMST210P_KldStCd.writing);
			}
		} else {//수정
			if ($('#KMST210P input[name=KMST210P_CntnsStatusCd]').val() == KMST210P_KldStCd.writing) {
				KMST210P_fnUpdateData($('#KMST210P input[name=KMST210P_CntnsNum]').val(), KMST210P_KldStCd.writing);
			}
		}
	},function(){}
	);
});
//저장 버튼 클릭
$('#KMST210P button[name=KMST210P_btnSave]').off("click").on('click', function () {
	
	//빈칸 체크
	if(Utils.isNull($('#KMST210P input[name=KMST210P_Title]').val())){//제목
		Utils.alert("제목이 비었습니다 제목을 입력하세요.");
		return;
	}
	
	if($('#KMST210P input[name=KMST210P_CntnsType_input]').val() == "선택"){//제목
		Utils.alert("컨텐츠 유형을 선택해 주세요.");
		return;
	}
	
	if(KMST210P_contArrObj.length == 0){
		Utils.alert("컨텐츠 상세 내용을 선택해 주세요.");
		return;
	}
	
	
	Utils.confirm("저장하시겠습니까?",
		function () {
			//신규(0), 작성중(10), 승인요청(신규)(11), 사용(신규)(12), 반려(신규)(13),
			//                     승인요청(변경)(14), 사용(변경)(15), 반려(변경)(16) 관리자삭제(89),만료(90)
			if(Utils.getUrlParam("callbackKey")=="KMST200M_fnCreateDoc"){ //신규 생성
				
				
				if($('#KMST210P input[name=KMST210P_CntnsStatusCd]').val()==KMST210P_KldStCd.new){//임시 저장 없이 저장
					KMST210P_fnSaveData(-1,KMST210P_KldStCd.approvalRequestNew);	//kw-임시주석시작
				} else{//임시저장 후 저장
					KMST210P_fnUpdateData($('#KMST210P input[name=KMST210P_CntnsNum]').val(),KMST210P_KldStCd.approvalRequestNew); //kw-임시주석시작
				}
			}else{//수정 버튼
				
				if($('#KMST210P input[name=KMST210P_CntnsStatusCd]').val()==KMST210P_KldStCd.writing){// 작성중 -> 승인요청(신규)
					KMST210P_fnUpdateData($('#KMST210P input[name=KMST210P_CntnsNum]').val(),KMST210P_KldStCd.approvalRequestNew);
				}else if($('#KMST210P input[name=KMST210P_CntnsStatusCd]').val()==KMST210P_KldStCd.returnNew){ // 반려 (신규) -> 승인요청(신규)
					KMST210P_fnUpdateData($('#KMST210P input[name=KMST210P_CntnsNum]').val(),KMST210P_KldStCd.approvalRequestNew);
				}else if($('#KMST210P input[name=KMST210P_CntnsStatusCd]').val()==KMST210P_KldStCd.approvedNew||// 사용 (신규) -> 승인요청(변경)
					$('#KMST210P input[name=KMST210P_CntnsStatusCd]').val()==KMST210P_KldStCd.returnChange|| // 반려 (변경) -> 승인요청(변경)
					$('#KMST210P input[name=KMST210P_CntnsStatusCd]').val()==KMST210P_KldStCd.approveChange){ // 반려 (변경) -> 승인요청(변경)
					KMST210P_fnUpdateData($('#KMST210P input[name=KMST210P_CntnsNum]').val(),KMST210P_KldStCd.approvalRequestChange);
				}else{
					// 잘못된 시도
				}
			}
		}, function(){}
	);
});
//반려사유 리스트 버튼 클릭
$('#KMST210P button[name=KMST210P_btnDisposalList]').off("click").on('click', function () {
	if ($('#KMST210P input[name=KMST210P_CntnsStatusCd]').val() != KMST210P_KldStCd.new) {//임시저장 후 임시 저장
		Utils.openKendoWindow("/cmmt/CMMT331P", 500, 300, "center", 0, 50, false, param);
	} else {

	}

});


function KMST210P_imgUpload(obj){
//	let newFormData = new FormData();
//
//	Object.keys(obj.dataObj).forEach(function(key, index){
//		let fileIndex =0;
//		if(typeof obj.dataObj[key] == "object"){
//
//			let check = KSMT210P_editImg.map(file => file.name.split('_index_')[0]+"."+file.name.split('.')[1]).lastIndexOf(obj.dataObj[key].name);
//			if(check>-1){
//				fileIndex= check+1;
//			}
//			let newFile = new File([obj.dataObj[key]], obj.dataObj[key].name.split('.')[0]+"_index_"+fileIndex+"."+obj.dataObj[key].name.split('.')[1], {type: 'image/png'});
//			newFormData.append('img_files', newFile); //Object정보를 formData에 설정
//			KSMT210P_editImg.push(newFile)
//		}
//		if(key=='imagemodify'){
//			obj.dataObj[key] =true
//		}
//	});
//
//	newFormData.append('COMM100INS01_data',JSON.stringify({
//			tenantId : GLOBAL.session.user.tenantId
//			, UsrId : GLOBAL.session.user.user
//			, orgCd : GLOBAL.session.user.orgCd
//			, uploadPath : "KLD_CNTS_TMP"
//		}));
//
//	Utils.ajaxCallFormData('/comm/COMM100INS01',newFormData,function(data){
//		let item = JSON.parse(JSON.parse(JSON.stringify(data.info)));
//		//let url = window.location.href.split("bcs/")[0]+"bcs/kmstphotocntstmp/"+GLOBAL.session.user.tenantId+"/"+ item[0].apndFileIdxNm
//		let url = GLOBAL.contextPath+"/kmstphotocntstmp/"+GLOBAL.session.user.tenantId+"/"+ item[0].apndFileIdxNm
//		let result = '{"result":"success","addmsg":[{"editorFrame":"NamoSE_editorframe_'+KMST210P_editor.editorName+'","imageURL":"'+url+'","imageKind":"image","imageTitle":"'+item[0].apndFileNm+'"}]}';
//		obj.complete(result);
//	},null,null,null);
}



//Sub Function----------------------------------------------------------------------------------------------------------
//파일 업로드 제한 - JDJ 나중에 파일도쓸수있게변경
function KMST210P_fnSubuploadFileCheck(file,type) {
	if(file){
		if(type==="IMG"){
			let maxSize = 5 * 1024 * 1024; // 5MB
			if(file.size > maxSize){
				Utils.alert("이미지 사이즈는 5MB 이내로 등록 가능합니다.");
				$('#KMST210P input[name=KMST210P_Imgfile]').val("");
				return;
			}
			let pattern =  /[,;~`^@\#$%&\=\'_]/gi;
			let fileName = file.name.split('\\').pop().toLowerCase();
			if(pattern.test(fileName) ){
				Utils.alert("파일명에 특수문자가 포함되어 있습니다.");
				$('#KMST210P input[name=KMST210P_Imgfile]').val("");
				return;
			}
			let ext = file.name.split('.').pop().toLowerCase(); //확장자분리
			if($.inArray(ext, ['jpg','jpeg','gif','png']) == -1) {//아래 확장자가 있는지 체크
				Utils.alert("'jpg,gif,jpeg,png' 파일만 업로드 할수 있습니다.");
				$('#KMST210P input[name=KMST210P_Imgfile]').val("");

			}
		}else{
			let maxSize = 100 * 1024 * 1024; // 100MB
			if(file.size > maxSize){
				Utils.alert("첨부파일 사이즈는 100MB 이내로 등록 가능합니다.");

				//$('#KMST210P input[name=KMST210P_Imgfile]').val("");
				return false;
			}
			let pattern=	 /[,;~`^@\#$%&\=\'_]/gi;
			if(pattern.test(file.name) ){
				Utils.alert("파일명에 특수문자가 포함되어 있습니다.");

				//$('#KMST210P input[name=KMST210P_Imgfile]').val("");
				return false;
			}
			let extension = new RegExp("(.*?)\.(xls|xlsx|ppt|pptx|doc|docx|hwp|pdf|gif|jpg|png|zip|rar|PNG)$"); //확장자
			if(extension.test(file.name)){//아래 확장자가 있는지 체크
				Utils.alert("'xls|xlsx|ppt|pptx|doc|docx|hwp|pdf|gif|jpg|png|zip|rar|PNG' 파일만 업로드 할수 있습니다.");

				//$('#KMST210P input[name=KMST210P_Imgfile]').val("");
				return false;
			}
			return true;
		}
	}
}
//파일 크기 변환
function KMST210P_fnSubFormatBytes(bytes, decimals = 2) {
	if (bytes === 0) return '0B';
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
//파일 토탈 사이즈및 갯수 관리
function KMST210P_fnSubTotalSize(){
	let totalsize = 0;
	KMST210P_FileList.forEach(x=> totalsize+= x.size);
	$('#KMST210P span[name=KMST210P_fileSize]').text(" ");
	$('#KMST210P span[name=KMST210P_fileSize]').append(KMST210P_FileList.length+'개/ '+ KMST210P_fnSubFormatBytes(totalsize));
}
//내용 트리화
function KMST210P_fnSubCreateCntntTreeList(cntns){
	let indexlist = []; let count =1, maxh1id =0, maxh2id =0;
	
	
	let testCode = $('#KMST210P_edtContEdit_l1_0').summernote('code');
	
	
	
}

//kw---버튼함수 20230807 : 컨텐스상세내용-타이틀추가
function KMST210P_fnAddContTitle(){
	
	let idNum = KMST210P_contNumTotal++;
	let addId = "l1_" + idNum;
	
	
	
	let lstAddLv2 = [];
	let obj = {
			divId				: "KMST210P_divContTitle_" + addId,
			contIdNum			: idNum,
			contNo				: KMST210P_contNum,
			checkboxId			: "KMST210P_chkCont_" + addId,
			divEditId			: "KMST210P_divContEdit_" + addId,
			divEditId2			: "KMST210P_edtContEdit_" + addId,
			btnEditView			: "KMST210P_btnContEditView_" + addId,
			contSubItemL2		: 0,
			contSubItemL3		: 0,
			lstAddLv2			: lstAddLv2,
			id					: addId,
		}
	
	KMST210P_contArrObj.push(obj);

	KMST210P_fnContListDivAdd(addId);
	
	KMST210P_contNum++;
}

function KMST210P_fnContClickChkbox(nId){
	
	KMST210P_contSelect = nId;

	let arrId = nId.split('_');
	
	let selLv = arrId[2];
	let selIdNum = arrId[3];

	if(Utils.isNull(nId)){
		return;
	}
	
	if(selLv == "l3"){
		$('#KMST210P_btnAddContSub').attr("disabled", true);
		$('#KMST210P_btnAddContSub').css('cursor', 'default'); 
	} else {
		$('#KMST210P_btnAddContSub').attr("disabled", false);
		$('#KMST210P_btnAddContSub').css('cursor', 'pointer'); 
	}

	if(document.getElementById(nId).checked){
		for(var i=0; i<KMST210P_contArrObj.length; i++){
			if(nId != KMST210P_contArrObj[i].checkboxId){
				document.getElementById(KMST210P_contArrObj[i].checkboxId).checked = false;
			}
		}
		
		//lv2
		for(var i=0; i<KMST210P_contArrObj2.length; i++){
			if(nId != KMST210P_contArrObj2[i].checkboxId){
				document.getElementById(KMST210P_contArrObj2[i].checkboxId).checked = false;
			}
		}
		
		//lv3
		for(var i=0; i<KMST210P_contArrObj3.length; i++){
			if(nId != KMST210P_contArrObj3[i].checkboxId){
				document.getElementById(KMST210P_contArrObj3[i].checkboxId).checked = false;
			}
		}
		
	} else {
		KMST210P_contSelect = "";
	}
	
}

//kw---버튼함수 20230807 : 컨텐스상세내용-타이틀추가
function KMST210P_fnAddContSub(){
	
	if(Utils.isNull(KMST210P_contSelect)){
		Utils.alert("항목을 선택해 주세요.");
		return;
	}
	
	let selId = KMST210P_fnContSelId(KMST210P_contSelect);
	let selArrId = KMST210P_contSelect.split('_');
	let selLv = selArrId[2];
	let selIdNum = selArrId[3];
	let selIdNumLv2 = selArrId[4];
	let selIdNumLv3 = selArrId[5];

	let contNoLv1 = 0;					//선택된 컨텐츠 번호 lv1
	let contNoLv2 = 0;					//선택된 컨텐츠 번호 lv2
	
	let lstLv2 = "";					//lv1에서 lv2자식 리스트들중 마지막으로 등록된 lv2 아이디
	
	let addLv;							//추가할 아이템의 레벨
	let addId;							//추가할 아이템의 아이디
	let addNo;							//추가할 아이템의 컨텐츠 번호
	let addNum = 0;						//추가할 아이템의 lv2 아이템 번호	- 아이디를 넣어주기 떄문에 꼬이지 않게 추가할 떄마다 값을 증가해준다.
	let getAddNo = 0;					//추가할 아이템의 컨텐츠 번호	- 현재 뿌려지고 있는 갯수를 넣어야 하기 떄문에 오브젝트를 체크해서 값을 가져온다.
	let appendId;						//추가할 div를 어떤 div 밑에 넣어줄지를 구한다.
	let appendNum=0;
	let addClassLM;						//추가할 아이템의 div margin을 구한다.	lv2:60, lv3:110
	let addClassLMEdit;					//추가할 아이템의 edit margin을 구한다.
	if(selLv == "l1"){
		addLv = "l2";

		if(KMST210P_contArrObj.length > 0){
			for(var i=0; i<KMST210P_contArrObj.length; i++){
				if(KMST210P_contArrObj[i].id ==  selId){
					addNum = KMST210P_contArrObj[i].contSubItemL2;
					contNoLv1 = KMST210P_contArrObj[i].contNo;
					lstLv2 = KMST210P_contArrObj[i].lstAddLv2[KMST210P_contArrObj[i].lstAddLv2.length-1];
						
					KMST210P_contArrObj[i].contSubItemL2++;
				}
			}
		}
		
		
		//추가할 아이템의 컨텐츠 번호 - 현재 뿌려지고 있는 갯수를 넣어야 하기 떄문에 오브젝트를 체크해서 값을 가져온다.
		if(KMST210P_contArrObj2.length > 0){
			for(var i=0; i<KMST210P_contArrObj2.length; i++){
				if(KMST210P_contArrObj2[i].idLv1 == selId){
					getAddNo++;
				}
			}
		}

		addId = addLv + "_" + selArrId[3] + "_" + addNum;
		
		//찾았던 레벨2 아이디에 레벨 3가 있는지 확인
		if(!Utils.isNull(lstLv2)){		//레벨2값이 있는지 확인
			if(KMST210P_contArrObj2.length > 0){	//레벨2 오브젝트에 값이 있으면
				for(var i=0; i<KMST210P_contArrObj2.length; i++){		//레벨2 오브젝트만큼 for
					if(KMST210P_contArrObj2[i].id == lstLv2){			//레벨2 오브젝트 id와 레벨2 값이 같으면
						if(!Utils.isNull(KMST210P_contArrObj2[i].lstAddLv3)){		//레벨2 오브젝트에 레벨3 값이 있으면
							appendId = KMST210P_contArrObj2[i].lstAddLv3[KMST210P_contArrObj2[i].lstAddLv3.length-1];
						}
					}
				}
			}
		}
		if(Utils.isNull(appendId)){
			if(Utils.isNull(lstLv2)){
				appendId = "l1_" + selArrId[3];
			} else {
				appendId = lstLv2;
			}
		}
		//kw---appendNum 찾기 위함
		//레벨1에서 레벨2마지막 추가 아이디 넣기
		if(KMST210P_contArrObj.length > 0){
			for(var i=0; i<KMST210P_contArrObj.length; i++){
				if(KMST210P_contArrObj[i].id == selId){
					KMST210P_contArrObj[i].lstAddLv2.push(addId);
				}
			}
		}
		
		addNo = contNoLv1 + "." + (getAddNo+1);
		
		lstAddLv3 = [];
		let obj = {
				divId			: "KMST210P_divContTitle_" + addId,
				contIdNum		: selArrId[3],
				contIdNumLv2	: getAddNo,
				contNo			: addNo,
				contNo2			: getAddNo+1,
				checkboxId		: "KMST210P_chkCont_" + addId,
				divEditId		: "KMST210P_divContEdit_" + addId,
				divEditId2		: "KMST210P_edtContEdit_" + addId,
				btnEditView		: "KMST210P_btnContEditView_" + addId,
				id				: addId,
				idLv1			: selId,
				lstAddLv3		: lstAddLv3,
			}
		
		KMST210P_contArrObj2.push(obj);
		
		KMST210P_fnContListSubDivAdd(addNo, addId, appendId, "l2");
		
	} 
	else if(selLv == "l2"){
		addLv = "l3";
		
		let idLv1 = "";
		if(KMST210P_contArrObj2.length > 0){
			for(var i=0; i<KMST210P_contArrObj2.length; i++){
				if(KMST210P_contArrObj2[i].id == selId){
					contNoLv2 = KMST210P_contArrObj2[i].contNo2;
					lstLv3 = KMST210P_contArrObj2[i].lstAddLv3[KMST210P_contArrObj2[i].lstAddLv3.length-1];
					idLv1 = KMST210P_contArrObj2[i].idLv1;			//kw---lv1 값 가져오기
				}
			}
		}

		if(KMST210P_contArrObj.length > 0){
			for(var i=0; i<KMST210P_contArrObj.length; i++){
				if(KMST210P_contArrObj[i].id == idLv1){
					addNum = KMST210P_contArrObj[i].contSubItemL3;
					contNoLv1 = KMST210P_contArrObj[i].contNo;
					KMST210P_contArrObj[i].contSubItemL3++;
				}
			}
		}
		
		if(KMST210P_contArrObj3.length > 0){
			for(var i=0; i<KMST210P_contArrObj3.length; i++){
				if(KMST210P_contArrObj3[i].contIdNum == selIdNum 
						&& KMST210P_contArrObj3[i].contIdNumLv2 == selIdNumLv2 ){
					getAddNo++;
				}
			}
		}
		
		addId = addLv + "_" + selArrId[3] + "_" + selArrId[4] + "_" + addNum;
		
		//kw---appendNum 찾기 위함
		//레벨2에서 레벨3마지막 추가 아이디 넣기
		let appendI
		if(KMST210P_contArrObj.length > 0){
			for(var i=0; i<KMST210P_contArrObj2.length; i++){
				if(KMST210P_contArrObj2[i].id == selId){
					KMST210P_contArrObj2[i].lstAddLv3.push(addId);
				}
			}
		}
		
		addNo = contNoLv1 + "." + contNoLv2 + "." + (getAddNo+1);
		
		
		if(getAddNo == 0){
			appendId = "l2_" + selArrId[3] + "_" + selArrId[4];
		} else {
			appendId = lstLv3;
		}
		
	
		let obj = {
				divId			: "KMST210P_divContTitle_" + addId,
				contIdNum		: selArrId[3],
				contIdNumLv2	: selArrId[4],
				contIdNumLv3	: addNum,
				contNo			: addNo,
				checkboxId		: "KMST210P_chkCont_" + addId,
				divEditId		: "KMST210P_divContEdit_" + addId,
				divEditId2		: "KMST210P_edtContEdit_" + addId,
				btnEditView		: "KMST210P_btnContEditView_" + addId,
				idLv2			: selId,
				id				: addId,
			}
		
		KMST210P_contArrObj3.push(obj);
		
		KMST210P_fnContListSubDivAdd(addNo, addId, appendId, "l3");
	}

}

function KMST210P_fnContListDivAdd(addId){
	var strHtml = "";
	strHtml = '<div id="KMST210P_divCont_' + addId + '" class="ma_top10">';
		strHtml += '<div id="KMST210P_divContTitle_' + addId + '" class="" style="display:flex;">';
			strHtml += '<div class="ma_top10">';
				strHtml += '<input type="checkbox" class="k-checkbox" id="KMST210P_chkCont_' + addId + '" onclick="KMST210P_fnContClickChkbox(this.id)">';
			strHtml += '</div>';
			strHtml += '<div class="kmst_input-group ma_left10">';
				strHtml += '<span id="KMST210P_spnContNo_' + addId + '" class="kmst_input-group-text">' + KMST210P_contNum + '</span>';
				strHtml += '<div class="kmst_input-group-div kmst_d_flex">';
					strHtml += '<div style="width: 100%;">';
						strHtml += '<input id= "KMST210P_inpContTitle_' + addId + '" class="kmst_con_title_input_not_bold" name="" onFocus="KMST210P_fnContInputFocus(this.id)"/>';
					strHtml += '</div>';
					strHtml += '<div class="btnArea_right">';
						strHtml += '<button id="KMST210P_btnContEditView_' + addId + '" class="btnRefer_second icoType k-icon k-i-plus" title="추가" onclick="KMST210P_fnContEditView(this.id)"></button>';
					strHtml += '</div>';
				strHtml += '</div>';
			strHtml += '</div>';
		strHtml += '</div>';
		
		strHtml += '<div id="KMST210P_divContEdit_' + addId + '" class="ma_top5 ma_left60 kmst_div-card-ani kmst_div-edit">';
			strHtml += '<div id="KMST210P_edtContEdit_' + addId + '"> </div>'; 
		strHtml += '</div>';
		
	strHtml += '</div>';
	
	$('#KMST210P_divCont').append(strHtml);
	
	KMST210P_fnSummEdtCreate("KMST210P_edtContEdit_" + addId);
	
	document.getElementById('KMST210P_chkCont_'+addId).checked = true;
	KMST210P_fnContClickChkbox('KMST210P_chkCont_'+addId);
	
	var hh = document.querySelector("#KMST210P_divContTitle_" + addId).offsetTop;
	$('#KMST210P_divCont').scrollTop(hh);   // 상단으로 이동 (세로 스크롤)
	
	$("#"+addId).removeClass("k-i-minus");
	$("#"+addId).addClass("k-i-plus");
	$('#KMST210P_divContEdit_'+addId).css('display', 'none');
}

function KMST210P_fnContListSubDivAdd(addNo, addId, appendId, nLv){
	
	let addClassLM = "";
	let addClassLMEdit = "";
	
	if(nLv == "l2"){
		addClassLM = "ma_left60";
		addClassLMEdit = "ma_left110";
	}
	else if(nLv == "l3"){
		addClassLM = "ma_left110";
		addClassLMEdit = "ma_left160";
	}

	var strHtml = "";
	strHtml = '<div id="KMST210P_divCont_' + addId + '" class="ma_top10">';
		strHtml += '<div id="KMST210P_divContTitle_' + addId + '" style="display:flex;">';
			strHtml +='<div class="ma_top10">';
				strHtml += '<input type="checkbox" class="k-checkbox" id="KMST210P_chkCont_' + addId + '" onclick="KMST210P_fnContClickChkbox(this.id)">';
			strHtml += '</div>';
			strHtml += '<div class="kmst_input-group ' + addClassLM + '">';
				strHtml += '<span id="KMST210P_spnContNo_' + addId + '" class="kmst_input-group-text">' + addNo + '</span>';
				strHtml += '<div class="kmst_input-group-div kmst_d_flex">';
					strHtml += '<div style="width: 100%;">';
						strHtml += '<input id= "KMST210P_inpContTitle_' + addId + '" class="kmst_con_title_input_not_bold" name="" onFocus="KMST210P_fnContInputFocus(this.id)"/>';
					strHtml += '</div>';
					strHtml += '<div class="btnArea_right">';
						strHtml += '<button id="KMST210P_btnContEditView_' + addId + '" class="btnRefer_second icoType k-icon k-i-plus" title="추가" onclick="KMST210P_fnContEditView(this.id)"></button>';
					strHtml += '</div>';
				strHtml += '</div>';
			strHtml += '</div>';
		strHtml += '</div>';
		
		strHtml += '<div id="KMST210P_divContEdit_' + addId + '" class="ma_top5 kmst_div-card-ani kmst_div-edit ' + addClassLMEdit +'">';
			strHtml += '<div id="KMST210P_edtContEdit_' + addId + '" style="height:250px;"> </div>'; 
		strHtml += '</div>';
	strHtml += '</div>';
	
	$('#KMST210P_divCont_' + appendId).after(strHtml);
	
	KMST210P_fnSummEdtCreate("KMST210P_edtContEdit_" + addId);
	
	document.getElementById('KMST210P_chkCont_'+addId).checked = true;
	KMST210P_fnContClickChkbox('KMST210P_chkCont_'+addId);
	
	var hh = document.querySelector("#KMST210P_divContTitle_" + addId).offsetTop;
	$('#KMST210P_divCont').scrollTop(hh);   // 상단으로 이동 (세로 스크롤)
	
	let $target1 = document.getElementById('KMST210P_edtContEdit_' + addId);

	$('#KMST210P_divContEdit_'+addId).css('display', 'none');
}


//컨텐스상세내영-에디터보기 버튼
function KMST210P_fnContEditView(nId){
	
	let selArrId = nId.split('_');
	let selLv = selArrId[2];
	let divEditId;
	
	if(selLv == "l1"){
		divEditId = selLv + "_" + selArrId[3];
	} else if(selLv == "l2"){
		divEditId = selLv + "_" + selArrId[3] + "_" + selArrId[4];
	} else if(selLv == "l3"){
		divEditId = selLv + "_" + selArrId[3] + "_" + selArrId[4] + "_" + selArrId[5];
	} else {
		return;
	}
	
	//k-i-plus class 가 있으면 에디터 div가 접혀있기 떄문에 펼쳐준다
	if($("#"+nId).hasClass("k-i-plus") === true){
		$("#"+nId).removeClass("k-i-plus");
		$("#"+nId).addClass("k-i-minus");
		
		$('#KMST210P_divContEdit_'+divEditId).css('display', '');
//		$('#KMST210P_edtContEdit_'+divEditId).css('display', '');
//		$('#KMST210P_divContEdit_'+divEditId).css('height', 250);
	} else {
		$("#"+nId).addClass("k-i-plus");
		$("#"+nId).removeClass("k-i-minus");
		$('#KMST210P_divContEdit_'+divEditId).css('display', 'none');
//		$('#KMST210P_edtContEdit_'+divEditId).css('display', 'none');
//		$('#KMST210P_divContEdit_'+divEditId).css('height', 0);
	}
	
}

$(window).resize(function(){
	KMST210P_Resize();
});

//컨텐츠 상세내용 리스트 박스 자동 크기 조절
function KMST210P_Resize(){
	
	//리스트박스 높이를 구한다.
	let divBotHeightMin = 68;
	let divContHeightMin = 112;
	let divBotHeight = document.body.clientHeight - divBotHeightMin - KMST210P_divTop.clientHeight;
	let divContHeight = divBotHeight - divContHeightMin;
	
	//컨텐츠 사에내용이 풀 스크린 활성화가 되면 KMST210P_contFullScreenYn값이 true 변경되기 때문에 풀스크린인지 아닌지 알 수 있음
	//풀스크린이면 컨텐츠상세내용 크기에 맞춰서 동적으로 변하면 안되기 때문에 구분
	if(KMST210P_contFullScreenYn == true){	
		let divContListH = KMST210P_divTop.clientHeight + KMST210P_divTopHeight - 14;	
		$('#KMST210P_divCont').css('height', divContListH);   //   에디터 height
	} else {
		$('#KMST210P_divCont').css('height', divContHeight);   //   에디터 height
	}
	
	let screenHeight = $(window).height()-200;
	$('#KMST210P_edtContEdit_big').css('height', screenHeight);   //   에디터 height
	
}

//컨텐츠상세내용 - 풀스크린 하기
function KMST210P_fnContFullScreen(){
	if(KMST210P_contFullScreenYn == false){
		KMST210P_contFullScreenYn = true;
		KMST210P_divTopHeight = KMST210P_divCont.clientHeight;
		let divContListH = KMST210P_divTop.clientHeight + KMST210P_divTopHeight - 14;	
		$('#KMST210P_divCont').css('height', divContListH);   //   에디터 height
		
		$("#KMST210P_btnContFullScreen").removeClass("k-i-arrow-60-up");
		$("#KMST210P_btnContFullScreen").addClass("k-i-arrow-60-down");
		
		
	} else {
		KMST210P_contFullScreenYn = false;
		KMST210P_Resize();
		
		$("#KMST210P_btnContFullScreen").addClass("k-i-arrow-60-up");
		$("#KMST210P_btnContFullScreen").removeClass("k-i-arrow-60-down");
	}
}

//컨텐츠상세내용 - 항목 전체펴기
function KMST210P_fnContListAllOpen(){

	for(var i=0; i<KMST210P_contArrObj.length; i++){
		$('#'+KMST210P_contArrObj[i].divEditId).css('display', '');
//		$('#'+KMST210P_contArrObj[i].divEditId2).css('display', '');
//		$('#'+KMST210P_contArrObj[i].divEditId).css('height', 250);
		
		$("#"+KMST210P_contArrObj[i].btnEditView).removeClass("k-i-plus");
		$("#"+KMST210P_contArrObj[i].btnEditView).addClass("k-i-minus");
	}
	//lv2
	for(var i=0; i<KMST210P_contArrObj2.length; i++){
		$('#'+KMST210P_contArrObj2[i].divEditId).css('display', '');
//		$('#'+KMST210P_contArrObj2[i].divEditId2).css('display', '');
//		$('#'+KMST210P_contArrObj2[i].divEditId).css('height', 250);
		$("#"+KMST210P_contArrObj2[i].btnEditView).removeClass("k-i-plus");
		$("#"+KMST210P_contArrObj2[i].btnEditView).addClass("k-i-minus");
	}
	
	//lv3
	for(var i=0; i<KMST210P_contArrObj3.length; i++){
		$('#'+KMST210P_contArrObj3[i].divEditId).css('display', '');
//		$('#'+KMST210P_contArrObj3[i].divEditId2).css('display', '');
//		$('#'+KMST210P_contArrObj3[i].divEditId).css('height', 250);
		$("#"+KMST210P_contArrObj3[i].btnEditView).removeClass("k-i-plus");
		$("#"+KMST210P_contArrObj3[i].btnEditView).addClass("k-i-minus");
	}
}

//컨텐츠상세내용 - 항목 전체접기
function KMST210P_fnContListAllClose(){
	for(var i=0; i<KMST210P_contArrObj.length; i++){
		$('#'+KMST210P_contArrObj[i].divEditId).css('display', 'none');
//		$('#'+KMST210P_contArrObj[i].divEditId2).css('display', 'none');
//		$('#'+KMST210P_contArrObj[i].divEditId).css('height', 0);
		$("#"+KMST210P_contArrObj[i].btnEditView).addClass("k-i-plus");
		$("#"+KMST210P_contArrObj[i].btnEditView).removeClass("k-i-minus");
	}
	//lv2
	for(var i=0; i<KMST210P_contArrObj2.length; i++){
		$('#'+KMST210P_contArrObj2[i].divEditId).css('display', 'none');
//		$('#'+KMST210P_contArrObj2[i].divEditId2).css('display', 'none');
//		$('#'+KMST210P_contArrObj2[i].divEditId).css('height', 0);
		$("#"+KMST210P_contArrObj2[i].btnEditView).addClass("k-i-plus");
		$("#"+KMST210P_contArrObj2[i].btnEditView).removeClass("k-i-minus");
	}
	
	//lv3
	for(var i=0; i<KMST210P_contArrObj3.length; i++){
		$('#'+KMST210P_contArrObj3[i].divEditId).css('display', 'none');
//		$('#'+KMST210P_contArrObj3[i].divEditId2).css('display', 'none');
//		$('#'+KMST210P_contArrObj3[i].divEditId).css('height', 0);
		$("#"+KMST210P_contArrObj3[i].btnEditView).addClass("k-i-plus");
		$("#"+KMST210P_contArrObj3[i].btnEditView).removeClass("k-i-minus");
	}
}

//summereditor 생성
function KMST210P_fnSummEdtCreate(nId){
	
	let selArrId = nId.split('_');
	let selLv = selArrId[2];
	let selId;

	if(selLv == "l1"){
		selId = selLv + "_" + selArrId[3];
	} else if(selLv == "l2"){
		selId = selLv + "_" + selArrId[3] + "_" + selArrId[4];
	} else if(selLv == "l3"){
		selId = selLv + "_" + selArrId[3] + "_" + selArrId[4] + "_" + selArrId[5];
	} else {
		return;
	}
	
	var fontList = ['맑은 고딕', '굴림', '돋움', '바탕', '궁서', 'NotoSansKR', 'Arial', 'Courier New', 'Verdana', 'Tahoma', 'Times New Roamn'];
	
	$('#'+nId).summernote({
		height: 180,                 // set editor height
		minHeight: 180,             // set minimum height of editor
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
			    onFocus: function(e) {
			    	document.getElementById('KMST210P_chkCont_'+selId).checked = true;
			    	KMST210P_fnContClickChkbox('KMST210P_chkCont_'+selId);
			    },
			    onImageUpload : function(files) {
					  KMST210P_fnSummNoteImgUpload(files[0], this, nId);
				},
				//kw---20240614 : summernote - 기능 수정 (테이블 관련)
			    onPaste: function(e) {
			    	Utils.summerPate(e, nId);
	            },
	            
		  },
		  tableClassName: 'table table-bordered summernote-table', //kw---20240614 : summernote - 기능 수정 (테이블 관련)
			  
	});
}

function KMST210P_fnSummNoteImgUpload(file, editor, nId) {
	
	
	
	var formData = new FormData();
	
	formData.append('img_files', file);
	
	formData.append('COMM100INS01_data',JSON.stringify({
		tenantId : GLOBAL.session.user.tenantId
		, UsrId : GLOBAL.session.user.user
		, orgCd : GLOBAL.session.user.orgCd
		, uploadPath : "KLD_CNTS_TMP"
	}));
	
	Utils.ajaxCallFormData('/comm/COMM100INS01',formData,function(data){
		let fileSaveData = JSON.parse(data.info);

		for(var i=0; i<fileSaveData.length; i++){
			let url = GLOBAL.contextPath+"/kmstphotocntstmp/"+GLOBAL.session.user.tenantId+"/"+ fileSaveData[i].apndFileIdxNm;
			$('#'+nId).summernote('insertImage', url);
		}
		
	});
	
	
}

//컨텐츠상세내용 - 리스트의 타이틀 input 박스를 클릭했을 경우 해당 체크박스에 체크활성화 해주기
function KMST210P_fnContInputFocus(nId){
	let selId = KMST210P_fnContSelId(nId);
	
	document.getElementById('KMST210P_chkCont_'+selId).checked = true;
	KMST210P_fnContClickChkbox('KMST210P_chkCont_'+selId);
}

//현재 선택된 아이템의 아이디만 가져오기
function KMST210P_fnContSelId(nId){
	let selArrId = nId.split('_');
	let selLv = selArrId[2];
	let selId;

	if(selLv == "l1"){
		selId = selLv + "_" + selArrId[3];
	} else if(selLv == "l2"){
		selId = selLv + "_" + selArrId[3] + "_" + selArrId[4];
	} else if(selLv == "l3"){
		selId = selLv + "_" + selArrId[3] + "_" + selArrId[4] + "_" + selArrId[5];
	} else {
		return;
	}
	
	return selId;
}

function KMST210P_fnContListDel(){
	
	
	let selArrId = KMST210P_contSelect.split('_');
	let selLv = selArrId[2];
	let selId = KMST210P_fnContSelId(KMST210P_contSelect);
	let delNum = -1;
	let selObj;
	let spliceObj;
	let spliceId;
	let spliceArr = [];		//하위 컨텐츠들
	let spliceArr2 = [];		//하위 컨텐츠들
	
	if(selLv == "l1"){
		selObj = KMST210P_contArrObj;
	} else if(selLv == "l2"){
		selObj = KMST210P_contArrObj2;
	} else if(selLv == "l3"){
		selObj = KMST210P_contArrObj3;
	} else {
		return;
	}
	
	if(selObj.length > 0){

		for(var i=0; i<selObj.length; i++){

			if(delNum == -1){
				
				if(selObj[i].id == selId){
					delNum = i;
					if(selLv == "l1"){
						
						//lv1을 삭제하면 자식들까지 삭제해야 하기 떄문에 체크
						for(var j=KMST210P_contArrObj2.length-1; j>=0; j--){		//lv2오브젝트에서 현재 삭제되는 lv1의 자식을 삭제하기 위함	
							if(KMST210P_contArrObj2[j].idLv1 == selId){				//lv2오브젝트에 부모 아이디와 현재 선택된 아이디 값을 같을 경우
								
								for(var l=KMST210P_contArrObj3.length-1; l>=0; l--){					//해당 lv2에 lv3가 있을 수도 있으니 체크
									if(KMST210P_contArrObj3[l].idLv2 == KMST210P_contArrObj2[j].id){	//lv3오브젝트 부모 ID와 현재 for문에 걸린 lv2오브젝트 아이디가 같을 경우
										spliceArr2.push(l);												//spliceArr2에 lv3오브젝트 index를 넣어준다
									} 
								}

								spliceArr.push(j);														//spliceArr에 lv2오브젝트 index를 넣어준다
							} 
						}
						
						
					}
					else if(selLv == "l2"){

						for(var j=KMST210P_contArrObj3.length-1; j>=0; j--){			//lv2를 삭제할때 자식인 lv3도 같이 삭제해야 함
							if(KMST210P_contArrObj3[j].idLv2 == selId){					//lv3 오브젝트에 선택된 아이디 값이 같을 경우
								spliceArr.push(j);										//밑에서 한꺼번에 삭제하기 위해 spliceArr에 넣어준다
							} 
						}
						
						let idLv1 = selObj[i].idLv1;											//선택된 lv2에 부모 아이디인 idlv1값을 구한다.
						for(var j=0; j<KMST210P_contArrObj.length; j++){						//lv1 오브젝에는 자식 아이템 ID를 갖고 있으며 lv2가 삭제되면 lv1자식 리스트에서도 삭제해줘야 함
							if(KMST210P_contArrObj[j].id == idLv1){						
								for(var k=0; k<KMST210P_contArrObj[j].lstAddLv2.length; k++){	
									if(KMST210P_contArrObj[j].lstAddLv2[k] == selId){			//현재 선택된 아이디와 lv1 자식리스트에 값이 같을 경우
										spliceObj = KMST210P_contArrObj[j].lstAddLv2;			//spliceObj에 lv1자식 리스트를 넣어준다.
										spliceId = k;											//spliceId에 삭제할 index 값을 넣어준다.
									}
								}
							}
						}
					}
					else if(selLv == "l3"){
						let idLv2 = selObj[i].idLv2;
						
						for(var j=0; j<KMST210P_contArrObj2.length; j++){
							if(KMST210P_contArrObj2[j].id == idLv2){								//lv2 오브젝에는 자식 아이템 ID를 갖고 있으며 lv3가 삭제되면 lv2 자식 리스트에서도 삭제해줘야 함
								for(var k=0; k<KMST210P_contArrObj2[j].lstAddLv3.length; k++){		//lv2 자식리스트 길이 만큼 for문 수행
									if(KMST210P_contArrObj2[j].lstAddLv3[k] == selId){				//현재 선택된 아이디와 lv2 자식리스트에 값이 같을 경우
										spliceObj = KMST210P_contArrObj2[j].lstAddLv3;				//spliceObj에 lv2자식 리스트를 넣어준다.
										spliceId = k;												//spliceId에 삭제할 index 값을 넣어준다.
									}
								}
							}
						}
					}
				}
			} else {
				if(selLv == "l1"){
					selObj[i].contNo--;																//lv1은 한자리수이기 때문에 문자열 나눠서 계산할 필요 없이 그냥 --
					$('#KMST210P_spnContNo_' + selObj[i].id).text(selObj[i].contNo);				//span 요소에 변경된 값을 넣어준다.
					
					
					//lv2도 체크해 준다.
					for(var k=0; k<KMST210P_contArrObj2.length; k++){
						if(KMST210P_contArrObj2[k].idLv1 == selObj[i].id){							//lv2 오브젝트에 있는 lv1 값과 lv1 오브젝트의 id가 값을 경우
							let contNoL2 = KMST210P_contArrObj2[k].contNo.split('.');
							let contNochg2 = (contNoL2[0]-1) + "." + (contNoL2[1]);				//lv1을 삭제했기 떄문에 lv1에 해당하는 값을 빼준다.		lv1-1.lv2
							KMST210P_contArrObj2[k].contNo = contNochg2;
							$('#KMST210P_spnContNo_' + KMST210P_contArrObj2[k].id).text(KMST210P_contArrObj2[k].contNo);
							
							
							
							//lv3아이템도 바꿔주기
							for(var k3=0; k3<KMST210P_contArrObj3.length; k3++){												
								if(KMST210P_contArrObj3[k3].idLv2 == KMST210P_contArrObj2[k].id){						//lv2 체크하면서 나온 id와 lv3 오브젝트의 idlv3 값이 값을 경우
									let contNoL3 = KMST210P_contArrObj3[k3].contNo.split('.');
									let contNochg3 = (contNoL3[0]-1) + "." + (contNoL3[1]) + "." + (contNoL3[2]);	//lv1을 삭제했기 때문에 lv1-1.lv2.lv3
									KMST210P_contArrObj3[k3].contNo = contNochg3;
									$('#KMST210P_spnContNo_' + KMST210P_contArrObj3[k3].id).text(KMST210P_contArrObj3[k3].contNo);
									
								}
							}
						}
					}
					
				}
				//lv2를 삭제 했을 경우
				else if(selLv == "l2"){
					if(selArrId[3] == selObj[i].contIdNum){										//lv2 오프젝트의 컨텐츠아디번호와 선택된 아이디에 lv1값이 같을 경우
						let contNoL2 = selObj[i].contNo.split('.');								//타이틀번호를 문자열로 나눈다.
						let contNochg = contNoL2[0] + "." + (contNoL2[1] - 1);				//lv2를 삭제 했기 때문에 lv2에 해당하는 값을 뺀다.	lv1.lv2-1
						selObj[i].contNo = contNochg;										//수정된값을 오브젝트에 넣는다
						$('#KMST210P_spnContNo_' + selObj[i].id).text(selObj[i].contNo);	//span 요소에 값을 변경한다.
						
						
					}
					
					//lv3도 변경해주어 하기 때문에 lv3오브젝트도 체크한다.
					for(var k=0; k<KMST210P_contArrObj3.length; k++){
						if(KMST210P_contArrObj3[k].idLv2 == selObj[i].id){									//lv3오브젝트에 현재선택된 lv2 아이디가 동일할 경우
							let contNoL3 = KMST210P_contArrObj3[k].contNo.split('.');						
							let contNochg = contNoL3[0] + "." + (contNoL3[1]-1) + "." + (contNoL3[2]);	//lv2를 삭제했기 때문에 lv2에 해당하는 값을 뺸다.	lv1.lv2-1.lv3
							KMST210P_contArrObj3[k].contNo = contNochg;
							$('#KMST210P_spnContNo_' + KMST210P_contArrObj3[k].id).text(KMST210P_contArrObj3[k].contNo);
						}
					}
				}
				//lv3를 삭제했을 경우
				else if(selLv == "l3"){								
					if(selArrId[3] == selObj[i].contIdNum && selArrId[4] == selObj[i].contIdNumLv2){			//선택된 아이디에 lv1 값과 lv2값이 같을 경우
						let contNoL3 = selObj[i].contNo.split('.');												//타이틀번호를 문자열로 나눈다
						let contNochg = contNoL3[0] + "." + (contNoL3[1]) + "." + (contNoL3[2] - 1);		//lv3이를 삭제했기 떄문에 lv3에 해당하는 값을 뺀다	lv1.lv2.lv3-1
						selObj[i].contNo = contNochg;														//수정된 값을 오브젝트에 넣는다.
						$('#KMST210P_spnContNo_' + selObj[i].id).text(selObj[i].contNo);					//span요소에 값을 변경해 준다.
						
					}
				}
				
			}

		}
		
		//delNum 즉 삭제할 인덱스 번호가 있을 경우
		if(delNum != -1){
			if(selLv == "l1"){
				KMST210P_contNum--;

				//lv1은 lv2,lv3를 삭제해야 한다.
				//lv2 div 삭제
				for(var i=0; i<spliceArr.length; i++){
					$('#KMST210P_divCont_' + KMST210P_contArrObj2[spliceArr[i]].id).remove();
				}
				
				//lv2 오브젝트 삭제
				for(var i=0; i<spliceArr.length; i++){
					KMST210P_contArrObj2.splice(spliceArr[i], 1);
				}
				
				//lv3 div 삭제
				for(var i=0; i<spliceArr2.length; i++){
					$('#KMST210P_divCont_' + KMST210P_contArrObj3[spliceArr2[i]].id).remove();
				}
				
				//lv3 오브젝트 삭제
				for(var i=0; i<spliceArr2.length; i++){
					KMST210P_contArrObj3.splice(spliceArr2[i], 1);
				}
				
				
			} else if(selLv == "l2"){
				for(var i=0; i<spliceArr.length; i++){
					$('#KMST210P_divCont_' + KMST210P_contArrObj3[spliceArr[i]].id).remove();
				}
				for(var i=0; i<spliceArr.length; i++){
					KMST210P_contArrObj3.splice(spliceArr[i], 1);
				}
				
			}
			
			if(!Utils.isNull(spliceObj)){
				spliceObj.splice(spliceId,1);
			}
			
			selObj.splice(delNum, 1);
			
			$('#KMST210P_divCont_' + selId).remove();
		}
		
		
		
	}
	
}


function KMST210P_fnContListSave(){
	
	let KMST210P_contArrObjTotal = [];
	KMST210P_IndexList = [];
	for(var i=0; i<KMST210P_contArrObj.length; i++){
		
		let idLv1 = KMST210P_contArrObj[i].id;
		let idLv2;
		let idLv3;
		
		let edtCode = $('#KMST210P_edtContEdit_' + idLv1).summernote('code');
		let edtText = Utils.summerTagReplace(edtCode);					//kw---20240614 : summernote - 기능 수정 (테이블 관련)		
		
		let objLv1 = {
				moktiNo			: $('#KMST210P_spnContNo_'+ idLv1).text(),			//목차번호
				hgrkMoktiNo		: "0",																			//상위목차번호
				titleTag		: $('#KMST210P_inpContTitle_'+ idLv1).val(),		//목차제목코드
				moktiTite		: $('#KMST210P_inpContTitle_'+ idLv1).val(),		//목차제목
				moktiPrsLvl		: 1,																			//목차현재레벨
				cntntsCtt		: edtCode,																		//상세내용코드
				cntntsCttTxt 	: edtText,																		//상세내용텍스트
		}
		
		KMST210P_IndexList.push(objLv1);
		
		for(var j=0; j<KMST210P_contArrObj2.length; j++){
			if(KMST210P_contArrObj2[j].idLv1 == idLv1){
				idLv2 = KMST210P_contArrObj2[j].id;
				
				let edtCodeLv2 = $('#KMST210P_edtContEdit_' + idLv2).summernote('code');
				let edtTextLv2 = edtCode.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
				
				let objLv2 = {
						moktiNo			: $('#KMST210P_spnContNo_'+ idLv2).text(),			//목차번호
						hgrkMoktiNo		: $('#KMST210P_spnContNo_'+ idLv1).text(),			//상위목차번호
						titleTag		: $('#KMST210P_inpContTitle_'+ idLv2).val(),		//목차제목코드
						moktiTite		: $('#KMST210P_inpContTitle_'+ idLv2).val(),		//목차제목
						moktiPrsLvl		: 2,												//목차현재레벨
						cntntsCtt		: edtCodeLv2,										//상세내용코드
						cntntsCttTxt 	: edtTextLv2,										//상세내용텍스트
				}
				
				KMST210P_IndexList.push(objLv2);
				
				for(var k=0; k<KMST210P_contArrObj3.length; k++){
					idLv3 = KMST210P_contArrObj3[k].id;
					
					let edtCodeLv3 = $('#KMST210P_edtContEdit_' + idLv3).summernote('code');
					let edtTextLv3 = edtCode.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
					
					let objLv3 = {
							moktiNo			: $('#KMST210P_spnContNo_'+ idLv3).text(),			//목차번호
							hgrkMoktiNo		: $('#KMST210P_spnContNo_'+ idLv2).text(),			//상위목차번호
							titleTag		: $('#KMST210P_inpContTitle_'+ idLv3).val(),		//목차제목코드
							moktiTite		: $('#KMST210P_inpContTitle_'+ idLv3).val(),		//목차제목
							moktiPrsLvl		: 3,												//목차현재레벨
							cntntsCtt		: edtCodeLv3,										//상세내용코드
							cntntsCttTxt 	: edtTextLv3,										//상세내용텍스트
					}
					
					KMST210P_IndexList.push(objLv3);
				}
			}
		}
	}	
}

//kw--- 게시글 저장시 아이템 리스트화(기존 코드와 동일하게 하기 위함)
function KMST210P_fnSubCreateCntntTreeListNew(){
	
	let KMST210P_contArrObjTotal = [];
	KMST210P_IndexList = [];
	
	let dbMoktiNo = 1;
	
	let dbHgrkMoktiNoLv2 = 0;
	let dbHgrkMoktiNoLv3 = 0;
	
	
	let nowLv = "1";
	for(var i=0; i<KMST210P_contArrObj.length; i++){
		
		let idLv1 = KMST210P_contArrObj[i].id;
		let idLv2;
		let idLv3;
		
		let moktiNoLv2;
		let moktiNoLv3;
		
		let edtCode = $('#KMST210P_edtContEdit_' + idLv1).summernote('code');
		let edtText = edtCode.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
		
		
		let objLv1 = {
				moktiNo			: dbMoktiNo,			//목차번호
				hgrkMoktiNo		: 0,										//상위목차번호
				titleTag		: $('#KMST210P_inpContTitle_'+ idLv1).val(),		//목차제목코드
				moktiTite		: $('#KMST210P_inpContTitle_'+ idLv1).val(),		//목차제목
				moktiPrsLvl		: 1,																			//목차현재레벨
				cntntsCtt		: edtCode,																		//상세내용코드
				cntntsCttTxt 	: edtText,																		//상세내용텍스트
		}
		dbHgrkMoktiNoLv2 = dbMoktiNo;
		dbMoktiNo++;
		
		KMST210P_IndexList.push(objLv1);
		
		for(var j=0; j<KMST210P_contArrObj2.length; j++){
			if(KMST210P_contArrObj2[j].idLv1 == idLv1){
				idLv2 = KMST210P_contArrObj2[j].id;
				
				let edtCodeLv2 = $('#KMST210P_edtContEdit_' + idLv2).summernote('code');
				let edtTextLv2 = edtCode.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
				
				let arrMoktiNoLv2 = $('#KMST210P_spnContNo_'+ idLv2).text().split('.');
				moktiNoLv2 = arrMoktiNoLv2[1];
				
				let objLv2 = {
						moktiNo			: dbMoktiNo,			//목차번호
						hgrkMoktiNo		: dbHgrkMoktiNoLv2,			//상위목차번호
						titleTag		: $('#KMST210P_inpContTitle_'+ idLv2).val(),		//목차제목코드
						moktiTite		: $('#KMST210P_inpContTitle_'+ idLv2).val(),		//목차제목
						moktiPrsLvl		: 2,												//목차현재레벨
						cntntsCtt		: edtCodeLv2,										//상세내용코드
						cntntsCttTxt 	: edtTextLv2,										//상세내용텍스트
				}
				
				dbHgrkMoktiNoLv3 = dbMoktiNo;
				dbMoktiNo++;
				KMST210P_IndexList.push(objLv2);
				
				for(var k=0; k<KMST210P_contArrObj3.length; k++){
					if(KMST210P_contArrObj3[k].idLv2 == idLv2){
						idLv3 = KMST210P_contArrObj3[k].id;
						
						let edtCodeLv3 = $('#KMST210P_edtContEdit_' + idLv3).summernote('code');
						let edtTextLv3 = edtCode.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
						
						let arrMoktiNoLv3 = $('#KMST210P_spnContNo_'+ idLv3).text().split('.');
						moktiNoLv3 = arrMoktiNoLv3[2];
						
						let objLv3 = {
								moktiNo			: dbMoktiNo,			//목차번호
								hgrkMoktiNo		: dbHgrkMoktiNoLv3,			//상위목차번호
								titleTag		: $('#KMST210P_inpContTitle_'+ idLv3).val(),		//목차제목코드
								moktiTite		: $('#KMST210P_inpContTitle_'+ idLv3).val(),		//목차제목
								moktiPrsLvl		: 3,												//목차현재레벨
								cntntsCtt		: edtCodeLv3,										//상세내용코드
								cntntsCttTxt 	: edtTextLv3,										//상세내용텍스트
						}
						
						KMST210P_IndexList.push(objLv3);
						dbMoktiNo++;	
					}
				}
			}
		}
	}	
	
}

function KMST210P_fnTitleChng(){
	
	if(Utils.isNull($("#KMST210P_Title").val())){
		$("#KMST210P_spnTitle").text("지식등록");
	} else {
		$("#KMST210P_spnTitle").text("지식등록 - " + $("#KMST210P_Title").val());
	}
}

function fnKldInfoSucc(nStatus){
	$('#KMST210P_btnAddContTitle').prop('disabled', nStatus);
	$('#KMST210P_btnAddContSub').prop('disabled', nStatus);
	$('#KMST210P_btnContListAllClose').prop('disabled', nStatus);
	$('#KMST210P_btnContListAllOpen').prop('disabled', nStatus);
	$('#KMST210P_btnContFullScreen').prop('disabled', nStatus);
	$('#KMST210P_btnContSave2').prop('disabled', nStatus);
	$('#KMST210P_btnContListDel').prop('disabled', nStatus);
}

//날짜 변환
function KMST210P_fnDateChage(str){
	let year =str.substring(0,4)
	let month =str.substring(4,6)
	let day =str.substring(6,8)
	return year+"-"+month+"-"+day;
}