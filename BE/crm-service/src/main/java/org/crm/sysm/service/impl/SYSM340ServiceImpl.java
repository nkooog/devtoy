package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM340VO;
import org.crm.sysm.service.SYSM340Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import java.util.List;

/***********************************************************************************************
* Program Name : 공통코드관리 ServiceImpl
* Creator      : jrlee
* Create Date  : 2022.05.02
* Description  : 공통코드관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.02     jrlee           최초생성
************************************************************************************************/
@Service("SYSM340Service")
public class SYSM340ServiceImpl implements SYSM340Service {

	@Resource(name = "SYSMCommDAO")
	private SYSMCommDAO sysm340Mapper;

	@Override
	public List<SYSM340VO> SYSM340SEL01(SYSM340VO sysm340VO) throws Exception {
		return sysm340Mapper.selectByList("SYSM340SEL01", sysm340VO);
	}

	@Override
	public List<SYSM340VO> SYSM340SEL02(SYSM340VO sysm340VO) throws Exception {
		return sysm340Mapper.selectByList("SYSM340SEL02", sysm340VO);
	}

	@Override
	public Integer SYSM340INS01(List<SYSM340VO> list) throws Exception {
		return sysm340Mapper.sqlInsert("SYSM340INS01", list);
	}

	@Override
	public Integer SYSM340UPT01(List<SYSM340VO> list) throws Exception {
		return sysm340Mapper.sqlUpdate("SYSM340UPT01", list);
	}

	@Override
	public Integer SYSM340DEL01(List<SYSM340VO> list) throws Exception {
		return sysm340Mapper.sqlDelete("SYSM340DEL01", list);

	}

	@Override
	public Integer SYSM340UPT02(List<SYSM340VO> list) throws Exception {
		return sysm340Mapper.sqlUpdate("SYSM340UPT02", list);
	}
}