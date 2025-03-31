/***********************************************************************************************
* Program Name : SMS 발송템플릿 찾기 - POP(SYSM435P.jsp)
* Creator      : sukim
* Create Date  : 2022.06.15
* Description  :  SMS 발송템플릿 찾기 - POP
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.15     sukim            퍼블변경 및 수정
************************************************************************************************/
let SYSM435PDataSource, grdSYSM435P;
let SYSM435P_tmplDvCdVal = '';

let paramFilePath = [];
let paramFileNameOrg = [];
let paramFileNameSave = [];
let paramDelFileName = [];
let fileMaxCount = 3;

$(document).ready(function () {
	
	SYSM4315P_fnSelectCombo();
	SYSM435P_fnSetKendoGrid();
	
	SYSM435P_fnSearchList();
	
	//조회 Button
	$('#SYSM435P_btnSearch').off("click").on("click", function () {
		SYSM435P_fnSearchList();
	});	
	
	//확인 Button
	$('#SYSM435P_fnConfirm').off("click").on("click", function () {
		SYSM435P_fnPopCallback();
	});	
//
//	 var data = grdSYSM435P.dataSource.data();
//     var totalNumber = data.length;
//     console.log(totalNumber)
//     grdSYSM435P.select("tr:eq(1)");
//     
//     
//     
//	var timer = setInterval(function(){
//		grdSYSM435P.select("tr:eq(1)");
//	},1000);
	
});

//콤보 초기화
function SYSM435P_fnInitCombo(){
	$("#SYSM435P_cboSelect").kendoComboBox({ 
		dataTextField: "text",
		dataValueField: "value",
		clearButton: false,
		height: 200,
		change: function(e) {
			SYSM435P_fnChangeSelect();
		}
	});
}

//콤보 data set
function SYSM4315P_fnSelectCombo(){
	SYSM435P_fnInitCombo();
	let SYSM435P_data = { 
	"codeList": [
			{"mgntItemCd":"C0094"}
	]};
	Utils.ajaxCall('/comm/COMM100SEL01', JSON.stringify(SYSM435P_data), function (result) {
		let SYSM435P_cmmCodeList = JSON.parse(result.codeList);
		Utils.setKendoComboBox(SYSM435P_cmmCodeList, "C0094", "#SYSM435P_cboSelect", "", "전체"); 
	});
}

function SYSM435P_fnChangeSelect(){
	let SYSM435P_tmplDvCd = $('#SYSM435P_cboSelect').data("kendoComboBox").dataItem();	
	SYSM435P_tmplDvCd.value  === '' ? (SYSM435P_tmplDvCdVal='') : (SYSM435P_tmplDvCdVal=SYSM435P_tmplDvCd.value);
	//console.log("SYSM435P_fnChangeSelect ->"+ SYSM435P_tmplDvCdVal);
}

function SYSM435P_fnSetKendoGrid(){
	SYSM435PDataSource={
			transport: {
				read : function (SYSM435P_jsonStr) {
					if(Utils.isNull(SYSM435P_jsonStr.data)){
						Utils.ajaxCall('/sysm/SYSM435SEL01', SYSM435P_jsonStr, SYSM435P_resultList, 
							window.kendo.ui.progress($("#grdSYSM435P"), true), window.kendo.ui.progress($("#grdSYSM435P"), false
						));
					}else{
						window.kendo.ui.progress($("#grdSYSM435P"), false);
					}
				},
			},
			schema : {
				type: "json",
				model: {
		            fields: {
		            	tmplMgntNo : { field: "tmplMgntNo" ,type: 'string' }, //템플릿번호
		            	tmplDvCd   : { field: "tmplDvCd"   ,type: 'string' }, //템플릿구분코드
		            	tmplDvCdNm : { field: "tmplDvCdNm" ,type: 'string' }, //템플릿구분명
		            	tmplNm     : { field: "tmplNm"     ,type: 'string' }  //템플릿명...고객명
		            }
				}
			}
		}
		$("#grdSYSM435P").kendoGrid ({
			DataSource : SYSM435PDataSource,
			persistSelection: true,
			sortable: true,
			selectable: true,
			noRecords: { template: '<div class="nodataMsg"><p>'+SYSM435P_langMap.get("grid.nodatafound")+'</p></div>' },
			pageable: {
				  refresh:false,
				  buttonCount:10,
				  pageSize : 100,
				  messages: {
					display: " ",
					empty: SYSM435P_langMap.get("fail.common.select"),
					itemsPerPage: ""
				 }
			},
			dataBinding: function() {
				record = (this.dataSource.page() -1) * this.dataSource.pageSize();	
			},
			dataBound: SYSM435P_onDataBound,
			columns: [ 
				{ width: 35,     field: "check",      title: " ", template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>', }, 
				{ width: 100,    field: "tmplMgntNo", title: SYSM435P_langMap.get("SYSM435P.tmplMgntNo"),     	type: "String"},
				{ hidden: true,  field: "tmplDvCd",   title: SYSM435P_langMap.get("SYSM435P.tmplDvCd"), 		type: "String"}, 
				{ width: 120,    field: "tmplDvCdNm", title: SYSM435P_langMap.get("SYSM435P.tmplDvCdNm"),     	type: "String"}, 	
				{ width: "auto", field: "tmplNm",     title: SYSM435P_langMap.get("SYSM435P.tmplNm"),      		type: "String", attributes: {"class": "textEllipsis"}, }, 
			],
			height: 430
		});
		
	grdSYSM435P = $("#grdSYSM435P").data("kendoGrid");
}

function SYSM435P_onDataBound(e) {
	$("#grdSYSM435P").on('click','tbody tr[data-uid]',function (e) {
		let SYSM435P_cell = $(e.currentTarget);
		let	SYSM435P_item = grdSYSM435P.dataItem(SYSM435P_cell.closest("tr"));
		let SYSM435P_param = {
				tenantId    : GLOBAL.session.user.tenantId,	
				tmplMgntNo  : SYSM435P_item.tmplMgntNo
		};		
		//console.log("SYSM435P_onDataBound -----> " + SYSM435P_param);
		
		Utils.ajaxCall('/sysm/SYSM435SEL02', JSON.stringify(SYSM435P_param), function (SYSM435P_result) {
			let SYSM435P_jsonDecode = SYSM435P_result.SYSM435SEL02Data;
			SYSM435P_fnPreview(SYSM435P_jsonDecode);
			
			// 템플릿에 등록된 파일목록 미리보기 화면에 표출
			SYSM435P_fnfileList(SYSM435P_result.files);
		});
	});	
}

//발송템플릿 목록 조회
function SYSM435P_fnSearchList(){
	let SYSM435P_tmplNm = $('#SYSM435P_SmsTmplNm').val();
	let SYSM435P_param = {
		"tenantId" : GLOBAL.session.user.tenantId,	
		"tmplDvCd" : SYSM435P_tmplDvCdVal,
		"useDvCd"  : "Y",
		"tmplNm"   : SYSM435P_tmplNm,
		"mlingCd"  : GLOBAL.session.user.mlingCd
	};
	
	SYSM435PDataSource.transport.read(JSON.stringify(SYSM435P_param));
}

//조회 결과 set
function SYSM435P_resultList(SYSM435P_result){
	
	console.log(SYSM435P_result);
	let SYSM435P_jsonDecode = SYSM435P_result.SYSM435SEL01List;

	grdSYSM435P.setDataSource(SYSM435P_jsonDecode);
	grdSYSM435P.dataSource.options.schema.data = SYSM435P_jsonDecode;	
	
	var listCount = 0;
	for (const list of SYSM435P_jsonDecode) {

		if(Utils.getUrlParam('tmplMgntNo') == list.tmplMgntNo && Utils.getUrlParam('tmplNm') == list.tmplNm){
			
			//그리드 선택
			grdSYSM435P.select("tr:eq(" + listCount + ")");
			
			//문자내용 표출
			let SYSM435P_param = {
					tenantId    : GLOBAL.session.user.tenantId,	
					tmplMgntNo  : Utils.getUrlParam('tmplMgntNo')
			};		
			//console.log("SYSM435P_onDataBound -----> " + SYSM435P_param);
			
			Utils.ajaxCall('/sysm/SYSM435SEL02', JSON.stringify(SYSM435P_param), function (SYSM435P_result) {
				let SYSM435P_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(SYSM435P_result.SYSM435SEL02Data)));
				SYSM435P_fnPreview(SYSM435P_jsonDecode);
			});
			
			//kw--- 20230421 첨부파일 표출
			for(var i=0; i<fileMaxCount; i++){
				console.log(Utils.getUrlParam('apndFileNm' + (i+1)));
				
				if(Utils.getUrlParam('apndFileIdxNm' + (i+1)) != null && Utils.getUrlParam('apndFileIdxNm' + (i+1)) != ""){
					//파일이름에만 값을 넣는 이유는 input(file) 컨트롤러에 값을 갖고 있지 않기 때문.
					//확인 버튼을 누를 경우 input(file) 컨트롤러에 값이 존재하는지에 따른 여부로 첨부파일이 변경되었는지를 검사
					$("#SYSM435P_inputFileName" + (i+1)).val(Utils.getUrlParam('apndFileNm' + (i+1)));
					
					//첨부파일이 있으므로 버튼은 삭제 버튼으로 변경
//					$("#SYSM435P_btnUpLoadFile" + (i+1)).html(SYSM435P_langMap.get("SYSM435P.fileBtnDel"));

					paramFilePath[i] = Utils.getUrlParam('apndFilePsn' + (i+1));
					paramFileNameOrg[i] = Utils.getUrlParam('apndFileNm' + (i+1));
					paramFileNameSave[i] = Utils.getUrlParam('apndFileIdxNm' + (i+1));
				}
			}
			
			// kw--- 파라미터로 넘어온 삭제할 첨부파일 정보를 구분자로 문자열을 나누어 'paramDelFileName' 배열 변수에 저장
			// 24.01.15 삭제한 파일이 있는 경우에만 수행할 수 있도록 수정 
			if(typeof Utils.getUrlParam('delFileName') == 'string') {
				paramDelFileName = Utils.getUrlParam('delFileName').split('|');
			}
			
		}
		listCount++;
    }
	
	
}

//미리보기(SYSM430M의 미리보기와 동일한 로직임)
function SYSM435P_fnPreview(SYSM435P_item){
	let SYSM435P_html = '';
	for(i=0; i < SYSM435P_item.length; i++){

		if( SYSM435P_item[i].itemDvCd == 3 || SYSM435P_item[i].itemDvCd == 4 ){
			SYSM435P_html += "$" + SYSM435P_item[i].itemCdDataNm + "$" + " " ;
		}else if( SYSM435P_item[i].itemDvCd == 1 || SYSM435P_item[i].itemDvCd == 2 || SYSM435P_item[i].itemDvCd == 5 ){
			SYSM435P_html += SYSM435P_item[i].itemCdDataNm + " ";
		}
		if( SYSM435P_item[i].lineGap == 1 ){
			SYSM435P_html += "<br />";
		}
		if( SYSM435P_item[i].lineGap == 2 ){
			SYSM435P_html += "<br />" + "<br />";
		}
		if( SYSM435P_item[i].lineGap == 3 ){
			SYSM435P_html += "<br />" + "<br />" + "<br />";
		}
		if( SYSM435P_item[i].itemDvCd == 5 ){
			SYSM435P_html += "<a style='text-decoration:underline' href='" + SYSM435P_item[i].url + "'>" + SYSM435P_item[i].url + "<br />" + "</a>";
		}		
	}
	$("#SYSM435P_preview").empty();
	$("#SYSM435P_preview").append(SYSM435P_html);
}

$("#grdSYSM435P").on('dblclick','tbody tr[data-uid]',function (SYSM431P_e) {
	
	SYSM435P_fnPopCallback();
});

function SYSM435P_fnPopCallback(){
	let grid = $("#grdSYSM435P").data("kendoGrid");
	let sel = grid.select();
	let SYSM435P_gridItem = "";
	let SYSM435P_item = "";
	
	let filePath = [];
	let fileNameOrg = [];
	let fileNameSave = [];
	let delFilePath = [];
	let delFileName = [];
	
	
    var imgCount = 0;
	
	var formData = new FormData();
	
	//kw---20230419 : 템플릿을 선택하지 않고 확인 버튼을 눌렀을 경우
	if(sel.length == 0){
		Utils.alert(SYSM435P_langMap.get("SYSM435P.errMsg1"));
		return;
	}
	
	//선택한 그리드의 데이터 가져오기
	$.each (sel, function(idx, row) {
    	SYSM435P_gridItem = grid.dataItem(row); 
    });
	
	//삭제해야될 항목 체크
	
	for(var i=0; i<paramDelFileName.length; i++){
		delFileName[i] = paramDelFileName[i];
	}
	
	var delFileCount = delFileName.length;
	
	//첨부 파일은 최대 3개 까지 할 수 있으므로 반복문을 3번 돌리겠다고 명시
	//파일 저장과 삭제할 항목을 구분한다.
	for(var i=1; i<=fileMaxCount; i++){
		
		//input(text) 컨트롤러에 첨부파일 이름이 있으면 첨부파일이 있다는것!!
		if ( $("#SYSM435P_inputFileName" + i).val() != null && $("#SYSM435P_inputFileName" + i).val() != ""){
			//input(file) 컨트롤러에 값이 없으면 파라미터로 넘어온 항목이므로 무시.
			//반대로 input(file) 컨트롤러에 값이 있으면 파일을 새로 추가한것으로 간주.
//			if($("#SYSM435P_inputUpLoadFile" + i).val() != ""){
//				
//				//첨부파일 정보 배열에 값을 넣는다.
//				var inputFile = $("#SYSM435P_inputUpLoadFile" + i );//파일input태그를 가져와
//				var file = inputFile[0].files[0];//파일을 뽑은 후
//				formData.append('img_files', file); //Object정보를 formData에 설정
//				
//				//파일이 변경 되었으므로 파일 삭제 정보 배열에 파일 이름을 넣는다.
//				if(paramFileNameSave[(i-1)] != null && paramFileNameSave[(i-1)] != ""){
//					delFileName[delFileCount]	= paramFileNameSave[(i-1)];
//					//삭제할 이미지 개수
//					delFileCount++;
//				}
//				
//				
//				//첨부할 이미지 개수
//				imgCount++;
//			}
			
			//첨부할 이미지 개수
			imgCount++;
			
		} else {	//input(text) 컨트롤러에 값은 없지만 수정하면서 기존에 있던 첨부파일을 삭제한 것일수도 있기 때문에 체크
			//파라미터로 넘어온 데이터가 있는지 확인
			if(paramFileNameSave[(i-1)] != null && paramFileNameSave[(i-1)] != ""){
				//파라미터에는 데이터가 있지만 input(text) 컨트롤러에 값이 없으면 기존에 있던 첨부파일을 삭제한것으로 간주
				delFileName[delFileCount]	= paramFileNameSave[(i-1)];
				delFileCount++;
			}
		}
	}
	
//	//삭제할 항목이 1개 이상일 경우
//	if(delFileCount > 0){
//		var formDataDel = new FormData();
//		
//		formDataDel.append('SYSM435FilDel_data',JSON.stringify({
//			tenantId 		: GLOBAL.session.user.tenantId
//			, UsrId 		: GLOBAL.session.user.user
//			, orgCd 		: GLOBAL.session.user.orgCd
//			, uploadPath 	: "MMS_IMG"
//			, delFileName	: delFileName
//		}));
//		
//		//파일 삭제 컨트롤 전달
//		Utils.ajaxCallFormData('/sysm/SYSM435FilDel',formDataDel,function(data){});
//	}
	
	//추가할 이미지가 1개 이상일 경우
	if(imgCount > 0){
		
		filePath 		= paramFilePath;
		fileNameOrg 	= paramFileNameOrg;
		fileNameSave	= paramFileNameSave;
		
		let fileInfo = {
				fileNameOrg		: fileNameOrg,
				fileNameSave	: fileNameSave,
				filePath		: filePath,
				delFileName		: delFileName,
				delFileCount	: delFileCount
		    }
		
		SYSM435P_item = $.extend(SYSM435P_gridItem, fileInfo);
		Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM435P_item);
		self.close();
		
		return;
		
		formData.append('COMM100INS01_data',JSON.stringify({
			tenantId 		: GLOBAL.session.user.tenantId
			, UsrId 		: GLOBAL.session.user.user
			, orgCd 		: GLOBAL.session.user.orgCd
			, uploadPath 	: "MMS_IMG"
		}));
		
		//파일 저장 컨트롤 전달
		Utils.ajaxCallFormData('/comm/COMM100INS01',formData,function(data){
			let fileSaveData = JSON.parse(data.info);		//파일 저장 후 컨트롤러로 부터 넘어온 데이터(기존 파일명, 저장 파일명, 저장 파일 경로)
			var fileCount = 0;								//fileSaveData 배열의 인덱스를 명시하기 위함
			var arrInsertCount = 0;							//콜백 파라미터에 담을 배열을 저장하기 위한 인덱스 값
			var bCountUp = false;							//arrInsertCount 값을 증가 시킬지에 대한 여부
			
			for(var i=0; i<fileMaxCount; i++){
				
				//반복문을 돌 떄 false로 초기화
				bCountUp = false;
				
				//input(text) 컨트롤러에 값이 있으면 파라미터로 넘어온 값을 넣는다 - 첨부파일 수정이 됐을수도 안됐을수도 있기 때문에 그냥 넣고 본다. 수정된거면 밑에 조건문에서 변경된 값을 넣어준다.
				if ( $("#SYSM435P_inputFileName" + (i+1)).val() != null && $("#SYSM435P_inputFileName" + (i+1)).val() != ""){
					filePath[i] 		= paramFilePath[i];
					fileNameOrg[i] 		= paramFileNameOrg[i];
					fileNameSave[i] 	= paramFileNameSave[i];
					
					bCountUp = true;
				}
				
				//input(file) 컨트롤러에 값이 있으면 첨부파일이 수정된거기 때문에 파일 업로드 후 넘어온 정보를 다시 넣어준다. 
				if($("#SYSM435P_inputUpLoadFile" + (i+1)).val() != ""){
					filePath[arrInsertCount] 		= fileSaveData[fileCount].apndFilePsn;
					fileNameOrg[arrInsertCount] 	= fileSaveData[fileCount].apndFileNm;
					fileNameSave[arrInsertCount] 	= fileSaveData[fileCount].apndFileIdxNm;
					
					fileCount++;
					bCountUp = true;
				}
				
				//배열에 값을 넣어 줬으니 배연 인덱스 값을 증가 시켜준다.
				if(bCountUp == true){
					arrInsertCount++;
				}
			}
			
			let fileInfo = {
				fileNameOrg		: fileNameOrg,
				fileNameSave	: fileNameSave,
				filePath		: filePath,
				delFileName		: delFileName,
				delFileCount	: delFileCount
		    }
			
			SYSM435P_item = $.extend(SYSM435P_gridItem, fileInfo);
			Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM435P_item);
			self.close();
		});
	} else {
		var fileCount = 0;
		
		for(var i=0; i<fileMaxCount; i++){
			
			if($("#SYSM435P_inputFileName" + (i+1)).val() != ""){
				fileNameOrg[fileCount] 		= paramFileNameOrg[i];
				fileNameSave[fileCount] 	= paramFileNameSave[i];
				filePath[fileCount] 		= paramFilePath[i];
				fileCount++;
			}
		}
		
		let fileInfo = {
				fileNameOrg		: fileNameOrg,
				fileNameSave	: fileNameSave,
				filePath		: filePath,
				delFileName		: delFileName,
				imgCount		: imgCount,
				delFileCount	: delFileCount,
		    }
		
		SYSM435P_item = $.extend(SYSM435P_gridItem, fileInfo);
		Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))(SYSM435P_item);
	    self.close();
	}
	
    
}

//kw---20230418 : SMS 첨부 파일
function SYSM435P_fnFileUpload(SYSM435P_gridItem){
	
	
}

function SYSM435P_fnUploadFileClick(nId){
	var idNum = nId.slice(-1);
	
	if( $( "#SYSM435P_btnUpLoadFile" + idNum ).html() == SYSM435P_langMap.get("SYSM435P.fileBtnUp")){
		
		$( "#SYSM435P_inputUpLoadFile" + idNum ).click();
	} else {
		Utils.confirm(SYSM435P_langMap.get("SYSM435P.fileDelConfMsg"), function () {
			$( "#SYSM435P_btnUpLoadFile" + idNum ).html(SYSM435P_langMap.get("SYSM435P.fileBtnUp"));
			$( "#SYSM435P_inputFileName" + idNum).val("");		
			
			$("#SYSM435P_inputUpLoadFile" + idNum).val("");
        });
		
	}
	
}

function SYSM435P_fnUpLoadFile(input, nId){
	
	var idNum = nId.slice(-1);
	
	let tmpPath = URL.createObjectURL(input.files[0]);
	
//	var fileName = $("#SYSM435P_inputUpLoadFile1").val();
	console.log(tmpPath);
	  
	if(input.files && input.files[0]){
		
		//파일 예외처리
		//1. 사이즈가 1MB 이상일 경우
		var maxSize = 1 * 1024 * 1024; // 1MB
		var fileSize = input.files[0].size;
		if(fileSize > maxSize){
			Utils.alert(SYSM435P_langMap.get("SYSM435P.fileSizeErrMsg"));
		    return;
		}
		
		$( "#SYSM435P_btnUpLoadFile" + idNum ).html(SYSM435P_langMap.get("SYSM435P.fileBtnDel"));
		$( "#SYSM435P_inputFileName" + idNum ).val(input.files[0].name);
	}
}


//미리보기 영역에 템플릿에 등록된 첨부파일 목록 표출
function SYSM435P_fnfileList(result) {
	
	
	
	let list = result;
	
	let len = $('input[type=file]').length;
	
	SYSM435P_tmplFiles = [];
	
	for(var i=1; i<=len; i++) {
		$("#SYSM435P_inputFileName"+i).val('');
//		$("#SYSM435P_btnUpLoadFile"+i).html(SYSM435P_langMap.get("SYSM435P.fileBtnUp"));
	}
	
	//kw---20240216 : 템플릿에서 첨부파일 불러온 데이터를 배열에 넣어주기 (기존에는 확인버튼을 누르면 저장하게 되어 있었음)
	paramFilePath 		= [];		
	paramFileNameOrg 	= [];		
	paramFileNameSave	= [];		
	
	
	$.each(list, function(index, item) {
//		$( "#SYSM435P_btnUpLoadFile" + (index+1) ).html(SYSM435P_langMap.get("SYSM435P.fileBtnDel"));
		
		$( "#SYSM435P_inputFileName" + (index+1)).val('');
		$( "#SYSM435P_inputFileName" + (index+1)).val(item.orign_file_nm);
	
		//kw---20240216 : 템플릿에서 첨부파일 불러온 데이터를 배열에 넣어주기 (기존에는 확인버튼을 누르면 저장하게 되어 있었음)
		paramFilePath[index]		= item.file_path;
		paramFileNameOrg[index]		= item.orign_file_nm;
		paramFileNameSave[index]	= item.upload_file_nm;
		
//		console.log("::::: tset2")
//		$( "#SYSM435P_btnUpLoadFile" + (index+1)).attr('prop', item.file_id);
		SYSM435P_tmplFiles.push(item.file_id);
	});
}