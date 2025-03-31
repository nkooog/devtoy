package org.crm.sysm.service;


import org.crm.sysm.VO.SYSM335VO;
import java.util.List;

/***********************************************************************************************
* Program Name : 공통코드찾기 Service
* Creator      : jrlee
* Create Date  : 2022.04.25
* Description  : 공통코드찾기
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.25     jrlee           최초생성
************************************************************************************************/
public interface SYSM335Service {
    List<SYSM335VO> SYSM335SEL01(SYSM335VO sysm335VO) throws Exception;
}
