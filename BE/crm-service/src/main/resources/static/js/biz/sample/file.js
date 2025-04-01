/***********************************************************************************************
 * Program Name : 파일업로드/다운로드 example(file.js)
 * Creator      : sukim
 * Create Date  : 2021.01.24
 * Description  : 파일업로드/다운로드 example
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2021.01.24     sukim            최초작성          
 ************************************************************************************************/
$(document).ready(function(){
	
	var regex       = new RegExp("(.*?)\.(xls|xlsx|ppt|pptx|doc|docx|hwp|pdf|gif|jpg|png|zip|rar)$"); //확장자
	var sizeLimit   = 20971520;  //파일 한개당 20MB 용량 제한
	var maxSizeLimit= 104857600; //파일 전체 100MB 용량 제한
    var sizeLimitCnt= 0;
    var notAdmitCnt = 0;
    var errCnt      = 0;
    var totSize     = 0;
    var formData = new FormData();
	
	function checkExt(fileNm, fileSize){
		if(fileSize >= sizeLimit){
			sizeLimitCnt++;
		}
		if(!regex.test(fileNm)){
			notAdmitCnt++;
		}
	}
	
	function mkSndData(){
		
		//jsonArray가 아닐때(단수) ::: {}만 감싼다.
		//jsonArray 일때(복수) ::: [{}]로 감싼다.
		var data = {
			    	 "tenantId"        : $('#tenantId').val(), 
			    	 "ctgrMgntNo"      : $('#ctgrMgntNo').val(),
			    	 "blthgMgntNo"     : $('#blthgMgntNo').val(),
			    	 "title"           : $('#title').val(),
			    	 "content"         : $('#content').val(),
			    	 "regrId"          : $('#regrId').val(),
			    	 "regrOrgCd"       : $('#regrOrgCd').val()
		};
		
		var inputFile = $("input[name='mFile[]']");
		var files = inputFile[0].files;

		for(var i=0; i<files.length; i++){
			totSize +=files[i].size;
			if(!checkExt(files[i].name, files[i].size)){
				errCnt++;
			}
			formData.append("mfile", files[i]);
		}
		
		/* 기본 Validation Check (필수 3개) */
		if(notAdmitCnt > 0){
			alert("허용되지 않은 파일이 존재합니다.확인 후 재시도하여 주십시오.");
			return;
		}
		
		if(sizeLimitCnt > 0){
			alert("파일 사이즈 제한(20MB)에 해당하는 파일이 존재합니다.");
			return;
		}		
		if(totSize > maxSizeLimit){
			alert("업로드 파일의 총용량은 100MB를 초과할 수 없습니다.");
			return;
		}
		formData.append('key', JSON.stringify(data));			
	}
	
	//신규등록
	$("#insertBtn").on("click", function(e){
		if (confirm("등록하시겠습니까?") == false) return;
		mkSndData();
	    $.ajax({
	    	url         : '/bcs/file/fileInsert2',  ///bcs/file/fileInsert (원본)
	        type        : 'POST',
			enctype     : 'multipart/form-data',  //필수
			data        : formData,
			cache       : false, //필수 
			contentType : false, //필수 
			processData : false, //필수 
			timeout     : 18000, //필수
	        success     : result,
	        error       : function(request,status, error){
	        	console.log("[error]");
	        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
	        }
	    }) ;
	});

	//변경
	$("#updateBtn").on("click", function(e){
		if (confirm("변경하시겠습니까?") == false) return;
		mkSndData();
	    $.ajax({
	    	url         : '/bcs/file/fileUpdate',
	        type        : 'POST',
			enctype     : 'multipart/form-data',  //필수
			data        : formData,
			cache       : false, //필수 
			contentType : false, //필수 
			processData : false, //필수 
			timeout     : 18000, //필수
	        success     : result,
	        error       : function(request,status, error){
	        	console.log("[error]");
	        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
	        }
	    }) ;
	});
	
	//삭제
	$("#deleteBtn").on("click", function(e){
		if (confirm("삭제하시겠습니까?") == false) return;
		var data = {
				"tenantId"    :$('#tenantId').val(), 
				"ctgrMgntNo"  :$('#ctgrMgntNo').val(), 
				"blthgMgntNo" :$('#blthgMgntNo').val()
		};
		Utils.ajaxCall('/file/fileDelete', JSON.stringify(data), result); 
		
	    $.ajax({
	    	url         : '/bcs/file/fileDelete', 
	        type        : 'POST',
	        dataType    : 'json',
	        contentType : 'application/json; charset=UTF-8',	        
			data        : JSON.stringify(data),
	        success     : result,
	        error       : function(request,status, error){
	        	console.log("[error]");
	        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
	        }
	    }) ;
	});		
	
	//업로드 결과
	function result(data){
		var jsonEncode = JSON.stringify(data.result);
		console.log("data.result : " + jsonEncode);
		
		var jsonEncode1 = JSON.stringify(data.msg);
		console.log("data.msg : " + jsonEncode1);
		
		document.getElementById('message').innerHTML="";
		document.getElementById('message').innerHTML=jsonEncode1;
	}

	//파일목록조회
	$('#searchFileBtn').on('click', function(e) {
		$("#fileInfo").html(""); $("#target").html("");
		var data = {
				"tenantId"    :$('#tenantId').val(), 
				"ctgrMgntNo"  :$('#ctgrMgntNo').val(), 
				"blthgMgntNo" :$('#blthgMgntNo').val()
				};	
		console.log("jsonStr ::: " + JSON.stringify(data));

	    $.ajax({
	    	url         : '/bcs/file/getFileList', 
	        type        : 'POST',
	        dataType    : 'json',
	        contentType : 'application/json; charset=UTF-8',
			data        : JSON.stringify(data),
	        success     : resultFileSearch,
	        error       : function(request,status, error){
	        	console.log("[error]");
	        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error); 
	        }
	    }) ;
	    
	});
	
	function resultFileSearch(data){
		var jsonEncode = JSON.stringify(data.result);
		console.log("data.result : " + jsonEncode);
		var obj=JSON.parse(jsonEncode);
		var jsonDecode = JSON.parse(obj);	
		console.log("-------------------------------------------------------------------------------------");
		console.log("jsonDecode : " + jsonDecode);
		
		//파일 리스트
		var target = $('#target');
		for (var i = 0; i < jsonDecode.length; i++) {
    	  	var add_data = '';
    	  	add_data += '<tr>';
    	  	add_data += '<td>';
    	  	add_data += jsonDecode[i].apndFileSeq;
    	  	add_data += '</td>';

    	  	add_data += '<td>';
    	  	add_data += jsonDecode[i].apndFileNm;
    	  	add_data += '</td>';
    	  	
    	  	add_data += '<td>';
    	  	add_data += jsonDecode[i].apndFileIdxNm;
    	  	add_data += '</td>';
    	  	
    	  	add_data += '<td>';
    	  	add_data += jsonDecode[i].apndFilePsn;
    	  	add_data += '</td>';
    	  	
    	  	add_data += '<td>';
    	  	add_data += jsonDecode[i].regDtm;
    	  	add_data += '</td>';

    	  	add_data += '<td><input type="button" id="FileDownBtn'+i+'" value="download" /></td>';
    	  	
    	  	add_data += '</tr>';
    	  	target.append(add_data);
		}

		for(var i = 0; i < jsonDecode.length; i++){
			var btnName = "FileDownBtn" + i;
			const btn = document.getElementById(btnName);//download button
			btn.addEventListener('click', download, false );	
		}
		const btn = document.getElementById("fileDownALlBtn");//downloadAll button
		btn.addEventListener('click', downloadAll, false );	
		console.log("================= 리스트 생성 완료 === ");
		
		var message = JSON.stringify(data.msg);
		console.log("data.msg : " + message);
		document.getElementById('message').innerHTML="";
		document.getElementById('message').innerHTML=message;
	}
	
	//파일 개별 다운로드
	function download(){
		alert("=== download 버튼 클릭 ===");
		$("#fileInfo").html("");
		var rowData = ""
		var tdArray = new Array();
		var FileDownBtn = $(this);
		
		var tr = FileDownBtn.parent().parent();
		var td = tr.children();
		
		var fileSeqNo        = td.eq(0).text();  //파일순번
		var originalFineName = td.eq(1).text();  //원본파일명
		var savedFileName    = td.eq(2).text();  //업로드될 파일명
		var saveFilePath     = td.eq(3).text();  //업로드경로
		
		//다운로드받을 파일 정보를 배열에 담음
		td.each(function(i){	
			tdArray.push(td.eq(i).text());
		});

		rowData +=	"************************* select Row의 File Information ************************* <br/>" + 
		"  fileSeqNo.       : <font color='red'>" + fileSeqNo        + "</font> <br/>" +
		"  originalFineName : <font color='red'>" + originalFineName + "</font> <br/>" +
		"  savedFileName    : <font color='red'>" + savedFileName    + "</font> <br/>" +
		"  saveFilePath     : <font color='red'>" + saveFilePath     + "</font> <br/>"
		;		
		
		$("#fileInfo").html(rowData);
		
		//다운로드 요청
		window.location.href="/bcs/file/download?urlPath="+saveFilePath+"&fileName="+ savedFileName;
	 }
	
	
	//파일 전체 다운로드
	function downloadAll(){
		alert("=== downloadAll 버튼 클릭 ===");
		var rowData = "";
		var rows = document.getElementById("target").getElementsByTagName("tr");
		
		var iframeCnt =0;
	    for( var i=0; i<rows.length; i++ ){
	      var COL = rows[i].getElementsByTagName("td");
	      var COL1 = COL[0].firstChild.data;	
	      var COL2 = COL[1].firstChild.data;	
	      var COL3 = COL[2].firstChild.data;	
	      var COL4 = COL[3].firstChild.data;
	      
	      //다운로드 요청
	      window.location.href="/bcs/file/download?urlPath="+COL4+"&fileName="+ COL3;
		  iframeCnt++;
		  fnSleep(1000);
		  
	      rowData +=	"*************************  "+ (i+1) +"번째 Row의 File Information ************************* <br/>"+  
		  "   fileSeqNo.       : <font color='red'>" + COL1 + "</font> <br/>" +
		  "   originalFineName : <font color='red'>" + COL2 + "</font> <br/>" +
		  "   savedFileName    : <font color='red'>" + COL3 + "</font> <br/>" +
		  "   saveFilePath     : <font color='red'>" + COL4 + "</font> <br/>" 
		  ;	
	
		  $("#fileInfo").html(" ***** 전체 : " + rowData );
		  if(iframeCnt == rows.length){
			  console.log("download completed~");
			  alert("download completed~");
		  }
	    }
	}	
	
	function fnSleep(delay){
		var start = new Date().getTime();
		while (start + delay > new Date().getTime());
	}
	
	
	function fn_newFileDown(){
		
	}
	
	
});	