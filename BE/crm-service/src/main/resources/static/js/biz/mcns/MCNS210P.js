/***********************************************************************************************
 * Program Name : MCNS210P.js
 * Creator      : mhlee
 * Create Date  : 2022.04.08
 * Description  : My콜백내역 상세 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.08    mhlee            최초생성
 *
 ************************************************************************************************/
var MCNS210P_cmmCodeList, MCNS210P_dataItem;
$(document).ready(function () {

    let MCNS210P_param = {
        unfyCntcHistNo: Utils.getUrlParam('unfyCntcHistNo'),
        cabackAcpnNo: Utils.getUrlParam('cabackAcpnNo'),
        tenantId: Utils.getUrlParam('tenantId'),
        cnslrId: Utils.getUrlParam('cnslrId'),
        cnslrOrgCd: Utils.getUrlParam('cnslrOrgCd'),
    }

    Utils.ajaxCall(
        "/mcns/MCNS210SEL01",
        JSON.stringify(MCNS210P_param),
        MCNS210P_fnResultCaBackDetail)

});

function MCNS210P_fnSelectCmmCode() {
    let MCNS200M_data = {
        "codeList": [
            {"mgntItemCd": "C0117"}, // 콜백채널구분코드
            {"mgntItemCd": "C0119"}, // 콜백상태코드
            {"mgntItemCd": "C0162"}, // 인입IVR서비스코드
            {"mgntItemCd": "C0236"}, // 콜백유입형태코드
        ]
    };
    Utils.ajaxCall(
        "/comm/COMM100SEL01",
        JSON.stringify(MCNS200M_data),
        MCNS210P_fnsetCmmCode)
}

function MCNS210P_fnsetCmmCode(data) {
    MCNS210P_cmmCodeList = JSON.parse(data.codeList);

    let ivrAcesNmStr = "",sttTxtStr = "";
    if(!Utils.isNull(MCNS210P_dataItem.ivrAcesCd)){
        let splitSt = MCNS210P_dataItem.ivrAcesCd.indexOf("(");
        ivrAcesNmStr = MCNS210P_dataItem.ivrAcesCd.substring(splitSt).replaceAll("(","").replaceAll(")","")
    }

    $('#input[name=cabackInfwShpCd]').val(Utils.getComCdNm(MCNS210P_cmmCodeList, "C0236", MCNS210P_dataItem.cabackInfwShpCd));
    $('#input[name=ivrAcesNm]').val(Utils.getComCdNm(MCNS210P_cmmCodeList, "C0162", ivrAcesNmStr));
    Utils.setKendoComboBox(MCNS210P_cmmCodeList, "C0119", "#MCNS210P input[name=cabackProcStCd]", MCNS210P_dataItem.cabackProcStCd, false);

    if(Utils.getUrlParam('openerId') == 'CNSL410M'){
        sttTxtStr = window.opener.CNSL410M_sttTxt;
    }else{
        sttTxtStr = window.opener.MCNS200M_sttTxt;
    }

    $('#MCNS210P [name=sttTxt]').html(sttTxtStr)
}

function MCNS210P_fnResultCaBackDetail(data) {
    MCNS210P_dataItem = JSON.parse(data.MCNS210P);
    MCNS210P_fnSetValue(MCNS210P_dataItem);
    MCNS210P_fnSelectCmmCode();
}


function MCNS210P_fnSetValue(obj) {

    let ivrAcesCdStr = "";
    if(!Utils.isNull(obj.ivrAcesCd)){
        let splitSt = obj.ivrAcesCd.indexOf("(");
        ivrAcesCdStr = obj.ivrAcesCd.substring(0,splitSt)
    }

    function transValue() {
        return {
            tenantId: obj.tenantId,
            cabackAcpnNo: obj.cabackAcpnNo,
            // cntcCustId: obj.cntcCustId,
            webCabackCustNm: obj.webCabackCustNm,
            cnslrOrgCd: obj.cnslrOrgCd,
            cnslrOrgNm: obj.cnslrOrgNm,
            cnslrId: obj.cnslrId,
            decUsrNm: obj.decUsrNm,
            ivrAcesCd : ivrAcesCdStr,
           // sttTxt : sttTxtStr,
            cabackRegDtm : obj.cabackRegDtm,
            cabackAltmDtm :  obj.cabackAltmDtm,
            cntcCpltDtm : obj.cntcCpltDtm,
            inclTelNo: obj.inclTelNo,
            cabackReqTelno: obj.cabackReqTelno,
            cabackInfwShpCd : obj.cabackInfwShpCd,
            cabackInfwShpCdNm : obj.cabackInfwShpCdNm,
        }
    }
    const MCNS_Utils = MCNS_setUtils("MCNS210P");
    MCNS_addDetailData(obj, transValue, MCNS_Utils);
}

$("#MCNS210P [name=cabackProcStCd]").on('change', function () {
    let cpltDtm = $('#MCNS210P [name=cpltDtm]').data("kendoDateTimePicker");
    let cabackProcStCd = $('#MCNS210P [name=cabackProcStCd]').data('kendoComboBox').value();
    if (cabackProcStCd === '5') {
        let today = new Date();
        cpltDtm.value(new Date(today));
    }
})

function MCNS210P_updateParamValue() {
    let param = {
        tenantId: $('#MCNS210P [name=tenantId]').val(),
        cabackAcpnNo: $('#MCNS210P [name=cabackAcpnNo]').val(),
        // TODO 처리내용 저장 여부 확인 필요
        cnslrId: $('#MCNS210P [name=cnslrId]').val(),
        cnslrOrgCd: GLOBAL.session.user.orgCd,
        cabackProcStCd: $('#MCNS210P [name=cabackProcStCd]').data('kendoComboBox').value(),
    }
    if (MCNS210P_dataItem.cabackInfwShpCd === '02' ||  MCNS210P_dataItem.cabackInfwShpCd === "03" ||  MCNS210P_dataItem.cabackInfwShpCd === "04" ||  MCNS210P_dataItem.cabackInfwShpCd === "07"){
       // param.webCabackMsg = $('#MCNS210P [name=sttTxt]').val();

    } else {
        param.sttTxt = $('#MCNS210P [name=sttTxt]').val();
    }

    return param;
}


function MCNS210P_updateCabackStatus() {
    let MCNS212P_updateParam = MCNS210P_updateParamValue()
  //kw---20230626 : 콜백내역 팝업에서 처리상태 변환시 필요한 파라미터 추가
    //kw---/cnsl/CNSL100INS01
    let cabackProcStCd = $('#MCNS210P [name=cabackProcStCd]').data('kendoComboBox').value();

    Utils.ajaxCall("/mcns/MCNS210UPT01", JSON.stringify(MCNS212P_updateParam), function (data) {
    	if(cabackProcStCd <= 142){
        	let param = {
    	    	tenantId 			: Utils.getUrlParam('tenantId'),
    	        ctiAgenId 			: Utils.getUrlParam('ctiAgenId'),
    	        cabackId 			: Utils.getUrlParam('cabackId'),
    	        cabackProcStCd 		: cabackProcStCd,
    	        cabackProcStNm		: $('#MCNS210P [name=cabackProcStCd]').data('kendoComboBox').text(),
    	        cntcPathCd			: "21",
    	        state				: "ProceedingCallBack",
    	    }
    	    
    	    Utils.ajaxCall( "/cnsl/CNSL100INS01", JSON.stringify(param), function (cnsl100Ins_data) {
    	    	Utils.alert(data.msg, function () {
    	            Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
    	            self.close();
    	        });
    	    });
        } else {
        	Utils.alert(data.msg, function () {
                Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
                self.close();
            });
        }
    	
        
    });
    
   

}