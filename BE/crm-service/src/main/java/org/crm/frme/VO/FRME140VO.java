package org.crm.frme.VO;

import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
* Program Name : 퀵링크 팝업 VO
* Creator      : 이민호
* Create Date  : 2022.02.10
* Description  : 퀵링크 팝업
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.26     이민호           최초생성
************************************************************************************************/
@Getter @Setter
public class FRME140VO {
	
	private String tenantId;
	private int lnkSeq;
	private int qLnkDvCd;
	private String qLnkNm;
	private String qLnkAddr;
	private int srtSeq;
	private String useYn;
	private String usrGrd;
	private String regrId;
	private String regrOrgCd;

	// 23-01-24 이민호 - 대시보드 조인조건 pltDvCd,pltItemCd 구분 코드 추가
	private String pltDvCd;
	private String pltItemCd;

}
