package org.crm.sysm.service;


import org.crm.sysm.VO.SYSM300VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 데이터프레임 관리 Service
* Creator      : jrlee
* Create Date  : 2022.06.30
* Description  : 데이터프레임 관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.30     jrlee           최초생성
************************************************************************************************/
public interface SYSM300Service {
    List<SYSM300VO> SYSM300SEL01(SYSM300VO sysm300VO) throws Exception;
    Object SYSM300SEL02(SYSM300VO sysm300VO) throws Exception;
    List<SYSM300VO> SYSM300SEL03(SYSM300VO sysm300VO) throws Exception;
    Integer SYSM300INS01(List<SYSM300VO> list) throws Exception;
    Integer SYSM300INS02(List<SYSM300VO> list) throws Exception;
    Integer SYSM300INS03(List<SYSM300VO> list) throws Exception;
    Integer SYSM300UPT01(List<SYSM300VO> list) throws Exception;
    Integer SYSM300UPT03(List<SYSM300VO> list) throws Exception;
    Integer SYSM300DEL01(List<SYSM300VO> list) throws Exception;
    Integer SYSM300DEL02(List<SYSM300VO> list) throws Exception;
    Integer SYSM300DEL03(List<SYSM300VO> list) throws Exception;
}
