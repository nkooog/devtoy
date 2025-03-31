package org.crm.cmmt.VO;

import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
 * Program Name : 커뮤니티 VO (권한 조회 결과)
 * Creator      : 김보영
 * Create Date  : 2023.03.08
 * Description  : 커뮤니티
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.03.08    김보영           최초생성
 ************************************************************************************************/

@Getter @Setter
public class CMMT201VO {
	private String  tenantId;
	private int     ctgrNo;
	private int     cntntsNo;
	private String  writPmssYn;
	private String  corcPmssYn;
	private String  delPmssYn;
	private String  replyPmssYn;
	private String  goodPmssYn;
	private String  apndFileDnldPmssYn ;
	private String  ctgrNm;
	private int prsLvl;
	private int srtSeq;
	private int hgrkCtgrNo;
	private String athtCd;
	private String brdpath;
	private int count;

	private String ctgrAttrCd;


}
