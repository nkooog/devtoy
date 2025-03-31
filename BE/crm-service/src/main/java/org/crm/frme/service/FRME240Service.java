package org.crm.frme.service;

import org.crm.frme.VO.FRME240VO;

import java.util.List;

/**
 * @Class Name   : FRME240Service.java
 * @Description  : 웹프레임 통화예약 콜백 Service
 * @Modification 
 * @ -------------------------------------------------------------------------
 * @  수정일                  수정자              수정내용
 * @ -------------------------------------------------------------------------
 * @ 2022.03.03   김보영             최초생성
 * @ -------------------------------------------------------------------------
 * @author CRM Lab실 김보영 연구원
 * @since 2022. 03.03
 * @version 1.0
 * @see
 *
 *  Copyright (C) by BROADC&S All right reserved.
 */


public interface FRME240Service {
	
	List<FRME240VO> FRME240SEL01(FRME240VO vo) throws Exception;

	List<FRME240VO> FRME240SEL02(FRME240VO vo) throws Exception;

	int FRME240UPT01(FRME240VO vo) throws Exception;
	
}
