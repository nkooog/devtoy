1/***********************************************************************************************
 * Program Name : 태넌트기본정보(SYSM110T.js)
 * Creator      : bykim
 * Create Date  : 2022.01.25
 * Description  : 태넌트기본정보
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.01.25     bykim            최초작성   
 ************************************************************************************************/
var SYSM110T_url, SYSM110T_grdSYSM110T, SYSM110T_option, SYSM110T_svcList=[], SYSM110T_cmmCodeList, SYSM110T_chkId=false;

$(document).ready(function () {
	// 공통코드
	SYSM110T_fnSelectCombo();
	
	// 달력 초기화
	$("#SYSM110T_edtSvcContDt").kendoDatePicker({ value: new Date(), culture : "ko-KR", format : "yyyy-MM-dd"});
	$("#SYSM110T_edtSvcExpryDt").kendoDatePicker({value: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), culture : "ko-KR", format : "yyyy-MM-dd"});
	$("#SYSM110T_edtSvcBegDt").kendoDatePicker({ value: new Date(), culture : "ko-KR", format : "yyyy-MM-dd"});
	$("#SYSM110T_edtSvcTrmnDt").kendoDatePicker({ value: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), culture : "ko-KR", format : "yyyy-MM-dd"});
	
	let checkAuth = $('#SYSM110T_btnSave2').css('display');
	if(checkAuth == 'none' ){
		$('#SYSM110T_btnGridRowAdd').prop('disabled', true);
	}else{
		$('#SYSM110T_btnGridRowAdd').prop('disabled', false);
	}
	
	SYSM110T_DataSource ={
			transport: {
				read	: function (SYSM110T_jsonStr) {
					if(Utils.isNull(SYSM110T_jsonStr.data)){
						Utils.ajaxCall('/sysm/SYSM110SEL02', SYSM110T_jsonStr, SYSM110T_fnResultTenant, 
								window.kendo.ui.progress($("#grdSYSM110T"), true), window.kendo.ui.progress($("#grdSYSM110T"), false)) 
					}else{
						window.kendo.ui.progress($("#grdSYSM110T"), false)
					}
				}
				
			},
		batch: true,
			schema : {
				type: "json",
				model: {
					id: "id",
					fields: {
						adtnSvcSeq			: { field: "adtnSvcSeq", type: "string",  editable: false },
						
					}  
				}
			}
	}

	$("#grdSYSM110T").kendoGrid({
		dataSource : SYSM110T_DataSource,
		autoBind: false,
		sortable: true,
		resizable: true,
		scrollable: true,
		selectable: 'multiple',
		noRecords: { template: `<div class="nodataMsg"><p>${SYSM100M_langMap.get("SYSM100M.grid.nodatafound")}</p></div>` },
		pageable: {refresh:false
			, pageSizes:[ 25, 50, 100, 200,  500]
			, buttonCount:10
			, pageSize : 25
			, messages: {
				display: " "
				, empty: SYSM100M_langMap.get("SYSM100M.grid.message")
				, itemsPerPage: ""
			    }
		},
		columns: [ 
			{
				selectable: true,
				width: 50,
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
				field: "adtnSvcSeq", title: '순번'
				, type: "string",  width: 50 
			},
			{
				headerAttributes: {"colspan": 2},
				attributes: {"class": "bdNoneRight",  style: "text-align: left;"},
				field: "adtnSvcNm", title: "부가서비스",  width: 150
				,editable: function (dataItem) {
					return false;
				},
				template: function (dataItem) {
					return Utils.getComCdNm(SYSM110T_cmmCodeList, 'C0011', $.trim(dataItem.adtnSvcCd));
				}
			},
			{
				headerAttributes: {"class": "displayNon"}, field: "adtnSvcCd",
				width: "40px",
				template: function (dataItem) {
					return '<button class="btnRefer_default icoType icoComp_zoom" title="검색" onclick="SYSM110T_fnSearchTemplate(this)"></button>';
				},
			},
			
			{
				field: "connAddr", title: '접속주소'
				,type: "string", attributes: {"class": "k-text-left"}
			},
			{
				field: "lcnsCunt", title: '라이선스개수'
				,type: "string", width: 120, attributes: {"class": "k-text-left"}
			},
			{
				field: "useDvCd", title:'사용구분'
				,type: "string", width:  80,
				template: function (dataItem) {
                  return Utils.getComCdNm(SYSM110T_cmmCodeList, 'C0003', $.trim(dataItem.useDvCd));
				},
				 editor: function (container, options) {
                     SYSM110T_grid_fnComboEditor(container, options, 0, "C0003",SYSM100M_langMap.get("SYSM100M.comboSelect"));
                 }
			}]
	});

	SYSM110T_grdSYSM110T = $("#grdSYSM110T").data("kendoGrid");
	
	if(SYSM110T_grdSYSM110T != undefined){
		let screenHeight = $(window).height()-320;
		SYSM110T_grdSYSM110T.element.find('.k-grid-content').css('height', screenHeight-635); //sukim, 스크롤 안생기도록 조정 605 ->635
	}
	Utils.setKendoGridDoubleClickAction("#grdSYSM110T");
});

//콤보값 조회
function SYSM110T_fnSelectCombo(){
	
	SYSM110T_mgntItemCdList = [
		{"mgntItemCd":"C0002"},
		{"mgntItemCd":"C0007"},
		{"mgntItemCd":"C0008"},
		{"mgntItemCd":"C0010"},
		{"mgntItemCd":"C0113"},
		{"mgntItemCd":"C0011"},
		{"mgntItemCd":"C0003"},
		{"mgntItemCd":"C0111"},
		{"mgntItemCd":"C0193"},
		{"mgntItemCd":"C0195"}
	];
	
	Utils.ajaxCall('/comm/COMM100SEL01',  JSON.stringify({ "codeList": SYSM110T_mgntItemCdList}), SYSM110T_fnSetcombo) 
}

function SYSM110T_fnSetcombo(SYSM110T_data){
	
	let SYSM110T_jsonEncode = JSON.stringify(SYSM110T_data.codeList);
	let SYSM110T_object=JSON.parse(SYSM110T_jsonEncode);
	let SYSM110T_jsonDecode = JSON.parse(SYSM110T_object);

	 SYSM110T_cmmCodeList = SYSM110T_jsonDecode;

	//도메인 코드
	Utils.setKendoComboBox(SYSM110T_cmmCodeList, "C0002", '#SYSM110T_cobDmnCd', "", SYSM100M_langMap.get("SYSM100M.comboSelect")) ;
	//소프트폰 유형 코드
	Utils.setKendoComboBox(SYSM110T_cmmCodeList, "C0195", '#SYSM110T_cobSpTypCd', "10", SYSM100M_langMap.get("SYSM100M.comboSelect")) ;
	//태넌트 상태코드
	Utils.setKendoComboBox(SYSM110T_cmmCodeList, "C0007", '#SYSM110T_cobTenantStCd', "",  SYSM100M_langMap.get("SYSM100M.comboSelect")) ;
	//태넌트 상태 사유 코드
	Utils.setKendoComboBox(SYSM110T_cmmCodeList, "C0008", '#SYSM110T_cobTenantStRsnCd', "",  SYSM100M_langMap.get("SYSM100M.comboSelect"));
	$('#SYSM110T_cobTenantStRsnCd').data("kendoComboBox").enable(false);
	
	//조직레벨수
	Utils.setKendoComboBox(SYSM110T_cmmCodeList, "C0010", '#SYSM110T_cobOrgLvlCntCd', "", SYSM100M_langMap.get("SYSM100M.comboSelect"));
	
	//서비스_유형_코드
	Utils.setKendoComboBox(SYSM110T_cmmCodeList, "C0113", '#SYSM110T_cobSvcTypCd01', "", SYSM100M_langMap.get("SYSM100M.comboSelect"));
	//사용자 계정 수 
	Utils.setKendoComboBox(SYSM110T_cmmCodeList, "C0193", '#SYSM110T_cobUsrAcCnt', "", SYSM100M_langMap.get("SYSM100M.comboSelect")) ;
	//다국어 코드
	Utils.setKendoComboBox(SYSM110T_cmmCodeList, "C0111", '#SYSM110T_cobMlingCd', "ko", SYSM100M_langMap.get("SYSM100M.comboSelect")) ;

}

function SYSM110T_grid_fnComboEditor(container, options, gridIndex, code, isTotalOption) {
    let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);

    Utils.setKendoComboBox(SYSM110T_cmmCodeList, code, $select, "", isTotalOption).bind("change", function (e) {
        let element = e.sender.element;
        let row = element.closest("tr");
        let dataItem = SYSM110T_grdSYSM110T.dataItem(row);

        dataItem.set(options.field, e.sender.value());

        SYSM110T_grdSYSM110T.refresh();
    });
}


//태넌트 상세정보 조회
function SYSM110T_fnUpdateValue(SYSM110T_item){
	
	$('#SYSM110T_edtTenantId').prop('disabled', true);
	
	SYSM110T_fnSetInit();
	
	$('#SYSM110T_edtTenantId').val(SYSM110T_item.tenantId);
	
	$('#SYSM110T_cobDmnCd').data("kendoComboBox").value(SYSM110T_item.dmnCd);
	$('#SYSM110T_cobSpTypCd').data("kendoComboBox").value(SYSM110T_item.spTypCd);
	$('#SYSM110T_cobTenantStCd').data("kendoComboBox").value(SYSM110T_item.tenantStCd);
	$('#SYSM110T_cobTenantStRsnCd').data("kendoComboBox").value(SYSM110T_item.tenantStRsnCd);
	SYSM110T_fnChgCobTenantStCd(SYSM110T_item.tenantStCd);
	$('#SYSM110T_cobSvcTypCd01').data("kendoComboBox").value(SYSM110T_item.svcTypCd);
	$('#SYSM110T_cobUsrAcCnt').data("kendoComboBox").value(SYSM110T_item.usrAcCnt);
	$('#SYSM110T_cobMlingCd').data("kendoComboBox").value(SYSM110T_item.mlingCd);
	$('#SYSM110T_cobOrgLvlCntCd').data("kendoComboBox").value(SYSM110T_item.orgLvlCd);
	
	$('#SYSM110T_edtTenantKorNm').val(SYSM110T_item.fmnm);
	$('#SYSM110T_edtTenantEngNm').val(SYSM110T_item.fmnmEng);
	$('#SYSM110T_edtReprKorNm').val(SYSM110T_item.reprNm);
	$('#SYSM110T_edtReprEngNm').val(SYSM110T_item.reprNmEng);
	$('#SYSM110T_edtEml').val(SYSM110T_item.emlSndGrpsAddr);
	
	
	if(SYSM110T_item.svcContDd){
		let SYSM110T_svcContDd = kendo.format("{0:yyyy-MM-dd}",new Date(SYSM110T_item.svcContDd));
		$('#SYSM110T_edtSvcContDt').val(SYSM110T_svcContDd);
	}
	if(SYSM110T_item.svcBltnDd){
		let SYSM110T_svcBltnDd = kendo.format("{0:yyyy-MM-dd}",new Date(SYSM110T_item.svcBltnDd));
		$('#SYSM110T_edtSvcBegDt').val(SYSM110T_svcBltnDd);
	}
	if(SYSM110T_item.svcExpryDd){
		let SYSM110T_svcExpryDd = kendo.format("{0:yyyy-MM-dd}",new Date(SYSM110T_item.svcExpryDd));
		$('#SYSM110T_edtSvcExpryDt').val(SYSM110T_svcExpryDd);
	}
	if(SYSM110T_item.svcTrmnDd){
		let SYSM110T_svcTrmnDd = kendo.format("{0:yyyy-MM-dd}",new Date(SYSM110T_item.svcTrmnDd));
		$('#SYSM110T_edtSvcTrmnDt').val(SYSM110T_svcTrmnDd);
	}
	
	let SYSM110T_tenantId = $('#SYSM110T_edtTenantId').val() ;
	let SYSM110T_data = {tenantId:SYSM110T_tenantId};
	let SYSM110T_jsonStr = JSON.stringify(SYSM110T_data);
	
	SYSM110T_DataSource.transport.read(SYSM110T_jsonStr);
}	

//테넌트  상세 조회결과
function SYSM110T_fnResultTenant(SYSM110T_data){
	let SYSM110T_jsonEncode = JSON.stringify(SYSM110T_data.SYSM110VOInfo);
	let SYSM110T_obj=JSON.parse(SYSM110T_jsonEncode);
	let SYSM110T_jsonDecode = JSON.parse(SYSM110T_obj);
	
	SYSM110T_svcList = SYSM110T_jsonDecode;
	
	SYSM110T_grdSYSM110T.dataSource.data(SYSM110T_jsonDecode);
}

$('#SYSM110T_btnGridRowAdd').off("click").on('click', function () {
	let SYSM110T_dataLength = SYSM110T_grdSYSM110T.dataSource.data().length;
		if( SYSM110T_dataLength>0){
			let SYSM110T_newRow = {adtnSvcSeq : (SYSM110T_grdSYSM110T.dataSource.data()[SYSM110T_dataLength-1].adtnSvcSeq)+1,
					adtnSvcCd : "",
					connAddr : "",
				    lcnsCunt : "",
					useDvCd : "N",
				 	checkbox : false};
			SYSM110T_grdSYSM110T.dataSource.pushInsert(SYSM110T_dataLength+1, SYSM110T_newRow);
		}else{
			let SYSM110T_newRow =  {adtnSvcSeq :1,  
					adtnSvcCd : "",
					connAddr : "",
					lcnsCunt : "",
					useDvCd : "N",
				 	checkbox : false};
			SYSM110T_grdSYSM110T.dataSource.pushInsert(SYSM110T_dataLength+1, SYSM110T_newRow );
		}
	$('#SYSM110T_btnDel2').prop('disabled', true);
});


//테넌트 정보 저장
function  SYSM110T_fnResultTenantInfo(SYSM110T_item){
	let SYSM110T_regex = /[^0-9]/g;	
	
	// 태넌트 기본정보 
	let SYSM110T_tenantId = $('#SYSM110T_edtTenantId').val().toUpperCase();
	let SYSM110T_dmnCd = $('#SYSM110T_cobDmnCd').val();
	let SYSM110T_spTypCd = $('#SYSM110T_cobSpTypCd').val();
	let SYSM110T_tenantStCd = $('#SYSM110T_cobTenantStCd').val();
	let SYSM110T_tenantStRsnCd = $('#SYSM110T_cobTenantStRsnCd').val();
	let SYSM110T_fmnm = $('#SYSM110T_edtTenantKorNm').val();
	let SYSM110T_fmnmEng = $('#SYSM110T_edtTenantEngNm').val();
	let SYSM110T_reprNm = $('#SYSM110T_edtReprKorNm').val();
	let SYSM110T_reprNmEng = $('#SYSM110T_edtReprEngNm').val();
	let SYSM110T_svcTypCd = $('#SYSM110T_cobSvcTypCd01').val();
	let SYSM110T_usrAcCnt = $('#SYSM110T_cobUsrAcCnt').val();
	let SYSM110T_emlSndGrpsAddr = $('#SYSM110T_edtEml').val();
	let SYSM110T_mlingCd = $('#SYSM110T_cobMlingCd').val();
	let SYSM110T_orgLvlCd = $('#SYSM110T_cobOrgLvlCntCd').val();
	let SYSM110T_svcContDd = $('#SYSM110T_edtSvcContDt').val().replace(SYSM110T_regex, "");
	let SYSM110T_svcExpryDd = $('#SYSM110T_edtSvcExpryDt').val().replace(SYSM110T_regex, "");
	let SYSM110T_svcBltnDd = $('#SYSM110T_edtSvcBegDt').val().replace(SYSM110T_regex, "");
	let SYSM110T_svcTrmnDd = $('#SYSM110T_edtSvcTrmnDt').val().replace(SYSM110T_regex, "");

	Utils.markingRequiredField();
	
	// 필수값 validation
	if (Utils.isNull(SYSM110T_tenantId)) {
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.tenantId"));
//		$("#SYSM110T_edtTenantId").focus();
		return;
	}
	if (Utils.isNull(SYSM110T_dmnCd)) {
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.dmnCd"));
//		$("#SYSM110T_cobDmnCd").focus();
		return;
	}
	if (Utils.isNull(SYSM110T_spTypCd)) {
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.spTypCd"));
//		$("#SYSM110T_cobDmnCd").focus();
		return;
	}


	if(SYSM110T_fmnm.length>100){
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.valid.fmnm"));
//		$("#SYSM110T_edtTenantKorNm").focus();
		return;
	}
	if (Utils.isNull(SYSM110T_fmnmEng)) {
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.fmnmEng"));
//		$("#SYSM110T_edtTenantEngNm").focus();
		return;
	}
	if(SYSM110T_fmnmEng.length>100){
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.valid.fmnmEng"));
//		$("#SYSM110T_edtTenantEngNm").focus();
		return;
	}
	if (Utils.isNull(SYSM110T_tenantStCd)) {
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.tenantStCd"));
//		$("#SYSM110T_cobTenantStCd").focus();
		return;
	}
	if(SYSM110T_tenantStCd=="40" && !SYSM110T_tenantStRsnCd){
		$('#SYSM110T_validMsg').val(SYSM100M_langMap.get("SYSM100M.save.svcTypRsnCd"));
		$("#SYSM110T_cobTenantStRsnCd").focus();
		return;
	}
	if (Utils.isNull(SYSM110T_reprNm)) {
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.reprNm"));
//		$("#SYSM110T_edtReprKorNm").focus();
		return;
	}
	if(SYSM110T_reprNm.length>100){
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.valid.reprNm"));
	//	$("#SYSM110T_edtReprKorNm").focus();
		return;
	}
	// if (Utils.isNull(SYSM110T_reprNmEng)) {
	// 	$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.reprNmEng"));
	// //	$("#SYSM110T_edtReprEngNm").focus();
	// 	return;
	// }
	if(SYSM110T_reprNmEng.length>100){
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.valid.reprNmEng"));
	//	$("#SYSM110T_edtReprEngNm").focus();
		return;
	}
	if (Utils.isNull(SYSM110T_svcTypCd)) {
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.svcTypCd"));
	//	$("#SYSM110T_cobSvcTypCd01").focus();
		return;
	}
	if (Utils.isNull(SYSM110T_usrAcCnt)) {
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.usrAcCnt"));
	//	$("#SYSM110T_cobSvcTypCd01").focus();
		return;
	}
	if (Utils.isNull(SYSM110T_mlingCd)) {
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.mlingCd"));
	//	$("#SYSM110T_cobMlingCd").focus();
		return;
	}
	if (Utils.isNull(SYSM110T_orgLvlCd)) {
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.orgLvlCd"));
	//	$("#SYSM110T_cobOrgLvlCntCd").focus();
		return;
	}
	
	// 이메일 validation
	if (Utils.isNull(SYSM110T_emlSndGrpsAddr)) {
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.emlSndGrpsAddr"));
	//	$("#SYSM110T_edtEml").focus();
		return;
	}else{
		let SYSM110T_regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
		 if(!SYSM110T_regEmail.test(SYSM110T_emlSndGrpsAddr)){
			 $('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.emlSndGrpsAddr02"));
		//	 $("#SYSM110T_edtEml").focus();
			 return;
		 }
	}
	if(SYSM110T_emlSndGrpsAddr.length>100){
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.valid.emlSndGrpsAddr"));
	//	$("#SYSM110T_edtEml").focus();
		return;
	}
	
	// 날짜 validation
	let SYSM110T_dateReg = /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/;
	if (Utils.isNull(SYSM110T_svcContDd)) {
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.dateReg"));
	//	$("#SYSM110T_edtSvcContDt").focus();
		return;
	}else{
		if( !SYSM110T_dateReg.test(SYSM110T_svcContDd)){
			$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.dateReg02"));
		//	$("#SYSM110T_edtSvcContDt").focus();
			return;
		}
	}
	if (Utils.isNull(SYSM110T_svcBltnDd)) {
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.svcBltnDd"));
	//	$("#SYSM110T_edtSvcBegDt").focus();
		return;
	}else{
		if(!SYSM110T_dateReg.test(SYSM110T_svcBltnDd)){
			$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.svcBltnDd02"));
		//	$("#SYSM110T_edtSvcBegDt").focus();
			return;
		}
	}
	if (!Utils.isNull(SYSM110T_svcExpryDd) && !SYSM110T_dateReg.test(SYSM110T_svcExpryDd)) {
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.svcExpryDd"));
		//$("#SYSM110T_edtSvcExpryDt").focus()
		return;
	}
	if (!Utils.isNull(SYSM110T_svcTrmnDd)  && !SYSM110T_dateReg.test(SYSM110T_svcTrmnDd)) {
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.svcTrmnDd"));
		$("#SYSM110T_edtSvcTrmnDt").focus()
		return;
	}
	
	if(!Utils.isNull(SYSM110T_svcExpryDd)  && SYSM110T_svcContDd>SYSM110T_svcExpryDd){
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.svcExpryDd02"));
		$("#SYSM110T_edtSvcExpryDt").focus()
		return;
	}

	if(!Utils.isNull(SYSM110T_svcTrmnDd)&& SYSM110T_svcBltnDd>SYSM110T_svcTrmnDd){
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.svcTrmnDd02"));
		$("#SYSM110T_edtSvcTrmnDt").focus()
		return;
	}	
	
	let SYSM110T_jsonEncode = JSON.stringify(SYSM110T_item.SYSM100VOInfo);
	let SYSM110T_object=JSON.parse(SYSM110T_jsonEncode);
	let SYSM110T_jsonDecode = JSON.parse(SYSM110T_object);
	
	if(SYSM110T_jsonDecode[0] && $('#SYSM110T_edtTenantId').prop('disabled')==false){
		$('#SYSM110T_validMsg').val(SYSM110T_langMap.get("SYSM110T.save.tenantId02"));
		return;
	}
	
	$('#SYSM100M_tenantId').val(SYSM110T_tenantId);
	$("#SYSM100M_tenantId").focus()
	
	Utils.confirm(SYSM110T_langMap.get("SYSM110T.save"), function(){
		//data setting
		let SYSM110T_data = { tenantId : SYSM110T_tenantId, 
				dmnCd 			: SYSM110T_dmnCd,
				spTypCd 		: SYSM110T_spTypCd,
				tenantStCd 		: SYSM110T_tenantStCd,
				tenantStRsnCd 	: SYSM110T_tenantStRsnCd,
				fmnm  			: SYSM110T_fmnm,
				fmnmEng 		: SYSM110T_fmnmEng,
				reprNm 			: SYSM110T_reprNm,
				reprNmEng 		: SYSM110T_reprNmEng,
				svcTypCd 		: SYSM110T_svcTypCd,
				usrAcCnt 		: SYSM110T_usrAcCnt,
				emlSndGrpsAddr 	: SYSM110T_emlSndGrpsAddr,
				mlingCd 		: SYSM110T_mlingCd,
				orgLvlCd 		: SYSM110T_orgLvlCd,
				svcContDd 		: SYSM110T_svcContDd,
				svcBltnDd 		: SYSM110T_svcBltnDd,
				svcExpryDd		: SYSM110T_svcExpryDd,
				svcTrmnDd 		: SYSM110T_svcTrmnDd,
			//	SYSM110VOList 	: SYSM110T_SYSM110VOList,
				regrId 			: SYSM100M_userInfo.usrId,  
				regrOrgCd 		: SYSM100M_userInfo.orgCd,
				lstCorprOrgCd 	: SYSM100M_userInfo.orgCd,  
				lstCorprId 		: SYSM100M_userInfo.usrId
		};	

		let SYSM110T_jsonStr = JSON.stringify(SYSM110T_data);
		
		if(SYSM110T_jsonDecode[0]){
			SYSM110T_url = '/sysm/SYSM110UPT01'
		}else{
			//테넌트 정장 & 테넌트 기준정보 저장 (DMO 기준 복재)
			SYSM110T_url = '/sysm/SYSM110INS01';
		}
		Utils.ajaxCall(SYSM110T_url, SYSM110T_jsonStr, SYSM110T_saveAfter)
	})
}	

function SYSM110T_saveAfter(){
	Utils.alert(SYSM100M_langMap.get("success.common.save")); // "정상적으로 저장되었습니다."
	SYSM110T_fnsearchOneTenant();
	SYSM100M_fnSearchTenantList();
	SYSM110T_DataSource.transport.read(JSON.stringify({tenantId:$('#SYSM100M_tenantId').val()}));
	$('#SYSM110T_validMsg').val('');
}

//태넌트 기본정보 저장 후 재조회
function SYSM110T_fnsearchOneTenant(){

	//중복체크 버튼 활성화 시 false로 변경해야 함
	//SYSM110T_chkId = false;

	SYSM110T_chkId = true;
	$('#SYSM110T_btnDel').prop('disabled', false);
	$('#SYSM110T_btnDel2').prop('disabled', false);
	
	if(Utils.isNull($('#SYSM110T_edtTenantId').val())){
		return;
	}

	SYSM110T_fnUpdateValue(SYSM100M_grdSYSM100M.dataSource.data()[0])

}


//테넌트 신규(초기화)
function SYSM110T_fnSetInit(){
	//중복체크 버튼 활성화 시 false로 변경해야 함
	//SYSM110T_chkId = false;

	SYSM110T_chkId = true;
	
	$('#SYSM110T_btnSave').prop("disabled", false)
	
	$('#SYSM110T_cobDmnCd').data("kendoComboBox").value("");
	$('#SYSM110T_cobTenantStCd').data("kendoComboBox").value("");
	$('#SYSM110T_cobTenantStRsnCd').data("kendoComboBox").value("");
	$('#SYSM110T_cobOrgLvlCntCd').data("kendoComboBox").value("");
	$('#SYSM110T_cobMlingCd').data("kendoComboBox").value("ko");
	$('#SYSM110T_cobSvcTypCd01').data("kendoComboBox").value("");
	$('#SYSM110T_cobUsrAcCnt').data("kendoComboBox").value("");
	$('#SYSM110T_cobSpTypCd').data("kendoComboBox").value("10");
	
	$('#SYSM110T_edtTenantId').val("");
	$('#SYSM110T_edtTenantKorNm').val("");
	$('#SYSM110T_edtTenantEngNm').val("");
	$('#SYSM110T_edtReprKorNm').val("");
	$('#SYSM110T_edtReprEngNm').val("");
	$('#SYSM110T_edtEml').val("");
	$('#SYSM110T_edtSvcContDt').val( kendo.format("{0:yyyy-MM-dd}",new Date()));
	$('#SYSM110T_edtSvcBegDt').val(kendo.format("{0:yyyy-MM-dd}",new Date()));
	$('#SYSM110T_edtSvcExpryDt').val(kendo.format("{0:yyyy-MM-dd}",new Date(new Date().setFullYear(new Date().getFullYear() + 1))));
	$('#SYSM110T_edtSvcTrmnDt').val(kendo.format("{0:yyyy-MM-dd}",new Date(new Date().setFullYear(new Date().getFullYear() + 1))));
	
	SYSM110T_grdSYSM110T.dataSource.data([]);
}

function SYSM110T_fnChgCobTenantStCd(SYSM110T_val){
	if(SYSM110T_val!="40"){
		$('#SYSM110T_cobTenantStRsnCd').data("kendoComboBox").value("");
		$('#SYSM110T_cobTenantStRsnCd').data("kendoComboBox").enable(false);
	}else if(SYSM110T_val=="40"){
		$('#SYSM110T_cobTenantStRsnCd').data("kendoComboBox").enable(true);
	}
}


//event
//테넌트 상세정보 저장버튼
$('#SYSM110T_btnSave').off("click").on('click', function () {

	let editId = $('#SYSM110T_edtTenantId').prop('disabled');

	// if(!SYSM110T_chkId && !editId){
	// 	Utils.alert(SYSM110T_langMap.get("SYSM110T.chkTenantId")) ;
	// 	return;
	// }

	// 태넌트 정보 조회
	let SYSM110T_data = {  tenantId : $('#SYSM110T_edtTenantId').val() };	
	let SYSM110T_jsonStr = JSON.stringify(SYSM110T_data);

	$.ajax({
		url: '/bcs/sysm/SYSM100SEL01',
		type:'post',
		dataType : 'json', 
		contentType : 'application/json; charset=UTF-8',
		data : SYSM110T_jsonStr,    
		success : SYSM110T_fnResultTenantInfo, 
		error :function(request,status, error){
			console.log("[error]");
			console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
		}
	}) ;
});

//테넌트 부가서비스 저장
$('#SYSM110T_btnSave2').off("click").on('click', function () {

	let SYSM110T_updateRows = [];
	let SYSM110T_insertRows = [];
	let SYSM110T_checkValidation = false;
	
	//태넌트 부가서비스 정보
	$.each(SYSM110T_grdSYSM110T.dataSource.data(), function (index, item) { 
			
		if(Utils.isNull(item.adtnSvcCd)){
			Utils.alert(SYSM110T_langMap.get("SYSM110T.save.adtnSvcCd")) ;
			SYSM110T_checkValidation= true;
			return;
		}
		if(!Utils.isNull(item.connAddr) && item.connAddr.length>300){
			Utils.alert(SYSM110T_langMap.get("SYSM110T.save.connAddr.300")) ;
			SYSM110T_checkValidation= true;
			return;
		}
		
		//부가서비스_코드 초기화
		let SYSM110T_SYSM110VO = {
				tenantId    : $('#SYSM110T_edtTenantId').val(),
				adtnSvcSeq	: item.adtnSvcSeq,
				adtnSvcCd   : item.adtnSvcCd,
				useDvCd		: item.useDvCd,
				connAddr	: item.connAddr == null ? '' : item.connAddr,
			    lcnsCunt	: item.lcnsCunt == null ? '' : item.lcnsCunt,
				regrId		: SYSM100M_userInfo.usrId
		};

		if(SYSM110T_svcList.find(element => element.adtnSvcSeq ==  item.adtnSvcSeq)){
			SYSM110T_updateRows.push(SYSM110T_SYSM110VO);
		}else{
			SYSM110T_insertRows.push(SYSM110T_SYSM110VO);
		}
	})
	
	if(SYSM110T_checkValidation) {
		return;
	}

	if(SYSM110T_updateRows.length==0 && SYSM110T_insertRows.length==0){
		Utils.alert(SYSM100M_langMap.get("SYSM100M.save.tenantInfo")) ;
		return;
	}
	
	Utils.confirm(SYSM110T_langMap.get("SYSM110T.save2"), function(){
		let SYSM110T_updateData = { "SYSM110VOList" : SYSM110T_updateRows};
		let SYSM110T_updateJsonStr = JSON.stringify(SYSM110T_updateData);
		
		let SYSM110T_insertData = { "SYSM110VOList" : SYSM110T_insertRows};
		let SYSM110T_insertJsonStr = JSON.stringify(SYSM110T_insertData);

		
		if(SYSM110T_updateRows.length>0  ){
			Utils.ajaxCall('/sysm/SYSM110UPT02', SYSM110T_updateJsonStr, SYSM110T_saveAfter)
		}
		
		if(SYSM110T_insertRows.length>0){
			Utils.ajaxCall('/sysm/SYSM110INS02', SYSM110T_insertJsonStr, SYSM110T_saveAfter)
		}
	})
});

//테넌트 신규등록을 위한 초기화
$('#SYSM110T_btnNew').off("click").on('click', function () {
	Utils.confirm(SYSM110T_langMap.get("SYSM110T.SYSM110T.alt.msg1"),SYSM110T_fnNewTenantReg,SYSM110T_fnNewTenantCancle);
});

//테넌트 삭제
$('#SYSM110T_btnDel').off("click").on('click', function () {
	
	$('#SYSM100M_tenantId').val(GLOBAL.session.user.tenantId);
	$("#SYSM100M_tenantId").focus();

	if(Utils.isNull($('#SYSM110T_edtTenantId').val())){
		Utils.alert(SYSM110T_langMap.get("SYSM110T.delete3")) ;
		return;
	}
	
	Utils.confirm(SYSM110T_langMap.get("SYSM110T.delete"), function(){
		// 태넌트 정보 조회
		let SYSM110T_data = {  tenantId : $('#SYSM110T_edtTenantId').val() };	
		let SYSM110T_jsonStr = JSON.stringify(SYSM110T_data);
		
		Utils.ajaxCall('/sysm/SYSM110DEL01', SYSM110T_jsonStr, function(){
			Utils.alert(SYSM100M_langMap.get("success.common.delete")); // "정상적으로 저장되었습니다."
			SYSM110T_fnDelAfter()
		});
	})
});

//테넌트 신규 등록 초기화
function SYSM110T_fnNewTenantReg(){
	
	SYSM110T_fnSetInit();
	
	$('#SYSM110T_edtTenantId').prop('disabled', false);
	$('#SYSM110T_chkId').prop('disabled', false);
	$('#SYSM110T_btnDel').prop('disabled', true);
	$('#SYSM110T_btnDel2').prop('disabled', true);
}

//테넌트 신규 등록 취소
function SYSM110T_fnNewTenantCancle(){
	$('#SYSM100M button[name=btnInq]').click();
}

function SYSM110T_fnDelAfter(){
	SYSM110T_fnSetInit();
	SYSM100M_fnSearchTenantList();
}

//테넌트 상세정보 삭제
$('#SYSM110T_btnDel2').off("click").on('click', function () {

	let SYSM110T_deleteRows = [];
	let SYSM110T_deleteData = [];
	let SYSM110T_chkY = false;

	let chkRow = false;
	$('#grdSYSM110T .k-checkbox').each(function (idx, row) {
		if($(row).attr('aria-checked')=='true'){
			chkRow = true;
		}
	})
	if(!chkRow){
		Utils.alert(SYSM110T_langMap.get("SYSM110T.delete3")) ;
		return;
	}
	
	Utils.confirm(SYSM110T_langMap.get("SYSM110T.delete2"), function(){
		$('#grdSYSM110T .k-checkbox').each(function (idx, row) {
			if($(row).attr('aria-checked')=='true'){
				let	SYSM110T_tr		= $(row).closest('tr');
				let	SYSM110T_item	= Object.assign({}, SYSM110T_grdSYSM110T.dataItem(SYSM110T_tr));
				
				if(SYSM110T_item.useDvCd == "N"){
					//data setting
					let SYSM110T_data = { tenantId : $('#SYSM110T_edtTenantId').val(), 
							adtnSvcSeq 		: SYSM110T_item.adtnSvcSeq };	
					
					if(SYSM110T_svcList.find(element => element.adtnSvcSeq ==  SYSM110T_item.adtnSvcSeq)){
						SYSM110T_deleteData.push(SYSM110T_data);
					}else{
						if(!$(row).parents('th').length){
							SYSM110T_deleteRows.push(SYSM110T_tr);
						}
					}
				}else{
					SYSM110T_chkY = true;
				}
			}
		});
		
		if(SYSM110T_deleteData.length>0){
			let SYSM110T_data = { "SYSM110VOList" : SYSM110T_deleteData};
			let SYSM110T_jsonStr = JSON.stringify(SYSM110T_data);
			Utils.ajaxCall('/sysm/SYSM110DEL02', SYSM110T_jsonStr, SYSM110T_fnDelAfter);
		}
		
		if(SYSM110T_deleteRows.length>0){
			SYSM110T_deleteRows.forEach(function(val) {
				SYSM110T_grdSYSM110T.removeRow(val);
			});
		}
		if(SYSM110T_chkY){
			Utils.alert(SYSM110T_langMap.get("SYSM110T.chkDataStt")) ;
			return;
		}

		Utils.alert(SYSM100M_langMap.get("success.common.delete")); // "정상적으로 저장되었습니다."
	})
}) ;


//event
//테넌트 상세정보 저장버튼
function SYSM110T_fnCheckTenantId(){

// 태넌트 정보 조회
	let SYSM110T_data = {  tenantId : $('#SYSM110T_edtTenantId').val() };
	let SYSM110T_jsonStr = JSON.stringify(SYSM110T_data);


	Utils.ajaxCall('/sysm/SYSM100SEL01', SYSM110T_jsonStr,function(SYSM110T_item){

		let SYSM110T_jsonEncode = JSON.stringify(SYSM110T_item.SYSM100VOInfo);
		let SYSM110T_object=JSON.parse(SYSM110T_jsonEncode);
		let SYSM110T_jsonDecode = JSON.parse(SYSM110T_object);


		if(SYSM110T_jsonDecode[0] && $('#SYSM110T_edtTenantId').prop('disabled')==false){
			Utils.alert(SYSM110T_langMap.get("SYSM110T.chkTenantId.disable")) ;
			SYSM110T_chkId = false;
			return;
		}else{
			Utils.alert(SYSM110T_langMap.get("SYSM110T.chkTenantId.able")) ;
			SYSM110T_chkId = true;
			return;
		}

		$('#SYSM100M_tenantId').val(SYSM110T_tenantId);
		$("#SYSM100M_tenantId").focus()
	}) ;

}


$("#SYSM110T_edtTenantId").on("propertychange change keyup paste input", function() {
	let currentVal = $(this).val().toUpperCase();
	$("#SYSM110T_edtTenantId").val(currentVal)
});


function SYSM110T_fnSearchTemplate(obj) {
	SYSM110T_checkList= [];
	let dataItem = SYSM110T_grdSYSM110T.dataItem($(obj).closest("tr"));
	Utils.openPop(GLOBAL.contextPath + "/sysm/SYSM335P", "SYSM335P" , 700, 610,
		{isMulti : "N",callbackKey:"SYSM110T_fnPopupCallback", mgntItemCd:'C0011'
		});

	Utils.setCallbackFunction("SYSM110T_fnPopupCallback", function (item) {
		if (item.mgntItemCd != "C0011") {
			Utils.alert(SYSM110T_langMap.get("SYSM110T.chkAdtnSvcCd")) ;
		} else{
			dataItem.set("adtnSvcCd", item.comCd );
			dataItem.set("adtnSvcNm", item.comCdNm);
		}
		SYSM110T_grdSYSM110T.refresh();
	});
}


function ttttttest11(){
	Utils.openPop(GLOBAL.contextPath + "/sysm/CNSLEXCEL", "CNSLEXCEL", 1000, 800);
}