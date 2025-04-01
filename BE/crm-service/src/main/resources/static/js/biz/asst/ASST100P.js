var KMST300P_DetailSearch ={};
var KMST300P_DataSource;
var KSMT300P_SearchData;

var KMST300P_tree;

var assistantWebSocket;
var mecabWebSocket;

var tenant = '';
var agentId = '';
var dnis = '';
var spanElement = document.getElementById("connectNumber");

var buffer;

var StringBuffer = function() {
	this.buffer = new Array();
};

StringBuffer.prototype.append = function(str) {
	this.buffer[this.buffer.length] = str;
};
StringBuffer.prototype.toString = function() {
	return this.buffer.join("");
};
StringBuffer.prototype.remove = function() {
	this.buffer = [];
}

$(document).ready(function (){

	if(assistantWebSocket!=null) assistantWebSocket.close();
	if(mecabWebSocket!=null) mecabWebSocket.close();
	if(buffer == null) buffer = new StringBuffer();

	spanElement.innerText ="통화수신 대기중입니다.";

	assistantConnect();
	mecabConnect();
});



function assistantConnect() {
	// assistantWebSocket 객체 생성 및 서버에 연결
	assistantWebSocket=null;
	assistantWebSocket = new WebSocket('ws://127.0.0.1:18089');

	// 연결 성공 시 호출되는 이벤트 핸들러
	assistantWebSocket.onopen = function (event) {
		console.log('assistantWebSocket 연결 성공!');
	};

	// 메시지 수신 시 호출되는 이벤트 핸들러
	assistantWebSocket.onmessage = function (event) {
		// 서버로부터 받은 메시지를 처리하는 함수를 여기에 작성합니다.
		console.log('WebSocket message :' + event);
		handleMessage(event.data);
	};

	// 에러 발생 시 호출되는 이벤트 핸들러
	assistantWebSocket.onerror = function (event) {
		console.error('assistantWebSocket 오류 발생!');
	};

	// 연결 종료 시 호출되는 이벤트 핸들러
	assistantWebSocket.onclose = function (event) {
		console.log('assistantWebSocket 연결 종료');
	};

	// 메시지 처리 함수 예시
	function handleMessage(message) {
		console.log('assistantWebSocket 받은 메시지:', message);
		let messageJson = JSON.parse(message);
		let commandType = messageJson["CommandType"];
		let data = messageJson["Data"];

		let now = new Date();
		let year = now.getFullYear();
		let month = String(now.getMonth() + 1).padStart(2, '0');
		let day = String(now.getDate()).padStart(2, '0');
		let hours = String(now.getHours()).padStart(2, '0');
		let minutes = String(now.getMinutes()).padStart(2, '0');
		let seconds = String(now.getSeconds()).padStart(2, '0');

		switch (commandType) {
			case 0:
				tenant = (data["Tenant"]) ? data["Tenant"] : 'DMO';
				agentId = data["AgentId"];
				dnis = data["Dnis"];

				$("#Tenant").html(tenant)
				$("#AgentId").html(agentId)
				$("#Dnis").html(dnis)

				KMST300P_fnTreeInit();

				KMST300P_fnListViewInit();

				KMST300P_fnSearchInit();

				KMST300P_fnGetFavorites();

				KMST300P_fnResize();
				$(window).resize(function () {
					KMST300P_fnResize();
				});
				break;
			case 1:
				//통화가 시작되었을경우
				let formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
				let phoneNumber = data["PhoneNumber"];
				$("#connectTime").html(formattedDateTime);
				// $("#connectNumber").html('[' + phoneNumber + ']');
				spanElement.innerHTML='[' + phoneNumber + '] 고객님과 통화연결 되었습니다.';
				break;
			case 2:
				let type = data["Type"];
				let message = data["Message"];
				let dateTime = data["DateTime"];
				let chatHtml = '';
				let formattedTime = `${hours}:${minutes}:${seconds}`;

				buffer.append(message);

				let html = new StringBuffer();
				if (type == "Rx") {
					html.append('<div class="item"><div class="chatbox"><p class="msg">');
				}else{
					html.append('<div class="item mymsg"><div class="chatbox"><p class="msg">');
				}

				html.append(buffer.toString())
				html.append('</p><span class="time">');
				html.append(formattedTime);
				html.append('</span></div></div>');

				$("#CNSL151P_ChatBox").append(html.toString());
				html.remove();
				buffer.remove();

				mecabWebSocket.send(message);
				scollBottom();
				break;
			case 3:
				//통화가 종료되었을경우
				$("#connectNumber").html('');
				$("#connectTime").html('');
				$("#CNSL151P_ChatBox").html('');
				$("#keyWord").html('');
				spanElement.innerText ="통화수신 대기중입니다.";
				break;
			case 4:
				let name = data["Name"]
				let activation = data["Activation"]

				if ( activation) {
					$("#" + name).addClass('state_red');
				} else {
					$("#" + name).removeClass('state_red');
				}
				break;
		}
	}
}


function mecabConnect() {
	// mecabWebSocket 객체 생성 및 서버에 연결
	mecabWebSocket = null;
	mecabWebSocket = new WebSocket('ws://crm.cloudcc.co.kr:18765');

	// 연결 성공 시 호출되는 이벤트 핸들러
	mecabWebSocket.onopen = function (event) {
		console.log('mecabWebSocket 연결 성공!');
	};

	// 메시지 수신 시 호출되는 이벤트 핸들러
	mecabWebSocket.onmessage = function (event) {
		// 서버로부터 받은 메시지를 처리하는 함수를 여기에 작성합니다.
		console.log('WebSocket message :' + event);
		handleMessage(event.data);
	};

	// 에러 발생 시 호출되는 이벤트 핸들러
	mecabWebSocket.onerror = function (event) {
		console.error('mecabWebSocket 오류 발생!');
	};

	// 연결 종료 시 호출되는 이벤트 핸들러
	mecabWebSocket.onclose = function (event) {
		console.log('mecabWebSocket 연결 종료');
	};

	// 메시지 처리 함수 예시
	function handleMessage(message) {
		console.log('mecabWebSocket 받은 메시지:', message);
		let messageJson = JSON.parse(message);
		let keyWordList = messageJson["list"];
		let keyWordTxt = '';
		for (var i=0; i<keyWordList.length; i++) {
			let keyWord = '';
			keyWord += '<button onclick="searchKMST(\'#'+keyWordList[i]+'\')">#';
			keyWord += keyWordList[i];
			keyWord += '<span class="fr">바로가기<span class="k-icon k-i-arrow-60-right"></span></span></button>';
			$("#keyWord").prepend(keyWord);
			keyWordTxt += '#' + keyWordList[i] + ' ';
		}
		let checkbox = document.getElementById('autoKeyword');
		let isChecked = checkbox.checked;
		if (isChecked) {
			searchKMST(keyWordTxt);
		}
	}
}

function searchKMST(srchText) {
	$("#KMST300P_srchText").val(srchText);
	KMST300P_fnSearchCheck();
}

function KMST300P_fnSearchInit(){
	$("#KMST300P_srchText").val("");
	KMST300P_fnInitSearch();
}

function KMST300P_fnResize(){
	const screenHeight = $(window).height() - 210;     //   (헤더+ 푸터 ) 영역 높이 제외
	let favorites = $('#KMST300P_Favorites').height();
	$("#treeKMST300P").css('height', screenHeight - favorites -253);
	$("#listViewKMST300P").find(".k-listview-content").css('height', screenHeight - favorites-220);
}

//1. TreeInit
function KMST300P_fnTreeInit() {
	KMST300P_tree = $("#treeKMST300P").kendoTreeView({
		autoScroll: true,
		template: function(item){
			if(item.item.case != 0){
				return item.item.ctgrNm +' <span class="fontRed">('+ item.item.case+')</span>';
			}else{
				return item.item.ctgrNm ;
			}
		},
		dataBound: function() {//   data 없을때
			if (this.dataSource.total() === 0){
				this.element.closest('.k-treeview').html('<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>');
			}
		},
		select: function(e) {
			let childArray = [];
			let clickItem = this.dataItem(e.node);

			childArray.push(this.dataItem(e.node).id);
			KMST300P_fnPushChild(clickItem,childArray);

			$('#listViewKMST300P').children("div").children("dl").map((x,y) => {
				y.hidden=true;
			});

			let list = $('#listViewKMST300P')[0].children[0];
			childArray.map(z=> {
				$('#listViewKMST300P').children("div").children("dl").map((x,y) => {
					if(y.id ==z){
						y.hidden=false;
					}
				});
			});
		}
	}).data('kendoTreeView');
}

function KMST300P_fnPushChild(clickItem,array){
	if(clickItem.items.length > 0){
		clickItem.items.map(x=>{
			array.push(x.id);
			KMST300P_fnPushChild(x,array);
		});
	}
}

//2. ListViewInit
function KMST300P_fnListViewInit(){
	$("#listViewKMST300P").kendoListView({
		//   data 있을때
		dataSource: {
			group: {
				field: 'category',
				dir: 'desc',
				compare: function (a, b) {
					if (a.items.length === b.items.length) {return 0;}
					else if (a.items.length > b.items.length) {return 1;}
					else {	return -1;}
				}
			},
		},
		dataBound: function(){//   data 없을때
			if (this.dataSource.total() === 0){this.element.find('.k-listview-content').html('<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>');}
		},
		scrollable: true,
		template:kendo.template($("#templateKMST300P").html())
		//2023.05.09 : 진료예약 버튼이 표출 되지 않도록 임시 주석 필요시 해제
		//popuplocation=="pop" ? kendo.template($("#templateKMST300P").html()) : kendo.template($("#templateKMST300T").html()),
	}).data("kendoListView");
}


function KMST300P_fnGetFavorites(){
	/*let param = {
		tenantId : GLOBAL.session.user.tenantId
		,usrId : GLOBAL.session.user.usrId
	};*/
	let param = {
		tenantId : tenant
		,usrId : agentId
	};
	Utils.ajaxCall("/frme/FRME220SEL01", JSON.stringify(param), function(data){
			let result = JSON.parse(JSON.parse(JSON.stringify(data.FRME220PInfo)));

			if(result.length > 0){
				let content ="";
				result.map(x=>{
					content += `<li id="F_${x.ctgrNo}_${x.cntntsNo}"><span onclick="KMST300P_fnFavoritesView(${x.ctgrNo},${x.cntntsNo})">${x.cntntsTite}</span>`+
						`<button class="k-chip-icon k-icon k-i-x" title="삭제" onclick="KMST300P_fnRemoveFavorites(${x.ctgrNo},${x.cntntsNo})"></button></li>`
				});
				let list = `<ul style="max-height: 90px; margin-top: -20px;" class="justCenter myName_postit">`+ content +`</ul>` ;
				$('#KMST300P_Favorites').append(list);
				KMST300P_fnResize();
			}
		},
		window.kendo.ui.progress($("#grdFRME220P"), true), window.kendo.ui.progress($("#grdFRME220P"), false))
}

function KMST300P_fnFavoritesView(ctgrNo,cntnntsNo){
	let parm =  {ctgrNo: ctgrNo, cntntsNo : cntnntsNo,type:"F"};
	Utils.openPop(GLOBAL.contextPath + "/kmst/KMST340P","KMST340P",1500,1000,parm);
}

function KMST300P_fnRemoveFavorites(ctgrNo,cntnntsNo){
	let parm =  {
		/*tenantId : GLOBAL.session.user.tenantId,
		usrId : GLOBAL.session.user.usrId,*/
		tenantId : tenant,
		usrId : agentId,
		ctgrNo: ctgrNo,
		cntntsNo : cntnntsNo
	};
	Utils.ajaxCall('/frme/FRME220DEL01', JSON.stringify(parm),function(data){
		if(data.FRME220PInfo > 0){
			$('#F_'+ctgrNo+'_'+cntnntsNo).remove();
			KMST300P_fnResize();
		}
	});
}

function KMST300P_fnReloadFavorites(){
	$('#KMST300P_Favorites').empty();
	KMST300P_fnGetFavorites();
}

//===Call Function========================================================================================================

//검색 호출
function KMST300P_fnSearch( ){

	let ctgrNolist = [];let ctgrMgntNolist=[];

	let list=[];
	KMST_fnTreeChangeList(KMST300P_DetailSearch.KMSTlist,list);
	for(let item of list){
		ctgrNolist.push(item.id);
	}

	list =[];
	KMST_fnTreeChangeList(KMST300P_DetailSearch.CMMTlist,list);
	for(let item of list){
		ctgrMgntNolist.push(item.id);
	}

	let param = {
		/*tenantId : GLOBAL.session.user.tenantId*/
		tenantId : tenant
		,searchType : KMST300P_DetailSearch.type
		,searchText : $("#KMST300P_srchText").val()
		,searchStartDate : KMST300P_DetailSearch.stradtDate
		,searchEndDate: KMST300P_DetailSearch.endDate
		,regrIds : KMST300P_DetailSearch.usrlist
		,ctgrNo : ctgrNolist
		,ctgrMgntNo : ctgrMgntNolist
	};

	Utils.ajaxCall("/kmst/KMST300SEL01",JSON.stringify(param),KMST300P_fnSearchResult,null,null,null);
}

function KMST300P_fnInitSearch(){
	//Utils.ajaxCall("/kmst/KMST300SEL04",JSON.stringify( {tenantId : GLOBAL.session.user.tenantId}),function(data)
	Utils.ajaxCall("/kmst/KMST300SEL04",JSON.stringify( {tenantId : tenant}),function(data){
		// console.log(item.kmstResult.hits.hits[0]._source.mokti[0].moktiCtt);
		let datalist = data.list;
		let treelist = data.tree;

		if(data.list.length <= 0){
			Utils.alert("ELK 연동에 실패하였습니다.");
			return;
		}
		treelist.map(x=>{x.count = datalist.filter(y => x.ctgrNo==y.ctgrNo && x.type == y.type).length;	});
		treelist.map(x=>{
			x.ctgrNo = x.type+"_"+x.ctgrNo;
			if(x.hgrkCtgrNo){
				x.hgrkCtgrNo  = x.type+"_"+x.hgrkCtgrNo;
			}
		});
		let resultTree = KMST_fnTreeSetCount(KMST_fnTreeCheckListValid(treelist));

//		$("#treeKMST300P").data("kendoTreeView").dataSource.data(resultTree);

		let list = [];
		for(let item of datalist){
			let img = "";
			if(Utils.isNotNull(item.rpsImgIdxNm)){
				if(item.type =="K"){
					img ='<img src= "'+GLOBAL.contextPath +'/kmstphotoimg/' + item.tenantId+'/'+item.rpsImgIdxNm+'">'
				}else{
					img ='<img src="'+GLOBAL.contextPath +'/cmmtphotoimg/' + item.tenantId+'/'+item.rpsImgIdxNm+'">'
				}
			}
			let data = {
				category: item.category,
				ctgrNo: item.ctgrNo,
				cntntsNo: item.cntntsNo,
				title: item.title,
				apeendFileCount: item.apeendFileCount,
				img: img,
				type : item.type,
				searchTextYn : "#FFFFFF"
			};
			list.push(data);
		}
		KSMT300P_SearchData = list;
		$("#listViewKMST300P").data("kendoListView").dataSource.data(list);

		console.log(list[0]);
		console.log(list.length);

		if(list.length > 0) {
			let param =  {ctgrNo: list[0].ctgrNo, cntntsNo : list[0].cntntsNo, tenantId : tenant};
			// Utils.openPop(GLOBAL.contextPath + "/kmst/KMST340P","KMST340P",1500,1000,parm);
			Utils.ajaxSyncCall("/kmst/KMST210SEL02", JSON.stringify(param), function(data){
				let response = JSON.parse(data.info);
				console.log('response :: ' , response.kmst211VoList[0].cntntsCttTxt);
				$("#ASST100P_test").html(response.kmst211VoList[0].cntntsCttTxt)
			},null,null,null);
		}

		$('#KMST300P_ResultString').text("");
		$('#KMST300P_ResultString').append("<em>"+$('#KMST300P_srchText').val()+"</em> 전체 문서는 <em>총 "+(data.list.length)+"건</em> 입니다. ");
		$('#KMST300P_treeToggle').prop("checked", true);

	} ,null,null,null);
}

function KMST300P_fnSearchResult(data){
	let item =JSON.parse(JSON.parse(JSON.stringify(data.list)));

	if(item.kmstResult == null || item.cmmtResult == null){
		Utils.alert("ELK 연동에 실패하였습니다.");
		return;
	}
	// console.log(item.kmstResult.hits.hits[0]);

	if(item.kmstResult.hits.hits[0]) {
		$("#ASST100P_test").html(item.kmstResult.hits.hits[0]._source.mokti[0].moktiCtt);
	}

	KMST300P_fnTreeMerge(item.kmstTreeList,item.cmmtTreeList);
	KMST300P_fnListViewMerge(item);

	$('#KMST300P_ResultString').text("");
	$('#KMST300P_ResultString').append("<em>"+$('#KMST300P_srchText').val()+"</em> 에 대한 검색 결과가 <em>총 "+(item.cmmtResult.hits.hits.length+item.kmstResult.hits.hits.length)+"건</em> 입니다. ");
	$('#KMST300P_treeToggle').prop("checked", true);
}

//===버튼 이벤트========================================================================================================

function KMST300P_fnSearchCheck(){
	if($('#KMST300P_srchText').val() ===''){
//		Utils.alert("검색어가 없습니다.");
		return;
	}

	if(JSON.stringify(KMST300P_DetailSearch) === JSON.stringify({})){

		let param = KMST_constAuthParam();

		/*
		if (GLOBAL.session.user.tenantId == ""){
			param = {
				tenantId: 'DMO',
				orgCd: '1',
				usrGrdCd: '120',
				usrId: 'DMO_A01'
			};
		}
		*/

		if (tenant){
			param = {
				tenantId: 'DMO',
				orgCd: '1',
				usrGrdCd: '120',
				usrId: 'DMO_A01'
			};
		}

		let cmmt,kmst;
		// Utils.ajaxSyncCall('/kmst/KMST200SEL01', JSON.stringify(KMST_constAuthParam()), function(data){
		Utils.ajaxSyncCall('/kmst/KMST200SEL01', JSON.stringify(param), function(data){
			kmst = KMST_fnTreeSet(KMST_fnTreeCheckListValid(data.list));
		},null,null,null);

		// Utils.ajaxSyncCall('/cmmt/CMMT200SEL01', JSON.stringify(KMST_constAuthParam()), function(data){
		Utils.ajaxSyncCall('/cmmt/CMMT200SEL01', JSON.stringify(param), function(data){
			cmmt = KMST_fnTreeSet(KMST_fnTreeCheckListValid(JSON.parse(JSON.parse(JSON.stringify(data.list)))));
		},null,null,null);

		KMST300P_DetailSearch = {
			stradtDate : new Date('2020-01-01').toISOString().substring(0,10),
			endDate : new Date().toISOString().substring(0,10),
			type : 'ALL',
			CMMTlist : cmmt,
			KMSTlist : kmst,
			usrlist  : []
		};
	}

	KMST300P_fnSearch();
}

//세부검색
function KMST300P_fnDetailSearch(obj){
	let left = $(obj).offset().right;
	let top = $(obj).offset().top + $(obj).parent().height();

	Utils.setCallbackFunction("DetailCallback", function (item) {
		KMST300P_DetailSearch = item;
	});

	if(popuplocation==="pop"){
		Utils.openKendoWindow("/kmst/KMST330P", 800, 400, "left",
			"calc(50% - 400px)", 100, false, {callbackKey: "DetailCallback"});
	}else{
		Utils.openKendoWindow("/kmst/KMST330P", 800, 400, "right",
			60, top, false, {callbackKey: "DetailCallback"});
	}


}

function KMST300P_fnSortOfDate(){
	KSMT300P_SearchData.sort((a, b) => new Date(b.date) - new Date(a.date));
	$("#listViewKMST300P").data("kendoListView").dataSource.data(KSMT300P_SearchData);

}
//JDJ 조회순 정렬 조회수 추가시 정렬 변경
function KMST300P_fnSortOfViewCount(){
	KSMT300P_SearchData.sort((a, b) => new Date(a.date) - new Date(b.date));
	$("#listViewKMST300P").data("kendoListView").dataSource.data(KSMT300P_SearchData);
}

//상세 조회
function KSMT300M_fnDetailView(obj){

	let split = obj.id.split("_");
	if(split[0] === "K"){
		let parm =  {ctgrNo: split[1], cntntsNo : split[2], text:$('#KMST300P_srchText').val()};
		let param =  {ctgrNo: split[1], cntntsNo : split[2], tenantId : (GLOBAL.session.user.tenantId) ? GLOBAL.session.user.tenantId : 'DMO'};
		// Utils.openPop(GLOBAL.contextPath + "/kmst/KMST340P","KMST340P",1500,1000,parm);
		Utils.ajaxSyncCall("/kmst/KMST210SEL02", JSON.stringify(param), function(data){
			let response = JSON.parse(data.info);
			console.log('response :: ' , response.kmst211VoList[0].cntntsCttTxt);
			$("#ASST100P_test").html(response.kmst211VoList[0].cntntsCttTxt)
		},null,null,null);
	}else{
		let parm =  {DASH110P_ctgrMgntNo: split[1], DASH110P_blthgMgntNo : split[2]};
		Utils.openPop(GLOBAL.contextPath + "/dash/DASH110P","DASH110P",1500,1000,parm);
	}
}


function KSMT300M_fnRsvClick(obj) {
	let split = obj.value.split("_");
	if (split[0] === "K") {
		let parm = {tenantId: GLOBAL.session.user.tenantId, ctgrNo: split[1], cntntsNo: split[2]};
		Utils.ajaxCall("/bizs/HCMH/CMHB211SEL02",JSON.stringify(parm),function (data){
			if(data.item != null){
				$(".tabCNSL100M").find("li").find("span").each(function() {
					if ($(this).attr("data-content-url") == '/bcs/bizs/HCMH/CMHB300T' || $(this).attr("data-content-url") == '/bcs/bizs/HCMH/CMHB300T' + '.jsp') {
						KMST340P_RsvData = { deasNo:data.item.deasNo, deasNm: data.item.deasNm};
						$(this).parent().click();
					}
				})
			}else{
				Utils.alert("해당 질병에 대한 예약정보가 없습니다.");
			}
		},null,null,null);
	}
}

//리스트형으로 보기
function KMST300P_fnViewList(){
	$('.kmsBoard').removeClass('Gallery');
}
//겔러리형으로 보기
function KMST300P_fnViewGallery(){
	$('.kmsBoard').addClass('Gallery');
}
//엔터 키 입력
$('#KMST300P_srchText').keydown(function(e) {
	if(e.key ==="Enter"){ KMST300P_fnSearchCheck();}
});

//Treeview  전체열기 클릭
$('#KMST300P_treeToggle').on('click', function(){
	if($(this).is(':checked')) { $("#treeKMST300P").data("kendoTreeView").expand('.k-item');$(this).prop("checked", true);}
	else { $("#treeKMST300P").data("kendoTreeView").collapse('.k-item');$(this).prop("checked", false);}
});

//===Sub Function=======================================================================================================
//트리 통합
function KMST300P_fnTreeMerge(kmstTreeList,cmmtTreeList){
	let kmst = KMST_fnTreeSetCount(KMST_fnTreeCheckListValid(kmstTreeList));
	let cmmt = KMST_fnTreeSetCount(KMST_fnTreeCheckListValid(cmmtTreeList));

	//트리 아이템 재부여
	KMST300P_fnSubTreeIdChange(kmst,"K");
	KMST300P_fnSubTreeIdChange(cmmt,"C");

	for (const obj of kmst.concat(cmmt)) {
		reduce(obj);
	}

	let result = kmst.concat(cmmt).filter(obj=>obj.items.length > 0);
//	$("#treeKMST300P").data("kendoTreeView").dataSource.data(result);
}
function reduce(tree) {
	if (!tree) return {};
	if (!tree.items) return tree.case !== 0 ? tree : {};
	tree.items = tree.items.filter((child) => child.case !== 0)
		.map((child) => reduce(child))
	return tree;
}

//트리 아이디 제부여
function KMST300P_fnSubTreeIdChange(list,type){
	for (let item of list) {
		item.id = type+ "_" + item.id;
		item.hgrkCtgrNo = type+ "_" + item.hgrkCtgrNo;
		if(item.items.length>0){
			KMST300P_fnSubTreeIdChange(item.items,type);
		}
	}
}

//리스트 통합
function KMST300P_fnListViewMerge(result){

	let kmst = [], cmmt =[];
	let kmstlist = result.kmstResult.hits.hits;
	let cmmtlist = result.cmmtResult.hits.hits;

	if(kmstlist.length > 0){
		kmst = KMST300P_fnListDataSet(kmstlist,result.kmstTreeList,"/bcs/kmstphotoimg/","K");
	}

	if(cmmtlist.length > 0){
		cmmt = KMST300P_fnListDataSet(cmmtlist,result.cmmtTreeList,"/bcs/cmmtphotoimg/","C");
	}


	let list= [];
	for(let item of kmst){	list.push(item);}
	for(let item of cmmt){	list.push(item);}

	list.sort((a, b) => new Date(b.date) - new Date(a.date));
	KSMT300P_SearchData = list;
	$("#listViewKMST300P").data("kendoListView").dataSource.data(list);
}

function KMST300P_fnListDataSet(list,tree,src,type){
	let result = [];

	for(let item of list){
		let img = "";
		if(Utils.isNotNull(item._source.rpsImgIdxNm)){
			img ='<img src="'+src+ item._source.tenantId+'/'+item._source.rpsImgIdxNm+'">'
		}

		let content = "";
		let searchTextYn='';
		if(item._source.mokti[0].moktiTite){
			if(item._source.mokti[0].moktiTite.includes('&lt;&gt;')) {
				content = $(Utils.htmlDecode(item._source.mokti[0].moktiTite))[0].textContent
				content =+ (item._source.mokti[0].moktiCttTxt == null ? "" : item._source.mokti[0].moktiCttTxt);
			}
			if(KMST300M_fnIsSearchTextFind(item._source.title)){
				searchTextYn ='#F2FAFF';
			}
		}

		let data = {
			category: tree.find(x => x.ctgrNo ===item._source.ctgrMgntNo*1).ctgrNm,
			ctgrNo: item._source.ctgrMgntNo,
			cntntsNo: item._source.blthgMgntNo,
			title: item._source.title,
			// typCd: item._source.typCd,
			// content: content,
			// regrNm: item._source.regrNm + "("+item._source.regrId+")",
			// viewCount: 0,//JDJ 추후 el 작업 완료후 활성화 //item._source.viewCount,
			apeendFileCount: item._source.appendFileCount,
			// date: item._source.regDtm,
			img: img,
			type : type,
			searchTextYn : searchTextYn
		};
		result.push(data);
	}
	return result;
}

function KMST300M_fnIsSearchTextFind(content){	// let text = Content
	let searchTxt = $("#KMST300P_srchText").val();
	return content.includes(searchTxt);
//	let searchTxt = $("#KMST300M_srchText").val();
//	let regex = new RegExp(searchTxt, "g");
//	return content.replace(regex, "<span style='background: #C1DFF1'>" + searchTxt + "</span>");
}


function scollBottom() {
	let container = $('#CNSL151P_ChatBox');
	container.scrollTop(9999999999);
}