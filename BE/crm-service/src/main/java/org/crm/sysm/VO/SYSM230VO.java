package org.crm.sysm.VO;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

/***********************************************************************************************
* Program Name : 로그인 이력조회 VO
* Creator      : 이민호
* Create Date  : 2022.02.14
* Description  : 로그인 이력조회
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.14     이민호           최초생성
************************************************************************************************/
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SYSM230VO {
	
	private String tenantId;
	private String fmNm;
	private String usrId;
	private String usrNm;
	private String decUsrNm;
	private String orgCd;
	private String orgPath;
	private String orgNm;
	private String fromDate;
	private String toDate;
	private String sysLogMsg;
	private String sysLogDdSi;
	private String regDtm;

	@Builder.Default
	private List<String> usrList= new ArrayList<String>();
	@Builder.Default
	private List<String> orgList= new ArrayList<String>();
}