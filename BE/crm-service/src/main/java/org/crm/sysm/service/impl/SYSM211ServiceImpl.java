package org.crm.sysm.service.impl;

import org.crm.sysm.VO.SYSM211VO;
import org.crm.sysm.service.SYSM211Service;
import org.crm.sysm.service.dao.SYSMCommDAO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/***********************************************************************************************
* Program Name : 사용자찾기 팝업 ServiceImpl
* Creator      : sukim
* Create Date  : 2022.04.15
* Description  : 사용자찾기 팝업
* Modify Desc  :
* -----------------------------------------------------------------------------------------------
* Date         | Updater        | Remark
* -----------------------------------------------------------------------------------------------
* 2022.04.15     sukim           최초생성
************************************************************************************************/
@Service("SYSM211Service")
public class SYSM211ServiceImpl implements SYSM211Service {
	@Resource(name="SYSMCommDAO")
	private SYSMCommDAO SYSM211DAO;
	
	public List<SYSM211VO> SYSM211SEL01(SYSM211VO vo) throws Exception {
		return SYSM211DAO.selectByList("SYSM211SEL01", vo);
	}
}
