package org.crm.dash.service;


import org.crm.dash.VO.DASH100VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 대시보드 메인 Service
* Creator      : 강동우
* Create Date  : 2022.05.17
* Description  : 대시보드  메인
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.17     강동우           최초생성
************************************************************************************************/
public interface DASH100Service {
	List<DASH100VO> DASH100SEL00(DASH100VO vo) throws Exception;
	List<DASH100VO> DASH100SEL01(DASH100VO vo) throws Exception;
	
	List<DASH100VO> DASH100SEL02(DASH100VO vo) throws Exception;

	List<DASH100VO> DASH100SEL03(DASH100VO vo) throws Exception;

	List<DASH100VO> DASH100SEL05(DASH100VO vo, String personInfoMask) throws Exception;
	
	List<DASH100VO> DASH100SEL06(DASH100VO vo) throws Exception;
	
	List<DASH100VO> DASH100SEL07(DASH100VO vo, String personInfoMask) throws Exception;
	
	List<DASH100VO> DASH100SEL08(DASH100VO vo) throws Exception;
	
	List<DASH100VO> DASH100SEL09(DASH100VO vo) throws Exception;
	
	List<DASH100VO> DASH100SEL10(DASH100VO vo) throws Exception;
	
	List<DASH100VO> DASH100SEL11(DASH100VO vo) throws Exception;
	
	List<DASH100VO> DASH100SEL12(DASH100VO vo) throws Exception;
	
	//kw---20230220 : 채널별 통계
	List<DASH100VO> DASH100SEL13(DASH100VO vo) throws Exception;
	
	//kw---20230405 : 유형별 통계
	List<DASH100VO> DASH100SEL14(DASH100VO vo) throws Exception;
	
	//kw---20231117 : 뉴스레터
	List<DASH100VO> DASH100SEL19(DASH100VO vo) throws Exception;
	int DASH100INS19(DASH100VO vo) throws Exception;
}
