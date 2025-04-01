package org.crm.frme.service.impl;

import org.crm.frme.VO.FRME300VO;
import org.crm.frme.service.FRME300Service;
import org.crm.frme.service.dao.FRMECommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 부가서비스 ServiceImpl
* Creator      : jrlee
* Create Date  : 2022.08.09
* Description  : 부가서비스 ServiceImpl
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.10     jrlee            최초생성
************************************************************************************************/
@Service("FRME300Service")
public class FRME300ServiceImpl implements FRME300Service {

	@Resource(name="FRMECommDAO")
	private FRMECommDAO dao;
	
	@Override
	public List<FRME300VO> FRME300SEL01(FRME300VO frme300VO) throws Exception {
		return dao.selectByList("FRME300SEL01", frme300VO);
	}
}
