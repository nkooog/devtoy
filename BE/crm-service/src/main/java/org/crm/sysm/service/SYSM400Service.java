package org.crm.sysm.service;

import org.crm.sysm.VO.SYSM400VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 작업스케줄관리 Service
* Creator      : sukim
* Create Date  : 2022.06.21
* Description  : 작업스케줄관리
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.21     sukim            최초생성
************************************************************************************************/
public interface SYSM400Service {
	List<SYSM400VO> SYSM400SEL01(SYSM400VO sys400vo) throws Exception;
	
	int SYSM400SEL02(SYSM400VO sys400vo) throws Exception;
	
	int SYSM400SEL03(SYSM400VO sys400vo) throws Exception;
	
	int SYSM400INS01(SYSM400VO sys400vo) throws Exception;
	
	int SYSM400DEL01(SYSM400VO sys400vo) throws Exception;
	
	int SYSM400DEL02(SYSM400VO sys400vo) throws Exception;
}
