package org.crm.sysm.VO;

import lombok.*;
import java.util.Date;

/***********************************************************************************************
* Program Name : 태넌트 정보관리 팝업 VO
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 태넌트 정보관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SYSM101VO {

	private String tenantId;
	private String dmnCd;

	private String spTypCd;

	private String tenantStCd;
	private String tenantStRsnCd;
	private String fmnm;
	private String fmnmEng;
	private String reprNm;
	private String reprNmEng;
	private String svcTypCd;
	private String usrAcCnt;
	private String emlSndGrpsAddr;
	private String mlingCd;
	private String orgLvlCd;
	private Date svcContDd;
	private Date svcBltnDd;
	private Date svcExpryDd;
	private Date svcTrmnDd;

}
