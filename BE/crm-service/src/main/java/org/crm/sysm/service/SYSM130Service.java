package org.crm.sysm.service;

import org.crm.sysm.VO.SYSM130VO;
import org.json.simple.JSONObject;
import java.util.ArrayList;
import java.util.List;

/***********************************************************************************************
 * Program Name : 조직관리 Service
 * Creator      : 정대정
 * Create Date  : 2022.01.10
 * Description  : 조직관리
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.02.10     정대정           최초생성
 ************************************************************************************************/
public interface SYSM130Service {

    List<SYSM130VO> SYSM130SEL01(SYSM130VO vo) throws Exception;
    int SYSM130INS01(ArrayList<SYSM130VO> vo) throws Exception;
    //    int SYSM130UPT02(SYSM130VO vo) throws Exception;
    int SYSM130UPT03(SYSM130VO vo) throws Exception;
    int SYSM130DEL01(SYSM130VO vo) throws Exception;
    int SYSM130UPT04(JSONObject json) throws Exception;

}