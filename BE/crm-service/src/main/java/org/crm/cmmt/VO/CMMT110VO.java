package org.crm.cmmt.VO;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

/***********************************************************************************************
 * Program Name : 통합 게시판 권한 VO
 * Creator      : 정대정
 * Create Date  : 2022.05.02
 * Description  : 통합게시판 권한 VO
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.05.02      정대정           최초생성
 ************************************************************************************************/

@Getter @Setter
public class CMMT110VO {

	private String tenantId;
	private int ctgrMgntNo;
	private int athtSeq;
	private String ctgrUseAthtCd;
	private String athtCd;
	private String athtView;
	private String rdPmssYn;
	private String writPmssYn;
	private String corcPmssYn;
	private String delPmssYn;
	private String replyPmssYn;
	private String goodPmssYn;
	private String apndFileDnldPmssYn;
	private Timestamp regDtm;
	private String regrId;
	private String regrOrgCd;
	private Timestamp lstCorcDtm;
	private String lstCorprId;
	private String lstCorprOrgCd;
	private Timestamp abolDtm;
	private String abolmnId;
	private String abolmnOrgCd;


}


