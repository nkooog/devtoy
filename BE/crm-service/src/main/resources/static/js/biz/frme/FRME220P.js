/***********************************************************************************************
 * Program Name : My 컨텐츠 - 팝업(FRME220P.js)
 * Creator      : bykim
 * Create Date  : 2022.06.07
 * Description  : My 컨텐츠 - 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.06.07     bykim            최초작성

 ************************************************************************************************/

var FRME220PDataSource ;

$(document).ready(function () {
    FRME220P_fnSelectCmmCode();

    FRME220PDataSource = {
        transport: {
            read: function (FRME220P_param) {
            	Utils.ajaxCall("/frme/FRME220SEL01", FRME220P_param, FRME220P_fnResultList,
						window.kendo.ui.progress($("#grdFRME220P"), true), window.kendo.ui.progress($("#grdFRME220P"), false)) 
            }
        }
    }
    $("#grdFRME220P").kendoGrid({
        dataSource: FRME220PDataSource,
        autoBind: false,
        resizable: true,
        sortable: false,
        height: 365,
        scrollable: true,
        selectable: true,
		noRecords: { template: `<div class="nodataMsg"><p>${FRME220P_langMap.get("FRME220P.nodatafound")}</p></div>` },
        dataBound: FRME220P_onDataBound,
        pageable: {
            refresh: true,
            pageSizes: [25, 50, 100, 200, 500],
            buttonCount: 10,
            pageSize: 25,
        },
    	columns: [  
			{ width: 30, field: "check", title: " ", headerAttributes: {"class": "bdNoneRight"}, attributes: {"class": "pad_0"}, template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>', },  
			{ width: 20, field: "favorite", title: " ", headerAttributes: {"class": "pad_0 bdNoneRight textRight"}, attributes: {"class": "pad_0 bdNoneRight textRight"},
				template: '<span class="favorite" title="즐겨찾기"><input type="checkbox" checked onclick="FRME220P_fnDelBook(this)"> <label class="k-icon k-i-star-outline"></label></span> ', },
			{ width: "auto", field: "cntntsTite", title:  FRME220P_langMap.get("FRME220P.grid.title"), attributes: {"class": "textEllipsis"}, },
			{ width: "auto", field: "brdpath", title: FRME220P_langMap.get("FRME220P.grid.catogory"), attributes: {"class": "textEllipsis"}, },
			{ width: 110, field: "usrNm", title: FRME220P_langMap.get("FRME220P.grid.regId"), template:"#=usrNm+'('+usrId+')'# " },
			{ width: 80, field: "regDtm", title: FRME220P_langMap.get("FRME220P.grid.regDtm"), template : '#=kendo.format("{0:yyyy-MM-dd}",new Date(regDtm))#',},
		],
    })

    FRME220P_grdFRME220P = $("#grdFRME220P").data("kendoGrid");

	FRME220P_SearchInit();
	
	var FRME220P_screenHeight = $(window).height();
	$('#grdFRME220P').css('height',  FRME220P_screenHeight-150);  
	
	var gridH = $('#grdFRME220P').outerHeight();   //   id 명 rename 요함!
	$('.bookFrame').css('height', gridH)  

	var bookFrameH = $('.bookFrame').height();
	$('.bookFrame .nodataMsg ,  .bookFrame .textareaCnt').css('height', bookFrameH-32); 
	
	$("#FRME220P_srchText").on('keypress',function(e){
		if(e.keyCode == 13){
			FRME220P_fnsrch();
		}		
	})
	
});


function FRME220P_fnSelectCmmCode() {
	
	let FRME220P_Serch_data = {
			tenantId : GLOBAL.session.user.tenantId
			,usrId : GLOBAL.session.user.usrId
			,usrGrdCd :GLOBAL.session.user.usrGrd
			,orgCd : GLOBAL.session.user.orgCd
		};

	Utils.ajaxCall('/kmst/KMST200SEL01', JSON.stringify(FRME220P_Serch_data),FRME220P_fnSetCmmCode);
}

function FRME220P_fnSetCmmCode(data) {
	
	FRME220P_cateList  =data.list;
	
	$("#FRME220P_cobCate").kendoComboBox({ 
		dataTextField: "ctgrNm",
		dataValueField: "ctgrNo",
		dataSource: FRME220P_cateList, 
		clearButton: false,
		height: 200,
		//value: FRME220P_cateList[0].ctgrNo,
	}); 
}

function FRME220P_fnResultList(data){
	let FRME220P_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(data.FRME220PInfo)));

	FRME220P_jsonDecode.forEach(function(val){
		val.cntntsTite =  Utils.htmlDecode(val.cntntsTite);
	})
	FRME220P_grdFRME220P.dataSource.data(FRME220P_jsonDecode);
}

function FRME220P_onDataBound(e) {
	$("#grdFRME220P").on('click','tbody tr[data-uid]',function (e) {
		const myNode = $('#FRME220P_content')[0];
		  while (myNode.firstChild) {
		    myNode.removeChild(myNode.lastChild);
		  }
		$('#FRME220P_content').append('<h4 class="h4_tit" id="FRME220P_category">카테고리 > 카테고리</h4>')
		
		let FRME220P_cell = $(e.currentTarget);
		let	FRME220P_item	= FRME220P_grdFRME220P.dataItem(FRME220P_cell.closest("tr"))

		$('#FRME220P_category')[0].innerHTML = FRME220P_item.brdpath;

		let param = {
			tenantId :GLOBAL.session.user.tenantId,
			ctgrNo: FRME220P_item.ctgrNo,
			cntntsNo: FRME220P_item.cntntsNo
		}
		
		Utils.ajaxCall("/kmst/KMST210SEL02", JSON.stringify(param),function (data){
			let item = JSON.parse(JSON.parse(JSON.stringify(data.info)));
			for (let i of item.kmst211VoList) {
				$('#FRME220P_content').append("<hr>");
				$('#FRME220P_content').append(Utils.htmlDecode(i.moktiTite));
				$('#FRME220P_content').append("<hr>");
				$('#FRME220P_content').append(Utils.htmlDecode(i.cntntsCtt));
			}
		});
	})
}

function FRME220P_fnDelBook(obj){
	
	let tr = $(obj).closest("tr");
	let item =  FRME220P_grdFRME220P.dataItem(tr);
	let FRME220P_Serch_data = {
			tenantId : GLOBAL.session.user.tenantId
			,usrId : GLOBAL.session.user.usrId
			,orgCd : GLOBAL.session.user.orgCd
			,regrOrgCd : GLOBAL.session.user.orgCd
			,ctgrNo  : item.ctgrNo
			,cntntsNo : item.cntntsNo
		};
	let checked = $(obj).prop('checked');
	
	if(checked){
		Utils.ajaxCall('/frme/FRME220INS01', JSON.stringify(FRME220P_Serch_data));
	}else{
		Utils.ajaxCall('/frme/FRME220DEL01', JSON.stringify(FRME220P_Serch_data));
	}
	
}

function FRME220P_fnsrch(){
	let srchText = $('#FRME220P_srchText').val();
	let undo = $('#FRME22P0_chkUndo').prop('checked');
	let FRME220P_Serch_data = {}
	let selCat =$('#FRME220P_cobCate').val();
	let item = {ctgrNo : null};
	if(!Utils.isNull(selCat)){
		 item = FRME220P_cateList.find((item, i) => {
		    if (item.ctgrNo == selCat) {
		        return item;
		    }
		})
	}
	
	if(!undo){
		FRME220P_Serch_data = {
				tenantId : GLOBAL.session.user.tenantId
				,usrId : GLOBAL.session.user.usrId
				,ctgrNo : item.ctgrNo
				,srchText : srchText
			};
		
	}else{
		FRME220P_Serch_data = {
				tenantId : GLOBAL.session.user.tenantId
				,usrId : GLOBAL.session.user.usrId
				,ctgrNo : item.ctgrNo
				,prsLvl : item.prsLvl
				,srchText : srchText
			};
	}
	
	let FRME220P_jsonStr = JSON.stringify(FRME220P_Serch_data);
	FRME220PDataSource.transport.read(FRME220P_jsonStr);
}

function FRME220P_SearchInit(){
	let FRME220P_Serch_data = {
		tenantId : GLOBAL.session.user.tenantId
		,usrId : GLOBAL.session.user.usrId
	};

	let FRME220P_jsonStr = JSON.stringify(FRME220P_Serch_data);

	FRME220PDataSource.transport.read(FRME220P_jsonStr);
}