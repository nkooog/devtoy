package org.crm.frme.service;


import org.crm.frme.VO.FRME100VO;
import org.crm.sysm.VO.SYSM310VO;
import org.crm.sysm.VO.SYSM500VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 프레임 Service
* Creator      : jrlee
* Create Date  : 2022.02.10
* Description  : 프레임 Service
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.10     jrlee            최초생성
************************************************************************************************/
public interface FRME100Service {
	List<FRME100VO> FRME100SEL01(FRME100VO frme100VO) throws Exception;
	List<SYSM500VO> FRME100SEL02(SYSM500VO sysm500VO) throws Exception;
	List<SYSM310VO> FRME100SEL03(SYSM310VO sysm310VO) throws Exception;
}
