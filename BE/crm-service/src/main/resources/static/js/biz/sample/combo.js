/***********************************************************************************************
 * Program Name : 공통 콤보 Code 조회 Restful example(combo.js)
 * Creator      : sukim
 * Create Date  : 2022.02.08
 * Description  : 공통 콤보 Code 조회 Restful example
 *                (적용시 참고) 메뉴에서 화면 호출시 바로 공통코드 콤보를 조회해야 한다. 
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.02.08     sukim            최초작성    
 ************************************************************************************************/

$(document).ready(function () {
		//자신의 화면에서 사용하는 대분류 코드를 JSON Array로 만들것.
		//자신의 화면에 콤보박스가 1개만 있을 경우 값을 JSON Array에 한개만 넣어서 전송할 것.
		var data = { "codeList": [
			{"mgntItemCd":"C0002"},
			{"mgntItemCd":"C0003"},
			{"mgntItemCd":"C0023"},
			{"mgntItemCd":"C0043"},
			{"mgntItemCd":"C0044"},
			{"mgntItemCd":"C0066"},
			{"mgntItemCd":"C0075"},
			{"mgntItemCd":"C0076"},
			{"mgntItemCd":"C0084"},


			{"mgntItemCd":"C0007"},
			{"mgntItemCd":"C0008"},
			{"mgntItemCd":"C0010"},
			{"mgntItemCd":"C0113"},
			{"mgntItemCd":"C0011"},
			{"mgntItemCd":"C0015"},
			{"mgntItemCd":"C0016"},
			{"mgntItemCd":"C0114"}

		]};
		console.log("JSON.stringify(data) ::: " + JSON.stringify(data));

	    $.ajax({
	    	url         : '/bcs/comm/COMM100SEL01',
	        type        : 'post',
	        dataType    : 'json',
	        contentType : 'application/json; charset=UTF-8',
	        data        : JSON.stringify(data),
	        success     : resultComboList_SAMPLE,
	        error       : function(request,status, error){
	        	console.log("[error]");
	        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
	        }
	    });
});



$('#btn10').on('click', function CodeListSearch() {
	alert("=== 공통 콤보 Code 조회 시작 ===");

	//자신의 화면에서 사용하는 대분류 코드를 JSON Array로 만들것.
	//자신의 화면에 콤보박스가 1개만 있을 경우 값을 JSON Array에 한개만 넣어서 전송할 것.
	var data = { "codeList": [
		{"mgntItemCd":"C0002"},
		{"mgntItemCd":"C0003"},
		{"mgntItemCd":"C0023"},
		{"mgntItemCd":"C0043"},
		{"mgntItemCd":"C0044"},
		{"mgntItemCd":"C0066"},
		{"mgntItemCd":"C0075"},
		{"mgntItemCd":"C0076"},
		{"mgntItemCd":"C0084"},


		{"mgntItemCd":"C0007"},
		{"mgntItemCd":"C0008"},
		{"mgntItemCd":"C0010"},
		{"mgntItemCd":"C0113"},
		{"mgntItemCd":"C0011"},
		{"mgntItemCd":"C0015"},
		{"mgntItemCd":"C0016"},
		{"mgntItemCd":"C0114"}

	]};
	console.log("JSON.stringify(data) ::: " + JSON.stringify(data));

    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json',
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList_SAMPLE,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
});

//코드목록 조회결과
function resultComboList_SAMPLE(data){
	var jsonEncode = JSON.stringify(data.codeList);
	var object=JSON.parse(jsonEncode);
	var jsonDecode = JSON.parse(object);

	for (let i = 0; i < jsonDecode.length; i++) {
		console.log("====== mgntItemCd : " + jsonDecode[i].mgntItemCd +", comCd:" + jsonDecode[i].comCd +", comCdNm:" + jsonDecode[i].comCdNm + " ==========");

		//도메인 코드
		if(jsonDecode[i].mgntItemCd == "C0002"){
			$('#C0002').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}
		//사용 여부
		if(jsonDecode[i].mgntItemCd == "C0003"){
			$('#C0003').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}
		//테마 유형 코드
		if(jsonDecode[i].mgntItemCd == "C0043"){
			$('#C0043').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}
		//배경 색 코드
		if(jsonDecode[i].mgntItemCd == "C0044"){
			$('#C0044').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}
		//평가 코드
		if(jsonDecode[i].mgntItemCd == "C0066"){
			$('#C0066').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}
		//일정 시작 시
		if(jsonDecode[i].mgntItemCd == "C0075"){
			$('#C0075').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}
		//일정 시작 분
		if(jsonDecode[i].mgntItemCd == "C0076"){
			$('#C0076').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}
		//지식 상태 코드
		if(jsonDecode[i].mgntItemCd == "C0084"){
			$('#C0084').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}

		//국가 코드
		if(jsonDecode[i].mgntItemCd == "C0023"){
			$('#C0023').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}
		// ******************************************* 주 의 사 항 *********************************************************************************************//
		//국가전화코드(국가코드의 참조1 칼럼을 Value로 함. 국가전화번호는 국가별 유일하지 않고 중복이 있으므로 키(Key)로 할수 없으므로 참조칼럼으로 설정함!!!)
		if(jsonDecode[i].mgntItemCd == "C0023"){
			$('#C0023_1').append('<option value="' + jsonDecode[i].mapgVlu1 + '">' + jsonDecode[i].comCdNm +'('+jsonDecode[i].mapgVlu1+')' + '</option>');
		}


		if(jsonDecode[i].mgntItemCd == "C0007"){
			$('#C0007').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}


		if(jsonDecode[i].mgntItemCd == "C0008"){
			$('#C0008').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}

		if(jsonDecode[i].mgntItemCd == "C0010"){
			$('#C0010').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}

		if(jsonDecode[i].mgntItemCd == "C0113"){
			$('#C0113').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}

		if(jsonDecode[i].mgntItemCd == "C0011"){
			$('#C0011').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}



		if(jsonDecode[i].mgntItemCd == "C0015"){
			$('#C0015').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}

		if(jsonDecode[i].mgntItemCd == "C0016"){
			$('#C0016').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}

		if(jsonDecode[i].mgntItemCd == "C0114"){
			$('#C0114').append('<option value="' + jsonDecode[i].comCd + '">' + jsonDecode[i].comCdNm + '</option>');
		}


	}

	var result = JSON.stringify(data.result);
	document.getElementById("result").innerHTML = "";
	document.getElementById("result").innerHTML = result;

	var message = JSON.stringify(data.msg);
	document.getElementById('message').innerHTML="";
	document.getElementById('message').innerHTML=message;
}