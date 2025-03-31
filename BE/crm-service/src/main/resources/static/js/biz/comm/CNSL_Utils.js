var CNSL_Utils = (function() {
	/**
	 * custId 변경시 호출되어야할 함수 리스트
	 */
	const functionCustIdList = [];
	/**
	 * 소프트폰 인바운드 번호로 실행되어야할 고객정보 조회 함수 리스트
	 */
	const functionCustIdSoftPhone = [];
	/**
	 * 소프트폰 통화 연결시 호출되어야 할 함수 리스트
	 */
	const functionSoftPhoneConnected = [];
	/**
	 * 소프트폰 통화 종료시 호출되어야 할 함수 리스트
	 */
	const functionSoftPhoneDisconnect = [];
	/**
	 * 관련함수 getter setter
	 */
	return{
		getfunctionCustIdList : function(){
			return functionCustIdList;
		},
		setfunctionCustIdList : function(functionObj){
			for ( var i=0; i<functionCustIdList.length; i++ ) {
				if (functionCustIdList[i].toString() == functionObj.toString()){
					return false;
				}
			}
			functionCustIdList.push(functionObj);
		},
		getfunctionCustIdSoftPhone : function(){
			return functionCustIdSoftPhone;
		},
		setfunctionCustIdSoftPhone : function(functionObj){
			for ( var i=0; i<functionCustIdSoftPhone.length; i++ ) {
				if (functionCustIdSoftPhone[i].toString() == functionObj.toString()){
					return false;
				}
			}
			functionCustIdSoftPhone.push(functionObj);
		},
		getfunctionSoftPhoneConnected : function(){
			return functionSoftPhoneConnected;
		},
		setfunctionSoftPhoneConnected : function(functionObj){
			functionSoftPhoneConnected.push(functionObj);
		},
		getfunctionSoftPhoneDisconnect : function(){
			return functionSoftPhoneDisconnect;
		},
		setfunctionSoftPhoneDisconnect : function(functionObj){
			functionSoftPhoneDisconnect.push(functionObj);
		},
		callHistoryClickListener_f3 : function(){
			let f3_tabStrip = $("[id$='_F3_menu'], [id$='_F3_tab']").data("kendoTabStrip")	// 3번째화면은 탭 또는 메뉴로 이루어져있음
			let f3_tabSelector = f3_tabStrip.select()	//3번째 화면 활성화 탭 선택
			let dataContentUrl = f3_tabSelector.find('.k-link').attr("data-content-url")	//활성화 된 탭의 url 가져오기
			let frameId = dataContentUrl.substring(dataContentUrl.lastIndexOf("/") + 1);	//url에서 frameId 추출

			Utils.customInterval('custId' ,1000, 'f3')	//custId가 존재할 때까지 1초마다 체크
				.then((res)=>{//만약 res == null 이면 찾지 못했다는 것임
					if(window[frameId + "_initSearch"]){ //해당 frameId의 init 함수가 존재하면 실행
						window[frameId + "_initSearch"]()
					}else{
						//init 함수가 없을 경우 활성화 탭
						$("#"+f3_tabSelector[0].id).click()
					}
				}).finally(()=>{
					f3_isRunning = false
				});
		}
	}
})();