package org.crm.cmmt.service;


import org.crm.cmmt.VO.CMMT400VO;
import org.crm.cmmt.VO.CMMT440VO;

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
public interface CMMT440Service {

	CMMT400VO CMMT440SEL01(CMMT400VO vo) throws Exception;
	
	List<CMMT440VO> CMMT440SEL02(CMMT400VO vo) throws Exception;
	
	List<CMMT400VO> CMMT440SEL03(CMMT400VO vo) throws Exception;
	
	List<CMMT440VO> CMMT440SEL04(CMMT400VO vo) throws Exception;
	
	int CMMT440INS01(CMMT400VO vo) throws Exception;
	
	int CMMT440INS02(List<CMMT440VO> list) throws Exception;
	
	int CMMT440INS03(CMMT400VO vo) throws Exception;
	
	int CMMT440UPT01(CMMT400VO vo) throws Exception;
	
	int CMMT440UPT02(CMMT400VO vo) throws Exception;
	
	int CMMT440DEL01(CMMT400VO vo) throws Exception;
	
	int CMMT440DEL02(CMMT400VO vo) throws Exception;
	
	int CMMT440DEL03(CMMT400VO vo) throws Exception;

	int CMMT440INS04(List<CMMT440VO> cmmt440List)  throws Exception;
	
	int CMMT440DEL04(CMMT400VO vo) throws Exception;

	int CMMT440DEL05(CMMT400VO vo) throws Exception;
	
}
