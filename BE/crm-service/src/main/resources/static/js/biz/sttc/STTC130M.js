var STTC130M_gridData;

$(document).ready(function() {

    STTC130M_init();

    $("#STTC130M_searchForm .formAlign button").click(function () {
        $("#STTC130M_searchForm .formAlign button").removeClass('selected');
        $(this).addClass('selected');
    });
});

function STTC130M_init()
{
    STTC130M_grid();

    setTimeout(function() {
        STTC130M_fnSearch();
    }, 100);

    $(".STTC130_searchForm").on("keyup",function(key){
			if(key.keyCode==13) {
				STTC130M_fnSearch();
			}
	});

    $("#STTC130_shPhone").keyup(function(){
		var val = $(this).val().replace(/[^0-9]/g, '');
		if(val.length > 3 && val.length < 6){
			var tmp = val.substring(0,2)
			if(tmp == "02"){
				$(this).val(val.substring(0,2) + "-" + val.substring(2));
			} else {
				$(this).val(val.substring(0,3) + "-" + val.substring(3));
			}
		}else if (val.length > 6){
			var tmp = val.substring(0,2)
			var tmp2 = val.substring(0,4)
			if(tmp == "02"){
				if(val.length == "10"){
					$(this).val(val.substring(0,2) + "-" + val.substring(2, 6) + "-" + val.substring(6));
				} else {
					$(this).val(val.substring(0,2) + "-" + val.substring(2, 5) + "-" + val.substring(5));
				}
			} else if(tmp2 == "0505"){
				if(val.length == "12"){
					$(this).val(val.substring(0,4) + "-" + val.substring(4, 8) + "-" + val.substring(8));
				} else {
					$(this).val(val.substring(0,4) + "-" + val.substring(4, 7) + "-" + val.substring(7));
				}
			} else {
				if(val.length == "11"){
					$(this).val(val.substring(0,3) + "-" + val.substring(3, 7) + "-" + val.substring(7));
				} else {
					$(this).val(val.substring(0,3) + "-" + val.substring(3, 6) + "-" + val.substring(6));
				}
			}
		}
});
}

function STTC130M_grid()
{
    $("#grdSTTC_130M").kendoGrid({
        dataSource: [],
        noRecords: { template: '<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>' },
        autoBind: false,
        sortable: true,
        scrollable: true,
//        pageable: {
//            refresh:false
//            , pageSizes:[ 25, 50, 100, 200,  500]
//            , buttonCount:10
//            , pageSize : 25
//        },
        dataBound: STTC130M_onDataBound,
        columns: [
            { field: "", title: "NO", width: 30, },
            { field: "PATNAME", title: "환자명", width: 35, },
            { field: "PATNO", title: "등록번호", width: 40, },
            { field: "RESNOPREV", title: "주민번호", width: 63,
            	template: function (dataItem) {
					let jumn = dataItem.RESNOPREV + "-" + dataItem.RESNONEXT;
					if(!Utils.isNull(Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 37)) && Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 37).bsVl1 == "Y"){
						jumn = maskingFunc.rrn(jumn);
					}
					return jumn;
				}
            },
            { field: "SEX", title: "성별", width: 30, },
            { field: "AGE", title: "나이", width: 30, },
            { field: "ACTDATE", title: "접수일시", width: 65, },
            { field: "RSVDATE", title: "예약일시", width: 47, },
            { field: "DEPTNAME", title: "진료과", width: 55, },
            { field: "DOCTORNAME", title: "의사명", width: 45, },
            { field: "RSVTYPE", title: "초재진", width: 55, },
            { field: "ILLNAME", title: "상병명", width: 70, },
            { field: "MEDYN", title: "진료여부", width: 30, },
            { field: "RERSVYN", title: "재예약", width: 30, },
            {
                title: "매출",
                columns: [
                    {field: "MEDAMOUNT", title: "외래진료비", width: 40, footerTemplate: "<div id='medamount_sum' class='tr pointer ftClick' style='font-weight: 900;'></div>"},
                    {field: "HOSPAMOUNT", title: "입원진료비", width: 40, footerTemplate: "<div id='hospamount_sum' class='tr pointer ftClick' style='font-weight: 900;'></div>"},
                    {field: "SURGAMOUNT", title: "수술비", width: 40, footerTemplate: "<div id='surgamount_sum' class='tr pointer ftClick' style='font-weight: 900;'></div>"},
                    {field: "TESTAMOUNT", title: "검사비", width: 40, footerTemplate: "<div id='testamount_sum' class='tr pointer ftClick' style='font-weight: 900;'></div>"},
                    {field: "ETCAMOUNT", title: "기타", width: 40, footerTemplate: "<div id='etcamount_sum' class='tr pointer ftClick' style='font-weight: 900;'></div>"},
                    {field: "TOTAMOUNT", title: "합계", width: 40, footerTemplate: "<div id='totamount_sum' class='tr pointer ftClick' style='font-weight: 900;'></div>"}
                ]
            },
            { field: "INSERTNAME", title: "최초예약자", width: 40, }
        ],
    });
    //detail Grid 상단

    STTC130M_gridData = $("#grdSTTC_130M").data("kendoGrid");

    STTC130M_gridData.dataSource.aggregate([
        { field: "MEDAMOUNT", aggregate: "sum" }
        , { field: "HOSPAMOUNT", aggregate: "sum" }
        , { field: "SURGAMOUNT", aggregate: "sum" }
        , { field: "TESTAMOUNT", aggregate: "sum" }
        , { field: "ETCAMOUNT", aggregate: "sum" }
        , { field: "TOTAMOUNT", aggregate: "sum" }
    ]);

    //그리드 높이 조절
    let STTC130M_screenHeight = $(window).height();
    STTC130M_gridData.element.find('.k-grid-content').css('height', STTC130M_screenHeight - 400);

    // grid reSize
    $(window).on({
        'resize': function() {
            STTC130M_gridData.element.find('.k-grid-content').css('height', STTC130M_screenHeight - 400);
        },
    });
}

function STTC130M_fnSearch()
{
    setTimeout(function() {

    }, 500);

	window.kendo.ui.progress($("#grdSTTC_130M"), true);

	STTC130M_gridData.dataSource.data([]);

	let info = {
		tenantId: GLOBAL.session.user.tenantId,
		usrId: GLOBAL.session.user.usrId
	};

	let body = {
			IN_PATNAME:  $("#STTC130_shName").val(),
			IN_STARTDATE : $("#STTC130M_StartDate").val(),
			IN_ENDDATE : $("#STTC130M_EndDate").val(),
			IN_CELLPHONE: $("#STTC130_shPhone").val(),
			IN_RESNOLIKE: $("#STTC130_shRrs").val()
	};

	let param = {
			info: info,
			body: body
	};

	Utils.ajaxCall('/sttc/STTC130SEL01', JSON.stringify(param), function (data) {
			console.log(data);

			if(Utils.isNotNull(data) && data.Result.Code == "0000" && Utils.isNotNull(data.Result.TotalCount) && data.Result.TotalCount > 0)
			{
                data.ResultData.forEach(function(item) {
                    item.MEDAMOUNT = convertToNumber(item.MEDAMOUNT);
                    item.HOSPAMOUNT = convertToNumber(item.HOSPAMOUNT);
                    item.SURGAMOUNT = convertToNumber(item.SURGAMOUNT);
                    item.TESTAMOUNT = convertToNumber(item.TESTAMOUNT);
                    item.ETCAMOUNT = convertToNumber(item.ETCAMOUNT);
                    item.TOTAMOUNT = convertToNumber(item.TOTAMOUNT);
                });

				STTC130M_gridData.dataSource.data(data.ResultData);
			}
	}, null,function(){

        window.kendo.ui.progress($("#grdSTTC_130M"), false);

        $(".k-footer-template td").css("border-right", "0px");
        for(var i=0; i<$(".k-footer-template td").length; i++)
        {
            if($(".k-footer-template td").eq(i).children().length > 0 || i == $(".k-footer-template td").length - 1){
                $(".k-footer-template td").eq(i).css("border-left", "solid #c9c9c9 1px");
            }
        }
    });
}

function convertToNumber(value) {
    return Utils.isNotNull(value) ? Number(value) : 0;
}

function formatMoneyComma(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function STTC130M_onDataBound(e)
{
    var rows = this.tbody.children();
    var totalRows = rows.length; // 그리드의 전체 행 개수

    // 페이지 당 시작 인덱스 계산
    var startIndex = 1;

    for (var i = 0; i < totalRows; i++) {
        let row = $(rows[i]);
        // 순서대로 번호 매기기
        let index = i + startIndex; // 현재 페이지의 첫 번째 행에 대한 올바른 인덱스 계산
        row.children().eq(0).text(index);
    }

    $("#medamount_sum").text(formatMoneyComma(STTC130M_gridData.dataSource.aggregates().MEDAMOUNT.sum));
    $("#hospamount_sum").text(formatMoneyComma(STTC130M_gridData.dataSource.aggregates().HOSPAMOUNT.sum));
    $("#surgamount_sum").text(formatMoneyComma(STTC130M_gridData.dataSource.aggregates().SURGAMOUNT.sum));
    $("#testamount_sum").text(formatMoneyComma(STTC130M_gridData.dataSource.aggregates().TESTAMOUNT.sum));
    $("#etcamount_sum").text(formatMoneyComma(STTC130M_gridData.dataSource.aggregates().ETCAMOUNT.sum));
    $("#totamount_sum").text(formatMoneyComma(STTC130M_gridData.dataSource.aggregates().TOTAMOUNT.sum));
}

function STTC130M_excelExport() {
	var today = new Date();

	var year = today.getFullYear();
	var month = ('0' + (today.getMonth() + 1)).slice(-2);
	var day = ('0' + today.getDate()).slice(-2);

	var dateString = year + month  + day;

    STTC130_excelExport(STTC130M_gridData, dateString + "_" + STTC130M_langMap.get("STTC130M.title"));
}

function STTC130_excelExport(targetGrid, fileName) {
    const pageSize = targetGrid.dataSource.view().length;
    if (pageSize === 0) {
        Utils.alert(STTC130M_langMap.get("STTC130M.validMsg1"));
        return;
    }
    const dataSourceTotal = targetGrid.dataSource.total();
    targetGrid.dataSource.pageSize(dataSourceTotal);
    targetGrid.bind("excelExport", function (e) {
        e.workbook.fileName = fileName;
        let sheet = e.workbook.sheets[0];

        let setDataItem = {};
        let selectableNum = 0;
        if (this.columns[0].selectable) {
            selectableNum = 1
        }
        if (this.columns[0].template === '#= ++record #') {
            record = 0;
        }

        /*this.columns.forEach(function (item, index) {
            if (Utils.isNotNull(item.template)) {
                let targetTemplate = kendo.template(item.template);
                let fieldName = item.field;
                for (let i = 1; i < sheet.rows.length; i++) {
                    let row = sheet.rows[i];
                    setDataItem = {
                        [fieldName]: row.cells[(index - selectableNum)].value
                    }
                    if(fieldName == "RESNOPREV") row.cells[(index - selectableNum)].value = setDataItem.RESNOPREV;
                    else row.cells[(index - selectableNum)].value = targetTemplate(setDataItem);
                }
            }
        });*/

        let amounts = {
            medamount: $("#medamount_sum").text(),
            hospamount: $("#hospamount_sum").text(),
            surgamount: $("#surgamount_sum").text(),
            testamount: $("#testamount_sum").text(),
            etcamount: $("#etcamount_sum").text(),
            totamount: $("#totamount_sum").text()
        };
        for (let i = 1; i < sheet.rows.length; i++) {
            let row = sheet.rows[i];

            targetGrid.columns.forEach(function (item, index) {
                let dataIndex = index - selectableNum;
                let cell = row.cells[dataIndex];
                if(cell)
                {
                    let fieldName = item.field;
                    setDataItem = {
                        [fieldName]: cell.value
                    };

                    if(row.type == "footer" && index == 14){
                        row.cells[13].value = amounts.medamount;
                        row.cells[14].value = amounts.hospamount;
                        row.cells[15].value = amounts.surgamount;
                        row.cells[16].value = amounts.testamount;
                        row.cells[17].value = amounts.etcamount;
                        row.cells[18].value = amounts.totamount;
                    }
                    else if (fieldName != "RESNOPREV" && Utils.isNotNull(item.template)) {
                        let targetTemplate = kendo.template(item.template);
                        cell.value = targetTemplate(setDataItem);
                    }
                }
            });

            for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                sheet.columns[cellIndex].autoWidth = true; // 자동 너비 설정
            }
        }
    });
    targetGrid.saveAsExcel();
}