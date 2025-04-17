package org.crm.frme.service.impl;

import jakarta.annotation.Resource;
import org.crm.frme.model.vo.FRME160VO;
import org.crm.frme.service.FRME160Service;
import org.crm.frme.service.dao.FRMECommDAO;
import org.springframework.stereotype.Service;

/***********************************************************************************************
* Program Name : 환경설정 ServiceImpl
* Creator      : jrlee
* Create Date  : 2022.04.21
* Description  : 환경설정 ServiceImpl
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.21     jrlee            최초생성
* 2024.12.02     박준영           egov->springboot mig
************************************************************************************************/
@Service("FRME160Service")
public class FRME160ServiceImpl implements FRME160Service {
	
	@Resource(name="FRMECommDAO")
	private FRMECommDAO dao;
	
	@Override
	public FRME160VO FRME160SEL01(FRME160VO frme160VO) throws Exception {
		return (FRME160VO) dao.selectByOne("FRME160SEL01", frme160VO);
	}

	@Override
	public Integer FRME160UPT01(FRME160VO frme160VO) throws Exception {
		return dao.sqlUpdate("FRME160UPT01", frme160VO);
	}
}
