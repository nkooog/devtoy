
var KMST301M_Loader;
var KMST301M_GPTAskAnswerText=[];
var KMST301M_GPTAnswerObject=[];

$(document).ready(function(){
	KMST301M_Loader = $('#loader').kendoLoader({
		visible:false,
		type: "converging-spinner",
		size: 'large'
	}).data("kendoLoader");
})

$('#KMST301M_input').keydown(function(e) {
	if(e.key ==="Enter"){ KMST301M_fnSearchCheck();}
});

function KMST301M_fnSearchCheck() {

	let text = $("#KMST301M_input").val();
	if( text ===''){Utils.alert("검색어가 없습니다."); return;}

	$('#KMST301M_ChatRoom').append(KMST301M_fnGetAskhtml(text));

	$("#KMST301M_input").val("");
	$("#KMST301M_search").prop("disabled", true);
	$("#KMST301M_clear").prop("disabled", true);

	KMST301M_GPTAskAnswerText.push(text);

	Utils.ajaxCall('/kmst/KMST301SEL01',JSON.stringify({query : text}),function(data){

		KMST301M_GPTAnswerObject.push(data.obj);
		for (const choices of data.obj.choices) {
			$('#KMST301M_ChatRoom').append(KMST301M_fnGetAnswerhtml(choices.message.content));
			KMST301M_GPTAskAnswerText.push(choices.message.content);
		}

		$("#KMST301M_search").prop("disabled", false);
		$("#KMST301M_clear").prop("disabled", false);
 	}, function(){KMST301M_Loader.show();},function(){KMST301M_Loader.hide();},function(){KMST301M_Loader.hide();});
}


function KMST301M_fnClar(){
	$('#KMST301M_ChatRoom').empty();
	$("#KMST301M_input").val("");
	KMST301M_GPTAnswerObject=[];
	KMST301M_GPTAskAnswerText=[];
}

function KMST301M_fnGetAnswerhtml(text){
	return "<div class=\"answer\">\n" +
		"      <div class=\"profile fl\"></div>\n" +
		"      <p>"+text+"</p>\n" +
		"    </div>";
}
function KMST301M_fnGetAskhtml(text){
	return "<div class=\"ask\">\n" +
		"      <div class=\"profile fr\"></div>\n" +
		"      <p>"+text+"</p>\n" +
		"    </div>";
}

