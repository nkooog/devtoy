package org.crm.frme.service;

import org.crm.frme.VO.FRME300VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 부가서비스 Service
* Creator      : jrlee
* Create Date  : 2022.08.09
* Description  : 부가서비스 Service
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.08.09     jrlee            최초생성
************************************************************************************************/
public interface FRME300Service {
	List<FRME300VO> FRME300SEL01(FRME300VO frme300VO) throws Exception;
}