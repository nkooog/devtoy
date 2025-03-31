package org.crm.sysm.service;

import org.crm.sysm.VO.SYSM310VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 그룹별 DataFrame 권한관리 Service
* Creator      : jrlee
* Create Date  : 2022.06.23
* Description  : 그룹별 DataFrame 권한관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.23     jrlee           최초생성
************************************************************************************************/
public interface SYSM310Service {
    List<SYSM310VO> SYSM310SEL01(SYSM310VO sysm310VO) throws Exception;
    List<SYSM310VO> SYSM310SEL02(SYSM310VO sysm310VO) throws Exception;
    List<SYSM310VO> SYSM310SEL03(SYSM310VO sysm310VO) throws Exception;
    List<SYSM310VO> SYSM310SEL04(SYSM310VO sysm310VO) throws Exception;
    Integer SYSM310INS01(List<SYSM310VO> list) throws Exception;
    Integer SYSM310INS02(List<SYSM310VO> list) throws Exception;
    Integer SYSM310DEL01(SYSM310VO sysm310VO) throws Exception;
    Integer SYSM310DEL02(List<SYSM310VO> list) throws Exception;
    Integer SYSM310DEL03(SYSM310VO sysm310VO) throws Exception;
    Integer SYSM310DEL04(List<SYSM310VO> list) throws Exception;
}
