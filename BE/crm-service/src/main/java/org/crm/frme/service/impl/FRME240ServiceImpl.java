package org.crm.frme.service.impl;

import org.crm.frme.VO.FRME240VO;
import org.crm.frme.service.FRME240Service;
import org.crm.frme.service.dao.FRMECommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;


/**
 * @Class Name   : FRME240ServiceImpl.java
 * @Description  : 웹프레임 통화예약 콜백 ServiceImpl
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


@Service("FRME240Service")
public class FRME240ServiceImpl implements FRME240Service {

	@Resource(name="FRMECommDAO")
	private FRMECommDAO dao;
	
	@Override
	public List<FRME240VO> FRME240SEL01(FRME240VO vo) throws Exception {
		return dao.selectByList("FRME240SEL01",vo);
	}

	public List<FRME240VO> FRME240SEL02(FRME240VO vo) throws Exception {
		return dao.selectByList("FRME240SEL02", vo);
	}

	public int FRME240UPT01(FRME240VO vo) throws Exception {
		return dao.sqlUpdate("FRME240UPT01", vo);
	}
}
