package org.crm.frme.service.impl;

import org.crm.frme.VO.FRME230VO;
import org.crm.frme.service.FRME230Service;
import org.crm.frme.service.dao.FRMECommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;


/**
 * @Class Name   : FRME230ServiceImpl.java
 * @Description  : 웹프레임 ARS 콜백 ServiceImpl
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
 */


@Service("FRME230Service")
public class FRME230ServiceImpl implements FRME230Service {

	@Resource(name="FRMECommDAO")
	private FRMECommDAO dao;
	
	@Override
	public List<FRME230VO> FRME230SEL01(FRME230VO vo) throws Exception {
		return dao.selectByList("FRME230SEL01", vo);
	}

	@Override
	public Integer FRME230UPT01(FRME230VO vo) throws Exception {
		return dao.sqlUpdate("FRME230UPT01", vo);
	}

	@Override
	public List<FRME230VO> FRME230SEL02(FRME230VO vo) throws Exception {
		return dao.selectByList("FRME230SEL02", vo);
	}
	
	@Override
	public List<FRME230VO> FRME230SEL03(FRME230VO vo) throws Exception {
		return dao.selectByList("FRME230SEL03", vo);
	}

	@Override
	public int FRME230UPT02(FRME230VO vo) throws Exception {
		return dao.sqlUpdate("FRME230UPT02", vo);
	}
	
	@Override
	public int FRME230UPT03(List<FRME230VO> vo) throws Exception {
		return dao.sqlUpdate("FRME230UPT03", vo);
	}
	
	@Override
	public int FRME230INS01(List<FRME230VO> vo) throws Exception {
		return dao.sqlInsert("FRME230INS01", vo);
	}

	@Override
	public int FRME230UPT04(List<FRME230VO> vo) throws Exception {
		return dao.sqlUpdate("FRME230UPT04", vo);
	}
}
