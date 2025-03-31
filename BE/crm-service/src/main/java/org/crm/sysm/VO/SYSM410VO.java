package org.crm.sysm.VO;

import lombok.*;

/***********************************************************************************************
* Program Name : 작업스케줄처리이력 VO
* Creator      : sukim
* Create Date  : 2022.06.21
* Description  : 작업스케줄처리이력
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.21     sukim            최초생성
************************************************************************************************/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SYSM410VO {
	private String tenantId;
	private String jobNo;
	private String jobNm;
	private String procDt;
	private int jobSeq;
	private String jobStrDtm;
	private String jobEndDtm;
	private String jobStCd;
	private String jobStCdNm;
	private String errCd;
	private String errMsg;
	private String regDtm;
	private String regrId;
	private String regrOrgCd;
	private String lstCorcDtm;
	private String lstCorprId;
	private String lstCorprOrgCd;
	private String jobStrDt;
	private String jobEndDt;
}
