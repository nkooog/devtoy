package org.crm.cmmt.VO;


import org.crm.cmmn.VO.CmmnSrchVO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/***********************************************************************************************
 * Program Name : 뉴스레터 VO
 * Creator      : 손동완
 * Create Date  : 2023.11.15
 * Description  : 뉴스레터 관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.11.15      손동완           최초생성
 * 2024.12.09      jypark          	egov->boot mig
 ************************************************************************************************/
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@SuperBuilder
public class CMMT600VO extends CmmnSrchVO {

	private int nlMgntSeq;
	private String nlTite;
	private String nlCtt;
	private String nlBltnYn;
	private String regDtm;
	private String regrId;
	private String regrOrgCd;
	private String lstCorprId;
	private String lstCorcDtm;
	private String lstCorprOrgCd;
	
	private String startDate;
	private String endDate;
	private String viewType;
	
	private String usrId;
	private String usrGrd;
}

