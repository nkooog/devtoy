package org.crm.sysm.service;


import org.crm.sysm.VO.SYSM210VO;
import org.crm.sysm.VO.SYSM213VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 조직찾기 Service
* Creator      : djjung
* Create Date  : 2022.04.15
* Description  : 조직찾기 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.15     djjung           최초생성
************************************************************************************************/
public interface SYSM210Service {
	List<SYSM210VO> SYSM210SEL01(SYSM210VO vo) throws Exception;
	
	List<SYSM213VO> SYSM210SEL02(SYSM213VO vo) throws Exception;
}
