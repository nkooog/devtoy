package org.crm.sysm.service;


import org.crm.sysm.VO.SYSM520VO;

import java.util.List;

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
public interface SYSM520Service {
	
	//select
    List<SYSM520VO> SYSM520SEL01(SYSM520VO SYSM520VO) throws Exception;
    List<SYSM520VO> SYSM520SEL02(SYSM520VO SYSM520VO) throws Exception;
    List<SYSM520VO> SYSM520SEL03(SYSM520VO SYSM520VO) throws Exception;
    
    //insert(create)
    Integer SYSM520INS01(List<SYSM520VO> list) throws Exception;
    
    //upadte
    Integer SYSM520UPT01(List<SYSM520VO> list) throws Exception;
    
    //delete
    Integer SYSM520DEL01(List<SYSM520VO> list) throws Exception;
}
