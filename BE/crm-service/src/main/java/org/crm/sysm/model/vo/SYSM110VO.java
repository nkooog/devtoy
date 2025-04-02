package org.crm.sysm.model.vo;

import lombok.*;

import java.sql.Timestamp;

@Setter @Getter
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
