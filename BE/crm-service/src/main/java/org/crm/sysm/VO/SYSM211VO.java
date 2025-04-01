package org.crm.sysm.VO;

import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
* Program Name : 사용자찾기 팝업 VO
* Creator      : sukim
* Create Date  : 2022.04.15
* Description  : 사용자찾기 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.15     sukim           최초생성
************************************************************************************************/
@Getter @Setter
public class SYSM211VO {
	private String tenantId;
	private String usrId;
	private String usrNm;
	private String decUsrNm;
	private String usrGrd;
	private String usrGrdNm;
	private String acStCd;
	private String acStCdNm;
	private String orgCd;
	private String orgNm;
	private String orgPath;
	private String acStRsnCdNm;
	private String fmnm;
	private String srchKeyword1;
	private String srchKeyword2;
	private int keywordLen;

	private String cmmtSetlmnYn;

	private String kldMgntSetlmnYn;

}
