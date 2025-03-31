/***********************************************************************************************
 * Program Name : 공통 Kendo UI 콤보박스 예제(combo2.js)
 * Creator      : sukim
 * Create Date  : 2022.03.17
 * Description  : 공통 Kendo UI 콤보박스 예제
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.17     sukim            최초작성       
 ************************************************************************************************/
let data_c0044 = new Array();
let data_c0075 = new Array();
let data_c0076 = new Array();
let data_c0084 = new Array();
let data_c0002 = new Array();

let ddl_C0044;
let ddl_C0075;
let ddl_C0076;
let ddl_C0084;
let ddl_C0002;
let ddl_C0002_1;
let ddl_C0002_2; // multiSelect 안에 checkbox 2021년 버젼의 custom 라이브러리에서 정상작동, 2022년 버젼은 기능 지원안함


$(document).ready(function () {
	//코드조회 및 콤보값 생성
	getCodeList();
	
	//일반 select DDLB, 버튼 이벤트 선언
	$("#btn10").click(function() {
		ddl_C0044 = $("#combobox_C0044").data("kendoDropDownList");
		alert(ddl_C0044.dataSource.data()[ddl_C0044.selectedIndex-1].value + ", " + ddl_C0044.dataSource.data()[ddl_C0044.selectedIndex-1].text);
    });
	$("#btn20").click(function() {
		ddl_C0075 = $("#combobox_C0075").data("kendoDropDownList");
		alert(ddl_C0075.dataSource.data()[ddl_C0075.selectedIndex-1].value + ", " + ddl_C0075.dataSource.data()[ddl_C0075.selectedIndex-1].text);
    });
	$("#btn30").click(function() {
		ddl_C0076 = $("#combobox_C0076").data("kendoDropDownList");
		alert(ddl_C0076.dataSource.data()[ddl_C0076.selectedIndex-1].value + ", " + ddl_C0076.dataSource.data()[ddl_C0076.selectedIndex-1].text);
    });
	$("#btn40").click(function() {
		ddl_C0084 = $("#combobox_C0084").data("kendoDropDownList");
		alert(ddl_C0084.dataSource.data()[ddl_C0084.selectedIndex-1].value + ", " + ddl_C0084.dataSource.data()[ddl_C0084.selectedIndex-1].text);
    });	

    //-----------------------------------------------------------------------------------//
	//multi select DDLB
    //-----------------------------------------------------------------------------------//
	$("#btn50").click(function() {
		ddl_C0002 = $("#combobox_C0002").data("kendoMultiSelect");
		var selectedValues = ddl_C0002.value();
		alert("멀티콤보 선택한 value : " + selectedValues);
    });	
	
	$("#btn60").click(function() {
		ddl_C0002_1 = $("#combobox_C0002_1").data("kendoMultiSelect");
		var selectedValues = ddl_C0002_1.value();
		alert("멀티콤보 선택한 value : " + selectedValues);
    });	
     //-----------------------------------------------------------------------------------//
	
});


//DDLB만 해당됨.
function onSelect(e) {
	if(e.item.text() == "선택"){
		return;
	}else{
		alert("value : " + e.sender.dataSource.data()[e.item.index()].value + ", Index : " + e.item.index() + ", text : " + e.item.text());
	}
}

/*
function onChange(e){
	var selectedValues = ddl_C0002.value();
	ddl_C0002.value([]);
	ddl_C0002.value(selectedValues);
	alert("selectedValues : " + selectedValues);
}
*/

//초기값 세팅..DB조회값 Set
function setCombo(){
	//example1(배경색)
	ddl_C0044 = $("#combobox_C0044").data("kendoDropDownList");
	ddl_C0044.select(function(dataItem) {
	    return dataItem.value === "G"; //보라
	});
	
	//example2(일정시작시)
	ddl_C0075 = $("#combobox_C0075").data("kendoDropDownList");
	ddl_C0075.select(function(dataItem) {
	    return dataItem.value === "10"; //10시
	});
	
	//example3(일정시작분)
	ddl_C0076 = $("#combobox_C0076").data("kendoDropDownList");
	ddl_C0076.select(function(dataItem) {
	    return dataItem.value === "30"; //30분
	});
	
	//example4(지식상태) 
	ddl_C0084 = $("#combobox_C0084").data("kendoDropDownList");
	ddl_C0084.select(function(dataItem) {
	    return dataItem.value === "4"; //반려
	});
	
	//example5(도메인... MultiSelect) 
	ddl_C0002 = $("#combobox_C0002").data("kendoMultiSelect");
	ddl_C0002.value(['100','200']); // db에서 저장된 값이 100, 200 이라면...
	
	ddl_C0002_1 = $("#combobox_C0002_1").data("kendoMultiSelect");
	ddl_C0002_1.value(['100','200']); // db에서 저장된 값이 100, 200 이라면...
	
	//ddl_C0002_2 = $("#combobox_C0002_2").data("kendoMultiSelect");
	//ddl_C0002_2.value(['100','200']); // db에서 저장된 값이 100, 200 이라면...

}

//Kendo 콤보박스 생성
function makeCombo(param1, param2, param3, param4, param5){
	
	$("#combobox_C0044").kendoDropDownList({
		//autoBind: false,
	    dataTextField: "text",
	    dataValueField: "value",
	    dataSource: param1,
	    height: 310,
	    optionLabel: {
	    	text: "선택",
	    	value: ""
	    },
	    select: onSelect
	});

	$("#combobox_C0075").kendoDropDownList({
		//autoBind: false,
	    dataTextField: "text",
	    dataValueField: "value",
	    dataSource: param2,
	    height: 310,
	    optionLabel: {
	    	text: "선택",
	    	value: ""
	    },
	    select: onSelect
	});

	$("#combobox_C0076").kendoDropDownList({
		//autoBind: false,
	    dataTextField: "text",
	    dataValueField: "value",
	    dataSource: param3,
	    height: 310,
	    optionLabel: {
	    	text: "선택",
	    	value: ""
	    },
	    select: onSelect
	});  
	
	$("#combobox_C0084").kendoDropDownList({
		//autoBind: false,
	    dataTextField: "text",
	    dataValueField: "value",
	    dataSource: param4,
	    virtual: {
	    	itemHeight: 26
	    },
	    height: 310,
	    optionLabel: {
	    	text: "선택",
	    	value: ""
	    },
	    select: onSelect
	});	
	
	
	//멀티선택콤보 1
	let ddl_C0002 = $('#combobox_C0002');
	ddl_C0002.kendoMultiSelect({
		//itemTemplate: "<input type='checkbox'/>#:data.text#",
		//downArrow: true,  //true : 콤보 화살표가 보임
		placeholder: "선택",
        dataTextField: "text",
        dataValueField: "value",
        dataSource: param5,
	    autoClose: false,
	    autoBind: false

        
	}).data("kendoMultiSelect"); 
	
	
	//멀티선택콤보 2 - tagMode : single
	let ddl_C0002_1 = $('#combobox_C0002_1');
	ddl_C0002_1.kendoMultiSelect({
		tagMode: "single",  //추가됨
		placeholder: "선택",
        dataTextField: "text",
        dataValueField: "value",
        dataSource: param5,
        autoClose: false,
	    autoBind: false
	}).data("kendoMultiSelect"); 	

	
	//멀티선택콤보 3 - 체크박스 유형
	//2022 버젼부터 check박스 기능지원 안하므로 제외(2021년 버젼까지는 아래 기능이 작동됨)
	//refer & test URL -> https://dojo.telerik.com/oziNoVEZ/442
	/*
	let ddl_C0002_2 = $('#combobox_C0002_2');
	ddl_C0002_2.kendoMultiSelect({
		placeholder: "선택",
		//emptySelectionLabel: "선택",
		
        dataTextField: "text",
        dataValueField: "value",
        dataSource: param5,
 
        itemTemplate: "<input type='checkbox'/> #:data.text#",
        //tagTemplate: kendo.template($("#tagTemplate").html()),
        autoClose: false,
        tagMode: "single",
        dataBound: function() {
          var items = this.ul.find("li");
          setTimeout(function() {
            checkInputs(items);
          });
        },
        change: function() {
          var items = this.ul.find("li");
          checkInputs(items);
        }
      }).data("kendoMultiSelect");
      */

}

function checkInputs(elements){
	elements.each(function() {
        var element = $(this);     
        var input = element.children("input");

        input.prop("checked", element.hasClass("k-state-selected"));
	});
}


function getCodeList() {
	//alert("=== 공통 콤보 Code 조회 시작 ===");
	//자신의 화면에서 사용하는 대분류 코드를 JSON Array로 만들것.
	//자신의 화면에 콤보박스가 1개만 있을 경우 값을 JSON Array에 한개만 넣어서 전송할 것.
	var data = { "codeList": [
		{"mgntItemCd":"C0044"},
		{"mgntItemCd":"C0075"},
		{"mgntItemCd":"C0076"},
		{"mgntItemCd":"C0084"},
		{"mgntItemCd":"C0002"}	
	]};
	
    $.ajax({
    	url         : '/bcs/comm/COMM100SEL01',
        type        : 'post',
        dataType    : 'json', 
        contentType : 'application/json; charset=UTF-8',
        data        : JSON.stringify(data),
        success     : resultComboList,
        error       : function(request,status, error){
        	console.log("[error]");
        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
        }
    });
}

//코드목록 조회결과 및 KENDO 콤보 형식 데이터 변환
function resultComboList(data){
	let jsonEncode = JSON.stringify(data.codeList);
	let object=JSON.parse(jsonEncode);
	let jsonDecode = JSON.parse(object);
	
	for (let i = 0; i < jsonDecode.length; i++) {
		console.log("====== 관리항목코드 : " + jsonDecode[i].mgntItemCd +", 코드:" + jsonDecode[i].comCd +", 코드명:" + jsonDecode[i].comCdNm );

		//배경 색
		let c0044 = new Object();
		if(jsonDecode[i].mgntItemCd == "C0044"){
			c0044 = {text:jsonDecode[i].comCdNm , value: jsonDecode[i].comCd};
			//alert(c0044);
			data_c0044.push(c0044);
		}		
		//일정 시작 시	
		let c0075 = new Object();
		if(jsonDecode[i].mgntItemCd == "C0075"){
			c0075 = {text:jsonDecode[i].comCdNm , value: jsonDecode[i].comCd};
			data_c0075.push(c0075);
		}	
		//일정 시작 분
		let c0076 = new Object();
		if(jsonDecode[i].mgntItemCd == "C0076"){
			c0076 = {text:jsonDecode[i].comCdNm , value: jsonDecode[i].comCd};
			data_c0076.push(c0076);
		}	
		//지식상태
		let c0084 = new Object();
		if(jsonDecode[i].mgntItemCd == "C0084"){
			c0084 = {text:jsonDecode[i].comCdNm , value: jsonDecode[i].comCd};
			data_c0084.push(c0084);
		}	

		//도메인	
		let c0002 = new Object();
		if(jsonDecode[i].mgntItemCd == "C0002"){
			c0002 = {text:jsonDecode[i].comCdNm , value: jsonDecode[i].comCd};
			data_c0002.push(c0002);
		}			
	}

	let sJson1 = JSON.parse(JSON.stringify(data_c0044));
	let sJson2 = JSON.parse(JSON.stringify(data_c0075));
	let sJson3 = JSON.parse(JSON.stringify(data_c0076));
	let sJson4 = JSON.parse(JSON.stringify(data_c0084));
	let sJson5 = JSON.parse(JSON.stringify(data_c0002));

	console.log("====== sJson1 => " + sJson1  );
	console.log("====== sJson2 => " + sJson2  );
	console.log("====== sJson3 => " + sJson3  );
	console.log("====== sJson4 => " + sJson4  );
	console.log("====== sJson5 => " + sJson5  );
	
	//콤보 값 채움
	makeCombo(sJson1, sJson2, sJson3, sJson4, sJson5);
	
	//콤보 초기값 선택(예시)
	setCombo();
	
	//화면 log message
	var result = JSON.stringify(data.result);
	document.getElementById("result").innerHTML = "";
	document.getElementById("result").innerHTML = result;

	var message = JSON.stringify(data.msg);
	document.getElementById('message').innerHTML="";
	document.getElementById('message').innerHTML=message;
	
}

//refer :
//https://docs.telerik.com/kendo-ui/api/javascript/ui/dropdownlist/methods/select
//https://demos.telerik.com/kendo-ui/combobox/index	
//https://demos.telerik.com/kendo-ui/multiselect/index
//https://demos.telerik.com/kendo-ui/multiselect/tag-mode
//
	