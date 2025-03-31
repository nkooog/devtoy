var KMST300P_DetailSearch ={};
var KMST300P_DataSource;
var KSMT300P_SearchData;

var KMST300P_tree;

$(document).ready(function () {
	//1. TreeInit
	KMST300M_fnTreeInit();
	//2. ListViewInit
	KMST300M_fnListViewInit();

	KMST300M_fnSearchInit(); //초기 로드시 검색 조건

	KMST300M_fnGetFavorites();

	KMST300M_fnResize();
	$(window).resize(function () {
		KMST300M_fnResize();
	});
});

function KMST300M_fnSearchInit(){
	$("#KMST300M_srchText").val("");
	KMST300M_fnInitSearch();
}

function KMST300M_fnResize(){
	const screenHeight = $(window).height() - 210;     //   (헤더+ 푸터 ) 영역 높이 제외
	let favorites = $('#KMST300P_Favorites').height();
	$("#treeKMST300M").css('height', screenHeight - favorites -253);
	$("#listViewKMST300M").find(".k-listview-content").css('height', screenHeight - favorites-220);

	//kw---20240529 : 그리드 리사이즈	
//	let screenHeight = $(window).height() - 210;     //   (헤더+ 푸터 ) 영역 높이 제외
//	$("#treeKMST300M").css('height', screenHeight -267);
//	$("#treeKMST300M").css('min-height', minHeight -257);
//	$("#listViewKMST300M").css('height', screenHeight-267);
//	$("#listViewKMST300M").css('min-height', minHeight-257);
}

//1. TreeInit
function KMST300M_fnTreeInit() {
	KMST300P_tree = $("#treeKMST300M").kendoTreeView({
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
			KMST300M_fnPushChild(clickItem,childArray);

			$('#listViewKMST300M').children("div").children("dl").map((x,y) => {
				y.hidden=true;
			});

			let list = $('#listViewKMST300M')[0].children[0];
			childArray.map(z=> {
				$('#listViewKMST300M').children("div").children("dl").map((x,y) => {
					if(y.id ==z){
						y.hidden=false;
					}
				});
			});
		}
	}).data('kendoTreeView');
}

function KMST300M_fnPushChild(clickItem,array){
	if(clickItem.items.length > 0){
		clickItem.items.map(x=>{
			array.push(x.id);
			KMST300M_fnPushChild(x,array);
		});
	}
}

//2. ListViewInit
function KMST300M_fnListViewInit(){
	$("#listViewKMST300M").kendoListView({
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


function KMST300M_fnGetFavorites(){
	let param = {
		tenantId : GLOBAL.session.user.tenantId
		,usrId : GLOBAL.session.user.usrId
	};
	Utils.ajaxCall("/frme/FRME220SEL01", JSON.stringify(param), function(data){
			let result = JSON.parse(JSON.parse(JSON.stringify(data.FRME220PInfo)));

			//kw---20240315 : 즐겨찾기 항목 버튼에 마우스 커서를 포인터로 변경
			if(result.length > 0){
				let content ="";
				result.map(x=>{
					content += `<li id="F_${x.ctgrNo}_${x.cntntsNo}"><span onclick="KMST300M_fnFavoritesView(${x.ctgrNo},${x.cntntsNo})" style="cursor: pointer;">${x.cntntsTite}</span>`+				
						`<button class="k-chip-icon k-icon k-i-x" title="삭제" onclick="KMST300M_fnRemoveFavorites(${x.ctgrNo},${x.cntntsNo})"></button></li>`
				});
				let list = `<ul style="max-height: 90px; margin-top: -20px;" class="justCenter myName_postit">`+ content +`</ul>` ;
				$('#KMST300P_Favorites').append(list);
				KMST300M_fnResize();
			}
		},
		window.kendo.ui.progress($("#grdFRME220P"), true), window.kendo.ui.progress($("#grdFRME220P"), false))
}

function KMST300M_fnFavoritesView(ctgrNo,cntnntsNo){
	let parm =  {ctgrNo: ctgrNo, cntntsNo : cntnntsNo,type:"F"};
	Utils.openPop(GLOBAL.contextPath + "/kmst/KMST340P","KMST340P",1500,1000,parm);
}

function KMST300M_fnRemoveFavorites(ctgrNo,cntnntsNo){
	let parm =  {
		tenantId : GLOBAL.session.user.tenantId,
		usrId : GLOBAL.session.user.usrId,
		ctgrNo: ctgrNo,
		cntntsNo : cntnntsNo
	};
	Utils.ajaxCall('/frme/FRME220DEL01', JSON.stringify(parm),function(data){
		if(data.FRME220PInfo > 0){
			$('#F_'+ctgrNo+'_'+cntnntsNo).remove();
			KMST300M_fnResize();
		}
	});
}

function KMST300M_fnReloadFavorites(){
	$('#KMST300P_Favorites').empty();
	KMST300M_fnGetFavorites();
}

//===Call Function========================================================================================================

//검색 호출
function KMST300M_fnSearch( ){

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
		        tenantId : GLOBAL.session.user.tenantId
		     ,searchType : KMST300P_DetailSearch.type
		     ,searchText : $("#KMST300M_srchText").val()
		,searchStartDate : KMST300P_DetailSearch.stradtDate
		   ,searchEndDate: KMST300P_DetailSearch.endDate
		        ,regrIds : KMST300P_DetailSearch.usrlist
		         ,ctgrNo : ctgrNolist
		     ,ctgrMgntNo : ctgrMgntNolist
			,lstCorprId	 : GLOBAL.session.user.usrId
		 ,lstCorprOrgCd	 : GLOBAL.session.user.orgCd
		 ,kldScwdSaveYn  : GLOBAL.session.user.kldScwdSaveYn
	};

	scwdCookie()

	Utils.ajaxCall("/kmst/KMST300SEL01",JSON.stringify(param),KMST300M_fnSearchResult,null,null,null);
}


function KMST300M_fnInitSearch(){
	Utils.ajaxCall("/kmst/KMST300SEL04",JSON.stringify( {tenantId : GLOBAL.session.user.tenantId}),function(data){

		let datalist = data.list;
		let treelist = data.tree;

		if(data.list.length <= 0){
			//Utils.alert("ELK 연동에 실패하였습니다.");
			console.log("ELK 연동에 실패하였습니다. 또는 조회 된 자료가 없습니다.(1)");
			$("#treeKMST300M").data("kendoTreeView").dataSource.data([]);
			$("#listViewKMST300M").data("kendoListView").dataSource.data([]);
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

		$("#treeKMST300M").data("kendoTreeView").dataSource.data(resultTree);

		let list = [];
		for(let item of datalist){
			let img = "";
			if(Utils.isNotNull(item.rpsImgIdxNm)){
				if(item.type =="K"){
					img ='<img src="/bcs/kmstphotoimg/' + item.tenantId+'/'+item.rpsImgIdxNm+'">'
				}else{
					img ='<img src="/bcs/cmmtphotoimg/' + item.tenantId+'/'+item.rpsImgIdxNm+'">'
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
		$("#listViewKMST300M").data("kendoListView").dataSource.data(list);

		$('#KMST300P_ResultString').text("");
		$('#KMST300P_ResultString').append("<em>"+$('#KMST300M_srchText').val()+"</em> 전체 문서는 <em>총 "+(data.list.length)+"건</em> 입니다. ");
		$('#KMST300M_treeToggle').prop("checked", true);

	} ,null,null,null);
}

function KMST300M_fnSearchResult(data){
	let item =JSON.parse(JSON.parse(JSON.stringify(data.list)));

	if(item.kmstResult == null || item.cmmtResult == null){
		//Utils.alert("ELK 연동에 실패하였습니다.");
		console.log("ELK 연동에 실패하였습니다. 또는 조회 된 자료가 없습니다.(2)");
		$("#treeKMST300M").data("kendoTreeView").dataSource.data([]);
		$("#listViewKMST300M").data("kendoListView").dataSource.data([]);
		return;
	}

	KMST300M_fnTreeMerge(item.kmstTreeList,item.cmmtTreeList);
	KMST300M_fnListViewMerge(item);

	$('#KMST300P_ResultString').text("");
	$('#KMST300P_ResultString').append("<em>"+$('#KMST300M_srchText').val()+"</em> 에 대한 검색 결과가 <em>총 "+(item.cmmtResult.hits.hits.length+item.kmstResult.hits.hits.length)+"건</em> 입니다. ");
	$('#KMST300M_treeToggle').prop("checked", true);




}

//===버튼 이벤트========================================================================================================

function KMST300M_fnSearchCheck(){
	console.log("KMST300M_fnSearchCheck")
	if($('#KMST300M_srchText').val() ===''){
		Utils.alert("검색어가 없습니다.");
		return;
	}

	if(JSON.stringify(KMST300P_DetailSearch) === JSON.stringify({})){

		let cmmt,kmst;
		Utils.ajaxSyncCall('/kmst/KMST200SEL01', JSON.stringify(KMST_constAuthParam()), function(data){
			kmst = KMST_fnTreeSet(KMST_fnTreeCheckListValid(data.list));
		},null,null,null);

		Utils.ajaxSyncCall('/cmmt/CMMT200SEL01', JSON.stringify(KMST_constAuthParam()), function(data){
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

	KMST300M_fnSearch();
}

//세부검색
function KMST300M_fnDetailSearch(obj){
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

function KMST300M_fnSortOfDate(){
	KSMT300P_SearchData.sort((a, b) => new Date(b.date) - new Date(a.date));
	$("#listViewKMST300M").data("kendoListView").dataSource.data(KSMT300P_SearchData);

}
//JDJ 조회순 정렬 조회수 추가시 정렬 변경
function KMST300M_fnSortOfViewCount(){
	KSMT300P_SearchData.sort((a, b) => new Date(a.date) - new Date(b.date));
	$("#listViewKMST300M").data("kendoListView").dataSource.data(KSMT300P_SearchData);
}

//상세 조회
function KSMT300M_fnDetailView(obj){
	let split = obj.id.split("_");
	if(split[0] === "K"){
		let parm =  {ctgrNo: split[1], cntntsNo : split[2], text:$('#KMST300M_srchText').val()};
		Utils.openPop(GLOBAL.contextPath + "/kmst/KMST340P","KMST340P",1500,1000,parm);

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
function KMST300M_fnViewList(){
	$('.kmsBoard').removeClass('Gallery');
}
//겔러리형으로 보기
function KMST300M_fnViewGallery(){
	$('.kmsBoard').addClass('Gallery');
}
//엔터 키 입력
$('#KMST300M_srchText , #KMST300M_srchText_listbox').keydown(function(e) {
	if(e.key ==="Enter"){ KMST300M_fnSearchCheck();}

});

//Treeview  전체열기 클릭
$('#KMST300M_treeToggle').on('click', function(){
	if($(this).is(':checked')) { $("#treeKMST300M").data("kendoTreeView").expand('.k-item');$(this).prop("checked", true);}
	else { $("#treeKMST300M").data("kendoTreeView").collapse('.k-item');$(this).prop("checked", false);}
});

//===Sub Function=======================================================================================================
 //트리 통합
function KMST300M_fnTreeMerge(kmstTreeList,cmmtTreeList){
	let kmst = KMST_fnTreeSetCount(KMST_fnTreeCheckListValid(kmstTreeList));
	let cmmt = KMST_fnTreeSetCount(KMST_fnTreeCheckListValid(cmmtTreeList));

	//트리 아이템 재부여
	KMST300M_fnSubTreeIdChange(kmst,"K");
	KMST300M_fnSubTreeIdChange(cmmt,"C");

	for (const obj of kmst.concat(cmmt)) {
		reduce(obj);
	}
	
	
	//kw---20240531 : 지식관리 - 카테고리->게시판 유형이 아닌 카테고리 없는 게시판일 경우 트리에 표출이 안되는 버그 수정
	let result1 = kmst.concat(cmmt).filter(obj=>obj.items.length > 0);
	let result2 = kmst.concat(cmmt).filter(obj=>obj.case > 0);
	$("#treeKMST300M").data("kendoTreeView").dataSource.data(result1.concat(result2));
	
}
function reduce(tree) {
	if (!tree) return {};
	if (!tree.items) return tree.case !== 0 ? tree : {};
		tree.items = tree.items.filter((child) => child.case !== 0)
							   .map((child) => reduce(child))
	return tree;
}

//트리 아이디 제부여
function KMST300M_fnSubTreeIdChange(list,type){
	for (let item of list) {
		item.id = type+ "_" + item.id;
		item.hgrkCtgrNo = type+ "_" + item.hgrkCtgrNo;
		if(item.items.length>0){
			KMST300M_fnSubTreeIdChange(item.items,type);
		}
	}
}

//리스트 통합
function KMST300M_fnListViewMerge(result){

	let kmst = [], cmmt =[];
	let kmstlist = result.kmstResult.hits.hits;
	let cmmtlist = result.cmmtResult.hits.hits;

	if(kmstlist.length > 0){
		kmst = KMST300M_fnListDataSet(kmstlist,result.kmstTreeList,"/bcs/kmstphotoimg/","K");
	}

	if(cmmtlist.length > 0){
		cmmt = KMST300M_fnListDataSet(cmmtlist,result.cmmtTreeList,"/bcs/cmmtphotoimg/","C");
	}


	let list= [];
	for(let item of kmst){	list.push(item);}
	for(let item of cmmt){	list.push(item);}

	list.sort((a, b) => new Date(b.date) - new Date(a.date));
	KSMT300P_SearchData = list;
	
	for(let i=0; i<list.length; i++) {
//		list[i].title=KMST300M_fnIsSearchTextFind(list[i].title);
		if(KMST300M_fnIsSearchTextFind(list[i].title)) {
			list[i].searchTextYn = '#F2FAFF';
		}
	}
	
	$("#listViewKMST300M").data("kendoListView").dataSource.data(list);
}

function KMST300M_fnListDataSet(list,tree,src,type){
	let result = [];

	for(let item of list){
		let img = "";
		if(Utils.isNotNull(item._source.rpsImgIdxNm)){
			img ='<img src="'+src+ item._source.tenantId+'/'+item._source.rpsImgIdxNm+'">'
		}

		let content = "";
		if(item._source.mokti[0].moktiTite){
			if(item._source.mokti[0].moktiTite.includes('&lt;&gt;')) {
				content = $(Utils.htmlDecode(item._source.mokti[0].moktiTite))[0].textContent
				content =+ (item._source.mokti[0].moktiCttTxt == null ? "" : item._source.mokti[0].moktiCttTxt);
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
			/*searchTextYn : searchTextYn*/
		};
		result.push(data);
	}
	return result;
}

function KMST300M_fnIsSearchTextFind(content){	// let text = Content
	let searchTxt = $("#KMST300M_srchText").val();
	return content.includes(searchTxt);
//	let searchTxt = $("#KMST300M_srchText").val();
//	let regex = new RegExp(searchTxt, "g");
//	return content.replace(regex, "<span style='background: #C1DFF1'>" + searchTxt + "</span>"); 
}
function scwdCookie(){
	if(GLOBAL.session.user.kldScwdSaveYn == 'Y'){
		var text = $("#KMST300M_srchText").val()
		if(text != ''){
			const date = new Date();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const formattedDate = `${month}-${day}`;
			Utils.putCookieArrToJson("scwd" , {scwd : text , inMySc : 1 , scwdDate : formattedDate} )
		}
	}
}


