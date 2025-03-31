package org.crm.sysm.service;


import org.crm.sysm.VO.SYSM320VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 데이터카드 레이아웃 관리 Service
* Creator      : jrlee
* Create Date  : 2022.08.19
* Description  : 데이터카드 레이아웃 관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.08.19     jrlee           최초생성
************************************************************************************************/
public interface SYSM320Service {
    List<SYSM320VO> SYSM320SEL01(SYSM320VO sysm320VO) throws Exception;
    Integer SYSM320INS01(List<SYSM320VO> list) throws Exception;
    Integer SYSM320UPT01(List<SYSM320VO> list) throws Exception;
    Integer SYSM320DEL01(List<SYSM320VO> list) throws Exception;
}
