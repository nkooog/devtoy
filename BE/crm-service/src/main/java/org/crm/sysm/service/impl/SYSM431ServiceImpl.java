package org.crm.sysm.service.impl;

import java.util.List;

import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import org.crm.sysm.VO.SYSM431VO;
import org.crm.sysm.service.SYSM431Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
/***********************************************************************************************
* Program Name : 사용자 찾기 ServiceImpl
* Creator      : sukim
* Create Date  : 2022.04.15
* Description  : 사용자 찾기
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.15     sukim            최초생성
************************************************************************************************/
@Service("SYSM431Service")
public class SYSM431ServiceImpl implements SYSM431Service{
	
	@Resource(name = "SYSMCommDAO")
	private SYSMCommDAO sysm431DAO;
	
	@Override
	public List<SYSM431VO> SYSM431SEL01(SYSM431VO vo) throws Exception {
		return sysm431DAO.selectByList("SYSM431SEL01", vo);
	}	
}
