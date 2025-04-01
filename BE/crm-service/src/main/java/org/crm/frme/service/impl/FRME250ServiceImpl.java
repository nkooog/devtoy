package org.crm.frme.service.impl;

import org.crm.frme.VO.FRME250VO;
import org.crm.frme.service.FRME250Service;
import org.crm.frme.service.dao.FRMECommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;


/**
 * @Class Name   : FRME250ServiceImpl.java
 * @Description  : 웹프레임 업무이관 콜백 ServiceImpl
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


@Service("FRME250Service")
public class FRME250ServiceImpl implements FRME250Service {

	@Resource(name="FRMECommDAO")
	private FRMECommDAO frme250DAO;
	
	@Override
	public List<FRME250VO> FRME250SEL01(FRME250VO vo) throws Exception {
		return frme250DAO.selectByList("FRME250SEL01", vo);
	}

	
}
