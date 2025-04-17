package org.crm.comm.model.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class COMM000VO {

	private String tenantId;
	private String dmnCd;
	private String tenantStCd;
	private String tenantStRsnCd;
	private String fmnm;
	private String fmnmEng;
	private String reprNm;
	private String reprNmEng;
	private String svcTypCd;
	private String spTypCd;
	private String usrAcCnt;
	private String emlSndGrpsAddr;
	private String mlingCd;
	private String orgLvlCd;
	private Date svcContDd;
	private Date svcExpryDd;
	private Date svcBltnDd;
	private Date svcTrmnDd;

}
