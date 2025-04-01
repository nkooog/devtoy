package org.crm.sysm.VO;

import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
* Program Name : 상담그룹 VO
* Creator      : sjyang
* Create Date  : 2023.01.17
* Description  : 상담그룹 IF 테이블 조회
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2023.01.17     sjyang           최초생성
* ************************************************************************************************/
@Getter @Setter
public class SYSM213VO {
	private String tenantId;
	private int cnslGrpCd;
	private String cnslGrpNm;
	private String useYn;
	private String regDtm;
	private String regrId;
	private String regrOrgCd;
	private String lstCorcDtm;
	private String lstCorprId;
	private String lstCorcOrgCd;
	

}
