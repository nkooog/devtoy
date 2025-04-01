/***********************************************************************************************
 * Program Name : 그리드 example(gridSample.js)
 * Creator      : bykim
 * Create Date  : 2022.01.25
 * Description  : 그리드 example
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.01.25     bykim            최초작성
 ************************************************************************************************/
var sampleDataSource, sampleDataSource2, sampleDataSource3 ;



//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 일반 그리드 (편집 저장 및 수정 가능) ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■



$(document).ready(function () {

	sampleDataSource ={
		transport: {
			read	: function (e) {
				$.ajax({
					url: '/bcs/emp/empList',
					type:'post',
					dataType : 'json',
					contentType : 'application/json; charset=UTF-8',
					beforeSend: function () {
						window.kendo.ui.progress($("#grid"), true);
					},
					success : resultEmpList,
					error :function(request,status, error){
						console.log("[error]");
						console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
					}
				}).complete(function () {
					window.kendo.ui.progress($("#grid"), false);
				});
			},
			change: function(e) {

				var updateRows = markUpdateRows( $("#grid").data("kendoGrid"))

				// update validation
				for (var i = 0; i < updateRows.length; i++) {

					if (!updateRows[i].empno)	{
						alert("사원번호는 필수값입니다");
						return;
					}
					if (!updateRows[i].ename)	{
						updateRows[i].ename	= null;
					}
					if (!updateRows[i].job)	{
						updateRows[i].job	= null;
					}
					isNull(updateRows[i].hiredate) 	? updateRows[i].hiredate = '99991231' 	: updateRows[i].hiredate = updateRows[i].hiredate;
					isNull(updateRows[i].mgr) 		? updateRows[i].mgr = '1000' 			: updateRows[i].mgr = updateRows[i].mgr;
					isNull(updateRows[i].sal) 		? updateRows[i].sal = '3000' 			: updateRows[i].sal = updateRows[i].sal;
					isNull(updateRows[i].comm) 		? updateRows[i].comm = '9999' 			: updateRows[i].comm = updateRows[i].comm;
					isNull(updateRows[i].deptno) 	? updateRows[i].deptno = '1111' 		: updateRows[i].deptno = updateRows[i].deptno;
					isNull(updateRows[i].passwd) 	? updateRows[i].passwd = '1111' 		: updateRows[i].passwd = updateRows[i].passwd;
				}
				return updateRows;
			}
		},
		schema : {
			type: "json",
			model: {
				fields: {
					empno: { field: "empno", type: "string" },
					ename: { field: "ename", type: "string" },
					job: { field: "job", type: "string" }
				}
			}
		}
	}

	$("#grid").kendoGrid({
		dataSource : {},
		autoBind: false,
		height: 550,
		groupable: true,
		sortable: true,
		editable: "incell",
		navigatable: true,
		pageable: {refresh:false
			, pageSizes:[10 , 20, 25, 30, 40, 50, 100, 1000, 3000, 5000, 10000]
			, buttonCount:10
			, pageSize : 25
		},
		columns: [
			{
				title: '', width: '40px', attributes:{'class':'align-center'},
				headerTemplate	: '<input class="k-checkbox allRowCheck" type="checkbox" onclick="fnCheckAll(this);">',
				template	: '<input type="checkbox" class="k-checkbox rowCheck" onclick="fnCheckRow(this);" />'
			},
			{
				field: "empno", title: "empno",type: "String"
			}, {
				field: "ename", title: "ename",type: "String"
			}, {
				field: "job", title: "job",type: "String"
			}],
		save : function (e) {
			$(e.container).closest('tr').find('.rowCheck').prop('checked', true);
		}

	});


	//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 입력 형태 변화 그리드 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


	sampleDataSource2 ={
		transport: {
			read	: function (e) {
				$.ajax({
					url: '/bcs/emp/empList',
					type:'post',
					dataType : 'json',
					contentType : 'application/json; charset=UTF-8',
					beforeSend: function () {
						window.kendo.ui.progress($("#grid2"), true);
					},
					success : resultEmpList2,
					error :function(request,status, error){
						console.log("[error]");
						console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
					}
				}).complete(function () {
					window.kendo.ui.progress($("#grid2"), false);
				});
			},
			change: function(e) {

				var updateRows = markUpdateRows( $("#grid").data("kendoGrid"))
				return updateRows;
			}

		},
		schema : {
			type: "json",
			model: {
				fields: {
					empno      : { field: "empno"     , type: "string" },
					ename      : { field: "ename"     , type: "string" },
					job        : { field: "job"       , type: "string" ,  editable: false},
					mgr        : { field: "mgr"       , type: "string" },
					hiredate2  : { field: "hiredate2" , type: "date" },
					sal        : { field: "sal"       , type: "number" },
					comm       : { field: "comm"      , type: "number" },
					deptno     : { field: "deptno"    , type: "number" },
					passwd     : { field: "passwd"    , type: "string" }
				}
			}
		}
	}

	var ddlDataSource = [{ value: "대표",  displayValue: "대표" },
		{ value: "본부장", displayValue: "본부장"  },
		{ value: "이사",  displayValue: "이사" },
		{ value: "부장", displayValue: "부장" },
		{ value: "차장", displayValue: "차장" },
		{ value: "실장", displayValue: "실장" },
		{ value: "팀장", displayValue: "팀장" },
		{ value: "과장",  displayValue: "과장" },
		{ value: "선임", displayValue: "선임" },
		{ value: "연구원", displayValue: "연구원" },
		{ value: "연구원1", displayValue: "연구원1" },
		{ value: "연구원2", displayValue: "연구원2" },
		{ value: "연구원3", displayValue: "연구원3" },
		{ value: "사원", displayValue: "사원" },
		{ value: "PRESIDENT", displayValue: "PRESIDENT" },
		{ value: "ANALYST", displayValue: "ANALYST" },
		{ value: "MANAGER", displayValue: "MANAGER" },
		{ value: "SALESMAN", displayValue: "SALESMAN" },
		{ value: "CLERK", displayValue: "CLERK" },
	];



	$("#grid2").kendoGrid({
		dataSource : sampleDataSource2,
		autoBind: false,
		columns: [
			{
				title: '', width: '40px', attributes:{'class':'align-center'},
				headerTemplate	: '<input class="k-checkbox allRowCheck" type="checkbox" onclick="fnCheckAll(this);">',
				template	: '<input type="checkbox" class="k-checkbox rowCheck" onclick="fnCheckRow(this);" />'
			},
			{
				field: "empno"   , title: "사원번호",  type: "string"
			},
			{
				field: "ename"   , title: "사원명",   type: "String",
			},
			{
				field: "job",
				template: '<input id="jobDropDownTemplate"/>'
			},
			{
				field: "mgr"     , title: "책임자",   type: "string"
			},
			{
				field: "hiredate2", title: "입사일자",   type: "date" ,format: "{0:yyyyMMdd}"
			},
			{
				field: "sal"     , title: "연봉",   type: "number", attributes:{'style':' text-align: right;'}, template : '#if (sal) {# #=setComma(sal)# #}#'
			},
			{
				field: "comm"    , title: "상여금",   type: "number", attributes:{'style':' text-align: right;'}, template : '#if (comm) {# #=setComma(comm)# #}#'
			},
			{
				field: "deptno"  , title: "부서번호",   type: "number"
			},
			{
				field: "passwd"  , title: "비밀번호",   type: "String"
			}],
		editable: "incell",
		height: 550,
		pageable: {refresh:false
			, pageSizes:[10 , 20, 25, 30, 40, 50, 100, 1000, 3000, 5000, 10000]
			, buttonCount:10
			, pageSize : 25
		},
		// combo box setting
		dataBound: function(e) {
			var grid = e.sender;
			var items = e.sender.items();

			items.each(function(e) {
				var dataItem = grid.dataItem(this);
				//console.log(dataItem)
				var ddt = $(this).find('#jobDropDownTemplate	');

				$(ddt).kendoDropDownList({
					value: dataItem.job,
					dataSource: ddlDataSource,
					dataTextField: "displayValue",
					dataValueField: "value",
					change: onDDLChange
				});
			});
		},
		// datepicker setting
		edit: onEdit,
		save : function (e) {
			$(e.container).closest('tr').find('.rowCheck').prop('checked', true);
		}
	});




	//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 컬럼 변화 그리드 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


	var colNm= ["empno","ename","job"];

	var columns =[]

	colNm.forEach(function(val) {
		var column = {
			field:val,
			title: val,
			width: 70
		}

		columns.push(column);
	});


	sampleDataSource3 ={
		transport: {
			read	: function (e) {
			},
			change: function(e) {
			}

		},
		schema : {
			type: "json",
			model: {
				fields: {
					empno      : { field: "empno"     , type: "string" },
					ename      : { field: "ename"     , type: "string" },
					job        : { field: "job"       , type: "string" ,  editable: false},
					mgr        : { field: "mgr"       , type: "string" },
					hiredate2  : { field: "hiredate2" , type: "date" },
					sal        : { field: "sal"       , type: "number" },
					comm       : { field: "comm"      , type: "number" },
					deptno     : { field: "deptno"    , type: "number" },
					passwd     : { field: "passwd"    , type: "string" }
				}
			}
		}
	}


	$("#grid3").kendoGrid({
		dataSource : sampleDataSource3,
		autoBind: false,
		columns: columns,
		editable: "incell",
		height: 200,
		pageable: {refresh:false
			, pageSizes:[10 , 20, 25, 30, 40, 50, 100, 1000, 3000, 5000, 10000]
			, buttonCount:10
			, pageSize : 25
		},

	});


	//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 컬럼 변화 그리드 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■



	$("#grid4").kendoGrid({
		dataSource :  [{ name: "Jane Doe", age: 30, number : 1111, etc: "1"},
			{ name: "tesettttttttttt", age: 31, number : 1111, etc: "2"},
			{ name: "Jane Doe", age: 32, number : 1111, etc: "1" },
			{ name: "tesettttttttttt", age: 33 , number : 1111, etc: "2"},
			{ name: "Jane Doe", age: 34, number : 1111, etc: "1" },
			{ name: "tesettttttttttt", age: 33 , number : 1111, etc: "2"},],
		height: 550,
		sortable: true,
		editable: "incell",
		navigatable: true,
		pageable: {refresh:false
			, pageSizes:[10 , 20, 25, 30, 40, 50, 100, 1000, 3000, 5000, 10000]
			, buttonCount:10
			, pageSize : 25
		},
		columns: [
			{
				title: '', width: '40px', attributes:{'class':'align-center'},
				headerTemplate	: '<input class="k-checkbox allRowCheck" type="checkbox" onclick="fnCheckAll(this);">',
				template	: '<input type="checkbox" class="k-checkbox rowCheck" onclick="fnCheckRow(this);" />'
			},
			{field : "name", title: "Name"},
			{field :"age", age: "Age"}],
		editable:"incell",
		sortable: true,
		altRowTemplate: kendo.template($("#alt-template").html()),
		save : function (e) {
			$(e.container).closest('tr').find('.rowCheck').prop('checked', true);
		}

	});


	//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 그리드 로우 이동 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■



	$("#grid5").kendoGrid({
		dataSource : {},
		autoBind: false,
		height: 550,
		groupable: true,
		sortable: true,
		selectable: "row",
		navigatable: true,
		pageable: {refresh:false
			, pageSizes:[10 , 20, 25, 30, 40, 50, 100, 1000, 3000, 5000, 10000]
			, buttonCount:10
			, pageSize : 25
		},
		columns: [
			{
				title: '', width: '40px', attributes:{'class':'align-center'},
				headerTemplate	: '<input class="k-checkbox allRowCheck" type="checkbox" onclick="fnCheckAll(this);">',
				template	: '<input type="checkbox" class="k-checkbox rowCheck" onclick="fnCheckRow(this);" />'
			},
			{
				field: "empno", title: "empno",type: "String"
			}, {
				field: "ename", title: "ename",type: "String"
			}, {
				field: "job", title: "job",type: "String"
			}],
		save : function (e) {
			$(e.container).closest('tr').find('.rowCheck').prop('checked', true);
		}

	});



	$("#grid6").kendoGrid({
		dataSource : {},
		autoBind: false,
		height: 550,
		groupable: true,
		sortable: true,
		selectable: "row",
		navigatable: true,
		pageable: {refresh:false
			, pageSizes:[10 , 20, 25, 30, 40, 50, 100, 1000, 3000, 5000, 10000]
			, buttonCount:10
			, pageSize : 25
		},
		columns: [
			{
				title: '', width: '40px', attributes:{'class':'align-center'},
				headerTemplate	: '<input class="k-checkbox allRowCheck" type="checkbox" onclick="fnCheckAll(this);">',
				template	: '<input type="checkbox" class="k-checkbox rowCheck" onclick="fnCheckRow(this);" />'
			},
			{
				field: "empno", title: "empno",type: "String"
			}, {
				field: "ename", title: "ename",type: "String"
			}, {
				field: "job", title: "job",type: "String"
			}],
		save : function (e) {
			$(e.container).closest('tr').find('.rowCheck').prop('checked', true);
		}

	});
});


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
 * 선택.
 *
 * @param obj
 * @returns
 */
function fnCheckRow(obj) {
	var grid = $("#grid").data("kendoGrid");
	var	tr		= $(obj).closest('tr');
	var	item	= grid.dataItem(tr);

	//특정 조건일때 선택 불가
	//if (item.epmno == '1000')	$(obj).prop('checked', false);
};




/**
 * 체크박스 선택된 로우 가져오기.
 *
 * @param obj
 * @returns
 */
function markUpdateRows(grid) {
	var updateRows = [];

	var	rowChecks	= $('#grid .rowCheck:checked');
	//var curResults = grid.dataSource.data();

	// 변경행 찾기
	var grid = $("#grid").data("kendoGrid");
	//check 되어있는 것들 가져오기
	for (var i = 0; i < rowChecks.length; i++) {
		var	tr		= $(rowChecks[i]).closest('tr');
		var	item	= Object.assign({}, grid.dataItem(tr));
		updateRows.push(item);
	}
	console.log(updateRows)

	return updateRows;
};

/**
 * null 여부 체크.
 *
 * @param obj
 * @returns
 */
function isNull(data) {
	return undefined == data || '' == data || null == data || "null" == data;
}


/**
 * row 추가.
 *
 * @param obj
 * @returns
 */
$('#btn99').bind('click', function () {
	var grid = $("#grid").data("kendoGrid");
	var obj = grid.dataSource.insert(0);

	//edit row 존재 시 row 추가에도 체크박스 유지
	var data = grid.dataSource.data();
	data.forEach(function(val, key, items) {
		if(val["dirty"]){
			grid.tbody.find("tr").eq(key).find('.rowCheck').prop('checked', true);
		}
	});

	// 추가행 찾기
	var curResults = grid.dataSource.data();
	curResults.forEach(function(val, key, items) {
		var empty =  val['empno'];
		if(isNull(empty)) { val['rowStat'] = "insert";};
	});
});

//사원목록 전체조회
$('#btn21').on('click', function EmpListSearch() {
	alert("사원목록조회 시작");
	sampleDataSource.transport.read();
});


//사원목록 조회결과
function resultEmpList(data){

	var jsonEncode = JSON.stringify(data.empList);
	var obj=JSON.parse(jsonEncode);
	var jsonDecode = JSON.parse(obj);

	//grid data bind
	var grid = $("#grid").data("kendoGrid");
	grid.dataSource.data(jsonDecode);
	//grid.setDataSource(jsonDecode);
	grid.dataSource.options.schema.data = jsonDecode;

	grid = $("#grid5").data("kendoGrid");
	grid.dataSource.data(jsonDecode);
	grid.dataSource.options.schema.data = jsonDecode;

	//처리메시지
	var jsonEncode2 = JSON.stringify(data.msg);
	document.getElementById('message').innerHTML="";
	document.getElementById('message').innerHTML=jsonEncode2;

}


//변경
$('#btn40').on('click', function updateEmp() {
	if (confirm("변경하시겠습니까?") == false) return;
	var updateRows = sampleDataSource.transport.change();

	// 신규추가행 찾기
	var insertIndex = '';
	updateRows.forEach(function(val, key, items) {
		var insert =  val['rowStat'];

		if(insert == "insert") {
			insertIndex += (key+(", "))
			updateRows.splice(key, 1)
		};
	});

	if (isNull(insertIndex)) {
		alert(insertIndex +"행의 데이터는 신규추가 해야합니다.");
	}

	if (updateRows.length == 0) {
		alert("변경할 항목이 없습니다.");
		return;
	}

	var data = { "list" : updateRows};
	var jsonStr = JSON.stringify(data);

	$.ajax({
		type        : 'post',
		contentType : 'application/json; charset=UTF-8',
		url         :  '/bcs/emp/updateMultiEmp',
		dataType    : 'json',
		data        :  jsonStr,
		error: function(xhr, status, error){
			alert(error);
		},
		success : resultPorocessEmp
	});


});


//신규등록
$('#btn30').on('click', function insertEmp() {
	if (confirm("등록하시겠습니까?") == false) return;

	var insertRows = sampleDataSource.transport.change();

	var insertIndex ;
	insertRows.forEach(function(val, key, items) {
		var insert =  val['rowStat'];
		if(isNull(insert) || insert != "insert") {
			insertRows.splice(key, 1)
		};
	});

	if (insertRows.length == 0) {
		alert("신규등록할 항목이 없습니다.");
		return;
	}

	var data = { "list" : insertRows};
	var jsonStr = JSON.stringify(data);

	$.ajax({
		type        : 'post',
		contentType : 'application/json; charset=UTF-8',
		url         :  '/bcs/emp/insertMultiEmp',
		dataType    : 'json',
		data        :  jsonStr,
		error: function(xhr, status, error){
			alert(error);
		},
		success : resultPorocessEmp
	});

});



//삭제
$('#btn50').on('click', function updateEmp() {
	if (confirm("삭제하시겠습니까?") == false) return;

	var deleteRows = markUpdateRows( $("#grid").data("kendoGrid"));

	var data = { "list" : deleteRows};

	var jsonStr = JSON.stringify(data);
	console.log("jsonStr ::: " + jsonStr);

	$.ajax({
		url:  '/bcs/emp/deleteMultiEmp',
		type:'post',
		dataType : 'json',
		contentType : 'application/json; charset=UTF-8',
		data : jsonStr,
		success : resultPorocessEmp,
		error :function(request,status, error){
			console.log("[error]");
			console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	}) ;
});



//신규등록,변경,삭제 결과
function resultPorocessEmp(data){
	var jsonEncode = JSON.stringify(data.result);
	console.log("data.result : " + jsonEncode);

	var jsonEncode1 = JSON.stringify(data.msg);
	console.log("data.msg : " + jsonEncode1);

	document.getElementById('message').innerHTML="";
	document.getElementById('message').innerHTML=jsonEncode1;

	alert(jsonEncode.replaceAll("\"", ""));
	if(jsonEncode.replaceAll("\"", "")=="Delete Success"){
		var ele =document.getElementById('btn10');
		ele.click();
	}
}

//사원번호로 사원정보 조회 트리거
function selectEmp(strno){
	//console.log("callEmpInfo : " + strno);
	$('#empno').val(strno);
	var ele =document.getElementById('btn20');
	ele.click();
}

//초기화
$('#btn10').on('click', function clear() {
	$("#empno").val("");
	$("#ename").val("");
	$("#job").val("");
	$("#mgr").val("");
	$("#hiredate").val("");
	$("#sal").val("");
	$("#comm").val("");
	$("#deptno").val("");
	$("#passwd").val("");
});

//조회
$('#btn20').on('click', function empSearch() {

	var data = { empno : $('#empno').val(), ename  : $('#ename').val(), job    : $('#job').val() };
	//console.log("JSON.stringify(data) ::: " + JSON.stringify(data))

	var jsonStr = JSON.stringify(data);
	console.log("jsonStr ::: " + jsonStr);

	$.ajax({
		url: '/bcs/emp/empSearch',
		type:'post',
		dataType : 'json',
		contentType : 'application/json; charset=UTF-8',
		data : jsonStr,
		success : resultEmpSearch,
		error :function(request,status, error){
			console.log("[error]");
			console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	}) ;
});


//조회결과
function resultEmpSearch(data){
	var jsonEncode = JSON.stringify(data.empInfo);
	var obj        = JSON.parse(jsonEncode);
	var jsonDecode = JSON.parse(obj);

	$('#empno').val(jsonDecode[0].empno);
	$('#ename').val(jsonDecode[0].ename);
	$('#job').val(jsonDecode[0].job);
	$('#mgr').val(jsonDecode[0].mgr);
	$('#hiredate').val(jsonDecode[0].hiredate2); //hiredate2 문자형 날자를 선택
	$('#sal').val(jsonDecode[0].sal);
	$('#comm').val(jsonDecode[0].comm);
	$('#deptno').val(jsonDecode[0].deptno);
	$('#passwd').val(jsonDecode[0].passwd);

	var jsonEncode2 = JSON.stringify(data.msg);

	document.getElementById('message').innerHTML="";
	document.getElementById('message').innerHTML=jsonEncode2;
}

//사원목록 전체조회
$('#btn22').on('click', function EmpListSearch() {
	alert("사원목록조회 시작");
	sampleDataSource2.transport.read();
});

////사원목록 전체조회
//$('#btn23').on('click', function EmpListSearch() {
//	alert("사원목록조회 시작");
//	sampleDataSource4.transport.read();
//});


//사원목록 조회결과
function resultEmpList2(data){

	var jsonEncode = JSON.stringify(data.empList);
	var obj=JSON.parse(jsonEncode);
	var jsonDecode = JSON.parse(obj);

	//grid data bind
	var grid = $("#grid2").data("kendoGrid");
	grid.dataSource.data(jsonDecode);
	grid.dataSource.options.schema.data = jsonDecode;
}


// grid comboBox change
function onDDLChange(e) {
	var element = e.sender.element;
	var row = $(element).closest("tr");
	var grid = $("#grid2").data("kendoGrid");
	var dataItem = grid.dataItem(row);

	console.log( dataItem)
	dataItem.set("job", e.sender.value());
};

// grid datepicker setting
function onEdit(e){
	var dp1 = e.container.find("[name='hiredate2']").data("kendoDatePicker");
}


// 금액 콤마

function setComma(str) {
	str += '';
	x = str.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;

	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}

	return nvl((x1 + x2) + " 원", "원");
};

function nvl (data,format){
	var returndata = "";
	if(undefined == data || '' == data || null == data || "null" == data) {
		returndata = format;
	}else{
		returndata = data;
	}
	return returndata;
}




//사원목록 조회결과
function resultEmpList4(data){

	var jsonEncode = JSON.stringify(data.empList);
	var obj=JSON.parse(jsonEncode);
	var jsonDecode = JSON.parse(obj);

	//grid data bind
	var grid = $("#grid4").data("kendoGrid");
	grid.dataSource.data(jsonDecode);
	//grid.setDataSource(jsonDecode);
	grid.dataSource.options.schema.data = jsonDecode;

	//처리메시지
	var jsonEncode2 = JSON.stringify(data.msg);
	document.getElementById('message').innerHTML="";
	document.getElementById('message').innerHTML=jsonEncode2;

}

function clickToDown() {
	var grid = $("#grid5").data("kendoGrid");
	var grid_selected = grid.select();
	var	grid_item	= Object.assign({}, grid.dataItem(grid_selected));
	grid.removeRow(grid_selected);

	var grid_dataLength = grid.dataSource.data().length;
	var grid2 = $("#grid6").data("kendoGrid");
	grid2.dataSource.pushInsert(grid_dataLength+1, grid_item)
};


function clickToUp() {
	var grid = $("#grid6").data("kendoGrid");
	var grid_selected = grid.select();
	var	grid_item	= Object.assign({}, grid.dataItem(grid_selected));
	grid.removeRow(grid_selected);

	var grid2 = $("#grid5").data("kendoGrid");
	var grid_dataLength = grid2.dataSource.data().length;
	grid2.dataSource.pushInsert(grid_dataLength+1, grid_item)
};




function exportExcel() {
	var gridData = $("#grid").data("kendoGrid");
	var pageSize = gridData._data.length;
	var dataSourceTotal = gridData.dataSource.total();
	gridData.dataSource.pageSize(dataSourceTotal);


	gridData.bind("excelExport", function(e) {
		e.workbook.fileName = "로그인이력조회.xlsx";
	});
	gridData.saveAsExcel();
	gridData.dataSource.pageSize(pageSize);

}