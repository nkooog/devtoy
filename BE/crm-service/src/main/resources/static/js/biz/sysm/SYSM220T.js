/***********************************************************************************************
 * Program Name : 사용자 확장정보 - Tab(SYSM220T.js)
 * Creator      : 허해민
 * Create Date  : 2022.01.25
 * Description  : 사용자 확장정보 - Tab
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.01.25     허해민           최초작성   
 * 2022.06.21     sukim            재구축
 ************************************************************************************************/
var SYSM220T1DataSource, grdSYSM220T1, SYSM220T2DataSource, grdSYSM220T2, SYSM220T3DataSource, grdSYSM220T3;
var CHATPMSSCOUNT = 4;
var selectUse = false;
var selectUseVal = '';
var selectUse2 = false;
var selectUseVal2 = '';

$(document).ready(function () {
	SYSM220T1DataSource={
			transport: {
				read : function (SYSM220T1_jsonStr) {
					if(Utils.isNull(SYSM220T1_jsonStr.data)){
						if($('#SYSM210T input[name=SYSM210T_usrId]').val() == ''){
							targetURL = '/comm/COMM100SEL01';
						}else{
							targetURL = '/sysm/SYSM220SEL01';
						}
						Utils.ajaxCall(targetURL, SYSM220T1_jsonStr, SYSM220T1_fnresult, 
							window.kendo.ui.progress($("#grdSYSM220T1"), true), window.kendo.ui.progress($("#grdSYSM220T1"), false));
					}else{
						window.kendo.ui.progress($("#grdSYSM220T1"), false);
					}
				},
			},
			schema : {
				type: "json",
				model: {
		            fields: {
		            	comCdNm            : { field: "comCdNm"            ,type: 'string' },
		            	prfRankCd          : { field: "prfRankCd"          ,type: 'string' },
		            	chnBizChoYn        : { field: "chnBizChoYn"        ,type: 'string',  editable: false},
		            	chatChnlPmssCntCd  : { field: "chatChnlPmssCntCd"  ,type: "number",  validation: { min: 0, required: true } },
		            	comCd              : { field: "comCd"              ,type: 'string',  editable: false },
		            }
				}
			}
		}
	
		$("#grdSYSM220T1").kendoGrid ({
			DataSource : SYSM220T1DataSource,
			persistSelection: true,
			sortable: true,
			selectable: true,
			editable: "incell",  //inline, incell

			columns: [ 
				{ width      : 90,    
				  field      : "comCdNm",           
				  title      : SYSM220T_langMap.get("SYSM220T.grid1.comCdNm"), 
				  type       : "String",  
				  attributes : { style : "text-align : left;" }, editable: function() {return false;}
				},
				{ width      : 40,    
				  field      : "prfRankCd",         
				  title      : SYSM220T_langMap.get("SYSM220T.grid1.prfRankCd"),      
				  type       : "String",  
				  template   : '<span class="swithCheck"><input type="checkbox" #if(prfRankCd == "Y") {# return checked #}# /><label></label></span>', editable: function() {return false;}
				},
				{ width      : 40,    
				  field      : "chnBizChoYn",       
				  title      : SYSM220T_langMap.get("SYSM220T.grid1.chnBizChoYn"),    
				  type       : "String",  
				  template   : '<input type="radio" class="k-radio" name="UseYn" value=#=comCd# #if(chnBizChoYn == "Y") {# return checked #}# onClick="SYSM220T1_fnOnChange(this);" />', editable: function() {return false;}
				},	
				{ width      : 45,    
				  field      : "chatChnlPmssCntCd", 
				  title      : SYSM220T_langMap.get("SYSM220T.grid1.chatChnlPmssCntCd"),  
				  type       : "Number",  
				  attributes : {"class": "k-text-center"} 
				}, 
				{ hidden     : true, 
			      field      : "comCd",             
			      title      : SYSM220T_langMap.get("SYSM220T.grid1.comCd"),  
			      type       : "String",  
			    },	
			],
		height : 520	
	});
	
	SYSM220T2DataSource={
			transport: {
				read : function (SYSM220T2_jsonStr) {
					if(Utils.isNull(SYSM220T2_jsonStr.data)){
						if($('#SYSM210T input[name=SYSM210T_usrId]').val() == ''){
							targetURL = '/comm/COMM100SEL01';
						}else{
							targetURL = '/sysm/SYSM220SEL01';
						}						
						Utils.ajaxCall(targetURL, SYSM220T2_jsonStr, SYSM220T2_fnresult, 
							window.kendo.ui.progress($("#grdSYSM220T2"), true), window.kendo.ui.progress($("#grdSYSM220T2"), false));
					}else{
						window.kendo.ui.progress($("#grdSYSM220T2"), false);
					}
				},
			},
			schema : {
				type: "json",
				model: {
		            fields: {
		            	comCdNm            : { field: "comCdNm"     ,type: 'string' },
		            	prfRankCd          : { field: "prfRankCd"   ,type: 'string' },
		            	comCd              : { field: "comCd"       ,type: 'string',  editable: false },
		            	grdBizChoYn        : { field: "grdBizChoYn" ,type: 'string',  editable: false }, 
		            }
				}
			}
		}
		$("#grdSYSM220T2").kendoGrid ({
			DataSource : SYSM220T2DataSource,
			persistSelection: true,
			sortable: true,
			selectable: true,
			columns: [ 
				{ width   : 110,  
				  field   : "comCdNm",      
				  title   : SYSM220T_langMap.get("SYSM220T.grid2.comCdNm"),   
				  type    : "String",  
				  attributes : { style : "text-align : left;" } 
				},
				{ width   : 40,   
				  field   : "prfRankCd",    
			      title   : SYSM220T_langMap.get("SYSM220T.grid2.prfRankCd"),   
			      type    : "String",  
			      template: '<span class="swithCheck"><input type="checkbox" #if(prfRankCd == "Y") {# return checked #}# /><label></label></span>', editable: function() {return false;} },
				{ width   : 40,   
			      field   : "comCd",        
			      title   : SYSM220T_langMap.get("SYSM220T.grid2.comCd"),   
			      type    : "String",  
			      //template: '<mark class="singleSelect k-icon k-i-radiobutton"></mark>', editable: function() {return false;} },
			      template: '<input type="radio" class="k-radio" name="mnuUseChoice" #if(grdBizChoYn == "Y") {# return checked #}# onClick="SYSM220T2_fnOnChange(this);" />', editable: function() {return false;} },
			      
				{ width   : 20,   
			      field   : "grdBizChoYn",  
			      title   : SYSM220T_langMap.get("SYSM220T.grid2.grdBizChoYn"),
			      type    : "String", 
			      hidden  : true
			    }
			],
		height : 520	
	});	

	SYSM220T3DataSource={
			transport: {
				read : function (SYSM220T3_jsonStr) {
					if(Utils.isNull(SYSM220T3_jsonStr.data)){
						if($('#SYSM210T input[name=SYSM210T_usrId]').val() == ''){
							targetURL = '/comm/COMM100SEL01';
							//console.log("SYSM220T3DataSource COMM100SEL01 ===");
						}else{
							targetURL = '/sysm/SYSM220SEL01';
							//console.log("SYSM220T3DataSource SYSM220SEL01 ===");
						}						
						Utils.ajaxCall(targetURL, SYSM220T3_jsonStr, SYSM220T3_fnresult, 
							window.kendo.ui.progress($("#grdSYSM220T3"), true), window.kendo.ui.progress($("#grdSYSM220T3"), false));
					}else{
						window.kendo.ui.progress($("#grdSYSM220T3"), false);
					}
				},
			},
			schema : {
				type: "json",
				model: {
		            fields: {
		            	procDt    : { field: "comCdNm"   ,type: 'string' },
		            	jobNo     : { field: "comCd"     ,type: 'string',  editable: false },
		            	prfRankCd : { field: "prfRankCd" ,type: 'string',  editable: false }
		            }
				}
			}
		}
		$("#grdSYSM220T3").kendoGrid ({
			DataSource : SYSM220T3DataSource,
			persistSelection: true,
			sortable: true,
			selectable: true,
			columns: [ 
				{ width: 80,    field: "comCdNm", title: SYSM220T_langMap.get("SYSM220T.grid3.comCdNm"),   type: "String" , attributes : { style : "text-align : left;" }},
				{ width: 40,    field: "comCd",   title: SYSM220T_langMap.get("SYSM220T.grid3.comCd"),  type: "String",  
					template: '<span class="swithCheck"><input type="checkbox" #if(prfRankCd == "Y") {# return checked #}# /><label></label></span>', editable: function() {return false;} },
				{ width: 20,    field: "prfRankCd",    type: "String", hidden  : true },
			],
		height : 520	
	});	
	
	
	grdSYSM220T1 = $("#grdSYSM220T1").data("kendoGrid");
	grdSYSM220T2 = $("#grdSYSM220T2").data("kendoGrid");
	grdSYSM220T3 = $("#grdSYSM220T3").data("kendoGrid");
	
	$('#SYSM220T_btnSaveCnslChn').off("click").on("click", function () {
		SYSM200T_fnSaveCnslChnAuth();
	});

	$('#SYSM220T_btnSaveMnuAuth').off("click").on("click", function () {
		SYSM220T_btnSaveMnuAuth();
	});
	
	$('#SYSM220T_btnSaveSolAuth').off("click").on("click", function () {
		SYSM220T_btnSaveSolAuth();
	});
});

function SYSM220T_fnSetKendoGrid(){
	SYSM220T1_fnCounselCheck();
	SYSM220T2_fnMenuGradeCheck();
	SYSM220T3_fnSolutionCheck();
}

function SYSM220T1_fnCounselCheck() {
	if($('#SYSM210T input[name=SYSM210T_usrId]').val() == ''){
		var SYSM220T1_param = {"codeList": [{"mgntItemCd":"C0030"}]};
	}else{
		var SYSM220T1_param = {
			"usrId"    : $('#SYSM210T input[name=SYSM210T_usrId]').val(),
			"tenantId" : $('#SYSM210T input[name=SYSM210T_tenantId]').val().toUpperCase(),
			"usrGrd": GLOBAL.session.user.originUsrGrd
		}		
	}
	SYSM220T1DataSource.transport.read(JSON.stringify(SYSM220T1_param));	
};

function SYSM220T1_fnresult(SYSM220T1_result){
	if($('#SYSM210T input[name=SYSM210T_usrId]').val() == ''){
		var SYSM220T1_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(SYSM220T1_result.codeList)));
	}else{
		var SYSM220T1_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(SYSM220T1_result.sys220sel02chnAuthlist)));
	}
	grdSYSM220T1.setDataSource(SYSM220T1_jsonDecode);
	grdSYSM220T1.dataSource.options.schema.data = SYSM220T1_jsonDecode;	
}

function SYSM220T2_fnMenuGradeCheck() {
	if($('#SYSM210T input[name=SYSM210T_usrId]').val() == ''){
		var SYSM220T2_param = {"codeList": [{"mgntItemCd":"C0024"}]};
	}else{
		var SYSM220T2_param = {
			"usrId"    : $('#SYSM210T input[name=SYSM210T_usrId]').val(),
			"tenantId" : $('#SYSM210T input[name=SYSM210T_tenantId]').val().toUpperCase(),
			"usrGrd": GLOBAL.session.user.originUsrGrd
		}		
	}
	SYSM220T2DataSource.transport.read(JSON.stringify(SYSM220T2_param));	
};

function SYSM220T2_fnresult(SYSM220T2_result){
	if($('#SYSM210T input[name=SYSM210T_usrId]').val() == ''){
		var SYSM220T2_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(SYSM220T2_result.codeList)));
	}else{
		var SYSM220T2_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(SYSM220T2_result.sys220sel02mnuAuthlist)));
	}	
	grdSYSM220T2.setDataSource(SYSM220T2_jsonDecode);
	grdSYSM220T2.dataSource.options.schema.data = SYSM220T2_jsonDecode;			
}

function SYSM220T3_fnSolutionCheck() {
	if($('#SYSM210T input[name=SYSM210T_usrId]').val() == ''){
		var SYSM220T3_param = {"codeList": [{"mgntItemCd":"C0032"}]};
	}else{
		var SYSM220T3_param = {
			"usrId"    : $('#SYSM210T input[name=SYSM210T_usrId]').val(),
			"tenantId" : $('#SYSM210T input[name=SYSM210T_tenantId]').val().toUpperCase(),
			"usrGrd": GLOBAL.session.user.originUsrGrd
		}		
	}	
	SYSM220T3DataSource.transport.read(JSON.stringify(SYSM220T3_param));	
};

function SYSM220T3_fnresult(SYSM220T3_result){
	if($('#SYSM210T input[name=SYSM210T_usrId]').val() == ''){
		var SYSM220T3_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(SYSM220T3_result.codeList)));
	}else{
		var SYSM220T3_jsonDecode = JSON.parse(JSON.parse(JSON.stringify(SYSM220T3_result.sys220sel02solAuthlist)));
	}	
	grdSYSM220T3.setDataSource(SYSM220T3_jsonDecode);
	grdSYSM220T3.dataSource.options.schema.data = SYSM220T3_jsonDecode;			
}

function SYSM220T1_fnOnChange(obj){
	//console.log("--- SYSM220T1_fnOnChange start---");
	//console.log($(obj));
	//console.log($(obj)[0].checked);
	//console.log($(obj)[0].defaultValue);
	selectUse = $(obj)[0].checked;
	selectUseVal = $(obj)[0].defaultValue;
	//console.log("--- SYSM220T1_fnOnChange end ---");
} 



function SYSM220T2_fnOnChange(obj){
	//console.log("--- SYSM220T2_fnOnChange start---");
	//console.log($(obj));
	//console.log($(obj)[0].checked);
	//console.log($(obj)[0].defaultValue);
	selectUse2 = $(obj)[0].checked;
	selectUseVal2 = $(obj)[0].defaultValue;
	//console.log("--- SYSM220T2_fnOnChange end ---");
}   

function SYSM200T_fnSaveCnslChnAuth(){
	let SYSM220T1_authcheck = $("input:checked", grdSYSM220T1.tbody).closest("tr");
	let SYSM220T1_selItem = []; 
	let SYSM220T1_chnAuthList = []; //상담채널코드만 담음
	let SYSM220T1_Item;
	let cnslChnlDvCd;
	let chatChnlPmssCntCd = 0;
    
	//체크된 행을 배열에 담음
    $.each (SYSM220T1_authcheck, function(idx, row) {
    	SYSM220T1_Item = grdSYSM220T1.dataItem(row);
    	SYSM220T1_selItem.push(SYSM220T1_Item);  
    }); 

    //체크된 행에서 코드정보만 SYSM220T1_chnAuthList에 담음
    for(let i=0; i < SYSM220T1_selItem.length; i++){
    	SYSM220T1_chnAuthList.push(SYSM220T1_selItem[i].comCd);
    }	
 
    //체크한 대상이 없을 경우
    if(SYSM220T1_selItem.length == 0) {
		//Utils.alert("상담채널을 선택하십시오.");
		Utils.alert(SYSM220T_langMap.get("SYSM220T.alert.channel"));
		return;    	
    }

    //사용하겠다는 놈좀 가져와
	if(selectUse == false){
		//Utils.alert("사용대상을 선택하십시오.");
		Utils.alert(SYSM220T_langMap.get("SYSM220T.alert.target"));
		return;   		
	}
    
	//채팅채널 선택
	if(selectUseVal == 'C2'){
		let sel = grdSYSM220T1.select();	
		if(sel.length == 0){
			//Utils.alert("저장할 대상을 선택하십시오");
			Utils.alert(SYSM220T_langMap.get("SYSM220T.alert.saveTarget"));
			return;   		
		}else{
		    $.each (sel, function(idx, row) {
		    	cnslChnlDvCd = grdSYSM220T1.dataItem(row).comCd;
		    	chatChnlPmssCntCd = grdSYSM220T1.dataItem(row).chatChnlPmssCntCd;
		    }); 
		}
		if(chatChnlPmssCntCd == null || chatChnlPmssCntCd.length == 0){
			//Utils.alert("채팅 채널수를 입력하십시오");
			Utils.alert(SYSM220T_langMap.get("SYSM220T.alert.chatChnlCnt"));
			return; 
		}
		if(chatChnlPmssCntCd > 4){
			//Utils.alert("채팅 채널수를 초과하였습니다.(최대 4)");
			Utils.alert(SYSM220T_langMap.get("SYSM220T.alert.chatChnlPmssCnt"));
			return; 			
		}
	}
	
	Utils.confirm(SYSM220T_langMap.get("common.save.msg"), function(){
		let SYSM220T1_saveData = {
			"usrId" 			  : $('#SYSM210T input[name=SYSM210T_usrId]').val(),
			"tenantId" 			  : $('#SYSM210T input[name=SYSM210T_tenantId]').val().toUpperCase(),
			"chnAuthList"         : SYSM220T1_chnAuthList,
			"cnslChnlDvCd"        : selectUse == true ? selectUseVal : '', 
			"chatChnlPmssCntCd"   : chatChnlPmssCntCd,
			"regrId"              : GLOBAL.session.user.usrId,
			"regrOrgCd"           : GLOBAL.session.user.orgCd,
			"lstCorprId"          : GLOBAL.session.user.usrId,
			"lstCorprOrgCd"       : GLOBAL.session.user.orgCd
		}
		//console.log("================= SYSM220T1_saveData => " + JSON.stringify(SYSM220T1_saveData));
		Utils.ajaxCall('/sysm/SYSM220INS01', JSON.stringify(SYSM220T1_saveData), function (SYSM220INS01_result) {	
			Utils.alert(SYSM220INS01_result.msg);
		});
	});
}

function SYSM220T_btnSaveMnuAuth(){
	//if(!SYSM220T_fnCheckUserInfo()) return;
    //체크한 메뉴등급 권한
	let SYSM220T2_authcheck = $("input:checked", grdSYSM220T2.tbody).closest("tr");
	let SYSM220T2_selItem = []; 
	let SYSM220T2_grdAuthList = []; //메뉴등급권한코드만 담음
	let SYSM220T2_Item;
	let mnuAuthCd;
	
	//체크된 행을 배열에 담음
    $.each (SYSM220T2_authcheck, function(idx, row) {
    	SYSM220T2_Item = grdSYSM220T2.dataItem(row);
    	SYSM220T2_selItem.push(SYSM220T2_Item);  
    });
    
    //체크된 행에서 코드정보만 SYSM220T2_grdAuthList에 담음
    for(let i=0; i < SYSM220T2_selItem.length; i++){
    	SYSM220T2_grdAuthList.push(SYSM220T2_selItem[i].comCd);
    }	
    
    //체크한 대상이 없을 경우   
    if(SYSM220T2_selItem.length == 0) {
		//Utils.alert("사용자등급을 선택하십시오.");
		Utils.alert(SYSM220T_langMap.get("SYSM220T.alert.grdAuth"));
		return;    	
    }

    //사용하겠다는 놈좀 가져와
	if(selectUse2 == false){
		//Utils.alert("사용대상을 선택하십시오.");
		Utils.alert(SYSM220T_langMap.get("SYSM220T.alert.target"));
		return;   		
	}
    
	let sel = grdSYSM220T2.select();	
	if(sel.length == 0){
		//Utils.alert("저장할 대상을 선택하십시오");
		Utils.alert(SYSM220T_langMap.get("SYSM220T.alert.saveTarget"));
		return;   		
	}else{
	    $.each (sel, function(idx, row) {
	    	usrGrdAuthCd = grdSYSM220T2.dataItem(row).comCd;
	    }); 
	}

	Utils.confirm(SYSM220T_langMap.get("common.save.msg"), function(){
		let SYSM220T2_saveData = {
			"usrId" 			  : $('#SYSM210T input[name=SYSM210T_usrId]').val(),
			"tenantId" 			  : $('#SYSM210T input[name=SYSM210T_tenantId]').val().toUpperCase(),
			"grdAuthList"         : SYSM220T2_grdAuthList,
			"usrGrd"              : usrGrdAuthCd,
			"regrId"              : GLOBAL.session.user.usrId,
			"regrOrgCd"           : GLOBAL.session.user.orgCd,
			"lstCorprId"          : GLOBAL.session.user.usrId,
			"lstCorprOrgCd"       : GLOBAL.session.user.orgCd
		}
		//console.log("================= SYSM220T2_saveData => " + JSON.stringify(SYSM220T2_saveData));
		Utils.ajaxCall('/sysm/SYSM220INS02', JSON.stringify(SYSM220T2_saveData), function (SYSM220INS02_result) {	
			Utils.alert(SYSM220INS02_result.msg);
		});
	});
}

function SYSM220T_btnSaveSolAuth(){
	//if(!SYSM220T_fnCheckUserInfo()) return;
    //체크한 솔루션 권한
	let SYSM220T3_authcheck = $("input:checked", grdSYSM220T3.tbody).closest("tr");
	let SYSM220T3_selItem = []; 
	let SYSM220T3_solAuthList = []; //솔루션권한코드만 담음
	let SYSM220T3_Item;
	
    $.each (SYSM220T3_authcheck, function(idx, row) {
    	SYSM220T3_Item = grdSYSM220T3.dataItem(row);
    	SYSM220T3_selItem.push(SYSM220T3_Item);  
    }); 
    
    if(SYSM220T3_selItem.length == 0) {
		//Utils.alert("부가솔루션을 선택하십시오.");
		Utils.alert(SYSM220T_langMap.get("SYSM220T.alert.solution"));
		return;    	
    }
    
	Utils.confirm(SYSM220T_langMap.get("common.save.msg"), function(){
	    for(let i=0; i < SYSM220T3_selItem.length; i++){
	    	SYSM220T3_solAuthList.push(SYSM220T3_selItem[i].comCd);
	    }	  
		let SYSM220T3_saveData = {
			"usrId" 			  : $('#SYSM210T input[name=SYSM210T_usrId]').val(),
			"tenantId" 			  : $('#SYSM210T input[name=SYSM210T_tenantId]').val().toUpperCase(),
			"solAuthList"         : SYSM220T3_solAuthList,
			"regrId"              : GLOBAL.session.user.usrId,
			"regrOrgCd"           : GLOBAL.session.user.orgCd,
			"lstCorprId"          : GLOBAL.session.user.usrId,
			"lstCorprOrgCd"       : GLOBAL.session.user.orgCd
		}
		//console.log("================= SYSM220T3_saveData => " + JSON.stringify(SYSM220T3_saveData));
		Utils.ajaxCall('/sysm/SYSM220INS03', JSON.stringify(SYSM220T3_saveData), function (SYSM220INS03_result) {	
			Utils.alert(SYSM220INS03_result.msg);
		});
	});
}

function SYSM220T_fnCheckUserInfo(){
	let SYSM210T_usrId = $('#SYSM210T input[name=SYSM210T_usrId]').val();							
	let SYSM210T_tenantId = $('#SYSM210T input[name=SYSM210T_tenantId]').val().toUpperCase();
	if(SYSM210T_usrId.length == 0 || SYSM210T_tenantId.length < 3){
		//Utils.alert("처리할 사용자 정보가 없습니다");
		Utils.alert(SYSM220T_langMap.get("SYSM220T.alert.nodata"));
		return false;
	}	
}

function SYSM220T_btnDel(param){

	//console.log("SYSM220T_btnDel param ===> " +param);
	
	var usrId = $('#SYSM210T input[name=SYSM210T_usrId]').val();
	if(usrId.length == 0 || usrId == ''){
		//Utils.alert("삭제할 사용자를 선택하십시오");
		Utils.alert(SYSM220T_langMap.get("SYSM220T.alert.delTarget"));
		return false;		
	}
	
	Utils.confirm(SYSM220T_langMap.get("common.delete.msg"), function(){
		let SYSM220T1_delData = {
			"usrId" 			  : usrId,
			"tenantId" 			  : $('#SYSM210T input[name=SYSM210T_tenantId]').val().toUpperCase(),
			"delflag" 			  : param,
			"lstCorprId"          : GLOBAL.session.user.usrId,
			"lstCorprOrgCd"       : GLOBAL.session.user.orgCd
		}
		//console.log("================= SYSM220T1_delData => " + JSON.stringify(SYSM220T1_delData));
		Utils.ajaxCall('/sysm/SYSM220DEL01', JSON.stringify(SYSM220T1_delData), function (SYSM220DEL01_result) {	
			Utils.alert(SYSM220DEL01_result.msg);
		});
	});
}
