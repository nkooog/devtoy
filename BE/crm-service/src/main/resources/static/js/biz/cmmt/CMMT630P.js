/***********************************************************************************************
 * Program Name : CMMT630P.jsp
 * Creator      : wkim
 * Create Date  : 2023.11.15
 * Description  : 뉴스레터 상세
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.11.15     wkim             최초생성

 ************************************************************************************************/

$(document).ready(function () {
	var CMMT630_item;
	var param = {
		nlMgntSeq: CMMT630P_Map.get("nlMgntSeq"),
	}

	Utils.ajaxCall('/cmmt/CMMT610SEL01',  JSON.stringify(param),function(data){
		let info = JSON.parse(JSON.parse(JSON.stringify(data.info)));
		CMMT630_item = info;

		let title = CMMT630_item.nlTite;
		let regrId = CMMT630_item.regrId;
		let regDate = CMMT630_item.regDtm

		let cntntsCtt = CMMT630_item.nlCtt;

		let edtTextLv3 = cntntsCtt.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");

		$('#CMMT630P p[name=CMMT630P_Title]').append(title);

//		$('#CMMT630P li[name=CMMT630P_RegrID]').text(regrId); 						//등록자아이디 설정 : 이름 추가필요
		$('#CMMT630P li[name=CMMT630P_RegrID]').text("BROAD C&S"); 					//등록자아이디 설정 : 이름 추가필요
		$('#CMMT630P li[name=CMMT630P_Now]').text(regDate.substring(0,16));			//등록 날자 설정

		//본문 설정
		let divCntntsCtt = '<div id="CMMT630P_divCntntsCtt"></div>';

		$('#CMMT630P div[name=CMMT630P_CntntsText]').append(divCntntsCtt);
		
		let htmlDecode = Utils.htmlDecode(cntntsCtt);
		$('#CMMT630P_divCntntsCtt').append(cntntsCtt);

	},null,null,null);
});

$(window).on('load',function(){
	setTimeout(function(){
		popResize();	
	},200);
});

function popResize() {
    var contentDiv = document.getElementById("CMMT630P_divCntntsCtt");
    
    if (contentDiv) {
        var screenWidth 	= window.screen.width;
        var screenHeight 	= window.screen.height;
        var screenX 		= window.screenX;
        var screenY 		= window.screenY;
        var currentWidth 	= window.outerWidth;
        var currentHeight 	= window.outerHeight;
        var scrollWidth 	= Math.max(contentDiv.scrollWidth, contentDiv.offsetWidth);
        var scrollHeight 	= Math.max(contentDiv.scrollHeight, contentDiv.offsetHeight);
        var popWidth 		= Math.min(scrollWidth > currentWidth ? scrollWidth + 80 : currentWidth, screenWidth - 200);
        var popHeight 		= currentHeight;

        window.resizeTo(popWidth, popHeight);

        if (scrollWidth > currentWidth) {
            var centerX = screenX + (currentWidth - popWidth) / 2;
            var centerY = screenY + (currentHeight - popHeight) / 2;
            window.moveTo(centerX, centerY);
        }
    }
}