package org.crm.sysm.VO;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
/***********************************************************************************************
* Program Name : 태넌트 기본정보 VO
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 태넌트 기본정보
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10     김보영           최초생성
************************************************************************************************/
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SYSM110VO {
	
	// 태넌트 부가서비스 태이블 param  
	private String tenantId;
	private String id;
	private Integer adtnSvcSeq;
	private String adtnSvcCd;
	private String adtnSvcNm;
	private String useDvCd;
	private String connAddr;
	//화면 param
	private Timestamp regDtm;
	private String regrId;
	private String regrOrgCd;
	private Timestamp lstCorcDtm;
	private String lstCorprId;
	private String lstCorprOrgCd;
	private Timestamp abolDtM;
	private String abolmnId;
	private String abolmnOrgCd;

	private String lcnsCunt;
}
