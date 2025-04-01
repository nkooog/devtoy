/***********************************************************************************************
* Program Name : 메인프레임(FRME100M.js)
* Creator      : jrlee
* Create Date  : 2022.02.10
* Description  : 메인프레임
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.10     jrlee            최초작성
************************************************************************************************/
const MAINFRAME = (function() {
	const REQ_PATH = {
		MENU_ATHT_SEL: "/frme/FRME290SEL01",
		MENU_SEL: "/frme/FRME100SEL01",
		NOTI_SEL: "/frme/FRME100SEL02",
		AUTH_SEL: "/frme/FRME100SEL03",
		FAVR_SEL: "/frme/FRME150SEL01",
		FAVR_INS: "/frme/FRME150INS01",
		FAVR_DEL: "/frme/FRME150DEL01",
		ENVR_SEL: "/frme/FRME160SEL01",
		ALRM_SEL: "/frme/FRME170SEL01",
		RESV_SEL: "/frme/FRME240SEL02",
		CBCK_SEL: "/frme/FRME230SEL02"
	}

	let DataFrameInfo = (function () {
		let favrList = [];
		let btnAuthList = [];

		return {
			getBasicInfo: function (type) {
				let basicInfo = {
					menuNm: String(),
					id: String(),
					path: String()
				}

				switch ($.trim(type)) { // TODO : 인수인계 : 개발완료 후 불필요한 부분 삭제
					// case "popSample":
					// 	basicInfo.menuNm = "공통팝업 샘플";
					// 	basicInfo.id = "popSample";
					// 	basicInfo.path = "/sample/commonPopupSample.jsp";
					// 	break;
					// case "design":
					// 	basicInfo.menuNm = "퍼블리싱(미개발 전체 포함)";
					// 	basicInfo.id = "design";
					// 	basicInfo.path = "/sample/design.jsp";
					// 	break;
					// case "btnAuth":
					// 	basicInfo.menuNm = "버튼권한체크 개발 가이드";
					// 	basicInfo.id = "btnAuth";
					// 	basicInfo.path = "/sample/btnAuthGuide.jsp";
					// 	break;
					case "direct":
						basicInfo.menuNm = "개발접근";
						basicInfo.id = "direct";
						basicInfo.path = Utils.getUrlParam("target");
						break;
					default:
						basicInfo.menuNm = MAINFRAME_langMap.get("FRME100M.getBasicInfo.default");
						basicInfo.id = "DASH100M";
						basicInfo.path = "/dash/DASH100M";
						break;
				}

				return basicInfo
			},
			getTargetPath: function (_path) {
				return GLOBAL.contextPath + _path
			},
			getFavrList: function () {
				return favrList;
			},
			setFavrList: function (_favrList) {
				favrList = _favrList;
			},
			getBtnAuthList: function () {
				return btnAuthList;
			},
			setBtnAuthList: function (_btnAuthList) {
				btnAuthList = _btnAuthList;
			}
		}
	})();

	//상단 프레임 알람 관련 스케줄러
	let AlarmInfo = (function () {
		let intervalInstance = null;
		let defaultInterval = 10000;
		let minInterval = 5000;

		return {
			alarmCheckRequest: function () {
				let bsVl24 = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 24)?.bsVl1; // 기준정보(24) : 받은쪽지함 조회일수

				/**
				 * FRME170P 요청 파라메터와 일치해야함
				 */
				Utils.ajaxCall(REQ_PATH.ALRM_SEL, JSON.stringify({
					tenantId: GLOBAL.session.user.tenantId,
					usrId: GLOBAL.session.user.usrId,
					orgCd : GLOBAL.session.user.orgCd,
					usrGrdCd :GLOBAL.session.user.usrGrd,
					rsvDd: kendo.toString(new Date(), "yyyyMMdd"),
					srtSeq: Utils.isNotNull(bsVl24) ? bsVl24 : 1
				}), function (result) {
					let totalCnt = 
						Number(result.communityCnt)				//kw---게시글
						+ Number(result.communityTubcCnt)		//kw---게시글 승인
//						+ Number(result.knowledgeCnt)			//kw---지식
						+ Number(result.knowledgeTubcCnt)		//kw---지식 승인
						+ Number(result.reservationCnt) 		//kw---통화예약
						+ Number(result.noteCnt) 				//kw---쪽지
						+ Number(result.bizTrclCnt) 			//kw---업무이관
						+ Number(result.cabackCnt) 				//kw---콜백
						+ Number(result.calAlrmCnt)
						;

					if (totalCnt > 0) {
						if (!$("#FRME_MENU_SYSTEM_alrm").hasClass("Active")) {
							$("#FRME_MENU_SYSTEM_alrm").addClass("Active");
						}
					} else {
						$("#FRME_MENU_SYSTEM_alrm").removeClass("Active");
					}
				});
			},
			setAlarmCheckInterval: function () {
				let alrmReptTmObject = Utils.getObjectFromList(GLOBAL.bascVlu.list, "bsVlMgntNo", 25); // 기준정보(25) : 알람 Interval Time
				let intervalTime = defaultInterval;

				if (!$.isEmptyObject(alrmReptTmObject)) {
					if (Utils.isNotNull(alrmReptTmObject.bsVl1)) {
						intervalTime = Number(alrmReptTmObject.bsVl1) * 1000;
					}
				}

				intervalTime = intervalTime < minInterval ? minInterval : intervalTime;

				AlarmInfo.clearAlarmCheckInterval();
				intervalInstance = setInterval(function () {
					AlarmInfo.alarmCheckRequest();
				}, intervalTime);
			},
			clearAlarmCheckInterval: function () {
				clearInterval(intervalInstance);
			}
		}
	})();

	//하단 프레임 흘러가는 글 관련 스케줄러
	let NotiInfo = (function () {
		let intervalInstance = null;
		let intervalTime = 60000 * 60;
		let defaultText = "<p class='marquee_items'>"+ MAINFRAME_langMap.get('FRME100M.NotiInfo.default')+"</p>";
		let alertStyle = " style='color:blue; font-weight: bold;'";
		let notiList = [];
		let footerMarqueeInstance;

		return {
			request: function (callback) {
				Utils.ajaxCall(REQ_PATH.NOTI_SEL, JSON.stringify({
					tenantId: GLOBAL.session.user.tenantId
				}), function (result) {
					notiList = JSON.parse(result.list);

					if (typeof callback === "function") {
						callback();
					}
				}, null, null, function () {
					footerMarqueeInstance = $("#FRME_BOTTOM_oprNoti").html(defaultText).marquee({speed: 100});
				});
			},
			init: function() {
				NotiInfo.request(function () {
					NotiInfo.append();
					NotiInfo.setNotiRequestInterval();
				});

				$('#FRME_BOTTOM_toggleMarquee.btMarquee').off('click').on('click', function () {
					if ($(this).hasClass('Stop'))
						$(this).removeClass('Stop'), $(this).attr('title', MAINFRAME_langMap.get('FRME100M.NotiInfo.stop')), footerMarqueeInstance.marquee('toggle');
					else
						$(this).addClass('Stop'), $(this).attr('title', MAINFRAME_langMap.get('FRME100M.NotiInfo.start')), footerMarqueeInstance.marquee('toggle');
				});
			},
			append: function() {
				let notiText = "";
				let now = new Date().getTime();

				for (let noti of notiList) {
					if (new Date(noti.notiStrDtm).getTime() <= now && now <= new Date(noti.notiEndDtm).getTime())
						notiText += "<p class='marquee_items'><em" + (noti.notiDvCd == "1" ? alertStyle : "") + ">[" + noti.notiTite + "] : " + noti.notiCtt + "</em></p>";
				}

				$("#FRME_BOTTOM_oprNoti").html(Utils.isNotNull(notiText) ? notiText : defaultText);

				footerMarqueeInstance = $('#FRME_BOTTOM_oprNoti.footerMarquee').marquee({
					speed: 100,
					gap: 0,
					delayBeforeStart: 0,
					duplicated: false,
					// pauseOnHover: true,
				}).bind('finished', function () {
					$('#FRME_BOTTOM_toggleMarquee.btMarquee').hide();
					footerMarqueeInstance.marquee('destroy');
					NotiInfo.append();
				});

				$('#FRME_BOTTOM_toggleMarquee.btMarquee').show();
			},
			setNotiRequestInterval: function () {
				NotiInfo.clearNotiRequestInterval();
				intervalInstance = setInterval(function () {
					NotiInfo.request();
				}, intervalTime);
			},
			clearNotiRequestInterval: function () {
				clearInterval(intervalInstance);
			}
		}
	})();

	//노티알림 팝업 스케줄러 (콜백,통화예약)
	let NotiPopUpInfo = ( function(){
		let intervalInstance = null;

		//TODO : 알림창 최소시간 하드코딩 추후 변경 필요
		//공통
		const minInterval = 5000; //5초       (최소 쓰레드 시간)
		const defaultInterval = 30000; //30초 (기본 쓰레드 시간)
		const defaultHidAferTime = 5000; //5초(기본 창 종료 시간)
		//통화 예약
		const defualtBeforAlarm = 10; //기준 정보 미설정시 min (기본 10분전)
		//알림창 종류
		const notiKind = {INFO:"ad_info",	NOTI:"ad_notice",WARNNING:"ad_warn",SUCCESS:"ad_success"}
		const notiCallKind = {RSV:"rsv",	CBACK:"cback"}
		
		return {
			setAlarmCheckInterval: function () {
				let alrmReptTmObject = Utils.getObjectFromList(GLOBAL.bascVlu.list, "bsVlMgntNo", 25); // 기준정보(25) : 알람 Interval Time
				let intervalTime = defaultInterval;

				if (!$.isEmptyObject(alrmReptTmObject)) {
					if (Utils.isNotNull(alrmReptTmObject.bsVl1)) {
						intervalTime = Number(alrmReptTmObject.bsVl1) * 1000;
					}
				}
				intervalTime = intervalTime < minInterval ? minInterval : intervalTime;

				NotiPopUpInfo.clearAlarmCheckInterval();
				intervalInstance = setInterval(function () {NotiPopUpInfo.notiRequest();}, intervalTime);
			},
			clearAlarmCheckInterval: function () {
				clearInterval(intervalInstance);
			},
			notiWindowInit :  function() {
				$("#notification").kendoNotification({
					position: {	bottom: 43,	right: 44 },
					hideOnClick: false, 					//눌러서 끄기 방지
					autoHideAfter: defaultHidAferTime, 		//알람 사라지는 시간
					stacking: "up", 						//알람 싸이는 방향
					templates:[{
						type: "noti_comm",template:
							"<div class=\"new-mail #=type#\" id=\"notitemplate\" data-item-id='#=id#' onclick=\"MAINFRAME.clickNotiWindow('#=id#','#=call#');\">\n" +
							"<h3>#=title#</h3>\n" +
							"<p>#=message#</p>\n" +
							"<input id='param#=id#'  type='hidden' value='#=param#'/>\n" +
							"</div>\n" +
							"<div class=\"de\"><span data-type=\"remove\" onclick=\"MAINFRAME.closeNotiWindow('#=id#');\"><span class=\"k-icon k-i-x\"></span></span></div>"
					}]
				}).data("kendoNotification");
			},
			notiWindowShow : function (idx,title,message,type,callback,params){
				$("#notification").data("kendoNotification").show({
					id:idx,
					title: title,
					message: message,
					param :  params,
					type : type,
					call : callback,
				}, "noti_comm");
			},
			notiWindowClick : function (idx,callback){
				if(callback == notiCallKind.RSV){
					NotiPopUpInfo.clickRsvNoti(idx);
				}else if(callback == notiCallKind.CBACK){
					NotiPopUpInfo.clickCbackNoti(idx);
				}
			},
			notiWindowClose : function (idx){
				let elements = $("#notification").data("kendoNotification").getNotifications();
				elements.each(function(index,item){
					if(item.firstChild.attributes['data-item-id'].value == idx){
						$(this).parent().remove();
					}
				});
			},
			notiRequest : function(){
				NotiPopUpInfo.rsvRequest();
				NotiPopUpInfo.cbackRequest();
			},
			// 통화예약 알림창 호출
			rsvRequest: function () {
				let bsVl21 = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 21)?.bsVl1; // 기준정보(21) : 통화예약 알림시간
				Utils.ajaxCall(REQ_PATH.RESV_SEL, JSON.stringify({	tenantId: GLOBAL.session.user.tenantId,usrId: GLOBAL.session.user.usrId}),
					function (result) {
						let timeAlarm = new Date();
						timeAlarm.setMinutes(timeAlarm.getMinutes() + (Utils.isNull(bsVl21) ? defualtBeforAlarm : bsVl21*1)); // number 형 변환필요
						let alrmtime = timeAlarm.getHours().toString().padStart(2, '0') + timeAlarm.getMinutes().toString().padStart(2, '0');
						let list = JSON.parse(result.list);
						if(result.count>0){
							for(let item of list){
								let idx =$("#notification").data("kendoNotification").getNotifications().length;
								let timeNow = new Date();
								let now = timeNow.getHours().toString().padStart(2, '0') + timeNow.getMinutes().toString().padStart(2, '0');
								let rsvtime = item.rsvHour+item.rsvPt;
								if(rsvtime <= alrmtime){
									let title = MAINFRAME_langMap.get("FRME100M.NotiPopUpInfo.title");
									let message = MAINFRAME_langMap.get("FRME100M.NotiPopUpInfo.message.before");
									let type = notiKind.INFO;
									let param = JSON.stringify({unfyCntcHistNo : item.unfyCntcHistNo, telCnslHistSeq:item.telCnslHistSeq});
									if(rsvtime >= now){
										timeNow.setHours(item.rsvHour-timeNow.getHours());
										timeNow.setMinutes(item.rsvPt-timeNow.getMinutes());
									}else{
										timeNow.setHours(timeNow.getHours()-item.rsvHour);
										timeNow.setMinutes(timeNow.getMinutes()-item.rsvPt);
										message=MAINFRAME_langMap.get("FRME100M.NotiPopUpInfo.message.after");
										type = notiKind.NOTI;
									}
									NotiPopUpInfo.notiWindowShow(idx,item.cntcTelNo+", "+title,
										MAINFRAME_langMap.get("FRME100M.NotiPopUpInfo.call.reservation")+" "+ (timeNow.getHours()*60+timeNow.getMinutes()).toString()+message,type,notiCallKind.RSV,param);
								}
							}
						}
				});
			},
			// 통화예약 알림창 클릭
			clickRsvNoti :function(idx){ //알림창 클릭 이벤트
				let elements = $("#notification").data("kendoNotification").getNotifications();
				elements.each(function(index,item){
						if(item.firstChild.attributes['data-item-id'].value == idx){
						//update
						let param = JSON.parse($("#param"+index).val());
						let data = {
							tenantId: GLOBAL.session.user.tenantId,
							unfyCntcHistNo: param.unfyCntcHistNo,
							telCnslHistSeq: param.telCnslHistSeq,
							usrId: GLOBAL.session.user.usrId,
							usrOrgCd: GLOBAL.session.user.orgCd
						}
						$(this).parent().remove();
						Utils.ajaxCall('/frme/FRME240UPT01', JSON.stringify(data), function (result) {
							if(result.result>0){
								Utils.openPop(GLOBAL.contextPath + "/frme/FRME240P", "FRME240P", 1000, 575);
							}
						},null,null,null);
					}
				});
			},
			// 콜백 알림창 호출
			cbackRequest : function (){
				Utils.ajaxCall(REQ_PATH.CBCK_SEL, JSON.stringify({	tenantId: GLOBAL.session.user.tenantId,usrId: GLOBAL.session.user.usrId,}),
					function (result) {
						let list = JSON.parse(result.list);
						if(result.count>0){
							for(let item of list){
								let idx =$("#notification").data("kendoNotification").getNotifications().length;
								let param = JSON.stringify({cabackAcpnNo : item.cabackAcpnNo,});
								NotiPopUpInfo.notiWindowShow(idx,MAINFRAME_langMap.get('FRME100M.NotiPopUpInfo.callback.title'),
									item.cabackReqTelno+MAINFRAME_langMap.get('FRME100M.NotiPopUpInfo.callback.after'),notiKind.INFO,notiCallKind.CBACK,param);
							}
						}
					});
			},
			// 콜백 알림창 클릭
			clickCbackNoti :function(idx){ //알림창 클릭 이벤트
				let elements = $("#notification").data("kendoNotification").getNotifications();
				elements.each(function(index,item){
					if(item.firstChild.attributes['data-item-id'].value == idx){
				// 		//update
						let param = JSON.parse($("#param"+index).val());
						let data = {
							tenantId: GLOBAL.session.user.tenantId,
							cabackAcpnNo : param.cabackAcpnNo,
							usrId: GLOBAL.session.user.usrId,
							usrOrgCd: GLOBAL.session.user.orgCd
						}
						$(this).parent().remove();
						Utils.ajaxCall('/frme/FRME230UPT02', JSON.stringify(data), function (result) {
							if(result.result>0){
								Utils.openPop(GLOBAL.contextPath + "/frme/FRME230P", "FRME230P", 1600, 575);
							}
						},null,null,null);
					}
				});
			}
		}
	})();

	//kw---20250318 : 실시간 쪽지 체크
	let realTimeNoteCheck = (function(){
		let intervalInstance = null;
		let defaultInterval = 1000 * 60;
		let minInterval = 5000;
		let recvNoteStCd = '1';	//(1) : 수신, (2) : 열람, (3) : 보관, (4) : 삭제
		return (
			{
				realTimeNotePopOpen : function (){
					
					let noteToday = new Date();
					let noteYear = noteToday.getFullYear();
					let noteMonth = String(noteToday.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
					let noteDay = String(noteToday.getDate()).padStart(2, '0');
				
					let noteEndDate = new Date();
					noteEndDate.setDate(noteToday.getDate() - 7);
					let noteEndYear = noteEndDate.getFullYear();
					let noteEndMonth = String(noteEndDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
					let noteEndDay = String(noteEndDate.getDate()).padStart(2, '0');
					
					let objParam = {
						tenantId 		: GLOBAL.session.user.tenantId,
						recvrId			: GLOBAL.session.user.usrId,
						recvNoteStCd	: "1",
						startDate		: noteYear + "-" + noteMonth + "-" + noteDay,
						endDate			: noteEndYear + "-" + noteEndMonth + "-" + noteEndDay,
					}
					
					var CMMT500_jsonStr = JSON.stringify(objParam);
					
					Utils.ajaxCall("/cmmt/CMMT500SEL14", CMMT500_jsonStr, function(result){
						
						let resultJson = JSON.parse(result.CMMT500SEL14);
						
						if(resultJson.length >= 1){
							let param = {
								tenantId: GLOBAL.session.user.tenantId,
								recvrId: GLOBAL.session.user.usrId,
								recvrOrgCd: GLOBAL.session.user.orgCd,
								noteNo: resultJson[0].noteNo,
								recvNoteStCd: "2"
							}
							
							Utils.openPop(GLOBAL.contextPath + "/cmmt/CMMT550P", "CMMT550P" + resultJson[0].noteNo, 1000, 660, param);
							//읽음 처리
			                
			
							Utils.ajaxCall("/cmmt/CMMT500UPT02",JSON.stringify(param), function(){
								
								if(typeof CARD001S_arrGrid !== 'undefined'){
									if(CARD001S_arrGridNm[0].includes("CMMT500SEL11")){
										CARD001S_arrGrid[0].dataSource.read();	
									}	
								}
									
							});

							
						}

					});
				},
				setRealTimeNoteCheckInterval : function (){
					let alrmReptTmObject = Utils.getObjectFromList(GLOBAL.bascVlu.list, "bsVlMgntNo", 25); // 기준정보(25) : 알람 Interval Time
					let intervalTime = defaultInterval;
					
					if (!$.isEmptyObject(alrmReptTmObject)) {
						if (Utils.isNotNull(alrmReptTmObject.bsVl1)) {
							intervalTime = Number(alrmReptTmObject.bsVl1) * 1000;
						}
					}
					intervalTime = intervalTime < minInterval ? minInterval : intervalTime;
					
					intervalTime = 10000;
					
					realTimeNoteCheck.clearRealTimeNoteCheckInterval();
	
					intervalInstance = setInterval(function () {
						realTimeNoteCheck.realTimeNotePopOpen();	//1분마다 보여줌
					}, intervalTime);
				},
				clearRealTimeNoteCheckInterval: function (){
					clearInterval(intervalInstance);
				}
			}
		)
	})();

	let dsblNotiInfo = (function () {
		let intervalInstance = null;
		let defaultInterval = 1000 * 60;
		let minInterval = 5000;
		let beforeOprNotiNo	= ''
		return (
			{
				dsblNotiPop : function (tenantId,notiDvCd){
					var param = {
						tenantId : tenantId,
						notiDvCd : notiDvCd
					}
					dsblNotiCookie = Utils.getCookieJsontoArr("dsblNoti");
					Utils.ajaxCall('/sysm/SYSM550SEL02', JSON.stringify(param), function(result){
						var list = JSON.parse(result.list)
						if(list.length > 0){
							var obj = list[0];

							for(let i=0; i<dsblNotiCookie.length; i++){
								if(parseInt(dsblNotiCookie[i]) === obj.oprNotiNo){
									return;
								}
							}

							if(beforeOprNotiNo != obj.oprNotiNo){
								Utils.openKendoWindow("/cmmn/CMMN100SEL", 700, 650, "center", "calc(50% - 600px)", 100, false, {
									  noti_tite: obj.notiTite
									, noti_ctt : obj.notiCtt
									, noti_dv_nm : obj.notiDvNm
									, noti_str_dtm : Utils.formatTimeTamp(obj.notiStrDtm)
									, noti_end_dtm : Utils.formatTimeTamp(obj.notiEndDtm)
									, oprNotiNo : obj.oprNotiNo
								});
								// Utils.openKendoWindow_notRefresh("/cmmn/CMMN_DSBL_NOTI_POP.jsp", 700, 650, "center", "calc(50% - 600px)", 100, '', {noti_tite: obj.notiTite ,noti_ctt : obj.notiCtt ,noti_dv_nm : obj.notiDvNm ,noti_str_dtm : Utils.formatTimeTamp(obj.notiStrDtm) , noti_end_dtm : Utils.formatTimeTamp(obj.notiEndDtm) , oprNotiNo : obj.oprNotiNo});
								beforeOprNotiNo = obj.oprNotiNo;
							}
						}
					});

				},
				setDsblNotiPopInterval: function () {
					let intervalTime = defaultInterval;
					intervalTime = intervalTime < minInterval ? minInterval : intervalTime;

					dsblNotiInfo.dsblNotiPop(GLOBAL.session.user.tenantId,"1");	//화면 들어오자마자 한번 보여줌.

					//shpark---20240827 : 알림 인터벌 삭제 코드 수정
					dsblNotiInfo.clearDsblNotiPopInterval();

					intervalInstance = setInterval(function () {
						dsblNotiInfo.dsblNotiPop(GLOBAL.session.user.tenantId,"1");	//1분마다 보여줌
					}, intervalTime);
				},
				clearDsblNotiPopInterval: function () {
					clearInterval(intervalInstance);
				}
			}
		)
	})();

	function fnSessionCheck(callback) {
		Utils.ajaxSyncCall("/frme/sessionCheck", null, function(sessionCheck) { //시점 문제로 Call-> SyncCall 변경 23.01.09 JDJ
			if (sessionCheck.result) {
				if (typeof callback === "function") {
					callback(sessionCheck);
				}
			} else {
				Utils.alert(MAINFRAME_langMap.get("errors.session.expired"), function () {
					location.href = GLOBAL.contextPath + "/lgin/login";
				});
			}
		});
	}

	function fnDataFrameCheck(url, callback) {
		$.ajax({
			url: url,
			type: "HEAD",
			success: function () {
				if (typeof callback === "function") {
					callback();
				}
			},
			error: function () {
				Utils.alert(MAINFRAME_langMap.get("FRME100M.DataFrameCheck.error.alert")); //데이터프레임 로드중 문제가 발생했습니다.
			}
		});
	}

	function fnInitMainFrame() {
		fnInitMenu();
		fnInitOprNoti();
		fnInitEnvironment();
		fnInitFavrList(function () {
			fnInitBtnAuthList(function () {
				fnInitDataFrame();
			});
		});
		fnKeyRestrict();
		NotiPopUpInfo.notiWindowInit();
	}

	function fnInitDataFrame() {
		let loadList = [];

		// 초기 로드시 고정 탭 정의 (정의 순서대로 탭 노출)
		// loadList.push(DataFrameInfo.getBasicInfo("popSample"));
		loadList.push(DataFrameInfo.getBasicInfo());

		if (Utils.isNotNull(Utils.getUrlParam("target")))
			loadList.push(DataFrameInfo.getBasicInfo("direct"));
		if (Utils.isNotNull(Utils.getUrlParam("design")))
			loadList.push(DataFrameInfo.getBasicInfo("design"));

		fnDataFrameLoad(loadList.shift(), loadList);
	}

	function fnDataFrameLoad(param, loadList) {
		fnSessionCheck(function () {
			let dfInfo = {};

			if (!$.isEmptyObject(param)) {
				dfInfo.menuNm = param.menuNm;
				dfInfo.id = param.id;
				dfInfo.path = param.path;
				dfInfo.param = param.param;
			} else {
				dfInfo = DataFrameInfo.getBasicInfo();
			}

			fnDataFrameCheck(DataFrameInfo.getTargetPath(dfInfo.path), function () {
				let params = $.param($.extend({
					lang: $.trim(GLOBAL.session.user.mlingCd),
					dataframeId: dfInfo.id
				}, dfInfo.param));
				let url = DataFrameInfo.getTargetPath(dfInfo.path) + "?" + params;

				addTab(dfInfo.menuNm, dfInfo.id, url); // (메뉴명, id, url)

				if (Array.isArray(loadList) && loadList.length > 0) {
					fnDataFrameLoad(loadList.shift(), loadList);
				}

				//-- menu close action
				$(".btn_menu_open").removeClass('on');
				$(".sideL_wrap").removeClass('on');
				$(".nav_list > li > a").removeClass('on');
				$(".nav_list > li > div.sub_2depth > ul > li > a").removeClass('on');
				$(".nav_list > li .sub_3depth").hide();
				$(".nav_list > li > .sub_2depth").hide();
				//--// menu close action
			});
		});
	}

	function fnReloadFrame(e) {


		$("div[reload-id='" + activateTabId + "'][reload-include='true']").parent().remove();

		Utils.closeAllKendoPopup();
		fnCancelKeyEvent(e);
		fnSessionCheck(function () {
			fnReloadOpenTab();
		});
	}

	function fnCancelKeyEvent(e){
		if (e) {
			e.preventDefault();
		} else {
			event.keyCode = 0;
			event.cancelBubble = true;
			event.returnValue = false;
		}
	}

	function fnKeyRestrict() {
		/**
		 * 제한되는 키 목록
		 * 116: F5
		 * 123: F12
		 */
		$(document).off("keydown").on("keydown", function (e) {
			let key = (e) ? e.keyCode : event.keyCode;
			let t = document.activeElement;
			let restrictKeyArr = [116];

			if (!GLOBAL.debug) {
				// 제한되어야 하는 키 추가
				restrictKeyArr.push(123);
			}

			if (restrictKeyArr.indexOf(key) > -1) {
				if (key == 116 && GLOBAL.debug) { // F5 & 디버그 모드시
					fnReloadFrame(e);
				} else {
					fnCancelKeyEvent(e);
				}
			}
		});

		// contextmenu 제한 (디버그 모드 오프시)
		if (!GLOBAL.debug) {
			$(document).on("contextmenu dragstart selectstart", function (e) {
				return false;
			});
		}
	}

	function fnInitBtnAuthList(callback) {
		Utils.ajaxCall(REQ_PATH.AUTH_SEL, JSON.stringify({
			tenantId: GLOBAL.session.user.tenantId,
			usrGrd: GLOBAL.session.user.usrGrd
		}), function (data) {
			DataFrameInfo.setBtnAuthList(JSON.parse(data.list));

			if (typeof callback === "function") {
				callback();
			}
		});
	}

	function fnInitFavrList(callback) {
		Utils.ajaxCall(REQ_PATH.FAVR_SEL, JSON.stringify({
			tenantId: GLOBAL.session.user.tenantId,
			usrId: GLOBAL.session.user.usrId,
			mlingCd: GLOBAL.session.user.mlingCd
		}), function (data) {
			DataFrameInfo.setFavrList(JSON.parse(data.FRME150P));
			fnChkAllFavrList();

			if (typeof callback === "function") {
				callback();
			}
		});
	}

	function fnChkIsFavrList(_id) {
		let favrList = DataFrameInfo.getFavrList();
		let favrObject = Utils.getObjectFromList(favrList, "dataFrmId", _id);

		return !$.isEmptyObject(favrObject);
	}

	function fnChkAllFavrList() {
		$("div.k-tabstrip-content.k-content input[name=favorite]").each(function () {
			$(this).prop("checked", fnChkIsFavrList($(this).data("id")));
		})
	}

	function fnToggleFavrList(obj) {
		let menuId = $(obj).data("id");
		let url = fnChkIsFavrList(menuId) ? REQ_PATH.FAVR_DEL : REQ_PATH.FAVR_INS;

		Utils.ajaxCall(url, JSON.stringify({
			tenantId: GLOBAL.session.user.tenantId,
			usrId: GLOBAL.session.user.usrId,
			menuId: menuId
		}), function (data) {
			fnInitFavrList();
		});
	}

	function fnInitEnvironment() {
		$("#FRME_MENU_SYSTEM").fadeOut(function () {
			Utils.ajaxCall(REQ_PATH.ENVR_SEL, JSON.stringify({
				tenantId: GLOBAL.session.user.tenantId,
				usrId: GLOBAL.session.user.usrId
			}), resultInitEnvironment);
		})
	}

	function resultInitEnvironment(data){
		let envr = JSON.parse(data.usrEnvr);
		let colorChangeTransition = function (target, prop, delay, style, callback) {
			$(target).css({'-webkit-transition': prop + ' ' + delay + ' ' + style});
			$(target).css({'-moz-transition': prop + ' ' + delay + ' ' + style});
			$(target).css({'-o-transition': prop + ' ' + delay + ' ' + style});
			$(target).css({'transition': prop + ' ' + delay + ' ' + style});
			callback();
		}
		let initTransition = function (target) {
			$(target).css({
				'-webkit-transition': '',
				'-moz-transition': '',
				'-o-transition': '',
				'transition': ''
			});
		}

		if (!$.isEmptyObject(envr)) {
			let alrmUseYn = $.trim(envr.alrmUseYn); 			// 알람사용여부
			let alrmEffctUseYn = $.trim(envr.alrmEffctUseYn); 	// 알림효과사용여부
			let alrmPoupEffctUseYn = $.trim(envr.alrmPoupEffctUseYn); 	// 통화예약 알림효과사용여부
			let msgrUseYn = $.trim(envr.msgrUseYn); 			// 메신저사용여부 -> 부가서비스 버튼으로 변경
			let smsUseYn = $.trim(envr.smsUseYn); 				// SMS사용여부
			let qLnkUseYn = $.trim(envr.qLnkUseYn); 			// 퀵링크사용여부
			let favrlistUseYn = $.trim(envr.favrlistUseYn); 	// 즐겨찾기사용여부
			let hlpdkUseYn = $.trim(envr.hlpdkUseYn); 			// HELPDESK사용여부
			let kldSrchUseYn = $.trim(envr.kldSrchUseYn); 		// 지식검색사용여부
			let sknCd = $.trim(envr.sknCd); 					// 스킨코드
			let sknCdNm = $.trim(envr.sknCdNm); 				// 스킨코드클래스명

			// 미사용
			let softPnUseYn = $.trim(envr.softPnUseYn); 		// 소프트폰사용여부
			let mcqUseYn = $.trim(envr.mcqUseYn); 				// MCQ사용여부 : 2차개발 대상
			let miniDashUseYn = $.trim(envr.miniDashUseYn); 	// 미니전광판사용여부
			let daulMoniUseYn = $.trim(envr.daulMoniUseYn); 	// 듀얼모니터사용여부

			// 버튼
			alrmUseYn == "N" ? $("#FRME_MENU_SYSTEM_alrm").hide() : $("#FRME_MENU_SYSTEM_alrm").show();
			msgrUseYn == "N" ? $("#FRME_MENU_SYSTEM_adtnSvc").hide() : $("#FRME_MENU_SYSTEM_adtnSvc").show();
			smsUseYn == "N" ? $("#FRME_MENU_SYSTEM_sms").hide() : $("#FRME_MENU_SYSTEM_sms").show();
			kldSrchUseYn == "N" ? $("#FRME_MENU_SYSTEM_kldSrch").hide() : $("#FRME_MENU_SYSTEM_kldSrch").show();
			qLnkUseYn == "N" ? $("#FRME_MENU_SYSTEM_qlnk").hide() : $("#FRME_MENU_SYSTEM_qlnk").show();
			favrlistUseYn == "N" ? $("#FRME_MENU_SYSTEM_favrlist").hide() : $("#FRME_MENU_SYSTEM_favrlist").show();
			hlpdkUseYn == "N" ? $("#FRME_MENU_SYSTEM_hlpdk").hide() : $("#FRME_MENU_SYSTEM_hlpdk").show();
			// 영역
			// mcqUseYn == "N" ? $("#FRME_MENU_MCQ").fadeOut() : $("#FRME_MENU_MCQ").fadeIn();

			if (alrmEffctUseYn == "Y") { // 알림 체크 설정
				$("#FRME_MENU_SYSTEM_alrm").removeClass("noAlrmEffct");
				AlarmInfo.alarmCheckRequest();
				AlarmInfo.setAlarmCheckInterval();
			} else {
				$("#FRME_MENU_SYSTEM_alrm").removeClass("Active").addClass("noAlrmEffct");
				AlarmInfo.clearAlarmCheckInterval();
			}

			if (alrmPoupEffctUseYn == "Y") { // 알림창 체크 설정
				NotiPopUpInfo.notiRequest();
				NotiPopUpInfo.setAlarmCheckInterval();
			} else {
				NotiPopUpInfo.clearAlarmCheckInterval();
			}
			//장애 공지 팝업
			dsblNotiInfo.setDsblNotiPopInterval();
			realTimeNoteCheck.setRealTimeNoteCheckInterval();
			
			

			if (!$("body").hasClass(sknCdNm)) {
				$("body").removeAttr("class");

				if (Utils.isNotNull(sknCdNm)) {
					let changeTarget = [
						".system_top"
						, ".head_top"
						, ".k-tabstrip-items-wrapper"
						, ".sideL_wrap"
						, ".sub_2depth"
						, ".btn_menu_open"
						, ".k-scroll-right"
						, ".k-scroll-left"
					];

					colorChangeTransition(changeTarget.join(","), "background", "2s", "ease", function () {
						$("body").addClass(sknCdNm);
						$(".system_top").on("transitionend webkitTransitionEnd oTransitionEnd otransitionend", function () {
							initTransition(changeTarget.join(","));
						});
					});
				}
			}

			GLOBAL.fn.setSessionUsrEnvr(envr);

			//kw---20241015 : 조건별 상단 메뉴에서 숨기기
			//1) 테넌트 기준정보에서 SMS 발송번호(30) N 이거나 발송번호가 없을 경우 숨기기
			let tenantInfoSmsObj = Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 30);
			if (Utils.isNull(tenantInfoSmsObj) || tenantInfoSmsObj.useYn != "Y" || Utils.isNull(tenantInfoSmsObj.bsVl1)) {
				$("#FRME_MENU_SYSTEM_sms").css("display", "none");
			}

		}

		$("#FRME_MENU_SYSTEM").fadeIn();
	}

	function fnInitOprNoti() {
		NotiInfo.init();
	}

	function fnInitMenu() {
		let param = {
			tenantId: GLOBAL.session.user.tenantId,
			usrId: GLOBAL.session.user.usrId
		};

		Utils.ajaxCall(REQ_PATH.MENU_ATHT_SEL, JSON.stringify(param), function (result) { // 주업무 권한그룹 체크
			let usrMenuAthtList = JSON.parse(result.list);
			let usrGrd = GLOBAL.session.user.usrGrd;

			usrMenuAthtList = usrMenuAthtList.filter(function (item) {
				if ($.trim(item.bizChoYn) == "Y") {
					return true;
				}
			});

			if (usrMenuAthtList.length > 0) {
				usrGrd = Math.max.apply(Math, usrMenuAthtList.map(function (item) {
					return item.usrGrd;
				}));
			}

			$.extend(param, {
				mlingCd: GLOBAL.session.user.mlingCd,
				usrGrd: usrGrd
			});

			Utils.ajaxCall(REQ_PATH.MENU_SEL, JSON.stringify(param), resultMenuList);
		});
	}

	function resultMenuList(data){
		let menu = JSON.parse(data.list);
		let totalMenu = menu.filter(function (depth1) {
			if (depth1.prsMenuLvl == 1) {
				depth1.subMenu = menu.filter(function (depth2) {
					if (depth2.prsMenuLvl == 2 && depth1.menuId == depth2.hgrkMenuId) {
						depth2.subMenu = menu.filter(function (depth3) {
							if (depth3.prsMenuLvl == 3 && depth2.menuId == depth3.hgrkMenuId)
								return true;
						});
						return true;
					}
				});
				return true;
			}
		});
		let $parent = $(".sideL_wrap .nav .nav_list")
		fnAppendMenu(totalMenu, $parent);

		let switchMenu = menu.filter(x=> x.comCd == 'CSM');



		let count= [ "","","", "three_words","four_words","five_words","six_words","seven_words","eight_words","nine_words","ten_words"]

		switchMenu.map(x=>{
			frme_head_CMS.push(x.dataFrmId);

 			let regex = /[!@#$%^&*(),.?":{}|<>]/g;
			let specialCharsCount = (x.menuNm.match(regex) || []).length;
			let textCount = x.menuNm.replace(regex,'');
			let totalTextCount = textCount.length+(specialCharsCount/2);

			let mainSwitch = '<span class="swithCheck '+(totalTextCount <11 ? count[totalTextCount]:"")+'">'+
					'<input type="checkbox" id="'+x.dataFrmId +'_main" data-path-id="'+x.dataFrmId +'" onclick="FRME_TOP_fnOpenCnsl(this)"/>'+
					'<label title="'+x.menuNm +'"></label>'+
					'</span>'
				$("#FRME_MENU_SYSTEM_FN_BTN").append(mainSwitch);
		});

		// menu action -- start
		$(".nav_list > li > a").off("click").on("click", function () {
			if (!$(this).hasClass("on")) {
				// $(".nav_list > li > a").removeClass('on');
				// $(".nav_list > li > div.sub_2depth > ul > li > a").removeClass('on');
				// $(".nav_list > li .sub_3depth").hide();
				// $(".nav_list > li > .sub_2depth").hide();
				$(".sideL_wrap").addClass('on');
				$(this).addClass('on');
				$(".btn_menu_open").addClass('on');
				$(this).next().show();
			} else {
				// $(".nav_list > li > a").removeClass('on');
				// $(".nav_list > li > div.sub_2depth > ul > li > a").removeClass('on');
				// $(".nav_list > li .sub_3depth").hide();
				// $(".nav_list > li > .sub_2depth").hide();
				$(this).removeClass('on');
				$(this).parent().find("div.sub_2depth > ul > li > a").removeClass('on');
				$(this).parent().find(".sub_3depth").hide();
				$(this).parent().find(".sub_2depth").hide();
			}
		});
		$(".nav_list > li > a").focus(function () {
			$(".nav_list > li > a").removeClass('on');
			$(".nav_list > li .sub_3depth").hide();
			$(".nav_list > li > .sub_2depth").hide();
			$(".sideL_wrap").addClass('on');
			$(this).addClass('on');
			$(this).next().show();
		});
		$(".nav_list > li > div.sub_2depth > ul > li > a").off("click").on("click", function () {
			if ($(this).hasClass("on")) {
				$(this).removeClass('on');
				$(this).next().hide();
			} else {
				$(this).addClass('on');
				$(this).next().show();
			}
		});
		// menu action -- end

		// menu url load tab action
		$(".sideL_wrap .nav_list li[data-type=D]").off("click").on('click', function () {
			fnOpenDataFrameById($(this).data("path-id"));
		});
	}

	function fnAppendMenu(menuList, $parent) {
		$parent.empty();

		for (let key in menuList) {
			let menu = menuList[key];
			let isSubMenu = (Array.isArray(menu.subMenu) && menu.subMenu.length > 0);
			let object = fnGetMenuObject(menu, isSubMenu);

			$parent.append(object);

			if (isSubMenu) {
				let $newParent = $parent.children().last().find("ul");
				fnAppendMenu(menu.subMenu, $newParent);
			}
		}
	}

	function fnGetMenuObject(menu, isSubMenu) {
		let menuLevel = menu.prsMenuLvl;
		let menuType = menu.menuTypCd;
		let iconType = menu.iconTypClss;
		let menuTitle = menu.menuNm;
		let mapgVlu1 = menu.mapgVlu1;
		let dataFrmId = menu.dataFrmId;
		let dataFrmeTmplCd = menu.dataFrmeTmplCd;	// 템플릿 코드
		let usrGrd = menu.usrGrd;

		let menuObj = "";
		let iconObj = "";
		let is3DepthClass = "";
		let dataFrameInfo = "";

		if (menuLevel == 1) {
			if(iconType !== null){
				let imagePath = GLOBAL.contextPath + "/images/contents/" + iconType;
				iconObj = "<span class='ic' style='background-image:url(" + imagePath + ")' title="+menuTitle+"></span>";
			}else{
				iconObj = "<span class='ic' title="+menuTitle+"></span>";
			}
		}
		if (menuLevel == 2 && isSubMenu) {
			is3DepthClass = "three";
		}
		if (menuType == "D") {
			dataFrameInfo = " data-type='D' data-menu-nm='" + menuTitle + "' data-path-pre='" + mapgVlu1 + "' data-path-id='" + $.trim(dataFrmId) + "' data-usr-grd-auth='" + (Utils.isNotNull(usrGrd) ? "Y" : "N") + "' data-tmpl-cd='" + $.trim(dataFrmeTmplCd) + "'";
		}

		menuObj += "<li" + dataFrameInfo + ">";
		menuObj += "	<a class='" + is3DepthClass + "'>" + iconObj + "<span class='txt'>" + menuTitle + "</span></a>";
		if (isSubMenu) {
			menuObj += "<div class='sub_" + (menuLevel + 1) + "depth'><ul><!-- 하위 메뉴 영역 --></ul></div>";
		}
		menuObj += "</li>";

		return menuObj;
	}

	function fnOpenDataFrameById(id, paramObject) {
		if (Utils.isNotNull(id)) {
			let $menu = $(".sideL_wrap .nav_list li[data-type=D][data-path-id=" + id + "]");

			// TODO : 인수인계 : 데이터프레임 등급별 권한 구성 완료 후 주석해제
			// if ($menu.data("usr-grd-auth") == "Y") {
			if (true) {
				let dataframePath = $.trim($menu.data("path-pre")) + "/" + $.trim($menu.data("path-id"));

				if (Utils.isNotNull($menu.data("tmpl-cd")) && $menu.data("tmpl-cd") != "V0H0") {
					if ($.isEmptyObject(paramObject)) {
						paramObject = {};
					}

					dataframePath = "/tmpl/TEMPLATE_PAGE";
					paramObject.tenantId = GLOBAL.session.user.tenantId;
					paramObject.tmplCd = $menu.data("tmpl-cd");
				}

				fnDataFrameLoad({
					menuNm: $menu.data("menu-nm"),
					id: $.trim($menu.data("path-id")),
					path: dataframePath,
					param: paramObject
				});

				return true;
			} else {
				Utils.alert(MAINFRAME_langMap.get("FRME100M.menu.alert.noPermission")); // 현재 등급은 해당 화면에 대한 권한이 없습니다.
				return false;
			}
		} else {
			Utils.alert(MAINFRAME_langMap.get("FRME100M.menu.alert.noDataframe")); // 해당 메뉴의 데이터프레임이 존재하지 않습니다.
			return false;
		}
	}

	function fnOnTabContentLoad() {
		//즐겨찾기 버튼 설정
		fnOnFavrEventCheck();
		//텝 로드시 버튼 권한 체크
		fnOnBtnAuthCheck(false);
		//텝 로드시 테넌트유효성 체크 추가 이벤트
		fnOnCheckTenantValidity();
	}

	function fnOnFavrEventCheck(){
		// 즐겨찾기 버튼 설정
		let $favrBtn = $("div.k-tabstrip-content.k-content.k-state-active input[name=favorite]");

		if ($favrBtn.length > 0) {
			let favrId = $favrBtn.data("id");

			if (Utils.isNotNull(favrId)) {
				$favrBtn.prop("checked", fnChkIsFavrList(favrId));
			}
		}
	}

	function fnOnBtnAuthCheck(isPopup,btnlist){
		// 버튼 권한 체크 안함
		// if (GLOBAL.session.user.tenantId == "BRD") {
			if ((GLOBAL.session.user.usrGrd == "900" || GLOBAL.session.user.usrGrd == "910")) {
				return;
			}
		// }

		// 버튼 권한 체크
		let btnAuthList = DataFrameInfo.getBtnAuthList();
		let chkList;
		if(isPopup){
			chkList = btnlist;
		}else{
			chkList = $("div.k-tabstrip-content.k-content.k-state-active [data-auth-chk=Y]");
		}

		for (let btn of chkList) {
			let dataFrmId = $(btn).data("auth-id");
			let type = $(btn).data("auth-type");
			let typCd = { 		// C0201코드(버튼유형코드)와 데이터 일치시켜야 함
				QUERY: "SEL",		// 조회
				INSERT: "INS",		// 등록
				UPDATE: "UPT",		// 수정
				SAVE: "SAV",		// 저장
				DELETE: "DEL",		// 삭제
				POPUP: "POP",		// 팝업호출
				LINK: "LIK", 		// 화면LINK
				CHANGE: "CHA",		// 화면조작
				REFUSE: "REF",		// 거절
				TEMPSAVE: "TMP",	// 임시저장
				XLXDOWN: "XLX",		// 엑셀다운로드
				XLXUPLOAD: "XLU",	// 엑셀업로드
				FILESELECT: "FIL",	// 파일선택
				DISPOSE: "DIS",		// 폐기
				APPROVAL: "APR",	// 승인
			};

			let auth = btnAuthList.find(function (item) {
				return item.dataFrmId == $.trim(dataFrmId) && item.butnTypCd == $.trim(typCd[type]);
			});

			if ($.isEmptyObject(auth)) {
				$(btn).hide();
			}
		}
	}

	function fnOnCheckTenantValidity(){
		// 유효성 버튼 리스트
		let chkList = $("[tenant-validity=Y]");
		for (let btn of chkList) {
			if(btn.onclick){
				let clickEvent = btn.onclick;
				const changeEvent = () => {
					if(CMMN_SEARCH_TENANT[$(btn).data("frmeId")].validity){
						clickEvent();
					}else{
						Utils.alert(MAINFRAME_langMap.get("error.tenantId"));
					}
				}
				btn.onclick = changeEvent;
			}
		}
	}

	function fnIsTabOpen(datafrmId) {
		return IsTabOpen(datafrmId)
	}

	function fnUpdateSessionUser() {
		fnSessionCheck(function (result) {
			GLOBAL.fn.setSessionUser(result.user);
			fnGVDisplay();
		});
	}

	// Frame 닫기 탭쪽에서 처리
	function fnCloseDataFrameById(id){
		if (Utils.isNotNull(id)) {
			closeTab(id);
		} else {
			Utils.alert(MAINFRAME_langMap.get("FRME100M.menu.alert.noDataframe")); // 해당 메뉴의 데이터프레임이 존재하지 않습니다.
			return false;
		}
	}

	function fnGVDisplay(){
		// 20240306 : 800 운영자용 GV 권한 추가
		if(GLOBAL.session.user.originUsrGrd ==='900' || GLOBAL.session.user.originUsrGrd ==='910' || GLOBAL.session.user.originUsrGrd ==='800'){
			$('#FRME_MENU_SYSTEM_FN_BTN_GV').attr('style', 'display:block');
			$('#FRME_MENU_SYSTEM_FN').addClass('activeGV');
		}else{
			$('#FRME_MENU_SYSTEM_FN_BTN_GV').attr('style', 'display:none');
			$('#FRME_MENU_SYSTEM_FN').removeClass('activeGV');
		}
	}

	return {
		initMainFrame: fnInitMainFrame,
		initMenu: fnInitMenu,
		initEnvironment: fnInitEnvironment,
		initDataFrame: fnInitDataFrame,
		initFavrList: fnInitFavrList,
		toggleFavrList: fnToggleFavrList,
		dataFrameLoad: fnDataFrameLoad,
		openDataFrameById: fnOpenDataFrameById,
		onTabContentLoad: fnOnTabContentLoad,
		isTabOpen: fnIsTabOpen,
		reloadFrame: fnReloadFrame,
		updateSessionUser: fnUpdateSessionUser,
		btnAuthCheck:fnOnBtnAuthCheck,
		closeDataFrameById: fnCloseDataFrameById,
		displayGVBtn:fnGVDisplay,
		clickNotiWindow :NotiPopUpInfo.notiWindowClick,
		closeNotiWindow : NotiPopUpInfo.notiWindowClose
};
})();

var MAINFRAME_SUB = (function () {
	return {
		dataFrameLoad: MAINFRAME.dataFrameLoad,
		initEnvironment: MAINFRAME.initEnvironment,
		initFavrList: MAINFRAME.initFavrList,
		updateSessionUser: MAINFRAME.updateSessionUser,
		openDataFrameById: MAINFRAME.openDataFrameById,
		isTabOpen: MAINFRAME.isTabOpen,
		btnAuthCheck:MAINFRAME.btnAuthCheck,
	}
})();