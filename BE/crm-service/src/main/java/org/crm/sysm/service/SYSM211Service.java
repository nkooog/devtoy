package org.crm.sysm.service;


import org.crm.sysm.VO.SYSM211VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 사용자 찾기 Service
* Creator      : sukim
* Create Date  : 2022.04.15
* Description  : 사용자 찾기
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.15     sukim            최초생성
************************************************************************************************/
public interface SYSM211Service {
	List<SYSM211VO> SYSM211SEL01(SYSM211VO vo) throws Exception;
}
