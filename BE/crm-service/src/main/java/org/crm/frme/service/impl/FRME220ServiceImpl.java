package org.crm.frme.service.impl;

import org.crm.frme.VO.FRME220VO;
import org.crm.frme.service.FRME220Service;
import org.crm.frme.service.dao.FRMECommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;


/**
 * @Class Name   : FRME220ServiceImpl.java
 * @Description  : My 컨텐츠 ServiceImpl
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


@Service("FRME220Service")
public class FRME220ServiceImpl implements FRME220Service {
	
	@Resource(name="FRMECommDAO")
	private FRMECommDAO FRME220DAO;
	
	@Override
	public List<FRME220VO> FRME220SEL01(FRME220VO vo) throws Exception {
		return FRME220DAO.selectByList("FRME220SEL01", vo);
	}

	@Override
	public List<FRME220VO> FRME220SEL11(FRME220VO vo) throws Exception {
		return FRME220DAO.selectByList("FRME220SEL11", vo);
	}

	@Override
	public Integer FRME220INS01(FRME220VO vo) throws Exception {
		return FRME220DAO.sqlInsert("FRME220INS01", vo);
	}

	@Override
	public Integer FRME220DEL01(FRME220VO vo) throws Exception {
		return FRME220DAO.sqlDelete("FRME220DEL01", vo);
	}

	@Override
	public List<Integer> FRME220SEL02(FRME220VO vo) throws Exception {
		return FRME220DAO.selectByList("FRME220SEL02", vo);
	}

	
}
