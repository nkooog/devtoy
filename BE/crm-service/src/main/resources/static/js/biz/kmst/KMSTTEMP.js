var exceldata;
var filelist = [];

// function readExcel() {
// 	let input = event.target;
// 	let reader = new FileReader();
// 	reader.onload = function () {
// 		let data = reader.result;
// 		let workBook = XLSX.read(data, { type: 'binary' });
// 		workBook.SheetNames.forEach(function (sheetName) {
// 			console.log('SheetName: ' + sheetName);
// 			exceldata = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
// 			//console.log(rows);
// 		})
// 	};
// 	reader.readAsBinaryString(input.files[0]);
// }
//
// function fileListCreate(obj){
// 	for (i = 0; i < obj.files.length; i++) {
// 		filelist.push(obj.files[i]);
// 	}
// }
//
// function SetFormData(){
// 	$(exceldata).each(function(i,item){
// 		console.log(i+"시작");
// 		let KMST210VO =new FormData();
// 		//컨텐츠
// 		KMST210VO.append('tenantId', "CMA");
// 		KMST210VO.append('ctgrNo', item.ctgrNo);
//
// 		KMST210VO.append('cntntsNo',item.cntntsNo);
// 		KMST210VO.append('cntntsTite', item.cntntsTite);
// 		KMST210VO.append('cntntsTypCd', "104");
// 		KMST210VO.append('kldTop10DispYn', "N") ;
// 		KMST210VO.append('kldStCd',"12" );
// 		KMST210VO.append('cntntsValdTrmStrDd', "20220901");
// 		KMST210VO.append('cntntsValdTrmEndDd', "20230901");
// 		KMST210VO.append('permValdYn', "N");
// 		KMST210VO.append('cntntsRegApvNcsyYn', "N");
// 		KMST210VO.append('regrId', "CMAB01");
// 		KMST210VO.append('regrNm', "정대정");
// 		KMST210VO.append('regrOrgCd',"5");
//
// 		if(item.img1 != " "){
// 			let file = filelist.filter(x => x.name == item.img1);
// 			KMST210VO.append('file', file[0]);
// 		}
//
// 		//컨텐츠 목차 & 내용
// 		KMST210VO.append('kmst211VoList[0].moktiNo', item.moktiNo);
// 		KMST210VO.append('kmst211VoList[0].moktiTite', item.moktiTite);
// 		KMST210VO.append('kmst211VoList[0].hgrkMoktiNo', "0");
// 		KMST210VO.append('kmst211VoList[0].moktiPrsLvl', "1");
// 		KMST210VO.append('kmst211VoList[0].cntntsCtt', item.cntntsCtt);
// 		KMST210VO.append('kmst211VoList[0].cntntsCttTxt', item.cntntsCttTxt);
//
// 		KMST210VO.append('kmst211VoList[1].moktiNo', item.moktiNo_1);
// 		KMST210VO.append('kmst211VoList[1].moktiTite', item.moktiTite_1);
// 		KMST210VO.append('kmst211VoList[1].hgrkMoktiNo', "0");
// 		KMST210VO.append('kmst211VoList[1].moktiPrsLvl', "1");
// 		KMST210VO.append('kmst211VoList[1].cntntsCtt', item.cntntsCtt_1);
// 		KMST210VO.append('kmst211VoList[1].cntntsCttTxt', item.cntntsCttTxt_1);
//
// 		KMST210VO.append('kmst211VoList[2].moktiNo', item.moktiNo_2);
// 		KMST210VO.append('kmst211VoList[2].moktiTite', item.moktiTite_2);
// 		KMST210VO.append('kmst211VoList[2].hgrkMoktiNo', "0");
// 		KMST210VO.append('kmst211VoList[2].moktiPrsLvl', "1");
// 		KMST210VO.append('kmst211VoList[2].cntntsCtt', item.cntntsCtt_2);
// 		KMST210VO.append('kmst211VoList[2].cntntsCttTxt', item.cntntsCttTxt_2);
//
// 		KMST210VO.append('kmst211VoList[3].moktiNo', item.moktiNo_3);
// 		KMST210VO.append('kmst211VoList[3].moktiTite', item.moktiTite_3);
// 		KMST210VO.append('kmst211VoList[3].hgrkMoktiNo', "0");
// 		KMST210VO.append('kmst211VoList[3].moktiPrsLvl', "1");
// 		KMST210VO.append('kmst211VoList[3].cntntsCtt', item.cntntsCtt_3);
// 		KMST210VO.append('kmst211VoList[3].cntntsCttTxt', item.cntntsCttTxt_3);
//
// 		$.ajax({
// 			url: GLOBAL.contextPath + '/kmst/KMST210INS01',
// 			type: "post",
// 			dataType: "json",
// 			enctype     : 'multipart/form-data',  //필수
// 			cache       : false,                  //필수
// 			contentType : false,                  //필수
// 			processData : false,                  //필수
// 			timeout     : 18000,                   //필수
// 			async : false ,
// 			data: KMST210VO,
// 			success: function (result) {
// 				sleep(500);
// 				console.log(i+"번 완료");
// 			}
// 		});
// 		sleep(500);
// 		console.log(i+"번 종료");
// 	})
//
// }
//
// function sleep(ms) {
// 	const wakeUpTime = Date.now() + ms;
// 	while (Date.now() < wakeUpTime) {}
// }

function Test01(obj){
	if($('#KMSTTEMP_PW').val()=="kmsttemp"){
		return;
	}
	let param = {count :  obj, pw:$('#KMSTTEMP_PW').val()}
	Utils.ajaxCall("/elk/sample/TEST01", JSON.stringify(param),function (data){
		console.log(data.result);
		$('#KMSTTEMP_TEXT').val(data.result);
	},null,function (){},null);
}

function Test02(obj){
	if($('#KMSTTEMP_PW').val()=="kmsttemp"){
		return;
	}
	let param = {count :  obj,tenantId:$('#KMSTTEMP_INPUT').val(), pw:$('#KMSTTEMP_PW').val()}
	Utils.ajaxCall("/elk/sample/TEST02", JSON.stringify(param),function (data){
		$('#KMSTTEMP_TEXT').val("kmst:"+data.result_kmst+"\n cmmt:"+data.result_cmmt);
	},null,function (){},null);
}