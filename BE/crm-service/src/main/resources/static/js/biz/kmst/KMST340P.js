var KMST340P_FileList=[];

var KMST340P_itemList;
$(document).ready(function() {

	//1. 조회
	let param = {
		tenantId :GLOBAL.session.user.tenantId,
		ctgrNo: Utils.getUrlParam("ctgrNo"),
		cntntsNo: Utils.getUrlParam("cntntsNo")
	}
	//조회
	Utils.ajaxCall("/kmst/KMST210SEL02", JSON.stringify(param),function (data){
		let item = JSON.parse(JSON.parse(JSON.stringify(data.info)));
		KMST340P_itemList = item;



		//카테고리 설정
		let li = document.createElement('li');
		li.textContent = item.ctgrNm;
		$('#KMST340P ul[name=KMST340P_CatagoryRoot]').append(li);

		//문서번호 설정
		let li2 = document.createElement('li');
		li2.textContent = param.ctgrNo+"-"+param.cntntsNo;
		$('#KMST340P ul[name=KMST340P_CatagoryRoot]').append(li2);

		//즐겨 찾기 설정
		let faver ='<span class="favorite"><input type="checkbox" id="KMST340_faver" onclick="KMST340P_fnDelBook(this)" /><label class="k-icon k-i-star" title="즐겨찾기"></label></span>';
		$('#KMST340P p[name=KMST340P_Title]').append(faver);

		let fav = {
			tenantId : GLOBAL.session.user.tenantId,
			usrId :  GLOBAL.session.user.usrId,
			ctgrNo : Utils.getUrlParam("ctgrNo"),
			cntntsNo: Utils.getUrlParam("cntntsNo")
		}

		Utils.ajaxSyncCall("/kmst/KMST340SEL01", JSON.stringify(fav),function (data){
			let item = JSON.parse(JSON.parse(JSON.stringify(data.isfavor)));
			$('#KMST340_faver').prop('checked', item)
		});

		//제목 설정

		let cntntsSTitle = '<span style="margin-left:10px;">' + item.cntntsTite + '</span>'
		$('#KMST340P p[name=KMST340P_Title]').append(cntntsSTitle);
		$('#KMST340P_title').text(item.cntntsTite);
		
		

		//등록자아이디 설정
		$('#KMST340P li[name=KMST340P_RegrID]').text(item.regrNm+"("+item.regrId+")"); //이름 추가필요

		//등록 날자 설정
		$('#KMST340P li[name=KMST340P_Now]').text(kendo.format("{0:yyyy-MM-dd HH:mm:ss}",new Date(item.regDtm)));

		//목차 설정
//		$('#KMST340P ol[name=KMST340P_IndexList]').append(KMST_CreateKMSIndexList(item.kmst211VoList));

		//타이틀 이미지 설정
		if(item.cntntsRpsImgIdxNm!=null){
			let src ="/bcs/kmstphotoimg/";
			let img ='<img src="'+src+item.tenantId+'/'+item.cntntsRpsImgIdxNm+'" style="height:150px">';
			$('#KMST340P_divTitleImg').append(img);
		}else{
//			let list = "<h4>목차 <small>Table <br> of <br>Contents</small></h4>";
			let list = "";
			
			list += '<div style="width:100%; height:100%;">';
				list = '<span style="font-size: 25px; font-weight: bold; color:#aaa;">No Image</span>';
			list += '</div>';
//			
			$('#KMST340P_divTitleImg').append(list);
		}
		
//		
		
		//list 버튼 넣기
		let indexNum = 0;
		for(var i=0; i<item.kmst211VoList.length; i++){
			
			if(item.kmst211VoList[i].moktiTite.includes('&lt')){
				let strMokTitle = item.kmst211VoList[i].moktiTite;
				
				let arrMokTitle1 = strMokTitle.split('&lt;');
				strMokTitle = arrMokTitle1[1];

				let arrMokTitle2 = strMokTitle.split('&gt;');
				item.kmst211VoList[i].moktiTite = arrMokTitle2[1];
			}
			
			if(item.kmst211VoList[i].moktiPrsLvl == "1"){
				let cssIndexBtn = "";
				let disalbedYn = "disabled";
				if(indexNum != 0){
					cssIndexBtn = "margin-left:15px";
					disalbedYn = "";
				}
				
				let htmlIndexBtn = "" 
				htmlIndexBtn += '<button id="KMST340P_btnIndexListBtn_' + indexNum + '" class="btnRefer_second" style="' + cssIndexBtn + '" ' + disalbedYn + ' onclick="KMST340P_fnCntntsSet(' + indexNum + ')">'; 
					htmlIndexBtn += '<span style="font-size: 17px; ">' + item.kmst211VoList[i].moktiTite + '</span>';
				htmlIndexBtn += '</button>';
				$('#KMST340P_divIndexList').append(htmlIndexBtn);
				
				let btnTest = ('KMST340P_btnIndexListBtn_' + indexNum);
				
				
//				console.log(document.body.clientWidth -1000, $('#KMST340P_divIndexList').width());
//				if( document.body.clientWidth -1000 <= $('#KMST340P_divIndexList').width()){
//					$('#KMST340P_btnIndexLeft').css('display', '');
//					$('#KMST340P_btnIndexRight').css('display', '');
//					$('#KMST340P_divIndexDiv').width(document.body.clientWidth -1000);
//				} else {
//					$('#KMST340P_btnIndexLeft').css('display', 'none');
//					$('#KMST340P_btnIndexRight').css('display', 'none');
//				}
				
				
				
				indexNum++;
			}
			
		}
		
		

		
		KMST340P_fnCntntsSet(0);

	

		if(item.cntntsTypCd =="104"){

		}
		//첨부파일 setting
		for (let i of item.kmst212VoList) {
			let KMST340P_addFile = '<li><mark class="icoComp_download"></mark><a onclick="KMST340P_fnDownloadFile(this)"  data-name="'+i.apndFileNm+'" data-index="'+i.apndFileIdxNm+'" >'+i.apndFileNm+'</a></li>';
			$("#KMST340P_fileList").append($(KMST340P_addFile));
		}

		$('#KMST340P_fileCnt')[0].innerHTML ='('+item.kmst212VoList.length+')';

	},null,null,null);
});

function KMST340P_fnIndexScrollMove(){
	$('#KMST340P_divIndexList').offset({left: -500, behavior: "smooth" })
//	window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
//	$('#KMST340P_divIndexDiv').scrollRight(hh);   // 상단으로 이동 (세로 스크롤)
}

function KMST340P_fnCntntsSet(nId){
	//본문 내용설정
	

	let selItemNum = nId + 1;
	
	$('#KMST340P div[name=KMST340P_CntntsText]').empty();
	let cntntsNum = 0;
	for (let i of KMST340P_itemList.kmst211VoList) {
		let search = Utils.isNull(Utils.getUrlParam("text"))? null:Utils.getUrlParam("text");

		
		
		let title;
		let titleMargin;
		let titleHType;
		
		if(i.moktiPrsLvl == "1"){
			
			$('#KMST340P_btnIndexListBtn_' + cntntsNum).prop('disabled', false);
			
			cntntsNum++; 
			titleHType = "h1";
			titleMargin = "0px";
		} else if(i.moktiPrsLvl == "2"){
			titleHType = "h2";
			titleMargin = "40px";
		} else {
			titleHType = "h3";
			titleMargin = "80px";
		}
		
		
		if(selItemNum == cntntsNum){
			$('#KMST340P_btnIndexListBtn_' + (cntntsNum-1)).prop('disabled', true);
			
			title = '<' + titleHType + ' style="margin-left:' + titleMargin + '">' + i.moktiTite + '</h1>';
			 
			let divCntntsCtt = '<div id="KMST340P_divCntntsCtt_' + i.moktiNo + '" style="margin-left:' + titleMargin + '; margin-top:20px; margin-bottom:50px;"></div>';
			
//			let title = Utils.htmlDecode(i.moktiTite);

			$('#KMST340P div[name=KMST340P_CntntsText]').append(title);
			$('#KMST340P div[name=KMST340P_CntntsText]').append(divCntntsCtt);
			
//			$('#KMST340P div[name=KMST340P_CntntsText]').append(i.cntntsCtt);
	//
			let cntntsCtt = Utils.htmlDecode(i.cntntsCtt);
			$('#KMST340P_divCntntsCtt_' + i.moktiNo).append(Utils.convertTextHighlight(cntntsCtt,search));

			if(Utils.isNotNull(i.kmst213vo)){
				for(let j of i.kmst213vo){
					let src ="/bcs/kmstphotocnts/";
					let img ='<img src="'+src+j.tenantId+'/'+j.cntntsImgIdxNm+'">';
					$('#KMST340P div[name=KMST340P_CntntsT]').append(img);
				}

			}
		}
		
		

	}
}

function KMST340P_fnDownloadFile(e) {
    const apndFilePsn = $(e).data("psn");
    var pathKey =  "KLD";
    var fileName = $(e).data("index");
    var oriFileName  = $(e).data("name");
    var tenant = GLOBAL.session.user.tenantId;
    window.location.href = GLOBAL.contextPath + "/file/download?pathKey="+ pathKey +"&fileName="+ fileName+ "&oriFileName=" + oriFileName +"&tenant=" + tenant;
}

function KMST340P_fnDelBook(obj){

	let param = {
		tenantId : GLOBAL.session.user.tenantId
		,usrId : GLOBAL.session.user.usrId
		,orgCd : GLOBAL.session.user.orgCd
		,regrOrgCd : GLOBAL.session.user.orgCd
		,ctgrNo: Utils.getUrlParam("ctgrNo")
		,cntntsNo: Utils.getUrlParam("cntntsNo")

	};
	let checked = $(obj).prop('checked');

	if(checked){
		Utils.ajaxCall('/frme/FRME220INS01', JSON.stringify(param),function(data){
			if(window.opener !== null){
				window.opener.KMST300M_fnReloadFavorites();
			}
		});
	}else{
		Utils.ajaxCall('/frme/FRME220DEL01', JSON.stringify(param),function(data){
			if(window.opener !== null){
				window.opener.KMST300M_fnReloadFavorites();
			}
		});
	}

}