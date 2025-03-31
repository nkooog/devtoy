{
	var SAMP009M = {}
		,SAMP009MDataSource
		,SAMP009M_grid
		,SAMP009MDataSource2
		,SAMP009M_grid2
		,SAMP009M_grid2_Select_Row_Num = null; // 이전에 수정 중인 행을 저장할 변수


	$(document).ready(function () {

		/**
		 * 페이지 로드 시 공통코드 초기화.
		 * 현재 페이지에서는 SAMP009M.comCdList 에 사용하는 공통 코드값을 세팅.
		 */
		var param = {
			"codeList": [
				{"mgntItemCd": "C0044"},	//column_2 에들어가는 공통코드
				{"mgntItemCd": "C0207"},	//복수의 수가 들어갈수 있다느 걸 표현하기위해 아무거나 추가.
			]
		};
		// 공통코드 리스트 조회
		Utils.ajaxSyncCall("/comm/COMM100SEL01", JSON.stringify(param), function (result) {
			SAMP009M.comCdList = JSON.parse(result.codeList);
		});



		/**
		 * 그리드의 데이터를 관리하는 방식에 대한 설정 정의
		 * incell 사용그리드
		 */
		SAMP009MDataSource ={
			transport: {
				/**
				 * kendoGrid 조회
				 * 호출 SAMP009MDataSource.transport.read(param);
				 * @param param
				 */
				read : function (param) {
					Utils.ajaxCall(
						"/sample/SAMPSEL01",
						JSON.stringify(param),
						SAMP009M_callback,
						window.kendo.ui.progress($("#grid"), true))
				},
				/**
				 * kendoGrid 새로운 행 추가 후 서버에 저장시 발생
				 * 현재 그리드에선 추가 등록 삭제를 update로 관리하기때문에 작동하지 않음.
				 * @param param
				 */
				create : function (param){
					console.log("create")
					Utils.ajaxCall(
						"/sample/SAMPINS01",
						JSON.stringify(param),
						resultPorocess,
						window.kendo.ui.progress($("#grid"), true))

				},
				/**
				 * kendoGrid의 데이터를 편집하거나 저장할때 발생
				 * 현재 그리드에선 추가 등록 삭제를 update로 관리.
				 * 호출 SAMP009MDataSource.transport.update(param);
				 * @param param
				 */
				update : function (param){
					console.log("update")
					Utils.ajaxCall(
						'/sample/SAMPSAV01',
						JSON.stringify(param),
						resultPorocess,
						window.kendo.ui.progress($("#grid"), true))
				},
				/**
				 * kendoGrid의 행을 삭제 할 때 발생.
				 * 현재 그리드에선 update에서 관리하기 때문에 remove를 통해 로컬 데이터만 제거.
				 * @param param
				 */
				destroy: function (param) {
					console.log("delete")
					param.success(param.data.models);
				},

				/**
				 * kendoGrid의 행을 삭제 할 때 발생
				 * 데이터를 저장버튼이 아닌 바로 삭제하기위해 만듬.
				 * 호출
				 * SAMP009M_grid.dataSource.remove(item);
				 * SAMP009MDataSource.transport.destroy2(item);
				 * 삭제 후 그리드를 다시 그려주면 수정중인 데이터가 초기화 되기 때문에 재조회 하지 않고 remove를 통해 행을 제거.
				 * @param param
				 */
				destroy2: function (param) {
					console.log("delete")
					Utils.ajaxCall(
						"/sample/SAMPDEL01",
						JSON.stringify(param),
						resultPorocess_del,
						window.kendo.ui.progress($("#grid"), true))
				},
				/**
				 * 읽기 작업을 제외한 모든 작업에서 options.models를 json문자열로 변환해 서버에 전송.
				 * 사용방법 좀더 확인 필요.
				 * @param options
				 * @param operation
				 * @returns {{models: *}|*}
				 */
				parameterMap: function(options, operation) {
					console.console.log("parameterMap")
					if (operation !== "read" && options.models) {
						return { models: kendo.stringify(options.models) };
					}
					return options;
				},
				/**
				 * kendoGrid에서 데이터가 변경 될 때마다 발생
				 * 현재 그리드에서는 update 작업을 진행하기 전에 데이터에 정합성을 체크하기 위해 사용
				 * @param e
				 * @returns {[]}
				 */
				change: function(e) {
					console.log("change")
					var saveRows = markSaveRows( $("#grid").data("kendoGrid"))

					var insertRows = saveRows.insertRows
					var updateRows = saveRows.updateRows
					var deleteRows = saveRows.deleteRows


					for (var i = 0; i < updateRows.length; i++) {
						if (!updateRows[i].column_1)	{
							alert("column_1는 필수값입니다");
							return;
						}

						Utils.isNull(updateRows[i].column_1)	? 	updateRows[i].column_1 = ''	:	updateRows[i].column_1 = updateRows[i].column_1;
						Utils.isNull(updateRows[i].column_2)	? 	updateRows[i].column_2 = ''	:	updateRows[i].column_2 = updateRows[i].column_2;
						Utils.isNull(updateRows[i].column_3)	? 	updateRows[i].column_3 = 'N':	updateRows[i].column_3 = updateRows[i].column_3;
						Utils.isNull(updateRows[i].column_4)	? 	updateRows[i].column_4 = ''	:	updateRows[i].column_4 = updateRows[i].column_4;
						Utils.isNull(updateRows[i].column_5)	? 	updateRows[i].column_5 = ''	:	updateRows[i].column_5 = updateRows[i].column_5;
						Utils.isNull(updateRows[i].column_6)	? 	updateRows[i].column_6 = ''	:	updateRows[i].column_6 = updateRows[i].column_6;
						Utils.isNull(updateRows[i].column_7)	? 	updateRows[i].column_7 = ''	:	updateRows[i].column_7 = updateRows[i].column_7;
						Utils.isNull(updateRows[i].column_8)	? 	updateRows[i].column_8 = ''	:	updateRows[i].column_8 = updateRows[i].column_8;
						Utils.isNull(updateRows[i].column_9)	? 	updateRows[i].column_9 = ''	:	updateRows[i].column_9 = updateRows[i].column_9;
						Utils.isNull(updateRows[i].column_10)	?   updateRows[i].column_10 = '':   updateRows[i].column_10 = updateRows[i].column_10;
					}


					// 삽입된 행의 필수값 체크 및 기본값 설정
					for (var i = 0; i < insertRows.length; i++) {
						if (!insertRows[i].column_1)	{
							alert("column_1는 필수값입니다");
							return;
						}
						Utils.isNull(insertRows[i].column_1)	? 	insertRows[i].column_1 = ''	:	insertRows[i].column_1 = insertRows[i].column_1;
						Utils.isNull(insertRows[i].column_2)	? 	insertRows[i].column_2 = ''	:	insertRows[i].column_2 = insertRows[i].column_2;
						Utils.isNull(insertRows[i].column_3)	? 	insertRows[i].column_3 = 'N':	insertRows[i].column_3 = insertRows[i].column_3;
						Utils.isNull(insertRows[i].column_4)	? 	insertRows[i].column_4 = ''	:	insertRows[i].column_4 = insertRows[i].column_4;
						Utils.isNull(insertRows[i].column_5)	? 	insertRows[i].column_5 = ''	:	insertRows[i].column_5 = insertRows[i].column_5;
						Utils.isNull(insertRows[i].column_6)	? 	insertRows[i].column_6 = ''	:	insertRows[i].column_6 = insertRows[i].column_6;
						Utils.isNull(insertRows[i].column_7)	? 	insertRows[i].column_7 = ''	:	insertRows[i].column_7 = insertRows[i].column_7;
						Utils.isNull(insertRows[i].column_8)	? 	insertRows[i].column_8 = ''	:	insertRows[i].column_8 = insertRows[i].column_8;
						Utils.isNull(insertRows[i].column_9)	? 	insertRows[i].column_9 = ''	:	insertRows[i].column_9 = insertRows[i].column_9;
						Utils.isNull(insertRows[i].column_10)	?   insertRows[i].column_10 = ''	:   insertRows[i].column_10 = insertRows[i].column_10;
					}


					return saveRows;
				}

			},
			//batch: true,	//추가,수정,삭제를 한번에 서버로 전송하는 기능을 활성화.
			/**
			 * 데이터 소스의 구조를 정의
			 */
			schema : {
				type: "json",
				model: {
					id: "sample_pk",  //필수 상태값 or 수정 삭제를 위해 PK를 연결해 주어야함
					fields: {
						sample_pk      	: { field: "sample_pk" , type: "string" },
						column_1      	: { field: "column_1"  , type: "string" },
						column_2      	: { field: "column_2"  , type: "string" },
						column_3        : { field: "column_3"  , type: "string" ,  editable: false  , defaultValue : 'Y' },
						column_4        : { field: "column_4"  , type: "date"  },
						column_5  		: { field: "column_5"  , type: "date" },
						column_6        : { field: "column_6"  , type: "date" },
						column_7       	: { field: "column_7"  , type: "number" },
						column_8     	: { field: "column_8"  , type: "string" },
						column_9     	: { field: "column_9"  , type: "string" },
						column_10     	: { field: "column_10" , type: "string" },
					}
				}
			}
		}


		/**
		 * kendoGrid 선언
		 * incell 수정 모드
		 */
		SAMP009M_grid = $("#grid").kendoGrid({
			dataSource : SAMP009MDataSource,	//위에서 정의한 데이터를 그리드의 정의로 사용.
			autoBind: true,						//true : 페이지 들어오면 바로 조회.
			groupable: false,					//true : 해더값으로 그룹화
			navigatable: true,					//true : enter로 데이터 수정
			noRecords: { template: `<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>` },	// 조회 데이터가 없으면 표현될 문구
			/**
			 * columns 필드들의 속성 값
			 */
			columns: [

					{
						/**
						 * 보통 그리드 최상단의 체크박스로 많이 사용됨.
						 */
						title: '', width: '40px', attributes:{'class':'align-center'},
						headerTemplate	: '<input class="k-checkbox allRowCheck" type="checkbox" onclick="fnCheckAll(this);">',
						template	: '<input type="checkbox" class="k-checkbox rowCheck" onclick="fnCheckRow(this);" />'
					},
					{
						/**
						 * 그리드의 수정 상태값 확인.
						 * isNew => true 면 신규 row
						 * item.dirty => true 면 수정된 row
						 */
						title: '상태',
						type: "string",
						width :  "50px",
						template: function (dataItem) {
							let html = "";

							if (dataItem.isNew()) {
								html = "<img src='" + GLOBAL.contextPath + "/images/contents/btn_new.png' style='vertical-align:middle'>";
							} else if (dataItem.dirty) {
								html = "<img src='" + GLOBAL.contextPath + "/images/contents/btn_modify.png' style='vertical-align:middle'>";
							}

							return html;
						},
					},
					{	/**
						 * 그리드의 key가 되는 컬럼. 주로 데이터베이스의 PK를 연결한다.
						 */
						field: "sample_pk", title: "sample_pk", hidden: true
					},
					{
						/**
						 * 기본 필드
						 */
						field: "column_1", title: "기본",type: "String"
					},
					{
						/**
						 * select box 사용 예제
						 * editable를 통해 데이터를 컨트롤 할 수있다.
						 * editor를 통해 수정상태 시 select box로 데이터 선택
						 * template를 통해 수정 상태가 아닌 평소의 데이터를 표현
						 */
						field: "column_2", title: "Select Box",
						editable: function (dataItem) {
							if (dataItem.column_2 == "F") {
								//검정색의 경우 수정 안되게.
								return false
							} else {
								return true
							}
						},
						editor: function (container, options) {
							SampleGridComboBox(container, options, SAMP009M_grid, "C0044")
						},
						template: function (dataItem) {
							return Utils.getComCdNm(SAMP009M.comCdList, "C0044", dataItem.column_2);
						}
					},

					{
						/**
						 * 슬라이드 버튼 사용 예제.
						 * template 를 통해 슬라이드 버튼 삽입.
						 */
						field: "column_3", title: "슬라이드 버튼",type: "String"
						,  template: '<span class="swithCheck"><input type="checkbox" #if(column_3 == "Y")   {# return checked #}# onclick="SAMP009M_fnSlideBtn(this)")/><label></label></span>'
					},
					{
						/**
						 * datePicker 사용 예제.
						 * editor를 통해 수정상태 시 datePicker로 데이터 선택
						 * template를 통해 수정 상태가 아닌 평소의 데이터를 표현 날짜 format을 적용해 준다.
						 */
						field: "column_4", title: "DatePicker"
						, template: '#=kendo.format("{0:yyyy-MM-dd}",new Date(column_4))#'
						, editor: function (container , options){
							$('<input name="' + options.field + '"/>')
								.appendTo(container)
								.kendoDatePicker({
									format: "yyyy-MM-dd"
								});
						}

					},
					{
						/**
						 * TimePicker 사용 예제.
						 * editor를 통해 수정상태 시 TimePicker 데이터 선택
						 * template를 통해 수정 상태가 아닌 평소의 데이터를 표현 시간 format을 적용해 준다.
						 */
						field: "column_5", title: "TimePicker"
						, template: '#=kendo.format("{0:HH:mm:ss}",new Date(column_5))#'
						, editor: function (container , options){
							$('<input name="' + options.field + '"/>')
								.appendTo(container)
								.kendoTimePicker({
									format: "HH:mm:ss"
								});
						}

					},


					{
						/**
						 * DateTimePicker 사용 예제.
						 * editor를 통해 수정상태 시 DateTimePicker 데이터 선택
						 * template를 통해 수정 상태가 아닌 평소의 데이터를 표현 날짜 + 시간 format을 적용해 준다.
						 */
						field: "column_6", title: "DateTimePicker"
						, template: '#=kendo.format("{0:yyyy-MM-dd HH:mm:ss }",new Date(column_6))#'
						, editor: function (container , options){
							$('<input name="' + options.field + '"/>')
								.appendTo(container)
								.kendoDateTimePicker({
									format: "yyyy-MM-dd HH:mm:ss"
								});
						}

					},
					{
						/**
						 * 데이터 컨트롤을 위한 예제
						 * 예시 column_7의 값이 특정 값 보다 크면 cell의 색상을 변경
						 * dataBound에서 로직 처리
						 */
						field: "column_7", title: "특정 기준 색상변경",type: "number"
					},
					{
						/**
						 * 데이터 컨트롤을 위한 예제
						 * 예시 column_8필드에 중복으로 등록된 데이터를 체크하기 위한 예제
						 * 필드 속성 중 duple : true 인 필드는 중복을 허용하지 않음
						 * save이벤트 실행 시 체크
						 */
						field: "column_8", title: "중복컬럼 1",type: "String" , duple : true
					},

					{
						/**
						 * 데이터 컨트롤을 위한 예제
						 * 예시 column_9필드에 중복으로 등록된 데이터를 체크하기 위한 예제
						 * 필드 속성 중 duple : true 인 필드는 중복을 허용하지 않음
						 * save이벤트 실행 시 체크
						 */
						field: "column_9", title: "중복컬럼 2",type: "String" , duple : true
					},
					{
						/**
						 * 그리드 내의 첨부파일 업로드를 위한 예제.
						 * 서버단은 구현 X 필요 시 구현 필요
						 */
						field: "column_10", title: "파일첨부",type: "String", template: "#= column_10 #",  width: "300px"  //파일 업로드는 구현 시 서버단 구현이 필요.
						, editor: function (container, options) {
							$('<input name="' + options.field + '" type="file" />')
								.appendTo(container)
								.kendoUpload({
									async: {
										saveUrl: "fileUpload URL",
										removeUrl: "fileremove URL",
										autoUpload: false
									},
									success: function(e) {
										var fileName = e.response[0].name;
										options.model.set(options.field, fileName);
									}
								});
						}
					}
				,{ command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }	 //edit 기능을 사용하려면  editable : inline  , edit ,save,cancel 함수 선언 해주어야함.
				],
			editable:"incell" , //"inline"
			height: 550,
			pageable: {refresh:false
				, pageSizes:[10 , 20, 25, 30, 40, 50, 100, 1000, 3000, 5000, 10000]
				, buttonCount:10
				, pageSize : 25
			},
			/**
			 * 수정모드로 변경될때 마다 이벤트 발생
			 * @param e
			 */
			edit : function (e) {
				console.log("edit")
			},
			/**
			 * 수정모드에서 값이 확정 시 발생
			 * 현재그리드에서는 필드의 중복체크도 같이 체크중
			 * refresh를 해주지 않으면 수정 상태가 갱신되지 않음.
			 * @param e
			 */
			save : function (e) {
				console.log("save")
				let grid = e.sender;

				/* 중복체크를 위해 사용
				*  isDuplicate 함수 필요.
				*  columns 속성에 , duple : true 추가
				* */
				var input = e.container.find("input");
				var fieldName = input.attr("name");
				var value = input.val();

				if (grid.columns.some(col => col.field === fieldName && col.duple)) {
					if (isDuplicate(grid, fieldName, value, e.model.uid)) {
						e.preventDefault(); // 저장을 취소합니다
						document.getElementById('message').innerHTML = fieldName + " 필드의 값이 중복됩니다.";
					} else {
						document.getElementById('message').innerHTML = "";
						console.log("Save event triggered", e.model);
					}
				}
				/* 중복 체크  끝*/


				grid.refresh();

			},
			/**
			 * 수정모드에서 esc와 같이 수정을 취소할 때 발생
			 * @param e
			 */
			cancel: function(e) {
				console.log("Cancel event triggered", e.model);
			},

			/**
			 * grid row를 삭제하기 위한 함수
			 * 삭제를 해주고 dirty를 true로 변경해 수정됐다는걸 알려주어야함.
			 * @param e
			 */
			remove : function(e){
				console.log("remove")
				e.model.dirty = true; // 삭제된 레코드의 상태를 dirty로 설정
				console.log("Remove event triggered for", e.model);
			}
			/**
			 * 데이터를 바인인 한 후 발생
			 * 현재 그리드에선 필드의 값이 특정값보다 클 경우 색상을 변경 할 때 사용.
			 * @param e
			 */
			,dataBound: function(e) {
				var grid = this;
				var column_7Index = grid.wrapper.find(".k-grid-header [data-field='column_7']").index();

				grid.tbody.find('>tr').each(function() {
					var dataItem = grid.dataItem(this);
					var cell = $(this).find("td").eq(column_7Index);

					if (dataItem.column_7 > 5) {
						cell.css("background-color", "yellow");
					}
					//row 의 색상을 변경하고 싶다면 $(this).css("background-color", "yellow");
				});
			},

		}).data("kendoGrid");











		/**
		 * 그리드의 데이터를 관리하는 방식에 대한 설정 정의
		 * inline 사용 그리드
		 */
		SAMP009MDataSource2 ={
			transport: {
				/**
				 * kendoGrid 조회
				 * 호출 SAMP009MDataSource2.transport.read(param);
				 * @param param
				 */
				read	: function (param) {
					Utils.ajaxCall(
						"/sample/SAMPSEL01",
						JSON.stringify(param),
						SAMP009M_callback2,
						window.kendo.ui.progress($("#grid2"), true))
				},
				/**
				 * kendoGrid 새로운 행 추가 후 서버에 저장시 발생
				 * data에 데이터를 실어서 보내기 때문에 js에서나 서버단에서 값을 보정해 주어야한다
				 * 현재 그리드는 js에서 보정
				 * 신규 ROW 수정모드 확정 시 자동 저장.
				 * @param param
				 */
				create : function (param){
					console.log("create")
					var data = param.data
					param = {
						column_1 : data.column_1,
						column_2 : data.column_2,
						column_3 : data.column_3,
						column_4 : data.column_4,
						column_5 : data.column_5,
						column_6 : data.column_6,
						column_7 : data.column_7,
						column_8 : data.column_8,
						column_9 : data.column_9,
						column_10 :data.column_10,
					}
					Utils.ajaxCall(
						"/sample/SAMPINS01",
						JSON.stringify(param),
						resultPorocess2,
						window.kendo.ui.progress($("#grid2"), true))
				},
				/**
				 * kendoGrid의 데이터를 편집하거나 저장할때 발생
				 * data에 데이터를 실어서 보내기 때문에 js에서나 서버단에서 값을 보정해 주어야한다
				 * 현재 그리드는 js에서 보정
				 * 수정모드에서 데이터 수정후 확정 시 자동 update
				 * @param param
				 */
				update : function (param){
					console.log("update")
					var data = param.data
					param = {
						sample_pk : data.sample_pk,
						column_1  : data.column_1,
						column_2  : data.column_2,
						column_3  : data.column_3,
						column_4  : data.column_4,
						column_5  : data.column_5,
						column_6  : data.column_6,
						column_7  : data.column_7,
						column_8  : data.column_8,
						column_9  : data.column_9,
						column_10 :data.column_10,
					}
					Utils.ajaxCall(
						"/sample/SAMPUPD01",
						JSON.stringify(param),
						resultPorocess2,
						window.kendo.ui.progress($("#grid2"), true))
				},
				/**
				 * kendoGrid의 데이터를 삭제 시 자동 발생
				 * data에 데이터를 실어서 보내기 때문에 js에서나 서버단에서 값을 보정해 주어야한다
				 * 현재 그리드는 js에서 보정
				 * 데이터 삭제 시 자동 삭제.
				 * @param param
				 */
				destroy: function (param) {
					console.log("delete")
					var data = param
					param = {
						sample_pk : data.sample_pk,
						column_1  : data.column_1,
						column_2  : data.column_2,
						column_3  : data.column_3,
						column_4  : data.column_4,
						column_5  : data.column_5,
						column_6  : data.column_6,
						column_7  : data.column_7,
						column_8  : data.column_8,
						column_9  : data.column_9,
						column_10 :data.column_10,
					}
					Utils.ajaxCall(
						"/sample/SAMPDEL01",
						JSON.stringify(param),
						resultPorocess2,
						window.kendo.ui.progress($("#grid2"), true))
				},
				/**
				 * 읽기 작업을 제외한 모든 작업에서 options.models를 json문자열로 변환해 서버에 전송.
				 * 사용방법 좀더 확인 필요.
				 * @param options
				 * @param operation
				 * @returns {{models: *}|*}
				 */
				parameterMap: function(options, operation) {//읽기 작업을 제외한 모든 작업에서 options.models 를 json문자열로 변환하여 서버에 전송
					console.console.log("parameterMap")
					if (operation !== "read" && options.models) {
						return { models: kendo.stringify(options.models) };
					}
					return options;
				},

				/**
				 * kendoGrid에서 데이터가 변경 될 때마다 발생
				 * 현재 그리드에서는 사용되고 있지않음
				 * @param e
				 * @returns {[]}
				 */
				change: function(e) {
					//저장 작업을 진행하기 전에 거침.
					console.log("change")
					var saveRows = markSaveRows( $("#grid2").data("kendoGrid"))

					var insertRows = saveRows.insertRows
					var updateRows = saveRows.updateRows
					var deleteRows = saveRows.deleteRows

					// 업데이트된 행의 필수값 체크 및 기본값 설정
					for (var i = 0; i < updateRows.length; i++) {
						if (!updateRows[i].column_1)	{
							alert("column_1는 필수값입니다");
							return;
						}

						Utils.isNull(updateRows[i].column_1)	? 	updateRows[i].column_1 = ''	:	updateRows[i].column_1 = updateRows[i].column_1;
						Utils.isNull(updateRows[i].column_2)	? 	updateRows[i].column_2 = ''	:	updateRows[i].column_2 = updateRows[i].column_2;
						Utils.isNull(updateRows[i].column_3)	? 	updateRows[i].column_3 = ''	:	updateRows[i].column_3 = updateRows[i].column_3;
						Utils.isNull(updateRows[i].column_4)	? 	updateRows[i].column_4 = ''	:	updateRows[i].column_4 = updateRows[i].column_4;
						Utils.isNull(updateRows[i].column_5)	? 	updateRows[i].column_5 = ''	:	updateRows[i].column_5 = updateRows[i].column_5;
						Utils.isNull(updateRows[i].column_6)	? 	updateRows[i].column_6 = ''	:	updateRows[i].column_6 = updateRows[i].column_6;
						Utils.isNull(updateRows[i].column_7)	? 	updateRows[i].column_7 = ''	:	updateRows[i].column_7 = updateRows[i].column_7;
						Utils.isNull(updateRows[i].column_8)	? 	updateRows[i].column_8 = ''	:	updateRows[i].column_8 = updateRows[i].column_8;
						Utils.isNull(updateRows[i].column_9)	? 	updateRows[i].column_9 = ''	:	updateRows[i].column_9 = updateRows[i].column_9;
						Utils.isNull(updateRows[i].column_10)	?   updateRows[i].column_10 = '':   updateRows[i].column_10 = updateRows[i].column_10;
					}


					// 삽입된 행의 필수값 체크 및 기본값 설정
					for (var i = 0; i < insertRows.length; i++) {
						if (!insertRows[i].column_1)	{
							alert("column_1는 필수값입니다");
							return;
						}
						Utils.isNull(insertRows[i].column_1)	? 	insertRows[i].column_1 = ''	:	insertRows[i].column_1 = insertRows[i].column_1;
						Utils.isNull(insertRows[i].column_2)	? 	insertRows[i].column_2 = ''	:	insertRows[i].column_2 = insertRows[i].column_2;
						Utils.isNull(insertRows[i].column_3)	? 	insertRows[i].column_3 = ''	:	insertRows[i].column_3 = insertRows[i].column_3;
						Utils.isNull(insertRows[i].column_4)	? 	insertRows[i].column_4 = ''	:	insertRows[i].column_4 = insertRows[i].column_4;
						Utils.isNull(insertRows[i].column_5)	? 	insertRows[i].column_5 = ''	:	insertRows[i].column_5 = insertRows[i].column_5;
						Utils.isNull(insertRows[i].column_6)	? 	insertRows[i].column_6 = ''	:	insertRows[i].column_6 = insertRows[i].column_6;
						Utils.isNull(insertRows[i].column_7)	? 	insertRows[i].column_7 = ''	:	insertRows[i].column_7 = insertRows[i].column_7;
						Utils.isNull(insertRows[i].column_8)	? 	insertRows[i].column_8 = ''	:	insertRows[i].column_8 = insertRows[i].column_8;
						Utils.isNull(insertRows[i].column_9)	? 	insertRows[i].column_9 = ''	:	insertRows[i].column_9 = insertRows[i].column_9;
						Utils.isNull(insertRows[i].column_10)	?   insertRows[i].column_10 = '':   insertRows[i].column_10 = insertRows[i].column_10;
					}


					return saveRows;
				}

			},
			//batch: true,	//추가,수정,삭제를 한번에 서버로 전송하는 기능을 활성화.
			/**
			 * 데이터 소스의 구조를 정의
			 */
			schema : {
				type: "json",
				model: {
					id: "sample_pk",  //필수 상태값 or 수정 삭제를 위해 PK를 연결해 주어야함
					fields: {
						sample_pk      	: { field: "sample_pk" , type: "string" },
						column_1      	: { field: "column_1"  , type: "string" },
						column_2      	: { field: "column_2"  , type: "string" },
						column_3        : { field: "column_3"  , type: "string" ,  editable: false  , defaultValue : 'Y' },
						column_4        : { field: "column_4"  , type: "date"  },
						column_5  		: { field: "column_5"  , type: "date" },
						column_6        : { field: "column_6"  , type: "date" },
						column_7       	: { field: "column_7"  , type: "number" },
						column_8     	: { field: "column_8"  , type: "string" },
						column_9     	: { field: "column_9"  , type: "string" },
						column_10     	: { field: "column_10" , type: "string" },
					}
				}
			}
		}




		SAMP009M_grid2 = $("#grid2").kendoGrid({
			dataSource : SAMP009MDataSource2,
			autoBind: true,
			groupable: false,
			navigatable: true,
			detailExpand: function (e) {
				console.log("detailExpand")
			},
			noRecords: { template: `<div class="nodataMsg"><p>해당 목록이 없습니다.</p></div>` },
			columns: [
				{
					title: '', width: '40px', attributes:{'class':'align-center'},
					headerTemplate	: '<input class="k-checkbox allRowCheck" type="checkbox" onclick="fnCheckAll2(this);">',
					template	: '<input type="checkbox" class="k-checkbox rowCheck" onclick="fnCheckRow2(this);" />'
				},
				/*{
					title: '상태',
					type: "string",
					width :  "50px",
					template: function (dataItem) {
						let html = "";

						if (dataItem.isNew()) {
							html = "<img src='" + GLOBAL.contextPath + "/images/contents/btn_new.png' style='vertical-align:middle'>";
						} else if (dataItem.dirty) {
							html = "<img src='" + GLOBAL.contextPath + "/images/contents/btn_modify.png' style='vertical-align:middle'>";
						}

						return html;
					},
				},*/
				{
					field: "sample_pk", title: "sample_pk", hidden: true
				},
				{
					field: "column_1", title: "기본",type: "String"
				},
				{
					field: "column_2", title: "Select Box",
					editable: function (dataItem) {
						if (dataItem.column_2 == "F") {
							//검정색의 경우 수정 안되게.
							return false
						} else {
							return true
						}
					},
					editor: function (container, options) {
						SampleGridComboBox(container, options, SAMP009M_grid2, "C0044")
					},
					template: function (dataItem) {
						return Utils.getComCdNm(SAMP009M.comCdList, "C0044", dataItem.column_2);
					}
				},

				{
					field: "column_3", title: "슬라이드 버튼",type: "String"
					,  template: '<span class="swithCheck"><input type="checkbox" #if(column_3 == "Y")   {# return checked #}# onclick="SAMP009M_fnSlideBtn2(this)")/><label></label></span>'
				},
				{
					field: "column_4", title: "DatePicker"
					, template: '#=kendo.format("{0:yyyy-MM-dd}",new Date(column_4))#'
					, editor: function (container , options){
						$('<input name="' + options.field + '"/>')
							.appendTo(container)
							.kendoDatePicker({
								format: "yyyy-MM-dd"
							});
					}

				},
				{
					field: "column_5", title: "TimePicker"
					, template: '#=kendo.format("{0:HH:mm:ss}",new Date(column_5))#'
					, editor: function (container , options){
						$('<input name="' + options.field + '"/>')
							.appendTo(container)
							.kendoTimePicker({
								format: "HH:mm:ss"
							});
					}

				},


				{
					field: "column_6", title: "DateTimePicker"
					, template: '#=kendo.format("{0:yyyy-MM-dd HH:mm:ss }",new Date(column_6))#'
					, editor: function (container , options){
						$('<input name="' + options.field + '"/>')
							.appendTo(container)
							.kendoDateTimePicker({
								format: "yyyy-MM-dd HH:mm:ss"
							});
					}

				},
				{
					field: "column_7", title: "특정 기준 색상변경",type: "number"
				},
				{
					field: "column_8", title: "중복컬럼 1",type: "String" , duple : true
				},

				{
					field: "column_9", title: "중복컬럼 2",type: "String" , duple : true
				},
				{
					field: "column_10", title: "파일첨부",type: "String", template: "#= column_10 #",  width: "300px"  //파일 업로드는 구현 시 서버단 구현이 필요.
					, editor: function (container, options) {
						$('<input name="' + options.field + '" type="file" />')
							.appendTo(container)
							.kendoUpload({
								async: {
									saveUrl: "fileUpload URL",
									removeUrl: "fileremove URL",
									autoUpload: false
								},
								success: function(e) {
									var fileName = e.response[0].name;
									options.model.set(options.field, fileName);
								}
							});
					}
				}
				,{ command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }	 //edit 기능을 사용하려면  editable : inline  , edit ,save,cancel 함수 선언 해주어야함.
			],

			selectable: "row", // Row selection enabled
			editable:"inline" ,
			navigatable: true, // Ensure keyboard navigation
			height: 550,
			pageable: {refresh:false
				, pageSizes:[10 , 20, 25, 30, 40, 50, 100, 1000, 3000, 5000, 10000]
				, buttonCount:10
				, pageSize : 25
			},
			edit : function (e) {
				console.log("edit")

			},
			save : function (e) {
				console.log("save")
				let grid = e.sender;

				/* 중복체크를 위해 사용
				*  isDuplicate 함수 필요.
				*  columns 속성에 , duple : true 추가
				* */
				var input = e.container.find("input");
				var fieldName = input.attr("name");
				var value = input.val();

				if (grid.columns.some(col => col.field === fieldName && col.duple)) {
					if (isDuplicate(grid, fieldName, value, e.model.uid)) {
						e.preventDefault(); // 저장을 취소합니다
						document.getElementById('message2').innerHTML = fieldName + " 필드의 값이 중복됩니다.";
					} else {
						document.getElementById('message2').innerHTML = "";
						console.log("Save event triggered", e.model);
					}
				}
				/* 중복 체크  끝*/


				grid.refresh();

			},
			remove : function(e){
				console.log("remove")
				e.model.dirty = true; // 삭제된 레코드의 상태를 dirty로 설정
				console.log("Remove event triggered for", e.model);
			},
			cancel: function(e) {
				console.log("Cancel event triggered", e.model);
			},
			/**
			 * 수정 즉시 저장 을 위한 change 
			 * @param e
			 */
			change: function (e) {
				var grid = this;
				var selectedRow = grid.select();

				var rowIndex = grid.items().index(selectedRow);	//저장 후 재조회 뒤 수정모드를 유지하기위해 index로 수정모드 사용.

				if(updateChk(grid)){ //수정된 데이터가 있다면 수정된 데이터를 전부 저장 하고 editmode가 될 index정보를 넘김.
					SAMP009M_grid2_Select_Row_Num = rowIndex
					grid.saveRow()
				}
				editRowByIndex(SAMP009M_grid2, rowIndex)

			}
			,dataBound: function(e) {
				var grid = this;
				var column_7Index = grid.wrapper.find(".k-grid-header [data-field='column_7']").index();

				grid.tbody.find('>tr').each(function() {
					var dataItem = grid.dataItem(this);
					var cell = $(this).find("td").eq(column_7Index);

					if (dataItem.column_7 > 5) {
						cell.css("background-color", "yellow");
					}
					//row 의 색상을 변경하고 싶다면 $(this).css("background-color", "yellow");
				});
			},

		}).data("kendoGrid");

	});



	/** ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ incell  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

	/**
	 * 행추가
	 */
	$('#btn99').bind('click', function () {
		var grid = $("#grid").data("kendoGrid");
		var obj = grid.dataSource.insert(0);
	});

	/**
	 * 조회
	 */
	$('#btn21').on('click', function EmpListSearch() {
		var param = {}
		SAMP009MDataSource.transport.read(param);
	});

	/**
	 * 모두 저장
	 */
	$('#btn30').on('click', function () {
		console.log("저장")
		if (confirm("저장하시겠습니까?") == false) return;
		var saveRows = SAMP009MDataSource.transport.change();
		var data = { "insertRows" : saveRows.insertRows , "updateRows" : saveRows.updateRows , "deleteRows" : saveRows.deleteRows};
		SAMP009MDataSource.transport.update(data);
	});


	/**
	 * 삭제(저장을 해야 정말 삭제)
	 */
	$('#btn50').on('click', function () {
		if (confirm("삭제하시겠습니까?") == false) return;
		var	rowChecks	= $('#grid .rowCheck:checked');
		var itemsToRemove = []
		// 체크된 행의 데이터 항목을 수집
		rowChecks.each(function () {
			var row = $(this).closest("tr");
			var dataItem = SAMP009M_grid.dataItem(row);
			if (dataItem) {
				itemsToRemove.push(dataItem);
			}
		});

		// 수집한 항목을 삭제
		itemsToRemove.forEach(function (item) {
			SAMP009M_grid.dataSource.remove(item);
		});
	});
	/**
	 * 삭제(저장하지 않아도 바로 삭제.
	 */
	$('#btn51').on('click', function () {
		if (confirm("삭제하시겠습니까?") == false) return;
		var	rowChecks	= $('#grid .rowCheck:checked');
		var itemsToRemove = []
		// 체크된 행의 데이터 항목을 수집
		rowChecks.each(function () {
			var row = $(this).closest("tr");
			var dataItem = SAMP009M_grid.dataItem(row);
			if (dataItem) {
				itemsToRemove.push(dataItem);
			}
		});

		// 수집한 항목을 삭제
		itemsToRemove.forEach(function (item) {
			SAMP009M_grid.dataSource.remove(item);
			SAMP009MDataSource.transport.destroy2(item);
		});
	});

	/**
	 * 엑셀 다운로드
	 */
	$('#btn60').on('click', function () {
		exportExcel($("#grid"))
	});

	/**
	 * 선택된 값을 보여주는 버튼
	 */
	$('#btn70').on('click', function () {
		var checkRows = []
		var	rowChecks	= $('#grid .rowCheck:checked');

		for (var i = 0; i < rowChecks.length; i++) {
			var	tr		= rowChecks[i].closest("tr")
			var	item	= SAMP009M_grid.dataItem( tr )
			checkRows.push(item);
		}
		if(rowChecks.length == 0){
			document.getElementById('message').innerHTML="";
			document.getElementById('message').innerHTML="체크값 없음";


		}else{
			var jsonEncode1 = JSON.stringify(checkRows);
			console.log(rowChecks)
			console.log(checkRows)
			document.getElementById('message').innerHTML="";
			document.getElementById('message').innerHTML=jsonEncode1;
		}
	});

	/**
	 * 등록 수정 삭제 callback 함수
	 * @param data
	 */
	function resultPorocess(data){
		window.kendo.ui.progress($("#grid"), false);

		var insertResult = JSON.stringify(data.insertResult);
		var updateResult = JSON.stringify(data.updateResult);
		var deleteResult = JSON.stringify(data.deleteResult);
		console.log("data.insertResult : " + insertResult);
		console.log("data.updateResult : " + updateResult);
		console.log("data.deleteResult : " + deleteResult);

		var jsonEncode1 = JSON.stringify(data.msg);
		console.log("data.msg : " + jsonEncode1);

		document.getElementById('message').innerHTML="";
		document.getElementById('message').innerHTML=jsonEncode1;

		SAMP009MDataSource.transport.read({});
	}

	/**
	 * 저장을 사용하지 않은 삭제의 callback함수
	 * @param data
	 */
	function resultPorocess_del(data){
		window.kendo.ui.progress($("#grid"), false);

		var result = JSON.stringify(data.result);
		console.log("data.result : " + result);

		var jsonEncode1 = JSON.stringify(data.msg);
		console.log("data.msg : " + jsonEncode1);

		document.getElementById('message').innerHTML="";
		document.getElementById('message').innerHTML=jsonEncode1;

		SAMP009M_grid.dataSource._destroyed =[]
	}


	/**
	 * 조회 이후 콜백 함수
	 * @param data
	 * @constructor
	 */
	function SAMP009M_callback (data){
		window.kendo.ui.progress($("#grid"), false);

		let list = JSON.parse(data.result);

		const listLength = list.length;
		if (listLength === 0) {
			SAMP009M_grid.dataSource.data([]);
			return;
		}

		SAMP009M_grid.dataSource.data(list);
		SAMP009M_grid.dataSource.options.schema.data = list;
		SAMP009M_grid.dataSource.page(1);
	}

	/**
	 * 슬라이드 버튼 기능 구현 함수
	 * @param obj
	 * @constructor
	 */
	function SAMP009M_fnSlideBtn(obj){
		let tr = $(obj).closest("tr");
		let item =  SAMP009M_grid.dataItem(tr);

		if(item.column_3=='N'){
			item.column_3 ='Y'
		}else{
			item.column_3='N'
		}

		item.set('dirty' ,true)

		SAMP009M_grid.dataSource.data(SAMP009M_grid.dataSource.data())
	}

	/**
	 * 전체선택/해제
	 *
	 * @param obj
	 * @returns
	 */
	function fnCheckAll(obj) {
		var	checked		= $(obj).prop('checked');
		$('#grid .rowCheck').each(function (idx, row) {
			$(row).prop('checked', checked);
			fnCheckRow(row);
		});
	};

	/**
	 * 선택된 행 처리
	 *
	 * @param obj 체크박스 객체
	 */
	function fnCheckRow(obj) {
		var grid = $("#grid").data("kendoGrid");
		var	tr		= $(obj).closest('tr');
		var	item	= grid.dataItem(tr);
	};


	/** ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ inline  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

	/**
	 * 행추가
	 */
	$('#btn990').bind('click', function () {
		var grid = $("#grid2").data("kendoGrid");
		var obj = grid.dataSource.insert(0, {});
		grid.editRow(grid.tbody.find("tr:first"));

	});

	/**
	 * 조회
	 */
	$('#btn210').on('click', function EmpListSearch() {
		var param = {}
		SAMP009MDataSource2.transport.read(param);
	});


	/**
	 * 삭제
	 */
	$('#btn500').on('click', function () {
		if (confirm("삭제하시겠습니까?") == false) return;

		var	rowChecks	= $('#grid2 .rowCheck:checked');
		var itemsToRemove = []
		// 체크된 행의 데이터 항목을 수집
		rowChecks.each(function () {
			var row = $(this).closest("tr");
			var dataItem = SAMP009M_grid2.dataItem(row);
			if (dataItem) {
				itemsToRemove.push(dataItem);
			}
		});

		// 수집한 항목을 삭제
		itemsToRemove.forEach(function (item) {
			SAMP009MDataSource2.transport.destroy(item);
		});
	});

	/**
	 * 엑셀 다운로드
	 */
	$('#btn600').on('click', function () {
		exportExcel($("#grid2"))
	});

	/**
	 * 수정데이터 확인
	 */
	$('#btn700').on('click', function () {
		var checkRows = []
		var	rowChecks	= $('#grid2 .rowCheck:checked');

		for (var i = 0; i < rowChecks.length; i++) {
			var	tr		= rowChecks[i].closest("tr")
			var	item	= SAMP009M_grid2.dataItem( tr )
			checkRows.push(item);
		}
		if(rowChecks.length == 0){
			document.getElementById('message2').innerHTML="";
			document.getElementById('message2').innerHTML="체크값 없음";


		}else{
			var jsonEncode1 = JSON.stringify(checkRows);
			console.log(rowChecks)
			console.log(checkRows)
			document.getElementById('message2').innerHTML="";
			document.getElementById('message2').innerHTML=jsonEncode1;
		}
	});
	/**
	 * 신규등록,변경,삭제 결과
	 */
	function resultPorocess2(data){
		window.kendo.ui.progress($("#grid2"), false);

		var result = JSON.stringify(data.result);
		console.log("data.result : " + result);

		var jsonEncode1 = JSON.stringify(data.msg);
		console.log("data.msg : " + jsonEncode1);

		document.getElementById('message2').innerHTML="";
		document.getElementById('message2').innerHTML=jsonEncode1;


		SAMP009MDataSource2.transport.read({});
	}


	/**
	 * 조회 콜백
	 * @param data
	 * @constructor
	 */
	function SAMP009M_callback2 (data){
		window.kendo.ui.progress($("#grid2"), false);

		let list = JSON.parse(data.result);

		const listLength = list.length;
		if (listLength === 0) {
			SAMP009M_grid2.dataSource.data([]);
			return;
		}

		SAMP009M_grid2.dataSource.data(list);
		SAMP009M_grid2.dataSource.options.schema.data = list;
		SAMP009M_grid2.dataSource.page(1);
		if(SAMP009M_grid2_Select_Row_Num){
			editRowByIndex(SAMP009M_grid2, SAMP009M_grid2_Select_Row_Num)
			SAMP009M_grid2_Select_Row_Num = null
		}
	}

	/**
	 *  슬라이드 버튼
	 * @param obj
	 * @constructor
	 */
	function SAMP009M_fnSlideBtn2(obj){
		let tr = $(obj).closest("tr");
		let item =  SAMP009M_grid2.dataItem(tr);
		if(item.column_3=='N'){
			item.column_3 ='Y'
		}else{
			item.column_3='N'
		}

		item.set('dirty' ,true)
	}

	/**
	 * 전체선택/해제
	 *
	 * @param obj
	 * @returns
	 */
	function fnCheckAll2(obj) {
		var	checked		= $(obj).prop('checked');
		$('#grid2 .rowCheck').each(function (idx, row) {
			$(row).prop('checked', checked);
			fnCheckRow2(row);
		});
	};

	/**
	 * 선택된 행 처리
	 *
	 * @param obj 체크박스 객체
	 */
	function fnCheckRow2(obj) {
		var grid = $("#grid2").data("kendoGrid");
		var	tr		= $(obj).closest('tr');
		var	item	= grid.dataItem(tr);

	};

	/**
	 * 특정 rowIndex로 수정모드 변경
	 * @param index
	 */
	function editRowByIndex(grid , index) {
		var dataItem = grid.dataSource.view()[index];
		if (dataItem) {
			grid.editRow(grid.table.find("tr[data-uid='" + dataItem.uid + "']"));
		} else {
			console.log("Row with index " + index + " not found.");
		}
	}

	/**
	 * 수정또는 추가된 데이터가 있는지 체크
	 * @param grid
	 * @returns {*}
	 */
	function updateChk(grid){
		var updateRows = grid.dataSource.data().filter( val => val.isNew() || val['dirty'] )
		return updateRows.length > 0 ? true : false
	}


	/** ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 공통  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */





	/**
	 * 등록,수정,삭제  저장 및 수정 데이터를 반환하는 함수
	 *
	 * @param grid Kendo UI Grid 객체
	 * @returns saveRows 변경된 행 데이터
	 */
	function markSaveRows(grid) {
		console.log("markSaveRows")
		var	saveRows	= []
		var insertRows = grid.dataSource.data().filter( val => val.isNew()  )
		var updateRows = grid.dataSource.data().filter( val => !val.isNew() && val['dirty'] )
		var deleteRows = grid.dataSource._destroyed

		saveRows.insertRows = insertRows
		saveRows.updateRows = updateRows
		saveRows.deleteRows = deleteRows


		return saveRows;
	};


	/**
	 * 콤보박스 세팅을 위한 함수
	 * @param container
	 * @param options
	 * @param grid
	 * @param exceptComCd
	 * @constructor
	 */
	function SampleGridComboBox(container, options, grid, exceptComCd) {
		let $select = $('<select data-bind="value:' + options.field + '"/>').appendTo(container);
		let CdList = SAMP009M.comCdList.filter(function (code) {
			return code.mgntItemCd == "C0044"
		})

		Utils.setKendoComboBox(CdList, exceptComCd, $select, "", false)
	}

	/**
	 * excel export를 위한 함수.
	 * @param grid
	 */
	function exportExcel(grid) {
		var gridData = grid.data("kendoGrid");
		var pageSize = gridData._data.length;
		var dataSourceTotal = gridData.dataSource.total();
		gridData.dataSource.pageSize(dataSourceTotal);


		gridData.bind("excelExport", function(e) {
			e.workbook.fileName = "샘플 엑셀.xlsx";
		});
		gridData.saveAsExcel();
		gridData.dataSource.pageSize(pageSize);
	}


	/**
	 * 중복 체크를 위한 함수
	 *
	 * @param grid
	 * @param fieldName
	 * @param value
	 * @param currentUid
	 * @returns {boolean}
	 */
	function isDuplicate(grid, fieldName, value, currentUid) {
		var data = grid.dataSource.data();
		for (var i = 0; i < data.length; i++) {
			if (data[i][fieldName] === value && data[i].uid !== currentUid) {
				return true;
			}
		}
		return false;
	}



}