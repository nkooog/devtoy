package org.crm.sysm.service;


import org.crm.sysm.VO.SYSM301VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 데이터프레임 템플릿 레이아웃 편집 Service
* Creator      : jrlee
* Create Date  : 2022.08.10
* Description  : 데이터프레임 템플릿 레이아웃 편집
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.08.10     jrlee           최초생성
************************************************************************************************/
public interface SYSM301Service {
    SYSM301VO SYSM301SEL01(SYSM301VO SYSM301VO) throws Exception;
    List<SYSM301VO> SYSM301SEL02(SYSM301VO SYSM301VO) throws Exception;
    List<SYSM301VO> SYSM301SEL03(SYSM301VO SYSM301VO) throws Exception;
    Integer SYSM301INS01(List<SYSM301VO> list) throws Exception;
    Integer SYSM301INS02(List<SYSM301VO> list) throws Exception;
    Integer SYSM301INS03(List<SYSM301VO> list) throws Exception;
    Integer SYSM301DEL01(SYSM301VO sysm301VO) throws Exception;
    Integer SYSM301DEL02(SYSM301VO sysm301VO) throws Exception;
    Integer SYSM301DEL03(SYSM301VO sysm301VO) throws Exception;
}
