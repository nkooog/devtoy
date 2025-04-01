package org.crm.frme.service.impl;

import org.crm.frme.service.FRME320Service;
import org.crm.frme.service.dao.FRMECommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.Map;

/***********************************************************************************************
* Program Name : 비밀번호 변경 팝업 ServiceImpl
* Creator      : nyh
* Create Date  : 2025.01.20
* Description  : 비밀번호 변경 팝업
* Modify Desc  : 
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2025.01.20     nyh           최초생성
************************************************************************************************/
@Service("FRME320Service")
public class FRME320ServiceImpl implements FRME320Service {
	
	@Resource(name="FRMECommDAO")
	private FRMECommDAO dao;

	@Override
	public int FRME320SEL01(Map<String, Object> map) throws Exception {
		return dao.selectByCount("FRME320SEL01",map);
	}
}
