package org.crm.frme.service.impl;

import org.crm.frme.VO.FRME290VO;
import org.crm.frme.service.FRME290Service;
import org.crm.frme.service.dao.FRMECommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 주업무전환 ServiceImpl
* Creator      : jrlee
* Create Date  : 2022.05.10
* Description  : 주업무전환 ServiceImpl
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.05.10     jrlee            최초생성
* 2024.12.02     박준영           egov->springboot mig
************************************************************************************************/
@Service("FRME290Service")
public class FRME290ServiceImpl implements FRME290Service {
	
	@Resource(name="FRMECommDAO")
	private FRMECommDAO dao;
	
	@Override
	public List<FRME290VO> FRME290SEL01(FRME290VO FRME290VO) throws Exception {
		return dao.selectByList("FRME290SEL01", FRME290VO);
	}

	@Override
	public Integer FRME290UPT01(FRME290VO frme290VO) throws Exception {
		Integer result = dao.sqlUpdate("FRME290UPT01", frme290VO);
		if (result <= 0) {
			throw new RuntimeException();
		}

		result = dao.sqlUpdate("FRME290UPT02", frme290VO);
		if (result <= 0) {
			throw new RuntimeException();
		}
		return result;
//		result = frme290Mapper.FRME290UPT03(frme290VO);
//		if (result <= 0) {
//			throw new RuntimeException();
//		}
	}

}
