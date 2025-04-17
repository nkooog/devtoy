package org.crm.frme.model.vo;

import lombok.Getter;
import lombok.Setter;

/***********************************************************************************************
* Program Name : 즐겨찾기메뉴 팝업 VO
* Creator      : 이민호
* Create Date  : 2022.02.03
* Description  : 즐겨찾기메뉴 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.03     이민호           최초생성
************************************************************************************************/
@Getter
@Setter
public class FRME150VO {
	
	private String tenantId;
	private String usrId;
	private String menuId;
	private String menuNm;
	private String menuLv1;
	private String menuLv2;
	private String menuLv3;
	private String mlingCd;
	private String dataFrmId;
	private String mapgVlu1;


}


