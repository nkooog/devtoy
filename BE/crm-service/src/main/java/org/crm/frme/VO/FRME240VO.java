package org.crm.frme.VO;

import org.crm.cmmn.VO.CmmnSrchVO;
import lombok.Getter;
import lombok.Setter;

import java.math.BigInteger;
import java.util.Date;

@Getter @Setter
public class FRME240VO extends CmmnSrchVO {
	
	private String tenantId;
	private BigInteger unfyCntcHistNo;
	private int telCnslHistSeq;
	private Date rsvDd;
	private String rsvHour;
	private String rsvPt;
	private String cntcTelNo;
	private String rsvMemo;
	private String procStCd;
	private String cntcCustId;
	private String cntcCustNm;
	private String cntcDt;
	private String usrId;
	private String usrOrgCd;
	private String alrmStCd;

	private String cntcCustNmMsk;
}


