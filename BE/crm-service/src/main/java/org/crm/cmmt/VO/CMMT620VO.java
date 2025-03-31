package org.crm.cmmt.VO;

import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
 * Program Name : 뉴스레터 확인내역 VO
 * Creator      : 손동완
 * Create Date  : 2023.11.17
 * Description  : 뉴스레터 확인내역
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2023.11.17      손동완           최초생성
 ************************************************************************************************/

@Getter @Setter
public class CMMT620VO {

	private int nlMgntSeq;
	private String tenantId;
	private String cnslGrpCd;
	private String cnslrId;
	private String cnslrNm;
	private String cnslrNmId;
	private String nlCnfmYn;
	private String nlCnfmDtm;
	private String regDtm;
	private String regrId;
	private String regrOrgCd;

}

