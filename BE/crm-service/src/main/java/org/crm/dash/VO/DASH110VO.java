package org.crm.dash.VO;

import lombok.*;

import java.util.Date;

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
************************************************************************************************/

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class DASH110VO {

	//T_데시보드팔레트항목상세 t_dash_brd_plt_item_dtls
	
	private String dashBrdTypCd;						//데시보드 타입 코드
	private int itemSeq;								//항목순번
	private int itemSeqDtls;							//항목순번 상세
	private String pltItemNoUseYn;						//팔레트항목번호 사용여부
	private String pltItemCdUseYn;						//팔레트항목코드 사용여부
	private int pltItemSeq;							//팔레트항목순번
	// T_데시보드템플릿항목 t_dash_brd_tmpl_item
	private String dispCycCd;							//표시주기코드
	private String dispShpCd;							//표시형태
	
	//T_데시보드템플릿항목상세 t_dash_brd_tmpl_item_dtls
	
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
	private String pltItemCd;							//팔레트항목코드
	private int pltItemNo;								//팔레트항목번호
	private String pltDvTypCd;							//팔레트구분타입코드
	
	// 게시판게시물 공통
	private int ctgrMgntNo;								//카테고리관리번호

	private String alrmUseYn;							//알람사용여부

	// T_퀵링크메뉴 t_q_lnk__menu

	private int lnkSeq;									//링크순번
	private String qLnkDvCd;							//퀵링크구분코드
	private String qLnkNm;								//퀵링크명칭
	private String qLnkAddr;							//퀵링크주소
	private String useYn;								//사용여부


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

	private String orgCd;								//조직코드
}
