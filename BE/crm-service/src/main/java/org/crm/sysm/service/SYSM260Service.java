package org.crm.sysm.service;

import org.crm.sysm.VO.SYSM260VO;
import java.util.List;

/***********************************************************************************************
* Program Name : 그룹별 메뉴권한관리 Service
* Creator      : jrlee
* Create Date  : 2022.04.06
* Description  : 그룹별 메뉴권한관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.06     jrlee           최초생성
************************************************************************************************/
public interface SYSM260Service {
    List<SYSM260VO> SYSM260SEL01(SYSM260VO sysm260VO) throws Exception;
    List<SYSM260VO> SYSM260SEL02(SYSM260VO sysm260VO) throws Exception;
    Integer SYSM260INS01(List<SYSM260VO> list) throws Exception;
    Integer SYSM260DEL01(SYSM260VO sysm260VO) throws Exception;
    Integer SYSM260DEL02(List<SYSM260VO> list) throws Exception;
}
