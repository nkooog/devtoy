package org.crm.sysm.VO;

import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
* Program Name : 조직찾기  VO
* Creator      : djjung
* Create Date  : 2022.02.25
* Description  : 조직찾기 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.15     djjung           최초생성
************************************************************************************************/
@Getter @Setter
public class SYSM210VO {
	private String tenantId;
	private String orgCd;
	private String orgNm;
	private String orgPath;
	private String prsLvlCd;
	private String hgrkOrgCd;
	private int    srtSeq;
	private String orgStCd;
	private String orgDvCd;

}
