/***********************************************************************************************
 * Program Name : 크로스에디터 공통 라이브러리(crossEditor.js)
 * Creator      : djjung
 * Create Date  : 2022.03.14
 * Description  : 크로스에디터 공통 라이브러리
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.14     djjung           최초생성      
 * 2022.07.11     djjung           형식 변경
 ************************************************************************************************/

var cEditor = (function(){
	return {
		/**
		 * CrossEditor 생성
		 *
		 * @param {string} elemntID 부모 DIV ID
		 * @param {string} width 가로 100 이하는 % 나머지 px
		 * @param {string} hight 높이 100 이하는 % 나머지 px
		 * @param {int?string} toolbarsimple 1 = text용, 2 = 1줄, 3 = 2줄, string = 사용자정의
		 * @param {function} Uploadfunction 업로드 함수 재정의
		 */
		Creater : function(elemntID,width,hight,toolbarsimple,Uploadfunction){
			let timeStamp = Math.floor(Math.random() * 100).toString() + new Date().getTime();

			let CrossEditor = new NamoSE(timeStamp);

			//문서형식
			CrossEditor.params.DefaultDocType = "<!DOCTYPE html>"					//기본 문서타입
			CrossEditor.params.DefaultFont = "맑은 고딕";								//기본 폰트
			CrossEditor.params.DefaultFontSize = "10pt";							//기본 폰트 사이즈

			//입력 보안
			//CrossEditor.params.AttributeBlockList = ["onclick", "onerror"];      // HTML 속성 제한  미설정시 기본값 = 기본값은 확인필요
			//CrossEditor.params.TagBlockList = ["form", "iframe"];				   // HTML 태그 제한  미설정시 기본값 = 기본값은 확인필요

			//크기
			if(width <= 100){ width += "%";}else{ width += "px";}
			if(hight <= 100){ hight += "%";}else{ hight += "px";}
			CrossEditor.params.Width = width; 										//에디터 가로설정
			CrossEditor.params.Height = hight;									//에디터 높이설정 (최소 높이 값은 '300px', 300px이하 반영 안됨
			CrossEditor.params.ResizeBar = false;									//에디터 높이조절여부 표시

			//툴바 및 메뉴바
			CrossEditor.params.Menu = false;										//메뉴바 사용/미사용
			CrossEditor.params.UserToolbar = true;									//툴바 사용/미사용


			if (typeof toolbarsimple !== "string") {
				if (toolbarsimple === 1) {
					CrossEditor.params.CreateToolbar = "fontname|fontsize|lineheight|bold|italic|underline|strikethrough|word_color|spacebar|spacebar|word_justify|word_indentset";
				} else if(toolbarsimple === 2) {
					CrossEditor.params.CreateToolbar = "formatblock|fontname|fontsize|lineheight|word_color|spacebar|image|flash|tableinsert|blockquote|spacebar|formatcopy|spacebar|word_justify|word_indentset|spacebar|word_listset";
				}else{
					CrossEditor.params.CreateToolbar = "undo|redo|copy|cut|paste|search|replace|spacebar|image|specialchars|hyperlink|spacebar|tableinsert|tablerowinsert|tablerowdelete|tablecolumninsert|tablecolumndelete|tablecellmerge|tablecellsplit|tablecellattribute|tablecellbgcolor|tableborder_group|spacebar|txtmargin|paragraphsetup|enter|formatblock|fontname|fontsize|lineheight|word_color|spacebar|word_script|blockquote|spacebar|formatcopy|spacebar|word_justify|word_indentset|spacebar|word_listset";
				}
			} else {
				CrossEditor.params.CreateToolbar = toolbarsimple;
			}

			//기타
			CrossEditor.params.ParentEditor = document.getElementById(elemntID);	//DIV ID
			//CrossEditor.params.DocBaseURL = "/ce/newdoc.html";                    //기본 서식 URL
			// CrossEditor.params.Readonly = true;									//편집창 읽기전용사 상태로생성

			//파일 업로드
			//CrossEditor.params.ImageSavePath = "/ce/crosseditor_images";          //이미지 업로드 경로 설정
			CrossEditor.params.UploadFileSizeLimit= "image:20971520,movie:20971520"; //용량 제한-기본 5MB, 설정단위 = byte, image,flash,movie,file
			CrossEditor.params.UploadFileSubDir = false;							//파일업로드시 서브 폴더생성여부 100개이상시 서브폴더생성
			CrossEditor.params.UploadFileExtBlockList = ["mp4"];             		//파일 넣기시 허용할 확장자 설정 , 미설정시 기본값 = 기본값은 확인필요
			CrossEditor.params.UploadFileNameType = "real";						    //real   = 원본 파일의 파일명으로 저장 (기본 값)
			//trans  = 원본 파일의 파일명을 변환하여 저장 (Base64)
			//random = 원본 파일의 파일명을 변환하여 저장 (yyyyMMddHHmmssfff_Random문자 8자리)
			CrossEditor.params.event.UploadProc=Uploadfunction;

			// CrossEditor.params.UseEnhancedImageInsert = false;    //사용 금지
			// CrossEditor.params.EnhancedImageInsertUploadQuality = 0.6; //사용 금지

			CrossEditor.params.TableLineColor = "none";

			CrossEditor.EditorStart();
			return CrossEditor;
		},
		GetHTML:function(CrossEditor){
			return CrossEditor.GetValue("HTML");//HTML형식으로 폼가져오기
		},
		GetText:function(CrossEditor){
			return CrossEditor.GetTextValue(); //Text형식으로 폼가져오기
		}

	}
})();