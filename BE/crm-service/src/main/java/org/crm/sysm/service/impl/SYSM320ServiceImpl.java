package org.crm.sysm.service.impl;


import org.crm.sysm.VO.SYSM320VO;
import org.crm.sysm.service.SYSM320Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 데이터카드 레이아웃 관리 ServiceImpl
* Creator      : jrlee
* Create Date  : 2022.08.19
* Description  : 데이터카드 레이아웃 관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.08.19    jrlee           최초생성
************************************************************************************************/
@Service("SYSM320Service")
public class SYSM320ServiceImpl implements SYSM320Service {

	@Resource(name = "SYSMCommDAO")
	private SYSMCommDAO sysm320DAO;

	@Override
	public List<SYSM320VO> SYSM320SEL01(SYSM320VO sysm320VO) throws Exception {
		return sysm320DAO.selectByList("SYSM320SEL01", sysm320VO);
	}

	@Override
	public Integer SYSM320INS01(List<SYSM320VO> list) throws Exception {
		return sysm320DAO.sqlInsert("SYSM320INS01", list);
	}

	@Override
	public Integer SYSM320UPT01(List<SYSM320VO> list) throws Exception {
		return sysm320DAO.sqlUpdate("SYSM320UPT01", list);
	}

	@Override
	public Integer SYSM320DEL01(List<SYSM320VO> list) throws Exception {
		return sysm320DAO.sqlDelete("SYSM320DEL01", list);
	}
}
