package org.crm.sysm.VO;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SYSM434VO {

	//검색용
	private String searchType;
	private String startDate;
	private String endDate;
	private String search;
	private String searchSMSStcd; 
	private String searchSNSSbdgDv;
	private String searchGndrCd;
	
	//T_SMS_발송_스케쥴
	private String tenantId;
	private String regDt;
	private String regDtFormat;
	private int schdNo;
	private String sndgDv;
	private int tmplMgntNo;
	private String tmplNm;
	private String sndgRsvDt;
	private String sndgRsvDtFormat;
	private String sqncPatDvCd;
	private int sndgTgtNcnt;
	private int sndgCpltNcnt;
	private int sndgTotzNcnt;
	private int sndgScssNcnt;
	private int sndgFailNcnt;
	private String procStCd;
	private String procStCdNm;
	private String canRsnCd;
	private String canRsnCtt;
	private String regDtm;
	private String regrId;
	private String regrOrgCd;
	private String lstCorcDtm;
	private String lstCorprId;
	private String lstCorprOrgCd;
	private String abolDtm;
	private String abolmnId;
	private String abolmnOrgCd;	
	
	//T_SMS_발송_예약_차수
	private int sndgRsvSqnc;
	private String sndgStrTm;
	private String sndgCpltDtm;
	private String sqncProcStCd;	
	
	//T_SMS_발송_대상_정보
	private int sndgTgtCustSeq;
	private String custRcgnPathCd;
	private String custRcgnCd;
	private String custId;
	private String custNm;
	private String custNmSrchkey1;
	private String custNmSrchkey2;
	private String gndrCd;
	private String gndrNm;
	private String agelrgCd;
	private String recvrTelCntyCd;
	private String recvrTelNo;
	private String recvrTelNoSrchkey;
	private String dpchNo;
	private String sndgCtt;
	private String sndgRsvTm;
	private String sndgCpltTm;
	private String smsStCd;
	private String smsStNm;
	private String smsRsltCd;
	private String smsRsltNm;
	private int smsSndgRsltKey;
	private String smsSndgRsltMsg;
	
	//첨부파일
	private String apndFileNm1;	
	private String apndFileIdxNm1;	
	private String apndFilePsn1;	
	private String apndFileNm2;	
	private String apndFileIdxNm2;	
	private String apndFilePsn2;	
	private String apndFileNm3;	
	private String apndFileIdxNm3;	
	private String apndFilePsn3;
	
	private String[] delFileName;			// 원본 이미지 이름
	private int delFileCount;
	
	//기타
	private int seq;
	private int totCnt;
	private int regCnt;
	private int assignCnt;
	private int numerator;
	private int denominator;
	private int quotient;
	private int remainder;
	private int remainderSchdNo;
	

	private String usrId;
	private String usrNm;
	private String mbph_no;
	private String ctiAgenId;
		
}


