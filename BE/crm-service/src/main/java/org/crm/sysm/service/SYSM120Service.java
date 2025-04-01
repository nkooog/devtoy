package org.crm.sysm.service;


import org.crm.sysm.VO.SYSM100VO;
import org.crm.sysm.VO.SYSM120VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 태넌트 기준정보 Service
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 태넌트 기준정보
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10     김보영           최초생성
************************************************************************************************/
public interface SYSM120Service {

	List<SYSM120VO> SYSM120SEL03(SYSM100VO vo) throws Exception;

	Integer SYSM120INS03(List<SYSM120VO> list) throws Exception;
	
	Integer SYSM120UPT03(List<SYSM120VO> list) throws Exception;

	Integer SYSM120DEL03(List<SYSM120VO> sYSM120VOList) throws Exception;

	Integer SYSM120DEL04(SYSM100VO vo) throws Exception;
	
}
