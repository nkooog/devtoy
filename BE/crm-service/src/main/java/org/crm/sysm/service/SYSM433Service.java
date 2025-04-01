package org.crm.sysm.service;

import java.util.List;

import org.crm.sysm.VO.SYSM433VO;

/***********************************************************************************************
* Program Name : 메타공통코드관리 Service
* Creator      : 허해민
* Create Date  : 2022.01.17
* Description  : 메타공통코드관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.17     허해민           최초생성
************************************************************************************************/
public interface SYSM433Service {

	List<SYSM433VO> SYSM433SEL01(SYSM433VO vo) throws Exception;
	
	List<SYSM433VO> SYSM433SEL02(SYSM433VO vo) throws Exception;
	
	List<SYSM433VO> SYSM433SEL03(SYSM433VO vo) throws Exception;
	
	List<SYSM433VO> SYSM433SEL04(SYSM433VO vo) throws Exception;
	
	List<SYSM433VO> SYSM433SEL05(SYSM433VO vo) throws Exception;
	
	List<SYSM433VO> SYSM433SEL06(SYSM433VO vo) throws Exception;

	SYSM433VO SYSM433SEL07(SYSM433VO vo) throws Exception;

	Integer SYSM433UPT01(List<SYSM433VO> sysm433voList) throws Exception;
	
	Integer SYSM433INS01(List<SYSM433VO> sysm433voList) throws Exception;
}
