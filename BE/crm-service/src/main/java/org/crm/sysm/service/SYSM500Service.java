package org.crm.sysm.service;

import org.crm.sysm.VO.SYSM500VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 실시간운영메시지관리 Service
* Creator      : jrlee
* Create Date  : 2022.06.08
* Description  : 실시간운영메시지관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.08     jrlee           최초생성
************************************************************************************************/
public interface SYSM500Service {
    List<SYSM500VO> SYSM500SEL01(SYSM500VO sysm500VO) throws Exception;
    Integer SYSM500INS01(SYSM500VO sysm500VO) throws Exception;
    Integer SYSM500DEL01(SYSM500VO sysm500VO) throws Exception;
}
