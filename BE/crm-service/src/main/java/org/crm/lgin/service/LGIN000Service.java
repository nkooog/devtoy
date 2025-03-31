package org.crm.lgin.service;

import org.crm.lgin.VO.LGIN000VO;
import org.crm.lgin.VO.LGIN010VO;

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
	int LGIN000SEL01(LGIN000VO vo);
	LGIN000VO LGIN000SEL02(LGIN000VO vo) throws Exception;
	LGIN000VO LGIN000SEL03(LGIN000VO vo);
	int LGIN000SEL04(LGIN000VO vo);
	int LGIN000SEL05(LGIN000VO vo);
	LGIN000VO LGIN000SEL06(LGIN000VO vo);
	LGIN000VO LGIN000SEL07(LGIN000VO vo);
	LGIN010VO LGIN000SEL08(LGIN010VO vo);
	List<LGIN010VO> LGIN000SEL09(LGIN010VO vo);
	void LGIN000INS01(LGIN000VO vo);
	void LGIN000INS02(LGIN000VO vo);
	void LGIN000UPT01(LGIN000VO vo);
	void LGIN000UPT02(LGIN000VO vo);
	void LGIN000UPT03(LGIN000VO vo);
	void LGIN000UPT04(LGIN000VO vo);
	int LGIN000UPT05(LGIN000VO vo);
	LGIN000VO LGIN000USRGRDCHECK(LGIN000VO vo);

	public int LGIN000SEL11(LGIN000VO vo);
	public List<LGIN000VO> LGIN000SEL12(LGIN000VO vo);
}
