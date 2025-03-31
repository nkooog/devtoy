package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM310VO;
import org.crm.sysm.service.SYSM310Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 그룹별 DataFrame 권한관리 ServiceImpl
* Creator      : jrlee
* Create Date  : 2022.06.23
* Description  : 그룹별 DataFrame 권한관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.06.23    jrlee           최초생성
************************************************************************************************/
@Service("SYSM310Service")
public class SYSM310ServiceImpl implements SYSM310Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO sysm310Mapper;

	@Override
	public List<SYSM310VO> SYSM310SEL01(SYSM310VO sysm310VO) throws Exception {
		return sysm310Mapper.selectByList("SYSM310SEL01", sysm310VO);
	}

	@Override
	public List<SYSM310VO> SYSM310SEL02(SYSM310VO sysm310VO) throws Exception {
		return sysm310Mapper.selectByList("SYSM310SEL02", sysm310VO);
	}

	@Override
	public List<SYSM310VO> SYSM310SEL03(SYSM310VO sysm310VO) throws Exception {
		return sysm310Mapper.selectByList("SYSM310SEL03", sysm310VO);
	}

	@Override
	public List<SYSM310VO> SYSM310SEL04(SYSM310VO sysm310VO) throws Exception {
		return sysm310Mapper.selectByList("SYSM310SEL04", sysm310VO);
	}

	@Override
	public Integer SYSM310INS01(List<SYSM310VO> list) throws Exception {
		return sysm310Mapper.sqlInsert("SYSM310INS01", list);
	}

	@Override
	public Integer SYSM310INS02(List<SYSM310VO> list) throws Exception {
		return sysm310Mapper.sqlInsert("SYSM310INS02", list);
	}

	@Override
	public Integer SYSM310DEL01(SYSM310VO sysm310VO) throws Exception {
		return sysm310Mapper.sqlDelete("SYSM310DEL01", sysm310VO);
	}

	@Override
	public Integer SYSM310DEL02(List<SYSM310VO> list) throws Exception {
		return sysm310Mapper.sqlDelete("SYSM310DEL02", list);
	}

	@Override
	public Integer SYSM310DEL03(SYSM310VO sysm310VO) throws Exception {
		return sysm310Mapper.sqlDelete("SYSM310DEL03", sysm310VO);
	}

	@Override
	public Integer SYSM310DEL04(List<SYSM310VO> list) throws Exception {
		return sysm310Mapper.sqlDelete("SYSM310DEL04", list);
	}
}
