package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM400VO;
import org.crm.sysm.service.SYSM400Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 작업스케줄관리 ServiceImpl
* Creator      : sukim
* Create Date  : 2022.06.22
* Description  : 작업스케줄관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.22     sukim           최초생성
************************************************************************************************/
@Service("SYSM400Service")
public class SYSM400ServiceImpl implements SYSM400Service {

	@Resource(name = "SYSMCommDAO")
	private SYSMCommDAO sys400Dao;

	@Override
	public List<SYSM400VO> SYSM400SEL01(SYSM400VO sys400vo) throws Exception {
		return sys400Dao.selectByList("SYSM400SEL01", sys400vo);
	}
	
	@Override
	public int SYSM400SEL02(SYSM400VO sys400vo) throws Exception {
		return sys400Dao.selectByCount("SYSM400SEL02", sys400vo);
	}
	@Override
	public int SYSM400SEL03(SYSM400VO sys400vo) throws Exception {
		return sys400Dao.selectByCount("SYSM400SEL03", sys400vo);
	}

	@Override
	public int SYSM400INS01(SYSM400VO sys400vo) throws Exception {
		return sys400Dao.sqlInsert("SYSM400INS01", sys400vo);
	}

	@Override
	public int SYSM400DEL01(SYSM400VO sys400vo) throws Exception {
		return sys400Dao.sqlDelete("SYSM400DEL01", sys400vo);
	}
	
	@Override
	public int SYSM400DEL02(SYSM400VO sys400vo) throws Exception {
		return sys400Dao.sqlDelete("SYSM400DEL02", sys400vo);
	}
}
