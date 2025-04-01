var KMST230P_itemList;

$(document).ready(function() {
	//카테고리 설정
	let li = document.createElement('li');
	li.textContent =  $(opener.document).find('#KMST210P input[name=KMST210P_CategoryPath]')[0].value;
	$('#KMST230P ul[name=KMST230P_CatagoryRoot]').append(li);

	//문서번호 설정
	if(Utils.getUrlParam("isEdit") === "KMST200M_fnUpdateDoc"){
		let li2 = document.createElement('li');
		li2.textContent = $(opener.document).find('#KMST210P input[name=KMST210P_CntnsNum]')[0].value;
		$('#KMST230P ul[name=KMST230P_CatagoryRoot]').append(li2);
	}
	//제목설정
	let title = $(opener.document).find('#KMST210P input[name=KMST210P_Title]')[0].value;
	$('#KMST230P p[name=KMST230P_Title]').text(title);
	$('#KMST230P_title').text(title);

	//등록자아이디 설정
	let regrId = $(opener.document).find('#KMST210P input[name=KMST210P_regId]')[0].value;
	$('#KMST230P li[name=KMST230P_RegrID]').text(regrId);

	//현재시간 설정
	$('#KMST230P li[name=KMST230P_Now]').text(kendo.format("{0:yyyy-MM-dd HH:mm:ss}",new Date()));

	//첨부파일 설정
	let filelist = $(opener.document)[0].defaultView.KMST210P_FileList;
	if(filelist.length>0){
		let file =
			'<details class="boardAttach">' +
			'<summary><mark class="k-icon k-i-clip-45"></mark><em>('+filelist.length+')</em></summary>'+
			'<ul>'
		for(let i=0;i<filelist.length;i++){
			file +='<li><mark class="icoComp_download"></mark><a onclick="KMST230P_fnDownloadFile(this)">'+
				filelist[i].name+'</a></li>'
		}
		file +='</ul></details>';
		$('#KMST230P div[name=KMST230P_Head]').append(file);
	}

	//본문 내용 가져오기
	let cntns = $(opener.document)[0].defaultView.KMST210P_IndexList;
	

	KMST230P_itemList = cntns;

//	//목차 설정
//	$('#KMST230P ol[name=KMST230P_IndexList]').append(KMST_CreateKMSIndexList(cntns));
	
	//list 버튼 넣기
	let indexNum = 0;
	
	for(var i=0; i<cntns.length; i++){

		if(cntns[i].moktiPrsLvl == 1){
			
			if(cntns[i].moktiTite.includes('&lt')){
				let strMokTitle = cntns[i].moktiTite;
				
				let arrMokTitle1 = strMokTitle.split('&lt;');
				strMokTitle = arrMokTitle1[1];

				let arrMokTitle2 = strMokTitle.split('&gt;');
				cntns[i].moktiTite = arrMokTitle2[1];
			}

			let cssIndexBtn = "";
			let disalbedYn = "disabled";
			if(indexNum != 0){
				cssIndexBtn = "margin-left:15px";
				disalbedYn = "";
			}

			let htmlIndexBtn = "";
			
			let mokTitle;
			if(Utils.isNull(cntns[i].moktiTite)){
				mokTitle = '&nbsp;';
			} else {
				mokTitle = cntns[i].moktiTite;
			}
			
			htmlIndexBtn += '<button id="KMST230P_btnIndexListBtn_' + indexNum + '" class="btnRefer_second" style="' + cssIndexBtn + '" ' + disalbedYn + ' onclick="KMST230P_fnCntntsSet(' + indexNum + ')">';
				htmlIndexBtn += '<span style="font-size: 17px; ">' + mokTitle + '</span>';
			htmlIndexBtn += '</button>';
			
			
			$('#KMST230P_divIndexList').append(htmlIndexBtn);
			indexNum++;
		}
		
	}
	
	KMST230P_fnCntntsSet(0);

	//본문 내용설정

//	for (let i = 0; i < cntns.length; i++) {
//
//		let title = cntns[i].moktiTite;
//
//		$('#KMST230P div[name=KMST230P_Cntnts]').append("<hr>");
//		$('#KMST230P div[name=KMST230P_Cntnts]').append(title);
//		$('#KMST230P div[name=KMST230P_Cntnts]').append("<hr>");
//
//		let cntntsCtt = cntns[i].cntntsCtt;
//		console.log(cntntsCtt);
//		$('#KMST230P div[name=KMST230P_Cntnts]').append(cntntsCtt);
//	}
});

function KMST230P_fnCntntsSet(nId){
	let selItemNum = nId + 1;
	
	$('#KMST230P div[name=KMST230P_CntntsText]').empty();
	let cntntsNum = 0;
	for (let i of KMST230P_itemList) {
		
		let search = Utils.isNull(Utils.getUrlParam("text"))? null:Utils.getUrlParam("text");
		
		let title;
		let titleMargin;
		let titleHType;
		
		if(i.moktiTite.includes('&lt')){
			let strMokTitle = i.moktiTite;
			
			let arrMokTitle1 = strMokTitle.split('&lt;');
			strMokTitle = arrMokTitle1[1];

			let arrMokTitle2 = strMokTitle.split('&gt;');
			i.moktiTite = arrMokTitle2[1];
		}
		
		if(i.moktiPrsLvl == "1"){
			
			$('#KMST230P_btnIndexListBtn_' + cntntsNum).prop('disabled', false);
			
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
			$('#KMST230P_btnIndexListBtn_' + (cntntsNum-1)).prop('disabled', true);
			
			title = '<' + titleHType + ' style="margin-left:' + titleMargin + '">' + i.moktiTite + '</h1>';
			 
			let divCntntsCtt = '<div id="KMST230P_divCntntsCtt_' + i.moktiNo + '" style="margin-left:' + titleMargin + '; margin-top:20px; margin-bottom:50px;"></div>';
			
//			let title = Utils.htmlDecode(i.moktiTite);

			$('#KMST230P div[name=KMST230P_CntntsText]').append(title);
			$('#KMST230P div[name=KMST230P_CntntsText]').append(divCntntsCtt);
			
			$('#KMST230P_divCntntsCtt_' + i.moktiNo).append(i.cntntsCtt);
	//
//			let cntntsCtt = Utils.htmlDecode(i.cntntsCtt);
			
//			$('#KMST230P_divCntntsCtt_' + i.moktiNo).append(Utils.convertTextHighlight(cntntsCtt,search));

//			if(Utils.isNotNull(i.kmst213vo)){
//				for(let j of i.kmst213vo){
//					let src ="/bcs/kmstphotocnts/";
//					let img ='<img src="'+src+j.tenantId+'/'+j.cntntsImgIdxNm+'">';
//					$('#KMST340P div[name=KMST340P_CntntsT]').append(img);
//				}
//
//			}
		}
		
		

	}
}

function KMST230P_fnDownloadFile(obj) {
	let data =$(opener.document)[0].defaultView.KMST210P_FileList.find(x => x.name === obj.childNodes[0].data);
	// let blob = new Blob([data]);
	let path = window.URL.createObjectURL(data)
	let link = document.createElement('a')
	link.href = path;
	link.download = data.name;
	link.click();
	link.remove();
}