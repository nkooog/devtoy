package org.crm.sysm.VO;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

/***********************************************************************************************
* Program Name : 태넌트 기준정보 VO
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 태넌트 기준정보
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10     김보영           최초생성
* 2024.12.02     박준영           egov->springboot mig
************************************************************************************************/
@Getter
@Setter
public class SYSM120VO {
	
	// 태넌트 부가서비스 태이블 param  
	private String tenantId;
	private Integer bsVlMgntNo;
	private String id;
	private String bsVlNm;
	private String bascVluDvCd;
	private String bascVluUnitCd;
	private String bascVluUseCntCd;
	private Integer dataSzMnriCnt;
	private Integer dataSzSmlcntMnriCnt;
	private String bsVl1;
	private String bsVl2;
	private String bsVl3;
	private String useYn;
	private Timestamp regDtm;
	private String regrId;
	private String regrOrgCd;
	private Timestamp lstCorcDtm;
	private String lstCorprId;
	private String lstCorprOrgCd;
	private Timestamp abolDtM;
	private String abolmnId;
	private String abolmnOrgCd;

}
