package org.crm.sysm.service;

import org.crm.sysm.VO.SYSM250VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 메뉴관리 Service
* Creator      : jrlee
* Create Date  : 2022.02.10
* Description  : 메뉴관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.10     jrlee           최초생성
************************************************************************************************/
public interface SYSM250Service {
    List<SYSM250VO> SYSM250SEL01(SYSM250VO sysm250VO) throws Exception;
    List<SYSM250VO> SYSM250SEL03(SYSM250VO sysm250VO) throws Exception;
    List<SYSM250VO> SYSM250SEL04(SYSM250VO sysm250VO) throws Exception;
    Integer SYSM250INS01(List<SYSM250VO> sysm250voList) throws Exception;
    Integer SYSM250UPT01(List<SYSM250VO> sysm250voList) throws Exception;
    Integer SYSM250UPT02(List<SYSM250VO> sysm250voList) throws Exception;
    Integer SYSM250DEL01(List<SYSM250VO> sysm250voList) throws Exception;
}
