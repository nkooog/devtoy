/*******************************************************************************
 * Program Name : 뉴스레터 등록 (CMMT610P.js) Creator : dwson Create Date : 2023.11.16
 * Description : 뉴스레터 등록 :
 * -----------------------------------------------------------------------------------------------
 * Date | Updater | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.11.16 dwson 최초작성
 ******************************************************************************/

var CMMT610P_cmmCodeList, CMMT610P_grid, CMMT610PDataSource, CMMT610P_ToolTip, CMMT610P_selItem=[];
$(document).ready(function () {
	
	$('#CMMT610P button[name=CMMT610P_btnSave]').off("click").on('click', function () {
		CMMT610P_fnSave();
	});
	
	//초기화 버튼
	$('#CMMT610P button[name=CMMT610P_btnInit]').off("click").on('click', function () {
		CMMT610P_fnReset();
	});

	CMMT610P_init();
});

function CMMT610P_init() {
	if (Utils.getUrlParam("callbackKey") == "CMMT600M_fnCreateDoc" || Utils.getUrlParam("viewType") == 'Y') {
		window.resizeTo(1240, 1000);
		CMMT610P_fnSummEdtCreate("CMMT610P_edtContEdit");
		$('#CMMT610P_divCont').css('display', 'block');
		$('#edtBtnArea').css('display', 'flex');
	}
	else {
		window.resizeTo(1240, 920);
		$('#CMMT610P_divCont_readonly').css('display', 'block');
		$('#edtBtnArea').remove();
		$('#CMMT610P input[name=CMMT610P_inputTitle]').prop('readonly', true);
		$('input[name="CMMT610_chkNlBltnYn"]').prop('disabled', true);
	}
	
	if(Utils.getUrlParam("nlMgntSeq")) CMMT610P_fnInputSetting();
}

function CMMT610P_fnInputSetting() {
	let param = {
		nlMgntSeq: Utils.getUrlParam("nlMgntSeq"),
	}
	Utils.ajaxCall('/cmmt/CMMT610SEL01',  JSON.stringify(param),function(data){
		let info = JSON.parse(JSON.parse(JSON.stringify(data.info)));

		if(info.nlBltnYn ==="Y"){ $('input[name="CMMT610_chkNlBltnYn"]').prop('checked', true);}
		else{$('input[name="CMMT610_chkNlBltnYn"]').prop('checked', false);}
		
		$('#CMMT610P input[name=CMMT610P_nlMgntSeq]').val(info.nlMgntSeq);
		$('#CMMT610P input[name=CMMT610P_inputTitle]').val(info.nlTite);
		$('#CMMT610P_edtContEdit').summernote('code', info.nlCtt);
		
		$('#CMMT610P_nlCtt').html(info.nlCtt);
		
	},null,null,null);
}

//summereditor 생성
function CMMT610P_fnSummEdtCreate(nId){
	
	let selArrId = nId.split('_');
	
	var fontList = ['맑은 고딕', '굴림', '돋움', '바탕', '궁서', 'NotoSansKR', 'Arial', 'Courier New', 'Verdana', 'Tahoma', 'Times New Roamn'];
	
	$('#'+nId).summernote({
		height: 580,                 // set editor height
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
		    onImageUpload : function(files) {
				  CMMT610P_fnSummNoteImgUpload(files[0], this, nId);
				},
				//kw---20240614 : summernote - 기능 수정 (테이블 관련)
			    onPaste: function(e) {
			    	Utils.summerPate(e, nId);
	            },
		  },
		  tableClassName: 'table table-bordered summernote-table', //kw---20240614 : summernote - 기능 수정 (테이블 관련)
	});
}

function CMMT610P_fnSummNoteImgUpload(file, editor, nId) {
	
	var formData = new FormData();
	
	formData.append('img_files', file);
	
	formData.append('COMM100INS01_data',JSON.stringify({
		tenantId : GLOBAL.session.user.tenantId
		, UsrId : GLOBAL.session.user.user
		, orgCd : GLOBAL.session.user.orgCd
		, uploadPath : "CMMT_NL_CNTS_TMP"
	}));
	
	Utils.ajaxCallFormData('/comm/COMM100INS01',formData,function(data){
		let fileSaveData = JSON.parse(data.info);

		for(var i=0; i<fileSaveData.length; i++){
			let url = GLOBAL.contextPath+"/cmmtnlphotocntstmp/"+GLOBAL.session.user.tenantId+"/"+ fileSaveData[i].apndFileIdxNm;
			$('#'+nId).summernote('insertImage', url);
		}
		
	});	
}

//저장
function CMMT610P_fnSave() {
	
	let nlTite = $('#CMMT610P input[name=CMMT610P_inputTitle]').val();
	let nlCtt = $('#CMMT610P_edtContEdit').summernote('code');
	
	//유효성 검사
	if(Utils.isNull(nlTite)){
		Utils.alert(CMMT610P_langMap.get("CMMT610P.valid.title"));
		return;
	}
	if(Utils.isNull(nlCtt)){
		Utils.alert(CMMT610P_langMap.get("CMMT610P.valid.content"));
		return;
	}
	
	let param = {
        nlTite: nlTite,
        nlCtt: nlCtt,
        nlBltnYn: $('input[name="CMMT610_chkNlBltnYn"]').prop('checked') ? 'Y' : 'N',
    }
	
	if (Utils.getUrlParam("callbackKey") == "CMMT600M_fnCreateDoc") {
		
		let addData = {
			regrId: GLOBAL.session.user.usrId,
        	regrOrgCd: GLOBAL.session.user.orgCd,
		}
		$.extend(param, addData);
		
		Utils.confirm(CMMT610P_langMap.get("CMMT610P.confirm.add"), function () {
		    Utils.ajaxCall("/cmmt/CMMT610INS01", JSON.stringify(param), function (result) {
		    	if(result.result == 0) {
		    		Utils.alert(result.msg);
		    	} else {
		    		Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
		        	Utils.alert(CMMT610P_langMap.get("CMMT610P.success.common.save"),window.close);	
		    	}
		    });
	    });
		
	} else {
		
		let modData = {
			nlMgntSeq: $('#CMMT610P input[name=CMMT610P_nlMgntSeq]').val(),
			lstCorprId: GLOBAL.session.user.usrId,
        	lstCorprOrgCd: GLOBAL.session.user.orgCd,
		}
		$.extend(param, modData);
		
		Utils.confirm(CMMT610P_langMap.get("CMMT610P.confirm.edit"), function () {			
			Utils.ajaxCall("/cmmt/CMMT610UPT01", JSON.stringify(param), function (result) {
				if(result.result == 0) {
		    		Utils.alert(result.msg);
		    	} else {
		        	Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
		        	Utils.alert(CMMT610P_langMap.get("CMMT610P.success.common.update"),window.close);
		    	}
	        });
		});
	}
}

function CMMT610P_fnReset() {
	Utils.confirm(CMMT610P_langMap.get("CMMT610P.confirm.reset"), function () {			
		$('#CMMT610P input[name=CMMT610P_inputTitle]').val('');
		$('#CMMT610P_edtContEdit').summernote('code', '');
	});
}