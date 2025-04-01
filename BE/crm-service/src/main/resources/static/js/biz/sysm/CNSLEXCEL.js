1/***********************************************************************************************
 * Program Name : 태넌트기본정보(SYSM110T.js)
 * Creator      : bykim
 * Create Date  : 2022.01.25
 * Description  : 태넌트기본정보
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.01.25     bykim            최초작성   
 ************************************************************************************************/

function excelUploadProcess(){

//	Utils.openPop(GLOBAL.contextPath + "/cnsl/CNSL106P", "CNSL106P", 1000, 800, {tenantId : "CMA", cabackAcpnNo : 33 });
//
	var CNSLformData = new FormData($('#CNSLform1')[0]);

	$.ajax({
		url: "/bcs/sysm/SYSM100UPT99",  //bcs/xlsx/uploadExcel(4천건 미만 가능), uploadExcel2 대용량(테스트 : 22,010건 이상 ~ 100,000건 까지 테스트 이상무 )
		data: CNSLformData,
		type: "POST",
		enctype: 'multipart/form-data',
		processData: false, //필수(중요)
		contentType: false, //필수(중요)
		type: "POST",
		error: function(xhr, status, error){
			alert(error);
		},
		success : alert("완료")
	});

	// $.ajax({
	// 	url: "/bcs/sysm/SYSM100UPT97",  //bcs/xlsx/uploadExcel(4천건 미만 가능), uploadExcel2 대용량(테스트 : 22,010건 이상 ~ 100,000건 까지 테스트 이상무 )
	// 	data: CNSLformData,
	// 	type: "POST",
	// 	enctype: 'multipart/form-data',
	// 	processData: false, //필수(중요)
	// 	contentType: false, //필수(중요)
	// 	type: "POST",
	// 	error: function(xhr, status, error){
	// 		alert(error);
	// 	},
	// 	success : alert("완료")
	// });

	// $.ajax({
	// 	url: "/bcs/sysm/SYSM100UPT95",  //bcs/xlsx/uploadExcel(4천건 미만 가능), uploadExcel2 대용량(테스트 : 22,010건 이상 ~ 100,000건 까지 테스트 이상무 )
	// 	data: CNSLformData,
	// 	type: "POST",
	// 	enctype: 'multipart/form-data',
	// 	processData: false, //필수(중요)
	// 	contentType: false, //필수(중요)
	// 	type: "POST",
	// 	error: function(xhr, status, error){
	// 		alert(error);
	// 	},
	// 	success : alert("완료")
	// });

}

function excelUploadProcess_cnslHist_CMH(){

	var CNSLformData = new FormData($('#CNSLform1')[0]);
	if(confirm("상담이력을 마이그레이션합니다.\n계속하시겠습니까?")) {
		$.ajax({
			url: "/bcs/sysm/SYSM100UPT99",  //bcs/xlsx/uploadExcel(4천건 미만 가능), uploadExcel2 대용량(테스트 : 22,010건 이상 ~ 100,000건 까지 테스트 이상무 )
			data: CNSLformData,
			type: "POST",
			enctype: 'multipart/form-data',
			processData: false, //필수(중요)
			contentType: false, //필수(중요)
			type: "POST",
			error: function(xhr, status, error){
				alert(error);
			},
			success : alert("완료")
		});
	}
}

function excelUploadProcess_cnslCaback_CMH(){

	var CNSLformData = new FormData($('#CNSLform1')[0]);

	if(confirm("상담이력 및 콜백을 마이그레이션합니다.\n계속하시겠습니까?")) {
		$.ajax({
			url: "/bcs/sysm/SYSM100UPT97",  //bcs/xlsx/uploadExcel(4천건 미만 가능), uploadExcel2 대용량(테스트 : 22,010건 이상 ~ 100,000건 까지 테스트 이상무 )
			data: CNSLformData,
			type: "POST",
			enctype: 'multipart/form-data',
			processData: false, //필수(중요)
			contentType: false, //필수(중요)
			type: "POST",
			error: function(xhr, status, error){
				alert(error);
			},
			success : alert("완료")
		});
	}
}

function excelUploadProcess_caback_CMH(){

	var CNSLformData = new FormData($('#CNSLform1')[0]);

	if(confirm("콜백을 마이그레이션합니다.\n계속하시겠습니까?")) {
		$.ajax({
			url: "/bcs/sysm/SYSM100UPT93",  //bcs/xlsx/uploadExcel(4천건 미만 가능), uploadExcel2 대용량(테스트 : 22,010건 이상 ~ 100,000건 까지 테스트 이상무 )
			data: CNSLformData,
			type: "POST",
			enctype: 'multipart/form-data',
			processData: false, //필수(중요)
			contentType: false, //필수(중요)
			type: "POST",
			error: function(xhr, status, error){
				alert(error);
			},
			success : alert("완료")
		});
	}
}