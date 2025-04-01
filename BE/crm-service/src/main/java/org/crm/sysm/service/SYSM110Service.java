package org.crm.sysm.service;

import org.crm.sysm.VO.SYSM100VO;
import org.crm.sysm.VO.SYSM110VO;

import java.util.List;
/***********************************************************************************************
* Program Name : 태넌트 기본정보 Service
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 태넌트 기본정보
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10     김보영           최초생성
************************************************************************************************/
public interface SYSM110Service {

	List<SYSM110VO> SYSM110SEL02(SYSM100VO vo) throws Exception;

	Integer SYSM110INS01(SYSM100VO vo) throws Exception;
	
	Integer SYSM110UPT01(SYSM100VO vo) throws Exception;

	Integer SYSM110DEL01(SYSM100VO vo) throws Exception;

	Integer SYSM110INS02(List<SYSM110VO> list) throws Exception;
	
	Integer SYSM110DEL02(SYSM100VO vo) throws Exception;

	Integer SYSM110UPT02(List<SYSM110VO> list) throws Exception;

	Integer SYSM110DEL03(List<SYSM110VO> list) throws Exception;
	
	List<SYSM110VO> SYSM110SEL03(SYSM110VO vo) throws Exception;
	
}
