package org.crm.util.es.jsonObject;

import java.util.List;

public class docObject {

	String tenantId;
	long ctgrMgntNo;
	long blthgMgntNo;
	String title;
	String stCd;
	String typCd;
	String rpsImgIdxNm;
	String rpsImgPsn;
	String bltnStrDd;
	String bltnEndDd;
	String permUseYn;
	String apvDtm;
	String apprId;
	String apprOrgCd;
	String regDtm;
	String regrNm;
	String regrId;
	String regrOrgCd;
	String lstCorcDtm;
	String lstCorprId;
	String lstCorpOrgCd;
	long appendFileCount;
	String[] assocKeyword;
	String[] assocContent;
	List<Mokti> mokti;

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tneantId) {
		this.tenantId = tneantId;
	}

	public long getCtgrMgntNo() {
		return ctgrMgntNo;
	}

	public void setCtgrMgntNo(long ctgrMgntNo) {
		this.ctgrMgntNo = ctgrMgntNo;
	}

	public long getBlthgMgntNo() {
		return blthgMgntNo;
	}

	public void setBlthgMgntNo(long blthgMgntNo) {
		this.blthgMgntNo = blthgMgntNo;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getStCd() {
		return stCd;
	}

	public void setStCd(String stCd) {
		this.stCd = stCd;
	}

	public String getTypCd() {
		return typCd;
	}

	public void setTypCd(String typCd) {
		this.typCd = typCd;
	}

	public String getRpsImgIdxNm() {
		return rpsImgIdxNm;
	}

	public void setRpsImgIdxNm(String rpsImgIdxNm) {
		this.rpsImgIdxNm = rpsImgIdxNm;
	}

	public String getRpsImgPsn() {
		return rpsImgPsn;
	}

	public void setRpsImgPsn(String rpsImgPsn) {
		this.rpsImgPsn = rpsImgPsn;
	}

	public String getBltnStrDd() {
		return bltnStrDd;
	}

	public void setBltnStrDd(String bltnStrDd) {
		this.bltnStrDd = bltnStrDd;
	}

	public String getBltnEndDd() {
		return bltnEndDd;
	}

	public void setBltnEndDd(String bltnEndDd) {
		this.bltnEndDd = bltnEndDd;
	}

	public String getPermUseYn() {
		return permUseYn;
	}

	public void setPermUseYn(String permUseYn) {
		this.permUseYn = permUseYn;
	}

	public String getApvDtm() {
		return apvDtm;
	}

	public void setApvDtm(String apvDtm) {
		this.apvDtm = apvDtm.split("\\.")[0];
	}

	public String getApprId() {
		return apprId;
	}

	public void setApprId(String apprId) {
		this.apprId = apprId;
	}

	public String getApprOrgCd() {
		return apprOrgCd;
	}

	public void setApprOrgCd(String apprOrgCd) {
		this.apprOrgCd = apprOrgCd;
	}

	public String getRegDtm() {
		return regDtm;
	}

	public void setRegDtm(String regDtm) {
		this.regDtm = regDtm.split("\\.")[0];
	}

	public String getRegrNm() {
		return regrNm;
	}

	public void setRegrNm(String regrNm) {
		this.regrNm = regrNm;
	}

	public String getRegrId() {
		return regrId;
	}

	public void setRegrId(String regrId) {
		this.regrId = regrId;
	}

	public String getRegrOrgCd() {
		return regrOrgCd;
	}

	public void setRegrOrgCd(String regrOrgCd) {
		this.regrOrgCd = regrOrgCd;
	}

	public String getLstCorcDtm() {
		return lstCorcDtm;
	}

	public void setLstCorcDtm(String lstCorcDtm) {
		this.lstCorcDtm = lstCorcDtm.split("\\.")[0];
	}

	public String getLstCorprId() {
		return lstCorprId;
	}

	public void setLstCorprId(String lstCorprId) {
		this.lstCorprId = lstCorprId;
	}

	public String getLstCorpOrgCd() {
		return lstCorpOrgCd;
	}

	public void setLstCorpOrgCd(String lstCorpOrgCd) {
		this.lstCorpOrgCd = lstCorpOrgCd;
	}

	public long getAppendFileCount() {
		return appendFileCount;
	}

	public void setAppendFileCount(long appendFileCount) {
		this.appendFileCount = appendFileCount;
	}

	public String[] getAssocKeyword() {
		return assocKeyword;
	}

	public void setAssocKeyword(String[] assocKeyword) {
		this.assocKeyword = assocKeyword;
	}

	public String[] getAssocContent() {
		return assocContent;
	}

	public void setAssocContent(String[] assocContent) {
		this.assocContent = assocContent;
	}

	public List<Mokti> getMokti() {
		return mokti;
	}

	public void setMokti(List<Mokti> mokti) {
		this.mokti = mokti;
	}
}

