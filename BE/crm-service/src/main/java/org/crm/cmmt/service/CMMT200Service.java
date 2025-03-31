package org.crm.cmmt.service;

import org.crm.cmmt.VO.CMMT200VO;
import org.crm.cmmt.VO.CMMT201VO;
import org.crm.cmmt.VO.CMMT230VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 통합계시글관리 Service
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 통합계시글관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
public interface CMMT200Service {

	List<CMMT201VO> CMMT200SEL01(CMMT200VO vo) throws Exception;
	
	List<CMMT201VO> CMMT200SEL02(CMMT200VO vo)throws Exception;
	
	List<CMMT200VO> CMMT200SEL03(CMMT200VO vo) throws Exception;
	
	List<CMMT200VO> CMMT200SEL04(CMMT200VO vo) throws Exception;
	
	int CMMT200INS01(CMMT200VO vo) throws Exception ;
	
	int CMMT200INS02(CMMT200VO vo) throws Exception ;

	int CMMT200UPT01(CMMT200VO vo) throws Exception ;
	
	int CMMT200UPT03(CMMT200VO vo) throws Exception ;
	
	int CMMT200DEL01(CMMT200VO vo) throws Exception ;

	CMMT200VO CMMT200SEL05(CMMT200VO vo) throws Exception;

	int CMMT200DEL02(CMMT230VO vo) throws Exception;

	List<CMMT200VO> CMMT200SEL06(CMMT200VO voSetting) throws Exception;
	
	//kw---20230614 : 게시글 조회
	List<CMMT200VO> CMMT200SEL07(CMMT200VO vo) throws Exception;
	
	//kw---20230614 : 게시판 카테고리 조회
	List<CMMT200VO> CMMT200SEL08(CMMT200VO vo) throws Exception;

		
}
