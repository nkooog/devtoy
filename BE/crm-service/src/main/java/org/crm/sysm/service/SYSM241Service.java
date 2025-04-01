package org.crm.sysm.service;

import org.crm.sysm.VO.SYSM241VO;
import java.util.List;

/***********************************************************************************************
* Program Name : 관리항목찾기 Service
* Creator      : jrlee
* Create Date  : 2022.04.28
* Description  : 관리항목찾기
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.28     jrlee           최초생성
************************************************************************************************/
public interface SYSM241Service {
    List<SYSM241VO> SYSM241SEL01(SYSM241VO sysm241VO) throws Exception;
}