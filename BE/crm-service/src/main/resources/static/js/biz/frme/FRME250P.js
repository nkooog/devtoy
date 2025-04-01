 var FRME250P_SEARCH_DATE = {};
 var FRME250P_cmmCodeList, FRME250P_selItem=[], FRME250P_ToolTip, FRME250P_grdFRME250P;
 
$(document).ready(function() {
	
	FRME250P_fnSelectCmmCode();

	var ComboBox_FRME250P1 = [
		{ text: FRME250P_langMap.get("FRME250P.all"), value: "" }, { text: FRME250P_langMap.get("FRME250P.cntcCustNm"), value: 1 }, { text: FRME250P_langMap.get("FRME250P.cntcNo"), value: 2 },
	]

	$("#FRME250P_cobCond").kendoComboBox({ 
		dataTextField: "text",
		dataValueField: "value",
		dataSource: ComboBox_FRME250P1, 
		clearButton: false,
		value: "",
		height: 200,
	});

	// 달력초기화
	$("#FRME250P_dateStart").val( kendo.format("{0:yyyy-MM-dd}",new Date()));
	$("#FRME250P_dateEnd").val(kendo.format("{0:yyyy-MM-dd}",new Date()));
	 
	var FRME250P_comboList = [
			{ text:FRME250P_langMap.get("FRME250P.srchDate"), value: "1"}
	]
	 
		$("#FRME250PSrchDt").kendoComboBox({ 
			dataTextField: "text",
			dataValueField: "value",
			dataSource: FRME250P_comboList, 
			clearButton: false,
			value: "1",
			height: 200,
		});  
	 
	FRME250P_userInfo = GLOBAL.session.user;
	
	FRME250P_DataSource ={
			transport: {
				read	: function (FRME250P_jsonStr) {
					Utils.ajaxCall('/frme/FRME250SEL01', FRME250P_jsonStr, FRME250P_fnResultTenantList, 
							window.kendo.ui.progress($("#grdFRME250P"), true))
				}
				
			},
			schema : {
				type: "json",
				model: {
					fields: {
						trclDt				: { field: "trclDt", type: "string"}, // 이관일시
						cntcCustNm			: { field: "cntcCustNm", type: "string" },//고객명
						cntcTelNo			: { field: "cntcTelNo", type: "string" }, //예약번호
						cntcChnlCd				: { field: "cntcChnlCd", type: "string" }, // 업무분류
						trclCtt			: { field: "trclCtt", type: "string" }, //예약내용
						trclmnId			: { field: "trclmnId", type: "string"}, //상담원
						procStCd			: { field: "procStCd", type: "string" }, //처리상태
					}  
				}
			}
	}

	$("#grdFRME250P").kendoGrid({
		dataSource : FRME250P_DataSource, 
		autoBind: false,
		sortable: true,
		resizable: true,
		selectable: true,
		scrollable: true,
		height: 345,
		change: function(e) {
			let selectedRows = e.sender.select();
			FRME250P_selItem = this.dataItem(selectedRows[0]);
		},
		noRecords: { template: `<div class="nodataMsg"><p>${FRME250P_langMap.get("FRME250P.grid.nodatafound")}</p></div>` },
		pageable: {refresh:false
			, pageSizes:[ 25, 50, 100, 200,  500]
			, buttonCount:10
			, pageSize : 25
			, messages: {
				display: " "
				, itemsPerPage: ""
			    }
		},
		columns: [
			{ width: '35px', template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>'},
			{
				field: "trclDt", title: FRME250P_langMap.get("FRME250P.grid.trclDt"), type: "string", width: '80px',
				template : '#=kendo.format("{0:yyyy-MM-dd}",new Date(trclDt))#',
			}, {
				field: "cntcCustNmMsk",
				title: GLOBAL.session.user.dmnCd == '200'||GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? FRME250P_langMap.get("FRME250P.grid.patientNm") : FRME250P_langMap.get("FRME250P.grid.cntcCustNm"),
				type: "string" ,width: '100px',
				attributes: {style: "text-align : left;", class: "tdTooltip"},
			}, {
				field: "cntcTelNo", title: FRME250P_langMap.get("FRME250P.grid.cntcTelNo"),type: "string" ,width: '120px'
			}, {
				field: "cntcChnlCd", title: FRME250P_langMap.get("FRME250P.grid.cntcChnlCd"),type: "string" ,width: '100px',
				template: function (dataItem) {
	                  return Utils.getComCdNm(FRME250P_cmmCodeList, 'C0130', $.trim(dataItem.cntcChnlCd));
					},
			}, {
				field: "trclCtt", title: FRME250P_langMap.get("FRME250P.grid.trclCtt"),type: "string", attributes: {"class": "k-text-left"}
			}, {
				field: "trclmnId", title: FRME250P_langMap.get("FRME250P.grid.trclmnId"),type: "string",width: '100px', template:"#=usrNm+'('+trclmnId+')'# "
				, attributes: {"class": "k-text-left"}
			}, {
				field: "procStCd", title: FRME250P_langMap.get("FRME250P.grid.procStCd"),type: "string",width: '100px',
				 template: function (dataItem) {
	                    return Utils.getComCdNm(FRME250P_cmmCodeList, 'C0230', dataItem.procStCd);
	               }
			}],

	});
	
	FRME250P_grdFRME250P = $("#grdFRME250P").data("kendoGrid");
	FRME250P_ToolTip = $("#grdFRME250P").kendoTooltip({
		filter: ".tdTooltip",
		autoHide:true,
		//showOn: "mouseenter",
		show: function(e){
			if(this.content.text().length>0){
				this.content.parent().css("visibility", "visible");
			}else{
				this.content.parent().css("visibility", "hidden");
			}
		},
		hide: function(e){
			this.content.parent().css('visibility', 'hidden');
		},
		content: function(e){
			let dataItem = FRME250P_grdFRME250P.dataItem(e.target.closest("tr"));
			return dataItem.cntcCustNm;
		}
	}).data("kendoTooltip");
	FRME250P_fnSearchTenantList();
});


function FRME250P_fnColumnTemplateFunction(rsvDd, rsvHour, rsvPt){
	var SYSM110T_svcContDd = kendo.format("{0:yyyy-MM-dd}",new Date(rsvDd))+" "+rsvHour+":"+rsvPt;
	return SYSM110T_svcContDd
}

//그리드 조회
function FRME250P_fnSearchTenantList(){
	
	var FRME250P_srchText = $("#FRME250PSrchText").val();
	var FRME250P_srchCond = $("#FRME250P_cobCond").val();
	
	var FRME250P_procStCd = $('#FRME250P_cobSt').val();
	
	var FRME250P_srchDtFrom = $('#FRME250P_dateStart').val();
	var FRME250P_srchDtTo= $('#FRME250P_dateEnd').val();
	
	if(Utils.isNull(FRME250P_srchDtFrom)){
		Utils.alert( FRME250P_langMap.get("FRME250P.selStdt"));
		return;
	}
	if(Utils.isNull(FRME250P_srchDtTo)){
		Utils.alert(FRME250P_langMap.get("FRME250P.selEdDt"));
		return;
	}
	
	var FRME250P_data = { tenantId			: FRME250P_userInfo.tenantId,
						  usrId				: FRME250P_userInfo.usrId,
						  srchDtFrom		: FRME250P_srchDtFrom,
						  srchDtTo 			: FRME250P_srchDtTo,
						  srchCond 			: FRME250P_srchCond, 
						  srchText 			: FRME250P_srchText,
						  procStCd			: FRME250P_procStCd
						 
				       };	
	var FRME250P_jsonStr = JSON.stringify(FRME250P_data);

	FRME250P_DataSource.transport.read(FRME250P_jsonStr);

}

function FRME250P_fnResultTenantList(FRME250P_data){

	window.kendo.ui.progress($("#grdFRME250P"), false)
	
	var FRME250P_jsonEncode = JSON.stringify(FRME250P_data.FRME250PInfo);
	var FRME250P_obj = JSON.parse(FRME250P_jsonEncode);
	var FRME250P_jsonDecode = JSON.parse(FRME250P_obj);

	FRME250P_grdFRME250P.dataSource.data(FRME250P_jsonDecode);
	FRME250P_grdFRME250P.dataSource.options.schema.data = FRME250P_jsonDecode;
}


function FRME250P_fnSelectCmmCode() {
    let FRME250P_data = {
        "codeList": [
        	{"mgntItemCd": "C0117"},
            {"mgntItemCd": "C0230"},
			{"mgntItemCd": "C0130"},

        ]
    };
    Utils.ajaxCall( "/comm/COMM100SEL01",  JSON.stringify(FRME250P_data), FRME250P_fnsetCmmCode)
}

function FRME250P_fnsetCmmCode(data) {
    FRME250P_cmmCodeList = JSON.parse(data.codeList);
    Utils.setKendoComboBox(FRME250P_cmmCodeList, "C0230", "#FRME250P_cobSt", "", true);
}

function FRME250P_fnCnslTab(){

	if(FRME250P_selItem.length==0){
		Utils.alert(FRME250P_langMap.get("FRME250P.selCall"));
		return;
	}

	Utils.getParent().TabUtils.openCnslMainTab(4,FRME250P_selItem.trclSeq,FRME250P_langMap.get("CNSL.Comm.Not.Found.cnsl.Main"),"pop");
	// if(Utils.getParent().frme_head_CMS.length>0){
	// 	if(Utils.getParent().MAINFRAME_SUB.isTabOpen(Utils.getParent().frme_head_CMS[0])==true){
	// 		new Function('Utils.getParent().'+Utils.getParent().frme_head_CMS[0]+'TabSel("4",'+FRME250P_selItem.trclSeq+')')();
	// 	}
	// 	Utils.getParent().MAINFRAME_SUB.openDataFrameById(Utils.getParent().frme_head_CMS[0], {gridNum : 4, gridKey:FRME250P_selItem.trclSeq});
	// }else{
	// 	Utils.alert(FRME250P_langMap.get("CNSL.Comm.Not.Found.cnsl.Main"));
	// }
}

 $('#FRME250PSrchText').on("keyup",function(key){
	 if(key.keyCode==13) {
		 FRME250P_fnSearchTenantList();
	 }
 });
