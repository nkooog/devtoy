/***********************************************************************************************
 * Program Name : 일정목록 리스트 팝업(CMMT401P.js)
 * Creator      : 김보영
 * Create Date  : 2022.05.18
 * Description  : 일정목록 리스트 팝업
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.18     김보영           최초 생성
 ************************************************************************************************/
var CMMT401P_grdCMMT401P
$(document).ready(function () {

	CMMT401PDataSource ={
		transport: {
			read	: function (CMMT401P_jsonStr) {
				Utils.ajaxCall('/cmmt/CMMT400SEL01', JSON.stringify(CMMT401P_jsonStr), CMMT401P_resultList,
					window.kendo.ui.progress($("#grdCMMT401P"), true), window.kendo.ui.progress($("#grdCMMT401P"), false))
			},
		},
		schema : {
			type: "json",
			model: {
				fields: {
					tenantId	: { field: "tenantId", type: "string" },
					fmnm		: { field: "fmnm", type: "string" },
					dmnCd		: { field: "dmnCd", type: "string" },
					tenantStCd	: { field: "tenantStCd", type: "string" },
				}
			}
		}
	}

	$("#grdCMMT401P").kendoGrid({
		DataSource : CMMT401PDataSource,
		autoBind: false,
		sortable: false,
		scrollable: true,
		selectable: "row",
		resizable: true,
		columns: [
			{
				field: "startTimezone", title:CMMT401P_langMap.get("CMMT401P.time") ,type: "string", template:"#=kendo.format('{0:yyyy-MM-dd HH:mm}',startTimezone)#"

			},
			{
				field: "schdDvCdNm", title:CMMT401P_langMap.get("CMMT401P.schedule"),type: "string",

			} ],
		dataBound: CMMT401P_onDataBound,
	});

	CMMT401P_grdCMMT401P = $("#grdCMMT401P").data("kendoGrid");

	//그리드 높이 조절
	let CMMT401P_screenHeight =$("#" + CMMT401P_langMap.get("id")).height();



	CMMT401P_grdCMMT401P.element.find('.k-grid-content').css('height', CMMT401P_screenHeight);

	CMMT401P_searchParam = {
		tenantId : GLOBAL.session.user.tenantId,
		usrId: GLOBAL.session.user.usrId,
		orgCd: GLOBAL.session.user.orgCd,
		usrGrd: GLOBAL.session.user.usrGrd,
	}
	CMMT401PDataSource.transport.read(CMMT401P_searchParam);
});

function CMMT401P_resultList(result){

	let CMMT401PBODY1_Json = JSON.parse(result.list);
	let selList =[];


	for(let i=0; i<CMMT401PBODY1_Json.length; i++) {
		let CMMT401P_selDate = CMMT401P_langMap.get('selectDate');
		if (CMMT401PBODY1_Json[i].schdStrDd <= CMMT401P_selDate && CMMT401PBODY1_Json[i].schdEndDd >= CMMT401P_selDate) {
			
			let schdStrYear = CMMT401PBODY1_Json[i].schdStrDd.substring(0, 4);
			let schdStrMon = CMMT401PBODY1_Json[i].schdStrDd.substring(4, 6);
			let schdStrDay = CMMT401PBODY1_Json[i].schdStrDd.substring(6, 9);
			let schdStrSi = CMMT401PBODY1_Json[i].schdStrSi;
			let schdStrPt = CMMT401PBODY1_Json[i].schdStrPt;

			let schdEndYear = CMMT401PBODY1_Json[i].schdEndDd.substring(0, 4);
			let schdEndMon = CMMT401PBODY1_Json[i].schdEndDd.substring(4, 6);
			let schdEndDay = CMMT401PBODY1_Json[i].schdEndDd.substring(6, 9);
			let schdEndSi = CMMT401PBODY1_Json[i].schdEndSi;
			let schdEndPt = CMMT401PBODY1_Json[i].schdEndPt;

			let schdStrDd = schdStrYear + "/" + schdStrMon + "/" + schdStrDay + " " + schdStrSi + ":" + schdStrPt;

			let schdEndDd = schdEndYear + "/" + schdEndMon + "/" + schdEndDay + " " + schdEndSi + ":" + schdEndPt;

			let startTimezone = new Date(schdStrDd);

			let endTimezone = new Date(schdEndDd);


			if (CMMT401PBODY1_Json[i].apndFilePsn == null || CMMT401PBODY1_Json[i].apndFileNm == null) {
				CMMT401PBODY1_Json[i].apndFilePsn = ""
				CMMT401PBODY1_Json[i].apndFileNm = ""
			}

			if (CMMT401PBODY1_Json[i].schdTypCd == 1) {
				CMMT401PBODY1_Json[i].schdDvCdNm = CMMT401PBODY1_Json[i].schdDvCdNm
			} else if (CMMT401PBODY1_Json[i].schdTypCd == 2) {
				CMMT401PBODY1_Json[i].schdDvCdNm = CMMT401PBODY1_Json[i].schdDvCdNm1
			}

			if (CMMT401PBODY1_Json[i].alrmStCd == 10 || CMMT401PBODY1_Json[i].alrmStCd == 90) {
				CMMT401PBODY1_Json[i].alrmStCdNm = CMMT401PBODY1_Json[i].alrmStCdNm;
			} else {
				let CMMT401PBODY1_alrmStCdNm = CMMT401PBODY1_Json[i].alrmStCdNm + " " + CMMT401P_langMap.get("CMMT401P.alarm")
				CMMT401PBODY1_Json[i].alrmStCdNm = CMMT401PBODY1_alrmStCdNm;
			}
			CMMT401PBODY1_Json[i].startTimezone = startTimezone;
			CMMT401PBODY1_Json[i].endTimezone = endTimezone;
			selList.push(CMMT401PBODY1_Json[i])
		}
	}
	CMMT401P_grdCMMT401P.dataSource.data(selList);


	let titleDate  = CMMT401P_langMap.get('selectDate').substring(0,4)+CMMT401P_langMap.get("CMMT401P.year")+' '
		+CMMT401P_langMap.get('selectDate').substring(4,6)+CMMT401P_langMap.get("CMMT401P.month")+" "
		+CMMT401P_langMap.get('selectDate').substring(6,9)+CMMT401P_langMap.get("CMMT401P.day")
	$('#CMMT401P_headTitle').append(titleDate)
}


function CMMT401P_onDataBound(CMMT401P_e) {
	$("#grdCMMT401P").on('click','tbody tr[data-uid]',function (CMMT401P_e) {
		let CMMT401P_cell = $(CMMT401P_e.currentTarget);
		let	CMMT401P_item	= CMMT401P_grdCMMT401P.dataItem(CMMT401P_cell.closest("tr"));

		Utils.getCallbackFunction(CMMT401P_langMap.get('callbackKey'))(CMMT401P_e.clientX,CMMT401P_e.clientY,CMMT401P_item);

		Utils.closeKendoWindow(CMMT401P_langMap.get('id'))
	})
}
