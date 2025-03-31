package org.crm.sysm.VO;

import org.crm.cmmn.VO.CmmnSrchVO;
import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
 * Program Name : 상담그룹코드 관리 VO Creator : wkim Create Date : 2023.02.13
 * Description : 상담그룹코드 관리 Modify Desc :
 * -----------------------------------------------------------------------------------------------
 * Date | Updater | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.02.13 wkim 최초생성
 ************************************************************************************************/

@Getter @Setter
public class SYSM437VO extends CmmnSrchVO {

	private String tenantId;
	
	private Integer tmplMgntNo;
	private String tmplNm;
	
	private String searchType;
	private String searchType2;
	
	private String custId;
	private String custNm;
	private String gndrCd;
	private String recvrTelNo;
	private String sndgRsvDt;
	private String sndgRsvTm;
	private String sndgCpltTm;
	private String smsRsltCd;
	private String agelrgCd;
	private String smsSndgRsltMsg;
	private String sndgCtt;
	private String startDate;
	private String endDate;
	
	private String regUsrNm;
	private String regDtm;
	
}
