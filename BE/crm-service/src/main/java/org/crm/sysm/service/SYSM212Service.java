package org.crm.sysm.service;


import org.crm.sysm.VO.SYSM212VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 사용자 ID 찾기 Service
* Creator      : 이민호
* Create Date  : 2022.02.07
* Description  : 사용자 ID 찾기
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.07     이민호           최초생성
************************************************************************************************/
public interface SYSM212Service {
	
	List<SYSM212VO> SYSM212SEL01(SYSM212VO vo) throws Exception;
	
	List<SYSM212VO> SYSM212SEL02(SYSM212VO vo) throws Exception;
		
}
