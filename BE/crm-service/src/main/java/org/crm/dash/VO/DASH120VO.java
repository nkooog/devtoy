package org.crm.dash.VO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.util.List;

/***********************************************************************************************
* Program Name : Dashboard 메인
* Creator      : 강동우
* Create Date  : 2022.05.13
* Description  : Dashboard 메인
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.28     강동우           최초생성
* 2022.09.20     김보영           수정
************************************************************************************************/

@Getter
@Setter
public class DASH120VO {

	//T_데시보드팔레트항목상세 t_dash_brd_plt_item_dtls
	
	private String dashBrdTypCd;						//데시보드 타입 코드
	private int itemSeq;								//항목순번
	private int itemSeqDtls;							//항목순번 상세
	
	// T_데시보드템플릿항목 t_dash_brd_tmpl_item
	private String dispCycCd;							//표시주기코드
	private String dispShpCd;							//표시형태
	
	
	//T_데시보드템플릿항목상세 t_dash_brd_tmpl_item_dtls
	private String dataFrmId;
	private String dataFrmePath;
	private String titeTypCd;							//테마유형코드
	private String themeTite;							//테마제목
	private String dispCtt;								//표시제목
	private String bgColrCd;							//배경색코드
	private String bgColrR;								//배경색R
	private String bgColrG;								//배경색G
	private String bgColrB;								//배경색B
	private String atclmnColrCd;						//글자색코드
	private String atclmnColrR;							//글자색R
	private String atclmnColrG;							//글자색G
	private String atclmnColrB;							//글자색B
	private String atclmnTypCd;							//글자유형코드
	private String atclmnSzCd;							//글자크기코드
	private int imgIdx;									//이미지인덱스
	private String fileNm;								//파일명
	private String fileNmIdx;							//파일명인덱스
	private String filePsn;								//파일위치
	private String actYn;								//활성여부
	
	// 팔레트 템플릿 공통
	private String pltDvCd;								//팔레트구분코드

	private String beforeDvCd;							//이전 팔레트 코드

	private String beforeCtgrNo;						//이전 카테고리 번호
	private String pltItemCd;							//팔레트항목코드
	private int pltItemNo;								//팔레트항목번호
	
	// T_쪽지발신함 t_note_dpch_box
	
	private String dpchmnId;							//보낸사람ID
	private String noteWrtgDvCd;						//쪽지작성구분코드
	private String dpchNoteStCd;						//쪽지상태코드
	private String replyReqYn;							//회신요정여부
	private String otxtNoteRegYr;						//원본쪽지등록년도
	private String otxtNoteNo;							//원본쪽지번호
	

	// T_내지식 t_my_kld ( 지식 공통 )
	
	private int ctgrNo;									//카테고리번호
	private int cntntsNo;								//컨텐츠번호

	// 게시판게시물 공통
	private String alrmUseYn;							//알람사용여부
	
	// T_퀵링크메뉴 t_q_lnk__menu
	
	private int lnkSeq;									//링크순번
	@JsonProperty("qLnkDvCd")
	private String qLnkDvCd;							//퀵링크구분코드
	@JsonProperty("qLnkNm")
	private String qLnkNm;								//퀵링크명칭
	@JsonProperty("qLnkAddr")
	private String qLnkAddr;							//퀵링크주소
	private String useYn;								//사용여부
	
	// T_일정관리 t_schd_mgnt
	
	private int schdNo;									//일정번호
	private String schdTypCd;							//일저유형코드
	private String schdDvCd;							//일정구분코드
	private String schdTite;							//일정제목
	private String schdCtt;								//일정내용
	private String schdStrDd;							//일정시작일
	private String schdStrSi;							//일정시작시
	private String schdStrPt;							//일정시작분
	private String schdEndDd;							//일정종료일
	private String schdEndSi;							//일정종료시
	private String schdEndPt;							//일정종료분
	private String alrmStgupCd;							//일정설정코드
	
	//공통코드
	
	private String mgntItemCd;
	private String mlingCd;
	private String hgrkComCd; 
	private String subCdYn; 
	private String subMgntItemCd;
	private int    mapgVluCnt;
	private String mapgVluUnitCd;
	private String mapgVlu1;
	private String mapgVlu2;
	private String mapgVlu3;
	private String useDvYn;
	private String tenantNm;
	private String fmnm;
	private String fmnmEng;
	private String orgLvlCd;

	//공통
	
	private String tenantId;							//테넌트 아이디
	private String usrGrd;								//사용자등급
	private String regDtm;								// 등록_일시
	private String regrId;								// 등록자_ID
	private String regrOrgCd;							// 등록자_조직_코드
	private String lstCorcDtm;							// 최종_수정_일시
	private String lstCorprId;							// 최종_수정자_ID
	private String lstCorprOrgCd;						// 최종_수정자_조직_코드

	private String lstCorcOrgCd;
	private String abolDtm;								// 폐기_일시
	private String abolmnId;							// 폐기자_ID
	private String abolmnOrgCd;							// 폐기자_조직_코드
	private String apvDtm;								//승인일시
	private String apprId;								//승인자ID
	private String apprOrgCd; 							//승인자조직코드
	private Date useTrmStrDd;							//사용기간시작일
	private Date useTrmEndDd;							//사용기간종료일
	private int srtSeq;									//정렬순서
	private String regYr;								//등록년도
	private String usrId;								//사용자ID
	private String checkPath;							//테마,명언 이미지 경로 확인
	MultipartFile pltItemImg;
	private List<DASH120VO> DASH120VOlist;

	//2022.10.12 bykim
	//템플릿 게시판 등록 시 게시판 번호 변수
	private Integer ctgrMgntNo;
	//템플릿 오늘의 명언 이미지 존재 여부 확인
	private String imgExist;

	// 템플릿 오늘의 날씨 등록시 사용 변수
	private String url;
	private String certKey;

}
