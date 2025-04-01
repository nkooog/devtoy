/***********************************************************************************************
 * Program Name : 사원관리 example(emp.js)
 * Creator      : sukim
 * Create Date  : 2022.12.10
 * Description  : 사원관리 example
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.12.10     sukim           최초작성 
 * 2022.03.02     sukim           태넌트ID로 태넌트명 찾기 추기   
 ************************************************************************************************/
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
		$("#memo").val("");
	});

	//조회
	$('#btn20').on('click', function empSearch() {
		var data = { empno : $('#empno').val(), ename  : $('#ename').val(), job    : $('#job').val() };	
		var jsonStr = JSON.stringify(data);
		
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
		var jsonEncode = JSON.stringify(data.result);
		var obj        = JSON.parse(jsonEncode);

		$('#empno').val(JSON.parse(obj).empno);
		$('#ename').val(JSON.parse(obj).ename);
		$('#job').val(JSON.parse(obj).job);
		$('#mgr').val(JSON.parse(obj).mgr);
		$('#hiredate').val(JSON.parse(obj).hiredate2); //hiredate2 문자형 날자를 선택
		$('#sal').val(JSON.parse(obj).sal);
		$('#comm').val(JSON.parse(obj).comm);
		$('#deptno').val(JSON.parse(obj).deptno);
		$('#passwd').val(JSON.parse(obj).passwd);
		$('#memo').val(JSON.parse(obj).memo);
		
		var jsonEncode2 = JSON.stringify(data.msg);
		document.getElementById('message').innerHTML="";
		document.getElementById('message').innerHTML=jsonEncode2;
	}
	
	//사원목록 전체조회
	$('#btn21').on('click', function EmpListSearch() {
	    $.ajax({
	    	url: '/bcs/emp/empList',
	        type:'post',
	        dataType : 'json', 
	        contentType : 'application/json; charset=UTF-8',
	        success : resultEmpList,
	        error :function(request,status, error){
	        	console.log("[error]");
	        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
	        }
	    }) ;
	});
	
	//사원목록 조회결과
	function resultEmpList(data){
		
		var jsonEncode = JSON.stringify(data.empList);
		var obj=JSON.parse(jsonEncode);
		var jsonDecode = JSON.parse(obj);
		
		//두번째 리스트
		var html = '';
		
		//세번째 리스트
		var target = $('#target');
		
		html += '<table width="100%" cellspacing="0" border="1" class="table table-hover">';
		html += '<caption>사원목록</caption>';
		html += '<colgroup>';
		html += '<col width="25%">';
	    html += '<col width="25%">';
		html += '<col width="25%">';
		html += '<col width="25%">';
		html += '</colgroup>';
		html += '<thead>';
		html += ' <tr class="">';
		html += '  <th><span class="">사원번호</span></th>';
		html += '  <th><span class="">사원명</span></th>';
		html += '  <th><span class="">직책</span></th>';
		html += '  <th><span class="">입사일자</span></th>';
		html += ' </tr>';
		html += '</thead>';
		html += '<tbody>';
		
		let text = "";
		for (let i = 0; i < jsonDecode.length; i++) {
			
			//===== 첫번째 리스트 =====
			text += i +  " 번째 empno:" + jsonDecode[i].empno +", ename:" + jsonDecode[i].ename +", job:" + jsonDecode[i].job + "<br>";
			
		  	//===== 두번째 리스트 =====
	        html += '<tr onclick="selectEmp(' + jsonDecode[i].empno +');" title="사원번호 클릭 시 사원상세 정보를 조회 할 수 있습니다." >';
    	  	html += '<td class="">' + jsonDecode[i].empno +'</td>';
    	  	html += '<td class="">' + jsonDecode[i].ename + '</td>';
    	    html += '<td class="">' + jsonDecode[i].job + '</td>';
    	  	html += '<td class="">' + jsonDecode[i].hiredate2 + '</td>';
    	  	html += '</tr>';
    	  	
    	  	//===== 세번째 리스트 =====
    	  	var add_data = '';
    	  	add_data += '<tr>';
    	  	
    	  	add_data += '<td>';
    	  	add_data += jsonDecode[i].empno;
    	  	add_data += '</td>';

    	  	add_data += '<td>';
    	  	add_data += jsonDecode[i].ename;
    	  	add_data += '</td>';
    	  	
    	  	add_data += '<td>';
    	  	add_data += jsonDecode[i].job;
    	  	add_data += '</td>';
    	  	
    	  	add_data += '<td>';
    	  	add_data += jsonDecode[i].hiredate2;
    	  	add_data += '</td>';
    	  	
    	  	add_data += '</tr>';
    	  	target.append(add_data);

		}
		
		//===== 첫번째 리스트 =====
		document.getElementById("list").innerHTML = "";
		document.getElementById("list").innerHTML = text;
		
		//===== 두번째 리스트 =====
		html += ' </tbody>';
		html += '</table>';		
		$('#list2').html("");
		$('#list2').html(html);
		
		//처리메시지
		var jsonEncode2 = JSON.stringify(data.msg);
		document.getElementById('message').innerHTML="";
		document.getElementById('message').innerHTML=jsonEncode2;

	}	
	
	//신규등록
	$('#btn30').on('click', function insertEmp() {
		if (confirm("등록하시겠습니까?") == false) return;			
		var data = { 
				empno    : $('#empno').val(), 
				ename    : $('#ename').val(), 
				job      : $('#job').val(), 
				mgr      : $('#mgr').val(),
				hiredate : $('#hiredate').val(),
				sal      : $('#sal').val(),
				comm     : $('#comm').val(),
				deptno   : $('#deptno').val(),
				passwd   : $('#passwd').val(),
				memo     : $('#memo').val()
				};	
		
		var jsonStr = JSON.stringify(data);
		console.log("jsonStr ::: " + jsonStr);
		
	    $.ajax({
	    	url: '/bcs/emp/insertEmp',
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

	//변경
	$('#btn40').on('click', function updateEmp() {
		if (confirm("변경하시겠습니까?") == false) return;		
		var data = { 
				empno    : $('#empno').val(), 
				ename    : $('#ename').val(), 
				job      : $('#job').val(), 
				mgr      : $('#mgr').val(),
				hiredate : $('#hiredate').val(),
				sal      : $('#sal').val(),
				comm     : $('#comm').val(),
				deptno   : $('#deptno').val(),
				passwd   : $('#passwd').val(),
				memo     : $('#memo').val()
				};	
		
		var jsonStr = JSON.stringify(data);
		
	    $.ajax({
	    	url: '/bcs/emp/updateEmp',
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
	
	//삭제
	$('#btn50').on('click', function updateEmp() {
		if (confirm("삭제하시겠습니까?") == false) return;
		var data = { 
				empno    : $('#empno').val()
				};	
		
		var jsonStr = JSON.stringify(data);
		
	    $.ajax({
	    	url: '/bcs/emp/deleteEmp',
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
		var jsonEncode1 = JSON.stringify(data.msg);
		
		document.getElementById('message').innerHTML="";
		document.getElementById('message').innerHTML=jsonEncode1;
		
		if(jsonEncode.replaceAll("\"", "")=="Delete Success"){
			var ele =document.getElementById('btn10');
			ele.click();
		}
	}
	
	//사원목록 전체조회
	$('#btn60').on('click', function ELKListSearch() {
	    $.ajax({
	    	url: '/bcs/emp/ELKSearch',
	        type:'post',
	        dataType : 'json', 
	        contentType : 'application/json; charset=UTF-8',
	        success : resultELKList,
	        error :function(request,status, error){
	        	console.log("[error]");
	        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
	        }
	    }) ;
	});	
	
	function resultELKList(data){
		var json        = JSON.stringify(data.result);
		var message     = JSON.stringify(data.msg);
		var obj         = JSON.parse(json);
		var msg         = JSON.parse(message);
		//$('#message').val(JSON.parse(obj).fmnm);
		console.log("=== result === "  + obj);
		console.log("=== message === " + msg);
		
		document.getElementById('message').innerHTML="";
		document.getElementById('message').innerHTML=obj;
	}	
	
	//사원번호로 사원정보 조회 트리거
	function selectEmp(strno){
		console.log("callEmpInfo : " + strno);
		$('#empno').val(strno);
		var ele =document.getElementById('btn20');
		ele.click();
	}
	
	//태넌트ID입력 후 Enter시 태넌트명 조회
	function searchTenantNm(){
		var data = { 
				tenantId    : $('#tenantId2').val()
				};	
		var jsonStr = JSON.stringify(data);

		$.ajax({
	    	url: '/bcs/comm/COMM100SEL02',
	        type:'post',
	        dataType : 'json', 
	        contentType : 'application/json; charset=UTF-8',
	    	data : jsonStr,    
	        success : resultTenantNm,
	        error :function(request,status, error){
	        	console.log("[error]");
	        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
	        }
	    }) ;	
	}
	
	function resultTenantNm(data){
		var jsonEncode = JSON.stringify(data.result);
		var obj        = JSON.parse(jsonEncode);
		$('#tenantNm2').val(JSON.parse(obj).fmnm);
	}