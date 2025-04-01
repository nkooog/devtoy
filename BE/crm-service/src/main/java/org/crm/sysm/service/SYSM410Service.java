package org.crm.sysm.service;

import org.crm.sysm.VO.SYSM410VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 작업스케줄처리이력 Service
* Creator      : sukim
* Create Date  : 2022.06.21
* Description  : 작업스케줄처리이력
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.21     sukim            최초생성
************************************************************************************************/
public interface SYSM410Service {
	List<SYSM410VO> SYSM410SEL01(SYSM410VO vo) throws Exception;
}
