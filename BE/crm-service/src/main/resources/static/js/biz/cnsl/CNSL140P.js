var CNSL140PDataSource,grdCNSL140P;
var flagCNSL140P = '';
var initFlagCNSL140P = true;
var CNSL140P_seq = 0;

$(document).ready(function () {
	var htmlPopHeader;
	var tableInfoTitle;
	var tableInfoCd;
	var tableInfoNm;
	
	if ( GLOBAL.session.user.dmnCd == '200' || GLOBAL.session.user.dmnCd == '201' || GLOBAL.session.user.dmnCd == '202' ) {
		htmlPopHeader = CNSL140P_langMap.get("CNSL140P.header.title.h") 
						+ '<button class="popClose" title="' 
						+  CNSL140P_langMap.get("CNSL140P.header.title.button")
						+ '" onclick="window.close();"></button>';
		
		tableInfoTitle 	= CNSL140P_langMap.get("CNSL140P.table.info.cnsl.title.h");
		tableInfoCd 	= CNSL140P_langMap.get("CNSL140P.table.info.cnsl.cd.h");
		tableInfoNm 	= CNSL140P_langMap.get("CNSL140P.table.info.cnsl.nm.h");
		
	} else {
		htmlPopHeader = CNSL140P_langMap.get("CNSL140P.header.title.c") 
						+ '<button class="popClose" title="' 
						+  CNSL140P_langMap.get("CNSL140P.header.title.button")  
						+ '" onclick="window.close();"></button>';
		
		tableInfoTitle 	= CNSL140P_langMap.get("CNSL140P.table.info.cnsl.title.c");
		tableInfoCd 	= CNSL140P_langMap.get("CNSL140P.table.info.cnsl.cd.c");
		tableInfoNm 	= CNSL140P_langMap.get("CNSL140P.table.info.cnsl.nm.c");
	}
	$(".popHeader").html(htmlPopHeader);
	$("#CNSL140P_cnslInfoTitle").html(tableInfoTitle);
	$("#CNSL140P_cnslInfoId").html(tableInfoCd);
	$("#CNSL140P_cnslInfoNm").html(tableInfoNm);
	
	CNSL140_initParam();
	CNSL140_initGrid();
	CNSL140PDataSourceSet();
	setTimeout(function() {
		grdCNSL140P.select("tr:eq(0), tr:eq(1)");
	}, 500);
});

function CNSL140_initParam() {
	$(".CNSL140P #custId").val(Utils.getUrlParam('custId'));
	$(".CNSL140P #custNm").val(Utils.getUrlParam('custNm'));
	$(".CNSL140P #regDtlsCtt").val('');
	$(".CNSL140P #rlsRsnDtlsCtt").val('');
	$(".CNSL140P #regDtlsCtt").attr("disabled", true);
	$(".CNSL140P #rlsRsnDtlsCtt").attr("disabled", true);
	$(".CNSL140P #CNSL140_newBtn").attr("disabled", false);
	$(".CNSL140P #CNSL140_editBtn").attr("disabled", true);
	$(".CNSL140P #CNSL140_releaseBtn").attr("disabled", true);
	$(".CNSL140P #CNSL140_saveBtn").attr("disabled", true);
	$(".CNSL140P #rlsRsnDtlsCttDiv").hide();
	$(".CNSL140P #CNSL140_nowtime").val('');
	window.resizeTo(650, 735);
}

function CNSL140_initGrid() {
	CNSL140PDataSource ={
		transport: {
			read	: function (CNSL140P_jsonStr) {
				Utils.ajaxCall('/cnsl/CNSL140SEL01', CNSL140P_jsonStr, CNSL140P_resultIndex, 
				window.kendo.ui.progress($("#grdCNSL140P"), true), window.kendo.ui.progress($("#grdCNSL140P"), false))
			},
		},
	}
	grdCNSL140P = $("#grdCNSL140P").kendoGrid({
        dataSource: CNSL140PDataSource,
        noRecords: {
            template: '<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>'
        },
		autoBind: false,
		sortable: true,
		scrollable: true,
		selectable: "row",
		resizable: true,
		change: function(e) {
			const selectRow = grdCNSL140P.dataItem(e.sender.select());
			CNSL140P_seq = selectRow.seq;
			if ( selectRow.stCd == '1' ) {
				if ( GLOBAL.session.user.usrId == selectRow.regrId ) {
					$(".CNSL140P #CNSL140_nowtime").val(selectRow.regDtm + " (" + selectRow.orgNm + ") " + selectRow.regrNm);
					$(".CNSL140P #regDtlsCtt").val(selectRow.regDtlsCtt);
					$(".CNSL140P #rlsRsnDtlsCtt").val('');
					$(".CNSL140P #regDtlsCtt").attr("disabled", true);
					$(".CNSL140P #CNSL140_newBtn").attr("disabled", false);
					$(".CNSL140P #CNSL140_editBtn").attr("disabled", false);
					$(".CNSL140P #CNSL140_releaseBtn").attr("disabled", false);
					$(".CNSL140P #CNSL140_saveBtn").attr("disabled", true);
					$(".CNSL140P #rlsRsnDtlsCttDiv").hide();
				} else {
					if (GLOBAL.session.user.usrGrd == '130' || 
						GLOBAL.session.user.usrGrd == '230' ||
						GLOBAL.session.user.usrGrd == '400' ||
						GLOBAL.session.user.usrGrd == '900' ||
						GLOBAL.session.user.usrGrd == '910' ) {
						$(".CNSL140P #CNSL140_nowtime").val(selectRow.regDtm + " (" + selectRow.orgNm + ") " + selectRow.regrNm);
						$(".CNSL140P #regDtlsCtt").val(selectRow.regDtlsCtt);
						$(".CNSL140P #rlsRsnDtlsCtt").val('');
						$(".CNSL140P #regDtlsCtt").attr("disabled", true);
						$(".CNSL140P #CNSL140_newBtn").attr("disabled", false);
						$(".CNSL140P #CNSL140_editBtn").attr("disabled", false);
						$(".CNSL140P #CNSL140_releaseBtn").attr("disabled", false);
						$(".CNSL140P #CNSL140_saveBtn").attr("disabled", true);
						$(".CNSL140P #rlsRsnDtlsCttDiv").hide();
					} else {
						$(".CNSL140P #CNSL140_nowtime").val(selectRow.regDtm + " (" + selectRow.orgNm + ") " + selectRow.regrNm);
						$(".CNSL140P #regDtlsCtt").val(selectRow.regDtlsCtt);
						$(".CNSL140P #rlsRsnDtlsCtt").val('');
						$(".CNSL140P #regDtlsCtt").attr("disabled", true);
						$(".CNSL140P #CNSL140_newBtn").attr("disabled", false);
						$(".CNSL140P #CNSL140_editBtn").attr("disabled", true);
						$(".CNSL140P #CNSL140_releaseBtn").attr("disabled", true);
						$(".CNSL140P #CNSL140_saveBtn").attr("disabled", true);
						$(".CNSL140P #rlsRsnDtlsCttDiv").hide();
					}
				}
				window.resizeTo(650, 735);
			} 
			else if ( selectRow.stCd == '9' )  {
				$(".CNSL140P #CNSL140_nowtime").val(selectRow.regDtm + " (" + selectRow.orgNm + ") " + selectRow.regrNm);
				$(".CNSL140P #regDtlsCtt").val(selectRow.regDtlsCtt);
				$(".CNSL140P #rlsRsnDtlsCtt").val(selectRow.rlsRsnDtlsCtt);
				$(".CNSL140P #regDtlsCtt").attr("disabled", true);
				$(".CNSL140P #rlsRsnDtlsCtt").attr("disabled", true);
				$(".CNSL140P #CNSL140_newBtn").attr("disabled", false);
				$(".CNSL140P #CNSL140_editBtn").attr("disabled", true);
				$(".CNSL140P #CNSL140_releaseBtn").attr("disabled", true);
				$(".CNSL140P #CNSL140_saveBtn").attr("disabled", true);
				$(".CNSL140P #rlsRsnDtlsCttDiv").show();
				window.resizeTo(650, 855);
			}
		},
		dataBound: function () {
            dataView = this.dataSource.view();
            for (var i = 0; i < dataView.length; i++) {
                if (dataView[i].stCd == "9") {
                    var uid = dataView[i].uid;
                    $("#grdCNSL140P tbody").find("tr[data-uid=" + uid + "]").find("td").css("color","red");
                }
                else if (dataView[i].stCd == "1") {
                    var uid = dataView[i].uid;
                    $("#grdCNSL140P tbody").find("tr[data-uid=" + uid + "]").find("td").css("color","black");
                }
            }
        },
		pageable: {
            pageSize: 25,
            pageSizes: [5, 10, 15, 20, 25, 30],
            buttonCount: 10,
            refresh: true,
        },
		columns: [ 
//			{width: 40, field: "seq", title: "No"}, 
			{width: 150, field: "regDtm", title: "등록일시"},
			{width: 270, field: "regDtlsCtt", title: "주의사항",
				template: function (data) {
                    return msgCNSL140(data.regDtlsCtt)
                }, 
                attributes: {"class": "k-text-left"}
			},
			{width: 100, field: "regrNm", title: "등록자"},
			{width: 80, field: "stNm", title: "상태"},
		],
	}).data('kendoGrid');
	
	$("#grdCNSL140P").kendoTooltip({
		filter: "td:nth-child(2)",
        position: "bottom",
        width: 200,
        showOn: "mouseenter",
        content: function(e){
            var dataItem = grdCNSL140P.dataItem(e.target.closest("tr"));
            return dataItem.regDtlsCtt;
        }
    }).data("kendoTooltip");
}

function CNSL140_nowtime() {
	let date = new Date();
	let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
	$("#CNSL140_nowtime").val(date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ' (' + GLOBAL.session.user.orgNm + ') ' + GLOBAL.session.user.decUsrNm);
}


function CNSL140_newMode() {
	flagCNSL140P = 'new';
	CNSL140_nowtime();
	$(".CNSL140P #regDtlsCtt").val("");
	$(".CNSL140P #regDtlsCtt").attr("disabled", false);
	$(".CNSL140P #rlsRsnDtlsCttDiv").hide();
	$(".CNSL140P #CNSL140_saveBtn").attr("disabled", false);
	window.resizeTo(650, 735);
}

function CNSL140_editMode() {
	flagCNSL140P = 'edit';
	CNSL140_nowtime();
	$(".CNSL140P #regDtlsCtt").attr("disabled", false);
	$(".CNSL140P #rlsRsnDtlsCttDiv").hide();
	$(".CNSL140P #CNSL140_saveBtn").attr("disabled", false);
}

function CNSL140_releaseMode() {
	flagCNSL140P = 'release';
	CNSL140_nowtime();
	$(".CNSL140P #regDtlsCtt").attr("disabled", true);
	$(".CNSL140P #rlsRsnDtlsCtt").attr("disabled", false);
	$(".CNSL140P #rlsRsnDtlsCttDiv").show();
	$(".CNSL140P #CNSL140_saveBtn").attr("disabled", false);
	window.resizeTo(650, 855);
}

function CNSL140_save() {
	switch(flagCNSL140P) {
		case 'new':
			if ( $(".CNSL140P #regDtlsCtt").val() == '' ) {
				Utils.alert("주의할 사항을 입력하세요.", $(".CNSL140P #regDtlsCtt").focus());
				return;
			}
			var CNSL140P_data = {
				"tenantId" : GLOBAL.session.user.tenantId,
				"usrId" : GLOBAL.session.user.usrId,
				"orgCd" : GLOBAL.session.user.orgCd,
				"custId" : $(".CNSL140P #custId").val(),
				"custNm" : $(".CNSL140P #custNm").val(),
				"regDtlsCtt" : $(".CNSL140P #regDtlsCtt").val(),
				"stCd" : "1"
			};
			Utils.ajaxCall("/cnsl/CNSL140INS01", JSON.stringify(CNSL140P_data), CNSL140PDataSourceSet);
			Utils.alert("등록되었습니다.", CNSL140_initParam);
			break;
		case 'edit':
			if ( $(".CNSL140P #regDtlsCtt").val() == '' ) {
				Utils.alert("주의할 사항을 입력하세요.", $(".CNSL140P #regDtlsCtt").focus());
				return;
			}
			var CNSL140P_data = {
				"tenantId" : GLOBAL.session.user.tenantId,
				"usrId" : GLOBAL.session.user.usrId,
				"orgCd" : GLOBAL.session.user.orgCd,
				"custId" : $(".CNSL140P #custId").val(),
				"custNm" : $(".CNSL140P #custNm").val(),
				"regDtlsCtt" : $(".CNSL140P #regDtlsCtt").val(),
				"seq" : CNSL140P_seq
			};
			Utils.ajaxCall("/cnsl/CNSL140UPT01", JSON.stringify(CNSL140P_data), CNSL140PDataSourceSet);
			Utils.alert("수정되었습니다.", CNSL140_initParam);
		    break;
		case 'release':
			if ( $(".CNSL140P #rlsRsnDtlsCtt").val() == '' ) {
				Utils.alert("해제 사유를 입력하세요.", $(".CNSL140P #regDtlsCtt").focus());
				return;
			}
			var CNSL140P_data = {
				"tenantId" : GLOBAL.session.user.tenantId,
				"usrId" : GLOBAL.session.user.usrId,
				"orgCd" : GLOBAL.session.user.orgCd,
				"custId" : $(".CNSL140P #custId").val(),
				"custNm" : $(".CNSL140P #custNm").val(),
				"rlsRsnDtlsCtt" : $(".CNSL140P #rlsRsnDtlsCtt").val(),
				"stCd" : "9",
				"seq" : CNSL140P_seq
			};
			Utils.ajaxCall("/cnsl/CNSL140UPT02", JSON.stringify(CNSL140P_data), CNSL140PDataSourceSet);
			Utils.alert("해제되었습니다.", CNSL140_initParam);
		    break;
	}
	window.opener.attCntChk();
}

function CNSL140P_resultIndex(data){
	var CNSL140P_jsonEncode = JSON.stringify(data.CNSL140SEL01);
	var CNSL140P_jsonDecode = JSON.parse(JSON.parse(CNSL140P_jsonEncode));
	grdCNSL140P.dataSource.data(CNSL140P_jsonDecode);
}	

function CNSL140PDataSourceSet() {
	var CNSL140P_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"custId" : $(".CNSL140P #custId").val()
    };	
	var CNSL140P_jsonStr = JSON.stringify(CNSL140P_data);
	CNSL140PDataSource.transport.read(CNSL140P_jsonStr);
}

function msgCNSL140(str) {
	if ( typeof str == 'undefined' || str == null ) {
		return ''
	}else {
		if (str.length < 19 ) {
			return str
		}else {
			return str.substring(0,18) + "..."
		}
	}
}
