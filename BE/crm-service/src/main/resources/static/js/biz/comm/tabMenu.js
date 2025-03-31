/***********************************************************************************************
 * Program Name : 탭메뉴관리 공통 라이브러리(tabMenu.js)
 * Creator      : sukim
 * Create Date  : 2022.03.14
 * Description  : 탭메뉴관리 공통 라이브러리
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.14     sukim            최초생성     
 * 2022.03.14     djjung           특정탭 Reload 기능 추가    
 ************************************************************************************************/  

var tabStrip;
var activateTabId;    //활성화된 탭이름
var comm_TabData = new Array();
var frme_Head_Switch= []; //현재사용중인 메인화면 저장공간
var frme_head_CMS=[]; //전체 메인화면 목록
$(document).ready(function () {
	//1.TabControl init
	createTabStrip();
	//2.Tab Contorl Sort init
	configureSortable();
	//4.Tab Close Event Add
	onTabClose();
});

//1. Tab TabControl init
function createTabStrip() {
	tabStrip = $("#ct_contents").kendoTabStrip({
		tabPosition: "top",
        activate: onActivate,
        navigatable: false,
		contentLoad: MAINFRAME.onTabContentLoad,
		animation: {open: {	effects: "" }}
    }).data('kendoTabStrip');
}
//2.Tab Contorl Sort기능 추가
function configureSortable() {
	$("#ct_contents ul.k-tabstrip-items").not(".innerTab ul.k-tabstrip-items,.noticeTab ul.k-tabstrip-items").kendoSortable({
		filter: "li.k-item",
		axis: "x",
		container: "ul.k-tabstrip-items",
		hint: function (element) {
			return $("<div id='hint' class='k-widget k-tabstrip'><ul class='k-tabstrip-items k-reset'><li class='k-item k-state-active k-tab-on-top'>" + element.html() + "</li></ul></div>");
		},
		start: function (e) {
			tabStrip.activateTab(e.item);
		},
		change: function (e) {
			reference = tabStrip.tabGroup.children().eq(e.newIndex);
			if (e.oldIndex < e.newIndex) {tabStrip.insertAfter(e.item, reference);}
			else { tabStrip.insertBefore(e.item, reference);}
			initTabArray();
		}
	});
}


//Call Function - Tab 생성전 사전작업
function addTab(_tName,_tId,_tUrl,_tIcon){
	let tName = (_tName) ? _tName : $("#tabName").val();
	let tId = (_tId) ? _tId : $("#tabId").val();
	let tUrl = (_tUrl) ? _tUrl : $("#tabUrl").val();
	let tIcon = (_tIcon) ? _tIcon : $("#tabIcon").val();

	if(comm_TabData.length == 0){
		if(tId !==undefined){
			openTab(tId, tName, tUrl, tIcon);
		}
	}else if(comm_TabData.length > 0){
    	if(!IsTabOpen(tId)){
			openTab(tId, tName, tUrl, tIcon);
    	}else{
			tabStrip.select(findTabIndex(tId));
    	}
	}
}
//Call Function - Tab 생성
function openTab(menuId, menuNm, url, icoImgUrl){
	let isOpen = fnOpenConsultation(menuId);
	if(isOpen){
		comm_TabData.push(menuId);
		tabStrip.append({
   	 			id: menuId,
    	    	text: menuNm + '<span data-type="remove" class="k-link"><span class="k-icon k-i-x"></span></span>',
    	    	encoded: false,
    	    	imageUrl: icoImgUrl, //디폴트 이미지를 사용할 경우
    	    	contentUrl: url
    	    },
    	    tabStrip.tabGroup.children().eq(1)
    	);
    	tabStrip.select("li:last");
	}
}

//======================================================================================================================
//Subfunction
function removeItems(arr, value) {
	let i = 0;
	while (i < arr.length) {
		if (arr[i] === value) {	arr.splice(i, 1);}
		else { ++i; }
	}
}
//Subfunction
function initTabArray(){
	comm_TabData = new Array();
	for (let itemlist of getElementTabItem()){
		if(typeof itemlist.childNodes[1] !== 'undefined') {
			comm_TabData.push(itemlist.childNodes[1].dataset.contentUrl.split('?')[1].split('&')[1].split('=')[1]);
		}else{
			if(Utils.isNotNull(itemlist.parentNode.parentNode.querySelector('ul > li[aria-selected="true"]'))) {
				comm_TabData.push(itemlist.parentNode.parentNode.querySelector('ul > li[aria-selected="true"]').childNodes[1].dataset.contentUrl.split('?')[1].split('&')[1].split('=')[1]);
			}

		}
	}
}
//Subfunction
function findTabIndex(frameId){
	let i = comm_TabData.findIndex(x => x === frameId);
	if(i>= 0){ return i;}
	else{return 0;}
}
//Subfunction
function IsTabOpen(frameId){
	let i = comm_TabData.findIndex(x => x === frameId);
	if(i >= 0){	return true;}
	else{ return false; }
}
//Subfunction
function getElementTabItem(){
	return document.getElementById("ct_contents").childNodes[0].querySelector('ul').childNodes;
}

//======================================================================================================================
//Event - Close All Tab (전체 열림 탭 닫기)
function closeAllTabs(isUser){
	if(comm_TabData.length===0){return;}

	if(isUser){
		Utils.confirm(MAINFRAME_langMap.get("FRME100M.tab.confirm.close.all"),function () { //전체 화면을 닫으시겠습니까?
			tabStrip.remove(tabStrip.tabGroup.children());
			comm_TabData = new Array();

			$("#FRME_MENU_SYSTEM_FN_BTN input[type=checkbox]").prop('checked',false);
			frme_Head_Switch= [];

			MAINFRAME.initDataFrame();
		});
	}else{
		tabStrip.remove(tabStrip.tabGroup.children());
		comm_TabData = new Array();

		$("#FRME_MENU_SYSTEM_FN_BTN input[type=checkbox]").prop('checked',false);
		frme_Head_Switch= [];

		MAINFRAME.initDataFrame();
	}
}
//Event - Close Tab (열림 탭 닫기)
function closeTab(frameId){
	if(comm_TabData.length===0){return;}
	tabStrip.remove("li:eq("+findTabIndex(frameId)+")");
	comm_TabData = comm_TabData.filter(x=> x!==frameId);
	tabStrip.select("li:first");

	frme_head_CMS.map(x=>{
		if(x == frameId){
			$("#"+x+"_main").prop("checked", false);
			if(frme_Head_Switch.find(x=>x==frameId)){
				frme_Head_Switch.pop();
			}
		}
	});
}

//Event - Tab Close Evenat Add (Button 이벤트 추가)
function onTabClose(){
	tabStrip.tabGroup.on("click", "[data-type='remove']", function(e) {
		Utils.confirm(MAINFRAME_langMap.get("FRME100M.tab.confirm.close"), function () { // 화면을 닫으시겠습니까?
			e.preventDefault();
			e.stopPropagation();

			let item = $(e.target).closest(".k-item");

			fnCloseConsultation(item.index());
			tabStrip.remove(item.index());
			removeItems(getElementTabItem(), item.text());
			initTabArray();

			if (tabStrip.items().length > 0 && item.hasClass('k-state-active')) {
				tabStrip.select("li:last");
			}
		});
	});
}
//Event - Activate Tab Get (활성화된 탭 ID 전역 저장)
function onActivate(e) {
	activateTabId =$(e.item).find("> .k-link")[0].dataset.contentUrl.split('?')[1].split('&')[1].split('=')[1];
}
//Event -  Activate Tab Reload (활성화된 탭 세로고침)
function fnReloadOpenTab(){
	tabStrip.reload("li:eq("+findTabIndex(activateTabId)+")");
}
//Event - All Tab Reload (전체 세로고침_세션변경후 사용)
function fnReloadAllTab(){
	for (let i=0; i < comm_TabData.length; i++){
		tabStrip.reload("li:eq("+i+")");
	}
}


// 메인상담화면 열기 체크 로직
function fnOpenConsultation(id){
	if(frme_head_CMS.find(x=>x==id)){
		if (frme_Head_Switch.length < 1) {
			$("#"+id+"_main").prop("checked", true);
			frme_Head_Switch.push(id);
			return true;
		}else{
			$("#"+id+"_main").prop("checked", false);
			Utils.alert(MAINFRAME_langMap.get("FRME_TOP.multiple.open.main"));
			return false;
		}
	}else{
		return true;
	}
}
//메인 상담화면 닫기 체크 로직
function fnCloseConsultation(idx){
	frme_Head_Switch.map(x=> {
		if(comm_TabData[idx]==x){
			$("#"+x+"_main").prop("checked", false);
			frme_Head_Switch.pop();
		}
	});
}
//메인 상담화면 동적 스위치 동작이벤트
function FRME_TOP_fnOpenCnsl(obj) {
	let pathId = $(obj).data("path-id");
	let checked = $(obj).is(":checked");

	if(checked){ // 열기
		MAINFRAME.openDataFrameById(pathId);
	}else{ // 닫기
		Utils.confirm(MAINFRAME_langMap.get("FRME_TOP.close.main"),function(){
			MAINFRAME.closeDataFrameById(pathId);
		},function(){
			$(obj).prop("checked", true);
		});
	}
}
function FRME_TOP_fnClearCnslSwitch(){
	$('#FRME_MENU_SYSTEM_FN_BTN').children('.swithCheck').remove();
	frme_head_CMS=[];
}

var TabUtils = (function () {
	return {
		openCnslMainTab(gridNum,data,arletMessage,type) {
			switch (type){
				case "main": {
					let parm =  {gridNum : gridNum, gridKey:data};
					let funString =  'TabSel("'+gridNum+'",'+data+')'

					if(frme_head_CMS.length>0){//전체 등록되있는메인화면 목록
						if(frme_Head_Switch.length>0){//사용중인 메인화면 목록
							if(MAINFRAME.isTabOpen(frme_Head_Switch[0])==true){
								new Function(frme_Head_Switch[0]+funString)();
							}
							MAINFRAME.openDataFrameById(frme_Head_Switch[0], parm);
						}else{
							if(MAINFRAME.isTabOpen(frme_head_CMS[0])==true){
								new Function(frme_head_CMS[0]+funString)();
							}
							MAINFRAME.openDataFrameById(frme_head_CMS[0], parm);
						}
					}else{
						Utils.alert(arletMessage);
					}
				} break;
				case "card": {
					let parm =  {gridNum : gridNum};
					let funString =  'TabSel("'+gridNum+'")'

					if(frme_head_CMS.length>0){//전체 등록되있는메인화면 목록
						if(frme_Head_Switch.length>0){//사용중인 메인화면 목록
							if(MAINFRAME.isTabOpen(frme_Head_Switch[0])==true){
								new Function(frme_Head_Switch[0]+funString)();
							}
							MAINFRAME.openDataFrameById(frme_Head_Switch[0], parm);
						}else{
							if(MAINFRAME.isTabOpen(frme_head_CMS[0])==true){
								new Function(frme_head_CMS[0]+funString)();
							}
							MAINFRAME.openDataFrameById(frme_head_CMS[0], parm);
						}
					}else{
						Utils.alert(arletMessage);
					}
				} break;

				case "pop": {
					let parm =  {gridNum : gridNum, gridKey:data};
					let funString =  'TabSel("'+gridNum+'",'+data+')'

					if(Utils.getParent().frme_head_CMS.length>0){//전체 등록되있는메인화면 목록
						if(Utils.getParent().frme_Head_Switch.length>0){//사용중인 메인화면 목록
							if(Utils.getParent().MAINFRAME_SUB.isTabOpen(Utils.getParent().frme_Head_Switch[0])==true){
								new Function('Utils.getParent().'+Utils.getParent().frme_Head_Switch[0]+funString)();
							}
							Utils.getParent().MAINFRAME_SUB.openDataFrameById(Utils.getParent().frme_head_CMS[0], parm);
						}else{
							if(Utils.getParent().MAINFRAME_SUB.isTabOpen(Utils.getParent().frme_head_CMS[0])==true){
								new Function('Utils.getParent().'+Utils.getParent().frme_head_CMS[0]+funString)();
							}
							Utils.getParent().MAINFRAME_SUB.openDataFrameById(Utils.getParent().frme_head_CMS[0], parm);
						}
					}else{
						Utils.alert(arletMessage);
					}
				} break;
			}

		}

	}
})();
