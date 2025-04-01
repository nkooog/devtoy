package org.crm.cmmt.service;

import org.crm.cmmt.VO.CMMT210VO;
import org.crm.cmmt.VO.CMMT230VO;

import java.util.List;

/***********************************************************************************************
* Program Name : 공지사항상세  Service
* Creator      : 김보영
* Create Date  : 2022.01.10
* Description  : 통합계시글관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.01.10    김보영           최초생성
************************************************************************************************/
public interface CMMT230Service {

	List<CMMT230VO> CMMT230SEL01(CMMT230VO vo) throws Exception;
	
	List<CMMT230VO> CMMT230SEL02(CMMT230VO vo) throws Exception;
	
	List<CMMT230VO> CMMT230SEL03(CMMT230VO vo) throws Exception;
	
	List<CMMT230VO> CMMT230SEL04(CMMT230VO vo) throws Exception ;

	List<CMMT230VO> CMMT230SEL05(CMMT230VO vo) throws Exception ;
	
	List<CMMT230VO> CMMT230SEL06(CMMT230VO vo) throws Exception ;
	
	int CMMT230INS01(CMMT230VO vo) throws Exception ;
	
	int CMMT230INS02(CMMT230VO vo) throws Exception ;
	
	int CMMT230INS03(CMMT230VO vo) throws Exception ;
	
	int CMMT230UPT01(CMMT210VO vo) throws Exception ;
	
	int CMMT230UPT02(CMMT230VO vo) throws Exception ;
	
	int CMMT230UPT03(CMMT230VO vo) throws Exception ;
	
	int CMMT230UPT04(CMMT230VO vo) throws Exception ;
	
	int CMMT230UPT05(CMMT230VO vo) throws Exception ;
	
	int CMMT230UPT06(CMMT230VO vo) throws Exception ;
	
	int CMMT230DEL01(CMMT230VO vo) throws Exception ;
	
	int CMMT230DEL02(CMMT230VO vo) throws Exception ;

	int CMMT230UPT07(CMMT230VO vo) throws Exception;

	int CMMT230UPT08(CMMT230VO vo) throws Exception;

	int CMMT230UPT09(CMMT230VO vo) throws Exception;
	int CMMT230UPT10(CMMT230VO vo) throws Exception;
	int CMMT230UPT11(CMMT230VO vo) throws Exception;

	int CMMT230SEL07(CMMT230VO vo) throws Exception;

	int CMMT230SEL08(CMMT230VO vo) throws Exception;
	int CMMT230SEL09(CMMT230VO vo) throws Exception;
}
