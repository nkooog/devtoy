package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM260VO;
import org.crm.sysm.service.SYSM260Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 그룹별 메뉴권한관리 ServiceImpl
* Creator      : jrlee
* Create Date  : 2022.04.06
* Description  : 그룹별 메뉴권한관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.06     jrlee           최초생성
************************************************************************************************/
@Service("SYSM260Service")
public class SYSM260ServiceImpl implements SYSM260Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO sysm260Mapper;

	@Override
	public List<SYSM260VO> SYSM260SEL01(SYSM260VO sysm260VO) throws Exception {
		return sysm260Mapper.selectByList("SYSM260SEL01", sysm260VO);
	}

	@Override
	public List<SYSM260VO> SYSM260SEL02(SYSM260VO sysm260VO) throws Exception {
		return sysm260Mapper.selectByList("SYSM260SEL02", sysm260VO);
	}

	@Override
	public Integer SYSM260INS01(List<SYSM260VO> list) throws Exception {
		return sysm260Mapper.sqlInsert("SYSM260INS01", list);
	}

	@Override
	public Integer SYSM260DEL01(SYSM260VO sysm260VO) throws Exception {
		return sysm260Mapper.sqlDelete("SYSM260DEL01", sysm260VO);
	}

	@Override
	public Integer SYSM260DEL02(List<SYSM260VO> list) throws Exception {
		return sysm260Mapper.sqlDelete("SYSM260DEL02", list);
	}
}
