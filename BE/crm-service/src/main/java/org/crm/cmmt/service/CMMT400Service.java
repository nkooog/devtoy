package org.crm.cmmt.service;


import org.crm.cmmt.VO.CMMT400VO;
import org.crm.cmmt.VO.CMMT440VO;
import org.crm.dash.VO.DASH100VO;

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
public interface CMMT400Service {

	List<DASH100VO> CMMT400SEL01(CMMT440VO vo) throws Exception;
	
	List<DASH100VO> CMMT400SEL02(CMMT440VO vo) throws Exception;

	CMMT400VO CMMT400SEL03(CMMT400VO vo) throws Exception;

	Integer CMMT400UPT01(CMMT400VO vo)  throws Exception;

	Integer CMMT400UPT02(CMMT400VO vo)   throws Exception;
}
