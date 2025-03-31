/***********************************************************************************************
 * Program Name : 공통 크로스에디터 example(crossEditorSample.js)
 * Creator      : djjung
 * Create Date  : 2022.02.10
 * Description  : 공통 크로스에디터 example
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.02.10     djjung           최초작성    
 ************************************************************************************************/
var crossEditorSample_editor1//,crossEditorSample_editor2,crossEditorSample_editor3; //이벤트 사용시 선언
$(document).ready(function () {

	// 한줄용 
	crossEditorSample_editor1 = cEditor.Creater("editor1",800,600,2, test);

	//두줄용
	// crossEditorSample_editor2 =  cEditor.Creater("editor2",800,600,2,test1);

	// crossEditorSample_editor3 =  cEditor.Creater("editor3",500,300,3,test2);
});
function test(obj){
	console.log(obj);
	var newFormData = new FormData();   //Object정보를 담을 새로운 formData

	Object.keys(obj.dataObj).forEach(function(key){
		newFormData.append(key, obj.dataObj[key]); //Object정보를 formData에 설정
		console.log(key);
		console.log(obj.dataObj[key]);
	});

	obj.complete("OK");
}