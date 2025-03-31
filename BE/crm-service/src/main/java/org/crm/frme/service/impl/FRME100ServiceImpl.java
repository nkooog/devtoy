package org.crm.frme.service.impl;

import org.crm.frme.VO.FRME100VO;
import org.crm.frme.service.FRME100Service;
import org.crm.frme.service.dao.FRMECommDAO;
import org.crm.sysm.VO.SYSM310VO;
import org.crm.sysm.VO.SYSM500VO;
import io.micrometer.common.util.StringUtils;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/***********************************************************************************************
* Program Name : 프레임 ServiceImpl
* Creator      : jrlee
* Create Date  : 2022.02.10
* Description  : 프레임 ServiceImpl
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.02.10     jrlee            최초생성
************************************************************************************************/
@Service("FRME100Service")
public class FRME100ServiceImpl implements FRME100Service {

	@Resource(name="FRMECommDAO")
	private FRMECommDAO dao;
	
	@Override
	public List<FRME100VO> FRME100SEL01(FRME100VO frme100VO) throws Exception {
		List<FRME100VO> menuList = dao.selectByList("FRME100SEL01", frme100VO);
		return menuList.stream().filter(x -> StringUtils.isNotEmpty(x.getMenuTypCd())).collect(Collectors.toList());
	}

	@Override
	public List<SYSM500VO> FRME100SEL02(SYSM500VO sysm500VO) throws Exception {
		return dao.selectByList("FRME100SEL02", sysm500VO);
	}

	@Override
	public List<SYSM310VO> FRME100SEL03(SYSM310VO sysm310VO) throws Exception {
		return dao.selectByList("FRME100SEL03",sysm310VO);
	}
}
