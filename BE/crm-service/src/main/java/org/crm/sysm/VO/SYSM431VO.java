package org.crm.sysm.VO;

import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
* Program Name : SMS 발송변수 찾기 VO
* Creator      : sukim
* Create Date  : 2022.06.08
* Description  : SMS 발송변수 찾기
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.08     sukim            최초생성
************************************************************************************************/
@Getter 
@Setter
public class SYSM431VO {
	
	private String tenantId;
	private Integer srtSeq;
	private String vrbsClasCd;
	private String vrbsCd;
	private String vrbsVlu;
	private String refn1;
	private String refn2;
	private String refn3;
	private String refn4;
	private String refn5;
	private String useYn;
	private String keyword;
	
}
