package org.crm.dash.VO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.sql.Timestamp;
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
* 2022.10.20     이민호			 쪽지,지식 관련 소스 제거
************************************************************************************************/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class DASH100VO {

	//T_데시보드팔레트항목상세 t_dash_brd_plt_item_dtls
	
	private String dashBrdTypCd;						//데시보드 타입 코드
	private int itemSeq;								//항목순번
	private int itemSeqDtls;							//항목순번 상세
	private String pltItemNoUseYn;						//팔레트항목번호 사용여부
	private String pltItemCdUseYn;						//팔레트항목코드 사용여부
	private int pltItemSeq;						   		//팔레트항목 순번

	//T_데시보드템플릿항목상세 t_dash_brd_tmpl_item_dtls
	private String dataFrmId;							//데이터카드 ID
	private String dataFrmePath;						//데이터카드 Path
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
	private String dispShpCd;							//표시형태
	
	// T_통합게시판카테고리 t_unfy_blbd_ctgr
	
	private String ctgrNm;								//카테고리명
	private String ctgrTypCd;							//카테고리유형코드

	private String dashBrdDispPsnCd;					// 대시보드 표시 위치 코드

	// T_게시물관리 t_blthg_mgnt
	
	private int blthgMgntNo;							//게시물관리번호
	private String blthgTite;							//게시물제목
	private String blthgStCd;							//게시물상태코드
	private String bltnTypCd;							//게시유형코드
	private String bltnTrmStrDd;						//게시기간시작일
	private String bltnTrmEndDd;						//게시기간종료일

	// T_통합게시판권한 t_unfy_blbd_atht
	
	private String orgCd;
	private String orgNm;
	private String hgrkOrgCd;
	private String comCd;
	private String comCdNm;
	private String usrNm;
	
	// 게시판게시물 공통
	
	private int ctgrMgntNo;								//카테고리관리번호
	private String alrmUseYn;							//알람사용여부
	
	// T_콜백접수 t_caback_acpn
	
	private int cabackAcpnNo;							//콜백접수번호
	private String cabackInfwShpCd;						//콜백채널구분코드
	private String cabackInclRpsno;						//ARS대표번호
	private String cabackChnlPathNm;					//콜백채널경로명
	private String cabackScnrNo;						//콜백시나리오번호
	private String inclTelNo;							//인입전화번호
	private String cabackReqTelno;						//콜백요청전화번호
	private String callId;								//CALLID
	private String custIdPathCd;						//고객ID경로코드
	private String reqTite;								//요청제목
	private String cabackProcStCd;						//콜백상태코드
	private Timestamp cabackAltmDtm;					//할당일시
	private String webCabackMsg;						//웹콜백 메시지
	private String sttTxt;								//stt텍스트
	private String vceCabackYn;							//음성콜백여부

	// T_전화예약 t_tel_rsv

	private String rsvDd;								//예약일
	private String rsvHour;								//예약시
	private String rsvPt;								//예약분
	private String rsvMemo;								//예약메모
	private String procStCd;							//처리상태코드


	// T_통합접촉이력 t_unfy_cntc_hist
	
	private String cntcChnlCd;							//접촉채널코드
	private String cntcPathMgntItemCd;					//접촉경로관리항목코드
	private String cntcPathCd;							//접촉경로코드
	private String cntcPathNm;
	private String cntcCustId;							//접촉고객	ID		
	private String cntcCustIdPathCd;					//접촉고객ID경로코드
	private String cntcChnlCustId;						//접촉채널고객ID
	private String cntcCustNm;							//접촉고객명
	private String cntcmnDvCd;							//접촉자구분코드
	private String cntcTelDvCd;							//접촉전화구분코드
	private String phrecKey;

	//업무 이관 t_biz_trcl
	
	private int cnslHistSeq;							//상담이력순번
	private String trclCtt;								//이관내용
	private Date trclDt;								//이관일자
	private String trclmnId;							//이관자ID
	private String dspsrId;								//처리자ID
	private String trclmnNm;							//이관자 이름
	
	//CALL 공통

	private int unfyCntcHistNo;							//통합접촉이력번호
	private int telCnslHistSeq;							//전화상담이력순번
	private String cntcTelNo;							//역락전화번호
	private String cmpNo;								//캠페인번호
	private String curRsvYn;							//통화예약여부
	private String trclYn;								//이관여부
	private String cnslrId;								//상담사ID
	private String jubfCnslrId;							//직전상담사ID
	private String regDdHour;							//등록일시
	private String regrBlngOrgCd;						//등록자ID
	private String lstCorcDdHour;						//최종수정일시
	private String lstCorprBlngOrgCd;					//최종수정자ID
	private String abolmnBlngOrgCd;						//폐기자소속조직코드
	
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

	private String alrmStCd;							//일정설정코드
	
	// T_일정공유 t_schd_jnown
	
	private int seq;									//순번
	private String schdJnownDvCd;						//일정공유구분코드
	private String schdJnownCd;							//일정공유코드

	
	// 일정 첨부파일
	private String apndFileNm;							//파일명
	private String apndFilePsn;							//파일 위치
	private int schd_No;								//첨부파일 일정번호
	private String apndFileIdxNm;						//파일인덱스명
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
	private String useTrmStrDd;							//사용기간시작일
	private String useTrmEndDd;							//사용기간종료일
	private int srtSeq;									//정렬순서
	private String regYr;								//등록년도
	private String usrId;								//사용자ID
	
	private String schdTypCdNm;
	private String schdDvCdNm;
	private String schdDvCdNm1;
	private String regrNm;
	private String alrmStCdNm;
	private Date startDate;
	private Date endDate;
	private int limit;
	private String custNm;
	
	private String latitude;							//위도					
	private String longitude;							//경도

	// 2022.09.27 bykim
	// 아코디언 쪽지 보관함 중복 제거 변수
	private Integer recvrCnt;
	// 2023.06.13 bykim
	// 일정관리 알람 확인 여부
	private String alarmCheck;
	
	//kw---20230220 : 미니 데시보드 전광판 채널별 현황 추가
	private String mbrdMgntItemCd;
	private String mbrdComCd;
	private String mbrdComCdNm;
	private int mbrdType1;
	private int mbrdType2;
	private int mbrdType3;
	private int mbrdType4;
	private int mbrdType5;
	private int mbrdTotal;
	private String cardStartDate;
	private String cardEndDate;

	//kw---20231117 : 뉴스레터
	
	private int nlMgntSeq;
	private String nlTite;
	private String nlCtt;
	private String nlBltnYn;
	private int nlMgntSeq2;
	private int cnslGrpCd;
	private String nlCnfmYn;
	private String nlCnfmDtm;
	private String regDtm2;
	private String regrId2;
	private String regrOrg2;

	private String dispCycCd;

}
