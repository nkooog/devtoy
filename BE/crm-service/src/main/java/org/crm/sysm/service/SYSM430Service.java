package org.crm.sysm.service;


import org.crm.sysm.VO.SYSM430VO;

import java.util.List;

/***********************************************************************************************
* Program Name : SMS탬플릿관리 Service
* Creator      : 강동우
* Create Date  : 2022.04.28
* Description  : SMS탬플릿관리
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.28     강동우           최초생성
************************************************************************************************/
public interface SYSM430Service {
	
	List<SYSM430VO> SYSM430SEL01(SYSM430VO vo) throws Exception;
	
	List<SYSM430VO> SYSM430SEL02(SYSM430VO vo) throws Exception;
	
	List<SYSM430VO> SYSM430SEL03(SYSM430VO vo) throws Exception;
	
	List<SYSM430VO> SYSM430SEL04(SYSM430VO vo) throws Exception;
	
	String SYSM430SEL05(SYSM430VO vo) throws Exception;

	Integer SYSM430INS01(List<SYSM430VO> sysm430voList) throws Exception;
	
	Integer SYSM430INS02(List<SYSM430VO> sysm430voList) throws Exception;
    
	Integer SYSM430INS03(SYSM430VO vo) throws Exception;

	Integer SYSM430DEL01(List<SYSM430VO> sysm430voList) throws Exception;
    
    Integer SYSM430DEL02(List<SYSM430VO> sysm430voList) throws Exception;
    
    Integer SYSM430DEL03(List<SYSM430VO> sysm430voList) throws Exception;
    
    Integer SYSM430DEL04(SYSM430VO vo) throws Exception;
}
