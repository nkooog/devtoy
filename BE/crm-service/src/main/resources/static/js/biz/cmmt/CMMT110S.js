/***********************************************************************************************
 * Program Name : 게시판 만들기- 조직권한(CMMT110S.js)
 * Creator      : 정대정
 * Create Date  : 2022.05.03
 * Description  : 게시판 만들기- 조직권한(CMMT110S.js)
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.03     정대정           최초작성
 ************************************************************************************************/

var CMMT110S_DataSource;
var CMMT110S_GetData = [];
var CMMT110S_beforeData=[];
var CMMT110S_ctgrUseAthtCd="1";
var CMMT110S_grid = new Array(1);

$(document).ready(function() {
	////1.Grid init
	//1. 그리드 설정
    for (let i = 0; i < CMMT110S_grid.length; i++) {
    	CMMT110S_grid[i] = {
            record: 0,
            instance: new Object(),
            dataSource: new Object(),
            currentItem: new Object(),
            currentCellIndex: new Number(),
            selectedItems: new Array(),
            checkedRows: new Array(),
            loadCount: 0
        }
    }
    
	CMMT110S_fnGridInit();

	CMMT110S_fnSerch();

	CMMT110S_fnDefaultHightSetting();

	$(window).on({'resize': function() {CMMT110S_fnDefaultHightSetting();}});
});


//======================================================================================================================
//1.Grid init
function CMMT110S_fnGridInit(){
	CMMT110S_DataSource = {
		transport: {
			read :function (CMMT110S_jsonStr) {
				Utils.ajaxCall('/cmmt/CMMT110SEL01', JSON.stringify(CMMT110S_jsonStr), function(result){
					let data =JSON.parse(JSON.parse(JSON.stringify(result.CMMT110VOGridInfo)));
					$("#grdCMMT110S").data("kendoGrid").dataSource.data(data);
						CMMT110S_GetData=[];
						$.each(data,function(index,item){
							CMMT110S_GetData.push(item);
						});
					},
					window.kendo.ui.progress($("#grdCMMT110S"), true),
					window.kendo.ui.progress($("#grdCMMT110S"), false)
				);
			}
		},
		schema : {
			type: "json",
			model: {
				id: "athtSeq",
				fields: {
				}
			}
		}
	}

	CMMT110S_grid[0] = $("#grdCMMT110S").kendoGrid({
		dataSource: CMMT110S_DataSource,
		autoBind: false,
		sortable: false,
		//resizable : true,
		selectable: "multiple, row",
		scrollable: true,
		noRecords: { template: '<div class="nodataMsg"><p>'+CMMT110S_langMap.get("grid.nodatafound")+'</p></div>' },
		columns: [
			{
				field: "athtCd", hidden: true //shpark 20240828 : 통합게시판 상세보기 시 header 밀림 방지
			},
			{
				selectable: true,
				width: 30,
			},
			{
				title: CMMT110S_langMap.get("CMMT110S.grid.status"),
				type: "string",
				width: 50,
				template: function (dataItem) {
					let html = "";
					if (dataItem.isNew()) {
						html = "<img src='" + GLOBAL.contextPath + "/images/contents/btn_new.png' style='vertical-align:middle'>";
					} else if (dataItem.dirty) {
						html = "<img src='" + GLOBAL.contextPath + "/images/contents/btn_modify.png' style='vertical-align:middle'>";
					}

					return html;
				},
			},
			{
				title: CMMT110S_langMap.get("CMMT110S.grid.title.OrgNm"),
				field: "athtView",
				attributes: {"class": "k-text-left"},
			},{
				title :CMMT110S_langMap.get("CMMT110S.grid.title.PermitSetting"),
				columns:[
					{
						field: "rdPmssYn",
						width: 85,
						template : '#=CMMT110S_fnSubSetCheckBox(rdPmssYn,"rdPmssYn")#', //data,id
						headerTemplate : kendo.template('#=CMMT110S_fnSubHeaderCheckBox("rdPmssYnAll","rdPmssYn",CMMT110S_langMap.get("CMMT110S.grid.title.Read"))#')
					},{
						field: "writPmssYn",
						width: 85,
						template : '#=CMMT110S_fnSubSetCheckBox(writPmssYn,"writPmssYn")#',
						headerTemplate : kendo.template('#=CMMT110S_fnSubHeaderCheckBox("writPmssYnAll","writPmssYn",CMMT110S_langMap.get("CMMT110S.grid.title.Write"))#')
					},{
						field: "corcPmssYn",
						width: 85,
						template : '#=CMMT110S_fnSubSetCheckBox(corcPmssYn,"corcPmssYn")#',
						headerTemplate : kendo.template('#=CMMT110S_fnSubHeaderCheckBox("corcPmssYnAll","corcPmssYn",CMMT110S_langMap.get("CMMT110S.grid.title.Edite"))#')
					},{
						field: "delPmssYn",
						width: 85,
						template : '#=CMMT110S_fnSubSetCheckBox(delPmssYn,"delPmssYn")#',
						headerTemplate : kendo.template('#=CMMT110S_fnSubHeaderCheckBox("delPmssYnAll","delPmssYn",CMMT110S_langMap.get("CMMT110S.grid.title.Delete"))#')
					},{
						field: "replyPmssYn",
						width: 85,
						template : '#=CMMT110S_fnSubSetCheckBox(replyPmssYn,"replyPmssYn")#',
						headerTemplate : kendo.template('#=CMMT110S_fnSubHeaderCheckBox("replyPmssYnAll","replyPmssYn",CMMT110S_langMap.get("CMMT110S.grid.title.Comment"))#')
					},{
						field: "goodPmssYn",
						width: 85,
						template : '#=CMMT110S_fnSubSetCheckBox(goodPmssYn,"goodPmssYn")#',
						headerTemplate : kendo.template('#=CMMT110S_fnSubHeaderCheckBox("goodPmssYnAll","goodPmssYn",CMMT110S_langMap.get("CMMT110S.grid.title.Like"))#')
					},{
						field: "apndFileDnldPmssYn",
						width: 85,
						template : '#=CMMT110S_fnSubSetCheckBox(apndFileDnldPmssYn,"apndFileDnldPmssYn")#',
						headerTemplate : kendo.template('#=CMMT110S_fnSubHeaderCheckBox("apndFileDnldPmssYnAll","apndFileDnldPmssYn",CMMT110S_langMap.get("CMMT110S.grid.title.Download"))#')
					}
				]
			},
		],
	}).data("kendoGrid");
}


function CMMT110S_fnDefaultHightSetting(){
	let screenHeight = $(window).height();

	$("#grdCMMT110S").data("kendoGrid").element.find('.k-grid-content').css('height', screenHeight-755);   //   (헤더+ 푸터+ 검색 )영역 높이 제외
}
//======================================================================================================================
//Call function - 조회 함수
function CMMT110S_fnSerch(){
	if($('#CMMT100M input[name=edtCtgrMgntNo]').val()){
		let CMMT110_Serch_data = {
			tenantId 	  : GLOBAL.session.user.tenantId,
			ctgrMgntNo    :	$('#CMMT100M input[name=edtCtgrMgntNo]').val(),
			ctgrUseAthtCd : CMMT110S_ctgrUseAthtCd,
		};
		CMMT110S_DataSource.transport.read(CMMT110_Serch_data);
	}
}

//======================================================================================================================
//Button Event - 상위 게시판 권한 가져오기
$("#CMMT110S button[name=btnUpperAthtGet]").off("click").on("click", function () {
	
	let ctgrNewCheck = CMMT100M_fnCtgrNewCheck();
	if(ctgrNewCheck){
		return;
	}
	
	let hgrkMgntNo = $('#CMMT100M input[name=edtCtgrHgrkMgntNo]').val();

	if(hgrkMgntNo === '0'){//상위게시판 없음
		Utils.alert(CMMT110S_langMap.get("CMMT110S.Message.do.not.Upper.notice.board"));
		return;
	}

	Utils.confirm(CMMT110S_langMap.get("CMMT110S.Message.do.delete.And.Update.Upper.notice.board"),function (){
		let data = $("#grdCMMT110S").data("kendoGrid").dataSource.data();
		CMMT110S_beforeData=[];
		$.each(data,function(index,item){
			CMMT110S_beforeData.push(item);
		});

		let CMMT110_Serch_data = {
			tenantId 	  : GLOBAL.session.user.tenantId,
			ctgrMgntNo    :	hgrkMgntNo,
			ctgrUseAthtCd : CMMT110S_ctgrUseAthtCd,
		};
		CMMT110S_DataSource.transport.read(CMMT110_Serch_data);

	});
});
//Button Event - 권한 추가 (조직찾기 팝업 호출)
$("#CMMT110S button[name=btnAddRow]").off("click").on("click", function () {
	
	let ctgrNewCheck = CMMT100M_fnCtgrNewCheck();
	if(ctgrNewCheck){
		return;
	}
	
	Utils.setCallbackFunction("CMMT110S_fnCMMT110SCallback", CMMT110S_fnCMMT110SCallback);
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM210P", "SYSM210P" , 400, 610,  {callbackKey: "CMMT110S_fnCMMT110SCallback"});
});
//Call Back function - Add Row (조직찾기 팝업 호출 콜백)
function CMMT110S_fnCMMT110SCallback(data){
	let dataSource= $("#grdCMMT110S").data("kendoGrid").dataSource.data();
	let ctgrMgntNo = $('#CMMT100M input[name=edtCtgrMgntNo]').val();
	if(dataSource.length >0){//기존데이터가 있는경우
		$.each(data, function (indexP, itemP){
			let isSame = false;
			$.each(dataSource, function (indexD, itemD){
				if(itemD.athtCd===itemP.orgCd) {//기존에 같은게 있는지 체크
					isSame=true;
					return false;
				}
			});
			if(!isSame){//addRow
				let idx =$("#grdCMMT110S").data("kendoGrid").dataSource.data().length;
				CMMT110S_fnSubGridAddRow(idx,GLOBAL.session.user.tenantId,ctgrMgntNo*= 1,itemP.orgCd,itemP.orgPath); //*= 1 --> String ->num 변환
			}
		});
	}else{//기존에 아무것도 없는경우
		$.each(data, function (indexP, itemP){
			let idx =$("#grdCMMT110S").data("kendoGrid").dataSource.data().length;
			CMMT110S_fnSubGridAddRow(idx,GLOBAL.session.user.tenantId,ctgrMgntNo*= 1,itemP.orgCd,itemP.orgPath);
		});
	}
}
//Button Event - 권한 저장
$("#CMMT110S button[name=btnSave]").off("click").on("click", function () {
	
	let ctgrNewCheck = CMMT100M_fnCtgrNewCheck();
	if(ctgrNewCheck){
		return;
	}
	
	let selRows = Object.assign({}, $("#grdCMMT110S").data("kendoGrid").dataSource.data());
	// let selRow = $("#grdCMMT110S").data("kendoGrid").dataSource.data();
	//
	// $(selRow).each(function(index,item){
	// 	selRows.push($("#grdCMMT110S").data("kendoGrid").dataItem(item));
	// });

	let regInfo = {
		regrId: GLOBAL.session.user.usrId,
		regrOrgCd: GLOBAL.session.user.orgCd
	};
	let lstInfo = {
		lstCorprId: GLOBAL.session.user.usrId,
		lstCorprOrgCd: GLOBAL.session.user.orgCd
	};

	let ctgrMgntNo = $('#CMMT100M input[name=edtCtgrMgntNo]').val();
	let insctgrMgntNo ={
		ctgrMgntNo : ctgrMgntNo*=1,
		athtSeq	   : -1
	};

	if(selRows.length >0){//기존데이터가 있는경우
		Utils.confirm(CMMT110S_langMap.get("CMMT110S.Message.do.you.want.save"),function(){
			if(CMMT110S_beforeData.length >0)
			{
				let CMMT110_del_data = {
					list 	  	  : CMMT110S_beforeData,
					ctgrUseAthtCd : CMMT110S_ctgrUseAthtCd,
				};
				//ajax
				Utils.ajaxCall('/cmmt/CMMT110DEL01', JSON.stringify(CMMT110_del_data));

			}
			let saveData = [];

			$.each(selRows,function(indexS,itemS){
				if(ctgrMgntNo !== itemS.ctgrMgntNo){//상위조직 데이터
					$.extend(itemS, insctgrMgntNo,regInfo,lstInfo);
					saveData.push(itemS);
				}else if(Utils.isNull(itemS.athtSeq)){ //새로 저장된 데이터
					itemS.athtSeq = -1;
					$.extend(itemS,regInfo,lstInfo);
					saveData.push(itemS);
				}else{ //수정된데이터
					$.each(CMMT110S_GetData,function(indexG,itemG){
						if(itemG.athtSeq===itemS.athtSeq){
							if (!(itemG.rdPmssYn === itemS.rdPmssYn && itemG.writPmssYn === itemS.writPmssYn &&
								itemG.corcPmssYn === itemS.corcPmssYn && itemG.delPmssYn === itemS.delPmssYn &&
								itemG.replyPmssYn === itemS.replyPmssYn && itemG.goodPmssYn === itemS.goodPmssYn &&
								itemG.apndFileDnldPmssYn === itemS.apndFileDnldPmssYn)) {
								$.extend(itemS, lstInfo);
								saveData.push(itemS);
								return true;
							}
						}

					})
				}
			})

			if(saveData.length > 0){
				let CMMT110_save_data = {
					list 	  	  : saveData,
					ctgrUseAthtCd : CMMT110S_ctgrUseAthtCd,
				};
				//ajax
				Utils.ajaxCall('/cmmt/CMMT110INS01', JSON.stringify(CMMT110_save_data),CMMT110S_fnCallBackReulst);
			}
		});

	}else{//기존에 아무것도 없는경우
		Utils.alert(CMMT110S_langMap.get("CMMT110S.Message.not.select.item"));
	}
});
//Button Event - 권한 삭제
$("#CMMT110S button[name=btnDelete]").off("click").on("click", function () {
	
	let ctgrNewCheck = CMMT100M_fnCtgrNewCheck();
	if(ctgrNewCheck){
		return;
	}
	
	let selRow = $("#grdCMMT110S").data("kendoGrid").select();

	if (selRow.length <= 0) {//기존에 아무것도 없는경우
		Utils.alert(CMMT110S_langMap.get("CMMT110S.Message.not.select.item"));
	}else{
		Utils.confirm(CMMT110S_langMap.get("CMMT110S.Message.do.you.want.delete"),function (){
			let delData = [];
			$(selRow).each(function(index,item){
				if($("#grdCMMT110S").data("kendoGrid").dataItem(item).athtSeq >0){ //기존 데이터
					delData.push($("#grdCMMT110S").data("kendoGrid").dataItem(item));
				}else{ //그리드 로우 추가만된 데이터
					$("#grdCMMT110S").data("kendoGrid").removeRow(item);
				}
			});

			if(delData.length>0){
				let CMMT110_del_data = {
					list 	  	  : delData,
					ctgrUseAthtCd : CMMT110S_ctgrUseAthtCd,
				};
				//ajax
				Utils.ajaxCall('/cmmt/CMMT110DEL01', JSON.stringify(CMMT110_del_data),CMMT110S_fnCallBackReulst);
			}
		});
	}
});

//Call Back - 저장,삭제 콜백 처리 Function
function CMMT110S_fnCallBackReulst(result){
	Utils.alert(result.msg);
	if(result.result>0){
		CMMT110S_fnSerch();
	}
}

//======================================================================================================================
//Subfunction - Coulme Header Template
function CMMT110S_fnSubHeaderCheckBox(name,field,title){
	return '<label><input type="checkbox" name="'+name+'" onclick="CMMT110S_fnSubHeaderAllCheckBoxClick(this,\''+field+'\')" class="k-checkbox k-checkbox-md k-rounded-md" >  '+ title +'</label>';
}
//Subfunction - Coulme Header Click Event
function CMMT110S_fnSubHeaderAllCheckBoxClick(obj,parm){
	let checked = $(obj).is(':checked');
	let items = $("#grdCMMT110S").data("kendoGrid").dataSource.data();
	$.each(items,function (index,item) {
		if(checked){
			item.set(parm, "Y");
		}else{
			item.set(parm, "N");
		}
	})
}
//Subfunction - Check Box Data Set
function CMMT110S_fnSubSetCheckBox(item,field){
	let input;
	if(item === "Y"){
		input = '<span class="swithCheck"><input type="checkbox" onclick="CMMT110S_fnSubCheckBoxClick(this,\''+field+'\')" checked/><label></label></span>'
	}else{
		input = '<span class="swithCheck"><input type="checkbox" onclick="CMMT110S_fnSubCheckBoxClick(this,\''+field+'\')" /><label></label></span>'
	}
	return input;
}
//Subfunction - Check Box Click Event
function CMMT110S_fnSubCheckBoxClick(obj,field){
	let checked = $(obj).is(":checked");
	let tr = $(obj).closest("tr");
	let item = $("#grdCMMT110S").data("kendoGrid").dataItem(tr);
	if(checked){
		item.set(field, "Y");
	}else{
		item.set(field, "N");
	}
}
//Subfunction - Grid Add Row
function CMMT110S_fnSubGridAddRow(idx,tenantId,ctgrMgntNo,athtCd,athtView){
	$("#grdCMMT110S").data("kendoGrid").dataSource.insert(idx,{
		tenantId           : tenantId,
		ctgrMgntNo         : ctgrMgntNo,
		athtSeq            : "",
		ctgrUseAthtCd      : CMMT110S_ctgrUseAthtCd,
		athtCd             : athtCd,
		athtView           : athtView,
		rdPmssYn           : "N",
		writPmssYn         : "N",
		corcPmssYn         : "N",
		delPmssYn          : "N",
		replyPmssYn        : "N",
		goodPmssYn         : "N",
		apndFileDnldPmssYn : "N",
	})
}