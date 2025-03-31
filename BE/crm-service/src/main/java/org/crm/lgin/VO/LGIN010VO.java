package org.crm.lgin.VO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/***********************************************************************************************
* Program Name : 로그인 태넌트 기준정보 VO
* Creator      : sukim
* Create Date  : 2022.08.09
* Description  : 로그인 - 태넌트 기준정보
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.08.09     sukim            최초생성
* 2024.11.29     jypark           egov -> boot mig
************************************************************************************************/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class LGIN010VO extends LGIN000VO {
	private String tenantId;
	private int bsVlMgntNo;
	private String bsVlNm;
	private String bsVl1;
	private String bsVl2;
	private String bsVl3;
	private String useYn;
	private String currentHour;
	private String currentMin;

}
