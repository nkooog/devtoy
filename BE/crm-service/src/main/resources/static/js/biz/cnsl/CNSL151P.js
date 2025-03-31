// var getMessage;
$(document).ready(function () {
    let param = Utils.getPopV2Param("CNSL151P");
	CNSL151P_fnSearchCallBotData(param);
});
function CNSL151P_fnSearchCallBotData(postData){
	console.log(postData);
	if(postData != null){
		let phone = CNSL151P_fnGetHipenPhoneNumber(postData.data.customerNum);
		let timeString = CNSL151P_fnGetCallDurationTime(postData.data.callDuration);
		let headerText = `<li>${postData.data.startTime} ~ ${postData.data.endTime} (${timeString}) <span class="btnRefer_font"> ${phone}</span></li><li>고객님과 콜봇 연결 되었습니다.</li>`;
		$('#CNSL151P_Date').append(headerText);
		postData.data.callText.map(x=> {$('#CNSL151P_ChatBox').append(CNSL151P_fnCreateChat(x.dir,x.timeStamp,x.text));});
	}else{
		Utils.alert("조회된 내역이 없습니다.", function(){ window.close();})
	}
}
function CNSL151P_fnCreateChat(type,time,mesage){
	const changeTime = new Date(time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	if(type === "out"){
		return `<div class="item"><div class ="chatbox"><p class="msg">${mesage}</p><span class="time">${changeTime}</span></div></div>`;
	}else{
		return `<div class="item mymsg"><div class="chatbox"><p class="msg">${mesage}</p><span class="time">${changeTime}</span></div>	</div>`;
	}
}
function CNSL151P_fnGetHipenPhoneNumber(phone) {
	if (phone.slice(0, 2) === "02") {
		return '(' + `${phone.slice(0, 2)}-${phone.slice(2, 6)}-${phone.slice(6)}` + ')';
	} else {
		return '(' + `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}` + ')';
	}
}
function CNSL151P_fnGetCallDurationTime(sec){
	if(sec>59){
		let newSec = sec%60;
		let min = (sec-newSec)/60;
		return min+"분 "+newSec +"초";
	}else{
		return sec+"초";
	}
}