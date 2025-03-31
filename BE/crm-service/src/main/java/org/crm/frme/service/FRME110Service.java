package org.crm.frme.service;


import org.crm.frme.VO.FRME110VO;

import java.util.List;

/***********************************************************************************************
 * Program Name : HelpDesk 팝업 Service
 * Creator      : 이민호
 * Create Date  : 2022.03.11
 * Description  : HelpDesk 팝업
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.03.11     이민호           최초생성
 ************************************************************************************************/
public interface FRME110Service {
	
	List<FRME110VO> FRME110SEL01(FRME110VO vo) throws Exception;

}
