 var FRME240P_SEARCH_DATE = {};
 var FRME240P_cmmCodeList, FRME240P_selItem = [], FRME240P_ToolTip, FRME240P_grdFRME240P;
 
$(document).ready(function() {
	
	FRME240P_fnSelectCmmCode();
	
	var ComboBox_FRME240P1 = [
		{ text: FRME240P_langMap.get("FRME240P.all"), value: "" }, { text:FRME240P_langMap.get("FRME240P.cntcCustNm"), value: 1 }, { text: FRME240P_langMap.get("FRME240P.cntcNo"), value: 2 },
	]

	$("#FRME240P_cobCond").kendoComboBox({ 
		dataTextField: "text",
		dataValueField: "value",
		dataSource: ComboBox_FRME240P1, 
		clearButton: false,
		value: "",
		height: 200,
	});

	// 달력초기화
	$("#FRME240P_dateStart").val( kendo.format("{0:yyyy-MM-dd}",new Date()));
	$("#FRME260P_dateEnd").val(kendo.format("{0:yyyy-MM-dd}",new Date()));

	var FRME240P_comboList = [
			{ text: FRME240P_langMap.get("FRME240P.cnslDate"), value: "1" }, { text: FRME240P_langMap.get("FRME240P.rsvDate"), value: "2" }
			]

	 $("#FRME240PSrchDt").kendoComboBox({ 
			dataTextField: "text",
			dataValueField: "value",
			dataSource: FRME240P_comboList, 
			clearButton: false,
			value: "2",
			height: 200,
		});  
	 
	FRME240P_userInfo = GLOBAL.session.user;
	
	FRME240P_DataSource ={
			transport: {
				read	: function (FRME240P_jsonStr) {
					Utils.ajaxCall('/frme/FRME240SEL01', FRME240P_jsonStr, FRME240P_fnResultTenantList, 
							window.kendo.ui.progress($("#grdFRME240P"), true))
				}
				
			},
			schema : {
				type: "json",
				model: {
					fields: {
						rsvDd				: { field: "rsvDd", type: "string"}, // 상담일시
						cntcCustNm			: { field: "cntcCustNm", type: "string" },//고객명
						cntcTelNo			: { field: "cntcTelNo", type: "string" }, //예약번호
						rsvMemo				: { field: "rsvMemo", type: "string" }, // 예약내용
						procStCd			: { field: "procStCd", type: "string" }, //처리상태
					}  
				}
			}
	}

	$("#grdFRME240P").kendoGrid({
		dataSource : FRME240P_DataSource,
		autoBind: false,
		sortable: true,
		resizable: true,
		selectable: true,
		scrollable: true,
		height: 345,
		change: function(e) {
			let selectedRows = e.sender.select();
			FRME240P_selItem = this.dataItem(selectedRows[0]);
		},
		noRecords: { template: `<div class="nodataMsg"><p>${FRME240P_langMap.get("FRME240P.grid.nodatafound")}</p></div>` },
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
			{
				width : '35px',
				template : '<mark class="singleSelect k-icon k-i-radiobutton"></mark>'
			},
			{
				field : "rsvDd",
				title : FRME240P_langMap.get("FRME240P.grid.rsvDd"),
				type : "string",
				width : '120px',
				template : '#=FRME240P_fnColumnTemplateFunction(rsvDd, rsvHour, rsvPt)#'
			},
			{
				field : "cntcCustNmMsk",
				title: GLOBAL.session.user.dmnCd == '200'||GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? FRME240P_langMap.get("FRME240P.grid.patientNm") : FRME240P_langMap.get("FRME240P.grid.cntcCustNm"),
				type : "string",
				width : '100px',
				attributes: {style: "text-align : left;", class: "tdTooltip"},
			},
			{
				field : "cntcTelNo",
				title : FRME240P_langMap.get("FRME240P.grid.cntcTelNo"),
				type : "string",
				width : '100px'
			},
			{
				field : "rsvMemo",
				title : FRME240P_langMap.get("FRME240P.grid.rsvMemo"),
				type : "string",
				width: "auto",
				attributes : {
					"class" : "k-text-left"
				}
			},
			{
				field : "procStCd",
				title : FRME240P_langMap.get("FRME240P.grid.procStCd"),
				type : "string",
				width : '100px',
				template : function(dataItem) {
					return Utils.getComCdNm(FRME240P_cmmCodeList,'C0156',dataItem.procStCd);
				}
			} ],

	});
	
	FRME240P_grdFRME240P = $("#grdFRME240P").data("kendoGrid");
	FRME240P_ToolTip = $("#grdFRME240P").kendoTooltip({
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
			let dataItem = FRME240P_grdFRME240P.dataItem(e.target.closest("tr"));
			return dataItem.cntcCustNm;
		}
	}).data("kendoTooltip");
	FRME240P_fnSearchTenantList();
});

function FRME240P_fnColumnTemplateFunction(rsvDd, rsvHour, rsvPt){
	var FRME240P_svcContDd = kendo.format("{0:yyyy-MM-dd}",new Date(rsvDd))+" "+rsvHour+":"+rsvPt;
	return FRME240P_svcContDd
}

//그리드 조회
function FRME240P_fnSearchTenantList(){
	
	var FRME240P_regex = /[^0-9]/g;	
	var FRME240P_srchText = $("#FRME240PSrchText").val();

	var FRME240P_srchDt = $('#FRME240PSrchDt').val() ;
	var FRME240P_srchCond = $('#FRME240P_cobCond').val();
	var FRME240P_procStCd = $('#FRME240P_cobSt').val();
	var FRME240P_srchDtFrom = $('#FRME240P_dateStart').val().replace(FRME240P_regex, "");
	var FRME240P_srchDtTo= $('#FRME240P_dateEnd').val().replace(FRME240P_regex, "");
	
	if(Utils.isNull(FRME240P_srchDtFrom)){
		Utils.alert(FRME240P_langMap.get("FRME240P.selStdt"));
		return;
	}
	if(Utils.isNull(FRME240P_srchDtTo)){
		Utils.alert(FRME240P_langMap.get("FRME240P.selEdDt"));
		return;
	}
	
	var FRME240P_data = { tenantId			: FRME240P_userInfo.tenantId,
						  usrId				: FRME240P_userInfo.usrId,
						  srchDt 			: FRME240P_srchDt, 
						  srchDtFrom		: FRME240P_srchDtFrom,
						  srchDtTo 			: FRME240P_srchDtTo,
						  srchCond 			: FRME240P_srchCond, 
						  srchText 			: FRME240P_srchText,
						  procStCd			: FRME240P_procStCd
						 
				       };	
	var FRME240P_jsonStr = JSON.stringify(FRME240P_data);

	FRME240P_DataSource.transport.read(FRME240P_jsonStr);
}

function FRME240P_fnResultTenantList(FRME240P_data){

	window.kendo.ui.progress($("#grdFRME240P"), false)
	
	var FRME240P_jsonEncode = JSON.stringify(FRME240P_data.FRME240PInfo);
	var FRME240P_obj = JSON.parse(FRME240P_jsonEncode);
	var FRME240P_jsonDecode = JSON.parse(FRME240P_obj);

	FRME240P_grdFRME240P.dataSource.data(FRME240P_jsonDecode);
}

function FRME240P_fnSelectCmmCode() {
    let FRME240P_data = {
        "codeList": [
            {"mgntItemCd": "C0154"},
            {"mgntItemCd": "C0155"},
            {"mgntItemCd": "C0156"},
        ]
    };
    Utils.ajaxCall(
        "/comm/COMM100SEL01",JSON.stringify(FRME240P_data), FRME240P_fnsetCmmCode)
}

function FRME240P_fnsetCmmCode(data) {
    FRME240P_cmmCodeList = JSON.parse(data.codeList);
    Utils.setKendoComboBox(FRME240P_cmmCodeList, "C0156", "#FRME240P_cobSt", "", true);
}

function FRME240P_fnCnslTab(){

	if(FRME240P_selItem.length==0){
		Utils.alert(FRME240P_langMap.get("FRME240P.selCall"));
		return;
	}

	Utils.getParent().TabUtils.openCnslMainTab(3,FRME240P_selItem.unfyCntcHistNo,FRME240P_langMap.get("CNSL.Comm.Not.Found.cnsl.Main"),"pop");

	// if(Utils.getParent().frme_head_CMS.length>0){
	// 	if(Utils.getParent().MAINFRAME_SUB.isTabOpen(Utils.getParent().frme_head_CMS[0])==true){
	// 		new Function('Utils.getParent().'+Utils.getParent().frme_head_CMS[0]+'TabSel("3",'+FRME240P_selItem.unfyCntcHistNo+')')();
	// 	}
	// 	Utils.getParent().MAINFRAME_SUB.openDataFrameById(Utils.getParent().frme_head_CMS[0], {gridNum : 3, gridKey:FRME240P_selItem.unfyCntcHistNo});
	// }else{
	// 	Utils.alert(FRME240P_langMap.get("CNSL.Comm.Not.Found.cnsl.Main"));
	// }
}

 $('#FRME240PSrchText').on("keyup",function(key){
	 if(key.keyCode==13) {
		 FRME240P_fnSearchTenantList();
	 }
 });
