package org.crm.frme.service;


import org.crm.frme.VO.FRME150VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 즐겨찾기메뉴 팝업 Service
* Creator      : 이민호
* Create Date  : 2022.02.03
* Description  : 즐겨찾기메뉴 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.03     이민호           최초생성
************************************************************************************************/
public interface FRME150Service {
	
	List<FRME150VO> FRME150SEL01(FRME150VO vo) throws Exception;
	int FRME150INS01(FRME150VO vo) throws Exception;
	int FRME150DEL01(FRME150VO vo) throws Exception;
}
