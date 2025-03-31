package org.crm.dash.service.impl;

import org.crm.dash.VO.DASH110VO;
import org.crm.dash.service.DASH110Service;
import org.crm.dash.service.dao.DASHCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 대시보드레이아웃관리 Serviceimpl
* Creator      : 강동우
* Create Date  : 2022.05.17
* Description  : 대시보드레이아웃관리 Serviceimpl
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.17     강동우           최초생성
************************************************************************************************/
@Service("DASH110Service")
public class DASH110ServiceImpl implements DASH110Service {

	@Resource(name="DASHCommDAO")
	private DASHCommDAO DASH110DAO;

	@Override
	public List<DASH110VO> DASH110SEL00(DASH110VO vo) throws Exception {
		return DASH110DAO.selectByList("DASH110SEL00", vo);
	}

	@Override
	public int DASH110UPT01(List<DASH110VO> list) throws Exception {
		DASH110DAO.sqlUpdate("DASH110UPT01", list);
		DASH110DAO.sqlUpdate("DASH110UPT02", list);
		return DASH110DAO.sqlUpdate("DASH110UPT03", list);
	}

	@Override
	public List<DASH110VO> DASH110SEL01(DASH110VO vo) throws Exception {
		return DASH110DAO.selectByList("DASH110SEL01", vo);
	}
	
	@Override
	public List<DASH110VO> DASH110SEL02(DASH110VO vo) throws Exception {
		return DASH110DAO.selectByList("DASH110SEL02",vo);
	}
	
	@Override
	public List<DASH110VO> DASH110SEL03(DASH110VO vo) throws Exception {
		return DASH110DAO.selectByList("DASH110SEL03",vo);
	}
	
	@Override
	public List<DASH110VO> DASH110SEL04(DASH110VO vo) throws Exception {
		return DASH110DAO.selectByList("DASH110SEL04", vo);
	}
	
	@Override
	public List<DASH110VO> DASH110SEL05(DASH110VO vo) throws Exception {
		return DASH110DAO.selectByList("DASH110SEL05",vo);
	}
	
	@Override
	public List<DASH110VO> DASH110SEL06(DASH110VO vo) throws Exception {
		return DASH110DAO.selectByList("DASH110SEL06", vo);
	}
	
	@Override
	public List<DASH110VO> DASH110SEL07(DASH110VO vo) throws Exception {
		return DASH110DAO.selectByList("DASH110SEL07", vo);
	}
	
	@Override
	public int DASH110INS01(List<DASH110VO> palette,List<DASH110VO> item,DASH110VO param) throws Exception {
		DASH110DAO.sqlDelete("DASH110pltReset", param);
		int rtn1 = DASH110DAO.sqlInsert("DASH110INS01", palette);
		int rtn2 = DASH110DAO.sqlInsert("DASH110INS02", item);
		return rtn1+rtn2;
	}
	
	@Override
	public int DASH110INS02(List<DASH110VO> list) throws Exception {
		return DASH110DAO.sqlInsert("DASH110INS02", list);
	}
	
	@Override
	public Integer DASH110INS03(List<DASH110VO> list) throws Exception {
		return DASH110DAO.sqlInsert("DASH110INS03", list);
	}
	
	@Override
	public Integer DASH110DEL01(List<DASH110VO> list) throws Exception {
		return DASH110DAO.sqlDelete("DASH110DEL01", list);
	}
	
	@Override
	public Integer DASH110DEL02(List<DASH110VO> list) throws Exception {
		return DASH110DAO.sqlDelete("DASH110DEL02", list);
	}

	@Override
	public List<DASH110VO> DASH110SEL08(DASH110VO vo) throws Exception {
		return DASH110DAO.selectByList("DASH110SEL08", vo);
	}

	@Override
	public List<DASH110VO> DASH110SEL09(DASH110VO vo) throws Exception {
		return DASH110DAO.selectByList("DASH110SEL09", vo);
	}
}
