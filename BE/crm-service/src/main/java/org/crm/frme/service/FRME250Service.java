package org.crm.frme.service;

import org.crm.frme.VO.FRME250VO;

import java.util.List;

/**
 * @Class Name   : FRME250Service.java
 * @Description  : 웹프레임 업무이관 콜백 Service
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


public interface FRME250Service {
	
	List<FRME250VO> FRME250SEL01(FRME250VO vo) throws Exception;
	
}
