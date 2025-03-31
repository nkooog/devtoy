var CNSL152T_List = [];

$(document).ready(function () {

	CNSL152T_fnGetPhon();
	CNSL_Utils.setfunctionCustIdList(CNSL152T_fnGetPhon);

	const param = {
		tenantId : GLOBAL.session.user.tenantId,
		usrGrd: GLOBAL.session.user.usrGrd,
		regrId: GLOBAL.session.user.usrId,
	};
	Utils.ajaxCall("/cnsl/CNSL152SEL01",JSON.stringify(param),function(data){
		CNSL152T_List = data.result;
		if (CNSL152T_List.length === 0) {
			Utils.alert("전송할 푸쉬 내역이없습니다.");
			return;
		}
		let i =0;
		CNSL152T_List.map(x=>{
			const qLnkMenu = [];
			qLnkMenu.push(
				`<div class="ma_bottom5 heigh30">`,
				`<button onClick="window.open('${x.qLnkAddr}')" class="fl" style="width: 80%;">`,
				`<span class="k-icon k-i-hyperlink-open"></span>${x.qLnkNm}`,
				`</button>`,
				`<button onClick="CNSL152T_fnSendPushUrl('${i++}')" class="fr" style="width: 19%; margin-top: 0;">`,
				`<span class="k-icon k-i-envelop"></span>전송`,
				`</button></div>`,
			)
			$('#CNSL152T_PushLink').append(qLnkMenu.join(""));
		})
	},false,false,false);


});

function CNSL152T_fnSendPushUrl(num){
	Utils.confirm("발송하시겠습니까",function(){
		let phone = $('#CNSL152T_Tel').val();

		if(Utils.isNull(phone)){
			Utils.alert("발송 대상이 없습니다.");
			return;
		}

		let param={
			tenantId : GLOBAL.session.user.tenantId,
			phone : phone.replaceAll('-',''),
			message : CNSL152T_List[num].failMessage +"\n"+CNSL152T_List[num].qLnkAddr,
			url : CNSL152T_List[num].qLnkAddr
		}
		Utils.ajaxCall("/cnsl/CNSL152INS01",JSON.stringify(param),function(data){
			if(data.result.Code !== "Success"){
				Utils.alert("발송에 실패하여 문자메시지로 전송하였습니다.");
			}
		},false,false,false);
	});
}

function CNSL152T_fnGetPhon(){
	$('#CNSL152T_Tel').val(custTelNum);
}