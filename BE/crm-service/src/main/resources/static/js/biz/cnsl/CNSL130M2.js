var tableCNSL130M_1 = $("#tableCNSL130M_1")
		.kendoGrid(
				{
					columns : [
							{
								width : 30,
								selectable : true,
							},
							{
								width : 40,
								field : "NO",
								title : "NO",
							},
							{
								width : 150,
								field : "고객항목",
								title : "고객항목 그룹명",
								attributes : {
									"class" : "textLeft"
								},
							},
							{
								width : 60,
								field : "화면순서",
								title : "화면순서",
							},
							{
								width : 90,
								field : "화면표시",
								title : "화면표시",
								editor : ComboBoxEditor_1
							}, // 함수 재설정 요~!
							{
								width : 90,
								field : "표시방향",
								title : "표시방향",
								editor : ComboBoxEditor_1
							}, // 함수 재설정 요~!
							{
								width : 60,
								field : "사용구분",
								title : "사용구분",
								template : '<span #if(사용구분 == "폐기") {# class="fontRed" #} #>#: 사용구분 #</span>',
								editor : ComboBoxEditor_2,
							}, // 함수 재설정 요~!
					],
					// data 없을때
					noRecords : {
						template : '<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>'
					},

					// data 있을때
					dataSource : {
						data : [ {
							NO : "999",
							고객항목 : "고객항목 그룹명노출",
							화면순서 : "2",
							화면표시 : "화면표시",
							표시방향 : "표시방향",
							사용구분 : "미사용",
						}, {
							NO : "100",
							고객항목 : "고객항목 그룹명노출",
							화면순서 : "2",
							화면표시 : "화면표시",
							표시방향 : "표시방향",
							사용구분 : "폐기",
						}, {
							NO : "99",
							고객항목 : "고객항목 그룹명노출",
							화면순서 : "2",
							화면표시 : "화면표시",
							표시방향 : "표시방향",
							사용구분 : "사용",
						}, {
							NO : "98",
							고객항목 : "고객항목 그룹명노출",
							화면순서 : "2",
							화면표시 : "화면표시",
							표시방향 : "표시방향",
							사용구분 : "사용",
						}, {
							NO : "97",
							고객항목 : "고객항목 그룹명노출",
							화면순서 : "2",
							화면표시 : "화면표시",
							표시방향 : "표시방향",
							사용구분 : "폐기",
						}, {
							NO : "96",
							고객항목 : "고객항목 그룹명노출",
							화면순서 : "2",
							화면표시 : "화면표시",
							표시방향 : "표시방향",
							사용구분 : "사용",
						}, {
							NO : "95",
							고객항목 : "고객항목 그룹명노출",
							화면순서 : "2",
							화면표시 : "화면표시",
							표시방향 : "표시방향",
							사용구분 : "사용",
						}, {
							NO : "94",
							고객항목 : "고객항목 그룹명노출",
							화면순서 : "2",
							화면표시 : "화면표시",
							표시방향 : "표시방향",
							사용구분 : "사용",
						}, ],
						schema : {
							model : {
								fields : {
									NO : {
										editable : false
									},
									고객항목 : {
										editable : false
									},
									화면순서 : {
										editable : false
									},
								}
							}
						}
					},
					dataBound : function() {
						//
					},
					scrollable : true,
					editable : true,
				}).data('kendoGrid');

// ComboBoxEditor
function ComboBoxEditor_1(container, option) {
	$('<input name="' + option.field + '">').appendTo(container).kendoComboBox(
			{
				dataTextField : "text",
				dataValueField : "value",
				dataSource : [ {
					text : "선택_1",
					value : "선택_1"
				}, {
					text : "선택_2",
					value : "선택_2"
				}, {
					text : "선택_3",
					value : "선택_3"
				}, ],
				clearButton : false,
				height : 200,
			});
};

function ComboBoxEditor_2(container, option) {
	$('<input name="' + option.field + '">').appendTo(container).kendoComboBox(
			{
				dataTextField : "text",
				dataValueField : "value",
				dataSource : [ {
					text : "사용",
					value : "사용"
				}, {
					text : "미사용",
					value : "미사용"
				}, {
					text : "폐기",
					value : "폐기"
				}, ],
				clearButton : false,
				height : 200,
			});
};

var tableCNSL130M_2 = $("#tableCNSL130M_2")
		.kendoGrid(
				{
					columns : [
							{
								width : 30,
								selectable : true,
							},
							{
								width : 40,
								field : "NO",
								title : "NO",
							},
							{
								width : 130,
								field : "관리항목코드",
								title : "항목코드",
								editor : SearchEditor
							}, // 함수 재설정 요~!
							{
								width : 200,
								field : "관리항목명",
								title : "항목명",
								attributes : {
									"class" : "textLeft"
								},
							},
							{
								width : 70,
								field : "관리항목유형",
								title : "항목유형",
							},
							{
								width : 70,
								field : "데이터크기",
								title : "데이터크기",
								attributes : {
									"class" : "textRight"
								},
							},
							{
								width : 60,
								field : "정렬순서",
								title : "정렬순서",
							},
							{
								width : 90,
								field : "화면표시",
								title : "화면표시",
								editor : ComboBoxEditor_1
							}, // 함수 재설정 요~!
							{
								width : 90,
								field : "필수",
								title : "필수",
								editor : ComboBoxEditor_1
							}, // 함수 재설정 요~!
							{
								width : 60,
								field : "사용구분",
								title : "사용구분",
								template : '<span #if(사용구분 == "폐기") {# class="fontRed" #} #>#: 사용구분 #</span>',
								editor : ComboBoxEditor_2,
							}, // 함수 재설정 요~!
					],
					// data 없을때
					noRecords : {
						template : '<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>'
					},

					// data 있을때
					dataSource : {
						data : [ {
							NO : "999",
							관리항목코드 : "REG_HHMM07",
							관리항목명 : "항목명이 노출됩니다.",
							관리항목유형 : "C",
							데이터크기 : "40",
							정렬순서 : "2",
							화면표시 : "화면표시",
							필수 : "필수",
							사용구분 : "사용",
						}, {
							NO : "999",
							관리항목코드 : "REG_HHMM07",
							관리항목명 : "항목명이 노출됩니다.",
							관리항목유형 : "C",
							데이터크기 : "40",
							정렬순서 : "2",
							화면표시 : "화면표시",
							필수 : "필수",
							사용구분 : "폐기",
						}, {
							NO : "999",
							관리항목코드 : "REG_HHMM07",
							관리항목명 : "항목명이 노출됩니다.",
							관리항목유형 : "C",
							데이터크기 : "40",
							정렬순서 : "2",
							화면표시 : "화면표시",
							필수 : "필수",
							사용구분 : "사용",
						}, {
							NO : "999",
							관리항목코드 : "REG_HHMM07",
							관리항목명 : "항목명이 노출됩니다.",
							관리항목유형 : "C",
							데이터크기 : "40",
							정렬순서 : "2",
							화면표시 : "화면표시",
							필수 : "필수",
							사용구분 : "미사용",
						}, {
							NO : "999",
							관리항목코드 : "REG_HHMM07",
							관리항목명 : "항목명이 노출됩니다.",
							관리항목유형 : "C",
							데이터크기 : "40",
							정렬순서 : "2",
							화면표시 : "화면표시",
							필수 : "필수",
							사용구분 : "미사용",
						}, {
							NO : "999",
							관리항목코드 : "REG_HHMM07",
							관리항목명 : "항목명이 노출됩니다.",
							관리항목유형 : "C",
							데이터크기 : "40",
							정렬순서 : "2",
							화면표시 : "화면표시",
							필수 : "필수",
							사용구분 : "사용",
						}, ],
						schema : {
							model : {
								fields : {
									NO : {
										editable : false
									},
									관리항목명 : {
										editable : false
									},
									관리항목유형 : {
										editable : false
									},
									데이터크기 : {
										editable : false
									},
									정렬순서 : {
										editable : false
									},
								}
							}
						}
					},
					dataBound : function() {
						//
					},
					scrollable : true,
					editable : true,
				}).data('kendoGrid');

// SearchEditor
function SearchEditor(container, option) {
	$(
			'<span class="searchTextBox" style="width: 100%;"><input type="search" class="k-input" name="'
					+ option.field
					+ '"><button title="검색" onclick="alert(\'해당 이벤트발생\')"></button></span>')
			.appendTo(container);
};

// Grid Height 체크
function GridResizeTableCNSL130M() {
	var screenHeight = $(window).height() - 210; // (헤더+ 푸터 ) 영역 높이 제외

	tableCNSL130M_1.element.find('.k-grid-content').css('height',
			screenHeight - 190);
	tableCNSL130M_2.element.find('.k-grid-content').css('height',
			screenHeight - 190);
};

$(document).ready(function() {
	GridResizeTableCNSL130M();

	$(window).on({
		'resize' : function() {
			GridResizeTableCNSL130M();
		},
	});
});
