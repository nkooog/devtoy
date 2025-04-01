var upsertFlg = '';
var neceChk1 = '';
var neceChk3 = '';

$(document).ready(function () {
	upsertFlg = Utils.getUrlParam('upsertFlg')
	
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		if ( upsertFlg == "I") {
			$(".popHeader").html('환자정보등록<button class="popClose" title="창닫기" onclick="window.close();"></button>')
		} else if ( upsertFlg == "U") {
			$(".popHeader").html('환자정보수정<button class="popClose" title="창닫기" onclick="window.close();"></button>')
		}
	} else {
		if ( upsertFlg == "I") {
			$(".popHeader").html('고객정보등록<button class="popClose" title="창닫기" onclick="window.close();"></button>')
		} else if ( upsertFlg == "U") {
			$(".popHeader").html('고객정보수정<button class="popClose" title="창닫기" onclick="window.close();"></button>')
		}
	}
	$(".CNSL115 #tenantId").val(GLOBAL.session.user.tenantId);
	setCNSL115SEL01();
});

function CNSL115SEL01(data) {
	var custInfo = JSON.parse(data.CNSL115SEL01);
	if ( custInfo != null ) {
		$(".CNSL115 #tenantId").val(custInfo.tenantId);
		$(".CNSL115 #custNo").val(custInfo.custNo);
		$(".CNSL115 #custId").val(custInfo.custId);
		$(".CNSL115 #custNm").val(custInfo.custNm);
		$(".CNSL115 #mbleTelNo").val(custInfo.mbleTelNo);
		$(".CNSL115 #owhmTelNo").val(custInfo.owhmTelNo);
	}
}

function setCustInfo() {
	var custNmSrchkey1 = null;
	var custNmSrchkey2 = null;
	if ( $(".CNSL115 #custId").val() == "" ) {
		Utils.alert("챠트번호를 입력해주세요.", function(){$(".CNSL115 #custId").focus()});
		return;
	} 
	if ( $(".CNSL115 #custNm").val() == "" ) {
		Utils.alert("환자명을 입력해주세요.", function(){$(".CNSL115 #custNm").focus()});
		return;
	} 
	if ( $(".CNSL115 #custNm").val().length >= 1 ) {
		custNmSrchkey1 = $(".CNSL115 #custNm").val().substr(0,1);
	}
	if ( $(".CNSL115 #custNm").val().length >= 2 ) {
		custNmSrchkey2 = $(".CNSL115 #custNm").val().substr(0,2)
	}
	
	var CNSL113_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"usrId" : GLOBAL.session.user.usrId,
		"orgCd" : GLOBAL.session.user.orgCd,
		"custIdPathCd" : '9',
		"custId" : $(".CNSL115 #custId").val(),
		"custNm" : $(".CNSL115 #custNm").val(),
		"custNmSrchkey1" : custNmSrchkey1,
		"custNmSrchkey2" : custNmSrchkey2,
		"owhmTelNo" : $(".CNSL115 #owhmTelNo").val().replace(/[^0-9]/g, ''),
		"mbleTelNo" : $(".CNSL115 #mbleTelNo").val().replace(/[^0-9]/g, ''),
		"encryptYn" : Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1
	};
	
	if ( upsertFlg == "I") {
		Utils.ajaxCall("/cnsl/CNSL115SEL02", JSON.stringify(CNSL113_data), function (result) {
			if (result.CNSL115SEL02 == 0) {
				Utils.ajaxCall("/cnsl/CNSL115INS01", JSON.stringify(CNSL113_data), function (result) {
					Utils.alert("환자정보가 저장되었습니다.", function () { 
						opener.custId = $(".CNSL115 #custId").val();
			        	Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
			    		self.close();
			        });
			    });
			} else {
				Utils.alert("중복된 챠트번호입니다.", function () {
					$(".CNSL115 #custId").focus();
				});
			}
	    });
	} else if ( upsertFlg == "U") {
		Utils.ajaxCall("/cnsl/CNSL115UPT01", JSON.stringify(CNSL113_data), function (result) {
			Utils.alert("환자정보가 수정되었습니다.", function () { 
				opener.custId = $(".CNSL115 #custId").val();
	        	Utils.getPopupCallback(Utils.getUrlParam('callbackKey'))();
	    		self.close();
	        });
	    });
	}
}

function setCNSL115SEL01() {
	if ( upsertFlg == "U") {
		$(".CNSL115 #custId").attr("disabled", true);
		var CNSL115_data = {
			"tenantId" : GLOBAL.session.user.tenantId,
			"custId" : Utils.getUrlParam('custId'),
			"encryptYn" : Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 35).bsVl1
		};
		var CNSL115_jsonStr = JSON.stringify(CNSL115_data);
		Utils.ajaxCall("/cnsl/CNSL115SEL01", CNSL115_jsonStr, CNSL115SEL01);
	}
}

const autoHyphenTel = (target) => {
	target.value = target.value
   .replace(/[^0-9]/g, '')
   .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
}