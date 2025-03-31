/***********************************************************************************************
 * Program Name : 카테고리 만들기- 조직권한(KMST110S.js)
 * Creator      : 정대정
 * Create Date  : 2022.05.26
 * Description  : 카테고리 만들기- 조직권한(KMST110S.js)
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.26     정대정           최초작성
 ************************************************************************************************/

var KMST110S_DataSource;
var KMST110S_GetData = [];
var KMST110S_beforeData=[];
var KMST110S_ctgrUseAthtCd="1";
var KMST110S_grid = new Array(1);

$(document).ready(function() {
	//1.Grid init
	//1. 그리드 설정
    for (let i = 0; i < KMST110S_grid.length; i++) {
    	KMST110S_grid[i] = {
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
    
	KMST110S_fnGridInit();

	KMST110S_fnSerch();
	KMST110S_fnDefaultHightSetting();

	$(window).on({'resize': function() {KMST110S_fnDefaultHightSetting();}});
});


//======================================================================================================================
//1.Grid init
function KMST110S_fnGridInit(){
	KMST110S_DataSource = {
		transport: {
			read :function (KMST110S_jsonStr) {
				Utils.ajaxCall('/kmst/KMST110SEL01', JSON.stringify(KMST110S_jsonStr), function(result){
						let data =JSON.parse(JSON.parse(JSON.stringify(result.KMST110VOGridInfo)));
						$("#grdKMST110S").data("kendoGrid").dataSource.data(data);
						KMST110S_GetData=[];
						$.each(data,function(index,item){
							KMST110S_GetData.push(item);
						});
					},
					window.kendo.ui.progress($("#grdKMST110S"), true),
					window.kendo.ui.progress($("#grdKMST110S"), false)
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

	KMST110S_grid[0] = $("#grdKMST110S").kendoGrid({
		dataSource: KMST110S_DataSource,
		autoBind: false,
		sortable: false,
		//resizable : true,
		selectable: "multiple, row",
		scrollable: true,
		noRecords: { template: '<div class="nodataMsg"><p>'+KMST110S_langMap.get("grid.nodatafound")+'</p></div>' },
		columns: [
			{
				field: "athtCd", hidden: true //shpark 20240828 : 통합게시판 상세보기 시 header 밀림 방지
			},
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
				title: KMST110S_langMap.get("KMST110S.grid.title.OrgNm"),
				field: "athtView",
				attributes: {"class": "k-text-left"},
			},{
				title :KMST110S_langMap.get("KMST110S.grid.title.PermitSetting"),
				columns:[
					{
						field: "rdPmssYn",
						width: 85,
						template : '#=KMST110S_fnSubSetCheckBox(rdPmssYn,"rdPmssYn")#', //data,id
						headerTemplate : kendo.template('#=KMST110S_fnSubHeaderCheckBox("rdPmssYnAll","rdPmssYn",KMST110S_langMap.get("KMST110S.grid.title.Read"))#')
					},{
						width: 85,
						field: "writPmssYn",
						template : '#=KMST110S_fnSubSetCheckBox(writPmssYn,"writPmssYn")#',
						headerTemplate : kendo.template('#=KMST110S_fnSubHeaderCheckBox("writPmssYnAll","writPmssYn",KMST110S_langMap.get("KMST110S.grid.title.Write"))#')
					},{
						field: "corcPmssYn",
						width: 85,
						template : '#=KMST110S_fnSubSetCheckBox(corcPmssYn,"corcPmssYn")#',
						headerTemplate : kendo.template('#=KMST110S_fnSubHeaderCheckBox("corcPmssYnAll","corcPmssYn",KMST110S_langMap.get("KMST110S.grid.title.Edite"))#')
					},{
						field: "delPmssYn",
						width: 85,
						template : '#=KMST110S_fnSubSetCheckBox(delPmssYn,"delPmssYn")#',
						headerTemplate : kendo.template('#=KMST110S_fnSubHeaderCheckBox("delPmssYnAll","delPmssYn",KMST110S_langMap.get("KMST110S.grid.title.Delete"))#')
					},{
						field: "replyPmssYn",
						width: 85,
						template : '#=KMST110S_fnSubSetCheckBox(replyPmssYn,"replyPmssYn")#',
						headerTemplate : kendo.template('#=KMST110S_fnSubHeaderCheckBox("replyPmssYnAll","replyPmssYn",KMST110S_langMap.get("KMST110S.grid.title.Comment"))#')
					},{
						field: "goodPmssYn",
						width: 85,
						template : '#=KMST110S_fnSubSetCheckBox(goodPmssYn,"goodPmssYn")#',
						headerTemplate : kendo.template('#=KMST110S_fnSubHeaderCheckBox("goodPmssYnAll","goodPmssYn",KMST110S_langMap.get("KMST110S.grid.title.Like"))#')
					},{
						field: "apndFileDnldPmssYn",
						width: 85,
						template : '#=KMST110S_fnSubSetCheckBox(apndFileDnldPmssYn,"apndFileDnldPmssYn")#',
						headerTemplate : kendo.template('#=KMST110S_fnSubHeaderCheckBox("apndFileDnldPmssYnAll","apndFileDnldPmssYn",KMST110S_langMap.get("KMST110S.grid.title.Download"))#')
					}
				]
			},
		],
	}).data("kendoGrid");
}

function KMST110S_fnDefaultHightSetting(){
	let screenHeight = $(window).height();

	$("#grdKMST110S").data("kendoGrid").element.find('.k-grid-content').css('height', screenHeight-740);   //   (헤더+ 푸터+ 검색 )영역 높이 제외
}

//======================================================================================================================
//Call function - 조회 함수
function KMST110S_fnSerch(){
	
	if($('#KMST100M input[name=edtCtgrNo]').val()){
		let KMST110_Serch_data = {
			tenantId 	  : GLOBAL.session.user.tenantId,
			ctgrNo    :	$('#KMST100M input[name=edtCtgrNo]').val(),
			ctgrUseAthtCd : KMST110S_ctgrUseAthtCd,
		};
		KMST110S_DataSource.transport.read(KMST110_Serch_data);
	}
}

//======================================================================================================================
//Button Event - 상위 게시판 권한 가져오기
$("#KMST110S button[name=btnUpperAthtGet]").off("click").on("click", function () {
	
	let ctgrNewCheck = KMST100M_fnCtgrNewCheck();
	if(ctgrNewCheck){
		return;
	}
	
	let hgrkNo = $('#KMST100M input[name=edtCtgrHgrkNo]').val();

	if(hgrkNo === '0'){//상위게시판 없음
		Utils.alert(KMST110S_langMap.get("KMST110S.Message.do.not.Upper.notice.board"));
		return;
	}

	Utils.confirm(KMST110S_langMap.get("KMST110S.Message.do.delete.And.Update.Upper.notice.board"),function (){
		let data = $("#grdKMST110S").data("kendoGrid").dataSource.data();
		KMST110S_beforeData=[];
		$.each(data,function(index,item){
			KMST110S_beforeData.push(item);
		});

		let KMST110_Serch_data = {
			tenantId 	  : GLOBAL.session.user.tenantId,
			ctgrNo    :	hgrkNo,
			ctgrUseAthtCd : KMST110S_ctgrUseAthtCd,
		};
		KMST110S_DataSource.transport.read(KMST110_Serch_data);

	});
});
//Button Event - 권한 추가 (조직찾기 팝업 호출)
$("#KMST110S button[name=btnAddRow]").off("click").on("click", function () {
	
	let ctgrNewCheck = KMST100M_fnCtgrNewCheck();
	if(ctgrNewCheck){
		return;
	}
	
	Utils.setCallbackFunction("KMST110S_fnKMST110SCallback", KMST110S_fnKMST110SCallback);
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM210P", "SYSM210P" , 400, 610,  {callbackKey: "KMST110S_fnKMST110SCallback"});
});
//Call Back function - Add Row (조직찾기 팝업 호출 콜백)
function KMST110S_fnKMST110SCallback(data){
	let dataSource= $("#grdKMST110S").data("kendoGrid").dataSource.data();
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
				let idx =$("#grdKMST110S").data("kendoGrid").dataSource.data().length;
				KMST110S_fnSubGridAddRow(idx,GLOBAL.session.user.tenantId,ctgrNo*= 1,itemP.orgCd,itemP.orgPath); //*= 1 --> String ->num 변환
			}
		});
	}else{//기존에 아무것도 없는경우
		$.each(data, function (indexP, itemP){
			let idx =$("#grdKMST110S").data("kendoGrid").dataSource.data().length;
			KMST110S_fnSubGridAddRow(idx,GLOBAL.session.user.tenantId,ctgrNo*= 1,itemP.orgCd,itemP.orgPath);
		});
	}
}
//Button Event - 권한 저장
$("#KMST110S button[name=btnSave]").off("click").on("click", function () {
	
	let ctgrNewCheck = KMST100M_fnCtgrNewCheck();
	if(ctgrNewCheck){
		return;
	}
	
	let selRows = Object.assign({}, $("#grdKMST110S").data("kendoGrid").dataSource.data());
	// let selRows = [];
	// let selRow = $("#grdKMST110S").data("kendoGrid").select();
	//
	// $(selRow).each(function(index,item){
	// 	selRows.push($("#grdKMST110S").data("kendoGrid").dataItem(item));
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
		Utils.confirm(KMST110S_langMap.get("KMST110S.Message.do.you.want.save"),function(){
			if(KMST110S_beforeData.length >0)
			{
				let KMST110_del_data = {
					list 	  	  : KMST110S_beforeData,
					ctgrUseAthtCd : KMST110S_ctgrUseAthtCd,
				};
				//ajax
				Utils.ajaxCall('/kmst/KMST110DEL01', JSON.stringify(KMST110_del_data));

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
					$.each(KMST110S_GetData,function(indexG,itemG){
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
				let KMST110_save_data = {
					list 	  	  : saveData,
					ctgrUseAthtCd : KMST110S_ctgrUseAthtCd,
				};
				//ajax
				Utils.ajaxCall('/kmst/KMST110INS01', JSON.stringify(KMST110_save_data),KMST110S_fnCallBackReulst);
			}
		});

	}else{//기존에 아무것도 없는경우
		Utils.alert(KMST110S_langMap.get("KMST110S.Message.not.select.item"));
	}
});
//Button Event - 권한 삭제
$("#KMST110S button[name=btnDelete]").off("click").on("click", function () {
	
	let ctgrNewCheck = KMST100M_fnCtgrNewCheck();
	if(ctgrNewCheck){
		return;
	}
	
	let selRow = $("#grdKMST110S").data("kendoGrid").select();

	if (selRow.length <= 0) {//기존에 아무것도 없는경우
		Utils.alert(KMST110S_langMap.get("KMST110S.Message.not.select.item"));
	}else{
		Utils.confirm(KMST110S_langMap.get("KMST110S.Message.do.you.want.delete"),function (){
			let delData = [];
			$(selRow).each(function(index,item){

				if($("#grdKMST110S").data("kendoGrid").dataItem(item).athtSeq >0){ //기존 데이터
					delData.push($("#grdKMST110S").data("kendoGrid").dataItem(item));
				}else{ //그리드 로우 추가만된 데이터
					$("#grdKMST110S").data("kendoGrid").removeRow(item);
				}
			});

			let KMST110_del_data = {
				list 	  	  : delData,
				ctgrUseAthtCd : KMST110S_ctgrUseAthtCd,
			};
			//ajax
			Utils.ajaxCall('/kmst/KMST110DEL01', JSON.stringify(KMST110_del_data),KMST110S_fnCallBackReulst);
		});
	}
});

//Call Back - 저장,삭제 콜백 처리 Function
function KMST110S_fnCallBackReulst(result){
	Utils.alert(result.msg);
	if(result.result>0){
		KMST110S_fnSerch();
	}
}

//======================================================================================================================
//Subfunction - Coulme Header Template
function KMST110S_fnSubHeaderCheckBox(name,field,title){
	return '<label><input type="checkbox" name="'+name+'" onclick="KMST110S_fnSubHeaderAllCheckBoxClick(this,\''+field+'\')" class="k-checkbox k-checkbox-md k-rounded-md" >  '+ title +'</label>';
}
//Subfunction - Coulme Header Click Event
function KMST110S_fnSubHeaderAllCheckBoxClick(obj,parm){
	let checked = $(obj).is(':checked');
	let items = $("#grdKMST110S").data("kendoGrid").dataSource.data();
	$.each(items,function (index,item) {
		if(checked){
			item.set(parm, "Y");
		}else{
			item.set(parm, "N");
		}
	})
}
//Subfunction - Check Box Data Set
function KMST110S_fnSubSetCheckBox(item,field){
	let input;
	if(item === "Y"){
		input = '<span class="swithCheck"><input type="checkbox" onclick="KMST110S_fnSubCheckBoxClick(this,\''+field+'\')" checked/><label></label></span>'
		//input = '<input type="checkbox" name="'+field+'" onclick="KMST110S_fnSubCheckBoxClick(this,\''+field+'\')"  checked data-role="checkbox" class="k-checkbox k-checkbox-md k-rounded-md">';
	}else{
		input = '<span class="swithCheck"><input type="checkbox" onclick="KMST110S_fnSubCheckBoxClick(this,\''+field+'\')" /><label></label></span>'
		//input = '<input type="checkbox" name="'+field+'" onclick="KMST110S_fnSubCheckBoxClick(this,\''+field+'\')"  data-role="checkbox" class="k-checkbox k-checkbox-md k-rounded-md">';
	}
	return input;
}
//Subfunction - Check Box Click Event
function KMST110S_fnSubCheckBoxClick(obj,field){
	let checked = $(obj).is(":checked");
	let tr = $(obj).closest("tr");
	let item = $("#grdKMST110S").data("kendoGrid").dataItem(tr);
	if(checked){
		item.set(field, "Y");
	}else{
		item.set(field, "N");
	}
}
//Subfunction - Grid Add Row
function KMST110S_fnSubGridAddRow(idx,tenantId,ctgrNo,athtCd,athtView){
	$("#grdKMST110S").data("kendoGrid").dataSource.insert(idx,{
		tenantId           : tenantId,
		ctgrNo         : ctgrNo,
		athtSeq            : "",
		ctgrUseAthtCd      : KMST110S_ctgrUseAthtCd,
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