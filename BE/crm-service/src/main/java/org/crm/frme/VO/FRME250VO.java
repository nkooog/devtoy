package org.crm.frme.VO;

import org.crm.cmmn.VO.CmmnSrchVO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigInteger;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@SuperBuilder
public class FRME250VO extends CmmnSrchVO {
	
	private String tenantId;
	private BigInteger unfyCntcHistNo;
	
	private String trclDt;
	private String trclCtt;
	private String procStCd;
	private String cntcChnlCd;
	private String trclmnId;
	private String dspsrId;
	private String cntcCustId;
	private String cntcCustNm;
	private String cntcTelNo;
	private String trclmnOrgCd;
	private String usrId;
	private String orgNm;
	private String usrNm;

	private int trclSeq;

	private String cntcCustNmMsk;
	
	public String getTenantId() {
		return tenantId;
	}
	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}
	public BigInteger getUnfyCntcHistNo() {
		return unfyCntcHistNo;
	}
	public void setUnfyCntcHistNo(BigInteger unfyCntcHistNo) {
		this.unfyCntcHistNo = unfyCntcHistNo;
	}
	public String getTrclDt() {
		return trclDt;
	}
	public void setTrclDt(String trclDt) {
		this.trclDt = trclDt;
	}
	public String getTrclCtt() {
		return trclCtt;
	}
	public void setTrclCtt(String trclCtt) {
		this.trclCtt = trclCtt;
	}
	public String getProcStCd() {
		return procStCd;
	}
	public void setProcStCd(String procStCd) {
		this.procStCd = procStCd;
	}
	public String getCntcChnlCd() {
		return cntcChnlCd;
	}
	public void setCntcChnlCd(String cntcChnlCd) {
		this.cntcChnlCd = cntcChnlCd;
	}
	public String getTrclmnId() {
		return trclmnId;
	}
	public void setTrclmnId(String trclmnId) {
		this.trclmnId = trclmnId;
	}
	public String getDspsrId() {
		return dspsrId;
	}
	public void setDspsrId(String dspsrId) {
		this.dspsrId = dspsrId;
	}
	public String getCntcCustId() {
		return cntcCustId;
	}
	public void setCntcCustId(String cntcCustId) {
		this.cntcCustId = cntcCustId;
	}
	public String getCntcCustNm() {
		return cntcCustNm;
	}
	public void setCntcCustNm(String cntcCustNm) {
		this.cntcCustNm = cntcCustNm;
	}
	public String getCntcTelNo() {
		return cntcTelNo;
	}
	public void setCntcTelNo(String cntcTelNo) {
		this.cntcTelNo = cntcTelNo;
	}
	public String getTrclmnOrgCd() {
		return trclmnOrgCd;
	}
	public void setTrclmnOrgCd(String trclmnOrgCd) {
		this.trclmnOrgCd = trclmnOrgCd;
	}
	public String getUsrId() {
		return usrId;
	}
	public void setUsrId(String usrId) {
		this.usrId = usrId;
	}
	public String getOrgNm() {
		return orgNm;
	}
	public void setOrgNm(String orgNm) {
		this.orgNm = orgNm;
	}
	public String getUsrNm() {
		return usrNm;
	}
	public void setUsrNm(String usrNm) {
		this.usrNm = usrNm;
	}

	public int getTrclSeq() {
		return trclSeq;
	}

	public void setTrclSeq(int trclSeq) {
		this.trclSeq = trclSeq;
	}

	public String getCntcCustNmMsk() {
		return cntcCustNmMsk;
	}

	public void setCntcCustNmMsk(String cntcCustNmMsk) {
		this.cntcCustNmMsk = cntcCustNmMsk;
	}
}


