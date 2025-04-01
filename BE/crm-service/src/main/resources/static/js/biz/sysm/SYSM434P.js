/***********************************************************************************************
 * Program Name : SYSM434PT.jsp
 * Creator         :  yhnam
 * Create Date  : 2023.11.16
 * Description    : 사후관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.11.16     yhnam         최초생성

 ************************************************************************************************/

// session
var SYSM434P_userInfo;

// grid
var SYSM434P_gridData;
var SYSM434PDataSource;
var SYSM434P_selItem;
var param={};


//업종분류코드 (병원용: true, 기업용: false)
//var DmnCode = true;
var DmnCode = getDomainCode();
// DB검색, IF검색 구분 값 (DB-IO = true, IF-IO = false)
var srchType = getTenantSrchType();

$(document).ready(function () {
	
	//kw---20240329 : SMS템플릿 고객조회 - 기업/병원일 경우 타이틀 변경 
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		$("#SYSM434P_title").text(SYSM434P_langMap.get("SYSM434P.title1"));
	} else {
		$("#SYSM434P_title").text(SYSM434P_langMap.get("SYSM434P.title2"));
	}
	
	
	SYSM434P_userInfo = GLOBAL.session.user;

	$("#grid_SYSM434P").kendoGrid({
        dataSource: [],
        noRecords: {
            template: `<div class="nodataMsg"><p>${SYSM434P_langMap.get("grid.nodatafound")}</p></div>`
        },
		autoBind: false,
		sortable: true,
		scrollable: true,
		selectable : "multiple,row",
		height: 345,
		pageable: {
			  refresh:false
			, pageSizes:[ 25, 50, 100, 200,  500]
			, buttonCount:10
			, pageSize : 25
		},
		change: function(e) {
//			console.log(this.select());
		},
		dataBound: SYSM434P_onDataBound,
        columns: getGridColumns(),
	}).data('kendoGrid');	

    SYSM434P_gridData = $("#grid_SYSM434P").data("kendoGrid");
    SYSM434P_gridData.tbody.on('dblclick', SYSM434P_fnDblclick);
    
    SYSM434P_fnSearch();
    SYSM434P_fnKeyup();
    SYSM434P_fnSelectCmmCode();
    
    // 적용버튼 클릭
    document.getElementById("saveWaitBtn").addEventListener("click", function() {
    	// 발송고객 등록
    	createSendCustomer();
    });
    
    // 팝업창 닫기
    document.getElementById("saveWorkBtn").addEventListener("click", function() {
    	closeWindow();
    });
    
    // 검색 입력창 엔터처리
    document.getElementById("srchTxt").addEventListener('keypress', handleEnterKeyPress);
	
    
});

//==============================
//					기타 화면 기능 start
//==============================

// grid tr dbl click
function SYSM434P_fnDblclick(e) {
	createSendCustomer();
}

// 검색 입력창 엔터처리 핸들러
function handleEnterKeyPress(e) {
    if (e.keyCode === 13) {
    	SYSM434P_fnSearch();
    }
}

// grid 검색조건 엔터
function SYSM434P_fnKeyup(){
	$("#SYSM434P_usrId").on("keyup", function (e) {
        if (e.keyCode == 13) {
            SYSM434P_fnSearch();
        }
    });
}

// grid 조회
function SYSM434P_fnSearch() {

	let param = getSrchParam();
	
	let ajaxUrl = "/cnsl/CNSL160SEL03";
	
	// 병원용(공통코드로 조회), 기업( ? ?)
	if(DmnCode) {
		ajaxUrl = "/cnsl/CNSL110SEL01";
	}
	
	Utils.ajaxCall(ajaxUrl, JSON.stringify(param), function (data) {
		if(DmnCode) {
			SYSM434P_gridData.dataSource.data([]);
			if(data.CNSL110SEL01 != null) {
				SYSM434P_gridData.dataSource.data(JSON.parse(data.CNSL110SEL01));
			}
		}else{
			createGridData(JSON.parse(data.CNSL160SEL03));
		}
		
	});
}
function SYSM434P_onDataBound(e){
	console.log(e);
}


// 콤보 박스 생성
function SYSM434P_fnSelectCmmCode() {
    let SYSM434P_data = {
        "codeList": [
        	{"mgntItemCd": "S0008"}
        ]
    };
        
    let ajaxUrl = "/comm/COMM100SEL01";
    
    if(DmnCode) {
    	Utils.ajaxSyncCall(ajaxUrl, JSON.stringify(SYSM434P_data), SYSM434P_fnsetCmmCode);
    	
    }else{
    	ajaxUrl = GLOBAL.contextPath + "/cnsl/CNSL160SEL05";
    	SYSM434P_data = { 
				tenantId    : GLOBAL.session.user.tenantId
		};
    	
    	$.ajax({
    		url         : ajaxUrl,
    		type        : 'post',
    		dataType    : 'json',
    		contentType : 'application/json; charset=UTF-8',
    		data        : JSON.stringify(SYSM434P_data),
    		success     : SYSM434P_fnsetCmmCode,
    		error       : function(request,status, error){
    			console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
    		}
    	});
    	
    }
    
}

function SYSM434P_fnsetCmmCode(data){
	if(DmnCode) {
		// 병원용 (공통코드)
		let SYSM434P_cmmCodeList = JSON.parse(data.codeList);
		Utils.setKendoComboBox(SYSM434P_cmmCodeList, "S0008", "#SYSM434P input[name=relCd]", "", false);
	}else{
		// 기업용 ( ..? )
		setCustomKendoCombo(JSON.stringify(data.CNSL160SEL05));
	}
	
}

function setCustomKendoCombo(data) {
	
	let object=JSON.parse(data);
	let codeList = JSON.parse(object);
	let dataSource = [{text : '전체',value: 'all'}];

    dataSource = dataSource.concat(codeList.filter(function (code) {
        code.text = code.mgntItemNm;
//        code.value = code.mgntItemCd;
        code.value = code.mgntItemCd + '_' + code.voColId + '_' + code.crypTgtYn;			//kw---20240329 고객조회시 각 검색 타입별 암호화 확인하기 위함
        return code;
    }))
    
    let kendoComboBox = $("#srchType").kendoComboBox({
        dataSource: dataSource,
        dataTextField: "text",
        dataValueField: "value",
        clearButton: false,
        autoWidth: true,
    }).data("kendoComboBox");

    if (dataSource.length > 0) {
    	console.log(kendoComboBox);
    	kendoComboBox.value(dataSource[0].value);
    }
    
    kendoComboBox.input.attr("readonly", true);
}

// DB/IF 구분에 따라 grid column return
function getGridColumns() {
	
	// 기업용 data 컬럼
	let column = [
				      { selectable: "multiple,row", width: '40px'}
					, { width: 65,  field:"custId", title: '고객 번호' }
					, { width: 100, field:"orgNm",     title: '업체명', attributes: {"class": "k-text-left"} }
					, { width: 65,  field:"custNm",     title: '담당자명'}
					, { width: 65,  field:"mbleTelNo",   title: '휴대전화번호'}
	];
	
	// 일반용 data 컬럼
	if(DmnCode) {
		column = [
			      { selectable: "multiple,row", width: '40px'}
				, { width: 65,  field:"custId",    title: '차트 번호'}
				, { width: 100, field:"custNm",    title: '환자명', attributes: {"class": "k-text-left"} }
				, { width: 65,  field:"gndr"  ,    title: '성별'}
				, { width: 65,  field:"mbleTelNo", title: '휴대전화번호'}
			];
	}
	
	
	return column;
}


// 테넌트 기준정보 고객정보 경로에 (14:DB-IO) true / (15:IF-IO) false 로 구분 값 return
function getTenantSrchType() {
	// 테넌트 기준정보(18) 고객정보 경로 - 14:DB-IO / 15:IF-IO
	return Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 18).bascVluDvCd == '15' ? true : false;
}

// 업종분류코드 return (병원용일 경우 true, 기업용일 경우는 false로 return) 
function getDomainCode() {
	let sessionDmnCode = GLOBAL.session.user.dmnCd;
	let result = false;

	//200(의료), 201(상급병원), 202(대학병원)을 제외한 코드는 기업용
	if(sessionDmnCode == '200'
		|| sessionDmnCode == '201'
			|| sessionDmnCode == '202') {
		result = true;
	}
	return result;
}


//그리드가 변경 되었을 경우
function SYSM434M_grid_fnOnChange(e, gridIndex) {	
    let rows = e.sender.select(),
        items = [];
    rows.each(function(e) {
        let dataItem = SYSM434M_Grid[gridIndex].instance.dataItem(this);
        items.push(dataItem);
    });

    SYSM434M_Grid[gridIndex].selectedItems = items;
}

//팝업창 닫기
function closeWindow() {
	Utils.closeKendoWindow();
}

function createSendCustomer() {
	let param = [];
	let grid = $("#grid_SYSM434P").data("kendoGrid");
	
	// 발송 스케줄
	let schdNo = Utils.getUrlParam("schdNo");
	let reg_dt = Utils.getUrlParam("reg_dt");
	let tmplMgntNo = Utils.getUrlParam("tmplMgntNo");
	let valid = true;
	
	grid.tbody.find("input:checked").closest("tr").each(function(index, row) {
		
		let dataItem = grid.dataItem(row);
        let gender = 'M';	
        
        if(Utils.isNull(dataItem.mbleTelNo)) {
        	valid = false;
        	return;
        }
        
        if(Utils.isNotNull(dataItem.gndr)) {
        	if(dataItem.gndr == '여') gender = 'F';
        }else{
        	gender = '';
        }
        
        let data = {
        		custNm    : hasData(dataItem.custNm)
        	,	custId	  : hasData(dataItem.custId)
        	,	recvrTelNo: hasData(dataItem.mbleTelNo)
        	,   dpchNo    : ''
        	,   tenantId  : dataItem.tenantId
        	,	gndrCd	  : gender
        	,	regrId	  : GLOBAL.session.user.usrId
       		,	regrOrgCd : GLOBAL.session.user.orgCd
       		,	custRcgnCd: '1'		 //고객식별코드(고정) : 1 
  			,	custRcgnPathCd : '1' //고객식별경로코드(고정) : 1
        }
        param.push(getParams(data));
    });
	
	Utils.ajaxCall("/sysm/SYSM434INS04", JSON.stringify({list : param}), function (result) {
		opener.parent.SYSM434M_fnSearchSubGridList();
		console.log(document.getElementById("gridSYSM434M_3"))
		if(valid) closeWindow();
	}, null, null, function errorFn(err) {
		Utils.alert(JSON.parse(err.responseText).msg);
	});
	
}

function hasData (data) {
	return (typeof data === 'undefined') ? '' : data;
}

function getParams(data) {
    // 파라미터가 담길 변수
    var param={};
    var url = decodeURIComponent(location.href);
    url = decodeURIComponent(url);
 
    var params;
    params = url.substring( url.indexOf('?')+1, url.length );
    params = params.split("&");

    var size = params.length;
    var key, value;

    for(var i=0 ; i < size ; i++) {
        key = params[i].split("=")[0];
        value = params[i].split("=")[1];
 
        param[key] = value;
		data[key] = value;
    }
 	
    return Object.assign({}, param, data);
}

// 검색 파라미터 설정
function getSrchParam() {
	
	let srchCode = document.getElementById("srchType").value;
	let srchText = document.getElementById("srchTxt").value;
	
	let data = {
				tenantId   		: GLOBAL.session.user.tenantId
			,	srchType  		: srchCode.split("_")[0]		//kw---20240329 고객조회시 각 검색 타입별 암호화 확인하기 위함	
			,	voColId		   	: srchCode.split("_")[1]		//kw---20240329 고객조회시 각 검색 타입별 암호화 확인하기 위함
			,	encryptYn      	: srchCode.split("_")[2]		//kw---20240329 고객조회시 각 검색 타입별 암호화 확인하기 위함
			,	srchTxt    		: srchText
			,	type	   		: 'SEL'
//			,   encryptYn  		: Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1
	};
	
	if(DmnCode) {
		data.custNmSrchkey1 	= null;
		data.custNmSrchkey2 	= null;
		data.unknownCustomer 	= 'N';
		data.encryptYn 			= Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1;
	}
	
	return data;
}

function createGridData(data) {
	
	let len = data.length;
	const map = new Map();
	
	if( len > 0 ) {
		let columns = {};
		for(var i=0; i<len; i++) {
			
			if(map.has(data[i].custId) ) {
				
				if(data[i].mgntItemCd == 'T9001') {
					columns.orgNm = data[i].custItemDataVlu;
				}else if(data[i].mgntItemCd == 'T0002') {
					columns.custNm = data[i].custItemDataVlu;
				}else if(data[i].mgntItemCd=='T0009') {
					columns.mbleTelNo = data[i].custItemDataVlu;
				}else if(data[i].mgntItemCd=='C0172') {
					columns.gndr = data[i].custItemDataVlu;
				}
				
				columns.custId = data[i].custId;
				columns.tenantId  = GLOBAL.session.user.tenantId;
				map.set(data[i].custId, JSON.stringify(columns));
			}else{
				map.set(data[i].custId, JSON.stringify(columns));
			}
		}
		console.log(map);
	}else{
		SYSM434P_gridData.dataSource.data([]);
	}
	
	if(map.size > 0) {
		// Map 객체의 키-값 쌍을 배열로 변환
		let result = [];
		map.keys().forEach(key => {
			result.push(map.get(key));
		});

		// 각 요소에서 역슬래시와 첫 번째 시작 쌍따옴표 및 마지막 쌍따옴표 제거
		let modifiedArray = result.map(element => JSON.parse(element));
//		console.log(JSON.stringify(result));
		SYSM434P_gridData.dataSource.data(modifiedArray);
	}
}