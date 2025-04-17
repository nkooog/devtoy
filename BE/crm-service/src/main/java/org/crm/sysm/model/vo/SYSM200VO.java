package org.crm.sysm.model.vo;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

/***********************************************************************************************
* Program Name : 사용자 정보관리 VO
* Creator      : 허해민
* Create Date  : 2022.01.17
* Description  : 사용자 정보관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.17     허해민           최초생성
************************************************************************************************/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SYSM200VO {
	
	// T_사용자_정보_관리
	private String tenantId;									/* 테넌트_ID*/	
	private String usrId; 										/* 사용자_ID*/
	private String scrtNo; 										/* 비밀_번호*/	
	private String decScrtNo; 									/* 복호화된_비밀_번호*/	
	private String acStCd;  									/* 계정_상태_코드 1.정상 2.계정잠김 3.사용만료  */ 	
	private String acStCdNm;                                    /* 계정_상태_코드명 */
	private String acStRsnCd; 									/* 계정_상태_사유*/ 
	private String scrtNoLstUpdDtm;								/* 비밀_번호_최종_변경_일시*/
	private String scrtNoOverDays;								/* 비밀_번호_변경_초과_일수*/
	private int pwErrTcnt;										/* 비밀번호_오류_횟수*/
	private String usrNm;										/* 사용자_명*/
	private String decUsrNm;									/* 복호화된_사용자_명*/
	private String usrAlnm; 									/* 사용자_별칭*/
	private String usrAlnmUseYn; 								/* 사용자_별칭_사용여부*/
	private String potoImgFileNm;								/* 사진이미지파일명*/
	private String potoImgIdxFileNm;							/* 사진_이미지_인덱스_파일_명*/
	private String potoImgPsn;									/* 사진_이미지_위치 */
	private String orgCd;							 			/* 조직_코드 */
	private String orgPath; 						 			/* 조직_경로 */
	private String orgNm;                                       /* 조직명   */
	private String mbphNo;										/* 휴대전화_번호 */
	private String decMbphNo;									/* 복호화된 휴대전화_번호 */
	private String emlAddrIsd; 									/* 이메일_주소_내부 */
	private String decEmlAddrIsd; 								/* 복호화된_이메일_주소_내부 */
	private String emlAddrIsdDmn; 								/* 이메일_주소_내부_도메인 */
	private String emlAddrIsdDmnCd; 							/* 이메일_주소_내부_도메인코드 */
	private String emlAddrIsdDmnCdTxt;							/* 이메일_주소_내부_도메인코드 텍스트값 */
	private String emlAddrExtn; 								/* 이메일_주소_외부 */
	private String decEmlAddrExtn; 								/* 복호화된_이메일_주소_외부 */
	private String emlAddrExtnDmn; 								/* 이메일_주소_외부_도메인*/
	private String emlAddrExtnDmnCd; 							/* 이메일_주소_외부_도메인코드*/
	private String emlAddrExtnDmnCdTxt;							/* 이메일_주소_외부_도메인코드 텍스트값*/
	private String qualAcqsDd; 									/* 자격_취득_일 */
	private String qualLossDd;							 		/* 자격_상실_일 */
	private String usrGrd; 										/* 사용자_등급 */
	private String originUsrGrd;
	private String usrGrdNm; 									/* 사용자_등급명 */
	private String unfyBlbdCreAthtYn;							/* 통합_게시판_생성_권한_여부 */
	private String kldCtgrCreAtht;  							/* 지식_카테고리_생성_권한 */
	private String athtLvlOrgCd; 			 					/* 권한_레벨_조직_코드*/
	private String athtLvlDtCd; 								/* 권한_레벨_일자 */
	private String kldScwdSaveYn;								/* 지식_검색어_저장_여부 */
	private String autoPfcnUseYn;								/* 자동_완성_사용_여부 */
	private String lstLginDtm;									/* 최종로그인일시 */
	private String lstLginIpAddr;							 	/* 최종_로그인_IP_주소 */
	private String lstLginExtNo;								/* 최종_로그인_내선_번호 */
	private String lstLgoutDtm;									/* 최종로그아웃일시*/
	private String lstLgoutIpAddr;								/* 최종_로그아웃_IP_주소 */
	private String lstLgoutExtNo;								/* 최종_로그아웃_내선_번호*/
	private String cnslGrpCd;									/* 상담그룹코드 - 서비스운영 IF */
	
	// T_사용자_메뉴_권한
	private String prfRankCd;									/* 우선_순위_코드*/	
	// T_상담_채널_권한
	private String cnslChnlDvCd;								/* 상담_채널_구분_코드*/
	private String chatChnlPmssCntCd;							/* 채팅_채널_허용_수_코드*/						
	// T_부가_솔루션_사용_권한
	private String adtnSltnDvCd;								/* 부가_솔루션_구분_코드*/
	// T_텔레_셋_정보
	private String ctiUseYn;									/* CTI_사용_여부*/
	private String ctiAgenId;									/* CTI_AGENT_ID*/
	private String extNo;										/* 내선_번호*/
	private String useTermIpAddr;								/* 사용_단말_IP_주소*/
	private String regDtm;										/* 등록일시 */
	private String regrId;										/* 등록자_ID*/
	private String regrOrgCd;									/* 등록자_조직_코드*/
	private String lstCorcDtm;									/* 최종수정일시*/
	private String lstCorprId;									/* 최종_수정자_ID*/
	private String lstCorprOrgCd;								/* 최종_수정자_조직_코드*/
	private String abolDtm;										/* 폐기일시*/
	private String abolmnId;									/* 폐기자_ID*/
	private String abolmnOrgCd;									/* 폐기자_조직_코드*/
	private String emlSndGrpsAddr;
	private String retireYn; 									/* 재직여부 */
	private String cntyCd;                                      /* 국가코드 */
	private String tranMode;                                    /* 처리방식 INS : 신규등록 else 변경 */ 
	private String solBizChoYnCd;                               /* 솔루션권한 선택코드 */ 
	
	private List<String> grdList= new ArrayList<String>();
	private List<String> orgList= new ArrayList<String>();
	private List<String> usrList= new ArrayList<String>();
	
	private String srchKeyword1;                                /* 이름검색키워드1(성)*/ 
	private String srchKeyword2;                                /* 이름검색키워드2(성+2번째 자리 글자)*/ 
	private String cmmtSetlmnYn;                                /* 커뮤니티결제자여부*/ 
	private String kldMgntSetlmnYn;                             /* 지식관리결제자여부*/ 
	
	private String chnBizChoYn;                                 /* 상담채널권한 업무선택여부*/ 
	private String grdBizChoYn;                                 /* 메뉴등급권한 업무선택여부*/ 

	
	private List<String> chnAuthList= new ArrayList<String>();  /* 상담채널권한 리스트*/ 
	private List<String> grdAuthList= new ArrayList<String>();  /* 메뉴등급권한 리스트*/ 
	private List<String> solAuthList= new ArrayList<String>();  /* 솔루션사용권한 리스트*/
	
	private String comCd;
	private String comCdNm;
}