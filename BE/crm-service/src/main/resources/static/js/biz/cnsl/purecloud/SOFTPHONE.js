var hostUrl,clientId,redirectUri,regionUri,platformClient,client,notificationsApi,presenceApi;
var tokensApi,conversationsApi,recordingApi,analyticsApi,routingApi,authorizationApi,usersApi,stationsApi;

//kw---20231005 : 내선번호
var stationCombo = new Array(1);

//interaction state var
var currentMuteState = "";
var currentHoldState = "";
var callId = "";
var customerParticipantId = "";
var transCustomerParticipantId = "";
var originalCustomerParticipantId = ""
var myParticipantId = "";
var insParticipantId = "";
var myUserId = "";
var transTelNo = "";

// conversationList var
var myConversationId = "";
var prevConversationId = "";
var insConversationId = "";
var conversationList = {};
var conversationJson = {};


// notification var
var queueObservationsTopic = "";
var presences = {};
var userPresenceTopic = "";
var conversationTopic = "";
var routingStatusTopic = "";
var userAggregatesTopic = "";        
var queueObservationsTopicDetails = "";
var tokenTopic = "";
var stationTopic = "";
var webSocket = null;
var me;
var notificationChannel;

var wrapupYn = false;
var transferYn = false;
var conferencYn = false;
var customerHoldYn = false;
	        
var connectedYn = false;

var monitorYn = false;
var coachYn = false;

var alertingViewYn = false;

var currentUrl = window.location.href;
var url = new URL(currentUrl);
var portNumber = url.port;

var protocol = window.location.protocol;
var hostname = '';
var pathname = window.location.pathname.split("/")[1];

var wsUrl = '';

var stationNum = "";

if ( protocol == 'http:' ) {
	wsUrl = 'ws://';
	hostname = window.location.hostname + ':' + portNumber;
} else {
	wsUrl = 'wss://';
	hostname = window.location.hostname;
}

var status_socketUrl = wsUrl + hostname + '/' + pathname + "/checkState?usrId="+GLOBAL.session.user.usrId;
var status_socket;


var loginYn = false;

var SOFTPHONE_intervalId;

function status_socket_con() {
	status_socket = new WebSocket(status_socketUrl);
	status_socket.addEventListener("open", (event) => {
		console.log('status_socket open');
	});

	status_socket.addEventListener('close', (event) => {
	// 연결이 닫혔을 때의 처리
		console.log('status_socket closed:', event.reason);
	});

	status_socket.addEventListener('error', (error) => {
	// 오류 발생 시 처리
		console.error('status_socket error:', error);
	});
}

function purecloudLoad() {
	
	hostUrl = GLOBAL.contextPath;
    clientId = "61c3abc5-63a1-46b6-83e8-189738ac2f37";
    redirectUri = "/SoftPhone/implictGrant";
    regionUri = "apne2.pure.cloud";
    // Set Genesys Cloud objects
    platformClient = require("platformClient");
    client = platformClient.ApiClient.instance;
    // Set Genesys Cloud settings
    client.setEnvironment(regionUri);
    client.setPersistSettings(true, "test_Embeded_App");
          
    notificationsApi = new platformClient.NotificationsApi();
    presenceApi = new platformClient.PresenceApi();
    //usersApi = new platformClient.UsersApi();
    tokensApi = new platformClient.TokensApi();
    conversationsApi = new platformClient.ConversationsApi();

    // 2023.04.24
    // recording api 사용을 위한 api 선언
    recordingApi = new platformClient.RecordingApi();
    // statistic api 사용을 위한 api 선언
    analyticsApi = new platformClient.AnalyticsApi();
    
    stationsApi = new platformClient.StationsApi();
    
    // queue 정보, queue에 속한 상담원 목록 등의 사용을 위한 api 선언
    routingApi = new platformClient.RoutingApi();
    // role 관련 api 사용을 위한 api 선언
    authorizationApi = new platformClient.AuthorizationApi();
    // user 검색 등을 위한 api 사용을 위한 api 선언.
    usersApi = new platformClient.UsersApi();

    client._saveSettings({
        accessToken: undefined,
        state: undefined,
        tokenExpiryTime: undefined,
        tokenExpiryTimeString: undefined,
    });

        // 인증 및 로그인은 팝업 창으로..
        window.open(hostUrl + '/SoftPhone/implictGrant',"CHILD_WND_TEST","width=500, height=600");
        // 2023.04.24
        document.getElementById("getRecordingMetadata").addEventListener("click", getRecordingMetadata);
        document.getElementById("getRecordingDownload").addEventListener("click", getRecordingDownload);
        document.getElementById("postQueueObservation").addEventListener("click", postQueueObservation);
        document.getElementById("postQueueAggregation").addEventListener("click", postQueueAggregation);

        document.getElementById("scriptDisplay").addEventListener("click", scriptDisplay);
        document.getElementById("softphoneDisplay").addEventListener("click", softphoneDisplay);

        document.getElementById("locationreload").addEventListener("click",locationreload);
        document.getElementById("logout").addEventListener("click",logout);
        document.getElementById("logoutApi").addEventListener("click",logoutApi);

        // Embeddable Framework Functions 
        document.getElementById("clickToDial_byQueue").addEventListener("click", clickToDial_byQueue);
        document.getElementById("holdInteraction").addEventListener("click", updateInteractionState);
        document.getElementById("muteInteraction").addEventListener("click", updateInteractionState);
        document.getElementById("pickupInteraction").addEventListener("click",updateInteractionState);
        document.getElementById("securePauseInteraction").addEventListener("click",updateInteractionState);
        document.getElementById("disconnectInteraction").addEventListener("click", updateInteractionState);

        document.getElementById("secureTransfer").addEventListener("click", updateInteractionState);
        document.getElementById("blindTransfer").addEventListener("click", updateInteractionState);
        document.getElementById("consultTransfer").addEventListener("click", updateInteractionState);
        document.getElementById("concludeTransfer").addEventListener("click", updateInteractionState);

        
        document.getElementById("changeUserStatus").addEventListener("click",() => {
            changeUserStatus(document.getElementById("statusDropBox").value);
        })
       
        // Genesys Cloud javaScript API 
        document.getElementById("makeCall_API").addEventListener("click", makeCallAPI);
        document.getElementById("holdInteractionApi").addEventListener("click",holdInteractionApi);
        document.getElementById("muteInteractionApi").addEventListener("click",muteInteractionApi);
        document.getElementById("disconnectInteractionApi").addEventListener("click",disconnectInteractionApi);
        document.getElementById("startConsultApi").addEventListener("click", startConsultApi);
        document.getElementById("complateConsultApi").addEventListener("click", complateConsultApi);
        document.getElementById("cancleConsultApi").addEventListener("click", cancleConsultApi);
        document.getElementById("conferenceAfterConsultApi").addEventListener("click", conferenceAfterConsultApi);
        document.getElementById("blindTranserApi").addEventListener("click", blindTranserApi);
        document.getElementById("consultSpeakToBothApi").addEventListener("click", consultSpeakToBothApi);
        document.getElementById("secureIvrSessionApi").addEventListener("click", secureIvrSessionApi);
        document.getElementById("firstCustomerHoldApi").addEventListener("click", firstCustomerHoldApi);
        document.getElementById("secondCustomerHoldApi").addEventListener("click", secondCustomerHoldApi);
        document.getElementById("unHoldApi").addEventListener("click", unHoldApi);
        document.getElementById("wrapupApi").addEventListener("click", wrapupApi);
        document.getElementById("securePauseApi").addEventListener("click", securePauseApi);
        document.getElementById("secureResumeApi").addEventListener("click", secureResumeApi);
        document.getElementById("setExternalTag").addEventListener("click", setExternalTag);
        document.getElementById("addAttribute").addEventListener("click", addAttribute);
        document.getElementById("addAttributeApi").addEventListener("click", addAttributeApi);
        document.getElementById("getRealId").addEventListener("click", () => {
            getRealIdByEmail(document.getElementById("targetEmail").value);
        });
        document.getElementById("getAgentConversationSummury").addEventListener("click", () => {
            getAgentConversationSummury(document.getElementById("targetRealId").value);
        });

        document.getElementById("webSockerClose").addEventListener("click", () => {
            console.log("-----------  webSocket 버튼 클릭으로 종료 !!!!! --------- ")
            webSocket.close();

        })

        document.getElementById("transcriptionApi").addEventListener("click",transcriptionApi);

        document.getElementById("changeUserStatusApi").addEventListener("click",() => {
            changeUserStatusApi(document.getElementById("statusDropBoxApi").value);
        })

        document.getElementById("pickupInteractionApi").addEventListener("click",pickupInteractionApi);

        window.addEventListener("message", function(event){
            let message = JSON.parse(event.data);
            console.log("----- message type : " + message.type + " -----")
            if(message){
                // add embeddable subscription start - 09.13.22
                if (message.type == "interactionSubscription") {
                    document.getElementById("interactionSubscriptionPayload").value = event.data;
                    let interactionData = JSON.parse(event.data).data;
                    if (interactionData.category == "connect" && interactionData.interaction.isChat == true) {
                        if (document.querySelector("#scriptFrame").style.display != "block") {
                            console.log("---- chat ----");
                            scriptDisplay();
                        }
                        if (document.querySelector("#softphoneFrame").style.display != "none") {
                            console.log("---- call ----");
                            softphoneDisplay();
                        }
                    }
                } else if (message.type == "userActionSubscription") {
                    document.getElementById("userActionSubscriptionPayload").value = event.data; // Embeddable Phone이 준비되었는지 확인
                    document.getElementById("userStatus").value = JSON.parse(event.data).data.category;
                    if (JSON.parse(event.data).data.category == "logout") {
                        console.log("#### channelId : ", notificationChannel.id);
                    // API
                    notificationsApi
                        .deleteNotificationsChannelSubscriptions(notificationChannel.id)
                        .then(() => {
                            console.log("deleteNotificationsChannelSubscriptions returned successfully.");
                            webSocket.close();
                        // return tokensApi.deleteTokensMe(); // logout 내부함수 사용으로 따로 토큰을 삭제할 필요 없음.
                        })
                        // .then(() => {
                        //   console.log("deleteTokensMe returned successfully.");
                        //   client._saveSettings({
                        //     accessToken: undefined,
                        //     state: undefined,
                        //     tokenExpiryTime: undefined,
                        //     tokenExpiryTimeString: undefined,
                        //   });
                        // })
                        .catch((err) => {
                            console.log("There was a failure calling deleteNotificationsChannelSubscriptions");
                            console.error(err);
                        });
                    console.log("logout");
                    }
                } else if (message.type == "notificationSubscription") {
                    document.getElementById("notificationSubscriptionPayload").value = event.data;
                } else if (message.type =="setToken") {
                    // 인증 후 embeddable framework load
                    client._saveSettings(message.data.data);
                    console.log("---- [ACCESS-TOKEN", client.authData);
                    // 인증 정보 확인
                    populateParagraph(client.authData);
                    // 임시
                    replaceIframe('https://apps.' + regionUri + '/crm/embeddableFramework.html');
                    
                    //replaceIframe(`https://apps.${regionUri}/crm/index.html?crm=framework-local-secure`);
                    setNotification();
                    // 로그인 후 버튼 상태값 변경
                    softPhoneBtnDisabled('ctiLogin',true); //로그인
                    softPhoneBtnDisabled('ctiLogout',false); //로그아웃
                    
					 //kw---20231005 : 내선번호 해제 버튼
//                    fnGetMe(function(){
//                    	fnCnslNumberSearch();
//                    	$("#SOFT_btnCnslNumDisable").prop("disabled", false);
//            	        $("#SOFT_spnCnslNumDisable").prop("disabled", false);
//                    });
                    
                } else if (message.type == "processCallLog") {
                    console.log("processCallLog" + event.data);
                    document.getElementById("processCallLogPayload").value = event.data;
                // add embeddable subscription end - 09.13.22
            }}
        })
        
//        $("#cntcTelNo").on("keyup", function (e) {
//            if (e.keyCode == 13 && $("#currentRoutingStatus").text() == 'OFF_QUEUE') {
//            	$("#makeCallBtn").click();
//            }
//        });
}


function populateParagraph(data) {
    for (key in data) {
        console.log(key, data[key]);
        let textnode = document.createTextNode(key + ' : ' + data[key]);
        let br = document.createElement("br")
        document.getElementById("oauthDetails").appendChild(textnode);
        document.getElementById("oauthDetails").appendChild(br);
    }
}

function softphoneDisplay() {
    let softphoneFrame = document.querySelector("#softphoneFrame");
    if (softphoneFrame.style.display == "none" || !softphoneFrame.style.display) {
        softphoneFrame.style.top = "10px";
        softphoneFrame.style.left = "";
        softphoneFrame.style.display = "block";
    } else {
        softphoneFrame.style.display = "none";
    }
}

function scriptDisplay() {
    let scriptFrame = document.querySelector("#scriptFrame");
    if (scriptFrame.childElementCount == 0) {
        let iframe = document.createElement("iframe");
        iframe.id = "scriptInteraction";
        iframe.width = "600px";
        iframe.height = "800px";
        iframe.allow = "camera *; microphone *; autoplay *";
        iframe.src = 'https://apps.' + regionUri + '/crm/interaction.html';
        scriptFrame.appendChild(iframe);
        scriptFrame.style.display = "block";
    } else {
        if (scriptFrame.style.display == "none" || !scriptFrame.style.display) {
            scriptFrame.style.display = "block";
        } else {
            scriptFrame.style.display = "none";
        }
    }
}

function replaceIframe(url) {
    let softphoneFrame = document.querySelector("#softphoneFrame");
    if (!softphoneFrame.querySelector("iframe")) {
        let iframe = document.createElement("iframe");
        iframe.id = "softphone";
        iframe.width = "220px";
        iframe.height = "450px";
        iframe.allow = "camera *; microphone *; autoplay *";
        iframe.src = 'https://apps.' + regionUri + '/crm/embeddableFramework.html';
        softphoneFrame.appendChild(iframe);
    } else {
        if (document.getElementById("softphone")) {
            document.getElementById("softphone").contentWindow.location.replace(url);
        }
    }
}

function setNotification() {
// API
    presenceApi
    .getPresencedefinitions({ pageSize: 100 })
    .then((presenceListing) => {
        console.log('Found ' + presenceListing.entities.length + ' presences');

        // Create button for each presence
        presenceListing.entities.forEach((presence) => {
        presences[presence.id] = presence;
        });

        // Get authenticated user's data, including current presence
        return usersApi.getUsersMe({ expand: ["presence","routingStatus"] });
    })
    .then((userMe) => {
        me = userMe;
        console.log("got me");
        console.log(me);
        document.getElementById("myDetails").value = JSON.stringify(me);
        document.getElementById("myPresence").value = JSON.stringify(me.presence);
        // add routingStatus 09.13.22 
        document.getElementById("myRoutingStatus").value = JSON.stringify(me.routingStatus);
        console.log("done");
        // Set current presence text in UI
        document.getElementById("userId").value = me.id;
        myUserId = me.id;
        document.querySelector("#currentPresence").innerText = presences[me.presence.presenceDefinition.id].languageLabels.en_US;
		
        setTimeout(() => 
        softPhoneStateBtnCntl(presences[me.presence.presenceDefinition.id].languageLabels.en_US), 3500);
        // add routingStatus 09.13.22
        document.querySelector("#currentRoutingStatus").innerText = me.routingStatus.status;
        // Create notification channel
        return notificationsApi.postNotificationsChannels();
    })
    .then((channel) => {
        console.log("channel: ", channel);
        
        notificationChannel = channel;
        console.log("connectUri: ", notificationChannel.connectUri);

        // Set up web socket
        webSocket = new WebSocket(notificationChannel.connectUri);
        webSocket.onopen = openSocket;
        webSocket.onmessage = handleNotification;
        webSocket.onerror = errorNotification;
        webSocket.onclose = closeSocket;
        

        // 토픽 구독 (Subscribe)
        userPresenceTopic = 'v2.users.' + me.id + '.presence'; // 상담원 상태 Event
        conversationTopic = 'v2.users.' + me.id + '.conversations'; // Call Event
        // add routingStatus 09.13.22
        routingStatusTopic = 'v2.users.' + me.id + '.routingStatus'; // 상담원 routingStatus Event    
        // add userAggregates 10.13.22
        userAggregatesTopic = 'v2.analytics.users.' + me.id + '.aggregates';        
        queueObservationsTopic = 'v2.analytics.queues.6f1e84df-0ae4-493e-9ad3-0c2c78786e09.observations'; 
        queueObservationsTopicDetails = 'v2.analytics.queues.6f1e84df-0ae4-493e-9ad3-0c2c78786e09.observations.details'; 
        tokenTopic = 'v2.users.' + me.id + '.tokens';   
        stationTopic = 'v2.users.' + me.id + '.station'; 

        const body = [{ id: userPresenceTopic }, 
                      { id: conversationTopic }, 
                      {id: routingStatusTopic }, 
                      {id: userAggregatesTopic }, 
                      {id: queueObservationsTopic }, 
                      {id: queueObservationsTopicDetails },
                      {id: tokenTopic },
                      {id: stationTopic }];
        return notificationsApi.putNotificationsChannelSubscriptions(notificationChannel.id, body);
    })
    .then((channel) => {
        console.log("Channel subscriptions set successfully");
    })
    .catch((err) => console.error(err));
}

// Handle incoming Genesys Cloud notification from WebSocket
function handleNotification(message) {
	
	const notification = JSON.parse(message.data);
    let participantState = '';
	let participantCnt = 0;
    if ( prevConversationId != '' && prevConversationId == notification.eventBody.id ) {
    	let conversation = notification.eventBody;
    	conversation.participants.forEach((participant) => {
        	participantCnt++;
            if (!participant.calls || participant.calls.length === 0) return;
            if(participant.purpose == "agent" || participant.purpose == "user" ){
                if(myUserId == participant.userId){
                    participantState = participant.state;
                }
            } 
            if ( conversation.participants.length == participantCnt ) {
            	if ( participantState == 'terminated') {
            		return;
            	} 
            } 
        });
	}
    
    softPhoneLogSave("res", "", "handleNotification", "", "", notification);		//kw---20231116 : 소프트폰 로그 이벤트 추가
    
    let now = new Date();
    if (notification.topicName.toLowerCase() === "channel.metadata") {
        // Heartbeat
        console.info(now + " ---- Ignoring metadata: ", notification);
        // 시간체크해서 일정 시간 후 오지 않으면 다시 setNotification
        return;
    } else if (notification.topicName.toLowerCase() === userPresenceTopic.toLowerCase()) {
        // 상담원 상태 Event topic
        console.log(now + " ---- Presence notification: ", notification);
        me = notification;
        document.getElementById("myPresence").value = JSON.stringify(notification);
        document.querySelector("#currentPresence").innerText = presences[me.eventBody.presenceDefinition.id].languageLabels.en_US;
        softPhoneStateBtnCntl(presences[me.eventBody.presenceDefinition.id].languageLabels.en_US);
        return;
    } else if (notification.topicName.toLowerCase() === conversationTopic.toLowerCase()) {
    // Call Event topic
        console.log("Conversation notification: ", notification);
        me = notification;
        document.getElementById("myConversation").value = JSON.stringify(notification);
        document.getElementById("myConversationId").value = me.eventBody.id;
        myConversationId = me.eventBody.id;
        participantsViewerSample(notification.eventBody.participants);                
        _logConversationDetails(me.eventBody);               
        copyCallPropsToParticipant(me.eventBody);
        // Update conversation in list or remove it if disconnected
        if (isConversationDisconnected(notification.eventBody))
            delete conversationList[notification.eventBody.id];
        else
            conversationList[notification.eventBody.id] = notification.eventBody;
        return;
    } else if (notification.topicName.toLowerCase() === routingStatusTopic.toLowerCase()) {
        // routingStatus Event topic
        // add routingStatus 09.13.22
        console.log("routingStatus notification: ", notification);
        me = notification;
        document.getElementById("myRoutingStatus").value = JSON.stringify(notification);
        document.querySelector("#currentRoutingStatus").innerText = me.eventBody.routingStatus.status;
        return;
    } else if (notification.topicName.toLowerCase() === userAggregatesTopic.toLowerCase()) {
        // routingStatus Event topic
        // add userAggregatesTopic 10.13.22
        console.log("aggregates notification: ", notification);
        me = notification;
        document.getElementById("myAggregates").value = JSON.stringify(notification);
        return;
    } else if (notification.topicName.toLowerCase() === queueObservationsTopic.toLowerCase()) {
        // routingStatus Event topic
        // add queueObservationsTopic 10.13.22
        console.log("queueObservationsTopic notification: ", notification);
        me = notification;
        document.getElementById("myQueueObservations").value = JSON.stringify(notification);
        return;
    } else if (notification.topicName.toLowerCase() === queueObservationsTopicDetails.toLowerCase()) {
        // routingStatus Event topic
        // add queueObservationsTopicDetails 10.13.22
        console.log("queueObservationsTopicDetails notification: ", notification);
        me = notification;
        document.getElementById("myQueueObservationsDetails").value = JSON.stringify(notification);
        return;
    } else if (notification.topicName.toLowerCase() === tokenTopic.toLowerCase()) {
        console.log(now + " ---- tokenTopic notification: ", notification);
        return;
    } else if (notification.topicName.toLowerCase() === stationTopic.toLowerCase()) {
        console.log(now + " ---- stationTopic notification: ", notification);
        return;
    } else if (notification.topicName.toLowerCase() === transcriptionTopic.toLowerCase()) {
        // transcription Event topic
        // add transcriptionTopic 09.13.22
        console.log(now + " ---- transcription notification: ", notification);
        document.getElementById("myTranscript").value = JSON.stringify(notification);
        return;
    } else {
        // Unexpected topic
        console.log("Unknown notification: ", notification);
    }
    // Set current presence text in UI
    document.querySelector("#currentPresence").innerText = presences[notification.eventBody.presenceDefinition.id].languageLabels.en_US;
}

function participantsViewerSample(participants) {
    document.querySelectorAll(".input__myParticipant").forEach((e) => {
    e.value = "";
    });
    for (let i = 0; i < participants.length; i++) {
        document.getElementById('myParticipant' + i).value = participants[i].purpose ? participants[i].purpose : "";
        if (participants[i].calls) {
            document.getElementById('myParticipant' + i + '_state').value = participants[i].calls[0].state ? participants[i].calls[0].state : "";
        } else {
            document.getElementById('myParticipant' + i + '_state').value = participants[i].callbacks[0].state ? participants[i].callbacks[0].state : "";
        }
        document.getElementById('myParticipant' + i + '_id').value = participants[i].id ? participants[i].id : "";
        console.log("---- ",participants[i].calls[0].held)
        document.getElementById('myParticipant' + i + '_held').value = participants[i].calls[0].held;
    }
}

// 참가자의 연결여부 확인
function isConversationDisconnected(conversation) {
    let isConnected = false;
    conversation.participants.some((participant) => {
        if (participant.state !== 'disconnected') {
            isConnected = true;
            return true;
        }
    });

    return !isConnected;
}

// using embeddable
function clickToDial_byQueue() {
	softPhoneBtnDisabled('icoUtil_callMake',true);
    console.log("process click to dial byQueue");
    let callFromQueueId = GLOBAL.session.user.cnslGrpQueueId;
    let clickToDialDest = document.getElementById("txtTargetNumber").value.replace(/\D/g, "");
    if( clickToDialDest.length < 4 ) {
		Utils.alert("OB전화번호를 입력해주세요.");
		softPhoneBtnDisabled('icoUtil_callMake',false);
		return;
	}
    custTelNum = clickToDialDest;
    document.getElementById("softphone").contentWindow.postMessage(
    JSON.stringify({
        type: "clickToDial",
        data: {
        number: clickToDialDest,
        callFromQueueId : callFromQueueId,
        autoPlace: true,
        },
    }),
    "*"
    );
    
  //kw---20231116 : 소프트폰 로그 이벤트 추가 시작
    let jsonData = {
    		type: "clickToDial",
            data: {
            number: clickToDialDest,
            callFromQueueId : callFromQueueId,
            autoPlace: true,
            },
    }
    
    softPhoneLogSave("req", "전화걸기", "clickToDial_byQueue", "", "", jsonData);		//kw---20231116 : 소프트폰 로그 이벤트 추가
  //kw---20231116 : 소프트폰 로그 이벤트 끝
}

// using API
function makeCallAPI() {
    // API
    let phoneNumber = document.getElementById("makeCallDest").value; // 목적 전화번호
    let callerId = document.getElementById("makeCallId").value; // 고객에 보이는 번호
    let callFromQueueId = GLOBAL.session.user.cnslGrpQueueId;
    let body = {
        phoneNumber: phoneNumber,
        callFromQueueId : callFromQueueId
    }; // Object | Call request
    conversationsApi
    .postConversationsCalls(body)
    .then((data) => {
        console.log('postConversationsCalls success! data: ' + JSON.stringify(data, null, 2));
    })
    .catch((err) => {
        console.log("There was a failure calling postConversationsCalls");
        console.error(err);
    });
}

// using embeddable

function updateInteractionState(event) {
    console.log("process interaction state change");
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let interactionId = myConversationNotification.eventBody.id;
    let payload;
    if (this.name == "transferBtn") {
        payload = {
            action: event.target.outerText,
            id: interactionId,
            participantContext: {
            transferTarget: document.getElementById("transferDestAddress").value,
            transferTargetType: document.getElementById("transferDestType").value,
            },
        };
    } else if (this.id == "secureTransfer") {
        payload = {
            action: event.target.outerText,
            id: interactionId,
            secureSessionContext: {
            flowId: document.getElementById("transferSecFlowId").value,
            userData: document.getElementById("userData").value,
            disconnect: false,
            },
        };
    } else {                
        payload = {
            action: event.target.outerText,
            id: interactionId,
        };
        
    }
    document.getElementById("softphone").contentWindow.postMessage(
    JSON.stringify({
        type: "updateInteractionState",
        data: payload,
    }),
    "*"
    );
    
  //kw---20231116 : 소프트폰 로그 이벤트 추가 시작
    let jsonData = {
            type: "updateInteractionState",
            data: payload,
        }
    softPhoneLogSave("req", "", "updateInteractionState", "", "", jsonData);
  //kw---20231116 : 소프트폰 로그 이벤트 끝
}

function changeUserStatus(status) {
    console.log("process user status update");
    document.getElementById("softphone").contentWindow.postMessage(
    JSON.stringify({
        type: "updateUserStatus",
        data: { id: status },
    }),
    "*"
    );
    
    //kw---20231116 : 소프트폰 로그 이벤트 추가 시작
    let jsonData = {
    		type: "updateUserStatus",
            data: { id: status },
        }
    
    softPhoneLogSave("req", status, "changeUserStatus", "", "", jsonData);
  //kw---20231116 : 소프트폰 로그 이벤트 추가 끝
}

function purecloudLogout(){

	let currentRoutingStatus = $("#currentRoutingStatus").text();
	if ( currentRoutingStatus != 'OFF_QUEUE' ) {
		Utils.alert("현재 상태에서는 로그아웃을 할 수 없습니다.");
		return;
	}
    console.log("---- Call logOut : ");
    //client.logout("Url");
    document.getElementById("softphone").contentWindow.postMessage(
        JSON.stringify({
            type: "logout",
            data: null,
        }),
        "*"
    );
    $(".softPhoneBtn").removeClass('active');
    softPhoneBtnDisabled('softPhoneBtn',true); //모든 소프트폰 버튼 disabled
    softPhoneBtnDisabled('icoUtil_NLogout',true);
	softPhoneStateBtnCntl('Logout');
	setTimeout(() => 
	fnReloadOpenTab(), 1000);
}

function logoutApi(){
    console.log("---- call logoutApi ---- ");
    client.logout("http://localhost:3000/test").then((data) => {
        console.log("---- logoutApi success --- ");
        //purecloudLogout();
        location.reload();
    }).catch((error) => {
        console.log("---- logoutApi fail ----");
        console.log(error);
    })
}


function changeUserStatusApi(status) {
    console.log("process user status update by api");
    
    let userId = document.getElementById("userId").value;
    //let statusName = document.getElementById("statusDropBoxApi").text;
    let statusName = document.getElementById("statusDropBoxApi").options[document.getElementById("statusDropBoxApi").selectedIndex].text;
    
    let statusId = document.getElementById("statusDropBoxApi").value;

    //console.log(document.getElementById("statusDropBoxApi").value);

    let body = {
        source: "PURECLOUD",
        name: statusName,
        presenceDefinition:{
            id: statusId,
            systemPresence: statusName
        },
        message: ""
    }

    presenceApi.patchUserPresencesPurecloud(userId, body)
        .then((data) => {
            console.log(" ----------- change user status success !!! to --> "+ statusName +" ---------- ");
        })
        .catch((error) => {
            console.log("------------ change user status failed !!! --------- ");
            console.log(err);
        })

}

// pickup by api
function pickupInteractionApi(){
    console.log("---- pickup by api ----");

    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;;
    //let participantId = document.getElementById(`myParticipant`).value;
    let participantId = myParticipantId;
    let body = {
        state: "connected"
    };

    conversationsApi.patchConversationParticipant(conversationId, participantId, body)
        .then(()=>{
            console.log('---- patchConversationParticipant returned successfully... ---- ');
        })
        .catch((err)=>{
            console.log('---- There was a failure calling patchConversationParticipant ----');
            console.error(err);
        })
}

function firstCustomerHoldApi(holdState){
    console.log("---- firstCustomerHoldApi : ", conversationList);
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    let participantId = originalCustomerParticipantId;
    currentHoldState = holdState;
    
    if ( participantId == '' ) {
    	participantId = customerParticipantId;
    } 

    let body = {
        confined: holdState
    };

    conversationsApi.patchConversationsCallParticipant(conversationId, participantId, body)
        .then((data)=> {
            console.log('---- firstCustomer patchConversationsCallParticipantConsult success! data:' + JSON.stringify(data, null, 2));
            
            if (currentHoldState) {
            	if ( transferYn ) {
	        		document.querySelector("#txtAgentState2").innerText = '협의중';
	        	} else {
	        		document.querySelector("#txtAgentState2").innerText = '보류중';
	        	}
	        	$(".icoUtil_callHold").html('<span>보류해제</span>')
	        	softPhoneBtnActive('icoUtil_callHold');//보류중
	        } else {
        		document.querySelector("#txtAgentState2").innerText = '통화중';
	        	$(".icoUtil_callHold").html('<span>보류</span>')
	        }
            
        }).catch((err) =>  {
            console.log('There was a failure calling patchConversationsCallParticipantConsult');
            console.error(err);
        });

    softPhoneLogSave("req", "보류", "firstCustomerHoldApi", participantId + " / " + conversationId, "", body);		//kw---20231116 : 소프트폰 로그 이벤트 추가
}

function secondCustomerHoldApi(){
    console.log("---- secondCustomerHoldApi : ", conversationList);
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    //let participantId = document.getElementById(`myParticipant`).value; // 당사자의 participantId
    //let participantId = customerParticipantId;  // 고객 participantId
    let participantId = document.getElementById('targetCustomerId').value;  //처음 고객 participantId

    let body = {
        'speakTo': 'OBJECT'
    };

    conversationsApi.patchConversationsCallParticipantConsult(conversationId, participantId, body)
        .then((data)=> {
            console.log(`---- secondCustomer patchConversationsCallParticipantConsult success! data: ${JSON.stringify(data, null, 2)}`);
        }).catch((err) =>  {
            console.log('There was a failure calling patchConversationsCallParticipantConsult');
            console.error(err);
        });

}

function unHoldApi(){
    console.log("---- unHoldApi : ", conversationList);
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    //let participantId = document.getElementById(`myParticipant`).value; // 당사자의 participantId
    //let participantId = customerParticipantId;  // 고객 participantId
    let participantId = document.getElementById('targetCustomerId').value;  //처음 고객 participantId

    let body = {
        'speakTo': 'BOTH'
    };

    conversationsApi.patchConversationsCallParticipantConsult(conversationId, participantId, body)
        .then((data)=> {
            console.log(`---- unHold patchConversationsCallParticipantConsult success! data: ${JSON.stringify(data, null, 2)}`);
        }).catch((err) =>  {
            console.log('There was a failure calling patchConversationsCallParticipantConsult');
            console.error(err);
        });

}

// Initiate a consult transfer
// jhwon 4b93aa87-91f5-4081-ab95-36d5ecefc690
// janghyun cho 6181d405-654b-4bf5-be0b-442aacecd4d4
function startConsultApi(type, value){
	transTelNo = '';
//	let consultTelNo = document.getElementById("consultTelNo").value.replace(/\D/g, "");
//	if( consultTelNo.length < 4 && type != 'clientId' ) {
//		Utils.alert("원내/원외전화번호를 입력해주세요.");
//		return;
//	}
	
	document.querySelector("#txtAgentState2").innerText = '협의중';
    transferYn = true;
    softPhoneBtnDisabled('callBlindTrans',true); //즉시전환
	softPhoneBtnDisabled('TransferInit',true); //교환
    softPhoneBtnDisabled('TransferComplete',true); //전환
    softPhoneBtnDisabled('TransferCancel',true); //교환끊기
    
	console.log("---- startConsult : ", conversationList);
	
	let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
	let conversationId = myConversationNotification.eventBody.id;
	let participantId = customerParticipantId;  // 고객 participantId
	if ( originalCustomerParticipantId != '' ) {
		participantId = originalCustomerParticipantId;
	} 
	
    let body = {}
    if ( type == 'clientId' ) {
    	body = {
			'speakTo': 'DESTINATION',
	        'destination': {
	        	'userId': value
	        }
	    };
    } else {
    	transTelNo = value;
        
    	body = {
			'speakTo': 'DESTINATION',
	        'destination': {
	        'address': value
	        }
	    };
    }
    
	originalCustomerParticipantId = participantId;
	conversationsApi.postConversationsCallParticipantConsult(conversationId, participantId, body)
	.then(()=> {
		console.log("---- Initiate a consult transfer successful !!! ");
		setTimeout(() => 
		softPhoneStateBtnCntl('TransferInit'), 1000);
	}).catch((err) => console.log(err));
	
	softPhoneLogSave("req", "교환", "startConsultApi", participantId + " / " + conversationId, "", body);		//kw---20231116 : 소프트폰 로그 이벤트 추가
}

// cancle a consult transfer
function cancleConsultApi(){
    console.log("---- startConsult : ", conversationList);
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    let participantId = originalCustomerParticipantId;  //처음 고객 participantId

    conversationsApi.deleteConversationsCallParticipantConsult(conversationId, participantId)
    .then(()=> {
        console.log("---- Delete a consult transfer returned successful !!! ");
        customerParticipantId = originalCustomerParticipantId;
        setTimeout(() => 
        softPhoneStateBtnCntl('TransferCancel'), 1000);
    }).catch((err) => console.log(err));

    softPhoneLogSave("req", "상담전환", "cancleConsultApi", participantId + " / " + conversationId, "", "");		//kw---20231116 : 소프트폰 로그 이벤트 추가
}

// complate a consult transfer
function complateConsultApi(){
    console.log("---- complateConsult : ", conversationList);
    console.log("---- myParticipantId : ", myParticipantId);
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    let participantId = myParticipantId;

    let body = {
        'state': 'DISCONNECTED'
    };
    
    conversationsApi.patchConversationsCallParticipant(conversationId, participantId,body)
        .then(()=> {
            console.log("---- complate a consult transfer returned successful !!! ");
            setTimeout(() => 
            softPhoneStateBtnCntl('TransferComplete'), 1000);
        }).catch((err) => console.log(err));
    
    softPhoneLogSave("req", "전환", "complateConsultApi", participantId + " / " + conversationId, "", body);		//kw---20231116 : 소프트폰 로그 이벤트 추가

}

// secureIVrSession
// Request URL: https://api.apne2.pure.cloud/api/v2/conversations/9f867b17-7f77-48bc-a012-4927fc805597/participants/02c640ec-d6ad-4495-8de9-193d80991991/secureIvrSessions
// participant 는 고객 participant 
// secure flow id 필요
// {"flowId":"29ce93f7-76e1-45e9-879e-634de7d8855f","userData":"34add11d-b2a0-446d-92c1-f8b3025c1b83","disconnect":false,"sourceParticipantId":"da25cb88-9f95-4344-8970-cf68d1ddd33b"}
function secureIvrSessionApi(){
    console.log("---- secureIvrSessionApi : ");
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    let participantId = document.getElementById(`targetCustomerId`).value;  //처음 고객 participantId

    let opts = {
        'body' : {
            flowId : '71227e7a-ad7b-4bb6-b458-23b515be70ae',
            userData: '34add11d-b2a0-446d-92c1-f8b3025c1b83',
            disconnect: 'false'
        }
    };
    
    conversationsApi.postConversationParticipantSecureivrsessions(conversationId, participantId, opts)
        .then((data) => {
            console.log("---- postConversationParticipantSecureivrsessions success! data: ${JSON.stringify(data, null, 2)}");
        })
        .catch((err) => {
            console.log('There was a failure calling postConversationParticipantSecureivrsessions');
            console.error(err);
        });            
}

// consult speak to Both
// address : 01089922294
// 3자 통화인가??? 음 뭐지..이건
function consultSpeakToBothApi(){
    console.log("---- consultSpeakToBothApi : ", conversationList);
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    //let participantId = document.getElementById(`myParticipant`).value; // 당사자의 participantId
    //let participantId = customerParticipantId;  // 고객 participantId            
    let participantId = document.getElementById(`targetCustomerId`).value;  //처음 고객 participantId

    let body = {
        'speakTo': 'BOTH',
        'destination':{
            'userId': "4b93aa87-91f5-4081-ab95-36d5ecefc690"                    
        }
    };

    conversationsApi.postConversationsCallParticipantConsult(conversationId, participantId, body)
        .then(()=> {
            console.log("---- complate a consult transfer successful !!! ");

        }).catch((err) => console.log(err));
}

// consult 후 conference
// 협의 후 3자통화 전환
function conferenceAfterConsultApi(){
    console.log("---- conferenceAfterConsultApi : ", conversationList);
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    let participantId = originalCustomerParticipantId;  //처음 고객 participantId

    let body = {
        'speakTo': 'BOTH'
    };
    
    firstCustomerHoldApi(false);

    conversationsApi.patchConversationsCallParticipantConsult(conversationId, participantId, body)
        .then(()=> {
            console.log("---- complate a conference after consult successful !!! ");
            softPhoneStateBtnCntl('ConferenceComplete');
        }).catch((err) => console.log(err));
}

//blind transfer
function blindTranserApi(type, value){
	transTelNo = '';
//	let consultTelNo = document.getElementById("consultTelNo").value.replace(/\D/g, "");
//	if( consultTelNo.length < 4 && type != 'clientId' && type != 'queueId' ){
//		Utils.alert("원내/원외전화번호를 입력해주세요.");
//		return;
//	}
    console.log("---- blindTranserApi : ", conversationList);
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    let participantId = myParticipantId;
    let targetUserId = document.getElementById("targetUserId").value;
    let body = {};
    if ( type == 'queueId' ) {
    	body = {
        		'queueId': value
        };
    	switch (value) {
			case '1b200197-8692-4f24-a105-4488fa3b7ef9': 
				transTelNo = '교환센터';
				break;
			case '5b94e51f-a088-4952-bf79-41b30e1b1a75':
				transTelNo = '예약센터';
				body = {
			        'address': Utils.getObjectFromList(GLOBAL.bascVlu.list, 'bsVlMgntNo', 40).bsVl1
			    };
				break;
			case '345bd3f2-6c2e-430c-bb8f-3a95223e6ccc': 
				transTelNo = '첫방문센터';
				break;
			case '2cb0421c-17e2-4110-b48c-277a3d326c37': 
				transTelNo = '테스트';
				break;
    	}
    } else if ( type == 'clientId' ) {
    	body = {
    			'userId': value
        };
    } else {
//    	let consultTelNo = document.getElementById("consultTelNo").value.replace(/\D/g, "");
    	transTelNo = value;
    	body = {
	        'address': value
	    };
    }
    
    firstCustomerHoldApi(false);
    
    conversationsApi.postConversationsCallParticipantReplace(conversationId, participantId, body)
        .then(()=> {
            console.log("---- blind transfer returned successfully ");
            setTimeout(() => 
            softPhoneStateBtnCntl('TransferComplete'), 1000);
        }).catch((Err) => {
            console.log("-- failure blind transfer !!! ");
            console.log(err);
        })
    
}

// securePause
function securePauseApi(){
    console.log("---- securePauseApi : ");
    
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    let body = {
        'recordingState': 'PAUSED'
    };
    
    conversationsApi.patchConversationsCall(conversationId, body)
        .then((data) => {
            console.log(`patchConversationsCall(securePaused) success! data: ${JSON.stringify(data, null, 2)}`);
        })
        .catch((err) => {
            console.log('There was a failure calling patchConversationsCall');
            console.error(err);
        });

}

// secureResume
function secureResumeApi(){
    console.log("---- secureResumeApi : ");
    
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    let body = {
        'recordingState': 'ACTIVE'
    };
    
    conversationsApi.patchConversationsCall(conversationId, body)
        .then((data) => {
            console.log(`patchConversationsCall(secureResume) success! data: ${JSON.stringify(data, null, 2)}`);
        })
        .catch((err) => {
            console.log('There was a failure calling patchConversationsCall');
            console.error(err);
        });

}

// ExternalTag
function setExternalTag() {
    // API
    let myConversationNotification = document.getElementById("myConversation").value;
    let conversationId = JSON.parse(myConversationNotification).eventBody.id;
    let externalTag = document.getElementById("externalTag").value;
    let body = {
        externalTag: externalTag,
    };
    
    conversationsApi.putConversationTags(conversationId, body)
        .then((data) => {
            console.log(`putConversationTags success! data: ${JSON.stringify(data, null, 2)}`);
        })
        .catch((err) => {
            console.log("There was a failure calling putConversationTags");
            console.error(err);
        });
}

// wrapup
// default wrapup code : 7fb334b0-0e9e-11e4-9191-0800200c9a66
function wrapupApi(){
    console.log("---- wrapup : ", conversationList);
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    let participantId = document.getElementById(`myParticipant`).value; // 당사자의 participantId
    let body = {
        'wrapup':{
            'code':  '7fb334b0-0e9e-11e4-9191-0800200c9a66'
        }
    };

    conversationsApi.patchConversationsCallParticipant(conversationId, participantId, body)
        .then(()=> {
            console.log("---- complate a consult transfer returned successful !!! ");
            wrapupYn = true;
        }).catch((err) => console.log("wrapup error : ",err));

}

// disconnect
function disconnectInteractionApi(){
    console.log("---- disconnect by api")
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    let participantId = myParticipantId;
    let body = {
        'state': 'disconnected'
    };
    conversationsApi.patchConversationsCallParticipant(conversationId, participantId, body)
        .then(()=> {

        }).catch((err) => {
            console.log(err)
        });
}

// hold
function holdInteractionApi(){
    console.log("---- hold or unhold by api");
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    let participantId = document.getElementById('myParticipant').value;
    let body = {
//        'held': !currentHoldState
		'held': true
    };

    conversationsApi.patchConversationsCallParticipant(conversationId, participantId, body)
        .then(() => {
//        	setTimeout(function() {
//        		body = {
//            			'held': true
//            	    };
//        		conversationsApi.patchConversationsCallParticipant(conversationId, participantId, body)
//                .then(() => {
//        		
//                }).catch((err) => console.log(err));
//    		}, 777);
        }).catch((err) => console.log(err));
}

// mute
function muteInteractionApi(){
    console.log("---- mute or unmute by api");
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    //let participantId = document.getElementById(`myParticipant`).value;
    let participantId = document.getElementById('myParticipant').value;
    let body = {
        'muted': !currentMuteState
    };

    conversationsApi.patchConversationsCallParticipant(conversationId, participantId, body)
        .then(() => {

        }).catch((err) => console.log(err));
}

//감청시작
function monitorStart(conversationId, participantId) {
	console.log("monitorStart..............")
	conversationsApi.postConversationsCallParticipantMonitor(conversationId, participantId)
    .then(() => {
    	console.log("monitorStartFinish..............")
    	monitorYn = true;
    }).catch((err) => console.log(err));
}

//코칭시작
function coachStart(conversationId, participantId) {
	console.log("coachStart..............")
	conversationsApi.postConversationsCallParticipantCoach(conversationId, participantId)
    .then(() => {
    	console.log("coachStartFinish..............")
    	coachYn = true;
    }).catch((err) => console.log(err));
}

//감청&&코칭중지
function monitorcoachStop(conversationId, participantId) {
	let body = {
		"state": "disconnected"
    };
	conversationsApi.patchConversationsCallParticipant(conversationId, myParticipantId, body)
    .then(() => {
    	monitorYn = false;
    	coachYn = false;
    }).catch((err) => console.log(err));
}



function openSocket(message){
    console.log("socket open !!! ");
}

function errorNotification(message){
    
    let now = new Date();
    console.log("socket error !!! ");
    setTimeout(() => 
        reNotification(), 1000);
}

function closeSocket(message){
    let now = new Date();
    console.log(now + " : socket close !!! ");
    setTimeout(() => 
        reNotification(), 1000);
    
}

function reNotification(){
    let now = new Date();
    console.log(now + " ---- reset nofitication ----");
    console.log(now + " ---- webSocket 재 연결시 다시 notification 등록을 위해 호출 ----");
    setNotification();
}

function transcriptionApi(){
    console.log("--- transcription start ---");
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;

    transcriptionTopic = 'v2.conversations.' + conversationId + '.transcription';

    const body = [{ id: transcriptionTopic }];
    
    notificationsApi
        .putNotificationsChannelSubscriptions(notificationChannel.id, body)
        .then((data) => {
            console.log("transcription notification success !!! ");
        })
        .catch((err) => {
            console.log("tanscription notification failed !!! ");
            console.log(err);
        });

}


function addAttribute() {
    console.log("process add addAttribute");
    document.getElementById("softphone").contentWindow.postMessage(
    JSON.stringify({
        type: "addAttribute",
        data: JSON.parse(document.getElementById("attributePayload").value),
    }),
    "*"
    );
}

function addAttributeApi() {
    console.log("--- addAttributeApi ---");
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    // 원하는 participant 설정
    let participantId = myParticipantId;
    let body = JSON.parse(document.getElementById("addAttributeBody").value);
    // key / value
    // let body = {
    //     'attributes':{
    //         "testKey": "test Value By Api"
    //     }                
    // };
    // API
    console.log("process add attribute");
    conversationsApi
    .patchConversationParticipantAttributes(conversationId, participantId, body)
    .then(() => {
        console.log("patchConversationParticipantAttributes returned successfully.");
    })
    .catch((err) => {
        console.log("There was a failure calling patchConversationParticipantAttributes");
        console.error(err);
    });
}


function getRealIdByEmail(emailAddress) {
    // API
    let inputTag = document.getElementById("targetEmail");
    let body = {
    query: [{ value: emailAddress, type: "QUERY_STRING" }],
    sortBy: "name",
    sortOrder: "ASC",
    };
    usersApi
    .postUsersSearch(body)
    .then((data) => {
        let realId = "";
        data.results.forEach((result) => {
        if (result.email == emailAddress) {
            realId = result.id;
        }
        });
        inputTag.value = realId;
    })
    .catch((err) => {
        console.log("There was a failure calling postUsersSearch");
        console.error(err);
    });
}

function getAgentConversationSummury(agentRealId) {
    // API
    let textarea = document.getElementById("agentConverstionSummary");
    let opts = {
    expand: ["routingStatus", "presence", "conversationSummary"], // [String] | Which fields, if any, to expand
    state: "active", // String | Search for a user with this state
    };
    usersApi
    .getUser(agentRealId, opts)
    .then((data) => {
        console.log(data);
        textarea.value = JSON.stringify(data);
    })
    .catch((err) => {
        console.log("There was a failure calling getUser");
        console.error(err);
    });
}

// 각 participant 의 calls[0] 부분을 가져오는 함수
function getParticipantCall(participant){
    if(!participant){
        return false;
    }

    if(participant.calls){
        if(participant.calls.length){
            return participant.calls[0];
        }
    }
    return false;
}


// 각 participant 의 정보를 로그로 남기기 위한 함수
function _logConversationDetails(conversation){
    console.log("---- 각각의 participant 정보 로그 출력 ----");
    var _this1 = this;
    if(conversation != null){
        console.log("---- conversationId : ", conversation.id);
        var logObject = {};
        conversation.participants.forEach((party) => {
            var communication = _this1.getParticipantCall(party);
            if(communication){
                var id = party.id,
                    userId = party.userId,
                    name = party.name,
                    address = party.address,
                    purpose = party.purpose;
                var state = communication.state,
                    confined = communication.confined,
                    muted = communication.muted,
                    held = communication.held;
                return logObject[id] = {
                    userId: userId,
                    name: name,
                    address: address,
                    state: state,
                    confined: confined,
                    muted: muted,
                    held: held,
                    purpose: purpose
                };
            }
        });
        conversationJson = logObject;
        if(console.table){
            return console.table(logObject);
        }
        return console.log(logObject);
    }
}


function copyCallPropsToParticipant(conversation) {
	let participantState = '';
	let participantCnt = 0;
    conversation.participants.forEach((participant) => {
    	participantCnt++;
        if (!participant.calls || participant.calls.length === 0) return;
        console.log("--- userId : ", participant.userId);
        if(participant.purpose == "agent" || participant.purpose == "user" ){
            if(myUserId == participant.userId){
                participant.purpose = participant.purpose;                    
                participant.ani = participant.calls[0].self.addressNormalized;
                participant.attributes = participant.additionalProperties;
                participant.confined = participant.calls[0].confined;
                participant.direction = participant.calls[0].direction;
                participant.dnis = participant.calls[0].other.addressNormalized;
                participant.held = participant.calls[0].held;                    
                participant.muted = participant.calls[0].muted;                    
                participant.provider = participant.calls[0].provider;
                participant.recording = participant.calls[0].recording;
                participant.recordingState = participant.calls[0].recordingState;
                participant.state = participant.calls[0].state;
                if (participant.userId) {
                	participant.user = { id: participant.userId, selfUri: '/api/v2/users/' + participant.userId };
                    myParticipantId = participant.id;
                    // transcription 을 위한 participant infomation
                    document.getElementById('myParticipant').value = participant.id;
                }
                    
                if (participant.calls[0].peerId) {
                	participant.peer = participant.calls[0].peerId;
                }

                // hold, mute 을 위한 true / false 변수 세팅
                currentHoldState = participant.held;    
                currentMuteState = participant.muted;
                callId = participant.calls[0].id;
                participantState = participant.state;
                console.log("---- purpose 가 agent 인 participants info ----");
                console.log("---- participant.purpose : ", participant.purpose);
                console.log("---- participant.user : ", participant.user);
                console.log("---- myParticipantId : ", myParticipantId);
                console.log("---- participant.ani : ", participant.ani);
                console.log("---- participant.attributes : ", participant.attributes);
                console.log("---- participant.confined : ", participant.confined);
                console.log("---- participant.direction : ", participant.direction);
                console.log("---- participant.dnis : ", participant.dnis);
                console.log("---- participant.held : ", participant.held);
                console.log("---- participant.muted : ", participant.muted);
                console.log("---- participant.provider : ", participant.provider);
                console.log("---- participant.recording : ", participant.recording);
                console.log("---- participant.recordingState : ", participant.recordingState);
                console.log("---- participant.state : ", participant.ani);
            }
        } 
        
        if(participant.purpose == "customer" || participant.purpose == "external" || participant.purpose == "voicemail" || participant.purpose == "agent" ){
        	if(myUserId != participant.userId){
        		if ( participant.calls[0].state != 'terminated'){
        			customerParticipantId = participant.id;
        			console.log("---- customerParticipant : ", participant);
        			console.log("---- customerParticipantState : ", participant.calls[0].state);
    	            console.log("---- customerParticipantId : ", customerParticipantId);
	            }
        		transCustomerParticipantId = participant.id;
        	}
        }
        if ( conversation.participants.length == participantCnt ) {
        	softPhoneStateBtnCntl(participantState);
        } 
    });
}
	

function locationreload(){
    location.reload();
}


// getRecordingMetadata
function getRecordingMetadata(){
    console.log("---- getRecordingMetadata by api");
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    
    recordingApi.getConversationRecordingmetadata(conversationId)
    .then((data) => {
        console.log(' ---- getConversationRecordingmetadata success! data: ' + JSON.stringify(data, null, 2));
        if(data[0].fileState == 'AVAILABLE'){
            if(data[0].media == 'audio'){
                document.getElementById("recordingId").value = data[0].id;    
            };
            console.log(' ---- 업로드가 완료되었습니다. 다음 단계를 진행해 주십시오!!!! ----');
        }else{
            console.log(' ---- 아직 업로드 중입니다. 잠시 후 다시 요청해주십시오!!!! ----');
        }
        
        
    })
    .catch((err) => {
        console.log(' ---- There was a failure calling getConversationRecordingmetadata');
        console.error(err);
    });
}

// getRecordingDownloadInfo
function getRecordingDownload(){
    console.log("---- getRecordingDownload by api");
    let myConversationNotification = JSON.parse(document.getElementById("myConversation").value);
    let conversationId = myConversationNotification.eventBody.id;
    let recordingId = document.getElementById("recordingId").value;
    let opts = { 
        'formatId': "mp3", // String | The desired media format. Valid values:WAV,WEBM,WAV_ULAW,OGG_VORBIS,OGG_OPUS,MP3,NONE
        'download': true, // Boolean | requesting a download format of the recording. Valid values:true,false
        'fileName': "test_"+recordingId // String | the name of the downloaded fileName
    };
    
    recordingApi.getConversationRecording(conversationId, recordingId, opts)
    .then((data) => {
        console.log(' ---- ' + data);
        console.log(` ---- getConversationRecording success! data: ${JSON.stringify(data, null, 2)}`);
        
        if(data == null){
            console.log(' ---- 파일을 준비 중입니다. 잠시 후 다시 요청해주세요!!! ---- ');
        }else{
            console.log(' ---- 파일이 준비되었습니다. 이제 파일 다운로드가 가능합니다!!! ---- ');
            console.log(` ---- recording file location url :  ${JSON.stringify(data.mediaUris.S.mediaUri, null, 2)}`);                    
        };                
        
    })
    .catch((err) => {
        console.log(' ---- There was a failure calling getConversationRecording');
        console.error(err);
    });
}


// postQueueObservation
function postQueueObservation(){
    console.log("---- postQueueObservation by api");
   
    let body =  
        {
            "filter": {
            "type": "and",
            "predicates": [
            {
                "type": "dimension",
                "dimension": "mediaType",
                "operator": "matches",
                "value": "voice"
            },
            {
                "type": "dimension",
                "dimension": "queueId",
                "operator": "matches",
                "value": "6f1e84df-0ae4-493e-9ad3-0c2c78786e09"
            }
            ]
            },
            "metrics": [
            "oInteracting",
            "oMemberUsers",
            "oUserPresences",
            "oUserRoutingStatuses",
            "oWaiting"
            ],
            "detailMetrics": [
            "oInteracting",
            "oWaiting"
            ]
        };
    
    analyticsApi.postAnalyticsQueuesObservationsQuery(body)
    .then((data) => {
        
        console.log(` ---- postAnalyticsQueuesObservationsQuery success! data: ${JSON.stringify(data, null, 2)}`);           
        
    })
    .catch((err) => {
        console.log(' ---- There was a failure calling postAnalyticsQueuesObservationsQuery');
        console.error(err);
    });
}


// postQueueAggregation
function postQueueAggregation(){
    console.log("---- postQueueAggregation by api");
   
    let body =  
        {
            "interval": "2023-04-23T15:00:00.000Z/2023-04-27T15:00:00.000Z",
            "granularity": "PT1H",
            "groupBy": [
            "divisionId",
            "mediaType",
            "originatingDirection",
            "queueId"
            ],
            "filter": {
            "type": "and",
            "predicates": [
            {
                "type": "dimension",
                "dimension": "mediaType",
                "operator": "matches",
                "value": "voice"
            },
            {
                "type": "dimension",
                "dimension": "queueId",
                "operator": "matches",
                "value": "6f1e84df-0ae4-493e-9ad3-0c2c78786e09"
            }
            ]
            },
            "views": [],
            "metrics": [
            "nOffered",
            "tAbandon",
            "tAnswered",
            "tTalkComplete"
            ]
        };
    
    analyticsApi.postAnalyticsConversationsAggregatesQuery(body)
    .then((data) => {
        
        console.log(` ---- postAnalyticsConversationsAggregatesQuery success! data: ${JSON.stringify(data, null, 2)}`);           
        
    })
    .catch((err) => {
        console.log(' ---- There was a failure calling postAnalyticsConversationsAggregatesQuery');
        console.error(err);
    });
}

// 기능 추가
function softPhoneBtnDisabled(btnNm, disabled) {
	$("." + btnNm).prop('disabled', disabled);
	$("#" + btnNm).prop('disabled', disabled);
}

var isConfirmOpen = false;

function softPhoneStateBtnCntl(state) {
	
	if ( !loginYn ) {
		setTimeout(function() {
			changeUserStatus('AVAILABLE')
	    	softPhoneStateBtnCntl('Available');
			loginYn = true;
		}, 100);
	} 
	
	let currentPresenceStatue = $("#currentPresence").text();
	let currentRoutingStatus = $("#currentRoutingStatus").text();
	console.log("TEST INDEX::::::::::::::::::::::::::::::::::");
    console.log("agentState : " , state);
    console.log("currentPresenceStatue : ", currentPresenceStatue);
    console.log("currentRoutingStatus : " , currentRoutingStatus);
    console.log("transferYn : " , transferYn);
    console.log("currentHoldState : ", currentHoldState);
    console.log("TEST INDEX::::::::::::::::::::::::::::::::::");
    
//    status_socket.send(state);
    //exch_tel_no
    let CNSL100_data = {
		"tenantId" : GLOBAL.session.user.tenantId,
		"usrId" : GLOBAL.session.user.usrId,
		"orgCd" : GLOBAL.session.user.orgCd,
		"cnslGrpCd" : GLOBAL.session.user.cnslGrpCd,
		"state" : state, //상태
		"telNumber" : custTelNum, //전화번호
		"interactionId" : myConversationId, //CallID
		"recordId"	: myParticipantId, //녹취키
		"cntcPathCd" : '',
		"callDirection" : '',
		"dnis" : '',
		"serviceCode" : '',
		"cabackAcpnNo"  : '',
		"ctiAgenId" : GLOBAL.session.user.ctiAgenId,
		"cntcCustId" : custId,
		"cntcCustNm" : custNm,
		"sttUseYn" : GLOBAL.session.user.sttUseYn,
//		"transTelNo" : transTelNo,
//		"patType" : ''
	};
    
    
    let CNSLTYPE = frme_head_CMS[0].substring(frme_head_CMS[0].length - 8, frme_head_CMS[0].length - 3);
    
	switch (state) {
		case 'Available': // 로그인시 ( 토큰만료상태에서 최초로 토큰 발급 )
			softPhoneBtnActive('')
			softPhoneBtnDisabled('btnTask',false); //기타업무
	    	softPhoneBtnDisabled('btnRest',false); //휴식
	        softPhoneBtnDisabled('btnLunch',false); //식사
	        softPhoneBtnDisabled('btnWait',false); //수신대기
			if( currentRoutingStatus == 'INTERACTING' || alertingViewYn ) {
				return;
			}
			document.querySelector("#txtAgentState2").innerText = '로그인';
	        softPhoneBtnDisabled('icoUtil_callMake',true); //전화걸기
	        break;
	    case 'On Queue': // 수신대기
	    	if( currentRoutingStatus == 'INTERACTING' || alertingViewYn ) {
				return;
			}
	    	softPhoneBtnDisabled('btnTask',false); //기타업무
	    	softPhoneBtnDisabled('btnRest',false); //휴식
	        softPhoneBtnDisabled('btnLunch',false); //식사
	        softPhoneBtnDisabled('btnWait',true); //수신대기
	        softPhoneBtnActive('btnWait');//수신대기
	        
	    	document.querySelector("#txtAgentState2").innerText = '수신대기';
	        softPhoneBtnDisabled('icoUtil_callMake',true); //전화걸기
	        break;
	    case 'Busy': // 후처리
	    	if( currentRoutingStatus == 'INTERACTING' || alertingViewYn ) {
				return;
			}
	    	softPhoneBtnDisabled('btnTask',false); //기타업무
	    	softPhoneBtnDisabled('btnRest',false); //휴식
	        softPhoneBtnDisabled('btnLunch',false); //식사
	        softPhoneBtnDisabled('btnWait',false); //수신대기
	        
	    	document.querySelector("#txtAgentState2").innerText = '후처리';
	        softPhoneBtnDisabled('icoUtil_callMake',false); //전화걸기
	        break;
	    case 'Away': // 기타업무
	    	if( currentRoutingStatus == 'INTERACTING' || alertingViewYn ) {
				return;
			}
	    	softPhoneBtnDisabled('btnTask',true); //기타업무
	    	softPhoneBtnDisabled('btnRest',false); //휴식
	        softPhoneBtnDisabled('btnLunch',false); //식사
	        softPhoneBtnDisabled('btnWait',false); //수신대기
	        softPhoneBtnActive('btnTask');//기타
	        
	    	document.querySelector("#txtAgentState2").innerText = '기타';
	        softPhoneBtnDisabled('icoUtil_callMake',false); //전화걸기
	        break;
	    case 'Meal': // 식사
	    	if( currentRoutingStatus == 'INTERACTING' || alertingViewYn ) {
				return;
			}
	    	softPhoneBtnDisabled('btnTask',false); //기타업무
	    	softPhoneBtnDisabled('btnRest',false); //휴식
	        softPhoneBtnDisabled('btnLunch',true); //식사
	        softPhoneBtnDisabled('btnWait',false); //수신대기
	        softPhoneBtnActive('btnLunch');//식사
	        
	    	document.querySelector("#txtAgentState2").innerText = '식사';
	        softPhoneBtnDisabled('icoUtil_callMake',false); //전화걸기
	        break;
	    case 'Break': //휴식
	    	if( currentRoutingStatus == 'INTERACTING' || alertingViewYn ) {
				return;
			}
	    	softPhoneBtnDisabled('btnTask',false); //기타업무
	    	softPhoneBtnDisabled('btnRest',true); //휴식
	        softPhoneBtnDisabled('btnLunch',false); //식사
	        softPhoneBtnDisabled('btnWait',false); //수신대기
	        softPhoneBtnActive('btnRest');//휴식
	        
	    	document.querySelector("#txtAgentState2").innerText = '휴식';
	        softPhoneBtnDisabled('icoUtil_callMake',false); //전화걸기
	    	break;
	    case 'Logout':
	    	document.querySelector("#txtAgentState2").innerText = '로그아웃';
	    	softPhoneBtnDisabled('btnTask',true); //기타업무
	    	softPhoneBtnDisabled('btnRest',true); //휴식
	        softPhoneBtnDisabled('btnLunch',true); //식사
	        softPhoneBtnDisabled('btnWait',true); //수신대기
	        softPhoneBtnDisabled('icoUtil_callMake',true); //전화걸기
	        break;
	    case 'dialing':	
	    	transTelNo = '';
    		$(".softPhoneBtn").removeClass('active');
    		softPhoneBtnDisabled('btnTask',true); //기타업무
	    	softPhoneBtnDisabled('btnRest',true); //휴식
	        softPhoneBtnDisabled('btnLunch',true); //식사
	        softPhoneBtnDisabled('btnWait',true); //수신대기
	    	document.querySelector("#txtAgentState2").innerText = '발신중';
	        softPhoneBtnDisabled('icoUtil_callMake',true); //전화걸기
	        softPhoneBtnDisabled('icoUtil_hangUp',false); //전화끊기
	        wrapupYn = false;
	        CNSL100_data.callDirection = '2';
	        CNSL100_data.cntcPathCd = outCntcPathCd;
	        CNSL100_data.state = 'Proceeding';
	        var CNSL100_jsonStr = JSON.stringify(CNSL100_data);
	        
	        if ( myConversationId === insConversationId && myParticipantId === insParticipantId ) {
	        	return false;
	        } else {
	        	insConversationId = myConversationId;
	    		insParticipantId = myParticipantId;
		    	Utils.ajaxCall("/cnsl/CNSL100INS01", CNSL100_jsonStr ,function(){
		    		if ( window['set' + CNSLTYPE + '02SEL01'] ) {
	        			new Function ( 'set' + CNSLTYPE + '02SEL01()')()
	        		}
		    	});
	        }
	        break;
	    case 'alerting':
	    	transTelNo = '';
	    	//감청, 코칭 구분
	    	if ( monitorYn || coachYn) {
	    		popSource.close()
	    		setTimeout(function() {
	    			$("#pickupInteraction").click();
	    		}, 1000);
	    		return;
	    	} 
    		$(".softPhoneBtn").removeClass('active');
    		softPhoneBtnDisabled('btnTask',true); //기타업무
	    	softPhoneBtnDisabled('btnRest',true); //휴식
	        softPhoneBtnDisabled('btnLunch',true); //식사
	        softPhoneBtnDisabled('btnWait',true); //수신대기
    		document.querySelector("#txtAgentState2").innerText = '수신중';
	        softPhoneBtnDisabled('icoUtil_callMake',true); //전화걸기
	        softPhoneBtnDisabled('icoUtil_hangUp',false); //전화끊기
	        softPhoneBtnDisabled('icoUtil_callAnswer',false); //전화받기
        	for (var key in conversationJson) {
        	    let conversationJsonVal = conversationJson[key];
    	    	if ( conversationJsonVal.state == 'connected' && conversationJsonVal.purpose == 'customer' ) {
    	    		custTelNum = conversationJsonVal.address.split(":")[1];
	    			let prefixToRemove = '+82';
		        	if (custTelNum.startsWith(prefixToRemove)) {
		        		custTelNum = '0' + custTelNum.substring(prefixToRemove.length);
		        	}
    	    	} 
        	}
	        
	        if (!alertingViewYn) {
	        	alertingView();
	        	alertingViewYn = true;
	        } 
            
	        wrapupYn = false;
	        CNSL100_data.callDirection = '1';
	        CNSL100_data.cntcPathCd = '10';
	        CNSL100_data.telNumber = custTelNum;
	        CNSL100_data.state = 'Alerting';
	        var CNSL100_jsonStr = JSON.stringify(CNSL100_data);
	        
	        if ( myConversationId === insConversationId && myParticipantId === insParticipantId ) {
	        	return;
	        } else {
	        	insConversationId = myConversationId;
	    		insParticipantId = myParticipantId;
		    	Utils.ajaxCall("/cnsl/CNSL100INS01", CNSL100_jsonStr ,function(){
		    		
		    	});
	        }
	        changeUserStatus('AWAY');
	    	break;
	    case 'connected':
	    	if (transferYn) {
	    		if (conversationJson[originalCustomerParticipantId].state == 'disconnected' ) {
	    			Utils.alert("고객의 전화가 끊어졌습니다.");
	    		}
	    		if ( conversationJson[customerParticipantId].state == 'dialing') {
	    			softPhoneBtnDisabled('callBlindTrans',true); //즉시전환
    		    	softPhoneBtnDisabled('TransferInit',true); //교환
    		    	softPhoneBtnDisabled('TransferComplete',true); //전환
		    		softPhoneBtnDisabled('TransferCancel',false); //교환끊기
		    		return;
		    	}
	    		if ( conversationJson[customerParticipantId].state == 'connected') {
	    			softPhoneBtnDisabled('callBlindTrans',true); //즉시전환
    		    	softPhoneBtnDisabled('TransferInit',true); //교환
    		    	softPhoneBtnDisabled('TransferComplete',false); //전환
    		    	softPhoneBtnDisabled('TransferCancel',false); //교환끊기
		    		return;
		    	}
	    		if ( conversationJson[customerParticipantId].state == 'disconnected') {
	    			document.querySelector("#txtAgentState2").innerText = '보류중';
	    			softPhoneBtnDisabled('TransferComplete',true); //전환
	    			softPhoneBtnDisabled('TransferCancel',true); //교환끊기
	    	        transferYn = false;
	    	        return;
		    	}
	    		return;
	    	}
	    	if (conferencYn) {
	    		return;
	    	}
	    	if (monitorYn) {
	    		document.querySelector("#txtAgentState2").innerText = '감청중';
	    	} else if (coachYn) {
	    		document.querySelector("#txtAgentState2").innerText = '코칭중';
	    	} else {
	    		if (currentHoldState) {
		        	document.querySelector("#txtAgentState2").innerText = '보류중';
		        	$(".icoUtil_callHold").html('<span>보류해제</span>')
		        	softPhoneBtnActive('icoUtil_callHold');//보류중
		        } else if (currentMuteState) {
		        	document.querySelector("#txtAgentState2").innerText = '음소거';
		        	$(".icoUtil_callMute").html('<span>음소거해제</span>')
		        	softPhoneBtnActive('icoUtil_callMute');//보류중
		        } else {
		        	document.querySelector("#txtAgentState2").innerText = '통화중';
		        	$(".icoUtil_callHold").html('<span>보류</span>')
		        	$(".icoUtil_callMute").html('<span>음소거</span>')
		        }
	    	}
	        softPhoneBtnDisabled('icoUtil_callMake',true); //전화걸기
	        softPhoneBtnDisabled('icoUtil_hangUp',false); //전화끊기
	        softPhoneBtnDisabled('icoUtil_callAnswer',true); //전화받기
	        softPhoneBtnDisabled('icoUtil_callHold',false); //보류
	        softPhoneBtnDisabled('icoUtil_callMute',false); //음소거
	        softPhoneBtnDisabled('icoUtil_callTrans',false); //호전환
	        
	        setTimeout(function() {
	    		softPhoneBtnDisabled('callBlindTrans',false); //즉시전환
		    	softPhoneBtnDisabled('TransferInit',false); //교환
		    	softPhoneBtnDisabled('TransferComplete',true); //전환
		        softPhoneBtnDisabled('TransferCancel',true); //교환끊기
			}, 1000);
	        popSource.close();
	        CNSL100_data.state = 'Connected';
	        var CNSL100_jsonStr = JSON.stringify(CNSL100_data);
	        
	        if ( connectedYn || monitorYn || coachYn ) {
	        	return;
	        } else {
	        	connectedYn = true;
	        	alertingViewYn = false;
	        	nowCallId = myConversationId;
	        	Utils.ajaxCall("/cnsl/CNSL100INS01", CNSL100_jsonStr ,function(){
        			cnslState = 'Connected';
            		if ( window[CNSLTYPE + '13BtnMode'] ) {
	        			new Function ( CNSLTYPE + '13BtnMode("' +cnslState+ '")')()
	        		}
            		if ( window[CNSLTYPE + '00MTabClick'] ) {
	        			new Function ( CNSLTYPE + '00MTabClick("/bcs/cnsl/' +CNSLTYPE+ '01T")')()
	        		}
            		if ( window['load' + CNSLTYPE + '01SEL01'] ) {
	        			new Function ( 'load' + CNSLTYPE + '01SEL01()')()
	        		}
	        	});
	        }
	        break;
	    case 'disconnected':
	    case 'terminated':
	    case 'TransferComplete':
	    	if ( state == 'TransferComplete' ) {
	    		CNSL100_data.state = 'Disconnect';
	    		var CNSL100_jsonStr = JSON.stringify(CNSL100_data);
	    		Utils.ajaxCall("/cnsl/CNSL100INS01", CNSL100_jsonStr ,function(){
	    			//
	    		});
	    	}
	    	if ( insConversationId !== myConversationId ) {
	        	return;
	        }
	    	$(".icoUtil_callHold").html('<span>보류</span>');
	    	softPhoneBtnActive('');
	        softPhoneBtnDisabled('icoUtil_callMake',true); //전화걸기
	        softPhoneBtnDisabled('icoUtil_hangUp',true); //전화끊기
	        softPhoneBtnDisabled('icoUtil_callAnswer',true); //전화받기
	        softPhoneBtnDisabled('icoUtil_callHold',true); //보류
	        softPhoneBtnDisabled('icoUtil_callMute',true); //음소거
	        softPhoneBtnDisabled('icoUtil_callTrans',true); //호전환
	        softPhoneBtnDisabled('callBlindTrans',true); //즉시전환
	        softPhoneBtnDisabled('TransferInit',true); //교환
	        softPhoneBtnDisabled('TransferComplete',true); //전환
	        softPhoneBtnDisabled('TransferCancel',true); //교환끊기
	        let currentPresence = $("#currentPresence").text();
	        document.getElementById("txtTargetNumber").value = '';
	        originalCustomerParticipantId = ''; //최초고객 초기화
	        customerParticipantId = '';
	        
	        transferYn = false;
	        conferencYn = false;
	        connectedYn = false;
	        popSource.close();
	        if ( monitorYn || coachYn ) {
	        	monitorYn = false;
		    	coachYn = false;
	        	return;
	        } else {
		        if ( typeof(INHB200M_patType) !== 'undefined' ) {
		        	CNSL100_data.patType = INHB200M_patType;
		        }
		        CNSL100_data.state = 'Disconnect';
	        	var CNSL100_jsonStr = JSON.stringify(CNSL100_data);
		    	Utils.ajaxCall("/cnsl/CNSL100INS01", CNSL100_jsonStr ,function(){
		    		if ( state == 'disconnected' ) {
		    			$("#btnHold span").html("보류");
		                $("#btnMute span").html("음소거");
		            	cnslState = 'Disconnect';
		            	if ( window['set' + CNSLTYPE + '13SEL01'] ) {
		        			new Function ( 'set' + CNSLTYPE + '13SEL01("' +cnslState+ '")')()
		        		}
		            	outCntcPathCd = '60';
		            	cabackAcpnNo = '';
		            	if ( window['load' + CNSLTYPE + '01SEL01'] ) {
		        			new Function ( 'load' + CNSLTYPE + '01SEL01()')()
		        		}
		            	if ( window[CNSLTYPE + '00MTabClick'] ) {
		        			new Function ( CNSLTYPE + '00MTabClick("/bcs/cnsl/' +CNSLTYPE+ '13T")')()
		        		}
		    		} 
	    		});
	        }
	        if ( state == 'disconnected' ) {
	        	
	        	if ( alertingViewYn ) {
		        	alertingViewYn = false;
		        	if (isConfirmOpen) {
		        	    return;
		        	}
		        	isConfirmOpen = true;
		        	Utils.confirm("전화를 받지 못했습니다.\n수신대기를 하시겠습니까?", function () {
		        		changeUserStatus('ON_QUEUE')
			        	softPhoneStateBtnCntl('On Queue');
		        		isConfirmOpen = false;
		        	}, function () {
		        		changeUserStatus('BUSY');
			        	softPhoneStateBtnCntl('Busy');
		        		isConfirmOpen = false;
		        	});
		        } else {
		        	
		        	if ( insConversationId === myConversationId) {
		        		prevConversationId = insConversationId;
		        		insConversationId = '';
			        }
		        	
		        	setTimeout(function() {
		        		changeUserStatus('BUSY');
			        	softPhoneStateBtnCntl('Busy');
			        	softPhoneBtnDisabled('callBlindTrans',true); //즉시전환
	    		    	softPhoneBtnDisabled('TransferInit',true); //교환
		    		}, 2000);
		        }
	        }
	        currentHoldState = false;
	        currentMuteState = false;
	        break;
	    case 'TransferInit':
	    	if ( conversationJson[transCustomerParticipantId].state == 'terminated') {
	    		document.querySelector("#txtAgentState2").innerText = '보류중';
		    	softPhoneBtnDisabled('callBlindTrans',false); //즉시전환
		    	softPhoneBtnDisabled('TransferInit',false); //교환
		        softPhoneBtnDisabled('TransferComplete',true); //전환
		        softPhoneBtnDisabled('TransferCancel',true); //교환끊기
    	        Utils.alert("상대방이 통화중입니다.");
	    	} 
//	    	var CNSL100_jsonStr = JSON.stringify(CNSL100_data);
//    		Utils.ajaxCall("/cnsl/CNSL100INS01", CNSL100_jsonStr ,function(){
	    	
//			});
	    	break;
	    case 'TransferCancel':
	    	document.querySelector("#txtAgentState2").innerText = '보류중';
	    	break;
	    case 'ConferenceComplete':
	    	document.querySelector("#txtAgentState2").innerText = '3자통화';
	    	softPhoneBtnDisabled('callBlindTrans',true); //즉시전환
	    	softPhoneBtnDisabled('TransferInit',true); //교환
	    	softPhoneBtnDisabled('TransferComplete',true); //전환
	        softPhoneBtnDisabled('TransferCancel',false); //교환끊기
	        transferYn = false;
	        conferencYn = true;
	    	break;
	}
}

function softPhoneHoldBtn() {
	softPhoneLogSave("req", "보류", "softPhoneHoldBtn", "", "", "");		//kw---20231116 : 소프트폰 로그 이벤트 추가
	$("#holdInteraction").click();
}

function softPhoneDisconnectBtn() {
	
	softPhoneLogSave("req", "전화끊기", "softPhoneDisconnectBtn", "", "", "");		//kw---20231116 : 소프트폰 로그 이벤트 추가
	
	$("#disconnectInteraction").click();
}

function receivePhonePickup() {
	
	softPhoneLogSave("req", "전화받기", "softPhonePickupBtn", "", "", "");			//kw---20231116 : 소프트폰 로그 이벤트 추가
	
	$("#pickupInteraction").click();
	
	popSource.close();
	if ( typeof(IMHB100M_fnPatSearch) != 'undefined' ) {
		IMHB100M_fnPatSearch('','','',custTelNum,'0');
	}
	if ( typeof(INHB200M_fnPatSearch) != 'undefined' ) {
		tabCNSL200M_1.select(0)
		$("#INHB210T_inpPhoneNumber").val(custTelNum);
		$("#INHB210T_inpPhoneName").val('');
		INHB200M_fnPatSearch();
	}
	if ( typeof(IMHB300M_fnPatSearch) != 'undefined' ) {
		IMHB300M_fnPatSearch('','','',custTelNum,'0');
	}
	
	
}

//전화받기 팝업 관련 함수
var popSource =$("#modalDemoPop").kendoWindow({  
	modal: false, 
	visible: false, 
	animation: false, 
	resizable: false, 
	close: function() {
		$("#modalDemoPop").parent('.k-window').removeClass('DialModal');
	}
}).data("kendoWindow");

function alertingView() {
	$('.receivePhone').removeClass('hangUp');
	popSource.center().open().wrapper.addClass('DialModal');
	$('.phoneFrame #txtTelNumber').html(custTelNum);
	$("#cntcTelNo").val(custTelNum);
	
	Utils.ajaxCall('/bizs/CRM/IsBlackList', JSON.stringify({'initNum':custTelNum}),function(result){
		if ( result.isBlackList == "N") {
			$("#custAtt").hide();
		} else {
			$("#custAtt").show();
		}
	});
	
	
	$("#Var_sMenuCd").text("");
	$("#Var_sCustomer_Certification").text("");
	$("#Var_sDNIS").text("");
	$("#Var_sDNISN_NM").text("");
	
	
	$("#sMenuCd").val("");
	$("#sCustomer_Certification").val("");
	
	
	Utils.ajaxCall("/bizs/INHA/INHB022SEL00", JSON.stringify({conversationid : myConversationId}), function (result) {
		if ( result.menuCode.length != 0) {
			$("#Var_sMenuCd").text(result.menuCode[0].menucd);
			$("#Var_sCustomer_Certification").text(result.menuCode[0].customer_certification);
			$("#Var_sDNIS").text(result.menuCode[0].dnis);
			$("#Var_sDNISN_NM").text(result.menuCode[0].orgNm);
			
			$("#sMenuCd").val(result.menuCode[0].menucd);
			$("#sCustomer_Certification").val(result.menuCode[0].customer_certification);
		}
    });
	
}

function CNSL100_fnCallBackReulst() {
	console.log("CNSL100_fnCallBackReulst")
}

function softPhoneBtnActive(softPhoneBtnClass) {
	$(".softPhoneBtn").each(function() {
		if ( $(this).hasClass(softPhoneBtnClass) || $(this).attr("id") == softPhoneBtnClass) {
			$(this).addClass('active');
		} else {
			$(this).removeClass('active');
		}
	});
}

function SOFT_fnCnslNumDisable(){
	fnStationDelete();
}

function fnCnslNumberSearch(){
	
	let bodyUsers =  
    {
			'pageSize':'100',
			'expand': ["station"]
    };
    
    usersApi.getUsers(bodyUsers)
    .then((dataUsers) => {
    	
    	let arrUsers = dataUsers.entities;
    	let userStationNum = "선택";
    	
    	stationNum = "";
    	
    	for(var i=0; i<arrUsers.length; i++){
    		if($("#pUserId").text().split("@")[0] == arrUsers[i].email.split("@")[0]){
    			
    			if(!Utils.isNull(arrUsers[i].station)){
    				if(!Utils.isNull(arrUsers[i].station.associatedStation)){
        				userStationNum = arrUsers[i].station.associatedStation.providerInfo.name;
            			stationNum = arrUsers[i].station.associatedStation.providerInfo.name;
            			$("#SOFT_btnCnslNumDisable").prop("disabled", false);
            	        $("#SOFT_spnCnslNumDisable").prop("disabled", false);
        			} else {
        				$("#SOFT_btnCnslNumDisable").prop("disabled", true);
                        $("#SOFT_spnCnslNumDisable").prop("disabled", true);
        			}
    			} else {
    				$("#SOFT_btnCnslNumDisable").prop("disabled", true);
                    $("#SOFT_spnCnslNumDisable").prop("disabled", true);
    			}
    			
    		}
    	}
    	
    	let bodyStation =  
        {
    		pageSize 	: "100",
    		pageNumber 	: "1",
    	};
    	
    	stationsApi.getStations(bodyStation).then((data) => {
    	    	
    	    	let pageCount = data.pageCount;
    	    	let forCount = 0;
    	    	let stationArr = [];
    	    	
    	    	for(var i=1; i<=pageCount; i++){
    	    		let body2 =  
    	    	    {
    	    			pageSize 	: "100",
    	    			pageNumber 	: i,
    	    		};
    	    		
    	    		stationsApi.getStations(body2)
    	    	    .then((data2) => {
    	    	    	
    	    	    	forCount++;
    	    	    	stationArr = stationArr.concat(data2.entities);
    	    	    	
    	    	    	if(forCount == pageCount){
    	    	    		
    	    	    		var resultArr = [];
    	    	    		
    	    	    		for(var k=0; k<stationArr.length; k++){
    	    	    			let obj = {
    	    	    					text 		: stationArr[k].name,
    	    	    					value 		: stationArr[k].id,
    	    	    			}
    	    	    			
    	    	    			if(userStationNum == "선택"){
    	    	    				if(stationArr[k].status == "AVAILABLE"){
        	    	    				resultArr.push(obj);
        	    	    			}
    	    	    			}
    	    	    			
    	    	    			
    	    	    		}
    	    	    		
    	    	    		Utils.changeKendoComboBoxDataSourceCustom(resultArr, stationCombo[0], "text", "value","",userStationNum);
//    	    	    		stationCombo[0] = Utils.setKendoComboBoxCustom(resultArr, "#SOFT_cnslNumCombo", "text", "value","",userStationNum);
    	    	    		$("#SOFT_cnslNumCombo").prop("disabled", true);
    	    	    	}
    	    	    	
    	    	    });
    	    		
    	    		
    	    	}
    	    	
    	    	
    	    })
    	    .catch((err) => {
    	        console.log(' ---- There was a failure calling getConversationRecordingmetadata');
    	        console.error(err);
    	    });
    });
	
}

function fnGetMe(callback){
		
	usersApi.getUsersMe().then((data) => {
		
		$("#pUserId").text(data.email);
		
		callback();
	});
	
}


function fnStationDelete(){
	
	Utils.confirm("내선번호를 해제하시겠습니까?", function () {
		
		let opts = {
		        'userId': myUserId, // Number | Page size
		    };
		
		usersApi.deleteUserStationAssociatedstation(myUserId).then((data) => {
			
			fnCnslNumberSearch();
			
			SOFTPHONE_intervalId = setInterval(function() {
				fnCnslNumberSearch();
		    }, 20000);
		});
		
	});
}

$(document).ready(function () {
	clearInterval(SOFTPHONE_intervalId);
})

//var resultArr = []
//stationCombo[0] = Utils.setKendoComboBoxCustom(resultArr, "#SOFT_cnslNumCombo", "text", "value","","");
//
//var comboBox = document.getElementById("SOFT_cnslNumCombo");

// 콤보 박스의 선택 이벤트를 처리하는 함수를 정의합니다.
function comboBoxChanged() {
	
    // 선택된 옵션의 값을 가져옵니다.
    var selectedValue = comboBox.value;
    
    usersApi.putUserStationAssociatedstationStationId(myUserId, selectedValue).then((data) => {
    	
		fnCnslNumberSearch();
		
		clearInterval(SOFTPHONE_intervalId);
		
    })
    .catch((err) => {
        console.log(' ---- There was a failure calling getConversationRecordingmetadata');
        console.error(err);
    });
}

//일괄 Wrapup 시켜버리기
function getConversations(){
    console.log("---- 로그인 시 활성콜 정보 확인 API 호출 ----");
    let resuntData = "";
    let ActiveCallConversationId = "";
    let ActiveCallParticipantId = "";
    let opts = {
        'communicationType': "Call"
    };
    conversationsApi.getConversations(opts)
        .then((data) => {
            console.log('---- [Search for Active Call] getConversation returned successfully... ---- ');
            resultData = JSON.stringify(data);                                       
            // 활성콜이 존재한다면...total 값이 0 보다 큰 경우.
            // 현재 통화중인 콜이나 wrapup 이 필요한 콜이나 모두 조회됨.
            if(data.total > 0){
                console.log("---- Active Call Info : " + resultData);
                data.entities.forEach((entitie) => {
                    // conversationId 정보
                    ActiveCallConversationId = entitie.id;
                    entitie.participants.forEach((participant) => {
                        if (!participant.calls || participant.calls.length === 0) return;
                        if(participant.purpose == "agent"){
                            if(myUserId == participant.userId){
                                // 자신의 participantId
                                ActiveCallParticipantId = participant.id;
                                console.log("---- conversationId : " + ActiveCallConversationId + " / participantId : " + ActiveCallParticipantId);
                                if(participant.calls[0].state == "terminated"){
                                    // 종료된 콜은 자동으로 wrapup 을 시킨다.
                                    autoWrapupApi(ActiveCallConversationId, participant.id);
                                }
                                /*else if(participant.calls[0].state == "connected"){
                                    // 샘플에서는 활성상태의 콜은 정보를 보여준다. 해당 콜에 대해서 어떻게 처리할지는 어플리케이션에서 결정.
                                    document.getElementById('ActiveCallConversationId').value = ActiveCallConversationId;   // 활성콜의 conversationId
                                    document.getElementById('ActiveCallParticipantId').value = ActiveCallParticipantId;     // 활성콜의 상담사 자신의 participantId
                                    document.getElementById('ActiveCallState').value = "통화중인 콜이 있음";                 // 활성콜의 상태인 connected 일 경우 통화중인 콜이 있다고 보여줌.
                                };*/                                 
                            }
                        };
                    })
                }); 
            }
        })
        .catch((err) => {
            console.log('---- There was a failure [Search for Active Call] getConversation ----');
            console.error(err);   
        });
}

//autoWrapupApi 
function autoWrapupApi(ActiveCallConversationId, participantId){
 console.log("---- auto wrapup : ", conversationList);
 let body = {
     'wrapup':{
         'code':  '7fb334b0-0e9e-11e4-9191-0800200c9a66'
     }
 };
 conversationsApi.patchConversationsCallParticipant(ActiveCallConversationId, participantId, body)
     .then(()=> {
         console.log("---- complate autoWrapupApi successful !!! ");
     }).catch((err) => console.log("wrapup error : ",err));
}


function transferInitMode() {
	
	
}

//kw---20231116 : 소프트폰 로그 데이터 저장
function softPhoneLogSave(nReqRes, nStatus, nFunctionNm, nParticipant, nSoketStatus, nJsonData){
	
	//특정 상담사 일 경우에만 로그를 쌓도록.
	if (["kt20001", "kt20001", "kt20001"].includes(GLOBAL.session.user.usrId)) {
//	if(true){
		let param = {
				cnslId 		: GLOBAL.session.user.usrId,
				cnslNm 		: GLOBAL.session.user.decUsrNm,
				reqRes		: nReqRes,
				status		: nStatus,
				functionNm	: nFunctionNm,
				participant	: nParticipant,
				soketStatus	: nSoketStatus,
				jsonData	: JSON.stringify(nJsonData),
		}
		
		Utils.ajaxCall('/SoftPhone/SoftPhoneLogSave', JSON.stringify(param), function (result) {
			
		});
	}
	
}