package org.crm.sysm.service;

import org.crm.sysm.VO.SYSM251VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 데이터프레임 조회 Service
* Creator      : jrlee
* Create Date  : 2022.03.17
* Description  : 데이터프레임 조회
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.03.17     jrlee           최초생성
************************************************************************************************/
public interface SYSM251Service {
    List<SYSM251VO> SYSM251SEL01(SYSM251VO sysm251VO) throws Exception;
}
