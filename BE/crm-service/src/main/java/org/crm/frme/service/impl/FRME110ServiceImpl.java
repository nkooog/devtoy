package org.crm.frme.service.impl;

import org.crm.frme.VO.FRME110VO;
import org.crm.frme.service.FRME110Service;
import org.crm.frme.service.dao.FRMECommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : HelpDesk 팝업 ServiceImpl
* Creator      : 이민호
* Create Date  : 2022.03.11
* Description  : HelpDesk 팝업
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.03.11     이민호           최초생성
************************************************************************************************/
@Service("FRME110Service")
public class FRME110ServiceImpl implements FRME110Service {

	@Resource(name="FRMECommDAO")
	private FRMECommDAO dao;
	
	@Override
	public List<FRME110VO> FRME110SEL01(FRME110VO vo) throws Exception {
		return dao.selectByList("FRME110SEL01", vo);
	}
}
