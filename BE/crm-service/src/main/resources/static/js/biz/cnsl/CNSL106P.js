/***********************************************************************************************
 * Program Name : CNSL106P.js
 * Creator      : bykim
 * Create Date  : 2023.04.04
 * Description  : 콜백상세조회
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.04.04     bykim            최초생성

 ************************************************************************************************/
var CNSL106P_dataItem;

$(document).ready(function () {
    let CNSL106P_data = { tenantId			: Utils.getUrlParam('tenantId'),
                          cabackAcpnNo		: Utils.getUrlParam('cabackAcpnNo'),
                         };

    var CNSL106P_jsonStr = JSON.stringify(CNSL106P_data);
    Utils.ajaxCall('/cnsl/CNSL106SEL01', CNSL106P_jsonStr, CNSL106P_fnSetValue
        ,window.kendo.ui.progress($('#CNSL106P'), true));
});

function CNSL106P_fnSetValue(data){

   window.kendo.ui.progress($('#CNSL106P'), false)

    let CNSL106P_jsonEncode = JSON.stringify(data.CNSL106PInfo);
    CNSL106P_dataItem = JSON.parse(JSON.parse(CNSL106P_jsonEncode));

    if (CNSL106P_dataItem.vceCabackYn == 'Y') {
        $('#CNSL106P_phrecKey') .css("visibility", "visible");
    }

    $('#CNSL106P input[name=cabackInfwShpCdNm]').val(CNSL106P_dataItem.cabackInfwShpCdNm)
    $('#CNSL106P input[name=cabackProcStCd]').val(CNSL106P_dataItem.cabackProcStCdNm);
    $('#CNSL106P input[name=cabackId]').val(CNSL106P_dataItem.cabackId);
    $('#CNSL106P input[name=inclTelNo]').val(CNSL106P_dataItem.inclTelNo);
    $('#CNSL106P input[name=cabackInclRpsno]').val(CNSL106P_dataItem.cabackInclRpsno);
    $('#CNSL106P input[name=ivrAcesCd]').val(CNSL106P_dataItem.ivrAcesCd);
    $('#CNSL106P input[name=cabackRegDtm]').val(CNSL106P_dataItem.cabackRegDtm);
    $('#CNSL106P input[name=cabackAltmDtm]').val(CNSL106P_dataItem.cabackAltmDtm);
    $('#CNSL106P input[name=cnslrId]').val( CNSL106P_dataItem.cnslrId +" / "+CNSL106P_dataItem.cnslrNm);
    $('#CNSL106P textarea[name=sttTxt]').val(CNSL106P_dataItem.sttTxt);
    $('#CNSL106P input[name=webCabackCustNm]').val(CNSL106P_dataItem.webCabackCustNm);
    $('#CNSL106P textarea[name=webCabackMsg]').val(CNSL106P_dataItem.webCabackMsg);

    switch(CNSL106P_dataItem.vceCabackYn){
        case "Y" :
            $('#CNSL106P_vceCabackYes').prop("checked", true);
            break;
        case "N" :
            $('#CNSL106P_vceCabackNo').prop("checked", true);
            break;
    }

    switch(CNSL106P_dataItem.sttTrnfYn){
        case "Y" :
            $('#CNSL106P_sttTrnfYes').prop("checked", true);
            break;
        case "N" :
            $('#CNSL106P_sttTrnfNo').prop("checked", true);
            break;
    }

    $('#CNSL106P input[name=cntcCpltDtm]').val(CNSL106P_dataItem.cntcCpltDtm);
    $('#CNSL106P input[name=cntcCnslrId]').val(CNSL106P_dataItem.cntcCnslrId +" / "+CNSL106P_dataItem.cntcCnslrNm);
    $('#CNSL106P textarea[name=cnslCtt]').val(CNSL106P_dataItem.cnslCtt);

    if(CNSL106P_dataItem.autoCpltYn=='Y'){
        let autoCplt =   CNSL106P_dataItem.autoDate + " ("+ CNSL106P_dataItem.autoId+"/"+CNSL106P_dataItem.autoNm+")"
        $('#CNSL106P input[name=autoCplt]').val(autoCplt);
    }
}

$("#CNSL106P_phrecKey").on('click',function(e){
	
	let isopen = window.opener.xbox.connect.isopen();
	
	if(isopen != true){
		Utils.alert("CTI 로그인 후 이용해 주세요.");
		$("#CNSL106P_phrecKey").removeClass("Active");

	} else {
		window.opener.recPlayCallback(CNSL106P_dataItem.cabackId, CNSL106P_dataItem.cabackRegDtm, CNSL106P_dataItem.noSwInclTelNo, CNSL106P_dataItem.cabackInclRpsno, CNSL106P_dataItem.noSwCabackReqTelno, CNSL106P_dataItem.webCabackCustNm, CNSL106P_dataItem.vceCabackPlyTm, CNSL106P_dataItem.vceCabackFilePath, CNSL106P_dataItem.sttTrnfYn);
	}
	
});

function CNSL106P_fnSelectCmmCode() {
    let CNSL106P_data = {
        "codeList": [
            {"mgntItemCd": "C0119"}
        ]
    };
    Utils.ajaxCall(
        "/comm/COMM100SEL01", JSON.stringify(CNSL106P_data), CNSL106P_fnsetCmmCode)
}

function CNSL106P_fnsetCmmCode(data) {

    // CNSL106P_cmmCodeList = JSON.parse(data.codeList);
    // for (let i = 0; i < CNSL106P_cmmCodeList.length; i++) {
    //     if(CNSL106P_cmmCodeList[i].comCd == obj.cabackProcStCd){
    //         $('#CNSL106P input[name=cabackProcStCd]').val(CNSL106P_cmmCodeList[i].comCdNm);
    //     }
    // }

}
