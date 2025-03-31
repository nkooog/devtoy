package org.crm.sysm.VO;

import lombok.*;

/***********************************************************************************************
* Program Name : 작업스케줄관리 controller
* Creator      : sukim
* Create Date  : 2022.06.21
* Description  : 작업스케줄관리
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.21     sukim            최초생성
************************************************************************************************/
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SYSM400VO {
	private String tenantId;
	private String fmnm;
	private String jobNo;
	private String jobNm;
	private String jobCycCd;
	private String jobCycCdNm;
	private String jobClasCd;
	private String jobClasCdNm;
	private String jobExecTm;
	private String filePath;
	private String fileNm;
	private String procPgmKindCd;
	private String procPgmKindCdNm;
	private String procPgmNm;
	private String useYn;
	private String useYnCdNm;
	private String regDtm;
	private String regrId;
	private String regrUsrNm;
	private String regrOrgCd;
	private String lstCorcDtm;
	private String lstCorprId;
	private String lstCorprUsrNm;
	private String lstCorprOrgCd;
	private String abolmnId;
	private String abolmnOrgCd;
	private String abolDtm;
	
	private String mlingCd;
	private String reptYn;
	private String prcedJobNo;
	private String execScheDt;
}
