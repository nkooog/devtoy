/***********************************************************************************************

 * Program Name : DASH110P.js
 * Creator      : bykim
 * Create Date  : 2022.07.08
 * Description  : 게시판 상세팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.07.08     bykim            최초생성
 ************************************************************************************************/

var DASH110P_selNcnt, DASH110P_cmmCodeList, DASH110P_mgntItemCdList, DASH110P_selCommt;
var DASH110P_blthgMgntNo, DASH110P_ctgrMgntNo,  DASH110P_downList=[];
var DASH110P_totText ="";


$(document).ready(function () {
	DASH110P_userInfo = GLOBAL.session.user;

	DASH110P_fnSelectCombo();

	// 미리보기 호출
	var DASH110P_detailData = Utils.getUrlParam('type');
	if(DASH110P_detailData == 'preview'){
		
		var name = window.opener.CMMT300P_selCtg.ctgrNm;
		var title = $("#CMMT300P_title",opener.document).val();
		var regInfo = '<li>'+DASH110P_userInfo.decUsrNm +"("+DASH110P_userInfo.usrId+")</li>"
					+'<li>'+kendo.format("{0:yyyy-MM-dd HH:mm:ss}",new Date())+"</li>";
		$('#DASH110P_regInfo').append(regInfo)
		$('#DASH110P_ctgrNm').text(name) //게시판명
		$('#DASH110P_title').text(title) // 제목
		// var blthgMgntNo = Utils.isNull()==true? '00' :  ;
		var blthgMgntNo = Utils.isNull(Utils.getUrlParam('DASH110P_blthgMgntNo'))==true? '00' : Utils.getUrlParam('DASH110P_blthgMgntNo') ;
		$('#DASH110P_blthgMgntNo').text( DASH110P_langMap.get("DASH110P.ctntNo")+' - '+blthgMgntNo)
		$('#DASH110P_goodNcnt').text(0)
		$('#DASH110P_dnwNcnt').text(0)
		$('#DASH110P_rcmdNcnt').text(0)
		

	    $('#DASH110P_commentPanel').css('display', 'none');

		var cntns = $(opener.document)[0].defaultView.CMMT300P_IndexList;
		//목차 설정
		//DASH110P_fnIndeCreate(cntns, 'preview');
		
		for (let i = 0; i < cntns.length; i++) {
			// let title = cntns[i].moktiTite;
			// console.log(cntns[i])
			// $('#DASH110P_content').append("<hr>");
			// $('#DASH110P_content').append(title);
			// $('#DASH110P_content').append("<hr>");

			if(!Utils.isNull(window.opener.CMMT300P_previewImg)){
				$('#DASH110P_imgView').css("display",'block');
				$('#DASH110P_boardHead').css("padding-top","10px");
				$('#DASH110P_boardHead').css("padding-bottom","20px");
				$('#DASH110P_imgView')[0].src = window.opener.CMMT300P_previewImg;
			}

			let bltnCtt = cntns[i].bltnCtt;
			$('#DASH110P_content').append(bltnCtt);
		}
		
	    DASH110P_fnSetFileList(window.opener.CMMT300P_fileList);
    
	}else{
		// 수정 시 상세 조회
		DASH110P_ctgrMgntNo = Utils.getUrlParam('DASH110P_ctgrMgntNo')
		DASH110P_blthgMgntNo = Utils.getUrlParam('DASH110P_blthgMgntNo')

		if(!Utils.isNull(DASH110P_blthgMgntNo)){}
			
			var DASH110P_data = { tenantId			: DASH110P_userInfo.tenantId,
								  ctgrMgntNo		: DASH110P_ctgrMgntNo,
								  blthgMgntNo 		: DASH110P_blthgMgntNo
			};	

			var DASH110P_jsonStr = JSON.stringify(DASH110P_data);
			
			//상세내용 조외
			Utils.ajaxCall('/cmmt/CMMT300SEL06', DASH110P_jsonStr, DASH110P_fnCallBack);
			
			// 댓글 조회 
			Utils.ajaxCall('/cmmt/CMMT230SEL02', DASH110P_jsonStr, DASH110P_fnComtCallBack);
	}
	
});


// function DASH110P_fnIndeCreate(cntns, status){
// 	let index = "";
//
// 	for(let i=0;i<cntns.length;i++){
//
// 		let cntntstag ="";
// 		if(status == 'preview'){
// 			cntntstag = cntns[i].titleTag
// 		}else{
// 			cntntstag = $(Utils.htmlDecode(cntns[i].moktiTite))[0]
// 		}
// 		if(!Utils.isNull(cntntstag)){
// 			let href = ' href="#Temp_'+cntns[i].moktiNo+'"';
// 			if(i === 0){
// 				index += '<li><a'+href+'>'+cntntstag.textContent +'</a>';
// 			}else{
// 				if(cntns[i-1].moktiPrsLvl == '1'){
// 					if(cntns[i].moktiPrsLvl == '1'){
// 						index += '</li>';
// 					}
// 					if(cntns[i].moktiPrsLvl == '2'){
// 						index += '<ol>';
// 					}
// 					index += '<li><a'+href+'>'+ cntntstag.textContent +'</a>';
// 				}
// 				if(cntns[i-1].moktiPrsLvl == '2'){
// 					if(cntns[i].moktiPrsLvl == '1'){
// 						index += '</ol></li>';
// 						index += '<li><a'+href+'>'+ cntntstag.textContent +'</a>';
// 					}
// 					if(cntns[i].moktiPrsLvl == '2'){
// 						index += '</li>';
// 						index += '<li><a'+href+'>'+ cntntstag.textContent +'</a>';
// 					}
// 					if(cntns[i].moktiPrsLvl == '3'){
// 						index += '<ol>';
// 						index += '<li><a'+href+'>'+ cntntstag.textContent +'</a></li>';
// 					}
// 				}
// 				if(cntns[i-1].moktiPrsLvl == '3'){
// 					if(cntns[i].moktiPrsLvl == '1'){
// 						index += '</ol></li>';
// 						index += '<li><a'+href+'>'+ cntntstag.textContent +'</a>';
// 					}
// 					if(cntns[i].moktiPrsLvl == '2'){
// 						index += '</ol></li>';
// 						index += '<li><a'+href+'>'+ cntntstag.textContent +'</a>';
// 					}
// 					if(cntns[i].moktiPrsLvl == '3'){
// 						index += '<li><a'+href+'>'+ cntntstag.textContent +'</a></li>';
// 					}
// 				}
// 			}
// 		}
// 	}
// 	$('#DASH110P ol[name=DASH110P_IndexList]').append(index);
// }



//공통코드 조회
function DASH110P_fnSelectCombo(){
	
	DASH110P_mgntItemCdList = [
		{"mgntItemCd":"C0064"},
		{"mgntItemCd":"C0084"},
		
	];
	
	Utils.ajaxCall('/comm/COMM100SEL01',  JSON.stringify({ "codeList": DASH110P_mgntItemCdList}), DASH110P_fnSetCombo) 
}

//콤보 세팅
function DASH110P_fnSetCombo(data){
	var DASH110P_jsonEncode = JSON.stringify(data.codeList);
	var DASH110P_object=JSON.parse(DASH110P_jsonEncode);
	var DASH110P_jsonDecode = JSON.parse(DASH110P_object);

	DASH110P_cmmCodeList = DASH110P_jsonDecode;
}

//파일 다운로드
function DASH110P_fnDownloadFile(obj) {
    const apndFilePsn = $(e).data("psn");
    var pathKey =  "CMMT";
    var fileName = $(e).data("index");
    var oriFileName  = $(e).data("name");
    var tenant = GLOBAL.session.user.tenantId;
    window.location.href = GLOBAL.contextPath + "/file/download?pathKey="+ pathKey +"&fileName="+ fileName+ "&oriFileName=" +oriFileName +"&tenant=" + tenant;
}


//첨부파일  validation & li 추가
function DASH110P_fnSetFileList(filelist){
	for(let i=0;i<filelist.length;i++){
		let DASH110P_addFile = '<li><mark class="icoComp_download"></mark><a>'+filelist[i].name+'</a></li>';
		 $("#DASH110P_fileList").append($(DASH110P_addFile));	
	}
		
	$('#DASH110P_fileCnt')[0].innerHTML ='('+filelist.length+')';
	
}

//============================================= 게시글 상세조회 function start ===============================================

// 상세 조회 setting
function DASH110P_fnCallBack(data){
	let DASH110P_jsonEncode = JSON.stringify(data.CMMT300VOInfo);
	let DASH110P_object=JSON.parse(DASH110P_jsonEncode);
	let DASH110P_jsonDecode = JSON.parse(DASH110P_object);
	
	$('#DASH110P_ctgrNm').text(DASH110P_jsonDecode.ctgrNm)
	$('#DASH110P_blthgMgntNo').text(DASH110P_langMap.get("DASH110P.ctntNo")+' - '+DASH110P_jsonDecode.blthgMgntNo)
	$('#DASH110P_title').text(DASH110P_jsonDecode.blthgTite)
	if(!Utils.isNull(DASH110P_jsonDecode.blthgRpsImgIdxNm)){
		$('#DASH110P_imgView').css("display",'block');
		$('#DASH110P_imgView')[0].src = GLOBAL.contextPath + "/cmmtphotoimg/"+ DASH110P_jsonDecode.tenantId+"/"+ DASH110P_jsonDecode.blthgRpsImgIdxNm
		$('#DASH110P_boardHead').css("padding-top","10px");
		$('#DASH110P_boardHead').css("padding-bottom","20px");
	}
	$('#DASH110P_goodNcnt').text(Utils.isNull(DASH110P_jsonDecode.goodNcnt) ? '0' : DASH110P_jsonDecode.goodNcnt)
	$('#DASH110P_dnwNcnt').text(Utils.isNull(DASH110P_jsonDecode.dnwNcnt) ? '0' : DASH110P_jsonDecode.dnwNcnt)
	$('#DASH110P_rcmdNcnt').text(Utils.isNull(DASH110P_jsonDecode.rcmdNcnt) ? '0' : DASH110P_jsonDecode.rcmdNcnt)


	let DASH110P_regDtm = kendo.format("{0:yyyy-MM-dd HH:mm:ss}",new Date(DASH110P_jsonDecode.regDtm));
	let regInfo = '<li>'+DASH110P_jsonDecode.usrNm +"("+DASH110P_jsonDecode.regrId+")</li>" 
					+'<li>'+DASH110P_regDtm +"</li>"
	$('#DASH110P_regInfo').append(regInfo)
  
    //첨부파일 setting
	for (let i of DASH110P_jsonDecode.cmmt300FileList) {
		let DASH110P_addFile = '<li><mark class="icoComp_download"></mark><a onclick="DASH110P_fnDownloadFile(this)"  data-name="'+i.apndFileNm+'" data-index="'+i.apndFileIdxNm+'" >'+i.apndFileNm+'</a></li>';
		$("#DASH110P_fileList").append($(DASH110P_addFile));
	}
	
	$('#DASH110P_fileCnt')[0].innerHTML ='('+DASH110P_jsonDecode.cmmt300FileList.length+')';
	
	//목차 설정
    let cntns = DASH110P_jsonDecode.cmmt230VOList;
	//DASH110P_fnIndeCreate(cntns, 'detail');

	for (let i = 0; i < cntns.length; i++) {
		// let title = Utils.htmlDecode(cntns[i].moktiTite);
		// 	if(Utils.isNull(title)){
		// 		$('#DASH110P_indexCategory').css("display",'none');
		// 		}
		//
		// 	$('#DASH110P_content').append("<hr>");
		// 	$('#DASH110P_content').append(title);
		// 	$('#DASH110P_content').append("<hr>");

		let bltnCtt =  Utils.htmlDecode(cntns[i].bltnCtt);

		$('#DASH110P_content').append(bltnCtt);
	}
}
//게시물 좋아요/싫어요 변경
function DASH110P_fnContNcnt(obj){
	
	let updateNcnt = {  tenantId			: DASH110P_userInfo.tenantId,
					  	ctgrMgntNo			: DASH110P_ctgrMgntNo,
					  	blthgMgntNo 		: DASH110P_blthgMgntNo,
					  	asesCd				: $(obj)[0].id == 'DASH110P_goodNcnt' ? '1' :'2',
					  	puslmnId 			: DASH110P_userInfo.usrId, 
						puslmnOrgCd 		: DASH110P_userInfo.orgCd, 
					  }

	DASH110P_selNcnt = obj
	
	Utils.ajaxCall('/cmmt/CMMT230UPT02',  JSON.stringify(updateNcnt), DASH110P_fnContUptCallback) 
}

//게시물 좋아요/싫어요 콜백
function DASH110P_fnContUptCallback(data){
	let DASH110P_jsonEncode1 = JSON.stringify(data.CMMT230VOInfo1);
	let DASH110P_jsonEncode2 = JSON.stringify(data.CMMT230VOInfo2);
	
	if($(DASH110P_selNcnt)[0].id == "DASH110P_goodNcnt"){
		$(DASH110P_selNcnt).text(DASH110P_jsonEncode1);
		$('#DASH110P_dnwNcnt').text(DASH110P_jsonEncode2);
	}else{
		$(DASH110P_selNcnt).text(DASH110P_jsonEncode1);
		$('#DASH110P_goodNcnt').text(DASH110P_jsonEncode2);
	}
}

//게시물 추천
function DASH110P_fnRcmdNcnt(){

	let updateNcnt = {  tenantId			: DASH110P_userInfo.tenantId,
		ctgrMgntNo			: DASH110P_ctgrMgntNo,
		blthgMgntNo 		: DASH110P_blthgMgntNo,
		puslmnId 			: DASH110P_userInfo.usrId,
		puslmnOrgCd 		: DASH110P_userInfo.orgCd,
	}

	Utils.ajaxCall('/cmmt/CMMT230UPT05',  JSON.stringify(updateNcnt), DASH110P_fnRcmdUptCallback)
}

//게시물 좋아요/싫어요 콜백
function DASH110P_fnRcmdUptCallback(data){
	let  rtn = JSON.stringify(data.CMMT230VOInfo);
	$('#DASH110P_rcmdNcnt').text(rtn);
	// let  rtn = JSON.stringify(data.CMMT230VOInfo);
	// let rcmdNcnt
	// if(rtn == 0){
	// 	rcmdNcnt = $('#DASH110P_rcmdNcnt').text()
	// }else {
	// 	rcmdNcnt = rtn;
	// }
	// $('#DASH110P_rcmdNcnt').text(rcmdNcnt);
}


//============================================= 게시글 상세조회 function end ===============================================
//============================================= 댓글 function start ====================================================

//댓글 조회 setting
function DASH110P_fnComtCallBack(data){
	
	let DASH110P_jsonEncode = JSON.stringify(data.CMMT230VOInfo);
	let DASH110P_object=JSON.parse(DASH110P_jsonEncode);
	let DASH110P_jsonDecode = JSON.parse(DASH110P_object);
	
	let size = 0;
	if(!Utils.isNull(DASH110P_jsonDecode) && !Utils.isNull(DASH110P_jsonDecode[0].blthgReplyNo)){
		DASH110P_jsonDecode.forEach(function(val){
			if(Utils.isNull(val.abolmnId)){
				size++;
			}
		})
		
		$('#DASH110P_comtArea').val("");
		$('#DASH110P_commtCnt').text(size);
		$('#DASH110P_noComt').css("display",'none')
		DASH110P_fnSetCommt(DASH110P_jsonDecode)
	}else{
		$('#DASH110P_comtArea').val("");
		$('#DASH110P_commtCnt').text('0');
	}
}

//댓글 조회 li 추가
function DASH110P_fnSetCommt(DASH110P_jsonDecode){
	let chkEnd = false;
	let reply = "";
	for(let i=0; i<DASH110P_jsonDecode.length; i++){
		if(DASH110P_jsonDecode[i].prsReplyLvl==1){
			if(i>0){
				reply+='</ul></details>';
				$('#DASH110P_commentList').append($(reply));
				reply = "";
			}
			
			if(!Utils.isNull(DASH110P_jsonDecode[i].abolmnId)){
				reply = '<li id="DASH110PComtNo_'+DASH110P_jsonDecode[i].blthgReplyNo+'"> <p class="info"> <span class="user"></span><time></time>';
				
			}else{
				reply = '<li id="DASH110PComtNo_'+DASH110P_jsonDecode[i].blthgReplyNo+'"> <p class="info"> <span class="user">'+DASH110P_jsonDecode[i].usrNm+'('+DASH110P_jsonDecode[i].regrId+')</span><time>'
				+kendo.format("{0:yyyy-MM-dd}",new Date(DASH110P_jsonDecode[i].lstCorcDtM))+'</time>';
				
				//<!-- [내가 쓴 글] 일때만 보이는 btn -->
				if(DASH110P_jsonDecode[i].regrId == DASH110P_userInfo.usrId){
					reply+='<button class="k-icon k-i-edit" title="수정"  onclick="DASH110P_fnCommtCng(this, 1 , null)"></button> <button class="k-icon k-i-delete" title="삭제"  onclick="DASH110P_fnCommtDel(this, 1, null)"></button>'
				}
			}
			
			reply += '</p> <div class="reply">'+DASH110P_jsonDecode[i].replyCtt+'</div>';
		
			if(Utils.isNull(DASH110P_jsonDecode[i].abolmnId)){
				//<!--   [종아요, 나빠요 ]  평가  -->
				reply+='<p class="ratingBorad"><button class="like" title="'+DASH110P_langMap.get("DASH110P.good")+'" id="DASH11OPG_'+DASH110P_jsonDecode[i].blthgReplyNo+'" onclick="DASH110P_fnCommtNcnt('+"'goodNcnt'"+', this)"><mark class="icoComp_like"></mark>'+DASH110P_jsonDecode[i].goodNcnt+'</button>'
				+'<button class="bad" title="'+DASH110P_langMap.get("DASH110P.dnw")+'" id="DASH11OPD_'+DASH110P_jsonDecode[i].blthgReplyNo+'"  onclick="DASH110P_fnCommtNcnt('+"'dnwNcnt'"+', this)"><mark class="icoComp_bad"></mark>'+DASH110P_jsonDecode[i].dnwNcnt+'</button></p>';
		
			}
			reply+='<details class="replyContent">'
				
			let hgrk = DASH110P_jsonDecode.findIndex(x => x.blthgReplyHgrkNo == DASH110P_jsonDecode[i].blthgReplyNo);
			if(hgrk==-1){
				//<!-- [답글] 없을때-->
				if(Utils.isNull(DASH110P_jsonDecode[i].abolmnId)){
					reply+=' <summary>'+DASH110P_langMap.get("DASH110P.setComm")+'</summary> '
					//<!-- 대댓글 쓰기 -->	
					reply+='<ul class="replyAnswer"><li class="commentEdit"><i class="icoComp_return"></i>'
					+'<textarea class="textareaEditor thinScrollbar" placeholder="'+DASH110P_langMap.get("DASH110P.plzComm")+'" style="width: 100%; height: 80px;"></textarea>'
					+'<button class="btnRefer_third" onclick="DASH110P_fnCommtIns(this, null, 2,'+DASH110P_jsonDecode[i].blthgReplyNo+')">'+DASH110P_langMap.get("DASH110P.create")+'</button> </li>';
				}
				 
				chkEnd = true;
			}else{
				//<!-- [답글] 있을때-->
				reply+='<summary>'+DASH110P_langMap.get("DASH110P.setComm")+'<em>'+DASH110P_jsonDecode[i].lvl2Cnt+'</em></summary>'
				
				//<!-- 대댓글 쓰기 -->	
				reply+='<ul class="replyAnswer">';
				if(Utils.isNull(DASH110P_jsonDecode[i].abolmnId)){
					reply +='<li class="commentEdit"><i class="icoComp_return"></i><textarea class="textareaEditor thinScrollbar" placeholder="'+DASH110P_langMap.get("DASH110P.plzComm")+'" style="width: 100%; height: 90px;"></textarea>'
						+'<button class="btnRefer_third" onclick="DASH110P_fnCommtIns(this, null, 2,'+DASH110P_jsonDecode[i].blthgReplyNo+')">'+DASH110P_langMap.get("DASH110P.create")+'</button></li>' ;
				}
				chkEnd = false;
			}
		}else{                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
			//	<!-- 대댓글 목록 -->
			reply+='<li id="DASH110PComtNo_'+DASH110P_jsonDecode[i].blthgReplyNo+'"><i class="icoComp_return" ></i><p class="info"> <span class="user">'+DASH110P_jsonDecode[i].usrNm+'('
					+DASH110P_jsonDecode[i].regrId+')</span><time>'+kendo.format("{0:yyyy-MM-dd}",new Date(DASH110P_jsonDecode[i].lstCorcDtM))+'</time>'	
				
			//<!-- [내가 쓴 글] 일때만 보이는 btn -->	
			if(DASH110P_jsonDecode[i].regrId == DASH110P_userInfo.usrId){
				reply += '<button class="k-icon k-i-edit" title="수정" onclick="DASH110P_fnCommtCng(this, 2,'+DASH110P_jsonDecode[i].blthgReplyHgrkNo+')"></button><button class="k-icon k-i-delete" title="삭제" onclick="DASH110P_fnCommtDel(this, 2,'+DASH110P_jsonDecode[i].blthgReplyHgrkNo+')"></button>'	
			}
			
			//댓글내용
			reply += '</p> <div class="reply">'+DASH110P_jsonDecode[i].replyCtt+'</div>';
	
			//<!--   [종아요, 나빠요 ]  평가  -->
			reply+='<p class="ratingBorad"><button class="like" title="'+DASH110P_langMap.get("DASH110P.good")+'" id="DASH11OPG_'+DASH110P_jsonDecode[i].blthgReplyNo+'" onclick="DASH110P_fnCommtNcnt('+"'goodNcnt'"+', this)"><mark class="icoComp_like"></mark>'+DASH110P_jsonDecode[i].goodNcnt+'</button>'
			+'<button class="bad" title="'+DASH110P_langMap.get("DASH110P.dnw")+'" id="DASH11OPD_'+DASH110P_jsonDecode[i].blthgReplyNo+'" onclick="DASH110P_fnCommtNcnt('+"'dnwNcnt'"+', this)"><mark class="icoComp_bad"></mark>'+DASH110P_jsonDecode[i].dnwNcnt+'</button></p> </li>';
		}
	}
	
	$('#DASH110P_commentList').append($(reply));
}

//댓글 삭제
function DASH110P_fnCommtDel(obj, lvl, hgrk){
	Utils.confirm(DASH110P_langMap.get("DASH110P.delete"),function () {
	
		let blthgReplyNo = $(obj).closest('li')[0].id.split('DASH110PComtNo_')[1];
		let updateNcnt = {  tenantId			: DASH110P_userInfo.tenantId,
		  	ctgrMgntNo			: DASH110P_ctgrMgntNo,
		  	blthgMgntNo 		: DASH110P_blthgMgntNo,
		  	blthgReplyNo		: blthgReplyNo,
		  	prsReplyLvl			: lvl,
		  	blthgReplyHgrkNo	: Utils.isNull(hgrk)==true ? blthgReplyNo : hgrk,
		  	abolmnId 			: DASH110P_userInfo.usrId,
		  	abolmnOrgCd			: DASH110P_userInfo.orgCd
		  }
		Utils.ajaxCall('/cmmt/CMMT230DEL01',  JSON.stringify(updateNcnt), DASH110P_fnCommtDelCallback) 
	});
}

// 댓글 삭제 콜백
function DASH110P_fnCommtDelCallback(){
	
	$('#DASH110P_commentList').children().remove();
	$('#DASH110P_commentList').append($('<li class="noMsg" id="DASH110P_noComt"><mark class="icoUtil_msn"></mark>'+DASH110P_langMap.get("DASH110P.firstComm")+' </li>'));
	
	let DASH110P_data = { tenantId			: DASH110P_userInfo.tenantId,
			  ctgrMgntNo		: DASH110P_ctgrMgntNo,
			  blthgMgntNo 		: DASH110P_blthgMgntNo
	};	
	
	let DASH110P_jsonStr = JSON.stringify(DASH110P_data);
		
	Utils.ajaxCall('/cmmt/CMMT230SEL02', DASH110P_jsonStr, DASH110P_fnComtCallBack);
}

// 댓글 수정
function DASH110P_fnCommtCng(obj, lvl, hgrk){

	let blthgReplyNo = $(obj).closest('li')[0].id.split('DASH110PComtNo_')[1];
	let referenceNode = $(obj).parent().next();
	
	let editText = '<li class="commentEdit">'
		+'<textarea class="textareaEditor thinScrollbar" id="text3333" placeholder="'+DASH110P_langMap.get("DASH110P.plzComm")+'" style="width: 100%; height: 90px;"'
		+'">'+referenceNode.text()+'</textarea>'
		+'<button class="btnRefer_third" onclick="DASH110P_fnCommtIns(this,'+blthgReplyNo+','+lvl+','+hgrk+',)">'+DASH110P_langMap.get("DASH110P.create")+'</button> </li>';
	
	referenceNode.after(editText)	
	$(obj).attr('disabled', true);
}

// 댓글 수정 콜백
function DASH110P_fnCommtIns(obj, blthgReplyNo, lvl, hgrk){
	Utils.confirm(DASH110P_langMap.get("DASH110P.save"),function () {
		let textArea;
		if($(obj).closest('li').length>0){
			if(!Utils.isNull(blthgReplyNo)){
				textArea = $(obj).closest('li')[0].childNodes[0];
			}else{
				textArea = $(obj).closest('li')[0].childNodes[1];
			}
		}else{
			textArea = $(obj).closest('dd')[0].childNodes[1];
		}
		
		if(Utils.isNull($(textArea).val())){
			Utils.alert(DASH110P_langMap.get("DASH110P.plzComm"))
			return;
		}
		
		if(Utils.isNull(blthgReplyNo)){
			//신규등록
			let insertText = {  tenantId			: DASH110P_userInfo.tenantId,
							  	ctgrMgntNo			: DASH110P_ctgrMgntNo,
							  	blthgMgntNo 		: DASH110P_blthgMgntNo,
							  	replyCtt			: $(textArea).val(),
							  	prsReplyLvl			: lvl,
							  	blthgReplyHgrkNo	: hgrk,
							  	regrId 				: DASH110P_userInfo.usrId,  
								regrOrgCd 			: DASH110P_userInfo.orgCd,
								lstCorprOrgCd 		: DASH110P_userInfo.orgCd,  
								lstCorprId 			: DASH110P_userInfo.usrId
							  }
			
			Utils.ajaxCall('/cmmt/CMMT230INS02',  JSON.stringify(insertText), DASH110P_fnCommtDelCallback) 
		}else{
			let updateText = {  tenantId			: DASH110P_userInfo.tenantId,
							  	ctgrMgntNo			: DASH110P_ctgrMgntNo,
							  	blthgMgntNo 		: DASH110P_blthgMgntNo,
							  	blthgReplyNo		: blthgReplyNo,
							  	replyCtt			: $(textArea).val()
							  }

			Utils.ajaxCall('/cmmt/CMMT230UPT04',  JSON.stringify(updateText), DASH110P_fnCommtDelCallback) 
		}
	});
}

//댓글 좋아요/싫어요 변경
function DASH110P_fnCommtNcnt(ncnt, obj){
	DASH110P_selCommt = obj;
	
	let updateNcnt = {  tenantId			: DASH110P_userInfo.tenantId,
					  	ctgrMgntNo			: DASH110P_ctgrMgntNo,
					  	blthgMgntNo 		: DASH110P_blthgMgntNo,
					  	blthgReplyNo		:  ncnt == 'goodNcnt'? $(obj)[0].id.split('DASH11OPG_')[1] : $(obj)[0].id.split('DASH11OPD_')[1],
					  	blthgReplyAsesmnId 	: DASH110P_userInfo.usrId,
					  	asesmnOrgCd			: DASH110P_userInfo.orgCd,
					  	asesCd				: ncnt == 'goodNcnt'? '1' :'2'
					  }
	
	Utils.ajaxCall('/cmmt/CMMT230INS03',  JSON.stringify(updateNcnt), DASH110P_fnCommtUptCallback) 
}
//댓글 좋아요/싫어요 콜백
function DASH110P_fnCommtUptCallback(data){
	let DASH110P_jsonEncode1 = JSON.stringify(data.CMMT230VOInfo1);
	let DASH110P_jsonEncode2 = JSON.stringify(data.CMMT230VOInfo2);
	
	if($(DASH110P_selCommt)[0].nextSibling == null){
		$(DASH110P_selCommt)[0].childNodes[1].data =DASH110P_jsonEncode1
		$(DASH110P_selCommt)[0].previousSibling.childNodes[1].data = DASH110P_jsonEncode2
	}else{
		$(DASH110P_selCommt)[0].childNodes[1].data =DASH110P_jsonEncode1
		$(DASH110P_selCommt)[0].nextSibling.childNodes[1].data = DASH110P_jsonEncode2
	}
}

//============================================ 댓글 function end ====================================================

DASH110P_fnOnMouse = (obj) => {
	let option;

	if($(obj).prop('class') === 'like') {
		option = "drop-shadow(2px 4px 6px red)";
	}else{
		option = "drop-shadow(2px 4px 6px blue)";
	}

	$(obj).css("filter" , option);
}

DASH110P_fnOutMouse = (obj) => {
	$(obj).css("filter" , "");
}