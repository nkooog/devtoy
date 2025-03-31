package org.crm.sysm.service;

import java.util.List;

import org.crm.sysm.VO.SYSM436VO;

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
public interface SYSM436Service {
	
	//select
    List<SYSM436VO> SYSM436SEL01(SYSM436VO SYSM436VO) throws Exception;
    List<SYSM436VO> SYSM436SEL02(SYSM436VO SYSM436VO) throws Exception;
    
    //insert(create)
    Integer SYSM436INS01(List<SYSM436VO> list) throws Exception;
    
    //upadte
    Integer SYSM436UPT01(List<SYSM436VO> list) throws Exception;		//수정
    Integer SYSM436UPT02(List<SYSM436VO> list) throws Exception;		//폐기
    
    //delete
    Integer SYSM436DEL01(List<SYSM436VO> list) throws Exception;
}
