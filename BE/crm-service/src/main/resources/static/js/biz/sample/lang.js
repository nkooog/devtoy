/***********************************************************************************************
* Program Name : 다국어 테스트 예시(lang.jsp)
* Creator      : sukim
* Create Date  : 2022.03.19
* Description  : 다국어 테스트 예시(HashMap에서 필요한 메세지를 꺼내 사용하는 예시)
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.03.17     sukim            최초생성
************************************************************************************************/
$('#btn10').on('click', function test() {

	//아래의 예시와 같이 호출하여 쓴다.
	
	//confirm 메시지
	console.log(map.get("common.save.msg"));
	console.log(map.get("common.regist.msg"));
	console.log(map.get("common.delete.msg"));
	console.log(map.get("common.update.msg"));
	
	//유효성 체크
	console.log(map.get("emp.form.empno") + map.get("common.required.msg"));
	
	//메시지 출력
	console.log(map.get("fail.common.msg"));
	console.log(map.get("info.nodata.msg"));
	console.log(map.get("success.common.select"));
	console.log(map.get("success.common.insert"));
	console.log(map.get("success.common.update"));
	console.log(map.get("success.common.delete"));
	
	//화면 항목 체크
	console.log(map.get("emp.form.empno"));
	console.log(map.get("emp.form.ename"));
	console.log(map.get("emp.form.job"));
	console.log(map.get("emp.form.mgr"));
	console.log(map.get("emp.form.hiredate"));
	console.log(map.get("emp.form.sal"));
	console.log(map.get("emp.form.comm"));
	console.log(map.get("emp.form.deptno"));
	console.log(map.get("emp.form.passwd"));
	
    //활용
	if (confirm(map.get("common.regist.msg")) == false) return;	
});