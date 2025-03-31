/***********************************************************************************************
 * Program Name : 카테고리 만들기- 개별권한(KMST130S.js)
 * Creator      : 정대정
 * Create Date  : 2022.05.26
 * Description  : 카테고리 만들기- 개별권한(KMST130S.js)
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.26     정대정           최초작성
 ************************************************************************************************/

var KMST130S_DataSource;
var KMST130S_GetData = [];
var KMST130S_beforeData=[];
var KMST130S_ctgrUseAthtCd="3";

$(document).ready(function() {
	//1.Grid init
	KMST130S_fnGridInit();

	KMST130S_fnSerch();

	KMST130S_fnDefaultHightSetting();

	$(window).on({'resize': function() {KMST130S_fnDefaultHightSetting();}});
})

//======================================================================================================================
//1.Grid init
function KMST130S_fnGridInit(){
	KMST130S_DataSource = {
		transport: {
			read :function (KMST130S_jsonStr) {
				Utils.ajaxCall('/kmst/KMST110SEL01', JSON.stringify(KMST130S_jsonStr), function(result){
						let data =JSON.parse(JSON.parse(JSON.stringify(result.KMST110VOGridInfo)));
						$("#grdKMST130S").data("kendoGrid").dataSource.data(data);
						KMST130S_GetData=[];
						$.each(data,function(index,item){
							KMST130S_GetData.push(item);
						});
					},
					window.kendo.ui.progress($("#grdKMST130S"), true),
					window.kendo.ui.progress($("#grdKMST130S"), false)
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

	$("#grdKMST130S").kendoGrid({
		dataSource: KMST130S_DataSource,
		autoBind: false,
		sortable: false,
		//resizable : true,
		selectable: "multiple, row",
		scrollable: true,
		noRecords: { template: '<div class="nodataMsg"><p>'+KMST130S_langMap.get("grid.nodatafound")+'</p></div>' },
		columns: [
			{
				selectable: true,
				width: 40,
			},
			{
				title: "상태",
				type: "string",
				width: 40,
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
				title: KMST130S_langMap.get("KMST130S.grid.title.OrgNm"),
				field: "athtView",
				template : '#=athtView.split(\':\')[0]#',
				attributes: {
					"class": "k-text-left",
				},
			},{
				title: KMST130S_langMap.get("KMST130S.grid.title.UserID"),
				width: 70,
				field: "athtCd",
				attributes: {
					"class": "k-text-left",
				},
			},{
				title: KMST130S_langMap.get("KMST130S.grid.title.UserNm"),
				width: 70,
				field: "athtView",
				template : '#=athtView.split(\':\')[1]#',
				attributes: {
					"class": "k-text-left",
				},
			},{
				title :KMST130S_langMap.get("KMST130S.grid.title.PermitSetting"),
				columns:[
					{
						field: "rdPmssYn",
						width: 85,
						template : '#=KMST130S_fnSubSetCheckBox(rdPmssYn,"rdPmssYn")#', //data,id
						headerTemplate : kendo.template('#=KMST130S_fnSubHeaderCheckBox("rdPmssYnAll","rdPmssYn",KMST130S_langMap.get("KMST130S.grid.title.Read"))#')
					},{
						width: 85,
						template : '#=KMST130S_fnSubSetCheckBox(writPmssYn,"writPmssYn")#',
						headerTemplate : kendo.template('#=KMST130S_fnSubHeaderCheckBox("writPmssYnAll","writPmssYn",KMST130S_langMap.get("KMST130S.grid.title.Write"))#')
					},{
						field: "corcPmssYn",
						width: 85,
						template : '#=KMST130S_fnSubSetCheckBox(corcPmssYn,"corcPmssYn")#',
						headerTemplate : kendo.template('#=KMST130S_fnSubHeaderCheckBox("corcPmssYnAll","corcPmssYn",KMST130S_langMap.get("KMST130S.grid.title.Edite"))#')
					},{
						field: "delPmssYn",
						width: 85,
						template : '#=KMST130S_fnSubSetCheckBox(delPmssYn,"delPmssYn")#',
						headerTemplate : kendo.template('#=KMST130S_fnSubHeaderCheckBox("delPmssYnAll","delPmssYn",KMST130S_langMap.get("KMST130S.grid.title.Delete"))#')
					},{
						field: "replyPmssYn",
						width: 85,
						template : '#=KMST130S_fnSubSetCheckBox(replyPmssYn,"replyPmssYn")#',
						headerTemplate : kendo.template('#=KMST130S_fnSubHeaderCheckBox("replyPmssYnAll","replyPmssYn",KMST130S_langMap.get("KMST130S.grid.title.Comment"))#')
					},{
						field: "goodPmssYn",
						width: 85,
						template : '#=KMST130S_fnSubSetCheckBox(goodPmssYn,"goodPmssYn")#',
						headerTemplate : kendo.template('#=KMST130S_fnSubHeaderCheckBox("goodPmssYnAll","goodPmssYn",KMST130S_langMap.get("KMST130S.grid.title.Like"))#')
					},{
						field: "apndFileDnldPmssYn",
						width: 85,
						template : '#=KMST130S_fnSubSetCheckBox(apndFileDnldPmssYn,"apndFileDnldPmssYn")#',
						headerTemplate : kendo.template('#=KMST130S_fnSubHeaderCheckBox("apndFileDnldPmssYnAll","apndFileDnldPmssYn",KMST130S_langMap.get("KMST130S.grid.title.Download"))#')
					}
				]
			}
		],
	});
}

function KMST130S_fnDefaultHightSetting(){
	let screenHeight = $(window).height();

	$("#grdKMST130S").data("kendoGrid").element.find('.k-grid-content').css('height', screenHeight-720);   //   (헤더+ 푸터+ 검색 )영역 높이 제외
}

//======================================================================================================================
//Call function - 조회 함수
function KMST130S_fnSerch(){
	if($('#KMST100M input[name=edtCtgrNo]').val()){
		let KMST130_Serch_data = {
			tenantId 	  : GLOBAL.session.user.tenantId,
			ctgrNo    :	$('#KMST100M input[name=edtCtgrNo]').val(),
			ctgrUseAthtCd : KMST130S_ctgrUseAthtCd,
		};
		KMST130S_DataSource.transport.read(KMST130_Serch_data);
	}
}

//======================================================================================================================
//Button Event - 상위 게시판 권한 가져오기
$("#KMST130S button[name=btnUpperAthtGet]").off("click").on("click", function () {
	let hgrkNo = $('#KMST100M input[name=edtCtgrHgrkNo]').val();

	if(hgrkNo === '0'){//상위게시판 없음
		Utils.alert(KMST130S_langMap.get("KMST130S.Message.do.not.Upper.notice.board"));
		return;
	}

	Utils.confirm(KMST130S_langMap.get("KMST130S.Message.do.delete.And.Update.Upper.notice.board"),function (){
		let data = $("#grdKMST130S").data("kendoGrid").dataSource.data();
		KMST130S_beforeData=[];
		$.each(data,function(index,item){
			KMST130S_beforeData.push(item);
		});

		let KMST130_Serch_data = {
			tenantId 	  : GLOBAL.session.user.tenantId,
			ctgrNo    :	hgrkNo,
			ctgrUseAthtCd : KMST130S_ctgrUseAthtCd,
		};
		KMST130S_DataSource.transport.read(KMST130_Serch_data);

	});
});
//Button Event - 권한 추가 (공통코드 찾기 팝업 호출)
$("#KMST130S button[name=btnAddRow]").off("click").on("click", function () {
	Utils.setCallbackFunction("KMST130S_fnKMST130SCallback", KMST130S_fnKMST130SCallback);
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM212P", "SYSM212P" , 400, 610,  {callbackKey: "KMST130S_fnKMST130SCallback"});
});
//Call Back function - Add Row (공통 코드 찾기 팝업 호출 콜백)
function KMST130S_fnKMST130SCallback(data){
	let dataSource= $("#grdKMST130S").data("kendoGrid").dataSource.data();
	let ctgrNo = $('#KMST100M input[name=edtCtgrNo]').val();
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
				let idx =$("#grdKMST130S").data("kendoGrid").dataSource.data().length;
				let view = itemP.orgPath+":"+itemP.usrNm;
				KMST130S_fnSubGridAddRow(idx,GLOBAL.session.user.tenantId,ctgrNo*= 1,itemP.usrId,view); //*= 1 --> String ->num 변환
			}
		});
	}else{//기존에 아무것도 없는경우
		$.each(data, function (indexP, itemP){
			let idx =$("#grdKMST130S").data("kendoGrid").dataSource.data().length;
			let view = itemP.orgPath+":"+itemP.usrNm;
			KMST130S_fnSubGridAddRow(idx,GLOBAL.session.user.tenantId,ctgrNo*= 1,itemP.usrId,view);
		});
	}
}
//Button Event - 권한 저장
$("#KMST130S button[name=btnSave]").off("click").on("click", function () {
	let selRows = Object.assign({}, $("#grdKMST130S").data("kendoGrid").dataSource.data());
	// let selRows = [];
	// let selRow = $("#grdKMST130S").data("kendoGrid").select();
	//
	// $(selRow).each(function(index,item){
	// 	selRows.push($("#grdKMST130S").data("kendoGrid").dataItem(item));
	// });

	let regInfo = {
		regrId: GLOBAL.session.user.usrId,
		regrOrgCd: GLOBAL.session.user.orgCd
	};
	let lstInfo = {
		lstCorprId: GLOBAL.session.user.usrId,
		lstCorprOrgCd: GLOBAL.session.user.orgCd
	};

	let ctgrNo = $('#KMST100M input[name=edtCtgrNo]').val();
	let insctgrNo ={
		ctgrNo : ctgrNo*=1,
		athtSeq	   : -1
	};

	if(selRows.length >0){//기존데이터가 있는경우
		Utils.confirm(KMST130S_langMap.get("KMST130S.Message.do.you.want.save"),function(){
			if(KMST130S_beforeData.length >0)
			{
				let KMST130_del_data = {
					list 	  	  : KMST130S_beforeData,
					ctgrUseAthtCd : KMST130S_ctgrUseAthtCd,
				};
				//ajax
				Utils.ajaxCall('/kmst/KMST110DEL01', JSON.stringify(KMST130_del_data));

			}
			let saveData = [];

			$.each(selRows,function(indexS,itemS){
				if(ctgrNo !== itemS.ctgrNo){//상위조직 데이터
					$.extend(itemS, insctgrNo,regInfo,lstInfo);
					saveData.push(itemS);
				}else if(Utils.isNull(itemS.athtSeq)){ //새로 저장된 데이터
					itemS.athtSeq = -1;
					$.extend(itemS,regInfo,lstInfo);
					saveData.push(itemS);
				}else{ //수정된데이터
					$.each(KMST130S_GetData,function(indexG,itemG){
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
				let KMST130_save_data = {
					list 	  	  : saveData,
					ctgrUseAthtCd : KMST130S_ctgrUseAthtCd,
				};
				//ajax
				Utils.ajaxCall('/kmst/KMST110INS01', JSON.stringify(KMST130_save_data),KMST130S_fnCallBackReulst);
			}
		});

	}else{//기존에 아무것도 없는경우
		Utils.alert(KMST130S_langMap.get("KMST130S.Message.not.select.item"));
	}
});
//Button Event - 권한 삭제
$("#KMST130S button[name=btnDelete]").off("click").on("click", function () {
	let selRow = $("#grdKMST130S").data("kendoGrid").select();

	if (selRow.length <= 0) {//기존에 아무것도 없는경우
		Utils.alert(KMST130S_langMap.get("KMST130S.Message.not.select.item"));
	}else{
		Utils.confirm(KMST130S_langMap.get("KMST130S.Message.do.you.want.delete"),function (){
			let delData = [];
			$(selRow).each(function(index,item){

				if($("#grdKMST130S").data("kendoGrid").dataItem(item).athtSeq >0){ //기존 데이터
					delData.push($("#grdKMST130S").data("kendoGrid").dataItem(item));
				}else{ //그리드 로우 추가만된 데이터
					$("#grdKMST130S").data("kendoGrid").removeRow(item);
				}
			});

			let KMST130_del_data = {
				list 	  	  : delData,
				ctgrUseAthtCd : KMST130S_ctgrUseAthtCd,
			};
			//ajax
			Utils.ajaxCall('/kmst/KMST110DEL01', JSON.stringify(KMST130_del_data),KMST130S_fnCallBackReulst);
		});
	}
});

//Call Back - 저장,삭제 콜백 처리 Function
function KMST130S_fnCallBackReulst(result){
	Utils.alert(result.msg);

	if(result.result>0){
		KMST130S_fnSerch();
	}
}

//======================================================================================================================
//Subfunction - Coulme Header Template
function KMST130S_fnSubHeaderCheckBox(name,field,title){
	return '<label><input type="checkbox" name="'+name+'" onclick="KMST130S_fnSubHeaderAllCheckBoxClick(this,\''+field+'\')" class="k-checkbox k-checkbox-md k-rounded-md" >  '+ title +'</label>';
}
//Subfunction - Coulme Header Click Event
function KMST130S_fnSubHeaderAllCheckBoxClick(obj,parm){
	let checked = $(obj).is(':checked');
	let items = $("#grdKMST130S").data("kendoGrid").dataSource.data();
	$.each(items,function (index,item) {
		if(checked){
			item.set(parm, "Y");
		}else{
			item.set(parm, "N");
		}
	})
}
//Subfunction - Check Box Data Set
function KMST130S_fnSubSetCheckBox(item,field){
	let input;
	if(item === "Y"){
		input = '<span class="swithCheck"><input type="checkbox" onclick="KMST130S_fnSubCheckBoxClick(this,\''+field+'\')" checked/><label></label></span>'
		//input = '<input type="checkbox" name="'+field+'" onclick="KMST130S_fnSubCheckBoxClick(this,\''+field+'\')"  checked data-role="checkbox" class="k-checkbox k-checkbox-md k-rounded-md">';
	}else{
		input = '<span class="swithCheck"><input type="checkbox" onclick="KMST130S_fnSubCheckBoxClick(this,\''+field+'\')" /><label></label></span>'
		//input = '<input type="checkbox" name="'+field+'" onclick="KMST130S_fnSubCheckBoxClick(this,\''+field+'\')"  data-role="checkbox" class="k-checkbox k-checkbox-md k-rounded-md">';
	}
	return input;
}
//Subfunction - Check Box Click Event
function KMST130S_fnSubCheckBoxClick(obj,field){
	let checked = $(obj).is(":checked");
	let tr = $(obj).closest("tr");
	let item = $("#grdKMST130S").data("kendoGrid").dataItem(tr);
	if(checked){
		item.set(field, "Y");
	}else{
		item.set(field, "N");
	}
}
//Subfunction - Grid Add Row
function KMST130S_fnSubGridAddRow(idx,tenantId,ctgrNo,athtCd,athtView){
	$("#grdKMST130S").data("kendoGrid").dataSource.insert(idx,{
		tenantId           : tenantId,
		ctgrNo         : ctgrNo,
		athtSeq            : "",
		ctgrUseAthtCd      : KMST130S_ctgrUseAthtCd,
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