package org.crm.sysm.service;

import org.crm.sysm.VO.SYSM510VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 테넌트기준정보구성 Service
* Creator      : jrlee
* Create Date  : 2022.11.04
* Description  : 테넌트기준정보구성
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.11.04     mhlee           최초생성
************************************************************************************************/
public interface SYSM510Service {
    List<SYSM510VO> SYSM510SEL01(SYSM510VO vo) throws Exception;
    int SYSM510INS01(List<SYSM510VO> list) throws Exception;

    int SYSM510DEL01(List<SYSM510VO> list) throws Exception;

    int SYSM510CopyBasicData(List<SYSM510VO> list) throws Exception;
    
    int SYSM510UPT02(SYSM510VO vo) throws Exception;
}
