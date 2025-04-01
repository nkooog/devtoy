package org.crm.sysm.VO;

import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
* Program Name : 조직사용자찾기 VO
* Creator      : 이민호
* Create Date  : 2022.02.07
* Description  : 조직사용자찾기 찾기
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.07     이민호           최초생성
* 2022.03.30     이민호            화면이름변경 (사용자ID찾기 -> 조직사용자찾기)
************************************************************************************************/
@Getter @Setter
public class SYSM212VO {
	
	private String tenantId;

	private String usrId;
	private String usrNm;
	private String decUsrNm;
	private String usrGrd;
	private String orgPath;
	private String orgNm;
	private String orgCd;
	private String prsLvlCd;
	private String hgrkOrgCd;
	private int srtSeq;
}
