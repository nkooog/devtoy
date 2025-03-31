package org.crm.sysm.service;


import org.crm.sysm.VO.SYSM550VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 장애공지관리 Service
* Creator      : shpark
* Create Date  : 2024.06.14
* Description  : 장애공지관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2024.06.14     shpark           최초생성
************************************************************************************************/
public interface SYSM550Service {
    List<SYSM550VO> SYSM550SEL01(SYSM550VO SYSM550VO) throws Exception;
    List<SYSM550VO> SYSM550SEL02(SYSM550VO SYSM550VO) throws Exception;
    Integer SYSM550INS01(SYSM550VO SYSM550VO) throws Exception;
    Integer SYSM550DEL01(SYSM550VO SYSM550VO) throws Exception;
}
