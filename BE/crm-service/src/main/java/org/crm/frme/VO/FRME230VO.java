package org.crm.frme.VO;

import org.crm.cmmn.VO.CmmnSrchVO;
import lombok.Getter;
import lombok.Setter;

import java.math.BigInteger;

@Getter @Setter
public class FRME230VO extends CmmnSrchVO {

	private String tenantId;
	private BigInteger cabackAcpnNo;
	private String cabackId;
	private String cabackRegDtm;
	private String cabackAltmDtm;
	private String inclTelNo;
	private String cabackReqTelno;
	private String cnslrId;
	private String cabackProcStCd;
	private String cabackProcStCdNm;
	private String cabackInclRpsno;
	private String cabackInclRpsNoNm;
	private String ivrAcesCd;
	private String cabackInfwShpCdNm;
	private String cabackInfwShpCd;
	private String webCabackCustNm;
	private String webCabackMsg;
	private String vceCabackPlyTm;
	private String vceCabackFilePath;
	private String vceCabackYn;
	private String sttTrnfYn;
	private String sttTxt;
	private String usrId;
	private String usrNm;
	private String usrOrgCd;
	private String cnslrNm;

	private String regrId;
	private String regrOrgCd;
	private String lstCorprId;

	private String lstCorprOrgCd;

	// 콜백 내용
	private String cabackCtt;

	private String cntcCustNmMsk;
	private String usrGrd;

	private String phrecKey;

	private String orgNm;

	private String noSwInclTelNo;
	private String noSwCabackReqTelno;

	private String vceCabackFilePathPop;
}
