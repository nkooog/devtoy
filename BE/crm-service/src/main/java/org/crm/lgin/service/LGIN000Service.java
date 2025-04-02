package org.crm.lgin.service;

import org.crm.lgin.model.dto.LGIN000DTO;
import org.crm.lgin.model.vo.LGIN000VO;
import org.crm.lgin.model.vo.LGIN010VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 로그인 Service
* Creator      : sukim
* Create Date  : 2022.02.03
* Description  : 로그인
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.03     sukim            최초생성
* 2024.11.29     jypark           egov -> boot mig
************************************************************************************************/
public interface LGIN000Service {
	LGIN000VO LGIN000SEL02(LGIN000VO vo) throws Exception;
	LGIN000VO LGIN000SEL03(LGIN000VO vo) throws Exception;
	LGIN000VO LGIN000SEL07(LGIN000DTO lgin000DTO) throws Exception;

	void LGIN000INS01(LGIN000VO vo) throws Exception;


	void LGIN000UPT01(LGIN000VO vo) throws Exception;
	void LGIN000UPT02(LGIN000VO vo) throws Exception;
	void LGIN000UPT04(LGIN000VO vo) throws Exception;

}
