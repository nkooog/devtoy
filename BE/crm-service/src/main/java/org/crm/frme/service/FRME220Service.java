package org.crm.frme.service;
import org.crm.frme.VO.FRME220VO;

import java.util.List;

/**
 * @Class Name   : FRME220Service.java
 * @Description  : My 컨텐츠 Service
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


public interface FRME220Service {
	
	List<FRME220VO> FRME220SEL01(FRME220VO vo) throws Exception;
	List<FRME220VO> FRME220SEL11(FRME220VO vo) throws Exception;

	Integer FRME220INS01(FRME220VO vo) throws Exception;

	Integer FRME220DEL01(FRME220VO vo) throws Exception;

	List<Integer> FRME220SEL02(FRME220VO vo) throws Exception;
	
}
