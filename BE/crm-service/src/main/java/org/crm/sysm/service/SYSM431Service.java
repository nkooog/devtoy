package org.crm.sysm.service;

import java.util.List;

import org.crm.sysm.VO.SYSM431VO;
/***********************************************************************************************
* Program Name : SMS 발송변수 찾기 Service
* Creator      : sukim
* Create Date  : 2022.06.08
* Description  : SMS 발송변수 찾기
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.08     sukim            최초생성
************************************************************************************************/
public interface SYSM431Service {
	List<SYSM431VO> SYSM431SEL01(SYSM431VO vo) throws Exception;
}
