/***********************************************************************************************
 * Program Name : 게시판 만들기- 등급권한(CMMT120S.js)
 * Creator      : 정대정
 * Create Date  : 2022.05.10
 * Description  : 게시판 만들기- 등급권한(CMMT120S.js)
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.10     정대정           최초작성
 ************************************************************************************************/

var CMMT120S_DataSource;
var CMMT120S_GetData = [];
var CMMT120S_beforeData=[];
var CMMT120S_ctgrUseAthtCd="2";

$(document).ready(function() {
	//1.Grid init
	CMMT120S_fnGridInit();

	CMMT120S_fnSerch();

	CMMT120S_fnDefaultHightSetting();

	$(window).on({'resize': function() {CMMT120S_fnDefaultHightSetting();}});
})

//======================================================================================================================
//1.Grid init
function CMMT120S_fnGridInit(){
	CMMT120S_DataSource = {
		transport: {
			read :function (CMMT120S_jsonStr) {
				Utils.ajaxCall('/cmmt/CMMT110SEL01', JSON.stringify(CMMT120S_jsonStr), function(result){
						let data =JSON.parse(JSON.parse(JSON.stringify(result.CMMT110VOGridInfo)));
						$("#grdCMMT120S").data("kendoGrid").dataSource.data(data);
						CMMT120S_GetData=[];
						$.each(data,function(index,item){
							CMMT120S_GetData.push(item);
						});
					},
					window.kendo.ui.progress($("#grdCMMT120S"), true),
					window.kendo.ui.progress($("#grdCMMT120S"), false)
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

	$("#grdCMMT120S").kendoGrid({
		dataSource: CMMT120S_DataSource,
		autoBind: false,
		sortable: false,
		//resizable : true,
		selectable: "multiple, row",
		scrollable: true,
		noRecords: { template: '<div class="nodataMsg"><p>'+CMMT120S_langMap.get("grid.nodatafound")+'</p></div>' },
		columns: [
			{
				field: "athtCd", hidden: true //shpark 20240828 : 통합게시판 상세보기 시 header 밀림 방지
			},
			{
				selectable: true,
				width: 30,
			},
			{
				title: CMMT120S_langMap.get("CMMT120S.grid.status"),
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
				title: CMMT120S_langMap.get("CMMT120S.grid.title.Rating"),
				field: "athtView",
				attributes: {"class": "k-text-left"},
			},{
				title :CMMT120S_langMap.get("CMMT120S.grid.title.PermitSetting"),
				columns:[
					{
						field: "rdPmssYn",
						width: 85,
						template : '#=CMMT120S_fnSubSetCheckBox(rdPmssYn,"rdPmssYn")#', //data,id
						headerTemplate : kendo.template('#=CMMT120S_fnSubHeaderCheckBox("rdPmssYnAll","rdPmssYn",CMMT120S_langMap.get("CMMT120S.grid.title.Read"))#')
					},{
						width: 85,
						field: "writPmssYn",
						template : '#=CMMT120S_fnSubSetCheckBox(writPmssYn,"writPmssYn")#',
						headerTemplate : kendo.template('#=CMMT120S_fnSubHeaderCheckBox("writPmssYnAll","writPmssYn",CMMT120S_langMap.get("CMMT120S.grid.title.Write"))#')
					},{
						field: "corcPmssYn",
						width: 85,
						template : '#=CMMT120S_fnSubSetCheckBox(corcPmssYn,"corcPmssYn")#',
						headerTemplate : kendo.template('#=CMMT120S_fnSubHeaderCheckBox("corcPmssYnAll","corcPmssYn",CMMT120S_langMap.get("CMMT120S.grid.title.Edite"))#')
					},{
						field: "delPmssYn",
						width: 85,
						template : '#=CMMT120S_fnSubSetCheckBox(delPmssYn,"delPmssYn")#',
						headerTemplate : kendo.template('#=CMMT120S_fnSubHeaderCheckBox("delPmssYnAll","delPmssYn",CMMT120S_langMap.get("CMMT120S.grid.title.Delete"))#')
					},{
						field: "replyPmssYn",
						width: 85,
						template : '#=CMMT120S_fnSubSetCheckBox(replyPmssYn,"replyPmssYn")#',
						headerTemplate : kendo.template('#=CMMT120S_fnSubHeaderCheckBox("replyPmssYnAll","replyPmssYn",CMMT120S_langMap.get("CMMT120S.grid.title.Comment"))#')
					},{
						field: "goodPmssYn",
						width: 85,
						template : '#=CMMT120S_fnSubSetCheckBox(goodPmssYn,"goodPmssYn")#',
						headerTemplate : kendo.template('#=CMMT120S_fnSubHeaderCheckBox("goodPmssYnAll","goodPmssYn",CMMT120S_langMap.get("CMMT120S.grid.title.Like"))#')
					},{
						field: "apndFileDnldPmssYn",
						width: 85,
						template : '#=CMMT120S_fnSubSetCheckBox(apndFileDnldPmssYn,"apndFileDnldPmssYn")#',
						headerTemplate : kendo.template('#=CMMT120S_fnSubHeaderCheckBox("apndFileDnldPmssYnAll","apndFileDnldPmssYn",CMMT120S_langMap.get("CMMT120S.grid.title.Download"))#')
					}
				]
			}
		],
	});
}
function CMMT120S_fnDefaultHightSetting(){
	let screenHeight = $(window).height();

	$("#grdCMMT120S").data("kendoGrid").element.find('.k-grid-content').css('height', screenHeight-755);   //   (헤더+ 푸터+ 검색 )영역 높이 제외
}
//======================================================================================================================
//Call function - 조회 함수
function CMMT120S_fnSerch(){
	if($('#CMMT100M input[name=edtCtgrMgntNo]').val()){
		let CMMT120_Serch_data = {
			tenantId 	  : GLOBAL.session.user.tenantId,
			ctgrMgntNo    :	$('#CMMT100M input[name=edtCtgrMgntNo]').val(),
			ctgrUseAthtCd : CMMT120S_ctgrUseAthtCd,
		};
		CMMT120S_DataSource.transport.read(CMMT120_Serch_data);
	}
}

//======================================================================================================================
//Button Event - 상위 게시판 권한 가져오기
$("#CMMT120S button[name=btnUpperAthtGet]").off("click").on("click", function () {
	let hgrkMgntNo = $('#CMMT100M input[name=edtCtgrHgrkMgntNo]').val();

	if(hgrkMgntNo === '0'){//상위게시판 없음
		Utils.alert(CMMT120S_langMap.get("CMMT120S.Message.do.not.Upper.notice.board"));
		return;
	}

	Utils.confirm(CMMT120S_langMap.get("CMMT120S.Message.do.delete.And.Update.Upper.notice.board"),function (){
		let data = $("#grdCMMT120S").data("kendoGrid").dataSource.data();
		CMMT120S_beforeData=[];
		$.each(data,function(index,item){
			CMMT120S_beforeData.push(item);
		});

		let CMMT120_Serch_data = {
			tenantId 	  : GLOBAL.session.user.tenantId,
			ctgrMgntNo    :	hgrkMgntNo,
			ctgrUseAthtCd : CMMT120S_ctgrUseAthtCd,
		};
		CMMT120S_DataSource.transport.read(CMMT120_Serch_data);

	});
});
//Button Event - 권한 추가 (공통코드 찾기 팝업 호출)
$("#CMMT120S button[name=btnAddRow]").off("click").on("click", function () {

	let param = {
		mgntItemCd:"C0024",
		isMulti : "Y",
		callbackKey: "CMMT120S_fnCMMT120SCallback"
	};

	Utils.setCallbackFunction("CMMT120S_fnCMMT120SCallback", CMMT120S_fnCMMT120SCallback);
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM335P", "SYSM335P" , 750, 600,  param);
});
//Call Back function - Add Row (공통 코드 찾기 팝업 호출 콜백)
function CMMT120S_fnCMMT120SCallback(data){
	let dataSource= $("#grdCMMT120S").data("kendoGrid").dataSource.data();
	let ctgrMgntNo = $('#CMMT100M input[name=edtCtgrMgntNo]').val();
	if(dataSource.length >0){//기존데이터가 있는경우
		$.each(data, function (indexP, itemP) {
			let isSame = false;
			$.each(dataSource, function (indexD, itemD) {
				if (itemD.athtCd === itemP.comCd) {//기존에 같은게 있는지 체크
					isSame = true;
					return false;
				}
			});
			if (!isSame) {//addRow
				let idx = $("#grdCMMT120S").data("kendoGrid").dataSource.data().length;
				CMMT120S_fnSubGridAddRow(idx, GLOBAL.session.user.tenantId, ctgrMgntNo *= 1, itemP.comCd, itemP.comCdNm); //*= 1 --> String ->num 변환
			}
		});
	}else{//기존에 아무것도 없는경우
		$.each(data, function (indexP, itemP){
	 		let idx =$("#grdCMMT120S").data("kendoGrid").dataSource.data().length;
	 		CMMT120S_fnSubGridAddRow(idx,GLOBAL.session.user.tenantId,ctgrMgntNo*= 1,itemP.comCd,itemP.comCdNm);
		});
	 }
}
//Button Event - 권한 저장
$("#CMMT120S button[name=btnSave]").off("click").on("click", function () {
	let selRows = Object.assign({}, $("#grdCMMT120S").data("kendoGrid").dataSource.data());
	// let selRows = [];
	// let selRow = $("#grdCMMT120S").data("kendoGrid").select();
	//
	// $(selRow).each(function(index,item){
	// 	selRows.push($("#grdCMMT120S").data("kendoGrid").dataItem(item));
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
		Utils.confirm(CMMT120S_langMap.get("CMMT120S.Message.do.you.want.save"),function(){
			if(CMMT120S_beforeData.length >0)
			{
				let CMMT120_del_data = {
					list 	  	  : CMMT120S_beforeData,
					ctgrUseAthtCd : CMMT120S_ctgrUseAthtCd,
				};
				//ajax
				Utils.ajaxCall('/cmmt/CMMT110DEL01', JSON.stringify(CMMT120_del_data));

			}
			let saveData = [];

			$.each(selRows,function(indexS,itemS){
				if(ctgrMgntNo !== itemS.ctgrMgntNo){//상위조직 데이터
					$.extend(itemS, insctgrMgntNo,regInfo,lstInfo);
					saveData.push(itemS);
				}else if(Utils.isNull(itemS.athtSeq)){ //새로 저장된 데이터
					itemS.athtSeq = -1; //새로 저장된 데이터
					$.extend(itemS,regInfo,lstInfo);
					saveData.push(itemS);
				}else{ //수정된데이터
					$.each(CMMT120S_GetData,function(indexG,itemG){
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
				let CMMT120_save_data = {
					list 	  	  : saveData,
					ctgrUseAthtCd : CMMT120S_ctgrUseAthtCd,
				};
				//ajax
				Utils.ajaxCall('/cmmt/CMMT110INS01', JSON.stringify(CMMT120_save_data),CMMT120S_fnCallBackReulst);
			}
		});

	}else{//기존에 아무것도 없는경우
		Utils.alert(CMMT120S_langMap.get("CMMT120S.Message.not.select.item"));
	}
});
//Button Event - 권한 삭제
$("#CMMT120S button[name=btnDelete]").off("click").on("click", function () {
	let selRow = $("#grdCMMT120S").data("kendoGrid").select();

	if (selRow.length <= 0) {//기존에 아무것도 없는경우
		Utils.alert(CMMT120S_langMap.get("CMMT120S.Message.not.select.item"));
	}else{
		let checkRtn = false;
		Utils.confirm(CMMT120S_langMap.get("CMMT120S.Message.do.you.want.delete"),function (){
			let delData = [];
			$(selRow).each(function(index,item){
				let delItem = $("#grdCMMT120S").data("kendoGrid").dataItem(item)
				if(delItem.ctgrUseAthtCd == "2" && (delItem.athtCd=='900' || delItem.athtCd=='910' || delItem.athtCd=='400')) {
					Utils.alert(CMMT120S_langMap.get("CMMT120S.Message.Permissions.cannot.be.deleted"));
					checkRtn = true;
					return;
				}
				if($("#grdCMMT120S").data("kendoGrid").dataItem(item).athtSeq >0){ //기존 데이터
					delData.push(delItem);
				}else{ //그리드 로우 추가만된 데이터
					$("#grdCMMT120S").data("kendoGrid").removeRow(item);
				}
			});
			if(!checkRtn){
				let CMMT120_del_data = {
					list 	  	  : delData,
					ctgrUseAthtCd : CMMT120S_ctgrUseAthtCd,
				};
				//ajax
				 Utils.ajaxCall('/cmmt/CMMT110DEL01', JSON.stringify(CMMT120_del_data),CMMT120S_fnCallBackReulst);
			}
		});
	}
});

//Call Back - 저장,삭제 콜백 처리 Function
function CMMT120S_fnCallBackReulst(result){
	Utils.alert(result.msg);

	if(result.result>0){
		CMMT120S_fnSerch();
	}
}

//======================================================================================================================
//Subfunction - Coulme Header Template
function CMMT120S_fnSubHeaderCheckBox(name,field,title){
	return '<label><input type="checkbox" name="'+name+'" onclick="CMMT120S_fnSubHeaderAllCheckBoxClick(this,\''+field+'\')" class="k-checkbox k-checkbox-md k-rounded-md" >  '+ title +'</label>';
}
//Subfunction - Coulme Header Click Event
function CMMT120S_fnSubHeaderAllCheckBoxClick(obj,parm){
	let checked = $(obj).is(':checked');
	let items = $("#grdCMMT120S").data("kendoGrid").dataSource.data();
	$.each(items,function (index,item) {
		if(checked){
			item.set(parm, "Y");
		}else{
			item.set(parm, "N");
		}
	})
}
//Subfunction - Check Box Data Set
function CMMT120S_fnSubSetCheckBox(item,field){
	let input;
	if(item === "Y"){
		input = '<span class="swithCheck"><input type="checkbox" onclick="CMMT120S_fnSubCheckBoxClick(this,\''+field+'\')" checked/><label></label></span>'
		//input = '<input type="checkbox" name="'+field+'" onclick="CMMT120S_fnSubCheckBoxClick(this,\''+field+'\')"  checked data-role="checkbox" class="k-checkbox k-checkbox-md k-rounded-md">';
	}else{
		input = '<span class="swithCheck"><input type="checkbox" onclick="CMMT120S_fnSubCheckBoxClick(this,\''+field+'\')" /><label></label></span>'
		//input = '<input type="checkbox" name="'+field+'" onclick="CMMT120S_fnSubCheckBoxClick(this,\''+field+'\')"  data-role="checkbox" class="k-checkbox k-checkbox-md k-rounded-md">';
	}
	return input;
}
//Subfunction - Check Box Click Event
function CMMT120S_fnSubCheckBoxClick(obj,field){
	let checked = $(obj).is(":checked");
	let tr = $(obj).closest("tr");
	let item = $("#grdCMMT120S").data("kendoGrid").dataItem(tr);
	if(checked){
		item.set(field, "Y");
	}else{
		item.set(field, "N");
	}
}
//Subfunction - Grid Add Row
function CMMT120S_fnSubGridAddRow(idx,tenantId,ctgrMgntNo,athtCd,athtView){
	$("#grdCMMT120S").data("kendoGrid").dataSource.insert(idx,{
		tenantId           : tenantId,
		ctgrMgntNo         : ctgrMgntNo,
		athtSeq            : "",
		ctgrUseAthtCd      : CMMT120S_ctgrUseAthtCd,
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