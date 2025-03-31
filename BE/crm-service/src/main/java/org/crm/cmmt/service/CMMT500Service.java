package org.crm.cmmt.service;


import org.crm.cmmt.VO.CMMT500VO;

import java.util.HashMap;
import java.util.List;

/***********************************************************************************************
 * Program Name : 쪽지관리 Service
 * Creator      : 이민호
 * Create Date  : 2022.04.27
 * Description  : 쪽지관리 메인
 * Modify Desc  :
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.04.27      이민호           최초생성
 ************************************************************************************************/
public interface CMMT500Service {

//	List<CMMT500VO> CMMT500SEL01(CMMT500VO vo) throws Exception;
//	List<CMMT500VO> CMMT500SEL02(CMMT500VO vo) throws Exception;
	List<CMMT500VO> CMMT500SEL01(HashMap<String, Object> vo) throws Exception;
	List<CMMT500VO> CMMT500SEL03(HashMap<String, Object> vo) throws Exception;
	CMMT500VO CMMT500SEL02(CMMT500VO vo) throws Exception;
	int CMMT500UPT02(CMMT500VO vo) throws Exception;
	int CMMT500UPT03(CMMT500VO vo) throws Exception;
	int CMMT500UPT09(CMMT500VO vo) throws Exception;
	int CMMT500DEL01(CMMT500VO vo) throws Exception;

	List<CMMT500VO> CMMT500SEL11(CMMT500VO vo) throws Exception;

	List<CMMT500VO> CMMT500SEL12(CMMT500VO vo) throws Exception;

	List<CMMT500VO> CMMT500SEL13(CMMT500VO vo) throws Exception;
	
	//kw---20250318 : 실시간 쪽지 체크
	List<CMMT500VO> CMMT500SEL14(CMMT500VO vo) throws Exception;
}
