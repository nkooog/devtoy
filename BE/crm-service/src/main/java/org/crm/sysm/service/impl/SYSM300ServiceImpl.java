package org.crm.sysm.service.impl;


import org.crm.sysm.VO.SYSM300VO;
import org.crm.sysm.service.SYSM300Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 데이터프레임 관리 ServiceImpl
* Creator      : jrlee
* Create Date  : 2022.06.30
* Description  : 데이터프레임 관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.30    jrlee           최초생성
************************************************************************************************/
@Service("SYSM300Service")
public class SYSM300ServiceImpl implements SYSM300Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO sysm300DAO;

	@Override
	public List<SYSM300VO> SYSM300SEL01(SYSM300VO sysm300VO) throws Exception {
		return  sysm300DAO.selectByList("SYSM300SEL01", sysm300VO);
	}


	@Override
	public SYSM300VO SYSM300SEL02(SYSM300VO sysm300VO) throws Exception {
		return (SYSM300VO) sysm300DAO.selectByOne("SYSM300SEL02", sysm300VO);
	}

	@Override
	public List<SYSM300VO> SYSM300SEL03(SYSM300VO sysm300VO) throws Exception {
		return  sysm300DAO.selectByList("SYSM300SEL03", sysm300VO);
	}

	@Override
	public Integer SYSM300INS01(List<SYSM300VO> list) throws Exception {
		return sysm300DAO.sqlInsert("SYSM300INS01", list);
	}
	
	@Override
	public Integer SYSM300INS02(List<SYSM300VO> list) throws Exception {

		return sysm300DAO.sqlInsert("SYSM300INS02", list);
	}

	@Override
	public Integer SYSM300INS03(List<SYSM300VO> list) throws Exception {
		return sysm300DAO.sqlInsert("SYSM300INS03", list);
	}

	@Override
	public Integer SYSM300UPT01(List<SYSM300VO> list) throws Exception {

		return sysm300DAO.sqlUpdate("SYSM300UPT01", list);
	}

	@Override
	public Integer SYSM300UPT03(List<SYSM300VO> list) throws Exception {
		return sysm300DAO.sqlUpdate("SYSM300UPT03", list);
	}

	@Override
	public Integer SYSM300DEL01(List<SYSM300VO> list) throws Exception {
		return  sysm300DAO.sqlDelete("SYSM300DEL01",list);
	}
	
	@Override
	public Integer SYSM300DEL02(List<SYSM300VO> list) throws Exception {
		return  sysm300DAO.sqlDelete("SYSM300DEL02",list);
	}

	@Override
	public Integer SYSM300DEL03(List<SYSM300VO> list) throws Exception {
		return  sysm300DAO.sqlDelete("SYSM300DEL03",list);
	}
}
