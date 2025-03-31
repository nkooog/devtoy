var CNSL110TDataSource,grdCNSL110T,CNSL110T_delay;
var grdCNSL110T_custId,grdCNSL110T_custNm;

var CNSL110_codeList={"codeList":[]};

var CNSL110T_comCdList;

var CNSL110T_IFType;

$(document).ready(function() {
	
	//kw---20230510 : 테넌트 기준정보(18) 고객정보 경로 - 15:DB-IO / 14:IF-IO
	var ifType = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 18).bascVluDvCd;
	if(ifType == 15){
		CNSL110T_IFType = "IF";
	} else {
		CNSL110T_IFType = "DB";
	}
	
	//kw---20240215 : 입력창에서 엔터키를 눌렀을 경우
	$(".CNSL110 #srchTxt").on('keyup',function(e){
		if(e.keyCode == 13){
			setCNSL111SEL01();
		}
	});

	//공통콤보 불러오기
	let data;
	let url;
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		data = { "codeList": [
			{"mgntItemCd":"S0008"}
		]};	
		url = GLOBAL.contextPath + '/comm/COMM100SEL01';
	} else {
		data = { 
				tenantId    : GLOBAL.session.user.tenantId
			};
		url = GLOBAL.contextPath + '/cnsl/CNSL160SEL05';
	}

	$.ajax({
		url         : url,
		type        : 'post',
		dataType    : 'json',
		contentType : 'application/json; charset=UTF-8',
		data        : JSON.stringify(data),
		success     : resultComboList110,
		error       : function(request,status, error){
			console.log("[error]");
			console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});

	

	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		
		CNSL110TDataSource ={
				transport: {
					read	: function (CNSL110T_jsonStr) {
						if (CNSL110T_jsonStr.data) {
							grdCNSL110T.dataSource.data([]);
						} else {
							Utils.ajaxCall('/cnsl/CNSL110SEL01', CNSL110T_jsonStr, CNSL110T_resultIndex,
							window.kendo.ui.progress($("#grdCNSL110T"), true), window.kendo.ui.progress($("#grdCNSL110T"), false));
						}
					},
				},
			}
		
		CNSL110T_gridCreateH();
	} else {
		$.ajax({
	    	url         : GLOBAL.contextPath + '/cnsl/CNSL160SEL02',
	        type        : 'post',
	        dataType    : 'json', 
	        contentType : 'application/json; charset=UTF-8',
	        data        : JSON.stringify(data),
	        success     : function(data) {
	        	let jsonEncode = JSON.stringify(data.CNSL160SEL02);
	        	let object=JSON.parse(jsonEncode);
	        	grdCNSL110TCreat(object);
	        },
	        error       : function(request,status, error){
	        	console.log("[error]");
	        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
	        }
	    });
	}

	grdCNSL110T = $("#grdCNSL110T").data("kendoGrid");
	//그리드 높이 조절
	heightResizeCNSL();

	$('.CNSL110 #srchType').change(function() {
		$(".CNSL110 #srchTxt").val("");
		$(".CNSL110 #srchTxt").attr("oninput", "CNSL110T_checkSpecialCharacters(event)");

		// if($(this).val() == "1"){
		// 	$(".CNSL110 #srchTxt").attr("placeholder", "7자리 이하 영문, 숫자, '_' 입력");
		// } else if($(this).val() == "2"){
		// 	$(".CNSL110 #srchTxt").attr("placeholder", "4자리 이하 한글 입력");
		// } else if($(this).val() == "3"){
		// 	$(".CNSL110 #srchTxt").attr("placeholder", "15자리 이하 숫자, '-' 입력");
		// } else if($(this).val() == "4"){
		// 	$(".CNSL110 #srchTxt").attr("placeholder", "15자리 이하 숫자, '-' 입력");
		// } else if($(this).val() == "5"){
		// 	$(".CNSL110 #srchTxt").attr("placeholder", "15자리 이하 숫자, '-' 입력");
		// } else if($(this).val() == "6"){
		// 	$(".CNSL110 #srchTxt").attr("placeholder", "15자리 이하 숫자, '-' 입력");
		// } else {
		// 	$(".CNSL110 #srchTxt").attr("placeholder", "15자리 이하 숫자, '-' 입력");
		// }
	});

	grdCNSL110T.dataSource.data([]);
});


function CNSL110_fnbuttonTemplate(custNo, custId){
	let src = "";
	src +='<button class="btnRefer_default" onclick="CNSL110T_fnDeleteClick(event,' + "'" +  custNo + "','" + custId + "'"  +')" style="width:30px;"><span class="k-icon k-i-delete" style="margin-left:1px;"></span></button>'
	return src;
}

function CNSL110T_fnDeleteClick(event, custNo, custId){
	// 이벤트 버블링 방지
	event.stopPropagation();

	let _masterId = GLOBAL.session.user.tenantId + '_1';

	if(_masterId === custId){
		Utils.alert("해당 고객정보는 삭제할 수 없습니다.");
		return;
	}
	
	let confrimMessage = CNSL110T_langMap.get("CNSL110T.alert.cnsl.del_01") + " : " + custId + CNSL110T_langMap.get("CNSL110T.alert.cnsl.del_02");
	
	let urlDel = "";
	
	//kw---20240213 : 추후에 분개처리 할 수도 있을거 같아서 url 구분하도록 코드 작성 (지금은 분개처리할게 따로 없어서 동일한 url로 처리
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		urlDel = '/cnsl/CNSL111DEL02';
	} else {
		urlDel = '/cnsl/CNSL111DEL02';
	}

	Utils.confirm(confrimMessage, function(){
		let cust_del_data = {
			'tenantId' : GLOBAL.session.user.tenantId,
			'custNo' : custNo,
			'custId' : custId,
		};
		let cust_del_jsonStr = JSON.stringify(cust_del_data);

		
		Utils.ajaxCall(urlDel, cust_del_jsonStr, function(){
			Utils.alert("정상적으로 삭제되었습니다.", function (){
				setCNSL111SEL01();
			})
		});
	})
}

function setCNSL111SEL01() {
	var custNmSrchkey1 = null;
	var custNmSrchkey2 = null;
	
	let CNSL110T_data;
	
	if ( $(".CNSL110 #srchTxt").val().length == 1 ) {
		custNmSrchkey1 = $(".CNSL110 #srchTxt").val().substr(0,1);
	}
	if ( $(".CNSL110 #srchTxt").val().length == 2 ) {
		custNmSrchkey2 = $(".CNSL110 #srchTxt").val().substr(0,2)
	}

	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		CNSL110T_data = {
				tenantId 	   : GLOBAL.session.user.tenantId,
				srchType 	   : $(".CNSL110 #srchType").val(),
				srchTxt 	   : $(".CNSL110 #srchTxt").val(),
				custNmSrchkey1 : custNmSrchkey1,
				custNmSrchkey2 : custNmSrchkey2,
				encryptYn      : Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1,
				unknownCustomer : 'N'
			};
	} else {
		CNSL110T_data = { 
				tenantId 	   : GLOBAL.session.user.tenantId,
				usrId		   : GLOBAL.session.user.usrId,
				srchType 	   : $(".CNSL110 #srchType").val().split("_")[0], 
				voColId		   : $(".CNSL110 #srchType").val().split("_")[1],
				srchTxt 	   : $(".CNSL110 #srchTxt").val(),
				encryptYn      : $(".CNSL110 #srchType").val().split("_")[2],
				type		   : 'SEL'
	       }; 
	}
	
	var CNSL110T_jsonStr = JSON.stringify(CNSL110T_data);
	CNSL110TDataSource.transport.read(CNSL110T_jsonStr);
}

function searchCustomer(telNo , delay) {
	var combobox = $(".CNSL110 #srchType").data("kendoComboBox");
	var srchType;
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		combobox.value('3');
		srchType = '3';
	} else {
		
		var arrComboData = $(".CNSL110 #srchType").data("kendoComboBox").dataSource.data();
		$.each(arrComboData, function(index, item){
			if(item.value.indexOf('T0009') !== -1){
				srchType = item.value;
	        }  
		});
		
		combobox.value(srchType);
	}
	$(".CNSL110 #srchTxt").val(telNo);
	
	setCNSL111SEL01();
	CNSL110T_delay = delay;
}

function resultComboList110(data){
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		let jsonEncode = JSON.stringify(data.codeList);
		let object=JSON.parse(jsonEncode);
		let jsonDecode = JSON.parse(object);

		Utils.setKendoComboBox(jsonDecode, "S0008", '.CNSL110 .S0008', '', false) ;
	} else {
		let jsonEncode = JSON.stringify(data.CNSL160SEL05);
		let object=JSON.parse(jsonEncode);
		let codeList = JSON.parse(object);
		let dataSource = [];

	    dataSource = dataSource.concat(codeList.filter(function (code) {
	        code.text = code.mgntItemNm;
	        code.value = code.mgntItemCd + '_' + code.voColId + '_' + code.crypTgtYn;
	        return code;
	    }))
	    
	    var allType = {
    			    		text : '전체',
    			    		value : 'all',
    			    }

	    dataSource.unshift(allType);
	    
	    let kendoComboBox = $(".CNSL110 #srchType").kendoComboBox({
	        dataSource: dataSource,
	        dataTextField: "text",
	        dataValueField: "value",
	        clearButton: false,
	        autoWidth: true,
	    }).data("kendoComboBox");

	    if (dataSource.length > 0) {
	    	kendoComboBox.value(dataSource[0].value);
	    }
	    kendoComboBox.input.attr("readonly", true);
	}

}

function CNSL110T_resultIndex(data){
	var CNSL110T_jsonEncode = JSON.stringify(data.CNSL110SEL01);
	var CNSL110T_jsonDecode = JSON.parse(JSON.parse(CNSL110T_jsonEncode));
	grdCNSL110T.dataSource.data(CNSL110T_jsonDecode);
	if ( CNSL110T_jsonDecode.length == 1 && CNSL110T_delay != undefined ) {
		
		custId = CNSL110T_jsonDecode[0].custId;
		custNm = CNSL110T_jsonDecode[0].custNm;
		setTimeout(function() {
			CNSL100MTabClick(GLOBAL.contextPath + "/cnsl/CNSL112T")
			if ( typeof(settingCNSL112SEL01) != 'undefined' ) {
				settingCNSL112SEL01();
			}
		}, CNSL110T_delay);

	}
}

function openPopCNSL111PINS() {
	let param = {
		upsertFlg 	: 'I',
		callbackKey	: "setCNSL111SEL01",
		custTelNum	: custTelNum,
	};

	Utils.setCallbackFunction("setCNSL111SEL01", setCNSL111SEL01);
	Utils.openPop(GLOBAL.contextPath + "/cnsl/CNSL111P", "CNSL111P", 1000, 800, param);
}

function openPopCNSL110TINSEx() {
	let param = {
		upsertFlg 	: 'I',
		callbackKey	: "setCNSL111SEL01",
		custTelNum	: custTelNum,
	};

	Utils.setCallbackFunction("setCNSL111SEL01", setCNSL111SEL01);
	Utils.openPop(GLOBAL.contextPath + "/cnsl/CNSL116P", "CNSL116P", 1230, 750, param);		//kw---20240401 : 고객정보 엑셀 등록을 위한 TEST 코드
}




function grdCNSL110T_fnOnDataBound() {
	$("#grdCNSL110T tbody").unbind('click').on("click", "td", function(e) {
		var myVar = grdCNSL110T.dataItem($(this).closest("tr"));

		if ( !Utils.isNull(grdCNSL110T_custId) ){
			custId = myVar[grdCNSL110T_custId]
		} else {
			custId = myVar.custId;
        }
		
        if ( !Utils.isNull(grdCNSL110T_custNm) ){
        	custNm = myVar[grdCNSL110T_custNm]
        } else {
	       	custNm = myVar.custNm;
        }
        
        //kw---20240313 : 환자를 어디서 찾았는지 구분하기 위함 - find:환자찾기, list:상담이력
    	custSelMode = 'find';
		
		CNSL100MTabClick(GLOBAL.contextPath + "/cnsl/CNSL112T")
		if ( typeof(settingCNSL112SEL01) != 'undefined' ) {
			settingCNSL112SEL01();
		}
	});
}

function unknownCustomerSel() {
	
	var CNSL110T_data;
	
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		var custNmSrchkey1 = null;
		var custNmSrchkey2 = null;
		CNSL110T_data = {
			tenantId 	   : GLOBAL.session.user.tenantId,
			srchType 	   : '1',
			srchTxt 	   : GLOBAL.session.user.tenantId + '_1',
			custNmSrchkey1 : custNmSrchkey1,
			custNmSrchkey2 : custNmSrchkey2,
			encryptYn      : Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1,
			unknownCustomer : 'Y'
		};
		
	} else {
		CNSL110T_data = { 
				tenantId 	   : GLOBAL.session.user.tenantId,
				srchType 	   : 'unknownCustomer',
				srchTxt 	   : GLOBAL.session.user.tenantId + '_1',
				encryptYn      : Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1
		       };	
	}
	
	var CNSL110T_jsonStr = JSON.stringify(CNSL110T_data);
	CNSL110TDataSource.transport.read(CNSL110T_jsonStr);
	
}


//kw---20230103 : 고객레이아웃으로 그리드 표출하기

function grdCNSL110TCreat(object) {
	let grdCNSL110T_column = JSON.parse(object);
	let pgmId = '';
	let dataSrcDvCd = '';
	
	if ( grdCNSL110T_column.length > 0 ) {
		pgmId = grdCNSL110T_column[0].pgmId;
		dataSrcDvCd = grdCNSL110T_column[0].dataSrcDvCd;
	}

	let grdCNSL110T_columns = [];
	
	CNSL110TDataSource ={
			transport: {
				read	: function (CNSL110T_jsonStr) {
					
					let CNSL110T_srchType = JSON.parse(CNSL110T_jsonStr);
					if ( CNSL110T_srchType.srchType == 'unknownCustomer' ) {
						Utils.ajaxCall('/cnsl/CNSL160SEL04', CNSL110T_jsonStr, CNSL110T_resultIndex_Unknown, 
						window.kendo.ui.progress($("#grdCNSL110T"), true), window.kendo.ui.progress($("#grdCNSL110T"), false))
					} else {
						Utils.ajaxCall('/cnsl/CNSL160SEL03', CNSL110T_jsonStr, CNSL110T_resultIndex_D, 
						window.kendo.ui.progress($("#grdCNSL110T"), true), window.kendo.ui.progress($("#grdCNSL110T"), false))
					}
				},
			},
	}
	
	for ( var i = 0; i < grdCNSL110T_column.length; i++ ) {
		let jsonColumn;
		if ( grdCNSL110T_column[i].voColId == 'custId' ) {
			grdCNSL110T_custId = grdCNSL110T_column[i].mgntItemCd;
		}
		
		if ( grdCNSL110T_column[i].voColId == 'custNm' ) {
			grdCNSL110T_custNm = grdCNSL110T_column[i].mgntItemCd;
		}
		
		
		if ( grdCNSL110T_column[i].mgntItemTypCd == "C" ){
			CNSL110_codeList.codeList.push({"mgntItemCd":grdCNSL110T_column[i].mgntItemCd});
			
			let mgntItemCd = grdCNSL110T_column[i].mgntItemCd;
			
			jsonColumn = {
					width: "auto", field: mgntItemCd, title: grdCNSL110T_column[i].mgntItemNm,
					editor: function (container, options) {
						CNSL110T_grid_fnComboEditor(container, options, grdCNSL110T[0].instance, mgntItemCd);
	                },
	                template: function (dataItem) {
	                	let comCd = dataItem[mgntItemCd];
	                	if (Utils.isNull(comCd)) {
	                		comCd = '';
	                	}
	                	return Utils.getComCdNm(CNSL110T_comCdList, mgntItemCd, comCd);
                	}
			}
		} else {
			jsonColumn = {
					width: "auto", field: grdCNSL110T_column[i].mgntItemCd, title: grdCNSL110T_column[i].mgntItemNm
			}
		}
		grdCNSL110T_columns.push(jsonColumn);
	}

	if(CNSL110T_IFType == "DB"){
		if(parseInt(GLOBAL.session.user.usrGrd) >= 130){
			let jsonColumnDel;
			let strTenantId = GLOBAL.session.user.tenantId + "_";
			
			jsonColumnDel = {
					width: 45, field: "delBtn", title: "삭제",
					template : function (dataItem){
						return CNSL110_fnbuttonTemplate(dataItem[grdCNSL110T_custId].replace(strTenantId, ""), dataItem[grdCNSL110T_custId]);
					}
			}
			
			grdCNSL110T_columns.push(jsonColumnDel);
		}
	}
	
	
	
	CNSL110T_fnInit();
	
	$("#grdCNSL110T").kendoGrid({
		dataSource : CNSL110TDataSource,
		noRecords: {
			template: `<div class="nodataMsg"><p>${CNSL110T_langMap.get("CNSL110T.grid.nodatafound")}</p></div>`
	    },
		autoBind: false,
		sortable: false,
		scrollable: true,
		selectable: "row",
		resizable: false,
		pageable: {refresh:false
			, pageSizes:[ 25, 50, 100, 200,  500]
			, buttonCount:10
			, pageSize : 25
			, messages: {
				display: " "
				, itemsPerPage: ""
			    }
		},
		columns: grdCNSL110T_columns,
        dataBound: function() {
            grdCNSL110T_fnOnDataBound();
        },
		change: function(e) {
			let selectedRows = this.select();
			CNSL110T_selItem = this.dataItem(selectedRows[0]);
		}
	});
	
	grdCNSL110T = $("#grdCNSL110T").data("kendoGrid");
	heightResizeCNSL();
}

function CNSL110T_resultIndex_Unknown(data){
	var CNSL110T_jsonEncode = JSON.stringify(data.CNSL160SEL04);
	var CNSL110T_jsonDecode = JSON.parse(JSON.parse(CNSL110T_jsonEncode));
	
	let grdCNSL110T_rows = [];
	if ( CNSL110T_jsonDecode.length > 0 ) {
		let jsonColumn = {}
		jsonColumn[grdCNSL110T_custId] = CNSL110T_jsonDecode[0].custId;
		jsonColumn[grdCNSL110T_custNm] = CNSL110T_jsonDecode[0].custNm;
		grdCNSL110T_rows.push(jsonColumn)
	} 
	
	grdCNSL110T.dataSource.data(grdCNSL110T_rows);
	
	
	custId = CNSL110T_jsonDecode[0].custId;
	custNm = CNSL110T_jsonDecode[0].custNm;
	
	setTimeout(function() {
		CNSL100MTabClick(GLOBAL.contextPath + "/cnsl/CNSL162T")
		if ( typeof(settingCNSL112SEL01) != 'undefined' ) {
			settingCNSL112SEL01();
		}
	}, CNSL110T_delay);
}	

//kw---20240103 : 그리드에 콤보박스 넣는 방법 추가
function CNSL110T_grid_fnComboEditor(container, options, gridIndex, code, isTotalOption) {
	
	let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);
	
	//직접 입력 부분을 빼고 콤보 박스를 셋팅하기 위한 for문
	var arr =new Array(1);
    for(var i=0; i<CNSL130M_comCdList.length; i++) {
    	if(CNSL130M_comCdList[i].comCdNm != "직접입력"){
    		arr.push(CNSL130M_comCdList[i]);
    	}
    }
    //직접 입력 부분을 빼고 콤보 박스를 셋팅하기 위한 for문 끝
	
    Utils.setKendoComboBox(arr, code, $select, "", isTotalOption).bind("change", function (e) {
        let element = e.sender.element;

        let row = element.closest("tr");
        let dataItem = CNSL130M_grid[gridIndex].instance.dataItem(row);

        dataItem.set(options.field, e.sender.value());

        CNSL130M_grid[gridIndex].instance.refresh();
    });    
}


function CNSL110T_resultIndex_D(data){
	
	var CNSL110T_jsonEncode = JSON.stringify(data.CNSL160SEL03);
	var CNSL110T_jsonDecode = JSON.parse(JSON.parse(CNSL110T_jsonEncode));
	
	let grdCNSL110T_rows = [];
	if ( CNSL110T_jsonDecode.length > 0 ) {
		let jsonColumn = {}
		let CNSL110T_rowId = '';
		for ( var i = 0; i < CNSL110T_jsonDecode.length; i++ ) {
			if ( CNSL110T_rowId != CNSL110T_jsonDecode[i].custId ) {
				CNSL110T_rowId = CNSL110T_jsonDecode[i].custId;
				if ( i != 0 ) {
					grdCNSL110T_rows.push(jsonColumn)
					jsonColumn = {};
				}
				jsonColumn["custId"] = CNSL110T_jsonDecode[i].custId;
				jsonColumn[grdCNSL110T_custId] = CNSL110T_jsonDecode[i].custId;
				
				if ( grdCNSL110T_custId != CNSL110T_jsonDecode[i].mgntItemCd ) {
					
					jsonColumn[CNSL110T_jsonDecode[i].mgntItemCd] = CNSL110T_jsonDecode[i].custItemDataVlu;
				} 
			} else {
				if ( grdCNSL110T_custId != CNSL110T_jsonDecode[i].mgntItemCd ) {
					jsonColumn[CNSL110T_jsonDecode[i].mgntItemCd] = CNSL110T_jsonDecode[i].custItemDataVlu;
				}
			}

			if ( i == CNSL110T_jsonDecode.length-1 ) {
				grdCNSL110T_rows.push(jsonColumn)
			} 
		}
	} 
	
	grdCNSL110T.dataSource.data(grdCNSL110T_rows);
	
	if ( grdCNSL110T_rows.length == 1 ) {
		if ( !Utils.isNull(grdCNSL110T_custId) ){
        	custId = grdCNSL110T_rows[0][grdCNSL110T_custId]
        } else {
        	custId = grdCNSL110T_rows[0].custId;
        }
        if ( !Utils.isNull(grdCNSL110T_custNm) ){
        	custNm = grdCNSL110T_rows[0][grdCNSL110T_custNm]
        } else {
        	custNm = grdCNSL110T_rows[0].custNm;
        }
		setTimeout(function() {
			CNSL100MTabClick(GLOBAL.contextPath + "/cnsl/CNSL162T")
			if ( typeof(settingCNSL162SEL01) != 'undefined' ) {
				settingCNSL162SEL01();
			}
		}, CNSL110T_delay);
	} 
}

function CNSL110T_resultIndex_Unknown(data){
	var CNSL110T_jsonEncode = JSON.stringify(data.CNSL160SEL04);
	var CNSL110T_jsonDecode = JSON.parse(JSON.parse(CNSL110T_jsonEncode));
	
	let grdCNSL110T_rows = [];
	if ( CNSL110T_jsonDecode.length > 0 ) {
		let jsonColumn = {}
		jsonColumn[grdCNSL110T_custId] = CNSL110T_jsonDecode[0].custId;
		jsonColumn[grdCNSL110T_custNm] = CNSL110T_jsonDecode[0].custNm;
		grdCNSL110T_rows.push(jsonColumn)
	} 
	
	grdCNSL110T.dataSource.data(grdCNSL110T_rows);
	
	
	custId = CNSL110T_jsonDecode[0].custId;
	custNm = CNSL110T_jsonDecode[0].custNm;
	
	setTimeout(function() {
		CNSL100MTabClick(GLOBAL.contextPath + "/cnsl/CNSL162T")
		if ( typeof(settingCNSL112SEL01) != 'undefined' ) {
			settingCNSL112SEL01();
		}
	}, CNSL110T_delay);
}	

function CNSL110T_fnInit(){
	var param = CNSL110_codeList;

	if(param.codeList.length > 0){
		
		Utils.ajaxCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
	        CNSL110T_comCdList = JSON.parse(result.codeList);
	    });
	}
}

function CNSL110T_gridCreateH(){
	var grdCNSL110T_columns = [];
	
	grdCNSL110T_columns = [ 
		{ width: 80, field: "custId", title: CNSL110T_langMap.get("CNSL110T.grid.column.custIdH"), },
		{ width: 80, field: "custNm", title: CNSL110T_langMap.get("CNSL110T.grid.column.custNmH"), attributes : { "class" : "textLeft" }},
		{ width: 40, field: "gndr", title: CNSL110T_langMap.get("CNSL110T.grid.column.gndr"), },
		{ width: 80, field: "btdt", title: CNSL110T_langMap.get("CNSL110T.grid.column.btdt"), },
		{ width: "auto", field: "owhmTelNo", title: CNSL110T_langMap.get("CNSL110T.grid.column.owhmTelNo"),
			template: function (data) {
				return maskingFunc.phone(data.owhmTelNo);
			}
		},
		{ width: "auto", field: "wkplTelNo", title: CNSL110T_langMap.get("CNSL110T.grid.column.wkplTelNo"),
			template: function (data) {
				return maskingFunc.phone(data.wkplTelNo);
			}
		},
		{ width: "auto", field: "mbleTelNo", title: CNSL110T_langMap.get("CNSL110T.grid.column.mbleTelNo"),
			template: function (data) {
				return maskingFunc.phone(data.mbleTelNo);
			}
		}
	]
	
	if(CNSL110T_IFType == "DB"){
		if(parseInt(GLOBAL.session.user.usrGrd) >= 0){
			let jsonColumnDel;

			jsonColumnDel = {
					width: 45,
					field: "btn",
					title: "삭제",
					template: '#=CNSL110_fnbuttonTemplate(custNo,custId)#'
				};

			grdCNSL110T_columns.push(jsonColumnDel);
		}
	}
	

	$("#grdCNSL110T").kendoGrid({
		dataSource : CNSL110TDataSource,
		noRecords: {
			template: `<div class="nodataMsg"><p>${CNSL110T_langMap.get("CNSL110T.grid.nodatafound")}</p></div>`
		},
		autoBind: false,
		sortable: false,
		scrollable: true,
		selectable: "row",
		resizable: false,
		pageable: {refresh:false
			, pageSizes:[ 25, 50, 100, 200,  500]
			, buttonCount:10
			, pageSize : 25
			, messages: {
				display: " "
				//, empty: CNSL110T_langMap.get("CNSL110T.grid.message")
				, itemsPerPage: ""
			}
		},
		columns: grdCNSL110T_columns,
		dataBound: function() {
			grdCNSL110T_fnOnDataBound();
		},
		change: function(e) {
			let selectedRows = this.select();
			CNSL110T_selItem = this.dataItem(selectedRows[0]);
		}
	});
}

function CNSL110T_checkSpecialCharacters(event) {
	const input = event.target;

	let nType = $('.CNSL110 #srchType').val();

	console.log(nType);

	if(nType == '1'){
		input.value = input.value.replace(/[^a-zA-Z0-9_]/g, '');
		$(".CNSL110 #srchTxt").attr("maxlength", "7");

	}
	else if(nType == '2') {
		input.value = input.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');
		$(".CNSL110 #srchTxt").attr("maxlength", "4");

	}
	else if(nType == '3') {
		input.value = input.value.replace(/[^0-9]/g, '');
		$(".CNSL110 #srchTxt").attr("maxlength", "15");

	}
	else if(nType == '4') {
		input.value = input.value.replace(/[^0-9]/g, '');
		$(".CNSL110 #srchTxt").attr("maxlength", "15");

	}
	else if(nType == '5') {
		input.value = input.value.replace(/[^0-9]/g, '');
		$(".CNSL110 #srchTxt").attr("maxlength", "15");

	}
	else if(nType == '6') {
		input.value = input.value.replace(/[^0-9]/g, '');
		$(".CNSL110 #srchTxt").attr("maxlength", "15");

	}
}

