var FRME230P_SEARCH_DATE = {};
var FRME230P_cmmCodeList;
var FRME230P_bascAtht = "130,230,400,800,900,910";		//상담사 메뉴얼 배정 권한
var FRME230P_selItem;
 
$(document).ready(function() {

	FRME230P_userInfo = GLOBAL.session.user;
	
	FRME230P_fnSelectCmmCode();
	
	FRME230P_fnShowCnslrAsgn();
	
	$("#FRME230P_dateStart").val( kendo.format("{0:yyyy-MM-dd}",new Date()));
	$("#FRME230P_dateEnd").val(kendo.format("{0:yyyy-MM-dd}",new Date()));
	 
	 var FRME230P_comboList = [
			{ comCdNm: FRME230P_langMap.get("FRME230P.regDate"), comCd: "FRME230P_regDt" , mgntItemCd:"date"}, { comCdNm:  FRME230P_langMap.get("FRME230P.asDate"), comCd: "FRME230P_asgnDt" , mgntItemCd:"date"}
	 ]
	Utils.setKendoComboBox(FRME230P_comboList, "date", '#FRME230PSrchDt', "") ;	// 결함리포트 51 수정
	 
	FRME230P_DataSource ={
		transport: {
			read	: function (FRME230P_jsonStr) {
				// 결함리포트 54 수정
				if(FRME230P_jsonStr.data) {
					FRME230P_fnSearchTenantList();
				} else {
					Utils.ajaxCall('/frme/FRME230SEL01', FRME230P_jsonStr, FRME230P_fnResultTenantList,
						window.kendo.ui.progress($("#grdFRME230P"), true));
				}
				// 결함리포트 54 수정 end
			}
			
		},
		schema : {
			type: "json",
			model: {
				fields: {
					cabackRegDtm		: { field: "cabackRegDtm", type: "string" }, 					// 등록일자
					cabackAltmDtm		: { field: "cabackAltmDtm", type: "string" },					//할당일시
					cabackInfwShpCdNm	: { field: "cabackInfwShpCdNm", type: "string" }, 		//콜백채널경로명
					webCabackCustNm		: { field: "webCabackCustNm", type: "string" }, 			//고객명
					cabackReqTelno		: { field: "cabackReqTelno", type: "string" }, 			//콜백요청번호
					ivrAcesCd 			: { field: "ivrAcesCd", type: "string" }, 			//콜백시나리오 번호????
					cnslrId 			: { field: "cnslrId", type: "string" }, 				//상담원명
					cabackProcStCd 		: { field: "cabackProcStCd", type: "string" }, 				//콜백상태
					cabackCtt 			: { field: "cabackCtt", type: "string" }, 				//콜백내용
				}  
			}
		}
	}

	$("#grdFRME230P").kendoGrid({
		dataSource : FRME230P_DataSource,
		autoBind: false,
		height: 345,
		scrollable: true,
		resizable: false,
		//selectable: true,
		selectable : "multiple,row",
		noRecords: { template: `<div class="nodataMsg"><p>${FRME230P_langMap.get("FRME230P.grid.nodatafound")}</p></div>` },
		pageable: {refresh:false
			, pageSizes:[ 25, 50, 100, 200,  500]
			, buttonCount:10
			, pageSize : 25
			, messages: {
				display: " ",
				itemsPerPage: ""
			}
		},
		dataBound: FRME230M_onDataBound,
		columns: [
			/*{
				width: '35px',
				template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>'
			},*/
			{
				width: '35px',
				selectable: true,
			},
			{
				field: "cabackInfwShpCd",
				title: FRME230P_langMap.get("FRME230P.grid.channel"),
				type: "string",
				width:"100px",
				attributes: {
					"class": "k-text-left"
				},
				template: function (dataItem) {
					return Utils.getComCdNm(FRME230P_cmmCodeList,
					'C0236',
					dataItem.cabackInfwShpCd);
				}
			},
			{
				field: "cabackId",
				title: FRME230P_langMap.get("FRME230P.grid.callId"),
				type: "string",
				width:"150px",
				attributes: {
					"class": "k-text-left"
				}
			},
			{
				field: "cabackRegDtm",
				title:FRME230P_langMap.get("FRME230P.grid.regDtm"),
				type: "string",
				width:"150px",
			},
			{
				field: "inclTelNo",
				title:  FRME230P_langMap.get("FRME230P.grid.inclTelNo"),
				type: "string",
				width:"120px"
			},
			{
				field: "cabackReqTelno",
				title:  FRME230P_langMap.get("FRME230P.grid.cabackReqTelno"),
				type: "string",
				width:"120px"
			},
			{
				field: "cabackInclRpsno",
				title:  FRME230P_langMap.get("FRME230P.grid.cabackInclRpsno"),
				type: "string",
				width:"120px"
			},
			{
				field: "phrecKey",
				title: FRME230P_langMap.get("FRME230P.grid.vceCabackYn"),
				type: "string", width: 100,
				template: function (dataItem) {
					if (dataItem.vceCabackYn == 'Y') {
						return  '<button class="k-icon k-i-volume-up btListen" title="청취" onclick="FRME230P_fnrecPlay('+	'\''+dataItem.cabackId+'\''	+','+'\''+dataItem.cabackRegDtm+'\''+
							','+'\''+dataItem.noSwInclTelNo+'\''	+','+'\''+dataItem.cabackInclRpsno+'\''	+','+'\''+dataItem.noSwCabackReqTelno+'\''	+','+'\''+dataItem.webCabackCustNm+'\''	+
							','+'\''+dataItem.vceCabackPlyTm+'\''	+ ','+'\''+dataItem.vceCabackFilePath+'\''	+','+'\''+dataItem.sttTrnfYn+'\''	+
							')"></button>';
					}
					return  '';
				}
			},
			{
				field: "sttTrnfYn",
				title: FRME230P_langMap.get("FRME230P.grid.sttTrnfYn"),
				type: "string", width: 100
			},
			{
				headerAttributes: {"colspan": 2},
				attributes: {"class": "bdNoneRight",  style: "text-align: left;"},
				width: "150px", field: "webCabackMsg", title: FRME230P_langMap.get("FRME230P.grid.webCabackMsg")
				,editable: function (dataItem) {
					return false;
				}
			}, {
				headerAttributes: {"class": "displayNon"},attributes: {"class": "bdNoneLeft"}, width: 40,
				width: "40px",
				template: function (dataItem) {
					return '<button class="btnRefer_default icoType icoComp_zoom" title="검색" onclick="FRME230P_fnDtlPop(this)"></button>';
				},
			},
			{
				field: "cntcCustNmMsk",
				title: GLOBAL.session.user.dmnCd == '200'||GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202'? FRME230P_langMap.get("FRME230P.grid.patientNm") : FRME230P_langMap.get("FRME230P.grid.cntcCustNm"),
				type: "string" ,
				width:"120px" ,
				attributes: {style: "text-align : left;", class: "tdTooltip"},
			},
			{
				field: "cnslrId",
				title:  FRME230P_langMap.get("FRME230P.grid.cnslrId"),
				type: "string",
				width:"104px",
				attributes: {
					"class": "k-text-left"
				},
				template: function (dataItem) {
					if (!Utils.isNull(dataItem.cnslrId)) {
						return dataItem.cnslrNm + "(" + dataItem.cnslrId + ")";
					}
					return '';
				}
			},
			{
				field: "cabackProcStCd",
				title:  FRME230P_langMap.get("FRME230P.grid.cabackStCd"),
				type: "string",
				width:"80px",
				template: function (dataItem) {
					return Utils.getComCdNm(FRME230P_cmmCodeList,'C0119',dataItem.cabackProcStCd);
				}
			},
			{
				field: "vceCabackFilePathPop",
				hidden: true,
			},
		],
	});
	
	FRME230P_grdFRME230P = $("#grdFRME230P").data("kendoGrid");
	
	/*알람 확인 처리*/
	FRME230P_grdFRME230P.tbody.on("click", function(FRME230P_e){
        var row = $(FRME230P_e.target).closest("tr");
        var FRME230P_item = FRME230P_grdFRME230P.dataItem(row);
        
		FRME230P_fnUpdateSttd(FRME230P_item);
	});
	
	//툴팁
	$("#grdFRME230P").kendoTooltip({
		filter: ".tdTooltip",
        position: "right",
		autoHide:true,
       // width: 200,
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
            let dataItem = FRME230P_grdFRME230P.dataItem(e.target.closest("tr"));
			if(e.target.closest("td").index()==9){
				return dataItem.cabackCtt;
			}else{
				return dataItem.webCabackCustNm;
			}
        }
    }).data("kendoTooltip")

	FRME230P_fnSearchTenantList();
});

//그리드 조회
function FRME230P_fnSearchTenantList(){
	
	// date radio checked select
	var FRME230P_srchDt;
	if($("#FRME230PSrchDt").val() == "FRME230P_regDt"){
		FRME230P_srchDt ='regDt';
	}else{
		FRME230P_srchDt ='assDt';
	}
	// channel radio checked select
	var FRME230P_srchChn;
	// $("#FRME230PSrchChn input[type=radio]").each(function (idx, row) {
	// 	if($(row).prop("checked")){
	// 		if($(row).prop("id") == "FRME230P_ars"){
	// 			FRME230P_srchChn ='01';
	// 		}else{
	// 			FRME230P_srchChn ='02';
	// 		}
	// 	}
	// });
	FRME230P_srchChn = $("#FRME230PSrchChn").val();
	
	// channel radio checked select
	var FRME230P_srchStus = $('#FRME230P_cobSt').val();
	var FRME230P_dateReg = /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/;
	
	// var FRME230P_srchDtFrom = $('#FRME230P input[name=edtRegDtFrom]').val();
	// var FRME230P_srchDtTo= $('#FRME230P input[name=edtRegDtTo]').val();

	var FRME230P_srchDtFrom = $('#FRME230P_dateStart').val();
	var FRME230P_srchDtTo= $('#FRME230P_dateEnd').val();
	
	if(!FRME230P_srchDtFrom && !FRME230P_dateReg.test(FRME230P_srchDtFrom)){
		Utils.alert(FRME230P_langMap.get("FRME230P.selStdt"));

		return;
	}
	if(!FRME230P_srchDtTo &&  !FRME230P_dateReg.test(FRME230P_srchDtTo)){
		Utils.alert(FRME230P_langMap.get("FRME230P.selEdDt"));
		return;
	}

	var bascUsrGrd = FRME230P_userInfo.usrGrd;
	//console.log("bascUsrGrd : " , bascUsrGrd);
	
	if(FRME230P_bascAtht.includes(bascUsrGrd)){
		var FRME230P_data = {
				tenantId			: FRME230P_userInfo.tenantId,
				srchDt 				: FRME230P_srchDt, 
				cabackInfwShpCd 	: FRME230P_srchChn,
				cabackProcStCd 		: FRME230P_srchStus,
				srchDtFrom			: FRME230P_srchDtFrom,
				srchDtTo 			: FRME230P_srchDtTo,
				usrGrd 				: GLOBAL.session.user.usrGrd
	       };	
		
	} else {
		var FRME230P_data = { 
				tenantId			: FRME230P_userInfo.tenantId,
				srchDt 				: FRME230P_srchDt, 
				cabackInfwShpCd 	: FRME230P_srchChn,
				cabackProcStCd 		: FRME230P_srchStus,
				srchDtFrom			: FRME230P_srchDtFrom,
				srchDtTo 			: FRME230P_srchDtTo,
				usrId				: FRME230P_userInfo.usrId,
				usrGrd 				: GLOBAL.session.user.usrGrd
       };
	}

	var FRME230P_jsonStr = JSON.stringify(FRME230P_data);

	FRME230P_DataSource.transport.read(FRME230P_jsonStr);

}

function FRME230P_fnResultTenantList(FRME230P_data){
	window.kendo.ui.progress($("#grdFRME230P"), false)

	var FRME230P_jsonEncode = JSON.stringify(FRME230P_data.FRME230PInfo);
	var FRME230P_obj = JSON.parse(FRME230P_jsonEncode);
	var FRME230P_jsonDecode = JSON.parse(FRME230P_obj);

	FRME230P_grdFRME230P.dataSource.data(FRME230P_jsonDecode);
	FRME230P_grdFRME230P.dataSource.options.schema.data = FRME230P_jsonDecode;
}

function FRME230P_fnSelectCmmCode() {
    let FRME230P_data = {
        "codeList": [
            {"mgntItemCd": "C0117"},
            {"mgntItemCd": "C0118"},
            {"mgntItemCd": "C0119"},
            {"mgntItemCd": "C0120"},
			{"mgntItemCd": "C0236"},
        ]
    };
    Utils.ajaxCall(
        "/comm/COMM100SEL01", JSON.stringify(FRME230P_data), FRME230P_fnsetCmmCode)
}

function FRME230P_fnsetCmmCode(data) {
    FRME230P_cmmCodeList = JSON.parse(data.codeList);

	if(FRME230P_userInfo.usrGrd=='130' || FRME230P_userInfo.usrGrd=='230' || FRME230P_userInfo.usrGrd == '900'){
		Utils.setKendoComboBox(FRME230P_cmmCodeList, "C0119", "#FRME230P_cobSt", "", true);

	}else{
		let FRME230P_cobStCombo = [];
		let cnslCd = ['100', '110', '130', '131', '200'];
		FRME230P_cmmCodeList.forEach(function(val) {
			if(val.mgntItemCd == "C0119" && cnslCd.includes(val.comCd)){
				let FRME230P_comb = {"comCd" : val.comCd, "comCdNm" : val.comCdNm ,  mgntItemCd:"C0119"};
				FRME230P_cobStCombo.push(FRME230P_comb)
			}
		});
		Utils.setKendoComboBox(FRME230P_cobStCombo, "C0119", '#FRME230P_cobSt', "", true) ;
	}

	//ivr 콜백만 등록
	let FRME230P_IVRcombo = [
		{ comCdNm: FRME230P_langMap.get("FRME230P.ivrCallback"), comCd: "01" , mgntItemCd:"C0236"}
	]
	//Utils.setKendoComboBox(FRME230P_IVRcombo, "C0236", '#FRME230PSrchChn', "01") ;
	Utils.setKendoComboBox(FRME230P_cmmCodeList, "C0236", "#FRME230PSrchChn", "", true);
}

/*상담원 수동배정 : 보이기*/ 
function FRME230P_fnShowCnslrAsgn(){
	var bascUsrGrd = FRME230P_userInfo.usrGrd;
	if(FRME230P_bascAtht.includes(bascUsrGrd)){
		$("#cnslrAsgn").show();
	} else {
		$("#cnslrAsgn").hide();
	}
	
	FRME230P_fnGetCnslrList();
}

/*상담원 수동배정 : 상담원 조회*/
function FRME230P_fnGetCnslrList(){
	var FRME230P_data = {
		tenantId			: FRME230P_userInfo.tenantId,
	};
	Utils.ajaxCall('/frme/FRME230SEL03', JSON.stringify(FRME230P_data), function (result) {
		Utils.setKendoComboBoxCustom(result.list, "#FRME230CnslrId", "usrNm", "usrId","","선택");
	},false,false,false);
}

/*상담사 수동 배정 : 배정 실행*/
function FRME230P_fnSetCnslrAsgn(){
	
	var FRME230P_grid 			= $("#grdFRME230P").data("kendoGrid");
	var FRME230P_selectedRows 	= FRME230P_grid.select();
	var FRME230P_updateRows 	= [];
	var usrId 					= $("#FRME230CnslrId").val();
	var next 					= true;
	
	if(Utils.isNull(usrId) == true){
		Utils.alert(FRME230P_langMap.get("FRME230P.selectCnsl"));
		//$("#FRME230CnslrId").data("kendoComboBox").focus();
		return;
	}
	
	//값 셋팅
	FRME230P_selectedRows.each(function(index, row) {
		var selectedItem = FRME230P_grid.dataItem(row);
		var params = {
			tenantId  			: selectedItem.tenantId,
			cabackAcpnNo		: selectedItem.cabackAcpnNo,		//기존
			cnslrId				: selectedItem.cnslrId,				//기존
			usrId				: $("#FRME230CnslrId").val(),		//배정 대상
			regrId				: FRME230P_userInfo.usrId,
			regrOrgCd			: FRME230P_userInfo.orgCd,
			lstCorprId			: FRME230P_userInfo.usrId,
			lstCorprBlngOrgCd	: FRME230P_userInfo.orgCd,
		}
		
		//C0119 > 5:완료
		if(selectedItem.cabackProcStCd == "140"){
			next = false;
			Utils.alert(FRME230P_langMap.get("FRME230P.incComp"));
			return false;
		}
		FRME230P_updateRows.push(params);
	  
	});
	
	if(FRME230P_updateRows.length < 1){
		Utils.alert(FRME230P_langMap.get("FRME230P.selCall"));
		return;
	}
	
	if(FRME230P_updateRows.length > 0 && next == true){
		Utils.confirm(FRME230P_langMap.get("FRME230P.saveAssign"),function(){
			Utils.ajaxCall("/frme/FRME230UPT03", JSON.stringify({ list: FRME230P_updateRows }), function (result) {
				Utils.alert(result.msg);
				if(result.result == "success"){
					//다시 조회
					FRME230P_fnSearchTenantList();
				}
			});
		});
	}
}

/*상담 메인 - 이동 */
function FRME230P_fnCnslTab(){

	var FRME230P_grid 			= $("#grdFRME230P").data("kendoGrid");
	var FRME230P_selectedRows 	= FRME230P_grid.select();
	var FRME230P_cabackAcpnNo 	= [];
	var cabackAcpnNo			= "";
	
	//값 셋팅
	FRME230P_selectedRows.each(function(index, row) {
		var selectedItem = FRME230P_grid.dataItem(row);
		
		cabackAcpnNo = selectedItem.cabackAcpnNo;

		FRME230P_cabackAcpnNo.push(cabackAcpnNo);
	});
	
	if(FRME230P_cabackAcpnNo.length > 1){
		Utils.alert(FRME230P_langMap.get("FRME230P.selOne"));
		return;
	}
	
	if(cabackAcpnNo == ""){
		Utils.alert(FRME230P_langMap.get("FRME230P.selCallBack"));
		return;
	}

	Utils.getParent().TabUtils.openCnslMainTab(2,cabackAcpnNo,FRME230P_langMap.get("CNSL.Comm.Not.Found.cnsl.Main"),"pop");
	// if(Utils.getParent().frme_head_CMS.length>0){
	// 	if(Utils.getParent().MAINFRAME_SUB.isTabOpen(Utils.getParent().frme_head_CMS[0])==true){
	// 		new Function('Utils.getParent().'+Utils.getParent().frme_head_CMS[0]+'TabSel("2",'+cabackAcpnNo+')')();
	// 	}
	// 	Utils.getParent().MAINFRAME_SUB.openDataFrameById(Utils.getParent().frme_head_CMS[0], {gridNum : 2, gridKey:cabackAcpnNo});
	// }else{
	// 	Utils.alert(FRME230P_langMap.get("CNSL.Comm.Not.Found.cnsl.Main"));
	// }
}

 // grid template 공통코드값 반영
 function FRME230P_fnSetComcd(FRME230P_cmmCd, FRME230P_cmmType){
	 for (let i = 0; i < FRME230P_cmmCodeList.length; i++) {
		 if(FRME230P_cmmCodeList[i].mgntItemCd == FRME230P_cmmType && FRME230P_cmmCodeList[i].comCd == FRME230P_cmmCd){
			 return FRME230P_cmmCodeList[i].comCdNm
		 }
	 }
	 return FRME230P_cmmCd;
 }

 /*데이터 로딩 완료*/
 function FRME230M_onDataBound(){
//	 $("#grdFRME230P").on('click','tbody tr[data-uid]',function (FRME230P_e) {
//		 let FRME230P_cell = $(FRME230P_e.currentTarget);
//		 let FRME230P_item	= FRME230P_grdFRME230P.dataItem(FRME230P_cell.closest("tr"));
//		 FRME230P_fnUpdateSttd(FRME230P_item);
//	 })
 }
 
/*알람 확인 여부 업데이트 */
function FRME230P_fnUpdateSttd(item) {
	let FRME230P_data = {
		tenantId : item.tenantId,
		cabackAcpnNo : item.cabackAcpnNo,
		//cabackProcStCd : '120',
		//cnslrId : GLOBAL.session.user.usrId,
		usrId : GLOBAL.session.user.usrId,
		usrOrgCd : GLOBAL.session.user.orgCd
	}

	let FRME230P_jsonStr = JSON.stringify(FRME230P_data);

	// 업데이트 완료 후 조회를 진행하면 선택이 해제 됨.
	// Utils.ajaxCall('/frme/FRME230UPT01', FRME230P_jsonStr,FRME230P_fnSearchTenantList);
	Utils.ajaxCall('/frme/FRME230UPT02', FRME230P_jsonStr);
}
 
 //말줄임
 function msgFRME230(str) {
	if (typeof str == 'undefined' || str == null) {
		return ''
	} else {
		if (str.length < 26) {
			return str
		} else {
			return str.substring(0, 25) + "..."
		}
	}
}

// 회수
function FRME230P_fnSetBackAsgn(){

	let FRME230P_grid 			= $("#grdFRME230P").data("kendoGrid");
	let FRME230P_selectedRows 	= FRME230P_grid.select();
	let FRME230P_updateRows2 	= [];
	let next 					= true;

	//값 셋팅
	FRME230P_selectedRows.each(function(index, row) {
		var selectedItem = FRME230P_grid.dataItem(row);
		var params = {
			tenantId  			: selectedItem.tenantId,
			cabackAcpnNo		: selectedItem.cabackAcpnNo,		//기존
			cnslrId				: selectedItem.cnslrId,				//기존
			usrId				: '',		//배정 대상
			regrId				: FRME230P_userInfo.usrId,
			regrOrgCd			: FRME230P_userInfo.orgCd,
			lstCorprId			: FRME230P_userInfo.usrId,
			lstCorprBlngOrgCd	: FRME230P_userInfo.orgCd,
		}

		//C0119 > 5:완료
		if(selectedItem.cabackProcStCd == "140"){
			next = false;
			Utils.alert(FRME230P_langMap.get("FRME230P.incComp"));
			return false;
		}

		FRME230P_updateRows2.push(params);

	});

	if(FRME230P_updateRows2.length < 1){
		Utils.alert(FRME230P_langMap.get("FRME230P.selBack"));
		return;
	}

	if(FRME230P_updateRows2.length > 0 && next == true){
		Utils.confirm(FRME230P_langMap.get("FRME230P.saveBack"),function(){
			Utils.ajaxCall("/frme/FRME230UPT04", JSON.stringify({ list: FRME230P_updateRows2 }), function (result) {
				if(result.result>0){
					Utils.alert(FRME230P_langMap.get("FRME230P.cmplBack"));
					//다시 조회
					FRME230P_fnSearchTenantList();
				}else{
					Utils.alert(FRME230P_langMap.get("FRME230P.failBack"));
				}
			});
		});
	}
}

function FRME230P_fnDtlPop(obj){
	FRME230P_selItem = FRME230P_grdFRME230P.dataItem($(obj).closest("tr"));
	console.log(FRME230P_selItem)
	Utils.openPop(GLOBAL.contextPath + "/frme/FRME231P", "FRME231P", 1000, 800);
}


function FRME230P_fnrecPlay(CallId, StartTime, Ani, Dnis, TelePhone, CustomName, Duration, Filename, useSTT) {
	
	let isopen = window.opener.xbox.connect.isopen();
	
	if(isopen != true){
		Utils.alert("CTI 로그인 후 이용해 주세요.");
		$("#CNSL106P_phrecKey").removeClass("Active");

	} else {
		window.opener.xbox.connect.send('Record', 'VoiceCallbackPlay', {
			CallId: CallId,
			StartTime: StartTime,
			Ani: Ani,
			Dnis: Dnis,
			TelePhone: TelePhone,
			CustomName: CustomName,
			Duration: Duration,
			Filename: Filename,
			useSTT: useSTT
		});
	}
}
