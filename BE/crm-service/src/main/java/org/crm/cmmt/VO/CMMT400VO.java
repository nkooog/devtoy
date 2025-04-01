package org.crm.cmmt.VO;

import org.crm.cmmn.VO.CmmnSrchVO;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.List;

/***********************************************************************************************
* Program Name : 통합게시글관리-게시판형  VO
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 공지사항상세 
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
@Getter
@Setter
public class CMMT400VO extends CmmnSrchVO {
	
	private String tenantId;
	private String regYr;	
	private String usrId;
	private String userNm;
	private int schdNo;
	private String schdTypCd;
	private String schdDvCd;
	private String schdTite;
	private String schdCtt;
	private String schdStrDd;
	private String schdStrSi;
	private String schdStrPt;
	private String schdEndDd;
	private String schdEndSi;
	private String schdEndPt;

	private List<CMMT440VO> CMMT400VOList;
	private List<CMMT440VO> CMMT400FileList;

	private int alrmSeq;
	private String alrmNm;
	private String alrmDd;
	private String alrmSi;
	private String alrmPt;
	private String alrmGapDvCd;
	private int alrmStgupTcnt;
	private int alrmTcnt;
	private int alarmCnt;
	private String alrmStCd;

	private String alrmStgupCd;

	private String loginId;
	
	private String regrId;
	private String regrOrgCd;
	private Timestamp lstCorcDtM;
	private String lstCorprId;
	private String lstCorprOrgCd;
	private Timestamp abolDtM;
	private String abolmnId;
	private String abolmnOrgCd;
	

}