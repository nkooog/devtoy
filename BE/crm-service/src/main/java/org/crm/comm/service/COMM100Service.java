package org.crm.comm.service;

import org.crm.comm.VO.COMM100VO;

import java.util.List;
import java.util.Map;

/***********************************************************************************************
* Program Name : 공통 서비스 Service
* Creator      : sukim
* Create Date  : 2022.02.03
* Description  : 공통 서비스
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.03     sukim            최초생성
************************************************************************************************/
public interface COMM100Service {
	List<COMM100VO> COMM100SEL01(Map<String, Object> codeList) throws Exception;
	COMM100VO COMM100SEL02(COMM100VO vo) throws Exception;
	COMM100VO COMM100SEL03(COMM100VO vo) throws Exception;
	List<COMM100VO> COMM100SEL04(COMM100VO vo) throws Exception;
	List<COMM100VO> COMM100SEL05(COMM100VO vo) throws Exception;
	String COMM100getCloudName(String tenantId) throws Exception;
}
