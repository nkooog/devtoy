package org.crm.sysm.service;


import org.crm.sysm.VO.SYSM340VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 공통코드관리 Service
* Creator      : jrlee
* Create Date  : 2022.05.02
* Description  : 공통코드관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.02     jrlee           최초생성
************************************************************************************************/
public interface SYSM340Service {
    List<SYSM340VO> SYSM340SEL01(SYSM340VO sysm340VO) throws Exception;
    List<SYSM340VO> SYSM340SEL02(SYSM340VO sysm340VO) throws Exception;
    Integer SYSM340INS01(List<SYSM340VO> list) throws Exception;
    Integer SYSM340UPT01(List<SYSM340VO> list) throws Exception;
    Integer SYSM340DEL01(List<SYSM340VO> list) throws Exception;

    Integer SYSM340UPT02(List<SYSM340VO> list)throws Exception;
}