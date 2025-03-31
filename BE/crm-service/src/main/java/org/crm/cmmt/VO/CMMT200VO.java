package org.crm.cmmt.VO;

import lombok.*;

import java.sql.Timestamp;
import java.util.List;

/***********************************************************************************************
* Program Name : 통합계시글관리 VO
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 통합계시글관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CMMT200VO {
	
	private String tenantId;
	
	private String writPmssYn;
	private String corcPmssYn;
	private String delPmssYn; 
	private String replyPmssYn; 
	private String goodPmssYn; 
	private String apndFileDnldPmssYn; 
	
	private int ctgrMgntNo;
	private String ctgrNm;
	private String ctgrTypCd;
	private int prsLvl;
	private int srtSeq;
	private int hgrkCtgrMgntNo;
	private String useTrmStrDd;
	private String useTrmEndDd;
	private String athtCd;
	
	private String scwd;
	private int srchTcnt;
	private int blthgMgntCnt;
	
	private String myScwd;
	private String usrId;
	private String orgCd;
	private String brdPath;
	private String usrGrd;
	
	private int inMySc;
	private String scwdDate;
	private String kldScwdSaveYn;
	private String autoPfcnUseYn;
	
	private String permUseYn;
	private String atclWritPmssYn;
	private String replyWritPmssYn;
	private String alrmUseYn;
	private String dashBrdDispPmssYn;
	private String ctgrUseAthtCd;
	private String blthgApvNcsyYn;
	private String alarmUseYnCtgr;
	
	private int apndFilePmssCunt; 			
	private String apndFileSzUnitCd;
	private int apndFileMaxSz; 
	private int apndFileAllSz; 
	
	private String regrId;
	private Timestamp regDtm;
	private String regrOrgCd;
	private Timestamp lstCorcDtM;
	private String lstCorprId;
	private String lstCorprOrgCd;
	private Timestamp abolDtM;
	private String abolmnId;
	private String abolmnOrgCd;
	
	private List<String> boardList;

	private String      usrGrdCd;
	private int         ctgrNo;
	private boolean    isAdmin;
	private List<Integer> ctgrNoList;
	//키워드 검색용 추가
	private String type;
	private String keyWord;
	private Timestamp startDate;
	private Timestamp endDate;
	private List<String> knowState;
	private List<String> knowRegId;

	//상태 만료
	private String kldStCd;
	private int cntntsNo;
	private int limit;

	private int setDay;
	//열람구분
	private String puslYn;

	// 2022.10.20
	// 대시보드 위치
	private String dashBrdDispPsnCd;

	private int ctgrAttrCd;
	private int hgrkCtgrNo;
	private String cntntsRegApvNcsyYn;

	//kw---20230614 추가
	private String usrNm;
	private String blthgStCd;
	private String blthgTitle;
	private String apndCount;
	private String bltnCttTxt;
	private String blthgMgntNo;
	private int itemCount;
	private String blthgRpsImg;
	private String blthgRpsImgIdxNm;
	private String blthgRpsImgPsn;
	private String ctgrAdmnId;
	
	//kw---20230615 검색어 추가
	private String srchTitleType;
	private String srchTitle;
	private String[] srchState;
	private String srchReadYn;
	private String[] srchReg;
	private String encryptYn;
	private String srchStartDate;
	private String srchEndDate;
	
	//kw---20230703 : 권한별로 읽기 게시물
	private String rdPmssYn;		//읽기 권한

}
