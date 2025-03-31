package org.crm.sysm.service.impl;

import jakarta.annotation.Resource;
import org.apache.commons.lang.StringUtils;
import org.crm.sysm.VO.SYSM250VO;
import org.crm.sysm.service.SYSM250Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/***********************************************************************************************
* Program Name : 메뉴관리 ServiceImpl
* Creator      : jrlee
* Create Date  : 2022.02.10
* Description  : 메뉴관리
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.10     jrlee           최초생성
************************************************************************************************/
@Service("SYSM250Service")
public class SYSM250ServiceImpl implements SYSM250Service {

	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO sysm250Mapper;

	@Override
	public List<SYSM250VO> SYSM250SEL01(SYSM250VO sysm250VO) throws Exception {
		return sysm250Mapper.selectByList("SYSM250SEL01", sysm250VO);
	}
	@Override
	public List<SYSM250VO> SYSM250SEL03(SYSM250VO sysm250VO) throws Exception {
		List<SYSM250VO> menuList = sysm250Mapper.selectByList("SYSM250SEL01", sysm250VO);
		return menuList.stream().filter(x -> StringUtils.isNotEmpty(x.getMenuTypCd()) && Integer.valueOf(x.getPrsMenuLvl()) == sysm250VO.getPrsMenuLvl() && String.valueOf(x.getHgrkMenuId()).equals(sysm250VO.getMenuId())).collect(Collectors.toList());
	}
	@Override
	public List<SYSM250VO> SYSM250SEL04(SYSM250VO sysm250VO) throws Exception {
		List<SYSM250VO> menuList = sysm250Mapper.selectByList("SYSM250SEL01", sysm250VO);
		return menuList.stream().filter(x -> x.getMenuId().equals(sysm250VO.getMenuId())).collect(Collectors.toList());
	}
	@Override
	public Integer SYSM250INS01(List<SYSM250VO> sysm250voList) throws Exception {
		return sysm250Mapper.sqlInsert("SYSM250INS01", sysm250voList);
	}
	@Override
	public Integer SYSM250UPT01(List<SYSM250VO> sysm250voList) throws Exception {
		return sysm250Mapper.sqlUpdate("SYSM250UPT01", sysm250voList);
	}
	@Override
	public Integer SYSM250UPT02(List<SYSM250VO> sysm250voList) throws Exception {
		return sysm250Mapper.sqlUpdate("SYSM250UPT02", sysm250voList);
	}
	@Override
	public Integer SYSM250DEL01(List<SYSM250VO> sysm250voList) throws Exception {
		sysm250Mapper.sqlDelete("SYSM250DEL02", sysm250voList);
		return sysm250Mapper.sqlDelete("SYSM250DEL01", sysm250voList);
	}
}
