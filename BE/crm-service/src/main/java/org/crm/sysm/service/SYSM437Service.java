package org.crm.sysm.service;

import java.util.List;

import org.crm.sysm.VO.SYSM437VO;

/***********************************************************************************************
* Program Name : 상담그룹코드 관리 Service
* Creator      : wkim
* Create Date  : 2023.02.13
* Description  : 상담그룹코드 관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2023.02.13     wkim             최초생성
************************************************************************************************/
public interface SYSM437Service {
	
	//select
    List<SYSM437VO> SYSM437SEL01(SYSM437VO SYSM437VO) throws Exception;
    List<SYSM437VO> SYSM437SEL02(SYSM437VO SYSM437VO) throws Exception;
}
