package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM301VO;
import org.crm.sysm.service.SYSM301Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 데이터프레임 템플릿 레이아웃 편집 ServiceImpl
* Creator      : jrlee
* Create Date  : 2022.08.10
* Description  : 데이터프레임 템플릿 레이아웃 편집
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.08.10    jrlee           최초생성
************************************************************************************************/
@Service("SYSM301Service")
public class SYSM301ServiceImpl implements SYSM301Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO sysm301DAO;

	@Override
	public SYSM301VO SYSM301SEL01(SYSM301VO SYSM301VO) throws Exception {

		return (SYSM301VO) sysm301DAO.selectByOne("SYSM301SEL01", SYSM301VO);
	}

	@Override
	public List<SYSM301VO> SYSM301SEL02(SYSM301VO SYSM301VO) throws Exception {
		return sysm301DAO.selectByList("SYSM301SEL02", SYSM301VO);
	}

	@Override
	public List<SYSM301VO> SYSM301SEL03(SYSM301VO SYSM301VO) throws Exception {
		return sysm301DAO.selectByList("SYSM301SEL03", SYSM301VO);
	}

	@Override
	public Integer SYSM301INS01(List<SYSM301VO> list) throws Exception {
		return sysm301DAO.sqlInsert("SYSM301INS01", list);
	}

	@Override
	public Integer SYSM301INS02(List<SYSM301VO> list) throws Exception {
		return sysm301DAO.sqlInsert("SYSM301INS02", list);
	}

	@Override
	public Integer SYSM301INS03(List<SYSM301VO> list) throws Exception {
		return sysm301DAO.sqlInsert("SYSM301INS03", list);
	}

	@Override
	public Integer SYSM301DEL01(SYSM301VO sysm301VO) throws Exception {
		return sysm301DAO.sqlDelete("SYSM301DEL01", sysm301VO);
	}

	@Override
	public Integer SYSM301DEL02(SYSM301VO sysm301VO) throws Exception {
		return sysm301DAO.sqlDelete("SYSM301DEL02", sysm301VO);
	}

	@Override
	public Integer SYSM301DEL03(SYSM301VO sysm301VO) throws Exception {
		return sysm301DAO.sqlDelete("SYSM301DEL03", sysm301VO);
	}
}
