var SYSM434M_Grid =new Array(5);
var SYSM434M_CommCodeList;
var tabSYSM434M;
var SYSM434M_regDt;
var SYSM434M_schdNo;
var SYSM434M_tmplMgntNo;
var SYSM434M_sndgCtt;
var SYSM434M_sndgRsvSqnc;
var SYSM434M_sndgRsvDt;
var SYSM434M_sndgRsvTm;
var SYSM434M_procStCd;
var SYSM434M_apndFileIdxNm1;
var SYSM434M_apndFileIdxNm2;
var SYSM434M_apndFileIdxNm3;
var SYSM434M_apndFileNm1;
var SYSM434M_apndFileNm2;
var SYSM434M_apndFileNm3;
var SYSM434M_apndFilePsn1;
var SYSM434M_apndFilePsn2;
var SYSM434M_apndFilePsn3;

var formData 	= new FormData();
var sizeLimit 	= 20971520;
var regex    	= new RegExp("(.*?)\.(xls|XLS|xlsx|XLSX)$");
var specialPattern =  /[`~!@#$%^&*|\\\'\";:\/?]/gi;

for(let i=0; i<SYSM434M_Grid.length; i++) {
	SYSM434M_Grid[i]={
		instance: {},
		dataSource :{},
		currentItem: {},
		currentCellIndex : Number(),
		currentRowIndex: Number(),
		selectedItems: [],
		loadCount :0,
	}
}

$(document).ready(function (){

	SYSM434M_fnDateInit();

	SYSM434M_fnCommCdGet();

	SYSM434M_fnGridInit();

	SYSM434M_GridResize();
	
	$(window).on({'resize' : function() {
			SYSM434M_GridResize();
		}
	});
	
	//엑셀양식 다운로드
	$("#btnDownload").off('click').on('click',function(){
		var options =	{
				fileName: "sms_sending_list.xlsx",
				sheetName: "고객 데이터",
				columns: [
						{ header: "고객ID(차트번호)", width: 150, dataType: "string" },
						{ header: "고객명", width: 100, dataType: "string" },
						{ header: "휴대전화번호", width: 200, dataType: "string" },
						{ header: "성별", width: 100, dataType: "string" },
						{ header: "생년월일", width: 100, dataType: "string" },
				],
				rows: [
						["11111111", "홍길동", "01000000000", "남", "20000101"],
						["11111113", "김영희", "01000000003", "여", "20000103"],
				]
		}
		EXCEL_Utils.excelExport(options)
	});

	$("#SYSM434M").on("change","#upfile",function(e)			{	SYSM434M_excelUpfile(e);	 });

	function SYSM434M_excelUpfile(e){
		if($("#upfile").val() == ""){
			return;
		}

		var upfile 		= $("#upfile")[0].files[0];
		var upFileNm 	= upfile.name;
		var upFileSize 	= upfile.size;

		if(!regex.test(upFileNm)){
			Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.file.msg3"));
			return;
		}
		if(specialPattern.test(upFileNm)){
			Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.file.msg4"));
			return;
		}
		if(Number(upFileSize) >= Number(sizeLimit)){
			Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.file.msg5") + " (" + upFileSize + ")");
			return;
		}

		Utils.confirm(SYSM434M_langMap.get("SYSM434M.alert.file.msg6"), function(){
			var formData = new FormData();
			formData.append("upfile",		upfile);
			formData.append("tenantId", 	GLOBAL.session.user.tenantId);
			formData.append("regrId", 		GLOBAL.session.user.usrId);
			formData.append("regrOrgCd", 	GLOBAL.session.user.orgCd);
			formData.append("cntyCd",		GLOBAL.session.user.cntyCd);

			formData.append("regDt", 		SYSM434M_regDt);
		  formData.append("schdNo", 		SYSM434M_schdNo);
		  formData.append("tmplMgntNo", 	SYSM434M_tmplMgntNo);
		  formData.append("sndgCtt", 		SYSM434M_sndgCtt);
		  formData.append("sndgRsvSqnc", 	SYSM434M_sndgRsvSqnc);
		  formData.append("sndgRsvDt", 	SYSM434M_sndgRsvDt);
		  formData.append("sndgRsvTm", 	SYSM434M_sndgRsvTm);

		  //kw---20230421 : sms 다건 발송 - 파일불러오기 할 때 첨부파일 집어넣기
		  formData.append("apndFileIdxNm1", 	SYSM434M_apndFileIdxNm1);
		  formData.append("apndFileIdxNm2", 	SYSM434M_apndFileIdxNm2);
		  formData.append("apndFileIdxNm3", 	SYSM434M_apndFileIdxNm3);
		  formData.append("apndFileNm1", 		SYSM434M_apndFileNm1);
		  formData.append("apndFileNm2", 		SYSM434M_apndFileNm2);
		  formData.append("apndFileNm3", 		SYSM434M_apndFileNm3);
		  formData.append("apndFilePsn1", 	SYSM434M_apndFilePsn1);
		  formData.append("apndFilePsn2", 	SYSM434M_apndFilePsn2);
		  formData.append("apndFilePsn3", 	SYSM434M_apndFilePsn3);
		  //kw----------------------------------------------------------------

		  console.log("apndFileNm1 : " + SYSM434M_apndFileNm1);

			Utils.ajaxCallFormData("/sysm/SYSM434INS03",formData, function(result){
				Utils.alert(result.msg);

				SYSM434M_fnSearchSubGridList();
			});
		});
	}
	//파일 불러오기
	$("#btnFile").off("click").on('click',function(){
		var grid = $('#gridSYSM434M_1').data('kendoGrid');
		var selectedItem = grid.dataItem(grid.select());

		if(Utils.isNull(selectedItem) == true){
			Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.file.msg1"));
			return;
		}
		
		if(selectedItem.procStCd  != "1"){
			Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.file.msg2"));
			return;
		}
		$("#upfile").val('');
		$("#upfile").click();
	});

	//발송고객 조건
	$("#searchType").on('change',function(e){
		 var combo = $("#searchType").data("kendoComboBox");
		 var val = combo.value();

		 if("2" == val){
			 $("#search").hide();
			 $("#comboGndrCd").show(); 
		 } else {
			 $("#comboGndrCd").hide();
			 $("#search").show();
		 }

		 $("#search").val('');
		 $("#searchGndrCd").data("kendoComboBox").value('');
	})
	
//	var grid = $('#gridSYSM434M_1').data('kendoGrid');
//	grid.instance.select("tr:eq(1)");
	
	
	var searchButton = document.querySelector('.subZoon #search');

	searchButton.addEventListener('keypress', handleEnterKeyPress);
	
});

function handleEnterKeyPress(e) {
	if (e.keyCode === 13) {
		SYSM434M_fnOnSearchCustList();
    }
}

function SYSM434M_fnDateInit(){
	
	 const cultureSet = {
        ko : "ko-KR",
        en : "en-US",
    }
    const getCulture = cultureSet[GLOBAL.session.user.mlingCd];
	 
	$("#SYSM434M_StartDate").kendoDatePicker({
		value: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
		culture : getCulture,
		format: "yyyy-MM-dd",
		change: function (e) {
			$("#SYSM434M_EndDate").data("kendoDatePicker").min(e.sender.value());
		}
	});

	$("#SYSM434M_EndDate").kendoDatePicker({
		value: new Date(),
		culture : getCulture,
		format: "yyyy-MM-dd",
		change: function (e) {
			$("#SYSM434M_StartDate").data("kendoDatePicker").max(e.sender.value());
		}
	});

	CMMN_SEARCH_DATE["SYSM434M_StartDate"] = {
		startDateDp: $("#SYSM434M_StartDate").data("kendoDatePicker"),
		endDateDp: $("#SYSM434M_EndDate").data("kendoDatePicker"),
		initMaxDate: $("#SYSM434M_StartDate").data("kendoDatePicker").max(),
		initMinDate: $("#SYSM434M_EndDate").data("kendoDatePicker").min(),
		fnSetEnable: function () {
			CMMN_SEARCH_DATE["SYSM434M_StartDate"].startDateDp.max(CMMN_SEARCH_DATE["SYSM434M_StartDate"].initMaxDate);
			CMMN_SEARCH_DATE["SYSM434M_StartDate"].endDateDp.min(CMMN_SEARCH_DATE["SYSM434M_StartDate"].initMinDate);
			CMMN_SEARCH_DATE["SYSM434M_StartDate"].startDateDp.enable();
			CMMN_SEARCH_DATE["SYSM434M_StartDate"].endDateDp.enable();
			CMMN_SEARCH_DATE["SYSM434M_StartDate"].startDateDp.value("");
			CMMN_SEARCH_DATE["SYSM434M_StartDate"].endDateDp.value("");
		},
		fnSetDate: function (range) {
			CMMN_SEARCH_DATE["SYSM434M_StartDate"].startDateDp.max(CMMN_SEARCH_DATE["SYSM434M_StartDate"].initMaxDate);
			CMMN_SEARCH_DATE["SYSM434M_StartDate"].endDateDp.min(CMMN_SEARCH_DATE["SYSM434M_StartDate"].initMinDate);
			CMMN_SEARCH_DATE["SYSM434M_StartDate"].startDateDp.readonly();
			CMMN_SEARCH_DATE["SYSM434M_StartDate"].endDateDp.readonly();
			var today = new Date();
			var fromDate = new Date();
			fromDate.setDate(fromDate.getDate() + Number(range));
			if(range>0){
				CMMN_SEARCH_DATE["SYSM434M_StartDate"].startDateDp.value(today);
				CMMN_SEARCH_DATE["SYSM434M_StartDate"].startDateDp.trigger("change");
				CMMN_SEARCH_DATE["SYSM434M_StartDate"].endDateDp.value(fromDate);
				CMMN_SEARCH_DATE["SYSM434M_StartDate"].endDateDp.trigger("change");
			}else{
				CMMN_SEARCH_DATE["SYSM434M_StartDate"].startDateDp.value(fromDate);
				CMMN_SEARCH_DATE["SYSM434M_StartDate"].startDateDp.trigger("change");
				CMMN_SEARCH_DATE["SYSM434M_StartDate"].endDateDp.value(today);
				CMMN_SEARCH_DATE["SYSM434M_StartDate"].endDateDp.trigger("change");
			}
		}
	}
}

function SYSM434M_fnCommCdGet(){
	let mgntItemCdList = [
		{"mgntItemCd":"S0010"},
		{"mgntItemCd":"C0100"},{"mgntItemCd":"C0101"},{"mgntItemCd":"C0102"},{"mgntItemCd":"C0103"},{"mgntItemCd":"C0104"},
		{"mgntItemCd":"S0011"},
		{"mgntItemCd":"C0105"},{"mgntItemCd":"C0106"},{"mgntItemCd":"C0107"},{"mgntItemCd":"C0108"},{"mgntItemCd":"C0109"},{"mgntItemCd":"C0110"},
		{"mgntItemCd":"C0172"},
	];

	Utils.ajaxCall('/comm/COMM100SEL01',  JSON.stringify({ "codeList": mgntItemCdList}),function(data){
		SYSM434M_CommCodeList = JSON.parse(JSON.parse(JSON.stringify(data.codeList)));
		Utils.setKendoComboBox(SYSM434M_CommCodeList, "S0010", '#SYSM434M input[name=searchTypeDate]',"",true);
		Utils.setKendoComboBox(SYSM434M_CommCodeList, "C0100", '#SYSM434M input[name=searchSndgDv]',"",true);
		Utils.setKendoComboBox(SYSM434M_CommCodeList, "C0102", '#SYSM434M input[name=searchProcStcd]',"",true);
		
		Utils.setKendoComboBox(SYSM434M_CommCodeList, "S0011", '#SYSM434M input[name=searchType]',"",false);
		
		
		Utils.setKendoComboBox(SYSM434M_CommCodeList, "C0109", '#SYSM434M input[name=searchSMSStcd]',"",true);
		Utils.setKendoComboBox(SYSM434M_CommCodeList, "C0110", '#SYSM434M input[name=searchSNSSbdgDv]',"",true);
		Utils.setKendoComboBox(SYSM434M_CommCodeList, "C0101", '#SYSM434M input[name=setCalculate]',"",false);
		
		Utils.setKendoComboBox(SYSM434M_CommCodeList, "C0172", '#SYSM434M input[name=searchGndrCd]',"",true);

		},null,null,null );
}

function SYSM434M_fnGridInit(){

//////////////////////////////////////////////////////kendo grid start /////////////////////////////////////////////////////////////
	//발송 스케쥴
	SYSM434M_Grid[0].dataSource = new kendo.data.DataSource({
		transport: {
			read : function(options){
				var params = {
						tenantId : GLOBAL.session.user.tenantId,
						searchType : $('#SYSM434M input[name=searchTypeDate]').val(),
						startDate:	 SYSM434M_fnSubDateReplace($('#SYSM434M_StartDate').val()),
						endDate:	 SYSM434M_fnSubDateReplace($('#SYSM434M_EndDate').val()),
						sndgDv:		 $('#SYSM434M input[name=searchSndgDv]').val(),
						procStCd:	 $('#SYSM434M input[name=searchProcStcd]').val()
				}
				Utils.ajaxCall("/sysm/SYSM434SEL01", JSON.stringify(params), function (result) {
					options.success(JSON.parse(result.list));
				});
			},
			create :function(options){
				$.each(options.data.models, function(index, item){
					item.sndgRsvDt = kendo.format("{0:yyyyMMdd}",new Date(item.sndgRsvDt));
					item.regDt = item.regDt.replaceAll('-','');
				});
				Utils.ajaxCall("/sysm/SYSM434INS01", JSON.stringify({
					list: options.data.models
				}), function (result) {
					if(result.result == "success"){
						//options.success(options.data.models);
						//SYSM434M_Grid[0].dataSource.read();
						SYSM434M_fnOnSearchButtonClick();
					}else{
						Utils.alert(result.msg);
					}
				});
			},
			update :function(options){
				
				$.each(options.data.models, function(index, item){
					if(item.sndgRsvDt.length != 8){
						item.sndgRsvDt = kendo.format("{0:yyyyMMdd}",new Date(item.sndgRsvDt));	
					}
					item.regDt = item.regDt.replaceAll('-','');
				});
				let updateList = options.data.models;
				let regInfo = {
					lstCorprId: GLOBAL.session.user.usrId,
					lstCorprOrgCd: GLOBAL.session.user.orgCd
				}

				$.each(updateList, function (index, item) {
					$.extend(item, regInfo);
				});
				
				Utils.ajaxCall("/sysm/SYSM434UPT01", JSON.stringify({
					list: updateList
				}), function (result) {
					Utils.alert(result.msg);
					if(result.result == "success"){
						//options.success(updateList);
						//SYSM434M_Grid[0].dataSource.read();
						SYSM434M_fnOnSearchButtonClick();

						var gridDataDel = updateList;
						
						if(gridDataDel.length > 0){
							
							for(var i=0; i<gridDataDel.length; i++){
								
								var formDataDel = new FormData();
								
								formDataDel.append('SYSM435FilDel_data',JSON.stringify({
									tenantId 		: GLOBAL.session.user.tenantId
									, UsrId 		: GLOBAL.session.user.user
									, orgCd 		: GLOBAL.session.user.orgCd
									, uploadPath 	: "MMS_IMG"
									, delFileName	: gridDataDel[i].delFileName
								}));
								
								Utils.ajaxCallFormData('/sysm/SYSM435FilDel',formDataDel,function(data){});
							}
							
						}
						
					}
				});
			},
			destroy :function(options){ 
				options.success(options.data.models);
			} //실제 동작은 없고 byPass용
		},
		requestStart:function (e){
			let type = e.type; let response = e.response;
		},
		requestEnd : function (e){
			
			var type = e.type;
            var response = e.response;
            
			if (type != "read" && type != "destroy") {
				Utils.markingRequiredField();
			}
		},
		batch : true,
		schema:{
			type: "json",
			model:{
				id: "seq",
				fields: {
					regDt			:	{ field: "regDt", 			type: "string", editable: false},
					schdNo			:	{ field: "schdNo", 			type: "number"},
					sndgDv 			:	{ field: "sndgDv", 			type: "string"},
					tmplMgntNo 		:	{ field: "tmplMgntNo", 		type: "number"},
					tmplNm 			: 	{ field: "tmplNm", 			type: "string"},
					sndgRsvDt 		: 	{ field: "sndgRsvDt", 		type: "string"},
					procStCd 		: 	{ field: "procStCd", 		type: "string"},
					procStCdNm 		: 	{ field: "procStCdNm", 		type: "string"},
					regDtFormat		: 	{ field: "regDtFormat", 	type: "string"},
					sndgRsvDtFormat : 	{ field: "sndgRsvDtFormat", type: "string"},
					sndgTgtNcnt 	: 	{ field: "sndgTgtNcnt", 	type: "number", editable: false},
					sndgCpltNcnt 	: 	{ field: "sndgCpltNcnt",	type: "number", editable: false},
					sndgTotzNcnt 	: 	{ field: "sndgTotzNcnt",	type: "number", editable: false},
				}
			}
		}
	});
	
	SYSM434M_Grid[0].instance = $("#gridSYSM434M_1").kendoGrid({
		dataSource: SYSM434M_Grid[0].dataSource,
		noRecords: { template: '<div class="nodataMsg"><p>'+SYSM434M_langMap.get("SYSM434M.grid.info.noRecords")+'</p></div>' },
		dataBound: function(e){
			SYSM434M_grid_fnOnDataBound(e,0);
		},
		change :function(e){
			SYSM434M_grid_fnOnChange(e, 0);
		},
		scrollable : true,
		autoBind : true,
		selectable : "multiple,row",
		persistSelection : true,
		editable : true,
		edit: function(e){
			//그리드 내용 자동 선택
	    	$(e.container).find("input[type=text]").select();
		},
		sortable : false,
		resizable : true,
		columns: [
			{width: 30, selectable: true,},
			{
				title: SYSM434M_langMap.get("SYSM434M.grid0.col1.title"),
				type: "string",
				width: 50,
				template: function (dataItem) {
					var html = " ";
					if (dataItem.isNew()) {
						html = "<img src='"+GLOBAL.contextPath+"/resources/images/contents/btn_new.png' style='vertical-align:middle' alt='new' data-status='new'>";
					} else if (dataItem.dirty) {
						html = "<img src='"+GLOBAL.contextPath+"/resources/images/contents/btn_modify.png' style='vertical-align:middle' alt='modify' data-status='modify'>";
					}
					return html;
				},
			},
			{
				width : "12%",
				field : "regDt",
				title : SYSM434M_langMap.get("SYSM434M.grid0.col2.title"),
				template : function(item) {
					var regDt = SYSM434M_fnStrToYmd(item.regDt);
					return kendo.format("{0:yyyy-MM-dd}",new Date(regDt));
				},
				attributes : {
					"class" : "day"
				},
			},
			{
				width : "10%",
				field : "schdNo",
				title : SYSM434M_langMap.get("SYSM434M.grid0.col3.title"),
				editable : function() {
					return false;
				},
				attributes : {
					"class" : "textRight",
				}
			},
			{
				width: "9%", field: "sndgDv", title: SYSM434M_langMap.get("SYSM434M.grid0.col4.title"),
				editor : function(container, options) {
					SYSM434M_fnSubGridEditeTemplate(container, options, "C0100","select", 0);
				},
				template : function(dataItem) {
					return Utils.getComCdNm(SYSM434M_CommCodeList, 'C0100',dataItem.sndgDv);
				},
				//attributes: {"class": "neceMark"},
			},
			{
				width : 1,
				field : "tmplMgntNo",
				editable : function() {
					return false;
				}
			},
			{
				width : "auto",
				field : "tmplNm",
				title : SYSM434M_langMap.get("SYSM434M.grid0.col5.title"),
				attributes : {
					"class" : "bdNoneRight"
				},
				headerAttributes : {
					"colspan" : 2
				},
				editable : function(dataItem) {
					return false;
				},
				attributes : {
					//"class" : "neceMark",
					"class" : "textLeft",
					"style" : "border-right: none"
				},
			},
			{
				width : 30,
				headerAttributes : {
					"class" : "displayNon"
				},
				template : function(dataItem) {
					return '<button class="btnRefer_default icoType icoComp_zoom" title="search" onclick="SYSM434M_fnSubSYSM435POpen(this)"></button>';
				}
			},
			{
				width: "12%", field: "sndgRsvDt", title: SYSM434M_langMap.get("SYSM434M.grid0.col6.title"),
				template: function(item){
					var sndgRsvDt = SYSM434M_fnStrToYmd(item.sndgRsvDt);
					return kendo.format("{0:yyyy-MM-dd}",new Date(sndgRsvDt));
				},
				editor: function(container, options) {
					SYSM434M_fnSubGirdDateEditeTemplate(container,options,"sndgRsvDt");
				},
				attributes: {
					"class": "day"
				},
			
			},
			{
				width : "6%",
				field : "sndgTgtNcnt",
				title : SYSM434M_langMap.get("SYSM434M.grid0.col7.title"),
				attributes : {
					"class" : "textRight"
				},
			},
			{
				width : "6%",
				field : "sndgCpltNcnt",
				title : SYSM434M_langMap.get("SYSM434M.grid0.col8.title"),
				attributes : {
					"class" : "textRight"
				},
			},
			{
				width : "7%",
				field : "sndgTotzNcnt",
				title : SYSM434M_langMap.get("SYSM434M.grid0.col9.title"),
				attributes : {
					"class" : "textRight"
				},
			},
			{
				width : "10%",
				field : "procStCd",
				title : SYSM434M_langMap.get("SYSM434M.grid0.col10.title"),
				template: function (dataItem,options) {
					return Utils.getComCdNm(SYSM434M_CommCodeList, 'C0102', dataItem.procStCd);
				},
				editor: function(container,options){
					var grid = $("#gridSYSM434M_1").data("kendoGrid");
					if ((GLOBAL.session.user.usrGrd == "900" || GLOBAL.session.user.usrGrd == "910")) {
						SYSM434M_fnSubGridEditeTemplate(container, options,"C0102","select",0);
		    		} else {
		    			grid.closeCell();
		    		}
				},
			},
		],
	}).data('kendoGrid');
	
	$("#gridSYSM434M_1").data("kendoGrid").hideColumn("tmplMgntNo"); //hidden Colum
	Utils.setKendoGridDoubleClickAction("#gridSYSM434M_1");
	
	//발송 차수
	SYSM434M_Grid[1].dataSource = new kendo.data.DataSource({
        transport: {
        	read: function (options) {
        		var params = {
        				tenantId	: GLOBAL.session.user.tenantId,
        				regDt		: options.data.regDt,
        				schdNo		: options.data.schdNo,
        		}
        		Utils.ajaxCall("/sysm/SYSM434SEL02", JSON.stringify(params), function (result) {
                    options.success(JSON.parse(result.list));
                });	
            },
            update: function(options){
				//console.log("SYSM434M_Grid[1].dataSource model: \n:"+JSON.stringify(options.data.models));
				$.each(options.data.models, function(index, item){
					item.sndgStrTm = kendo.format("{0:HH:mm}", new Date(item.sndgStrTm));
				});
            },
            destroy: function (options) {
                options.success(options.data.models);
            }
        },
        requestStart: function (e) {
            var type = e.type;
            var response = e.response;
        },
        requestEnd: function (e) {
            var type = e.type;
            var response = e.response;
        },
        batch: true,
        pageSize: 1000,
        schema: {
            type: "json",
            model: {
            	id: "sndgRsvSqnc",
                fields: {
                	tenantId		: { field: "tenantId", 		type: "string", editable: false },
                	regDt			: { field: "regDt", 		type: "string", editable: false },
                	sndgRsvDt		: { field: "sndgRsvDt",		type: "string", editable: false },
                	schdNo			: { field: "schdNo", 		type: "string", editable: false },
                	sndgRsvSqnc		: { field: "sndgRsvSqnc", 	type: "string", editable: false },
                	sndgStrTm		: { field: "sndgStrTm", 	type: "string",},
                	sndgCpltDtm		: { field: "sndgCpltDtm", 	type: "string", editable: false },
                	sndgTgtNcnt		: { field: "sndgTgtNcnt", 	type: "string", editable: false },
                	sndgScssNcnt	: { field: "sndgScssNcnt", 	type: "string", editable: false },
                	sndgFailNcnt	: { field: "sndgFailNcnt", 	type: "string", editable: false },
                	sqncProcStCd	: { field: "sqncProcStCd", 	type: "string", editable: false },
                	regDtm			: { field: "regDtm", 		type: "string", editable: false },
                	regrId			: { field: "regrId", 		type: "string", editable: false },
                	regrOrgCd		: { field: "regrOrgCd", 	type: "string", editable: false },
                	lstCorcDtm		: { field: "lstCorcDtm", 	type: "string", editable: false },
                	lstCorprId		: { field: "lstCorprId", 	type: "string", editable: false },
                	lstCorprOrgCd	: { field: "lstCorprOrgCd", type: "string", editable: false },
                	abolDtm			: { field: "abolDtm", 		type: "string", editable: false },
                	abolmnId		: { field: "abolmnId", 		type: "string", editable: false },
                	abolmnOrgCd		: { field: "abolmnOrgCd", 	type: "string", editable: false },
                }
            }
        }
    });
	
	//발송 차수 그리드
	SYSM434M_Grid[1].instance = $("#gridSYSM434M_2").kendoGrid({
		noRecords: {template: '<div class="nodataMsg"><p>'+SYSM434M_langMap.get("SYSM434M.grid.info.noRecords")+'</p></div>'},
		dataSource: SYSM434M_Grid[1].dataSource,
		dataBound: function(e){
			SYSM434M_grid_fnOnDataBound(e,1);
		},
		change :function(e){
			SYSM434M_grid_fnOnChange(e, 1);
		},
		edit: function(e){
			var $grid = e.sender;
        	var obj = e.container.find("input[name=sndgStrTm]");        	
        	obj.on('keyup',function(event){
        		if($(obj).val().length > 4){
        			$(obj).val($(obj).val().substr(0,4));
        			return;
        		}
        		if(event.key >= 0 && event.key <= 9) {
				}else{
					$(obj).val($(obj).val().replaceAll(event.key,''));
					return;
				}
        	});
        	
			//그리드 내용 자동 선택
	    	$(e.container).find("input[type=text]").select();
    		
        },
		scrollable: true,
		editable: true,
		autobind: false,
		selectable: "multiple,row",
		persistSelection: true,
		sortable: false,
		resizable: true,
		columns: [
			{
				width : 30,
				selectable : true,
			},
			{
				width : "10%",
				field : "sndgRsvSqnc",
				title : SYSM434M_langMap.get("SYSM434M.grid1.col1.title"),
			},
			{
				width : "13%",
				field : "sndgRsvDt",
				title : SYSM434M_langMap.get("SYSM434M.grid1.col2.title"),
				template : function(item) {
					var sndgRsvDt = SYSM434M_fnStrToYmd(item.sndgRsvDt);
					return kendo.format("{0:yyyy-MM-dd}",new Date(sndgRsvDt));
				},
				attributes : {
					"class" : "day"
				},
			},
			{
				width : "14%",
				field : "sndgStrTm",
				title : SYSM434M_langMap.get("SYSM434M.grid1.col3.title"),
				format : "{0:HH:mm}",
				//attributes: {"class": "neceMark"},
				editor: function(container,options){
					var sndgStrTm = options.model.sndgStrTm;
					
					if(Utils.isNull(sndgStrTm) == false){
						options.model.sndgStrTm = SYSM434M_fnStrToHhMm(sndgStrTm);
					}
					
					SYSM434M_TimePickerEditor(container, options);
				},
				template: function(dataItem) {
					var sndgStrTm = dataItem.sndgStrTm;
					
					if(Utils.isNull(dataItem.sndgStrTm) == true){
						return SYSM434M_langMap.get("input.cSelect");
					} else {
						if(sndgStrTm.length > 5){
							dataItem.sndgStrTm = kendo.format("{0:HH:mm}", new Date(sndgStrTm));
						} else {
							dataItem.sndgStrTm =  SYSM434M_fnStrToHhMm(sndgStrTm);	
						}
						return dataItem.sndgStrTm;
					}
				},
			},
        	
			{width: "auto", field: "sndgCpltDtm", title: SYSM434M_langMap.get("SYSM434M.grid1.col4.title"),},
			{width: "8%", field: "sndgTgtNcnt", title: SYSM434M_langMap.get("SYSM434M.grid1.col5.title"), attributes: {"class": "textRight"},},
			{width: "8%", field: "sndgScssNcnt", title: SYSM434M_langMap.get("SYSM434M.grid1.col6.title"), attributes: {"class": "textRight"},},
			{width: "8%", field: "sndgFailNcnt", title: SYSM434M_langMap.get("SYSM434M.grid1.col7.title"), attributes: {"class": "textRight"},},
			{
				width: "14%", field: "sqncProcStCd", title: SYSM434M_langMap.get("SYSM434M.grid1.col8.title"),
				editor: function(container,options){					
					SYSM434M_fnSubGridEditeTemplate(container, options,"C0104","select",1)
				},
				template: function (dataItem) {
					return Utils.getComCdNm(SYSM434M_CommCodeList, 'C0104', dataItem.sqncProcStCd);
				}
			},
		],
	}).data('kendoGrid');

	let grid2Title4;
	let grid2Title5;
	
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		grid2Title4 = SYSM434M_langMap.get("SYSM434M.grid2.col4.title");
		grid2Title5 = SYSM434M_langMap.get("SYSM434M.grid2.col5.title");
	} else {
		grid2Title4 = "고객번호";
		grid2Title5 = "고객이름"
	}
	
	//발송 고객
	SYSM434M_Grid[2].dataSource = new kendo.data.DataSource({
        transport: {
        	read: function (options) {
        		//console.log("SYSM434M_Grid[2].dataSource >> read");
        		var params = {
        				tenantId		: GLOBAL.session.user.tenantId,
        				regDt			: options.data.regDt,
        				schdNo			: options.data.schdNo,
        				sndgRsvSqnc		: options.data.sndgRsvSqnc,
        				sndgRsvDt		: options.data.sndgRsvDt,
        				searchType 		: $("#searchType").val(),
            			search			: $("#search").val(),
            			searchSMSStcd	: $("#searchSMSStcd").val(), 
            			searchSNSSbdgDv : $("#searchSNSSbdgDv").val(),
            			searchGndrCd	: $("#searchGndrCd").val(),
        		}
        		
        		Utils.ajaxCall("/sysm/SYSM434SEL03", JSON.stringify(params), function (result) {

							      const list = JSON.parse(result.list)

										// 역순 랭크 추가
										var rankedList = list.map(item => ({
												...item,
												순번: list.slice().reverse().findIndex(i => i.sndgTgtCustSeq === item.sndgTgtCustSeq) + 1
										}));

                    options.success(rankedList);
                    //파일 초기화
                    $("#upfile").val('');
                });
        		
        		Utils.ajaxCall("/sysm/SYSM434SEL0501", JSON.stringify(params), function (result) {
                    var totCnt = result.counts.totCnt;
                    var regCnt = result.counts.regCnt;
                    var assignCnt = result.counts.assignCnt;
                    
                    $("#totCnt").text(totCnt);
                    $("#regCnt").text(regCnt);
                    $("#assignCnt").text(assignCnt);
                    
                    //차수배정 분할 화면 초기화
                    $("#strNumerator").val((regCnt>0)?regCnt:'');
                    $("#strDenominator").val('');
                    $("#strQuotient").val('');
                    $("#strRemainder").val('');
                });
            },

            destroy: function (options) {
                options.success(options.data.models);
            },
        },
        requestStart: function (e) {
            var type = e.type;
            var response = e.response;
        },
        requestEnd: function (e,options) {
        	//console.log("SYSM434M_Grid[2].dataSource >> requestEnd");
        	var response = e.response;
            var type = e.type;            
        },
        batch: true,
        pageSize: 1000,
        schema: {
            type: "json",
            model: {
                fields: {
                	sndgTgtCustSeq 	: { field: "sndgTgtCustSeq", 	type: "string", editable: false },
                	custRcgnCd 		: { field: "custRcgnCd", 		type: "string", editable: false},
                	sndgRsvSqnc 	: { field: "sndgRsvSqnc", 		type: "string", editable: false},
                	custId 			: { field: "custId", 			type: "string", editable: false},
                	custNm 			: { field: "custNm", 			type: "string", editable: false},
                	gndrCd 			: { field: "gndrCd", 			type: "string", editable: false},
//                	agelrgCd 		: { field: "agelrgCd", 			type: "string", editable: false},
                	recvrTelNo 		: { field: "recvrTelNo", 		type: "string", editable: false},
                	dpchNo 			: { field: "dpchNo", 			type: "string", editable: false},
                	smsStNm 		: { field: "smsStNm", 			type: "string", editable: false},
                	sndgCpltTm 		: { field: "sndgCpltTm", 		type: "string", editable: false},
                	smsRsltNm 		: { field: "smsRsltNm", 		type: "string", editable: false},
                	sndgRsvDt 		: { field: "sndgRsvDt", 		type: "string", editable: false},
                	sndgCpltTm 		: { field: "sndgCpltTm", 		type: "string", editable: false},
                }
            }
        }
    });
	
	SYSM434M_Grid[2].instance = $("#gridSYSM434M_3").kendoGrid({
		dataSource: SYSM434M_Grid[2].dataSource,
		noRecords: { template: '<div class="nodataMsg"><p>'+SYSM434M_langMap.get("SYSM434M.grid.info.noRecords")+'</p></div>' },
		dataBound: function(e){
			SYSM434M_grid_fnOnDataBound(e,2);
		},
		change :function(e){
			SYSM434M_grid_fnOnChange(e, 2);
		},
		autoBind: false,
		scrollable: true,
		selectable: "multiple,row",
		sortable: false,
		resizable: true,
		editable: true,
		pageable: { pageSize: 1000},		
		columns: [
			{ width: 30, selectable: true,},
			{ width: 40, field: "순번", 		title: SYSM434M_langMap.get("SYSM434M.grid2.col1.title"), },
			{ width: 0, field: "sndgTgtCustSeq", 		title: SYSM434M_langMap.get("SYSM434M.grid2.col1.title"), hidden: true},
			//{ width: 80, field: "custRcgnCd", 			title: SYSM434M_langMap.get("SYSM434M.grid2.col2.title"), },
			{ width: 60, field: "sndgRsvSqnc", 			title: SYSM434M_langMap.get("SYSM434M.grid2.col3.title"), },
			{ width: 80, field: "custId", 				title: grid2Title4, attributes: {"class": "textLeft"} },
			{ width: 65, field: "custNm", 				title: grid2Title5, attributes: {"class": "textLeft"} },
			{ width: 40, field: "gndrNm", 				title: SYSM434M_langMap.get("SYSM434M.grid2.col6.title"), },
//			{ width: 50, field: "agelrgCd", 			title: SYSM434M_langMap.get("SYSM434M.grid2.col7.title"), },
			{ width: 100, field: "dpchNo", 				title: SYSM434M_langMap.get("SYSM434M.grid2.col8.title"), attributes: {"class": "textLeft"}},
			{ width: 100, field: "recvrTelNo", 			title: SYSM434M_langMap.get("SYSM434M.grid2.col12.title"), attributes: {"class": "textLeft"}},
			{ width: 65, field: "smsStNm", 				title: SYSM434M_langMap.get("SYSM434M.grid2.col9.title"), },
			{ width: 130, field: "sndgCpltTm", 			title: SYSM434M_langMap.get("SYSM434M.grid2.col10.title"), },
			{ width: 60, field: "smsRsltNm", 			title: SYSM434M_langMap.get("SYSM434M.grid2.col11.title"), },
		],
	}).data('kendoGrid');
	

	//발송 이력
	SYSM434M_Grid[3].dataSource = new kendo.data.DataSource({
        transport: {
        	read: function (options) {
        		var params = {
        				tenantId: 		GLOBAL.session.user.tenantId,
        				schdNo: 		options.data.schdNo,
        				sndgRsvSqnc: 	options.data.sndgRsvSqnc,
        				sndgRsvDt: 		options.data.sndgRsvDt,
        				regDt: 			options.data.regDt,
        		}
        		Utils.ajaxCall("/sysm/SYSM434SEL04", JSON.stringify(params), function (result) {
                    options.success(JSON.parse(result.list));
                });
            },

            destroy: function (options) {
                options.success(options.data.models);
            },
        },
        requestStart: function (e) {
            var type = e.type;
            var response = e.response;
        },
        requestEnd: function (e) {
            var type = e.type;
            var response = e.response;
            
            //차수배정 그리드 초기화
            SYSM434M_fnSimulOrderList(0);
        },
        batch: true,
        pageSize: 1000,
        schema: {
            type: "json",
            model: {
                fields: {             	
                	
                	sndgCpltTm 		: { field: "sndgCpltTm", 		type: "string", editable: false},
                	custId 			: { field: "custId", 			type: "string", editable: false},
                	custNm 			: { field: "custNm", 			type: "string", editable: false},
                	dpchNo 			: { field: "dpchNo", 			type: "string", editable: false},
                	smsStCd 		: { field: "smsStCd", 			type: "string", editable: false},
                	smsStNm 		: { field: "smsStNm", 			type: "string", editable: false},
                	smsRsltCd 		: { field: "smsRsltCd", 		type: "string", editable: false},
                	smsRsltNm 		: { field: "smsRsltNm", 		type: "string", editable: false},
                }
            }
        }
    });
	
	let grid3Title2;
	let grid3Title3;
	
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		grid3Title2 = "환자ID";
		grid3Title3 = "환자명"
	} else {
		grid3Title2 = SYSM434M_langMap.get("SYSM434M.grid3.col2.title");
		grid3Title3 = SYSM434M_langMap.get("SYSM434M.grid3.col3.title");
	}
	
	SYSM434M_Grid[3].instance = $("#gridSYSM434M_4").kendoGrid({
		noRecords: { template: '<div class="nodataMsg"><p>'+SYSM434M_langMap.get("SYSM434M.grid.info.noRecords")+'</p></div>' },
		dataSource: SYSM434M_Grid[3].dataSource,
		autoBind: false,
		dataBound: function(){
			var totalRecords = SYSM434M_Grid[3].dataSource.total();
		},
		scrollable: true,
		//pageable: { pageSize: 10,pageSizes: [10,15,20,25,30],buttonCount: 5,refresh: true},
		pageable: { pageSize: 1000 },
		editable: false,
		edit: function(e){
			//그리드 내용 자동 선택
	    	$(e.container).find("input[type=text]").select();
		},
		columns: [
			{ width: 40, 	field: "NO", 			title: "NO", template: "#=++SYSM434M_Grid[3].record #", },
			{ width: 130, 	field: "sndgCpltTm", 	title: SYSM434M_langMap.get("SYSM434M.grid3.col1.title"),},			
			{ width: 90, 	field: "custId", 		title: grid3Title2,},
			{ width: 90, 	field: "custNm", 		title: grid3Title3,},
			{ width: 100, 	field: "dpchNo", 		title: SYSM434M_langMap.get("SYSM434M.grid3.col4.title"),},
			{ width: 65, 	field: "smsStNm", 		title: SYSM434M_langMap.get("SYSM434M.grid3.col5.title"),},
			{ width: 65, 	field: "smsRsltNm", 	title: SYSM434M_langMap.get("SYSM434M.grid3.col6.title"),},
		],

	}).data('kendoGrid');
	
	//차수배정 그리드 생성
	SYSM434M_fnSimulOrderList(0);

	//tab init
	tabSYSM434M = $("#tabSYSM434M").kendoTabStrip({
		animation: false,
		scrollable: false,
	}).data("kendoTabStrip");
	tabSYSM434M.tabGroup.find('.k-item').css('min-width', '150px');
	tabSYSM434M.select(0);
	
	Utils.setKendoGridDoubleClickAction("#gridSYSM434M_1");
	Utils.setKendoGridDoubleClickAction("#gridSYSM434M_2");
	Utils.setKendoGridDoubleClickAction("#gridSYSM434M_3");
	Utils.setKendoGridDoubleClickAction("#gridSYSM434M_4");
	Utils.setKendoGridDoubleClickAction("#gridSYSM434M_5");
	
}
////////////////////////////////////////////////////// kendo grid end /////////////////////////////////////////////////////////////

//Grid hight resiez
function SYSM434M_GridResize() {
	let screenHeight = $(window).height() - 210;     //   (헤더+ 푸터 ) 영역 높이 제외
	SYSM434M_Grid[0].instance.element.find('.k-grid-content').css('height', screenHeight / 2 - 170);
	SYSM434M_Grid[1].instance.element.find('.k-grid-content').css('height', screenHeight / 2 - 170);
	SYSM434M_Grid[2].instance.element.find('.k-grid-content').css('height', screenHeight - 605);
	SYSM434M_Grid[3].instance.element.find('.k-grid-content').css('height', screenHeight - 509);
}

//Button Event
function SYSM434M_fnOnSearchButtonClick() {
	
	SYSM434M_Grid[0].instance.clearSelection();
	SYSM434M_Grid[1].instance.clearSelection();
	SYSM434M_Grid[2].instance.clearSelection();
	SYSM434M_Grid[3].instance.clearSelection();
	
	SYSM434M_Grid[0].dataSource.read();
	SYSM434M_Grid[1].dataSource.data([ ]);
	SYSM434M_Grid[2].dataSource.data([ ]);
	SYSM434M_Grid[3].dataSource.data([ ]);
	//차수배정 그리드 생성
	SYSM434M_fnSimulOrderList(0);
}

//발송 스케쥴 저장
function SYSM434M_fnSave(gridIndex) {
	var isValid = true;
	var grid = $('#gridSYSM434M_1').data('kendoGrid');
	selectedItem = grid.dataItem(grid.select());
	var procStCd = (selectedItem == null) ? 9 : selectedItem.procStCd;
	//console.log("procStCd : " + procStCd);
	if(Number(procStCd) > 3){
		
		//kw---20230419 : 항목으 선택하지 않고 저장버튼 클릭 하면 alert 창이 뜨도록 추가
		Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.file.msg1"));
		
		isValid = false;
		return false;
	}
	 
	if (isValid) {
		$.each(SYSM434M_Grid[gridIndex].instance.dataSource.data(), function (index, item) {
//			console.log("procStCd : " + item.procStCd);
			if (gridIndex == 0) {
				if (Utils.isNull(item.sndgDv)) {
					Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnSync.msg1"));
					isValid = false;
					return false;
				}
				if (Utils.isNull(item.tmplMgntNo) ||Utils.isNull(item.tmplNm)) {
					Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnSync.msg2"));
					isValid = false;
					return false;
				}
				if (Utils.isNull(item.sndgRsvDt)) {
					Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnSync.msg3"));
					isValid = false;
					return false;
				}
			}
		});
	}

	if (isValid) {
		Utils.confirm(SYSM434M_langMap.get("SYSM434M.alert.fnSync.msg4"), function () {
			SYSM434M_Grid[gridIndex].instance.dataSource.sync().then(function (result) {
				//kw---20230419 : 저장버튼 클릭 후 선택 박스 초기화하도록 추가
				SYSM434M_Grid[gridIndex].instance.clearSelection();
			});
		});
	}
}

//발송 스케쥴 처리상태
function SYSM434M_fnUpdateProcStCd(gridIndex){
	var selectedItems = SYSM434M_Grid[gridIndex].selectedItems;
	var SYSM434M_updateRows = new Array();
	var strProcStCd = "9";
	
	$.each(selectedItems, function(index, item){
		 var params = {
   			 	tenantId  		: item.tenantId,
   	    		regDt 			: SYSM434M_fnSubDateReplace(item.regDt),
   	    		schdNo 			: item.schdNo,
   	    		lstCorprId		: GLOBAL.session.user.usrId,
   	    		lstCorprOrgCd	: GLOBAL.session.user.orgCd,
   	    		procStCd 		: strProcStCd,
		 }
		 SYSM434M_updateRows.push(params);
	 });
	
	if(SYSM434M_updateRows.length < 1){
		Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnUpdateProcStCd.msg1"));
		return;
	}
	
	Utils.confirm(SYSM434M_langMap.get("SYSM434M.alert.fnUpdateProcStCd.msg2"),function(){			 
		Utils.ajaxCall("/sysm/SYSM434UPT0102", JSON.stringify({
	    	list: SYSM434M_updateRows
	    }), function (result) {
			 
			Utils.alert(result.msg);
			
			if(result.result == "success"){
				SYSM434M_Grid[0].dataSource.read({
					tenantId : GLOBAL.session.user.tenantId,
					searchType : $('#SYSM434M input[name=searchTypeDate]').val(),
					startDate:	 SYSM434M_fnSubDateReplace($('#SYSM434M_StartDate').val()),
					endDate:	 SYSM434M_fnSubDateReplace($('#SYSM434M_EndDate').val()),
					sndgDv:		 $('#SYSM434M input[name=searchSndgDv]').val(),
					procStCd:	 $('#SYSM434M input[name=searchProcStcd]').val()
				});
			}
	    });
	 });
}

//발송 스케쥴 삭제
function SYSM434M_fnDeleteRow(gridIndex){
	var isValid = true;
	var selectedItems = SYSM434M_Grid[gridIndex].selectedItems;
	var SYSM434M_deleteRows = new Array();

	 $.each(selectedItems, function(index, item){
		 if(item.procStCd == 5){
			 Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnDeleteRow.msg1"));
			 isValid = false;
			 return false;
		 } else {
	    	 var params = {
	    			 	tenantId  		: item.tenantId,
	    	    		regDt 			: SYSM434M_fnSubDateReplace(item.regDt),
	    	    		schdNo 			: item.schdNo,
	    	    		abolmnId		: GLOBAL.session.user.usrId,
	    	    		abolmnOrgCd		: GLOBAL.session.user.orgCd
	    	}
	    	 SYSM434M_deleteRows.push(params);
		 }
	 });
	 
	 if(!isValid){
		 return;
	 }
	 
	 if(SYSM434M_deleteRows.length < 1){
		 Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnDeleteRow.msg2"));
		 return;
	 }

	 Utils.confirm(SYSM434M_langMap.get("SYSM434M.alert.fnDeleteRow.msg3"),function(){
		 
		 Utils.ajaxCall("/sysm/SYSM434DEL01", JSON.stringify({
	    	list: SYSM434M_deleteRows
	    }), function (result) {
			Utils.alert(result.msg);
			if(result.result == "success"){
				
				SYSM434M_fnOnSearchButtonClick();
			}
	    });
	 });
}

//발송 스케쥴 row 추가
function SYSM434M_fnOnAddRow(gridIndex){
	
	let row = {};
	let regInfo = {
		tenantId		: GLOBAL.session.user.tenantId,
		regrId			: GLOBAL.session.user.usrId,
		regrOrgCd		: GLOBAL.session.user.orgCd,
		lstCorprId		: GLOBAL.session.user.usrId,
		lstCorprOrgCd	: GLOBAL.session.user.orgCd
	}
	
	//발송 구분
	let focusIndex = 4;

	if (gridIndex == 0) {
		row.regDt 			= kendo.format("{0:yyyy-MM-dd}",new Date());
		row.sndgDv 			= "";
		row.tmplMgntNo		= 0;
		row.tmplNm 			= "";
		row.sndgRsvDt 		= kendo.format("{0:yyyy-MM-dd}",new Date());
		row.sndgTgtNcnt 	= 0;
		row.sndgCpltNcnt 	= 0;
		row.sndgTotzNcnt 	= 0;
		row.procStCd 		= "1";
	}
	
	SYSM434M_Grid[gridIndex].instance.dataSource.add($.extend(row, regInfo));
	SYSM434M_Grid[gridIndex].instance.refresh();
	SYSM434M_Grid[gridIndex].instance.clearSelection();
	SYSM434M_Grid[gridIndex].instance.select("tr:last");
    (SYSM434M_Grid[gridIndex].instance).tbody.find("tr:last td:eq(" + focusIndex + ")").dblclick();
    
	//	하위 그리드 초기화
	SYSM434M_fnResetSubGrids();
    
    var gridDataDel = SYSM434M_Grid[0].dataSource.data();
	console.log("gridDataDelAdd --------------------");
	console.log(gridDataDel[0]);
	console.log("gridDataDelAdd --------------------");
    
}
//Gird Event==========================================================================================================
//두번째 그리드 조회
function SYSM434M_fnSearchSubGridList(obj) {
	
	SYSM434M_Grid[1].instance.clearSelection();
	SYSM434M_Grid[2].instance.clearSelection();
	SYSM434M_Grid[3].instance.clearSelection();
	
    var selectedItem;
    
    if (obj) {
        var tr = $(obj).closest("tr");
        selectedItem = SYSM434M_Grid[0].instance.dataItem(tr);        
    } else {
        var grid = $('#gridSYSM434M_1').data('kendoGrid');
        	selectedItem = grid.dataItem(grid.select());
    }
    
    SYSM434M_regDt 			= SYSM434M_fnSubDateReplace(selectedItem.regDt);
    SYSM434M_schdNo 		= selectedItem.schdNo;
    SYSM434M_tmplMgntNo 	= selectedItem.tmplMgntNo;
    SYSM434M_sndgCtt 		= selectedItem.sndgCtt;
    SYSM434M_sndgRsvSqnc 	= selectedItem.sndgRsvSqnc;
    SYSM434M_sndgRsvDt 		= SYSM434M_fnSubDateReplace(selectedItem.sndgRsvDt);
    SYSM434M_sndgRsvTm 		= selectedItem.ndgRsvTm;
    SYSM434M_procStCd		= selectedItem.procStCd;
    
    //kw---20230421 : sms 다건 발송 - 파일불러오기 할 때 첨부파일 집어넣기
    SYSM434M_apndFileIdxNm1		= selectedItem.apndFileIdxNm1;
    SYSM434M_apndFileIdxNm2		= selectedItem.apndFileIdxNm2;
    SYSM434M_apndFileIdxNm3		= selectedItem.apndFileIdxNm3;
    SYSM434M_apndFileNm1		= selectedItem.apndFileNm1;
    SYSM434M_apndFileNm2		= selectedItem.apndFileNm2;
    SYSM434M_apndFileNm3		= selectedItem.apndFileNm3;
    SYSM434M_apndFilePsn1		= selectedItem.apndFilePsn1;
    SYSM434M_apndFilePsn2		= selectedItem.apndFilePsn2;
    SYSM434M_apndFilePsn3		= selectedItem.apndFilePsn3;
    //---------------------------------------------------------
    
    //차수가 없으면 그리드 초기화 후 중지
    if(Utils.isNull(SYSM434M_schdNo)){
    	SYSM434M_fnResetSubGrids();
    	return;
    }
    
    //발송 차수 조회
    SYSM434M_Grid[1].dataSource.read({
        tenantId	: GLOBAL.session.user.tenantId,
        schdNo		: SYSM434M_schdNo,
        regDt		: SYSM434M_regDt,
    });
    
    //발송 고객 정보 조회
    SYSM434M_Grid[2].dataSource.read({
        tenantId		: GLOBAL.session.user.tenantId,
        schdNo			: SYSM434M_schdNo,
        sndgRsvSqnc		: SYSM434M_sndgRsvSqnc,
        sndgRsvDt		: SYSM434M_sndgRsvDt,
        regDt			: SYSM434M_regDt,
		searchType 		: $("#searchType").val(),
		search			: $("#search").val(),
		searchSMSStcd	: $("#searchSMSStcd").val(), 
		searchSNSSbdgDv : $("#searchSNSSbdgDv").val(),
		searchGndrCd	: $("#searchGndrCd").val(),
    });
    
    //발송 이력 조회
    SYSM434M_Grid[3].dataSource.read({
        tenantId	: GLOBAL.session.user.tenantId,
        schdNo		: SYSM434M_schdNo,
        sndgRsvSqnc	: SYSM434M_sndgRsvSqnc,
        sndgRsvDt	: SYSM434M_sndgRsvDt,
        regDt		: SYSM434M_regDt,
    });
}

//신규
function SYSM434M_grid_fnOnDataBound(e,gridIndex){
	let grid = e.sender;
	let rows = grid.items();
	
	SYSM434M_Grid[gridIndex].record = 0;
	
	rows.off("click").on("click", function (e) {
		let dataItem = grid.dataItem(this);
		let cellIndex = $(e.target).index();

		SYSM434M_Grid[gridIndex].currentItem = dataItem;
		SYSM434M_Grid[gridIndex].currentCellIndex = cellIndex;
		
		//SYSM434M_Grid[3].record = 0;
	});
	
	SYSM434M_Grid[gridIndex].loadCount++;
	
	//첫번째 그리드를 클릭 했을 경우 하위 그리드 초기화
	$("#gridSYSM434M_1 tbody").off("click").on("click", "td", function(e) {
		
		//하위 그리드 초기화
		SYSM434M_fnResetSubGrids();
		
		SYSM434M_fnSearchSubGridList(this);
	 });
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


//발송고객 조회
function SYSM434M_fnOnSearchCustList(){
	
	var grid = $('#gridSYSM434M_1').data('kendoGrid');
	selectedItem = grid.dataItem(grid.select());
	
	if(selectedItem == null || selectedItem == 'null' || selectedItem == 'NULL'){
		return;
	}	
//	console.log("selectedItem : \n" + JSON.stringify(selectedItem));
    //발송 고객 정보 조회
    SYSM434M_Grid[2].dataSource.read({
        tenantId		: GLOBAL.session.user.tenantId,
        schdNo			: selectedItem.schdNo,
        sndgRsvSqnc		: selectedItem.sndgRsvSqnc,
        sndgRsvDt		: SYSM434M_fnSubDateReplace(selectedItem.sndgRsvDt),
        regDt			: SYSM434M_fnSubDateReplace(selectedItem.regDt),
		searchType 		: $("#searchType").val(),
		search			: $("#search").val(),
		searchSMSStcd	: $("#searchSMSStcd").val(), 
		searchSNSSbdgDv : $("#searchSNSSbdgDv").val(),
		searchGndrCd	: $("#searchGndrCd").val(),
    });
}

//발송고객 적재
function SYSM434M_fnLoadUpCustList(smsStCd){
	
	var dataCnt = SYSM434M_Grid[2].dataSource.view().length;
	
	if(dataCnt < 1){ return; }
	
	if(SYSM434M_procStCd != "1"){
		Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnLoadUpCustList.msg1"));
		return;
	}
	
	if(Utils.isNull(SYSM434M_regDt) == true || Utils.isNull(SYSM434M_schdNo) == true){
		return;
	}
	
	var params = {
			tenantId  		: GLOBAL.session.user.tenantId,
    		regDt 			: SYSM434M_regDt,
    		schdNo 			: SYSM434M_schdNo,
    		smsStCd			: smsStCd,
    		lstCorprId		: GLOBAL.session.user.usrId,
    		lstCorprOrgCd	: GLOBAL.session.user.orgCd,
	};
	
	Utils.confirm(SYSM434M_langMap.get("SYSM434M.alert.fnLoadUpCustList.msg2"),function(){
		Utils.ajaxCall("/sysm/SYSM434UPT0301", JSON.stringify(params), function (result) {
			
			Utils.alert(result.msg);
			if(result.result == "success"){
				
				//SYSM434M_fnOnSearchButtonClick();
				
				SYSM434M_fnOnSearchCustList();
			}
		});
		 
	});
}

//발송고객 발송취소
function SYSM434M_fnUpdateCustList(smsStCd){
	var dataCnt = SYSM434M_Grid[2].dataSource.view().length;
	var selectedItems = SYSM434M_Grid[2].selectedItems;
	var SYSM434M_updateCusRows = new Array();
//	console.log("SYSM434M_fnUpdateCustList : ", selectedItems);
	$.each(selectedItems, function(index, item){
		 
		var params = {
			 	tenantId  		: item.tenantId,
	    		regDt 			: SYSM434M_fnSubDateReplace(item.regDt),
	    		schdNo 			: item.schdNo,
	    		sndgTgtCustSeq	: item.sndgTgtCustSeq,
	    		smsStCd			: smsStCd,
	    		lstCorprId		: GLOBAL.session.user.usrId,
	    		lstCorprOrgCd	: GLOBAL.session.user.orgCd,
		}
	 
		SYSM434M_updateCusRows.push(params);
	});
	
	if(SYSM434M_updateCusRows.length > 0){
		 
		 Utils.confirm(SYSM434M_langMap.get("SYSM434M.alert.fnUpdateCustList.msg1"),function(){			 
			 Utils.ajaxCall("/sysm/SYSM434UPT0302", JSON.stringify({
		    	list: SYSM434M_updateCusRows
		    }), function (result) {
				 
				 Utils.alert(result.msg);
				
				 if(result.result == "success"){
					 
					 SYSM434M_fnOnSearchButtonClick();
					 
					 SYSM434M_fnOnSearchCustList();
				 }
		    });
		 });
	 }
	
}
//발송고객 삭제
function SYSM434M_fnDeleteCustList(){
	var selectedItems = SYSM434M_Grid[2].selectedItems;
	var SYSM434M_deleteCusRows = new Array();
	
	$.each(selectedItems, function(index, item){
		 
		var params = {
			 	tenantId  		: item.tenantId,
	    		regDt 			: SYSM434M_fnSubDateReplace(item.regDt),
	    		schdNo 			: item.schdNo,
	    		sndgTgtCustSeq	: item.sndgTgtCustSeq,
	    		lstCorprId		: GLOBAL.session.user.usrId,
	    		lstCorprOrgCd	: GLOBAL.session.user.orgCd,
	    		abolmnId		: GLOBAL.session.user.usrId,
	    		abolmnOrgCd		: GLOBAL.session.user.orgCd,
		}
	 
		SYSM434M_deleteCusRows.push(params);
	});

	 if(SYSM434M_deleteCusRows.length > 0){
		 
		 Utils.confirm(SYSM434M_langMap.get("common.delete.msg"),function(){			 
			 Utils.ajaxCall("/sysm/SYSM434DEL03", JSON.stringify({
		    	list: SYSM434M_deleteCusRows
		    }), function (result) {
				 
				 Utils.alert(result.msg);
				 
				 if(result.result == "success"){
					//발송 고객 정보 조회
				    SYSM434M_Grid[2].dataSource.read({
				        tenantId		: GLOBAL.session.user.tenantId,
				        schdNo			: SYSM434M_schdNo,
				        sndgRsvSqnc		: SYSM434M_sndgRsvSqnc,
				        sndgRsvDt		: SYSM434M_sndgRsvDt,
				        regDt			: SYSM434M_regDt,
						searchType 		: $("#searchType").val(),
						search			: $("#search").val(),
						searchSMSStcd	: $("#searchSMSStcd").val(), 
						searchSNSSbdgDv : $("#searchSNSSbdgDv").val(),
						searchGndrCd	: $("#searchGndrCd").val(),
				    });
				    
				    // 발송 이력 조회
					SYSM434M_Grid[3].dataSource.read({
					        tenantId	: GLOBAL.session.user.tenantId,
					        schdNo		: SYSM434M_schdNo,
					        sndgRsvSqnc	: SYSM434M_sndgRsvSqnc,
					        sndgRsvDt	: SYSM434M_sndgRsvDt,
					        regDt		: SYSM434M_regDt,
					});
				 }
		    });
		 });
	 }
}


//균등분할 실행
function SYSM434M_fnCalcCustList(){
	var totCnt = $("#totCnt").text();
	var strNumerator = $("#strNumerator").val();
	var strDenominator = $("#strDenominator").val();
	var strQuotient = $("#strQuotient").val();
	var strRemainder = $("#strRemainder").val();
	
	if(strNumerator == ""){
		Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnCalcCustList.msg1"));
		$("#strNumerator").focus();
		return;
	}
	if(strDenominator == ""){
		Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnCalcCustList.msg2"));
		$("#strDenominator").focus();
		return;
	}
	
	if( Number(strDenominator) > Number(strNumerator)){
		Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnCalcCustList.msg3"));
		return;
	}
	
	var txtResult = parseInt(strNumerator/strDenominator);
	var txtRemainder = strNumerator%strDenominator;
	
	$("#strQuotient").val(txtResult);
	$("#strRemainder").val(txtRemainder);
}

//차수배정 체크박스 중복 선택 방지
function SYSM434M_fnCheckBox(obj){
	$("input:checkbox[id=chkbx]").each(function(index, item){
		if(item != obj){
			$(this).prop('checked', false);
		}
	});
}

//차수 배정실행
function SYSM434M_fnSimulOrderList(strType){
	var $datas = new Array();
	
	var totCnt = $("#totCnt").text();
	var regCnt = $("#regCnt").text();
	var strNumerator = $("#strNumerator").val();
	var strDenominator = $("#strDenominator").val();
	var strQuotient = $("#strQuotient").val();
	var strRemainder = $("#strRemainder").val();
	
	if("0" != strType && Number(strNumerator) > Number(regCnt)){
		Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnSimulOrderList.msg1"));
		return;
	}
	
	if("1" == strType){
		for(var i=1;i<=strQuotient;i++){
			var params = {
	    			"sndgRsvSqnc": i, 
	 				"regDt" : SYSM434M_fnStrToYmd(SYSM434M_regDt), 
	 				"cnt": strDenominator,
	    	}
			$datas.push(params);
		 };
	}
	 

	$("#gridSYSM434M_5").kendoGrid({
		columns: [
			{width: 120, field: "sndgRsvSqnc", title: SYSM434M_langMap.get("SYSM434M.grid4.col1.title"),},
			{
				width: 150,
				field: "regDt",
				title: SYSM434M_langMap.get("SYSM434M.grid4.col2.title"),
				format: "{0:yyyy-MM-dd HH:mm}"
			}, 
			{width: 110, field: "cnt", title: SYSM434M_langMap.get("SYSM434M.grid4.col3.title"), attributes: {"class": "textRight"},},
			{
				width: 80,
				field: "잔량배정",
				title: SYSM434M_langMap.get("SYSM434M.grid4.col4.title"),
				template: '<span class="swithCheck"><input type="checkbox" id="chkbx" onclick="SYSM434M_fnCheckBox(this);"/><label></label></span>',
			},
		],
		noRecords: {template: '<div class="nodataMsg"><p>'+SYSM434M_langMap.get("SYSM434M.grid.info.noRecords")+'</p></div>'},
		dataSource: {
			data: $datas,
		},
		dataBound: function () {
		},
		height: 180,
		scrollable: true,
		editable: false,
	}).data('kendoGrid');
}

//배정완료
function SYSM434M_fnMakeOrderList(strType){
	var $datas = new Array();
	
	var totCnt = $("#totCnt").text();
	var regCnt = $("#regCnt").text();
	var strNumerator = $("#strNumerator").val();
	var strDenominator = $("#strDenominator").val();
	var strQuotient = $("#strQuotient").val();
	var strRemainder = $("#strRemainder").val();
	var chkbxChecked = false;
	var remainderSchdNo = 1;
	
	//잔량배정 체크
	$("input:checkbox[id=chkbx]").each(function(index, item){
		if($(this).prop('checked') == true){
			chkbxChecked = true;
			remainderSchdNo = index+1;
		}
	});
	
	if(strRemainder > 0 && chkbxChecked == false){
		$("#chkbx")[0].checked = true;
	}

	Utils.confirm(SYSM434M_langMap.get("SYSM434M.alert.fnMakeOrderList.msg1"), function(){
		var params = {
				tenantId  		: GLOBAL.session.user.tenantId,
	    		regDt 			: SYSM434M_regDt,
	    		schdNo 			: SYSM434M_schdNo,
	    		regrId			: GLOBAL.session.user.usrId,
	    		regrOrgCd		: GLOBAL.session.user.orgCd,
	    		lstCorprId		: GLOBAL.session.user.usrId,
	    		lstCorprOrgCd	: GLOBAL.session.user.orgCd,
	    		totCnt			: totCnt,
	    		regCnt			: regCnt,
				numerator 		: strNumerator,
				denominator 	: strDenominator,
				quotient 		: strQuotient,
				remainder 		: strRemainder,
				remainderSchdNo	: remainderSchdNo,
		};
		Utils.ajaxCall("/sysm/SYSM434INS02", JSON.stringify(params), function (result) {
			
			Utils.alert(result.msg);
			//console.log("result : \n " + JSON.stringify(result));			
  
			//발송 스케쥴
			SYSM434M_Grid[0].dataSource.read({
		        tenantId 	: GLOBAL.session.user.tenantId,
				searchType 	: $('#SYSM434M input[name=searchTypeDate]').val(),
				startDate	: SYSM434M_fnSubDateReplace($('#SYSM434M_StartDate').val()),
				endDate		: SYSM434M_fnSubDateReplace($('#SYSM434M_EndDate').val()),
				sndgDv		: $('#SYSM434M input[name=searchSndgDv]').val(),
				procStCd	: $('#SYSM434M input[name=searchProcStcd]').val()
			});
			
			//발송 차수 그리드 조회 실행
		    SYSM434M_Grid[1].dataSource.read({
		    	tenantId	: GLOBAL.session.user.tenantId,
				regDt		: SYSM434M_regDt,
				schdNo		: SYSM434M_schdNo,
		    });
		    
		    //발송 고객 정보 조회
			SYSM434M_Grid[2].dataSource.read({
		        tenantId		: GLOBAL.session.user.tenantId,
		        schdNo			: SYSM434M_schdNo,
		        sndgRsvSqnc		: SYSM434M_sndgRsvSqnc,
		        sndgRsvDt		: SYSM434M_sndgRsvDt,
		        regDt			: SYSM434M_regDt,
				searchType 		: $("#searchType").val(),
				search			: $("#search").val(),
				searchSMSStcd	: $("#searchSMSStcd").val(), 
				searchSNSSbdgDv : $("#searchSNSSbdgDv").val(),
				searchGndrCd	: $("#searchGndrCd").val(),
		    });
		    
		    //차수배정 그리드 초기화
			SYSM434M_fnSimulOrderList(0);
		});
	});
}

//메인 그리드 이하 초기화
function SYSM434M_fnSubSearchReset(){
	//발송 스케쥴
	SYSM434M_Grid[0].dataSource.read({
        tenantId 	: GLOBAL.session.user.tenantId,
		searchType 	: $('#SYSM434M input[name=searchTypeDate]').val(),
		startDate	: SYSM434M_fnSubDateReplace($('#SYSM434M_StartDate').val()),
		endDate		: SYSM434M_fnSubDateReplace($('#SYSM434M_EndDate').val()),
		sndgDv		: $('#SYSM434M input[name=searchSndgDv]').val(),
		procStCd	: $('#SYSM434M input[name=searchProcStcd]').val()
	});
	
    //발송 차수
	SYSM434M_Grid[1].instance.clearSelection();
	SYSM434M_Grid[1].dataSource.read({
		tenantId		: GLOBAL.session.user.tenantId,
        schdNo			: SYSM434M_schdNo,
        regDt			: SYSM434M_regDt,
	});
	
	//발송 고객 정보 조회
	SYSM434M_Grid[2].instance.clearSelection();
	SYSM434M_Grid[2].dataSource.read({
        tenantId		: GLOBAL.session.user.tenantId,
        schdNo			: SYSM434M_schdNo,
        sndgRsvSqnc		: SYSM434M_sndgRsvSqnc,
        sndgRsvDt		: SYSM434M_sndgRsvDt,
        regDt			: SYSM434M_regDt,
		searchType 		: $("#searchType").val(),
		search			: $("#search").val(),
		searchSMSStcd	: $("#searchSMSStcd").val(), 
		searchSNSSbdgDv : $("#searchSNSSbdgDv").val(),
		searchGndrCd	: $("#searchGndrCd").val(),
    });
}


//발송 차수 예약완료
function SYSM434M_fnUpdateRsvSqncComplete(attribute){
	
	var sendType = typeof attribute == 'undefined' ? null : attribute.getAttribute('data-auth-type');
	var selectedItems = SYSM434M_Grid[1].selectedItems;
	var SYSM434M_updateRows = new Array();
	var next = true;
	
	if(selectedItems.length < 1){
		Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnUpdateRsvSqncComplete.msg4"));
		return;
	}
	
	$.each(selectedItems, function(index, item){
		
		var params = {
   			 	tenantId  		: GLOBAL.session.user.tenantId,
   	    		regDt 			: item.regDt,
   	    		schdNo 			: item.schdNo,
   	    		sndgTgtCustSeq	: item.sndgTgtCustSeq,
   	    		sndgRsvSqnc		: item.sndgRsvSqnc,
   	    		//sndgStrTm		: item.sndgStrTm,
   	    		//sndgStrTm		: sndgStrTm,
   	    		lstCorprId		: GLOBAL.session.user.usrId,
   	    		lstCorprOrgCd	: GLOBAL.session.user.orgCd,   	    		
   	    		abolmnId		: GLOBAL.session.user.usrId,
	    		abolmnOrgCd		: GLOBAL.session.user.orgCd,
   	    }

		// 즉시발송 버튼 클릭 시 발송시작시간 값 세팅
		if(sendType == "INSERT") {
			params.sndgStrTm = SYSM434M_fnTimeFormat();
		}else{
			if(item.sqncProcStCd !="2"){
				next = false;
				 Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnUpdateRsvSqncComplete.msg1"));
				 return false;
			}
			 var sndgStrTm = item.sndgStrTm;
			 if(Utils.isNull(sndgStrTm) == true){
				 next = false;
				 Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnUpdateRsvSqncComplete.msg2"));
				 return false;
			 }
		}
		SYSM434M_updateRows.push(params);
	 });

	 if(next == true && SYSM434M_updateRows.length > 0){
		 
		 var msg = (sendType == "INSERT") ? SYSM434M_langMap.get("SYSM434M.alert.fnUpdateRsvSqncComplete.msg5") : SYSM434M_langMap.get("SYSM434M.alert.fnUpdateRsvSqncComplete.msg3");
		 
		 Utils.confirm(msg,function(){	
			 
			 Utils.ajaxCall("/sysm/SYSM434UPT0201", JSON.stringify({
		    	list: SYSM434M_updateRows
		    }), function (result) {
				
				Utils.alert(result.msg);
				
				if(result.result == "success"){
					//검색 조건 초기화
					SYSM434M_fnResetSearchCondition();
				    
					//메인 그리드 이하 초기화
					SYSM434M_fnSubSearchReset();
				}
		    });
		 });
	 }
}

//발송 차수 발송 취소
function SYSM434M_fnCancelRsvSqnc(){
	
	var selectedItems = SYSM434M_Grid[1].selectedItems;
	var SYSM434M_deleteRows = new Array();
	var next = true;
	
	if(selectedItems.length < 1){
		return;
	}
	
	$.each(selectedItems, function(index, item){
		
		if(item.sqncProcStCd == "4"){
			Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnCancelRsvSqnc.msg1"));
			next = false;
			return false;
		}
		
		var params = {
   			 	tenantId  		: GLOBAL.session.user.tenantId,
   	    		regDt 			: item.regDt,
   	    		schdNo 			: item.schdNo,
   	    		sndgRsvSqnc		: item.sndgRsvSqnc,
   	    		lstCorprId		: GLOBAL.session.user.usrId,
   	    		lstCorprOrgCd	: GLOBAL.session.user.orgCd,   	    		
   	    		abolmnId		: GLOBAL.session.user.usrId,
	    		abolmnOrgCd		: GLOBAL.session.user.orgCd,
   	    }
		SYSM434M_deleteRows.push(params);
	});
	
	if(next == true && SYSM434M_deleteRows.length > 0){
		 
		 Utils.confirm(SYSM434M_langMap.get("SYSM434M.alert.fnCancelRsvSqnc.msg2"),function(){	
			 
			 Utils.ajaxCall("/sysm/SYSM434UPT0202", JSON.stringify({
		    	list: SYSM434M_deleteRows
		    }), function (result) {
				 
				 Utils.alert(result.msg); 
				 
				 if(result.result == "success"){	
					//검색 조건 초기화
					SYSM434M_fnResetSearchCondition();
					
					//메인 그리드 이하 초기화
					SYSM434M_fnSubSearchReset();
				 }
				
		    });
		 });
	 }
}

//발송 차수 삭제
function SYSM434M_fnDeleteRsvSqnc(){
	
	var selectedItems = SYSM434M_Grid[1].selectedItems;
	var SYSM434M_deleteRows = new Array();
	var next = true;
	
	if(selectedItems.length < 1){
		return;
	}
	
	$.each(selectedItems, function(index, item){
		
		if(item.sqncProcStCd == "4"){
			Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnDeleteRsvSqnc.msg1"));
			next = false;
			return false;
		}
		
		var params = {
   			 	tenantId  		: GLOBAL.session.user.tenantId,
   	    		regDt 			: item.regDt,
   	    		schdNo 			: item.schdNo,
   	    		sndgRsvSqnc		: item.sndgRsvSqnc,
   	    		lstCorprId		: GLOBAL.session.user.usrId,
   	    		lstCorprOrgCd	: GLOBAL.session.user.orgCd,   	    		
   	    		abolmnId		: GLOBAL.session.user.usrId,
	    		abolmnOrgCd		: GLOBAL.session.user.orgCd,
   	    }
		SYSM434M_deleteRows.push(params);
	});
	
	if(next == true && SYSM434M_deleteRows.length > 0){
		 
		 Utils.confirm(SYSM434M_langMap.get("SYSM434M.alert.fnDeleteRsvSqnc.msg2"),function(){	
			 
			 Utils.ajaxCall("/sysm/SYSM434UPT0203", JSON.stringify({
		    	list: SYSM434M_deleteRows
		    }), function (result) {
				 
				 Utils.alert(result.msg); 
				 
				 if(result.result == "success"){	
					//검색 조건 초기화
					SYSM434M_fnResetSearchCondition();
					
					//메인 그리드 이하 초기화
					SYSM434M_fnSubSearchReset();
				 }
				
		    });
		 });
	 }
}

//발송 차수 저장
function SYSM434M_fnUpdateRsvSqnc(){
	
	var selectedItems = SYSM434M_Grid[1].selectedItems;
	var SYSM434M_updateRows = new Array();
	var next = true;
	
	if(selectedItems.length < 1){
		return;
	}
	
	$.each(selectedItems, function(index, item){
		
		if(item.sndgStrTm == null || item.sndgStrTm == ""){
			Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnUpdateRsvSqnc.msg1"));
			next = false;
			return false;
		}
		
		//진행 중 이하만 가능
		if(!(Number(item.sqncProcStCd) < 4)){
			Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.fnUpdateRsvSqnc.msg2"));
			next = false;
			return false;
		}
		
		var params = {
   			 	tenantId  		: GLOBAL.session.user.tenantId,
   	    		regDt 			: item.regDt,
   	    		schdNo 			: item.schdNo,
   	    		sndgRsvSqnc		: item.sndgRsvSqnc,
   	    		//sndgStrTm		: SYSM434M_fnTimeFormat(item.sndgStrTm),
   	    		sndgStrTm		: item.sndgStrTm.replace(":",""),
   	    		lstCorprId		: GLOBAL.session.user.usrId,
   	    		lstCorprOrgCd	: GLOBAL.session.user.orgCd,
   	    }
		SYSM434M_updateRows.push(params);
	});
	
	if(next == true && SYSM434M_updateRows.length > 0){
		 
		 Utils.confirm(SYSM434M_langMap.get("SYSM434M.alert.fnUpdateRsvSqnc.msg3"),function(){
			 Utils.ajaxCall("/sysm/SYSM434UPT0204", JSON.stringify({
		    	list: SYSM434M_updateRows
		    }), function (result) {
				 
				 Utils.alert(result.msg); 
				 
				 if(result.result == "success"){	
					//검색 조건 초기화
					SYSM434M_fnResetSearchCondition();
					
					//메인 그리드 이하 초기화
					SYSM434M_fnSubSearchReset();
				 }
				
		    });
		 });
	 }
}
//Sub Function==========================================================================================================

//Grid Editor ComboBox
function SYSM434M_fnSubGridEditeTemplate (container, options,mgntItemCd,isTotalOption,gridNumber) {
	let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);
	Utils.setKendoComboBox(SYSM434M_CommCodeList, mgntItemCd, $select, "", isTotalOption).bind("change", function (e) {
		let dataItem = SYSM434M_Grid[gridNumber].instance.dataItem(e.sender.element.closest("tr"));
		dataItem.set(options.field, e.sender.value());
		SYSM434M_Grid[gridNumber].instance.refresh();
	});
}
//Grid Editor Search PopUp
function SYSM434M_fnSubGridSearchEditeTemplate (container, option){
	$('<span class="searchTextBox" style="width: 100%;"><input type="text" class="k-input" name="'+ option.field+'"><button title="검색" onclick="SYSM434M_fnSubSYSM435POpen(this);"></button></span>').appendTo(container);
}
//Grid Editor Date
function SYSM434M_fnSubGirdDateEditeTemplate(container,options,column){
	let dateString = kendo.format("{0:yyyy-MM-dd}",new Date(options))
	let $input = $("<input data-bind='value:"+column+"' value="+ dateString +" />").appendTo(container);
	$input.kendoDatePicker({ value: dateString, culture : "ko-KR", format : "yyyy-MM-dd"});
}

//그리드 시간 선택
function SYSM434M_TimePickerEditor(container, options){
	 $('<input data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" data-format="' + options.format + '" />')
     .appendTo(container)
     .kendoTimePicker({
     	format: "0:HH:mm",
     	interval:"10", 
     	min: "00:00", 
     	max:"23:59", 
     	culture:"ko-KR", 
     	dateInput:true, 
     	componentType:"classic",
     	change: function (e) {
			//console.log("event : %o", e);
			//console.log("time : " , e.sender._oldText);
		}
    });
}

//템플릿 팝업
function SYSM434M_fnSubSYSM435POpen(obj) {
	Utils.setCallbackFunction("SYSM434M_fnCallbackSYSM435POpen", function(item){
		let dataItem = SYSM434M_Grid[0].instance.dataItem($(obj).closest("tr"));

		dataItem.set("tmplNm",item.tmplNm);
		dataItem.set("tmplMgntNo",item.tmplMgntNo);
		
		//kw--- 20230419 : 첨부파일 정보 가져오기
		let filePath 		= [];
		let fileNameOrg 	= [];
		let fileNameSave 	= [];
		let delFileName		= [];
		
		//kw--- 20230420 : 파라미터로 넘어온 첨부파일 정보 넣기
		//intItemCount 를 사용한 이유는 첨부파일이 1번 3번에만 담겨져 있을 경우 배열에 담을때 [0], [1] 번에 담기 위함
		var intItemCount = 0;
		for(var i=0; i<3; i++){		//첨부파일은 최대 3개 이므로 반복문 3번 돈다
			//첨부파일이 없을수도 있으니 null로 설정
			//null 을 집어넣게 되면 수정이 된거처럼 변경이 되는거 같음..
//			dataItem.set("apndFilePsn" + (i+1)		, null);
//			dataItem.set("apndFileNm" + (i+1)		, null);
//			dataItem.set("apndFileIdxNm" + (i+1)	, null);
			
			//첨부파일 정보가 있을 경우
			if(item.filePath[i] != null && item.filePath[i] != ""){
				//해당 배열에[intItemCount]에 값을 넣는다.
				filePath[intItemCount] 		= item.filePath[i];
				fileNameOrg[intItemCount] 		= item.fileNameOrg[i];
				fileNameSave[intItemCount] 	= item.fileNameSave[i];
				intItemCount++;
			}
		}
		
		for(var i=intItemCount; i<3; i++){
			dataItem.set("apndFilePsn" + (i+1)		, null);
			dataItem.set("apndFileNm" + (i+1)		, null);
			dataItem.set("apndFileIdxNm" + (i+1)	, null);
		}
		
		//삭제할 첨부 파일이 있을 경우
		if(item.delFileCount > 0){
			//삭제할 아이템은 3개 이상일 수 있으니 delFileCount를 가지고 있는다.
			for(var i=0; i<item.delFileCount; i++){
				delFileName[i]		= item.delFileName[i];
			}

			dataItem.set("delFileName", delFileName);
		}
		
		//팝업창 생성시 경로를 넣을 경우 특수문자들이 16진수로 넘어가기 때문에 문자열을 치환해줘야 함
		if(intItemCount > 0){
			for(var i=0; i<intItemCount; i++){
				var strFilePath = filePath[i].replace('%3A', ':');
				strFilePath = strFilePath.replaceAll('%2F', '/');
				dataItem.set("apndFilePsn"   + (i+1)		, strFilePath);
				dataItem.set("apndFileNm"    + (i+1)		, fileNameOrg[i]);
				dataItem.set("apndFileIdxNm" + (i+1)		, fileNameSave[i]);
			}
		}
		//kw----------------------------
	
		SYSM434M_Grid[0].instance.refresh();
		
		 var gridDataDel = SYSM434M_Grid[0].dataSource.data();
	});
	
	let gridData = SYSM434M_Grid[0].instance.dataItem($(obj).closest("tr"));
	console.log( "gridData : " + gridData);
	//kw--- 20230421 : 첨부파일 정보 넘기기 
	//kw--- 배열을 넘기려고 했는데... 안넘어가져서 String으로 만들고 각 파일 이름은 '|' 구분자를 사용하여 넘김
	let strDelFileName = "";
	//kw--- 삭제할 파일 정보가 있다면
	if(gridData.delFileName != null && gridData.delFileName != ""){
		//kw--- grid에 있는 정보는 배열로 갖고 있기 떄뮨에 해당 배열 만큼 반복문 수행
		for(var i=0; i<gridData.delFileName.length; i++){
			if(i !=0 ){
				//kw--- 각각의 파일명을 구분하기 위해 구분자 포함
				strDelFileName += "|";
			}
			strDelFileName += gridData.delFileName[i];
		}
	}
	
	// 템플릿 첨부파일 조회
	let params = {
			tmplMgntNo : gridData.tmplMgntNo
		,	tenantId   : GLOBAL.session.user.tenantId
	}
	
	Utils.ajaxCall("/sysm/SYSM434SEL05", JSON.stringify(params), function (result) {
		let paramData = {
				callbackKey		: 'SYSM434M_fnCallbackSYSM435POpen',
				apndFileIdxNm1	: gridData.apndFileIdxNm1,
				apndFileIdxNm2	: gridData.apndFileIdxNm2,
				apndFileIdxNm3	: gridData.apndFileIdxNm3,
				apndFileNm1		: gridData.apndFileNm1,
				apndFileNm2		: gridData.apndFileNm2,
				apndFileNm3		: gridData.apndFileNm3,
				apndFilePsn1	: gridData.apndFilePsn1,
				apndFilePsn2	: gridData.apndFilePsn2,
				apndFilePsn3	: gridData.apndFilePsn3,
				tmplNm			: gridData.tmplNm,
				tmplMgntNo		: gridData.tmplMgntNo,
				delFileName		: strDelFileName,
	    }
		
		let isNull = true;
		
		/*
		 * 기능 변경으로 미사용
		for (const e of Object.keys(paramData)) {
		    if (isNull) {
		        if (e.indexOf('apndFile') > -1) {
		            isNull = isExists(paramData[e]);
		        }
		    } else {
		        break;
		    }
		}
		*/
		
		JSON.parse(result.fileList).forEach((currentElement, index, array) => {
		    paramData['apndFileIdxNm' + (index+1)] = currentElement.upload_file_nm;
		    paramData['apndFileNm'    + (index+1)] = currentElement.orign_file_nm;
			paramData['apndFilePsn'   + (index+1)] = currentElement.file_path;
		});
		
		Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM435P", "SYSM435P", 1100, 700, paramData);
	});
	
}

function isExists(data) {
	return data==null || data==''? true : false;
}

//날짜 표현
function SYSM434M_fnStrToYmd(str){
	return (str.length == 8) ? str.substring(0,4) + "-" + str.substring(4,6) + "-" + str.substring(6,8) : str;
}
 
//날짜 '-' 제거
function SYSM434M_fnSubDateReplace(date){
	return date.replaceAll("-","");
}

//시:분 형태 변경
function SYSM434M_fnStrToHhMm(str){
	return (str.length == 4) ? str.substring(0,2) + ":" + str.substring(2,4) : str;
}

//시:분 반환 (date to hh:mm)
function SYSM434M_fnTimeFormat(date){
	var dateTime; 
	
	if(date!=null) {
		dateTime = new Date(date.replace(':', ''));
	} else{
		dateTime = new Date();
	}
	
	var hours = dateTime.getHours(); // 시
	var minutes = (date==null) ? dateTime.getMinutes() + 1 : dateTime.getMinutes();  // 분
	var seconds = dateTime.getSeconds();  // 초
	var milliseconds = dateTime.getMilliseconds(); // 밀리

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	
	return hours + "" + minutes;
}

//검색 조건 초기화
function SYSM434M_fnResetSearchCondition(){
	$('#searchType').data("kendoComboBox").value("1");
	$('#searchGndrCd').data("kendoComboBox").value("");
	$('#searchSNSSbdgDv').data("kendoComboBox").value("");
	$('#searchSMSStcd').data("kendoComboBox").value("");
}


// 고객조회 팝업
function SYSM434M_showCustomer(){
	
	
	let len = $("#gridSYSM434M_1").data("kendoGrid").tbody.find("input:checked").length;
	
	// 발송 스케줄을 선택하지 않았을 때 
	if(Utils.isNull(SYSM434M_schdNo) || len == 0){
		Utils.alert(SYSM434M_langMap.get("SYSM434M.alert.file.msg1"));
		return;
	}
	
	let param = {
			schdNo : SYSM434M_schdNo
		,	regDt : SYSM434M_regDt
		,	tmplMgntNo : SYSM434M_tmplMgntNo
		, 	apndFileIdxNm1		: SYSM434M_apndFileIdxNm1
	    , 	apndFileIdxNm2		: SYSM434M_apndFileIdxNm2
	    ,	apndFileIdxNm3		: SYSM434M_apndFileIdxNm3
	    , 	apndFileNm1			: SYSM434M_apndFileNm1
	    , 	apndFileNm2			: SYSM434M_apndFileNm2
	    , 	apndFileNm3			: SYSM434M_apndFileNm3
	    , 	apndFilePsn1		: SYSM434M_apndFilePsn1
	    , 	apndFilePsn2		: SYSM434M_apndFilePsn2
	    , 	apndFilePsn3		: SYSM434M_apndFilePsn3
	};
	
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM434P"	// url 오픈url
				, "SYSM434P"					 		// targetName 팝업이름
				, 800									// width
				, 516									// height					//kw---20240329 : SMS템플릿 고객조회 - 팝업창 사이즈 조절
				, param
	);
}

function SYSM434M_fnResetSubGrids(){
	//grid count 초기화
	SYSM434M_Grid[1].instance.clearSelection();
	SYSM434M_Grid[2].instance.clearSelection();
	SYSM434M_Grid[3].instance.clearSelection();
	
	SYSM434M_Grid[1].record = 0;
	SYSM434M_Grid[2].record = 0;
	SYSM434M_Grid[3].record = 0;
	
	SYSM434M_Grid[1].dataSource.data([]);
	SYSM434M_Grid[2].dataSource.data([]);
	SYSM434M_Grid[3].dataSource.data([]);
	
}