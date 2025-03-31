package org.crm.cmmt.VO;


import org.crm.cmmn.VO.CmmnSrchVO;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

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
public class CMMT440VO extends CmmnSrchVO {
	private String tenantId;
	private String regYr;	
	private String usrId;
	private int schdNo;
	private String orgNm;
	private String decUsrNm;

	private int jnownSeq;
	private String schdJnownCd;
	private String schdJnownDvCd;
	
	private String apndFileNm;
	private String apndFileIdxNm;
	private String apndFilePsn;
	private int schdFileSeq;
	
	private String orgCd;
	private String usrGrd;

	private String alrmCfmrId;
	private String alrmCnfmYn;

	private String alrmStgupCd;

	private String schdStrDd;

	private String regrId;
	private String regrOrgCd;
	private Timestamp lstCorcDtM;
	private String lstCorprId;
	private String lstCorprOrgCd;
	private Timestamp abolDtM;
	private String abolmnId;
	private String abolmnOrgCd;
	

}