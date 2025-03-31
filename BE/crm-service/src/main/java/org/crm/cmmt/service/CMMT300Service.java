package org.crm.cmmt.service;


import org.crm.cmmt.VO.CMMT210VO;
import org.crm.cmmt.VO.CMMT300VO;

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
public interface CMMT300Service {

	List<CMMT300VO> CMMT300SEL01(CMMT300VO vo) throws Exception;
	
	CMMT210VO CMMT300SEL05(CMMT210VO vo) throws Exception;

	List<CMMT300VO> CMMT300SEL06(CMMT210VO vo) throws Exception;

	CMMT210VO CMMT300INS01(CMMT210VO vo) throws Exception;

	CMMT210VO CMMT300UPT01(CMMT210VO vo) throws Exception;
	
	int CMMT300UPT02(CMMT210VO vo) throws Exception;

}
