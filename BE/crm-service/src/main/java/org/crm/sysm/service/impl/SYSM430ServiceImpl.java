package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM430VO;
import org.crm.sysm.service.SYSM430Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import java.util.List;

/***********************************************************************************************
* Program Name : SMS탬플릿관리 service.impl
* Creator      : 강동우
* Create Date  : 2022.04.28
* Description  : SMS탬플릿관리
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.28     강동우           최초생성
************************************************************************************************/
@Service("SYSM430Service")
public class SYSM430ServiceImpl implements SYSM430Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO dao;
	
	@Override
	public List<SYSM430VO> SYSM430SEL01(SYSM430VO vo) throws Exception {
		return dao.selectByList("SYSM430SEL01", vo);
	}
	
	@Override
	public List<SYSM430VO> SYSM430SEL02(SYSM430VO vo) throws Exception {
		return dao.selectByList("SYSM430SEL02", vo);
	}
	
	@Override
	public List<SYSM430VO> SYSM430SEL03(SYSM430VO vo) throws Exception {
		return dao.selectByList("SYSM430SEL03", vo);
	}	

	@Override
	public Integer SYSM430INS01(List<SYSM430VO> sysm430voList) throws Exception {
		return dao.sqlInsert("SYSM430INS01", sysm430voList);
	}
	
	@Override
	public Integer SYSM430INS02(List<SYSM430VO> sysm430voList) throws Exception {
		return dao.sqlInsert("SYSM430INS02", sysm430voList);
	}
	
	@Override
	public Integer SYSM430DEL01(List<SYSM430VO> sysm430voList) throws Exception {
		return dao.sqlDelete("SYSM430DEL01", sysm430voList);
	}
	
	@Override
	public Integer SYSM430DEL02(List<SYSM430VO> sysm430voList) throws Exception {
		return dao.sqlDelete("SYSM430DEL02", sysm430voList);
	}
	
	@Override
	public Integer SYSM430DEL03(List<SYSM430VO> sysm430voList) throws Exception {
		return dao.sqlDelete("SYSM430DEL03", sysm430voList);
	}

	@Override
	public List<SYSM430VO> SYSM430SEL04(SYSM430VO vo) throws Exception {
		return dao.selectByList("SYSM430SEL04", vo);
	}

	@Override
	public Integer SYSM430INS03(SYSM430VO vo) throws Exception {
		return dao.sqlInsert("SYSM430INS03", vo);
	}

	@Override
	public String SYSM430SEL05(SYSM430VO vo) throws Exception {
		return (String) dao.selectByOne("SYSM430SEL05", vo);
	}

	@Override
	public Integer SYSM430DEL04(SYSM430VO vo) throws Exception {
		return dao.sqlDelete("SYSM430DEL04", vo);
	}

	
}
